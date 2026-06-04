"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Scale,
  FileText,
  Anchor,
  Gavel,
  AlertCircle,
} from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import Link from "next/link";

const sections = [
  {
    icon: FileText,
    title: "Acceptance of terms.",
    content:
      "By accessing and using this website, you agree to be bound by these Terms and Conditions and all applicable laws and regulations in the Kingdom of Bhutan.",
  },
  {
    icon: Scale,
    title: "Real estate services.",
    content:
      "We act as a facilitator connecting property buyers and sellers. All listings are provided for informational purposes; verify details independently before any commitment.",
  },
  {
    icon: ShieldCheck,
    title: "User obligations.",
    content:
      "Users agree to provide accurate information when making inquiries and may not use the site for unlawful purposes or in violation of any local or international laws.",
  },
  {
    icon: Anchor,
    title: "Property transactions.",
    content:
      "Transactions must comply with the Land Act of Bhutan and other relevant property laws. We strongly advise consulting a qualified legal professional before any commitment.",
  },
  {
    icon: Gavel,
    title: "Intellectual property.",
    content:
      "Site content — text, images, logos, designs — may not be reproduced or distributed without express written permission of PHOJAA95 Real Estate.",
  },
  {
    icon: AlertCircle,
    title: "Limitation of liability.",
    content:
      "PHOJAA95 Real Estate is not liable for any direct or indirect damages arising from the use of this site or from any property transaction.",
  },
];

export default function TermsPage() {
  return (
    <main className="bg-background">
      <PageHero
        eyebrow="Legal"
        title="Terms & conditions."
        subtitle="Please read these terms carefully before using the PHOJAA95 Real Estate website or services."
        breadcrumbs={[{ label: "Terms" }]}
      />

      <section className="section-y-sm">
        <div className="container-apple">
          <div className="space-y-4">
            {sections.map((section, i) => (
              <motion.article
                key={section.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: i * 0.04 }}
                className="bg-fog rounded-apple-lg p-6 sm:p-8"
              >
                <div className="flex items-start gap-4">
                  <span className="w-11 h-11 rounded-full bg-white shadow-soft text-foreground flex items-center justify-center shrink-0">
                    <section.icon className="w-4 h-4" strokeWidth={1.75} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-[20px] sm:text-[22px] tracking-tighter2 leading-tight2 text-foreground">
                      {section.title}
                    </h2>
                    <p className="mt-2 text-[15px] sm:text-[16px] text-ink-500 leading-snug2">
                      {section.content}
                    </p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="mt-12 pt-10 border-t border-ink-100 dark:border-ink-700/40 text-center">
            <p className="text-[13px] text-ink-500">
              Last updated: 20 May 2026
            </p>
            <p className="mt-6 text-[15px] text-ink-500 max-w-md mx-auto">
              Questions about these terms? Reach out — we&apos;re happy to clarify.
            </p>
            <Link href="/contact" className="btn-secondary mt-6">
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
