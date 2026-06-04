"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
    Loader2,
    Calendar,
    Eye,
    ArrowLeft,
    Pin,
    AlertTriangle,
    ArrowUpCircle,
    Circle,
    CheckCircle2,
    User,
    Share2,
    Newspaper,
} from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { cn } from "@/lib/utils";

interface Announcement {
    _id: string;
    title: string;
    content: string;
    summary: string;
    category: string;
    priority: "low" | "normal" | "high" | "urgent";
    isPinned: boolean;
    publishedAt: string;
    expiresAt?: string;
    coverImage?: string;
    author: string;
    viewCount: number;
    createdAt: string;
}

const priorityConfig = {
    urgent: { color: "bg-red-500 text-white", label: "Urgent", icon: AlertTriangle },
    high: { color: "bg-orange-500 text-white", label: "High", icon: ArrowUpCircle },
    normal: { color: "bg-sky text-white", label: "Normal", icon: Circle },
    low: { color: "bg-ink-400 text-white", label: "Low", icon: CheckCircle2 },
};

const categoryBadgeColors: Record<string, string> = {
    General: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
    Promotion: "bg-purple-500/10 text-purple-700 border-purple-200",
    Event: "bg-amber-500/10 text-amber-700 border-amber-200",
    Update: "bg-blue-500/10 text-blue-700 border-blue-200",
    Alert: "bg-red-500/10 text-red-700 border-red-200",
};

