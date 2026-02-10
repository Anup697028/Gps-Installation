
export enum UserRole {
  FIELD_OPERATOR = 'FIELD_OPERATOR',
  REGIONAL_HEAD = 'REGIONAL_HEAD',
  PAYMENT_TEAM = 'PAYMENT_TEAM',
  VENDOR_COORDINATOR = 'VENDOR_COORDINATOR'
}

export enum RequestType {
  GPS_INSTALLATION = 'GPS_INSTALLATION',
  NEW_TRIP = 'NEW_TRIP'
}

export enum RequestStatus {
  PENDING = 'pending',
  EDIT = 'edit',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  VERIFIED = 'verified', // Payment Team step
  COMPLETED = 'completed' // Vendor Coordinator step
}

export interface AuditLog {
  userId: string;
  userName: string;
  action: string;
  statusFrom: RequestStatus | 'none';
  statusTo: RequestStatus;
  timestamp: string;
  notes?: string;
}

export interface GPSRequest {
  id: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  status: RequestStatus;
  requestType: RequestType;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  regionalHeadNotes?: string;
  paymentTeamNotes?: string;
  history: AuditLog[];
}

export interface Vehicle {
  id: string;
  vehicleNumber: string;
  isRegistered: boolean;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}
