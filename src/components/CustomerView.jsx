import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Flame,
  Plus,
  Check,
  Clock,
  AlertTriangle,
  Sparkles,
  MapPin,
  Utensils,
  ChevronRight,
  ThumbsUp,
  Star,
  Zap,
  RotateCcw
} from 'lucide-react';

export const CustomerView = ({ onOpenCart }) => {
  const {
    menu,
    addToCart,
    updateCartQuantity,
    cart,
    selectedTable,
    setSelectedTable,
    tables,
    orders,
    activeCustomerOrder,
    setFeedbackModalOpen,
    setAiCaptainOpen
  } = useApp();

  const activeOrdersAhead = orders.filter(o => o.status === 'placed' || o.status === 'in_kitchen').length;

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDiet, setSelectedDiet] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Gourmet Mains', 'Signature Curries', 'Starters & Bowls', 'Breads & Sides', 'Beverages & Desserts'];
  const diets = ['All', 'Veg', 'Non-Veg', 'Eggitarian'];

  const filteredMenu = menu.filter(item => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesDiet = selectedDiet === 'All' || item.diet === selectedDiet;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesDiet && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-16">
      
      {/* Hero Banner with Table Assignment & AI Assistant Callout */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-slate-800 p-6 md:p-8 shadow-2xl">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-widest">
              <span className="flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Realtime Intelligent Dining OS
              </span>
              {/* 3.2 — Queue Status Chip */}
              <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1 normal-case tracking-normal">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 live-dot"></span>
                Kitchen Queue: <strong className="text-white">{activeOrdersAhead} orders active</strong> (~{activeOrdersAhead * 3}m delay)
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-white tracking-tight">
              Order Fresh. Track <span className="gradient-text">Live Prep ETA</span>.
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Dishes dynamically update availability based on live kitchen inventory. Chat with our AI Captain to build custom meals based on dietary needs & real-time stock!
            </p>
          </div>

          {/* Table Selector & AI Quick Trigger */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            
            {/* Table Selection Dropdown + QR Button */}
            <div className="bg-slate-900/90 border border-slate-700/70 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-inner">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-indigo-400 shrink-0" />
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Your Table</label>
                  <select
                    value={selectedTable}
                    onChange={(e) => setSelectedTable(e.target.value)}
                    className="bg-transparent text-white font-bold text-sm outline-none cursor-pointer pr-4"
                  >
                    {tables.map(t => (
                      <option key={t.id} value={t.id} className="bg-slate-900 text-white">
                        {t.number} ({t.capacity} Seats) {t.status === 'occupied' ? '• Occupied' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* QR Scanner trigger */}
              <button
                onClick={() => {
                  const evt = new CustomEvent('open-qr-modal');
                  window.dispatchEvent(evt);
                }}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-400 hover:text-indigo-300 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all shrink-0"
                title="Simulate scanning physical table QR code"
              >
                <QrCode className="w-4 h-4" />
                <span className="hidden sm:inline">Scan QR</span>
              </button>
            </div>

            {/* AI Order Prompt Button */}
            <button
              onClick={() => setAiCaptainOpen(true)}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 hover:opacity-95 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask AI Captain</span>
            </button>

          </div>
        </div>
      </div>

      {/* Active Order Live Tracker (If an order is placed) */}
      {activeCustomerOrder && (
        <div className="glass-panel border-2 border-indigo-500/40 rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Active Live Order
                </span>
                <span className="font-mono text-xs text-slate-400">{activeCustomerOrder.id}</span>
              </div>
              <h3 className="text-xl font-bold text-white mt-1">
                Preparing for {activeCustomerOrder.table_number}
              </h3>
            </div>

            <div className="flex items-center gap-4 bg-slate-900/80 px-4 py-2 rounded-2xl border border-slate-800">
              <div className="text-right">
                {/* 3.3 — Heuristic ETA Model Label & Disclosure Badge */}
                <div className="flex items-center gap-1 justify-end text-[10px] text-slate-400 uppercase font-semibold">
                  <span>Live Kitchen ETA</span>
                  <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[9px] normal-case" title="Model: max_dish_prep + (active_kitchen_orders * 3 mins)">
                    ⚡ Heuristic ML Model
                  </span>
                </div>
                <div className="text-xl font-bold font-mono text-emerald-400 flex items-center gap-1.5 justify-end">
                  <Clock className="w-4 h-4 animate-spin-slow" />
                  ~{activeCustomerOrder.eta_mins} mins
                </div>
              </div>
              <button
                onClick={() => setFeedbackModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all"
              >
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                Rate Meal
              </button>
            </div>
          </div>

          {/* 3.4 — Highlighted Banner when status is 'ready' */}
          {activeCustomerOrder.status === 'ready' && (
            <div className="mb-4 p-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/60 flex items-center justify-between gap-3 animate-pulse">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Your Order is Ready for Pickup! 🍽️</h4>
                  <p className="text-[11px] text-emerald-300">Head over to the pickup counter or floor staff will serve it shortly.</p>
                </div>
              </div>
              <button
                onClick={() => setFeedbackModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0"
              >
                Leave Review
              </button>
            </div>
          )}

          {/* Stage Progress Steps */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Placed', stage: 'placed' },
              { label: 'In Kitchen', stage: 'in_kitchen' },
              { label: 'Ready', stage: 'ready' },
              { label: 'Served', stage: 'served' }
            ].map((step, idx) => {
              const stages = ['placed', 'in_kitchen', 'ready', 'served'];
              const currentIdx = stages.indexOf(activeCustomerOrder.status);
              const isPassed = idx <= currentIdx;
              const isCurrent = idx === currentIdx;

              return (
                <div key={step.stage} className="space-y-1.5">
                  <div className={`h-2 rounded-full transition-all ${
                    isPassed ? 'bg-indigo-500 shadow-sm shadow-indigo-500/50' : 'bg-slate-800'
                  } ${isCurrent ? 'animate-pulse' : ''}`} />
                  <div className="flex items-center justify-between text-[11px]">
                    <span className={`font-semibold ${isPassed ? 'text-indigo-300' : 'text-slate-500'}`}>
                      {step.label}
                    </span>
                    {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 live-dot" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Menu Filter & Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search dishes or ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>

        </div>

        {/* Dietary Filters */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Dietary:</span>
          {diets.map(diet => (
            <button
              key={diet}
              onClick={() => setSelectedDiet(diet)}
              className={`px-3 py-1 rounded-xl text-[11px] font-semibold transition-all ${
                selectedDiet === diet
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {diet}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Dishes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMenu.map(dish => {
          const isAvailable = dish.is_available_computed;
          const cartItem = cart.find(c => c.id === dish.id);
          const cartQty = cartItem ? cartItem.quantity : 0;

          return (
            <div
              key={dish.id}
              className={`glass-card rounded-3xl overflow-hidden flex flex-col justify-between group relative ${
                !isAvailable ? 'opacity-55 grayscale-[60%]' : ''
              }`}
            >
              <div>
                {/* Image Container with Badges */}
                <div className="relative h-48 overflow-hidden bg-slate-900">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                  {/* Dietary Tag */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      dish.diet === 'Veg' ? 'bg-emerald-950/90 text-emerald-400 border border-emerald-500/40' :
                      dish.diet === 'Non-Veg' ? 'bg-rose-950/90 text-rose-400 border border-rose-500/40' :
                      'bg-amber-950/90 text-amber-400 border border-amber-500/40'
                    }`}>
                      {dish.diet}
                    </span>
                    {dish.spiciness !== 'Mild' && (
                      <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-slate-900/90 text-orange-400 border border-orange-500/40 flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        {dish.spiciness}
                      </span>
                    )}
                  </div>

                  {/* Rating Tag */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700 text-amber-400 font-bold text-xs flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {dish.rating}
                  </div>

                  {/* Stronger SOLD OUT Ribbon for unavailable items */}
                  {!isAvailable && (
                    <>
                      {/* Dark overlay */}
                      <div className="absolute inset-0 bg-slate-950/60 z-10" />
                      {/* Diagonal ribbon */}
                      <div className="absolute top-0 right-0 z-20 overflow-hidden w-28 h-28">
                        <div className="absolute top-5 right-[-28px] w-36 py-1.5 rotate-45 bg-rose-600 text-white text-[9px] font-black uppercase tracking-widest text-center shadow-lg">
                          SOLD OUT
                        </div>
                      </div>
                      {/* Bottom shortage banner */}
                      <div className="absolute inset-x-0 bottom-0 z-20 bg-rose-950/95 border-t border-rose-700 px-3 py-2 flex items-center gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span className="text-[10px] font-bold text-rose-200 truncate">
                          AUTO-UNAVAILABLE · {dish.shortage_reason || 'Ingredient shortage'}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Dish Details */}
                <div className="p-5 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-lg text-white font-display leading-snug group-hover:text-indigo-300 transition-colors">
                      {dish.name}
                    </h3>
                  </div>

                  <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                    {dish.description}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      Prep ~{dish.prep_time_mins} mins
                    </span>
                    <span>•</span>
                    <span className="text-slate-500">{dish.category}</span>
                  </div>
                </div>
              </div>

              {/* Price & Add to Cart — 2.1 FIX: single pt-4, no double padding */}
              <div className="px-5 pb-5 pt-4 flex items-center justify-between gap-4 border-t border-slate-800/50">
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Price</span>
                  <span className="text-xl font-bold font-mono text-white">₹{dish.price}</span>
                </div>

                {isAvailable ? (
                  cartQty > 0 ? (
                    <div className="flex items-center gap-2 bg-indigo-600/30 border border-indigo-500/50 rounded-2xl p-1">
                      <button
                        onClick={() => updateCartQuantity(dish.id, -1)}
                        className="w-7 h-7 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm flex items-center justify-center transition-all"
                      >
                        -
                      </button>
                      <span className="px-2 font-mono font-bold text-sm text-white">{cartQty}</span>
                      <button
                        onClick={() => addToCart(dish, 1)}
                        className="w-7 h-7 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm flex items-center justify-center transition-all"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(dish, 1)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-md shadow-indigo-600/20 active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add to Order</span>
                    </button>
                  )
                ) : (
                  <button
                    disabled
                    className="px-4 py-2.5 rounded-2xl bg-slate-900 text-slate-600 font-semibold text-xs border border-slate-800 cursor-not-allowed"
                  >
                    Sold Out
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
