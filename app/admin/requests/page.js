'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Sidebar from '../../../components/Sidebar';
import RequestForm from '../../../components/RequestForm';
import DonorCard from '../../../components/DonorCard';
import Modal from '../../../components/Modal';
import { createRequest, getDonors, sendBulkAlert } from '../../../lib/api';
import styles from '../../../styles/admin.module.css';

export default function AdminRequests() {
  const router = useRouter();
  const [matchedDonors, setMatchedDonors] = useState([]);
  const [selectedBloodType, setSelectedBloodType] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const adminUser = localStorage.getItem('adminUser');
    if (!adminUser) {
      router.push('/admin/login');
    }
  }, []);

  const handleRequestSubmit = async (requestData) => {
    setLoading(true);
    try {
      const result = await createRequest(requestData);
      
      if (result.success) {
        setCurrentRequest(result.data);
        setSelectedBloodType(requestData.bloodType);
        
        // Auto-match donors
        const donorsResult = await getDonors({ 
          bloodType: requestData.bloodType,
          status: 'active'
        });
        
        if (donorsResult.success) {
          // Filter donors who opted in for email alerts
          const eligibleDonors = donorsResult.data.filter(d => d.emailAlerts);
          setMatchedDonors(eligibleDonors);
        }
        
        alert('Blood request created successfully!');
      } else {
        alert('Failed to create request: ' + result.error);
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendAlerts = () => {
    if (matchedDonors.length === 0) {
      alert('No matching donors found with email alerts enabled.');
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmSendAlerts = async () => {
    setLoading(true);
    try {
      const donorIds = matchedDonors.map(d => d.id);
      const result = await sendBulkAlert(currentRequest.id, donorIds);
      
      if (result.success) {
        alert(`Success! Alert sent to ${result.data.sentCount} donors.`);
        setShowConfirmModal(false);
        // Reset form
        setMatchedDonors([]);
        setCurrentRequest(null);
        setSelectedBloodType('');
      } else {
        alert('Failed to send alerts: ' + result.error);
      }
    } catch (error) {
      alert('An error occurred while sending alerts.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar role="admin" />
      <div className={styles.adminLayout}>
        <Sidebar role="admin" />
        <main className={styles.adminMain}>
          <div className={styles.adminHeader}>
            <h1>Blood Requests</h1>
            <p className={styles.adminSubtitle}>Create and manage emergency blood requests</p>
          </div>

          {/* Request Form */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Create New Blood Request</h2>
            <div className={styles.formContainer}>
              <RequestForm onSubmit={handleRequestSubmit} />
            </div>
          </div>

          {/* Matched Donors */}
          {matchedDonors.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  Matched Donors ({matchedDonors.length})
                </h2>
                <button 
                  className={styles.btnPrimary}
                  onClick={handleSendAlerts}
                  disabled={loading}
                >
                  Send Alerts to All
                </button>
              </div>

              <div className={styles.donorsGrid}>
                {matchedDonors.map(donor => (
                  <DonorCard 
                    key={donor.id} 
                    donor={donor} 
                    showActions={false}
                  />
                ))}
              </div>
            </div>
          )}

          {/* No Matches Message */}
          {selectedBloodType && matchedDonors.length === 0 && (
            <div className={styles.section}>
              <div className={styles.emptyState}>
                <p>No matching donors found with email alerts enabled for blood type {selectedBloodType}.</p>
                <p className={styles.emptyStateHint}>
                  Consider manually contacting donors or expanding the search criteria.
                </p>
              </div>
            </div>
          )}

          {/* Confirmation Modal */}
          <Modal
            isOpen={showConfirmModal}
            onClose={() => setShowConfirmModal(false)}
            title="Confirm Send Alerts"
            footer={
              <>
                <button 
                  className={styles.btnSecondary}
                  onClick={() => setShowConfirmModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className={styles.btnPrimary}
                  onClick={confirmSendAlerts}
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Confirm & Send'}
                </button>
              </>
            }
          >
            <p>
              You are about to send emergency blood donation alerts to{' '}
              <strong>{matchedDonors.length} matching donors</strong>.
            </p>
            <p className="mt-md">
              Hospital: <strong>{currentRequest?.hospitalName}</strong><br />
              Blood Type: <strong>{currentRequest?.bloodType}</strong><br />
              Quantity: <strong>{currentRequest?.quantity} units</strong>
            </p>
            <p className="mt-md">
              Do you want to proceed?
            </p>
          </Modal>
        </main>
      </div>
    </>
  );
}
