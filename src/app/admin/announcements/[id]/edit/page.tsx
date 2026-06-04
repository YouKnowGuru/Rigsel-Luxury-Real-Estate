"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
    Megaphone,
    Plus,
    Loader2,
    ImageIcon,
    X,
    Sparkles,
    Calendar,
    Clock,
    Pin,
    Eye,
    EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(
    () => import("@/components/admin/RichTextEditor").then((m) => m.RichTextEditor),
    { ssr: false, loading: () => <div className="h-[200px] bg-card border border-ink-100/60 rounded-2xl animate-pulse" /> }
);

const categories = ["General", "Promotion", "Event", "Update", "Alert"];
const priorities = [
    { value: "low", label: "Low" },
    { value: "normal", label: "Normal" },
    { value: "high", label: "High" },
    { value: "urgent", label: "Urgent" },
];

interface Announcement {
    _id: string;
    title: string;
    content: string;
    summary: string;
    category: string;
    priority: "low" | "normal" | "high" | "urgent";
    isPinned: boolean;
    isPublished: boolean;
    publishedAt: string;
    expiresAt?: string;
    coverImage?: string;
    author: string;
}

export default function EditAnnouncementPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    const [formData, setFormData] = useState<Announcement>({
        _id: "",
        title: "",
        content: "",
        summary: "",
        category: "General",
        priority: "normal",
        isPinned: false,
        isPublished: true,
        publishedAt: new Date().toISOString(),
        expiresAt: undefined,
        coverImage: "",
        author: "Admin",
    });

    useEffect(() => {
        if (!id) return;
        fetchAnnouncement();
    }, [id]);

    const fetchAnnouncement = async () => {
        try {
            const res = await fetch(`/api/admin/announcements/${id}`);
            const data = await res.json();
            if (data.success) {
                const a = data.data;
                setFormData({
                    ...a,
                    publishedAt: a.publishedAt ? new Date(a.publishedAt).toISOString().slice(0, 16) : "",
                    expiresAt: a.expiresAt ? new Date(a.expiresAt).toISOString().slice(0, 16) : "",
                });
            } else {
                throw new Error(data.error);
            }
        } catch (error: any) {
            toast({ title: "Error", description: error.message || "Failed to load announcement", variant: "destructive" });
            router.push("/admin/announcements");
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        try {
            const fd = new FormData();
            fd.append("file", file);
            const res = await fetch("/api/upload", { method: "POST", body: fd });
            const data = await res.json();
            if (data.success) {
                setFormData((prev) => ({ ...prev, coverImage: data.url }));
                toast({ title: "Image Uploaded", description: "Cover image updated successfully." });
            } else throw new Error(data.error);
        } catch (error: any) {
            toast({ title: "Upload Failed", description: error.message, variant: "destructive" });
        } finally {
            setUploadingImage(false);
        }
    };

    const generateSummary = useCallback(() => {
        const plainText = formData.content
            .replace(/<[^>]*>/g, " ")
            .replace(/\s+/g, " ")
            .trim();
        const summary = plainText.length > 200 ? plainText.substring(0, 200) + "..." : plainText;
        setFormData((prev) => ({ ...prev, summary }));
        toast({ title: "Summary Generated", description: "Auto-generated from content." });
    }, [formData.content, toast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.content.trim()) {
            toast({ title: "Validation Error", description: "Title and content are required.", variant: "destructive" });
            return;
        }

        if (!formData.summary.trim()) {
            generateSummary();
        }

        setSaving(true);
        try {
            const payload = {
                ...formData,
                publishedAt: formData.publishedAt ? new Date(formData.publishedAt).toISOString() : undefined,
                expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : null,
                coverImage: formData.coverImage || null,
            };

            const res = await fetch(`/api/admin/announcements/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();

            if (data.success) {
                toast({ title: "Success", description: "Announcement updated successfully." });
                router.push("/admin/announcements");
            } else {
                throw new Error(data.error || "Failed to update");
            }
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 animate-spin text-sky mb-3 sm:mb-4" strokeWidth={1.5} />
                <p className="text-ink-500 font-medium text-xs sm:text-sm">Loading announcement...</p>
            </div>
        );
    }

    return (
        <div className="p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8 max-w-4xl mx-auto">
            <div className="mb-6 sm:mb-8">
                <p className="text-sky text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.12em] mb-1">
                    Communications
                </p>
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-[28px] font-semibold text-foreground tracking-tight flex items-center gap-2 sm:gap-3">
                    <Megaphone className="text-sky w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 shrink-0" strokeWidth={1.5} />
                    Edit Announcement
                </h1>
            </div>

            <motion.form
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                onSubmit={handleSubmit}
                className="space-y-5 sm:space-y-6"
            >
                {/* Title */}
                <div>
                    <label className="block text-[11px] sm:text-[13px] font-medium text-ink-600 mb-1.5 sm:mb-2">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <Input
                        placeholder="e.g., New Property Listings Available in Thimphu"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="h-10 sm:h-11 md:h-12 rounded-xl border-ink-200 focus:border-sky focus:ring-2 focus:ring-sky/15 text-foreground text-sm md:text-base font-medium placeholder:text-ink-400"
                    />
                </div>

                {/* Content */}
                <div>
                    <label className="block text-[11px] sm:text-[13px] font-medium text-ink-600 mb-1.5 sm:mb-2">
                        Content <span className="text-red-500">*</span>
                    </label>
                    <RichTextEditor
                        value={formData.content}
                        onChange={(value) => setFormData({ ...formData, content: value })}
                        placeholder="Write your announcement content here..."
                    />
                </div>

                {/* Summary */}
                <div>
                    <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                        <label className="block text-[11px] sm:text-[13px] font-medium text-ink-600">
                            Summary <span className="text-red-500">*</span>
                        </label>
                        <button
                            type="button"
                            onClick={generateSummary}
                            className="flex items-center gap-1 text-[11px] sm:text-xs text-sky hover:text-sky/80 font-medium transition-colors"
                        >
                            <Sparkles className="w-3 h-3" strokeWidth={1.5} />
                            Auto-generate
                        </button>
                    </div>
                    <Textarea
                        placeholder="Short preview text shown in the announcement list..."
                        required
                        rows={2}
                        value={formData.summary}
                        onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                        className="rounded-xl border-ink-200 focus:border-sky focus:ring-2 focus:ring-sky/15 text-foreground text-sm font-medium placeholder:text-ink-400 resize-none"
                    />
                    <p className="text-[11px] text-ink-400 mt-1">{formData.summary.length}/500 characters</p>
                </div>

                {/* Settings Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                        <label className="block text-[11px] sm:text-[13px] font-medium text-ink-600 mb-1.5 sm:mb-2">
                            Category
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, category: cat })}
                                    className={cn(
                                        "px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
                                        formData.category === cat
                                            ? "bg-sky text-background border-sky shadow-soft"
                                            : "bg-card border-ink-200 text-ink-500 hover:text-foreground hover:border-ink-300"
                                    )}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-[11px] sm:text-[13px] font-medium text-ink-600 mb-1.5 sm:mb-2">
                            Priority
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                            {priorities.map((p) => (
                                <button
                                    key={p.value}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, priority: p.value as any })}
                                    className={cn(
                                        "px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
                                        formData.priority === p.value
                                            ? "bg-sky text-background border-sky shadow-soft"
                                            : "bg-card border-ink-200 text-ink-500 hover:text-foreground hover:border-ink-300"
                                    )}
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-[11px] sm:text-[13px] font-medium text-ink-600 mb-1.5 sm:mb-2">
                            <Calendar className="w-3 h-3 inline mr-1" strokeWidth={1.5} />
                            Publish Date
                        </label>
                        <Input
                            type="datetime-local"
                            value={formData.publishedAt}
                            onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                            className="h-10 sm:h-11 rounded-xl border-ink-200 focus:border-sky focus:ring-2 focus:ring-sky/15 text-foreground text-sm font-medium"
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] sm:text-[13px] font-medium text-ink-600 mb-1.5 sm:mb-2">
                            <Clock className="w-3 h-3 inline mr-1" strokeWidth={1.5} />
                            Expiry Date <span className="text-ink-400 font-normal">(optional)</span>
                        </label>
                        <Input
                            type="datetime-local"
                            value={formData.expiresAt || ""}
                            onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                            className="h-10 sm:h-11 rounded-xl border-ink-200 focus:border-sky focus:ring-2 focus:ring-sky/15 text-foreground text-sm font-medium"
                        />
                    </div>
                </div>

                {/* Cover Image */}
                <div>
                    <label className="block text-[11px] sm:text-[13px] font-medium text-ink-600 mb-1.5 sm:mb-2">
                        <ImageIcon className="w-3 h-3 inline mr-1" strokeWidth={1.5} />
                        Cover Image <span className="text-ink-400 font-normal">(optional)</span>
                    </label>
                    <div className="relative group">
                        <div
                            className={cn(
                                "border-2 border-dashed rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all flex flex-col items-center justify-center cursor-pointer min-h-[120px] sm:min-h-[160px]",
                                formData.coverImage ? "border-sky bg-sky/5" : "border-ink-200 hover:border-sky/30 hover:bg-sky/5"
                            )}
                        >
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={handleImageUpload}
                                disabled={uploadingImage}
                            />
                            {uploadingImage ? (
                                <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-sky" strokeWidth={1.5} />
                            ) : formData.coverImage ? (
                                <div className="relative w-full">
                                    <img
                                        src={formData.coverImage}
                                        alt="Cover"
                                        className="w-full h-32 sm:h-40 object-cover rounded-xl"
                                    />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setFormData({ ...formData, coverImage: "" });
                                        }}
                                        className="absolute top-2 right-2 w-7 h-7 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                                    >
                                        <X className="w-3.5 h-3.5" strokeWidth={2} />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-card rounded-xl sm:rounded-[14px] shadow-soft flex items-center justify-center mb-2 sm:mb-3 text-ink-400 group-hover:text-sky transition-colors border border-ink-100/60">
                                        <Plus className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.5} />
                                    </div>
                                    <p className="text-xs sm:text-sm font-medium text-foreground">Click to upload cover image</p>
                                    <p className="text-[11px] sm:text-xs text-ink-400 mt-1 font-medium">JPG, PNG, WebP up to 10MB</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Toggles */}
                <div className="flex flex-wrap gap-3 sm:gap-4">
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, isPinned: !formData.isPinned })}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all",
                            formData.isPinned
                                ? "bg-sky/10 border-sky/30 text-sky"
                                : "bg-card border-ink-200 text-ink-500 hover:text-foreground"
                        )}
                    >
                        <Pin className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4", formData.isPinned && "fill-current")} strokeWidth={1.5} />
                        {formData.isPinned ? "Pinned" : "Pin to Top"}
                    </button>
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, isPublished: !formData.isPublished })}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all",
                            formData.isPublished
                                ? "bg-emerald-500/10 border-emerald-200 text-emerald-600"
                                : "bg-amber-500/10 border-amber-200 text-amber-600"
                        )}
                    >
                        {formData.isPublished ? (
                            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={1.5} />
                        ) : (
                            <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={1.5} />
                        )}
                        {formData.isPublished ? "Published" : "Draft"}
                    </button>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-ink-100/60">
                    <Button
                        type="submit"
                        disabled={saving}
                        className="h-10 sm:h-11 md:h-12 px-6 sm:px-8 bg-sky hover:bg-sky/90 text-background font-medium rounded-full transition-all shadow-soft text-sm sm:text-base"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" strokeWidth={1.5} />
                                Saving...
                            </>
                        ) : (
                            "Update Announcement"
                        )}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/admin/announcements")}
                        className="h-10 sm:h-11 md:h-12 px-6 rounded-full border-ink-200 text-ink-500 hover:text-foreground hover:border-ink-300 text-sm sm:text-base"
                    >
                        Cancel
                    </Button>
                </div>
            </motion.form>
        </div>
    );
}
