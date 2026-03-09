import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, Shield, Zap } from 'lucide-react';

const FAKE_PAIRS = [
    { pair: 'BTC/USDT', price: '64,230.50', change: '+2.4%' },
    { pair: 'ETH/USDT', price: '3,450.20', change: '+1.8%' },
    { pair: 'SOL/USDT', price: '145.80', change: '-0.5%' },
    { pair: 'BNB/USDT', price: '590.10', change: '+0.2%' },
    { pair: 'XRP/USDT', price: '0.62', change: '+5.1%' },
    { pair: 'ADA/USDT', price: '0.45', change: '-1.2%' },
    { pair: 'DOGE/USDT', price: '0.15', change: '+8.4%' },
];

const Landing = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Only logged-in users access dashboard, but if already logged in, redirecting them from landing might be optional. 
        // We'll let them look at the landing or click "Go to Dashboard".
    }, [user]);

    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <section style={{ textAlign: 'center', padding: '6rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                    display: 'inline-block', padding: '0.5rem 1rem', 
                    background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)',
                    borderRadius: '2rem', fontSize: '0.875rem', fontWeight: 600, marginBottom: '2rem',
                    border: '1px solid rgba(59, 130, 246, 0.2)'
                }}>
                    🚀 The Next Generation Crypto Trading Platform
                </div>
                
                <h1 className="hero-title" style={{ fontSize: '4rem', lineHeight: '1.1', marginBottom: '1.5rem', maxWidth: '800px' }}>
                    Trade Crypto with <br/>
                    <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Lightning Speed
                    </span>
                </h1>
                
                <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '3rem', maxWidth: '600px' }}>
                    Join MyCoinBace today to experience seamless trading, instant deposits, and bank-grade security.
                </p>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    {user ? (
                        <Link to="/dashboard" className="btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem' }}>
                            Go to Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link to="/auth" className="btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem' }}>
                                Get Started
                            </Link>
                            <Link to="/auth?mode=register" className="btn-outline" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem' }}>
                                Create Account
                            </Link>
                        </>
                    )}
                </div>
            </section>

            {/* Scrolling Ticker */}
            <section style={{ margin: '4rem 0', overflow: 'hidden', padding: '2rem 0', position: 'relative' }}>
                <div style={{
                     position: 'absolute', top: 0, bottom: 0, left: 0, width: '100px',
                     background: 'linear-gradient(to right, var(--bg-darker), transparent)', zIndex: 1
                }}></div>
                <div style={{
                     position: 'absolute', top: 0, bottom: 0, right: 0, width: '100px',
                     background: 'linear-gradient(to left, var(--bg-darker), transparent)', zIndex: 1
                }}></div>
                
                <div style={{ display: 'flex', gap: '2rem', animation: 'scroll 20s linear infinite', width: 'max-content' }}>
                    {[...FAKE_PAIRS, ...FAKE_PAIRS, ...FAKE_PAIRS].map((coin, i) => (
                        <div key={i} className="glass-panel" style={{ padding: '1rem 2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '200px' }}>
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
                            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>${coin.price}</div>
                        </div>
                    ))}
                </div>
                <style>{`
                    @keyframes scroll {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-33.33%); }
                    }
                `}</style>
            </section>

            {/* Features */}
            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', padding: '4rem 0' }}>
                <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
                    <div className="flex-center" style={{ width: '64px', height: '64px', background: 'var(--success-glow)', color: 'var(--success)', borderRadius: '50%', margin: '0 auto 1.5rem' }}>
                        <TrendingUp size={32} />
                    </div>
                    <h3 style={{ marginBottom: '1rem' }}>Simulated Trading</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Practice your trading strategies with our advanced 300s/600s/1000s duration trading terminal.</p>
                </div>
                <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
                    <div className="flex-center" style={{ width: '64px', height: '64px', background: 'rgba(59, 130, 246, 0.2)', color: 'var(--primary)', borderRadius: '50%', margin: '0 auto 1.5rem' }}>
                        <Shield size={32} />
                    </div>
                    <h3 style={{ marginBottom: '1rem' }}>Bank-grade Security</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Your assets are secure with modern encryption and architecture.</p>
                </div>
                <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
                    <div className="flex-center" style={{ width: '64px', height: '64px', background: 'rgba(139, 92, 246, 0.2)', color: 'var(--secondary)', borderRadius: '50%', margin: '0 auto 1.5rem' }}>
                        <Zap size={32} />
                    </div>
                    <h3 style={{ marginBottom: '1rem' }}>Instant execution</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Experience zero latency trades and instant deposit/withdrawal processing.</p>
                </div>
            </section>
        </div>
    );
};

export default Landing;
