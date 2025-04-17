import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth/AuthContext';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

import {
  Patient,
  getPatient,
  getAppointments,
  getPatientMedicalRecords,
  Appointment,
  MedicalRecord
} from '@/lib/firebase/patientService';

import { getAllPrescriptions, Prescription } from '@/lib/firebase/prescriptionService';
import { getAllInvoices, Invoice } from '@/lib/firebase/invoiceService';

import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  ClipboardList,
  Calendar,
  FileText,
  BarChart4,
  Users,
  Pencil,
  Clock,
  Pill,
  DollarSign
} from 'lucide-react';

import { format, parseISO } from 'date-fns';

const PatientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  
  // Fetch patient data
  useEffect(() => {
    const fetchPatientData = async () => {
      if (!user || !id) return;
      
      setLoading(true);
      try {
        // Get patient details
        const patientData = await getPatient(user.uid, id);
        if (!patientData) {
          toast({
            title: "Patient not found",
            description: "This patient record does not exist.",
            variant: "destructive",
          });
          navigate('/patients');
          return;
        }
        setPatient(patientData);
        
        // Get patient appointments
        const appointmentData = await getAppointments(user.uid, id);
        setAppointments(appointmentData.filter(appointment => appointment.patientId === id));
        
        // Get medical records
        const recordsData = await getPatientMedicalRecords(user.uid, id);
        setMedicalRecords(recordsData);
        
        // Get prescriptions
        const prescriptionData = await getAllPrescriptions(user.uid);
        setPrescriptions(prescriptionData.filter(prescription => prescription.patientId === id));
        
        // Get invoices
        const invoiceData = await getAllInvoices(user.uid);
        setInvoices(invoiceData.filter(invoice => invoice.patientId === id));
        
      } catch (error) {
        console.error('Error fetching patient data:', error);
        toast({
          title: "Error",
          description: "Failed to load patient data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPatientData();
  }, [user, id, toast, navigate]);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(parseISO(dateString), 'MMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };
  
  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Get status badge
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
  
  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-2 mb-6">
            <Button variant="ghost" size="icon" onClick={() => navigate('/patients')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Skeleton className="h-8 w-48" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-64 rounded-lg" />
            <Skeleton className="h-64 rounded-lg md:col-span-2" />
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  if (!patient) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Patient Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The patient you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/patients')}>
              Return to Patients
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        {/* Header with back button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate('/patients')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Patient Details</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => navigate(`/patients/${id}/edit`)}
            >
              <Pencil className="h-4 w-4" />
              Edit Patient
            </Button>
            <Button 
              className="flex items-center gap-2"
              onClick={() => navigate(`/appointments?patientId=${id}&patientName=${encodeURIComponent(patient.name)}`)}
            >
              <Calendar className="h-4 w-4" />
              New Appointment
            </Button>
          </div>
        </div>
        
        {/* Patient Info and Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Patient Info Card */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle>Patient Information</CardTitle>
                {getStatusBadge(patient.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center mb-6">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarFallback className="text-xl">
                    {getInitials(patient.name)}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">{patient.name}</h2>
                <p className="text-sm text-muted-foreground">
                  Patient since {patient.createdAt ? formatDate(patient.createdAt.toString()) : 'N/A'}
                </p>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <Mail className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{patient.email || 'No email provided'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">{patient.phone || 'No phone provided'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Date of Birth</p>
                    <p className="text-sm text-muted-foreground">{formatDate(patient.dateOfBirth)}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Users className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Gender</p>
                    <p className="text-sm text-muted-foreground">{patient.gender || 'Not specified'}</p>
                  </div>
                </div>
                
                {patient.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Address</p>
                      <p className="text-sm text-muted-foreground">{patient.address}</p>
                    </div>
                  </div>
                )}
                
                {patient.insuranceProvider && (
                  <div className="flex items-start gap-2">
                    <FileText className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Insurance</p>
                      <p className="text-sm text-muted-foreground">
                        {patient.insuranceProvider}
                        {patient.insuranceNumber && (
                          <span className="block text-xs">{patient.insuranceNumber}</span>
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Patient Data Tabs */}
          <div className="md:col-span-2">
            <Tabs defaultValue="overview">
              <TabsList className="grid grid-cols-5 mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="appointments">Appointments</TabsTrigger>
                <TabsTrigger value="records">Records</TabsTrigger>
                <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
                <TabsTrigger value="invoices">Invoices</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <Card>
                  <CardHeader>
                    <CardTitle>Patient Overview</CardTitle>
                    <CardDescription>
                      Summary of {patient.name}'s medical information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <h3 className="font-medium">Appointments</h3>
                        </div>
                        <p className="text-2xl font-bold">{appointments.length}</p>
                        <p className="text-sm text-muted-foreground">
                          {appointments.filter(a => a.status === 'Scheduled').length} upcoming
                        </p>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Pill className="h-4 w-4 text-primary" />
                          <h3 className="font-medium">Prescriptions</h3>
                        </div>
                        <p className="text-2xl font-bold">{prescriptions.length}</p>
                        <p className="text-sm text-muted-foreground">
                          {prescriptions.filter(p => p.status === 'Active').length} active
                        </p>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <ClipboardList className="h-4 w-4 text-primary" />
                          <h3 className="font-medium">Medical Records</h3>
                        </div>
                        <p className="text-2xl font-bold">{medicalRecords.length}</p>
                        <p className="text-sm text-muted-foreground">
                          Last updated: {medicalRecords.length > 0 
                            ? formatDate(medicalRecords[0].date) 
                            : 'Never'}
                        </p>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="h-4 w-4 text-primary" />
                          <h3 className="font-medium">Invoices</h3>
                        </div>
                        <p className="text-2xl font-bold">{invoices.length}</p>
                        <p className="text-sm text-muted-foreground">
                          {invoices.filter(i => i.status !== 'paid').length} unpaid
                        </p>
                      </div>
                    </div>
                    
                    {/* Recent Activity */}
                    <div className="mt-6">
                      <h3 className="font-medium mb-3">Recent Activity</h3>
                      <div className="space-y-3">
                        {/* This would be populated with recent appointments, prescriptions, etc. */}
                        {appointments.length === 0 && prescriptions.length === 0 && medicalRecords.length === 0 ? (
                          <p className="text-sm text-muted-foreground">No recent activity</p>
                        ) : (
                          <>
                            {/* Show most recent activities */}
                            {/* This is a simplified version */}
                            {appointments.slice(0, 2).map((appointment, index) => (
                              <div key={`app-${index}`} className="flex items-center gap-3 p-2 rounded-lg border">
                                <Clock className="h-4 w-4 text-primary" />
                                <div>
                                  <p className="text-sm font-medium">Appointment: {appointment.type}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {formatDate(appointment.date)} at {appointment.time}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="appointments">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Appointments</CardTitle>
                      <CardDescription>
                        {patient.name}'s appointment history
                      </CardDescription>
                    </div>
                    <Button 
                      onClick={() => navigate(`/appointments?patientId=${id}&patientName=${encodeURIComponent(patient.name)}`)}
                      size="sm"
                    >
                      New Appointment
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {appointments.length === 0 ? (
                      <div className="text-center py-6">
                        <Calendar className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-2" />
                        <h3 className="font-medium">No Appointments</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          This patient doesn't have any appointments yet.
                        </p>
                        <Button 
                          onClick={() => navigate(`/appointments?patientId=${id}&patientName=${encodeURIComponent(patient.name)}`)}
                          variant="outline"
                          size="sm"
                        >
                          Schedule Appointment
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Appointment list would go here */}
                        {appointments.map((appointment, index) => (
                          <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                            <div>
                              <div className="font-medium">{appointment.type}</div>
                              <div className="text-sm text-muted-foreground">
                                {formatDate(appointment.date)} at {appointment.time}
                              </div>
                            </div>
                            <Badge
                              variant="outline"
                              className={
                                appointment.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' :
                                appointment.status === 'Scheduled' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                appointment.status === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                                'bg-amber-50 text-amber-700 border-amber-200'
                              }
                            >
                              {appointment.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="records">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Medical Records</CardTitle>
                      <CardDescription>
                        Patient's medical history
                      </CardDescription>
                    </div>
                    <Button 
                      onClick={() => navigate(`/medical-records/new?patientId=${id}&patientName=${encodeURIComponent(patient.name)}`)}
                      size="sm"
                    >
                      Add Record
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {medicalRecords.length === 0 ? (
                      <div className="text-center py-6">
                        <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-2" />
                        <h3 className="font-medium">No Medical Records</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          No medical records have been added for this patient yet.
                        </p>
                        <Button 
                          onClick={() => navigate(`/medical-records/new?patientId=${id}&patientName=${encodeURIComponent(patient.name)}`)}
                          variant="outline"
                          size="sm"
                        >
                          Add First Record
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Medical records list would go here */}
                        {medicalRecords.slice(0, 5).map((record, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-medium">{record.type || "Medical Visit"}</h3>
                              <Badge variant="outline">{formatDate(record.date)}</Badge>
                            </div>
                            {record.diagnosis && (
                              <div className="mb-2">
                                <span className="text-sm font-medium">Diagnosis: </span>
                                <span className="text-sm">{record.diagnosis}</span>
                              </div>
                            )}
                            {record.notes && (
                              <p className="text-sm text-muted-foreground">{record.notes}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="prescriptions">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Prescriptions</CardTitle>
                      <CardDescription>
                        Medications prescribed to the patient
                      </CardDescription>
                    </div>
                    <Button 
                      onClick={() => navigate(`/prescriptions/new?patientId=${id}&patientName=${encodeURIComponent(patient.name)}`)}
                      size="sm"
                    >
                      New Prescription
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {/* Prescription content would go here */}
                    {prescriptions.length === 0 ? (
                      <div className="text-center py-6">
                        <Pill className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-2" />
                        <h3 className="font-medium">No Prescriptions</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          No prescriptions have been created for this patient.
                        </p>
                        <Button 
                          onClick={() => navigate(`/prescriptions/new?patientId=${id}&patientName=${encodeURIComponent(patient.name)}`)}
                          variant="outline"
                          size="sm"
                        >
                          Create Prescription
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Prescription list */}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="invoices">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Invoices</CardTitle>
                      <CardDescription>
                        Billing information and payment history
                      </CardDescription>
                    </div>
                    <Button 
                      onClick={() => navigate(`/invoices/new?patientId=${id}&patientName=${encodeURIComponent(patient.name)}`)}
                      size="sm"
                    >
                      New Invoice
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {/* Invoice content would go here */}
                    {invoices.length === 0 ? (
                      <div className="text-center py-6">
                        <DollarSign className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-2" />
                        <h3 className="font-medium">No Invoices</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          No invoices have been generated for this patient.
                        </p>
                        <Button 
                          onClick={() => navigate(`/invoices/new?patientId=${id}&patientName=${encodeURIComponent(patient.name)}`)}
                          variant="outline"
                          size="sm"
                        >
                          Create Invoice
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Invoice list */}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientDetail; 