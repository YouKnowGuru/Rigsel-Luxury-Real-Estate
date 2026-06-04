"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    Megaphone,
    Plus,
    Search,
    Loader2,
    Pin,
    Eye,
    EyeOff,
    Trash2,
    Pencil,
    Calendar,
    BarChart3,
    Filter,
    ChevronDown,
    AlertTriangle,
    ArrowUpCircle,
    Circle,
    CheckCircle2,
    X,
    Newspaper,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Announcement {
    _id: string;
    title: string;
    content: string;
    summary: string;
    category: string;
    priority: "low" | "normal" | "high" | "urgent";
    isPinned: boolean;
    isPublished: boolean;
    publishedAt: string;
    expiresAt?: string;
    coverImage?: string;
    author: string;
    viewCount: number;
    createdAt: string;
}

const statusFilters = [
    { key: "all", label: "All", icon: Filter },
    { key: "published", label: "Published", icon: CheckCircle2 },
    { key: "drafts", label: "Drafts", icon: EyeOff },
    { key: "expired", label: "Expired", icon: AlertTriangle },
    { key: "pinned", label: "Pinned", icon: Pin },
];

const priorityConfig = {
    urgent: { color: "bg-red-500/10 text-red-600 border-red-200", icon: AlertTriangle },
    high: { color: "bg-orange-500/10 text-orange-600 border-orange-200", icon: ArrowUpCircle },
    normal: { color: "bg-sky/10 text-sky border-sky/20", icon: Circle },
    low: { color: "bg-ink-100 text-ink-500 border-ink-200", icon: CheckCircle2 },
};

const categoryColors: Record<string, string> = {
    General: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
    Promotion: "bg-purple-500/10 text-purple-600 border-purple-200",
    Event: "bg-amber-500/10 text-amber-600 border-amber-200",
    Update: "bg-blue-500/10 text-blue-600 border-blue-200",
    Alert: "bg-red-500/10 text-red-600 border-red-200",
};

