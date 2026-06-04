# 🔍 Rigsel Luxury Real Estate — Skills Audit Report

**Date:** 2026-05-28  
**Skills Applied:**
1. ✅ Vercel React Best Practices (70 rules)
2. ✅ Web Design Guidelines (Vercel)
3. ✅ React Composition Patterns

---

## 📊 Executive Summary

| Category | Issues Found | Severity |
|----------|-------------|----------|
| **CRITICAL** | 4 | Must fix immediately |
| **HIGH** | 3 | Fix before next release |
| **MEDIUM** | 5 | Fix in upcoming sprint |
| **LOW** | 2 | Nice to have |

**Total Issues:** 14  
**Files Affected:** 6

---

## 🔴 CRITICAL ISSUES

### 1. `async-parallel` — Sequential Data Fetching (Waterfall)
**File:** `src/app/properties/page.tsx` (lines 122-125)

```tsx
// ❌ BAD: Sequential execution
useEffect(() => {
  fetchProperties();      // waits
  fetchPropertyTypes();   // then waits
}, [fetchProperties, fetchPropertyTypes]);
```

**Impact:** 2x slower page load. Each fetch waits for the previous.

**Fix:**
```tsx
// ✅ GOOD: Parallel execution
useEffect(() => {
  Promise.all([fetchProperties(), fetchPropertyTypes()]);
}, [fetchProperties, fetchPropertyTypes]);
```

---

### 2. `bundle-barrel-imports` — No Barrel Import Optimization
**File:** `next.config.js` (missing)

You're importing from `lucide-react` (1,583 modules), `framer-motion`, and `@radix-ui/react-*` without optimization.

**Impact:** 200-800ms extra import cost, slower dev boot, slower builds.

**Fix:** Add to `next.config.js`:
```js
const nextConfig = {
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-select',
      '@radix-ui/react-tabs',
      '@radix-ui/react-toast',
    ]
  }
}
```

---

### 3. `async-parallel` — Sequential Fetches in FeaturedProperties
**File:** `src/sections/FeaturedProperties.tsx` (lines 15-36)

```tsx
// ❌ BAD: Sequential fallback fetch
let response = await fetch("/api/properties?featured=true&limit=6");
let data = await response.json();
if (data.success && data.data.length > 0) {
  setProperties(data.data);
} else {
  response = await fetch("/api/properties?limit=6&sortBy=createdAt"); // waterfall!
  data = await response.json();
}
```

**Impact:** If featured properties fail, user waits 2x longer.

**Fix:** Use `Promise.race` or parallel fetching with early return.

---

### 4. `server-parallel-fetching` — Page.tsx Not Using Server Components
**File:** `src/app/page.tsx`

Your homepage imports 11 sections as client components (or they become client via "use client"). This forces the entire page to hydrate on the client.

**Impact:** No SSR for initial HTML, slower TTFB, worse SEO for content below fold.

**Fix:** Convert static sections to Server Components:
```tsx
// page.tsx should be async Server Component
export default async function Home() {
  const [featured, categories] = await Promise.all([
    fetchFeaturedProperties(),
    fetchPropertyCategories(),
  ]);
  
  return (
    <>
      <Hero /> {/* keep client for interactivity */}
      <FeaturedPropertiesServer data={featured} />
      <PropertyCategoriesServer data={categories} />
      {/* ... */}
    </>
  );
}
```

---

## 🟠 HIGH ISSUES

### 5. `rerender-no-inline-components` — Inline Component in PropertyCard
**File:** `src/components/property/PropertyCard.tsx` (lines 89-99, 193-203)

```tsx
// ❌ BAD: Array.map creates new component refs each render
{[
  { icon: Bed, value: property.bedrooms, label: "Beds" },
  { icon: Bath, value: property.bathrooms, label: "Baths" },
  { icon: Maximize, value: property.area, label: "Sqft" },
].map(({ icon: Icon, value, label }) => (
  <div key={label}>
    <Icon className="..." /> {/* new component type each render */}
  </div>
))}
```

**Impact:** Icons remount on every render, losing animation state.

**Fix:** Extract to static component:
```tsx
const PropertyStats = memo(function PropertyStats({ 
  bedrooms, bathrooms, area 
}: StatsProps) {
  return (
    <>
      <StatItem icon={Bed} value={bedrooms} label="Beds" />
      <StatItem icon={Bath} value={bathrooms} label="Baths" />
      <StatItem icon={Maximize} value={area} label="Sqft" />
    </>
  );
});
```

---

### 6. `rerender-memo` — PropertyCard Not Memoized
**File:** `src/components/property/PropertyCard.tsx` (line 17)

```tsx
// ❌ BAD: Re-renders when parent re-renders
export function PropertyCard({ property, variant = "grid", className }: Props) {
```

**Impact:** Every card re-renders when filters change, even if props unchanged.

**Fix:**
```tsx
import { memo } from "react";

export const PropertyCard = memo(function PropertyCard({ 
  property, variant = "grid", className 
}: Props) {
  // ... existing code
});
```

---

### 7. `server-cache-react` — No Request Deduplication
**File:** Multiple API route handlers

Database queries in API routes aren't cached with `React.cache()` or LRU cache.

**Impact:** Duplicate database queries within same request.

**Fix:**
```tsx
import { cache } from "react";

export const getProperties = cache(async (filters: Filters) => {
  return await db.properties.findMany({ ... });
});
```

---

## 🟡 MEDIUM ISSUES

### 8. `bundle-dynamic-imports` — Heavy Components Not Lazy Loaded
**File:** `src/app/page.tsx`

InteractiveMap, Testimonials, TeamSection, ContactCTA load eagerly but are below the fold.

