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
      padding: '0.75rem 1.5rem',
      backgroundColor: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-light)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }} className="flex-between">
      
      <Link to={user ? "/dashboard" : "/"} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', color: 'var(--text-primary)' }}>
        <div style={{
          width: '32px', height: '32px', 
          background: 'var(--primary)', 
          borderRadius: '8px', 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 'bold', fontSize: '1.2rem', color: 'black'
        }}>
          M
        </div>
        <span style={{ fontSize: '1.1rem', fontWeight: '800', letterSpacing: '0.5px' }}>MyCoinBace</span>
      </Link>

      <div className="navbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {user ? (
          <>
            {user.role === 'admin' && (
              <Link to="/admin" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', border: '1px solid var(--primary)', borderRadius: '4px', textDecoration: 'none', color: 'var(--primary)', fontWeight: 700 }}>
                Admin
              </Link>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 12px', background: 'var(--bg-surface-light)', borderRadius: '20px' }}>
              <Wallet size={16} color="var(--primary)" />
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>${Number(user.balance || 0).toFixed(2)}</span>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <Link to="/auth" style={{ textDecoration: 'none', color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.85rem' }}>Log In</Link>
            <Link to="/auth?mode=register" style={{ textDecoration: 'none', color: 'var(--primary)', fontWeight: 800, fontSize: '0.85rem' }}>Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
