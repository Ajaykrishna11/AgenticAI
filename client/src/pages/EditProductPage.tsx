import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit } from 'lucide-react';
import { api } from '../services/api';
import { Toast } from '../components/Toast';

export const EditProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    if (id) {
      api.get(`/products/${id}`).then((res) => {
        if (res.data.success) {
          const p = res.data.product;
          setFormData({
            productName: p.productName || '',
            brand: p.brand || '',
            category: p.category || 'FOOD',
            subcategory: p.subcategory || '',
            expiryDate: p.expiryDate ? new Date(p.expiryDate).toISOString().split('T')[0] : '',
            manufacturingDate: p.manufacturingDate ? new Date(p.manufacturingDate).toISOString().split('T')[0] : '',
            quantity: p.quantity || 1,
            unit: p.unit || 'pcs',
            storageLocation: p.storageLocation || 'Kitchen Cupboard',
            imageUrl: p.imageUrl || ''
          });
        }
      }).finally(() => setLoading(false));
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.put(`/products/${id}`, formData);
      if (res.data.success) {
        setToast({ message: 'Product updated successfully!', type: 'success' });
        setTimeout(() => navigate('/inventory'), 800);
      }
    } catch (err: any) {
      setToast({ message: err.message || 'Update failed.', type: 'error' });
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-400">Loading product...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <Link to="/inventory" className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white">
        <ArrowLeft className="w-4 h-4" /> Back to Inventory
      </Link>

      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-gray-800 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Edit className="w-6 h-6 text-emerald-400" /> Edit Product Details
          </h1>
          <p className="text-xs text-gray-400 mt-1">Modify product metadata and storage location</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-300 mb-1">Product Name</label>
            <input
              type="text"
              required
              value={formData.productName}
              onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
              className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm text-gray-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Brand</label>
            <input
              type="text"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm text-gray-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Category</label>
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
            <label className="block text-xs font-semibold text-gray-300 mb-1">Expiry Date</label>
            <input
              type="date"
              required
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm text-gray-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Storage Location</label>
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
              min="0"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value, 10) || 0 })}
              className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm text-gray-200 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2 pt-4 border-t border-gray-800 flex justify-end gap-3">
            <Link to="/inventory" className="px-5 py-2.5 rounded-xl bg-gray-800 text-gray-300 font-semibold text-xs">Cancel</Link>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs shadow-lg shadow-emerald-600/30"
            >
              Update Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
