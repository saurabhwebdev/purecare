import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth/AuthContext';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PrescriptionForm from '@/components/prescription/PrescriptionForm';
import { Prescription, getPrescription } from '@/lib/firebase/prescriptionService';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const PrescriptionEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrescription = async () => {
      if (!id || !user) return;

      try {
        setLoading(true);
        const data = await getPrescription(id);
        
        // Check if the prescription belongs to the current doctor
        if (data.doctorId !== user.uid) {
          setError('You do not have permission to edit this prescription');
          return;
        }
        
        setPrescription(data);
      } catch (error) {
        console.error('Error fetching prescription:', error);
        setError('Failed to load prescription');
        toast({
          title: 'Error',
          description: 'Failed to load prescription details',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPrescription();
  }, [id, user, toast]);

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
        ) : error ? (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex items-center">
              <Button
                variant="outline"
                size="icon"
                className="mr-2"
                onClick={() => navigate('/prescriptions')}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Error</h1>
                <p className="text-gray-500">There was a problem loading the prescription</p>
              </div>
            </div>
            
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            
            <div className="mt-6">
              <Button onClick={() => navigate('/prescriptions')}>
                Back to Prescriptions
              </Button>
            </div>
          </div>
        ) : prescription ? (
          <PrescriptionForm 
            mode="edit"
            prescription={prescription}
          />
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex items-center">
              <Button
                variant="outline"
                size="icon"
                className="mr-2"
                onClick={() => navigate('/prescriptions')}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Prescription Not Found</h1>
                <p className="text-gray-500">The prescription you're looking for doesn't exist</p>
              </div>
            </div>
            
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Not Found</AlertTitle>
              <AlertDescription>
                The prescription you're trying to edit could not be found or may have been deleted.
              </AlertDescription>
            </Alert>
            
            <div className="mt-6">
              <Button onClick={() => navigate('/prescriptions')}>
                Back to Prescriptions
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PrescriptionEdit; 