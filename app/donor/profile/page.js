'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { checkDonationEligibility, formatDate } from '../../../lib/api';
import styles from '../../../styles/donor.module.css';

export default function DonorProfile() {
  const router = useRouter();
  const [donor, setDonor] = useState(null);
  const [eligibility, setEligibility] = useState(null);

  useEffect(() => {
    const donorUser = localStorage.getItem('donorUser');
    if (!donorUser) {
      router.push('/donor/login');
      return;
    }

    const donorData = JSON.parse(donorUser);
    setDonor(donorData);
    
    const eligibilityStatus = checkDonationEligibility(donorData.lastDonation);
    setEligibility(eligibilityStatus);
  }, []);

  if (!donor) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar role="donor" />
      <main className={styles.donorMain}>
        <div className="container">
          <div className={styles.profileHeader}>
            <div className={styles.profileAvatar}>
              <span className={styles.avatarIcon}>👤</span>
            </div>
            <div className={styles.profileInfo}>
              <h1>{donor.name}</h1>
              <p className={styles.profileEmail}>{donor.email}</p>
              <div className={styles.profileBadges}>
                <span className={`${styles.bloodTypeBadge} ${styles.bloodTypeLarge}`}>
                  {donor.bloodType}
                </span>
                <span className={styles.statusBadge}>
                  {donor.status === 'active' ? '✅ Active Donor' : '⏸️ Inactive'}
                </span>
              </div>
            </div>
            <div className={styles.profileActions}>
              <Link href="/donor/update" className={styles.btnPrimary}>
                Edit Profile
              </Link>
            </div>
          </div>

          {/* Eligibility Status */}
          <div className={styles.section}>
            <div className={`${styles.eligibilityCard} ${eligibility?.eligible ? styles.eligible : styles.notEligible}`}>
              <div className={styles.eligibilityIcon}>
                {eligibility?.eligible ? '✅' : '⏳'}
              </div>
              <div className={styles.eligibilityContent}>
                <h3 className={styles.eligibilityTitle}>
                  {eligibility?.eligible ? 'Eligible to Donate' : 'Not Yet Eligible'}
                </h3>
                <p className={styles.eligibilityMessage}>{eligibility?.message}</p>
                {eligibility?.daysRemaining && (
                  <p className={styles.eligibilityDetail}>
                    You can donate again in {eligibility.daysRemaining} days
                  </p>
                )}
                {eligibility?.daysSinceLastDonation && (
                  <p className={styles.eligibilityDetail}>
                    Last donation was {eligibility.daysSinceLastDonation} days ago
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Personal Information</h2>
            <div className={styles.infoCard}>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Full Name</span>
                  <span className={styles.infoValue}>{donor.name}</span>
                </div>

                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Email Address</span>
                  <span className={styles.infoValue}>{donor.email}</span>
                </div>

                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Blood Type</span>
                  <span className={styles.infoValue}>
                    <span className={styles.bloodTypeBadge}>{donor.bloodType}</span>
                  </span>
                </div>

                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Contact Number</span>
                  <span className={styles.infoValue}>{donor.contact}</span>
                </div>

                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Barangay</span>
                  <span className={styles.infoValue}>{donor.barangay}</span>
                </div>

                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Complete Address</span>
                  <span className={styles.infoValue}>{donor.address}</span>
                </div>

                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Last Donation Date</span>
                  <span className={styles.infoValue}>
                    {donor.lastDonation ? formatDate(donor.lastDonation) : 'No previous donation'}
                  </span>
                </div>

                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Email Alerts</span>
                  <span className={styles.infoValue}>
                    {donor.emailAlerts ? '✅ Enabled' : '❌ Disabled'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Donation Guidelines */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Donation Guidelines</h2>
            <div className={styles.guidelinesGrid}>
              <div className={styles.guidelineCard}>
                <div className={styles.guidelineIcon}>⏰</div>
                <h3>Donation Frequency</h3>
                <p>Wait at least 8 weeks (56 days) between blood donations</p>
              </div>

              <div className={styles.guidelineCard}>
                <div className={styles.guidelineIcon}>💪</div>
                <h3>Health Requirements</h3>
                <p>Be in good health, well-rested, and have eaten before donating</p>
              </div>

              <div className={styles.guidelineCard}>
                <div className={styles.guidelineIcon}>📋</div>
                <h3>What to Bring</h3>
                <p>Valid ID and this donor profile information</p>
              </div>

              <div className={styles.guidelineCard}>
                <div className={styles.guidelineIcon}>🔔</div>
                <h3>Emergency Alerts</h3>
                <p>Respond quickly to alerts when you're eligible and available</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Quick Actions</h2>
            <div className={styles.actionsGrid}>
              <Link href="/donor/update" className={styles.actionCard}>
                <div className={styles.actionIcon}>✏️</div>
                <h3>Update Information</h3>
                <p>Edit your contact details and preferences</p>
              </Link>

              <Link href="/donor/alerts" className={styles.actionCard}>
                <div className={styles.actionIcon}>🔔</div>
                <h3>View Alerts</h3>
                <p>Check emergency blood request notifications</p>
              </Link>

              <div className={styles.actionCard} onClick={() => alert('Contact functionality will be implemented')}>
                <div className={styles.actionIcon}>📞</div>
                <h3>Contact Support</h3>
                <p>Get help or report an issue</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
