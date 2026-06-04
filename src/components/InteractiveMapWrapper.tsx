"use client";

import dynamic from "next/dynamic";

const InteractiveMap = dynamic(
  () => import("@/sections/InteractiveMap").then((mod) => ({ default: mod.InteractiveMap })),
  {
    ssr: false,
    loading: () => (
      <div className="section-y bg-fog">
        <div className="container-apple-wide">
          <div className="h-[400px] bg-fog animate-pulse rounded-apple-xl" />
        </div>
      </div>
    ),
  }
);

export function InteractiveMapWrapper() {
  return <InteractiveMap />;
}
