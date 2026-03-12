"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Star,
    LayoutDashboard,
    Building2,
    MessageSquare,
    Settings,
    LogOut,
    Menu,
    X,
    Mountain,
    ChevronRight,
    Plus,
    Calculator,
    ChevronLeft,
    Newspaper,
    Image as ImageIcon,
    FileDown,
    Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "../Logo";

const sidebarItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Properties", href: "/admin/properties", icon: Building2 },
    { name: "Add Property", href: "/admin/properties/new", icon: Plus },
    { name: "Messages", href: "/admin/inquiries", icon: MessageSquare, badgeKey: "unread" },
    { name: "Reviews", href: "/admin/reviews", icon: Star },
    { name: "Blogs", href: "/admin/blogs", icon: Newspaper },
    { name: "Team", href: "/admin/team", icon: Users },
    { name: "Gallery", href: "/admin/gallery", icon: ImageIcon },
    { name: "Downloads", href: "/admin/documents", icon: FileDown },
    { name: "Land Calculator", href: "/admin/land-calculator", icon: Calculator },
    { name: "Settings", href: "/admin/settings", icon: Settings },
];

interface AdminSidebarProps {
    unreadCount?: number;
}

export function AdminSidebar({ unreadCount = 0 }: AdminSidebarProps) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    const handleLogout = async () => {
        try {
            await fetch("/api/admin/logout", { method: "POST" });
            localStorage.removeItem("adminToken");
            toast({ title: "Logged Out", description: "You have been safely logged out." });
            router.push("/admin");
        } catch {
            router.push("/admin");
        }
    };

    if (!mounted) return null;

    return (
        <>
            {/* Mobile Toggle Button */}
            <div className="lg:hidden fixed top-4 left-4 z-[70]">
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="w-11 h-11 bg-bhutan-dark text-white rounded-xl flex items-center justify-center shadow-2xl border border-white/10"
                >
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setMobileOpen(false)}
                        className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                animate={{ width: collapsed ? 72 : 256 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                    "fixed left-0 top-0 h-full bg-bhutan-dark z-[65] shadow-[5px_0_30px_rgba(0,0,0,0.4)] border-r border-white/5 flex flex-col overflow-hidden",
                    !mobileOpen && "max-lg:-translate-x-full",
                    "transition-transform lg:translate-x-0"
                )}
            >
                {/* Decorative accent line */}
                <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-bhutan-gold/15 to-transparent" />

                {/* Brand Header */}
                <div className={cn("p-5 border-b border-white/5 flex items-center", collapsed ? "justify-center" : "justify-between")}>
                    <Link href="/admin/dashboard" className="flex items-center gap-3 group min-w-0">
                        <Logo size="md" dark />
                        {!collapsed && (
                            <div className="min-w-0">
                                <h1 className="text-base font-bold text-white tracking-tight truncate">
                                    Phojaa <span className="text-bhutan-gold italic font-light">Admin</span>
                                </h1>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                    <p className="text-white/60 text-sm font-bold uppercase tracking-[0.2em]">Active</p>
                                </div>
                            </div>
                        )}
                    </Link>

                    {/* Collapse toggle – desktop only */}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="hidden lg:flex w-7 h-7 rounded-lg border border-white/10 items-center justify-center text-white/30 hover:text-bhutan-gold hover:border-bhutan-gold/20 transition-all shrink-0"
                    >
                        {collapsed
                            ? <ChevronRight className="w-3.5 h-3.5" />
                            : <ChevronLeft className="w-3.5 h-3.5" />
                        }
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-none">
                    {!collapsed && (
                        <p className="text-white/40 text-sm font-bold uppercase tracking-[0.3em] px-3 mb-3">
                            Navigation
                        </p>
                    )}
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href) && item.href !== "/admin/properties/new");
                        const isAddProperty = item.href === "/admin/properties/new";

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                title={collapsed ? item.name : undefined}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group relative overflow-hidden",
                                    collapsed ? "justify-center" : "",
                                    isActive
                                        ? "bg-bhutan-red/90 text-white shadow-lg shadow-bhutan-red/20"
                                        : isAddProperty
                                            ? "text-bhutan-gold/60 hover:bg-bhutan-gold/10 hover:text-bhutan-gold border border-bhutan-gold/10 hover:border-bhutan-gold/30"
                                            : "text-white/50 hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <div className="relative shrink-0">
                                    <item.icon className={cn(
                                        "w-4 h-4 transition-transform duration-300 group-hover:scale-110",
                                        isActive ? "text-white" : isAddProperty ? "" : "text-bhutan-gold/40 group-hover:text-bhutan-gold/70"
                                    )} />
                                    {/* Badge */}
                                    {item.badgeKey === "unread" && unreadCount > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-bhutan-gold text-bhutan-dark text-[10px] font-bold rounded-full flex items-center justify-center leading-none shadow-sm">
                                            {unreadCount > 9 ? "9+" : unreadCount}
                                        </span>
                                    )}
                                </div>

                                {!collapsed && (
                                    <>
                                        <span className="text-base font-medium truncate flex-1">{item.name}</span>
                                        {item.badgeKey === "unread" && unreadCount > 0 && !isActive && (
                                            <span className="px-1.5 py-0.5 bg-bhutan-gold text-bhutan-dark text-[11px] font-bold rounded-full leading-none">
                                                {unreadCount > 9 ? "9+" : unreadCount}
                                            </span>
                                        )}
                                        {isActive && (
                                            <div className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_6px_white] shrink-0" />
                                        )}
                                    </>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer / Logout */}
                <div className={cn("p-3 border-t border-white/5", collapsed ? "flex justify-center" : "")}>
                    <button
                        onClick={handleLogout}
                        title={collapsed ? "Logout" : undefined}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/30 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 group border border-transparent hover:border-red-500/10 w-full",
                            collapsed ? "justify-center" : ""
                        )}
                    >
                        <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform shrink-0" />
                        {!collapsed && <span className="text-base font-medium">Logout</span>}
                    </button>

                    {!collapsed && (
                        <p className="text-white/20 text-sm font-bold uppercase tracking-[0.3em] text-center mt-3">
                            Phojaa v2.0 Admin
                        </p>
                    )}
                </div>
            </motion.aside>
        </>
    );
}
