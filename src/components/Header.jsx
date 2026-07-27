import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Utensils,
  ChefHat,
  LayoutDashboard,
  Users,
  ShoppingBag,
  Sparkles,
  Zap,
  UserCheck,
  Radio
} from 'lucide-react';
import { NotificationsBell } from './NotificationsBell';
import { DemoRunner } from './DemoRunner';

export const Header = ({ onOpenLogs, onOpenCart }) => {
  const {
    currentRole,
    setCurrentRole,
    user,
    cart,
    setAuthModalOpen,
    setAiCaptainOpen,
    realtimeLogs
  } = useApp();

  const totalCartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  const roles = [
    { id: 'customer', label: 'Customer View', icon: Utensils, badge: 'Digital Menu & AI' },
    { id: 'kitchen', label: 'Kitchen SLA', icon: ChefHat, badge: 'Live SLA Balancer' },
    { id: 'staff', label: 'Floor Staff', icon: Users, badge: 'Table Operations' },
    { id: 'admin', label: 'Admin Ops', icon: LayoutDashboard, badge: 'Analytics & Stock' }
  ];

  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-slate-800 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Platform Tag */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Zap className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-display tracking-tight text-white">
                AuraResto <span className="gradient-text">OS</span>
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Platinum v6.0
              </span>
            </div>
            <p className="text-xs text-slate-400">Operationally Intelligent Restaurant System</p>
          </div>
        </div>

        {/* Role Navigation Bar (Judge / Tester Role Switcher) */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800/80 shadow-inner overflow-x-auto max-w-full">
          {roles.map(r => {
            const Icon = r.icon;
            const isActive = currentRole === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setCurrentRole(r.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold scale-[1.02]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>

        {/* Action Controls & AI Captain Button */}
        <div className="flex items-center gap-2">

          {/* 4.1 Demo Runner Button */}
          <DemoRunner />
          
          {/* AI Captain trigger */}
          <button
            onClick={() => setAiCaptainOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600/20 to-indigo-600/20 hover:from-purple-600/40 hover:to-indigo-600/40 border border-purple-500/40 text-purple-300 text-xs font-semibold transition-all shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-purple-400 animate-spin-slow" />
            <span className="hidden sm:inline">AI Captain</span>
          </button>

          {/* 3.1 Notifications Bell */}
          <NotificationsBell />

          {/* Realtime Stream Logs toggle */}
          <button
            onClick={onOpenLogs}
            className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all"
            title="Supabase Realtime Stream Logs"
          >
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-950"></span>
          </button>

          {/* Customer Cart button (shown when in Customer View) */}
          {currentRole === 'customer' && (
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/25"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {totalCartCount > 0 && (
                <span className="px-1.5 py-0.5 bg-white text-indigo-700 rounded-full font-bold text-[11px]">
                  {totalCartCount}
                </span>
              )}
            </button>
          )}

          {/* Auth Profile Button — FIX 1.3: shows live user name + role */}
          <button
            onClick={() => setAuthModalOpen(true)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 text-slate-300 transition-all text-xs group"
            title="Switch User / Role"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-6 h-6 rounded-full object-cover border border-slate-700 group-hover:border-indigo-500/50 transition-all"
            />
            <div className="hidden lg:block text-left">
              <p className="text-[11px] font-bold text-white leading-none">{user.name.split(' ')[0]}</p>
              <span className={`text-[9px] font-bold uppercase tracking-wider mt-0.5 block ${
                user.role === 'admin' ? 'text-purple-400' :
                user.role === 'kitchen' ? 'text-amber-400' :
                user.role === 'staff' ? 'text-blue-400' :
                'text-emerald-400'
              }`}>
                {user.role}
              </span>
            </div>
          </button>

        </div>

      </div>
    </header>
  );
};
