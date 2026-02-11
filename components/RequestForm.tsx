
import React, { useState, useEffect } from 'react';
import { fetchVehicles, createRequest } from '../services/firebaseService';
import { User, RequestType, GPSService, GPS_SERVICE_DETAILS, Vehicle, DriverDetail } from '../types';

interface RequestFormProps {
  user: User;
  onSuccess: () => void;
}

const RequestForm: React.FC<RequestFormProps> = ({ user, onSuccess }) => {
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  
  // Verification State
  const [verifyInput, setVerifyInput] = useState('');
  const [verificationResult, setVerificationResult] = useState<{ vehicle: Vehicle; status: 'registered' | 'unregistered' } | null>(null);
  
  // Custom Fields
  const [city, setCity] = useState('');
  const [clientName, setClientName] = useState('');
  
  // Per Vehicle Logistics
  const [logistics, setLogistics] = useState<Record<string, { 
    name: string, 
    phone: string, 
    service: GPSService, 
    time: string,
    isRegistered: boolean
  }>>({});
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const data = await fetchVehicles();
      setAllVehicles(data);
    };
    load();
  }, []);

  const handleVerifyDatabase = () => {
    setError(null);
    if (!verifyInput.trim()) return;
    
    const vNum = verifyInput.trim().toUpperCase();
    const found = allVehicles.find(v => v.vehicleNumber.toUpperCase() === vNum);
    
    if (found) {
      setVerificationResult({
        vehicle: found,
        status: found.isRegistered ? 'registered' : 'unregistered'
      });
    } else {
      setVerificationResult({
        vehicle: { id: `v-new-${Date.now()}`, vehicleNumber: vNum, city: '', clientName: '', isRegistered: false },
        status: 'unregistered'
      });
    }
  };

  const addVerifiedVehicle = () => {
    if (!verificationResult) return;
    const vNum = verificationResult.vehicle.vehicleNumber;
    
    if (selectedVehicles.includes(vNum)) {
      setError("Unit already present in current deployment list.");
      return;
    }

    const next = [...selectedVehicles, vNum];
    
    if (!city && verificationResult.vehicle.city) setCity(verificationResult.vehicle.city);
    if (!clientName && verificationResult.vehicle.clientName) setClientName(verificationResult.vehicle.clientName);

    setSelectedVehicles(next);
    setLogistics(prev => ({
      ...prev,
      [vNum]: { 
        name: '', 
        phone: '', 
        service: GPSService.FLEETX, 
        time: '',
        isRegistered: verificationResult.status === 'registered'
      }
    }));
    
    setVerifyInput('');
    setVerificationResult(null);
  };

  const removeVehicle = (vNum: string) => {
    setSelectedVehicles(prev => prev.filter(v => v !== vNum));
    const newLogs = { ...logistics };
    delete newLogs[vNum];
    setLogistics(newLogs);
  };

  const updateLog = (vNum: string, field: string, val: any) => {
    setLogistics(prev => ({
      ...prev,
      [vNum]: { ...prev[vNum], [field]: val }
    }));
  };

  const handleSubmit = async () => {
    if (selectedVehicles.length === 0 || !city || !clientName) {
      setError("Please ensure Location, Client, and at least one Vehicle are defined.");
      return;
    }
    
    setLoading(true);
    try {
      const hasUnregistered = selectedVehicles.some(v => !logistics[v].isRegistered);
      const reqType = hasUnregistered ? RequestType.NEW_TRIP : RequestType.GPS_INSTALLATION;

      const detailsArray: DriverDetail[] = selectedVehicles.map(v => ({
        vehicleNumber: v,
        driverName: logistics[v].name,
        driverNumber: logistics[v].phone,
        selectedService: logistics[v].service,
        reportingTime: logistics[v].time
      }));

      await createRequest({
        vehicles: selectedVehicles.map(v => ({ vehicleNumber: v })),
        city,
        clientName,
        driverDetails: detailsArray,
        requestType: reqType,
        createdBy: user.name,
      }, user);
      
      onSuccess();
      setSelectedVehicles([]);
      setLogistics({});
      setCity('');
      setClientName('');
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Workflow initialization failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
      <div className="p-10 bg-slate-900 text-white flex flex-col sm:flex-row justify-between items-center gap-6">
        <div>
          <h3 className="text-3xl font-black tracking-tighter italic uppercase flex items-center gap-3">
             <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center not-italic shadow-lg shadow-emerald-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-900" viewBox="0 0 20 20" fill="currentColor">
                   <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                   <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1V8a1 1 0 00-1-1h-5z" />
                </svg>
             </div>
             Field <span className="text-emerald-500">Operation</span> Intake
          </h3>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.4em] mt-3">Workflow Routing & Verification Module</p>
        </div>
        <div className="px-5 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
           <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Cloud Database Linked</span>
        </div>
      </div>

      <div className="p-12 space-y-12">
        <section className="bg-slate-50/50 p-8 rounded-[2rem] border-2 border-slate-100 space-y-6">
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="flex-1 space-y-3">
                 <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest px-1">Vehicle Verification Portal</label>
                 <div className="flex gap-4">
                    <input 
                      type="text" 
                      value={verifyInput}
                      onChange={(e) => setVerifyInput(e.target.value)}
                      placeholder="e.g. KA-01-ME-1234"
                      className="flex-1 p-5 bg-white border-2 border-slate-100 rounded-2xl focus:border-slate-900 outline-none text-sm font-black transition-all uppercase placeholder:text-slate-300"
                    />
                    <button 
                      onClick={handleVerifyDatabase}
                      className="px-8 py-5 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
                    >
                      Verify Status
                    </button>
                 </div>
              </div>

              {verificationResult && (
                <div className="flex-1 animate-in slide-in-from-right duration-300">
                   <div className={`p-5 rounded-2xl border-2 flex items-center justify-between gap-4 ${verificationResult.status === 'registered' ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'}`}>
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Database Entry Match</p>
                         <p className={`text-sm font-black uppercase ${verificationResult.status === 'registered' ? 'text-emerald-700' : 'text-amber-700'}`}>
                            {verificationResult.vehicle.vehicleNumber} // {verificationResult.status === 'registered' ? 'Registered' : 'New Intake'}
                         </p>
                      </div>
                      <button 
                        onClick={addVerifiedVehicle}
                        className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm transition-all active:scale-90 ${verificationResult.status === 'registered' ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-amber-500 text-white hover:bg-amber-600'}`}
                      >
                         Add to Request
                      </button>
                   </div>
                </div>
              )}
           </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest px-1">Target Location *</label>
            <input 
              type="text" 
              value={city} 
              onChange={(e) => setCity(e.target.value)} 
              placeholder="Primary Hub / City"
              className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-slate-900 focus:bg-white outline-none text-sm font-black transition-all"
            />
          </div>
          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest px-1">Client Authorization Entity *</label>
            <input 
              type="text" 
              value={clientName} 
              onChange={(e) => setClientName(e.target.value)} 
              placeholder="Corporate Client Name"
              className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-slate-900 focus:bg-white outline-none text-sm font-black transition-all"
            />
          </div>
        </div>

        <div className="h-px bg-slate-100"></div>

        <div className="space-y-8">
            <div className="flex justify-between items-center px-1">
               <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest leading-none">Deployment Matrix ({selectedVehicles.length} Units)</label>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {selectedVehicles.map(vNum => (
                <div key={vNum} className="p-8 bg-white border-2 border-slate-100 rounded-[2.5rem] space-y-6 shadow-sm hover:border-emerald-200 transition-all relative group">
                  <button 
                    onClick={() => removeVehicle(vNum)}
                    className="absolute top-6 right-6 p-2 text-slate-300 hover:text-red-500 transition-colors"
                  >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>

                  <div className="flex justify-between items-center border-b border-slate-50 pb-6">
                    <div className="text-sm font-black text-slate-900 tracking-widest uppercase flex items-center gap-4 leading-none">
                      <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-[10px] italic shadow-lg">{selectedVehicles.indexOf(vNum) + 1}</div>
                      {vNum}
                    </div>
                    <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border-2 mr-8 ${logistics[vNum].isRegistered ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                      {logistics[vNum].isRegistered ? 'Verified' : 'New Entry'}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Driver Identity</label>
                      <input 
                        value={logistics[vNum]?.name}
                        onChange={(e) => updateLog(vNum, 'name', e.target.value)}
                        placeholder="Full Name"
                        className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xs font-black focus:border-slate-900 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Reporting Time *</label>
                      <input 
                        type="datetime-local"
                        value={logistics[vNum]?.time}
                        onChange={(e) => updateLog(vNum, 'time', e.target.value)}
                        className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xs font-black focus:border-slate-900 outline-none transition-all"
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">GPS Service Provider</label>
                      <div className="flex gap-3">
                        {Object.values(GPSService).map(s => (
                          <button 
                            key={s}
                            onClick={() => updateLog(vNum, 'service', s)}
                            className={`flex-1 py-4 px-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${logistics[vNum]?.service === s ? 'bg-slate-900 border-slate-900 text-white shadow-xl' : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-300'}`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
        </div>

        <div className="pt-10 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-10">
          <div className="text-left space-y-3">
             <div className="flex items-center gap-3">
                <p className="text-[12px] text-slate-900 font-black uppercase tracking-widest leading-none">Workflow Protocol</p>
                <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full ${selectedVehicles.some(v => logistics[v] && !logistics[v].isRegistered) ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                   {selectedVehicles.length === 0 ? 'Awaiting Data' : selectedVehicles.some(v => logistics[v] && !logistics[v].isRegistered) ? 'New Trip' : 'Installation'}
                </span>
             </div>
             <p className="text-[10px] text-slate-400 font-medium max-w-xl leading-relaxed">
               Deployments are synced across all approval tiers. Verified units follow standard parallel review.
             </p>
          </div>
          <button 
            onClick={handleSubmit} 
            disabled={loading || selectedVehicles.length === 0 || !!error}
            className="w-full sm:w-auto px-20 py-6 bg-slate-900 text-white font-black rounded-3xl transition-all uppercase tracking-[0.3em] text-[11px] hover:bg-emerald-600 hover:shadow-2xl disabled:opacity-5 active:scale-95"
          >
            {loading ? 'Syncing...' : 'Submit Request'}
          </button>
        </div>
      </div>
      {error && <div className="px-10 pb-10 text-center text-[10px] font-black text-red-600 uppercase tracking-widest animate-pulse">{error}</div>}
    </div>
  );
};

export default RequestForm;
