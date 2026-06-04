import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Architecture Design | 360° Tours | PHOJAA95 Real Estate",
  description:
    "Explore architectural projects in Bhutan with interactive 360° virtual tours.",
};

export default function ArchitectureDesignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
