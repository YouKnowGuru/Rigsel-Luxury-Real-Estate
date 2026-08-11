import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About PHOJAA95 Real Estate | Trusted Property Agency in Bhutan",
  description:
    "Learn about PHOJAA95 Real Estate — Bhutan's most trusted property agency since 2015. 500+ happy families, 20+ districts covered. Transparent, honest, and reliable real estate services across Bhutan.",
  keywords: [
    "about PHOJAA95 Real Estate",
    "Bhutan real estate agency",
    "trusted property dealer Bhutan",
    "real estate company Bhutan",
    "property agent Paro",
    "Bhutan property services",
    "real estate broker Bhutan",
  ],
  openGraph: {
    title: "About PHOJAA95 Real Estate | Trusted Property Agency in Bhutan",
    description:
      "Bhutan's most trusted property agency since 2015. 500+ families served across 20+ districts with care, honesty, and professionalism.",
    type: "website",
    url: "https://phojaa95realestate.com/about",
  },
  alternates: {
    canonical: "https://phojaa95realestate.com/about",
  },
};

import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "About Us", url: "/about" },
        ]}
      />
      {children}
    </>
  );
}
