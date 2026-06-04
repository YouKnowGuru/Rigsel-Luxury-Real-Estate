"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const editorials = [
  {
    id: "paro-valley",
    eyebrow: "Featured Destination",
    title: "Paro Valley.",
    subtitle: "Where tradition meets tranquility.",
    description:
      "Discover heritage homes nestled beneath iconic dzongs, with views that stretch across rice terraces to snow-capped peaks.",
    image:
      "https://images.unsplash.com/photo-1623585287339-2d05a23b4751?w=1600&auto=format&fit=crop",
    href: "/properties?district=Paro",
    badge: "Editor's Choice",
    size: "large",
  },
  {
    id: "thimphu-living",
    eyebrow: "Urban Living",
    title: "Thimphu Heights.",
    subtitle: "The capital's finest addresses.",
    description:
      "Modern apartments and family homes in Bhutan's bustling capital — walkable, connected, and designed for contemporary life.",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop",
    href: "/properties?district=Thimphu",
    badge: "Trending",
    size: "medium",
  },
  {
    id: "land-investment",
    eyebrow: "Investment",
    title: "Valley Plots.",
    subtitle: "Build your vision from the ground up.",
    description:
      "Prime land parcels across Punakha, Wangdue, and beyond — vetted titles, clear boundaries, and expert guidance.",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&auto=format&fit=crop",
    href: "/properties?type=land",
    badge: "New",
    size: "medium",
  },
];

export function EditorialToday() {
  return (
    <section className="section-y-sm bg-background">
      <div className="container-apple-wide">
        <motion.header
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 sm:mb-10"
        >
          <p className="text-[13px] sm:text-[14px] font-semibold text-sky mb-2">
            Today
          </p>
          <h2 className="font-semibold tracking-tighter3 leading-tighter text-balance text-[clamp(1.75rem,1.5rem+1.5vw,2.75rem)] text-foreground">
            Stories from the kingdom.
          </h2>
        </motion.header>

        {/* Bento grid — App Store Today style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {/* Large featured card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="md:row-span-2"
          >
            <EditorialCard {...editorials[0]} />
          </motion.div>

          {/* Two stacked medium cards */}
          {editorials.slice(1).map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.7,
                delay: (i + 1) * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <EditorialCard {...item} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EditorialCard({
  eyebrow,
  title,
  subtitle,
  description,
  image,
  href,
  badge,
  size,
}: (typeof editorials)[0]) {
  const isLarge = size === "large";

  return (
    <Link
      href={href}
      className="group relative block overflow-hidden rounded-apple-xl bg-ink-900 h-full min-h-[280px] sm:min-h-[320px] md:min-h-0"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={image}
          alt={title}
          fill
          sizes={isLarge ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 50vw"}
          className="object-cover transition-transform duration-1200 ease-apple-out group-hover:scale-[1.04]"
        />
        {/* Gradient overlay */}
        <div
          className={cn(
            "absolute inset-0",
            isLarge
              ? "bg-gradient-to-t from-black/80 via-black/30 to-black/10"
              : "bg-gradient-to-r from-black/75 via-black/40 to-transparent"
          )}
        />
      </div>

      {/* Content */}
      <div
        className={cn(
          "relative z-10 flex flex-col h-full p-6 sm:p-8",
          isLarge ? "justify-end" : "justify-center"
        )}
      >
        {/* Badge */}
        <span
          className={cn(
            "inline-flex items-center self-start px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide mb-4",
            badge === "Editor's Choice"
              ? "bg-white text-ink-900"
              : badge === "Trending"
              ? "bg-sky text-white"
              : "bg-emerald text-white"
          )}
        >
          {badge}
        </span>

        <p className="text-[11px] sm:text-[12px] font-semibold uppercase tracking-eyebrow text-white/70 mb-2">
          {eyebrow}
        </p>

        <h3
          className={cn(
            "font-semibold tracking-tighter3 leading-tighter text-white text-balance",
            isLarge
              ? "text-[clamp(1.75rem,1.5rem+2vw,3.25rem)]"
              : "text-[clamp(1.5rem,1.25rem+1.25vw,2.25rem)]"
          )}
        >
          {title}{" "}
          <span className="text-white/60">{subtitle}</span>
        </h3>

        <p
          className={cn(
            "text-white/70 leading-snug2 mt-2 max-w-md",
            isLarge ? "text-[15px] sm:text-[17px]" : "text-[14px] sm:text-[15px]"
          )}
        >
          {description}
        </p>

        <span className="inline-flex items-center gap-1 mt-4 sm:mt-5 text-sky-dim text-[14px] sm:text-[15px] font-medium transition-colors group-hover:text-white">
          Read more
          <ArrowUpRight
            className="w-4 h-4 transition-transform duration-fast group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            strokeWidth={2}
          />
        </span>
      </div>
    </Link>
  );
}

import { cn } from "@/lib/utils";
