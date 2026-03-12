"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  ArrowUp,
} from "lucide-react";
import { Logo } from "./Logo";
import { useSettings } from "@/context/SettingsContext";

const propertyLinks = [
  { name: "All Properties", href: "/properties" },
  { name: "Houses", href: "/properties?type=house" },
  { name: "Apartments", href: "/properties?type=apartment" },
  { name: "Land", href: "/properties?type=land" },
  { name: "Hotel", href: "/properties?type=hotel" },
];

const companyLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Land Calculator", href: "/land-calculator" },
  { name: "Contact Us", href: "/contact" },
  { name: "Terms & Conditions", href: "/terms" },
  { name: "Admin Login", href: "/admin" },
];

const locations = [
  { name: "Paro", href: "/properties?district=Paro" },
  { name: "Punakha", href: "/properties?district=Punakha" },
  { name: "Phuntsholing", href: "/properties?district=Phuntsholing" },
];

export function Footer() {
  const pathname = usePathname();
  const { settings } = useSettings();
  const isAdminPage = pathname?.startsWith("/admin");

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isAdminPage) return null;

  return (
    <footer className="bg-[#0A0A0A] text-white relative pt-24 pb-12 overflow-hidden">
      {/* Pattern Divider Top */}
      <div className="absolute top-0 left-0 w-full h-1 bg-thangka opacity-20" />
      <div className="absolute top-1 left-0 w-full h-px bg-bhutan-gold/30" />

      <div className="container-luxury relative z-10 w-full max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-10 lg:gap-8 mb-20">

          {/* Brand & Mission */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Link href="/" className="flex items-center">
              <Logo size="lg" showText dark />
            </Link>
            <p className="text-white/50 text-base leading-relaxed max-w-xs">
              Phojaa Real Estate is a trusted real estate service dedicated to connecting property buyers and sellers in a transparent and reliable way.
            </p>
            <div className="flex gap-4 mt-2">
              <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:bg-bhutan-red hover:text-white transition-all border border-white/10 uppercase font-bold text-[10px]">
                <Facebook className="w-4 h-4" />
              </a>
              <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:bg-bhutan-red hover:text-white transition-all border border-white/10 uppercase font-bold text-[10px]">
                {/* SVG for TikTok since Lucide might not have a perfect match */}
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.17-3.8-5.46-.4-2.46.33-5.06 1.95-6.9 1.51-1.74 3.79-2.81 6.09-2.92v4.06c-1.05.08-2.07.6-2.73 1.39-.63.76-.94 1.83-.8 2.83.17 1.25.96 2.37 2.11 2.89 1.09.49 2.4.45 3.42-.1.97-.53 1.63-1.5 1.75-2.61.03-.31.02-.63.02-.94V.02zm-1.11 11.96c-.63-.09-1.27-.14-1.91-.14-1.84 0-3.6.8-4.8 2.31-1.36 1.72-1.9 4.07-1.35 6.2.47 1.86 1.66 3.48 3.32 4.41 1.01.56 2.17.85 3.35.84 1.53 0 3.01-.54 4.19-1.52.84-.71 1.47-1.7 1.77-2.76.22-.8.3-1.66.27-2.51V8.58c1.35 1.01 3.06 1.57 4.79 1.57V6.01c-.81 0-1.62-.16-2.39-.47-.79-.31-1.51-.78-2.09-1.38-.63-.64-1.11-1.43-1.42-2.3-.28-.8-.43-1.66-.46-2.52H12.56v11.97h-1.15z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="text-bhutan-gold font-bold text-sm uppercase tracking-widest mb-8">Company</h3>
            <ul className="flex flex-col gap-4">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-white/40 hover:text-white transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Properties Links */}
          <div className="lg:col-span-2">
            <h3 className="text-bhutan-gold font-bold text-sm uppercase tracking-widest mb-8">Properties</h3>
            <ul className="flex flex-col gap-4">
              {propertyLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-white/40 hover:text-white transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Location Links */}
          <div className="lg:col-span-2">
            <h3 className="text-bhutan-gold font-bold text-sm uppercase tracking-widest mb-8">Locations</h3>
            <ul className="flex flex-col gap-4">
              {locations.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-white/40 hover:text-white transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-2">
            <h3 className="text-bhutan-gold font-bold text-sm uppercase tracking-widest mb-8">Contact Us</h3>
            <ul className="flex flex-col gap-6">
              <li className="flex gap-4 items-start">
                <MapPin className="w-5 h-5 text-bhutan-red flex-shrink-0" />
                <span className="text-white/50 text-sm leading-relaxed">{settings.address}</span>
              </li>
              <li className="flex gap-4 items-start">
                <Phone className="w-5 h-5 text-bhutan-red flex-shrink-0" />
                <span className="text-white/50 text-sm leading-relaxed">{settings.phone}</span>
              </li>
              <li className="flex gap-4 items-start">
                <Mail className="w-5 h-5 text-bhutan-red flex-shrink-0" />
                <span className="text-white/50 text-sm leading-relaxed">{settings.email}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-white/20 text-xs font-medium">
            &copy; {new Date().getFullYear()} Phojaa Real Estate. All rights reserved.
          </div>
          <motion.button
            whileHover={{ y: -5 }}
            onClick={scrollToTop}
            className="flex items-center gap-3 text-bhutan-gold text-xs font-bold uppercase tracking-widest bg-white/5 px-6 py-3 rounded-full border border-white/10 hover:bg-white/10 transition-all"
          >
            Back to Top
            <ArrowUp className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
