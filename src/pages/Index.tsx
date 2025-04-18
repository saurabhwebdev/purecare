import React from 'react';
import MainLayout from '@/components/layout/MainLayout';

const Index = () => {
  return (
    <MainLayout>
      <section className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
        {/* Subtle gradient background */}
        <div className="absolute inset-0">
          <div className="absolute w-full h-full">
            <div className="absolute top-0 left-1/3 w-[60%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-0 right-1/3 w-[50%] h-[30%] bg-blue-600/10 rounded-full blur-[100px]"></div>
          </div>
          <div className="absolute inset-0 bg-[url('/grid-pattern-dark.svg')] bg-repeat opacity-[0.03]"></div>
        </div>
        
        <div className="text-center z-10 px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Coming <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Soon</span>
              </h1>
          <p className="text-xl text-gray-400 max-w-xl mx-auto">
            We're working on something amazing. Stay tuned for updates!
          </p>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
