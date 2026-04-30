import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import WalletsPage from './pages/WalletsPage';
import TransactionsPage from './pages/TransactionsPage';
import CategoriesPage from './pages/CategoriesPage';
import BudgetsPage from './pages/BudgetsPage';
import GoalsPage from './pages/GoalsPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import PayeesPage from './pages/PayeesPage';
import TagsPage from './pages/TagsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';


// Private Route Wrapper
const PrivateRoute = ({ children }) => {
  const user = localStorage.getItem('user');
  return user ? children : <Navigate to="/auth" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* Private Routes (Wrapped in PrivateRoute and Layout) */}
        <Route path="/dashboard" element={<PrivateRoute><Layout><DashboardPage /></Layout></PrivateRoute>} />
        <Route path="/wallets" element={<PrivateRoute><Layout><WalletsPage /></Layout></PrivateRoute>} />
        <Route path="/transactions" element={<PrivateRoute><Layout><TransactionsPage /></Layout></PrivateRoute>} />
        <Route path="/categories" element={<PrivateRoute><Layout><CategoriesPage /></Layout></PrivateRoute>} />
        <Route path="/budgets" element={<PrivateRoute><Layout><BudgetsPage /></Layout></PrivateRoute>} />
        <Route path="/goals" element={<PrivateRoute><Layout><GoalsPage /></Layout></PrivateRoute>} />
        <Route path="/subscriptions" element={<PrivateRoute><Layout><SubscriptionsPage /></Layout></PrivateRoute>} />
        <Route path="/payees" element={<PrivateRoute><Layout><PayeesPage /></Layout></PrivateRoute>} />
        <Route path="/tags" element={<PrivateRoute><Layout><TagsPage /></Layout></PrivateRoute>} />
        <Route path="/reports" element={<PrivateRoute><Layout><ReportsPage /></Layout></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><Layout><SettingsPage /></Layout></PrivateRoute>} />
        
        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
