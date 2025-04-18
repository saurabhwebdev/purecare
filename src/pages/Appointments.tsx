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
  Calendar,
  Clock,
  PlusCircle, 
  Search, 
  Check,
  X,
  AlertCircle,
  MoreHorizontal,
  Users,
  Filter,
  MoreVertical,
  CalendarCheck
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format, addDays, startOfDay, endOfDay, parseISO, isToday, isTomorrow, isAfter, isBefore } from 'date-fns';
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { getUserSettings } from '@/lib/firebase/settingsService';
import {
  getPatients,
  getAppointments,
  addAppointment,
  updateAppointmentStatus,
  Appointment,
  Patient
} from '@/lib/firebase/patientService';
import { syncAppointmentToGoogleCalendar } from '@/lib/google/appointmentSyncService';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Switch } from '@/components/ui/switch';

// Appointment type options
const appointmentTypes = [
  { value: 'Consultation', label: 'Consultation' },
  { value: 'Follow-up', label: 'Follow-up' },
  { value: 'Check-up', label: 'Check-up' },
  { value: 'Treatment', label: 'Treatment' },
  { value: 'Procedure', label: 'Procedure' },
  { value: 'Emergency', label: 'Emergency' },
  { value: 'Other', label: 'Other' },
];

// Appointment duration options
const durationOptions = [
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' },
];

// Format date for display
const formatAppointmentDate = (date: string) => {
  try {
    return format(parseISO(date), 'MMMM d, yyyy');
  } catch (error) {
    return date;
  }
};

// Get status badge variant
const getStatusBadge = (status: string) => {
  const baseClasses = "text-xs py-0.5 px-2 h-5 min-w-[2rem] inline-flex items-center justify-center font-medium";
  
  switch (status) {
    case 'Scheduled':
      return (
        <span className="group relative">
          <Badge variant="outline" className={`bg-blue-50 text-blue-700 border-blue-200 ${baseClasses}`}>S</Badge>
          <span className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block bg-black/80 text-white text-xs rounded py-1 px-2 whitespace-nowrap">Scheduled</span>
        </span>
      );
    case 'Completed':
      return (
        <span className="group relative">
          <Badge variant="outline" className={`bg-green-50 text-green-700 border-green-200 ${baseClasses}`}>C</Badge>
          <span className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block bg-black/80 text-white text-xs rounded py-1 px-2 whitespace-nowrap">Completed</span>
        </span>
      );
    case 'Cancelled':
      return (
        <span className="group relative">
          <Badge variant="outline" className={`bg-red-50 text-red-700 border-red-200 ${baseClasses}`}>X</Badge>
          <span className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block bg-black/80 text-white text-xs rounded py-1 px-2 whitespace-nowrap">Cancelled</span>
        </span>
      );
    case 'No-Show':
      return (
        <span className="group relative">
          <Badge variant="outline" className={`bg-amber-50 text-amber-700 border-amber-200 ${baseClasses}`}>N</Badge>
          <span className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block bg-black/80 text-white text-xs rounded py-1 px-2 whitespace-nowrap">No-Show</span>
        </span>
      );
    default:
      return <Badge variant="outline" className={baseClasses}>{status.charAt(0)}</Badge>;
  }
};

// Google badge component to match status badge style
const getGoogleBadge = () => {
  return (
    <span className="group relative">
      <Badge variant="outline" className="bg-blue-50/70 text-blue-600 border-blue-100 text-xs py-0.5 px-2 h-5 min-w-[2rem] inline-flex items-center justify-center font-medium">
        <CalendarCheck className="h-2.5 w-2.5" />
        <span className="ml-0.5">G</span>
      </Badge>
      <span className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block bg-black/80 text-white text-xs rounded py-1 px-2 whitespace-nowrap">Google Synced</span>
    </span>
  );
};

