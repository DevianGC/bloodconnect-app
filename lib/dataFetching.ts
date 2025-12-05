/**
 * Data Fetching Patterns Utilities
 * 
 * This module provides utilities for implementing different data fetching
 * strategies in Next.js: SSR, SSG, ISR, and client-side fetching.
 * 
 * @module lib/dataFetching
 */

import { cache } from 'react';

// ============================================================================
// CACHE CONFIGURATION
// ============================================================================

/**
 * Revalidation time constants (in seconds)
 */
export const REVALIDATE_TIMES = {
  /** Real-time data - no caching */
  NONE: 0,
  /** Short cache - 1 minute */
  SHORT: 60,
  /** Medium cache - 5 minutes */
  MEDIUM: 300,
  /** Long cache - 1 hour */
  LONG: 3600,
  /** Daily cache - 24 hours */
  DAILY: 86400,
} as const;

/**
 * Cache tags for on-demand revalidation
 */
export const CACHE_TAGS = {
  DONORS: 'donors',
  REQUESTS: 'requests',
  ANALYTICS: 'analytics',
  ALERTS: 'alerts',
  USER: 'user',
  APPOINTMENTS: 'appointments',
} as const;

// ============================================================================
// FETCH HELPERS
// ============================================================================

/**
 * Base URL for API requests
 */
const getBaseUrl = () => {
  if (typeof window !== 'undefined') return ''; // Client-side
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
};

/**
 * Generic fetch wrapper with caching options
 * 
 * @example
 * // SSG - Static fetch (default)
 * const data = await fetchWithCache('/api/donors');
 * 
 * // SSR - No cache
 * const data = await fetchWithCache('/api/donors', { cache: 'no-store' });
 * 
 * // ISR - Revalidate every 5 minutes
 * const data = await fetchWithCache('/api/donors', { 
 *   next: { revalidate: REVALIDATE_TIMES.MEDIUM } 
 * });
 */
export async function fetchWithCache<T>(
  endpoint: string,
  options?: RequestInit & { next?: { revalidate?: number; tags?: string[] } }
): Promise<T> {
  const baseUrl = getBaseUrl();
  const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error(`Fetch failed: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

// ============================================================================
// SERVER-SIDE DATA FETCHING (SSR)
// ============================================================================

/**
 * Fetch data with no caching - always fresh (SSR)
 * Use for: User-specific data, real-time content
 */
export async function fetchSSR<T>(endpoint: string): Promise<T> {
  return fetchWithCache<T>(endpoint, { cache: 'no-store' });
}

/**
 * React cache wrapper for request deduplication
 * Prevents duplicate fetches within same request
 */
export const getCachedData = cache(async <T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> => {
  return fetchWithCache<T>(endpoint, options);
});

// ============================================================================
// STATIC GENERATION (SSG)
// ============================================================================

/**
 * Fetch data at build time - fully static (SSG)
 * Use for: Static content that rarely changes
 */
export async function fetchSSG<T>(endpoint: string): Promise<T> {
  return fetchWithCache<T>(endpoint, { cache: 'force-cache' });
}

// ============================================================================
// INCREMENTAL STATIC REGENERATION (ISR)
// ============================================================================

/**
 * Fetch with revalidation - background refresh (ISR)
 * Use for: Data that changes periodically
 * 
 * @param endpoint - API endpoint
 * @param revalidateSeconds - Seconds until revalidation
 * @param tags - Cache tags for on-demand revalidation
 */
export async function fetchISR<T>(
  endpoint: string,
  revalidateSeconds: number = REVALIDATE_TIMES.MEDIUM,
  tags?: string[]
): Promise<T> {
  return fetchWithCache<T>(endpoint, {
    next: {
      revalidate: revalidateSeconds,
      ...(tags && { tags }),
    },
  });
}

// ============================================================================
// PREFETCH UTILITIES
// ============================================================================

/**
 * Prefetch multiple endpoints in parallel
 * Useful for loading initial page data
 */
export async function prefetchAll<T extends Record<string, string>>(
  endpoints: T,
  options?: RequestInit
): Promise<{ [K in keyof T]: unknown }> {
  const entries = Object.entries(endpoints);
  const results = await Promise.all(
    entries.map(([_, endpoint]) => fetchWithCache(endpoint, options))
  );
  
  return Object.fromEntries(
    entries.map(([key], index) => [key, results[index]])
  ) as { [K in keyof T]: unknown };
}

// ============================================================================
// DATA FETCHING PATTERNS FOR BLOODCONNECT
// ============================================================================

/**
 * Fetch donors list with ISR (updates every 5 minutes)
 */
export async function fetchDonors() {
  return fetchISR('/api/donors', REVALIDATE_TIMES.MEDIUM, [CACHE_TAGS.DONORS]);
}

/**
 * Fetch single donor - no cache (user-specific)
 */
export async function fetchDonorById(id: string) {
  return fetchSSR(`/api/donors/${id}`);
}

/**
 * Fetch blood requests with short cache (1 minute)
 */
export async function fetchRequests() {
  return fetchISR('/api/requests', REVALIDATE_TIMES.SHORT, [CACHE_TAGS.REQUESTS]);
}

/**
 * Fetch analytics with medium cache (5 minutes)
 */
export async function fetchAnalytics() {
  return fetchISR('/api/analytics', REVALIDATE_TIMES.MEDIUM, [CACHE_TAGS.ANALYTICS]);
}

/**
 * Fetch static content (blood type info) at build time
 */
export async function fetchBloodTypeInfo() {
  return fetchSSG('/api/blood-types');
}

// ============================================================================
// REVALIDATION HELPERS
// ============================================================================

/**
 * Trigger on-demand revalidation by tag
 * Call this after mutations to refresh cached data
 * 
 * @example
 * // After creating a new donor
 * await revalidateByTag('donors');
 */
export async function revalidateByTag(tag: string) {
  try {
    const response = await fetch(`/api/revalidate?tag=${tag}`, {
      method: 'POST',
    });
    return response.ok;
  } catch {
    console.error(`Failed to revalidate tag: ${tag}`);
    return false;
  }
}

/**
 * Trigger revalidation for multiple tags
 */
export async function revalidateTags(tags: string[]) {
  return Promise.all(tags.map(revalidateByTag));
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

/**
 * Wrapper for data fetching with error boundary support
 */
export async function fetchWithErrorBoundary<T>(
  fetchFn: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await fetchFn();
  } catch (error) {
    console.error('Data fetch error:', error);
    return fallback;
  }
}

/**
 * Type guard for API responses
 */
export function isApiError(response: unknown): response is { error: string; status: number } {
  return (
    typeof response === 'object' &&
    response !== null &&
    'error' in response &&
    'status' in response
  );
}

// ============================================================================
// USAGE EXAMPLES (commented out)
// ============================================================================

/*
// In a Server Component (app/admin/dashboard/page.tsx):
import { fetchAnalytics, fetchRequests } from '@/lib/dataFetching';

export default async function AdminDashboard() {
  const [analytics, requests] = await Promise.all([
    fetchAnalytics(),
    fetchRequests(),
  ]);
  
  return <Dashboard analytics={analytics} requests={requests} />;
}

// In a page with ISR:
export const revalidate = 300; // Revalidate every 5 minutes

export default async function DonorsPage() {
  const donors = await fetchDonors();
  return <DonorsList donors={donors} />;
}

// Client-side with React Query (existing pattern):
import { useDonors } from '@/app/hooks/queries/useDonors';

function DonorsList() {
  const { data: donors, isLoading } = useDonors();
  // ... render
}
*/
