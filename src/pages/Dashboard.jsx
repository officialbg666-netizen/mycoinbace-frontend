import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    Home, TrendingUp, Activity, Wallet, User, 
    Headphones, ChevronRight, Megaphone, List,
    ArrowUpCircle, ArrowDownCircle, Briefcase, Rocket
} from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();
    const [prices, setPrices] = useState({});
    const [prevPrices, setPrevPrices] = useState({});
    const [currentBanner, setCurrentBanner] = useState(0);

    const banners = [
        { id: 1, img: '/banner_welcome.png', title: 'WELCOME BONUS', subtitle: 'FOR NEW USERS' },
        { id: 2, img: '/banner_deposit.png', title: 'DEPOSIT AND GET', subtitle: 'TRADING REWARDS' }
    ];

    useEffect(() => {
        const timer = setInterval(() => setCurrentBanner(p => (p + 1) % banners.length), 5000);
        return () => clearInterval(timer);
    }, []);

    const COINS = [
        { symbol: 'BTC/USDT', name: 'Bitcoin', price: 67613.17, change: 0.60, icon: 'BTC' },
        { symbol: 'ETH/USDT', name: 'Ethereum', price: 1991.09, change: 2.46, icon: 'ETH' },
        { symbol: 'BCH/USDT', name: 'Bitcoin Cash', price: 448.57, change: 0.35, icon: 'BCH' },
        { symbol: 'EOS/USDT', name: 'EOS', price: 0.824, change: 0, icon: 'EOS' },
        { symbol: 'DOGE/USDT', name: 'Dogecoin', price: 0.0904, change: 1.90, icon: 'DOGE' },
        { symbol: 'LTC/USDT', name: 'Litecoin', price: 53.34, change: 1.21, icon: 'LTC' },
        { symbol: 'ETC/USDT', name: 'Ethereum Classic', price: 8.099, change: 1.03, icon: 'ETC' },
        { symbol: 'SOL/USDT', name: 'Solana', price: 145.20, change: -1.10, icon: 'SOL' }
    ];

    useEffect(() => {
        const initial = {};
        COINS.forEach(c => initial[c.symbol] = c);
        setPrices(initial);

        const interval = setInterval(() => {
            setPrices(prev => {
                const next = { ...prev };
                setPrevPrices(prev);
                Object.keys(next).forEach(k => {
                    const movement = (Math.random() * 0.0004 - 0.0002);
                    next[k] = {
                        ...next[k],
                        price: next[k].price * (1 + movement),
                        change: next[k].change + (movement * 10)
                    };
                });
                return next;
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const getIconUrl = (symbol) => `https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/${symbol.toLowerCase()}.png`;

    return (
        <div className="animate-fade-in" style={{ background: 'var(--bg-dark)', minHeight: '100vh', paddingBottom: '80px' }}>
            {/* Header: User Profile Area */}
            <header style={{ padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-surface)', borderBottom: '1px solid #f3f4f6' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={22} color="#9ca3af" />
                    </div>
                    {user ? (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1e2329' }}>{user.email.split('@')[0]}</span>
                            <span style={{ fontSize: '0.65rem', color: '#9ca3af', fontWeight: 600 }}>UID: {user.id.substring(0,8)}</span>
                        </div>
                    ) : (
                        <Link to="/auth" style={{ textDecoration: 'none', color: '#1e2329', fontSize: '0.9rem', fontWeight: 700 }}>Login / Register</Link>
                    )}
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ border: '1px solid #e5e7eb', borderRadius: '4px', padding: '4px 10px', fontSize: '0.75rem', fontWeight: 800, color: '#6b7280' }}>EN</div>
                </div>
            </header>

            {/* Banner Section */}
            <div style={{ padding: '0 1rem' }}>
                <div className="hero-carousel" style={{ height: '180px', background: 'white', border: '1px solid #eee' }}>
                    {banners.map((b, i) => (
                        <div key={b.id} className={`carousel-slide ${currentBanner === i ? 'active' : ''}`} style={{ 
                            backgroundImage: `url('${b.img}')`,
                            backgroundSize: 'cover',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            padding: '2rem',
                            height: '100%',
                            width: '100%',
                            backgroundPosition: 'center'
                        }}>
                        </div>
                    ))}
                </div>
            </div>

            {/* News Ticker */}
            <div style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg-dark)', color: '#4b5563', fontSize: '0.85rem' }}>
                <Megaphone size={16} />
                <div className="ticker-container" style={{ background: 'transparent', border: 'none', padding: 0, flex: 1 }}>
                    <div className="ticker-content" style={{ animationDuration: '40s' }}>
                        MyCoinBace: World Leading Secure Trading Hub - New Zero Fee Trading Enabled! - ETH 2.0 Staking Now Live.
                    </div>
                </div>
                <List size={18} />
            </div>

            {/* Ticker Grid (3 assets) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', padding: '1rem', gap: '10px' }}>
                {['BTC/USDT', 'BCH/USDT', 'ETH/USDT'].map(symbol => {
                    const data = prices[symbol] || { price: 0, change: 0 };
                    return (
                        <div key={symbol} style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 700 }}>{symbol}</div>
                            <div style={{ fontSize: '1rem', fontWeight: 800, color: data.change >= 0 ? 'var(--success)' : 'var(--danger)', margin: '4px 0' }}>
                                {data.price.toFixed(2)}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: data.change >= 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 700 }}>
                                {data.change >= 0 ? '+' : ''}{data.change.toFixed(2)}%
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Action Grid (Large Icons) */}
            <div style={{ 
                margin: '1rem', padding: '1.5rem', background: 'white', borderRadius: '24px 24px 0 0',
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', textAlign: 'center',
                boxShadow: '0 -10px 30px rgba(0,0,0,0.03)', border: '1px solid #f3f4f6'
            }}>
                <Link to="/deposit" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}><Rocket size={32} /></div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#4b5563' }}>Deposit</span>
                </Link>
                <Link to="/withdraw" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0ea5e9' }}><Briefcase size={32} /></div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#4b5563' }}>Withdraw</span>
                </Link>
                <Link to="/contact" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}><Headphones size={32} /></div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#4b5563' }}>Customer</span>
                </Link>
            </div>

            {/* Market Quotation List */}
            <div style={{ background: 'white', padding: '0 1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', padding: '0.5rem 0', fontSize: '0.75rem', color: '#9ca3af', fontWeight: 700 }}>
                    <span>Trading Pair</span>
                    <span style={{ textAlign: 'center' }}>Latest Price</span>
                    <span style={{ textAlign: 'right' }}>Change (%)</span>
                </div>

                {COINS.map(coin => {
                    const data = prices[coin.symbol] || coin;
                    const isUp = data.change >= 0;
                    return (
                        <Link key={coin.symbol} to="/trade" className="market-card" style={{ 
                            display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', alignItems: 'center', 
                            padding: '1.2rem 0', textDecoration: 'none', color: 'inherit', borderBottom: '1px solid #f3f4f6'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <img 
                                    src={getIconUrl(coin.icon)} 
                                    onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${coin.icon}&background=random`; }}
                                    alt={coin.icon} 
                                    style={{ width: '28px', height: '28px' }} 
                                />
                                <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>{coin.symbol}</div>
                            </div>
                            <div style={{ textAlign: 'center', fontSize: '0.95rem', fontWeight: 700, color: '#1e2329' }}>
                                {data.price.toFixed(coin.icon === 'DOGE' ? 4 : 2)}
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ 
                                    display: 'inline-block', padding: '6px 12px', borderRadius: '4px', 
                                    background: isUp ? 'var(--success)' : '#e5e7eb', color: isUp ? 'white' : '#707a8a',
                                    fontSize: '0.85rem', fontWeight: 800, minWidth: '80px', textAlign: 'center'
                                }}>
                                    {isUp ? '+' : ''}{data.change.toFixed(2)}%
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Bottom Nav */}
            <nav className="bottom-nav" style={{ background: '#f9fafb', borderTop: '1px solid #eee' }}>
                <Link to="/dashboard" className="nav-link active">
                    <Home size={22} />
                    <span>Home</span>
                </Link>
                <Link to="/market" className="nav-link">
                    <TrendingUp size={22} />
                    <span>Market</span>
                </Link>
                <Link to="/trade" className="nav-link">
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

export default Dashboard;
