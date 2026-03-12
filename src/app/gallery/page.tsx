"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageIcon, X, Loader2, Maximize2, MoveRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface GalleryItem {
    _id: string;
    image: string;
    category: string;
    title?: string;
}

const categories = ["All", "Interior", "Exterior", "Landscape", "Events", "Others"];

export default function GalleryListingPage() {
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

    useEffect(() => {
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
        fetchGallery();
    }, []);

    const filteredItems = items.filter(
        (item) => selectedCategory === "All" || item.category === selectedCategory
    );

    return (
        <div className="min-h-screen bg-[#F9F7F2] dark:bg-bhutan-dark font-outfit pt-32 pb-20 overflow-hidden">
            {/* Decorative Elements */}
            <div className="fixed top-0 left-0 w-full h-full bg-thangka opacity-[0.03] pointer-events-none" />
            <div className="fixed -top-[20%] -right-[10%] w-[60%] aspect-square bg-bhutan-red/10 blur-[150px] rounded-full pointer-events-none" />
            <div className="fixed -bottom-[20%] -left-[10%] w-[60%] aspect-square bg-bhutan-gold/5 blur-[150px] rounded-full pointer-events-none" />

            <div className="container-luxury mx-auto px-6 lg:px-10 relative z-10">
                {/* Header */}
                <header className="mb-16 text-center max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-3 mb-6 bg-white/5 dark:bg-white/5 backdrop-blur-md px-6 py-2 rounded-full border border-bhutan-gold/10 dark:border-white/10"
                    >
                        <div className="w-1 h-1 bg-bhutan-gold rounded-full animate-ping" />
                        <span className="text-bhutan-gold font-bold text-[10px] uppercase tracking-[0.5em]">Digital Portfolio</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold text-bhutan-dark dark:text-white mb-8 leading-tight"
                    >
                        Visualizing <span className="text-bhutan-gold italic font-light">Excellence</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-bhutan-dark/50 dark:text-white/50 max-w-2xl mx-auto leading-relaxed"
                    >
                        A curated collection of architectural marvels and luxury living spaces across the Himalayan kingdom.
                    </motion.p>
                </header>

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-3 mb-16">
                    {categories.map((cat, i) => (
                        <motion.button
                            key={cat}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 + 0.3 }}
                            onClick={() => setSelectedCategory(cat)}
                            className={cn(
                                "px-8 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-500 border",
                                selectedCategory === cat
                                    ? "bg-bhutan-gold text-bhutan-dark border-bhutan-gold shadow-2xl shadow-bhutan-gold/20 scale-105"
                                    : "bg-white/50 dark:bg-white/5 text-bhutan-dark/40 dark:text-white/40 border-bhutan-gold/10 dark:border-white/5 hover:border-bhutan-gold/30 dark:hover:border-white/20 hover:text-bhutan-dark dark:hover:text-white"
                            )}
                        >
                            {cat}
                        </motion.button>
                    ))}
                </div>

                {/* Gallery Grid - Masonry style feel */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-40">
                        <Loader2 className="w-12 h-12 text-bhutan-gold animate-spin" />
                    </div>
                ) : (
                    <motion.div
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        <AnimatePresence>
                            {filteredItems.map((item, idx) => (
                                <motion.div
                                    key={item._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                    transition={{ delay: idx * 0.05 }}
                                    onClick={() => setSelectedImage(item)}
                                    className="group relative aspect-[3/4] bg-white dark:bg-white/5 rounded-[2.5rem] overflow-hidden cursor-pointer border border-bhutan-gold/5 dark:border-white/5 hover:border-bhutan-gold/30 transition-all duration-700 shadow-sm"
                                >
                                    <img
                                        src={item.image}
                                        alt={item.title || "Gallery"}
                                        className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-bhutan-dark/95 via-bhutan-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col justify-end p-10">
                                        <p className="text-bhutan-gold text-[9px] font-bold uppercase tracking-[0.4em] mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 delay-100">
                                            {item.category}
                                        </p>
                                        <h3 className="text-white text-2xl font-bold mb-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 delay-200">
                                            {item.title || "Architectural Asset"}
                                        </h3>
                                        <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white transform translate-y-4 group-hover:translate-y-0 transition-all duration-700 delay-300 hover:bg-bhutan-gold hover:text-bhutan-dark hover:border-bhutan-gold">
                                            <Maximize2 className="w-5 h-5" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}

                {!isLoading && filteredItems.length === 0 && (
                    <div className="text-center py-40">
                        <div className="w-20 h-20 rounded-full bg-bhutan-gold/5 dark:bg-white/5 flex items-center justify-center mx-auto mb-8 border border-bhutan-gold/10 dark:border-white/10">
                            <ImageIcon className="w-8 h-8 text-bhutan-gold/20 dark:text-white/20" />
                        </div>
                        <p className="text-2xl text-bhutan-dark/20 dark:text-white/20 font-light italic">No visual assets found in this category.</p>
                    </div>
                )}
            </div>

            {/* Lightbox / Preview */}
            <AnimatePresence>
                {selectedImage && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedImage(null)}
                            className="absolute inset-0 bg-bhutan-dark/95 backdrop-blur-2xl"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="relative w-full h-full max-w-7xl flex flex-col md:flex-row bg-bhutan-dark/50 rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl"
                        >
                            <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
                                <img
                                    src={selectedImage.image}
                                    alt={selectedImage.title}
                                    className="max-w-full max-h-full object-contain"
                                />
                                <button
                                    onClick={() => setSelectedImage(null)}
                                    className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center text-white hover:bg-bhutan-red transition-all border border-white/10"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="w-full md:w-[400px] p-10 md:p-12 flex flex-col justify-center bg-bhutan-dark relative">
                                <div className="absolute top-0 left-0 w-full h-full bg-thangka opacity-[0.05] pointer-events-none" />

                                <span className="text-bhutan-gold font-bold text-[10px] uppercase tracking-[0.5em] mb-4">
                                    Asset Detail
                                </span>
                                <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
                                    {selectedImage.title || "Portfolio Entry"}
                                </h2>

                                <div className="space-y-8 mb-12">
                                    <div>
                                        <p className="text-white/30 text-[9px] font-bold uppercase tracking-[0.2em] mb-2">Category</p>
                                        <p className="text-white font-medium text-lg">{selectedImage.category}</p>
                                    </div>
                                    <div>
                                        <p className="text-white/30 text-[9px] font-bold uppercase tracking-[0.2em] mb-2">Project Type</p>
                                        <p className="text-white font-medium text-lg">Luxury Residential</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setSelectedImage(null)}
                                    className="mt-auto group flex items-center gap-4 text-white hover:text-bhutan-gold transition-colors"
                                >
                                    <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Back to Gallery</span>
                                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white group-hover:border-bhutan-gold group-hover:text-bhutan-gold transition-all">
                                        <MoveRight className="w-5 h-5" />
                                    </div>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
