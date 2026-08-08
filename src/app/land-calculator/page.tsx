"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calculator, RotateCcw, Ruler, TrendingUp } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { PageHero } from "@/components/layout/PageHero";

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

  const recalc = (sqm: number) => {
    const d = landConversions.sqmToDecimal(sqm);
    setDecimals(d.toFixed(2));
    setAcres(landConversions.decimalToAcre(d).toFixed(4));
    setSquareFeet(landConversions.sqmToSqft(sqm).toFixed(2));
    const p = parseFloat(pricePerDecimal) || 0;
    setTotalPrice(d * p);
  };

  const handleSqmChange = (v: string) => {
    setSquareMeters(v);
    recalc(parseFloat(v) || 0);
  };
  const handleDecChange = (v: string) => {
    setDecimals(v);
    const d = parseFloat(v) || 0;
    setSquareMeters(landConversions.decimalToSqm(d).toFixed(2));
    setAcres(landConversions.decimalToAcre(d).toFixed(4));
    setSquareFeet(
      landConversions.sqmToSqft(landConversions.decimalToSqm(d)).toFixed(2)
    );
    const p = parseFloat(pricePerDecimal) || 0;
    setTotalPrice(d * p);
  };
  const handleAcreChange = (v: string) => {
    setAcres(v);
    const a = parseFloat(v) || 0;
    const d = landConversions.acreToDecimal(a);
    setDecimals(d.toFixed(2));
    const sqm = landConversions.decimalToSqm(d);
    setSquareMeters(sqm.toFixed(2));
    setSquareFeet(landConversions.sqmToSqft(sqm).toFixed(2));
    const p = parseFloat(pricePerDecimal) || 0;
    setTotalPrice(d * p);
  };
  const handleSqftChange = (v: string) => {
    setSquareFeet(v);
    const sqft = parseFloat(v) || 0;
    const sqm = landConversions.sqftToSqm(sqft);
    setSquareMeters(sqm.toFixed(2));
    const d = landConversions.sqmToDecimal(sqm);
    setDecimals(d.toFixed(2));
    setAcres(landConversions.decimalToAcre(d).toFixed(4));
    const p = parseFloat(pricePerDecimal) || 0;
    setTotalPrice(d * p);
  };
  const handlePriceChange = (v: string) => {
    setPricePerDecimal(v);
    const p = parseFloat(v) || 0;
    const d = parseFloat(decimals) || 0;
    setTotalPrice(d * p);
  };

  const reset = () => {
    setSquareMeters("");
    setDecimals("");
    setAcres("");
    setSquareFeet("");
    setPricePerDecimal("");
    setTotalPrice(0);
  };

  return (
    <main className="bg-background">
      <PageHero
        eyebrow="Tools"
        title="Land Calculator."
        highlight="Precision conversions."
        subtitle="Convert between Bhutan's heritage land units and estimate value — instantly."
        breadcrumbs={[{ label: "Land Calculator" }]}
      />

      <section className="section-y-sm">
        <div className="container-apple-wide grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Inputs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 glass rounded-apple-xl p-6 sm:p-8 md:p-10"
          >
            <p className="text-[14px] font-semibold text-sky mb-2 inline-flex items-center gap-2">
              <Ruler className="w-4 h-4" strokeWidth={1.75} />
              Conversions
            </p>
            <h2 className="font-semibold text-[clamp(1.75rem,1.5rem+1.5vw,2.5rem)] tracking-tighter2 leading-tight2 text-foreground">
              Type any value. See all four.
            </h2>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  label: "Square meters (sqm)",
                  value: squareMeters,
                  setter: handleSqmChange,
                },
                {
                  label: "Decimal",
                  value: decimals,
                  setter: handleDecChange,
                },
                {
                  label: "Acres",
                  value: acres,
                  setter: handleAcreChange,
                },
                {
                  label: "Square feet (sqft)",
                  value: squareFeet,
                  setter: handleSqftChange,
                },
              ].map((f) => (
                <label key={f.label} className="block">
                  <span className="text-[12px] text-ink-500 uppercase tracking-eyebrow">
                    {f.label}
                  </span>
                  <input
                    type="number"
                    value={f.value}
                    onChange={(e) => f.setter(e.target.value)}
                    placeholder="0"
                    className="input-apple mt-1.5 text-[clamp(1.25rem,1rem+0.5vw,1.5rem)] font-semibold tracking-tightest tabular-nums"
                  />
                </label>
              ))}
            </div>

            <button
              onClick={reset}
              className="mt-6 link-apple inline-flex items-center gap-1 text-[13px]"
            >
              <RotateCcw className="w-3 h-3" strokeWidth={2} /> Reset
            </button>
          </motion.div>

          {/* Pricing estimator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="lg:col-span-5 glass text-foreground rounded-apple-xl p-6 sm:p-8 md:p-10"
          >
            <p className="text-[14px] font-semibold text-sky mb-2 inline-flex items-center gap-2">
              <TrendingUp className="w-4 h-4" strokeWidth={1.75} />
              Pricing
            </p>
            <h2 className="font-semibold text-[clamp(1.5rem,1.25rem+1.25vw,2.25rem)] tracking-tighter2 leading-tight2 text-foreground">
              Estimate the total.
            </h2>

            <label className="block mt-6">
              <span className="text-[12px] text-ink-500 uppercase tracking-eyebrow">
                Price per decimal (Nu.)
              </span>
              <input
                type="number"
                value={pricePerDecimal}
                onChange={(e) => handlePriceChange(e.target.value)}
                placeholder="0"
                className="input-apple mt-1.5 text-[18px] font-semibold tracking-tightest tabular-nums"
              />
            </label>

            <div className="mt-8 pt-6 border-t border-ink-100 dark:border-ink-700/40">
              <p className="text-[12px] text-ink-500 uppercase tracking-eyebrow">
                Total estimate
              </p>
              <p className="mt-2 text-[clamp(2rem,1.5rem+2vw,3.5rem)] font-semibold tracking-tighter3 leading-tighter tabular-nums text-foreground">
                {totalPrice > 0 ? formatPrice(totalPrice) : "—"}
              </p>
              {decimals && parseFloat(decimals) > 0 && (
                <p className="mt-2 text-[13px] text-ink-500">
                  Based on {parseFloat(decimals).toFixed(2)} decimals
                </p>
              )}
            </div>

            <Link
              href="/contact"
              className="mt-8 inline-flex link-apple link-arrow text-[14px]"
            >
              Get an expert valuation
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Reference */}
      <section className="bg-fog section-y-sm">
        <div className="container-apple">
          <h2 className="font-semibold text-[clamp(1.5rem,1.25rem+1vw,2rem)] tracking-tighter2 leading-tight2 text-foreground text-center">
            Common conversions.
          </h2>
          <div className="mt-8 glass rounded-apple-lg border border-ink-100 dark:border-ink-700/40 overflow-hidden">
            <div className="grid grid-cols-3 text-[13px] font-semibold uppercase tracking-eyebrow text-ink-500 bg-ink-50/50 px-5 py-3">
              <span>From</span>
              <span>To</span>
              <span className="text-right">Value</span>
            </div>
            {[
              { from: "1 Decimal", to: "Square meters", value: "40.47 sqm" },
              { from: "1 Decimal", to: "Square feet", value: "435.6 sqft" },
              { from: "1 Acre", to: "Decimals", value: "100" },
              { from: "1 Acre", to: "Square meters", value: "4,047 sqm" },
              { from: "1 Sqm", to: "Square feet", value: "10.76 sqft" },
            ].map((row, i) => (
              <div
                key={row.from + row.to}
                className={`grid grid-cols-3 px-5 py-4 text-[14px] ${
                  i % 2 ? "bg-ink-50/50" : ""
                }`}
              >
                <span className="text-foreground font-medium">{row.from}</span>
                <span className="text-ink-500">{row.to}</span>
                <span className="text-foreground font-semibold tabular-nums text-right">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
