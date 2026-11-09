import React, { useState, useEffect } from 'react';
import { BarChart3, PieChart as PieIcon, TrendingDown, Sparkles, Package, AlertTriangle, ShieldCheck } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { api } from '../services/api';

export const AnalyticsPage: React.FC = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    safeCount: 0,
    expiringSoonCount: 0,
    urgentCount: 0,
    expiredCount: 0,
    usedCount: 0,
    wasteRate: 0
  });

  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [monthlyTrend, setMonthlyTrend] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const dashRes = await api.get('/analytics/dashboard');
      if (dashRes.data.success) {
        setStats(dashRes.data.stats);
      }

      const catRes = await api.get('/analytics/categories');
      if (catRes.data.success) {
        setCategoryData(catRes.data.data || []);
      }

      const monthRes = await api.get('/analytics/monthly');
      if (monthRes.data.success) {
        setMonthlyTrend(monthRes.data.monthlyTrend || []);
      }
    } catch {
      console.warn('Analytics fetch error');
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
          <BarChart3 className="w-7 h-7 text-emerald-400" /> Food Waste & Expiry Analytics
        </h1>
        <p className="text-xs text-gray-400 mt-1">Data-driven insights on household waste reduction and consumption patterns</p>
      </div>

      {/* Hero Metric: Waste Rate Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-gray-800 bg-gradient-to-r from-gray-900 via-gray-900 to-emerald-950/30 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Food Waste Efficiency Metric
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Estimated Household Waste Rate</h2>
          <p className="text-xs text-gray-400 max-w-lg">
            Calculated as <code className="font-mono text-emerald-300">Expired Products / Total Scanned Products × 100</code>. Lower rates reflect higher savings and reduced food wastage.
          </p>
        </div>

        <div className="text-center sm:text-right shrink-0">
          <div className="text-4xl sm:text-6xl font-black bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
            {stats.wasteRate}%
          </div>
          <p className="text-xs text-gray-400 font-medium mt-1">
            {stats.wasteRate <= 10 ? '🌟 Outstanding Efficiency' : '⚠️ Waste Reduction Needed'}
          </p>
        </div>
      </div>

      {/* Grid of Key Analytics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-gray-800">
          <span className="text-xs font-semibold text-gray-400">Total Scanned</span>
          <h3 className="text-2xl font-black text-white mt-2">{stats.totalProducts}</h3>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-gray-800">
          <span className="text-xs font-semibold text-gray-400">Products Used</span>
          <h3 className="text-2xl font-black text-emerald-400 mt-2">{stats.usedCount}</h3>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-gray-800">
          <span className="text-xs font-semibold text-gray-400">Expiring Soon</span>
          <h3 className="text-2xl font-black text-amber-400 mt-2">{stats.expiringSoonCount + stats.urgentCount}</h3>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-gray-800">
          <span className="text-xs font-semibold text-gray-400">Total Expired</span>
          <h3 className="text-2xl font-black text-rose-400 mt-2">{stats.expiredCount}</h3>
        </div>
      </div>

      {/* Interactive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution Breakdown (Pie Chart) */}
        <div className="glass-panel p-6 rounded-3xl border border-gray-800">
          <h3 className="font-bold text-base text-white mb-1">Products by Category</h3>
          <p className="text-xs text-gray-400 mb-6">Inventory proportion per category</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="total"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  paddingAngle={3}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '12px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Added vs Expired Bar Chart */}
        <div className="glass-panel p-6 rounded-3xl border border-gray-800">
          <h3 className="font-bold text-base text-white mb-1">Monthly Expiry Trend</h3>
          <p className="text-xs text-gray-400 mb-6">Monthly expired items trend line</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrend}>
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '12px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="added" name="Added Items" stroke="#10b981" strokeWidth={3} />
                <Line type="monotone" dataKey="expired" name="Expired Items" stroke="#ef4444" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
