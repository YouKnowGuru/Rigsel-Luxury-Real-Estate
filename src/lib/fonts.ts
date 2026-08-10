/**
 * Self-hosted fonts via @fontsource (no Google Fonts network fetch at build/dev).
 * Inter is the SF-Pro-style geometric sans we use across the site for an
 * Apple-clean type system. Playfair is kept for rare editorial accents only.
 *
 * Only the 4 weights actually used by the design system are loaded:
 *   400 (body)  500 (medium)  600 (semibold)  700 (bold)
 * Weights 300, 800, 900 were removed to save ~3 WOFF2 network requests.
 */
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";

export const fontClassNames = "font-sans";
