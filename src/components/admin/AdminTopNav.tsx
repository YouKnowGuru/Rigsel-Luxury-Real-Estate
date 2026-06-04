"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Search,
  LogOut,
  User,
  Home,
  ChevronRight,
  X,
  Command,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Dashboard", href: "/admin/dashboard" },
  { name: "Properties", href: "/admin/properties" },
  { name: "Messages", href: "/admin/inquiries" },
  { name: "Live Chats", href: "/admin/chats" },
  { name: "Gallery", href: "/admin/gallery" },
  { name: "Reviews", href: "/admin/reviews" },
  { name: "Team", href: "/admin/team" },
  { name: "Settings", href: "/admin/settings" },
];

interface AdminTopNavProps {
  unreadCount?: number;
  recentInquiries?: Array<{
    _id: string;
    name: string;
    message: string;
    isRead: boolean;
    createdAt: string;
  }>;
}

export function AdminTopNav({ unreadCount = 0, recentInquiries = [] }: AdminTopNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [adminName, setAdminName] = useState("Admin");
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    // Fetch admin info from API instead of decoding token client-side
    const fetchAdminInfo = async () => {
      try {
        const res = await fetch("/api/admin/stats", {
          headers: { "Authorization": "Bearer " }, // Cookie will be sent automatically
        });
        // We just need to verify the cookie works; admin name is not critical
        // The middleware already validates the token
      } catch {
        // ignore
      }
    };
    fetchAdminInfo();
  }, []);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 8);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearch(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/admin/properties?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery("");
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "sticky top-0 z-40 flex flex-col transition-all duration-300",
        scrolled
          ? "glass-nav shadow-soft"
          : "bg-background/80 backdrop-blur-xl border-b border-transparent"
      )}
    >
      {/* Main Nav Bar */}
      <div className="h-[60px] flex items-center px-4 md:px-6 gap-3">
        {/* Mobile spacer for hamburger */}
        <div className="w-10 lg:hidden shrink-0" />

        {/* App Store-style nav links - desktop only */}
        <nav className="hidden xl:flex items-center gap-1 mr-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/admin/dashboard" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200",
                  isActive
                    ? "text-sky bg-sky/[0.06]"
                    : "text-ink-500 hover:text-foreground hover:bg-ink-50/60"
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Search */}
        <div ref={searchRef} className="flex-1 max-w-md relative">
          <form onSubmit={handleSearch}>
            <div className="relative group">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400 group-focus-within:text-sky transition-colors pointer-events-none"
                strokeWidth={1.5}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSearch(true)}
                placeholder="Search properties..."
                className="w-full h-9 pl-9 pr-4 rounded-xl bg-ink-50/60 dark:bg-ink-800/30 border border-transparent focus:border-sky/25 focus:bg-background focus:outline-none text-[13px] text-foreground placeholder:text-ink-400 transition-all duration-200"
              />
              <kbd className="hidden md:inline-flex absolute right-2.5 top-1/2 -translate-y-1/2 h-5 px-1.5 items-center rounded text-[10px] font-medium text-ink-400 bg-ink-100/60 border border-ink-200/40">
                <Command className="w-2.5 h-2.5 mr-0.5" strokeWidth={2} />
                K
              </kbd>
            </div>
          </form>

          {/* Search dropdown */}
          <AnimatePresence>
            {showSearch && searchQuery.trim() && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.98 }}
                transition={{ duration: 0.18 }}
                className="absolute top-full left-0 right-0 mt-2 bg-card rounded-2xl shadow-lifted border border-ink-100/80 p-2 z-50"
              >
                <button
                  onClick={handleSearch}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors text-left"
                >
                  <Search className="w-4 h-4 text-ink-400" strokeWidth={1.5} />
                  <span className="text-[13px] text-foreground">
                    Search for &ldquo;{searchQuery}&rdquo;
                  </span>
                  <ChevronRight
                    className="w-3.5 h-3.5 text-ink-300 ml-auto"
                    strokeWidth={2}
                  />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex-1 hidden md:block" />

        {/* Right actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* View Site */}
          <Link
            href="/"
            target="_blank"
            className="hidden sm:flex items-center gap-2 h-9 px-3 rounded-xl bg-ink-50/60 dark:bg-ink-800/30 border border-transparent hover:border-ink-200/80 text-ink-500 hover:text-foreground transition-all text-[13px] font-medium"
          >
            <Home className="w-4 h-4" strokeWidth={1.5} />
            <span className="hidden lg:inline">View Site</span>
          </Link>

          {/* Notifications */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={cn(
                "relative w-9 h-9 rounded-xl flex items-center justify-center transition-all border",
                unreadCount > 0
                  ? "bg-sky/[0.06] border-sky/15 text-sky hover:bg-sky/10"
                  : "bg-ink-50/60 dark:bg-ink-800/30 border-transparent text-ink-400 hover:text-foreground hover:border-ink-200/80",
                showNotifications && "ring-[3px] ring-sky/15"
              )}
              title="Messages"
            >
              <Bell
                className={cn("w-4 h-4", unreadCount > 0 && "animate-pulse")}
                strokeWidth={1.5}
              />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-sky text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
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
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.96 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute right-0 mt-2.5 w-[320px] sm:w-[360px] bg-card rounded-2xl shadow-lifted border border-ink-100/80 overflow-hidden z-20"
                  >
                    <div className="p-3.5 sm:p-4 border-b border-ink-100/60 bg-card">
                      <div className="flex items-center justify-between">
                        <h3 className="text-[15px] font-semibold text-foreground">
                          Notifications
                        </h3>
                        {unreadCount > 0 && (
                          <span className="px-2 py-0.5 bg-sky/[0.08] text-sky text-[10px] font-bold rounded-full uppercase tracking-tight">
                            {unreadCount} New
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="max-h-[320px] sm:max-h-[360px] overflow-y-auto divide-y divide-ink-100/60 scrollbar-none bg-card">
                      {recentInquiries.length === 0 ? (
                        <div className="py-10 sm:py-12 text-center text-ink-400 text-[13px]">
                          No unread messages
                        </div>
                      ) : (
                        recentInquiries
                          .filter((inq) => !inq.isRead)
                          .slice(0, 5)
                          .map((inquiry) => (
                            <Link
                              key={inquiry._id}
                              href={`/admin/inquiries/${inquiry._id}`}
                              onClick={() => setShowNotifications(false)}
                              className="block p-3.5 sm:p-4 hover:bg-ink-50/60 transition-colors group"
                            >
                              <div className="flex items-start gap-3">
                                <div className="w-9 h-9 rounded-full bg-sky/[0.08] text-sky flex items-center justify-center text-[12px] font-bold uppercase shrink-0">
                                  {inquiry.name.charAt(0)}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center justify-between gap-2">
                                    <p className="text-[13px] font-semibold text-foreground truncate group-hover:text-sky transition-colors">
                                      {inquiry.name}
                                    </p>
                                    <span className="text-[10px] font-medium text-ink-400 whitespace-nowrap">
                                      {new Date(
                                        inquiry.createdAt
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-[12px] text-ink-400 line-clamp-1 mt-0.5">
                                    &ldquo;{inquiry.message}&rdquo;
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
                      className="block p-3 sm:p-3.5 text-center text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.1em] text-sky bg-sky/[0.03] hover:bg-sky hover:text-background transition-all duration-300"
                    >
                      View All Messages &rarr;
                    </Link>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* User */}
          <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-ink-100/60">
            <div className="w-8 h-8 bg-sky/[0.06] rounded-[10px] flex items-center justify-center">
              <User
                className="w-4 h-4 text-sky"
                strokeWidth={1.5}
              />
            </div>
            <div className="hidden md:block">
              <p className="text-[13px] font-semibold text-foreground capitalize leading-none">
                {adminName}
              </p>
              <p className="text-[11px] text-ink-400 font-medium mt-0.5">
                Administrator
              </p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-9 h-9 rounded-xl bg-ink-50/60 dark:bg-ink-800/30 border border-transparent hover:bg-red-50 hover:text-red-500 hover:border-red-200/60 text-ink-400 flex items-center justify-center transition-all duration-200"
            title="Logout"
          >
            <LogOut className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Sub-nav: breadcrumb-like page indicator on scroll */}
      <AnimatePresence>
        {scrolled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-ink-100/40 overflow-hidden"
          >
            <div className="h-9 flex items-center px-4 md:px-6 gap-2">
              <span className="text-[11px] text-ink-400 font-medium">
                Phojaa Admin
              </span>
              <ChevronRight
                className="w-3 h-3 text-ink-300"
                strokeWidth={2}
              />
              <span className="text-[11px] text-foreground font-semibold capitalize">
                {pathname.replace("/admin/", "").replace(/-/g, " ") || "Dashboard"}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
