import React, { useState, useEffect } from 'react';
import { Download, Calendar, ArrowUpRight, ArrowDownRight, BarChart2, TrendingUp, Target, Zap } from 'lucide-react';
import { transactionApi, budgetApi, goalApi, categoryApi, walletApi } from '../services/api';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function ReportsPage() {
    const [transactions, setTransactions] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [goals, setGoals] = useState([]);
    const [categories, setCategories] = useState([]);
    const [wallets, setWallets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currencySymbol, setCurrencySymbol] = useState('$');

    useEffect(() => {
        fetchReports();
    }, []);
    const fetchReports = async () => {
        try {
            // Fetch categories & wallets for labeling
            const cRes = await categoryApi.getAll();
            const cats = cRes.data || [];
            setCategories(cats);
            const catMap = cats.reduce((m, c) => { m[c.id] = c; return m; }, {});

            const wRes = await walletApi.getAll();
            setWallets(wRes.data || []);

            // Fetch transactions for monthly breakdown
            const txRes = await transactionApi.getAll();
            const txs = txRes.data || [];
            setTransactions(txs);

            const grouped = txs.reduce((acc, curr) => {
                const month = (curr.date || '').substring(0, 7); // YYYY-MM
                if (!acc[month]) acc[month] = { month, income: 0, expense: 0 };
                
                const amt = Math.abs(parseFloat(curr.amount) || 0);
                const cat = curr.categoryId != null ? catMap[curr.categoryId] : null;
                
                if (cat?.type === 'income') {
                    acc[month].income += amt;
                } else if (cat?.type === 'expense') {
                    acc[month].expense += amt;
                } else {
                    // Fallback to sign if category type unknown
                    const raw = parseFloat(curr.amount) || 0;
                    if (raw >= 0) acc[month].income += raw;
                    else acc[month].expense += Math.abs(raw);
                }
                return acc;
            }, {});
            setMonthlyData(Object.values(grouped).sort((a, b) => b.month.localeCompare(a.month)));

            // Fetch budgets
            const bRes = await budgetApi.getAll();
            setBudgets(bRes.data || []);

            // Fetch goals
            const gRes = await goalApi.getAll();
            setGoals(gRes.data || []);

            setCurrencySymbol('$');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Calculate summary metrics
    const totalIncome = monthlyData.reduce((sum, m) => sum + (m.income || 0), 0);
    const totalExpenses = monthlyData.reduce((sum, m) => sum + (m.expense || 0), 0);
    const totalSavings = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? Math.round((totalSavings / totalIncome) * 100) : 0;

    // Budget metrics
    const budgetMetrics = budgets.reduce((acc, b) => ({
        total: acc.total + (parseFloat(b.amount) || 0),
        spent: acc.spent + (parseFloat(b.spentAmount) || 0)
    }), { total: 0, spent: 0 });
    const budgetUtilization = budgetMetrics.total > 0 ? Math.round((budgetMetrics.spent / budgetMetrics.total) * 100) : 0;

    // Goals metrics
    const goalsMetrics = goals.reduce((acc, g) => ({
        totalTarget: acc.totalTarget + (parseFloat(g.targetAmount) || 0),
        totalSaved: acc.totalSaved + (parseFloat(g.currentAmount) || 0)
    }), { totalTarget: 0, totalSaved: 0 });
    const goalsProgress = goalsMetrics.totalTarget > 0 ? Math.round((goalsMetrics.totalSaved / goalsMetrics.totalTarget) * 100) : 0;

    // Category aggregates
    const categoryMap = categories.reduce((m, c) => { m[c.id] = c; return m; }, {});
    const categoryTotals = Object.values((transactions || []).reduce((acc, t) => {
        const id = t.categoryId ?? 'uncategorized';
        const amt = Math.abs(parseFloat(t.amount) || 0);
        const cat = t.categoryId != null ? categoryMap[t.categoryId] : null;

        if (!acc[id]) acc[id] = { categoryId: id, income: 0, expense: 0, net: 0 };
        
        if (cat?.type === 'income') {
            acc[id].income += amt;
        } else if (cat?.type === 'expense') {
            acc[id].expense += amt;
        } else {
            const raw = parseFloat(t.amount) || 0;
            if (raw >= 0) acc[id].income += raw;
            else acc[id].expense += Math.abs(raw);
        }
        acc[id].net += parseFloat(t.amount) || 0;
        return acc;
    }, {})).map(o => ({ ...o, name: categoryMap[o.categoryId]?.name || 'Uncategorized' }))
        .sort((a, b) => b.expense - a.expense);

    // Wallet aggregates
    const walletMap = wallets.reduce((m, w) => { m[w.id] = w; return m; }, {});
    const walletTotals = Object.values((transactions || []).reduce((acc, t) => {
        const id = t.walletId ?? 'unknown';
        const amt = Math.abs(parseFloat(t.amount) || 0);
        const cat = t.categoryId != null ? categoryMap[t.categoryId] : null;

        if (!acc[id]) acc[id] = { walletId: id, income: 0, expense: 0, net: 0 };
        
        if (cat?.type === 'income') {
            acc[id].income += amt;
        } else if (cat?.type === 'expense') {
            acc[id].expense += amt;
        } else {
            const raw = parseFloat(t.amount) || 0;
            if (raw >= 0) acc[id].income += raw;
            else acc[id].expense += Math.abs(raw);
        }
        acc[id].net += parseFloat(t.amount) || 0;
        return acc;
    }, {})).map(o => ({ ...o, name: walletMap[o.walletId]?.name || `Wallet ${o.walletId}`, balance: walletMap[o.walletId]?.currentBalance }))
        .sort((a, b) => (b.net || 0) - (a.net || 0));

    // Goals list with progress
    const goalsList = (goals || []).map(g => ({
        id: g.id,
        name: g.name || 'Goal',
        target: parseFloat(g.targetAmount) || 0,
        saved: parseFloat(g.currentAmount) || 0,
        progress: g.targetAmount ? Math.round((parseFloat(g.currentAmount || 0) / parseFloat(g.targetAmount || 0)) * 100) : 0
    })).sort((a, b) => b.progress - a.progress);

    // Budgets list with utilization
    const budgetsList = (budgets || []).map(b => ({
        id: b.id,
        name: b.name || 'Budget',
        amount: parseFloat(b.amount) || 0,
        spent: parseFloat(b.spentAmount) || 0,
        utilization: b.amount ? Math.round(((parseFloat(b.spentAmount || 0)) / parseFloat(b.amount || 0)) * 100) : 0
    })).sort((a, b) => b.utilization - a.utilization);

    const exportPDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        let yPos = 20;

        // Title
        doc.setFontSize(24);
        doc.setTextColor(30, 30, 30);
        doc.text('Financial Reports', 20, yPos);
        yPos += 15;

        // Date
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 20, yPos);
        yPos += 15;

        // Summary Section
        doc.setFontSize(14);
        doc.setTextColor(30, 30, 30);
        doc.text('Financial Summary', 20, yPos);
        yPos += 12;

        // Summary data as table
        const summaryData = [
            ['Total Income', `${currencySymbol}${totalIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })}`],
            ['Total Expenses', `${currencySymbol}${totalExpenses.toLocaleString(undefined, { maximumFractionDigits: 0 })}`],
            ['Total Savings', `${currencySymbol}${totalSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}`],
            ['Savings Rate', `${savingsRate}%`],
            ['Goals Progress', `${goalsProgress}%`],
            ['Active Goals', `${goals.length}`],
        ];

        doc.autoTable({
            head: [['Metric', 'Value']],
            body: summaryData,
            startY: yPos,
            margin: 20,
            theme: 'grid',
            headStyles: { fillColor: [124, 110, 242], textColor: 255, fontStyle: 'bold' },
            bodyStyles: { textColor: 50 },
            alternateRowStyles: { fillColor: [245, 245, 250] }
        });

        yPos = doc.lastAutoTable.finalY + 20;

        // Monthly Breakdown Section
        if (monthlyData.length > 0) {
            if (yPos > pageHeight - 40) {
                doc.addPage();
                yPos = 20;
            }

            doc.setFontSize(14);
            doc.setTextColor(30, 30, 30);
            doc.text('Monthly Breakdown', 20, yPos);
            yPos += 12;

            const monthlyTableData = monthlyData.map(m => [
                new Date(m.month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                `${currencySymbol}${m.income.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
                `${currencySymbol}${m.expense.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
                `${currencySymbol}${(m.income - m.expense).toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
                `${m.income > 0 ? Math.round(((m.income - m.expense) / m.income) * 100) : 0}%`
            ]);

            doc.autoTable({
                head: [['Month', 'Income', 'Expenses', 'Savings', 'Rate']],
                body: monthlyTableData,
                startY: yPos,
                margin: 20,
                theme: 'grid',
                headStyles: { fillColor: [124, 110, 242], textColor: 255, fontStyle: 'bold' },
                bodyStyles: { textColor: 50 },
                alternateRowStyles: { fillColor: [245, 245, 250] }
            });
        }

        // Save PDF
        doc.save(`Financial-Report-${new Date().toISOString().split('T')[0]}.pdf`);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700 max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Financial Reports</h1>
                    <p className="text-gray-500 font-medium">Analyze your financial health & performance</p>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="w-12 h-12 border-4 border-[#7C6EF2] border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <div className="space-y-10">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Total Income */}
                        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-8">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Income</p>
                                <ArrowUpRight size={20} className="text-[#106E4E]" />
                            </div>
                            <p className="text-2xl font-black text-gray-900 tabular-nums">{currencySymbol}{totalIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            <p className="text-xs text-gray-400 mt-2">{monthlyData.length} months</p>
                        </div>

                        {/* Total Expenses */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Expenses</p>
                                <ArrowDownRight size={16} className="text-red-500" />
                            </div>
                            <p className="text-2xl font-black text-gray-900 tabular-nums">{currencySymbol}{totalExpenses.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            <p className="text-xs text-gray-400 mt-2">{monthlyData.length} months</p>
                        </div>

                        {/* Total Savings */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Savings</p>
                                <TrendingUp size={16} className="text-blue-500" />
                            </div>
                            <p className="text-2xl font-black text-gray-900 tabular-nums">{currencySymbol}{totalSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            <p className="text-xs text-emerald-600 mt-2 font-bold">{savingsRate}% savings rate</p>
                        </div>

                        {/* Goals Progress */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Goals Progress</p>
                                <Target size={16} className="text-[#106E4E]" />
                            </div>
                            <p className="text-2xl font-black text-gray-900 tabular-nums">{goalsProgress}%</p>
                            <p className="text-xs text-gray-400 mt-2">{goals.length} active goals</p>
                        </div>
                    </div>

                    {/* Monthly Breakdown */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-black text-gray-900">Monthly Breakdown</h2>
                        {monthlyData.map((data) => (
                            <div key={data.month} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                                            <Calendar size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-gray-900">{new Date(data.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Monthly Summary</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-4 gap-8">
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Income</p>
                                            <div className="flex items-center gap-1 text-emerald-600 font-black">
                                                <ArrowUpRight size={14} />
                                                <span>{currencySymbol}{data.income.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Expenses</p>
                                            <div className="flex items-center gap-1 text-red-500 font-black">
                                                <ArrowDownRight size={14} />
                                                <span>{currencySymbol}{data.expense.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Savings</p>
                                            <div className="font-black text-gray-900">
                                                {currencySymbol}{(data.income - data.expense).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Rate</p>
                                            <div className="font-black text-blue-600">
                                                {data.income > 0 ? Math.round(((data.income - data.expense) / data.income) * 100) : 0}%
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Reports by Category / Wallet / Goal / Budget */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* By Category */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="text-lg font-black text-gray-900">By Category</h3>
                            <ul className="mt-4 space-y-3">
                                {categoryTotals.slice(0, 6).map((c) => (
                                    <li key={c.categoryId} className="flex items-center justify-between">
                                        <div>
                                            <p className="font-bold text-gray-900">{c.name}</p>
                                            <p className="text-xs text-gray-400">Income {currencySymbol}{Math.round(c.income).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-red-600">{currencySymbol}{Math.round(c.expense).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                                            <p className="text-xs text-gray-400">Net {currencySymbol}{Math.round(c.net).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* By Wallet */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="text-lg font-black text-gray-900">By Wallet</h3>
                            <ul className="mt-4 space-y-3">
                                {walletTotals.slice(0, 6).map((w) => (
                                    <li key={w.walletId} className="flex items-center justify-between">
                                        <div>
                                            <p className="font-bold text-gray-900">{w.name}</p>
                                            <p className="text-xs text-gray-400">Balance {currencySymbol}{w.balance ? Math.round(w.balance).toLocaleString(undefined, { maximumFractionDigits: 0 }) : '—'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-gray-900">{currencySymbol}{Math.round(w.net).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                                            <p className="text-xs text-gray-400">In {currencySymbol}{Math.round(w.income).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* By Goal */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="text-lg font-black text-gray-900">By Goal</h3>
                            <ul className="mt-4 space-y-3">
                                {goalsList.slice(0, 6).map(g => (
                                    <li key={g.id} className="flex items-center justify-between">
                                        <div>
                                            <p className="font-bold text-gray-900">{g.name}</p>
                                            <p className="text-xs text-gray-400">Saved {currencySymbol}{Math.round(g.saved).toLocaleString(undefined, { maximumFractionDigits: 0 })} of {currencySymbol}{Math.round(g.target).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-green-600">{g.progress}%</p>
                                            <p className="text-xs text-gray-400">Progress</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* By Budget */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="text-lg font-black text-gray-900">By Budget</h3>
                            <ul className="mt-4 space-y-3">
                                {budgetsList.slice(0, 6).map(b => (
                                    <li key={b.id} className="flex items-center justify-between">
                                        <div>
                                            <p className="font-bold text-gray-900">{b.name}</p>
                                            <p className="text-xs text-gray-400">Spent {currencySymbol}{Math.round(b.spent).toLocaleString(undefined, { maximumFractionDigits: 0 })} / {currencySymbol}{Math.round(b.amount).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-blue-600">{b.utilization}%</p>
                                            <p className="text-xs text-gray-400">Utilization</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
