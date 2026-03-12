"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  MessageSquare,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const contactInfo = [
  {
    icon: MapPin,
    title: "Visit Us",
    content: "Thimphu, Bhutan",
    subContent: "Near City Center",
  },
  {
    icon: Phone,
    title: "Call Us",
    content: "+975 16111999",
    subContent: "Mon - Sat, 9AM - 6PM",
  },
  {
    icon: Mail,
    title: "Email Us",
    content: "phojaa95realestate@gmail.com",
    subContent: "We reply within 24 hours",
  },
  {
    icon: Clock,
    title: "Open Hours",
    content: "Mon - Fri: 9AM - 6PM",
    subContent: "Saturday: 9AM - 1PM",
  },
];

const socialLinks = [
  { icon: Facebook, href: "https://www.facebook.com/share/1b2Fk7oC9q/ 2", label: "Facebook" },
  {
    icon: () => (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.17-3.8-5.46-.4-2.46.33-5.06 1.95-6.9 1.51-1.74 3.79-2.81 6.09-2.92v4.06c-1.05.08-2.07.6-2.73 1.39-.63.76-.94 1.83-.8 2.83.17 1.25.96 2.37 2.11 2.89 1.09.49 2.4.45 3.42-.1.97-.53 1.63-1.5 1.75-2.61.03-.31.02-.63.02-.94V.02zm-1.11 11.96c-.63-.09-1.27-.14-1.91-.14-1.84 0-3.6.8-4.8 2.31-1.36 1.72-1.9 4.07-1.35 6.2.47 1.86 1.66 3.48 3.32 4.41 1.01.56 2.17.85 3.35.84 1.53 0 3.01-.54 4.19-1.52.84-.71 1.47-1.7 1.77-2.76.22-.8.3-1.66.27-2.51V8.58c1.35 1.01 3.06 1.57 4.79 1.57V6.01c-.81 0-1.62-.16-2.39-.47-.79-.31-1.51-.78-2.09-1.38-.63-.64-1.11-1.43-1.42-2.3-.28-.8-.43-1.66-.46-2.52H12.56v11.97h-1.15z" clipRule="evenodd" />
      </svg>
    ),
    href: "https://tiktok.com/@phojaa95realestate",
    label: "TikTok"
  },
];

