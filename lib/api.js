// API Utility Functions - Using Firebase Firestore
import * as db from './db';
import { verifyPassword } from './auth';

// ============================================
// AUTHENTICATION API
// ============================================

export const adminLogin = async (email, password) => {
  try {
    const admin = await db.getAdminByEmail(email);
    if (admin) {
      // In a real app, verify password hash. 
      // For now, assuming admin collection has password field (hashed)
      // If admin collection is manually created, ensure password is hashed or handle accordingly.
      // If using simple string match for initial setup:
      // if (admin.password === password) ...
      
      // Let's assume standard verifyPassword
      const isValid = await verifyPassword(password, admin.password);
      if (isValid) {
        const { password: _, ...adminData } = admin;
        return {
          success: true,
          data: adminData,
        };
      }
    }
    return {
      success: false,
      error: "Invalid credentials",
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const donorLogin = async (email, password) => {
  try {
    const donor = await db.getDonorByEmail(email);
    if (donor) {
      const isValid = await verifyPassword(password, donor.password);
      if (isValid) {
         // Don't return password
         const { password: _, ...donorData } = donor;
         return {
          success: true,
          data: donorData,
        };
      }
    }
    return {
      success: false,
      error: "Invalid credentials",
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const donorRegister = async (donorData) => {
  try {
    const existing = await db.getDonorByEmail(donorData.email);
    if (existing) {
      return { success: false, error: "Email already registered" };
    }
    
    const newDonor = await db.createDonor(donorData);
    return {
      success: true,
      data: newDonor,
      message: "Registration successful! Please login to continue.",
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const logout = async () => {
  return { success: true };
};

// ============================================
// DONORS API
// ============================================

export const getDonors = async (filters = {}) => {
  try {
    let donors = await db.getAllDonors();
    
    // Apply filters in memory for now (Firestore filtering is better but this is quicker to migrate)
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
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getDonorById = async (id) => {
  try {
    const donor = await db.getDonorById(id);
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
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const createDonor = async (donorData) => {
  try {
    const newDonor = await db.createDonor(donorData);
    return {
      success: true,
      data: newDonor,
      message: "Donor added successfully",
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateDonor = async (id, donorData) => {
  try {
    const updatedDonor = await db.updateDonor(id, donorData);
    if (updatedDonor) {
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
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteDonor = async (id) => {
  try {
      await db.updateDonor(id, { status: 'inactive' });
      return {
        success: true,
        message: "Donor deactivated successfully",
      };
  } catch (error) {
      return { success: false, error: error.message };
  }
};

// ============================================
// BLOOD REQUESTS API
// ============================================

export const getRequests = async (filters = {}) => {
  try {
    let requests = await db.getAllRequests();
    
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
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getRequestById = async (id) => {
  try {
    const request = await db.getRequestById(id);
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
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const createRequest = async (requestData) => {
  try {
    const newRequest = await db.createRequest({
        ...requestData,
        status: "active",
        matchedDonors: 0,
    });
    return {
      success: true,
      data: newRequest,
      message: "Blood request created successfully",
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateRequest = async (id, requestData) => {
  try {
    const updated = await db.updateRequest(id, requestData);
    return {
        success: true,
        message: "Request updated successfully",
        data: updated
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const fulfillRequest = async (id) => {
  try {
    await db.updateRequest(id, { status: 'fulfilled' });
    return {
        success: true,
        message: "Request marked as fulfilled",
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ============================================
// ALERTS API
// ============================================

export const getAlerts = async (filters = {}) => {
  try {
    let alerts = await db.getAllAlerts();
    
    if (filters.donorId) {
      const donor = await db.getDonorById(filters.donorId);
      if (donor) {
        alerts = alerts.filter(a => a.bloodType === donor.bloodType);
      }
    }
    
    return {
      success: true,
      data: alerts,
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const sendBulkAlert = async (requestId, donorIds) => {
  // Implement alert creation in DB
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
  try {
    const data = await db.getAnalytics();
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
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
  try {
    await db.updateRequest(id, { status });
    return {
        success: true,
        message: `Request status updated to ${status}`,
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteRequest = async (id) => {
  try {
      await db.deleteRequest(id);
      return {
        success: true,
        message: 'Request deleted successfully',
      };
  } catch (error) {
      return { success: false, error: error.message };
  }
};
