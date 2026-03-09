import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, LineChart, Activity, Wallet, ChevronLeft, History, TrendingUp } from 'lucide-react';

const Trading = () => {
    const { user, refreshProfile } = useAuth();
    const [asset, setAsset] = useState('BTC/USDT');
    const [duration, setDuration] = useState(60);
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [activeTrade, setActiveTrade] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [currentPrice, setCurrentPrice] = useState(65230.50);
    const [priceHistory, setPriceHistory] = useState([]);

    // Live Price Simulation
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPrice(prev => {
                const change = (Math.random() * 20 - 10);
                const newPrice = prev + change;
                setPriceHistory(h => [...h.slice(-40), newPrice]);
                return newPrice;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Trade Logic
    useEffect(() => {
        if (activeTrade && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearTimeout(timer);
        } else if (activeTrade && timeLeft === 0) {
            setMessage({ type: 'info', text: 'Order Closed. Admin will resolve soon.' });
        }
    }, [activeTrade, timeLeft]);

    const handleTradeSubmit = async (type) => {
        if (!amount || amount <= 0 || amount > user.balance) {
            alert('Invalid amount or insufficient balance.');
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/trade`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ asset, amount: parseFloat(amount), duration })
            });

            if (res.ok) {
                const tradeData = await res.json();
                setActiveTrade(tradeData);
                setTimeLeft(duration);
                setMessage({ type: 'success', text: `Order Placed: ${type}` });
                setAmount('');
                await refreshProfile();
            } else {
                const err = await res.json();
                alert(err.error);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '110px', background: 'var(--bg-dark)', minHeight: '100vh' }}>
            {/* Header */}
            <header className="flex-between" style={{ padding: '0.75rem 1rem', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-light)' }}>
                <Link to="/dashboard" style={{ color: 'white' }}><ChevronLeft /></Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img 
                        src={`https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/${asset.split('/')[0].toLowerCase()}.png`} 
                        onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${asset.split('/')[0]}&background=random`; }}
                        alt={asset} 
                        style={{ width: '22px', height: '22px' }} 
                    />
                    <div style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '0.5px' }}>{asset}</div>
                </div>
                <Link to="/history" style={{ color: 'var(--primary)' }}><History size={22} /></Link>
            </header>

            {message && (
                <div style={{ 
                    padding: '10px 1rem', 
                    background: message.type === 'success' ? 'var(--success-bg)' : 'var(--bg-surface-light)',
                    color: message.type === 'success' ? 'var(--success)' : 'white',
                    fontSize: '0.8rem', textAlign: 'center', fontWeight: 700 
                }}>
                    {message.text}
                </div>
            )}

            {/* Price section */}
            <div style={{ padding: '2rem 1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase' }}>Current Market Price</div>
                <div style={{ fontSize: '2.8rem', fontWeight: 900, color: 'var(--success)', letterSpacing: '-1px' }}>
                    ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
            </div>

            {/* Chart Area */}
            <div style={{ height: '180px', padding: '0 1.5rem', display: 'flex', alignItems: 'flex-end', gap: '3px', marginBottom: '2rem' }}>
                {priceHistory.map((p, i) => {
                    const max = Math.max(...priceHistory);
                    const min = Math.min(...priceHistory);
                    const h = ((p - min) / (max - min)) * 100 || 50;
                    return (
                        <div key={i} style={{ 
                            flex: 1, 
                            height: `${h}%`, 
                            background: 'linear-gradient(to top, var(--primary), transparent)', 
                            opacity: 0.7,
                            borderRadius: '4px 4px 0 0'
                        }}></div>
                    );
                })}
            </div>

            {/* Trading Panel */}
            <div style={{ padding: '0 1rem' }}>
                <div className="glass-panel" style={{ padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="flex-between" style={{ marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                        <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Available Balance</span>
                        <span style={{ fontWeight: 800, color: 'var(--primary)' }}>${Number(user?.balance).toLocaleString(undefined, { minimumFractionDigits: 2 })} USDT</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '1.5rem' }}>
                        {[60, 180, 300].map(d => (
                            <button 
                                key={d}
                                onClick={() => setDuration(d)}
                                style={{ 
                                    padding: '0.75rem', 
                                    borderRadius: '10px', 
                                    background: duration === d ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                                    color: duration === d ? 'black' : 'white',
                                    fontWeight: 800,
                                    border: 'none',
                                    fontSize: '0.8rem',
                                    transition: '0.2s'
                                }}
                            >
                                {d}s
                            </button>
                        ))}
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <input 
                            className="input-base"
                            type="number"
                            placeholder="Amount (USDT)"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            style={{ textAlign: 'center', fontSize: '1.3rem', fontWeight: 900, background: 'rgba(255,255,255,0.02)', padding: '1.2rem' }}
                        />
                    </div>

                    {activeTrade ? (
                        <div style={{ textAlign: 'center', padding: '1.5rem', background: 'rgba(240, 185, 11, 0.05)', borderRadius: '12px', border: '1px solid rgba(240, 185, 11, 0.2)' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>Active Contract</div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white' }}>{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</div>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <button onClick={() => handleTradeSubmit('BUY UP')} className="btn-primary" style={{ background: 'var(--success)', color: 'white', padding: '1.1rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)' }}>BUY UP</button>
                            <button onClick={() => handleTradeSubmit('BUY DOWN')} className="btn-primary" style={{ background: 'var(--danger)', color: 'white', padding: '1.1rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)' }}>BUY DOWN</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Nav */}
            <nav className="bottom-nav">
                <Link to="/dashboard" className="nav-link">
                    <Home size={22} />
                    <span>Home</span>
                </Link>
                <Link to="/market" className="nav-link">
                    <TrendingUp size={22} />
                    <span>Market</span>
                </Link>
                <Link to="/trade" className="nav-link active">
                    <Activity size={22} />
                    <span>Trade</span>
                </Link>
                <Link to="/assets" className="nav-link">
                    <Wallet size={22} />
                    <span>Assets</span>
                </Link>
            </nav>
        </div>
    );
};

export default Trading;
