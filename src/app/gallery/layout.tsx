import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Property Gallery | Luxury Homes & Architecture in Bhutan",
  description:
    "Browse stunning property photos from across Bhutan. Interior, exterior, landscape & architectural photography of luxury homes, land & commercial spaces. PHOJAA95 Real Estate gallery.",
  keywords: [
    "Bhutan property gallery",
    "luxury homes Bhutan photos",
    "Bhutan architecture",
    "property photos Bhutan",
    "real estate gallery Bhutan",
    "Bhutan interior design",
    "Himalayan homes",
    "PHOJAA95 gallery",
  ],
  openGraph: {
    title: "Property Gallery | PHOJAA95 Real Estate Bhutan",
    description:
      "A curated collection of property photography — luxury homes, architecture & landscapes across the Himalayan kingdom.",
    type: "website",
    url: "https://phojaa95realestate.com/gallery",
  },
  alternates: {
    canonical: "https://phojaa95realestate.com/gallery",
  },
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
