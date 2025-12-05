import React from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import styles from '@/styles/admin.module.css';

interface AdminTemplateProps {
  children: React.ReactNode;
  title: string;
}

const AdminTemplate: React.FC<AdminTemplateProps> = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar role="admin" />
      <div className="flex flex-1 pt-20">
        <Sidebar role="admin" />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto h-[calc(100vh-5rem)]">
          <div className="max-w-7xl mx-auto">
            <header className="mb-6 md:mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h1>
            </header>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminTemplate;
