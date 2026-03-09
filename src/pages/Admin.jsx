import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Admin = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [wallets, setWallets] = useState([]);
    const [deposits, setDeposits] = useState([]);
    const [withdrawals, setWithdrawals] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAdminData = async () => {
        try {
            const headers = { 'Authorization': `Bearer ${user.token}` };
            const usersRes = await fetch(`${import.meta.env.VITE_API_URL}/admin/users`, { headers });
            const walletsRes = await fetch(`${import.meta.env.VITE_API_URL}/wallets`);
            const depositsRes = await fetch(`${import.meta.env.VITE_API_URL}/admin/deposits`, { headers });
            const withdrawalsRes = await fetch(`${import.meta.env.VITE_API_URL}/admin/withdrawals`, { headers });
            
            if (usersRes.ok) setUsers(await usersRes.json());
            if (walletsRes.ok) setWallets(await walletsRes.json());
            if (depositsRes.ok) setDeposits(await depositsRes.json());
            if (withdrawalsRes.ok) setWithdrawals(await withdrawalsRes.json());
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

    const handleStatusUpdate = async (type, id, status) => {
        if (!window.confirm(`Are you sure you want to ${status} this ${type}?`)) return;
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/admin/${type}s/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ status })
            });
            fetchAdminData();
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdateRole = async (id, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        if (!window.confirm(`Change this user to ${newRole}?`)) return;

        try {
            await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${id}/role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ role: newRole })
            });
            fetchAdminData();
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="flex-center">Loading Admin Panel...</div>;

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '5rem' }}>
            <h1 style={{ marginBottom: '2rem' }}>Admin Control Panel</h1>

            <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                
                {/* Pending Deposits */}
                <div className="glass-panel" style={{ padding: '2rem', gridColumn: '1 / -1' }}>
                    <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>Pending Deposits</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {deposits.filter(d => d.status === 'pending').length === 0 && <div style={{color: 'var(--text-muted)'}}>No pending deposits.</div>}
                        {deposits.filter(d => d.status === 'pending').map(d => (
                            <div key={d.id} className="flex-between" style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                                <div>
                                    <div style={{ fontWeight: 600 }}>{d.users?.email}</div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{d.coin} - ${d.amount}</div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button className="btn-primary" style={{ padding: '0.5rem 1rem', background: 'var(--success)', fontSize: '0.75rem' }} onClick={() => handleStatusUpdate('deposit', d.id, 'approved')}>Approve</button>
                                    <button className="btn-outline" style={{ padding: '0.5rem 1rem', color: 'var(--danger)', fontSize: '0.75rem' }} onClick={() => handleStatusUpdate('deposit', d.id, 'rejected')}>Reject</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Users List */}
                <div className="glass-panel" style={{ padding: '2rem', gridColumn: '1 / -1' }}>
                    <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>Users Management</h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                    <th style={{ padding: '1rem' }}>Email</th>
                                    <th style={{ padding: '1rem' }}>Role</th>
                                    <th style={{ padding: '1rem' }}>Balance</th>
                                    <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '1rem', fontWeight: 500 }}>{u.email}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{ 
                                                padding: '0.25rem 0.5rem', 
                                                borderRadius: '4px', 
                                                fontSize: '0.75rem',
                                                background: u.role === 'admin' ? 'var(--primary-glow)' : 'rgba(255,255,255,0.1)',
                                                color: u.role === 'admin' ? 'var(--primary)' : 'white',
                                                border: `1px solid ${u.role === 'admin' ? 'var(--primary)' : 'transparent'}`
                                            }}>
                                                {u.role.toUpperCase()}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--success)' }}>${Number(u.balance).toFixed(2)}</td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                <button 
                                                    className="btn-outline" 
                                                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                                                    onClick={() => handleUpdateBalance(u.id, u.balance)}
                                                >
                                                    Edit Balance
                                                </button>
                                                <button 
                                                    className="btn-outline" 
                                                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', borderColor: 'var(--primary)', color: 'var(--primary)' }}
                                                    onClick={() => handleUpdateRole(u.id, u.role)}
                                                >
                                                    Set as {u.role === 'admin' ? 'User' : 'Admin'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Wallets List */}
                <div className="glass-panel" style={{ padding: '2rem', gridColumn: '1 / -1' }}>
                    <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>System Wallet Addresses</h3>
                    <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                        {wallets.map(w => (
                            <div key={w.id} style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div className="flex-between" style={{ marginBottom: '1rem' }}>
                                    <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.125rem' }}>{w.coin}</div>
                                    <button 
                                        className="btn-outline" 
                                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                                        onClick={() => handleUpdateWallet(w.coin, w.address)}
                                    >
                                        Edit Address
                                    </button>
                                </div>
                                <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', wordBreak: 'break-all', color: 'var(--text-muted)', lineHeight: '1.4' }}>
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
