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
              <Link to="/admin" className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                Admin Panel
              </Link>
            )}
            <div className="glass-panel flex-center" style={{ padding: '0.5rem 1rem', gap: '0.5rem', borderRadius: '2rem' }}>
              <Wallet size={16} color="var(--primary)" />
              <span style={{ fontWeight: 600 }}>${Number(user.balance || 0).toFixed(2)}</span>
            </div>
            
            <Link to="/deposit" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
              Deposit
            </Link>

            <button onClick={handleLogout} className="btn-outline flex-center" style={{ padding: '0.5rem', borderRadius: '50%' }} title="Logout">
              <LogOut size={16} />
            </button>
          </>
        ) : (
          <>
            <Link to="/auth" className="btn-outline">Login Now</Link>
            <Link to="/auth?mode=register" className="btn-primary">Create Now</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
