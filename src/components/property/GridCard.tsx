"use client";

import { memo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bed, Bath, Maximize, MapPin, Heart } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Property } from "@/types";
import { cn } from "@/lib/utils";

interface GridCardProps {
  property: Property;
  className?: string;
}

const GridStatItem = memo(function GridStatItem({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Bed;
  value: number | string;
  label: string;
}) {
  return (
    <li className="flex items-center gap-1.5">
      <Icon className="w-3.5 h-3.5 text-ink-400 shrink-0" strokeWidth={1.75} />
      <span className="font-medium tabular-nums text-foreground">{value}</span>
      <span className="hidden sm:inline">{label}</span>
    </li>
  );
});

export const GridCard = memo(function GridCard({
  property,
  className,
}: GridCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const href = `/properties/${property._id}`;

  return (
    <Link
      href={href}
      className={cn(
        "group block glass-card hover:shadow-product",
        className
      )}
    >
      <div className="relative aspect-[4/3] sm:aspect-[3/2.2] overflow-hidden bg-ink-100">
        <Image
          src={property.images[0] || "/placeholder-property.jpg"}
          alt={property.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-1200 ease-apple-out group-hover:scale-[1.04]"
        />

        <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
          {property.isSold ? (
            <span className="px-2.5 py-1 bg-foreground text-background text-[11px] font-medium rounded-full">
              Sold
            </span>
          ) : (
            <span className="px-2.5 py-1 bg-white/85 backdrop-blur-md text-foreground text-[11px] font-medium rounded-full">
              Available
            </span>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setIsLiked(!isLiked);
            }}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-white/85 backdrop-blur-md text-foreground hover:bg-white transition-colors no-tap"
            aria-label={isLiked ? "Remove from favorites" : "Save"}
            aria-pressed={isLiked}
          >
            <Heart
              className={cn(
                "w-[18px] h-[18px] transition-colors",
                isLiked && "fill-sky text-sky"
              )}
              strokeWidth={1.75}
            />
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-2">
          <p className="text-[12px] uppercase tracking-eyebrow text-sky font-semibold">
            {property.propertyType || "Property"}
          </p>
          {!property.isSold && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-sky/[0.08] text-sky text-[9px] font-bold tracking-wide">
              NEW
            </span>
          )}
        </div>

        <h3 className="font-semibold text-[20px] sm:text-[22px] tracking-tighter2 leading-tight2 text-foreground line-clamp-1">
          {property.title}
        </h3>

        <div className="mt-1.5 flex items-center gap-1.5 text-[13px] text-ink-500">
          <MapPin className="w-3.5 h-3.5 text-ink-400 shrink-0" strokeWidth={1.75} />
          <span className="truncate">{property.location}</span>
        </div>

        <div className="mt-5 flex items-baseline gap-2">
          <span className="text-[13px] text-ink-500">From</span>
          <span className="text-[20px] sm:text-[22px] font-semibold tracking-tightest tabular-nums text-foreground">
            {formatPrice(property.price)}
          </span>
        </div>

        <ul className="mt-4 grid grid-cols-3 gap-2 text-[12px] text-ink-500">
          <GridStatItem icon={Bed} value={property.bedrooms} label="Beds" />
          <GridStatItem icon={Bath} value={property.bathrooms} label="Baths" />
          <GridStatItem icon={Maximize} value={property.area} label="Decimal" />
        </ul>

        <div className="mt-5 flex items-center justify-between">
          <span className="link-apple link-arrow text-[14px]">Learn more</span>
          <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-sky text-white text-[12px] font-semibold hover:bg-sky-hover active:scale-[0.97] transition-all duration-fast">
            {property.isSold ? "Sold" : "View"}
          </span>
        </div>
      </div>
    </Link>
  );
});
