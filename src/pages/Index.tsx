import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  Stethoscope, 
  Calendar, 
  FileText, 
  Users, 
  DollarSign, 
  ShieldCheck, 
  BarChart4, 
  Clock, 
  Sparkles,
  Check
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  return (
    <MainLayout>
      {/* Hero Section - Clean, minimal with gradient */}
      <section className="relative overflow-hidden bg-background">
        {/* Background gradient element */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background z-0"></div>
        
        {/* Content */}
        <div className="container relative mx-auto px-4 py-6 md:py-10 z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 max-w-xl">
              <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm mb-4">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2"></span>
                <span className="text-xs font-medium">Healthcare simplified</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tighter">
                Modern healthcare management for modern clinics
              </h1>
              <p className="text-lg text-foreground/70">
                Streamline your practice with our comprehensive clinic management system designed for healthcare professionals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/signup">
                  <Button size="lg" className="group w-full sm:w-auto">
                    Get started free
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link to="/signin">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Sign in
                  </Button>
                </Link>
              </div>
              <div className="pt-4 text-sm text-foreground/60">
                <p>Completely free. No credit card required. Full access with no limitations.</p>
              </div>
            </div>
            
            <div className="hidden lg:block">
              <div className="relative">
                {/* Main dashboard preview image */}
                <div className="rounded-lg shadow-2xl overflow-hidden border border-border/50 bg-card">
                  <img 
                    src="/dashboard-preview.png" 
                    alt="PureCare Dashboard" 
                    className="w-full h-auto"
                    onError={(e) => {
                      // Fallback in case image doesn't exist
                      e.currentTarget.style.display = 'none';
                      document.getElementById('dashboard-placeholder')?.classList.remove('hidden');
                    }}
                  />
                  {/* Fallback illustration in case image doesn't exist */}
                  <div id="dashboard-placeholder" className="hidden w-full aspect-video bg-muted/30 flex items-center justify-center">
                    <div className="text-center p-8">
                      <Stethoscope className="h-16 w-16 mx-auto text-primary/50 mb-4" />
                      <h3 className="text-xl font-medium text-foreground/70">PureCare Dashboard</h3>
                      <p className="text-sm text-foreground/50 mt-2">Comprehensive healthcare management</p>
                    </div>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -bottom-4 -right-4 h-32 w-32 bg-primary/10 rounded-full blur-xl z-0"></div>
                <div className="absolute -top-4 -left-4 h-24 w-24 bg-primary/10 rounded-full blur-xl z-0"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Comprehensive Healthcare Suite</h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Everything you need to manage your healthcare practice in one integrated platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Patient Management",
                description: "Manage patient records, history, and demographics with ease",
                icon: Users,
                color: "bg-blue-50 text-blue-600",
              },
              {
                title: "Appointment Scheduling",
                description: "Easily schedule and manage patient appointments",
                icon: Calendar,
                color: "bg-indigo-50 text-indigo-600",
              },
              {
                title: "Medical Records",
                description: "Securely store and access patient medical records",
                icon: FileText,
                color: "bg-emerald-50 text-emerald-600",
              },
              {
                title: "Billing & Invoicing",
                description: "Generate invoices and track payments efficiently",
                icon: DollarSign,
                color: "bg-amber-50 text-amber-600",
              },
              {
                title: "Data Security",
                description: "HIPAA-compliant security for sensitive patient data",
                icon: ShieldCheck,
                color: "bg-red-50 text-red-600",
              },
              {
                title: "Analytics Dashboard",
                description: "Visualize practice performance with insightful analytics",
                icon: BarChart4,
                color: "bg-purple-50 text-purple-600",
              },
            ].map((feature, index) => (
              <Card 
                key={index}
                className="border-border/40 bg-background hover:shadow-md transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className={`h-12 w-12 rounded-full ${feature.color} flex items-center justify-center mb-4`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-foreground/70">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Showcase */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Streamlined Clinical Workflows</h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Discover how PureCare enhances your clinical processes
            </p>
          </div>

          <Tabs defaultValue="appointments" className="w-full">
            <TabsList className="grid grid-cols-4 max-w-2xl mx-auto mb-8">
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="patients">Patients</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
            
            <TabsContent value="appointments" className="mt-6">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold">Effortless Scheduling</h3>
                  <p className="text-foreground/70">
                    Streamline your appointment scheduling process with our intuitive calendar system. Reduce no-shows with automated reminders and easily manage your daily schedule.
                  </p>
                  <ul className="space-y-2">
                    {["Drag-and-drop calendar interface", "Automated patient reminders", "Online booking capabilities", "Recurring appointment scheduling"].map((item, i) => (
                      <li key={i} className="flex items-start">
                        <div className="mr-2 mt-1 h-5 w-5 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                          <Check className="h-3 w-3 text-primary" />
                        </div>
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-muted/30 rounded-lg p-6 h-80 flex items-center justify-center border border-border/50">
                  <div className="text-center">
                    <Calendar className="h-16 w-16 mx-auto text-primary/70 mb-4" />
                    <h4 className="text-lg font-medium">Appointment Calendar</h4>
                    <p className="text-sm text-foreground/50 mt-2">Visual representation of the calendar interface</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="patients" className="mt-6">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold">Comprehensive Patient Profiles</h3>
                  <p className="text-foreground/70">
                    Maintain complete patient profiles with medical history, demographics, and visit history all in one place for better continuity of care.
                  </p>
                  <ul className="space-y-2">
                    {["Complete medical history tracking", "Demographic information management", "Document and image attachments", "Secure patient portal access"].map((item, i) => (
                      <li key={i} className="flex items-start">
                        <div className="mr-2 mt-1 h-5 w-5 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                          <Check className="h-3 w-3 text-primary" />
                        </div>
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-muted/30 rounded-lg p-6 h-80 flex items-center justify-center border border-border/50">
                  <div className="text-center">
                    <Users className="h-16 w-16 mx-auto text-primary/70 mb-4" />
                    <h4 className="text-lg font-medium">Patient Management</h4>
                    <p className="text-sm text-foreground/50 mt-2">Visual representation of patient profiles</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="billing" className="mt-6">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold">Simplified Billing Process</h3>
                  <p className="text-foreground/70">
                    Generate invoices, process payments, and track outstanding balances efficiently to improve your practice's cash flow.
                  </p>
                  <ul className="space-y-2">
                    {["Custom invoice generation", "Multiple payment methods", "Automated payment reminders", "Financial reporting and analytics"].map((item, i) => (
                      <li key={i} className="flex items-start">
                        <div className="mr-2 mt-1 h-5 w-5 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                          <Check className="h-3 w-3 text-primary" />
                        </div>
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-muted/30 rounded-lg p-6 h-80 flex items-center justify-center border border-border/50">
                  <div className="text-center">
                    <DollarSign className="h-16 w-16 mx-auto text-primary/70 mb-4" />
                    <h4 className="text-lg font-medium">Financial Management</h4>
                    <p className="text-sm text-foreground/50 mt-2">Visual representation of billing interface</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reports" className="mt-6">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold">Insightful Analytics</h3>
                  <p className="text-foreground/70">
                    Make data-driven decisions with comprehensive reports and analytics on practice performance, patient metrics, and financial health.
                  </p>
                  <ul className="space-y-2">
                    {["Practice performance metrics", "Patient demographic analysis", "Revenue and growth trends", "Customizable reporting dashboards"].map((item, i) => (
                      <li key={i} className="flex items-start">
                        <div className="mr-2 mt-1 h-5 w-5 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                          <Check className="h-3 w-3 text-primary" />
                        </div>
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-muted/30 rounded-lg p-6 h-80 flex items-center justify-center border border-border/50">
                  <div className="text-center">
                    <BarChart4 className="h-16 w-16 mx-auto text-primary/70 mb-4" />
                    <h4 className="text-lg font-medium">Analytics Dashboard</h4>
                    <p className="text-sm text-foreground/50 mt-2">Visual representation of analytics interface</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Trusted by Healthcare Professionals</h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Hear what medical practices have to say about PureCare
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                quote: "PureCare has transformed how we manage patient appointments and records. The interface is intuitive, and it's saved our staff hours of administrative work.",
                author: "Dr. Sarah Johnson",
                role: "Family Physician",
                practice: "Johnson Family Practice"
              },
              {
                quote: "The billing and invoicing features have streamlined our financial processes. We've seen a 30% reduction in payment delays since implementing PureCare.",
                author: "Michael Chen",
                role: "Practice Manager",
                practice: "Westside Medical Group"
              },
              {
                quote: "As a small clinic, we needed a solution that was both affordable and comprehensive. PureCare delivers exactly what we need without overwhelming us.",
                author: "Dr. James Wilson",
                role: "Pediatrician",
                practice: "Children's Wellness Center"
              },
            ].map((testimonial, index) => (
              <Card key={index} className="border-border/40 bg-background">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Sparkles key={star} className="h-5 w-5 text-amber-400" />
                      ))}
                    </div>
                    <p className="italic text-foreground/80">"{testimonial.quote}"</p>
                    <div className="pt-4">
                      <p className="font-semibold">{testimonial.author}</p>
                      <p className="text-sm text-foreground/70">{testimonial.role}, {testimonial.practice}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/80 to-primary/40 p-8 md:p-12 text-white text-center max-w-5xl mx-auto shadow-lg">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to transform your practice?</h2>
              <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                Join thousands of healthcare providers who've streamlined their practice management with PureCare. Start today for free.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    Get started free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/demo">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20 w-full sm:w-auto">
                    Request a demo
                  </Button>
                </Link>
              </div>
              <p className="mt-6 text-sm opacity-80">
                Completely free. Full access with no limitations.
              </p>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute right-0 bottom-0 opacity-20">
              <Stethoscope className="h-64 w-64 -mr-8 -mb-8" />
            </div>
            <div className="absolute left-0 top-0 opacity-20">
              <Clock className="h-40 w-40 -ml-10 -mt-10" />
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
