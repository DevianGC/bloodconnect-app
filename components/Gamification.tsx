'use client';

import React from 'react';
import { BADGE_DEFINITIONS } from '@/lib/gamification';
import type { Badge, DonorStats, LeaderboardEntry } from '@/types/appointments';

interface BadgeDisplayProps {
  badges: Badge[];
  size?: 'sm' | 'md' | 'lg';
}

export function BadgeDisplay({ badges, size = 'md' }: BadgeDisplayProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-12 h-12 text-2xl',
    lg: 'w-16 h-16 text-3xl',
  };

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge) => (
        <div
          key={badge.id}
          className={`
            ${sizeClasses[size]} rounded-full bg-gradient-to-br from-yellow-100 to-yellow-200
            flex items-center justify-center shadow-md hover:scale-110 transition-transform
            cursor-pointer group relative
          `}
          title={`${badge.name}: ${badge.description}`}
        >
          <span>{badge.icon}</span>
          
          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
            <div className="font-semibold">{badge.name}</div>
            <div className="text-gray-300">{badge.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

interface StatsCardProps {
  stats: DonorStats;
}

export function DonorStatsCard({ stats }: StatsCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        🏆 Your Achievements
      </h2>

      {/* Points and Rank */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl p-4 text-white">
          <div className="text-3xl font-bold">{stats.points}</div>
          <div className="text-purple-200 text-sm">Total Points</div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl p-4 text-white">
          <div className="text-3xl font-bold">#{stats.rank || '—'}</div>
          <div className="text-blue-200 text-sm">Leaderboard Rank</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-50 rounded-xl">
          <div className="text-2xl font-bold text-red-600">{stats.totalDonations}</div>
          <div className="text-xs text-gray-500">Donations</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-xl">
          <div className="text-2xl font-bold text-green-600">{stats.livesSaved}</div>
          <div className="text-xs text-gray-500">Lives Saved</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-xl">
          <div className="text-2xl font-bold text-orange-600">{stats.streakDays}</div>
          <div className="text-xs text-gray-500">Streak</div>
        </div>
      </div>

      {/* Badges */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-3">Badges Earned ({stats.badges.length})</h3>
        {stats.badges.length > 0 ? (
          <BadgeDisplay badges={stats.badges} size="md" />
        ) : (
          <p className="text-gray-500 text-sm">Complete your first donation to earn badges!</p>
        )}
      </div>

      {/* Next Badge Progress */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <h3 className="font-semibold text-gray-700 mb-2">Next Badge</h3>
        <NextBadgeProgress stats={stats} />
      </div>
    </div>
  );
}

function NextBadgeProgress({ stats }: { stats: DonorStats }) {
  // Determine next badge
  const milestones = [
    { type: 'first-donation', required: 1 },
    { type: 'regular-donor', required: 3 },
    { type: 'hero-donor', required: 10 },
    { type: 'life-saver', required: 25 },
    { type: 'legend', required: 50 },
  ];

  const earnedTypes = stats.badges.map(b => b.type);
  const nextMilestone = milestones.find(m => !earnedTypes.includes(m.type as any));

  if (!nextMilestone) {
    return (
      <div className="text-center py-4 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-xl">
        <span className="text-2xl">👑</span>
        <p className="font-semibold text-yellow-800">You've earned all donation badges!</p>
      </div>
    );
  }

  const badgeDef = BADGE_DEFINITIONS[nextMilestone.type as keyof typeof BADGE_DEFINITIONS];
  const progress = (stats.totalDonations / nextMilestone.required) * 100;

  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl opacity-50">{badgeDef.icon}</span>
        <div>
          <div className="font-semibold text-gray-800">{badgeDef.name}</div>
          <div className="text-xs text-gray-500">{badgeDef.description}</div>
        </div>
      </div>
      <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="absolute h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      <div className="text-xs text-gray-500 mt-1 text-right">
        {stats.totalDonations} / {nextMilestone.required} donations
      </div>
    </div>
  );
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentDonorId?: number | string;
}

export function Leaderboard({ entries, currentDonorId }: LeaderboardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        🏅 Top Donors
      </h2>

      <div className="space-y-3">
        {entries.map((entry, index) => (
          <div
            key={entry.donorId}
            className={`
              flex items-center gap-4 p-3 rounded-xl transition-all
              ${entry.donorId == currentDonorId 
                ? 'bg-red-50 ring-2 ring-red-200' 
                : 'bg-gray-50 hover:bg-gray-100'
              }
            `}
          >
            {/* Rank */}
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center font-bold
              ${index === 0 ? 'bg-yellow-400 text-yellow-900' :
                index === 1 ? 'bg-gray-300 text-gray-700' :
                index === 2 ? 'bg-orange-400 text-orange-900' :
                'bg-gray-200 text-gray-600'}
            `}>
              {entry.rank}
            </div>

            {/* Donor Info */}
            <div className="flex-1">
              <div className="font-semibold text-gray-800">{entry.donorName}</div>
              <div className="text-xs text-gray-500">
                {entry.bloodType} • {entry.barangay}
              </div>
            </div>

            {/* Stats */}
            <div className="text-right">
              <div className="font-bold text-red-600">{entry.totalDonations} 🩸</div>
              <div className="text-xs text-gray-500">{entry.points} pts</div>
            </div>

            {/* Top Badge */}
            {entry.badges.length > 0 && (
              <span className="text-2xl">{entry.badges[0].icon}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
