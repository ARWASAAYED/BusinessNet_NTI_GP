"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import ThemeToggle from "@/components/common/ThemeToggle";
import LanguageToggle from "@/components/common/LanguageToggle";
import { useLanguage } from "@/components/layout/LanguageProvider";
import {
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  MessageSquare,
  Zap,
  BarChart3,
  Building2,
  Target,
  Menu,
  X,
  Compass,
  Share2,
  CheckCircle2,
  Sparkles,
  ThumbsUp,
  Bookmark,
  Swords,
  Calculator,
  Activity,
  Award
} from "lucide-react";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const stagger: Variants = {
  visible: { transition: { staggerChildren: 0.12 } },
};

function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      dir={isRTL ? "rtl" : "ltr"}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 dark:bg-gray-950/95 backdrop-blur-md shadow-sm border-b border-gray-200/80 dark:border-gray-800"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-2.5 bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 rounded-xl group-hover:scale-105 transition-transform shadow-md shadow-indigo-500/20">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
              {t("app.name")}
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6 font-semibold text-sm">
            <Link href="/feed" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1.5 transition-colors">
              <Compass className="w-4 h-4 text-blue-500" />
              <span>{t("nav.exploreFeed")}</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 uppercase">{t("nav.live")}</span>
            </Link>
            <a href="#features" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t("landing.features")}</a>
            <a href="#arena" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1">
              <Swords className="w-3.5 h-3.5 text-amber-500" />
              <span>{t("landing.duels")}</span>
            </a>
            <a href="#roi-calculator" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1">
              <Calculator className="w-3.5 h-3.5 text-emerald-500" />
              <span>{t("landing.simulator")}</span>
            </a>
            <a href="#network" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t("landing.network")}</a>
            <div className="flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-gray-800">
              <LanguageToggle />
              <ThemeToggle />
            </div>
            <Link href="/login" className="text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-bold">{t("nav.signIn")}</Link>
            <Link href="/register" className="px-5 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all shadow-md shadow-indigo-500/25 active:scale-95 font-bold">{t("landing.startTrial")}</Link>
          </div>

          <div className="md:hidden flex items-center gap-3">
            <LanguageToggle />
            <ThemeToggle />
            <button className="p-2 text-gray-700 dark:text-gray-200" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle Navigation">
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 p-5 space-y-3 shadow-xl">
          <Link href="/feed" className="flex items-center gap-2 py-2 text-blue-600 dark:text-blue-400 font-bold" onClick={() => setMobileOpen(false)}>
            <Compass className="w-4 h-4" />
            <span>{t("landing.exploreGuest")}</span>
          </Link>
          <a href="#features" className="block py-2 text-gray-700 dark:text-gray-300 font-medium" onClick={() => setMobileOpen(false)}>{t("landing.features")}</a>
          <a href="#arena" className="block py-2 text-gray-700 dark:text-gray-300 font-medium" onClick={() => setMobileOpen(false)}>{t("landing.industryDuels")}</a>
          <a href="#roi-calculator" className="block py-2 text-gray-700 dark:text-gray-300 font-medium" onClick={() => setMobileOpen(false)}>{t("landing.dealSimulator")}</a>
          <Link href="/login" className="block py-2 text-gray-800 dark:text-gray-200 font-bold" onClick={() => setMobileOpen(false)}>{t("nav.signIn")}</Link>
          <Link href="/register" className="block py-3 text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-md" onClick={() => setMobileOpen(false)}>{t("landing.startTrial")}</Link>
        </div>
      )}
    </nav>
  );
}

