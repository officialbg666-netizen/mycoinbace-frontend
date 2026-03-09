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

    return (
        <div className="animate-fade-in" style={{ background: 'var(--bg-dark)', minHeight: '100vh' }}>
            {/* Hero Section */}
            <section style={{ textAlign: 'center', padding: '3rem 1rem 2rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                    display: 'inline-block', padding: '0.4rem 1rem', 
                    background: 'var(--primary-glow)', color: 'var(--primary)',
                    borderRadius: '2rem', fontSize: '0.7rem', fontWeight: 700, marginBottom: '1.5rem',
                    border: '1px solid var(--primary)'
                }}>
                    ZERO FEE TRADING ENABLED 🚀
                </div>
                
                <h1 style={{ fontSize: '2.5rem', lineHeight: '1.2', fontWeight: 800, marginBottom: '1rem', width: '100%' }}>
                    World Leading <br/>
                    <span style={{ color: 'var(--primary)' }}>
                        Crypto Exchange
                    </span>
                </h1>
                
                <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', width: '100%', lineHeight: '1.5' }}>
                    Join 2M+ users worldwide. Buy, sell, and trade over 200+ cryptocurrencies with premium liquidity.
                </p>

                <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
                    {user ? (
                        <Link to="/dashboard" className="btn-primary" style={{ flex: 1, padding: '1.1rem' }}>
                            Go to Console
                        </Link>
                    ) : (
                        <>
                            <Link to="/auth" style={{ flex: 1, padding: '1.1rem', background: 'var(--primary)', color: 'black', borderRadius: '8px', fontWeight: 700, textAlign: 'center', textDecoration: 'none' }}>
                                Sign In
                            </Link>
                            <Link to="/auth?mode=register" style={{ flex: 1, padding: '1.1rem', background: '#5d5fef', borderRadius: '8px', fontWeight: 700, textAlign: 'center', textDecoration: 'none', color: 'white' }}>
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </section>

            {/* Quick Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', padding: '0 1rem', marginBottom: '3rem' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>$1.2B+</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>24H VOLUME</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>200+</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>ASSETS</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>0.1%</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>LOW FEES</div>
                </div>
            </div>

            {/* Features Card */}
            <section style={{ padding: '0 1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'var(--success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         🏦
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Secure Storage</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>98% of assets stored offline.</p>
                    </div>
                </div>
                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         ⚡
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Instant Execute</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Millisecond latency matching.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Landing;
