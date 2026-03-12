"use client";

import { useState, useEffect } from "react";
import {
  MessageSquare,
  Search,
  Filter,
  Mail,
  Phone,
  Calendar,
  ChevronRight,
  Trash2,
  CheckCircle2,
  Clock,
  User,
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
      const token = localStorage.getItem("adminToken");
      const res = await fetch("/api/contact", {
        headers: { Authorization: `Bearer ${token}` }
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
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`/api/contact/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
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
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`/api/contact/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
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
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 min-h-screen bg-[#F9F7F2]/50">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-bhutan-red/10 border border-bhutan-red/20 text-bhutan-red text-xs font-bold uppercase tracking-widest">
            <MessageSquare className="w-3.5 h-3.5" />
            Communications
          </div>
          <h1 className="text-4xl font-bold text-bhutan-dark tracking-tight">
            Client <span className="text-bhutan-red italic font-light">Inquiries</span>
          </h1>
          <p className="text-bhutan-dark/70 text-lg font-bold italic">
            Manage your interactions with potential legacy seekers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white p-1 rounded-xl shadow-sm border border-bhutan-gold/10 flex">
            {(["all", "unread", "read"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={cn(
                  "px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all",
                  filter === t
                    ? "bg-bhutan-dark text-white shadow-md shadow-bhutan-dark/20"
                    : "text-bhutan-dark/40 hover:text-bhutan-dark hover:bg-bhutan-gold/5"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Messages", value: inquiries.length, icon: MessageSquare, color: "bhutan-red" },
          { label: "Unread", value: inquiries.filter(i => !i.isRead).length, icon: Clock, color: "bhutan-gold" },
          { label: "Responded", value: inquiries.filter(i => i.isRead).length, icon: CheckCircle2, color: "emerald-500" }
        ].map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label}
            className="bg-white p-6 rounded-[2rem] shadow-xl border border-bhutan-gold/10 flex items-center justify-between"
          >
            <div>
              <p className="text-bhutan-dark/60 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-bhutan-dark">{stat.value}</p>
            </div>
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center bg-opacity-10", `bg-${stat.color}`)}>
              <stat.icon className={cn("w-6 h-6", `text-${stat.color}`)} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search and Table */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-bhutan-gold/10 overflow-hidden">
        <div className="p-6 border-b border-bhutan-gold/10 bg-white/50 backdrop-blur-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-bhutan-dark/30" />
            <Input
              placeholder="Search by name, email or subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 h-12 rounded-xl bg-[#F9F7F2]/50 border-bhutan-gold/20 focus:border-bhutan-red focus:ring-bhutan-red/5 font-serif italic text-base"
            />
          </div>
          <Button
            variant="outline"
            onClick={fetchInquiries}
            className="h-12 border-bhutan-gold/20 rounded-xl hover:bg-bhutan-gold/5 flex gap-2 font-bold uppercase tracking-widest text-[10px]"
          >
            <ArrowUpDown className="w-4 h-4" />
            Refresh List
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F9F7F2]/50 border-b border-bhutan-gold/10">
              <tr>
                <th className="px-8 py-5 text-left text-xs font-bold text-bhutan-dark/70 uppercase tracking-[0.2em]">Contact</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-bhutan-dark/70 uppercase tracking-[0.2em]">Subject & Message</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-bhutan-dark/70 uppercase tracking-[0.2em]">Date</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-bhutan-dark/70 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-right text-xs font-bold text-bhutan-dark/70 uppercase tracking-[0.2em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bhutan-gold/5">
              <AnimatePresence mode="popLayout">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-10 text-center animate-pulse text-bhutan-dark/30 italic text-lg">
                      Loading legacy communications...
                    </td>
                  </tr>
                ) : filteredInquiries.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-[#F9F7F2] rounded-3xl flex items-center justify-center text-bhutan-dark/20">
                          <Mail className="w-8 h-8" />
                        </div>
                        <p className="text-bhutan-dark/40 italic text-xl font-light">No inquiries found matching your search.</p>
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
                        "group transition-all duration-300 hover:bg-[#F9F7F2]/30",
                        !inquiry.isRead ? "bg-bhutan-red/[0.02]" : ""
                      )}
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold shadow-sm transition-all duration-500",
                            !inquiry.isRead
                              ? "bg-bhutan-red text-white shadow-bhutan-red/20"
                              : "bg-bhutan-dark/5 text-bhutan-dark/40"
                          )}>
                            {inquiry.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className={cn("font-bold text-base tracking-tight", inquiry.isRead ? "text-bhutan-dark/70" : "text-bhutan-dark")}>
                              {inquiry.name}
                            </h4>
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-bhutan-dark/60">
                              <Mail className="w-3.5 h-3.5" />
                              {inquiry.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 max-w-md">
                        <div className="space-y-1">
                          <p className={cn("font-bold text-sm tracking-tight truncate", inquiry.isRead ? "text-bhutan-dark/60" : "text-bhutan-dark")}>
                            {inquiry.subject}
                          </p>
                          <p className="text-bhutan-dark/40 text-xs italic line-clamp-1 font-serif">
                            {inquiry.message}
                          </p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col text-xs font-bold uppercase tracking-widest text-bhutan-dark/60 font-serif">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5" />
                            {format(new Date(inquiry.createdAt), "MMM d, yyyy")}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="w-3.5 h-3.5" />
                            {format(new Date(inquiry.createdAt), "h:mm a")}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        {inquiry.isRead ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[9px] font-bold uppercase tracking-widest border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" />
                            Responded
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 text-[9px] font-bold uppercase tracking-widest border border-orange-500/20 animate-pulse">
                            <Mail className="w-3 h-3" />
                            New
                          </span>
                        )}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/inquiries/${inquiry._id}`}
                            onClick={() => !inquiry.isRead && markAsRead(inquiry._id)}
                            className="w-10 h-10 rounded-xl flex items-center justify-center bg-bhutan-dark/5 text-bhutan-dark/40 hover:bg-bhutan-red hover:text-white transition-all duration-300 shadow-sm"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(inquiry._id)}
                            className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm"
                            title="Delete Inquiry"
                          >
                            <Trash2 className="w-5 h-5" />
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
