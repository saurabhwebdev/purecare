import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  Building2, 
  CreditCard, 
  Globe, 
  BellRing, 
  Palette, 
  ShieldCheck,
  AlertTriangle,
  Trash2,
  FileX,
  UserX,
  Calendar,
  FileText,
  CircleX,
  CheckCircle2,
  Loader2,
  Mail,
  SendHorizontal,
  Users
} from 'lucide-react';
import {
  getUserSettings,
  updateSettingsModule,
  defaultSettings,
  ClinicSettings,
  LocationSettings,
  FinancialSettings,
  NotificationSettings,
  AppearanceSettings,
  GoogleSettings,
  GmailSettings,
  Provider,
  ProviderSettings
} from '@/lib/firebase/settingsService';
import { sendTestEmail as sendGmailTestEmail } from '@/lib/google/gmailService';

// Country data with currency information
const countries = [
  { code: 'US', name: 'United States', currency: 'USD', currencySymbol: '$' },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP', currencySymbol: '£' },
  { code: 'CA', name: 'Canada', currency: 'CAD', currencySymbol: 'CA$' },
  { code: 'EU', name: 'European Union', currency: 'EUR', currencySymbol: '€' },
  { code: 'IN', name: 'India', currency: 'INR', currencySymbol: '₹' },
  { code: 'SG', name: 'Singapore', currency: 'SGD', currencySymbol: 'S$' },
];

// Timezone data (shortened for brevity)
const timezones = [
  { name: 'Pacific Time (US & Canada)', value: 'America/Los_Angeles' },
  { name: 'Eastern Time (US & Canada)', value: 'America/New_York' },
  { name: 'GMT/UTC', value: 'Etc/UTC' },
  { name: 'London', value: 'Europe/London' },
  { name: 'Paris', value: 'Europe/Paris' },
  { name: 'Mumbai', value: 'Asia/Kolkata' },
  { name: 'Singapore', value: 'Asia/Singapore' },
];

// List of specialties (shortened for brevity)
const specialties = [
  'General Practice',
  'Family Medicine',
  'Internal Medicine',
  'Pediatrics',
  'Cardiology',
  'Dermatology',
  'Neurology',
  'Orthopedics',
  'Psychiatry',
  'Other',
];

