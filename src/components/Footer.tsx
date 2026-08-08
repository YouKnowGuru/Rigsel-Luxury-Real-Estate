"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSettings } from "@/context/SettingsContext";

const linkColumns = [
  {
    title: "Shop and Learn",
    links: [
      { name: "Properties", href: "/properties" },
      { name: "Houses", href: "/properties?type=house" },
      { name: "Apartments", href: "/properties?type=apartment" },
      { name: "Land", href: "/properties?type=land" },
      { name: "Hotels", href: "/properties?type=hotel" },
      { name: "Gallery", href: "/gallery" },
    ],
  },
  {
    title: "Services",
    links: [
      { name: "Land Calculator", href: "/land-calculator" },
      { name: "Architecture 360°", href: "/architecture-design" },
      { name: "Phojaa95 Solutions", href: "/phojaa95-solutions" },
      { name: "Announcements", href: "/announcements" },
      { name: "Blog", href: "/blog" },
      { name: "Contact a specialist", href: "/contact" },
    ],
  },
  {
    title: "PHOJAA95",
    links: [
      { name: "About", href: "/about" },
      { name: "Newsroom", href: "/blog" },
      { name: "Contact", href: "/contact" },
      { name: "Admin", href: "/admin" },
    ],
  },
  {
    title: "About PHOJAA95",
    links: [
      { name: "Our story", href: "/about" },
      { name: "Trust & verification", href: "/about#trust" },
      { name: "Terms & conditions", href: "/terms" },
      { name: "Privacy", href: "/terms" },
    ],
  },
];

export function Footer() {
  const pathname = usePathname();
  const { settings } = useSettings();
  const isAdminPage = pathname?.startsWith("/admin");
  if (isAdminPage) return null;

  return (
    <footer className="glass-strong text-ink-500 dark:text-ink-300">
      <div className="container-apple-wide py-10 sm:py-14">
        {/* Logo */}
        <div className="flex items-center gap-3 pb-6 border-b border-ink-200/70 dark:border-ink-700/40">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-ink-200 dark:border-ink-700 bg-white flex-shrink-0">
            <Image
              src="/image/logo.png"
              alt="PHOJAA95 Real Estate Logo"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-foreground tracking-tight">
              {settings.siteName || "PHOJAA95 Real Estate"}
            </p>
            <p className="text-[11px] text-ink-400 uppercase tracking-wider">Bhutan Property</p>
          </div>
        </div>

        {/* Helpline strip */}
        <div className="text-[12px] leading-relaxed pb-6 border-b border-ink-200/70 dark:border-ink-700/40">
          <p>
            <span className="text-foreground">Need help choosing?</span>{" "}
            <Link href="/contact" className="link-apple">
              Chat with a specialist
            </Link>{" "}
            or call{" "}
            <a
              href={`tel:${settings.phone || ""}`}
              className="text-foreground hover:text-sky transition-colors tabular-nums"
            >
              {settings.phone || "+975 1611 1999"}
            </a>
            .
          </p>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 py-8 sm:py-10 border-b border-ink-200/70 dark:border-ink-700/40">
          {linkColumns.map((col) => (
            <div key={col.title}>
              <h3 className="text-[12px] font-semibold text-foreground mb-3 tracking-tight">
                {col.title}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-[12px] text-ink-500 hover:text-foreground dark:text-ink-300 dark:hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-6 space-y-3 text-[12px]">
          <p>
            PHOJAA95 acts as a facilitator connecting buyers and sellers across
            Bhutan. All listings are independently verifiable; please consult a
            qualified professional before any commitment.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3">
            <p>
              Copyright © {new Date().getFullYear()}{" "}
              {settings.siteName || "PHOJAA95 Real Estate"}. All rights reserved.
            </p>
            <nav
              className="flex flex-wrap items-center gap-x-4 gap-y-1"
              aria-label="Footer secondary"
            >
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Terms of use
              </Link>
              <span className="text-ink-300">|</span>
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Privacy policy
              </Link>
              <span className="text-ink-300">|</span>
              <Link href="/contact" className="hover:text-foreground transition-colors">
                Contact
              </Link>
              <span className="text-ink-300">|</span>
              <span>Paro, Bhutan</span>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
