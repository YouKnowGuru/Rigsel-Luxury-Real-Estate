"use client";

import Link from "next/link";
import NextImage from "next/image";
import { motion } from "framer-motion";
import { Home, Building2, TreePine, Store, Hotel, ArrowRight } from "lucide-react";

const categories = [
  {
    id: "apartment",
    name: "Apartment",
    icon: Building2,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
    count: 89,
  },
  {
    id: "house",
    name: "House",
    icon: Home,
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
    count: 150,
  },
  {
    id: "land",
    name: "Land",
    icon: TreePine,
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
    count: 120,
  },
  {
    id: "commercial",
    name: "Commercial",
    icon: Store,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
    count: 45,
  },
  {
    id: "hotel",
    name: "Hotel",
    icon: Hotel,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
    count: 12,
  },
];

export function PropertyCategories() {
  return (
    <section className="section-padding bg-white dark:bg-[#111214] relative overflow-hidden">
      {/* Decorative Divider */}
      <div className="absolute top-0 left-0 right-0 flex justify-center py-4">
        <span className="text-bhutan-gold/40 tracking-widest text-lg font-serif">────────── ✦ ──────────</span>
      </div>

      <div className="container-luxury relative z-10 w-full max-w-7xl mx-auto">
        {/* Centered Heading */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-serif text-3xl md:text-4xl font-bold text-bhutan-dark dark:text-white mb-4"
          >
            Browse By Property Type
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-24 h-1 bg-bhutan-gold mx-auto rounded-full"
          />
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6 lg:gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative group overflow-hidden rounded-2xl md:rounded-[2rem] shadow-soft dark:shadow-lg dark:shadow-black/20 hover:shadow-2xl transition-all duration-500 bg-white dark:bg-[#1B1E23]"
            >
              <Link href={`/properties?type=${category.id}`} className="block w-full h-40 md:h-64 lg:h-80 relative">
                {/* Background Image */}
                <NextImage
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-[1.5s] group-hover:scale-110 ease-out"
                />

                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-bhutan-dark/90 via-bhutan-dark/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-700" />

                {/* Content */}
                <div className="absolute inset-0 p-3 md:p-6 flex flex-col justify-end text-center items-center">
                  <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center mb-2 md:mb-4 group-hover:bg-bhutan-red group-hover:scale-110 group-hover:border-bhutan-red transition-all duration-500 shadow-lg">
                    <category.icon className="w-5 h-5 md:w-8 md:h-8 text-white relative z-10" />
                  </div>

                  <h3 className="font-serif text-base md:text-2xl font-bold text-white mb-1 tracking-wide line-clamp-1">
                    {category.name}
                  </h3>

                  <div className="flex items-center gap-1 md:gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-4 group-hover:translate-y-0 text-bhutan-gold text-[9px] md:text-sm font-bold uppercase tracking-widest mt-1 md:mt-2">
                    Explore <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
