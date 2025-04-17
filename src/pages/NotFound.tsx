import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layout/MainLayout';
import { Home, ArrowLeft, Stethoscope, Gauge, Users, Calendar, Settings as SettingsIcon } from 'lucide-react';

const NotFound = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          {/* Background elements */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10"></div>
          
          <div className="bg-card border rounded-xl shadow-lg overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Left side - Visual */}
              <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-8 md:p-12 md:w-2/5 flex items-center justify-center">
                <div className="text-center">
                  <div className="inline-flex rounded-full bg-background p-8 shadow-sm mb-6">
                    <Stethoscope className="h-12 w-12 text-primary" />
                  </div>
                  <div className="font-extrabold text-8xl text-primary">404</div>
                  <div className="mt-2 font-medium text-primary/60">Page not found</div>
                </div>
              </div>
              
              {/* Right side - Content */}
              <div className="p-8 md:p-12 md:w-3/5">
                <h1 className="text-3xl font-bold mb-4">Oops! We've hit a dead end</h1>
                <p className="text-muted-foreground mb-8">
                  We couldn't find the page you're looking for. It might have been moved, 
                  deleted, or perhaps it never existed in our system.
                </p>
                
                {/* Actions */}
                <div className="space-y-3">
                  <Button className="w-full justify-start gap-2" size="lg" asChild>
                    <Link to="/">
                      <Home className="h-4 w-4" />
                      Return to Home
                    </Link>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2"
                    size="lg"
                    onClick={() => window.history.back()}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Go Back
                  </Button>
                </div>
                
                {/* Quick links */}
                <div className="mt-10 pt-6 border-t">
                  <h3 className="font-medium mb-4">Common Destinations</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="secondary" asChild className="justify-start h-auto py-3">
                      <Link to="/dashboard" className="flex items-center gap-2">
                        <Gauge className="h-4 w-4 text-primary" />
                        <span>Dashboard</span>
                      </Link>
                    </Button>
                    
                    <Button variant="secondary" asChild className="justify-start h-auto py-3">
                      <Link to="/patients" className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        <span>Patients</span>
                      </Link>
                    </Button>
                    
                    <Button variant="secondary" asChild className="justify-start h-auto py-3">
                      <Link to="/appointments" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>Appointments</span>
                      </Link>
                    </Button>
                    
                    <Button variant="secondary" asChild className="justify-start h-auto py-3">
                      <Link to="/settings" className="flex items-center gap-2">
                        <SettingsIcon className="h-4 w-4 text-primary" />
                        <span>Settings</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Support message */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>
              If you believe this is an error, please contact <span className="text-primary">support@purecare.com</span>
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotFound;
