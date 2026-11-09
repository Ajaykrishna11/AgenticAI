import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, Play, Sparkles, ChefHat, Pill } from 'lucide-react';
import { api, ProductItem } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { Toast } from '../components/Toast';

export const ExpiryAlertsPage: React.FC = () => {
  const [urgentProducts, setUrgentProducts] = useState<ProductItem[]>([]);
  const [expiringSoon, setExpiringSoon] = useState<ProductItem[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const urgentRes = await api.get('/expiry/urgent');
      if (urgentRes.data.success) {
        setUrgentProducts(urgentRes.data.products || []);
        setRecommendations(urgentRes.data.recommendations || []);
      }

      const soonRes = await api.get('/expiry/expiring-soon');
      if (soonRes.data.success) {
        setExpiringSoon(soonRes.data.products || []);
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunAgent = async () => {
    try {
      const res = await api.post('/agents/expiry/run');
      if (res.data.success) {
        setToast({ message: 'Expiry Agent executed successfully! All statuses recalculated.', type: 'success' });
        fetchAlerts();
      }
    } catch {
      setToast({ message: 'Error executing agent.', type: 'error' });
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header Banner & Manual Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-gray-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
            <AlertTriangle className="w-7 h-7 text-orange-400" /> Expiry Alerts & Recommendations
          </h1>
          <p className="text-xs text-gray-400 mt-1">Autonomous monitoring for items nearing expiry dates</p>
        </div>

        <button
          onClick={handleRunAgent}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02]"
        >
          <Play className="w-4 h-4 fill-white" /> Run Expiry Agent Now
        </button>
      </div>

      {/* Recommendation Agent Cards */}
      {recommendations.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Recommendation Agent Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((rec, i) => (
              <div key={i} className="glass-panel p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/20">
                <div className="flex items-center gap-2.5 mb-2">
                  {rec.type === 'RECIPE_SUGGESTION' ? <ChefHat className="w-5 h-5 text-emerald-400" /> : <Pill className="w-5 h-5 text-amber-400" />}
                  <h4 className="font-bold text-sm text-white">{rec.title}</h4>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">{rec.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Urgent Products (1-7 days) */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-400" /> Urgent Products (Expiring in 1 to 7 Days or Today)
        </h2>
        {urgentProducts.length === 0 ? (
          <div className="glass-panel p-6 rounded-2xl text-center text-xs text-gray-400 border border-gray-800">
            No urgent products expiring in the next 7 days.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {urgentProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>

      {/* Expiring Soon Products (8-30 days) */}
      <div className="space-y-4 pt-4 border-t border-gray-800/80">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-400" /> Expiring Soon (8 to 30 Days)
        </h2>
        {expiringSoon.length === 0 ? (
          <div className="glass-panel p-6 rounded-2xl text-center text-xs text-gray-400 border border-gray-800">
            No items in the 8-30 days window.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {expiringSoon.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
