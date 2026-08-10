"use client";

import { motion, useReducedMotion } from "framer-motion";
import { PhojaaA1Icon } from "@/components/chat/PhojaaA1Icon";
import { cn } from "@/lib/utils";

type PhojaaA1FabProps = {
  onClick: () => void;
  className?: string;
  hidden?: boolean;
};

export function PhojaaA1Fab({ onClick, className, hidden }: PhojaaA1FabProps) {
  const reduceMotion = useReducedMotion();

  if (hidden) return null;

  return (
    <div
      className={cn(
        "fixed z-[60] flex flex-col items-end gap-2",
        "bottom-4 right-4 sm:bottom-6 sm:right-6",
        className
      )}
      style={{ paddingBottom: "max(0px, env(safe-area-inset-bottom))" }}
    >
      <motion.span
        initial={{ opacity: 0, x: 8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="hidden sm:block pointer-events-none select-none mr-1"
      >
        <span className="inline-flex items-center gap-1.5 rounded-full bg-ink-900/90 text-white text-[11px] font-medium px-3 py-1.5 shadow-product backdrop-blur-md border border-white/10">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
          Ask Phojaa A1
        </span>
      </motion.span>

      <motion.button
        type="button"
        onClick={onClick}
        aria-label="Open Phojaa A1 AI assistant"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={reduceMotion ? undefined : { scale: 1.06 }}
        whileTap={reduceMotion ? undefined : { scale: 0.94 }}
        transition={{ type: "spring", stiffness: 380, damping: 22 }}
        className={cn(
          "group relative no-tap outline-none",
          "focus-visible:ring-2 focus-visible:ring-sky focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        )}
      >
        {/* Soft pulse glow on hover */}
        {!reduceMotion && (
          <span
            className="absolute -inset-1 rounded-full bg-bhutan-gold/20 blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-500"
            aria-hidden
          />
        )}

        {/* Main disc */}
        <span
          className={cn(
            "relative flex items-center justify-center",
            "w-[3.75rem] h-[3.75rem] sm:w-16 sm:h-16 rounded-full",
            "bg-gradient-to-br from-sky via-sky-deep to-[#003d99]",
            "border border-white/25 shadow-[0_10px_40px_-8px_rgba(0,113,227,0.55)]",
            "group-hover:shadow-[0_14px_48px_-6px_rgba(0,113,227,0.65)]",
            "transition-shadow duration-300"
          )}
        >
          {/* Inner gloss */}
          <span
            className="absolute inset-[3px] rounded-full bg-gradient-to-b from-white/30 to-transparent pointer-events-none"
            aria-hidden
          />
          <span
            className="absolute inset-0 rounded-full overflow-hidden pointer-events-none"
            aria-hidden
          >
            <span className="absolute -top-1/2 -left-1/4 w-full h-full bg-white/20 rotate-12 translate-x-2 group-hover:translate-x-4 transition-transform duration-700" />
          </span>

          <PhojaaA1Icon size="xl" className="relative z-10 drop-shadow-sm" />
        </span>
      </motion.button>
    </div>
  );
}

/** Header avatar — matches FAB branding */
export function PhojaaA1Avatar({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative w-10 h-10 rounded-full shrink-0",
        "bg-gradient-to-br from-sky to-sky-deep",
        "border border-white/20 shadow-[0_4px_16px_rgba(0,113,227,0.35)]",
        "flex items-center justify-center overflow-hidden",
        className
      )}
    >
      <span className="absolute inset-0 bg-gradient-to-b from-white/25 to-transparent pointer-events-none" />
      <PhojaaA1Icon size="md" />
    </div>
  );
}
