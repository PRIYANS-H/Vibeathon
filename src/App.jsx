import React, { useState, useEffect } from 'react';
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
import { Toast } from './components/Toast';
import { BillingModal } from './components/BillingModal';
import { CommandPalette } from './components/CommandPalette';
import { TableQRModal } from './components/TableQRModal';

const MainContent = () => {
  const {
    currentRole,
    toast, dismissToast,
    billingOrderId, closeBilling
  } = useApp();

  const [logsOpen, setLogsOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);

  useEffect(() => {
    const handleQREvent = () => setQrOpen(true);
    window.addEventListener('open-qr-modal', handleQREvent);
    return () => window.removeEventListener('open-qr-modal', handleQREvent);
  }, []);

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

      {/* Footer — Operational Thesis Branding */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left space-y-1">
            <p className="text-white font-bold font-display">AuraResto OS · Platinum Tier Submission</p>
            <p className="text-slate-400 text-[11px]">
              "Reducing wait times & food wastage through AI-assisted restaurant operations."
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            <button
              onClick={() => setCmdOpen(true)}
              className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-mono transition-colors"
            >
              <kbd className="text-indigo-400">Ctrl + K</kbd> Command Palette
            </button>
            <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono">FastAPI</span>
            <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono">Supabase Realtime</span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono">Gemini 1.5 Flash</span>
          </div>
        </div>
      </footer>

      {/* Global Overlays, Drawers & Modals */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <RealtimeLogDrawer isOpen={logsOpen} onClose={() => setLogsOpen(false)} />
      <AuthModal />
      <AICaptainModal />
      <FeedbackModal />
      <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} onOpenQRModal={() => setQrOpen(true)} />
      <TableQRModal isOpen={qrOpen} onClose={() => setQrOpen(false)} />

      {/* Billing modal */}
      {billingOrderId && (
        <BillingModal orderId={billingOrderId} onClose={closeBilling} />
      )}

      {/* Confirmation toast */}
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
