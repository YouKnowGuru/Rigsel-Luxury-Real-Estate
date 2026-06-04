"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Award, Heart, Compass } from "lucide-react";
import NextImage from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { TeamSection } from "@/sections/TeamSection";
import { SectionHeader } from "@/components/layout/SectionHeader";

const values = [
  {
    icon: ShieldCheck,
    title: "Honesty.",
    desc: "Truthful, fair, and transparent in everything we do — no hidden surprises.",
  },
  {
    icon: Award,
    title: "Quality.",
    desc: "Curated listings and a service standard we'd want for our own family.",
  },
  {
    icon: Heart,
    title: "Care.",
    desc: "Your happiness matters most. We treat clients like family, not transactions.",
  },
  {
    icon: Compass,
    title: "Simplicity.",
    desc: "We make finding your home easy and fast with expert hand-holding.",
  },
];

const milestones = [
  { year: "2015", event: "Founded with a vision for transparent real estate." },
  { year: "2018", event: "Expanded to connect more genuine buyers and sellers." },
  { year: "2021", event: "Helped over 500 clients find their land and homes." },
  { year: "2024", event: "Recognised for excellence across Bhutan." }
];

const stats = [
  { v: "500+", l: "Happy families" },
  { v: "20+", l: "Districts" },
  { v: "12+", l: "Years of trust" },
  { v: "4.9", l: "Average rating" },
];

export default function AboutPage() {
  return (
    <main className="bg-background">
      <PageHero
        eyebrow="Our story"
        title="A team that treats every deal."
        highlight="like their own."
        subtitle="PHOJAA95 Real Estate connects property buyers and sellers across Bhutan — with transparency, care, and a deep love of place."
        breadcrumbs={[{ label: "About" }]}
      />

      {/* Mission / Vision side-by-side */}
      <section className="section-y">
        <div className="container-apple-wide grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
          {[
            {
              eyebrow: "Mission",
              title: "Bring more people home.",
              copy: "Help buyers find the right land and property that matches their needs and budget — through clear communication and reliable guidance.",
            },
            {
              eyebrow: "Vision",
              title: "Build trust, one deal at a time.",
              copy: "Become Bhutan's most trusted facilitator — known for transparency, professionalism, and long-term relationships, not transactions.",
            },
          ].map((card, i) => (
            <motion.article
              key={card.title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.06 }}
              className="bg-fog rounded-apple-xl p-8 sm:p-10"
            >
              <p className="text-[14px] font-semibold text-sky mb-2">
                {card.eyebrow}
              </p>
              <h2 className="font-semibold text-[clamp(1.75rem,1.5rem+1.5vw,2.75rem)] tracking-tighter2 leading-tight2 text-foreground">
                {card.title}
              </h2>
              <p className="mt-4 text-[16px] sm:text-[17px] text-ink-500 leading-snug2">
                {card.copy}
              </p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-fog">
        <div className="container-apple-wide section-y-sm grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.l}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="text-center"
            >
              <p className="text-[clamp(2rem,1.5rem+1.5vw,3rem)] font-semibold tracking-tighter3 leading-tighter tabular-nums text-foreground">
                {s.v}
              </p>
              <p className="text-[14px] text-ink-500 mt-1">{s.l}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="section-y">
        <div className="container-apple-wide">
          <SectionHeader
            eyebrow="Our values"
            title="Four ideas. Every decision."
            subtitle="The principles that shape how we work and the relationships we build."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.6 }}
                className="bg-fog rounded-apple-xl p-7"
              >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-soft text-foreground mb-5">
                  <v.icon className="w-4 h-4" strokeWidth={1.75} />
                </span>
                <h3 className="font-semibold text-[18px] sm:text-[20px] tracking-tighter2 leading-tight2 text-foreground">
                  {v.title}
                </h3>
                <p className="mt-2 text-[14px] sm:text-[15px] text-ink-500 leading-snug2">
                  {v.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-fog section-y">
        <div className="container-apple">
          <SectionHeader
            eyebrow="Journey"
            title="A decade of property."
            highlight="In Bhutan."
          />
          <ol className="space-y-3">
            {milestones.map((m, i) => (
              <motion.li
                key={m.year}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
                className="bg-white dark:bg-card rounded-apple-lg p-5 sm:p-6 flex items-baseline gap-5 sm:gap-8 border border-ink-100 dark:border-ink-700/40"
              >
                <span className="text-[clamp(1.5rem,1.25rem+0.75vw,2rem)] font-semibold tabular-nums tracking-tighter3 text-foreground">
                  {m.year}
                </span>
                <p className="text-[15px] sm:text-[16px] text-ink-500 leading-snug2">
                  {m.event}
                </p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      <TeamSection />

      {/* CTA */}
      <section className="bg-ink-900 text-white">
        <div className="container-apple-wide section-y text-center">
          <h2 className="font-semibold text-[clamp(2rem,1.5rem+2.5vw,4rem)] tracking-tighter3 leading-tighter text-balance max-w-3xl mx-auto">
            Ready to find your{" "}
            <span className="text-white/55">perfect place?</span>
          </h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link href="/properties" className="btn-light btn-apple-lg">
              Browse properties
            </Link>
            <Link href="/contact" className="link-apple link-arrow text-sky-dim text-[15px]">
              Talk to a specialist
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
