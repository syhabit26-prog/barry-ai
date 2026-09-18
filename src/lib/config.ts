// ═══════════════════════════════════════════════════════════════
// Configuration centrale — URLs et settings
// Une seule source de vérité pour tout le projet
// ═══════════════════════════════════════════════════════════════

// URL de base de l'application
// En local : http://localhost:3000
// En production : change juste NEXT_PUBLIC_APP_URL dans .env.local
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "http://localhost:3000";

// URL publique des sites créés (page /s/[slug])
export const PUBLIC_SITE_PREFIX = `${APP_URL}/s`;

// Nom de l'app
export const APP_NAME = "BARRY AI";

// Support email
export const SUPPORT_EMAIL = "syhabit26@gmail.com";

// Devise par défaut
export const DEFAULT_CURRENCY = "EUR";