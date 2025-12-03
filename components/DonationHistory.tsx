'use client';

import React from 'react';
import { format } from 'date-fns';
import type { DonationRecord, DonationCertificate } from '@/types/appointments';

interface DonationHistoryProps {
  donations: DonationRecord[];
  onViewCertificate?: (certificateId: string) => void;
}

export function DonationHistory({ donations, onViewCertificate }: DonationHistoryProps) {
  if (donations.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
        <span className="text-5xl mb-4 block">🩸</span>
        <h3 className="text-lg font-semibold text-gray-800">No Donations Yet</h3>
        <p className="text-gray-500">Schedule your first donation and start saving lives!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        📋 Donation History
      </h2>

      <div className="space-y-3">
        {donations.map((donation, index) => (
          <div
            key={donation.id}
            className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            {/* Date Column */}
            <div className="text-center min-w-[60px]">
              <div className="text-2xl font-bold text-red-600">
                {format(new Date(donation.date), 'd')}
              </div>
              <div className="text-xs text-gray-500">
                {format(new Date(donation.date), 'MMM yyyy')}
              </div>
            </div>

            {/* Vertical Line */}
            <div className="w-px h-12 bg-gray-300 relative">
              <div className={`
                absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                w-3 h-3 rounded-full
                ${donation.status === 'completed' ? 'bg-green-500' : 
                  donation.status === 'deferred' ? 'bg-yellow-500' : 'bg-red-500'}
              `} />
            </div>

            {/* Donation Info */}
            <div className="flex-1">
              <div className="font-semibold text-gray-800">{donation.hospitalName}</div>
              <div className="text-sm text-gray-500">
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  {donation.bloodType}
                </span>
                <span className="mx-2">•</span>
                <span>{donation.units} unit{donation.units > 1 ? 's' : ''}</span>
              </div>
            </div>

            {/* Status Badge */}
            <div className={`
              px-3 py-1 rounded-full text-xs font-semibold
              ${donation.status === 'completed' ? 'bg-green-100 text-green-700' :
                donation.status === 'deferred' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'}
            `}>
              {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
            </div>

            {/* Certificate Button */}
            {donation.certificateId && donation.status === 'completed' && (
              <button
                onClick={() => onViewCertificate?.(donation.certificateId!)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="View Certificate"
              >
                📜
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

interface CertificateModalProps {
  certificate: DonationCertificate;
  onClose: () => void;
}

export function CertificateModal({ certificate, onClose }: CertificateModalProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-bold">Donation Certificate</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            ✕
          </button>
        </div>

        {/* Certificate Content */}
        <div className="p-6 print:p-8" id="certificate">
          <div className="text-center border-4 border-double border-red-600 p-6 rounded-xl">
            {/* Logo */}
            <div className="text-4xl mb-2">🩸</div>
            <h1 className="text-2xl font-bold text-red-600 mb-1">BloodConnect Olongapo</h1>
            <p className="text-gray-500 text-sm mb-6">Certificate of Blood Donation</p>

            {/* Certificate Content */}
            <div className="mb-6">
              <p className="text-gray-600 mb-2">This is to certify that</p>
              <p className="text-2xl font-bold text-gray-800 mb-2">{certificate.donorName}</p>
              <p className="text-gray-600">
                has generously donated blood of type <span className="font-bold text-red-600">{certificate.bloodType}</span>
              </p>
            </div>

            {/* Details */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-sm">
              <div className="grid grid-cols-2 gap-2 text-left">
                <div className="text-gray-500">Date:</div>
                <div className="font-semibold">{format(new Date(certificate.date), 'MMMM d, yyyy')}</div>
                <div className="text-gray-500">Hospital:</div>
                <div className="font-semibold">{certificate.hospitalName}</div>
                <div className="text-gray-500">Certificate No:</div>
                <div className="font-semibold">{certificate.certificateNumber}</div>
              </div>
            </div>

            {/* Message */}
            <p className="text-gray-600 text-sm italic mb-4">
              "Your generous act of donating blood can save up to 3 lives. Thank you for being a hero!"
            </p>

            {/* Signature Line */}
            <div className="border-t border-gray-300 pt-4 mt-6">
              <div className="text-sm text-gray-500">Authorized Signature</div>
              <div className="font-semibold">BloodConnect Olongapo</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-gray-200 flex gap-2 print:hidden">
          <button
            onClick={handlePrint}
            className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
          >
            🖨️ Print Certificate
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

interface DonationStatsProps {
  totalDonations: number;
  totalUnits: number;
  livesSaved: number;
  lastDonation: string | null;
  nextEligibleDate: string | null;
  streak: number;
}

export function DonationStatsCard({ 
  totalDonations, 
  totalUnits, 
  livesSaved, 
  lastDonation, 
  nextEligibleDate,
  streak 
}: DonationStatsProps) {
  const isEligible = nextEligibleDate ? new Date(nextEligibleDate) <= new Date() : true;

  return (
    <div className="bg-gradient-to-br from-red-500 to-red-700 rounded-2xl shadow-lg p-6 text-white">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        📊 Your Impact
      </h2>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-3xl font-bold">{totalDonations}</div>
          <div className="text-red-200 text-sm">Donations</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold">{totalUnits}</div>
          <div className="text-red-200 text-sm">Units</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold">{livesSaved}</div>
          <div className="text-red-200 text-sm">Lives Saved</div>
        </div>
      </div>

      {/* Streak */}
      {streak > 1 && (
        <div className="bg-white/20 rounded-lg p-3 mb-4 text-center">
          <span className="text-2xl">🔥</span>
          <span className="ml-2 font-semibold">{streak} Donation Streak!</span>
        </div>
      )}

      {/* Eligibility */}
      <div className={`
        rounded-lg p-3 text-center
        ${isEligible ? 'bg-green-500/30' : 'bg-white/10'}
      `}>
        {isEligible ? (
          <>
            <span className="text-lg">✓</span>
            <span className="ml-2">You are eligible to donate!</span>
          </>
        ) : (
          <>
            <span className="text-lg">⏳</span>
            <span className="ml-2">Next eligible: {nextEligibleDate ? format(new Date(nextEligibleDate), 'MMM d, yyyy') : 'Unknown'}</span>
          </>
        )}
      </div>
    </div>
  );
}
