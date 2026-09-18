import { supabase } from "./supabase";

// ═══ Inscription ═══
export async function signUpUser(
  email: string,
  password: string,
  phone: string,
  language: string
): Promise<{ ok: boolean; error?: string; userId?: string }> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { phone, language },
      },
    });

    if (error) return { ok: false, error: error.message };
    if (!data.user) return { ok: false, error: "Erreur création compte" };

    // Met à jour le profil (le trigger l'a créé)
    await supabase
      .from("profiles")
      .update({
        phone,
        language,
        last_active_at: new Date().toISOString(),
      })
      .eq("id", data.user.id);

    return { ok: true, userId: data.user.id };
  } catch (err: any) {
    return { ok: false, error: err.message };
  }
}

// ═══ Connexion ═══
export async function signInUser(
  email: string,
  password: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err.message };
  }
}

// ═══ Déconnexion ═══
export async function signOutUser(): Promise<void> {
  await supabase.auth.signOut();
}

// ═══ Récupère l'utilisateur actuel ═══
export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

// ═══ Met à jour last_active_at ═══
export async function touchActivity(userId: string): Promise<void> {
  try {
    await supabase
      .from("profiles")
      .update({ last_active_at: new Date().toISOString() })
      .eq("id", userId);
  } catch {}
}

// ═══ Vérifie si un compte est bloqué ═══
export async function checkBlocked(userId: string): Promise<{
  blocked: boolean;
  reason?: string;
}> {
  const { data } = await supabase
    .from("profiles")
    .select("blocked, blocked_reason")
    .eq("id", userId)
    .single();

  if (!data) return { blocked: false };
  return {
    blocked: data.blocked || false,
    reason: data.blocked_reason || undefined,
  };
}

// ═══ Récupère le profil complet ═══
export async function getProfile(userId: string) {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  return data;
}

// ═══ Formatage des numéros de téléphone par pays ═══
export const COUNTRY_CODES = [
  { code: "SN", name: "Sénégal", dial: "+221", flag: "🇸🇳" },
  { code: "CI", name: "Côte d'Ivoire", dial: "+225", flag: "🇨🇮" },
  { code: "ML", name: "Mali", dial: "+223", flag: "🇲🇱" },
  { code: "FR", name: "France", dial: "+33", flag: "🇫🇷" },
  { code: "US", name: "United States", dial: "+1", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", dial: "+44", flag: "🇬🇧" },
  { code: "ES", name: "España", dial: "+34", flag: "🇪🇸" },
  { code: "SA", name: "السعودية", dial: "+966", flag: "🇸🇦" },
  { code: "CN", name: "中国", dial: "+86", flag: "🇨🇳" },
  { code: "MA", name: "Maroc", dial: "+212", flag: "🇲🇦" },
  { code: "CM", name: "Cameroun", dial: "+237", flag: "🇨🇲" },
  { code: "CD", name: "Congo", dial: "+243", flag: "🇨🇩" },
];