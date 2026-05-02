import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const ICONS = {
    success: { Icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    error:   { Icon: XCircle,     color: 'text-rose-500',    bg: 'bg-rose-50',    border: 'border-rose-200' },
    warning: { Icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50',   border: 'border-amber-200' },
    info:    { Icon: Info,         color: 'text-blue-500',   bg: 'bg-blue-50',    border: 'border-blue-200' },
};

let toastId = 0;

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const dismiss = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const addToast = useCallback((message, type = 'info', duration = 4000) => {
        const id = ++toastId;
        setToasts(prev => [...prev, { id, message, type }]);
        if (duration > 0) {
            setTimeout(() => dismiss(id), duration);
        }
        return id;
    }, [dismiss]);

    const toast = {
        success: (msg, dur) => addToast(msg, 'success', dur),
        error:   (msg, dur) => addToast(msg, 'error',   dur ?? 6000),
        warning: (msg, dur) => addToast(msg, 'warning', dur),
        info:    (msg, dur) => addToast(msg, 'info',    dur),
    };

    // Expose error toast to Axios interceptor (avoids circular import)
    React.useEffect(() => {
        window.__showErrorToast = (msg) => addToast(msg, 'error', 6000);
        return () => { delete window.__showErrorToast; };
    }, [addToast]);

    return (
        <ToastContext.Provider value={toast}>
            {children}
            {/* Toast container */}
            <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
                {toasts.map(t => {
                    const cfg = ICONS[t.type] || ICONS.info;
                    const { Icon } = cfg;
                    return (
                        <div
                            key={t.id}
                            className={`flex items-start gap-3 p-4 rounded-2xl border shadow-xl pointer-events-auto
                                       animate-in slide-in-from-right-8 fade-in duration-300
                                       ${cfg.bg} ${cfg.border}`}
                        >
                            <Icon size={20} className={`${cfg.color} shrink-0 mt-0.5`} />
                            <p className="text-sm font-semibold text-gray-800 flex-1 leading-snug">{t.message}</p>
                            <button
                                onClick={() => dismiss(t.id)}
                                className="text-gray-400 hover:text-gray-700 transition-colors shrink-0"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    );
                })}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
    return ctx;
}
