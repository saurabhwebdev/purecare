import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Calendar, 
  FileText, 
  DollarSign, 
  Package, 
  Shield, 
  Clock, 
  Star, 
  Cpu, 
  Zap,
  Smartphone,
  Lock,
  BarChart2,
  Layers,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LeadForm from '@/components/lead/LeadForm';

const Features = () => {
  const features = [
    {
      title: "Patient Management",
      description: "Efficiently manage patient information, history, and interactions all in one place.",
      icon: <Users className="w-10 h-10 text-blue-400" />,
      category: "core",
      items: [
        "Comprehensive patient profiles",
        "Search and filter capabilities",
        "Custom fields and categories",
        "Patient history tracking",
        "Family relationships mapping"
      ]
    },
    {
      title: "Appointment Scheduling",
      description: "Smart scheduling system that optimizes your practice's time and resources.",
      icon: <Calendar className="w-10 h-10 text-indigo-400" />,
      category: "core",
      items: [
        "Visual calendar interface",
        "Automated reminders",
        "Recurring appointment setup",
        "Multiple provider scheduling",
        "Online booking integration"
      ]
    },
    {
      title: "Medical Records",
      description: "Digital documentation that ensures all patient information is securely organized.",
      icon: <FileText className="w-10 h-10 text-emerald-400" />,
      category: "core",
      items: [
        "Structured clinical notes",
        "Diagnostic codes integration",
        "Lab results management",
        "Document scanning and storage",
        "Quick template-based entries"
      ]
    },
    {
      title: "Prescription Management",
      description: "Write, track, and manage prescriptions with integrated safety features.",
      icon: <FileText className="w-10 h-10 text-purple-400" />,
      category: "clinical",
      items: [
        "E-prescription capabilities",
        "Drug interaction warnings",
        "Medication history tracking",
        "Common prescription templates",
        "Refill management"
      ]
    },
    {
      title: "Invoicing & Billing",
      description: "Streamline your financial operations with integrated billing solutions.",
      icon: <DollarSign className="w-10 h-10 text-amber-400" />,
      category: "business",
      items: [
        "Automated invoice generation",
        "Payment tracking",
        "Insurance claim management",
        "Multiple payment methods",
        "Financial reports"
      ]
    },
    {
      title: "Inventory Management",
      description: "Track medical supplies and medications with real-time inventory control.",
      icon: <Package className="w-10 h-10 text-rose-400" />,
      category: "business",
      items: [
        "Stock level monitoring",
        "Reorder automation",
        "Expiration date tracking",
        "Usage analytics",
        "Supplier management"
      ]
    },
    {
      title: "Advanced Security",
      description: "Enterprise-grade security that meets the highest standards for medical data.",
      icon: <Shield className="w-10 h-10 text-blue-400" />,
      category: "tech",
      items: [
        "End-to-end encryption",
        "Role-based access control",
        "Audit logging",
        "HIPAA compliance features",
        "Two-factor authentication"
      ]
    },
    {
      title: "AI-Powered Insights",
      description: "Harness the power of artificial intelligence to improve clinical decisions.",
      icon: <Cpu className="w-10 h-10 text-indigo-400" />,
      category: "tech",
      items: [
        "Diagnostic assistance",
        "Treatment recommendations",
        "Pattern recognition",
        "Predictive analytics",
        "Research integration"
      ]
    },
    {
      title: "Performance Analytics",
      description: "Gain valuable insights into your practice with comprehensive analytics.",
      icon: <BarChart2 className="w-10 h-10 text-emerald-400" />,
      category: "business",
      items: [
        "Practice performance metrics",
        "Patient flow analysis",
        "Revenue cycle monitoring",
        "Practitioner efficiency tracking",
        "Custom reporting"
      ]
    },
    {
      title: "Mobile Access",
      description: "Access your practice management system anywhere, anytime.",
      icon: <Smartphone className="w-10 h-10 text-purple-400" />,
      category: "tech",
      items: [
        "Responsive design",
        "Native mobile applications",
        "Offline capabilities",
        "Secure remote access",
        "Push notifications"
      ]
    },
    {
      title: "Integration Ecosystem",
      description: "Connect seamlessly with other healthcare systems and services.",
      icon: <Layers className="w-10 h-10 text-amber-400" />,
      category: "tech",
      items: [
        "HL7 integration",
        "Lab system connections",
        "Pharmacy networks",
        "Insurance verification",
        "API for custom integrations"
      ]
    },
    {
      title: "Real-Time Collaboration",
      description: "Enable team-based care with powerful collaboration tools.",
      icon: <Zap className="w-10 h-10 text-rose-400" />,
      category: "clinical",
      items: [
        "Secure messaging",
        "Task assignment",
        "Shared calendars",
        "Clinical discussions",
        "Handoff documentation"
      ]
    }
  ];

  return (
    <MainLayout>
      {/* Hero section with gradient */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
        {/* Decorative shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[60%] rounded-full bg-primary/20 blur-[120px]"></div>
          <div className="absolute bottom-[-5%] left-[-10%] w-[50%] h-[60%] rounded-full bg-blue-600/20 blur-[100px]"></div>
        </div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('/grid-pattern-dark.svg')] bg-repeat opacity-[0.03]"></div>
        
        <div className="container relative z-10 px-4 mx-auto">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <Badge className="inline-flex mb-6 text-sm font-medium bg-primary/20 text-primary border-primary/30">
                Comprehensive Healthcare Platform
              </Badge>
              
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Powerful features for <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">modern healthcare</span>
              </h1>
              
              <p className="max-w-2xl mx-auto mb-10 text-xl text-gray-400">
                All the tools you need to run an efficient, patient-centered medical practice in one integrated platform
              </p>
            </div>
            
            {/* Content */}
            <div className="relative bg-gray-900/40 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-blue-600/5"></div>
              
              <div className="relative grid md:grid-cols-2 gap-0">
                {/* Left column - Feature highlights */}
                <div className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-gray-800">
                  <h2 className="text-2xl font-bold text-white mb-6">Why choose PureCare?</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 p-2 rounded-lg bg-blue-500/10 mr-4">
                        <Shield className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-white mb-1">HIPAA Compliant</h3>
                        <p className="text-gray-400">Enterprise-grade security that meets the highest standards for medical data</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10 mr-4">
                        <Calendar className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-white mb-1">Efficient Workflows</h3>
                        <p className="text-gray-400">Streamlined processes that save your practice time and resources</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 p-2 rounded-lg bg-amber-500/10 mr-4">
                        <Cpu className="w-6 h-6 text-amber-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-white mb-1">AI-Powered Insights</h3>
                        <p className="text-gray-400">Intelligent analytics to help you make data-driven decisions</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Right column - Lead form */}
                <div className="p-8 md:p-12 bg-gray-900/70">
                  <h2 className="text-2xl font-bold text-white mb-6">See it in action</h2>
                  <p className="text-gray-400 mb-6">Fill out the form below and we'll give you a personalized demo of our features</p>
                  
                  <LeadForm className="bg-transparent" source="features-hero" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features tabs section */}
      <section className="py-20 bg-black">
        <div className="container px-4 mx-auto">
          <Tabs defaultValue="all" className="w-full max-w-5xl mx-auto">
            <div className="flex justify-center mb-12">
              <TabsList className="bg-gray-900/50 border border-gray-800 p-1">
                <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-gray-900 data-[state=active]:font-medium">All Features</TabsTrigger>
                <TabsTrigger value="core" className="data-[state=active]:bg-primary data-[state=active]:text-gray-900 data-[state=active]:font-medium">Core</TabsTrigger>
                <TabsTrigger value="clinical" className="data-[state=active]:bg-primary data-[state=active]:text-gray-900 data-[state=active]:font-medium">Clinical</TabsTrigger>
                <TabsTrigger value="business" className="data-[state=active]:bg-primary data-[state=active]:text-gray-900 data-[state=active]:font-medium">Business</TabsTrigger>
                <TabsTrigger value="tech" className="data-[state=active]:bg-primary data-[state=active]:text-gray-900 data-[state=active]:font-medium">Technology</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-0">
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {features.map((feature, index) => (
                  <FeatureCard key={index} feature={feature} />
                ))}
              </div>
            </TabsContent>

            {['core', 'clinical', 'business', 'tech'].map((category) => (
              <TabsContent key={category} value={category} className="mt-0">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {features
                    .filter(feature => feature.category === category)
                    .map((feature, index) => (
                      <FeatureCard key={index} feature={feature} />
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Workflow showcase section */}
      <section className="py-20 bg-gray-950">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto mb-16 text-center">
            <Badge className="inline-flex mb-6 text-sm font-medium bg-primary/20 text-primary border-primary/30">
              Seamless Experience
            </Badge>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Designed for optimal workflow
            </h2>
            <p className="text-xl text-gray-400">
              PureCare streamlines your daily operations with intuitive, connected processes
            </p>
          </div>

          <div className="relative">
            <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-primary/30 to-transparent transform -translate-x-1/2 hidden md:block"></div>
            
            {[
              {
                title: "Patient Registration",
                description: "Quickly register new patients with our streamlined forms that capture essential information while minimizing data entry time.",
                icon: <Users className="w-8 h-8 text-primary" />
              },
              {
                title: "Appointment Scheduling",
                description: "Intelligent scheduling system that optimizes your calendar and reduces conflicts and wait times.",
                icon: <Calendar className="w-8 h-8 text-primary" />
              },
              {
                title: "Clinical Documentation",
                description: "Structured templates for efficient and thorough documentation of patient encounters and procedures.",
                icon: <FileText className="w-8 h-8 text-primary" />
              },
              {
                title: "Billing & Follow-up",
                description: "Automated invoicing with integrated payment processing and insurance claim submission.",
                icon: <DollarSign className="w-8 h-8 text-primary" />
              }
            ].map((step, index) => (
              <div key={index} className="relative mb-16 last:mb-0">
                <div className="grid items-center grid-cols-1 gap-8 md:grid-cols-2">
                  <div className={`order-1 ${index % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}>
                    <div className={`relative p-6 rounded-xl bg-gray-900/50 border border-gray-800 ${index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'}`}>
                      <div className="absolute hidden -translate-y-1/2 md:block top-1/2 -left-12 right-auto">
                        <div className="flex items-center justify-center w-8 h-8 text-white bg-primary rounded-full">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex items-center mb-4 space-x-3">
                        <div className="flex items-center justify-center p-2 rounded-lg bg-primary/20">
                          {step.icon}
                        </div>
                        <h3 className="text-xl font-bold text-white">{step.title}</h3>
                      </div>
                      <p className="mb-4 text-gray-400">{step.description}</p>
                    </div>
                  </div>
                  <div className={`order-2 ${index % 2 === 0 ? 'md:order-2' : 'md:order-1'}`}>
                    <div className={`h-64 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-800 flex items-center justify-center ${index % 2 === 0 ? 'md:ml-8' : 'md:mr-8'}`}>
                      <div className="text-xl font-medium text-primary">
                        Step {index + 1} Screenshot
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial section */}
      <section className="py-20 bg-black">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto mb-16 text-center">
            <Badge className="inline-flex mb-6 text-sm font-medium bg-primary/20 text-primary border-primary/30">
              Customer Success
            </Badge>
            <h2 className="mb-4 text-3xl font-bold text-white">
              Trusted by healthcare professionals
            </h2>
            <p className="text-xl text-gray-400">
              See what our customers are saying about PureCare
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                quote: "PureCare transformed how we manage patient data. The interface is intuitive and the automation features save us hours every week.",
                name: "Dr. Sarah Johnson",
                role: "Family Medicine",
                image: "/testimonial1.jpg"
              },
              {
                quote: "The integrated billing system has significantly reduced our administrative overhead. We've decreased billing errors by over 35%.",
                name: "Dr. Michael Chen",
                role: "Pediatrics Director",
                image: "/testimonial2.jpg"
              },
              {
                quote: "Moving to PureCare was the best decision for our growing practice. The scalability and support have been exceptional.",
                name: "Dr. Emily Rodriguez",
                role: "Cardiology Specialist",
                image: "/testimonial3.jpg"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="overflow-hidden transition-all border bg-gray-900/50 border-gray-800 hover:-translate-y-1 duration-300">
                <CardContent className="p-6">
                  <div className="mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="inline-block w-5 h-5 mr-1 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <p className="mb-6 text-gray-300 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-4">
                      <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
                        {testimonial.name.charAt(0)}
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-white">{testimonial.name}</p>
                      <p className="text-sm text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden bg-black">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-[40rem] bg-gradient-to-r from-primary/5 to-blue-900/5"></div>
          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-t from-purple-900/10 to-transparent blur-3xl"></div>
        </div>
        
        <div className="container relative z-10 px-4 mx-auto">
          <div className="relative p-2 overflow-hidden border rounded-2xl md:p-8 bg-gradient-to-br from-gray-900 to-black border-gray-800">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-900/10 rounded-full blur-3xl"></div>
            
            <div className="relative grid gap-10 lg:grid-cols-2">
              <div className="flex flex-col justify-center">
                <Badge className="self-start mb-6 text-sm font-medium bg-primary/20 text-primary border-primary/30">
                  Get Started Today
                </Badge>
                <h2 className="mb-6 text-3xl font-bold leading-tight text-white md:text-4xl">
                  Ready to elevate your healthcare practice?
                </h2>
                <p className="mb-8 text-xl text-gray-400">
                  Join thousands of healthcare professionals who trust PureCare to run their practices efficiently.
                </p>
                
                <div className="p-6 mb-8 border rounded-xl bg-gray-800/50 border-gray-700/50">
                  <h3 className="mb-4 text-lg font-medium text-white">Why choose PureCare?</h3>
                  <ul className="space-y-4">
                    {[
                      "All-in-one solution for medical practices",
                      "Secure and compliant with healthcare regulations",
                      "Responsive customer support team",
                      "Regular updates with new features",
                    ].map((point, i) => (
                      <li key={i} className="flex items-start">
                        <div className="flex items-center justify-center flex-shrink-0 w-5 h-5 mt-1 mr-3 rounded-full bg-primary/20">
                          <CheckCircle className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-gray-300">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex flex-wrap gap-4 md:hidden">
                  <Button className="flex-1 bg-primary hover:bg-primary/90" size="lg">
                    Try Free Demo
                  </Button>
                  <Button variant="outline" className="flex-1 text-white" size="lg">
                    View Pricing
                  </Button>
                </div>
              </div>
              
              <div className="relative">
                <div className="p-6 border rounded-xl md:p-8 bg-gray-900/80 backdrop-blur-sm border-gray-800 shadow-xl">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-white">Request a demo</h3>
                    <p className="text-gray-400">Fill out the form and we'll show you how PureCare can help your practice</p>
                  </div>
                  <LeadForm className="bg-transparent" source="features-page" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

// Feature card component
const FeatureCard = ({ feature }) => {
  return (
    <Card className="overflow-hidden transition-all border hover:-translate-y-1 duration-300 bg-gray-900/50 border-gray-800">
      <CardContent className="p-6">
        <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-lg bg-gray-800/70">
          {feature.icon}
        </div>
        
        <h3 className="mb-3 text-xl font-bold text-white">{feature.title}</h3>
        <p className="mb-6 text-gray-400">{feature.description}</p>
        
        <ul className="mb-6 space-y-2">
          {feature.items.map((item, i) => (
            <li key={i} className="flex items-start">
              <CheckCircle className="flex-shrink-0 w-4 h-4 mt-1 mr-2 text-primary" />
              <span className="text-sm text-gray-300">{item}</span>
            </li>
          ))}
        </ul>
        
        <div className="pt-4 mt-auto border-t border-gray-800">
          <Button variant="link" className="flex items-center p-0 text-primary hover:text-primary/90">
            Learn more <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Features; 