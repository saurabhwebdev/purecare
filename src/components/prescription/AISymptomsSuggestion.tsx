import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Lightbulb, Plus, Sparkles, Share2, Gift, UserPlus } from "lucide-react";
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
import { 
  canUseAISuggestion, 
  recordAIUsage,
  getUserReferralInfo,
  FREE_MONTHLY_SUGGESTIONS, 
  REFERRAL_REWARD,
  getUserUsage
} from '@/lib/firebase/referralService';
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
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
import { useToast } from "@/components/ui/use-toast";

interface AISymptomsSuggestionProps {
  onMedicineAdd: (medicine: Medicine) => void;
}

export function AISymptomsSuggestion({ onMedicineAdd }: AISymptomsSuggestionProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [symptoms, setSymptoms] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Medicine[]>([]);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [hasLearningData, setHasLearningData] = useState(false);
  const [usedSuggestions, setUsedSuggestions] = useState(0);
  const [remainingUsage, setRemainingUsage] = useState(0);
  const [canUseAI, setCanUseAI] = useState(true);
  const [totalAllowedSuggestions, setTotalAllowedSuggestions] = useState(FREE_MONTHLY_SUGGESTIONS);
  const [referralInfo, setReferralInfo] = useState({
    referralCode: '',
    referralLink: '',
    referralCount: 0,
  });
  const [wasReferred, setWasReferred] = useState(false);
  const [referralBonus, setReferralBonus] = useState(0);
  const [showReferralDialog, setShowReferralDialog] = useState<boolean>(false);
  const [loadingReferralData, setLoadingReferralData] = useState(false);

  // Calculate progress percentage for the usage bar
  const progressPercentage = usedSuggestions > 0 
    ? Math.min((usedSuggestions / totalAllowedSuggestions) * 100, 100)
    : 0;

  // Load initial data when component mounts
  useEffect(() => {
    if (user) {
      loadInitialData();
    }
  }, [user]);

  // Load initial data about AI usage and learning data
  const loadInitialData = async () => {
    if (!user?.uid) return;
    
    try {
      // Check if user can use AI suggestions
      const { canUse, remainingCount } = await canUseAISuggestion(user.uid);
      setCanUseAI(canUse);
      setRemainingUsage(remainingCount);
      
      // Check if there is learning data
      const hasData = await checkDoctorHasLearningData(user.uid);
      setHasLearningData(hasData);
      
      // Get referral info
      const data = await getUserReferralInfo(user.uid);
      setReferralInfo({
        referralCode: data.referralCode,
        referralLink: data.referralLink,
        referralCount: data.referralCount,
      });
      
      // Get user usage to calculate used suggestions
      const usage = await getUserUsage(user.uid);
      setUsedSuggestions(usage.monthlyUsageCount);
      
      // Check if user was referred by someone and has a bonus
      setWasReferred(!!usage.referredBy);
      setReferralBonus(usage.referralBonus || (usage.referredBy ? REFERRAL_REWARD : 0));
      
      // Calculate total allowed suggestions
      const totalAllowed = FREE_MONTHLY_SUGGESTIONS + 
        (data.referralCount * REFERRAL_REWARD) + 
        (usage.referralBonus || (usage.referredBy ? REFERRAL_REWARD : 0));
      setTotalAllowedSuggestions(totalAllowed);
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  // Refresh usage data (called after generating suggestions)
  const refreshUsageData = async () => {
    if (!user?.uid) return;
    
    try {
      // Check if user can use AI suggestions
      const { canUse, remainingCount } = await canUseAISuggestion(user.uid);
      setCanUseAI(canUse);
      setRemainingUsage(remainingCount);
      
      // Get user usage to calculate used suggestions
      const usage = await getUserUsage(user.uid);
      setUsedSuggestions(usage.monthlyUsageCount);
    } catch (error) {
      console.error('Error refreshing usage data:', error);
    }
  };

  const handleGenerateSuggestions = async () => {
    if (!symptoms.trim()) {
      setError("Please enter symptoms first");
      return;
    }

    if (!user?.uid) {
      setError("Must be logged in to use AI suggestions");
      return;
    }
    
    // Check if user can use AI suggestions
    const { canUse, remainingCount } = await canUseAISuggestion(user.uid);
    if (!canUse) {
      setError("You've reached your monthly limit for AI suggestions. Share your referral link to get more!");
      setShowReferralDialog(true);
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
        // Record usage - in a separate try-catch to prevent usage recording errors
        // from affecting the display of suggestions
        try {
          await recordAIUsage(user.uid);
          
          // Update remaining count and refresh usage data
          // This ensures the progress bar and counts are updated correctly
          const updatedUsage = await canUseAISuggestion(user.uid);
          setRemainingUsage(updatedUsage.remainingCount);
          setCanUseAI(updatedUsage.canUse);
        } catch (usageError) {
          // Log the error but don't display it to the user
          console.error("Error recording usage (non-critical):", usageError);
          // We still show the suggestions even if recording usage fails
        }
        
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
  
  const handleOpenReferralDialog = async () => {
    if (!user?.uid) return;
    
    setLoadingReferralData(true);
    try {
      // Get the latest referral info
      const data = await getUserReferralInfo(user.uid);
      setReferralInfo({
        referralCode: data.referralCode,
        referralLink: data.referralLink,
        referralCount: data.referralCount,
      });
      
      // Also refresh the usage data
      const { canUse, remainingCount } = await canUseAISuggestion(user.uid);
      setCanUseAI(canUse);
      setRemainingUsage(remainingCount);
      
      setShowReferralDialog(true);
    } catch (error) {
      console.error("Error fetching referral info:", error);
    } finally {
      setLoadingReferralData(false);
    }
  };
  
  const handleCopyReferralLink = () => {
    navigator.clipboard.writeText(referralInfo.referralLink)
      .then(() => {
        toast({
          title: "Copied!",
          description: "Referral link copied to clipboard.",
        });
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast({
          title: "Failed to copy",
          description: "Please try again or copy manually.",
          variant: "destructive",
        });
      });
  };

  return (
    <div className="mb-6 border border-blue-200 rounded-lg p-4 bg-blue-50">
      <div className="flex flex-col space-y-3 mb-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-blue-800 flex items-center">
            <Sparkles className="h-4 w-4 mr-2 text-blue-600" />
            AI-Powered Medication Suggestions
          </h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-blue-700 hover:text-blue-900 hover:bg-blue-100"
            onClick={handleOpenReferralDialog}
            disabled={loadingReferralData}
          >
            <Share2 className="h-4 w-4 mr-1" />
            Refer & Get More
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-sm text-blue-700">
            Let AI analyze symptoms and suggest appropriate medications
            {hasLearningData && (
              <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                Learning Mode Active
              </span>
            )}
          </p>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-blue-700">
            <span>Monthly AI Usage</span>
            <span>{usedSuggestions} used / {totalAllowedSuggestions} total</span>
          </div>
          
          {/* Custom dual-colored progress bar */}
          <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden border border-gray-200">
            <div className="flex h-full w-full">
              {/* Used part - orange */}
              {progressPercentage > 0 && (
                <div 
                  className="h-full bg-amber-500 transition-all duration-300 ease-in-out" 
                  style={{ width: `${progressPercentage}%` }}
                />
              )}
              {/* Remaining part - green */}
              {progressPercentage < 100 && (
                <div 
                  className="h-full bg-green-500 transition-all duration-300 ease-in-out" 
                  style={{ width: `${100 - progressPercentage}%` }}
                />
              )}
            </div>
          </div>
          
          {/* Legends */}
          <div className="flex justify-between text-xs mt-1.5">
            <div className="flex items-center">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500 mr-1.5"></div>
              <span className="text-amber-700 font-medium">Used: {usedSuggestions}</span>
            </div>
            <div className="flex items-center">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 mr-1.5"></div>
              <span className="text-green-700 font-medium">Remaining: {remainingUsage}</span>
            </div>
          </div>
          
          {referralInfo.referralCount > 0 && (
            <p className="text-xs text-blue-600 mt-2 flex items-center">
              <Gift className="h-3 w-3 mr-1 text-blue-500" />
              Including {referralInfo.referralCount * REFERRAL_REWARD} bonus from your referrals
            </p>
          )}
          
          {wasReferred && (
            <p className="text-xs text-green-600 mt-1 flex items-center">
              <UserPlus className="h-3 w-3 mr-1 text-green-500" />
              Including {referralBonus} bonus for being referred
            </p>
          )}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button 
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            disabled={!canUseAI && remainingUsage <= 0}
          >
            <Lightbulb className="h-4 w-4 mr-2" />
            Suggest Medications from Symptoms
            {!canUseAI && remainingUsage <= 0 && <Share2 className="h-4 w-4 ml-2" />}
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
                disabled={isLoading || !symptoms.trim() || !user?.uid || !canUseAI}
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
      
      {/* Referral Dialog */}
      <AlertDialog open={showReferralDialog} onOpenChange={setShowReferralDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Get More AI Suggestions</AlertDialogTitle>
            <AlertDialogDescription>
              You get {FREE_MONTHLY_SUGGESTIONS} free AI suggestions per month. Share your referral link with colleagues to get {REFERRAL_REWARD} more for each successful referral!
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg my-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <Gift className="h-5 w-5 text-blue-600 mr-2" />
                <h4 className="font-medium text-blue-800">Your Referral Rewards</h4>
              </div>
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {referralInfo.referralCount} referrals
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-blue-700">
                <span>Base Monthly Allowance</span>
                <span>{FREE_MONTHLY_SUGGESTIONS} suggestions</span>
              </div>
              <div className="flex justify-between text-xs text-blue-700">
                <span>Referral Bonus</span>
                <span>+{referralInfo.referralCount * REFERRAL_REWARD} suggestions</span>
              </div>
              {wasReferred && (
                <div className="flex justify-between text-xs text-blue-700">
                  <span className="flex items-center">
                    <UserPlus className="h-2.5 w-2.5 mr-1 text-green-600" />
                    Referred User Bonus
                  </span>
                  <span>+{referralBonus} suggestions</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-medium text-blue-900 border-t border-blue-200 pt-2 mt-2">
                <span>Total Monthly Allowance</span>
                <span>{FREE_MONTHLY_SUGGESTIONS + (referralInfo.referralCount * REFERRAL_REWARD) + referralBonus} suggestions</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="referral-link">Your Referral Link</Label>
            <div className="flex items-center space-x-2">
              <Input id="referral-link" value={referralInfo.referralLink} readOnly className="bg-muted text-sm" />
              <Button onClick={handleCopyReferralLink} className="shrink-0">Copy</Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Share this link with colleagues. When they sign up, you'll both get more AI suggestions!
            </p>
          </div>
          
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default AISymptomsSuggestion; 