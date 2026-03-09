import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Admin = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [wallets, setWallets] = useState([]);
    const [deposits, setDeposits] = useState([]);
    const [trades, setTrades] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAdminData = async () => {
        try {
            const headers = { 'Authorization': `Bearer ${user.token}` };
            const usersRes = await fetch(`${import.meta.env.VITE_API_URL}/admin/users`, { headers });
            const walletsRes = await fetch(`${import.meta.env.VITE_API_URL}/wallets`);
            const depositsRes = await fetch(`${import.meta.env.VITE_API_URL}/admin/deposits`, { headers });
            const tradesRes = await fetch(`${import.meta.env.VITE_API_URL}/admin/trades`, { headers });
            
            if (usersRes.ok) setUsers(await usersRes.json());
            if (walletsRes.ok) setWallets(await walletsRes.json());
            if (depositsRes.ok) setDeposits(await depositsRes.json());
            if (tradesRes.ok) setTrades(await tradesRes.json());
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Auto-refresh every 5 seconds
    useEffect(() => {
        fetchAdminData();
        const interval = setInterval(fetchAdminData, 5000);
        return () => clearInterval(interval);
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

    const handleResolveTrade = async (id, result) => {
        if (!window.confirm(`Mark this trade as ${result.toUpperCase()}?`)) return;
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/admin/trades/${id}/resolve`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ result })
            });
            fetchAdminData();
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="flex-center">Loading Console...</div>;

    const pendingDeposits = deposits.filter(d => d.status === 'pending');
    const pendingTrades = trades.filter(t => t.result === 'pending');

    return (
        <div className="animate-fade-in" style={{ padding: '0 1rem 5rem 1rem' }}>
            <div className="flex-between" style={{ marginBottom: '3rem', alignItems: 'center' }}>
                <h1 style={{ fontSize: '2.5rem' }}>Management Console</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className="badge" style={{ background: pendingDeposits.length > 0 ? 'var(--danger)' : 'var(--success)' }}>
                        {pendingDeposits.length} New Deposits
                    </div>
                    <div className="badge" style={{ background: pendingTrades.length > 0 ? 'var(--primary)' : 'var(--success)' }}>
                        {pendingTrades.length} Active Trades
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                
                {/* Active Trades (Bets) */}
                <section className="glass-panel" style={{ padding: '2.5rem' }}>
                    <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.75rem' }}>
                        Live Trading Activity
                    </h2>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '1.1rem' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                                    <th style={{ padding: '1.5rem 1rem' }}>User</th>
                                    <th style={{ padding: '1.5rem 1rem' }}>Asset</th>
                                    <th style={{ padding: '1.5rem 1rem' }}>Amount</th>
                                    <th style={{ padding: '1.5rem 1rem' }}>Time</th>
                                    <th style={{ padding: '1.5rem 1rem', textAlign: 'right' }}>Resolution</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingTrades.length === 0 && (
                                    <tr><td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No active trades found.</td></tr>
                                )}
                                {pendingTrades.map(t => (
                                    <tr key={t.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '1.5rem 1rem' }}>{t.users?.email}</td>
                                        <td style={{ padding: '1.5rem 1rem', fontWeight: 700 }}>{t.asset}</td>
                                        <td style={{ padding: '1.5rem 1rem', color: 'var(--primary)', fontWeight: 700 }}>${t.amount}</td>
                                        <td style={{ padding: '1.5rem 1rem' }}>{t.duration}s</td>
                                        <td style={{ padding: '1.5rem 1rem', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                                                <button className="btn-primary" style={{ background: 'var(--success)', padding: '0.6rem 1.2rem' }} onClick={() => handleResolveTrade(t.id, 'win')}>WIN</button>
                                                <button className="btn-primary" style={{ background: 'var(--danger)', padding: '0.6rem 1.2rem' }} onClick={() => handleResolveTrade(t.id, 'loss')}>LOSS</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* New Deposits */}
                <section className="glass-panel" style={{ padding: '2.5rem' }}>
                    <h2 style={{ marginBottom: '2rem', fontSize: '1.75rem' }}>Deposit Requests</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {pendingDeposits.length === 0 && <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No pending deposits.</div>}
                        {pendingDeposits.map(d => (
                            <div key={d.id} className="flex-between" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>{d.users?.email}</div>
                                    <div style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>{d.coin} - ${d.amount}</div>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button className="btn-primary" style={{ background: 'var(--success)', minWidth: '120px' }} onClick={() => handleStatusUpdate('deposit', d.id, 'approved')}>Accept</button>
                                    <button className="btn-outline" style={{ color: 'var(--danger)', borderColor: 'var(--danger)', minWidth: '120px' }} onClick={() => handleStatusUpdate('deposit', d.id, 'rejected')}>Reject</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* User List */}
                <section className="glass-panel" style={{ padding: '2.5rem' }}>
                    <h2 style={{ marginBottom: '2rem', fontSize: '1.75rem' }}>User Directory</h2>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '1.1rem' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                                    <th style={{ padding: '1.5rem 1rem' }}>User Profile</th>
                                    <th style={{ padding: '1.5rem 1rem' }}>Current Balance</th>
                                    <th style={{ padding: '1.5rem 1rem', textAlign: 'right' }}>Management</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '1.5rem 1rem' }}>
                                            <div style={{ fontWeight: 600 }}>{u.email}</div>
                                            <div style={{ fontSize: '0.85rem', color: u.role === 'admin' ? 'var(--primary)' : 'var(--text-muted)' }}>{u.role.toUpperCase()}</div>
                                        </td>
                                        <td style={{ padding: '1.5rem 1rem', fontWeight: 800, fontSize: '1.3rem', color: 'var(--success)' }}>
                                            ${Number(u.balance || 0).toFixed(2)}
                                        </td>
                                        <td style={{ padding: '1.5rem 1rem', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                                                <button className="btn-outline" onClick={() => handleUpdateBalance(u.id, u.balance)}>Edit Balance</button>
                                                <button className="btn-outline" style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }} onClick={() => handleUpdateRole(u.id, u.role)}>
                                                    Make {u.role === 'admin' ? 'User' : 'Admin'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Wallets */}
                <section className="glass-panel" style={{ padding: '2.5rem' }}>
                    <h2 style={{ marginBottom: '2rem', fontSize: '1.75rem' }}>Payment Addresses</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {wallets.map(w => (
                            <div key={w.id} style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '15px' }}>
                                <div className="flex-between" style={{ marginBottom: '1rem' }}>
                                    <span style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--primary)' }}>{w.coin}</span>
                                    <button className="btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => handleUpdateWallet(w.coin, w.address)}>Change</button>
                                </div>
                                <div style={{ fontSize: '0.9rem', wordBreak: 'break-all', opacity: 0.7 }}>{w.address}</div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Admin;
