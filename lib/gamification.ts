// Gamification System - Badges, Points, and Achievements
import { v4 as uuidv4 } from 'uuid';
import type { Badge, BadgeType, DonorStats, LeaderboardEntry } from '@/types/appointments';
import { isRareBloodType, BloodType } from './bloodCompatibility';

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

// Mock donor stats storage
const donorStats: Map<number | string, DonorStats> = new Map();

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
  let stats = donorStats.get(donorId);
  
  if (!stats) {
    // Initialize with mock data for demo
    stats = {
      totalDonations: 3,
      livesSaved: 9,
      streakDays: 2,
      lastDonation: '2025-08-15',
      nextEligibleDate: '2025-10-10',
      rank: 15,
      points: 350,
      badges: [
        {
          id: uuidv4(),
          type: 'first-donation',
          name: BADGE_DEFINITIONS['first-donation'].name,
          description: BADGE_DEFINITIONS['first-donation'].description,
          icon: BADGE_DEFINITIONS['first-donation'].icon,
          earnedAt: '2025-01-20T10:00:00Z',
        },
        {
          id: uuidv4(),
          type: 'regular-donor',
          name: BADGE_DEFINITIONS['regular-donor'].name,
          description: BADGE_DEFINITIONS['regular-donor'].description,
          icon: BADGE_DEFINITIONS['regular-donor'].icon,
          earnedAt: '2025-08-15T14:30:00Z',
        },
      ],
    };
    donorStats.set(donorId, stats);
  }
  
  return stats;
};

/**
 * Update donor stats after donation
 */
export const recordDonation = async (
  donorId: number | string, 
  bloodType: BloodType
): Promise<{ stats: DonorStats; newBadges: Badge[] }> => {
  const stats = await getDonorStats(donorId);
  const newBadges: Badge[] = [];
  
  // Update basic stats
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
  
  donorStats.set(donorId, stats);
  
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
  
  donorStats.set(donorId, stats);
  
  return { stats, newBadge };
};

/**
 * Get leaderboard
 */
export const getLeaderboard = async (limit = 10): Promise<LeaderboardEntry[]> => {
  // Mock leaderboard data
  const leaderboard: LeaderboardEntry[] = [
    {
      rank: 1,
      donorId: 5,
      donorName: 'Carlos Mendoza',
      bloodType: 'O-',
      barangay: 'New Ilalim',
      totalDonations: 25,
      points: 2750,
      badges: [
        { id: '1', type: 'life-saver', name: 'Life Saver', description: '', icon: '❤️‍🔥', earnedAt: '' },
        { id: '2', type: 'rare-blood', name: 'Rare Gem', description: '', icon: '💎', earnedAt: '' },
      ],
    },
    {
      rank: 2,
      donorId: 8,
      donorName: 'Elena Cruz',
      bloodType: 'AB-',
      barangay: 'Asinan',
      totalDonations: 18,
      points: 2100,
      badges: [
        { id: '3', type: 'hero-donor', name: 'Hero Donor', description: '', icon: '🦸', earnedAt: '' },
      ],
    },
    {
      rank: 3,
      donorId: 1,
      donorName: 'Juan Dela Cruz',
      bloodType: 'O+',
      barangay: 'Barretto',
      totalDonations: 12,
      points: 1350,
      badges: [
        { id: '4', type: 'hero-donor', name: 'Hero Donor', description: '', icon: '🦸', earnedAt: '' },
      ],
    },
    {
      rank: 4,
      donorId: 2,
      donorName: 'Maria Santos',
      bloodType: 'A+',
      barangay: 'East Bajac-Bajac',
      totalDonations: 8,
      points: 900,
      badges: [
        { id: '5', type: 'regular-donor', name: 'Regular Donor', description: '', icon: '💪', earnedAt: '' },
      ],
    },
    {
      rank: 5,
      donorId: 6,
      donorName: 'Rosa Fernandez',
      bloodType: 'A-',
      barangay: 'Pag-asa',
      totalDonations: 6,
      points: 780,
      badges: [
        { id: '6', type: 'regular-donor', name: 'Regular Donor', description: '', icon: '💪', earnedAt: '' },
        { id: '7', type: 'rare-blood', name: 'Rare Gem', description: '', icon: '💎', earnedAt: '' },
      ],
    },
  ];
  
  return leaderboard.slice(0, limit);
};

/**
 * Get donor rank
 */
export const getDonorRank = async (donorId: number | string): Promise<number> => {
  const leaderboard = await getLeaderboard(100);
  const entry = leaderboard.find(e => e.donorId == donorId);
  return entry?.rank || 0;
};
