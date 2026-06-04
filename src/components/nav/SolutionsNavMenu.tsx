"use client";

import { useState, useEffect, useRef, memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Code2,
  Globe,
  Smartphone,
  Cpu,
  ArrowRight,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SERVICE_TYPE_LABELS } from "@/lib/solution-labels";

export const solutionsMenuLinks = [
  {
    name: "Overview",
    href: "/phojaa95-solutions",
    description: "Portfolio & services",
    icon: Code2,
  },
  {
    name: "Request a project",
    href: "/phojaa95-solutions#request-project",
    description: "Tell us what to build",
    icon: Send,
  },
  {
    name: SERVICE_TYPE_LABELS["web-development"],
    href: "/phojaa95-solutions?serviceType=web-development",
    description: "Websites & web apps",
    icon: Globe,
  },
  {
    name: SERVICE_TYPE_LABELS["app-development"],
    href: "/phojaa95-solutions?serviceType=app-development",
    description: "iOS, Android & PWA",
    icon: Smartphone,
  },
  {
    name: SERVICE_TYPE_LABELS["software-development"],
    href: "/phojaa95-solutions?serviceType=software-development",
    description: "Custom tools & APIs",
    icon: Cpu,
  },
] as const;

function isSolutionsActive(pathname: string) {
  return pathname.startsWith("/phojaa95-solutions");
}

/** Desktop hover/click dropdown */
export const SolutionsNavDropdown = memo(function SolutionsNavDropdown() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = isSolutionsActive(pathname);

  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        className={cn(
          "relative inline-flex items-center justify-center gap-1 h-8 pl-3 pr-2 rounded-full text-[13px] font-medium transition-colors duration-fast no-tap outline-none focus-visible:ring-2 focus-visible:ring-sky/50 focus-visible:ring-offset-2",
          active ? "text-foreground" : "text-ink-500 hover:text-foreground"
        )}
      >
        {active && (
          <motion.span
            layoutId="nav-pill"
            className="absolute inset-0 bg-ink-100/70 dark:bg-ink-800/60 rounded-full"
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
          />
        )}
        <span className="relative z-10">Solutions</span>
        <ChevronDown
          className={cn(
            "relative z-10 w-3.5 h-3.5 transition-transform",
            open && "rotate-180"
          )}
          strokeWidth={2}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[min(100vw-2rem,280px)] p-2 rounded-2xl bg-card border border-ink-100/80 dark:border-ink-700/50 shadow-elevated z-[60]"
          >
            <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-eyebrow text-ink-400">
              Phojaa95 Solutions
            </p>
            <ul className="space-y-0.5">
              {solutionsMenuLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-fog dark:hover:bg-ink-800/50 transition-colors no-tap group"
                    >
                      <span className="w-8 h-8 rounded-lg bg-sky/10 text-sky flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" strokeWidth={1.5} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13px] font-semibold text-foreground group-hover:text-sky">
                          {link.name}
                        </span>
                        <span className="block text-[11px] text-ink-500">
                          {link.description}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

/** Mobile expandable section */
export function SolutionsMobileNavSection({
  onNavigate,
  startIndex,
}: {
  onNavigate: () => void;
  startIndex: number;
}) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(isSolutionsActive(pathname));
  const active = isSolutionsActive(pathname);

  return (
    <li>
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className={cn(
          "w-full group flex items-center justify-between py-3.5 transition-colors no-tap",
          active ? "text-foreground" : "text-ink-500 hover:text-foreground"
        )}
      >
        <span className="flex items-center gap-3">
          <span
            className={cn(
              "w-1.5 h-1.5 rounded-full transition-colors",
              active ? "bg-sky" : "bg-ink-300"
            )}
          />
          <span className="text-[17px] font-semibold tracking-tight">Solutions</span>
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-ink-400 transition-transform",
            expanded && "rotate-180"
          )}
        />
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden pl-6 pb-2 space-y-0.5"
          >
            {solutionsMenuLinks.map((link, i) => {
              const Icon = link.icon;

              return (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: startIndex * 0.04 + i * 0.03 }}
                >
                  <Link
                    href={link.href}
                    onClick={onNavigate}
                    className="flex items-center gap-2 py-2.5 text-[15px] text-ink-500 hover:text-foreground transition-colors"
                  >
                    <Icon className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                    {link.name}
                    <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-40" />
                  </Link>
                </motion.li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
}
