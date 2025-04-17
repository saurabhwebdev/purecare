import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth/AuthContext';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  Invoice, 
  getInvoiceWithSettings,
  updateInvoiceStatus
} from '@/lib/firebase/invoiceService';
import { UserSettings } from '@/lib/firebase/settingsService';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  ArrowLeft, 
  FileText, 
  Edit,
  Clock,
  Calendar,
  User,
  FileCheck,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Clock2
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import InvoicePDF from '@/components/invoice/InvoicePDF';
import { generateInvoicePDF, downloadBlob } from '@/lib/pdf/pdfGenerator';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const InvoiceView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentDate, setPaymentDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!id || !user) return;

      try {
        setLoading(true);
        const data = await getInvoiceWithSettings(user.uid, id);
        
        // Check if the invoice belongs to the current doctor
        if (data.invoice.doctorId !== user.uid) {
          setError('You do not have permission to view this invoice');
          return;
        }
        
        setInvoice(data.invoice);
        setSettings(data.settings);
      } catch (error) {
        console.error('Error fetching invoice:', error);
        setError('Failed to load invoice');
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

  // Format date
  const formatDate = (date: Date | any) => {
    if (!date) return 'N/A';
    try {
      if (typeof date === 'string') {
        return format(new Date(date), 'MMMM dd, yyyy');
      }
      const dateObj = date instanceof Date ? date : date.toDate();
      return format(dateObj, 'MMMM dd, yyyy');
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    if (!settings) return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: settings.financial.currency || 'USD',
    }).format(amount);
  };

  // Handle editing the invoice
  const handleEdit = () => {
    if (invoice?.id) {
      navigate(`/invoices/edit/${invoice.id}`);
    }
  };

  // Handle going back to invoices list
  const handleBackToList = () => {
    navigate('/invoices');
  };

  // Generate and download PDF
  const handleDownloadPDF = async () => {
    if (!pdfRef.current || !invoice) return;
    
    setGeneratingPDF(true);
    
    try {
      const { blob, filename } = await generateInvoicePDF(pdfRef.current, invoice);
      downloadBlob(blob, filename);
      
      toast({
        title: 'Success',
        description: 'Invoice PDF downloaded successfully.',
      });
      
      setShowPDFPreview(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate invoice PDF.',
        variant: 'destructive',
      });
    } finally {
      setGeneratingPDF(false);
    }
  };

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">DRAFT</Badge>;
      case 'sent':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">SENT</Badge>;
      case 'paid':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">PAID</Badge>;
      case 'overdue':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">OVERDUE</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">CANCELLED</Badge>;
      default:
        return <Badge variant="outline">{status.toUpperCase()}</Badge>;
    }
  };

  // Handle marking invoice as paid
  const handleMarkAsPaid = () => {
    setShowPaymentDialog(true);
  };

  // Confirm payment
  const confirmPayment = async () => {
    if (!invoice?.id || !user) return;

    try {
      setLoading(true);
      
      await updateInvoiceStatus(invoice.id, 'paid', paymentMethod, paymentDate);
      
      // Update local state
      setInvoice({
        ...invoice,
        status: 'paid',
        paymentMethod,
        paymentDate
      });
      
      toast({
        title: 'Success',
        description: 'Invoice marked as paid successfully.',
      });
      
      setShowPaymentDialog(false);
    } catch (error) {
      console.error('Error marking invoice as paid:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark invoice as paid.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle marking invoice as sent
  const handleMarkAsSent = async () => {
    if (!invoice?.id || !user) return;

    try {
      setLoading(true);
      
      await updateInvoiceStatus(invoice.id, 'sent');
      
      // Update local state
      setInvoice({
        ...invoice,
        status: 'sent'
      });
      
      toast({
        title: 'Success',
        description: 'Invoice marked as sent successfully.',
      });
    } catch (error) {
      console.error('Error marking invoice as sent:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark invoice as sent.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle marking invoice as overdue
  const handleMarkAsOverdue = async () => {
    if (!invoice?.id || !user) return;

    try {
      setLoading(true);
      
      await updateInvoiceStatus(invoice.id, 'overdue');
      
      // Update local state
      setInvoice({
        ...invoice,
        status: 'overdue'
      });
      
      toast({
        title: 'Success',
        description: 'Invoice marked as overdue successfully.',
      });
    } catch (error) {
      console.error('Error marking invoice as overdue:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark invoice as overdue.',
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
                onClick={handleBackToList}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">
                  {loading ? 'Loading Invoice...' : 
                    invoice ? `Invoice #${invoice.invoiceNumber}` : 
                    'Invoice Details'}
                </h1>
                <p className="text-muted-foreground">
                  {loading ? 'Loading details...' : 
                    error ? 'Error loading invoice' : 
                    invoice ? `${invoice.patientName} - ${formatDate(invoice.createdAt)}` : 
                    'Invoice not found'}
                </p>
              </div>
            </div>
            {invoice && !error && !loading && (
              <div className="flex items-center gap-2 flex-wrap">
                {invoice.status === 'draft' && (
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-1"
                    onClick={handleMarkAsSent}
                  >
                    <Clock className="h-4 w-4" />
                    <span>Mark as Sent</span>
                  </Button>
                )}
                
                {(invoice.status === 'draft' || invoice.status === 'sent') && (
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-1"
                    onClick={handleMarkAsPaid}
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Mark as Paid</span>
                  </Button>
                )}
                
                {invoice.status === 'sent' && (
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-1"
                    onClick={handleMarkAsOverdue}
                  >
                    <AlertCircle className="h-4 w-4" />
                    <span>Mark as Overdue</span>
                  </Button>
                )}
                
                {invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-1"
                    onClick={handleEdit}
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </Button>
                )}
                
                <Button 
                  className="flex items-center gap-1"
                  onClick={() => setShowPDFPreview(true)}
                >
                  <FileText className="h-4 w-4" />
                  <span>Generate PDF</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <Skeleton className="h-32 rounded-lg" />
              <Skeleton className="h-32 rounded-lg" />
              <Skeleton className="h-32 rounded-lg" />
            </div>
            <Skeleton className="h-64 rounded-lg" />
            <Skeleton className="h-96 rounded-lg" />
          </div>
        ) : error ? (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            <div className="mt-4">
              <Button onClick={handleBackToList}>
                Back to Invoices
              </Button>
            </div>
          </Alert>
        ) : invoice && settings ? (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="bg-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    Invoice Info
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-sm text-muted-foreground">Invoice Date:</p>
                      <p className="text-sm font-medium">{formatDate(invoice.createdAt)}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-muted-foreground">Due Date:</p>
                      <p className="text-sm font-medium">{formatDate(invoice.dueDate)}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-muted-foreground">Status:</p>
                      <div>{getStatusBadge(invoice.status)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    Patient
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-medium">{invoice.patientName}</p>
                  <p className="text-sm text-muted-foreground">ID: {invoice.patientId}</p>
                </CardContent>
              </Card>
              
              <Card className="bg-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    Payment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-sm text-muted-foreground">Total:</p>
                      <p className="text-lg font-bold">{formatCurrency(invoice.total)}</p>
                    </div>
                    {invoice.status === 'paid' && (
                      <>
                        <div className="flex justify-between">
                          <p className="text-sm text-muted-foreground">Payment Method:</p>
                          <p className="text-sm">{invoice.paymentMethod}</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-sm text-muted-foreground">Paid On:</p>
                          <p className="text-sm">{formatDate(invoice.paymentDate || '')}</p>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Invoice Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2 text-left font-medium">Description</th>
                        <th className="py-2 text-right font-medium">Quantity</th>
                        <th className="py-2 text-right font-medium">Rate</th>
                        <th className="py-2 text-right font-medium">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.items.map((item, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-3">{item.description}</td>
                          <td className="py-3 text-right">{item.quantity}</td>
                          <td className="py-3 text-right">{formatCurrency(item.rate)}</td>
                          <td className="py-3 text-right">{formatCurrency(item.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="flex flex-col items-end mt-6">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span>{formatCurrency(invoice.subtotal)}</span>
                    </div>
                    
                    {invoice.tax > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax:</span>
                        <span>{formatCurrency(invoice.tax)}</span>
                      </div>
                    )}
                    
                    {invoice.discount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Discount:</span>
                        <span>-{formatCurrency(invoice.discount)}</span>
                      </div>
                    )}
                    
                    <Separator />
                    
                    <div className="flex justify-between pt-2">
                      <span className="font-bold">Total:</span>
                      <span className="font-bold">{formatCurrency(invoice.total)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {invoice.notes && (
              <Card className="bg-card">
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line">{invoice.notes}</p>
                </CardContent>
              </Card>
            )}

            <Card className="bg-card">
              <CardHeader>
                <CardTitle>Clinic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>
                  <span className="font-medium">Clinic:</span> {invoice.clinicInfo?.clinicName || settings.clinic.clinicName}
                </p>
                <p>
                  <span className="font-medium">Address:</span> {invoice.clinicInfo?.clinicAddress || 
                    `${settings.clinic.address}, ${settings.clinic.city}, ${settings.clinic.state} ${settings.clinic.zipCode}`}
                </p>
                <p>
                  <span className="font-medium">Contact:</span> {invoice.clinicInfo?.clinicContact || 
                    `Phone: ${settings.clinic.phone} | Email: ${settings.clinic.email}`}
                </p>
                {(invoice.clinicInfo?.taxId || settings.clinic.taxId) && (
                  <p>
                    <span className="font-medium">Tax ID:</span> {invoice.clinicInfo?.taxId || settings.clinic.taxId}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex flex-col items-center justify-center text-center">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Invoice Not Found</h2>
              <p className="text-muted-foreground mb-6">
                The invoice you're trying to view could not be found or may have been deleted.
              </p>
              <Button onClick={handleBackToList}>
                Back to Invoices
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>
              Record payment details for invoice {invoice?.invoiceNumber}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="flex justify-between mb-2">
                <span>Total Amount:</span>
                <span className="font-semibold">
                  {invoice ? formatCurrency(invoice.total) : '$0.00'}
                </span>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="payment-method" className="text-sm font-medium">
                  Payment Method
                </label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    {settings?.financial.paymentMethods.creditCard && (
                      <SelectItem value="Credit Card">Credit Card</SelectItem>
                    )}
                    {settings?.financial.paymentMethods.cash && (
                      <SelectItem value="Cash">Cash</SelectItem>
                    )}
                    {settings?.financial.paymentMethods.bankTransfer && (
                      <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    )}
                    {settings?.financial.paymentMethods.insurance && (
                      <SelectItem value="Insurance">Insurance</SelectItem>
                    )}
                    <SelectItem value="Check">Check</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="payment-date" className="text-sm font-medium">
                  Payment Date
                </label>
                <Input
                  id="payment-date"
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowPaymentDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={confirmPayment}
              disabled={!paymentMethod}
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Record Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* PDF Preview Dialog */}
      <Dialog open={showPDFPreview} onOpenChange={setShowPDFPreview}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>Invoice Preview</DialogTitle>
            <DialogDescription>
              Review the invoice PDF before downloading.
            </DialogDescription>
          </DialogHeader>
          
          <div className="border rounded-lg overflow-auto max-h-[70vh]">
            {invoice && settings ? (
              <InvoicePDF 
                ref={pdfRef} 
                invoice={invoice} 
                settings={settings} 
              />
            ) : (
              <div className="p-8 text-center">
                <Skeleton className="h-40 w-full mb-4" />
                <Skeleton className="h-10 w-3/4 mx-auto mb-2" />
                <Skeleton className="h-10 w-1/2 mx-auto" />
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowPDFPreview(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDownloadPDF} 
              disabled={generatingPDF}
            >
              {generatingPDF ? 'Generating PDF...' : 'Download PDF'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default InvoiceView; 