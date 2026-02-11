
import React, { useState } from 'react';
import Layout from './components/Layout';
import RequestForm from './components/RequestForm';
import Dashboard from './components/Dashboard';
import FrontPage from './components/FrontPage';
import RegisterForm from './components/RegisterForm';
import VirtualMailbox from './components/VirtualMailbox';
import { User, UserRole } from './types';
import { authenticateUser } from './services/firebaseService';

type View = 'landing' | 'login' | 'register' | 'app';

const App: React.FC = () => {
  const [view, setView] = useState<View>('landing');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [password, setPassword] = useState('');
  const [selectedUserEmail, setSelectedUserEmail] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [refreshToggle, setRefreshToggle] = useState(0);

  const handleLoginAttempt = async () => {
    setLoginError(null);
    try {
      const user = await authenticateUser(selectedUserEmail.trim(), password);
      setCurrentUser(user);
      setView('app');
      setPassword('');
    } catch (err: any) {
      setLoginError(err.message);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('landing');
    setSelectedUserEmail('');
  };

  const triggerRefresh = () => setRefreshToggle(prev => prev + 1);

  return (
    <>
      {view === 'landing' && <FrontPage onStart={() => setView('login')} />}

      {view === 'register' && (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
          <RegisterForm onSuccess={() => setView('login')} onBack={() => setView('login')} />
        </div>
      )}

      {view === 'login' && (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
            
            <button onClick={() => setView('landing')} className="mb-6 flex items-center text-slate-400 hover:text-slate-600 transition-colors text-sm font-bold group">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </button>

            <div className="text-center mb-8">
              <h1 className="text-2xl font-black text-slate-800 tracking-tight italic">System <span className="text-emerald-500">Gateway</span></h1>
              <p className="text-slate-500 text-xs font-black uppercase tracking-widest mt-1">Enterprise Authentication</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Email Address</label>
                <input 
                  type="email"
                  placeholder="name@enterprise.com"
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 outline-none text-sm font-bold transition-all"
                  value={selectedUserEmail}
                  onChange={(e) => setSelectedUserEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Security Password</label>
                <input 
                  type="password"
                  placeholder="••••••••"
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 outline-none text-sm font-bold transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {loginError && <div className="p-3 bg-red-50 text-red-600 text-[10px] font-black uppercase rounded-xl border border-red-100">{loginError}</div>}

              <button 
                onClick={handleLoginAttempt} 
                disabled={!selectedUserEmail || !password} 
                className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/10 uppercase tracking-widest text-xs disabled:opacity-50"
              >
                Authorize Access
              </button>

              <button onClick={() => setView('register')} className="w-full py-3 text-emerald-600 font-black text-[10px] uppercase tracking-widest hover:underline">
                Initialize New Account
              </button>
            </div>
          </div>
        </div>
      )}

      {view === 'app' && currentUser && (
        <Layout user={currentUser} onLogout={handleLogout}>
          <div className="max-w-6xl mx-auto space-y-8">
            {currentUser.role === UserRole.FIELD_OPERATOR && (
              <RequestForm user={currentUser} onSuccess={triggerRefresh} />
            )}
            <Dashboard user={currentUser} refreshToggle={refreshToggle} />
          </div>
        </Layout>
      )}

      {/* Global Virtual Mailbox accessible in all views for testing */}
      <VirtualMailbox />
    </>
  );
};

export default App;
