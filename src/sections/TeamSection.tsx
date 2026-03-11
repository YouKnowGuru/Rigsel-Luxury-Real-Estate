"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import NextImage from "next/image";
import { TeamMember } from "@/types";

export function TeamSection() {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const res = await fetch("/api/team");
                const data = await res.json();
                if (data.success && data.data.length > 0) {
                    setTeamMembers(data.data);
                } else {
                    // Fallback static data
                    setTeamMembers([
                        {
                            _id: "static-1",
                            name: "Jigme Rabgay",
                            role: "Proprietor",
                            image: "/image/jime rabgay.jpg",
                            desc: "Jigme Rabgay is the founder and driving force behind Phojaa Real Estate. With a strong vision for connecting buyers and sellers, he brings extensive knowledge of the property market and a deep commitment to transparency and trust.",
                            quote: "Building trust, one property at a time, with fairness at the core of every deal.",
                            order: 1,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString()
                        },
                        {
                            _id: "static-2",
                            name: "Dorji Wangchuk",
                            role: "General Manager (GM)",
                            image: "/image/dorji wangchuk.jpg",
                            desc: "Dorji Wangchuk manages the daily operations of Phojaa Real Estate, ensuring smooth and efficient property transactions. With expertise in client relations and real estate management.",
                            quote: "Turning property dreams into reality with clarity and care.",
                            order: 2,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString()
                        }
                    ]);
                }
            } catch (error) {
                console.error("Failed to fetch team:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTeam();
    }, []);

    return (
        <section className="py-12 md:py-24 bg-white relative overflow-hidden">
            {/* Decorative background */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-[#F9F7F2]/30 -skew-x-12 transform translate-x-1/2" />

            <div className="w-full max-w-6xl mx-auto px-4 md:px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12 md:mb-20"
                >
                    <div className="inline-block px-4 py-1.5 rounded-full bg-bhutan-red/10 border border-bhutan-red/20 text-bhutan-red text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
                        Our Leaders
                    </div>
                    <h2 className="font-serif text-3xl md:text-5xl font-bold text-bhutan-dark mb-4">
                        Meet the <span className="text-bhutan-red italic font-light">Team</span>
                    </h2>
                    <div className="w-24 h-1 bg-bhutan-gold/30 mx-auto rounded-full" />
                </motion.div>

                <div className="space-y-8 md:space-y-12">
                    {teamMembers.map((member, idx) => (
                        <motion.div
                            key={member._id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex flex-col lg:flex-row items-center gap-8 md:gap-16 bg-white/50 backdrop-blur-sm p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] border border-bhutan-gold/10 hover:border-bhutan-gold/40 hover:shadow-2xl hover:shadow-bhutan-gold/5 transition-all duration-700 group relative overflow-hidden"
                        >
                            {/* Image Column */}
                            <div className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 flex-shrink-0 rounded-3xl overflow-hidden relative ring-1 ring-bhutan-gold/20 ring-offset-8 ring-offset-[#F9F7F2] group-hover:ring-bhutan-red/30 transition-all duration-700 shadow-xl">
                                <NextImage
                                    src={member.image}
                                    alt={member.name}
                                    fill
                                    className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-bhutan-dark/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            </div>

                            {/* Content Column */}
                            <div className="flex-1 text-center lg:text-left space-y-4 md:space-y-8 relative z-10">
                                <div className="space-y-3">
                                    <div className="inline-flex items-center gap-2">
                                        <span className="w-8 h-[1px] bg-bhutan-gold" />
                                        <p className="text-bhutan-gold-dark text-[10px] md:text-[11px] font-bold uppercase tracking-[0.3em]">
                                            {member.role}
                                        </p>
                                    </div>
                                    <h3 className="font-serif text-3xl md:text-5xl font-bold text-bhutan-dark group-hover:text-bhutan-red transition-colors duration-500 tracking-tight">
                                        {member.name}
                                    </h3>
                                </div>

                                <p className="text-bhutan-dark/70 text-base md:text-xl leading-relaxed font-light max-w-2xl">
                                    {member.desc}
                                </p>

                                <div className="relative pt-6">
                                    <span className="absolute -top-2 -left-6 text-6xl md:text-8xl text-bhutan-gold/10 font-serif leading-none">&ldquo;</span>
                                    <p className="text-bhutan-red text-lg md:text-2xl italic font-serif font-medium pl-2 relative z-10">
                                        {member.quote}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
