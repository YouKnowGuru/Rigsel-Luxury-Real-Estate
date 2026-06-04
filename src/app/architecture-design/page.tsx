"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Box,
  Search,
  Loader2,
  ArrowRight,
  Move3d,
  Pin,
  MapPin,
} from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { cn } from "@/lib/utils";

interface Design {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  location: string;
  district: string;
  coverImage?: string;
  isPinned: boolean;
  viewCount: number;
}

const categories = ["All", "Residential", "Commercial", "Interior", "Exterior", "Traditional", "Landscape"];

export default function ArchitectureDesignPage() {
  const [items, setItems] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const url = new URL("/api/architecture-design", window.location.origin);
        url.searchParams.set("limit", "24");
        if (category !== "All") url.searchParams.set("category", category);
        if (search.trim()) url.searchParams.set("search", search.trim());

        const res = await fetch(url.toString());
        const data = await res.json();
        if (data.success) setItems(data.data);
      } catch {
        console.error("Failed to load designs");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [category, search]);

  const pinned = items.filter((i) => i.isPinned);
  const rest = items.filter((i) => !i.isPinned);

  return (
    <main className="bg-background">
      <PageHero
        eyebrow="360° Experience"
        title="Architecture design."
        highlight="Walk through in 360°."
        subtitle="Explore architectural projects across Bhutan — drag to look around each space."
        breadcrumbs={[{ label: "Architecture design" }]}
      />

      <section className="section-y-sm border-b border-ink-100 dark:border-ink-700/40">
        <div className="container-apple">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
              <input
                type="search"
                placeholder="Search projects…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-apple w-full pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-[13px] font-medium transition-colors no-tap",
                    category === c
                      ? "bg-foreground text-background"
                      : "bg-fog text-ink-500 hover:text-foreground"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-apple">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-sky" />
            </div>
          ) : items.length === 0 ? (
            <p className="text-center text-ink-500 py-16">
              No 360° tours published yet. Check back soon.
            </p>
          ) : (
            <div className="space-y-10">
              {pinned.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {pinned.map((item, i) => (
                    <DesignCard key={item._id} item={item} large index={i} />
                  ))}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {rest.map((item, i) => (
                  <DesignCard key={item._id} item={item} index={i} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function DesignCard({
  item,
  large,
  index,
}: {
  item: Design;
  large?: boolean;
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.04 }}
    >
      <Link
        href={`/architecture-design/${item.slug}`}
        className={cn(
          "group block rounded-apple-xl overflow-hidden bg-fog border border-ink-100 dark:border-ink-700/40 hover:shadow-product transition-shadow",
          large && "md:flex md:min-h-[220px]"
        )}
      >
        <div
          className={cn(
            "relative overflow-hidden bg-ink-900",
            large ? "md:w-1/2 aspect-[16/10] md:aspect-auto md:min-h-[220px]" : "aspect-[16/10]"
          )}
        >
          {item.coverImage ? (
            <Image
              src={item.coverImage}
              alt=""
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white/30">
              <Box className="w-12 h-12" />
            </div>
          )}
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-black/55 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-1">
            <Move3d className="w-3.5 h-3.5" />
            360° tour
          </span>
          {item.isPinned && (
            <Pin className="absolute top-3 right-3 w-4 h-4 text-bhutan-gold fill-bhutan-gold drop-shadow" />
          )}
        </div>
        <div className={cn("p-5 sm:p-6", large && "md:w-1/2 md:flex md:flex-col md:justify-center")}>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-sky">
            {item.category}
          </span>
          <h2 className="mt-1 font-semibold text-[18px] sm:text-[20px] tracking-tight text-foreground group-hover:text-sky transition-colors">
            {item.title}
          </h2>
          <p className="mt-2 text-[14px] text-ink-500 line-clamp-2 leading-snug">
            {item.summary}
          </p>
          {(item.district || item.location) && (
            <p className="mt-2 flex items-center gap-1 text-[12px] text-ink-400">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              {[item.location, item.district].filter(Boolean).join(", ")}
            </p>
          )}
          <span className="mt-4 inline-flex items-center gap-1 text-[14px] text-sky font-medium">
            Enter 360° view
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
