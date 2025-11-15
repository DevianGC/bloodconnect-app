export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export type DonorStatus = 'active' | 'inactive' | string;
export interface Donor {
  id: number;
  name: string;
  email: string;
  bloodType: string;
  contact: string;
  address: string;
  barangay: string;
  lastDonation?: string;
  status: DonorStatus;
  emailAlerts: boolean;
}

export type RequestStatus = 'active' | 'fulfilled' | string;
export type Urgency = 'normal' | 'urgent' | 'critical' | string;
export interface Request {
  id: number;
  hospitalName: string;
  bloodType: string;
  quantity: number;
  urgency: Urgency;
  notes?: string;
  status: RequestStatus;
  createdAt: string;
  matchedDonors: number;
}

export interface RequestCreateInput {
  hospitalName: string;
  bloodType: string;
  quantity: number;
  urgency: 'normal' | 'urgent' | 'critical';
  notes?: string;
}

export type AlertStatus = 'sent' | 'fulfilled' | string;
export interface Alert {
  id: number;
  title: string;
  message: string;
  hospitalName: string;
  bloodType: string;
  quantity: number;
  sentAt: string;
  status: AlertStatus;
}

export interface Analytics {
  totalDonors: number;
  activeRequests: number;
  totalRequests: number;
  donorsByBloodType: Record<string, number>;
  donorsByBarangay: Record<string, number>;
  recentActivity: { date: string; event: string; count: number }[];
}

export interface DonorFilters {
  bloodType?: string;
  barangay?: string;
  status?: DonorStatus;
  search?: string;
}

export interface RequestFilters {
  status?: RequestStatus;
  bloodType?: string;
}

export interface AlertFilters {
  donorId?: number | string;
}
// Additional types for admin interfaces
export interface DonorCreateInput {
  name: string;
  email: string;
  bloodType: string;
  contact: string;
  address: string;
  barangay: string;
  lastDonation?: string;
  emailAlerts: boolean;
}

export interface BloodRequest {
  id: number;
  hospitalName: string;
  bloodType: string;
  quantity: number;
  urgency: string;
  notes?: string;
  status: string;
  createdAt: string;
  matchedDonors: number;
}

export interface BloodRequestCreateInput {
  patientName: string;
  hospital: string;
  bloodType: string;
  units: number;
  urgency: 'normal' | 'urgent' | 'critical';
  requestDate: string;
  reason: string;
  contact: string;
  barangay: string;
}

export interface BloodRequestFilters {
  bloodType?: string;
  barangay?: string;
  urgency?: string;
  status?: string;
  search?: string;
}
