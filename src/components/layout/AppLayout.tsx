import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import MinimalFooter from './MinimalFooter';
import { useAuth } from '@/lib/auth/AuthContext';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      {user ? <MinimalFooter /> : <Footer />}
    </div>
  );
};

export default AppLayout; 