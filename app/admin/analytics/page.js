'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Sidebar from '../../../components/Sidebar';
import AnalyticsChart from '../../../components/AnalyticsChart';
import { getAnalytics } from '../../../lib/api';
import styles from '../../../styles/admin.module.css';

export default function AdminAnalytics() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminUser = localStorage.getItem('adminUser');
    if (!adminUser) {
      router.push('/admin/login');
      return;
    }
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const result = await getAnalytics();
      if (result.success) {
        setAnalytics(result.data);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading analytics...</p>
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
            <h1>Analytics & Reports</h1>
            <p className={styles.adminSubtitle}>Donor statistics and blood request trends</p>
          </div>

          {/* Summary Stats */}
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
                <div className={styles.statLabel}>Fulfilled Requests</div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className={styles.chartsGrid}>
            <div className={styles.chartCard}>
              <AnalyticsChart
                title="Donors by Blood Type"
                data={analytics?.donorsByBloodType}
                type="bar"
              />
            </div>

            <div className={styles.chartCard}>
              <AnalyticsChart
                title="Donors by Barangay"
                data={analytics?.donorsByBarangay}
                type="table"
              />
            </div>
          </div>

          {/* Recent Activity */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Recent Activity</h2>
            {analytics?.recentActivity && analytics.recentActivity.length > 0 ? (
              <div className={styles.activityList}>
                {analytics.recentActivity.map((activity, index) => (
                  <div key={index} className={styles.activityItem}>
                    <div className={styles.activityDate}>{activity.date}</div>
                    <div className={styles.activityEvent}>{activity.event}</div>
                    <div className={styles.activityCount}>{activity.count}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <p>No recent activity to display.</p>
              </div>
            )}
          </div>

          {/* Export Options */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Export Reports</h2>
            <div className={styles.exportButtons}>
              <button 
                className={styles.btnSecondary}
                onClick={() => alert('CSV export will be implemented with backend')}
              >
                📊 Export to CSV
              </button>
              <button 
                className={styles.btnSecondary}
                onClick={() => alert('PDF export will be implemented with backend')}
              >
                📄 Export to PDF
              </button>
              <button 
                className={styles.btnSecondary}
                onClick={() => alert('Print functionality will be implemented')}
              >
                🖨️ Print Report
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
