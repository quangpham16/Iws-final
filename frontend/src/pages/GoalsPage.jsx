import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
    Plus, Trash2, Trophy, Clock, Target, TrendingUp, X, Pencil, 
    DollarSign, Tag, Palette, Calendar as CalendarIcon 
} from 'lucide-react';
import { goalApi } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function GoalsPage() {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [editGoal, setEditGoal] = useState(null);
    const [newGoal, setNewGoal] = useState({ 
        name: '', 
        targetAmount: '', 
        currentAmount: 0, 
        targetDate: '',
        colorHex: '#106E4E',
        description: ''
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
            if (editGoal) {
                await goalApi.update(editGoal.id, newGoal);
            } else {
                await goalApi.create(newGoal);
            }
            setShowAdd(false);
            setEditGoal(null);
            setNewGoal({ name: '', targetAmount: '', currentAmount: 0, targetDate: '', colorHex: '#106E4E', description: '' });
            fetchGoals();
        } catch (err) {
            console.error(err);
        }
    };

    const resetForm = () => {
        setEditGoal(null);
        setNewGoal({ name: '', targetAmount: '', currentAmount: 0, targetDate: '', colorHex: '#106E4E', description: '' });
    };

    const handleEdit = (goal) => {
        setEditGoal(goal);
        setNewGoal({
            name: goal.name,
            targetAmount: goal.targetAmount,
            currentAmount: goal.currentAmount,
            targetDate: goal.targetDate ? goal.targetDate.slice(0, 10) : '',
            colorHex: goal.colorHex || '#106E4E',
            description: goal.description || ''
        });
        setShowAdd(true);
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

    const totalTarget = goals.reduce((sum, g) => sum + (parseFloat(g.targetAmount) || 0), 0);
    const totalSaved = goals.reduce((sum, g) => sum + (parseFloat(g.currentAmount) || 0), 0);
    const globalProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <div className="w-10 h-10 border-4 border-[#106E4E] border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-12 max-w-[1600px] mx-auto w-full">
            {/* Header Section */}
            <div className="flex items-end justify-between">
                <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">Wealth Building</p>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tighter">
                        Your <span className="text-[#106E4E]">Aspirations.</span>
                    </h1>
                </div>
                <div className="flex gap-4">
                    <div className="flex flex-col items-end pr-6 border-r border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Global Progress</p>
                        <div className="flex items-center gap-2">
                            <h2 className="text-3xl font-black text-gray-900 tabular-nums">{globalProgress.toFixed(1)}%</h2>
                            <div className="w-8 h-8 rounded-full bg-[#106E4E]/5 flex items-center justify-center">
                                <TrendingUp size={16} className="text-[#106E4E]" />
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={() => { resetForm(); setShowAdd(true); }}
                        className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-[#106E4E] transition-all flex items-center gap-2 shadow-2xl shadow-gray-900/20 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <Plus size={20} /> Define Aspiration
                    </button>
                </div>
            </div>

            {goals.length === 0 ? (
                <div className="bg-white p-24 rounded-[4rem] border border-dashed border-gray-100 flex flex-col items-center text-center">
                    <div className="w-28 h-28 bg-[#F0F9F4] rounded-full flex items-center justify-center text-[#106E4E] mb-8 border border-gray-50 shadow-inner">
                        <Trophy size={56} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Zero aspirations defined</h3>
                    <p className="text-gray-400 font-medium max-w-sm text-lg leading-relaxed">Financial freedom begins with intentionality. Set your first major milestone today.</p>
                    <button 
                        onClick={() => { resetForm(); setShowAdd(true); }}
                        className="mt-10 bg-[#106E4E] text-white px-10 py-5 rounded-2xl font-black text-sm hover:bg-[#0C563D] transition-all shadow-xl shadow-[#106E4E]/20"
                    >
                        Initialize First Goal
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {goals.map((goal, index) => {
                        const target = parseFloat(goal.targetAmount) || 0;
                        const current = parseFloat(goal.currentAmount) || 0;
                        const progress = target > 0 ? Math.min((current / target) * 100, 100) : 0;
                        const isCompleted = progress >= 100;
                        
                        return (
                            <motion.div 
                                key={goal.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 relative overflow-hidden group"
                            >
                                <div 
                                    className="absolute top-0 left-0 w-full h-3 transition-all duration-1000 opacity-90" 
                                    style={{ backgroundColor: goal.colorHex || '#106E4E' }} 
                                />
                                
                                <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full blur-[100px] opacity-[0.08] transition-transform duration-1000 group-hover:scale-150 pointer-events-none"
                                     style={{ backgroundColor: goal.colorHex || '#106E4E' }} />

                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="flex items-start justify-between mb-10">
                                        <div 
                                            className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl group-hover:rotate-6 transition-transform duration-500" 
                                            style={{ backgroundColor: goal.colorHex || '#106E4E', boxShadow: `0 20px 40px -10px ${goal.colorHex}40` }}
                                        >
                                            <Trophy size={28} />
                                        </div>
                                        <div className="flex flex-col items-end gap-3">
                                            <div className="text-right">
                                                <span className="text-4xl font-black text-gray-900 tabular-nums tracking-tighter">{progress.toFixed(0)}%</span>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Momentum</p>
                                            </div>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                                                <button 
                                                    onClick={() => handleEdit(goal)}
                                                    className="p-3 text-gray-300 hover:text-gray-900 hover:bg-gray-50 rounded-2xl transition-all border border-transparent hover:border-gray-100"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(goal.id)}
                                                    className="p-3 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all border border-transparent hover:border-rose-100"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-10">
                                        <h3 className="text-3xl font-black text-gray-900 tracking-tight leading-tight mb-2 group-hover:text-[#106E4E] transition-colors">{goal.name}</h3>
                                        <div className="flex items-center gap-2">
                                            {isCompleted ? (
                                                <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100">
                                                    Achievement Unlocked
                                                </span>
                                            ) : (
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full">In Progress</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-auto space-y-8">
                                        <div className="relative pt-1">
                                            <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner border border-gray-100/50">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${progress}%` }}
                                                    transition={{ duration: 1, ease: "easeOut" }}
                                                    className="h-full rounded-full shadow-lg"
                                                    style={{ backgroundColor: goal.colorHex || '#106E4E' }}
                                                />
                                            </div>
                                            {progress > 0 && progress < 100 && (
                                                <div className="absolute top-0 right-0 -mt-1 mr-1 text-[8px] font-black text-gray-300 bg-white px-1.5 py-0.5 rounded-md border border-gray-100">
                                                    {Math.round(100-progress)}% TO GO
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex justify-between items-end bg-gray-50/50 p-6 rounded-[2rem] border border-gray-50">
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Accumulated</p>
                                                <p className="text-2xl font-black text-gray-900 tabular-nums">${current.toLocaleString()}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Objective</p>
                                                <p className="text-2xl font-black text-gray-200 tabular-nums">${target.toLocaleString()}</p>
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <Clock size={16} className="text-gray-300" />
                                                <span className="text-[11px] font-black uppercase tracking-widest">{goal.targetDate ? new Date(goal.targetDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric', day: 'numeric' }) : 'Flexible horizon'}</span>
                                            </div>
                                            <div className="flex -space-x-2">
                                                {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-100" />)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {createPortal(
                <AnimatePresence>
                    {showAdd && (
                        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 md:p-6 bg-gray-900/40 backdrop-blur-3xl overflow-y-auto">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                                className="bg-white w-full max-w-lg rounded-[3.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.35)] overflow-hidden my-auto border border-white/20"
                            >
                                <div className="p-10 md:p-12 pb-6 border-b border-gray-50 flex items-center justify-between bg-white relative">
                                    <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: newGoal.colorHex || '#106E4E' }} />
                                    <div>
                                        <h3 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter">
                                            {editGoal ? 'Refine Aspiration' : 'Define Aspiration'}
                                        </h3>
                                        <p className="text-gray-400 font-medium mt-1 text-base">Precision is the foundation of wealth.</p>
                                    </div>
                                    <button onClick={() => { setShowAdd(false); setEditGoal(null); }} 
                                        className="p-4 rounded-2xl text-gray-300 hover:bg-gray-50 hover:text-gray-900 transition-all border border-transparent hover:border-gray-100 group">
                                        <X size={28} className="group-hover:rotate-90 transition-transform duration-300" />
                                    </button>
                                </div>

                                <form onSubmit={handleAdd} className="p-10 md:p-12 space-y-10 bg-white">
                                    {/* Aspiration Identity */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 ml-2">
                                            <Tag size={14} className="text-gray-400" />
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Aspiration Identity</label>
                                        </div>
                                        <div className="relative group">
                                            <input 
                                                type="text" 
                                                required
                                                value={newGoal.name}
                                                onChange={e => setNewGoal({...newGoal, name: e.target.value})}
                                                className="w-full px-8 py-5 bg-gray-50 border border-gray-100 rounded-3xl font-black text-gray-900 text-lg focus:bg-white focus:ring-[15px] focus:ring-emerald-500/5 focus:border-[#106E4E] outline-none transition-all placeholder:text-gray-200 shadow-inner"
                                                placeholder="e.g. Sovereign Wealth Fund"
                                            />
                                        </div>
                                    </div>
                                    
                                    {/* Amounts Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 ml-2">
                                                <Target size={14} className="text-gray-400" />
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Objective Amount</label>
                                            </div>
                                            <div className="relative group">
                                                <DollarSign size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#106E4E] transition-colors" />
                                                <input 
                                                    type="number" 
                                                    required
                                                    value={newGoal.targetAmount}
                                                    onChange={e => setNewGoal({...newGoal, targetAmount: e.target.value})}
                                                    className="w-full pl-14 pr-8 py-5 bg-gray-50 border border-gray-100 rounded-3xl font-black text-gray-900 tabular-nums text-lg focus:bg-white focus:ring-[15px] focus:ring-emerald-500/5 focus:border-[#106E4E] outline-none transition-all placeholder:text-gray-200 shadow-inner"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 ml-2">
                                                <TrendingUp size={14} className="text-gray-400" />
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Accumulation</label>
                                            </div>
                                            <div className="relative group">
                                                <DollarSign size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#106E4E] transition-colors" />
                                                <input 
                                                    type="number" 
                                                    value={newGoal.currentAmount}
                                                    onChange={e => setNewGoal({...newGoal, currentAmount: e.target.value})}
                                                    className="w-full pl-14 pr-8 py-5 bg-gray-50 border border-gray-100 rounded-3xl font-black text-gray-900 tabular-nums text-lg focus:bg-white focus:ring-[15px] focus:ring-emerald-500/5 focus:border-[#106E4E] outline-none transition-all placeholder:text-gray-200 shadow-inner"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Aesthetic & Horizon Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 ml-2">
                                                <Palette size={14} className="text-gray-400" />
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Theme Aesthetic</label>
                                            </div>
                                            <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-3xl border border-gray-100 shadow-inner group focus-within:bg-white focus-within:border-[#106E4E] focus-within:ring-[15px] focus-within:ring-emerald-500/5 transition-all">
                                                <div className="relative w-16 h-12 flex-shrink-0">
                                                    <input 
                                                        type="color" 
                                                        value={newGoal.colorHex}
                                                        onChange={e => setNewGoal({...newGoal, colorHex: e.target.value})}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                    />
                                                    <div 
                                                        className="w-full h-full rounded-2xl shadow-sm border border-black/5"
                                                        style={{ backgroundColor: newGoal.colorHex }}
                                                    />
                                                </div>
                                                <input 
                                                    type="text" 
                                                    value={newGoal.colorHex}
                                                    onChange={e => setNewGoal({...newGoal, colorHex: e.target.value})}
                                                    className="w-full bg-transparent border-none outline-none font-black text-gray-900 uppercase tabular-nums text-center text-sm"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 ml-2">
                                                <CalendarIcon size={14} className="text-gray-400" />
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Time Horizon</label>
                                            </div>
                                            <div className="relative group">
                                                <input 
                                                    type="date" 
                                                    value={newGoal.targetDate}
                                                    onChange={e => setNewGoal({...newGoal, targetDate: e.target.value})}
                                                    className="w-full px-8 py-5 bg-gray-50 border border-gray-100 rounded-3xl font-black text-gray-900 focus:bg-white focus:ring-[15px] focus:ring-emerald-500/5 focus:border-[#106E4E] outline-none transition-all shadow-inner"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="pt-8 flex gap-6">
                                        <button type="button" onClick={() => { setShowAdd(false); setEditGoal(null); }}
                                            className="flex-1 py-6 bg-gray-50 text-gray-500 font-black rounded-[2rem] hover:bg-gray-100 hover:text-gray-900 transition-all text-xs uppercase tracking-[0.2em] border border-transparent hover:border-gray-200">
                                            Discard
                                        </button>
                                        <button type="submit" className="flex-[2] py-6 bg-gray-900 text-white font-black rounded-[2rem] hover:bg-[#106E4E] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.3)] hover:shadow-[#106E4E]/40 transition-all text-xs uppercase tracking-[0.3em] active:scale-95">
                                            {editGoal ? 'Commit Changes' : 'Initialize Strategy'}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
}
