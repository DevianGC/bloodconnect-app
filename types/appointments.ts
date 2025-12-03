// Appointment/Scheduling Types

export type AppointmentStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';

export interface Appointment {
  id: number | string;
  donorId: number | string;
  donorName: string;
  hospitalId: string;
  hospitalName: string;
  date: string; // ISO date string
  timeSlot: string; // e.g., "09:00-09:30"
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  reminderSent: boolean;
}

export interface AppointmentCreateInput {
  donorId: number | string;
  hospitalId: string;
  date: string;
  timeSlot: string;
  notes?: string;
}

export interface TimeSlot {
  id: string;
  time: string; // e.g., "09:00"
  endTime: string; // e.g., "09:30"
  available: boolean;
  capacity: number;
  booked: number;
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
  contact: string;
  operatingHours: {
    open: string;
    close: string;
  };
  donationDays: string[]; // e.g., ["Monday", "Wednesday", "Friday"]
  slotDuration: number; // minutes
  slotsPerHour: number;
}

// Donation History Types
export interface DonationRecord {
  id: number | string;
  donorId: number | string;
  date: string;
  hospitalId: string;
  hospitalName: string;
  bloodType: string;
  units: number;
  status: 'completed' | 'rejected' | 'deferred';
  notes?: string;
  certificateId?: string;
  createdAt: string;
}

export interface DonationCertificate {
  id: string;
  donationId: number | string;
  donorId: number | string;
  donorName: string;
  bloodType: string;
  date: string;
  hospitalName: string;
  certificateNumber: string;
  issuedAt: string;
}

// Gamification Types
export type BadgeType = 
  | 'first-donation'
  | 'regular-donor' // 3+ donations
  | 'hero-donor' // 10+ donations
  | 'life-saver' // 25+ donations
  | 'legend' // 50+ donations
  | 'rare-blood' // Rare blood type donor
  | 'quick-responder' // Responded to urgent request
  | 'community-champion'; // Referred 5+ donors

export interface Badge {
  id: string;
  type: BadgeType;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
  level?: number; // For progressive badges
}

export interface DonorStats {
  totalDonations: number;
  livesSaved: number; // totalDonations * 3
  streakDays: number;
  lastDonation: string | null;
  nextEligibleDate: string | null;
  rank: number; // Leaderboard position
  points: number;
  badges: Badge[];
}

export interface LeaderboardEntry {
  rank: number;
  donorId: number | string;
  donorName: string;
  bloodType: string;
  barangay: string;
  totalDonations: number;
  points: number;
  badges: Badge[];
}
