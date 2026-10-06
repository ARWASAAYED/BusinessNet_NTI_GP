"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ThemeToggle = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />;
  }

  const isDark = (resolvedTheme || theme) === "dark";

  return (
    <button
      type="button"
      dir="ltr"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative w-14 h-8 rounded-full p-1 border border-primary-500/20 glass-effect transition-all flex items-center justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500/40"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      style={{ direction: 'ltr' }}
    >
      <div className="flex items-center justify-between w-full px-1.5 pointer-events-none">
        <Sun className={`w-3.5 h-3.5 transition-opacity duration-300 ${isDark ? 'opacity-30 text-gray-400' : 'opacity-100 text-amber-500'}`} />
        <Moon className={`w-3.5 h-3.5 transition-opacity duration-300 ${isDark ? 'opacity-100 text-primary-400' : 'opacity-30 text-gray-400'}`} />
      </div>
      
      <motion.div
        animate={{ x: isDark ? 24 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-1 left-1 flex items-center justify-center w-6 h-6 rounded-full bg-white dark:bg-primary-500 shadow-md pointer-events-none"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isDark ? "moon" : "sun"}
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 90 }}
            transition={{ duration: 0.15 }}
          >
            {isDark ? (
              <Moon className="w-3.5 h-3.5 text-white" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-amber-500" />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </button>
  );
};

export default ThemeToggle;
