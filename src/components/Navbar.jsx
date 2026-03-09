import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Wallet } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav style={{
      padding: '1rem 2rem',
      backgroundColor: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }} className="flex-between">
      
      <Link to={user ? "/dashboard" : "/"} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{
          width: '32px', height: '32px', 
          background: 'var(--gradient-primary)', 
          borderRadius: '8px', 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 'bold', fontSize: '1.2rem', color: 'white'
        }}>
          M
        </div>
        <span style={{ fontSize: '1.25rem', fontWeight: '700', letterSpacing: '1px' }}>MyCoinBace</span>
      </Link>

      <div className="navbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {user ? (
          <>
            {user.role === 'admin' && (
              <Link to="/admin" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', border: '1px solid #f0b90b', borderRadius: '4px', textDecoration: 'none', color: '#1e2329', fontWeight: 700 }}>
                Admin
              </Link>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 12px', background: 'var(--bg-surface-light)', borderRadius: '20px' }}>
              <Wallet size={16} color="var(--primary)" />
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e2329' }}>${Number(user.balance || 0).toFixed(2)}</span>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <Link to="/auth" style={{ textDecoration: 'none', color: '#1e2329', fontWeight: 700, fontSize: '0.85rem' }}>Log In</Link>
            <Link to="/auth?mode=register" style={{ textDecoration: 'none', color: '#5d5fef', fontWeight: 800, fontSize: '0.85rem' }}>Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
