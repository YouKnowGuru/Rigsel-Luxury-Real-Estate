"use client";

import { useState, useEffect, useCallback, memo, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Menu, X, Search, Phone, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSettings } from "@/context/SettingsContext";
import { ThemeToggle } from "./ThemeToggle";
import { Logo } from "./Logo";
import {
  SolutionsNavDropdown,
  SolutionsMobileNavSection,
} from "@/components/nav/SolutionsNavMenu";

/* ============================================================
   NAVBAR — Apple.com-style luxury navigation
   Principles:
   • Glassmorphism that intensifies on scroll
   • Centered nav links (Apple Store pattern)
   • Pill-shaped active indicators
   • Fullscreen mobile menu with staggered reveals
   • Search overlay (Apple.com style)
   • All touch targets ≥ 44px
   ============================================================ */

const navItems = [
  { name: "Home", href: "/" },
  { name: "Properties", href: "/properties" },
  { name: "Calculator", href: "/land-calculator" },
  { name: "About", href: "/about" },
  { name: "Blog", href: "/blog" },
  { name: "Gallery", href: "/gallery" },
  { name: "Architecture", href: "/architecture-design" },
  { name: "Announcements", href: "/announcements" },
  { name: "Contact", href: "/contact" },
];

// Memoized nav link to prevent unnecessary re-renders
const NavLink = memo(function NavLink({
  item,
  isActive,
  onClick,
}: {
  item: (typeof navItems)[0];
  isActive: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "relative inline-flex items-center justify-center h-8 px-3 rounded-full text-[13px] font-medium transition-colors duration-fast no-tap outline-none focus-visible:ring-2 focus-visible:ring-sky/50 focus-visible:ring-offset-2",
        isActive
          ? "text-foreground"
          : "text-ink-500 hover:text-foreground"
      )}
    >
      {isActive && (
        <motion.span
          layoutId="nav-pill"
          className="absolute inset-0 bg-ink-100/70 dark:bg-ink-800/60 rounded-full"
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
        />
      )}
      <span className="relative z-10">{item.name}</span>
    </Link>
  );
});

