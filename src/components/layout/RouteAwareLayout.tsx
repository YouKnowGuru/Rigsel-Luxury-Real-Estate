"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/ui/FloatingActions";

export function RouteAwareLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // During SSR and initial hydration, pathname is null on the server but
  // the client must match the server output. We default to false (show nav)
  // on both server and first client paint, then hide it after mount.
  const isAdmin = mounted && pathname?.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Navbar />}
      <div className="relative">{children}</div>
      {!isAdmin && <Footer />}
      {!isAdmin && <FloatingActions />}
    </>
  );
}
