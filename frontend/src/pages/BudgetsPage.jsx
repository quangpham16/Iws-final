import React, { useState, useEffect, useMemo } from 'react';
import { Plus, MoreHorizontal, RefreshCw, ChevronDown, CheckCircle, AlertCircle, Pencil, X, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { budgetApi } from '../services/api';
import { transactionApi } from '../services/transactionService';

/* ─── SVG Donut ─── */
function DonutRing({ pct = 0, size = 110, stroke = 12, color = '#7C6EF2' }) {
    const r = (size - stroke) / 2;
    const circ = 2 * Math.PI * r;
    const filled = Math.min(pct / 100, 1) * circ;
    return (
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
            <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#F0EFFE" strokeWidth={stroke} />
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
            <path d={d} fill="none" stroke="#F0EFFE" strokeWidth={sw} strokeLinecap="round" />
            <path d={d} fill="none" stroke="#7C6EF2" strokeWidth={sw} strokeLinecap="round"
                strokeDasharray={`${filled} ${arc}`} style={{ transition: 'stroke-dasharray 1.2s ease' }} />
        </svg>
    );
}

/* ─── Badge ─── */
function Badge({ pct }) {
    if (pct >= 90) return <span className="inline-flex items-center gap-1 text-[10px] font-black text-red-500 bg-red-50 px-2.5 py-1 rounded-full"><AlertCircle size={10}/>over budget</span>;
    if (pct >= 75) return <span className="inline-flex items-center gap-1 text-[10px] font-black text-amber-500 bg-amber-50 px-2.5 py-1 rounded-full"><AlertCircle size={10}/>need attention</span>;
    return <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full"><CheckCircle size={10}/>on track</span>;
}

const ICONS = { food:'🍔', groceries:'🛒', dining:'🍽️', cafe:'☕', coffee:'☕', travel:'✈️', health:'💊', beauty:'💄', entertainment:'🎬', shopping:'🛍️', invest:'📈', education:'🎓', rent:'🏠', transport:'🚗', utility:'⚡' };
const iconFor = n => { const k = Object.keys(ICONS).find(k => n?.toLowerCase().includes(k)); return k ? ICONS[k] : '💰'; };

const fmt = (n, d = 2) => Number(n).toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d });

