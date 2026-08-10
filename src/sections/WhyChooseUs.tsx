"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  Shield,
  Award,
  Users,
  Clock,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { SectionHeader } from "@/components/layout/SectionHeader";

const features = [
  {
    icon: Shield,
    title: "100% verified.",
    description:
      "Every property is independently checked by our team — title, location, condition.",
    iconBg: "from-sky/20 to-sky/5",
    iconColor: "text-sky",
    accent: "hover:border-sky/30",
  },
  {
    icon: Award,
    title: "Curated listings.",
    description:
      "We only feature the finest houses, apartments, and land across Bhutan.",
    iconBg: "from-bhutan-gold/20 to-bhutan-gold/5",
    iconColor: "text-bhutan-gold",
    accent: "hover:border-bhutan-gold/30",
  },
  {
    icon: Users,
    title: "Personal guidance.",
    description:
      "A dedicated specialist walks you through every step, from search to signing.",
    iconBg: "from-violet-500/20 to-violet-500/5",
    iconColor: "text-violet-400",
    accent: "hover:border-violet-400/30",
  },
  {
    icon: Clock,
    title: "Fast response.",
    description:
      "Most inquiries answered within a few hours, by a real human being.",
    iconBg: "from-emerald/20 to-emerald/5",
    iconColor: "text-emerald",
    accent: "hover:border-emerald/30",
  },
  {
    icon: MapPin,
    title: "Deep local knowledge.",
    description: "We know every corner of Bhutan — and which one suits you.",
    iconBg: "from-bhutan-red/20 to-bhutan-red/5",
    iconColor: "text-bhutan-red",
    accent: "hover:border-bhutan-red/30",
  },
  {
    icon: CheckCircle2,
    title: "End-to-end paperwork.",
    description:
      "Documents, registration, and bank coordination — we handle the heavy lifting.",
    iconBg: "from-amber/20 to-amber/5",
    iconColor: "text-amber",
    accent: "hover:border-amber/30",
  },
];

/* ── AnimatedStat — handles both integers and decimals ── */
function AnimatedStat({
  value,
  label,
  delay,
}: {
  value: string;
  label: string;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  // Parse the raw value — support "4.9", "500+", "12+", "4.9" etc.
  const numericStr = value.replace(/[^0-9.]/g, "");
  const suffix = value.replace(/[0-9.]/g, "");
  const target = parseFloat(numericStr) || 0;
  const isDecimal = numericStr.includes(".");
  const decimals = isDecimal ? (numericStr.split(".")[1]?.length ?? 1) : 0;

  const [display, setDisplay] = useState(isDecimal ? "0.0" : "0");

  useEffect(() => {
    if (!isInView || target === 0) return;
    const duration = 1200;
    const start = performance.now();
    const frame = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;
      setDisplay(isDecimal ? current.toFixed(decimals) : String(Math.round(current)));
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, [isInView, target, isDecimal, decimals]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
    >
      <p className="text-[clamp(2rem,1.5rem+1.5vw,3rem)] font-semibold tracking-tighter3 leading-tighter tabular-nums text-foreground">
        {display}{suffix}
      </p>
      <p className="text-[14px] text-ink-500 mt-1">{label}</p>
    </motion.div>
  );
}

export function WhyChooseUs() {
  return (
    <section className="section-y content-visibility-auto">
      <div className="container-apple-wide">
        <SectionHeader
          eyebrow="Why PHOJAA95"
          title="Three things you can count on."
          subtitle="Buying property is a life decision. We make it transparent, safe, and a little exciting."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {features.map((feature, i) => (
            <motion.article
              key={feature.title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className={`bg-white/70 dark:bg-ink-800/50 backdrop-blur-md rounded-apple-xl p-7 sm:p-8 border border-ink-100/80 dark:border-white/10 shadow-soft hover:shadow-elevated transition-all duration-300 ${feature.accent}`}
            >
              <span
                className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.iconBg} mb-5 shadow-soft border border-ink-100/40 dark:border-white/10`}
              >
                <feature.icon className={`w-5 h-5 ${feature.iconColor}`} strokeWidth={1.75} />
              </span>
              <h3 className="font-semibold text-[20px] sm:text-[22px] tracking-tighter2 leading-tight2 text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-[15px] sm:text-[16px] text-ink-500 leading-snug2">
                {feature.description}
              </p>
            </motion.article>
          ))}
        </div>

        {/* Stat strip */}
        <div className="mt-14 sm:mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 border-t border-ink-100 dark:border-ink-700/40 pt-12">
          {[
            { v: "500+", l: "Happy families" },
            { v: "20+", l: "Districts covered" },
            { v: "12+", l: "Years of trust" },
            { v: "4.9", l: "Average rating" },
          ].map((s, i) => (
            <AnimatedStat key={s.l} value={s.v} label={s.l} delay={i * 0.05} />
          ))}
        </div>
      </div>
    </section>
  );
}
