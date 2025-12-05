'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import AdminTemplate from '@/components/atomic/templates/AdminTemplate';
import RequestList from '@/components/atomic/organisms/RequestList';
import Button from '@/components/atomic/atoms/Button';
import FormField from '@/components/atomic/molecules/FormField';
import Modal from '@/components/Modal';
import { getRequests, updateRequestStatus, deleteRequest, createRequest, getDonors } from '@/lib/api';
import { createAlert } from '@/lib/db';
import type { BloodRequest, BloodRequestFilters } from '@/types/api';

export default function RequestsManagement() {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'create'>('view');
  const [currentRequest, setCurrentRequest] = useState<Partial<BloodRequest>>({});
  const [notifyOnCreate, setNotifyOnCreate] = useState(false);
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
        // Filter out soft-deleted items just in case
        const activeRequests = (result.data as any[]).filter(r => r.status !== 'deleted');
        setRequests(activeRequests);
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

  const handleClearFilters = () => {
    setFilters({
      bloodType: '',
      urgency: '',
      status: ''
    });
  };

  const handleNotifyDonors = async (request: BloodRequest) => {
    const toastId = toast.loading('Processing notifications...');
    try {
      // 1. Create Alert in Firestore (Client-side, authenticated)
      await createAlert({
        requestId: request.id,
        title: `Urgent Request: ${request.bloodType} Blood Needed`,
        message: `Urgent need for ${request.bloodType} blood at ${request.hospitalName}. Urgency: ${request.urgency}.`,
        hospitalName: request.hospitalName,
        bloodType: request.bloodType,
        quantity: request.quantity,
        status: 'sent',
        sentAt: new Date().toISOString(),
        urgency: request.urgency
      });

      // 2. Fetch Donors (Client-side, authenticated)
      const donorsResult = await getDonors();
      let recipients: any[] = [];
      
      if (donorsResult.success && Array.isArray(donorsResult.data)) {
         recipients = donorsResult.data.filter((d: any) => 
            d.bloodType === request.bloodType && 
            d.emailAlerts !== false
         ).map((d: any) => ({ email: d.email, name: d.name }));
      }

      if (recipients.length === 0) {
        toast.success('Alert created, but no matching donors found for email.', { id: toastId });
        return;
      }

      // 3. Send Emails via API
      const response = await fetch('/api/notify-donors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bloodType: request.bloodType,
          urgency: request.urgency,
          location: request.hospitalName,
          patientName: (request as any).patientName || 'Patient',
          recipients: recipients
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(`Alert created and ${data.count} emails sent!`, { id: toastId });
      } else {
        toast.error(data.error || 'Failed to send notifications', { id: toastId });
      }
    } catch (error) {
      console.error('Error notifying donors:', error);
      toast.error('An error occurred while processing', { id: toastId });
    }
  };

  const handleAddRequest = () => {
    setCurrentRequest({
      hospitalName: '',
      bloodType: 'A+',
      quantity: 1,
      urgency: 'normal',
      status: 'active',
      notes: ''
    });
    setNotifyOnCreate(false);
    setModalMode('create');
    setShowModal(true);
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
    
    if (modalMode === 'create') {
      const toastId = toast.loading('Creating request...');
      try {
        const result = await createRequest(currentRequest);
        if (result.success) {
          toast.success('Request created successfully', { id: toastId });
          
          if (notifyOnCreate && result.data) {
            // Trigger notification
            handleNotifyDonors(result.data as BloodRequest);
          }
          
          setShowModal(false);
          fetchRequests();
        } else {
          toast.error(result.error || 'Failed to create request', { id: toastId });
        }
      } catch (error) {
        console.error('Error creating request:', error);
        toast.error('An error occurred', { id: toastId });
      }
    } else {
      // Handle edit (not fully implemented in this snippet but preserving structure)
      setShowModal(false);
    }
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
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Requests</h1>
            <p className="text-sm text-gray-500 mt-1">View and manage blood donation requests</p>
          </div>
          <Button onClick={handleAddRequest} variant="primary" className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            New Request
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Filter Requests</h2>
            {(filters.bloodType || filters.urgency || filters.status) && (
              <button 
                onClick={handleClearFilters}
                className="text-sm text-red-600 hover:text-red-700 font-medium hover:underline"
              >
                Clear Filters
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              label="Blood Type"
              type="select"
              name="bloodType"
              value={filters.bloodType}
              onChange={handleFilterChange}
              options={bloodTypeOptions}
              placeholder="All Blood Types"
            />
            <FormField
              label="Urgency"
              type="select"
              name="urgency"
              value={filters.urgency}
              onChange={handleFilterChange}
              options={urgencyOptions}
              placeholder="All Urgencies"
            />
            <FormField
              label="Status"
              type="select"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              options={statusOptions}
              placeholder="All Statuses"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <RequestList
            requests={filteredRequests}
            onView={handleViewRequest}
            onUpdateStatus={handleUpdateStatus}
            onDelete={handleDeleteRequest}
            onNotify={handleNotifyDonors}
          />
        </div>

        {showModal && currentRequest && (
          <Modal
            isOpen={showModal}
            title={modalMode === 'view' ? 'Request Details' : modalMode === 'create' ? 'Create New Request' : 'Edit Request'}
            onClose={() => setShowModal(false)}
            footer={
              <div className="flex justify-end gap-3 mt-6">
                <Button type="button" onClick={() => setShowModal(false)} variant="secondary">
                  Close
                </Button>
                {modalMode === 'create' && (
                  <Button type="submit" variant="primary" form="requestForm">
                    Create Request
                  </Button>
                )}
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
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h3 className="text-sm font-medium text-gray-900 mb-3 uppercase tracking-wide">Request Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <FormField
                      label="Hospital Name"
                      type="text"
                      name="hospitalName"
                      value={currentRequest.hospitalName || ''}
                      onChange={handleFormChange}
                      disabled={modalMode === 'view'}
                      required
                      placeholder="e.g. James L. Gordon Memorial Hospital"
                    />
                  </div>
                  <FormField
                    label="Blood Type"
                    type="select"
                    name="bloodType"
                    value={currentRequest.bloodType || ''}
                    onChange={handleFormChange}
                    options={bloodTypeOptions}
                    disabled={modalMode === 'view'}
                    required
                  />
                  <FormField
                    label="Quantity (Units)"
                    type="number"
                    name="quantity"
                    value={currentRequest.quantity || 0}
                    onChange={handleFormChange}
                    disabled={modalMode === 'view'}
                    required
                  />
                  <FormField
                    label="Urgency Level"
                    type="select"
                    name="urgency"
                    value={currentRequest.urgency || ''}
                    onChange={handleFormChange}
                    options={urgencyOptions}
                    disabled={modalMode === 'view'}
                    required
                  />
                  {modalMode !== 'create' && (
                    <FormField
                      label="Current Status"
                      type="select"
                      name="status"
                      value={currentRequest.status || ''}
                      onChange={handleFormChange}
                      options={statusOptions}
                      disabled={modalMode === 'view'}
                      required
                    />
                  )}
                </div>
              </div>

              <div>
                <FormField
                  label="Additional Notes"
                  type="textarea"
                  name="notes"
                  value={currentRequest.notes || ''}
                  onChange={handleFormChange}
                  disabled={modalMode === 'view'}
                  placeholder="Any specific requirements or patient details..."
                />
              </div>
              
              {modalMode === 'create' && (
                <div className="flex items-start space-x-3 bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      id="notifyDonors"
                      checked={notifyOnCreate}
                      onChange={(e) => setNotifyOnCreate(e.target.checked)}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="text-sm">
                    <label htmlFor="notifyDonors" className="font-medium text-gray-900">
                      Notify Donors Immediately
                    </label>
                    <p className="text-gray-500">Send an email alert to all registered donors with matching blood type.</p>
                  </div>
                </div>
              )}

              {modalMode !== 'create' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg">
                  <FormField
                    label="Created At"
                    type="text"
                    name="createdAt"
                    value={currentRequest.createdAt ? new Date(currentRequest.createdAt).toLocaleDateString() : ''}
                    disabled={true}
                  />
                  <FormField
                    label="Matched Donors"
                    type="number"
                    name="matchedDonors"
                    value={currentRequest.matchedDonors || 0}
                    disabled={true}
                  />
                </div>
              )}
            </form>
          </Modal>
        )}
      </div>
    </AdminTemplate>
  );
}
