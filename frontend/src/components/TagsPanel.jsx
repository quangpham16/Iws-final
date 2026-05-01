import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Hash } from 'lucide-react';
import { tagApi } from '../services/api';

export default function TagsPanel() {
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [newTag, setNewTag] = useState({ name: '', colorHex: '#10b981' });

    useEffect(() => { fetchTags(); }, []);

    const fetchTags = async () => {
        try { const res = await tagApi.getAll(); setTags(res.data); }
        catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await tagApi.create(newTag);
            setShowAdd(false);
            setNewTag({ name: '', colorHex: '#10b981' });
            fetchTags();
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
                <p className="text-sm font-bold text-gray-400">Fine-tune your transaction organization</p>
                <button onClick={() => setShowAdd(true)}
                    className="flex items-center gap-2 bg-gray-900 hover:bg-[#106E4E] text-white px-5 py-3 rounded-2xl font-black text-sm transition-all shadow-lg active:scale-95">
                    <Plus size={16} /> Create Tag
                </button>
            </div>

            <div className="flex flex-wrap gap-4">
                {tags.map((tag) => (
                    <div key={tag.id}
                        style={{ backgroundColor: `${tag.colorHex}10`, borderColor: `${tag.colorHex}30`, color: tag.colorHex }}
                        className="flex items-center gap-3 px-6 py-4 rounded-3xl border-2 font-black text-sm group hover:scale-105 transition-all shadow-sm">
                        <Hash size={18} />
                        <span className="uppercase tracking-widest">{tag.name}</span>
                        <button className="ml-4 p-1 hover:bg-white/50 rounded-lg transition-colors text-slate-400 hover:text-rose-500">
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>

            {showAdd && (
                <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
                        <h2 className="text-2xl font-black text-gray-900 mb-8">New Label</h2>
                        <form onSubmit={handleAdd} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Tag Name</label>
                                <input type="text" required value={newTag.name} onChange={e => setNewTag({...newTag, name: e.target.value})}
                                    className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#106E4E]/20 font-bold text-gray-700"
                                    placeholder="e.g. Work, Urgent, Gift" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Label Color</label>
                                <div className="flex gap-3">
                                    {['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#6366f1', '#ec4899', '#64748b'].map(color => (
                                        <button key={color} type="button" onClick={() => setNewTag({...newTag, colorHex: color})}
                                            className={`w-10 h-10 rounded-full transition-all ${newTag.colorHex === color ? 'ring-4 ring-gray-100 scale-110' : 'hover:scale-105'}`}
                                            style={{ backgroundColor: color }} />
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-4 text-gray-500 font-bold hover:bg-gray-50 rounded-2xl transition-all">Cancel</button>
                                <button type="submit" className="flex-1 py-4 bg-[#106E4E] text-white font-bold rounded-2xl hover:bg-[#0d593f] shadow-lg shadow-emerald-100 transition-all">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
