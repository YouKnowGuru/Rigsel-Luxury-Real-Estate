"use client";

import { LazyMotion, domMax } from "framer-motion";

/**
 * MotionProvider — loads framer-motion's full feature set lazily.
 * domMax is needed for AnimatePresence (page transitions) to work correctly.
 * The bundle is still loaded asynchronously — no SSR penalty.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <LazyMotion features={domMax}>{children}</LazyMotion>;
}
