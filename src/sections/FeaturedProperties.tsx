"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Bed, Bath, Maximize, MapPin, Heart } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Property } from "@/types";

export function FeaturedProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        // Try fetching featured properties first
        let response = await fetch("/api/properties?featured=true&limit=3");
        let data = await response.json();

        if (data.success && data.data.length > 0) {
          setProperties(data.data);
        } else {
          // Fallback: Fetch the 3 most recent properties if no featured ones exist
          response = await fetch("/api/properties?limit=3&sortBy=createdAt&sortOrder=desc");
          data = await response.json();
          if (data.success) {
            setProperties(data.data);
          }
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const displayProperties = properties;

  return (
    <section className="section-padding bg-gray-50 relative overflow-hidden">
      {/* Decorative Top Border */}
      <div className="absolute top-0 left-0 right-0 flex justify-center py-4">
        <span className="text-bhutan-gold/40 tracking-widest text-lg font-serif">────────── ✦ ──────────</span>
      </div>

      <div className="container-luxury relative z-10 w-full max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-serif text-3xl md:text-4xl font-bold text-bhutan-dark mb-4"
          >
            Featured Properties
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-24 h-1 bg-bhutan-red mx-auto rounded-full"
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-[2rem] overflow-hidden shadow-soft animate-pulse">
                <div className="h-48 md:h-64 bg-gray-200" />
                <div className="p-4 md:p-6 space-y-4">
                  <div className="h-6 md:h-8 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 md:h-6 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 md:h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {displayProperties.slice(0, 3).map((property, index) => (
              <motion.div
                key={property._id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function PropertyCard({ property }: { property: Property }) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-soft hover:shadow-[0_20px_50px_-15px_rgba(244,196,48,0.3)] hover:-translate-y-2 transition-all duration-500 group flex flex-col h-full border border-gray-100 relative">
      <div className="relative h-48 md:h-64 overflow-hidden">
        <Image
          src={property.images[0] || "/placeholder-property.jpg"}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bhutan-dark/60 via-transparent to-transparent opacity-80" />

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsLiked(!isLiked);
          }}
          className="absolute top-3 right-3 md:top-4 md:right-4 w-8 h-8 md:w-10 md:h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-300 group/heart"
        >
          <Heart
            className={`w-3 h-3 md:w-4 md:h-4 transition-all duration-300 ${isLiked ? "fill-bhutan-red text-bhutan-red scale-110" : "text-white group-hover/heart:text-bhutan-red"}`}
          />
        </button>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4 flex flex-col gap-2">
          {property.isSold && (
            <div className="px-3 py-1 bg-bhutan-red text-white font-bold text-[10px] md:text-xs rounded-lg shadow-lg uppercase tracking-widest w-fit animate-pulse">
              Sold Out
            </div>
          )}
          <div className="px-3 py-1.5 md:px-5 md:py-2.5 bg-white/95 backdrop-blur-md text-bhutan-gold font-serif font-bold text-sm md:text-lg rounded-lg md:rounded-xl shadow-lg border border-bhutan-gold/20 flex items-center shadow-[0_4px_15px_rgba(244,196,48,0.2)]">
            {formatPrice(property.price)}
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 flex-grow flex flex-col">
        <h3 className="font-serif text-lg md:text-xl font-bold text-bhutan-dark mb-1 md:mb-2 group-hover:text-bhutan-red transition-colors duration-300 line-clamp-1">
          {property.title}
        </h3>

        <div className="flex items-center gap-2 text-gray-500 mb-4 pb-4 border-b border-gray-100">
          <MapPin className="w-4 h-4 text-bhutan-gold" />
          <span className="text-sm tracking-wide truncate">{property.location}</span>
        </div>

        {property.loanAvailable && property.loanAmount !== undefined && property.loanAmount > 0 && (
          <div className="mb-4 px-4 py-2 bg-bhutan-gold/5 rounded-xl border border-bhutan-gold/10 flex items-center justify-between">
            <span className="text-[10px] font-bold text-bhutan-gold uppercase tracking-widest">Loan Option</span>
            <span className="text-xs font-bold text-bhutan-dark">Nu. {property.loanAmount.toLocaleString("en-IN")}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-1 md:gap-2 mb-8">
          {[
            { icon: Bed, label: property.bedrooms, text: "Beds" },
            { icon: Bath, label: property.bathrooms, text: "Baths" },
            { icon: Maximize, label: property.area, text: "sqft" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-1 border-r border-gray-100 last:border-0">
              <span className="text-sm md:text-base font-bold text-bhutan-dark">{item.label}</span>
              <span className="text-[9px] md:text-[10px] text-gray-400 uppercase font-bold tracking-widest">{item.text}</span>
            </div>
          ))}
        </div>

        <div className="mt-auto">
          <Link href={`/properties/${property._id}`} className="block w-full">
            <button className="w-full py-4 bg-bhutan-dark hover:bg-bhutan-red text-white font-bold text-[11px] uppercase tracking-widest rounded-xl transition-all duration-300 shadow-md hover:shadow-[0_0_20px_rgba(155,28,28,0.4)] text-center relative overflow-hidden group/btn">
              <span className="relative z-10 transition-transform duration-300 inline-block group-hover/btn:-translate-y-8">View Details</span>
              <span className="absolute inset-0 z-10 flex items-center justify-center translate-y-8 group-hover/btn:translate-y-0 transition-transform duration-300">
                Explore Property
              </span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
