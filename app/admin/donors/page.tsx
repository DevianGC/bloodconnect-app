'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminTemplate from '@/components/atomic/templates/AdminTemplate';
import DonorList from '@/components/atomic/organisms/DonorList';
import FormField from '@/components/atomic/molecules/FormField';
import Button from '@/components/atomic/atoms/Button';
import Modal from '@/components/Modal';
import { getDonors, createDonor, updateDonor, deleteDonor } from '@/lib/api';
import { bloodTypes, barangays } from '@/lib/mockData';
import type { Donor, DonorCreateInput, DonorFilters } from '@/types/api';
import styles from '@/styles/admin.module.css';

export default function AdminDonors() {
  const router = useRouter();
  const [donors, setDonors] = useState<Donor[]>([]);
  const [filteredDonors, setFilteredDonors] = useState<Donor[]>([]);
  const [filters, setFilters] = useState<DonorFilters>({
    bloodType: '',
    barangay: '',
    search: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentDonor, setCurrentDonor] = useState<Donor | null>(null);
  const [loading, setLoading] = useState(true);

  const emptyDonorForm: DonorCreateInput = {
    name: '',
    email: '',
    bloodType: '',
    contact: '',
    address: '',
    barangay: '',
    lastDonation: '',
    emailAlerts: false,
  };

  const [formData, setFormData] = useState<DonorCreateInput>(emptyDonorForm);

  useEffect(() => {
    const adminUser = localStorage.getItem('adminUser');
    if (!adminUser) {
      router.push('/admin/login');
      return;
    }
    loadDonors();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [donors, filters]);

  const loadDonors = async () => {
    try {
      const result = await getDonors();
      if (result.success) {
        setDonors((result.data as any) || []);
      }
    } catch (error) {
      console.error('Error loading donors:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...donors];

    if (filters.bloodType) {
      filtered = filtered.filter(d => d.bloodType === filters.bloodType);
    }

    if (filters.barangay) {
      filtered = filtered.filter(d => d.barangay === filters.barangay);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(d =>
        d.name?.toLowerCase().includes(searchLower) ||
        d.email?.toLowerCase().includes(searchLower) ||
        d.contact?.includes(searchLower)
      );
    }

    setFilteredDonors(filtered);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleAddDonor = () => {
    setModalMode('add');
    setFormData(emptyDonorForm);
    setShowModal(true);
  };

  const handleEditDonor = (donor: Donor) => {
    setModalMode('edit');
    setCurrentDonor(donor);
    setFormData({
      name: donor.name,
      email: donor.email,
      bloodType: donor.bloodType,
      contact: donor.contact,
      address: donor.address,
      barangay: donor.barangay,
      lastDonation: donor.lastDonation || '',
      emailAlerts: donor.emailAlerts,
    });
    setShowModal(true);
  };

  const handleDeactivateDonor = async (id: string) => {
    const donor = donors.find(d => d.id === id);
    if (donor && confirm(`Are you sure you want to deactivate ${donor.name}?`)) {
      try {
        const result = await deleteDonor(id);
        if (result.success) {
          alert(result.message);
          loadDonors();
        }
      } catch (error) {
        alert('Failed to deactivate donor');
      }
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let result;
      if (modalMode === 'add') {
        result = await createDonor(formData);
      } else if (currentDonor) {
        result = await updateDonor(currentDonor.id, formData);
      }

      if (result && result.success) {
        alert(result.message);
        setShowModal(false);
        loadDonors();
      } else if (result) {
        alert(result.error);
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    }
  };

  if (loading) {
    return (
      <AdminTemplate title="Donor Management">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </AdminTemplate>
    );
  }

  return (
    <AdminTemplate title="Donor Management">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <p className="text-gray-600">View and manage registered blood donors</p>
        <Button onClick={handleAddDonor} variant="primary">+ Add Donor</Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            label="Search"
            type="text"
            name="search"
            placeholder="Name, email, or contact..."
            value={filters.search || ''}
            onChange={handleFilterChange}
          />
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Blood Type</label>
            <select
              name="bloodType"
              value={filters.bloodType || ''}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
            >
              <option value="">All Blood Types</option>
              {bloodTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Barangay</label>
            <select
              name="barangay"
              value={filters.barangay || ''}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
            >
              <option value="">All Barangays</option>
              {barangays.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="md:bg-white md:rounded-xl md:shadow-sm md:border md:border-gray-200 md:overflow-hidden">
        <DonorList
          donors={filteredDonors}
          onEdit={handleEditDonor}
          onDeactivate={handleDeactivateDonor}
        />
      </div>

      {showModal && (
        <Modal
          isOpen={showModal}
          title={modalMode === 'add' ? 'Add New Donor' : 'Edit Donor'}
          onClose={() => setShowModal(false)}
          footer={
            <div className="flex justify-end gap-3 mt-6">
              <Button type="button" onClick={() => setShowModal(false)} variant="secondary">
                Cancel
              </Button>
              <Button type="submit" variant="primary" form="donorForm">
                {modalMode === 'add' ? 'Add Donor' : 'Save Changes'}
              </Button>
            </div>
          }
        >
          <form id="donorForm" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                required
              />
              <FormField
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                required
              />
              <FormField
                label="Blood Type"
                type="select"
                name="bloodType"
                value={formData.bloodType}
                onChange={handleFormChange}
                options={bloodTypes.map(type => ({ value: type, label: type }))}
                required
              />
              <FormField
                label="Contact Number"
                type="tel"
                name="contact"
                value={formData.contact}
                onChange={handleFormChange}
                required
              />
              <FormField
                label="Address"
                type="text"
                name="address"
                value={formData.address}
                onChange={handleFormChange}
                required
              />
              <FormField
                label="Barangay"
                type="select"
                name="barangay"
                value={formData.barangay}
                onChange={handleFormChange}
                options={barangays.map(b => ({ value: b, label: b }))}
                required
              />
              <FormField
                label="Last Donation Date"
                type="date"
                name="lastDonation"
                value={formData.lastDonation}
                onChange={handleFormChange}
              />
              <div className="flex items-center h-full pt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="emailAlerts"
                    checked={formData.emailAlerts}
                    onChange={handleFormChange}
                    className="w-5 h-5 text-red-600 rounded focus:ring-red-500 border-gray-300"
                  />
                  <span className="text-gray-700">Receive Email Alerts</span>
                </label>
              </div>
            </div>
          </form>
        </Modal>
      )}
    </AdminTemplate>
  );
}
