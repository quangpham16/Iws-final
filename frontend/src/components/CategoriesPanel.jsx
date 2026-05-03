import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Tag, ArrowUpRight, ArrowDownRight, Edit2, X } from 'lucide-react';
import { categoryApi } from '../services/api';
import ColorPicker from './ColorPicker';

export default function CategoriesPanel() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCat, setEditingCat] = useState(null);
    const [formData, setFormData] = useState({ name: '', type: 'expense', colorHex: '#ef4444' });
    const [showColorPicker, setShowColorPicker] = useState(false);
    const colorPickerRef = useRef(null);

    useEffect(() => { fetchCategories(); }, []);

    const fetchCategories = async () => {
        try { const res = await categoryApi.getAll(); setCategories(res.data); }
        catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const openAdd = () => {
        setEditingCat(null);
        setFormData({ name: '', type: 'expense', colorHex: '#ef4444' });
        setShowModal(true);
    };

    const openEdit = (cat) => {
        setEditingCat(cat);
        setFormData({ name: cat.name, type: cat.type, colorHex: cat.colorHex });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingCat(null);
        setFormData({ name: '', type: 'expense', colorHex: '#ef4444' });
        setShowColorPicker(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.type) {
            alert('Please select a type (Expense or Income)');
            return;
        }
        try {
            const dataToSend = {
                name: formData.name,
                type: formData.type.toLowerCase(),
                colorHex: formData.colorHex
            };
            if (editingCat) {
                await categoryApi.update(editingCat.id, dataToSend);
            } else {
                await categoryApi.create(dataToSend);
            }
            window.__showSuccessToast?.(editingCat ? 'Category updated successfully' : 'Category created successfully');
            closeModal();
            fetchCategories();
        } catch (err) { 
            console.error(err);
            window.__showErrorToast?.(err.response?.data?.message || 'Failed to save category');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this category?')) return;
        try {
            await categoryApi.delete(id);
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
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                        <Tag size={24} className="text-[#106E4E]" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-gray-900">Categories</h2>
                        <p className="text-xs text-gray-400 font-medium">{categories.length} total</p>
                    </div>
                </div>
                <button onClick={openAdd}
                    className="flex items-center gap-2 bg-[#106E4E] hover:bg-[#0d593f] text-white px-5 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-100 active:scale-95">
                    <Plus size={18} /> Add New
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {categories.map((cat) => (
                    <div key={cat.id} className="group bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:border-emerald-200 transition-all cursor-pointer"
                        onClick={() => openEdit(cat)}>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md flex-shrink-0"
                                style={{ backgroundColor: cat.colorHex }}>
                                <Tag size={22} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-gray-900 truncate">{cat.name}</h3>
                                <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full mt-1 ${cat.type === 'income' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                    {cat.type === 'income' ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                                    {cat.type}
                                </span>
                            </div>
                            <button 
                                onClick={(e) => { e.stopPropagation(); handleDelete(cat.id); }}
                                className="p-2 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-gray-900">{editingCat ? 'Edit Category' : 'New Category'}</h2>
                            <button onClick={closeModal} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="flex bg-gray-50 p-1 rounded-2xl">
                                <button type="button" onClick={() => setFormData({...formData, type: 'expense'})}
                                    className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${formData.type === 'expense' ? 'bg-white text-rose-500 shadow-sm' : 'text-gray-400'}`}>
                                    Expense
                                </button>
                                <button type="button" onClick={() => setFormData({...formData, type: 'income'})}
                                    className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${formData.type === 'income' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-400'}`}>
                                    Income
                                </button>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Name</label>
                                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                                    className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#106E4E]/20 font-bold text-gray-700"
                                    placeholder="e.g. Health, Travel, Salary" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Color</label>
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
                                <button type="submit" className="flex-1 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-[#106E4E] transition-all shadow-lg">
                                    {editingCat ? 'Update' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
