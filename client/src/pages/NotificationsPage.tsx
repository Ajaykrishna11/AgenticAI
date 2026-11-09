import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { api, NotificationItem } from '../services/api';
import { Toast } from '../components/Toast';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'high'>('all');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/notifications?status=${filter}`);
      if (res.data.success) {
        setNotifications(res.data.notifications || []);
      }
    } catch {
      console.warn('Notification fetch error');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`);
      fetchNotifications();
    } catch {
      setToast({ message: 'Error updating notification.', type: 'error' });
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setToast({ message: 'All notifications marked as read.', type: 'success' });
      fetchNotifications();
    } catch {
      setToast({ message: 'Error updating notifications.', type: 'error' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/notifications/${id}`);
      fetchNotifications();
    } catch {
      setToast({ message: 'Error deleting notification.', type: 'error' });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
            <Bell className="w-7 h-7 text-emerald-400" /> Notification Center
          </h1>
          <p className="text-xs text-gray-400 mt-1">Expiry alerts and system automated messages</p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold text-xs border border-gray-700 transition-all"
        >
          <Check className="w-4 h-4 text-emerald-400" /> Mark All as Read
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-800 pb-3">
        {(['all', 'unread', 'high'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
              filter === tab ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Notification List */}
      {loading ? (
        <div className="p-8 text-center text-gray-400 text-xs">Loading notifications...</div>
      ) : notifications.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center text-gray-400 space-y-3 border border-gray-800">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto opacity-70" />
          <p className="font-bold text-white text-base">No Notifications Found</p>
          <p className="text-xs text-gray-400">You are all caught up!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                n.isRead ? 'glass-card border-gray-800/60 opacity-80' : 'glass-panel border-emerald-500/30 bg-emerald-950/10'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl shrink-0 ${n.priority === 'CRITICAL' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'}`}>
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">{n.title}</h4>
                  <p className="text-xs text-gray-300 mt-0.5 leading-relaxed">{n.message}</p>
                  <span className="text-[10px] text-gray-500 mt-2 block">{new Date(n.createdAt).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!n.isRead && (
                  <button
                    onClick={() => handleMarkRead(n._id)}
                    className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    title="Mark Read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(n._id)}
                  className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
