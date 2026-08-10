import { Metadata } from "next";
import dynamic from "next/dynamic";
import { ClientOnlySections } from "@/components/ClientOnlySections";

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
const ContactCTA = dynamic(() =>
  import("@/sections/ContactCTA").then((m) => ({ default: m.ContactCTA }))
);


export const metadata: Metadata = {
  title: "PHOJAA95 Real Estate | Trusted Properties in Bhutan",
  description:
    "Discover land and properties across Bhutan. PHOJAA95 Real Estate offers transparent and reliable services to connect buyers and sellers.",
  keywords: [
    "Bhutan real estate",
    "property Bhutan",
    "luxury homes Bhutan",
    "Thimphu property",
    "Paro real estate",
  ],
  openGraph: {
    title: "PHOJAA95 Real Estate | Trusted Properties in Bhutan",
    description:
      "Discover land and properties across Bhutan. Connect with genuine buyers and sellers through PHOJAA95 Real Estate.",
    type: "website",
  },
};

export default function Home() {
  return (
    <>
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
      <ContactCTA />
      {/* InteractiveMapWrapper (Leaflet) + PhojaaA1Chat (AI chat) use ssr:false
          and must live inside a Client Component boundary. */}
      <ClientOnlySections />
    </>
  );
}
