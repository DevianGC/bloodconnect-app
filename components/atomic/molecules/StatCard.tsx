import React from 'react';
import styles from '@/styles/admin.module.css';

type StatCardProps = {
  icon: React.ReactNode | string;
  value: number | string;
  label?: string;
  title?: string;
  trend?: string;
  trendUp?: boolean;
};

export default function StatCard({ icon, value, label, title, trend, trendUp }: StatCardProps) {
  const displayLabel = label || title;

  return (
    <div className={styles.statCard}>
      <div className={`${styles.statIcon} ${typeof icon === 'string' ? 'text-2xl' : ''}`}>
        {icon}
      </div>
      <div className={styles.statInfo}>
        <h3>{value}</h3>
        <p>{displayLabel}</p>
        {trend && (
          <div className={`text-xs mt-1 font-medium ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
            {trend}
          </div>
        )}
      </div>
    </div>
  );
}