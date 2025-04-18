import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { ChevronLeft, Home, BookOpen, ExternalLink, AlertCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const GoogleCalendarSetupDoc = () => {
  const title = "Setting up Google Calendar Integration";
  const category = "google-calendar";
  const categoryName = "Google Calendar";
  const lastUpdated = "June 1, 2024";

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
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">Overview</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>
                PureCare offers seamless integration with Google Calendar to help you manage your appointments more effectively. 
                This guide will walk you through the process of setting up Google Calendar integration with your PureCare account.
              </p>
              
              <Alert className="my-4 bg-yellow-50 border-yellow-200">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertTitle className="text-yellow-800">Before You Begin</AlertTitle>
                <AlertDescription className="text-yellow-700">
                  You'll need a Google account and access to Google Cloud Console to complete this setup.
                </AlertDescription>
              </Alert>
              
              <h2>Step 1: Create a Google Cloud Project</h2>
              <p>
                The first step is to create a project in the Google Cloud Console:
              </p>
              
              <ol>
                <li>Go to the <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Cloud Console</a></li>
                <li>Click on the project dropdown at the top of the page</li>
                <li>Click "New Project" and follow the prompts to create it</li>
                <li>Name your project something memorable like "PureCare Calendar"</li>
                <li>Once created, select your new project from the dropdown</li>
                <li>Navigate to the dashboard of your new project</li>
              </ol>
              
              <h2>Step 2: Enable Google Calendar API</h2>
              <p>
                Next, you need to enable the necessary APIs for your project:
              </p>
              
              <ol>
                <li>In your Google Cloud project, go to "APIs & Services" &gt; "Library"</li>
                <li>Search for "Google Calendar API" and select it</li>
                <li>Click "Enable" to enable the API for your project</li>
                <li>Return to the API Library and search for "Google People API"</li>
                <li>Select it and click "Enable" (this is needed for user profile information)</li>
                <li>Return to the API Library once more and search for "Google Drive API"</li>
                <li>Select it and click "Enable" (this is required for Google's authentication system)</li>
              </ol>
              
              <div className="bg-muted p-4 rounded-md my-4">
                <p className="font-medium">Rate Limits</p>
                <p className="text-sm text-muted-foreground">
                  The Google Calendar API has a default limit of 1,000,000 queries per day, with per-minute and per-user quotas. 
                  For most applications, these limits are more than sufficient.
                </p>
              </div>
              
              <h2>Step 3: Configure OAuth Consent Screen</h2>
              <p>
                You need to set up the OAuth consent screen to request user permissions:
              </p>
              
              <ol>
                <li>In your Google Cloud project, go to "APIs & Services" &gt; "OAuth consent screen"</li>
                <li>Select "External" user type (unless you have a Google Workspace organization)</li>
                <li>Click "Create" to proceed</li>
                <li>Fill out the required fields in the "App information" section</li>
                <li>Click "Save and Continue"</li>
                <li>In the "Scopes" section, add the following scopes:
                  <ul>
                    <li><code className="bg-muted px-1 py-0.5 rounded">https://www.googleapis.com/auth/calendar</code></li>
                    <li><code className="bg-muted px-1 py-0.5 rounded">https://www.googleapis.com/auth/calendar.events</code></li>
                    <li><code className="bg-muted px-1 py-0.5 rounded">https://www.googleapis.com/auth/userinfo.email</code></li>
                    <li><code className="bg-muted px-1 py-0.5 rounded">https://www.googleapis.com/auth/userinfo.profile</code></li>
                  </ul>
                </li>
                <li>Add your email as a test user</li>
                <li>Complete the setup by reviewing your configuration</li>
              </ol>
              
              <h2>Step 4: Create OAuth Credentials</h2>
              <p>
                Now create the credentials that PureCare will use to access Google Calendar:
              </p>
              
              <ol>
                <li>In your Google Cloud project, go to "APIs & Services" &gt; "Credentials"</li>
                <li>Click "Create Credentials" and select "OAuth client ID"</li>
                <li>For Application type, select "Web application"</li>
                <li>Name your OAuth client (e.g., "PureCare Web Client")</li>
                <li>Under "Authorized JavaScript origins", add your domain (or localhost for testing)</li>
                <li>Under "Authorized redirect URIs", add your callback URL (e.g., <code className="bg-muted px-1 py-0.5 rounded">https://yourdomain.com/auth/google/callback</code>)</li>
                <li>Click "Create" to generate your credentials</li>
                <li>Copy the generated Client ID and API Key</li>
              </ol>
              
              <h2>Step 5: Configure PureCare Settings</h2>
              <p>
                Finally, add your credentials to PureCare:
              </p>
              
              <ol>
                <li>Navigate to the PureCare Settings page</li>
                <li>Click on "Google Calendar Setup" or "Integrations"</li>
                <li>Enter your Google Client ID and API Key</li>
                <li>Enter your Calendar ID (usually your email address for the primary calendar)</li>
                <li>Configure sync options according to your preferences</li>
                <li>Click "Save" to complete the setup</li>
              </ol>
              
              <h2>Testing the Integration</h2>
              <p>
                After completing the setup, you should test the integration:
              </p>
              
              <ol>
                <li>Create a new appointment in PureCare</li>
                <li>Enable the "Sync with Google Calendar" option</li>
                <li>Complete and save the appointment</li>
                <li>Check your Google Calendar to verify that the appointment appears</li>
              </ol>
              
              <h2>Troubleshooting</h2>
              <p>
                If you encounter issues with the Google Calendar integration, try these solutions:
              </p>
              
              <ul>
                <li><strong>Authentication Errors:</strong> Verify that your Client ID and API Key are correct</li>
                <li><strong>Calendar Not Updating:</strong> Check that you've selected the correct Calendar ID</li>
                <li><strong>Permission Issues:</strong> Ensure that all required scopes are enabled in the OAuth consent screen</li>
                <li><strong>Sync Failures:</strong> Confirm that your Google account has sufficient permissions for the selected calendar</li>
              </ul>
            </CardContent>
          </Card>

          {/* Related Articles */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Related Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>
                  <Link to="#" className="text-primary hover:underline flex items-center">
                    <span>Using Google Calendar with Appointments</span>
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-primary hover:underline flex items-center">
                    <span>Troubleshooting Google Calendar Sync Issues</span>
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-primary hover:underline flex items-center">
                    <span>Google Calendar Reminder Settings</span>
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button variant="outline" size="sm" asChild>
              <Link to="/docs">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Docs
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GoogleCalendarSetupDoc; 