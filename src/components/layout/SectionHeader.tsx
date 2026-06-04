"use client";

import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  align?: "left" | "center";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  invert?: boolean;
}

const sizeMap = {
  sm: "text-[clamp(1.5rem,1.25rem+1.25vw,2.25rem)]",
  md: "text-[clamp(2rem,1.5rem+2vw,3.25rem)]",
  lg: "text-[clamp(2.5rem,2rem+2.5vw,4rem)]",
  xl: "text-[clamp(3rem,2.25rem+3.5vw,5.5rem)]",
};

export function SectionHeader({
  eyebrow,
  title,
  highlight,
  subtitle,
  align = "center",
  size = "lg",
  className,
  invert = false,
}: SectionHeaderProps) {
  return (
    <header
      className={cn(
        "mb-10 sm:mb-14",
        align === "center" ? "text-center" : "text-left",
        className
      )}
    >
      {eyebrow && (
        <Reveal>
          <p
            className={cn(
              "text-[13px] sm:text-[14px] font-semibold mb-2.5",
              invert ? "text-sky-dim" : "text-sky"
            )}
          >
            {eyebrow}
          </p>
        </Reveal>
      )}
      <Reveal delay={0.06}>
        <h2
          className={cn(
            "font-semibold tracking-tighter3 leading-tighter text-balance",
            sizeMap[size],
            invert ? "text-white" : "text-foreground"
          )}
        >
          {title}
          {highlight && (
            <>
              {" "}
              <span className={cn(invert ? "text-white/55" : "text-ink-400")}>
                {highlight}
              </span>
            </>
          )}
        </h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={0.14}>
          <p
            className={cn(
              "mt-4 sm:mt-5 text-[16px] sm:text-[18px] md:text-[19px] leading-snug2 max-w-2xl font-normal text-pretty",
              align === "center" && "mx-auto",
              invert ? "text-white/70" : "text-ink-500"
            )}
          >
            {subtitle}
          </p>
        </Reveal>
      )}
    </header>
  );
}
