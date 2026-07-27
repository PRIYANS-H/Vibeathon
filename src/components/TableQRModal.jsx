import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { QrCode, X, CheckCircle2, MapPin, Smartphone } from 'lucide-react';

export const TableQRModal = ({ isOpen, onClose }) => {
  const { tables, setSelectedTable, pushRealtimeLog } = useApp();
  const [selectedQR, setSelectedQR] = useState('T1');
  const [scanned, setScanned] = useState(false);

  if (!isOpen) return null;

  const handleScan = (tableId) => {
    setSelectedTable(tableId);
    setScanned(true);
    const tbl = tables.find(t => t.id === tableId);
    pushRealtimeLog(`📱 Customer scanned QR Code at ${tbl?.number || tableId} — Menu loaded`, 'info');
    setTimeout(() => {
      setScanned(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl relative text-center">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto">
          <QrCode className="w-6 h-6" />
        </div>

        <div>
          <h3 className="text-xl font-bold font-display text-white">Table QR Code Entry Simulator</h3>
          <p className="text-slate-400 text-xs mt-1">
            Simulates a customer scanning the physical table QR code with their mobile device to launch digital ordering.
          </p>
        </div>

        {scanned ? (
          <div className="py-6 space-y-2 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl animate-in zoom-in-95">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h4 className="text-sm font-bold text-white">Table Assigned Successfully!</h4>
            <p className="text-xs text-emerald-300">Digital menu & live stock sync ready</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {tables.map(t => (
                <button
                  key={t.id}
                  onClick={() => handleScan(t.id)}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all hover:scale-105 ${
                    t.status === 'occupied'
                      ? 'bg-amber-950/20 border-amber-500/40 text-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-200 hover:border-indigo-500'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-indigo-400" />
                  <span className="text-xs font-bold">{t.number}</span>
                  <span className="text-[9px] font-mono text-slate-500">{t.capacity} seats</span>
                </button>
              ))}
            </div>

            <p className="text-[11px] text-slate-500 font-mono">
              Click any table above to simulate scanning its sticker QR code
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
