import React from 'react';
import Button from '@/components/atomic/atoms/Button';
import type { Donor } from '@/types/api';

interface DonorListProps {
  donors: Donor[];
  onEdit: (donor: Donor) => void;
  onDeactivate: (id: string) => void;
}

const DonorList: React.FC<DonorListProps> = ({
  donors,
  onEdit,
  onDeactivate
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blood Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Barangay</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Donation</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {donors.map((donor) => (
            <tr key={donor.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{donor.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{donor.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold text-red-600">{donor.bloodType}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{donor.contact}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{donor.address}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{donor.barangay}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{donor.lastDonation || 'Never'}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  donor.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {donor.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <Button onClick={() => onEdit(donor)} variant="secondary" className="text-xs px-2 py-1">
                  Edit
                </Button>
                <Button
                  onClick={() => onDeactivate(donor.id)}
                  variant="danger"
                  className="text-xs px-2 py-1"
                >
                  {donor.status === 'active' ? 'Deactivate' : 'Activate'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {donors.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No donors found.</p>
        </div>
      )}
    </div>
  );
};

export default DonorList;
