"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Building2, ArrowRight, MapPin, Star, TrendingUp, Sparkles } from "lucide-react";
import useSWR from "swr";
import { useRef } from "react";
import { Property } from "@/types";
import { PropertyCard } from "@/components/property/PropertyCard";
import { PropertyCardSkeleton } from "@/components/property/PropertyCardSkeleton";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { fetcher, ApiResponse } from "@/lib/fetcher";

export function FeaturedProperties() {
  const { data: featuredData, isLoading: featuredLoading } = useSWR<ApiResponse<Property[]>>(
    "/api/properties?featured=true&limit=6",
    fetcher,
    {
      dedupingInterval: 60000,
      revalidateOnFocus: false,
      fallbackData: { success: true, data: [] },
    }
  );

  const { data: latestData, isLoading: latestLoading } = useSWR<ApiResponse<Property[]>>(
    featuredData && featuredData.data.length === 0
      ? "/api/properties?limit=6&sortBy=createdAt&sortOrder=desc"
      : null,
    fetcher,
    { dedupingInterval: 60000, revalidateOnFocus: false }
  );

  const isLoading = featuredLoading || (featuredData?.data.length === 0 && latestLoading);
  const properties = featuredData?.data.length ? featuredData.data : latestData?.data || [];

  return (
    <section className="section-y">
      <div className="container-apple-wide">
        <SectionHeader
          eyebrow="Featured"
          title="Property."
          highlight="Built for life in Bhutan."
          subtitle="Handpicked listings from across Bhutan — vetted, verified, and beautifully presented."
        />

        {/* ── 3D Image Showcase directly below Property title ── */}
        <Bhutan3DShowcase />

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {[1, 2, 3].map((i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        ) : properties.length === 0 ? (
          /* ── Rich empty state ── */
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center py-16"
          >
            <div className="mx-auto mb-6 w-20 h-20 rounded-3xl bg-gradient-to-br from-sky/20 to-bhutan-gold/20 flex items-center justify-center shadow-soft border border-sky/10">
              <Building2 className="w-9 h-9 text-sky/70" strokeWidth={1.5} />
            </div>
            <h3 className="font-semibold text-[22px] tracking-tighter2 text-foreground mb-2">
              New listings coming soon
            </h3>
            <p className="text-ink-500 text-[16px] max-w-sm mx-auto leading-snug2">
              Our team is busy verifying properties across Bhutan. Check back
              shortly — exciting listings are on their way.
            </p>
            <Link
              href="/contact"
              className="mt-7 inline-flex items-center gap-2 h-11 px-6 rounded-full bg-sky text-white text-[14px] font-medium hover:bg-sky-hover active:scale-[0.97] transition-all duration-fast no-tap"
            >
              Get notified
              <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Desktop grid — all properties */}
            <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {properties.map((property, i) => (
                <motion.div
                  key={property._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.7,
                    delay: i * 0.06,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <PropertyCard property={property} />
                </motion.div>
              ))}
            </div>

            {/* Mobile horizontal scroll — App Store style */}
            <div
              className="sm:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 -mx-5 px-5 scroll-padding-x-5"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {properties.map((property) => (
                <div
                  key={property._id}
                  className="snap-start shrink-0 w-[85vw] max-w-[340px]"
                >
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
          </>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <Link href="/properties" className="link-apple link-arrow text-[16px]">
            See all properties
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function Bhutan3DShowcase() {
  const cardRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), {
    stiffness: 150,
    damping: 25,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-7, 7]), {
    stiffness: 150,
    damping: 25,
  });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <div className="mt-8 mb-14">
      {/* 3D Showcase Card */}
      <div className="relative max-w-5xl mx-auto">
        {/* Ambient glow behind the card */}
        <div
          className="absolute -inset-2 rounded-3xl blur-2xl opacity-50 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 25% 40%, rgba(212,175,55,0.45) 0%, transparent 65%), radial-gradient(ellipse at 75% 60%, rgba(14,165,233,0.35) 0%, transparent 65%)",
          }}
        />

        {/* 3D tilt card */}
        <motion.div
          ref={cardRef}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1200 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-black/10 dark:border-white/15 bg-neutral-950"
          whileHover={{ scale: 1.008 }}
          transition={{ type: "spring", stiffness: 200, damping: 30 }}
        >
          {/* Main Showcase Image */}
          <div className="relative w-full aspect-[16/9] sm:aspect-[16/8] md:aspect-[16/7.5] max-h-[560px] overflow-hidden bg-neutral-900 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/image/hh.png"
              alt="Luxury Architecture in Bhutan"
              className="w-full h-full object-cover object-center block"
              loading="eager"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.endsWith("/hh.png")) {
                  target.src = "/hh.png";
                }
              }}
            />

            {/* Gradient overlays for readability */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 40%, transparent 70%)",
              }}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to right, rgba(0,0,0,0.45) 0%, transparent 35%, transparent 65%, rgba(0,0,0,0.25) 100%)",
              }}
            />

            {/* Top-left Badge */}
            <div className="absolute top-4 sm:top-6 left-4 sm:left-6 flex items-center gap-2 px-3.5 py-1.5 rounded-full backdrop-blur-md bg-black/40 border border-white/20 shadow-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-sm" />
              <span className="text-white text-[12px] font-semibold tracking-wide">
                Signature Bhutan Living
              </span>
            </div>

            {/* Top-right Pill */}
            <div className="absolute top-4 sm:top-6 right-4 sm:right-6 hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full backdrop-blur-md bg-black/40 border border-amber-400/40 shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span className="text-amber-200 text-[12px] font-medium">
                Exclusive Architecture
              </span>
            </div>

            {/* Bottom Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <MapPin className="w-4 h-4 text-amber-400" />
                    <span className="text-amber-300 text-[13px] font-semibold tracking-wide uppercase">
                      Kingdom of Bhutan
                    </span>
                  </div>
                  <h3 className="text-white text-[20px] sm:text-[28px] md:text-[32px] font-bold tracking-tight leading-tight drop-shadow-md">
                    Where Mountains Meet{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-100">
                      Luxury Living
                    </span>
                  </h3>
                  <p className="text-white/80 text-[13px] sm:text-[15px] mt-1 max-w-md line-clamp-2">
                    Timeless architectural marvels crafted in harmony with Bhutan&apos;s sacred valleys.
                  </p>
                </div>

                {/* Key Highlights */}
                <div className="flex items-center gap-2 sm:gap-3">
                  {[
                    { label: "Dzongkhags", value: "20" },
                    { label: "Verified Homes", value: "100%" },
                    { label: "Premium Build", value: "3D" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="px-3.5 py-2 rounded-xl text-center backdrop-blur-md bg-white/10 border border-white/20 shadow-md"
                    >
                      <div className="text-[16px] sm:text-[18px] font-bold text-amber-300 leading-none">
                        {stat.value}
                      </div>
                      <div className="text-white/70 text-[10px] sm:text-[11px] font-medium mt-1 whitespace-nowrap">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
