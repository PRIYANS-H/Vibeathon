import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Clock,
  CheckCircle2,
  Flame,
  UtensilsCrossed,
  Package,
  Receipt,
  RefreshCw,
  AlertTriangle,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const KitchenView = () => {
  const {
    orders,
    updateOrderStatus,
    ingredients,
    updateIngredientStock,
    openBilling
  } = useApp();

  // Live SLA ticker — re-renders every 5s so bars visually decay during demo
  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 5000);
    return () => clearInterval(interval);
  }, []);

  const activeOrders = orders.filter(o => o.status !== 'billed');

  // Compute SLA elapsed % and status colour
  const getSlaMetrics = (order) => {
    const createdTime = new Date(order.created_at).getTime();
    const now = Date.now();
    const elapsedMins = Math.floor((now - createdTime) / (1000 * 60));
    const targetSla = order.target_sla_mins || 18;
    const progressPercent = Math.min(100, Math.round((elapsedMins / targetSla) * 100));

    let statusColor = 'green';
    if (progressPercent >= 85) statusColor = 'red';
    else if (progressPercent >= 55) statusColor = 'amber';

    return { elapsedMins, targetSla, progressPercent, statusColor };
  };

  const stationStats = [
    { name: 'Grill & Fryer', load: 75, active: activeOrders.filter(o => o.station?.includes('Grill')).length || 2, chef: 'Chef Rajiv' },
    { name: 'Curry & Tandoor', load: 85, active: activeOrders.filter(o => o.station?.includes('Curry')).length || 3, chef: 'Chef Sanjay' },
    { name: 'Biryani Station', load: 35, active: activeOrders.filter(o => o.station?.includes('Biryani')).length || 1, chef: 'Chef Vikram' },
    { name: 'Cold Prep', load: 20, active: 1, chef: 'Sous Chef Neha' }
  ];

  const INITIAL_STOCKS = {
    ing_1: 1200, ing_2: 45, ing_3: 18, ing_4: 2500,
    ing_5: 4000, ing_6: 800, ing_7: 2, ing_8: 1500, ing_9: 900, ing_10: 10
  };

  const refillIngredient = (ingId) => {
    updateIngredientStock(ingId, INITIAL_STOCKS[ingId] || 1000);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner & Station Load Balancer */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 live-dot"></span>
            <span className="text-emerald-400 font-mono font-bold text-xs uppercase tracking-wider">
              Live Kitchen SLA Load Balancer
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-white">
            Order Preparation & SLA Escalation Dashboard
          </h2>
          <p className="text-slate-400 text-xs">
            Orders are color-coded by SLA breach proximity. <span className="text-emerald-400 font-semibold">Green (On Time)</span>, <span className="text-amber-400 font-semibold">Amber (Priority)</span>, <span className="text-rose-400 font-semibold">Red (SLA Breach Threat)</span>.
          </p>
        </div>

        {/* Station Load Meters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
          {stationStats.map(st => (
            <div key={st.name} className="bg-slate-950/80 border border-slate-800 p-3 rounded-2xl space-y-1.5 min-w-[130px]">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-slate-300 truncate">{st.name}</span>
                <span className="font-mono text-indigo-400 font-bold">{st.load}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    st.load > 80 ? 'bg-rose-500' : st.load > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${st.load}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-500 flex justify-between">
                <span>{st.active} Active</span>
                <span>{st.chef}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Kitchen Order Tickets */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold font-display text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            Active Kitchen Tickets ({activeOrders.length})
          </h3>
          <span className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 live-dot inline-block" />
            Real-time WebSocket Sync
          </span>
        </div>

        {activeOrders.length === 0 && (
          <div className="text-center py-16 glass-card rounded-3xl space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <p className="text-lg font-bold font-display text-white">Kitchen Clear!</p>
            <p className="text-slate-400 text-sm">No active tickets. All orders fulfilled.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeOrders.map(order => {
            const { elapsedMins, targetSla, progressPercent, statusColor } = getSlaMetrics(order);
            const isBreached = progressPercent >= 100;

            return (
              <div
                key={order.id}
                className={`rounded-3xl p-6 flex flex-col justify-between space-y-4 transition-all border ${
                  statusColor === 'red' ? 'glass-card-danger sla-breach-pulse' :
                  statusColor === 'amber' ? 'glass-card-warning' :
                  'glass-card-success'
                }`}
              >
                <div>
                  {/* Ticket Header */}
                  <div className="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-3">
                    <div>
                      <span className="text-xs font-mono font-bold text-slate-400 block">{order.id}</span>
                      <h4 className="text-lg font-bold text-white font-display mt-0.5">{order.table_number}</h4>
                      <span className="text-[11px] text-slate-400">Customer: {order.customer_name}</span>
                    </div>

                    <div className="text-right">
                      <div className={`px-3 py-1 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 ${
                        statusColor === 'red' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                        statusColor === 'amber' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                        'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}>
                        <Clock className="w-3.5 h-3.5" />
                        {elapsedMins} / {targetSla} mins
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-1 uppercase font-semibold">{order.station || 'Kitchen'}</span>
                    </div>
                  </div>

                  {/* SLA Progress Bar */}
                  <div className="space-y-1 pt-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-semibold">SLA Decay</span>
                      <span className={`font-mono font-bold ${
                        statusColor === 'red' ? 'text-rose-400' : statusColor === 'amber' ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {progressPercent}% {isBreached ? '• BREACHED!' : ''}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full transition-all ${
                          statusColor === 'red' ? 'bg-rose-500' : statusColor === 'amber' ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Order Stage Stepper */}
                  <div className="grid grid-cols-4 gap-1 pt-3">
                    {['placed', 'in_kitchen', 'ready', 'served'].map((stage, idx) => {
                      const stageIdx = ['placed', 'in_kitchen', 'ready', 'served'].indexOf(order.status);
                      const isPassed = idx <= stageIdx;
                      return (
                        <div key={stage} className="space-y-0.5">
                          <div className={`h-1 rounded-full ${isPassed ? (statusColor === 'red' ? 'bg-rose-500' : statusColor === 'amber' ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-slate-800'}`} />
                          <span className={`block text-[9px] font-bold uppercase text-center ${isPassed ? 'text-slate-300' : 'text-slate-600'}`}>
                            {['Order', 'Cooking', 'Ready', 'Served'][idx]}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Ordered Items */}
                  <div className="pt-4 space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Items:</span>
                    <ul className="space-y-1.5">
                      {order.items.map((item, idx) => (
                        <li key={idx} className="flex items-center justify-between bg-slate-950/60 p-2 rounded-xl text-xs border border-slate-800">
                          <span className="font-semibold text-slate-200">
                            <span className="text-indigo-400 font-mono mr-1.5">x{item.quantity}</span>
                            {item.name}
                          </span>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] uppercase font-bold ${
                            item.status === 'ready' ? 'bg-emerald-500/20 text-emerald-400' :
                            item.status === 'cooking' ? 'bg-amber-500/20 text-amber-400' :
                            'bg-slate-800 text-slate-400'
                          }`}>
                            {item.status}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Stage Action Buttons */}
                <div className="pt-2 border-t border-slate-800/80 space-y-2">
                  {order.status === 'placed' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'in_kitchen')}
                      className="w-full py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                    >
                      <Flame className="w-4 h-4" />
                      Start Cooking
                    </button>
                  )}
                  {order.status === 'in_kitchen' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'ready')}
                      className="w-full py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Mark Ready for Pickup
                    </button>
                  )}
                  {order.status === 'ready' && (
                    <button
                      onClick={() => {
                        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
                        updateOrderStatus(order.id, 'served');
                      }}
                      className="w-full py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                    >
                      <UtensilsCrossed className="w-4 h-4" />
                      Mark Served to Table
                    </button>
                  )}
                  {order.status === 'served' && (
                    <button
                      onClick={() => openBilling(order.id)}
                      className="w-full py-2.5 rounded-2xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                    >
                      <Receipt className="w-4 h-4" />
                      Generate Bill & Close
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Kitchen Live Stock Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div>
          <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-400" />
            Kitchen Live Stock Controls & Manual Overrides
          </h3>
          <p className="text-slate-400 text-xs mt-1">Adjusting ingredient stock here instantly updates auto-availability for all customers in real time.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ingredients.slice(0, 6).map(ing => {
            const isLow = ing.current_stock <= ing.reorder_threshold;
            return (
              <div key={ing.id} className={`p-4 rounded-2xl border space-y-2 ${isLow ? 'bg-rose-950/20 border-rose-800/50' : 'bg-slate-950 border-slate-800'}`}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">{ing.name}</span>
                  <span className={`font-mono font-bold ${isLow ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {isLow && <AlertTriangle className="w-3 h-3 inline mr-1" />}
                    {ing.current_stock} {ing.unit}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => updateIngredientStock(ing.id, ing.current_stock - 50)}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs rounded-xl font-bold"
                  >
                    -50
                  </button>
                  <button
                    onClick={() => updateIngredientStock(ing.id, 0)}
                    className="px-2.5 py-1 bg-rose-950 hover:bg-rose-900 text-rose-300 font-mono text-xs rounded-xl font-bold border border-rose-800"
                  >
                    Deplete
                  </button>
                  <button
                    onClick={() => refillIngredient(ing.id)}
                    className="px-2.5 py-1 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 font-mono text-xs rounded-xl font-bold border border-emerald-800 flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Refill
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
