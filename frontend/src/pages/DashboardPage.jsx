import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    Calendar,
    ChevronDown,
    Download,
    ArrowUpRight,
    TrendingUp,
    TrendingDown,
    Wallet,
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';
import { transactionApi } from '../services/transactionService';
import { walletApi } from '../services/walletService';
import { categoryApi } from '../services/categoryService';
import { goalApi } from '../services/goalService';
import { tagApi } from '../services/tagService';

const DONUT_FALLBACK = ['#0f766e', '#14b8a6', '#5eead4', '#99f6e4', '#ccfbf1', '#94a3b8'];

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const CURRENCY_SYMBOLS = {
    'USD': '$', 'EUR': '€', 'GBP': '£', 'VND': '₫', 'JPY': '¥', 'KRW': '₩',
    'CNY': '¥', 'THB': '฿', 'AUD': 'A$', 'CAD': 'C$', 'SGD': 'S$', 'INR': '₹',
};

const formatMoney = (n) => {
    const x = Number(n);
    if (Number.isNaN(x)) return '0';
    return x.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

function endOfMonth(d) {
    return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

function inMonth(dateStr, ref) {
    const t = new Date(dateStr);
    return t.getFullYear() === ref.getFullYear() && t.getMonth() === ref.getMonth();
}

function inYear(dateStr, ref) {
    const t = new Date(dateStr);
    return t.getFullYear() === ref.getFullYear();
}

function prevMonth(ref) {
    return new Date(ref.getFullYear(), ref.getMonth() - 1, 1);
}

function prevYear(ref) {
    return new Date(ref.getFullYear() - 1, ref.getMonth(), 1);
}

/** Income/expense buckets for charts & totals. Transfer: negative amount = nhận (in), positive = đi ra (out). */
function classifyAmount(txn, catById) {
    const raw = parseFloat(txn.amount) || 0;
    const amt = Math.abs(raw);
    const cat = txn.categoryId != null ? catById[txn.categoryId] : null;
    if (cat?.type === 'income') return { income: amt, expense: 0 };
    if (cat?.type === 'expense') return { income: 0, expense: amt };
    if (cat?.type === 'transfer') {
        if (raw < 0) return { income: amt, expense: 0 };
        return { income: 0, expense: amt };
    }
    return { income: 0, expense: 0 };
}

function pctTrend(cur, prev) {
    if (prev <= 0) return cur > 0 ? 100 : 0;
    return ((cur - prev) / prev) * 100;
}

export default function DashboardPage() {
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [wallets, setWallets] = useState([]);
    const [goals, setGoals] = useState([]);
    const [tags, setTags] = useState([]);
    const [totalBalance, setTotalBalance] = useState(0);
    const [period, setPeriod] = useState('month');
    const [walletFilter, setWalletFilter] = useState('all');
    const [periodMenuOpen, setPeriodMenuOpen] = useState(false);
    const [walletMenuOpen, setWalletMenuOpen] = useState(false);
    const [currencySymbol, setCurrencySymbol] = useState('$');

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const [transRes, catRes, walRes, goalRes, tagRes, balRes] = await Promise.all([
                    transactionApi.getAll(),
                    categoryApi.getAll(),
                    walletApi.getAll(),
                    goalApi.getAll(),
                    tagApi.getAll(),
                    walletApi.getTotalBalance(),
                ]);
                if (cancelled) return;
                setTransactions(Array.isArray(transRes.data) ? transRes.data : []);
                setCategories(Array.isArray(catRes.data) ? catRes.data : []);
                setWallets(Array.isArray(walRes.data) ? walRes.data : []);
                setGoals(Array.isArray(goalRes.data) ? goalRes.data : []);
                setTags(Array.isArray(tagRes.data) ? tagRes.data : []);
                setTotalBalance(Number(balRes.data?.totalBalance) || 0);

                // Set currency symbol from first wallet
                if (Array.isArray(walRes.data) && walRes.data.length > 0) {
                    const currencyCode = walRes.data[0].currencyCode || 'USD';
                    setCurrencySymbol(CURRENCY_SYMBOLS[currencyCode] || '$');
                }
            } catch (e) {
                console.error(e);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    const catById = useMemo(() => {
        const m = {};
        categories.forEach((c) => {
            m[c.id] = c;
        });
        return m;
    }, [categories]);

    const filteredTx = useMemo(() => {
        if (walletFilter === 'all') return transactions;
        const wid = Number(walletFilter);
        return transactions.filter((t) => Number(t.walletId) === wid);
    }, [transactions, walletFilter]);

    const periodTx = useMemo(() => {
        const ref = new Date();
        return filteredTx.filter((t) =>
            period === 'month' ? inMonth(t.date, ref) : inYear(t.date, ref)
        );
    }, [filteredTx, period]);

    const prevPeriodTx = useMemo(() => {
        const ref = period === 'month' ? prevMonth(new Date()) : prevYear(new Date());
        return filteredTx.filter((t) =>
            period === 'month' ? inMonth(t.date, ref) : inYear(t.date, ref)
        );
    }, [filteredTx, period]);

    const totals = useMemo(() => {
        let inc = 0;
        let exp = 0;
        periodTx.forEach((t) => {
            const { income, expense } = classifyAmount(t, catById);
            inc += income;
            exp += expense;
        });
        return { income: inc, expense: exp, net: inc - exp };
    }, [periodTx, catById]);

    const prevTotals = useMemo(() => {
        let inc = 0;
        let exp = 0;
        prevPeriodTx.forEach((t) => {
            const { income, expense } = classifyAmount(t, catById);
            inc += income;
            exp += expense;
        });
        return { income: inc, expense: exp, net: inc - exp };
    }, [prevPeriodTx, catById]);

    const moneyFlowData = useMemo(() => {
        const ref = new Date();
        if (period === 'year') {
            const year = ref.getFullYear();
            const months = MONTH_LABELS.map((month, i) => ({ month, income: 0, expense: 0, key: i }));
            filteredTx.forEach((t) => {
                const d = new Date(t.date);
                if (d.getFullYear() !== year) return;
                const m = d.getMonth();
                const { income, expense } = classifyAmount(t, catById);
                months[m].income += income;
                months[m].expense += expense;
            });
            return months.slice(0, ref.getMonth() + 1);
        }
        const dim = endOfMonth(ref).getDate();
        const days = [];
        for (let day = 1; day <= dim; day++) {
            days.push({
                month: String(day),
                income: 0,
                expense: 0,
                key: day,
            });
        }
        filteredTx.forEach((t) => {
            if (!inMonth(t.date, ref)) return;
            const d = new Date(t.date);
            const dom = d.getDate();
            const { income, expense } = classifyAmount(t, catById);
            if (days[dom - 1]) {
                days[dom - 1].income += income;
                days[dom - 1].expense += expense;
            }
        });
        return days;
    }, [filteredTx, period, catById]);

    const budgetSlices = useMemo(() => {
        const map = {};
        periodTx.forEach((t) => {
            const { expense } = classifyAmount(t, catById);
            if (expense <= 0) return;
            const cat = t.categoryId != null ? catById[t.categoryId] : null;
            const name = cat?.name || 'Uncategorized';
            map[name] = (map[name] || 0) + expense;
        });
        const entries = Object.entries(map).sort((a, b) => b[1] - a[1]);
        return entries.map(([name, value], i) => {
            const cat = categories.find((c) => c.name === name);
            return {
                name,
                value,
                color: cat?.colorHex || DONUT_FALLBACK[i % DONUT_FALLBACK.length],
            };
        });
    }, [periodTx, catById, categories]);

    const budgetTotal = useMemo(() => budgetSlices.reduce((s, x) => s + x.value, 0), [budgetSlices]);

    const recentTransactions = useMemo(
        () =>
            [...filteredTx]
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 5),
        [filteredTx]
    );

    const handleExportCsv = () => {
        const header = 'Date,Amount,Name,Wallet,Category\n';
        const rows = [...filteredTx]
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map((t) => {
                const cat = t.categoryId != null ? catById[t.categoryId] : null;
                const w = wallets.find((x) => Number(x.id) === Number(t.walletId));
                const amt = parseFloat(t.amount) || 0;
                const signed = cat?.type === 'income' ? amt : -amt;
                const name = (t.note || cat?.name || '').replace(/,/g, ';');
                return `${t.date},${signed},"${name}","${(w?.name || '').replace(/,/g, ';')}","${(cat?.name || '').replace(/,/g, ';')}"`;
            })
            .join('\n');
        const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `verdant-transactions-${period}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const incomeTrend = pctTrend(totals.income, prevTotals.income);
    const expenseTrend = pctTrend(totals.expense, prevTotals.expense);
    const savingsTrend = pctTrend(totals.net, prevTotals.net);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[40vh]">
                <div className="w-10 h-10 border-4 border-[#106E4E] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="w-full min-w-0 space-y-6 animate-in fade-in duration-500 pb-8">
            {/* Toolbar — Export CSV only on the right */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        type="button"
                        className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-emerald-50 hover:border-emerald-200 transition-colors"
                        aria-label="Calendar"
                    >
                        <Calendar size={18} />
                    </button>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPeriod(period === 'month' ? 'year' : 'month')}
                            className="h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all"
                        >
                            {period === 'month' ? 'Monthly' : 'Yearly'}
                        </button>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleExportCsv}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#106E4E] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-900/15 hover:bg-[#0d5c44] transition-colors w-full sm:w-auto"
                >
                    <Download size={18} />
                    Export CSV
                </button>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
                <SummaryCard
                    title="Total balance"
                    value={`${currencySymbol}${formatMoney(totalBalance)}`}
                    footerHint="Across all wallets"
                />
                <SummaryCard
                    title="Income"
                    value={`${currencySymbol}${formatMoney(totals.income)}`}
                    trendPct={incomeTrend}
                    subtitle={`vs last ${period === 'month' ? 'month' : 'year'}`}
                />
                <SummaryCard
                    title="Expense"
                    value={`${currencySymbol}${formatMoney(totals.expense)}`}
                    trendPct={expenseTrend}
                    subtitle={`vs last ${period === 'month' ? 'month' : 'year'}`}
                    isExpense
                />
                <SummaryCard
                    title="Net savings"
                    value={`${currencySymbol}${formatMoney(Math.max(0, totals.net))}`}
                    trendPct={savingsTrend}
                    subtitle={`vs last ${period === 'month' ? 'month' : 'year'}`}
                />
            </div>

            {/* Charts — wider money flow */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-8 xl:col-span-9 rounded-[1.25rem] border border-gray-100 bg-white p-5 sm:p-6 shadow-sm min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Money flow</h2>
                            <p className="text-sm text-gray-500">
                                Income vs expense ({period === 'month' ? 'by day' : 'by month'})
                            </p>
                        </div>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => {
                                    setWalletMenuOpen((o) => !o);
                                    setPeriodMenuOpen(false);
                                }}
                                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-[#F8FAFC] px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-emerald-50 hover:border-emerald-200 transition-colors"
                            >
                                {walletFilter === 'all' ? 'All accounts' : wallets.find((w) => String(w.id) === walletFilter)?.name || 'Wallet'}
                                <ChevronDown size={14} className="text-gray-400" />
                            </button>
                            {walletMenuOpen && (
                                <>
                                    <button
                                        type="button"
                                        className="fixed inset-0 z-40 cursor-default"
                                        aria-label="Close menu"
                                        onClick={() => setWalletMenuOpen(false)}
                                    />
                                    <div className="absolute right-0 top-full z-50 mt-2 max-h-56 w-52 overflow-y-auto rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
                                        <button
                                            type="button"
                                            className="block w-full px-4 py-2.5 text-left text-sm font-medium hover:bg-emerald-50"
                                            onClick={() => {
                                                setWalletFilter('all');
                                                setWalletMenuOpen(false);
                                            }}
                                        >
                                            All accounts
                                        </button>
                                        {wallets.map((w) => (
                                            <button
                                                key={w.id}
                                                type="button"
                                                className="block w-full px-4 py-2.5 text-left text-sm font-medium hover:bg-emerald-50 truncate"
                                                onClick={() => {
                                                    setWalletFilter(String(w.id));
                                                    setWalletMenuOpen(false);
                                                }}
                                            >
                                                {w.name}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-6 mb-4 text-xs font-semibold">
                        <span className="flex items-center gap-2 text-gray-600">
                            <span className="h-2.5 w-2.5 rounded-full bg-[#106E4E]" />
                            Income
                        </span>
                        <span className="flex items-center gap-2 text-gray-600">
                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-200" />
                            Expense
                        </span>
                    </div>
                    <div className="h-[280px] sm:h-[320px] w-full">
                        {moneyFlowData.some((d) => d.income > 0 || d.expense > 0) ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={moneyFlowData} barGap={6}>
                                    <XAxis
                                        dataKey="month"
                                        tick={{ fontSize: 10, fill: '#64748b' }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 10, fill: '#64748b' }}
                                        axisLine={false}
                                        tickLine={false}
                                        tickFormatter={(v) => (v >= 1000 ? `${currencySymbol}${v / 1000}k` : `${currencySymbol}${v}`)}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(16, 110, 78, 0.06)' }}
                                        contentStyle={{
                                            borderRadius: 12,
                                            border: '1px solid #e2e8f0',
                                            boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
                                        }}
                                        formatter={(value) => [`${currencySymbol}${formatMoney(value)}`, '']}
                                    />
                                    <Bar dataKey="income" fill="#106E4E" radius={[4, 4, 0, 0]} maxBarSize={30} />
                                    <Bar dataKey="expense" fill="#a7f3d0" radius={[4, 4, 0, 0]} maxBarSize={30} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center text-sm text-gray-400">
                                No income/expense in this range yet.
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-4 xl:col-span-3 rounded-[1.25rem] border border-gray-100 bg-white p-5 shadow-sm flex flex-col min-w-0">
                    <h2 className="text-lg font-bold text-gray-900 mb-1">Budget</h2>
                    <p className="text-sm text-gray-500 mb-4">Spending by category</p>
                    {budgetSlices.length === 0 ? (
                        <div className="flex flex-1 items-center justify-center text-sm text-gray-400 min-h-[180px]">
                            No expense data this period.
                        </div>
                    ) : (
                        <div className="flex flex-1 flex-col items-center gap-4">
                            <div className="relative h-[200px] w-full max-w-[200px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={budgetSlices}
                                            dataKey="value"
                                            innerRadius={65}
                                            outerRadius={85}
                                            paddingAngle={2}
                                            strokeWidth={0}
                                        >
                                            {budgetSlices.map((entry) => (
                                                <Cell key={entry.name} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(v) => `${currencySymbol}${formatMoney(v)}`} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total</p>
                                    <p className="text-lg font-black text-[#064e3b]">{`${currencySymbol}${formatMoney(budgetTotal)}`}</p>
                                </div>
                            </div>
                            <ul className="w-full space-y-2 text-xs overflow-y-auto max-h-[140px] pr-2">
                                {budgetSlices.map((s) => (
                                    <li key={s.name} className="flex items-center justify-between gap-2 text-gray-600">
                                        <span className="flex items-center gap-2 min-w-0">
                                            <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
                                            <span className="truncate font-medium">{s.name}</span>
                                        </span>
                                        <span className="font-bold text-gray-800 shrink-0">{`${currencySymbol}${formatMoney(s.value)}`}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Compact transactions + goals */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                <div className="lg:col-span-7 xl:col-span-8 rounded-[1.25rem] border border-gray-100 bg-white overflow-hidden shadow-sm">
                    <div className="flex items-center justify-between gap-2 px-5 py-4 border-b border-gray-100 bg-[#106E4E]/5">
                        <h2 className="text-base font-black text-gray-900 tracking-tight">Recent transactions</h2>
                        <Link
                            to="/transactions"
                            className="text-[10px] font-black uppercase tracking-widest text-[#106E4E] hover:underline shrink-0"
                        >
                            See all →
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse min-w-[600px]">
                            <thead>
                                <tr className="bg-[#106E4E]/5 border-b border-[#106E4E]/10">
                                    <th className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-[0.2em] text-[#106E4E]">Date</th>
                                    <th className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-[0.2em] text-[#106E4E]">Note</th>
                                    <th className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-[0.2em] text-[#106E4E]">Category</th>
                                    <th className="px-5 py-3 text-right text-[10px] font-black uppercase tracking-[0.2em] text-[#106E4E]">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {recentTransactions.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-5 py-10 text-center text-gray-400 text-sm font-bold">
                                            No transactions yet.
                                        </td>
                                    </tr>
                                ) : (
                                    recentTransactions.map((t) => {
                                        const category = t.categoryId != null ? catById[t.categoryId] : null;
                                        return (
                                            <tr key={t.id} className="hover:bg-gray-50/60 transition-colors">
                                                <td className="px-5 py-3 text-xs font-bold text-gray-500">
                                                    {new Date(t.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                                </td>
                                                <td className="px-5 py-3">
                                                    <p className="text-xs font-bold text-gray-900 truncate max-w-[150px]">{t.note || '—'}</p>
                                                </td>
                                                <td className="px-5 py-3">
                                                    {category ? (
                                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-1 rounded-lg"
                                                            style={{ backgroundColor: `${category.colorHex}15`, color: category.colorHex }}>
                                                            {category.name}
                                                        </span>
                                                    ) : '—'}
                                                </td>
                                                <td className="px-5 py-3 text-right">
                                                    <span className="text-sm font-black text-gray-900">
                                                        {currencySymbol}{formatMoney(t.amount)}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="lg:col-span-5 xl:col-span-4 rounded-[1.25rem] border border-gray-100 bg-[#FAFBFC] p-5 sm:p-6 shadow-sm min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-4">
                        <h2 className="text-lg font-bold text-gray-900">Saving goals</h2>
                        <Link to="/goals" className="text-xs font-semibold text-[#106E4E] hover:underline">
                            Manage
                        </Link>
                    </div>
                    {goals.length === 0 ? (
                        <div className="text-sm text-gray-400 py-8 text-center bg-white rounded-2xl border border-dashed border-gray-200">
                            No goals yet.
                        </div>
                    ) : (
                        <ul className="space-y-4">
                            {goals.slice(0, 4).map((g) => {
                                const target = parseFloat(g.targetAmount) || 1;
                                const current = parseFloat(g.currentAmount) || 0;
                                const pct = Math.min(100, Math.round((current / target) * 100));
                                return (
                                    <li key={g.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                                        <div className="flex items-center justify-between gap-2 text-sm mb-3">
                                            <span className="font-bold text-gray-800 truncate">{g.name}</span>
                                            <span className="text-gray-500 tabular-nums text-xs font-medium">
                                                {pct}%
                                            </span>
                                        </div>
                                        <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                                            <div
                                                className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between mt-2">
                                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Progress</span>
                                            <span className="text-[10px] text-gray-600 font-bold">{currencySymbol}{formatMoney(current)} / {currencySymbol}{formatMoney(target)}</span>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

function SummaryCard({ title, value, trendPct, subtitle, footerHint, isExpense }) {
    const showTrend = typeof trendPct === 'number' && !Number.isNaN(trendPct);
    const up = showTrend && trendPct >= 0;
    let good = up;
    if (isExpense) good = !up;

    return (
        <div className="rounded-[1.5rem] sm:rounded-[2rem] border border-gray-100 bg-white px-5 py-6 sm:px-6 sm:py-7 min-h-[140px] sm:min-h-[168px] flex flex-col shadow-sm relative overflow-hidden hover:border-emerald-200/80 hover:shadow-md transition-all group">
            {/* Background Accent */}
            <div className={`absolute top-0 right-0 w-24 h-24 blur-3xl opacity-[0.03] pointer-events-none rounded-full -mr-8 -mt-8 ${good ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            
            <button
                type="button"
                className="absolute top-4 right-4 sm:top-5 sm:right-5 inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-gray-100 bg-gray-50/50 text-gray-400 group-hover:text-[#106E4E] group-hover:bg-emerald-50 group-hover:border-emerald-100 transition-all"
                aria-label="Detail"
            >
                <ArrowUpRight size={18} />
            </button>
            <p className="text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-widest mb-1 sm:mb-2 pr-12">{title}</p>
            <p className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-auto pt-1 tabular-nums">{value}</p>
            <div className="mt-4 sm:mt-5">
                {footerHint ? (
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{footerHint}</p>
                ) : showTrend ? (
                    <div
                        className={`inline-flex flex-wrap items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${good ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                            }`}
                    >
                        {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {`${up ? '+' : ''}${trendPct.toFixed(1)}%`}
                        <span className="font-bold text-gray-400/60 lowercase tracking-normal ml-1">{subtitle}</span>
                    </div>
                ) : (
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{subtitle || '—'}</p>
                )}
            </div>
        </div>
    );
}
