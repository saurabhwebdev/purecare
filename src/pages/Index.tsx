import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  CheckCircle, 
  Sparkles, 
  Stethoscope, 
  Users, 
  Clock, 
  Calendar, 
  ClipboardList, 
  CreditCard, 
  HeartPulse,
  Laptop,
  MessageSquare,
  FileText,
  BarChart,
  Timer,
  ShieldCheck,
  TrendingUp,
  UserCog,
  Activity,
  Clipboard
} from 'lucide-react';
import { LeadForm } from '@/components/lead';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-background/95 border-b border-border/40">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-2/3 h-1/2 bg-primary/5 rounded-full blur-[100px] transform translate-x-1/4 -translate-y-1/4"></div>
          <div className="absolute bottom-0 left-0 w-2/3 h-1/2 bg-blue-500/5 rounded-full blur-[100px] transform -translate-x-1/4 translate-y-1/4"></div>
          <div className="absolute inset-0 bg-[url('/grid-pattern-dark.svg')] bg-repeat opacity-[0.03]"></div>
        </div>
        
        <div className="container relative z-10 px-4 py-20 mx-auto lg:py-32">
          <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Left Column - Content */}
            <div className="flex flex-col max-w-3xl">
              <Badge className="self-start mb-6 bg-primary/10 text-primary border-primary/30">
                Modern Healthcare Management
              </Badge>

              <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
                Streamline Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Healthcare Practice</span> with PureCare
              </h1>

              <p className="mb-8 text-lg text-muted-foreground md:text-xl">
                An all-in-one platform that helps healthcare professionals manage patients, 
                appointments, prescriptions, and billing—all in one secure, intuitive system.
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <Button size="lg" asChild>
                  <Link to="/features">
                    Explore Features <ArrowRight className="ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/pricing">View Pricing</Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-primary h-5 w-5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">HIPAA Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-primary h-5 w-5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">24/7 Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-primary h-5 w-5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Cloud-Based</span>
                </div>
              </div>
            </div>

            {/* Right Column - Form Card */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-blue-500/10 rounded-2xl blur-[40px] -z-10"></div>
              <div className="p-1 bg-gradient-to-tr from-primary/20 via-blue-500/20 to-purple-500/20 rounded-2xl">
                <div className="bg-card p-6 sm:p-8 rounded-xl border border-border shadow-lg">
                  <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold">Get Started Today</h3>
                  </div>
                  
                  <p className="mb-6 text-sm text-muted-foreground">
                    Request a personalized demo and see how PureCare can transform your practice.
                  </p>
                  
                  <LeadForm source="homepage-hero" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1440 74" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto text-background/95">
            <path d="M0 24.9999L60 29.9999C120 34.9999 240 44.9999 360 44.9999C480 44.9999 600 34.9999 720 25C840 14.9999 960 4.99992 1080 15C1200 24.9999 1320 54.9999 1380 69.9999L1440 74.9999V74.9999H1380C1320 74.9999 1200 74.9999 1080 74.9999C960 74.9999 840 74.9999 720 74.9999C600 74.9999 480 74.9999 360 74.9999C240 74.9999 120 74.9999 60 74.9999H0V24.9999Z" fill="currentColor"/>
          </svg>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-20 bg-background">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/30">
              Comprehensive Solution
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Everything You Need to Manage Your Practice
            </h2>
            <p className="text-lg text-muted-foreground">
              PureCare combines essential healthcare management tools in one intuitive platform, 
              designed specifically for medical professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/60 relative overflow-hidden group hover:shadow-md transition-all duration-300">
              <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-6 relative z-10">
                <div className="mb-5 p-3 rounded-lg inline-block bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Patient Management</h3>
                <p className="text-muted-foreground mb-5">
                  Store, access, and manage comprehensive patient records securely. Track patient history, 
                  medications, allergies, and demographic information.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-primary h-4 w-4 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Patient profiles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-primary h-4 w-4 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Medical history</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-primary h-4 w-4 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Document management</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/60 relative overflow-hidden group hover:shadow-md transition-all duration-300">
              <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-500/5 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-6 relative z-10">
                <div className="mb-5 p-3 rounded-lg inline-block bg-blue-500/10">
                  <Calendar className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Appointment Scheduling</h3>
                <p className="text-muted-foreground mb-5">
                  Easily manage appointments with a flexible scheduling system. Send automated reminders 
                  and reduce no-shows with integrated communication tools.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-primary h-4 w-4 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Calendar integration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-primary h-4 w-4 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Automated reminders</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-primary h-4 w-4 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Recurring appointments</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/60 relative overflow-hidden group hover:shadow-md transition-all duration-300">
              <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-amber-500/5 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-6 relative z-10">
                <div className="mb-5 p-3 rounded-lg inline-block bg-amber-500/10">
                  <ClipboardList className="h-6 w-6 text-amber-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Prescription Management</h3>
                <p className="text-muted-foreground mb-5">
                  Create, manage, and track prescriptions digitally. Built-in verification checks 
                  help prevent medication errors and adverse interactions.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-primary h-4 w-4 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Digital prescription</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-primary h-4 w-4 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Medication history</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-primary h-4 w-4 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Safety alerts</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/60 relative overflow-hidden group hover:shadow-md transition-all duration-300">
              <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-green-500/5 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-6 relative z-10">
                <div className="mb-5 p-3 rounded-lg inline-block bg-green-500/10">
                  <CreditCard className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Billing & Insurance</h3>
                <p className="text-muted-foreground mb-5">
                  Streamline billing processes with automated invoicing, insurance claim management, 
                  and payment tracking all in one place.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-primary h-4 w-4 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Automated invoicing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-primary h-4 w-4 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Insurance verification</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-primary h-4 w-4 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Payment tracking</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <Button asChild variant="outline" size="lg">
              <Link to="/features">
                View All Features <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gradient-to-b from-background to-background/95 border-y border-border/40 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-[120px]"></div>
          <div className="absolute inset-0 bg-[url('/grid-pattern-dark.svg')] bg-repeat opacity-[0.03]"></div>
        </div>

        <div className="container relative z-10 px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/30">
              Seamless Workflow
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              How PureCare Works
            </h2>
            <p className="text-lg text-muted-foreground">
              Our platform streamlines your entire healthcare workflow, from patient registration 
              to follow-up care, in four simple steps.
            </p>
          </div>

          <div className="relative">
            {/* Connected Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-blue-500/40 to-primary/10 transform -translate-x-1/2 hidden lg:block"></div>
            
            <div className="space-y-16 lg:space-y-32 relative">
              {/* Step 1 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="order-2 lg:order-1">
                  <div className="bg-card/50 border border-border/60 rounded-xl p-6 md:p-8 relative">
                    <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center text-white font-bold shadow-lg">1</div>
                    <h3 className="text-2xl font-semibold mb-4">Patient Registration & Scheduling</h3>
                    <p className="text-muted-foreground mb-6">
                      Register new patients and collect their information digitally. Schedule appointments with 
                      our intuitive calendar interface and send automated reminders to reduce no-shows.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2 bg-background/50 border border-border/40 rounded-full py-1 px-3">
                        <Users className="text-primary h-4 w-4" />
                        <span className="text-sm">Patient profiles</span>
                      </div>
                      <div className="flex items-center gap-2 bg-background/50 border border-border/40 rounded-full py-1 px-3">
                        <Calendar className="text-blue-500 h-4 w-4" />
                        <span className="text-sm">Easy scheduling</span>
                      </div>
                      <div className="flex items-center gap-2 bg-background/50 border border-border/40 rounded-full py-1 px-3">
                        <MessageSquare className="text-amber-500 h-4 w-4" />
                        <span className="text-sm">Automated reminders</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="order-1 lg:order-2 flex justify-center">
                  <div className="relative w-full max-w-sm">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-blue-500/20 rounded-2xl blur-[25px] -z-10"></div>
                    <div className="border border-border/60 bg-card/30 rounded-xl shadow-lg backdrop-blur-sm overflow-hidden">
                      <img 
                        src="/screenshots/patient-registration.png" 
                        alt="Patient Registration Interface" 
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="flex justify-center">
                  <div className="relative w-full max-w-sm">
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-2xl blur-[25px] -z-10"></div>
                    <div className="border border-border/60 bg-card/30 rounded-xl shadow-lg backdrop-blur-sm overflow-hidden">
                      <img 
                        src="/screenshots/appointment-management.png" 
                        alt="Appointment Management Interface" 
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="bg-card/50 border border-border/60 rounded-xl p-6 md:p-8 relative">
                    <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg">2</div>
                    <h3 className="text-2xl font-semibold mb-4">Consultation & Documentation</h3>
                    <p className="text-muted-foreground mb-6">
                      Record consultation notes, diagnoses, and treatment plans directly in the system. 
                      Access patient history and previous consultations for informed decision-making.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2 bg-background/50 border border-border/40 rounded-full py-1 px-3">
                        <FileText className="text-blue-500 h-4 w-4" />
                        <span className="text-sm">Digital notes</span>
                      </div>
                      <div className="flex items-center gap-2 bg-background/50 border border-border/40 rounded-full py-1 px-3">
                        <Stethoscope className="text-purple-500 h-4 w-4" />
                        <span className="text-sm">Treatment plans</span>
                      </div>
                      <div className="flex items-center gap-2 bg-background/50 border border-border/40 rounded-full py-1 px-3">
                        <Laptop className="text-green-500 h-4 w-4" />
                        <span className="text-sm">Instant access</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="order-2 lg:order-1">
                  <div className="bg-card/50 border border-border/60 rounded-xl p-6 md:p-8 relative">
                    <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-amber-500 flex items-center justify-center text-white font-bold shadow-lg">3</div>
                    <h3 className="text-2xl font-semibold mb-4">Prescriptions & Billing</h3>
                    <p className="text-muted-foreground mb-6">
                      Generate prescriptions and manage medications with built-in safety checks. 
                      Create invoices and process payments seamlessly within the platform.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2 bg-background/50 border border-border/40 rounded-full py-1 px-3">
                        <ClipboardList className="text-amber-500 h-4 w-4" />
                        <span className="text-sm">Digital prescriptions</span>
                      </div>
                      <div className="flex items-center gap-2 bg-background/50 border border-border/40 rounded-full py-1 px-3">
                        <CreditCard className="text-green-500 h-4 w-4" />
                        <span className="text-sm">Integrated billing</span>
                      </div>
                      <div className="flex items-center gap-2 bg-background/50 border border-border/40 rounded-full py-1 px-3">
                        <CheckCircle className="text-primary h-4 w-4" />
                        <span className="text-sm">Safety alerts</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="order-1 lg:order-2 flex justify-center">
                  <div className="relative w-full max-w-sm">
                    <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 to-green-500/20 rounded-2xl blur-[25px] -z-10"></div>
                    <div className="border border-border/60 bg-card/30 rounded-xl shadow-lg backdrop-blur-sm overflow-hidden">
                      <img 
                        src="/screenshots/prescription-billing.png" 
                        alt="Prescription and Billing Interface" 
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="flex justify-center">
                  <div className="relative w-full max-w-sm">
                    <div className="absolute inset-0 bg-gradient-to-tr from-green-500/20 to-primary/20 rounded-2xl blur-[25px] -z-10"></div>
                    <div className="border border-border/60 bg-card/30 rounded-xl shadow-lg backdrop-blur-sm overflow-hidden">
                      <img 
                        src="/screenshots/analytics-dashboard.webp" 
                        alt="Analytics Dashboard" 
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="bg-card/50 border border-border/60 rounded-xl p-6 md:p-8 relative">
                    <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-gradient-to-tr from-green-500 to-primary flex items-center justify-center text-white font-bold shadow-lg">4</div>
                    <h3 className="text-2xl font-semibold mb-4">Follow-up & Analytics</h3>
                    <p className="text-muted-foreground mb-6">
                      Schedule follow-up appointments and manage patient communication. Analyze practice 
                      performance with comprehensive reports and dashboards.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2 bg-background/50 border border-border/40 rounded-full py-1 px-3">
                        <BarChart className="text-primary h-4 w-4" />
                        <span className="text-sm">Practice analytics</span>
                      </div>
                      <div className="flex items-center gap-2 bg-background/50 border border-border/40 rounded-full py-1 px-3">
                        <MessageSquare className="text-blue-500 h-4 w-4" />
                        <span className="text-sm">Patient communication</span>
                      </div>
                      <div className="flex items-center gap-2 bg-background/50 border border-border/40 rounded-full py-1 px-3">
                        <Clock className="text-green-500 h-4 w-4" />
                        <span className="text-sm">Follow-up scheduling</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Button asChild size="lg">
              <Link to="/features">
                Get Started Today <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-background">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/30">
              Why Choose PureCare
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Benefits for Your Entire Practice
            </h2>
            <p className="text-lg text-muted-foreground">
              PureCare delivers tangible benefits for every member of your healthcare team, 
              improving efficiency, accuracy, and patient satisfaction.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* For Physicians */}
            <div className="space-y-8">
              <div className="text-center p-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center">
                  <Stethoscope className="text-white h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold">For Physicians</h3>
              </div>
              
              <div className="space-y-4">
                <div className="bg-card/50 backdrop-blur-sm rounded-xl p-5 border border-border/60">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Timer className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Save Time on Documentation</h4>
                      <p className="text-sm text-muted-foreground">
                        Spend less time on paperwork and more time with patients thanks to 
                        streamlined digital documentation and templates.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-card/50 backdrop-blur-sm rounded-xl p-5 border border-border/60">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <Activity className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Informed Clinical Decisions</h4>
                      <p className="text-sm text-muted-foreground">
                        Access complete patient history and medical records instantly to 
                        make better-informed clinical decisions.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-card/50 backdrop-blur-sm rounded-xl p-5 border border-border/60">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                      <ShieldCheck className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Reduce Medical Errors</h4>
                      <p className="text-sm text-muted-foreground">
                        Built-in safety features help prevent prescription errors and 
                        flag potential drug interactions automatically.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* For Administrative Staff */}
            <div className="space-y-8">
              <div className="text-center p-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center">
                  <UserCog className="text-white h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold">For Administrative Staff</h3>
              </div>
              
              <div className="space-y-4">
                <div className="bg-card/50 backdrop-blur-sm rounded-xl p-5 border border-border/60">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Simplified Scheduling</h4>
                      <p className="text-sm text-muted-foreground">
                        Manage appointments efficiently with drag-and-drop scheduling, automated 
                        reminders, and reduced no-shows.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-card/50 backdrop-blur-sm rounded-xl p-5 border border-border/60">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Streamlined Billing</h4>
                      <p className="text-sm text-muted-foreground">
                        Process insurance claims and patient payments more efficiently with 
                        automated billing workflows and payment tracking.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-card/50 backdrop-blur-sm rounded-xl p-5 border border-border/60">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Enhanced Communication</h4>
                      <p className="text-sm text-muted-foreground">
                        Communicate with patients efficiently through automated appointment 
                        reminders, follow-ups, and secure messaging.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* For Practice Managers */}
            <div className="space-y-8">
              <div className="text-center p-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-tr from-amber-500 to-green-500 flex items-center justify-center">
                  <Clipboard className="text-white h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold">For Practice Managers</h3>
              </div>
              
              <div className="space-y-4">
                <div className="bg-card/50 backdrop-blur-sm rounded-xl p-5 border border-border/60">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Business Intelligence</h4>
                      <p className="text-sm text-muted-foreground">
                        Gain insights into practice performance with comprehensive analytics 
                        dashboards and customizable reports.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-card/50 backdrop-blur-sm rounded-xl p-5 border border-border/60">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Staff Productivity</h4>
                      <p className="text-sm text-muted-foreground">
                        Monitor workloads, track performance metrics, and identify optimization 
                        opportunities to improve staff efficiency.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-card/50 backdrop-blur-sm rounded-xl p-5 border border-border/60">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                      <ShieldCheck className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Compliance & Security</h4>
                      <p className="text-sm text-muted-foreground">
                        Ensure HIPAA compliance and data security with built-in safeguards, 
                        audit trails, and automatic backups.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Benefits Statistics Row */}
          <div className="mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 text-center border border-border/60">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Timer className="h-6 w-6 text-primary" />
              </div>
              <div className="text-3xl font-bold mb-2">30%</div>
              <p className="text-sm text-muted-foreground">Reduction in administrative workload</p>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 text-center border border-border/60">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-500" />
              </div>
              <div className="text-3xl font-bold mb-2">40%</div>
              <p className="text-sm text-muted-foreground">Decrease in patient wait times</p>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 text-center border border-border/60">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-amber-500/10 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-amber-500" />
              </div>
              <div className="text-3xl font-bold mb-2">25%</div>
              <p className="text-sm text-muted-foreground">Fewer missed appointments</p>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 text-center border border-border/60">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
              <div className="text-3xl font-bold mb-2">20%</div>
              <p className="text-sm text-muted-foreground">Increase in practice revenue</p>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <Button asChild size="lg">
              <Link to="/contact">
                Schedule a Demo <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-b from-background to-background/95 border-y border-border/40 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute bottom-1/3 right-1/3 w-1/2 h-1/2 bg-blue-500/5 rounded-full blur-[120px]"></div>
          <div className="absolute inset-0 bg-[url('/grid-pattern-dark.svg')] bg-repeat opacity-[0.03]"></div>
        </div>

        <div className="container relative z-10 px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/30">
              Success Stories
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Trusted by Healthcare Professionals
            </h2>
            <p className="text-lg text-muted-foreground">
              See how PureCare has transformed healthcare practices across the country.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/60 relative">
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full blur-[40px]"></div>
              
              <div className="flex flex-col h-full">
                <div className="mb-6">
                  <div className="flex text-amber-400 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  
                  <blockquote className="text-muted-foreground italic mb-6">
                    "PureCare has completely transformed our practice. We've reduced administrative time by 35% and our patients love the streamlined experience. The integrated billing system has simplified our financial operations tremendously."
                  </blockquote>
                </div>
                
                <div className="mt-auto flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Dr. Rebecca Chen</p>
                    <p className="text-sm text-muted-foreground">Primary Care Physician</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/60 relative">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-full blur-[40px]"></div>
              
              <div className="flex flex-col h-full">
                <div className="mb-6">
                  <div className="flex text-amber-400 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  
                  <blockquote className="text-muted-foreground italic mb-6">
                    "The prescription management system has been a game-changer for our specialty practice. The safety alerts have prevented potential medication errors, and our patients appreciate the seamless prescription delivery experience."
                  </blockquote>
                </div>
                
                <div className="mt-auto flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium">Dr. Marcus Johnson</p>
                    <p className="text-sm text-muted-foreground">Cardiologist</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/60 relative">
              <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/5 rounded-full blur-[40px]"></div>
              
              <div className="flex flex-col h-full">
                <div className="mb-6">
                  <div className="flex text-amber-400 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  
                  <blockquote className="text-muted-foreground italic mb-6">
                    "As a practice manager, the analytics dashboard has given us unprecedented insights into our operations. We've been able to optimize staffing, improve patient flow, and increase our overall efficiency by 30%."
                  </blockquote>
                </div>
                
                <div className="mt-auto flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-amber-500" />
                  </div>
                  <div>
                    <p className="font-medium">Sarah Thompson</p>
                    <p className="text-sm text-muted-foreground">Practice Manager</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Button asChild variant="outline" size="lg" className="group">
              <Link to="/about">
                Read More Success Stories 
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-24 bg-background">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/30">
              Platform Overview
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Built for Modern Healthcare Practices
            </h2>
            <p className="text-lg text-muted-foreground">
              Explore the intuitive interface designed specifically for healthcare professionals.
            </p>
          </div>
          
          <div className="relative mb-16">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-blue-500/20 rounded-2xl blur-[30px] -z-10 opacity-70"></div>
            <div className="border border-border/60 rounded-xl overflow-hidden backdrop-blur-sm shadow-xl">
              <img 
                src="/screenshots/main-dashboard.webp" 
                alt="PureCare Dashboard" 
                className="w-full h-auto"
              />
            </div>
            <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 bg-card border border-border rounded-full py-2 px-6 shadow-lg">
              <p className="text-sm font-medium">Main Practice Dashboard</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-card/50 border border-border/60 rounded-xl overflow-hidden group hover:shadow-md transition-all duration-300">
              <div className="relative">
                <img 
                  src="/screenshots/patient-management.webp" 
                  alt="Patient Management" 
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-4">
                    <p className="text-white font-medium">Patient Management</p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-muted-foreground">
                  Comprehensive patient profiles with medical history, appointments, and documents.
                </p>
              </div>
            </div>
            
            <div className="bg-card/50 border border-border/60 rounded-xl overflow-hidden group hover:shadow-md transition-all duration-300">
              <div className="relative">
                <img 
                  src="/screenshots/scheduling.webp" 
                  alt="Appointment Scheduling" 
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-4">
                    <p className="text-white font-medium">Appointment Scheduling</p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-muted-foreground">
                  Intuitive calendar interface with drag-and-drop functionality and automated reminders.
                </p>
              </div>
            </div>
            
            <div className="bg-card/50 border border-border/60 rounded-xl overflow-hidden group hover:shadow-md transition-all duration-300">
              <div className="relative">
                <img 
                  src="/screenshots/billing.webp" 
                  alt="Billing & Invoicing" 
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-4">
                    <p className="text-white font-medium">Billing & Invoicing</p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-muted-foreground">
                  Streamlined billing workflow with insurance verification and payment tracking.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Button asChild size="lg">
              <Link to="/features">
                View All Features <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Plans Section */}
      <section className="py-24 bg-gradient-to-b from-background to-background/95 border-y border-border/40 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-1/3 left-1/3 w-1/2 h-1/2 bg-primary/5 rounded-full blur-[120px]"></div>
          <div className="absolute inset-0 bg-[url('/grid-pattern-dark.svg')] bg-repeat opacity-[0.03]"></div>
        </div>

        <div className="container relative z-10 px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/30">
              Pricing
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-muted-foreground">
              Two straightforward options designed to help transform your healthcare practice.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Cloud Edition Card */}
            <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/60 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold">Cloud Edition</h3>
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-400/30">
                    Free
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4">Online Access</p>
                <div>
                  <span className="text-3xl font-bold">Free</span>
                  <span className="text-muted-foreground ml-2">Lifetime free access</span>
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-muted-foreground mb-6">
                  Complete online access to the PureCare platform with all essential features for your practice.
                </p>
                
                <ul className="space-y-4 mb-6">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5 mr-3" />
                    <span className="text-sm">Appointment scheduling</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5 mr-3" />
                    <span className="text-sm">Patient management</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5 mr-3" />
                    <span className="text-sm">Medical records</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5 mr-3" />
                    <span className="text-sm">Prescription management</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5 mr-3" />
                    <span className="text-sm">Invoicing system</span>
                  </li>
                </ul>
              </div>
              
              <div className="p-6 pt-0">
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                  <Link to="/signup">Get Started Now</Link>
                </Button>
              </div>
            </div>
            
            {/* Local Edition Card */}
            <div className="relative bg-card/50 backdrop-blur-sm rounded-xl border-2 border-primary/50 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold">Local Edition</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">Full local installation</p>
                <div>
                  <span className="text-3xl font-bold">₹300</span>
                  <span className="text-muted-foreground ml-2">per month</span>
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-muted-foreground mb-6">
                  Complete control with local installation for enhanced security, offline capabilities, and full customization.
                </p>
                
                <p className="text-sm font-medium mb-2">Everything in Cloud, plus:</p>
                <ul className="space-y-4 mb-6">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5 mr-3" />
                    <span className="text-sm font-medium">Local installation & hosting</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5 mr-3" />
                    <span className="text-sm font-medium">Complete data ownership</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5 mr-3" />
                    <span className="text-sm font-medium">Enhanced security controls</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5 mr-3" />
                    <span className="text-sm font-medium">Offline capabilities</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5 mr-3" />
                    <span className="text-sm font-medium">Premium support</span>
                  </li>
                </ul>
              </div>
              
              <div className="p-6 pt-0">
                <Button asChild className="w-full">
                  <Link to="/contact">Contact Sales</Link>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <p className="text-muted-foreground mb-6">
              Not sure which plan is right for you? Reach out to discuss your practice's specific needs.
            </p>
            <Button asChild variant="outline" size="lg">
              <Link to="/pricing">
                View Full Pricing Details <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-background">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/30">
              FAQ
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Find answers to common questions about PureCare.
            </p>
          </div>

          <div className="max-w-3xl mx-auto divide-y divide-border">
            <div className="py-6">
              <details className="group">
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                  <span className="text-lg">How secure is PureCare for storing patient data?</span>
                  <span className="transition group-open:rotate-180">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </span>
                </summary>
                <div className="text-muted-foreground mt-4 group-open:animate-fadeIn">
                  <p>
                    PureCare takes data security extremely seriously. We're fully HIPAA compliant and use industry-leading encryption standards to protect all patient information. Our platform includes role-based access controls, audit logs, and automatic backups to ensure your data is always secure and available only to authorized personnel.
                  </p>
                </div>
              </details>
            </div>
            
            <div className="py-6">
              <details className="group">
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                  <span className="text-lg">Can PureCare integrate with my existing systems?</span>
                  <span className="transition group-open:rotate-180">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </span>
                </summary>
                <div className="text-muted-foreground mt-4 group-open:animate-fadeIn">
                  <p>
                    Yes, PureCare is designed to integrate with many common healthcare systems and tools. We offer standard integrations with laboratory systems, pharmacy networks, insurance providers, and popular billing solutions. For Enterprise clients, we also offer custom integrations to connect with your specific systems and workflows.
                  </p>
                </div>
              </details>
            </div>
            
            <div className="py-6">
              <details className="group">
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                  <span className="text-lg">How long does implementation take?</span>
                  <span className="transition group-open:rotate-180">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </span>
                </summary>
                <div className="text-muted-foreground mt-4 group-open:animate-fadeIn">
                  <p>
                    Most practices are up and running with PureCare in 2-4 weeks. Our implementation process includes data migration, system configuration, and comprehensive training for your staff. We assign a dedicated implementation specialist to guide you through the entire process and ensure a smooth transition from your current systems.
                  </p>
                </div>
              </details>
            </div>
            
            <div className="py-6">
              <details className="group">
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                  <span className="text-lg">What training and support do you provide?</span>
                  <span className="transition group-open:rotate-180">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </span>
                </summary>
                <div className="text-muted-foreground mt-4 group-open:animate-fadeIn">
                  <p>
                    All plans include comprehensive training sessions for your staff, as well as access to our knowledge base, video tutorials, and regular webinars. Support options vary by plan: Standard includes email support, Professional adds priority support with faster response times, and Enterprise includes 24/7 premium support with a dedicated account manager.
                  </p>
                </div>
              </details>
            </div>
            
            <div className="py-6">
              <details className="group">
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                  <span className="text-lg">Can I switch plans as my practice grows?</span>
                  <span className="transition group-open:rotate-180">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </span>
                </summary>
                <div className="text-muted-foreground mt-4 group-open:animate-fadeIn">
                  <p>
                    Absolutely! PureCare is designed to grow with your practice. You can upgrade your plan at any time, and the changes will be prorated for the remainder of your billing cycle. If you're on an annual plan and need to upgrade mid-year, we'll simply adjust your billing to reflect the new plan rate for the remaining months.
                  </p>
                </div>
              </details>
            </div>
            
            <div className="py-6">
              <details className="group">
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                  <span className="text-lg">Is there a limit to the number of patients we can manage?</span>
                  <span className="transition group-open:rotate-180">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </span>
                </summary>
                <div className="text-muted-foreground mt-4 group-open:animate-fadeIn">
                  <p>
                    No, there's no limit to the number of patient records you can create and manage in PureCare. All plans include unlimited patient records. Our pricing is based on the number of providers in your practice and the feature set you need, not on the size of your patient database.
                  </p>
                </div>
              </details>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-6">
              Have more questions? We're here to help.
            </p>
            <Button asChild variant="outline" size="lg">
              <Link to="/contact">
                Contact Support <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-b from-background to-background/95 border-t border-border/40 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid-pattern-dark.svg')] bg-repeat opacity-[0.03]"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tr from-primary/5 via-blue-500/5 to-purple-500/5 rounded-full blur-[100px] transform translate-x-1/3 translate-y-1/3"></div>
        </div>

        <div className="container relative z-10 px-4 mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/60 p-8 md:p-12 text-center relative overflow-hidden shadow-lg">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-blue-500 to-purple-500"></div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Transform Your Healthcare Practice?
              </h2>
              
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                Join thousands of healthcare professionals who have streamlined their practice 
                management with PureCare.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                <Button asChild size="lg" className="text-md">
                  <Link to="/signup">
                    Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                
                <Button asChild size="lg" variant="outline" className="text-md">
                  <Link to="/contact">
                    Schedule a Demo
                  </Link>
                </Button>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p>No credit card required. 14-day free trial. Cancel anytime.</p>
              </div>
            </div>
            
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium mb-2">HIPAA Compliant</h3>
                <p className="text-sm text-muted-foreground">Secure, encrypted, and fully compliant with healthcare regulations.</p>
              </div>
              
              <div>
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="font-medium mb-2">Quick Setup</h3>
                <p className="text-sm text-muted-foreground">Be up and running in as little as 2 weeks with our guided implementation.</p>
              </div>
              
              <div>
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-500" />
                </div>
                <h3 className="font-medium mb-2">Dedicated Support</h3>
                <p className="text-sm text-muted-foreground">Our team of experts is always available to help you succeed.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
