// Donation History API Functions
import { v4 as uuidv4 } from 'uuid';
import type { DonationRecord, DonationCertificate } from '@/types/appointments';

// Mock donation records
let donationRecords: DonationRecord[] = [
  {
    id: '1',
    donorId: 1,
    date: '2025-08-15',
    hospitalId: 'jlgmh',
    hospitalName: 'James L. Gordon Memorial Hospital',
    bloodType: 'O+',
    units: 1,
    status: 'completed',
    notes: 'Successful donation',
    certificateId: 'cert-001',
    createdAt: '2025-08-15T10:30:00Z',
  },
  {
    id: '2',
    donorId: 1,
    date: '2025-05-10',
    hospitalId: 'ocgh',
    hospitalName: 'Olongapo City General Hospital',
    bloodType: 'O+',
    units: 1,
    status: 'completed',
    certificateId: 'cert-002',
    createdAt: '2025-05-10T09:15:00Z',
  },
  {
    id: '3',
    donorId: 1,
    date: '2025-01-20',
    hospitalId: 'sjh',
    hospitalName: 'St. James Hospital',
    bloodType: 'O+',
    units: 1,
    status: 'completed',
    certificateId: 'cert-003',
    createdAt: '2025-01-20T14:00:00Z',
  },
];

// Mock certificates
const certificates: Map<string, DonationCertificate> = new Map([
  ['cert-001', {
    id: 'cert-001',
    donationId: '1',
    donorId: 1,
    donorName: 'Juan Dela Cruz',
    bloodType: 'O+',
    date: '2025-08-15',
    hospitalName: 'James L. Gordon Memorial Hospital',
    certificateNumber: 'BC-2025-001234',
    issuedAt: '2025-08-15T11:00:00Z',
  }],
  ['cert-002', {
    id: 'cert-002',
    donationId: '2',
    donorId: 1,
    donorName: 'Juan Dela Cruz',
    bloodType: 'O+',
    date: '2025-05-10',
    hospitalName: 'Olongapo City General Hospital',
    certificateNumber: 'BC-2025-000987',
    issuedAt: '2025-05-10T10:00:00Z',
  }],
]);

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get donation history for a donor
 */
export const getDonationHistory = async (donorId: number | string) => {
  await delay();
  
  const records = donationRecords.filter(r => r.donorId == donorId);
  
  return {
    success: true,
    data: records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  };
};

/**
 * Get single donation record
 */
export const getDonationById = async (id: number | string) => {
  await delay();
  
  const record = donationRecords.find(r => r.id == id);
  
  if (!record) {
    return { success: false, error: 'Donation record not found' };
  }
  
  return { success: true, data: record };
};

/**
 * Record a new donation
 */
export const createDonationRecord = async (data: {
  donorId: number | string;
  donorName: string;
  hospitalId: string;
  hospitalName: string;
  bloodType: string;
  units?: number;
  notes?: string;
}) => {
  await delay();
  
  const certificateId = `cert-${uuidv4().substring(0, 8)}`;
  const donationId = uuidv4();
  
  const newRecord: DonationRecord = {
    id: donationId,
    donorId: data.donorId,
    date: new Date().toISOString().split('T')[0],
    hospitalId: data.hospitalId,
    hospitalName: data.hospitalName,
    bloodType: data.bloodType,
    units: data.units || 1,
    status: 'completed',
    notes: data.notes,
    certificateId,
    createdAt: new Date().toISOString(),
  };
  
  donationRecords.push(newRecord);
  
  // Generate certificate
  const certificate: DonationCertificate = {
    id: certificateId,
    donationId,
    donorId: data.donorId,
    donorName: data.donorName,
    bloodType: data.bloodType,
    date: newRecord.date,
    hospitalName: data.hospitalName,
    certificateNumber: `BC-${new Date().getFullYear()}-${Math.random().toString().slice(2, 8)}`,
    issuedAt: new Date().toISOString(),
  };
  
  certificates.set(certificateId, certificate);
  
  return {
    success: true,
    data: newRecord,
    certificate,
    message: 'Donation recorded successfully',
  };
};

/**
 * Get donation certificate
 */
export const getCertificate = async (certificateId: string) => {
  await delay();
  
  const certificate = certificates.get(certificateId);
  
  if (!certificate) {
    return { success: false, error: 'Certificate not found' };
  }
  
  return { success: true, data: certificate };
};

/**
 * Get all certificates for a donor
 */
export const getDonorCertificates = async (donorId: number | string) => {
  await delay();
  
  const donorCerts: DonationCertificate[] = [];
  certificates.forEach(cert => {
    if (cert.donorId == donorId) {
      donorCerts.push(cert);
    }
  });
  
  return {
    success: true,
    data: donorCerts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  };
};

/**
 * Get donation statistics for a donor
 */
export const getDonationStats = async (donorId: number | string) => {
  await delay();
  
  const records = donationRecords.filter(r => r.donorId == donorId && r.status === 'completed');
  
  const totalDonations = records.length;
  const totalUnits = records.reduce((sum, r) => sum + r.units, 0);
  const livesSaved = totalDonations * 3;
  
  const lastDonation = records.length > 0 
    ? records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
    : null;
  
  // Calculate next eligible date (56 days from last donation)
  let nextEligibleDate: string | null = null;
  if (lastDonation) {
    const nextDate = new Date(lastDonation.date);
    nextDate.setDate(nextDate.getDate() + 56);
    nextEligibleDate = nextDate.toISOString().split('T')[0];
  }
  
  // Donations by year
  const byYear: Record<number, number> = {};
  records.forEach(r => {
    const year = new Date(r.date).getFullYear();
    byYear[year] = (byYear[year] || 0) + 1;
  });
  
  return {
    success: true,
    data: {
      totalDonations,
      totalUnits,
      livesSaved,
      lastDonation: lastDonation?.date || null,
      nextEligibleDate,
      byYear,
      streak: calculateStreak(records),
    },
  };
};

/**
 * Calculate donation streak (consecutive 56-day periods with donation)
 */
function calculateStreak(records: DonationRecord[]): number {
  if (records.length === 0) return 0;
  
  const sortedDates = records
    .map(r => new Date(r.date))
    .sort((a, b) => b.getTime() - a.getTime());
  
  let streak = 1;
  for (let i = 0; i < sortedDates.length - 1; i++) {
    const diff = (sortedDates[i].getTime() - sortedDates[i + 1].getTime()) / (1000 * 60 * 60 * 24);
    if (diff <= 70) { // Allow some flexibility (56 days + 2 weeks)
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}
