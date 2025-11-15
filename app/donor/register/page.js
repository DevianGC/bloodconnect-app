'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useAuthRequest from '../../hooks/useAuthRequest';
import { bloodTypes, barangays } from '../../../lib/mockData';

export default function DonorRegister() {
  const router = useRouter();
  const { register, isLoading, error: authError } = useAuthRequest();
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
  // Set both password fields to show text by default
  const [showPassword, setShowPassword] = useState({
    password: true,
    confirmPassword: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Special handling for contact number
    if (name === 'contact') {
      // Only allow numbers and limit to 11 digits
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const { confirmPassword, agreeToPrivacy, ...donorData } = formData;
      const result = await register(donorData);
      if (result.success) {
        alert(result.message);
        router.push('/donor/login');
      } else {
        alert(result.error || 'Registration failed');
      }
    } catch (error) {
      // The error is already handled by the useAuthRequest hook
      // and will be available in the `authError` variable.
      // We can add additional logging or UI updates here if needed.
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <span className="text-4xl">🩸</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
              BloodConnect Olongapo
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Become a Blood Donor</h1>
          <p className="text-gray-600">Join our community of life-saving heroes</p>
        </div>

        {authError && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-lg" role="alert">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-medium">Error</p>
                <p className="text-sm">{authError}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="p-1 bg-gradient-to-r from-red-500 to-red-600"></div>
          
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                    <span className="text-red-600">👤</span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Full name"
                        className={`w-full px-4 py-3 border ${errors.name ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all placeholder-gray-400`}
                      />
                      {errors.name && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email address"
                        className={`w-full px-4 py-3 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all placeholder-gray-400`}
                      />
                      {errors.email && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="relative">
                        <input
                          type={showPassword.password ? "text" : "password"}
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 ${errors.password ? 'border-red-300 pr-10' : 'border-gray-300 pr-10'} border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all placeholder-gray-400`}
                          placeholder="Create a password"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setShowPassword(prev => ({ ...prev, password: !prev.password }));
                          }}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                          aria-label={showPassword.password ? "Hide password" : "Show password"}
                        >
                          {showPassword.password ? (
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                          ) : (
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                        {errors.password && (
                          <div className="absolute inset-y-0 right-8 pr-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                    <p className="mt-1 text-xs text-gray-500">Minimum 6 characters</p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="relative">
                        <input
                          type={showPassword.confirmPassword ? "text" : "password"}
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 ${errors.confirmPassword ? 'border-red-300 pr-10' : 'border-gray-300 pr-10'} border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all placeholder-gray-400`}
                          placeholder="Confirm your password"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setShowPassword(prev => ({ ...prev, confirmPassword: !prev.confirmPassword }));
                          }}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                          aria-label={showPassword.confirmPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword.confirmPassword ? (
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                          ) : (
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                        {errors.confirmPassword && (
                          <div className="absolute inset-y-0 right-8 pr-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Medical & Contact */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600">💉</span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Medical & Contact</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700">
                      Blood Type <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="bloodType"
                        name="bloodType"
                        value={formData.bloodType}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border ${errors.bloodType ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-white appearance-none`}
                      >
                        <option value="">Select blood type</option>
                        {bloodTypes.map(type => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    {errors.bloodType && <p className="mt-1 text-sm text-red-600">{errors.bloodType}</p>}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
                      Contact Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        id="contact"
                        name="contact"
                        value={formData.contact}
                        onChange={handleChange}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={11}
                        className={`w-full px-4 py-3 border ${errors.contact ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all placeholder-gray-400`}
                        placeholder="Contact number"
                      />
                      {errors.contact && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    {errors.contact && <p className="mt-1 text-sm text-red-600">{errors.contact}</p>}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="lastDonation" className="block text-sm font-medium text-gray-700">
                      Last Donation (Optional)
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        id="lastDonation"
                        name="lastDonation"
                        value={formData.lastDonation}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-600">📍</span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Location</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="barangay" className="block text-sm font-medium text-gray-700">
                      Barangay <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="barangay"
                        name="barangay"
                        value={formData.barangay}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border ${errors.barangay ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-white appearance-none`}
                      >
                        <option value="">Select barangay</option>
                        {barangays.map(brgy => (
                          <option key={brgy} value={brgy}>
                            {brgy}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    {errors.barangay && <p className="mt-1 text-sm text-red-600">{errors.barangay}</p>}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Complete Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border ${errors.address ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none`}
                        rows="2"
                        placeholder="House No., Street, Subdivision"
                      />
                      {errors.address && (
                        <div className="absolute top-3 right-0 pr-3 flex items-start pointer-events-none">
                          <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                  </div>
                </div>
              </div>

              {/* Preferences & Consent */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-purple-600">⚙️</span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Preferences & Consent</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <div className="flex items-center h-5">
                        <input
                          type="checkbox"
                          name="emailAlerts"
                          checked={formData.emailAlerts}
                          onChange={handleChange}
                          className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                        />
                      </div>
                      <div className="text-sm text-gray-700">
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-gray-500 mt-0.5">Receive important updates and emergency blood requests via email</p>
                      </div>
                    </label>
                  </div>

                  <div className={`p-4 rounded-xl border ${errors.agreeToPrivacy ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'} hover:border-gray-300 transition-colors`}>
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <div className="flex items-center h-5">
                        <input
                          type="checkbox"
                          name="agreeToPrivacy"
                          checked={formData.agreeToPrivacy}
                          onChange={handleChange}
                          className={`h-4 w-4 ${errors.agreeToPrivacy ? 'text-red-600' : 'text-red-600'} border-gray-300 rounded focus:ring-red-500`}
                        />
                      </div>
                      <div className="text-sm">
                        <p className={`font-medium ${errors.agreeToPrivacy ? 'text-red-700' : 'text-gray-700'}`}>
                          I agree to the <a href="#" className="text-red-600 hover:text-red-700 font-semibold underline">Data Privacy Policy</a> <span className="text-red-500">*</span>
                        </p>
                        <p className={`mt-0.5 ${errors.agreeToPrivacy ? 'text-red-600' : 'text-gray-500'}`}>
                          I consent to the collection and use of my personal information for blood donation purposes
                        </p>
                        {errors.agreeToPrivacy && (
                          <p className="mt-2 text-sm text-red-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.agreeToPrivacy}
                          </p>
                        )}
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2 text-white">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Creating your account...</span>
                    </div>
                  ) : (
                    <span>Become a Donor</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600">Already have an account?{' '}
            <Link href="/donor/login" className="font-medium text-red-600 hover:text-red-700 hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

