"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Box, ArrowRight, Move3d } from "lucide-react";
import { SectionHeader } from "@/components/layout/SectionHeader";

interface Design {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  coverImage?: string;
  district?: string;
}

export function ArchitectureDesignShowcase() {
  const [items, setItems] = useState<Design[]>([]);

  useEffect(() => {
    fetch("/api/architecture-design?featured=true&limit=4")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data?.length) setItems(data.data);
      })
      .catch(() => {});
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="section-y content-visibility-auto">
      <div className="container-apple-wide">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-10">
          <SectionHeader
            eyebrow="360° Architecture"
            title="Walk through our designs."
            highlight="In full 360°."
            subtitle="Drag to explore interiors and exteriors — published from our architecture design studio."
            className="mb-0 sm:mb-0"
          />
          <Link href="/architecture-design" className="btn-secondary shrink-0 self-start sm:self-auto">
            View all
            <ArrowRight className="w-4 h-4 ml-1 inline" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {items.map((item, i) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: i * 0.06 }}
            >
              <Link
                href={`/architecture-design/${item.slug}`}
                className="group block rounded-apple-xl overflow-hidden glass hover:shadow-product transition-all duration-300"
              >
                <div className="relative aspect-[4/3] bg-ink-900 overflow-hidden">
                  {item.coverImage ? (
                    <Image
                      src={item.coverImage}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-white/25">
                      <Box className="w-10 h-10" />
                    </div>
                  )}
                  <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-black/55 backdrop-blur-md text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-1">
                    <Move3d className="w-3 h-3" />
                    360°
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-sky">
                    {item.category}
                  </p>
                  <h3 className="mt-1 font-semibold text-[15px] text-foreground line-clamp-2 group-hover:text-sky transition-colors">
                    {item.title}
                  </h3>
                  {item.district && (
                    <p className="mt-1 text-[12px] text-ink-400">{item.district}</p>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
