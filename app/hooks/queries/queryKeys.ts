// Centralized query keys for React Query
// Following the factory pattern for type-safe, organized query keys

import type { DonorFilters, RequestFilters, AlertFilters } from '@/types/api';

export const queryKeys = {
  // Donor queries
  donors: {
    all: ['donors'] as const,
    lists: () => [...queryKeys.donors.all, 'list'] as const,
    list: (filters: DonorFilters) => [...queryKeys.donors.lists(), filters] as const,
    details: () => [...queryKeys.donors.all, 'detail'] as const,
    detail: (id: number | string) => [...queryKeys.donors.details(), id] as const,
    profile: () => [...queryKeys.donors.all, 'profile'] as const,
    eligibility: (id: number | string) => [...queryKeys.donors.all, 'eligibility', id] as const,
    donations: (id: number | string) => [...queryKeys.donors.all, 'donations', id] as const,
    badges: (id: number | string) => [...queryKeys.donors.all, 'badges', id] as const,
  },

  // Blood request queries
  requests: {
    all: ['requests'] as const,
    lists: () => [...queryKeys.requests.all, 'list'] as const,
    list: (filters: RequestFilters) => [...queryKeys.requests.lists(), filters] as const,
    details: () => [...queryKeys.requests.all, 'detail'] as const,
    detail: (id: number | string) => [...queryKeys.requests.details(), id] as const,
    matched: (id: number | string) => [...queryKeys.requests.all, 'matched', id] as const,
  },

  // Alert queries
  alerts: {
    all: ['alerts'] as const,
    lists: () => [...queryKeys.alerts.all, 'list'] as const,
    list: (filters: AlertFilters) => [...queryKeys.alerts.lists(), filters] as const,
    unread: (donorId: number | string) => [...queryKeys.alerts.all, 'unread', donorId] as const,
  },

  // Analytics queries
  analytics: {
    all: ['analytics'] as const,
    dashboard: () => [...queryKeys.analytics.all, 'dashboard'] as const,
    bloodTypes: () => [...queryKeys.analytics.all, 'bloodTypes'] as const,
    barangays: () => [...queryKeys.analytics.all, 'barangays'] as const,
    trends: (period: 'week' | 'month' | 'year') => [...queryKeys.analytics.all, 'trends', period] as const,
  },

  // Appointments/Scheduling queries
  appointments: {
    all: ['appointments'] as const,
    lists: () => [...queryKeys.appointments.all, 'list'] as const,
    forDonor: (donorId: number | string) => [...queryKeys.appointments.all, 'donor', donorId] as const,
    forHospital: (hospitalId: string) => [...queryKeys.appointments.all, 'hospital', hospitalId] as const,
    available: (date: string, hospitalId?: string) => [...queryKeys.appointments.all, 'available', date, hospitalId] as const,
  },

  // Auth queries
  auth: {
    all: ['auth'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
    session: () => [...queryKeys.auth.all, 'session'] as const,
  },
};
