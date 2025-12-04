// Appointment/Scheduling API Functions
import { v4 as uuidv4 } from 'uuid';
import type { 
  Appointment, 
  AppointmentCreateInput, 
  TimeSlot, 
  Hospital 
} from '@/types/appointments';
import * as db from './db';

// Get all appointments with filters
export const getAppointments = async (filters: { 
  donorId?: number | string; 
  hospitalId?: string;
  date?: string;
  status?: string;
} = {}) => {
  try {
    let result = (await db.getAppointments(filters)) as any[];
    
    // Apply remaining filters in memory
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
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get single appointment by ID
export const getAppointmentById = async (id: number | string) => {
  try {
    const appointment = await db.getAppointmentById(String(id));
    if (appointment) {
      return { success: true, data: appointment };
    }
    return { success: false, error: 'Appointment not found' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Generate available time slots for a date
export const getAvailableSlots = async (date: string, hospitalId?: string) => {
  let hospital: Hospital | null = null;

  if (hospitalId) {
    hospital = (await db.getHospitalById(hospitalId)) as unknown as Hospital;
  } else {
    const allHospitals = (await db.getAllHospitals()) as unknown as Hospital[];
    if (allHospitals.length > 0) {
      hospital = allHospitals[0];
    }
  }
    
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
  
  // Fetch existing appointments for this date and hospital
  const { data: existingAppointments } = await getAppointments({ date, hospitalId: hospital.id });
  
  for (let hour = openHour; hour < closeHour; hour++) {
    for (let slot = 0; slot < hospital.slotsPerHour; slot++) {
      const minutes = slot * hospital.slotDuration;
      const time = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      const endMinutes = minutes + hospital.slotDuration;
      const endHour = endMinutes >= 60 ? hour + 1 : hour;
      const endTime = `${endHour.toString().padStart(2, '0')}:${(endMinutes % 60).toString().padStart(2, '0')}`;
      
      // Check how many appointments already booked for this slot
      const bookedCount = (existingAppointments || []).filter(
        (a: any) => a.timeSlot === `${time}-${endTime}` &&
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
  const hospital = (await db.getHospitalById(data.hospitalId)) as unknown as Hospital;
  if (!hospital) {
    return { success: false, error: 'Hospital not found' };
  }
  
  // Check if slot is still available
  const { data: existingAppointments } = await getAppointments({ 
      date: data.date, 
      hospitalId: data.hospitalId 
  });

  const existingCount = (existingAppointments || []).filter(
    (a: any) => a.timeSlot === data.timeSlot &&
         a.status !== 'cancelled'
  ).length;
  
  if (existingCount >= hospital.slotsPerHour) {
    return { success: false, error: 'This time slot is no longer available' };
  }
  
  const newAppointmentData = {
    donorId: data.donorId,
    donorName: 'Donor', // Would be fetched from donor data in real app
    hospitalId: data.hospitalId,
    hospitalName: hospital.name,
    date: data.date,
    timeSlot: data.timeSlot,
    status: 'scheduled',
    notes: data.notes,
    reminderSent: false,
  };
  
  try {
      const newAppointment = await db.createAppointment(newAppointmentData);
      return { 
        success: true, 
        data: newAppointment,
        message: 'Appointment scheduled successfully!' 
      };
  } catch (error) {
      return { success: false, error: error.message };
  }
};

// Update appointment
export const updateAppointment = async (id: number | string, data: Partial<Appointment>) => {
  try {
      const updated = await db.updateAppointment(id, data);
      return { success: true, data: updated };
  } catch (error) {
      return { success: false, error: error.message };
  }
};

// Cancel appointment
export const cancelAppointment = async (id: number | string) => {
  try {
      await db.updateAppointment(id, { status: 'cancelled' });
      return { success: true, message: 'Appointment cancelled successfully' };
  } catch (error) {
      return { success: false, error: error.message };
  }
};

// Get hospitals list
export const getHospitals = async () => {
  try {
    const data = await db.getAllHospitals();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
