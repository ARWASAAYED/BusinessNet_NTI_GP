"use client";

import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
  showFooter?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export default function Layout({
  children,
  showSidebar = true,
  showFooter = true,
  maxWidth = 'full',
}: LayoutProps) {
  const maxWidthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full',
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        {showSidebar && (
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
              <Sidebar />
            </div>
          </aside>
        )}

        {/* Page Content */}
        <main className={`flex-1 ${maxWidthClasses[maxWidth]} mx-auto w-full`}>
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>

      {/* Footer */}
      {showFooter && <Footer />}
    </div>
  );
}
