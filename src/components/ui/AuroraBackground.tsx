"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface AuroraBackgroundProps {
  className?: string;
  variant?: "warm" | "cool" | "midnight";
  intensity?: "subtle" | "normal" | "strong";
}

export function AuroraBackground({
  className,
  variant = "warm",
  intensity = "normal",
}: AuroraBackgroundProps) {
  const intensityClass = {
    subtle: "opacity-60",
    normal: "opacity-90",
    strong: "opacity-100",
  }[intensity];

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        intensityClass,
        className
      )}
    >
      {variant === "warm" && (
        <>
          <div className="absolute -top-32 -left-20 w-[36rem] h-[36rem] bg-sky/10 rounded-full blur-[120px] animate-float-slow" />
          <div className="absolute top-1/3 -right-32 w-[32rem] h-[32rem] bg-sky/8 rounded-full blur-[110px] animate-float-slow [animation-delay:-7s]" />
          <div className="absolute -bottom-32 left-1/3 w-[28rem] h-[28rem] bg-ink-100/40 rounded-full blur-[120px] animate-float-slow [animation-delay:-14s]" />
        </>
      )}
      {variant === "cool" && (
        <>
          <div className="absolute -top-32 -left-20 w-[32rem] h-[32rem] bg-emerald/10 rounded-full blur-[120px] animate-float-slow" />
          <div className="absolute top-1/3 -right-32 w-[32rem] h-[32rem] bg-sky/8 rounded-full blur-[120px] animate-float-slow [animation-delay:-7s]" />
        </>
      )}
      {variant === "midnight" && (
        <>
          <div className="absolute -top-32 -left-20 w-[36rem] h-[36rem] bg-sky/12 rounded-full blur-[140px] animate-float-slow" />
          <div className="absolute top-1/4 right-0 w-[32rem] h-[32rem] bg-sky/8 rounded-full blur-[140px] animate-float-slow [animation-delay:-9s]" />
          <div className="absolute -bottom-40 left-1/4 w-[40rem] h-[40rem] bg-ink-900/40 rounded-full blur-[160px] animate-float-slow [animation-delay:-15s]" />
        </>
      )}
    </div>
  );
}
