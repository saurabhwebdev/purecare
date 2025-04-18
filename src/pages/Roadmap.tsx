import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Badge } from '@/components/ui/badge';
import { Clock, Check, ArrowRight } from 'lucide-react';

const Roadmap = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-6">PureCare Roadmap</h1>
          
          <p className="text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <section className="mb-10">
              <p className="text-lg">
                At PureCare, we are committed to continuously improving our healthcare management platform. 
                Our product roadmap outlines our vision for the future and highlights the features and enhancements 
                we're working on. We prioritize development based on user feedback, industry trends, and technological advancements.
              </p>
            </section>
            
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">Recently Completed</h2>
              
              <div className="space-y-6">
                <div className="bg-green-950/30 border border-green-900/50 rounded-lg p-6">
                  <div className="flex items-center mb-3">
                    <Badge className="bg-green-500/20 text-green-500 border-green-500/30 mr-2">
                      <Check className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                    <span className="text-sm text-muted-foreground">Q1 2023</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Patient Management System</h3>
                  <p className="text-muted-foreground">
                    A comprehensive patient management system that allows healthcare providers to store, 
                    access, and manage patient information securely and efficiently.
                  </p>
                </div>
                
                <div className="bg-green-950/30 border border-green-900/50 rounded-lg p-6">
                  <div className="flex items-center mb-3">
                    <Badge className="bg-green-500/20 text-green-500 border-green-500/30 mr-2">
                      <Check className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                    <span className="text-sm text-muted-foreground">Q2 2023</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Appointment Scheduling</h3>
                  <p className="text-muted-foreground">
                    An intuitive appointment scheduling system with calendar integration, automated reminders, 
                    and the ability to manage recurring appointments.
                  </p>
                </div>
                
                <div className="bg-green-950/30 border border-green-900/50 rounded-lg p-6">
                  <div className="flex items-center mb-3">
                    <Badge className="bg-green-500/20 text-green-500 border-green-500/30 mr-2">
                      <Check className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                    <span className="text-sm text-muted-foreground">Q3 2023</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Prescription Management</h3>
                  <p className="text-muted-foreground">
                    Digital prescription creation, tracking, and management with integration to pharmacy systems 
                    and medication databases for safety checks.
                  </p>
                </div>
              </div>
            </section>
            
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">Currently in Development</h2>
              
              <div className="space-y-6">
                <div className="bg-blue-950/30 border border-blue-900/50 rounded-lg p-6">
                  <div className="flex items-center mb-3">
                    <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/30 mr-2">
                      <Clock className="h-3 w-3 mr-1" />
                      In Progress
                    </Badge>
                    <span className="text-sm text-muted-foreground">Q2 2024</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Telehealth Integration</h3>
                  <p className="text-muted-foreground">
                    Seamless integration of video consultations directly within the platform, with features for 
                    scheduling, conducting, and documenting virtual appointments.
                  </p>
                </div>
                
                <div className="bg-blue-950/30 border border-blue-900/50 rounded-lg p-6">
                  <div className="flex items-center mb-3">
                    <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/30 mr-2">
                      <Clock className="h-3 w-3 mr-1" />
                      In Progress
                    </Badge>
                    <span className="text-sm text-muted-foreground">Q2 2024</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Advanced Analytics Dashboard</h3>
                  <p className="text-muted-foreground">
                    Comprehensive analytics and reporting tools to help practices understand patient trends, 
                    operational efficiency, and financial performance.
                  </p>
                </div>
              </div>
            </section>
            
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">Upcoming Features</h2>
              
              <div className="space-y-6">
                <div className="bg-purple-950/30 border border-purple-900/50 rounded-lg p-6">
                  <div className="flex items-center mb-3">
                    <Badge className="bg-purple-500/20 text-purple-500 border-purple-500/30 mr-2">
                      <ArrowRight className="h-3 w-3 mr-1" />
                      Planned
                    </Badge>
                    <span className="text-sm text-muted-foreground">Q3 2024</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Patient Portal</h3>
                  <p className="text-muted-foreground">
                    A dedicated portal for patients to access their medical records, book appointments, 
                    request prescription refills, and communicate with their healthcare providers.
                  </p>
                </div>
                
                <div className="bg-purple-950/30 border border-purple-900/50 rounded-lg p-6">
                  <div className="flex items-center mb-3">
                    <Badge className="bg-purple-500/20 text-purple-500 border-purple-500/30 mr-2">
                      <ArrowRight className="h-3 w-3 mr-1" />
                      Planned
                    </Badge>
                    <span className="text-sm text-muted-foreground">Q4 2024</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">AI-Assisted Documentation</h3>
                  <p className="text-muted-foreground">
                    AI tools to assist healthcare providers in documenting patient encounters more 
                    efficiently, with features like voice-to-text, auto-summarization, and coding suggestions.
                  </p>
                </div>
                
                <div className="bg-purple-950/30 border border-purple-900/50 rounded-lg p-6">
                  <div className="flex items-center mb-3">
                    <Badge className="bg-purple-500/20 text-purple-500 border-purple-500/30 mr-2">
                      <ArrowRight className="h-3 w-3 mr-1" />
                      Planned
                    </Badge>
                    <span className="text-sm text-muted-foreground">Q1 2025</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Mobile App for Providers</h3>
                  <p className="text-muted-foreground">
                    A native mobile application for healthcare providers to access PureCare on-the-go, 
                    with offline capabilities and push notifications for critical updates.
                  </p>
                </div>
              </div>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Feature Requests</h2>
              <p>
                We value your input in shaping the future of PureCare. If you have suggestions for 
                new features or improvements to existing functionality, please share them with us.
              </p>
              <p className="mt-4">
                Email your ideas to: <a href="mailto:product@purecare.health" className="text-primary">product@purecare.health</a>
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Stay Updated</h2>
              <p>
                Join our newsletter to receive regular updates on new features, enhancements, and other 
                PureCare news. Follow us on social media for the latest announcements and product insights.
              </p>
            </section>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Roadmap; 