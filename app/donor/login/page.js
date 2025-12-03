'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../../../styles/auth.module.css';

// Demo donor data for quick login
const DEMO_DONOR = {
  id: 1,
  name: "Juan Dela Cruz",
  email: "juan.delacruz@email.com",
  bloodType: "O+",
  phone: "+63 917 123 4567",
  address: "123 Main Street, Olongapo City",
  lastDonation: "2024-01-15",
  totalDonations: 5,
  status: "Active",
  eligibleToDoante: true,
  nextEligibleDate: "2024-04-15",
  achievements: ["first_donation", "regular_donor", "life_saver"],
  points: 500
};

export default function DonorLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleQuickLogin = () => {
    setIsLoading(true);
    // Store demo donor data and redirect
    localStorage.setItem('donorUser', JSON.stringify(DEMO_DONOR));
    localStorage.setItem('isLoggedIn', 'true');
    
    setTimeout(() => {
      router.push('/donor/dashboard');
    }, 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Check for demo credentials
    if (formData.email === 'juan.delacruz@email.com' && formData.password === 'donor123') {
      localStorage.setItem('donorUser', JSON.stringify(DEMO_DONOR));
      localStorage.setItem('isLoggedIn', 'true');
      router.push('/donor/dashboard');
      return;
    }

    // For other credentials, show error
    setTimeout(() => {
      setIsLoading(false);
      setError('Invalid email or password. Try the demo credentials!');
    }, 1000);
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <Link href="/" className={styles.authLogo}>
            <span className={styles.authLogoIcon}>🩸</span>
            <span>BloodConnect</span>
          </Link>
          <h2 className={styles.authTitle}>Welcome Back</h2>
          <p className={styles.authSubtitle}>
            Sign in to access your donor dashboard
          </p>
        </div>

        <form className={styles.authForm} onSubmit={handleSubmit}>
          {error && (
            <div className={styles.authError}>
              {error}
            </div>
          )}

          <button 
            type="button"
            onClick={handleQuickLogin}
            className={styles.btnPrimary}
            style={{ 
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              boxShadow: '0 4px 14px 0 rgba(5, 150, 105, 0.35)'
            }}
            disabled={isLoading}
          >
            🚀 Quick Demo Login
          </button>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem',
            color: '#94a3b8',
            fontSize: '0.875rem'
          }}>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
            <span>or login manually</span>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
          </div>

          <div className={styles.authHint}>
            <strong>Demo credentials:</strong><br />
            📧 juan.delacruz@email.com<br />
            🔑 donor123
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
              placeholder="your.email@example.com"
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
            {isLoading ? '⏳ Signing in...' : '🔐 Sign In'}
          </button>
        </form>

        <div className={styles.authFooter}>
          <p>Don't have an account?</p>
          <Link href="/donor/register" className={styles.authLink}>
            Register as a donor →
          </Link>
          <div style={{ marginTop: '1.5rem' }}>
            <Link href="/" className={styles.authLink}>
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}