const Appointments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [syncingAppointmentId, setSyncingAppointmentId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [timeRangeFilter, setTimeRangeFilter] = useState('all');
  const [clinicSettings, setClinicSettings] = useState<any>(null);
  const [googleSettings, setGoogleSettings] = useState<any>(null);
  const [isAddAppointmentOpen, setIsAddAppointmentOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // New appointment state
  const [newAppointment, setNewAppointment] = useState<Omit<Appointment, 'id'>>({
    patientId: '',
    patientName: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: format(new Date(), 'HH:mm'),
    duration: 30,
    type: 'Consultation',
    status: 'Scheduled',
    notes: '',
    provider: '',
    syncedWithGoogle: false,
  });

  // Fetch appointments, patients, and clinic settings from Firebase
  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // Load user settings
        const settings = await getUserSettings(user.uid);
        setClinicSettings(settings.clinic);
        setGoogleSettings(settings.google);
        
        // Load patients for the dropdown
        const patientData = await getPatients(user.uid);
        setPatients(patientData);
        
        // Load appointments
        const appointmentData = await getAppointments(user.uid);
        setAppointments(appointmentData);
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: 'Error loading data',
          description: 'There was a problem loading appointments data.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [user, toast]);

  // Filter appointments based on search term, status filter, and date filter
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = 
      appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    
    // Date filtering
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const appointmentDate = parseISO(appointment.date);
      
      switch (dateFilter) {
        case 'today':
          matchesDate = isToday(appointmentDate);
          break;
        case 'tomorrow':
          matchesDate = isTomorrow(appointmentDate);
          break;
        case 'upcoming':
          matchesDate = isAfter(appointmentDate, new Date());
          break;
        case 'past':
          matchesDate = isBefore(appointmentDate, startOfDay(new Date()));
          break;
        default:
          matchesDate = true;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Handle patient selection for new appointment
  const handlePatientSelection = (patientId: string) => {
    const selectedPatient = patients.find(p => p.id === patientId);
    
    if (selectedPatient) {
      setNewAppointment({
        ...newAppointment,
        patientId,
        patientName: selectedPatient.name,
      });
    }
  };

  // Handle adding a new appointment
  const handleAddAppointment = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Set provider name from clinic settings
      const appointmentToAdd = {
        ...newAppointment,
        provider: clinicSettings?.clinicName || user.displayName || 'Provider',
      };
      
      console.log('Creating appointment with sync flag:', appointmentToAdd.syncedWithGoogle);
      
      // Create appointment in Firebase
      const appointmentId = await addAppointment(user.uid, appointmentToAdd);
      
      // Add appointment to local state with the returned ID
      const newAppointmentWithId = { ...appointmentToAdd, id: appointmentId };
      setAppointments([...appointments, newAppointmentWithId]);
      
      // Sync with Google Calendar if option is enabled
      if (appointmentToAdd.syncedWithGoogle) {
        console.log('Syncing new appointment to Google Calendar:', newAppointmentWithId);
        setSyncingAppointmentId(appointmentId);
        
        // Make sure all required fields are present before syncing
        const appointmentForSync: Appointment = {
          ...newAppointmentWithId,
          id: appointmentId,
          // Ensure these fields are present and valid
          date: newAppointmentWithId.date || format(new Date(), 'yyyy-MM-dd'),
          time: newAppointmentWithId.time || format(new Date(), 'HH:mm'),
          duration: newAppointmentWithId.duration || 30,
          patientName: newAppointmentWithId.patientName || 'Patient',
          provider: newAppointmentWithId.provider || 'Provider',
          patientId: newAppointmentWithId.patientId || '',
          type: newAppointmentWithId.type || 'Consultation',
          status: newAppointmentWithId.status || 'Scheduled',
        };
        
        const result = await syncAppointmentToGoogleCalendar(user.uid, appointmentForSync);
        console.log('Google Calendar sync result:', result);
        
        if (result.success) {
          toast({
            title: "Appointment scheduled",
            description: `Appointment for ${appointmentToAdd.patientName} has been scheduled and synced with Google Calendar.`
          });
        } else {
          toast({
            title: "Appointment scheduled",
            description: `Appointment scheduled but Google Calendar sync failed: ${result.message}`,
            variant: "destructive"
          });
        }
        
        // Refresh appointments to get the updated syncedWithGoogle status
        const updatedAppointments = await getAppointments(user.uid);
        setAppointments(updatedAppointments);
        setSyncingAppointmentId(null);
      } else {
        toast({
          title: "Appointment scheduled",
          description: `Appointment for ${appointmentToAdd.patientName} has been scheduled.`
        });
      }
      
      setIsAddAppointmentOpen(false);
      setNewAppointment({
        patientId: '',
        patientName: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        time: format(new Date(), 'HH:mm'),
        duration: 30,
        type: 'Consultation',
        status: 'Scheduled',
        notes: '',
        provider: '',
        syncedWithGoogle: false,
      });
      
    } catch (error) {
      console.error('Error adding appointment:', error);
      toast({
        title: 'Error scheduling appointment',
        description: 'There was a problem scheduling the appointment.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle updating appointment status
  const handleUpdateStatus = async (appointmentId: string, status: Appointment['status']) => {
    if (!user || !appointmentId) return;
    
    try {
      setIsLoading(true);
      
      // Update status in Firebase
      await updateAppointmentStatus(user.uid, appointmentId, status);
      
      // Update appointment in local state
      setAppointments(appointments.map(appointment => 
        appointment.id === appointmentId 
          ? { ...appointment, status } 
          : appointment
      ));
      
      toast({
        title: "Status updated",
        description: `Appointment status has been updated to ${status}.`
      });
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toast({
        title: 'Error updating status',
        description: 'There was a problem updating the appointment status.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update new appointment form fields
  const updateAppointmentField = (field: string, value: any) => {
    if (field === 'syncedWithGoogle') {
      console.log('Google Calendar sync toggled:', value);
    }
    
    setNewAppointment({
      ...newAppointment,
      [field]: value
    });
  };

  // Handle syncing an appointment with Google Calendar
  const handleSyncToGoogleCalendar = async (appointment: Appointment) => {
    if (!user || !appointment.id) return;
    
    try {
      setIsLoading(true);
      setSyncingAppointmentId(appointment.id);
      
      // Sync appointment with Google Calendar
      const result = await syncAppointmentToGoogleCalendar(user.uid, appointment);
      
      // Show result toast
      if (result.success) {
        toast({
          title: "Sync successful",
          description: result.message,
        });
        
        // Refresh appointments to get the updated syncedWithGoogle status
        const updatedAppointments = await getAppointments(user.uid);
        setAppointments(updatedAppointments);
      } else {
        toast({
          title: "Sync failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error syncing with Google Calendar:', error);
      toast({
        title: 'Error',
        description: 'There was a problem syncing with Google Calendar.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setSyncingAppointmentId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="w-full backdrop-blur-md bg-background/80 py-4 border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Appointments</h1>
              <p className="text-muted-foreground">Manage patient appointments and schedule</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search appointments..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Dialog open={isAddAppointmentOpen} onOpenChange={setIsAddAppointmentOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-1 whitespace-nowrap">
                    <PlusCircle className="h-4 w-4" />
                    <span className="hidden sm:inline">New Appointment</span>
                    <span className="sm:hidden">New</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Schedule New Appointment</DialogTitle>
                    <DialogDescription>
                      Fill in the details to schedule a new appointment.
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
                    
                    <div className="grid grid-cols-2 gap-4">
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
                            <CalendarComponent
                              mode="single"
                              selected={selectedDate}
                              onSelect={(date) => {
                                setSelectedDate(date);
                                if (date) {
                                  updateAppointmentField('date', format(date, 'yyyy-MM-dd'));
                                }
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="time">Time</Label>
                        <Input 
                          id="time"
                          type="time"
                          value={newAppointment.time}
                          onChange={(e) => updateAppointmentField('time', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="type">Appointment Type</Label>
                        <Select 
                          onValueChange={(value) => updateAppointmentField('type', value)}
                          defaultValue="Consultation"
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {appointmentTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="duration">Duration</Label>
                        <Select 
                          onValueChange={(value) => updateAppointmentField('duration', parseInt(value))}
                          defaultValue="30"
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                          <SelectContent>
                            {durationOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value.toString()}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea 
                        id="notes"
                        value={newAppointment.notes}
                        onChange={(e) => updateAppointmentField('notes', e.target.value)}
                        placeholder="Additional notes about the appointment"
                        className="min-h-[100px]"
                      />
                    </div>
                    
                    {googleSettings?.calendarEnabled && (
                      <div className="space-y-2 pt-2 border-t border-border">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="sync-google-calendar">Sync with Google Calendar</Label>
                            <p className="text-xs text-muted-foreground">
                              Add this appointment to your Google Calendar automatically
                            </p>
                          </div>
                          <Switch
                            id="sync-google-calendar"
                            checked={newAppointment.syncedWithGoogle || false}
                            onCheckedChange={(checked) => updateAppointmentField('syncedWithGoogle', checked)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button 
                      type="button" 
                      onClick={handleAddAppointment}
                      disabled={!newAppointment.patientId || isLoading}
                    >
                      Schedule Appointment
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="rounded-md shadow bg-background">
          <div className="grid gap-4 p-4">
            <div className="rounded-lg border border-border bg-card">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                          <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                        </TableRow>
                      ))
                    ) : filteredAppointments.length > 0 ? (
                      filteredAppointments.map((appointment) => (
                        <TableRow key={appointment.id}>
                          <TableCell className="font-medium">
                            {appointment.patientName}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col space-y-1">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                <span>{formatAppointmentDate(appointment.date)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                <span className="text-sm">{appointment.time}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{appointment.type}</TableCell>
                          <TableCell>{appointment.duration} minutes</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {getStatusBadge(appointment.status)}
                              {appointment.syncedWithGoogle && getGoogleBadge()}
                            </div>
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
                                <DropdownMenuItem 
                                  onClick={() => handleUpdateStatus(appointment.id || '', 'Completed')}
                                  disabled={appointment.status === 'Completed'}
                                >
                                  <Check className="h-4 w-4 mr-2 text-green-600" />
                                  Mark as Completed
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleUpdateStatus(appointment.id || '', 'Cancelled')}
                                  disabled={appointment.status === 'Cancelled'}
                                >
                                  <X className="h-4 w-4 mr-2 text-red-600" />
                                  Cancel Appointment
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleUpdateStatus(appointment.id || '', 'No-Show')}
                                  disabled={appointment.status === 'No-Show'}
                                >
                                  <AlertCircle className="h-4 w-4 mr-2 text-amber-600" />
                                  Mark as No-Show
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleSyncToGoogleCalendar(appointment)}
                                  disabled={appointment.syncedWithGoogle || syncingAppointmentId === appointment.id}
                                >
                                  {syncingAppointmentId === appointment.id ? (
                                    <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                                  ) : (
                                    <CalendarCheck className="h-4 w-4 mr-2 text-blue-600" />
                                  )}
                                  {syncingAppointmentId === appointment.id 
                                    ? 'Syncing...' 
                                    : appointment.syncedWithGoogle
                                      ? 'Already synced'
                                      : 'Sync to Google Calendar'
                                  }
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          {searchTerm || statusFilter !== 'all' || dateFilter !== 'all' ? (
                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                              <Search className="h-10 w-10 mb-2 opacity-50" />
                              <p>No appointments matching your filters</p>
                              <p className="text-sm">Try adjusting your search or filter criteria</p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                              <Calendar className="h-10 w-10 mb-2 opacity-50" />
                              <p>No appointments yet</p>
                              <p className="text-sm">Schedule your first appointment to get started</p>
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
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Appointments; 