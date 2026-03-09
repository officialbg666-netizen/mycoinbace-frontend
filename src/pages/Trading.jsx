import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, LineChart, Activity, Wallet, ChevronLeft } from 'lucide-react';

const Trading = () => {
    const { user, refreshProfile } = useAuth();
    const [asset, setAsset] = useState('BTC/USDT');
    const [duration, setDuration] = useState(300);
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
            setMessage({ type: 'info', text: 'Trade Closed. Waiting for resolution...' });
        }
    }, [activeTrade, timeLeft]);

    const handleTradeSubmit = async (type) => {
        if (!amount || amount <= 0 || amount > user.balance) {
            setMessage({ type: 'error', text: 'Invalid amount.' });
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
                setMessage({ type: 'error', text: err.error });
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '100px', background: 'var(--bg-dark)', minHeight: '100vh' }}>
            {/* Header */}
            <div className="flex-between" style={{ padding: '1rem', background: 'var(--bg-surface)' }}>
                <Link to="/dashboard" style={{ color: 'white' }}><ChevronLeft /></Link>
                <div style={{ fontWeight: 800 }}>{asset}</div>
                <div style={{ width: '24px' }}></div>
            </div>

            {/* Price section */}
            <div style={{ padding: '1.5rem 1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--success)' }}>
                    ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
                <div style={{ color: 'var(--success)', fontSize: '0.9rem', fontWeight: 600 }}>+2.45% (24H)</div>
            </div>

            {/* Chart Area (Simplified Visualization) */}
            <div style={{ height: '220px', padding: '0 1rem', display: 'flex', alignItems: 'flex-end', gap: '2px' }}>
                {priceHistory.map((p, i) => {
                    const max = Math.max(...priceHistory);
                    const min = Math.min(...priceHistory);
                    const h = ((p - min) / (max - min)) * 100 || 50;
                    return (
                        <div key={i} style={{ 
                            flex: 1, 
                            height: `${h}%`, 
                            background: 'var(--primary)', 
                            opacity: 0.6,
                            borderRadius: '2px 2px 0 0'
                        }}></div>
                    );
                })}
            </div>

            {/* Trading Panel */}
            <div style={{ padding: '1.5rem 1rem' }}>
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div className="flex-between" style={{ marginBottom: '1rem', fontSize: '0.85rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Account Balance</span>
                        <span style={{ fontWeight: 700 }}>${Number(user?.balance).toFixed(2)}</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '1.5rem' }}>
                        {[300, 600, 1000].map(d => (
                            <button 
                                key={d}
                                onClick={() => setDuration(d)}
                                style={{ 
                                    padding: '0.6rem', 
                                    borderRadius: '8px', 
                                    background: duration === d ? 'var(--primary)' : 'var(--bg-surface-light)',
                                    color: duration === d ? 'black' : 'white',
                                    fontWeight: 700,
                                    border: 'none',
                                    fontSize: '0.8rem'
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
                            placeholder="Amount (USD)"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            style={{ textAlign: 'center', fontSize: '1.2rem', fontWeight: 800 }}
                        />
                    </div>

                    {activeTrade ? (
                        <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--bg-surface-light)', borderRadius: '12px' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Settlement in</div>
                            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>{timeLeft}s</div>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <button onClick={() => handleTradeSubmit('BUY UP')} className="btn-primary" style={{ background: 'var(--success)', color: 'white', padding: '1rem' }}>BUY UP</button>
                            <button onClick={() => handleTradeSubmit('BUY DOWN')} className="btn-primary" style={{ background: 'var(--danger)', color: 'white', padding: '1rem' }}>BUY DOWN</button>
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
                <Link to="/trading" className="nav-link active">
                    <LineChart size={22} />
                    <span>Market</span>
                </Link>
                <Link to="/trading" className="nav-link">
                    <Activity size={22} />
                    <span>Contract</span>
                </Link>
                <Link to="/dashboard" className="nav-link">
                    <Wallet size={22} />
                    <span>Assets</span>
                </Link>
            </nav>
        </div>
    );
};

export default Trading;
