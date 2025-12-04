// Gamification System - Badges, Points, and Achievements
import { v4 as uuidv4 } from 'uuid';
import type { Badge, BadgeType, DonorStats, LeaderboardEntry } from '@/types/appointments';
import type { Donor } from '@/types/api';
import { isRareBloodType, BloodType } from './bloodCompatibility';
import * as db from './db';

interface Donation {
  id: string;
  date: string;
  status: string;
  [key: string]: any;
}

// Badge definitions
export const BADGE_DEFINITIONS: Record<BadgeType, {
  name: string;
  description: string;
  icon: string;
  pointsRequired?: number;
  donationsRequired?: number;
}> = {
  'first-donation': {
    name: 'First Drop',
    description: 'Completed your first blood donation',
    icon: '🩸',
    donationsRequired: 1,
  },
  'regular-donor': {
    name: 'Regular Donor',
    description: 'Completed 3 or more donations',
    icon: '💪',
    donationsRequired: 3,
  },
  'hero-donor': {
    name: 'Hero Donor',
    description: 'Completed 10 or more donations',
    icon: '🦸',
    donationsRequired: 10,
  },
  'life-saver': {
    name: 'Life Saver',
    description: 'Completed 25 or more donations - saved 75+ lives!',
    icon: '❤️‍🔥',
    donationsRequired: 25,
  },
  'legend': {
    name: 'Legendary Donor',
    description: 'Completed 50 or more donations - a true legend!',
    icon: '👑',
    donationsRequired: 50,
  },
  'rare-blood': {
    name: 'Rare Gem',
    description: 'Donor with a rare blood type (O-, A-, B-, AB-)',
    icon: '💎',
  },
  'quick-responder': {
    name: 'Quick Responder',
    description: 'Responded to an urgent blood request within 2 hours',
    icon: '⚡',
  },
  'community-champion': {
    name: 'Community Champion',
    description: 'Referred 5 or more donors to the platform',
    icon: '🏆',
  },
};

// Points system
export const POINTS = {
  DONATION_COMPLETED: 100,
  URGENT_RESPONSE: 50,
  REFERRAL: 25,
  PROFILE_COMPLETE: 10,
  STREAK_BONUS: 20, // Per consecutive eligible period donation
  RARE_BLOOD_BONUS: 30, // Extra points for rare blood types
};

// Initialize default stats for a donor
const getDefaultStats = (): DonorStats => ({
  totalDonations: 0,
  livesSaved: 0,
  streakDays: 0,
  lastDonation: null,
  nextEligibleDate: null,
  rank: 0,
  points: 0,
  badges: [],
});

/**
 * Get donor stats
 */
export const getDonorStats = async (donorId: number | string): Promise<DonorStats> => {
  // In a real app, fetch from DB. For now, calculate from donation history
  try {
    const history = (await db.getDonationHistory(donorId)) as Donation[];
    const completed = history.filter(r => r.status === 'completed');
    
    const stats = getDefaultStats();
    stats.totalDonations = completed.length;
    stats.livesSaved = stats.totalDonations * 3;
    stats.points = stats.totalDonations * POINTS.DONATION_COMPLETED; // Simplified points calc
    
    if (completed.length > 0) {
        const sorted = completed.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        stats.lastDonation = sorted[0].date;
        
        const nextDate = new Date(stats.lastDonation);
        nextDate.setDate(nextDate.getDate() + 56);
        stats.nextEligibleDate = nextDate.toISOString().split('T')[0];
    }
    
    // Recalculate badges based on history
    const badges = checkForNewBadges(stats); // Pass blood type if available
    stats.badges = badges.map(type => ({
        id: uuidv4(),
        type,
        name: BADGE_DEFINITIONS[type].name,
        description: BADGE_DEFINITIONS[type].description,
        icon: BADGE_DEFINITIONS[type].icon,
        earnedAt: new Date().toISOString() // Approximate
    }));
    
    return stats;
  } catch (error) {
    console.error("Error getting donor stats:", error);
    return getDefaultStats();
  }
};

/**
 * Update donor stats after donation
 */
