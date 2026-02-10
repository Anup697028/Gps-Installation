
import { UserRole, User, Vehicle, RequestStatus } from './types';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'John Operator', role: UserRole.FIELD_OPERATOR, email: 'john@fo.com' },
  { id: 'u2', name: 'Sarah Regional', role: UserRole.REGIONAL_HEAD, email: 'sarah@rh.com' },
  { id: 'u3', name: 'Mike Payment', role: UserRole.PAYMENT_TEAM, email: 'mike@pt.com' },
  { id: 'u4', name: 'Sauren Vendor', role: UserRole.VENDOR_COORDINATOR, email: 'sauren@vc.com' },
];

export const MOCK_VEHICLES: Vehicle[] = [
  { id: 'v1', vehicleNumber: 'KA-01-ME-1234', isRegistered: true },
  { id: 'v2', vehicleNumber: 'MH-12-AB-5678', isRegistered: true },
  { id: 'v3', vehicleNumber: 'DL-04-XY-9012', isRegistered: false },
];

export const STATUS_COLORS: Record<RequestStatus, string> = {
  [RequestStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
  [RequestStatus.EDIT]: 'bg-blue-100 text-blue-800',
  [RequestStatus.APPROVED]: 'bg-emerald-100 text-emerald-800',
  [RequestStatus.REJECTED]: 'bg-red-100 text-red-800',
  [RequestStatus.VERIFIED]: 'bg-indigo-100 text-indigo-800',
  [RequestStatus.COMPLETED]: 'bg-gray-100 text-gray-800',
};