export default function AnnouncementDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const [announcement, setAnnouncement] = useState<Announcement | null>(null);
    const [related, setRelated] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id) return;
        fetchAnnouncement();
    }, [id]);

    const fetchAnnouncement = async () => {
        try {
            setLoading(true);
            setError("");

            // Fetch all public announcements and find the one matching the ID
            const res = await fetch("/api/announcements?limit=100");
            const data = await res.json();

            if (data.success) {
                const found = data.data.find((a: Announcement) => a._id === id);
                if (found) {
                    setAnnouncement(found);
                    // Increment view count (fire and forget)
                    fetch(`/api/admin/announcements/${id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ action: "incrementView" }),
                    }).catch(() => {});
                    // Fetch related announcements (same category, excluding current)
                    const relatedItems = data.data
                        .filter((a: Announcement) => a._id !== id && a.category === found.category)
                        .slice(0, 3);
                    setRelated(relatedItems);
                } else {
                    setError("Announcement not found or not published");
                }
            } else {
                setError(data.error || "Failed to load announcement");
            }
        } catch (err) {
            setError("Failed to load announcement");
        } finally {
            setLoading(false);
        }
    };

    const handleShare = async () => {
        try {
            await navigator.share({
                title: announcement?.title || "Announcement",
                text: announcement?.summary || "",
                url: window.location.href,
            });
        } catch {
            navigator.clipboard.writeText(window.location.href);
        }
    };

    if (loading) {
        return (
            <main className="bg-background min-h-screen">
                <div className="flex flex-col items-center justify-center py-32">
                    <Loader2 className="w-8 h-8 text-ink-400 animate-spin mb-4" />
                    <p className="text-ink-500 text-sm">Loading announcement...</p>
                </div>
            </main>
        );
    }

    if (error || !announcement) {
        return (
            <main className="bg-background min-h-screen">
                <div className="container-apple-wide py-20 text-center">
                    <Newspaper className="w-12 h-12 text-ink-300 mx-auto mb-4" strokeWidth={1.5} />
                    <h1 className="text-xl font-semibold text-foreground mb-2">Announcement Not Found</h1>
                    <p className="text-ink-500 mb-6">{error || "This announcement may have been removed or expired."}</p>
                    <Link
                        href="/announcements"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-sky text-background text-sm font-medium hover:bg-sky/90 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
                        Back to Announcements
                    </Link>
                </div>
            </main>
        );
    }

    const pConfig = priorityConfig[announcement.priority];
    const PIcon = pConfig.icon;

    return (
        <main className="bg-background">
            <PageHero
                eyebrow="Announcement"
                title={announcement.title}
                subtitle={announcement.summary}
                breadcrumbs={[
                    { label: "Announcements", href: "/announcements" },
                    { label: "Detail" },
                ]}
            />

            <section className="section-y-sm">
                <div className="container-apple-wide max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Back link */}
                        <Link
                            href="/announcements"
                            className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-sky transition-colors mb-6 sm:mb-8"
                        >
                            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
                            Back to announcements
                        </Link>

                        {/* Meta bar */}
                        <div className="flex flex-wrap items-center gap-2 mb-5 sm:mb-6">
                            <span className={cn("inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider", pConfig.color)}>
                                <PIcon className="w-3 h-3" strokeWidth={2} />
                                {pConfig.label}
                            </span>
                            <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider border", categoryBadgeColors[announcement.category] || "bg-ink-100 text-ink-500 border-ink-200")}>
                                {announcement.category}
                            </span>
                            {announcement.isPinned && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-sky/10 text-sky border border-sky/20">
                                    <Pin className="w-3 h-3" strokeWidth={2} />
                                    Pinned
                                </span>
                            )}
                        </div>

                        {/* Cover Image */}
                        {announcement.coverImage && (
                            <div className="relative w-full h-52 sm:h-72 md:h-96 rounded-apple-lg overflow-hidden mb-6 sm:mb-8 bg-ink-50">
                                <img
                                    src={announcement.coverImage}
                                    alt={announcement.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        {/* Author & Date */}
                        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[13px] text-ink-500 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-ink-100/60">
                            <span className="inline-flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5" strokeWidth={1.5} />
                                {announcement.author}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" strokeWidth={1.5} />
                                {new Date(announcement.publishedAt).toLocaleDateString("en-US", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <Eye className="w-3.5 h-3.5" strokeWidth={1.5} />
                                {announcement.viewCount} views
                            </span>
                            <button
                                onClick={handleShare}
                                className="inline-flex items-center gap-1.5 text-sky hover:text-sky/80 transition-colors ml-auto"
                            >
                                <Share2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                                Share
                            </button>
                        </div>

                        {/* Content */}
                        <div
                            className="prose prose-sm sm:prose-base max-w-none text-foreground/90 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: announcement.content }}
                        />

                        {/* Expiry notice */}
                        {announcement.expiresAt && new Date(announcement.expiresAt) > new Date() && (
                            <div className="mt-8 sm:mt-10 p-4 rounded-xl bg-amber-500/5 border border-amber-200 text-amber-700 text-sm">
                                <p className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" strokeWidth={1.5} />
                                    This announcement expires on{" "}
                                    {new Date(announcement.expiresAt).toLocaleDateString("en-US", {
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </p>
                            </div>
                        )}
                    </motion.div>

                    {/* Related Announcements */}
                    {related.length > 0 && (
                        <div className="mt-12 sm:mt-16 pt-8 sm:pt-10 border-t border-ink-100/60">
                            <h2 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight mb-5 sm:mb-6">
                                Related Announcements
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {related.map((item, i) => (
                                    <motion.div
                                        key={item._id}
                                        initial={{ opacity: 0, y: 16 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: i * 0.08 }}
                                    >
                                        <Link
                                            href={`/announcements/${item._id}`}
                                            className="group block bg-fog rounded-apple-lg p-5 hover:shadow-elevated transition-shadow"
                                        >
                                            <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border mb-2", categoryBadgeColors[item.category] || "bg-ink-100 text-ink-500 border-ink-200")}>
                                                {item.category}
                                            </span>
                                            <h3 className="font-semibold text-[15px] text-foreground group-hover:text-sky transition-colors line-clamp-2 mb-1.5">
                                                {item.title}
                                            </h3>
                                            <p className="text-[12px] text-ink-500 line-clamp-2">
                                                {item.summary}
                                            </p>
                                            <div className="mt-3 flex items-center gap-2 text-[11px] text-ink-400">
                                                <Calendar className="w-3 h-3" strokeWidth={1.5} />
                                                {new Date(item.publishedAt).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
