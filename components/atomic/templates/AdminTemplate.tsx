import React from 'react';
import Navbar from '@/components/Navbar';
import styles from '@/styles/admin.module.css';

interface AdminTemplateProps {
  children: React.ReactNode;
  title: string;
}

const AdminTemplate: React.FC<AdminTemplateProps> = ({ children, title }) => {
  return (
    <div className={styles.adminLayout}>
      <Navbar />
      <main className={styles.mainContent}>
        <header className={styles.pageHeader}>
          <h1>{title}</h1>
        </header>
        {children}
      </main>
    </div>
  );
};

export default AdminTemplate;
