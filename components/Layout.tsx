
import React from 'react';
import { User, UserRole } from '../types';

interface LayoutProps {
  user: User;
  children: React.ReactNode;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ user, children, onLogout }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold tracking-tight text-emerald-400">GPS Automate</h1>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-semibold">Workflow Engine</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <div className="text-xs text-slate-500 font-bold uppercase py-2 px-2">Main Menu</div>
          <button className="w-full text-left px-3 py-2 rounded-lg bg-slate-800 text-emerald-400 font-medium flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </button>
          
          <button 
            onClick={onLogout}
            className="w-full text-left px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all flex items-center gap-3 mt-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
        </nav>

        <div className="p-4 bg-slate-800 border-t border-slate-700">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-slate-900 shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold truncate">{user.name}</p>
              <p className="text-xs text-slate-400 truncate uppercase">{user.role.replace('_', ' ')}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full text-xs bg-slate-700 hover:bg-red-600 transition-colors text-white py-2 rounded uppercase font-bold tracking-wider"
          >
            Switch User
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-gray-50 flex flex-col">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
          <h2 className="font-semibold text-lg text-gray-700">Internal GPS Installation Portal</h2>
          <div className="flex items-center space-x-4">
             <span className="text-sm text-gray-500 font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
