import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { CustomerView } from './components/CustomerView';
import { KitchenView } from './components/KitchenView';
import { FloorStaffView } from './components/FloorStaffView';
import { AdminDashboard } from './components/AdminDashboard';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';
import { AICaptainModal } from './components/AICaptainModal';
import { FeedbackModal } from './components/FeedbackModal';
import { RealtimeLogDrawer } from './components/RealtimeLogDrawer';
import { Toast } from './components/Toast';           // FIX 1.4
import { BillingModal } from './components/BillingModal'; // FIX 1.1

const MainContent = () => {
  const {
    currentRole,
    toast, dismissToast,       // FIX 1.4
    billingOrderId, closeBilling // FIX 1.1
  } = useApp();

  const [logsOpen, setLogsOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">

      {/* Global Sticky Header */}
      <Header
        onOpenLogs={() => setLogsOpen(true)}
        onOpenCart={() => setCartOpen(true)}
      />

      {/* Role-based Main View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        {currentRole === 'customer' && <CustomerView onOpenCart={() => setCartOpen(true)} />}
        {currentRole === 'kitchen'  && <KitchenView />}
        {currentRole === 'staff'    && <FloorStaffView />}
        {currentRole === 'admin'    && <AdminDashboard />}
      </main>

      {/* Footer — 4.4 Team Branding */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left space-y-1">
            <p className="text-white font-bold font-display">AuraResto OS · Platinum Tier Submission</p>
            <p className="text-slate-500 text-[11px]">VibeAthon 6.0 (2K26) · Built by Team Antigravity Innovators</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono">FastAPI</span>
            <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono">Supabase Realtime</span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono">Gemini 1.5 Flash</span>
            <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">Tailwind v4</span>
          </div>
        </div>
      </footer>

      {/* Global Overlays, Drawers & Modals */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <RealtimeLogDrawer isOpen={logsOpen} onClose={() => setLogsOpen(false)} />
      <AuthModal />
      <AICaptainModal />
      <FeedbackModal />

      {/* FIX 1.1 — Billing modal, triggered from KitchenView "Generate Bill" */}
      {billingOrderId && (
        <BillingModal orderId={billingOrderId} onClose={closeBilling} />
      )}

      {/* FIX 1.4 — Order confirmation toast */}
      <Toast toast={toast} onDismiss={dismissToast} />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
