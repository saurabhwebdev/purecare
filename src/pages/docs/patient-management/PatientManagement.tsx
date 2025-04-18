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
import { ChevronLeft, Home, BookOpen, ExternalLink, Users, UserPlus, ClipboardList, Search, TagIcon, Archive, BarChart, ShieldCheck, Calendar, FileText } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const PatientManagementDoc = () => {
  const title = "Patient Management Guide";
  const category = "patient-management";
  const categoryName = "Patient Management";
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
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Overview</CardTitle>
                  <CardDescription className="text-base">Complete guide to managing patients in PureCare</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none pt-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-8">
                <p className="font-medium text-blue-900 mb-2">
                  PureCare's Patient Management module allows healthcare providers to efficiently manage patient records, 
                  track demographics, store medical history, and manage patient interactions.
                </p>
                <p className="text-blue-800 mb-0">
                  This guide will help you understand how to use the patient management features effectively.
                </p>
              </div>
              
              <Tabs defaultValue="key-features" className="mb-8">
                <TabsList className="w-full grid grid-cols-3 mb-4">
                  <TabsTrigger value="key-features">Key Features</TabsTrigger>
                  <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced Features</TabsTrigger>
                </TabsList>
                
                <TabsContent value="key-features" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-blue-50 border-blue-200">
                      <CardHeader className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <UserPlus className="h-5 w-5 text-blue-700" />
                          <CardTitle className="text-md text-blue-900">Patient Records</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="py-3 px-4 text-sm text-blue-800">
                        Create, view, edit and manage comprehensive patient profiles
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-green-50 border-green-200">
                      <CardHeader className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Search className="h-5 w-5 text-green-700" />
                          <CardTitle className="text-md text-green-900">Search & Filter</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="py-3 px-4 text-sm text-green-800">
                        Quickly find patients using various search criteria
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-purple-50 border-purple-200">
                      <CardHeader className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <ClipboardList className="h-5 w-5 text-purple-700" />
                          <CardTitle className="text-md text-purple-900">Medical History</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="py-3 px-4 text-sm text-purple-800">
                        Track patient medical history, allergies, and medications
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-amber-50 border-amber-200">
                      <CardHeader className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <BarChart className="h-5 w-5 text-amber-700" />
                          <CardTitle className="text-md text-amber-900">Demographics</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="py-3 px-4 text-sm text-amber-800">
                        Store important patient demographic information
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="getting-started" className="mt-0">
                  <div className="space-y-4">
                    <Card>
                      <CardHeader className="py-3 bg-muted/30">
                        <CardTitle className="text-lg">1. Accessing Patient Management</CardTitle>
                      </CardHeader>
                      <CardContent className="py-4">
                        <ol className="space-y-2 mb-0">
                          <li className="flex items-center gap-2">
                            <Badge className="bg-primary text-white rounded-full h-6 w-6 p-0 flex items-center justify-center">1</Badge>
                            <span>Log in to your PureCare account</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Badge className="bg-primary text-white rounded-full h-6 w-6 p-0 flex items-center justify-center">2</Badge>
                            <span>From the dashboard, click on the <strong>Patients</strong> link in the main navigation</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Badge className="bg-primary text-white rounded-full h-6 w-6 p-0 flex items-center justify-center">3</Badge>
                            <span>You will be directed to the patient list view where you can see all patients</span>
                          </li>
                        </ol>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="py-3 bg-muted/30">
                        <CardTitle className="text-lg">2. Adding a New Patient</CardTitle>
                      </CardHeader>
                      <CardContent className="py-4">
                        <Alert className="mb-3 bg-blue-50 border-blue-200">
                          <UserPlus className="h-4 w-4 text-blue-700" />
                          <AlertTitle className="text-blue-900">Required Fields</AlertTitle>
                          <AlertDescription className="text-blue-800">
                            Fields marked with an asterisk (*) are required and must be filled out to create a patient record.
                          </AlertDescription>
                        </Alert>
                        
                        <ol className="space-y-2 mb-0">
                          <li className="flex items-start gap-2">
                            <Badge className="bg-primary text-white rounded-full h-6 w-6 p-0 flex items-center justify-center mt-0.5">1</Badge>
                            <span>Navigate to the Patients page</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Badge className="bg-primary text-white rounded-full h-6 w-6 p-0 flex items-center justify-center mt-0.5">2</Badge>
                            <span>Click the <strong>Add Patient</strong> button in the top-right corner</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Badge className="bg-primary text-white rounded-full h-6 w-6 p-0 flex items-center justify-center mt-0.5">3</Badge>
                            <div>
                              <span>Fill out the required fields in the patient information form:</span>
                              <ul className="mt-2 space-y-1">
                                <li>• Personal Information (Name, Date of Birth, Gender, etc.)</li>
                                <li>• Contact Information (Phone, Email, Address)</li>
                                <li>• Emergency Contact</li>
                                <li>• Insurance Information</li>
                                <li>• Medical Information (Optional at creation)</li>
                              </ul>
                            </div>
                          </li>
                          <li className="flex items-start gap-2">
                            <Badge className="bg-primary text-white rounded-full h-6 w-6 p-0 flex items-center justify-center mt-0.5">4</Badge>
                            <span>Click <strong>Save</strong> to create the patient record</span>
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
                            <TagIcon className="h-5 w-5 text-slate-700" />
                            <CardTitle className="text-md text-slate-900">Patient Tags</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-2 text-sm text-slate-800">
                          <p>Add custom tags to categorize your patients and enable quick filtering</p>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-slate-100 border-slate-300">
                        <CardHeader className="pb-2 pt-4">
                          <div className="flex items-center gap-2">
                            <Archive className="h-5 w-5 text-slate-700" />
                            <CardTitle className="text-md text-slate-900">Patient Archiving</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-2 text-sm text-slate-800">
                          <p>Archive inactive patients to keep your active patient list organized</p>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Card>
                      <CardHeader className="bg-muted/30 border-b">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">Best Practices</CardTitle>
                          <ShieldCheck className="h-5 w-5 text-primary" />
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <h4 className="font-medium">Keep Information Updated</h4>
                            <p className="text-sm text-gray-700">Regularly verify and update patient contact information</p>
                          </div>
                          
                          <div className="space-y-1">
                            <h4 className="font-medium">Use Consistent Naming</h4>
                            <p className="text-sm text-gray-700">Establish a consistent format for entering patient names</p>
                          </div>
                          
                          <div className="space-y-1">
                            <h4 className="font-medium">Document Everything</h4>
                            <p className="text-sm text-gray-700">Make detailed notes about patient interactions</p>
                          </div>
                          
                          <div className="space-y-1">
                            <h4 className="font-medium">Regular Audits</h4>
                            <p className="text-sm text-gray-700">Periodically review patient records for accuracy</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
              
              <h2 className="text-xl font-bold mt-10 mb-4 flex items-center gap-2 pb-2 border-b border-muted">
                <Users className="h-5 w-5 text-primary" />
                Detailed Guide
              </h2>

              {/* Rest of the content continues here... */}
              
              <h3 className="text-lg font-bold mt-8 mb-3 text-primary/90">Viewing Patient Details</h3>
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm mb-6">
                <div className="bg-muted/40 px-4 py-3 border-b">
                  <div className="text-sm font-medium">Patient Profile Tabs</div>
                </div>
                <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="border rounded-md p-3 bg-blue-50 hover:bg-blue-100 transition-colors">
                    <div className="font-medium text-blue-900">Overview</div>
                    <div className="text-xs text-blue-800 mt-1">Basic information and recent activity</div>
                  </div>
                  <div className="border rounded-md p-3 bg-green-50 hover:bg-green-100 transition-colors">
                    <div className="font-medium text-green-900">Medical Records</div>
                    <div className="text-xs text-green-800 mt-1">Medical history, conditions, allergies</div>
                  </div>
                  <div className="border rounded-md p-3 bg-purple-50 hover:bg-purple-100 transition-colors">
                    <div className="font-medium text-purple-900">Appointments</div>
                    <div className="text-xs text-purple-800 mt-1">Past and upcoming appointments</div>
                  </div>
                  <div className="border rounded-md p-3 bg-amber-50 hover:bg-amber-100 transition-colors">
                    <div className="font-medium text-amber-900">Prescriptions</div>
                    <div className="text-xs text-amber-800 mt-1">Medication prescriptions</div>
                  </div>
                  <div className="border rounded-md p-3 bg-indigo-50 hover:bg-indigo-100 transition-colors">
                    <div className="font-medium text-indigo-900">Invoices</div>
                    <div className="text-xs text-indigo-800 mt-1">Billing information and payment history</div>
                  </div>
                  <div className="border rounded-md p-3 bg-cyan-50 hover:bg-cyan-100 transition-colors">
                    <div className="font-medium text-cyan-900">Documents</div>
                    <div className="text-xs text-cyan-800 mt-1">Uploaded documents and forms</div>
                  </div>
                </div>
              </div>
              
              {/* More styled content here */}
              
              <div className="bg-gray-100 p-6 rounded-lg border border-gray-300 my-8">
                <div className="flex items-center gap-2 mb-4">
                  <ClipboardList className="h-6 w-6 text-primary" />
                  <h3 className="text-lg font-bold m-0">Audit Trail</h3>
                </div>
                <p className="mb-2 text-gray-700">
                  PureCare maintains an audit trail of all changes made to patient records, including:
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 mb-0">
                  <li className="flex items-center gap-2 bg-white p-2 rounded border">
                    <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                    <span className="text-sm text-gray-800">Who made the change</span>
                  </li>
                  <li className="flex items-center gap-2 bg-white p-2 rounded border">
                    <div className="h-2 w-2 rounded-full bg-green-600"></div>
                    <span className="text-sm text-gray-800">When the change was made</span>
                  </li>
                  <li className="flex items-center gap-2 bg-white p-2 rounded border">
                    <div className="h-2 w-2 rounded-full bg-purple-600"></div>
                    <span className="text-sm text-gray-800">What was changed</span>
                  </li>
                  <li className="flex items-center gap-2 bg-white p-2 rounded border">
                    <div className="h-2 w-2 rounded-full bg-amber-600"></div>
                    <span className="text-sm text-gray-800">Previous values</span>
                  </li>
                </ul>
              </div>
              
              <h2 className="text-xl font-bold mt-10 mb-4 flex items-center gap-2 pb-2 border-b border-muted">
                <Search className="h-5 w-5 text-primary" />
                Troubleshooting
              </h2>
              
              <div className="space-y-3 mb-6">
                <div className="bg-red-100 border border-red-300 rounded-lg p-4">
                  <div className="font-bold text-red-900 mb-1">Duplicate Patient Records</div>
                  <div className="text-red-800 text-sm">Use the merge function to combine duplicate records</div>
                </div>
                <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4">
                  <div className="font-bold text-yellow-900 mb-1">Missing Information</div>
                  <div className="text-yellow-800 text-sm">Use the patient information checklist to identify missing information</div>
                </div>
                <div className="bg-blue-100 border border-blue-300 rounded-lg p-4">
                  <div className="font-bold text-blue-900 mb-1">Search Not Finding Patients</div>
                  <div className="text-blue-800 text-sm">Try searching with less specific criteria or check for spelling errors</div>
                </div>
                <div className="bg-indigo-100 border border-indigo-300 rounded-lg p-4">
                  <div className="font-bold text-indigo-900 mb-1">Unable to Edit Fields</div>
                  <div className="text-indigo-800 text-sm">Ensure you have the proper permissions for editing patient information</div>
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
                <Link to="/docs/appointments/AppointmentsManagement" className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-100 transition-colors">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Managing Patient Appointments</div>
                    <div className="text-xs text-gray-700">Learn how to schedule and manage patient appointments</div>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 ml-auto text-gray-600" />
                </Link>
                
                <Link to="/docs/medical-records" className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-100 transition-colors">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <ClipboardList className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Medical Records Management</div>
                    <div className="text-xs text-gray-700">How to maintain accurate and organized medical records</div>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 ml-auto text-gray-600" />
                </Link>
                
                <Link to="/docs/prescriptions" className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-100 transition-colors">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Prescription Management</div>
                    <div className="text-xs text-gray-700">Creating and managing patient prescriptions</div>
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

export default PatientManagementDoc; 