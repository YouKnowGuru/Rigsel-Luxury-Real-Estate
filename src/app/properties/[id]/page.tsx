import "server-only";
import { cache } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import PropertyModel from "@/models/Property";
import { Property } from "@/types";
import { PropertyDetailClient } from "./PropertyDetailClient";
import { BreadcrumbJsonLd, RealEstateListingJsonLd } from "@/components/seo/JsonLd";

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

  const title = `${property.title} in ${property.district || property.location || 'Bhutan'} | PHOJAA95 Real Estate`;
  const canonicalUrl = `https://phojaa95realestate.com/properties/${id}`;
  const firstImage = property.images?.[0];

  return {
    metadataBase: new URL("https://phojaa95realestate.com"),
    title,
    description:
      plainDesc ||
      `View ${property.title} for sale in ${property.district || 'Bhutan'}. Verified listing by PHOJAA95 Real Estate.`,
    keywords: [
      property.title,
      `${property.district} real estate`,
      `property for sale in ${property.district || 'Bhutan'}`,
      property.propertyType ? `${property.propertyType} for sale Bhutan` : "real estate Bhutan",
      "buy property Bhutan",
      "PHOJAA95 Real Estate",
    ],
    openGraph: {
      title,
      description: plainDesc,
      url: canonicalUrl,
      type: "website",
      images: firstImage ? [{ url: firstImage, width: 1200, height: 630, alt: property.title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: plainDesc,
      images: firstImage ? [firstImage] : [],
    },
    alternates: {
      canonical: canonicalUrl,
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

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Properties", url: "/properties" },
    { name: property.title, url: `/properties/${id}` },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <RealEstateListingJsonLd
        title={property.title}
        description={property.description?.replace(/<[^>]*>/g, "").slice(0, 160) || property.title}
        url={`https://phojaa95realestate.com/properties/${id}`}
        image={property.images?.[0]}
        price={property.price}
        addressLocality={property.district || property.location || "Bhutan"}
        addressRegion={property.district || "Bhutan"}
      />
      <PropertyDetailClient property={property} />
    </>
  );
}
