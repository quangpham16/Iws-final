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
        <div className="animate-in fade-in duration-700">
            {activeTab === 'transactions'  && <TransactionsPanel />}
            {activeTab === 'subscriptions' && <SubscriptionsPanel />}
            {activeTab === 'categories'    && <CategoriesPanel />}
            {activeTab === 'payees'        && <PayeesPanel />}
            {activeTab === 'tags'          && <TagsPanel />}
        </div>
    );
}
