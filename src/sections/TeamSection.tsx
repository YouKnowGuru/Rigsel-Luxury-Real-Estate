"use client";

import { motion } from "framer-motion";
import useSWR from "swr";
import NextImage from "next/image";
import { TeamMember } from "@/types";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { fetcher, ApiResponse } from "@/lib/fetcher";

const fallbackTeam: TeamMember[] = [
  {
    _id: "static-1",
    name: "Jigme Rabgay",
    role: "Proprietor",
    image: "/image/jime rabgay.jpg",
    desc: "Jigme Rabgay is the founder and driving force behind PHOJAA95 Real Estate. With a strong vision for connecting buyers and sellers, he brings extensive knowledge of the property market and a deep commitment to transparency and trust.",
    quote: "Building trust, one property at a time — fairness at the core of every deal.",
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "static-2",
    name: "Dorji Wangchuk",
    role: "General Manager",
    image: "/image/dorji wangchuk.jpg",
    desc: "Dorji Wangchuk manages the daily operations of PHOJAA95 Real Estate, ensuring smooth and efficient property transactions. He brings expertise in client relations and real estate management.",
    quote: "Turning property dreams into reality, with clarity and care.",
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function TeamSection() {
  // Use SWR for caching and deduplication
  const { data, error } = useSWR<ApiResponse<TeamMember[]>>("/api/team", fetcher, {
    dedupingInterval: 300000, // 5 minutes - team data rarely changes
    revalidateOnFocus: false,
  });

  const teamMembers = data?.data?.length ? data.data : !data && !error ? fallbackTeam : [];

  return (
    <section className="section-y content-visibility-auto">
      <div className="container-apple-wide">
        <SectionHeader
          eyebrow="The team"
          title="Meet the people."
          highlight="Behind every deal."
          subtitle="Real people, deep local knowledge, and a track record of trust across Bhutan."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 max-w-5xl mx-auto">
          {teamMembers.map((member, idx) => (
            <motion.article
              key={member._id}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.7,
                delay: idx * 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="glass rounded-apple-xl overflow-hidden group hover:shadow-product transition-shadow duration-500"
            >
              <div className="relative aspect-[4/3] sm:aspect-[5/4] overflow-hidden bg-ink-100">
                <NextImage
                  src={member.image}
                  alt={member.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-1200 ease-apple-out group-hover:scale-[1.04]"
                />
              </div>
              <div className="p-6 sm:p-8">
                <p className="text-[12px] font-semibold uppercase tracking-eyebrow text-sky mb-2">
                  {member.role}
                </p>
                <h3 className="font-semibold text-[24px] sm:text-[28px] tracking-tighter2 leading-tight2 text-foreground">
                  {member.name}
                </h3>
                <p className="mt-3 text-[15px] sm:text-[16px] text-ink-500 leading-snug2 max-w-md">
                  {member.desc}
                </p>
                {member.quote && (
                  <p className="mt-5 pt-5 border-t border-ink-200/70 dark:border-ink-700/40 text-[15px] sm:text-[16px] text-foreground italic">
                    &ldquo;{member.quote}&rdquo;
                  </p>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
