
import { UserRole, User, Vehicle, RequestStatus } from './types';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'John Operator', role: UserRole.FIELD_OPERATOR, email: 'john@fo.com', password: 'password123' },
  { id: 'u2', name: 'Sarah Regional', role: UserRole.REGIONAL_HEAD, email: 'sarah@rh.com', password: 'password123' },
  { id: 'u3', name: 'Mike Payment', role: UserRole.PAYMENT_TEAM, email: 'mike@pt.com', password: 'password123' },
  { id: 'u4', name: 'Sauren Vendor', role: UserRole.VENDOR_COORDINATOR, email: 'sauren@vc.com', password: 'password123' },
];

export const MOCK_VEHICLES: Vehicle[] = [
  { id: 'v1', vehicleNumber: 'KA-01-ME-1234', clientName: 'Amazon', city: 'Bangalore', isRegistered: true },
  { id: 'v2', vehicleNumber: 'KA-01-ME-5678', clientName: 'Amazon', city: 'Bangalore', isRegistered: true },
  { id: 'v3', vehicleNumber: 'MH-12-AB-5678', clientName: 'Flipkart', city: 'Pune', isRegistered: true },
  { id: 'v4', vehicleNumber: 'MH-12-AB-1111', clientName: 'Flipkart', city: 'Pune', isRegistered: true },
  { id: 'v5', vehicleNumber: 'DL-04-XY-9012', clientName: 'Zomato', city: 'Delhi', isRegistered: false },
  { id: 'v6', vehicleNumber: 'KA-01-ME-9999', clientName: 'Amazon', city: 'Bangalore', isRegistered: true },
];

export const STATUS_COLORS: Record<RequestStatus, string> = {
  [RequestStatus.REQUEST_CREATED]: 'bg-slate-100 text-slate-800',
  [RequestStatus.PARALLEL_REVIEW]: 'bg-amber-100 text-amber-800',
  [RequestStatus.VENDOR_COORDINATION]: 'bg-blue-100 text-blue-800',
  [RequestStatus.COMPLETED]: 'bg-emerald-100 text-emerald-800',
  [RequestStatus.HALTED]: 'bg-red-100 text-red-800',
};
