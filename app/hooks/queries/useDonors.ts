'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import { 
  getDonors, 
  getDonorById, 
  createDonor, 
  updateDonor, 
  deleteDonor,
  checkDonationEligibility 
} from '@/lib/api';
import type { Donor, DonorFilters, DonorCreateInput } from '@/types/api';

// Fetch all donors with optional filters
export function useDonors(filters: DonorFilters = {}) {
  return useQuery({
    queryKey: queryKeys.donors.list(filters),
    queryFn: async () => {
      const response = await getDonors(filters);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch donors');
      }
      return response.data as Donor[];
    },
  });
}

// Fetch single donor by ID
export function useDonor(id: number | string) {
  return useQuery({
    queryKey: queryKeys.donors.detail(id),
    queryFn: async () => {
      const response = await getDonorById(id);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch donor');
      }
      return response.data as Donor;
    },
    enabled: !!id,
  });
}

// Check donor eligibility
export function useDonorEligibility(lastDonationDate: string | null | undefined) {
  return useQuery({
    queryKey: ['eligibility', lastDonationDate],
    queryFn: () => checkDonationEligibility(lastDonationDate),
    enabled: lastDonationDate !== undefined,
  });
}

// Create new donor mutation
export function useCreateDonor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (donorData: DonorCreateInput) => {
      const response = await createDonor(donorData);
      if (!response.success) {
        throw new Error(response.error || 'Failed to create donor');
      }
      return response.data as Donor;
    },
    onSuccess: () => {
      // Invalidate and refetch donors list
      queryClient.invalidateQueries({ queryKey: queryKeys.donors.lists() });
    },
  });
}

// Update donor mutation
export function useUpdateDonor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number | string; data: Partial<Donor> }) => {
      const response = await updateDonor(id, data);
      if (!response.success) {
        throw new Error(response.error || 'Failed to update donor');
      }
      return response.data as Donor;
    },
    onSuccess: (_, variables) => {
      // Invalidate specific donor and list
      queryClient.invalidateQueries({ queryKey: queryKeys.donors.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.donors.lists() });
    },
  });
}

// Delete/Deactivate donor mutation
export function useDeleteDonor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number | string) => {
      const response = await deleteDonor(id);
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete donor');
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.donors.lists() });
    },
  });
}
