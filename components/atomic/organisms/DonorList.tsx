import React from 'react';
import Button from '@/components/atomic/atoms/Button';
import type { Donor } from '@/types/api';
import styles from '@/styles/admin.module.css';

interface DonorListProps {
  donors: Donor[];
  onEdit: (donor: Donor) => void;
  onDeactivate: (id: number) => void;
}

const DonorList: React.FC<DonorListProps> = ({
  donors,
  onEdit,
  onDeactivate
}) => {
  return (
    <div className={styles.dataTable}>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Blood Type</th>
            <th>Contact</th>
            <th>Address</th>
            <th>Barangay</th>
            <th>Last Donation</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {donors.map((donor) => (
            <tr key={donor.id}>
              <td>{donor.name}</td>
              <td>{donor.email}</td>
              <td className={styles.bloodType}>{donor.bloodType}</td>
              <td>{donor.contact}</td>
              <td>{donor.address}</td>
              <td>{donor.barangay}</td>
              <td>{donor.lastDonation || 'Never'}</td>
              <td>
                <span className={`${styles.statusBadge} ${donor.status === 'active' ? styles.statusActive : styles.statusInactive}`}>
                  {donor.status}
                </span>
              </td>
              <td className={styles.actions}>
                <Button onClick={() => onEdit(donor)} variant="secondary">
                  Edit
                </Button>
                <Button
                  onClick={() => onDeactivate(donor.id)}
                  variant="danger"
                >
                  {donor.status === 'active' ? 'Deactivate' : 'Activate'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {donors.length === 0 && (
        <div className={styles.noData}>
          <p>No donors found.</p>
        </div>
      )}
    </div>
  );
};

export default DonorList;
