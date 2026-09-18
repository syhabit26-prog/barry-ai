import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

// ═══ Limiteurs très hautes — protection anti-abus uniquement ═══

// Génération de sites/boutiques : 100 000 par heure
export const generateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100000, "1 h"),
  analytics: true,
  prefix: "barry:generate",
});

// Génération d'images : 1 000 000 par heure
export const imageLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(1000000, "1 h"),
  analytics: true,
  prefix: "barry:image",
});

// Génération 3D : 1 000 000 par heure
export const model3DLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(1000000, "1 h"),
  analytics: true,
  prefix: "barry:3d",
});

// Chat : 10 000 000 messages par heure
export const chatLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10000000, "1 h"),
  analytics: true,
  prefix: "barry:chat",
});