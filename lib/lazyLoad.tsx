'use client';

import dynamic from 'next/dynamic';
import { ComponentType, ReactNode } from 'react';

// Loading placeholder component
interface LoadingProps {
  height?: string;
  message?: string;
}

export function LoadingPlaceholder({ height = '200px', message = 'Loading...' }: LoadingProps) {
  return (
    <div 
      className="flex items-center justify-center bg-gray-50 rounded-xl animate-pulse"
      style={{ minHeight: height }}
    >
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-gray-500 text-sm">{message}</p>
      </div>
    </div>
  );
}

// Skeleton loader for cards
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
    </div>
  );
}

// Skeleton loader for tables
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm">
      <div className="p-4 border-b border-gray-100">
        <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
      </div>
      <div className="divide-y divide-gray-100">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex gap-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/6"></div>
            <div className="h-4 bg-gray-200 rounded w-1/6"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Skeleton for stats cards
export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
      ))}
    </div>
  );
}

// Generic lazy loader wrapper
export function lazyLoad<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options?: {
    loading?: ReactNode;
    ssr?: boolean;
  }
) {
  return dynamic(importFn, {
    loading: () => options?.loading || <LoadingPlaceholder />,
    ssr: options?.ssr ?? true,
  });
}

// Pre-configured lazy components for common heavy components
export const LazyAnalyticsChart = dynamic(
  () => import('@/components/AnalyticsChart'),
  {
    loading: () => <LoadingPlaceholder height="400px" message="Loading chart..." />,
    ssr: false, // Charts often need client-side rendering
  }
);

export const LazyDonationScheduler = dynamic(
  () => import('@/components/DonationScheduler'),
  {
    loading: () => <LoadingPlaceholder height="300px" message="Loading scheduler..." />,
    ssr: false,
  }
);

export const LazyBloodCompatibilityChart = dynamic(
  () => import('@/components/BloodCompatibilityChart'),
  {
    loading: () => <LoadingPlaceholder height="350px" message="Loading compatibility chart..." />,
    ssr: false,
  }
);

export const LazyDonationHistory = dynamic(
  () => import('@/components/DonationHistory').then(mod => ({ default: mod.DonationHistory })),
  {
    loading: () => <TableSkeleton rows={3} />,
    ssr: true,
  }
);

export const LazyGamification = dynamic(
  () => import('@/components/Gamification').then(mod => ({ default: mod.BadgeDisplay })),
  {
    loading: () => <LoadingPlaceholder height="100px" message="Loading badges..." />,
    ssr: true,
  }
);

// Lazy load modal components (not needed until interaction)
export const LazyModal = dynamic(
  () => import('@/components/Modal'),
  {
    loading: () => null,
    ssr: false,
  }
);

export const LazyRequestForm = dynamic(
  () => import('@/components/RequestForm'),
  {
    loading: () => <LoadingPlaceholder height="400px" message="Loading form..." />,
    ssr: false,
  }
);
