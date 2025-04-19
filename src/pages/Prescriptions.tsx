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
  Prescription, 
  getAllPrescriptions, 
  deletePrescription, 
  getPrescriptionWithSettings,
  createPrescription,
  Medicine
} from '@/lib/firebase/prescriptionService';
import { getPatient, getPatients } from '@/lib/firebase/patientService';
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
  PlusCircle,
  User,
  Calendar,
  X,
  Mail
} from 'lucide-react';

import PrescriptionPDF from '@/components/prescription/PrescriptionPDF';
import { generatePrescriptionPDF, downloadBlob } from '@/lib/pdf/pdfGenerator';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import AISymptomsSuggestion from '@/components/prescription/AISymptomsSuggestion';
import { sendPrescriptionEmail } from '@/lib/google/prescriptionEmailService';

const Prescriptions = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [prescriptionToDelete, setPrescriptionToDelete] = useState<string | null>(null);
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [settings, setSettings] = useState<any>(null);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [sendingEmailId, setSendingEmailId] = useState<string | null>(null);
  
  // New state for prescription creation
  const [isAddPrescriptionOpen, setIsAddPrescriptionOpen] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);
  const [newPrescription, setNewPrescription] = useState({
    patientId: '',
    patientName: '',
    diagnosis: '',
    notes: '',
    status: 'active' as const,
    medicines: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }]
  });
  
  const pdfRef = useRef<HTMLDivElement>(null);

  // Fetch prescriptions and patients from Firestore
  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        console.log("No user found, can't fetch prescriptions");
        return;
      }
      
      console.log("Fetching prescriptions for user:", user.uid); // Debug user ID
      
      try {
        setLoading(true);
        const [prescriptionData, patientData] = await Promise.all([
          getAllPrescriptions(user.uid),
          getPatients(user.uid)
        ]);
        
        console.log('Fetched prescriptions:', prescriptionData); // Debug log
        setPrescriptions(prescriptionData);
        setFilteredPrescriptions(prescriptionData);
        setPatients(patientData);
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

  // Filter prescriptions based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPrescriptions(prescriptions);
      return;
    }

    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = prescriptions.filter(prescription => 
      prescription.patientName.toLowerCase().includes(lowerCaseQuery) ||
      prescription.diagnosis?.toLowerCase().includes(lowerCaseQuery) ||
      prescription.medicines.some(med => med.name.toLowerCase().includes(lowerCaseQuery))
    );

    setFilteredPrescriptions(filtered);
  }, [searchQuery, prescriptions]);

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

  // Handle editing a prescription
  const handleEditPrescription = (id: string) => {
    navigate(`/prescriptions/edit/${id}`);
  };

  // Handle viewing a prescription
  const handleViewPrescription = (id: string) => {
    navigate(`/prescriptions/view/${id}`);
  };

  // Handle deleting a prescription
  const handleDeleteClick = (id: string) => {
    setPrescriptionToDelete(id);
    setShowDeleteDialog(true);
  };

  // Confirm deletion
  const confirmDelete = async () => {
    if (!prescriptionToDelete) return;

    try {
      await deletePrescription(prescriptionToDelete);
      
      // Update local state
      setPrescriptions(prev => prev.filter(p => p.id !== prescriptionToDelete));
      setFilteredPrescriptions(prev => prev.filter(p => p.id !== prescriptionToDelete));
      
      toast({
        title: 'Success',
        description: 'Prescription deleted successfully.',
      });
    } catch (error) {
      console.error('Error deleting prescription:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete prescription.',
        variant: 'destructive',
      });
    } finally {
      setShowDeleteDialog(false);
      setPrescriptionToDelete(null);
    }
  };

  // Handle showing PDF preview
  const handleShowPDF = async (prescription: Prescription) => {
    if (!user) return;
    
    try {
      const { settings, prescription: prescriptionData } = await getPrescriptionWithSettings(user.uid, prescription.id!);
      
      setSelectedPrescription(prescriptionData);
      setSettings(settings);
      setShowPDFPreview(true);
    } catch (error) {
      console.error('Error loading prescription data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load prescription data for PDF.',
        variant: 'destructive',
      });
    }
  };

  // Generate and download PDF
  const handleDownloadPDF = async () => {
    if (!pdfRef.current || !selectedPrescription) return;
    
    setGeneratingPDF(true);
    
    try {
      const { blob, filename } = await generatePrescriptionPDF(pdfRef.current, selectedPrescription);
      downloadBlob(blob, filename);
      
      toast({
        title: 'Success',
        description: 'Prescription PDF downloaded successfully.',
      });
      
      setShowPDFPreview(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate prescription PDF.',
        variant: 'destructive',
      });
    } finally {
      setGeneratingPDF(false);
    }
  };

  // Get badge variant based on status
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'outline';
      case 'completed':
        return 'secondary';
      default:
        return 'default';
    }
  };

  // Update new prescription field
  const updatePrescriptionField = (field: string, value: any) => {
    setNewPrescription(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle patient selection for new prescription
  const handlePatientSelection = (patientId: string) => {
    const selectedPatient = patients.find(patient => patient.id === patientId);
    if (selectedPatient) {
      updatePrescriptionField('patientId', patientId);
      updatePrescriptionField('patientName', selectedPatient.name);
    }
  };

  // Add prescription medicine
  const addMedicine = () => {
    setNewPrescription(prev => ({
      ...prev,
      medicines: [...(prev.medicines || []), { name: '', dosage: '', frequency: '', duration: '', instructions: '' }]
    }));
  };

  // Remove prescription medicine
  const removeMedicine = (index: number) => {
    setNewPrescription(prev => {
      const medicines = [...(prev.medicines || [])];
      if (medicines.length > 1) {
        medicines.splice(index, 1);
        return { ...prev, medicines };
      }
      return prev;
    });
  };

  // Update prescription medicine
  const updateMedicine = (index: number, field: string, value: string) => {
    setNewPrescription(prev => {
      const medicines = [...(prev.medicines || [])];
      medicines[index] = { ...medicines[index], [field]: value };
      return { ...prev, medicines };
    });
  };

  // Handle creating a new prescription
  const handleCreatePrescription = async () => {
    if (!user || !newPrescription.patientId || !newPrescription.patientName) {
      toast({
        title: 'Error',
        description: 'Please select a patient.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      
      // Prepare prescription data without doctorId since it will be added by the function
      const prescriptionData = {
        patientId: newPrescription.patientId,
        patientName: newPrescription.patientName,
        diagnosis: newPrescription.diagnosis || '',
        notes: newPrescription.notes || '',
        status: newPrescription.status as 'active' | 'completed' | 'cancelled',
        medicines: newPrescription.medicines || []
      };
      
      console.log('Creating prescription with data:', prescriptionData); // Debug log
      console.log('User ID:', user.uid); // Debug log
      
      // Create prescription - pass doctorId as first parameter
      await createPrescription(user.uid, prescriptionData);
      
      // Refresh prescriptions
      const updatedPrescriptions = await getAllPrescriptions(user.uid);
      console.log('Updated prescriptions after creation:', updatedPrescriptions); // Debug log
      setPrescriptions(updatedPrescriptions);
      setFilteredPrescriptions(updatedPrescriptions);
      
      toast({
        title: 'Success',
        description: 'Prescription created successfully',
      });
      
      // Reset form and close dialog
      setNewPrescription({
        patientId: '',
        patientName: '',
        diagnosis: '',
        notes: '',
        status: 'active' as const,
        medicines: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }]
      });
      setIsAddPrescriptionOpen(false);
    } catch (error) {
      console.error('Error creating prescription:', error);
      toast({
        title: 'Error',
        description: 'Failed to create prescription',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Update the function to handle adding a medication from AI suggestions
  const handleAddMedicineFromAI = (medicine: { name: string; dosage: string; frequency: string; duration: string; instructions: string }) => {
    setNewPrescription(prev => {
      const medicines = [...(prev.medicines || []), medicine];
      return { ...prev, medicines };
    });
    
    toast({
      title: 'Medicine Added',
      description: `${medicine.name} has been added to the prescription.`,
    });
  };

  // Handle sending prescription email
  const handleSendPrescriptionEmail = async (prescription: Prescription) => {
    if (!user || !prescription.id) return;
    
    try {
      setLoading(true);
      setSendingEmailId(prescription.id);
      
      // Validate patientId exists
      if (!prescription.patientId) {
        console.error('Invalid patient ID in prescription:', prescription);
        toast({
          title: "Invalid prescription",
          description: "This prescription doesn't have a valid patient ID.",
          variant: "destructive",
        });
        return;
      }
      
      // Enhanced debugging
      console.log('Attempting to find patient data for ID:', prescription.patientId);
      console.log('Prescription details:', prescription);
      
      // Get fresh patient data directly from the database
      let patientData = await getPatient(user.uid, prescription.patientId);
      
      // If not found in database, try to get from local state as fallback
      if (!patientData) {
        console.log('Patient not found in database, trying local cache...');
        patientData = patients.find(p => p.id === prescription.patientId) || null;
        
        if (patientData) {
          console.log('Found patient in local cache:', patientData);
        }
      }
      
      // If we still can't find the patient, check if prescription has patient email directly
      if (!patientData && prescription.patientName) {
        console.log('Creating synthetic patient from prescription data');
        // Create a minimal patient object from prescription data
        // This is a fallback if the patient record can't be found
        patientData = {
          id: prescription.patientId,
          name: prescription.patientName,
          email: '', // We'll check if email is missing and handle it below
          phone: '',
          dateOfBirth: '',
          gender: '',
          address: '',
          insuranceProvider: '',
          insuranceNumber: '',
          status: 'Active'
        };
      }
      
      if (!patientData || !patientData.email) {
        // Prompt user to enter email manually as last resort
        toast({
          title: "Email not found",
          description: "Patient email address is not available. Would you like to send the email to a different address?",
          variant: "destructive",
          action: (
            <div className="flex items-center mt-2">
              <Input 
                id="manual-email"
                type="email"
                placeholder="Enter email address"
                className="mr-2 h-8"
                onChange={(e) => {
                  if (e.target.value && e.target.value.includes('@')) {
                    const manualEmail = e.target.value;
                    // Send email to manually entered address
                    if (confirm(`Send email to ${manualEmail}?`)) {
                      sendPrescriptionEmail(user.uid, prescription, manualEmail)
                        .then(result => {
                          if (result.success) {
                            toast({
                              title: "Email sent",
                              description: `Prescription sent to ${manualEmail}`,
                            });
                          } else {
                            toast({
                              title: "Email failed",
                              description: result.message,
                              variant: "destructive",
                            });
                          }
                        });
                    }
                  }
                }}
              />
            </div>
          )
        });
        
        // Log debugging information
        console.error('Patient email not available:', {
          patientId: prescription.patientId,
          patientData
        });
        return;
      }
      
      console.log('Sending email to patient:', patientData.email);
      
      // Send prescription confirmation email
      const result = await sendPrescriptionEmail(user.uid, prescription, patientData.email);
      
      // Show result toast
      if (result.success) {
        toast({
          title: "Email sent",
          description: result.message,
        });
      } else {
        toast({
          title: "Email failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error sending prescription email:', error);
      toast({
        title: 'Error',
        description: 'There was a problem sending the prescription email.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setSendingEmailId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="w-full backdrop-blur-md bg-background/80 py-4 border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Prescriptions</h1>
              <p className="text-muted-foreground">Manage patient prescriptions</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search prescriptions..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Dialog open={isAddPrescriptionOpen} onOpenChange={setIsAddPrescriptionOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-1 whitespace-nowrap">
                    <PlusCircle className="h-4 w-4" />
                    <span className="hidden sm:inline">New Prescription</span>
                    <span className="sm:hidden">New</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Prescription</DialogTitle>
                    <DialogDescription>
                      Fill in the details to create a new prescription.
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
                        <Label htmlFor="date">Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={format(new Date(), 'yyyy-MM-dd')}
                          disabled
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="diagnosis">Diagnosis</Label>
                      <Textarea
                        id="diagnosis"
                        value={newPrescription.diagnosis}
                        onChange={(e) => updatePrescriptionField('diagnosis', e.target.value)}
                        placeholder="Enter patient diagnosis"
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Medications</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addMedicine}
                          className="h-8 px-2"
                        >
                          <Plus className="h-3.5 w-3.5 mr-1" />
                          Add Medication
                        </Button>
                      </div>
                      
                      {/* AI Symptoms Suggestion Component */}
                      <AISymptomsSuggestion onMedicineAdd={handleAddMedicineFromAI} />
                      
                      {newPrescription.medicines?.map((medicine, index) => (
                        <div key={index} className="space-y-4 border rounded-lg p-4 relative">
                          {newPrescription.medicines && newPrescription.medicines.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeMedicine(index)}
                              className="absolute right-2 top-2 h-8 w-8"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                          
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor={`medicine-${index}-name`}>Medication Name</Label>
                              <Input
                                id={`medicine-${index}-name`}
                                value={medicine.name}
                                onChange={(e) => updateMedicine(index, 'name', e.target.value)}
                                placeholder="Medication name"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`medicine-${index}-dosage`}>Dosage</Label>
                              <Input
                                id={`medicine-${index}-dosage`}
                                value={medicine.dosage}
                                onChange={(e) => updateMedicine(index, 'dosage', e.target.value)}
                                placeholder="e.g., 10mg"
                              />
                            </div>
                          </div>
                          
                          <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                              <Label htmlFor={`medicine-${index}-frequency`}>Frequency</Label>
                              <Input
                                id={`medicine-${index}-frequency`}
                                value={medicine.frequency}
                                onChange={(e) => updateMedicine(index, 'frequency', e.target.value)}
                                placeholder="e.g., Twice daily"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`medicine-${index}-duration`}>Duration</Label>
                              <Input
                                id={`medicine-${index}-duration`}
                                value={medicine.duration}
                                onChange={(e) => updateMedicine(index, 'duration', e.target.value)}
                                placeholder="e.g., 7 days"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`medicine-${index}-instructions`}>Instructions</Label>
                              <Input
                                id={`medicine-${index}-instructions`}
                                value={medicine.instructions}
                                onChange={(e) => updateMedicine(index, 'instructions', e.target.value)}
                                placeholder="e.g., After meals"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={newPrescription.notes}
                        onChange={(e) => updatePrescriptionField('notes', e.target.value)}
                        placeholder="Additional notes for the prescription"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button 
                      type="button" 
                      onClick={handleCreatePrescription}
                      disabled={!newPrescription.patientId || loading}
                    >
                      Create Prescription
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6">
        <div className="rounded-lg border border-border bg-card">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Diagnosis</TableHead>
                  <TableHead>Medications</TableHead>
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
                      <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredPrescriptions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {searchQuery
                        ? 'No prescriptions matching your search'
                        : 'No prescriptions yet. Create your first prescription!'
                      }
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPrescriptions.map((prescription) => (
                    <TableRow key={prescription.id} className="hover:bg-muted/50">
                      <TableCell>{formatDate(prescription.createdAt)}</TableCell>
                      <TableCell className="font-medium">{prescription.patientName}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{prescription.diagnosis || 'Not specified'}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {prescription.medicines && prescription.medicines.length > 0 
                          ? prescription.medicines.map(med => med.name || 'Unnamed medication').join(', ') 
                          : 'None'
                        }
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getBadgeVariant(prescription.status)}
                        >
                          {prescription.status ? prescription.status.toUpperCase() : 'UNKNOWN'}
                        </Badge>
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
                            <DropdownMenuItem onClick={() => handleViewPrescription(prescription.id!)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditPrescription(prescription.id!)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleShowPDF(prescription)}>
                              <FileText className="h-4 w-4 mr-2" />
                              Generate PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSendPrescriptionEmail(prescription)}>
                              <Mail className="h-4 w-4 mr-2" />
                              {sendingEmailId === prescription.id ? 'Sending...' : 'Send Email'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteClick(prescription.id!)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
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
            <AlertDialogTitle>Delete Prescription</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              prescription and remove it from our servers.
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

      {/* PDF Preview Dialog */}
      <Dialog open={showPDFPreview} onOpenChange={setShowPDFPreview}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>Prescription Preview</DialogTitle>
            <DialogDescription>
              Review the prescription PDF before downloading.
            </DialogDescription>
          </DialogHeader>
          
          <div className="border rounded-lg overflow-auto max-h-[70vh]">
            {selectedPrescription && settings ? (
              <PrescriptionPDF 
                ref={pdfRef} 
                prescription={selectedPrescription} 
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

export default Prescriptions; 