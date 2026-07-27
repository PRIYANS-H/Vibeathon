import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  Package,
  Sliders,
  Users,
  Star,
  AlertTriangle,
  Flame,
  Zap,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';

export const AdminDashboard = () => {
  const {
    analytics,
    ingredients,
    updateIngredientStock,
    menu,
    toggleItemManualAvailability,
    staff,
    feedbackList
  } = useApp();

  const [activeTab, setActiveTab] = useState('analytics');

  // Initial stock values for one-click demo refill
  const INITIAL_STOCKS = {
    ing_1: 1200, ing_2: 45, ing_3: 18, ing_4: 2500,
    ing_5: 4000, ing_6: 800, ing_7: 2, ing_8: 1500, ing_9: 900, ing_10: 10
  };

  const depleteAllForDemo = () => {
    ingredients.forEach(ing => updateIngredientStock(ing.id, 0));
  };

  const refillAll = () => {
    ingredients.forEach(ing => updateIngredientStock(ing.id, INITIAL_STOCKS[ing.id] || 500));
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Banner & Tab Navigation */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Gold & Platinum Admin Suite
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-white mt-1">
            Executive Operations & Inventory Engine
          </h2>
          <p className="text-slate-400 text-xs">
            Real-time sales telemetry, peak demand prediction, ingredient thresholds, and staff roster controls.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          {[
            { id: 'analytics', label: 'Analytics & Revenue', icon: BarChart3 },
            { id: 'inventory', label: 'Auto-Availability Engine', icon: Package },
            { id: 'staff', label: 'Staff Roster', icon: Users },
            { id: 'feedback', label: 'Customer Reviews', icon: Star }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* KPI Cards (Always visible) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card rounded-3xl p-6 space-y-2 border-indigo-500/30">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Today's Total Revenue</span>
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono text-white">₹{analytics.todayRevenue.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            +18.4% vs. yesterday
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 space-y-2 border-emerald-500/30">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Orders Completed</span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono text-white">{analytics.ordersCompleted}</div>
          <div className="text-[11px] text-slate-400">100% fulfill compliance</div>
        </div>

        <div className="glass-card rounded-3xl p-6 space-y-2 border-amber-500/30">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Avg Kitchen Prep Time</span>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono text-white">{analytics.averagePrepTime} <span className="text-sm font-sans font-normal text-slate-400">mins</span></div>
          <div className="text-[11px] text-emerald-400 font-semibold">Target SLA &lt; 18.0 mins</div>
        </div>

        <div className="glass-card rounded-3xl p-6 space-y-2 border-purple-500/30">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>SLA Compliance Rate</span>
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono text-white">{analytics.slaComplianceRate}%</div>
          <div className="text-[11px] text-slate-400">Optimal kitchen load</div>
        </div>
      </div>

      {/* TAB CONTENT 1: ANALYTICS & CHARTS */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Hourly Demand Area Chart */}
          <div className="glass-panel border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold font-display text-white">Hourly Sales & Peak Demand Telemetry</h3>
                <p className="text-xs text-slate-400">Hourly breakdown of revenue and volume spikes</p>
              </div>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={analytics.hourlySales}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="hour" stroke="#64748b" fontSize={11} />
                  <YAxis yAxisId="left" stroke="#64748b" fontSize={11} />
                  <YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                    labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                  />
                  <Legend
                    formatter={(v) => <span style={{ color: '#94a3b8', fontSize: 11 }}>{v === 'sales' ? 'Revenue (₹)' : 'Orders'}</span>}
                  />
                  <Area yAxisId="left" type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                  <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} dot={{ r: 3, fill: '#10b981' }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Selling Dishes Bar Chart */}
          <div className="glass-panel border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold font-display text-white">Top Performing Dishes</h3>
                <p className="text-xs text-slate-400">Highest grossing items by revenue</p>
              </div>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.topDishes}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickFormatter={val => val.split(' ')[0]} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  />
                  <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}

      {/* TAB CONTENT 2: AUTO-AVAILABILITY INVENTORY ENGINE */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold font-display text-white flex items-center gap-2">
                    <Package className="w-5 h-5 text-indigo-400" />
                    Ingredient Stock & Real-Time Auto-Availability Engine
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Drag any slider to reduce stock below its reorder threshold. Watch linked dishes automatically turn sold-out live!
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={depleteAllForDemo}
                    className="px-3 py-2 rounded-xl bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Deplete All (Demo)
                  </button>
                  <button
                    onClick={refillAll}
                    className="px-3 py-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Refill All
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ingredients.map(ing => {
                const isLow = ing.current_stock <= ing.reorder_threshold;

                return (
                  <div key={ing.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-white">{ing.name}</h4>
                        <span className="text-[11px] text-slate-400">Reorder Threshold: {ing.reorder_threshold} {ing.unit}</span>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
                        isLow ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}>
                        {ing.current_stock} {ing.unit} {isLow ? '⚠️ LOW STOCK' : '✓ OK'}
                      </span>
                    </div>

                    {/* Stock Fill Progress Bar & Slider Control */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                        <span>Fill Level</span>
                        <span>{Math.round((ing.current_stock / 5000) * 100)}% of Max Capacity</span>
                      </div>
                      <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className={`h-full transition-all duration-300 ${
                            isLow ? 'bg-rose-500' : ing.current_stock < 1000 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, (ing.current_stock / 5000) * 100)}%` }}
                        />
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="5000"
                        step="5"
                        value={ing.current_stock}
                        onChange={(e) => updateIngredientStock(ing.id, Number(e.target.value))}
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 mt-1"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Menu Manual Override Control Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-bold font-display text-white">Menu Item Availability Matrix</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-3">Dish Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Required Ingredients</th>
                    <th className="p-3">Auto Status</th>
                    <th className="p-3">Manual Override</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {menu.map(item => (
                    <tr key={item.id} className="hover:bg-slate-800/30">
                      <td className="p-3 font-bold text-white">{item.name}</td>
                      <td className="p-3 text-slate-400">{item.category}</td>
                      <td className="p-3 font-mono font-bold">₹{item.price}</td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {item.ingredients_required?.map(req => {
                            const ing = ingredients.find(i => i.id === req.ingredient_id);
                            return (
                              <span key={req.ingredient_id} className="px-2 py-0.5 bg-slate-950 rounded text-[10px] border border-slate-800">
                                {ing?.name} ({req.quantity_required}{ing?.unit})
                              </span>
                            );
                          })}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.is_available_computed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                        }`}>
                          {item.is_available_computed ? 'AVAILABLE' : 'AUTO-DISABLED'}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => toggleItemManualAvailability(item.id)}
                          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                            item.is_available_manual_override
                              ? 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700'
                              : 'bg-rose-950 text-rose-300 border border-rose-800 hover:bg-rose-900'
                          }`}
                        >
                          {item.is_available_manual_override ? 'Enabled (Default)' : 'Force Disable'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: STAFF ROSTER */}
      {activeTab === 'staff' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="text-xl font-bold font-display text-white">Staff Roster & Duty Allocation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {staff.map(st => (
              <div key={st.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-base text-white">{st.name}</h4>
                  <span className="text-xs text-indigo-400 font-semibold block">{st.role}</span>
                  <span className="text-[11px] text-slate-400 block mt-1">
                    {st.active_orders_handling ? `Handling ${st.active_orders_handling} Orders` : `Assigned Tables: ${st.tables_assigned?.join(', ')}`}
                  </span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  st.status === 'On Shift' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
                }`}>
                  {st.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: CUSTOMER REVIEWS */}
      {activeTab === 'feedback' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="text-xl font-bold font-display text-white">Customer Reviews & Recommendation Telemetry</h3>
          <div className="space-y-4">
            {feedbackList.map(fb => (
              <div key={fb.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{fb.customer}</span>
                    <span className="text-xs text-slate-400">• {fb.dish}</span>
                  </div>
                  <div className="flex items-center text-amber-400 font-bold text-xs gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {fb.rating}.0 / 5.0
                  </div>
                </div>
                <p className="text-xs text-slate-300 italic">"{fb.comment}"</p>
                <span className="text-[10px] text-slate-500 block">{fb.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
