import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ShoppingBag,
  MapPin,
  Sparkles,
  X,
  CreditCard,
  Zap
} from 'lucide-react';

export const CartDrawer = ({ isOpen, onClose }) => {
  const {
    cart,
    updateCartQuantity,
    clearCart,
    placeOrder,
    selectedTable,
    setSelectedTable,
    tables,
    menu,
    addToCart
  } = useApp();

  if (!isOpen) return null;

  const totalAmount = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  const tax = Math.round(totalAmount * 0.05);
  const finalTotal = totalAmount + tax;

  // Upsell recommendations (items not in cart)
  const upsellItems = menu
    .filter(m => m.is_available_computed && !cart.some(c => c.id === m.id))
    .slice(0, 2);

  // FIX 1.4: confetti removed — Toast in App.jsx handles the confirmation UX
  const handleCheckout = () => {
    const newOrd = placeOrder();
    if (newOrd) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex justify-end">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full flex flex-col shadow-2xl p-6 space-y-6 overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-indigo-400" />
            <h3 className="text-xl font-bold font-display text-white">Your Order Summary</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-slate-950 text-slate-400 hover:text-white border border-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Table Selector */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              Assigned Table
            </span>
            <span className="text-indigo-400 font-semibold">{tables.find(t=>t.id===selectedTable)?.number}</span>
          </div>
          <select
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value)}
            className="w-full bg-slate-900 text-white font-bold text-xs p-2 rounded-xl border border-slate-700"
          >
            {tables.map(t => (
              <option key={t.id} value={t.id}>{t.number} ({t.capacity} Seats)</option>
            ))}
          </select>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 space-y-3 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="text-center py-12 text-slate-500 space-y-2">
              <ShoppingBag className="w-12 h-12 mx-auto opacity-30" />
              <p className="text-sm font-semibold">Your cart is currently empty</p>
              <p className="text-xs text-slate-600">Select delicious dishes from our digital menu!</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <h4 className="font-bold text-sm text-white">{item.name}</h4>
                  <span className="font-mono text-xs text-indigo-400 font-bold">₹{item.price * item.quantity}</span>
                </div>

                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-1">
                  <button
                    onClick={() => updateCartQuantity(item.id, -1)}
                    className="w-6 h-6 rounded-lg bg-slate-800 text-white font-bold text-xs hover:bg-slate-700"
                  >
                    -
                  </button>
                  <span className="font-mono text-xs font-bold text-white px-1">{item.quantity}</span>
                  <button
                    onClick={() => updateCartQuantity(item.id, 1)}
                    className="w-6 h-6 rounded-lg bg-slate-800 text-white font-bold text-xs hover:bg-slate-700"
                  >
                    +
                  </button>
                </div>
              </div>
            ))
          )}

          {/* Upsell / Recommendation Module */}
          {cart.length > 0 && upsellItems.length > 0 && (
            <div className="bg-gradient-to-br from-purple-950/40 to-slate-950 border border-purple-800/40 p-4 rounded-2xl space-y-3 pt-4 mt-6">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Frequently Ordered Together</span>
              </div>
              <div className="space-y-2">
                {upsellItems.map(up => (
                  <div key={up.id} className="flex items-center justify-between bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-xs">
                    <span className="font-semibold text-slate-200">{up.name} (₹{up.price})</span>
                    <button
                      onClick={() => addToCart(up, 1)}
                      className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-[10px]"
                    >
                      + Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bill Breakdown & Checkout */}
        {cart.length > 0 && (
          <div className="border-t border-slate-800 pt-4 space-y-4">
            <div className="space-y-1.5 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-slate-200">₹{totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (5%)</span>
                <span className="font-mono text-slate-200">₹{tax}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
                <span>Total Payable</span>
                <span className="font-mono text-emerald-400 text-lg">₹{finalTotal}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 hover:opacity-95 transition-all"
            >
              <CreditCard className="w-4 h-4" />
              <span>Confirm Order & Send to Kitchen</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
