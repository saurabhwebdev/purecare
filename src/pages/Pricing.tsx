import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Check, X, Sparkles, Shield, Cloud, Server, Clock, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LeadForm from '@/components/lead/LeadForm';

const Pricing = () => {
  const features = [
    { name: 'Appointment scheduling', cloud: true, local: true, highlight: false },
    { name: 'Patient management', cloud: true, local: true, highlight: false },
    { name: 'Medical records', cloud: true, local: true, highlight: false },
    { name: 'Prescription management', cloud: true, local: true, highlight: false },
    { name: 'Invoicing system', cloud: true, local: true, highlight: false },
    { name: 'Inventory tracking', cloud: true, local: true, highlight: false },
    { name: 'Regular updates', cloud: true, local: true, highlight: false },
    { name: 'Community support', cloud: true, local: true, highlight: false },
    { name: 'Local installation & hosting', cloud: false, local: true, highlight: true },
    { name: 'Complete data ownership', cloud: false, local: true, highlight: true },
    { name: 'Enhanced security controls', cloud: false, local: true, highlight: true },
    { name: 'Offline capabilities', cloud: false, local: true, highlight: true },
    { name: 'Customization options', cloud: false, local: true, highlight: true },
    { name: 'Priority updates', cloud: false, local: true, highlight: false },
    { name: 'Premium support', cloud: false, local: true, highlight: false },
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
                Simple, Transparent Pricing
              </Badge>
              
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Choose the perfect plan for <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">your practice</span>
              </h1>
              
              <p className="max-w-2xl mx-auto mb-10 text-xl text-gray-400">
                Two straightforward options designed to help transform your healthcare practice
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
                      <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10 mr-4">
                        <Shield className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-white mb-1">Secure & Compliant</h3>
                        <p className="text-gray-400">HIPAA-compliant platform with enterprise-grade security for your sensitive data</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 p-2 rounded-lg bg-blue-500/10 mr-4">
                        <Clock className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-white mb-1">24/7 Availability</h3>
                        <p className="text-gray-400">Access your practice management system anytime, from anywhere</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 p-2 rounded-lg bg-amber-500/10 mr-4">
                        <Star className="w-6 h-6 text-amber-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-white mb-1">Best-in-class Support</h3>
                        <p className="text-gray-400">Dedicated customer success team to ensure your practice thrives</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Right column - Lead form */}
                <div className="p-8 md:p-12 bg-gray-900/70">
                  <h2 className="text-2xl font-bold text-white mb-6">Get started today</h2>
                  <p className="text-gray-400 mb-6">Fill out the form below and we'll help you choose the right plan for your practice</p>
                  
                  <LeadForm className="bg-transparent" source="pricing-hero" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing section */}
      <section className="py-20 bg-black">
        <div className="container px-4 mx-auto">
          <div className="relative z-10 grid max-w-6xl grid-cols-1 gap-8 mx-auto lg:grid-cols-2">
            {/* Cloud Edition Card */}
            <div className="relative overflow-hidden transition-all duration-300 transform bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl group hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm"></div>
              <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-br from-gray-800/50 to-gray-900/50 group-hover:opacity-100"></div>
              
              <div className="relative p-8">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <Cloud className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Cloud Edition</h3>
                  </div>
                  <Badge variant="outline" className="text-blue-400 border-blue-400/30 bg-blue-500/10">
                    Free
                  </Badge>
                </div>
                
                <div className="mb-5">
                  <div className="mb-1 text-4xl font-bold text-white">Free</div>
                  <div className="text-gray-400">Lifetime free access</div>
                </div>
                
                <p className="mb-8 text-gray-300">
                  Complete online access to the PureCare platform with all essential features for your practice.
                </p>
                
                <Button className="w-full mb-8 text-white bg-blue-600 hover:bg-blue-700">
                  Get Started Now
                </Button>
                
                <div className="pt-6 mt-6 border-t border-gray-700/50">
                  <h4 className="mb-4 text-sm font-medium tracking-wider text-gray-400 uppercase">
                    What's included:
                  </h4>
                  <ul className="space-y-3">
                    {features.map((feature, i) => (
                      <li key={i} className={`flex items-start ${!feature.cloud && 'opacity-50'}`}>
                        {feature.cloud ? (
                          <Check className="flex-shrink-0 w-5 h-5 mt-0.5 mr-3 text-blue-400" />
                        ) : (
                          <X className="flex-shrink-0 w-5 h-5 mt-0.5 mr-3 text-gray-600" />
                        )}
                        <span className={`text-sm ${feature.highlight ? 'text-gray-300 font-medium' : 'text-gray-400'}`}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Local Edition Card */}
            <div className="relative overflow-hidden transition-all duration-300 transform rounded-2xl group hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-blue-900/30"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 to-gray-900/90 backdrop-blur-sm"></div>
              <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-br from-primary/10 to-blue-900/10 group-hover:opacity-100"></div>
              
              <div className="relative p-8">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-primary/20">
                      <Server className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Local Edition</h3>
                  </div>
                  <Badge className="bg-primary border-primary/30">
                    <span className="text-gray-900 font-semibold">Premium</span>
                  </Badge>
                </div>
                
                <div className="mb-5">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-white">₹300</span>
                    <span className="ml-2 text-gray-400">per month</span>
                  </div>
                  <div className="text-gray-400">Full local installation</div>
                </div>
                
                <p className="mb-8 text-gray-300">
                  Complete control with local installation for enhanced security, offline capabilities, and full customization.
                </p>
                
                <Button className="w-full mb-8 bg-primary hover:bg-primary/90">
                  Contact Sales
                </Button>
                
                <div className="pt-6 mt-6 border-t border-gray-700/50">
                  <h4 className="mb-4 text-sm font-medium tracking-wider text-gray-400 uppercase">
                    Everything in Cloud, plus:
                  </h4>
                  <ul className="space-y-3">
                    {features.map((feature, i) => (
                      <li key={i} className={`flex items-start ${!feature.local && 'opacity-50'}`}>
                        {feature.local ? (
                          <Check className={`flex-shrink-0 w-5 h-5 mt-0.5 mr-3 ${feature.highlight ? 'text-primary' : 'text-blue-400'}`} />
                        ) : (
                          <X className="flex-shrink-0 w-5 h-5 mt-0.5 mr-3 text-gray-600" />
                        )}
                        <span className={`text-sm ${feature.highlight ? 'text-white font-medium' : 'text-gray-400'}`}>
                          {feature.name}
                          {feature.highlight && feature.local && (
                            <Sparkles className="inline-block ml-1.5 w-3.5 h-3.5 text-yellow-500" />
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 bg-gray-950">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-400">
              Everything you need to know about our pricing plans
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid gap-6 md:grid-cols-2">
              {[
                {
                  q: "Can I switch between plans?",
                  a: "Yes, you can upgrade from Cloud to Local Edition at any time. Our team will help you migrate your data and settings seamlessly."
                },
                {
                  q: "Is there a setup fee for Local Edition?",
                  a: "There's no setup fee. The monthly subscription covers everything including installation support and ongoing updates."
                },
                {
                  q: "Is my data secure?",
                  a: "Absolutely. We use industry-standard encryption and security protocols to protect your data in both Cloud and Local Editions."
                },
                {
                  q: "What kind of support is included?",
                  a: "Cloud Edition includes community support, while Local Edition comes with premium direct support with faster response times."
                },
              ].map((faq, i) => (
                <Card key={i} className="border bg-gray-900/50 border-gray-800">
                  <CardContent className="pt-6">
                    <h3 className="mb-2 text-lg font-medium text-white">{faq.q}</h3>
                    <p className="text-gray-400">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Lead Form Section with curved design */}
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
                <h2 className="mb-6 text-3xl font-bold leading-tight text-white md:text-4xl">
                  Ready to transform your healthcare practice?
                </h2>
                <p className="mb-8 text-xl text-gray-400">
                  Get in touch with our team to discuss how the Local Edition can be tailored to your specific needs.
                </p>
                
                <div className="p-6 mb-8 border rounded-xl bg-gray-800/50 border-gray-700/50">
                  <h3 className="mb-4 text-lg font-medium text-white">Why choose Local Edition?</h3>
                  <ul className="space-y-4">
                    {[
                      "Complete data ownership and control",
                      "Enhanced security for sensitive patient data",
                      "Offline capabilities for uninterrupted service",
                      "Customizable to your specific workflow",
                    ].map((point, i) => (
                      <li key={i} className="flex items-start">
                        <div className="flex items-center justify-center flex-shrink-0 w-5 h-5 mt-1 mr-3 rounded-full bg-primary/20">
                          <Check className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-gray-300">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex flex-wrap gap-4 md:hidden">
                  <Button className="flex-1 bg-primary hover:bg-primary/90" size="lg">
                    Contact Sales
                  </Button>
                  <Button variant="outline" className="flex-1 text-white" size="lg">
                    Book Demo
                  </Button>
                </div>
              </div>
              
              <div className="relative">
                <div className="p-6 border rounded-xl md:p-8 bg-gray-900/80 backdrop-blur-sm border-gray-800 shadow-xl">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-white">Get in touch</h3>
                    <p className="text-gray-400">Fill out the form and we'll contact you shortly</p>
                  </div>
                  <LeadForm className="bg-transparent" source="pricing-page" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Pricing; 