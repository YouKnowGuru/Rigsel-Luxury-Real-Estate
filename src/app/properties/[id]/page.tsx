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
  Mail,
  Share2,
  Heart,
  ArrowLeft,
  Check,
  Calendar,
  Home,
  Clock,
  MessageSquare,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Property } from "@/types";
import { formatPrice, formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const fallbackProperty: Property = {
  _id: "1",
  title: "Modern Family Home in Thimphu",
  price: 25000000,
  location: "Motithang, Thimphu",
  district: "Thimphu",
  bedrooms: 5,
  bathrooms: 4,
  area: 450,
  propertyType: "villa",
  description:
    "This beautiful home offers calm mountain views and simple, modern living. It features large rooms, a private garden, and high-quality finishes. Perfect for families looking for a peaceful and elegant life in the heart of Thimphu.",
  features: [
    "Mountain View",
    "Private Garden",
    "Car Parking",
    "Security System",
    "Modern Kitchen",
    "Large Living Room",
    "Main Bedroom with Bath",
    "Outside Balcony",
  ],
  images: [
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200",
  ],
  latitude: 27.4712,
  longitude: 89.6339,
  featured: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export default function PropertyDetailPage() {
  const params = useParams();
  const { toast } = useToast();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`/api/properties/${params.id}`);
        const data = await response.json();
        if (data.success) {
          setProperty(data.data);
        }
      } catch (error) {
        console.error("Error fetching property:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [params.id]);

  const displayProperty = property || fallbackProperty;

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...contactForm,
          propertyId: displayProperty._id,
        }),
      });

      if (response.ok) {
        toast({
          title: "Inquiry Sent Successfully",
          description: "Thank you for your interest! We'll get back to you shortly.",
        });
        setContactForm({ name: "", phone: "", email: "", message: "" });
      } else {
        throw new Error("Failed to send");
      }
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Could not send inquiry. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: displayProperty.title,
        text: `Check out this property: ${displayProperty.title}`,
        url: window.location.href,
      });
    } catch (error) {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Shared link copied to clipboard!",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] pt-32 pb-20">
        <div className="container-luxury max-w-7xl mx-auto px-6">
          <div className="h-[600px] bg-white/50 rounded-[3rem] animate-pulse mb-12 shadow-sm" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <div className="h-12 bg-white/50 rounded-2xl animate-pulse w-3/4 shadow-sm" />
              <div className="h-6 bg-white/50 rounded-xl animate-pulse w-1/2 shadow-sm" />
              <div className="h-64 bg-white/50 rounded-[2rem] animate-pulse shadow-sm" />
            </div>
            <div className="h-[500px] bg-white/50 rounded-[2.5rem] animate-pulse shadow-sm" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F7F2] pb-32">
      {/* Navigation Top Bar (Floating Style) */}
      <div className="fixed top-24 left-0 right-0 z-40 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl p-4 shadow-xl flex items-center justify-between">
            <Link
              href="/properties"
              className="flex items-center gap-3 px-6 py-2.5 rounded-2xl text-bhutan-dark/60 hover:text-bhutan-red hover:bg-bhutan-red/5 transition-all duration-500 font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">Back to List</span>
            </Link>
            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-bhutan-gold/10 text-bhutan-dark/60 hover:text-bhutan-gold hover:border-bhutan-gold/30 transition-all duration-500 shadow-sm"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-bhutan-gold/10 transition-all duration-500 shadow-sm"
              >
                <Heart
                  className={`w-5 h-5 ${isLiked ? "fill-bhutan-red text-bhutan-red" : "text-bhutan-dark/30"
                    }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Gallery Section */}
      <div className="pt-40 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative rounded-[3.5rem] overflow-hidden shadow-2xl border-8 border-white"
          >
            <Swiper
              modules={[Navigation, Pagination, Autoplay, EffectFade]}
              effect="fade"
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 6000 }}
              className="h-[400px] md:h-[650px] lg:h-[750px]"
            >
              {displayProperty.images.map((image, index) => (
                <SwiperSlide key={index}>
                  <div className="relative w-full h-full">
                    <img
                      src={image}
                      alt={displayProperty.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bhutan-dark/60 via-transparent to-transparent" />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Price Badge Overlay */}
            <div className="absolute bottom-12 left-12 z-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/90 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-8 shadow-2xl border border-white/50"
              >
                <p className="text-bhutan-dark/40 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] mb-1 md:mb-2 text-center">Price</p>
                <p className="text-3xl md:text-5xl font-serif font-bold text-bhutan-red text-center">
                  {formatPrice(displayProperty.price)}
                </p>
              </motion.div>
            </div>

            {/* Type Badge Overlay */}
            <div className="absolute top-8 left-8 z-20 flex gap-4">
              <div className="px-6 py-2.5 bg-bhutan-red text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full shadow-xl">
                {displayProperty.propertyType}
              </div>
              {displayProperty.featured && (
                <div className="px-6 py-2.5 bg-bhutan-gold text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full shadow-xl flex items-center gap-2">
                  Special Choice
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Detailed Info Section */}
      <div className="mt-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-16">
              {/* Header Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="flex items-center gap-4 text-bhutan-gold mb-2">
                  <div className="h-0.5 w-12 bg-bhutan-gold/30 rounded-full" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.5em]">{displayProperty.district} District</span>
                </div>
                <h1 className="font-serif text-3xl md:text-6xl font-bold text-bhutan-dark leading-tight">
                  {displayProperty.title}
                </h1>
                <div className="flex items-center gap-3 text-bhutan-dark/60 text-lg bg-white/50 w-fit px-6 py-3 rounded-2xl border border-bhutan-gold/10">
                  <MapPin className="w-6 h-6 text-bhutan-gold" />
                  <span className="font-medium italic">{displayProperty.location}</span>
                </div>
              </motion.div>

              {/* Quick Spec Grid */}
              <div className="grid grid-cols-3 gap-2 md:gap-8 p-6 md:p-12 bg-white rounded-[2rem] md:rounded-[3rem] shadow-sm border border-bhutan-gold/10">
                <div className="space-y-2 md:space-y-3 text-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-[#F9F7F2] rounded-xl md:rounded-2xl flex items-center justify-center mx-auto border border-bhutan-gold/5 group hover:bg-bhutan-red transition-all duration-500">
                    <Bed className="w-5 h-5 md:w-8 md:h-8 text-bhutan-gold group-hover:text-white transition-all duration-500" />
                  </div>
                  <p className="text-xl md:text-3xl font-serif font-bold text-bhutan-dark leading-none pt-2">{displayProperty.bedrooms}</p>
                  <p className="text-[8px] md:text-[10px] font-bold text-bhutan-dark/30 uppercase tracking-widest">Bedrooms</p>
                </div>
                <div className="space-y-2 md:space-y-3 text-center border-x border-bhutan-gold/10 px-2 md:px-8">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-[#F9F7F2] rounded-xl md:rounded-2xl flex items-center justify-center mx-auto border border-bhutan-gold/5 group hover:bg-bhutan-red transition-all duration-500">
                    <Bath className="w-5 h-5 md:w-8 md:h-8 text-bhutan-gold group-hover:text-white transition-all duration-500" />
                  </div>
                  <p className="text-xl md:text-3xl font-serif font-bold text-bhutan-dark leading-none pt-2">{displayProperty.bathrooms}</p>
                  <p className="text-[8px] md:text-[10px] font-bold text-bhutan-dark/30 uppercase tracking-widest">Baths</p>
                </div>
                <div className="space-y-2 md:space-y-3 text-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-[#F9F7F2] rounded-xl md:rounded-2xl flex items-center justify-center mx-auto border border-bhutan-gold/5 group hover:bg-bhutan-red transition-all duration-500">
                    <Maximize className="w-5 h-5 md:w-8 md:h-8 text-bhutan-gold group-hover:text-white transition-all duration-500" />
                  </div>
                  <p className="text-xl md:text-3xl font-serif font-bold text-bhutan-dark leading-none pt-2">{displayProperty.area}</p>
                  <p className="text-[8px] md:text-[10px] font-bold text-bhutan-dark/30 uppercase tracking-widest">Size (m²)</p>
                </div>
              </div>

              {/* Description Section */}
              <div className="space-y-8">
                <div className="flex items-center gap-6">
                  <h2 className="font-serif text-3xl font-bold text-bhutan-dark">About this property</h2>
                  <div className="h-px flex-1 bg-bhutan-gold/10" />
                </div>
                <p className="text-bhutan-dark/60 text-lg md:text-xl leading-relaxed italic font-light">
                  "{displayProperty.description}"
                </p>
              </div>

              {/* Features List */}
              <div className="space-y-8">
                <div className="flex items-center gap-6">
                  <h2 className="font-serif text-3xl font-bold text-bhutan-dark">Property Highlights</h2>
                  <div className="h-px flex-1 bg-bhutan-gold/10" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
                  {displayProperty.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-white shadow-sm hover:border-bhutan-gold/20 transition-all duration-500"
                    >
                      <div className="w-10 h-10 bg-bhutan-gold/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Check className="w-5 h-5 text-bhutan-gold" />
                      </div>
                      <span className="text-bhutan-dark/70 font-medium text-lg">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Location Map (Themed) */}
              <div className="space-y-8">
                <div className="flex items-center gap-6">
                  <h2 className="font-serif text-3xl font-bold text-bhutan-dark">Our Location</h2>
                  <div className="h-px flex-1 bg-bhutan-gold/10" />
                </div>
                <div className="rounded-[2.5rem] overflow-hidden border-8 border-white shadow-xl h-[450px]">
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight={0}
                    marginWidth={0}
                    src={`https://maps.google.com/maps?q=${displayProperty.latitude},${displayProperty.longitude}&z=15&output=embed`}
                    className="grayscale-[0.2] contrast-[1.1]"
                  />
                </div>
              </div>
            </div>

            {/* Sticky Sidebar Action Card */}
            <div className="space-y-8 sticky top-48">
              {/* Agent Profile Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2rem] p-6 shadow-luxury border-2 border-white"
              >
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden relative border-2 border-bhutan-gold/10">
                    <img
                      src="/image/dorji wangchuk.jpg"
                      alt="Dorji Wangchuk"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-bhutan-gold text-[10px] font-bold uppercase tracking-widest mb-1">Local Agent</p>
                    <h3 className="font-serif text-xl font-bold text-bhutan-dark">Dorji Wangchuk</h3>
                    <p className="text-bhutan-dark/40 text-xs font-medium">General Manager (GM)</p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-bhutan-gold/10 space-y-3">
                  <a
                    href="https://wa.me/message/PKJFHGFCVTYPH1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full py-3.5 bg-[#25D366] text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Chat on WhatsApp
                  </a>
                </div>
              </motion.div>

              {/* Inquiry Form */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-[2rem] p-6 md:p-8 shadow-luxury border-2 border-white"
              >
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-bhutan-gold/10">
                  <div className="w-12 h-12 bg-bhutan-red/5 rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-bhutan-red" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-bhutan-dark">Send Inquiry</h3>
                    <p className="text-bhutan-dark/40 text-[9px] font-bold uppercase tracking-widest">Prompt Response Guaranteed</p>
                  </div>
                </div>

                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-bhutan-dark/40 uppercase tracking-[0.2em] ml-2">Your Name</label>
                    <Input
                      placeholder="Please enter your name"
                      value={contactForm.name}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, name: e.target.value })
                      }
                      className="h-16 bg-[#F9F7F2] border-bhutan-gold/10 rounded-2xl px-6 font-medium focus:ring-bhutan-red focus:border-bhutan-red transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-bhutan-dark/40 uppercase tracking-[0.2em] ml-2">Phone Number</label>
                    <Input
                      type="tel"
                      placeholder="Enter phone with code"
                      value={contactForm.phone}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, phone: e.target.value })
                      }
                      className="h-16 bg-[#F9F7F2] border-bhutan-gold/10 rounded-2xl px-6 font-medium focus:ring-bhutan-red focus:border-bhutan-red transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-bhutan-dark/40 uppercase tracking-[0.2em] ml-2">Email Address</label>
                    <Input
                      type="email"
                      placeholder="yourname@gmail.com"
                      value={contactForm.email}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, email: e.target.value })
                      }
                      className="h-16 bg-[#F9F7F2] border-bhutan-gold/10 rounded-2xl px-6 font-medium focus:ring-bhutan-red focus:border-bhutan-red transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-bhutan-dark/40 uppercase tracking-[0.2em] ml-2">Your Message</label>
                    <Textarea
                      placeholder="How can we help you?"
                      value={contactForm.message}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, message: e.target.value })
                      }
                      rows={5}
                      className="bg-[#F9F7F2] border-bhutan-gold/10 rounded-2xl p-6 font-medium focus:ring-bhutan-red focus:border-bhutan-red transition-all resize-none"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-16 bg-bhutan-red hover:bg-bhutan-dark text-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden relative group disabled:opacity-70"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      {isSubmitting ? "Sending..." : "Send Inquiry Now"}
                      {!isSubmitting && <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-all" />}
                    </span>
                  </Button>
                </form>

                <div className="mt-12 pt-8 border-t border-bhutan-gold/10 text-center">
                  <p className="text-bhutan-dark/30 text-[10px] font-bold uppercase tracking-widest mb-6">Call directly</p>
                  <div className="space-y-4">
                    <a
                      href="tel:+97516111999"
                      className="flex items-center justify-center gap-4 py-4 rounded-2xl bg-[#F9F7F2] hover:bg-bhutan-gold/10 text-bhutan-dark transition-all duration-500 font-bold border border-bhutan-gold/5"
                    >
                      <Phone className="w-5 h-5 text-bhutan-red" />
                      <span>+975 1611 1999</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
