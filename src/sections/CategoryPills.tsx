"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Home, Building2, TreePine, Store, Hotel, Calculator, Megaphone, Newspaper, Image as ImageIcon, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  { name: "Houses", href: "/properties?type=house", icon: Home },
  { name: "Apartments", href: "/properties?type=apartment", icon: Building2 },
  { name: "Land", href: "/properties?type=land", icon: TreePine },
  { name: "Commercial", href: "/properties?type=commercial", icon: Store },
  { name: "Hotels", href: "/properties?type=hotel", icon: Hotel },
  { name: "Solutions", href: "/phojaa95-solutions", icon: Code2 },
  { name: "Calculator", href: "/land-calculator", icon: Calculator },
  { name: "Gallery", href: "/gallery", icon: ImageIcon },
  { name: "Announcements", href: "/announcements", icon: Megaphone },
  { name: "Blog", href: "/blog", icon: Newspaper },
];

export function CategoryPills() {
  return (
    <section className="py-6 sm:py-8 bg-background border-b border-ink-100 dark:border-ink-700/40">
      <div className="container-apple-wide">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex gap-2 sm:gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.4,
                delay: i * 0.03,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="snap-start shrink-0"
            >
              <Link
                href={cat.href}
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2.5 rounded-full border text-[13px] font-medium transition-all duration-fast",
                  "bg-white dark:bg-card border-ink-200 dark:border-ink-700 text-foreground",
                  "hover:border-sky/40 hover:bg-sky/[0.04] hover:text-sky"
                )}
              >
                <cat.icon className="w-4 h-4" strokeWidth={1.75} />
                {cat.name}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
