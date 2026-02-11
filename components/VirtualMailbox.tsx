
import React, { useState, useEffect } from 'react';
import { EmailService, VirtualEmail } from '../services/emailService';

const VirtualMailbox: React.FC = () => {
  const [emails, setEmails] = useState<VirtualEmail[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hasNew, setHasNew] = useState(false);

  useEffect(() => {
    const unsubscribe = EmailService.subscribe((newEmails) => {
      if (newEmails.length > emails.length && !isOpen) {
        setHasNew(true);
      }
      setEmails(newEmails);
    });
    return unsubscribe;
  }, [emails.length, isOpen]);

  if (!isOpen) {
    return (
      <button 
        onClick={() => { setIsOpen(true); setHasNew(false); }}
        className="fixed bottom-8 right-8 w-16 h-16 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-emerald-600 transition-all z-50 group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        {hasNew && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full border-4 border-white animate-bounce"></span>
        )}
      </button>
    );
  }

  return (
    <div className="fixed bottom-8 right-8 w-96 max-h-[600px] bg-slate-900 rounded-[2rem] shadow-2xl flex flex-col z-50 overflow-hidden border border-slate-800 animate-in slide-in-from-bottom-10 duration-300">
      <div className="p-6 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
        <div>
          <h3 className="text-white font-black uppercase text-xs tracking-widest italic">Virtual <span className="text-emerald-400">Mailbox</span></h3>
          <p className="text-[9px] text-slate-500 font-bold uppercase mt-1 tracking-widest">Enterprise Communication Hub</p>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {emails.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">No Incoming Transmissions</p>
          </div>
        ) : (
          emails.map((email) => (
            <div key={email.id} className="bg-slate-800/50 border border-slate-700 p-5 rounded-2xl hover:border-emerald-500/50 transition-all group">
              <div className="flex justify-between items-start mb-3">
                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${email.type === 'SECURITY' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                  {email.type}
                </span>
                <span className="text-[8px] text-slate-500 font-bold">{new Date(email.timestamp).toLocaleTimeString()}</span>
              </div>
              <h4 className="text-white text-[11px] font-black mb-1">{email.subject}</h4>
              <p className="text-slate-400 text-[9px] mb-4 truncate italic">To: {email.to}</p>
              <div className="text-slate-300 text-[10px] leading-relaxed line-clamp-4 bg-slate-900/50 p-3 rounded-xl border border-slate-700 whitespace-pre-wrap">
                {email.body}
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="p-4 bg-slate-800/30 border-t border-slate-800">
        <p className="text-[8px] text-slate-600 font-black uppercase text-center tracking-widest">
          DEVELOPMENT MODE: Communications simulated via Gemini AI
        </p>
      </div>
    </div>
  );
};

export default VirtualMailbox;
