import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
    Plus, RefreshCw, ChevronDown, CheckCircle, AlertCircle, Pencil, X, Calendar, 
    ArrowUpRight, ArrowDownRight, Utensils, ShoppingCart, Coffee, Plane, 
    Activity, Sparkles, Film, ShoppingBag, TrendingUp, GraduationCap, 
    Home, Car, Zap, CreditCard, DollarSign, Tag, Clock
} from 'lucide-react';
import { budgetApi } from '../services/api';
import { transactionApi } from '../services/transactionService';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── SVG Donut ─── */
function DonutRing({ pct = 0, size = 120, stroke = 14, color = '#106E4E' }) {
    const r = (size - stroke) / 2;
    const circ = 2 * Math.PI * r;
    const filled = Math.min(pct / 100, 1) * circ;
    return (
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
            <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#F0F9F4" strokeWidth={stroke} />
            <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
                strokeDasharray={`${filled} ${circ}`} strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 1s ease' }} />
        </svg>
    );
}

/* ─── Semi Gauge ─── */
function SemiGauge({ pct = 0 }) {
    const W = 240, H = 130, cx = 120, cy = 120, r = 96, sw = 20;
    const arc = Math.PI * r;
    const filled = Math.min(pct / 100, 1) * arc;
    const d = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;
    return (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
            <path d={d} fill="none" stroke="#F0F9F4" strokeWidth={sw} strokeLinecap="round" />
            <path d={d} fill="none" stroke="#106E4E" strokeWidth={sw} strokeLinecap="round"
                strokeDasharray={`${filled} ${arc}`} style={{ transition: 'stroke-dasharray 1.2s ease' }} />
        </svg>
    );
}

/* ─── Badge ─── */
function Badge({ pct }) {
    if (pct >= 90) return <span className="inline-flex items-center gap-1 text-[10px] font-black text-red-500 bg-red-50 px-2.5 py-1 rounded-full"><AlertCircle size={10}/>over budget</span>;
    if (pct >= 75) return <span className="inline-flex items-center gap-1 text-[10px] font-black text-amber-500 bg-amber-50 px-2.5 py-1 rounded-full"><AlertCircle size={10}/>need attention</span>;
    return <span className="inline-flex items-center gap-1 text-[10px] font-black text-[#106E4E] bg-[#106E4E]/5 px-2.5 py-1 rounded-full"><CheckCircle size={10}/>on track</span>;
}

const ICONS = { 
    food: <Utensils size={20} />, 
    groceries: <ShoppingCart size={20} />, 
    dining: <Utensils size={20} />, 
    cafe: <Coffee size={20} />, 
    coffee: <Coffee size={20} />, 
    travel: <Plane size={20} />, 
    health: <Activity size={20} />, 
    beauty: <Sparkles size={20} />, 
    entertainment: <Film size={20} />, 
    shopping: <ShoppingBag size={20} />, 
    invest: <TrendingUp size={20} />, 
    education: <GraduationCap size={20} />, 
    rent: <Home size={20} />, 
    transport: <Car size={20} />, 
    utility: <Zap size={20} />,
    bills: <CreditCard size={20} />
};

const iconFor = n => { 
    const k = Object.keys(ICONS).find(k => n?.toLowerCase().includes(k)); 
    return k ? ICONS[k] : <DollarSign size={20} />; 
};

const fmt = (n, d = 2) => Number(n).toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d });

