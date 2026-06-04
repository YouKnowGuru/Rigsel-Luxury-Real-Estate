"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Code2,
  Plus,
  Loader2,
  Pin,
  Eye,
  EyeOff,
  Trash2,
  Pencil,
  Star,
  Search,
  Inbox,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { SERVICE_TYPE_LABELS } from "@/lib/solution-labels";
import type { SolutionServiceType } from "@/lib/solution-types";

interface Project {
  _id: string;
  title: string;
  summary: string;
  serviceType: SolutionServiceType;
  coverImage?: string;
  isPinned: boolean;
  isFeatured: boolean;
  isPublished: boolean;
  viewCount: number;
  slug: string;
}

export default function AdminPhojaa95SolutionsPage() {
  const { toast } = useToast();
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [unreadInquiries, setUnreadInquiries] = useState(0);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const [projRes, inqRes] = await Promise.all([
        fetch("/api/admin/phojaa95-solutions"),
        fetch("/api/admin/phojaa95-solutions/inquiries"),
      ]);
      const projData = await projRes.json();
      const inqData = await inqRes.json();
      if (projData.success) setItems(projData.data);
      if (inqData.success) setUnreadInquiries(inqData.unreadCount ?? 0);
    } catch {
      toast({ title: "Failed to load projects", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    const res = await fetch(`/api/admin/phojaa95-solutions/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      setItems((prev) => prev.filter((i) => i._id !== id));
      toast({ title: "Deleted" });
    }
  };

  const toggle = async (
    id: string,
    field: "isPublished" | "isFeatured" | "isPinned",
    val: boolean
  ) => {
    const res = await fetch(`/api/admin/phojaa95-solutions/${id}`, {
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
      SERVICE_TYPE_LABELS[i.serviceType].toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="min-w-0">
          <p className="text-sky text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.12em] mb-1">
            Phojaa95 Solutions
          </p>
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground flex items-center gap-2">
            <Code2 className="w-5 h-5 sm:w-6 sm:h-6 text-sky shrink-0" strokeWidth={1.5} />
            <span className="truncate">Development portfolio</span>
          </h1>
        </div>
        <div className="flex flex-wrap gap-2 self-start sm:self-auto">
          <Link href="/admin/phojaa95-solutions/inquiries">
            <Button variant="outline" className="relative h-9 sm:h-10 px-3 sm:px-4 text-xs sm:text-sm">
              <Inbox className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Client requests</span>
              <span className="sm:hidden">Requests</span>
              {unreadInquiries > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                  {unreadInquiries}
                </span>
              )}
            </Button>
          </Link>
          <Link href="/admin/phojaa95-solutions/new">
            <Button className="h-9 sm:h-10 px-3 sm:px-4 text-xs sm:text-sm">
              <Plus className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">New project</span>
              <span className="sm:hidden">New</span>
            </Button>
          </Link>
        </div>
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
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-sky" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-ink-500 py-16">No development projects yet.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((item, i) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-card border border-ink-100/60 dark:border-ink-700/40 rounded-2xl"
            >
              <div className="relative w-20 h-14 sm:w-32 sm:h-20 rounded-xl overflow-hidden bg-fog shrink-0">
                {item.coverImage ? (
                  <Image src={item.coverImage} alt="" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-ink-300">
                    <Code2 className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                  <h2 className="font-semibold text-foreground text-sm sm:text-base truncate">{item.title}</h2>
                  <span className="text-[10px] sm:text-[11px] px-1.5 sm:px-2 py-0.5 rounded-full bg-sky/10 text-sky border border-sky/20">
                    {SERVICE_TYPE_LABELS[item.serviceType]}
                  </span>
                  {item.isFeatured && (
                    <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-bhutan-gold fill-bhutan-gold" />
                  )}
                  {item.isPinned && <Pin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-ink-400" />}
                </div>
                <p className="text-xs sm:text-[13px] text-ink-500 line-clamp-1">{item.summary}</p>
                <p className="text-[10px] sm:text-[11px] text-ink-400 mt-1">
                  {item.viewCount} views · /phojaa95-solutions/{item.slug}
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
                <Link href={`/admin/phojaa95-solutions/${item._id}/edit`}>
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
