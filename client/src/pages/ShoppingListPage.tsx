import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Sparkles, Check, Trash2, CheckCircle2 } from 'lucide-react';
import { api, ShoppingItem } from '../services/api';
import { Toast } from '../components/Toast';

export const ShoppingListPage: React.FC = () => {
  const [sections, setSections] = useState<{
    suggestedItems: ShoppingItem[];
    manualItems: ShoppingItem[];
    purchasedItems: ShoppingItem[];
  }>({ suggestedItems: [], manualItems: [], purchasedItems: [] });

  const [newItemName, setNewItemName] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchShoppingList();
  }, []);

  const fetchShoppingList = async () => {
    setLoading(true);
    try {
      const res = await api.get('/shopping-list');
      if (res.data.success) {
        setSections(res.data.sections);
      }
    } catch {
      console.warn('Shopping list fetch error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    try {
      const res = await api.post('/shopping-list', { itemName: newItemName.trim(), quantity: 1 });
      if (res.data.success) {
        setNewItemName('');
        setToast({ message: 'Item added to shopping list!', type: 'success' });
        fetchShoppingList();
      }
    } catch {
      setToast({ message: 'Error adding item.', type: 'error' });
    }
  };

  const handleToggleStatus = async (item: ShoppingItem) => {
    const nextStatus = item.status === 'PENDING' ? 'PURCHASED' : 'PENDING';
    try {
      await api.put(`/shopping-list/${item._id}`, { status: nextStatus });
      fetchShoppingList();
    } catch {
      setToast({ message: 'Error updating item status.', type: 'error' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/shopping-list/${id}`);
      fetchShoppingList();
    } catch {
      setToast({ message: 'Error removing item.', type: 'error' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
            <ShoppingCart className="w-7 h-7 text-emerald-400" /> Smart Shopping List
          </h1>
          <p className="text-xs text-gray-400 mt-1">Manage replenishments and review AI automated suggestions</p>
        </div>
      </div>

      {/* Manual Input Form */}
      <form onSubmit={handleAddItem} className="glass-panel p-4 rounded-2xl border border-gray-800 flex gap-2">
        <input
          type="text"
          placeholder="Add manual item (e.g. Milk 2L)..."
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          className="flex-1 glass-input rounded-xl px-4 py-2 text-sm text-gray-200 focus:outline-none"
        />
        <button
          type="submit"
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white font-bold text-xs shadow-lg shadow-emerald-600/30"
        >
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </form>

      {/* Section 1: AI Suggested Items */}
      {sections.suggestedItems.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> AI Replenishment Suggestions ({sections.suggestedItems.length})
          </h3>
          <div className="space-y-2">
            {sections.suggestedItems.map((item) => (
              <div key={item._id} className="p-3.5 rounded-2xl glass-panel border border-emerald-500/30 bg-emerald-950/20 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    {item.itemName} <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">Suggested by AI</span>
                  </h4>
                  <p className="text-xs text-gray-400 mt-0.5">{item.reason || 'Item depleted or expired'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleStatus(item)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-semibold hover:bg-emerald-500/30"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve & Mark Bought
                  </button>
                  <button onClick={() => handleDelete(item._id)} className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 2: Manual Pending Items */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Manual Shopping Items ({sections.manualItems.length})</h3>
        {sections.manualItems.length === 0 ? (
          <div className="glass-panel p-6 rounded-2xl text-center text-xs text-gray-400 border border-gray-800">
            No pending manual items in list.
          </div>
        ) : (
          <div className="space-y-2">
            {sections.manualItems.map((item) => (
              <div key={item._id} className="p-3.5 rounded-2xl glass-panel border border-gray-800 flex items-center justify-between">
                <span className="font-semibold text-sm text-white">{item.itemName} ({item.quantity} {item.unit})</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleStatus(item)}
                    className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                    title="Mark Purchased"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(item._id)} className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 3: Purchased Checklist */}
      {sections.purchasedItems.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-gray-800/80">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Purchased Items ({sections.purchasedItems.length})</h3>
          <div className="space-y-2">
            {sections.purchasedItems.map((item) => (
              <div key={item._id} className="p-3 rounded-2xl glass-card border border-gray-800 opacity-60 flex items-center justify-between line-through text-xs text-gray-400">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {item.itemName}
                </span>
                <button onClick={() => handleDelete(item._id)} className="p-1.5 hover:text-rose-400">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
