"use client";

import { useState, useEffect, useCallback, memo, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Search, MapPin, Home, ChevronDown, ArrowRight, Code2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSettings } from "@/context/SettingsContext";

/* ============================================================
   HERO — Apple.com-style luxury hero section
   Design Principles:
   • Massive typography with tight tracking
   • Full-bleed hero image with gradient overlay
   • Floating glassmorphic stat pills
   • Search panel with compound component architecture
   • Staggered entrance animations
   • All touch targets ≥ 44px
   ============================================================ */

const districts = [
  "All districts",
  "Bumthang",
  "Chhukha",
  "Dagana",
  "Gasa",
  "Haa",
  "Lhuentse",
  "Mongar",
  "Paro",
  "Pema Gatshel",
  "Punakha",
  "Samdrup Jongkhar",
  "Samtse",
  "Sarpang",
  "Thimphu",
  "Trashigang",
  "Trashi Yangtse",
  "Trongsa",
  "Tsirang",
  "Wangdue Phodrang",
  "Zhemgang",
];

interface IPropertyType {
  _id: string;
  name: string;
  slug: string;
}

const priceRanges = [
  { label: "Any price", min: 0, max: 0 },
  { label: "Under Nu. 5M", min: 0, max: 5000000 },
  { label: "Nu. 5M – 10M", min: 5000000, max: 10000000 },
  { label: "Nu. 10M – 20M", min: 10000000, max: 20000000 },
  { label: "Above Nu. 20M", min: 20000000, max: 0 },
];

/* ── Animation variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] },
  }),
};

/* ── Compound Components for Search Panel ── */

// Search Panel Root
interface SearchPanelProps {
  children: React.ReactNode;
}
const SearchPanel = memo(function SearchPanel({ children }: SearchPanelProps) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-apple-xl bg-fog/80 dark:bg-ink-900/40 backdrop-blur-xl p-6 sm:p-8 md:p-10 border border-ink-100/60 dark:border-ink-700/30 shadow-product"
    >
      {children}
    </motion.div>
  );
});

// Search Panel Header
interface SearchPanelHeaderProps {
  eyebrow: string;
  title: string;
  subtitle: string;
}
const SearchPanelHeader = memo(function SearchPanelHeader({
  eyebrow,
  title,
  subtitle,
}: SearchPanelHeaderProps) {
  return (
    <div className="mb-6 md:mb-0">
      <p className="text-[13px] font-semibold text-sky mb-2 tracking-wide">
        {eyebrow}
      </p>
      <h2 className="text-[clamp(1.5rem,1.25rem+1.5vw,2.5rem)] font-semibold tracking-tighter2 leading-tight2 text-foreground text-balance">
        {title}
      </h2>
      <p className="mt-3 text-[15px] text-ink-500 leading-snug2 max-w-md">
        {subtitle}
      </p>
    </div>
  );
});

// Dropdown Field
interface DropdownFieldProps {
  label: string;
  value: string;
  icon?: React.ElementType;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  fieldId: string;
}
const DropdownField = memo(function DropdownField({
  label,
  value,
  icon: Icon,
  isOpen,
  onToggle,
  children,
  fieldId,
}: DropdownFieldProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onToggle();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen, onToggle]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`dropdown-${fieldId}`}
        className="w-full flex items-center justify-between gap-3 bg-white dark:bg-card border border-ink-200/80 dark:border-ink-700/60 rounded-2xl px-4 py-3.5 text-left transition-all duration-fast hover:border-ink-400 hover:shadow-soft no-tap outline-none focus-visible:ring-2 focus-visible:ring-sky/40 focus-visible:ring-offset-2"
      >
        <span className="flex items-center gap-2.5 min-w-0">
          {Icon && (
            <Icon
              className="w-4 h-4 text-ink-400 shrink-0"
              strokeWidth={1.75}
            />
          )}
          <span className="min-w-0">
            <span className="block text-[11px] text-ink-400 leading-none mb-1">
              {label}
            </span>
            <span className="block text-[14px] text-foreground font-medium truncate">
              {value}
            </span>
          </span>
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-ink-400 transition-transform duration-200 shrink-0",
            isOpen && "rotate-180"
          )}
          strokeWidth={1.75}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={`dropdown-${fieldId}`}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute z-30 left-0 right-0 mt-2 max-h-72 overflow-y-auto bg-white dark:bg-card rounded-2xl border border-ink-100 dark:border-ink-700 shadow-elevated p-1.5 overscroll-contain"
            role="listbox"
            aria-label={`${label} options`}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

