import React, { useState, useEffect } from 'react';
import { Mail, Lock, ArrowRight, ArrowLeft, User, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';

export default function AuthPage() {
    const navigate = useNavigate();
    // Views: 'auth' (Login/Register slider), 'forgot', 'verification'
    const [view, setView] = useState('auth');
    const [isLogin, setIsLogin] = useState(true);

    // ─── Form state ─────────────────────────────────────────
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const [regEmail, setRegEmail] = useState('');
    const [regFullName, setRegFullName] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regConfirm, setRegConfirm] = useState('');

    // ─── UI feedback ────────────────────────────────────────
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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

    // Clear messages when switching tabs
    useEffect(() => {
        setError('');
        setSuccess('');
    }, [isLogin, view]);

    const handleOtpChange = (element, index) => {
        if (isNaN(element.value)) return false;
        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
        if (element.nextSibling && element.value !== "") {
            element.nextSibling.focus();
        }
    };

    // ─── Login handler ──────────────────────────────────────
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!loginEmail || !loginPassword) {
            setError('Please fill in all fields.');
            return;
        }

        setLoading(true);
        try {
            const res = await authApi.login(loginEmail, loginPassword);
            // Store user data in localStorage
            localStorage.setItem('user', JSON.stringify(res.data));
            setSuccess('Login successful! Redirecting...');
            // Redirect new users to wallet setup, existing users to dashboard
            const destination = res.data.hasWallet ? '/dashboard' : '/setup-wallet';
            setTimeout(() => navigate(destination), 1500);
        } catch (err) {
            const msg = err.response?.data?.message || 'Invalid email or password.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    // ─── Register handler ───────────────────────────────────
    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!regEmail || !regPassword || !regConfirm) {
            setError('Please fill in all fields.');
            return;
        }
        if (regPassword !== regConfirm) {
            setError('Passwords do not match.');
            return;
        }
        if (regPassword.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setLoading(true);
        try {
            const res = await authApi.register(regEmail, regPassword, regFullName);
            // Store user data and redirect to wallet setup
            localStorage.setItem('user', JSON.stringify(res.data));
            setSuccess('Account created! Setting up your wallet...');
            setTimeout(() => navigate('/setup-wallet'), 1500);
        } catch (err) {
            const msg = err.response?.data?.message || 'Registration failed. Please try again.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-[#fcfdfc] font-sans selection:bg-emerald-100 selection:text-emerald-900 animate-in fade-in slide-in-from-bottom-8 duration-700">
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

                    {view === 'auth' && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="text-center mb-10">
                                <h2 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">Welcome</h2>
                                <p className="text-gray-500 font-medium">Access your vault or join the ecosystem</p>
                            </div>

                            {error && (
                                <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300">
                                    <AlertCircle size={18} className="shrink-0" />
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className="mb-6 flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-700 text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300">
                                    <CheckCircle size={18} className="shrink-0" />
                                    {success}
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

                            {/* Forms Container */}
                            <div className="relative overflow-hidden">
                                <div
                                    className="flex transition-transform duration-500 ease-in-out"
                                    style={{ width: '200%', transform: isLogin ? 'translateX(0)' : 'translateX(-50%)' }}
                                >
                                    {/* Login Form */}
                                    <div className="w-1/2 px-1">
                                        <form className="space-y-6" onSubmit={handleLogin}>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Email Address</label>
                                                <div className="relative group">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
                                                    <input
                                                        type="email"
                                                        placeholder="name@example.com"
                                                        value={loginEmail}
                                                        onChange={(e) => setLoginEmail(e.target.value)}
                                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-gray-900"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between mb-3">
                                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Password</label>
                                                    <button type="button" onClick={() => setView('forgot')} className="text-xs font-bold text-emerald-700">Forgot Password?</button>
                                                </div>
                                                <div className="relative group">
                                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
                                                    <input
                                                        type="password"
                                                        placeholder="••••••••"
                                                        value={loginPassword}
                                                        onChange={(e) => setLoginPassword(e.target.value)}
                                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-gray-900"
                                                    />
                                                </div>
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full py-4 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-emerald-900/20 hover:shadow-emerald-900/30 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                                            >
                                                {loading && isLogin ? (
                                                    <><Loader2 size={20} className="animate-spin" /> Authenticating...</>
                                                ) : (
                                                    <>Authenticate Vault <ArrowRight size={20} /></>
                                                )}
                                            </button>
                                        </form>
                                    </div>

                                    {/* Register Form */}
                                    <div className="w-1/2 px-1">
                                        <form className="space-y-5" onSubmit={handleRegister}>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Full Name</label>
                                                <div className="relative group">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
                                                    <input
                                                        type="text"
                                                        placeholder="John Doe"
                                                        value={regFullName}
                                                        onChange={(e) => setRegFullName(e.target.value)}
                                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-gray-900"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Email Address</label>
                                                <div className="relative group">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
                                                    <input
                                                        type="email"
                                                        placeholder="name@example.com"
                                                        value={regEmail}
                                                        onChange={(e) => setRegEmail(e.target.value)}
                                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-gray-900"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Password</label>
                                                <div className="relative group">
                                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
                                                    <input
                                                        type="password"
                                                        placeholder="••••••••"
                                                        value={regPassword}
                                                        onChange={(e) => setRegPassword(e.target.value)}
                                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-gray-900"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Confirm Password</label>
                                                <div className="relative group">
                                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
                                                    <input
                                                        type="password"
                                                        placeholder="••••••••"
                                                        value={regConfirm}
                                                        onChange={(e) => setRegConfirm(e.target.value)}
                                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-gray-900"
                                                    />
                                                </div>
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full py-4 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-emerald-900/20 hover:shadow-emerald-900/30 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                                            >
                                                {loading && !isLogin ? (
                                                    <><Loader2 size={20} className="animate-spin" /> Creating Account...</>
                                                ) : (
                                                    <>Register Account <ArrowRight size={20} /></>
                                                )}
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Forgot Password View */}
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

                    {/* Verification View */}
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