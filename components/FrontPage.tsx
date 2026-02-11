
import React from 'react';

interface FrontPageProps {
  onStart: () => void;
}

const FrontPage: React.FC<FrontPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-slate-900 text-white selection:bg-emerald-500 selection:text-white">
      <nav className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-black text-slate-900 text-lg italic">G</div>
          <span className="text-xl font-black tracking-tighter uppercase">Automate<span className="text-emerald-500">GPS</span></span>
        </div>
        <button onClick={onStart} className="px-6 py-2.5 bg-white text-slate-900 font-bold rounded-full hover:bg-emerald-400 transition-all text-sm">
          Access Portal
        </button>
      </nav>

      <section className="max-w-5xl mx-auto px-6 pt-20 pb-32 text-center">
        <div className="inline-block px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-bold uppercase tracking-widest mb-8">
          Enterprise Workflow Automation
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] mb-8">
          Precision GPS <br /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Lifecycle Management</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          Eliminate manual forms and fragmented emails. Our high-performance interface connects operators, heads, and vendors in one high-speed workflow.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onClick={onStart} className="w-full sm:w-auto px-10 py-4 bg-emerald-500 text-slate-900 font-black rounded-xl hover:scale-105 transition-all shadow-xl shadow-emerald-500/20">
            Get Started Now
          </button>
        </div>
      </section>

      <section className="bg-slate-800/50 border-y border-slate-700 py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div>
            <div className="text-4xl font-black text-emerald-400 mb-2">99.9%</div>
            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Audit Compliance</div>
          </div>
          <div>
            <div className="text-4xl font-black text-emerald-400 mb-2">12k+</div>
            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Units Tracked</div>
          </div>
          <div>
            <div className="text-4xl font-black text-emerald-400 mb-2">&lt; 4hr</div>
            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Avg. Approval Time</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FrontPage;
