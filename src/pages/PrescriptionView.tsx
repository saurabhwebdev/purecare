import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth/AuthContext';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  Prescription, 
  getPrescriptionWithSettings 
} from '@/lib/firebase/prescriptionService';
import { getPatient } from '@/lib/firebase/patientService';
import { sendPrescriptionEmail } from '@/lib/google/prescriptionEmailService';
import { UserSettings } from '@/lib/firebase/settingsService';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  AlertTriangle, 
  ArrowLeft, 
  FileText, 
  Pencil,
  Clock,
  Calendar,
  User,
  FileCheck,
  Pill,
  Mail
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import PrescriptionPDF from '@/components/prescription/PrescriptionPDF';
import { generatePrescriptionPDF, downloadBlob } from '@/lib/pdf/pdfGenerator';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const PrescriptionView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPrescription = async () => {
      if (!id || !user) return;

      try {
        setLoading(true);
        const data = await getPrescriptionWithSettings(user.uid, id);
        
        // Check if the prescription belongs to the current doctor
        if (data.prescription.doctorId !== user.uid) {
          setError('You do not have permission to view this prescription');
          return;
        }
        
        setPrescription(data.prescription);
        setSettings(data.settings);
      } catch (error) {
        console.error('Error fetching prescription:', error);
        setError('Failed to load prescription');
        toast({
          title: 'Error',
          description: 'Failed to load prescription details',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPrescription();
  }, [id, user, toast]);

  // Format date
  const formatDate = (date: Date | any) => {
    if (!date) return 'N/A';
    try {
      const dateObj = date instanceof Date ? date : date.toDate();
      return format(dateObj, 'MMMM dd, yyyy');
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Handle editing the prescription
  const handleEdit = () => {
    if (prescription?.id) {
      navigate(`/prescriptions/edit/${prescription.id}`);
    }
  };

  // Handle going back to prescriptions list
  const handleBackToList = () => {
    navigate('/prescriptions');
  };

  // Generate and download PDF
  const handleDownloadPDF = async () => {
    if (!pdfRef.current || !prescription) return;
    
    setGeneratingPDF(true);
    
    try {
      const { blob, filename } = await generatePrescriptionPDF(pdfRef.current, prescription);
      downloadBlob(blob, filename);
      
      toast({
        title: 'Success',
        description: 'Prescription PDF downloaded successfully.',
      });
      
      setShowPDFPreview(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate prescription PDF.',
        variant: 'destructive',
      });
    } finally {
      setGeneratingPDF(false);
    }
  };

  // Handle sending the prescription email
  const handleSendEmail = async () => {
    if (!user || !prescription) return;
    
    try {
      setSendingEmail(true);
      
      // Validate patientId exists
      if (!prescription.patientId) {
        toast({
          title: "Invalid prescription",
          description: "This prescription doesn't have a valid patient ID.",
          variant: "destructive",
        });
        return;
      }
      
      // Get patient data from the database
      let patientData = await getPatient(user.uid, prescription.patientId);
      
      // If we can't find the patient or there's no email, prompt for manual entry
      if (!patientData || !patientData.email) {
        toast({
          title: "Email not found",
          description: "Patient email address is not available. Would you like to send the email to a different address?",
          variant: "destructive",
          action: (
            <div className="flex items-center mt-2">
              <Input 
                id="manual-email"
                type="email"
                placeholder="Enter email address"
                className="mr-2 h-8"
                onChange={(e) => {
                  if (e.target.value && e.target.value.includes('@')) {
                    const manualEmail = e.target.value;
                    // Send email to manually entered address
                    if (confirm(`Send email to ${manualEmail}?`)) {
                      sendPrescriptionEmail(user.uid, prescription, manualEmail)
                        .then(result => {
                          if (result.success) {
                            toast({
                              title: "Email sent",
                              description: `Prescription sent to ${manualEmail}`,
                            });
                          } else {
                            toast({
                              title: "Email failed",
                              description: result.message,
                              variant: "destructive",
                            });
                          }
                        })
                        .finally(() => setSendingEmail(false));
                    } else {
                      setSendingEmail(false);
                    }
                  }
                }}
              />
            </div>
          )
        });
        return;
      }
      
      // Send prescription confirmation email
      const result = await sendPrescriptionEmail(user.uid, prescription, patientData.email);
      
      // Show result toast
      if (result.success) {
        toast({
          title: "Email sent",
          description: `Prescription sent to ${patientData.email}`,
        });
      } else {
        toast({
          title: "Email failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error sending prescription email:', error);
      toast({
        title: 'Error',
        description: 'There was a problem sending the prescription email.',
        variant: 'destructive',
      });
    } finally {
      setSendingEmail(false);
    }
  };

  // Get badge variant based on status
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'outline';
      case 'completed':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <DashboardLayout>
      <div className="w-full backdrop-blur-md bg-background/80 py-4 border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleBackToList}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">
                  {loading ? 'Loading Prescription...' : 
                    prescription ? `Prescription for ${prescription.patientName}` : 
                    'Prescription Details'}
                </h1>
                <p className="text-muted-foreground">
                  {loading ? 'Loading details...' : 
                    error ? 'Error loading prescription' : 
                    prescription ? formatDate(prescription.createdAt) : 
                    'Prescription not found'}
                </p>
              </div>
            </div>
            {prescription && !error && !loading && (
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-1"
                  onClick={handleEdit}
                >
                  <Pencil className="h-4 w-4" />
                  <span>Edit</span>
                </Button>
                <Button 
                  variant="outline"
                  className="flex items-center gap-1"
                  onClick={handleSendEmail}
                  disabled={sendingEmail}
                >
                  <Mail className="h-4 w-4" />
                  <span>{sendingEmail ? 'Sending...' : 'Send Email'}</span>
                </Button>
                <Button 
                  className="flex items-center gap-1"
                  onClick={() => setShowPDFPreview(true)}
                >
                  <FileText className="h-4 w-4" />
                  <span>Generate PDF</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <Skeleton className="h-32 rounded-lg" />
              <Skeleton className="h-32 rounded-lg" />
              <Skeleton className="h-32 rounded-lg" />
            </div>
            <Skeleton className="h-64 rounded-lg" />
            <Skeleton className="h-96 rounded-lg" />
          </div>
        ) : error ? (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            <div className="mt-4">
              <Button onClick={handleBackToList}>
                Back to Prescriptions
              </Button>
            </div>
          </Alert>
        ) : prescription && settings ? (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="bg-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    Date
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-medium">{formatDate(prescription.createdAt)}</p>
                </CardContent>
              </Card>
              
              <Card className="bg-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    Patient
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-medium">{prescription.patientName}</p>
                  <p className="text-sm text-muted-foreground">ID: {prescription.patientId}</p>
                </CardContent>
              </Card>
              
              <Card className="bg-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <FileCheck className="h-4 w-4 text-primary" />
                    Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant={getBadgeVariant(prescription.status)}>
                    {prescription.status.toUpperCase()}
                  </Badge>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-card">
              <CardHeader>
                <CardTitle>Diagnosis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line text-foreground">
                  {prescription.diagnosis || 'No diagnosis provided'}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-4 w-4 text-primary" />
                  Medications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {prescription.medicines.length > 0 ? (
                  prescription.medicines.map((medicine, index) => (
                    <div key={index} className="border-b border-border pb-4 last:border-0 last:pb-0">
                      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs">
                          {index + 1}
                        </span>
                        {medicine.name}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Dosage</p>
                          <p>{medicine.dosage}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Frequency</p>
                          <p>{medicine.frequency}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Duration</p>
                          <p>{medicine.duration}</p>
                        </div>
                      </div>
                      {medicine.instructions && (
                        <div className="mt-2">
                          <p className="text-sm text-muted-foreground">Instructions</p>
                          <p>{medicine.instructions}</p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No medications prescribed</p>
                )}
              </CardContent>
            </Card>

            {prescription.notes && (
              <Card className="bg-card">
                <CardHeader>
                  <CardTitle>Additional Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line">{prescription.notes}</p>
                </CardContent>
              </Card>
            )}

            <Card className="bg-card">
              <CardHeader>
                <CardTitle>Clinic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>
                  <span className="font-medium">Clinic:</span> {prescription.clinicInfo?.clinicName || settings.clinic.clinicName}
                </p>
                <p>
                  <span className="font-medium">Address:</span> {prescription.clinicInfo?.clinicAddress || 
                    `${settings.clinic.address}, ${settings.clinic.city}, ${settings.clinic.state} ${settings.clinic.zipCode}`}
                </p>
                <p>
                  <span className="font-medium">Contact:</span> {prescription.clinicInfo?.clinicContact || 
                    `Phone: ${settings.clinic.phone} | Email: ${settings.clinic.email}`}
                </p>
                <p>
                  <span className="font-medium">Doctor:</span> {prescription.clinicInfo?.doctorName || 'Dr.'}
                </p>
                <p>
                  <span className="font-medium">Specialty:</span> {prescription.clinicInfo?.doctorSpecialty || settings.clinic.specialty}
                </p>
                <p>
                  <span className="font-medium">License:</span> {prescription.clinicInfo?.doctorLicense || settings.clinic.licenseNumber}
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex flex-col items-center justify-center text-center">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Prescription Not Found</h2>
              <p className="text-muted-foreground mb-6">
                The prescription you're trying to view could not be found or may have been deleted.
              </p>
              <Button onClick={handleBackToList}>
                Back to Prescriptions
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* PDF Preview Dialog */}
      <Dialog open={showPDFPreview} onOpenChange={setShowPDFPreview}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>Prescription Preview</DialogTitle>
            <DialogDescription>
              Review the prescription PDF before downloading.
            </DialogDescription>
          </DialogHeader>
          
          <div className="border rounded-lg overflow-auto max-h-[70vh]">
            {prescription && settings ? (
              <PrescriptionPDF 
                ref={pdfRef} 
                prescription={prescription} 
                settings={settings} 
              />
            ) : (
              <div className="p-8 text-center">
                <Skeleton className="h-40 w-full mb-4" />
                <Skeleton className="h-10 w-3/4 mx-auto mb-2" />
                <Skeleton className="h-10 w-1/2 mx-auto" />
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowPDFPreview(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDownloadPDF} 
              disabled={generatingPDF}
            >
              {generatingPDF ? 'Generating PDF...' : 'Download PDF'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default PrescriptionView; 