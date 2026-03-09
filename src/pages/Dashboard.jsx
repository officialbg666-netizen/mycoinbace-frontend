import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, LineChart, FileText, Wallet, User, Headphones, ChevronRight } from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();
    const [prices, setPrices] = useState({});

    // Fetch real prices from Binance for a rich look
    useEffect(() => {
        const fetchPrices = async () => {
            try {
                // Fetch top pairs
                const symbols = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "LTCUSDT", "XRPUSDT", "ADAUSDT", "DOGEUSDT", "TRXUSDT"];
                const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbols=${JSON.stringify(symbols)}`);
                const data = await res.json();
                const priceMap = {};
                data.forEach(item => {
                    priceMap[item.symbol] = {
                        price: parseFloat(item.lastPrice).toFixed(parseFloat(item.lastPrice) < 1 ? 4 : 2),
                        change: parseFloat(item.priceChangePercent).toFixed(2)
                    };
                });
                setPrices(priceMap);
            } catch (err) {
                console.error('Price fetch error:', err);
            }
        };

        fetchPrices();
        const interval = setInterval(fetchPrices, 5000);
        return () => clearInterval(interval);
    }, []);

    const marketList = [
        { name: 'Bitcoin', symbol: 'BTC', pair: 'BTCUSDT', icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png' },
        { name: 'Ethereum', symbol: 'ETH', pair: 'ETHUSDT', icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
        { name: 'Binance Coin', symbol: 'BNB', pair: 'BNBUSDT', icon: 'https://cryptologos.cc/logos/bnb-bnb-logo.png' },
        { name: 'Dogecoin', symbol: 'DOGE', pair: 'DOGEUSDT', icon: 'https://cryptologos.cc/logos/dogecoin-doge-logo.png' },
        { name: 'Litecoin', symbol: 'LTC', pair: 'LTCUSDT', icon: 'https://cryptologos.cc/logos/litecoin-ltc-logo.png' },
        { name: 'Ripple', symbol: 'XRP', pair: 'XRPUSDT', icon: 'https://cryptologos.cc/logos/xrp-xrp-logo.png' },
        { name: 'Cardano', symbol: 'ADA', pair: 'ADAUSDT', icon: 'https://cryptologos.cc/logos/cardano-ada-logo.png' },
        { name: 'TRON', symbol: 'TRX', pair: 'TRXUSDT', icon: 'https://cryptologos.cc/logos/tron-trx-logo.png' },
    ];

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '90px', background: 'var(--bg-dark)', minHeight: '100vh' }}>
            {/* Top User Header */}
            <header style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-surface)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-surface-light)', display: 'flex', alignItems: 'center', justifyItems: 'center', border: '1px solid var(--border-light)' }}>
                        <User size={20} style={{ margin: 'auto' }} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user?.email?.split('@')[0]}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>UID: {user?.id?.substring(0,8)}</div>
                    </div>
                </div>
                <div style={{ background: 'var(--bg-surface-light)', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>EN</div>
            </header>

            {/* Rotating Hero Banner */}
            <div style={{ padding: '0 1rem' }}>
                <div className="hero-banner" style={{ 
                    backgroundImage: `url('/trading_banner_1_1773040656336.png')`,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                    border: '1px solid var(--border-light)'
                }}></div>
            </div>

            {/* Top 3 Ticker Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', padding: '0 1rem', marginTop: '1rem' }}>
                {['BTCUSDT', 'ETHUSDT', 'BNBUSDT'].map(pair => (
                    <div key={pair} className="glass-panel" style={{ padding: '0.75rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>{pair.replace('USDT', '')}/USDT</div>
                        <div style={{ fontWeight: 800, fontSize: '1rem', color: prices[pair]?.change >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                            {prices[pair]?.price || '--'}
                        </div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 600, color: prices[pair]?.change >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                            {prices[pair]?.change >= 0 ? '+' : ''}{prices[pair]?.change || '0.00'}%
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Action Grid */}
            <div className="action-grid" style={{ padding: '0 1rem', marginTop: '1.5rem' }}>
                <Link to="/deposit" className="action-card">
                    <div className="icon-box" style={{ background: 'rgba(240, 185, 11, 0.1)' }}>
                        <Wallet size={24} color="var(--primary)" />
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>Deposit</span>
                </Link>
                <Link to="/withdraw" className="action-card">
                    <div className="icon-box" style={{ background: 'rgba(14, 203, 129, 0.1)' }}>
                        <FileText size={24} color="var(--success)" />
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>Withdraw</span>
                </Link>
                <Link to="/trading" className="action-card">
                    <div className="icon-box" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                        <Headphones size={24} color="#3b82f6" />
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>Customer</span>
                </Link>
            </div>

            {/* Market Quotation List */}
            <div style={{ marginTop: '2rem', background: 'var(--bg-surface)', padding: '1.5rem 0', borderRadius: '24px 24px 0 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 1.25rem 1rem 1.25rem', borderBottom: '1px solid var(--border-light)' }}>
                    <h3 style={{ fontSize: '1.1rem' }}>Market Quotes</h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--primary)', display: 'flex', alignItems: 'center' }}>
                        View More <ChevronRight size={14} />
                    </div>
                </div>

                <div style={{ padding: '0 1rem' }}>
                    <div className="flex-between" style={{ padding: '1rem 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        <span style={{ flex: 1.5 }}>Trading Pair</span>
                        <span style={{ flex: 1, textAlign: 'right' }}>Latest Price</span>
                        <span style={{ flex: 1, textAlign: 'right' }}>Change (%)</span>
                    </div>

                    {marketList.map(coin => (
                        <Link key={coin.symbol} to="/trading" className="market-item" style={{ padding: '1.25rem 0', textDecoration: 'none', color: 'inherit' }}>
                            <div className="coin-info" style={{ flex: 1.5 }}>
                                <img src={coin.icon} alt={coin.name} className="coin-icon" style={{ width: '28px', height: '28px' }} />
                                <div>
                                    <div className="coin-name" style={{ fontSize: '1rem' }}>{coin.symbol}<span style={{fontSize: '0.7rem', color: 'var(--text-secondary)'}}>/USDT</span></div>
                                </div>
                            </div>
                            <div className="coin-price" style={{ flex: 1, textAlign: 'right', fontSize: '1rem', fontWeight: 700 }}>
                                {prices[coin.pair]?.price || '--'}
                            </div>
                            <div style={{ flex: 1, textAlign: 'right' }}>
                                <div className="coin-change" style={{ 
                                    background: prices[coin.pair]?.change >= 0 ? 'var(--success)' : 'var(--danger)',
                                    color: 'white',
                                    fontSize: '0.85rem',
                                    display: 'inline-block',
                                    borderRadius: '4px',
                                    width: '75px'
                                }}>
                                    {prices[coin.pair]?.change >= 0 ? '+' : ''}{prices[coin.pair]?.change || '0.00'}%
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Fixed Bottom Navigation */}
            <nav className="bottom-nav">
                <Link to="/dashboard" className="nav-link active">
                    <Home size={22} />
                    <span>Home</span>
                </Link>
                <Link to="/trading" className="nav-link">
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

export default Dashboard;
