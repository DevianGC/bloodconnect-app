'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getAlerts, formatDateTime } from '@/lib/api';
import styles from '@/styles/donor.module.css';

export default function DonorAlerts() {
  const router = useRouter();
  const [donor, setDonor] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const donorUser = localStorage.getItem('donorUser');
    if (!donorUser) {
      router.push('/donor/login');
      return;
    }

    const donorData = JSON.parse(donorUser);
    setDonor(donorData);
    loadAlerts(donorData.id);
  }, []);

  const loadAlerts = async (donorId) => {
    try {
      const result = await getAlerts({ donorId });
      if (result.success) {
        setAlerts(result.data);
      }
    } catch (error) {
      console.error('Error loading alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading alerts...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar role="donor" />
      <main className={styles.alertsMain}>
        <div className="container">
          {/* Page Header */}
          <div className={styles.alertsHeader}>
            <h1>Blood Donation Alerts</h1>
            <p>Emergency requests for {donor?.bloodType} blood</p>
          </div>

          {/* Alert Status */}
          <div className={styles.alertStatusSection}>
            <div className={`${styles.statusCard} ${donor?.emailAlerts ? styles.enabled : styles.disabled}`}>
              <div className={styles.statusIcon}>
                {donor?.emailAlerts ? '🔔' : '🔕'}
              </div>
              <div className={styles.statusContent}>
                <h3>Alerts {donor?.emailAlerts ? 'Enabled' : 'Disabled'}</h3>
                <p>
                  {donor?.emailAlerts 
                    ? 'You receive notifications for emergency requests'
                    : 'Enable alerts in your profile to receive notifications'}
                </p>
                {!donor?.emailAlerts && (
                  <button 
                    className={styles.editButton}
                    onClick={() => router.push('/donor/update')}
                  >
                    Enable Alerts
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Alerts List */}
          <div className={styles.alertsListSection}>
            <h2>Recent Alerts ({alerts.length})</h2>

            {alerts.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>📭</div>
                <h3>No Alerts Yet</h3>
                <p>You'll see emergency requests for {donor?.bloodType} blood here</p>
              </div>
            ) : (
              <div className={styles.alertsGrid}>
                {alerts.map(alert => (
                  <div 
                    key={alert.id} 
                    className={`${styles.alertCard} ${alert.status === 'fulfilled' ? styles.fulfilled : ''}`}
                  >
                    <div className={styles.alertHeader}>
                      <div className={styles.alertTitle}>
                        <span className={styles.alertIcon}>🩸</span>
                        <h3>{alert.title}</h3>
                      </div>
                      <span className={`${styles.alertStatus} ${alert.status === 'sent' ? styles.active : styles.completed}`}>
                        {alert.status === 'sent' ? 'Active' : 'Fulfilled'}
                      </span>
                    </div>

                    <div className={styles.alertBody}>
                      <p className={styles.alertMessage}>{alert.message}</p>
                      
                      <div className={styles.alertDetails}>
                        <div className={styles.alertDetail}>
                          <span className={styles.label}>Hospital</span>
                          <span className={styles.value}>{alert.hospitalName}</span>
                        </div>
                        <div className={styles.alertDetail}>
                          <span className={styles.label}>Blood Type</span>
                          <span className={styles.value}>{alert.bloodType}</span>
                        </div>
                        <div className={styles.alertDetail}>
                          <span className={styles.label}>Quantity</span>
                          <span className={styles.value}>{alert.quantity} units</span>
                        </div>
                        <div className={styles.alertDetail}>
                          <span className={styles.label}>Sent</span>
                          <span className={styles.value}>{formatDateTime(alert.sentAt)}</span>
                        </div>
                      </div>
                    </div>

                    {alert.status === 'sent' && (
                      <div className={styles.alertActions}>
                        <button 
                          className={styles.actionButton}
                          onClick={() => alert('Contact functionality will be connected to backend')}
                        >
                          <span className={styles.actionIcon}>📞</span>
                          Contact Hospital
                        </button>
                        <button 
                          className={styles.actionButton}
                          onClick={() => alert('Response functionality will be connected to backend')}
                        >
                          <span className={styles.actionIcon}>✓</span>
                          Mark as Responded
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className={styles.actionsSection}>
            <h2>Quick Actions</h2>
            <div className={styles.actionsGrid}>
              <Link href="/donor/profile" className={styles.actionButton}>
                <span className={styles.actionIcon}>👤</span>
                View Profile
              </Link>
              <Link href="/donor/update" className={styles.actionButton}>
                <span className={styles.actionIcon}>✏️</span>
                Update Settings
              </Link>
              <button 
                className={styles.actionButton}
                onClick={() => alert('Contact functionality will be implemented')}
              >
                <span className={styles.actionIcon}>📞</span>
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
