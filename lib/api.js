// API Utility Functions - Placeholder for future backend integration
// These functions will be replaced with actual fetch calls to the Node.js + Express backend

import { mockDonors, mockRequests, mockAlerts, mockAnalytics } from './mockData';

// Simulate API delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================
// AUTHENTICATION API
// ============================================

export const adminLogin = async (email, password) => {
  await delay();
  // Mock validation
  if (email === "admin@bloodconnect.com" && password === "admin123") {
    return {
      success: true,
      data: {
        id: 1,
        email: "admin@bloodconnect.com",
        role: "admin",
        name: "Admin User",
      },
    };
  }
  return {
    success: false,
    error: "Invalid credentials",
  };
};

export const donorLogin = async (email, password) => {
  await delay();
  // Mock validation
  const donor = mockDonors.find(d => d.email === email);
  if (donor && password === "donor123") {
    return {
      success: true,
      data: donor,
    };
  }
  return {
    success: false,
    error: "Invalid credentials",
  };
};

export const donorRegister = async (donorData) => {
  await delay();
  // Mock registration
  const newDonor = {
    id: mockDonors.length + 1,
    ...donorData,
    status: "active",
  };
  return {
    success: true,
    data: newDonor,
    message: "Registration successful! Please login to continue.",
  };
};

export const logout = async () => {
  await delay();
  return { success: true };
};

// ============================================
// DONORS API
// ============================================

export const getDonors = async (filters = {}) => {
  await delay();
  let donors = [...mockDonors];
  
  // Apply filters
  if (filters.bloodType) {
    donors = donors.filter(d => d.bloodType === filters.bloodType);
  }
  if (filters.barangay) {
    donors = donors.filter(d => d.barangay === filters.barangay);
  }
  if (filters.status) {
    donors = donors.filter(d => d.status === filters.status);
  }
  
  return {
    success: true,
    data: donors,
  };
};

export const getDonorById = async (id) => {
  await delay();
  const donor = mockDonors.find(d => d.id === parseInt(id));
  if (donor) {
    return {
      success: true,
      data: donor,
    };
  }
  return {
    success: false,
    error: "Donor not found",
  };
};

export const createDonor = async (donorData) => {
  await delay();
  const newDonor = {
    id: mockDonors.length + 1,
    ...donorData,
    status: "active",
  };
  return {
    success: true,
    data: newDonor,
    message: "Donor added successfully",
  };
};

export const updateDonor = async (id, donorData) => {
  await delay();
  const donor = mockDonors.find(d => d.id === parseInt(id));
  if (donor) {
    const updatedDonor = { ...donor, ...donorData };
    return {
      success: true,
      data: updatedDonor,
      message: "Donor updated successfully",
    };
  }
  return {
    success: false,
    error: "Donor not found",
  };
};

export const deleteDonor = async (id) => {
  await delay();
  return {
    success: true,
    message: "Donor deactivated successfully",
  };
};

// ============================================
// BLOOD REQUESTS API
// ============================================

export const getRequests = async (filters = {}) => {
  await delay();
  let requests = [...mockRequests];
  
  if (filters.status) {
    requests = requests.filter(r => r.status === filters.status);
  }
  if (filters.bloodType) {
    requests = requests.filter(r => r.bloodType === filters.bloodType);
  }
  
  return {
    success: true,
    data: requests,
  };
};

export const getRequestById = async (id) => {
  await delay();
  const request = mockRequests.find(r => r.id === parseInt(id));
  if (request) {
    return {
      success: true,
      data: request,
    };
  }
  return {
    success: false,
    error: "Request not found",
  };
};

export const createRequest = async (requestData) => {
  await delay();
  const newRequest = {
    id: mockRequests.length + 1,
    ...requestData,
    status: "active",
    createdAt: new Date().toISOString(),
    matchedDonors: 0,
  };
  return {
    success: true,
    data: newRequest,
    message: "Blood request created successfully",
  };
};

export const updateRequest = async (id, requestData) => {
  await delay();
  return {
    success: true,
    message: "Request updated successfully",
  };
};

export const fulfillRequest = async (id) => {
  await delay();
  return {
    success: true,
    message: "Request marked as fulfilled",
  };
};

// ============================================
// ALERTS API
// ============================================

export const getAlerts = async (filters = {}) => {
  await delay();
  let alerts = [...mockAlerts];
  
  if (filters.donorId) {
    // Filter alerts relevant to donor's blood type
    const donor = mockDonors.find(d => d.id === parseInt(filters.donorId));
    if (donor) {
      alerts = alerts.filter(a => a.bloodType === donor.bloodType);
    }
  }
  
  return {
    success: true,
    data: alerts,
  };
};

export const sendBulkAlert = async (requestId, donorIds) => {
  await delay();
  return {
    success: true,
    message: `Alert sent to ${donorIds.length} donors`,
    data: {
      sentCount: donorIds.length,
      sentAt: new Date().toISOString(),
    },
  };
};

// ============================================
// ANALYTICS API
// ============================================

export const getAnalytics = async () => {
  await delay();
  return {
    success: true,
    data: mockAnalytics,
  };
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

export const checkDonationEligibility = (lastDonationDate) => {
  if (!lastDonationDate) return { eligible: true, message: "No previous donation record" };
  
  const lastDonation = new Date(lastDonationDate);
  const today = new Date();
  const daysSinceLastDonation = Math.floor((today - lastDonation) / (1000 * 60 * 60 * 24));
  const requiredWaitDays = 56; // 8 weeks
  
  if (daysSinceLastDonation >= requiredWaitDays) {
    return {
      eligible: true,
      message: "Eligible to donate",
      daysSinceLastDonation,
    };
  } else {
    const daysRemaining = requiredWaitDays - daysSinceLastDonation;
    return {
      eligible: false,
      message: `Must wait ${daysRemaining} more days`,
      daysSinceLastDonation,
      daysRemaining,
    };
  }
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Additional API functions for request management
export const updateRequestStatus = async (id, status) => {
  await delay();
  return {
    success: true,
    message: `Request status updated to ${status}`,
  };
};

export const deleteRequest = async (id) => {
  await delay();
  return {
    success: true,
    message: 'Request deleted successfully',
  };
};
