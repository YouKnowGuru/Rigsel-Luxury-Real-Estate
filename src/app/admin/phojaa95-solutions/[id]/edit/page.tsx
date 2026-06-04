"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import {
  SolutionProjectForm,
  type SolutionFormData,
} from "@/components/admin/SolutionProjectForm";
import { useToast } from "@/hooks/use-toast";
import type { SolutionServiceType } from "@/lib/solution-types";

export default function EditSolutionProjectPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const [initial, setInitial] = useState<Partial<SolutionFormData> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/phojaa95-solutions/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          const p = data.data;
          setInitial({
            title: p.title,
            summary: p.summary,
            description: p.description || "",
            serviceType: p.serviceType as SolutionServiceType,
            technologies: p.technologies || [],
            coverImage: p.coverImage || "",
            galleryImages: p.galleryImages || [],
            projectUrl: p.projectUrl || "",
            demoUrl: p.demoUrl || "",
            clientName: p.clientName || "",
            isPinned: p.isPinned,
            isFeatured: p.isFeatured,
            isPublished: p.isPublished,
            order: p.order ?? 0,
          });
        } else {
          toast({ title: "Not found", variant: "destructive" });
          router.push("/admin/phojaa95-solutions");
        }
      })
      .finally(() => setLoading(false));
  }, [id, router, toast]);

  const handleSubmit = async (data: SolutionFormData) => {
    const res = await fetch(`/api/admin/phojaa95-solutions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (result.success) {
      toast({ title: "Project updated" });
      router.push("/admin/phojaa95-solutions");
    } else {
      toast({
        title: "Failed",
        description: result.error || "Could not save",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-sky" />
      </div>
    );
  }

  if (!initial) return null;

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-3xl mx-auto">
      <Link
        href="/admin/phojaa95-solutions"
        className="inline-flex items-center gap-1 text-[13px] text-ink-500 hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to portfolio
      </Link>
      <h1 className="text-xl font-semibold mb-6">Edit project</h1>
      <SolutionProjectForm
        initial={initial}
        onSubmit={handleSubmit}
        submitLabel="Save changes"
      />
    </div>
  );
}
