import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Tag as TagIcon, Hash, Edit2 } from 'lucide-react';
import { tagApi } from '../services/api';

export default function TagsPage() {
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [editingTag, setEditingTag] = useState(null);
    const [newTag, setNewTag] = useState({ name: '', colorHex: '#10b981' });

    useEffect(() => {
        fetchTags();
    }, []);

    const fetchTags = async () => {
        try {
            const res = await tagApi.getAll();
            setTags(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            if (editingTag) {
                await tagApi.update(editingTag.id, newTag);
            } else {
                await tagApi.create(newTag);
            }
            setShowAdd(false);
            setEditingTag(null);
            setNewTag({ name: '', colorHex: '#10b981' });
            fetchTags();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this tag?')) return;
        try {
            await tagApi.delete(id);
            fetchTags();
        } catch (err) { console.error(err); }
    };

    const handleEdit = (tag) => {
        setEditingTag(tag);
        setNewTag({ name: tag.name, colorHex: tag.colorHex || '#10b981' });
        setShowAdd(true);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Labels & Tags</h1>
                    <p className="text-slate-500 font-medium">Fine-tune your transaction organization</p>
                </div>
                <button 
                    onClick={() => setShowAdd(true)}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-200 active:scale-95"
                >
                    <Plus size={20} />
                    Create Tag
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <div className="flex flex-wrap gap-4">
                    {tags.map((tag) => (
                        <div 
                            key={tag.id} 
                            style={{ backgroundColor: `${tag.colorHex}10`, borderColor: `${tag.colorHex}30`, color: tag.colorHex }}
                            className="flex items-center gap-3 px-6 py-4 rounded-3xl border-2 font-black text-sm group hover:scale-105 transition-all shadow-sm"
                        >
                            <Hash size={18} />
                            <span className="uppercase tracking-widest">{tag.name}</span>
                            <button onClick={() => handleEdit(tag)} className="ml-2 p-1 hover:bg-white/50 rounded-lg transition-colors text-slate-400 hover:text-blue-500">
                                <Edit2 size={16} />
                            </button>
                            <button onClick={() => handleDelete(tag.id)} className="p-1 hover:bg-white/50 rounded-lg transition-colors text-slate-400 hover:text-rose-500">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {showAdd && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-sm rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
                        <h2 className="text-2xl font-black text-slate-800 mb-8">{editingTag ? 'Edit Label' : 'New Label'}</h2>
                        <form onSubmit={handleAdd} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Tag Name</label>
                                <input 
                                    type="text" 
                                    required
                                    value={newTag.name}
                                    onChange={e => setNewTag({...newTag, name: e.target.value})}
                                    className="w-full bg-slate-50 border-none px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-slate-700"
                                    placeholder="e.g. Work, Urgent, Gift"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Label Color</label>
                                <div className="flex gap-3">
                                    {['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#6366f1', '#ec4899', '#64748b'].map(color => (
                                        <button 
                                            key={color}
                                            type="button"
                                            onClick={() => setNewTag({...newTag, colorHex: color})}
                                            className={`w-10 h-10 rounded-full transition-all ${newTag.colorHex === color ? 'ring-4 ring-slate-100 scale-110' : 'hover:scale-105'}`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-all">Cancel</button>
                                <button type="submit" className="flex-1 py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all">{editingTag ? 'Save' : 'Create'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
