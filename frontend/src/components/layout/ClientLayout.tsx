"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import MobileNav from './MobileNav';
import MarketTicker from '../trend/MarketTicker';

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

  // Auth paths get completely isolated (no navbar, no ticker, no mesh)
  const authPaths = ['/login', '/register', '/forgot-password', '/reset-password'];
  const isAuthPage = authPaths.some(p => (pathname || '').startsWith(p));

  // Paths where Sidebar should NOT be shown
  const noSidebarPaths = ['/', '/login', '/register', '/forgot-password', '/reset-password'];
  const isLandingOrAuth = noSidebarPaths.includes(pathname || '');
  const isLanding = pathname === '/';
  
  // Only show Sidebar for authenticated users on app routes
  const showSidebar = mounted && isAuthenticated && !isLandingOrAuth;
  
  // Only show Footer on landing page
  const showFooter = mounted && pathname === '/';

  // Check if current route is within messages
  const isMessagesPage = (pathname || '').startsWith('/messages');

  // Auth pages: render children only — the auth layout handles the dark background
  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className={`flex flex-col bg-background text-foreground transition-colors duration-300 relative overflow-x-hidden ${
      isMessagesPage ? 'h-screen overflow-hidden' : 'min-h-screen'
    }`}>
      {/* Dynamic Background */}
      <div className="bg-mesh pointer-events-none">
        <div className="absolute inset-0 mesh-gradient" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-500/10 blur-[120px] animate-blob" />
        <div className="absolute bottom-[10%] right-[-10%] w-[35%] h-[45%] rounded-full bg-secondary-500/10 blur-[120px] animate-blob delay-2000" />
      </div>

      {!isLanding && (
        <div className="shrink-0">
          <Navbar />
        </div>
      )}
      {!isLanding && (
        <div className="shrink-0">
          <MarketTicker />
        </div>
      )}
      <div className={`flex-1 flex flex-col lg:flex-row relative ${
        isMessagesPage ? 'min-h-0 overflow-hidden' : ''
      }`}>
        {showSidebar && <Sidebar />}
        <main className={`flex-1 flex flex-col ${showSidebar ? 'lg:ps-0' : ''} ${
          isMessagesPage ? 'min-h-0 overflow-hidden' : ''
        }`}>
          {children}
          {/* Bottom padding on mobile for the fixed nav bar */}
          {!isLandingOrAuth && !isMessagesPage && (
            <div className="h-20 lg:hidden" />
          )}
        </main>
      </div>
      {showFooter && <Footer />}
      {/* Mobile Bottom Navigation */}
      {mounted && !isLandingOrAuth && <MobileNav />}
    </div>
  );
};

export default ClientLayout;
