import React, { useState, useEffect, useMemo } from 'react';
import {
    Plus, Search, ChevronDown, ChevronLeft, ChevronRight,
    ArrowUpDown, ArrowUp, ArrowDown, X, Edit2, Hash, Wallet
} from 'lucide-react';
import { transactionApi } from '../services/transactionService';
import { walletApi } from '../services/walletService';
import { categoryApi } from '../services/categoryService';
import { tagApi } from '../services/tagService';


function SortHeader({ label, field, sortField, sortDir, onSort }) {
    const active = sortField === field;
    return (
        <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 cursor-pointer select-none whitespace-nowrap group"
            onClick={() => onSort(field)}>
            <span className="inline-flex items-center gap-1.5">
                {label}
                <span className={`transition-colors ${active ? 'text-[#106E4E]' : 'text-gray-300 group-hover:text-gray-400'}`}>
                    {active && sortDir === 'asc' ? <ArrowUp size={12} />
                        : active && sortDir === 'desc' ? <ArrowDown size={12} />
                            : <ArrowUpDown size={12} />}
                </span>
            </span>
        </th>
    );
}

export default function TransactionsPanel() {
    const [transactions, setTransactions] = useState([]);
    const [wallets, setWallets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);

    const [filterCategory, setFilterCategory] = useState('ALL');
    const [filterTag, setFilterTag] = useState('ALL');
    const [filterWallet, setFilterWallet] = useState('ALL');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [search, setSearch] = useState('');

    const [sortField, setSortField] = useState('date');
    const [sortDir, setSortDir] = useState('desc');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [form, setForm] = useState({
        amount: '', categoryId: '', walletId: '',
        date: new Date().toISOString().split('T')[0], time: '', note: '', tagIds: []
    });

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const [tRes, wRes, cRes, tagRes] = await Promise.all([
                transactionApi.getAll(), walletApi.getAll(), categoryApi.getAll(), tagApi.getAll()
            ]);
            setTransactions(tRes.data); setWallets(wRes.data); setCategories(cRes.data); setTags(tagRes.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleOpenForm = (transaction = null) => {
        if (transaction) {
            setEditingTransaction(transaction);
            setForm({
                amount: transaction.amount || '',
                categoryId: transaction.categoryId || '', walletId: transaction.walletId || '',
                date: transaction.date || new Date().toISOString().split('T')[0],
                time: transaction.time || '', note: transaction.note || '',
                tagIds: transaction.tagIds || []
            });
        } else {
            setEditingTransaction(null);
            setForm({ amount: '', categoryId: '', walletId: '',
                date: new Date().toISOString().split('T')[0], time: '', note: '', tagIds: [] });
        }
        setShowAdd(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingTransaction) {
                await transactionApi.update(editingTransaction.id, form);
            } else {
                await transactionApi.create(form);
            }
            setShowAdd(false);
            setEditingTransaction(null);
            setForm({ amount: '', categoryId: '', walletId: '',
                date: new Date().toISOString().split('T')[0], time: '', note: '', tagIds: [] });
            fetchData();
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Remove this transaction?')) return;
        try { await transactionApi.delete(id); fetchData(); }
        catch (err) { console.error(err); }
    };

    const handleSort = (field) => {
        if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortField(field); setSortDir('asc'); }
        setPage(1);
    };

    const filtered = useMemo(() => {
        let data = [...transactions];
        if (filterCategory !== 'ALL') data = data.filter(t => t.categoryId === Number(filterCategory));
        if (filterTag !== 'ALL') data = data.filter(t => t.tagIds?.includes(Number(filterTag)));
        if (filterWallet !== 'ALL') data = data.filter(t => t.walletId === Number(filterWallet));
        if (dateFrom) data = data.filter(t => t.date >= dateFrom);
        if (dateTo) data = data.filter(t => t.date <= dateTo);
        if (search) data = data.filter(t =>
            t.note?.toLowerCase().includes(search.toLowerCase())
        );
        data.sort((a, b) => {
            let av = a[sortField], bv = b[sortField];
            if (sortField === 'amount') { av = parseFloat(av) || 0; bv = parseFloat(bv) || 0; }
            if (av < bv) return sortDir === 'asc' ? -1 : 1;
            if (av > bv) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });
        return data;
    }, [transactions, filterCategory, filterTag, filterWallet, dateFrom, dateTo, search, sortField, sortDir]);

    const totalPages = Math.ceil(filtered.length / pageSize) || 1;
    const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
    const startEntry = filtered.length === 0 ? 0 : (page - 1) * pageSize + 1;
    const endEntry = Math.min(page * pageSize, filtered.length);

    const resetFilters = () => {
        setFilterCategory('ALL'); setFilterTag('ALL'); setFilterWallet('ALL');
        setDateFrom(''); setDateTo(''); setSearch(''); setPage(1);
    };
    const hasFilters = filterCategory !== 'ALL' || filterTag !== 'ALL' || filterWallet !== 'ALL' || dateFrom || dateTo || search;

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-[#106E4E] border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Filters bar */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm px-6 py-4">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-gray-400">category</span>
                        <div className="relative">
                            <select value={filterCategory} onChange={e => { setFilterCategory(e.target.value); setPage(1); }}
                                className="appearance-none pl-4 pr-9 py-2.5 rounded-2xl border-2 border-gray-200 bg-white text-gray-700 text-sm font-bold focus:outline-none focus:border-[#106E4E] cursor-pointer">
                                <option value="ALL">All Categories</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-gray-400">tag</span>
                        <div className="relative">
                            <select value={filterTag} onChange={e => { setFilterTag(e.target.value); setPage(1); }}
                                className="appearance-none pl-4 pr-9 py-2.5 rounded-2xl border-2 border-gray-200 bg-white text-gray-700 text-sm font-bold focus:outline-none focus:border-[#106E4E] cursor-pointer">
                                <option value="ALL">All Tags</option>
                                {tags.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-gray-400">wallet</span>
                        <div className="relative">
                            <select value={filterWallet} onChange={e => { setFilterWallet(e.target.value); setPage(1); }}
                                className="appearance-none pl-4 pr-9 py-2.5 rounded-2xl border-2 border-gray-200 bg-white text-gray-700 text-sm font-bold focus:outline-none focus:border-[#106E4E] cursor-pointer">
                                <option value="ALL">All Wallets</option>
                                {wallets.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                            </select>
                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                    <span className="text-gray-300 font-bold">·</span>
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-gray-400">from</span>
                        <div className="relative">
                            <input type="date" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setPage(1); }}
                                className="pl-4 pr-9 py-2.5 rounded-2xl border-2 border-gray-200 bg-white text-gray-700 text-sm font-bold focus:outline-none focus:border-[#106E4E] cursor-pointer" />
                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                        <span className="text-sm font-bold text-gray-400">to</span>
                        <div className="relative">
                            <input type="date" value={dateTo} onChange={e => { setDateTo(e.target.value); setPage(1); }}
                                className="pl-4 pr-9 py-2.5 rounded-2xl border-2 border-gray-200 bg-white text-gray-700 text-sm font-bold focus:outline-none focus:border-[#106E4E] cursor-pointer" />
                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                    <div className="relative ml-auto">
                        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="Search..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                            className="pl-10 pr-4 py-2.5 rounded-2xl border-2 border-gray-200 bg-white text-sm font-bold text-gray-700 focus:outline-none focus:border-[#106E4E] w-48 placeholder:text-gray-400 placeholder:font-medium" />
                    </div>
                    {hasFilters && (
                        <button onClick={resetFilters} className="p-2.5 rounded-2xl hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-all" title="Clear filters">
                            <X size={16} />
                        </button>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-[#106E4E]/5 border-b border-[#106E4E]/10">
                                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em] text-[#106E4E]">Date</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em] text-[#106E4E]">Time</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em] text-[#106E4E]">Note</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em] text-[#106E4E]">Category</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em] text-[#106E4E]">Tags</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em] text-[#106E4E]">Wallet</th>
                                <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-[0.2em] text-[#106E4E]">Amount</th>
                                <th className="px-6 py-4 w-20" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {paginated.length === 0 ? (
                                <tr><td colSpan={8} className="px-6 py-20 text-center text-gray-400 font-bold">No transactions found</td></tr>
                            ) : paginated.map(t => {
                                const dateStr = t.date ? new Date(t.date + 'T00:00:00').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
                                const timeStr = t.time ? t.time.substring(0, 5) : '—';
                                const txnTags = tags.filter(tag => t.tagIds?.includes(tag.id));
                                const wallet = wallets.find(w => w.id === t.walletId);
                                const category = categories.find(c => c.id === t.categoryId);
                                return (
                                    <tr key={t.id} className="hover:bg-gray-50/60 transition-colors group">
                                        <td className="px-6 py-5 text-sm font-bold text-gray-500 whitespace-nowrap">{dateStr}</td>
                                        <td className="px-6 py-5 text-sm font-bold text-gray-400 whitespace-nowrap">{timeStr}</td>
                                        <td className="px-6 py-5">
                                            <div>
                                                {t.note && <p className="text-sm font-bold text-gray-900 line-clamp-2">{t.note}</p>}
                                                {!t.note && <span className="text-xs text-gray-300 font-medium">—</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            {category ? (
                                                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase px-3 py-1.5 rounded-xl" style={{ backgroundColor: `${category.colorHex}20`, color: category.colorHex }}>
                                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: category.colorHex }} />
                                                    {category.name}
                                                </span>
                                            ) : t.categoryId ? (
                                                <span className="text-xs font-black uppercase tracking-widest text-gray-500 bg-gray-100 px-3 py-1 rounded-xl">ID: {t.categoryId}</span>
                                            ) : (
                                                <span className="text-xs text-gray-300 font-medium">—</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-wrap gap-1.5">
                                                {txnTags.length > 0 ? txnTags.map(tag => (
                                                    <span key={tag.id} className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border" style={{ backgroundColor: `${tag.colorHex}10`, color: tag.colorHex, borderColor: `${tag.colorHex}30` }}>
                                                        {tag.name}
                                                    </span>
                                                )) : (
                                                    <span className="text-xs text-gray-300 font-medium">—</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            {wallet ? (
                                                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-gray-100 text-gray-600">
                                                    <Wallet size={12} />
                                                    {wallet.name}
                                                </span>
                                            ) : (
                                                <span className="text-xs text-gray-300 font-medium">—</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <span className="text-base font-black tabular-nums text-gray-900">
                                                ${t.amount ? parseFloat(t.amount).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : '0'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-5 text-right">
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                                <button onClick={() => handleOpenForm(t)}
                                                    className="p-2 rounded-xl text-gray-300 hover:text-[#106E4E] hover:bg-emerald-50 transition-all">
                                                    <Edit2 size={15} />
                                                </button>
                                                <button onClick={() => handleDelete(t.id)}
                                                    className="p-2 rounded-xl text-gray-300 hover:text-rose-500 hover:bg-rose-50 transition-all">
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination footer */}
                <div className="px-6 py-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-gray-400">Show</span>
                        <div className="relative">
                            <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
                                className="appearance-none pl-4 pr-8 py-2 rounded-2xl border-2 border-gray-200 bg-white text-sm font-black text-gray-700 focus:outline-none focus:border-[#106E4E] cursor-pointer">
                                {[10, 25, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                        <span className="text-sm font-bold text-gray-400">entries</span>
                        <span className="text-sm font-bold text-gray-500 ml-2">
                            Showing {startEntry}–{endEntry} of {filtered.length} entries
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl border-2 border-gray-200 text-sm font-black text-gray-500 hover:border-[#106E4E] hover:text-[#106E4E] disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                            <ChevronLeft size={14} /> Previous
                        </button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let p;
                            if (totalPages <= 5) p = i + 1;
                            else if (page <= 3) p = i + 1;
                            else if (page >= totalPages - 2) p = totalPages - 4 + i;
                            else p = page - 2 + i;
                            return (
                                <button key={p} onClick={() => setPage(p)}
                                    className={`w-10 h-10 rounded-2xl text-sm font-black transition-all ${page === p ? 'bg-[#106E4E] text-white shadow-lg shadow-[#106E4E]/20' : 'border-2 border-gray-200 text-gray-500 hover:border-[#106E4E] hover:text-[#106E4E]'
                                        }`}>
                                    {p}
                                </button>
                            );
                        })}
                        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl border-2 border-gray-200 text-sm font-black text-gray-500 hover:border-[#106E4E] hover:text-[#106E4E] disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                            Next <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showAdd && (
                <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl animate-in slide-in-from-bottom-8 duration-500 overflow-hidden max-h-[90vh] overflow-y-auto">
                        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight">{editingTransaction ? 'Edit Transaction' : 'Record Activity'}</h3>
                            <button onClick={() => { setShowAdd(false); setEditingTransaction(null); }} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-2xl transition-all">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8">
                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount ($)</label>
                                    <input type="number" required value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 tabular-nums focus:bg-white focus:ring-4 focus:ring-[#106E4E]/10 focus:border-[#106E4E] outline-none transition-all placeholder:text-gray-300"
                                        placeholder="0.00" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</label>
                                    <select value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 focus:bg-white focus:ring-4 focus:ring-[#106E4E]/10 focus:border-[#106E4E] outline-none transition-all appearance-none">
                                        <option value="">Select category</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</label>
                                    <input type="date" required value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 focus:bg-white focus:ring-4 focus:ring-[#106E4E]/10 focus:border-[#106E4E] outline-none transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Time</label>
                                    <input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 focus:bg-white focus:ring-4 focus:ring-[#106E4E]/10 focus:border-[#106E4E] outline-none transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tags</label>
                                    <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                                        {tags.map(tag => (
                                            <button
                                                key={tag.id}
                                                type="button"
                                                onClick={() => {
                                                    const currentIds = form.tagIds || [];
                                                    const newIds = currentIds.includes(tag.id)
                                                        ? currentIds.filter(id => id !== tag.id)
                                                        : [...currentIds, tag.id];
                                                    setForm(f => ({ ...f, tagIds: newIds }));
                                                }}
                                                className={`px-3 py-2 rounded-xl text-xs font-bold uppercase transition-all ${form.tagIds?.includes(tag.id) ? 'ring-2 ring-offset-1' : 'opacity-60 hover:opacity-100'}`}
                                                style={{
                                                    backgroundColor: form.tagIds?.includes(tag.id) ? tag.colorHex : `${tag.colorHex}30`,
                                                    color: form.tagIds?.includes(tag.id) ? 'white' : tag.colorHex,
                                                    ringColor: tag.colorHex
                                                }}
                                            >
                                                {tag.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Wallet</label>
                                    <select required value={form.walletId} onChange={e => setForm(f => ({ ...f, walletId: e.target.value }))}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 focus:bg-white focus:ring-4 focus:ring-[#106E4E]/10 focus:border-[#106E4E] outline-none transition-all appearance-none">
                                        <option value="">Select wallet</option>
                                        {wallets.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                                    </select>
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Note</label>
                                    <textarea value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-medium text-sm text-gray-900 focus:bg-white focus:ring-4 focus:ring-[#106E4E]/10 focus:border-[#106E4E] outline-none transition-all h-24 resize-none placeholder:text-gray-300"
                                        placeholder="Optional details..." />
                                </div>
                            </div>
                            <button type="submit"
                                className="w-full py-5 mt-8 bg-[#106E4E] text-white font-black rounded-2xl hover:bg-[#0d593f] shadow-xl shadow-[#106E4E]/20 transition-all">
                                {editingTransaction ? 'Save Changes' : 'Commit to Ledger'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Floating Add button */}
            <button onClick={() => handleOpenForm()}
                className="fixed bottom-8 right-8 bg-gray-900 text-white p-5 rounded-full font-black text-sm hover:bg-[#106E4E] transition-all flex items-center gap-2 shadow-2xl shadow-gray-900/20 z-40">
                <Plus size={22} />
            </button>
        </div>
    );
}
