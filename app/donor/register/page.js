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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-5 mb-5 border border-red-100">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-3xl">🩸</span>
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent hover:from-red-700 hover:to-red-600 transition-all">
              BloodConnect Olongapo
            </Link>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Donor Registration</h2>
            <p className="text-sm text-gray-600">Join our community of life-saving blood donors</p>
          </div>
        </div>

        {authError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {authError}</span>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 mb-4 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="border-l-4 border-red-500 pl-4">
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span>👤</span> Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
                    Full Name <span className="text-red-600">*</span>
                  </label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-sm" placeholder="Juan Dela Cruz" />
                  {errors.name && <p className="mt-1 text-xs text-red-600">⚠️ {errors.name}</p>}
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                    Email Address <span className="text-red-600">*</span>
                  </label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-sm" placeholder="juan@example.com" />
                  {errors.email && <p className="mt-1 text-xs text-red-600">⚠️ {errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
                    Password <span className="text-red-600">*</span>
                  </label>
                  <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-sm" placeholder="Min. 6 characters" />
                  {errors.password && <p className="mt-1 text-xs text-red-600">⚠️ {errors.password}</p>}
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-1">
                    Confirm Password <span className="text-red-600">*</span>
                  </label>
                  <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-sm" placeholder="Re-enter password" />
                  {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">⚠️ {errors.confirmPassword}</p>}
                </div>
              </div>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span>🩺</span> Medical & Contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="bloodType" className="block text-sm font-semibold text-gray-700 mb-1">
                    Blood Type <span className="text-red-600">*</span>
                  </label>
                  <select id="bloodType" name="bloodType" value={formData.bloodType} onChange={handleChange} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-white text-sm">
                    <option value="">Select</option>
                    {bloodTypes.map(type => (<option key={type} value={type}>{type}</option>))}
                  </select>
                  {errors.bloodType && <p className="mt-1 text-xs text-red-600">⚠️ {errors.bloodType}</p>}
                </div>
                <div>
                  <label htmlFor="contact" className="block text-sm font-semibold text-gray-700 mb-1">
                    Contact Number <span className="text-red-600">*</span>
                  </label>
                  <input type="tel" id="contact" name="contact" value={formData.contact} onChange={handleChange} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-sm" placeholder="0917-123-4567" />
                  {errors.contact && <p className="mt-1 text-xs text-red-600">⚠️ {errors.contact}</p>}
                </div>
                <div>
                  <label htmlFor="lastDonation" className="block text-sm font-semibold text-gray-700 mb-1">
                    Last Donation (Optional)
                  </label>
                  <input type="date" id="lastDonation" name="lastDonation" value={formData.lastDonation} onChange={handleChange} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-sm" />
                </div>
              </div>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span>📍</span> Location
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="barangay" className="block text-sm font-semibold text-gray-700 mb-1">
                    Barangay <span className="text-red-600">*</span>
                  </label>
                  <select id="barangay" name="barangay" value={formData.barangay} onChange={handleChange} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-white text-sm">
                    <option value="">Select</option>
                    {barangays.map(brgy => (<option key={brgy} value={brgy}>{brgy}</option>))}
                  </select>
                  {errors.barangay && <p className="mt-1 text-xs text-red-600">⚠️ {errors.barangay}</p>}
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-1">
                    Complete Address <span className="text-red-600">*</span>
                  </label>
                  <textarea id="address" name="address" value={formData.address} onChange={handleChange} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none text-sm" rows="2" placeholder="House No., Street, Subdivision" />
                  {errors.address && <p className="mt-1 text-xs text-red-600">⚠️ {errors.address}</p>}
                </div>
              </div>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span>⚙️</span> Preferences & Consent
              </h3>
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:bg-gray-100 transition-colors">
                  <label className="flex items-start cursor-pointer">
                    <input type="checkbox" name="emailAlerts" checked={formData.emailAlerts} onChange={handleChange} className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 mt-0.5 cursor-pointer flex-shrink-0" />
                    <span className="ml-2 text-sm text-gray-700">I want to receive email alerts for emergency blood requests</span>
                  </label>
                </div>
                <div className="bg-red-50 rounded-lg p-3 border border-red-200 hover:bg-red-100 transition-colors">
                  <label className="flex items-start cursor-pointer">
                    <input type="checkbox" name="agreeToPrivacy" checked={formData.agreeToPrivacy} onChange={handleChange} className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 mt-0.5 cursor-pointer flex-shrink-0" />
                    <span className="ml-2 text-sm text-gray-700">I agree to the <a href="#" className="text-red-600 hover:text-red-700 font-semibold underline">Data Privacy Policy</a> and consent to the collection and use of my information <span className="text-red-600">*</span></span>
                  </label>
                  {errors.agreeToPrivacy && <p className="mt-2 ml-6 text-xs text-red-600">⚠️ {errors.agreeToPrivacy}</p>}
                </div>
              </div>
            </div>

            <div className="pt-3">
              <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white font-bold py-3 px-6 rounded-lg hover:from-red-700 hover:to-red-600 focus:outline-none focus:ring-4 focus:ring-red-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0">
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Registering...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2"><span>Register as Donor</span><span>🩸</span></span>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="text-center bg-white rounded-xl shadow-md p-5 border border-gray-100 hover:shadow-lg transition-shadow">
          <p className="text-gray-600 mb-2 text-sm">Already have an account?</p>
          <Link href="/donor/login" className="inline-block bg-gradient-to-r from-gray-700 to-gray-600 text-white font-semibold px-6 py-2.5 rounded-lg hover:from-gray-800 hover:to-gray-700 transition-all shadow-md hover:shadow-lg text-sm transform hover:-translate-y-0.5">Login here</Link>
        </div>
      </div>
    </div>
  );
}