export default function AnnouncementsManagement() {
    const { toast } = useToast();
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchAnnouncements();
    }, [statusFilter]);

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            const url = new URL("/api/admin/announcements", window.location.origin);
            if (statusFilter !== "all") url.searchParams.set("status", statusFilter);

            const res = await fetch(url.toString());
            const data = await res.json();
            if (data.success) {
                setAnnouncements(data.data);
            }
        } catch (error) {
            console.error("Error fetching announcements:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this announcement?")) return;

        try {
            const res = await fetch(`/api/admin/announcements/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (data.success) {
                setAnnouncements(announcements.filter((a) => a._id !== id));
                toast({ title: "Deleted", description: "Announcement removed successfully." });
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete announcement", variant: "destructive" });
        }
    };

    const togglePin = async (id: string, current: boolean) => {
        try {
            const res = await fetch(`/api/admin/announcements/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isPinned: !current }),
            });
            const data = await res.json();
            if (data.success) {
                setAnnouncements(announcements.map((a) => (a._id === id ? { ...a, isPinned: !current } : a)));
                toast({ title: !current ? "Pinned" : "Unpinned", description: `Announcement ${!current ? "pinned to top" : "unpinned"}.` });
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to update", variant: "destructive" });
        }
    };

    const togglePublish = async (id: string, current: boolean) => {
        try {
            const res = await fetch(`/api/admin/announcements/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isPublished: !current }),
            });
            const data = await res.json();
            if (data.success) {
                setAnnouncements(announcements.map((a) => (a._id === id ? { ...a, isPublished: !current } : a)));
                toast({ title: !current ? "Published" : "Unpublished", description: `Announcement is now ${!current ? "live" : "a draft"}.` });
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to update", variant: "destructive" });
        }
    };

    const filtered = announcements.filter((a) => {
        const q = searchQuery.toLowerCase();
        return a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q);
    });

    return (
        <div className="space-y-4 sm:space-y-6 lg:space-y-8 p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8">
            {/* Header */}
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div className="min-w-0">
                    <p className="text-sky text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.12em] mb-1">
                        Communications
                    </p>
                    <h1 className="text-lg sm:text-xl md:text-2xl lg:text-[28px] font-semibold text-foreground tracking-tight flex items-center gap-2 sm:gap-3">
                        <Megaphone className="text-sky w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 shrink-0" strokeWidth={1.5} />
                        <span className="truncate">Announcements</span>
                    </h1>
                    <p className="text-ink-600 mt-1 text-xs sm:text-sm md:text-base font-medium">
                        Post updates, promotions, and news for your audience.
                    </p>
                </div>
                <Link href="/admin/announcements/new">
                    <Button className="h-9 sm:h-10 md:h-11 px-3 sm:px-4 md:px-6 bg-sky hover:bg-sky/90 text-background rounded-full shadow-soft shrink-0 self-start sm:self-auto">
                        <Plus className="w-4 h-4 mr-1.5 sm:mr-2 shrink-0" strokeWidth={1.5} />
                        <span className="text-xs sm:text-sm hidden sm:inline">New Announcement</span>
                        <span className="text-xs sm:text-sm sm:hidden">New</span>
                    </Button>
                </Link>
            </header>

            {/* Toolbar */}
            <div className="bg-card p-2.5 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl border border-ink-100/60 shadow-soft flex flex-col sm:flex-row gap-2 sm:gap-3 sm:items-center">
                <div className="relative flex-1 min-w-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 w-4 h-4" strokeWidth={1.5} />
                    <Input
                        placeholder="Search announcements..."
                        className="pl-9 sm:pl-10 h-9 sm:h-10 md:h-11 rounded-xl border-ink-200 focus:border-sky focus:ring-2 focus:ring-sky/15 bg-background dark:bg-card text-xs sm:text-sm md:text-base"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={cn(
                        "flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs sm:text-sm font-medium transition-all shrink-0",
                        showFilters
                            ? "bg-sky/10 border-sky/30 text-sky"
                            : "border-ink-200 text-ink-500 hover:text-foreground hover:border-ink-300"
                    )}
                >
                    <Filter className="w-3.5 h-3.5" strokeWidth={1.5} />
                    Filters
                    <ChevronDown className={cn("w-3 h-3 transition-transform", showFilters && "rotate-180")} strokeWidth={1.5} />
                </button>
            </div>

            {/* Filter Pills */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex flex-wrap gap-2"
                    >
                        {statusFilters.map((f) => (
                            <button
                                key={f.key}
                                onClick={() => setStatusFilter(f.key)}
                                className={cn(
                                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
                                    statusFilter === f.key
                                        ? "bg-sky text-background border-sky shadow-soft"
                                        : "bg-card border-ink-200 text-ink-500 hover:text-foreground hover:border-ink-300"
                                )}
                            >
                                <f.icon className="w-3 h-3" strokeWidth={1.5} />
                                {f.label}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-12 sm:py-16 md:py-20">
                    <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 animate-spin text-sky mb-3 sm:mb-4" strokeWidth={1.5} />
                    <p className="text-ink-500 font-medium text-xs sm:text-sm">Loading announcements...</p>
                </div>
            ) : filtered.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
                    {filtered.map((announcement, index) => {
                        const pConfig = priorityConfig[announcement.priority];
                        const isExpired = announcement.expiresAt && new Date(announcement.expiresAt) < new Date();
                        const PIcon = pConfig.icon;

                        return (
                            <motion.div
                                layout
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.35, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
                                key={announcement._id}
                                className={cn(
                                    "bg-card rounded-xl sm:rounded-2xl border p-3.5 sm:p-4 md:p-5 shadow-soft hover:shadow-elevated transition-all group flex flex-col overflow-hidden min-w-0",
                                    announcement.isPinned
                                        ? "border-sky/30 bg-sky/[0.02]"
                                        : "border-ink-100/60"
                                )}
                            >
                                {/* Top row: badges + actions */}
                                <div className="flex items-start justify-between mb-3 gap-2">
                                    <div className="flex flex-wrap gap-1.5">
                                        <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider border", pConfig.color)}>
                                            <PIcon className="w-2.5 h-2.5" strokeWidth={2} />
                                            {announcement.priority}
                                        </span>
                                        <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider border", categoryColors[announcement.category] || "bg-ink-100 text-ink-500 border-ink-200")}>
                                            {announcement.category}
                                        </span>
                                        {announcement.isPinned && (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider bg-sky/10 text-sky border border-sky/20">
                                                <Pin className="w-2.5 h-2.5" strokeWidth={2} />
                                                Pinned
                                            </span>
                                        )}
                                        {!announcement.isPublished && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-600 border border-amber-200">
                                                Draft
                                            </span>
                                        )}
                                        {isExpired && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider bg-red-500/10 text-red-600 border border-red-200">
                                                Expired
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-0.5 shrink-0">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className={cn(
                                                "h-8 w-8 sm:h-9 sm:w-9",
                                                announcement.isPinned ? "text-sky hover:text-sky/80" : "text-ink-400 hover:text-sky"
                                            )}
                                            onClick={() => togglePin(announcement._id, announcement.isPinned)}
                                            title={announcement.isPinned ? "Unpin" : "Pin to top"}
                                        >
                                            <Pin className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4", announcement.isPinned && "fill-current")} strokeWidth={1.5} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 sm:h-9 sm:w-9 text-ink-400 hover:text-foreground"
                                            onClick={() => togglePublish(announcement._id, announcement.isPublished)}
                                            title={announcement.isPublished ? "Unpublish" : "Publish"}
                                        >
                                            {announcement.isPublished ? (
                                                <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={1.5} />
                                            ) : (
                                                <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={1.5} />
                                            )}
                                        </Button>
                                        <Link href={`/admin/announcements/${announcement._id}/edit`}>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 sm:h-9 sm:w-9 text-ink-400 hover:text-sky"
                                                title="Edit"
                                            >
                                                <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={1.5} />
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 sm:h-9 sm:w-9 text-red-500 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => handleDelete(announcement._id)}
                                            title="Delete"
                                        >
                                            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={1.5} />
                                        </Button>
                                    </div>
                                </div>

                                {/* Cover image */}
                                {announcement.coverImage && (
                                    <div className="relative w-full h-32 sm:h-40 rounded-xl overflow-hidden mb-3 bg-ink-50">
                                        <img
                                            src={announcement.coverImage}
                                            alt={announcement.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}

                                {/* Title & Summary */}
                                <h3 className="font-semibold text-foreground text-sm sm:text-base mb-1.5 leading-snug min-w-0 line-clamp-2">
                                    {announcement.title}
                                </h3>
                                <p className="text-ink-600 text-xs sm:text-sm font-medium line-clamp-2 mb-3 sm:mb-4 flex-1 break-words min-w-0">
                                    {announcement.summary}
                                </p>

                                {/* Footer */}
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-3 sm:pt-4 border-t border-ink-100/60 text-[11px] sm:text-[12px] font-medium text-ink-500 min-w-0 gap-2">
                                    <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 md:gap-3 min-w-0">
                                        <span className="flex items-center gap-1 truncate">
                                            <Calendar className="w-3 h-3 shrink-0" strokeWidth={1.5} />
                                            <span className="truncate">{new Date(announcement.publishedAt).toLocaleDateString()}</span>
                                        </span>
                                        <span className="hidden sm:inline shrink-0">&bull;</span>
                                        <span className="truncate">{announcement.author}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-ink-400 shrink-0">
                                        <BarChart3 className="w-3 h-3" strokeWidth={1.5} />
                                        <span>{announcement.viewCount} views</span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12 sm:py-16 md:py-20 bg-card/50 rounded-xl sm:rounded-2xl border-2 border-dashed border-ink-200"
                >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-card rounded-xl sm:rounded-[14px] shadow-soft flex items-center justify-center mx-auto mb-3 sm:mb-4 border border-ink-100/60">
                        <Newspaper className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-ink-300" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold text-foreground mb-1 sm:mb-2">
                        No announcements yet
                    </h3>
                    <p className="text-ink-600 mb-4 sm:mb-6 max-w-[260px] sm:max-w-xs md:max-w-sm mx-auto font-medium text-xs sm:text-sm px-4">
                        Create your first announcement to share news, updates, and promotions with your audience.
                    </p>
                    <Link href="/admin/announcements/new">
                        <Button className="h-9 sm:h-10 md:h-11 px-4 sm:px-6 bg-sky hover:bg-sky/90 text-background rounded-full shadow-soft text-xs sm:text-sm">
                            <Plus className="w-4 h-4 mr-1.5 sm:mr-2" strokeWidth={1.5} />
                            New Announcement
                        </Button>
                    </Link>
                </motion.div>
            )}
        </div>
    );
}
