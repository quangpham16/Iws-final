import React, { useState, useEffect } from 'react';
import { Plus, Trash2, RefreshCcw, Calendar, CreditCard } from 'lucide-react';
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

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Subscriptions</h1>
                    <p className="text-slate-500 font-medium">Manage your recurring services and memberships</p>
                </div>
                <button 
                    onClick={() => setShowAdd(true)}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-200 active:scale-95"
                >
                    <Plus size={20} />
                    Add Subscription
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subscriptions.map((sub) => (
                        <div key={sub.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm group hover:shadow-xl transition-all">
                            <div className="flex items-center justify-between mb-8">
                                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                                    <RefreshCcw size={28} />
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-black text-slate-800">${sub.estimatedAmount.toLocaleString()}</p>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">per {sub.frequency}</p>
                                </div>
                            </div>

                            <h3 className="text-xl font-black text-slate-800 mb-6">{sub.name}</h3>

                            <div className="space-y-4 pt-4 border-t border-slate-50">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Calendar size={16} />
                                        <span className="font-bold uppercase tracking-widest text-[10px]">Next Bill</span>
                                    </div>
                                    <span className="font-bold text-slate-700">{sub.nextDueDate || 'Not set'}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <CreditCard size={16} />
                                        <span className="font-bold uppercase tracking-widest text-[10px]">Status</span>
                                    </div>
                                    <span className="text-emerald-600 font-bold uppercase tracking-widest text-[10px] bg-emerald-50 px-3 py-1 rounded-full">{sub.status}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showAdd && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
                        <h2 className="text-2xl font-black text-slate-800 mb-8">New Subscription</h2>
                        <form onSubmit={handleAdd} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Service Name</label>
                                <input 
                                    type="text" 
                                    required
                                    value={newSub.name}
                                    onChange={e => setNewSub({...newSub, name: e.target.value})}
                                    className="w-full bg-slate-50 border-none px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-slate-700"
                                    placeholder="Netflix, Spotify, gym, etc."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Amount</label>
                                    <input 
                                        type="number" 
                                        required
                                        value={newSub.estimatedAmount}
                                        onChange={e => setNewSub({...newSub, estimatedAmount: e.target.value})}
                                        className="w-full bg-slate-50 border-none px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-slate-700"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Frequency</label>
                                    <select 
                                        value={newSub.frequency}
                                        onChange={e => setNewSub({...newSub, frequency: e.target.value})}
                                        className="w-full bg-slate-50 border-none px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-slate-700 appearance-none"
                                    >
                                        <option value="weekly">Weekly</option>
                                        <option value="monthly">Monthly</option>
                                        <option value="yearly">Yearly</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Next Due Date</label>
                                <input 
                                    type="date" 
                                    value={newSub.nextDueDate}
                                    onChange={e => setNewSub({...newSub, nextDueDate: e.target.value})}
                                    className="w-full bg-slate-50 border-none px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-slate-700"
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-all">Cancel</button>
                                <button type="submit" className="flex-1 py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all">Add Service</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
