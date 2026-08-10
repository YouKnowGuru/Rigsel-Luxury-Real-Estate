import "server-only";
import { cache } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import PropertyModel from "@/models/Property";
import { Property } from "@/types";
import { PropertyDetailClient } from "./PropertyDetailClient";

/**
 * React's cache() deduplicates this across generateMetadata + the page render
 * so only ONE DB query runs per request, not two.
 */
const getPropertyData = cache(async (id: string): Promise<Property | null> => {
  if (!id || id === "undefined") return null;
  await connectDB();

  let prop: any = null;
  if (mongoose.isValidObjectId(id)) {
    prop = await PropertyModel.findById(id).lean();
  }
  if (!prop) {
    prop = await PropertyModel.findOne({ slug: id }).lean();
  }
  if (!prop) {
    prop = await PropertyModel.findOne({
      title: new RegExp(`^${id}$`, "i"),
    }).lean();
  }

  // Serialize MongoDB doc (ObjectIds, Dates, etc.) to plain JSON for Client Components
  return prop ? (JSON.parse(JSON.stringify(prop)) as Property) : null;
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const property = await getPropertyData(id);

  if (!property) {
    return {
      title: "Property Not Found | PHOJAA95 Real Estate",
    };
  }

  const plainDesc = (property.description || "")
    .replace(/<[^>]*>/g, "")
    .slice(0, 160);

  return {
    title: `${property.title} | PHOJAA95 Real Estate`,
    description:
      plainDesc ||
      "Discover land and properties across Bhutan with PHOJAA95 Real Estate.",
    openGraph: {
      title: `${property.title} | PHOJAA95 Real Estate`,
      description: plainDesc,
      images: property.images?.[0] ? [{ url: property.images[0] }] : [],
    },
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await getPropertyData(id);

  if (!property) {
    notFound();
  }

  return <PropertyDetailClient property={property} />;
}
