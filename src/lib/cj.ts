// src/lib/cj.ts
// Helper pour l'API CJ Dropshipping

const CJ_BASE = "https://developers.cjdropshipping.com/api2.0/v1";

let cachedToken: string | null = null;
let tokenExpiry = 0;

export async function getCJAccessToken(): Promise<string> {
  // Réutilise le token s'il est encore valide (marge de 5 min)
  if (cachedToken && Date.now() < tokenExpiry - 5 * 60 * 1000) {
    return cachedToken;
  }

  const email = process.env.CJ_EMAIL;
  const apiKey = process.env.CJ_API_KEY;

  if (!email || !apiKey) {
    throw new Error("CJ_EMAIL ou CJ_API_KEY manquant dans .env.local");
  }

  const res = await fetch(`${CJ_BASE}/authentication/getAccessToken`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: apiKey }),
  });

  const data = await res.json();

  if (data.code !== 200 || !data.data?.accessToken) {
    throw new Error("CJ auth échouée: " + (data.message || "inconnue"));
  }

  cachedToken = data.data.accessToken;
  // CJ token valable 15 jours
  tokenExpiry = Date.now() + 15 * 24 * 60 * 60 * 1000;

  console.log("✅ CJ token obtenu, expire le", new Date(tokenExpiry).toISOString());
  return cachedToken!;
}

// ⭐ Créer une commande chez CJ (createOrderV2)
export async function createCJOrder(payload: any): Promise<any> {
  const token = await getCJAccessToken();

  const res = await fetch(`${CJ_BASE}/shopping/order/createOrderV2`, {
    method: "POST",
    headers: {
      "CJ-Access-Token": token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  console.log("📦 CJ createOrderV2 response:", data?.code, data?.message);
  return data;
}

// ⭐ Récupérer les détails d'un produit CJ (utile pour les variantes)
export async function getCJProduct(pid: string): Promise<any> {
  const token = await getCJAccessToken();

  const res = await fetch(`${CJ_BASE}/product/query?pid=${encodeURIComponent(pid)}`, {
    headers: { "CJ-Access-Token": token },
  });

  return await res.json();
}