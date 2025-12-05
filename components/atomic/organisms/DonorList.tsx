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
    <div className="w-full">
      {/* Mobile View - Cards */}
      <div className="md:hidden space-y-4">
        {donors.map((donor) => (
          <div key={donor.id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-medium text-gray-900">{donor.name}</h3>
                <p className="text-sm text-gray-500">{donor.email}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                donor.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {donor.status}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500 uppercase">Blood Type</p>
                <p className="font-bold text-red-600">{donor.bloodType}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Contact</p>
                <p className="text-gray-900 text-sm">{donor.contact}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-gray-500 uppercase">Location</p>
                <p className="text-gray-900 text-sm">{donor.barangay}, {donor.address}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Last Donation</p>
                <p className="text-gray-900 text-sm">{donor.lastDonation || 'Never'}</p>
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-gray-100">
              <Button onClick={() => onEdit(donor)} variant="secondary" className="text-xs px-3 py-1.5 flex-1 justify-center">
                Edit
              </Button>
              <Button
                onClick={() => onDeactivate(donor.id)}
                variant="danger"
                className="text-xs px-3 py-1.5 flex-1 justify-center"
              >
                {donor.status === 'active' ? 'Deactivate' : 'Activate'}
              </Button>
            </div>
          </div>
        ))}
        {donors.length === 0 && (
          <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500">No donors found.</p>
          </div>
        )}
      </div>

      {/* Desktop View - Table */}
      <div className="hidden md:block overflow-x-auto">
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
    </div>
  );
};

export default DonorList;
