import { db, auth } from './firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  doc, 
  getDoc, 
  updateDoc,
  deleteDoc,
  getCountFromServer
} from 'firebase/firestore';

const DONORS_COLLECTION = 'donors';

export async function getDonorByEmail(email) {
  try {
    const q = query(collection(db, DONORS_COLLECTION), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) return null;
    
    const docSnapshot = querySnapshot.docs[0];
    return { id: docSnapshot.id, ...docSnapshot.data() };
  } catch (error) {
    console.error("Error getting donor by email:", error);
    throw error;
  }
}

export async function getDonorById(id) {
  try {
    const docRef = doc(db, DONORS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting donor by ID:", error);
    throw error;
  }
}

export async function createDonor(donorData) {
  try {
    const newDonorData = {
      ...donorData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const docRef = await addDoc(collection(db, DONORS_COLLECTION), newDonorData);
    return { id: docRef.id, ...newDonorData };
  } catch (error) {
    console.error("Error creating donor:", error);
    throw error;
  }
}

export async function updateDonor(id, updates) {
  try {
    const docRef = doc(db, DONORS_COLLECTION, id);
    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    await updateDoc(docRef, updateData);
    
    // Fetch the updated document to return it
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error("Error updating donor:", error);
    throw error;
  }
}

// Helper function to get all donors (useful for admin or testing)
export async function getAllDonors() {
  try {
    const querySnapshot = await getDocs(collection(db, DONORS_COLLECTION));
    const donors = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return donors.filter(d => d.email !== 'bloodconnectolongapo@gmail.com');
  } catch (error) {
    console.error("Error getting all donors:", error);
    throw error;
  }
}

const REQUESTS_COLLECTION = 'requests';
const ALERTS_COLLECTION = 'alerts';

// Requests
export async function getAllRequests() {
  try {
    const querySnapshot = await getDocs(collection(db, REQUESTS_COLLECTION));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting all requests:", error);
    throw error;
  }
}

export async function getRequestById(id) {
  try {
    const docRef = doc(db, REQUESTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting request by ID:", error);
    throw error;
  }
}

export async function createRequest(requestData) {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.error("createRequest: No authenticated user found");
      throw new Error("User must be authenticated to create a request");
    }

    console.log("Creating request for user:", user.uid);

    const newRequestData = {
      ...requestData,
      userId: user.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const docRef = await addDoc(collection(db, REQUESTS_COLLECTION), newRequestData);
    console.log("Request created with ID:", docRef.id);
    return { id: docRef.id, ...newRequestData };
  } catch (error) {
    console.error("Error creating request:", error);
    throw error;
  }
}

export async function updateRequest(id, updates) {
  try {
    const docRef = doc(db, REQUESTS_COLLECTION, id);
    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    await updateDoc(docRef, updateData);
    
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error("Error updating request:", error);
    throw error;
  }
}

export async function deleteRequest(id) {
  try {
    await deleteDoc(doc(db, REQUESTS_COLLECTION, id));
    return true;
  } catch (error) {
    console.error("Error deleting request:", error);
    throw error;
  }
}

// Alerts
export async function getAllAlerts() {
  try {
    const querySnapshot = await getDocs(collection(db, ALERTS_COLLECTION));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting all alerts:", error);
    throw error;
  }
}

export async function createAlert(alertData) {
  try {
    const newAlert = {
      ...alertData,
      createdAt: new Date().toISOString(),
      read: false
    };
    const docRef = await addDoc(collection(db, ALERTS_COLLECTION), newAlert);
    return { id: docRef.id, ...newAlert };
  } catch (error) {
    console.error("Error creating alert:", error);
    throw error;
  }
}

// Analytics (Basic implementation)
export async function getAnalytics() {
  try {
    const donors = await getAllDonors();
    const requests = await getAllRequests();
    
    const totalDonors = donors.length;
    const totalRequests = requests.length;
    const activeRequests = requests.filter(r => r.status === 'active').length;
    
    const donorsByBloodType = donors.reduce((acc, donor) => {
      acc[donor.bloodType] = (acc[donor.bloodType] || 0) + 1;
      return acc;
    }, {});
    
    const donorsByBarangay = donors.reduce((acc, donor) => {
      acc[donor.barangay] = (acc[donor.barangay] || 0) + 1;
      return acc;
    }, {});

    return {
      totalDonors,
      activeRequests,
      totalRequests,
      donorsByBloodType,
      donorsByBarangay,
      recentActivity: [] // Placeholder
    };
  } catch (error) {
    console.error("Error getting analytics:", error);
    throw error;
  }
}

const HOSPITALS_COLLECTION = 'hospitals';
const APPOINTMENTS_COLLECTION = 'appointments';
const DONATIONS_COLLECTION = 'donations';
const ADMINS_COLLECTION = 'admins';

// Hospitals
export async function getAllHospitals() {
  try {
    const querySnapshot = await getDocs(collection(db, HOSPITALS_COLLECTION));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting all hospitals:", error);
    throw error;
  }
}

export async function getHospitalById(id) {
  try {
    const docRef = doc(db, HOSPITALS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error("Error getting hospital by ID:", error);
    throw error;
  }
}

// Appointments
export async function getAppointments(filters = {}) {
  try {
    let q = collection(db, APPOINTMENTS_COLLECTION);
    // Note: Simple filtering. For complex queries, might need composite indexes.
    if (filters.donorId) {
      q = query(q, where("donorId", "==", filters.donorId));
    }
    // Add other filters as needed
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting appointments:", error);
    throw error;
  }
}

export async function getAppointmentById(id) {
  try {
    const docRef = doc(db, APPOINTMENTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error("Error getting appointment by ID:", error);
    throw error;
  }
}

export async function createAppointment(appointmentData) {
  try {
    const newAppointment = {
      ...appointmentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const docRef = await addDoc(collection(db, APPOINTMENTS_COLLECTION), newAppointment);
    return { id: docRef.id, ...newAppointment };
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw error;
  }
}

export async function updateAppointment(id, updates) {
  try {
    const docRef = doc(db, APPOINTMENTS_COLLECTION, id);
    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString()
    };
    await updateDoc(docRef, updateData);
    const docSnap = await getDoc(docRef);
    return { id: docSnap.id, ...docSnap.data() };
  } catch (error) {
    console.error("Error updating appointment:", error);
    throw error;
  }
}

// Donation History
export async function getDonationHistory(donorId) {
  try {
    const q = query(collection(db, DONATIONS_COLLECTION), where("donorId", "==", donorId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting donation history:", error);
    throw error;
  }
}

export async function createDonationRecord(donationData) {
  try {
    const newDonation = {
      ...donationData,
      createdAt: new Date().toISOString()
    };
    const docRef = await addDoc(collection(db, DONATIONS_COLLECTION), newDonation);
    return { id: docRef.id, ...newDonation };
  } catch (error) {
    console.error("Error creating donation record:", error);
    throw error;
  }
}

// Admin
export async function getAdminByEmail(email) {
  try {
    const q = query(collection(db, ADMINS_COLLECTION), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    const docSnapshot = querySnapshot.docs[0];
    return { id: docSnapshot.id, ...docSnapshot.data() };
  } catch (error) {
    console.error("Error getting admin by email:", error);
    throw error;
  }
}

// Public Statistics
export async function getPublicStats() {
  try {
    const donorsColl = collection(db, DONORS_COLLECTION);
    const donorsSnapshot = await getCountFromServer(donorsColl);
    const donorCount = donorsSnapshot.data().count;

    return {
      donors: donorCount > 500 ? `${donorCount}+` : donorCount.toString(),
      livesSaved: `${Math.floor(donorCount * 0.3)}+`, // Mock calculation
      hospitals: '4',
      emergency: '24/7'
    };
  } catch (error) {
    console.error("Error getting stats:", error);
    return {
      donors: '500+',
      livesSaved: '150+',
      hospitals: '4',
      emergency: '24/7'
    };
  }
}
