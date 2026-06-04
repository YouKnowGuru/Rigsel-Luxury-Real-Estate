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
  },
  {
    icon: Award,
    title: "Curated listings.",
    description:
      "We only feature the finest houses, apartments, and land across Bhutan.",
  },
  {
    icon: Users,
    title: "Personal guidance.",
    description:
      "A dedicated specialist walks you through every step, from search to signing.",
  },
  {
    icon: Clock,
    title: "Fast response.",
    description:
      "Most inquiries answered within a few hours, by a real human being.",
  },
  {
    icon: MapPin,
    title: "Deep local knowledge.",
    description:
      "We know every corner of Bhutan — and which one suits you."
  },
  {
    icon: CheckCircle2,
    title: "End-to-end paperwork.",
    description:
      "Documents, registration, and bank coordination — we handle the heavy lifting.",
  },
];

function AnimatedStat({ value, label, delay }: { value: string; label: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);
  const target = parseInt(value.replace(/[^0-9]/g, "")) || 0;
  const suffix = value.replace(/[0-9]/g, "");

  useEffect(() => {
    if (!isInView || target === 0) return;
    const duration = 1200;
    const start = performance.now();
    const frame = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, [isInView, target]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
    >
      <p className="text-[clamp(2rem,1.5rem+1.5vw,3rem)] font-semibold tracking-tighter3 leading-tighter tabular-nums text-foreground">
        {count}{suffix}
      </p>
      <p className="text-[14px] text-ink-500 mt-1">{label}</p>
    </motion.div>
  );
}

export function WhyChooseUs() {
  return (
    <section className="section-y bg-background content-visibility-auto">
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
              className="bg-fog dark:bg-ink-800/40 rounded-apple-xl p-7 sm:p-8 transition-shadow hover:shadow-elevated"
            >
              <span className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-white dark:bg-ink-900 text-foreground mb-5 shadow-soft">
                <feature.icon className="w-5 h-5" strokeWidth={1.75} />
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
        <div className="mt-14 sm:mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 border-t border-ink-100 dark:border-ink-700/40 pt-10">
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
