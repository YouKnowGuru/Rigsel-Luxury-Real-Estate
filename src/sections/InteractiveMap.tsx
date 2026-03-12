"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { MapPin, Building2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import "leaflet/dist/leaflet.css";

// Dynamically import Leaflet components with SSR disabled
const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-200 animate-pulse" />,
});

const locations = [
  {
    id: "paro",
    name: "Paro",
    lat: 27.4289,
    lng: 89.4167,
    properties: 128,
    description: "Home to Paro International Airport",
  },
  {
    id: "punakha",
    name: "Punakha",
    lat: 27.5921,
    lng: 89.8773,
    properties: 89,
    description: "Historic former capital",
  },
  {
    id: "phuntsholing",
    name: "Phuntsholing",
    lat: 26.8516,
    lng: 89.3885,
    properties: 76,
    description: "Gateway to Bhutan from India",
  },
  {
    id: "gelephu",
    name: "Gelephu",
    lat: 26.8756,
    lng: 90.4914,
    properties: 52,
    description: "Southern border town",
  },
];

export function InteractiveMap() {
  const [mounted, setMounted] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(locations[0]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <section className="section-padding bg-bhutan-dark relative min-h-[800px]">
        <div className="container-luxury flex items-center justify-center">
          <div className="w-full h-[600px] bg-white/5 rounded-[2.5rem] animate-pulse" />
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-bhutan-dark relative overflow-hidden">
      {/* Background Motifs */}
      <div className="absolute inset-0 bg-thangka opacity-[0.05] pointer-events-none mix-blend-overlay" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-bhutan-gold/40 to-transparent" />

      <div className="container-luxury relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="inline-block px-5 py-1.5 rounded-full bg-bhutan-gold/10 border border-bhutan-gold/20 text-bhutan-gold text-[10px] font-bold uppercase tracking-[0.4em] mb-6 shadow-sm"
          >
            Explore Locations
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-3xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Find Your <span className="text-bhutan-gold italic font-light">Perfect Place</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-white/60 max-w-2xl mx-auto text-lg font-light leading-relaxed"
          >
            Discover beautiful properties across Bhutan. From the busy capital to peaceful mountain valleys,
            we have locations that fit every lifestyle.
          </motion.p>
        </div>

        {/* Map and Locations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Sidebar Locations */}
          <div className="lg:col-span-4 space-y-4">
            {locations.map((location, index) => (
              <motion.button
                key={location.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setSelectedLocation(location)}
                className={`w-full text-left p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] transition-all duration-500 relative group overflow-hidden border ${selectedLocation.id === location.id
                  ? "bg-white/10 shadow-2xl border-bhutan-gold/50 backdrop-blur-md"
                  : "bg-white/5 hover:bg-white/10 border-white/5 hover:border-bhutan-gold/20"
                  }`}
              >
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 md:w-14 md:h-14 rounded-[1rem] md:rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-500 ${selectedLocation.id === location.id ? "bg-bhutan-gold text-bhutan-dark scale-110 shadow-[0_0_20px_rgba(244,196,48,0.4)]" : "bg-white/5 text-bhutan-gold"
                    }`}>
                    <MapPin className="w-5 h-5 md:w-6 md:h-6" />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className={`font-serif text-xl font-bold transition-colors ${selectedLocation.id === location.id ? "text-white" : "text-white/60"}`}>
                        {location.name}
                      </h4>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${selectedLocation.id === location.id ? "text-bhutan-gold" : "text-white/20"
                        }`}>
                        {location.properties} Properies
                      </span>
                    </div>
                    <p className={`text-sm transition-colors duration-500 ${selectedLocation.id === location.id ? "text-white/50" : "text-white/30"
                      }`}>
                      {location.description}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}

            <Link href="/properties" className="block mt-10">
              <button className="w-full h-16 bg-white/5 hover:bg-bhutan-red text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-2xl transition-all duration-500 flex items-center justify-center gap-3 group border border-white/10 hover:border-bhutan-red shadow-xl">
                See All Available Properties
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-700" />
              </button>
            </Link>
          </div>

          {/* Map Viewport Area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-8 relative"
          >
            {/* Map Frame Decor */}
            <div className="absolute -inset-2 bg-bhutan-gold/20 rounded-[3rem] blur-2xl opacity-30" />

            <div className="h-[600px] lg:h-full min-h-[600px] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-bhutan-dark relative z-10">
              <LeafletMap
                locations={locations}
                onLocationSelect={(location: any) => setSelectedLocation(location)}
              />

              {/* Map Floating HUD */}
              <div className="absolute top-6 right-6 z-[1000] bg-bhutan-dark/80 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 pointer-events-none">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] text-white/80 font-bold uppercase tracking-widest">Live Updates</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
