'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Sidebar from '../../../components/Sidebar';
import DonorCard from '../../../components/DonorCard';
import Modal from '../../../components/Modal';
import { getDonors, createDonor, updateDonor, deleteDonor } from '../../../lib/api';
import { bloodTypes, barangays } from '../../../lib/mockData';
import styles from '../../../styles/admin.module.css';

export default function AdminDonors() {
  const router = useRouter();
  const [donors, setDonors] = useState([]);
  const [filteredDonors, setFilteredDonors] = useState([]);
  const [filters, setFilters] = useState({
    bloodType: '',
    barangay: '',
    search: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentDonor, setCurrentDonor] = useState(null);
  const [loading, setLoading] = useState(true);

  const emptyDonorForm = {
    name: '',
    email: '',
    bloodType: '',
    contact: '',
    address: '',
    barangay: '',
    lastDonation: '',
    emailAlerts: true,
  };

  const [formData, setFormData] = useState(emptyDonorForm);

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
        setDonors(result.data);
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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleAddDonor = () => {
    setModalMode('add');
    setFormData(emptyDonorForm);
    setShowModal(true);
  };

  const handleEditDonor = (donor) => {
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

  const handleDeactivateDonor = async (donor) => {
    if (confirm(`Are you sure you want to deactivate ${donor.name}?`)) {
      try {
        const result = await deleteDonor(donor.id);
        if (result.success) {
          alert(result.message);
          loadDonors();
        }
      } catch (error) {
        alert('Failed to deactivate donor');
      }
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let result;
      if (modalMode === 'add') {
        result = await createDonor(formData);
      } else {
        result = await updateDonor(currentDonor.id, formData);
      }

      if (result.success) {
        alert(result.message);
        setShowModal(false);
        loadDonors();
      } else {
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
    <>
      <Navbar role="admin" />
      <div className={styles.adminLayout}>
        <Sidebar role="admin" />
        <main className={styles.adminMain}>
          <div className={styles.adminHeader}>
            <div>
              <h1>Donor Management</h1>
              <p className={styles.adminSubtitle}>View and manage registered blood donors</p>
            </div>
            <button className={styles.btnPrimary} onClick={handleAddDonor}>
              + Add Donor
            </button>
          </div>

          {/* Filters */}
          <div className={styles.filtersSection}>
            <div className={styles.filtersGrid}>
              <div className={styles.filterGroup}>
                <label>Search</label>
                <input
                  type="text"
                  name="search"
                  placeholder="Name, email, or contact..."
                  value={filters.search}
                  onChange={handleFilterChange}
                  className={styles.filterInput}
                />
              </div>

              <div className={styles.filterGroup}>
                <label>Blood Type</label>
                <select
                  name="bloodType"
                  value={filters.bloodType}
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
                  value={filters.barangay}
                  onChange={handleFilterChange}
                  className={styles.filterSelect}
                >
                  <option value="">All Barangays</option>
                  {barangays.map(brgy => (
                    <option key={brgy} value={brgy}>{brgy}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.filterResults}>
              Showing {filteredDonors.length} of {donors.length} donors
            </div>
          </div>

          {/* Donors Grid */}
          <div className={styles.section}>
            {filteredDonors.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No donors found matching your criteria.</p>
              </div>
            ) : (
              <div className={styles.donorsGrid}>
                {filteredDonors.map(donor => (
                  <DonorCard
                    key={donor.id}
                    donor={donor}
                    onEdit={handleEditDonor}
                    onDeactivate={handleDeactivateDonor}
                    showActions={true}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Add/Edit Donor Modal */}
          <Modal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            title={modalMode === 'add' ? 'Add New Donor' : 'Edit Donor'}
          >
            <form onSubmit={handleSubmit} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Blood Type *</label>
                  <select
                    name="bloodType"
                    value={formData.bloodType}
                    onChange={handleFormChange}
                    required
                    className={styles.formSelect}
                  >
                    <option value="">Select</option>
                    {bloodTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Contact Number *</label>
                  <input
                    type="tel"
                    name="contact"
                    value={formData.contact}
                    onChange={handleFormChange}
                    required
                    className={styles.formInput}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Barangay *</label>
                <select
                  name="barangay"
                  value={formData.barangay}
                  onChange={handleFormChange}
                  required
                  className={styles.formSelect}
                >
                  <option value="">Select Barangay</option>
                  {barangays.map(brgy => (
                    <option key={brgy} value={brgy}>{brgy}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Complete Address *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleFormChange}
                  required
                  className={styles.formTextarea}
                  rows="2"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Last Donation Date</label>
                <input
                  type="date"
                  name="lastDonation"
                  value={formData.lastDonation}
                  onChange={handleFormChange}
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="emailAlerts"
                    checked={formData.emailAlerts}
                    onChange={handleFormChange}
                  />
                  <span>Enable email alerts for blood requests</span>
                </label>
              </div>

              <div className={styles.modalActions}>
                <button 
                  type="button" 
                  className={styles.btnSecondary}
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  {modalMode === 'add' ? 'Add Donor' : 'Save Changes'}
                </button>
              </div>
            </form>
          </Modal>
        </main>
      </div>
    </>
  );
}
