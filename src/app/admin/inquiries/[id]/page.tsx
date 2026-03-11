"use client";

import { useState, useEffect, use } from "react";
import {
    Mail,
    Phone,
    Calendar,
    Clock,
    ChevronLeft,
    Send,
    User,
    Trash2,
    CheckCircle2,
    Building2,
    MessageSquare,
    Globe,
    ArrowLeft
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Inquiry {
    _id: string;
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    propertyId?: {
        title: string;
        slug: string;
        images: string[];
    };
}

export default function InquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [inquiry, setInquiry] = useState<Inquiry | null>(null);
    const [loading, setLoading] = useState(true);
    const [replyMessage, setReplyMessage] = useState("");
    const [isReplying, setIsReplying] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        fetchInquiry();
    }, [id]);

    const fetchInquiry = async () => {
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`/api/contact/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setInquiry(data.data);
                // Mark as read automatically when opened
                if (!data.data.isRead) markAsRead();
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to load inquiry", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async () => {
        try {
            const token = localStorage.getItem("adminToken");
            await fetch(`/api/contact/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ isRead: true })
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyMessage.trim()) return;

        setIsReplying(true);
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`/api/admin/inquiries/${id}/reply`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ replyMessage })
            });
            const data = await res.json();
            if (data.success) {
                toast({ title: "Reply Sent", description: "Email has been sent to the client.", variant: "success" });
                setReplyMessage("");
                fetchInquiry();
            } else {
                throw new Error(data.error);
            }
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setIsReplying(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this inquiry?")) return;

        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`/api/contact/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                toast({ title: "Deleted", description: "Inquiry removed." });
                router.push("/admin/inquiries");
            }
        } catch (error) {
            toast({ title: "Error", description: "Delete failed", variant: "destructive" });
        }
    };

    if (loading) return <div className="p-20 text-center italic text-bhutan-dark/30 animate-pulse text-2xl font-serif">Deep in the Himalayas, finding your legacy...</div>;
    if (!inquiry) return <div className="p-20 text-center text-bhutan-red font-bold">Inquiry not found</div>;

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 min-h-screen bg-[#F9F7F2]/30 pb-32">
            {/* Navigation & Actions */}
            <div className="flex items-center justify-between">
                <Link
                    href="/admin/inquiries"
                    className="group flex items-center gap-3 text-bhutan-dark/50 hover:text-bhutan-red transition-all duration-300"
                >
                    <div className="w-10 h-10 rounded-xl bg-white border border-bhutan-gold/10 flex items-center justify-center group-hover:bg-bhutan-red group-hover:text-white transition-all shadow-sm">
                        <ArrowLeft className="w-5 h-5" />
                    </div>
                    <span className="font-bold uppercase tracking-widest text-[10px]">Back to Inquiries</span>
                </Link>

                <Button
                    variant="ghost"
                    onClick={handleDelete}
                    className="text-bhutan-dark/30 hover:text-bhutan-red hover:bg-bhutan-red/5 flex gap-2 rounded-xl transition-all"
                >
                    <Trash2 className="w-4 h-4" />
                    <span className="font-bold uppercase tracking-widest text-[10px]">Delete Record</span>
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Main Message Content */}
                <div className="lg:col-span-8 space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-bhutan-gold/10 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-bhutan-red/5 rounded-bl-[4rem]" />

                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-14 h-14 bg-bhutan-red/10 rounded-2xl flex items-center justify-center text-bhutan-red font-bold text-2xl">
                                    {inquiry.name.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-bold text-bhutan-dark tracking-tight">{inquiry.name}</h2>
                                    <p className="text-bhutan-dark/40 font-bold uppercase tracking-widest text-[9px]">{inquiry.subject}</p>
                                </div>
                            </div>

                            <div className="bg-[#F9F7F2]/50 rounded-3xl p-8 border border-bhutan-gold/5 min-h-[200px]">
                                <p className="text-bhutan-dark/80 text-lg md:text-xl font-serif italic leading-relaxed whitespace-pre-wrap">
                                    "{inquiry.message}"
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-bhutan-gold/5">
                                <div className="flex items-center gap-2 text-bhutan-dark/50">
                                    <Calendar className="w-4 h-4 text-bhutan-gold" />
                                    <span className="text-xs font-bold uppercase tracking-widest">{format(new Date(inquiry.createdAt), "MMMM d, yyyy")}</span>
                                </div>
                                <div className="flex items-center gap-2 text-bhutan-dark/50">
                                    <Clock className="w-4 h-4 text-bhutan-gold" />
                                    <span className="text-xs font-bold uppercase tracking-widest">{format(new Date(inquiry.createdAt), "h:mm a")}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Quick Reply Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-bhutan-dark rounded-[2.5rem] p-8 md:p-10 shadow-3xl text-white relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-thangka opacity-[0.05] pointer-events-none" />

                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-bhutan-red rounded-xl flex items-center justify-center">
                                    <Send className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-xl font-bold italic">Draft a Legacy Reply</h3>
                            </div>

                            <form onSubmit={handleReply} className="space-y-6">
                                <Textarea
                                    placeholder="Type your personal response here..."
                                    value={replyMessage}
                                    onChange={(e) => setReplyMessage(e.target.value)}
                                    className="min-h-[180px] bg-white/10 border-white/10 text-white placeholder:text-white/30 rounded-2xl p-6 text-lg font-serif italic focus:ring-bhutan-red/50 focus:border-bhutan-red/50 resize-none"
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={isReplying || !replyMessage.trim()}
                                    className="w-full h-16 bg-bhutan-red hover:bg-white hover:text-bhutan-red text-white transition-all duration-500 rounded-xl font-bold uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-4 shadow-xl disabled:opacity-50"
                                >
                                    {isReplying ? (
                                        "Sending Mail..."
                                    ) : (
                                        <>
                                            Send Personal Message
                                            <Send className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>

                {/* Sidebar Info */}
                <div className="lg:col-span-4 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-bhutan-gold/10 space-y-8"
                    >
                        <div>
                            <h4 className="text-[10px] font-bold text-bhutan-dark/30 uppercase tracking-[0.3em] mb-6">Contact Details</h4>
                            <div className="space-y-6">
                                <a href={`mailto:${inquiry.email}`} className="flex items-start gap-4 group">
                                    <div className="w-10 h-10 rounded-xl bg-[#F9F7F2] flex items-center justify-center text-bhutan-gold group-hover:bg-bhutan-red group-hover:text-white transition-all shadow-sm">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-bhutan-dark/40 uppercase tracking-widest mb-1">Email Address</p>
                                        <p className="text-sm font-bold text-bhutan-dark break-all group-hover:text-bhutan-red transition-colors">{inquiry.email}</p>
                                    </div>
                                </a>

                                <a href={`tel:${inquiry.phone}`} className="flex items-start gap-4 group">
                                    <div className="w-10 h-10 rounded-xl bg-[#F9F7F2] flex items-center justify-center text-bhutan-gold group-hover:bg-bhutan-red group-hover:text-white transition-all shadow-sm">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-bhutan-dark/40 uppercase tracking-widest mb-1">Phone Number</p>
                                        <p className="text-sm font-bold text-bhutan-dark group-hover:text-bhutan-red transition-colors">{inquiry.phone}</p>
                                    </div>
                                </a>
                            </div>
                        </div>

                        {inquiry.propertyId && (
                            <div className="pt-8 border-t border-bhutan-gold/5">
                                <h4 className="text-[10px] font-bold text-bhutan-dark/30 uppercase tracking-[0.3em] mb-6">Related Property</h4>
                                <Link
                                    href={`/properties/${inquiry.propertyId.slug}`}
                                    className="block p-4 rounded-3xl bg-[#F9F7F2] border border-bhutan-gold/10 hover:border-bhutan-red/30 transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white shrink-0 shadow-sm">
                                            {inquiry.propertyId.images?.[0] ? (
                                                <img src={inquiry.propertyId.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-bhutan-gold/30">
                                                    <Building2 className="w-6 h-6" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-bhutan-dark truncate leading-tight mb-1">{inquiry.propertyId.title}</p>
                                            <p className="text-[9px] font-bold text-bhutan-red uppercase tracking-widest flex items-center gap-1">
                                                <Globe className="w-3 h-3" />
                                                View Listing
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        )}

                        <div className="pt-8 border-t border-bhutan-gold/5 text-center">
                            {inquiry.isRead ? (
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold uppercase tracking-widest border border-emerald-500/20">
                                    <CheckCircle2 className="w-4 h-4" />
                                    Response Complete
                                </div>
                            ) : (
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 text-orange-600 text-[10px] font-bold uppercase tracking-widest border border-orange-500/20">
                                    <Clock className="w-4 h-4" />
                                    Pending Reply
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
