import React, { useState, useEffect } from 'react';
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
    ChevronRight,
    Shield,
    BellRing,
    FileCheck,
    ChevronDown,
    Mail,
    Phone,
    MapPin,
    Search,
    User
} from 'lucide-react';
import { cn } from '../lib/utils';

const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Wallet, label: 'Wallets', path: '/wallets' },
    { icon: ArrowLeftRight, label: 'Transactions', path: '/transactions', hasSubmenu: true },
    { icon: Target, label: 'Budgets', path: '/budgets' },
    { icon: Trophy, label: 'Goals', path: '/goals' },
    { icon: BarChart3, label: 'Reports', path: '/reports' },
    { icon: Settings, label: 'Settings', path: '/settings', hasSubmenu: true },
];

// Transaction submenu items
const transactionTabs = [
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
    { id: 'subscriptions', label: 'Subscriptions', icon: RefreshCcw },
    { id: 'categories', label: 'Categories', icon: Tag },
    { id: 'payees', label: 'Payees', icon: Users },
    { id: 'tags', label: 'Tags', icon: Hash },
];

const settingsTabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'password', label: 'Password', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: BellRing },
    { id: 'verification', label: 'Verification', icon: FileCheck },
];

// Page Title Component
function PageTitle({ pathname, hash }) {
    const getTitle = () => {
        switch (pathname) {
            case '/dashboard':
                return { title: 'Your financial', highlight: 'harvest.', subtitle: 'Architectural Overview' };
            case '/wallets':
                return { title: 'Wallet', highlight: 'Management.', subtitle: 'Financial Assets' };
            case '/transactions':
                return { title: 'Transaction', highlight: 'History.', subtitle: 'Activity Log' };
            case '/budgets':
                return { title: 'Budget', highlight: 'Planning.', subtitle: 'Financial Limits' };
            case '/goals':
                return { title: 'Savings', highlight: 'Goals.', subtitle: 'Target Achievement' };
            case '/reports':
                return { title: 'Analytics &', highlight: 'Insights.', subtitle: 'Data Overview' };
            case '/settings':
                const tab = hash.replace('#', '');
                switch (tab) {
                    case 'profile':
                        return { title: 'Profile', highlight: 'Settings.', subtitle: 'Account' };
                    case 'password':
                        return { title: 'Change', highlight: 'Password.', subtitle: 'Security' };
                    case 'notifications':
                        return { title: 'Notification', highlight: 'Prefs.', subtitle: 'Alerts' };
                    case 'verification':
                        return { title: 'Account', highlight: 'Verify.', subtitle: 'Identity' };
                    default:
                        return { title: 'Account', highlight: 'Settings.', subtitle: 'Configuration' };
                }
            default:
                return { title: 'Finance', highlight: 'Tracker.', subtitle: 'Welcome back' };
        }
    };

    const { title, subtitle, highlight } = getTitle();

    return (
        <div className="space-y-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">{subtitle}</p>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter">
                {highlight ? (
                    <span>{title} <span className="text-[#106E4E]">{highlight}</span></span>
                ) : (
                    <span className="text-[#106E4E]">{title}</span>
                )}
            </h1>
        </div>
    );
}

