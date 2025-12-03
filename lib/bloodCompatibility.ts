// Blood Type Compatibility System
// Reference: https://www.redcrossblood.org/donate-blood/blood-types.html

export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

// Blood type compatibility matrix
// Key: Recipient blood type
// Value: Array of compatible donor blood types
export const COMPATIBILITY_MATRIX: Record<BloodType, BloodType[]> = {
  'A+':  ['A+', 'A-', 'O+', 'O-'],
  'A-':  ['A-', 'O-'],
  'B+':  ['B+', 'B-', 'O+', 'O-'],
  'B-':  ['B-', 'O-'],
  'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], // Universal recipient
  'AB-': ['A-', 'B-', 'AB-', 'O-'],
  'O+':  ['O+', 'O-'],
  'O-':  ['O-'], // Universal donor
};

// Who can a blood type donate TO
export const CAN_DONATE_TO: Record<BloodType, BloodType[]> = {
  'A+':  ['A+', 'AB+'],
  'A-':  ['A+', 'A-', 'AB+', 'AB-'],
  'B+':  ['B+', 'AB+'],
  'B-':  ['B+', 'B-', 'AB+', 'AB-'],
  'AB+': ['AB+'],
  'AB-': ['AB+', 'AB-'],
  'O+':  ['A+', 'B+', 'AB+', 'O+'],
  'O-':  ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], // Universal donor
};

// Blood type rarity in Philippines
export const BLOOD_TYPE_RARITY: Record<BloodType, { percentage: number; rarity: 'common' | 'uncommon' | 'rare' }> = {
  'O+':  { percentage: 44, rarity: 'common' },
  'A+':  { percentage: 22, rarity: 'common' },
  'B+':  { percentage: 24, rarity: 'common' },
  'AB+': { percentage: 5, rarity: 'uncommon' },
  'O-':  { percentage: 2, rarity: 'rare' },
  'A-':  { percentage: 1, rarity: 'rare' },
  'B-':  { percentage: 1.5, rarity: 'rare' },
  'AB-': { percentage: 0.5, rarity: 'rare' },
};

// Blood type descriptions
export const BLOOD_TYPE_INFO: Record<BloodType, { 
  antigens: string; 
  antibodies: string;
  description: string;
}> = {
  'A+': {
    antigens: 'A, Rh',
    antibodies: 'Anti-B',
    description: 'Type A positive is the second most common blood type. Can donate to A+ and AB+.',
  },
  'A-': {
    antigens: 'A',
    antibodies: 'Anti-B',
    description: 'Type A negative is a rare blood type. Can donate to all A and AB types.',
  },
  'B+': {
    antigens: 'B, Rh',
    antibodies: 'Anti-A',
    description: 'Type B positive is fairly common. Can donate to B+ and AB+.',
  },
  'B-': {
    antigens: 'B',
    antibodies: 'Anti-A',
    description: 'Type B negative is rare. Can donate to all B and AB types.',
  },
  'AB+': {
    antigens: 'A, B, Rh',
    antibodies: 'None',
    description: 'Type AB positive is the universal recipient. Can receive from all blood types.',
  },
  'AB-': {
    antigens: 'A, B',
    antibodies: 'None',
    description: 'Type AB negative is the rarest blood type. Can receive from all negative types.',
  },
  'O+': {
    antigens: 'Rh',
    antibodies: 'Anti-A, Anti-B',
    description: 'Type O positive is the most common blood type. Can donate to all positive types.',
  },
  'O-': {
    antigens: 'None',
    antibodies: 'Anti-A, Anti-B',
    description: 'Type O negative is the universal donor. Can donate to anyone in emergencies.',
  },
};

/**
 * Check if a donor can donate to a recipient
 */
export function canDonate(donorType: BloodType, recipientType: BloodType): boolean {
  return COMPATIBILITY_MATRIX[recipientType].includes(donorType);
}

/**
 * Get all blood types a donor can donate to
 */
export function getCompatibleRecipients(donorType: BloodType): BloodType[] {
  return CAN_DONATE_TO[donorType];
}

/**
 * Get all blood types that can donate to a recipient
 */
export function getCompatibleDonors(recipientType: BloodType): BloodType[] {
  return COMPATIBILITY_MATRIX[recipientType];
}

/**
 * Check if blood type is rare
 */
export function isRareBloodType(bloodType: BloodType): boolean {
  return BLOOD_TYPE_RARITY[bloodType].rarity === 'rare';
}

/**
 * Get blood type rarity info
 */
export function getBloodTypeRarity(bloodType: BloodType) {
  return BLOOD_TYPE_RARITY[bloodType];
}

/**
 * Get blood type detailed info
 */
export function getBloodTypeInfo(bloodType: BloodType) {
  return {
    ...BLOOD_TYPE_INFO[bloodType],
    ...BLOOD_TYPE_RARITY[bloodType],
    canDonateTo: CAN_DONATE_TO[bloodType],
    canReceiveFrom: COMPATIBILITY_MATRIX[bloodType],
  };
}

/**
 * Calculate urgency score for blood request based on blood type rarity
 */
export function calculateUrgencyScore(bloodType: BloodType, urgency: 'normal' | 'urgent' | 'critical'): number {
  const rarityScore = BLOOD_TYPE_RARITY[bloodType].rarity === 'rare' ? 3 
    : BLOOD_TYPE_RARITY[bloodType].rarity === 'uncommon' ? 2 : 1;
  
  const urgencyScore = urgency === 'critical' ? 3 
    : urgency === 'urgent' ? 2 : 1;
  
  return rarityScore * urgencyScore;
}

/**
 * Get matching donors for a blood request
 */
export function findMatchingDonorTypes(recipientType: BloodType): BloodType[] {
  return COMPATIBILITY_MATRIX[recipientType];
}
