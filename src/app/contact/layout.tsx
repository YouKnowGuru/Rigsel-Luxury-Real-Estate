import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact PHOJAA95 Real Estate | Paro, Bhutan | +975-16111999",
  description:
    "Contact PHOJAA95 Real Estate in Paro, Bhutan. Call +975-16111999 or email phojaa95realestate@gmail.com. Visit us at Below RRCO, Taju, Paro. Mon–Sat. WhatsApp available.",
  keywords: [
    "contact PHOJAA95 Real Estate",
    "Bhutan real estate contact",
    "property agent phone Bhutan",
    "real estate Paro Bhutan",
    "PHOJAA95 phone number",
    "Bhutan property inquiry",
    "real estate WhatsApp Bhutan",
  ],
  openGraph: {
    title: "Contact PHOJAA95 Real Estate | Paro, Bhutan",
    description:
      "Get in touch with Bhutan's trusted real estate agency. Call +975-16111999, email us, or visit our office in Paro.",
    type: "website",
    url: "https://phojaarealestate.com/contact",
  },
  alternates: {
    canonical: "https://phojaarealestate.com/contact",
  },
};

import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Contact", url: "/contact" },
        ]}
      />
      {children}
    </>
  );
}