// Dropdown Option
interface DropdownOptionProps {
  label: string;
  isActive: boolean;
  onSelect: () => void;
}
const DropdownOption = memo(function DropdownOption({
  label,
  isActive,
  onSelect,
}: DropdownOptionProps) {
  return (
    <button
      onClick={onSelect}
      role="option"
      aria-selected={isActive}
      className={cn(
        "w-full text-left px-3 py-2.5 rounded-xl text-[14px] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-sky/40",
        isActive
          ? "bg-sky text-white"
          : "text-foreground hover:bg-fog dark:hover:bg-ink-800/40"
      )}
    >
      {label}
    </button>
  );
});

// Stat Pill
interface StatPillProps {
  label: string;
  color: string;
  delay: number;
}
const StatPill = memo(function StatPill({ label, color, delay }: StatPillProps) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.span
      initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-xl text-white text-[11px] sm:text-[12px] font-semibold border border-white/10 shadow-lg"
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", color)} />
      {label}
    </motion.span>
  );
});

/* ── Main Hero Component ── */
export function Hero() {
  const router = useRouter();
  const { settings } = useSettings();
  const shouldReduceMotion = useReducedMotion();

  const [district, setDistrict] = useState(districts[0]);
  const [type, setType] = useState("All types");
  const [propertyTypes, setPropertyTypes] = useState<string[]>(["All types"]);
  const [price, setPrice] = useState(priceRanges[0]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const heroImage =
    settings?.heroImages?.[0] ||
    settings?.heroImage ||
    "/image/about-hero.png";

  // Fetch property types with cleanup
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/property-types", { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPropertyTypes([
            "All types",
            ...data.data.map((t: IPropertyType) => t.name),
          ]);
        }
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  // Close dropdowns on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenDropdown(null);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams();
    if (district !== districts[0]) params.append("district", district);
    if (type !== "All types") {
      // API expects "propertyType" not "type"
      params.append("propertyType", type.toLowerCase());
    }
    if (price.min > 0) params.append("minPrice", String(price.min));
    if (price.max > 0) params.append("maxPrice", String(price.max));
    router.push(`/properties?${params.toString()}`);
  }, [district, type, price, router]);

  const toggleDropdown = useCallback((key: string) => {
    setOpenDropdown((prev) => (prev === key ? null : key));
  }, []);

  return (
    <section className="relative pt-12 sm:pt-14 md:pt-16 overflow-hidden">
      {/* Background gradient ambient glow */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-sky/5 rounded-full blur-[120px]" />
      </div>

      {/* ── TEXT BLOCK ── */}
      <div className="container-apple-wide text-center py-16 sm:py-20 md:py-28">
        <motion.p
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-[13px] sm:text-[14px] font-semibold text-sky tracking-wide uppercase"
        >
          PHOJAA95 Real Estate
        </motion.p>

        <motion.h1
          custom={0.08}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-4 font-semibold tracking-tighter3 leading-tighter text-balance text-foreground"
          style={{ fontSize: "clamp(2.75rem, 2rem + 4.5vw, 6.5rem)" }}
        >
          Find Your Dream Property in Bhutan
        </motion.h1>

        <motion.p
          custom={0.16}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-6 mx-auto max-w-xl text-[17px] sm:text-[19px] md:text-[21px] text-ink-500 leading-snug2 text-pretty"
        >
          Browse verified land, homes, and commercial properties — or build your next website, app, or software with Phojaa95 Solutions.
        </motion.p>

        <motion.div
          custom={0.24}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
        >
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 h-12 px-7 rounded-full bg-sky text-white text-[15px] font-medium hover:bg-sky-hover active:scale-[0.97] transition-all duration-fast no-tap outline-none focus-visible:ring-2 focus-visible:ring-sky/50 focus-visible:ring-offset-2"
          >
            Browse properties
            <ArrowRight className="w-4 h-4" strokeWidth={2} />
          </Link>
          <Link
            href="/phojaa95-solutions"
            className="inline-flex items-center gap-2 h-12 px-7 rounded-full bg-foreground text-background text-[15px] font-medium hover:opacity-90 active:scale-[0.97] transition-all duration-fast no-tap outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 focus-visible:ring-offset-2"
          >
            <Code2 className="w-4 h-4" strokeWidth={2} />
            Phojaa95 Solutions
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-1 h-12 px-7 rounded-full border border-ink-200 dark:border-ink-700 text-foreground text-[15px] font-medium hover:bg-ink-50/60 dark:hover:bg-ink-800/40 active:scale-[0.97] transition-all duration-fast no-tap outline-none focus-visible:ring-2 focus-visible:ring-sky/40"
          >
            Talk to a specialist
          </Link>
        </motion.div>
      </div>

      {/* ── HERO IMAGE ── */}
      <motion.div
        initial={shouldReduceMotion ? {} : { opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="relative aspect-[16/9] sm:aspect-[2.2/1] overflow-hidden rounded-apple-xl bg-fog shadow-product">
          <Image
            src={heroImage}
            alt="Luxury Bhutanese property with Himalayan mountain views"
            fill
            priority
            sizes="100vw"
            className="object-cover ken-burns"
          />

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />

          {/* Bottom-left content */}
          <div className="absolute left-5 sm:left-8 bottom-5 sm:bottom-8 text-white max-w-[75%]">
            <motion.p
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-[11px] sm:text-[12px] font-semibold uppercase tracking-eyebrow text-white/70"
            >
              Featured Property
            </motion.p>
            <motion.p
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="mt-1.5 text-[16px] sm:text-[22px] md:text-[28px] font-semibold tracking-tighter2 leading-tight2"
            >
              Where Himalayan craft meets modern living.
            </motion.p>
          </div>

          {/* Floating stat pills — top right */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex flex-col gap-2 items-end">
            <StatPill label="500+ Verified" color="bg-emerald" delay={0.8} />
            <StatPill label="Nationwide" color="bg-sky" delay={0.95} />
            <StatPill label="20+ Districts" color="bg-amber" delay={1.1} />
            <Link
              href="/phojaa95-solutions"
              className="no-tap"
              aria-label="Phojaa95 Solutions — web, app and software development"
            >
              <motion.span
                initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.25, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-xl text-white text-[11px] sm:text-[12px] font-semibold border border-white/10 shadow-lg hover:bg-white/25 transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-violet-300" />
                Web &amp; App Dev
              </motion.span>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* ── SEARCH PANEL ── */}
      <div className="container-apple-wide py-14 sm:py-20">
        <SearchPanel>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <SearchPanelHeader
              eyebrow="Find your match"
              title="Tell us what you're looking for."
              subtitle="Choose a district, property type, and budget. We'll surface only what fits your needs."
            />

            <div className="space-y-3">
              {/* District dropdown */}
              <DropdownField
                fieldId="loc"
                label="Where"
                value={district}
                icon={MapPin}
                isOpen={openDropdown === "loc"}
                onToggle={() => toggleDropdown("loc")}
              >
                {districts.map((d) => (
                  <DropdownOption
                    key={d}
                    label={d}
                    isActive={d === district}
                    onSelect={() => {
                      setDistrict(d);
                      setOpenDropdown(null);
                    }}
                  />
                ))}
              </DropdownField>

              {/* Type dropdown */}
              <DropdownField
                fieldId="type"
                label="What"
                value={type}
                icon={Home}
                isOpen={openDropdown === "type"}
                onToggle={() => toggleDropdown("type")}
              >
                {propertyTypes.map((t) => (
                  <DropdownOption
                    key={t}
                    label={t}
                    isActive={t === type}
                    onSelect={() => {
                      setType(t);
                      setOpenDropdown(null);
                    }}
                  />
                ))}
              </DropdownField>

              {/* Price dropdown */}
              <DropdownField
                fieldId="price"
                label="Budget"
                value={price.label}
                isOpen={openDropdown === "price"}
                onToggle={() => toggleDropdown("price")}
              >
                {priceRanges.map((p) => (
                  <DropdownOption
                    key={p.label}
                    label={p.label}
                    isActive={p.label === price.label}
                    onSelect={() => {
                      setPrice(p);
                      setOpenDropdown(null);
                    }}
                  />
                ))}
              </DropdownField>

              {/* Search button */}
              <button
                onClick={handleSearch}
                className="w-full inline-flex items-center justify-center gap-2 h-12 rounded-2xl bg-sky text-white text-[15px] font-medium hover:bg-sky-hover active:scale-[0.97] transition-all duration-fast no-tap outline-none focus-visible:ring-2 focus-visible:ring-sky/50 focus-visible:ring-offset-2 mt-2"
              >
                <Search className="w-4 h-4" strokeWidth={2} />
                Search properties
              </button>
            </div>
          </div>
        </SearchPanel>
      </div>
    </section>
  );
}
