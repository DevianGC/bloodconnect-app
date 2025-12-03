'use client';

import React from 'react';
import { 
  BloodType, 
  getBloodTypeInfo, 
  canDonate, 
  COMPATIBILITY_MATRIX,
  CAN_DONATE_TO
} from '@/lib/bloodCompatibility';

interface BloodCompatibilityProps {
  selectedBloodType?: BloodType;
  onSelectBloodType?: (type: BloodType) => void;
  mode?: 'donor' | 'recipient'; // Show who can donate TO you, or who you can donate TO
}

const ALL_BLOOD_TYPES: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function BloodCompatibilityChart({ 
  selectedBloodType, 
  onSelectBloodType,
  mode = 'donor' 
}: BloodCompatibilityProps) {
  const [selected, setSelected] = React.useState<BloodType | undefined>(selectedBloodType);

  const handleSelect = (type: BloodType) => {
    setSelected(type);
    onSelectBloodType?.(type);
  };

  const info = selected ? getBloodTypeInfo(selected) : null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        🩸 Blood Type Compatibility
      </h2>
      
      {/* Blood Type Selector */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {ALL_BLOOD_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => handleSelect(type)}
            className={`
              py-3 px-4 rounded-xl font-bold text-lg transition-all
              ${selected === type 
                ? 'bg-red-600 text-white shadow-lg scale-105' 
                : 'bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-600'
              }
            `}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Selected Blood Type Info */}
      {selected && info && (
        <div className="space-y-4">
          {/* Basic Info */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🩸</span>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Type {selected}</h3>
                <span className={`
                  px-2 py-0.5 rounded text-xs font-semibold
                  ${info.rarity === 'rare' ? 'bg-purple-100 text-purple-700' : 
                    info.rarity === 'uncommon' ? 'bg-blue-100 text-blue-700' : 
                    'bg-green-100 text-green-700'}
                `}>
                  {info.rarity.toUpperCase()} ({info.percentage}% of population)
                </span>
              </div>
            </div>
            <p className="text-gray-600 text-sm">{info.description}</p>
          </div>

          {/* Compatibility Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Can Donate To */}
            <div className="bg-green-50 rounded-xl p-4">
              <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                <span>➡️</span> Can Donate To
              </h4>
              <div className="flex flex-wrap gap-2">
                {info.canDonateTo.map((type) => (
                  <span 
                    key={type}
                    className="bg-green-200 text-green-800 px-3 py-1 rounded-lg font-semibold text-sm"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>

            {/* Can Receive From */}
            <div className="bg-blue-50 rounded-xl p-4">
              <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <span>⬅️</span> Can Receive From
              </h4>
              <div className="flex flex-wrap gap-2">
                {info.canReceiveFrom.map((type) => (
                  <span 
                    key={type}
                    className="bg-blue-200 text-blue-800 px-3 py-1 rounded-lg font-semibold text-sm"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Technical Details */}
          <div className="bg-gray-50 rounded-xl p-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-500">Antigens:</span>
                <span className="ml-2 font-semibold text-gray-800">{info.antigens || 'None'}</span>
              </div>
              <div>
                <span className="text-gray-500">Antibodies:</span>
                <span className="ml-2 font-semibold text-gray-800">{info.antibodies || 'None'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Compatibility Matrix */}
      <div className="mt-6">
        <h3 className="font-semibold text-gray-700 mb-3">Full Compatibility Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Recipient →</th>
                {ALL_BLOOD_TYPES.map(type => (
                  <th key={type} className="p-2 text-center font-semibold">{type}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ALL_BLOOD_TYPES.map(donorType => (
                <tr key={donorType} className="border-b border-gray-100">
                  <td className="p-2 font-semibold bg-gray-50">{donorType}</td>
                  {ALL_BLOOD_TYPES.map(recipientType => (
                    <td key={recipientType} className="p-2 text-center">
                      {canDonate(donorType, recipientType) ? (
                        <span className="text-green-600 font-bold">✓</span>
                      ) : (
                        <span className="text-gray-300">✗</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          ✓ = Compatible (Donor → Recipient)
        </p>
      </div>
    </div>
  );
}
