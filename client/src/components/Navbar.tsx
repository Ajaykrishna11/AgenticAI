import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate as useRouterNavigate } from 'react-router-dom';
import { Camera, Bell, Search, LogOut, User, Sparkles, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api, NotificationItem } from '../services/api';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useRouterNavigate();
  const [unreadNotifications, setUnreadNotifications] = useState<NotificationItem[]>([]);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications?status=unread');
      if (res.data.success) {
        setUnreadNotifications(res.data.notifications || []);
      }
    } catch {
      // Ignore if server unready
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/inventory?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#0b0f19]/80 backdrop-blur-md border-b border-gray-800/80 px-4 lg:px-8 py-3.5 flex items-center justify-between">
      {/* Search Input */}
      <form onSubmit={handleSearch} className="relative flex-1 max-w-md hidden sm:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search products, categories, or storage..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-gray-900/90 border border-gray-700/60 rounded-full pl-9 pr-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all"
        />
      </form>

      {/* Brand logo for mobile view when sidebar is hidden */}
      <div className="flex items-center gap-2 md:hidden">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <span className="font-extrabold text-lg text-white tracking-tight">SmartShelf <span className="text-emerald-400 font-mono text-xs px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/50">AI</span></span>
      </div>

      {/* Action Buttons & Profile */}
      <div className="flex items-center gap-3">
        {/* Quick Scan CTA Button */}
        <RouterLink
          to="/scan"
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-medium text-sm px-3.5 py-2 rounded-xl shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Camera className="w-4 h-4" />
          <span className="hidden sm:inline">Scan Product</span>
        </RouterLink>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-xl bg-gray-900/80 border border-gray-800 text-gray-300 hover:text-white hover:border-gray-700 transition-all"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center shadow-md shadow-rose-500/30 animate-pulse">
                {unreadNotifications.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-panel rounded-2xl border border-gray-800 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-3">
                <h4 className="font-semibold text-sm text-white flex items-center gap-2">
                  <Bell className="w-4 h-4 text-emerald-400" /> Notifications
                </h4>
                <RouterLink
                  to="/notifications"
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-emerald-400 hover:underline"
                >
                  View All
                </RouterLink>
              </div>

              {unreadNotifications.length === 0 ? (
                <div className="text-center py-6 text-gray-400 text-xs">
                  <Check className="w-6 h-6 text-emerald-400 mx-auto mb-2 opacity-60" />
                  No unread expiry alerts!
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {unreadNotifications.slice(0, 4).map((notif) => (
                    <div key={notif._id} className="p-2.5 rounded-xl bg-gray-900/60 border border-gray-800/80 text-xs">
                      <p className="font-medium text-gray-200">{notif.title}</p>
                      <p className="text-gray-400 text-[11px] mt-0.5">{notif.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Avatar Menu */}
        <div className="flex items-center gap-3 pl-2 border-l border-gray-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-white font-bold text-xs shadow-md">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-gray-200 leading-none">{user?.name || 'User'}</p>
            <p className="text-[10px] text-gray-400 mt-0.5 leading-none">{user?.email || 'user@smartshelf.ai'}</p>
          </div>
          <button
            onClick={logout}
            title="Logout"
            className="p-2 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
