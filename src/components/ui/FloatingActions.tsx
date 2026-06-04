"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSettings } from "@/context/SettingsContext";
import { cn } from "@/lib/utils";

export function FloatingActions() {
  const pathname = usePathname();
  const { settings } = useSettings();

  if (pathname?.startsWith("/admin")) return null;

  // Home uses Phojaa A1 AI chat instead of WhatsApp
  if (pathname === "/") return null;

  const isPropertyDetail =
    pathname?.startsWith("/properties/") &&
    pathname !== "/properties" &&
    !pathname.includes("/edit");

  let whatsappUrl =
    settings?.whatsapp ||
    settings?.phone ||
    "https://wa.me/message/PKJFHGFCVTYPH1";

  if (!whatsappUrl.startsWith("http")) {
    const digits = whatsappUrl.replace(/\D/g, "");
    whatsappUrl = `https://wa.me/${digits}`;
  }

  if (isPropertyDetail && typeof window !== "undefined") {
    const text = encodeURIComponent(
      `Hi, I'm inquiring about this property: ${window.location.href}`
    );
    whatsappUrl += whatsappUrl.includes("?") ? `&text=${text}` : `?text=${text}`;
  } else {
    const siteName = settings?.siteName || "PHOJAA95 Real Estate";
    const text = encodeURIComponent(
      `Hi, I'm interested in ${siteName} services.`
    );
    whatsappUrl += whatsappUrl.includes("?") ? `&text=${text}` : `?text=${text}`;
  }

  return (
    <div
      className={cn(
        "fixed z-[60] flex flex-col gap-3 safe-bottom",
        "bottom-4 right-4 sm:bottom-6 sm:right-6"
      )}
      style={{ paddingBottom: "max(0px, env(safe-area-inset-bottom))" }}
    >
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        className="group relative no-tap"
        aria-label="Contact us on WhatsApp"
      >
        <div className="w-12 h-12 sm:w-[52px] sm:h-[52px] bg-[#25D366] text-white rounded-full shadow-lifted flex items-center justify-center transition-shadow group-hover:shadow-product">
          <MessageCircle
            className="w-5 h-5 sm:w-6 sm:h-6 fill-current"
            strokeWidth={0}
          />
        </div>
      </motion.a>
    </div>
  );
}
