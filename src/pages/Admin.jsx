import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
    Users, Settings, DollarSign, BarChart2, FileText, 
    Shield, UserPlus, Lock, Unlock, CheckCircle, 
    XCircle, Trash2, Bell, Headset, MoreVertical,
    ChevronDown, LayoutDashboard, Database
} from 'lucide-react';

const Admin = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('User Management');
    const [activeSidebar, setActiveSidebar] = useState('Membership Management');
    const [activeSub, setActiveSub] = useState('User Directory');
    
    const [users, setUsers] = useState([]);
    const [finances, setFinances] = useState({ totalDeposits: 0, totalWithdrawals: 0, netFlow: 0 });
    const [deposits, setDeposits] = useState([]);
    const [trades, setTrades] = useState([]);
    const [wallets, setWallets] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAllData = async () => {
        try {
            const headers = { 'Authorization': `Bearer ${user.token}` };
            const [uRes, fRes, dRes, tRes, wRes] = await Promise.all([
                fetch(`${import.meta.env.VITE_API_URL}/admin/users`, { headers }),
                fetch(`${import.meta.env.VITE_API_URL}/admin/finances`, { headers }),
                fetch(`${import.meta.env.VITE_API_URL}/admin/deposits`, { headers }),
                fetch(`${import.meta.env.VITE_API_URL}/admin/trades`, { headers }),
                fetch(`${import.meta.env.VITE_API_URL}/wallets`)
            ]);

            setUsers(await uRes.json());
            setFinances(await fRes.json());
            setDeposits(await dRes.json());
            setTrades(await tRes.json());
            setWallets(await wRes.json());
        } catch (e) {
            console.error('Data fetch error:', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
        const intv = setInterval(fetchAllData, 10000);
        return () => clearInterval(intv);
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
        } catch (e) { console.error(e); }
    };

    const [selectedUsers, setSelectedUsers] = useState([]);

    const toggleSelectAll = () => {
        if (selectedUsers.length === users.length) setSelectedUsers([]);
        else setSelectedUsers(users.map(u => u.id));
    };

    const toggleSelectUser = (id) => {
        if (selectedUsers.includes(id)) setSelectedUsers(selectedUsers.filter(uid => uid !== id));
        else setSelectedUsers([...selectedUsers, id]);
    };

    const runBulkAction = async (action) => {
        if (selectedUsers.length === 0) return alert('Select users first');
        
        for (const id of selectedUsers) {
            if (action === 'freeze') await handleAction(`users/${id}/freeze`, 'PUT', { is_frozen: true });
            if (action === 'thaw') await handleAction(`users/${id}/freeze`, 'PUT', { is_frozen: false });
            if (action === 'allow_withdrawal') await handleAction(`users/${id}/withdrawable`, 'PUT', { allow_withdrawal: true });
            if (action === 'prohibit_withdrawal') await handleAction(`users/${id}/withdrawable`, 'PUT', { allow_withdrawal: false });
            if (action === 'delete') {
                if (window.confirm('IRREVERSIBLE: Delete selected users?')) {
                    await handleAction(`users/${id}`, 'DELETE');
                }
            }
        }
        setSelectedUsers([]);
    };

    if (loading) return <div className="flex-center" style={{height: '100vh', background: '#f4f5f9'}}>Initializing Management System...</div>;

    const renderUserManagement = () => (
        <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '4px' }}>
            {/* Action Bar */}
            <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                <button className="btn-pex-add"><UserPlus size={14} /> Added</button>
                <button className="btn-pex-freeze" onClick={() => runBulkAction('freeze')}>freeze</button>
                <button className="btn-pex-thaw" onClick={() => runBulkAction('thaw')}>thaw</button>
                <button className="btn-pex-allow" onClick={() => runBulkAction('allow_withdrawal')}>Allow withdrawal</button>
                <button className="btn-pex-prohibit" onClick={() => runBulkAction('prohibit_withdrawal')}>Withdrawal is prohibited</button>
                <button className="btn-pex-delete" onClick={() => runBulkAction('delete')}><Trash2 size={14} /> delete</button>
                <button className="btn-pex-notify">Mass Notification</button>
                
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
                    <select className="pex-select"><option>All Status</option></select>
                    <select className="pex-select"><option>All users</option></select>
                    <input className="pex-input" placeholder="Please enter email" />
                </div>
            </div>

            <table className="pex-table">
                <thead>
                    <tr>
                        <th style={{ width: '40px' }}><input type="checkbox" onChange={toggleSelectAll} checked={selectedUsers.length === users.length && users.length > 0} /></th>
                        <th>ID</th>
                        <th>Member Account</th>
                        <th>USDT balance</th>
                        <th>Login</th>
                        <th>Registration IP/Time</th>
                        <th>address</th>
                        <th>Recommended by</th>
                        <th>Certification</th>
                        <th style={{ textAlign: 'right' }}>Manage</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u.id} className={selectedUsers.includes(u.id) ? 'selected' : ''}>
                            <td><input type="checkbox" checked={selectedUsers.includes(u.id)} onChange={() => toggleSelectUser(u.id)} /></td>
                            <td style={{ color: '#6b7280', fontSize: '0.8rem' }}>{u.id.substring(0,4)}</td>
                            <td>
                                <div style={{ color: '#0ea5e9', fontWeight: 500 }}>{u.email}</div>
                                {u.is_frozen && <span className="pex-label-danger">Frozen</span>}
                                {u.allow_withdrawal === false && <span className="pex-label-warning">Withdraw Prohibited</span>}
                                {u.role === 'admin' && <span className="pex-label-primary">ADMIN</span>}
                            </td>
                            <td style={{ fontWeight: 600 }}>{Number(u.balance || 0).toFixed(8)}</td>
                            <td><span style={{ color: '#6b7280' }}>1 time</span></td>
                            <td style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                <div>Last IP: 127.0.0.1</div>
                                <div>Time: {new Date(u.created_at).toLocaleString()}</div>
                            </td>
                            <td style={{ fontSize: '0.75rem', maxWidth: '150px' }}>
                                <div style={{ fontWeight: 600 }}>Default</div>
                                <div className="text-truncate" title={u.id}>{u.id}</div>
                            </td>
                            <td style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                No superior
                            </td>
                            <td>
                                <div style={{ color: '#84cc16', fontWeight: 600, fontSize: '0.75rem' }}>Authentication successful</div>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                                <div style={{ display: 'flex', gap: '5px', justifyContent: 'flex-end' }}>
                                    <button className="pex-mini-btn" onClick={() => {
                                        const b = prompt('New Balance:', u.balance);
                                        if (b !== null) handleAction(`users/${u.id}/balance`, 'PUT', { balance: parseFloat(b) });
                                    }}>Balance</button>
                                    <button className="pex-mini-btn" onClick={() => {
                                        const r = u.role === 'admin' ? 'user' : 'admin';
                                        if (window.confirm(`Swap to ${r}?`)) handleAction(`users/${u.id}/role`, 'PUT', { role: r });
                                    }}>Role</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="pex-admin-layout">
            {/* Top Bar */}
            <header className="pex-header">
                <div className="pex-logo">
                    <Database size={24} color="#0ea5e9" />
                    <span>管理系统</span>
                </div>
                
                <nav className="pex-nav">
                    {['System Settings', 'User Management', 'Financial Records', 'Trading Center', 'Content Management'].map(tab => (
                        <button 
                            key={tab} 
                            className={activeTab === tab ? 'active' : ''}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>

                <div className="pex-header-right">
                    <div className="pex-user-dropdown">
                        <span>admin</span>
                        <ChevronDown size={14} />
                    </div>
                    <Trash2 size={18} className="pex-header-icon" />
                    <Settings size={18} className="pex-header-icon" />
                </div>
            </header>

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                {/* Sidebar */}
                <aside className="pex-sidebar">
                    <div className="pex-sidebar-item active">
                        <Users size={16} />
                        <span>Membership Management</span>
                        <ChevronDown size={14} style={{ marginLeft: 'auto' }} />
                    </div>
                    <div className="pex-sub-menu">
                        <div className="pex-sub-item active">User Directory</div>
                        <div className="pex-sub-item">Agent Management</div>
                        <div className="pex-sub-item">Administrator Management</div>
                    </div>

                    <div className="pex-sidebar-item">
                        <Lock size={16} />
                        <span>Security Audit</span>
                    </div>

                    <div className="pex-sidebar-group-title">FINANCIAL</div>
                    <div className="pex-sub-menu" style={{ display: 'block' }}>
                        <div className="pex-sub-item">Login Log</div>
                        <div className="pex-sub-item">User Wallet</div>
                        <div className="pex-sub-item" onClick={() => setActiveSub('Cash Flow')}>Cash flow</div>
                        <div className="pex-sub-item">Withdrawals Audit</div>
                    </div>

                    <div className="pex-sidebar-group-title">CONTENT</div>
                    <div className="pex-sub-menu" style={{ display: 'block' }}>
                        <div className="pex-sub-item">Notification Management</div>
                        <div className="pex-sub-item">Online Customer Service</div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="pex-main">
                    <div className="pex-breadcrumb">
                        {activeTab} / {activeSidebar} / {activeSub}
                    </div>

                    <h2 style={{ marginBottom: '1.5rem', fontWeight: 500, fontSize: '1.25rem' }}>{activeSub}</h2>

                    {activeTab === 'User Management' && renderUserManagement()}

                    {activeTab === 'System Settings' && (
                        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '4px' }}>
                            <h3 style={{ marginBottom: '1.5rem' }}>Global Walllet Addresses</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                                {wallets.map(w => (
                                    <div key={w.id} className="pex-stat-card">
                                        <div className="flex-between" style={{ marginBottom: '1rem' }}>
                                            <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{w.coin}</span>
                                            <button className="btn-pex-allow" style={{ padding: '4px 8px' }} onClick={async () => {
                                                const addr = prompt('New Address:', w.address);
                                                if (addr) await handleAction(`wallets/${w.coin}`, 'PUT', { address: addr });
                                            }}>Change</button>
                                        </div>
                                        <div style={{ fontSize: '0.8rem', wordBreak: 'break-all', opacity: 0.7 }}>{w.address}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'Trading Center' && (
                        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '4px' }}>
                            <h3 style={{ marginBottom: '1.5rem' }}>Active Market Trades</h3>
                            <table className="pex-table">
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Asset</th>
                                        <th>Amount</th>
                                        <th>Duration</th>
                                        <th>Status</th>
                                        <th style={{ textAlign: 'right' }}>Resolution</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {trades.map(t => (
                                        <tr key={t.id}>
                                            <td>{t.users?.email}</td>
                                            <td style={{ fontWeight: 700 }}>{t.asset}</td>
                                            <td style={{ color: '#0ea5e9' }}>${t.amount}</td>
                                            <td>{t.duration}s</td>
                                            <td>
                                                <span className={`pex-label-${t.result === 'pending' ? 'warning' : t.result === 'win' ? 'success' : 'danger'}`}>
                                                    {t.result}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: 'right' }}>
                                                {t.result === 'pending' && (
                                                    <div style={{ display: 'flex', gap: '5px', justifyContent: 'flex-end' }}>
                                                        <button onClick={() => handleAction(`trades/${t.id}/resolve`, 'PUT', { result: 'win' })} className="btn-pex-add">WIN</button>
                                                        <button onClick={() => handleAction(`trades/${t.id}/resolve`, 'PUT', { result: 'loss' })} className="btn-pex-prohibit">LOSS</button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    
                    {activeTab === 'Financial Records' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div className="pex-stat-group">
                                <div className="pex-stat-card">
                                    <div className="label">Total Deposits Approved</div>
                                    <div className="value success">${finances.totalDeposits.toLocaleString()}</div>
                                </div>
                                <div className="pex-stat-card">
                                    <div className="label">Total Withdrawals Approved</div>
                                    <div className="value danger">${finances.totalWithdrawals.toLocaleString()}</div>
                                </div>
                                <div className="pex-stat-card">
                                    <div className="label">Current Bankroll</div>
                                    <div className="value primary">${finances.netFlow.toLocaleString()}</div>
                                </div>
                            </div>

                            <section className="glass-panel" style={{ background: 'white', padding: '1.5rem', borderRadius: '4px' }}>
                                <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 600 }}>Recent Deposits</h3>
                                <div style={{ overflowX: 'auto' }}>
                                    <table className="pex-table">
                                        <thead>
                                            <tr>
                                                <th>Email</th>
                                                <th>Amount</th>
                                                <th>Coin</th>
                                                <th>Status</th>
                                                <th>Date</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {deposits.map(d => (
                                                <tr key={d.id}>
                                                    <td>{d.users?.email}</td>
                                                    <td style={{ fontWeight: 700 }}>{d.amount}</td>
                                                    <td>{d.coin}</td>
                                                    <td>
                                                        <span className={`pex-label-${d.status === 'approved' ? 'success' : d.status === 'pending' ? 'warning' : 'danger'}`}>
                                                            {d.status}
                                                        </span>
                                                    </td>
                                                    <td>{new Date(d.created_at).toLocaleDateString()}</td>
                                                    <td>
                                                        {d.status === 'pending' && (
                                                            <div style={{ display: 'flex', gap: '5px' }}>
                                                                <button onClick={() => handleAction(`deposits/${d.id}/status`, 'PUT', { status: 'approved' })} className="btn-pex-add">Accept</button>
                                                                <button onClick={() => handleAction(`deposits/${d.id}/status`, 'PUT', { status: 'rejected' })} className="btn-pex-prohibit">Reject</button>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        </div>
                    )}
                </main>
            </div>

            <style>{`
                .pex-admin-layout {
                    height: 100vh;
                    display: flex;
                    flex-direction: column;
                    background: #f4f5f9;
                    color: #333;
                    font-family: 'Inter', sans-serif;
                }
                .pex-header {
                    height: 60px;
                    background: #232d3b;
                    display: flex;
                    align-items: center;
                    padding: 0 1.5rem;
                    color: white;
                }
                .pex-logo {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-weight: 700;
                    font-size: 1.1rem;
                    margin-right: 3rem;
                }
                .pex-nav {
                    display: flex;
                    height: 100%;
                }
                .pex-nav button {
                    background: transparent;
                    border: none;
                    color: #94a3b8;
                    padding: 0 1.5rem;
                    font-size: 0.95rem;
                    cursor: pointer;
                    height: 100%;
                    border-bottom: 3px solid transparent;
                }
                .pex-nav button.active {
                    background: #3b82f633;
                    color: white;
                    border-bottom-color: #3b82f6;
                }
                .pex-header-right {
                    margin-left: auto;
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }
                .pex-user-dropdown {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: #1e293b;
                    padding: 4px 12px;
                    border-radius: 4px;
                    font-size: 0.85rem;
                }
                .pex-header-icon {
                    color: #94a3b8;
                    cursor: pointer;
                }
                
                .pex-sidebar {
                    width: 240px;
                    background: #232d3b;
                    color: #94a3b8;
                    padding: 1rem 0;
                }
                .pex-sidebar-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 0.75rem 1.5rem;
                    font-size: 0.9rem;
                    cursor: pointer;
                }
                .pex-sidebar-item.active {
                    background: #1e293b;
                    color: white;
                }
                .pex-sub-menu {
                    padding-left: 1rem;
                }
                .pex-sub-item {
                    padding: 0.5rem 1.5rem;
                    font-size: 0.85rem;
                    cursor: pointer;
                }
                .pex-sub-item.active {
                    color: #3b82f6;
                    font-weight: 600;
                }
                .pex-sidebar-group-title {
                    padding: 1.5rem 1.5rem 0.5rem 1.5rem;
                    font-size: 0.7rem;
                    font-weight: 800;
                    letter-spacing: 1px;
                    color: #475569;
                }

                .pex-main {
                    flex: 1;
                    padding: 1.5rem 2rem;
                    overflow-y: auto;
                }
                .pex-breadcrumb {
                    font-size: 0.8rem;
                    color: #64748b;
                    margin-bottom: 2rem;
                }

                /* Table Styles */
                .pex-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .pex-table th {
                    background: #f8fafc;
                    padding: 0.75rem 1rem;
                    text-align: left;
                    font-size: 0.8rem;
                    color: #475569;
                    font-weight: 600;
                    border-bottom: 1px solid #e2e8f0;
                }
                .pex-table td {
                    padding: 1rem;
                    font-size: 0.85rem;
                    border-bottom: 1px solid #f1f5f9;
                }
                .pex-table tr.selected {
                    background: #eff6ff;
                }
                
                /* Buttons */
                .btn-pex-add { background: #10b981; color: white; border: none; padding: 6px 14px; border-radius: 4px; font-weight: 600; font-size: 0.8rem; display: flex; gap: 4px; align-items: center; }
                .btn-pex-freeze { background: #6b7280; color: white; border: none; padding: 6px 14px; border-radius: 4px; font-size: 0.8rem; }
                .btn-pex-thaw { background: #ef4444; color: white; border: none; padding: 6px 14px; border-radius: 4px; font-size: 0.8rem; }
                .btn-pex-allow { background: #0ea5e9; color: white; border: none; padding: 6px 14px; border-radius: 4px; font-size: 0.8rem; }
                .btn-pex-prohibit { background: #dc2626; color: white; border: none; padding: 6px 14px; border-radius: 4px; font-size: 0.8rem; }
                .btn-pex-delete { background: #ef4444; color: white; border: none; padding: 6px 14px; border-radius: 4px; font-size: 0.8rem; }
                .btn-pex-notify { background: #10b981; color: white; border: none; padding: 6px 14px; border-radius: 4px; font-size: 0.8rem; }
                .pex-mini-btn { background: white; border: 1px solid #e2e8f0; color: #64748b; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 500; cursor: pointer; }
                .pex-mini-btn:hover { background: #f8fafc; color: #3b82f6; border-color: #3b82f6; }

                .pex-select { border: 1px solid #e2e8f0; padding: 6px 10px; border-radius: 4px; font-size: 0.85rem; }
                .pex-input { border: 1px solid #e2e8f0; padding: 6px 10px; border-radius: 4px; font-size: 0.85rem; }

                .pex-label-danger { background: #fee2e2; color: #dc2626; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; font-weight: 700; margin-left: 5px; }
                .pex-label-warning { background: #fff7ed; color: #ea580c; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; font-weight: 700; margin-left: 5px; }
                .pex-label-success { background: #f0fdf4; color: #16a34a; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; font-weight: 700; margin-left: 5px; }
                .pex-label-primary { background: #eff6ff; color: #2563eb; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; font-weight: 700; margin-left: 5px; }

                .pex-stat-group { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
                .pex-stat-card { background: white; padding: 1.5rem; border-radius: 4px; border: 1px solid #e2e8f0; }
                .pex-stat-card .label { font-size: 0.8rem; color: #64748b; margin-bottom: 8px; font-weight: 600; text-transform: uppercase; }
                .pex-stat-card .value { font-size: 1.5rem; font-weight: 800; }
                .pex-stat-card .value.success { color: #10b981; }
                .pex-stat-card .value.danger { color: #ef4444; }
                .pex-stat-card .value.primary { color: #3b82f6; }

                .text-truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
            `}</style>
        </div>
    );
};

export default Admin;
