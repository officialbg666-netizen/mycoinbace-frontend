import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    Home, TrendingUp, Activity, Wallet, User, 
    Headphones, ChevronRight, Megaphone, List,
    ArrowUpCircle, ArrowDownCircle, Briefcase, Rocket,
    LogOut
} from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [prices, setPrices] = useState({});
    const [prevPrices, setPrevPrices] = useState({});
    const [currentBanner, setCurrentBanner] = useState(0);
    const [showProfile, setShowProfile] = useState(false);

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
            <header style={{ padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-light)' }}>
                <div 
                    onClick={() => user && setShowProfile(true)} 
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
                >
                    <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: 'var(--bg-surface-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={22} color="var(--text-secondary)" />
                    </div>
                    {user ? (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>{user.email.split('@')[0]}</span>
                            <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 600 }}>UID: {user.id.substring(0,8)}</span>
                        </div>
                    ) : (
                        <Link to="/auth" style={{ textDecoration: 'none', color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 700 }}>Login / Register</Link>
                    )}
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ border: '1px solid var(--border-light)', borderRadius: '4px', padding: '4px 10px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)' }}>EN</div>
                </div>
            </header>

            {/* Profile Modal Overlay */}
            {showProfile && user && (
                <div style={{ 
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', 
                    zIndex: 1000, display: 'flex', alignItems: 'flex-end', transition: '0.3s' 
                }} onClick={() => setShowProfile(false)}>
                    <div 
                        style={{ 
                            width: '100%', background: 'var(--bg-surface)', borderRadius: '32px 32px 0 0', padding: '2.5rem 1.5rem', 
                            display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: 'var(--shadow-card)',
                            borderTop: '1px solid var(--border-light)'
                        }} 
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--bg-surface-light)', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <User size={36} color="var(--primary)" />
                            </div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-primary)' }}>{user.email}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '4px' }}>UID: {user.id}</div>
                        </div>

                        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem' }}>
                            <button 
                                onClick={logout}
                                style={{ 
                                    width: '100%', padding: '1rem', background: 'var(--danger-bg)', color: 'var(--danger)', 
                                    border: '1px solid var(--danger)', borderRadius: '16px', fontWeight: 800, fontSize: '1rem', 
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' 
                                }}
                            >
                                <LogOut size={22} /> Logout Account
                            </button>
                            <button 
                                onClick={() => setShowProfile(false)}
                                style={{ 
                                    width: '100%', marginTop: '0.75rem', padding: '1rem', background: 'var(--bg-surface-light)', 
                                    color: 'var(--text-secondary)', border: 'none', borderRadius: '16px', fontWeight: 700, 
                                    fontSize: '0.95rem', cursor: 'pointer' 
                                }}
                            >
                                Wait, Go Back
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Banner Section */}
            <div style={{ padding: '0 1rem' }}>
                <div className="hero-carousel" style={{ height: '180px', background: 'var(--bg-surface)', border: '1px solid var(--border-light)' }}>
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
            <div style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg-dark)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                <Megaphone size={16} />
                <div className="ticker-container" style={{ background: 'transparent', border: 'none', padding: 0, flex: 1 }}>
                    <div className="ticker-content" style={{ animationDuration: '40s', color: 'var(--text-primary)' }}>
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
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700 }}>{symbol}</div>
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
                margin: '1rem', padding: '1.5rem', background: 'var(--bg-surface)', borderRadius: '24px 24px 0 0',
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', textAlign: 'center',
                boxShadow: '0 -10px 30px rgba(0,0,0,0.1)', border: '1px solid var(--border-light)'
            }}>
                <Link to="/deposit" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}><Rocket size={32} /></div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>Deposit</span>
                </Link>
                <Link to="/withdraw" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0ea5e9' }}><Briefcase size={32} /></div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>Withdraw</span>
                </Link>
                <Link to="/contact" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}><Headphones size={32} /></div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>Customer</span>
                </Link>
            </div>

            {/* Market Quotation List */}
            <div style={{ background: 'var(--bg-dark)', padding: '0 1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', padding: '0.5rem 0', fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700 }}>
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
                            padding: '1.2rem 0', textDecoration: 'none', color: 'inherit', borderBottom: '1px solid var(--border-light)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <img 
                                    src={getIconUrl(coin.icon)} 
                                    onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${coin.icon}&background=random`; }}
                                    alt={coin.icon} 
                                    style={{ width: '28px', height: '28px' }} 
                                />
                                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>{coin.symbol}</div>
                            </div>
                            <div style={{ textAlign: 'center', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                {data.price.toFixed(coin.icon === 'DOGE' ? 4 : 2)}
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ 
                                    display: 'inline-block', padding: '6px 12px', borderRadius: '4px', 
                                    background: isUp ? 'var(--success)' : 'var(--bg-surface-light)', color: isUp ? 'black' : 'var(--text-secondary)',
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
            <nav className="bottom-nav">
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
