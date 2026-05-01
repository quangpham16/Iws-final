import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, ChevronDown, ArrowRight, Loader2, Sparkles, DollarSign, Coins } from 'lucide-react';
import axios from 'axios';

const CURRENCIES = [
    { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
    { code: 'VND', name: 'Vietnamese Dong', symbol: '₫', flag: '🇻🇳' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
    { code: 'KRW', name: 'Korean Won', symbol: '₩', flag: '🇰🇷' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
    { code: 'THB', name: 'Thai Baht', symbol: '฿', flag: '🇹🇭' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
];

export default function WalletSetupPage() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const [walletName, setWalletName] = useState('My Wallet');
    const [currency, setCurrency] = useState('USD');
    const [balance, setBalance] = useState('');
    const [note, setNote] = useState('');
    const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const selectedCurrency = CURRENCIES.find(c => c.code === currency);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!walletName.trim()) {
            setError('Please enter a wallet name.');
            return;
        }
        if (!balance || parseFloat(balance) < 0) {
            setError('Please enter a valid opening balance.');
            return;
        }

        setLoading(true);
        try {
            await axios.post('/api/wallets', {
                name: walletName,
                balance: parseFloat(balance),
                currency: currency,
                note: note || null,
            }, {
                headers: { 'X-User-Id': user.id }
            });

            // Update localStorage to mark user as having a wallet
            const updatedUser = { ...user, hasWallet: true };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            navigate('/');
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to create wallet. Please try again.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-60 -left-40 w-96 h-96 bg-emerald-400/8 rounded-full blur-3xl" style={{ animation: 'pulse 4s ease-in-out infinite' }} />
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-600/5 rounded-full blur-3xl" style={{ animation: 'pulse 6s ease-in-out infinite 1s' }} />

                {/* Floating Coins Animation */}
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute text-emerald-500/10 text-4xl"
                        style={{
                            left: `${15 + i * 15}%`,
                            top: `${10 + (i % 3) * 30}%`,
                            animation: `float ${3 + i * 0.5}s ease-in-out infinite ${i * 0.3}s`,
                        }}
                    >
                        <Coins size={24 + i * 4} />
                    </div>
                ))}
            </div>

            {/* Main Card */}
            <div className="w-full max-w-lg relative z-10">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl mb-6 shadow-2xl shadow-emerald-500/30 transform -rotate-6 hover:rotate-0 transition-transform duration-500">
                        <Wallet size={36} className="text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-white tracking-tight mb-3">
                        Create Your <span className="text-emerald-400">Wallet</span>
                    </h1>
                    <p className="text-emerald-200/60 text-lg font-medium max-w-sm mx-auto">
                        Set up your first wallet to start tracking your financial journey
                    </p>
                </div>

                {/* Card Body */}
                <div className="bg-white/[0.07] backdrop-blur-2xl rounded-3xl border border-white/10 p-8 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Error Message */}
                        {error && (
                            <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-300 text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300">
                                <span className="shrink-0">⚠️</span>
                                {error}
                            </div>
                        )}

                        {/* Wallet Name */}
                        <div>
                            <label className="block text-xs font-bold text-emerald-300/60 uppercase tracking-widest mb-3">
                                Wallet Name
                            </label>
                            <div className="relative group">
                                <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500/50 group-focus-within:text-emerald-400 transition-colors" size={20} />
                                <input
                                    type="text"
                                    value={walletName}
                                    onChange={(e) => setWalletName(e.target.value)}
                                    placeholder="e.g. My Savings"
                                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none text-white placeholder-white/20 focus:bg-white/10 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                                />
                            </div>
                        </div>

                        {/* Currency Selection */}
                        <div>
                            <label className="block text-xs font-bold text-emerald-300/60 uppercase tracking-widest mb-3">
                                Currency
                            </label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                                    className="w-full flex items-center justify-between px-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white hover:bg-white/10 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{selectedCurrency?.flag}</span>
                                        <div className="text-left">
                                            <p className="font-bold text-sm">{selectedCurrency?.code}</p>
                                            <p className="text-xs text-white/40">{selectedCurrency?.name}</p>
                                        </div>
                                    </div>
                                    <ChevronDown size={20} className={`text-white/40 transition-transform duration-300 ${showCurrencyDropdown ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown */}
                                {showCurrencyDropdown && (
                                    <div className="absolute z-50 mt-2 w-full max-h-60 overflow-y-auto bg-emerald-950/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                                        {CURRENCIES.map((cur) => (
                                            <button
                                                key={cur.code}
                                                type="button"
                                                onClick={() => {
                                                    setCurrency(cur.code);
                                                    setShowCurrencyDropdown(false);
                                                }}
                                                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/10 transition-colors first:rounded-t-2xl last:rounded-b-2xl ${
                                                    currency === cur.code ? 'bg-emerald-500/20 text-emerald-300' : 'text-white/80'
                                                }`}
                                            >
                                                <span className="text-xl">{cur.flag}</span>
                                                <div>
                                                    <p className="font-bold text-sm">{cur.code}</p>
                                                    <p className="text-xs text-white/40">{cur.name}</p>
                                                </div>
                                                {currency === cur.code && (
                                                    <Sparkles size={14} className="ml-auto text-emerald-400" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Opening Balance */}
                        <div>
                            <label className="block text-xs font-bold text-emerald-300/60 uppercase tracking-widest mb-3">
                                Opening Balance
                            </label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500/50 group-focus-within:text-emerald-400 transition-colors font-bold text-lg">
                                    {selectedCurrency?.symbol}
                                </div>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={balance}
                                    onChange={(e) => setBalance(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none text-white text-xl font-bold placeholder-white/20 focus:bg-white/10 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                            </div>
                            <p className="mt-2 text-xs text-white/30 font-medium">
                                Enter how much money is currently in this wallet
                            </p>
                        </div>

                        {/* Note (optional) */}
                        <div>
                            <label className="block text-xs font-bold text-emerald-300/60 uppercase tracking-widest mb-3">
                                Note <span className="text-white/20">(optional)</span>
                            </label>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Add a note about this wallet..."
                                rows={2}
                                className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none text-white placeholder-white/20 focus:bg-white/10 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all resize-none text-sm"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold rounded-2xl flex items-center justify-center gap-3 transition-all shadow-2xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 text-lg"
                        >
                            {loading ? (
                                <><Loader2 size={22} className="animate-spin" /> Creating Wallet...</>
                            ) : (
                                <>Create Wallet <ArrowRight size={22} /></>
                            )}
                        </button>
                    </form>

                    {/* Decorative Bottom */}
                    <div className="mt-8 pt-6 border-t border-white/5">
                        <div className="flex items-center justify-center gap-2 text-white/20 text-xs font-medium">
                            <DollarSign size={14} />
                            <span>Your data is encrypted and secure</span>
                        </div>
                    </div>
                </div>

                {/* Bottom hint */}
                <p className="text-center text-white/20 text-xs mt-6 font-medium">
                    You can add more wallets anytime from your dashboard
                </p>
            </div>

            {/* CSS Animation */}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.1; }
                    50% { transform: translateY(-20px) rotate(10deg); opacity: 0.2; }
                }
            `}</style>
        </div>
    );
}
