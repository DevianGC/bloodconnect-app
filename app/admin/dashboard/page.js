'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminTemplate from '@/components/atomic/templates/AdminTemplate';
import StatCard from '@/components/atomic/molecules/StatCard';
import { getAnalytics, getRequests } from '@/lib/api';
import styles from '@/styles/admin.module.css';

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
      <AdminTemplate title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </AdminTemplate>
    );
  }

  return (
    <AdminTemplate title="Dashboard">
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon="👥" value={analytics?.totalDonors || 0} label="Total Donors" />
          <StatCard icon="🩸" value={analytics?.activeRequests || 0} label="Active Requests" />
          <StatCard icon="📋" value={analytics?.totalRequests || 0} label="Total Requests" />
          <StatCard icon="✅" value={(analytics?.totalRequests || 0) - (analytics?.activeRequests || 0)} label="Fulfilled" />
        </div>

        {/* Quick Actions */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/admin/requests" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-red-200 transition-all group">
              <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center text-2xl mb-4 group-hover:bg-red-100 transition-colors">🩸</div>
              <h3 className="font-semibold text-gray-900 mb-1">Create Blood Request</h3>
              <p className="text-sm text-gray-500">Submit a new emergency blood request</p>
            </Link>

            <Link href="/admin/donors" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-red-200 transition-all group">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-2xl mb-4 group-hover:bg-blue-100 transition-colors">➕</div>
              <h3 className="font-semibold text-gray-900 mb-1">Add Donor</h3>
              <p className="text-sm text-gray-500">Register a new blood donor</p>
            </Link>

            <Link href="/admin/analytics" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-red-200 transition-all group">
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center text-2xl mb-4 group-hover:bg-purple-100 transition-colors">📊</div>
              <h3 className="font-semibold text-gray-900 mb-1">View Analytics</h3>
              <p className="text-sm text-gray-500">Check donor statistics and trends</p>
            </Link>
          </div>
        </section>

        {/* Active Requests */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Active Blood Requests</h2>
            <Link href="/admin/requests" className="text-red-600 hover:text-red-700 font-medium text-sm">
              View All →
            </Link>
          </div>

          {activeRequests.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-500">
              <p>No active blood requests at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeRequests.map(request => (
                <div key={request.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-gray-900">{request.hospitalName}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      request.urgency === 'critical' ? 'bg-red-100 text-red-700' :
                      request.urgency === 'urgent' ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {request.urgency.toUpperCase()}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Blood Type:</span>
                      <span className="font-semibold text-gray-900">{request.bloodType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quantity:</span>
                      <span className="font-semibold text-gray-900">{request.quantity} units</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Matched:</span>
                      <span className="font-semibold text-gray-900">{request.matchedDonors}</span>
                    </div>
                  </div>
                  {request.notes && (
                    <p className="mt-4 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                      {request.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Blood Type Distribution */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Donor Distribution</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {Object.entries(analytics?.donorsByBloodType || {}).map(([type, count]) => (
              <div key={type} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-center">
                <div className="text-2xl font-bold text-red-600 mb-1">{type}</div>
                <div className="text-sm text-gray-600">{count} donors</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AdminTemplate>
  );
}
