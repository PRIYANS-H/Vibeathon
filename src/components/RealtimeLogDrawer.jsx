import React from 'react';
import { useApp } from '../context/AppContext';
import { Radio, X, ShoppingBag, Package, CheckCircle2, AlertTriangle, Zap, RefreshCw, Info } from 'lucide-react';

// Color map for each event type
const LOG_TYPE_CONFIG = {
  order:     { label: 'ORDER',     bg: 'bg-indigo-500/15', text: 'text-indigo-300',  border: 'border-indigo-500/30', Icon: ShoppingBag },
  inventory: { label: 'INVENTORY', bg: 'bg-amber-500/15',  text: 'text-amber-300',   border: 'border-amber-500/30',  Icon: Package },
  success:   { label: 'SUCCESS',   bg: 'bg-emerald-500/15',text: 'text-emerald-300', border: 'border-emerald-500/30',Icon: CheckCircle2 },
  warning:   { label: 'WARNING',   bg: 'bg-rose-500/15',   text: 'text-rose-300',    border: 'border-rose-500/30',   Icon: AlertTriangle },
  cart:      { label: 'CART',      bg: 'bg-purple-500/15', text: 'text-purple-300',  border: 'border-purple-500/30', Icon: ShoppingBag },
  system:    { label: 'SYSTEM',    bg: 'bg-slate-500/15',  text: 'text-slate-300',   border: 'border-slate-500/30',  Icon: Zap },
  info:      { label: 'INFO',      bg: 'bg-sky-500/15',    text: 'text-sky-300',     border: 'border-sky-500/30',    Icon: Info },
};

export const RealtimeLogDrawer = ({ isOpen, onClose }) => {
  const { realtimeLogs } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex justify-end">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-sm h-full flex flex-col shadow-2xl">

        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Radio className="w-5 h-5 text-emerald-400" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full live-dot" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display text-white">Supabase Realtime Stream</h3>
              <p className="text-[10px] text-slate-500 font-mono">WebSocket Channel · Live</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-950 text-slate-400 hover:text-white border border-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Channel info banner */}
        <div className="px-5 py-3 bg-emerald-950/20 border-b border-emerald-800/30 shrink-0">
          <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full live-dot inline-block" />
            Broadcasting across Customer · Kitchen · Staff · Admin viewports
          </p>
        </div>

        {/* Log Events */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {realtimeLogs.length === 0 && (
            <div className="text-center py-12 text-slate-600 text-xs">
              No events yet. Place an order or adjust stock to see live events.
            </div>
          )}

          {realtimeLogs.map(log => {
            const config = LOG_TYPE_CONFIG[log.type] || LOG_TYPE_CONFIG.info;
            const Icon = config.Icon;

            return (
              <div
                key={log.id}
                className={`rounded-2xl border p-3 space-y-1.5 ${config.bg} ${config.border}`}
              >
                {/* Type badge + timestamp */}
                <div className="flex items-center justify-between">
                  <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${config.text}`}>
                    <Icon className="w-3 h-3" />
                    {config.label}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{log.timestamp}</span>
                </div>

                {/* Message */}
                <p className="text-xs text-slate-200 font-mono leading-relaxed">{log.message}</p>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
