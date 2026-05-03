import React, { useState, useEffect } from 'react';
import { Plus, Trash2, RefreshCcw, Calendar, CreditCard, Activity, X } from 'lucide-react';
import { subscriptionApi } from '../services/api';

export default function SubscriptionsPage() {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [newSub, setNewSub] = useState({ name: '', estimatedAmount: '', frequency: 'monthly', nextDueDate: '' });

    useEffect(() => {
        fetchSubs();
    }, []);

    const fetchSubs = async () => {
        try {
            const res = await subscriptionApi.getAll();
            setSubscriptions(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await subscriptionApi.create(newSub);
            setShowAdd(false);
            fetchSubs();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Cancel this subscription tracking?')) {
            try {
                await subscriptionApi.delete(id);
                fetchSubs();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const monthlyTotal = subscriptions.reduce((sum, sub) => {
        let amount = parseFloat(sub.estimatedAmount) || 0;
        if (sub.frequency === 'yearly') amount /= 12;
        if (sub.frequency === 'weekly') amount *= 4.33;
        return sum + amount;
    }, 0);

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
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">Recurring Commitments</p>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tighter">
                        Your <span className="text-[#106E4E]">Subscriptions.</span>
                    </h1>
                </div>
                <div className="flex gap-4">
                    <div className="flex flex-col items-end pr-4 border-r border-gray-200">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Monthly Run Rate</p>
                        <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-black text-gray-900 tabular-nums">${monthlyTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h2>
                        </div>
                    </div>
                    <button 
                        onClick={() => setShowAdd(true)}
                        className="bg-gray-900 text-white px-6 py-4 rounded-2xl font-black text-sm hover:bg-[#106E4E] transition-all flex items-center gap-2 shadow-xl shadow-gray-900/10"
                    >
                        <Plus size={18} /> Add Service
                    </button>
                </div>
            </div>

            {subscriptions.length === 0 ? (
                <div className="bg-white p-20 rounded-[3rem] border border-dashed border-gray-200 flex flex-col items-center text-center shadow-sm">
                    <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-[#106E4E] mb-6 shadow-inner">
                        <RefreshCcw size={48} strokeWidth={1.5} className="animate-bounce-slow" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">No subscriptions tracked</h3>
                    <p className="text-gray-400 font-medium max-w-md">Add your recurring services like Netflix, Spotify, or gym memberships to see your true monthly run rate.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {subscriptions.map((sub, index) => {
                        const amount = parseFloat(sub.estimatedAmount) || 0;
                        const isHighValue = sub.frequency === 'monthly' && amount > 50 || sub.frequency === 'yearly' && amount > 500;
                        
                        return (
                            <div key={sub.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:bg-[#106E4E]/10 transition-colors duration-700" />
                                
                                <div className="relative z-10">
                                    <div className="flex items-start justify-between mb-8">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isHighValue ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-50 text-gray-400'}`}>
                                            <RefreshCcw size={24} className={isHighValue ? "animate-[spin_4s_linear_infinite]" : ""} />
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <div className="text-right">
                                                <p className="text-3xl font-black text-gray-900 tabular-nums">${amount.toLocaleString()}</p>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">per {sub.frequency}</p>
                                            </div>
                                            <button 
                                                onClick={() => handleDelete(sub.id)}
                                                className="p-2 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-black text-gray-900 tracking-tight leading-tight mb-8">{sub.name}</h3>

                                    <div className="space-y-4 pt-6 border-t border-gray-50">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <Calendar size={14} />
                                                <span className="font-bold uppercase tracking-widest text-[10px]">Next Bill</span>
                                            </div>
                                            <span className="font-bold text-gray-900 text-sm">
                                                {sub.nextDueDate ? new Date(sub.nextDueDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'}) : 'Not specified'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <Activity size={14} />
                                                <span className="font-bold uppercase tracking-widest text-[10px]">Status</span>
                                            </div>
                                            <span className="text-[#106E4E] font-black uppercase tracking-widest text-[10px] bg-[#106E4E]/10 px-3 py-1 rounded-full">
                                                {sub.status || 'Active'}
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
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Add Subscription</h3>
                            <button onClick={() => setShowAdd(false)} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-2xl transition-all">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleAdd} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Service Name</label>
                                <input 
                                    type="text" 
                                    required
                                    value={newSub.name}
                                    onChange={e => setNewSub({...newSub, name: e.target.value})}
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 focus:bg-white focus:ring-4 focus:ring-[#106E4E]/10 focus:border-[#106E4E] outline-none transition-all placeholder:text-gray-300"
                                    placeholder="e.g. Netflix, Spotify"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Billing Amount ($)</label>
                                    <input 
                                        type="number" 
                                        required
                                        value={newSub.estimatedAmount}
                                        onChange={e => setNewSub({...newSub, estimatedAmount: e.target.value})}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 tabular-nums focus:bg-white focus:ring-4 focus:ring-[#106E4E]/10 focus:border-[#106E4E] outline-none transition-all placeholder:text-gray-300"
                                        placeholder="15.99"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Billing Cycle</label>
                                    <select 
                                        value={newSub.frequency}
                                        onChange={e => setNewSub({...newSub, frequency: e.target.value})}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 focus:bg-white focus:ring-4 focus:ring-[#106E4E]/10 focus:border-[#106E4E] outline-none transition-all appearance-none"
                                    >
                                        <option value="weekly">Weekly</option>
                                        <option value="monthly">Monthly</option>
                                        <option value="yearly">Yearly</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Next Billing Date</label>
                                <input 
                                    type="date" 
                                    required
                                    value={newSub.nextDueDate}
                                    onChange={e => setNewSub({...newSub, nextDueDate: e.target.value})}
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 focus:bg-white focus:ring-4 focus:ring-[#106E4E]/10 focus:border-[#106E4E] outline-none transition-all"
                                />
                            </div>
                            <button type="submit" className="w-full py-5 bg-[#106E4E] text-white font-black rounded-2xl hover:bg-[#0d593f] shadow-xl shadow-[#106E4E]/20 transition-all mt-4">
                                Track Subscription
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
