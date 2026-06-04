"use client";

import type { ElementType } from "react";
import Link from "next/link";
import NextImage from "next/image";
import { motion } from "framer-motion";
import {
  Home,
  Building2,
  TreePine,
  Store,
  Hotel,
  ArrowRight,
  LayoutGrid,
} from "lucide-react";
import useSWR from "swr";
import { fetcher, ApiResponse } from "@/lib/fetcher";
import { cn } from "@/lib/utils";

type PropertyTypeWithCount = {
  _id: string;
  name: string;
  slug: string;
  listingCount?: number;
};

type CategoryMeta = {
  icon: ElementType;
  image: string;
  label: string;
  tagline: string;
  accent: string;
  /** Bento grid placement on lg+ */
  bento: string;
};

const categoryMeta: Record<string, CategoryMeta> = {
  house: {
    icon: Home,
    image: "/image/bhutan/houses.png",
    label: "Houses",
    tagline: "Homes & traditional villas",
    accent: "from-sky/80 to-sky/20",
    bento: "lg:col-span-7 lg:row-span-2 min-h-[280px] lg:min-h-[420px]",
  },
  apartment: {
    icon: Building2,
    image: "/image/bhutan/apartments.png",
    label: "Apartments",
    tagline: "Urban flats & studios",
    accent: "from-violet-500/70 to-violet-500/10",
    bento: "lg:col-span-5 min-h-[200px] lg:min-h-[200px]",
  },
  land: {
    icon: TreePine,
    image: "/image/bhutan/land.png",
    label: "Land",
    tagline: "Plots & valley estates",
    accent: "from-emerald/70 to-emerald/10",
    bento: "lg:col-span-4 min-h-[200px]",
  },
  commercial: {
    icon: Store,
    image: "/image/bhutan/commercial.png",
    label: "Commercial",
    tagline: "Shops & offices",
    accent: "from-amber/70 to-amber/10",
    bento: "lg:col-span-4 min-h-[200px]",
  },
  hotel: {
    icon: Hotel,
    image: "/image/bhutan/hotels.png",
    label: "Hotels",
    tagline: "Hospitality & stays",
    accent: "from-rose/70 to-rose/10",
    bento: "lg:col-span-4 min-h-[200px]",
  },
  villa: {
    icon: Home,
    image: "/image/bhutan/houses.png",
    label: "Villas",
    tagline: "Premium residences",
    accent: "from-sky/70 to-sky/10",
    bento: "lg:col-span-4 min-h-[200px]",
  },
};

const FEATURED_CATEGORY_SLUGS = [
  "house",
  "apartment",
  "land",
  "commercial",
  "hotel",
] as const;

const defaultMeta: CategoryMeta = {
  icon: Home,
  image: "/image/bhutan/houses.png",
  label: "Properties",
  tagline: "Browse listings",
  accent: "from-ink-900/70 to-transparent",
  bento: "lg:col-span-4 min-h-[200px]",
};

function buildCategoryList(apiTypes: PropertyTypeWithCount[]) {
  const bySlug = new Map(apiTypes.map((t) => [t.slug.toLowerCase(), t]));

  const featured = FEATURED_CATEGORY_SLUGS.map((slug) => {
    const api = bySlug.get(slug);
    const meta = categoryMeta[slug];
    return {
      _id: api?._id ?? slug,
      slug,
      name: api?.name ?? meta.label,
      listingCount: api?.listingCount ?? 0,
    };
  });

  const extra = apiTypes
    .filter(
      (t) =>
        !FEATURED_CATEGORY_SLUGS.includes(
          t.slug.toLowerCase() as (typeof FEATURED_CATEGORY_SLUGS)[number]
        ) && categoryMeta[t.slug.toLowerCase()]
    )
    .map((t) => ({
      _id: t._id,
      slug: t.slug.toLowerCase(),
      name: t.name,
      listingCount: t.listingCount ?? 0,
    }));

  return [...featured, ...extra];
}

