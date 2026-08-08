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
    ChevronRight,
    Plus,
    Calculator,
    ChevronLeft,
    Newspaper,
    Image as ImageIcon,
    Megaphone,
    Users,
    MessageCircle,
    Box,
    Code2,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";

const sidebarItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Properties", href: "/admin/properties", icon: Building2 },
    { name: "Add Property", href: "/admin/properties/new", icon: Plus },
    { name: "Messages", href: "/admin/inquiries", icon: MessageSquare, badgeKey: "unread" },
    { name: "Reviews", href: "/admin/reviews", icon: Star },
    { name: "Live Chats", href: "/admin/chats", icon: MessageCircle },
    { name: "Blogs", href: "/admin/blogs", icon: Newspaper },
    { name: "Team", href: "/admin/team", icon: Users },
    { name: "Gallery", href: "/admin/gallery", icon: ImageIcon },
    { name: "Architecture 360°", href: "/admin/architecture-design", icon: Box },
    { name: "Phojaa95 Solutions", href: "/admin/phojaa95-solutions", icon: Code2 },
    { name: "Announcements", href: "/admin/announcements", icon: Megaphone },
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

    return (
        <>
            {/* Mobile toggle */}
            <div className="lg:hidden fixed top-3 left-3 z-[70]">
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="w-10 h-10 bg-card/90 backdrop-blur-xl text-foreground rounded-[14px] flex items-center justify-center shadow-soft border border-ink-100/80"
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? <X className="w-4 h-4" strokeWidth={2} /> : <Menu className="w-4 h-4" strokeWidth={2} />}
                </button>
            </div>

            {/* Mobile overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setMobileOpen(false)}
                        className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-[60]"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                animate={{ width: collapsed ? 72 : 256 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                    "fixed left-0 top-0 h-full admin-glass z-[65] flex flex-col overflow-hidden w-[256px] lg:w-auto",
                    !mobileOpen && "-translate-x-full lg:translate-x-0",
                    "transition-transform duration-300"
                )}
            >
                {/* Header */}
                <div className={cn("h-[68px] px-4 border-b border-ink-100/60 flex items-center shrink-0", collapsed ? "justify-center" : "justify-between")}>
                    <Link href="/admin/dashboard" className="flex items-center gap-2.5 group min-w-0">
                        <div className="w-9 h-9 bg-sky/[0.08] rounded-[14px] flex items-center justify-center shrink-0 group-hover:bg-sky/15 transition-colors overflow-hidden">
                            <Image
                                src="/image/logo.png"
                                alt="PHOJAA95 Logo"
                                width={28}
                                height={28}
                                className="object-cover rounded-[10px]"
                            />
                        </div>
                        {!collapsed && (
                            <div className="min-w-0">
                                <h1 className="text-[15px] font-semibold text-foreground tracking-tight truncate">
                                    Phojaa Admin
                                </h1>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="w-[6px] h-[6px] bg-emerald-500 rounded-full" />
                                    <p className="text-[11px] text-ink-400 font-medium">Live</p>
                                </div>
                            </div>
                        )}
                    </Link>

                    <div className="flex items-center gap-1.5">
                        <ThemeToggle />
                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className="hidden lg:flex w-7 h-7 rounded-lg border border-ink-200/80 items-center justify-center text-ink-400 hover:text-sky hover:border-sky/25 transition-all shrink-0"
                        >
                            {collapsed
                                ? <ChevronRight className="w-3.5 h-3.5" strokeWidth={2} />
                                : <ChevronLeft className="w-3.5 h-3.5" strokeWidth={2} />
                            }
                        </button>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-none">
                    {!collapsed && (
                        <p className="text-[10px] text-ink-300 font-semibold uppercase tracking-[0.18em] px-3 pb-2.5">
                            Navigation
                        </p>
                    )}
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href) && item.href !== "/admin/properties/new");

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                title={collapsed ? item.name : undefined}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-[14px] transition-all duration-200 group relative",
                                    collapsed ? "justify-center" : "",
                                    isActive
                                        ? "bg-sky/[0.08] text-sky font-medium"
                                        : "text-ink-500 hover:text-foreground hover:bg-ink-50/60"
                                )}
                            >
                                <div className="relative shrink-0">
                                    <item.icon className={cn(
                                        "w-[18px] h-[18px] transition-transform duration-200",
                                        isActive ? "text-sky" : "text-ink-400 group-hover:text-ink-600"
                                    )} strokeWidth={1.5} />
                                    {item.badgeKey === "unread" && unreadCount > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-sky text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none shadow-sm">
                                            {unreadCount > 9 ? "9+" : unreadCount}
                                        </span>
                                    )}
                                </div>

                                {!collapsed && (
                                    <>
                                        <span className="text-[13px] truncate flex-1">{item.name}</span>
                                        {item.badgeKey === "unread" && unreadCount > 0 && !isActive && (
                                            <span className="px-1.5 py-0.5 bg-sky/[0.08] text-sky text-[10px] font-bold rounded-full leading-none">
                                                {unreadCount > 9 ? "9+" : unreadCount}
                                            </span>
                                        )}
                                        {isActive && (
                                            <div className="w-1 h-1 bg-sky rounded-full shrink-0" />
                                        )}
                                    </>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className={cn("p-3 border-t border-ink-100/60", collapsed ? "flex justify-center" : "")}>
                    <button
                        onClick={handleLogout}
                        title={collapsed ? "Logout" : undefined}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-[14px] text-ink-400 hover:text-red-500 hover:bg-red-50/60 transition-all duration-200 group w-full",
                            collapsed ? "justify-center" : ""
                        )}
                    >
                        <LogOut className="w-[18px] h-[18px] group-hover:translate-x-0.5 transition-transform shrink-0" strokeWidth={1.5} />
                        {!collapsed && <span className="text-[13px] font-medium">Logout</span>}
                    </button>

                    {!collapsed && (
                        <p className="text-[10px] text-ink-300 font-medium uppercase tracking-[0.12em] text-center mt-2">
                            Phojaa CMS v2.0
                        </p>
                    )}
                </div>
            </motion.aside>
        </>
    );
}
