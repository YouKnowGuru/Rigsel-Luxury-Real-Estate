"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Scale, FileText, Anchor, Gavel, AlertCircle } from "lucide-react";

const sections = [
    {
        icon: FileText,
        title: "1. Acceptance of Terms",
        content: "By accessing and using the Phojaa Real Estate website, you agree to be bound by these Terms and Conditions and all applicable laws and regulations in the Kingdom of Bhutan. If you do not agree with any of these terms, you are prohibited from using or accessing this site."
    },
    {
        icon: Scale,
        title: "2. Real Estate Services",
        content: "Phojaa Real Estate acts as a facilitator connecting property buyers and sellers. While we strive for accuracy, all property listings, descriptions, dimensions, and prices are provided for informational purposes only. Users are advised to verify all details independently before entering into any legal or financial commitments."
    },
    {
        icon: ShieldCheck,
        title: "3. User Obligations",
        content: "Users agree to provide accurate, current, and complete information when inquiries are made. You are prohibited from using the site for any unlawful purpose or to solicit others to perform or participate in any unlawful acts as per the laws of Bhutan."
    },
    {
        icon: Anchor,
        title: "4. Property Transactions",
        content: "All property transactions facilitated through our platform must comply with the Land Act of Bhutan and other relevant property laws. Phojaa Real Estate is not responsible for any disputes arising from transactions between buyers and sellers, although we provide guidance and facilitation services."
    },
    {
        icon: Gavel,
        title: "5. Intellectual Property",
        content: "The content, layout, design, data, and graphics on this website are protected by Bhutanese and international intellectual property laws. Content may not be reproduced, downloaded, or distributed without express written permission from Phojaa Real Estate."
    },
    {
        icon: AlertCircle,
        title: "6. Limitation of Liability",
        content: "In no event shall Phojaa Real Estate or its partners be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website."
    }
];

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#F9F7F2] pt-28 pb-20">
            <div className="absolute inset-0 bg-thangka opacity-[0.02] pointer-events-none" />

            <div className="max-w-4xl mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-block px-4 py-1.5 rounded-full bg-bhutan-red/10 border border-bhutan-red/20 text-bhutan-red text-[10px] font-bold uppercase tracking-[0.3em] mb-6">
                        Legal Information
                    </div>
                    <h1 className="font-serif text-3xl md:text-5xl font-bold text-bhutan-dark mb-6">
                        Terms & <span className="text-bhutan-red italic font-light">Conditions</span>
                    </h1>
                    <p className="text-bhutan-dark/50 font-light max-w-2xl mx-auto italic">
                        Last updated: March 11, 2026. Please read these rules and regulations carefully before using our services.
                    </p>
                </motion.div>

                <div className="space-y-8">
                    {sections.map((section, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white rounded-2xl p-6 md:p-8 border border-bhutan-gold/10 hover:border-bhutan-red/20 transition-all shadow-sm group"
                        >
                            <div className="flex items-start gap-6">
                                <div className="w-12 h-12 rounded-xl bg-bhutan-red/5 flex items-center justify-center flex-shrink-0 group-hover:bg-bhutan-red transition-colors duration-500">
                                    <section.icon className="w-6 h-6 text-bhutan-red group-hover:text-white transition-colors" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="font-serif text-xl font-bold text-bhutan-dark mb-3 group-hover:text-bhutan-red transition-colors">
                                        {section.title}
                                    </h2>
                                    <p className="text-bhutan-dark/70 leading-relaxed font-light">
                                        {section.content}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-16 p-8 bg-bhutan-dark rounded-3xl text-center text-white relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-thangka opacity-[0.05] pointer-events-none" />
                    <h3 className="font-serif text-2xl font-bold mb-4 relative z-10">Questions regarding our terms?</h3>
                    <p className="text-white/60 font-light mb-8 relative z-10">We are here to clear any doubts about our property services and policies.</p>
                    <a
                        href="/contact"
                        className="inline-block px-8 py-4 bg-bhutan-red text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-white hover:text-bhutan-red transition-all relative z-10"
                    >
                        Contact Legal representative
                    </a>
                </motion.div>
            </div>
        </div>
    );
}
