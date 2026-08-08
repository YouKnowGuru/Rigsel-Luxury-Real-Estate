"use client";

import { useState } from "react";
import { Loader2, ImageIcon, X, Plus, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { SOLUTION_SERVICE_TYPES } from "@/lib/solution-types";
import { SERVICE_TYPE_LABELS } from "@/lib/solution-labels";
import Image from "next/image";

export type SolutionFormData = {
  title: string;
  summary: string;
  description: string;
  serviceType: (typeof SOLUTION_SERVICE_TYPES)[number];
  technologies: string[];
  coverImage: string;
  galleryImages: string[];
  projectUrl: string;
  demoUrl: string;
  clientName: string;
  isPinned: boolean;
  isFeatured: boolean;
  isPublished: boolean;
  order: number;
};

const defaultForm: SolutionFormData = {
  title: "",
  summary: "",
  description: "",
  serviceType: "web-development",
  technologies: [],
  coverImage: "",
  galleryImages: [],
  projectUrl: "",
  demoUrl: "",
  clientName: "",
  isPinned: false,
  isFeatured: false,
  isPublished: true,
  order: 0,
};

type Props = {
  initial?: Partial<SolutionFormData>;
  onSubmit: (data: SolutionFormData) => Promise<void>;
  submitLabel?: string;
};

export function SolutionProjectForm({
  initial,
  onSubmit,
  submitLabel = "Publish project",
}: Props) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [techInput, setTechInput] = useState("");
  const [form, setForm] = useState<SolutionFormData>({
    ...defaultForm,
    ...initial,
    technologies: initial?.technologies ?? [],
    galleryImages: initial?.galleryImages ?? [],
  });

  const uploadFile = async (file: File, target: "cover" | "gallery") => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Upload failed");

      if (target === "cover") {
        setForm((p) => ({ ...p, coverImage: data.url }));
      } else {
        setForm((p) => ({
          ...p,
          galleryImages: [...p.galleryImages, data.url].slice(0, 12),
        }));
      }
      toast({ title: "Uploaded" });
    } catch (e) {
      toast({
        title: "Upload failed",
        description: e instanceof Error ? e.message : "Try again",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const addTech = () => {
    const t = techInput.trim();
    if (!t || form.technologies.length >= 20) return;
    if (form.technologies.includes(t)) return;
    setForm((p) => ({ ...p, technologies: [...p.technologies, t] }));
    setTechInput("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.summary.trim()) {
      toast({ title: "Title and summary are required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      await onSubmit(form);
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "rounded-xl";

  return (
    <form onSubmit={handleSubmit} className="admin-glass rounded-2xl p-5 sm:p-6 space-y-6 max-w-2xl">
      <div>
        <label className="text-[13px] font-medium text-ink-600">Service type</label>
        <select
          value={form.serviceType}
          onChange={(e) =>
            setForm((p) => ({
              ...p,
              serviceType: e.target.value as SolutionFormData["serviceType"],
            }))
          }
          className={cn("input-apple w-full mt-1", inputCls)}
        >
          {SOLUTION_SERVICE_TYPES.map((t) => (
            <option key={t} value={t}>
              {SERVICE_TYPE_LABELS[t]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-[13px] font-medium text-ink-600">Title</label>
        <Input
          className={cn("mt-1", inputCls)}
          value={form.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          required
        />
      </div>

      <div>
        <label className="text-[13px] font-medium text-ink-600">Summary</label>
        <Textarea
          className={cn("mt-1 min-h-[80px]", inputCls)}
          value={form.summary}
          onChange={(e) => setForm((p) => ({ ...p, summary: e.target.value }))}
          maxLength={500}
          required
        />
      </div>

      <div>
        <label className="text-[13px] font-medium text-ink-600">Description</label>
        <Textarea
          className={cn("mt-1 min-h-[140px]", inputCls)}
          value={form.description}
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
        />
      </div>

      <div>
        <label className="text-[13px] font-medium text-ink-600">Client name (optional)</label>
        <Input
          className={cn("mt-1", inputCls)}
          value={form.clientName}
          onChange={(e) => setForm((p) => ({ ...p, clientName: e.target.value }))}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[13px] font-medium text-ink-600">Live URL (optional)</label>
          <Input
            className={cn("mt-1", inputCls)}
            type="url"
            placeholder="https://"
            value={form.projectUrl}
            onChange={(e) => setForm((p) => ({ ...p, projectUrl: e.target.value }))}
          />
        </div>
        <div>
          <label className="text-[13px] font-medium text-ink-600">Demo URL (optional)</label>
          <Input
            className={cn("mt-1", inputCls)}
            type="url"
            placeholder="https://"
            value={form.demoUrl}
            onChange={(e) => setForm((p) => ({ ...p, demoUrl: e.target.value }))}
          />
        </div>
      </div>

      <div>
        <label className="text-[13px] font-medium text-ink-600 flex items-center gap-1">
          <Code2 className="w-3.5 h-3.5" /> Technologies
        </label>
        <div className="flex gap-2 mt-1">
          <Input
            className={inputCls}
            placeholder="e.g. Next.js"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTech())}
          />
          <Button type="button" variant="outline" onClick={addTech}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {form.technologies.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[12px] bg-sky/10 text-sky border border-sky/20"
            >
              {t}
              <button
                type="button"
                onClick={() =>
                  setForm((p) => ({
                    ...p,
                    technologies: p.technologies.filter((x) => x !== t),
                  }))
                }
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <label className="text-[13px] font-medium text-ink-600">Cover image</label>
        <div className="mt-2 flex items-start gap-4">
          {form.coverImage ? (
            <div className="relative w-40 h-24 rounded-xl overflow-hidden">
              <Image src={form.coverImage} alt="" fill className="object-cover" />
              <button
                type="button"
                className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white"
                onClick={() => setForm((p) => ({ ...p, coverImage: "" }))}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-40 h-24 border-2 border-dashed border-ink-200 rounded-xl cursor-pointer hover:border-sky/50">
              <ImageIcon className="w-6 h-6 text-ink-400" />
              <span className="text-[11px] text-ink-500 mt-1">Upload</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadFile(f, "cover");
                }}
              />
            </label>
          )}
        </div>
      </div>

      <div>
        <label className="text-[13px] font-medium text-ink-600">Gallery (optional)</label>
        <div className="flex flex-wrap gap-2 mt-2">
          {form.galleryImages.map((url) => (
            <div key={url} className="relative w-20 h-14 rounded-lg overflow-hidden">
              <Image src={url} alt="" fill className="object-cover" />
              <button
                type="button"
                className="absolute top-0.5 right-0.5 p-0.5 bg-black/50 rounded text-white"
                onClick={() =>
                  setForm((p) => ({
                    ...p,
                    galleryImages: p.galleryImages.filter((u) => u !== url),
                  }))
                }
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {form.galleryImages.length < 12 && (
            <label className="w-20 h-14 flex items-center justify-center border border-dashed rounded-lg cursor-pointer">
              <Plus className="w-4 h-4 text-ink-400" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadFile(f, "gallery");
                }}
              />
            </label>
          )}
        </div>
      </div>

      <div>
        <label className="text-[13px] font-medium text-ink-600">Display order</label>
        <Input
          type="number"
          min={0}
          className={cn("mt-1 w-24", inputCls)}
          value={form.order}
          onChange={(e) => setForm((p) => ({ ...p, order: parseInt(e.target.value, 10) || 0 }))}
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-[13px]">
          <input
            type="checkbox"
            checked={form.isPublished}
            onChange={(e) => setForm((p) => ({ ...p, isPublished: e.target.checked }))}
          />
          Published
        </label>
        <label className="flex items-center gap-2 text-[13px]">
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={(e) => setForm((p) => ({ ...p, isFeatured: e.target.checked }))}
          />
          Featured
        </label>
        <label className="flex items-center gap-2 text-[13px]">
          <input
            type="checkbox"
            checked={form.isPinned}
            onChange={(e) => setForm((p) => ({ ...p, isPinned: e.target.checked }))}
          />
          Pinned
        </label>
      </div>

      <Button type="submit" disabled={saving || uploading}>
        {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
        {submitLabel}
      </Button>
    </form>
  );
}
