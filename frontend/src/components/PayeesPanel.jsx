import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Globe, FileText, Search, UserCheck } from 'lucide-react';
import { payeeApi } from '../services/api';

export default function PayeesPanel() {
    const [payees, setPayees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [search, setSearch] = useState('');
    const [newPayee, setNewPayee] = useState({ name: '', website: '', notes: '' });

    useEffect(() => { fetchPayees(); }, []);

    const fetchPayees = async () => {
        try { const res = await payeeApi.getAll(); setPayees(res.data); }
        catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await payeeApi.create(newPayee);
            setShowAdd(false);
            setNewPayee({ name: '', website: '', notes: '' });
            fetchPayees();
        } catch (err) { console.error(err); }
    };

    const filteredPayees = payees.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-[#106E4E] border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input type="text" placeholder="Search contacts..."
                        value={search} onChange={e => setSearch(e.target.value)}
                        className="bg-white border-2 border-gray-100 pl-11 pr-6 py-3 rounded-2xl outline-none focus:border-[#106E4E] font-bold text-gray-700 w-64 shadow-sm text-sm" />
                </div>
                <button onClick={() => setShowAdd(true)}
                    className="flex items-center gap-2 bg-gray-900 hover:bg-[#106E4E] text-white px-5 py-3 rounded-2xl font-black text-sm transition-all shadow-lg active:scale-95">
                    <Plus size={16} /> New Contact
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPayees.map((payee) => (
                    <div key={payee.id} className="bg-white p-7 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                        <div className="flex items-center justify-between mb-6">
                            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-[#106E4E]/10 group-hover:text-[#106E4E] transition-colors">
                                <UserCheck size={28} />
                            </div>
                            <button className="p-3 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all">
                                <Trash2 size={18} />
                            </button>
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-4">{payee.name}</h3>
                        <div className="space-y-3">
                            {payee.website && (
                                <a href={payee.website} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm font-bold text-[#106E4E] hover:underline">
                                    <Globe size={16} />
                                    {payee.website.replace(/^https?:\/\//, '')}
                                </a>
                            )}
                            {payee.notes && (
                                <div className="flex items-start gap-3 text-sm text-gray-500 font-medium">
                                    <FileText size={16} className="mt-1 flex-shrink-0" />
                                    <p className="line-clamp-2">{payee.notes}</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {showAdd && (
                <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
                        <h2 className="text-2xl font-black text-gray-900 mb-8">Add Contact</h2>
                        <form onSubmit={handleAdd} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Full Name / Company</label>
                                <input type="text" required value={newPayee.name} onChange={e => setNewPayee({...newPayee, name: e.target.value})}
                                    className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#106E4E]/20 font-bold text-gray-700"
                                    placeholder="e.g. John Doe, Starbucks" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Website (Optional)</label>
                                <input type="url" value={newPayee.website} onChange={e => setNewPayee({...newPayee, website: e.target.value})}
                                    className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#106E4E]/20 font-bold text-gray-700"
                                    placeholder="https://example.com" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Private Notes</label>
                                <textarea value={newPayee.notes} onChange={e => setNewPayee({...newPayee, notes: e.target.value})}
                                    className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#106E4E]/20 font-bold text-gray-700 min-h-[100px] resize-none"
                                    placeholder="Account number, contact details, etc." />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-4 text-gray-500 font-bold hover:bg-gray-50 rounded-2xl transition-all">Cancel</button>
                                <button type="submit" className="flex-1 py-4 bg-[#106E4E] text-white font-bold rounded-2xl hover:bg-[#0d593f] shadow-lg shadow-emerald-100 transition-all">Save Contact</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
