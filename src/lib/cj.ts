const CJ_API_BASE = "https://developers.cjdropshipping.com/api2.0/v1";

let cachedToken: { token: string; expiry: number } | null = null;

/**
 * Récupère un access token CJ valide (avec cache de 24h).
 */
export async function getCJAccessToken(): Promise<string> {
  // Si on a un token valide en cache, on le réutilise
  if (cachedToken && Date.now() < cachedToken.expiry) {
    return cachedToken.token;
  }

  const apiKey = process.env.CJ_API_KEY;
  if (!apiKey) throw new Error("CJ_API_KEY manquante dans .env.local");

  const res = await fetch(`${CJ_API_BASE}/authentication/getAccessToken`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apiKey }),
  });

  const data = await res.json();

  if (data.code !== 200 || !data.data?.accessToken) {
    throw new Error(`CJ Auth echouee : ${data.message || "inconnue"}`);
  }

  // Le token CJ dure 180 jours, on le cache pour 12h par sécurité
  cachedToken = {
    token: data.data.accessToken,
    expiry: Date.now() + 12 * 60 * 60 * 1000,
  };

  return cachedToken.token;
}