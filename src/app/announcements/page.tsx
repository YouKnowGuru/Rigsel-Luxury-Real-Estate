"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Megaphone,
    Search,
    Loader2,
    Pin,
    Calendar,
    Eye,
    ArrowRight,
    Filter,
    Newspaper,
    AlertTriangle,
    ArrowUpCircle,
    Circle,
    CheckCircle2,
    X,
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
}

const categories = ["All", "General", "Promotion", "Event", "Update", "Alert"];

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

export default function AnnouncementsPage() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [pinnedAnnouncements, setPinnedAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    const fetchAnnouncements = async (pageNum = 1, append = false) => {
        try {
            const url = new URL("/api/announcements", window.location.origin);
            url.searchParams.set("page", String(pageNum));
            url.searchParams.set("limit", "12");
            if (selectedCategory !== "All") url.searchParams.set("category", selectedCategory);
            if (searchQuery.trim()) url.searchParams.set("search", searchQuery.trim());

            const res = await fetch(url.toString());
            const data = await res.json();

            if (data.success) {
                const all = data.data as Announcement[];
                const pinned = all.filter((a) => a.isPinned);
                const regular = all.filter((a) => !a.isPinned);

                if (append) {
                    setAnnouncements((prev) => [...prev, ...regular]);
                } else {
                    setPinnedAnnouncements(pinned);
                    setAnnouncements(regular);
                }
                setHasMore(data.pagination.page < data.pagination.totalPages);
            }
        } catch (error) {
            console.error("Error fetching announcements:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setPage(1);
        fetchAnnouncements(1, false);
    }, [selectedCategory, searchQuery]);

    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchAnnouncements(nextPage, true);
    };

    const clearFilters = () => {
        setSearchQuery("");
        setSelectedCategory("All");
    };

    const allAnnouncements = [...pinnedAnnouncements, ...announcements];

    return (
        <main className="bg-background">
            <PageHero
                eyebrow="News & Updates"
                title="Announcements."
                highlight="Stay informed."
                subtitle="Latest news, promotions, events, and updates from PHOJAA95 Real Estate."
                breadcrumbs={[{ label: "Announcements" }]}
            />

            <section className="section-y-sm">
                <div className="container-apple-wide">
                    {/* Search & Filters */}
                    <div className="max-w-3xl mx-auto mb-8 sm:mb-10">
                        <div className="relative mb-4">
                            <Search
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400"
                                strokeWidth={1.75}
                            />
                            <input
                                type="text"
                                placeholder="Search announcements..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="input-apple pl-11"
                            />
                            {(searchQuery || selectedCategory !== "All") && (
                                <button
                                    onClick={clearFilters}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-ink-100 hover:bg-ink-200 rounded-full flex items-center justify-center text-ink-500 transition-colors"
                                >
                                    <X className="w-3 h-3" strokeWidth={2} />
                                </button>
                            )}
                        </div>

                        {/* Category Pills */}
                        <div className="flex flex-wrap justify-center gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={cn(
                                        "px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all border",
                                        selectedCategory === cat
                                            ? "bg-sky text-background border-sky shadow-soft"
                                            : "bg-card border-ink-200 text-ink-500 hover:text-foreground hover:border-ink-300"
                                    )}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Loading */}
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-8 h-8 text-ink-400 animate-spin" />
                        </div>
                    ) : allAnnouncements.length === 0 ? (
                        <div className="text-center py-20 max-w-md mx-auto">
                            <Newspaper
                                className="w-10 h-10 text-ink-300 mx-auto mb-4"
                                strokeWidth={1.5}
                            />
                            <p className="text-[16px] text-ink-500">
                                {searchQuery || selectedCategory !== "All"
                                    ? "No announcements matched your filters."
                                    : "No announcements yet. Check back soon!"}
                            </p>
                            {(searchQuery || selectedCategory !== "All") && (
                                <button
                                    onClick={clearFilters}
                                    className="mt-4 text-sky text-sm font-medium hover:underline"
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            {/* Pinned Section */}
                            {pinnedAnnouncements.length > 0 && (
                                <div className="mb-8 sm:mb-10">
                                    <div className="flex items-center gap-2 mb-4 sm:mb-5">
                                        <Pin className="w-4 h-4 text-sky" strokeWidth={1.5} />
                                        <h2 className="text-sm sm:text-base font-semibold text-foreground tracking-tight">
                                            Pinned Announcements
                                        </h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {pinnedAnnouncements.map((announcement, i) => (
                                            <AnnouncementCard
                                                key={announcement._id}
                                                announcement={announcement}
                                                index={i}
                                                highlighted
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Regular Announcements */}
                            {announcements.length > 0 && (
                                <>
                                    {pinnedAnnouncements.length > 0 && (
                                        <div className="flex items-center gap-2 mb-4 sm:mb-5">
                                            <Filter className="w-4 h-4 text-ink-400" strokeWidth={1.5} />
                                            <h2 className="text-sm sm:text-base font-semibold text-foreground tracking-tight">
                                                All Announcements
                                            </h2>
                                        </div>
                                    )}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {announcements.map((announcement, i) => (
                                            <AnnouncementCard
                                                key={announcement._id}
                                                announcement={announcement}
                                                index={i + pinnedAnnouncements.length}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* Load More */}
                            {hasMore && (
                                <div className="flex justify-center mt-8 sm:mt-10">
                                    <button
                                        onClick={loadMore}
                                        className="flex items-center gap-2 px-6 py-3 rounded-full border border-ink-200 text-sm font-medium text-ink-500 hover:text-foreground hover:border-ink-300 transition-all bg-card"
                                    >
                                        Load More
                                        <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </main>
    );
}

function AnnouncementCard({
    announcement,
    index,
    highlighted = false,
}: {
    announcement: Announcement;
    index: number;
    highlighted?: boolean;
}) {
    const pConfig = priorityConfig[announcement.priority];
    const PIcon = pConfig.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.04 }}
        >
            <Link
                href={`/announcements/${announcement._id}`}
                className={cn(
                    "group block bg-fog rounded-apple-lg overflow-hidden hover:shadow-elevated transition-shadow",
                    highlighted && "ring-1 ring-sky/20"
                )}
            >
                {/* Cover Image */}
                {announcement.coverImage ? (
                    <div className="relative w-full h-40 sm:h-48 overflow-hidden">
                        <img
                            src={announcement.coverImage}
                            alt={announcement.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        <div className="absolute top-3 left-3 flex gap-1.5">
                            <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider", pConfig.color)}>
                                <PIcon className="w-2.5 h-2.5" strokeWidth={2} />
                                {pConfig.label}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="px-5 pt-5">
                        <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider", pConfig.color)}>
                            <PIcon className="w-2.5 h-2.5" strokeWidth={2} />
                            {pConfig.label}
                        </span>
                    </div>
                )}

                {/* Content */}
                <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                        <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border", categoryBadgeColors[announcement.category] || "bg-ink-100 text-ink-500 border-ink-200")}>
                            {announcement.category}
                        </span>
                        {announcement.isPinned && (
                            <Pin className="w-3 h-3 text-sky" strokeWidth={1.5} />
                        )}
                    </div>

                    <h3 className="font-semibold text-[16px] sm:text-[17px] tracking-tighter2 text-foreground group-hover:text-sky transition-colors line-clamp-2 mb-2">
                        {announcement.title}
                    </h3>

                    <p className="text-[13px] text-ink-500 line-clamp-2 mb-4">
                        {announcement.summary}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-ink-500">
                        <div className="flex items-center gap-3">
                            <span className="inline-flex items-center gap-1">
                                <Calendar className="w-3 h-3" strokeWidth={1.75} />
                                {new Date(announcement.publishedAt).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                            </span>
                            <span className="inline-flex items-center gap-1">
                                <Eye className="w-3 h-3" strokeWidth={1.75} />
                                {announcement.viewCount}
                            </span>
                        </div>
                        <span className="text-sky group-hover:translate-x-0.5 transition-transform">
                            <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                        </span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
