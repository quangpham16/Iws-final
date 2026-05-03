import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import WalletSetupPage from './pages/WalletSetupPage';
import WalletsPage from './pages/WalletsPage';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import BudgetsPage from './pages/BudgetsPage';
import GoalsPage from './pages/GoalsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';

// Info Pages
import AboutPage from './pages/AboutPage';
import BlogPage from './pages/BlogPage';
import CareersPage from './pages/CareersPage';
import ContactPage from './pages/ContactPage';
import SecurityPage from './pages/SecurityPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/setup-wallet" element={<WalletSetupPage />} />

        {/* Info Pages */}
        <Route path="/about" element={<AboutPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/security" element={<SecurityPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />

        {/* Protected Routes inside Layout */}
        <Route path="/dashboard" element={<Layout><DashboardPage /></Layout>} />
        <Route path="/wallets" element={<Layout><WalletsPage /></Layout>} />
        <Route path="/transactions" element={<Layout><TransactionsPage /></Layout>} />
        <Route path="/budgets" element={<Layout><BudgetsPage /></Layout>} />
        <Route path="/goals" element={<Layout><GoalsPage /></Layout>} />
        <Route path="/reports" element={<Layout><ReportsPage /></Layout>} />
        <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;
