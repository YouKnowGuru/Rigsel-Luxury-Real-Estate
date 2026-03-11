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
        md: "w-10 h-10",
        lg: "w-12 h-12",
        xl: "w-16 h-16",
    };

    return (
        <div className={cn("flex items-center gap-3", className)}>
            <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                    "relative rounded-full overflow-hidden border-2 shadow-lg flex-shrink-0 bg-white",
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
                        "font-serif font-bold leading-none tracking-tight",
                        size === "sm" ? "text-sm" : size === "md" ? "text-lg" : "text-2xl",
                        dark ? "text-white" : "text-bhutan-dark"
                    )}>
                        {settings.siteName.split(" ")[0]}
                        <span className="text-bhutan-red ml-0.5">
                            {settings.siteName.split(" ").slice(1).join(" ")}
                        </span>
                    </h1>
                    <p className={cn(
                        "font-bold uppercase tracking-[0.2em]",
                        size === "sm" ? "text-[8px]" : "text-[10px]",
                        dark ? "text-bhutan-gold" : "text-bhutan-red"
                    )}>
                        Bhutan Property
                    </p>
                </div>
            )}
        </div>
    );
}
