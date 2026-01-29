"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import {
  ArrowRight,
  Sparkles,
  Users,
  TrendingUp,
  MessageSquare,
  Zap,
  BarChart3,
  Award,
  Check,
  ChevronRight,
  Play,
  Star,
  Building2,
  Target,
  Rocket,
  Menu,
  X,
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-white/90 dark:bg-gray-950/90 backdrop-blur-md shadow-sm border-b dark:border-gray-800" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-primary-600 rounded-lg group-hover:scale-110 transition-transform">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white">BusinessNet</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 font-semibold">
            <a href="#features" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors">Features</a>
            <a href="#pricing" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors">Pricing</a>
            <Link href="/login" className="text-gray-900 dark:text-white hover:text-primary-600 transition-colors">Sign In</Link>
            <Link href="/register" className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full transition-all shadow-lg shadow-primary-500/20 active:scale-95">Get Started</Link>
          </div>
          <button className="md:hidden text-gray-900 dark:text-white" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary-500/10 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center lg:text-left">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-sm font-bold mb-8">
              <Sparkles className="w-4 h-4" /> AI-POWERED B2B NETWORKING
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-5xl lg:text-7xl font-black text-gray-900 dark:text-white leading-[1.1] mb-8 tracking-tight">
              Scale Your Business <br /> <span className="text-primary-600">Faster Than Ever.</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              The only platform designed for professional growth with real-time analytics, automated lead discovery, and secure B2B messaging.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/register" className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold text-lg rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-primary-500/20 transition-all hover:-translate-y-1">
                Start Free Trial <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="px-8 py-4 bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white font-bold text-lg rounded-2xl hover:border-primary-500 transition-all">
                Book a Demo
              </button>
            </motion.div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="hidden lg:block relative">
            <div className="p-8 bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl border dark:border-gray-800">
               <div className="flex items-center justify-between mb-8">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="text-xs uppercase tracking-widest font-black text-gray-400">ANALYTICS ENGINE V2.0</div>
               </div>
               <div className="grid grid-cols-3 gap-6 mb-8">
                 {[40, 70, 55].map((h, i) => (
                   <div key={i} className="h-32 bg-gray-50 dark:bg-gray-800/50 rounded-xl flex items-end p-2">
                     <div className="w-full bg-primary-500 rounded-lg transition-all duration-1000" style={{ height: `${h}%` }} />
                   </div>
                 ))}
               </div>
               <div className="space-y-4">
                 <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-100 dark:border-primary-800">
                   <div className="flex justify-between items-center text-sm font-bold text-primary-700 dark:text-primary-400 mb-1">
                     <span>Campaign Performance</span>
                     <span>+127%</span>
                   </div>
                   <div className="w-full bg-primary-200 dark:bg-primary-900/40 h-2 rounded-full">
                     <div className="w-[85%] bg-primary-600 h-full rounded-full" />
                   </div>
                 </div>
               </div>
            </div>
            <div className="absolute -top-6 -right-6 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border dark:border-gray-700 animate-bounce">
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) router.push("/feed");
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      <LandingNavbar />
      <Hero />
      <section id="features" className="py-20 lg:py-32 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-black mb-16">The Future of <span className="text-primary-600">B2B Networking</span></h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "AI Insights", text: "Predictive trends and smart matching algorithms built-in." },
              { icon: Target, title: "Promotion Engine", text: "Reach verified businesses with targeted ad credits." },
              { icon: MessageSquare, title: "Real-time Messaging", text: "Enterprise-grade secure chat and document sharing." }
            ].map((f, i) => (
              <div key={i} className="p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border dark:border-gray-800 text-left">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center text-primary-600 mb-6">
                  <f.icon />
                </div>
                <h3 className="text-xl font-bold mb-4">{f.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-black mb-8">Ready to grow your network?</h2>
          <p className="text-xl mb-10 opacity-90">Join 10,000+ businesses scaling their connections every day.</p>
          <Link href="/register" className="px-10 py-5 bg-white text-primary-600 font-black text-xl rounded-2xl shadow-xl hover:scale-105 transition-transform inline-block">
            Join BusinessNet Now
          </Link>
        </div>
      </section>

      <footer className="py-12 border-t dark:border-gray-800 text-center text-gray-500">
        <p>© {new Date().getFullYear()} BusinessNet. Built for the modern professional.</p>
      </footer>
    </main>
  );
}
