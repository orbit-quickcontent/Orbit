/**
 * 🟠 CORE | Shared Animation Variants
 * 
 * Reusable Framer Motion animation variants used across
 * dashboard views for staggered list animations.
 */

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};
