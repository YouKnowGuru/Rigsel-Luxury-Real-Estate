"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bed,
  Bath,
  Maximize,
  MapPin,
  Phone,
  Share2,
  Heart,
  ArrowLeft,
  Check,
  MessageSquare,
  X,
} from "lucide-react";
import { Property } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import ChatWidget from "@/components/ChatWidget";
import { useSettings } from "@/context/SettingsContext";
import { sanitizeHtml } from "@/lib/sanitize";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export default function PropertyDetailPage() {
  const params = useParams();
  const { toast } = useToast();
  const { settings } = useSettings();

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "I'm interested in this property. Please share more details.",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/properties/${params.id}`);
        const data = await res.json();
        if (data.success && data.data) {
          setProperty(data.data);
        } else {
          setProperty(null);
        }
      } catch {
        setProperty(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          propertyId: property._id,
          propertyTitle: property.title,
        }),
      });
      if (res.ok) {
        setSubmitted(true);
        toast({
          title: "Inquiry sent",
          description: "We'll be in touch shortly.",
          variant: "success",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Please try again or call us.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleShare = () => {
    if (!property) return;
    if (navigator.share) {
      navigator.share({ title: property.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link copied", variant: "success" });
    }
  };

  if (loading) {
    return (
      <main className="bg-background pt-12 sm:pt-14 min-h-[60vh] flex items-center justify-center">
        <p className="text-ink-500 text-[15px]">Loading property…</p>
      </main>
    );
  }

  if (!property) {
    return (
      <main className="bg-background pt-12 sm:pt-14 min-h-[60vh]">
        <div className="container-apple-wide py-20 text-center">
          <h1 className="font-semibold text-[28px] tracking-tighter2 text-foreground">
            Property not found
          </h1>
          <p className="mt-3 text-ink-500 text-[15px]">
            This listing may have been removed or the link is incorrect.
          </p>
          <Link href="/properties" className="btn-primary mt-8 inline-flex">
            Browse all properties
          </Link>
        </div>
      </main>
    );
  }

  const sanitizedDescription = sanitizeHtml(property.description || "");

  return (
    <main className="bg-background pt-12 sm:pt-14">
      {/* Top action bar */}
      <div className="sticky top-11 sm:top-12 z-30 glass-strong">
        <div className="container-apple-wide h-12 flex items-center justify-between text-[13px]">
          <Link
            href="/properties"
            className="inline-flex items-center gap-1.5 text-foreground/85 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.75} />
            All properties
          </Link>
          <div className="flex items-center gap-1">
            <button
              onClick={handleShare}
              className="inline-flex items-center justify-center w-9 h-9 rounded-full text-foreground/80 hover:text-foreground hover:bg-ink-100/60 transition-colors"
              aria-label="Share"
            >
              <Share2 className="w-4 h-4" strokeWidth={1.75} />
            </button>
            <button
              onClick={() => setIsLiked((v) => !v)}
              className="inline-flex items-center justify-center w-9 h-9 rounded-full text-foreground/80 hover:text-foreground hover:bg-ink-100/60 transition-colors"
              aria-label="Save"
            >
              <Heart
                className={`w-4 h-4 ${
                  isLiked ? "fill-sky text-sky" : ""
                }`}
                strokeWidth={1.75}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Hero gallery */}
      <section className="bg-background pt-6 sm:pt-10">
        <div className="container-apple-wide">
          <p className="text-[13px] sm:text-[14px] font-semibold text-sky">
            {property.propertyType
              ? property.propertyType.charAt(0).toUpperCase() +
                property.propertyType.slice(1)
              : "Property"}
          </p>
          <h1 className="mt-2 font-semibold tracking-tighter3 leading-tighter text-balance text-[clamp(2rem,1.5rem+2.5vw,4rem)] text-foreground">
            {property.title}
          </h1>
          <p className="mt-3 inline-flex items-center gap-1.5 text-[15px] sm:text-[16px] text-ink-500">
            <MapPin className="w-4 h-4 text-ink-400" strokeWidth={1.75} />
            {property.location}
          </p>
        </div>

        <div className="mt-8 sm:mt-10 max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10">
          <div className="relative aspect-[16/9] rounded-apple-xl overflow-hidden bg-fog/60 dark:bg-ink-800/40 shadow-product">
            <Swiper
              modules={[Navigation, Pagination, Autoplay, EffectFade]}
              navigation
              pagination={{ clickable: true }}
              effect="fade"
              autoplay={{ delay: 5500, disableOnInteraction: false }}
              loop
              className="h-full"
            >
              {property.images.map((src, i) => (
                <SwiperSlide key={i}>
                  <button
                    type="button"
                    onClick={() => {
                      setLightboxIndex(i);
                      setLightboxOpen(true);
                    }}
                    className="block w-full h-full"
                  >
                    <img
                      src={src}
                      alt={`${property.title} — ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                </SwiperSlide>
              ))}
            </Swiper>

            {property.isSold && (
              <span className="absolute top-5 left-5 z-10 px-3 py-1 rounded-full bg-foreground text-background text-[11px] font-medium">
                Sold
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Quick specs strip */}
      <section className="border-t border-b border-ink-100 dark:border-ink-700/40 mt-12 sm:mt-16">
        <div className="container-apple-wide py-6 sm:py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-[11px] uppercase tracking-eyebrow text-ink-500">
              Price
            </p>
            <p className="mt-1 text-[clamp(1.5rem,1.25rem+1vw,2rem)] font-semibold tracking-tightest tabular-nums text-foreground">
              {formatPrice(property.price)}
            </p>
          </div>
          {[
            { label: "Beds", value: property.bedrooms, Icon: Bed },
            { label: "Baths", value: property.bathrooms, Icon: Bath },
            { label: "Area", value: `${property.area} sqft`, Icon: Maximize },
          ].map(({ label, value, Icon }) => (
            <div key={label}>
              <p className="text-[11px] uppercase tracking-eyebrow text-ink-500">
                {label}
              </p>
              <p className="mt-1 text-[clamp(1.25rem,1rem+0.75vw,1.75rem)] font-semibold tracking-tightest tabular-nums text-foreground inline-flex items-center gap-2">
                <Icon className="w-5 h-5 text-ink-400" strokeWidth={1.5} />
                {value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Main content */}
      <section className="section-y-sm">
        <div className="container-apple-wide grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          <div className="lg:col-span-7 space-y-12">
            <div>
              <h2 className="font-semibold text-[clamp(1.75rem,1.5rem+1.25vw,2.5rem)] tracking-tighter2 leading-tight2 text-foreground">
                About this property.
              </h2>
              <article
                className="prose prose-lg dark:prose-invert mt-5 max-w-none text-ink-500 leading-snug2
                  prose-headings:font-semibold prose-headings:text-foreground prose-headings:tracking-tightest
                  prose-p:mb-5
                  prose-a:text-sky prose-a:no-underline hover:prose-a:underline
                  prose-img:rounded-apple-lg prose-img:my-8
                  prose-strong:text-foreground"
                dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
              />
            </div>

            {property.features && property.features.length > 0 && (
              <div>
                <h2 className="font-semibold text-[clamp(1.75rem,1.5rem+1.25vw,2.5rem)] tracking-tighter2 leading-tight2 text-foreground">
                  Features.
                </h2>
                <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {property.features.map((f, i) => (
                    <motion.li
                      key={f}
                      initial={{ opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.03 }}
                      className="flex items-center gap-3 text-[15px] sm:text-[16px] text-foreground"
                    >
                      <span className="w-6 h-6 rounded-full bg-fog/70 dark:bg-white/10 flex items-center justify-center shrink-0">
                        <Check
                          className="w-3.5 h-3.5 text-foreground"
                          strokeWidth={2}
                        />
                      </span>
                      {f}
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}

            {property.latitude && property.longitude && (
              <div>
                <h2 className="font-semibold text-[clamp(1.75rem,1.5rem+1.25vw,2.5rem)] tracking-tighter2 leading-tight2 text-foreground">
                  Location.
                </h2>
                <p className="mt-3 text-[15px] sm:text-[16px] text-ink-500 inline-flex items-center gap-1.5">
                  <MapPin
                    className="w-4 h-4 text-ink-400"
                    strokeWidth={1.75}
                  />
                  {property.location}
                </p>
                <div className="mt-5 aspect-[16/9] rounded-apple-lg overflow-hidden border border-ink-100 dark:border-ink-700/40">
                  <iframe
                    src={`https://www.google.com/maps?q=${property.latitude},${property.longitude}&z=14&output=embed`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <a
                  href={`https://www.google.com/maps?q=${property.latitude},${property.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-apple link-arrow inline-flex mt-3 text-[14px]"
                >
                  Open in Google Maps
                </a>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-5">
            <div className="lg:sticky lg:top-28 space-y-4">
              {/* Price block */}
              <div className="glass rounded-apple-xl p-6 sm:p-8">
                <p className="text-[12px] uppercase tracking-eyebrow text-ink-500">
                  From
                </p>
                <p className="text-[clamp(2rem,1.5rem+1.5vw,3rem)] font-semibold tracking-tighter3 leading-tighter tabular-nums text-foreground">
                  {formatPrice(property.price)}
                </p>
                {property.loanAvailable && property.loanAmount != null && (
                  <p className="mt-2 text-[14px] text-ink-500">
                    or about{" "}
                    <span className="text-foreground font-semibold tabular-nums">
                      Nu.{" "}
                      {Math.round(property.loanAmount / 12).toLocaleString(
                        "en-IN"
                      )}
                    </span>{" "}
                    /mo with financing
                  </p>
                )}
                <div className="mt-6 flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <a
                    href={`tel:${settings.phone || ""}`}
                    className="btn-primary-lg flex-1"
                  >
                    <Phone className="w-4 h-4" strokeWidth={1.75} />
                    Call now
                  </a>
                  <a
                    href={`https://wa.me/${(settings.phone || "").replace(
                      /\D/g,
                      ""
                    )}?text=${encodeURIComponent(
                      `Hi, I'm interested in ${property.title}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary btn-apple-lg flex-1"
                  >
                    <MessageSquare className="w-4 h-4" strokeWidth={1.75} />
                    Message
                  </a>
                </div>
              </div>

              {/* Inquiry */}
              <div className="glass rounded-apple-xl p-6 sm:p-8">
                {submitted ? (
                  <div className="text-center py-6">
                    <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald/20 text-emerald mb-4">
                      <Check className="w-6 h-6" />
                    </span>
                    <p className="font-semibold text-[18px] tracking-tighter2 text-foreground">
                      Inquiry sent.
                    </p>
                    <p className="mt-2 text-[14px] text-ink-500">
                      We&apos;ll get back to you shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <p className="text-[14px] font-semibold text-sky">
                      Ask about this property
                    </p>
                    <input
                      required
                      placeholder="Your name"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="input-apple"
                    />
                    <input
                      required
                      type="email"
                      placeholder="Email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className="input-apple"
                    />
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      className="input-apple"
                    />
                    <textarea
                      rows={3}
                      placeholder="Message"
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                      className="input-apple resize-none"
                    />
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-primary-lg w-full"
                    >
                      {submitting ? "Sending…" : "Send inquiry"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Mobile sticky CTA */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 glass-strong safe-bottom">
        <div className="container-apple-wide flex items-center justify-between gap-3 py-3">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-eyebrow text-ink-500 leading-none">
              From
            </p>
            <p className="text-[18px] font-semibold tracking-tightest tabular-nums text-foreground leading-tight">
              {formatPrice(property.price)}
            </p>
          </div>
          <a
            href={`tel:${settings.phone || ""}`}
            className="btn-primary"
          >
            Call now
          </a>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors flex items-center justify-center"
              aria-label="Close"
            >
              <X className="w-5 h-5" strokeWidth={1.75} />
            </button>
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              initialSlide={lightboxIndex}
              className="w-full max-w-6xl px-4"
            >
              {property.images.map((src, i) => (
                <SwiperSlide key={i}>
                  <img
                    src={src}
                    alt=""
                    className="max-h-[85vh] mx-auto object-contain"
                    onClick={(e) => e.stopPropagation()}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        )}
      </AnimatePresence>

      <ChatWidget />
    </main>
  );
}
