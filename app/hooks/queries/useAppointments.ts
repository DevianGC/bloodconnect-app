'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import { 
  getAppointments, 
  getAppointmentById,
  createAppointment,
  updateAppointment,
  cancelAppointment,
  getAvailableSlots
} from '@/lib/appointments';
import type { Appointment, AppointmentCreateInput, TimeSlot } from '@/types/appointments';

// Fetch appointments for a donor
export function useDonorAppointments(donorId: number | string) {
  return useQuery({
    queryKey: queryKeys.appointments.forDonor(donorId),
    queryFn: async () => {
      const response = await getAppointments({ donorId });
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch appointments');
      }
      return response.data as Appointment[];
    },
    enabled: !!donorId,
  });
}

// Fetch single appointment
export function useAppointment(id: number | string) {
  return useQuery({
    queryKey: ['appointment', id],
    queryFn: async () => {
      const response = await getAppointmentById(id);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch appointment');
      }
      return response.data as Appointment;
    },
    enabled: !!id,
  });
}

// Fetch available time slots
export function useAvailableSlots(date: string, hospitalId?: string) {
  return useQuery({
    queryKey: queryKeys.appointments.available(date, hospitalId),
    queryFn: async () => {
      const response = await getAvailableSlots(date, hospitalId);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch available slots');
      }
      return response.data as TimeSlot[];
    },
    enabled: !!date,
  });
}

// Create appointment mutation
export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AppointmentCreateInput) => {
      const response = await createAppointment(data);
      if (!response.success) {
        throw new Error(response.error || 'Failed to create appointment');
      }
      return response.data as Appointment;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.forDonor(variables.donorId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.available(variables.date) });
    },
  });
}

// Update appointment mutation
export function useUpdateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number | string; data: Partial<Appointment> }) => {
      const response = await updateAppointment(id, data);
      if (!response.success) {
        throw new Error(response.error || 'Failed to update appointment');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all });
    },
  });
}

// Cancel appointment mutation
export function useCancelAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number | string) => {
      const response = await cancelAppointment(id);
      if (!response.success) {
        throw new Error(response.error || 'Failed to cancel appointment');
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all });
    },
  });
}
