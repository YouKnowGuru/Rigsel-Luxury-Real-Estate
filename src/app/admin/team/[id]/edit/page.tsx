"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

export default function EditTeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { toast } = useToast();

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        role: "",
        desc: "",
        quote: "",
        image: "",
        order: 0,
    });

    useEffect(() => {
        const fetchMember = async () => {
            try {
                const token = localStorage.getItem("adminToken");
                const res = await fetch(`/api/admin/team/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) {
                    setFormData({
                        name: data.data.name,
                        role: data.data.role,
                        desc: data.data.desc,
                        quote: data.data.quote,
                        image: data.data.image,
                        order: data.data.order,
                    });
                } else {
                    toast({ title: "Error", description: "Member not found", variant: "destructive" });
                    router.push("/admin/team");
                }
            } catch (error) {
                console.error(error);
                router.push("/admin/team");
            } finally {
                setIsLoading(false);
            }
        };

        fetchMember();
    }, [id, router, toast]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        const token = localStorage.getItem("adminToken");

        try {
            const fd = new FormData();
            fd.append("file", file);
            const res = await fetch("/api/upload", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: fd,
            });
            const data = await res.json();
            if (data.success) {
                setFormData({ ...formData, image: data.url });
            } else {
                setFormData({ ...formData, image: URL.createObjectURL(file) });
                toast({ title: "Using Local Preview", description: "Cloudinary not configured." });
            }
        } catch {
            setFormData({ ...formData, image: URL.createObjectURL(file) });
            toast({ title: "Using Local Preview", description: "Cloudinary not configured." });
        } finally {
            setUploadingImage(false);
            e.target.value = "";
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch(`/api/admin/team/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (res.ok && data.success) {
                toast({ title: "Success", description: "Team member updated successfully." });
                router.push("/admin/team");
            } else {
                throw new Error(data.error);
            }
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin w-8 h-8 border-4 border-bhutan-gold border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
            <header className="mb-8 flex items-center gap-4">
                <Link
                    href="/admin/team"
                    className="w-10 h-10 bg-white rounded-xl border border-white flex items-center justify-center text-bhutan-dark/40 hover:text-bhutan-red hover:scale-105 transition-all shadow-sm"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-bhutan-dark">Edit Team Member</h1>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-bhutan-gold/10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-bhutan-dark/40">Full Name *</label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Jigme Rabgay"
                                className="h-12 bg-[#F9F7F2] border-transparent"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-bhutan-dark/40">Role / Position *</label>
                            <Input
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                placeholder="e.g. Proprietor"
                                className="h-12 bg-[#F9F7F2] border-transparent"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-bhutan-dark/40">Display Order</label>
                            <Input
                                type="number"
                                value={formData.order}
                                onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                                className="h-12 bg-[#F9F7F2] border-transparent"
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-bhutan-dark/40">Description / Bio *</label>
                            <Textarea
                                value={formData.desc}
                                onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                                placeholder="Detailed biography and experience..."
                                className="bg-[#F9F7F2] border-transparent min-h-[120px]"
                                required
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-bhutan-dark/40">Quote *</label>
                            <Input
                                value={formData.quote}
                                onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                                placeholder="Inspirational quote or personal mantra..."
                                className="h-12 bg-[#F9F7F2] border-transparent italic"
                                required
                            />
                        </div>

                        <div className="md:col-span-2 space-y-3">
                            <label className="text-xs font-bold uppercase tracking-widest text-bhutan-dark/40">Portrait Image *</label>
                            <div className="flex items-center gap-6">
                                <label className="flex-1 max-w-xs cursor-pointer">
                                    <div className="h-32 border-2 border-dashed border-bhutan-gold/30 rounded-2xl flex flex-col items-center justify-center hover:bg-bhutan-gold/5 hover:border-bhutan-gold transition-all">
                                        {uploadingImage ? (
                                            <Loader2 className="w-6 h-6 animate-spin text-bhutan-gold mb-2" />
                                        ) : (
                                            <Upload className="w-6 h-6 text-bhutan-gold/50 mb-2" />
                                        )}
                                        <span className="text-xs font-bold text-bhutan-dark/60 uppercase tracking-widest">
                                            {uploadingImage ? "Uploading..." : "Upload Image"}
                                        </span>
                                    </div>
                                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                </label>
                                {formData.image && (
                                    <div className="w-32 h-32 rounded-2xl overflow-hidden relative shadow-md">
                                        <Image src={formData.image} alt="Preview" fill className="object-cover" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 h-14 bg-bhutan-red hover:bg-bhutan-dark text-white rounded-xl font-bold uppercase tracking-[0.2em] transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Changes"}
                    </button>
                    <Link
                        href="/admin/team"
                        className="px-8 h-14 flex items-center justify-center border border-bhutan-gold/20 rounded-xl text-bhutan-dark/60 font-bold uppercase tracking-widest hover:bg-bhutan-gold/5 transition-all"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}
