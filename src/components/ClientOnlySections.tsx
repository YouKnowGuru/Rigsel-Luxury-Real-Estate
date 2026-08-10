"use client";

/**
 * ClientOnlySections — wraps components that must be client-only (ssr: false).
 *
 * `ssr: false` is not allowed in Server Components (Next.js 13+), so the
 * dynamic() calls for InteractiveMapWrapper (Leaflet) and PhojaaA1Chat (AI widget)
 * live here inside a Client Component boundary instead.
 */
import dynamic from "next/dynamic";

const InteractiveMapWrapper = dynamic(
  () => import("@/components/InteractiveMapWrapper").then((m) => ({ default: m.InteractiveMapWrapper })),
  { ssr: false }
);

const PhojaaA1Chat = dynamic(
  () => import("@/components/PhojaaA1Chat").then((m) => ({ default: m.PhojaaA1Chat })),
  { ssr: false }
);


export function ClientOnlySections() {
  return (
    <>
      <InteractiveMapWrapper />
      <PhojaaA1Chat />
    </>
  );
}
