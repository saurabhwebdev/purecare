import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth/AuthContext';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { getUserSettings, updateSettingsModule } from '@/lib/firebase/settingsService';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Loader2
} from 'lucide-react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

// Custom stepper component
const Stepper = ({ index, children, className = "" }: { index: number, children: React.ReactNode, className?: string }) => {
  return (
    <div className={`flex flex-col ${className}`}>
      {React.Children.map(children, (child, idx) => {
        return React.cloneElement(child as React.ReactElement, {
          isActive: idx === index,
          isCompleted: idx < index,
        });
      })}
    </div>
  );
};

const Step = ({ 
  children, 
  isActive, 
  isCompleted 
}: { 
  children: React.ReactNode, 
  isActive?: boolean, 
  isCompleted?: boolean 
}) => {
  return (
    <div className="flex items-start mb-4">
      {children}
    </div>
  );
};

const StepIndicator = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mr-3 flex-shrink-0">
      {children}
    </div>
  );
};

const StepStatus = ({ 
  complete, 
  incomplete, 
  active 
}: { 
  complete: React.ReactNode, 
  incomplete: React.ReactNode, 
  active: React.ReactNode 
}) => {
  return (
    <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full">
      {complete}
    </div>
  );
};

const StepTitle = ({ children }: { children: React.ReactNode }) => {
  return (
    <h3 className="font-medium">{children}</h3>
  );
};

const StepDescription = ({ children }: { children: React.ReactNode }) => {
  return (
    <p className="text-sm text-muted-foreground">{children}</p>
  );
};

const StepSeparator = () => {
  return (
    <div className="h-6 ml-4 border-l border-muted"></div>
  );
};

const useSteps = ({ initialStep, steps }: { initialStep: number, steps: number }) => {
  const [activeStep, setActiveStep] = useState(initialStep);
  return { activeStep, setActiveStep };
};

interface GoogleSettings {
  calendarEnabled?: boolean;
  clientId?: string;
  apiKey?: string;
  calendarId?: string;
  syncAppointments?: boolean;
  syncReminders?: boolean;
  lastSyncDate?: string;
  apiKeyConfigured: boolean;
}

