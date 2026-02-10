
import React, { useState } from 'react';
import { checkVehicleRegistration, createRequest } from '../services/firebaseService';
import { User, RequestType } from '../types';

interface RequestFormProps {
  user: User;
  onSuccess: () => void;
}

const RequestForm: React.FC<RequestFormProps> = ({ user, onSuccess }) => {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationMsg, setValidationMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Standard Indian Vehicle Number Format: XX-00-XX-0000
  const vehicleRegex = /^[A-Z]{2}-\d{2}-[A-Z]{1,2}-\d{4}$/;

  const handleValidate = async () => {
    if (!vehicleNumber) return;
    
    // Validate format first
    if (!vehicleRegex.test(vehicleNumber)) {
      setValidationMsg({ type: 'error', text: 'Wrong vehicle number format. Expected: XX-00-XX-0000' });
      return;
    }

    setLoading(true);
    setValidationMsg(null);
    try {
      const isRegistered = await checkVehicleRegistration(vehicleNumber);
      if (isRegistered) {
        setValidationMsg({ type: 'success', text: 'Vehicle registered in platform. Ready for GPS Installation.' });
      } else {
        setValidationMsg({ type: 'error', text: 'Vehicle not found. You may submit a "New Trip Request" instead.' });
      }
    } catch (e) {
      setError('Validation service error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (type: RequestType) => {
    setError(null);
    
    // Final format check before submission
    if (!vehicleRegex.test(vehicleNumber)) {
      setError('Wrong vehicle number format. Please check and try again.');
      return;
    }

    setLoading(true);

    try {
      await createRequest({
        vehicleNumber,
        driverName,
        driverPhone,
        requestType: type,
        createdBy: user.name,
      }, user);
      
      onSuccess();
      setVehicleNumber('');
      setDriverName('');
      setDriverPhone('');
      setValidationMsg(null);
    } catch (err: any) {
      setError(err.message || 'Failed to create request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 bg-slate-50 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-gray-800">New Request Submission</h3>
          <p className="text-sm text-gray-500">Provide vehicle details to initiate workflow.</p>
        </div>
        {validationMsg?.type === 'error' && !validationMsg.text.includes('format') && (
          <div className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full animate-pulse">
            REGISTRATION NOT FOUND
          </div>
        )}
      </div>
      <form onSubmit={(e) => e.preventDefault()} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Vehicle Number *</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={vehicleNumber}
                onChange={(e) => {
                  setVehicleNumber(e.target.value.toUpperCase());
                  setValidationMsg(null);
                }}
                required
                placeholder="e.g. KA-01-ME-1234"
                className="flex-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 text-sm"
              />
              <button
                type="button"
                onClick={handleValidate}
                disabled={!vehicleNumber || loading}
                className="px-4 py-2 bg-slate-700 text-white text-sm font-semibold rounded hover:bg-slate-800 disabled:opacity-50 transition-colors"
              >
                Check
              </button>
            </div>
            {validationMsg && (
              <p className={`mt-2 text-xs font-medium ${validationMsg.type === 'success' ? 'text-emerald-600' : 'text-red-600 font-bold'}`}>
                {validationMsg.text}
              </p>
            )}
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Driver Name</label>
            <input
              type="text"
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              className="block w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 text-sm"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Driver Phone</label>
            <input
              type="tel"
              value={driverPhone}
              onChange={(e) => setDriverPhone(e.target.value)}
              className="block w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 text-sm"
            />
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          {validationMsg?.type === 'error' && !validationMsg.text.includes('format') ? (
            <button
              type="button"
              onClick={() => handleSubmit(RequestType.NEW_TRIP)}
              disabled={loading}
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shadow-md transition-all flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Submit as New Trip Request
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleSubmit(RequestType.GPS_INSTALLATION)}
              disabled={loading || validationMsg?.type !== 'success'}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-md disabled:opacity-50 transition-all"
            >
              {loading ? 'Submitting...' : 'Submit GPS Request'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default RequestForm;
