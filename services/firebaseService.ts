
import { GPSRequest, RequestStatus, RequestType, AuditLog, User, Vehicle } from '../types';
import { MOCK_VEHICLES } from '../constants';

/**
 * FIRESTORE SCHEMA DESIGN
 * 
 * Collection: requests
 * - id: string
 * - vehicleNumber: string
 * - driverName: string
 * - driverPhone: string
 * - status: enum (pending | edit | approved | verified | rejected | completed)
 * - requestType: enum (GPS_INSTALLATION | NEW_TRIP)
 * - createdBy: string (uid)
 * - createdAt: timestamp
 * - updatedAt: timestamp
 * - history: array of objects (AuditLog)
 */

let requestsStore: GPSRequest[] = [];

export const checkVehicleRegistration = async (vehicleNumber: string): Promise<boolean> => {
  const vehicle = MOCK_VEHICLES.find(v => v.vehicleNumber.toUpperCase() === vehicleNumber.toUpperCase());
  return vehicle ? vehicle.isRegistered : false;
};

export const createRequest = async (
  data: Omit<GPSRequest, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'history'>,
  user: User
): Promise<GPSRequest> => {
  // Only check registration for standard GPS Installation requests
  if (data.requestType === RequestType.GPS_INSTALLATION) {
    const isRegistered = await checkVehicleRegistration(data.vehicleNumber);
    if (!isRegistered) {
      throw new Error('Request creation blocked: Vehicle is not registered for GPS Installation.');
    }
  }

  const newRequest: GPSRequest = {
    ...data,
    id: `REQ-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    status: RequestStatus.PENDING,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    history: [{
      userId: user.id,
      userName: user.name,
      action: `Initial Submission (${data.requestType.replace('_', ' ')})`,
      statusFrom: 'none',
      statusTo: RequestStatus.PENDING,
      timestamp: new Date().toISOString(),
    }]
  };

  requestsStore = [newRequest, ...requestsStore];
  return newRequest;
};

export const updateRequestStatus = async (
  requestId: string,
  newStatus: RequestStatus,
  user: User,
  notes?: string
): Promise<GPSRequest> => {
  const index = requestsStore.findIndex(r => r.id === requestId);
  if (index === -1) throw new Error('Request not found');

  const oldRequest = requestsStore[index];
  const audit: AuditLog = {
    userId: user.id,
    userName: user.name,
    action: `Changed status to ${newStatus}`,
    statusFrom: oldRequest.status,
    statusTo: newStatus,
    timestamp: new Date().toISOString(),
    notes: notes
  };

  const updatedRequest: GPSRequest = {
    ...oldRequest,
    status: newStatus,
    updatedAt: new Date().toISOString(),
    history: [...oldRequest.history, audit],
    ...(notes ? (user.role === 'REGIONAL_HEAD' ? { regionalHeadNotes: notes } : { paymentTeamNotes: notes }) : {})
  };

  requestsStore[index] = updatedRequest;
  return updatedRequest;
};

export const getRequests = async (user: User): Promise<GPSRequest[]> => {
  switch(user.role) {
    case 'FIELD_OPERATOR':
      return requestsStore.filter(r => r.createdBy === user.name);
    case 'REGIONAL_HEAD':
      return requestsStore;
    case 'PAYMENT_TEAM':
      return requestsStore.filter(r => r.status === RequestStatus.APPROVED || r.status === RequestStatus.VERIFIED || r.status === RequestStatus.REJECTED);
    case 'VENDOR_COORDINATOR':
      return requestsStore.filter(r => r.status === RequestStatus.VERIFIED || r.status === RequestStatus.COMPLETED);
    default:
      return [];
  }
};
