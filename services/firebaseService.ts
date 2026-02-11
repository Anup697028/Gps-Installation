
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  updateDoc, 
  doc, 
  getDoc,
  setDoc,
  orderBy
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { GPSRequest, RequestStatus, User, RequestStats, UserRole, Vehicle, AuditLog } from '../types';
import { MOCK_VEHICLES } from '../constants';
import { EmailService } from './emailService';

// Firestore Rules for Development:
// match /databases/{database}/documents {
//   match /{document=**} {
//     allow read, write: if true;
//   }
// }
// IMPORTANT: You MUST click "Publish" in the Firebase Console for these to take effect.

const firebaseConfig = {
  apiKey: "AIzaSyDQ7BhCrbFdEGR0swQao_WGG4OvRh6AbyU",
  authDomain: "gps-integration-b1a2e.firebaseapp.com",
  projectId: "gps-integration-b1a2e",
  storageBucket: "gps-integration-b1a2e.firebasestorage.app",
  messagingSenderId: "859631702276",
  appId: "1:859631702276:web:737e01741b5b7502910051",
  measurementId: "G-5RNX1DQMS2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const fetchVehicles = async (): Promise<Vehicle[]> => {
  return MOCK_VEHICLES;
};

export const authenticateUser = async (email: string, password?: string): Promise<User> => {
  try {
    const q = query(collection(db, "users"), where("email", "==", email.toLowerCase().trim()));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) throw new Error('User not found in system directory.');
    
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data() as User;
    
    if (userData.password !== password) throw new Error('Invalid credentials provided.');

    const today = new Date().toISOString().split('T')[0];
    if (userData.role === UserRole.REGIONAL_HEAD && userData.lastLoginDate === today) {
      throw new Error('Compliance: Regional Heads are restricted to one session per calendar day.');
    }

    await updateDoc(doc(db, "users", userDoc.id), { lastLoginDate: today });
    return { ...userData, id: userDoc.id };
  } catch (error: any) {
    console.error("Auth Error:", error.code, error.message);
    throw error;
  }
};

export const initiateRegistration = async (userData: Omit<User, 'id'>): Promise<string> => {
  try {
    const q = query(collection(db, "users"), where("email", "==", userData.email.toLowerCase()));
    const snap = await getDocs(q);
    if (!snap.empty) throw new Error('Account already exists.');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Using string for createdAt to maintain consistency with types
    await setDoc(doc(db, "registrations", userData.email.toLowerCase()), {
      ...userData,
      otp,
      createdAt: new Date().toISOString()
    });

    await EmailService.sendSecurityOTP(userData.email, otp);
    return otp;
  } catch (error: any) {
    console.error("Registration Initiation Error:", error.code, error.message);
    throw error;
  }
};

export const verifyAndRegister = async (email: string, otp: string): Promise<void> => {
  try {
    const regRef = doc(db, "registrations", email.toLowerCase());
    const regDoc = await getDoc(regRef);
    
    if (!regDoc.exists() || regDoc.data()?.otp !== otp) {
      throw new Error('Invalid or Expired verification code.');
    }

    const userData = regDoc.data();
    await addDoc(collection(db, "users"), {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role,
      createdAt: new Date().toISOString()
    });

    await updateDoc(regRef, { status: 'COMPLETED' });
  } catch (error: any) {
    console.error("Verification Error:", error.code, error.message);
    throw error;
  }
};

export const createRequest = async (
  data: Omit<GPSRequest, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'history' | 'rhApproval' | 'paymentApproval'>,
  user: User
): Promise<GPSRequest> => {
  try {
    const newRequest = {
      ...data,
      status: RequestStatus.PARALLEL_REVIEW,
      rhApproval: false,
      paymentApproval: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      history: [{
        userId: user.id,
        userName: user.name,
        action: 'Intake Created',
        statusFrom: 'NONE',
        statusTo: RequestStatus.PARALLEL_REVIEW,
        timestamp: new Date().toISOString()
      }]
    };
    
    const docRef = await addDoc(collection(db, "requests"), newRequest);
    return { ...newRequest, id: docRef.id } as GPSRequest;
  } catch (error: any) {
    console.error("Request Creation Error:", error.code, error.message);
    throw error;
  }
};

