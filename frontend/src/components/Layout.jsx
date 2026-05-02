import React from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
    LayoutDashboard,
    Wallet,
    ArrowLeftRight,
    BarChart3,
    Settings,
    LogOut,
    Bell,
    Tag,
    Target,
    Trophy,
    RefreshCcw,
    Users,
    Hash,
} from 'lucide-react';
import { cn } from '../lib/utils';

const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard',    path: '/dashboard' },
    { icon: Wallet,          label: 'Wallets',      path: '/wallets' },
    { icon: ArrowLeftRight,  label: 'Transactions', path: '/transactions' },
    { icon: Target,          label: 'Budgets',      path: '/budgets' },
    { icon: Trophy,          label: 'Goals',        path: '/goals' },
    { icon: BarChart3,       label: 'Reports',      path: '/reports' },
    { icon: Settings,        label: 'Settings',     path: '/settings' },
];

const TRANSACTION_SUB = [
    { id: 'transactions',  label: 'Transactions',  icon: ArrowLeftRight },
    { id: 'subscriptions', label: 'Subscriptions', icon: RefreshCcw },
    { id: 'categories',    label: 'Categories',    icon: Tag },
    { id: 'payees',        label: 'Payees',        icon: Users },
    { id: 'tags',          label: 'Tags',          icon: Hash },
];

export default function Layout({ children }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const user = JSON.parse(localStorage.getItem('user')) || { fullName: 'Guest', email: '' };

    const isTransactions = location.pathname === '/transactions';
    const activeTab = searchParams.get('tab') || 'transactions';

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/auth');
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }}>

            {/* ── Sidebar wrapper (flex row) ── */}
            <div style={{ display: 'flex', flexDirection: 'row', position: 'sticky', top: 0, height: '100vh', flexShrink: 0, zIndex: 20 }}>

                {/* Primary nav column */}
                <aside style={{
                    width: '240px',
                    background: '#fff',
                    borderRight: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                }}>
                    {/* Logo */}
                    <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: 36, height: 36, background: '#059669', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: 14, height: 14, background: '#fff', borderRadius: '50%' }} />
                        </div>
                        <span style={{ fontWeight: 700, fontSize: 18, color: '#1e293b', letterSpacing: '-0.02em' }}>Verdant</span>
                    </div>

                    {/* Nav items */}
                    <nav style={{ flex: 1, padding: '0 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {sidebarItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => {
                                        if (item.path === '/transactions') {
                                            setSearchParams({ tab: 'transactions' });
                                        }
                                    }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 12,
                                        padding: '10px 16px',
                                        borderRadius: 12,
                                        textDecoration: 'none',
                                        fontSize: 14,
                                        fontWeight: isActive ? 600 : 400,
                                        color: isActive ? '#047857' : '#64748b',
                                        background: isActive ? '#ecfdf5' : 'transparent',
                                        transition: 'all 0.15s',
                                    }}
                                >
                                    <item.icon size={18} style={{ color: isActive ? '#059669' : '#94a3b8', flexShrink: 0 }} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout */}
                    <div style={{ padding: 12, borderTop: '1px solid #f1f5f9' }}>
                        <button
                            onClick={handleLogout}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 12,
                                padding: '10px 16px', width: '100%', border: 'none',
                                background: 'transparent', cursor: 'pointer',
                                borderRadius: 12, fontSize: 14, color: '#64748b',
                                transition: 'all 0.15s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#fff1f2'; e.currentTarget.style.color = '#e11d48'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; }}
                        >
                            <LogOut size={18} style={{ color: '#94a3b8', flexShrink: 0 }} />
                            Logout
                        </button>
                    </div>
                </aside>

                {/* Secondary sub-panel — sits RIGHT BESIDE primary, only on /transactions */}
                {isTransactions && (
                    <div style={{
                        width: '180px',
                        background: '#fff',
                        borderRight: '1px solid #e2e8f0',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        paddingTop: 28,
                    }}>
                        <p style={{
                            padding: '0 20px 10px',
                            fontSize: 10,
                            fontWeight: 800,
                            color: '#94a3b8',
                            textTransform: 'uppercase',
                            letterSpacing: '0.2em',
                        }}>
                            Manage
                        </p>

                        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '0 10px' }}>
                            {TRANSACTION_SUB.map(tab => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setSearchParams({ tab: tab.id })}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 10,
                                            padding: '9px 12px',
                                            borderRadius: 10,
                                            border: 'none',
                                            background: isActive ? '#ecfdf5' : 'transparent',
                                            color: isActive ? '#047857' : '#64748b',
                                            fontWeight: isActive ? 600 : 400,
                                            fontSize: 13,
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            width: '100%',
                                            borderLeft: isActive ? '2px solid #059669' : '2px solid transparent',
                                            transition: 'all 0.15s',
                                        }}
                                    >
                                        <Icon size={14} style={{ color: isActive ? '#059669' : '#94a3b8', flexShrink: 0 }} />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                )}
            </div>

            {/* ── Main content ── */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {/* Header */}
                <header style={{
                    height: 64,
                    background: 'rgba(255,255,255,0.85)',
                    backdropFilter: 'blur(12px)',
                    borderBottom: '1px solid #e2e8f0',
                    padding: '0 32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                        <button style={{ position: 'relative', padding: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', borderRadius: '50%' }}>
                            <Bell size={20} />
                            <span style={{ position: 'absolute', top: 8, right: 8, width: 8, height: 8, background: '#f43f5e', borderRadius: '50%', border: '2px solid white' }} />
                        </button>

                        <div style={{ width: 1, height: 32, background: '#e2e8f0' }} />

                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', margin: 0 }}>{user?.fullName || 'Guest'}</p>
                                <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>{user?.email || 'Pro Member'}</p>
                            </div>
                            <div style={{ width: 40, height: 40, background: '#d1fae5', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#047857', fontWeight: 700, fontSize: 15, textTransform: 'uppercase' }}>
                                {(user?.fullName || 'G').charAt(0)}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main style={{ flex: 1, overflowY: 'auto', padding: 32 }}>
                    {children}
                </main>
            </div>
        </div>
    );
}
