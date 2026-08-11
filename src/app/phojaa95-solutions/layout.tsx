import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Phojaa95 Solutions | Web Development & Software Services in Bhutan",
  description:
    "Custom website design, web app development & software solutions by Phojaa95 Solutions in Bhutan. Build your business online with Bhutan's trusted tech team.",
  keywords: [
    "web development Bhutan",
    "software company Bhutan",
    "website design Bhutan",
    "app development Bhutan",
    "Phojaa95 Solutions",
    "IT services Bhutan",
    "custom software Bhutan",
    "Bhutan tech company",
  ],
  openGraph: {
    title: "Phojaa95 Solutions | Web Development & Software in Bhutan",
    description:
      "Custom website design, app development & software solutions. Bhutan's trusted tech team.",
    type: "website",
    url: "https://phojaarealestate.com/phojaa95-solutions",
  },
  alternates: {
    canonical: "https://phojaarealestate.com/phojaa95-solutions",
  },
};

export default function SolutionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
