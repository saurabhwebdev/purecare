import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format, parseISO, subDays, startOfMonth, endOfMonth } from 'date-fns';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';

// Icons
import {
  Activity,
  FileText,
  Pill,
  Stethoscope,
  ClipboardCheck,
  Filter,
  Plus,
  ArrowRight,
  Calendar,
  CheckCircle,
  Info,
  Clock,
} from 'lucide-react';

// Types
import { MedicalRecord } from '@/lib/firebase/patientService';
import { Prescription } from '@/lib/firebase/prescriptionService';

interface ClinicalTabProps {
  medicalRecords: MedicalRecord[];
  prescriptions: Prescription[];
  loading: boolean;
  clinicalInsights: any;
}

const ClinicalTab: React.FC<ClinicalTabProps> = ({ 
  medicalRecords, 
  prescriptions, 
  loading, 
  clinicalInsights 
}) => {
  if (loading) {
    return <ClinicalSkeleton />;
  }

  // Calculate common diagnoses for display
  const topDiagnoses = clinicalInsights?.topDiagnoses || [];
  
  // Calculate prescription count by month
  const prescriptionTrend = clinicalInsights?.monthlyPrescriptions || [];
  
  // Calculate active medications
  const activeMedications = prescriptions
    .filter(p => p.status === 'active')
    .reduce((acc: Record<string, number>, prescription) => {
      prescription.medicines.forEach(med => {
        const medName = med.name;
        acc[medName] = (acc[medName] || 0) + 1;
      });
      return acc;
    }, {});

  // Transform for chart
  const medicationData = Object.entries(activeMedications)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Medical Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{medicalRecords.length}</div>
              <div className="p-2 bg-primary/10 text-primary rounded-full">
                <FileText className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Prescriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{prescriptions.length}</div>
              <div className="p-2 bg-green-100 text-green-700 rounded-full">
                <Pill className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Medications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {Object.keys(activeMedications).length}
              </div>
              <div className="p-2 bg-blue-100 text-blue-700 rounded-full">
                <Activity className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Conditions Treated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {topDiagnoses.length}
              </div>
              <div className="p-2 bg-purple-100 text-purple-700 rounded-full">
                <Stethoscope className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clinical Data Visualization Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Common Conditions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Common Conditions</CardTitle>
            <CardDescription>
              Top diagnoses in medical records
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topDiagnoses}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis 
                  type="category" 
                  dataKey="diagnosis"
                  width={150}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip formatter={(value: any) => [`${value} patients`, 'Patients']} />
                <Bar 
                  dataKey="count" 
                  name="Patients" 
                  fill="hsl(var(--primary))" 
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Prescription Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Prescription Trend</CardTitle>
            <CardDescription>
              Monthly prescription volume
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={prescriptionTrend}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip formatter={(value: any) => [`${value} prescriptions`, 'Prescriptions']} />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  name="Prescriptions" 
                  stroke="hsl(var(--primary))" 
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Medications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top Prescribed Medications</CardTitle>
          <CardDescription>
            Most commonly prescribed medications
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={medicationData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip formatter={(value: any) => [`${value} prescriptions`, 'Prescriptions']} />
              <Bar 
                dataKey="count" 
                name="Prescriptions" 
                fill="hsl(var(--primary))" 
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Medical Records */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-lg">Recent Medical Records</CardTitle>
            <CardDescription>
              Latest patient medical records
            </CardDescription>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-2">
            <Button size="sm" asChild>
              <Link to="/medical-records/new">Add Record</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-12 p-4 font-medium text-sm border-b bg-muted/50">
              <div className="col-span-3 lg:col-span-2">Date</div>
              <div className="col-span-3 lg:col-span-2">Patient</div>
              <div className="col-span-3 lg:col-span-3">Diagnosis</div>
              <div className="col-span-3 lg:col-span-3 hidden md:block">Treatment</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>
            <div className="divide-y">
              {medicalRecords.length > 0 ? (
                [...medicalRecords]
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 5)
                  .map((record, index) => (
                    <div key={index} className="grid grid-cols-12 p-4 items-center text-sm">
                      <div className="col-span-3 lg:col-span-2">
                        {format(new Date(record.date), 'MMM d, yyyy')}
                      </div>
                      <div className="col-span-3 lg:col-span-2 font-medium">
                        {record.patientId} {/* Ideally would display patient name */}
                      </div>
                      <div className="col-span-3 lg:col-span-3">
                        <span className="truncate block max-w-[200px]">
                          {record.diagnosis}
                        </span>
                      </div>
                      <div className="col-span-3 lg:col-span-3 hidden md:block">
                        <span className="truncate block max-w-[200px]">
                          {record.treatment}
                        </span>
                      </div>
                      <div className="col-span-3 lg:col-span-2 text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/patients/${record.patientId}/records/${record.id}`}>
                            View
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  No medical records found
                </div>
              )}
            </div>
          </div>
          <div className="mt-4 flex justify-center">
            <Button variant="outline" asChild>
              <Link to="/medical-records">View All Records</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Prescriptions */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-lg">Recent Prescriptions</CardTitle>
            <CardDescription>
              Latest patient prescriptions
            </CardDescription>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-2">
            <Button size="sm" asChild>
              <Link to="/prescriptions/new">New Prescription</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-12 p-4 font-medium text-sm border-b bg-muted/50">
              <div className="col-span-3 lg:col-span-2">Date</div>
              <div className="col-span-3 lg:col-span-2">Patient</div>
              <div className="col-span-3 lg:col-span-3">Diagnosis</div>
              <div className="col-span-3 lg:col-span-3 hidden md:block">Medications</div>
              <div className="col-span-3 lg:col-span-2 text-right">Status</div>
            </div>
            <div className="divide-y">
              {prescriptions.length > 0 ? (
                [...prescriptions]
                  .sort((a, b) => {
                    const dateA = a.createdAt instanceof Date
                      ? a.createdAt
                      : new Date((a.createdAt as any).toDate());
                    const dateB = b.createdAt instanceof Date
                      ? b.createdAt
                      : new Date((b.createdAt as any).toDate());
                    return dateB.getTime() - dateA.getTime();
                  })
                  .slice(0, 5)
                  .map((prescription, index) => (
                    <div key={index} className="grid grid-cols-12 p-4 items-center text-sm">
                      <div className="col-span-3 lg:col-span-2">
                        {prescription.createdAt ? 
                          format(
                            prescription.createdAt instanceof Date 
                              ? prescription.createdAt 
                              : new Date((prescription.createdAt as any).toDate()), 
                            'MMM d, yyyy'
                          ) : 'No date'
                        }
                      </div>
                      <div className="col-span-3 lg:col-span-2 font-medium">
                        {prescription.patientName}
                      </div>
                      <div className="col-span-3 lg:col-span-3">
                        <span className="truncate block max-w-[200px]">
                          {prescription.diagnosis}
                        </span>
                      </div>
                      <div className="col-span-3 lg:col-span-3 hidden md:block">
                        <span className="truncate block max-w-[200px]">
                          {prescription.medicines.map(m => m.name).join(', ')}
                        </span>
                      </div>
                      <div className="col-span-3 lg:col-span-2 text-right">
                        <PrescriptionStatusBadge status={prescription.status} />
                      </div>
                    </div>
                  ))
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  No prescriptions found
                </div>
              )}
            </div>
          </div>
          <div className="mt-4 flex justify-center">
            <Button variant="outline" asChild>
              <Link to="/prescriptions">View All Prescriptions</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const PrescriptionStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  switch (status) {
    case 'active':
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>;
    case 'completed':
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Completed</Badge>;
    case 'cancelled':
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const ClinicalSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[...Array(2)].map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader>
            <div className="h-5 bg-muted rounded w-32 mb-2"></div>
            <div className="h-3 bg-muted rounded w-48"></div>
          </CardHeader>
          <CardContent>
            <div className="h-[320px] bg-muted rounded"></div>
          </CardContent>
        </Card>
      ))}
    </div>
    <Card className="animate-pulse">
      <CardHeader>
        <div className="h-5 bg-muted rounded w-32 mb-2"></div>
        <div className="h-3 bg-muted rounded w-48"></div>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] bg-muted rounded"></div>
      </CardContent>
    </Card>
  </div>
);

export default ClinicalTab; 