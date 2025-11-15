'use client';

import React, { useState, useEffect } from 'react';
import AdminTemplate from '@/components/atomic/templates/AdminTemplate';
import RequestList from '@/components/atomic/organisms/RequestList';
import Button from '@/components/atomic/atoms/Button';
import FormField from '@/components/atomic/molecules/FormField';
import Modal from '@/components/Modal';
import { getRequests, updateRequestStatus, deleteRequest } from '@/lib/api';
import type { BloodRequest, BloodRequestFilters } from '@/types/api';
import styles from '@/styles/admin.module.css';

export default function RequestsManagement() {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');
  const [currentRequest, setCurrentRequest] = useState<BloodRequest | null>(null);
  const [filters, setFilters] = useState<BloodRequestFilters>({
    bloodType: '',
    urgency: '',
    status: ''
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [requests, filters]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const result = await getRequests();
      if (result.success) {
        setRequests(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...requests];

    if (filters.bloodType) {
      filtered = filtered.filter(r => r.bloodType === filters.bloodType);
    }
    if (filters.urgency) {
      filtered = filtered.filter(r => r.urgency === filters.urgency);
    }
    if (filters.status) {
      filtered = filtered.filter(r => r.status === filters.status);
    }

    setFilteredRequests(filtered);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleViewRequest = (request: BloodRequest) => {
    setCurrentRequest(request);
    setModalMode('view');
    setShowModal(true);
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await updateRequestStatus(id, status);
      await fetchRequests();
    } catch (error) {
      console.error('Error updating request status:', error);
    }
  };

  const handleDeleteRequest = async (id: number) => {
    if (confirm('Are you sure you want to delete this request?')) {
      try {
        await deleteRequest(id);
        await fetchRequests();
      } catch (error) {
        console.error('Error deleting request:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(false);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (currentRequest) {
      setCurrentRequest({
        ...currentRequest,
        [name]: value
      });
    }
  };

  const bloodTypeOptions = [
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' }
  ];

  const urgencyOptions = [
    { value: 'normal', label: 'Normal' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'critical', label: 'Critical' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'fulfilled', label: 'Fulfilled' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  if (loading) {
    return (
      <AdminTemplate title="Blood Requests">
        <div className={styles.loading}>Loading requests...</div>
      </AdminTemplate>
    );
  }

  return (
    <AdminTemplate title="Blood Requests">
      <div className={styles.adminContent}>
        <div className={styles.filtersSection}>
          <h2>Filters</h2>
          <div className={styles.filterGrid}>
            <FormField
              label="Blood Type"
              type="select"
              name="bloodType"
              value={filters.bloodType}
              onChange={handleFilterChange}
              options={bloodTypeOptions}
            />
            <FormField
              label="Urgency"
              type="select"
              name="urgency"
              value={filters.urgency}
              onChange={handleFilterChange}
              options={urgencyOptions}
            />
            <FormField
              label="Status"
              type="select"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              options={statusOptions}
            />
          </div>
        </div>

        <RequestList
          requests={filteredRequests}
          onView={handleViewRequest}
          onUpdateStatus={handleUpdateStatus}
          onDelete={handleDeleteRequest}
        />

        {showModal && currentRequest && (
          <Modal
            isOpen={showModal}
            title={modalMode === 'view' ? 'Request Details' : 'Edit Request'}
            onClose={() => setShowModal(false)}
            footer={
              <div className={styles.formActions}>
                <Button type="submit" variant="primary" disabled={modalMode === 'view'}>
                  {modalMode === 'view' ? 'View Mode' : 'Save Changes'}
                </Button>
                <Button type="button" onClick={() => setShowModal(false)} variant="secondary">
                  Close
                </Button>
              </div>
            }
          >
            <form onSubmit={handleSubmit} className={styles.modalForm}>
              <div className={styles.formGrid}>
                <FormField
                  label="Hospital Name"
                  type="text"
                  name="hospitalName"
                  value={currentRequest.hospitalName}
                  onChange={handleFormChange}
                  disabled={modalMode === 'view'}
                  required
                />
                <FormField
                  label="Blood Type"
                  type="select"
                  name="bloodType"
                  value={currentRequest.bloodType}
                  onChange={handleFormChange}
                  options={bloodTypeOptions}
                  disabled={modalMode === 'view'}
                  required
                />
                <FormField
                  label="Quantity"
                  type="number"
                  name="quantity"
                  value={currentRequest.quantity}
                  onChange={handleFormChange}
                  disabled={modalMode === 'view'}
                  required
                />
                <FormField
                  label="Urgency"
                  type="select"
                  name="urgency"
                  value={currentRequest.urgency}
                  onChange={handleFormChange}
                  options={urgencyOptions}
                  disabled={modalMode === 'view'}
                  required
                />
                <FormField
                  label="Status"
                  type="select"
                  name="status"
                  value={currentRequest.status}
                  onChange={handleFormChange}
                  options={statusOptions}
                  disabled={modalMode === 'view'}
                  required
                />
              </div>
              <div className={styles.formGrid}>
                <FormField
                  label="Notes"
                  type="textarea"
                  name="notes"
                  value={currentRequest.notes || ''}
                  onChange={handleFormChange}
                  disabled={modalMode === 'view'}
                />
              </div>
              <div className={styles.formGrid}>
                <FormField
                  label="Created At"
                  type="text"
                  name="createdAt"
                  value={new Date(currentRequest.createdAt).toLocaleDateString()}
                  disabled={true}
                />
                <FormField
                  label="Matched Donors"
                  type="number"
                  name="matchedDonors"
                  value={currentRequest.matchedDonors}
                  disabled={true}
                />
              </div>
            </form>
          </Modal>
        )}
      </div>
    </AdminTemplate>
  );
}
