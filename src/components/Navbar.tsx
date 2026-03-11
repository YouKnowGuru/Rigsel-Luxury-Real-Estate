"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, Home, Building2, Calculator, Info, Mail, Settings, Newspaper, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { useSettings } from "@/context/SettingsContext";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Properties", href: "/properties", icon: Building2 },
  { name: "Land Calculator", href: "/land-calculator", icon: Calculator },
  { name: "About", href: "/about", icon: Info },
  { name: "Contact", href: "/contact", icon: Mail },
  { name: "Blogs", href: "/blog", icon: Newspaper },
  { name: "Gallery", href: "/gallery", icon: ImageIcon },
  { name: "Admin", href: "/admin", icon: Settings },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { settings } = useSettings();
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  if (isAdminPage) return null;

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled
            ? "bg-white shadow-md border-b-2 border-bhutan-gold/80 py-4"
            : "bg-white/10 backdrop-blur-md border-b border-white/20 py-6"
        )}
      >
        {/* Subtle Bhutan Pattern Overlay for the navbar background */}
        <div className={cn("absolute inset-0 bg-thangka opacity-[0.03] pointer-events-none", isScrolled ? "block" : "hidden")} />

        <div className="container-luxury mx-auto relative z-10 w-full px-6 lg:px-10">
          <nav className="flex items-center justify-between w-full relative">

            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <Logo
                size="lg"
                showText
                dark={!isScrolled}
                className="transition-all duration-500"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex flex-1 justify-center relative z-20">
              <div className={cn("flex items-center gap-6 xl:gap-8 px-8 py-3 rounded-full transition-all duration-500", isScrolled ? "" : "bg-bhutan-dark/20 backdrop-blur-md border border-white/10 shadow-lg")}>
                {navItems.map((item) => (
                  <Link key={item.name} href={item.href} className="group relative py-2">
                    <span
                      className={cn(
                        "text-[11px] xl:text-[12px] font-bold uppercase tracking-[0.15em] transition-colors duration-300 relative z-10",
                        pathname === item.href
                          ? (isScrolled ? "text-bhutan-red" : "text-white")
                          : (isScrolled ? "text-bhutan-dark hover:text-bhutan-red" : "text-white/70 hover:text-white")
                      )}
                    >
                      {item.name}
                    </span>

                    {/* Hover Animated Underline */}
                    <span className={cn(
                      "absolute bottom-0 left-0 w-full h-[2px] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out",
                      isScrolled ? "bg-bhutan-gold shadow-[0_0_8px_rgba(244,196,48,0.6)]" : "bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]"
                    )} />

                    {/* Active State Underline */}
                    {pathname === item.href && (
                      <motion.div
                        layoutId="nav-underline"
                        className={cn("absolute bottom-0 left-0 right-0 h-[2px]", isScrolled ? "bg-bhutan-red" : "bg-white")}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Section (Contact/Mobile) */}
            <div className="flex items-center gap-6 relative z-10">
              <div className="hidden md:flex items-center gap-3 group cursor-pointer pr-4 border-r border-white/20">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm",
                  isScrolled ? "bg-bhutan-red/10 text-bhutan-red group-hover:bg-bhutan-red group-hover:text-white" : "bg-white/10 text-white group-hover:bg-white group-hover:text-bhutan-red"
                )}>
                  <Phone className="w-4 h-4" />
                </div>
                <div className="text-left hidden xl:block">
                  <p className={cn("text-[9px] uppercase font-bold tracking-widest mb-0.5", isScrolled ? "text-bhutan-dark/50" : "text-white/60")}>Call Us</p>
                  <p className={cn("text-xs font-bold font-serif tracking-widest", isScrolled ? "text-bhutan-dark" : "text-white")}>{settings.phone}</p>
                </div>
              </div>

              {/* Mobile Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={cn(
                  "lg:hidden w-10 h-10 rounded-lg flex items-center justify-center border transition-colors shadow-sm relative z-50",
                  isScrolled
                    ? "bg-gray-50 text-bhutan-dark border-gray-200 hover:bg-gray-100"
                    : "bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-md"
                )}
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </nav>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed inset-x-0 top-16 md:top-20 z-[45] bg-white border-b-4 border-bhutan-gold shadow-2xl lg:hidden overflow-hidden origin-top"
          >
            <div className="p-6 overflow-y-auto max-h-[calc(100vh-70px)] bg-thangka bg-[length:50px_50px]">
              <div className="space-y-1 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-soft border border-gray-100">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-xl text-sm uppercase tracking-widest font-bold transition-all duration-300",
                        pathname === item.href
                          ? "bg-bhutan-red/5 text-bhutan-red border border-bhutan-red/10 shadow-sm"
                          : "text-bhutan-dark hover:bg-gray-50 hover:pl-6"
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-bhutan-dark rounded-2xl text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-thangka opacity-20 pointer-events-none" />
                <div className="w-12 h-12 rounded-full bg-bhutan-gold mx-auto flex items-center justify-center text-bhutan-dark mb-4 relative z-10">
                  <Phone className="w-5 h-5" />
                </div>
                <p className="text-[10px] text-bhutan-gold/80 font-bold uppercase tracking-widest relative z-10 mb-1">Call Us Immediately</p>
                <p className="text-xl text-white font-serif font-bold tracking-widest relative z-10">{settings.phone}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
