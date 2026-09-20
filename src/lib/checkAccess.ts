import { supabase } from "./supabaseClient";
import { PLANS } from "./plans";

export type AccessResult = {
  hasAccess: boolean;
  tier: "basic" | "advanced" | "pro" | null;
  limit: number;
  used: number;
  remaining: number;
};

/**
 * Vérifie si l'utilisateur a accès à une partie et combien d'utilisations il lui reste.
 * @param userId - ID Supabase de l'utilisateur
 * @param feature - "chat" | "builder" | "agents" | "connecteurs"
 */
export async function checkAccess(userId: string, feature: string): Promise<AccessResult> {
  // 1. Récupère l'abonnement actif pour cette feature
  const { data } = await supabase
    .from("user_features")
    .select("tier, plan_id, status")
    .eq("user_id", userId)
    .eq("feature", feature)
    .eq("status", "active")
    .single();

  if (!data) {
    return { hasAccess: false, tier: null, limit: 0, used: 0, remaining: 0 };
  }

  // 2. Récupère le plan
  const plan = PLANS.find((p) => p.id === data.plan_id);
  if (!plan) {
    return { hasAccess: false, tier: null, limit: 0, used: 0, remaining: 0 };
  }

  // 3. Compte les usages du mois
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from("usage_logs")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("feature", feature)
    .gte("created_at", startOfMonth.toISOString());

  const used = count || 0;
  const limit = plan.limit;

  // 4. Calcule l'accès
  const hasAccess = limit === -1 || used < limit;

  return {
    hasAccess,
    tier: data.tier,
    limit,
    used,
    remaining: limit === -1 ? -1 : Math.max(0, limit - used),
  };
}

/**
 * Enregistre une utilisation (à appeler après chaque action réussie).
 */
export async function logUsage(userId: string, feature: string, action?: string) {
  try {
    await supabase.from("usage_logs").insert({
      user_id: userId,
      feature,
      action: action || null,
      created_at: new Date().toISOString(),
    });
  } catch (e) {
    console.error("logUsage error:", e);
  }
}