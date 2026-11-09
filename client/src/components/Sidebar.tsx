import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Camera,
  Package,
  Tags,
  AlertTriangle,
  Bell,
  ShoppingCart,
  BarChart3,
  Bot,
  Settings,
  Sparkles,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { logout } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Scan Product', path: '/scan', icon: Camera, highlight: true },
    { label: 'Inventory', path: '/inventory', icon: Package },
    { label: 'Categories', path: '/categories', icon: Tags },
    { label: 'Expiry Alerts', path: '/expiry-alerts', icon: AlertTriangle },
    { label: 'Notifications', path: '/notifications', icon: Bell },
    { label: 'Shopping List', path: '/shopping-list', icon: ShoppingCart },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'AI Assistant', path: '/chat', icon: Bot },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0b0f19] border-r border-gray-800/80 hidden md:flex flex-col justify-between h-screen sticky top-0 z-40 p-4">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-3 py-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
              SmartShelf <span className="text-emerald-400 text-xs px-1.5 py-0.5 rounded bg-emerald-950/90 border border-emerald-800/60 font-mono">AI</span>
            </h1>
            <p className="text-[10px] text-gray-400 font-medium">Agentic Expiry Management</p>
          </div>
        </div>

        {/* Navigation Menu Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-400 border border-emerald-500/30 shadow-md shadow-emerald-950/50'
                      : item.highlight
                      ? 'text-emerald-300 hover:bg-emerald-950/40 hover:text-emerald-200'
                      : 'text-gray-400 hover:bg-gray-800/60 hover:text-gray-200'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom User / Quick Action */}
      <div className="pt-4 border-t border-gray-800/80">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-rose-500/10 hover:text-rose-400 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
