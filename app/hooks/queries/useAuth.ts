'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { queryKeys } from './queryKeys';
import type { Donor } from '@/types/api';

interface AuthUser {
  id: number | string;
  email: string;
  name: string;
  role: 'donor' | 'admin';
  bloodType?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  bloodType: string;
  contact: string;
  address: string;
  barangay: string;
  lastDonation?: string;
  emailAlerts?: boolean;
}

// Get current user from localStorage
const getCurrentUser = (): AuthUser | null => {
  if (typeof window === 'undefined') return null;
  
  const donorUser = localStorage.getItem('donorUser');
  const adminUser = localStorage.getItem('adminUser');
  
  if (donorUser) {
    const donor = JSON.parse(donorUser);
    return { ...donor, role: 'donor' };
  }
  if (adminUser) {
    const admin = JSON.parse(adminUser);
    return { ...admin, role: 'admin' };
  }
  return null;
};

// Hook to get current authenticated user
export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.auth.user(),
    queryFn: getCurrentUser,
    staleTime: Infinity, // User data doesn't change unless we invalidate
  });
}

// Login mutation
export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ email, password, role }: LoginCredentials & { role: 'donor' | 'admin' }) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      return { ...data, role };
    },
    onSuccess: (data) => {
      // Store user in localStorage
      const storageKey = data.role === 'admin' ? 'adminUser' : 'donorUser';
      localStorage.setItem(storageKey, JSON.stringify(data.user));
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }
      
      // Invalidate auth queries
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() });
      
      // Redirect based on role
      router.push(data.role === 'admin' ? '/admin/dashboard' : '/donor/dashboard');
    },
  });
}

// Register mutation
export function useRegister() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (userData: RegisterData) => {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      
      return data;
    },
    onSuccess: () => {
      router.push('/donor/login?registered=true');
    },
  });
}

// Logout mutation
export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      // Clear all auth data
      localStorage.removeItem('donorUser');
      localStorage.removeItem('adminUser');
      localStorage.removeItem('authToken');
      return true;
    },
    onSuccess: () => {
      // Clear all cached queries
      queryClient.clear();
      router.push('/');
    },
  });
}

// Check if user is authenticated
export function useIsAuthenticated() {
  const { data: user, isLoading } = useCurrentUser();
  return {
    isAuthenticated: !!user,
    isLoading,
    user,
  };
}
