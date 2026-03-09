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
import Market from './pages/Market';
import Assets from './pages/Assets';
import TradeHistory from './pages/TradeHistory';
import Contact from './pages/Contact';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="flex-center" style={{height: '100vh'}}>Loading...</div>;
    if (!user) return <Navigate to="/auth" />;
    if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" />;
    return children;
};

const MobileLayout = ({ children }) => (
    <div className="container">{children}</div>
);

const AppContent = () => {
    return (
        <Router>
            <Routes>
                {/* Admin Interface - Full Width */}
                <Route path="/admin" element={<ProtectedRoute adminOnly={true}><Admin /></ProtectedRoute>} />
                
                {/* Root Redirection: Force Login UI first */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                
                <Route path="/auth" element={<MobileLayout><Auth /></MobileLayout>} />
                <Route path="/dashboard" element={<MobileLayout><ProtectedRoute><Dashboard /></ProtectedRoute></MobileLayout>} />
                <Route path="/deposit" element={<MobileLayout><ProtectedRoute><Deposit /></ProtectedRoute></MobileLayout>} />
                <Route path="/withdraw" element={<MobileLayout><ProtectedRoute><Withdrawal /></ProtectedRoute></MobileLayout>} />
                <Route path="/trade" element={<MobileLayout><ProtectedRoute><Trading /></ProtectedRoute></MobileLayout>} />
                <Route path="/market" element={<MobileLayout><ProtectedRoute><Market /></ProtectedRoute></MobileLayout>} />
                <Route path="/assets" element={<MobileLayout><ProtectedRoute><Assets /></ProtectedRoute></MobileLayout>} />
                <Route path="/history" element={<MobileLayout><ProtectedRoute><TradeHistory /></ProtectedRoute></MobileLayout>} />
                <Route path="/contact" element={<MobileLayout><Contact /></MobileLayout>} />
                
                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
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
