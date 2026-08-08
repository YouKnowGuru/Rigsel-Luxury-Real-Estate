import { cn } from "@/lib/utils";

interface GlassBackgroundProps {
  className?: string;
}

/**
 * GlassBackground — the animated mesh/aurora "scene" that lives behind
 * all public-facing pages. Frosted glass surfaces (.glass, .glass-card,
 * .glass-nav, .glass-pill, etc.) blur this layer to produce the
 * glassmorphism / frosted-glass effect.
 *
 * Mounted once in RouteAwareLayout as a fixed, non-interactive layer
 * (z-index: -10) so every non-admin page gets the frosted backdrop.
 * Respects prefers-reduced-motion via the global CSS rule that zeroes
 * animation duration.
 */
export function GlassBackground({ className }: GlassBackgroundProps) {
  return (
    <div aria-hidden className={cn("glass-scene", className)}>
      {/* Aurora colour blobs — drift slowly behind the content.
          Stronger in light mode so glass surfaces have colour to blur;
          dark mode keeps the subtler glow (it already reads as glass). */}
      <div className="absolute rounded-full blur-4xl will-change-transform top-[-12%] left-[-6%] w-[44rem] h-[44rem] bg-sky/30 dark:bg-sky/20 animate-float-slow" />
      <div className="absolute rounded-full blur-4xl will-change-transform top-[18%] right-[-12%] w-[40rem] h-[40rem] bg-bhutan-gold/25 dark:bg-bhutan-gold/15 animate-float-slow [animation-delay:-6s]" />
      <div className="absolute rounded-full blur-4xl will-change-transform bottom-[-18%] left-[18%] w-[42rem] h-[42rem] bg-emerald/20 dark:bg-emerald/15 animate-float-slow [animation-delay:-11s]" />
      <div className="absolute rounded-full blur-4xl will-change-transform bottom-[8%] right-[14%] w-[36rem] h-[36rem] bg-bhutan-red/15 dark:bg-bhutan-red/10 animate-float-slow [animation-delay:-15s]" />
      {/* Fine grain for tactile depth */}
      <div className="absolute inset-0 bg-grain opacity-4 mix-blend-overlay" />
    </div>
  );
}
