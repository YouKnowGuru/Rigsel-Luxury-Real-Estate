"use client";

import { useState } from "react";
import {
  checkPanoramaDimensions,
  loadImageDimensions,
} from "@/lib/panorama-url";
import { Loader2, ImageIcon, X, Plus, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const categories = [
  "Residential",
  "Commercial",
  "Interior",
  "Exterior",
  "Traditional",
  "Landscape",
];

export type ArchitectureFormData = {
  title: string;
  summary: string;
  description: string;
  category: string;
  location: string;
  district: string;
  architect: string;
  coverImage: string;
  panoramaUrl: string;
  scenes: { id: string; title: string; panoramaUrl: string }[];
  isPinned: boolean;
  isFeatured: boolean;
  isPublished: boolean;
  order: number;
};

const defaultForm: ArchitectureFormData = {
  title: "",
  summary: "",
  description: "",
  category: "Residential",
  location: "",
  district: "",
  architect: "",
  coverImage: "",
  panoramaUrl: "",
  scenes: [],
  isPinned: false,
  isFeatured: false,
  isPublished: true,
  order: 0,
};

type Props = {
  initial?: Partial<ArchitectureFormData>;
  onSubmit: (data: ArchitectureFormData) => Promise<void>;
  submitLabel?: string;
};

export function ArchitectureDesignForm({
  initial,
  onSubmit,
  submitLabel = "Publish design",
}: Props) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [form, setForm] = useState<ArchitectureFormData>({
    ...defaultForm,
    ...initial,
    scenes: initial?.scenes ?? [],
  });

  const uploadFile = async (file: File, field: "coverImage" | "panoramaUrl" | number) => {
    setUploading(field === "coverImage" ? "cover" : field === "panoramaUrl" ? "pano" : `scene-${field}`);
    try {
      if (field !== "coverImage") {
        const localUrl = URL.createObjectURL(file);
        try {
          const { width, height } = await loadImageDimensions(localUrl);
          const check = checkPanoramaDimensions(width, height);
          if (!check.valid) {
            toast({
              title: "Not a 360° panorama",
              description: check.hint,
              variant: "destructive",
            });
            return;
          }
        } catch {
          /* continue if local preview fails */
        } finally {
          URL.revokeObjectURL(localUrl);
        }
      }

      const fd = new FormData();
      fd.append("file", file);
      if (field !== "coverImage") {
        fd.append("purpose", "panorama");
      }
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Upload failed");

      if (field === "coverImage") {
        setForm((p) => ({ ...p, coverImage: data.url }));
      } else if (field === "panoramaUrl") {
        setForm((p) => ({ ...p, panoramaUrl: data.url }));
      } else {
        setForm((p) => {
          const scenes = [...p.scenes];
          scenes[field] = { ...scenes[field], panoramaUrl: data.url };
          return { ...p, scenes };
        });
      }
      toast({
        title: field === "coverImage" ? "Cover uploaded" : "360° panorama uploaded",
        description:
          field === "coverImage"
            ? "Thumbnail saved."
            : "Valid 2:1 panorama — will show immersive view on site.",
      });
    } catch (e: unknown) {
      toast({
        title: "Upload failed",
        description: e instanceof Error ? e.message : "Try again",
        variant: "destructive",
      });
    } finally {
      setUploading(null);
    }
  };

  const addScene = () => {
    const id = `scene-${Date.now()}`;
    setForm((p) => ({
      ...p,
      scenes: [...p.scenes, { id, title: "New room", panoramaUrl: "" }],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.panoramaUrl.trim()) {
      toast({
        title: "Required fields",
        description: "Title and main 360° panorama image are required.",
        variant: "destructive",
      });
      return;
    }
    if (!form.summary.trim()) {
      setForm((p) => ({
        ...p,
        summary: p.description.slice(0, 200) || p.title,
      }));
    }

    setSaving(true);
    try {
      await onSubmit({
        ...form,
        scenes: form.scenes.filter((s) => s.panoramaUrl.trim()),
      });
    } finally {
      setSaving(false);
    }
  };

  const labelCls =
    "text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-500 mb-1.5 block";
  const inputCls =
    "bg-card border-ink-100/80 dark:border-ink-700/50 rounded-xl h-11";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-card border border-ink-100/60 dark:border-ink-700/40 rounded-2xl p-5 sm:p-6 space-y-4">
        <h2 className="font-semibold text-foreground flex items-center gap-2">
          <Box className="w-4 h-4 text-sky" />
          Project details
        </h2>

        <div>
          <label className={labelCls}>Title *</label>
          <Input
            className={inputCls}
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            placeholder="Modern farmhouse — Paro"
            required
          />
        </div>

        <div>
          <label className={labelCls}>Short summary *</label>
          <Textarea
            className={cn(inputCls, "min-h-[80px]")}
            value={form.summary}
            onChange={(e) => setForm((p) => ({ ...p, summary: e.target.value }))}
            placeholder="Brief description for cards and search"
          />
        </div>

        <div>
          <label className={labelCls}>Full description</label>
          <Textarea
            className={cn(inputCls, "min-h-[120px]")}
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Category</label>
            <select
              className={cn(inputCls, "w-full px-3")}
              value={form.category}
              onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Sort order</label>
            <Input
              type="number"
              className={inputCls}
              value={form.order}
              onChange={(e) =>
                setForm((p) => ({ ...p, order: parseInt(e.target.value, 10) || 0 }))
              }
            />
          </div>
          <div>
            <label className={labelCls}>Location</label>
            <Input
              className={inputCls}
              value={form.location}
              onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
            />
          </div>
          <div>
            <label className={labelCls}>District</label>
            <Input
              className={inputCls}
              value={form.district}
              onChange={(e) => setForm((p) => ({ ...p, district: e.target.value }))}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Architect / designer</label>
            <Input
              className={inputCls}
              value={form.architect}
              onChange={(e) => setForm((p) => ({ ...p, architect: e.target.value }))}
            />
          </div>
        </div>
      </div>

      <div className="bg-card border border-ink-100/60 dark:border-ink-700/40 rounded-2xl p-5 sm:p-6 space-y-4">
        <h2 className="font-semibold text-foreground">Images</h2>
        <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-4 text-[13px] text-ink-600 space-y-2">
          <p className="font-semibold text-foreground">
            Important: normal photos will NOT work
          </p>
          <p>
            Listing photos, room shots, and phone snapshots look flat and boring in
            the 360 viewer. You need a <strong>photo sphere</strong> (equirectangular,
            2:1 wide).
          </p>
          <ul className="list-disc pl-5 space-y-1 text-ink-500">
            <li>
              <strong>Free:</strong> Google Street View app → Camera → 360° photo
            </li>
            <li>
              Use <strong>high resolution</strong> — at least <strong>4096×2048</strong>,
              ideally <strong>6000×3000</strong> or higher (blurry 360° = file too small)
            </li>
            <li>
              <strong>Cover thumbnail</strong> below can be any normal JPG (for the
              card only)
            </li>
          </ul>
        </div>

        <UploadField
          label="Cover thumbnail (card)"
          url={form.coverImage}
          uploading={uploading === "cover"}
          onUpload={(f) => uploadFile(f, "coverImage")}
          onClear={() => setForm((p) => ({ ...p, coverImage: "" }))}
        />

        <UploadField
          label="Main 360° panorama *"
          url={form.panoramaUrl}
          uploading={uploading === "pano"}
          onUpload={(f) => uploadFile(f, "panoramaUrl")}
          onClear={() => setForm((p) => ({ ...p, panoramaUrl: "" }))}
          required
        />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className={labelCls}>Extra rooms / scenes (optional)</label>
            <Button type="button" variant="outline" size="sm" onClick={addScene}>
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add scene
            </Button>
          </div>
          {form.scenes.map((scene, idx) => (
            <div
              key={scene.id}
              className="p-4 rounded-xl border border-ink-100 dark:border-ink-700/40 space-y-3"
            >
              <div className="flex gap-2">
                <Input
                  className={inputCls}
                  value={scene.title}
                  onChange={(e) => {
                    const scenes = [...form.scenes];
                    scenes[idx] = { ...scene, title: e.target.value };
                    setForm((p) => ({ ...p, scenes }));
                  }}
                  placeholder="Scene name"
                />
                <button
                  type="button"
                  onClick={() =>
                    setForm((p) => ({
                      ...p,
                      scenes: p.scenes.filter((_, i) => i !== idx),
                    }))
                  }
                  className="shrink-0 w-10 h-10 rounded-xl border border-ink-100 flex items-center justify-center text-ink-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <UploadField
                label="Scene panorama"
                url={scene.panoramaUrl}
                uploading={uploading === `scene-${idx}`}
                onUpload={(f) => uploadFile(f, idx)}
                onClear={() => {
                  const scenes = [...form.scenes];
                  scenes[idx] = { ...scene, panoramaUrl: "" };
                  setForm((p) => ({ ...p, scenes }));
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        {(
          [
            ["isPublished", "Published on site"],
            ["isFeatured", "Featured on homepage"],
            ["isPinned", "Pinned on listing page"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="flex items-center gap-2 text-[14px] cursor-pointer">
            <input
              type="checkbox"
              checked={form[key]}
              onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.checked }))}
              className="rounded border-ink-200 text-sky focus:ring-sky"
            />
            {label}
          </label>
        ))}
      </div>

      <Button type="submit" disabled={saving} className="w-full sm:w-auto">
        {saving ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Saving…
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </form>
  );
}

function UploadField({
  label,
  url,
  uploading,
  onUpload,
  onClear,
  required,
}: {
  label: string;
  url: string;
  uploading: boolean;
  onUpload: (f: File) => void;
  onClear: () => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-500 mb-1.5 block">
        {label}
        {required ? " *" : ""}
      </label>
      {url ? (
        <div className="relative rounded-xl overflow-hidden border border-ink-100 aspect-[2/1] max-h-40 bg-fog">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={onClear}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center gap-2 h-28 rounded-xl border-2 border-dashed border-ink-200 hover:border-sky cursor-pointer transition-colors">
          {uploading ? (
            <Loader2 className="w-6 h-6 animate-spin text-sky" />
          ) : (
            <>
              <ImageIcon className="w-6 h-6 text-ink-400" />
              <span className="text-[13px] text-ink-500">Click to upload</span>
            </>
          )}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onUpload(f);
              e.target.value = "";
            }}
          />
        </label>
      )}
    </div>
  );
}
