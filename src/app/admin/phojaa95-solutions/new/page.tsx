"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  SolutionProjectForm,
  type SolutionFormData,
} from "@/components/admin/SolutionProjectForm";
import { useToast } from "@/hooks/use-toast";

export default function NewSolutionProjectPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (data: SolutionFormData) => {
    const res = await fetch("/api/admin/phojaa95-solutions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (result.success) {
      toast({ title: "Project created" });
      router.push("/admin/phojaa95-solutions");
    } else {
      toast({
        title: "Failed",
        description: result.error || "Could not save",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-3xl mx-auto">
      <Link
        href="/admin/phojaa95-solutions"
        className="inline-flex items-center gap-1 text-[13px] text-ink-500 hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to portfolio
      </Link>
      <h1 className="text-xl font-semibold mb-6">New development project</h1>
      <SolutionProjectForm onSubmit={handleSubmit} submitLabel="Create project" />
    </div>
  );
}
