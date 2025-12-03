'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import styles from '@/styles/Dashboard.module.css';
import { checkDonationEligibility } from '@/lib/api';
import { getDonorStats, getLeaderboard } from '@/lib/gamification';
import { getDonationHistory, getCertificate } from '@/lib/donationHistory';
import DonationScheduler from '@/components/DonationScheduler';
import BloodCompatibilityChart from '@/components/BloodCompatibilityChart';
import { DonorStatsCard, Leaderboard, BadgeDisplay } from '@/components/Gamification';
import { DonationHistory, CertificateModal, DonationStatsCard } from '@/components/DonationHistory';

// Mock donor data for development (bypasses login)
const MOCK_DONOR = {
  id: 1,
  name: "Juan Dela Cruz",
  email: "juan.delacruz@email.com",
  bloodType: "O+",
  contact: "0917-123-4567",
  address: "Barangay Barretto",
  barangay: "Barretto",
  lastDonation: "2025-08-15",
  status: "active",
  emailAlerts: true,
  donationHistory: [
    { date: "2025-08-15", location: "James L. Gordon Memorial Hospital" },
    { date: "2025-05-10", location: "Olongapo City General Hospital" },
    { date: "2025-01-20", location: "St. James Hospital" }
  ]
};

export default function DonorDashboard() {
  const router = useRouter();
  const [donor, setDonor] = useState(null);
  const [eligibility, setEligibility] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [donorStats, setDonorStats] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [donations, setDonations] = useState([]);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [stats, setStats] = useState({
    totalDonations: 0,
    lastDonation: null,
    nextEligibleDate: null,
    livesSaved: 0
  });

  useEffect(() => {
    // DEV MODE: Skip login check and use mock donor data
    const donorData = MOCK_DONOR;
    setDonor(donorData);
    
    const eligibilityStatus = checkDonationEligibility(donorData.lastDonation);
    setEligibility(eligibilityStatus);

    // Calculate stats
    const totalDonations = donorData.donationHistory?.length || 0;
    const lastDonation = donorData.lastDonation;
    const livesSaved = totalDonations * 3;
    
    let nextEligibleDate = null;
    if (!eligibilityStatus.eligible && eligibilityStatus.daysRemaining) {
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + eligibilityStatus.daysRemaining);
      nextEligibleDate = nextDate.toLocaleDateString();
    }
    
    setStats({ totalDonations, lastDonation, nextEligibleDate, livesSaved });

    // Load gamification data
    const loadGamificationData = async () => {
      const [statsData, leaderboardData, historyData] = await Promise.all([
        getDonorStats(donorData.id),
        getLeaderboard(5),
        getDonationHistory(donorData.id)
      ]);
      setDonorStats(statsData);
      setLeaderboard(leaderboardData);
      setDonations(historyData.data || []);
    };
    loadGamificationData();
  }, []);

  const handleViewCertificate = async (certificateId) => {
    const result = await getCertificate(certificateId);
    if (result.success) {
      setSelectedCertificate(result.data);
    }
  };

  const handleScheduled = (appointment) => {
    alert(`✅ Appointment scheduled for ${appointment.date} at ${appointment.timeSlot}!`);
    setActiveTab('overview');
  };

  if (!donor) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: '📊 Overview', icon: '📊' },
    { id: 'schedule', label: '📅 Schedule', icon: '📅' },
    { id: 'history', label: '📋 History', icon: '📋' },
    { id: 'achievements', label: '🏆 Achievements', icon: '🏆' },
    { id: 'compatibility', label: '🩸 Blood Types', icon: '🩸' },
  ];

  return (
    <>
      <Navbar role="donor" />
      <main className={styles.dashboardMain}>
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Welcome Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-6 mb-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Welcome back, {donor.name}! 👋</h1>
                <p className="text-red-100 mt-1">Blood Type: <span className="bg-white/20 px-2 py-1 rounded font-bold">{donor.bloodType}</span></p>
              </div>
              {donorStats && donorStats.badges.length > 0 && (
                <div className="hidden md:block">
                  <BadgeDisplay badges={donorStats.badges.slice(0, 3)} size="sm" />
                </div>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all
                  ${activeTab === tab.id 
                    ? 'bg-red-600 text-white shadow-lg' 
                    : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-600'}
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Stats */}
              <div className="lg:col-span-2 space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl p-4 shadow-lg text-center">
                    <div className="text-3xl font-bold text-red-600">{stats.totalDonations}</div>
                    <div className="text-gray-500 text-sm">Donations</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-lg text-center">
                    <div className="text-3xl font-bold text-green-600">{stats.livesSaved}</div>
                    <div className="text-gray-500 text-sm">Lives Saved</div>
                  </div>
                  <div className={`rounded-xl p-4 shadow-lg text-center ${eligibility?.eligible ? 'bg-green-50' : 'bg-yellow-50'}`}>
                    <div className="text-2xl">{eligibility?.eligible ? '✅' : '⏳'}</div>
                    <div className={`text-sm font-semibold ${eligibility?.eligible ? 'text-green-600' : 'text-yellow-600'}`}>
                      {eligibility?.eligible ? 'Ready!' : 'Wait Period'}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Link href="/donor/profile" className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors">
                      <span className="text-2xl mb-2">👤</span>
                      <span className="text-sm font-medium">Profile</span>
                    </Link>
                    <button onClick={() => setActiveTab('schedule')} className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors">
                      <span className="text-2xl mb-2">📅</span>
                      <span className="text-sm font-medium">Schedule</span>
                    </button>
                    <Link href="/donor/alerts" className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors">
                      <span className="text-2xl mb-2">🔔</span>
                      <span className="text-sm font-medium">Alerts</span>
                    </Link>
                    <button onClick={() => setActiveTab('achievements')} className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors">
                      <span className="text-2xl mb-2">🏆</span>
                      <span className="text-sm font-medium">Badges</span>
                    </button>
                  </div>
                </div>

                {/* Recent Donations */}
                {donations.length > 0 && (
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-bold text-gray-800">Recent Donations</h2>
                      <button onClick={() => setActiveTab('history')} className="text-red-600 text-sm hover:underline">View All →</button>
                    </div>
                    <DonationHistory donations={donations.slice(0, 3)} onViewCertificate={handleViewCertificate} />
                  </div>
                )}
              </div>

              {/* Right Column - Leaderboard */}
              <div className="space-y-6">
                {donorStats && <DonorStatsCard stats={donorStats} />}
                {leaderboard.length > 0 && <Leaderboard entries={leaderboard} currentDonorId={donor.id} />}
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="max-w-2xl mx-auto">
              <DonationScheduler donorId={donor.id} onScheduled={handleScheduled} />
            </div>
          )}

          {activeTab === 'history' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <DonationStatsCard 
                totalDonations={stats.totalDonations}
                totalUnits={stats.totalDonations}
                livesSaved={stats.livesSaved}
                lastDonation={stats.lastDonation}
                nextEligibleDate={stats.nextEligibleDate}
                streak={donorStats?.streakDays || 0}
              />
              <DonationHistory donations={donations} onViewCertificate={handleViewCertificate} />
            </div>
          )}

          {activeTab === 'achievements' && donorStats && (
            <div className="max-w-3xl mx-auto space-y-6">
              <DonorStatsCard stats={donorStats} />
              <Leaderboard entries={leaderboard} currentDonorId={donor.id} />
            </div>
          )}

          {activeTab === 'compatibility' && (
            <div className="max-w-3xl mx-auto">
              <BloodCompatibilityChart selectedBloodType={donor.bloodType} />
            </div>
          )}
        </div>
      </main>

      {/* Certificate Modal */}
      {selectedCertificate && (
        <CertificateModal 
          certificate={selectedCertificate} 
          onClose={() => setSelectedCertificate(null)} 
        />
      )}
    </>
  );
}
