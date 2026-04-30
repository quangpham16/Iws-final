import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  ShieldCheck, 
  Wallet, 
  Circle, 
  Zap, 
  ChevronRight, 
  ArrowRightLeft,
  MoreHorizontal
} from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { transactionApi } from '../services/transactionService';
import { walletApi } from '../services/walletService';

const MetricCard = ({ title, value, subtext, icon: Icon, trend = 'neutral' }) => (
  <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col justify-between h-full hover:shadow-md transition-all">
    <div className="flex justify-between items-start mb-8">
      <div className="p-3 rounded-2xl bg-gray-50 text-gray-400">
        <Icon size={22} />
      </div>
      <div className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 bg-gray-50 text-gray-400 rounded-full">
        <Circle size={4} fill="currentColor" className={trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-rose-500' : 'text-gray-400'} />
        Live
      </div>
    </div>
    <div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{title}</p>
      <h3 className="text-3xl font-black text-gray-900 tabular-nums">${value.toLocaleString()}</h3>
      <p className="text-[10px] font-medium text-gray-400 mt-3 flex items-center gap-2">
        <span className="w-1 h-1 rounded-full bg-[#106E4E]"></span>
        {subtext}
      </p>
    </div>
  </div>
);

export default function DashboardPage() {
    const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [sumRes, transRes] = await Promise.all([
                transactionApi.getSummary(),
                transactionApi.getAll()
            ]);
            setSummary(sumRes.data);
            setTransactions(transRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <div className="w-10 h-10 border-4 border-[#106E4E] border-t-transparent rounded-full animate-spin" />
        </div>
    );

    const chartData = transactions.slice(-10).map(t => ({
        name: t.date,
        amount: t.amount,
        type: t.type
    }));

    return (
        <div className="space-y-12 max-w-[1600px] mx-auto w-full animate-in fade-in duration-700">
            {/* Hero Section */}
            <div className="flex items-end justify-between">
            <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">Architectural Overview</p>
                <h1 className="text-5xl font-black text-gray-900 tracking-tighter">
                Your financial <span className="text-[#22C55E]">harvest.</span>
                </h1>
            </div>
            <div className="flex gap-4">
                <div className="flex items-center gap-2 bg-green-50 px-4 py-2.5 rounded-xl border border-green-100">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[10px] font-bold text-green-700 uppercase tracking-widest">Market Status: Open</span>
                </div>
                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2.5 rounded-xl border border-blue-100">
                <ShieldCheck size={14} className="text-blue-600" />
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest">Sync Level: Secured</span>
                </div>
            </div>
            </div>

            {/* Metric Grid */}
            <div className="grid grid-cols-3 gap-8">
            <MetricCard 
                title="Total Net Worth" 
                value={summary.balance} 
                subtext="Aggregated across all assets"
                icon={Wallet}
                trend="up"
            />
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col justify-between h-full hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-8">
                <div className="p-3 rounded-2xl bg-gray-50 text-emerald-600">
                    <TrendingUp size={22} />
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 bg-gray-50 text-gray-400 rounded-full">
                    <Circle size={4} fill="currentColor" className="text-emerald-500" />
                    Live
                </div>
                </div>
                <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Monthly Income</p>
                <h3 className="text-3xl font-black text-gray-900 tabular-nums">${summary.totalIncome.toLocaleString()}</h3>
                <div className="mt-4 flex items-end gap-1 h-8">
                    {[...Array(12)].map((_, i) => (
                    <div key={i} className={`flex-1 rounded-sm h-1 ${i < 6 ? 'bg-emerald-100' : 'bg-gray-50'}`} style={{height: i < 6 ? `${(i+1)*10}px` : '4px'}}></div>
                    ))}
                </div>
                </div>
            </div>
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col justify-between h-full hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-8">
                <div className="p-3 rounded-2xl bg-gray-50 text-rose-500">
                    <Zap size={22} />
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 bg-gray-50 text-gray-400 rounded-full">
                    <Circle size={4} fill="currentColor" className="text-rose-500" />
                    Live
                </div>
                </div>
                <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Monthly Expenses</p>
                <h3 className="text-3xl font-black text-gray-900 tabular-nums">${summary.totalExpense.toLocaleString()}</h3>
                <div className="mt-6 h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 transition-all duration-1000" style={{width: summary.totalIncome > 0 ? `${(summary.totalExpense / summary.totalIncome) * 100}%` : '0%'}}></div>
                </div>
                </div>
            </div>
            </div>

            {/* Chart & Activity Grid */}
            <div className="grid grid-cols-12 gap-8">
            <div className="col-span-8 space-y-8">
                <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-12">
                    <div>
                    <h3 className="text-xl font-black text-gray-900 tracking-tighter">Performance Analysis</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Monthly harvest telemetry</p>
                    </div>
                    <div className="flex gap-2 bg-gray-50 p-1.5 rounded-2xl">
                    {['6M', '1Y', 'ALL'].map((period) => (
                        <button 
                        key={period}
                        className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${
                            period === 'ALL' ? 'bg-white text-[#106E4E] shadow-sm' : 'text-gray-400 hover:text-gray-600'
                        }`}
                        >
                        {period}
                        </button>
                    ))}
                    </div>
                </div>
                
                {/* Recharts Implementation instead of zero-state */}
                <div className="h-72 w-full mt-4">
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#106E4E" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#106E4E" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10, fontWeight: 'bold'}} dy={10} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ stroke: '#F3F4F6', strokeWidth: 2, strokeDasharray: '5 5' }}
                                />
                                <Area type="monotone" dataKey="amount" stroke="#106E4E" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full space-y-2">
                            <p className="text-xs font-black text-gray-300 uppercase tracking-[0.3em]">No telemetry data available</p>
                            <p className="text-[10px] text-gray-200">Start transactions to see growth</p>
                        </div>
                    )}
                </div>
                </div>

                {/* Wealth Intel Banner */}
                <div className="bg-[#106E4E] p-12 rounded-[3rem] text-white relative overflow-hidden shadow-xl shadow-[#106E4E]/20">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                <div className="relative z-10 max-w-lg space-y-6">
                    <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10">
                    <Zap size={12} fill="currentColor" className="text-yellow-400" />
                    Wealth Intel
                    </div>
                    <h2 className="text-4xl font-black tracking-tighter leading-none">Optimize your harvest with AI.</h2>
                    <p className="text-white/60 text-sm leading-relaxed">
                    Our neural engine analyzes global volatility to suggest the optimal harvest timing for your unique profile.
                    </p>
                    <button className="bg-white text-[#106E4E] px-8 py-4 rounded-2xl font-black text-sm hover:bg-gray-100 transition-all flex items-center gap-2">
                    Learn More <ChevronRight size={18} />
                    </button>
                </div>
                </div>
            </div>

            <div className="col-span-4 h-full">
                <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 h-full flex flex-col">
                <div className="flex items-center justify-between mb-10">
                    <h3 className="text-xl font-black text-gray-900 tracking-tighter">Recent Activity</h3>
                    <MoreHorizontal size={20} className="text-gray-300 cursor-pointer" />
                </div>

                {transactions.length > 0 ? (
                    <div className="flex-1 space-y-6">
                        {transactions.slice(0, 5).map(t => (
                            <div key={t.id} className="flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${t.type === 'INCOME' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>
                                        <ArrowRightLeft size={18} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm">{t.title}</p>
                                        <p className="text-xs text-gray-400 font-medium">{t.date}</p>
                                    </div>
                                </div>
                                <span className={`font-black tabular-nums ${t.type === 'INCOME' ? 'text-emerald-600' : 'text-gray-900'}`}>
                                    {t.type === 'INCOME' ? '+' : '-'}${t.amount.toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 py-12">
                        <div className="w-24 h-24 rounded-[2rem] bg-gray-50 flex items-center justify-center text-gray-200">
                        <ArrowRightLeft size={40} strokeWidth={1} />
                        </div>
                        <div className="space-y-1">
                        <p className="text-sm font-black text-gray-900">Activity Idle</p>
                        <p className="text-xs text-gray-400 max-w-[200px]">No recent transactions found in this cycle.</p>
                        </div>
                    </div>
                )}

                <button className="w-full mt-auto py-5 border-2 border-dashed border-gray-100 rounded-[2rem] text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] hover:border-[#106E4E] hover:text-[#106E4E] transition-all">
                    Comprehensive Report
                </button>
                </div>
            </div>
            </div>
        </div>
    );
}
