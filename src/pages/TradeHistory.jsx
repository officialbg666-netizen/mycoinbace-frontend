import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { ChevronLeft, ClipboardList, CheckCircle, XCircle, Clock } from 'lucide-react';

const TradeHistory = () => {
    const { user } = useAuth();
    const [trades, setTrades] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/trades`, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setTrades(data.filter(t => t.user_id === user.id));
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchHistory();
    }, [user]);

    return (
        <div className="animate-fade-in" style={{ padding: '0 1rem 5rem 1rem' }}>
            <header style={{ padding: '1rem 0', display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                <Link to="/dashboard" style={{ color: 'white', marginRight: '1rem' }}><ChevronLeft /></Link>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Trade History</h1>
            </header>

            {loading ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading transactions...</div>
            ) : trades.length === 0 ? (
                <div className="glass-panel" style={{ padding: '3rem 1.5rem', textAlign: 'center', borderStyle: 'dashed', background: 'transparent' }}>
                    <div style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                        <ClipboardList size={48} strokeWidth={1.5} />
                    </div>
                    <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>No Trades Found</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>You haven't placed any trades yet. Start your trading journey in the market!</div>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {trades.map(t => (
                        <div key={t.id} className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ 
                                    width: '40px', height: '40px', borderRadius: '50%', 
                                    background: t.result === 'win' ? 'rgba(16, 185, 129, 0.1)' : t.result === 'loss' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(14, 165, 233, 0.1)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: t.result === 'win' ? 'var(--success)' : t.result === 'loss' ? 'var(--danger)' : 'var(--primary)'
                                }}>
                                    {t.result === 'win' ? <CheckCircle size={22} /> : t.result === 'loss' ? <XCircle size={22} /> : <Clock size={22} />}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{t.asset}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Duration: {t.duration}s</div>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: t.result === 'win' ? 'var(--success)' : t.result === 'loss' ? 'var(--danger)' : 'white' }}>
                                    {t.result === 'win' ? '+' : t.result === 'loss' ? '-' : ''}${t.amount.toFixed(2)}
                                </div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                                    {new Date(t.created_at).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TradeHistory;
