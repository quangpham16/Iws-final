import React from 'react';
import { useSearchParams } from 'react-router-dom';
import TransactionsPanel from '../components/TransactionsPanel';
import SubscriptionsPanel from '../components/SubscriptionsPanel';
import CategoriesPanel from '../components/CategoriesPanel';
import PayeesPanel from '../components/PayeesPanel';
import TagsPanel from '../components/TagsPanel';

export default function TransactionsPage() {
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'transactions';

    return (
        <div className="space-y-8 max-w-[1600px] mx-auto w-full animate-in fade-in duration-700">

            {/* Header */}
            <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">Ledger</p>
                <h1 className="text-5xl font-black text-gray-900 tracking-tighter">
                    Your <span className="text-[#106E4E]">Transactions.</span>
                </h1>
            </div>

            {/* Active panel */}
            <div>
                {activeTab === 'transactions'  && <TransactionsPanel />}
                {activeTab === 'subscriptions' && <SubscriptionsPanel />}
                {activeTab === 'categories'    && <CategoriesPanel />}
                {activeTab === 'payees'        && <PayeesPanel />}
                {activeTab === 'tags'          && <TagsPanel />}
            </div>
        </div>
    );
}
