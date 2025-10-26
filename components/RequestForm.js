'use client';

import { useState } from 'react';
import { bloodTypes, hospitals } from '../../lib/mockData';

export default function RequestForm({ onSubmit, initialData = null }) {
  const [formData, setFormData] = useState(initialData || {
    hospitalName: '',
    bloodType: '',
    quantity: 1,
    urgency: 'normal',
    notes: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.hospitalName) {
      newErrors.hospitalName = 'Hospital name is required';
    }
    if (!formData.bloodType) {
      newErrors.bloodType = 'Blood type is required';
    }
    if (!formData.quantity || formData.quantity < 1) {
      newErrors.quantity = 'Quantity must be at least 1';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <label htmlFor="hospitalName" className="text-sm font-medium text-gray-700">
          Hospital Name <span className="text-red-500">*</span>
        </label>
        <select
          id="hospitalName"
          name="hospitalName"
          value={formData.hospitalName}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
            errors.hospitalName ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select Hospital</option>
          {hospitals.map(hospital => (
            <option key={hospital} value={hospital}>{hospital}</option>
          ))}
        </select>
        {errors.hospitalName && (
          <span className="text-sm text-red-600">{errors.hospitalName}</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="bloodType" className="text-sm font-medium text-gray-700">
          Blood Type <span className="text-red-500">*</span>
        </label>
        <select
          id="bloodType"
          name="bloodType"
          value={formData.bloodType}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
            errors.bloodType ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select Blood Type</option>
          {bloodTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        {errors.bloodType && (
          <span className="text-sm text-red-600">{errors.bloodType}</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
          Quantity (units) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          id="quantity"
          name="quantity"
          min="1"
          value={formData.quantity}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
            errors.quantity ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.quantity && (
          <span className="text-sm text-red-600">{errors.quantity}</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="urgency" className="text-sm font-medium text-gray-700">
          Urgency Level
        </label>
        <select
          id="urgency"
          name="urgency"
          value={formData.urgency}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
        >
          <option value="normal">Normal</option>
          <option value="urgent">Urgent</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="notes" className="text-sm font-medium text-gray-700">
          Additional Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          rows="4"
          placeholder="Enter any additional information..."
        />
      </div>

      <button 
        type="submit" 
        className="inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        {initialData ? 'Update Request' : 'Create Request'}
      </button>
    </form>
  );
}
