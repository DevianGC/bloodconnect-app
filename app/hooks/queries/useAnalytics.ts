'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import { getAnalytics } from '@/lib/api';
import type { Analytics } from '@/types/api';

// Fetch dashboard analytics
export function useAnalytics() {
  return useQuery({
    queryKey: queryKeys.analytics.dashboard(),
    queryFn: async () => {
      const response = await getAnalytics();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch analytics');
      }
      return response.data as Analytics;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes - analytics can be slightly stale
  });
}

// Get donors by blood type distribution
export function useBloodTypeStats() {
  return useQuery({
    queryKey: queryKeys.analytics.bloodTypes(),
    queryFn: async () => {
      const response = await getAnalytics();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch blood type stats');
      }
      return response.data?.donorsByBloodType || {};
    },
  });
}

// Get donors by barangay distribution
export function useBarangayStats() {
  return useQuery({
    queryKey: queryKeys.analytics.barangays(),
    queryFn: async () => {
      const response = await getAnalytics();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch barangay stats');
      }
      return response.data?.donorsByBarangay || {};
    },
  });
}
