import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

const ASSETS = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'BNB/USDT'];
const DURATIONS = [300, 600, 1000];

const FAKE_PAIRS = [
    { pair: 'BTC/USDT', price: '64,230.50', change: '+2.4%' },
    { pair: 'ETH/USDT', price: '3,450.20', change: '+1.8%' },
    { pair: 'SOL/USDT', price: '145.80', change: '-0.5%' },
    { pair: 'BNB/USDT', price: '590.10', change: '+0.2%' },
    { pair: 'XRP/USDT', price: '0.62', change: '+5.1%' },
    { pair: 'ADA/USDT', price: '0.45', change: '-1.2%' },
    { pair: 'DOGE/USDT', price: '0.15', change: '+8.4%' },
];

const generateInitialCandles = () => {
    let price = 50000;
    return Array.from({ length: 30 }).map((_, i) => {
        const open = price;
        const close = price + (Math.random() * 200 - 100);
        price = close;
        return { id: i, open, close, isUp: close >= open };
    });
};

const Trading = () => {
    const { user, refreshProfile } = useAuth();
    const [asset, setAsset] = useState(ASSETS[0]);
    const [duration, setDuration] = useState(300);
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [activeTrade, setActiveTrade] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);

    const [candles, setCandles] = useState(generateInitialCandles());
    const [currentPrice, setCurrentPrice] = useState(candles[candles.length - 1].close);

    // Fake market engine
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPrice(prev => {
                const change = (Math.random() * 100 - 50); // fake volatility
                const newPrice = prev + change;
                
                setCandles(currCandles => {
                    const lastCandle = currCandles[currCandles.length - 1];
                    const updatedCandle = { ...lastCandle, close: newPrice, isUp: newPrice >= lastCandle.open };
                    return [...currCandles.slice(0, -1), updatedCandle];
                });

                return newPrice;
            });
        }, 1000);

        // Every 5 seconds, start a new candle
        const newCandleInterval = setInterval(() => {
            setCandles(currCandles => {
                const lastClose = currCandles[currCandles.length - 1].close;
                const newCandles = [...currCandles, { id: Date.now(), open: lastClose, close: lastClose, isUp: true }];
                if (newCandles.length > 30) newCandles.shift();
                return newCandles;
            });
        }, 5000);

        return () => { clearInterval(interval); clearInterval(newCandleInterval); };
    }, []);

    // Trade tracking
    useEffect(() => {
        if (activeTrade && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearTimeout(timer);
        } else if (activeTrade && timeLeft === 0) {
            // Once timer hits zero, we wait for the Admin to manually resolve it
            setMessage({ type: 'info', text: 'Trade ended. Waiting for system resolution...' });
        }
    }, [activeTrade, timeLeft]);

    // Polling effect to check for Admin resolution
    useEffect(() => {
        let pollInterval;
        if (activeTrade && timeLeft === 0) {
            pollInterval = setInterval(async () => {
                try {
                    const res = await fetch(`${import.meta.env.VITE_API_URL}/user/profile`, {
                        headers: { 'Authorization': `Bearer ${user.token}` }
                    });
                    if (res.ok) {
                        const profile = await res.json();
                        // Check if the balance changed or we can fetch trades
                        // For simplicity, we just check if activeTrade is still pending in the DB
                        // But easier to just refresh profile and let the user see the result
                        await refreshProfile();
                        // If balance changed or message was success, we can clear this
                    }
                } catch (err) {}
            }, 5000);
        }
        return () => clearInterval(pollInterval);
    }, [activeTrade, timeLeft]);

    const resolveTrade = async (tradeId) => {
        // Handled by Admin manually now
    };

    const handleTradeSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);

        if (amount <= 0 || amount > user.balance) {
            setMessage({ type: 'error', text: 'Invalid amount or insufficient balance' });
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
                setMessage({ type: 'success', text: 'Trade opened successfully!' });
                setAmount('');
                await refreshProfile();
            } else {
                const err = await res.json();
                setMessage({ type: 'error', text: err.error || 'Trade failed' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    // Calculate chart height bounds
    const maxPrice = Math.max(...candles.map(c => Math.max(c.open, c.close)));
    const minPrice = Math.min(...candles.map(c => Math.min(c.open, c.close)));
    const priceRange = maxPrice - minPrice || 1;

    return (
        <div className="animate-fade-in trading-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '2rem', height: 'calc(100vh - 120px)' }}>
            
            {/* Chart Area */}
            <div className="glass-panel trading-chart" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div className="flex-between" style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                         <select 
                            className="input-base" 
                            style={{ width: 'auto', background: 'transparent', border: 'none', fontSize: '1.25rem', fontWeight: 600, padding: 0 }}
                            value={asset}
                            onChange={(e) => setAsset(e.target.value)}
                         >
                            {ASSETS.map(a => <option key={a} value={a} style={{background: 'var(--bg-dark)'}}>{a}</option>)}
                         </select>
                         <div style={{
                             color: candles[candles.length-1].isUp ? 'var(--success)' : 'var(--danger)',
                             fontSize: '1.5rem', fontWeight: 700,
                             textShadow: candles[candles.length-1].isUp ? '0 0 10px var(--success-glow)' : '0 0 10px var(--danger-glow)'
                         }}>
                             ${currentPrice.toFixed(2)}
                         </div>
                    </div>
                </div>

                {/* Stock Ticker Area for Chart */}
                <div style={{ overflow: 'hidden', padding: '0.5rem 0', background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid var(--border)', position: 'relative' }}>
                    <div style={{ display: 'flex', gap: '2rem', animation: 'scroll 30s linear infinite', width: 'max-content' }}>
                        {[...FAKE_PAIRS, ...FAKE_PAIRS, ...FAKE_PAIRS].map((coin, i) => (
                            <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <span style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.875rem' }}>{coin.pair}</span>
                                <span style={{ color: coin.change.startsWith('+') ? 'var(--success)' : 'var(--danger)', fontWeight: 600, fontSize: '0.875rem' }}>
                                    ${coin.price} ({coin.change})
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div style={{ flex: 1, padding: '2rem', display: 'flex', alignItems: 'flex-end', gap: '4px', position: 'relative' }}>
                    {/* Fake Candlesticks */}
                    {candles.map((candle, idx) => {
                        const top = Math.max(candle.open, candle.close);
                        const bottom = Math.min(candle.open, candle.close);
                        const heightPct = ((top - bottom) / priceRange) * 100;
                        const bottomPct = ((bottom - minPrice) / priceRange) * 100;

                        return (
                            <div key={candle.id} style={{
                                flex: 1,
                                height: '100%',
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-end'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    bottom: `${bottomPct}%`,
                                    width: '100%',
                                    height: `${Math.max(heightPct, 0.5)}%`,
                                    background: candle.isUp ? 'var(--success)' : 'var(--danger)',
                                    borderRadius: '2px',
                                    transition: 'all 0.3s ease-out'
                                }} />
                            </div>
                        );
                    })}

                    {/* Current Price Line */}
                    <div style={{
                        position: 'absolute',
                        left: 0, right: 0,
                        bottom: `${((currentPrice - minPrice) / priceRange) * 100}%`,
                        height: '1px',
                        borderTop: `1px dashed ${candles[candles.length-1].isUp ? 'var(--success)' : 'var(--danger)'}`,
                        transition: 'bottom 0.3s ease-out',
                        opacity: 0.5,
                        zIndex: 0
                    }} />
                </div>
            </div>

            {/* Trading Panel */}
            <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>Order Entry</h3>
                
                <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                    <span>Balance</span>
                    <span style={{color: 'white', fontWeight: 600}}>${Number(user?.balance || 0).toFixed(2)}</span>
                </div>

                {message && (
                    <div style={{ 
                        padding: '1rem', marginBottom: '1.5rem', borderRadius: '4px',
                        background: message.type === 'success' ? 'var(--success-glow)' : 'var(--danger-glow)',
                        color: message.type === 'success' ? 'var(--success)' : 'var(--danger)',
                        border: `1px solid ${message.type === 'success' ? 'var(--success)' : 'var(--danger)'}`
                    }}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleTradeSubmit} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Duration (Seconds)</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                            {DURATIONS.map(d => (
                                <button
                                    key={d}
                                    type="button"
                                    className="btn-outline"
                                    style={{
                                        padding: '0.5rem',
                                        background: duration === d ? 'rgba(255,255,255,0.1)' : 'transparent',
                                        borderColor: duration === d ? 'var(--primary)' : 'var(--border)'
                                    }}
                                    onClick={() => setDuration(d)}
                                >
                                    {d}s
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Amount</label>
                        <input 
                            type="number" 
                            step="any"
                            min="0"
                            required
                            className="input-base"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Amount to trade"
                            disabled={!!activeTrade}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
                        <button type="submit" className="btn-primary" style={{ flex: 1, background: 'var(--success)', pointerEvents: activeTrade ? 'none' : 'auto', opacity: activeTrade ? 0.5 : 1 }}>
                            BUY UP
                        </button>
                        <button type="submit" className="btn-primary" style={{ flex: 1, background: 'var(--danger)', pointerEvents: activeTrade ? 'none' : 'auto', opacity: activeTrade ? 0.5 : 1 }}>
                            BUY DOWN
                        </button>
                    </div>
                </form>

                {/* Active Trade Timer */}
                {activeTrade && (
                    <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Trade in progress</div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 700, fontFamily: 'monospace', color: 'var(--primary)' }}>
                            {timeLeft}s
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Amount: ${activeTrade.amount}</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Trading;
