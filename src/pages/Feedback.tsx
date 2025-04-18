import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/lib/auth/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { addFeedback } from '@/lib/firebase/feedbackService';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  ThumbsUp,
  MessageSquare,
  Send,
  Loader,
  BugIcon,
  Lightbulb,
  MessageCircle,
  Heart,
  Award
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Feedback = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    category: 'feature_request',
    feedback: ''
  });
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle category change via tabs
  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      category: value
    }));
  };
  
  // Get form submission button text based on category
  const getSubmitButtonText = () => {
    switch(formData.category) {
      case 'bug_report': 
        return 'Submit Bug Report';
      case 'feature_request': 
        return 'Submit Feature Request';
      case 'kudos': 
        return 'Send Kudos to the Team';
      default: 
        return 'Submit Feedback';
    }
  };
  
  // Get form submission button variant based on category
  const getButtonVariant = () => {
    switch(formData.category) {
      case 'bug_report': 
        return 'destructive';
      case 'kudos': 
        return 'outline';
      case 'feature_request': 
        return 'default';
      default: 
        return 'secondary';
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.feedback) {
      toast({
        title: 'Missing fields',
        description: 'Please fill out all required fields.',
        variant: 'destructive',
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Prepare data for submission
      const feedbackData = {
        ...formData,
        userId: user?.uid // Include user ID if logged in
      };
      
      // Submit to Firebase
      await addFeedback(feedbackData);
      
      // Get success message based on category
      let successTitle = 'Feedback submitted';
      switch(formData.category) {
        case 'bug_report':
          successTitle = 'Bug reported successfully';
          break;
        case 'feature_request':
          successTitle = 'Feature request submitted';
          break;
        case 'kudos':
          successTitle = 'Kudos sent to the team';
          break;
        default:
          successTitle = 'Feedback submitted successfully';
      }
      
      // Show success message
      toast({
        title: successTitle,
        description: 'Thank you for your feedback! We appreciate your input.',
      });
      
      // Reset form if successful
      setFormData({
        name: user?.displayName || '',
        email: user?.email || '',
        category: 'feature_request',
        feedback: ''
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit your feedback. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Help Improve PureCare</h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Share your feedback, report bugs, request features, or send kudos to our team.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Why Feedback is Important */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Help Us Improve</h2>
                  <p className="text-muted-foreground">
                    Your feedback is crucial in helping us enhance PureCare and deliver a better healthcare management experience.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="mr-4 p-2 bg-red-500/10 rounded-lg">
                        <BugIcon className="h-5 w-5 text-red-500" />
                      </div>
                      <div>
                        <h3 className="font-medium">Report Bugs</h3>
                        <p className="text-sm text-muted-foreground">
                          Found something that doesn't work? Let us know so we can fix it as quickly as possible.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="mr-4 p-2 bg-primary/10 rounded-lg">
                        <Lightbulb className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Request Features</h3>
                        <p className="text-sm text-muted-foreground">
                          Have an idea for a new feature? We'd love to hear it and consider it for our roadmap.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="mr-4 p-2 bg-purple-500/10 rounded-lg">
                        <MessageSquare className="h-5 w-5 text-purple-500" />
                      </div>
                      <div>
                        <h3 className="font-medium">General Feedback</h3>
                        <p className="text-sm text-muted-foreground">
                          Want to share your thoughts about our platform? We value all feedback to improve our service.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="mr-4 p-2 bg-green-500/10 rounded-lg">
                        <Award className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <h3 className="font-medium">Send Kudos</h3>
                        <p className="text-sm text-muted-foreground">
                          Happy with our service? Share what you love about PureCare and boost team morale.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Feedback Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>What would you like to do?</CardTitle>
                <CardDescription>
                  Please fill out the form below. All fields marked with * are required.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs 
                  defaultValue="feature_request" 
                  value={formData.category}
                  onValueChange={handleCategoryChange}
                  className="mb-6"
                >
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="feature_request" className="flex items-center gap-1 px-2 py-1.5 text-xs sm:text-sm sm:px-3">
                      <Lightbulb className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Feature</span>
                    </TabsTrigger>
                    <TabsTrigger value="bug_report" className="flex items-center gap-1 px-2 py-1.5 text-xs sm:text-sm sm:px-3">
                      <BugIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Bug</span>
                    </TabsTrigger>
                    <TabsTrigger value="general" className="flex items-center gap-1 px-2 py-1.5 text-xs sm:text-sm sm:px-3">
                      <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Feedback</span>
                    </TabsTrigger>
                    <TabsTrigger value="kudos" className="flex items-center gap-1 px-2 py-1.5 text-xs sm:text-sm sm:px-3">
                      <Award className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Kudos</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="feature_request">
                    <div className="p-4 bg-primary/5 rounded-lg mb-4">
                      <p className="text-sm text-muted-foreground">
                        Suggest a new feature or improvement for PureCare. Please be as specific as possible about what you'd like to see and how it would benefit your workflow.
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="bug_report">
                    <div className="p-4 bg-red-500/5 rounded-lg mb-4">
                      <p className="text-sm text-muted-foreground">
                        Report an issue you've encountered. Please include steps to reproduce the bug, what you expected to happen, and what actually happened.
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="general">
                    <div className="p-4 bg-purple-500/5 rounded-lg mb-4">
                      <p className="text-sm text-muted-foreground">
                        Share your general thoughts, impressions, or suggestions about PureCare. Any feedback is valuable to us!
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="kudos">
                    <div className="p-4 bg-green-500/5 rounded-lg mb-4">
                      <p className="text-sm text-muted-foreground">
                        Send appreciation to our team! Let us know what you love about PureCare and how it's helped your practice or workflow.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="feedback">
                        {formData.category === 'bug_report' 
                          ? 'Bug Description *' 
                          : formData.category === 'feature_request'
                            ? 'Feature Description *'
                            : formData.category === 'kudos'
                              ? 'Your Kudos *'
                              : 'Your Feedback *'
                        }
                      </Label>
                      <Textarea
                        id="feedback"
                        name="feedback"
                        placeholder={
                          formData.category === 'bug_report' 
                            ? "Please describe the bug, how to reproduce it, and what you expected to happen..." 
                            : formData.category === 'feature_request'
                              ? "Please describe your feature request in detail..."
                              : formData.category === 'kudos'
                                ? "Tell us what you appreciate about PureCare and how it's helped you..."
                                : "Please share your thoughts, impressions, or suggestions..."
                        }
                        value={formData.feedback}
                        onChange={handleChange}
                        rows={7}
                        required
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading}
                    variant={getButtonVariant()}
                  >
                    {loading ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        {getSubmitButtonText()}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Feedback; 