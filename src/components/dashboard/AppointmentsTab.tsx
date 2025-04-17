import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format, parseISO, subDays, startOfMonth, endOfMonth, addDays } from 'date-fns';
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
import { Calendar } from '@/components/ui/calendar';
import { Link } from 'react-router-dom';

// Icons
import {
  Calendar as CalendarIcon,
  Clock,
  Check,
  X,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Plus,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

// Types
import { Appointment } from '@/lib/firebase/patientService';

interface AppointmentsTabProps {
  appointments: Appointment[];
  loading: boolean;
  appointmentInsights: any;
}

const AppointmentsTab: React.FC<AppointmentsTabProps> = ({ 
  appointments, 
  loading, 
  appointmentInsights 
}) => {
  if (loading) {
    return <AppointmentsSkeleton />;
  }

  // Get today's date
  const today = new Date();

  // Calculate upcoming appointments (next 7 days)
  const upcomingAppointments = appointments.filter(appointment => {
    if (appointment.status !== 'Scheduled') return false;
    const appointmentDate = parseISO(appointment.date);
    const sevenDaysFromNow = addDays(today, 7);
    return appointmentDate >= today && appointmentDate <= sevenDaysFromNow;
  }).sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{appointments.length}</div>
              <div className="p-2 bg-primary/10 text-primary rounded-full">
                <CalendarIcon className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {appointments.filter(a => a.status === 'Completed').length}
              </div>
              <div className="p-2 bg-green-100 text-green-700 rounded-full">
                <Check className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Scheduled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {appointments.filter(a => a.status === 'Scheduled').length}
              </div>
              <div className="p-2 bg-blue-100 text-blue-700 rounded-full">
                <Clock className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              No-Show Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {
                  (() => {
                    const noShows = appointments.filter(a => a.status === 'No-Show').length;
                    const completed = appointments.filter(a => a.status === 'Completed').length;
                    const total = noShows + completed;
                    
                    if (total === 0) return '0%';
                    return `${Math.round((noShows / total) * 100)}%`;
                  })()
                }
              </div>
              <div className="p-2 bg-amber-100 text-amber-700 rounded-full">
                <AlertCircle className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Appointment Trends & Type Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointment Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Appointment Trends</CardTitle>
            <CardDescription>
              Monthly appointment volume
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={appointmentInsights?.monthlyAppointments || []}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip formatter={(value: any) => [`${value} appointments`, 'Appointments']} />
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

        {/* Appointment Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Appointment Types</CardTitle>
            <CardDescription>
              Distribution by appointment type
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={Object.entries(appointmentInsights?.typeDistribution || {})
                    .map(([name, value]) => ({ name, value }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {Object.entries(appointmentInsights?.typeDistribution || {}).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={
                      index === 0 ? 'hsl(var(--primary))' :
                      index === 1 ? 'hsl(var(--primary) / 0.8)' :
                      index === 2 ? 'hsl(var(--primary) / 0.6)' :
                      index === 3 ? 'hsl(var(--primary) / 0.4)' :
                      'hsl(var(--primary) / 0.2)'
                    } />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`${value} appointments`, '']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
            <CardDescription>
              Next 7 days of scheduled appointments
            </CardDescription>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Filter className="h-3.5 w-3.5" />
              <span>Filter</span>
            </Button>
            <Button size="sm" asChild>
              <Link to="/appointments/new">New Appointment</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Weekly View */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {Array.from({ length: 7 }, (_, i) => {
                const day = addDays(today, i);
                const count = appointments.filter(a => {
                  if (a.status !== 'Scheduled') return false;
                  const appointmentDate = parseISO(a.date);
                  return appointmentDate.toDateString() === day.toDateString();
                }).length;
                
                return (
                  <div 
                    key={i} 
                    className={`flex flex-col items-center p-2 rounded-lg border ${
                      i === 0 ? 'bg-primary/5 border-primary/30' : ''
                    }`}
                  >
                    <div className="text-xs font-medium">{format(day, 'EEE')}</div>
                    <div className="text-sm font-bold">{format(day, 'd')}</div>
                    {count > 0 && (
                      <div className="mt-1 text-xs px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                        {count}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Appointments List */}
            <div className="rounded-md border">
              <div className="grid grid-cols-12 p-4 font-medium text-sm border-b bg-muted/50">
                <div className="col-span-4 lg:col-span-3">Patient</div>
                <div className="col-span-4 lg:col-span-2">Date & Time</div>
                <div className="col-span-4 lg:col-span-2">Type</div>
                <div className="col-span-3 hidden lg:block">Provider</div>
                <div className="col-span-2 text-right">Status</div>
              </div>
              <div className="divide-y">
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map((appointment, index) => (
                    <div key={index} className="grid grid-cols-12 p-4 items-center text-sm">
                      <div className="col-span-4 lg:col-span-3">
                        <div className="font-medium">{appointment.patientName}</div>
                      </div>
                      <div className="col-span-4 lg:col-span-2">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="h-3 w-3 text-muted-foreground" />
                            <span>{format(parseISO(appointment.date), 'MMM d, yyyy')}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span>{appointment.time}</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-span-4 lg:col-span-2">
                        {appointment.type}
                      </div>
                      <div className="col-span-3 hidden lg:block">
                        {appointment.provider}
                      </div>
                      <div className="col-span-4 lg:col-span-2 text-right">
                        <AppointmentStatusBadge status={appointment.status} />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    No upcoming appointments found
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <Button variant="outline" asChild>
                <Link to="/appointments">View All Appointments</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Appointment Status</CardTitle>
          <CardDescription>
            Distribution by appointment status
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={Object.entries(appointmentInsights?.statusDistribution || {})
                .map(([name, value]) => ({ name, value }))}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={100}
              />
              <Tooltip formatter={(value: any) => [`${value} appointments`, '']} />
              <Bar 
                dataKey="value" 
                name="Appointments" 
                fill="hsl(var(--primary))" 
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

const AppointmentStatusBadge: React.FC<{ status: string }> = ({ status }) => {
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

const AppointmentsSkeleton = () => (
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

export default AppointmentsTab; 