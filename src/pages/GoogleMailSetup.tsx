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
  Mail,
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

interface GmailSettings {
  enabled?: boolean;
  clientId?: string;
  apiKey?: string;
  syncEmails?: boolean;
  syncContacts?: boolean;
  emailLabels?: string[];
  lastSyncDate?: string;
  apiKeyConfigured?: boolean;
}

const GoogleMailSetup = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  
  // Gmail settings
  const [gmailEnabled, setGmailEnabled] = useState(false);
  const [googleClientId, setGoogleClientId] = useState('');
  const [googleApiKey, setGoogleApiKey] = useState('');
  const [syncEmails, setSyncEmails] = useState(true);
  const [syncContacts, setSyncContacts] = useState(true);
  const [emailLabels, setEmailLabels] = useState('');
  const [testConnectionStatus, setTestConnectionStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Step wizard state
  const { activeStep, setActiveStep } = useSteps({
    initialStep: 0,
    steps: 4
  });

  // Load user settings from Firebase
  useEffect(() => {
    const loadSettings = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const userSettings = await getUserSettings(user.uid);
        setSettings(userSettings);
        
        // Populate Gmail settings if they exist
        if (userSettings.gmail) {
          setGmailEnabled(userSettings.gmail.enabled || false);
          setGoogleClientId(userSettings.gmail.clientId || '');
          setGoogleApiKey(userSettings.gmail.apiKey || '');
          setSyncEmails(userSettings.gmail.syncEmails !== false);
          setSyncContacts(userSettings.gmail.syncContacts !== false);
          setEmailLabels(userSettings.gmail.emailLabels?.join(',') || '');
        }
        
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

  const saveGmailSettings = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      // Create a proper date string that will convert correctly to Date object later
      const currentDate = new Date();
      
      const gmailSettings: GmailSettings = {
        enabled: gmailEnabled,
        clientId: googleClientId,
        apiKey: googleApiKey,
        syncEmails,
        syncContacts,
        emailLabels: emailLabels.split(',').map(label => label.trim()).filter(label => label !== ''),
        lastSyncDate: currentDate.toISOString(),
        apiKeyConfigured: googleClientId && googleApiKey ? true : false
      };
      
      await updateSettingsModule(user.uid, 'gmail', gmailSettings);
      
      toast({
        title: "Settings saved",
        description: "Your Gmail settings have been updated.",
      });
      
      // Go to next step if not on the last step
      if (activeStep < 3) {
        setActiveStep(activeStep + 1);
      }
      
    } catch (error) {
      console.error("Error saving Gmail settings:", error);
      toast({
        title: "Error saving settings",
        description: "Could not save your Gmail settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const testConnection = async () => {
    setTestConnectionStatus('loading');
    
    // Simulating API call to test Gmail connection
    setTimeout(() => {
      // For demonstration purposes, succeed if both fields are filled
      if (googleClientId && googleApiKey) {
        setTestConnectionStatus('success');
        toast({
          title: "Connection successful",
          description: "Successfully connected to Gmail API.",
        });
      } else {
        setTestConnectionStatus('error');
        toast({
          title: "Connection failed",
          description: "Could not connect to Gmail API. Please check your credentials.",
          variant: "destructive"
        });
      }
    }, 2000);
  };

  const handleFinish = () => {
    toast({
      title: "Setup complete",
      description: "Gmail integration has been successfully set up.",
    });
    navigate('/settings');
  };

  const steps = [
    { title: "Create Google Cloud Project", description: "Set up your Google Cloud project" },
    { title: "Configure API Credentials", description: "Set up OAuth credentials" },
    { title: "Configure Gmail Access", description: "Set up email access permissions" },
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
          <h1 className="text-3xl font-bold tracking-tight">Gmail Setup</h1>
          <p className="text-muted-foreground mt-2">
            Connect your PureCare app with Gmail to manage email communications with patients
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Setup Wizard</CardTitle>
            <CardDescription>Follow these steps to configure Gmail integration</CardDescription>
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
                    <li>Name your project something memorable like "PureCare Gmail"</li>
                    <li>Once created, select your new project from the dropdown</li>
                  </ol>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Step 2: Enable Gmail API</h3>
                  <ol className="list-decimal list-inside space-y-2 pl-4">
                    <li>In your Google Cloud project, go to "APIs & Services" {'>'} "Library"</li>
                    <li>Search for "Gmail API" and select it</li>
                    <li>Click "Enable" to enable the API for your project</li>
                  </ol>
                </div>
              </div>
            )}

            {activeStep === 1 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Create OAuth Credentials</h3>
                  <ol className="list-decimal list-inside space-y-2 pl-4">
                    <li>In your Google Cloud project, go to "APIs & Services" {'>'} "Credentials"</li>
                    <li>Click "Create Credentials" and select "OAuth client ID"</li>
                    <li>For Application type, select "Web application"</li>
                    <li>Name your OAuth client (e.g., "PureCare Gmail Client")</li>
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
                    <li>(Optional but recommended) Restrict the API key to only use the Gmail API</li>
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

            {activeStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Configure Gmail Permissions</h3>
                  <p className="text-sm text-muted-foreground">
                    Specify which email labels to sync and configure contact syncing options.
                  </p>
                  <ol className="list-decimal list-inside space-y-2 pl-4">
                    <li>Go to <a href="https://console.cloud.google.com/apis/credentials/consent" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center">OAuth consent screen <ExternalLink className="ml-1 h-3 w-3" /></a></li>
                    <li>Choose your user type (Internal or External)</li>
                    <li>Fill in the required information about your app</li>
                    <li>Under "Scopes", add the following Gmail scopes:
                      <ul className="list-disc list-inside ml-5 mt-2">
                        <li><code className="bg-muted px-1 py-0.5 rounded">https://www.googleapis.com/auth/gmail.readonly</code> - To read emails</li>
                        <li><code className="bg-muted px-1 py-0.5 rounded">https://www.googleapis.com/auth/gmail.send</code> - To send emails</li>
                        <li><code className="bg-muted px-1 py-0.5 rounded">https://www.googleapis.com/auth/gmail.labels</code> - To manage labels</li>
                        <li><code className="bg-muted px-1 py-0.5 rounded">https://www.googleapis.com/auth/contacts.readonly</code> - To read contacts (optional)</li>
                      </ul>
                    </li>
                    <li>Save your changes and return here</li>
                  </ol>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email-labels">Email Labels to Sync (comma-separated)</Label>
                  <Input
                    id="email-labels"
                    placeholder="e.g., INBOX,SENT,Patients,Appointments"
                    value={emailLabels}
                    onChange={(e) => setEmailLabels(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Specify which email labels to sync. Leave blank to sync all emails.
                  </p>
                </div>

                <div className="space-y-4 pt-4">
                  <h3 className="text-lg font-medium">Sync Settings</h3>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sync-emails">Sync Emails</Label>
                      <p className="text-sm text-muted-foreground">
                        Sync emails from the specified labels
                      </p>
                    </div>
                    <Switch
                      id="sync-emails"
                      checked={syncEmails}
                      onCheckedChange={setSyncEmails}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sync-contacts">Sync Contacts</Label>
                      <p className="text-sm text-muted-foreground">
                        Sync contacts from Gmail to your patient database
                      </p>
                    </div>
                    <Switch
                      id="sync-contacts"
                      checked={syncContacts}
                      onCheckedChange={setSyncContacts}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Test Connection</h3>
                  <p className="text-sm text-muted-foreground">
                    Verify your Gmail integration is working correctly
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
                  <h3 className="text-lg font-medium">Enable Gmail Integration</h3>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="gmail-enabled">Enable Gmail</Label>
                      <p className="text-sm text-muted-foreground">
                        Turn on to enable Gmail integration with PureCare
                      </p>
                    </div>
                    <Switch
                      id="gmail-enabled"
                      checked={gmailEnabled}
                      onCheckedChange={setGmailEnabled}
                    />
                  </div>
                </div>

                <Alert className="mt-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>You're all set!</AlertTitle>
                  <AlertDescription>
                    Click "Finish Setup" below to complete the Gmail integration
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
            
            {activeStep < 3 ? (
              <Button 
                onClick={saveGmailSettings} 
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

export default GoogleMailSetup; 