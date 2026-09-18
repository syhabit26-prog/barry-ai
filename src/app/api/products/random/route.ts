import { NextResponse } from "next/server";
import { getRandomProducts } from "@/lib/productsDatabase";
import { getCJAccessToken } from "@/lib/cj";

// Traductions FR → EN pour CJ
const TRANSLATIONS: Record<string, string> = {
  sneakers: "running shoes",
  chaussures: "shoes",
  vetements: "clothing",
  bijoux: "jewelry",
  montres: "wristwatch",
  tech: "electronics",
  cosmetiques: "cosmetics",
  parfums: "perfume",
  sacs: "handbag",
  lunettes: "sunglasses",
  jouets: "toys",
  maison: "home decor",
  cuisine: "kitchen",
  sport: "sport",
  fitness: "fitness equipment",
  yoga: "yoga mat",
  velo: "bicycle",
  camping: "camping gear",
  voyage: "travel bag",
  livres: "books",
  art: "art decor",
  musique: "music",
  instruments: "guitar",
  photo: "camera",
  eclairage: "lamp",
  meubles: "furniture",
  casques: "headphones",
  enceintes: "speaker",
  drones: "drone",
  gaming: "gaming",
  bebe: "baby",
  animaux: "pet",
  chocolat: "chocolate",
  cafe: "coffee",
  the: "tea",
  outils: "tools",
  auto: "car",
  moto: "motorcycle",
  jardin: "garden",
};

function translateToEn(fr: string): string {
  return TRANSLATIONS[fr.toLowerCase()] || fr;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const count = parseInt(searchParams.get("count") || "20");
    const category = searchParams.get("category") || undefined;

    // ⭐ ESSAIE CJ D'ABORD (vraies images de produits)
    if (category) {
      try {
        const token = await getCJAccessToken();
        const enKeyword = translateToEn(category);
        const url = `https://developers.cjdropshipping.com/api2.0/v1/product/list?pageNum=1&pageSize=${count}&productNameEn=${encodeURIComponent(enKeyword)}`;
        const res = await fetch(url, { headers: { "CJ-Access-Token": token } });
        const data = await res.json();

        console.log("📦 CJ pour", category, ":", data.code, "|", data.data?.list?.length || 0, "produits");

        if (data.code === 200 && data.data?.list?.length > 0) {
          const products = data.data.list.slice(0, count).map((p: any, i: number) => {
            const basePrice = parseFloat(p.sellPrice) || 49.99;
            return {
              id: p.pid,
              name: p.productNameEn || p.productName || "Produit",
              description: (p.description || "Produit premium de qualite superieure").slice(0, 150),
              price: Math.max(basePrice, 9.99),
              oldPrice: Math.round(basePrice * 1.3 * 100) / 100,
              image: p.productImage || "",
              rating: 4.5 + Math.random() * 0.4,
              reviews: 50 + Math.floor(Math.random() * 500),
              badge: ["BEST-SELLER", "NOUVEAU", "PROMO", "TOP"][i % 4],
              sku: p.productSku || p.pid,
              category,
            };
          });

          console.log("✅ CJ :", products.length, "produits pour", category);
          return NextResponse.json({ ok: true, products, source: "cj" });
        }
      } catch (err: any) {
        console.log("⚠️ CJ échoué, fallback library :", err.message);
      }
    }

    // Fallback : bibliothèque 5000
    const products = getRandomProducts(count, category);

    return NextResponse.json({
      ok: true,
      products,
      count: products.length,
      category: category || "all",
      source: "library",
    });
  } catch (err: any) {
    console.error("❌ Erreur random products :", err);
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    );
  }
}