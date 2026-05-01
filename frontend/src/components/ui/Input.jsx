import React from 'react';

const Input = ({ label, icon: Icon, type = 'text', className = '', error, ...props }) => {
    return (
        <div className="space-y-2">
            {label && <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>}
            <div className="relative">
                {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />}
                <input 
                    type={type}
                    className={`w-full bg-slate-50 border border-transparent ${Icon ? 'pl-12' : 'px-6'} pr-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white focus:border-slate-200 font-bold text-slate-700 transition-all ${error ? 'border-rose-500 bg-rose-50' : ''} ${className}`}
                    {...props}
                />
            </div>
            {error && <p className="text-xs text-rose-500 font-bold ml-2">{error}</p>}
        </div>
    );
};

export default Input;
