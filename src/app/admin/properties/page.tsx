"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Building2,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Property } from "@/types";
import { cn } from "@/lib/utils";

interface IPropertyType {
  _id: string;
  name: string;
  slug: string;
  areaLabel: string;
}

export default function AdminProperties() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<IPropertyType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  useEffect(() => {
    fetchProperties();
    fetchPropertyTypes();
  }, []);

  const fetchPropertyTypes = async () => {
    try {
      const res = await fetch("/api/admin/property-types");
      const data = await res.json();
      if (data.success) setPropertyTypes(data.data);
    } catch (error) {
      console.error("Error fetching types:", error);
    }
  };

  const fetchProperties = async () => {
    try {
      const response = await fetch("/api/properties");
      const data = await response.json();
      if (data.success) {
        setProperties(data.data);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return;

    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: "DELETE",
        headers: {
        },
      });

      if (response.ok) {
        toast({
          title: "Property Deleted",
          description: "The property has been deleted successfully",
        });
        fetchProperties();
      } else {
        const data = await response.json().catch(() => ({}));
        toast({
          title: "Error",
          description: data.error || "Failed to delete property",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete property",
        variant: "destructive",
      });
    }
  };

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      selectedType === "all" || property.propertyType === selectedType;
    return matchesSearch && matchesType;
  });

  const getAreaLabel = (typeSlug: string) => {
    const type = propertyTypes.find((t) => t.slug === typeSlug);
    if (!type || !type.areaLabel) return "Decimals";
    const match = type.areaLabel.match(/\(([^)]+)\)/);
    return match ? match[1] : type.areaLabel;
  };

  const getTypeName = (slug: string) => {
    return propertyTypes.find((t) => t.slug === slug)?.name || slug;
  };

if (isLoading) {
      return (
        <div className="min-h-screen bg-fog-light flex items-center justify-center">
          <div className="animate-spin w-10 h-10 border-4 border-sky/20 border-t-sky rounded-full" />
        </div>
      );
    }

  return (
    <div className="p-3 md:p-6 lg:p-8 max-w-[1600px] mx-auto min-h-screen">
      {/* Header */}
      <header className="mb-4 md:mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
        <div>
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 mb-2"
          >
            <div className="w-0.5 h-6 bg-sky rounded-full" />
            <p className="text-sky text-[12px] font-semibold uppercase tracking-[0.12em]">
              Inventory
            </p>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl md:text-2xl lg:text-[28px] font-semibold text-foreground tracking-tight"
          >
            Property Listings
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Link
            href="/admin/properties/new"
            className="h-9 md:h-11 px-4 md:px-6 bg-sky text-white text-sm font-semibold rounded-full hover:bg-sky-hover transition-all duration-200 shadow-soft flex items-center gap-2 md:gap-3 group"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" strokeWidth={1.5} />
            <span className="hidden sm:inline">Add Property</span>
            <span className="sm:hidden">Add</span>
          </Link>
        </motion.div>
      </header>

      {/* Filters & Search */}
      <div className="mb-6 flex flex-col gap-3 relative z-10">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400 group-focus-within:text-sky transition-colors" strokeWidth={1.5} />
          <Input
            placeholder="Search by title or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 rounded-xl border-ink-200 focus:border-sky focus:ring-2 focus:ring-sky/15 pl-11 text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2.5">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="h-10 px-4 bg-card rounded-xl border border-ink-200 text-xs font-medium text-ink-600 focus:outline-none focus:ring-2 focus:ring-sky/15 appearance-none cursor-pointer min-w-[140px] max-w-[200px] text-[13px]"
          >
            <option value="all">All Property Types</option>
            {propertyTypes.map((t) => (
              <option key={t._id} value={t.slug}>
                {t.name}
              </option>
            ))}
          </select>
          <button className="h-10 px-4 bg-card rounded-xl border border-ink-200 text-ink-500 hover:text-sky hover:border-sky/30 transition-all flex items-center gap-1.5 w-full sm:w-auto justify-center group shrink-0">
            <Filter className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" strokeWidth={1.5} />
            <span className="text-xs font-medium">Refine</span>
          </button>
        </div>
      </div>

      {/* Property Cards */}
      <div className="space-y-3 relative z-10">
        {filteredProperties.length === 0 && (
          <div className="text-center py-16 bg-card rounded-xl border border-ink-100/60 shadow-soft">
            <div className="w-14 h-14 bg-card rounded-full flex items-center justify-center mx-auto mb-3">
              <Building2 className="w-6 h-6 text-ink-300" strokeWidth={1.5} />
            </div>
            <p className="text-ink-400 text-xs sm:text-sm font-medium">
              No properties found
              <br /><span className="hidden md:inline text-[11px] sm:text-[13px]">Try adjusting your filters</span>
            </p>
          </div>
        )}

        {filteredProperties.map((property, idx) => (
          <motion.div
            key={property._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * idx }}
            className="bg-card rounded-2xl border border-ink-100/60 shadow-soft overflow-hidden hover:shadow-elevated transition-all duration-300 group"
          >
            <div className="flex flex-col sm:flex-row">
              {/* Image */}
              <div className="w-full sm:w-40 lg:w-44 h-40 sm:h-36 shrink-0 overflow-hidden relative">
                <img
                  src={property.images?.[0] || "/placeholder.jpg"}
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {property.isSold && (
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-ink-900 text-white text-[11px] sm:text-[12px] font-semibold uppercase tracking-wider rounded-md shadow-soft">
                    Sold
                  </div>
                )}
                {property.featured && !property.isSold && (
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-sky text-white text-[11px] sm:text-[12px] font-semibold uppercase tracking-wider rounded-md shadow-soft">
                    Featured
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 p-3 md:p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-semibold text-foreground truncate group-hover:text-sky transition-colors">
                        {property.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-ink-500 mt-0.5">
                        {property.location}
                      </p>
                    </div>
                    <p className="text-base font-semibold text-foreground shrink-0 sm:text-lg">
                      Nu. {property.price?.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    <span className="text-[11px] sm:text-[13px] text-ink-500 font-medium bg-fog-light px-2 py-1 rounded-md">
                      {getTypeName(property.propertyType)}
                    </span>
                    <span className="text-[11px] sm:text-[13px] text-ink-500 font-medium bg-fog-light px-2 py-1 rounded-md">
                      {property.area} {getAreaLabel(property.propertyType)}
                    </span>
                    {property.loanAvailable && (
                      <span className="text-[11px] sm:text-[13px] text-sky font-medium bg-sky/10 px-2 py-1 rounded-md border border-sky/20">
                        Loan Available
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-ink-100 w-full">
                  <Link
                    href={`/admin/properties/${property._id}/edit`}
                    className="flex-1 h-9 px-4 rounded-full bg-sky text-white flex items-center justify-center gap-1.5 hover:bg-sky-hover transition-all duration-200 shadow-sm text-xs font-medium group/edit"
                  >
                    <Edit className="w-3.5 h-3.5 group-hover/edit:rotate-12 transition-transform" strokeWidth={1.5} />
                    <span className="font-medium">
                      Edit
                    </span>
                  </Link>
                  <Link
                    href={`/properties/${property._id}`}
                    className="h-9 w-9 rounded-lg bg-card border border-ink-200 flex items-center justify-center text-ink-400 hover:bg-ink-800 hover:text-white hover:border-ink-800 transition-all duration-200 shrink-0"
                  >
                    <Eye className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </Link>
                  <button
                    onClick={() => handleDelete(property._id)}
                    className="h-9 w-9 rounded-lg bg-card border border-ink-200 flex items-center justify-center text-ink-400 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200 shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
