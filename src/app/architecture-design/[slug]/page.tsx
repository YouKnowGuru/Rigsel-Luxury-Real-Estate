"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  Loader2,
  ArrowLeft,
  MapPin,
  User,
  Eye,
  Box,
} from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import type { PanoramaScene } from "@/components/architecture/Panorama360Viewer";

const Panorama360Viewer = dynamic(
  () =>
    import("@/components/architecture/Panorama360Viewer").then(
      (m) => ({ default: m.Panorama360Viewer })
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[min(70vh,520px)] min-h-[280px] rounded-apple-xl bg-ink-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-sky" />
      </div>
    ),
  }
);

interface Design {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  category: string;
  location: string;
  district: string;
  architect: string;
  panoramaUrl: string;
  scenes: PanoramaScene[];
  viewCount: number;
}

export default function ArchitectureDesignDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [design, setDesign] = useState<Design | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;

    const load = async () => {
      try {
        const res = await fetch(`/api/architecture-design/${slug}`);
        const data = await res.json();
        if (data.success) {
          setDesign(data.data);
          fetch(`/api/architecture-design/${data.data._id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "incrementView" }),
          }).catch(() => {});
        } else {
          setError("Project not found");
        }
      } catch {
        setError("Failed to load project");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-sky" />
      </div>
    );
  }

  if (error || !design) {
    return (
      <main className="container-apple section-y text-center">
        <p className="text-ink-500 mb-6">{error || "Not found"}</p>
        <Link href="/architecture-design" className="btn-secondary">
          <ArrowLeft className="w-4 h-4 mr-1 inline" />
          All designs
        </Link>
      </main>
    );
  }

  return (
    <main className="bg-background">
      <PageHero
        eyebrow={design.category}
        title={design.title}
        subtitle={design.summary}
        breadcrumbs={[
          { label: "Architecture design", href: "/architecture-design" },
          { label: design.title },
        ]}
      />

      <section className="section-y-sm">
        <div className="container-apple-wide">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Panorama360Viewer
              panoramaUrl={design.panoramaUrl}
              scenes={design.scenes}
            />
          </motion.div>

          <div className="mt-6 flex flex-wrap gap-4 text-[13px] text-ink-500">
            {(design.district || design.location) && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-4 h-4 text-sky" />
                {[design.location, design.district].filter(Boolean).join(", ")}
              </span>
            )}
            {design.architect && (
              <span className="inline-flex items-center gap-1">
                <User className="w-4 h-4 text-sky" />
                {design.architect}
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {design.viewCount + 1} views
            </span>
          </div>
        </div>
      </section>

      {design.description?.trim() && (
        <section className="section-y-sm border-t border-ink-100 dark:border-ink-700/40">
          <div className="container-apple max-w-3xl">
            <h2 className="font-semibold text-[20px] mb-4 flex items-center gap-2">
              <Box className="w-5 h-5 text-sky" />
              About this project
            </h2>
            <div className="prose prose-ink dark:prose-invert text-[15px] leading-relaxed whitespace-pre-wrap text-ink-600">
              {design.description}
            </div>
          </div>
        </section>
      )}

      <section className="section-y-sm pb-16">
        <div className="container-apple text-center">
          <Link href="/architecture-design" className="btn-secondary">
            <ArrowLeft className="w-4 h-4 mr-1 inline" />
            More 360° designs
          </Link>
          <Link href="/contact" className="btn-primary ml-3">
            Inquire about this project
          </Link>
        </div>
      </section>
    </main>
  );
}
