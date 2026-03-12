"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, X, Loader2, ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

export default function NewBlogPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [coverImage, setCoverImage] = useState("");
    const [uploadingImage, setUploadingImage] = useState(false);
    const [content, setContent] = useState("");
    const [formData, setFormData] = useState({
        title: "",
        author: "Admin",
        published: false,
        tags: "",
    });

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        const token = localStorage.getItem("adminToken");

        try {
            const fd = new FormData();
            fd.append("file", file);
            const res = await fetch("/api/upload", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: fd,
            });
            const data = await res.json();
            if (data.success) {
                setCoverImage(data.url);
                toast({ title: "Image Uploaded", description: "Cover image added successfully." });
            } else {
                throw new Error(data.error);
            }
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!coverImage) {
            toast({ title: "No Image", description: "Please upload a cover image.", variant: "destructive" });
            return;
        }
        if (!content || content === "<p></p>") {
            toast({ title: "No Content", description: "Please write some content for the blog post.", variant: "destructive" });
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/blogs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
                },
                body: JSON.stringify({
                    ...formData,
                    content,
                    coverImage,
                    tags: formData.tags.split(",").map((t) => t.trim()).filter((t) => t),
                }),
            });

            const data = await res.json();
            if (res.ok && data.success) {
                toast({ title: "Blog Created!", description: "High-quality content added successfully." });
                router.push("/admin/blogs");
            } else {
                throw new Error(data.error || "Failed to create blog");
            }
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputCls = "h-11 bg-white border-bhutan-gold/20 focus:border-bhutan-red/40 focus:ring-bhutan-red/10 rounded-xl text-bhutan-dark text-base font-medium";
    const labelCls = "block text-sm font-bold uppercase tracking-widest text-bhutan-dark/70 mb-1.5";

    return (
        <div className="p-4 md:p-6 lg:p-8 max-w-[1200px] mx-auto">
            <header className="mb-7 flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="w-10 h-10 bg-white rounded-xl border border-bhutan-gold/15 flex items-center justify-center text-bhutan-dark/40 hover:text-bhutan-red hover:scale-105 transition-all shadow-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                    <div className="flex items-center gap-2 mb-0.5">
                        <div className="w-0.5 h-4 bg-bhutan-red rounded-full" />
                        <p className="text-bhutan-red font-bold text-sm uppercase tracking-[0.3em]">New Post</p>
                    </div>
                    <h1 className="text-3xl font-bold text-bhutan-dark">Write Blog</h1>
                </div>
            </header>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl p-6 border border-bhutan-gold/10 shadow-sm">
                            <h2 className="font-bold text-bhutan-dark text-base mb-5 flex items-center gap-2">
                                <span className="w-1 h-4 bg-bhutan-red rounded-full" /> Blog Details
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className={labelCls}>Post Title *</label>
                                    <Input
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Enter a compelling title..."
                                        className={inputCls}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className={labelCls}>Content *</label>
                                    <RichTextEditor
                                        value={content}
                                        onChange={setContent}
                                        placeholder="Write your story here..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-bhutan-dark rounded-2xl p-5 border border-white/5 shadow-sm">
                            <h2 className="font-bold text-white text-base mb-4 flex items-center gap-2">
                                <ImageIcon className="w-4 h-4 text-bhutan-gold" /> Cover Image *
                            </h2>
                            <label htmlFor="blog-img" className="block cursor-pointer">
                                {coverImage ? (
                                    <div className="relative aspect-video rounded-xl overflow-hidden group">
                                        <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => setCoverImage("")}
                                            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-6 h-6 text-white" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className={`border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-bhutan-gold/40 hover:bg-white/5 transition-all ${uploadingImage ? "opacity-50 pointer-events-none" : ""}`}>
                                        {uploadingImage ? (
                                            <Loader2 className="w-8 h-8 text-bhutan-gold mx-auto animate-spin" />
                                        ) : (
                                            <>
                                                <Upload className="w-8 h-8 text-bhutan-gold/40 mx-auto mb-2" />
                                                <p className="text-white/60 text-sm font-bold uppercase tracking-wider">Upload Cover</p>
                                            </>
                                        )}
                                    </div>
                                )}
                                <input id="blog-img" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                            </label>
                        </div>

                        <div className="bg-white rounded-2xl p-5 border border-bhutan-gold/10 shadow-sm">
                            <h2 className="font-bold text-bhutan-dark text-base mb-4">Settings</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className={labelCls}>Author</label>
                                    <Input
                                        value={formData.author}
                                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                        className={inputCls}
                                    />
                                </div>
                                <div>
                                    <label className={labelCls}>Tags (comma separated)</label>
                                    <Input
                                        value={formData.tags}
                                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                        placeholder="Real Estate, Bhutan, Architecture"
                                        className={inputCls}
                                    />
                                </div>
                                <label className="flex items-center gap-3 p-3 bg-[#F9F7F2] rounded-xl cursor-pointer hover:bg-bhutan-gold/5 transition-colors border border-transparent hover:border-bhutan-gold/20">
                                    <input
                                        type="checkbox"
                                        checked={formData.published}
                                        onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                                        className="w-4 h-4 rounded text-bhutan-red focus:ring-bhutan-red cursor-pointer"
                                    />
                                    <div>
                                        <span className="text-sm font-bold text-bhutan-dark uppercase tracking-widest">Publish Now</span>
                                        <p className="text-xs text-bhutan-dark/40">Visible on frontend immediately</p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-12 bg-bhutan-red text-white rounded-xl font-bold uppercase tracking-[0.2em] text-sm hover:bg-bhutan-dark transition-all shadow-lg shadow-bhutan-red/20 disabled:opacity-60 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : "Post Blog"}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
