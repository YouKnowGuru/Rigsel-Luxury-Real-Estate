import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bhutan Real Estate Blog | Property News, Guides & Market Insights",
  description:
    "Expert insights on Bhutan's property market. Read guides on buying land, property prices in Thimphu & Paro, investment tips, and real estate news from PHOJAA95 Real Estate.",
  keywords: [
    "Bhutan real estate blog",
    "Bhutan property news",
    "property market Bhutan",
    "buy land guide Bhutan",
    "Thimphu property prices",
    "Paro property guide",
    "real estate tips Bhutan",
    "property investment guide Bhutan",
    "Bhutan housing market",
    "PHOJAA95 blog",
  ],
  openGraph: {
    title: "Bhutan Real Estate Blog | PHOJAA95 Real Estate",
    description:
      "Expert insights, guides, and news about Bhutan's property market from PHOJAA95 Real Estate.",
    type: "website",
    url: "https://phojaa95realestate.com/blog",
  },
  alternates: {
    canonical: "https://phojaa95realestate.com/blog",
  },
};

import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
        ]}
      />
      {children}
    </>
  );
}
