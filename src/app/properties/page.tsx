"use client";

import { useEffect, useState, useCallback, useMemo, memo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Filter,
  Search,
  ChevronDown,
  Grid3X3,
  List as ListIcon,
  RotateCcw,
  SlidersHorizontal,
  ArrowRight,
  MapPin,
  Home,
  Bed,
} from "lucide-react";
import { PropertyCard as SharedPropertyCard } from "@/components/property/PropertyCard";
import { PropertyCardSkeleton } from "@/components/property/PropertyCardSkeleton";
import { Property, PropertyFilters } from "@/types";
import { cn } from "@/lib/utils";

/* ============================================================
   PROPERTIES PAGE — Apple Store-style property browsing
   Design Principles:
   • Clean header with massive typography
   • Floating glass filter bar
   • Pill-shaped filter chips
   • Smooth grid/list transitions
   • Empty state with clear CTA
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
  areaLabel: string;
}

const priceRanges = [
  { label: "Any price", min: 0, max: 0 },
  { label: "Under Nu. 5M", min: 0, max: 5000000 },
  { label: "Nu. 5M – 10M", min: 5000000, max: 10000000 },
  { label: "Nu. 10M – 20M", min: 10000000, max: 20000000 },
  { label: "Nu. 20M – 50M", min: 20000000, max: 50000000 },
  { label: "Above Nu. 50M", min: 50000000, max: 0 },
];

const bedroomOptions = [
  { value: 0, label: "Any" },
  { value: 1, label: "1+" },
  { value: 2, label: "2+" },
  { value: 3, label: "3+" },
  { value: 4, label: "4+" },
  { value: 5, label: "5+" },
];

/* ── Animation variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] },
  }),
};

/* ── Filter Select Component ── */
interface FilterSelectProps {
  label: string;
  icon: React.ElementType;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
}
const FilterSelect = memo(function FilterSelect({
  label,
  icon: Icon,
  value,
  options,
  onChange,
}: FilterSelectProps) {
  return (
    <div className="relative">
      <label className="text-[11px] text-ink-500 uppercase tracking-eyebrow mb-1.5 block">
        {label}
      </label>
      <div className="relative">
        <Icon
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400 pointer-events-none"
          strokeWidth={1.75}
        />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-10 pl-9 pr-8 rounded-xl bg-fog dark:bg-ink-800/40 border border-transparent text-[14px] text-foreground outline-none appearance-none cursor-pointer transition-all hover:border-ink-200 dark:hover:border-ink-700 focus:border-sky focus:ring-[3px] focus:ring-sky/10"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400"
          strokeWidth={1.75}
        />
      </div>
    </div>
  );
});

/* ── Bedroom Filter Pills ── */
interface BedroomFilterProps {
  value: number;
  onChange: (value: number) => void;
}
const BedroomFilter = memo(function BedroomFilter({
  value,
  onChange,
}: BedroomFilterProps) {
  return (
    <div>
      <label className="text-[11px] text-ink-500 uppercase tracking-eyebrow mb-1.5 block">
        Bedrooms
      </label>
      <div className="flex flex-wrap gap-1.5">
        {bedroomOptions.map((b) => (
          <button
            key={b.value}
            onClick={() => onChange(b.value)}
            className={cn(
              "h-9 px-3.5 rounded-full text-[13px] font-medium transition-all no-tap outline-none focus-visible:ring-2 focus-visible:ring-sky/40",
              value === b.value
                ? "bg-foreground text-background"
                : "bg-fog dark:bg-ink-800/40 text-foreground hover:bg-ink-100 dark:hover:bg-ink-700/40"
            )}
          >
            {b.label}
          </button>
        ))}
      </div>
    </div>
  );
});

/* ── Active Filter Chip ── */
const FilterChip = memo(function FilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 h-7 pl-3 pr-1.5 rounded-full bg-sky/10 text-sky text-[12px] font-medium">
      {label}
      <button
        onClick={onRemove}
        className="w-4 h-4 rounded-full hover:bg-sky/20 flex items-center justify-center transition-colors"
        aria-label={`Remove ${label} filter`}
      >
        <span className="text-[10px]">×</span>
      </button>
    </span>
  );
});

/* ── Empty State ── */
const EmptyState = memo(function EmptyState({
  onReset,
}: {
  onReset: () => void;
}) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center py-20 max-w-md mx-auto"
    >
      <div className="w-16 h-16 rounded-full bg-fog flex items-center justify-center mx-auto mb-5">
        <Search className="w-7 h-7 text-ink-400" strokeWidth={1.5} />
      </div>
      <h3 className="font-semibold text-[22px] tracking-tighter2 text-foreground">
        No properties found.
      </h3>
      <p className="mt-2 text-[15px] text-ink-500">
        Try adjusting your filters or search for something else.
      </p>
      <button
        onClick={onReset}
        className="mt-6 inline-flex items-center gap-2 h-11 px-6 rounded-full bg-fog dark:bg-ink-800/40 text-foreground text-[14px] font-medium hover:bg-ink-100 dark:hover:bg-ink-700/40 active:scale-[0.97] transition-all no-tap outline-none focus-visible:ring-2 focus-visible:ring-sky/40"
      >
        <RotateCcw className="w-4 h-4" strokeWidth={1.75} />
        Clear all filters
      </button>
    </motion.div>
  );
});

