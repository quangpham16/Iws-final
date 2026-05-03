import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Hash, Edit2, X } from 'lucide-react';
import { tagApi } from '../services/api';
import ColorPicker from './ColorPicker';

export default function TagsPanel() {
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTag, setEditingTag] = useState(null);
    const [formData, setFormData] = useState({ name: '', colorHex: '#10b981' });
    const [showColorPicker, setShowColorPicker] = useState(false);
    const colorPickerRef = useRef(null);

    useEffect(() => { fetchTags(); }, []);

    const fetchTags = async () => {
        try { const res = await tagApi.getAll(); setTags(res.data); }
        catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const openAdd = () => {
        setEditingTag(null);
        setFormData({ name: '', colorHex: '#10b981' });
        setShowModal(true);
    };

    const openEdit = (tag) => {
        setEditingTag(tag);
        setFormData({ name: tag.name, colorHex: tag.colorHex });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingTag(null);
        setFormData({ name: '', colorHex: '#10b981' });
        setShowColorPicker(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingTag) {
                await tagApi.update(editingTag.id, formData);
            } else {
                await tagApi.create(formData);
            }
            window.__showSuccessToast?.(editingTag ? 'Tag updated successfully' : 'Tag created successfully');
            closeModal();
            fetchTags();
        } catch (err) { 
            console.error(err);
            window.__showErrorToast?.(err.response?.data?.message || 'Failed to save tag');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this tag?')) return;
        try {
            await tagApi.delete(id);
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
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Hash size={24} className="text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-gray-900">Tags</h2>
                        <p className="text-xs text-gray-400 font-medium">{tags.length} total</p>
                    </div>
                </div>
                <button onClick={openAdd}
                    className="flex items-center gap-2 bg-[#106E4E] hover:bg-[#0d593f] text-white px-5 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-100 active:scale-95">
                    <Plus size={18} /> Add New
                </button>
            </div>

            <div className="flex flex-wrap gap-3">
                {tags.map((tag) => (
                    <div key={tag.id}
                        onClick={() => openEdit(tag)}
                        style={{ backgroundColor: `${tag.colorHex}15`, borderColor: `${tag.colorHex}40`, color: tag.colorHex }}
                        className="group flex items-center gap-2.5 px-4 py-2.5 rounded-xl border-2 font-bold text-sm hover:scale-105 transition-all cursor-pointer">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tag.colorHex }} />
                        <span className="uppercase tracking-wide">{tag.name}</span>
                        <button 
                            onClick={(e) => { e.stopPropagation(); handleDelete(tag.id); }}
                            className="p-1 hover:bg-white/60 rounded transition-colors text-current/50 hover:text-rose-500 ml-1">
                            <Trash2 size={14} />
                        </button>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-gray-900">{editingTag ? 'Edit Tag' : 'New Label'}</h2>
                            <button onClick={closeModal} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Tag Name</label>
                                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                                    className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#106E4E]/20 font-bold text-gray-700"
                                    placeholder="e.g. Work, Urgent, Gift" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Label Color</label>
                                <div className="flex items-center gap-3 relative">
                                    <button 
                                        type="button"
                                        onClick={() => setShowColorPicker(!showColorPicker)}
                                        className="w-12 h-12 rounded-xl border-2 border-gray-200 hover:border-[#106E4E] transition-all shadow-sm"
                                        style={{ backgroundColor: formData.colorHex }}
                                    />
                                    <span className="text-sm font-mono font-bold text-gray-500 uppercase">{formData.colorHex}</span>
                                    {showColorPicker && (
                                        <div className="absolute left-full top-0 ml-3 z-50" ref={colorPickerRef}>
                                            <ColorPicker 
                                                color={formData.colorHex} 
                                                onChange={(color) => {
                                                    setFormData({...formData, colorHex: color});
                                                    setShowColorPicker(false);
                                                }}
                                                onClose={() => setShowColorPicker(false)}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={closeModal} className="flex-1 py-4 text-gray-500 font-bold hover:bg-gray-50 rounded-2xl transition-all">Cancel</button>
                                <button type="submit" className="flex-1 py-4 bg-[#106E4E] text-white font-bold rounded-2xl hover:bg-[#0d593f] shadow-lg shadow-emerald-100 transition-all">
                                    {editingTag ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
