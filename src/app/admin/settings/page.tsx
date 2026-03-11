"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Save, Globe, Phone, Mail, MapPin, Facebook, Instagram, MessageCircle, Lock, Loader2, Eye, EyeOff, Home } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface SiteSettings {
    siteName: string;
    phone: string;
    email: string;
    address: string;
    facebook: string;
    instagram: string;
    whatsapp: string;
}

export default function SettingsPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [mounted, setMounted] = useState(false);
    const [saving, setSaving] = useState(false);
    const [changingPw, setChangingPw] = useState(false);
    const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });
    const [settings, setSettings] = useState<SiteSettings>({
        siteName: "", phone: "", email: "", address: "",
        facebook: "", instagram: "", whatsapp: "",
    });
    const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

    useEffect(() => {
        setMounted(true);
        const token = localStorage.getItem("adminToken");
        if (!token) { router.push("/admin"); return; }
        fetchSettings(token);
    }, [router]);

    const fetchSettings = async (token: string) => {
        try {
            const res = await fetch("/api/admin/settings", { headers: { Authorization: `Bearer ${token}` } });
            const data = await res.json();
            if (data.success) setSettings(data.data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleSaveSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch("/api/admin/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(settings),
            });
            const data = await res.json();
            if (data.success) {
                toast({ title: "Settings Saved", description: "Your website settings have been updated." });
            } else throw new Error(data.error);
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (pwForm.newPassword !== pwForm.confirmPassword) {
            toast({ title: "Mismatch", description: "New passwords do not match.", variant: "destructive" });
            return;
        }
        if (pwForm.newPassword.length < 6) {
            toast({ title: "Too Short", description: "Password must be at least 6 characters.", variant: "destructive" });
            return;
        }
        setChangingPw(true);
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch("/api/admin/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }),
            });
            const data = await res.json();
            if (data.success) {
                toast({ title: "Password Changed", description: "Your password has been updated successfully." });
                setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
            } else throw new Error(data.error);
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setChangingPw(false);
        }
    };

    if (!mounted) return null;

    const inputCls = "h-11 bg-[#F9F7F2] border-bhutan-gold/15 focus:border-bhutan-red/30 focus:ring-bhutan-red/10 rounded-xl text-bhutan-dark text-base";
    const labelCls = "block text-xs font-bold uppercase tracking-widest text-bhutan-dark/40 mb-1.5";

    return (
        <div className="p-4 md:p-6 lg:p-8 max-w-[1200px] mx-auto">
            {/* Header */}
            <header className="mb-7 flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-0.5 h-4 bg-bhutan-red rounded-full" />
                        <p className="text-bhutan-red font-bold text-xs uppercase tracking-[0.3em]">Configuration</p>
                    </div>
                    <h1 className="text-3xl font-bold text-bhutan-dark">Admin Settings</h1>
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/admin/settings/property-types"
                        className="h-11 px-6 bg-bhutan-gold/10 text-bhutan-gold border border-bhutan-gold/20 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-bhutan-gold hover:text-white transition-all flex items-center gap-2"
                    >
                        <Home className="w-4 h-4" /> Property Types
                    </Link>
                </div>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Website Settings */}
                <div className="lg:col-span-2 space-y-5">
                    <form onSubmit={handleSaveSettings}>
                        {/* Site Info */}
                        <div className="bg-white rounded-2xl p-6 border border-bhutan-gold/10 shadow-sm mb-5 relative overflow-hidden">
                            {!settings.siteName && (
                                <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-10 flex items-center justify-center">
                                    <div className="flex items-center gap-2 text-bhutan-dark/40 font-bold uppercase tracking-widest text-xs">
                                        <Loader2 className="w-4 h-4 animate-spin text-bhutan-red" />
                                        Fetching Settings...
                                    </div>
                                </div>
                            )}
                            <h2 className="font-bold text-bhutan-dark text-base mb-5 flex items-center gap-2">
                                <Globe className="w-4 h-4 text-bhutan-red" /> Website Information
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className={labelCls}>Website Name</label>
                                    <Input value={settings.siteName}
                                        onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                                        placeholder="Phojaa Real Estate" className={inputCls} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelCls}>
                                            <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> Phone</span>
                                        </label>
                                        <Input value={settings.phone}
                                            onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                                            placeholder="+975 16 111 999" className={inputCls} />
                                    </div>
                                    <div>
                                        <label className={labelCls}>
                                            <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> Email</span>
                                        </label>
                                        <Input type="email" value={settings.email}
                                            onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                                            placeholder="phojaa95realestate@gmail.com" className={inputCls} />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelCls}>
                                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Office Address</span>
                                    </label>
                                    <Input value={settings.address}
                                        onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                                        placeholder="Norzin Lam, Thimphu, Bhutan" className={inputCls} />
                                </div>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="bg-white rounded-2xl p-6 border border-bhutan-gold/10 shadow-sm mb-5">
                            <h2 className="font-bold text-bhutan-dark text-base mb-5 flex items-center gap-2">
                                <MessageCircle className="w-4 h-4 text-bhutan-gold" /> Social Media Links
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className={labelCls}><span className="flex items-center gap-1"><Facebook className="w-3 h-3" /> Facebook URL</span></label>
                                    <Input value={settings.facebook} onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
                                        placeholder="https://facebook.com/phojaa95realestate" className={inputCls} />
                                </div>
                                <div>
                                    <label className={labelCls}><span className="flex items-center gap-1"><Instagram className="w-3 h-3" /> Instagram URL</span></label>
                                    <Input value={settings.instagram} onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                                        placeholder="https://instagram.com/phojaa95realestate" className={inputCls} />
                                </div>
                                <div>
                                    <label className={labelCls}><span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> WhatsApp Number</span></label>
                                    <Input value={settings.whatsapp} onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                                        placeholder="+97516111999" className={inputCls} />
                                </div>
                            </div>
                        </div>

                        <button type="submit" disabled={saving || !settings.siteName}
                            className="w-full h-11 bg-bhutan-red text-white rounded-xl font-bold uppercase tracking-wider text-sm hover:bg-bhutan-dark transition-all shadow-lg shadow-bhutan-red/20 disabled:opacity-60 flex items-center justify-center gap-2">
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {saving ? "Saving..." : "Save Settings"}
                        </button>
                    </form>
                </div>

                {/* Change Password */}
                <div>
                    <form onSubmit={handleChangePassword}>
                        <div className="bg-bhutan-dark rounded-2xl p-6 border border-white/5 shadow-sm">
                            <h2 className="font-bold text-white text-base mb-5 flex items-center gap-2">
                                <Lock className="w-4 h-4 text-bhutan-gold" /> Change Password
                            </h2>
                            <div className="space-y-4">
                                {(["current", "new", "confirm"] as const).map((field) => {
                                    const labels = { current: "Current Password", new: "New Password", confirm: "Confirm Password" };
                                    const keys = { current: "currentPassword", new: "newPassword", confirm: "confirmPassword" } as const;
                                    return (
                                        <div key={field}>
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1.5">{labels[field]}</label>
                                            <div className="relative">
                                                <Input
                                                    type={showPw[field] ? "text" : "password"}
                                                    value={pwForm[keys[field]]}
                                                    onChange={(e) => setPwForm({ ...pwForm, [keys[field]]: e.target.value })}
                                                    placeholder="••••••••"
                                                    className="h-11 bg-white/10 border-white/10 text-white placeholder:text-white/20 rounded-xl pr-10 text-sm focus:border-bhutan-gold/30"
                                                />
                                                <button type="button" onClick={() => setShowPw({ ...showPw, [field]: !showPw[field] })}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors">
                                                    {showPw[field] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <button type="submit" disabled={changingPw}
                                className="w-full mt-5 h-11 bg-bhutan-red text-white rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-bhutan-gold transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                                {changingPw ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                                {changingPw ? "Updating..." : "Change Password"}
                            </button>
                        </div>
                    </form>

                    {/* Quick Info Card */}
                    <div className="mt-5 bg-white rounded-2xl p-5 border border-bhutan-gold/10 shadow-sm">
                        <h3 className="font-bold text-bhutan-dark text-sm mb-3">System Info</h3>
                        <div className="space-y-2 text-xs">
                            <div className="flex justify-between">
                                <span className="text-bhutan-dark/40">Version</span>
                                <span className="font-bold text-bhutan-dark">v2.0</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-bhutan-dark/40">Database</span>
                                <span className="flex items-center gap-1.5 font-bold text-emerald-600">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />Connected
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-bhutan-dark/40">Environment</span>
                                <span className="font-bold text-bhutan-dark">Production</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
