import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, LayoutGrid, List, Plus, Package, MapPin, Calendar, CheckCircle, Edit, Trash2 } from 'lucide-react';
import { api, ProductItem } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { ExpiryBadge } from '../components/ExpiryBadge';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ConfirmModal } from '../components/Toast';

export const InventoryPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Filter States
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'ALL');
  const [location, setLocation] = useState('ALL');
  const [status, setStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState('expiryDate');

  // Confirm delete modal
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [category, location, status, sortBy]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.append('search', search);
      if (category !== 'ALL') queryParams.append('category', category);
      if (location !== 'ALL') queryParams.append('storageLocation', location);
      if (status !== 'ALL') queryParams.append('status', status);
      if (sortBy) queryParams.append('sortBy', sortBy);

      const res = await api.get(`/products?${queryParams.toString()}`);
      if (res.data.success) {
        setProducts(res.data.products || []);
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleMarkUsed = async (id: string) => {
    try {
      const res = await api.post(`/products/${id}/mark-used`, { quantityUsed: 1 });
      if (res.data.success) {
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/products/${deleteId}`);
      setDeleteId(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Product"
        message="Are you sure you want to remove this item from your SmartShelf inventory?"
        confirmText="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Smart Inventory</h1>
          <p className="text-xs text-gray-400 mt-1">Manage all products stored across your household locations</p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-gray-900 border border-gray-800 text-gray-400">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-emerald-500/20 text-emerald-400' : 'hover:text-gray-200'}`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-emerald-500/20 text-emerald-400' : 'hover:text-gray-200'}`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <Link
            to="/products/add"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Product
          </Link>
        </div>
      </div>

      {/* Search & Filter Controls Panel */}
      <div className="glass-panel p-4 rounded-2xl border border-gray-800 space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products by title, brand, or tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full glass-input rounded-xl pl-10 pr-4 py-2 text-sm text-gray-200 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-xs transition-all"
          >
            Search
          </button>
        </form>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 pt-2 text-xs border-t border-gray-800/80">
          <div className="flex items-center gap-1.5 text-gray-400 font-semibold">
            <Filter className="w-3.5 h-3.5 text-emerald-400" /> Filters:
          </div>

          {/* Category Filter */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-gray-900 border border-gray-800 text-gray-200 rounded-xl px-3 py-1.5 focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="FOOD">Food</option>
            <option value="MEDICINE">Medicine</option>
            <option value="PERSONAL CARE">Personal Care</option>
            <option value="SANITARY PRODUCTS">Sanitary Products</option>
            <option value="CLEANING PRODUCTS">Cleaning Products</option>
            <option value="GROCERIES">Groceries</option>
            <option value="BABY PRODUCTS">Baby Products</option>
            <option value="OTHER">Other</option>
          </select>

          {/* Storage Location Filter */}
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="bg-gray-900 border border-gray-800 text-gray-200 rounded-xl px-3 py-1.5 focus:outline-none"
          >
            <option value="ALL">All Storage Locations</option>
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

          {/* Status Filter */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-gray-900 border border-gray-800 text-gray-200 rounded-xl px-3 py-1.5 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="SAFE">Safe (&gt; 30d)</option>
            <option value="EXPIRING_SOON">Expiring Soon (8-30d)</option>
            <option value="URGENT">Urgent (1-7d)</option>
            <option value="EXPIRES_TODAY">Expires Today</option>
            <option value="EXPIRED">Expired</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-900 border border-gray-800 text-gray-200 rounded-xl px-3 py-1.5 focus:outline-none ml-auto"
          >
            <option value="expiryDate">Sort: Earliest Expiry</option>
            <option value="newest">Sort: Recently Added</option>
            <option value="name">Sort: Product Name</option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <LoadingSkeleton />
      ) : products.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-4 border border-gray-800">
          <Package className="w-12 h-12 text-gray-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Products Found</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            No items matched your search query or filter criteria. Try resetting filters or scan a new product.
          </p>
          <Link
            to="/scan"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/30"
          >
            Scan Product Now
          </Link>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onMarkUsed={handleMarkUsed}
              onDelete={(id) => setDeleteId(id)}
            />
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="glass-panel rounded-3xl overflow-hidden border border-gray-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-900/80 text-gray-400 font-semibold border-b border-gray-800 uppercase tracking-wider">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Expiry Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 text-gray-200">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-900/40 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <img src={p.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80'} alt="" className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <Link to={`/products/${p._id}`} className="font-bold text-white hover:text-emerald-400">{p.productName}</Link>
                        <p className="text-[11px] text-gray-400">{p.brand} • {p.quantity} {p.unit}</p>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-gray-300">{p.category}</td>
                    <td className="p-4 text-gray-300">{p.storageLocation}</td>
                    <td className="p-4 font-medium">{new Date(p.expiryDate).toLocaleDateString()}</td>
                    <td className="p-4">
                      <ExpiryBadge status={p.status} remainingDays={p.remainingDays} />
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleMarkUsed(p._id)}
                        className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
                        title="Mark Used"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                      </button>
                      <Link
                        to={`/products/${p._id}/edit`}
                        className="p-1.5 rounded-lg bg-gray-800 text-gray-300 hover:text-white"
                        title="Edit"
                      >
                        <Edit className="w-3.5 h-3.5 inline" />
                      </Link>
                      <button
                        onClick={() => setDeleteId(p._id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
