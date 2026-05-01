import React from 'react';

const Button = ({ children, onClick, type = 'button', variant = 'primary', className = '', disabled = false, ...props }) => {
    const baseStyle = "flex items-center justify-center gap-2 px-8 py-4 rounded-[24px] font-bold transition-all shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
        primary: "bg-slate-900 hover:bg-slate-800 text-white",
        secondary: "bg-slate-100 hover:bg-slate-200 text-slate-800 shadow-none",
        danger: "bg-rose-500 hover:bg-rose-600 text-white",
        ghost: "bg-transparent hover:bg-slate-100 text-slate-600 shadow-none"
    };

    return (
        <button 
            type={type} 
            onClick={onClick} 
            disabled={disabled}
            className={`${baseStyle} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
