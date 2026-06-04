export const easeLuxury = [0.16, 1, 0.3, 1] as const;

export const defaultTransition = {
  duration: 0.7,
  ease: easeLuxury,
};

export const fastTransition = {
  duration: 0.2,
  ease: easeLuxury,
};

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const slideInRight = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0 },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

export const viewportOnce = {
  once: true,
  margin: "-80px" as const,
};
