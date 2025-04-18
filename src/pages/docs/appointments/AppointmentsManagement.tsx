import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter,
  CardDescription
} from '@/components/ui/card';
import { 
  ChevronLeft, 
  Home, 
  BookOpen, 
  ExternalLink, 
  Calendar, 
  Clock, 
  CalendarCheck, 
  CalendarX, 
  Filter, 
  BellRing, 
  Users, 
  Search 
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const AppointmentsManagementDoc = () => {
  const title = "Appointments Management Guide";
  const category = "appointments";
  const categoryName = "Appointments";
  const lastUpdated = "June 15, 2024";

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/docs" className="flex items-center gap-1 hover:text-foreground">
              <Home className="h-3.5 w-3.5" />
              <span>Docs</span>
            </Link>
            <span>/</span>
            <Link to={`/docs/${category}`} className="hover:text-foreground">
              {categoryName}
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium truncate">{title}</span>
          </div>

          {/* Article Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-3">{title}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="h-4 w-4" />
              <span>Last updated: {lastUpdated}</span>
            </div>
          </div>

          <Separator className="mb-8" />

          {/* Main Content */}
          <Card className="mb-8 border-primary/10 shadow-md">
            <CardHeader className="bg-primary/5 border-b border-primary/10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-full">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Overview</CardTitle>
                  <CardDescription className="text-base">Complete guide to managing appointments in PureCare</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none pt-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-8">
                <p className="font-medium text-blue-900 mb-2">
                  The Appointments Management module in PureCare enables healthcare providers to efficiently schedule, 
                  manage, and track patient appointments.
                </p>
                <p className="text-blue-800 mb-0">
                  This guide will walk you through the features and processes for effectively managing your appointment calendar.
                </p>
              </div>
              
              <Tabs defaultValue="key-features" className="mb-8">
                <TabsList className="w-full grid grid-cols-3 mb-4">
                  <TabsTrigger value="key-features">Key Features</TabsTrigger>
                  <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced Features</TabsTrigger>
                </TabsList>
                
                <TabsContent value="key-features" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-blue-50 border-blue-200">
                      <CardHeader className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-blue-700" />
                          <CardTitle className="text-md text-blue-900">Appointment Scheduling</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="py-3 px-4 text-sm text-blue-800">
                        Create and manage appointments for patients
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-green-50 border-green-200">
                      <CardHeader className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-green-700" />
                          <CardTitle className="text-md text-green-900">Status Management</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="py-3 px-4 text-sm text-green-800">
                        Track appointment statuses (scheduled, completed, cancelled, no-show)
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-purple-50 border-purple-200">
                      <CardHeader className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <BellRing className="h-5 w-5 text-purple-700" />
                          <CardTitle className="text-md text-purple-900">Reminders</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="py-3 px-4 text-sm text-purple-800">
                        Set up automated appointment reminders
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-amber-50 border-amber-200">
                      <CardHeader className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <CalendarCheck className="h-5 w-5 text-amber-700" />
                          <CardTitle className="text-md text-amber-900">Google Calendar</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="py-3 px-4 text-sm text-amber-800">
                        Sync appointments with Google Calendar
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="scheduling" className="mt-0">
                  <div className="space-y-4">
                    <Card>
                      <CardHeader className="py-3 bg-muted/30">
                        <CardTitle className="text-lg">1. Accessing the Appointments Module</CardTitle>
                      </CardHeader>
                      <CardContent className="py-4">
                        <ol className="space-y-2 mb-0">
                          <li className="flex items-center gap-2">
                            <Badge className="bg-primary text-white rounded-full h-6 w-6 p-0 flex items-center justify-center">1</Badge>
                            <span>Log in to your PureCare account</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Badge className="bg-primary text-white rounded-full h-6 w-6 p-0 flex items-center justify-center">2</Badge>
                            <span>From the dashboard, click on the <strong>Appointments</strong> link in the main navigation</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Badge className="bg-primary text-white rounded-full h-6 w-6 p-0 flex items-center justify-center">3</Badge>
                            <span>You will be directed to the appointments page where you can see a list of all appointments</span>
                          </li>
                        </ol>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="py-3 bg-muted/30">
                        <CardTitle className="text-lg">2. Scheduling a New Appointment</CardTitle>
                      </CardHeader>
                      <CardContent className="py-4">
                        <Alert className="mb-3 bg-blue-50 border-blue-200">
                          <Calendar className="h-4 w-4 text-blue-700" />
                          <AlertTitle className="text-blue-900">Appointment Details</AlertTitle>
                          <AlertDescription className="text-blue-800">
                            Fill out all required fields to ensure proper scheduling and patient notification.
                          </AlertDescription>
                        </Alert>
                        
                        <ol className="space-y-2 mb-0">
                          <li className="flex items-start gap-2">
                            <Badge className="bg-primary text-white rounded-full h-6 w-6 p-0 flex items-center justify-center mt-0.5">1</Badge>
                            <span>Navigate to the Appointments page</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Badge className="bg-primary text-white rounded-full h-6 w-6 p-0 flex items-center justify-center mt-0.5">2</Badge>
                            <span>Click the <strong>New Appointment</strong> button in the top-right corner</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Badge className="bg-primary text-white rounded-full h-6 w-6 p-0 flex items-center justify-center mt-0.5">3</Badge>
                            <div>
                              <span>Fill out the appointment details form:</span>
                              <ul className="mt-2 space-y-1">
                                <li>• Patient: Select from dropdown</li>
                                <li>• Date and Time: Select appointment time</li>
                                <li>• Type: Choose appointment type</li>
                                <li>• Duration: Set expected length</li>
                                <li>• Notes: Add any special instructions</li>
                                <li>• Google Calendar: Toggle sync option</li>
                              </ul>
                            </div>
                          </li>
                          <li className="flex items-start gap-2">
                            <Badge className="bg-primary text-white rounded-full h-6 w-6 p-0 flex items-center justify-center mt-0.5">4</Badge>
                            <span>Click <strong>Schedule Appointment</strong> to create the appointment</span>
                          </li>
                        </ol>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="advanced" className="mt-0">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="bg-slate-100 border-slate-300">
                        <CardHeader className="pb-2 pt-4">
                          <div className="flex items-center gap-2">
                            <Filter className="h-5 w-5 text-slate-700" />
                            <CardTitle className="text-md text-slate-900">Filtering & Search</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-2 text-sm text-slate-800">
                          <p>Filter appointments by status, date, patient name, and provider</p>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-slate-100 border-slate-300">
                        <CardHeader className="pb-2 pt-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-slate-700" />
                            <CardTitle className="text-md text-slate-900">Recurring Appointments</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-2 text-sm text-slate-800">
                          <p>Set up recurring appointments with customizable patterns</p>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Card>
                      <CardHeader className="bg-muted/30 border-b">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">Status Management</CardTitle>
                          <Clock className="h-5 w-5 text-primary" />
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <h4 className="font-medium">Mark as Completed</h4>
                            <p className="text-sm text-gray-700">Update status when appointment is fulfilled</p>
                          </div>
                          
                          <div className="space-y-1">
                            <h4 className="font-medium">Cancel Appointment</h4>
                            <p className="text-sm text-gray-700">Cancel when appointment needs to be removed</p>
                          </div>
                          
                          <div className="space-y-1">
                            <h4 className="font-medium">Mark as No-Show</h4>
                            <p className="text-sm text-gray-700">Record when patient doesn't attend</p>
                          </div>
                          
                          <div className="space-y-1">
                            <h4 className="font-medium">Reschedule</h4>
                            <p className="text-sm text-gray-700">Change date/time while preserving history</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
              
              <h2 className="text-xl font-bold mt-10 mb-4 flex items-center gap-2 pb-2 border-b border-muted">
                <Calendar className="h-5 w-5 text-primary" />
                Managing Appointments
              </h2>
              
              <h3 className="text-lg font-bold mt-8 mb-3 text-primary/90">Viewing Appointment Details</h3>
              <p className="text-gray-800 mb-4">
                To view details about a specific appointment:
              </p>
              <ol className="text-gray-800 mb-6">
                <li>Find the appointment in the appointments list</li>
                <li>Click on the appointment to view its details</li>
                <li>The appointment details panel will show information such as:
                  <ul>
                    <li>Patient information</li>
                    <li>Appointment date and time</li>
                    <li>Type and duration</li>
                    <li>Status</li>
                    <li>Notes</li>
                    <li>Google Calendar sync status</li>
                  </ul>
                </li>
              </ol>
              
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm mb-6">
                <div className="bg-muted/40 px-4 py-3 border-b">
                  <div className="text-sm font-medium">Status Color Coding</div>
                </div>
                <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="border rounded-md p-3 bg-blue-50 hover:bg-blue-100 transition-colors">
                    <div className="font-medium text-blue-900">Scheduled</div>
                    <div className="text-xs text-blue-800 mt-1">Upcoming appointments</div>
                  </div>
                  <div className="border rounded-md p-3 bg-green-50 hover:bg-green-100 transition-colors">
                    <div className="font-medium text-green-900">Completed</div>
                    <div className="text-xs text-green-800 mt-1">Fulfilled appointments</div>
                  </div>
                  <div className="border rounded-md p-3 bg-red-50 hover:bg-red-100 transition-colors">
                    <div className="font-medium text-red-900">Cancelled</div>
                    <div className="text-xs text-red-800 mt-1">Cancelled appointments</div>
                  </div>
                  <div className="border rounded-md p-3 bg-amber-50 hover:bg-amber-100 transition-colors">
                    <div className="font-medium text-amber-900">No-Show</div>
                    <div className="text-xs text-amber-800 mt-1">Missed appointments</div>
                  </div>
                </div>
              </div>
              
              <h3 className="text-lg font-bold mt-8 mb-3 text-primary/90">Google Calendar Integration</h3>
              <p className="text-gray-800 mb-4">
                If you've enabled Google Calendar integration, you can sync appointments:
              </p>
              <ol className="text-gray-800 mb-4">
                <li>For new appointments, toggle the "Sync with Google Calendar" option when creating the appointment</li>
                <li>For existing appointments, click the <strong>Actions</strong> menu and select "Sync to Google Calendar"</li>
                <li>Once synced, the appointment will display a Google Calendar badge</li>
                <li>Any updates to the appointment will automatically sync with Google Calendar</li>
              </ol>
              
              <p className="text-gray-800 mb-6">
                To learn more about setting up Google Calendar integration, see the <Link to="/docs/google-calendar/GoogleCalendarSetup" className="text-primary font-medium hover:underline">Google Calendar Setup Guide</Link>.
              </p>
              
              <div className="bg-gray-100 p-6 rounded-lg border border-gray-300 my-8">
                <div className="flex items-center gap-2 mb-4">
                  <CalendarCheck className="h-6 w-6 text-primary" />
                  <h3 className="text-lg font-bold m-0">Recurring Appointments</h3>
                </div>
                <p className="mb-2 text-gray-700">
                  For patients who need regular appointments, you can set up recurring appointments with different patterns:
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 mb-0">
                  <li className="flex items-center gap-2 bg-white p-2 rounded border">
                    <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                    <span className="text-sm text-gray-800">Daily appointments</span>
                  </li>
                  <li className="flex items-center gap-2 bg-white p-2 rounded border">
                    <div className="h-2 w-2 rounded-full bg-green-600"></div>
                    <span className="text-sm text-gray-800">Weekly on specific days</span>
                  </li>
                  <li className="flex items-center gap-2 bg-white p-2 rounded border">
                    <div className="h-2 w-2 rounded-full bg-purple-600"></div>
                    <span className="text-sm text-gray-800">Monthly on specific dates</span>
                  </li>
                  <li className="flex items-center gap-2 bg-white p-2 rounded border">
                    <div className="h-2 w-2 rounded-full bg-amber-600"></div>
                    <span className="text-sm text-gray-800">Custom patterns with end dates</span>
                  </li>
                </ul>
              </div>
              
              <h2 className="text-xl font-bold mt-10 mb-4 flex items-center gap-2 pb-2 border-b border-muted">
                <BellRing className="h-5 w-5 text-primary" />
                Best Practices
              </h2>
              
              <ul className="text-gray-800 mb-6">
                <li><strong>Buffer Time</strong>: Schedule short buffer periods between appointments to account for late arrivals or appointments that run long</li>
                <li><strong>Reminders</strong>: Set up multiple reminders (e.g., 1 day before and 1 hour before) to reduce no-shows</li>
                <li><strong>Detailed Notes</strong>: Include specific notes in appointments to help prepare for the visit</li>
                <li><strong>Follow-up Scheduling</strong>: Schedule follow-up appointments immediately after completing the current appointment</li>
                <li><strong>Regular Review</strong>: Periodically review the appointment schedule to identify and resolve any conflicts</li>
              </ul>
              
              <h2 className="text-xl font-bold mt-10 mb-4 flex items-center gap-2 pb-2 border-b border-muted">
                <Search className="h-5 w-5 text-primary" />
                Troubleshooting
              </h2>
              
              <div className="space-y-3 mb-6">
                <div className="bg-red-100 border border-red-300 rounded-lg p-4">
                  <div className="font-bold text-red-900 mb-1">Double Bookings</div>
                  <div className="text-red-800 text-sm">If you notice overlapping appointments, reschedule one of them and enable the appointment conflict warning setting</div>
                </div>
                <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4">
                  <div className="font-bold text-yellow-900 mb-1">Google Calendar Sync Issues</div>
                  <div className="text-yellow-800 text-sm">Ensure you've properly set up Google Calendar integration and check connection settings</div>
                </div>
                <div className="bg-blue-100 border border-blue-300 rounded-lg p-4">
                  <div className="font-bold text-blue-900 mb-1">Missing Appointments</div>
                  <div className="text-blue-800 text-sm">Check your filter settings to ensure you're viewing all relevant appointments</div>
                </div>
                <div className="bg-indigo-100 border border-indigo-300 rounded-lg p-4">
                  <div className="font-bold text-indigo-900 mb-1">Reminder Failures</div>
                  <div className="text-indigo-800 text-sm">Verify contact information for patients and check notification settings</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Articles with improved styling */}
          <Card className="mb-8 shadow-sm border-primary/10">
            <CardHeader className="bg-primary/5 border-b border-primary/10">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Related Articles</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-5">
              <div className="grid gap-3">
                <Link to="/docs/patient-management/PatientManagement" className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-100 transition-colors">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Patient Management Guide</div>
                    <div className="text-xs text-gray-700">Learn how to manage patient records effectively</div>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 ml-auto text-gray-600" />
                </Link>
                
                <Link to="/docs/google-calendar/GoogleCalendarSetup" className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-100 transition-colors">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Google Calendar Integration</div>
                    <div className="text-xs text-gray-700">How to set up and use Google Calendar with PureCare</div>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 ml-auto text-gray-600" />
                </Link>
                
                <Link to="/docs/settings" className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-100 transition-colors">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <BellRing className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Configuring Notification Settings</div>
                    <div className="text-xs text-gray-700">Set up appointment reminders and notifications</div>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 ml-auto text-gray-600" />
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Navigation with improved styling */}
          <div className="flex justify-between">
            <Button variant="outline" size="sm" asChild className="shadow-sm hover:bg-primary/5">
              <Link to="/docs">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Documentation
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AppointmentsManagementDoc; 