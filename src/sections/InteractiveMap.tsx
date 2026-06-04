"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";
import Link from "next/link";
import { SectionHeader } from "@/components/layout/SectionHeader";
import "leaflet/dist/leaflet.css";

const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-fog animate-pulse" />,
});

const locations = [
  {
    id: "paro",
    name: "Paro",
    lat: 27.4289,
    lng: 89.4167,
    properties: 128,
    description: "Home to Paro International Airport.",
  },
  {
    id: "punakha",
    name: "Punakha",
    lat: 27.5921,
    lng: 89.8773,
    properties: 89,
    description: "Historic former capital.",
  },
  {
    id: "phuntsholing",
    name: "Phuntsholing",
    lat: 26.8516,
    lng: 89.3885,
    properties: 76,
    description: "Gateway to Bhutan from India.",
  },
  {
    id: "gelephu",
    name: "Gelephu",
    lat: 26.8756,
    lng: 90.4914,
    properties: 52,
    description: "Southern border town.",
  },
];

export function InteractiveMap() {
  const [mounted, setMounted] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(locations[0]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="section-y bg-fog content-visibility-auto">
      <div className="container-apple-wide">
        <SectionHeader
          eyebrow="Locations"
          title="Properties where you want to be."
          subtitle="From the busy capital to peaceful mountain valleys — explore properties wherever you want to call home."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6">
          <div className="lg:col-span-4 space-y-2.5">
            {locations.map((location, i) => (
              <motion.button
                key={location.id}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                onClick={() => setSelectedLocation(location)}
                className={`w-full text-left p-4 sm:p-5 rounded-apple-lg transition-all duration-fast border ${
                  selectedLocation.id === location.id
                    ? "bg-white border-foreground/15 shadow-soft"
                    : "bg-white/60 dark:bg-card border-transparent hover:bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      selectedLocation.id === location.id
                        ? "bg-foreground text-background"
                        : "bg-ink-100 text-foreground"
                    }`}
                  >
                    <MapPin className="w-4 h-4" strokeWidth={1.75} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-semibold text-[16px] tracking-tighter2 text-foreground">
                        {location.name}
                      </h4>
                      <span className="text-[11px] text-ink-500 shrink-0">
                        {location.properties} listings
                      </span>
                    </div>
                    <p className="text-[13px] text-ink-500 leading-snug">
                      {location.description}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}

            <Link href="/properties" className="link-apple link-arrow inline-flex mt-3 text-[15px]">
              See all listings
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-8 relative"
          >
            <div className="relative h-[320px] sm:h-[420px] lg:h-[560px] rounded-apple-xl overflow-hidden border border-ink-100 dark:border-ink-700/40 bg-white">
              {mounted ? (
                <LeafletMap
                  locations={locations}
                  onLocationSelect={(location: any) =>
                    setSelectedLocation(location)
                  }
                />
              ) : (
                <div className="h-full w-full bg-fog animate-pulse" />
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