const Settings = () => {
  const { user, deleteAccount } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState('');
  const [showDeletionOverlay, setShowDeletionOverlay] = useState(false);
  const [deletionStep, setDeletionStep] = useState(0);
  const [deletionComplete, setDeletionComplete] = useState(false);
  
  // Clinic Details
  const [clinicName, setClinicName] = useState('');
  const [clinicDescription, setClinicDescription] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [taxId, setTaxId] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  
  // Location Settings
  const [country, setCountry] = useState('US');
  const [timezone, setTimezone] = useState('America/New_York');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [timeFormat, setTimeFormat] = useState('12h');
  
  // Financial Settings
  const [currency, setCurrency] = useState('USD');
  const [currencySymbol, setCurrencySymbol] = useState('$');
  const [taxRate, setTaxRate] = useState('');
  const [invoicePrefix, setInvoicePrefix] = useState('INV-');
  const [paymentMethods, setPaymentMethods] = useState({
    creditCard: true,
    bankTransfer: true,
    cash: true,
    insurance: true,
  });
  
  // Notification Settings
  const [notificationsEmail, setNotificationsEmail] = useState(true);
  const [notificationsMobile, setNotificationsMobile] = useState(true);
  const [appointmentReminders, setAppointmentReminders] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  
  // Appearance Settings
  const [darkMode, setDarkMode] = useState(false);
  const [compactMode, setCompactMode] = useState(false);

  // Google Settings
  const [calendarEnabled, setCalendarEnabled] = useState(false);
  const [calendarId, setCalendarId] = useState('');
  const [syncAppointments, setSyncAppointments] = useState(true);
  const [syncReminders, setSyncReminders] = useState(true);
  const [apiKeyConfigured, setApiKeyConfigured] = useState(false);
  const [lastSyncDate, setLastSyncDate] = useState<Date | null>(null);
  const [googleClientId, setGoogleClientId] = useState('');
  const [googleApiKey, setGoogleApiKey] = useState('');

  // Gmail Settings
  const [gmailEnabled, setGmailEnabled] = useState(false);
  const [gmailClientId, setGmailClientId] = useState('');
  const [gmailApiKey, setGmailApiKey] = useState('');
  const [syncEmails, setSyncEmails] = useState(true);
  const [syncContacts, setSyncContacts] = useState(true);
  const [emailLabels, setEmailLabels] = useState<string[]>([]);
  const [gmailApiKeyConfigured, setGmailApiKeyConfigured] = useState(false);
  const [gmailLastSyncDate, setGmailLastSyncDate] = useState<Date | null>(null);
  
  // Test email state
  const [testEmailAddress, setTestEmailAddress] = useState('');
  const [isSendingTestEmail, setIsSendingTestEmail] = useState(false);

  // Deletion steps with messages and icons
  const deletionSteps = [
    { message: "Preparing to delete account...", icon: Loader2 },
    { message: "Archiving patient records...", icon: FileText },
    { message: "Removing appointment data...", icon: Calendar },
    { message: "Archiving prescription history...", icon: FileX },
    { message: "Backing up financial records...", icon: CreditCard },
    { message: "Removing user profile...", icon: UserX },
    { message: "Finalizing account deletion...", icon: Trash2 },
    { message: "Account successfully deleted", icon: CheckCircle2 }
  ];

  // Inside the Settings component, add state for providers
  const [providers, setProviders] = useState<Provider[]>([]);
  const [defaultProvider, setDefaultProvider] = useState<string | null>(null);
  const [showAddProviderForm, setShowAddProviderForm] = useState(false);
  const [editingProviderId, setEditingProviderId] = useState<string | null>(null);
  const [newProvider, setNewProvider] = useState<Omit<Provider, 'id'>>({
    name: '',
    title: 'Dr.',
    specialty: '',
    email: '',
    phone: '',
    profileImage: ''
  });

  // Load user settings from Firebase
  useEffect(() => {
    const loadSettings = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const settings = await getUserSettings(user.uid);
        
        // Populate clinic settings
        setClinicName(settings.clinic.clinicName);
        setClinicDescription(settings.clinic.clinicDescription);
        setSpecialty(settings.clinic.specialty);
        setLicenseNumber(settings.clinic.licenseNumber);
        setTaxId(settings.clinic.taxId);
        setPhone(settings.clinic.phone);
        setEmail(settings.clinic.email);
        setWebsite(settings.clinic.website);
        setAddress(settings.clinic.address);
        setCity(settings.clinic.city);
        setState(settings.clinic.state);
        setZipCode(settings.clinic.zipCode);
        
        // Populate location settings
        setCountry(settings.location.country);
        setTimezone(settings.location.timezone);
        setDateFormat(settings.location.dateFormat);
        setTimeFormat(settings.location.timeFormat);
        
        // Populate financial settings
        setCurrency(settings.financial.currency);
        setCurrencySymbol(settings.financial.currencySymbol);
        setTaxRate(settings.financial.taxRate);
        setInvoicePrefix(settings.financial.invoicePrefix);
        setPaymentMethods(settings.financial.paymentMethods);
        
        // Populate notification settings
        setNotificationsEmail(settings.notifications.notificationsEmail);
        setNotificationsMobile(settings.notifications.notificationsMobile);
        setAppointmentReminders(settings.notifications.appointmentReminders);
        setMarketingEmails(settings.notifications.marketingEmails);
        
        // Populate appearance settings
        setDarkMode(settings.appearance.darkMode);
        setCompactMode(settings.appearance.compactMode);

        // Helper function to safely parse dates
        const safelyParseDate = (dateValue: any) => {
          if (!dateValue) return null;
          try {
            const date = new Date(dateValue);
            return isNaN(date.getTime()) ? null : date;
          } catch (e) {
            return null;
          }
        };

        // Populate Google settings
        setCalendarEnabled(settings.google.calendarEnabled);
        setCalendarId(settings.google.calendarId);
        setSyncAppointments(settings.google.syncAppointments);
        setSyncReminders(settings.google.syncReminders);
        setApiKeyConfigured(settings.google.apiKeyConfigured === undefined ? false : !!settings.google.apiKeyConfigured);
        setLastSyncDate(safelyParseDate(settings.google.lastSyncDate));
        setGoogleClientId(settings.google.clientId || '');
        setGoogleApiKey(settings.google.apiKey || '');

        // Populate Gmail settings if they exist
        if (settings.gmail) {
          setGmailEnabled(settings.gmail.enabled || false);
          setGmailClientId(settings.gmail.clientId || '');
          setGmailApiKey(settings.gmail.apiKey || '');
          setSyncEmails(settings.gmail.syncEmails !== false);
          setSyncContacts(settings.gmail.syncContacts !== false);
          setEmailLabels(settings.gmail.emailLabels || []);
          setGmailApiKeyConfigured(settings.gmail.apiKeyConfigured === undefined ? false : !!settings.gmail.apiKeyConfigured);
          setGmailLastSyncDate(safelyParseDate(settings.gmail.lastSyncDate));
        }

        // Load provider settings
        if (settings.providers) {
          setProviders(settings.providers.providers || []);
          setDefaultProvider(settings.providers.defaultProvider);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        toast({
          title: 'Error loading settings',
          description: 'There was a problem loading your settings. Default values will be used.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, [user, toast]);

  // Update currency based on country selection
  useEffect(() => {
    const selectedCountry = countries.find(c => c.code === country);
    if (selectedCountry) {
      setCurrency(selectedCountry.currency);
      setCurrencySymbol(selectedCountry.currencySymbol);
    }
  }, [country]);

  // Helper functions to save settings to Firebase
  const saveClinicSettings = async () => {
    if (!user) return;
    
    const clinicSettings: ClinicSettings = {
      clinicName,
      clinicDescription,
      specialty,
      licenseNumber,
      taxId,
      phone,
      email,
      website,
      address,
      city,
      state,
      zipCode,
    };
    
    try {
      await updateSettingsModule(user.uid, 'clinic', clinicSettings);
      return true;
    } catch (error) {
      console.error('Error saving clinic settings:', error);
      return false;
    }
  };
  
  const saveLocationSettings = async () => {
    if (!user) return;
    
    const locationSettings: LocationSettings = {
      country,
      timezone,
      dateFormat,
      timeFormat,
    };
    
    try {
      await updateSettingsModule(user.uid, 'location', locationSettings);
      return true;
    } catch (error) {
      console.error('Error saving location settings:', error);
      return false;
    }
  };
  
  const saveFinancialSettings = async () => {
    if (!user) return;
    
    const financialSettings: FinancialSettings = {
      currency,
      currencySymbol,
      taxRate,
      invoicePrefix,
      paymentMethods,
    };
    
    try {
      await updateSettingsModule(user.uid, 'financial', financialSettings);
      return true;
    } catch (error) {
      console.error('Error saving financial settings:', error);
      return false;
    }
  };
  
  const saveNotificationSettings = async () => {
    if (!user) return;
    
    const notificationSettings: NotificationSettings = {
      notificationsEmail,
      notificationsMobile,
      appointmentReminders,
      marketingEmails,
    };
    
    try {
      await updateSettingsModule(user.uid, 'notifications', notificationSettings);
      return true;
    } catch (error) {
      console.error('Error saving notification settings:', error);
      return false;
    }
  };
  
  const saveAppearanceSettings = async () => {
    if (!user) return;
    
    const appearanceSettings: AppearanceSettings = {
      darkMode,
      compactMode,
    };
    
    try {
      await updateSettingsModule(user.uid, 'appearance', appearanceSettings);
      return true;
    } catch (error) {
      console.error('Error saving appearance settings:', error);
      return false;
    }
  };

  const saveGoogleSettings = async () => {
    if (!user) return;
    
    // Ensure apiKeyConfigured has a boolean value (never undefined)
    const googleSettings: GoogleSettings = {
      calendarEnabled,
      calendarId,
      syncAppointments,
      syncReminders,
      apiKeyConfigured: apiKeyConfigured === undefined ? false : apiKeyConfigured,
      lastSyncDate,
      clientId: googleClientId,
      apiKey: googleApiKey
    };
    
    try {
      await updateSettingsModule(user.uid, 'google', googleSettings);
      return true;
    } catch (error) {
      console.error('Error saving Google settings:', error);
      return false;
    }
  };

  const saveGmailSettings = async () => {
    if (!user) return;
    
    // Ensure apiKeyConfigured has a boolean value (never undefined)
    const gmailSettings: GmailSettings = {
      enabled: gmailEnabled,
      clientId: gmailClientId,
      apiKey: gmailApiKey,
      syncEmails,
      syncContacts,
      emailLabels,
      lastSyncDate: gmailLastSyncDate,
      apiKeyConfigured: gmailApiKeyConfigured === undefined ? false : gmailApiKeyConfigured
    };
    
    try {
      await updateSettingsModule(user.uid, 'gmail', gmailSettings);
      return true;
    } catch (error) {
      console.error('Error saving Gmail settings:', error);
      return false;
    }
  };

  // Add a function to save provider settings
  const saveProviderSettings = async () => {
    if (!user || !user.uid) return;
    
    try {
      const providerSettings: ProviderSettings = {
        providers,
        // Convert undefined to null for Firestore compatibility
        defaultProvider: defaultProvider || null
      };
      
      await updateSettingsModule(user.uid, 'providers', providerSettings);
      
      toast({
        title: "Provider settings saved",
        description: "Your provider settings have been updated successfully."
      });
    } catch (error) {
      console.error("Error saving provider settings:", error);
      toast({
        title: "Error saving provider settings",
        description: "There was a problem saving your provider settings.",
        variant: "destructive"
      });
    }
  };

  // Add a function to handle adding/editing providers
  const handleAddOrUpdateProvider = () => {
    if (!newProvider.name || !newProvider.specialty) {
      toast({
        title: "Missing required fields",
        description: "Please enter at least the provider's name and specialty.",
        variant: "destructive"
      });
      return;
    }
    
    const updatedProviders = [...providers];
    
    if (editingProviderId) {
      // Update existing provider
      const index = updatedProviders.findIndex(p => p.id === editingProviderId);
      if (index >= 0) {
        updatedProviders[index] = {
          ...newProvider,
          id: editingProviderId
        };
      }
    } else {
      // Add new provider
      updatedProviders.push({
        ...newProvider,
        id: crypto.randomUUID()
      });
    }
    
    setProviders(updatedProviders);
    resetProviderForm();
  };

  // Function to reset the provider form
  const resetProviderForm = () => {
    setNewProvider({
      name: '',
      title: 'Dr.',
      specialty: '',
      email: '',
      phone: '',
      profileImage: ''
    });
    setEditingProviderId(null);
    setShowAddProviderForm(false);
  };

  // Function to edit a provider
  const handleEditProvider = (provider: Provider) => {
    setEditingProviderId(provider.id);
    setNewProvider({
      name: provider.name,
      title: provider.title,
      specialty: provider.specialty,
      email: provider.email,
      phone: provider.phone,
      profileImage: provider.profileImage || ''
    });
    setShowAddProviderForm(true);
  };

  // Function to delete a provider
  const handleDeleteProvider = (providerId: string) => {
    const updatedProviders = providers.filter(p => p.id !== providerId);
    setProviders(updatedProviders);
    
    // If the default provider is deleted, set the default to null
    if (defaultProvider === providerId) {
      setDefaultProvider(null);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      
      await Promise.all([
        saveClinicSettings(),
        saveLocationSettings(),
        saveFinancialSettings(),
        saveNotificationSettings(),
        saveAppearanceSettings(),
        saveGoogleSettings(),
        saveGmailSettings(),
        saveProviderSettings()
      ]);
      
      toast({
        title: "Settings saved",
        description: "Your settings have been updated successfully."
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error saving settings",
        description: "There was a problem saving your settings.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (!user?.email || confirmEmail !== user.email) {
      toast({
        title: "Email doesn't match",
        description: "Please enter your email address correctly to confirm deletion.",
        variant: "destructive",
      });
      return;
    }
    
    setIsDeleting(true);
    setShowDeletionOverlay(true);
    
    // Simulate the deletion process with steps
    const animateDeletion = async () => {
      for (let i = 0; i < deletionSteps.length; i++) {
        setDeletionStep(i);
        // Wait between steps - total of about 10 seconds
        await new Promise(resolve => setTimeout(resolve, 1250));
      }
      
      setDeletionComplete(true);
      
      // Actually delete the account after showing all steps
      try {
        await deleteAccount();
        // No need to navigate - deleteAccount already signs the user out
        // which will trigger a redirect based on our protected routes
      } catch (error) {
        console.error('Error deleting account:', error);
        setIsDeleting(false);
        setShowDeletionOverlay(false);
      }
    };
    
    animateDeletion();
  };

  const sendTestEmail = async () => {
    if (!testEmailAddress || !gmailEnabled || !gmailClientId) {
      toast({
        title: "Cannot send test email",
        description: "Please ensure Gmail is enabled, credentials are configured, and you've entered a test email address.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSendingTestEmail(true);
    
    try {
      // Use the actual Gmail service to send a test email
      const success = await sendGmailTestEmail(testEmailAddress);
      
      if (success) {
        toast({
          title: "Test email sent!",
          description: `A test email was successfully sent to ${testEmailAddress}. Please check your inbox.`,
        });
      } else {
        toast({
          title: "Failed to send test email",
          description: "There was an error sending the test email. Please check your Gmail configuration and ensure you've granted the necessary permissions.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error sending test email:", error);
      
      // Provide more helpful error messages for specific error types
      let errorDescription = "There was an error sending the test email.";
      if (error instanceof Error) {
        if (error.message.includes("Gmail API is not ready")) {
          errorDescription = "Failed to initialize Gmail API. Please ensure you've configured the correct Client ID and granted the necessary permissions.";
        } else if (error.message.includes("authentication")) {
          errorDescription = "Authentication failed. Please check your Google Cloud configuration and ensure Gmail API is enabled.";
        } else if (error.message.includes("consent")) {
          errorDescription = "You need to grant permission to send emails. Please try again and accept the permission request.";
        } else {
          errorDescription = error.message;
        }
      }
      
      toast({
        title: "Failed to send test email",
        description: errorDescription,
        variant: "destructive"
      });
    } finally {
      setIsSendingTestEmail(false);
    }
  };

  return (
    <DashboardLayout>
      {showDeletionOverlay && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-card border rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            <div className="text-center space-y-6">
              <div className="flex flex-col items-center">
                {deletionComplete ? (
                  <CheckCircle2 className="h-16 w-16 text-green-500 mb-2" />
                ) : (
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      {React.createElement(deletionSteps[deletionStep].icon, { 
                        className: `h-10 w-10 ${deletionStep === deletionSteps.length - 1 ? 'text-green-500' : 'text-primary'}`
                      })}
                    </div>
                    <svg className="animate-spin h-16 w-16 text-primary/20" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d={`M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z`}
                      />
                    </svg>
                  </div>
                )}
              </div>
              
              <h3 className="text-xl font-semibold">
                {deletionSteps[deletionStep].message}
              </h3>
              
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-primary h-full transition-all duration-300 ease-in-out"
                  style={{ width: `${(deletionStep + 1) / deletionSteps.length * 100}%` }}
                ></div>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Please don't close this window until the process is complete.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="container max-w-6xl mx-auto p-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your clinic and application preferences
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
        <Tabs defaultValue="clinic" className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-8 w-full h-auto">
            <TabsTrigger value="clinic" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden md:inline">Clinic</span>
            </TabsTrigger>
            <TabsTrigger value="providers" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden md:inline">Providers</span>
            </TabsTrigger>
            <TabsTrigger value="financial" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden md:inline">Financial</span>
            </TabsTrigger>
            <TabsTrigger value="location" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span className="hidden md:inline">Location</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <BellRing className="h-4 w-4" />
              <span className="hidden md:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden md:inline">Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="google" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span className="hidden md:inline">Google</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              <span className="hidden md:inline">Security</span>
            </TabsTrigger>
          </TabsList>

          {/* Clinic Information Tab */}
          <TabsContent value="clinic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Clinic Information</CardTitle>
                <CardDescription>
                  Manage your clinic details and profile information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clinic-name">Clinic Name</Label>
                    <Input
                      id="clinic-name"
                      value={clinicName}
                      onChange={(e) => setClinicName(e.target.value)}
                      placeholder="Enter your clinic name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialty">Medical Specialty</Label>
                    <Select value={specialty} onValueChange={setSpecialty}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select specialty" />
                      </SelectTrigger>
                      <SelectContent>
                        {specialties.map((spec) => (
                          <SelectItem key={spec} value={spec}>
                            {spec}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clinic-description">Clinic Description</Label>
                  <Textarea
                    id="clinic-description"
                    value={clinicDescription}
                    onChange={(e) => setClinicDescription(e.target.value)}
                    placeholder="Describe your clinic, services, and mission"
                    rows={3}
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="license-number">License Number</Label>
                    <Input
                      id="license-number"
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      placeholder="Medical license number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tax-id">Tax ID / EIN</Label>
                    <Input
                      id="tax-id"
                      value={taxId}
                      onChange={(e) => setTaxId(e.target.value)}
                      placeholder="Tax identification number"
                    />
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Clinic phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Clinic email address"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://your-clinic-website.com"
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Clinic street address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State / Province</Label>
                    <Input
                      id="state"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="State or Province"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip-code">ZIP / Postal Code</Label>
                    <Input
                      id="zip-code"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      placeholder="ZIP or Postal code"
                    />
                  </div>
                </div>
              </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button onClick={() => {
                      setIsSaving(true);
                      saveClinicSettings().then((success) => {
                        setIsSaving(false);
                        if (success) {
                          toast({
                            title: "Clinic settings saved",
                            description: "Your clinic information has been updated successfully."
                          });
                        } else {
                          toast({
                            title: "Error saving settings",
                            description: "There was a problem saving your clinic information.",
                            variant: "destructive"
                          });
                        }
                      });
                    }} disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <span className="h-4 w-4 border-t-2 border-r-2 border-background rounded-full animate-spin mr-2"></span>
                          Saving...
                        </>
                      ) : (
                        'Save Clinic Info'
                      )}
                    </Button>
                  </CardFooter>
            </Card>
          </TabsContent>

          {/* Financial Tab */}
          <TabsContent value="financial" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Settings</CardTitle>
                <CardDescription>
                  Configure payment methods, tax rates, and invoice settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <div className="flex items-center space-x-2">
                      <span className="w-10 h-10 rounded-md border flex items-center justify-center text-lg font-medium">
                        {currencySymbol}
                      </span>
                      <Input
                        id="currency"
                        value={currency}
                        disabled
                        className="flex-1"
                      />
                      <p className="text-sm text-muted-foreground">
                        Set by country
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tax-rate">Default Tax Rate (%)</Label>
                    <Input
                      id="tax-rate"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={taxRate}
                      onChange={(e) => setTaxRate(e.target.value)}
                      placeholder="e.g. 7.5"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="invoice-prefix">Invoice Number Prefix</Label>
                  <Input
                    id="invoice-prefix"
                    value={invoicePrefix}
                    onChange={(e) => setInvoicePrefix(e.target.value)}
                    placeholder="e.g. INV-"
                    maxLength={10}
                  />
                  <p className="text-sm text-muted-foreground">
                    This prefix will be added to all invoice numbers (e.g. INV-0001)
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Payment Methods</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select the payment methods your clinic accepts
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="payment-credit-card"
                        checked={paymentMethods.creditCard}
                        onCheckedChange={(checked) => 
                          setPaymentMethods({...paymentMethods, creditCard: checked})
                        }
                      />
                      <Label htmlFor="payment-credit-card">Credit Card</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="payment-bank-transfer"
                        checked={paymentMethods.bankTransfer}
                        onCheckedChange={(checked) => 
                          setPaymentMethods({...paymentMethods, bankTransfer: checked})
                        }
                      />
                      <Label htmlFor="payment-bank-transfer">Bank Transfer</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="payment-cash"
                        checked={paymentMethods.cash}
                        onCheckedChange={(checked) => 
                          setPaymentMethods({...paymentMethods, cash: checked})
                        }
                      />
                      <Label htmlFor="payment-cash">Cash</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="payment-insurance"
                        checked={paymentMethods.insurance}
                        onCheckedChange={(checked) => 
                          setPaymentMethods({...paymentMethods, insurance: checked})
                        }
                      />
                      <Label htmlFor="payment-insurance">Insurance</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button onClick={() => {
                      setIsSaving(true);
                      saveFinancialSettings().then((success) => {
                        setIsSaving(false);
                        if (success) {
                          toast({
                            title: "Financial settings saved",
                            description: "Your financial settings have been updated successfully."
                          });
                        } else {
                          toast({
                            title: "Error saving settings",
                            description: "There was a problem saving your financial settings.",
                            variant: "destructive"
                          });
                        }
                      });
                    }} disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <span className="h-4 w-4 border-t-2 border-r-2 border-background rounded-full animate-spin mr-2"></span>
                          Saving...
                        </>
                      ) : (
                        'Save Financial Settings'
                      )}
                    </Button>
                  </CardFooter>
            </Card>
          </TabsContent>

          {/* Location Tab */}
          <TabsContent value="location" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Location & Regional Settings</CardTitle>
                <CardDescription>
                  Configure your location, timezone, and regional preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((c) => (
                        <SelectItem key={c.code} value={c.code}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    This will automatically set your currency and regional defaults
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date-format">Date Format</Label>
                    <Select value={dateFormat} onValueChange={setDateFormat}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select date format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time-format">Time Format</Label>
                    <Select value={timeFormat} onValueChange={setTimeFormat}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12h">12-hour (1:30 PM)</SelectItem>
                        <SelectItem value="24h">24-hour (13:30)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={() => {
                  setIsSaving(true);
                  saveLocationSettings().then((success) => {
                    setIsSaving(false);
                    if (success) {
                      toast({
                        title: "Location settings saved",
                        description: "Your location and regional settings have been updated successfully."
                      });
                    } else {
                      toast({
                        title: "Error saving settings",
                        description: "There was a problem saving your location settings.",
                        variant: "destructive"
                      });
                    }
                  });
                }} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <span className="h-4 w-4 border-t-2 border-r-2 border-background rounded-full animate-spin mr-2"></span>
                      Saving...
                    </>
                  ) : (
                    'Save Location Settings'
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Control when and how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications-email">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    id="notifications-email"
                    checked={notificationsEmail}
                    onCheckedChange={setNotificationsEmail}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications-mobile">Mobile Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications on your mobile device
                    </p>
                  </div>
                  <Switch
                    id="notifications-mobile"
                    checked={notificationsMobile}
                    onCheckedChange={setNotificationsMobile}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="appointment-reminders">Appointment Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Send automatic reminders to patients about upcoming appointments
                    </p>
                  </div>
                  <Switch
                    id="appointment-reminders"
                    checked={appointmentReminders}
                    onCheckedChange={setAppointmentReminders}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketing-emails">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates about new features and special offers
                    </p>
                  </div>
                  <Switch
                    id="marketing-emails"
                    checked={marketingEmails}
                    onCheckedChange={setMarketingEmails}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={() => {
                  setIsSaving(true);
                  saveNotificationSettings().then((success) => {
                    setIsSaving(false);
                    if (success) {
                      toast({
                        title: "Notification settings saved",
                        description: "Your notification preferences have been updated successfully."
                      });
                    } else {
                      toast({
                        title: "Error saving settings",
                        description: "There was a problem saving your notification settings.",
                        variant: "destructive"
                      });
                    }
                  });
                }} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <span className="h-4 w-4 border-t-2 border-r-2 border-background rounded-full animate-spin mr-2"></span>
                      Saving...
                    </>
                  ) : (
                    'Save Notification Settings'
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>
                  Customize the look and feel of the application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Use dark theme for the application interface
                    </p>
                  </div>
                  <Switch
                    id="dark-mode"
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="compact-mode">Compact Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Display more information with reduced spacing
                    </p>
                  </div>
                  <Switch
                    id="compact-mode"
                    checked={compactMode}
                    onCheckedChange={setCompactMode}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={() => {
                  setIsSaving(true);
                  saveAppearanceSettings().then((success) => {
                    setIsSaving(false);
                    if (success) {
                      toast({
                        title: "Appearance settings saved",
                        description: "Your appearance preferences have been updated successfully."
                      });
                    } else {
                      toast({
                        title: "Error saving settings",
                        description: "There was a problem saving your appearance settings.",
                        variant: "destructive"
                      });
                    }
                  });
                }} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <span className="h-4 w-4 border-t-2 border-r-2 border-background rounded-full animate-spin mr-2"></span>
                      Saving...
                    </>
                  ) : (
                    'Save Appearance Settings'
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Google Tab */}
          <TabsContent value="google" className="space-y-6">
            <Tabs defaultValue="calendar" className="w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Google Integrations</h2>
                <TabsList>
                  <TabsTrigger value="calendar" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Calendar</span>
                  </TabsTrigger>
                  <TabsTrigger value="gmail" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>Gmail</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Google Calendar Tab Content */}
              <TabsContent value="calendar" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Google Calendar Integration</CardTitle>
                    <CardDescription>
                      Sync appointments with your Google Calendar to manage your schedule more efficiently
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg mb-4">
                      <h3 className="text-sm font-medium mb-2">How to set up Google Calendar integration:</h3>
                      <ol className="list-decimal list-inside text-sm space-y-1 text-muted-foreground">
                        <li>Go to <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Cloud Console</a></li>
                        <li>Create a new project or select an existing one</li>
                        <li>Enable the Google Calendar API for your project</li>
                        <li>Create OAuth credentials (Web application type)</li>
                        <li>Add your application's domain to the authorized redirect URIs</li>
                        <li>Copy the Client ID and add it below</li>
                      </ol>
                    </div>

                    <div className="flex justify-center mb-4">
                      <Button 
                        onClick={() => navigate('/google-calendar-setup')}
                        className="w-full md:w-auto"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        Open Google Calendar Setup Wizard
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="calendar-enabled" className="text-base font-medium">Enable Google Calendar</Label>
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
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <Label htmlFor="google-client-id" className="text-base font-medium">Google OAuth Client ID</Label>
                      <Input
                        id="google-client-id"
                        value={googleClientId}
                        onChange={(e) => setGoogleClientId(e.target.value)}
                        placeholder="Your Google OAuth Client ID"
                      />
                      <p className="text-sm text-muted-foreground">
                        The OAuth 2.0 Client ID from your Google Cloud Console
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="google-api-key" className="text-base font-medium">Google API Key</Label>
                      <Input
                        id="google-api-key"
                        value={googleApiKey}
                        onChange={(e) => setGoogleApiKey(e.target.value)}
                        placeholder="Your Google API Key (optional)"
                      />
                      <p className="text-sm text-muted-foreground">
                        The API Key from your Google Cloud Console (only needed for certain advanced features)
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <Label htmlFor="calendar-id">Google Calendar ID</Label>
                      <Input
                        id="calendar-id"
                        value={calendarId}
                        onChange={(e) => setCalendarId(e.target.value)}
                        placeholder="e.g., primary or your_email@gmail.com"
                      />
                      <p className="text-sm text-muted-foreground">
                        Use "primary" for your main calendar or enter a specific calendar ID
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between space-x-2">
                        <div className="space-y-0.5">
                          <Label htmlFor="sync-appointments" className="text-sm font-medium">Sync Appointments</Label>
                          <p className="text-xs text-muted-foreground">
                            Automatically add all appointments to Google Calendar
                          </p>
                        </div>
                        <Switch
                          id="sync-appointments"
                          checked={syncAppointments}
                          onCheckedChange={setSyncAppointments}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between space-x-2">
                        <div className="space-y-0.5">
                          <Label htmlFor="sync-reminders" className="text-sm font-medium">Sync Reminders</Label>
                          <p className="text-xs text-muted-foreground">
                            Add email and notification reminders for appointments
                          </p>
                        </div>
                        <Switch
                          id="sync-reminders"
                          checked={syncReminders}
                          onCheckedChange={setSyncReminders}
                        />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="api-key-configured" className="text-sm font-medium">API Configuration Status</Label>
                        <p className="text-xs text-muted-foreground">
                          Indicates whether your Google API keys are properly configured and authenticated
                        </p>
                      </div>
                      <div className="flex items-center">
                        {apiKeyConfigured ? (
                          <div className="flex items-center text-green-500">
                            <CheckCircle2 className="h-5 w-5 mr-1" />
                            <span className="text-sm font-medium">Configured</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-amber-500">
                            <AlertTriangle className="h-5 w-5 mr-1" />
                            <span className="text-sm font-medium">Not Configured</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {lastSyncDate && lastSyncDate instanceof Date && !isNaN(lastSyncDate.getTime()) && (
                      <div className="text-xs text-muted-foreground text-center mt-2">
                        Last synced: {lastSyncDate.toLocaleString()}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button 
                      onClick={() => {
                        setIsSaving(true);
                        saveGoogleSettings().then((success) => {
                          setIsSaving(false);
                          if (success) {
                            toast({
                              title: "Calendar settings saved",
                              description: "Your Google Calendar settings have been updated successfully."
                            });
                          } else {
                            toast({
                              title: "Error saving settings",
                              description: "There was a problem saving your Google Calendar settings.",
                              variant: "destructive"
                            });
                          }
                        });
                      }} 
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <span className="h-4 w-4 border-t-2 border-r-2 border-background rounded-full animate-spin mr-2"></span>
                          Saving...
                        </>
                      ) : (
                        'Save Calendar Settings'
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Gmail Tab Content */}
              <TabsContent value="gmail" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Gmail Integration</CardTitle>
                    <CardDescription>
                      Sync emails and contacts with your Gmail account to streamline patient communications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg mb-4">
                      <h3 className="text-sm font-medium mb-2">How to set up Gmail integration:</h3>
                      <ol className="list-decimal list-inside text-sm space-y-1 text-muted-foreground">
                        <li>Go to <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Cloud Console</a></li>
                        <li>Create a new project or select an existing one</li>
                        <li>Enable the Gmail API for your project</li>
                        <li>Create OAuth credentials with appropriate scopes</li>
                        <li>Add your application's domain to the authorized redirect URIs</li>
                        <li>Copy the Client ID and add it below</li>
                      </ol>
                    </div>

                    <div className="flex justify-center mb-4">
                      <Button 
                        onClick={() => navigate('/google-mail-setup')}
                        className="w-full md:w-auto"
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        Open Gmail Setup Wizard
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="gmail-enabled" className="text-base font-medium">Enable Gmail Integration</Label>
                        <p className="text-sm text-muted-foreground">
                          Turn on to enable email and contact syncing with Gmail
                        </p>
                      </div>
                      <Switch
                        id="gmail-enabled"
                        checked={gmailEnabled}
                        onCheckedChange={setGmailEnabled}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <Label htmlFor="gmail-client-id" className="text-base font-medium">Gmail OAuth Client ID</Label>
                      <Input
                        id="gmail-client-id"
                        value={gmailClientId}
                        onChange={(e) => setGmailClientId(e.target.value)}
                        placeholder="Your Gmail OAuth Client ID"
                      />
                      <p className="text-sm text-muted-foreground">
                        The OAuth 2.0 Client ID from your Google Cloud Console
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gmail-api-key" className="text-base font-medium">Gmail API Key</Label>
                      <Input
                        id="gmail-api-key"
                        value={gmailApiKey}
                        onChange={(e) => setGmailApiKey(e.target.value)}
                        placeholder="Your Gmail API Key (optional)"
                      />
                      <p className="text-sm text-muted-foreground">
                        The API Key from your Google Cloud Console
                      </p>
                    </div>
                    
                    <Separator />
                    
                    {/* Test Email Functionality */}
                    <div className="space-y-2 p-4 bg-muted/50 rounded-lg border">
                      <div className="flex items-center">
                        <SendHorizontal className="h-5 w-5 mr-2 text-primary" />
                        <Label htmlFor="test-email" className="text-base font-medium">Send Test Email</Label>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Send a test email to verify your Gmail integration is working correctly
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Input
                          id="test-email"
                          type="email"
                          value={testEmailAddress}
                          onChange={(e) => setTestEmailAddress(e.target.value)}
                          placeholder="Enter recipient email address"
                          className="flex-1"
                        />
                        <Button 
                          onClick={sendTestEmail}
                          disabled={isSendingTestEmail || !testEmailAddress || !gmailEnabled}
                          className="min-w-[120px]"
                        >
                          {isSendingTestEmail ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <SendHorizontal className="h-4 w-4 mr-2" />
                              Send Test
                            </>
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {!gmailEnabled ? "Enable Gmail Integration to send test emails" : 
                         !gmailClientId ? "Configure your Gmail OAuth Client ID first" : 
                         "A test email will be sent to verify your Gmail configuration"}
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <Label htmlFor="email-labels" className="text-base font-medium">Email Labels to Sync</Label>
                      <Input
                        id="email-labels"
                        value={emailLabels.join(',')}
                        onChange={(e) => setEmailLabels(e.target.value.split(',').map(label => label.trim()).filter(label => label !== ''))}
                        placeholder="e.g., INBOX,SENT,Patients,Appointments"
                      />
                      <p className="text-sm text-muted-foreground">
                        Specify which email labels to sync, separated by commas. Leave blank to sync all emails.
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between space-x-2">
                        <div className="space-y-0.5">
                          <Label htmlFor="sync-emails" className="text-sm font-medium">Sync Emails</Label>
                          <p className="text-xs text-muted-foreground">
                            Sync emails from the specified labels
                          </p>
                        </div>
                        <Switch
                          id="sync-emails"
                          checked={syncEmails}
                          onCheckedChange={setSyncEmails}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between space-x-2">
                        <div className="space-y-0.5">
                          <Label htmlFor="sync-contacts" className="text-sm font-medium">Sync Contacts</Label>
                          <p className="text-xs text-muted-foreground">
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
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="gmail-api-configured" className="text-sm font-medium">API Configuration Status</Label>
                        <p className="text-xs text-muted-foreground">
                          Indicates whether your Gmail API keys are properly configured and authenticated
                        </p>
                      </div>
                      <div className="flex items-center">
                        {gmailApiKeyConfigured ? (
                          <div className="flex items-center text-green-500">
                            <CheckCircle2 className="h-5 w-5 mr-1" />
                            <span className="text-sm font-medium">Configured</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-amber-500">
                            <AlertTriangle className="h-5 w-5 mr-1" />
                            <span className="text-sm font-medium">Not Configured</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {gmailLastSyncDate && gmailLastSyncDate instanceof Date && !isNaN(gmailLastSyncDate.getTime()) && (
                      <div className="text-xs text-muted-foreground text-center mt-2">
                        Last synced: {gmailLastSyncDate.toLocaleString()}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button 
                      onClick={() => {
                        setIsSaving(true);
                        saveGmailSettings().then((success) => {
                          setIsSaving(false);
                          if (success) {
                            toast({
                              title: "Gmail settings saved",
                              description: "Your Gmail settings have been updated successfully."
                            });
                          } else {
                            toast({
                              title: "Error saving settings",
                              description: "There was a problem saving your Gmail settings.",
                              variant: "destructive"
                            });
                          }
                        });
                      }} 
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <span className="h-4 w-4 border-t-2 border-r-2 border-background rounded-full animate-spin mr-2"></span>
                          Saving...
                        </>
                      ) : (
                        'Save Gmail Settings'
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Providers Tab */}
          <TabsContent value="providers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Healthcare Providers</CardTitle>
                <CardDescription>
                  Manage doctors and healthcare providers who see patients at your clinic
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {providers.length > 0 ? (
                  <div className="space-y-4">
                    {providers.map((provider) => (
                      <div key={provider.id} className="border rounded-lg p-4 flex justify-between items-center">
                        <div>
                          <div className="font-medium">{provider.title} {provider.name}</div>
                          <div className="text-sm text-muted-foreground">{provider.specialty}</div>
                          {provider.email && (
                            <div className="text-sm">{provider.email}</div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {defaultProvider === provider.id ? (
                            <span className="text-xs bg-primary/10 text-primary py-1 px-2 rounded-full">Default</span>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setDefaultProvider(provider.id)}
                            >
                              Set as Default
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEditProvider(provider)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteProvider(provider.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <p>No providers added yet. Add your first provider to get started.</p>
                  </div>
                )}

                {showAddProviderForm ? (
                  <div className="border rounded-lg p-4 space-y-4">
                    <h3 className="font-medium text-lg">
                      {editingProviderId ? 'Edit Provider' : 'Add Provider'}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="provider-title">Title</Label>
                        <Select 
                          value={newProvider.title} 
                          onValueChange={(value) => setNewProvider({...newProvider, title: value})}
                        >
                          <SelectTrigger id="provider-title">
                            <SelectValue placeholder="Select title" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Dr.">Dr.</SelectItem>
                            <SelectItem value="Prof.">Prof.</SelectItem>
                            <SelectItem value="Mr.">Mr.</SelectItem>
                            <SelectItem value="Mrs.">Mrs.</SelectItem>
                            <SelectItem value="Ms.">Ms.</SelectItem>
                            <SelectItem value="none">None</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="provider-name">Name *</Label>
                        <Input
                          id="provider-name"
                          value={newProvider.name}
                          onChange={(e) => setNewProvider({...newProvider, name: e.target.value})}
                          placeholder="Full name"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="provider-specialty">Specialty *</Label>
                      <Select 
                        value={newProvider.specialty} 
                        onValueChange={(value) => setNewProvider({...newProvider, specialty: value})}
                      >
                        <SelectTrigger id="provider-specialty">
                          <SelectValue placeholder="Select specialty" />
                        </SelectTrigger>
                        <SelectContent>
                          {specialties.map((spec) => (
                            <SelectItem key={spec} value={spec}>
                              {spec}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="provider-email">Email</Label>
                        <Input
                          id="provider-email"
                          type="email"
                          value={newProvider.email}
                          onChange={(e) => setNewProvider({...newProvider, email: e.target.value})}
                          placeholder="Email address"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="provider-phone">Phone</Label>
                        <Input
                          id="provider-phone"
                          value={newProvider.phone}
                          onChange={(e) => setNewProvider({...newProvider, phone: e.target.value})}
                          placeholder="Phone number"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="provider-image">Profile Image URL (optional)</Label>
                      <Input
                        id="provider-image"
                        value={newProvider.profileImage}
                        onChange={(e) => setNewProvider({...newProvider, profileImage: e.target.value})}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="outline" onClick={resetProviderForm}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddOrUpdateProvider}>
                        {editingProviderId ? 'Update Provider' : 'Add Provider'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button onClick={() => setShowAddProviderForm(true)}>
                    Add Provider
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security & Privacy</CardTitle>
                <CardDescription>
                  Manage security settings and data privacy
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Two-Factor Authentication</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Add an extra layer of security to your account
                    </p>
                    <Button variant="outline">Enable 2FA</Button>
                  </div>

                  <Separator />
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Password</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Change your account password
                    </p>
                    <Button variant="outline">Change Password</Button>
                  </div>

                  <Separator />
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Data Privacy</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Manage your data and privacy preferences
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline">Download Your Data</Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive">Delete Account</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              <div className="space-y-2">
                                <p>This action cannot be undone. This will permanently delete your account and remove your data from our systems.</p>
                                <div className="flex items-start mt-4 p-3 bg-destructive/10 rounded text-destructive text-sm">
                                  <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
                                  <div>
                                    <p className="font-medium">Warning:</p>
                                    <ul className="list-disc list-inside pl-1 mt-1">
                                      <li>All your patient records will be deleted</li>
                                      <li>Your appointment history will be removed</li>
                                      <li>Your invoices and financial data will be deleted</li>
                                      <li>Your clinic settings and preferences will be lost</li>
                                    </ul>
                                  </div>
                                </div>
                                
                                <div className="mt-6">
                                  <p className="mb-2 text-sm font-medium">To confirm, please type your email address:</p>
                                  <Input
                                    type="email"
                                    placeholder={user?.email || 'your@email.com'}
                                    value={confirmEmail}
                                    onChange={(e) => setConfirmEmail(e.target.value)}
                                    className="mt-1"
                                  />
                                </div>
                              </div>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleDeleteAccount}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              disabled={isDeleting}
                            >
                              {isDeleting ? (
                                <>
                                  <span className="h-4 w-4 border-t-2 border-r-2 border-background rounded-full animate-spin mr-2"></span>
                                  Deleting...
                                </>
                              ) : (
                                "Yes, delete account"
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleSaveSettings} disabled={isSaving} size="lg">
            {isSaving ? (
              <>
                <span className="h-4 w-4 border-t-2 border-r-2 border-background rounded-full animate-spin mr-2"></span>
                    Saving All Settings...
              </>
            ) : (
              'Save All Settings'
            )}
          </Button>
        </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Settings; 