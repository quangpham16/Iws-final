import React, { useState, useEffect } from 'react';
import { 
    Plus, 
    MoreVertical, 
    Edit2, 
    Trash2, 
    Wallet as WalletIcon,
    X,
    CreditCard,
    ArrowUpRight,
    ArrowDownRight,
    Activity
} from 'lucide-react';
import { walletApi } from '../services/api';

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
        if (window.confirm("Are you sure you want to archive this wallet?")) {
            try {
                await walletApi.delete(id);
                fetchWallets();
            } catch (error) {
                console.error("Error deleting wallet:", error);
            }
        }
    };

    const totalBalance = wallets.reduce((sum, w) => sum + (parseFloat(w.balance) || 0), 0);

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
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">Asset Management</p>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tighter">
                        Your <span className="text-[#106E4E]">Portfolios.</span>
                    </h1>
                </div>
                <div className="flex gap-4">
                    <div className="flex flex-col items-end">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Liquidity</p>
                        <h2 className="text-2xl font-black text-gray-900 tabular-nums">${totalBalance.toLocaleString()}</h2>
                    </div>
                    <button 
                        onClick={() => handleOpenModal()}
                        className="bg-gray-900 text-white px-6 py-4 rounded-2xl font-black text-sm hover:bg-[#106E4E] transition-all flex items-center gap-2 shadow-xl shadow-gray-900/10"
                    >
                        <Plus size={18} /> New Portfolio
                    </button>
                </div>
            </div>

            {/* Wallets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {wallets.map((wallet, index) => {
                    const isGreen = index % 3 === 0;
                    const isDark = index % 3 === 1;
                    const bgClass = isGreen ? 'bg-[#106E4E] text-white shadow-[#106E4E]/20' : isDark ? 'bg-gray-900 text-white shadow-gray-900/20' : 'bg-white border border-gray-100 text-gray-900 shadow-gray-200/50';
                    const textMuted = isGreen || isDark ? 'text-white/60' : 'text-gray-400';
                    const borderClass = isGreen || isDark ? 'border-white/10' : 'border-gray-50';

                    return (
                        <div key={wallet.id} className={`p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group transition-all hover:-translate-y-2 ${bgClass}`}>
                            {/* Decorative Background Elements */}
                            {(isGreen || isDark) && (
                                <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
                            )}
                            {(!isGreen && !isDark) && (
                                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#106E4E]/5 rounded-full blur-3xl pointer-events-none"></div>
                            )}

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex justify-between items-start mb-12">
                                    <div className={`p-3 rounded-2xl ${isGreen || isDark ? 'bg-white/10 text-white' : 'bg-gray-50 text-gray-400'}`}>
                                        <WalletIcon size={24} />
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => handleOpenModal(wallet)}
                                            className={`p-2 rounded-xl transition-all ${isGreen || isDark ? 'hover:bg-white/20 text-white' : 'hover:bg-gray-100 text-gray-400'}`}
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(wallet.id)}
                                            className={`p-2 rounded-xl transition-all ${isGreen || isDark ? 'hover:bg-white/20 text-white' : 'hover:bg-rose-50 text-rose-500'}`}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-black tracking-tight">{wallet.name}</h3>
                                    <p className={`text-xs font-bold uppercase tracking-widest mt-1 ${textMuted}`}>{wallet.currency} • Active</p>
                                </div>

                                <div className={`mt-10 pt-6 border-t ${borderClass}`}>
                                    <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-2 ${textMuted}`}>Available Balance</p>
                                    <h4 className="text-4xl font-black tabular-nums">${wallet.balance.toLocaleString()}</h4>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Add New Wallet Card */}
                <div 
                    onClick={() => handleOpenModal()}
                    className="border-2 border-dashed border-gray-200 rounded-[2.5rem] flex flex-col items-center justify-center p-8 text-center cursor-pointer hover:border-[#106E4E] hover:bg-[#106E4E]/5 transition-all group min-h-[320px]"
                >
                    <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-[#106E4E]/10 group-hover:text-[#106E4E] transition-all mb-4">
                        <Plus size={32} />
                    </div>
                    <h3 className="text-lg font-black text-gray-900">Add Portfolio</h3>
                    <p className="text-xs font-bold text-gray-400 mt-2 max-w-[200px]">Create a new wallet to track separate assets or accounts.</p>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
                        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight">{editingWallet ? 'Edit Portfolio' : 'New Portfolio'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-2xl transition-all">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Portfolio Name</label>
                                <input 
                                    type="text" 
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    placeholder="e.g. Wealthfront Investments" 
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 focus:bg-white focus:ring-4 focus:ring-[#106E4E]/10 focus:border-[#106E4E] outline-none transition-all placeholder:text-gray-300 placeholder:font-medium"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Initial Balance</label>
                                    <input 
                                        type="number" 
                                        required
                                        value={formData.balance}
                                        onChange={(e) => setFormData({...formData, balance: e.target.value})}
                                        placeholder="0.00" 
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 tabular-nums focus:bg-white focus:ring-4 focus:ring-[#106E4E]/10 focus:border-[#106E4E] outline-none transition-all placeholder:text-gray-300 placeholder:font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Currency</label>
                                    <select 
                                        value={formData.currency}
                                        onChange={(e) => setFormData({...formData, currency: e.target.value})}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 focus:bg-white focus:ring-4 focus:ring-[#106E4E]/10 focus:border-[#106E4E] outline-none transition-all appearance-none"
                                    >
                                        <option value="USD">USD ($)</option>
                                        <option value="EUR">EUR (€)</option>
                                        <option value="VND">VND (đ)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Notes</label>
                                <textarea 
                                    value={formData.note}
                                    onChange={(e) => setFormData({...formData, note: e.target.value})}
                                    placeholder="Add context..." 
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-medium text-sm text-gray-900 focus:bg-white focus:ring-4 focus:ring-[#106E4E]/10 focus:border-[#106E4E] outline-none transition-all h-24 resize-none placeholder:text-gray-300"
                                />
                            </div>
                            <button className="w-full py-5 bg-[#106E4E] text-white font-black rounded-2xl hover:bg-[#0d593f] transition-all shadow-xl shadow-[#106E4E]/20 mt-4">
                                {editingWallet ? 'Confirm Changes' : 'Initialize Portfolio'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
