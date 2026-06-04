"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { defaultTransition, fadeUp, fadeIn, slideInRight, viewportOnce } from "@/lib/motion";

type RevealVariant = "fadeUp" | "fadeIn" | "slideRight";

const variants = {
  fadeUp,
  fadeIn,
  slideRight: slideInRight,
};

interface RevealProps extends HTMLMotionProps<"div"> {
  variant?: RevealVariant;
  delay?: number;
  className?: string;
  children: React.ReactNode;
}

export function Reveal({
  variant = "fadeUp",
  delay = 0,
  className,
  children,
  ...props
}: RevealProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={variants[variant]}
      transition={{ ...defaultTransition, delay }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
