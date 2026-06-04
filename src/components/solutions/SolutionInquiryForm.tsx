"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Send, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  SOLUTION_SERVICE_TYPES,
  type SolutionServiceType,
} from "@/lib/solution-types";
import {
  SERVICE_TYPE_LABELS,
  SERVICE_TYPE_DESCRIPTIONS,
} from "@/lib/solution-labels";

type Props = {
  defaultServiceType?: SolutionServiceType;
  className?: string;
};

export function SolutionInquiryForm({
  defaultServiceType = "web-development",
  className,
}: Props) {
  const { toast } = useToast();
  const shouldReduceMotion = useReducedMotion();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    serviceType: defaultServiceType,
    projectTitle: "",
    budget: "",
    timeline: "",
    requirements: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.requirements.trim().length < 20) {
      toast({
        title: "Tell us more",
        description: "Please describe your project in at least 20 characters.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/phojaa95-solutions/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        toast({
          title: "Could not send",
          description: data.error || "Please try again later.",
          variant: "destructive",
        });
      }
    } catch {
      toast({ title: "Network error", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "rounded-apple-xl p-8 sm:p-10 bg-emerald/5 border border-emerald/20 text-center",
          className
        )}
      >
        <CheckCircle className="w-12 h-12 text-emerald mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">Request received</h3>
        <p className="text-[15px] text-ink-500 max-w-md mx-auto">
          Thank you. Our Phojaa95 Solutions team will review your project brief and get back to you
          soon.
        </p>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "rounded-apple-xl p-6 sm:p-8 bg-fog/80 dark:bg-ink-800/40 border border-ink-100/60 dark:border-ink-700/30 space-y-5",
        className
      )}
    >
      <div>
        <h3 className="text-lg font-semibold text-foreground tracking-tight">
          Tell us what you need
        </h3>
        <p className="text-[14px] text-ink-500 mt-1">
          Website, mobile app, or custom software — describe your vision and we&apos;ll respond.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        {SOLUTION_SERVICE_TYPES.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setForm((p) => ({ ...p, serviceType: type }))}
            className={cn(
              "p-4 rounded-xl border text-left transition-all no-tap",
              form.serviceType === type
                ? "border-sky bg-sky/10 ring-1 ring-sky/30"
                : "border-ink-100/80 hover:border-ink-200 dark:border-ink-700/50"
            )}
          >
            <p className="text-[13px] font-semibold text-foreground">
              {SERVICE_TYPE_LABELS[type]}
            </p>
            <p className="text-[11px] text-ink-500 mt-1 line-clamp-2">
              {SERVICE_TYPE_DESCRIPTIONS[type]}
            </p>
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[12px] font-medium text-ink-500 uppercase tracking-wide">
            Your name
          </label>
          <input
            required
            className="input-apple w-full mt-1"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          />
        </div>
        <div>
          <label className="text-[12px] font-medium text-ink-500 uppercase tracking-wide">
            Phone
          </label>
          <input
            required
            className="input-apple w-full mt-1"
            value={form.phone}
            onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
          />
        </div>
      </div>

      <div>
        <label className="text-[12px] font-medium text-ink-500 uppercase tracking-wide">
          Email
        </label>
        <input
          type="email"
          required
          className="input-apple w-full mt-1"
          value={form.email}
          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[12px] font-medium text-ink-500 uppercase tracking-wide">
            Project name (optional)
          </label>
          <input
            className="input-apple w-full mt-1"
            placeholder="e.g. Hotel booking app"
            value={form.projectTitle}
            onChange={(e) => setForm((p) => ({ ...p, projectTitle: e.target.value }))}
          />
        </div>
        <div>
          <label className="text-[12px] font-medium text-ink-500 uppercase tracking-wide">
            Budget (optional)
          </label>
          <input
            className="input-apple w-full mt-1"
            placeholder="e.g. Nu. 500,000 – 1M"
            value={form.budget}
            onChange={(e) => setForm((p) => ({ ...p, budget: e.target.value }))}
          />
        </div>
      </div>

      <div>
        <label className="text-[12px] font-medium text-ink-500 uppercase tracking-wide">
          Timeline (optional)
        </label>
        <input
          className="input-apple w-full mt-1"
          placeholder="e.g. 3 months"
          value={form.timeline}
          onChange={(e) => setForm((p) => ({ ...p, timeline: e.target.value }))}
        />
      </div>

      <div>
        <label className="text-[12px] font-medium text-ink-500 uppercase tracking-wide">
          What do you want built?
        </label>
        <textarea
          required
          rows={5}
          className="input-apple w-full mt-1 min-h-[120px]"
          placeholder="Features, platforms, integrations, design preferences…"
          value={form.requirements}
          onChange={(e) => setForm((p) => ({ ...p, requirements: e.target.value }))}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[44px]"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
        Submit project request
      </button>
    </form>
  );
}