// Mobile menu item with stagger animation
const MobileNavItem = memo(function MobileNavItem({
  item,
  isActive,
  index,
  onClick,
}: {
  item: (typeof navItems)[0];
  isActive: boolean;
  index: number;
  onClick: () => void;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.li
      initial={shouldReduceMotion ? {} : { opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay: index * 0.04 + 0.1,
        duration: 0.35,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Link
        href={item.href}
        onClick={onClick}
        className={cn(
          "group flex items-center justify-between py-3.5 transition-colors no-tap",
          isActive ? "text-foreground" : "text-ink-500 hover:text-foreground"
        )}
      >
        <span className="flex items-center gap-3">
          <span
            className={cn(
              "w-1.5 h-1.5 rounded-full transition-colors",
              isActive ? "bg-sky" : "bg-ink-300"
            )}
          />
          <span className="text-[17px] font-semibold tracking-tight">
            {item.name}
          </span>
        </span>
        <ChevronRight
          className="w-4 h-4 text-ink-400 group-hover:translate-x-0.5 transition-transform"
          strokeWidth={1.5}
        />
      </Link>
    </motion.li>
  );
});

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const { settings } = useSettings();
  const pathname = usePathname();
  const router = useRouter();
  const isAdminPage = pathname.startsWith("/admin");
  const shouldReduceMotion = useReducedMotion();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  // Lock body scroll when menu open
  useEffect(() => {
    const shouldLock = isMobileMenuOpen || isSearchOpen;
    document.body.style.overflow = shouldLock ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen, isSearchOpen]);

  // Scroll listener with passive flag
  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 10);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard shortcut: Cmd+K to open search
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((s) => !s);
      }
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setIsMobileMenuOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);

  // Execute search and navigate to properties page
  const executeSearch = useCallback(() => {
    const query = searchQuery.trim();
    if (!query) return;
    const params = new URLSearchParams();
    params.append("search", query);
    router.push(`/properties?${params.toString()}`);
    setIsSearchOpen(false);
    setSearchQuery("");
  }, [searchQuery, router]);

  if (isAdminPage) return null;

  return (
    <>
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:px-4 focus:py-2 focus:bg-sky focus:text-white focus:rounded-lg focus:text-sm focus:font-medium"
      >
        Skip to content
      </a>

      {/* Main navbar */}
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300",
          scrolled
            ? "glass-nav shadow-soft"
            : "bg-background/60 backdrop-blur-2xl border-b border-transparent"
        )}
      >
        <div className="container-apple-wide">
          <nav
            className="flex items-center justify-between h-11 sm:h-12 text-[13px]"
            aria-label="Primary"
          >
            {/* Brand — left */}
            <Link
              href="/"
              className="no-tap shrink-0 -ml-1"
              aria-label="PHOJAA95 Real Estate — Home"
            >
              <Logo size="sm" showText />
            </Link>

            {/* Desktop nav — centered pill cluster */}
            <div className="hidden lg:flex items-center">
              <div className="flex items-center gap-0.5 bg-ink-50/40 dark:bg-ink-800/30 rounded-full px-1.5 py-1">
                {navItems.map((item) => {
                  const isActive =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href);
                  return (
                    <span key={item.name} className="contents">
                      <NavLink item={item} isActive={isActive} />
                      {item.href === "/architecture-design" && (
                        <SolutionsNavDropdown />
                      )}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Right cluster */}
            <div className="flex items-center gap-0.5">
              {/* Search trigger */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="inline-flex items-center justify-center w-9 h-9 rounded-full text-ink-400 hover:text-foreground hover:bg-ink-100/60 dark:hover:bg-ink-800/40 transition-colors no-tap outline-none focus-visible:ring-2 focus-visible:ring-sky/50"
                aria-label="Search (Cmd+K)"
                title="Search (Cmd+K)"
              >
                <Search className="w-4 h-4" strokeWidth={1.5} />
              </button>

              <ThemeToggle />

              {/* Mobile menu toggle */}
              <button
                onClick={() => setIsMobileMenuOpen((s) => !s)}
                className="lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-full text-foreground/85 hover:text-foreground hover:bg-ink-100/60 dark:hover:bg-ink-800/40 transition-colors no-tap outline-none focus-visible:ring-2 focus-visible:ring-sky/50"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isMobileMenuOpen ? (
                    <motion.span
                      key="x"
                      initial={shouldReduceMotion ? {} : { rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                    >
                      <X className="w-5 h-5" strokeWidth={1.5} />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="m"
                      initial={shouldReduceMotion ? {} : { rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                    >
                      <Menu className="w-5 h-5" strokeWidth={1.5} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Search overlay — Apple.com style */}
      <AnimatePresence>
        {isSearchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[48] bg-foreground/20 backdrop-blur-sm"
              onClick={() => setIsSearchOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-x-0 top-11 sm:top-12 z-[49] glass-strong"
              role="search"
              aria-label="Site search"
            >
              <div className="container-apple-wide py-4">
                <div className="relative">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400"
                    strokeWidth={1.5}
                  />
                  <input
                    ref={searchInputRef}
                    type="search"
                    name="search"
                    autoComplete="off"
                    autoFocus
                    placeholder="Search properties, locations…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        executeSearch();
                      }
                    }}
                    className="w-full h-11 pl-11 pr-4 rounded-2xl bg-fog dark:bg-ink-800/40 border border-transparent text-foreground placeholder:text-ink-400 text-[15px] outline-none focus:border-sky/30 focus:ring-[3px] focus:ring-sky/10 transition-all"
                    aria-label="Search properties and locations"
                  />
                  <kbd className="hidden sm:inline-flex absolute right-3 top-1/2 -translate-y-1/2 items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono text-ink-400 bg-ink-100/60 dark:bg-ink-700/40 border border-ink-200/60 dark:border-ink-600/40">
                    ESC
                  </kbd>
                </div>
                <div className="mt-3 flex items-center gap-2 text-[12px] text-ink-400">
                  <span>Press</span>
                  <kbd className="inline-flex items-center px-1 py-0.5 rounded text-[10px] font-mono bg-ink-100/60 dark:bg-ink-700/40 border border-ink-200/60">
                    ↵
                  </kbd>
                  <span>to search</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile menu — fullscreen sheet */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[48] bg-foreground/20 backdrop-blur-sm lg:hidden"
              onClick={closeMobileMenu}
              aria-hidden="true"
            />

            {/* Menu panel */}
            <motion.aside
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation menu"
              initial={shouldReduceMotion ? {} : { opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-x-0 top-11 sm:top-12 z-[49] glass-strong lg:hidden flex flex-col safe-bottom max-h-[calc(100vh-48px)] overflow-y-auto overscroll-contain"
            >
              <nav className="px-5 sm:px-8 pt-3 pb-8">
                {/* Quick actions */}
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-ink-100 dark:border-ink-700/40">
                  <Link
                    href="/properties"
                    onClick={closeMobileMenu}
                    className="flex-1 inline-flex items-center justify-center gap-2 h-10 rounded-xl bg-sky text-white text-[13px] font-medium hover:bg-sky-hover active:scale-[0.97] transition-all no-tap"
                  >
                    <Search className="w-4 h-4" strokeWidth={1.5} />
                    Browse Properties
                  </Link>
                  {settings.phone && (
                    <a
                      href={`tel:${settings.phone}`}
                      className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-fog dark:bg-ink-800/40 text-foreground hover:bg-ink-100/60 transition-colors no-tap"
                      aria-label="Call us"
                    >
                      <Phone className="w-4 h-4" strokeWidth={1.5} />
                    </a>
                  )}
                </div>

                {/* Nav links */}
                <ul className="space-y-0.5">
                  {navItems.map((item, i) => {
                    const isActive =
                      item.href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(item.href);
                    return (
                      <span key={item.name} className="contents">
                        <MobileNavItem
                          item={item}
                          isActive={isActive}
                          index={i}
                          onClick={closeMobileMenu}
                        />
                        {item.href === "/architecture-design" && (
                          <SolutionsMobileNavSection
                            onNavigate={closeMobileMenu}
                            startIndex={i + 1}
                          />
                        )}
                      </span>
                    );
                  })}
                </ul>

                {/* Contact card */}
                {settings.phone && (
                  <motion.a
                    initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.35 }}
                    href={`tel:${settings.phone}`}
                    className="mt-6 flex items-center justify-between rounded-apple-xl bg-fog dark:bg-ink-800/40 px-5 py-4 text-foreground hover:bg-ink-100/40 transition-colors"
                  >
                    <div>
                      <p className="text-[11px] uppercase tracking-eyebrow text-ink-400 mb-0.5">
                        Talk to us
                      </p>
                      <p className="text-[17px] font-semibold tracking-tightest tabular-nums">
                        {settings.phone}
                      </p>
                    </div>
                    <span className="text-sky text-[13px]">Call ›</span>
                  </motion.a>
                )}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
