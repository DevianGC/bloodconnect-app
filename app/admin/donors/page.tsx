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
        setDonors(result.data || []);
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
        d.name.toLowerCase().includes(searchLower) ||
        d.email.toLowerCase().includes(searchLower) ||
        d.contact.includes(searchLower)
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

  const handleDeactivateDonor = async (id: number) => {
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
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading donors...</p>
      </div>
    );
  }

  return (
    <AdminTemplate title="Donor Management">
      <div className={styles.adminHeader}>
        <p className={styles.adminSubtitle}>View and manage registered blood donors</p>
        <Button onClick={handleAddDonor} variant="primary">+ Add Donor</Button>
      </div>

      {/* Filters */}
      <div className={styles.filtersSection}>
        <div className={styles.filtersGrid}>
          <FormField
            label="Search"
            type="text"
            name="search"
            placeholder="Name, email, or contact..."
            value={filters.search || ''}
            onChange={handleFilterChange}
          />
          <div className={styles.filterGroup}>
            <label>Blood Type</label>
            <select
              name="bloodType"
              value={filters.bloodType || ''}
              onChange={handleFilterChange}
              className={styles.filterSelect}
            >
              <option value="">All Blood Types</option>
              {bloodTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label>Barangay</label>
            <select
              name="barangay"
              value={filters.barangay || ''}
              onChange={handleFilterChange}
              className={styles.filterSelect}
            >
              <option value="">All Barangays</option>
              {barangays.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <DonorList
        donors={filteredDonors}
        onEdit={handleEditDonor}
        onDeactivate={handleDeactivateDonor}
      />

      {showModal && (
        <Modal
          isOpen={showModal}
          title={modalMode === 'add' ? 'Add New Donor' : 'Edit Donor'}
          onClose={() => setShowModal(false)}
          footer={
            <div className={styles.formActions}>
              <Button type="submit" variant="primary">
                {modalMode === 'add' ? 'Add Donor' : 'Save Changes'}
              </Button>
              <Button type="button" onClick={() => setShowModal(false)} variant="secondary">
                Cancel
              </Button>
            </div>
          }
        >
          <form onSubmit={handleSubmit} className={styles.modalForm}>
            <div className={styles.formGrid}>
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
              <div className={styles.checkboxGroup}>
                <FormField
                  label="Receive Email Alerts"
                  type="checkbox"
                  name="emailAlerts"
                  checked={formData.emailAlerts}
                  onChange={handleFormChange}
                />
              </div>
            </div>
          </form>
        </Modal>
      )}
    </AdminTemplate>
  );
}
