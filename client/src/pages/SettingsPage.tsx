import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Toast } from '../components/Toast';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [noticeDays, setNoticeDays] = useState(7);
  const [emailAlerts, setEmailAlerts] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setToast({ message: 'Settings saved successfully!', type: 'success' });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
          <SettingsIcon className="w-7 h-7 text-emerald-400" /> Account & System Settings
        </h1>
        <p className="text-xs text-gray-400 mt-1">Configure profile details and automated notification thresholds</p>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-gray-800 space-y-6">
        {/* User Account Info */}
        <div className="flex items-center gap-4 pb-6 border-b border-gray-800">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-500/30">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{user?.name || 'Smart User'}</h2>
            <p className="text-xs text-gray-400">{user?.email || 'user@smartshelf.ai'}</p>
            <span className="inline-block mt-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/90 text-emerald-300 border border-emerald-800/60">
              Role: USER (Isolated Household Data)
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Default Expiry Notice Lead Time (Days)</label>
            <input
              type="number"
              min="1"
              max="30"
              value={noticeDays}
              onChange={(e) => setNoticeDays(parseInt(e.target.value, 10) || 7)}
              className="w-full glass-input rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none"
            />
            <p className="text-[11px] text-gray-400 mt-1">Trigger notifications N days before a product reaches expiry.</p>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-900/60 border border-gray-800">
            <div>
              <h4 className="font-bold text-sm text-white">In-App & Email Notifications</h4>
              <p className="text-xs text-gray-400">Receive priority alerts for expiring medicines and food items.</p>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
            />
          </div>

          <div className="pt-4 border-t border-gray-800 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white font-bold text-xs shadow-lg shadow-emerald-600/30"
            >
              <Save className="w-4 h-4" /> Save Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
