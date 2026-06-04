"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save, Globe, Phone, Mail, MapPin, Facebook, Instagram, MessageCircle, Lock, Loader2, Eye, EyeOff, Home, Image as ImageIcon, Upload, Trash2 } from "lucide-react";
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
    heroImage?: string;
    heroImages?: string[];
}

export default function SettingsPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [mounted, setMounted] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [changingPw, setChangingPw] = useState(false);
    const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });
    const [settings, setSettings] = useState<SiteSettings>({
        siteName: "", phone: "", email: "", address: "",
        facebook: "", instagram: "", whatsapp: "", heroImage: "",
        heroImages: [],
    });
    const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

    useEffect(() => {
        setMounted(true);
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch("/api/admin/settings", {  });
            const data = await res.json();
            if (data.success) {
                setSettings({
                    ...data.data,
                    heroImages: data.data.heroImages || []
                });
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isSlider = false) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
                    const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (data.success) {
                if (isSlider) {
                    setSettings({
                        ...settings,
                        heroImages: [...(settings.heroImages || []), data.url]
                    });
                    toast({ title: "Slide Added", description: "A new image has been added to your hero slider." });
                } else {
                    setSettings({ ...settings, heroImage: data.url });
                    toast({ title: "Image Uploaded", description: "Main hero image has been updated." });
                }
            } else throw new Error(data.error);
        } catch (error: any) {
            toast({ title: "Upload Failed", description: error.message, variant: "destructive" });
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveHeroImage = (index: number) => {
        const updatedImages = [...(settings.heroImages || [])];
        updatedImages.splice(index, 1);
        setSettings({ ...settings, heroImages: updatedImages });
        toast({ title: "Slide Removed", description: "Image removed from your hero slider." });
    };

    const handleSaveSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
                    const res = await fetch("/api/admin/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
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
                    const res = await fetch("/api/admin/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
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

    const inputCls = "h-11 rounded-2xl border-ink-200 focus:border-sky focus:ring-[3px] focus:ring-sky/15 text-foreground text-base font-medium";
    const labelCls = "block text-[13px] font-medium text-ink-600 mb-1.5";

    return (
        <div className="p-4 md:p-6 lg:p-8 max-w-[1200px] mx-auto">
            {/* Header */}
            <header className="mb-7 flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-0.5 h-4 bg-sky rounded-full" />
                        <p className="text-sky text-[12px] font-semibold uppercase tracking-[0.12em]">Configuration</p>
                    </div>
                    <h1 className="text-[28px] font-semibold text-foreground tracking-tight">Admin Settings</h1>
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/admin/settings/property-types"
                        className="h-11 px-6 rounded-[14px] border border-ink-200 text-ink-700 font-medium text-sm flex items-center gap-2 hover:bg-ink-50 transition-all"
                    >
                        <Home className="w-4 h-4" strokeWidth={1.5} /> Property Types
                    </Link>
                </div>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Website Settings */}
                <div className="lg:col-span-2 space-y-5">
                    <form onSubmit={handleSaveSettings}>
                        {/* Site Info */}
                        <div className="bg-card rounded-[20px] border border-ink-100/60 shadow-soft p-6 mb-5 relative overflow-hidden">
                            {!settings.siteName && (
                                <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] z-10 flex items-center justify-center">
                                    <div className="flex items-center gap-2 text-ink-600 font-medium text-sm">
                                        <Loader2 className="w-5 h-5 animate-spin border-sky/20 border-t-sky" strokeWidth={1.5} />
                                        Fetching Settings...
                                    </div>
                                </div>
                            )}
                            <h2 className="font-semibold text-foreground text-base mb-5 flex items-center gap-2">
                                <Globe className="w-4 h-4 text-sky" strokeWidth={1.5} /> Website Information
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
                                            <span className="flex items-center gap-1"><Phone className="w-3 h-3" strokeWidth={1.5} /> Phone</span>
                                        </label>
                                        <Input value={settings.phone}
                                            onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                                            placeholder="+975 16 111 999" className={inputCls} />
                                    </div>
                                    <div>
                                        <label className={labelCls}>
                                            <span className="flex items-center gap-1"><Mail className="w-3 h-3" strokeWidth={1.5} /> Email</span>
                                        </label>
                                        <Input type="email" value={settings.email}
                                            onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                                            placeholder="phojaa95realestate@gmail.com" className={inputCls} />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelCls}>
                                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" strokeWidth={1.5} /> Office Address</span>
                                    </label>
                                    <Input value={settings.address}
                                        onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                                        placeholder="Norzin Lam, Thimphu, Bhutan" className={inputCls} />
                                </div>
                            </div>
                        </div>

                        {/* Hero Slider Images */}
                        <div className="bg-card rounded-[20px] border border-ink-100/60 shadow-soft p-6 mb-5">
                            <h2 className="font-semibold text-foreground text-base mb-2 flex items-center gap-2">
                                <ImageIcon className="w-4 h-4 text-ink-400" strokeWidth={1.5} /> Hero Slider Gallery
                            </h2>
                            <p className="text-[13px] text-ink-500 mb-5 font-medium">Manage multiple slides for the home hero section</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {(settings.heroImages || []).map((img, idx) => (
                                    <div key={idx} className="relative group overflow-hidden rounded-xl border border-ink-100/60 aspect-[16/9]">
                                        <img src={img} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-ink-800/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2 backdrop-blur-sm">
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveHeroImage(idx)}
                                                className="h-9 px-4 bg-card text-sky rounded-full font-medium text-[12px] flex items-center gap-2 hover:bg-sky hover:text-white transition-all shadow-lg"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} /> Remove Slide
                                            </button>
                                        </div>
                                        <div className="absolute top-2 left-2 bg-sky/90 text-white text-xs font-semibold px-2.5 py-1 rounded-lg shadow-sm z-10">
                                            Slide {idx + 1}
                                        </div>
                                    </div>
                                ))}

                                {/* Add Slide Button */}
                                <label className="relative group cursor-pointer overflow-hidden rounded-xl border-2 border-dashed border-ink-200 hover:border-sky/40 aspect-[16/9] flex flex-col items-center justify-center transition-all">
                                    <input type="file" accept="image/*" onChange={(e) => handleHeroImageUpload(e, true)} className="hidden" />
                                    {uploading ? (
                                        <Loader2 className="w-8 h-8 animate-spin border-sky/20 border-t-sky" strokeWidth={1.5} />
                                    ) : (
                                        <>
                                            <div className="w-10 h-10 bg-sky/5 rounded-full flex items-center justify-center mb-2 group-hover:bg-sky/10 transition-colors">
                                                <Upload className="w-5 h-5 text-ink-400 group-hover:text-sky" strokeWidth={1.5} />
                                            </div>
                                            <p className="text-[12px] font-medium text-ink-400">Add New Slide</p>
                                        </>
                                    )}
                                </label>
                            </div>
                        </div>

                        {/* Single Hero Image (Fallback/Alternative) */}
                        <div className="bg-card rounded-[20px] border border-ink-100/60 shadow-soft p-6 mb-5 opacity-60 hover:opacity-100 transition-opacity">
                            <h2 className="font-semibold text-foreground text-base mb-1 flex items-center gap-2">
                                <ImageIcon className="w-4 h-4 text-ink-400" strokeWidth={1.5} /> Default Hero Image
                            </h2>
                            <p className="text-[13px] text-ink-500 mb-4 font-medium">Fallback if slider is empty</p>
                            <div className="relative group overflow-hidden rounded-xl border border-dashed border-ink-200 aspect-[21/9]">
                                {settings.heroImage ? (
                                    <>
                                        <img src={settings.heroImage} alt="Hero Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-ink-800/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                            <label className="h-10 px-4 bg-card text-foreground rounded-full font-medium text-[12px] flex items-center gap-2 cursor-pointer hover:bg-sky hover:text-white transition-all">
                                                <Upload className="w-3.5 h-3.5" strokeWidth={1.5} /> Replace
                                                <input type="file" accept="image/*" onChange={(e) => handleHeroImageUpload(e, false)} className="hidden" />
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => setSettings({ ...settings, heroImage: "" })}
                                                className="h-10 px-4 bg-white/20 text-white rounded-full font-medium text-[12px] flex items-center gap-2 backdrop-blur-md hover:bg-red-500 transition-all"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} /> Remove
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                                        <label className="h-9 px-5 bg-sky/10 text-sky rounded-full font-medium text-[12px] flex items-center gap-2 cursor-pointer hover:bg-sky hover:text-white transition-all">
                                            <Upload className="w-3.5 h-3.5" strokeWidth={1.5} /> Set Default Image
                                            <input type="file" accept="image/*" onChange={(e) => handleHeroImageUpload(e, false)} className="hidden" />
                                        </label>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="bg-card rounded-[20px] border border-ink-100/60 shadow-soft p-6 mb-5">
                            <h2 className="font-semibold text-foreground text-base mb-5 flex items-center gap-2">
                                <MessageCircle className="w-4 h-4 text-ink-400" strokeWidth={1.5} /> Social Media Links
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className={labelCls}><span className="flex items-center gap-1"><Facebook className="w-3 h-3" strokeWidth={1.5} /> Facebook URL</span></label>
                                    <Input value={settings.facebook} onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
                                        placeholder="https://facebook.com/phojaa95realestate" className={inputCls} />
                                </div>
                                <div>
                                    <label className={labelCls}><span className="flex items-center gap-1"><Instagram className="w-3 h-3" strokeWidth={1.5} /> Instagram URL</span></label>
                                    <Input value={settings.instagram} onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                                        placeholder="https://instagram.com/phojaa95realestate" className={inputCls} />
                                </div>
                                <div>
                                    <label className={labelCls}><span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" strokeWidth={1.5} /> WhatsApp Number</span></label>
                                    <Input value={settings.whatsapp} onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                                        placeholder="+97516111999" className={inputCls} />
                                </div>
                            </div>
                        </div>

                        <button type="submit" disabled={saving || !settings.siteName}
                            className="w-full h-11 rounded-full bg-sky text-background font-medium text-sm hover:bg-sky-600 transition-all shadow-lg shadow-sky/20 disabled:opacity-60 flex items-center justify-center gap-2">
                            {saving ? <Loader2 className="w-4 h-4 animate-spin border-sky/20 border-t-sky" strokeWidth={1.5} /> : <Save className="w-4 h-4" strokeWidth={1.5} />}
                            {saving ? "Saving..." : "Save Settings"}
                        </button>
                    </form>
                </div>

                {/* Change Password */}
                <div>
                    <form onSubmit={handleChangePassword}>
                        <div className="bg-ink-800 dark:bg-card rounded-[20px] p-6 shadow-soft border border-ink-100/60">
                            <h2 className="font-semibold text-white dark:text-foreground text-base mb-5 flex items-center gap-2">
                                <Lock className="w-4 h-4 text-ink-400" strokeWidth={1.5} /> Change Password
                            </h2>
                            <div className="space-y-4">
                                {(["current", "new", "confirm"] as const).map((field) => {
                                    const labels = { current: "Current Password", new: "New Password", confirm: "Confirm Password" };
                                    const keys = { current: "currentPassword", new: "newPassword", confirm: "confirmPassword" } as const;
                                    return (
                                        <div key={field}>
                                            <label className="block text-[13px] font-medium text-white/70 mb-1.5">{labels[field]}</label>
                                            <div className="relative">
                                                <Input
                                                    type={showPw[field] ? "text" : "password"}
                                                    value={pwForm[keys[field]]}
                                                    onChange={(e) => setPwForm({ ...pwForm, [keys[field]]: e.target.value })}
                                                    placeholder="••••••••"
                                                    className="h-11 bg-white/10 border-white/10 text-white placeholder:text-white/20 rounded-2xl pr-10 text-sm focus:border-sky focus:ring-[3px] focus:ring-sky/15"
                                                />
                                                <button type="button" onClick={() => setShowPw({ ...showPw, [field]: !showPw[field] })}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors">
                                                    {showPw[field] ? <EyeOff className="w-4 h-4" strokeWidth={1.5} /> : <Eye className="w-4 h-4" strokeWidth={1.5} />}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <button type="submit" disabled={changingPw}
                                className="w-full mt-5 h-11 rounded-full bg-sky text-background font-medium text-sm hover:bg-sky-600 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                                {changingPw ? <Loader2 className="w-4 h-4 animate-spin border-sky/20 border-t-sky" strokeWidth={1.5} /> : <Lock className="w-4 h-4" strokeWidth={1.5} />}
                                {changingPw ? "Updating..." : "Change Password"}
                            </button>
                        </div>
                    </form>

                    {/* Quick Info Card */}
                    <div className="mt-5 bg-card rounded-[20px] border border-ink-100/60 shadow-soft p-5">
                        <h3 className="font-semibold text-foreground text-sm mb-3">System Info</h3>
                        <div className="space-y-2 text-xs">
                            <div className="flex justify-between">
                                <span className="text-ink-500">Version</span>
                                <span className="font-semibold text-foreground">v2.0</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-ink-500">Database</span>
                                <span className="flex items-center gap-1.5 font-semibold text-emerald-600">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />Connected
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-ink-500">Environment</span>
                                <span className="font-semibold text-foreground">Production</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
