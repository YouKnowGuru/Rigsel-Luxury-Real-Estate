"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote, Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Testimonial } from "@/types";

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("/api/reviews");
        const data = await response.json();
        if (data.success) {
          setTestimonials(data.data);
        } else {
          setError(data.error || "Failed to fetch reviews");
        }
      } catch (err) {
        setError("An error occurred while fetching reviews");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const nextTestimonial = () => {
    if (testimonials.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    if (testimonials.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center bg-white min-h-[400px]">
        <Loader2 className="w-12 h-12 text-bhutan-red animate-spin mb-4" />
        <p className="text-bhutan-dark/40 font-serif italic text-lg text-center px-6">Loading stories of happiness...</p>
      </div>
    );
  }

  if (error || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-24 md:py-32 bg-white relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#F9F7F2] -skew-x-12 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-1/3 h-full bg-[#F9F7F2] -skew-x-12 -translate-x-1/2" />

      <div className="container-luxury relative z-10 w-full max-w-7xl mx-auto px-6">

        {/* Header Section */}
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-6 py-2 rounded-full bg-bhutan-red/10 border border-bhutan-red/20 text-bhutan-red text-[10px] font-bold uppercase tracking-[0.4em] mb-6 shadow-sm"
          >
            Heartfelt Stories
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-bhutan-dark mb-6"
          >
            Happy <span className="text-bhutan-red italic font-light">Families</span>
          </motion.h2>
          <p className="text-bhutan-dark/60 max-w-2xl mx-auto text-xl font-light leading-relaxed">
            See why people across Bhutan trust us to help them find their perfect home.
          </p>
        </div>

        {/* Testimonial Card */}
        <div className="max-w-5xl mx-auto">
          <div className="relative pt-12">
            {/* Large Decorative Quote Icon */}
            <div className="absolute top-0 left-10 z-0">
              <Quote className="w-40 h-40 text-bhutan-gold/10 -rotate-12" />
            </div>

            <div className="bg-[#F9F7F2] rounded-[2rem] md:rounded-[4rem] p-8 md:p-24 shadow-2xl border-4 border-white relative overflow-hidden group">
              {/* Pattern Background */}
              <div className="absolute inset-0 bg-thangka opacity-[0.04] pointer-events-none group-hover:opacity-[0.06] transition-opacity duration-1000" />

              {/* Top Accent Line */}
              <div className="absolute top-0 left-1/4 right-1/4 h-1 bg-gradient-to-r from-transparent via-bhutan-gold/30 to-transparent" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="relative z-10"
                >
                  <div className="flex flex-col items-center text-center">
                    {/* Stars */}
                    <div className="flex gap-2 mb-12">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-8 h-8 fill-bhutan-gold text-bhutan-gold shadow-sm" />
                      ))}
                    </div>

                    <blockquote className="text-lg md:text-2xl lg:text-3xl text-bhutan-dark font-serif font-bold italic mb-8 md:mb-16 leading-relaxed md:leading-tight max-w-4xl px-4 md:px-0">
                      "{testimonials[currentIndex].content}"
                    </blockquote>
                    <div className="flex flex-col items-center">
                      <div className="relative mb-4 md:mb-6">
                        <div className="w-20 h-20 md:w-28 md:h-28 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl group-hover:scale-105 transition-transform duration-700">
                          <img
                            src={testimonials[currentIndex].avatar}
                            alt={testimonials[currentIndex].name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {/* Little Heart Badge */}
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-bhutan-red rounded-xl flex items-center justify-center shadow-xl border-2 border-white">
                          <Heart className="w-5 h-5 text-white fill-white" />
                        </div>
                      </div>

                      <h4 className="text-2xl font-serif font-bold text-bhutan-dark mb-1">
                        {testimonials[currentIndex].name}
                      </h4>
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-bold text-bhutan-red uppercase tracking-[0.3em]">
                          {testimonials[currentIndex].role}
                        </span>
                        <div className="w-1.5 h-1.5 rounded-full bg-bhutan-gold/40" />
                        <span className="text-[10px] font-bold text-bhutan-dark/40 uppercase tracking-[0.3em]">
                          {testimonials[currentIndex].location}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls (Custom Boutique Style) */}
            <div className="flex flex-col md:flex-row justify-between items-center mt-16 gap-8 px-6">
              <div className="flex gap-4">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`h-2 rounded-full transition-all duration-700 ${i === currentIndex ? "bg-bhutan-red w-16" : "bg-bhutan-gold/20 w-4 hover:bg-bhutan-gold/40"
                      }`}
                  />
                ))}
              </div>
              <div className="flex gap-6">
                <button
                  onClick={prevTestimonial}
                  className="w-16 h-16 rounded-2xl bg-white border-2 border-[#F9F7F2] flex items-center justify-center text-bhutan-dark hover:bg-bhutan-red hover:text-white hover:border-bhutan-red transition-all duration-500 shadow-xl group"
                >
                  <ChevronLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="w-16 h-16 rounded-2xl bg-white border-2 border-[#F9F7F2] flex items-center justify-center text-bhutan-dark hover:bg-bhutan-red hover:text-white hover:border-bhutan-red transition-all duration-500 shadow-xl group"
                >
                  <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
