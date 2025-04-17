import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PrescriptionForm from '@/components/prescription/PrescriptionForm';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const PrescriptionCreate = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  
  // Get patient info from URL parameters
  const patientId = searchParams.get('patientId');
  const patientName = searchParams.get('patientName');

  useEffect(() => {
    // If no patient info is provided, redirect to patients page to select a patient
    if (!patientId || !patientName) {
      navigate('/patients?selectForPrescription=true');
      return;
    }
    
    setLoading(false);
  }, [patientId, patientName, navigate]);

  return (
    <DashboardLayout>
      <div className="container p-4 mx-auto">
        {loading ? (
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
              <Skeleton className="h-10 w-10 mr-2" />
              <div>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
            <Skeleton className="h-[800px] w-full rounded-lg" />
          </div>
        ) : (
          <PrescriptionForm 
            mode="create"
            patientId={patientId || ''}
            patientName={patientName || ''}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default PrescriptionCreate; 