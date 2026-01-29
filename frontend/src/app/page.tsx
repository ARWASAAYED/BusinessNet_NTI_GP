"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/feed");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative py-24 lg:py-40 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-4 py-1.5 mb-8 text-sm font-semibold tracking-wide text-primary-600 dark:text-primary-400 uppercase bg-primary-50 dark:bg-primary-900/30 rounded-full border border-primary-200 dark:border-primary-800">
              AI-Powered Professional Network
            </div>
            <h1 className="text-6xl lg:text-8xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 font-heading mb-8 leading-tight">
              Connect the <span className="gradient-text">Future of Business</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-500 dark:text-gray-400 mb-12 leading-relaxed max-w-2xl mx-auto">
              Join a global ecosystem of industry leaders, innovators, and entrepreneurs scale their professional presence.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/register">
                <Button size="lg" className="h-16 px-12 text-xl rounded-2xl w-full sm:w-auto">
                  Start Growing Now
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="h-16 px-12 text-xl rounded-2xl w-full sm:w-auto">
                  Explore Platform
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Animated Background Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-0 pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[120px] animate-blob"></div>
          <div className="absolute top-1/3 -right-20 w-[500px] h-[500px] bg-secondary-500/10 rounded-full blur-[120px] animate-blob delay-2000"></div>
          <div className="absolute -bottom-20 left-1/3 w-[550px] h-[550px] bg-blue-500/10 rounded-full blur-[120px] animate-blob delay-4000"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div className="max-w-2xl">
              <h2 className="text-4xl lg:text-5xl font-bold font-heading mb-6 tracking-tight text-gray-900 dark:text-gray-100">
                The ultimate toolkit for <br/>professional growth
              </h2>
              <p className="text-lg text-gray-500 dark:text-gray-400">
                We provide the infrastructure so you can focus on building meaningful business relationships.
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            <Card 
              title="Business Profiles" 
              subtitle="Verified Presence"
              className="p-6"
            >
              <div className="mb-4 w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed mt-4">Showcase your services with high-fidelity profiles, track your reputation points, and earn industry verification badges.</p>
            </Card>
            <Card 
              title="Smart Communities" 
              subtitle="Industry Circles"
              className="p-6"
            >
              <div className="mb-4 w-16 h-16 rounded-2xl bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center">
                <svg className="w-8 h-8 text-secondary-600 dark:text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed mt-4">Join specialized groups optimized with AI to match you with peers, knowledge bases, and collaborative projects.</p>
            </Card>
            <Card 
              title="Real-time Insights" 
              subtitle="AI Analytics"
              className="p-6"
            >
              <div className="mb-4 w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed mt-4">Stay ahead with live trend predictions, sentiment analysis, and personalized strategy recommendations.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Image Showcase Section */}
      <section className="py-24 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold font-heading mb-6 tracking-tight text-gray-900 dark:text-gray-100">
                Connect with Industry Leaders
              </h2>
              <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                Build meaningful professional relationships, discover new opportunities, and grow your network with our AI-powered platform designed for modern businesses.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Global Network</h3>
                    <p className="text-gray-500 dark:text-gray-400">Connect with professionals from over 50+ countries worldwide</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-secondary-600 dark:text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">AI-Powered Matching</h3>
                    <p className="text-gray-500 dark:text-gray-400">Smart algorithms help you find the right connections and opportunities</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Secure & Verified</h3>
                    <p className="text-gray-500 dark:text-gray-400">Enterprise-grade security with verified business profiles</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <div className="aspect-[4/3] bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                  <div className="text-center p-8 text-white">
                    <svg className="w-32 h-32 mx-auto mb-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <h3 className="text-2xl font-bold mb-2">Professional Network</h3>
                    <p className="text-primary-100">Connecting businesses worldwide</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-secondary-500/20 rounded-full blur-3xl -z-10"></div>
              <div className="absolute -top-6 -left-6 w-48 h-48 bg-primary-500/20 rounded-full blur-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white dark:bg-gray-950 relative overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl lg:text-6xl font-bold mb-8 text-gray-900 dark:text-gray-100">
            Ready to revolutionize your <br/><span className="gradient-text">professional journey?</span>
          </h2>
          <p className="text-xl text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Join thousands of professionals already growing their network and business on our platform.
          </p>
          <Link href="/register">
            <Button size="lg" className="px-12 py-6 text-lg rounded-2xl">
              Create Your Free Account
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
