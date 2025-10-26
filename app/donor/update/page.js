'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { updateDonor } from '../../../lib/api';
import { barangays } from '../../../lib/mockData';
import styles from '../../../styles/donor.module.css';

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
      <main className={styles.donorMain}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className={styles.pageHeader}>
            <h1>Update Profile</h1>
            <p className={styles.pageSubtitle}>
              Keep your information up to date to receive relevant blood donation alerts
            </p>
          </div>

          {success && (
            <div className={styles.successMessage}>
              ✅ Profile updated successfully!
            </div>
          )}

          {/* Non-editable Information */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Account Information (Read-only)</h2>
            <div className={styles.infoCard}>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Full Name</span>
                  <span className={styles.infoValue}>{donor.name}</span>
                </div>

                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Email Address</span>
                  <span className={styles.infoValue}>{donor.email}</span>
                </div>

                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Blood Type</span>
                  <span className={styles.infoValue}>
                    <span className={styles.bloodTypeBadge}>{donor.bloodType}</span>
                  </span>
                </div>
              </div>
              <p className={styles.infoNote}>
                To change these details, please contact the City Health Office.
              </p>
            </div>
          </div>

          {/* Editable Form */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Update Your Information</h2>
            <form className={styles.updateForm} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="contact" className={styles.formLabel}>
                  Contact Number <span className={styles.required}>*</span>
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

              <div className={styles.formGroup}>
                <label htmlFor="barangay" className={styles.formLabel}>
                  Barangay <span className={styles.required}>*</span>
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

              <div className={styles.formGroup}>
                <label htmlFor="address" className={styles.formLabel}>
                  Complete Address <span className={styles.required}>*</span>
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
                  Update this after each donation to track your eligibility
                </p>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="emailAlerts"
                    checked={formData.emailAlerts}
                    onChange={handleChange}
                  />
                  <span>
                    <strong>Enable email alerts for emergency blood requests</strong>
                    <br />
                    <small>You will receive notifications when your blood type is needed</small>
                  </span>
                </label>
              </div>

              <div className={styles.formActions}>
                <button 
                  type="button" 
                  className={styles.btnSecondary}
                  onClick={() => router.push('/donor/profile')}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={styles.btnPrimary}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>

          {/* Important Notes */}
          <div className={styles.section}>
            <div className={styles.notesCard}>
              <h3>📌 Important Notes</h3>
              <ul className={styles.notesList}>
                <li>Keep your contact information current to ensure you receive emergency alerts</li>
                <li>Update your last donation date after each blood donation</li>
                <li>You can opt out of email alerts at any time</li>
                <li>Your information is protected under the Data Privacy Act</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
