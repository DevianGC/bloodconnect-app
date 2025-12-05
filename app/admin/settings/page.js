'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminTemplate from '@/components/atomic/templates/AdminTemplate';
import Button from '@/components/atomic/atoms/Button';
import { logout } from '@/lib/api';

export default function AdminSettings() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('adminUser');
    if (!user) {
      router.push('/admin/login');
      return;
    }
    setAdminUser(JSON.parse(user));
  }, []);

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await logout();
      localStorage.removeItem('adminUser');
      router.push('/');
    }
  };

  return (
    <AdminTemplate title="Settings">
      <div className="space-y-8 max-w-4xl">
        {/* Admin Profile */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Admin Profile</h2>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center text-2xl">
                👤
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{adminUser?.name || 'Admin User'}</h3>
                <p className="text-gray-500">{adminUser?.email || 'admin@bloodconnect.com'}</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
                  Administrator
                </span>
              </div>
            </div>
            <Button 
              variant="secondary"
              onClick={() => alert('Profile editing will be implemented with backend')}
            >
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Account Settings</h2>
          <div className="space-y-6 divide-y divide-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 first:pt-0">
              <div>
                <h4 className="text-base font-medium text-gray-900">Change Password</h4>
                <p className="text-sm text-gray-500 mt-1">Update your password to keep your account secure</p>
              </div>
              <Button 
                variant="secondary"
                onClick={() => alert('Password change will be implemented with backend')}
              >
                Change
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6">
              <div>
                <h4 className="text-base font-medium text-gray-900">Email Notifications</h4>
                <p className="text-sm text-gray-500 mt-1">Receive notifications about new blood requests and system updates</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6">
              <div>
                <h4 className="text-base font-medium text-gray-900">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-500 mt-1">Add an extra layer of security to your account</p>
              </div>
              <Button 
                variant="secondary"
                onClick={() => alert('2FA will be implemented with backend')}
              >
                Enable
              </Button>
            </div>
          </div>
        </div>

        {/* System Settings */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">System Settings</h2>
          <div className="space-y-6 divide-y divide-gray-100">
            <div className="flex items-center justify-between pt-4 first:pt-0">
              <div>
                <h4 className="text-base font-medium text-gray-900">Auto-Match Donors</h4>
                <p className="text-sm text-gray-500 mt-1">Automatically match donors when creating blood requests</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between pt-6">
              <div>
                <h4 className="text-base font-medium text-gray-900">Email Alert Templates</h4>
                <p className="text-sm text-gray-500 mt-1">Customize email templates sent to donors</p>
              </div>
              <Button 
                variant="secondary"
                onClick={() => alert('Template editor will be implemented with backend')}
              >
                Edit Templates
              </Button>
            </div>

            <div className="flex items-center justify-between pt-6">
              <div>
                <h4 className="text-base font-medium text-gray-900">Data Backup</h4>
                <p className="text-sm text-gray-500 mt-1">Download a backup of all system data</p>
              </div>
              <Button 
                variant="secondary"
                onClick={() => alert('Backup functionality will be implemented with backend')}
              >
                Download Backup
              </Button>
            </div>
          </div>
        </div>

        {/* Privacy & Data */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Privacy & Data Protection</h2>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h4 className="text-base font-medium text-blue-900 mb-2">Data Privacy Compliance</h4>
            <p className="text-sm text-blue-800 mb-4">
              BloodConnect Olongapo is compliant with the Data Privacy Act of 2012 (Republic Act No. 10173).
              All donor information is encrypted and stored securely. Data is only used for emergency blood
              donation coordination and is never shared with third parties.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline">View Privacy Policy</a>
              <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline">View Terms of Service</a>
              <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline">Data Protection Guidelines</a>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 p-6 rounded-xl border border-red-100">
          <h2 className="text-lg font-semibold text-red-800 mb-4">Danger Zone</h2>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-medium text-red-900">Logout</h4>
              <p className="text-sm text-red-700 mt-1">Sign out of your admin account</p>
            </div>
            <Button 
              variant="danger"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </AdminTemplate>
  );
}
