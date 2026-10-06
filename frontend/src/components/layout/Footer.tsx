"use client";

import React from 'react';
import Link from 'next/link';
import { Github, Twitter, Linkedin, Mail, Heart, ShieldCheck, Sparkles, Building2 } from 'lucide-react';
import { useLanguage } from './LanguageProvider';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { t, isRTL } = useLanguage();

  const footerLinks = {
    product: [
      { name: t('footer.features') || 'Platform Features', href: '/#features' },
      { name: t('footer.battles') || 'Industry Battles', href: '/battles' },
      { name: t('footer.trending') || 'Market Trends', href: '/trending' },
      { name: t('footer.dashboard') || 'Business Dashboard', href: '/dashboard' },
    ],
    company: [
      { name: t('footer.about') || 'About Us', href: '/about' },
      { name: t('footer.news') || 'Platform News', href: '/news' },
      { name: t('footer.careers') || 'Careers', href: '/about' },
      { name: t('footer.contact') || 'Contact Us', href: 'mailto:contact@mada.network' },
    ],
    resources: [
      { name: t('footer.communities') || 'Communities', href: '/communities' },
      { name: t('footer.directory') || 'Business Directory', href: '/search' },
      { name: t('footer.promotions') || 'Ad Packages & Reach', href: '/promotions' },
      { name: t('footer.support') || 'Support & Help', href: '/about' },
    ],
    legal: [
      { name: t('footer.privacy') || 'Privacy Policy', href: '/privacy' },
      { name: t('footer.terms') || 'Terms of Service', href: '/terms' },
      { name: t('footer.cookies') || 'Cookie Policy', href: '/privacy' },
      { name: t('footer.security') || 'Trust & Security', href: '/about' },
    ],
  };

  const socialLinks = [
    { icon: Github, href: 'https://github.com', label: 'GitHub' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:contact@mada.network', label: 'Email' },
  ];

  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary-600 via-primary-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-primary-500/25 group-hover:scale-105 transition-transform font-black text-xl">
                {t('app.letter') || 'M'}
              </div>
              <span className="text-xl font-black bg-gradient-to-r from-gray-900 via-primary-900 to-primary-600 dark:from-white dark:via-gray-100 dark:to-primary-400 bg-clip-text text-transparent">
                {t('app.name') || 'MADA'}
              </span>
            </Link>

            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm">
              {t('footer.description') || 'Connecting ambitious founders, verified enterprises, and industry leaders through transparent reputation and high-trust deal discovery.'}
            </p>

            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-3 py-1.5 rounded-full w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Enterprise Network</span>
            </div>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {/* Product */}
            <div>
              <h3 className="text-xs font-black text-gray-900 dark:text-gray-100 uppercase tracking-widest mb-4">
                {t('footer.product') || 'Product'}
              </h3>
              <ul className="space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm font-medium"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-xs font-black text-gray-900 dark:text-gray-100 uppercase tracking-widest mb-4">
                {t('footer.company') || 'Company'}
              </h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm font-medium"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-xs font-black text-gray-900 dark:text-gray-100 uppercase tracking-widest mb-4">
                {t('footer.resources') || 'Resources'}
              </h3>
              <ul className="space-y-3">
                {footerLinks.resources.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm font-medium"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-xs font-black text-gray-900 dark:text-gray-100 uppercase tracking-widest mb-4">
                {t('footer.legal') || 'Legal'}
              </h3>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm font-medium"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
            © {currentYear} {t('app.name') || 'MADA'}. {t('footer.allRights') || 'All rights reserved.'}
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline-flex items-center gap-1">
              {t('footer.madeWith') || 'Engineered for verified professional excellence'}
              <Heart className="w-3.5 h-3.5 text-error-500 fill-current inline" />
            </span>
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-2">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="p-2.5 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-xl transition-all"
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
