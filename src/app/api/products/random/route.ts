import { NextResponse } from "next/server";
import { getRandomProducts } from "@/lib/productsDatabase";
import { getCJAccessToken } from "@/lib/cj";

const TRANSLATIONS: Record<string, string> = {
  sneakers: "running shoes", chaussures: "shoes", vetements: "clothing",
  bijoux: "jewelry", montres: "wristwatch", tech: "electronics",
  cosmetiques: "cosmetics", parfums: "perfume", sacs: "handbag",
  lunettes: "sunglasses", jouets: "toys", maison: "home decor",
  cuisine: "kitchen", sport: "sport", fitness: "fitness",
  yoga: "yoga mat", velo: "bicycle", camping: "camping",
  voyage: "travel bag", livres: "books", art: "art decor",
  musique: "music", instruments: "guitar", photo: "camera",
  eclairage: "lamp", meubles: "furniture", casques: "headphones",
  enceintes: "speaker", drones: "drone", gaming: "gaming",
  bebe: "baby", animaux: "pet", chocolat: "chocolate",
  cafe: "coffee", the: "tea", outils: "tools", auto: "car",
  moto: "motorcycle", jardin: "garden",
  beaute: "beauty",
  "soins-visage": "face care",
  massage: "massager",
  trending: "best seller",
};

function translateToEn(fr: string): string {
  const lower = fr.toLowerCase();
  if (TRANSLATIONS[lower]) return TRANSLATIONS[lower];
  return fr;
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const count = parseInt(url.searchParams.get("count") || "20");
    const category = url.searchParams.get("category") || undefined;

    if (category) {
      try {
        const token = await getCJAccessToken();
        const enKeyword = translateToEn(category);
        const cjUrl = "https://developers.cjdropshipping.com/api2.0/v1/product/list?pageNum=1&pageSize=" + count + "&productNameEn=" + encodeURIComponent(enKeyword);
        const res = await fetch(cjUrl, { headers: { "CJ-Access-Token": token } });
        const data = await res.json();

        if (data.code === 200 && data.data && data.data.list && data.data.list.length > 0) {
          const products = [];
          for (let i = 0; i < data.data.list.length && i < count; i++) {
            const p = data.data.list[i];
            const basePrice = parseFloat(p.sellPrice) || 49.99;
            const badges = ["BEST-SELLER", "NOUVEAU", "PROMO", "TOP"];
            products.push({
              id: p.pid,
              name: p.productNameEn || p.productName || "Produit",
              description: (p.description || "Produit premium").slice(0, 150),
              price: Math.max(basePrice, 9.99),
              oldPrice: Math.round(basePrice * 1.3 * 100) / 100,
              image: p.productImage || "",
              rating: 4.5 + Math.random() * 0.4,
              reviews: 50 + Math.floor(Math.random() * 500),
              badge: badges[i % 4],
              sku: p.productSku || p.pid,
              category: category,
            });
          }
          return NextResponse.json({ ok: true, products: products, source: "cj" });
        }
      } catch (cjErr) {
        console.log("CJ fallback");
      }
    }

    const products = getRandomProducts(count, category);
    return NextResponse.json({
      ok: true,
      products: products,
      count: products.length,
      category: category || "all",
      source: "library",
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Erreur" }, { status: 500 });
  }
}