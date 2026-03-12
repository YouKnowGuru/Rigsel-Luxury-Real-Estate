"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRightLeft, Calculator, Ruler, RotateCcw } from "lucide-react";
import { landConversions } from "@/lib/utils";

const units = [
  { value: "decimal", label: "Decimal", color: "bg-bhutan-red" },
  { value: "sqft", label: "Sq Ft", color: "bg-bhutan-gold" },
  { value: "sqm", label: "Sq M", color: "bg-bhutan-dark" },
];

export function LandCalculator() {
  const [inputValue, setInputValue] = useState<string>("");
  const [fromUnit, setFromUnit] = useState<"decimal" | "sqft" | "sqm">("decimal");

  const [results, setResults] = useState({
    decimal: "0.00",
    sqft: "0.00",
    sqm: "0.00",
    acre: "0.00",
  });

  useEffect(() => {
    const val = parseFloat(inputValue) || 0;
    let sqm = 0;
    if (fromUnit === "decimal") sqm = landConversions.decimalToSqm(val);
    if (fromUnit === "sqft") sqm = landConversions.sqftToSqm(val);
    if (fromUnit === "sqm") sqm = val;

    setResults({
      decimal: landConversions.sqmToDecimal(sqm).toFixed(2),
      sqft: landConversions.sqmToSqft(sqm).toFixed(2),
      sqm: sqm.toFixed(2),
      acre: landConversions.decimalToAcre(landConversions.sqmToDecimal(sqm)).toFixed(4),
    });
  }, [inputValue, fromUnit]);

  const resultCards = [
    { label: "Acres", value: results.acre, show: true },
    { label: "Decimal", value: results.decimal, show: fromUnit !== "decimal" },
    { label: "Sq Ft", value: results.sqft, show: fromUnit !== "sqft" },
    { label: "Sq M", value: results.sqm, show: fromUnit !== "sqm" },
  ].filter((r) => r.show);

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-background relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-thangka opacity-[0.02] pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-bhutan-gold/5 rounded-full blur-[100px]" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-bhutan-red/5 rounded-full blur-[100px]" />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-10 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full bg-bhutan-red/10 border border-bhutan-red/20 text-bhutan-red text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] mb-4 md:mb-5"
          >
            Easy Measurements
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-bhutan-dark dark:text-foreground mb-3 md:mb-4"
          >
            Land Area <span className="text-bhutan-red italic font-light">Calculator</span>
          </motion.h2>
          <p className="text-bhutan-dark/50 dark:text-muted-foreground max-w-lg mx-auto text-sm md:text-base font-light">
            Convert land measurements instantly between Bhutanese and international units.
          </p>
        </div>

        {/* Calculator Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-[#F9F7F2] dark:bg-card rounded-2xl md:rounded-3xl p-5 md:p-10 border border-bhutan-gold/10 dark:border-white/5 shadow-lg">
            {/* Unit Selector */}
            <div className="mb-6 md:mb-8">
              <label className="text-[9px] md:text-[10px] font-bold text-bhutan-dark/40 dark:text-muted-foreground/40 uppercase tracking-[0.2em] mb-3 block pl-1">
                Convert From
              </label>
              <div className="flex gap-2 md:gap-3">
                {units.map((unit) => (
                  <button
                    key={unit.value}
                    onClick={() => setFromUnit(unit.value as "decimal" | "sqft" | "sqm")}
                    className={`flex-1 py-2.5 md:py-3.5 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${fromUnit === unit.value
                      ? "bg-bhutan-dark dark:bg-bhutan-red text-white border-bhutan-dark dark:border-bhutan-red shadow-lg"
                      : "bg-white dark:bg-background text-bhutan-dark/50 dark:text-muted-foreground/50 border-bhutan-gold/15 dark:border-white/10 hover:border-bhutan-red hover:text-bhutan-red"
                      }`}
                  >
                    {unit.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="mb-6 md:mb-8">
              <label className="text-[9px] md:text-[10px] font-bold text-bhutan-dark/40 dark:text-muted-foreground/40 uppercase tracking-[0.2em] mb-3 block pl-1">
                Enter Value
              </label>
              <div className="relative">
                <Calculator className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-bhutan-gold/50" />
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter amount..."
                  className="w-full bg-white dark:bg-background pl-11 md:pl-14 pr-4 py-3.5 md:py-5 rounded-xl md:rounded-2xl text-base md:text-xl font-serif font-bold text-bhutan-dark dark:text-foreground outline-none border border-bhutan-gold/15 dark:border-white/10 focus:border-bhutan-red/40 focus:ring-2 focus:ring-bhutan-red/10 transition-all placeholder:text-bhutan-dark/20 dark:placeholder:text-white/20 placeholder:font-light placeholder:text-sm"
                />
                {inputValue && (
                  <button
                    onClick={() => setInputValue("")}
                    className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 w-7 h-7 md:w-8 md:h-8 rounded-full bg-bhutan-red/5 text-bhutan-red/40 hover:bg-bhutan-red/10 hover:text-bhutan-red flex items-center justify-center transition-all"
                  >
                    <RotateCcw className="w-3 h-3 md:w-3.5 md:h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Divider with icon */}
            <div className="flex items-center gap-3 mb-6 md:mb-8">
              <div className="flex-1 h-px bg-bhutan-gold/10 dark:bg-white/10" />
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-bhutan-red/10 dark:bg-bhutan-red/20 flex items-center justify-center">
                <ArrowRightLeft className="w-3.5 h-3.5 md:w-4 md:h-4 text-bhutan-red" />
              </div>
              <div className="flex-1 h-px bg-bhutan-gold/10 dark:bg-white/10" />
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-3 gap-2 md:gap-4">
              {resultCards.map((result, idx) => (
                <motion.div
                  key={result.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-xl md:rounded-2xl p-3 md:p-5 border border-bhutan-gold/10 hover:border-bhutan-red/20 hover:shadow-md transition-all group"
                >
                  <p className="text-[8px] md:text-[9px] font-bold text-bhutan-dark/30 uppercase tracking-[0.2em] mb-1 md:mb-2">
                    {result.label}
                  </p>
                  <p className="text-sm sm:text-base md:text-2xl font-serif font-bold text-bhutan-dark dark:text-foreground group-hover:text-bhutan-red transition-colors truncate">
                    {result.value}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom info chips */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 mt-6 md:mt-8">
            {[
              { icon: Ruler, text: "Instant Results" },
              { icon: Calculator, text: "100% Accurate" },
              { icon: ArrowRightLeft, text: "All Units" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-[#F9F7F2] dark:bg-card border border-bhutan-gold/10 dark:border-white/5 text-bhutan-dark/50 dark:text-muted-foreground/50"
              >
                <item.icon className="w-3 h-3 md:w-3.5 md:h-3.5" />
                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider">{item.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
