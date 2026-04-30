import React, { useState, useEffect } from 'react';
import { 
    Plus, 
    Search, 
    ArrowUpCircle, 
    ArrowDownCircle, 
    Trash2, 
    Calendar,
    DollarSign
} from 'lucide-react';
import { transactionApi } from '../services/transactionService';
import { walletApi } from '../services/walletService';
import { categoryApi } from '../services/categoryService';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

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
            await transactionApi.create(newTrans);
            setShowAdd(false);
            setNewTrans({
                title: '', amount: '', type: 'EXPENSE', category: '',
                date: new Date().toISOString().split('T')[0], note: ''
            });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await transactionApi.delete(id);
            fetchData();
        } catch (err) {
            console.error(err);
        }
    }

    const filteredTransactions = transactions.filter(t => {
        const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
        const matchesType = filterType === 'ALL' || t.type === filterType;
        return matchesSearch && matchesType;
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Transactions</h1>
                    <p className="text-slate-500 font-medium">Keep track of every penny</p>
                </div>
                <Button onClick={() => setShowAdd(true)}>
                    <Plus size={20} />
                    Add Transaction
                </Button>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-[32px] border border-slate-100 shadow-sm">
                <div className="relative flex-1 min-w-[300px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search transactions..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full bg-slate-50 border-none pl-12 pr-6 py-3 rounded-2xl outline-none font-bold text-slate-700"
                    />
                </div>
                <div className="flex bg-slate-50 p-1.5 rounded-2xl">
                    {['ALL', 'INCOME', 'EXPENSE'].map(type => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${filterType === type ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Transactions List */}
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Transaction</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Category</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Amount</th>
                                <th className="px-8 py-6"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredTransactions.map((t) => (
                                <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${t.type === 'INCOME' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>
                                                {t.type === 'INCOME' ? <ArrowUpCircle size={24} /> : <ArrowDownCircle size={24} />}
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-800">{t.title}</p>
                                                <p className="text-xs font-bold text-slate-400">{t.note || 'No notes'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest">
                                            {t.category || 'Uncategorized'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                                            <Calendar size={14} className="text-slate-300" />
                                            {t.date}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <span className={`text-lg font-black ${t.type === 'INCOME' ? 'text-emerald-600' : 'text-slate-800'}`}>
                                            {t.type === 'INCOME' ? '+' : '-'}${t.amount.toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button onClick={() => handleDelete(t.id)} className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add Transaction Modal */}
            {showAdd && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-xl rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500" />
                        <h2 className="text-2xl font-black text-slate-800 mb-8">Record Transaction</h2>
                        
                        <form onSubmit={handleAdd} className="space-y-6">
                            <div className="flex bg-slate-100 p-1.5 rounded-[24px] mb-8">
                                <button 
                                    type="button"
                                    onClick={() => setNewTrans({...newTrans, type: 'EXPENSE'})}
                                    className={`flex-1 py-3 rounded-[20px] text-sm font-black transition-all ${newTrans.type === 'EXPENSE' ? 'bg-white text-rose-500 shadow-sm' : 'text-slate-400'}`}
                                >
                                    Expense
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setNewTrans({...newTrans, type: 'INCOME'})}
                                    className={`flex-1 py-3 rounded-[20px] text-sm font-black transition-all ${newTrans.type === 'INCOME' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}
                                >
                                    Income
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <Input
                                        label="Title"
                                        placeholder="e.g. Lunch at Starbucks"
                                        required
                                        value={newTrans.title}
                                        onChange={e => setNewTrans({...newTrans, title: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <Input
                                        label="Amount"
                                        type="number"
                                        icon={DollarSign}
                                        placeholder="0.00"
                                        required
                                        value={newTrans.amount}
                                        onChange={e => setNewTrans({...newTrans, amount: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <Input
                                        label="Date"
                                        type="date"
                                        required
                                        value={newTrans.date}
                                        onChange={e => setNewTrans({...newTrans, date: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                                    <select 
                                        value={newTrans.category}
                                        onChange={e => setNewTrans({...newTrans, category: e.target.value})}
                                        className="w-full bg-slate-50 border border-transparent px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white focus:border-slate-200 font-bold text-slate-700 appearance-none transition-all"
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(c => (
                                            <option key={c.id} value={c.name}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Wallet</label>
                                    <select 
                                        className="w-full bg-slate-50 border border-transparent px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white focus:border-slate-200 font-bold text-slate-700 appearance-none transition-all"
                                    >
                                        <option value="">Select Wallet</option>
                                        {wallets.map(w => (
                                            <option key={w.id} value={w.id}>{w.name} (${w.balance.toLocaleString()})</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Note</label>
                                <textarea 
                                    value={newTrans.note}
                                    onChange={e => setNewTrans({...newTrans, note: e.target.value})}
                                    className="w-full bg-slate-50 border border-transparent px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white focus:border-slate-200 font-bold text-slate-700 min-h-[80px] resize-none transition-all"
                                    placeholder="Add any additional details..."
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button type="button" variant="ghost" className="flex-1" onClick={() => setShowAdd(false)}>Cancel</Button>
                                <Button type="submit" className="flex-1">Record</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
