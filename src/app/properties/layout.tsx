import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Properties for Sale in Bhutan | Land, Houses & Commercial",
  description:
    "Browse verified properties for sale across Bhutan. Filter by district, type & budget. Land, houses & commercial properties in Thimphu, Paro, Punakha & all 20 dzongkhags. PHOJAA95 Real Estate.",
  keywords: [
    "properties for sale Bhutan",
    "buy property Bhutan",
    "land for sale Bhutan",
    "houses for sale Bhutan",
    "house for sale Thimphu",
    "land for sale Paro",
    "commercial property Bhutan",
    "Bhutan property listings",
    "affordable land Bhutan",
    "luxury homes Bhutan",
    "property in Punakha",
    "Wangdue property for sale",
    "buy land Thimphu",
    "rent property Bhutan",
    "PHOJAA95 properties",
  ],
  openGraph: {
    title: "Properties for Sale in Bhutan | PHOJAA95 Real Estate",
    description:
      "Browse verified land, houses & commercial properties across all 20 dzongkhags of Bhutan. Filter by location, type & budget.",
    type: "website",
    url: "https://phojaa95realestate.com/properties",
  },
  alternates: {
    canonical: "https://phojaa95realestate.com/properties",
  },
};

import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export default function PropertiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Properties", url: "/properties" },
        ]}
      />
      {children}
    </>
  );
}
