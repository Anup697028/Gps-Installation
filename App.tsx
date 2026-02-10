
import React, { useState } from 'react';
import Layout from './components/Layout';
import RequestForm from './components/RequestForm';
import Dashboard from './components/Dashboard';
import FrontPage from './components/FrontPage';
import { MOCK_USERS } from './constants';
import { User, UserRole } from './types';

type View = 'landing' | 'login' | 'app';

const App: React.FC = () => {
  const [view, setView] = useState<View>('landing');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [refreshToggle, setRefreshToggle] = useState(0);

  const handleStart = () => setView('login');
  
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setView('app');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('landing');
  };

  const handleBackToLanding = () => {
    setView('landing');
  };

  const triggerRefresh = () => setRefreshToggle(prev => prev + 1);

  if (view === 'landing') {
    return <FrontPage onStart={handleStart} />;
  }

  if (view === 'login') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
          
          <button 
            onClick={handleBackToLanding}
            className="mb-6 flex items-center text-slate-400 hover:text-slate-600 transition-colors text-sm font-bold group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">System Portal</h1>
            <p className="text-slate-500 text-sm mt-2 font-medium">Select your organizational identity</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {MOCK_USERS.map((user) => (
              <button
                key={user.id}
                onClick={() => handleLogin(user)}
                className="group flex items-center justify-between p-4 border-2 border-slate-100 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all text-left"
              >
                <div>
                  <p className="font-bold text-slate-800 group-hover:text-emerald-700">{user.name}</p>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">{user.role.replace('_', ' ')}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-emerald-200 flex items-center justify-center">
                  <span className="text-slate-400 group-hover:text-emerald-600">→</span>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
             <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Access Policy</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed italic">
                  This is a secure internal environment. Unauthorized access is monitored and logged. By selecting a role, you agree to the enterprise data handling guidelines.
                </p>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout user={currentUser!} onLogout={handleLogout}>
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {currentUser?.role === UserRole.FIELD_OPERATOR && (
          <RequestForm user={currentUser} onSuccess={triggerRefresh} />
        )}

        <Dashboard user={currentUser!} refreshToggle={refreshToggle} />

        <div className="mt-12 p-6 bg-blue-50 border border-blue-100 rounded-xl">
           <h4 className="text-sm font-bold text-blue-800 mb-2 underline">Developer Quick-Start Guide</h4>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-blue-700">
              <div>
                 <p className="font-bold">Firestore Schema (Simulation)</p>
                 <p className="mt-1">Collection `requests`: Contains full lifecycle data + audit log array for regulatory compliance.</p>
              </div>
              <div>
                 <p className="font-bold">Validation Rule</p>
                 <p className="mt-1">Vehicles KA-01-ME-1234 & MH-12-AB-5678 are pre-registered. Use them for testing.</p>
              </div>
           </div>
        </div>
      </div>
    </Layout>
  );
};

export default App;
