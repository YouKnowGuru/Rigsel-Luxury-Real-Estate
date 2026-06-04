"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Loader2, ExternalLink, ArrowLeft, Code2 } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { SolutionInquiryForm } from "@/components/solutions/SolutionInquiryForm";
import { SERVICE_TYPE_LABELS } from "@/lib/solution-labels";
import type { SolutionServiceType } from "@/lib/solution-types";

interface ProjectDetail {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  serviceType: SolutionServiceType;
  technologies: string[];
  coverImage?: string;
  galleryImages: string[];
  projectUrl?: string;
  demoUrl?: string;
  clientName?: string;
  viewCount: number;
}

export default function SolutionProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/phojaa95-solutions/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setProject(data.data);
          fetch(`/api/phojaa95-solutions/${slug}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "incrementView" }),
          }).catch(() => {});
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-sky" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <main className="container-apple py-24 text-center">
        <p className="text-ink-500 mb-6">Project not found.</p>
        <Link href="/phojaa95-solutions" className="btn-secondary">
          Back to Solutions
        </Link>
      </main>
    );
  }

  return (
    <main className="bg-background">
      <PageHero
        eyebrow={SERVICE_TYPE_LABELS[project.serviceType]}
        title={project.title}
        subtitle={project.summary}
        breadcrumbs={[
          { label: "Phojaa95 Solutions", href: "/phojaa95-solutions" },
          { label: project.title },
        ]}
      />

      <section className="section-y-sm">
        <div className="container-apple max-w-4xl">
          <Link
            href="/phojaa95-solutions"
            className="inline-flex items-center gap-1 text-[13px] text-ink-500 hover:text-foreground mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            All projects
          </Link>

          {project.coverImage && (
            <div className="relative aspect-[21/9] rounded-apple-xl overflow-hidden mb-8 bg-fog">
              <Image src={project.coverImage} alt="" fill className="object-cover" priority />
            </div>
          )}

          <div className="flex flex-wrap gap-3 mb-6">
            {project.projectUrl && (
              <a
                href={project.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2"
              >
                Live site <ExternalLink className="w-4 h-4" />
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-flex items-center gap-2"
              >
                View demo <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>

          {project.clientName && (
            <p className="text-[14px] text-ink-500 mb-4">
              <strong className="text-foreground">Client:</strong> {project.clientName}
            </p>
          )}

          {project.technologies?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {project.technologies.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] bg-sky/10 text-sky border border-sky/20"
                >
                  <Code2 className="w-3 h-3" />
                  {t}
                </span>
              ))}
            </div>
          )}

          {project.description && (
            <div
              className="prose prose-ink dark:prose-invert max-w-none text-[15px] leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: project.description.includes("<")
                  ? project.description
                  : project.description.replace(/\n/g, "<br>"),
              }}
            />
          )}

          {project.galleryImages?.length > 0 && (
            <div className="grid sm:grid-cols-2 gap-4 mt-10">
              {project.galleryImages.map((url) => (
                <div
                  key={url}
                  className="relative aspect-video rounded-xl overflow-hidden bg-fog"
                >
                  <Image src={url} alt="" fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section-y border-t border-ink-100 dark:border-ink-700/40 bg-fog/30">
        <div className="container-apple max-w-3xl mx-auto">
          <p className="text-center text-[15px] text-ink-500 mb-6">
            Want something similar? Tell us about your project.
          </p>
          <SolutionInquiryForm defaultServiceType={project.serviceType} />
        </div>
      </section>
    </main>
  );
}
