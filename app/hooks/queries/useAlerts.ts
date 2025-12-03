'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import { getAlerts, sendBulkAlert } from '@/lib/api';
import type { Alert, AlertFilters } from '@/types/api';

// Fetch all alerts with optional filters
export function useAlerts(filters: AlertFilters = {}) {
  return useQuery({
    queryKey: queryKeys.alerts.list(filters),
    queryFn: async () => {
      const response = await getAlerts(filters);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch alerts');
      }
      return response.data as Alert[];
    },
  });
}

// Fetch alerts for specific donor
export function useDonorAlerts(donorId: number | string) {
  return useQuery({
    queryKey: queryKeys.alerts.list({ donorId }),
    queryFn: async () => {
      const response = await getAlerts({ donorId });
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch donor alerts');
      }
      return response.data as Alert[];
    },
    enabled: !!donorId,
  });
}

// Send bulk alert mutation
export function useSendBulkAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ requestId, donorIds }: { requestId: number; donorIds: number[] }) => {
      const response = await sendBulkAlert(requestId, donorIds);
      if (!response.success) {
        throw new Error(response.error || 'Failed to send alerts');
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.alerts.lists() });
    },
  });
}
