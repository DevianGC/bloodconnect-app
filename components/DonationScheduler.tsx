'use client';

import React, { useState } from 'react';
import { format, addDays, startOfWeek, isSameDay, isToday, isBefore } from 'date-fns';
import { useAvailableSlots, useCreateAppointment } from '@/app/hooks/queries/useAppointments';
import { getAllHospitals } from '@/lib/db';
import type { TimeSlot } from '@/types/appointments';

interface DonationSchedulerProps {
  donorId: number | string;
  onScheduled?: (appointment: any) => void;
}

export default function DonationScheduler({ donorId, onScheduled }: DonationSchedulerProps) {
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loadingHospitals, setLoadingHospitals] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedHospital, setSelectedHospital] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [notes, setNotes] = useState('');
  const [step, setStep] = useState<'date' | 'time' | 'confirm'>('date');

  React.useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const data = await getAllHospitals();
        setHospitals(data);
        if (data.length > 0) {
          setSelectedHospital(data[0].id);
        }
      } catch (error) {
        console.error("Error fetching hospitals:", error);
      } finally {
        setLoadingHospitals(false);
      }
    };
    fetchHospitals();
  }, []);

  const dateString = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
  
  const { data: slots, isLoading: slotsLoading } = useAvailableSlots(dateString, selectedHospital);
  const createAppointment = useCreateAppointment();

  // Generate next 14 days
  const today = new Date();
  const dates = Array.from({ length: 14 }, (_, i) => addDays(today, i));

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setStep('time');
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    if (slot.available) {
      setSelectedSlot(slot);
      setStep('confirm');
    }
  };

  const handleConfirm = async () => {
    if (!selectedDate || !selectedSlot) return;

    try {
      const result = await createAppointment.mutateAsync({
        donorId,
        hospitalId: selectedHospital,
        date: dateString,
        timeSlot: `${selectedSlot.time}-${selectedSlot.endTime}`,
        notes,
      });
      
      onScheduled?.(result);
    } catch (error) {
      console.error('Failed to schedule appointment:', error);
    }
  };

  const selectedHospitalData = hospitals.find(h => h.id === selectedHospital);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        📅 Schedule Blood Donation
      </h2>

      {/* Progress Steps */}
      <div className="flex items-center gap-2 mb-6">
        {['date', 'time', 'confirm'].map((s, i) => (
          <React.Fragment key={s}>
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm
              ${step === s ? 'bg-red-600 text-white' : 
                ['date', 'time', 'confirm'].indexOf(step) > i ? 'bg-green-500 text-white' : 
                'bg-gray-200 text-gray-500'}
            `}>
              {['date', 'time', 'confirm'].indexOf(step) > i ? '✓' : i + 1}
            </div>
            {i < 2 && <div className="flex-1 h-1 bg-gray-200 rounded" />}
          </React.Fragment>
        ))}
      </div>

      {/* Hospital Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Hospital
        </label>
        <select
          value={selectedHospital}
          onChange={(e) => {
            setSelectedHospital(e.target.value);
            setSelectedSlot(null);
          }}
          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
          disabled={loadingHospitals}
        >
          {loadingHospitals ? (
            <option>Loading hospitals...</option>
          ) : (
            hospitals.map(hospital => (
              <option key={hospital.id} value={hospital.id}>
                {hospital.name}
              </option>
            ))
          )}
        </select>
        {selectedHospitalData && (
          <p className="text-sm text-gray-500 mt-1">
            📍 {selectedHospitalData.address} | 📞 {selectedHospitalData.contact}
          </p>
        )}
      </div>

      {/* Step 1: Date Selection */}
      {step === 'date' && (
        <div>
          <h3 className="font-semibold text-gray-700 mb-3">Select a Date</h3>
          <div className="grid grid-cols-7 gap-2">
            {dates.map((date) => {
              const dayName = format(date, 'EEE');
              const isValidDay = selectedHospitalData?.donationDays?.includes(format(date, 'EEEE'));
              const isPast = isBefore(date, today) && !isToday(date);
              
              return (
                <button
                  key={date.toISOString()}
                  onClick={() => isValidDay && !isPast && handleDateSelect(date)}
                  disabled={!isValidDay || isPast}
                  className={`
                    p-3 rounded-xl text-center transition-all
                    ${selectedDate && isSameDay(date, selectedDate) 
                      ? 'bg-red-600 text-white' 
                      : isValidDay && !isPast
                        ? 'bg-gray-100 hover:bg-red-100 hover:text-red-600' 
                        : 'bg-gray-50 text-gray-300 cursor-not-allowed'
                    }
                    ${isToday(date) ? 'ring-2 ring-red-300' : ''}
                  `}
                >
                  <div className="text-xs font-medium">{dayName}</div>
                  <div className="text-lg font-bold">{format(date, 'd')}</div>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            💡 {selectedHospitalData?.name} accepts donations on: {selectedHospitalData?.donationDays?.join(', ')}
          </p>
        </div>
      )}

      {/* Step 2: Time Selection */}
      {step === 'time' && selectedDate && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-700">
              Select Time for {format(selectedDate, 'MMMM d, yyyy')}
            </h3>
            <button 
              onClick={() => setStep('date')}
              className="text-sm text-red-600 hover:underline"
            >
              ← Change Date
            </button>
          </div>
          
          {slotsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading available slots...</p>
            </div>
          ) : slots && slots.length > 0 ? (
            <div className="grid grid-cols-4 gap-2">
              {slots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => handleSlotSelect(slot)}
                  disabled={!slot.available}
                  className={`
                    p-3 rounded-xl text-center transition-all
                    ${selectedSlot?.id === slot.id 
                      ? 'bg-red-600 text-white' 
                      : slot.available
                        ? 'bg-gray-100 hover:bg-red-100 hover:text-red-600' 
                        : 'bg-gray-50 text-gray-300 cursor-not-allowed line-through'
                    }
                  `}
                >
                  <div className="font-semibold">{slot.time}</div>
                  <div className="text-xs">
                    {slot.available 
                      ? `${slot.capacity - slot.booked} left` 
                      : 'Full'}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No available slots for this date
            </div>
          )}
        </div>
      )}

      {/* Step 3: Confirmation */}
      {step === 'confirm' && selectedDate && selectedSlot && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-700">Confirm Appointment</h3>
            <button 
              onClick={() => setStep('time')}
              className="text-sm text-red-600 hover:underline"
            >
              ← Change Time
            </button>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Hospital:</span>
                <span className="font-semibold">{selectedHospitalData?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date:</span>
                <span className="font-semibold">{format(selectedDate, 'MMMM d, yyyy')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Time:</span>
                <span className="font-semibold">{selectedSlot.time} - {selectedSlot.endTime}</span>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special notes for the hospital..."
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
              rows={2}
            />
          </div>

          <button
            onClick={handleConfirm}
            disabled={createAppointment.isPending}
            className="w-full py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors disabled:bg-gray-400"
          >
            {createAppointment.isPending ? 'Scheduling...' : '✓ Confirm Appointment'}
          </button>

          {createAppointment.isError && (
            <p className="text-red-600 text-sm mt-2">
              Failed to schedule. Please try again.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
