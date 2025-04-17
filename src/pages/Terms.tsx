import React from 'react';
import MainLayout from '@/components/layout/MainLayout';

const Terms = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-6">Terms of Service</h1>
          
          <p className="text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
              <p>
                By accessing or using PureCare's services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this service.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
              <p>
                Permission is granted to temporarily use PureCare's services for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc ml-6 mt-2 space-y-2">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose</li>
                <li>Attempt to decompile or reverse engineer any software contained in PureCare</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
                <li>Transfer the materials to another person or 'mirror' the materials on any other server</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Disclaimer</h2>
              <p>
                The materials on PureCare are provided on an 'as is' basis. PureCare makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
              <p className="mt-4">
                Further, PureCare does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Limitations</h2>
              <p>
                In no event shall PureCare or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on PureCare, even if PureCare or a PureCare authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Accuracy of Materials</h2>
              <p>
                The materials appearing on PureCare could include technical, typographical, or photographic errors. PureCare does not warrant that any of the materials on its website are accurate, complete or current. PureCare may make changes to the materials contained on its website at any time without notice. However, PureCare does not make any commitment to update the materials.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Links</h2>
              <p>
                PureCare has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by PureCare of the site. Use of any such linked website is at the user's own risk.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Modifications</h2>
              <p>
                PureCare may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Data Protection and Privacy</h2>
              <p>
                PureCare takes the protection of your data very seriously. Please see our <a href="/privacy" className="text-primary underline">Privacy Policy</a> for more information on how we collect, use, and protect your data.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Governing Law</h2>
              <p>
                These terms and conditions are governed by and construed in accordance with the laws of the United States and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. Contact Information</h2>
              <p>
                If you have any questions about these Terms, please contact us at:
              </p>
              <p className="mt-2">
                Email: <a href="mailto:legal@purecare.health" className="text-primary">legal@purecare.health</a><br />
                Address: 123 Healthcare Ave, Suite 101, Medical District, CA 90210<br />
                Phone: +1 (555) 123-4567
              </p>
            </section>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Terms; 