"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calculator,
  ArrowRightLeft,
  Info,
  RotateCcw,
  TrendingUp,
  Ruler,
  ArrowRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";

const landConversions = {
  sqmToDecimal: (sqm: number): number => sqm / 40.47,
  decimalToAcre: (decimal: number): number => decimal / 100,
  acreToDecimal: (acre: number): number => acre * 100,
  decimalToSqm: (decimal: number): number => decimal * 40.47,
  sqmToSqft: (sqm: number): number => sqm * 10.7639,
  sqftToSqm: (sqft: number): number => sqft / 10.7639,
};

export default function LandCalculatorPage() {
  const [squareMeters, setSquareMeters] = useState<string>("");
  const [decimals, setDecimals] = useState<string>("");
  const [acres, setAcres] = useState<string>("");
  const [squareFeet, setSquareFeet] = useState<string>("");
  const [pricePerDecimal, setPricePerDecimal] = useState<string>("");
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [activeField, setActiveField] = useState<string>("sqm");

  const handleSqmChange = (value: string) => {
    setSquareMeters(value);
    setActiveField("sqm");
    const sqm = parseFloat(value) || 0;
    setDecimals(landConversions.sqmToDecimal(sqm).toFixed(4));
    setAcres(landConversions.decimalToAcre(landConversions.sqmToDecimal(sqm)).toFixed(6));
    setSquareFeet(landConversions.sqmToSqft(sqm).toFixed(2));
  };

  const handleDecimalChange = (value: string) => {
    setDecimals(value);
    setActiveField("decimal");
    const decimal = parseFloat(value) || 0;
    setSquareMeters(landConversions.decimalToSqm(decimal).toFixed(2));
    setAcres(landConversions.decimalToAcre(decimal).toFixed(6));
    setSquareFeet(landConversions.sqmToSqft(landConversions.decimalToSqm(decimal)).toFixed(2));
  };

  const handleAcreChange = (value: string) => {
    setAcres(value);
    setActiveField("acre");
    const acre = parseFloat(value) || 0;
    const decimal = landConversions.acreToDecimal(acre);
    setDecimals(decimal.toFixed(4));
    setSquareMeters(landConversions.decimalToSqm(decimal).toFixed(2));
    setSquareFeet(landConversions.sqmToSqft(landConversions.decimalToSqm(decimal)).toFixed(2));
  };

  const handleSqftChange = (value: string) => {
    setSquareFeet(value);
    setActiveField("sqft");
    const sqft = parseFloat(value) || 0;
    const sqm = landConversions.sqftToSqm(sqft);
    setSquareMeters(sqm.toFixed(2));
    setDecimals(landConversions.sqmToDecimal(sqm).toFixed(4));
    setAcres(landConversions.decimalToAcre(landConversions.sqmToDecimal(sqm)).toFixed(6));
  };

  useEffect(() => {
    const decimal = parseFloat(decimals) || 0;
    const price = parseFloat(pricePerDecimal) || 0;
    setTotalPrice(decimal * price);
  }, [decimals, pricePerDecimal]);

  const resetCalculator = () => {
    setSquareMeters("");
    setDecimals("");
    setAcres("");
    setSquareFeet("");
    setPricePerDecimal("");
    setTotalPrice(0);
  };

  const fields = [
    { label: "Square Meters (m²)", value: squareMeters, handler: handleSqmChange, unit: "m²", field: "sqm" },
    { label: "Decimals", value: decimals, handler: handleDecimalChange, unit: "decimal", field: "decimal" },
    { label: "Acres", value: acres, handler: handleAcreChange, unit: "acre", field: "acre" },
    { label: "Square Feet (ft²)", value: squareFeet, handler: handleSqftChange, unit: "ft²", field: "sqft" },
  ];

  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      {/* Hero */}
      <section className="relative pt-28 pb-8 md:pt-36 md:pb-12 overflow-hidden bg-white">
        <div className="absolute inset-0 bg-thangka opacity-[0.02] pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-bhutan-gold/5 rounded-full blur-[120px]" />

        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-bhutan-gold/10 border border-bhutan-gold/20 text-bhutan-gold-dark text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] mb-5 md:mb-6">
              <Calculator className="w-3 h-3" />
              Precision Tools
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-bhutan-dark mb-3 md:mb-4 leading-tight">
              Land <span className="text-bhutan-red italic font-light">Calculator</span>
            </h1>
            <p className="text-bhutan-dark/50 text-base md:text-lg max-w-lg mx-auto font-light">
              Convert land measurements with precision. Calibrated for Bhutanese property standards.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-8 md:py-16">
        <div className="w-full max-w-5xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-8">
            {/* Unit Converter Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl md:rounded-2xl p-5 md:p-8 border border-bhutan-gold/10 shadow-sm"
            >
              <div className="flex items-center justify-between mb-5 md:mb-8">
                <h2 className="font-serif text-lg md:text-xl font-bold text-bhutan-dark">
                  Unit Converter
                </h2>
                <button
                  onClick={resetCalculator}
                  className="flex items-center gap-1.5 text-bhutan-red hover:bg-bhutan-red/5 px-3 py-1.5 rounded-lg text-[9px] md:text-[10px] font-bold uppercase tracking-wider transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              </div>

              <div className="space-y-4 md:space-y-5">
                {fields.map((item, idx) => (
                  <div key={item.field}>
                    <label className="text-[9px] md:text-[10px] font-bold text-bhutan-dark/35 uppercase tracking-[0.15em] mb-1.5 block pl-1">
                      {item.label}
                    </label>
                    <div className="relative">
                      <Ruler className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-bhutan-gold/50" />
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={item.value}
                        onChange={(e) => item.handler(e.target.value)}
                        className={`h-11 md:h-12 rounded-lg md:rounded-xl pl-10 md:pl-12 pr-14 bg-[#F9F7F2] border-bhutan-gold/10 focus:ring-bhutan-red/20 focus:border-bhutan-red text-sm md:text-base font-serif ${activeField === item.field ? "border-bhutan-red/40 bg-bhutan-red/[0.02]" : ""
                          }`}
                      />
                      <span className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-bhutan-dark/20 text-[10px] md:text-xs font-bold">
                        {item.unit}
                      </span>
                    </div>
                    {idx < fields.length - 1 && (
                      <div className="flex justify-center my-1.5">
                        <ArrowRightLeft className="w-3 h-3 text-bhutan-gold/25 rotate-90" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Price Calculator Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="space-y-5 md:space-y-6"
            >
              <div className="bg-white rounded-xl md:rounded-2xl p-5 md:p-8 border border-bhutan-gold/10 shadow-sm">
                <div className="flex items-center gap-3 mb-5 md:mb-8">
                  <div className="w-9 h-9 md:w-11 md:h-11 bg-bhutan-gold/10 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-bhutan-gold" />
                  </div>
                  <h2 className="font-serif text-lg md:text-xl font-bold text-bhutan-dark">
                    Price Estimator
                  </h2>
                </div>

                {/* Area Summary */}
                <div className="p-4 md:p-5 bg-[#F9F7F2] rounded-xl border border-dashed border-bhutan-gold/20 mb-5 md:mb-6">
                  <p className="text-[9px] md:text-[10px] font-bold text-bhutan-dark/35 uppercase tracking-widest mb-2">Total Area</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl md:text-2xl font-serif font-bold text-bhutan-dark">
                      {decimals ? parseFloat(decimals).toFixed(4) : "0.0000"}
                    </span>
                    <span className="text-bhutan-red text-xs italic font-serif">decimals</span>
                  </div>
                  <p className="text-bhutan-dark/30 text-[10px] md:text-xs font-light mt-1">
                    = {squareMeters ? parseFloat(squareMeters).toFixed(1) : "0"} m²
                  </p>
                </div>

                {/* Price input */}
                <div className="mb-5 md:mb-6">
                  <label className="text-[9px] md:text-[10px] font-bold text-bhutan-dark/35 uppercase tracking-[0.15em] mb-1.5 block pl-1">
                    Price per Decimal (Nu.)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-[10px] md:text-xs font-bold text-bhutan-gold/50">Nu</span>
                    <Input
                      type="number"
                      placeholder="Market rate..."
                      value={pricePerDecimal}
                      onChange={(e) => setPricePerDecimal(e.target.value)}
                      className="h-11 md:h-12 rounded-lg md:rounded-xl pl-10 md:pl-12 bg-[#F9F7F2] border-bhutan-gold/10 focus:ring-bhutan-red/20 focus:border-bhutan-red font-serif text-sm md:text-base"
                    />
                  </div>
                </div>

                {/* Total Result */}
                <div className="bg-bhutan-dark rounded-xl md:rounded-2xl p-5 md:p-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-thangka opacity-[0.04] pointer-events-none" />
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-bhutan-gold/15 rounded-full blur-[60px]" />

                  <p className="text-white/35 text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-2 relative z-10">Total Valuation</p>
                  <p className="text-2xl md:text-3xl font-serif font-bold text-bhutan-gold relative z-10">
                    {formatPrice(totalPrice)}
                  </p>
                  <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2 relative z-10">
                    <Info className="w-3 h-3 text-bhutan-gold/60" />
                    <p className="text-white/30 text-[9px] md:text-[10px] font-light">Estimated based on entered rate</p>
                  </div>
                </div>

                <Link href="/contact" className="block mt-4 md:mt-5">
                  <button className="w-full py-3 md:py-3.5 bg-bhutan-red text-white text-[9px] md:text-[10px] font-bold uppercase tracking-wider rounded-xl hover:bg-bhutan-dark transition-all duration-500 flex items-center justify-center gap-2">
                    Get Market Appraisal
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
              </div>

              {/* Info Card */}
              <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-bhutan-gold/10">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-bhutan-dark rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                    <Info className="w-4 h-4 md:w-5 md:h-5 text-bhutan-gold" />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm md:text-base font-bold text-bhutan-dark mb-1">Heritage Units</h4>
                    <p className="text-bhutan-dark/50 text-xs md:text-sm font-light leading-relaxed">
                      In Bhutan, land is measured in <span className="text-bhutan-red font-medium italic">decimals</span>.
                      1 decimal = 435.6 ft². A full acre = 100 decimals.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Reference Table */}
      <section className="py-10 md:py-16 bg-white">
        <div className="w-full max-w-5xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-12"
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-bhutan-red/10 border border-bhutan-red/20 text-bhutan-red text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
              Reference Table
            </div>
            <h2 className="font-serif text-xl md:text-3xl font-bold text-bhutan-dark">
              Standard <span className="text-bhutan-red italic font-light">Conversions</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-4">
            {[
              { from: "1 Decimal", to: "40.47 m²" },
              { from: "1 Decimal", to: "435.6 ft²" },
              { from: "1 Acre", to: "100 Decimals" },
              { from: "1 Acre", to: "4,047 m²" },
              { from: "1 m²", to: "0.0247 Decimals" },
              { from: "10 ft²", to: "0.023 Decimals" },
              { from: "10 Decimals", to: "404.7 m²" },
              { from: "25 Decimals", to: "0.25 Acres" },
            ].map((conv, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.04 }}
                className="bg-[#F9F7F2] rounded-lg md:rounded-xl p-3 md:p-5 border border-bhutan-gold/10 hover:border-bhutan-gold/25 hover:shadow-sm transition-all text-center"
              >
                <p className="text-bhutan-dark/30 text-[8px] md:text-[10px] font-bold uppercase tracking-widest mb-1">{conv.from}</p>
                <p className="text-bhutan-gold font-serif text-sm md:text-base font-bold">≈ {conv.to}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
