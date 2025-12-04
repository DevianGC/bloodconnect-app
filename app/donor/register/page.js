'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useAuthRequest from '../../hooks/useAuthRequest';
import { bloodTypes, barangays } from '../../../lib/mockData';
import styles from '../../../styles/auth.module.css';

export default function DonorRegister() {
  const router = useRouter();
  const { register, isLoading, error: authError } = useAuthRequest();
  const [step, setStep] = useState(1);
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
  const [showPassword, setShowPassword] = useState({
    password: true,
    confirmPassword: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'contact') {
      const numericValue = value.replace(/\D/g, '').slice(0, 11);
      setFormData(prev => ({
        ...prev,
        [name]: numericValue,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.bloodType) newErrors.bloodType = 'Blood type is required';
    if (!formData.contact.trim()) {
      newErrors.contact = 'Contact number is required';
    } else if (formData.contact.length !== 11) {
      newErrors.contact = 'Contact number must be 11 digits';
    } else if (!/^[0-9]+$/.test(formData.contact)) {
      newErrors.contact = 'Only numbers are allowed';
    }
    if (!formData.barangay) newErrors.barangay = 'Barangay is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.agreeToPrivacy) {
      newErrors.agreeToPrivacy = 'You must agree to the privacy policy';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
      setErrors({});
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    setStep(1);
    setErrors({});
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;

    try {
      const { confirmPassword, agreeToPrivacy, ...donorData } = formData;
      const result = await register(donorData);
      if (result.success) {
        alert('Registration successful! Please check your email to verify your account before logging in.');
        router.push('/donor/login');
      } else {
        alert(result.error || 'Registration failed');
      }
    } catch (error) {
      // Error handled by hook
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard} style={{ maxWidth: '500px', width: '95%', padding: '2rem' }}>
        <div className={styles.authHeader} style={{ marginBottom: '1.5rem' }}>
          <Link href="/" className={styles.authLogo} style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>
            <span className={styles.authLogoIcon} style={{ fontSize: '1.5rem' }}>🩸</span>
            <span>BloodConnect</span>
          </Link>
          <h2 className={styles.authTitle} style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Become a Donor</h2>
          <p className={styles.authSubtitle} style={{ fontSize: '0.9rem' }}>
            {step === 1 ? 'Step 1: Personal Information' : 'Step 2: Medical & Contact Details'}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-2 mb-5">
          <div className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${step >= 1 ? 'bg-red-600' : 'bg-gray-200'}`}></div>
          <div className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${step >= 2 ? 'bg-red-600' : 'bg-gray-200'}`}></div>
        </div>

        <form className={styles.authForm} onSubmit={handleSubmit}>
          {(authError) && (
            <div className={styles.authError}>
              {authError}
            </div>
          )}

          <div style={{ minHeight: '365px', display: 'flex', flexDirection: 'column' }}>
            {step === 1 && (
              <div className="space-y-3 animate-fadeIn flex-1 flex flex-col">
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.formLabel}>
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full name"
                    className={`${styles.formInput} ${errors.name ? 'border-red-500' : ''}`}
                  />
                  {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.formLabel}>
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email address"
                    className={`${styles.formInput} ${errors.email ? 'border-red-500' : ''}`}
                  />
                  {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className={styles.formGroup}>
                    <label htmlFor="password" className={styles.formLabel}>
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.password ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`${styles.formInput} ${errors.password ? 'border-red-500' : ''}`}
                        placeholder="Password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(prev => ({ ...prev, password: !prev.password }))}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        {showPassword.password ? "Hide" : "Show"}
                      </button>
                    </div>
                    {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="confirmPassword" className={styles.formLabel}>
                      Confirm <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.confirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`${styles.formInput} ${errors.confirmPassword ? 'border-red-500' : ''}`}
                        placeholder="Confirm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(prev => ({ ...prev, confirmPassword: !prev.confirmPassword }))}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        {showPassword.confirmPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword}</p>}
                  </div>
                </div>

                <div className="flex-1"></div>

                <button 
                  type="button" 
                  onClick={handleNext}
                  className={styles.btnPrimary}
                >
                  Next Step →
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3 animate-fadeIn flex-1 flex flex-col">
              <div className="grid grid-cols-2 gap-3">
                <div className={styles.formGroup}>
                  <label htmlFor="bloodType" className={styles.formLabel}>
                    Blood Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="bloodType"
                    name="bloodType"
                    value={formData.bloodType}
                    onChange={handleChange}
                    className={`${styles.formInput} ${errors.bloodType ? 'border-red-500' : ''}`}
                  >
                    <option value="">Select</option>
                    {bloodTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.bloodType && <p className="text-sm text-red-600">{errors.bloodType}</p>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="contact" className={styles.formLabel}>
                    Contact <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="contact"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    maxLength={11}
                    placeholder="09xxxxxxxxx"
                    className={`${styles.formInput} ${errors.contact ? 'border-red-500' : ''}`}
                  />
                  {errors.contact && <p className="text-sm text-red-600">{errors.contact}</p>}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className={`${styles.formGroup} col-span-1`}>
                  <label htmlFor="barangay" className={styles.formLabel}>
                    Barangay <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="barangay"
                    name="barangay"
                    value={formData.barangay}
                    onChange={handleChange}
                    className={`${styles.formInput} ${errors.barangay ? 'border-red-500' : ''}`}
                    style={{ paddingRight: '0.5rem' }}
                  >
                    <option value="">Brgy</option>
                    {barangays.map(brgy => (
                      <option key={brgy} value={brgy}>{brgy}</option>
                    ))}
                  </select>
                  {errors.barangay && <p className="text-sm text-red-600">{errors.barangay}</p>}
                </div>

                <div className={`${styles.formGroup} col-span-2`}>
                  <label htmlFor="address" className={styles.formLabel}>
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`${styles.formInput} ${errors.address ? 'border-red-500' : ''}`}
                    placeholder="House No., Street"
                  />
                  {errors.address && <p className="text-sm text-red-600">{errors.address}</p>}
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-gray-100">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="emailAlerts"
                    checked={formData.emailAlerts}
                    onChange={handleChange}
                    className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 font-medium">Receive email notifications</span>
                </label>

                <div>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="agreeToPrivacy"
                      checked={formData.agreeToPrivacy}
                      onChange={handleChange}
                      className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500 cursor-pointer"
                    />
                    <span className={`text-sm font-medium ${errors.agreeToPrivacy ? 'text-red-600' : 'text-gray-700'}`}>
                      I agree to the Data Privacy Policy <span className="text-red-500">*</span>
                    </span>
                  </label>
                  {errors.agreeToPrivacy && <p className="text-xs text-red-600 ml-7 mt-1">{errors.agreeToPrivacy}</p>}
                </div>
              </div>

              <div className="flex-1"></div>

              <div className="flex gap-3 pt-1">
                <button 
                  type="button" 
                  onClick={handleBack}
                  className="flex-1 px-4 py-2.5 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  ← Back
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold py-2.5 px-4 rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </div>
          )}
          </div>
        </form>

        <div className={styles.authFooter}>
          <p>Already have an account?</p>
          <Link href="/donor/login" className={styles.authLink}>
            Sign in here →
          </Link>
          <div style={{ marginTop: '1rem' }}>
            <Link href="/" className={styles.authLink}>
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

