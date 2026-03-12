"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
    const whatsappUrl = "https://wa.me/message/PKJFHGFCVTYPH1";

    return (
        <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-8 right-8 z-[60] group"
            aria-label="Contact us on WhatsApp"
        >
            <div className="relative">
                {/* Outer Glow Pulse */}
                <div className="absolute inset-0 bg-[#25D366] rounded-full blur-md opacity-40 animate-pulse group-hover:opacity-60 transition-opacity" />

                {/* Main Button */}
                <div className="relative bg-[#25D366] text-white p-4 rounded-full shadow-2xl flex items-center justify-center border-2 border-white/20">
                    <MessageCircle className="w-7 h-7 fill-current" />
                </div>

                {/* Tooltip */}
                <div className="absolute bottom-full right-0 mb-4 px-4 py-2 bg-bhutan-dark dark:bg-card text-white dark:text-foreground text-[10px] font-bold uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-xl transform translate-y-2 group-hover:translate-y-0 border border-white/5 dark:border-white/10">
                    Chat with Us
                    <div className="absolute top-full right-6 border-8 border-transparent border-t-bhutan-dark dark:border-t-card" />
                </div>
            </div>
        </motion.a>
    );
}
