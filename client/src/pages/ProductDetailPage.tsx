import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Calendar, MapPin, Package, CheckCircle, Plus, Minus, Clock, ShieldCheck, History } from 'lucide-react';
import { api, ProductItem } from '../services/api';
import { ExpiryBadge } from '../components/ExpiryBadge';
import { Toast, ConfirmModal } from '../components/Toast';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<ProductItem | null>(null);
  const [usageHistory, setUsageHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (id) fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/products/${id}`);
      if (res.data.success) {
        setProduct(res.data.product);
        setUsageHistory(res.data.usageHistory || []);
      }
    } catch {
      setToast({ message: 'Product not found.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustQuantity = async (delta: number) => {
    if (!product) return;
    const newQty = Math.max(0, product.quantity + delta);
    try {
      const res = await api.post(`/products/${product._id}/quantity`, { quantity: newQty });
      if (res.data.success) {
        setProduct({ ...product, quantity: newQty });
        setToast({ message: `Quantity updated to ${newQty}`, type: 'success' });
      }
    } catch {
      setToast({ message: 'Error updating quantity.', type: 'error' });
    }
  };

  const handleMarkUsed = async () => {
    if (!product) return;
    try {
      const res = await api.post(`/products/${product._id}/mark-used`, { quantityUsed: 1, notes: 'Used item from details page' });
      if (res.data.success) {
        setToast({ message: 'Item marked as used!', type: 'success' });
        fetchProductDetails();
      }
    } catch {
      setToast({ message: 'Error logging usage.', type: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!product) return;
    try {
      await api.delete(`/products/${product._id}`);
      navigate('/inventory');
    } catch {
      setToast({ message: 'Error deleting product.', type: 'error' });
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-400">Loading product details...</div>;
  if (!product) return <div className="p-8 text-center text-gray-400">Product not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Product"
        message="Are you sure you want to permanently delete this product from SmartShelf?"
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />

      <Link to="/inventory" className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white">
        <ArrowLeft className="w-4 h-4" /> Back to Inventory
      </Link>

      <div className="glass-panel rounded-3xl overflow-hidden border border-gray-800 grid grid-cols-1 md:grid-cols-2">
        {/* Left Column Image Preview */}
        <div className="relative h-80 md:h-auto bg-gray-900 overflow-hidden">
          <img
            src={product.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'}
            alt={product.productName}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4">
            <ExpiryBadge status={product.status} remainingDays={product.remainingDays} />
          </div>
        </div>

        {/* Right Column Specifications & Actions */}
        <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 uppercase tracking-wider">
                {product.category}
              </span>
              <span className="text-xs text-gray-400">Added: {new Date(product.createdAt).toLocaleDateString()}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">{product.productName}</h1>
            <p className="text-sm text-gray-400 font-medium">{product.brand} • {product.subcategory || 'General'}</p>

            <div className="mt-6 space-y-3 text-xs text-gray-300 border-t border-b border-gray-800 py-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-400"><Calendar className="w-4 h-4 text-emerald-400" /> Expiry Date</span>
                <span className="font-bold text-white text-sm">{new Date(product.expiryDate).toLocaleDateString()}</span>
              </div>

              {product.manufacturingDate && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-gray-400"><Clock className="w-4 h-4 text-blue-400" /> Manufacturing Date</span>
                  <span className="font-medium text-gray-200">{new Date(product.manufacturingDate).toLocaleDateString()}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-400"><MapPin className="w-4 h-4 text-teal-400" /> Storage Location</span>
                <span className="font-semibold text-emerald-400">{product.storageLocation}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-400"><Package className="w-4 h-4 text-amber-400" /> Quantity Remaining</span>
                <div className="flex items-center gap-3">
                  <button onClick={() => handleAdjustQuantity(-1)} className="p-1 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-300"><Minus className="w-3.5 h-3.5" /></button>
                  <span className="font-bold text-white text-sm">{product.quantity} {product.unit}</span>
                  <button onClick={() => handleAdjustQuantity(1)} className="p-1 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-300"><Plus className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleMarkUsed}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white font-bold text-xs shadow-lg shadow-emerald-600/25"
            >
              <CheckCircle className="w-4 h-4" /> Mark 1 as Used
            </button>
            <Link
              to={`/products/${product._id}/edit`}
              className="p-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700"
              title="Edit Product"
            >
              <Edit className="w-4 h-4" />
            </Link>
            <button
              onClick={() => setDeleteModalOpen(true)}
              className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30"
              title="Delete Product"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Usage History Logs */}
      {usageHistory.length > 0 && (
        <div className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-4">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-400" /> Item Usage Timeline
          </h3>
          <div className="space-y-2">
            {usageHistory.map((usage, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-gray-900/60 border border-gray-800 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-gray-200">Used {usage.quantityUsed} item(s)</p>
                  <p className="text-[11px] text-gray-400">{usage.notes}</p>
                </div>
                <span className="text-gray-500">{new Date(usage.usedAt).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
