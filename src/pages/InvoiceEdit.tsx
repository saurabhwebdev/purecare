import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Invoice, getInvoice, updateInvoice, getInvoiceWithSettings } from '@/lib/firebase/invoiceService';
import { UserSettings } from '@/lib/firebase/settingsService';
import InvoiceForm from '@/components/invoice/InvoiceForm';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const InvoiceEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!id || !user) return;

      try {
        setLoading(true);
        const data = await getInvoiceWithSettings(user.uid, id);
        
        // Check if the invoice belongs to the current doctor
        if (data.invoice.doctorId !== user.uid) {
          setError('You do not have permission to edit this invoice');
          return;
        }
        
        // Check if the invoice can be edited
        if (data.invoice.status === 'paid' || data.invoice.status === 'cancelled') {
          setError(`This invoice cannot be edited because it is ${data.invoice.status.toLowerCase()}`);
          return;
        }
        
        setInvoice(data.invoice);
        setSettings(data.settings);
      } catch (error) {
        console.error('Error fetching invoice:', error);
        setError('Failed to load invoice details');
        toast({
          title: 'Error',
          description: 'Failed to load invoice details',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id, user, toast]);

  const handleSubmit = async (invoiceData: Partial<Invoice>) => {
    if (!user || !id) {
      toast({
        title: 'Error',
        description: 'Missing information. Please try again.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSubmitting(true);
      
      await updateInvoice(id, invoiceData);
      
      toast({
        title: 'Success',
        description: 'Invoice updated successfully',
      });
      
      navigate('/invoices');
    } catch (error) {
      console.error('Error updating invoice:', error);
      toast({
        title: 'Error',
        description: 'Failed to update invoice',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
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
                <h1 className="text-2xl font-bold">Edit Invoice</h1>
                {!loading && invoice && (
                  <p className="text-muted-foreground">
                    {`Editing invoice ${invoice.invoiceNumber} for ${invoice.patientName}`}
                  </p>
                )}
                {loading && (
                  <Skeleton className="h-5 w-52 mt-1" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-12 w-3/4" />
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            <div className="mt-4">
              <Button onClick={() => navigate('/invoices')}>
                Back to Invoices
              </Button>
            </div>
          </Alert>
        ) : invoice ? (
          <InvoiceForm 
            invoice={invoice}
            onSubmit={handleSubmit}
            isSubmitting={submitting}
            settings={settings}
          />
        ) : (
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <p className="mb-4">Invoice not found</p>
            <Button onClick={() => navigate('/invoices')}>Back to Invoices</Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default InvoiceEdit; 