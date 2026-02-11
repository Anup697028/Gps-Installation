
import { GoogleGenAI } from "@google/genai";
import { GPSRequest } from '../types';

export interface VirtualEmail {
  id: string;
  to: string;
  subject: string;
  body: string;
  timestamp: string;
  type: 'SECURITY' | 'VENDOR';
}

// Global state for the demo mailbox
let mailboxListeners: ((emails: VirtualEmail[]) => void)[] = [];
const virtualMailbox: VirtualEmail[] = [];

const notifyListeners = () => {
  mailboxListeners.forEach(listener => listener([...virtualMailbox]));
};

/**
 * Enterprise Communication Gateway
 * Uses Gemini API to draft professional communications
 */
export const EmailService = {
  subscribe(listener: (emails: VirtualEmail[]) => void) {
    mailboxListeners.push(listener);
    listener([...virtualMailbox]);
    return () => {
      mailboxListeners = mailboxListeners.filter(l => l !== listener);
    };
  },

  /**
   * Dispatches installation alerts using Gemini for professional drafting
   */
  async sendVendorNotification(request: GPSRequest): Promise<boolean> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `Draft a professional vendor installation request email for the following GPS installation:
    Client: ${request.clientName}
    Location: ${request.city}
    Vehicles: ${request.vehicles.map(v => v.vehicleNumber).join(', ')}
    Request ID: ${request.id}
    Status: Approved for dispatch.
    
    The tone should be formal and urgent. Include specific vehicle details if available.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      const emailBody = response.text || "Formal dispatch request body generation failed. Please proceed with manual coordination.";

      const email: VirtualEmail = {
        id: `msg-${Date.now()}`,
        to: "logistics-ops@vendor-gateway.com",
        subject: `ACTION REQUIRED: GPS Installation Request #${request.id.slice(-6).toUpperCase()}`,
        body: emailBody,
        timestamp: new Date().toISOString(),
        type: 'VENDOR'
      };

      virtualMailbox.unshift(email);
      notifyListeners();
      return true;
    } catch (e) {
      console.error("AI Dispatch Error:", e);
      return false;
    }
  },

  /**
   * Dispatches Security OTPs with AI-generated security warnings
   */
  async sendSecurityOTP(emailAddr: string, otp: string): Promise<boolean> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `Write a very brief, high-security enterprise verification email for user ${emailAddr}. 
    Include the OTP code: ${otp}. 
    The email should look like a standard corporate security alert.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      const emailBody = response.text || `Your security code is: ${otp}`;

      const email: VirtualEmail = {
        id: `otp-${Date.now()}`,
        to: emailAddr,
        subject: "Security: Your Single-Use Access Token",
        body: emailBody,
        timestamp: new Date().toISOString(),
        type: 'SECURITY'
      };

      virtualMailbox.unshift(email);
      notifyListeners();
      return true;
    } catch (e) {
      console.error("AI OTP Generation Error:", e);
      // Fallback if API fails
      virtualMailbox.unshift({
        id: `otp-fb-${Date.now()}`,
        to: emailAddr,
        subject: "Security Access Code",
        body: `Your access code is: ${otp}`,
        timestamp: new Date().toISOString(),
        type: 'SECURITY'
      });
      notifyListeners();
      return false;
    }
  }
};
