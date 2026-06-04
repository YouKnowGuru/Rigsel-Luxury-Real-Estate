"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  Inbox,
  Search,
  Loader2,
  Trash2,
  ArrowLeft,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { SERVICE_TYPE_LABELS } from "@/lib/solution-labels";
import type {
  SolutionServiceType,
  SolutionInquiryStatus,
} from "@/lib/solution-types";

interface Inquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  serviceType: SolutionServiceType;
  projectTitle: string;
  budget: string;
  timeline: string;
  requirements: string;
  status: SolutionInquiryStatus;
  isRead: boolean;
  adminNotes: string;
  createdAt: string;
}

const STATUS_OPTIONS: { value: SolutionInquiryStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "in-review", label: "In review" },
  { value: "contacted", label: "Contacted" },
  { value: "closed", label: "Closed" },
];

export default function SolutionInquiriesAdminPage() {
  const { toast } = useToast();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<SolutionInquiryStatus | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const url = new URL("/api/admin/phojaa95-solutions/inquiries", window.location.origin);
      if (statusFilter !== "all") url.searchParams.set("status", statusFilter);
      const res = await fetch(url.toString());
      const data = await res.json();
      if (data.success) setInquiries(data.data);
    } catch {
      toast({ title: "Failed to load inquiries", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [statusFilter]);

  const updateInquiry = async (
    id: string,
    patch: { isRead?: boolean; status?: SolutionInquiryStatus; adminNotes?: string }
  ) => {
    const res = await fetch(`/api/admin/phojaa95-solutions/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    const data = await res.json();
    if (data.success) {
      setInquiries((prev) =>
        prev.map((q) => (q._id === id ? { ...q, ...data.data } : q))
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this client request?")) return;
    const res = await fetch(`/api/admin/phojaa95-solutions/inquiries/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (data.success) {
      setInquiries((prev) => prev.filter((q) => q._id !== id));
      toast({ title: "Deleted" });
    }
  };

  const filtered = inquiries.filter((q) => {
    const s = search.toLowerCase();
    return (
      !s ||
      q.name.toLowerCase().includes(s) ||
      q.email.toLowerCase().includes(s) ||
      q.projectTitle.toLowerCase().includes(s) ||
      q.requirements.toLowerCase().includes(s)
    );
  });

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">
      <Link
        href="/admin/phojaa95-solutions"
        className="inline-flex items-center gap-1 text-[13px] text-ink-500 hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to portfolio
      </Link>

      <h1 className="text-xl md:text-2xl font-semibold text-foreground flex items-center gap-2 mb-6">
        <Inbox className="w-6 h-6 text-sky" />
        Client project requests
      </h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
          <Input
            className="pl-10 rounded-xl"
            placeholder="Search requests…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as SolutionInquiryStatus | "all")
          }
          className="input-apple rounded-xl px-3 py-2 text-[13px]"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-sky" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-ink-500 py-16">No client requests yet.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((q) => (
            <div
              key={q._id}
              className={cn(
                "p-4 rounded-2xl border bg-card transition-colors",
                !q.isRead
                  ? "border-sky/30 bg-sky/[0.03]"
                  : "border-ink-100/60 dark:border-ink-700/40"
              )}
            >
              <button
                type="button"
                className="w-full text-left"
                onClick={() => {
                  setExpandedId(expandedId === q._id ? null : q._id);
                  if (!q.isRead) updateInquiry(q._id, { isRead: true });
                }}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-foreground">{q.name}</p>
                    <p className="text-[13px] text-ink-500">
                      {SERVICE_TYPE_LABELS[q.serviceType]}
                      {q.projectTitle ? ` · ${q.projectTitle}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-ink-400">
                    {!q.isRead && (
                      <span className="px-2 py-0.5 rounded-full bg-sky/15 text-sky font-medium">
                        New
                      </span>
                    )}
                    <Clock className="w-3 h-3" />
                    {format(new Date(q.createdAt), "MMM d, yyyy")}
                  </div>
                </div>
                <p className="text-[13px] text-ink-500 mt-2 line-clamp-2">{q.requirements}</p>
              </button>

              {expandedId === q._id && (
                <div className="mt-4 pt-4 border-t border-ink-100/60 space-y-3 text-[13px]">
                  <p>
                    <strong>Email:</strong>{" "}
                    <a href={`mailto:${q.email}`} className="text-sky">
                      {q.email}
                    </a>
                  </p>
                  <p>
                    <strong>Phone:</strong>{" "}
                    <a href={`tel:${q.phone}`} className="text-sky">
                      {q.phone}
                    </a>
                  </p>
                  {q.budget && (
                    <p>
                      <strong>Budget:</strong> {q.budget}
                    </p>
                  )}
                  {q.timeline && (
                    <p>
                      <strong>Timeline:</strong> {q.timeline}
                    </p>
                  )}
                  <p className="whitespace-pre-wrap text-ink-600">{q.requirements}</p>

                  <div className="flex flex-wrap gap-2 items-center">
                    <label className="text-[12px] font-medium text-ink-500">Status</label>
                    <select
                      value={q.status}
                      onChange={(e) =>
                        updateInquiry(q._id, {
                          status: e.target.value as SolutionInquiryStatus,
                        })
                      }
                      className="input-apple rounded-lg px-2 py-1 text-[12px]"
                    >
                      {STATUS_OPTIONS.filter((o) => o.value !== "all").map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => updateInquiry(q._id, { isRead: true })}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      Mark read
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-red-600"
                      onClick={() => handleDelete(q._id)}
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
