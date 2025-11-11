import { checkDonationEligibility, formatDate } from '@/lib/api';

export default function DonorCard({ donor, onEdit, onDeactivate, showActions = true }) {
  const eligibility = checkDonationEligibility(donor.lastDonation);
  
  // Dynamic blood type badge color
  const getBloodTypeColor = (bloodType) => {
    const baseType = bloodType.replace(/[+-]/g, '');
    const colors = {
      'A': 'bg-red-600',
      'B': 'bg-blue-600',
      'AB': 'bg-purple-600',
      'O': 'bg-green-600',
    };
    return colors[baseType] || 'bg-gray-600';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 transition-all duration-300 hover:border-red-300 hover:shadow-xl hover:-translate-y-1">
      <div className="flex justify-between items-start mb-5 pb-4 border-b border-gray-100">
        <div className="flex items-center flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold text-gray-700">{donor.name.charAt(0)}</span>
            </div>
            <div>
              <h4 className="text-xl font-bold m-0 text-gray-900">{donor.name}</h4>
              <span className={`${getBloodTypeColor(donor.bloodType)} text-white px-2.5 py-1 rounded-lg font-bold text-xs inline-block mt-1 shadow-sm`}>
                {donor.bloodType}
              </span>
            </div>
          </div>
        </div>
        {donor.status === 'active' && (
          <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-md flex items-center gap-1">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            Active
          </span>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
          <span className="text-gray-400">📧</span>
          <div className="flex-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide block">Email</span>
            <span className="text-sm text-gray-900 font-medium">{donor.email}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
          <span className="text-gray-400">📱</span>
          <div className="flex-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide block">Contact</span>
            <span className="text-sm text-gray-900 font-medium">{donor.contact}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
          <span className="text-gray-400">📍</span>
          <div className="flex-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide block">Barangay</span>
            <span className="text-sm text-gray-900 font-medium">{donor.barangay}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
          <span className="text-gray-400">🩸</span>
          <div className="flex-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide block">Last Donation</span>
            <span className="text-sm text-gray-900 font-medium">
              {donor.lastDonation ? formatDate(donor.lastDonation) : 'Never'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200">
          <span className="text-xl">{eligibility.eligible ? '✅' : '⏰'}</span>
          <div className="flex-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide block">Eligibility Status</span>
            <span className={`text-sm font-bold ${eligibility.eligible ? 'text-green-600' : 'text-orange-600'}`}>
              {eligibility.message}
            </span>
          </div>
        </div>
        {donor.emailAlerts && (
          <div className="flex items-center gap-3 p-2 rounded-lg bg-blue-50 border border-blue-200">
            <span className="text-xl">🔔</span>
            <div className="flex-1">
              <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide block">Email Alerts</span>
              <span className="text-sm text-blue-900 font-medium">Enabled</span>
            </div>
          </div>
        )}
      </div>

      {showActions && (
        <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onEdit(donor)}
            className="flex-1 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold shadow-md hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span>✏️</span>
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDeactivate(donor.id)}
            className="flex-1 px-5 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-red-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span>{donor.status === 'active' ? '🚫' : '✅'}</span>
            {donor.status === 'active' ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      )}
    </div>
  );
}
