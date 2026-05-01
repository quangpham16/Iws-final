import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import WalletSetupPage from './pages/WalletSetupPage';
import WalletsPage from './pages/WalletsPage';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import CategoriesPage from './pages/CategoriesPage';
import BudgetsPage from './pages/BudgetsPage';
import GoalsPage from './pages/GoalsPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import PayeesPage from './pages/PayeesPage';
import TagsPage from './pages/TagsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/setup-wallet" element={<WalletSetupPage />} />

        {/* Protected Routes inside Layout */}
        <Route path="/dashboard" element={<Layout><DashboardPage /></Layout>} />
        <Route path="/wallets" element={<Layout><WalletsPage /></Layout>} />
        <Route path="/transactions" element={<Layout><TransactionsPage /></Layout>} />
        <Route path="/categories" element={<Layout><CategoriesPage /></Layout>} />
        <Route path="/budgets" element={<Layout><BudgetsPage /></Layout>} />
        <Route path="/goals" element={<Layout><GoalsPage /></Layout>} />
        <Route path="/subscriptions" element={<Layout><SubscriptionsPage /></Layout>} />
        <Route path="/payees" element={<Layout><PayeesPage /></Layout>} />
        <Route path="/tags" element={<Layout><TagsPage /></Layout>} />
        <Route path="/reports" element={<Layout><ReportsPage /></Layout>} />
        <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;
