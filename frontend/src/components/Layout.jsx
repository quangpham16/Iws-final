import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Wallet, 
    ArrowLeftRight, 
    BarChart3, 
    Settings, 
    LogOut,
    Bell,
    Search,
    Target,
    Trophy
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Wallet, label: 'Wallets', path: '/wallets' },
    { icon: ArrowLeftRight, label: 'Transactions', path: '/transactions' },
    { icon: Target, label: 'Budgets', path: '/budgets' },
    { icon: Trophy, label: 'Goals', path: '/goals' },
    { icon: BarChart3, label: 'Reports', path: '/reports' },
    { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function Layout({ children }) {
    const location = useLocation();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user')) || { fullName: 'Guest', email: '' };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/auth');
    };

    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            {/* Sidebar */}
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
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
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
                                {item.label}
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

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-[100]">
                    <div className="flex items-center gap-4 bg-slate-100 px-4 py-2 rounded-2xl w-96 group focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                        <Search size={18} className="text-slate-400 group-focus-within:text-emerald-500" />
                        <input 
                            type="text" 
                            placeholder="Search transactions..." 
                            className="bg-transparent border-none outline-none w-full text-sm text-slate-600 placeholder:text-slate-400"
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                        </button>
                        
                        <div className="h-8 w-px bg-slate-200"></div>

                        <div className="flex items-center gap-3 group cursor-pointer">
                            <div className="text-right">
                                <p className="text-sm font-bold text-slate-800">{user?.fullName || 'Guest'}</p>
                                <p className="text-xs font-medium text-slate-400">{user?.email || 'Pro Member'}</p>
                            </div>
                            <div className="w-10 h-10 bg-slate-200 rounded-xl overflow-hidden ring-2 ring-transparent group-hover:ring-emerald-500/20 transition-all">
                                <div className="w-full h-full flex items-center justify-center bg-emerald-100 text-emerald-700 font-bold uppercase">
                                    {(user?.fullName || 'G').charAt(0)}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.2, ease: 'easeInOut' }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
