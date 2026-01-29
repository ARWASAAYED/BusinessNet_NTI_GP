"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Paths where Sidebar should NOT be shown
  const noSidebarPaths = ['/', '/login', '/register', '/forgot-password', '/reset-password'];
  const isLandingOrAuth = noSidebarPaths.includes(pathname || '');
  
  // Only show Sidebar for authenticated users on app routes
  const showSidebar = mounted && isAuthenticated && !isLandingOrAuth;
  
  // Only show Footer on landing page
  const showFooter = mounted && pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300 relative overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="bg-mesh">
        <div className="absolute inset-0 mesh-gradient" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-500/10 blur-[120px] animate-blob" />
        <div className="absolute bottom-[10%] right-[-10%] w-[35%] h-[45%] rounded-full bg-secondary-500/10 blur-[120px] animate-blob delay-2000" />
      </div>

      <Navbar />
      <div className="flex-1 flex flex-col lg:flex-row relative z-10">
        {showSidebar && <Sidebar />}
        <main className={`flex-1 ${showSidebar ? 'lg:pl-0' : ''}`}>
          {children}
        </main>
      </div>
      {showFooter && <Footer />}
    </div>
  );
};

export default ClientLayout;
