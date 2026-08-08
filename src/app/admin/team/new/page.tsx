"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

export default function NewTeamMemberPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        role: "",
        desc: "",
        quote: "",
        image: "",
        order: 0,
    });

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
    
        try {
            const fd = new FormData();
            fd.append("file", file);
            const res = await fetch("/api/upload", {
                method: "POST",
                body: fd,
            });
            const data = await res.json();
            if (data.success) {
                setFormData({ ...formData, image: data.url });
            } else {
                setFormData({ ...formData, image: URL.createObjectURL(file) });
                toast({ title: "Using Local Preview", description: "Cloudinary not configured." });
            }
        } catch {
            setFormData({ ...formData, image: URL.createObjectURL(file) });
            toast({ title: "Using Local Preview", description: "Cloudinary not configured." });
        } finally {
            setUploadingImage(false);
            e.target.value = "";
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.image) {
            toast({ title: "Image Required", description: "Please upload a portrait image.", variant: "destructive" });
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/admin/team", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (res.ok && data.success) {
                toast({ title: "Success", description: "Team member added successfully." });
                router.push("/admin/team");
            } else {
                throw new Error(data.error);
            }
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
            <header className="mb-8 flex items-center gap-4">
                <Link
                    href="/admin/team"
                    className="w-10 h-10 bg-card rounded-xl border border-ink-200 flex items-center justify-center text-ink-400 hover:text-sky hover:border-sky/30 transition-all shadow-sm"
                >
                    <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
                </Link>
                <div>
                    <h1 className="text-[28px] font-semibold text-foreground tracking-tight">Add Team Member</h1>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="admin-glass rounded-[20px] p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[13px] font-medium text-ink-600">Full Name *</label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Jigme Rabgay"
                                className="h-11 rounded-2xl border-ink-200 focus:border-sky focus:ring-[3px] focus:ring-sky/15"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[13px] font-medium text-ink-600">Role / Position *</label>
                            <Input
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                placeholder="e.g. Proprietor"
                                className="h-11 rounded-2xl border-ink-200 focus:border-sky focus:ring-[3px] focus:ring-sky/15"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[13px] font-medium text-ink-600">Display Order</label>
                            <Input
                                type="number"
                                value={formData.order}
                                onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                                className="h-11 rounded-2xl border-ink-200 focus:border-sky focus:ring-[3px] focus:ring-sky/15"
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[13px] font-medium text-ink-600">Description / Bio *</label>
                            <Textarea
                                value={formData.desc}
                                onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                                placeholder="Detailed biography and experience..."
                                className="rounded-2xl border-ink-200 focus:border-sky focus:ring-[3px] focus:ring-sky/15 min-h-[120px]"
                                required
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[13px] font-medium text-ink-600">Quote *</label>
                            <Input
                                value={formData.quote}
                                onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                                placeholder="Inspirational quote or personal mantra..."
                                className="h-11 rounded-2xl border-ink-200 focus:border-sky focus:ring-[3px] focus:ring-sky/15"
                                required
                            />
                        </div>

                        <div className="md:col-span-2 space-y-3">
                            <label className="text-[13px] font-medium text-ink-600">Portrait Image *</label>
                            <div className="flex items-center gap-6">
                                <label className="flex-1 max-w-xs cursor-pointer">
                                    <div className="h-32 border-2 border-dashed border-ink-200 rounded-2xl flex flex-col items-center justify-center hover:bg-sky/5 hover:border-sky transition-all">
                                        {uploadingImage ? (
                                            <Loader2 className="w-6 h-6 animate-spin text-sky mb-2" strokeWidth={1.5} />
                                        ) : (
                                            <Upload className="w-6 h-6 text-ink-300 mb-2" strokeWidth={1.5} />
                                        )}
                                        <span className="text-[13px] font-medium text-ink-500">
                                            {uploadingImage ? "Uploading..." : "Upload Image"}
                                        </span>
                                    </div>
                                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                </label>
                                {formData.image && (
                                    <div className="w-32 h-32 rounded-2xl overflow-hidden relative shadow-md">
                                        <Image src={formData.image} alt="Preview" fill className="object-cover" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 h-12 rounded-full bg-sky text-background text-sm font-medium transition-all hover:opacity-90 flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" strokeWidth={1.5} /> : "Save Member"}
                    </button>
                    <Link
                        href="/admin/team"
                        className="px-8 h-12 flex items-center justify-center rounded-[14px] border border-ink-200 text-ink-600 text-sm font-medium hover:bg-card transition-all"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}
