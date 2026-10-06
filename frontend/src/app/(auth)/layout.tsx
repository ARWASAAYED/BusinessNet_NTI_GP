"use client";
import React from 'react';
import { useLanguage } from '@/components/layout/LanguageProvider';

function AuthBranding() {
  const { t } = useLanguage();
  return (
    <div className="absolute top-8 left-8 z-20 flex items-center gap-2.5">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
      </div>
      <span className="text-white font-bold text-lg tracking-tight">{t('app.name')}</span>
    </div>
  );
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dark min-h-screen relative flex items-center justify-center overflow-hidden bg-gray-950">
      {/* Premium Dark Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Deep gradient base */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-[#0d1020] to-gray-900" />
        {/* Glowing orbs */}
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-primary-600 rounded-full opacity-[0.12] blur-[120px] animate-pulse" />
        <div className="absolute top-[-5%] right-[-10%] w-[450px] h-[450px] bg-secondary-600 rounded-full opacity-[0.10] blur-[100px] animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute bottom-[-15%] left-[20%] w-[500px] h-[500px] bg-indigo-700 rounded-full opacity-[0.08] blur-[130px] animate-pulse" style={{ animationDelay: '3s' }} />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Branding watermark */}
      <AuthBranding />
      
      {/* Content */}
      <div className="relative z-10 w-full px-4 py-16">
        {children}
      </div>
    </div>
  );
}
