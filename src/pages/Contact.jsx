import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Mail, MessageSquare, Phone, Send, Info } from 'lucide-react';

const Contact = () => {
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        setTimeout(() => {
            setSubmitting(false);
            setSubmitted(true);
        }, 1500);
    };

    return (
        <div className="animate-fade-in" style={{ padding: '0 1rem 5rem 1rem' }}>
            <header style={{ padding: '1rem 0', display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                <Link to="/dashboard" style={{ color: 'white', marginRight: '1rem' }}><ChevronLeft /></Link>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Support Center</h1>
            </header>

            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(14, 165, 233, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0ea5e9', margin: '0 auto 1.5rem auto' }}>
                    <Headset size={32} />
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>How can we help you?</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    Our dedicated support team is available 24/7 to assist with your trading, deposits, and account inquiries.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', textAlign: 'center' }}>
                    <Mail size={22} color="var(--primary)" />
                    <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Email Address</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>support@mycoinbase.global</div>
                </div>
                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', textAlign: 'center' }}>
                    <Send size={22} color="#229ED9" />
                    <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Telegram Bot</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>@MyCoinBaseSupport</div>
                </div>
            </div>

            <h3 style={{ marginBottom: '1.25rem', fontSize: '1rem', fontWeight: 700 }}>Send Us a Message</h3>

            {submitted ? (
                <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', border: '1px solid var(--success)' }}>
                    <div style={{ width: '48px', height: '48px', margin: '0 auto 1.5rem auto', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--success-bg)', borderRadius: '50%' }}>
                        <Info size={24} />
                    </div>
                    <h4 style={{ marginBottom: '0.5rem' }}>Message Submitted Successfully</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Thank you for reaching out. A support agent will respond to your email within 1–2 hours.</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass-panel" style={{ padding: '1.25rem' }}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Subject</label>
                            <input type="text" className="input-base" placeholder="Issue with deposit / trading..." required />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Your Message</label>
                            <textarea 
                                className="input-base" 
                                placeholder="Please describe your problem in detail..." 
                                style={{ minHeight: '120px', resize: 'none', padding: '1rem' }}
                                required
                            ></textarea>
                        </div>
                    </div>
                    <button 
                        type="submit" 
                        className="btn-primary" 
                        disabled={submitting} 
                        style={{ padding: '1.1rem', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                    >
                        {submitting ? 'Sending Request...' : <><Send size={18} /> Submit Ticket</>}
                    </button>
                </form>
            )}
        </div>
    );
};

export default Contact;
