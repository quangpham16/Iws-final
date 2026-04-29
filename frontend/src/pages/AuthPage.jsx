import React, { useState, useEffect } from 'react';
import { Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react';

export default function AuthPage() {
    // Views: 'auth' (Login/Register slider), 'forgot', 'verification'
    const [view, setView] = useState('auth');
    // isLogin determines the position of the slider when view is 'auth'
    const [isLogin, setIsLogin] = useState(true);
    // Verification code state (6 digits)
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(59);

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

        // Focus next input
        if (element.nextSibling && element.value !== "") {
            element.nextSibling.focus();
        }
    };

    return (
        <div className="flex min-h-screen bg-[#fcfdfc] font-sans selection:bg-emerald-100 selection:text-emerald-900">
            {/* ================= LEFT COLUMN (Static Brand Section) ================= */}
            <div className="relative hidden w-1/2 lg:flex flex-col justify-between p-16 overflow-hidden bg-emerald-900">
                {/* Background Image/Pattern Overlay */}
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

            {/* ================= RIGHT COLUMN (Dynamic Content) ================= */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 bg-white relative overflow-hidden">
                <div className="w-full max-w-md relative z-10">

                    {/* View: Auth (Login/Register Slider) */}
                    {view === 'auth' && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="text-center mb-10">
                                <h2 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">Welcome</h2>
                                <p className="text-gray-500 font-medium">Access your vault or join the ecosystem</p>
                            </div>

                            {/* Toggle Slider */}
                            <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-10 relative border border-gray-200/50 shadow-inner">
                                <div
                                    className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-md transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${isLogin ? 'translate-x-0' : 'translate-x-full'}`}
                                ></div>

                                <button
                                    onClick={() => setIsLogin(true)}
                                    className={`flex-1 py-3 text-sm font-bold relative z-10 transition-colors duration-300 ${isLogin ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    Sign In
                                </button>

                                <button
                                    onClick={() => setIsLogin(false)}
                                    className={`flex-1 py-3 text-sm font-bold relative z-10 transition-colors duration-300 ${!isLogin ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    Register
                                </button>
                            </div>

                            {/* Forms Container */}
                            <div className="relative overflow-hidden">
                                <div
                                    className="flex transition-transform duration-500 ease-in-out"
                                    style={{ width: '200%', transform: isLogin ? 'translateX(0)' : 'translateX(-50%)' }}
                                >
                                    {/* Login Form */}
                                    <div className="w-1/2 px-1">
                                        <form className="space-y-6">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Email Address</label>
                                                <div className="relative group">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
                                                    <input
                                                        type="email"
                                                        placeholder="name@example.com"
                                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-gray-900"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between mb-3">
                                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Password</label>
                                                    <button
                                                        type="button"
                                                        onClick={() => setView('forgot')}
                                                        className="text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
                                                    >
                                                        Forgot Password?
                                                    </button>
                                                </div>
                                                <div className="relative group">
                                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
                                                    <input
                                                        type="password"
                                                        placeholder="••••••••"
                                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-gray-900"
                                                    />
                                                </div>
                                            </div>
                                            <button className="w-full py-4 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-emerald-900/20 hover:shadow-emerald-900/30 hover:-translate-y-0.5">
                                                Authenticate Vault <ArrowRight size={20} />
                                            </button>
                                        </form>
                                    </div>

                                    {/* Register Form */}
                                    <div className="w-1/2 px-1">
                                        <form className="space-y-5">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Email Address</label>
                                                <div className="relative group">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
                                                    <input type="email" placeholder="name@example.com" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-gray-900" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Create Password</label>
                                                <div className="relative group">
                                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
                                                    <input type="password" placeholder="••••••••" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-gray-900" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Confirm Password</label>
                                                <div className="relative group">
                                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
                                                    <input type="password" placeholder="••••••••" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-gray-900" />
                                                </div>
                                            </div>
                                            <button className="w-full py-4 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-emerald-900/20 hover:shadow-emerald-900/30 hover:-translate-y-0.5">
                                                Register Account <ArrowRight size={20} />
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* View: Forgot Password */}
                    {view === 'forgot' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="text-center mb-10">
                                <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight text-center">Forgot Password</h2>
                                <p className="text-gray-500 font-medium max-w-sm mx-auto leading-relaxed">
                                    Enter the email address associated with your account and we'll send you a code to reset your password.
                                </p>
                            </div>

                            <form className="space-y-8">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Email Address</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
                                        <input
                                            type="email"
                                            placeholder="name@example.com"
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-gray-900 shadow-sm"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setView('verification')}
                                    className="w-full py-4 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-emerald-900/20 hover:shadow-emerald-900/30"
                                >
                                    Send reset code <ArrowRight size={20} />
                                </button>

                                <div className="text-center">
                                    <button
                                        type="button"
                                        onClick={() => setView('auth')}
                                        className="text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center justify-center gap-2 mx-auto transition-colors"
                                    >
                                        <ArrowLeft size={16} /> Back to login
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* View: Verification */}
                    {view === 'verification' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="text-center mb-12">
                                <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Check your email</h2>
                                <p className="text-gray-500 font-medium leading-relaxed max-w-sm mx-auto">
                                    We sent a 6-digit code to <span className="text-gray-900 font-bold">n***@gmail.com</span>. Enter it below to continue.
                                </p>
                            </div>

                            <div className="flex justify-between gap-2 mb-10">
                                {otp.map((data, index) => {
                                    return (
                                        <input
                                            className="w-12 h-14 sm:w-14 sm:h-16 text-2xl font-bold text-center bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                                            type="text"
                                            name="otp"
                                            maxLength="1"
                                            key={index}
                                            value={data}
                                            onChange={(e) => handleOtpChange(e.target, index)}
                                            onFocus={(e) => e.target.select()}
                                        />
                                    );
                                })}
                            </div>

                            <div className="text-center space-y-6">
                                <p className="text-sm font-medium text-gray-400">
                                    Resend code in <span className="text-emerald-600 font-bold">0:{timer < 10 ? `0${timer}` : timer}</span>
                                </p>

                                <button
                                    onClick={() => setView('auth')}
                                    className="text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center justify-center gap-2 mx-auto transition-colors"
                                >
                                    <ArrowLeft size={16} /> Back to login
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Footer Social (Shared across all but Verification) */}
                    {view !== 'verification' && (
                        <div className="mt-12">
                            <div className="relative flex items-center justify-center mb-10">
                                <hr className="w-full border-gray-100" />
                                <span className="absolute px-4 bg-white text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Secure Gateway</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <button className="flex items-center justify-center gap-3 py-3.5 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all font-bold text-sm text-gray-700 shadow-sm active:scale-95">
                                    <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-5 h-5" alt="Google" /> Google
                                </button>
                                <button className="flex items-center justify-center gap-3 py-3.5 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all font-bold text-sm text-gray-700 shadow-sm active:scale-95">
                                    <img src="https://www.svgrepo.com/show/441490/apple.svg" className="w-5 h-5" alt="Apple" /> Apple
                                </button>
                            </div>

                            <p className="mt-12 text-center text-xs text-gray-400 leading-relaxed font-medium">
                                By proceeding, you agree to our <span className="text-emerald-700 font-bold underline cursor-pointer">Terms of Service</span> and <span className="text-emerald-700 font-bold underline cursor-pointer">Security Protocols</span>.
                            </p>
                        </div>
                    )}

                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -z-10 opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-50/50 rounded-full blur-3xl -z-10 opacity-30"></div>
            </div>
        </div>
    );
}