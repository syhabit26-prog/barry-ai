let cachedToken: string | null = null;
let tokenExpiry = 0;

export async function getCJAccessToken(): Promise<string> {
  // 1. Cache valide ?
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const email = process.env.CJ_EMAIL;
  const apiKey = process.env.CJ_API_KEY;

  if (!email || !apiKey) {
    throw new Error("CJ_EMAIL ou CJ_API_KEY manquant dans .env.local");
  }

  console.log("🔑 Authentification CJ pour:", email);

  const res = await fetch("https://developers.cjdropshipping.com/api2.0/v1/authentication/getAccessToken", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: apiKey }),
  });

  const data = await res.json();

  if (data?.code !== 200 || !data?.data?.accessToken) {
    console.error("❌ CJ auth échouée:", data);
    throw new Error(`CJ auth: ${data?.message || "inconnu"}`);
  }

  cachedToken = data.data.accessToken;
  tokenExpiry = Date.now() + 12 * 60 * 60 * 1000; // 12h de cache

  console.log("✅ CJ token obtenu, longueur:", cachedToken.length);

  return cachedToken!;
}