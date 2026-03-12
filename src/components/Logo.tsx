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
        md: "w-10 h-10 md:w-12 md:h-12",
        lg: "w-12 h-12 md:w-14 md:h-14",
        xl: "w-14 h-14 md:w-20 md:h-20",
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
                    dark ? "border-bhutan-gold/30" : "border-bhutan-green/20"
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
                <div className="flex flex-col min-w-0">
                    <h1 className={cn(
                        "font-serif font-bold leading-[1.1] md:leading-[1.1] tracking-tight",
                        size === "sm" ? "text-[11px] md:text-sm" :
                            size === "md" ? "text-base md:text-xl" :
                                "text-lg sm:text-2xl md:text-4xl lg:text-5xl",
                        "text-bhutan-green",
                        "animate-glow-green transition-all"
                    )}>
                        {firstWord}
                        {otherWords && (
                            <span className="text-bhutan-green ml-1 animate-glow-green">
                                {otherWords}
                            </span>
                        )}
                    </h1>
                    <p className={cn(
                        "font-bold uppercase tracking-[0.05em] sm:tracking-[0.1em] md:tracking-[0.2em] whitespace-nowrap",
                        size === "sm" ? "text-[6px] md:text-[7px]" : "text-[7px] sm:text-[8px] md:text-[10px]",
                        "text-bhutan-green",
                        "animate-glow-green transition-all"
                    )}>
                        Bhutan Property
                    </p>
                </div>
            )}
        </div>
    );
}
