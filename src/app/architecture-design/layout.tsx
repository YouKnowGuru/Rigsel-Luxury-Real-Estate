import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Architecture & Design | 360° Virtual Tours in Bhutan",
  description:
    "Explore stunning architectural projects in Bhutan with interactive 360° virtual tours. Modern Bhutanese architecture, interior design & luxury construction by PHOJAA95 Real Estate.",
  keywords: [
    "architecture Bhutan",
    "360 virtual tour Bhutan",
    "Bhutan house design",
    "modern Bhutanese architecture",
    "interior design Bhutan",
    "luxury construction Bhutan",
    "architectural design Bhutan",
    "PHOJAA95 architecture",
  ],
  openGraph: {
    title: "Architecture & Design | 360° Virtual Tours | PHOJAA95",
    description:
      "Explore stunning architectural projects in Bhutan with interactive 360° virtual tours.",
    type: "website",
    url: "https://phojaarealestate.com/architecture-design",
  },
  alternates: {
    canonical: "https://phojaarealestate.com/architecture-design",
  },
};

export default function ArchitectureDesignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
