"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import useSWR from "swr";
import { Property } from "@/types";
import { PropertyCard } from "@/components/property/PropertyCard";
import { PropertyCardSkeleton } from "@/components/property/PropertyCardSkeleton";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { fetcher, ApiResponse } from "@/lib/fetcher";

export function FeaturedProperties() {
  // Use SWR for automatic caching, deduplication, and revalidation
  const { data: featuredData, isLoading: featuredLoading } = useSWR<ApiResponse<Property[]>>(
    "/api/properties?featured=true&limit=6",
    fetcher,
    {
      dedupingInterval: 60000, // 1 minute deduplication
      revalidateOnFocus: false,
      fallbackData: { success: true, data: [] },
    }
  );

  const { data: latestData, isLoading: latestLoading } = useSWR<ApiResponse<Property[]>>(
    // Only fetch latest if featured returned empty
    featuredData && featuredData.data.length === 0 ? "/api/properties?limit=6&sortBy=createdAt&sortOrder=desc" : null,
    fetcher,
    {
      dedupingInterval: 60000,
      revalidateOnFocus: false,
    }
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
          <p className="text-center py-16 text-ink-400">
            New listings coming soon.
          </p>
        ) : (
          <>
            {/* Desktop grid */}
            <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {properties.slice(0, 3).map((property, i) => (
                <motion.div
                  key={property._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.7,
                    delay: i * 0.08,
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
