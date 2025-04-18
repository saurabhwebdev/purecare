import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  ChevronRight,
  Stethoscope, 
  Calendar, 
  FileText, 
  Users, 
  DollarSign, 
  ShieldCheck, 
  BarChart4, 
  Clock, 
  Sparkles,
  Check,
  Gift,
  Award,
  Star,
  MousePointer,
  Monitor,
  Lock,
  ExternalLink,
  ChevronDown,
  CheckCircle2,
  ArrowDown,
  MessageSquare,
  Phone,
  Menu,
  X
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { LeadForm } from '@/components/lead';
import { cn } from '@/lib/utils';

const Index = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Intersection observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const target = document.getElementById('hero-section');
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, []);

  // Scroll observer for header effects
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <MainLayout>
      {/* Hero Section - Minimal, Dark, Split Layout */}
      <section id="hero-section" className={`min-h-screen flex items-center relative bg-black overflow-hidden ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}>
        {/* Subtle gradient background */}
        <div className="absolute inset-0">
          <div className="absolute w-full h-full">
            <div className="absolute top-0 left-1/3 w-[60%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-0 right-1/3 w-[50%] h-[30%] bg-blue-600/10 rounded-full blur-[100px]"></div>
          </div>
          <div className="absolute inset-0 bg-[url('/grid-pattern-dark.svg')] bg-repeat opacity-[0.03]"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left side - Content */}
            <div className="flex flex-col space-y-8">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary text-sm font-medium mb-2 self-start">
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                <span>The All-in-One SaaS Platform</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Elevate your digital experience with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">PureCare</span>
              </h1>
              
              <p className="text-xl text-gray-400 leading-relaxed">
                A sleek, intuitive platform that combines cutting-edge technology with elegant design to transform the way you work.
              </p>
              
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center text-gray-400 text-sm px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                  Enterprise-grade Security
                </div>
                <div className="flex items-center text-gray-400 text-sm px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                  No Credit Card Required
                </div>
                <div className="flex items-center text-gray-400 text-sm px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                  Free AI Suggestions
                </div>
              </div>
              
              {/* Brands section moved to left column */}
              <div className="pt-6 border-t border-white/10">
                <p className="text-gray-500 text-sm mb-4">TRUSTED BY INDUSTRY-LEADING COMPANIES</p>
                <div className="flex flex-wrap gap-x-8 gap-y-4 opacity-50">
                  {['Brand 1', 'Brand 2', 'Brand 3', 'Brand 4'].map((brand, i) => (
                    <div key={i} className="h-8">
                      <span className="text-gray-400 text-lg font-bold">{brand}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right side - Lead Form */}
            <div className="relative">
              <div className="absolute inset-0 -m-4 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-3xl blur-xl opacity-30"></div>
              
              <div className="relative bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-xl p-6 shadow-xl">
                <div className="mb-5 flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white">Get Started</h3>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/20 border border-primary/30">
                    <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                    <span className="text-xs font-medium text-primary">Live Demo</span>
                  </div>
                </div>
                
                <LeadForm className="bg-transparent" />
                
                <div className="mt-4 text-center text-xs text-gray-500">
                  By submitting this form, you agree to our <Link to="/terms" className="text-primary hover:underline">Terms</Link> and <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
                </div>
              </div>
              
              <div className="mt-6 flex items-center justify-center gap-6">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center border-2 border-black text-xs font-bold ${
                      i === 1 ? 'bg-blue-500 text-white' :
                      i === 2 ? 'bg-indigo-500 text-white' :
                      i === 3 ? 'bg-purple-500 text-white' :
                      'bg-pink-500 text-white'
                    }`}>
                      {['M', 'D', 'R', 'S'][i-1]}
                    </div>
                  ))}
                </div>
                <div className="text-sm text-gray-400">
                  <span className="text-white font-medium">500+</span> professionals trust us
                </div>
              </div>
            </div>
          </div>
          
          {/* Scroll indicator */}
          <div className="absolute left-1/2 bottom-8 transform -translate-x-1/2 animate-bounce hidden md:block">
            <div className="text-gray-500 text-sm mb-2 text-center">Scroll to explore</div>
            <div className="flex justify-center">
              <div className="h-10 w-10 rounded-full border border-gray-800 flex items-center justify-center">
                <ArrowDown className="h-5 w-5 text-gray-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Minimal Dark Mode */}
      <section className="py-24 bg-gray-950 relative overflow-hidden">
        {/* Subtle patterns */}
        <div className="absolute inset-0 bg-[url('/dots-pattern-dark.svg')] bg-repeat opacity-[0.03]"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary text-sm font-medium mb-6">
              Core Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Everything you need for exceptional performance
            </h2>
            <p className="text-xl text-gray-400">
              A comprehensive platform that simplifies your workflow and enhances productivity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Seamless Integration",
                description: "Connect with your favorite tools and services through our extensive API and plugin ecosystem.",
                icon: Users,
                color: "text-blue-400",
                borderColor: "border-blue-900/60",
                bgColor: "bg-blue-950/30"
              },
              {
                title: "Smart Automation",
                description: "AI-powered workflows with automated actions to optimize your business processes.",
                icon: Calendar,
                color: "text-indigo-400",
                borderColor: "border-indigo-900/60",
                bgColor: "bg-indigo-950/30"
              },
              {
                title: "Digital Asset Management",
                description: "Secure storage with powerful search and organization features for all your digital content.",
                icon: FileText,
                color: "text-emerald-400",
                borderColor: "border-emerald-900/60",
                bgColor: "bg-emerald-950/30"
              },
              {
                title: "Financial Analytics",
                description: "Comprehensive financial tracking with visual reports to monitor business performance.",
                icon: DollarSign,
                color: "text-amber-400",
                borderColor: "border-amber-900/60",
                bgColor: "bg-amber-950/30"
              },
              {
                title: "Enterprise Security",
                description: "Bank-level encryption and compliance standards ensure all your data is protected.",
                icon: ShieldCheck,
                color: "text-red-400",
                borderColor: "border-red-900/60",
                bgColor: "bg-red-950/30"
              },
              {
                title: "Business Intelligence",
                description: "Data-driven insights to optimize operations and improve decision-making.",
                icon: BarChart4,
                color: "text-purple-400",
                borderColor: "border-purple-900/60",
                bgColor: "bg-purple-950/30"
              },
            ].map((feature, index) => (
              <div 
                key={index}
                className="group relative bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 border border-gray-800 hover:border-primary/30 hover:shadow-lg transition-all duration-300 flex flex-col h-full"
              >
                <div className={`h-14 w-14 rounded-full ${feature.bgColor} ${feature.borderColor} border flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`h-7 w-7 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-400 flex-grow">
                  {feature.description}
                </p>
                <div className="mt-6 pt-4 border-t border-gray-800 flex items-center text-primary">
                  <span className="text-sm font-medium">Learn more</span>
                  <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            ))}
          </div>
          
          {/* Stats row - Minimal Dark */}
          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "99.9%", label: "Uptime guarantee", color: "text-blue-400" },
              { value: "24/7", label: "Expert support", color: "text-emerald-400" },
              { value: "10,000+", label: "Active users", color: "text-amber-400" },
              { value: "100+", label: "Integrations", color: "text-purple-400" },
            ].map((stat, index) => (
              <div key={index} className="text-center backdrop-blur-sm bg-gray-900/40 rounded-xl border border-gray-800 p-8">
                <p className={`text-4xl md:text-5xl font-bold mb-2 ${stat.color}`}>
                  {stat.value}
                </p>
                <p className="text-gray-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Features Section - Modern Dark Design */}
      <section className="py-24 bg-black relative overflow-hidden">
        {/* Subtle patterns */}
        <div className="absolute inset-0 bg-[url('/grid-pattern-dark.svg')] bg-center opacity-[0.02]"></div>
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-blue-600/5 rounded-full blur-[100px]"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4 mr-2" />
              <span>AI-Powered Technology</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Transform your workflow with intelligent assistance
            </h2>
            <p className="text-xl text-gray-400">
              Our AI technology helps you make better decisions and streamline operations
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: AI Assistant Card */}
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-800 shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">AI Workflow Assistant</h3>
                    <p className="text-sm text-primary">Powered by advanced machine learning</p>
                  </div>
                </div>
                
                <div className="p-5 bg-gray-900 rounded-xl border border-gray-800">
                  <p className="text-gray-300 mb-4 font-medium">
                    Simply describe your task and receive intelligent suggestions for optimizing your workflow with customized automation recommendations.
                  </p>
                  
                  <div className="bg-gray-800 rounded-lg p-4 mb-4 border border-gray-700">
                    <div className="flex items-center text-gray-400 text-sm mb-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <span>Task description:</span>
                    </div>
                    <p className="text-gray-300 font-mono text-sm bg-gray-900 p-2 rounded">
                      Weekly report generation and distribution to stakeholders
                    </p>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    <div className="h-px flex-grow mx-2 bg-gray-700"></div>
                    <span className="text-xs text-gray-500">AI processing</span>
                  </div>
                  
                  <div className="mt-4 space-y-3">
                    <div className="bg-gray-800 p-3 rounded border border-primary/20">
                      <p className="text-xs text-primary font-medium mb-1">RECOMMENDATION 1:</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-primary/10 text-primary border-primary/20">Automated Data Collection</Badge>
                        <Badge className="bg-gray-700 text-gray-300">Scheduled Trigger</Badge>
                        <Badge className="bg-gray-700 text-gray-300">Every Monday</Badge>
                      </div>
                    </div>
                    <div className="bg-gray-800 p-3 rounded border border-gray-700">
                      <p className="text-xs text-gray-500 font-medium mb-1">RECOMMENDATION 2:</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-gray-700 text-gray-300">Email Distribution</Badge>
                        <Badge className="bg-gray-700 text-gray-300">Dynamic Recipients</Badge>
                        <Badge className="bg-gray-700 text-gray-300">PDF Attachment</Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="mt-0.5 mr-3 h-5 w-5 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-gray-300">Get up to 5 AI suggestions every month for free</span>
                  </div>
                  <div className="flex items-start">
                    <div className="mt-0.5 mr-3 h-5 w-5 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-gray-300">AI learns from your usage patterns over time</span>
                  </div>
                  <div className="flex items-start">
                    <div className="mt-0.5 mr-3 h-5 w-5 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-gray-300">One-click implementation of suggestions</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right: Benefits Card */}
            <div className="space-y-7">
              <div className="flex items-start space-x-6">
                <div className="h-14 w-14 rounded-full bg-blue-900/20 flex items-center justify-center border border-blue-800/30 flex-shrink-0">
                  <span className="text-blue-400 text-xl font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Time-saving Automation</h3>
                  <p className="text-gray-400">
                    Reduce manual work by up to 80% with intelligent workflows that anticipate your needs and adjust in real-time to changing conditions.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-6">
                <div className="h-14 w-14 rounded-full bg-purple-900/20 flex items-center justify-center border border-purple-800/30 flex-shrink-0">
                  <span className="text-purple-400 text-xl font-bold">2</span>
                </div>
                    <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Enhanced Decision Making</h3>
                  <p className="text-gray-400">
                    Get data-driven insights and recommendations that help you make better strategic decisions and identify new opportunities.
                  </p>
                    </div>
                  </div>
                  
              <div className="flex items-start space-x-6">
                <div className="h-14 w-14 rounded-full bg-emerald-900/20 flex items-center justify-center border border-emerald-800/30 flex-shrink-0">
                  <span className="text-emerald-400 text-xl font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Seamless Collaboration</h3>
                  <p className="text-gray-400">
                    Foster better teamwork with AI-suggested collaboration opportunities and automated information sharing between team members.
                  </p>
                </div>
              </div>
              
              <div className="pt-6">
                <Link to="/signup">
                  <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-xl">
                    Get Started with AI-Powered Workflow
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Showcase - Modern Dark Design */}
      <section className="py-24 bg-gray-950 relative overflow-hidden">
        {/* Subtle patterns */}
        <div className="absolute inset-0 bg-[url('/grid-pattern-dark.svg')] bg-center opacity-[0.03]"></div>
        <div className="absolute bottom-0 right-0 w-1/2 h-1/3 bg-blue-900/5 rounded-full blur-[120px]"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary text-sm font-medium mb-6">
              <Clock className="h-4 w-4 mr-2" />
              <span>Modern Experience</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Intuitive & Powerful Interface
            </h2>
            <p className="text-xl text-gray-400">
              Our beautifully designed platform enhances your workflow with seamless navigation and powerful tools
            </p>
          </div>

          <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-800 shadow-lg overflow-hidden">
            <Tabs defaultValue="dashboard" className="w-full">
              <TabsList className="flex pt-5 px-5 border-b border-gray-800 bg-transparent justify-center">
                {[
                  { value: "dashboard", label: "Dashboard", icon: BarChart4 },
                  { value: "projects", label: "Projects", icon: Users },
                  { value: "tasks", label: "Tasks", icon: Calendar },
                  { value: "analytics", label: "Analytics", icon: BarChart4 },
                ].map((tab) => (
                  <TabsTrigger 
                    key={tab.value} 
                    value={tab.value}
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none px-5 py-3 text-gray-400 data-[state=active]:text-primary rounded-none"
                  >
                    <div className="flex items-center gap-2">
                      <tab.icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <div className="p-8">
                <TabsContent value="dashboard" className="mt-0">
                  <div className="grid md:grid-cols-2 gap-10 items-center">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-bold mb-3 text-white">Intelligent Dashboard</h3>
                        <p className="text-gray-400">
                          Our customizable dashboard gives you a complete overview of your business metrics, tasks, and team activities in one place.
                        </p>
                      </div>
                      
                      <div className="bg-gray-800 p-5 rounded-xl border border-gray-700">
                        <h4 className="font-medium mb-4 text-white flex items-center">
                          <BarChart4 className="h-5 w-5 mr-2 text-primary" />
                          Key Features
                        </h4>
                        <ul className="space-y-3">
                          {[
                            "Customizable widget layout with drag-and-drop",
                            "Real-time data updates and notifications",
                            "Personalized insights based on your role",
                            "Interactive charts and data visualization",
                            "One-click export and sharing options"
                          ].map((item, i) => (
                            <li key={i} className="flex items-start">
                              <div className="mr-3 mt-1 h-5 w-5 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                                <Check className="h-3 w-3 text-primary" />
                              </div>
                              <span className="text-gray-300">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="bg-black/40 backdrop-blur-sm rounded-xl p-8 border border-gray-800 h-[400px] flex items-center justify-center relative overflow-hidden">
                      <BarChart4 className="absolute -right-12 -bottom-10 h-40 w-40 text-gray-800" />
                      <div className="relative z-10 text-center space-y-5">
                        <div className="h-16 w-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                          <BarChart4 className="h-8 w-8 text-primary" />
                        </div>
                        <h4 className="text-xl font-medium text-white">Interactive Dashboard</h4>
                        <p className="text-gray-400 max-w-md mx-auto">
                          A powerful command center for your entire organization
                        </p>
                        <Button variant="outline" size="sm" className="border-gray-700 text-primary hover:border-primary hover:bg-primary/10">
                          View Live Demo
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="projects" className="mt-0">
                  <div className="grid md:grid-cols-2 gap-10 items-center">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-bold mb-3 text-white">Project Management</h3>
                        <p className="text-gray-400">
                          Organize your work into projects with collaborative tools, timeline views, and resource allocation features.
                        </p>
                      </div>
                      
                      <div className="bg-gray-800 p-5 rounded-xl border border-gray-700">
                        <h4 className="font-medium mb-4 text-white flex items-center">
                          <Users className="h-5 w-5 mr-2 text-blue-400" />
                          Key Features
                        </h4>
                        <ul className="space-y-3">
                          {[
                            "Kanban, list, and Gantt chart project views",
                            "Team member assignment and workload balancing",
                            "Advanced file sharing and version control",
                            "Automated progress tracking and reporting",
                            "Client collaboration portal"
                          ].map((item, i) => (
                            <li key={i} className="flex items-start">
                              <div className="mr-3 mt-1 h-5 w-5 flex-shrink-0 rounded-full bg-blue-900/50 flex items-center justify-center">
                                <Check className="h-3 w-3 text-blue-400" />
                              </div>
                              <span className="text-gray-300">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="bg-black/40 backdrop-blur-sm rounded-xl p-8 border border-gray-800 h-[400px] flex items-center justify-center relative overflow-hidden">
                      <Users className="absolute -right-12 -bottom-10 h-40 w-40 text-gray-800" />
                      <div className="relative z-10 text-center space-y-5">
                        <div className="h-16 w-16 mx-auto rounded-full bg-blue-900/30 flex items-center justify-center border border-blue-700/30">
                          <Users className="h-8 w-8 text-blue-400" />
                        </div>
                        <h4 className="text-xl font-medium text-white">Team Collaboration</h4>
                        <p className="text-gray-400 max-w-md mx-auto">
                          Bring your team together with powerful collaboration tools
                        </p>
                        <Button variant="outline" size="sm" className="border-gray-700 text-blue-400 hover:border-blue-700/50 hover:bg-blue-900/20">
                          View Live Demo
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="tasks" className="mt-0">
                  <div className="grid md:grid-cols-2 gap-10 items-center">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-bold mb-3 text-white">Task Management</h3>
                        <p className="text-gray-400">
                          Create, assign and track tasks with deadlines, priorities, and dependencies to keep everything on schedule.
                        </p>
                      </div>
                      
                      <div className="bg-gray-800 p-5 rounded-xl border border-gray-700">
                        <h4 className="font-medium mb-4 text-white flex items-center">
                          <Calendar className="h-5 w-5 mr-2 text-emerald-400" />
                          Key Features
                        </h4>
                        <ul className="space-y-3">
                          {[
                            "Task templates for recurring workflows",
                            "Subtasks and checklist items",
                            "Smart due date suggestions",
                            "Task dependencies and critical path analysis",
                            "Time tracking and estimation"
                          ].map((item, i) => (
                            <li key={i} className="flex items-start">
                              <div className="mr-3 mt-1 h-5 w-5 flex-shrink-0 rounded-full bg-emerald-900/50 flex items-center justify-center">
                                <Check className="h-3 w-3 text-emerald-400" />
                              </div>
                              <span className="text-gray-300">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="bg-black/40 backdrop-blur-sm rounded-xl p-8 border border-gray-800 h-[400px] flex items-center justify-center relative overflow-hidden">
                      <Calendar className="absolute -right-12 -bottom-10 h-40 w-40 text-gray-800" />
                      <div className="relative z-10 text-center space-y-5">
                        <div className="h-16 w-16 mx-auto rounded-full bg-emerald-900/30 flex items-center justify-center border border-emerald-700/30">
                          <Calendar className="h-8 w-8 text-emerald-400" />
                        </div>
                        <h4 className="text-xl font-medium text-white">Smart Task Manager</h4>
                        <p className="text-gray-400 max-w-md mx-auto">
                          Never miss a deadline with intelligent task management
                        </p>
                        <Button variant="outline" size="sm" className="border-gray-700 text-emerald-400 hover:border-emerald-700/50 hover:bg-emerald-900/20">
                          View Live Demo
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="analytics" className="mt-0">
                  <div className="grid md:grid-cols-2 gap-10 items-center">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-bold mb-3 text-white">Advanced Analytics</h3>
                        <p className="text-gray-400">
                          Gain deep insights into your business performance with customizable reports and interactive visualizations.
                        </p>
                      </div>
                      
                      <div className="bg-gray-800 p-5 rounded-xl border border-gray-700">
                        <h4 className="font-medium mb-4 text-white flex items-center">
                          <BarChart4 className="h-5 w-5 mr-2 text-purple-400" />
                          Key Features
                        </h4>
                        <ul className="space-y-3">
                          {[
                            "Custom report builder with drag-and-drop interface",
                            "Real-time data processing and visualization",
                            "AI-powered trend analysis and forecasting",
                            "Automated report scheduling and distribution",
                            "Interactive dashboards with drill-down capabilities"
                          ].map((item, i) => (
                            <li key={i} className="flex items-start">
                              <div className="mr-3 mt-1 h-5 w-5 flex-shrink-0 rounded-full bg-purple-900/50 flex items-center justify-center">
                                <Check className="h-3 w-3 text-purple-400" />
                              </div>
                              <span className="text-gray-300">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="bg-black/40 backdrop-blur-sm rounded-xl p-8 border border-gray-800 h-[400px] flex items-center justify-center relative overflow-hidden">
                      <BarChart4 className="absolute -right-12 -bottom-10 h-40 w-40 text-gray-800" />
                      <div className="relative z-10 text-center space-y-5">
                        <div className="h-16 w-16 mx-auto rounded-full bg-purple-900/30 flex items-center justify-center border border-purple-700/30">
                          <BarChart4 className="h-8 w-8 text-purple-400" />
                        </div>
                        <h4 className="text-xl font-medium text-white">Data Visualization</h4>
                        <p className="text-gray-400 max-w-md mx-auto">
                          Turn complex data into actionable insights
                        </p>
                        <Button variant="outline" size="sm" className="border-gray-700 text-purple-400 hover:border-purple-700/50 hover:bg-purple-900/20">
                          View Live Demo
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Testimonials - Modern Dark Design */}
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern-dark.svg')] bg-center opacity-[0.02]"></div>
        <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-blue-900/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-purple-900/5 rounded-full blur-[100px]"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary text-sm font-medium mb-6">
              <Star className="h-4 w-4 mr-2" />
              <span>Customer Stories</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Trusted by Industry Leaders
            </h2>
            <p className="text-xl text-gray-400">
              See what professionals around the world are saying about PureCare
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "PureCare's AI feature has been a game-changer for our team. The workflow suggestions are remarkably accurate and have saved us considerable time with each project.",
                author: "Sarah Johnson",
                role: "Product Manager",
                company: "TechInnova",
                avatarBg: "bg-gradient-to-br from-blue-600 to-blue-800"
              },
              {
                quote: "The analytics system has transformed our decision-making process. We've seen a 40% improvement in project efficiency since implementing PureCare's intelligent insights.",
                author: "Michael Chen",
                role: "Operations Director",
                company: "Nexus Group",
                avatarBg: "bg-gradient-to-br from-emerald-600 to-emerald-800"
              },
              {
                quote: "As a growing startup, we needed something scalable yet comprehensive. PureCare delivers exactly what we need without overwhelming us with complexity or unnecessary features.",
                author: "James Wilson",
                role: "CEO",
                company: "Future Forward",
                avatarBg: "bg-gradient-to-br from-purple-600 to-purple-800"
              },
            ].map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-gray-900/60 backdrop-blur-sm rounded-xl border border-gray-800 p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="space-y-4">
                  <div className="flex">
                    {Array(5).fill(null).map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  
                  <p className="text-gray-300 italic">{testimonial.quote}</p>
                  
                  <div className="pt-4 flex items-center">
                    <div className={`h-12 w-12 rounded-full ${testimonial.avatarBg} flex items-center justify-center text-white font-medium text-sm mr-4 shadow-lg`}>
                      {testimonial.author.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{testimonial.author}</p>
                      <p className="text-sm text-gray-400">{testimonial.role}, {testimonial.company}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Modern Dark Design */}
      <section className="py-24 bg-gray-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern-dark.svg')] bg-center opacity-[0.02]"></div>
        <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-primary/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/3 bg-blue-900/5 rounded-full blur-[100px]"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto bg-gradient-to-r from-gray-900 to-black rounded-3xl p-1">
            <div className="bg-black/70 backdrop-blur-sm rounded-[calc(1.5rem-4px)] border border-gray-800 p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Ready to transform your workflow?
              </h2>
              
              <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto mb-10">
                Join thousands of professionals who've revolutionized their business operations with PureCare's powerful platform.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <Link to="/signup" className="flex-1">
                  <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-white rounded-full h-12 px-8 font-medium">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                
                <Link to="/demo" className="flex-1">
                  <Button size="lg" variant="outline" className="w-full border-gray-700 text-gray-300 hover:bg-white/5 rounded-full h-12 px-8 font-medium">
                    Watch Demo
                  </Button>
                </Link>
              </div>
              
              <div className="flex flex-wrap items-center justify-center text-sm text-gray-500 mt-8 gap-3">
                <div className="flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  <ShieldCheck className="h-4 w-4 text-green-400 mr-2" />
                  <span>Enterprise-grade Security</span>
                </div>
                <div className="flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  <span>No Credit Card</span>
                </div>
                <div className="flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  <span>Cancel Anytime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
