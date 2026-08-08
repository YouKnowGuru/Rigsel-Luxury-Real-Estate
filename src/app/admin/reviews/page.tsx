"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    Star,
    Trash2,
    CheckCircle,
    XCircle,
    Loader2,
    User,
    MapPin,
    MessageSquare,
    Clock,
    Quote
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Testimonial } from "@/types";
import { Button } from "@/components/ui/button";

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<Testimonial[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const { toast } = useToast();

    const fetchReviews = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/admin/reviews?filter=${filter}`, {
                headers: {
                },
            });
            const data = await response.json();
            if (data.success) {
                setReviews(data.data);
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
            toast({
                title: "Error",
                description: "Failed to load reviews.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [filter]);

    const handleStatusUpdate = async (id: string, isApproved: boolean) => {
        try {
            const response = await fetch(`/api/admin/reviews/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ isApproved }),
            });

            if (response.ok) {
                toast({
                    title: `Review ${isApproved ? "Approved" : "Unapproved"}`,
                    description: `Review is now ${isApproved ? "live" : "hidden"}.`,
                });
                fetchReviews();
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update review status.",
                variant: "destructive",
            });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this review?")) return;

        try {
            const response = await fetch(`/api/admin/reviews/${id}`, {
                method: "DELETE",
                headers: {
                },
            });

            if (response.ok) {
                toast({
                    title: "Review Deleted",
                    description: "Technical feedback and visual logs have been removed.",
                });
                fetchReviews();
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete review.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="p-3 sm:p-5 lg:p-8 max-w-[1600px] mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                    <p className="text-sky text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.12em] mb-1">Testimonials</p>
                    <h1 className="text-[22px] sm:text-[26px] lg:text-[28px] font-semibold text-foreground tracking-tight">Review Management</h1>
                    <p className="text-ink-600 text-sm sm:text-base font-medium mt-1">Moderate and approve customer testimonials</p>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 bg-card p-1 sm:p-1.5 rounded-xl sm:rounded-[14px] border border-ink-100/60 shadow-soft self-start sm:self-auto">
                    <Button
                        variant={filter === "all" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setFilter("all")}
                        className="rounded-lg sm:rounded-xl text-xs sm:text-sm h-8 sm:h-9"
                    >
                        All
                    </Button>
                    <Button
                        variant={filter === "pending" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setFilter("pending")}
                        className="rounded-lg sm:rounded-xl text-xs sm:text-sm h-8 sm:h-9"
                    >
                        Pending
                    </Button>
                    <Button
                        variant={filter === "approved" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setFilter("approved")}
                        className="rounded-lg sm:rounded-xl text-xs sm:text-sm h-8 sm:h-9"
                    >
                        Approved
                    </Button>
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 sm:py-20 admin-glass rounded-2xl sm:rounded-[20px]">
                    <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-sky animate-spin mb-3 sm:mb-4" strokeWidth={1.5} />
                    <p className="text-ink-400 text-sm sm:text-base font-medium">Loading reviews...</p>
                </div>
            ) : reviews.length === 0 ? (
                <div className="text-center py-12 sm:py-20 admin-glass rounded-2xl sm:rounded-[20px]">
                    <MessageSquare className="w-12 h-12 sm:w-16 sm:h-16 text-ink-200 mx-auto mb-3 sm:mb-4" strokeWidth={1.5} />
                    <h3 className="text-lg sm:text-xl font-semibold text-ink-400">No reviews found</h3>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                    {reviews.map((review) => (
                        <motion.div
                            key={review._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`admin-glass rounded-2xl sm:rounded-[20px] p-4 sm:p-5 lg:p-6 transition-all duration-300 hover:shadow-elevated ${review.isApproved ? "border-green-100" : ""
                                }`}
                        >
                            <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 lg:gap-6">
                                {/* Reviewer Info */}
                                <div className="lg:w-64 flex-shrink-0 space-y-3 sm:space-y-4">
                                    <div className="flex items-center gap-3 sm:gap-4">
                                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-sky/5 border border-sky/10 overflow-hidden flex-shrink-0">
                                            {review.avatar ? (
                                                <img src={review.avatar} alt={review.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-sky">
                                                    <User className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.5} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="font-semibold text-base sm:text-lg text-foreground truncate">{review.name}</h4>
                                            <p className="text-sky text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.12em]">{review.role}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5 sm:space-y-2">
                                        <div className="flex items-center gap-2 text-ink-600 text-xs sm:text-sm font-medium">
                                            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" strokeWidth={1.5} />
                                            <span className="truncate">{review.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-ink-600 text-xs sm:text-sm font-medium">
                                            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" strokeWidth={1.5} />
                                            <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${i < review.rating ? "fill-sky text-sky" : "text-ink-200"
                                                    }`}
                                                strokeWidth={1.5}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 space-y-3 sm:space-y-4">
                                    <div className="p-3 sm:p-5 bg-card/50 rounded-xl sm:rounded-2xl text-ink-700 text-sm sm:text-base leading-relaxed relative font-medium">
                                        <Quote className="absolute -top-2 -left-2 sm:-top-3 sm:-left-3 w-6 h-6 sm:w-8 sm:h-8 text-sky/15" strokeWidth={1.5} />
                                        <span className="relative z-10">&ldquo;{review.content}&rdquo;</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-row lg:flex-col gap-2 lg:w-48 flex-shrink-0 justify-start">
                                    {review.isApproved ? (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleStatusUpdate(review._id, false)}
                                            className="rounded-xl sm:rounded-[14px] border-orange-200 text-orange-600 hover:bg-orange-50 flex-1 lg:flex-none"
                                        >
                                            <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" strokeWidth={1.5} />
                                            <span className="text-xs sm:text-sm">Unapprove</span>
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleStatusUpdate(review._id, true)}
                                            className="rounded-xl sm:rounded-[14px] border-green-200 text-green-600 hover:bg-green-50 flex-1 lg:flex-none"
                                        >
                                            <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" strokeWidth={1.5} />
                                            <span className="text-xs sm:text-sm">Approve</span>
                                        </Button>
                                    )}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDelete(review._id)}
                                        className="rounded-xl sm:rounded-[14px] border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 flex-1 lg:flex-none"
                                    >
                                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" strokeWidth={1.5} />
                                        <span className="text-xs sm:text-sm">Delete</span>
                                    </Button>
                                </div>
                            </div>

                            {!review.isApproved && (
                                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-dashed border-ink-100/60">
                                    <span className="inline-flex items-center px-2 py-0.5 sm:px-2.5 rounded-full text-[11px] sm:text-xs font-medium bg-sky/10 text-sky">
                                        Pending Approval
                                    </span>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
