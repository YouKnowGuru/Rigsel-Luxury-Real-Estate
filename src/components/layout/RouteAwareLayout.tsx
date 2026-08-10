"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/ui/FloatingActions";
import { GlassBackground } from "@/components/ui/GlassBackground";
import { PageTransition } from "@/components/motion/PageTransition";

export function RouteAwareLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAdmin = mounted && pathname?.startsWith("/admin");

  return (
    <>
      {/* Animated frosted-glass scene behind every page (public + admin) */}
      <GlassBackground />
      {!isAdmin && <Navbar />}
      <div id="main-content" className="relative">
        <PageTransition>{children}</PageTransition>
      </div>
      {!isAdmin && <Footer />}
      {!isAdmin && <FloatingActions />}
    </>
  );
}

