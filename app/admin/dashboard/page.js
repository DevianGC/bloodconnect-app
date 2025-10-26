'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import Sidebar from '../../../components/Sidebar';
import { getAnalytics, getRequests } from '../../../lib/api';
import styles from '../../../styles/admin.module.css';

export default function AdminDashboard() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState(null);
  const [activeRequests, setActiveRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin is logged in
    const adminUser = localStorage.getItem('adminUser');
    if (!adminUser) {
      router.push('/admin/login');
      return;
    }

    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [analyticsResult, requestsResult] = await Promise.all([
        getAnalytics(),
        getRequests({ status: 'active' }),
      ]);

      if (analyticsResult.success) {
        setAnalytics(analyticsResult.data);
      }
      if (requestsResult.success) {
        setActiveRequests(requestsResult.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar role="admin" />
      <div className={styles.adminLayout}>
        <Sidebar role="admin" />
        <main className={styles.adminMain}>
          <div className={styles.adminHeader}>
            <h1>Admin Dashboard</h1>
            <p className={styles.adminSubtitle}>Welcome back! Here's your overview.</p>
          </div>

          {/* Summary Cards */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>👥</div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>{analytics?.totalDonors || 0}</div>
                <div className={styles.statLabel}>Total Donors</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>🩸</div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>{analytics?.activeRequests || 0}</div>
                <div className={styles.statLabel}>Active Requests</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>📋</div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>{analytics?.totalRequests || 0}</div>
                <div className={styles.statLabel}>Total Requests</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>✅</div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>
                  {analytics?.totalRequests - analytics?.activeRequests || 0}
                </div>
                <div className={styles.statLabel}>Fulfilled</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Quick Actions</h2>
            <div className={styles.actionsGrid}>
              <Link href="/admin/requests" className={styles.actionCard}>
                <div className={styles.actionIcon}>🩸</div>
                <h3>Create Blood Request</h3>
                <p>Submit a new emergency blood request</p>
              </Link>

              <Link href="/admin/donors" className={styles.actionCard}>
                <div className={styles.actionIcon}>➕</div>
                <h3>Add Donor</h3>
                <p>Register a new blood donor</p>
              </Link>

              <Link href="/admin/analytics" className={styles.actionCard}>
                <div className={styles.actionIcon}>📊</div>
                <h3>View Analytics</h3>
                <p>Check donor statistics and trends</p>
              </Link>
            </div>
          </div>

          {/* Active Requests */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Active Blood Requests</h2>
              <Link href="/admin/requests" className={styles.linkButton}>
                View All →
              </Link>
            </div>

            {activeRequests.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No active blood requests at the moment.</p>
              </div>
            ) : (
              <div className={styles.requestsList}>
                {activeRequests.map(request => (
                  <div key={request.id} className={styles.requestCard}>
                    <div className={styles.requestHeader}>
                      <h3>{request.hospitalName}</h3>
                      <span className={`${styles.urgencyBadge} ${styles[`urgency${request.urgency}`]}`}>
                        {request.urgency}
                      </span>
                    </div>
                    <div className={styles.requestDetails}>
                      <div className={styles.requestDetail}>
                        <strong>Blood Type:</strong> {request.bloodType}
                      </div>
                      <div className={styles.requestDetail}>
                        <strong>Quantity:</strong> {request.quantity} units
                      </div>
                      <div className={styles.requestDetail}>
                        <strong>Matched Donors:</strong> {request.matchedDonors}
                      </div>
                    </div>
                    {request.notes && (
                      <p className={styles.requestNotes}>{request.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Blood Type Distribution */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Donor Distribution by Blood Type</h2>
            <div className={styles.bloodTypeGrid}>
              {Object.entries(analytics?.donorsByBloodType || {}).map(([type, count]) => (
                <div key={type} className={styles.bloodTypeCard}>
                  <div className={styles.bloodType}>{type}</div>
                  <div className={styles.bloodTypeCount}>{count} donors</div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
