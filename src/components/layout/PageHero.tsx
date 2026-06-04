"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
  image?: string;
  className?: string;
  align?: "center" | "left";
  tone?: "light" | "dark"; // light = white/fog bg, dark = pure black hero
  ctaPrimary?: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
}

export function PageHero({
  eyebrow,
  title,
  highlight,
  subtitle,
  breadcrumbs,
  image,
  className,
  align = "center",
  tone = "light",
  ctaPrimary,
  ctaSecondary,
}: PageHeroProps) {
  const dark = tone === "dark" || !!image;

  return (
    <section
      className={cn(
        "relative overflow-hidden",
        dark ? "bg-ink-900 text-white" : "bg-white text-foreground",
        className
      )}
    >
      {/* Optional background image */}
      {image && (
        <>
          <Image
            src={image}
            alt=""
            fill
            priority
            className="object-cover ken-burns"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/65" />
        </>
      )}

      {/* Breadcrumbs strip */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className={cn("relative z-10", dark ? "border-b border-white/10" : "border-b border-ink-100")}>
          <div className="container-apple-wide">
            <nav
              aria-label="Breadcrumb"
              className={cn(
                "flex items-center gap-1.5 text-[12px] py-3 flex-wrap",
                dark ? "text-white/65" : "text-ink-500"
              )}
            >
              <Link
                href="/"
                className={cn(
                  "hover:underline underline-offset-2",
                  dark ? "hover:text-white" : "hover:text-foreground"
                )}
              >
                Home
              </Link>
              {breadcrumbs.map((crumb, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className={cn(
                        "hover:underline underline-offset-2",
                        dark ? "hover:text-white" : "hover:text-foreground"
                      )}
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className={dark ? "text-white" : "text-foreground"}>
                      {crumb.label}
                    </span>
                  )}
                </span>
              ))}
            </nav>
          </div>
        </div>
      )}

      <div
        className={cn(
          "relative z-10 container-apple-wide",
          "pt-16 sm:pt-20 md:pt-24 pb-16 sm:pb-20 md:pb-24",
          align === "center" ? "text-center" : "text-left"
        )}
      >
        {eyebrow && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "text-[13px] sm:text-[14px] font-semibold mb-3",
              dark ? "text-sky-dim" : "text-sky"
            )}
          >
            {eyebrow}
          </motion.p>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "font-semibold tracking-tighter3 leading-tighter text-balance",
            "text-[clamp(2.5rem,2rem+3vw,5rem)]",
            align === "center" ? "max-w-4xl mx-auto" : "max-w-4xl"
          )}
        >
          {title}
          {highlight && (
            <>
              {" "}
              <span
                className={cn(
                  "font-semibold",
                  dark ? "text-ink-300" : "text-ink-400"
                )}
              >
                {highlight}
              </span>
            </>
          )}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "mt-5 sm:mt-6 text-[17px] sm:text-[19px] md:text-[21px] font-normal leading-snug2 text-pretty",
              dark ? "text-white/80" : "text-ink-500",
              align === "center" ? "max-w-2xl mx-auto" : "max-w-2xl"
            )}
          >
            {subtitle}
          </motion.p>
        )}

        {(ctaPrimary || ctaSecondary) && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "mt-8 sm:mt-10 flex flex-wrap gap-3 sm:gap-4 items-center",
              align === "center" ? "justify-center" : "justify-start"
            )}
          >
            {ctaPrimary && (
              <Link
                href={ctaPrimary.href}
                className={cn(dark ? "btn-light btn-apple-lg" : "btn-primary-lg")}
              >
                {ctaPrimary.label}
              </Link>
            )}
            {ctaSecondary && (
              <Link
                href={ctaSecondary.href}
                className={cn(
                  "link-apple link-arrow text-[15px] sm:text-[16px]",
                  dark && "text-sky-dim hover:text-sky-dim"
                )}
              >
                {ctaSecondary.label}
              </Link>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
