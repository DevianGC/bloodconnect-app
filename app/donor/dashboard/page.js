'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { checkDonationEligibility } from '@/lib/api';
import { getDonorById } from '@/lib/db';
import { getDonorStats, getLeaderboard } from '@/lib/gamification';
import { getDonationHistory, getCertificate } from '@/lib/donationHistory';
import DonationScheduler from '@/components/DonationScheduler';
import BloodCompatibilityChart from '@/components/BloodCompatibilityChart';
import { DonorStatsCard, Leaderboard, BadgeDisplay } from '@/components/Gamification';
import { DonationHistory, CertificateModal, DonationStatsCard } from '@/components/DonationHistory';

// Simple SVG Icons
const Icons = {
  Overview: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
  Schedule: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  History: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>,
  Achievements: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
  Blood: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>,
  Drop: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>,
  Heart: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
  Clock: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
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
    // Check for logged in user
    const storedUser = localStorage.getItem('donorUser');
    
    if (!storedUser) {
      router.push('/donor/login');
      return;
    }

    try {
      const donorData = JSON.parse(storedUser);
      setDonor(donorData);
      
      const eligibilityStatus = checkDonationEligibility(donorData.lastDonation);
      setEligibility(eligibilityStatus);
      
      // Fetch real data
      fetchDashboardData(donorData.uid || donorData.id);
    } catch (error) {
      console.error("Error parsing user data", error);
      router.push('/donor/login');
    }
  }, [router]);

  const fetchDashboardData = async (donorId) => {
    try {
      // Fetch latest donor profile
      try {
        const latestDonor = await getDonorById(donorId);
        if (latestDonor) {
          setDonor(latestDonor);
          localStorage.setItem('donorUser', JSON.stringify(latestDonor));
        }
      } catch (err) {
        console.warn("Could not fetch latest donor data, using local data.");
      }

      // Fetch gamification stats
      const statsRes = await getDonorStats(donorId);
      if (statsRes.success) setDonorStats(statsRes.data);
      
      // Fetch leaderboard
      const lbRes = await getLeaderboard();
      if (lbRes.success) setLeaderboard(lbRes.data);
      
      // Fetch donation history
      const historyRes = await getDonationHistory(donorId);
      if (historyRes.success) {
        setDonations(historyRes.data);
        
        // Calculate stats from history
        const records = historyRes.data;
        const totalDonations = records.length;
        const livesSaved = totalDonations * 3;
        const lastDonation = records.length > 0 ? records[0].date : null;
        
        // Calculate next eligible
        let nextEligibleDate = null;
        if (lastDonation) {
          const nextDate = new Date(lastDonation);
          nextDate.setDate(nextDate.getDate() + 56);
          nextEligibleDate = nextDate.toISOString().split('T')[0];
        }
        
        setStats({
          totalDonations,
          lastDonation,
          nextEligibleDate,
          livesSaved
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Icons.Overview },
    { id: 'schedule', label: 'Schedule', icon: Icons.Schedule },
    { id: 'history', label: 'History', icon: Icons.History },
    { id: 'achievements', label: 'Achievements', icon: Icons.Achievements },
    { id: 'compatibility', label: 'Blood Types', icon: Icons.Blood },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role="donor" />
      
      <main className="container mx-auto px-4 pt-20 md:pt-24 pb-8 md:pb-12 max-w-7xl">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, {donor.name}</h1>
              <p className="text-gray-500 mt-1">Here's what's happening with your donations today.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-red-50 px-4 py-2 rounded-xl border border-red-100">
                <span className="text-xs font-semibold text-red-600 uppercase tracking-wider">Blood Type</span>
                <div className="text-xl font-bold text-red-700">{donor.bloodType}</div>
              </div>
              {donorStats && donorStats.badges.length > 0 && (
                <div className="hidden md:block">
                  <BadgeDisplay badges={donorStats.badges.slice(0, 3)} size="sm" />
                </div>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-4 md:gap-6 mt-6 md:mt-8 border-b border-gray-100 overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 pb-4 px-2 text-sm font-medium transition-all relative whitespace-nowrap
                    ${activeTab === tab.id 
                      ? 'text-red-600' 
                      : 'text-gray-500 hover:text-gray-700'}
                  `}
                >
                  <Icon />
                  {tab.label}
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-t-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="animate-fadeIn">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Left Column - Main Stats & Actions */}
              <div className="lg:col-span-2 space-y-6 lg:space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="p-3 bg-red-50 rounded-lg text-red-600">
                        <Icons.Drop />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Total Donations</p>
                        <h3 className="text-2xl font-bold text-gray-900">{stats.totalDonations}</h3>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="p-3 bg-green-50 rounded-lg text-green-600">
                        <Icons.Heart />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Lives Saved</p>
                        <h3 className="text-2xl font-bold text-gray-900">{stats.livesSaved}</h3>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4 mb-2">
                      <div className={`p-3 rounded-lg ${eligibility?.eligible ? 'bg-blue-50 text-blue-600' : 'bg-yellow-50 text-yellow-600'}`}>
                        <Icons.Clock />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Status</p>
                        <h3 className={`text-lg font-bold ${eligibility?.eligible ? 'text-blue-600' : 'text-yellow-600'}`}>
                          {eligibility?.eligible ? 'Eligible' : 'Waiting'}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link href="/donor/profile" className="group p-4 rounded-xl border border-gray-100 hover:border-red-100 hover:bg-red-50 transition-all text-center">
                      <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">👤</span>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-red-700">Profile</span>
                    </Link>
                    <button onClick={() => setActiveTab('schedule')} className="group p-4 rounded-xl border border-gray-100 hover:border-red-100 hover:bg-red-50 transition-all text-center">
                      <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">📅</span>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-red-700">Schedule</span>
                    </button>
                    <Link href="/donor/alerts" className="group p-4 rounded-xl border border-gray-100 hover:border-red-100 hover:bg-red-50 transition-all text-center">
                      <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">🔔</span>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-red-700">Alerts</span>
                    </Link>
                    <button onClick={() => setActiveTab('achievements')} className="group p-4 rounded-xl border border-gray-100 hover:border-red-100 hover:bg-red-50 transition-all text-center">
                      <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">🏆</span>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-red-700">Badges</span>
                    </button>
                  </div>
                </div>

                {/* Recent Donations */}
                {donations.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-bold text-gray-900">Recent Donations</h2>
                      <button onClick={() => setActiveTab('history')} className="text-sm text-red-600 hover:text-red-700 font-medium">View All</button>
                    </div>
                    <DonationHistory donations={donations.slice(0, 3)} onViewCertificate={handleViewCertificate} variant="list" />
                  </div>
                )}
              </div>

              {/* Right Column - Leaderboard & Status */}
              <div className="space-y-6 lg:space-y-8">
                {/* Eligibility Status Card - Always Visible */}
                <div className={`rounded-xl p-6 text-white shadow-lg ${
                  eligibility?.eligible 
                    ? 'bg-gradient-to-br from-red-600 to-red-700' 
                    : 'bg-gradient-to-br from-gray-900 to-gray-800'
                }`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        {eligibility?.eligible ? 'Ready to Donate?' : 'Next Eligible Date'}
                      </h3>
                      <p className="text-white/90 text-sm mb-6">
                        {eligibility?.eligible 
                          ? 'You are currently eligible to donate blood. Your contribution can save up to 3 lives!' 
                          : 'Thank you for your recent donation. Rest up!'}
                      </p>
                    </div>
                    <div className="p-3 bg-white/10 rounded-lg">
                      <Icons.Clock />
                    </div>
                  </div>
                  
                  {eligibility?.eligible ? (
                    <button 
                      onClick={() => setActiveTab('schedule')}
                      className="w-full py-3 bg-white text-red-600 font-bold rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <span>Schedule Appointment</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </button>
                  ) : (
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-1">Eligible From</p>
                      <div className="text-3xl font-bold text-white">
                        {stats.nextEligibleDate ? new Date(stats.nextEligibleDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : 'Calculating...'}
                      </div>
                    </div>
                  )}
                </div>

                {/* Impact / Stats Card */}
                {donorStats ? (
                  <DonorStatsCard stats={donorStats} />
                ) : (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Your Impact Journey</h3>
                    <p className="text-gray-500 text-sm mb-6">
                      Complete your first donation to unlock badges and track your lifesaving impact.
                    </p>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl mb-1 grayscale opacity-50">🏆</div>
                        <div className="text-xs text-gray-400 font-medium">First Blood</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl mb-1 grayscale opacity-50">⭐</div>
                        <div className="text-xs text-gray-400 font-medium">Lifesaver</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl mb-1 grayscale opacity-50">🎖️</div>
                        <div className="text-xs text-gray-400 font-medium">Hero</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Leaderboard or Community Tip */}
                {leaderboard.length > 0 ? (
                  <Leaderboard entries={leaderboard} currentDonorId={donor.id} />
                ) : (
                  <div className="bg-blue-50 rounded-xl border border-blue-100 p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </div>
                      <h3 className="text-lg font-bold text-blue-900">Did You Know?</h3>
                    </div>
                    <p className="text-blue-800 text-sm leading-relaxed">
                      A single car accident victim can require as many as 100 pints of blood. Your regular donations ensure that blood is available when it's needed most.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
              <DonationScheduler donorId={donor.id} onScheduled={handleScheduled} />
            </div>
          )}

          {activeTab === 'history' && (
            <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
              <DonationStatsCard 
                totalDonations={stats.totalDonations}
                totalUnits={stats.totalDonations}
                livesSaved={stats.livesSaved}
                lastDonation={stats.lastDonation}
                nextEligibleDate={stats.nextEligibleDate}
                streak={donorStats?.streakDays || 0}
              />
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Donation History</h2>
                <DonationHistory donations={donations} onViewCertificate={handleViewCertificate} variant="list" />
              </div>
            </div>
          )}

          {activeTab === 'achievements' && donorStats && (
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
              <DonorStatsCard stats={donorStats} />
              <Leaderboard entries={leaderboard} currentDonorId={donor.id} />
            </div>
          )}

          {activeTab === 'compatibility' && (
            <div className="max-w-4xl mx-auto">
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
    </div>
  );
}
