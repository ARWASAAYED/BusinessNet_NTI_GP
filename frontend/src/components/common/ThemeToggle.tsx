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

  const isDark = resolvedTheme === "dark";

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative w-14 h-8 rounded-full p-1 border border-primary-500/20 glass-effect transition-all flex items-center justify-between"
      aria-label="Toggle dark/light mode"
    >
      <div className="flex items-center justify-around w-full px-1">
        <Sun className={`w-3.5 h-3.5 transition-opacity duration-300 ${isDark ? 'opacity-40' : 'opacity-100 text-amber-500'}`} />
        <Moon className={`w-3.5 h-3.5 transition-opacity duration-300 ${isDark ? 'opacity-100 text-primary-400' : 'opacity-40'}`} />
      </div>
      
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 700, damping: 30 }}
        className="absolute left-1 flex items-center justify-center w-6 h-6 rounded-full bg-white dark:bg-primary-500 shadow-md"
        animate={{ x: isDark ? 24 : 0 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isDark ? "moon" : "sun"}
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            {isDark ? (
              <Moon className="w-3.5 h-3.5 text-white" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-amber-500" />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
