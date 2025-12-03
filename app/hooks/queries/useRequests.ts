'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import { 
  getRequests, 
  getRequestById, 
  createRequest, 
  updateRequest, 
  fulfillRequest,
  deleteRequest,
  updateRequestStatus
} from '@/lib/api';
import type { Request, RequestFilters, RequestCreateInput } from '@/types/api';

// Fetch all blood requests with optional filters
export function useRequests(filters: RequestFilters = {}) {
  return useQuery({
    queryKey: queryKeys.requests.list(filters),
    queryFn: async () => {
      const response = await getRequests(filters);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch requests');
      }
      return response.data as Request[];
    },
  });
}

// Fetch single request by ID
export function useRequest(id: number | string) {
  return useQuery({
    queryKey: queryKeys.requests.detail(id),
    queryFn: async () => {
      const response = await getRequestById(id);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch request');
      }
      return response.data as Request;
    },
    enabled: !!id,
  });
}

// Create new blood request mutation
export function useCreateRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestData: RequestCreateInput) => {
      const response = await createRequest(requestData);
      if (!response.success) {
        throw new Error(response.error || 'Failed to create request');
      }
      return response.data as Request;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.requests.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.dashboard() });
    },
  });
}

// Update request mutation
export function useUpdateRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number | string; data: Partial<Request> }) => {
      const response = await updateRequest(id, data);
      if (!response.success) {
        throw new Error(response.error || 'Failed to update request');
      }
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.requests.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.requests.lists() });
    },
  });
}

// Update request status mutation
export function useUpdateRequestStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: number | string; status: string }) => {
      const response = await updateRequestStatus(id, status);
      if (!response.success) {
        throw new Error(response.error || 'Failed to update request status');
      }
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.requests.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.requests.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.dashboard() });
    },
  });
}

// Fulfill request mutation
export function useFulfillRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number | string) => {
      const response = await fulfillRequest(id);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fulfill request');
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.requests.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.dashboard() });
    },
  });
}

// Delete request mutation
export function useDeleteRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number | string) => {
      const response = await deleteRequest(id);
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete request');
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.requests.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.dashboard() });
    },
  });
}
