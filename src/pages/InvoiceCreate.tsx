import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/lib/auth/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Invoice, createInvoice } from '@/lib/firebase/invoiceService';
import { getPatient } from '@/lib/firebase/patientService';
import InvoiceForm from '@/components/invoice/InvoiceForm';

const InvoiceCreate = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [patientId, setPatientId] = useState<string | null>(null);
  const [patientName, setPatientName] = useState<string | null>(null);

  // Check for patientId and patientName in URL params
  useEffect(() => {
    const paramPatientId = searchParams.get('patientId');
    const paramPatientName = searchParams.get('patientName');

    if (paramPatientId) {
      setPatientId(paramPatientId);
    }

    if (paramPatientName) {
      setPatientName(paramPatientName);
    }

    // If patientId exists but no patientName, fetch patient details
    if (paramPatientId && !paramPatientName && user) {
      const fetchPatient = async () => {
        try {
          const patientData = await getPatient(user.uid, paramPatientId);
          if (patientData) {
            setPatientName(patientData.name);
          }
        } catch (error) {
          console.error('Error fetching patient:', error);
        }
      };

      fetchPatient();
    }

    // If no patientId provided, redirect to patient selection
    if (!paramPatientId) {
      navigate('/patients?selectForInvoice=true');
    }
  }, [searchParams, user, navigate]);

  const handleSubmit = async (invoiceData: Partial<Invoice>) => {
    if (!user || !patientId || !patientName) {
      toast({
        title: 'Error',
        description: 'Missing patient information. Please select a patient first.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      
      // Add patient details to invoice data
      const completeInvoiceData = {
        ...invoiceData,
        patientId,
        patientName,
        doctorId: user.uid,
      };
      
      // Create invoice
      await createInvoice(user.uid, completeInvoiceData as Omit<Invoice, 'id' | 'createdAt' | 'updatedAt' | 'clinicInfo' | 'invoiceNumber'>);
      
      toast({
        title: 'Success',
        description: 'Invoice created successfully',
      });
      
      // Navigate to invoices list
      navigate('/invoices');
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast({
        title: 'Error',
        description: 'Failed to create invoice',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="w-full backdrop-blur-md bg-background/80 py-4 border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigate('/invoices')}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Create New Invoice</h1>
                <p className="text-muted-foreground">
                  {patientName 
                    ? `Create an invoice for ${patientName}` 
                    : 'Loading patient information...'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {!patientId ? (
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <p className="mb-4">Redirecting to patient selection...</p>
          </div>
        ) : (
          <InvoiceForm 
            isCreating={true}
            patientId={patientId}
            patientName={patientName || ''}
            onSubmit={handleSubmit}
            isSubmitting={loading}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default InvoiceCreate; 