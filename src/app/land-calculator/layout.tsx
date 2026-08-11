import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bhutan Land Area Calculator | Convert Decimal to Sq Ft & Acres",
  description:
    "Free online land area calculator for Bhutan. Convert between decimal, square feet, acres, perches & square meters. Essential tool for property buyers and sellers in Bhutan.",
  keywords: [
    "land area calculator Bhutan",
    "decimal to square feet Bhutan",
    "land measurement Bhutan",
    "property area calculator",
    "convert land area Bhutan",
    "Bhutan land size calculator",
    "acres to decimal converter",
    "property measurement tool",
  ],
  openGraph: {
    title: "Bhutan Land Area Calculator | PHOJAA95 Real Estate",
    description:
      "Free land area calculator. Convert between decimal, square feet, acres & more. Perfect for Bhutan property transactions.",
    type: "website",
    url: "https://phojaa95realestate.com/land-calculator",
  },
  alternates: {
    canonical: "https://phojaa95realestate.com/land-calculator",
  },
};

export default function LandCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
