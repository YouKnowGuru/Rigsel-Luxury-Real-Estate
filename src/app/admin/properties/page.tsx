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

  const filteredProperties = properties.filter(
    (property) => {
      const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === "all" || property.propertyType === selectedType;
      return matchesSearch && matchesType;
    }
  );

  const getAreaLabel = (typeSlug: string) => {
    const type = propertyTypes.find(t => t.slug === typeSlug);
    if (!type || !type.areaLabel) return "m²";
    // extract unit from label like "Area (m²)" -> "m²"
    const match = type.areaLabel.match(/\(([^)]+)\)/);
    return match ? match[1] : type.areaLabel;
  };

  const getTypeName = (slug: string) => {
    return propertyTypes.find(t => t.slug === slug)?.name || slug;
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
            <p className="text-bhutan-red font-bold text-xs uppercase tracking-[0.3em]">Inventory</p>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-bhutan-dark leading-tight"
          >
            Property <span className="text-bhutan-gold italic font-light">Listings</span>
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
          {propertyTypes.map(t => (
            <option key={t._id} value={t.slug}>{t.name}</option>
          ))}
        </select>
        <button className="h-12 md:h-14 px-6 bg-white rounded-xl border border-white shadow-luxury text-bhutan-dark/40 hover:text-bhutan-red transition-all flex items-center gap-2.5 hover:border-bhutan-red/10 w-full md:w-auto justify-center group shrink-0">
          <Filter className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
          <span className="text-xs font-bold uppercase tracking-wider">Refine</span>
        </button>
      </div>

      {/* Main Table Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2rem] shadow-luxury border border-white overflow-hidden relative z-10"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F9F7F2]/50 border-b border-bhutan-gold/5">
                <th className="px-6 py-4 text-left text-sm font-bold text-bhutan-dark/40 uppercase tracking-widest border-b border-bhutan-gold/5">
                  Asset Details
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-bhutan-dark/40 uppercase tracking-widest border-b border-bhutan-gold/5">
                  Dzongkhag
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-bhutan-dark/40 uppercase tracking-widest border-b border-bhutan-gold/5">
                  Investment Value
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-bhutan-dark/40 uppercase tracking-widest border-b border-bhutan-gold/5">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-sm font-bold text-bhutan-dark/40 uppercase tracking-widest border-b border-bhutan-gold/5">
                  Protocol
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bhutan-gold/5">
              {filteredProperties.map((property, idx) => (
                <motion.tr
                  key={property._id}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * idx }}
                  className="hover:bg-[#F9F7F2]/30 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg border border-white group-hover:scale-105 transition-transform duration-500 shrink-0">
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-base font-bold text-bhutan-dark truncate leading-tight group-hover:text-bhutan-red transition-colors">
                          {property.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-bhutan-dark/30 font-bold uppercase tracking-wider bg-[#F9F7F2] px-2 py-0.5 rounded">
                            {getTypeName(property.propertyType)}
                          </span>
                          <span className="text-xs text-bhutan-dark/30 font-bold uppercase tracking-wider">
                            {property.area} {getAreaLabel(property.propertyType)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm italic text-bhutan-dark/60">
                    {property.location}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-base font-bold text-bhutan-dark">
                      Nu. {property.price?.toLocaleString()}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider border transition-all",
                        property.featured
                          ? "bg-bhutan-red text-white border-bhutan-red/5 shadow-md shadow-bhutan-red/5"
                          : "bg-white text-bhutan-dark/30 border-black/5"
                      )}
                    >
                      {property.featured ? "Featured" : "Active"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/properties/${property._id}`}>
                        <button className="w-9 h-9 rounded-lg bg-white border border-black/5 flex items-center justify-center text-bhutan-dark/20 hover:bg-bhutan-dark hover:text-white transition-all duration-300 shadow-sm">
                          <Eye className="w-4 h-4" />
                        </button>
                      </Link>
                      <Link href={`/admin/properties/${property._id}/edit`}>
                        <button className="w-9 h-9 rounded-lg bg-white border border-black/5 flex items-center justify-center text-bhutan-gold/30 hover:bg-bhutan-gold hover:text-white transition-all duration-300 shadow-sm">
                          <Edit className="w-4 h-4" />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(property._id)}
                        className="w-9 h-9 rounded-lg bg-white border border-black/5 flex items-center justify-center text-bhutan-red/30 hover:bg-bhutan-red hover:text-white transition-all duration-300 shadow-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-[#F9F7F2] rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-bhutan-dark/5" />
            </div>
            <p className="text-bhutan-dark/20 text-[8px] font-bold uppercase tracking-[0.3em]">No Assets Found</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
