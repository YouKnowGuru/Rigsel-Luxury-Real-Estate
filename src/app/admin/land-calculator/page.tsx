"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Calculator, Save, Loader2, RefreshCw, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface CalcSettings {
    pricePerDecimal: number;
    decimalToSqft: number;
    decimalToSqm: number;
    currency: string;
}

export default function LandCalculatorPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [mounted, setMounted] = useState(false);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState<CalcSettings>({
        pricePerDecimal: 500000,
        decimalToSqft: 435.6,
        decimalToSqm: 40.47,
        currency: "Nu.",
    });

    useEffect(() => {
        setMounted(true);
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch("/api/admin/land-calculator", {  });
            const data = await res.json();
            if (data.success) setSettings(data.data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
                    const res = await fetch("/api/admin/land-calculator", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings),
            });
            const data = await res.json();
            if (data.success) {
                toast({ title: "Saved!", description: "Land calculator settings have been updated." });
            } else throw new Error(data.error);
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setSaving(false);
        }
    };

    if (!mounted) {
        return (
            <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-[900px] mx-auto min-h-screen flex items-center justify-center">
                <div className="admin-glass rounded-[20px] p-10 flex flex-col items-center gap-3 w-full max-w-sm">
                    <Loader2 className="w-8 h-8 text-sky animate-spin" strokeWidth={1.5} />
                    <p className="text-ink-400 text-[13px] font-medium">Loading calculator...</p>
                </div>
            </div>
        );
    }

    const inputCls = "h-11 rounded-2xl border-ink-200 focus:border-sky focus:ring-[3px] focus:ring-sky/15 text-foreground text-base";
    const labelCls = "block text-[13px] font-medium text-ink-600 mb-1.5";

    // Live preview calculation
    const exampleDecimal = 10;
    const examplePrice = exampleDecimal * settings.pricePerDecimal;
    const exampleSqft = exampleDecimal * settings.decimalToSqft;
    const exampleSqm = exampleDecimal * settings.decimalToSqm;

    return (
        <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-[900px] mx-auto space-y-6 sm:space-y-8">
            {/* Header */}
            <header>
                <p className="text-sky text-[12px] font-semibold uppercase tracking-[0.12em] mb-1">Configuration</p>
                <h1 className="text-[22px] sm:text-[26px] md:text-[28px] font-semibold text-foreground tracking-tight">Land Calculator Settings</h1>
                <p className="text-sm sm:text-base text-ink-600 mt-1">
                    These values control how the public-facing land calculator works on your website.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Settings Form */}
                <div className="lg:col-span-3">
                    <form onSubmit={handleSave}>
                        <div className="admin-glass rounded-[20px] p-6 mb-5">
                            <h2 className="font-semibold text-foreground text-base mb-5 flex items-center gap-2">
                                <Calculator className="w-4 h-4 text-sky" strokeWidth={1.5} /> Default Values
                            </h2>

                            <div className="space-y-5">
                                <div>
                                    <label className={labelCls}>Default Price Per Decimal (Nu.)</label>
                                    <Input
                                        type="number"
                                        value={settings.pricePerDecimal}
                                        onChange={(e) => setSettings({ ...settings, pricePerDecimal: Number(e.target.value) })}
                                        placeholder="500000"
                                        className={inputCls}
                                        min="0"
                                        required
                                    />
                                    <p className="text-xs sm:text-sm text-ink-400 mt-1">
                                        Used as the starting price per decimal in the calculator
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelCls}>1 Decimal = (sq. ft.)</label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={settings.decimalToSqft}
                                            onChange={(e) => setSettings({ ...settings, decimalToSqft: Number(e.target.value) })}
                                            placeholder="435.6"
                                            className={inputCls}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className={labelCls}>1 Decimal = (sq. m.)</label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={settings.decimalToSqm}
                                            onChange={(e) => setSettings({ ...settings, decimalToSqm: Number(e.target.value) })}
                                            placeholder="40.47"
                                            className={inputCls}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className={labelCls}>Currency Symbol</label>
                                    <Input
                                        value={settings.currency}
                                        onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                                        placeholder="Nu."
                                        className={inputCls + " max-w-[120px]"}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button type="submit" disabled={saving}
                                className="flex-1 h-11 bg-sky text-white rounded-full font-medium text-sm hover:bg-sky/90 transition-all shadow-soft disabled:opacity-60 flex items-center justify-center gap-2">
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} /> : <Save className="w-4 h-4" strokeWidth={1.5} />}
                                {saving ? "Saving..." : "Save Settings"}
                            </button>
                            <button type="button" onClick={() => fetchSettings()}
                                className="h-11 px-4 bg-card border border-ink-200 rounded-[14px] text-ink-400 hover:text-sky hover:border-sky/30 transition-all">
                                <RefreshCw className="w-4 h-4" strokeWidth={1.5} />
                            </button>
                        </div>
                    </form>
                </div>

                {/* Live Preview */}
                <div className="lg:col-span-2">
                    <div className="bg-ink-900/60 backdrop-blur-2xl rounded-[20px] p-4 sm:p-6 border border-ink-700/60 shadow-soft lg:sticky lg:top-24">
                        <h3 className="font-semibold text-white text-base mb-5 flex items-center gap-2">
                            <Calculator className="w-4 h-4 text-sky" strokeWidth={1.5} /> Live Preview
                        </h3>
                        <div className="space-y-3">
                            <div className="p-4 bg-white/5 rounded-[14px] border border-white/5">
                                <p className="text-ink-400 text-xs sm:text-sm uppercase tracking-[0.12em] font-medium mb-1">Example: {exampleDecimal} Decimals</p>
                                <div className="space-y-2 mt-3">
                                    <div className="flex items-center gap-2">
                                        <ArrowRight className="w-3.5 h-3.5 text-sky" strokeWidth={1.5} />
                                        <span className="text-ink-300 text-sm">Price:</span>
                                        <span className="text-sky font-semibold text-base ml-auto">
                                            {settings.currency} {examplePrice.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <ArrowRight className="w-3.5 h-3.5 text-sky" strokeWidth={1.5} />
                                        <span className="text-ink-300 text-sm">Area:</span>
                                        <span className="text-white font-semibold text-base ml-auto">
                                            {exampleSqft.toLocaleString()} sq.ft
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <ArrowRight className="w-3.5 h-3.5 text-sky" strokeWidth={1.5} />
                                        <span className="text-ink-300 text-sm">Area:</span>
                                        <span className="text-white font-semibold text-base ml-auto">
                                            {exampleSqm.toLocaleString()} m&sup2;
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-3 bg-sky/10 rounded-[14px] border border-sky/20">
                                <p className="text-sky text-xs font-semibold uppercase tracking-[0.12em]">
                                    &check; Changes reflect immediately on the public calculator
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
