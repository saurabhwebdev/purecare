import React from 'react';
import Navbar from './Navbar';
import MinimalFooter from './MinimalFooter';
import { useAuth } from '@/lib/auth/AuthContext';
import { Navigate } from 'react-router-dom';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, loading } = useAuth();

  // If not loading and no user, redirect to sign in
  if (!loading && !user) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-background">
        {loading ? (
          <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          children
        )}
      </main>
      <MinimalFooter />
    </div>
  );
};

export default DashboardLayout; 