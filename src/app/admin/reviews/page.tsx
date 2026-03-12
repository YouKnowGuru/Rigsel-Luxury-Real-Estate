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
    Filter,
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
            const token = localStorage.getItem("adminToken");
            const response = await fetch(`/api/admin/reviews?filter=${filter}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
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
            const token = localStorage.getItem("adminToken");
            const response = await fetch(`/api/admin/reviews/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
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
            const token = localStorage.getItem("adminToken");
            const response = await fetch(`/api/admin/reviews/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
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
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-bhutan-dark">Review Management</h1>
                    <p className="text-bhutan-dark/70 text-lg font-medium">Moderate and approve customer testimonials</p>
                </div>

                <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-bhutan-gold/10 shadow-sm">
                    <Button
                        variant={filter === "all" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setFilter("all")}
                        className="rounded-xl"
                    >
                        All
                    </Button>
                    <Button
                        variant={filter === "pending" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setFilter("pending")}
                        className="rounded-xl"
                    >
                        Pending
                    </Button>
                    <Button
                        variant={filter === "approved" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setFilter("approved")}
                        className="rounded-xl"
                    >
                        Approved
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border border-bhutan-gold/10">
                    <Loader2 className="w-12 h-12 text-bhutan-red animate-spin mb-4" />
                    <p className="text-bhutan-dark/40 italic">Loading reviews...</p>
                </div>
            ) : reviews.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-[2rem] border border-bhutan-gold/10">
                    <MessageSquare className="w-16 h-16 text-bhutan-gold/20 mx-auto mb-4" />
                    <h3 className="text-xl font-serif font-bold text-bhutan-dark/40">No reviews found</h3>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {reviews.map((review) => (
                        <motion.div
                            key={review._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`bg-white rounded-[2rem] p-6 border transition-all duration-500 shadow-sm hover:shadow-md ${review.isApproved ? "border-green-100" : "border-bhutan-gold/10"
                                }`}
                        >
                            <div className="flex flex-col lg:flex-row gap-6">
                                {/* Reviewer Info */}
                                <div className="lg:w-64 flex-shrink-0 space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-bhutan-gold/5 border border-bhutan-gold/10 overflow-hidden flex-shrink-0">
                                            {review.avatar ? (
                                                <img src={review.avatar} alt={review.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-bhutan-gold">
                                                    <User className="w-6 h-6" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-serif font-bold text-xl text-bhutan-dark">{review.name}</h4>
                                            <p className="text-bhutan-red text-xs font-bold uppercase tracking-widest">{review.role}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-bhutan-dark/70 text-sm font-medium">
                                            <MapPin className="w-4 h-4" />
                                            {review.location}
                                        </div>
                                        <div className="flex items-center gap-2 text-bhutan-dark/70 text-sm font-medium">
                                            <Clock className="w-4 h-4" />
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < review.rating ? "fill-bhutan-gold text-bhutan-gold" : "text-gray-200"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 space-y-4">
                                    <div className="p-6 bg-[#F9F7F2] rounded-2xl text-bhutan-dark/80 italic text-base leading-relaxed relative font-medium shadow-inner">
                                        <Quote className="absolute -top-3 -left-3 w-8 h-8 text-bhutan-gold/20" />
                                        "{review.content}"
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="lg:w-48 flex-shrink-0 flex flex-row lg:flex-col gap-2 justify-end lg:justify-start">
                                    {review.isApproved ? (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleStatusUpdate(review._id, false)}
                                            className="rounded-xl border-orange-200 text-orange-600 hover:bg-orange-50 w-full"
                                        >
                                            <XCircle className="w-4 h-4 mr-2" />
                                            Unapprove
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleStatusUpdate(review._id, true)}
                                            className="rounded-xl border-green-200 text-green-600 hover:bg-green-50 w-full"
                                        >
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Approve
                                        </Button>
                                    )}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDelete(review._id)}
                                        className="rounded-xl border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 w-full"
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete
                                    </Button>
                                </div>
                            </div>

                            {!review.isApproved && (
                                <div className="mt-4 pt-4 border-t border-dashed border-bhutan-gold/10">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-bhutan-gold/10 text-bhutan-gold">
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
