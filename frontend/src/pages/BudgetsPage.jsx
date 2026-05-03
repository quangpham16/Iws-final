import React, { useState, useEffect, useMemo } from 'react';
import { 
    Plus, MoreHorizontal, RefreshCw, ChevronDown, CheckCircle, AlertCircle, 
    Pencil, X, Calendar, ArrowUpRight, ArrowDownRight, Target,
    Utensils, ShoppingCart, Coffee, Plane, HeartPulse, Sparkles, Film, 
    ShoppingBag, TrendingUp, GraduationCap, Home, Car, Zap, DollarSign
} from 'lucide-react';
import { budgetApi, walletApi, categoryApi } from '../services/api';
import { transactionApi } from '../services/transactionService';
import { motion } from 'framer-motion';

/* ─── SVG Donut ─── */
function DonutRing({ pct = 0, size = 110, stroke = 12, color = '#106E4E' }) {
    const r = (size - stroke) / 2;
    const circ = 2 * Math.PI * r;
    const filled = Math.min(pct / 100, 1) * circ;
    return (
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
            <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#ecfdf5" strokeWidth={stroke} />
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
            <path d={d} fill="none" stroke="#ecfdf5" strokeWidth={sw} strokeLinecap="round" />
            <path d={d} fill="none" stroke="#106E4E" strokeWidth={sw} strokeLinecap="round"
                strokeDasharray={`${filled} ${arc}`} style={{ transition: 'stroke-dasharray 1.2s ease' }} />
        </svg>
    );
}

/* ─── Badge ─── */
function Badge({ pct }) {
    if (pct >= 90) return <span className="inline-flex items-center gap-1 text-[10px] font-black text-rose-500 bg-rose-50 px-2.5 py-1 rounded-full"><AlertCircle size={10}/>over budget</span>;
    if (pct >= 75) return <span className="inline-flex items-center gap-1 text-[10px] font-black text-amber-500 bg-amber-50 px-2.5 py-1 rounded-full"><AlertCircle size={10}/>need attention</span>;
    return <span className="inline-flex items-center gap-1 text-[10px] font-black text-[#106E4E] bg-emerald-50 px-2.5 py-1 rounded-full"><CheckCircle size={10}/>on track</span>;
}

const ICONS = { 
    food: Utensils, groceries: ShoppingCart, dining: Utensils, cafe: Coffee, coffee: Coffee, 
    travel: Plane, health: HeartPulse, beauty: Sparkles, entertainment: Film, 
    shopping: ShoppingBag, invest: TrendingUp, education: GraduationCap, 
    rent: Home, transport: Car, utility: Zap 
};

const IconFor = ({ name, className }) => { 
    const k = Object.keys(ICONS).find(k => name?.toLowerCase().includes(k)); 
    const IconComponent = k ? ICONS[k] : DollarSign;
    return <IconComponent size={20} className={className || "text-[#106E4E]"} />;
};

const fmt = (n, d = 2) => Number(n).toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d });

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

