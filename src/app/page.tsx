import { Hero } from "@/sections/Hero";
import { FeaturedProperties } from "@/sections/FeaturedProperties";
import { PropertyCategories } from "@/sections/PropertyCategories";
import { LandCalculator } from "@/sections/LandCalculator";
import { WhyChooseUs } from "@/sections/WhyChooseUs";
import { InteractiveMap } from "@/sections/InteractiveMap";
import { Testimonials } from "@/sections/Testimonials";
import { ContactCTA } from "@/sections/ContactCTA";
import { TeamSection } from "@/sections/TeamSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Phojaa Real Estate | Trusted Properties in Bhutan",
  description:
    "Discover land and properties across Bhutan. Phojaa Real Estate offers transparent and reliable services to connect buyers and sellers.",
  keywords: [
    "Bhutan real estate",
    "property Bhutan",
    "luxury homes Bhutan",
    "Thimphu property",
    "Paro real estate",
  ],
  openGraph: {
    title: "Phojaa Real Estate | Trusted Properties in Bhutan",
    description:
      "Discover land and properties across Bhutan. Connect with genuine buyers and sellers through Phojaa Real Estate.",
    type: "website",
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProperties />
      <PropertyCategories />
      <LandCalculator />
      <WhyChooseUs />
      <TeamSection />
      <InteractiveMap />
      <Testimonials />
      <ContactCTA />
    </>
  );
}
