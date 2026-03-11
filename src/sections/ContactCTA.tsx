"use client";

import { motion } from "framer-motion";
import { Phone, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

export function ContactCTA() {
  return (
    <section className="relative min-h-[500px] md:h-[600px] flex items-center overflow-hidden bg-bhutan-dark py-20 md:py-0">
      {/* Mountain Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=2000" // Himalayan mountains
          alt="Himalayan Mountains"
          className="w-full h-full object-cover opacity-40 grayscale-[20%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bhutan-dark via-bhutan-dark/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-bhutan-dark via-transparent to-bhutan-dark/20" />
      </div>

      {/* Bhutanese Pattern Overlay */}
      <div className="absolute inset-0 bg-thangka opacity-[0.05] z-10 mix-blend-overlay" />

      <div className="container-luxury relative z-20 w-full max-w-6xl mx-auto px-4">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-bhutan-gold/20 border border-bhutan-gold/30 text-bhutan-gold text-xs font-bold uppercase tracking-widest mb-8">
              Let's Talk
            </div>

            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight">
              Ready to find your <br />
              <span className="text-bhutan-gold italic font-light">Perfect Home?</span>
            </h2>

            <p className="text-white/70 text-lg md:text-xl font-light mb-10 md:mb-12 max-w-xl leading-relaxed">
              We are here to help you every step of the way. Call us or send a message to get started today.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 mb-16">
              <Link href="/contact" className="w-full sm:w-auto">
                <button className="w-full h-16 px-10 bg-bhutan-red text-white text-sm font-bold uppercase tracking-widest rounded-2xl hover:bg-white hover:text-bhutan-red transition-all duration-500 shadow-2xl group flex items-center justify-center gap-3">
                  Call Us Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </button>
              </Link>
              <Link href="/properties" className="w-full sm:w-auto">
                <button className="w-full h-16 px-10 border-2 border-white/20 text-white text-sm font-bold uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all duration-500 backdrop-blur-sm flex items-center justify-center">
                  See All Properties
                </button>
              </Link>
            </div>

            {/* Quick Contact Info */}
            <div className="flex flex-wrap gap-10">
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bhutan-gold group-hover:bg-bhutan-gold group-hover:text-bhutan-dark transition-all duration-500">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Phone Number</div>
                  <div className="text-white font-bold text-lg">+975 16111999</div>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bhutan-gold group-hover:bg-bhutan-gold group-hover:text-bhutan-dark transition-all duration-500">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Email Address</div>
                  <div className="text-white font-bold text-lg">phojaa95realestate@gmail.com</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Golden Corner */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-bhutan-gold/10 rounded-bl-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-bhutan-red/10 rounded-tr-full blur-3xl" />
    </section>
  );
}