export default function BudgetsPage() {
    const [budgets, setBudgets]         = useState([]);
    const [loading, setLoading]         = useState(true);
    const [currencySymbol, setCurrencySymbol] = useState('$');
    const [categories, setCategories]   = useState([]);
    const [showAdd, setShowAdd]         = useState(false);
    const [editingBudget, setEditingBudget] = useState(null);
    const [sortBy, setSortBy]           = useState('default');
    const [statusFilter, setStatus]     = useState('all');
    const [periodFilter, setPeriodFilter] = useState('all');
    const [form, setForm] = useState({
        name: '', amount: '', periodType: 'monthly', categoryId: '',
        startDate: new Date().toISOString().slice(0, 10),
        endDate: new Date(Date.now() + 30 * 864e5).toISOString().slice(0, 10)
    });

    useEffect(() => {
        Promise.all([budgetApi.getAll(), walletApi.getAll(), categoryApi.getAll()])
            .then(([b, w, c]) => {
                setBudgets(b.data);
                setCategories(c.data);
                if (w.data && w.data.length > 0) {
                    const code = w.data[0].currencyCode || 'VND';
                    setCurrencySymbol(code === 'USD' ? '$' : code === 'EUR' ? '€' : code === 'VND' ? '₫' : code);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const reload = () => budgetApi.getAll().then(b => setBudgets(b.data));

    const handleAdd = async (e) => {
        e.preventDefault();
        const payload = { ...form, categoryId: form.categoryId || null };
        try {
            if (editingBudget && editingBudget.id) {
                await budgetApi.update(editingBudget.id, payload);
            } else {
                await budgetApi.create(payload);
            }
            setShowAdd(false);
            setEditingBudget(null);
            reload();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDel = async (id) => {
        if (!confirm('Delete?')) return;
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
        if (periodFilter !== 'all') d = d.filter(b => b.periodType === periodFilter);
        if (statusFilter === 'on_track') d = d.filter(b => b.pct < 75);
        if (statusFilter === 'attention') d = d.filter(b => b.pct >= 75 && b.pct < 90);
        if (statusFilter === 'over') d = d.filter(b => b.pct >= 90);
        if (sortBy === 'name') d.sort((a, b) => a.name.localeCompare(b.name));
        if (sortBy === 'spent') d.sort((a, b) => b.pct - a.pct);
        if (sortBy === 'amount') d.sort((a, b) => b.amount - a.amount);
        return d;
    }, [enriched, statusFilter, sortBy, periodFilter]);

    const total  = enriched.reduce((s, b) => s + b.amount, 0);
    const spent  = enriched.reduce((s, b) => s + b.spent, 0);
    const left   = Math.max(total - spent, 0);
    const pctAll = total > 0 ? (spent / total) * 100 : 0;

    const expenses = useMemo(() => {
        return enriched
            .filter(b => b.spent > 0)
            .map(b => ({ cat: b.name, amt: b.spent }))
            .sort((a, b) => b.amt - a.amt)
            .slice(0, 5);
    }, [enriched]);
    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <div className="w-10 h-10 border-4 border-[#106E4E] border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <motion.div 
            initial="hidden" animate="visible" variants={fadeInUp}
            className="flex gap-7 max-w-[1600px] mx-auto w-full" style={{ alignItems: 'flex-start' }}
        >
            {/* ══ LEFT ══ */}
            <div className="flex-1 min-w-0 space-y-5">
                {/* Toolbar */}
                <div className="flex items-center gap-3 flex-wrap">
                    <div className="relative">
                        <select value={periodFilter} onChange={e => setPeriodFilter(e.target.value)}
                            className="appearance-none pl-4 pr-8 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-bold text-gray-600 focus:outline-none focus:border-[#106E4E] cursor-pointer hover:border-[#106E4E] transition-all">
                            <option value="all">All Periods</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                            <option value="weekly">Weekly</option>
                        </select>
                        <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>

                    <div className="relative">
                        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                            className="appearance-none pl-4 pr-8 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-bold text-gray-600 focus:outline-none focus:border-[#106E4E] cursor-pointer hover:border-[#106E4E] transition-all">
                            <option value="default">Sort by: Default</option>
                            <option value="name">Sort by: Name</option>
                            <option value="spent">Sort by: Most Spent</option>
                            <option value="amount">Sort by: Highest Limit</option>
                        </select>
                        <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>

                    <button onClick={() => setShowAdd(true)}
                        className="ml-auto flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#106E4E] text-white text-sm font-black hover:bg-[#0d5a3f] shadow-lg shadow-[#106E4E]/20 hover:shadow-[#106E4E]/40 hover:-translate-y-0.5 transition-all">
                        <Plus size={15} /> Add new budget
                    </button>
                </div>

                {/* Sub-filters + count */}
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <select value={statusFilter} onChange={e => setStatus(e.target.value)}
                            className="appearance-none pl-3.5 pr-7 py-1.5 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-600 focus:outline-none cursor-pointer hover:border-[#106E4E] transition-all">
                            <option value="all">Status ▾</option>
                            <option value="on_track">On Track</option>
                            <option value="attention">Need Attention</option>
                            <option value="over">Over Budget</option>
                        </select>
                        <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>

                    {(statusFilter !== 'all' || sortBy !== 'default' || periodFilter !== 'all') && (
                        <button onClick={() => { setStatus('all'); setSortBy('default'); setPeriodFilter('all'); }}
                            className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-gray-700 transition-all">
                            <RefreshCw size={11} /> Reset all
                        </button>
                    )}
                    <span className="text-xs text-gray-400 font-semibold ml-1">{displayed.length} items</span>
                </div>

                {/* Cards */}
                {displayed.length === 0 ? (
                    <motion.div variants={fadeInUp} className="bg-white rounded-3xl border border-dashed border-gray-200 p-16 flex flex-col items-center gap-4 text-center shadow-sm">
                        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-2 shadow-inner">
                            <Target size={40} className="text-[#106E4E] animate-bounce-slow" />
                        </div>
                        <p className="text-xl font-black text-gray-900">No budgets yet</p>
                        <p className="text-sm text-gray-400 max-w-xs font-medium">Create your first budget to start tracking spending per category.</p>
                        <button onClick={() => setShowAdd(true)} className="mt-4 px-6 py-3 bg-[#106E4E] text-white rounded-xl font-bold text-sm hover:bg-[#0d5a3f] shadow-md shadow-[#106E4E]/20 hover:-translate-y-0.5 transition-all">
                            <Plus size={16} className="inline mr-1.5" /> Create Budget
                        </button>
                    </motion.div>
                ) : (
                    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {displayed.map(b => {
                            const color = b.pct >= 90 ? '#f43f5e' : b.pct >= 75 ? '#f59e0b' : '#106E4E';
                            return (
                                <motion.div variants={fadeInUp} key={b.id}
                                    className="bg-white rounded-[1.25rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 group relative overflow-hidden">
                                    {/* Soft glow blob */}
                                    <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full blur-2xl opacity-[0.05] pointer-events-none"
                                        style={{ background: color }} />

                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-50/50 flex items-center justify-center">
                                                <IconFor name={b.name} className="text-[#106E4E]" />
                                            </div>
                                            <h3 className="text-base font-black text-gray-900 leading-tight">{b.name}</h3>
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-all">
                                                <Pencil size={14} />
                                            </button>
                                            <button onClick={() => handleDel(b.id)}
                                                className="p-1.5 rounded-lg hover:bg-rose-50 text-gray-400 hover:text-rose-500 transition-all">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Body: donut + stats */}
                                    <div className="flex items-center gap-5">
                                        {/* Donut */}
                                        <div className="relative flex-shrink-0 w-[110px] h-[110px]">
                                            <DonutRing pct={b.pct} color={color} />
                                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
                                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-wide">{Math.round(b.pct)}% spent</span>
                                                <span className="text-[13px] font-black text-gray-800 tabular-nums leading-none">${fmt(b.spent, 0)}</span>
                                            </div>
                                        </div>

                                        {/* Right stats */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Remaining</p>
                                            <p className="font-black text-gray-900 tabular-nums leading-none">
                                                <span className="text-2xl">${fmt(b.left, 2)}</span>
                                                <span className="text-xs font-bold text-gray-300 ml-1">/ ${fmt(b.amount, 2)}</span>
                                            </p>

                                            {/* Thin progress bar */}
                                            <div className="w-full h-1.5 bg-gray-100 rounded-full mt-3 mb-3 overflow-hidden">
                                                <div className="h-full rounded-full transition-all duration-700"
                                                    style={{ width: `${Math.min(b.pct, 100)}%`, background: color }} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer: period */}
                                            <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                                                <Calendar size={10} />
                                                <span className="uppercase tracking-widest">{b.periodType}</span>
                                                <span className="ml-auto">{b.startDate} → {b.endDate}</span>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                    </motion.div>
                )}
            </div>

            {/* ══ RIGHT SIDEBAR ══ */}
            <div className="w-[288px] xl:w-[320px] flex-shrink-0 space-y-4">

                {/* Monthly summary */}
                <motion.div variants={fadeInUp} className="bg-white rounded-[1.25rem] border border-gray-100 shadow-sm p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-sm font-black text-gray-900">Monthly budget</h2>
                        <button className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-400 transition-all">
                            <MoreHorizontal size={15} />
                        </button>
                    </div>

                    {/* Total */}
                    <p className="text-3xl font-black text-gray-900 tabular-nums leading-none mb-2">
                        {currencySymbol}{fmt(total)}
                    </p>
                    <Badge pct={pctAll} />

                    {/* Gauge */}
                    <div className="relative mt-3 flex justify-center">
                        <SemiGauge pct={pctAll} />
                        {/* Center label (inside arc bottom) */}
                        <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-1">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">{Math.round(pctAll)}% spent</p>
                            <p className="text-xl font-black text-gray-900 tabular-nums">{currencySymbol}{fmt(spent, 0)}</p>
                        </div>
                        {/* Left corner: remaining */}
                        <div className="absolute bottom-0 left-2 text-right">
                            <p className="text-[8px] font-bold text-gray-400">{Math.round(100 - pctAll)}% left</p>
                            <p className="text-[10px] font-black text-gray-600">{currencySymbol}{fmt(left, 0)}</p>
                        </div>
                    </div>
                </motion.div>

                {/* Most expenses */}
                <motion.div variants={fadeInUp} className="bg-white rounded-[1.25rem] border border-gray-100 shadow-sm p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-black text-gray-900">Most expenses</h2>
                        <span className="text-[10px] font-bold text-gray-400 border border-gray-200 px-2.5 py-1 rounded-lg">This month</span>
                    </div>

                    {expenses.length === 0 ? (
                        <p className="text-xs text-gray-400 text-center py-6 font-medium">No expense records yet</p>
                    ) : (
                        <div className="space-y-4 mt-2">
                            {expenses.map(({ cat, amt }, i) => {
                                const bar = (amt / maxAmt) * 100;
                                const up = i < 2;
                                return (
                                    <div key={cat} className="flex items-center gap-3">
                                        {/* Icon bubble */}
                                        <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                                            <IconFor name={cat} className="text-[#106E4E]" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm font-black text-gray-900 tabular-nums">{currencySymbol}{fmt(amt, 0)}</span>
                                                <span className={`text-[9px] font-black flex items-center gap-px px-1.5 py-0.5 rounded-full ${up ? 'text-rose-500 bg-rose-50' : 'text-emerald-600 bg-emerald-50'}`}>
                                                    {up ? <ArrowUpRight size={10}/> : <ArrowDownRight size={10}/>}
                                                    {(bar * 0.25 + 1.5).toFixed(1)}%
                                                </span>
                                            </div>
                                            <p className="text-[10px] font-semibold text-gray-400 truncate mb-1.5">{cat}</p>
                                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full rounded-full transition-all duration-700"
                                                    style={{ width: `${bar}%`, background: up ? '#f43f5e' : '#106E4E' }} />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </motion.div>
            </div>

            {/* ══ Add Modal ══ */}
            <div className="fixed bottom-8 right-8 z-50">
                <button onClick={() => setShowAdd(true)} aria-label="Add new budget"
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gray-900 text-white shadow-lg hover:bg-gray-800 transition-all">
                    <Plus size={16} />
                    <span className="text-sm font-black">Add new budget</span>
                </button>
            </div>

            {showAdd && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-6 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-6 duration-300 border border-gray-100">
                        <div className="px-8 pt-8 pb-5 flex items-center justify-between border-b border-gray-100">
                            <h3 className="text-xl font-black text-gray-900">{editingBudget ? 'Edit Budget' : 'New Budget'}</h3>
                            <button onClick={() => { setShowAdd(false); setEditingBudget(null); }} className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-all">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleAdd} className="p-8 space-y-4 bg-slate-50/50">
                            {[
                                { label: 'Budget Name', key: 'name', type: 'text', ph: 'e.g. Food & Groceries' },
                                { label: `Limit (${currencySymbol})`, key: 'amount', type: 'number', ph: '500.00' },
                            ].map(({ label, key, type, ph }) => (
                                <div key={key} className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{label}</label>
                                    <input type={type} required value={form[key]}
                                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                                        placeholder={ph}
                                        className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl font-bold text-gray-900 focus:border-[#106E4E] focus:ring-4 focus:ring-[#106E4E]/10 outline-none transition-all placeholder:text-gray-300 shadow-sm" />
                                </div>
                            ))}

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Period</label>
                                    <select value={form.periodType} onChange={e => setForm(f => ({ ...f, periodType: e.target.value }))}
                                        className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl font-bold text-gray-900 focus:border-[#106E4E] focus:ring-4 focus:ring-[#106E4E]/10 outline-none transition-all appearance-none cursor-pointer shadow-sm">
                                        <option value="weekly">Weekly</option>
                                        <option value="monthly">Monthly</option>
                                        <option value="yearly">Yearly</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Category</label>
                                    <select value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value ? Number(e.target.value) : '' }))}
                                        className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl font-bold text-gray-900 focus:border-[#106E4E] focus:ring-4 focus:ring-[#106E4E]/10 outline-none transition-all appearance-none cursor-pointer shadow-sm">
                                        <option value="">No Category (All Expenses)</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {[['Start Date','startDate'],['End Date','endDate']].map(([lbl, key]) => (
                                    <div key={key} className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{lbl}</label>
                                        <input type="date" required value={form[key]}
                                            onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                                            className="w-full px-3 py-3.5 bg-white border border-gray-200 rounded-xl font-bold text-gray-900 focus:border-[#106E4E] focus:ring-4 focus:ring-[#106E4E]/10 outline-none transition-all shadow-sm" />
                                    </div>
                                ))}
                            </div>

                            <button type="submit"
                                className="w-full py-4 bg-[#106E4E] text-white font-black rounded-xl hover:bg-[#0d5a3f] shadow-lg shadow-[#106E4E]/20 hover:shadow-[#106E4E]/40 hover:-translate-y-0.5 transition-all text-sm mt-4">
                                Create Budget
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
