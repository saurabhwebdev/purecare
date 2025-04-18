import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Lightbulb, Plus, Sparkles } from "lucide-react";
import { generateMedicalSuggestions } from '@/lib/gemini';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Medicine } from '@/lib/firebase/prescriptionService';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from '@/lib/auth/AuthContext';
import { checkDoctorHasLearningData } from '@/lib/firebase/aiLearningService';

interface AISymptomsSuggestionProps {
  onMedicineAdd: (medicine: Medicine) => void;
}

export function AISymptomsSuggestion({ onMedicineAdd }: AISymptomsSuggestionProps) {
  const [symptoms, setSymptoms] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Medicine[]>([]);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [hasLearningData, setHasLearningData] = useState(false);
  const { user } = useAuth();

  // Check if we have any learning data from past interactions
  useEffect(() => {
    const checkLearningData = async () => {
      if (user?.uid) {
        try {
          const hasData = await checkDoctorHasLearningData(user.uid);
          setHasLearningData(hasData);
        } catch (error) {
          console.error("Error checking learning data:", error);
        }
      }
    };
    
    checkLearningData();
  }, [user]);

  const handleGenerateSuggestions = async () => {
    if (!symptoms.trim()) {
      setError("Please enter symptoms first");
      return;
    }

    if (!user?.uid) {
      setError("Must be logged in to use AI suggestions");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuggestions([]);

    try {
      // Use the new learning-enabled function with Firebase
      const result = await generateMedicalSuggestions(symptoms, user.uid);
      
      // Parse the response into medication objects
      const medicationObjects = parseMedicationResponse(result);
      setSuggestions(medicationObjects);
      
      if (medicationObjects.length === 0) {
        setError("Unable to parse medication suggestions. Please try again.");
      } else {
        // Learning data is now being saved to Firebase
        // Update learning status flag 
        setHasLearningData(true);
      }
    } catch (error) {
      console.error("Error generating suggestions:", error);
      setError("Failed to generate suggestions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const parseMedicationResponse = (response: string): Medicine[] => {
    const medications: Medicine[] = [];
    const medicationBlocks = response.split(/MEDICATION \d+:/g).filter(block => block.trim());
    
    for (const block of medicationBlocks) {
      try {
        const nameMatch = block.match(/Name:\s*(.+)(?:\n|$)/);
        const dosageMatch = block.match(/Dosage:\s*(.+)(?:\n|$)/);
        const frequencyMatch = block.match(/Frequency:\s*(.+)(?:\n|$)/);
        const durationMatch = block.match(/Duration:\s*(.+)(?:\n|$)/);
        const instructionsMatch = block.match(/Instructions:\s*(.+)(?:\n|$)/);
        
        if (nameMatch && dosageMatch && frequencyMatch && durationMatch) {
          medications.push({
            name: nameMatch[1].trim(),
            dosage: dosageMatch[1].trim(),
            frequency: frequencyMatch[1].trim(),
            duration: durationMatch[1].trim(),
            instructions: instructionsMatch ? instructionsMatch[1].trim() : '',
          });
        }
      } catch (error) {
        console.error("Error parsing medication block:", error);
      }
    }
    
    return medications;
  };

  const handleAddMedication = (medication: Medicine) => {
    onMedicineAdd(medication);
  };

  return (
    <div className="mb-6 border border-blue-200 rounded-lg p-4 bg-blue-50">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-medium text-blue-800 flex items-center">
            <Sparkles className="h-4 w-4 mr-2 text-blue-600" />
            AI-Powered Medication Suggestions
          </h3>
          <p className="text-sm text-blue-700">
            Let AI analyze symptoms and suggest appropriate medications
            {hasLearningData && (
              <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                Learning Mode Active
              </span>
            )}
          </p>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button 
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
          >
            <Lightbulb className="h-4 w-4 mr-2" />
            Suggest Medications from Symptoms
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] flex flex-col max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>AI Medication Suggestions</DialogTitle>
            <DialogDescription>
              Enter patient symptoms to get AI-generated medication suggestions.
              {hasLearningData && (
                <span className="block mt-1 text-xs text-green-600">
                  System is learning from previous prescriptions to improve recommendations.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="flex-grow px-1 py-2 overflow-y-auto">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="symptoms">Patient Symptoms</Label>
                <Textarea
                  id="symptoms"
                  placeholder="Describe the patient's symptoms in detail..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>
              
              <Button 
                onClick={handleGenerateSuggestions} 
                disabled={isLoading || !symptoms.trim() || !user?.uid}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Suggestions...
                  </>
                ) : (
                  'Generate Suggestions'
                )}
              </Button>
              
              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}
              
              {suggestions.length > 0 && (
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-medium mb-4">Suggested Medications:</h3>
                    <div className="space-y-4">
                      {suggestions.map((medication, index) => (
                        <div key={index} className="border rounded-md p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold">{medication.name}</h4>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => {
                                handleAddMedication(medication);
                                setOpen(false); // Close dialog after adding
                              }}
                              className="h-8 px-2"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add
                            </Button>
                          </div>
                          <div className="text-sm grid grid-cols-2 gap-2">
                            <div><span className="font-medium">Dosage:</span> {medication.dosage}</div>
                            <div><span className="font-medium">Frequency:</span> {medication.frequency}</div>
                            <div><span className="font-medium">Duration:</span> {medication.duration}</div>
                            <div className="col-span-2">
                              <span className="font-medium">Instructions:</span> {medication.instructions || 'None'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </ScrollArea>
          
          <DialogFooter className="pt-4 border-t mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AISymptomsSuggestion; 