**Fix:**
```tsx
import dynamic from "next/dynamic";

const InteractiveMap = dynamic(() => import("@/sections/InteractiveMap"), {
  ssr: false,
  loading: () => <div className="h-[400px] bg-fog animate-pulse" />
});
```

---

### 9. `architecture-avoid-boolean-props` — PropertyCard Variant Prop
**File:** `src/components/property/PropertyCard.tsx` (line 13)

```tsx
// ❌ BAD: Boolean-like variant prop
interface PropertyCardProps {
  property: Property;
  variant?: "grid" | "list"; // will grow over time
  className?: string;
}
```

**Fix:** Use composition patterns (see Composition Skill):
```tsx
// GridCard.tsx and ListCard.tsx as separate explicit components
// Or use compound component pattern
```

---

### 10. `client-swr-dedup` — No SWR/TanStack Query for Data Fetching
**File:** `src/sections/FeaturedProperties.tsx`, `src/app/properties/page.tsx`

Raw `fetch()` in `useEffect` with no caching, deduplication, or stale-while-revalidate.

**Fix:** Use SWR or TanStack Query:
```tsx
import useSWR from "swr";

const { data: properties, isLoading } = useSWR(
  "/api/properties?featured=true",
  fetcher,
  { dedupingInterval: 60000 }
);
```

---

### 11. `rerender-dependencies` — Missing useMemo for Derived Data
**File:** `src/app/properties/page.tsx` (lines 127-134)

```tsx
// ❌ BAD: Filter runs on every render
const filtered = properties.filter((p) => { ... });
```

**Fix:**
```tsx
const filtered = useMemo(() => 
  properties.filter((p) => { ... }),
  [properties, searchTerm]
);
```

---

### 12. `rendering-resource-hints` — Missing Preload for Hero Image
**File:** `src/app/layout.tsx`

No resource hints for critical above-fold assets.

**Fix:** Add to `<head>`:
```tsx
<link rel="preload" as="image" href="/image/about-hero.png" />
```

---

## 🟢 LOW ISSUES

### 13. `js-early-exit` — Could Use Early Returns
**File:** `src/components/property/PropertyCard.tsx`

The `variant === "list"` check could be extracted to separate components for cleaner code.

---

### 14. `rendering-content-visibility` — Missing content-visibility
**File:** `src/sections/` (multiple)

Below-fold sections don't use `content-visibility: auto` for rendering optimization.

**Fix:**
```css
.section-below-fold {
  content-visibility: auto;
  contain-intrinsic-size: 0 500px;
}
```

---

## 🎨 Web Design Guidelines Audit

### Accessibility Issues
| Issue | File | Line | Fix |
|-------|------|------|-----|
| Missing `aria-expanded` on dropdown | Hero.tsx | 237 | Add aria-expanded |
| Missing `aria-controls` on dropdown | Hero.tsx | 237 | Add aria-controls |
| Heart button missing `aria-pressed` | PropertyCard.tsx | 55 | Add aria-pressed |

### Visual Hierarchy
| Issue | File | Recommendation |
|-------|------|----------------|
| Too many font sizes | Hero.tsx | Consolidate to 6-8 sizes |
| Inconsistent spacing | Multiple | Use 4px/8px grid system |

### Mobile
| Issue | File | Fix |
|-------|------|-----|
| Touch targets < 44px | PropertyCard.tsx | Increase to min 44x44 |
| Horizontal scroll snap missing `scroll-padding` | FeaturedProperties.tsx | Add scroll-padding |

---

## 🧩 Composition Patterns Recommendations

### 1. PropertyCard → Compound Component

**Current:**
```tsx
<PropertyCard property={p} variant="grid" />
<PropertyCard property={p} variant="list" />
```

**Recommended:**
```tsx
// Explicit, self-documenting
<GridCard property={p} />
<ListCard property={p} />
```

### 2. Hero Search → Compound Component

**Current:** Monolithic Hero with embedded search logic.

**Recommended:**
```tsx
<SearchPanel>
  <SearchPanel.Field label="Where" icon={MapPin}>
    <DistrictSelect />
  </SearchPanel.Field>
  <SearchPanel.Field label="What" icon={Home}>
    <TypeSelect />
  </SearchPanel.Field>
  <SearchPanel.Submit>Search</SearchPanel.Submit>
</SearchPanel>
```

### 3. SectionHeader Pattern

**Current:** Props-based with many optional fields.

**Recommended:** Already good! Keep the explicit props pattern.

---

## ✅ Action Plan

### Sprint 1 (This Week)
- [ ] Fix `async-parallel` in `properties/page.tsx`
- [ ] Add `optimizePackageImports` to `next.config.js`
- [ ] Memoize `PropertyCard`

### Sprint 2 (Next Week)
- [ ] Convert `page.tsx` to Server Component
- [ ] Add dynamic imports for below-fold sections
- [ ] Add SWR for data fetching

### Sprint 3 (Future)
- [ ] Split `PropertyCard` into explicit variants
- [ ] Add React.cache() for DB queries
- [ ] Fix accessibility issues

---

## 📈 Expected Performance Gains

| Optimization | Expected Improvement |
|-------------|---------------------|
| Parallel fetching | 30-50% faster page load |
| Barrel import optimization | 200-800ms faster dev |
| Server Components | 40% smaller JS bundle |
| Dynamic imports | 20-40% faster initial load |
| Memoization | Smoother filter interactions |
| SWR caching | Instant revisits, less server load |

---

*Report generated by Kimi Code CLI using Vercel React Best Practices, Web Design Guidelines, and React Composition Patterns skills.*
