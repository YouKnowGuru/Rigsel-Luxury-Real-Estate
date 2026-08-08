"use client";

import { useState, memo } from "react";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Loader2, Plus } from "lucide-react";
import { Testimonial } from "@/types";
import { ReviewForm } from "@/components/ReviewForm";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { fetcher, ApiResponse } from "@/lib/fetcher";

// Extracted star component to prevent remounts
const StarRating = memo(function StarRating() {
  return (
    <div className="flex justify-center gap-1 mb-6">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className="w-4 h-4 fill-foreground text-foreground"
          strokeWidth={0}
        />
      ))}
    </div>
  );
});

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);

  // Use SWR for caching and deduplication
  const { data, isLoading, error } = useSWR<ApiResponse<Testimonial[]>>(
    "/api/reviews",
    fetcher,
    {
      dedupingInterval: 60000,
      revalidateOnFocus: false,
    }
  );

  const testimonials = data?.data || [];

  const next = () => {
    if (testimonials.length <= 1) return;
    setCurrentIndex((p) => (p + 1) % testimonials.length);
  };
  const prev = () => {
    if (testimonials.length <= 1) return;
    setCurrentIndex(
      (p) => (p - 1 + testimonials.length) % testimonials.length
    );
  };

  if (isLoading) {
    return (
      <section className="section-y content-visibility-auto">
        <div className="container-apple flex flex-col items-center justify-center min-h-[260px]">
          <Loader2 className="w-8 h-8 text-ink-400 animate-spin mb-3" />
          <p className="text-ink-500 text-[14px]">Loading stories…</p>
        </div>
      </section>
    );
  }

  if (error) return null;

  return (
    <section className="section-y content-visibility-auto">
      <div className="container-apple">
        <SectionHeader
          eyebrow="Customer stories"
          title="Loved by families across Bhutan."
          subtitle="The people who trust us — in their own words."
        />

        {testimonials.length > 0 ? (
          <div className="relative">
            <div className="glass rounded-apple-xl px-6 py-12 sm:p-14 md:p-16 text-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <StarRating />

                  <blockquote className="font-semibold text-[clamp(1.25rem,1rem+1.25vw,2rem)] tracking-tighter2 leading-tight2 text-foreground max-w-3xl mx-auto text-balance">
                    &ldquo;{testimonials[currentIndex].content}&rdquo;
                  </blockquote>

                  <div className="mt-10 flex items-center justify-center gap-3">
                    <img
                      src={
                        testimonials[currentIndex].avatar ||
                        "/image/user-placeholder.jpg"
                      }
                      alt={testimonials[currentIndex].name}
                      className="w-11 h-11 rounded-full object-cover border border-ink-100"
                    />
                    <div className="text-left">
                      <p className="text-[14px] font-semibold text-foreground">
                        {testimonials[currentIndex].name}
                      </p>
                      <p className="text-[12px] text-ink-500">
                        {testimonials[currentIndex].role} ·{" "}
                        {testimonials[currentIndex].location}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="mt-6 flex items-center justify-between gap-4">
              <div className="flex gap-1.5">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    aria-label={`Go to testimonial ${i + 1}`}
                    aria-current={i === currentIndex ? "true" : undefined}
                    className={`h-1 rounded-full transition-all duration-fast ${
                      i === currentIndex ? "bg-sky w-8" : "bg-ink-200 w-3"
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={prev}
                  className="w-10 h-10 rounded-full glass-pill flex items-center justify-center text-foreground hover:bg-white/10 transition-colors no-tap"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-4 h-4" strokeWidth={1.75} />
                </button>
                <button
                  onClick={next}
                  className="w-10 h-10 rounded-full glass-pill flex items-center justify-center text-foreground hover:bg-white/10 transition-colors no-tap"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-4 h-4" strokeWidth={1.75} />
                </button>
              </div>
            </div>

            <div className="mt-12 text-center">
              <button
                onClick={() => setIsReviewFormOpen(true)}
                className="btn-secondary"
              >
                <Plus className="w-4 h-4" strokeWidth={2} />
                Share your story
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 max-w-md mx-auto">
            <p className="text-ink-500 mb-6">
              No stories yet — be the first to share your experience.
            </p>
            <button
              onClick={() => setIsReviewFormOpen(true)}
              className="btn-primary"
            >
              <Plus className="w-4 h-4" strokeWidth={2} />
              Share your story
            </button>
          </div>
        )}
      </div>

      <ReviewForm
        isOpen={isReviewFormOpen}
        onClose={() => setIsReviewFormOpen(false)}
      />
    </section>
  );
}
