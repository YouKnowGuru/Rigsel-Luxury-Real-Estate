"use client";

import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  spotlightColor?: string;
  children: React.ReactNode;
}

/**
 * A card with a soft radial glow that follows the cursor.
 * Touch-friendly: the spotlight simply doesn't show on devices without hover.
 */
export function SpotlightCard({
  className,
  spotlightColor = "rgba(212, 165, 55, 0.18)",
  children,
  ...props
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [active, setActive] = useState(false);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={ref}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onMouseMove={handleMove}
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition-opacity duration-500"
        style={{
          opacity: active ? 1 : 0,
          background: pos
            ? `radial-gradient(360px circle at ${pos.x}px ${pos.y}px, ${spotlightColor}, transparent 70%)`
            : undefined,
        }}
      />
      {children}
    </div>
  );
}
