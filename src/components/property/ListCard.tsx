"use client";

import { memo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bed, Bath, Maximize, MapPin, Heart } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Property } from "@/types";
import { cn } from "@/lib/utils";

interface ListCardProps {
  property: Property;
  className?: string;
}

const StatItem = memo(function StatItem({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Bed;
  value: number | string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 text-[14px]">
      <Icon className="w-4 h-4 text-ink-400" strokeWidth={1.75} />
      <span className="font-medium tabular-nums">{value}</span>
      <span className="text-ink-400 hidden sm:inline">{label}</span>
    </div>
  );
});

export const ListCard = memo(function ListCard({
  property,
  className,
}: ListCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const href = `/properties/${property._id}`;

  return (
    <Link
      href={href}
      className={cn(
        "group grid grid-cols-1 md:grid-cols-[minmax(0,420px)_1fr] bg-white dark:bg-card rounded-apple-lg overflow-hidden border border-ink-100 dark:border-ink-700/40 hover:shadow-elevated transition-shadow duration-500 ease-apple",
        className
      )}
    >
      <div className="relative aspect-photo md:aspect-auto md:min-h-[280px] overflow-hidden bg-fog">
        <Image
          src={property.images[0] || "/placeholder-property.jpg"}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, 420px"
          className="object-cover transition-transform duration-1200 ease-apple-out group-hover:scale-[1.04]"
        />
        {property.isSold && (
          <span className="absolute top-4 left-4 px-2.5 py-1 bg-foreground text-background text-[11px] font-medium rounded-full">
            Sold
          </span>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setIsLiked(!isLiked);
          }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center bg-white/85 backdrop-blur-md text-foreground hover:bg-white transition-colors no-tap"
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

      <div className="p-6 sm:p-8 flex flex-col">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
          <h3 className="font-semibold text-[20px] sm:text-[24px] tracking-tighter2 leading-tight2 text-foreground group-hover:text-sky transition-colors duration-fast line-clamp-2">
            {property.title}
          </h3>
          <span className="shrink-0 text-[18px] sm:text-[20px] font-semibold tracking-tightest tabular-nums text-foreground">
            {formatPrice(property.price)}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[14px] text-ink-500 mb-5">
          <MapPin className="w-4 h-4 text-ink-400 shrink-0" strokeWidth={1.75} />
          <span className="truncate">{property.location}</span>
        </div>

        {property.description && (
          <p className="text-[15px] text-ink-500 line-clamp-2 mb-6 leading-snug2">
            {property.description}
          </p>
        )}

        <div className="grid grid-cols-3 gap-4 mt-auto pt-5 border-t border-ink-100 dark:border-ink-700/40">
          <StatItem icon={Bed} value={property.bedrooms} label="Beds" />
          <StatItem icon={Bath} value={property.bathrooms} label="Baths" />
          <StatItem icon={Maximize} value={property.area} label="Sqft" />
        </div>

        <div className="mt-6 flex items-center justify-between">
          <span className="link-apple link-arrow">Learn more</span>
          <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-sky text-white text-[12px] font-semibold hover:bg-sky-hover active:scale-[0.97] transition-all duration-fast">
            {property.isSold ? "Sold" : "View"}
          </span>
        </div>
      </div>
    </Link>
  );
});
