import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAuth } from '@/lib/auth/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { format, parseISO, subDays, startOfMonth, endOfMonth, isSameMonth, addDays } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

// Dashboard Tab Components
import OverviewTab from '@/components/dashboard/OverviewTab';
import PatientsTab from '@/components/dashboard/PatientsTab';
import AppointmentsTab from '@/components/dashboard/AppointmentsTab';
import FinancialTab from '@/components/dashboard/FinancialTab';
import ClinicalTab from '@/components/dashboard/ClinicalTab';

// Services
import { 
  getPatients, 
  getAppointments, 
  getPatientMedicalRecords,
  Appointment,
  Patient,
  MedicalRecord 
} from '@/lib/firebase/patientService';
import { 
  getAllPrescriptions, 
  Prescription 
} from '@/lib/firebase/prescriptionService';
import { 
  getAllInvoices, 
  Invoice 
} from '@/lib/firebase/invoiceService';
import { getUserSettings } from '@/lib/firebase/settingsService';

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Data states
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [settings, setSettings] = useState<any>(null);

  // Derived states for insights
  const [patientInsights, setPatientInsights] = useState<any>(null);
  const [appointmentInsights, setAppointmentInsights] = useState<any>(null);
  const [financialInsights, setFinancialInsights] = useState<any>(null);
  const [clinicalInsights, setClinicalInsights] = useState<any>(null);

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Get user settings
        const userSettings = await getUserSettings(user.uid);
        setSettings(userSettings);
        
        // Fetch patients
        const patientData = await getPatients(user.uid);
        setPatients(patientData);
        
        // Fetch appointments
        const appointmentData = await getAppointments(user.uid);
        setAppointments(appointmentData);
        
        // Fetch prescriptions
        const prescriptionData = await getAllPrescriptions(user.uid);
        setPrescriptions(prescriptionData);
        
        // Fetch invoices
        const invoiceData = await getAllInvoices(user.uid);
        setInvoices(invoiceData);
        
        // Fetch medical records (this might be slow if there are many patients)
        let allRecords: MedicalRecord[] = [];
        for (const patient of patientData) {
          if (patient.id) {
            const records = await getPatientMedicalRecords(user.uid, patient.id);
            allRecords = [...allRecords, ...records];
          }
        }
        setMedicalRecords(allRecords);
        
        // Process insights after all data is loaded
        processInsights(patientData, appointmentData, prescriptionData, invoiceData, allRecords, userSettings);
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try refreshing the page.');
        toast({
          title: 'Error',
          description: 'Failed to load dashboard data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user, toast]);
  
  // Process all insights
  const processInsights = (
    patients: Patient[], 
    appointments: Appointment[], 
    prescriptions: Prescription[], 
    invoices: Invoice[], 
    medicalRecords: MedicalRecord[],
    settings: any
  ) => {
    // Process patient insights
    processPatientInsights(patients);
    
    // Process appointment insights
    processAppointmentInsights(appointments);
    
    // Process financial insights
    processFinancialInsights(invoices, settings);
    
    // Process clinical insights
    processClinicalInsights(prescriptions, medicalRecords);
  };
  
  // Process patient insights
  const processPatientInsights = (patients: Patient[]) => {
    // Calculate patient demographics by gender
    const genderDistribution = patients.reduce((acc: Record<string, number>, patient) => {
      const gender = patient.gender || 'Not Specified';
      acc[gender] = (acc[gender] || 0) + 1;
      return acc;
    }, {});
    
    // Calculate patient status distribution
    const statusDistribution = patients.reduce((acc: Record<string, number>, patient) => {
      const status = patient.status || 'Unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    
    // Calculate new patients per month (last 6 months)
    const monthlyNewPatients = Array.from({ length: 6 }, (_, i) => {
      const month = subDays(new Date(), 30 * i);
      const startOfMonthDate = startOfMonth(month);
      const endOfMonthDate = endOfMonth(month);
      
      return {
        month: format(month, 'MMM yyyy'),
        count: patients.filter(patient => {
          if (!patient.createdAt) return false;
          const patientDate = patient.createdAt instanceof Date 
            ? patient.createdAt 
            : new Date(patient.createdAt as any);
          return patientDate >= startOfMonthDate && patientDate <= endOfMonthDate;
        }).length
      };
    }).reverse();
    
    setPatientInsights({
      genderDistribution,
      statusDistribution,
      monthlyNewPatients
    });
  };
  
  // Process appointment insights
  const processAppointmentInsights = (appointments: Appointment[]) => {
    // Calculate appointment status distribution
    const statusDistribution = appointments.reduce((acc: Record<string, number>, appointment) => {
      const status = appointment.status || 'Unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    
    // Calculate appointments by type
    const typeDistribution = appointments.reduce((acc: Record<string, number>, appointment) => {
      const type = appointment.type || 'Other';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
    
    // Calculate monthly appointments (last 6 months)
    const monthlyAppointments = Array.from({ length: 6 }, (_, i) => {
      const month = subDays(new Date(), 30 * i);
      const startOfMonthDate = startOfMonth(month);
      const endOfMonthDate = endOfMonth(month);
      
      return {
        month: format(month, 'MMM yyyy'),
        count: appointments.filter(appointment => {
          if (!appointment.date) return false;
          const appointmentDate = parseISO(appointment.date);
          return appointmentDate >= startOfMonthDate && appointmentDate <= endOfMonthDate;
        }).length
      };
    }).reverse();
    
    // Calculate upcoming appointments by day
    const today = new Date();
    const nextWeek = Array.from({ length: 7 }, (_, i) => {
      const day = addDays(today, i);
      return {
        day: format(day, 'EEE'),
        date: format(day, 'MMM dd'),
        count: appointments.filter(appointment => {
          if (!appointment.date || appointment.status !== 'Scheduled') return false;
          const appointmentDate = parseISO(appointment.date);
          return appointmentDate.toDateString() === day.toDateString();
        }).length
      };
    });
    
    setAppointmentInsights({
      statusDistribution,
      typeDistribution,
      monthlyAppointments,
      nextWeek
    });
  };
  
  // Process financial insights
  const processFinancialInsights = (invoices: Invoice[], settings: any) => {
    // Calculate revenue by month (last 6 months)
    const monthlyRevenue = Array.from({ length: 6 }, (_, i) => {
      const month = subDays(new Date(), 30 * i);
      const startOfMonthDate = startOfMonth(month);
      const endOfMonthDate = endOfMonth(month);
      
      const total = invoices
        .filter(invoice => {
          if (!invoice.createdAt || invoice.status !== 'paid') return false;
          const invoiceDate = invoice.createdAt instanceof Date 
            ? invoice.createdAt 
            : new Date((invoice.createdAt as any).toDate());
          return invoiceDate >= startOfMonthDate && invoiceDate <= endOfMonthDate;
        })
        .reduce((sum, invoice) => sum + invoice.total, 0);
      
      return {
        month: format(month, 'MMM yyyy'),
        revenue: total
      };
    }).reverse();
    
    // Calculate invoice status distribution
    const statusDistribution = invoices.reduce((acc: Record<string, number>, invoice) => {
      const status = invoice.status || 'Unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    
    // Calculate total revenue and outstanding amount
    const totalRevenue = invoices
      .filter(invoice => invoice.status === 'paid')
      .reduce((sum, invoice) => sum + invoice.total, 0);
    
    const outstandingAmount = invoices
      .filter(invoice => invoice.status !== 'paid' && invoice.status !== 'cancelled')
      .reduce((sum, invoice) => sum + invoice.total, 0);
    
    setFinancialInsights({
      monthlyRevenue,
      statusDistribution,
      totalRevenue,
      outstandingAmount
    });
  };
  
  // Process clinical insights
  const processClinicalInsights = (prescriptions: Prescription[], medicalRecords: MedicalRecord[]) => {
    // Most common diagnoses
    const diagnoses = medicalRecords.reduce((acc: Record<string, number>, record) => {
      if (!record.diagnosis) return acc;
      acc[record.diagnosis] = (acc[record.diagnosis] || 0) + 1;
      return acc;
    }, {});
    
    const topDiagnoses = Object.entries(diagnoses)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([diagnosis, count]) => ({ diagnosis, count }));
    
    // Monthly prescriptions
    const monthlyPrescriptions = Array.from({ length: 6 }, (_, i) => {
      const month = subDays(new Date(), 30 * i);
      const startOfMonthDate = startOfMonth(month);
      const endOfMonthDate = endOfMonth(month);
      
      return {
        month: format(month, 'MMM yyyy'),
        count: prescriptions.filter(prescription => {
          if (!prescription.createdAt) return false;
          const prescriptionDate = prescription.createdAt instanceof Date 
            ? prescription.createdAt 
            : new Date((prescription.createdAt as any).toDate());
          return prescriptionDate >= startOfMonthDate && prescriptionDate <= endOfMonthDate;
        }).length
      };
    }).reverse();
    
    setClinicalInsights({
      topDiagnoses,
      monthlyPrescriptions
    });
  };

  return (
    <DashboardLayout>
      <div className="w-full backdrop-blur-md bg-background/80 py-4 border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">
                {user?.displayName 
                  ? `Welcome back, ${user.displayName}`
                  : 'Welcome to your clinic dashboard'}
              </p>
            </div>
            
            <Tabs defaultValue="overview" className="w-full md:w-auto" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 md:flex md:flex-row md:w-auto w-full">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="patients">Patients</TabsTrigger>
                <TabsTrigger value="appointments">Appointments</TabsTrigger>
                <TabsTrigger value="financial">Financial</TabsTrigger>
                <TabsTrigger value="clinical">Clinical</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-4 bg-muted rounded w-24"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-muted rounded w-16 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-full"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Error Loading Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{error}</p>
            </CardContent>
          </Card>
        ) : (
          <div>
            <Tabs value={activeTab} className="mt-6">
              <TabsContent value="overview">
                <OverviewTab 
                  patients={patients} 
                  appointments={appointments} 
                  prescriptions={prescriptions} 
                  invoices={invoices} 
                  medicalRecords={medicalRecords} 
                  patientInsights={patientInsights} 
                  appointmentInsights={appointmentInsights} 
                  financialInsights={financialInsights} 
                  clinicalInsights={clinicalInsights} 
                  settings={settings} 
                  loading={loading} 
                />
              </TabsContent>
              
              <TabsContent value="patients">
                <PatientsTab 
                  patients={patients} 
                  loading={loading} 
                  patientInsights={patientInsights} 
                />
              </TabsContent>
              
              <TabsContent value="appointments">
                <AppointmentsTab 
                  appointments={appointments} 
                  loading={loading} 
                  appointmentInsights={appointmentInsights} 
                />
              </TabsContent>
              
              <TabsContent value="financial">
                <FinancialTab 
                  invoices={invoices} 
                  loading={loading} 
                  financialInsights={financialInsights}
                  settings={settings}
                />
              </TabsContent>
              
              <TabsContent value="clinical">
                <ClinicalTab 
                  medicalRecords={medicalRecords}
                  prescriptions={prescriptions}
                  loading={loading} 
                  clinicalInsights={clinicalInsights}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
