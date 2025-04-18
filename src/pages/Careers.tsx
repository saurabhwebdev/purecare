import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Users, Clock, Search, Building, BookOpen, Coffee } from 'lucide-react';
import { LeadForm } from '@/components/lead';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Careers = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-6">Careers at PureCare</h1>
          
          {/* Current status */}
          <section className="mb-16">
            <div className="bg-purple-950/20 border border-purple-900/30 p-8 rounded-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-purple-900/5 rounded-full blur-3xl -z-10"></div>
              
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="md:w-1/3 flex items-center justify-center mb-6 md:mb-0">
                  <div className="rounded-full bg-purple-500/10 p-6">
                    <Search className="w-16 h-16 text-purple-500" />
                  </div>
                </div>
                
                <div className="md:w-2/3">
                  <Badge className="mb-4 bg-purple-500/20 text-purple-500 border-purple-500/30">Status Update</Badge>
                  <h2 className="text-2xl font-semibold mb-4">We're Not Currently Hiring</h2>
                  <p className="text-muted-foreground mb-6">
                    While we don't have any open positions at the moment, we're always on the lookout for exceptional 
                    talent to join our team. If you're passionate about healthcare technology, keep checking back 
                    or submit your details below, and we'll notify you when new opportunities arise.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button asChild variant="outline" className="bg-purple-500/10 border-purple-500/20 text-purple-500">
                      <Link to="/about">Learn About Us</Link>
                    </Button>
                    <Button asChild variant="outline" className="bg-background/50">
                      <a href="#stay-connected">Stay Connected</a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Why join us */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-8">Why Join PureCare?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-card border rounded-lg p-6">
                <div className="flex items-start">
                  <div className="mr-4 p-2 bg-primary/10 rounded-lg">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Impactful Work</h3>
                    <p className="text-muted-foreground">
                      Help transform healthcare by building solutions that make a real difference in the lives of 
                      healthcare providers and their patients.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border rounded-lg p-6">
                <div className="flex items-start">
                  <div className="mr-4 p-2 bg-blue-500/10 rounded-lg">
                    <Building className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Growth-Oriented Culture</h3>
                    <p className="text-muted-foreground">
                      Work in an environment that encourages learning, experimentation, and continuous personal 
                      and professional development.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border rounded-lg p-6">
                <div className="flex items-start">
                  <div className="mr-4 p-2 bg-amber-500/10 rounded-lg">
                    <BookOpen className="h-6 w-6 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Continuous Learning</h3>
                    <p className="text-muted-foreground">
                      Access to learning resources, professional development opportunities, and mentorship from 
                      industry experts.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border rounded-lg p-6">
                <div className="flex items-start">
                  <div className="mr-4 p-2 bg-green-500/10 rounded-lg">
                    <Coffee className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Work-Life Balance</h3>
                    <p className="text-muted-foreground">
                      Flexible working arrangements, comprehensive benefits, and a supportive environment that 
                      values well-being.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Our hiring process */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-8">Our Hiring Process</h2>
            
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="w-12 h-12 flex-shrink-0 rounded-full bg-background border border-border flex items-center justify-center mr-4">
                  <span className="text-lg font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Application Review</h3>
                  <p className="text-muted-foreground">
                    Our team reviews all applications to identify candidates whose experience and skills align 
                    with our current needs and company culture.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-12 h-12 flex-shrink-0 rounded-full bg-background border border-border flex items-center justify-center mr-4">
                  <span className="text-lg font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Initial Interview</h3>
                  <p className="text-muted-foreground">
                    A conversation with our hiring manager to discuss your experience, skills, and to learn more 
                    about your career goals and aspirations.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-12 h-12 flex-shrink-0 rounded-full bg-background border border-border flex items-center justify-center mr-4">
                  <span className="text-lg font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Technical Assessment</h3>
                  <p className="text-muted-foreground">
                    For technical roles, we conduct a skills assessment to evaluate your technical abilities and 
                    problem-solving approach.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-12 h-12 flex-shrink-0 rounded-full bg-background border border-border flex items-center justify-center mr-4">
                  <span className="text-lg font-bold">4</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Team Interview</h3>
                  <p className="text-muted-foreground">
                    Meet with potential team members to discuss collaboration styles and ensure a mutual fit with 
                    our team dynamics.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-12 h-12 flex-shrink-0 rounded-full bg-background border border-border flex items-center justify-center mr-4">
                  <span className="text-lg font-bold">5</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Final Decision & Offer</h3>
                  <p className="text-muted-foreground">
                    After the interview process, we make our final decision and extend an offer to the selected 
                    candidate.
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          {/* Stay connected */}
          <section id="stay-connected" className="mb-16">
            <div className="bg-background/50 border border-border rounded-xl p-8">
              <div className="mb-8 text-center">
                <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">Stay Connected</Badge>
                <h2 className="text-2xl font-semibold mb-4">Express Interest in Future Opportunities</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  While we're not actively hiring, we'd love to keep your information on file for when new positions 
                  open up. Fill out the form below to stay connected with our talent team.
                </p>
              </div>
              
              <div className="max-w-2xl mx-auto bg-card border border-border rounded-lg p-6">
                <LeadForm source="careers-page" />
              </div>
            </div>
          </section>
          
          {/* Values and culture */}
          <section>
            <h2 className="text-2xl font-semibold mb-8">Our Values & Culture</h2>
            
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                At PureCare, we believe that our culture is our strongest asset. We've built a workplace where 
                innovation thrives, diverse perspectives are valued, and everyone has the opportunity to make a 
                meaningful impact.
              </p>
              
              <p>
                Our team is united by a shared mission to transform healthcare through technology, making it more 
                efficient, accessible, and human-centered. If you're passionate about creating solutions that improve 
                lives and are excited by the challenge of reshaping an essential industry, you'll feel right at home here.
              </p>
              
              <div className="my-8 relative">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/5 to-blue-900/5 rounded-lg -z-10"></div>
                <div className="border border-border rounded-lg p-6">
                  <h3 className="text-xl font-medium mb-4">Our Promise to Candidates</h3>
                  <p className="text-muted-foreground">
                    We're committed to providing a transparent, respectful, and efficient hiring process for all 
                    candidates. We value your time and investment in exploring opportunities with us, and we'll do 
                    our best to ensure your experience is positive, regardless of the outcome.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-12 flex justify-center">
              <Button asChild variant="outline" className="font-medium">
                <Link to="/about">Learn More About PureCare</Link>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  );
};

export default Careers; 