// Profile Dropdown Component
function ProfileDropdown({ user, onLogout }) {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = React.useRef(null);

    React.useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getInitials = () => {
        if (user?.fullName) {
            const names = user.fullName.split(' ');
            return names.length > 1
                ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
                : user.fullName[0].toUpperCase();
        }
        return 'G';
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 group cursor-pointer p-1 rounded-xl hover:bg-slate-100 transition-all"
            >
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-slate-800">{user?.fullName || 'Guest'}</p>
                    <p className="text-xs font-medium text-slate-400">{user?.email || 'Pro Member'}</p>
                </div>
                <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-transparent group-hover:ring-emerald-500/20 transition-all">
                    {user?.avatarUrl ? (
                        <img
                            src={user.avatarUrl}
                            alt={user.fullName}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-emerald-100 text-emerald-700 font-bold uppercase text-sm">
                            {getInitials()}
                        </div>
                    )}
                </div>
                <ChevronDown size={16} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-emerald-100">
                                {user?.avatarUrl ? (
                                    <img
                                        src={user.avatarUrl}
                                        alt={user.fullName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-emerald-700 font-bold text-lg">
                                        {getInitials()}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-slate-900 truncate">{user?.fullName || 'Guest'}</p>
                                <p className="text-sm text-slate-500 truncate">{user?.email}</p>
                            </div>
                        </div>
                    </div>
                    <div className="px-4 py-3 space-y-2">
                        {user?.phoneNumber && (
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <Phone size={14} className="text-slate-400" />
                                <span>{user.phoneCountryCode || '+84'} {user.phoneNumber}</span>
                            </div>
                        )}
                        {user?.residentialAddress && (
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <MapPin size={14} className="text-slate-400" />
                                <span className="truncate">{user.residentialAddress}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                            <Mail size={14} className="text-slate-400" />
                            <span className="truncate">{user?.email}</span>
                        </div>
                    </div>
                    <div className="px-2 pt-3 border-t border-slate-100 space-y-1">
                        <button
                            onClick={() => {
                                navigate('/settings#profile');
                                setIsOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-emerald-700 transition-all text-left"
                        >
                            <User size={18} className="text-slate-400" />
                            <span className="font-medium">Profile Settings</span>
                        </button>
                        <button
                            onClick={() => {
                                onLogout();
                                setIsOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-all text-left"
                        >
                            <LogOut size={18} className="text-slate-400" />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function Layout({ children }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || { fullName: 'Guest', email: '' });

    useEffect(() => {
        const handleStorageChange = () => {
            const updatedUser = JSON.parse(localStorage.getItem('user')) || { fullName: 'Guest', email: '' };
            setUser(updatedUser);
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const [activeSettingsTab, setActiveSettingsTab] = useState(() => {
        const hash = location.hash.replace('#', '');
        return settingsTabs.find(t => t.id === hash)?.id || 'profile';
    });

    const isSettingsPage = location.pathname === '/settings';
    const isTransactions = location.pathname === '/transactions';
    const activeTab = searchParams.get('tab') || 'transactions';

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser({ fullName: 'Guest', email: '' });
        navigate('/auth');
    };

    const handleSettingsTabClick = (tabId) => {
        setActiveSettingsTab(tabId);
        navigate(`/settings#${tabId}`);
    };

    const handleTransactionTabClick = (tabId) => {
        setSearchParams({ tab: tabId });
    };

    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen">
                <div className="p-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                        <div className="w-4 h-4 bg-white rounded-full animate-pulse" />
                    </div>
                    <span className="font-bold text-xl text-slate-800 tracking-tight">Verdant</span>
                </div>

                <nav className="flex-1 px-4 space-y-1 mt-4">
                    {sidebarItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const isSettings = item.path === '/settings';
                        const isTransactionsItem = item.path === '/transactions';
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => {
                                    if (item.path === '/transactions') {
                                        setSearchParams({ tab: 'transactions' });
                                    }
                                }}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                                    isActive
                                        ? "bg-emerald-50 text-emerald-700 font-semibold shadow-sm"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                                )}
                            >
                                <item.icon size={20} className={cn(
                                    "transition-colors",
                                    isActive ? "text-emerald-600" : "text-slate-400 group-hover:text-slate-600"
                                )} />
                                <span className="flex-1">{item.label}</span>
                                {(isSettings && isSettingsPage) || (isTransactionsItem && isTransactions) ? (
                                    <ChevronRight size={16} className="text-emerald-600" />
                                ) : null}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all group"
                    >
                        <LogOut size={20} className="text-slate-400 group-hover:text-rose-500" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {isSettingsPage && (
                <aside className="w-56 bg-[#F1F5F9] border-r border-slate-200 flex flex-col sticky top-0 h-screen animate-in slide-in-from-left duration-300">
                    <div className="p-5 border-b border-slate-200/60">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Settings</p>
                    </div>
                    <nav className="flex-1 p-3 space-y-1">
                        {settingsTabs.map((tab) => {
                            const isActive = activeSettingsTab === tab.id;
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => handleSettingsTabClick(tab.id)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left",
                                        isActive
                                            ? "bg-white text-emerald-700 font-semibold shadow-sm border border-slate-200"
                                            : "text-slate-500 hover:bg-white/60 hover:text-slate-700"
                                    )}
                                >
                                    <Icon size={18} className={cn(
                                        "transition-colors",
                                        isActive ? "text-emerald-600" : "text-slate-400"
                                    )} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </nav>
                </aside>
            )}

            {isTransactions && (
                <aside className="w-56 bg-[#F1F5F9] border-r border-slate-200 flex flex-col sticky top-0 h-screen animate-in slide-in-from-left duration-300">
                    <div className="p-5 border-b border-slate-200/60">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Manage</p>
                    </div>
                    <nav className="flex-1 p-3 space-y-1">
                        {transactionTabs.map((tab) => {
                            const isActive = activeTab === tab.id;
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTransactionTabClick(tab.id)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left",
                                        isActive
                                            ? "bg-white text-emerald-700 font-semibold shadow-sm border border-slate-200"
                                            : "text-slate-500 hover:bg-white/60 hover:text-slate-700"
                                    )}
                                >
                                    <Icon size={18} className={cn(
                                        "transition-colors",
                                        isActive ? "text-emerald-600" : "text-slate-400"
                                    )} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </nav>
                </aside>
            )}

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center">
                        <PageTitle pathname={location.pathname} hash={location.hash} />
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 bg-slate-100 px-4 py-2.5 rounded-2xl w-72 group focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                            <Search size={18} className="text-slate-400 group-focus-within:text-emerald-500" />
                            <input
                                type="text"
                                placeholder="Search transactions..."
                                className="bg-transparent border-none outline-none w-full text-sm text-slate-600 placeholder:text-slate-400"
                            />
                        </div>

                        <div className="h-8 w-px bg-slate-200"></div>

                        <button className="relative p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                        </button>

                        <div className="h-8 w-px bg-slate-200"></div>

                        <ProfileDropdown user={user} onLogout={handleLogout} />
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