export default function BudgetsPage() {
    const [budgets, setBudgets]         = useState([]);
    const [transactions, setTx]         = useState([]);
    const [loading, setLoading]         = useState(true);
    const [showAdd, setShowAdd]         = useState(false);
    const [editItem, setEditItem]       = useState(null);
    const [sortBy, setSortBy]           = useState('default');
    const [statusFilter, setStatus]     = useState('all');
    const [form, setForm] = useState({
        name: '', amount: '', periodType: 'monthly',
        startDate: new Date().toISOString().slice(0, 10),
        endDate: new Date(Date.now() + 30 * 864e5).toISOString().slice(0, 10)
    });

    useEffect(() => {
        Promise.all([budgetApi.getAll(), transactionApi.getAll()])
            .then(([b, t]) => { setBudgets(b.data); setTx(t.data); })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const reload = () => Promise.all([budgetApi.getAll(), transactionApi.getAll()])
        .then(([b, t]) => { setBudgets(b.data); setTx(t.data); });

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            if (editItem) {
                await budgetApi.update(editItem.id, form);
            } else {
                await budgetApi.create(form);
            }
            setShowAdd(false);
            setEditItem(null);
            setForm({
                name: '', amount: '', periodType: 'monthly',
                startDate: new Date().toISOString().slice(0, 10),
                endDate: new Date(Date.now() + 30 * 864e5).toISOString().slice(0, 10)
            });
            reload();
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = (b) => {
        setEditItem(b);
        setForm({
            name: b.name,
            amount: b.amount,
            periodType: b.periodType.toLowerCase(),
            startDate: b.startDate,
            endDate: b.endDate
        });
        setShowAdd(true);
    };

    const handleDel = async (id) => {
        if (!confirm('Are you sure you want to delete this budget?')) return;
        await budgetApi.delete(id).catch(console.error);
        reload();
    };

    /* enrich */
    const enriched = useMemo(() => budgets.map(b => {
        const amount = +b.amount || 0, spent = +b.spentAmount || 0;
        const left = Math.max(amount - spent, 0), pct = amount > 0 ? (spent / amount) * 100 : 0;
        return { ...b, amount, spent, left, pct };
    }), [budgets]);

    const displayed = useMemo(() => {
        let d = [...enriched];
        if (statusFilter === 'on_track') d = d.filter(b => b.pct < 75);
        if (statusFilter === 'attention') d = d.filter(b => b.pct >= 75 && b.pct < 90);
        if (statusFilter === 'over') d = d.filter(b => b.pct >= 90);
        if (sortBy === 'name') d.sort((a, b) => a.name.localeCompare(b.name));
        if (sortBy === 'spent') d.sort((a, b) => b.pct - a.pct);
        if (sortBy === 'amount') d.sort((a, b) => b.amount - a.amount);
        return d;
    }, [enriched, statusFilter, sortBy]);

    const total  = enriched.reduce((s, b) => s + b.amount, 0);
    const spent  = enriched.reduce((s, b) => s + b.spent, 0);
    const left   = Math.max(total - spent, 0);
    const pctAll = total > 0 ? (spent / total) * 100 : 0;

    const expenses = useMemo(() => {
        const m = {};
        transactions.filter(t => t.type === 'EXPENSE').forEach(t => {
            const c = t.category || 'Other';
            m[c] = (m[c] || 0) + (+t.amount || 0);
        });
        return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([cat, amt]) => ({ cat, amt }));
    }, [transactions]);

    const maxAmt = expenses[0]?.amt || 1;

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <div className="w-10 h-10 border-4 border-[#106E4E] border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="flex gap-7 max-w-[1600px] mx-auto w-full" style={{ alignItems: 'flex-start' }}>

            {/* ══ LEFT ══ */}
            <div className="flex-1 min-w-0 space-y-5">

                {/* Toolbar */}
                <div className="flex items-center gap-3 flex-wrap">
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Financial Planning</p>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Budgets</h1>
                    </div>

                    <button onClick={() => { setEditItem(null); setForm({ name: '', amount: '', periodType: 'monthly', startDate: new Date().toISOString().slice(0, 10), endDate: new Date(Date.now() + 30 * 864e5).toISOString().slice(0, 10) }); setShowAdd(true); }}
                        className="ml-auto flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#106E4E] text-white text-sm font-black hover:bg-[#0C563D] shadow-xl shadow-[#106E4E]/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                        <Plus size={18} /> New Budget
                    </button>
                </div>

                {/* Sub-filters + count */}
                <div className="flex items-center gap-4 bg-white/50 backdrop-blur-sm p-2 rounded-2xl border border-gray-100/50">
                    <div className="relative">
                        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                            className="appearance-none pl-4 pr-9 py-2 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-600 focus:outline-none focus:border-[#106E4E] cursor-pointer">
                            <option value="default">Sort: Default</option>
                            <option value="name">Sort: Name</option>
                            <option value="spent">Sort: Spending %</option>
                            <option value="amount">Sort: Limit</option>
                        </select>
                        <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>

                    <div className="relative">
                        <select value={statusFilter} onChange={e => setStatus(e.target.value)}
                            className="appearance-none pl-4 pr-9 py-2 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-600 focus:outline-none cursor-pointer">
                            <option value="all">Status: All</option>
                            <option value="on_track">On Track</option>
                            <option value="attention">Needs Attention</option>
                            <option value="over">Over Budget</option>
                        </select>
                        <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>

                    {(statusFilter !== 'all' || sortBy !== 'default') && (
                        <button onClick={() => { setStatus('all'); setSortBy('default'); }}
                            className="flex items-center gap-1.5 text-xs font-bold text-[#106E4E] hover:text-[#0C563D] transition-all px-2">
                            <RefreshCw size={12} /> Reset
                        </button>
                    )}
                    <div className="ml-auto px-4 py-2 bg-gray-50 rounded-xl">
                        <span className="text-xs text-gray-500 font-bold">{enriched.length} <span className="font-medium text-gray-400">budgets</span></span>
                    </div>
                </div>

                {/* Cards */}
                {displayed.length === 0 ? (
                    <div className="bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100 p-20 flex flex-col items-center gap-4 text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-[#106E4E]">
                            <DollarSign size={40} />
                        </div>
                        <div>
                            <p className="text-xl font-black text-gray-900">No active budgets</p>
                            <p className="text-sm text-gray-400 max-w-[240px] mt-1 font-medium">Define spending limits to keep your finances under control.</p>
                        </div>
                        <button onClick={() => setShowAdd(true)} className="mt-4 px-8 py-4 bg-[#106E4E] text-white rounded-2xl font-black text-sm hover:bg-[#0C563D] transition-all shadow-lg shadow-[#106E4E]/20">
                            Create First Budget
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {displayed.map(b => {
                            const color = b.pct >= 90 ? '#ef4444' : b.pct >= 75 ? '#f59e0b' : '#106E4E';
                            return (
                                <motion.div 
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    key={b.id}
                                    className="bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 p-7 group relative overflow-hidden"
                                >
                                    
                                    {/* Glass reflection effect */}
                                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none" />
                                    
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-6 relative z-10">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-2xl bg-[#F0F9F4] text-[#106E4E] flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                                {iconFor(b.name)}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-black text-gray-900 leading-none mb-1">{b.name}</h3>
                                                <Badge pct={b.pct} />
                                            </div>
                                        </div>
                                        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                                            <button onClick={() => handleEdit(b)}
                                                className="p-2.5 rounded-xl bg-gray-50 hover:bg-[#106E4E]/10 text-gray-400 hover:text-[#106E4E] transition-all">
                                                <Pencil size={15} />
                                            </button>
                                            <button onClick={() => handleDel(b.id)}
                                                className="p-2.5 rounded-xl bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all">
                                                <X size={15} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Body: donut + stats */}
                                    <div className="flex items-center gap-7 relative z-10">
                                        <div className="relative flex-shrink-0">
                                            <DonutRing pct={b.pct} size={120} stroke={14} color={color} />
                                            <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-0.5">{Math.round(b.pct)}%</span>
                                                <span className="text-sm font-black text-gray-900 leading-none">Spent</span>
                                            </div>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="mb-4">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Available Funds</p>
                                                <div className="flex items-baseline gap-1.5">
                                                    <span className="text-3xl font-black text-gray-900 tabular-nums">${fmt(b.left, 0)}</span>
                                                    <span className="text-sm font-bold text-gray-300">/ ${fmt(b.amount, 0)}</span>
                                                </div>
                                            </div>

                                            <div className="w-full h-2 bg-gray-50 rounded-full overflow-hidden mb-1 shadow-inner">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${Math.min(b.pct, 100)}%` }}
                                                    transition={{ duration: 1, ease: "easeOut" }}
                                                    className="h-full rounded-full"
                                                    style={{ background: color }} 
                                                />
                                            </div>
                                            <div className="flex justify-between text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                                                <span>Spent: ${fmt(b.spent, 0)}</span>
                                                <span>Limit: ${fmt(b.amount, 0)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="mt-7 pt-5 border-t border-gray-50 flex items-center justify-between text-[11px] font-bold text-gray-400 relative z-10">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={13} className="text-gray-300" />
                                            <span className="bg-[#F0F9F4] text-[#106E4E] px-2 py-0.5 rounded-md uppercase tracking-wider text-[10px] font-black">{b.periodType}</span>
                                        </div>
                                        <span className="font-black text-gray-300 italic">{b.startDate} ─ {b.endDate}</span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ══ RIGHT SIDEBAR ══ */}
            <div className="w-[300px] xl:w-[340px] flex-shrink-0 space-y-6">

                {/* Monthly summary */}
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 relative overflow-hidden">
                    <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#106E4E] opacity-[0.03] rounded-full blur-3xl pointer-events-none" />
                    
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">Global Budget</h2>
                        <div className="w-2 h-2 rounded-full bg-[#106E4E] animate-pulse" />
                    </div>

                    <div className="mb-6">
                        <p className="text-4xl font-black text-gray-900 tabular-nums leading-none mb-2">
                            ${fmt(total)}
                        </p>
                        <Badge pct={pctAll} />
                    </div>

                    {/* Gauge */}
                    <div className="relative flex justify-center mb-4">
                        <SemiGauge pct={pctAll} />
                        <div className="absolute bottom-2 flex flex-col items-center">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{Math.round(pctAll)}% UTILITY</p>
                            <p className="text-2xl font-black text-gray-900 tabular-nums">${fmt(spent, 0)}</p>
                        </div>
                    </div>
                    
                    <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
                        <div>
                            <p className="text-[9px] font-bold text-gray-400 uppercase">Remaining</p>
                            <p className="text-lg font-black text-gray-800 tabular-nums">${fmt(left, 0)}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[9px] font-bold text-gray-400 uppercase">Saving Potential</p>
                            <p className="text-lg font-black text-[#106E4E] tabular-nums">{Math.round(100-pctAll)}%</p>
                        </div>
                    </div>
                </div>

                {/* Category spending distribution */}
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">Spending Hub</h2>
                        <span className="text-[10px] font-black text-[#106E4E] bg-[#106E4E]/5 px-3 py-1 rounded-full uppercase">Current cycle</span>
                    </div>

                    {expenses.length === 0 ? (
                        <div className="py-10 text-center space-y-2">
                            <Activity size={32} className="mx-auto text-gray-200" />
                            <p className="text-xs text-gray-400 font-medium">No spending data to analyze</p>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {expenses.map(({ cat, amt }, i) => {
                                const bar = (amt / maxAmt) * 100;
                                const isMajor = i < 2;
                                return (
                                    <div key={cat} className="group">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-[#F0F9F4] text-[#106E4E] flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all">
                                                    {iconFor(cat)}
                                                </div>
                                                <div>
                                                    <p className="text-[13px] font-black text-gray-900 truncate max-w-[100px]">{cat}</p>
                                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">{(bar * 0.2 + 1.2).toFixed(1)}% of total</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[14px] font-black text-gray-900 tabular-nums">${fmt(amt, 0)}</p>
                                                <div className={`flex items-center gap-0.5 text-[9px] font-black justify-end ${isMajor ? 'text-rose-500' : 'text-[#106E4E]'}`}>
                                                    {isMajor ? <ArrowUpRight size={10}/> : <ArrowDownRight size={10}/>}
                                                    {isMajor ? 'High' : 'Stable'}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden shadow-inner">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${bar}%` }}
                                                transition={{ duration: 1 }}
                                                className="h-full rounded-full"
                                                style={{ background: isMajor ? '#f87171' : '#106E4E' }} 
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    
                    <button className="w-full mt-8 py-4 bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-900 text-[11px] font-black uppercase tracking-widest rounded-2xl transition-all">
                        View Detailed Insights
                    </button>
                </div>
            </div>

            {/* ══ Add/Edit Modal ══ */}
            {createPortal(
                <AnimatePresence>
                    {showAdd && (
                        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-3xl z-[99999] flex items-center justify-center p-4 md:p-6 overflow-y-auto">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                                className="bg-white w-full max-w-lg rounded-[3.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.35)] overflow-hidden my-auto border border-white/20"
                            >
                                <div className="px-10 pt-12 pb-6 flex items-center justify-between border-b border-gray-50 bg-white relative">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-[#106E4E]" />
                                    <div>
                                        <h3 className="text-3xl font-black text-gray-900 tracking-tight">
                                            {editItem ? 'Refine Budget' : 'Establish Budget'}
                                        </h3>
                                        <p className="text-sm text-gray-400 font-medium mt-1">Set clear boundaries for your financial freedom.</p>
                                    </div>
                                    <button onClick={() => { setShowAdd(false); setEditItem(null); }} 
                                        className="p-4 rounded-2xl text-gray-300 hover:bg-gray-50 hover:text-gray-900 transition-all border border-transparent hover:border-gray-100 group">
                                        <X size={28} className="group-hover:rotate-90 transition-transform duration-300" />
                                    </button>
                                </div>

                                <form onSubmit={handleAdd} className="p-10 space-y-10 bg-white">
                                    {/* Identity */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 ml-2">
                                            <Tag size={14} className="text-gray-400" />
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Budget Identity</label>
                                        </div>
                                        <div className="relative group">
                                            <input type="text" required value={form.name}
                                                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                                placeholder="e.g. Fine Dining"
                                                className="w-full px-8 py-5 bg-gray-50 border border-gray-100 rounded-3xl font-black text-gray-900 text-lg focus:bg-white focus:ring-[15px] focus:ring-emerald-500/5 focus:border-[#106E4E] outline-none transition-all placeholder:text-gray-200 shadow-inner" />
                                        </div>
                                    </div>

                                    {/* Limit & Period */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 ml-2">
                                                <DollarSign size={14} className="text-gray-400" />
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Spending Limit</label>
                                            </div>
                                            <div className="relative group">
                                                <DollarSign size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#106E4E] transition-colors" />
                                                <input type="number" required value={form.amount}
                                                    onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                                                    placeholder="0.00"
                                                    className="w-full pl-14 pr-8 py-5 bg-gray-50 border border-gray-100 rounded-3xl font-black text-gray-900 tabular-nums text-lg focus:bg-white focus:ring-[15px] focus:ring-emerald-500/5 focus:border-[#106E4E] outline-none transition-all placeholder:text-gray-200 shadow-inner" />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 ml-2">
                                                <RefreshCw size={14} className="text-gray-400" />
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Frequency</label>
                                            </div>
                                            <select value={form.periodType} onChange={e => setForm(f => ({ ...f, periodType: e.target.value }))}
                                                className="w-full px-8 py-5 bg-gray-50 border border-gray-100 rounded-3xl font-black text-gray-900 text-lg focus:bg-white focus:ring-[15px] focus:ring-emerald-500/5 focus:border-[#106E4E] outline-none transition-all appearance-none cursor-pointer shadow-inner">
                                                <option value="weekly">Weekly</option>
                                                <option value="monthly">Monthly</option>
                                                <option value="yearly">Yearly</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Dates Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 ml-2">
                                                <Calendar size={14} className="text-gray-400" />
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Effective From</label>
                                            </div>
                                            <input type="date" required value={form.startDate}
                                                onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                                                className="w-full px-8 py-5 bg-gray-50 border border-gray-100 rounded-3xl font-black text-gray-900 focus:bg-white focus:ring-[15px] focus:ring-emerald-500/5 focus:border-[#106E4E] outline-none transition-all shadow-inner" />
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 ml-2">
                                                <Clock size={14} className="text-gray-400" />
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Expires On</label>
                                            </div>
                                            <input type="date" required value={form.endDate}
                                                onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                                                className="w-full px-8 py-5 bg-gray-50 border border-gray-100 rounded-3xl font-black text-gray-900 focus:bg-white focus:ring-[15px] focus:ring-emerald-500/5 focus:border-[#106E4E] outline-none transition-all shadow-inner" />
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="pt-8 flex gap-6">
                                        <button type="button" onClick={() => { setShowAdd(false); setEditItem(null); }}
                                            className="flex-1 py-6 bg-gray-50 text-gray-500 font-black rounded-[2rem] hover:bg-gray-100 hover:text-gray-900 transition-all text-xs uppercase tracking-[0.2em] border border-transparent hover:border-gray-200">
                                            Discard
                                        </button>
                                        <button type="submit"
                                            className="flex-[2] py-6 bg-gray-900 text-white font-black rounded-[2rem] hover:bg-[#106E4E] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.3)] hover:shadow-[#106E4E]/40 transition-all text-xs uppercase tracking-[0.3em] active:scale-95">
                                            {editItem ? 'Save Refinements' : 'Activate Budget'}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
}
