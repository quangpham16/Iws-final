import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Trophy, Clock, Target, TrendingUp, X } from 'lucide-react';
import { goalApi, walletApi } from '../services/api';
import { motion } from 'framer-motion';

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

export default function GoalsPage() {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currencySymbol, setCurrencySymbol] = useState('$');
    const [showAdd, setShowAdd] = useState(false);
    const [newGoal, setNewGoal] = useState({ 
        name: '', 
        targetAmount: '', 
        currentAmount: 0, 
        targetDate: '',
        colorHex: '#106E4E'
    });
    const [wallets, setWallets] = useState([]);
    const [showFund, setShowFund] = useState(false);
    const [fundGoal, setFundGoal] = useState(null);
    const [fundAmount, setFundAmount] = useState('');
    const [fundWalletId, setFundWalletId] = useState(null);

    useEffect(() => {
        fetchGoals();
        fetchCurrency();
    }, []);

    const fetchCurrency = async () => {
        try {
            const res = await walletApi.getAll();
            if (res.data && res.data.length > 0) {
                const code = res.data[0].currencyCode || 'VND';
                setCurrencySymbol(code === 'USD' ? '$' : code === 'EUR' ? '€' : code === 'VND' ? '₫' : code);
                setWallets(res.data);
                if (!fundWalletId && res.data.length > 0) setFundWalletId(res.data[0].id);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchGoals = async () => {
        try {
            const res = await goalApi.getAll();
            setGoals(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await goalApi.create(newGoal);
            setShowAdd(false);
            fetchGoals();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Abandon this goal?')) {
            try {
                await goalApi.delete(id);
                fetchGoals();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const openFund = (goal) => {
        setFundGoal(goal);
        setFundAmount('');
        setFundWalletId(wallets && wallets.length > 0 ? wallets[0].id : null);
        setShowFund(true);
    };

    const handleFundSubmit = async (e) => {
        e.preventDefault();
        if (!fundGoal || !fundWalletId) return;
        try {
            await goalApi.fund(fundGoal.id, { walletId: Number(fundWalletId), amount: parseFloat(fundAmount) });
            setShowFund(false);
            fetchGoals();
        } catch (err) {
            console.error(err);
            alert(err?.response?.data || err.message || 'Failed to fund goal');
        }
    };

    const totalTarget = goals.reduce((sum, g) => sum + (parseFloat(g.targetAmount) || 0), 0);
    const totalSaved = goals.reduce((sum, g) => sum + (parseFloat(g.currentAmount) || 0), 0);
    const globalProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <div className="w-10 h-10 border-4 border-[#106E4E] border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="space-y-12 max-w-[1600px] mx-auto w-full">
            {/* Header Section */}
            <div className="flex items-end justify-between">
                <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">Wealth Building</p>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tighter">
                        Your <span className="text-[#106E4E]">Aspirations.</span>
                    </h1>
                </div>
                <div className="flex gap-4">
                    <div className="flex flex-col items-end pr-4 border-r border-gray-200">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Global Progress</p>
                        <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-black text-gray-900 tabular-nums">{globalProgress.toFixed(1)}%</h2>
                            <TrendingUp size={16} className="text-[#106E4E]" />
                        </div>
                    </div>
                    <button 
                        onClick={() => setShowAdd(true)}
                        className="bg-[#106E4E] text-white px-6 py-4 rounded-2xl font-black text-sm hover:bg-[#0d5a3f] hover:-translate-y-0.5 transition-all flex items-center gap-2 shadow-xl shadow-[#106E4E]/20"
                    >
                        <Plus size={18} /> Define Aspiration
                    </button>
                </div>
            </div>

            {goals.length === 0 ? (
                <motion.div variants={fadeInUp} className="bg-white p-20 rounded-[3rem] border border-dashed border-gray-200 flex flex-col items-center text-center shadow-sm">
                    <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-[#106E4E] mb-6 shadow-inner">
                        <Trophy size={48} strokeWidth={1.5} className="animate-bounce-slow" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">No goals defined</h3>
                    <p className="text-gray-400 font-medium max-w-md">Set your first financial goal to start building wealth intentionally.</p>
                </motion.div>
            ) : (
                <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {goals.map((goal, index) => {
                        const target = parseFloat(goal.targetAmount) || 0;
                        const current = parseFloat(goal.currentAmount) || 0;
                        const progress = target > 0 ? Math.min((current / target) * 100, 100) : 0;
                        const isCompleted = progress >= 100;
                        
                        return (
                            <motion.div variants={fadeInUp} key={goal.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                                <div 
                                    className="absolute top-0 left-0 w-full h-2 transition-all duration-1000 opacity-80" 
                                    style={{ backgroundColor: goal.colorHex || '#106E4E' }} 
                                />
                                
                                <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-10 transition-transform duration-1000 group-hover:scale-150 pointer-events-none"
                                     style={{ backgroundColor: goal.colorHex || '#106E4E' }} />

                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="flex items-start justify-between mb-8">
                                        <div>
                                            <h3 className="text-2xl font-black text-gray-900 tracking-tight leading-tight mb-2">{goal.name}</h3>
                                            {isCompleted && (
                                                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                                                    Goal Reached
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <div className="text-right">
                                                <span className="text-3xl font-black text-gray-900 tabular-nums">{progress.toFixed(0)}%</span>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Achieved</p>
                                            </div>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => openFund(goal)}
                                                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-all"
                                                    aria-label={`Add funds to ${goal.name}`}
                                                >
                                                    <Target size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(goal.id)}
                                                    className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all"
                                                    aria-label={`Delete ${goal.name}`}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-auto space-y-6">
                                        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full rounded-full transition-all duration-1000"
                                                style={{ backgroundColor: goal.colorHex || '#106E4E', width: `${progress}%` }}
                                            />
                                        </div>

                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Saved</p>
                                                <p className="text-xl font-black text-gray-900 tabular-nums">{currencySymbol}{current.toLocaleString()}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Target</p>
                                                <p className="text-xl font-bold text-gray-400 tabular-nums">{currencySymbol}{target.toLocaleString()}</p>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-gray-50 flex items-center gap-2 text-gray-400">
                                            <Clock size={14} />
                                            <span className="text-xs font-bold">Target: {goal.targetDate ? new Date(goal.targetDate).toLocaleDateString() : 'Flexible'}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            )}

            {showAdd && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-500 border border-gray-100">
                        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Define Aspiration</h3>
                            <button onClick={() => setShowAdd(false)} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-2xl transition-all">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleAdd} className="p-8 space-y-6 bg-slate-50/50">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Goal Name</label>
                                <input 
                                    type="text" 
                                    required
                                    value={newGoal.name}
                                    onChange={e => setNewGoal({...newGoal, name: e.target.value})}
                                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl font-bold text-gray-900 focus:bg-white focus:ring-4 focus:ring-[#106E4E]/10 focus:border-[#106E4E] outline-none transition-all placeholder:text-gray-300 shadow-sm"
                                    placeholder="e.g. Home Downpayment"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Target Amount ({currencySymbol})</label>
                                    <input 
                                        type="number" 
                                        required
                                        value={newGoal.targetAmount}
                                        onChange={e => setNewGoal({...newGoal, targetAmount: e.target.value})}
                                        className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl font-bold text-gray-900 tabular-nums focus:bg-white focus:ring-4 focus:ring-[#106E4E]/10 focus:border-[#106E4E] outline-none transition-all placeholder:text-gray-300 shadow-sm"
                                        placeholder="10000.00"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Theme Color</label>
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="color" 
                                            value={newGoal.colorHex}
                                            onChange={e => setNewGoal({...newGoal, colorHex: e.target.value})}
                                            className="w-12 h-14 p-1 bg-white border border-gray-200 rounded-2xl cursor-pointer shadow-sm"
                                        />
                                        <input 
                                            type="text" 
                                            value={newGoal.colorHex}
                                            onChange={e => setNewGoal({...newGoal, colorHex: e.target.value})}
                                            className="w-full px-4 py-4 bg-white border border-gray-200 rounded-2xl font-bold text-gray-900 uppercase focus:bg-white focus:ring-4 focus:ring-[#106E4E]/10 focus:border-[#106E4E] outline-none transition-all shadow-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Target Date (Optional)</label>
                                <input 
                                    type="date" 
                                    value={newGoal.targetDate}
                                    onChange={e => setNewGoal({...newGoal, targetDate: e.target.value})}
                                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl font-bold text-gray-900 focus:bg-white focus:ring-4 focus:ring-[#106E4E]/10 focus:border-[#106E4E] outline-none transition-all shadow-sm"
                                />
                            </div>
                            <button type="submit" className="w-full py-5 bg-[#106E4E] text-white font-black rounded-2xl hover:bg-[#0d5a3f] shadow-xl shadow-[#106E4E]/20 transition-all hover:-translate-y-0.5 mt-4">
                                Initialize Goal
                            </button>
                        </form>
                    </div>
                </div>
            )}
            {showFund && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-500 border border-gray-100">
                        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Add Funds to Goal</h3>
                            <button onClick={() => setShowFund(false)} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-2xl transition-all">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleFundSubmit} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Wallet</label>
                                <select
                                    required
                                    value={fundWalletId || ''}
                                    onChange={e => setFundWalletId(e.target.value)}
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-gray-900 focus:bg-white focus:ring-4 focus:ring-[#106E4E]/10 focus:border-[#106E4E] outline-none transition-all shadow-sm"
                                >
                                    {wallets.map(w => (
                                        <option key={w.id} value={w.id}>{w.name} — {w.currencyCode} {w.currentBalance}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Amount ({currencySymbol})</label>
                                <input
                                    type="number"
                                    required
                                    step="0.01"
                                    value={fundAmount}
                                    onChange={e => setFundAmount(e.target.value)}
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-gray-900 tabular-nums focus:bg-white focus:ring-4 focus:ring-[#106E4E]/10 focus:border-[#106E4E] outline-none transition-all shadow-sm"
                                    placeholder="100.00"
                                />
                            </div>

                            <div className="flex gap-4">
                                <button type="submit" className="flex-1 py-5 bg-[#106E4E] text-white font-black rounded-2xl hover:bg-[#0d5a3f] shadow-xl shadow-[#106E4E]/20 transition-all hover:-translate-y-0.5">Transfer</button>
                                <button type="button" onClick={() => setShowFund(false)} className="flex-1 py-5 bg-white border border-gray-200 font-black text-gray-700 rounded-2xl hover:bg-gray-50 transition-all">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
