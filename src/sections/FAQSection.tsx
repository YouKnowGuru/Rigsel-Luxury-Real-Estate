"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { homeFaqs } from "@/data/faqs";
import { cn } from "@/lib/utils";

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="section-y content-visibility-auto border-t border-ink-100/60 dark:border-white/10">
      <div className="container-apple">
        <SectionHeader
          eyebrow="Frequently Asked Questions"
          title="Everything you need to know about"
          highlight="real estate in Bhutan."
          subtitle="Clear answers to common questions about buying, selling, and investing in Bhutan property."
        />

        <div className="mt-10 max-w-3xl mx-auto space-y-4">
          {homeFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={cn(
                  "bg-white/70 dark:bg-ink-800/50 backdrop-blur-md rounded-apple-xl border transition-all duration-300 overflow-hidden shadow-soft",
                  isOpen
                    ? "border-sky/40 dark:border-sky/50 shadow-elevated ring-1 ring-sky/20"
                    : "border-ink-100/80 dark:border-white/10 hover:border-ink-200 dark:hover:border-white/20"
                )}
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 outline-none focus-visible:ring-2 focus-visible:ring-sky/40"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-[16px] sm:text-[18px] text-foreground tracking-tight flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-sky/10 dark:bg-sky/20 shrink-0">
                      <HelpCircle className="w-4 h-4 text-sky" strokeWidth={2} />
                    </span>
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 text-ink-400 dark:text-ink-300 shrink-0 transition-transform duration-300",
                      isOpen && "rotate-180 text-sky dark:text-sky"
                    )}
                    strokeWidth={2}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="px-5 sm:px-6 pb-6 pt-3 text-[15px] sm:text-[16px] text-ink-600 dark:text-ink-200 leading-relaxed border-t border-ink-100/80 dark:border-white/10">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
