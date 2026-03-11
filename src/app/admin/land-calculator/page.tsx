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
        const token = localStorage.getItem("adminToken");
        if (!token) { router.push("/admin"); return; }
        fetchSettings(token);
    }, [router]);

    const fetchSettings = async (token: string) => {
        try {
            const res = await fetch("/api/admin/land-calculator", { headers: { Authorization: `Bearer ${token}` } });
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
            const token = localStorage.getItem("adminToken");
            const res = await fetch("/api/admin/land-calculator", {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
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

    if (!mounted) return null;

    const inputCls = "h-11 bg-[#F9F7F2] border-bhutan-gold/15 focus:border-bhutan-red/30 focus:ring-bhutan-red/10 rounded-xl text-bhutan-dark text-base";
    const labelCls = "block text-xs font-bold uppercase tracking-widest text-bhutan-dark/40 mb-1.5";

    // Live preview calculation
    const exampleDecimal = 10;
    const examplePrice = exampleDecimal * settings.pricePerDecimal;
    const exampleSqft = exampleDecimal * settings.decimalToSqft;
    const exampleSqm = exampleDecimal * settings.decimalToSqm;

    return (
        <div className="p-4 md:p-6 lg:p-8 max-w-[900px] mx-auto">
            {/* Header */}
            <header className="mb-7">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-0.5 h-5 bg-bhutan-red rounded-full" />
                    <p className="text-bhutan-red font-bold text-xs uppercase tracking-[0.3em]">Configuration</p>
                </div>
                <h1 className="text-3xl font-bold text-bhutan-dark">Land Calculator Settings</h1>
                <p className="text-base text-bhutan-dark/50 mt-1">
                    These values control how the public-facing land calculator works on your website.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Settings Form */}
                <div className="lg:col-span-3">
                    <form onSubmit={handleSave}>
                        <div className="bg-white rounded-2xl p-6 border border-bhutan-gold/10 shadow-sm mb-5">
                            <h2 className="font-bold text-bhutan-dark text-base mb-5 flex items-center gap-2">
                                <Calculator className="w-4 h-4 text-bhutan-red" /> Default Values
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
                                    <p className="text-xs text-bhutan-dark/40 mt-1">
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
                                className="flex-1 h-11 bg-bhutan-red text-white rounded-xl font-bold uppercase tracking-wider text-sm hover:bg-bhutan-dark transition-all shadow-lg shadow-bhutan-red/20 disabled:opacity-60 flex items-center justify-center gap-2">
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                {saving ? "Saving..." : "Save Settings"}
                            </button>
                            <button type="button" onClick={() => fetchSettings(localStorage.getItem("adminToken") || "")}
                                className="h-11 px-4 bg-white border border-bhutan-gold/15 rounded-xl text-bhutan-dark/40 hover:text-bhutan-red hover:border-bhutan-red/20 transition-all">
                                <RefreshCw className="w-4 h-4" />
                            </button>
                        </div>
                    </form>
                </div>

                {/* Live Preview */}
                <div className="lg:col-span-2">
                    <div className="bg-bhutan-dark rounded-2xl p-6 border border-white/5 shadow-sm sticky top-24">
                        <h3 className="font-bold text-white text-base mb-5 flex items-center gap-2">
                            <Calculator className="w-4 h-4 text-bhutan-gold" /> Live Preview
                        </h3>
                        <div className="space-y-3">
                            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                <p className="text-white/40 text-xs uppercase tracking-widest font-bold mb-1">Example: {exampleDecimal} Decimals</p>
                                <div className="space-y-2 mt-3">
                                    <div className="flex items-center gap-2">
                                        <ArrowRight className="w-3.5 h-3.5 text-bhutan-gold" />
                                        <span className="text-white/60 text-sm">Price:</span>
                                        <span className="text-bhutan-gold font-bold text-base ml-auto">
                                            {settings.currency} {examplePrice.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <ArrowRight className="w-3.5 h-3.5 text-bhutan-gold" />
                                        <span className="text-white/60 text-sm">Area:</span>
                                        <span className="text-white font-bold text-base ml-auto">
                                            {exampleSqft.toLocaleString()} sq.ft
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <ArrowRight className="w-3.5 h-3.5 text-bhutan-gold" />
                                        <span className="text-white/60 text-sm">Area:</span>
                                        <span className="text-white font-bold text-base ml-auto">
                                            {exampleSqm.toLocaleString()} m²
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-3 bg-bhutan-gold/10 rounded-xl border border-bhutan-gold/20">
                                <p className="text-bhutan-gold text-xs font-bold uppercase tracking-wider">
                                    ✓ Changes reflect immediately on the public calculator
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
