"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSettings } from "@/context/SettingsContext";

interface LogoProps {
    className?: string;
    size?: "sm" | "md" | "lg" | "xl";
    showText?: boolean;
    dark?: boolean;
}

export function Logo({ className, size = "md", showText = false, dark = false }: LogoProps) {
    const { settings } = useSettings();
    const sizes = {
        sm: "w-8 h-8",
        md: "w-9 h-9 md:w-10 md:h-10",
        lg: "w-10 h-10 md:w-12 md:h-12",
        xl: "w-12 h-12 md:w-16 md:h-16",
    };

    const firstWord = settings.siteName.split(" ")[0];
    const otherWords = settings.siteName.split(" ").slice(1).join(" ");

    return (
        <div className={cn("flex items-center gap-2 md:gap-3", className)}>
            <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                    "relative rounded-full overflow-hidden border shadow-lg flex-shrink-0 bg-white",
                    sizes[size],
                    dark ? "border-bhutan-gold/30" : "border-bhutan-red/10"
                )}
            >
                <Image
                    src="/image/logo.png"
                    alt="Phojaa Logo"
                    fill
                    className="object-cover"
                    priority
                />
                {/* Shine animation */}
                <motion.div
                    animate={{
                        left: ["-100%", "200%"],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatDelay: 2,
                        ease: "linear",
                    }}
                    className="absolute top-0 w-20 h-full bg-white/20 -skew-x-12 z-10"
                />
            </motion.div>

            {showText && (
                <div className="flex flex-col">
                    <h1 className={cn(
                        "font-serif font-bold leading-none tracking-tight whitespace-nowrap",
                        size === "sm" ? "text-xs md:text-sm" :
                            size === "md" ? "text-lg md:text-xl" :
                                "text-xl md:text-3xl",
                        dark ? "text-white" : "text-bhutan-dark"
                    )}>
                        {firstWord}
                        {otherWords && (
                            <span className="text-bhutan-red ml-0.5">
                                {otherWords}
                            </span>
                        )}
                    </h1>
                    <p className={cn(
                        "font-bold uppercase tracking-[0.1em] md:tracking-[0.2em]",
                        size === "sm" ? "text-[7px] md:text-[8px]" : "text-[8px] md:text-[10px]",
                        dark ? "text-bhutan-gold" : "text-bhutan-red"
                    )}>
                        Bhutan Property
                    </p>
                </div>
            )}
        </div>
    );
}
