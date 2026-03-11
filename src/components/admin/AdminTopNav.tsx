"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Search, LogOut, User, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "../Logo";

interface AdminTopNavProps {
    unreadCount?: number;
    recentInquiries?: any[];
}

export function AdminTopNav({ unreadCount = 0, recentInquiries = [] }: AdminTopNavProps) {
    const router = useRouter();
    const [adminName, setAdminName] = useState("Admin");
    const [searchQuery, setSearchQuery] = useState("");
    const [mounted, setMounted] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Try to get admin info from token/localStorage
        const token = localStorage.getItem("adminToken");
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split(".")[1]));
                if (payload.username) setAdminName(payload.username);
            } catch {
                // ignore
            }
        }
    }, []);

    const handleLogout = async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        localStorage.removeItem("adminToken");
        router.push("/admin");
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/admin/properties?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    if (!mounted) return null;

    return (
        <motion.header
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="sticky top-0 z-40 h-16 bg-white/80 backdrop-blur-2xl border-b border-bhutan-gold/10 shadow-sm flex items-center px-4 md:px-6 gap-4"
        >
            {/* Spacer for mobile menu button */}
            <div className="w-12 lg:hidden shrink-0" />

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bhutan-dark/30 group-focus-within:text-bhutan-red transition-colors" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search properties..."
                        className="w-full h-9 pl-9 pr-4 rounded-xl bg-[#F9F7F2] border border-transparent focus:border-bhutan-red/20 focus:bg-white focus:outline-none text-base text-bhutan-dark placeholder:text-bhutan-dark/30 transition-all"
                    />
                </div>
            </form>

            <div className="flex-1 hidden md:block" />

            {/* Right Actions */}
            <div className="flex items-center gap-2">
                {/* View Site */}
                <Link
                    href="/"
                    target="_blank"
                    className="hidden sm:flex items-center gap-2 h-9 px-3 rounded-xl bg-[#F9F7F2] border border-transparent hover:border-bhutan-gold/20 text-bhutan-dark/50 hover:text-bhutan-dark transition-all text-base font-medium"
                >
                    <Home className="w-3.5 h-3.5" />
                    <span>View Site</span>
                </Link>

                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className={cn(
                            "relative w-9 h-9 rounded-xl flex items-center justify-center transition-all border",
                            unreadCount > 0
                                ? "bg-bhutan-gold/10 border-bhutan-gold/20 text-bhutan-gold hover:bg-bhutan-gold/20"
                                : "bg-[#F9F7F2] border-transparent text-bhutan-dark/40 hover:text-bhutan-dark hover:border-bhutan-gold/10",
                            showNotifications && "ring-2 ring-bhutan-gold/30"
                        )}
                        title="Messages"
                    >
                        <Bell className={cn("w-4 h-4", unreadCount > 0 && "animate-pulse")} />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-bhutan-red text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                                {unreadCount > 9 ? "9+" : unreadCount}
                            </span>
                        )}
                    </button>

                    <AnimatePresence>
                        {showNotifications && (
                            <>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowNotifications(false)}
                                />
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-bhutan-gold/10 overflow-hidden z-20"
                                >
                                    <div className="p-4 border-b border-bhutan-gold/5 bg-[#F9F7F2]/30">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-bold text-bhutan-dark">Unread Inquiries</h3>
                                            <span className="px-2 py-0.5 bg-bhutan-red/10 text-bhutan-red text-[10px] font-black rounded-full uppercase tracking-tighter">
                                                {unreadCount} New
                                            </span>
                                        </div>
                                    </div>

                                    <div className="max-h-[350px] overflow-y-auto divide-y divide-bhutan-gold/5 scrollbar-none">
                                        {recentInquiries.length === 0 ? (
                                            <div className="py-10 text-center text-bhutan-dark/30 italic text-sm">
                                                No unread messages
                                            </div>
                                        ) : (
                                            recentInquiries.filter(inq => !inq.isRead).slice(0, 5).map((inquiry) => (
                                                <Link
                                                    key={inquiry._id}
                                                    href={`/admin/inquiries/${inquiry._id}`}
                                                    onClick={() => setShowNotifications(false)}
                                                    className="block p-4 hover:bg-[#F9F7F2] transition-colors group"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-bhutan-red text-white flex items-center justify-center text-xs font-bold uppercase shrink-0">
                                                            {inquiry.name.charAt(0)}
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex items-center justify-between gap-2">
                                                                <p className="text-sm font-bold text-bhutan-dark truncate group-hover:text-bhutan-red transition-colors">
                                                                    {inquiry.name}
                                                                </p>
                                                                <span className="text-[9px] font-bold text-bhutan-dark/30 uppercase tracking-tighter whitespace-nowrap">
                                                                    {new Date(inquiry.createdAt).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                            <p className="text-xs text-bhutan-dark/50 line-clamp-1 italic mt-0.5 font-serif">
                                                                "{inquiry.message}"
                                                            </p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))
                                        )}
                                    </div>

                                    <Link
                                        href="/admin/inquiries"
                                        onClick={() => setShowNotifications(false)}
                                        className="block p-3 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-bhutan-red bg-bhutan-red/5 hover:bg-bhutan-red hover:text-white transition-all duration-500"
                                    >
                                        View All Communications →
                                    </Link>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>

                {/* Admin Profile */}
                <div className="flex items-center gap-2.5 pl-2 border-l border-bhutan-gold/10">
                    <Logo size="sm" />
                    <div className="hidden md:block">
                        <p className="text-base font-bold text-bhutan-dark capitalize leading-none">{adminName}</p>
                        <p className="text-xs font-bold text-bhutan-dark/30 uppercase tracking-wider mt-0.5">Administrator</p>
                    </div>
                </div>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="w-9 h-9 rounded-xl bg-[#F9F7F2] border border-transparent hover:bg-bhutan-red hover:text-white hover:border-bhutan-red text-bhutan-dark/40 flex items-center justify-center transition-all"
                    title="Logout"
                >
                    <LogOut className="w-4 h-4" />
                </button>
            </div>
        </motion.header>
    );
}
