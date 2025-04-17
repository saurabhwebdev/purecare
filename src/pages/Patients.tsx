import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  PlusCircle, 
  Search, 
  FileText, 
  Users, 
  Calendar,
  MoreHorizontal,
  Pencil,
  Trash2,
  Phone,
  Check,
  X,
  AlertCircle,
  Eye
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format, parseISO, isToday, isTomorrow, isAfter, isBefore, startOfDay } from 'date-fns';
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { getUserSettings } from '@/lib/firebase/settingsService';
import {
  Patient,
  getPatients, 
  addPatient as createPatient,
  deletePatient as removePatient,
  getAppointments,
  addAppointment,
  updateAppointmentStatus,
  Appointment,
  getPatientMedicalRecords,
  addMedicalRecord,
  MedicalRecord
} from '@/lib/firebase/patientService';
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
import {
  Mail,
  CalendarClock,
  MoreVertical,
} from 'lucide-react';

const Patients = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isSelectingForPrescription = searchParams.get('selectForPrescription') === 'true';
  const isSelectingForInvoice = searchParams.get('selectForInvoice') === 'true';
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [clinicSettings, setClinicSettings] = useState<any>(null);
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [newPatient, setNewPatient] = useState<Omit<Patient, 'id'>>({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    insuranceProvider: '',
    insuranceNumber: '',
    status: 'Active'
  });
  
  // Fetch patients and clinic settings from Firebase
  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Load clinic settings
        const settings = await getUserSettings(user.uid);
        setClinicSettings(settings.clinic);
        
        // Load patients
        const patientData = await getPatients(user.uid);
        setPatients(patientData);
        setFilteredPatients(patientData);
        
        // Load appointments
        const appointmentData = await getAppointments(user.uid);
        // Load all patients' medical records
        const allRecords: Array<MedicalRecord & { patientName?: string }> = [];
        for (const patient of patientData) {
          if (patient.id) {
            const records = await getPatientMedicalRecords(user.uid, patient.id);
            
            // Add patient name to each record for display
            const recordsWithPatientName = records.map(record => ({
              ...record,
              patientName: patient.name
            }));
            
            allRecords.push(...recordsWithPatientName);
          }
        }
        
        // Sort records by date, newest first
        allRecords.sort((a, b) => {
          try {
            return parseISO(b.date).getTime() - parseISO(a.date).getTime();
          } catch (error) {
            return 0;
          }
        });
        
        setPatients(patientData);
        setFilteredPatients(patientData);
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: 'Error loading data',
          description: 'There was a problem loading patient data.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [user, toast]);

  // Filter patients based on search term and status filter
  useEffect(() => {
    const filtered = patients.filter(patient => {
      const matchesSearch = 
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm);
      
      const matchesStatus = statusFilter === 'all' || 
        patient.status.toLowerCase() === statusFilter.toLowerCase();
      
      return matchesSearch && matchesStatus;
    });
    
    setFilteredPatients(filtered);
  }, [searchTerm, statusFilter, patients]);

  // Update patient form field
  const updatePatientField = (field: string, value: string) => {
    setNewPatient(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Format date (DOB) for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Handle adding a new patient
  const handleAddPatient = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      // Create patient in Firebase
      const patientId = await createPatient(user.uid, newPatient);
      
      // Add patient to local state
      setPatients([...patients, { ...newPatient, id: patientId }]);
      
      toast({
        title: 'Success',
        description: 'Patient added successfully.',
      });
      
      // Reset form and close dialog
      setNewPatient({
        name: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        address: '',
        insuranceProvider: '',
        insuranceNumber: '',
        status: 'Active'
      });
      setIsAddPatientOpen(false);
    } catch (error) {
      console.error('Error adding patient:', error);
      toast({
        title: 'Error',
        description: 'Failed to add patient.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle patient selection for prescription or invoice
  const handleSelectPatient = (patientId: string, patientName: string) => {
    if (isSelectingForPrescription) {
      navigate(`/prescriptions/new?patientId=${patientId}&patientName=${encodeURIComponent(patientName)}`);
    } else if (isSelectingForInvoice) {
      navigate(`/invoices/new?patientId=${patientId}&patientName=${encodeURIComponent(patientName)}`);
    }
  };

  // Handle deleting a patient
  const handleDeleteClick = (id: string) => {
    setPatientToDelete(id);
    setShowDeleteDialog(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!patientToDelete || !user) return;

    try {
      await removePatient(user.uid, patientToDelete);
      
      // Update local state
      setPatients(prev => prev.filter(p => p.id !== patientToDelete));
      
      toast({
        title: 'Success',
        description: 'Patient deleted successfully.',
      });
    } catch (error) {
      console.error('Error deleting patient:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete patient.',
        variant: 'destructive',
      });
    } finally {
      setShowDeleteDialog(false);
      setPatientToDelete(null);
    }
  };

  // Handle viewing patient details
  const handleViewPatient = (id: string) => {
    // This would navigate to a dedicated patient view page
    // For now we'll just show a toast
    toast({
      title: 'View Patient',
      description: 'This would navigate to a patient details page.',
    });
  };

  // Handle editing a patient
  const handleEditPatient = (id: string) => {
    // This would navigate to a dedicated patient edit page
    // For now we'll just show a toast
    toast({
      title: 'Edit Patient',
      description: 'This would navigate to a patient editing page.',
    });
  };

  // Handle scheduling an appointment
  const handleScheduleAppointment = (patientId: string, patientName: string) => {
    navigate(`/appointments?patientId=${patientId}&patientName=${encodeURIComponent(patientName)}`);
  };

  // Render banner for prescription or invoice selection mode
  const renderSelectionBanner = () => {
    if (!isSelectingForPrescription && !isSelectingForInvoice) return null;
    
    return (
      <div className="bg-primary/10 border-y border-primary/20 py-2 mb-6">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <p className="text-primary font-medium">
            {isSelectingForPrescription 
              ? 'Select a patient for the new prescription'
              : 'Select a patient for the new invoice'}
          </p>
          <Button 
            variant="ghost" 
            onClick={() => isSelectingForPrescription 
              ? navigate('/prescriptions')
              : navigate('/invoices')
            }
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="w-full backdrop-blur-md bg-background/80 py-4 border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Patients</h1>
              <p className="text-muted-foreground">Manage your patient records</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search patients..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Dialog open={isAddPatientOpen} onOpenChange={setIsAddPatientOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-1 whitespace-nowrap">
                    <PlusCircle className="h-4 w-4" />
                    <span className="hidden sm:inline">New Patient</span>
                    <span className="sm:hidden">New</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Patient</DialogTitle>
                    <DialogDescription>
                      Enter the patient details to create a new record.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={newPatient.name}
                          onChange={(e) => updatePatientField('name', e.target.value)}
                          placeholder="Enter patient's full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={newPatient.dateOfBirth}
                          onChange={(e) => updatePatientField('dateOfBirth', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select
                          value={newPatient.gender}
                          onValueChange={(value) => updatePatientField('gender', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                            <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={newPatient.phone}
                          onChange={(e) => updatePatientField('phone', e.target.value)}
                          placeholder="Enter phone number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newPatient.email}
                          onChange={(e) => updatePatientField('email', e.target.value)}
                          placeholder="Enter email address"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={newPatient.status}
                          onValueChange={(value) => updatePatientField('status', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address">Address</Label>
                        <Textarea
                          id="address"
                          value={newPatient.address}
                          onChange={(e) => updatePatientField('address', e.target.value)}
                          placeholder="Enter patient's address"
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                        <Input
                          id="insuranceProvider"
                          value={newPatient.insuranceProvider}
                          onChange={(e) => updatePatientField('insuranceProvider', e.target.value)}
                          placeholder="Enter insurance provider"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="insuranceNumber">Insurance ID Number</Label>
                        <Input
                          id="insuranceNumber"
                          value={newPatient.insuranceNumber}
                          onChange={(e) => updatePatientField('insuranceNumber', e.target.value)}
                          placeholder="Enter insurance ID"
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button 
                      type="button" 
                      onClick={handleAddPatient}
                      disabled={!newPatient.name || loading}
                    >
                      Add Patient
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
      
      {renderSelectionBanner()}
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Patients</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="text-sm text-muted-foreground">
            Showing {filteredPatients.length} of {patients.length} patients
          </div>
        </div>
        
        <div className="rounded-lg border border-border bg-card">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Date of Birth</TableHead>
                  <TableHead>Insurance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => (
                    <TableRow key={patient.id} className={isSelectingForPrescription || isSelectingForInvoice ? 'cursor-pointer hover:bg-accent' : ''} 
                      onClick={isSelectingForPrescription || isSelectingForInvoice 
                        ? () => handleSelectPatient(patient.id!, patient.name) 
                        : undefined}
                    >
                      <TableCell className="font-medium">{patient.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-col space-y-1">
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span>{patient.phone || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{patient.email || 'N/A'}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span>{formatDate(patient.dateOfBirth)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {patient.insuranceProvider ? (
                          <div className="flex flex-col">
                            <span>{patient.insuranceProvider}</span>
                            <span className="text-xs text-muted-foreground">{patient.insuranceNumber}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">None</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(patient.status)}</TableCell>
                      <TableCell className="text-right">
                        {isSelectingForPrescription || isSelectingForInvoice ? (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectPatient(patient.id!, patient.name);
                            }}
                          >
                            Select
                          </Button>
                        ) : (
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
                              <DropdownMenuItem onClick={() => handleViewPatient(patient.id!)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditPatient(patient.id!)}>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleScheduleAppointment(patient.id!, patient.name)}>
                                <CalendarClock className="h-4 w-4 mr-2" />
                                Schedule Appointment
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleDeleteClick(patient.id!)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      {searchTerm || statusFilter !== 'all' ? (
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <Search className="h-10 w-10 mb-2 opacity-50" />
                          <p>No patients matching your filters</p>
                          <p className="text-sm">Try adjusting your search or filter criteria</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <FileText className="h-10 w-10 mb-2 opacity-50" />
                          <p>No patients yet</p>
                          <p className="text-sm">Add your first patient to get started</p>
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
            <AlertDialogTitle>Delete Patient</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              patient record and remove it from our servers.
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
    </DashboardLayout>
  );
};

export default Patients; 