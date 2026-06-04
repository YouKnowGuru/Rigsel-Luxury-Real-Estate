"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface RevealTextProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  splitBy?: "word" | "char";
  once?: boolean;
}

/**
 * Sliding-mask word-by-word (or char-by-char) reveal animation.
 * Each piece slides up from below its own clipping mask.
 */
export function RevealText({
  text,
  className,
  delay = 0,
  stagger = 0.07,
  as = "h2",
  splitBy = "word",
  once = true,
}: RevealTextProps) {
  const Tag: any = motion[as];
  const pieces = splitBy === "word" ? text.split(/(\s+)/) : Array.from(text);

  return (
    <Tag
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-50px" }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      className={cn("inline-block", className)}
      aria-label={text}
    >
      {pieces.map((piece, i) =>
        piece === " " || /^\s+$/.test(piece) ? (
          <span key={i} aria-hidden> </span>
        ) : (
          <span
            key={i}
            aria-hidden
            className="inline-block overflow-hidden align-baseline"
          >
            <motion.span
              variants={{
                hidden: { y: "110%", opacity: 0 },
                visible: { y: "0%", opacity: 1 },
              }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="inline-block will-change-transform"
            >
              {piece}
            </motion.span>
          </span>
        )
      )}
    </Tag>
  );
}
