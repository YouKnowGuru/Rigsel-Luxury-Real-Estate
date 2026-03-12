"use client";

import { motion } from "framer-motion";
import NextImage from "next/image";
import { Shield, Award, Users, Clock, MapPin, CheckCircle2 } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "100% Verified",
    description: "Every property is checked by our team to make sure it is real and safe to buy.",
  },
  {
    icon: Award,
    title: "Best Properties",
    description: "We only show you the finest houses and land available across Bhutan.",
  },
  {
    icon: Users,
    title: "Expert Help",
    description: "Our friendly team will guide you through every step of buying or renting.",
  },
  {
    icon: Clock,
    title: "Fast Response",
    description: "We answer all your questions quickly, usually within a few hours.",
  },
  {
    icon: MapPin,
    title: "Local Knowledge",
    description: "We know every corner of Bhutan and can help you find the best location.",
  },
  {
    icon: CheckCircle2,
    title: "Easy Process",
    description: "We handle all the difficult paperwork for you, from start to finish.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="section-padding bg-gray-50 dark:bg-[#0C0D0F] relative overflow-hidden">
      {/* Decorative Gold Line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-bhutan-gold/20 to-transparent" />

      <div className="container-luxury relative z-10 w-full max-w-7xl mx-auto px-4">

        {/* Header Section */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="inline-block px-6 py-2 rounded-full bg-bhutan-red/5 dark:bg-bhutan-red/10 border border-bhutan-red/10 text-bhutan-red text-xs font-bold uppercase tracking-widest mb-6"
          >
            Why Choose Phojaa
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-bhutan-dark dark:text-white mb-4 md:mb-6"
          >
            We Help You Find <br />
            <span className="text-bhutan-red italic font-light">Your Dream Home</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-bhutan-dark/60 dark:text-white/50 max-w-2xl mx-auto text-lg"
          >
            Buying property is an important journey. We make it easy, safe, and exciting for everyone in Bhutan.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-white dark:bg-[#1B1E23] p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-bhutan-gold/10 hover:border-bhutan-gold/40 shadow-sm dark:shadow-lg dark:shadow-black/20 hover:shadow-2xl transition-all duration-500 relative overflow-hidden"
            >
              {/* Pattern Background Hover */}
              <div className="absolute inset-0 bg-thangka opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none" />

              <div className="relative z-10">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-bhutan-gold/10 flex items-center justify-center mb-6 md:mb-8 group-hover:bg-bhutan-red group-hover:scale-110 transition-all duration-500">
                  <feature.icon className="w-6 h-6 md:w-8 md:h-8 text-bhutan-red group-hover:text-white transition-colors" />
                </div>

                <h3 className="font-serif text-xl md:text-2xl font-bold text-bhutan-dark dark:text-white mb-4 group-hover:text-bhutan-red transition-colors">
                  {feature.title}
                </h3>

                <p className="text-bhutan-dark/60 dark:text-white/50 leading-relaxed mb-6">
                  {feature.description}
                </p>

                {/* Decorative Line */}
                <div className="w-10 h-1 bg-bhutan-gold/30 rounded-full group-hover:w-full transition-all duration-700" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Feature Image Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-20 relative rounded-[2rem] md:rounded-[3rem] overflow-hidden aspect-square md:aspect-[21/9] min-h-[400px] md:min-h-[300px] shadow-2xl"
        >
          <NextImage
            src="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=2000"
            alt="Bhutanese Landscape"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-bhutan-dark/80 md:from-bhutan-dark/60 to-transparent flex items-center px-6 md:px-20">
            <div className="max-w-md">
              <h3 className="text-white font-serif text-2xl md:text-3xl font-bold mb-3 md:mb-4">
                Trusted by 500+ <br /> Families in Bhutan
              </h3>
              <p className="text-white/80 text-sm md:text-lg mb-6 md:mb-8 line-clamp-2 md:line-clamp-none">
                Your trust is our greatest achievement. Let us help you find a place to call home.
              </p>
              <div className="flex gap-4 items-center">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                      <NextImage src={`https://i.pravatar.cc/150?u=${i}`} alt="user" width={40} height={40} />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-bhutan-gold font-bold text-sm">4.9/5 Rating</span>
                  <span className="text-white/60 text-xs">Based on 200+ reviews</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
