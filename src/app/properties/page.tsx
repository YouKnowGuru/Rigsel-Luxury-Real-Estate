"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bed,
  Bath,
  Maximize,
  MapPin,
  Filter,
  Search,
  X,
  ChevronDown,
  Grid3X3,
  List as ListIcon,
  Heart,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Property, PropertyFilters } from "@/types";
import { formatPrice, getPropertyTypeLabel, getDistrictLabel } from "@/lib/utils";

const districts = [
  "All Districts",
  "Bumthang", "Chhukha", "Dagana", "Gasa", "Haa",
  "Lhuentse", "Mongar", "Paro", "Pema Gatshel", "Punakha",
  "Samdrup Jongkhar", "Samtse", "Sarpang", "Thimphu", "Trashigang",
  "Trashi Yangtse", "Trongsa", "Tsirang", "Wangdue Phodrang", "Zhemgang"
];

interface IPropertyType {
  _id: string;
  name: string;
  slug: string;
  areaLabel: string;
}

const priceRanges = [
  { label: "Any Price", min: 0, max: 0 },
  { label: "Under 5M", min: 0, max: 5000000 },
  { label: "5M - 10M", min: 5000000, max: 10000000 },
  { label: "10M - 20M", min: 10000000, max: 20000000 },
  { label: "20M - 50M", min: 20000000, max: 50000000 },
  { label: "Above 50M", min: 50000000, max: 0 },
];

const bedroomOptions = [
  { value: 0, label: "Any" },
  { value: 1, label: "1+" },
  { value: 2, label: "2+" },
  { value: 3, label: "3+" },
  { value: 4, label: "4+" },
  { value: 5, label: "5+" },
];

