'use client';

import React, { useState, useEffect } from 'react';
import AdminTemplate from '@/components/atomic/templates/AdminTemplate';
import RequestList from '@/components/atomic/organisms/RequestList';
import Button from '@/components/atomic/atoms/Button';
import FormField from '@/components/atomic/molecules/FormField';
import Modal from '@/components/Modal';
import { getRequests, updateRequestStatus, deleteRequest } from '@/lib/api';
import type { BloodRequest, BloodRequestFilters } from '@/types/api';

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
        setRequests((result.data as any) || []);
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

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await updateRequestStatus(id, status);
      await fetchRequests();
    } catch (error) {
      console.error('Error updating request status:', error);
    }
  };

  const handleDeleteRequest = async (id: string) => {
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
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </AdminTemplate>
    );
  }

  return (
    <AdminTemplate title="Blood Requests">
      <div className="space-y-8">
        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <RequestList
            requests={filteredRequests}
            onView={handleViewRequest}
            onUpdateStatus={handleUpdateStatus}
            onDelete={handleDeleteRequest}
          />
        </div>

        {showModal && currentRequest && (
          <Modal
            isOpen={showModal}
            title={modalMode === 'view' ? 'Request Details' : 'Edit Request'}
            onClose={() => setShowModal(false)}
            footer={
              <div className="flex justify-end gap-3 mt-6">
                <Button type="button" onClick={() => setShowModal(false)} variant="secondary">
                  Close
                </Button>
                {modalMode === 'edit' && (
                  <Button type="submit" variant="primary" form="requestForm">
                    Save Changes
                  </Button>
                )}
                {modalMode === 'view' && (
                  <Button type="button" onClick={() => setModalMode('edit')} variant="primary">
                    Edit Request
                  </Button>
                )}
              </div>
            }
          >
            <form id="requestForm" onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <div className="grid grid-cols-1 gap-6">
                <FormField
                  label="Notes"
                  type="textarea"
                  name="notes"
                  value={currentRequest.notes || ''}
                  onChange={handleFormChange}
                  disabled={modalMode === 'view'}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg">
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
