// ═══════════════════════════════════════════════════════════════
// Générateur aléatoire à seed (déterministe)
// ═══════════════════════════════════════════════════════════════

export function seededRandom(seed: string): () => number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }
  return function () {
    h = Math.imul(h ^ h >>> 15, h | 1);
    h ^= h + Math.imul(h ^ h >>> 7, h | 61);
    return ((h ^ h >>> 14) >>> 0) / 4294967296;
  };
}

export function pick<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

// ═══════════════════════════════════════════════════════════════
// Profil de design unique par site
// ═══════════════════════════════════════════════════════════════

export type DesignProfile = {
  fontFamily: string;
  fontImport: string;
  heroStyle: "centered" | "split" | "fullscreen";
  cardStyle: "icon-top" | "icon-left" | "image-top";
  animationStyle: "gentle" | "dynamic" | "cinematic";
  layoutGradient: "radial" | "linear" | "mesh";
  borderRadius: number;
  shadowIntensity: number;
  headerStyle: "fixed" | "sticky" | "transparent";
};

const FONTS = [
  { family: "Inter", import: "Inter:wght@400;500;600;700;900" },
  { family: "Poppins", import: "Poppins:wght@400;500;600;700;900" },
  { family: "Space Grotesk", import: "Space+Grotesk:wght@400;500;600;700" },
  { family: "Outfit", import: "Outfit:wght@400;500;600;700;900" },
  { family: "Sora", import: "Sora:wght@400;500;600;700;800" },
  { family: "Manrope", import: "Manrope:wght@400;500;600;700;800" },
  { family: "DM Sans", import: "DM+Sans:wght@400;500;600;700;900" },
];

export function generateDesignProfile(seed: string): DesignProfile {
  const rng = seededRandom(seed + Date.now().toString());

  const font = pick(FONTS, rng);

  return {
    fontFamily: font.family,
    fontImport: font.import,
    heroStyle: pick(["centered", "split", "fullscreen"] as const, rng),
    cardStyle: pick(["icon-top", "icon-left", "image-top"] as const, rng),
    animationStyle: pick(["gentle", "dynamic", "cinematic"] as const, rng),
    layoutGradient: pick(["radial", "linear", "mesh"] as const, rng),
    borderRadius: pick([12, 20, 28], rng),
    shadowIntensity: 0.5 + rng() * 0.5,
    headerStyle: pick(["fixed", "sticky", "transparent"] as const, rng),
  };
}

// ═══════════════════════════════════════════════════════════════
// Palette de couleurs dérivée
// ═══════════════════════════════════════════════════════════════

export function generatePalette(
  primary: string,
  secondary: string,
  variation: number
): { primary: string; secondary: string; accent: string; bg: string } {
  if (variation === 0) {
    return { primary, secondary, accent: secondary, bg: "#0a0a0a" };
  }
  if (variation === 1) {
    return { primary: secondary, secondary: primary, accent: primary, bg: "#050505" };
  }
  return { primary, secondary: "#ffffff15", accent: primary, bg: "#0f0f12" };
}