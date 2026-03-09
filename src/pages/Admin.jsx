import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
    Users, LayoutDashboard, DollarSign, BarChart2, 
    Settings, LogOut, Search, Filter, Edit, 
    Trash2, UserSlash, UserCheck, Shield, 
    Database, CreditCard, Bell, ChevronRight, X
} from 'lucide-react';

const Admin = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({ totalUsers: 0, activeUsers: 0, newUsers: 0, totalDeposits: 0, netFlow: 0 });
    const [deposits, setDeposits] = useState([]);
    const [trades, setTrades] = useState([]);
    const [wallets, setWallets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editModalUser, setEditModalUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchAllData = async () => {
        try {
            const headers = { 'Authorization': `Bearer ${user.token}` };
            const [uRes, sRes, dRes, tRes, wRes] = await Promise.all([
                fetch(`${import.meta.env.VITE_API_URL}/admin/users`, { headers }),
                fetch(`${import.meta.env.VITE_API_URL}/admin/stats`, { headers }),
                fetch(`${import.meta.env.VITE_API_URL}/admin/deposits`, { headers }),
                fetch(`${import.meta.env.VITE_API_URL}/admin/trades`, { headers }),
                fetch(`${import.meta.env.VITE_API_URL}/api/wallets`)
            ]);

            setUsers(await uRes.json());
            setStats(await sRes.json());
            setDeposits(await dRes.json());
            setTrades(await tRes.json());
            setWallets(await wRes.json());
        } catch (e) {
            console.error('Fetch error:', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
        const interval = setInterval(fetchAllData, 15000);
        return () => clearInterval(interval);
    }, []);

    const handleAction = async (endpoint, method = 'PUT', body = {}) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/${endpoint}`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(body)
            });
            if (res.ok) fetchAllData();
        } catch (e) { alert(e.message); }
    };

    const handleEditSave = async (e) => {
        e.preventDefault();
        const u = editModalUser;
        // Updating user - currently using the new unified endpoint
        await handleAction(`users/${u.id}`, 'PUT', { 
            role: u.role, balance: u.balance, 
            is_frozen: u.is_frozen, allow_withdrawal: u.allow_withdrawal,
            name: u.name
        });
        
        setEditModalUser(null);
    };

    if (loading) return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F9FAFB' }}>
            <div style={{ textAlign: 'center' }}>
                <Database size={40} color="#4F46E5" style={{ marginBottom: '1rem' }} />
                <div style={{ fontWeight: 600, color: '#374151' }}>Loading Management Center...</div>
            </div>
        </div>
    );

    const filteredUsers = (users || []).filter(u => u.email.toLowerCase().includes(searchQuery.toLowerCase()));

    const renderDashboard = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                <div className="admin-stat-card">
                    <div className="icon" style={{ background: '#EEF2FF', color: '#4F46E5' }}><Users size={24} /></div>
                    <div>
                        <div className="label">Total Users</div>
                        <div className="value">{stats.totalUsers.toLocaleString()}</div>
                    </div>
                </div>
                <div className="admin-stat-card">
                    <div className="icon" style={{ background: '#ECFDF5', color: '#10B981' }}><UserCheck size={24} /></div>
                    <div>
                        <div className="label">Active Users</div>
                        <div className="value">{stats.activeUsers.toLocaleString()}</div>
                    </div>
                </div>
                <div className="admin-stat-card">
                    <div className="icon" style={{ background: '#FFF7ED', color: '#F97316' }}><Bell size={24} /></div>
                    <div>
                        <div className="label">Registrations</div>
                        <div className="value">{stats.newUsers}</div>
                    </div>
                </div>
                <div className="admin-stat-card">
                    <div className="icon" style={{ background: '#F5F3FF', color: '#8B5CF6' }}><DollarSign size={24} /></div>
                    <div>
                        <div className="label">System Balance</div>
                        <div className="value">${stats.netFlow.toFixed(2)}</div>
                    </div>
                </div>
            </div>

            {/* Recent Activities Placeholder */}
            <div className="admin-table-container">
                <h3 className="admin-table-title">Recent System Notifications</h3>
                <div style={{ padding: '1rem', color: '#6B7280' }}>
                    <div style={{ display: 'flex', gap: '1rem', padding: '1rem 0', borderBottom: '1px solid #F3F4F6' }}>
                        <div style={{ color: '#10B981' }}><UserCheck size={18} /></div>
                        <div>User <strong>{users[0]?.email}</strong> has logged in.</div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', padding: '1rem 0' }}>
                        <div style={{ color: '#F97316' }}><Bell size={18} /></div>
                        <div>System maintenance scheduled for next Saturday.</div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderUsers = () => (
        <div className="admin-table-container">
            <div className="admin-table-header">
                <h3 className="admin-table-title">User Management</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                        <input 
                            placeholder="Find user..." 
                            className="admin-search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="admin-btn-secondary"><Filter size={16} /> Filter</button>
                </div>
            </div>

            <table className="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Account</th>
                        <th>Balance</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map(u => (
                        <tr key={u.id}>
                            <td style={{ fontSize: '0.75rem', opacity: 0.6 }}>{u.id.substring(0,8)}</td>
                            <td>
                                <div style={{ fontWeight: 600 }}>{u.email}</div>
                                <div style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>Joined: {new Date(u.created_at).toLocaleDateString()}</div>
                            </td>
                            <td><span style={{ fontWeight: 700 }}>${Number(u.balance).toFixed(2)}</span></td>
                            <td>
                                <span style={{ 
                                    padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800,
                                    background: u.role === 'admin' ? '#FEE2E2' : '#EFF6FF',
                                    color: u.role === 'admin' ? '#B91C1C' : '#2563EB'
                                }}>
                                    {u.role.toUpperCase()}
                                </span>
                            </td>
                            <td>
                                <span style={{ 
                                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                                    color: u.is_frozen ? '#EF4444' : '#10B981', fontWeight: 600
                                }}>
                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }}></div>
                                    {u.is_frozen ? 'Suspended' : 'Active'}
                                </span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                                <div style={{ display: 'flex', gap: '5px', justifyContent: 'flex-end' }}>
                                    <button onClick={() => setEditModalUser(u)} className="admin-mini-btn primary"><Edit size={14} /> Edit</button>
                                    <button onClick={() => {
                                        if(window.confirm('Delete user permanent?')) handleAction(`users/${u.id}`, 'DELETE');
                                    }} className="admin-mini-btn danger"><Trash2 size={14} /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className="admin-sidebar shadow-xl">
                <div className="admin-logo-area">
                    <Database size={28} color="#4F46E5" />
                    <span>MyCoinBace <small style={{fontSize: '0.6rem', opacity: 0.6, display: 'block'}}>ADMIN DASHBOARD</small></span>
                </div>
                
                <nav className="admin-side-nav">
                    {[
                        { id: 'Dashboard', icon: LayoutDashboard },
                        { id: 'Users', icon: Users },
                        { id: 'Finance', icon: CreditCard },
                        { id: 'Market Trades', icon: BarChart2 },
                        { id: 'Wallets', icon: Shield },
                        { id: 'Settings', icon: Settings }
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <tab.icon size={18} />
                            {tab.id}
                        </button>
                    ))}
                </nav>

                <div className="admin-user-footer">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                        <div className="avatar">A</div>
                        <div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{user.email.split('@')[0]}</div>
                            <div style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>Super Admin</div>
                        </div>
                    </div>
                    <button onClick={logout} className="logout-btn"><LogOut size={16} /> Logout</button>
                </div>
            </aside>

            {/* Main Center */}
            <main className="admin-main">
                <header className="admin-top-bar">
                    <div style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>Management / {activeTab}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ background: '#F3F4F6', padding: '6px 12px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>System: Online</div>
                        <Edit size={18} style={{ color: '#9CA3AF', cursor: 'pointer' }} />
                        <Bell size={18} style={{ color: '#9CA3AF', cursor: 'pointer' }} />
                    </div>
                </header>

                <div className="admin-content-inner">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827' }}>{activeTab} Overview</h2>
                        {activeTab === 'Users' && <button className="admin-btn-primary">+ Add New User</button>}
                    </div>

                    {activeTab === 'Dashboard' && renderDashboard()}
                    {activeTab === 'Users' && renderUsers()}
                    {activeTab === 'Finance' && (
                        <div>
                            <div className="admin-table-container">
                                <h3 className="admin-table-title">Recent Fund Transactions</h3>
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Account</th>
                                            <th>Type</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                            <th>Date</th>
                                            <th style={{ textAlign: 'right' }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {deposits.map(d => (
                                            <tr key={d.id}>
                                                <td>{d.users?.email}</td>
                                                <td><span style={{ fontWeight: 700, color: '#10B981' }}>DEPOSIT</span></td>
                                                <td style={{ fontWeight: 800 }}>${d.amount}</td>
                                                <td>
                                                    <span className={`admin-badge ${d.status === 'approved' ? 'success' : d.status === 'pending' ? 'warning' : 'danger'}`}>
                                                        {d.status}
                                                    </span>
                                                </td>
                                                <td>{new Date(d.created_at).toLocaleDateString()}</td>
                                                <td style={{ textAlign: 'right' }}>
                                                    {d.status === 'pending' && (
                                                        <div style={{ display: 'flex', gap: '5px', justifyContent: 'flex-end' }}>
                                                            <button onClick={() => handleAction(`deposits/${d.id}/status`, 'PUT', { status: 'approved' })} className="admin-mini-btn success">Approve</button>
                                                            <button onClick={() => handleAction(`deposits/${d.id}/status`, 'PUT', { status: 'rejected' })} className="admin-mini-btn danger">Reject</button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                    {/* Add other tabs if needed */}
                    {activeTab === 'Market Trades' && (
                         <div className="admin-table-container">
                             <h3 className="admin-table-title">Live Market Orders</h3>
                             <table className="admin-table">
                                 <thead>
                                     <tr>
                                         <th>User</th>
                                         <th>Asset</th>
                                         <th>Amount</th>
                                         <th>Status</th>
                                         <th style={{ textAlign: 'right' }}>Resolution</th>
                                     </tr>
                                 </thead>
                                 <tbody>
                                     {trades.map(t => (
                                         <tr key={t.id}>
                                             <td>{t.users?.email}</td>
                                             <td style={{fontWeight: 800}}>{t.asset}</td>
                                             <td>${t.amount}</td>
                                             <td><span className={`admin-badge ${t.result === 'pending' ? 'warning' : t.result === 'win' ? 'success' : 'danger'}`}>{t.result}</span></td>
                                             <td style={{ textAlign: 'right' }}>
                                                 {t.result === 'pending' && (
                                                      <div style={{ display: 'flex', gap: '5px', justifyContent: 'flex-end' }}>
                                                          <button onClick={() => handleAction(`trades/${t.id}/resolve`, 'PUT', { result: 'win' })} className="admin-mini-btn success">WIN</button>
                                                          <button onClick={() => handleAction(`trades/${t.id}/resolve`, 'PUT', { result: 'danger' })} className="admin-mini-btn danger">LOSS</button>
                                                      </div>
                                                 )}
                                             </td>
                                         </tr>
                                     ))}
                                 </tbody>
                             </table>
                         </div>
                    )}
                </div>
            </main>

            {/* Edit User Modal */}
            {editModalUser && (
                <div className="modal-overlay">
                    <div className="modal-content shadow-2xl">
                        <div className="modal-header">
                            <h3 style={{ fontWeight: 800, fontSize: '1.1rem' }}>Edit User Details</h3>
                            <X size={20} className="close-btn" onClick={() => setEditModalUser(null)} />
                        </div>
                        <form onSubmit={handleEditSave} className="modal-form">
                            <div className="form-group">
                                <label>Email Address (Public)</label>
                                <input disabled value={editModalUser.email} />
                            </div>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Role</label>
                                    <select value={editModalUser.role} onChange={e => setEditModalUser({...editModalUser, role: e.target.value})}>
                                        <option value="user">User</option>
                                        <option value="admin">Administrator</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Status</label>
                                    <select value={editModalUser.is_frozen} onChange={e => setEditModalUser({...editModalUser, is_frozen: e.target.value === 'true'})}>
                                        <option value="false">Active</option>
                                        <option value="true">Suspended</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Wallet Balance (USDT)</label>
                                <input 
                                    type="number" 
                                    value={editModalUser.balance} 
                                    onChange={e => setEditModalUser({...editModalUser, balance: parseFloat(e.target.value)})} 
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
                                <button type="submit" className="admin-btn-primary" style={{ flex: 1 }}>Save Changes</button>
                                <button type="button" onClick={() => setEditModalUser(null)} className="admin-btn-secondary" style={{ flex: 1 }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                .admin-layout {
                    height: 100vh;
                    display: flex;
                    background: #F9FAFB;
                    color: #111827;
                    font-family: 'Inter', sans-serif;
                }

                /* Sidebar */
                .admin-sidebar {
                    width: 280px;
                    background: #111827;
                    display: flex;
                    flex-direction: column;
                    color: white;
                }
                .admin-logo-area {
                    padding: 2rem;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-weight: 900;
                    letter-spacing: 0.5px;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                }
                .admin-side-nav {
                    flex: 1;
                    padding: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                }
                .nav-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 0.8rem 1rem;
                    border-radius: 8px;
                    background: transparent;
                    color: #9CA3AF;
                    text-align: left;
                    border: none;
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.2s;
                }
                .nav-item:hover {
                    color: white;
                    background: rgba(255,255,255,0.05);
                }
                .nav-item.active {
                    background: #4F46E5;
                    color: white;
                }
                .admin-user-footer {
                    padding: 1.5rem;
                    border-top: 1px solid rgba(255,255,255,0.05);
                }
                .avatar {
                    width: 32px; height: 32px; border-radius: 50%; background: #4F46E5; display: flex; align-items: center; justifyContent: center; font-weight: 800; font-size: 0.8rem;
                }
                .logout-btn {
                    width: 100%; text-align: left; background: transparent; border: 1px solid rgba(255,255,255,0.1); color: #EF4444; padding: 0.6rem 1rem; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-weight: 600;
                }

                /* Main */
                .admin-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
                .admin-top-bar { height: 64px; background: white; border-bottom: 1px solid #E5E7EB; display: flex; align-items: center; px: 2rem; justifyContent: space-between; padding: 0 2rem; }
                .admin-content-inner { flex: 1; overflow-y: auto; padding: 2rem; }

                /* Stats Cards */
                .admin-stat-card {
                    background: white; padding: 1.5rem; border-radius: 12px; border: 1px solid #E5E7EB; display: flex; align-items: center; gap: 1rem; transition: transform 0.2s;
                }
                .admin-stat-card:hover { transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
                .admin-stat-card .icon { border-radius: 12px; padding: 12px; }
                .admin-stat-card .label { font-size: 0.8rem; color: #6B7280; fontWeight: 600; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
                .admin-stat-card .value { font-size: 1.5rem; font-weight: 800; color: #111827; }

                /* Tables */
                .admin-table-container { background: white; border: 1px solid #E5E7EB; border-radius: 12px; overflow: hidden; }
                .admin-table-header { padding: 1.5rem; border-bottom: 1px solid #E5E7EB; display: flex; justifyContent: space-between; align-items: center; }
                .admin-table-title { margin: 0; fontSize: 1rem; font-weight: 700; color: #111827; }
                .admin-table { width: 100%; border-collapse: collapse; }
                .admin-table th { background: #F9FAFB; padding: 1rem; text-align: left; font-size: 0.75rem; color: #6B7280; font-weight: 800; text-transform: uppercase; border-bottom: 1px solid #E5E7EB; }
                .admin-table td { padding: 1.25rem 1rem; font-size: 0.85rem; border-bottom: 1px solid #F3F4F6; }
                .admin-table tr:hover { background: #F9FAFB; }

                /* Buttons */
                .admin-btn-primary { background: #4F46E5; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 700; cursor: pointer; transition: transform 0.2s; }
                .admin-btn-primary:hover { background: #4338CA; transform: scale(1.02); }
                .admin-btn-secondary { background: white; border: 1px solid #E5E7EB; color: #374151; padding: 0.6rem 1.2rem; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px; }
                .admin-mini-btn { border: none; padding: 6px 12px; border-radius: 6px; font-weight: 700; font-size: 0.75rem; cursor: pointer; display: flex; align-items: center; gap: 4px; }
                .admin-mini-btn.primary { background: #EEF2FF; color: #4F46E5; }
                .admin-mini-btn.danger { background: #FEF2F2; color: #EF4444; }
                .admin-mini-btn.success { background: #ECFDF5; color: #10B981; }

                .admin-search-input { border: 1px solid #E5E7EB; padding: 0.5rem 1rem 0.5rem 2.2rem; border-radius: 8px; font-size: 0.85rem; width: 220px; }
                .admin-badge { padding: 4px 10px; border-radius: 4px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; }
                .admin-badge.success { background: #ECFDF5; color: #10B981; }
                .admin-badge.warning { background: #FFF7ED; color: #F97316; }
                .admin-badge.danger { background: #FEF2F2; color: #EF4444; }

                /* Modal */
                .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); display: flex; align-items: center; justifyContent: center; z-index: 1000; }
                .modal-content { background: white; width: 440px; border-radius: 16px; overflow: hidden; }
                .modal-header { padding: 1.5rem; border-bottom: 1px solid #F3F4F6; display: flex; justifyContent: space-between; align-items: center; }
                .close-btn { color: #9CA3AF; cursor: pointer; }
                .modal-form { padding: 1.5rem; display: flex; flexDirection: column; gap: 1rem; }
                .form-group { display: flex; flexDirection: column; gap: 6px; }
                .form-group label { font-size: 0.75rem; fontWeight: 700; color: #6B7280; text-transform: uppercase; }
                .form-group input, .form-group select { border: 1px solid #E5E7EB; padding: 0.75rem; border-radius: 8px; font-size: 0.9rem; width: 100%; }
                .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
            `}</style>
        </div>
    );
};

export default Admin;
