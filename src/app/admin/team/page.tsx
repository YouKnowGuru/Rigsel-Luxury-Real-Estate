"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Users } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { TeamMember } from "@/types";

export default function TeamAdminPage() {
    const { toast } = useToast();
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchMembers = async () => {
        try {
                    const res = await fetch("/api/admin/team", {
                
            });
            const data = await res.json();
            if (data.success) setMembers(data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this team member?")) return;
        try {
                    const res = await fetch(`/api/admin/team/${id}`, {
                method: "DELETE",
                
            });
            const data = await res.json();
            if (data.success) {
                toast({ title: "Deleted", description: "Team member removed." });
                fetchMembers();
            } else {
                toast({ title: "Error", description: data.error, variant: "destructive" });
            }
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    };

    const handleSeed = async () => {
        setIsLoading(true);
        try {
                    const defaults = [
                {
                    name: "Jigme Rabgay",
                    role: "Proprietor",
                    image: "/image/jime rabgay.jpg",
                    desc: "Jigme Rabgay is the founder and driving force behind Phojaa Real Estate. With a strong vision for connecting buyers and sellers, he brings extensive knowledge of the property market and a deep commitment to transparency and trust. He combines a solid background in construction with exposure to advanced architectural and interior design concepts.",
                    quote: "Building trust, one property at a time, with fairness at the core of every deal.",
                    order: 1
                },
                {
                    name: "Dorji Wangchuk",
                    role: "General Manager (GM)",
                    image: "/image/dorji wangchuk.jpg",
                    desc: "Dorji Wangchuk manages the daily operations of Phojaa Real Estate, ensuring smooth and efficient property transactions. With expertise in client relations and real estate management, he is dedicated to providing personalized support while maintaining the highest standards of professionalism.",
                    quote: "Turning property dreams into reality with clarity and care.",
                    order: 2
                }
            ];

            for (const member of defaults) {
                await fetch("/api/admin/team", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(member)
                });
            }
            toast({ title: "Success", description: "Default team seeded successfully." });
            fetchMembers();
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-3 sm:p-4 md:p-8 space-y-6 md:space-y-8">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                    <p className="text-sky text-[12px] font-semibold uppercase tracking-[0.12em] mb-1">Management</p>
                    <h1 className="text-[22px] sm:text-[26px] md:text-[28px] font-semibold text-foreground tracking-tight">Our Leaders / Team</h1>
                </div>
                <Link
                    href="/admin/team/new"
                    className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-sky text-background text-sm font-medium transition-all hover:opacity-90 self-start sm:self-auto"
                >
                    <Plus className="w-4 h-4" strokeWidth={1.5} />
                    New Member
                </Link>
            </header>

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin w-8 h-8 border-4 border-sky/20 border-t-sky rounded-full" />
                </div>
            ) : members.length === 0 ? (
                <div className="text-center py-20 bg-card rounded-[20px] border border-ink-100/60 shadow-soft">
                    <Users className="w-12 h-12 text-ink-300 mx-auto mb-4" strokeWidth={1.5} />
                    <p className="text-xl text-foreground mb-2">No team members</p>
                    <p className="text-ink-400 mb-6">Add someone to start building your leadership team.</p>
                    <button
                        onClick={handleSeed}
                        className="px-6 py-2 rounded-[14px] border border-ink-200 text-ink-600 text-sm font-medium hover:bg-card transition-all"
                    >
                        Import Default Team
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {members.map((member, i) => (
                        <motion.div
                            key={member._id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-card rounded-[20px] border border-ink-100/60 shadow-soft p-6 relative group hover:border-sky/30 transition-all"
                        >
                            <div className="flex gap-3 sm:gap-4">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-xl overflow-hidden relative shadow-inner">
                                    <Image src={member.image} alt={member.name} fill className="object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[11px] sm:text-xs font-semibold text-sky uppercase tracking-wide">{member.role}</p>
                                    <h3 className="text-lg sm:text-2xl font-semibold text-foreground truncate">{member.name}</h3>
                                    <p className="text-xs sm:text-sm text-ink-400 mt-1 font-medium">Order: {member.order}</p>
                                </div>
                            </div>

                            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-ink-500 font-medium line-clamp-2">&ldquo;{member.quote}&rdquo;</p>

                            <div className="flex items-center justify-end gap-2 mt-6 pt-4 border-t border-ink-100">
                                <Link
                                    href={`/admin/team/${member._id}/edit`}
                                    className="p-2 text-ink-300 hover:text-sky hover:bg-sky/5 rounded-lg transition-colors"
                                >
                                    <Edit2 className="w-4 h-4" strokeWidth={1.5} />
                                </Link>
                                <button
                                    onClick={() => handleDelete(member._id)}
                                    className="p-2 text-ink-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
