import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  UserCheck,
  Mail,
  Lock,
  KeyRound,
  Shield,
  X,
  CheckCircle2,
  Zap
} from 'lucide-react';

export const AuthModal = () => {
  const { authModalOpen, setAuthModalOpen, user, setUser, setCurrentRole, pushRealtimeLog } = useApp();

  const [mode, setMode] = useState('otp'); // otp, password, oauth
  const [email, setEmail] = useState('alex@example.com');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [selectedRole, setSelectedRole] = useState('customer');

  if (!authModalOpen) return null;

  const handleRequestOtp = (e) => {
    e.preventDefault();
    setOtpSent(true);
    pushRealtimeLog(`🔐 OTP sent to ${email} (Supabase Auth)`, 'info');
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setUser({
      name: email.split('@')[0].toUpperCase(),
      email: email,
      role: selectedRole,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    });
    setCurrentRole(selectedRole);
    pushRealtimeLog(`✅ User authenticated as ${selectedRole.toUpperCase()} via Supabase Auth`, 'success');
    setAuthModalOpen(false);
  };

  const handleGoogleOAuth = () => {
    setUser({
      name: 'Google User',
      email: 'user@gmail.com',
      role: selectedRole,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
    });
    setCurrentRole(selectedRole);
    pushRealtimeLog(`🌐 Authenticated via Google OAuth 2.0`, 'success');
    setAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-6 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/40 flex items-center justify-center mx-auto">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold font-display text-white">Supabase Auth Gateway</h3>
          <p className="text-xs text-slate-400">Email OTP & Role-Based Access Control (RBAC)</p>
        </div>

        {/* Role Assignment Selection */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-300">Select Access Role</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'customer', label: 'Customer' },
              { id: 'kitchen', label: 'Kitchen SLA' },
              { id: 'staff', label: 'Floor Staff' },
              { id: 'admin', label: 'Admin Ops' }
            ].map(r => (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelectedRole(r.id)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  selectedRole === r.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Google OAuth Simulation Button */}
        <button
          onClick={handleGoogleOAuth}
          className="w-full py-3 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-white font-bold text-xs flex items-center justify-center gap-3 transition-all"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>Sign in with Google OAuth</span>
        </button>

        <div className="relative text-center text-[10px] text-slate-500 uppercase tracking-widest font-bold">
          <span className="bg-slate-900 px-3 relative z-10">Or Passwordless OTP</span>
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
        </div>

        {/* Email OTP Form */}
        {!otpSent ? (
          <form onSubmit={handleRequestOtp} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-lg shadow-indigo-600/30"
            >
              Send Login OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Enter 6-Digit OTP</label>
              <input
                type="text"
                required
                placeholder="1 2 3 4 5 6"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-center font-mono text-lg tracking-widest text-emerald-400"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-600/30"
            >
              Verify OTP & Launch Session
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
