"use client";

import { MarqueeStrip } from "@/components/ui/MarqueeStrip";

const phrases = [
  "Verified listings",
  "Nationwide coverage",
  "500+ families",
  "4.9 rating",
  "End-to-end paperwork",
  "Local experts",
];

/**
 * A quiet horizontal type strip — Apple uses these as brand reinforcement
 * between large editorial sections.
 */
export function BrandMarquee() {
  return (
    <section className="py-10 sm:py-14 border-y border-ink-100/60 dark:border-ink-700/40">
      <MarqueeStrip
        speed="slow"
        pauseOnHover
        items={phrases.map((p) => (
          <span
            key={p}
            className="inline-flex items-center gap-6 text-foreground/70 font-semibold tracking-tighter3 text-[clamp(1.5rem,1.25rem+1.25vw,2.5rem)]"
          >
            {p}
            <span className="text-ink-300 font-normal">·</span>
          </span>
        ))}
      />
    </section>
  );
}
