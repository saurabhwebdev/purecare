import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Medicine, Prescription, createPrescription, updatePrescription } from '@/lib/firebase/prescriptionService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Plus, X, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import AISymptomsSuggestion from './AISymptomsSuggestion';

// Option for medicine frequency
const frequencyOptions = [
  'Once daily',
  'Twice daily',
  'Three times daily',
  'Four times daily',
  'Every 4 hours',
  'Every 6 hours',
  'Every 8 hours',
  'Every 12 hours',
  'As needed',
  'Before meals',
  'After meals',
  'At bedtime',
];

// Options for medicine duration
const durationOptions = [
  '3 days',
  '5 days',
  '7 days',
  '10 days',
  '14 days',
  '1 month',
  '2 months',
  '3 months',
  'As directed',
  'Until finished',
];

// Default empty medicine
const emptyMedicine: Medicine = {
  name: '',
  dosage: '',
  frequency: '',
  duration: '',
  instructions: '',
};

interface PrescriptionFormProps {
  prescription?: Prescription;
  mode: 'create' | 'edit';
  patientId?: string;
  patientName?: string;
}

const PrescriptionForm: React.FC<PrescriptionFormProps> = ({
  prescription,
  mode,
  patientId,
  patientName,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState(prescription?.diagnosis || '');
  const [notes, setNotes] = useState(prescription?.notes || '');
  const [status, setStatus] = useState<'active' | 'completed' | 'cancelled'>(
    prescription?.status || 'active'
  );
  const [medicines, setMedicines] = useState<Medicine[]>(
    prescription?.medicines || [{ ...emptyMedicine }]
  );
  const [errors, setErrors] = useState<{
    diagnosis?: string;
    medicines?: string;
    general?: string;
  }>({});

  // Handle adding a new medicine
  const handleAddMedicine = () => {
    setMedicines([...medicines, { ...emptyMedicine }]);
  };

  // Handle removing a medicine
  const handleRemoveMedicine = (index: number) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  // Handle updating a medicine field
  const handleMedicineChange = (index: number, field: keyof Medicine, value: string) => {
    const updatedMedicines = [...medicines];
    updatedMedicines[index] = {
      ...updatedMedicines[index],
      [field]: value,
    };
    setMedicines(updatedMedicines);
  };

  // Handle adding a medicine from AI suggestions
  const handleAddMedicineFromAI = (medicine: Medicine) => {
    setMedicines([...medicines, medicine]);
    toast({
      title: 'Medicine Added',
      description: `${medicine.name} has been added to the prescription.`,
    });
  };

  // Validate the form
  const validateForm = () => {
    const newErrors: {
      diagnosis?: string;
      medicines?: string;
      general?: string;
    } = {};

    // Check if there are any medicines
    if (medicines.length === 0) {
      newErrors.medicines = 'At least one medicine must be added';
    }

    // Check if all medicines have required fields
    const hasIncompleteMedicines = medicines.some(
      med => !med.name || !med.dosage || !med.frequency || !med.duration
    );
    
    if (hasIncompleteMedicines) {
      newErrors.medicines = 'All medicine fields except instructions are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setErrors({ general: 'You must be logged in to create a prescription' });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (mode === 'create') {
        // Use the patientId and patientName props for new prescriptions
        if (!patientId || !patientName) {
          throw new Error('Patient information is required');
        }

        const newPrescription: Omit<Prescription, 'id' | 'createdAt' | 'updatedAt' | 'clinicInfo'> = {
          patientId,
          patientName,
          doctorId: user.uid,
          medicines,
          diagnosis,
          notes,
          status,
        };

        await createPrescription(user.uid, newPrescription);
        toast({
          title: 'Success',
          description: 'Prescription created successfully',
        });
        
        // Navigate back to prescriptions list
        navigate('/prescriptions');
      } else if (mode === 'edit' && prescription?.id) {
        // Update existing prescription
        await updatePrescription(prescription.id, {
          medicines,
          diagnosis,
          notes,
          status,
        });
        
        toast({
          title: 'Success',
          description: 'Prescription updated successfully',
        });
        
        // Navigate back to prescriptions list
        navigate('/prescriptions');
      }
    } catch (error) {
      console.error('Error saving prescription:', error);
      setErrors({
        general: 'Failed to save prescription. Please try again.',
      });
      toast({
        title: 'Error',
        description: 'Failed to save prescription',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center">
        <Button
          variant="outline"
          size="icon"
          className="mr-2"
          onClick={() => navigate('/prescriptions')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {mode === 'create' ? 'New Prescription' : 'Edit Prescription'}
          </h1>
          <p className="text-gray-500">
            {mode === 'create'
              ? `Creating prescription for ${patientName}`
              : `Editing prescription for ${prescription?.patientName}`}
          </p>
        </div>
      </div>

      {errors.general && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errors.general}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Prescription Details</CardTitle>
            <CardDescription>
              Enter the diagnosis and prescription details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="diagnosis">Diagnosis</Label>
              <Textarea
                id="diagnosis"
                placeholder="Enter diagnosis"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value as 'active' | 'completed' | 'cancelled')}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Medications</CardTitle>
            <CardDescription>
              Add medications to the prescription or use AI to suggest medications based on symptoms
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {errors.medicines && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errors.medicines}</AlertDescription>
              </Alert>
            )}

            {/* AI Symptoms Suggestion Component */}
            <AISymptomsSuggestion onMedicineAdd={handleAddMedicineFromAI} />

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Medications List</h3>
              {medicines.map((medicine, index) => (
                <div key={index} className="relative border rounded-lg p-4 mb-4">
                  {medicines.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => handleRemoveMedicine(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`medicine-name-${index}`}>Medicine Name</Label>
                      <Input
                        id={`medicine-name-${index}`}
                        placeholder="Medicine name"
                        value={medicine.name}
                        onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`medicine-dosage-${index}`}>Dosage</Label>
                      <Input
                        id={`medicine-dosage-${index}`}
                        placeholder="e.g., 500mg, 5ml"
                        value={medicine.dosage}
                        onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`medicine-frequency-${index}`}>Frequency</Label>
                      <Select
                        value={medicine.frequency}
                        onValueChange={(value) => handleMedicineChange(index, 'frequency', value)}
                      >
                        <SelectTrigger id={`medicine-frequency-${index}`}>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          {frequencyOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`medicine-duration-${index}`}>Duration</Label>
                      <Select
                        value={medicine.duration}
                        onValueChange={(value) => handleMedicineChange(index, 'duration', value)}
                      >
                        <SelectTrigger id={`medicine-duration-${index}`}>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          {durationOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor={`medicine-instructions-${index}`}>Special Instructions</Label>
                      <Textarea
                        id={`medicine-instructions-${index}`}
                        placeholder="Special instructions for this medication (optional)"
                        value={medicine.instructions}
                        onChange={(e) => handleMedicineChange(index, 'instructions', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={handleAddMedicine}
              >
                <Plus className="h-4 w-4" />
                Add Medicine Manually
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Additional Notes</CardTitle>
            <CardDescription>
              Add any additional notes or instructions for the prescription
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Additional notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px]"
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4 mb-8">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/prescriptions')}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : mode === 'create' ? 'Create Prescription' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PrescriptionForm; 