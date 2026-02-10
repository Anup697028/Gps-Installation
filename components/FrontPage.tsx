
import React from 'react';

interface FrontPageProps {
  onStart: () => void;
}

const FrontPage: React.FC<FrontPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-slate-900 text-white selection:bg-emerald-500 selection:text-white">
      {/* Navigation Bar */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-900" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-xl font-black tracking-tighter uppercase">Automate<span className="text-emerald-500">GPS</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-400">
          <a href="#" className="hover:text-emerald-400 transition-colors">Solutions</a>
          <a href="#" className="hover:text-emerald-400 transition-colors">Enterprise</a>
          <a href="#" className="hover:text-emerald-400 transition-colors">Documentation</a>
        </div>
        <button 
          onClick={onStart}
          className="px-6 py-2.5 bg-white text-slate-900 font-bold rounded-full hover:bg-emerald-400 transition-all text-sm"
        >
          Access Portal
        </button>
      </nav>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-32 text-center">
        <div className="inline-block px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-bold uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-top-4 duration-1000">
          Enterprise Workflow Automation
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          Precision GPS <br /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Lifecycle Management</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          Eliminate manual forms and fragmented emails. Our intelligent workflow engine connects operators, heads, and vendors in one high-performance interface.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
          <button 
            onClick={onStart}
            className="w-full sm:w-auto px-10 py-4 bg-emerald-500 text-slate-900 font-black rounded-xl hover:scale-105 transition-all shadow-xl shadow-emerald-500/20"
          >
            Get Started Now
          </button>
          <button className="w-full sm:w-auto px-10 py-4 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-all">
            View Case Study
          </button>
        </div>
      </section>

      {/* Stats Section */}
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

      {/* Feature Section */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { title: "Operator Submission", desc: "Validate vehicle registration in real-time with zero friction.", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
            { title: "Regional Approval", desc: "Tiered review systems with full edit and rejection capabilities.", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
            { title: "Financial Verification", desc: "Payment team verification integrated directly into the request chain.", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
            { title: "Vendor Coordination", desc: "Automated dispatching to Sauren and the global vendor network.", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" }
          ].map((f, i) => (
            <div key={i} className="group p-8 bg-slate-800/30 border border-slate-700 rounded-2xl hover:bg-slate-800/50 hover:border-emerald-500/50 transition-all cursor-default">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-500 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-400 group-hover:text-slate-900 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={f.icon} />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 grayscale opacity-50">
            <div className="w-6 h-6 bg-slate-400 rounded flex items-center justify-center">
              <span className="text-slate-900 text-[10px] font-bold">A</span>
            </div>
            <span className="text-sm font-bold tracking-tight">AUTOMATE GPS</span>
          </div>
          <div className="text-slate-500 text-xs font-medium">
            © 2025 Enterprise Workflow Solutions. Internal Deployment Only.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FrontPage;
