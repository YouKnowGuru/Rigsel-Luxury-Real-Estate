"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Search, MapPin, Home, DollarSign, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const districts = [
  "All Districts",
  "Thimphu",
  "Paro",
  "Punakha",
  "Phuntsholing",
  "Gelephu",
];

// propertyTypes will be fetched from API
interface IPropertyType {
  _id: string;
  name: string;
  slug: string;
}

const priceRanges = [
  { label: "Any Price", min: 0, max: 0 },
  { label: "Under Nu. 5M", min: 0, max: 5000000 },
  { label: "Nu. 5M - 10M", min: 5000000, max: 10000000 },
  { label: "Nu. 10M - 20M", min: 10000000, max: 20000000 },
  { label: "Above Nu. 20M", min: 20000000, max: 0 },
];

export function Hero() {
  const router = useRouter();
  const [selectedDistrict, setSelectedDistrict] = useState("All Districts");
  const [selectedType, setSelectedType] = useState("All Types");
  const [propertyTypes, setPropertyTypes] = useState<string[]>(["All Types"]);
  const [selectedPrice, setSelectedPrice] = useState(priceRanges[0]);
  const [isDistrictOpen, setIsDistrictOpen] = useState(false);
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);

  useEffect(() => {
    fetch("/api/property-types")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPropertyTypes(["All Types", ...data.data.map((t: any) => t.name)]);
        }
      })
      .catch(console.error);
  }, []);

  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 1000], ["0%", "20%"]);
  const textY = useTransform(scrollY, [0, 500], ["0%", "50%"]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  const closeAll = () => {
    setIsDistrictOpen(false);
    setIsTypeOpen(false);
    setIsPriceOpen(false);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedDistrict !== "All Districts") params.append("district", selectedDistrict);
    if (selectedType !== "All Types") params.append("type", selectedType.toLowerCase());
    if (selectedPrice.min > 0) params.append("minPrice", selectedPrice.min.toString());
    if (selectedPrice.max > 0) params.append("maxPrice", selectedPrice.max.toString());
    router.push(`/properties?${params.toString()}`);
  };

  const dropdowns = [
    { label: "Location", value: selectedDistrict, icon: MapPin, open: isDistrictOpen, setOpen: (v: boolean) => { setIsDistrictOpen(v); setIsTypeOpen(false); setIsPriceOpen(false); }, data: districts, setter: setSelectedDistrict },
    { label: "Type", value: selectedType, icon: Home, open: isTypeOpen, setOpen: (v: boolean) => { setIsTypeOpen(v); setIsDistrictOpen(false); setIsPriceOpen(false); }, data: propertyTypes, setter: setSelectedType },
    { label: "Price", value: selectedPrice.label, icon: DollarSign, open: isPriceOpen, setOpen: (v: boolean) => { setIsPriceOpen(v); setIsDistrictOpen(false); setIsTypeOpen(false); }, data: priceRanges, setter: setSelectedPrice, isPrice: true },
  ];

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
      {/* Background with Parallax */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 z-0 w-full h-[120%] -top-[10%]"
      >
        <Image
          src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2674&auto=format&fit=crop"
          alt="Bhutan Mountains"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bhutan-dark via-bhutan-dark/60 to-bhutan-dark/20 z-10" />
        <div className="absolute inset-0 bg-thangka opacity-20 mix-blend-overlay z-10 pointer-events-none" />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-20 w-full max-w-6xl mx-auto flex flex-col items-center justify-center text-center px-4 pt-24 pb-16 md:pt-28 md:pb-20"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block py-1 px-4 md:px-6 rounded-full bg-white/10 backdrop-blur-md border border-bhutan-gold/30 text-bhutan-gold text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] mb-4 md:mb-6">
            The Best Real Estate in Bhutan
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 md:mb-5 leading-[1.15] max-w-4xl"
        >
          Find Your Dream Property in{" "}
          <span className="text-bhutan-gold italic font-light">Bhutan</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-base md:text-lg text-white/80 mb-6 md:mb-10 max-w-xl font-light tracking-wide"
        >
          Beautiful houses, apartments, and land across the Land of the Thunder Dragon.
        </motion.p>

        {/* Search Bar - Compact on Mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full max-w-4xl mb-6 md:mb-10"
        >
          {/* Desktop: Horizontal bar */}
          <div className="hidden md:flex bg-white/10 backdrop-blur-xl rounded-2xl p-2 border border-white/20 shadow-2xl gap-2">
            {dropdowns.map((item, idx) => (
              <div key={idx} className="relative flex-1">
                <button
                  onClick={() => item.setOpen(!item.open)}
                  className="w-full flex items-center justify-between bg-white/90 hover:bg-white rounded-xl px-4 py-3 text-bhutan-dark transition-all group/btn"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-bhutan-red/10 flex items-center justify-center group-hover/btn:bg-bhutan-red transition-colors">
                      <item.icon className="w-3.5 h-3.5 text-bhutan-red group-hover/btn:text-white transition-colors" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-[8px] text-gray-400 font-bold uppercase tracking-widest leading-none mb-0.5">{item.label}</span>
                      <span className="font-semibold text-xs leading-none">{item.value}</span>
                    </div>
                  </div>
                  <ChevronDown className={cn("w-3.5 h-3.5 text-gray-400 transition-transform", item.open && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {item.open && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-[100]"
                    >
                      <div className="max-h-48 overflow-y-auto py-1">
                        {item.data.map((option: any) => (
                          <button
                            key={item.isPrice ? option.label : option}
                            onClick={() => { item.setter(option); item.setOpen(false); }}
                            className={cn(
                              "w-full text-left px-4 py-2.5 text-sm transition-all",
                              (item.isPrice ? item.value === option.label : item.value === option)
                                ? "bg-bhutan-red/5 text-bhutan-red font-bold"
                                : "text-gray-600 hover:bg-gray-50"
                            )}
                          >
                            {item.isPrice ? option.label : option}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            <button
              onClick={handleSearch}
              className="w-28 bg-bhutan-red hover:bg-bhutan-red/90 text-white rounded-xl flex items-center justify-center group overflow-hidden relative"
            >
              <Search className="w-5 h-5 group-hover:scale-110 transition-transform relative z-10" />
            </button>
          </div>

          {/* Mobile: Stacked compact selects */}
          <div className="md:hidden bg-white/10 backdrop-blur-xl rounded-xl p-2 border border-white/20 shadow-xl space-y-1.5">
            {dropdowns.map((item, idx) => (
              <div key={idx} className="relative">
                <button
                  onClick={() => item.setOpen(!item.open)}
                  className="w-full flex items-center justify-between bg-white/90 rounded-lg px-3 py-2.5 text-bhutan-dark"
                >
                  <div className="flex items-center gap-2">
                    <item.icon className="w-3.5 h-3.5 text-bhutan-red" />
                    <div className="flex items-center gap-1.5">
                      <span className="text-[8px] text-gray-400 font-bold uppercase tracking-wider">{item.label}:</span>
                      <span className="font-semibold text-[11px]">{item.value}</span>
                    </div>
                  </div>
                  <ChevronDown className={cn("w-3 h-3 text-gray-400 transition-transform", item.open && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {item.open && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden bg-white rounded-lg mt-1 shadow-lg border border-gray-100 z-[100] relative"
                    >
                      <div className="max-h-36 overflow-y-auto py-1">
                        {item.data.map((option: any) => (
                          <button
                            key={item.isPrice ? option.label : option}
                            onClick={() => { item.setter(option); item.setOpen(false); }}
                            className={cn(
                              "w-full text-left px-3 py-2 text-xs transition-all",
                              (item.isPrice ? item.value === option.label : item.value === option)
                                ? "bg-bhutan-red/5 text-bhutan-red font-bold"
                                : "text-gray-600 hover:bg-gray-50"
                            )}
                          >
                            {item.isPrice ? option.label : option}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            <button
              onClick={handleSearch}
              className="w-full py-2.5 bg-bhutan-red hover:bg-bhutan-red/90 text-white rounded-lg flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider"
            >
              <Search className="w-3.5 h-3.5" />
              Search
            </button>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-row items-center gap-3 md:gap-5 w-full max-w-md"
        >
          <Link href="/properties" className="flex-1">
            <button className="w-full px-4 md:px-8 py-3 md:py-4 bg-bhutan-red text-white font-bold rounded-full transition-all duration-500 hover:bg-red-800 shadow-lg flex items-center justify-center group relative overflow-hidden border border-bhutan-gold/30">
              <span className="relative z-10 uppercase tracking-[0.15em] md:tracking-[0.2em] text-[9px] md:text-[10px]">Browse Properties</span>
            </button>
          </Link>

          <Link href="/contact" className="flex-1">
            <button className="w-full px-4 md:px-8 py-3 md:py-4 bg-transparent text-white font-bold rounded-full transition-all duration-500 border border-white/30 hover:border-bhutan-gold hover:bg-white/10 flex items-center justify-center group">
              <span className="relative z-10 uppercase tracking-[0.15em] md:tracking-[0.2em] text-[9px] md:text-[10px] group-hover:text-bhutan-gold transition-colors">Contact Us</span>
            </button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Decorative Arrow Down */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        style={{ opacity, y: textY }}
        className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-[8px] md:text-[9px] text-white/50 uppercase tracking-[0.3em] font-bold">Discover</span>
        <div className="w-px h-10 md:h-16 bg-gradient-to-b from-bhutan-gold/80 to-transparent animate-pulse" />
      </motion.div>
    </section>
  );
}