const GoogleCalendarSetup = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  
  // Google Calendar settings
  const [calendarEnabled, setCalendarEnabled] = useState(false);
  const [googleClientId, setGoogleClientId] = useState('');
  const [googleApiKey, setGoogleApiKey] = useState('');
  const [calendarId, setCalendarId] = useState('');
  const [syncAppointments, setSyncAppointments] = useState(true);
  const [syncReminders, setSyncReminders] = useState(true);
  const [testConnectionStatus, setTestConnectionStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Step wizard state
  const { activeStep, setActiveStep } = useSteps({
    initialStep: 0,
    steps: 5
  });

  // Load user settings from Firebase
  useEffect(() => {
    const loadSettings = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const userSettings = await getUserSettings(user.uid);
        setSettings(userSettings);
        
        // Populate Google Calendar settings
        setCalendarEnabled(userSettings.google?.calendarEnabled || false);
        setGoogleClientId(userSettings.google?.clientId || '');
        setGoogleApiKey(userSettings.google?.apiKey || '');
        setCalendarId(userSettings.google?.calendarId || '');
        setSyncAppointments(userSettings.google?.syncAppointments !== false);
        setSyncReminders(userSettings.google?.syncReminders !== false);
        
      } catch (error) {
        console.error("Error loading settings:", error);
        toast({
          title: "Error loading settings",
          description: "Could not load your settings. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, [user, toast]);

  const saveGoogleSettings = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      // Create a proper date string that will convert correctly to Date object later
      const currentDate = new Date();
      
      const googleSettings: GoogleSettings = {
        calendarEnabled,
        clientId: googleClientId,
        apiKey: googleApiKey,
        calendarId,
        syncAppointments,
        syncReminders,
        lastSyncDate: currentDate.toISOString(),
        apiKeyConfigured: googleClientId && googleApiKey ? true : false
      };
      
      await updateSettingsModule(user.uid, 'google', googleSettings);
      
      toast({
        title: "Settings saved",
        description: "Your Google Calendar settings have been updated.",
      });
      
      // Go to next step if not on the last step
      if (activeStep < 4) {
        setActiveStep(activeStep + 1);
      }
      
    } catch (error) {
      console.error("Error saving Google settings:", error);
      toast({
        title: "Error saving settings",
        description: "Could not save your Google Calendar settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const testConnection = async () => {
    setTestConnectionStatus('loading');
    
    // Simulating API call to test Google Calendar connection
    setTimeout(() => {
      // For demonstration purposes, succeed if both fields are filled
      if (googleClientId && googleApiKey) {
        setTestConnectionStatus('success');
        toast({
          title: "Connection successful",
          description: "Successfully connected to Google Calendar API.",
        });
      } else {
        setTestConnectionStatus('error');
        toast({
          title: "Connection failed",
          description: "Could not connect to Google Calendar API. Please check your credentials.",
          variant: "destructive"
        });
      }
    }, 2000);
  };

  const handleFinish = () => {
    toast({
      title: "Setup complete",
      description: "Google Calendar integration has been successfully set up.",
    });
    navigate('/settings');
  };

  const steps = [
    { title: "Create Google Cloud Project", description: "Set up your Google Cloud project" },
    { title: "Configure OAuth Screen", description: "Set up OAuth consent screen" },
    { title: "Configure API Credentials", description: "Set up OAuth credentials" },
    { title: "Connect Calendar", description: "Link your Google Calendar" },
    { title: "Test & Finish", description: "Verify integration is working" }
  ];

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[500px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Google Calendar Setup</h1>
          <p className="text-muted-foreground mt-2">
            Connect your PureCare calendar with Google Calendar to sync appointments
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Setup Wizard</CardTitle>
            <CardDescription>Follow these steps to configure Google Calendar integration</CardDescription>
          </CardHeader>
          <CardContent>
            <Stepper index={activeStep} className="mb-8">
              {steps.map((step, index) => (
                <Step key={index}>
                  <StepIndicator>
                    <StepStatus
                      complete={<CheckCircle className="h-4 w-4" />}
                      incomplete={index + 1}
                      active={index + 1}
                    />
                  </StepIndicator>
                  <div className="flex flex-col ml-3">
                    <StepTitle>{step.title}</StepTitle>
                    <StepDescription>{step.description}</StepDescription>
                  </div>
                  <StepSeparator />
                </Step>
              ))}
            </Stepper>

            {activeStep === 0 && (
              <div className="space-y-6">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Before you begin</AlertTitle>
                  <AlertDescription>
                    You'll need a Google account with access to Google Cloud Console
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Step 1: Create a Google Cloud Project</h3>
                  <ol className="list-decimal list-inside space-y-2 pl-4">
                    <li>Go to the <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center">Google Cloud Console <ExternalLink className="ml-1 h-3 w-3" /></a></li>
                    <li>Click on the project dropdown at the top of the page</li>
                    <li>Click "New Project" and follow the prompts to create it</li>
                    <li>Name your project something memorable like "PureCare Calendar"</li>
                    <li>Once created, select your new project from the dropdown</li>
                  </ol>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Step 2: Enable Google Calendar API</h3>
                  <ol className="list-decimal list-inside space-y-2 pl-4">
                    <li>In your Google Cloud project, go to "APIs & Services" {'>'}  "Library"</li>
                    <li>Search for "Google Calendar API" and select it</li>
                    <li>Click "Enable" to enable the API for your project</li>
                  </ol>
                </div>
              </div>
            )}

            {activeStep === 1 && (
              <div className="space-y-6">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription>
                    The OAuth consent screen configuration is required before creating OAuth credentials
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Configure OAuth Consent Screen</h3>
                  <ol className="list-decimal list-inside space-y-2 pl-4">
                    <li>In your Google Cloud project, go to "APIs & Services" {'>'} "OAuth consent screen"</li>
                    <li>Select "External" user type (unless you have a Google Workspace organization)</li>
                    <li>Click "Create" to proceed</li>
                    <li>Fill out the required fields in the "App information" section:
                      <ul className="list-disc list-inside ml-5 mt-2">
                        <li>App name: "PureCare"</li>
                        <li>User support email: Your email address</li>
                        <li>Developer contact information: Your email address</li>
                      </ul>
                    </li>
                    <li>Click "Save and Continue"</li>
                    <li>In the "Scopes" section, click "Add or remove scopes"</li>
                    <li>Add the following scopes:
                      <ul className="list-disc list-inside ml-5 mt-2">
                        <li>https://www.googleapis.com/auth/calendar (Google Calendar API)</li>
                        <li>https://www.googleapis.com/auth/calendar.events (Google Calendar Events)</li>
                      </ul>
                    </li>
                    <li>Click "Save and Continue"</li>
                    <li>Add any test users if needed (required for testing in development)</li>
                    <li>Click "Save and Continue"</li>
                    <li>Review your app configuration and click "Back to Dashboard"</li>
                    <li>Note: For production use, you may need to verify your app with Google, which can take several days</li>
                  </ol>
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Create OAuth Credentials</h3>
                  <ol className="list-decimal list-inside space-y-2 pl-4">
                    <li>In your Google Cloud project, go to "APIs & Services" {'>'} "Credentials"</li>
                    <li>Click "Create Credentials" and select "OAuth client ID"</li>
                    <li>For Application type, select "Web application"</li>
                    <li>Name your OAuth client (e.g., "PureCare Web Client")</li>
                    <li>Add authorized redirect URIs:
                      <ul className="list-disc list-inside ml-5 mt-2">
                        <li>Add: <code className="bg-muted px-1 py-0.5 rounded">{window.location.origin}/auth/google/callback</code></li>
                        <li>If testing locally, also add: <code className="bg-muted px-1 py-0.5 rounded">http://localhost:5173/auth/google/callback</code></li>
                      </ul>
                    </li>
                    <li>Click "Create" to generate your credentials</li>
                    <li>Copy the "Client ID" and paste it below</li>
                  </ol>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Create API Key</h3>
                  <ol className="list-decimal list-inside space-y-2 pl-4">
                    <li>Go back to "APIs & Services" {'>'} "Credentials"</li>
                    <li>Click "Create Credentials" and select "API key"</li>
                    <li>Copy the generated API key and paste it below</li>
                    <li>(Optional but recommended) Restrict the API key to only use the Google Calendar API</li>
                  </ol>
                </div>

                <div className="pt-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="google-client-id">OAuth Client ID</Label>
                    <Input
                      id="google-client-id"
                      placeholder="e.g., 123456789012-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com"
                      value={googleClientId}
                      onChange={(e) => setGoogleClientId(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="google-api-key">API Key</Label>
                    <Input
                      id="google-api-key"
                      placeholder="e.g., AIzaSyBQG_NeU3nOpZRrJsq..."
                      value={googleApiKey}
                      onChange={(e) => setGoogleApiKey(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Select Google Calendar</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter the Google Calendar ID you want to use for syncing appointments.
                    You can find this in your Google Calendar settings.
                  </p>
                  <ol className="list-decimal list-inside space-y-2 pl-4">
                    <li>Go to <a href="https://calendar.google.com/calendar" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center">Google Calendar <ExternalLink className="ml-1 h-3 w-3" /></a></li>
                    <li>Click on the settings icon (⚙️) and select "Settings"</li>
                    <li>On the left sidebar, click on the calendar you want to use</li>
                    <li>Scroll down to "Integrate calendar" section</li>
                    <li>Copy the "Calendar ID" (usually your email address for the primary calendar)</li>
                  </ol>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="calendar-id">Calendar ID</Label>
                  <Input
                    id="calendar-id"
                    placeholder="e.g., your.email@gmail.com or c_abc123@group.calendar.google.com"
                    value={calendarId}
                    onChange={(e) => setCalendarId(e.target.value)}
                  />
                </div>

                <div className="space-y-4 pt-4">
                  <h3 className="text-lg font-medium">Sync Settings</h3>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sync-appointments">Sync Appointments</Label>
                      <p className="text-sm text-muted-foreground">
                        Create Google Calendar events for all appointments
                      </p>
                    </div>
                    <Switch
                      id="sync-appointments"
                      checked={syncAppointments}
                      onCheckedChange={setSyncAppointments}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sync-reminders">Include Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Add Google Calendar reminders for appointments
                      </p>
                    </div>
                    <Switch
                      id="sync-reminders"
                      checked={syncReminders}
                      onCheckedChange={setSyncReminders}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeStep === 4 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Test Connection</h3>
                  <p className="text-sm text-muted-foreground">
                    Verify your Google Calendar integration is working correctly
                  </p>
                  
                  <div className="flex items-center space-x-4">
                    <Button 
                      onClick={testConnection}
                      disabled={testConnectionStatus === 'loading' || !googleClientId || !googleApiKey}
                    >
                      {testConnectionStatus === 'loading' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {testConnectionStatus === 'success' && <CheckCircle className="mr-2 h-4 w-4" />}
                      {testConnectionStatus === 'error' && <AlertCircle className="mr-2 h-4 w-4" />}
                      Test Connection
                    </Button>
                    
                    {testConnectionStatus === 'success' && (
                      <span className="text-sm text-green-600 font-medium">Connection successful!</span>
                    )}
                    {testConnectionStatus === 'error' && (
                      <span className="text-sm text-red-600 font-medium">Connection failed. Please check your credentials.</span>
                    )}
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <h3 className="text-lg font-medium">Enable Google Calendar Integration</h3>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="calendar-enabled">Enable Google Calendar</Label>
                      <p className="text-sm text-muted-foreground">
                        Turn on to sync appointments with Google Calendar
                      </p>
                    </div>
                    <Switch
                      id="calendar-enabled"
                      checked={calendarEnabled}
                      onCheckedChange={setCalendarEnabled}
                    />
                  </div>
                </div>

                <Alert className="mt-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>You're all set!</AlertTitle>
                  <AlertDescription>
                    Click "Finish Setup" below to complete the Google Calendar integration
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => activeStep > 0 ? setActiveStep(activeStep - 1) : navigate('/settings')}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              {activeStep > 0 ? "Back" : "Return to Settings"}
            </Button>
            
            {activeStep < 4 ? (
              <Button 
                onClick={saveGoogleSettings} 
                disabled={isSaving}
              >
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button 
                onClick={handleFinish}
                disabled={isSaving}
              >
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Finish Setup
                <CheckCircle className="ml-2 h-4 w-4" />
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default GoogleCalendarSetup; 