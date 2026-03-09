import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';

// Pages
import Auth from './pages/Auth';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Deposit from './pages/Deposit';
import Withdrawal from './pages/Withdrawal';
import Trading from './pages/Trading';
import Admin from './pages/Admin';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="flex-center" style={{height: '100vh'}}>Loading...</div>;
    if (!user) return <Navigate to="/auth" />;
    if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" />;
    return children;
};

const AppContent = () => {
    return (
        <Router>
            <Navbar />
            <div className="container" style={{ padding: '2rem 1rem' }}>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/auth" element={<Auth />} />
                    
                    {/* Protected Routes */}
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/deposit" element={<ProtectedRoute><Deposit /></ProtectedRoute>} />
                    <Route path="/withdraw" element={<ProtectedRoute><Withdrawal /></ProtectedRoute>} />
                    <Route path="/trade" element={<ProtectedRoute><Trading /></ProtectedRoute>} />
                    
                    {/* Admin Route */}
                    <Route path="/admin" element={<ProtectedRoute adminOnly={true}><Admin /></ProtectedRoute>} />
                </Routes>
            </div>
        </Router>
    );
};

function App() {
  return (
    <AuthProvider>
        <AppContent />
    </AuthProvider>
  );
}

export default App;
