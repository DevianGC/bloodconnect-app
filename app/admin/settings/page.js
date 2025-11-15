'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { logout } from '@/lib/api';
import styles from '@/styles/admin.module.css';

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
    <>
      <Navbar role="admin" />
      <div className={styles.adminLayout}>
        <Sidebar role="admin" />
        <main className={styles.adminMain}>
          <div className={styles.adminHeader}>
            <h1>Settings</h1>
            <p className={styles.adminSubtitle}>Manage your admin account and preferences</p>
          </div>

          {/* Admin Profile */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Admin Profile</h2>
            <div className={styles.settingsCard}>
              <div className={styles.profileInfo}>
                <div className={styles.profileAvatar}>
                  <span className={styles.avatarIcon}>👤</span>
                </div>
                <div className={styles.profileDetails}>
                  <h3>{adminUser?.name || 'Admin User'}</h3>
                  <p className={styles.profileEmail}>{adminUser?.email || 'admin@bloodconnect.com'}</p>
                  <span className={styles.profileRole}>Administrator</span>
                </div>
              </div>
              <button 
                className={styles.btnSecondary}
                onClick={() => alert('Profile editing will be implemented with backend')}
              >
                Edit Profile
              </button>
            </div>
          </div>

          {/* Account Settings */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Account Settings</h2>
            <div className={styles.settingsList}>
              <div className={styles.settingItem}>
                <div className={styles.settingInfo}>
                  <h4>Change Password</h4>
                  <p>Update your password to keep your account secure</p>
                </div>
                <button 
                  className={styles.btnSecondary}
                  onClick={() => alert('Password change will be implemented with backend')}
                >
                  Change
                </button>
              </div>

              <div className={styles.settingItem}>
                <div className={styles.settingInfo}>
                  <h4>Email Notifications</h4>
                  <p>Receive notifications about new blood requests and system updates</p>
                </div>
                <label className={styles.switch}>
                  <input type="checkbox" defaultChecked />
                  <span className={styles.slider}></span>
                </label>
              </div>

              <div className={styles.settingItem}>
                <div className={styles.settingInfo}>
                  <h4>Two-Factor Authentication</h4>
                  <p>Add an extra layer of security to your account</p>
                </div>
                <button 
                  className={styles.btnSecondary}
                  onClick={() => alert('2FA will be implemented with backend')}
                >
                  Enable
                </button>
              </div>
            </div>
          </div>

          {/* System Settings */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>System Settings</h2>
            <div className={styles.settingsList}>
              <div className={styles.settingItem}>
                <div className={styles.settingInfo}>
                  <h4>Auto-Match Donors</h4>
                  <p>Automatically match donors when creating blood requests</p>
                </div>
                <label className={styles.switch}>
                  <input type="checkbox" defaultChecked />
                  <span className={styles.slider}></span>
                </label>
              </div>

              <div className={styles.settingItem}>
                <div className={styles.settingInfo}>
                  <h4>Email Alert Templates</h4>
                  <p>Customize email templates sent to donors</p>
                </div>
                <button 
                  className={styles.btnSecondary}
                  onClick={() => alert('Template editor will be implemented with backend')}
                >
                  Edit Templates
                </button>
              </div>

              <div className={styles.settingItem}>
                <div className={styles.settingInfo}>
                  <h4>Data Backup</h4>
                  <p>Download a backup of all system data</p>
                </div>
                <button 
                  className={styles.btnSecondary}
                  onClick={() => alert('Backup functionality will be implemented with backend')}
                >
                  Download Backup
                </button>
              </div>
            </div>
          </div>

          {/* Privacy & Data */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Privacy & Data Protection</h2>
            <div className={styles.privacyCard}>
              <h4>Data Privacy Compliance</h4>
              <p>
                BloodConnect Olongapo is compliant with the Data Privacy Act of 2012 (Republic Act No. 10173).
                All donor information is encrypted and stored securely. Data is only used for emergency blood
                donation coordination and is never shared with third parties.
              </p>
              <div className={styles.privacyLinks}>
                <a href="#" className={styles.privacyLink}>View Privacy Policy</a>
                <a href="#" className={styles.privacyLink}>View Terms of Service</a>
                <a href="#" className={styles.privacyLink}>Data Protection Guidelines</a>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Danger Zone</h2>
            <div className={styles.dangerCard}>
              <div className={styles.dangerItem}>
                <div className={styles.dangerInfo}>
                  <h4>Logout</h4>
                  <p>Sign out of your admin account</p>
                </div>
                <button className={styles.btnDanger} onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
