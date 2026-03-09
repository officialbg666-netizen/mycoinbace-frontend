import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wallet, ArrowDownRight, ArrowUpRight, Activity } from 'lucide-react';

const FAKE_PAIRS = [
    { pair: 'BTC/USDT', price: '64,230.50', change: '+2.4%' },
    { pair: 'ETH/USDT', price: '3,450.20', change: '+1.8%' },
    { pair: 'SOL/USDT', price: '145.80', change: '-0.5%' },
    { pair: 'BNB/USDT', price: '590.10', change: '+0.2%' },
    { pair: 'XRP/USDT', price: '0.62', change: '+5.1%' },
    { pair: 'ADA/USDT', price: '0.45', change: '-1.2%' },
    { pair: 'DOGE/USDT', price: '0.15', change: '+8.4%' },
];

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '2rem' }}>Dashboard</h1>

            {/* Scrolling Ticker on Dashboard */}
            <div style={{ margin: '0 0 3rem 0', overflow: 'hidden', padding: '1rem 0', position: 'relative' }}>
                <div style={{
                     position: 'absolute', top: 0, bottom: 0, left: 0, width: '50px',
                     background: 'linear-gradient(to right, var(--bg-darker), transparent)', zIndex: 1
                }}></div>
                <div style={{
                     position: 'absolute', top: 0, bottom: 0, right: 0, width: '50px',
                     background: 'linear-gradient(to left, var(--bg-darker), transparent)', zIndex: 1
                }}></div>
                
                <div style={{ display: 'flex', gap: '1.5rem', animation: 'scroll 20s linear infinite', width: 'max-content' }}>
                    {[...FAKE_PAIRS, ...FAKE_PAIRS, ...FAKE_PAIRS].map((coin, i) => (
                        <div key={i} className="glass-panel" style={{ padding: '0.75rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', minWidth: '150px' }}>
                            <div className="flex-between">
                                <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>{coin.pair}</span>
                                <span style={{ 
                                    color: coin.change.startsWith('+') ? 'var(--success)' : 'var(--danger)',
                                    fontWeight: 600, fontSize: '0.875rem',
                                    background: coin.change.startsWith('+') ? 'var(--success-glow)' : 'var(--danger-glow)',
                                    padding: '0.2rem 0.5rem', borderRadius: '4px'
                                }}>
                                    {coin.change}
                                </span>
                            </div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>${coin.price}</div>
                        </div>
                    ))}
                </div>
                <style>{`
                    @keyframes scroll {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-33.33%); }
                    }
                `}</style>
            </div>

            {/* Balance Overview */}
            <div className="glass-panel" style={{ padding: '3rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '3rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{
                     position: 'absolute', top: '-50%', left: '-10%', width: '300px', height: '300px',
                     background: 'var(--primary)', filter: 'blur(100px)', opacity: 0.2, borderRadius: '50%'
                }}/>
                <span style={{ color: 'var(--text-muted)', fontSize: '1.125rem', marginBottom: '0.5rem', fontWeight: 500 }}>Total Balance</span>
                <h2 style={{ fontSize: '4rem', fontWeight: 700, margin: '0 0 2rem 0', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
                    ${Number(user?.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h2>

                <div className="dashboard-actions" style={{ display: 'flex', gap: '1rem' }}>
                    <Link to="/deposit" className="btn-primary" style={{ padding: '1rem 2rem' }}>
                        <ArrowDownRight size={20} /> Deposit
                    </Link>
                    <Link to="/withdraw" className="btn-outline" style={{ padding: '1rem 2rem' }}>
                        <ArrowUpRight size={20} /> Withdraw
                    </Link>
                    <Link to="/trade" className="btn-primary" style={{ padding: '1rem 2rem', background: 'var(--success)' }}>
                        <Activity size={20} /> Trade Now
                    </Link>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                 {/* Quick Info */}
                 <div className="glass-panel" style={{ padding: '2rem' }}>
                     <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                         <Wallet size={20} color="var(--primary)" /> Account Details
                     </h3>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                         <div className="flex-between">
                             <span style={{ color: 'var(--text-muted)' }}>Email</span>
                             <span style={{ fontWeight: 500 }}>{user?.email}</span>
                         </div>
                         <div className="flex-between">
                             <span style={{ color: 'var(--text-muted)' }}>Account ID</span>
                             <span style={{ fontWeight: 500, fontFamily: 'monospace', fontSize: '0.875rem' }}>
                                 {user?.id?.substring(0, 12)}...
                             </span>
                         </div>
                         <div className="flex-between">
                             <span style={{ color: 'var(--text-muted)' }}>Status</span>
                             <span style={{ color: 'var(--success)', fontWeight: 600, background: 'var(--success-glow)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>VERIFIED</span>
                         </div>
                     </div>
                 </div>

                 <div className="glass-panel" style={{ padding: '2rem' }}>
                     <h3 style={{ marginBottom: '1.5rem' }}>Recent Activity</h3>
                     <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
                         No recent activity. Make a deposit or start trading!
                     </div>
                 </div>
            </div>
        </div>
    );
};

export default Dashboard;
