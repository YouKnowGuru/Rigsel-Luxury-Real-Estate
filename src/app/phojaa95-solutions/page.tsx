"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Code2,
  Search,
  Loader2,
  ArrowRight,
  Pin,
  Globe,
  Smartphone,
  Cpu,
} from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { SolutionInquiryForm } from "@/components/solutions/SolutionInquiryForm";
import { cn } from "@/lib/utils";
import {
  SERVICE_TYPE_LABELS,
  SERVICE_TYPE_DESCRIPTIONS,
} from "@/lib/solution-labels";
import {
  SOLUTION_SERVICE_TYPES,
  type SolutionServiceType,
} from "@/lib/solution-types";

interface Project {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  serviceType: SolutionServiceType;
  coverImage?: string;
  technologies: string[];
  isPinned: boolean;
}

const filterOptions: { value: string; label: string; icon: typeof Globe }[] = [
  { value: "all", label: "All work", icon: Code2 },
  ...SOLUTION_SERVICE_TYPES.map((t) => ({
    value: t,
    label: SERVICE_TYPE_LABELS[t],
    icon: t === "web-development" ? Globe : t === "app-development" ? Smartphone : Cpu,
  })),
];

export default function Phojaa95SolutionsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-sky" /></div>}>
      <Phojaa95SolutionsContent />
    </Suspense>
  );
}

function Phojaa95SolutionsContent() {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [serviceFilter, setServiceFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const st = searchParams.get("serviceType");
    if (st && SOLUTION_SERVICE_TYPES.includes(st as SolutionServiceType)) {
      setServiceFilter(st);
    }
  }, [searchParams]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const url = new URL("/api/phojaa95-solutions", window.location.origin);
        url.searchParams.set("limit", "24");
        if (serviceFilter !== "all") url.searchParams.set("serviceType", serviceFilter);
        if (search.trim()) url.searchParams.set("search", search.trim());

        const res = await fetch(url.toString());
        const data = await res.json();
        if (data.success) setItems(data.data);
      } catch {
        console.error("Failed to load solutions");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [serviceFilter, search]);

  const pinned = items.filter((i) => i.isPinned);
  const rest = items.filter((i) => !i.isPinned);

  return (
    <main className="bg-background">
      <PageHero
        eyebrow="Phojaa95 Solutions"
        title="Build with us."
        highlight="Web, apps & software."
        subtitle="From property websites to custom business software — explore our work and share your project idea."
        breadcrumbs={[{ label: "Phojaa95 Solutions" }]}
      />

      <section className="section-y-sm border-b border-ink-100 dark:border-ink-700/40">
        <div className="container-apple">
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {SOLUTION_SERVICE_TYPES.map((type) => {
              const Icon =
                type === "web-development"
                  ? Globe
                  : type === "app-development"
                    ? Smartphone
                    : Cpu;
              return (
                <div
                  key={type}
                  className="p-5 rounded-apple-xl bg-fog/60 dark:bg-ink-800/30 border border-ink-100/60 dark:border-ink-700/30"
                >
                  <Icon className="w-6 h-6 text-sky mb-3" strokeWidth={1.5} />
                  <h2 className="text-[15px] font-semibold text-foreground">
                    {SERVICE_TYPE_LABELS[type]}
                  </h2>
                  <p className="text-[13px] text-ink-500 mt-1">
                    {SERVICE_TYPE_DESCRIPTIONS[type]}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
              <input
                type="search"
                placeholder="Search portfolio…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-apple w-full pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setServiceFilter(opt.value)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-[13px] font-medium transition-colors no-tap inline-flex items-center gap-1.5",
                    serviceFilter === opt.value
                      ? "bg-foreground text-background"
                      : "bg-fog text-ink-500 hover:text-foreground"
                  )}
                >
                  <opt.icon className="w-3.5 h-3.5" />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-sky" />
            </div>
          ) : items.length === 0 ? (
            <p className="text-center text-ink-500 py-12">
              Portfolio coming soon. Use the form below to describe your project.
            </p>
          ) : (
            <div className="space-y-10">
              {pinned.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-ink-500 mb-4 flex items-center gap-1">
                    <Pin className="w-3 h-3" /> Highlighted
                  </p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {pinned.map((item, i) => (
                      <ProjectCard key={item._id} item={item} index={i} featured />
                    ))}
                  </div>
                </div>
              )}
              {rest.length > 0 && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {rest.map((item, i) => (
                    <ProjectCard key={item._id} item={item} index={i} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <section id="request-project" className="section-y border-t border-ink-100 dark:border-ink-700/40">
        <div className="container-apple max-w-3xl mx-auto">
          <SolutionInquiryForm />
        </div>
      </section>
    </main>
  );
}

function ProjectCard({
  item,
  index,
  featured,
}: {
  item: Project;
  index: number;
  featured?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        href={`/phojaa95-solutions/${item.slug}`}
        className={cn(
          "group block rounded-apple-xl overflow-hidden border border-ink-100/60 dark:border-ink-700/40 hover:shadow-soft transition-all no-tap",
          featured && "ring-1 ring-sky/20"
        )}
      >
        <div className="relative aspect-[16/10] bg-fog">
          {item.coverImage ? (
            <Image
              src={item.coverImage}
              alt=""
              fill
              className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Code2 className="w-12 h-12 text-ink-300" />
            </div>
          )}
          <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[11px] font-medium bg-background/90 text-foreground border border-ink-100/80">
            {SERVICE_TYPE_LABELS[item.serviceType]}
          </span>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-foreground group-hover:text-sky transition-colors">
            {item.title}
          </h3>
          <p className="text-[13px] text-ink-500 mt-1 line-clamp-2">{item.summary}</p>
          {item.technologies?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {item.technologies.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-sky/10 text-sky"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
          <span className="inline-flex items-center gap-1 text-[13px] text-sky mt-3 font-medium">
            View project <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
