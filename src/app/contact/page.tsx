"use client";

import { useState, useCallback, memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  Facebook,
  ArrowRight,
  Send,
  MessageCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PageHero } from "@/components/layout/PageHero";
import { cn } from "@/lib/utils";

/* ============================================================
   CONTACT PAGE — Apple-style luxury contact experience
   Design Principles:
   • Cinematic hero with massive typography
   • Glassmorphic contact cards with staggered reveals
   • Premium form with floating labels and validation
   • Success state with celebration animation
   • All touch targets ≥ 44px
   ============================================================ */

/* ── Animation variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
  }),
};

/* ── Contact Info Data ── */
const contactInfo = [
  {
    icon: MapPin,
    title: "Visit us",
    content: "Paro, Bhutan",
    subContent: "Below RRCO, Taju",
    color: "bg-sky/10 text-sky",
  },
  {
    icon: Phone,
    title: "Call us",
    content: "+975 1611 1999",
    subContent: "Mon – Sat, 9AM – 6PM",
    href: "tel:+97516111999",
    color: "bg-emerald/10 text-emerald",
  },
  {
    icon: Mail,
    title: "Email us",
    content: "phojaa95realestate@gmail.com",
    subContent: "We reply within 24 hours",
    href: "mailto:phojaa95realestate@gmail.com",
    color: "bg-amber/10 text-amber",
  },
  {
    icon: Clock,
    title: "Open hours",
    content: "Mon – Fri 9AM – 6PM",
    subContent: "Saturday 9AM – 1PM",
    color: "bg-rose/10 text-rose",
  },
];

/* ── Contact Card Component ── */
interface ContactCardProps {
  info: (typeof contactInfo)[0];
  index: number;
}
const ContactCard = memo(function ContactCard({ info, index }: ContactCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const Icon = info.icon;

  const content = (
    <motion.div
      initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="group glass rounded-apple-xl p-5 sm:p-6 border border-ink-100/60 dark:border-ink-700/30 hover:border-ink-200 dark:hover:border-ink-600/50 hover:shadow-soft transition-all duration-fast no-tap outline-none focus-visible:ring-2 focus-visible:ring-sky/40"
    >
      <div className="flex items-start gap-4">
        <span
          className={cn(
            "w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-105",
            info.color
          )}
        >
          <Icon className="w-5 h-5" strokeWidth={1.75} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-ink-500 mb-1">
            {info.title}
          </p>
          <p className="text-[15px] font-semibold tracking-tight text-foreground truncate">
            {info.content}
          </p>
          <p className="text-[13px] text-ink-500 mt-0.5">{info.subContent}</p>
        </div>
        {info.href && (
          <ArrowRight
            className="w-4 h-4 text-ink-400 group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0 self-center"
            strokeWidth={1.75}
          />
        )}
      </div>
    </motion.div>
  );

  if (info.href) {
    return (
      <a href={info.href} className="block">
        {content}
      </a>
    );
  }
  return content;
});

/* ── Form Input Component ── */
interface FormInputProps {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  inputMode?: "text" | "search" | "url" | "email" | "none" | "decimal" | "numeric" | "tel";
}
const FormInput = memo(function FormInput({
  id,
  label,
  type = "text",
  required,
  placeholder,
  value,
  onChange,
  autoComplete,
  inputMode,
}: FormInputProps) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-[12px] font-medium text-ink-500 uppercase tracking-eyebrow"
      >
        {label}
        {required && <span className="text-rose ml-0.5">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        inputMode={inputMode}
        className="input-apple h-12"
      />
    </div>
  );
});

/* ── Form Textarea Component ── */
interface FormTextareaProps {
  id: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}
const FormTextarea = memo(function FormTextarea({
  id,
  label,
  required,
  placeholder,
  value,
  onChange,
  rows = 5,
}: FormTextareaProps) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-[12px] font-medium text-ink-500 uppercase tracking-eyebrow"
      >
        {label}
        {required && <span className="text-rose ml-0.5">*</span>}
      </label>
      <textarea
        id={id}
        name={id}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="input-apple resize-none"
      />
    </div>
  );
});

/* ── Social Link Component ── */
const SocialLink = memo(function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-11 h-11 rounded-full bg-white/40 dark:bg-white/10 backdrop-blur-md border border-ink-200/60 dark:border-ink-700/40 hover:bg-foreground hover:text-background hover:border-foreground flex items-center justify-center text-foreground transition-all duration-fast no-tap outline-none focus-visible:ring-2 focus-visible:ring-sky/40"
    >
      {children}
    </a>
  );
});

