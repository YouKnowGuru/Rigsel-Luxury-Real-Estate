"use client";

import { useState, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

/* ============================================================
   SCROLL TO TOP — Apple-style floating action button
   Design Principles:
   • Appears after scrolling down
   • Glassmorphic circular button
   • Smooth scroll behavior
   • Respects reduced motion preference
   • Touch-friendly ≥ 44px
   ============================================================ */

export const ScrollToTop = memo(function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Show button after scrolling 400px
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial state

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: shouldReduceMotion ? "auto" : "smooth",
    });
  }, [shouldReduceMotion]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={shouldReduceMotion ? {} : { opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          onClick={scrollToTop}
          className={cn(
            "fixed bottom-5 left-5 sm:bottom-8 sm:left-8 z-40",
            "w-12 h-12 sm:w-14 sm:h-14",
            "rounded-full",
            "bg-white/80 dark:bg-ink-800/80",
            "backdrop-blur-xl",
            "border border-ink-200/60 dark:border-ink-700/40",
            "shadow-elevated",
            "flex items-center justify-center",
            "text-foreground",
            "hover:bg-white dark:hover:bg-ink-700",
            "hover:shadow-product",
            "hover:-translate-y-0.5",
            "active:scale-95",
            "transition-all duration-fast",
            "no-tap",
            "outline-none focus-visible:ring-2 focus-visible:ring-sky/50 focus-visible:ring-offset-2"
          )}
          aria-label="Scroll to top"
          title="Scroll to top"
        >
          <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.75} />
        </motion.button>
      )}
    </AnimatePresence>
  );
});
