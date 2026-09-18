// ═══════════════════════════════════════════════════════════════
// Sauvegarde locale de l'historique (localStorage)
// Expire automatiquement après 1 heure
// ═══════════════════════════════════════════════════════════════

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type StoredChat = {
  messages: ChatMessage[];
  savedAt: number;  // timestamp en ms
};

const STORAGE_PREFIX = "barry-chat-";
const EXPIRATION_MS = 60 * 60 * 1000;  // 1 heure

// ─── Charger l'historique (avec vérif expiration) ──────────────
export function loadChat(pageKey: string): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + pageKey);
    if (!raw) return [];

    const parsed: StoredChat = JSON.parse(raw);

    // Si l'ancien format (tableau simple) → nettoyer
    if (Array.isArray(parsed)) {
      localStorage.removeItem(STORAGE_PREFIX + pageKey);
      return [];
    }

    // Vérifier expiration
    const age = Date.now() - (parsed.savedAt || 0);
    if (age > EXPIRATION_MS) {
      console.log("⏰ Historique expiré, suppression");
      localStorage.removeItem(STORAGE_PREFIX + pageKey);
      return [];
    }

    return parsed.messages || [];
  } catch (err) {
    console.warn("⚠️ Erreur chargement historique :", err);
    return [];
  }
}

// ─── Sauvegarder avec timestamp ────────────────────────────────
export function saveChat(pageKey: string, messages: ChatMessage[]): void {
  if (typeof window === "undefined") return;
  try {
    const stored: StoredChat = {
      messages,
      savedAt: Date.now(),
    };
    localStorage.setItem(STORAGE_PREFIX + pageKey, JSON.stringify(stored));
  } catch (err) {
    console.warn("⚠️ Erreur sauvegarde historique :", err);
  }
}

// ─── Effacer l'historique d'une page ──────────────────────────
export function clearChat(pageKey: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_PREFIX + pageKey);
  } catch (err) {
    console.warn("⚠️ Erreur suppression historique :", err);
  }
}

// ─── Clés par page ────────────────────────────────────────────
export const PAGE_KEYS = {
  CHAT: "chat",
  BUILDER: "builder",
  COACH: "coach",
} as const;