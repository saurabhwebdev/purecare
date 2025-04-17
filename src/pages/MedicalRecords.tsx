import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useToast } from '@/hooks/use-toast';
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
  FileText, 
  PlusCircle, 
  Search, 
  ClipboardList,
  MoreHorizontal,
  Eye,
  Users,
  Calendar,
  MoreVertical
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format, parseISO } from 'date-fns';
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as DatePickerCalendar } from "@/components/ui/calendar";
import { getUserSettings } from '@/lib/firebase/settingsService';
import {
  getPatients,
  getPatientMedicalRecords,
  addMedicalRecord,
  MedicalRecord,
  Patient
} from '@/lib/firebase/patientService';
import { Skeleton } from '@/components/ui/skeleton';

// Format date for display
const formatRecordDate = (date: string) => {
  try {
    return format(parseISO(date), 'MMMM d, yyyy');
  } catch (error) {
    return date;
  }
};

const MedicalRecords = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [medicalRecords, setMedicalRecords] = useState<Array<MedicalRecord & { patientName?: string }>>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [patientFilter, setPatientFilter] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [clinicSettings, setClinicSettings] = useState<any>(null);
  const [isAddRecordOpen, setIsAddRecordOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewRecordDetails, setViewRecordDetails] = useState<MedicalRecord | null>(null);
  
  // New medical record state
  const [newRecord, setNewRecord] = useState<Omit<MedicalRecord, 'id'>>({
    patientId: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    diagnosis: '',
    treatment: '',
    prescription: '',
    notes: '',
    provider: '',
  });

  // Fetch medical records, patients, and clinic settings from Firebase
  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // Load clinic settings
        const settings = await getUserSettings(user.uid);
        setClinicSettings(settings.clinic);
        
        // Load patients
        const patientData = await getPatients(user.uid);
        setPatients(patientData);
        
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
        
        setMedicalRecords(allRecords);
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: 'Error loading data',
          description: 'There was a problem loading medical records.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [user, toast]);

  // Filter medical records based on search term and patient filter
  const filteredRecords = medicalRecords.filter(record => {
    const matchesSearch = 
      (record.patientName && record.patientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.treatment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.prescription && record.prescription.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesPatient = patientFilter === 'all' || record.patientId === patientFilter;
    
    return matchesSearch && matchesPatient;
  });

  // Handle patient selection for new record
  const handlePatientSelection = (patientId: string) => {
    const selectedPatient = patients.find(p => p.id === patientId);
    
    if (selectedPatient) {
      setSelectedPatient(selectedPatient);
      setNewRecord({
        ...newRecord,
        patientId
      });
    }
  };

  // Handle adding a new medical record
  const handleAddMedicalRecord = async () => {
    if (!user || !newRecord.patientId) return;
    
    try {
      setIsLoading(true);
      
      // Set provider name from clinic settings
      const recordToAdd = {
        ...newRecord,
        provider: clinicSettings?.clinicName || user.displayName || 'Provider',
      };
      
      // Create medical record in Firebase
      const recordId = await addMedicalRecord(user.uid, newRecord.patientId, recordToAdd);
      
      // Get patient name
      const patientName = patients.find(p => p.id === newRecord.patientId)?.name || 'Unknown';
      
      // Add record to local state with the returned ID and patient name
      setMedicalRecords([
        { 
          ...recordToAdd, 
          id: recordId,
          patientName 
        }, 
        ...medicalRecords
      ]);
      
      setIsAddRecordOpen(false);
      setNewRecord({
        patientId: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        diagnosis: '',
        treatment: '',
        prescription: '',
        notes: '',
        provider: '',
      });
      setSelectedPatient(null);
      
      toast({
        title: "Medical record added",
        description: `Medical record has been added for ${patientName}.`
      });
    } catch (error) {
      console.error('Error adding medical record:', error);
      toast({
        title: 'Error adding record',
        description: 'There was a problem adding the medical record.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update new record form fields
  const updateRecordField = (field: string, value: string) => {
    setNewRecord({
      ...newRecord,
      [field]: value
    });
  };

  return (
    <DashboardLayout>
      <div className="w-full backdrop-blur-md bg-background/80 py-4 border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Medical Records</h1>
              <p className="text-muted-foreground">Manage patient medical history and documentation</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search medical records..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Dialog open={isAddRecordOpen} onOpenChange={setIsAddRecordOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-1 whitespace-nowrap">
                    <PlusCircle className="h-4 w-4" />
                    <span className="hidden sm:inline">New Record</span>
                    <span className="sm:hidden">New</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Medical Record</DialogTitle>
                    <DialogDescription>
                      Enter the medical record details for the patient.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="patient">Patient</Label>
                      <Select 
                        onValueChange={(value) => handlePatientSelection(value)}
                      >
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
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !selectedDate && "text-muted-foreground"
                            )}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <DatePickerCalendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) => {
                              setSelectedDate(date);
                              if (date) {
                                updateRecordField('date', format(date, 'yyyy-MM-dd'));
                              }
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="diagnosis">Diagnosis</Label>
                      <Input 
                        id="diagnosis"
                        value={newRecord.diagnosis}
                        onChange={(e) => updateRecordField('diagnosis', e.target.value)}
                        placeholder="Primary diagnosis"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="treatment">Treatment</Label>
                      <Textarea 
                        id="treatment"
                        value={newRecord.treatment}
                        onChange={(e) => updateRecordField('treatment', e.target.value)}
                        placeholder="Treatment details"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="prescription">Prescription</Label>
                      <Textarea 
                        id="prescription"
                        value={newRecord.prescription}
                        onChange={(e) => updateRecordField('prescription', e.target.value)}
                        placeholder="Medications prescribed (optional)"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Textarea 
                        id="notes"
                        value={newRecord.notes}
                        onChange={(e) => updateRecordField('notes', e.target.value)}
                        placeholder="Additional clinical notes (optional)"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button 
                      type="button" 
                      onClick={handleAddMedicalRecord}
                      disabled={!newRecord.patientId || !newRecord.diagnosis || !newRecord.treatment || isLoading}
                    >
                      Add Record
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Select
            value={patientFilter}
            onValueChange={setPatientFilter}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by patient" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Patients</SelectItem>
              {patients.map((patient) => (
                <SelectItem key={patient.id} value={patient.id || ''}>
                  {patient.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="text-sm text-muted-foreground">
            Showing {filteredRecords.length} of {medicalRecords.length} records
          </div>
        </div>
        
        <div className="rounded-lg border border-border bg-card">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Diagnosis</TableHead>
                  <TableHead>Treatment</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">
                        {record.patientName}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span>{formatRecordDate(record.date)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px] truncate" title={record.diagnosis}>
                          {record.diagnosis}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px] truncate" title={record.treatment}>
                          {record.treatment}
                        </div>
                      </TableCell>
                      <TableCell>{record.provider}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setViewRecordDetails(record)}
                        >
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">View details</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      {searchTerm || patientFilter !== 'all' ? (
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <Search className="h-10 w-10 mb-2 opacity-50" />
                          <p>No medical records matching your filters</p>
                          <p className="text-sm">Try adjusting your search or filter criteria</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <FileText className="h-10 w-10 mb-2 opacity-50" />
                          <p>No medical records yet</p>
                          <p className="text-sm">Add your first medical record to get started</p>
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

      {/* Medical Record Details Dialog */}
      <Dialog open={!!viewRecordDetails} onOpenChange={(open) => !open && setViewRecordDetails(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Medical Record Details</DialogTitle>
            <DialogDescription>
              Detailed information about the medical record
            </DialogDescription>
          </DialogHeader>
          {viewRecordDetails && (
            <div className="py-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground">Patient</h4>
                  <p>{medicalRecords.find(r => r.id === viewRecordDetails.id)?.patientName}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground">Date</h4>
                  <p>{formatRecordDate(viewRecordDetails.date)}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-muted-foreground">Diagnosis</h4>
                <p>{viewRecordDetails.diagnosis}</p>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-muted-foreground">Treatment</h4>
                <p className="whitespace-pre-line">{viewRecordDetails.treatment}</p>
              </div>
              
              {viewRecordDetails.prescription && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-muted-foreground">Prescription</h4>
                  <p className="whitespace-pre-line">{viewRecordDetails.prescription}</p>
                </div>
              )}
              
              {viewRecordDetails.notes && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-muted-foreground">Additional Notes</h4>
                  <p className="whitespace-pre-line">{viewRecordDetails.notes}</p>
                </div>
              )}
              
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground">Provider</h4>
                <p>{viewRecordDetails.provider}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewRecordDetails(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default MedicalRecords; 