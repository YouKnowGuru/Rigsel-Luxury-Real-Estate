import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/sections/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      xs: "475px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Apple-style neutral palette ("ink" → text, "fog" → surfaces).
        ink: {
          DEFAULT: "#1D1D1F", // primary text
          50: "#F5F5F7",
          100: "#E8E8ED",
          200: "#D2D2D7",
          300: "#B8B8BD",
          400: "#86868B",
          500: "#6E6E73",
          600: "#515154",
          700: "#3A3A3C",
          800: "#1D1D1F",
          900: "#0B0B0D",
        },
        fog: {
          DEFAULT: "#F5F5F7", // section background
          light: "#FBFBFD",
          deep: "#E8E8ED",
        },
        // Apple accent blue + small set of system colors for state.
        sky: {
          DEFAULT: "#0071E3",
          hover: "#0077ED",
          dim: "#147CE5",
          deep: "#0040DD",
        },
        emerald: {
          DEFAULT: "#34C759",
        },
        // Brand accents — used sparingly, mostly for pricing/tags.
        bhutan: {
          red: {
            DEFAULT: "#B22222",
            light: "#C8302E",
            dark: "#8B0000",
            deep: "#6B0000",
          },
          gold: {
            DEFAULT: "#C5A572",
            light: "#D4B57A",
            dark: "#A08854",
            bronze: "#876D3D",
          },
          dark: "#1D1D1F",
          onyx: "#0B0B0D",
          ink: "#15161A",
          pearl: "#FBFBFD",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "1rem",
        "3xl": "1.25rem",
        "4xl": "1.75rem",
        "5xl": "2.25rem",
        apple: "18px", // Apple's signature card corner
        "apple-lg": "24px",
        "apple-xl": "32px",
      },
      fontFamily: {
        sans: [
          "Inter",
          "var(--font-sans)",
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "SF Pro Text",
          "system-ui",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        display: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "system-ui",
          "sans-serif",
        ],
        serif: ["Playfair Display", "Georgia", "serif"],
        mono: [
          "SFMono-Regular",
          "ui-monospace",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      fontSize: {
        // Apple-style fluid type scale — every step is comfortable on every device.
        "fluid-xs": "clamp(0.75rem, 0.72rem + 0.15vw, 0.8125rem)",
        "fluid-sm": "clamp(0.8125rem, 0.78rem + 0.2vw, 0.875rem)",
        "fluid-base": "clamp(0.9375rem, 0.9rem + 0.25vw, 1.0625rem)",
        "fluid-lg": "clamp(1.0625rem, 1rem + 0.3vw, 1.1875rem)",
        "fluid-xl": "clamp(1.1875rem, 1.1rem + 0.4vw, 1.4375rem)",
        "fluid-2xl": "clamp(1.375rem, 1.25rem + 0.6vw, 1.75rem)",
        "fluid-3xl": "clamp(1.75rem, 1.5rem + 1vw, 2.25rem)",
        "fluid-4xl": "clamp(2.125rem, 1.75rem + 1.5vw, 3rem)",
        "fluid-5xl": "clamp(2.5rem, 2rem + 2.25vw, 4rem)",
        "fluid-6xl": "clamp(3rem, 2.25rem + 3vw, 5rem)",
        "fluid-7xl": "clamp(3.5rem, 2.5rem + 4vw, 6.5rem)",
        "fluid-headline":
          "clamp(2.75rem, 2rem + 3.5vw, 5.5rem)", // hero
        "fluid-eyebrow":
          "clamp(0.75rem, 0.72rem + 0.1vw, 0.8125rem)",
      },
      letterSpacing: {
        // Apple uses very tight tracking on large display sizes.
        tightest: "-0.022em",
        tighter2: "-0.035em",
        tighter3: "-0.045em",
        eyebrow: "0.012em",
        wide2: "0.04em",
      },
      lineHeight: {
        tighter: "1.05",
        tight2: "1.08",
        snug2: "1.15",
      },
      spacing: {
        "section-y-sm": "clamp(3rem, 6vw, 5rem)",
        "section-y": "clamp(4rem, 9vw, 8rem)",
        "section-y-lg": "clamp(5rem, 12vw, 10rem)",
      },
      transitionTimingFunction: {
        apple: "cubic-bezier(0.4, 0, 0.2, 1)", // Apple's standard ease
        "apple-out": "cubic-bezier(0.16, 1, 0.3, 1)", // overshoot reveal
        snap: "cubic-bezier(0.22, 1, 0.36, 1)",
        bounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      transitionDuration: {
        fast: "180ms",
        slow: "700ms",
        slower: "1100ms",
        "400": "400ms",
        "600": "600ms",
        "800": "800ms",
        "1000": "1000ms",
        "1200": "1200ms",
        "1500": "1500ms",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-down": {
          from: { opacity: "0", transform: "translateY(-24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          from: { transform: "translateX(-50%)" },
          to: { transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "ken-burns": {
          "0%": { transform: "scale(1) translateY(0)" },
          "100%": { transform: "scale(1.08) translateY(-1.5%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(40px, -30px) scale(1.06)" },
          "66%": { transform: "translate(-30px, 25px) scale(0.97)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.25" },
        },
        "caret-glow": {
          "0%, 100%": { opacity: "1", transform: "scaleY(1)" },
          "50%": { opacity: "0.35", transform: "scaleY(0.82)" },
        },
        "gradient-text": {
          "0%, 100%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in-up":
          "fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in-down":
          "fade-in-down 0.8s cubic-bezier(0.16, 1, 0.3, 1) both",
        "scale-in":
          "scale-in 0.7s cubic-bezier(0.16, 1, 0.3, 1) both",
        marquee: "marquee 40s linear infinite",
        "marquee-fast": "marquee 22s linear infinite",
        "marquee-reverse": "marquee-reverse 40s linear infinite",
        shimmer: "shimmer 3.5s linear infinite",
        "ken-burns": "ken-burns 14s ease-in-out infinite alternate",
        float: "float 5s ease-in-out infinite",
        "float-slow": "float-slow 18s ease-in-out infinite",
        blink: "blink 1s step-start infinite",
        "caret-glow": "caret-glow 1.1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "gradient-text": "gradient-text 7s ease infinite",
      },
      backgroundImage: {
        "gradient-radial":
          "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "fog-soft":
          "linear-gradient(180deg, #FBFBFD 0%, #F5F5F7 100%)",
        "ink-soft":
          "linear-gradient(180deg, #1D1D1F 0%, #0B0B0D 100%)",
        "hero-grain":
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.45 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        // Apple's product shadows are subtle and high-spread.
        soft: "0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)",
        elevated:
          "0 4px 12px rgba(0,0,0,0.06), 0 16px 32px rgba(0,0,0,0.05)",
        lifted:
          "0 10px 30px rgba(0,0,0,0.08), 0 30px 60px rgba(0,0,0,0.06)",
        product:
          "0 30px 80px -30px rgba(0,0,0,0.25), 0 10px 30px -15px rgba(0,0,0,0.15)",
        "inner-soft": "inset 0 1px 0 rgba(255,255,255,0.06)",
        sky: "0 6px 20px rgba(0,113,227,0.25)",
      },
      maxWidth: {
        "screen-2xl": "1536px",
        "apple-content": "1024px",
        "apple-wide": "1200px",
      },
      blur: {
        "4xl": "120px",
      },
      opacity: {
        "1": "0.01",
        "2": "0.02",
        "3": "0.03",
        "4": "0.04",
        "6": "0.06",
        "7": "0.07",
        "8": "0.08",
        "12": "0.12",
        "15": "0.15",
        "18": "0.18",
        "22": "0.22",
      },
    },
  },
  plugins: [
    tailwindcssAnimate,
    typography,
  ],
};

export default config;
