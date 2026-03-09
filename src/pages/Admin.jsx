import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Admin = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [wallets, setWallets] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAdminData = async () => {
        try {
            const usersRes = await fetch(`${import.meta.env.VITE_API_URL}/admin/users`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const walletsRes = await fetch(`${import.meta.env.VITE_API_URL}/wallets`);
            
            if (usersRes.ok) setUsers(await usersRes.json());
            if (walletsRes.ok) setWallets(await walletsRes.json());
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdminData();
    }, []);

    const handleUpdateBalance = async (id, currentBalance) => {
        const newBalance = prompt('Enter new balance for user:', currentBalance);
        if (newBalance === null || isNaN(newBalance)) return;

        try {
            await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${id}/balance`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ balance: parseFloat(newBalance) })
            });
            fetchAdminData();
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdateWallet = async (coin, currentAddress) => {
        const newAddress = prompt(`Enter new address for ${coin}:`, currentAddress);
        if (!newAddress) return;

        try {
            await fetch(`${import.meta.env.VITE_API_URL}/admin/wallets/${coin}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ address: newAddress })
            });
            fetchAdminData();
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="flex-center">Loading Admin Panel...</div>;

    return (
        <div className="animate-fade-in">
            <h1 style={{ marginBottom: '2rem' }}>Admin Control Panel</h1>

            <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* Users List */}
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>User Management</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {users.map(u => (
                            <div key={u.id} style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }} className="flex-between">
                                <div>
                                    <div style={{ fontWeight: 600 }}>{u.email}</div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Role: {u.role}</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ fontWeight: 700, color: 'var(--success)' }}>${Number(u.balance).toFixed(2)}</div>
                                    <button 
                                        className="btn-outline" 
                                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                                        onClick={() => handleUpdateBalance(u.id, u.balance)}
                                    >
                                        Edit
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Wallets List */}
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>Deposit Wallets</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {wallets.map(w => (
                            <div key={w.id} style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                                <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                                    <div style={{ fontWeight: 600, color: 'var(--primary)' }}>{w.coin}</div>
                                    <button 
                                        className="btn-outline" 
                                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                                        onClick={() => handleUpdateWallet(w.coin, w.address)}
                                    >
                                        Edit
                                    </button>
                                </div>
                                <div style={{ fontFamily: 'monospace', fontSize: '0.875rem', wordBreak: 'break-all', color: 'var(--text-muted)' }}>
                                    {w.address}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;
