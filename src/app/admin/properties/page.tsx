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
import { formatPrice } from "@/lib/utils";
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
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin");
    } else {
      fetchProperties();
      fetchPropertyTypes();
    }
  }, [router]);

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
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      if (response.ok) {
        toast({
          title: "Property Deleted",
          description: "The property has been deleted successfully",
        });
        fetchProperties();
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
    if (!type || !type.areaLabel) return "m²";
    const match = type.areaLabel.match(/\(([^)]+)\)/);
    return match ? match[1] : type.areaLabel;
  };

  const getTypeName = (slug: string) => {
    return propertyTypes.find((t) => t.slug === slug)?.name || slug;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-bhutan-red border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 lg:p-10 max-w-[1500px] mx-auto min-h-screen">
      <div className="fixed inset-0 bg-thangka opacity-[0.015] pointer-events-none" />

      {/* Header */}
      <header className="mb-6 md:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div>
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 mb-2"
          >
            <div className="w-0.5 h-6 bg-bhutan-red rounded-full" />
            <p className="text-bhutan-red font-bold text-xs uppercase tracking-[0.3em]">
              Inventory
            </p>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-bhutan-dark leading-tight"
          >
            Property{" "}
            <span className="text-bhutan-gold italic font-light">Listings</span>
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Link href="/admin/properties/new">
            <button className="h-12 md:h-14 px-6 bg-bhutan-red text-white text-[9px] font-bold uppercase tracking-[0.3em] rounded-xl hover:bg-bhutan-dark transition-all duration-500 shadow-xl shadow-bhutan-red/10 flex items-center gap-3 group">
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              Add Property
            </button>
          </Link>
        </motion.div>
      </header>

      {/* Filters & Search */}
      <div className="mb-8 flex flex-col md:flex-row gap-4 items-center relative z-10">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-bhutan-dark/30 group-focus-within:text-bhutan-red transition-colors" />
          <Input
            placeholder="Search by title or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-12 md:h-14 pl-12 rounded-xl bg-white border-white shadow-luxury focus:ring-bhutan-red/10 text-base"
          />
        </div>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="h-12 md:h-14 px-5 bg-white rounded-xl border border-white shadow-luxury text-sm font-bold uppercase tracking-wider text-bhutan-dark/60 focus:outline-none focus:ring-2 focus:ring-bhutan-red/10 appearance-none cursor-pointer min-w-[180px]"
        >
          <option value="all">All Property Types</option>
          {propertyTypes.map((t) => (
            <option key={t._id} value={t.slug}>
              {t.name}
            </option>
          ))}
        </select>
        <button className="h-12 md:h-14 px-6 bg-white rounded-xl border border-white shadow-luxury text-bhutan-dark/40 hover:text-bhutan-red transition-all flex items-center gap-2.5 hover:border-bhutan-red/10 w-full md:w-auto justify-center group shrink-0">
          <Filter className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Refine
          </span>
        </button>
      </div>

      {/* Property Cards */}
      <div className="space-y-4 relative z-10">
        {filteredProperties.length === 0 && (
          <div className="text-center py-20 bg-white/80 backdrop-blur-xl rounded-2xl shadow-luxury border border-white">
            <div className="w-16 h-16 bg-[#F9F7F2] rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-bhutan-dark/10" />
            </div>
            <p className="text-bhutan-dark/20 text-xs font-bold uppercase tracking-[0.3em]">
              No Assets Found
            </p>
          </div>
        )}

        {filteredProperties.map((property, idx) => (
          <motion.div
            key={property._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * idx }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-luxury border border-white overflow-hidden hover:shadow-xl transition-all duration-500 group"
          >
            <div className="flex flex-col md:flex-row">
              {/* Image */}
              <div className="w-full md:w-48 h-40 md:h-auto shrink-0 overflow-hidden relative">
                <img
                  src={property.images?.[0] || "/placeholder.jpg"}
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {property.isSold && (
                  <div className="absolute top-3 left-3 px-3 py-1 bg-bhutan-dark text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg">
                    Sold
                  </div>
                )}
                {property.featured && !property.isSold && (
                  <div className="absolute top-3 left-3 px-3 py-1 bg-bhutan-red text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg">
                    Featured
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 p-5 md:p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-bold text-bhutan-dark truncate group-hover:text-bhutan-red transition-colors">
                        {property.title}
                      </h3>
                      <p className="text-sm italic text-bhutan-dark/50 mt-0.5">
                        {property.location}
                      </p>
                    </div>
                    <p className="text-lg font-bold text-bhutan-dark shrink-0">
                      Nu. {property.price?.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="text-xs text-bhutan-dark/40 font-bold uppercase tracking-wider bg-[#F9F7F2] px-2 py-1 rounded-md">
                      {getTypeName(property.propertyType)}
                    </span>
                    <span className="text-xs text-bhutan-dark/40 font-bold uppercase tracking-wider bg-[#F9F7F2] px-2 py-1 rounded-md">
                      {property.area} {getAreaLabel(property.propertyType)}
                    </span>
                    {property.loanAvailable && (
                      <span className="text-xs text-bhutan-gold font-bold uppercase tracking-wider bg-bhutan-gold/10 px-2 py-1 rounded-md border border-bhutan-gold/20">
                        Loan Available
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-bhutan-gold/10">
                  <Link
                    href={`/admin/properties/${property._id}/edit`}
                    className="flex-1"
                  >
                    <button className="w-full h-11 px-5 rounded-xl bg-bhutan-gold text-white flex items-center justify-center gap-2 hover:bg-bhutan-dark transition-all duration-300 shadow-lg shadow-bhutan-gold/20 group/edit">
                      <Edit className="w-4 h-4 group-hover/edit:rotate-12 transition-transform" />
                      <span className="text-xs font-black uppercase tracking-widest">
                        Edit Property
                      </span>
                    </button>
                  </Link>
                  <Link href={`/properties/${property._id}`}>
                    <button className="h-11 w-11 rounded-xl bg-white border border-black/10 flex items-center justify-center text-bhutan-dark/40 hover:bg-bhutan-dark hover:text-white transition-all duration-300">
                      <Eye className="w-4 h-4" />
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(property._id)}
                    className="h-11 w-11 rounded-xl bg-white border border-black/10 flex items-center justify-center text-bhutan-red/40 hover:bg-bhutan-red hover:text-white transition-all duration-300"
                  >
                    <Trash2 className="w-4 h-4" />
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
