import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Auth = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { login, register, user } = useAuth();
    
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) navigate('/dashboard');
    }, [user, navigate]);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        if (queryParams.get('mode') === 'register') {
            setIsRegister(true);
        }
    }, [location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (isRegister) {
                await register(email, password);
                navigate('/dashboard');
            } else {
                await login(email, password);
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-center animate-fade-in" style={{ padding: '0 1rem', minHeight: '90vh' }}>
            <div className="glass-panel" style={{ width: '100%', padding: '1.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2>{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                        {isRegister ? 'Join MyCoinBace today' : 'Login to access your dashboard'}
                    </p>
                </div>

                {error && (
                    <div style={{ 
                        padding: '1rem', 
                        backgroundColor: 'var(--danger-glow)', 
                        border: '1px solid var(--danger)', 
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--danger)',
                        marginBottom: '1.5rem',
                        fontSize: '0.875rem'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                            Email Address
                        </label>
                        <input 
                            type="email" 
                            className="input-base" 
                            placeholder="you@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                            Password
                        </label>
                        <input 
                            type="password" 
                            className="input-base" 
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                            minLength={6}
                        />
                    </div>

                        <button 
                        type="submit" 
                        className="btn-primary" 
                        disabled={loading} 
                        style={{ 
                            marginTop: '1rem', width: '100%', 
                            background: isRegister ? 'var(--primary)' : 'var(--primary)',
                            color: 'black',
                            border: 'none',
                            padding: '1.1rem',
                            fontWeight: 800,
                            borderRadius: '12px'
                        }}
                    >
                        {loading ? 'Processing...' : (isRegister ? 'Register' : 'Sign In')}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {isRegister ? (
                        <>Already have an account? <button type="button" onClick={() => setIsRegister(false)} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}>Sign in here</button></>
                    ) : (
                        <>Don't have an account? <button type="button" onClick={() => setIsRegister(true)} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}>Register here</button></>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Auth;
