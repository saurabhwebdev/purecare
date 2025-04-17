import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth/AuthContext';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Invoice, 
  getAllInvoices, 
  deleteInvoice, 
  getInvoiceWithSettings,
  updateInvoiceStatus,
  createInvoice
} from '@/lib/firebase/invoiceService';
import { getUserSettings, UserSettings } from '@/lib/firebase/settingsService';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { format } from 'date-fns';
import { 
  Plus, 
  Search, 
  Trash2, 
  MoreVertical, 
  FileText, 
  Edit, 
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  DollarSign,
  CreditCard,
  Calendar,
  PlusCircle,
  User
} from 'lucide-react';

import InvoicePDF from '@/components/invoice/InvoicePDF';
import { generateInvoicePDF, downloadBlob } from '@/lib/pdf/pdfGenerator';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { getPatients } from '@/lib/firebase/patientService';

const Invoices = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null);
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentDate, setPaymentDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  
  // New state for invoice creation
  const [isAddInvoiceOpen, setIsAddInvoiceOpen] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);
  const [newInvoice, setNewInvoice] = useState<Partial<Invoice>>({
    patientId: '',
    patientName: '',
    doctorId: '',
    invoiceNumber: 'INV-',  // Will be updated by generateInvoiceNumber
    dueDate: format(new Date(new Date().setDate(new Date().getDate() + 30)), 'yyyy-MM-dd'),
    items: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
    subtotal: 0,
    tax: 0,
    discount: 0,
    total: 0,
    notes: '',
    status: 'draft'
  });
  
  const pdfRef = useRef<HTMLDivElement>(null);

  // Fetch invoices and patients from Firestore
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const [invoiceData, patientData, userSettings] = await Promise.all([
          getAllInvoices(user.uid),
          getPatients(user.uid),
          getUserSettings(user.uid)
        ]);
        
        setInvoices(invoiceData);
        setFilteredInvoices(invoiceData);
        setPatients(patientData);
        setSettings(userSettings);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load data.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, toast]);

  // Filter invoices based on search query and status filter
  useEffect(() => {
    let filtered = [...invoices];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(invoice => invoice.status === statusFilter);
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(invoice => 
        invoice.patientName.toLowerCase().includes(lowerCaseQuery) ||
        invoice.invoiceNumber.toLowerCase().includes(lowerCaseQuery)
      );
    }

    setFilteredInvoices(filtered);
  }, [searchQuery, statusFilter, invoices]);

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

  // Format date
  const formatDate = (date: Date | any) => {
    if (!date) return 'N/A';
    try {
      const dateObj = date instanceof Date ? date : date.toDate();
      return format(dateObj, 'MMM dd, yyyy');
    } catch (error) {
      return 'Invalid Date';
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

  // Generate a standard invoice number format
  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear().toString().substring(2, 4);
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const prefix = settings?.financial.invoicePrefix || 'INV-';
    return `${prefix}${year}${month}-${randomNum}`;
  };

  // Update new invoice field
  const updateInvoiceField = (field: string, value: any) => {
    setNewInvoice(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle patient selection for new invoice
  const handlePatientSelection = (patientId: string) => {
    const selectedPatient = patients.find(patient => patient.id === patientId);
    if (selectedPatient) {
      updateInvoiceField('patientId', patientId);
      updateInvoiceField('patientName', selectedPatient.name);
    }
  };

  // Add invoice item
  const addInvoiceItem = () => {
    setNewInvoice(prev => ({
      ...prev,
      items: [...(prev.items || []), { description: '', quantity: 1, rate: 0, amount: 0 }]
    }));
  };

  // Remove invoice item
  const removeInvoiceItem = (index: number) => {
    setNewInvoice(prev => {
      const items = [...(prev.items || [])];
      if (items.length > 1) {
        items.splice(index, 1);
        return { ...prev, items };
      }
      return prev;
    });
  };

  // Update invoice item
  const updateInvoiceItem = (index: number, field: string, value: any) => {
    setNewInvoice(prev => {
      const items = [...(prev.items || [])];
      items[index] = { ...items[index], [field]: value };
      
      // Calculate amount
      if (field === 'quantity' || field === 'rate') {
        items[index].amount = items[index].quantity * items[index].rate;
      }
      
      // Calculate subtotal
      const subtotal = items.reduce((sum, item) => sum + (item.amount || 0), 0);
      
      // Calculate tax based on settings if available
      let tax = prev.tax || 0;
      if (settings?.financial.taxRate) {
        const taxRate = parseFloat(settings.financial.taxRate);
        if (!isNaN(taxRate) && taxRate > 0) {
          tax = parseFloat((subtotal * (taxRate / 100)).toFixed(2));
        }
      }
      
      // Calculate total
      const total = subtotal + tax - (prev.discount || 0);
      
      return { 
        ...prev, 
        items,
        subtotal,
        tax,
        total
      };
    });
  };

  // Handle creating a new invoice
  const handleCreateInvoice = async () => {
    if (!user || !newInvoice.patientId || !newInvoice.patientName) {
      toast({
        title: 'Error',
        description: 'Please select a patient.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      
      // Add user ID
      const invoiceWithUserId = {
        ...newInvoice,
        doctorId: user.uid
      };
      
      // Create invoice
      await createInvoice(user.uid, invoiceWithUserId as Omit<Invoice, 'id' | 'createdAt' | 'updatedAt' | 'clinicInfo' | 'invoiceNumber'>);
      
      // Refresh invoices
      const updatedInvoices = await getAllInvoices(user.uid);
      setInvoices(updatedInvoices);
      setFilteredInvoices(updatedInvoices);
      
      toast({
        title: 'Success',
        description: 'Invoice created successfully',
      });
      
      // Reset form and close dialog
      setNewInvoice({
        patientId: '',
        patientName: '',
        doctorId: '',
        invoiceNumber: generateInvoiceNumber(),
        dueDate: format(new Date(new Date().setDate(new Date().getDate() + 30)), 'yyyy-MM-dd'),
        items: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
        subtotal: 0,
        tax: 0,
        discount: 0,
        total: 0,
        notes: '',
        status: 'draft'
      });
      setIsAddInvoiceOpen(false);
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

  // Handle editing an invoice
  const handleEditInvoice = (id: string) => {
    navigate(`/invoices/edit/${id}`);
  };

  // Handle viewing an invoice
  const handleViewInvoice = (id: string) => {
    navigate(`/invoices/view/${id}`);
  };

  // Handle deleting an invoice
  const handleDeleteClick = (id: string) => {
    setInvoiceToDelete(id);
    setShowDeleteDialog(true);
  };

  // Confirm deletion
  const confirmDelete = async () => {
    if (!invoiceToDelete) return;

    try {
      await deleteInvoice(invoiceToDelete);
      
      // Update local state
      setInvoices(prev => prev.filter(p => p.id !== invoiceToDelete));
      
      toast({
        title: 'Success',
        description: 'Invoice deleted successfully.',
      });
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete invoice.',
        variant: 'destructive',
      });
    } finally {
      setShowDeleteDialog(false);
      setInvoiceToDelete(null);
    }
  };

  // Handle showing PDF preview
  const handleShowPDF = async (invoice: Invoice) => {
    if (!user) return;
    
    try {
      const { settings, invoice: invoiceData } = await getInvoiceWithSettings(user.uid, invoice.id!);
      
      setSelectedInvoice(invoiceData);
      setSettings(settings);
      setShowPDFPreview(true);
    } catch (error) {
      console.error('Error loading invoice data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load invoice data for PDF.',
        variant: 'destructive',
      });
    }
  };

  // Generate and download PDF
  const handleDownloadPDF = async () => {
    if (!pdfRef.current || !selectedInvoice) return;
    
    setGeneratingPDF(true);
    
    try {
      const { blob, filename } = await generateInvoicePDF(pdfRef.current, selectedInvoice);
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

  // Handle marking an invoice as paid
  const handleMarkAsPaid = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowPaymentDialog(true);
  };

  // Confirm payment
  const confirmPayment = async () => {
    if (!selectedInvoice?.id || !user) return;

    try {
      setLoading(true);
      
      await updateInvoiceStatus(selectedInvoice.id, 'paid', paymentMethod, paymentDate);
      
      // Update local state
      setInvoices(prevInvoices => 
        prevInvoices.map(invoice => 
          invoice.id === selectedInvoice.id 
            ? { 
                ...invoice, 
                status: 'paid',
                paymentMethod,
                paymentDate
              } 
            : invoice
        )
      );
      
      toast({
        title: 'Success',
        description: 'Invoice marked as paid successfully.',
      });
      
      setShowPaymentDialog(false);
      setSelectedInvoice(null);
      setPaymentMethod('');
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
  const handleMarkAsSent = async (id: string) => {
    if (!user) return;

    try {
      setLoading(true);
      
      await updateInvoiceStatus(id, 'sent');
      
      // Update local state
      setInvoices(prevInvoices => 
        prevInvoices.map(invoice => 
          invoice.id === id 
            ? { ...invoice, status: 'sent' } 
            : invoice
        )
      );
      
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
  const handleMarkAsOverdue = async (id: string) => {
    if (!user) return;

    try {
      setLoading(true);
      
      await updateInvoiceStatus(id, 'overdue');
      
      // Update local state
      setInvoices(prevInvoices => 
        prevInvoices.map(invoice => 
          invoice.id === id 
            ? { ...invoice, status: 'overdue' } 
            : invoice
        )
      );
      
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

  // Define the useEffect for updating the newInvoice when settings change
  useEffect(() => {
    if (settings) {
      // Update the newInvoice with the generated invoice number and tax calculations
      setNewInvoice(prev => {
        const updatedInvoice = { ...prev };
        
        // Set the invoice number with the prefix from settings
        updatedInvoice.invoiceNumber = generateInvoiceNumber();
        
        // If there's a tax rate in settings and tax hasn't been modified, calculate it
        if (settings.financial.taxRate && (!prev.tax || prev.tax === 0)) {
          const taxRate = parseFloat(settings.financial.taxRate);
          if (!isNaN(taxRate) && taxRate > 0) {
            const taxAmount = (prev.subtotal || 0) * (taxRate / 100);
            updatedInvoice.tax = parseFloat(taxAmount.toFixed(2));
            updatedInvoice.total = (prev.subtotal || 0) + taxAmount - (prev.discount || 0);
          }
        }
        
        return updatedInvoice;
      });
    }
  }, [settings]);

  return (
    <DashboardLayout>
      <div className="w-full backdrop-blur-md bg-background/80 py-4 border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Invoices</h1>
              <p className="text-muted-foreground">Manage patient invoices and payments</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search invoices..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Dialog open={isAddInvoiceOpen} onOpenChange={setIsAddInvoiceOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-1 whitespace-nowrap">
                    <PlusCircle className="h-4 w-4" />
                    <span className="hidden sm:inline">New Invoice</span>
                    <span className="sm:hidden">New</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Invoice</DialogTitle>
                    <DialogDescription>
                      Fill in the details to create a new invoice.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="patient">Patient</Label>
                        <Select onValueChange={handlePatientSelection}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a patient" />
                          </SelectTrigger>
                          <SelectContent>
                            {patients.map((patient) => (
                              <SelectItem key={patient.id} value={patient.id || ''}>
                                {patient.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="dueDate">Due Date</Label>
                        <Input
                          id="dueDate"
                          type="date"
                          value={newInvoice.dueDate}
                          onChange={(e) => updateInvoiceField('dueDate', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Invoice Items</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addInvoiceItem}
                          className="h-8 px-2"
                        >
                          <Plus className="h-3.5 w-3.5 mr-1" />
                          Add Item
                        </Button>
                      </div>
                      
                      {newInvoice.items?.map((item, index) => (
                        <div key={index} className="grid gap-4 grid-cols-12 items-end">
                          <div className="col-span-6 md:col-span-6">
                            <Label htmlFor={`item-${index}-description`}>Description</Label>
                            <Input
                              id={`item-${index}-description`}
                              value={item.description}
                              onChange={(e) => updateInvoiceItem(index, 'description', e.target.value)}
                              placeholder="Item description"
                            />
                          </div>
                          <div className="col-span-2 md:col-span-2">
                            <Label htmlFor={`item-${index}-quantity`}>Qty</Label>
                            <Input
                              id={`item-${index}-quantity`}
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateInvoiceItem(index, 'quantity', parseInt(e.target.value) || 0)}
                            />
                          </div>
                          <div className="col-span-2 md:col-span-2">
                            <Label htmlFor={`item-${index}-rate`}>Rate</Label>
                            <Input
                              id={`item-${index}-rate`}
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.rate}
                              onChange={(e) => updateInvoiceItem(index, 'rate', parseFloat(e.target.value) || 0)}
                              placeholder={settings?.financial.currencySymbol ? `${settings.financial.currencySymbol}0.00` : "$0.00"}
                            />
                          </div>
                          <div className="col-span-1 md:col-span-1">
                            <Label htmlFor={`item-${index}-amount`}>Amount</Label>
                            <div className="h-10 flex items-center font-medium">
                              {settings ? formatCurrency(item.amount || 0) : `$${(item.amount || 0).toFixed(2)}`}
                            </div>
                          </div>
                          <div className="col-span-1 md:col-span-1 flex justify-end">
                            {newInvoice.items && newInvoice.items.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeInvoiceItem(index)}
                                className="h-8 w-8"
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                          id="notes"
                          value={newInvoice.notes}
                          onChange={(e) => updateInvoiceField('notes', e.target.value)}
                          placeholder="Additional notes for the invoice"
                          className="min-h-[100px]"
                        />
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>Subtotal:</span>
                          <span>{settings ? formatCurrency(newInvoice.subtotal || 0) : `$${(newInvoice.subtotal || 0).toFixed(2)}`}</span>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="tax">Tax {settings?.financial.taxRate ? `(${settings.financial.taxRate}%)` : ''}</Label>
                          <Input
                            id="tax"
                            type="number"
                            min="0"
                            step="0.01"
                            value={newInvoice.tax}
                            onChange={(e) => updateInvoiceField('tax', parseFloat(e.target.value) || 0)}
                            placeholder={settings?.financial.taxRate ? `Default: ${settings.financial.taxRate}%` : "Enter tax amount"}
                            className="w-full"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="discount">
                            Discount
                            {newInvoice.discount > 0 && newInvoice.subtotal > 0 && (
                              <span className="ml-1 text-xs text-muted-foreground">
                                ({((newInvoice.discount / newInvoice.subtotal) * 100).toFixed(1)}%)
                              </span>
                            )}
                          </Label>
                          <Input
                            id="discount"
                            type="number"
                            min="0"
                            step="0.01"
                            value={newInvoice.discount}
                            onChange={(e) => updateInvoiceField('discount', parseFloat(e.target.value) || 0)}
                            placeholder={settings?.financial.currencySymbol ? `${settings.financial.currencySymbol}0.00` : "$0.00"}
                            className="w-full"
                          />
                        </div>
                        
                        <div className="flex justify-between items-center font-bold pt-4 border-t">
                          <span>Total:</span>
                          <span>{settings ? formatCurrency(newInvoice.total || 0) : `$${(newInvoice.total || 0).toFixed(2)}`}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button 
                      type="button" 
                      onClick={handleCreateInvoice}
                      disabled={!newInvoice.patientId || loading}
                    >
                      Create Invoice
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 flex justify-between items-center">
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="text-sm text-muted-foreground">
            Showing {filteredInvoices.length} of {invoices.length} invoices
          </div>
        </div>
        
        <div className="rounded-lg border border-border bg-card">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredInvoices.length > 0 ? (
                  filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                      <TableCell>{invoice.patientName}</TableCell>
                      <TableCell>{formatDate(invoice.createdAt)}</TableCell>
                      <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(invoice.total)}</TableCell>
                      <TableCell>
                        {getStatusBadge(invoice.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleViewInvoice(invoice.id!)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            
                            {invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
                              <DropdownMenuItem onClick={() => handleEditInvoice(invoice.id!)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                            )}
                            
                            <DropdownMenuItem onClick={() => handleShowPDF(invoice)}>
                              <FileText className="h-4 w-4 mr-2" />
                              Generate PDF
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator />
                            
                            {invoice.status === 'draft' && (
                              <DropdownMenuItem onClick={() => handleMarkAsSent(invoice.id!)}>
                                <Clock className="h-4 w-4 mr-2" />
                                Mark as Sent
                              </DropdownMenuItem>
                            )}
                            
                            {(invoice.status === 'draft' || invoice.status === 'sent') && (
                              <DropdownMenuItem onClick={() => handleMarkAsPaid(invoice)}>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Mark as Paid
                              </DropdownMenuItem>
                            )}
                            
                            {invoice.status === 'sent' && (
                              <DropdownMenuItem onClick={() => handleMarkAsOverdue(invoice.id!)}>
                                <AlertCircle className="h-4 w-4 mr-2" />
                                Mark as Overdue
                              </DropdownMenuItem>
                            )}
                            
                            <DropdownMenuSeparator />
                            
                            <DropdownMenuItem 
                              onClick={() => handleDeleteClick(invoice.id!)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      {searchQuery || statusFilter !== 'all' ? (
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <Search className="h-10 w-10 mb-2 opacity-50" />
                          <p>No invoices matching your filters</p>
                          <p className="text-sm">Try adjusting your search or filter criteria</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <FileText className="h-10 w-10 mb-2 opacity-50" />
                          <p>No invoices yet</p>
                          <p className="text-sm">Create your first invoice to get started</p>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Invoice</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              invoice and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>
              Record payment details for invoice {selectedInvoice?.invoiceNumber}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="flex justify-between mb-2">
                <span>Total Amount:</span>
                <span className="font-semibold">
                  {selectedInvoice ? formatCurrency(selectedInvoice.total) : '$0.00'}
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
            {selectedInvoice && settings ? (
              <InvoicePDF 
                ref={pdfRef} 
                invoice={selectedInvoice} 
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

export default Invoices; 