"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Box, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  ArchitectureDesignForm,
  type ArchitectureFormData,
} from "@/components/admin/ArchitectureDesignForm";

export default function NewArchitectureDesignPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (form: ArchitectureFormData) => {
    try {
      const res = await fetch("/api/admin/architecture-design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        toast({
          title: "Published",
          description: form.isPublished
            ? "360° design is live on the site."
            : "Saved as draft.",
        });
        router.push("/admin/architecture-design");
      } else {
        throw new Error(data.error || "Failed to save");
      }
    } catch (e: unknown) {
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "Failed to save",
        variant: "destructive",
      });
    }
  };

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
        New 360° architecture design
      </h1>
      <ArchitectureDesignForm onSubmit={handleSubmit} submitLabel="Publish 360° tour" />
    </div>
  );
}
