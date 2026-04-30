import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, Target, AlertCircle } from 'lucide-react';
import { budgetApi } from '../services/api';

export default function BudgetsPage() {
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [newBudget, setNewBudget] = useState({ 
        name: '', 
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

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Budgets</h1>
                    <p className="text-slate-500 font-medium">Set limits and save more effectively</p>
                </div>
                <button 
                    onClick={() => setShowAdd(true)}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-200 active:scale-95"
                >
                    <Plus size={20} />
                    New Budget
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : budgets.length === 0 ? (
                <div className="bg-white p-20 rounded-[40px] border border-dashed border-slate-200 flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 mb-6">
                        <AlertCircle size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">No budgets set yet</h3>
                    <p className="text-slate-500 max-w-sm mb-8">Establish your first budget to start tracking your spending habits with precision.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {budgets.map((budget) => (
                        <div key={budget.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -translate-y-1/2 translate-x-1/2 -z-10 group-hover:scale-110 transition-transform duration-700" />
                            
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                                        <Target size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-800">{budget.name}</h3>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                                            {budget.periodType}
                                        </span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleDelete(budget.id)}
                                    className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-slate-500 font-bold text-sm">
                                    <Calendar size={18} className="text-slate-300" />
                                    <span>{budget.startDate} — {budget.endDate}</span>
                                </div>
                                
                                <div className="pt-4">
                                    <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                                        <span>Utilization</span>
                                        <span>0%</span>
                                    </div>
                                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 rounded-full w-0 transition-all duration-1000" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showAdd && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
                        <h2 className="text-2xl font-black text-slate-800 mb-8">Plan Budget</h2>
                        <form onSubmit={handleAdd} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Budget Name</label>
                                <input 
                                    type="text" 
                                    required
                                    value={newBudget.name}
                                    onChange={e => setNewBudget({...newBudget, name: e.target.value})}
                                    className="w-full bg-slate-50 border-none px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-slate-700"
                                    placeholder="Monthly Groceries, Entertainment, etc."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Period</label>
                                <select 
                                    value={newBudget.periodType}
                                    onChange={e => setNewBudget({...newBudget, periodType: e.target.value})}
                                    className="w-full bg-slate-50 border-none px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-slate-700 appearance-none"
                                >
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="yearly">Yearly</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Start Date</label>
                                    <input 
                                        type="date" 
                                        required
                                        value={newBudget.startDate}
                                        onChange={e => setNewBudget({...newBudget, startDate: e.target.value})}
                                        className="w-full bg-slate-50 border-none px-4 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-slate-700"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">End Date</label>
                                    <input 
                                        type="date" 
                                        required
                                        value={newBudget.endDate}
                                        onChange={e => setNewBudget({...newBudget, endDate: e.target.value})}
                                        className="w-full bg-slate-50 border-none px-4 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-slate-700"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-all">Cancel</button>
                                <button type="submit" className="flex-1 py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all">Start Tracking</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
