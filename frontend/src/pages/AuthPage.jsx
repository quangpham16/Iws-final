import React, { useState, useEffect } from 'react';
import { Mail, Lock, ArrowRight, ArrowLeft, User, ShieldAlert, ShieldCheck, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';

export default function AuthPage() {
    const [view, setView] = useState('auth');
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ email: '', password: '', fullName: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(59);
    const navigate = useNavigate();

    const handleAuth = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            if (isLogin) {
                const res = await authApi.login({ email: formData.email, password: formData.password });
                localStorage.setItem('user', JSON.stringify(res.data));
                navigate('/dashboard');
            } else {
                if (formData.password !== formData.confirmPassword) {
                    throw new Error("Passwords do not match");
                }
                await authApi.register({ 
                    email: formData.email, 
                    password: formData.password, 
                    fullName: formData.fullName 
                });
                
                // Show success message and switch to login view
                setSuccess('Registration successful! Please log in to your new vault.');
                setIsLogin(true);
                // Clear password fields for safety
                setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let interval;
        if (view === 'verification' && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [view, timer]);

    const handleOtpChange = (element, index) => {
        if (isNaN(element.value)) return false;
        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
        if (element.nextSibling && element.value !== "") {
            element.nextSibling.focus();
        }
    };

    return (
        <div className="flex min-h-screen bg-[#fcfdfc] font-sans selection:bg-emerald-100 selection:text-emerald-900">
            {/* LEFT COLUMN */}
            <div className="relative hidden w-1/2 lg:flex flex-col justify-between p-16 overflow-hidden bg-emerald-900">
                <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/40 via-emerald-800/80 to-emerald-950/95" />

                <div className="relative z-10 flex items-center gap-2">
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-md border border-white/20">
                        <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                    </div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Equilibrium Verdant</h2>
                </div>

                <div className="relative z-10 max-w-lg">
                    <h1 className="text-6xl font-bold text-white leading-[1.1] mb-8 tracking-tight">
                        Architectural<br />Financial <span className="text-emerald-400">Growth.</span>
                    </h1>
                    <p className="text-emerald-50/80 text-xl leading-relaxed font-medium">
                        Join an ecosystem where wealth is nurtured through structural integrity and organic momentum. Your harvest begins with a single intentional choice.
                    </p>
                </div>

                <div className="relative z-10 p-8 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 max-w-md shadow-2xl">
                    <p className="text-white text-lg italic mb-6 leading-relaxed font-light">
                        "The most sophisticated approach to wealth preservation I have encountered in the digital age."
                    </p>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-400 rounded-2xl flex items-center justify-center font-bold text-emerald-950 shadow-lg transform rotate-3">
                            AV
                        </div>
                        <div>
                            <p className="text-white font-bold">Adrian Verdant</p>
                            <p className="text-emerald-400/80 text-sm font-medium">Principal Architect, Equilibrium</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 bg-white relative overflow-hidden">
                <div className="w-full max-w-md relative z-10">

                    {success && (
                        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md animate-in slide-in-from-top-full duration-500">
                            <div className="mx-4 p-4 bg-emerald-600 text-white rounded-2xl shadow-2xl shadow-emerald-900/20 flex items-center gap-4 border border-emerald-500/50">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                                    <ShieldCheck size={24} />
                                </div>
                                <div>
                                    <p className="font-black text-sm tracking-tight uppercase">Success</p>
                                    <p className="text-sm font-medium text-emerald-50">{success}</p>
                                </div>
                                <button onClick={() => setSuccess('')} className="ml-auto p-2 hover:bg-white/10 rounded-lg transition-colors">
                                    <X size={18} />
                                </button>
                            </div>
                        </div>
                    )}

                    {view === 'auth' && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="text-center mb-10">
                                <h2 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">Welcome</h2>
                                <p className="text-gray-500 font-medium">Access your vault or join the ecosystem</p>
                            </div>

                            {error && (
                                <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 animate-in shake duration-500">
                                    <ShieldAlert size={20} />
                                    <p className="text-sm font-bold">{error}</p>
                                </div>
                            )}

                            <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-10 relative border border-gray-200/50 shadow-inner">
                                <div className={cn(
                                    "absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-md transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)",
                                    isLogin ? 'translate-x-0' : 'translate-x-full'
                                )}></div>

                                <button onClick={() => {setIsLogin(true); setError(''); setSuccess('');}} className={cn("flex-1 py-3 text-sm font-bold relative z-10 transition-colors duration-300", isLogin ? 'text-gray-900' : 'text-gray-400')}>Sign In</button>
                                <button onClick={() => {setIsLogin(false); setError(''); setSuccess('');}} className={cn("flex-1 py-3 text-sm font-bold relative z-10 transition-colors duration-300", !isLogin ? 'text-gray-900' : 'text-gray-400')}>Register</button>
                            </div>

                            <form className="space-y-6" onSubmit={handleAuth}>
                                <div className="relative overflow-hidden">
                                    <div className="flex transition-transform duration-500 ease-in-out" style={{ width: '200%', transform: isLogin ? 'translateX(0)' : 'translateX(-50%)' }}>
                                        {/* Login Section */}
                                        <div className="w-1/2 px-1 space-y-6">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Email Address</label>
                                                <div className="relative group">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600" size={20} />
                                                    <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="name@example.com" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500" />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between mb-3">
                                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Password</label>
                                                    <button type="button" onClick={() => setView('forgot')} className="text-xs font-bold text-emerald-700">Forgot Password?</button>
                                                </div>
                                                <div className="relative group">
                                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600" size={20} />
                                                    <input type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="••••••••" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Register Section */}
                                        <div className="w-1/2 px-1 space-y-5">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Full Name</label>
                                                <div className="relative group">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600" size={20} />
                                                    <input type="text" required={!isLogin} value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} placeholder="John Doe" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Email Address</label>
                                                <div className="relative group">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600" size={20} />
                                                    <input type="email" required={!isLogin} value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="name@example.com" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Password</label>
                                                <div className="relative group">
                                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600" size={20} />
                                                    <input type="password" required={!isLogin} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="••••••••" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Confirm Password</label>
                                                <div className="relative group">
                                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600" size={20} />
                                                    <input type="password" required={!isLogin} value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} placeholder="••••••••" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" disabled={loading} className="w-full py-4 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-2xl flex items-center justify-center gap-3 transition-all disabled:bg-gray-400">
                                    {loading ? 'Processing...' : isLogin ? 'Authenticate Vault' : 'Register Account'} <ArrowRight size={20} />
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Forgot Password View (Preserved) */}
                    {view === 'forgot' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="text-center mb-10">
                                <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Forgot Password</h2>
                                <p className="text-gray-500 font-medium max-w-sm mx-auto leading-relaxed">Enter your email and we'll send you a code.</p>
                            </div>
                            <form className="space-y-8">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Email Address</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600" size={20} />
                                        <input type="email" placeholder="name@example.com" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white" />
                                    </div>
                                </div>
                                <button type="button" onClick={() => setView('verification')} className="w-full py-4 bg-emerald-800 text-white font-bold rounded-2xl">Send reset code</button>
                                <button type="button" onClick={() => setView('auth')} className="w-full text-sm font-bold text-emerald-700 flex items-center justify-center gap-2"><ArrowLeft size={16} /> Back to login</button>
                            </form>
                        </div>
                    )}

                    {/* Verification View (Preserved) */}
                    {view === 'verification' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">Check your email</h2>
                            <p className="text-gray-500 mb-12">Enter the 6-digit code we sent you.</p>
                            <div className="flex justify-between gap-2 mb-10">
                                {otp.map((data, index) => (
                                    <input key={index} className="w-12 h-14 text-2xl font-bold text-center bg-gray-50 border rounded-xl" type="text" maxLength="1" value={data} onChange={(e) => handleOtpChange(e.target, index)} />
                                ))}
                            </div>
                            <p className="text-sm text-gray-400">Resend in <span className="text-emerald-600 font-bold">0:{timer < 10 ? `0${timer}` : timer}</span></p>
                            <button onClick={() => setView('auth')} className="mt-8 text-sm font-bold text-emerald-700 flex items-center justify-center gap-2 mx-auto"><ArrowLeft size={16} /> Back to login</button>
                        </div>
                    )}

                    {/* Footer Social */}
                    {view !== 'verification' && (
                        <div className="mt-12">
                            <div className="relative flex items-center justify-center mb-10">
                                <hr className="w-full border-gray-100" />
                                <span className="absolute px-4 bg-white text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Secure Gateway</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <button className="flex items-center justify-center gap-3 py-3.5 border rounded-2xl font-bold text-sm text-gray-700"><img src="https://www.svgrepo.com/show/355037/google.svg" className="w-5 h-5" /> Google</button>
                                <button className="flex items-center justify-center gap-3 py-3.5 border rounded-2xl font-bold text-sm text-gray-700"><img src="https://www.svgrepo.com/show/441490/apple.svg" className="w-5 h-5" /> Apple</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Utility function for conditional classes
function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}