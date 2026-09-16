// ═══════════════════════════════════════════════════════
// FILTRE DE CONTENU - BARRY AI
// Bloque : adulte, violence, haine, spam
// ═══════════════════════════════════════════════════════

const BANNED_WORDS = [
  // 🔞 Contenu adulte
  "porn", "porno", "xxx", "nude", "nudes", "nsfw", "18+", "+18",
  "adult content", "onlyfans", "escort", "camgirl", "camboy",
  "sexy video", "hot girl", "hot boy", "sensual", "erotic",
  "🔞", "hentai", "milf", "bdsm",

  // 💀 Violence
  "gore", "beheading", "torture", "massacre", "brutal murder",

  // 🚫 Haine
  "nazi", "white power", "ethnic cleansing",

  // 🕷️ Spam / Arnaques
  "free crypto", "click here to win", "you won", "nigerian prince",
];

const BANNED_HASHTAGS = [
  "#nsfw", "#18plus", "#18+", "#adult", "#porn", "#xxx",
  "#onlyfans", "#nudes", "#🔞", "#hentai",
];

/**
 * Verifie si un texte est sûr.
 * Retourne true si OK, false si contenu interdit.
 */
export function isSafeContent(text: string | undefined | null): boolean {
  if (!text) return true;

  const lower = text.toLowerCase();

  // Verifie les mots interdits
  for (const word of BANNED_WORDS) {
    if (lower.includes(word)) {
      return false;
    }
  }

  // Verifie les hashtags interdits
  for (const tag of BANNED_HASHTAGS) {
    if (lower.includes(tag)) {
      return false;
    }
  }

  return true;
}

/**
 * Filtre un tableau d'objets qui contiennent du texte.
 * Retourne uniquement les elements sûrs.
 */
export function filterSafeContent<T extends Record<string, any>>(
  items: T[],
  textFields: string[] = ["text", "content", "message", "description"]
): T[] {
  return items.filter((item) => {
    for (const field of textFields) {
      if (item[field] && !isSafeContent(item[field])) {
        return false;
      }
    }
    return true;
  });
}

/**
 * Message standard pour contenu bloque.
 */
export const BLOCKED_MESSAGE =
  "🛡️ Ce contenu a été bloqué pour votre sécurité.\n\n" +
  "BARRY AI filtre automatiquement les contenus inappropriés " +
  "(adulte, violence, haine). Posez une autre question.";