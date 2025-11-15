'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { checkDonationEligibility, formatDate } from '@/lib/api';
import styles from '@/styles/donor.module.css';

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
      <main className={styles.profileMain}>
        <div className="container">
          {/* Profile Header */}
          <div className={styles.profileHeader}>
            <div className={styles.profileInfo}>
              <h1>{donor.name}</h1>
              <p>Blood Type: <span className={styles.bloodTypeBadge}>{donor.bloodType}</span></p>
              <p className={styles.status}>{donor.status === 'active' ? '✓ Active Donor' : '⏸ Inactive'}</p>
            </div>
            <div className={styles.profileActions}>
              <Link href="/donor/update" className={styles.editButton}>
                Edit Profile
              </Link>
            </div>
          </div>

          {/* Eligibility Status */}
          <div className={styles.statusSection}>
            <h2>Donation Status</h2>
            <div className={`${styles.statusCard} ${eligibility?.eligible ? styles.eligible : styles.notEligible}`}>
              <div className={styles.statusIcon}>
                {eligibility?.eligible ? '✓' : '⏱'}
              </div>
              <div className={styles.statusContent}>
                <h3>{eligibility?.eligible ? 'Ready to Donate' : 'Wait Period Active'}</h3>
                <p>{eligibility?.message}</p>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className={styles.infoSection}>
            <h2>Personal Information</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.label}>Email</span>
                <span className={styles.value}>{donor.email}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Contact</span>
                <span className={styles.value}>{donor.contact}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Barangay</span>
                <span className={styles.value}>{donor.barangay}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Address</span>
                <span className={styles.value}>{donor.address}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Last Donation</span>
                <span className={styles.value}>{donor.lastDonation ? formatDate(donor.lastDonation) : 'No previous donation'}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Email Alerts</span>
                <span className={styles.value}>{donor.emailAlerts ? 'Enabled' : 'Disabled'}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className={styles.actionsSection}>
            <h2>Quick Actions</h2>
            <div className={styles.actionsGrid}>
              <Link href="/donor/update" className={styles.actionButton}>
                <span className={styles.actionIcon}>✏️</span>
                Update Information
              </Link>
              <Link href="/donor/alerts" className={styles.actionButton}>
                <span className={styles.actionIcon}>🔔</span>
                View Alerts
              </Link>
              <button className={styles.actionButton} onClick={() => alert('Contact functionality will be implemented')}>
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
