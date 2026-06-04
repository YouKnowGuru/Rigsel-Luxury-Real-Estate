import { Metadata } from "next";
import { Hero } from "@/sections/Hero";
import { CategoryPills } from "@/sections/CategoryPills";
import { BrandMarquee } from "@/sections/BrandMarquee";
import { FeaturedProperties } from "@/sections/FeaturedProperties";
import { PropertyCategories } from "@/sections/PropertyCategories";
import { LandCalculator } from "@/sections/LandCalculator";
import { WhyChooseUs } from "@/sections/WhyChooseUs";
import { TeamSection } from "@/sections/TeamSection";
import { Testimonials } from "@/sections/Testimonials";
import { ContactCTA } from "@/sections/ContactCTA";
import { InteractiveMapWrapper } from "@/components/InteractiveMapWrapper";
import { ArchitectureDesignShowcase } from "@/sections/ArchitectureDesignShowcase";
import { SolutionsShowcase } from "@/sections/SolutionsShowcase";
import { PhojaaA1Chat } from "@/components/PhojaaA1Chat";

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
      <InteractiveMapWrapper />
      <Testimonials />
      <ContactCTA />
      <PhojaaA1Chat />
    </>
  );
}
