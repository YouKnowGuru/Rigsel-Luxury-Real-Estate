"use client";

import { motion } from "framer-motion";
import {
  Target,
  Eye,
  Heart,
  Award,
  ShieldCheck,
  Compass,
  Star,
  ArrowRight,
} from "lucide-react";
import NextImage from "next/image";
import Link from "next/link";

const values = [
  {
    icon: ShieldCheck,
    title: "Honesty",
    desc: "We are always truthful and fair in everything we do for our customers.",
  },
  {
    icon: Award,
    title: "Best Quality",
    desc: "We work hard to give you the very best service and the most beautiful homes.",
  },
  {
    icon: Heart,
    title: "We Care",
    desc: "Your happiness is what matters most to us. We treat you like family.",
  },
  {
    icon: Compass,
    title: "Simple Way",
    desc: "We make finding your home easy and fast with our expert help.",
  },
];

const milestones = [
  { year: "2015", event: "Phojaa Real Estate started with a vision for transparency" },
  { year: "2018", event: "Expanded services to connect more genuine buyers and sellers" },
  { year: "2021", event: "Helped over 500 clients find suitable land and properties" },
  { year: "2024", event: "Recognized for excellence and reliable real estate services" },
];

const commitments = [
  "Assisting buyers in finding the right land and property that matches their needs and budget.",
  "Connecting genuine buyers and sellers through clear communication and transparency.",
  "Providing reliable guidance throughout the buying and selling process.",
  "Ensuring proper documentation and smooth property transactions.",
  "Building long term relationships with clients based on trust, honesty, and professional service.",
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      {/* Hero Section */}
      <section className="relative pt-28 pb-16 md:pt-40 md:pb-24 overflow-hidden bg-white">
        <div className="absolute inset-0 bg-thangka opacity-[0.02] pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-bhutan-gold/5 rounded-full blur-[120px]" />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-bhutan-red/10 border border-bhutan-red/20 text-bhutan-red text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] mb-5 md:mb-8">
              Company Profile
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-bhutan-dark mb-3 md:mb-5 leading-[1.15] tracking-tight">
              PHOJAA REAL ESTATE
            </h1>
            <p className="text-bhutan-red text-lg md:text-xl italic font-light tracking-wide mb-6 md:mb-10">
              Transparency. Reliability. Excellence.
            </p>
            <div className="text-bhutan-dark/70 text-base md:text-lg leading-relaxed max-w-3xl mx-auto font-light space-y-3 text-left bg-[#F9F7F2] p-5 md:p-8 rounded-xl md:rounded-2xl border border-bhutan-gold/10">
              <p>
                Phojaa Real Estate is a trusted real estate service dedicated to connecting property buyers and sellers in a transparent and reliable way. We focus on helping clients find suitable land and property while ensuring that every transaction is clear, fair, and properly guided.
              </p>
              <p>
                Our company works closely with both buyers and sellers to make the property process simple and smooth. From identifying the right property to facilitating communication between both parties, we aim to create a comfortable and trustworthy experience for everyone involved.
              </p>
              <p>
                At Phojaa Real Estate, we understand that buying or selling land is an important decision. That is why we prioritize honesty, professionalism, and proper documentation in every deal.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Banner Image */}
      <section className="px-4 md:px-6 -mt-6 mb-16 md:mb-24">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative h-[180px] sm:h-[250px] md:h-[400px] rounded-xl md:rounded-3xl overflow-hidden shadow-xl"
          >
            <NextImage
              src="https://images.unsplash.com/photo-1541014741259-de529411b96a?w=1600"
              alt="Bhutanese Landscape"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bhutan-dark/50 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-12 md:py-20 bg-white">
        <div className="w-full max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#F9F7F2] rounded-xl md:rounded-2xl p-5 md:p-8 border border-bhutan-gold/10 group hover:border-bhutan-red/20 transition-all duration-500"
            >
              <div className="w-10 h-10 md:w-14 md:h-14 bg-bhutan-red/10 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:bg-bhutan-red transition-colors duration-500">
                <Target className="w-5 h-5 md:w-7 md:h-7 text-bhutan-red group-hover:text-white transition-colors" />
              </div>
              <h2 className="font-serif text-xl md:text-2xl font-bold text-bhutan-dark mb-3 md:mb-4">
                Our Mission
              </h2>
              <p className="text-bhutan-dark/60 text-base md:text-lg font-light leading-relaxed">
                To connect buyers and sellers through transparency, reliability, and excellence in real estate services, ensuring smooth transactions and building trust in every deal.
              </p>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-[#F9F7F2] rounded-xl md:rounded-2xl p-5 md:p-8 border border-bhutan-gold/10 group hover:border-bhutan-gold/30 transition-all duration-500"
            >
              <div className="w-10 h-10 md:w-14 md:h-14 bg-bhutan-gold/10 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:bg-bhutan-gold transition-colors duration-500">
                <Eye className="w-5 h-5 md:w-7 md:h-7 text-bhutan-gold group-hover:text-white transition-colors" />
              </div>
              <h2 className="font-serif text-xl md:text-2xl font-bold text-bhutan-dark mb-3 md:mb-4">
                Our Vision
              </h2>
              <p className="text-bhutan-dark/60 text-base md:text-lg font-light leading-relaxed">
                To be a trusted real estate company that connects buyers and sellers, helping people find the right property while building strong communities and lasting value.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-12 md:py-20 bg-[#F9F7F2]">
        <div className="w-full max-w-6xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-12"
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-bhutan-gold/10 border border-bhutan-gold/20 text-bhutan-gold-dark text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
              What We Stand For
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-bhutan-dark">
              Our <span className="text-bhutan-red italic font-light">Values</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
            {values.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-bhutan-gold/10 hover:border-bhutan-red/20 hover:shadow-md transition-all group text-center"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 bg-bhutan-red/5 rounded-xl flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:bg-bhutan-red transition-colors duration-500">
                  <item.icon className="w-4 h-4 md:w-5 md:h-5 text-bhutan-red group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-serif text-sm md:text-lg font-bold text-bhutan-dark mb-1 md:mb-2">{item.title}</h3>
                <p className="text-bhutan-dark/50 text-[10px] md:text-sm font-light leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Commitment */}
      <section className="py-12 md:py-20 bg-white">
        <div className="w-full max-w-4xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-12"
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-bhutan-red/10 border border-bhutan-red/20 text-bhutan-red text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
              Our Commitment
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-bhutan-dark mb-3">
              What We <span className="text-bhutan-red italic font-light">Do</span>
            </h2>
            <p className="text-bhutan-dark/50 text-sm md:text-base font-light max-w-2xl mx-auto">
              At Phojaa Real Estate, we strive to be your reliable partner throughout every stage of your property journey.
            </p>
          </motion.div>

          <div className="space-y-3 md:space-y-4">
            {commitments.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="flex items-start gap-3 md:gap-4 bg-[#F9F7F2] p-3.5 md:p-5 rounded-xl md:rounded-2xl border border-bhutan-gold/10 hover:border-bhutan-gold/25 hover:shadow-sm transition-all"
              >
                <div className="flex-shrink-0 w-7 h-7 md:w-9 md:h-9 bg-bhutan-red/10 rounded-full flex items-center justify-center">
                  <span className="text-bhutan-red font-serif font-bold text-xs md:text-sm">{index + 1}</span>
                </div>
                <p className="text-bhutan-dark/70 text-base md:text-lg leading-relaxed pt-0.5">
                  {item}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-12 md:py-20 bg-[#F9F7F2]">
        <div className="w-full max-w-5xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-12"
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-bhutan-gold/10 border border-bhutan-gold/20 text-bhutan-gold-dark text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
              Our Journey
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-bhutan-dark">
              How We <span className="text-bhutan-gold italic font-light">Grew</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-bhutan-gold/10 hover:border-bhutan-red/20 hover:shadow-md transition-all group text-center"
              >
                <span className="text-2xl md:text-4xl font-serif font-black text-bhutan-gold/15 group-hover:text-bhutan-red/20 transition-colors block mb-2 md:mb-3">
                  {milestone.year}
                </span>
                <p className="text-bhutan-dark/70 text-[11px] md:text-sm font-medium leading-relaxed">
                  {milestone.event}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="w-full max-w-5xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-12"
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-bhutan-red/10 border border-bhutan-red/20 text-bhutan-red text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
              Our Leaders
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-bhutan-dark">
              Meet the <span className="text-bhutan-red italic font-light">Team</span>
            </h2>
          </motion.div>

          <div className="space-y-5 md:space-y-8">
            {[
              {
                name: "Jigme Rabgay",
                role: "Proprietor",
                image: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=600",
                desc: "Jigme Rabgay is the founder and driving force behind Phojaa Real Estate. With a strong vision for connecting buyers and sellers, he brings extensive knowledge of the property market and a deep commitment to transparency and trust. He combines a solid background in construction with exposure to advanced architectural and interior design concepts from countries such as Australia, Vietnam, Singapore, and Thailand.",
                quote: "Building trust, one property at a time, with fairness at the core of every deal.",
              },
              {
                name: "Dorji Wangchuk",
                role: "General Manager (GM)",
                image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=600",
                desc: "Dorji Wangchuk manages the daily operations of Phojaa Real Estate, ensuring smooth and efficient property transactions. With expertise in client relations and real estate management, he is dedicated to providing personalized support while maintaining the highest standards of professionalism.",
                quote: "Turning property dreams into reality with clarity and care.",
              },
            ].map((member) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col sm:flex-row items-center gap-5 md:gap-8 bg-[#F9F7F2] p-4 md:p-8 rounded-xl md:rounded-2xl border border-bhutan-gold/10 hover:shadow-lg transition-all group"
              >
                <div className="w-28 h-28 md:w-44 md:h-44 flex-shrink-0 rounded-xl md:rounded-2xl overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <div className="flex-1 text-center sm:text-left space-y-2 md:space-y-3">
                  <p className="text-bhutan-gold text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em]">{member.role}</p>
                  <h3 className="font-serif text-lg md:text-2xl font-bold text-bhutan-dark">{member.name}</h3>
                  <div className="h-px w-10 bg-bhutan-gold/20 mx-auto sm:mx-0" />
                  <p className="text-bhutan-dark/60 text-xs md:text-sm leading-relaxed font-light">
                    {member.desc}
                  </p>
                  <p className="text-bhutan-red text-sm md:text-base italic font-serif font-semibold pt-1">
                    &ldquo;{member.quote}&rdquo;
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-20 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-bhutan-dark rounded-2xl md:rounded-3xl p-8 md:p-16 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-thangka opacity-[0.04] pointer-events-none" />
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-bhutan-red/20 rounded-full blur-[80px]" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-bhutan-gold/10 rounded-full blur-[80px]" />

            <div className="relative z-10 space-y-5 md:space-y-8">
              <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
                Ready to find <br />
                <span className="text-bhutan-gold italic font-light">Your Legacy?</span>
              </h2>
              <p className="text-white/60 text-sm md:text-base font-light max-w-md mx-auto">
                Whether you want to buy land or a beautiful house, our team is here to help.
              </p>
              <div className="flex flex-row gap-3 md:gap-5 justify-center max-w-sm mx-auto">
                <Link href="/contact" className="flex-1">
                  <button className="w-full py-3 md:py-4 px-4 bg-bhutan-red text-white text-[9px] md:text-[10px] font-bold uppercase tracking-wider rounded-xl md:rounded-2xl hover:bg-white hover:text-bhutan-red transition-all duration-500 shadow-lg">
                    Talk to Us
                  </button>
                </Link>
                <Link href="/properties" className="flex-1">
                  <button className="w-full py-3 md:py-4 px-4 border border-white/15 text-white text-[9px] md:text-[10px] font-bold uppercase tracking-wider rounded-xl md:rounded-2xl hover:bg-white/10 transition-all duration-500">
                    Properties
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
