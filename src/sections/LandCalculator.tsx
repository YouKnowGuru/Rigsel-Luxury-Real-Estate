"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calculator, RotateCcw } from "lucide-react";
import { landConversions } from "@/lib/utils";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { cn } from "@/lib/utils";

const units = [
  { value: "decimal", label: "Decimal" },
  { value: "sqft", label: "Sq Ft" },
  { value: "sqm", label: "Sq M" },
] as const;

export function LandCalculator() {
  const [inputValue, setInputValue] = useState<string>("");
  const [fromUnit, setFromUnit] =
    useState<(typeof units)[number]["value"]>("decimal");

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
      acre: landConversions
        .decimalToAcre(landConversions.sqmToDecimal(sqm))
        .toFixed(4),
    });
  }, [inputValue, fromUnit]);

  const reset = () => {
    setInputValue("");
    setFromUnit("decimal");
  };

  return (
    <section className="section-y content-visibility-auto">
      <div className="container-apple-wide">
        <SectionHeader
          eyebrow="Precision tools"
          title="Land. Calculated."
          subtitle="Convert between Bhutan's heritage units instantly — decimal, sqft, sqm, and acres."
        />

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-4xl glass rounded-apple-xl p-6 sm:p-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Calculator className="w-4 h-4 text-sky" strokeWidth={1.75} />
                <p className="text-[12px] font-semibold uppercase tracking-eyebrow text-sky">
                  Convert
                </p>
              </div>

              <div className="flex glass-subtle rounded-2xl p-1 mb-4">
                {units.map((u) => (
                  <button
                    key={u.value}
                    onClick={() => setFromUnit(u.value)}
                    className={cn(
                      "flex-1 py-2 rounded-xl text-[13px] font-medium transition-colors",
                      fromUnit === u.value
                        ? "bg-foreground text-background"
                        : "text-ink-500 hover:text-foreground"
                    )}
                  >
                    {u.label}
                  </button>
                ))}
              </div>

              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter value"
                className="input-apple text-[clamp(1.5rem,1.25rem+1vw,2rem)] font-semibold tracking-tightest tabular-nums"
              />

              <button
                onClick={reset}
                className="mt-3 link-apple inline-flex items-center gap-1 text-[13px]"
              >
                <RotateCcw className="w-3 h-3" strokeWidth={2} /> Reset
              </button>
            </div>

            <div>
              <p className="text-[12px] font-semibold uppercase tracking-eyebrow text-sky mb-3">
                Equivalents
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Decimal", v: results.decimal },
                  { label: "Sqft", v: results.sqft },
                  { label: "Sqm", v: results.sqm },
                  { label: "Acre", v: results.acre },
                ].map((r) => (
                  <div
                    key={r.label}
                    className="glass-subtle rounded-2xl p-4"
                  >
                    <p className="text-[11px] uppercase tracking-eyebrow text-ink-500 mb-1">
                      {r.label}
                    </p>
                    <p className="text-[clamp(1.25rem,1rem+0.75vw,1.75rem)] font-semibold tracking-tightest tabular-nums text-foreground">
                      {r.v}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
