"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeProvider";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  isScrolled?: boolean;
}

export function ThemeToggle({ className, isScrolled = true }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative w-9 h-9 xl:w-10 xl:h-10 rounded-full flex items-center justify-center transition-all duration-500 group/theme",
        isScrolled
          ? "bg-gray-100 hover:bg-bhutan-gold/20 text-bhutan-dark dark:bg-white/10 dark:hover:bg-bhutan-gold/20 dark:text-white"
          : "bg-white/10 hover:bg-white/20 text-white backdrop-blur-md",
        className
      )}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      <Sun
        className={cn(
          "w-4 h-4 absolute transition-all duration-500",
          isDark
            ? "opacity-0 rotate-90 scale-0"
            : "opacity-100 rotate-0 scale-100"
        )}
      />
      <Moon
        className={cn(
          "w-4 h-4 absolute transition-all duration-500",
          isDark
            ? "opacity-100 rotate-0 scale-100"
            : "opacity-0 -rotate-90 scale-0"
        )}
      />
    </button>
  );
}