function CategoryCard({
  category,
  meta,
  index,
  large,
}: {
  category: { _id: string; slug: string; name: string; listingCount: number };
  meta: CategoryMeta;
  index: number;
  large?: boolean;
}) {
  const Icon = meta.icon;
  const count = category.listingCount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.55,
        delay: index * 0.05,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(
        "relative snap-start shrink-0 w-[82vw] sm:w-auto sm:shrink",
        meta.bento,
        index === 0 && "sm:w-full"
      )}
    >
      <Link
        href={`/properties?type=${category.slug}`}
        className={cn(
          "group relative flex flex-col justify-end overflow-hidden rounded-apple-xl",
          "h-full min-h-[220px] border border-ink-100/50 dark:border-ink-700/40",
          "shadow-soft hover:shadow-elevated transition-all duration-500 no-tap",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky/50 focus-visible:ring-offset-2",
          large && "min-h-[260px]"
        )}
      >
        <NextImage
          src={meta.image}
          alt={category.name}
          fill
          sizes={
            large
              ? "(max-width: 1024px) 100vw, 55vw"
              : "(max-width: 1024px) 85vw, 28vw"
          }
          className="object-cover transition-transform duration-[1.2s] ease-apple-out group-hover:scale-[1.04]"
        />

        <div
          className={`absolute inset-0 bg-gradient-to-t opacity-90 transition-opacity duration-500 group-hover:opacity-100 ${meta.accent}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10" />

        <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-2 z-10">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-[11px] font-semibold">
            <Icon className="w-3.5 h-3.5" strokeWidth={2} />
            {category.name}
          </span>
          <span
            className={cn(
              "px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md border",
              count > 0
                ? "bg-white/20 border-white/25 text-white"
                : "bg-black/30 border-white/10 text-white/70"
            )}
          >
            {count > 0 ? `${count} live` : "Coming soon"}
          </span>
        </div>

        <div className="relative z-10 p-5 sm:p-6">
          <h3
            className={cn(
              "font-semibold tracking-tighter2 text-white leading-tight2",
              large
                ? "text-[28px] sm:text-[36px] lg:text-[42px]"
                : "text-[22px] sm:text-[26px]"
            )}
          >
            {meta.label}
          </h3>
          <p
            className={cn(
              "mt-1 text-white/75 leading-snug2",
              large ? "text-[15px] sm:text-[17px] max-w-md" : "text-[13px] sm:text-[14px]"
            )}
          >
            {meta.tagline}
          </p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-white/90 group-hover:text-white transition-colors">
            Browse {meta.label.toLowerCase()}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

export function PropertyCategories() {
  const { data } = useSWR<ApiResponse<PropertyTypeWithCount[]>>(
    "/api/property-types?counts=true",
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 120000 }
  );

  const types = buildCategoryList(data?.data ?? []);

  return (
    <section className="relative section-y overflow-hidden content-visibility-auto">
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        aria-hidden
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-sky/[0.06] rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-bhutan-gold/[0.04] rounded-full blur-[80px]" />
      </div>

      <div className="container-apple-wide">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-10 mb-10 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl"
          >
            <p className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-sky mb-4">
              <LayoutGrid className="w-3.5 h-3.5" strokeWidth={2} />
              Property types
            </p>
            <h2
              className="font-semibold tracking-tighter3 leading-tighter text-foreground text-balance"
              style={{ fontSize: "clamp(2rem, 1.5rem + 2.5vw, 3.75rem)" }}
            >
              Every way to own Bhutan.
              <span className="block text-ink-400 font-semibold">
                Start with what fits you.
              </span>
            </h2>
            <p className="mt-4 text-[16px] sm:text-[18px] text-ink-500 leading-snug2 max-w-xl text-pretty">
              Homes, land, commercial space, and hospitality — each collection is
              curated for how people actually buy and build in the kingdom.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="flex flex-wrap gap-2 lg:justify-end"
          >
            {types.map((t) => {
              const meta = categoryMeta[t.slug] ?? defaultMeta;
              const Icon = meta.icon;
              return (
                <Link
                  key={t.slug}
                  href={`/properties?type=${t.slug}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-medium bg-card border border-ink-100/80 dark:border-ink-700/50 text-ink-600 hover:text-foreground hover:border-sky/30 hover:bg-sky/[0.04] transition-all no-tap"
                >
                  <Icon className="w-3.5 h-3.5 text-sky" strokeWidth={2} />
                  {meta.label}
                  {t.listingCount > 0 && (
                    <span className="text-[11px] tabular-nums text-ink-400">
                      {t.listingCount}
                    </span>
                  )}
                </Link>
              );
            })}
            <Link href="/properties" className="btn-secondary text-[13px] !py-2 !px-4">
              All listings
              <ArrowRight className="w-3.5 h-3.5 ml-1 inline" />
            </Link>
          </motion.div>
        </div>

        {/* Mobile: horizontal snap */}
        <div
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide lg:hidden"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {types.map((category, i) => (
            <CategoryCard
              key={category._id}
              category={{ ...category, listingCount: category.listingCount ?? 0 }}
              meta={categoryMeta[category.slug] ?? defaultMeta}
              index={i}
              large={i === 0}
            />
          ))}
        </div>

        {/* Desktop: bento mosaic */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-4 auto-rows-fr">
          {types.map((category, i) => (
            <CategoryCard
              key={category._id}
              category={{ ...category, listingCount: category.listingCount ?? 0 }}
              meta={categoryMeta[category.slug] ?? defaultMeta}
              index={i}
              large={i === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
