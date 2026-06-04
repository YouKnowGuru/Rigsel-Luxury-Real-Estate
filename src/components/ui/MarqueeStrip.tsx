"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface MarqueeStripProps {
  items: React.ReactNode[];
  speed?: "slow" | "normal" | "fast";
  direction?: "left" | "right";
  className?: string;
  itemClassName?: string;
  separator?: React.ReactNode;
  pauseOnHover?: boolean;
}

const speedMap = {
  slow: "animate-marquee [animation-duration:55s]",
  normal: "animate-marquee",
  fast: "animate-marquee-fast",
};

export function MarqueeStrip({
  items,
  speed = "normal",
  direction = "left",
  className,
  itemClassName,
  separator,
  pauseOnHover = true,
}: MarqueeStripProps) {
  const repeated = [...items, ...items];

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden",
        "mask-edges-x",
        className
      )}
      role="marquee"
      aria-label="Scrolling highlights"
    >
      <div
        className={cn(
          "flex w-max items-center gap-10 whitespace-nowrap",
          speedMap[speed],
          direction === "right" && "animate-marquee-reverse",
          pauseOnHover && "[&:hover]:[animation-play-state:paused]"
        )}
      >
        {repeated.map((item, i) => (
          <React.Fragment key={i}>
            <div className={cn("shrink-0", itemClassName)}>{item}</div>
            {separator ? (
              <div className="shrink-0 text-ink-300/50 dark:text-ink-600" aria-hidden>
                {separator}
              </div>
            ) : null}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
