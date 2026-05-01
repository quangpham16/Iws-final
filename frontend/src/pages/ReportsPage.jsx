import React, { useState, useEffect } from 'react';
import { Download, Calendar, ArrowUpRight, ArrowDownRight, BarChart2 } from 'lucide-react';
import { transactionApi } from '../services/api';

export default function ReportsPage() {
    const [monthlyData, setMonthlyData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const res = await transactionApi.getAll();
            // Group by month
            const grouped = res.data.reduce((acc, curr) => {
                const month = curr.date.substring(0, 7); // YYYY-MM
                if (!acc[month]) acc[month] = { month, income: 0, expense: 0 };
                if (curr.type === 'INCOME') acc[month].income += curr.amount;
                else acc[month].expense += curr.amount;
                return acc;
            }, {});
            setMonthlyData(Object.values(grouped).sort((a, b) => b.month.localeCompare(a.month)));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Financial Reports</h1>
                    <p className="text-slate-500 font-medium">Analyze your long-term financial health</p>
                </div>
                <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95">
                    <Download size={18} />
                    Export CSV
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {monthlyData.map((data) => (
                        <div key={data.month} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-center gap-8">
                            <div className="flex items-center gap-4 min-w-[200px]">
                                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                                    <Calendar size={28} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-800">{new Date(data.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Monthly Summary</p>
                                </div>
                            </div>

                            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-8 w-full">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Income</p>
                                    <div className="flex items-center gap-1 text-emerald-600 font-black">
                                        <ArrowUpRight size={14} />
                                        <span>${data.income.toLocaleString()}</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Expenses</p>
                                    <div className="flex items-center gap-1 text-rose-500 font-black">
                                        <ArrowDownRight size={14} />
                                        <span>${data.expense.toLocaleString()}</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Savings</p>
                                    <div className="font-black text-slate-800">
                                        ${(data.income - data.expense).toLocaleString()}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Savings Rate</p>
                                    <div className="font-black text-emerald-600">
                                        {data.income > 0 ? Math.round(((data.income - data.expense) / data.income) * 100) : 0}%
                                    </div>
                                </div>
                            </div>

                            <button className="p-4 text-slate-300 hover:text-emerald-500 hover:bg-emerald-50 rounded-2xl transition-all">
                                <BarChart2 size={24} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
