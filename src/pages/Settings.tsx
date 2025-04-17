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
  Loader2
} from 'lucide-react';
import {
  getUserSettings,
  updateSettingsModule,
  defaultSettings,
  ClinicSettings,
  LocationSettings,
  FinancialSettings,
  NotificationSettings,
  AppearanceSettings
} from '@/lib/firebase/settingsService';

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

  const handleSaveSettings = async () => {
    if (!user) return;
    
    setIsSaving(true);
    
    try {
      // Save all settings modules
      const results = await Promise.all([
        saveClinicSettings(),
        saveLocationSettings(),
        saveFinancialSettings(),
        saveNotificationSettings(),
        saveAppearanceSettings()
      ]);
      
      // Check if all saves were successful
      if (results.every(result => result === true)) {
        toast({
          title: 'Settings saved',
          description: 'Your settings have been saved successfully.',
        });
      } else {
        toast({
          title: 'Partial save',
          description: 'Some settings may not have been saved correctly.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Error saving settings',
        description: 'There was a problem saving your settings.',
        variant: 'destructive',
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
          <TabsList className="grid grid-cols-2 md:grid-cols-6 w-full h-auto">
            <TabsTrigger value="clinic" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden md:inline">Clinic</span>
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