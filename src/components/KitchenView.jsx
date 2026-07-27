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
      </div>      {/* Kitchen Kanban Board Layout */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold font-display text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            Kitchen Display System (Kanban Workflow)
          </h3>
          <span className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 live-dot inline-block" />
            Live Realtime Sync
          </span>
        </div>

        {/* 4 Columns: Placed, In Kitchen, Ready, Served */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { id: 'placed', title: 'Pending (Placed)', color: 'border-indigo-500/40 bg-indigo-950/10' },
            { id: 'in_kitchen', title: 'Cooking (In Kitchen)', color: 'border-amber-500/40 bg-amber-950/10' },
            { id: 'ready', title: 'Ready (For Pickup)', color: 'border-emerald-500/40 bg-emerald-950/10' },
            { id: 'served', title: 'Delivered / Closed', color: 'border-purple-500/40 bg-purple-950/10' }
          ].map(col => {
            const colOrders = orders.filter(o => o.status === col.id || (col.id === 'served' && o.status === 'billed'));

            return (
              <div key={col.id} className={`rounded-3xl border ${col.color} p-4 flex flex-col space-y-3 min-h-[420px]`}>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <h4 className="text-xs font-bold font-display text-white uppercase tracking-wider">{col.title}</h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-slate-300">
                    {colOrders.length}
                  </span>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto">
                  {colOrders.length === 0 && (
                    <div className="py-12 text-center text-slate-600 text-xs font-mono">No tickets</div>
                  )}

                  {colOrders.map(order => {
                    const { elapsedMins, targetSla, progressPercent, statusColor } = getSlaMetrics(order);
                    return (
                      <div
                        key={order.id}
                        className={`rounded-2xl p-4 border flex flex-col justify-between space-y-3 transition-all bg-slate-900/90 ${
                          statusColor === 'red' ? 'border-rose-500/80 shadow-rose-500/20 shadow-lg' :
                          statusColor === 'amber' ? 'border-amber-500/60' : 'border-slate-800'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-bold text-indigo-400">{order.id}</span>
                            <span className="text-xs font-bold text-white bg-slate-800 px-2 py-0.5 rounded-lg">{order.table_number}</span>
                          </div>

                          <div className="text-xs font-semibold text-slate-300">{order.customer_name}</div>

                          <div className="space-y-1 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-[11px] text-slate-300 font-mono">
                                <span>{item.quantity}x {item.name}</span>
                                <span>₹{item.price}</span>
                              </div>
                            ))}
                          </div>

                          {/* SLA Timer */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-mono text-slate-400">
                              <span>SLA Elapsed</span>
                              <span className={statusColor === 'red' ? 'text-rose-400 font-bold' : ''}>
                                {elapsedMins} / {targetSla}m
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all ${
                                  statusColor === 'red' ? 'bg-rose-500 animate-pulse' :
                                  statusColor === 'amber' ? 'bg-amber-500' : 'bg-emerald-500'
                                }`}
                                style={{ width: `${Math.min(100, progressPercent)}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Quick Stage Actions */}
                        <div className="pt-2 border-t border-slate-800 flex flex-col gap-1.5">
                          {order.status === 'placed' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'in_kitchen')}
                              className="w-full py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-[11px] transition-all"
                            >
                              Start Cooking
                            </button>
                          )}
                          {order.status === 'in_kitchen' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'ready')}
                              className="w-full py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] transition-all"
                            >
                              Mark Ready
                            </button>
                          )}
                          {order.status === 'ready' && (
                            <button
                              onClick={() => {
                                confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
                                updateOrderStatus(order.id, 'served');
                              }}
                              className="w-full py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-all"
                            >
                              Deliver to Table
                            </button>
                          )}
                          {order.status === 'served' && (
                            <button
                              onClick={() => openBilling(order.id)}
                              className="w-full py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] transition-all"
                            >
                              Generate Bill
                            </button>
                          )}
                        </div>

                      </div>
                    );
                  })}
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
