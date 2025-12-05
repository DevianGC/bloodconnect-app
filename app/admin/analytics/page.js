'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import AdminTemplate from '@/components/atomic/templates/AdminTemplate';
import StatCard from '@/components/atomic/molecules/StatCard';
import Button from '@/components/atomic/atoms/Button';
import { getAnalytics } from '@/lib/api';

const AnalyticsChart = dynamic(() => import('@/components/AnalyticsChart'), {
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>,
  ssr: false
});

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
      <AdminTemplate title="Analytics & Reports">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </AdminTemplate>
    );
  }

  return (
    <AdminTemplate title="Analytics & Reports">
      <div className="space-y-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Donors"
            value={analytics?.totalDonors || 0}
            icon="👥"
            trend="+12% this month"
            trendUp={true}
          />
          <StatCard
            title="Active Requests"
            value={analytics?.activeRequests || 0}
            icon="🩸"
            trend="Needs attention"
            trendUp={false}
          />
          <StatCard
            title="Total Requests"
            value={analytics?.totalRequests || 0}
            icon="📋"
            trend="+5% this month"
            trendUp={true}
          />
          <StatCard
            title="Fulfilled Requests"
            value={(analytics?.totalRequests || 0) - (analytics?.activeRequests || 0)}
            icon="✅"
            trend="85% success rate"
            trendUp={true}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <AnalyticsChart
              title="Donors by Blood Type"
              data={analytics?.donorsByBloodType}
              type="bar"
            />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <AnalyticsChart
              title="Donors by Barangay"
              data={analytics?.donorsByBarangay}
              type="table"
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
          {analytics?.recentActivity && analytics.recentActivity.length > 0 ? (
            <div className="space-y-4">
              {analytics.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500">{activity.date}</div>
                  <div className="font-medium text-gray-900">{activity.event}</div>
                  <div className="text-sm font-semibold text-red-600">{activity.count}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No recent activity to display.</p>
            </div>
          )}
        </div>

        {/* Export Options */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Export Reports</h2>
          <div className="flex flex-wrap gap-4">
            <Button 
              variant="secondary"
              onClick={() => alert('CSV export will be implemented with backend')}
            >
              📊 Export to CSV
            </Button>
            <Button 
              variant="secondary"
              onClick={() => alert('PDF export will be implemented with backend')}
            >
              📄 Export to PDF
            </Button>
            <Button 
              variant="secondary"
              onClick={() => alert('Print functionality will be implemented')}
            >
              🖨️ Print Report
            </Button>
          </div>
        </div>
      </div>
    </AdminTemplate>
  );
}
