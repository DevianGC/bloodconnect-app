'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useAuthRequest from '../../hooks/useAuthRequest';
import styles from '../../../styles/auth.module.css';

export default function AdminLogin() {
  const router = useRouter();
  const { login, isLoading, error: authError } = useAuthRequest();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const result = await login({ ...formData, role: 'admin' });
      
      if (result && result.success && result.data) {
        // In production, store auth token in localStorage/cookies
        localStorage.setItem('adminUser', JSON.stringify(result.data));
        router.push('/admin/dashboard');
      } else {
        setError('Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <Link href="/" className={styles.authLogo}>
            <span className={styles.authLogoIcon}>🩸</span>
            <span>BloodConnect Olongapo</span>
          </Link>
          <h2 className={styles.authTitle}>Admin Login</h2>
          <p className={styles.authSubtitle}>
            Sign in to manage blood requests and donors
          </p>
        </div>

        <form className={styles.authForm} onSubmit={handleSubmit}>
          {(error || authError) && (
            <div className={styles.authError}>
              {error || authError}
            </div>
          )}

          <div className={styles.authHint}>
            <strong>Demo credentials:</strong><br />
            Email: admin@bloodconnect.com<br />
            Password: admin123
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.formLabel}>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.formInput}
              placeholder="admin@bloodconnect.com"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.formLabel}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={styles.formInput}
              placeholder="Enter your password"
              required
            />
          </div>

          <button 
            type="submit" 
            className={styles.btnPrimary}
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className={styles.authFooter}>
          <Link href="/" className={styles.authLink}>
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}