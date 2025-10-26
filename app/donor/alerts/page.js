'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { getAlerts, formatDateTime } from '../../../lib/api';
import styles from '../../../styles/donor.module.css';

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
      <main className={styles.donorMain}>
        <div className="container">
          <div className={styles.pageHeader}>
            <h1>Blood Donation Alerts</h1>
            <p className={styles.pageSubtitle}>
              Emergency blood requests matching your blood type ({donor?.bloodType})
            </p>
          </div>

          {/* Alert Status */}
          <div className={styles.section}>
            <div className={styles.alertStatusCard}>
              <div className={styles.alertStatusIcon}>
                {donor?.emailAlerts ? '🔔' : '🔕'}
              </div>
              <div className={styles.alertStatusContent}>
                <h3>Alert Status: {donor?.emailAlerts ? 'Enabled' : 'Disabled'}</h3>
                <p>
                  {donor?.emailAlerts 
                    ? 'You will receive email notifications for emergency blood requests matching your blood type.'
                    : 'Email alerts are currently disabled. Enable them in your profile settings to receive notifications.'}
                </p>
                {!donor?.emailAlerts && (
                  <button 
                    className={styles.btnPrimary}
                    onClick={() => router.push('/donor/update')}
                  >
                    Enable Alerts
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Alerts List */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              Recent Alerts ({alerts.length})
            </h2>

            {alerts.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>📭</div>
                <h3>No Alerts Yet</h3>
                <p>
                  You haven't received any blood donation alerts. When there's an emergency
                  request for {donor?.bloodType} blood, you'll see it here.
                </p>
              </div>
            ) : (
              <div className={styles.alertsList}>
                {alerts.map(alert => (
                  <div 
                    key={alert.id} 
                    className={`${styles.alertCard} ${alert.status === 'fulfilled' ? styles.alertFulfilled : ''}`}
                  >
                    <div className={styles.alertHeader}>
                      <div className={styles.alertTitle}>
                        <span className={styles.alertIcon}>🩸</span>
                        <h3>{alert.title}</h3>
                      </div>
                      <span className={`${styles.alertStatus} ${styles[`status${alert.status}`]}`}>
                        {alert.status === 'sent' ? 'Active' : 'Fulfilled'}
                      </span>
                    </div>

                    <div className={styles.alertBody}>
                      <p className={styles.alertMessage}>{alert.message}</p>
                      
                      <div className={styles.alertDetails}>
                        <div className={styles.alertDetail}>
                          <span className={styles.alertDetailLabel}>Hospital:</span>
                          <span className={styles.alertDetailValue}>{alert.hospitalName}</span>
                        </div>
                        <div className={styles.alertDetail}>
                          <span className={styles.alertDetailLabel}>Blood Type:</span>
                          <span className={styles.bloodTypeBadge}>{alert.bloodType}</span>
                        </div>
                        <div className={styles.alertDetail}>
                          <span className={styles.alertDetailLabel}>Quantity Needed:</span>
                          <span className={styles.alertDetailValue}>{alert.quantity} units</span>
                        </div>
                        <div className={styles.alertDetail}>
                          <span className={styles.alertDetailLabel}>Sent:</span>
                          <span className={styles.alertDetailValue}>{formatDateTime(alert.sentAt)}</span>
                        </div>
                      </div>
                    </div>

                    {alert.status === 'sent' && (
                      <div className={styles.alertActions}>
                        <button 
                          className={styles.btnPrimary}
                          onClick={() => alert('Contact functionality will be connected to backend')}
                        >
                          📞 Contact Hospital
                        </button>
                        <button 
                          className={styles.btnSecondary}
                          onClick={() => alert('Response functionality will be connected to backend')}
                        >
                          ✅ Mark as Responded
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className={styles.section}>
            <div className={styles.instructionsCard}>
              <h3>📋 What to Do When You Receive an Alert</h3>
              <ol className={styles.instructionsList}>
                <li>
                  <strong>Check Your Eligibility:</strong> Ensure you haven't donated blood in the last 8 weeks
                  and are in good health.
                </li>
                <li>
                  <strong>Respond Quickly:</strong> Emergency blood requests are time-sensitive. Contact the
                  hospital as soon as possible if you can donate.
                </li>
                <li>
                  <strong>Prepare for Donation:</strong> Bring a valid ID, eat a good meal, and stay hydrated
                  before going to the hospital.
                </li>
                <li>
                  <strong>Update Your Profile:</strong> After donating, update your last donation date in your
                  profile to track your eligibility.
                </li>
                <li>
                  <strong>Can't Donate?:</strong> That's okay! Your participation is voluntary. You'll receive
                  future alerts when you're eligible again.
                </li>
              </ol>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className={styles.section}>
            <div className={styles.emergencyCard}>
              <div className={styles.emergencyIcon}>🚨</div>
              <div className={styles.emergencyContent}>
                <h3>Emergency Hotline</h3>
                <p className={styles.emergencyNumber}>911</p>
                <p>For urgent blood donation inquiries, contact the City Health Office</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
