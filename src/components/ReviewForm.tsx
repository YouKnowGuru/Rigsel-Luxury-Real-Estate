"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X, CheckCircle, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReviewFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReviewForm({ isOpen, onClose }: ReviewFormProps) {
  const { toast } = useToast();
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "Happy client",
    location: "Thimphu, Bhutan",
    content: "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("role", formData.role);
      submitData.append("location", formData.location);
      submitData.append("content", formData.content);
      submitData.append("rating", rating.toString());
      if (selectedImage) submitData.append("file", selectedImage);

      const response = await fetch("/api/reviews", {
        method: "POST",
        body: submitData,
      });

      if (response.ok) {
        setIsSubmitted(true);
        toast({
          title: "Review submitted",
          description: "Thank you — your story will be live once approved.",
        });
        setTimeout(() => {
          onClose();
          setIsSubmitted(false);
          setFormData({
            name: "",
            role: "Happy client",
            location: "Thimphu, Bhutan",
            content: "",
          });
          setRating(5);
          setSelectedImage(null);
          setImagePreview(null);
        }, 2500);
      } else {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit review");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message || "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="bg-background w-full max-w-xl rounded-apple-xl shadow-product overflow-hidden relative border border-ink-100 dark:border-ink-700/40"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-fog hover:bg-ink-100 text-foreground/80 hover:text-foreground transition-colors flex items-center justify-center z-20 no-tap"
              aria-label="Close"
            >
              <X className="w-4 h-4" strokeWidth={1.75} />
            </button>

            <div className="p-6 sm:p-8 md:p-10">
              {isSubmitted ? (
                <div className="text-center py-10">
                  <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald/20 text-emerald mb-5">
                    <CheckCircle className="w-7 h-7" strokeWidth={1.75} />
                  </span>
                  <h3 className="font-semibold text-[clamp(1.5rem,1.25rem+1vw,2rem)] tracking-tighter2 text-foreground">
                    Story shared.
                  </h3>
                  <p className="mt-3 text-[15px] text-ink-500 max-w-sm mx-auto">
                    Thank you for being part of our journey. We&apos;ll publish
                    your testimonial soon.
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-[13px] font-semibold text-sky">
                    Share your story
                  </p>
                  <h2 className="mt-1 font-semibold text-[clamp(1.5rem,1.25rem+1vw,2rem)] tracking-tighter2 leading-tight2 text-foreground">
                    We&apos;d love to hear from you.
                  </h2>

                  <form onSubmit={handleSubmit} className="mt-6 space-y-3">
                    {/* Photo upload */}
                    <div className="flex items-center gap-4 mb-2">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-fog flex items-center justify-center border border-ink-100">
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-[18px] font-semibold text-ink-300">
                            {formData.name ? formData.name[0].toUpperCase() : "?"}
                          </span>
                        )}
                      </div>
                      <label className="btn-secondary cursor-pointer">
                        <Upload className="w-4 h-4" strokeWidth={1.75} />
                        Add a photo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Your name"
                        className="input-apple"
                      />
                      <input
                        required
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            location: e.target.value,
                          })
                        }
                        placeholder="Location"
                        className="input-apple"
                      />
                    </div>

                    <textarea
                      required
                      rows={4}
                      maxLength={500}
                      value={formData.content}
                      onChange={(e) =>
                        setFormData({ ...formData, content: e.target.value })
                      }
                      placeholder="Describe your journey with us…"
                      className="input-apple resize-none"
                    />
                    <p className="text-right text-[11px] text-ink-500 tabular-nums">
                      {formData.content.length}/500
                    </p>

                    {/* Rating */}
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[13px] text-ink-500">
                        Overall rating
                      </span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            onClick={() => setRating(star)}
                            className="transition-transform hover:scale-110 active:scale-95 no-tap p-1"
                            aria-label={`${star} stars`}
                          >
                            <Star
                              className={`w-5 h-5 transition-colors ${
                                star <= (hoveredRating || rating)
                                  ? "fill-foreground text-foreground"
                                  : "text-ink-200"
                              }`}
                              strokeWidth={1.5}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary-lg w-full mt-3"
                    >
                      {isSubmitting ? "Submitting…" : "Submit review"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