export default function ContactPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
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
          title: "Message Sent",
          description: "We will call you very soon.",
          variant: "success",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Please try again or call us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2] dark:bg-background pb-32">
      {/* Hero Section */}
      <section className="relative pt-40 pb-24 md:pt-56 md:pb-40 overflow-hidden">
        {/* Background Motifs */}
        <div className="absolute inset-0 bg-thangka opacity-[0.03] pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-4 bg-thangka opacity-[0.08] mt-24" />

        <div className="container-luxury relative z-10 w-full max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-block px-6 py-2 rounded-full bg-bhutan-red/10 border border-bhutan-red/20 text-bhutan-red text-[10px] font-bold uppercase tracking-[0.4em] mb-10 shadow-sm">
              Connect With Us
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-bhutan-dark dark:text-foreground mb-6 md:mb-8 leading-[1.15]">
              Talk to <br />
              <span className="text-bhutan-red italic font-light">Our Family</span>
            </h1>
            <p className="text-bhutan-dark/70 dark:text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed italic">
              "We are here to help you find your legacy. Ask us anything, we are ready to listen."
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Information & Form Layout */}
      <section className="px-6 -mt-12 relative z-10 mb-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

            {/* Sidebar: Icon Cards */}
            <div className="lg:col-span-4 space-y-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-card rounded-[2.5rem] p-8 shadow-xl border border-bhutan-gold/10 group hover:border-bhutan-red/20 transition-all duration-500"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-[#F9F7F2] dark:bg-background rounded-2xl flex items-center justify-center group-hover:bg-bhutan-red group-hover:text-white transition-all duration-500 border border-bhutan-gold/10">
                      <info.icon className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-serif text-xl font-bold text-bhutan-dark dark:text-foreground mb-1">
                        {info.title}
                      </h3>
                       <p className="text-bhutan-dark/80 dark:text-foreground/80 font-medium font-serif">{info.content}</p>
                       <p className="text-bhutan-dark/40 dark:text-muted-foreground/40 text-[9px] font-bold uppercase tracking-widest">{info.subContent}</p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Quick Call Card */}
              <div className="bg-bhutan-dark rounded-[3rem] p-10 overflow-hidden relative group shadow-3xl border-4 border-white mt-12">
                <div className="absolute inset-0 bg-thangka opacity-[0.05] pointer-events-none" />
                <h3 className="font-serif text-2xl font-bold text-white mb-4 relative z-10 italic">
                  Instant Support
                </h3>
                <p className="text-white/60 mb-10 font-light leading-relaxed relative z-10 text-sm">
                  Need a quick answer? Our team is active on phone right now.
                </p>
                <a
                  href="tel:+97516111999"
                  className="inline-flex items-center gap-4 bg-bhutan-red text-white px-10 py-5 rounded-2xl font-bold text-[10px] uppercase tracking-[0.4em] hover:bg-white hover:text-bhutan-red transition-all duration-500 relative z-10 shadow-xl"
                >
                  <Phone className="w-4 h-4" />
                  Call Us
                </a>
              </div>
            </div>

            {/* Main Content: Luxury Glass Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-8 bg-white/40 dark:bg-card/40 backdrop-blur-3xl rounded-[2rem] md:rounded-[4rem] p-8 md:p-16 lg:p-20 shadow-3xl border-4 border-white dark:border-white/10 overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-thangka opacity-[0.02] pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-bhutan-red/10 rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-bhutan-red" />
                  </div>
                  <div>
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-bhutan-dark dark:text-foreground">
                      Message Us
                    </h2>
                    <p className="text-bhutan-dark/50 dark:text-muted-foreground/50 text-[10px] font-bold uppercase tracking-[0.2em]">We respond very fast</p>
                  </div>
                </div>

                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-bhutan-red/5 rounded-[3rem] p-20 text-center border-2 border-bhutan-red/10"
                  >
                    <CheckCircle className="w-24 h-24 text-bhutan-red mx-auto mb-8" />
                    <h3 className="text-4xl font-serif font-bold text-bhutan-dark dark:text-foreground mb-4 tracking-tight">
                      Thank You
                    </h3>
                    <p className="text-bhutan-dark/60 dark:text-muted-foreground/60 text-xl font-light italic">
                      "We have received your message. One of our experts will call you very soon."
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8 md:space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-bhutan-dark/60 dark:text-muted-foreground/60 uppercase tracking-[0.3em] ml-6">Your Full Name</label>
                        <Input
                          placeholder="Karma Dorji"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="h-16 md:h-20 rounded-[1rem] md:rounded-[1.5rem] px-6 md:px-8 border-bhutan-gold/30 focus:ring-bhutan-red/20 focus:border-bhutan-red bg-white/80 dark:bg-card/80 shadow-lg text-base md:text-lg font-serif"
                          required
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-bhutan-dark/60 dark:text-muted-foreground/60 uppercase tracking-[0.3em] ml-6">Phone Number</label>
                        <Input
                          type="tel"
                          placeholder="17XXXXXX"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          className="h-16 md:h-20 rounded-[1rem] md:rounded-[1.5rem] px-6 md:px-8 border-bhutan-gold/30 focus:ring-bhutan-red/20 focus:border-bhutan-red bg-white/80 dark:bg-card/80 shadow-lg text-base md:text-lg font-serif"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-bhutan-dark/60 dark:text-muted-foreground/60 uppercase tracking-[0.3em] ml-6">Email Address</label>
                      <Input
                        type="email"
                        placeholder="yourname@email.bt"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="h-16 md:h-20 rounded-[1rem] md:rounded-[1.5rem] px-6 md:px-8 border-bhutan-gold/30 focus:ring-bhutan-red/20 focus:border-bhutan-red bg-white/80 dark:bg-card/80 shadow-lg text-base md:text-lg font-serif"
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-bhutan-dark/60 dark:text-muted-foreground/60 uppercase tracking-[0.3em] ml-6">How can we help you?</label>
                      <Input
                        placeholder="I want to buy a beautiful land..."
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData({ ...formData, subject: e.target.value })
                        }
                        className="h-16 md:h-20 rounded-[1rem] md:rounded-[1.5rem] px-6 md:px-8 border-bhutan-gold/30 focus:ring-bhutan-red/20 focus:border-bhutan-red bg-white/80 dark:bg-card/80 shadow-lg text-base md:text-lg font-serif"
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-bhutan-dark/60 dark:text-muted-foreground/60 uppercase tracking-[0.3em] ml-6">Message Details</label>
                      <Textarea
                        placeholder="Tell us more about what you are looking for..."
                        rows={6}
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        className="rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 border-bhutan-gold/30 focus:ring-bhutan-red/20 focus:border-bhutan-red bg-white/80 dark:bg-card/80 shadow-lg text-base md:text-lg font-serif resize-none italic"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-20 md:h-24 bg-bhutan-red text-white text-[10px] font-bold uppercase tracking-[0.5em] rounded-[1.5rem] md:rounded-[2rem] hover:bg-bhutan-dark transition-all duration-700 shadow-3xl shadow-bhutan-red/20 disabled:opacity-50 group flex items-center justify-center gap-4"
                    >
                      <Send className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-y-2 group-hover:translate-x-2 transition-transform duration-500" />
                      {isSubmitting ? "Sending..." : "Send Now"}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Modern Interactive Map Section */}
      <section className="py-24 px-6 md:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-card rounded-[4rem] overflow-hidden border-8 border-white dark:border-white/10 shadow-3xl group relative h-[600px]">
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              marginHeight={0}
              marginWidth={0}
              src="https://maps.google.com/maps?q=Thimphu,Bhutan&z=15&output=embed"
              className="grayscale-[0.6] group-hover:grayscale-0 transition-all duration-2000"
            />
            {/* Overlay Map Label */}
            <div className="absolute top-12 left-12 bg-bhutan-dark/90 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/20 shadow-2xl text-white">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-bhutan-red rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-serif text-2xl font-bold italic">Our Home</h4>
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Thimphu, Bhutan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Connection Footer CTA */}
      <section className="py-24 text-center px-6">
        <h3 className="font-serif text-4xl md:text-5xl font-bold text-bhutan-dark dark:text-foreground mb-12 italic">
          Join our <span className="text-bhutan-red">Community</span>
        </h3>
        <div className="flex flex-wrap justify-center gap-8">
          {socialLinks.map((social) => (
            <motion.a
              key={social.label}
              href={social.href}
              whileHover={{ y: -10, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="w-20 h-20 bg-white border border-bhutan-gold/10 rounded-[1.5rem] flex items-center justify-center text-bhutan-dark hover:bg-bhutan-red hover:text-white hover:border-bhutan-red shadow-xl transition-all duration-500"
            >
              <social.icon className="w-8 h-8" />
            </motion.a>
          ))}
        </div>
      </section>
    </div>
  );
}
