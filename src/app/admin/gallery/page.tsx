"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Loader2, Image as ImageIcon, Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GalleryItem {
    _id: string;
    image: string;
    category: string;
    title?: string;
    createdAt: string;
}

const categories = ["All", "Interior", "Exterior", "Landscape", "Events", "Team", "Others"];

export default function GalleryPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [newImage, setNewImage] = useState({ image: "", category: "Exterior", title: "" });

    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        try {
            const res = await fetch("/api/gallery");
            const data = await res.json();
            if (data.success) setItems(data.data);
        } catch (error) {
            console.error("Error fetching gallery:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
    
        try {
            const fd = new FormData();
            fd.append("file", file);
            const res = await fetch("/api/upload", {
                method: "POST",
                body: fd,
            });
            const data = await res.json();
            if (data.success) {
                setNewImage({ ...newImage, image: data.url });
                toast({ title: "Image Uploaded", description: "Ready to save to gallery." });
            }
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        if (!newImage.image) return;

        try {
            const res = await fetch("/api/gallery", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newImage),
            });
            const data = await res.json();
            if (data.success) {
                toast({ title: "Success", description: "Image added to gallery." });
                setIsUploadModalOpen(false);
                setNewImage({ image: "", category: "Exterior", title: "" });
                fetchGallery();
            }
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Remove this image from gallery?")) return;
        try {
            const res = await fetch(`/api/gallery/${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                toast({ title: "Deleted", description: "Image removed successfully." });
                fetchGallery();
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete.", variant: "destructive" });
        }
    };

    const filteredItems = items.filter(item => selectedCategory === "All" || item.category === selectedCategory);

    return (
        <div className="p-3 sm:p-5 lg:p-8 max-w-[1600px] mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Header */}
            <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4">
                <div>
                    <p className="text-sky text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.12em] mb-1">Visual Assets</p>
                    <h1 className="text-[22px] sm:text-[26px] lg:text-[28px] font-semibold text-foreground tracking-tight">Photo Gallery</h1>
                    <p className="text-ink-600 text-sm sm:text-base font-medium mt-1">Manage and organize property photos</p>
                </div>

                <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="h-9 sm:h-11 px-4 sm:px-6 bg-sky text-background text-xs sm:text-sm font-medium rounded-full hover:bg-sky/90 transition-all duration-300 shadow-soft flex items-center gap-1.5 sm:gap-2 group self-start sm:self-auto"
                >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-90 transition-transform duration-300" strokeWidth={1.5} />
                    <span className="hidden sm:inline">Add To Gallery</span>
                    <span className="sm:hidden">Add</span>
                </button>
            </header>

            {/* Categories */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-xl sm:rounded-[14px] text-xs sm:text-sm font-medium transition-all border ${selectedCategory === cat
                                ? "bg-sky text-background border-sky shadow-soft"
                                : "bg-card text-ink-500 border-ink-100 hover:border-sky/30 hover:text-sky"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Gallery Grid */}
            {isLoading ? (
                <div className="admin-glass rounded-[20px] py-12 sm:py-20 flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-sky animate-spin" strokeWidth={1.5} />
                    <p className="text-ink-400 text-[13px] font-medium">Loading gallery...</p>
                </div>
            ) : (
                <motion.div
                    layout
                    className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6"
                >
                    <AnimatePresence>
                        {filteredItems.map((item) => (
                            <motion.div
                                key={item._id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="group relative aspect-square admin-glass rounded-xl sm:rounded-[20px] overflow-hidden"
                            >
                                <img src={item.image} alt={item.title || "Gallery"} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-ink-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-3 sm:p-6">
                                    <p className="text-sky text-[10px] sm:text-[12px] font-semibold uppercase tracking-[0.12em] mb-0.5 sm:mb-1">{item.category}</p>
                                    <h4 className="text-white font-semibold text-sm sm:text-lg mb-2 sm:mb-4 truncate">{item.title || "Gallery Image"}</h4>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleDelete(item._id)}
                                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-[14px] bg-card/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={1.5} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}

            {/* Upload Modal */}
            <AnimatePresence>
                {isUploadModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsUploadModalOpen(false)}
                            className="absolute inset-0 bg-ink-900/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg bg-card rounded-2xl sm:rounded-[20px] overflow-hidden shadow-elevated border border-ink-100/60"
                        >
                            <div className="p-4 sm:p-8">
                                <div className="flex items-center justify-between mb-4 sm:mb-8">
                                    <h3 className="text-lg sm:text-xl font-semibold text-foreground">Add New Asset</h3>
                                    <button onClick={() => setIsUploadModalOpen(false)} className="text-ink-300 hover:text-red-500 transition-colors">
                                        <X className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.5} />
                                    </button>
                                </div>

                                <div className="space-y-4 sm:space-y-6">
                                    {/* Image Preview / Upload */}
                                    <label className="block cursor-pointer">
                                        {newImage.image ? (
                                            <div className="relative aspect-video rounded-xl sm:rounded-2xl overflow-hidden shadow-soft border border-ink-100/60">
                                                <img src={newImage.image} alt="Preview" className="w-full h-full object-cover" />
                                                <button
                                                    onClick={(e) => { e.preventDefault(); setNewImage({ ...newImage, image: "" }); }}
                                                    className="absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-soft"
                                                >
                                                    <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={1.5} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className={`aspect-video rounded-xl sm:rounded-2xl border-2 border-dashed border-ink-200 bg-card/50 flex flex-col items-center justify-center text-center p-4 sm:p-6 hover:border-sky/40 transition-all ${uploading ? "opacity-50" : ""}`}>
                                                {uploading ? (
                                                    <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-sky animate-spin" strokeWidth={1.5} />
                                                ) : (
                                                    <>
                                                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-sky/10 flex items-center justify-center mb-3 sm:mb-4">
                                                            <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-sky" strokeWidth={1.5} />
                                                        </div>
                                                        <p className="text-ink-600 font-medium text-xs sm:text-sm">Select Image</p>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                    </label>

                                    <div>
                                        <label className="block text-xs sm:text-[13px] font-medium text-ink-600 mb-1.5 sm:mb-2">Entry Title</label>
                                        <input
                                            type="text"
                                            placeholder="Optional title..."
                                            value={newImage.title}
                                            onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                                            className="w-full h-9 sm:h-11 px-3 sm:px-4 bg-card rounded-xl sm:rounded-2xl border border-ink-200 focus:outline-none focus:border-sky focus:ring-[3px] focus:ring-sky/15 text-foreground text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs sm:text-[13px] font-medium text-ink-600 mb-1.5 sm:mb-2">Classification</label>
                                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                            {categories.filter(c => c !== "All").map(cat => (
                                                <button
                                                    key={cat}
                                                    onClick={() => setNewImage({ ...newImage, category: cat })}
                                                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-[14px] text-[11px] sm:text-xs font-medium transition-all ${newImage.category === cat
                                                            ? "bg-sky text-background shadow-soft"
                                                            : "bg-card text-ink-500 hover:bg-sky/10 border border-ink-100"
                                                        }`}
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleSave}
                                        disabled={!newImage.image || uploading}
                                        className="w-full h-9 sm:h-11 mt-2 sm:mt-4 bg-sky text-background font-medium rounded-full shadow-soft hover:bg-sky/90 transition-all disabled:opacity-50 text-sm sm:text-base"
                                    >
                                        Add to Portfolio
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
