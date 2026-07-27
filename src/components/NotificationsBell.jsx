import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, ShoppingBag, Package, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

const TYPE_CONFIG = {
  order:   { Icon: ShoppingBag,  color: 'text-indigo-400',  bg: 'bg-indigo-500/10',  border: 'border-indigo-500/25' },
  ready:   { Icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/25' },
  stock:   { Icon: AlertTriangle,color: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/25'  },
  billing: { Icon: CheckCircle2, color: 'text-purple-400',  bg: 'bg-purple-500/10',  border: 'border-purple-500/25' },
  info:    { Icon: Info,         color: 'text-sky-400',     bg: 'bg-sky-500/10',     border: 'border-sky-500/25'    },
};

export const NotificationsBell = () => {
  const { notifications, markAllNotificationsRead } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleOpen = () => {
    setOpen(o => !o);
    if (!open) setTimeout(markAllNotificationsRead, 1500);
  };

  return (
    <div className="relative" ref={ref}>
      {/* Bell Button */}
      <button
        onClick={handleOpen}
        className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all"
        title="Notifications"
        id="notifications-bell-btn"
      >
        <Bell className={`w-4 h-4 ${unreadCount > 0 ? 'text-amber-400' : 'text-slate-400'}`} />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-slate-950 tabular-nums">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/60">
            <div>
              <h4 className="text-sm font-bold font-display text-white">Notifications</h4>
              <p className="text-[10px] text-slate-500">{unreadCount} unread</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Notification list */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/50">
            {notifications.length === 0 && (
              <div className="py-10 text-center text-slate-600 text-xs">No notifications yet</div>
            )}
            {notifications.map(n => {
              const config = TYPE_CONFIG[n.type] || TYPE_CONFIG.info;
              const Icon = config.Icon;
              return (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 px-4 py-3 transition-colors ${!n.read ? 'bg-slate-800/30' : 'hover:bg-slate-800/20'}`}
                >
                  {/* Icon */}
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${config.bg} border ${config.border}`}>
                    <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-xs font-bold leading-tight ${!n.read ? 'text-white' : 'text-slate-300'}`}>
                        {n.title}
                      </p>
                      {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">{n.message}</p>
                    <p className="text-[10px] text-slate-600 font-mono">{n.time}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          {unreadCount > 0 && (
            <div className="border-t border-slate-800 px-4 py-2.5 bg-slate-950/40">
              <button
                onClick={markAllNotificationsRead}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
              >
                Mark all as read
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
