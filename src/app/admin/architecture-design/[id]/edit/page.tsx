"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Box, ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  ArchitectureDesignForm,
  type ArchitectureFormData,
} from "@/components/admin/ArchitectureDesignForm";

export default function EditArchitectureDesignPage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [initial, setInitial] = useState<Partial<ArchitectureFormData> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/architecture-design/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          const d = data.data;
          setInitial({
            title: d.title,
            summary: d.summary,
            description: d.description || "",
            category: d.category,
            location: d.location || "",
            district: d.district || "",
            architect: d.architect || "",
            coverImage: d.coverImage || "",
            panoramaUrl: d.panoramaUrl,
            scenes: d.scenes || [],
            isPinned: d.isPinned,
            isFeatured: d.isFeatured,
            isPublished: d.isPublished,
            order: d.order ?? 0,
          });
        } else {
          toast({ title: "Not found", variant: "destructive" });
          router.push("/admin/architecture-design");
        }
      })
      .finally(() => setLoading(false));
  }, [id, router, toast]);

  const handleSubmit = async (form: ArchitectureFormData) => {
    try {
      const res = await fetch(`/api/admin/architecture-design/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: "Updated" });
        router.push("/admin/architecture-design");
      } else {
        throw new Error(data.error || "Failed to update");
      }
    } catch (e: unknown) {
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "Failed to update",
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

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-3xl mx-auto">
      <Link
        href="/admin/architecture-design"
        className="inline-flex items-center gap-1 text-[13px] text-ink-500 hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>
      <h1 className="text-xl md:text-2xl font-semibold flex items-center gap-2 mb-8">
        <Box className="w-6 h-6 text-sky" />
        Edit 360° design
      </h1>
      {initial && (
        <ArchitectureDesignForm
          initial={initial}
          onSubmit={handleSubmit}
          submitLabel="Save changes"
        />
      )}
    </div>
  );
}
