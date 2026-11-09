import React, { useState, useEffect } from 'react';
import { Tags, MapPin, Plus, Sparkles, Folder } from 'lucide-react';
import { api } from '../services/api';
import { Toast } from '../components/Toast';

export const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [newLocation, setNewLocation] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const catRes = await api.get('/categories');
      if (catRes.data.success) setCategories(catRes.data.categories || []);

      const locRes = await api.get('/categories/locations');
      if (locRes.data.success) setLocations(locRes.data.storageLocations || []);
    } catch {
      console.warn('Categories fetch error');
    }
  };

  const handleAddLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocation.trim()) return;

    try {
      const res = await api.post('/categories/locations', { name: newLocation.trim() });
      if (res.data.success) {
        setNewLocation('');
        setToast({ message: 'Custom location added!', type: 'success' });
        fetchData();
      }
    } catch {
      setToast({ message: 'Error adding location.', type: 'error' });
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
          <Tags className="w-7 h-7 text-emerald-400" /> Product Categories & Storage Locations
        </h1>
        <p className="text-xs text-gray-400 mt-1">Classification rules and household storage spaces</p>
      </div>

      {/* Categories Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Folder className="w-5 h-5 text-emerald-400" /> Supported Product Categories & Subcategories
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((c, i) => (
            <div key={i} className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-white">{c.name}</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono">
                  {c.recommendedLocation}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-800/60">
                {c.subcategories?.map((sub: string, sIdx: number) => (
                  <span key={sIdx} className="text-[11px] px-2 py-0.5 rounded-md bg-gray-900 text-gray-300 border border-gray-800">
                    {sub}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Storage Locations Manager */}
      <div className="space-y-4 pt-4 border-t border-gray-800">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <MapPin className="w-5 h-5 text-teal-400" /> Household Storage Locations
        </h2>

        {/* Add custom location form */}
        <form onSubmit={handleAddLocation} className="glass-panel p-4 rounded-2xl border border-gray-800 flex gap-2 max-w-md">
          <input
            type="text"
            placeholder="Add new custom location (e.g. Master Bedroom)..."
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
            className="flex-1 glass-input rounded-xl px-4 py-2 text-sm text-gray-200 focus:outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow-lg shadow-emerald-500/30"
          >
            <Plus className="w-4 h-4" />
          </button>
        </form>

        <div className="flex flex-wrap gap-2">
          {locations.map((loc, i) => (
            <span key={i} className="px-3.5 py-2 rounded-xl glass-panel border border-gray-800 text-xs font-semibold text-gray-200 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" /> {loc}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
