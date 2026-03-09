import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async (session) => {
        if (!session) return;
        const token = session.access_token;
        try {
            const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const res = await fetch(`${apiBase}/user/profile`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const profile = await res.json();
                setUser({ ...session.user, ...profile, token });
            } else {
                setUser({ ...session.user, token });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            setUser({ ...session.user, token });
        }
    };

    useEffect(() => {
        // Initial session check
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) fetchProfile(session);
            else setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                fetchProfile(session).finally(() => setLoading(false));
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
    };

    const register = async (email, password) => {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        
        // Let backend know to create custom user profile
        if (data.session) {
             const token = data.session.access_token;
             const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
             await fetch(`${apiBase}/user/profile`, {
                 method: 'POST',
                 headers: { 'Authorization': `Bearer ${token}` }
             });
        }
    };

    const logout = async () => {
        await supabase.auth.signOut();
    };

    // Helper to refresh profile (e.g., after trade or deposit)
    const refreshProfile = async () => {
        const { data: { session } } = await supabase.auth.getSession();
         if (session) fetchProfile(session);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, refreshProfile }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
