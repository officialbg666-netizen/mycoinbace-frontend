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
                setMessage({ type: 'success', text: 'Withdrawal request submitted. Waiting for security audit.' });
                setAmount('');
                setAddress('');
                await refreshProfile(); 
            } else {
                const err = await res.json();
                setMessage({ type: 'error', text: err.error || 'Withdrawal failed' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Connection lost. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto', paddingBottom: '5rem' }}>
            <h1 style={{ marginBottom: '0.5rem', fontSize: '1.75rem', textAlign: 'center' }}>Request Withdrawal</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', textAlign: 'center', fontSize: '0.9rem' }}>
                Quick and secure payouts to your external wallets.
            </p>

            <div className="glass-panel" style={{ padding: '2rem' }}>
                <div style={{ background: 'var(--bg-surface-light)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Available Balance</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                        ${Number(user?.balance || 0).toLocaleString()}
                    </div>
                </div>

                {message && (
                    <div style={{ 
                        padding: '1rem', marginBottom: '1.5rem', borderRadius: '10px',
                        background: message.type === 'success' ? 'var(--success-bg)' : 'var(--danger-bg)',
                        color: message.type === 'success' ? 'var(--success)' : 'var(--danger)',
                        border: `1px solid ${message.type === 'success' ? 'var(--success)' : 'var(--danger)'}`,
                        fontSize: '0.9rem'
                    }}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleWithdraw} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.85rem', fontWeight: 600 }}>Select Asset</label>
                        <select 
                            className="input-base" 
                            value={coin} 
                            onChange={(e) => setCoin(e.target.value)}
                            style={{ fontWeight: 600 }}
                        >
                            {SUPPORTED_COINS.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.85rem', fontWeight: 600 }}>Amount (USD)</label>
                        <div style={{ position: 'relative' }}>
                            <input 
                                type="number" 
                                step="any"
                                required
                                className="input-base"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                style={{ fontWeight: 700 }}
                            />
                            <button 
                                type="button" 
                                onClick={() => setAmount(user.balance)}
                                style={{ 
                                    position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)',
                                    color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem'
                                }}
                            >
                                MAX
                            </button>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.85rem', fontWeight: 600 }}>Recipient Wallet Address</label>
                        <input 
                            type="text" 
                            required
                            className="input-base"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder={`Your ${coin} address...`}
                        />
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                            * Double check the address to avoid loss of funds.
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '1rem', fontSize: '1.1rem' }}>
                        {loading ? 'Processing Transaction...' : 'Withdraw Funds Now'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Withdrawal;
