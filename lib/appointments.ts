// Appointment/Scheduling API Functions
import { v4 as uuidv4 } from 'uuid';
import type { 
  Appointment, 
  AppointmentCreateInput, 
  TimeSlot, 
  Hospital 
} from '@/types/appointments';

// Mock hospitals in Olongapo
export const hospitals: Hospital[] = [
  {
    id: 'jlgmh',
    name: 'James L. Gordon Memorial Hospital',
    address: 'Rizal Avenue, Olongapo City',
    contact: '(047) 222-2222',
    operatingHours: { open: '08:00', close: '17:00' },
    donationDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    slotDuration: 30,
    slotsPerHour: 4,
  },
  {
    id: 'ocgh',
    name: 'Olongapo City General Hospital',
    address: 'Magsaysay Drive, Olongapo City',
    contact: '(047) 223-3333',
    operatingHours: { open: '07:00', close: '16:00' },
    donationDays: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
    slotDuration: 30,
    slotsPerHour: 6,
  },
  {
    id: 'sjh',
    name: 'St. James Hospital',
    address: 'National Highway, Olongapo City',
    contact: '(047) 224-4444',
    operatingHours: { open: '09:00', close: '18:00' },
    donationDays: ['Tuesday', 'Thursday', 'Saturday'],
    slotDuration: 30,
    slotsPerHour: 3,
  },
];

// Mock appointments storage
let appointments: Appointment[] = [
  {
    id: '1',
    donorId: 1,
    donorName: 'Juan Dela Cruz',
    hospitalId: 'jlgmh',
    hospitalName: 'James L. Gordon Memorial Hospital',
    date: '2025-12-10',
    timeSlot: '09:00-09:30',
    status: 'scheduled',
    notes: 'First time donor',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    reminderSent: false,
  },
];

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Get all appointments with filters
export const getAppointments = async (filters: { 
  donorId?: number | string; 
  hospitalId?: string;
  date?: string;
  status?: string;
} = {}) => {
  await delay();
  
  let result = [...appointments];
  
  if (filters.donorId) {
    result = result.filter(a => a.donorId == filters.donorId);
  }
  if (filters.hospitalId) {
    result = result.filter(a => a.hospitalId === filters.hospitalId);
  }
  if (filters.date) {
    result = result.filter(a => a.date === filters.date);
  }
  if (filters.status) {
    result = result.filter(a => a.status === filters.status);
  }
  
  return { success: true, data: result };
};

// Get single appointment by ID
export const getAppointmentById = async (id: number | string) => {
  await delay();
  const appointment = appointments.find(a => a.id == id);
  
  if (!appointment) {
    return { success: false, error: 'Appointment not found' };
  }
  
  return { success: true, data: appointment };
};

// Generate available time slots for a date
export const getAvailableSlots = async (date: string, hospitalId?: string) => {
  await delay();
  
  const hospital = hospitalId 
    ? hospitals.find(h => h.id === hospitalId)
    : hospitals[0];
    
  if (!hospital) {
    return { success: false, error: 'Hospital not found' };
  }
  
  // Check if date is a valid donation day
  const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
  if (!hospital.donationDays.includes(dayOfWeek)) {
    return { 
      success: true, 
      data: [],
      message: `${hospital.name} does not accept donations on ${dayOfWeek}s` 
    };
  }
  
  // Generate slots
  const slots: TimeSlot[] = [];
  const [openHour] = hospital.operatingHours.open.split(':').map(Number);
  const [closeHour] = hospital.operatingHours.close.split(':').map(Number);
  
  for (let hour = openHour; hour < closeHour; hour++) {
    for (let slot = 0; slot < hospital.slotsPerHour; slot++) {
      const minutes = slot * hospital.slotDuration;
      const time = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      const endMinutes = minutes + hospital.slotDuration;
      const endHour = endMinutes >= 60 ? hour + 1 : hour;
      const endTime = `${endHour.toString().padStart(2, '0')}:${(endMinutes % 60).toString().padStart(2, '0')}`;
      
      // Check how many appointments already booked for this slot
      const bookedCount = appointments.filter(
        a => a.date === date && 
             a.hospitalId === hospital.id && 
             a.timeSlot === `${time}-${endTime}` &&
             a.status !== 'cancelled'
      ).length;
      
      slots.push({
        id: `${date}-${hospital.id}-${time}`,
        time,
        endTime,
        available: bookedCount < hospital.slotsPerHour,
        capacity: hospital.slotsPerHour,
        booked: bookedCount,
      });
    }
  }
  
  return { success: true, data: slots };
};

// Create new appointment
export const createAppointment = async (data: AppointmentCreateInput) => {
  await delay();
  
  const hospital = hospitals.find(h => h.id === data.hospitalId);
  if (!hospital) {
    return { success: false, error: 'Hospital not found' };
  }
  
  // Check if slot is still available
  const existingCount = appointments.filter(
    a => a.date === data.date && 
         a.hospitalId === data.hospitalId && 
         a.timeSlot === data.timeSlot &&
         a.status !== 'cancelled'
  ).length;
  
  if (existingCount >= hospital.slotsPerHour) {
    return { success: false, error: 'This time slot is no longer available' };
  }
  
  const newAppointment: Appointment = {
    id: uuidv4(),
    donorId: data.donorId,
    donorName: 'Donor', // Would be fetched from donor data in real app
    hospitalId: data.hospitalId,
    hospitalName: hospital.name,
    date: data.date,
    timeSlot: data.timeSlot,
    status: 'scheduled',
    notes: data.notes,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    reminderSent: false,
  };
  
  appointments.push(newAppointment);
  
  return { 
    success: true, 
    data: newAppointment,
    message: 'Appointment scheduled successfully!' 
  };
};

// Update appointment
export const updateAppointment = async (id: number | string, data: Partial<Appointment>) => {
  await delay();
  
  const index = appointments.findIndex(a => a.id == id);
  if (index === -1) {
    return { success: false, error: 'Appointment not found' };
  }
  
  appointments[index] = {
    ...appointments[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  
  return { success: true, data: appointments[index] };
};

// Cancel appointment
export const cancelAppointment = async (id: number | string) => {
  await delay();
  
  const index = appointments.findIndex(a => a.id == id);
  if (index === -1) {
    return { success: false, error: 'Appointment not found' };
  }
  
  appointments[index].status = 'cancelled';
  appointments[index].updatedAt = new Date().toISOString();
  
  return { success: true, message: 'Appointment cancelled successfully' };
};

// Get hospitals list
export const getHospitals = async () => {
  await delay();
  return { success: true, data: hospitals };
};
