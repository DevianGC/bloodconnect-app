'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { updateDonor } from '@/lib/api';
import { barangays } from '@/lib/mockData';
import styles from '@/styles/donor.module.css';

export default function DonorUpdate() {
  const router = useRouter();
  const [donor, setDonor] = useState(null);
  const [formData, setFormData] = useState({
    contact: '',
    address: '',
    barangay: '',
    lastDonation: '',
    emailAlerts: true,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const donorUser = localStorage.getItem('donorUser');
    if (!donorUser) {
      router.push('/donor/login');
      return;
    }

    const donorData = JSON.parse(donorUser);
    setDonor(donorData);
    setFormData({
      contact: donorData.contact || '',
      address: donorData.address || '',
      barangay: donorData.barangay || '',
      lastDonation: donorData.lastDonation || '',
      emailAlerts: donorData.emailAlerts !== undefined ? donorData.emailAlerts : true,
    });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const result = await updateDonor(donor.id, formData);
      
      if (result.success) {
        // Update localStorage
        const updatedDonor = { ...donor, ...formData };
        localStorage.setItem('donorUser', JSON.stringify(updatedDonor));
        setDonor(updatedDonor);
        setSuccess(true);
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile: ' + result.error);
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!donor) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar role="donor" />
      <main className={styles.updateMain}>
        <div className="container">
          {/* Page Header */}
          <div className={styles.updateHeader}>
            <h1>Update Profile</h1>
            <p>Keep your information current to receive relevant alerts</p>
          </div>

          {success && (
            <div className={styles.successMessage}>
              ✓ Profile updated successfully!
            </div>
          )}

          {/* Read-only Account Info */}
          <div className={styles.infoSection}>
            <h2>Account Information</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.label}>Name</span>
                <span className={styles.value}>{donor.name}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Email</span>
                <span className={styles.value}>{donor.email}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Blood Type</span>
                <span className={styles.value}>{donor.bloodType}</span>
              </div>
            </div>
            <p className={styles.note}>
              Contact City Health Office to change these details
            </p>
          </div>

          {/* Update Form */}
          <div className={styles.formSection}>
            <h2>Update Information</h2>
            <form className={styles.updateForm} onSubmit={handleSubmit}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="contact" className={styles.formLabel}>
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    id="contact"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    className={styles.formInput}
                    placeholder="0917-123-4567"
                    required
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="barangay" className={styles.formLabel}>
                    Barangay *
                  </label>
                  <select
                    id="barangay"
                    name="barangay"
                    value={formData.barangay}
                    onChange={handleChange}
                    className={styles.formSelect}
                    required
                  >
                    <option value="">Select Barangay</option>
                    {barangays.map(brgy => (
                      <option key={brgy} value={brgy}>{brgy}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="address" className={styles.formLabel}>
                    Complete Address *
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={styles.formTextarea}
                    rows="3"
                    placeholder="House No., Street, Subdivision"
                    required
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="lastDonation" className={styles.formLabel}>
                    Last Donation Date
                  </label>
                  <input
                    type="date"
                    id="lastDonation"
                    name="lastDonation"
                    value={formData.lastDonation}
                    onChange={handleChange}
                    className={styles.formInput}
                  />
                  <p className={styles.formHint}>
                    Update after each donation to track eligibility
                  </p>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="emailAlerts"
                      checked={formData.emailAlerts}
                      onChange={handleChange}
                    />
                    <span className={styles.checkboxText}>
                      Enable email alerts for emergency requests
                    </span>
                  </label>
                </div>
              </div>

              <div className={styles.formActions}>
                <button 
                  type="button" 
                  className={styles.actionButton}
                  onClick={() => router.push('/donor/profile')}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={`${styles.actionButton} ${styles.primaryButton}`}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
