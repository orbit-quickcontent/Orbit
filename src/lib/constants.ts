/**
 * 🟠 CORE | Shared Constants
 * 
 * Application-wide constants used across Client and Partner frontends.
 * Single source of truth for avatar colors, partner stats, and currency formatting.
 */

// Avatar gradient colors (used in login, profile views) — 7 colors matching design reference
export const AVATAR_COLORS = [
  "from-orbit-cyan to-blue-500",
  "from-orbit-purple to-pink-500",
  "from-green-400 to-emerald-500",
  "from-orange-400 to-red-500",
  "from-yellow-400 to-amber-500",
  "from-violet-400 to-fuchsia-500",
  "from-rose-400 to-pink-500",
] as const;

// Human-like avatar emojis for selection
export const AVATAR_EMOJIS = [
  "👤", "🧑", "👨", "👩", "🧔", "👱‍♀️", "👨‍🦱", "👩‍🦰",
  "🧑‍💻", "👨‍🎨", "👩‍🎤", "🧑‍🚀", "👨‍🍳", "👩‍🔬", "🦊", "🐱",
] as const;

// Default partner stats (mock data for demo)
export const DEFAULT_PARTNER_STATS = {
  completed: 47,
  rating: 4.9,
  totalEarnings: 184500,
  monthlyEarnings: 34500,
  weeklyEarnings: 8200,
  streak: 50,
} as const;

// Format currency in US Dollars
export function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`;
}
