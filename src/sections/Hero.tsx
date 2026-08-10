"use client";

import { useState, useEffect, useCallback, memo, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Search, MapPin, Home, ChevronDown, ArrowRight, Code2, ShieldCheck, Building2 } from "lucide-react";
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

/* ── Floating glassmorphic stat pills ── */
const heroStats = [
  { icon: Building2, value: "500+", label: "Verified Listings" },
  { icon: MapPin, value: "20+", label: "Districts Covered" },
  { icon: ShieldCheck, value: "100%", label: "Trusted Nationwide" },
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

/* ── Typewriter headline ──
    A set of real-estate headlines rotate through the typewriter on mount — each
    one types itself out, holds, deletes, then the next headline takes over.
    - An invisible full-text placeholder (the longest headline) reserves the exact
      layout so nothing shifts while characters appear (works with responsive wrapping too).
    - The `hlStart`→`hlEnd` substring of the active headline stays inside the
      animated gradient span as it types.
    - Honors prefers-reduced-motion (renders the first headline instantly, no cursor). */
/* Rotating real-estate headlines — each one cycles through the typewriter.
   `hlStart`/`hlEnd` mark the substring shown inside the animated gradient span. */
const HEADLINES = [
  { text: "Find Your Dream Property in Bhutan", hlStart: 10, hlEnd: 24 },
  { text: "Discover Luxury Homes in Bhutan", hlStart: 9, hlEnd: 21 },
  { text: "Own Prime Real Estate in Bhutan", hlStart: 4, hlEnd: 21 },
  { text: "Explore Stunning Land in Bhutan", hlStart: 8, hlEnd: 21 },
  { text: "Build Your Future Home in Bhutan", hlStart: 11, hlEnd: 22 },
  { text: "Secure Smart Investments in Bhutan", hlStart: 7, hlEnd: 24 },
];
// Reserve layout space using the longest headline so nothing shifts while typing.
const LONGEST_HEADLINE = HEADLINES.reduce(
  (max, h) => (h.text.length > max.length ? h.text : max),
  HEADLINES[0].text,
);

function useHeadlineTyper() {
  const reduce = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const [count, setCount] = useState(reduce ? HEADLINES[0].text.length : 0);

  useEffect(() => {
    if (reduce) return;
    let i = 0;
    let curIdx = 0;
    let phase: "typing" | "holdFull" | "deleting" | "holdEmpty" = "typing";
    let timer: ReturnType<typeof setTimeout> | undefined;
    let alive = true;

    const tick = () => {
      if (!alive) return;
      const curLen = HEADLINES[curIdx].text.length;
      if (phase === "typing") {
        i += 1;
        setCount(i);
        if (i >= curLen) {
          phase = "holdFull";
          timer = setTimeout(tick, 1800);
          return;
        }
        timer = setTimeout(tick, 70);
      } else if (phase === "holdFull") {
        phase = "deleting";
        timer = setTimeout(tick, 80);
      } else if (phase === "deleting") {
        i -= 1;
        setCount(i);
        if (i <= 0) {
          phase = "holdEmpty";
          timer = setTimeout(tick, 500);
          return;
        }
        timer = setTimeout(tick, 45);
      } else {
        // holdEmpty — advance to the next real-estate headline and retype it
        curIdx = (curIdx + 1) % HEADLINES.length;
        setIdx(curIdx);
        phase = "typing";
        timer = setTimeout(tick, 250);
      }
    };

    timer = setTimeout(tick, 600);
    return () => {
      alive = false;
      if (timer) clearTimeout(timer);
    };
  }, [reduce]);

  return { idx, count, reduce };
}

/* ── Search dropdown components ── */

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
        className="w-full flex items-center justify-between gap-3 bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl px-4 py-3.5 text-left transition-all duration-fast hover:bg-white/15 hover:border-white/25 no-tap outline-none focus-visible:ring-2 focus-visible:ring-sky/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
      >
        <span className="flex items-center gap-2.5 min-w-0">
          {Icon && (
            <Icon
              className="w-4 h-4 text-white/70 shrink-0"
              strokeWidth={1.75}
            />
          )}
          <span className="min-w-0">
            <span className="block text-[11px] text-white/60 leading-none mb-1">
              {label}
            </span>
            <span className="block text-[14px] text-white font-medium truncate">
              {value}
            </span>
          </span>
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-white/70 transition-transform duration-200 shrink-0",
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
            className="absolute z-50 left-0 right-0 mt-2 max-h-72 overflow-y-auto bg-ink-900/85 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-lifted p-1.5 overscroll-contain"
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
          : "text-white hover:bg-white/10"
      )}
    >
      {label}
    </button>
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
      .catch(() => { });
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

  // ── Typewriter headline ──
  const { idx: phraseIdx, count: typerCount, reduce: reduceMotion } = useHeadlineTyper();
  const phrase = HEADLINES[phraseIdx];
  const typedHeadline = phrase.text.slice(0, typerCount);
  const headBefore = typedHeadline.slice(0, Math.min(typerCount, phrase.hlStart));
  const headHL = typerCount > phrase.hlStart ? typedHeadline.slice(phrase.hlStart, Math.min(typerCount, phrase.hlEnd)) : "";
  const headAfter = typerCount > phrase.hlEnd ? typedHeadline.slice(phrase.hlEnd) : "";

  return (
    <section className="relative z-10 min-h-[100svh] flex flex-col bg-ink-900">
      {/* ── Full-bleed background image ── */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={heroImage}
          alt="Luxury Bhutanese property with Himalayan mountain views"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Cinematic gradient scrims for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/45 to-black/95" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
        {/* Vignette for cinematic focus */}
        <div className="absolute inset-0 [box-shadow:inset_0_0_220px_60px_rgba(0,0,0,0.55)]" />
      </div>

      {/* ── Centered content ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center text-white px-5 pt-28 sm:pt-32 pb-12">
        {/* Eyebrow badge */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-1.5 shadow-sky"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-sky" />
          </span>
          <span className="text-[11px] sm:text-[12px] font-semibold tracking-eyebrow text-white/90">
            PHOJAA95 REAL ESTATE
          </span>
        </motion.div>

        {/* Headline — typewriter */}
        <motion.h1
          custom={0.08}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="relative mt-6 font-serif font-medium tracking-tight leading-[1.05] text-white max-w-5xl mx-auto"
          style={{ fontSize: "clamp(2.5rem, 1.8rem + 4vw, 5.5rem)", textShadow: "0 10px 50px rgba(0,0,0,0.5)" }}
        >
          {/* invisible full-text placeholder — reserves space so nothing shifts while typing */}
          <span className="invisible block" aria-hidden="true">
            {LONGEST_HEADLINE}
          </span>
          {/* typed overlay */}
          <span className="absolute inset-0 flex items-center justify-center text-center flex-wrap px-2">
            <span>{headBefore}</span>
            {headHL && (
              <span className="bg-gradient-to-r from-sky via-bhutan-gold to-sky bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-text">
                {headHL}
              </span>
            )}
            {headAfter && <span>{headAfter}</span>}
            {!reduceMotion && (
              <span aria-hidden="true" className="inline-block align-middle w-[0.05em] h-[0.85em] ml-[0.08em] rounded-full bg-gradient-to-b from-bhutan-gold to-sky shadow-[0_0_14px_2px_rgba(197,165,114,0.65)] origin-center animate-caret-glow shrink-0" />
            )}
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          custom={0.16}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-6 mx-auto max-w-2xl text-[16px] sm:text-[18px] md:text-[20px] text-white/80 leading-snug2 text-pretty"
        >
          Browse verified land, homes, and commercial properties — or build your next website, app, or software with Phojaa95 Solutions.
        </motion.p>

        {/* Primary CTAs */}
        <motion.div
          custom={0.24}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-9 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
        >
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 h-12 px-7 rounded-full bg-white text-ink-900 text-[15px] font-medium hover:bg-white/90 hover:shadow-[0_10px_40px_-8px_rgba(255,255,255,0.55)] active:scale-[0.97] transition-all duration-fast no-tap outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40 shadow-[0_8px_30px_-10px_rgba(255,255,255,0.4)]"
          >
            Browse properties
            <ArrowRight className="w-4 h-4" strokeWidth={2} />
          </Link>
          <Link
            href="/phojaa95-solutions"
            className="inline-flex items-center gap-2 h-12 px-7 rounded-full bg-sky text-white text-[15px] font-medium hover:bg-sky-hover hover:shadow-[0_12px_44px_-8px_rgba(0,113,227,0.6)] active:scale-[0.97] transition-all duration-fast no-tap outline-none focus-visible:ring-2 focus-visible:ring-sky/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40 shadow-sky"
          >
            <Code2 className="w-4 h-4" strokeWidth={2} />
            Phojaa95 Solutions
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-1 h-12 px-7 rounded-full border border-white/30 text-white text-[15px] font-medium hover:bg-white/10 hover:border-white/50 active:scale-[0.97] transition-all duration-fast no-tap outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
          >
            Talk to a specialist
          </Link>
        </motion.div>

        {/* Floating glassmorphic stat pills */}
        <motion.div
          custom={0.32}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-10 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3"
        >
          {heroStats.map((s) => (
            <div
              key={s.label}
              className="inline-flex items-center gap-2.5 rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl px-4 py-2.5 shadow-soft"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-sky/40 to-bhutan-gold/40 text-white">
                <s.icon className="w-4 h-4" strokeWidth={2} />
              </span>
              <span className="text-left leading-none">
                <span className="block text-[15px] font-semibold text-white">{s.value}</span>
                <span className="block text-[11px] text-white/60 mt-1">{s.label}</span>
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── Floating glass search bar ── */}
      <motion.div
        initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mx-auto max-w-[1100px] w-full px-4 sm:px-6 pb-8 sm:pb-10"
      >
        <div className="bg-white/10 backdrop-blur-2xl rounded-[22px] border border-white/15 shadow-product p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3">
            <div className="sm:flex-1 min-w-0">
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
            </div>
            <div className="sm:flex-1 min-w-0">
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
            </div>
            <div className="sm:flex-1 min-w-0">
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
            </div>
            <button
              onClick={handleSearch}
              className="w-full sm:w-auto sm:self-stretch inline-flex items-center justify-center gap-2 px-7 rounded-2xl bg-sky text-white text-[15px] font-medium hover:bg-sky-hover active:scale-[0.97] transition-all duration-fast no-tap outline-none focus-visible:ring-2 focus-visible:ring-sky/50 focus-visible:ring-offset-2"
            >
              <Search className="w-4 h-4" strokeWidth={2} />
              Search properties
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
