import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Receipt,
  X,
  Printer,
  CheckCircle2,
  CreditCard,
  Smartphone,
  Banknote,
  Star,
  Clock,
  MapPin
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const BillingModal = ({ orderId, onClose }) => {
  const { orders, updateOrderStatus, setFeedbackModalOpen } = useApp();

  const order = orders.find(o => o.id === orderId);
  if (!order) return null;

  const subtotal = order.total_amount;
  const gst = Math.round(subtotal * 0.05);
  const serviceCharge = Math.round(subtotal * 0.02);
  const grandTotal = subtotal + gst + serviceCharge;

  const handleMarkPaid = (method) => {
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    updateOrderStatus(order.id, 'billed');
    onClose();
    // Open feedback after billing
    setTimeout(() => setFeedbackModalOpen(true), 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-950 to-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
              <Receipt className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="font-bold font-display text-white text-base">Tax Invoice</h3>
              <p className="text-[11px] text-slate-400 font-mono">{order.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-all border border-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">

          {/* Restaurant & Table Info */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-semibold text-white">{order.table_number}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          {/* Order Items Breakdown */}
          <div className="space-y-2">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Items Ordered</p>
            <div className="divide-y divide-slate-800/70 rounded-2xl overflow-hidden border border-slate-800">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-2.5 bg-slate-950/60 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-indigo-400 font-bold">×{item.quantity}</span>
                    <span className="font-semibold text-slate-200">{item.name}</span>
                  </div>
                  <span className="font-mono font-bold text-white">₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bill Summary */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Subtotal</span>
              <span className="font-mono text-slate-200">₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>GST @ 5%</span>
              <span className="font-mono text-slate-200">₹{gst.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>Service Charge @ 2%</span>
              <span className="font-mono text-slate-200">₹{serviceCharge.toLocaleString()}</span>
            </div>
            <div className="border-t border-slate-800 pt-2 mt-2 flex justify-between items-center">
              <span className="font-bold text-sm text-white">Grand Total</span>
              <span className="font-mono font-bold text-xl text-emerald-400">₹{grandTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* Customer name */}
          <div className="text-xs text-slate-500 text-center">
            Billed to: <span className="text-slate-300 font-semibold">{order.customer_name}</span>
          </div>

          {/* Payment Options */}
          <div className="space-y-2">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Select Payment Method</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Card', icon: CreditCard, color: 'indigo' },
                { label: 'UPI', icon: Smartphone, color: 'purple' },
                { label: 'Cash', icon: Banknote, color: 'emerald' }
              ].map(({ label, icon: Icon, color }) => (
                <button
                  key={label}
                  onClick={() => handleMarkPaid(label)}
                  className={`flex flex-col items-center gap-2 py-3 rounded-2xl border font-bold text-xs transition-all active:scale-95
                    ${color === 'indigo' ? 'bg-indigo-950/40 border-indigo-500/40 text-indigo-300 hover:bg-indigo-950/70' :
                    color === 'purple' ? 'bg-purple-950/40 border-purple-500/40 text-purple-300 hover:bg-purple-950/70' :
                    'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/70'}`}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Feedback CTA */}
          <div className="flex items-center justify-center gap-2 pt-1 text-xs text-slate-500">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Payment will prompt a feedback form</span>
          </div>

        </div>
      </div>
    </div>
  );
};
