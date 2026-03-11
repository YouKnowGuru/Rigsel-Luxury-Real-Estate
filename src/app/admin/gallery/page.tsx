"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Loader2, Image as ImageIcon, Trash2, Filter, Plus } from "lucide-react";
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
                    Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
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
                headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
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
        <div className="p-4 md:p-8 lg:p-10 max-w-[1600px] mx-auto min-h-screen">
            <div className="fixed inset-0 bg-thangka opacity-[0.01] pointer-events-none" />

            {/* Header */}
            <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-0.5 h-6 bg-bhutan-red rounded-full" />
                        <p className="text-bhutan-red font-bold text-xs uppercase tracking-[0.3em]">Visual Assets</p>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-bhutan-dark leading-tight">
                        Photo <span className="text-bhutan-gold italic font-light">Gallery</span>
                    </h2>
                </div>

                <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="h-12 md:h-14 px-8 bg-bhutan-dark text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-2xl hover:bg-bhutan-red transition-all duration-500 shadow-xl flex items-center gap-3 group"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    Add To Gallery
                </button>
            </header>

            {/* Categories */}
            <div className="mb-8 flex flex-wrap gap-2 relative z-10">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${selectedCategory === cat
                                ? "bg-bhutan-red text-white border-bhutan-red shadow-lg shadow-bhutan-red/20"
                                : "bg-white text-bhutan-dark/40 border-white hover:border-bhutan-red/20 hover:text-bhutan-red"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Gallery Grid */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-bhutan-red animate-spin" />
                </div>
            ) : (
                <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10"
                >
                    <AnimatePresence>
                        {filteredItems.map((item) => (
                            <motion.div
                                key={item._id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="group relative aspect-square bg-white rounded-3xl overflow-hidden shadow-luxury border border-white"
                            >
                                <img src={item.image} alt={item.title || "Gallery"} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-bhutan-dark/90 via-bhutan-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                                    <p className="text-bhutan-gold text-[10px] font-bold uppercase tracking-[0.2em] mb-1">{item.category}</p>
                                    <h4 className="text-white font-bold text-lg mb-4">{item.title || "Gallery Image"}</h4>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleDelete(item._id)}
                                            className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-bhutan-red transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
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
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsUploadModalOpen(false)}
                            className="absolute inset-0 bg-bhutan-dark/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg bg-[#F9F7F2] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/20"
                        >
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-2xl font-bold text-bhutan-dark">Add New <span className="text-bhutan-gold">Asset</span></h3>
                                    <button onClick={() => setIsUploadModalOpen(false)} className="text-bhutan-dark/20 hover:text-bhutan-red transition-colors">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {/* Image Preview / Upload */}
                                    <label className="block cursor-pointer">
                                        {newImage.image ? (
                                            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg border-2 border-white">
                                                <img src={newImage.image} alt="Preview" className="w-full h-full object-cover" />
                                                <button
                                                    onClick={(e) => { e.preventDefault(); setNewImage({ ...newImage, image: "" }); }}
                                                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-bhutan-red text-white flex items-center justify-center shadow-lg"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className={`aspect-video rounded-3xl border-2 border-dashed border-bhutan-gold/20 bg-white/50 flex flex-col items-center justify-center text-center p-6 hover:border-bhutan-red/40 transition-all ${uploading ? "opacity-50" : ""}`}>
                                                {uploading ? (
                                                    <Loader2 className="w-10 h-10 text-bhutan-red animate-spin" />
                                                ) : (
                                                    <>
                                                        <div className="w-14 h-14 rounded-2xl bg-bhutan-gold/10 flex items-center justify-center mb-4">
                                                            <Upload className="w-6 h-6 text-bhutan-gold" />
                                                        </div>
                                                        <p className="text-bhutan-dark/60 font-bold text-xs uppercase tracking-widest">Select Image</p>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                    </label>

                                    <div>
                                        <label className="block text-[10px] font-bold text-bhutan-dark/40 uppercase tracking-[0.2em] mb-2 px-1">Entry Title</label>
                                        <input
                                            type="text"
                                            placeholder="Optional title..."
                                            value={newImage.title}
                                            onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                                            className="w-full h-12 px-5 bg-white rounded-xl border border-white focus:outline-none focus:ring-2 focus:ring-bhutan-gold/20 text-bhutan-dark shadow-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-bhutan-dark/40 uppercase tracking-[0.2em] mb-2 px-1">Classification</label>
                                        <div className="flex flex-wrap gap-2">
                                            {categories.filter(c => c !== "All").map(cat => (
                                                <button
                                                    key={cat}
                                                    onClick={() => setNewImage({ ...newImage, category: cat })}
                                                    className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${newImage.category === cat
                                                            ? "bg-bhutan-gold text-bhutan-dark shadow-md shadow-bhutan-gold/20"
                                                            : "bg-white text-bhutan-dark/30 hover:bg-bhutan-gold/10"
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
                                        className="w-full h-14 mt-4 bg-bhutan-red text-white font-bold uppercase tracking-[0.3em] rounded-2xl shadow-xl shadow-bhutan-red/20 hover:bg-bhutan-dark transition-all disabled:opacity-50"
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
