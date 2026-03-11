"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X, Send, Heart, User, MapPin, CheckCircle, Image as ImageIcon, Upload, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
        role: "Happy Client",
        location: "Thimphu, Bhutan",
        content: "",
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
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
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
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
            if (selectedImage) {
                submitData.append("file", selectedImage);
            }

            const response = await fetch("/api/reviews", {
                method: "POST",
                body: submitData,
            });

            if (response.ok) {
                setIsSubmitted(true);
                toast({
                    title: "Review Submitted",
                    description: "Thank you! Your story will be live once approved by our team.",
                });
                setTimeout(() => {
                    onClose();
                    setIsSubmitted(false);
                    setFormData({ name: "", role: "Happy Client", location: "Thimphu, Bhutan", content: "" });
                    setRating(5);
                    setSelectedImage(null);
                    setImagePreview(null);
                }, 3000);
            } else {
                const data = await response.json();
                throw new Error(data.error || "Failed to submit review");
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to submit review. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-bhutan-dark/60 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-3xl overflow-hidden relative border-4 border-white"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="absolute inset-0 bg-thangka opacity-[0.03] pointer-events-none" />

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-bhutan-gold/10 flex items-center justify-center text-bhutan-dark hover:bg-bhutan-red hover:text-white transition-all z-20"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="p-8 md:p-12 relative z-10">
                            {isSubmitted ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center py-12"
                                >
                                    <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
                                        <CheckCircle className="w-12 h-12 text-green-500" />
                                    </div>
                                    <h3 className="text-3xl font-serif font-bold text-bhutan-dark mb-4">Story Shared!</h3>
                                    <p className="text-bhutan-dark/60 italic">
                                        "Thank you for being part of our journey. We will review and publish your testimonial soon."
                                    </p>
                                </motion.div>
                            ) : (
                                <>
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-12 h-12 bg-bhutan-red/10 rounded-xl flex items-center justify-center">
                                            <Heart className="w-6 h-6 text-bhutan-red fill-bhutan-red" />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl md:text-4xl font-serif font-bold text-bhutan-dark">Share Your Story</h2>
                                            <p className="text-[12px] uppercase font-bold tracking-widest text-bhutan-red">We value your happiness</p>
                                        </div>
                                    </div>

                                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Image Upload Area */}
                                        <div className="md:col-span-2 flex flex-col items-center mb-4">
                                            <div className="relative group">
                                                <div className={`w-28 h-28 rounded-[2rem] overflow-hidden border-4 border-white shadow-xl bg-[#F9F7F2] flex items-center justify-center transition-transform duration-500 group-hover:scale-105 ${!imagePreview ? 'border-dashed border-bhutan-gold/30' : ''}`}>
                                                    {imagePreview ? (
                                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Camera className="w-10 h-10 text-bhutan-gold/30" />
                                                    )}
                                                </div>
                                                <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-bhutan-red rounded-xl flex items-center justify-center shadow-xl border-2 border-white cursor-pointer hover:bg-bhutan-dark transition-colors">
                                                    <Upload className="w-5 h-5 text-white" />
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                        className="hidden"
                                                    />
                                                </label>
                                            </div>
                                            <p className="text-[9px] font-bold text-bhutan-dark/40 uppercase tracking-widest mt-4">Upload Your Photo</p>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-bhutan-dark/40 uppercase tracking-widest ml-4">Full Name</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-bhutan-gold" />
                                                <Input
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    placeholder="Tashi Namgay"
                                                    className="pl-12 h-14 bg-[#F9F7F2] border-bhutan-gold/10 rounded-xl focus:ring-bhutan-red/20 focus:border-bhutan-red"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-bhutan-dark/40 uppercase tracking-widest ml-4">Location</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-bhutan-gold" />
                                                <Input
                                                    value={formData.location}
                                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                    placeholder="Thimphu, Bhutan"
                                                    className="pl-12 h-14 bg-[#F9F7F2] border-bhutan-gold/10 rounded-xl focus:ring-bhutan-red/20 focus:border-bhutan-red"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-[10px] font-bold text-bhutan-dark/40 uppercase tracking-widest ml-4 flex justify-between">
                                                <span>Your Experience</span>
                                                <span className="text-bhutan-red lowercase tracking-normal">({formData.content.length}/500)</span>
                                            </label>
                                            <Textarea
                                                value={formData.content}
                                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                                placeholder="Describe your journey with us..."
                                                className="min-h-[120px] bg-[#F9F7F2] border-bhutan-gold/10 rounded-2xl p-4 focus:ring-bhutan-red/20 focus:border-bhutan-red resize-none italic"
                                                maxLength={500}
                                                required
                                            />
                                        </div>

                                        <div className="md:col-span-2 flex flex-col items-center py-4 bg-[#F9F7F2]/50 rounded-2xl border border-dashed border-bhutan-gold/20">
                                            <p className="text-[10px] font-bold text-bhutan-dark/40 uppercase tracking-widest mb-3">Overall Rating</p>
                                            <div className="flex gap-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onMouseEnter={() => setHoveredRating(star)}
                                                        onMouseLeave={() => setHoveredRating(0)}
                                                        onClick={() => setRating(star)}
                                                        className="transition-transform active:scale-90"
                                                    >
                                                        <Star
                                                            className={`w-8 h-8 transition-colors ${star <= (hoveredRating || rating)
                                                                ? "fill-bhutan-gold text-bhutan-gold scale-110"
                                                                : "text-bhutan-dark/10"
                                                                }`}
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="md:col-span-2 h-16 bg-bhutan-red text-white text-[10px] font-bold uppercase tracking-[0.4em] rounded-xl hover:bg-bhutan-dark transition-all shadow-xl shadow-bhutan-red/10 flex items-center justify-center gap-3 mt-4"
                                        >
                                            {isSubmitting ? (
                                                "Submitting..."
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4" />
                                                    Submit Review
                                                </>
                                            )}
                                        </Button>
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
