"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeProvider";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  isScrolled?: boolean;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative inline-flex items-center justify-center w-9 h-9 rounded-full text-foreground/80 hover:text-foreground hover:bg-ink-100/60 dark:hover:bg-ink-800/40 transition-colors duration-fast no-tap",
        className
      )}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      <Sun
        className={cn(
          "w-[18px] h-[18px] absolute transition-all duration-base ease-apple",
          isDark ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"
        )}
        strokeWidth={1.75}
      />
      <Moon
        className={cn(
          "w-[18px] h-[18px] absolute transition-all duration-base ease-apple",
          isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"
        )}
        strokeWidth={1.75}
      />
    </button>
  );
}
