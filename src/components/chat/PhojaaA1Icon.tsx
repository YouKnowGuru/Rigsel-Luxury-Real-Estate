"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

type PhojaaA1IconSize = "sm" | "md" | "lg" | "xl";

const sizeMap: Record<PhojaaA1IconSize, string> = {
  sm: "w-5 h-5",
  md: "w-7 h-7",
  lg: "w-9 h-9",
  xl: "w-11 h-11",
};

/**
 * Custom Phojaa A1 mark — chat bubble + AI sparkle + A1 badge.
 */
export function PhojaaA1Icon({
  className,
  size = "md",
}: {
  className?: string;
  size?: PhojaaA1IconSize;
}) {
  const uid = useId().replace(/:/g, "");

  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(sizeMap[size], "shrink-0", className)}
      aria-hidden
    >
      <defs>
        <linearGradient id={`${uid}-bubble`} x1="8" y1="6" x2="40" y2="38">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.75" />
        </linearGradient>
        <linearGradient id={`${uid}-spark`} x1="14" y1="12" x2="30" y2="28">
          <stop offset="0%" stopColor="#0071E3" />
          <stop offset="100%" stopColor="#0040DD" />
        </linearGradient>
        <linearGradient id={`${uid}-badge`} x1="30" y1="30" x2="44" y2="44">
          <stop offset="0%" stopColor="#D4B57A" />
          <stop offset="100%" stopColor="#A08854" />
        </linearGradient>
        <filter
          id={`${uid}-glow`}
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
        >
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path
        d="M10 8h28c3.3 0 6 2.7 6 6v14c0 3.3-2.7 6-6 6H22l-8 7v-7c-2.2 0-4-1.8-4-4V14c0-3.3 2.7-6 6-6z"
        fill={`url(#${uid}-bubble)`}
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="0.75"
      />

      <g filter={`url(#${uid}-glow)`}>
        <path
          d="M24 14l1.2 3.6h3.8l-3.1 2.2 1.2 3.6L24 21.2l-3.1 2.2 1.2-3.6-3.1-2.2h3.8L24 14z"
          fill={`url(#${uid}-spark)`}
        />
        <circle cx="17" cy="26" r="1.1" fill="#0071E3" opacity="0.85" />
        <circle cx="31" cy="26" r="1.1" fill="#0071E3" opacity="0.85" />
        <circle cx="24" cy="29" r="1.1" fill="#34C759" opacity="0.9" />
      </g>

      <circle cx="36" cy="36" r="9" fill={`url(#${uid}-badge)`} />
      <circle
        cx="36"
        cy="36"
        r="9"
        fill="none"
        stroke="rgba(255,255,255,0.45)"
        strokeWidth="0.75"
      />
      <text
        x="36"
        y="36.5"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#1D1D1F"
        fontSize="8"
        fontWeight="700"
        fontFamily="system-ui, -apple-system, sans-serif"
        letterSpacing="-0.02em"
      >
        A1
      </text>
    </svg>
  );
}
