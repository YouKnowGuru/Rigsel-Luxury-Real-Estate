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
            const token = localStorage.getItem("adminToken");
            const res = await fetch("/api/admin/team", {
                headers: { Authorization: `Bearer ${token}` }
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
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`/api/admin/team/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
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
            const token = localStorage.getItem("adminToken");
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
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
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
        <div className="p-4 md:p-8 space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-1 h-4 bg-bhutan-red rounded-full" />
                        <p className="text-bhutan-red font-bold text-sm uppercase tracking-[0.3em]">Management</p>
                    </div>
                    <h1 className="text-3xl font-bold text-bhutan-dark">Our Leaders / Team</h1>
                </div>
                <Link
                    href="/admin/team/new"
                    className="flex items-center gap-2 px-5 py-3 bg-bhutan-gold hover:bg-bhutan-red text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md group border border-white/10"
                >
                    <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                    New Member
                </Link>
            </header>

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin w-8 h-8 border-4 border-bhutan-gold border-t-transparent rounded-full" />
                </div>
            ) : members.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-bhutan-gold/10">
                    <Users className="w-12 h-12 text-bhutan-gold/40 mx-auto mb-4" />
                    <p className="text-xl font-serif text-bhutan-dark mb-2">No team members</p>
                    <p className="text-bhutan-dark/40 font-light mb-6">Add someone to start building your leadership team.</p>
                    <button
                        onClick={handleSeed}
                        className="px-6 py-2 bg-bhutan-gold/10 text-bhutan-gold-dark text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-bhutan-gold hover:text-white transition-all"
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
                            className="bg-white rounded-2xl p-6 shadow-sm border border-bhutan-gold/10 relative group hover:border-bhutan-gold/30 hover:shadow-lg transition-all"
                        >
                            <div className="flex gap-4">
                                <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden relative shadow-inner">
                                    <Image src={member.image} alt={member.name} fill className="object-cover" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-bhutan-gold uppercase tracking-[0.2em]">{member.role}</p>
                                    <h3 className="font-serif text-2xl font-bold text-bhutan-dark truncate">{member.name}</h3>
                                    <p className="text-sm text-bhutan-dark/60 mt-1 font-medium">Order: {member.order}</p>
                                </div>
                            </div>

                            <p className="mt-4 text-base text-bhutan-dark/70 italic font-medium line-clamp-2">"{member.quote}"</p>

                            <div className="flex items-center justify-end gap-2 mt-6 pt-4 border-t border-bhutan-gold/10">
                                <Link
                                    href={`/admin/team/${member._id}/edit`}
                                    className="p-2 text-bhutan-dark/40 hover:text-bhutan-gold hover:bg-bhutan-gold/5 rounded-lg transition-colors"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </Link>
                                <button
                                    onClick={() => handleDelete(member._id)}
                                    className="p-2 text-bhutan-dark/40 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
