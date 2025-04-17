import React, { forwardRef } from 'react';
import { format } from 'date-fns';
import { Prescription } from '@/lib/firebase/prescriptionService';
import { UserSettings } from '@/lib/firebase/settingsService';

interface PrescriptionPDFProps {
  prescription: Prescription;
  settings: UserSettings;
}

const PrescriptionPDF = forwardRef<HTMLDivElement, PrescriptionPDFProps>(
  ({ prescription, settings }, ref) => {
    // Format date
    const formatDate = (date: Date | any) => {
      if (!date) return 'N/A';
      try {
        const dateObj = date instanceof Date ? date : date.toDate();
        return format(dateObj, settings.location.dateFormat === 'DD/MM/YYYY' ? 'dd/MM/yyyy' : 'MM/dd/yyyy');
      } catch (error) {
        return 'Invalid Date';
      }
    };

    return (
      <div ref={ref} className="prescription-pdf p-8 max-w-[800px] mx-auto bg-white text-gray-800">
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-blue-500 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-blue-700">{prescription.clinicInfo?.clinicName || settings.clinic.clinicName}</h1>
            <p className="text-sm text-gray-600">
              {prescription.clinicInfo?.clinicAddress || 
                `${settings.clinic.address}, ${settings.clinic.city}, ${settings.clinic.state} ${settings.clinic.zipCode}`}
            </p>
            <p className="text-sm text-gray-600">
              {prescription.clinicInfo?.clinicContact || 
                `Phone: ${settings.clinic.phone} | Email: ${settings.clinic.email}`}
            </p>
            {settings.clinic.website && (
              <p className="text-sm text-blue-600">Website: {settings.clinic.website}</p>
            )}
          </div>
          <div className="text-right">
            <div className="text-xl font-semibold text-blue-700">PRESCRIPTION</div>
            <p className="text-sm text-gray-600">Date: {formatDate(prescription.createdAt)}</p>
            {prescription.id && (
              <p className="text-sm text-gray-600">Ref: {prescription.id.substring(0, 8).toUpperCase()}</p>
            )}
          </div>
        </div>

        {/* Doctor & Patient Info */}
        <div className="grid grid-cols-2 gap-4 mt-6 mb-8">
          <div className="border-r pr-4">
            <h2 className="text-sm font-semibold uppercase text-gray-500">Doctor</h2>
            <p className="font-medium">{prescription.clinicInfo?.doctorName || "Dr. ..."}</p>
            <p className="text-sm text-gray-600">{prescription.clinicInfo?.doctorSpecialty || settings.clinic.specialty}</p>
            <p className="text-sm text-gray-600">License: {prescription.clinicInfo?.doctorLicense || settings.clinic.licenseNumber}</p>
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase text-gray-500">Patient</h2>
            <p className="font-medium">{prescription.patientName}</p>
            <p className="text-sm text-gray-600">Patient ID: {prescription.patientId}</p>
          </div>
        </div>

        {/* Diagnosis */}
        {prescription.diagnosis && (
          <div className="mb-6">
            <h2 className="text-md font-semibold text-blue-700 border-b border-gray-200 pb-1 mb-2">Diagnosis</h2>
            <p className="text-gray-800">{prescription.diagnosis}</p>
          </div>
        )}

        {/* Medications */}
        <div className="mb-6">
          <h2 className="text-md font-semibold text-blue-700 border-b border-gray-200 pb-1 mb-4">Medications</h2>
          
          {prescription.medicines.map((medicine, index) => (
            <div key={index} className="mb-4 pb-3 border-b border-gray-100 last:border-0">
              <div className="flex items-baseline">
                <span className="inline-block w-5 h-5 bg-blue-100 text-blue-700 rounded-full text-center mr-2 text-sm">
                  {index + 1}
                </span>
                <h3 className="font-semibold text-lg">{medicine.name}</h3>
              </div>
              <div className="ml-7 grid grid-cols-2 gap-2 mt-1">
                <p className="text-sm"><span className="text-gray-600">Dosage:</span> {medicine.dosage}</p>
                <p className="text-sm"><span className="text-gray-600">Frequency:</span> {medicine.frequency}</p>
                <p className="text-sm"><span className="text-gray-600">Duration:</span> {medicine.duration}</p>
              </div>
              {medicine.instructions && (
                <p className="ml-7 mt-1 text-sm text-gray-700">
                  <span className="text-gray-600">Instructions:</span> {medicine.instructions}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Notes */}
        {prescription.notes && (
          <div className="mb-8">
            <h2 className="text-md font-semibold text-blue-700 border-b border-gray-200 pb-1 mb-2">Additional Notes</h2>
            <p className="text-gray-800 whitespace-pre-line">{prescription.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-4 border-t border-gray-300">
          <div className="flex justify-between">
            <div className="text-xs text-gray-500">
              <p>This prescription is valid according to local regulations.</p>
              <p>Please consult your pharmacist for any questions regarding this prescription.</p>
            </div>
            <div className="text-right">
              <div className="h-16 border-b border-gray-400 mb-1 w-48"></div>
              <p className="text-sm font-medium">Physician's Signature</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

PrescriptionPDF.displayName = 'PrescriptionPDF';

export default PrescriptionPDF; 