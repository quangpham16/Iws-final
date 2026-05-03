import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Trash2, RefreshCcw, Calendar, Activity, X, Edit2, AlertTriangle, Bell, Tag, Search } from 'lucide-react';
import { subscriptionApi } from '../services/api';

const FREQUENCIES = [
    { value: 'weekly',  label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly',  label: 'Yearly' },
];

const CURRENCIES = ['USD', 'EUR', 'VND', 'GBP', 'JPY', 'SGD'];

const STATUS_CONFIG = {
    active:    { label: 'Active',    cls: 'bg-emerald-100 text-emerald-700' },
    paused:    { label: 'Paused',    cls: 'bg-amber-100 text-amber-700' },
    cancelled: { label: 'Cancelled', cls: 'bg-rose-100 text-rose-600' },
};

const EMPTY_FORM = {
    name: '', estimatedAmount: '', currencyCode: 'USD', frequency: 'monthly',
    nextDueDate: '', trialEndDate: '', category: '', reminderDays: 3, note: '', status: 'active',
};

function toMonthly(amount, frequency) {
    const a = parseFloat(amount) || 0;
    if (frequency === 'yearly')  return a / 12;
    if (frequency === 'weekly')  return a * 4.33;
    return a;
}

function daysUntil(dateStr) {
    if (!dateStr) return null;
    const diff = new Date(dateStr) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function SubscriptionsPanel() {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingSub, setEditingSub] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');

    useEffect(() => { fetchSubs(); }, []);

    const fetchSubs = async () => {
        try { const res = await subscriptionApi.getAll(); setSubscriptions(res.data); }
        catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const openForm = (sub = null) => {
        if (sub) {
            setEditingSub(sub);
            setForm({
                name: sub.name || '',
                estimatedAmount: sub.estimatedAmount || '',
                currencyCode: sub.currencyCode || 'USD',
                frequency: sub.frequency || 'monthly',
                nextDueDate: sub.nextDueDate || '',
                trialEndDate: sub.trialEndDate || '',
                category: sub.category || '',
                reminderDays: sub.reminderDays ?? 3,
                note: sub.note || '',
                status: sub.status || 'active',
            });
        } else {
            setEditingSub(null);
            setForm(EMPTY_FORM);
        }
        setShowForm(true);
    };

    const closeForm = () => { setShowForm(false); setEditingSub(null); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingSub) {
                await subscriptionApi.update(editingSub.id, form);
            } else {
                await subscriptionApi.create(form);
            }
            closeForm();
            fetchSubs();
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Remove this subscription?')) return;
        try { await subscriptionApi.delete(id); fetchSubs(); }
        catch (err) { console.error(err); }
    };

    const handleStatusToggle = async (sub) => {
        const next = sub.status === 'active' ? 'paused' : 'active';
        try {
            await subscriptionApi.update(sub.id, { ...sub, status: next });
            fetchSubs();
        } catch (err) { console.error(err); }
    };

    const filtered = useMemo(() => {
        let data = [...subscriptions];
        if (filterStatus !== 'ALL') data = data.filter(s => s.status === filterStatus);
        if (search) data = data.filter(s =>
            s.name?.toLowerCase().includes(search.toLowerCase()) ||
            s.category?.toLowerCase().includes(search.toLowerCase())
        );
        return data;
    }, [subscriptions, filterStatus, search]);

    const monthlyTotal = useMemo(() =>
        subscriptions
            .filter(s => s.status === 'active')
            .reduce((sum, s) => sum + toMonthly(s.estimatedAmount, s.frequency), 0),
    [subscriptions]);

    const yearlyTotal = monthlyTotal * 12;

    const trialExpiring = useMemo(() =>
        subscriptions.filter(s => {
            const d = daysUntil(s.trialEndDate);
            return d !== null && d >= 0 && d <= 7;
        }),
    [subscriptions]);

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-[#106E4E] border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header with Stats */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
                        <RefreshCcw size={24} className="text-violet-600" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-gray-900">Subscriptions</h2>
                        <p className="text-xs text-gray-400 font-medium">
                            {subscriptions.filter(s => s.status === 'active').length} active · ${monthlyTotal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}/mo
                        </p>
                    </div>
                </div>
                <button onClick={() => openForm()}
                    className="flex items-center gap-2 bg-[#106E4E] hover:bg-[#0d593f] text-white px-5 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-100 active:scale-95">
                    <Plus size={18} /> Add Subscription
                </button>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl border border-gray-100 p-4">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Monthly</p>
                    <p className="text-2xl font-black text-gray-900">
                        ${monthlyTotal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-4">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Yearly</p>
                    <p className="text-2xl font-black text-gray-900">
                        ${yearlyTotal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-4">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total</p>
                    <p className="text-2xl font-black text-gray-900">{subscriptions.length}</p>
                </div>
            </div>

            {/* Trial Warnings */}
            {trialExpiring.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-[1.5rem] p-4 flex items-start gap-3">
                    <AlertTriangle size={18} className="text-amber-500 mt-0.5 shrink-0" />
                    <div>
                        <p className="font-black text-amber-800 text-sm">Free trial expiring soon</p>
                        <p className="text-amber-600 text-xs font-medium mt-0.5">
                            {trialExpiring.map(s => {
                                const d = daysUntil(s.trialEndDate);
                                return `${s.name} (${d === 0 ? 'today' : `${d}d`})`;
                            }).join(' · ')}
                        </p>
                    </div>
                </div>
            )}

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-4">
                <div className="relative">
                    <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Search..." value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="pl-10 pr-4 py-2.5 rounded-2xl border-2 border-gray-200 bg-white text-sm font-bold text-gray-700 focus:outline-none focus:border-[#106E4E] w-48 placeholder:text-gray-400" />
                </div>
                <div className="flex items-center gap-2">
                    {['ALL', 'active', 'paused', 'cancelled'].map(s => (
                        <button key={s} onClick={() => setFilterStatus(s)}
                            className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${filterStatus === s ? 'bg-[#106E4E] text-white shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                            {s === 'ALL' ? 'All' : s}
                        </button>
                    ))}
                </div>
                <button onClick={() => openForm()}
                    className="ml-auto bg-gray-900 text-white px-5 py-3 rounded-2xl font-black text-sm hover:bg-[#106E4E] transition-all flex items-center gap-2 shadow-lg">
                    <Plus size={16} /> Add Service
                </button>
            </div>

            {/* Cards Grid */}
            {filtered.length === 0 ? (
                <div className="bg-white p-16 rounded-[2.5rem] border border-dashed border-gray-200 flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6">
                        <RefreshCcw size={40} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-2 tracking-tight">No subscriptions found</h3>
                    <p className="text-gray-400 font-medium max-w-md text-sm">Add recurring services like Netflix, Spotify, or gym memberships.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filtered.map((sub) => {
                        const statusCfg = STATUS_CONFIG[sub.status] || STATUS_CONFIG.active;
                        const daysLeft = daysUntil(sub.nextDueDate);
                        const trialDays = daysUntil(sub.trialEndDate);
                        const isTrialExpiring = trialDays !== null && trialDays >= 0 && trialDays <= 7;
                        const isCancelled = sub.status === 'cancelled';
                        return (
                            <div key={sub.id} className={`bg-white p-7 rounded-[2rem] border shadow-sm hover:shadow-xl transition-all group relative overflow-hidden ${isCancelled ? 'border-gray-100 opacity-60' : 'border-gray-100'}`}>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:bg-[#106E4E]/10 transition-colors duration-700" />
                                <div className="relative z-10">
                                    {/* Header row */}
                                    <div className="flex items-start justify-between mb-5">
                                        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
                                            <RefreshCcw size={22} />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${statusCfg.cls}`}>
                                                {statusCfg.label}
                                            </span>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                                <button onClick={() => openForm(sub)}
                                                    className="p-1.5 text-gray-300 hover:text-[#106E4E] hover:bg-emerald-50 rounded-xl transition-all">
                                                    <Edit2 size={14} />
                                                </button>
                                                <button onClick={() => handleDelete(sub.id)}
                                                    className="p-1.5 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Name & Category */}
                                    <h3 className="text-xl font-black text-gray-900 tracking-tight leading-tight">{sub.name}</h3>
                                    {sub.category && (
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <Tag size={11} className="text-gray-400" />
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{sub.category}</span>
                                        </div>
                                    )}

                                    {/* Amount */}
                                    <div className="mt-4 mb-5">
                                        <p className="text-3xl font-black text-gray-900 tabular-nums">
                                            {sub.currencyCode === 'USD' ? '$' : sub.currencyCode === 'EUR' ? '€' : sub.currencyCode === 'VND' ? '₫' : ''}{parseFloat(sub.estimatedAmount || 0).toLocaleString()}
                                        </p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">per {sub.frequency}</p>
                                    </div>

                                    {/* Details */}
                                    <div className="space-y-2.5 pt-5 border-t border-gray-50">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <Calendar size={13} />
                                                <span className="font-bold uppercase tracking-widest text-[10px]">Next Bill</span>
                                            </div>
                                            <span className={`font-bold text-sm ${daysLeft !== null && daysLeft <= 3 ? 'text-rose-500' : 'text-gray-900'}`}>
                                                {sub.nextDueDate ? new Date(sub.nextDueDate + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                                                {daysLeft !== null && daysLeft >= 0 && daysLeft <= 7 && (
                                                    <span className="ml-1 text-[10px] text-rose-400 font-black">({daysLeft}d)</span>
                                                )}
                                            </span>
                                        </div>

                                        {sub.reminderDays != null && (
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <Bell size={13} />
                                                    <span className="font-bold uppercase tracking-widest text-[10px]">Reminder</span>
                                                </div>
                                                <span className="font-bold text-sm text-gray-700">{sub.reminderDays}d before</span>
                                            </div>
                                        )}

                                        {sub.trialEndDate && (
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-amber-400">
                                                    <AlertTriangle size={13} />
                                                    <span className="font-bold uppercase tracking-widest text-[10px]">Trial ends</span>
                                                </div>
                                                <span className={`font-bold text-sm ${isTrialExpiring ? 'text-amber-600' : 'text-gray-700'}`}>
                                                    {new Date(sub.trialEndDate + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                    {trialDays !== null && trialDays >= 0 && <span className="ml-1 text-[10px] text-amber-500 font-black">({trialDays}d)</span>}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Toggle Active/Paused */}
                                    {sub.status !== 'cancelled' && (
                                        <button onClick={() => handleStatusToggle(sub)}
                                            className={`w-full mt-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${sub.status === 'active' ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}>
                                            {sub.status === 'active' ? 'Pause' : 'Resume'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Add / Edit Modal */}
            {showForm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-500 max-h-[90vh] overflow-y-auto">
                        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                                {editingSub ? 'Edit Subscription' : 'Add Subscription'}
                            </h3>
                            <button onClick={closeForm} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-2xl transition-all">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-5">

                            {/* Service Name */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Service Name</label>
                                <input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 focus:bg-white focus:ring-4 focus:ring-[#106E4E]/10 focus:border-[#106E4E] outline-none transition-all placeholder:text-gray-300"
                                    placeholder="e.g. Netflix, Spotify" />
                            </div>

                            {/* Amount + Currency */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount</label>
                                    <input type="number" step="0.01" required value={form.estimatedAmount} onChange={e => setForm(f => ({ ...f, estimatedAmount: e.target.value }))}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 tabular-nums focus:bg-white focus:ring-4 focus:ring-[#106E4E]/10 focus:border-[#106E4E] outline-none transition-all placeholder:text-gray-300"
                                        placeholder="15.99" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Currency</label>
                                    <select value={form.currencyCode} onChange={e => setForm(f => ({ ...f, currencyCode: e.target.value }))}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 focus:bg-white focus:ring-4 focus:ring-[#106E4E]/10 focus:border-[#106E4E] outline-none transition-all appearance-none">
                                        {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Billing Cycle + Status */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Billing Cycle</label>
                                    <select value={form.frequency} onChange={e => setForm(f => ({ ...f, frequency: e.target.value }))}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 focus:bg-white focus:ring-4 focus:ring-[#106E4E]/10 focus:border-[#106E4E] outline-none transition-all appearance-none">
                                        {FREQUENCIES.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</label>
                                    <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 focus:bg-white focus:ring-4 focus:ring-[#106E4E]/10 focus:border-[#106E4E] outline-none transition-all appearance-none">
                                        <option value="active">Active</option>
                                        <option value="paused">Paused</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                            </div>

                            {/* Next Billing Date + Reminder */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Next Billing Date</label>
                                    <input type="date" required value={form.nextDueDate} onChange={e => setForm(f => ({ ...f, nextDueDate: e.target.value }))}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 focus:bg-white focus:ring-4 focus:ring-[#106E4E]/10 focus:border-[#106E4E] outline-none transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Remind X Days Before</label>
                                    <input type="number" min="0" max="30" value={form.reminderDays} onChange={e => setForm(f => ({ ...f, reminderDays: parseInt(e.target.value) || 0 }))}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 tabular-nums focus:bg-white focus:ring-4 focus:ring-[#106E4E]/10 focus:border-[#106E4E] outline-none transition-all" />
                                </div>
                            </div>

                            {/* Trial End Date + Category */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Trial End Date</label>
                                    <input type="date" value={form.trialEndDate} onChange={e => setForm(f => ({ ...f, trialEndDate: e.target.value }))}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 focus:bg-white focus:ring-4 focus:ring-[#106E4E]/10 focus:border-[#106E4E] outline-none transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</label>
                                    <input type="text" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 focus:bg-white focus:ring-4 focus:ring-[#106E4E]/10 focus:border-[#106E4E] outline-none transition-all placeholder:text-gray-300"
                                        placeholder="e.g. Entertainment" />
                                </div>
                            </div>

                            {/* Note */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Note</label>
                                <textarea value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-medium text-sm text-gray-900 focus:bg-white focus:ring-4 focus:ring-[#106E4E]/10 focus:border-[#106E4E] outline-none transition-all h-20 resize-none placeholder:text-gray-300"
                                    placeholder="Optional details..." />
                            </div>

                            <button type="submit"
                                className="w-full py-5 bg-[#106E4E] text-white font-black rounded-2xl hover:bg-[#0d593f] shadow-xl shadow-[#106E4E]/20 transition-all">
                                {editingSub ? 'Save Changes' : 'Track Subscription'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