export const rhApprove = async (requestId: string, user: User, approve: boolean, reason?: string): Promise<void> => {
  const ref = doc(db, "requests", requestId);
  const snap = await getDoc(ref);
  const req = snap.data() as GPSRequest;

  const newStatus = approve ? (req.paymentApproval ? RequestStatus.VENDOR_COORDINATION : RequestStatus.PARALLEL_REVIEW) : RequestStatus.HALTED;
  
  const log: AuditLog = {
    userId: user.id,
    userName: user.name,
    action: approve ? 'RH Approved' : 'RH Cancelled',
    statusFrom: req.status,
    statusTo: newStatus,
    timestamp: new Date().toISOString(),
    notes: reason
  };

  await updateDoc(ref, {
    rhApproval: approve,
    status: newStatus,
    rejectionReason: !approve ? reason : null,
    history: [...req.history, log],
    updatedAt: new Date().toISOString()
  });
};

export const ptApprove = async (requestId: string, user: User, approve: boolean, reason?: string): Promise<void> => {
  const ref = doc(db, "requests", requestId);
  const snap = await getDoc(ref);
  const req = snap.data() as GPSRequest;

  const newStatus = approve ? (req.rhApproval ? RequestStatus.VENDOR_COORDINATION : RequestStatus.PARALLEL_REVIEW) : RequestStatus.HALTED;
  
  const log: AuditLog = {
    userId: user.id,
    userName: user.name,
    action: approve ? 'PT Approved' : 'PT Cancelled',
    statusFrom: req.status,
    statusTo: newStatus,
    timestamp: new Date().toISOString(),
    notes: reason
  };

  await updateDoc(ref, {
    paymentApproval: approve,
    status: newStatus,
    rejectionReason: !approve ? reason : null,
    history: [...req.history, log],
    updatedAt: new Date().toISOString()
  });
};

export const rhBatchApprove = async (user: User): Promise<void> => {
  try {
    const q = query(collection(db, "requests"), where("status", "==", RequestStatus.PARALLEL_REVIEW), where("rhApproval", "==", false));
    const snap = await getDocs(q);
    
    const promises = snap.docs.map(async (d) => {
      const req = d.data() as GPSRequest;
      const newStatus = req.paymentApproval ? RequestStatus.VENDOR_COORDINATION : RequestStatus.PARALLEL_REVIEW;
      return updateDoc(doc(db, "requests", d.id), {
        rhApproval: true,
        status: newStatus,
        history: [...req.history, {
          userId: user.id,
          userName: user.name,
          action: 'RH Batch Approval',
          statusFrom: req.status,
          statusTo: newStatus,
          timestamp: new Date().toISOString()
        }]
      });
    });
    await Promise.all(promises);
  } catch (error: any) {
    console.error("Batch Approval Error:", error.code, error.message);
    throw error;
  }
};

export const notifyVendor = async (requestId: string, user: User): Promise<void> => {
  const ref = doc(db, "requests", requestId);
  const snap = await getDoc(ref);
  const req = snap.data() as GPSRequest;

  await EmailService.sendVendorNotification({ ...req, id: requestId });
  
  await updateDoc(ref, {
    status: RequestStatus.COMPLETED,
    notificationTimestamp: new Date().toISOString(),
    history: [...req.history, {
      userId: user.id,
      userName: user.name,
      action: 'Vendor Dispatched',
      statusFrom: req.status,
      statusTo: RequestStatus.COMPLETED,
      timestamp: new Date().toISOString()
    }]
  });
};

export const getRequests = async (user: User): Promise<GPSRequest[]> => {
  try {
    // Simplified query to avoid index-related permission issues
    const q = query(collection(db, "requests"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    const all = snap.docs.map(d => ({ ...d.data(), id: d.id })) as GPSRequest[];

    if (user.role === UserRole.FIELD_OPERATOR) {
      return all.filter(r => r.createdBy === user.name);
    }
    return all;
  } catch (error: any) {
    console.error("Fetch Requests Error:", error.code, error.message);
    throw error;
  }
};

export const getStats = (requests: GPSRequest[]): RequestStats => {
  const counts = (list: GPSRequest[]) => ({
    approved: list.filter(r => r.status === RequestStatus.COMPLETED).length,
    rejected: list.filter(r => r.status === RequestStatus.HALTED).length,
    pending: list.filter(r => r.status !== RequestStatus.COMPLETED && r.status !== RequestStatus.HALTED).length,
  });
  return { daily: counts(requests), weekly: counts(requests), monthly: counts(requests) };
};
