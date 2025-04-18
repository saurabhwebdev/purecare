import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, BookOpen, Bookmark, FileText, ExternalLink, HelpCircle, BookMarked } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const DocumentationPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Categories for documentation
  const docCategories = [
    { 
      id: 'getting-started', 
      title: 'Getting Started', 
      description: 'Essential information for new users',
      icon: <BookOpen className="h-5 w-5" />
    },
    { 
      id: 'patient-management', 
      title: 'Patient Management', 
      description: 'Managing patient records and data',
      icon: <FileText className="h-5 w-5" />
    },
    { 
      id: 'appointments', 
      title: 'Appointments', 
      description: 'Scheduling and managing appointments',
      icon: <Bookmark className="h-5 w-5" />
    },
    { 
      id: 'google-calendar', 
      title: 'Google Calendar Integration', 
      description: 'Setting up and using Google Calendar',
      icon: <ExternalLink className="h-5 w-5" />
    },
  ];

  // For future implementation: recently viewed articles
  const recentArticles = [
    { 
      id: 'patient-management', 
      title: 'Patient Management Guide',
      path: '/docs/patient-management/PatientManagement',
      available: true
    },
    { 
      id: 'appointments', 
      title: 'Managing Appointments',
      path: '/docs/appointments/AppointmentsManagement',
      available: true
    },
    { 
      id: 'google-calendar', 
      title: 'Google Calendar Integration',
      path: '/docs/google-calendar/GoogleCalendarSetup',
      available: false
    },
  ];

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight mb-2">PureCare Documentation</h1>
            <p className="text-muted-foreground">
              Find helpful guides, tutorials, and answers to common questions
            </p>
          </div>
          
          <div className="relative max-w-xl mx-auto mb-10">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search documentation..."
              className="pl-10 py-6 text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Tabs defaultValue="browse" className="mb-8">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="browse">Browse</TabsTrigger>
              <TabsTrigger value="recent">Recently Viewed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="browse" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                {docCategories.map((category) => (
                  <Card key={category.id} className="overflow-hidden border border-border hover:border-primary/50 transition-colors">
                    <CardHeader className="bg-muted/30">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          {category.icon}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{category.title}</CardTitle>
                          <CardDescription>{category.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      {category.id === 'patient-management' ? (
                        <ul className="space-y-1">
                          <li>
                            <Link to="/docs/patient-management/PatientManagement" className="text-sm text-primary hover:underline">
                              Patient Management Guide
                            </Link>
                          </li>
                          <li className="text-xs text-muted-foreground">
                            Learn how to effectively manage patient records
                          </li>
                        </ul>
                      ) : category.id === 'appointments' ? (
                        <ul className="space-y-1">
                          <li>
                            <Link to="/docs/appointments/AppointmentsManagement" className="text-sm text-primary hover:underline">
                              Appointments Management Guide
                            </Link>
                          </li>
                          <li className="text-xs text-muted-foreground">
                            Learn how to schedule and manage appointments
                          </li>
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          This section is currently empty. Documentation will be added soon.
                        </p>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-end border-t bg-muted/20 p-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/docs/${category.id}`}>View articles</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="recent" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recently Viewed Articles</CardTitle>
                  <CardDescription>
                    Quick access to articles you've viewed recently
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableBody>
                      {recentArticles.map((article) => (
                        <TableRow key={article.id}>
                          <TableCell className="flex items-center gap-2">
                            <BookMarked className="h-4 w-4 text-muted-foreground" />
                            {article.available ? (
                              <Link to={article.path} className="hover:underline text-primary">
                                {article.title}
                              </Link>
                            ) : (
                              <span className="text-muted-foreground">{article.title}</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {article.available ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Available</Badge>
                            ) : (
                              <Badge variant="outline" className="bg-muted text-muted-foreground">Coming soon</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card className="mb-8 border border-border shadow-sm">
            <CardHeader className="bg-muted/50 border-b border-border">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" />
                <CardTitle>Need more help?</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <p>
                This documentation section is still under development. If you need assistance,
                please contact our support team directly.
              </p>
            </CardContent>
            <CardFooter className="flex justify-start border-t border-border bg-muted/20 pt-4">
              <Button variant="default">
                Contact Support
              </Button>
            </CardFooter>
          </Card>
          
          <div className="text-center text-sm text-muted-foreground">
            <p>
              You can contribute to this documentation by providing feedback on what topics you'd
              like to see covered.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DocumentationPage; 