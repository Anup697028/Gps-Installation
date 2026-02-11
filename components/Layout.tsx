
import React from 'react';
import { User, UserRole } from '../types';

interface LayoutProps {
  user: User;
  children: React.ReactNode;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ user, children, onLogout }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex flex-col shadow-2xl z-20">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 bg-emerald-500 rounded flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-900" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-xl font-black tracking-tight text-white uppercase italic">Automate<span className="text-emerald-500">GPS</span></h1>
          </div>
          <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-[0.2em] font-black">Workflow OS v2.0</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <div className="text-[10px] text-slate-600 font-black uppercase py-4 px-3 tracking-[0.2em]">Navigation</div>
          
          <button className="w-full text-left px-3 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 font-bold flex items-center gap-3 border border-emerald-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home / Dashboard
          </button>

          <button className="w-full text-left px-3 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all flex items-center gap-3 font-semibold group">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            Request History
          </button>
          
          <div className="pt-6">
            <div className="text-[10px] text-slate-600 font-black uppercase py-2 px-3 tracking-[0.2em]">Context</div>
            <button 
              onClick={onLogout}
              className="w-full text-left px-3 py-2.5 rounded-xl text-slate-500 hover:bg-slate-800 hover:text-red-400 transition-all flex items-center gap-3 font-semibold group mt-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Exit to Landing
            </button>
          </div>
        </nav>

        <div className="p-4 bg-slate-900 border-t border-slate-800">
          <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-800 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center font-black text-slate-900 shrink-0 shadow-lg">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-black truncate text-white">{user.name}</p>
              <p className="text-[9px] text-emerald-400 truncate uppercase font-black tracking-widest">{user.role.replace('_', ' ')}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full mt-4 text-[10px] bg-slate-800 border border-slate-700 hover:bg-red-600 hover:border-red-600 transition-all text-slate-400 hover:text-white py-2.5 rounded-xl uppercase font-black tracking-widest"
          >
            Switch Profile
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto flex flex-col min-h-screen">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-6">
            {/* Back to Home Button */}
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-all border border-slate-100"
              title="Back to Top / Home"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </button>

            <div className="h-8 w-px bg-slate-200 hidden md:block"></div>

            {/* Breadcrumbs Navigation */}
            <nav className="flex items-center gap-2 text-xs font-black uppercase tracking-widest">
              <span className="text-slate-400">Enterprise</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-slate-400">Portal</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-emerald-600">Dashboard</span>
            </nav>
          </div>

          <div className="flex items-center space-x-6">
             <div className="hidden lg:flex flex-col items-end">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Current Date</span>
               <span className="text-xs text-slate-800 font-bold">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })}</span>
             </div>
             
             <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-xl text-white text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-slate-900/10">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
               </svg>
               New Action
             </button>
          </div>
        </header>
        
        <div className="flex-1 p-8 md:p-10 max-w-7xl mx-auto w-full">
          {children}
        </div>

        <footer className="px-10 py-6 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 bg-white/50 backdrop-blur-sm">
           <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Status:</span>
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-100 rounded-full border border-emerald-200">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                 <span className="text-[9px] font-black text-emerald-700 uppercase">Live Systems OK</span>
              </div>
           </div>
           <div className="flex items-center gap-4">
              <a href="#" className="text-[10px] font-black text-slate-400 hover:text-emerald-600 uppercase transition-colors tracking-widest">Support</a>
              <div className="w-1 h-1 rounded-full bg-slate-300"></div>
              <a href="#" className="text-[10px] font-black text-slate-400 hover:text-emerald-600 uppercase transition-colors tracking-widest">Policy</a>
              <div className="w-1 h-1 rounded-full bg-slate-300"></div>
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">© 2025 AutomateGPS</span>
           </div>
        </footer>
      </main>
    </div>
  );
};

export default Layout;
