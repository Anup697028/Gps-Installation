
import React, { useState } from 'react';
import { UserRole } from '../types';
import { initiateRegistration, verifyAndRegister } from '../services/firebaseService';

interface RegisterFormProps {
  onSuccess: () => void;
  onBack: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onBack }) => {
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.FIELD_OPERATOR);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInitiate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await initiateRegistration({ name, email, password, role });
      setStep('otp');
    } catch (err: any) {
      setError(err.message || 'Identity initialization failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await verifyAndRegister(email, otp);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden animate-in fade-in zoom-in duration-300">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 to-cyan-500"></div>
      
      <button 
        onClick={step === 'details' ? onBack : () => setStep('details')} 
        className="mb-6 flex items-center text-slate-400 hover:text-slate-600 transition-colors text-xs font-black uppercase tracking-widest group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        {step === 'details' ? 'Back to Sign In' : 'Edit Details'}
      </button>

      {step === 'details' ? (
        <>
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic">Provision <span className="text-emerald-500 underline decoration-emerald-200 underline-offset-4">Identity</span></h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mt-2">Enterprise Cloud Onboarding</p>
          </div>

          <form onSubmit={handleInitiate} className="space-y-5">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Full Name</label>
              <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 focus:bg-white outline-none text-sm font-bold transition-all" placeholder="Legal Full Name" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Enterprise Email</label>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 focus:bg-white outline-none text-sm font-bold transition-all" placeholder="user@automategps.com" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Password</label>
              <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 focus:bg-white outline-none text-sm font-bold transition-all" placeholder="••••••••" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Strategic Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value as UserRole)} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 focus:bg-white outline-none text-sm font-black transition-all appearance-none">
                {Object.values(UserRole).map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
              </select>
            </div>

            {error && <div className="p-4 bg-red-50 text-red-600 text-xs font-black rounded-xl border border-red-100">{error}</div>}

            <button disabled={loading} className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/10 uppercase tracking-widest text-xs">
              {loading ? 'Initiating Backend...' : 'Verify Identity'}
            </button>
          </form>
        </>
      ) : (
        <div className="animate-in slide-in-from-right duration-300">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 003 11c0-2.778 1.123-5.288 2.947-7.103m3.053 3.053c.601.601 1.056 1.332 1.345 2.138M12 11h9m-9 0v9m9-9l-2-2m2 2l-2 2" />
              </svg>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight italic">Backend <span className="text-emerald-500">Sync</span></h1>
            <p className="text-slate-400 text-xs font-bold mt-2 leading-relaxed">
              Check your registered email/SMS for the <br/>
              <span className="text-slate-900 font-black">6-Digit Access Token</span>
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 text-center">Verification Code</label>
              <input 
                required 
                type="text" 
                maxLength={6}
                value={otp} 
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} 
                className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 focus:bg-white outline-none text-3xl font-black text-center tracking-[0.5em] transition-all" 
                placeholder="••••••"
                autoFocus
              />
            </div>

            {error && <div className="p-4 bg-red-50 text-red-600 text-xs font-black rounded-xl border border-red-100">{error}</div>}

            <button disabled={loading || otp.length < 6} className="w-full py-4 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-emerald-500/20 uppercase tracking-widest text-xs">
              {loading ? 'Verifying...' : 'Authenticate & Join'}
            </button>
            
            <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Still waiting? <button type="button" onClick={() => alert('Token Dispatch Re-triggered (Server)')} className="text-emerald-600 hover:underline">Resend Backend SMS</button>
            </p>
          </form>
        </div>
      )}
    </div>
  );
};

export default RegisterForm;
