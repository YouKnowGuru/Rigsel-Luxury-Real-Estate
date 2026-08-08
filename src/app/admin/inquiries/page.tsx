"use client";

import { useState, useEffect } from "react";
import {
  MessageSquare,
  Search,
  Mail,
  Calendar,
  ChevronRight,
  Trash2,
  CheckCircle2,
  Clock,
  ArrowUpDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Inquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const { toast } = useToast();

  const fetchInquiries = async () => {
    try {
      setLoading(true);
        const res = await fetch("/api/contact", {
        
      });
      const data = await res.json();
      if (data.success) {
        setInquiries(data.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch inquiries",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch =
      inquiry.name.toLowerCase().includes(search.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(search.toLowerCase()) ||
      inquiry.subject.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "unread" && !inquiry.isRead) ||
      (filter === "read" && inquiry.isRead);

    return matchesSearch && matchesFilter;
  });

  const markAsRead = async (id: string) => {
    try {
        const res = await fetch(`/api/contact/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ isRead: true })
      });
      const data = await res.json();
      if (data.success) {
        setInquiries(prev => prev.map(inqu => inqu._id === id ? { ...inqu, isRead: true } : inqu));
      }
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this inquiry? This action cannot be undone.")) return;

    try {
        const res = await fetch(`/api/contact/${id}`, {
        method: "DELETE",
        headers: {
        }
      });
      const data = await res.json();
      if (data.success) {
        setInquiries(prev => prev.filter(inqu => inqu._id !== id));
        toast({
          title: "Success",
          description: "Inquiry deleted successfully",
        });
      } else {
        throw new Error(data.error || "Failed to delete inquiry");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete inquiry",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky/10 border border-sky/20 text-sky text-[12px] font-semibold uppercase tracking-[0.12em]">
            <MessageSquare className="w-3.5 h-3.5" strokeWidth={1.5} />
            Communications
          </div>
          <h1 className="text-[22px] sm:text-[26px] md:text-[28px] font-semibold text-foreground tracking-tight">
            Client Inquiries
          </h1>
          <p className="text-ink-400 text-sm sm:text-base md:text-lg font-medium">
            Manage your interactions with potential legacy seekers.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="bg-card p-1 rounded-[14px] border border-ink-100/60 shadow-soft flex">
            {(["all", "unread", "read"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={cn(
                  "px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all",
                  filter === t
                    ? "bg-foreground text-background shadow-sm"
                    : "text-ink-400 hover:text-foreground hover:bg-ink-50"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        {[
          { label: "Total Messages", value: inquiries.length, icon: MessageSquare, bgClass: "bg-sky/10", iconClass: "text-sky" },
          { label: "Unread", value: inquiries.filter(i => !i.isRead).length, icon: Clock, bgClass: "bg-muted", iconClass: "text-ink-400" },
          { label: "Responded", value: inquiries.filter(i => i.isRead).length, icon: CheckCircle2, bgClass: "bg-emerald-500/10", iconClass: "text-emerald-500" }
        ].map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label}
            className="admin-glass p-4 sm:p-6 rounded-[20px] flex items-center justify-between"
          >
            <div>
              <p className="text-[11px] sm:text-[13px] font-semibold text-ink-400 uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="text-2xl sm:text-3xl font-semibold text-foreground">{stat.value}</p>
            </div>
            <div className={cn("w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center", stat.bgClass)}>
              <stat.icon className={cn("w-5 h-5 sm:w-6 sm:h-6", stat.iconClass)} strokeWidth={1.5} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search and Table */}
      <div className="admin-glass rounded-[20px] overflow-hidden">
        <div className="p-6 border-b border-ink-100/60 bg-card/50 backdrop-blur-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-300" strokeWidth={1.5} />
            <Input
              placeholder="Search by name, email or subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 h-11 rounded-2xl border-ink-200 focus:border-sky focus:ring-[3px] focus:ring-sky/15 text-base"
            />
          </div>
          <Button
            variant="outline"
            onClick={fetchInquiries}
            className="h-11 border-ink-200 rounded-[14px] hover:bg-ink-50 flex gap-2 font-semibold uppercase tracking-wider text-xs"
          >
            <ArrowUpDown className="w-4 h-4" strokeWidth={1.5} />
            Refresh List
          </Button>
        </div>

        <div className="overflow-x-auto -mx-4 md:mx-0">
          <table className="w-full min-w-[640px]">
            <thead className="bg-muted border-b border-ink-100/60">
              <tr>
                <th className="px-4 md:px-6 lg:px-8 py-4 md:py-5 text-left text-[11px] sm:text-[13px] font-semibold text-ink-400 uppercase tracking-wider">Contact</th>
                <th className="px-4 md:px-6 lg:px-8 py-4 md:py-5 text-left text-[11px] sm:text-[13px] font-semibold text-ink-400 uppercase tracking-wider">Subject & Message</th>
                <th className="px-4 md:px-6 lg:px-8 py-4 md:py-5 text-left text-[11px] sm:text-[13px] font-semibold text-ink-400 uppercase tracking-wider">Date</th>
                <th className="px-4 md:px-6 lg:px-8 py-4 md:py-5 text-left text-[11px] sm:text-[13px] font-semibold text-ink-400 uppercase tracking-wider">Status</th>
                <th className="px-4 md:px-6 lg:px-8 py-4 md:py-5 text-right text-[11px] sm:text-[13px] font-semibold text-ink-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-50">
              <AnimatePresence mode="popLayout">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-4 md:px-8 py-10 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-2 border-sky/20 border-t-sky rounded-full animate-spin" />
                        <p className="text-ink-400 text-sm">Loading inquiries...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredInquiries.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 md:px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-muted rounded-3xl flex items-center justify-center text-ink-300">
                          <Mail className="w-8 h-8" strokeWidth={1.5} />
                        </div>
                        <p className="text-ink-400 text-base sm:text-xl font-light">No inquiries found matching your search.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredInquiries.map((inquiry) => (
                    <motion.tr
                      key={inquiry._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={cn(
                        "group transition-all duration-300 hover:bg-card/50",
                        !inquiry.isRead ? "bg-sky/[0.02]" : ""
                      )}
                    >
                      <td className="px-4 md:px-6 lg:px-8 py-4 md:py-6">
                        <div className="flex items-center gap-3 md:gap-4">
                          <div className={cn(
                            "w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-base sm:text-lg font-semibold shadow-sm transition-all duration-500",
                            !inquiry.isRead
                              ? "bg-sky text-white shadow-sky/20"
                              : "bg-ink-100 text-ink-400"
                          )}>
                            {inquiry.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <h4 className={cn("font-semibold text-sm sm:text-base tracking-tight truncate", inquiry.isRead ? "text-ink-700" : "text-foreground")}>
                              {inquiry.name}
                            </h4>
                            <div className="flex items-center gap-2 text-[11px] sm:text-[13px] font-medium uppercase tracking-wider text-ink-400">
                              <Mail className="w-3.5 h-3.5" strokeWidth={1.5} />
                              <span className="truncate">{inquiry.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 lg:px-8 py-4 md:py-6 max-w-[200px] md:max-w-md">
                        <div className="space-y-1">
                          <p className={cn("font-semibold text-sm tracking-tight truncate", inquiry.isRead ? "text-ink-600" : "text-foreground")}>
                            {inquiry.subject}
                          </p>
                          <p className="text-ink-400 text-xs sm:text-sm line-clamp-1">
                            {inquiry.message}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 lg:px-8 py-4 md:py-6">
                        <div className="flex flex-col text-[11px] sm:text-[13px] font-medium uppercase tracking-wider text-ink-400">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5" strokeWidth={1.5} />
                            {format(new Date(inquiry.createdAt), "MMM d, yyyy")}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
                            {format(new Date(inquiry.createdAt), "h:mm a")}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 lg:px-8 py-4 md:py-6">
                        {inquiry.isRead ? (
                          <span className="inline-flex items-center gap-1.5 px-2 sm:px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] sm:text-[12px] font-semibold uppercase tracking-wider border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" strokeWidth={1.5} />
                            <span className="hidden sm:inline">Responded</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 sm:px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 text-[10px] sm:text-[12px] font-semibold uppercase tracking-wider border border-orange-500/20 animate-pulse">
                            <Mail className="w-3 h-3" strokeWidth={1.5} />
                            <span className="hidden sm:inline">New</span>
                          </span>
                        )}
                      </td>
                      <td className="px-4 md:px-6 lg:px-8 py-4 md:py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/inquiries/${inquiry._id}`}
                            onClick={() => !inquiry.isRead && markAsRead(inquiry._id)}
                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-muted text-ink-400 hover:bg-sky hover:text-background transition-all duration-300 shadow-sm"
                          >
                            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />
                          </Link>
                          <button
                            onClick={() => handleDelete(inquiry._id)}
                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-background transition-all duration-300 shadow-sm"
                            title="Delete Inquiry"
                          >
                            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
