'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { donorRegister } from '../../../lib/api';
import { bloodTypes, barangays } from '../../../lib/mockData';
import styles from '../../../styles/auth.module.css';

export default function DonorRegister() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    bloodType: '',
    contact: '',
    address: '',
    barangay: '',
    lastDonation: '',
    emailAlerts: true,
    agreeToPrivacy: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.bloodType) newErrors.bloodType = 'Blood type is required';
    if (!formData.contact.trim()) newErrors.contact = 'Contact number is required';
    if (!formData.barangay) newErrors.barangay = 'Barangay is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.agreeToPrivacy) {
      newErrors.agreeToPrivacy = 'You must agree to the privacy policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    setLoading(true);
    try {
      const { confirmPassword, agreeToPrivacy, ...donorData } = formData;
      const result = await donorRegister(donorData);

      if (result.success) {
        alert(result.message);
        router.push('/donor/login');
      } else {
        alert(result.error || 'Registration failed');
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard} style={{ maxWidth: '600px' }}>
        <div className={styles.authHeader}>
          <Link href="/" className={styles.authLogo}>
            <span className={styles.authLogoIcon}>🩸</span>
            <span>BloodConnect Olongapo</span>
          </Link>
          <h2 className={styles.authTitle}>Donor Registration</h2>
          <p className={styles.authSubtitle}>
            Join our community of life-saving blood donors
          </p>
        </div>

        <form className={styles.authForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.formLabel}>
              Full Name <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={styles.formInput}
              placeholder="Juan Dela Cruz"
            />
            {errors.name && <span className={styles.formError}>{errors.name}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.formLabel}>
              Email Address <span className={styles.required}>*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.formInput}
              placeholder="juan@example.com"
            />
            {errors.email && <span className={styles.formError}>{errors.email}</span>}
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.formLabel}>
                Password <span className={styles.required}>*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={styles.formInput}
                placeholder="Min. 6 characters"
              />
              {errors.password && <span className={styles.formError}>{errors.password}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword" className={styles.formLabel}>
                Confirm Password <span className={styles.required}>*</span>
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={styles.formInput}
                placeholder="Re-enter password"
              />
              {errors.confirmPassword && <span className={styles.formError}>{errors.confirmPassword}</span>}
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="bloodType" className={styles.formLabel}>
                Blood Type <span className={styles.required}>*</span>
              </label>
              <select
                id="bloodType"
                name="bloodType"
                value={formData.bloodType}
                onChange={handleChange}
                className={styles.formSelect}
              >
                <option value="">Select Blood Type</option>
                {bloodTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.bloodType && <span className={styles.formError}>{errors.bloodType}</span>}
            </div>

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
              />
              {errors.contact && <span className={styles.formError}>{errors.contact}</span>}
            </div>
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
            >
              <option value="">Select Barangay</option>
              {barangays.map(brgy => (
                <option key={brgy} value={brgy}>{brgy}</option>
              ))}
            </select>
            {errors.barangay && <span className={styles.formError}>{errors.barangay}</span>}
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
              rows="2"
              placeholder="House No., Street, Subdivision"
            />
            {errors.address && <span className={styles.formError}>{errors.address}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="lastDonation" className={styles.formLabel}>
              Last Donation Date (if applicable)
            </label>
            <input
              type="date"
              id="lastDonation"
              name="lastDonation"
              value={formData.lastDonation}
              onChange={handleChange}
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="emailAlerts"
                checked={formData.emailAlerts}
                onChange={handleChange}
              />
              <span>I want to receive email alerts for emergency blood requests</span>
            </label>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="agreeToPrivacy"
                checked={formData.agreeToPrivacy}
                onChange={handleChange}
              />
              <span>
                I agree to the <a href="#" className={styles.privacyLink}>Data Privacy Policy</a> and 
                consent to the collection and use of my information for blood donation coordination <span className={styles.required}>*</span>
              </span>
            </label>
            {errors.agreeToPrivacy && <span className={styles.formError}>{errors.agreeToPrivacy}</span>}
          </div>

          <button 
            type="submit" 
            className={styles.btnPrimary}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register as Donor'}
          </button>
        </form>

        <div className={styles.authFooter}>
          <p>Already have an account?</p>
          <Link href="/donor/login" className={styles.authLink}>
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}