export const recordDonation = async (
  donorId: number | string, 
  bloodType: BloodType
): Promise<{ stats: DonorStats; newBadges: Badge[] }> => {
  // This logic should ideally be server-side or in a cloud function triggered by DB update
  // For now, we just return the calculated stats
  const stats = await getDonorStats(donorId);
  const newBadges: Badge[] = [];
  
  // Update basic stats (simulated as if donation just happened)
  stats.totalDonations += 1;
  stats.livesSaved = stats.totalDonations * 3;
  stats.lastDonation = new Date().toISOString();
  
  // Calculate next eligible date (56 days)
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + 56);
  stats.nextEligibleDate = nextDate.toISOString();
  
  // Add points
  stats.points += POINTS.DONATION_COMPLETED;
  
  // Bonus for rare blood types
  if (isRareBloodType(bloodType)) {
    stats.points += POINTS.RARE_BLOOD_BONUS;
  }
  
  // Check for new badges
  const badgesEarned = checkForNewBadges(stats, bloodType);
  for (const badgeType of badgesEarned) {
    if (!stats.badges.find(b => b.type === badgeType)) {
      const badgeDef = BADGE_DEFINITIONS[badgeType];
      const newBadge: Badge = {
        id: uuidv4(),
        type: badgeType,
        name: badgeDef.name,
        description: badgeDef.description,
        icon: badgeDef.icon,
        earnedAt: new Date().toISOString(),
      };
      stats.badges.push(newBadge);
      newBadges.push(newBadge);
    }
  }
  
  // Save stats to DB if we had a stats collection
  // await db.updateDonorStats(donorId, stats);
  
  return { stats, newBadges };
};

/**
 * Check what badges a donor qualifies for
 */
function checkForNewBadges(stats: DonorStats, bloodType?: BloodType): BadgeType[] {
  const eligible: BadgeType[] = [];
  
  if (stats.totalDonations >= 1) eligible.push('first-donation');
  if (stats.totalDonations >= 3) eligible.push('regular-donor');
  if (stats.totalDonations >= 10) eligible.push('hero-donor');
  if (stats.totalDonations >= 25) eligible.push('life-saver');
  if (stats.totalDonations >= 50) eligible.push('legend');
  
  if (bloodType && isRareBloodType(bloodType)) {
    eligible.push('rare-blood');
  }
  
  return eligible;
}

/**
 * Record urgent response (when donor responds to urgent request)
 */
export const recordUrgentResponse = async (donorId: number | string): Promise<{ stats: DonorStats; newBadge?: Badge }> => {
  const stats = await getDonorStats(donorId);
  
  stats.points += POINTS.URGENT_RESPONSE;
  
  // Award quick responder badge if not already earned
  let newBadge: Badge | undefined;
  if (!stats.badges.find(b => b.type === 'quick-responder')) {
    const badgeDef = BADGE_DEFINITIONS['quick-responder'];
    newBadge = {
      id: uuidv4(),
      type: 'quick-responder',
      name: badgeDef.name,
      description: badgeDef.description,
      icon: badgeDef.icon,
      earnedAt: new Date().toISOString(),
    };
    stats.badges.push(newBadge);
  }
  
  // Save stats
  
  return { stats, newBadge };
};

/**
 * Get leaderboard
 */
export const getLeaderboard = async (limit = 10): Promise<LeaderboardEntry[]> => {
  // In a real app, this would be a complex aggregation query
  // For now, return empty or fetch all donors and sort (inefficient but works for small data)
  try {
      const donors = (await db.getAllDonors()) as unknown as Donor[];
      // We need to calculate points for each donor to sort them
      // This is heavy, but without a dedicated stats collection, it's the only way
      // Or we just return top donors by donation count
      
      const leaderboard = await Promise.all(donors.map(async (donor) => {
          const stats = await getDonorStats(donor.id);
          return {
              rank: 0, // assigned later
              donorId: donor.id,
              donorName: donor.name,
              bloodType: donor.bloodType,
              barangay: donor.barangay,
              totalDonations: stats.totalDonations,
              points: stats.points,
              badges: stats.badges
          };
      }));
      
      return leaderboard
        .sort((a, b) => b.points - a.points)
        .slice(0, limit)
        .map((entry, index) => ({ ...entry, rank: index + 1 }));
        
  } catch (error) {
      console.error("Error getting leaderboard:", error);
      return [];
  }
};

/**
 * Get donor rank
 */
export const getDonorRank = async (donorId: number | string): Promise<number> => {
  const leaderboard = await getLeaderboard(100);
  const entry = leaderboard.find(e => e.donorId == donorId);
  return entry?.rank || 0;
};
