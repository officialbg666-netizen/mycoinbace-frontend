import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Activity, Wallet, ChevronLeft, History, TrendingUp, Search } from 'lucide-react';

const Trading = () => {
    const { user, refreshProfile } = useAuth();
    const navigate = useNavigate();
    
    const [asset, setAsset] = useState(() => {
        const query = new URLSearchParams(window.location.search);
        return query.get('symbol') || 'BTC/USDT';
    });
    
    const [duration, setDuration] = useState(60);
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [activeTrade, setActiveTrade] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [currentPrice, setCurrentPrice] = useState(64250.00);
    const [showMarkets, setShowMarkets] = useState(false);

    const markets = [
        { symbol: 'BTC/USDT', tv: 'BINANCE:BTCUSDT' },
        { symbol: 'ETH/USDT', tv: 'BINANCE:ETHUSDT' },
        { symbol: 'SOL/USDT', tv: 'BINANCE:SOLUSDT' },
        { symbol: 'BNB/USDT', tv: 'BINANCE:BNBUSDT' },
        { symbol: 'XRP/USDT', tv: 'BINANCE:XRPUSDT' },
        { symbol: 'ADA/USDT', tv: 'BINANCE:ADAUSDT' },
        { symbol: 'GOLD', tv: 'OANDA:XAUUSD' },
        { symbol: 'EUR/USD', tv: 'FX:EURUSD' }
    ];

    const getTVSymbol = (sym) => {
        const m = markets.find(x => x.symbol === sym);
        return m ? m.tv : `BINANCE:${sym.replace('/', '')}`;
    };

    // Initialize TradingView Widget
    useEffect(() => {
        const scriptId = 'tradingview-widget-script';
        let script = document.getElementById(scriptId);
        
        const initWidget = () => {
            if (window.TradingView) {
                new window.TradingView.widget({
                    "width": "100%",
                    "height": 450,
                    "symbol": getTVSymbol(asset),
                    "interval": "1",
                    "timezone": "Etc/UTC",
                    "theme": "dark",
                    "style": "1",
                    "locale": "en",
                    "toolbar_bg": "#0b0e11",
                    "enable_publishing": false,
                    "hide_top_toolbar": false,
                    "hide_legend": false,
                    "save_image": false,
                    "container_id": "tradingview_chart",
                    "backgroundColor": "#0b0e11",
                    "gridColor": "rgba(42, 46, 57, 0.06)",
                    "withdateranges": true,
                    "hide_side_toolbar": false,
                    "allow_symbol_change": true,
                    "show_popup_button": true,
                    "popup_width": "1000",
                    "popup_height": "650",
                    "studies": [
                        "RSI@tv-basicstudies",
                        "MASimple@tv-basicstudies",
                        "MACD@tv-basicstudies"
                    ]
                });
            }
        };

        if (!script) {
            script = document.createElement('script');
            script.id = scriptId;
            script.src = 'https://s3.tradingview.com/tv.js';
            script.async = true;
            script.onload = initWidget;
            document.head.appendChild(script);
        } else {
            initWidget();
        }
    }, [asset]);

    // Trade Logic
    useEffect(() => {
        if (activeTrade && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearTimeout(timer);
        } else if (activeTrade && timeLeft === 0) {
            setMessage({ type: 'info', text: 'Contract Expired. Processing result...' });
            refreshProfile();
            setActiveTrade(null);
        }
    }, [activeTrade, timeLeft]);

    const handleTradeSubmit = async (type) => {
        if (!amount || amount <= 0 || amount > user.balance) {
            alert('Insufficient balance or invalid amount.');
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
                setMessage({ type: 'success', text: `Successful Order: ${type}` });
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

    const changeAsset = (newSym) => {
        setAsset(newSym);
        setShowMarkets(false);
        navigate(`/trade?symbol=${encodeURIComponent(newSym)}`, { replace: true });
    };

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '110px', background: 'var(--bg-dark)', minHeight: '100vh', color: 'var(--text-primary)' }}>
            {/* Header */}
            <header className="flex-between" style={{ padding: '0.75rem 1rem', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-light)', position: 'sticky', top: 0, zIndex: 100 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Link to="/dashboard" style={{ color: 'var(--text-primary)' }}><ChevronLeft /></Link>
                    <div 
                        onClick={() => setShowMarkets(!showMarkets)}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: 'var(--bg-surface-light)', padding: '4px 12px', borderRadius: '20px', border: '1px solid var(--border-light)' }}
                    >
                        <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{asset}</div>
                        <TrendingUp size={14} color="var(--success)" />
                    </div>
                </div>
                <Link to="/history" style={{ color: 'var(--primary)' }}><History size={22} /></Link>
            </header>

            {/* Market Selection Dropdown/Overlay */}
            {showMarkets && (
                <div style={{ position: 'fixed', top: '50px', left: 0, right: 0, background: 'var(--bg-surface)', borderBottom: '2px solid var(--primary)', zIndex: 99, padding: '1rem', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                        {markets.map(m => (
                            <button 
                                key={m.symbol}
                                onClick={() => changeAsset(m.symbol)}
                                style={{ 
                                    padding: '10px', 
                                    background: asset === m.symbol ? 'var(--primary)' : 'var(--bg-surface-light)',
                                    color: asset === m.symbol ? 'black' : 'var(--text-primary)',
                                    border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.8rem'
                                }}
                            >
                                {m.symbol}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* TradingView Chart Container */}
            <div id="tradingview_chart" style={{ width: '100%', height: '450px', background: '#0b0e11' }}>
                <div className="flex-center" style={{ height: '100%', color: 'var(--text-secondary)' }}>Loading Professional Chart...</div>
            </div>

            {/* Trading Panel */}
            <div style={{ padding: '1rem' }}>
                <div className="glass-panel" style={{ padding: '1.5rem', background: 'var(--bg-surface)', border: '1px solid var(--border-light)' }}>
                    <div className="flex-between" style={{ marginBottom: '1rem' }}>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Account Balance</span>
                        <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1rem' }}>${Number(user?.balance || 0).toFixed(2)} USDT</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '1.5rem' }}>
                        {[60, 180, 300].map(d => (
                            <button 
                                key={d}
                                onClick={() => setDuration(d)}
                                style={{ 
                                    padding: '0.75rem', borderRadius: '10px', 
                                    background: duration === d ? 'var(--primary)' : 'var(--bg-surface-light)',
                                    color: duration === d ? 'black' : 'var(--text-primary)',
                                    fontWeight: 800, border: 'none', fontSize: '0.85rem'
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
                            placeholder="Order Amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            style={{ textAlign: 'center', fontSize: '1.2rem', fontWeight: 800, background: 'var(--bg-dark)', border: '1px solid var(--border-light)' }}
                        />
                    </div>

                    {activeTrade ? (
                        <div style={{ textAlign: 'center', padding: '1.5rem', borderRadius: '12px', background: 'var(--bg-surface-light)', border: '1px solid var(--primary)' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 800, marginBottom: '5px' }}>LIVE CONTRACT ACTIVE</div>
                            <div style={{ fontSize: '2.2rem', fontWeight: 900 }}>
                                {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <button onClick={() => handleTradeSubmit('BUY UP')} className="btn-primary" style={{ background: 'var(--success)', color: 'white', padding: '1rem', borderRadius: '10px', fontWeight: 900 }}>BUY UP</button>
                            <button onClick={() => handleTradeSubmit('BUY DOWN')} className="btn-primary" style={{ background: 'var(--danger)', color: 'white', padding: '1rem', borderRadius: '10px', fontWeight: 900 }}>BUY DOWN</button>
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
