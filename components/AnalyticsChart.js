import React from 'react';

export default function AnalyticsChart({ title, data, type = 'bar' }) {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
        <h3 className="text-2xl font-bold mb-6 text-gray-900">{title}</h3>
        <div className="text-center py-12">
          <div className="text-5xl mb-4">📊</div>
          <p className="text-gray-500 font-medium">No data available</p>
        </div>
      </div>
    );
  }

  const entries = Object.entries(data);
  const maxValue = Math.max(...entries.map(([_, value]) => value));

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
        <span className="px-3 py-1 bg-gradient-to-r from-red-100 to-red-200 text-red-700 rounded-lg text-xs font-semibold">Analytics</span>
      </div>
      
      {type === 'bar' && (
        <div className="flex flex-col gap-5">
          {entries.map(([label, value], index) => {
            const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
            const colors = [
              'from-red-500 to-red-600',
              'from-blue-500 to-blue-600',
              'from-green-500 to-green-600',
              'from-purple-500 to-purple-600',
              'from-orange-500 to-orange-600',
              'from-pink-500 to-pink-600',
            ];
            const color = colors[index % colors.length];
            return (
              <div key={label} className="group">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">{label}</span>
                  <span className="text-sm font-bold text-gray-900">{value}</span>
                </div>
                <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden relative shadow-inner">
                  <div 
                    className={`bg-gradient-to-r ${color} h-full rounded-full transition-all duration-500 ease-out group-hover:scale-x-105 shadow-md`}
                    style={{ width: `${percentage}%` }}
                  >
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {type === 'table' && (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Count</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {entries.map(([label, value], index) => (
                <tr key={label} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                      <span className="text-sm font-semibold text-gray-900">{label}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 bg-gradient-to-r from-red-100 to-red-200 text-red-700 rounded-lg text-sm font-bold">{value}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
