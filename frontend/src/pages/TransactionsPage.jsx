import React, { useState } from 'react';
import { ArrowLeftRight, RefreshCcw, Tag, Users, Hash } from 'lucide-react';
import TransactionsPanel from '../components/TransactionsPanel';
import SubscriptionsPanel from '../components/SubscriptionsPanel';
import CategoriesPanel from '../components/CategoriesPanel';
import PayeesPanel from '../components/PayeesPanel';
import TagsPanel from '../components/TagsPanel';

const SUB_TABS = [
    { id: 'transactions',  label: 'Transactions',  icon: ArrowLeftRight },
    { id: 'subscriptions',  label: 'Subscriptions',  icon: RefreshCcw },
    { id: 'categories',     label: 'Categories',     icon: Tag },
    { id: 'payees',         label: 'Payees',         icon: Users },
    { id: 'tags',           label: 'Tags',           icon: Hash },
];

export default function TransactionsPage() {
    const [activeTab, setActiveTab] = useState('transactions');

    return (
        <div className="space-y-8 max-w-[1600px] mx-auto w-full animate-in fade-in duration-700">

            {/* Header */}
            <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">Ledger</p>
                <h1 className="text-5xl font-black text-gray-900 tracking-tighter">
                    Your <span className="text-[#106E4E]">Transactions.</span>
                </h1>
            </div>

            {/* Sub-tab navigation */}
            <div className="flex items-center gap-1 bg-white rounded-[1.5rem] p-1.5 border border-gray-100 shadow-sm w-fit">
                {SUB_TABS.map(tab => {
                    const isActive = activeTab === tab.id;
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-3 rounded-[1.25rem] text-sm font-black transition-all duration-300 ${
                                isActive
                                    ? 'bg-[#106E4E] text-white shadow-lg shadow-[#106E4E]/20'
                                    : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            <Icon size={16} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Active panel */}
            <div>
                {activeTab === 'transactions'  && <TransactionsPanel />}
                {activeTab === 'subscriptions'  && <SubscriptionsPanel />}
                {activeTab === 'categories'     && <CategoriesPanel />}
                {activeTab === 'payees'         && <PayeesPanel />}
                {activeTab === 'tags'           && <TagsPanel />}
            </div>
        </div>
    );
}
