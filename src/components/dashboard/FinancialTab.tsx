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
  DollarSign,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  FileText,
  CheckCircle,
  Filter,
  Plus,
  Clock,
  AlertTriangle,
} from 'lucide-react';

// Types
import { Invoice } from '@/lib/firebase/invoiceService';

interface FinancialTabProps {
  invoices: Invoice[];
  loading: boolean;
  financialInsights: any;
  settings: any;
}

const FinancialTab: React.FC<FinancialTabProps> = ({ 
  invoices, 
  loading, 
  financialInsights,
  settings 
}) => {
  if (loading) {
    return <FinancialSkeleton />;
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    const currency = settings?.financial?.currency || 'USD';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  // Calculate financial metrics
  const paidInvoices = invoices.filter(i => i.status === 'paid');
  const unpaidInvoices = invoices.filter(i => i.status !== 'paid' && i.status !== 'cancelled');
  const overdueInvoices = invoices.filter(i => i.status === 'overdue');

  // Average payment time (in days)
  const avgPaymentTime = paidInvoices.length > 0 
    ? Math.round(paidInvoices.reduce((sum, invoice) => {
        const createdDate = invoice.createdAt instanceof Date 
          ? invoice.createdAt 
          : new Date((invoice.createdAt as any).toDate());
        const paidDate = invoice.paidAt instanceof Date 
          ? invoice.paidAt 
          : invoice.paidAt ? new Date((invoice.paidAt as any).toDate()) : null;
        
        if (!paidDate) return sum;
        const days = Math.round((paidDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
        return sum + days;
      }, 0) / paidInvoices.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {formatCurrency(financialInsights?.totalRevenue || 0)}
              </div>
              <div className="p-2 bg-primary/10 text-primary rounded-full">
                <DollarSign className="h-4 w-4" />
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              From {paidInvoices.length} paid invoices
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Outstanding
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {formatCurrency(financialInsights?.outstandingAmount || 0)}
              </div>
              <div className="p-2 bg-amber-100 text-amber-700 rounded-full">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              From {unpaidInvoices.length} unpaid invoices
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Payment Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {avgPaymentTime} days
              </div>
              <div className="p-2 bg-blue-100 text-blue-700 rounded-full">
                <CreditCard className="h-4 w-4" />
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Based on {paidInvoices.length} paid invoices
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Overdue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {overdueInvoices.length}
              </div>
              <div className="p-2 bg-red-100 text-red-700 rounded-full">
                <AlertTriangle className="h-4 w-4" />
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {overdueInvoices.length > 0 ? 
                `${formatCurrency(overdueInvoices.reduce((sum, i) => sum + i.total, 0))} overdue` : 
                'No overdue invoices'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart & Invoice Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Revenue Overview</CardTitle>
            <CardDescription>
              Monthly revenue from paid invoices
            </CardDescription>
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

        {/* Invoice Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Invoice Status</CardTitle>
            <CardDescription>
              Distribution by invoice status
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={Object.entries(financialInsights?.statusDistribution || {})
                    .map(([name, value]) => ({ name, value }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {Object.entries(financialInsights?.statusDistribution || {}).map(([status], index) => (
                    <Cell key={`cell-${index}`} fill={
                      status === 'paid' ? 'hsl(var(--success))' : 
                      status === 'draft' ? 'hsl(var(--muted))' : 
                      status === 'sent' ? 'hsl(var(--primary))' :
                      status === 'overdue' ? 'hsl(var(--destructive))' :
                      'hsl(var(--accent))'
                    } />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`${value} invoices`, '']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Invoices */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-lg">Recent Invoices</CardTitle>
            <CardDescription>
              Latest invoices and their status
            </CardDescription>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Filter className="h-3.5 w-3.5" />
              <span>Filter</span>
            </Button>
            <Button size="sm" asChild>
              <Link to="/invoices/new">Create Invoice</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-12 p-4 font-medium text-sm border-b bg-muted/50">
              <div className="col-span-3 lg:col-span-2">Invoice #</div>
              <div className="col-span-3 lg:col-span-2">Patient</div>
              <div className="col-span-3 lg:col-span-2">Date</div>
              <div className="col-span-3 lg:col-span-2 hidden md:block">Amount</div>
              <div className="col-span-3 lg:col-span-2">Status</div>
              <div className="col-span-3 lg:col-span-2 text-right">Actions</div>
            </div>
            <div className="divide-y">
              {invoices.length > 0 ? (
                [...invoices]
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
                  .map((invoice, index) => (
                    <div key={index} className="grid grid-cols-12 p-4 items-center text-sm">
                      <div className="col-span-3 lg:col-span-2">
                        <div className="font-medium">{invoice.invoiceNumber}</div>
                      </div>
                      <div className="col-span-3 lg:col-span-2">
                        {invoice.patientName}
                      </div>
                      <div className="col-span-3 lg:col-span-2">
                        {invoice.createdAt ? 
                          format(
                            invoice.createdAt instanceof Date 
                              ? invoice.createdAt 
                              : new Date((invoice.createdAt as any).toDate()), 
                            'MMM d, yyyy'
                          ) : 'No date'
                        }
                      </div>
                      <div className="col-span-3 lg:col-span-2 hidden md:block">
                        {formatCurrency(invoice.total)}
                      </div>
                      <div className="col-span-3 lg:col-span-2">
                        <InvoiceStatusBadge status={invoice.status} />
                      </div>
                      <div className="col-span-3 lg:col-span-2 text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/invoices/${invoice.id}`}>View</Link>
                        </Button>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  No invoices found. Create your first invoice to get started.
                </div>
              )}
            </div>
          </div>
          <div className="mt-4 flex justify-center">
            <Button variant="outline" asChild>
              <Link to="/invoices">View All Invoices</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Financial Health Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Financial Health</CardTitle>
          <CardDescription>Key performance metrics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Revenue Metrics</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Average Invoice Value</span>
                  <span className="font-medium">
                    {invoices.length > 0 
                      ? formatCurrency(invoices.reduce((sum, i) => sum + i.total, 0) / invoices.length) 
                      : formatCurrency(0)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Collection Rate</span>
                  <span className="font-medium">
                    {invoices.length > 0 
                      ? `${Math.round((paidInvoices.length / invoices.length) * 100)}%` 
                      : '0%'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Revenue/Patient (Avg)</span>
                  <span className="font-medium">
                    {invoices.length > 0 
                      ? formatCurrency(financialInsights?.totalRevenue / new Set(invoices.map(i => i.patientId)).size)
                      : formatCurrency(0)}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Invoice Status</h3>
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
                    <span className="text-sm">{status}</span>
                  </div>
                  <span className="text-sm font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const InvoiceStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  switch (status) {
    case 'paid':
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Paid</Badge>;
    case 'draft':
      return <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">Draft</Badge>;
    case 'sent':
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Sent</Badge>;
    case 'overdue':
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Overdue</Badge>;
    case 'cancelled':
      return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Cancelled</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const FinancialSkeleton = () => (
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

export default FinancialTab; 