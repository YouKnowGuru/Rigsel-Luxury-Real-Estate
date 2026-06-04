"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageIcon, X, Loader2, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHero } from "@/components/layout/PageHero";

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
    <main className="bg-background">
      <PageHero
        eyebrow="Portfolio"
        title="Visualising"
        highlight="excellence."
        subtitle="A curated collection of architectural marvels and luxury living spaces across the Himalayan kingdom."
        breadcrumbs={[{ label: "Gallery" }]}
      />

      <section className="section-y-sm">
        <div className="container-apple-wide">
          {/* Filter pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-4 h-10 rounded-full text-[13px] font-medium transition-colors no-tap",
                  selectedCategory === cat
                    ? "bg-foreground text-background"
                    : "bg-fog text-foreground hover:bg-ink-100"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-8 h-8 text-ink-400 animate-spin" />
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
            >
              <AnimatePresence>
                {filteredItems.map((item, idx) => (
                  <motion.button
                    key={item._id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5, delay: idx * 0.03, ease: [0.16, 1, 0.3, 1] }}
                    onClick={() => setSelectedImage(item)}
                    className={cn(
                      "group relative bg-fog rounded-apple-lg overflow-hidden transition-all hover:shadow-product no-tap",
                      idx % 5 === 0 ? "aspect-square" : idx % 3 === 0 ? "aspect-[4/5]" : "aspect-square"
                    )}
                  >
                    <img
                      src={item.image}
                      alt={item.title || "Gallery"}
                      className="w-full h-full object-cover transition-transform duration-1200 ease-apple-out group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-4 text-left">
                      <p className="text-white/80 text-[11px] uppercase tracking-eyebrow font-semibold">
                        {item.category}
                      </p>
                      <p className="text-white font-semibold text-[15px] mt-1">
                        {item.title || "View"}
                      </p>
                    </div>
                    <span className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 className="w-4 h-4" strokeWidth={1.75} />
                    </span>
                  </motion.button>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {!isLoading && filteredItems.length === 0 && (
            <div className="text-center py-24 max-w-md mx-auto">
              <ImageIcon className="w-10 h-10 text-ink-300 mx-auto mb-4" strokeWidth={1.5} />
              <p className="text-[16px] text-ink-500">
                No assets found in this category.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors flex items-center justify-center"
              aria-label="Close"
            >
              <X className="w-5 h-5" strokeWidth={1.75} />
            </button>
            <motion.img
              initial={{ scale: 0.94 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.94 }}
              src={selectedImage.image}
              alt={selectedImage.title}
              className="max-w-[95vw] max-h-[85vh] object-contain rounded-apple-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
