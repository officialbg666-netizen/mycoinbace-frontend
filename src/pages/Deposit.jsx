import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

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
                setMessage({ type: 'success', text: 'Deposit request submitted successfully. Waiting for admin approval.' });
                setAmount('');
            } else {
                const err = await res.json();
                setMessage({ type: 'error', text: err.error || 'Deposit failed' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="flex-center">Loading options...</div>;

    return (
        <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '1rem' }}>Crypto Deposits</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                Select a coin and send funds to the address below. Your balance will be credited after confirmation.
            </p>

            <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                {/* Coin Selection List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {wallets.map(w => (
                        <button 
                            key={w.id}
                            onClick={() => setSelectedCoin(w)}
                            className="glass-panel"
                            style={{ 
                                padding: '1rem', 
                                textAlign: 'left',
                                border: selectedCoin?.id === w.id ? '1px solid var(--primary)' : '1px solid var(--border)',
                                background: selectedCoin?.id === w.id ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-card)',
                                fontWeight: 600,
                                cursor: 'pointer'
                            }}
                        >
                            {getCoinLabel(w.coin)}
                        </button>
                    ))}
                </div>

                {/* Deposit Details Form */}
                {selectedCoin && (
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                            Deposit {getCoinLabel(selectedCoin.coin)}
                        </h3>
                        
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${selectedCoin.address}&bgcolor=ffffff&color=000000`} 
                                alt={`${getCoinLabel(selectedCoin.coin)} QR Code`}
                                style={{ borderRadius: '8px', padding: '10px', background: 'white', marginBottom: '1rem' }}
                            />
                            <div>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Deposit Address</span>
                                <div style={{ 
                                    background: 'rgba(0,0,0,0.3)', padding: '0.75rem', 
                                    borderRadius: '4px', fontFamily: 'monospace', fontSize: '1rem',
                                    marginTop: '0.5rem', wordBreak: 'break-all', userSelect: 'all'
                                }}>
                                    {selectedCoin.address}
                                </div>
                            </div>
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

                        <form onSubmit={handleDeposit}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                    Amount Sent ({getCoinLabel(selectedCoin.coin)})
                                </label>
                                <input 
                                    type="number" 
                                    step="any"
                                    min="0"
                                    required
                                    className="input-base"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Enter amount..."
                                />
                            </div>
                            <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={submitting}>
                                {submitting ? 'Submitting...' : 'I have made the deposit'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Deposit;
