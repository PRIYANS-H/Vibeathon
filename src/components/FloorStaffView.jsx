import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  CheckCircle2,
  CalendarCheck,
  MapPin
} from 'lucide-react';

export const FloorStaffView = () => {
  const { tables, updateTableStatus, orders, pushRealtimeLog } = useApp();

  const [reservationModal, setReservationModal] = useState(false);
  const [resCustomer, setResCustomer] = useState('');
  const [resTable, setResTable] = useState('T4');
  const [resPartySize, setResPartySize] = useState(4);

  // 2.7 — flash state: maps tableId → boolean for the green flash animation
  const [flashedTables, setFlashedTables] = useState({});

  const flashTable = (tableId) => {
    setFlashedTables(prev => ({ ...prev, [tableId]: true }));
    setTimeout(() => setFlashedTables(prev => ({ ...prev, [tableId]: false })), 1000);
  };

  const handleTableAction = (tableId, newStatus) => {
    updateTableStatus(tableId, newStatus);
    flashTable(tableId);
  };

  const handleCreateReservation = (e) => {
    e.preventDefault();
    if (!resCustomer) return;
    updateTableStatus(resTable, 'reserved');
    flashTable(resTable);
    pushRealtimeLog(`📅 Reservation: ${resCustomer} → ${tables.find(t => t.id === resTable)?.number} (${resPartySize} guests)`, 'info');
    setReservationModal(false);
    setResCustomer('');
  };

  return (
    <div className="space-y-8 pb-16">

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-white">
            Floor Staff & Table Operations Manager
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Monitor real-time table layout, assign walk-ins, mark reservations & deliver ready orders.
          </p>
        </div>
        <button
          onClick={() => setReservationModal(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-lg shadow-indigo-600/30"
        >
          <CalendarCheck className="w-4 h-4" />
          New Table Reservation
        </button>
      </div>

      {/* Table Status Grid */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold font-display text-white flex items-center gap-2">
          <MapPin className="w-5 h-5 text-indigo-400" />
          Live Dining Room Layout ({tables.length} Tables)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tables.map(tbl => {
            const currentOrd = orders.find(o => o.id === tbl.current_order_id);
            const isFlashing = flashedTables[tbl.id];

            return (
              <div
                key={tbl.id}
                className={`rounded-3xl p-6 border flex flex-col justify-between space-y-4 transition-all duration-500 ${
                  isFlashing
                    ? 'bg-emerald-950/60 border-emerald-400/80 shadow-xl shadow-emerald-500/20 scale-[1.02]'
                    : tbl.status === 'occupied'
                    ? 'bg-amber-950/20 border-amber-500/40 shadow-lg shadow-amber-500/10'
                    : tbl.status === 'reserved'
                    ? 'bg-purple-950/20 border-purple-500/40'
                    : 'bg-emerald-950/20 border-emerald-500/40'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold font-display text-white">{tbl.number}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      isFlashing
                        ? 'bg-emerald-400/30 text-emerald-200 border border-emerald-400/50'
                        : tbl.status === 'occupied'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : tbl.status === 'reserved'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}>
                      {isFlashing ? '✓ Updated' : tbl.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-indigo-400" />
                      Capacity: {tbl.capacity} Seats
                    </span>
                    {tbl.current_order_id && (
                      <span className="font-mono text-indigo-300 font-bold">{tbl.current_order_id}</span>
                    )}
                  </div>

                  {currentOrd && (
                    <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-300">{currentOrd.customer_name}</span>
                        <span className="font-mono font-bold text-emerald-400">₹{currentOrd.total_amount}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center justify-between">
                        <span>Items: {currentOrd.items.length}</span>
                        <span className={`font-semibold capitalize ${
                          currentOrd.status === 'ready' ? 'text-emerald-400' :
                          currentOrd.status === 'in_kitchen' ? 'text-amber-400' :
                          'text-indigo-400'
                        }`}>
                          Stage: {currentOrd.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Table Quick Controls */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2">
                  {tbl.status === 'free' && (
                    <button
                      onClick={() => handleTableAction(tbl.id, 'occupied')}
                      className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all active:scale-95"
                    >
                      Seat Walk-in Guest
                    </button>
                  )}
                  {tbl.status === 'occupied' && (
                    <button
                      onClick={() => handleTableAction(tbl.id, 'free')}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all active:scale-95"
                    >
                      Clear & Reset Table
                    </button>
                  )}
                  {tbl.status === 'reserved' && (
                    <button
                      onClick={() => handleTableAction(tbl.id, 'occupied')}
                      className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all active:scale-95"
                    >
                      Check-in Party
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reservation Modal */}
      {reservationModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                <CalendarCheck className="w-5 h-5 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold font-display text-white">Create Table Reservation</h3>
            </div>

            <form onSubmit={handleCreateReservation} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Guest Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya Roy"
                  value={resCustomer}
                  onChange={e => setResCustomer(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Select Table</label>
                  <select
                    value={resTable}
                    onChange={e => setResTable(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white"
                  >
                    {tables.map(t => (
                      <option key={t.id} value={t.id}>{t.number} ({t.capacity} Seats)</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Party Size</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={resPartySize}
                    onChange={e => setResPartySize(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReservationModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition-all"
                >
                  Confirm Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
