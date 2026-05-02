import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Globe, FileText, Search, UserCheck } from 'lucide-react';
import { payeeApi } from '../services/api';

export default function PayeesPage() {
    const [payees, setPayees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [search, setSearch] = useState('');
    const [newPayee, setNewPayee] = useState({ name: '', website: '', notes: '' });

    useEffect(() => {
        fetchPayees();
    }, []);

    const fetchPayees = async () => {
        try {
            const res = await payeeApi.getAll();
            setPayees(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await payeeApi.create(newPayee);
            setShowAdd(false);
            setNewPayee({ name: '', website: '', notes: '' });
            fetchPayees();
        } catch (err) {
            console.error(err);
        }
    };

    const filteredPayees = payees.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Payees & Payers</h1>
                    <p className="text-slate-500 font-medium">Manage contacts for your transactions</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search contacts..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="bg-white border-none pl-12 pr-6 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-slate-700 w-64 shadow-sm"
                        />
                    </div>
                    <button 
                        onClick={() => setShowAdd(true)}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-200 active:scale-95"
                    >
                        <Plus size={20} />
                        New Contact
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPayees.map((payee) => (
                        <div key={payee.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                            <div className="flex items-center justify-between mb-8">
                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                                    <UserCheck size={32} />
                                </div>
                                <button className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all">
                                    <Trash2 size={20} />
                                </button>
                            </div>

                            <h3 className="text-xl font-black text-slate-800 mb-4">{payee.name}</h3>
                            
                            <div className="space-y-3">
                                {payee.website && (
                                    <a href={payee.website} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm font-bold text-emerald-600 hover:underline">
                                        <Globe size={16} />
                                        {payee.website.replace(/^https?:\/\//, '')}
                                    </a>
                                )}
                                {payee.notes && (
                                    <div className="flex items-start gap-3 text-sm text-slate-500 font-medium">
                                        <FileText size={16} className="mt-1 flex-shrink-0" />
                                        <p className="line-clamp-2">{payee.notes}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showAdd && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
                        <h2 className="text-2xl font-black text-slate-800 mb-8">Add Contact</h2>
                        <form onSubmit={handleAdd} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name / Company</label>
                                <input 
                                    type="text" 
                                    required
                                    value={newPayee.name}
                                    onChange={e => setNewPayee({...newPayee, name: e.target.value})}
                                    className="w-full bg-slate-50 border-none px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-slate-700"
                                    placeholder="e.g. John Doe, Starbucks, Netflix"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Website (Optional)</label>
                                <input 
                                    type="url" 
                                    value={newPayee.website}
                                    onChange={e => setNewPayee({...newPayee, website: e.target.value})}
                                    className="w-full bg-slate-50 border-none px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-slate-700"
                                    placeholder="https://example.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Private Notes</label>
                                <textarea 
                                    value={newPayee.notes}
                                    onChange={e => setNewPayee({...newPayee, notes: e.target.value})}
                                    className="w-full bg-slate-50 border-none px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-slate-700 min-h-[100px] resize-none"
                                    placeholder="Account number, contact details, etc."
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-all">Cancel</button>
                                <button type="submit" className="flex-1 py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all">Save Contact</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
