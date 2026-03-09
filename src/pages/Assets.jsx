import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { ChevronLeft, Wallet, ArrowUpCircle, ArrowDownCircle, History } from 'lucide-react';

const WALLETS = [
    { coin: 'USDT', name: 'Tether', icon: 'U' },
    { coin: 'BTC', name: 'Bitcoin', icon: 'B' },
    { coin: 'ETH', name: 'Ethereum', icon: 'E' },
    { coin: 'BNB', name: 'Binance Coin', icon: 'BNB' },
    { coin: 'SOL', name: 'Solana', icon: 'S' },
    { coin: 'LTC', name: 'Litecoin', icon: 'L' }
];

const Assets = () => {
    const { user } = useAuth();
    const [wallets, setWallets] = useState([]);

    useEffect(() => {
        // Mock individual wallet balances based on total balance
        const baseBalance = Number(user?.balance || 0);
        const data = WALLETS.map((w, i) => ({
            ...w,
            balance: i === 0 ? baseBalance * 0.8 : baseBalance * 0.05 // Mostly USDT for demo
        }));
        setWallets(data);
    }, [user?.balance]);

    return (
        <div className="animate-fade-in" style={{ padding: '0 1rem 5rem 1rem' }}>
            <header style={{ padding: '1rem 0', display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                <Link to="/dashboard" style={{ color: 'var(--text-primary)', marginRight: '1rem' }}><ChevronLeft /></Link>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>My Assets</h1>
            </header>

            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', marginBottom: '2rem', background: 'linear-gradient(135deg, var(--primary-glow), transparent)' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}>Total Balance (USD)</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '1.5rem' }}>
                    ${Number(user?.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                    <Link to="/deposit" className="flex-center" style={{ flexDirection: 'column', gap: '8px', textDecoration: 'none', color: 'white' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                            <ArrowUpCircle size={22} />
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Deposit</span>
                    </Link>
                    <Link to="/withdraw" className="flex-center" style={{ flexDirection: 'column', gap: '8px', textDecoration: 'none', color: 'white' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
                            <ArrowDownCircle size={22} />
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Withdraw</span>
                    </Link>
                    <Link to="/history" className="flex-center" style={{ flexDirection: 'column', gap: '8px', textDecoration: 'none', color: 'white' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(14, 165, 233, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0ea5e9' }}>
                            <History size={22} />
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>History</span>
                    </Link>
                </div>
            </div>

            <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 700 }}>Wallet Details</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {wallets.map(w => (
                    <div key={w.coin} className="glass-panel" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--bg-surface-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 800 }}>
                                {w.icon}
                            </div>
                            <div>
                                <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>{w.coin} Wallet</div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{w.name} Network</div>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>{w.balance.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>≈ ${(w.balance).toLocaleString()}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Assets;
