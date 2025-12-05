import React from 'react';

type Props = {
  title: string;
  data: Record<string, number>;
  type?: 'bar' | 'table' | 'pie';
};

export default function AnalyticsChart({ title, data, type = 'bar' }: Props) {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm h-full flex flex-col items-center justify-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 text-sm">No data available</p>
      </div>
    );
  }

  const entries = Object.entries(data);
  const total = entries.reduce((acc, [_, value]) => acc + value, 0);
  const maxValue = Math.max(...entries.map(([_, value]) => value));

  // Professional color palette
  const colors = [
    '#3b82f6', // blue-500
    '#10b981', // emerald-500
    '#f59e0b', // amber-500
    '#6366f1', // indigo-500
    '#ec4899', // pink-500
    '#8b5cf6', // violet-500
    '#14b8a6', // teal-500
    '#f43f5e', // rose-500
  ];

  const renderPieChart = () => {
    let cumulativePercent = 0;

    return (
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 h-full min-h-[300px]">
        {/* Chart Side */}
        <div className="relative w-64 h-64 flex-shrink-0">
          <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
            {entries.map(([label, value], index) => {
              const percent = (value / total) * 100;
              // Avoid rendering 0% segments
              if (percent === 0) return null;
              
              const dashArray = `${percent} ${100 - percent}`;
              const dashOffset = 100 - cumulativePercent;
              cumulativePercent += percent;
              
              return (
                <circle
                  key={label}
                  r="25"
                  cx="50"
                  cy="50"
                  fill="transparent"
                  stroke={colors[index % colors.length]}
                  strokeWidth="20"
                  strokeDasharray={dashArray}
                  strokeDashoffset={dashOffset}
                  className="transition-all duration-300 hover:opacity-90"
                >
                  <title>{`${label}: ${value} (${percent.toFixed(1)}%)`}</title>
                </circle>
              );
            })}
            {/* Inner circle background */}
            <circle r="15" cx="50" cy="50" fill="white" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
            <span className="text-3xl font-bold text-gray-900">{total}</span>
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total</span>
          </div>
        </div>

        {/* Legend Side */}
        <div className="flex-1 w-full max-h-[300px] overflow-y-auto pr-2">
          <div className="flex flex-col gap-2">
            {entries.map(([label, value], index) => {
               const percent = ((value / total) * 100).toFixed(1);
               return (
                <div key={label} className="flex items-center justify-between text-sm p-1.5 rounded hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full shadow-sm" 
                      style={{ backgroundColor: colors[index % colors.length] }}
                    />
                    <span className="text-gray-700 font-medium">{label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 font-medium">{percent}%</span>
                    <span className="font-bold text-gray-900 min-w-[20px] text-right">{value}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      
      <div className="flex-1">
        {type === 'pie' && renderPieChart()}

        {type === 'bar' && (
          <div className="flex flex-col gap-4 justify-center h-full">
            {entries.map(([label, value], index) => {
              const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
              const color = colors[index % colors.length];
              return (
                <div key={label} className="w-full">
                  <div className="flex justify-between mb-1 text-sm">
                    <span className="font-medium text-gray-700">{label}</span>
                    <span className="font-semibold text-gray-900">{value}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: color
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {type === 'table' && (
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {entries.map(([label, value], index) => (
                  <tr key={label} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: colors[index % colors.length] }}
                        />
                        {label}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
