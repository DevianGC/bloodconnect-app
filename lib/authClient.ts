// Client-side authentication utilities that work with middleware
'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export type UserRole = 'donor' | 'admin';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  [key: string]: unknown;
}

// Cookie utilities
export const setCookie = (name: string, value: string, days: number = 7) => {
  if (typeof window === 'undefined') return;
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
};

export const getCookie = (name: string): string | null => {
  if (typeof window === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
};

export const deleteCookie = (name: string) => {
  if (typeof window === 'undefined') return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

// Auth functions
export const setAuthCookie = (role: UserRole, userData: AuthUser) => {
  const cookieName = role === 'admin' ? 'adminAuth' : 'donorAuth';
  setCookie(cookieName, JSON.stringify(userData), 7);
  // Also store in localStorage for React Query
  localStorage.setItem(`${role}User`, JSON.stringify(userData));
};

export const clearAuthCookies = () => {
  deleteCookie('donorAuth');
  deleteCookie('adminAuth');
  localStorage.removeItem('donorUser');
  localStorage.removeItem('adminUser');
  localStorage.removeItem('authToken');
};

export const getCurrentUser = (): AuthUser | null => {
  if (typeof window === 'undefined') return null;
  
  const adminCookie = getCookie('adminAuth');
  if (adminCookie) {
    try {
      return { ...JSON.parse(adminCookie), role: 'admin' };
    } catch {
      return null;
    }
  }
  
  const donorCookie = getCookie('donorAuth');
  if (donorCookie) {
    try {
      return { ...JSON.parse(donorCookie), role: 'donor' };
    } catch {
      return null;
    }
  }
  
  return null;
};

export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};

export const getUserRole = (): UserRole | null => {
  const user = getCurrentUser();
  return user?.role || null;
};

// Hook for auth actions
export function useAuth() {
  const router = useRouter();

  const login = useCallback(async (
    email: string, 
    password: string, 
    role: UserRole
  ) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }
    
    // Set auth cookie for middleware
    setAuthCookie(role, { ...data.user, role });
    
    // Redirect to dashboard
    router.push(role === 'admin' ? '/admin/dashboard' : '/donor/dashboard');
    router.refresh(); // Refresh to update middleware state
    
    return data;
  }, [router]);

  const logout = useCallback(() => {
    clearAuthCookies();
    router.push('/');
    router.refresh();
  }, [router]);

  const register = useCallback(async (userData: Record<string, unknown>) => {
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
  }, []);

  return {
    login,
    logout,
    register,
    getCurrentUser,
    isAuthenticated,
    getUserRole,
  };
}

// HOC for protected pages (optional client-side protection)
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requiredRole?: UserRole
) {
  return function ProtectedComponent(props: P) {
    const router = useRouter();
    const user = getCurrentUser();
    
    if (!user) {
      router.push('/donor/login');
      return null;
    }
    
    if (requiredRole && user.role !== requiredRole) {
      router.push('/');
      return null;
    }
    
    return <WrappedComponent {...props} />;
  };
}
