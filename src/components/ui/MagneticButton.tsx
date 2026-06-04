"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import React, { useRef } from "react";
import { cn } from "@/lib/utils";

interface MagneticButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  strength?: number;
  className?: string;
  children: React.ReactNode;
  as?: "div" | "span";
}

/**
 * Pulls the element gently toward the cursor for premium tactile feedback.
 * Falls back to no-op on touch devices (no hover support).
 */
export function MagneticButton({
  strength = 0.25,
  className,
  children,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 250, damping: 18, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 250, damping: 18, mass: 0.6 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const offsetX = (e.clientX - (rect.left + rect.width / 2)) * strength;
    const offsetY = (e.clientY - (rect.top + rect.height / 2)) * strength;
    x.set(offsetX);
    y.set(offsetY);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: springX, y: springY }}
      className={cn("inline-flex will-change-transform", className)}
      {...(props as any)}
    >
      {children}
    </motion.div>
  );
}
