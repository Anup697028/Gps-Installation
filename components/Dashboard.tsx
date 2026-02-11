
import React, { useState, useEffect, useCallback } from 'react';
import { getRequests, getStats, rhBatchApprove, rhApprove, ptApprove, notifyVendor } from '../services/firebaseService';
import { User, GPSRequest, RequestStatus, UserRole, RequestStats } from '../types';

interface DashboardProps {
  user: User;
  refreshToggle: number;
}

const Dashboard: React.FC<DashboardProps> = ({ user, refreshToggle }) => {
  const [requests, setRequests] = useState<GPSRequest[]>([]);
  const [stats, setStats] = useState<RequestStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRequests(user);
      const s = getStats(data);
      setRequests(data);
      setStats(s);
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Failed to synchronize with backend.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetch(); }, [fetch, refreshToggle]);

  const handleRhBatchApprove = async () => {
    if (window.confirm(`Initialize batch clearance?`)) {
      setActionLoading('batch');
      try {
        await rhBatchApprove(user);
        fetch();
      } catch (e) {
        alert("Batch action failed. Check console for details.");
      } finally {
        setActionLoading(null);
      }
    }
  };

  const handleDecision = async (id: string, role: UserRole, approve: boolean) => {
    let reason = '';
    if (!approve) {
      const input = window.prompt("Reason for cancelling this task:");
      if (input === null) return;
      if (!input.trim()) {
        alert("Cancellation reason is required.");
        return;
      }
      reason = input.trim();
    }

    setActionLoading(id);
    try {
      if (role === UserRole.REGIONAL_HEAD) {
        await rhApprove(id, user, approve, reason);
      } else if (role === UserRole.PAYMENT_TEAM) {
        await ptApprove(id, user, approve, reason);
      }
      fetch();
    } catch (e: any) {
      alert(`Decision Failed: ${e.message || "Insufficient Permissions"}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleVendorNotify = async (id: string) => {
    setActionLoading(id);
    try {
      await notifyVendor(id, user);
      fetch();
    } catch (e) {
      alert("Dispatch Trigger Failed.");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32 space-y-6">
       <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
       <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Synchronizing Backend Ledger...</div>
    </div>
  );

  if (error) return (
    <div className="bg-white rounded-[2.5rem] border-2 border-red-50 p-16 text-center shadow-xl">
      <div className="w-20 h-20 bg-red-100 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="text-2xl font-black text-slate-900 mb-4 uppercase italic">Backend Access Restricted</h3>
      <p className="text-slate-500 text-sm max-w-md mx-auto mb-8 leading-relaxed font-medium">
        Firebase returned a <span className="text-red-600 font-bold">Permission Error</span>. 
        Please ensure your Firestore Security Rules are set to <code className="bg-slate-100 px-2 py-1 rounded text-red-500">allow read, write: if true;</code> and that you have clicked <span className="font-bold underline italic text-slate-900">"Publish"</span> in the console.
      </p>
      <button onClick={fetch} className="px-10 py-4 bg-slate-900 text-white text-[11px] font-black rounded-xl uppercase tracking-widest hover:bg-emerald-600 transition-all">
        Retry Handshake
      </button>
    </div>
  );

  return (
    <div className="space-y-10">
      {/* Action Header for RH */}
      {user.role === UserRole.REGIONAL_HEAD && (
        <div className="bg-slate-900 p-8 rounded-[2rem] text-white flex justify-between items-center shadow-2xl border-b-4 border-emerald-500">
          <div>
            <h3 className="text-2xl font-black italic uppercase tracking-tighter">Daily <span className="text-emerald-400 underline decoration-emerald-500/30">Intake Protocol</span></h3>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-2">Regional Clearance Queue</p>
          </div>
          <button 
            onClick={handleRhBatchApprove} 
            disabled={actionLoading === 'batch' || requests.filter(r => r.status === RequestStatus.PARALLEL_REVIEW && !r.rhApproval).length === 0}
            className="px-8 py-4 bg-emerald-500 text-slate-900 text-[11px] font-black rounded-xl uppercase tracking-widest shadow-xl hover:bg-white transition-all disabled:opacity-20"
          >
             {actionLoading === 'batch' ? 'Authorizing...' : 'Approve All Pending'}
          </button>
        </div>
      )}

      {/* Grid List */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50/50">
            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <th className="px-8 py-6 text-left">Deployment Identity</th>
              <th className="px-8 py-6 text-left">Sector Context</th>
              <th className="px-8 py-6 text-left">Verification Status</th>
              <th className="px-8 py-6 text-right">Action Gateway</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {requests.map(req => (
              <tr key={req.id} className={`group hover:bg-slate-50/50 transition-colors ${req.status === RequestStatus.HALTED ? 'opacity-60 bg-red-50/20' : ''}`}>
                <td className="px-8 py-8">
                  <span className="text-[10px] text-slate-400 font-black block mb-2">#{req.id.slice(-6).toUpperCase()}</span>
                  <div className="flex flex-wrap gap-2">
                    {req.vehicles.map(v => (
                      <span key={v.vehicleNumber} className="bg-slate-900 text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-sm">{v.vehicleNumber}</span>
                    ))}
                  </div>
                  {req.rejectionReason && (
                    <div className="mt-4 p-3 bg-red-100/50 border border-red-200 rounded-xl">
                      <span className="text-[8px] font-black text-red-500 uppercase tracking-widest">Cancellation Reason:</span>
                      <p className="text-[11px] font-bold text-red-800 italic">"{req.rejectionReason}"</p>
                    </div>
                  )}
                </td>
                <td className="px-8 py-8">
                  <div className="text-sm font-black text-slate-900 uppercase tracking-tight">{req.clientName}</div>
                  <div className="text-[10px] text-slate-400 font-black uppercase mt-1 italic">{req.city}</div>
                </td>
                <td className="px-8 py-8">
                   <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-2.5 h-2.5 rounded-full ${req.rhApproval ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-200'}`}></div>
                        <span className={`text-[9px] font-black uppercase tracking-widest ${req.rhApproval ? 'text-slate-900' : 'text-slate-300'}`}>Regional Head</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`w-2.5 h-2.5 rounded-full ${req.paymentApproval ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-200'}`}></div>
                        <span className={`text-[9px] font-black uppercase tracking-widest ${req.paymentApproval ? 'text-slate-900' : 'text-slate-300'}`}>Payment Team</span>
                      </div>
                   </div>
                </td>
                <td className="px-8 py-8 text-right">
                  <div className="flex flex-col items-end gap-3">
                    {/* VC Trigger */}
                    {user.role === UserRole.VENDOR_COORDINATOR && req.status === RequestStatus.VENDOR_COORDINATION && (
                      <button 
                        onClick={() => handleVendorNotify(req.id)}
                        disabled={actionLoading === req.id}
                        className="px-6 py-3 bg-emerald-600 text-white text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg"
                      >
                        {actionLoading === req.id ? 'Dispatching...' : 'Trigger Dispatch'}
                      </button>
                    )}

                    {/* Approver UI */}
                    {((user.role === UserRole.REGIONAL_HEAD && !req.rhApproval) || (user.role === UserRole.PAYMENT_TEAM && !req.paymentApproval)) && req.status === RequestStatus.PARALLEL_REVIEW && (
                      <div className="flex gap-2">
                         <button 
                            onClick={() => handleDecision(req.id, user.role, false)}
                            className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-100"
                            title="Cancel Task"
                         >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                         </button>
                         <button 
                            onClick={() => handleDecision(req.id, user.role, true)}
                            className="px-6 py-3 bg-emerald-500 text-white text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
                         >
                            Approve
                         </button>
                      </div>
                    )}

                    {/* Status Display */}
                    {req.status === RequestStatus.COMPLETED && (
                      <div className="bg-slate-950 px-5 py-3 rounded-2xl border border-slate-800 text-right">
                         <div className="text-emerald-400 text-[9px] font-black uppercase tracking-[0.2em] mb-1">Email Dispatched</div>
                         <div className="text-slate-500 text-[8px] font-bold uppercase">{new Date(req.notificationTimestamp!).toLocaleTimeString()}</div>
                      </div>
                    )}

                    {req.status === RequestStatus.HALTED && (
                      <div className="px-4 py-2 bg-red-100 text-red-600 text-[9px] font-black uppercase rounded-lg border border-red-200">Task Cancelled</div>
                    )}

                    {req.status === RequestStatus.PARALLEL_REVIEW && user.role !== UserRole.REGIONAL_HEAD && user.role !== UserRole.PAYMENT_TEAM && (
                       <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest italic animate-pulse">Pending Review...</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr><td colSpan={4} className="py-20 text-center text-slate-300 font-black uppercase tracking-widest italic">No active requests found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