function PropertiesContent() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<IPropertyType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<PropertyFilters>({
    location: searchParams.get("location") || "",
    district: searchParams.get("district") || "",
    propertyType: searchParams.get("type") || "",
    minPrice: Number(searchParams.get("minPrice")) || 0,
    maxPrice: Number(searchParams.get("maxPrice")) || 0,
    bedrooms: Number(searchParams.get("bedrooms")) || 0,
    bathrooms: Number(searchParams.get("bathrooms")) || 0,
  });

  const fetchProperties = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.district && filters.district !== "All Districts") {
        params.append("district", filters.district);
      }
      if (filters.propertyType) {
        params.append("propertyType", filters.propertyType);
      }
      if (filters.minPrice) {
        params.append("minPrice", filters.minPrice.toString());
      }
      if (filters.maxPrice) {
        params.append("maxPrice", filters.maxPrice.toString());
      }
      if (filters.bedrooms) {
        params.append("bedrooms", filters.bedrooms.toString());
      }

      const response = await fetch(`/api/properties?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setProperties(data.data);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const fetchPropertyTypes = useCallback(async () => {
    try {
      const response = await fetch("/api/property-types");
      const data = await response.json();
      if (data.success) {
        setPropertyTypes(data.data);
      }
    } catch (error) {
      console.error("Error fetching types:", error);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
    fetchPropertyTypes();
  }, [fetchProperties, fetchPropertyTypes]);

  const getAreaUnit = (typeSlug: string) => {
    const type = propertyTypes.find(t => t.slug === typeSlug);
    if (!type) return "Decimals";
    const match = type.areaLabel.match(/\(([^)]+)\)/);
    return match ? match[1] : type.areaLabel;
  };

  const fallbackProperties: Property[] = [
    {
      _id: "1",
      title: "Luxury Villa in Thimphu",
      price: 25000000,
      location: "Motithang, Thimphu",
      district: "Thimphu",
      bedrooms: 5,
      bathrooms: 4,
      area: 450,
      propertyType: "villa",
      description: "Beautiful luxury villa with mountain views",
      features: ["Mountain View", "Garden", "Parking"],
      images: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800"],
      latitude: 27.4712,
      longitude: 89.6339,
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: "2",
      title: "Modern Apartment in Paro",
      price: 12000000,
      location: "Paro Town",
      district: "Paro",
      bedrooms: 3,
      bathrooms: 2,
      area: 180,
      propertyType: "apartment",
      description: "Modern apartment near the airport",
      features: ["Balcony", "Parking"],
      images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800"],
      latitude: 27.4289,
      longitude: 89.4167,
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: "3",
      title: "Traditional Bhutanese House",
      price: 18000000,
      location: "Punakha Valley",
      district: "Punakha",
      bedrooms: 4,
      bathrooms: 3,
      area: 320,
      propertyType: "house",
      description: "Traditional architecture with modern amenities",
      features: ["River View", "Garden", "Traditional Design"],
      images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"],
      latitude: 27.5921,
      longitude: 89.8773,
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const displayProperties = properties.length > 0 ? properties : fallbackProperties;

  return (
    <div className="min-h-screen bg-[#F9F7F2] pt-20">
      <div className="fixed inset-0 bg-thangka opacity-[0.02] pointer-events-none z-0" />

      <div className="container-luxury relative z-10 py-12 w-full max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px w-12 bg-bhutan-red" />
            <span className="text-bhutan-red text-[10px] font-bold uppercase tracking-[0.4em]">
              Our Best Homes
            </span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-bhutan-dark mb-4">
            All <span className="text-bhutan-red italic font-light">Properties</span>
          </h1>
          <p className="text-bhutan-dark/40 text-lg font-light">
            We have {displayProperties.length} beautiful homes and land for you.
          </p>
        </motion.div>

        {/* Filters Bar - Matching Homepage Luxury Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl p-4 md:p-8 mb-12 border border-bhutan-gold/10 sticky top-[72px] md:top-24 z-30 group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-bhutan-gold/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

          <div className="flex flex-col md:flex-row flex-wrap items-center gap-4 md:gap-6 relative z-10 w-full">
            {/* Search */}
            <div className="w-full md:flex-1 md:min-w-[280px]">
              <div className="group/search relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-bhutan-gold group-focus-within/search:text-bhutan-red transition-colors" />
                <Input
                  placeholder="Where do you want to live?..."
                  className="h-14 md:h-16 pl-14 pr-6 rounded-xl md:rounded-2xl bg-[#F9F7F2] border-bhutan-gold/20 focus:ring-bhutan-red/20 focus:border-bhutan-red text-bhutan-dark placeholder:text-bhutan-dark/20 font-serif"
                  value={filters.location}
                  onChange={(e) =>
                    setFilters({ ...filters, location: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Quick Filters Group */}
            <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 w-full md:w-auto">
              {/* District Select */}
              <div className="relative group/select w-full sm:w-auto flex-1">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-bhutan-gold pointer-events-none" />
                <select
                  value={filters.district}
                  onChange={(e) =>
                    setFilters({ ...filters, district: e.target.value })
                  }
                  className="h-14 md:h-16 pl-12 pr-10 bg-[#F9F7F2] border border-bhutan-gold/20 rounded-xl md:rounded-2xl focus:ring-bhutan-red/20 focus:border-bhutan-red outline-none text-[10px] font-bold uppercase tracking-widest text-bhutan-dark/60 appearance-none min-w-full md:min-w-[160px] cursor-pointer hover:bg-white transition-all shadow-sm"
                >
                  {districts.map((district) => (
                    <option key={district} value={district === "All Districts" ? "" : district} className="font-sans">
                      {district}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-bhutan-gold pointer-events-none group-hover/select:translate-y-[-20%] transition-transform" />
              </div>

              {/* Type Select */}
              <div className="relative group/select w-full sm:w-auto flex-1">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-bhutan-gold pointer-events-none" />
                <select
                  value={filters.propertyType}
                  onChange={(e) =>
                    setFilters({ ...filters, propertyType: e.target.value })
                  }
                  className="h-14 md:h-16 pl-12 pr-10 bg-[#F9F7F2] border border-bhutan-gold/20 rounded-xl md:rounded-2xl focus:ring-bhutan-red/20 focus:border-bhutan-red outline-none text-[10px] font-bold uppercase tracking-widest text-bhutan-dark/60 appearance-none min-w-full md:min-w-[160px] cursor-pointer hover:bg-white transition-all shadow-sm"
                >
                  <option value="">All Types</option>
                  {propertyTypes.map((type) => (
                    <option key={type._id} value={type.slug} className="font-sans">
                      {type.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-bhutan-gold pointer-events-none group-hover/select:translate-y-[-20%] transition-transform" />
              </div>

              {/* Advanced Toggle */}
              <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-2 p-1.5 bg-[#F9F7F2] rounded-2xl border border-bhutan-gold/20">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`h-12 w-12 rounded-xl transition-all duration-500 ${showFilters ? "bg-bhutan-red text-white shadow-lg" : "text-bhutan-dark/40 hover:text-bhutan-red hover:bg-bhutan-red/5"
                    }`}
                >
                  <Filter className="w-5 h-5" />
                </Button>

                <div className="h-8 w-px bg-bhutan-gold/20 mx-1" />

                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setViewMode("grid")}
                    className={`h-12 w-12 rounded-xl border-none transition-all ${viewMode === "grid" ? "text-bhutan-red bg-bhutan-red/5" : "text-bhutan-dark/20 hover:text-bhutan-dark/40"
                      }`}
                  >
                    <Grid3X3 className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setViewMode("list")}
                    className={`h-12 w-12 rounded-xl border-none transition-all ${viewMode === "list" ? "text-bhutan-red bg-bhutan-red/5" : "text-bhutan-dark/20 hover:text-bhutan-dark/40"
                      }`}
                  >
                    <ListIcon className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Search Expansion */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-8 pt-8 border-t border-bhutan-gold/10 max-h-[60vh] md:max-h-none overflow-y-auto md:overflow-visible custom-scrollbar"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                  {/* Price Range */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-bhutan-dark/40 uppercase tracking-[0.2em] ml-2">Price Range</label>
                    <div className="relative group/select">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-bhutan-gold pointer-events-none">Nu</span>
                      <select
                        onChange={(e) => {
                          const range = priceRanges[parseInt(e.target.value)];
                          setFilters({
                            ...filters,
                            minPrice: range.min,
                            maxPrice: range.max,
                          });
                        }}
                        className="h-14 w-full pl-12 pr-10 bg-[#F9F7F2] border border-bhutan-gold/20 rounded-2xl focus:ring-bhutan-red/20 focus:border-bhutan-red outline-none text-[10px] font-bold uppercase tracking-widest text-bhutan-dark/60 appearance-none cursor-pointer hover:bg-white transition-all shadow-sm"
                      >
                        {priceRanges.map((range, index) => (
                          <option key={range.label} value={index}>
                            {range.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-bhutan-gold pointer-events-none" />
                    </div>
                  </div>

                  {/* Bedrooms */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-bhutan-dark/40 uppercase tracking-[0.2em] ml-2">Bedrooms</label>
                    <div className="flex gap-2">
                      {bedroomOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setFilters({ ...filters, bedrooms: option.value })}
                          className={`flex-1 h-14 rounded-2xl text-[10px] font-bold uppercase tracking-tighter transition-all duration-300 border ${filters.bedrooms === option.value
                            ? "bg-bhutan-dark text-white border-bhutan-dark shadow-lg"
                            : "bg-[#F9F7F2] text-bhutan-dark/40 border-bhutan-gold/20 hover:border-bhutan-red hover:text-bhutan-red"
                            }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reset Actions */}
                  <div className="flex items-end pb-1">
                    <Button
                      variant="ghost"
                      onClick={() =>
                        setFilters({
                          location: "",
                          district: "",
                          propertyType: "",
                          minPrice: 0,
                          maxPrice: 0,
                          bedrooms: 0,
                          bathrooms: 0,
                        })
                      }
                      className="h-14 w-full bg-bhutan-red/5 text-bhutan-red hover:bg-bhutan-red hover:text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest border border-bhutan-red/10 group/clear shadow-sm"
                    >
                      <RotateCcw className="w-4 h-4 mr-2 group-hover:rotate-[-120deg] transition-transform duration-500" />
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Properties Grid/List */}
        {isLoading ? (
          <div
            className={`grid gap-4 md:gap-8 ${viewMode === "grid"
              ? "grid-cols-2 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
              }`}
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl animate-pulse"
              >
                <div className="h-72 bg-gray-200" />
                <div className="p-8 space-y-4">
                  <div className="h-6 bg-gray-100 rounded w-3/4" />
                  <div className="h-4 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className={`grid gap-4 md:gap-8 ${viewMode === "grid"
              ? "grid-cols-2 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
              }`}
          >
            {displayProperties.map((property, index) => (
              <motion.div
                key={property._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <PropertyCard
                  property={property}
                  viewMode={viewMode}
                  areaUnit={getAreaUnit(property.propertyType)}
                  typeName={propertyTypes.find(t => t.slug === property.propertyType)?.name || property.propertyType}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && displayProperties.length === 0 && (
          <div className="text-center py-24 bg-white rounded-[3rem] border border-bhutan-gold/10 shadow-xl">
            <div className="w-24 h-24 bg-[#F9F7F2] rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-bhutan-gold/40" />
            </div>
            <h3 className="text-3xl font-serif font-bold text-bhutan-dark mb-4">
              None Found
            </h3>
            <p className="text-bhutan-dark/40 mb-8 max-w-md mx-auto font-light">
              We couldn't find any properties matching your search. Please try changing your filters.
            </p>
            <Button onClick={() => setFilters({})} className="bg-bhutan-red hover:bg-bhutan-dark text-white rounded-2xl px-12 h-16 text-[10px] font-bold uppercase tracking-widest shadow-xl transition-all">
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-bhutan-red border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <PropertiesContent />
    </Suspense>
  );
}

function PropertyCard({
  property,
  viewMode,
  areaUnit,
  typeName,
}: {
  property: Property;
  viewMode: "grid" | "list";
  areaUnit: string;
  typeName: string;
}) {
  const [isLiked, setIsLiked] = useState(false);

  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="group bg-white rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 border border-bhutan-gold/10 hover:border-bhutan-gold/30"
      >
        <div className="flex flex-col md:flex-row h-full">
          {/* Image */}
          <div className="relative w-full md:w-[450px] h-72 md:h-auto flex-shrink-0 overflow-hidden">
            <img
              src={property.images[0] || "/placeholder-property.jpg"}
              alt={property.title}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bhutan-dark/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            {property.featured && (
              <div className="absolute top-8 left-8 px-5 py-2 bg-bhutan-red text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full shadow-xl z-20">
                Special Choice
              </div>
            )}

            <button
              onClick={(e) => {
                e.preventDefault();
                setIsLiked(!isLiked);
              }}
              className="absolute top-8 right-8 w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 hover:bg-white transition-all duration-500 group/heart z-20"
            >
              <Heart
                className={`w-6 h-6 transition-all duration-300 ${isLiked ? "fill-bhutan-red text-bhutan-red scale-110" : "text-white group-hover/heart:text-bhutan-red"
                  }`}
              />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-10 md:p-14 flex flex-col justify-between">
            <div className="space-y-8">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[10px] font-bold text-bhutan-gold uppercase tracking-[0.3em]">
                      {typeName}
                    </span>
                    <div className="w-1.5 h-1.5 rounded-full bg-bhutan-gold/20" />
                    <span className="text-[10px] font-medium text-bhutan-dark/40 uppercase tracking-[0.2em]">
                      Ref: {property._id.toString().slice(-6).toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-serif text-3xl md:text-4xl font-bold text-bhutan-dark group-hover:text-bhutan-red transition-colors duration-500">
                    {property.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-4 text-bhutan-dark/60 bg-[#F9F7F2] p-4 rounded-2xl w-fit">
                <MapPin className="w-5 h-5 text-bhutan-gold" />
                <span className="text-sm font-medium">{property.location}</span>
              </div>

              <p className="text-bhutan-dark/40 text-lg leading-relaxed line-clamp-2 font-light italic">
                "{property.description.replace(/<[^>]*>?/gm, '')}"
              </p>

              <div className="grid grid-cols-3 gap-8 py-8 border-y border-bhutan-gold/10">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-bhutan-gold/40">
                    <Bed className="w-5 h-5" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Beds</span>
                  </div>
                  <p className="text-2xl font-serif font-bold text-bhutan-dark">{property.bedrooms}</p>
                </div>
                <div className="space-y-2 border-x border-bhutan-gold/10 px-8">
                  <div className="flex items-center gap-3 text-bhutan-gold/40">
                    <Bath className="w-5 h-5" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Baths</span>
                  </div>
                  <p className="text-2xl font-serif font-bold text-bhutan-dark">{property.bathrooms}</p>
                </div>
                <div className="space-y-2 pl-8">
                  <div className="flex items-center gap-3 text-bhutan-gold/40">
                    <Maximize className="w-5 h-5" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Size</span>
                  </div>
                  <p className="text-2xl font-serif font-bold text-bhutan-dark">{property.area} <span className="text-[10px] text-bhutan-dark/40">{areaUnit}</span></p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-12">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-bhutan-dark/30 uppercase tracking-widest">Price</span>
                <p className="text-4xl font-serif font-bold text-bhutan-red">
                  {formatPrice(property.price)}
                </p>
              </div>
              <Link href={`/properties/${property._id}`}>
                <Button className="h-18 px-12 bg-bhutan-dark hover:bg-bhutan-red text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-2xl transition-all duration-500 shadow-xl group/btn flex items-center gap-3 border border-white/5">
                  See Details
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-white rounded-xl md:rounded-[2rem] overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border border-gray-100"
    >
      {/* Image */}
      <div className="relative h-32 sm:h-44 md:h-56 overflow-hidden">
        <img
          src={property.images[0] || "/placeholder-property.jpg"}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bhutan-dark/60 via-transparent to-transparent" />

        {property.featured && (
          <div className="absolute top-2 left-2 md:top-4 md:left-4 px-2 py-1 md:px-3 md:py-1.5 bg-bhutan-red text-white text-[7px] md:text-[9px] font-bold uppercase tracking-wider rounded-full shadow-lg z-20">
            Featured
          </div>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            setIsLiked(!isLiked);
          }}
          className="absolute top-2 right-2 md:top-4 md:right-4 w-7 h-7 md:w-10 md:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-300 group/heart z-20"
        >
          <Heart
            className={`w-3 h-3 md:w-4 md:h-4 transition-all ${isLiked ? "fill-bhutan-red text-bhutan-red" : "text-white group-hover/heart:text-bhutan-red"}`}
          />
        </button>

        {/* Price on image */}
        <div className="absolute bottom-2 left-2 md:bottom-4 md:left-4 z-20">
          <div className="px-2 py-1 md:px-3 md:py-1.5 bg-white/90 backdrop-blur-sm text-bhutan-gold font-serif font-bold text-[10px] md:text-base rounded-md md:rounded-lg shadow border border-bhutan-gold/10">
            {formatPrice(property.price)}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-2.5 sm:p-3 md:p-6">
        <div className="flex items-center gap-1 mb-1 md:mb-2">
          <MapPin className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 text-bhutan-gold flex-shrink-0" />
          <span className="text-[8px] md:text-[10px] text-gray-400 uppercase tracking-wider truncate">{property.location}</span>
        </div>

        <h3 className="font-serif text-xs sm:text-sm md:text-lg font-bold text-bhutan-dark group-hover:text-bhutan-red transition-colors line-clamp-1 mb-2 md:mb-4">
          {property.title}
        </h3>

        <div className="flex items-center justify-between pt-2 md:pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 md:gap-4">
            <div className="flex items-center gap-1">
              <Bed className="w-3 h-3 md:w-4 md:h-4 text-bhutan-gold/40" />
              <span className="text-[9px] md:text-xs font-bold text-gray-500">{property.bedrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="w-3 h-3 md:w-4 md:h-4 text-bhutan-gold/40" />
              <span className="text-[9px] md:text-xs font-bold text-gray-500">{property.bathrooms}</span>
            </div>
            <div className="hidden sm:flex items-center gap-1">
              <Maximize className="w-3 h-3 md:w-4 md:h-4 text-bhutan-gold/40" />
              <span className="text-[9px] md:text-xs font-bold text-gray-500">{property.area}<span className="text-[7px] ml-0.5">{areaUnit}</span></span>
            </div>
          </div>

          <Link href={`/properties/${property._id}`}>
            <button className="w-7 h-7 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gray-50 text-bhutan-red flex items-center justify-center hover:bg-bhutan-red hover:text-white transition-all group/arrow">
              <ArrowRight className="w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