function Hero() {
  const { t, isRTL } = useLanguage();
  return (
    <section dir={isRTL ? "rtl" : "ltr"} className="relative pt-32 pb-20 lg:pt-44 lg:pb-32 overflow-hidden bg-gradient-to-b from-blue-50/60 via-white to-white dark:from-gray-950 dark:via-gray-950 dark:to-gray-900">
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 -z-10 pointer-events-none">
        <div className="absolute top-0 right-16 w-96 h-96 bg-blue-500/15 dark:bg-blue-500/20 rounded-full blur-[110px]" />
        <div className="absolute bottom-0 left-16 w-96 h-96 bg-purple-500/15 dark:bg-purple-500/20 rounded-full blur-[110px]" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <motion.div className="lg:col-span-7 text-center lg:text-start" initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200/90 dark:border-blue-800/80 text-blue-700 dark:text-blue-300 text-xs font-black uppercase tracking-wider mb-6 shadow-sm backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>{t("landing.badge")}</span>
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-950 dark:text-white leading-[1.12] mb-6 tracking-tight">
              {t("landing.heroTitle")} <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">{t("landing.heroHighlight")}</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">{t("landing.heroSubtitle")}</motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/register" className="px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-black text-base rounded-2xl flex items-center justify-center gap-2.5 shadow-xl shadow-indigo-500/25 transition-all hover:-translate-y-0.5 active:scale-95">
                <span>{t("landing.startTrial")}</span>
                <ArrowRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
              </Link>
              <Link href="/feed" className="px-8 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 text-gray-800 dark:text-gray-100 font-bold text-base rounded-2xl flex items-center justify-center gap-2.5 transition-all hover:bg-gray-50 dark:hover:bg-gray-800/60 shadow-sm">
                <Compass className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>{t("landing.exploreLive")}</span>
              </Link>
            </motion.div>
            <motion.div variants={fadeInUp} className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-gray-500 dark:text-gray-400 font-semibold">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> {t("landing.trust1")}</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> {t("landing.trust2")}</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> {t("landing.trust3")}</span>
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.8 }} className="lg:col-span-5 relative">
            <div className="relative bg-white dark:bg-gray-900/95 rounded-3xl shadow-2xl border border-gray-200/90 dark:border-gray-800 p-6 space-y-5 backdrop-blur-xl">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white font-black flex items-center justify-center text-sm shadow-md">AC</div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-sm text-gray-950 dark:text-white">Apex Capital Partners</h4>
                      <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{t("landing.demoMeta")}</p>
                  </div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-full">{t("landing.dealClosed")}</span>
              </div>
              <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed font-normal">{t("landing.demoPost")}</p>
              <div className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700/60 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                    <span className="font-bold text-gray-800 dark:text-gray-200">{t("landing.aiScore")}</span>
                  </div>
                  <span className="font-black text-emerald-600 dark:text-emerald-400">{t("landing.highPrecision")}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full w-[98%] rounded-full" />
                </div>
                <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 pt-1 font-medium">
                  <span className="flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5 text-emerald-500" />{t("landing.networkVelocity")}</span>
                  <span>{t("landing.qualified")}</span>
                </div>
              </div>
              <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 font-semibold">
                <button className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold hover:scale-105 transition-transform">
                  <ThumbsUp className="w-4 h-4 fill-current" /><span>{t("landing.upvotes")}</span>
                </button>
                <span className="flex items-center gap-1.5"><MessageSquare className="w-4 h-4" /><span>{t("landing.commentsCount")}</span></span>
                <span className="flex items-center gap-1.5"><Share2 className="w-4 h-4" /><span>{t("landing.sharesCount")}</span></span>
                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><Bookmark className="w-4 h-4" /></button>
              </div>
              <div className="pt-3 border-t border-dashed border-gray-200 dark:border-gray-800/80 flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full bg-purple-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">ER</div>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-2.5 flex-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 dark:text-gray-100">{t("landing.commentMeta")}</span>
                    <span className="text-[10px] text-gray-400">1h ago</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">{t("landing.commentBody")}</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-4 bg-white dark:bg-gray-800/95 px-4 py-2.5 rounded-2xl shadow-xl border border-gray-200/90 dark:border-gray-700/80 flex items-center gap-2.5 text-xs font-bold backdrop-blur-md">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
              <span className="text-gray-900 dark:text-gray-100">{t("landing.activeMakers")}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FeatureSection() {
  const { t, isRTL } = useLanguage();
  const features = [
    { icon: Target, badge: t("landing.feat1Badge"), title: t("landing.feat1Title"), description: t("landing.feat1Desc") },
    { icon: BarChart3, badge: t("landing.feat2Badge"), title: t("landing.feat2Title"), description: t("landing.feat2Desc") },
    { icon: MessageSquare, badge: t("landing.feat3Badge"), title: t("landing.feat3Title"), description: t("landing.feat3Desc") },
  ];
  return (
    <section id="features" dir={isRTL ? "rtl" : "ltr"} className="py-24 lg:py-32 bg-gray-50/70 dark:bg-gray-900/40 border-y border-gray-200/80 dark:border-gray-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3.5 py-1.5 rounded-full border border-blue-200 dark:border-blue-900/50">{t("landing.archBadge")}</span>
          <h2 className="text-3xl sm:text-5xl font-black mt-4 text-gray-950 dark:text-white tracking-tight">
            {t("landing.engineered")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{t("landing.b2bScale")}</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mt-4 leading-relaxed">{t("landing.everyTool")}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div key={i} whileHover={{ y: -6 }} className="p-8 bg-white dark:bg-gray-900/90 rounded-3xl shadow-sm border border-gray-200/80 dark:border-gray-800 text-start hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 bg-blue-50 dark:bg-blue-950/60 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40"><f.icon className="w-7 h-7" /></div>
                <span className="text-[10px] font-black uppercase tracking-widest bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full">{f.badge}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-950 dark:text-white mb-3">{f.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BattleSpotlight() {
  const { t, isRTL } = useLanguage();
  const [challengerVotes, setChallengerVotes] = useState(148);
  const [challengedVotes, setChallengedVotes] = useState(112);
  const [votedSide, setVotedSide] = useState<'challenger' | 'challenged' | null>(null);

  const total = challengerVotes + challengedVotes;
  const p1 = Math.round((challengerVotes / total) * 100);
  const p2 = 100 - p1;

  const handleVote = (side: 'challenger' | 'challenged') => {
    if (votedSide === side) return;
    if (votedSide === 'challenger' && side === 'challenged') { setChallengerVotes(v => v - 1); setChallengedVotes(v => v + 1); }
    else if (votedSide === 'challenged' && side === 'challenger') { setChallengedVotes(v => v - 1); setChallengerVotes(v => v + 1); }
    else if (side === 'challenger') { setChallengerVotes(v => v + 1); }
    else { setChallengedVotes(v => v + 1); }
    setVotedSide(side);
  };

  return (
    <section id="arena" dir={isRTL ? "rtl" : "ltr"} className="py-24 bg-white dark:bg-gray-950 border-b border-gray-200/80 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/80 text-amber-700 dark:text-amber-400 text-xs font-black uppercase tracking-wider mb-4">
            <Swords className="w-4 h-4 text-amber-500" />
            <span>{t("landing.arenaBadge")}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-gray-950 dark:text-white tracking-tight">
            {t("landing.debateDecide")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-red-500">{t("landing.liveDuels")}</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mt-4 leading-relaxed">{t("landing.arenaSubtitle")}</p>
        </div>

        <div className="max-w-4xl mx-auto bg-gradient-to-br from-gray-50 to-white dark:from-gray-900/90 dark:to-gray-950 rounded-3xl p-6 sm:p-10 border border-gray-200 dark:border-gray-800 shadow-xl relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-200/80 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-full text-xs font-black uppercase tracking-widest">{t("landing.productUx")}</span>
              <span className="text-xs font-bold text-gray-500 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                {t("landing.liveDebate")}
              </span>
            </div>
            <Link href="/battles" className="text-xs font-black text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
              <span>{t("landing.viewDuels")}</span>
              <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? "rotate-180" : ""}`} />
            </Link>
          </div>

          <div className="my-8 text-center">
            <h3 className="text-2xl sm:text-3xl font-black text-gray-950 dark:text-white">{t("landing.duelTopic")}</h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium">"{t("landing.duelQuestion")}"</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 relative items-stretch mb-8">
            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white dark:bg-gray-950 border-4 border-amber-500 items-center justify-center font-black text-amber-600 text-sm shadow-xl z-10">VS</div>
            <div className={`p-6 rounded-2xl border transition-all ${votedSide === 'challenger' ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 ring-2 ring-blue-500/20' : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/60'}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center text-sm shadow-md">AR</div>
                <div><h4 className="font-bold text-sm text-gray-950 dark:text-white">Alex Rivera</h4><p className="text-[10px] text-gray-400 font-semibold uppercase">Head of Design - CloudFlow</p></div>
              </div>
              <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed italic mb-6">"Users crave breathing room. Simplicity eliminates decision paralysis and cuts daily task completion times by 40%."</p>
              <button onClick={() => handleVote('challenger')} className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${votedSide === 'challenger' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-gray-100 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-800 dark:text-gray-200 hover:text-blue-600'}`}>
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{votedSide === 'challenger' ? t("common.confirm") : t("landing.supportSimplicity")}</span>
              </button>
            </div>
            <div className={`p-6 rounded-2xl border transition-all ${votedSide === 'challenged' ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30 ring-2 ring-amber-500/20' : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/60'}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-black flex items-center justify-center text-sm shadow-md">SC</div>
                <div><h4 className="font-bold text-sm text-gray-950 dark:text-white">Sarah Chen</h4><p className="text-[10px] text-gray-400 font-semibold uppercase">VP Analytics - DataSync</p></div>
              </div>
              <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed italic mb-6">"Power users demand immediate context. Navigating multi-page tabs slows operators down; high-density layouts empower mastery."</p>
              <button onClick={() => handleVote('challenged')} className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${votedSide === 'challenged' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' : 'bg-gray-100 dark:bg-gray-800 hover:bg-amber-50 dark:hover:bg-amber-900/30 text-gray-800 dark:text-gray-200 hover:text-amber-500'}`}>
                <Zap className="w-3.5 h-3.5" />
                <span>{votedSide === 'challenged' ? t("common.confirm") : t("landing.backDensity")}</span>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200/80 dark:border-gray-800">
            <div className="flex justify-between items-center text-xs font-bold mb-2">
              <span className="text-blue-600 dark:text-blue-400 font-black">{t("landing.simplicityPct").replace("{p}", String(p1)).replace("{v}", String(challengerVotes))}</span>
              <span className="text-amber-500 font-black">{t("landing.densityPct").replace("{p}", String(p2)).replace("{v}", String(challengedVotes))}</span>
            </div>
            <div className="w-full h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden flex">
              <div style={{ width: `${p1}%` }} className="bg-blue-600 transition-all duration-500 h-full" />
              <div style={{ width: `${p2}%` }} className="bg-amber-500 transition-all duration-500 h-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DealSimulator() {
  const { t, isRTL } = useLanguage();
  const [prospects, setProspects] = useState(15);
  const [sector, setSector] = useState<'tech' | 'fintech' | 'saas' | 'agency'>('saas');

  const sectorData = {
    tech: { nameKey: "landing.sectorTech", avgDeal: 45000, conversion: 0.18 },
    fintech: { nameKey: "landing.sectorFintech", avgDeal: 32000, conversion: 0.22 },
    saas: { nameKey: "landing.sectorSaas", avgDeal: 18000, conversion: 0.20 },
    agency: { nameKey: "landing.sectorAgency", avgDeal: 10000, conversion: 0.25 },
  };

  const current = sectorData[sector];
  const dealsClosed = Math.max(1, Math.round(prospects * current.conversion));
  const pipelineValue = prospects * Math.round(current.avgDeal * 0.45);
  const monthlyRevenue = dealsClosed * current.avgDeal;
  const hoursSaved = Math.round(prospects * 2.8);

  return (
    <section id="roi-calculator" dir={isRTL ? "rtl" : "ltr"} className="py-24 bg-gray-50/70 dark:bg-gray-900/40 border-b border-gray-200/80 dark:border-gray-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-400 text-xs font-black uppercase tracking-wider mb-4">
            <Calculator className="w-4 h-4 text-emerald-500" />
            <span>{t("landing.roiBadge")}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-gray-950 dark:text-white tracking-tight">
            {t("landing.calculate")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500">{t("landing.revenueGrowth")}</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mt-4 leading-relaxed">{t("landing.roiSubtitle")}</p>
        </div>
        <div className="max-w-5xl mx-auto grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 bg-white dark:bg-gray-900/90 p-8 rounded-3xl border border-gray-200/90 dark:border-gray-800 shadow-md space-y-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">{t("landing.industrySector")}</label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(sectorData) as Array<keyof typeof sectorData>).map((key) => (
                  <button key={key} onClick={() => setSector(key)} className={`p-3 rounded-xl text-xs font-bold transition-all text-start border ${sector === key ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300' : 'border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                    {t(sectorData[key].nameKey)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">{t("landing.targetInquiries")}</label>
                <span className="text-base font-black text-emerald-600 dark:text-emerald-400">{t("landing.inquiries").replace("{n}", String(prospects))}</span>
              </div>
              <input type="range" min="5" max="50" step="1" value={prospects} onChange={(e) => setProspects(Number(e.target.value))} className="w-full accent-emerald-500 h-2 bg-gray-200 dark:bg-gray-800 rounded-lg cursor-pointer" />
              <div className="flex justify-between text-[10px] text-gray-400 font-bold mt-1">
                <span>{t("landing.early")}</span><span>{t("landing.growth")}</span><span>{t("landing.enterprise")}</span>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center gap-3 text-xs text-gray-500">
              <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>{t("landing.calculatedOn")}</span>
            </div>
          </div>
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="p-6 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-3xl shadow-xl col-span-2">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-100">{t("landing.projected")}</span>
              <div className="text-4xl sm:text-5xl font-black mt-2 tracking-tight">${monthlyRevenue.toLocaleString()}</div>
              <p className="text-xs text-emerald-100 mt-2 font-medium">{t("landing.fromDeals").replace("{n}", String(dealsClosed)).replace("{avg}", current.avgDeal.toLocaleString())}</p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-900/90 rounded-3xl border border-gray-200/90 dark:border-gray-800 shadow-sm">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{t("landing.pipeline")}</span>
              <div className="text-2xl font-black text-gray-950 dark:text-white mt-1">${pipelineValue.toLocaleString()}</div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 mt-1"><TrendingUp className="w-3.5 h-3.5" /> {t("landing.highIntent")}</span>
            </div>
            <div className="p-6 bg-white dark:bg-gray-900/90 rounded-3xl border border-gray-200/90 dark:border-gray-800 shadow-sm">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{t("landing.hoursSaved")}</span>
              <div className="text-2xl font-black text-gray-950 dark:text-white mt-1">{t("landing.hrsMo").replace("{n}", String(hoursSaved))}</div>
              <span className="text-[11px] text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1 mt-1"><Zap className="w-3.5 h-3.5" /> {t("landing.zeroCold")}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LiveActivityPulse() {
  const { t, isRTL } = useLanguage();
  const events = [
    { titleKey: "landing.ev1Title", metaKey: "landing.ev1Meta", icon: Award },
    { titleKey: "landing.ev2Title", metaKey: "landing.ev2Meta", icon: Swords },
    { titleKey: "landing.ev3Title", metaKey: "landing.ev3Meta", icon: ShieldCheck },
    { titleKey: "landing.ev4Title", metaKey: "landing.ev4Meta", icon: CheckCircle2 },
  ];
  return (
    <section dir={isRTL ? "rtl" : "ltr"} className="py-16 bg-white dark:bg-gray-950 border-b border-gray-200/80 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-blue-600 rounded-xl text-white shadow-md shadow-blue-500/20"><Activity className="w-5 h-5 animate-pulse" /></div>
          <div>
            <h3 className="text-lg font-black text-gray-950 dark:text-white">{t("landing.pulseTitle")}</h3>
            <p className="text-xs text-gray-500 font-medium">{t("landing.pulseSubtitle")}</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {events.map((ev, i) => (
            <div key={i} className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200/80 dark:border-gray-800 hover:border-blue-500/50 transition-all flex items-start gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-950/60 rounded-xl text-blue-600 dark:text-blue-400 shrink-0"><ev.icon className="w-4 h-4" /></div>
              <div>
                <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100">{t(ev.titleKey)}</h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">{t(ev.metaKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function NetworkCTA() {
  const { t, isRTL } = useLanguage();
  return (
    <section id="network" dir={isRTL ? "rtl" : "ltr"} className="py-24 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <h2 className="text-3xl sm:text-5xl font-black mb-5 tracking-tight">{t("landing.ctaTitle")}</h2>
        <p className="text-base sm:text-xl mb-10 text-white/90 max-w-2xl mx-auto font-normal leading-relaxed">{t("landing.ctaSubtitle")}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register" className="px-8 py-4 bg-white text-blue-700 hover:bg-gray-50 font-black text-base rounded-2xl shadow-xl transition-all hover:scale-105 inline-block">{t("landing.startTrial")}</Link>
          <Link href="/feed" className="px-8 py-4 bg-white/15 hover:bg-white/20 text-white font-bold text-base rounded-2xl border border-white/30 transition-all inline-block backdrop-blur-sm">{t("landing.exploreLive")}</Link>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const { t, isRTL } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) router.push("/feed");
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 selection:bg-blue-500 selection:text-white">
      <LandingNavbar />
      <Hero />
      <LiveActivityPulse />
      <BattleSpotlight />
      <FeatureSection />
      <DealSimulator />
      <NetworkCTA />
    </main>
  );
}
