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
  X,
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
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [descriptionImageUrl, setDescriptionImageUrl] = useState<string | null>(null);
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
      <div className="min-h-screen bg-[#F9F7F2] dark:bg-background pt-32 pb-20">
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
    <div className="min-h-screen bg-[#F9F7F2] dark:bg-background pb-32">
      {/* Navigation Top Bar (Floating Style) */}
      <div className="fixed top-24 sm:top-28 left-0 right-0 z-40 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/80 dark:bg-card/80 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-2xl sm:rounded-3xl p-2 sm:p-4 shadow-xl flex items-center justify-between">
            <Link
              href="/properties"
              className="flex items-center gap-1.5 sm:gap-3 px-3 sm:px-6 py-1.5 sm:py-2.5 rounded-xl sm:rounded-2xl text-bhutan-dark/60 hover:text-bhutan-red hover:bg-bhutan-red/5 transition-all duration-500 font-medium"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 h-5" />
              <span className="text-xs sm:text-sm">Back to List</span>
            </Link>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={handleShare}
                className="w-9 h-9 sm:w-12 h-12 flex items-center justify-center rounded-xl sm:rounded-2xl bg-white dark:bg-card border border-bhutan-gold/10 dark:border-white/10 text-bhutan-dark/60 dark:text-foreground/60 hover:text-bhutan-gold hover:border-bhutan-gold/30 transition-all duration-500 shadow-sm"
              >
                <Share2 className="w-4 h-4 sm:w-5 h-5" />
              </button>
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="w-9 h-9 sm:w-12 h-12 flex items-center justify-center rounded-xl sm:rounded-2xl bg-white border border-bhutan-gold/10 transition-all duration-500 shadow-sm"
              >
                <Heart
                  className={`w-4 h-4 sm:w-5 h-5 ${isLiked ? "fill-bhutan-red text-bhutan-red" : "text-bhutan-dark/30"
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
            className="relative rounded-[3.5rem] overflow-hidden shadow-2xl border-8 border-white dark:border-card"
          >
            <Swiper
              modules={[Navigation, Pagination, Autoplay, EffectFade]}
              effect="fade"
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 6000 }}
              className="h-[300px] sm:h-[400px] md:h-[650px] lg:h-[750px] cursor-pointer"
            >
              {displayProperty.images.map((image, index) => (
                <SwiperSlide key={index} onClick={() => setSelectedImage(index)}>
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
            <div className="absolute bottom-4 left-2 md:bottom-12 md:left-12 z-20 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/90 dark:bg-card/90 backdrop-blur-xl rounded-lg md:rounded-2xl p-2 sm:p-3 md:p-5 shadow-2xl border border-white/50 dark:border-white/10"
              >
                <p className="text-bhutan-dark/40 text-[7px] md:text-[9px] font-bold uppercase tracking-[0.3em] mb-0.5 md:mb-1 text-center">Price</p>
                <p className="text-lg sm:text-xl md:text-3xl font-sans font-bold text-bhutan-red text-center">
                  {formatPrice(displayProperty.price)}
                </p>
              </motion.div>
            </div>

            {/* Sold Badge Overlay */}
            {displayProperty.isSold && (
              <div className="absolute inset-0 bg-bhutan-dark/40 backdrop-blur-[2px] z-10 flex items-center justify-center p-4 pointer-events-none">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-bhutan-red text-white px-4 md:px-8 py-1.5 md:py-3 rounded-xl md:rounded-2xl shadow-2xl border-2 md:border-4 border-white text-base md:text-2xl font-black uppercase tracking-[0.2em] rotate-[-5deg]"
                >
                  Sold Out
                </motion.div>
              </div>
            )}

            {/* Type Badge Overlay */}
            <div className="absolute top-4 left-4 md:top-8 md:left-8 z-20 flex flex-wrap gap-2 md:gap-4">
              <div className="px-3 md:px-6 py-1.5 md:py-2.5 bg-bhutan-red text-white text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] rounded-full shadow-xl">
                {displayProperty.propertyType}
              </div>
              {displayProperty.featured && (
                <div className="px-3 md:px-6 py-1.5 md:py-2.5 bg-bhutan-gold text-white text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] rounded-full shadow-xl flex items-center gap-2">
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
                <h1 className="font-serif text-2xl sm:text-3xl md:text-6xl font-bold text-bhutan-dark dark:text-foreground leading-tight break-words">
                  {displayProperty.title}
                </h1>
                <div className="flex items-center gap-3 text-bhutan-dark/60 dark:text-muted-foreground text-lg bg-white/50 dark:bg-card/50 w-fit px-6 py-3 rounded-2xl border border-bhutan-gold/10 dark:border-white/5">
                  <MapPin className="w-6 h-6 text-bhutan-gold" />
                  <span className="font-medium italic">{displayProperty.location}</span>
                </div>
              </motion.div>

              {/* Quick Spec Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 md:gap-8 p-4 sm:p-6 md:p-12 bg-white dark:bg-card rounded-[1.5rem] md:rounded-[3rem] shadow-sm border border-bhutan-gold/10 dark:border-white/5">
                <div className="space-y-1 md:space-y-3 text-center">
                  <div className="w-10 h-10 md:w-16 md:h-16 bg-[#F9F7F2] rounded-xl flex items-center justify-center mx-auto border border-bhutan-gold/5 group hover:bg-bhutan-red transition-all duration-500">
                    <Bed className="w-4 h-4 md:w-8 md:h-8 text-bhutan-gold group-hover:text-white transition-all duration-500" />
                  </div>
                  <p className="text-base sm:text-lg md:text-3xl font-serif font-bold text-bhutan-dark dark:text-foreground leading-none pt-2">{displayProperty.bedrooms}</p>
                  <p className="text-[7px] md:text-[10px] font-bold text-bhutan-dark/30 uppercase tracking-widest">Bedrooms</p>
                </div>
                <div className="space-y-1 md:space-y-3 text-center md:border-x border-bhutan-gold/10 px-1 md:px-8 border-l border-bhutan-gold/10">
                  <div className="w-10 h-10 md:w-16 md:h-16 bg-[#F9F7F2] rounded-xl flex items-center justify-center mx-auto border border-bhutan-gold/5 group hover:bg-bhutan-red transition-all duration-500">
                    <Bath className="w-4 h-4 md:w-8 md:h-8 text-bhutan-gold group-hover:text-white transition-all duration-500" />
                  </div>
                  <p className="text-base sm:text-lg md:text-3xl font-serif font-bold text-bhutan-dark dark:text-foreground leading-none pt-2">{displayProperty.bathrooms}</p>
                  <p className="text-[7px] md:text-[10px] font-bold text-bhutan-dark/30 uppercase tracking-widest">Baths</p>
                </div>
                <div className="space-y-1 md:space-y-3 text-center col-span-2 md:col-span-1 border-t md:border-t-0 pt-4 md:pt-0 mt-2 md:mt-0 border-bhutan-gold/10">
                  <div className="w-10 h-10 md:w-16 md:h-16 bg-[#F9F7F2] rounded-xl flex items-center justify-center mx-auto border border-bhutan-gold/5 group hover:bg-bhutan-red transition-all duration-500">
                    <Maximize className="w-4 h-4 md:w-8 md:h-8 text-bhutan-gold group-hover:text-white transition-all duration-500" />
                  </div>
                  <p className="text-base sm:text-lg md:text-3xl font-serif font-bold text-bhutan-dark dark:text-foreground leading-none pt-2">{displayProperty.area}</p>
                  <p className="text-[7px] md:text-[10px] font-bold text-bhutan-dark/30 uppercase tracking-widest">Area</p>
                </div>

                {/* Custom Specifications */}
                {displayProperty.specifications && displayProperty.specifications.length > 0 &&
                  displayProperty.specifications.map((spec, index) => (
                    <div key={index} className="space-y-1 md:space-y-3 text-center">
                      <div className="w-10 h-10 md:w-16 md:h-16 bg-[#F9F7F2] rounded-xl flex items-center justify-center mx-auto border border-bhutan-gold/5 group hover:bg-bhutan-red transition-all duration-500">
                        <Home className="w-4 h-4 md:w-8 md:h-8 text-bhutan-gold group-hover:text-white transition-all duration-500" />
                      </div>
                      <p className="text-base sm:text-lg md:text-3xl font-serif font-bold text-bhutan-dark dark:text-foreground leading-none pt-2">{spec.value}</p>
                      <p className="text-[7px] md:text-[10px] font-bold text-bhutan-dark/30 uppercase tracking-widest">{spec.label}</p>
                    </div>
                  ))
                }
              </div>

              {displayProperty.loanAvailable && displayProperty.loanAmount !== undefined && displayProperty.loanAmount > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-bhutan-gold/5 dark:bg-white/[0.02] border border-bhutan-gold/20 dark:border-white/10 rounded-[2rem] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6"
                >
                  <div className="space-y-2 text-center md:text-left">
                    <p className="text-bhutan-gold font-bold text-xs uppercase tracking-[0.3em]">Financial Assistance</p>
                    <h3 className="text-2xl font-serif font-bold text-bhutan-dark">Loan Support Available</h3>
                  </div>
                  <div className="bg-white dark:bg-card px-8 py-4 rounded-2xl shadow-sm border border-bhutan-gold/10 dark:border-white/5 text-center">
                    <p className="text-[10px] font-bold text-bhutan-dark/30 uppercase tracking-widest mb-1">Loan Amount</p>
                    <p className="text-2xl font-serif font-bold text-bhutan-red">Nu. {displayProperty.loanAmount.toLocaleString("en-IN")}</p>
                  </div>
                </motion.div>
              )}

              {/* Description Section */}
              <div className="space-y-8">
                <div className="flex items-center gap-6">
                  <h2 className="font-serif text-3xl font-bold text-bhutan-dark dark:text-foreground">About this property</h2>
                  <div className="h-px flex-1 bg-bhutan-gold/10" />
                </div>
                <div
                  onClick={(e) => {
                    const target = e.target as HTMLElement;
                    if (target.tagName === 'IMG') {
                        setDescriptionImageUrl((target as HTMLImageElement).src);
                    }
                  }}
                  className="text-bhutan-dark/80 dark:text-muted-foreground text-base md:text-lg leading-relaxed font-normal prose prose-bhutan dark:prose-invert max-w-none prose-p:my-4 w-full overflow-hidden break-words [&_img]:max-w-full [&_img]:cursor-pointer [&_img]:rounded-xl [&_iframe]:max-w-full [&_table]:max-w-full [&_*]:break-words"
                  dangerouslySetInnerHTML={{ __html: displayProperty.description }}
                />
              </div>

              {/* Features List */}
              <div className="space-y-8">
                <div className="flex items-center gap-6">
                  <h2 className="font-serif text-3xl font-bold text-bhutan-dark dark:text-foreground">Property Highlights</h2>
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
                       className="flex items-center gap-4 bg-white dark:bg-card p-5 rounded-2xl border border-white dark:border-white/5 shadow-sm hover:border-bhutan-gold/20 transition-all duration-500"
                    >
                      <div className="w-10 h-10 bg-bhutan-gold/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Check className="w-5 h-5 text-bhutan-gold" />
                      </div>
                       <span className="text-bhutan-dark/70 dark:text-muted-foreground font-medium text-lg">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Location Map (Themed) */}
              <div className="space-y-8">
                <div className="flex items-center gap-6">
                  <h2 className="font-serif text-3xl font-bold text-bhutan-dark dark:text-foreground">Our Location</h2>
                  <div className="h-px flex-1 bg-bhutan-gold/10" />
                </div>
                <div className="rounded-[2.5rem] overflow-hidden border-8 border-white dark:border-card shadow-xl h-[450px]">
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
                className="bg-white dark:bg-card rounded-[2rem] p-6 shadow-luxury border-2 border-white dark:border-white/10"
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
                    <h3 className="font-serif text-xl font-bold text-bhutan-dark dark:text-foreground">Dorji Wangchuk</h3>
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
                className="bg-white dark:bg-card rounded-[2rem] p-6 md:p-8 shadow-luxury border-2 border-white dark:border-white/10"
              >
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-bhutan-gold/10">
                  <div className="w-12 h-12 bg-bhutan-red/5 rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-bhutan-red" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-bhutan-dark dark:text-foreground">Send Inquiry</h3>
                    <p className="text-bhutan-dark/40 text-[9px] font-bold uppercase tracking-widest">Prompt Response Guaranteed</p>
                  </div>
                </div>

                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-bhutan-dark/40 dark:text-muted-foreground/40 uppercase tracking-[0.2em] ml-2">Your Name</label>
                    <Input
                      placeholder="Please enter your name"
                      value={contactForm.name}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, name: e.target.value })
                      }
                      className="h-16 bg-[#F9F7F2] dark:bg-background border-bhutan-gold/10 dark:border-white/10 rounded-2xl px-6 font-medium focus:ring-bhutan-red focus:border-bhutan-red transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-bhutan-dark/40 dark:text-muted-foreground/40 uppercase tracking-[0.2em] ml-2">Phone Number</label>
                    <Input
                      type="tel"
                      placeholder="Enter phone with code"
                      value={contactForm.phone}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, phone: e.target.value })
                      }
                      className="h-16 bg-[#F9F7F2] dark:bg-background border-bhutan-gold/10 dark:border-white/10 rounded-2xl px-6 font-medium focus:ring-bhutan-red focus:border-bhutan-red transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-bhutan-dark/40 dark:text-muted-foreground/40 uppercase tracking-[0.2em] ml-2">Email Address</label>
                    <Input
                      type="email"
                      placeholder="yourname@gmail.com"
                      value={contactForm.email}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, email: e.target.value })
                      }
                      className="h-16 bg-[#F9F7F2] dark:bg-background border-bhutan-gold/10 dark:border-white/10 rounded-2xl px-6 font-medium focus:ring-bhutan-red focus:border-bhutan-red transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-bhutan-dark/40 dark:text-muted-foreground/40 uppercase tracking-[0.2em] ml-2">Your Message</label>
                    <Textarea
                      placeholder="How can we help you?"
                      value={contactForm.message}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, message: e.target.value })
                      }
                      rows={5}
                      className="bg-[#F9F7F2] dark:bg-background border-bhutan-gold/10 dark:border-white/10 rounded-2xl p-6 font-medium focus:ring-bhutan-red focus:border-bhutan-red transition-all resize-none"
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
                      className="flex items-center justify-center gap-4 py-4 rounded-2xl bg-[#F9F7F2] dark:bg-background hover:bg-bhutan-gold/10 text-bhutan-dark dark:text-foreground transition-all duration-500 font-bold border border-bhutan-gold/5 dark:border-white/5"
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
      {/* Lightbox / Fullscreen Image Viewer */}
      <AnimatePresence>
        {(selectedImage !== null || descriptionImageUrl !== null) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4 md:p-8"
          >
            <button
              onClick={() => {
                setSelectedImage(null);
                setDescriptionImageUrl(null);
              }}
              className="absolute top-6 right-6 z-[110] w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="relative w-full max-w-6xl aspect-video md:aspect-[21/9] lg:aspect-auto lg:h-[80vh] flex items-center justify-center">
              <img
                src={selectedImage !== null ? displayProperty.images[selectedImage] : descriptionImageUrl!}
                alt={displayProperty.title}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>
            {/* Thumbnails */}
            {selectedImage !== null && (
              <div className="absolute bottom-6 left-0 right-0 max-w-3xl mx-auto px-4 w-full flex items-center justify-center gap-2 overflow-x-auto pb-4 custom-scrollbar">
                {displayProperty.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-20 h-16 md:w-24 md:h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === idx ? "border-bhutan-gold scale-105" : "border-transparent opacity-50 hover:opacity-100"}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
