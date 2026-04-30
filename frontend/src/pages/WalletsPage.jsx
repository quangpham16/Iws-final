import React, { useState, useEffect } from 'react';
import { 
    Plus, 
    MoreVertical, 
    Edit2, 
    Trash2, 
    Wallet as WalletIcon,
    X
} from 'lucide-react';
import { walletApi } from '../services/api';
import { cn } from '../lib/utils';

export default function WalletsPage() {
    const [wallets, setWallets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingWallet, setEditingWallet] = useState(null);
    const [formData, setFormData] = useState({ name: '', balance: '', currency: 'USD', note: '' });

    useEffect(() => {
        fetchWallets();
    }, []);

    const fetchWallets = async () => {
        try {
            const res = await walletApi.getAll();
            setWallets(res.data);
        } catch (error) {
            console.error("Error fetching wallets:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (wallet = null) => {
        if (wallet) {
            setEditingWallet(wallet);
            setFormData({ 
                name: wallet.name, 
                balance: wallet.balance, 
                currency: wallet.currency, 
                note: wallet.note || '' 
            });
        } else {
            setEditingWallet(null);
            setFormData({ name: '', balance: '', currency: 'USD', note: '' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingWallet) {
                await walletApi.update(editingWallet.id, formData);
            } else {
                await walletApi.create(formData);
            }
            setIsModalOpen(false);
            fetchWallets();
        } catch (error) {
            console.error("Error saving wallet:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this wallet?")) {
            try {
                await walletApi.delete(id);
                fetchWallets();
            } catch (error) {
                console.error("Error deleting wallet:", error);
            }
        }
    };

    if (loading) return <div className="h-full flex items-center justify-center">Loading...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Wallets</h1>
                    <p className="text-slate-500 font-medium">Manage your various financial storage units.</p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
                >
                    <Plus size={20} /> Add Wallet
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wallets.map((wallet) => (
                    <div key={wallet.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                        {/* Background Decoration */}
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-50 rounded-full blur-2xl group-hover:bg-emerald-100 transition-colors -z-0"></div>
                        
                        <div className="relative z-10">
                            <div className="flex items-start justify-between mb-6">
                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-emerald-600 group-hover:bg-emerald-50 transition-all">
                                    <WalletIcon size={24} />
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => handleOpenModal(wallet)}
                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(wallet.id)}
                                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <h3 className="text-xl font-bold text-slate-800">{wallet.name}</h3>
                                <p className="text-sm font-medium text-slate-400">{wallet.currency} • Active</p>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-50">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Available Balance</p>
                                <h4 className="text-2xl font-bold text-slate-900">${wallet.balance.toLocaleString()}</h4>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-slate-800">{editingWallet ? 'Edit Wallet' : 'New Wallet'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Wallet Name</label>
                                <input 
                                    type="text" 
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    placeholder="e.g. Personal Savings" 
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Initial Balance</label>
                                    <input 
                                        type="number" 
                                        required
                                        value={formData.balance}
                                        onChange={(e) => setFormData({...formData, balance: e.target.value})}
                                        placeholder="0.00" 
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Currency</label>
                                    <select 
                                        value={formData.currency}
                                        onChange={(e) => setFormData({...formData, currency: e.target.value})}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all appearance-none"
                                    >
                                        <option value="USD">USD ($)</option>
                                        <option value="EUR">EUR (€)</option>
                                        <option value="VND">VND (đ)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Note (Optional)</label>
                                <textarea 
                                    value={formData.note}
                                    onChange={(e) => setFormData({...formData, note: e.target.value})}
                                    placeholder="Add a description..." 
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all h-24 resize-none"
                                />
                            </div>
                            <button className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 mt-4">
                                {editingWallet ? 'Update Wallet' : 'Create Wallet'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
