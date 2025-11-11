// In-memory store for demo purposes
// In a real app, replace this with actual database calls

let donors = [
  {
    id: '1',
    name: 'Juan Dela Cruz',
    email: 'juan.delacruz@email.com',
    password: '$2a$12$9x5X5bW8n8YJZ9Z5Z5Z5Ze5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', // 'donor123' hashed
    bloodType: 'A+',
    contact: '09123456789',
    address: '123 Main St',
    barangay: 'East Bajac-Bajac',
    lastDonation: '2023-01-15',
    emailAlerts: true,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z'
  }
];

export async function getDonorByEmail(email) {
  return donors.find(donor => donor.email === email) || null;
}

export async function getDonorById(id) {
  return donors.find(donor => donor.id === id) || null;
}

export async function createDonor(donorData) {
  const newDonor = {
    id: (donors.length + 1).toString(),
    ...donorData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  donors.push(newDonor);
  return newDonor;
}

export async function updateDonor(id, updates) {
  const index = donors.findIndex(donor => donor.id === id);
  if (index === -1) return null;
  
  donors[index] = {
    ...donors[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  return donors[index];
}

// For testing purposes
export function _clearDatabase() {
  donors = [];
}

export function _getAllDonors() {
  return [...donors];
}
