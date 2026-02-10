
import React, { useState, useEffect, useCallback } from 'react';
import { getRequests, updateRequestStatus } from '../services/firebaseService';
import { User, GPSRequest, RequestStatus, UserRole, AuditLog, RequestType } from '../types';
import { STATUS_COLORS } from '../constants';

interface DashboardProps {
  user: User;
  refreshToggle: number;
}

const HistoryModal: React.FC<{ request: GPSRequest; onClose: () => void }> = ({ request, onClose }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-gray-200">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Audit History</h3>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">Request ID: {request.id}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400 hover:text-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          <div className="relative border-l-2 border-slate-100 ml-3 space-y-8">
            {request.history.map((log, index) => (
              <div key={index} className="relative pl-8">
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-emerald-500 shadow-sm"></div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-bold text-gray-800">{log.userName}</span>
                    <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-medium">
                      {log.action}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${STATUS_COLORS[log.statusFrom] || 'bg-gray-100 text-gray-400'}`}>
                      {log.statusFrom}
                    </span>
                    <span className="text-gray-300">→</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${STATUS_COLORS[log.statusTo]}`}>
                      {log.statusTo}
                    </span>
                  </div>
                  {log.notes && (
                    <div className="mt-3 p-3 bg-amber-50 border border-amber-100 rounded-lg text-sm text-amber-900 italic">
                      "{log.notes}"
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-slate-800 text-white font-bold text-sm rounded-lg hover:bg-slate-900 transition-all shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ user, refreshToggle }) => {
  const [requests, setRequests] = useState<GPSRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<string>('');
  const [selectedRequest, setSelectedRequest] = useState<GPSRequest | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    const data = await getRequests(user);
    setRequests(data);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetch();
  }, [fetch, refreshToggle]);

  const handleAction = async (requestId: string, nextStatus: RequestStatus) => {
    try {
      await updateRequestStatus(requestId, nextStatus, user, notes);
      setNotes('');
      fetch();
    } catch (err) {
      alert('Error updating status');
    }
  };

  if (loading) return <div className="text-center py-10">Loading workflow data...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">Request Pipeline</h3>
        <div className="text-sm text-gray-500">Showing {requests.length} records relevant to your role.</div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID / Date</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type / Vehicle</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-gray-400 italic">No active requests found for your queue.</td>
              </tr>
            ) : (
              requests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-900">{req.id}</div>
                    <div className="text-xs text-gray-500">{new Date(req.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-black uppercase tracking-tighter ${req.requestType === RequestType.NEW_TRIP ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-blue-100 text-blue-800 border border-blue-200'}`}>
                        {req.requestType === RequestType.NEW_TRIP ? 'TRIP' : 'GPS'}
                      </span>
                      <span className="text-sm font-medium text-gray-900">{req.vehicleNumber}</span>
                    </div>
                    <div className="text-xs text-gray-500">{req.driverName || 'No Driver'} • {req.driverPhone || 'No Phone'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${STATUS_COLORS[req.status]}`}>
                      {req.status}
                    </span>
                    {(req.regionalHeadNotes || req.paymentTeamNotes) && (
                      <div className="mt-1 text-[10px] text-gray-400 italic max-w-[150px] truncate">
                         Notes attached
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex flex-col gap-2 items-end">
                      {/* Regional Head Controls */}
                      {user.role === UserRole.REGIONAL_HEAD && req.status === RequestStatus.PENDING && (
                        <div className="flex flex-col gap-2">
                          <input 
                            placeholder="Approval notes..." 
                            className="text-xs p-1 border rounded w-48"
                            onChange={(e) => setNotes(e.target.value)}
                          />
                          <div className="flex gap-2 justify-end">
                            <button onClick={() => handleAction(req.id, RequestStatus.APPROVED)} className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded shadow-sm hover:bg-emerald-700 transition-colors">Approve</button>
                            <button onClick={() => handleAction(req.id, RequestStatus.EDIT)} className="px-3 py-1 bg-yellow-500 text-white text-xs font-bold rounded shadow-sm hover:bg-yellow-600 transition-colors">Need Edit</button>
                            <button onClick={() => handleAction(req.id, RequestStatus.REJECTED)} className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded shadow-sm hover:bg-red-700 transition-colors">Reject</button>
                          </div>
                        </div>
                      )}

                      {/* Payment Team Controls */}
                      {user.role === UserRole.PAYMENT_TEAM && req.status === RequestStatus.APPROVED && (
                        <div className="flex flex-col gap-2">
                          <input 
                            placeholder="Transaction ID / Note" 
                            className="text-xs p-1 border rounded w-48"
                            onChange={(e) => setNotes(e.target.value)}
                          />
                          <div className="flex gap-2 justify-end">
                            <button onClick={() => handleAction(req.id, RequestStatus.VERIFIED)} className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded shadow-sm hover:bg-indigo-700 transition-colors">Verify Payment</button>
                            <button onClick={() => handleAction(req.id, RequestStatus.REJECTED)} className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded shadow-sm hover:bg-red-700 transition-colors">Reject</button>
                          </div>
                        </div>
                      )}

                      {/* Vendor Coordinator Controls */}
                      {user.role === UserRole.VENDOR_COORDINATOR && req.status === RequestStatus.VERIFIED && (
                        <button onClick={() => handleAction(req.id, RequestStatus.COMPLETED)} className="px-4 py-1.5 bg-slate-800 text-white text-xs font-bold rounded shadow-md hover:bg-slate-900 transition-all">Mark Installed</button>
                      )}

                      {/* History Trigger */}
                      <button 
                         onClick={() => setSelectedRequest(req)}
                         className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold hover:text-emerald-700 group transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        View History
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* History Modal */}
      {selectedRequest && (
        <HistoryModal 
          request={selectedRequest} 
          onClose={() => setSelectedRequest(null)} 
        />
      )}
    </div>
  );
};

export default Dashboard;
