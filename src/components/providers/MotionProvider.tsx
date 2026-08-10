"use client";

import { useEffect } from "react";
import { LazyMotion, domAnimation } from "framer-motion";

/**
 * MotionProvider — loads framer-motion's animation feature set lazily.
 * domAnimation covers all patterns used across the site:
 *   • motion.* entrance/exit animations
 *   • AnimatePresence (page transitions, overlays)
 *   • whileInView / viewport triggers
 *   • layoutId spring animations (Navbar pill indicator)
 *
 * domMax was swapped out — it adds drag gestures and advanced layout
 * features that are unused, adding ~25–30KB gzip for no benefit.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  // Patch: Framer Motion v11 calls releasePointerCapture after the pointer
  // is already released, throwing a harmless NotFoundError. (framer/motion#2765)
  useEffect(() => {
    const original = Element.prototype.releasePointerCapture;
    Element.prototype.releasePointerCapture = function (pointerId: number) {
      try {
        original.call(this, pointerId);
      } catch (e) {
        // Silently ignore — pointer was already released
      }
    };
    return () => {
      Element.prototype.releasePointerCapture = original;
    };
  }, []);

  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}
