"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Bell, Search, LogOut, User, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "../Logo";

interface AdminTopNavProps {
    unreadCount?: number;
}

export function AdminTopNav({ unreadCount = 0 }: AdminTopNavProps) {
    const router = useRouter();
    const [adminName, setAdminName] = useState("Admin");
    const [searchQuery, setSearchQuery] = useState("");
    const [mounted, setMounted] = useState(false);

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
                <Link
                    href="/admin/inquiries"
                    className={cn(
                        "relative w-9 h-9 rounded-xl flex items-center justify-center transition-all border",
                        unreadCount > 0
                            ? "bg-bhutan-gold/10 border-bhutan-gold/20 text-bhutan-gold hover:bg-bhutan-gold/20"
                            : "bg-[#F9F7F2] border-transparent text-bhutan-dark/40 hover:text-bhutan-dark hover:border-bhutan-gold/10"
                    )}
                    title="Messages"
                >
                    <Bell className={cn("w-4 h-4", unreadCount > 0 && "animate-pulse")} />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-bhutan-red text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    )}
                </Link>

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
