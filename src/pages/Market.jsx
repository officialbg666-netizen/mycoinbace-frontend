import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Search, TrendingUp, TrendingDown } from 'lucide-react';

const COINS = [
    'BTC', 'ETH', 'USDT', 'BNB', 'XRP', 'ADA', 'SOL', 'DOT', 'DOGE', 'AVAX',
    'LINK', 'SHIB', 'MATIC', 'LTC', 'UNI', 'DAI', 'BCH', 'TRX', 'ETC', 'XLM',
    'FIL', 'HBAR', 'ICP', 'NEAR', 'VET', 'ATOM', 'ALGO', 'GRT', 'XMR', 'FTM',
    'MANA', 'EOS', 'SAND', 'THETA', 'AAVE', 'AXS', 'LRC', 'HNT', 'FLOW', 'KSM',
    'RUNE', 'BAT', 'ONE', 'ENJ', 'CHZ', 'CELO', 'AR', 'HOT', 'ZEC', 'QTUM'
];

const Market = () => {
    const [marketData, setMarketData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const initialData = COINS.map(coin => ({
            symbol: coin,
            name: coin === 'BTC' ? 'Bitcoin' : coin === 'ETH' ? 'Ethereum' : coin === 'USDT' ? 'Tether' : coin,
            price: Math.random() * 50000 + 10,
            change: (Math.random() * 10 - 5).toFixed(2),
            id: coin
        }));
        setMarketData(initialData);

        const interval = setInterval(() => {
            setMarketData(prev => prev.map(coin => ({
                ...coin,
                price: coin.price * (1 + (Math.random() * 0.002 - 0.001)),
                change: (parseFloat(coin.change) + (Math.random() * 0.2 - 0.1)).toFixed(2)
            })));
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const filteredCoins = marketData.filter(c => 
        c.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="animate-fade-in" style={{ padding: '0 1rem 5rem 1rem' }}>
            <header style={{ padding: '1rem 0', display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <Link to="/dashboard" style={{ color: 'var(--text-primary)', marginRight: '1rem' }}><ChevronLeft /></Link>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>Market Prices</h1>
            </header>

            <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input 
                    type="text" 
                    placeholder="Search cryptocurrency..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ 
                        width: '100%', 
                        background: 'var(--bg-surface)', 
                        border: '1px solid var(--border-light)', 
                        padding: '0.75rem 1rem 0.75rem 2.5rem',
                        borderRadius: '12px',
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem'
                    }}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', padding: '0.5rem 0', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600, borderBottom: '1px solid var(--border-light)' }}>
                <span>Asset</span>
                <span style={{ textAlign: 'right' }}>Price</span>
                <span style={{ textAlign: 'right' }}>24h Change</span>
            </div>

            <div style={{ marginTop: '0.5rem' }}>
                {filteredCoins.map(coin => {
                    const isUp = parseFloat(coin.change) >= 0;
                        const iconUrl = `https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/${coin.symbol.toLowerCase()}.png`;

                        return (
                            <Link 
                                to={`/trade?symbol=${encodeURIComponent(coin.symbol === 'GOLD' ? 'GOLD' : coin.symbol + '/USDT')}`} 
                                key={coin.id} 
                                style={{ 
                                    display: 'grid', 
                                    gridTemplateColumns: '1.5fr 1fr 1fr', 
                                    padding: '1.2rem 0', 
                                    borderBottom: '1px solid var(--border-light)',
                                    textDecoration: 'none',
                                    color: 'var(--text-primary)',
                                    alignItems: 'center'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <img 
                                        src={iconUrl} 
                                        onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${coin.symbol}&background=random`; }}
                                        alt={coin.symbol} 
                                        style={{ width: '32px', height: '32px' }} 
                                    />
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{coin.symbol}</div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{coin.name}</div>
                                    </div>
                                </div>
                            <div style={{ textAlign: 'right', fontWeight: 700, fontSize: '0.95rem' }}>
                                ${coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                            <div style={{ textAlign: 'right', fontWeight: 700, fontSize: '0.9rem', color: isUp ? 'var(--success)' : 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                                {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                {isUp ? '+' : ''}{coin.change}%
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    );
};

export default Market;
