// Donation History API Functions
import { v4 as uuidv4 } from 'uuid';
import type { DonationRecord, DonationCertificate } from '@/types/appointments';
import * as db from './db';

/**
 * Get donation history for a donor
 */
export const getDonationHistory = async (donorId: number | string) => {
  try {
    const records = (await db.getDonationHistory(donorId)) as any[];
    return {
      success: true,
      data: records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Get single donation record
 */
export const getDonationById = async (id: number | string) => {
  // Implement in db.js if needed
  return { success: false, error: 'Not implemented yet' };
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
  const certificateId = `cert-${uuidv4().substring(0, 8)}`;
  const donationId = uuidv4();
  
  const newRecord = {
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
  };
  
  try {
    const createdRecord = await db.createDonationRecord(newRecord);
    
    // Generate certificate (store in DB if needed, for now just return it)
    // Ideally create a certificates collection
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
    
    // await db.createCertificate(certificate); // TODO: Implement this
    
    return {
      success: true,
      data: createdRecord,
      certificate,
      message: 'Donation recorded successfully',
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Get donation certificate
 */
export const getCertificate = async (certificateId: string) => {
  // Implement in db.js
  return { success: false, error: 'Not implemented yet' };
};

/**
 * Get all certificates for a donor
 */
export const getDonorCertificates = async (donorId: number | string) => {
  // Implement in db.js
  return { success: true, data: [] };
};

/**
 * Get donation statistics for a donor
 */
export const getDonationStats = async (donorId: number | string) => {
  try {
    const records = (await db.getDonationHistory(donorId)) as any[];
    const completedRecords = records.filter(r => r.status === 'completed');
    
    const totalDonations = completedRecords.length;
    const totalUnits = completedRecords.reduce((sum, r) => sum + r.units, 0);
    const livesSaved = totalDonations * 3;
    
    const lastDonation = completedRecords.length > 0 
      ? completedRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
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
    completedRecords.forEach(r => {
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
        streak: calculateStreak(completedRecords),
      },
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
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
