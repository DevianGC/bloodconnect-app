import React from 'react';
import Button from '@/components/atomic/atoms/Button';
import type { BloodRequest } from '@/types/api';

interface RequestListProps {
  requests: BloodRequest[];
  onView: (request: BloodRequest) => void;
  onUpdateStatus: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}

const RequestList: React.FC<RequestListProps> = ({
  requests,
  onView,
  onUpdateStatus,
  onDelete
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'fulfilled': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'urgent': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'normal': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hospital</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blood Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Urgency</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {requests.map((request) => (
            <tr key={request.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.hospitalName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold text-red-600">{request.bloodType}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.quantity}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border ${getUrgencyColor(request.urgency)}`}>
                  {request.urgency}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(request.status)}`}>
                  {request.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(request.createdAt).toLocaleDateString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <Button onClick={() => onView(request)} variant="secondary" className="text-xs px-2 py-1">
                  View
                </Button>
                {request.status === 'active' && (
                  <>
                    <Button
                      onClick={() => onUpdateStatus(request.id, 'fulfilled')}
                      variant="primary"
                      className="text-xs px-2 py-1"
                    >
                      Fulfill
                    </Button>
                    <Button
                      onClick={() => onUpdateStatus(request.id, 'cancelled')}
                      variant="danger"
                      className="text-xs px-2 py-1"
                    >
                      Cancel
                    </Button>
                  </>
                )}
                <Button
                  onClick={() => onDelete(request.id)}
                  variant="danger"
                  className="text-xs px-2 py-1"
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {requests.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No blood requests found.</p>
        </div>
      )}
    </div>
  );
};

export default RequestList;
