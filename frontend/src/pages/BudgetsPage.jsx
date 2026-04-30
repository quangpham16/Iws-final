import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, Target, AlertCircle, TrendingUp, X } from 'lucide-react';
import { budgetApi } from '../services/api';

export default function BudgetsPage() {
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [newBudget, setNewBudget] = useState({ 
        name: '', 
        amount: '',
        periodType: 'monthly', 
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchBudgets();
    }, []);

    const fetchBudgets = async () => {
        try {
            const res = await budgetApi.getAll();
            setBudgets(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await budgetApi.create(newBudget);
            setShowAdd(false);
            fetchBudgets();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this budget?')) {
            try {
                await budgetApi.delete(id);
                fetchBudgets();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const totalBudget = budgets.reduce((sum, b) => sum + (parseFloat(b.amount) || 0), 0);
    const totalSpent = budgets.reduce((sum, b) => sum + (parseFloat(b.spentAmount) || 0), 0);
    const overallUtilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

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
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">Envelope Allocation</p>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tighter">
                        Your <span className="text-[#106E4E]">Budgets.</span>
                    </h1>
                </div>
                <div className="flex gap-4">
                    <div className="flex flex-col items-end pr-4 border-r border-gray-200">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Global Utilization</p>
                        <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-black text-gray-900 tabular-nums">{overallUtilization.toFixed(1)}%</h2>
                            <TrendingUp size={16} className={overallUtilization > 90 ? 'text-rose-500' : 'text-[#106E4E]'} />
                        </div>
                    </div>
                    <button 
                        onClick={() => setShowAdd(true)}
                        className="bg-gray-900 text-white px-6 py-4 rounded-2xl font-black text-sm hover:bg-[#106E4E] transition-all flex items-center gap-2 shadow-xl shadow-gray-900/10"
                    >
                        <Plus size={18} /> New Envelope
                    </button>
                </div>
            </div>

            {budgets.length === 0 ? (
                <div className="bg-white p-20 rounded-[3rem] border border-dashed border-gray-200 flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6">
                        <AlertCircle size={48} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">No envelopes active</h3>
                    <p className="text-gray-400 font-medium max-w-md">Establish your first budget envelope to track your spending habits and avoid exceeding your limits.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {budgets.map((budget) => {
                        const amount = parseFloat(budget.amount) || 0;
                        const spent = parseFloat(budget.spentAmount) || 0;
                        const percentage = amount > 0 ? Math.min((spent / amount) * 100, 100) : 0;
                        const isOverLimit = spent >= amount;
                        const isWarning = percentage >= 80 && !isOverLimit;

                        let progressColor = "bg-[#106E4E]";
                        let bgLightColor = "bg-[#106E4E]/10";
                        let textColor = "text-[#106E4E]";
                        
                        if (isOverLimit) {
                            progressColor = "bg-rose-500";
                            bgLightColor = "bg-rose-50";
                            textColor = "text-rose-500";
                        } else if (isWarning) {
                            progressColor = "bg-yellow-500";
                            bgLightColor = "bg-yellow-50";
                            textColor = "text-yellow-600";
                        }

                        return (
                            <div key={budget.id} className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                                <div className={`absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-20 transition-transform duration-1000 group-hover:scale-150 ${progressColor}`} />
                                
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${bgLightColor} ${textColor}`}>
                                                <Target size={28} />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black text-gray-900 tracking-tight">{budget.name}</h3>
                                                <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full ${bgLightColor} ${textColor}`}>
                                                    {budget.periodType}
                                                </span>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleDelete(budget.id)}
                                            className="p-3 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-end justify-between">
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Spent</p>
                                                <h4 className="text-3xl font-black text-gray-900 tabular-nums">${spent.toLocaleString()}</h4>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Limit</p>
                                                <h4 className="text-xl font-bold text-gray-400 tabular-nums">/ ${amount.toLocaleString()}</h4>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
                                                <span className={textColor}>
                                                    {isOverLimit ? 'Limit Exceeded' : isWarning ? 'Nearing Limit' : 'On Track'}
                                                </span>
                                                <span className="text-gray-900">{percentage.toFixed(1)}%</span>
                                            </div>
                                            <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full rounded-full transition-all duration-1000 ${progressColor}`} 
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                                            <Calendar size={14} className="text-gray-400" />
                                            <span className="text-xs font-bold text-gray-400">
                                                {budget.startDate} — {budget.endDate}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {showAdd && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
                        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight">New Envelope</h3>
                            <button onClick={() => setShowAdd(false)} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-2xl transition-all">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleAdd} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Envelope Name</label>
                                <input 
                                    type="text" 
                                    required
                                    value={newBudget.name}
                                    onChange={e => setNewBudget({...newBudget, name: e.target.value})}
                                    placeholder="e.g. Dining Out"
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 focus:bg-white focus:ring-4 focus:ring-[#106E4E]/10 focus:border-[#106E4E] outline-none transition-all placeholder:text-gray-300"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Budget Limit ($)</label>
                                <input 
                                    type="number" 
                                    required
                                    value={newBudget.amount}
                                    onChange={e => setNewBudget({...newBudget, amount: e.target.value})}
                                    placeholder="500.00"
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 tabular-nums focus:bg-white focus:ring-4 focus:ring-[#106E4E]/10 focus:border-[#106E4E] outline-none transition-all placeholder:text-gray-300"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Period</label>
                                <select 
                                    value={newBudget.periodType}
                                    onChange={e => setNewBudget({...newBudget, periodType: e.target.value})}
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 focus:bg-white focus:ring-4 focus:ring-[#106E4E]/10 focus:border-[#106E4E] outline-none transition-all appearance-none"
                                >
                                    <option value="weekly">Weekly Allocation</option>
                                    <option value="monthly">Monthly Allocation</option>
                                    <option value="yearly">Yearly Allocation</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Start Date</label>
                                    <input 
                                        type="date" 
                                        required
                                        value={newBudget.startDate}
                                        onChange={e => setNewBudget({...newBudget, startDate: e.target.value})}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 focus:bg-white focus:ring-4 focus:ring-[#106E4E]/10 focus:border-[#106E4E] outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">End Date</label>
                                    <input 
                                        type="date" 
                                        required
                                        value={newBudget.endDate}
                                        onChange={e => setNewBudget({...newBudget, endDate: e.target.value})}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 focus:bg-white focus:ring-4 focus:ring-[#106E4E]/10 focus:border-[#106E4E] outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <button type="submit" className="w-full py-5 bg-[#106E4E] text-white font-black rounded-2xl hover:bg-[#0d593f] shadow-xl shadow-[#106E4E]/20 transition-all mt-4">
                                Start Tracking
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
