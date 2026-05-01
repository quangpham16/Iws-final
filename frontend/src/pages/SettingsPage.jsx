import React, { useState } from 'react';
import { User, Lock, Bell, Globe, Save, Camera } from 'lucide-react';

export default function SettingsPage() {
    const user = JSON.parse(localStorage.getItem('user')) || { fullName: 'Guest', email: 'guest@example.com' };
    const [profile, setProfile] = useState({ fullName: user.fullName, email: user.email });

    return (
        <div className="max-w-4xl space-y-8 animate-in fade-in duration-700">
            <div>
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">Settings</h1>
                <p className="text-slate-500 font-medium">Manage your profile and application preferences</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Navigation */}
                <div className="space-y-2">
                    {['Profile', 'Security', 'Notifications', 'Preferences'].map((item, index) => (
                        <button 
                            key={item}
                            className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${index === 0 ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-500 hover:bg-slate-100'}`}
                        >
                            {index === 0 && <User size={18} />}
                            {index === 1 && <Lock size={18} />}
                            {index === 2 && <Bell size={18} />}
                            {index === 3 && <Globe size={18} />}
                            {item}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="md:col-span-2 space-y-8">
                    <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
                        <div className="flex items-center gap-8">
                            <div className="relative group">
                                <div className="w-24 h-24 bg-emerald-100 rounded-[32px] flex items-center justify-center text-3xl font-black text-emerald-700">
                                    {profile.fullName.charAt(0)}
                                </div>
                                <button className="absolute -bottom-2 -right-2 p-3 bg-white rounded-2xl shadow-xl border border-slate-100 text-slate-400 hover:text-emerald-500 transition-all opacity-0 group-hover:opacity-100">
                                    <Camera size={18} />
                                </button>
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-800">Public Profile</h3>
                                <p className="text-sm font-medium text-slate-400">Update your photo and personal details</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                <input 
                                    type="text" 
                                    value={profile.fullName}
                                    onChange={e => setProfile({...profile, fullName: e.target.value})}
                                    className="w-full bg-slate-50 border-none px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-slate-700"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                <input 
                                    type="email" 
                                    value={profile.email}
                                    readOnly
                                    className="w-full bg-slate-100 border-none px-6 py-4 rounded-2xl outline-none font-bold text-slate-400 cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
                                <Save size={18} />
                                Save Changes
                            </button>
                        </div>
                    </div>

                    <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
                        <h3 className="text-xl font-black text-slate-800">Change Password</h3>
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                                <input 
                                    type="password" 
                                    className="w-full bg-slate-50 border-none px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-slate-700"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                        <div className="pt-2 flex justify-end">
                            <button className="text-sm font-black text-slate-800 hover:text-emerald-600 transition-all">Update Password</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
