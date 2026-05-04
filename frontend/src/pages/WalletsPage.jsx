import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
    Activity,
    ChevronDown
} from 'lucide-react';
import { walletApi, transactionApi, categoryApi } from '../services/api';
import ColorPicker from '../components/ColorPicker';

export default function WalletsPage() {
    const navigate = useNavigate();
    const [wallets, setWallets] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingWallet, setEditingWallet] = useState(null);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [formData, setFormData] = useState({ name: '', type: 'checking', initialBalance: '', currencyCode: 'VND', institutionName: '', colorHex: '#10b981' });

    useEffect(() => {
        fetchWallets();
    }, []);

    const fetchWallets = async () => {
        try {
            const [walRes, txnRes, catRes] = await Promise.all([
                walletApi.getAll(),
                transactionApi.getAll(),
                categoryApi.getAll(),
            ]);
            console.log('Fetched wallets:', walRes.data);
            setWallets(Array.isArray(walRes.data) ? walRes.data : []);
            setTransactions(Array.isArray(txnRes.data) ? txnRes.data : []);
            setCategories(Array.isArray(catRes.data) ? catRes.data : []);
        } catch (error) {
            console.error("Error fetching wallets:", error);
        } finally {
            setLoading(false);
        }
    };

    const catById = useMemo(() => {
        const m = {};
        categories.forEach((c) => {
            m[c.id] = c;
        });
        return m;
    }, [categories]);

    // Calculate actual wallet balance based on transactions
    const calculateWalletBalance = (walletId, initialBalance) => {
        let balance = parseFloat(initialBalance) || 0;
        
        transactions.forEach((t) => {
            if (Number(t.walletId) !== Number(walletId)) return;
            
            const cat = t.categoryId != null ? catById[t.categoryId] : null;
            const amount = parseFloat(t.amount) || 0;
            
            if (!cat) return;
            
            if (cat.type === 'income') {
                // Income: add to balance
                balance += Math.abs(amount);
            } else if (cat.type === 'expense') {
                // Expense: subtract from balance
                balance -= Math.abs(amount);
            } else if (cat.type === 'transfer') {
                // Transfer: negative = received (add), positive = sent (subtract)
                if (amount < 0) {
                    balance += Math.abs(amount);
                } else {
                    balance -= Math.abs(amount);
                }
            }
        });
        
        return balance;
    };

    const handleOpenModal = (wallet = null) => {
        if (wallet) {
            setEditingWallet(wallet);
            setFormData({ 
                name: wallet.name, 
                type: wallet.type || 'checking', 
                initialBalance: wallet.initialBalance || '', 
                currencyCode: wallet.currencyCode || 'VND', 
                institutionName: wallet.institutionName || '',
                colorHex: wallet.colorHex || '#10b981'
            });
        } else {
            setEditingWallet(null);
            setFormData({ name: '', type: 'checking', initialBalance: '', currencyCode: 'VND', institutionName: '', colorHex: '#10b981' });
        }
        setShowColorPicker(false);
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

    const totalBalance = wallets.reduce((sum, w) => sum + (parseFloat(w.currentBalance ?? w.initialBalance) || 0), 0);

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <div className="w-10 h-10 border-4 border-[#106E4E] border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-12">
            {/* Header Section - Responsive */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8">
                <div className="flex flex-col gap-6 sm:gap-12">
                    <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tighter">Wallets.</h1>
                    <div className="flex flex-col bg-white p-6 sm:p-0 rounded-[2rem] sm:rounded-none border border-gray-100 sm:border-none shadow-sm sm:shadow-none">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-1">Total Assets</p>
                        <h2 className="text-2xl sm:text-3xl font-black text-emerald-600 tabular-nums">₫{totalBalance.toLocaleString('vi-VN')}</h2>
                    </div>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="bg-gray-900 text-white px-8 py-4 sm:py-3.5 rounded-2xl font-black text-sm hover:bg-[#106E4E] sm:hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 shadow-xl shadow-gray-900/10 w-full sm:w-auto"
                >
                    <Plus size={18} /> Define Asset
                </button>
            </div>

            {/* Wallets Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wallets.map((wallet, index) => {
                    // Use wallet color if available, otherwise use default colors
                    const hasCustomColor = wallet.colorHex && wallet.colorHex !== '#10b981';
                    const walletColor = wallet.colorHex || '#10b981';
                    
                    // Determine if color is dark or light for text color
                    const isDarkColor = () => {
                        const hex = walletColor.replace('#', '');
                        const r = parseInt(hex.substr(0, 2), 16);
                        const g = parseInt(hex.substr(2, 2), 16);
                        const b = parseInt(hex.substr(4, 2), 16);
                        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
                        return brightness < 128;
                    };
                    
                    const isLight = !isDarkColor();
                    const textColor = isLight ? 'text-gray-900' : 'text-white';
                    const textMuted = isLight ? 'text-gray-500' : 'text-white/70';
                    const borderClass = isLight ? 'border-gray-100' : 'border-white/10';
                    
                    // Calculate actual balance
                    const actualBalance = calculateWalletBalance(wallet.id, wallet.initialBalance);

                    return (
                        <div 
                            key={wallet.id} 
                            className={`p-6 rounded-[2.5rem] shadow-lg relative overflow-hidden group transition-all sm:hover:-translate-y-1 cursor-pointer ${textColor}`}
                            style={{ 
                                backgroundColor: walletColor,
                                border: isLight ? '1px solid #f3f4f6' : 'none'
                            }}
                            onClick={() => navigate(`/transactions?wallet=${wallet.id}`)}
                        >
                            {/* Decorative Background Elements */}
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
                            {isLight && (
                                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-black/5 rounded-full blur-3xl pointer-events-none"></div>
                            )}

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex justify-between items-start mb-10">
                                    <div className={`p-3 rounded-2xl ${isLight ? 'bg-black/5' : 'bg-white/10'}`}>
                                        <WalletIcon size={20} />
                                    </div>
                                    <div className="flex gap-1.5 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleOpenModal(wallet);
                                            }}
                                            className={`p-2 rounded-xl transition-all ${isLight ? 'hover:bg-black/10' : 'hover:bg-white/20'}`}
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(wallet.id);
                                            }}
                                            className={`p-2 rounded-xl transition-all ${isLight ? 'hover:bg-rose-50 text-rose-500' : 'hover:bg-white/20'}`}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <h3 className="text-xl font-black tracking-tight truncate">{wallet.name}</h3>
                                    <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${textMuted}`}>{wallet.currencyCode || 'VND'} • {wallet.type || 'checking'}</p>
                                </div>

                                <div className={`mt-auto pt-5 border-t ${borderClass}`}>
                                    <p className={`text-[9px] font-bold uppercase tracking-[0.2em] mb-1.5 ${textMuted}`}>Current Balance</p>
                                    <h4 className="text-2xl sm:text-3xl font-black tabular-nums tracking-tighter">₫{actualBalance.toLocaleString('vi-VN')}</h4>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Add New Wallet Card */}
                <div 
                    onClick={() => handleOpenModal()}
                    className="border-2 border-dashed border-gray-200 rounded-[2.5rem] flex flex-col items-center justify-center p-8 text-center cursor-pointer hover:border-[#106E4E] hover:bg-[#106E4E]/5 transition-all group min-h-[280px]"
                >
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-[#106E4E]/10 group-hover:text-[#106E4E] transition-all mb-4">
                        <Plus size={24} />
                    </div>
                    <h3 className="text-base font-black text-gray-900">Add Wallet</h3>
                    <p className="text-[10px] font-bold text-gray-400 mt-2 max-w-[180px] uppercase tracking-widest">Connect a new asset</p>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-t-[2.5rem] sm:rounded-[3rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-500 border border-gray-100 max-h-[95vh] flex flex-col">
                        <div className="p-6 sm:p-8 border-b border-gray-50 flex items-center justify-between shrink-0">
                            <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">{editingWallet ? 'Modify Asset' : 'New Asset'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-2xl transition-all">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 sm:space-y-6 overflow-y-auto bg-slate-50/30">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Asset Name</label>
                                <input 
                                    type="text" 
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    placeholder="e.g. Main Savings" 
                                    className="w-full px-5 py-3.5 sm:py-4 bg-white border border-gray-200 rounded-2xl font-bold text-gray-900 focus:bg-white focus:ring-4 focus:ring-[#106E4E]/10 focus:border-[#106E4E] outline-none transition-all placeholder:text-gray-300 text-sm sm:text-base"
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Initial Balance</label>
                                    <input 
                                        type="number" 
                                        required
                                        value={formData.initialBalance}
                                        onChange={(e) => setFormData({...formData, initialBalance: e.target.value})}
                                        placeholder="0" 
                                        className="w-full px-5 py-3.5 sm:py-4 bg-white border border-gray-200 rounded-2xl font-bold text-gray-900 tabular-nums focus:bg-white focus:ring-4 focus:ring-[#106E4E]/10 focus:border-[#106E4E] outline-none transition-all placeholder:text-gray-300 text-sm sm:text-base"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Asset Type</label>
                                    <div className="relative">
                                        <select 
                                            value={formData.type}
                                            onChange={(e) => setFormData({...formData, type: e.target.value})}
                                            className="w-full px-5 py-3.5 sm:py-4 bg-white border border-gray-200 rounded-2xl font-bold text-gray-900 focus:bg-white focus:ring-4 focus:ring-[#106E4E]/10 focus:border-[#106E4E] outline-none transition-all appearance-none text-sm sm:text-base"
                                        >
                                            <option value="checking">Checking</option>
                                            <option value="savings">Savings</option>
                                            <option value="credit_card">Credit Card</option>
                                            <option value="ewallet">E-Wallet</option>
                                            <option value="investment">Investment</option>
                                            <option value="cash">Cash</option>
                                        </select>
                                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Financial Institution</label>
                                <input 
                                    type="text"
                                    value={formData.institutionName}
                                    onChange={(e) => setFormData({...formData, institutionName: e.target.value})}
                                    placeholder="e.g. Vietcombank" 
                                    className="w-full px-5 py-3.5 sm:py-4 bg-white border border-gray-200 rounded-2xl font-bold text-gray-900 focus:bg-white focus:ring-4 focus:ring-[#106E4E]/10 focus:border-[#106E4E] outline-none transition-all placeholder:text-gray-300 text-sm sm:text-base"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Theme Color</label>
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setShowColorPicker(!showColorPicker)}
                                        className="w-full px-5 py-3.5 sm:py-4 bg-white border border-gray-200 rounded-2xl font-bold text-gray-900 focus:bg-white focus:ring-4 focus:ring-[#106E4E]/10 focus:border-[#106E4E] outline-none transition-all flex items-center gap-4 shadow-sm"
                                    >
                                        <span 
                                            className="w-10 h-10 rounded-xl border-2 border-gray-100 shadow-sm shrink-0"
                                            style={{ backgroundColor: formData.colorHex }}
                                        />
                                        <span className="font-mono uppercase tracking-widest text-sm">{formData.colorHex}</span>
                                    </button>
                                    {showColorPicker && (
                                        <div className="fixed z-[100]" style={{ 
                                            left: '50%', 
                                            top: '50%', 
                                            transform: 'translate(-50%, -50%)'
                                        }}>
                                            <ColorPicker
                                                color={formData.colorHex}
                                                onChange={(color) => {
                                                    setFormData({...formData, colorHex: color});
                                                    setShowColorPicker(false);
                                                }}
                                                onClose={() => setShowColorPicker(false)}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button className="w-full py-4 sm:py-5 bg-gray-900 text-white font-black rounded-2xl hover:bg-[#106E4E] transition-all shadow-xl shadow-gray-900/10 mt-2 sm:mt-4 text-sm sm:text-base">
                                {editingWallet ? 'Apply Modifications' : 'Initialize Asset'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
