import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { Toast } from '../components/Toast';

export const AddProductPage: React.FC = () => {
  const navigate = useNavigate();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    productName: '',
    brand: '',
    category: 'FOOD',
    subcategory: 'Packaged Food',
    expiryDate: '',
    manufacturingDate: '',
    quantity: 1,
    unit: 'pcs',
    storageLocation: 'Kitchen Cupboard',
    imageUrl: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/products', formData);
      if (res.data.success) {
        setToast({ message: 'Product added successfully!', type: 'success' });
        setTimeout(() => navigate('/inventory'), 800);
      }
    } catch (err: any) {
      setToast({ message: err.message || 'Error creating product.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <Link to="/inventory" className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white">
        <ArrowLeft className="w-4 h-4" /> Back to Inventory
      </Link>

      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-gray-800 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Plus className="w-6 h-6 text-emerald-400" /> Add Product Manually
          </h1>
          <p className="text-xs text-gray-400 mt-1">Enter product specifications and expiry date</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-300 mb-1">Product Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Whole Wheat Bread"
              value={formData.productName}
              onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
              className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm text-gray-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Brand</label>
            <input
              type="text"
              placeholder="e.g. Britannia"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm text-gray-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm text-gray-200 bg-gray-900 focus:outline-none"
            >
              <option value="FOOD">FOOD</option>
              <option value="MEDICINE">MEDICINE</option>
              <option value="PERSONAL CARE">PERSONAL CARE</option>
              <option value="SANITARY PRODUCTS">SANITARY PRODUCTS</option>
              <option value="CLEANING PRODUCTS">CLEANING PRODUCTS</option>
              <option value="GROCERIES">GROCERIES</option>
              <option value="BABY PRODUCTS">BABY PRODUCTS</option>
              <option value="OTHER">OTHER</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Expiry Date *</label>
            <input
              type="date"
              required
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm text-gray-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Manufacturing Date</label>
            <input
              type="date"
              value={formData.manufacturingDate}
              onChange={(e) => setFormData({ ...formData, manufacturingDate: e.target.value })}
              className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm text-gray-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Storage Location *</label>
            <select
              value={formData.storageLocation}
              onChange={(e) => setFormData({ ...formData, storageLocation: e.target.value })}
              className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm text-gray-200 bg-gray-900 focus:outline-none"
            >
              <option value="Refrigerator">Refrigerator</option>
              <option value="Freezer">Freezer</option>
              <option value="Kitchen Cupboard">Kitchen Cupboard</option>
              <option value="Grocery Shelf">Grocery Shelf</option>
              <option value="Medicine Box">Medicine Box</option>
              <option value="Bathroom">Bathroom</option>
              <option value="Cosmetic Shelf">Cosmetic Shelf</option>
              <option value="Cleaning Storage">Cleaning Storage</option>
              <option value="Storeroom">Storeroom</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Quantity</label>
            <input
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value, 10) || 1 })}
              className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm text-gray-200 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-300 mb-1">Image URL (Optional)</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm text-gray-200 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2 pt-4 border-t border-gray-800 flex justify-end gap-3">
            <Link to="/inventory" className="px-5 py-2.5 rounded-xl bg-gray-800 text-gray-300 font-semibold text-xs">Cancel</Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs shadow-lg shadow-emerald-600/30"
            >
              {loading ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
