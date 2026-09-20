// src/lib/shipping.ts
// Frais de port par pays (en EUR)

const SHIPPING_COSTS: Record<string, number> = {
  // Europe (rapide, proche CJ warehouse EU)
  FR: 4.99, BE: 4.99, CH: 5.99, LU: 4.99, DE: 4.99, ES: 4.99, IT: 4.99,
  NL: 4.99, PT: 4.99, GB: 5.99, IE: 5.99, AT: 5.99,
  // Amérique du Nord
  US: 6.99, CA: 7.99, MX: 8.99,
  // Afrique (plus cher)
  SN: 8.99, CI: 8.99, ML: 9.99, BF: 9.99, NE: 9.99, TG: 9.99, BJ: 9.99,
  CM: 9.99, GA: 10.99,
  // Reste du monde
  DEFAULT: 12.99,
};

export function getShippingCost(countryCode: string): number {
  return SHIPPING_COSTS[countryCode.toUpperCase()] ?? SHIPPING_COSTS.DEFAULT;
}

// Estimation du délai
export function getShippingDays(countryCode: string): string {
  const code = countryCode.toUpperCase();
  if (["FR", "BE", "CH", "LU", "DE", "ES", "IT", "NL", "PT"].includes(code)) return "5 à 8 jours";
  if (["US", "CA", "GB"].includes(code)) return "7 à 12 jours";
  if (["SN", "CI", "ML", "BF"].includes(code)) return "10 à 15 jours";
  return "12 à 20 jours";
}

// ⭐ Poids estimé d'un produit (en grammes, pour CJ)
export function estimateWeight(items: any[]): number {
  let total = 0;
  for (const item of items) {
    const name = (item.name || "").toLowerCase();
    let weight = 300;
    if (name.includes("montre") || name.includes("watch")) weight = 200;
    else if (name.includes("ordinateur") || name.includes("laptop")) weight = 1500;
    else if (name.includes("téléphone") || name.includes("phone")) weight = 400;
    else if (name.includes("bague") || name.includes("bracelet")) weight = 100;
    else if (name.includes("chaussure") || name.includes("shoe")) weight = 800;
    else if (name.includes("sac") || name.includes("bag")) weight = 600;
    else if (name.includes("casque") || name.includes("headphone")) weight = 400;
    total += weight * (item.quantity || 1);
  }
  return Math.max(total, 200);
}