import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Tag, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { categoryApi } from '../services/api';

export default function CategoriesPanel() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [newCat, setNewCat] = useState({ name: '', type: 'expense', colorHex: '#ef4444' });

    useEffect(() => { fetchCategories(); }, []);

    const fetchCategories = async () => {
        try { const res = await categoryApi.getAll(); setCategories(res.data); }
        catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await categoryApi.create(newCat);
            setShowAdd(false);
            setNewCat({ name: '', type: 'expense', colorHex: '#ef4444' });
            fetchCategories();
        } catch (err) { console.error(err); }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-[#106E4E] border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-gray-400">Organize your spending and income</p>
                <button onClick={() => setShowAdd(true)}
                    className="flex items-center gap-2 bg-gray-900 hover:bg-[#106E4E] text-white px-5 py-3 rounded-2xl font-black text-sm transition-all shadow-lg active:scale-95">
                    <Plus size={16} /> New Category
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {categories.map((cat) => (
                    <div key={cat.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm group hover:shadow-xl transition-all">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg"
                                style={{ backgroundColor: cat.colorHex }}>
                                <Tag size={24} />
                            </div>
                            <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${cat.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {cat.type === 'income' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                {cat.type}
                            </div>
                        </div>
                        <h3 className="text-lg font-black text-gray-900 mb-6">{cat.name}</h3>
                        <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showAdd && (
                <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
                        <h2 className="text-2xl font-black text-gray-900 mb-8">New Category</h2>
                        <form onSubmit={handleAdd} className="space-y-6">
                            <div className="flex bg-gray-50 p-1 rounded-2xl">
                                <button type="button" onClick={() => setNewCat({...newCat, type: 'expense'})}
                                    className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${newCat.type === 'expense' ? 'bg-white text-rose-500 shadow-sm' : 'text-gray-400'}`}>
                                    Expense
                                </button>
                                <button type="button" onClick={() => setNewCat({...newCat, type: 'income'})}
                                    className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${newCat.type === 'income' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-400'}`}>
                                    Income
                                </button>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Name</label>
                                <input type="text" required value={newCat.name} onChange={e => setNewCat({...newCat, name: e.target.value})}
                                    className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#106E4E]/20 font-bold text-gray-700"
                                    placeholder="e.g. Health, Travel, Salary" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Color</label>
                                <div className="flex flex-wrap gap-2">
                                    {['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#64748b', '#000000'].map(color => (
                                        <button key={color} type="button" onClick={() => setNewCat({...newCat, colorHex: color})}
                                            className={`w-8 h-8 rounded-full transition-all ${newCat.colorHex === color ? 'ring-4 ring-gray-100 scale-110' : 'hover:scale-105'}`}
                                            style={{ backgroundColor: color }} />
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-4 text-gray-500 font-bold hover:bg-gray-50 rounded-2xl transition-all">Cancel</button>
                                <button type="submit" className="flex-1 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-[#106E4E] transition-all shadow-lg">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
