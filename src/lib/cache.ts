import { Redis } from "@upstash/redis";
import crypto from "crypto";

const redis = Redis.fromEnv();

const CACHE_TTL = 60 * 60 * 24; // 24 heures
const CACHE_PREFIX = "barry:cache:";

// ═══ Génère un hash du prompt (pour identifier la requête) ═══
export function hashPrompt(input: string): string {
  const normalized = input
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ") // espaces multiples → 1 espace
    .replace(/[^\w\s]/g, ""); // enlève la ponctuation

  return crypto.createHash("sha256").update(normalized).digest("hex").slice(0, 16);
}

// ═══ Récupère du cache ═══
export async function getCache(key: string): Promise<any | null> {
  try {
    const data = await redis.get(CACHE_PREFIX + key);
    if (!data) return null;
    if (typeof data === "string") return JSON.parse(data);
    return data;
  } catch (err) {
    console.warn("⚠️ Cache get error:", err);
    return null;
  }
}

// ═══ Stocke dans le cache ═══
export async function setCache(key: string, value: any): Promise<void> {
  try {
    await redis.set(CACHE_PREFIX + key, JSON.stringify(value), { ex: CACHE_TTL });
    console.log("✅ Cache SET:", key);
  } catch (err) {
    console.warn("⚠️ Cache set error:", err);
  }
}

// ═══ Génère une clé de cache pour une génération ═══
export function getGenerationCacheKey(
  mode: string,
  prompt: string,
  customization?: any
): string {
  const parts = [
    mode,
    hashPrompt(prompt),
    customization?.storeName ? hashPrompt(customization.storeName) : "",
    customization?.keyword || "",
    customization?.color?.primary || "",
    customization?.mood?.id || "",
  ];
  return parts.filter(Boolean).join(":");
}

// ═══ Statistiques du cache ═══
export async function getCacheStats(): Promise<{ hits: number; misses: number; size: number }> {
  try {
    const hits = (await redis.get("barry:cache:stats:hits")) as number | null;
    const misses = (await redis.get("barry:cache:stats:misses")) as number | null;
    return {
      hits: hits || 0,
      misses: misses || 0,
      size: 0,
    };
  } catch {
    return { hits: 0, misses: 0, size: 0 };
  }
}

// ═══ Incrémente les stats ═══
export async function recordHit(): Promise<void> {
  try {
    await redis.incr("barry:cache:stats:hits");
  } catch {}
}

export async function recordMiss(): Promise<void> {
  try {
    await redis.incr("barry:cache:stats:misses");
  } catch {}
}