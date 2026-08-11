import { Metadata } from "next";
import dynamic from "next/dynamic";
import { ClientOnlySections } from "@/components/ClientOnlySections";
import { FAQJsonLd } from "@/components/seo/JsonLd";
import { homeFaqs } from "@/data/faqs";

// ── Above-fold sections — static imports (needed for initial paint) ──────────
import { Hero } from "@/sections/Hero";
import { CategoryPills } from "@/sections/CategoryPills";
import { BrandMarquee } from "@/sections/BrandMarquee";
import { FeaturedProperties } from "@/sections/FeaturedProperties";
import { PropertyCategories } from "@/sections/PropertyCategories";

// ── Below-fold sections — code-split via dynamic import ───────────────────────
// These are only downloaded after the above-fold content is interactive,
// reducing the initial JS bundle and improving Time-to-Interactive.
// Note: components that need ssr:false live in <ClientOnlySections> because
// ssr:false is not allowed in Server Components.
const ArchitectureDesignShowcase = dynamic(() =>
  import("@/sections/ArchitectureDesignShowcase").then((m) => ({ default: m.ArchitectureDesignShowcase }))
);
const SolutionsShowcase = dynamic(() =>
  import("@/sections/SolutionsShowcase").then((m) => ({ default: m.SolutionsShowcase }))
);
const LandCalculator = dynamic(() =>
  import("@/sections/LandCalculator").then((m) => ({ default: m.LandCalculator }))
);
const WhyChooseUs = dynamic(() =>
  import("@/sections/WhyChooseUs").then((m) => ({ default: m.WhyChooseUs }))
);
const TeamSection = dynamic(() =>
  import("@/sections/TeamSection").then((m) => ({ default: m.TeamSection }))
);
const Testimonials = dynamic(() =>
  import("@/sections/Testimonials").then((m) => ({ default: m.Testimonials }))
);
const FAQSection = dynamic(() =>
  import("@/sections/FAQSection").then((m) => ({ default: m.FAQSection }))
);
const ContactCTA = dynamic(() =>
  import("@/sections/ContactCTA").then((m) => ({ default: m.ContactCTA }))
);


export const metadata: Metadata = {
  title: "Best Real Estate in Bhutan | Buy Property, Land & Homes — PHOJAA95",
  description:
    "Find the best real estate in Bhutan. PHOJAA95 offers verified land, houses & commercial properties for sale in Thimphu, Paro, Punakha & all 20 dzongkhags. Trusted by 500+ families.",
  keywords: [
    "best real estate in Bhutan",
    "real estate in Bhutan",
    "Bhutan real estate",
    "property for sale Bhutan",
    "buy land Bhutan",
    "houses for sale Bhutan",
    "Thimphu property",
    "Paro real estate",
    "Punakha property",
    "luxury homes Bhutan",
    "commercial property Bhutan",
    "PHOJAA95 Real Estate",
    "property dealer Bhutan",
    "affordable land Bhutan",
    "property investment Bhutan",
  ],
  openGraph: {
    title: "Best Real Estate in Bhutan | PHOJAA95 Real Estate",
    description:
      "Browse verified land, houses & commercial properties across Bhutan. Trusted by 500+ happy families. PHOJAA95 — Bhutan's best real estate agency.",
    type: "website",
    url: "https://phojaa95realestate.com",
  },
  alternates: {
    canonical: "https://phojaa95realestate.com",
  },
};

export default function Home() {
  return (
    <>
      <FAQJsonLd faqs={homeFaqs} />
      <Hero />
      <CategoryPills />
      <BrandMarquee />
      <FeaturedProperties />
      <PropertyCategories />
      <ArchitectureDesignShowcase />
      <SolutionsShowcase />
      <LandCalculator />
      <WhyChooseUs />
      <TeamSection />
      <Testimonials />
      <FAQSection />
      <ContactCTA />
      {/* InteractiveMapWrapper (Leaflet) + PhojaaA1Chat (AI chat) use ssr:false
          and must live inside a Client Component boundary. */}
      <ClientOnlySections />
    </>
  );
}