/* ── Main Contact Page ── */
export default function ContactPage() {
  const { toast } = useToast();
  const shouldReduceMotion = useReducedMotion();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });

  const updateField = useCallback((field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          setIsSubmitted(true);
          toast({
            title: "Message sent",
            description: "We'll call you very soon.",
            variant: "success",
          });
        }
      } catch {
        toast({
          title: "Error",
          description: "Please try again or call us directly.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, toast]
  );

  const handleWhatsApp = useCallback(() => {
    window.open("https://wa.me/97516111999", "_blank");
  }, []);

  return (
    <main className="bg-background">
      {/* Hero */}
      <PageHero
        eyebrow="Contact"
        title="Let's talk about your home."
        subtitle="Ask anything — about a listing, our process, or just to say hello. We respond fast."
        breadcrumbs={[{ label: "Contact" }]}
      />

      {/* Contact section */}
      <section className="section-y">
        <div className="container-apple-wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left: Contact info */}
            <div className="lg:col-span-5 space-y-4">
              <motion.div
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-6"
              >
                <p className="text-[13px] font-semibold text-sky tracking-wide uppercase mb-2">
                  Get in touch
                </p>
                <h2 className="text-[clamp(1.5rem,1.25rem+1.5vw,2.25rem)] font-semibold tracking-tighter2 leading-tight2 text-foreground">
                  We&apos;d love to hear from you.
                </h2>
                <p className="mt-3 text-[15px] text-ink-500 leading-snug2">
                  Choose the way that works best for you. Our team is ready to
                  help with your property journey.
                </p>
              </motion.div>

              {/* Contact cards */}
              <div className="space-y-3">
                {contactInfo.map((info, i) => (
                  <ContactCard key={info.title} info={info} index={i} />
                ))}
              </div>

              {/* WhatsApp CTA */}
              <motion.button
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5 }}
                onClick={handleWhatsApp}
                className="w-full flex items-center gap-3 p-4 rounded-apple-xl bg-emerald/5 border border-emerald/20 hover:bg-emerald/10 transition-all duration-fast no-tap outline-none focus-visible:ring-2 focus-visible:ring-emerald/40"
              >
                <span className="w-10 h-10 rounded-full bg-emerald/15 text-emerald flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5" strokeWidth={1.75} />
                </span>
                <div className="text-left">
                  <p className="text-[13px] font-medium text-foreground">
                    Chat on WhatsApp
                  </p>
                  <p className="text-[12px] text-ink-500">
                    Usually replies instantly
                  </p>
                </div>
                <ArrowRight
                  className="w-4 h-4 text-ink-400 ml-auto"
                  strokeWidth={1.75}
                />
              </motion.button>

              {/* Social links */}
              <motion.div
                initial={shouldReduceMotion ? {} : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="flex items-center gap-3 pt-2"
              >
                <span className="text-[12px] text-ink-500 mr-1">
                  Follow us
                </span>
                <SocialLink
                  href="https://www.facebook.com/share/1b2Fk7oC9q/"
                  label="Facebook"
                >
                  <Facebook className="w-4 h-4" strokeWidth={1.75} />
                </SocialLink>
                <SocialLink
                  href="https://tiktok.com/@phojaa95realestate"
                  label="TikTok"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.17-3.8-5.46-.4-2.46.33-5.06 1.95-6.9 1.51-1.74 3.79-2.81 6.09-2.92v4.06c-1.05.08-2.07.6-2.73 1.39-.63.76-.94 1.83-.8 2.83.17 1.25.96 2.37 2.11 2.89 1.09.49 2.4.45 3.42-.1.97-.53 1.63-1.5 1.75-2.61.03-.31.02-.63.02-.94V.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                </SocialLink>
              </motion.div>
            </div>

            {/* Right: Form */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7"
            >
              <div className="glass-strong rounded-apple-xl p-6 sm:p-8 md:p-10 border border-ink-100/60 dark:border-ink-700/30">
                {isSubmitted ? (
                  /* Success state */
                  <div className="text-center py-12 sm:py-16">
                    <motion.span
                      initial={shouldReduceMotion ? {} : { scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                      }}
                      className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald/15 text-emerald mb-6"
                    >
                      <CheckCircle className="w-8 h-8" strokeWidth={1.75} />
                    </motion.span>
                    <h3 className="font-semibold text-[clamp(1.5rem,1.25rem+1vw,2rem)] tracking-tighter2 text-foreground">
                      Message sent.
                    </h3>
                    <p className="mt-3 text-[16px] text-ink-500 max-w-md mx-auto">
                      We&apos;ll be in touch shortly. In the meantime, feel free
                      to browse properties.
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="mt-8 inline-flex items-center gap-1 text-sky text-[15px] font-medium hover:underline underline-offset-4 no-tap outline-none focus-visible:ring-2 focus-visible:ring-sky/40 rounded px-2 py-1"
                    >
                      Send another message
                      <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
                    </button>
                  </div>
                ) : (
                  /* Form */
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <p className="text-[13px] font-semibold text-sky tracking-wide uppercase mb-2">
                        Send a message
                      </p>
                      <h2 className="text-[clamp(1.5rem,1.25rem+1.5vw,2.25rem)] font-semibold tracking-tighter2 leading-tight2 text-foreground">
                        Tell us what you need.
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <FormInput
                        id="name"
                        label="Full name"
                        required
                        placeholder="e.g. Dorji Wangchuk"
                        value={formData.name}
                        onChange={(v) => updateField("name", v)}
                        autoComplete="name"
                      />
                      <FormInput
                        id="phone"
                        label="Phone"
                        type="tel"
                        placeholder="e.g. +975 17123456"
                        value={formData.phone}
                        onChange={(v) => updateField("phone", v)}
                        autoComplete="tel"
                        inputMode="tel"
                      />
                    </div>

                    <FormInput
                      id="email"
                      label="Email"
                      type="email"
                      required
                      placeholder="e.g. name@example.com"
                      value={formData.email}
                      onChange={(v) => updateField("email", v)}
                      autoComplete="email"
                      inputMode="email"
                    />

                    <FormInput
                      id="subject"
                      label="Subject"
                      placeholder="e.g. Inquiry about Paro property"
                      value={formData.subject}
                      onChange={(v) => updateField("subject", v)}
                    />

                    <FormTextarea
                      id="message"
                      label="Message"
                      required
                      placeholder="Tell us more about what you're looking for…"
                      value={formData.message}
                      onChange={(v) => updateField("message", v)}
                      rows={5}
                    />

                    <div className="flex items-center justify-between pt-2">
                      <p className="text-[12px] text-ink-500">
                        We typically respond within 24 hours.
                      </p>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-2 h-12 px-7 rounded-full bg-sky text-white text-[15px] font-medium hover:bg-sky-hover active:scale-[0.97] transition-all duration-fast no-tap outline-none focus-visible:ring-2 focus-visible:ring-sky/50 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Sending…
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" strokeWidth={2} />
                            Send message
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
