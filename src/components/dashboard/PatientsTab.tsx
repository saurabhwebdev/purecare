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
import { Avatar } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';

// Icons
import {
  Users,
  UserPlus,
  UserCheck,
  Calendar,
  Phone,
  Mail,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Filter,
} from 'lucide-react';

// Types
import { Patient } from '@/lib/firebase/patientService';

interface PatientsTabProps {
  patients: Patient[];
  loading: boolean;
  patientInsights: any;
}

const PatientsTab: React.FC<PatientsTabProps> = ({ patients, loading, patientInsights }) => {
  if (loading) {
    return <PatientsSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Patients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{patients.length}</div>
              <div className="p-2 bg-primary/10 text-primary rounded-full">
                <Users className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Patients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {patients.filter((p) => p.status === 'Active').length}
              </div>
              <div className="p-2 bg-green-100 text-green-700 rounded-full">
                <UserCheck className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              New This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {patients.filter((p) => {
                  if (!p.createdAt) return false;
                  const createDate = p.createdAt instanceof Date
                    ? p.createdAt
                    : new Date(p.createdAt as any);
                  return createDate >= startOfMonth(new Date()) && createDate <= endOfMonth(new Date());
                }).length}
              </div>
              <div className="p-2 bg-blue-100 text-blue-700 rounded-full">
                <UserPlus className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Patient Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="text-2xl font-bold">
                  {
                    (() => {
                      const thisMonth = patients.filter((p) => {
                        if (!p.createdAt) return false;
                        const createDate = p.createdAt instanceof Date
                          ? p.createdAt
                          : new Date(p.createdAt as any);
                        return createDate >= startOfMonth(new Date()) && createDate <= endOfMonth(new Date());
                      }).length;
                      
                      const lastMonth = patients.filter((p) => {
                        if (!p.createdAt) return false;
                        const createDate = p.createdAt instanceof Date
                          ? p.createdAt
                          : new Date(p.createdAt as any);
                        const lastMonthStart = startOfMonth(subDays(new Date(), 30));
                        const lastMonthEnd = endOfMonth(subDays(new Date(), 30));
                        return createDate >= lastMonthStart && createDate <= lastMonthEnd;
                      }).length;
                      
                      const percentChange = lastMonth === 0 
                        ? 100 
                        : Math.round(((thisMonth - lastMonth) / lastMonth) * 100);
                      
                      return `${percentChange > 0 ? '+' : ''}${percentChange}%`;
                    })()
                  }
                </div>
              </div>
              <div className="p-2 rounded-full">
                {
                  (() => {
                    const thisMonth = patients.filter((p) => {
                      if (!p.createdAt) return false;
                      const createDate = p.createdAt instanceof Date
                        ? p.createdAt
                        : new Date(p.createdAt as any);
                      return createDate >= startOfMonth(new Date()) && createDate <= endOfMonth(new Date());
                    }).length;
                    
                    const lastMonth = patients.filter((p) => {
                      if (!p.createdAt) return false;
                      const createDate = p.createdAt instanceof Date
                        ? p.createdAt
                        : new Date(p.createdAt as any);
                      const lastMonthStart = startOfMonth(subDays(new Date(), 30));
                      const lastMonthEnd = endOfMonth(subDays(new Date(), 30));
                      return createDate >= lastMonthStart && createDate <= lastMonthEnd;
                    }).length;
                    
                    const isPositive = thisMonth >= lastMonth;
                    
                    return isPositive ? (
                      <div className="bg-green-100 text-green-700">
                        <ArrowUpRight className="h-4 w-4" />
                      </div>
                    ) : (
                      <div className="bg-red-100 text-red-700">
                        <ArrowDownRight className="h-4 w-4" />
                      </div>
                    );
                  })()
                }
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Patient Demographics & Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient Demographics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Demographics</CardTitle>
            <CardDescription>
              Patient distribution by gender and status
            </CardDescription>
            <Tabs defaultValue="gender" className="mt-2">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="gender">Gender</TabsTrigger>
                <TabsTrigger value="status">Status</TabsTrigger>
              </TabsList>
              <TabsContent value="gender" className="h-80 mt-4">
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
              </TabsContent>
              <TabsContent value="status" className="h-80 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={Object.entries(patientInsights?.statusDistribution || {})
                        .map(([name, value]) => ({ name, value }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {Object.entries(patientInsights?.statusDistribution || {}).map((_, index) => (
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
              </TabsContent>
            </Tabs>
          </CardHeader>
        </Card>

        {/* Patient Growth */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">New Patient Growth</CardTitle>
            <CardDescription>
              Monthly new patient registrations
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={patientInsights?.monthlyNewPatients || []}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip formatter={(value: any) => [`${value} patients`, 'New Patients']} />
                <Area
                  type="monotone"
                  dataKey="count"
                  name="New Patients"
                  stroke="hsl(var(--primary))"
                  fillOpacity={1}
                  fill="url(#colorPatients)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Patients */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-lg">Recent Patients</CardTitle>
            <CardDescription>
              Recently added patients to your practice
            </CardDescription>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Filter className="h-3.5 w-3.5" />
              <span>Filter</span>
            </Button>
            <Button size="sm" asChild>
              <Link to="/patients/new">Add Patient</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-12 p-4 font-medium text-sm border-b bg-muted/50">
              <div className="col-span-5 lg:col-span-3">Patient</div>
              <div className="col-span-3 lg:col-span-2 hidden md:block">Gender</div>
              <div className="col-span-4 lg:col-span-2">Status</div>
              <div className="col-span-3 hidden lg:block">Contact</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>
            <div className="divide-y">
              {patients.length > 0 ? (
                [...patients]
                  .sort((a, b) => {
                    const dateA = a.createdAt instanceof Date
                      ? a.createdAt
                      : new Date(a.createdAt as any);
                    const dateB = b.createdAt instanceof Date
                      ? b.createdAt
                      : new Date(b.createdAt as any);
                    return dateB.getTime() - dateA.getTime();
                  })
                  .slice(0, 5)
                  .map((patient, index) => (
                    <div key={index} className="grid grid-cols-12 p-4 items-center text-sm">
                      <div className="col-span-5 lg:col-span-3 flex items-center gap-3">
                        <Avatar>
                          <div className="flex h-full w-full items-center justify-center bg-muted">
                            {patient.name ? patient.name.substring(0, 2).toUpperCase() : 'P'}
                          </div>
                        </Avatar>
                        <div>
                          <div className="font-medium">{patient.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {patient.dateOfBirth ? format(new Date(patient.dateOfBirth), 'MMM d, yyyy') : 'No DOB'}
                          </div>
                        </div>
                      </div>
                      <div className="col-span-3 lg:col-span-2 hidden md:block">
                        {patient.gender || 'Not specified'}
                      </div>
                      <div className="col-span-4 lg:col-span-2">
                        <PatientStatusBadge status={patient.status || 'Unknown'} />
                      </div>
                      <div className="col-span-3 hidden lg:block">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            <span>{patient.phone || 'No phone'}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <Mail className="h-3 w-3" />
                            <span className="truncate max-w-[150px]">{patient.email || 'No email'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-span-3 lg:col-span-2 text-right">
                        <Button variant="ghost" size="icon" asChild>
                          <Link to={`/patients/${patient.id}`}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  No patients found. Add your first patient to get started.
                </div>
              )}
            </div>
          </div>
          <div className="mt-4 flex justify-center">
            <Button variant="outline" asChild>
              <Link to="/patients">View All Patients</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const PatientStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  switch (status) {
    case 'Active':
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>;
    case 'Inactive':
      return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Inactive</Badge>;
    case 'Archived':
      return <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">Archived</Badge>;
    case 'Pending':
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Pending</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const PatientsSkeleton = () => (
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

export default PatientsTab; 