// ── Easing curves ──────────────────────────────────────────────────────────
export const easeLuxury = [0.16, 1, 0.3, 1] as const;
export const easeStandard = [0.4, 0, 0.2, 1] as const;
export const easeOut = [0.0, 0.0, 0.2, 1] as const;

// ── Transitions ────────────────────────────────────────────────────────────
export const defaultTransition = {
  duration: 0.55,
  ease: easeLuxury,
};

export const fastTransition = {
  duration: 0.18,
  ease: easeOut,
};

export const snappyTransition = {
  duration: 0.28,
  ease: easeLuxury,
};

// ── Variants ───────────────────────────────────────────────────────────────
/** Fade upward — used for most content reveals */
export const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

/** Pure opacity fade — for images and backgrounds */
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

/** Slide in from the right */
export const slideInRight = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
};

/** Scale up from slightly smaller */
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1 },
};

/** Container that staggers its children */
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

/** Child of staggerContainer — simple fade up */
export const staggerItem = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

// ── Viewport config ────────────────────────────────────────────────────────
/** Fire once when element enters with 60px margin — efficient, no re-triggering */
export const viewportOnce = {
  once: true,
  margin: "-60px 0px",
} as const;

/** Slightly earlier trigger for large sections */
export const viewportSection = {
  once: true,
  margin: "-40px 0px",
} as const;
