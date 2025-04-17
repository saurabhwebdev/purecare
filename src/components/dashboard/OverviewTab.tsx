import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { format, parseISO, subDays } from 'date-fns';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// Icons
import {
  Users,
  Calendar,
  FileText,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  BarChart2,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  FilePlus,
  Stethoscope,
  Clipboard,
  UserPlus,
  PlusCircle,
  FileCheck,
  CircleDollarSign,
  CreditCard,
  Activity
} from 'lucide-react';

// Types
import { Patient, Appointment, MedicalRecord } from '@/lib/firebase/patientService';
import { Prescription } from '@/lib/firebase/prescriptionService';
import { Invoice } from '@/lib/firebase/invoiceService';

interface OverviewTabProps {
  patients: Patient[];
  appointments: Appointment[];
  prescriptions: Prescription[];
  invoices: Invoice[];
  medicalRecords: MedicalRecord[];
  patientInsights: any;
  appointmentInsights: any;
  financialInsights: any;
  clinicalInsights: any;
  settings: any;
  loading: boolean;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  patients,
  appointments,
  prescriptions,
  invoices,
  medicalRecords,
  patientInsights,
  appointmentInsights,
  financialInsights,
  clinicalInsights,
  settings,
  loading
}) => {
  if (loading) {
    return <OverviewSkeleton />;
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    const currency = settings?.financial?.currency || 'USD';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Scheduled':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Scheduled</Badge>;
      case 'Completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case 'Cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>;
      case 'No-Show':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">No-Show</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get activity icon and color based on type and status
  const getActivityIcon = (type: string, status?: string) => {
    if (type === 'appointment') {
      switch (status) {
        case 'Scheduled':
          return { icon: <Calendar className="h-4 w-4" />, bgColor: 'bg-blue-100', textColor: 'text-blue-700' };
        case 'Completed':
          return { icon: <CheckCircle2 className="h-4 w-4" />, bgColor: 'bg-green-100', textColor: 'text-green-700' };
        case 'Cancelled':
          return { icon: <XCircle className="h-4 w-4" />, bgColor: 'bg-red-100', textColor: 'text-red-700' };
        case 'No-Show':
          return { icon: <AlertCircle className="h-4 w-4" />, bgColor: 'bg-amber-100', textColor: 'text-amber-700' };
        default:
          return { icon: <Clock className="h-4 w-4" />, bgColor: 'bg-gray-100', textColor: 'text-gray-700' };
      }
    } else if (type === 'prescription') {
      return { icon: <FilePlus className="h-4 w-4" />, bgColor: 'bg-indigo-100', textColor: 'text-indigo-700' };
    } else if (type === 'invoice') {
      switch (status) {
        case 'paid':
          return { icon: <CircleDollarSign className="h-4 w-4" />, bgColor: 'bg-green-100', textColor: 'text-green-700' };
        case 'overdue':
          return { icon: <AlertCircle className="h-4 w-4" />, bgColor: 'bg-red-100', textColor: 'text-red-700' };
        default:
          return { icon: <CreditCard className="h-4 w-4" />, bgColor: 'bg-orange-100', textColor: 'text-orange-700' };
      }
    } else if (type === 'medicalRecord') {
      return { icon: <Clipboard className="h-4 w-4" />, bgColor: 'bg-purple-100', textColor: 'text-purple-700' };
    } else if (type === 'patient') {
      return { icon: <UserPlus className="h-4 w-4" />, bgColor: 'bg-teal-100', textColor: 'text-teal-700' };
    } else {
      return { icon: <Activity className="h-4 w-4" />, bgColor: 'bg-primary/10', textColor: 'text-primary' };
    }
  };

  // Format activity description
  const getActivityDescription = (type: string, data: any, status?: string) => {
    if (type === 'appointment') {
      switch (status) {
        case 'Scheduled':
          return `Appointment scheduled with ${data.patientName}`;
        case 'Completed':
          return `Completed appointment with ${data.patientName}`;
        case 'Cancelled':
          return `Cancelled appointment with ${data.patientName}`;
        case 'No-Show':
          return `No-show for appointment with ${data.patientName}`;
        default:
          return `Appointment with ${data.patientName}`;
      }
    } else if (type === 'prescription') {
      return `Prescription created for ${data.patientName}`;
    } else if (type === 'invoice') {
      switch (status) {
        case 'paid':
          return `Invoice #${data.invoiceNumber} paid (${formatCurrency(data.total)})`;
        case 'overdue':
          return `Invoice #${data.invoiceNumber} is overdue (${formatCurrency(data.total)})`;
        default:
          return `Invoice #${data.invoiceNumber} created (${formatCurrency(data.total)})`;
      }
    } else if (type === 'medicalRecord') {
      return `Medical record updated for ${data.patientName}`;
    } else if (type === 'patient') {
      return `New patient registered: ${data.firstName} ${data.lastName}`;
    } else {
      return "Activity logged";
    }
  };

  // Combine different activities and sort by date
  const getRecentActivities = () => {
    const activities = [];

    // Add appointment activities
    appointments
      .filter(a => parseISO(a.date) >= subDays(new Date(), 14))
      .forEach(appointment => {
        activities.push({
          type: 'appointment',
          data: appointment,
          status: appointment.status,
          date: parseISO(appointment.date),
          time: appointment.time
        });
      });

    // Add prescription activities (if they have createdAt date)
    prescriptions
      .filter(p => p.createdAt && new Date(p.createdAt as any) >= subDays(new Date(), 14))
      .forEach(prescription => {
        activities.push({
          type: 'prescription',
          data: prescription,
          date: new Date(prescription.createdAt as any),
          time: format(new Date(prescription.createdAt as any), 'HH:mm')
        });
      });

    // Add invoice activities (if they have createdAt date)
    invoices
      .filter(i => i.createdAt && new Date(i.createdAt as any) >= subDays(new Date(), 14))
      .forEach(invoice => {
        activities.push({
          type: 'invoice',
          data: invoice,
          status: invoice.status,
          date: new Date(invoice.createdAt as any),
          time: format(new Date(invoice.createdAt as any), 'HH:mm')
        });
      });

    // Add new patients (registered in the last 14 days)
    patients
      .filter(p => p.createdAt && new Date(p.createdAt as any) >= subDays(new Date(), 14))
      .forEach(patient => {
        activities.push({
          type: 'patient',
          data: patient,
          date: new Date(patient.createdAt as any),
          time: format(new Date(patient.createdAt as any), 'HH:mm')
        });
      });

    // Sort activities by date (newest first)
    return activities.sort((a, b) => b.date.getTime() - a.date.getTime());
  };

  const recentActivities = getRecentActivities();

  return (
    <div className="space-y-6">
      {/* Recent Activity & Insights Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Column */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <CardDescription>Latest updates from your practice</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.slice(0, 7).map((activity, i) => {
                const { icon, bgColor, textColor } = getActivityIcon(activity.type, activity.status);
                const description = getActivityDescription(activity.type, activity.data, activity.status);
                
                return (
                  <div key={i} className="flex items-start gap-3 pb-3 border-b last:border-b-0">
                    <div className={`${bgColor} ${textColor} rounded-full p-2 mt-1`}>
                      {icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{description}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(activity.date, 'MMM dd')} at {activity.time}
                      </p>
                      {activity.status && activity.type === 'appointment' && (
                        <div className="mt-1">
                          {getStatusBadge(activity.status)}
                        </div>
                      )}
                      {activity.type === 'invoice' && activity.status && (
                        <div className="mt-1">
                          <Badge 
                            variant="outline" 
                            className={
                              activity.status === 'paid' ? 'bg-green-50 text-green-700 border-green-200' :
                              activity.status === 'overdue' ? 'bg-red-50 text-red-700 border-red-200' :
                              'bg-orange-50 text-orange-700 border-orange-200'
                            }
                          >
                            {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-4 text-muted-foreground text-sm">
                No recent activity found
              </div>
            )}
          </CardContent>
          {recentActivities.length > 7 && (
            <CardFooter className="pt-0">
              <div className="text-center w-full">
                <p className="text-xs text-muted-foreground">
                  + {recentActivities.length - 7} more activities
                </p>
              </div>
            </CardFooter>
          )}
        </Card>

        {/* Appointment Trends Column */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Appointment Trends</CardTitle>
            <CardDescription>Monthly appointment volume</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={appointmentInsights?.monthlyAppointments || []}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  name="Appointments" 
                  stroke="hsl(var(--primary))" 
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
        
      {/* Revenue & Patient Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue from paid invoices</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={financialInsights?.monthlyRevenue || []}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis 
                  tickFormatter={(value) => 
                    new Intl.NumberFormat('en-US', { 
                      style: 'currency', 
                      currency: settings?.financial?.currency || 'USD',
                      notation: 'compact',
                      compactDisplay: 'short'
                    }).format(value)
                  } 
                />
                <Tooltip 
                  formatter={(value: any) => 
                    [formatCurrency(value as number), 'Revenue']
                  } 
                />
                <Bar 
                  dataKey="revenue" 
                  name="Revenue" 
                  fill="hsl(var(--primary))" 
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
          
        {/* Patient Demographics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Patient Demographics</CardTitle>
            <CardDescription>Distribution by gender</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={Object.entries(patientInsights?.genderDistribution || {})
                    .map(([name, value]) => ({ name, value }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {Object.entries(patientInsights?.genderDistribution || {}).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={
                      index === 0 ? 'hsl(var(--primary))' :
                      index === 1 ? 'hsl(var(--primary) / 0.8)' :
                      index === 2 ? 'hsl(var(--primary) / 0.6)' :
                      index === 3 ? 'hsl(var(--primary) / 0.4)' :
                      'hsl(var(--primary) / 0.2)'
                    } />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`${value} patients`, '']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Appointments & Key Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Week */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Week</CardTitle>
            <CardDescription>Next 7 days of scheduled appointments</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={appointmentInsights?.nextWeek || []}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip 
                  formatter={(value: any) => [`${value} appointments`, '']}
                  labelFormatter={(label) => `Scheduled on ${label}`}
                />
                <Bar 
                  dataKey="count" 
                  name="Appointments" 
                  fill="hsl(var(--primary))" 
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
          
        {/* Key Financial Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Financial Health</CardTitle>
            <CardDescription>Key performance metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Revenue</span>
                <span className="font-medium">{formatCurrency(financialInsights?.totalRevenue || 0)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Outstanding Amount</span>
                <span className="font-medium">{formatCurrency(financialInsights?.outstandingAmount || 0)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Paid Invoices</span>
                <span className="font-medium">{invoices.filter(i => i.status === 'paid').length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Pending Invoices</span>
                <span className="font-medium">{invoices.filter(i => i.status !== 'paid' && i.status !== 'cancelled').length}</span>
              </div>
            </div>
            <Separator />
            <div className="pt-2">
              <h4 className="text-sm font-medium mb-2">Invoice Status</h4>
              {Object.entries(financialInsights?.statusDistribution || {}).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ 
                        backgroundColor: 
                          status === 'paid' ? 'hsl(var(--success))' : 
                          status === 'draft' ? 'hsl(var(--muted))' : 
                          status === 'sent' ? 'hsl(var(--primary))' :
                          status === 'overdue' ? 'hsl(var(--destructive))' :
                          'hsl(var(--accent))'
                      }}
                    ></div>
                    <span className="text-xs">{status}</span>
                  </div>
                  <span className="text-xs font-medium">{count as number}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Practice Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Patients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="mr-2">
                <div className="text-2xl font-bold">{patients.length}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {patientInsights?.monthlyNewPatients && patientInsights.monthlyNewPatients.length > 0 ? (
                    <div className="flex items-center">
                      <span className="flex items-center gap-1 text-green-600">
                        <ArrowUpRight className="h-3 w-3" />
                        {patientInsights.monthlyNewPatients[patientInsights.monthlyNewPatients.length - 1].count} new
                      </span>
                      <span className="ml-1">this month</span>
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="ml-auto p-2 bg-primary/10 text-primary rounded-full">
                <Users className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="mr-2">
                <div className="text-2xl font-bold">
                  {appointments.filter(a => a.status === 'Scheduled' && parseISO(a.date) >= new Date()).length}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {appointmentInsights?.nextWeek && appointmentInsights.nextWeek.length > 0 ? (
                    <div className="flex items-center">
                      <span>{appointmentInsights.nextWeek[0].count} today</span>
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="ml-auto p-2 bg-blue-100 text-blue-700 rounded-full">
                <Calendar className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Monthly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="mr-2">
                <div className="text-2xl font-bold">
                  {financialInsights?.monthlyRevenue && financialInsights.monthlyRevenue.length > 0 ? (
                    formatCurrency(financialInsights.monthlyRevenue[financialInsights.monthlyRevenue.length - 1].revenue)
                  ) : formatCurrency(0)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {financialInsights?.monthlyRevenue && financialInsights.monthlyRevenue.length > 1 ? (() => {
                    const current = financialInsights.monthlyRevenue[financialInsights.monthlyRevenue.length - 1].revenue;
                    const previous = financialInsights.monthlyRevenue[financialInsights.monthlyRevenue.length - 2].revenue;
                    const diff = current - previous;
                    const percentage = previous !== 0 ? (diff / previous) * 100 : 0;
                    return (
                      <div className="flex items-center">
                        {diff >= 0 ? (
                          <span className="flex items-center gap-1 text-green-600">
                            <ArrowUpRight className="h-3 w-3" />
                            {percentage.toFixed(1)}%
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-red-600">
                            <ArrowDownRight className="h-3 w-3" />
                            {Math.abs(percentage).toFixed(1)}%
                          </span>
                        )}
                        <span className="ml-1">vs last month</span>
                      </div>
                    );
                  })() : null}
                </div>
              </div>
              <div className="ml-auto p-2 bg-green-100 text-green-700 rounded-full">
                <DollarSign className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Medical Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="mr-2">
                <div className="text-2xl font-bold">{medicalRecords.length}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {prescriptions.length > 0 ? (
                    <div className="flex items-center">
                      <span>{prescriptions.filter(p => p.status === 'active').length} active prescriptions</span>
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="ml-auto p-2 bg-purple-100 text-purple-700 rounded-full">
                <FileText className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const OverviewSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
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
      <div className="lg:col-span-2">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-5 bg-muted rounded w-32 mb-2"></div>
            <div className="h-3 bg-muted rounded w-48"></div>
          </CardHeader>
          <CardContent>
            <div className="h-[320px] bg-muted rounded"></div>
          </CardContent>
        </Card>
      </div>
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-5 bg-muted rounded w-32 mb-2"></div>
            <div className="h-3 bg-muted rounded w-48"></div>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] bg-muted rounded"></div>
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-1">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-5 bg-muted rounded w-32 mb-2"></div>
            <div className="h-3 bg-muted rounded w-48"></div>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] bg-muted rounded"></div>
          </CardContent>
        </Card>
      </div>
    </div>
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
  </div>
);

export default OverviewTab; 