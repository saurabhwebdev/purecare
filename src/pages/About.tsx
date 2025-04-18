import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Badge } from '@/components/ui/badge';
import { Heart, Users, Shield, Award, Building, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-6">About PureCare</h1>
          
          {/* Company mission and vision */}
          <section className="mb-16">
            <div className="bg-background/50 border border-border p-8 rounded-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-primary/5 rounded-full blur-3xl -z-10"></div>
              <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-blue-900/5 rounded-full blur-3xl -z-10"></div>
              
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="md:w-1/3 flex items-center justify-center mb-6 md:mb-0">
                  <div className="rounded-full bg-primary/10 p-6">
                    <Heart className="w-16 h-16 text-primary rainbow-heart" fill="currentColor" />
                  </div>
                </div>
                
                <div className="md:w-2/3">
                  <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">Our Mission</Badge>
                  <h2 className="text-2xl font-semibold mb-4">Transforming Healthcare Management</h2>
                  <p className="text-muted-foreground mb-6">
                    At PureCare, we're committed to transforming healthcare management through intuitive, 
                    user-friendly solutions that empower healthcare providers to deliver exceptional care 
                    while streamlining administrative tasks.
                  </p>
                  <p className="text-muted-foreground">
                    Our vision is a world where healthcare professionals can focus on what matters most—their patients—while 
                    technology handles the complexities of practice management seamlessly in the background.
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          {/* Our story */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-6">Our Story</h2>
            
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                PureCare was founded in 2022 by a team of healthcare professionals and technology experts who 
                experienced firsthand the challenges of managing modern healthcare practices. Frustrated by 
                outdated, complex, and disconnected systems, they envisioned a comprehensive solution that would 
                simplify practice management while enhancing patient care.
              </p>
              
              <p>
                What began as a simple scheduling tool has evolved into a comprehensive healthcare management 
                platform that serves thousands of healthcare providers across the country. Throughout our journey, 
                we've remained committed to our core values of simplicity, security, and patient-centered design.
              </p>
              
              <div className="my-8 relative">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/5 to-blue-900/5 rounded-lg -z-10"></div>
                <div className="border border-border rounded-lg p-6">
                  <h3 className="text-xl font-medium mb-4">Our Commitment</h3>
                  <p className="text-muted-foreground">
                    We believe that technology should serve healthcare, not the other way around. Every feature 
                    we develop is designed with input from practicing healthcare professionals to ensure it solves 
                    real problems and enhances the delivery of care.
                  </p>
                </div>
              </div>
              
              <p>
                Today, PureCare continues to innovate in the healthcare management space, with a focus on 
                leveraging artificial intelligence, automation, and data analytics to provide ever more 
                powerful tools for healthcare practices of all sizes.
              </p>
            </div>
          </section>
          
          {/* Core values */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-6">Our Core Values</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card border rounded-lg p-6">
                <div className="flex items-start">
                  <div className="mr-4 p-2 bg-primary/10 rounded-lg">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Patient-Centered</h3>
                    <p className="text-muted-foreground">
                      We design our solutions with the patient experience in mind, recognizing that 
                      streamlined operations ultimately lead to better care.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border rounded-lg p-6">
                <div className="flex items-start">
                  <div className="mr-4 p-2 bg-blue-500/10 rounded-lg">
                    <Shield className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Security & Privacy</h3>
                    <p className="text-muted-foreground">
                      We maintain the highest standards of data security and privacy protection, 
                      exceeding industry requirements and expectations.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border rounded-lg p-6">
                <div className="flex items-start">
                  <div className="mr-4 p-2 bg-amber-500/10 rounded-lg">
                    <Award className="h-6 w-6 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Excellence</h3>
                    <p className="text-muted-foreground">
                      We strive for excellence in everything we do, from product design and 
                      development to customer support and service.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border rounded-lg p-6">
                <div className="flex items-start">
                  <div className="mr-4 p-2 bg-purple-500/10 rounded-lg">
                    <Clock className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Efficiency</h3>
                    <p className="text-muted-foreground">
                      We're dedicated to creating solutions that save time and reduce administrative 
                      burden, allowing healthcare providers to focus on care.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Leadership team */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-6">Leadership Team</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card border rounded-lg p-6 text-center">
                <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-lg font-medium">Dr. Sarah Johnson</h3>
                <p className="text-sm text-primary mb-2">Co-Founder & CEO</p>
                <p className="text-sm text-muted-foreground">
                  Former practicing physician with 15+ years of experience in healthcare management
                </p>
              </div>
              
              <div className="bg-card border rounded-lg p-6 text-center">
                <div className="w-24 h-24 bg-blue-500/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-10 w-10 text-blue-500" />
                </div>
                <h3 className="text-lg font-medium">Michael Chen</h3>
                <p className="text-sm text-primary mb-2">Co-Founder & CTO</p>
                <p className="text-sm text-muted-foreground">
                  Technology expert with a background in healthcare informatics and software development
                </p>
              </div>
              
              <div className="bg-card border rounded-lg p-6 text-center">
                <div className="w-24 h-24 bg-amber-500/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-10 w-10 text-amber-500" />
                </div>
                <h3 className="text-lg font-medium">Jessica Rodriguez</h3>
                <p className="text-sm text-primary mb-2">Chief Product Officer</p>
                <p className="text-sm text-muted-foreground">
                  Former healthcare administrator with expertise in practice management and operations
                </p>
              </div>
            </div>
          </section>
          
          {/* Company facts */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-6">Company Facts</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-card border rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">2022</div>
                <p className="text-sm text-muted-foreground">Founded</p>
              </div>
              
              <div className="bg-card border rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">5,000+</div>
                <p className="text-sm text-muted-foreground">Healthcare Providers</p>
              </div>
              
              <div className="bg-card border rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">50+</div>
                <p className="text-sm text-muted-foreground">Team Members</p>
              </div>
              
              <div className="bg-card border rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">3</div>
                <p className="text-sm text-muted-foreground">Office Locations</p>
              </div>
            </div>
          </section>
          
          {/* Contact CTA */}
          <section>
            <div className="bg-gradient-to-br from-primary/10 to-blue-900/10 border border-border rounded-lg p-8 text-center">
              <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Interested in learning more about PureCare? We'd love to hear from you. Contact our team 
                for information about our products, partnership opportunities, or careers.
              </p>
              <div className="flex justify-center">
                <Button asChild variant="default" className="font-medium">
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  );
};

export default About; 