import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Trophy, ArrowUpRight, Clock } from 'lucide-react';
import { goalApi } from '../services/api';

export default function GoalsPage() {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [newGoal, setNewGoal] = useState({ 
        name: '', 
        targetAmount: '', 
        currentAmount: 0, 
        targetDate: '',
        colorHex: '#10b981'
    });

    useEffect(() => {
        fetchGoals();
    }, []);

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

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Financial Goals</h1>
                    <p className="text-slate-500 font-medium">Turn your dreams into achievable targets</p>
                </div>
                <button 
                    onClick={() => setShowAdd(true)}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-200 active:scale-95"
                >
                    <Plus size={20} />
                    Define New Goal
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {goals.map((goal) => {
                        const progress = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100) || 0);
                        return (
                            <div key={goal.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: goal.colorHex }} />
                                
                                <div className="flex items-center justify-between mb-8">
                                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white" style={{ backgroundColor: goal.colorHex }}>
                                        <Trophy size={28} />
                                    </div>
                                    <div className="text-right">
                                        <span className="text-2xl font-black text-slate-800">{progress}%</span>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Achieved</p>
                                    </div>
                                </div>

                                <h3 className="text-xl font-black text-slate-800 mb-6">{goal.name}</h3>

                                <div className="space-y-6">
                                    <div className="w-full h-3 bg-slate-50 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full rounded-full transition-all duration-1000"
                                            style={{ backgroundColor: goal.colorHex, width: `${progress}%` }}
                                        />
                                    </div>

                                    <div className="flex justify-between">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Current</p>
                                            <p className="font-bold text-slate-700">${goal.currentAmount.toLocaleString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Target</p>
                                            <p className="font-bold text-slate-800">${goal.targetAmount.toLocaleString()}</p>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-slate-50 flex items-center gap-2 text-slate-400">
                                        <Clock size={14} />
                                        <span className="text-xs font-bold">Target Date: {goal.targetDate || 'Flexible'}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {showAdd && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
                        <h2 className="text-2xl font-black text-slate-800 mb-8">Define Goal</h2>
                        <form onSubmit={handleAdd} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Goal Name</label>
                                <input 
                                    type="text" 
                                    required
                                    value={newGoal.name}
                                    onChange={e => setNewGoal({...newGoal, name: e.target.value})}
                                    className="w-full bg-slate-50 border-none px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-slate-700"
                                    placeholder="Buy a Car, House Downpayment, etc."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Target Amount</label>
                                    <input 
                                        type="number" 
                                        required
                                        value={newGoal.targetAmount}
                                        onChange={e => setNewGoal({...newGoal, targetAmount: e.target.value})}
                                        className="w-full bg-slate-50 border-none px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-slate-700"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Target Date</label>
                                    <input 
                                        type="date" 
                                        value={newGoal.targetDate}
                                        onChange={e => setNewGoal({...newGoal, targetDate: e.target.value})}
                                        className="w-full bg-slate-50 border-none px-4 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-slate-700"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-all">Cancel</button>
                                <button type="submit" className="flex-1 py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all">Start Goal</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
