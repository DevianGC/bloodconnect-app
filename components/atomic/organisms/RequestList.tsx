import React from 'react';
import Button from '@/components/atomic/atoms/Button';
import type { BloodRequest } from '@/types/api';
import styles from '@/styles/admin.module.css';

interface RequestListProps {
  requests: BloodRequest[];
  onView: (request: BloodRequest) => void;
  onUpdateStatus: (id: number, status: string) => void;
  onDelete: (id: number) => void;
}

const RequestList: React.FC<RequestListProps> = ({
  requests,
  onView,
  onUpdateStatus,
  onDelete
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return styles.statusPending;
      case 'fulfilled': return styles.statusFulfilled;
      case 'cancelled': return styles.statusCancelled;
      default: return styles.statusPending;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return styles.urgencyCritical;
      case 'urgent': return styles.urgencyUrgent;
      case 'normal': return styles.urgencyNormal;
      default: return styles.urgencyNormal;
    }
  };

  return (
    <div className={styles.dataTable}>
      <table>
        <thead>
          <tr>
            <th>Hospital</th>
            <th>Blood Type</th>
            <th>Quantity</th>
            <th>Urgency</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id}>
              <td>{request.hospitalName}</td>
              <td className={styles.bloodType}>{request.bloodType}</td>
              <td>{request.quantity}</td>
              <td>
                <span className={`${styles.urgencyBadge} ${getUrgencyColor(request.urgency)}`}>
                  {request.urgency}
                </span>
              </td>
              <td>
                <span className={`${styles.statusBadge} ${getStatusColor(request.status)}`}>
                  {request.status}
                </span>
              </td>
              <td>{new Date(request.createdAt).toLocaleDateString()}</td>
              <td className={styles.actions}>
                <Button onClick={() => onView(request)} variant="secondary">
                  View
                </Button>
                {request.status === 'active' && (
                  <>
                    <Button
                      onClick={() => onUpdateStatus(request.id, 'fulfilled')}
                      variant="primary"
                    >
                      Fulfill
                    </Button>
                    <Button
                      onClick={() => onUpdateStatus(request.id, 'cancelled')}
                      variant="danger"
                    >
                      Cancel
                    </Button>
                  </>
                )}
                <Button
                  onClick={() => onDelete(request.id)}
                  variant="danger"
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {requests.length === 0 && (
        <div className={styles.noData}>
          <p>No blood requests found.</p>
        </div>
      )}
    </div>
  );
};

export default RequestList;
