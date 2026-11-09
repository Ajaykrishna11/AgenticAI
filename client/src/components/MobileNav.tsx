import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Camera, Package, AlertTriangle, Bot } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const items = [
    { label: 'Home', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Inventory', path: '/inventory', icon: Package },
    { label: 'Scan', path: '/scan', icon: Camera, special: true },
    { label: 'Alerts', path: '/expiry-alerts', icon: AlertTriangle },
    { label: 'AI Chat', path: '/chat', icon: Bot },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0b0f19]/95 backdrop-blur-md border-t border-gray-800 px-2 py-2 flex items-center justify-around">
      {items.map((item) => {
        const Icon = item.icon;
        if (item.special) {
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="relative -top-4 w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/40 hover:scale-105 transition-all"
            >
              <Icon className="w-6 h-6" />
            </NavLink>
          );
        }

        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-[10px] font-medium py-1 px-3 rounded-lg transition-all ${
                isActive ? 'text-emerald-400' : 'text-gray-400 hover:text-gray-200'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </div>
  );
};