/* ── Main Properties Content ── */
function PropertiesContent() {
  const searchParams = useSearchParams();
  const shouldReduceMotion = useReducedMotion();

  const [properties, setProperties] = useState<Property[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<IPropertyType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<PropertyFilters>({
    location: searchParams.get("location") || "",
    district: searchParams.get("district") || "",
    propertyType: searchParams.get("type") || "",
    minPrice: Number(searchParams.get("minPrice")) || 0,
    maxPrice: Number(searchParams.get("maxPrice")) || 0,
    bedrooms: Number(searchParams.get("bedrooms")) || 0,
    bathrooms: Number(searchParams.get("bathrooms")) || 0,
  });

  const fetchProperties = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.district && filters.district !== "All districts") {
        params.append("district", filters.district);
      }
      if (filters.propertyType)
        params.append("propertyType", filters.propertyType);
      if (filters.minPrice)
        params.append("minPrice", filters.minPrice.toString());
      if (filters.maxPrice)
        params.append("maxPrice", filters.maxPrice.toString());
      if (filters.bedrooms)
        params.append("bedrooms", filters.bedrooms.toString());

      const response = await fetch(`/api/properties?${params.toString()}`);
      const data = await response.json();
      if (data.success) setProperties(data.data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const fetchPropertyTypes = useCallback(async () => {
    try {
      const response = await fetch("/api/property-types");
      const data = await response.json();
      if (data.success) setPropertyTypes(data.data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    Promise.all([fetchProperties(), fetchPropertyTypes()]);
  }, [fetchProperties, fetchPropertyTypes]);

  const filtered = useMemo(() => {
    if (!searchTerm) return properties;
    const t = searchTerm.toLowerCase();
    return properties.filter(
      (p) =>
        p.title.toLowerCase().includes(t) ||
        p.location?.toLowerCase().includes(t)
    );
  }, [properties, searchTerm]);

  const resetFilters = useCallback(() => {
    setFilters({
      location: "",
      district: "",
      propertyType: "",
      minPrice: 0,
      maxPrice: 0,
      bedrooms: 0,
      bathrooms: 0,
    });
    setSearchTerm("");
  }, []);

  const activeFilterCount = [
    filters.district && filters.district !== "All districts",
    filters.propertyType,
    filters.minPrice || filters.maxPrice,
    filters.bedrooms,
  ].filter(Boolean).length;

  // Build active filter chips
  const activeChips = [];
  if (filters.district && filters.district !== "All districts") {
    activeChips.push({
      label: filters.district,
      remove: () => setFilters((f) => ({ ...f, district: "" })),
    });
  }
  if (filters.propertyType) {
    const typeName = propertyTypes.find((t) => t.slug === filters.propertyType)?.name || filters.propertyType;
    activeChips.push({
      label: typeName,
      remove: () => setFilters((f) => ({ ...f, propertyType: "" })),
    });
  }
  if (filters.minPrice || filters.maxPrice) {
    const range = priceRanges.find(
      (r) => r.min === filters.minPrice && r.max === filters.maxPrice
    );
    if (range) {
      activeChips.push({
        label: range.label,
        remove: () => setFilters((f) => ({ ...f, minPrice: 0, maxPrice: 0 })),
      });
    }
  }
  if (filters.bedrooms) {
    activeChips.push({
      label: `${filters.bedrooms}+ beds`,
      remove: () => setFilters((f) => ({ ...f, bedrooms: 0 })),
    });
  }

  return (
    <main className="bg-background">
      {/* ── HEADER ── */}
      <section className="bg-fog pt-28 sm:pt-32 pb-12 sm:pb-16">
        <div className="container-apple-wide text-center">
          <motion.p
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-[13px] font-semibold text-sky tracking-wide uppercase"
          >
            Browse
          </motion.p>
          <motion.h1
            custom={0.06}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-3 font-semibold tracking-tighter3 leading-tighter text-balance text-foreground"
            style={{ fontSize: "clamp(2.5rem, 2rem + 3.5vw, 5rem)" }}
          >
            Find your{" "}
            <span className="text-ink-400">perfect property.</span>
          </motion.h1>
          <motion.p
            custom={0.12}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-4 text-[16px] sm:text-[18px] text-ink-500 max-w-xl mx-auto"
          >
            Browse verified listings. Filter by location, type, and budget.
          </motion.p>
        </div>
      </section>

      {/* ── FILTER BAR ── */}
      <div className="sticky top-11 sm:top-12 z-30 bg-background/80 backdrop-blur-xl border-b border-ink-100 dark:border-ink-700/40">
        <div className="container-apple-wide py-3">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400"
                strokeWidth={1.75}
              />
              <input
                type="search"
                name="property-search"
                autoComplete="off"
                placeholder="Search by title or location…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 bg-fog dark:bg-ink-800/40 border border-transparent rounded-full pl-10 pr-4 text-[14px] text-foreground placeholder:text-ink-400 outline-none transition-all focus:border-sky/30 focus:ring-[3px] focus:ring-sky/10"
              />
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters((s) => !s)}
              aria-expanded={showFilters}
              className={cn(
                "shrink-0 inline-flex items-center gap-1.5 h-10 px-4 rounded-full text-[13px] font-medium transition-all no-tap outline-none focus-visible:ring-2 focus-visible:ring-sky/40",
                activeFilterCount > 0 || showFilters
                  ? "bg-foreground text-background"
                  : "bg-fog dark:bg-ink-800/40 text-foreground hover:bg-ink-100 dark:hover:bg-ink-700/40"
              )}
            >
              <SlidersHorizontal className="w-4 h-4" strokeWidth={1.75} />
              <span className="hidden sm:inline">Filters</span>
              {activeFilterCount > 0 && (
                <span className="ml-0.5 text-[11px] bg-background text-foreground rounded-full px-1.5 py-0.5 tabular-nums">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* View toggle */}
            <div className="hidden sm:flex bg-fog dark:bg-ink-800/40 rounded-full p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-1.5 rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-sky/40",
                  viewMode === "grid"
                    ? "bg-background text-foreground shadow-soft"
                    : "text-ink-500 hover:text-foreground"
                )}
                aria-label="Grid view"
                aria-pressed={viewMode === "grid"}
              >
                <Grid3X3 className="w-4 h-4" strokeWidth={1.75} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-1.5 rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-sky/40",
                  viewMode === "list"
                    ? "bg-background text-foreground shadow-soft"
                    : "text-ink-500 hover:text-foreground"
                )}
                aria-label="List view"
                aria-pressed={viewMode === "list"}
              >
                <ListIcon className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>
          </div>

          {/* Active filter chips */}
          {activeChips.length > 0 && (
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {activeChips.map((chip, i) => (
                <FilterChip
                  key={i}
                  label={chip.label}
                  onRemove={chip.remove}
                />
              ))}
              <button
                onClick={resetFilters}
                className="text-[12px] text-ink-500 hover:text-foreground transition-colors"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Expandable filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 pb-2">
                  <FilterSelect
                    label="District"
                    icon={MapPin}
                    value={filters.district || "All districts"}
                    options={districts.map((d) => ({ label: d, value: d }))}
                    onChange={(v) =>
                      setFilters((f) => ({ ...f, district: v === "All districts" ? "" : v }))
                    }
                  />
                  <FilterSelect
                    label="Type"
                    icon={Home}
                    value={filters.propertyType || ""}
                    options={[
                      { label: "Any type", value: "" },
                      ...propertyTypes.map((t) => ({
                        label: t.name,
                        value: t.slug,
                      })),
                    ]}
                    onChange={(v) =>
                      setFilters((f) => ({ ...f, propertyType: v }))
                    }
                  />
                  <FilterSelect
                    label="Budget"
                    icon={Filter}
                    value={`${filters.minPrice}-${filters.maxPrice}`}
                    options={priceRanges.map((r) => ({
                      label: r.label,
                      value: `${r.min}-${r.max}`,
                    }))}
                    onChange={(v) => {
                      const range = priceRanges.find(
                        (p) => `${p.min}-${p.max}` === v
                      );
                      if (range)
                        setFilters((f) => ({
                          ...f,
                          minPrice: range.min,
                          maxPrice: range.max,
                        }));
                    }}
                  />
                  <BedroomFilter
                    value={filters.bedrooms || 0}
                    onChange={(v) =>
                      setFilters((f) => ({ ...f, bedrooms: v }))
                    }
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── LISTINGS ── */}
      <section className="section-y-sm">
        <div className="container-apple-wide">
          {/* Results count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-[13px] text-ink-500">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-ink-300 border-t-foreground rounded-full animate-spin" />
                  Loading properties…
                </span>
              ) : (
                <>
                  <span className="font-medium text-foreground tabular-nums">
                    {filtered.length}
                  </span>{" "}
                  {filtered.length === 1 ? "property" : "properties"} found
                </>
              )}
            </p>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <PropertyCardSkeleton key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState onReset={resetFilters} />
          ) : (
            <motion.div
              layout
              className={cn(
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
                  : "space-y-5"
              )}
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((property, i) => (
                  <motion.div
                    key={property._id}
                    layout
                    initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      duration: 0.4,
                      delay: Math.min(i * 0.04, 0.3),
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <SharedPropertyCard
                      property={property}
                      variant={viewMode}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={null}>
      <PropertiesContent />
    </Suspense>
  );
}
