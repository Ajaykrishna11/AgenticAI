import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Clock,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  Camera,
  Plus,
  ShoppingCart,
  ArrowRight,
  TrendingUp,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { api, ProductItem } from '../services/api';
import { ExpiryBadge } from '../components/ExpiryBadge';
import { ProductCard } from '../components/ProductCard';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    safeCount: 0,
    expiringSoonCount: 0,
    urgentCount: 0,
    expiredCount: 0,
    wasteRate: 0
  });
  const [recentProducts, setRecentProducts] = useState<ProductItem[]>([]);
  const [expiringOverview, setExpiringOverview] = useState<ProductItem[]>([]);
  const [categoryData, setCategoryData] = useState<{ name: string; count: number }[]>([]);
  const [monthlyData, setMonthlyData] = useState<{ month: string; added: number; expired: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Analytics
      const res = await api.get('/analytics/dashboard');
      if (res.data.success) {
        setStats(res.data.stats);
        setRecentProducts(res.data.recentProducts || []);
        setCategoryData(res.data.categoryDistribution || []);
      }

      // 2. Fetch Urgent/Expiring Overview
      const urgentRes = await api.get('/expiry/urgent');
      if (urgentRes.data.success) {
        setExpiringOverview(urgentRes.data.products || []);
      }

      // 3. Fetch Monthly Analytics
      const monthRes = await api.get('/analytics/monthly');
      if (monthRes.data.success) {
        setMonthlyData(monthRes.data.monthlyTrend || []);
      }
    } catch (err) {
      console.warn('Backend loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-gray-800/80 relative overflow-hidden bg-gradient-to-r from-gray-900 via-gray-900 to-emerald-950/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 inline-flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Agentic AI Engine Active
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="text-emerald-400">{user?.name || 'Smart User'}</span> 👋
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-xl">
              Your autonomous AI agents are actively monitoring product expiry status across all household storage locations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchDashboardData}
              className="p-2.5 rounded-xl bg-gray-800/80 hover:bg-gray-700 text-gray-300 border border-gray-700 transition-all"
              title="Refresh Dashboard"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <Link
              to="/scan"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 transition-all hover:scale-[1.02]"
            >
              <Camera className="w-4 h-4" /> Scan Product
            </Link>
          </div>
        </div>
      </div>

      {/* 5 Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total Products */}
        <div className="glass-panel p-5 rounded-2xl border border-gray-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400">Total Products</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-white">{stats.totalProducts}</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">Active items stored</p>
          </div>
        </div>

        {/* Safe Products */}
        <div className="glass-panel p-5 rounded-2xl border border-gray-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400">Safe Products</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-emerald-400">{stats.safeCount}</h3>
            <p className="text-[11px] text-emerald-500/80 mt-0.5">&gt; 30 days shelf life</p>
          </div>
        </div>

        {/* Expiring Soon */}
        <div className="glass-panel p-5 rounded-2xl border border-gray-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400">Expiring Soon</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-amber-400">{stats.expiringSoonCount}</h3>
            <p className="text-[11px] text-amber-500/80 mt-0.5">8 to 30 days remaining</p>
          </div>
        </div>

        {/* Urgent Products */}
        <div className="glass-panel p-5 rounded-2xl border border-gray-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400">Urgent Products</span>
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-orange-400">{stats.urgentCount}</h3>
            <p className="text-[11px] text-orange-500/80 mt-0.5">1 to 7 days or today</p>
          </div>
        </div>

        {/* Expired Products */}
        <div className="glass-panel p-5 rounded-2xl border border-gray-800 flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400">Expired Products</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-rose-400">{stats.expiredCount}</h3>
            <p className="text-[11px] text-rose-500/80 mt-0.5">Waste Rate: {stats.wasteRate}%</p>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-gray-800 flex flex-wrap items-center justify-between gap-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 pl-2">Quick Actions</h4>
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/scan"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-semibold text-xs border border-emerald-500/30 transition-all"
          >
            <Camera className="w-4 h-4" /> Scan Product
          </Link>
          <Link
            to="/products/add"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 font-semibold text-xs border border-blue-500/30 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Product
          </Link>
          <Link
            to="/inventory"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold text-xs border border-gray-700 transition-all"
          >
            <Package className="w-4 h-4" /> View Inventory
          </Link>
          <Link
            to="/shopping-list"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-semibold text-xs border border-amber-500/30 transition-all"
          >
            <ShoppingCart className="w-4 h-4" /> Shopping List
          </Link>
        </div>
      </div>

      {/* Grid Section: Expiry Overview & Quick Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Expiry Overview Column (2 cols) */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-400" /> Expiry Overview
              </h3>
              <p className="text-xs text-gray-400">Products requiring immediate attention</p>
            </div>
            <Link to="/expiry-alerts" className="text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1">
              View All Alerts <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {expiringOverview.length === 0 ? (
            <div className="text-center py-10 bg-gray-900/40 rounded-2xl border border-gray-800/60">
              <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto mb-2 opacity-80" />
              <p className="font-semibold text-sm text-gray-200">All Items Fresh & Safe!</p>
              <p className="text-xs text-gray-400 mt-1">No urgent products expiring within the next 7 days.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {expiringOverview.slice(0, 5).map((item) => (
                <div key={item._id} className="p-3.5 rounded-2xl bg-gray-900/70 border border-gray-800 flex items-center justify-between gap-4 hover:border-gray-700 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-800 overflow-hidden shrink-0">
                      <img src={item.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80'} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-white">{item.productName}</h4>
                      <p className="text-xs text-gray-400">{item.category} • {item.storageLocation}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <ExpiryBadge status={item.status} remainingDays={item.remainingDays} />
                    <p className="text-[10px] text-gray-400 mt-1">Exp: {new Date(item.expiryDate).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category Analytics Pie Chart */}
        <div className="glass-panel p-6 rounded-3xl border border-gray-800 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-white mb-1">Products by Category</h3>
            <p className="text-xs text-gray-400 mb-4">Household distribution</p>

            {categoryData.length === 0 ? (
              <div className="text-center py-12 text-xs text-gray-400">No category data available</div>
            ) : (
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '12px', fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-gray-800/80 flex flex-wrap gap-2 text-[10px]">
            {categoryData.slice(0, 4).map((c, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-gray-300 font-medium">{c.name}: {c.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recently Added Products Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-xl text-white">Recently Added Products</h3>
            <p className="text-xs text-gray-400">Latest items scanned into inventory</p>
          </div>
          <Link to="/inventory" className="text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1">
            View Full Inventory <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentProducts.length === 0 ? (
          <div className="glass-panel p-8 rounded-3xl text-center text-gray-400 text-sm">
            No products added yet. Click <strong>Scan Product</strong> to get started!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentProducts.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Monthly Expiry Trend Bar Chart */}
      {monthlyData.length > 0 && (
        <div className="glass-panel p-6 rounded-3xl border border-gray-800">
          <h3 className="font-bold text-lg text-white mb-1">Monthly Product Trends</h3>
          <p className="text-xs text-gray-400 mb-6">Added vs Expired items per month</p>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '12px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="added" name="Products Added" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="expired" name="Expired Items" fill="#ef4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
