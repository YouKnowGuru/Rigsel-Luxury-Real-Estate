"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Box,
  Plus,
  Loader2,
  Pin,
  Eye,
  EyeOff,
  Trash2,
  Pencil,
  Star,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

interface Design {
  _id: string;
  title: string;
  summary: string;
  category: string;
  coverImage?: string;
  isPinned: boolean;
  isFeatured: boolean;
  isPublished: boolean;
  viewCount: number;
  slug: string;
}

export default function AdminArchitectureDesignPage() {
  const { toast } = useToast();
  const [items, setItems] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/architecture-design");
      const data = await res.json();
      if (data.success) setItems(data.data);
    } catch {
      toast({ title: "Failed to load designs", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this 360° design?")) return;
    const res = await fetch(`/api/admin/architecture-design/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (data.success) {
      setItems((prev) => prev.filter((i) => i._id !== id));
      toast({ title: "Deleted" });
    }
  };

  const toggle = async (id: string, field: "isPublished" | "isFeatured" | "isPinned", val: boolean) => {
    const res = await fetch(`/api/admin/architecture-design/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: !val }),
    });
    const data = await res.json();
    if (data.success) {
      setItems((prev) =>
        prev.map((i) => (i._id === id ? { ...i, [field]: !val } : i))
      );
    }
  };

  const filtered = items.filter(
    (i) =>
      !search.trim() ||
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="min-w-0">
          <p className="text-sky text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.12em] mb-1">
            360° Tours
          </p>
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground flex items-center gap-2">
            <Box className="w-5 h-5 sm:w-6 sm:h-6 text-sky shrink-0" strokeWidth={1.5} />
            <span className="truncate">Architecture design</span>
          </h1>
        </div>
        <Link href="/admin/architecture-design/new" className="self-start sm:self-auto">
          <Button className="h-9 sm:h-10 px-3 sm:px-4 text-xs sm:text-sm">
            <Plus className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">New 360° project</span>
            <span className="sm:hidden">New</span>
          </Button>
        </Link>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
        <Input
          className="pl-10 rounded-xl h-10 sm:h-11"
          placeholder="Search projects…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="admin-glass rounded-[20px] py-20 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-sky" strokeWidth={1.5} />
          <p className="text-ink-400 text-[13px] font-medium">Loading designs...</p>
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-ink-500 py-16">No architecture designs yet.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((item, i) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex gap-3 sm:gap-4 p-3 sm:p-4 admin-glass-subtle rounded-2xl"
            >
              <div className="relative w-20 h-14 sm:w-32 sm:h-20 rounded-xl overflow-hidden bg-fog shrink-0">
                {item.coverImage ? (
                  <Image src={item.coverImage} alt="" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-ink-300">
                    <Box className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                  <h2 className="font-semibold text-foreground text-sm sm:text-base truncate">{item.title}</h2>
                  <span className="text-[10px] sm:text-[11px] px-1.5 sm:px-2 py-0.5 rounded-full bg-sky/10 text-sky border border-sky/20">
                    {item.category}
                  </span>
                  {item.isFeatured && (
                    <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-bhutan-gold fill-bhutan-gold" />
                  )}
                  {item.isPinned && <Pin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-ink-400" />}
                </div>
                <p className="text-xs sm:text-[13px] text-ink-500 line-clamp-1">{item.summary}</p>
                <p className="text-[10px] sm:text-[11px] text-ink-400 mt-1">
                  {item.viewCount} views · /architecture-design/{item.slug}
                </p>
              </div>
              <div className="flex flex-row sm:flex-col gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => toggle(item._id, "isPublished", item.isPublished)}
                  className="p-2 rounded-lg hover:bg-fog text-ink-500"
                  title="Toggle publish"
                >
                  {item.isPublished ? (
                    <Eye className="w-4 h-4 text-emerald" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
                <Link href={`/admin/architecture-design/${item._id}/edit`}>
                  <span className="p-2 rounded-lg hover:bg-fog text-ink-500 inline-flex">
                    <Pencil className="w-4 h-4" />
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(item._id)}
                  className="p-2 rounded-lg hover:bg-red-50 text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
