"use client";

import { memo, useCallback } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Phone, Mail, MapPin, ArrowRight, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useSettings } from "@/context/SettingsContext";
import { cn } from "@/lib/utils";

/* ============================================================
   CONTACT CTA — Apple-style luxury closing section
   Design Principles:
   • Full-bleed cinematic imagery with layered gradients
   • Floating glass contact cards
   • Staggered entrance animations
   • Multiple contact pathways (call, email, visit, WhatsApp)
   • All touch targets ≥ 44px
   ============================================================ */

/* ── Animation variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] },
  }),
};

/* ── Contact Card Component ── */
interface ContactCardProps {
  href: string;
  icon: React.ElementType;
  label: string;
  value: string;
  variant?: "primary" | "secondary";
  delay: number;
}
const ContactCard = memo(function ContactCard({
  href,
  icon: Icon,
  label,
  value,
  variant = "secondary",
  delay,
}: ContactCardProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.a
      href={href}
      initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group flex items-center gap-4 p-4 sm:p-5 rounded-apple-xl border transition-all duration-fast no-tap outline-none focus-visible:ring-2 focus-visible:ring-sky/50",
        variant === "primary"
          ? "bg-sky/10 border-sky/20 hover:bg-sky/20"
          : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 backdrop-blur-md"
      )}
    >
      <span
        className={cn(
          "w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-colors",
          variant === "primary"
            ? "bg-sky text-white"
            : "bg-white/10 text-white/80 group-hover:bg-white/20"
        )}
      >
        <Icon className="w-5 h-5" strokeWidth={1.75} />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-eyebrow text-white/50 mb-0.5">
          {label}
        </p>
        <p
          className={cn(
            "text-[15px] font-medium truncate",
            variant === "primary" ? "text-sky" : "text-white"
          )}
        >
          {value}
        </p>
      </div>
      <ArrowRight
        className="w-4 h-4 text-white/30 group-hover:text-white/60 group-hover:translate-x-0.5 transition-all shrink-0 ml-auto"
        strokeWidth={1.75}
      />
    </motion.a>
  );
});

/* ── Main ContactCTA Component ── */
export function ContactCTA() {
  const { settings } = useSettings();
  const shouldReduceMotion = useReducedMotion();

  const handleWhatsApp = useCallback(() => {
    if (settings.phone) {
      window.open(
        `https://wa.me/${settings.phone.replace(/\D/g, "")}`,
        "_blank"
      );
    }
  }, [settings.phone]);

  return (
    <section className="relative overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=2400&auto=format&fit=crop&q=80"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          loading="lazy"
        />
        {/* Multi-layer gradient for depth */}
        <div className="absolute inset-0 bg-ink-900/85" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-900/30 via-transparent to-ink-900/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-900/40 to-transparent" />
      </div>

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-sky/8 rounded-full blur-[100px] pointer-events-none" />

      {/* Content */}
      <div className="container-apple-wide relative z-10 py-20 sm:py-28 md:py-32">
        <div className="max-w-4xl mx-auto">
          {/* Text block */}
          <div className="text-center mb-12 sm:mb-16">
            <motion.p
              custom={0}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="text-[13px] font-semibold text-sky tracking-wide uppercase mb-4"
            >
              Let&apos;s talk
            </motion.p>

            <motion.h2
              custom={0.08}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="font-semibold tracking-tighter3 leading-tighter text-balance text-white"
              style={{ fontSize: "clamp(2.5rem, 2rem + 3.5vw, 5rem)" }}
            >
              Ready to find your{" "}
              <span className="text-white/50">perfect home?</span>
            </motion.h2>

            <motion.p
              custom={0.16}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="mt-5 text-[17px] sm:text-[19px] text-white/60 max-w-xl mx-auto leading-snug2"
            >
              We&apos;re here every step of the way. Reach out however you
              prefer — we&apos;ll respond within 24 hours.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              custom={0.24}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
            >
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 h-12 px-7 rounded-full bg-white text-ink-900 text-[15px] font-medium hover:bg-white/90 active:scale-[0.97] transition-all duration-fast no-tap outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                Talk to a specialist
                <ArrowRight className="w-4 h-4" strokeWidth={2} />
              </Link>
              <Link
                href="/properties"
                className="inline-flex items-center gap-1 h-12 px-7 rounded-full border border-white/20 text-white text-[15px] font-medium hover:bg-white/10 active:scale-[0.97] transition-all duration-fast no-tap outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              >
                Browse properties
              </Link>
            </motion.div>
          </div>

          {/* Contact cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {settings.phone && (
              <ContactCard
                href={`tel:${settings.phone}`}
                icon={Phone}
                label="Call us"
                value={settings.phone}
                variant="primary"
                delay={0.3}
              />
            )}

            {settings.phone && (
              <button
                onClick={handleWhatsApp}
                className="group flex items-center gap-4 p-4 sm:p-5 rounded-apple-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 backdrop-blur-md transition-all duration-fast no-tap outline-none focus-visible:ring-2 focus-visible:ring-sky/50 text-left"
              >
                <span className="w-11 h-11 rounded-full bg-emerald/20 text-emerald flex items-center justify-center shrink-0 group-hover:bg-emerald/30 transition-colors">
                  <MessageCircle className="w-5 h-5" strokeWidth={1.75} />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-eyebrow text-white/50 mb-0.5">
                    WhatsApp
                  </p>
                  <p className="text-[15px] font-medium text-white truncate">
                    Message us
                  </p>
                </div>
                <ArrowRight
                  className="w-4 h-4 text-white/30 group-hover:text-white/60 group-hover:translate-x-0.5 transition-all shrink-0 ml-auto"
                  strokeWidth={1.75}
                />
              </button>
            )}

            {settings.email && (
              <ContactCard
                href={`mailto:${settings.email}`}
                icon={Mail}
                label="Email"
                value={settings.email}
                delay={0.4}
              />
            )}

            <ContactCard
              href="/contact"
              icon={MapPin}
              label="Visit us"
              value="Paro, Bhutan"
              delay={0.5}
            />
          </div>

          {/* Trust badges */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-6 text-[13px] font-medium text-white/80"
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald shadow-[0_0_8px_rgba(52,199,89,0.8)]" />
              Verified listings
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky shadow-[0_0_8px_rgba(0,113,227,0.8)]" />
              24h response
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber shadow-[0_0_8px_rgba(255,159,10,0.8)]" />
              Local expertise
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
