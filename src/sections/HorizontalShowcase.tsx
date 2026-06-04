"use client";

import { useRef, useState, memo } from "react";
import useSWR from "swr";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, MapPin, Bed, Bath, Maximize } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Property } from "@/types";
import { fetcher, ApiResponse } from "@/lib/fetcher";

interface HorizontalShowcaseProps {
  title: string;
  subtitle?: string;
  endpoint?: string;
}

// Extracted stat item to prevent remounts
const StatItem = memo(function StatItem({
  icon: Icon,
  value,
}: {
  icon: typeof Bed;
  value: string | number;
}) {
  return (
    <span className="flex items-center gap-1">
      <Icon className="w-3 h-3 text-ink-400" strokeWidth={1.75} />
      <span className="font-medium text-foreground">{value}</span>
    </span>
  );
});

// Extracted card component to prevent remount on parent render
const HorizontalCard = memo(function HorizontalCard({ property }: { property: Property }) {
  return (
    <Link
      href={`/properties/${property._id}`}
      className="group block bg-white dark:bg-card rounded-apple-xl overflow-hidden border border-ink-100 dark:border-ink-700/40 shadow-soft hover:shadow-elevated transition-all duration-base ease-apple h-full"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-ink-100">
        <Image
          src={property.images[0] || "/placeholder-property.jpg"}
          alt={property.title}
          fill
          sizes="360px"
          className="object-cover transition-transform duration-1200 ease-apple-out group-hover:scale-[1.04]"
        />
        {property.isSold ? (
          <span className="absolute top-3 left-3 px-2 py-0.5 bg-foreground text-background text-[10px] font-medium rounded-full">
            Sold
          </span>
        ) : (
          <span className="absolute top-3 left-3 px-2 py-0.5 bg-white/90 backdrop-blur-md text-foreground text-[10px] font-semibold rounded-full">
            {property.propertyType || "Property"}
          </span>
        )}

      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        <h3 className="font-semibold text-[16px] sm:text-[18px] tracking-tighter2 leading-tight2 text-foreground line-clamp-1 group-hover:text-sky transition-colors duration-fast">
          {property.title}
        </h3>

        <div className="mt-1 flex items-center gap-1 text-[12px] text-ink-500">
          <MapPin className="w-3 h-3 text-ink-400 shrink-0" strokeWidth={1.75} />
          <span className="truncate">{property.location}</span>
        </div>

        <p className="mt-3 text-[18px] sm:text-[20px] font-semibold tracking-tightest tabular-nums text-foreground">
          {formatPrice(property.price)}
        </p>

        {/* Stats row */}
        <div className="mt-3 flex items-center gap-3 text-[11px] text-ink-500">
          <StatItem icon={Bed} value={property.bedrooms} />
          <StatItem icon={Bath} value={property.bathrooms} />
          <StatItem icon={Maximize} value={`${property.area} sqft`} />
        </div>

        {/* App Store style "Get" button row */}
        <div className="mt-4 pt-3 border-t border-ink-100 dark:border-ink-700/40 flex items-center justify-between">
          <span className="text-[11px] text-ink-400 font-medium">
            {property.isSold ? "Recently sold" : "Available now"}
          </span>
          <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-sky/10 text-sky text-[12px] font-semibold hover:bg-sky hover:text-white transition-colors duration-fast">
            View
          </span>
        </div>
      </div>
    </Link>
  );
});

export function HorizontalShowcase({ title, subtitle, endpoint = "/api/properties?limit=8&sortBy=createdAt&sortOrder=desc" }: HorizontalShowcaseProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Use SWR for caching and deduplication
  const { data } = useSWR<ApiResponse<Property[]>>(endpoint, fetcher, {
    dedupingInterval: 60000,
    revalidateOnFocus: false,
  });

  const properties = data?.data || [];

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  if (properties.length === 0) return null;

  return (
    <section className="py-10 sm:py-14 bg-fog">
      <div className="container-apple-wide">
        {/* Header with nav arrows */}
        <div className="flex items-end justify-between mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="font-semibold tracking-tighter2 leading-tight2 text-foreground text-[clamp(1.5rem,1.25rem+1.25vw,2.25rem)]">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-1 text-[14px] sm:text-[15px] text-ink-500 leading-snug2">
                {subtitle}
              </p>
            )}
          </motion.div>

          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-9 h-9 rounded-full bg-white dark:bg-card border border-ink-200 dark:border-ink-700 flex items-center justify-center text-foreground hover:bg-fog transition-colors no-tap"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" strokeWidth={1.75} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-9 h-9 rounded-full bg-white dark:bg-card border border-ink-200 dark:border-ink-700 flex items-center justify-center text-foreground hover:bg-fog transition-colors no-tap"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable row — App Store signature pattern */}
      <div
        ref={scrollRef}
        className="flex gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-hide pl-5 sm:pl-8 pr-5 sm:pr-8 scroll-padding-x-5"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {/* Spacer for container alignment on lg screens */}
        <div className="hidden xl:block shrink-0 w-[calc((100vw-1200px)/2-2rem)]" />

        {properties.map((property, i) => (
          <motion.div
            key={property._id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{
              duration: 0.5,
              delay: i * 0.04,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="snap-start shrink-0 w-[280px] sm:w-[320px] md:w-[360px]"
          >
            <HorizontalCard property={property} />
          </motion.div>
        ))}

        {/* End spacer */}
        <div className="hidden xl:block shrink-0 w-[calc((100vw-1200px)/2-2rem)]" />
      </div>
    </section>
  );
}
