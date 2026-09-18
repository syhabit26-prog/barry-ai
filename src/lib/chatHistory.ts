// ═══════════════════════════════════════════════════════════════
// Sauvegarde locale de l'historique de chat (localStorage)
// Permet de garder l'historique même en changeant de page
// ═══════════════════════════════════════════════════════════════

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const STORAGE_PREFIX = "barry-chat-";

// ─── Charger l'historique d'une page ────────────────────────────
export function loadChat(pageKey: string): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + pageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (err) {
    console.warn("⚠️ Erreur chargement historique :", err);
    return [];
  }
}

// ─── Sauvegarder l'historique d'une page ───────────────────────
export function saveChat(pageKey: string, messages: ChatMessage[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_PREFIX + pageKey, JSON.stringify(messages));
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