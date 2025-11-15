'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import styles from '@/styles/Dashboard.module.css';
import { checkDonationEligibility } from '@/lib/api';

export default function DonorDashboard() {
  const router = useRouter();
  const [donor, setDonor] = useState(null);
  const [eligibility, setEligibility] = useState(null);
  const [stats, setStats] = useState({
    totalDonations: 0,
    lastDonation: null,
    nextEligibleDate: null,
    livesSaved: 0
  });

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

    // Calculate stats
    const totalDonations = donorData.donationHistory?.length || 0;
    const lastDonation = donorData.lastDonation;
    const livesSaved = totalDonations * 3; // Estimated 3 lives per donation
    
    // Calculate next eligible date
    let nextEligibleDate = null;
    if (!eligibilityStatus.eligible && eligibilityStatus.daysRemaining) {
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + eligibilityStatus.daysRemaining);
      nextEligibleDate = nextDate.toLocaleDateString();
    }
    
    setStats({
      totalDonations,
      lastDonation,
      nextEligibleDate,
      livesSaved
    });
  }, []);

  if (!donor) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar role="donor" />
      <main className={styles.dashboardMain}>
        <div className="container">
          {/* Welcome Header */}
          <div className={styles.welcomeSection}>
            <h1>Welcome back, {donor.name}</h1>
            <p>Blood Type: <span className={styles.bloodTypeBadge}>{donor.bloodType}</span></p>
          </div>

          {/* Status Cards */}
          <div className={styles.statusGrid}>
            <div className={styles.statusCard}>
              <div className={styles.statusIcon}>🩸</div>
              <div className={styles.statusInfo}>
                <h3>{stats.totalDonations}</h3>
                <p>Total Donations</p>
              </div>
            </div>
            
            <div className={styles.statusCard}>
              <div className={styles.statusIcon}>❤️</div>
              <div className={styles.statusInfo}>
                <h3>{stats.livesSaved}</h3>
                <p>Lives Impacted</p>
              </div>
            </div>
            
            <div className={`${styles.statusCard} ${eligibility?.eligible ? styles.eligible : styles.notEligible}`}>
              <div className={styles.statusIcon}>{eligibility?.eligible ? '✓' : '⏱'}</div>
              <div className={styles.statusInfo}>
                <h3>{eligibility?.eligible ? 'Ready to Donate' : 'Wait Period'}</h3>
                <p>{eligibility?.message}</p>
              </div>
            </div>
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
                Update Info
              </Link>
              <Link href="/donor/alerts" className={styles.actionButton}>
                <span className={styles.actionIcon}>🔔</span>
                Blood Alerts
              </Link>
              {eligibility?.eligible && (
                <button className={`${styles.actionButton} ${styles.primaryAction}`}>
                  <span className={styles.actionIcon}>🩸</span>
                  Schedule Donation
                </button>
              )}
            </div>
          </div>

          {/* Last Donation Info */}
          {stats.lastDonation && (
            <div className={styles.lastDonationSection}>
              <h2>Last Donation</h2>
              <div className={styles.donationInfo}>
                <p><strong>Date:</strong> {stats.lastDonation}</p>
                <p><strong>Next Eligible:</strong> {stats.nextEligibleDate || 'Calculate based on 56-day waiting period'}</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
