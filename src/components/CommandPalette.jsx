import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Utensils,
  ChefHat,
  Users,
  LayoutDashboard,
  Sparkles,
  Play,
  Radio,
  QrCode,
  X,
  Zap,
  Package,
  Clock
} from 'lucide-react';

export const CommandPalette = ({ isOpen, onClose, onOpenQRModal }) => {
  const {
    setCurrentRole,
    setAiCaptainOpen,
    setFeedbackModalOpen,
    pushRealtimeLog
  } = useApp();

  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    {
      id: 'nav-customer',
      title: 'Customer Ordering View',
      subtitle: 'Browse digital menu, live stock & track order ETA',
      icon: Utensils,
      category: 'Navigation',
      action: () => { setCurrentRole('customer'); onClose(); }
    },
    {
      id: 'nav-kitchen',
      title: 'Kitchen SLA & Kanban Board',
      subtitle: 'View live cooking tickets, SLA timers & station load',
      icon: ChefHat,
      category: 'Navigation',
      action: () => { setCurrentRole('kitchen'); onClose(); }
    },
    {
      id: 'nav-staff',
      title: 'Floor Staff & Table Layout',
      subtitle: 'Manage dining room map, seat walk-ins & reservations',
      icon: Users,
      category: 'Navigation',
      action: () => { setCurrentRole('staff'); onClose(); }
    },
    {
      id: 'nav-admin',
      title: 'Admin & Operations Manager',
      subtitle: 'Sales telemetry, auto-inventory thresholds & demand forecast',
      icon: LayoutDashboard,
      category: 'Navigation',
      action: () => { setCurrentRole('admin'); onClose(); }
    },
    {
      id: 'action-ai',
      title: 'Ask AI Manager & Kitchen Copilot',
      subtitle: 'Query operational bottlenecks, wastage & inventory reorder advice',
      icon: Sparkles,
      category: 'Operational Tools',
      action: () => { setAiCaptainOpen(true); onClose(); }
    },
    {
      id: 'action-qr',
      title: 'Simulate Table QR Code Scan',
      subtitle: 'Scan table QR code to start seated dining workflow',
      icon: QrCode,
      category: 'Operational Tools',
      action: () => { onOpenQRModal(); onClose(); }
    },
    {
      id: 'action-demo',
      title: 'Run 10-Second Judge Walkthrough',
      subtitle: 'Automated script demonstrating stockout → ETA → Kitchen SLA → Served',
      icon: Play,
      category: 'Demo Short-cuts',
      action: () => {
        const btn = document.getElementById('run-demo-btn');
        if (btn) btn.click();
        onClose();
      }
    }
  ];

  const filtered = actions.filter(a =>
    a.title.toLowerCase().includes(query.toLowerCase()) ||
    a.subtitle.toLowerCase().includes(query.toLowerCase()) ||
    a.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-20 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Search input bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-indigo-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command or view name... (Ctrl + K)"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white border border-slate-700 text-xs font-mono"
          >
            ESC
          </button>
        </div>

        {/* Action list */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-1">
          {filtered.length === 0 && (
            <div className="py-8 text-center text-slate-500 text-xs">No matching commands found</div>
          )}
          {filtered.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={item.action}
                className="w-full text-left p-3 rounded-2xl hover:bg-slate-800/60 border border-transparent hover:border-slate-700/60 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      {item.title}
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-mono">
                        {item.category}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">{item.subtitle}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer tip */}
        <div className="px-4 py-2.5 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <span>Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300">Ctrl + K</kbd> to toggle anytime</span>
          <span>AuraResto OS Operations Hub</span>
        </div>

      </div>
    </div>
  );
};