export default function BudgetsPage() {
    const [budgets, setBudgets]         = useState([]);
    const [transactions, setTx]         = useState([]);
    const [loading, setLoading]         = useState(true);
    const [showAdd, setShowAdd]         = useState(false);
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
        await budgetApi.create(form).catch(console.error);
        setShowAdd(false);
        reload();
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
            <div className="w-10 h-10 border-4 border-[#7C6EF2] border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="flex gap-7 max-w-[1600px] mx-auto w-full animate-in fade-in duration-500" style={{ alignItems: 'flex-start' }}>

            {/* ══ LEFT ══ */}
            <div className="flex-1 min-w-0 space-y-5">

                {/* Toolbar */}
                <div className="flex items-center gap-3 flex-wrap">
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-gray-200 bg-white text-sm font-bold text-gray-600 hover:border-[#7C6EF2] transition-all">
                        <Calendar size={14} className="text-gray-400" /> This month
                    </button>

                    <div className="relative">
                        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                            className="appearance-none pl-4 pr-8 py-2.5 rounded-xl border-2 border-gray-200 bg-white text-sm font-bold text-gray-600 focus:outline-none focus:border-[#7C6EF2] cursor-pointer">
                            <option value="default">Sort by: Default</option>
                            <option value="name">Sort by: Name</option>
                            <option value="spent">Sort by: Most Spent</option>
                            <option value="amount">Sort by: Highest Limit</option>
                        </select>
                        <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>

                    <button onClick={() => setShowAdd(true)}
                        className="ml-auto flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7C6EF2] text-white text-sm font-black hover:bg-[#6A5CE0] shadow-lg shadow-[#7C6EF2]/20 transition-all">
                        <Plus size={15} /> Add new budget
                    </button>
                </div>

                {/* Sub-filters + count */}
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <select value={statusFilter} onChange={e => setStatus(e.target.value)}
                            className="appearance-none pl-3.5 pr-7 py-1.5 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-600 focus:outline-none cursor-pointer">
                            <option value="all">Status ▾</option>
                            <option value="on_track">On Track</option>
                            <option value="attention">Need Attention</option>
                            <option value="over">Over Budget</option>
                        </select>
                        <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>

                    {(statusFilter !== 'all' || sortBy !== 'default') && (
                        <button onClick={() => { setStatus('all'); setSortBy('default'); }}
                            className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-gray-700 transition-all">
                            <RefreshCw size={11} /> Reset all
                        </button>
                    )}
                    <span className="text-xs text-gray-400 font-semibold ml-1">{displayed.length} items</span>
                </div>

                {/* Cards */}
                {displayed.length === 0 ? (
                    <div className="bg-white rounded-3xl border-2 border-dashed border-gray-200 p-16 flex flex-col items-center gap-3 text-center">
                        <span className="text-5xl">💰</span>
                        <p className="text-lg font-black text-gray-900">No budgets yet</p>
                        <p className="text-sm text-gray-400 max-w-xs">Create your first budget to start tracking spending per category.</p>
                        <button onClick={() => setShowAdd(true)} className="mt-2 px-6 py-3 bg-[#7C6EF2] text-white rounded-xl font-bold text-sm hover:bg-[#6A5CE0] transition-all">
                            <Plus size={14} className="inline mr-1.5" /> Add budget
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {displayed.map(b => {
                            const color = b.pct >= 90 ? '#ef4444' : b.pct >= 75 ? '#f59e0b' : '#7C6EF2';
                            return (
                                <div key={b.id}
                                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 p-6 group relative overflow-hidden">
                                    {/* Soft glow blob */}
                                    <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full blur-2xl opacity-[0.07] pointer-events-none"
                                        style={{ background: color }} />

                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-5">
                                        <div className="flex items-center gap-2.5">
                                            <span className="text-xl">{iconFor(b.name)}</span>
                                            <h3 className="text-[15px] font-black text-gray-900 leading-tight">{b.name}</h3>
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-all">
                                                <Pencil size={13} />
                                            </button>
                                            <button onClick={() => handleDel(b.id)}
                                                className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all">
                                                <X size={13} />
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
                                                <span className="text-[1.5rem]">${fmt(b.left, 2)}</span>
                                                <span className="text-sm font-bold text-gray-300 ml-1">/ ${fmt(b.amount, 2)}</span>
                                            </p>

                                            {/* Thin progress bar */}
                                            <div className="w-full h-1.5 bg-gray-100 rounded-full mt-3 mb-3 overflow-hidden">
                                                <div className="h-full rounded-full transition-all duration-700"
                                                    style={{ width: `${Math.min(b.pct, 100)}%`, background: color }} />
                                            </div>

                                            <Badge pct={b.pct} />
                                        </div>
                                    </div>

                                    {/* Footer: period */}
                                    <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                                        <Calendar size={10} />
                                        <span className="uppercase tracking-widest">{b.periodType}</span>
                                        <span className="ml-auto">{b.startDate} → {b.endDate}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ══ RIGHT SIDEBAR ══ */}
            <div className="w-[288px] xl:w-[320px] flex-shrink-0 space-y-4">

                {/* Monthly summary */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-sm font-black text-gray-900">Monthly budget</h2>
                        <button className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-400 transition-all">
                            <MoreHorizontal size={15} />
                        </button>
                    </div>

                    {/* Total */}
                    <p className="text-3xl font-black text-gray-900 tabular-nums leading-none mb-2">
                        ${fmt(total)}
                    </p>
                    <Badge pct={pctAll} />

                    {/* Gauge */}
                    <div className="relative mt-3 flex justify-center">
                        <SemiGauge pct={pctAll} />
                        {/* Center label (inside arc bottom) */}
                        <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-1">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">{Math.round(pctAll)}% spent</p>
                            <p className="text-xl font-black text-gray-900 tabular-nums">${fmt(spent, 0)}</p>
                        </div>
                        {/* Left corner: remaining */}
                        <div className="absolute bottom-0 left-2 text-right">
                            <p className="text-[8px] font-bold text-gray-400">{Math.round(100 - pctAll)}% left</p>
                            <p className="text-[10px] font-black text-gray-600">${fmt(left, 0)}</p>
                        </div>
                    </div>
                </div>

                {/* Most expenses */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-black text-gray-900">Most expenses</h2>
                        <span className="text-[10px] font-bold text-gray-400 border border-gray-200 px-2.5 py-1 rounded-lg">This month</span>
                    </div>

                    {expenses.length === 0 ? (
                        <p className="text-xs text-gray-400 text-center py-6">No expense records yet</p>
                    ) : (
                        <div className="space-y-3.5">
                            {expenses.map(({ cat, amt }, i) => {
                                const bar = (amt / maxAmt) * 100;
                                const up = i < 2;
                                return (
                                    <div key={cat} className="flex items-center gap-3">
                                        {/* Icon bubble */}
                                        <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-sm flex-shrink-0">
                                            {iconFor(cat)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[13px] font-black text-gray-900 tabular-nums">${fmt(amt, 0)}</span>
                                                <span className={`text-[9px] font-black flex items-center gap-px px-1.5 py-0.5 rounded-full ${up ? 'text-red-500 bg-red-50' : 'text-emerald-600 bg-emerald-50'}`}>
                                                    {up ? <ArrowUpRight size={9}/> : <ArrowDownRight size={9}/>}
                                                    {(bar * 0.25 + 1.5).toFixed(1)}%
                                                </span>
                                            </div>
                                            <p className="text-[10px] font-semibold text-gray-400 truncate mb-1">{cat}</p>
                                            <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full rounded-full transition-all duration-700"
                                                    style={{ width: `${bar}%`, background: up ? '#f87171' : '#7C6EF2' }} />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* ══ Add Modal ══ */}
            {showAdd && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-6 duration-300">
                        <div className="px-8 pt-8 pb-5 flex items-center justify-between border-b border-gray-100">
                            <h3 className="text-xl font-black text-gray-900">New Budget</h3>
                            <button onClick={() => setShowAdd(false)} className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-all">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleAdd} className="p-8 space-y-4">
                            {[
                                { label: 'Budget Name', key: 'name', type: 'text', ph: 'e.g. Food & Groceries' },
                                { label: 'Limit ($)',   key: 'amount', type: 'number', ph: '500.00' },
                            ].map(({ label, key, type, ph }) => (
                                <div key={key} className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</label>
                                    <input type={type} required value={form[key]}
                                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                                        placeholder={ph}
                                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 focus:bg-white focus:border-[#7C6EF2] focus:ring-2 focus:ring-[#7C6EF2]/10 outline-none transition-all placeholder:text-gray-300" />
                                </div>
                            ))}

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Period</label>
                                <select value={form.periodType} onChange={e => setForm(f => ({ ...f, periodType: e.target.value }))}
                                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 focus:bg-white focus:border-[#7C6EF2] outline-none transition-all appearance-none cursor-pointer">
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="yearly">Yearly</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {[['Start Date','startDate'],['End Date','endDate']].map(([lbl, key]) => (
                                    <div key={key} className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{lbl}</label>
                                        <input type="date" required value={form[key]}
                                            onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                                            className="w-full px-3 py-3.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 focus:bg-white focus:border-[#7C6EF2] outline-none transition-all" />
                                    </div>
                                ))}
                            </div>

                            <button type="submit"
                                className="w-full py-4 bg-[#7C6EF2] text-white font-black rounded-xl hover:bg-[#6A5CE0] shadow-lg shadow-[#7C6EF2]/20 transition-all text-sm mt-2">
                                Create Budget
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
