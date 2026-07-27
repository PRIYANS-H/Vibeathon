import React, { useEffect } from 'react';
import { CheckCircle2, X, Clock, Zap } from 'lucide-react';

/**
 * Toast notification — shown briefly after order placement.
 * Props: { toast, onDismiss }
 * toast shape: { visible, orderId, eta, tableName }
 */
export const Toast = ({ toast, onDismiss }) => {
  useEffect(() => {
    if (!toast?.visible) return;
    const timer = setTimeout(onDismiss, 4500);
    return () => clearTimeout(timer);
  }, [toast?.visible]);

  if (!toast?.visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] w-full max-w-sm px-4">
      <div className="bg-slate-900 border border-emerald-500/50 rounded-2xl shadow-2xl shadow-emerald-500/10 p-4 flex items-start gap-3 animate-in slide-in-from-bottom-4">
        {/* Icon */}
        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-500/30">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="font-bold text-sm text-white font-display">Order Confirmed! 🎉</p>
            <button
              onClick={onDismiss}
              className="text-slate-500 hover:text-slate-300 shrink-0 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            <span className="font-mono font-bold text-indigo-300">{toast.orderId}</span> sent to kitchen for{' '}
            <span className="font-semibold text-white">{toast.tableName}</span>
          </p>
          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
              <Clock className="w-3 h-3" />
              ~{toast.eta} mins ETA
            </span>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-indigo-400">
              <Zap className="w-3 h-3" />
              Heuristic ETA Model
            </span>
          </div>
          {/* Auto-dismiss progress bar */}
          <div className="mt-2 h-0.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{
                animation: 'shrink-width 4.5s linear forwards'
              }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shrink-width {
          from { width: 100%; }
          to { width: 0%; }
        }
        @keyframes slide-in-from-bottom-4 {
          from { transform: translateY(16px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-in { animation: slide-in-from-bottom-4 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};
