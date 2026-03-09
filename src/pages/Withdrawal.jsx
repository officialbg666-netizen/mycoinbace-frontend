import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const SUPPORTED_COINS = ['USDT', 'BTC', 'ETH', 'BNB', 'LTC', 'XRP', 'ADA'];

const Withdrawal = () => {
    const { user, refreshProfile } = useAuth();
    const [coin, setCoin] = useState('USDT');
    const [amount, setAmount] = useState('');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleWithdraw = async (e) => {
        e.preventDefault();
        setMessage(null);

        if (parseFloat(amount) > user.balance) {
            setMessage({ type: 'error', text: 'Insufficient balance' });
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/withdraw`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ coin, amount: parseFloat(amount), address })
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Withdrawal request submitted successfully. Pending admin approval.' });
                setAmount('');
                setAddress('');
                await refreshProfile(); // Refresh balance
            } else {
                const err = await res.json();
                setMessage({ type: 'error', text: err.error || 'Withdrawal failed' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '1rem' }}>Withdraw Funds</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                Available Balance: <strong style={{color: 'white'}}>${Number(user?.balance || 0).toFixed(2)}</strong>
            </p>

            <div className="glass-panel" style={{ padding: '2.5rem' }}>
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

                <form onSubmit={handleWithdraw} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Select Coin</label>
                        <select 
                            className="input-base" 
                            value={coin} 
                            onChange={(e) => setCoin(e.target.value)}
                        >
                            {SUPPORTED_COINS.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Withdrawal Amount</label>
                        <div style={{ position: 'relative' }}>
                            <input 
                                type="number" 
                                step="any"
                                min="0"
                                required
                                className="input-base"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                            />
                            <button 
                                type="button" 
                                onClick={() => setAmount(user.balance)}
                                style={{ 
                                    position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                                    color: 'var(--primary)', fontWeight: 600, fontSize: '0.875rem', background: 'transparent', border: 'none', cursor: 'pointer'
                                }}
                            >
                                MAX
                            </button>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Destination Address</label>
                        <input 
                            type="text" 
                            required
                            className="input-base"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder={`Enter your ${coin} address`}
                        />
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '1rem' }}>
                        {loading ? 'Processing...' : 'Request Withdrawal'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Withdrawal;
