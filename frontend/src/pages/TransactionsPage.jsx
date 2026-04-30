import React, { useState, useEffect } from 'react';
import { 
    Plus, 
    Search, 
    ArrowUpRight, 
    ArrowDownRight, 
    Trash2, 
    Calendar,
    DollarSign,
    Filter,
    X
} from 'lucide-react';
import { transactionApi } from '../services/transactionService';
import { walletApi } from '../services/walletService';
import { categoryApi } from '../services/categoryService';

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState([]);
    const [wallets, setWallets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('ALL');

    const [newTrans, setNewTrans] = useState({
        title: '',
        amount: '',
        type: 'EXPENSE',
        category: '',
        walletId: '',
        date: new Date().toISOString().split('T')[0],
        note: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [tRes, wRes, cRes] = await Promise.all([
                transactionApi.getAll(),
                walletApi.getAll(),
                categoryApi.getAll()
            ]);
            setTransactions(tRes.data);
            setWallets(wRes.data);
            setCategories(cRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            // Note: In a real implementation, you'd map category string or ID depending on the backend expectation. 
            // Also walletId is needed.
            await transactionApi.create({
                ...newTrans,
                wallet: { id: newTrans.walletId } // Depending on how the backend maps
            });
            setShowAdd(false);
            setNewTrans({
                title: '', amount: '', type: 'EXPENSE', category: '', walletId: '',
                date: new Date().toISOString().split('T')[0], note: ''
            });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Remove this transaction?")) {
            try {
                await transactionApi.delete(id);
                fetchData();
            } catch (err) {
                console.error(err);
            }
        }
    }

    const filteredTransactions = transactions.filter(t => {
        const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
        const matchesType = filterType === 'ALL' || t.type === filterType;
        return matchesSearch && matchesType;
    });

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <div className="w-10 h-10 border-4 border-[#106E4E] border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-12 max-w-[1600px] mx-auto w-full animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex items-end justify-between">
                <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">Ledger</p>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tighter">
                        Your <span className="text-[#106E4E]">Transactions.</span>
                    </h1>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={() => setShowAdd(true)}
                        className="bg-gray-900 text-white px-6 py-4 rounded-2xl font-black text-sm hover:bg-[#106E4E] transition-all flex items-center gap-2 shadow-xl shadow-gray-900/10"
                    >
                        <Plus size={18} /> Record Activity
                    </button>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 bg-white p-4 rounded-[2rem] border border-gray-100 shadow-sm">
                <div className="relative w-full lg:w-1/3">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search ledger..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full bg-gray-50 border border-transparent pl-14 pr-6 py-4 rounded-2xl outline-none font-bold text-gray-900 focus:bg-white focus:border-[#106E4E] focus:ring-4 focus:ring-[#106E4E]/10 transition-all placeholder:text-gray-400 placeholder:font-medium"
                    />
                </div>
                <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-[1.5rem] w-full lg:w-auto overflow-x-auto">
                    {['ALL', 'INCOME', 'EXPENSE'].map(type => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`px-8 py-3 rounded-[1rem] text-xs font-black transition-all whitespace-nowrap ${filterType === type ? 'bg-white text-[#106E4E] shadow-sm' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-200/50'}`}
                        >
                            {type}
                        </button>
                    ))}
                    <button className="px-6 py-3 rounded-[1rem] text-xs font-black text-gray-400 hover:text-gray-900 hover:bg-gray-200/50 transition-all ml-2 flex items-center gap-2">
                        <Filter size={14} /> More
                    </button>
                </div>
            </div>

            {/* Transactions List */}
            {filteredTransactions.length === 0 ? (
                <div className="bg-white p-20 rounded-[3rem] border border-dashed border-gray-200 flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6">
                        <DollarSign size={48} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">No records found</h3>
                    <p className="text-gray-400 font-medium max-w-md">You haven't recorded any transactions yet, or none match your current search criteria.</p>
                </div>
            ) : (
                <div className="bg-white rounded-[3rem] border border-gray-100 overflow-hidden shadow-xl shadow-gray-200/40">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 w-2/5">Activity Detail</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Category</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Date Logged</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Valuation</th>
                                    <th className="px-8 py-6 w-16"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredTransactions.map((t) => (
                                    <tr key={t.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-6">
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${t.type === 'INCOME' ? 'bg-[#106E4E]/10 text-[#106E4E]' : 'bg-rose-50 text-rose-500'}`}>
                                                    {t.type === 'INCOME' ? <ArrowUpRight size={24} /> : <ArrowDownRight size={24} />}
                                                </div>
                                                <div>
                                                    <p className="text-lg font-black text-gray-900 tracking-tight">{t.title}</p>
                                                    <p className="text-xs font-bold text-gray-400 mt-1 line-clamp-1 max-w-xs">{t.note || 'No additional details provided'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="px-4 py-2 rounded-xl bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-widest inline-block">
                                                {t.category || 'Uncategorized'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-gray-500 font-bold text-sm">
                                                <Calendar size={14} className="text-gray-300" />
                                                {new Date(t.date).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <span className={`text-xl font-black tabular-nums ${t.type === 'INCOME' ? 'text-[#106E4E]' : 'text-gray-900'}`}>
                                                {t.type === 'INCOME' ? '+' : '-'}${t.amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button onClick={() => handleDelete(t.id)} className="p-3 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all opacity-0 group-hover:opacity-100">
                                                <Trash2 size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Add Transaction Modal */}
            {showAdd && (
                <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl animate-in slide-in-from-bottom-8 duration-500 overflow-hidden relative">
                        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Record Activity</h3>
                            <button onClick={() => setShowAdd(false)} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-2xl transition-all">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleAdd} className="p-8">
                            <div className="flex bg-gray-50 p-2 rounded-[1.5rem] mb-8">
                                <button 
                                    type="button"
                                    onClick={() => setNewTrans({...newTrans, type: 'EXPENSE'})}
                                    className={`flex-1 py-4 rounded-[1.25rem] text-sm font-black transition-all ${newTrans.type === 'EXPENSE' ? 'bg-white text-rose-500 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    Expense
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setNewTrans({...newTrans, type: 'INCOME'})}
                                    className={`flex-1 py-4 rounded-[1.25rem] text-sm font-black transition-all ${newTrans.type === 'INCOME' ? 'bg-white text-[#106E4E] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    Income
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-6 space-y-0">
                                <div className="col-span-2 space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Title</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={newTrans.title}
                                        onChange={e => setNewTrans({...newTrans, title: e.target.value})}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 focus:bg-white focus:ring-4 focus:ring-[#106E4E]/10 focus:border-[#106E4E] outline-none transition-all placeholder:text-gray-300"
                                        placeholder="e.g. Michelin Star Dinner"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount ($)</label>
                                    <input 
                                        type="number" 
                                        required
                                        value={newTrans.amount}
                                        onChange={e => setNewTrans({...newTrans, amount: e.target.value})}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 tabular-nums focus:bg-white focus:ring-4 focus:ring-[#106E4E]/10 focus:border-[#106E4E] outline-none transition-all placeholder:text-gray-300"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date Logged</label>
                                    <input 
                                        type="date" 
                                        required
                                        value={newTrans.date}
                                        onChange={e => setNewTrans({...newTrans, date: e.target.value})}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 focus:bg-white focus:ring-4 focus:ring-[#106E4E]/10 focus:border-[#106E4E] outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Classification</label>
                                    <select 
                                        value={newTrans.category}
                                        onChange={e => setNewTrans({...newTrans, category: e.target.value})}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 focus:bg-white focus:ring-4 focus:ring-[#106E4E]/10 focus:border-[#106E4E] outline-none transition-all appearance-none"
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(c => (
                                            <option key={c.id} value={c.name}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Funding Source</label>
                                    <select 
                                        value={newTrans.walletId}
                                        onChange={e => setNewTrans({...newTrans, walletId: e.target.value})}
                                        required
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 focus:bg-white focus:ring-4 focus:ring-[#106E4E]/10 focus:border-[#106E4E] outline-none transition-all appearance-none"
                                    >
                                        <option value="">Select Portfolio</option>
                                        {wallets.map(w => (
                                            <option key={w.id} value={w.id}>{w.name} (${w.balance.toLocaleString()})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Supplemental Notes</label>
                                    <textarea 
                                        value={newTrans.note}
                                        onChange={e => setNewTrans({...newTrans, note: e.target.value})}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-medium text-sm text-gray-900 focus:bg-white focus:ring-4 focus:ring-[#106E4E]/10 focus:border-[#106E4E] outline-none transition-all min-h-[100px] resize-none placeholder:text-gray-300"
                                        placeholder="Add any contextual details here..."
                                    />
                                </div>
                            </div>

                            <button type="submit" className="w-full py-5 bg-[#106E4E] text-white font-black rounded-2xl hover:bg-[#0d593f] shadow-xl shadow-[#106E4E]/20 transition-all mt-8">
                                Commit to Ledger
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
