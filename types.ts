
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

export enum GPSService {
  FLEETX = 'Fleetx',
  WHEELSEYE = 'Wheelseye'
}

export const GPS_SERVICE_DETAILS = {
  [GPSService.FLEETX]: { price: 2000, refundable: true },
  [GPSService.WHEELSEYE]: { price: 3000, refundable: false },
};

export enum RequestStatus {
  REQUEST_CREATED = 'REQUEST_CREATED',
  PARALLEL_REVIEW = 'PARALLEL_REVIEW',
  VENDOR_COORDINATION = 'VENDOR_COORDINATION',
  COMPLETED = 'COMPLETED',
  HALTED = 'HALTED'
}

export interface AuditLog {
  userId: string;
  userName: string;
  action: string;
  statusFrom: string;
  statusTo: string;
  timestamp: string;
  notes?: string;
}

export interface DriverDetail {
  vehicleNumber: string;
  driverName: string;
  driverNumber: string;
  selectedService: GPSService;
  reportingTime: string;
}

export interface GPSRequest {
  id: string;
  vehicles: { vehicleNumber: string }[];
  city: string;
  clientName: string;
  driverDetails: DriverDetail[];
  status: RequestStatus;
  requestType: RequestType;
  rhApproval: boolean;
  paymentApproval: boolean;
  vendorName?: string;
  notificationTimestamp?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  history: AuditLog[];
  rejectionReason?: string | null;
}

export interface RequestStats {
  daily: { approved: number; rejected: number; pending: number };
  weekly: { approved: number; rejected: number; pending: number };
  monthly: { approved: number; rejected: number; pending: number };
}

export interface Vehicle {
  id: string;
  vehicleNumber: string;
  clientName: string;
  city: string;
  isRegistered: boolean;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  password?: string;
  lastLoginDate?: string;
}
