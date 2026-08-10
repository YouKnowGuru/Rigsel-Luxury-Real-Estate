"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Building2, ArrowRight } from "lucide-react";
import useSWR from "swr";
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
