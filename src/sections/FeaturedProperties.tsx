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
            className="text-center py-20"
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

        {/* ── 3D Image Showcase ── */}
        <Bhutan3DShowcase />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 text-center"
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

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), {
    stiffness: 150,
    damping: 25,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), {
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
    <div className="mt-14 mb-8">
      {/* Section label */}
      <div className="text-center mb-8">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[13px] font-semibold tracking-wide uppercase shadow-sm"
          style={{
            background: "linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(14,165,233,0.12) 100%)",
            border: "1px solid rgba(212,175,55,0.35)",
            color: "#d4af37",
            letterSpacing: "0.08em",
          }}
        >
          <Sparkles className="w-3.5 h-3.5 fill-current" />
          Life in Bhutan
        </div>
        <h3 className="mt-4 text-[26px] sm:text-[34px] font-bold tracking-tight text-foreground leading-tight">
          Where mountains meet{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #d4af37 0%, #f4d57a 50%, #b8972e 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            luxury living
          </span>
        </h3>
        <p className="mt-2.5 text-ink-500 text-[15px] max-w-xl mx-auto leading-relaxed">
          Experience architectural excellence nestled within Bhutan&apos;s breathtaking Himalayan landscape.
        </p>
      </div>

      {/* 3D Card Container */}
      <div className="relative max-w-5xl mx-auto px-1 sm:px-0">
        {/* Ambient glow behind the card */}
        <div
          className="absolute inset-0 rounded-3xl blur-2xl opacity-40 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 30% 50%, rgba(212,175,55,0.4) 0%, transparent 65%), radial-gradient(ellipse at 70% 50%, rgba(14,165,233,0.3) 0%, transparent 65%)",
            transform: "scale(1.05) translateY(4%)",
          }}
        />

        {/* 3D tilt card */}
        <motion.div
          ref={cardRef}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1200 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer shadow-2xl border border-black/10 dark:border-white/15 bg-neutral-900"
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 200, damping: 30 }}
        >
          {/* Main Image */}
          <div className="relative w-full overflow-hidden min-h-[260px] sm:min-h-[380px] md:min-h-[440px] flex items-center justify-center bg-black/40">
            <Image
              src="/image/hh.png"
              alt="Luxury living in Bhutan — 3D architectural showcase"
              width={1400}
              height={700}
              priority
              unoptimized
              className="w-full h-auto object-cover block"
              style={{ minHeight: "260px" }}
            />

            {/* Gradient overlays for contrast */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 45%, transparent 75%)",
              }}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to right, rgba(0,0,0,0.4) 0%, transparent 35%, transparent 65%, rgba(0,0,0,0.3) 100%)",
              }}
            />

            {/* Top-left badge */}
            <motion.div
              style={{ translateZ: 40 }}
              className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-2xl backdrop-blur-md"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              >
              <div
                className="w-2.5 h-2.5 rounded-full animate-pulse"
                style={{ background: "#22c55e" }}
              />
              <span
                className="text-white text-[12px] font-semibold tracking-wide"
                style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}
              >
                Now Available
              </span>
              <div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  borderRadius: "inherit",
                }}
              />
            </motion.div>

            {/* Top-right stat pill */}
            <motion.div
              style={{ translateZ: 40 }}
              className="absolute top-6 right-6 flex items-center gap-1.5 px-4 py-2 rounded-2xl backdrop-blur-md"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <TrendingUp className="w-3.5 h-3.5" style={{ color: "#d4af37" }} />
              <span className="text-white text-[12px] font-semibold">Premium Properties</span>
              <div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background: "rgba(0,0,0,0.35)",
                  border: "1px solid rgba(212,175,55,0.3)",
                  borderRadius: "inherit",
                }}
              />
            </motion.div>

            {/* Bottom info bar */}
            <motion.div
              style={{ translateZ: 50 }}
              className="absolute bottom-0 left-0 right-0 p-6 sm:p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35, duration: 0.7 }}
            >
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4" style={{ color: "#d4af37" }} />
                    <span className="text-[13px] font-medium" style={{ color: "rgba(212,175,55,0.9)" }}>
                      Kingdom of Bhutan
                    </span>
                  </div>
                  <h4
                    className="text-white text-[22px] sm:text-[28px] font-bold tracking-tight leading-tight"
                    style={{ textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}
                  >
                    Architectural Excellence
                  </h4>
                  <p className="text-white/70 text-[14px] mt-1 max-w-xs">
                    Timeless design rooted in Bhutanese heritage
                  </p>
                </div>

                {/* Stats row */}
                <div className="flex items-center gap-3">
                  {[
                    { label: "Properties", value: "120+" },
                    { label: "Districts", value: "20" },
                    { label: "Happy Clients", value: "98%" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="px-4 py-2.5 rounded-2xl text-center backdrop-blur-md"
                      style={{
                        background: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.15)",
                      }}
                    >
                      <div
                        className="text-[18px] font-bold"
                        style={{
                          background: "linear-gradient(135deg, #d4af37, #f4d57a)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        {stat.value}
                      </div>
                      <div className="text-white/60 text-[11px] font-medium mt-0.5 whitespace-nowrap">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Subtle inner border */}
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.15), 0 32px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(212,175,55,0.08)",
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
