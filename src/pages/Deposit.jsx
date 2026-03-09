import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const getCoinLabel = (coin) => {
    const labels = {
        'USDT': 'USDT (TRC20)',
        'BTC': 'BTC (Bitcoin)',
        'ETH': 'ETH (ERC20)',
        'BNB': 'BNB (BEP20)',
        'LTC': 'LTC (Litecoin)',
        'XRP': 'XRP (Ripple)',
        'ADA': 'ADA (Cardano)'
    };
    return labels[coin] || coin;
};

const Deposit = () => {
    const { user } = useAuth();
    const [wallets, setWallets] = useState([]);
    const [selectedCoin, setSelectedCoin] = useState(null);
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const fetchWallets = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/wallets`);
                const data = await res.json();
                if (res.ok) {
                    setWallets(data);
                    if (data.length > 0) setSelectedCoin(data[0]);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchWallets();
    }, []);

    const handleDeposit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage(null);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/deposit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ coin: selectedCoin.coin, amount: parseFloat(amount) })
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Deposit request submitted. Please wait for system confirmation.' });
                setAmount('');
            } else {
                const err = await res.json();
                setMessage({ type: 'error', text: err.error || 'Sync Error: Please log out and back in.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Connection Error. Please check your internet.' });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="flex-center" style={{ height: '80vh' }}>Initializing Safe Payment...</div>;

    return (
        <div className="animate-fade-in" style={{ padding: '0 1rem 5rem 1rem' }}>
            {/* Header */}
            <header style={{ padding: '1rem 0', display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                 <Link to="/dashboard" style={{ color: 'var(--text-primary)', marginRight: '1rem' }}><ChevronLeft /></Link>
                 <h1 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>Secure Deposit</h1>
            </header>

            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                Select your preferred cryptocurrency and send the exact amount.
            </p>

            {/* Coin Picker */}
            <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                {wallets.map(w => (
                    <button 
                        key={w.id}
                        onClick={() => setSelectedCoin(w)}
                        style={{ 
                            padding: '0.75rem 1.25rem', 
                            borderRadius: '10px',
                            background: selectedCoin?.id === w.id ? 'var(--primary)' : 'var(--bg-surface-light)',
                            color: selectedCoin?.id === w.id ? 'black' : 'var(--text-primary)',
                            fontWeight: 700,
                            whiteSpace: 'nowrap',
                            border: 'none',
                            transition: 'all 0.2s'
                        }}
                    >
                        {w.coin}
                    </button>
                ))}
            </div>

            {selectedCoin && (
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <div style={{ 
                            background: 'white', 
                            display: 'inline-block', 
                            padding: '16px', 
                            borderRadius: '16px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                            marginBottom: '1.5rem'
                        }}>
                            <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${selectedCoin.address}&bgcolor=ffffff&color=000000`} 
                                alt="QR Code"
                                style={{ display: 'block' }}
                            />
                        </div>
                        
                        <div style={{ textAlign: 'left' }}>
                            <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600 }}>
                                Official {selectedCoin.coin} Wallet Address
                            </label>
                            <div style={{ 
                                background: 'rgba(255,255,255,0.03)', 
                                padding: '1rem', 
                                borderRadius: '12px', 
                                border: '1px solid var(--border-light)',
                                marginTop: '0.5rem', 
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                <span style={{ fontFamily: 'monospace', wordBreak: 'break-all', display: 'block', marginRight: '1rem', fontSize: '0.95rem' }}>
                                    {selectedCoin.address}
                                </span>
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: '0.5rem', fontWeight: 600 }}>
                                * Only send {selectedCoin.coin} to this address.
                            </div>
                        </div>
                    </div>

                    {message && (
                        <div style={{ 
                            padding: '1rem', marginBottom: '1.5rem', borderRadius: '10px',
                            background: message.type === 'success' ? 'var(--success-bg)' : 'var(--danger-bg)',
                            color: message.type === 'success' ? 'var(--success)' : 'var(--danger)',
                            border: `1px solid ${message.type === 'success' ? 'var(--success)' : 'var(--danger)'}`,
                            fontSize: '0.9rem',
                            fontWeight: 500
                        }}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleDeposit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.85rem', fontWeight: 600 }}>
                                Amount to Deposit ({selectedCoin.coin})
                            </label>
                            <input 
                                type="number" 
                                step="any"
                                required
                                className="input-base"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                style={{ fontSize: '1.1rem', fontWeight: 700 }}
                            />
                        </div>
                        <button type="submit" className="btn-primary" style={{ padding: '1.1rem', fontSize: '1.1rem' }} disabled={submitting}>
                            {submitting ? 'Authenticating...' : 'I have made the deposit'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Deposit;
