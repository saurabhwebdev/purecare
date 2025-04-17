import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth/AuthContext';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';

import {
  Patient,
  getPatient,
  updatePatient
} from '@/lib/firebase/patientService';

const EditPatient = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [patient, setPatient] = useState<Patient | null>(null);
  
  // Fetch patient data
  useEffect(() => {
    const fetchPatient = async () => {
      if (!user || !id) return;
      
      setLoading(true);
      try {
        const patientData = await getPatient(user.uid, id);
        if (!patientData) {
          toast({
            title: "Patient not found",
            description: "This patient record does not exist.",
            variant: "destructive",
          });
          navigate('/patients');
          return;
        }
        setPatient(patientData);
      } catch (error) {
        console.error('Error fetching patient:', error);
        toast({
          title: "Error",
          description: "Failed to load patient data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPatient();
  }, [user, id, toast, navigate]);
  
  // Update form field
  const updateField = (field: string, value: string) => {
    if (!patient) return;
    
    setPatient({
      ...patient,
      [field]: value
    });
  };
  
  // Save changes
  const handleSave = async () => {
    if (!user || !patient || !id) return;
    
    setSaving(true);
    try {
      await updatePatient(user.uid, id, patient);
      
      toast({
        title: "Changes saved",
        description: "Patient information has been updated successfully.",
      });
      
      navigate(`/patients/${id}`);
    } catch (error) {
      console.error('Error updating patient:', error);
      toast({
        title: "Error",
        description: "Failed to update patient information.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-2 mb-6">
            <Button variant="ghost" size="icon" onClick={() => navigate(`/patients/${id}`)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Skeleton className="h-8 w-48" />
          </div>
          
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }
  
  if (!patient) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Patient Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The patient you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/patients')}>
              Return to Patients
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        {/* Header with back button */}
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/patients/${id}`)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Edit Patient</h1>
        </div>
        
        {/* Edit Form */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
            <CardDescription>
              Update {patient.name}'s information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={patient.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="Enter patient's full name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={patient.dateOfBirth}
                  onChange={(e) => updateField('dateOfBirth', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={patient.gender}
                  onValueChange={(value) => updateField('gender', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                    <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={patient.status}
                  onValueChange={(value) => updateField('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={patient.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="Enter email address"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={patient.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={patient.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  placeholder="Enter patient's address"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                <Input
                  id="insuranceProvider"
                  value={patient.insuranceProvider}
                  onChange={(e) => updateField('insuranceProvider', e.target.value)}
                  placeholder="Enter insurance provider"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="insuranceNumber">Insurance ID Number</Label>
                <Input
                  id="insuranceNumber"
                  value={patient.insuranceNumber}
                  onChange={(e) => updateField('insuranceNumber', e.target.value)}
                  placeholder="Enter insurance ID"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => navigate(`/patients/${id}`)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={saving}
              className="gap-2"
            >
              {saving ? (
                <>
                  <div className="h-4 w-4 border-t-2 border-r-2 border-foreground rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default EditPatient; 