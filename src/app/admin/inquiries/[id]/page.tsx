"use client";

import { useState, useEffect } from "react";
import {
    Mail,
    Phone,
    Calendar,
    Clock,
    ChevronLeft,
    Send,
    Trash2,
    CheckCircle2,
    Building2,
    Globe,
    ArrowLeft
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
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

export default function InquiryDetailPage() {
    const params = useParams();
    const id = params?.id as string;
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
                    const res = await fetch(`/api/contact/${id}`, {
                
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
                    await fetch(`/api/contact/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
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
                    const res = await fetch(`/api/admin/inquiries/${id}/reply`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
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
                    const res = await fetch(`/api/contact/${id}`, {
                method: "DELETE",
                
            });
            if (res.ok) {
                toast({ title: "Deleted", description: "Inquiry removed." });
                router.push("/admin/inquiries");
            }
        } catch (error) {
            toast({ title: "Error", description: "Delete failed", variant: "destructive" });
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-sky/20 border-t-sky rounded-full animate-spin" />
        </div>
    );
    if (!inquiry) return <div className="p-20 text-center text-sky font-semibold">Inquiry not found</div>;

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 min-h-screen pb-32">
            {/* Navigation & Actions */}
            <div className="flex items-center justify-between">
                <Link
                    href="/admin/inquiries"
                    className="group flex items-center gap-3 text-ink-400 hover:text-sky transition-all duration-300"
                >
                    <div className="w-10 h-10 rounded-[14px] bg-card border border-ink-100/60 flex items-center justify-center group-hover:bg-sky group-hover:text-background transition-all shadow-soft">
                        <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
                    </div>
                    <span className="font-semibold uppercase tracking-wider text-[11px] sm:text-[13px] sm:text-[12px]">Back to Inquiries</span>
                </Link>

                <Button
                    variant="ghost"
                    onClick={handleDelete}
                    className="text-ink-300 hover:text-red-500 hover:bg-red-50 flex gap-2 rounded-[14px] transition-all"
                >
                    <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                    <span className="font-semibold uppercase tracking-wider text-[11px] sm:text-[13px] sm:text-[12px]">Delete Record</span>
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Main Message Content */}
                <div className="lg:col-span-8 space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-card rounded-[20px] p-8 md:p-12 shadow-soft border border-ink-100/60 relative overflow-hidden"
                    >
                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-14 h-14 bg-sky/10 rounded-2xl flex items-center justify-center text-sky font-semibold text-2xl">
                                    {inquiry.name.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">{inquiry.name}</h2>
                                    <p className="text-ink-400 font-semibold uppercase tracking-wider text-[11px] sm:text-[13px] sm:text-[12px]">{inquiry.subject}</p>
                                </div>
                            </div>

                            <div className="bg-card rounded-2xl p-8 border border-ink-100/40 min-h-[200px]">
                                <p className="text-ink-700 text-lg md:text-xl leading-relaxed whitespace-pre-wrap">
                                    {inquiry.message}
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-ink-100/40">
                                <div className="flex items-center gap-2 text-ink-400">
                                    <Calendar className="w-4 h-4 text-ink-400" strokeWidth={1.5} />
                                    <span className="text-[11px] sm:text-[13px] sm:text-[13px] font-semibold uppercase tracking-wider">{format(new Date(inquiry.createdAt), "MMMM d, yyyy")}</span>
                                </div>
                                <div className="flex items-center gap-2 text-ink-400">
                                    <Clock className="w-4 h-4 text-ink-400" strokeWidth={1.5} />
                                    <span className="text-[11px] sm:text-[13px] sm:text-[13px] font-semibold uppercase tracking-wider">{format(new Date(inquiry.createdAt), "h:mm a")}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Quick Reply Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-card rounded-[20px] p-8 md:p-10 shadow-elevated border border-ink-100/60 relative overflow-hidden"
                    >
                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-sky rounded-[14px] flex items-center justify-center">
                                    <Send className="w-5 h-5 text-background" strokeWidth={1.5} />
                                </div>
                                <h3 className="text-xl font-semibold text-foreground">Draft a Reply</h3>
                            </div>

                            <form onSubmit={handleReply} className="space-y-6">
                                <Textarea
                                    placeholder="Type your personal response here..."
                                    value={replyMessage}
                                    onChange={(e) => setReplyMessage(e.target.value)}
                                    className="min-h-[180px] bg-card border-ink-200 text-foreground placeholder:text-ink-400 rounded-2xl p-6 text-base focus:ring-[3px] focus:ring-sky/15 focus:border-sky resize-none"
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={isReplying || !replyMessage.trim()}
                                    className="w-full h-14 bg-sky hover:bg-sky-600 text-background transition-all duration-300 rounded-[14px] font-semibold uppercase tracking-wider text-xs flex items-center justify-center gap-3 shadow-soft disabled:opacity-50"
                                >
                                    {isReplying ? (
                                        "Sending Mail..."
                                    ) : (
                                        <>
                                            Send Personal Message
                                            <Send className="w-4 h-4" strokeWidth={1.5} />
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
                        className="bg-card rounded-[20px] p-8 shadow-soft border border-ink-100/60 space-y-8"
                    >
                        <div>
                            <h4 className="text-[11px] sm:text-[13px] sm:text-[13px] font-semibold text-ink-400 uppercase tracking-wider mb-6">Contact Details</h4>
                            <div className="space-y-6">
                                <a href={`mailto:${inquiry.email}`} className="flex items-start gap-4 group">
                                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-ink-400 group-hover:bg-sky group-hover:text-background transition-all shadow-sm">
                                        <Mail className="w-4 h-4" strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <p className="text-[11px] sm:text-[13px] sm:text-[12px] font-semibold text-ink-400 uppercase tracking-wider mb-1">Email Address</p>
                                        <p className="text-sm font-semibold text-foreground break-all group-hover:text-sky transition-colors">{inquiry.email}</p>
                                    </div>
                                </a>

                                <a href={`tel:${inquiry.phone}`} className="flex items-start gap-4 group">
                                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-ink-400 group-hover:bg-sky group-hover:text-background transition-all shadow-sm">
                                        <Phone className="w-4 h-4" strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <p className="text-[11px] sm:text-[13px] sm:text-[12px] font-semibold text-ink-400 uppercase tracking-wider mb-1">Phone Number</p>
                                        <p className="text-sm font-semibold text-foreground group-hover:text-sky transition-colors">{inquiry.phone}</p>
                                    </div>
                                </a>
                            </div>
                        </div>

                        {inquiry.propertyId && (
                            <div className="pt-8 border-t border-ink-100/40">
                                <h4 className="text-[11px] sm:text-[13px] sm:text-[13px] font-semibold text-ink-400 uppercase tracking-wider mb-6">Related Property</h4>
                                <Link
                                    href={`/properties/${inquiry.propertyId.slug}`}
                                    className="block p-4 rounded-2xl bg-muted border border-ink-100/60 hover:border-sky/30 transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-card shrink-0 shadow-sm">
                                            {inquiry.propertyId.images?.[0] ? (
                                                <img src={inquiry.propertyId.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-ink-300">
                                                    <Building2 className="w-6 h-6" strokeWidth={1.5} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-semibold text-foreground truncate leading-tight mb-1">{inquiry.propertyId.title}</p>
                                            <p className="text-[11px] sm:text-[13px] sm:text-[12px] font-semibold text-sky uppercase tracking-wider flex items-center gap-1">
                                                <Globe className="w-3 h-3" strokeWidth={1.5} />
                                                View Listing
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        )}

                        <div className="pt-8 border-t border-ink-100/40 text-center">
                            {inquiry.isRead ? (
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 text-[11px] sm:text-[13px] sm:text-[12px] font-semibold uppercase tracking-wider border border-emerald-500/20">
                                    <CheckCircle2 className="w-4 h-4" strokeWidth={1.5} />
                                    Response Complete
                                </div>
                            ) : (
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 text-orange-600 text-[11px] sm:text-[13px] sm:text-[12px] font-semibold uppercase tracking-wider border border-orange-500/20">
                                    <Clock className="w-4 h-4" strokeWidth={1.5} />
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
