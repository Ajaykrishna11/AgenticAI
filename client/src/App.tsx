import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { MobileNav } from './components/MobileNav';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';

import { DashboardPage } from './pages/DashboardPage';
import { ScanProductPage } from './pages/ScanProductPage';
import { InventoryPage } from './pages/InventoryPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { AddProductPage } from './pages/AddProductPage';
import { EditProductPage } from './pages/EditProductPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { ExpiryAlertsPage } from './pages/ExpiryAlertsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ShoppingListPage } from './pages/ShoppingListPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AiAssistantPage } from './pages/AiAssistantPage';
import { SettingsPage } from './pages/SettingsPage';

const ProtectedLayout: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center text-emerald-400 font-semibold text-sm">
        Initializing SmartShelf AI...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-[#0b0f19]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 p-4 lg:p-8 pb-20 md:pb-8 overflow-y-auto">
          <Outlet />
        </main>
        <MobileNav />
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/scan" element={<ScanProductPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/products/add" element={<AddProductPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/products/:id/edit" element={<EditProductPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/expiry-alerts" element={<ExpiryAlertsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/shopping-list" element={<ShoppingListPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/chat" element={<AiAssistantPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
