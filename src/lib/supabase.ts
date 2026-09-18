import { createClient } from "@supabase/supabase-js";

// ─── Client PUBLIC (côté navigateur) ────────────────────────────
// Utilise la clé "publishable" → OK dans le navigateur
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ─── Client ADMIN (côté serveur uniquement) ─────────────────────
// Utilise la clé "secret" → JAMAIS dans le navigateur !
// À utiliser uniquement dans les routes API (src/app/api/...)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);