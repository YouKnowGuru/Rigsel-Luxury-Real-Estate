"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Code2, ArrowRight, Globe, Smartphone, Cpu } from "lucide-react";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { SERVICE_TYPE_LABELS } from "@/lib/solution-labels";
import type { SolutionServiceType } from "@/lib/solution-types";

interface Project {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  serviceType: SolutionServiceType;
  coverImage?: string;
}

const typeIcons: Record<SolutionServiceType, typeof Globe> = {
  "web-development": Globe,
  "app-development": Smartphone,
  "software-development": Cpu,
};

export function SolutionsShowcase() {
  const [items, setItems] = useState<Project[]>([]);

  useEffect(() => {
    fetch("/api/phojaa95-solutions?featured=true&limit=4")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data?.length) setItems(data.data);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="section-y bg-background content-visibility-auto border-t border-ink-100 dark:border-ink-700/40">
      <div className="container-apple-wide">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-10">
          <SectionHeader
            eyebrow="Phojaa95 Solutions"
            title="We build digital products."
            highlight="Web, apps & software."
            subtitle="Custom websites, mobile apps, and business software — explore our work or tell us what you need."
            className="mb-0 sm:mb-0"
          />
          <div className="flex flex-wrap gap-2 shrink-0 self-start sm:self-auto">
            <Link href="/phojaa95-solutions" className="btn-secondary">
              View portfolio
              <ArrowRight className="w-4 h-4 ml-1 inline" />
            </Link>
            <Link href="/phojaa95-solutions#request-project" className="btn-primary">
              Request a project
            </Link>
          </div>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {items.map((item, i) => {
              const Icon = typeIcons[item.serviceType];
              return (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.55, delay: i * 0.06 }}
                >
                  <Link
                    href={`/phojaa95-solutions/${item.slug}`}
                    className="group block rounded-apple-xl overflow-hidden bg-fog/50 dark:bg-ink-800/30 border border-ink-100 dark:border-ink-700/40 hover:shadow-product transition-all duration-300"
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
                          <Code2 className="w-10 h-10" />
                        </div>
                      )}
                      <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-black/55 backdrop-blur-md text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-1">
                        <Icon className="w-3 h-3" />
                        {SERVICE_TYPE_LABELS[item.serviceType]}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-[15px] text-foreground line-clamp-2 group-hover:text-sky transition-colors">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-[12px] text-ink-500 line-clamp-2">{item.summary}</p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="grid sm:grid-cols-3 gap-4">
            {(
              [
                "web-development",
                "app-development",
                "software-development",
              ] as SolutionServiceType[]
            ).map((type) => {
              const Icon = typeIcons[type];
              return (
                <Link
                  key={type}
                  href={`/phojaa95-solutions?serviceType=${type}`}
                  className="p-6 rounded-apple-xl border border-ink-100 dark:border-ink-700/40 hover:border-sky/30 hover:bg-sky/[0.03] transition-all no-tap"
                >
                  <Icon className="w-7 h-7 text-sky mb-3" strokeWidth={1.5} />
                  <h3 className="font-semibold text-foreground">
                    {SERVICE_TYPE_LABELS[type]}
                  </h3>
                  <p className="text-[13px] text-ink-500 mt-2">
                    Websites, apps, and software tailored to your business.
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
