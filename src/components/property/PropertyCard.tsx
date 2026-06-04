"use client";

import { memo } from "react";
import { Property } from "@/types";
import { GridCard } from "./GridCard";
import { ListCard } from "./ListCard";

interface PropertyCardProps {
  property: Property;
  variant?: "grid" | "list";
  className?: string;
}

/**
 * PropertyCard — Compatibility wrapper around explicit variant components.
 * 
 * For new code, prefer using GridCard or ListCard directly:
 *   <GridCard property={property} />
 *   <ListCard property={property} />
 * 
 * This wrapper maintains backward compatibility with existing usage.
 */
export const PropertyCard = memo(function PropertyCard({
  property,
  variant = "grid",
  className,
}: PropertyCardProps) {
  if (variant === "list") {
    return <ListCard property={property} className={className} />;
  }

  return <GridCard property={property} className={className} />;
});
