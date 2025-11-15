import React from 'react';
import styles from '@/styles/admin.module.css';

type StatCardProps = {
  icon: React.ReactNode | string;
  value: number | string;
  label: string;
};

export default function StatCard({ icon, value, label }: StatCardProps) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statIcon}>{icon}</div>
      <div className={styles.statContent}>
        <div className={styles.statValue}>{value}</div>
        <div className={styles.statLabel}>{label}</div>
      </div>
    </div>
  );
}