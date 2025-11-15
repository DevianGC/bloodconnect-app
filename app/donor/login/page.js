'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useAuthRequest from '../../hooks/useAuthRequest';
import styles from '../../../styles/auth.module.css';
import AuthForm from '../../../components/atomic/organisms/AuthForm';

export default function DonorLogin() {
  const router = useRouter();
  const { login, isLoading, error: authError } = useAuthRequest();
  const [error, setError] = useState('');

  const fields = [
    { name: 'email', label: 'Email Address', type: 'email', placeholder: 'your.email@example.com', required: true },
    { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter your password', required: true },
  ];

  const submit = async (values) => {
    setError('');
    try {
      const result = await login({ ...values, role: 'donor' });
      if (result && result.success && result.data) {
        localStorage.setItem('donorUser', JSON.stringify(result.data));
        router.push('/donor/profile');
      } else {
        setError('Login failed');
      }
    } catch {
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
          <h2 className={styles.authTitle}>Donor Login</h2>
          <p className={styles.authSubtitle}>
            Sign in to manage your donor profile
          </p>
        </div>

        <div className={styles.authHint}>
          <strong>Demo credentials:</strong><br />
          Email: juan.delacruz@email.com<br />
          Password: donor123
        </div>

        <AuthForm
          mode="login"
          fields={fields}
          onSubmit={submit}
          isLoading={isLoading}
          error={error || authError}
          submitLabel="Sign In"
        />

        <div className={styles.authFooter}>
          <p>Don't have an account?</p>
          <Link href="/donor/register" className={styles.authLink}>
            Register as a donor
          </Link>
          <div style={{ marginTop: '1rem' }}>
            <Link href="/" className={styles.authLink}>
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
