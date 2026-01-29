import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-secondary-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-accent-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob delay-4000"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 w-full px-4">
        {children}
      </div>
    </div>
  );
}
