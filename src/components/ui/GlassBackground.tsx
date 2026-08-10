import { cn } from "@/lib/utils";

interface GlassBackgroundProps {
  className?: string;
}

/**
 * GlassBackground — the static mesh/aurora "scene" that lives behind
 * all public-facing pages. Frosted glass surfaces (.glass, .glass-card,
 * .glass-nav, .glass-pill, etc.) blur this layer to produce the
 * glassmorphism / frosted-glass effect.
 *
 * Mounted once in RouteAwareLayout as a fixed, non-interactive layer
 * (z-index: -10) so every non-admin page gets the frosted backdrop.
 * Respects prefers-reduced-motion via the global CSS rule that zeroes
 * animation duration.
 *
 * Performance note: the colour is provided entirely by the CSS
 * radial-gradient mesh defined in .glass-scene. The large blur-2xl
 * blob divs that were previously here each forced an independent GPU
 * compositor layer — they have been removed to reduce GPU load on
 * every page. The grain overlay is kept for tactile depth.
 */
export function GlassBackground({ className }: GlassBackgroundProps) {
  return (
    <div aria-hidden className={cn("glass-scene", className)}>
      {/* Fine grain for tactile depth */}
      <div className="absolute inset-0 bg-grain opacity-4 mix-blend-overlay pointer-events-none" />
    </div>
  );
}
