import { NextResponse } from "next/server";
import { getCJAccessToken } from "@/lib/cj";
import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";

const CACHE: Record<string, any[]> = {};

// Traductions FR -> EN
const TRANSLATIONS: Record<string, string> = {
  sneakers: "running shoes", chaussures: "shoes", vetements: "clothing",
  slips: "underwear", soutien: "lingerie bra", lingerie: "lingerie",
  bijoux: "jewelry", montres: "wristwatch", tech: "electronics",
  cosmetiques: "cosmetics", parfum: "perfume", fromages: "cheese",
  guitares: "guitar", velos: "bicycle", plantes: "houseplant",
  chocolat: "chocolate", meubles: "furniture", sacs: "handbag",
  lunettes: "sunglasses", jouets: "toys", montgolfieres: "hot air balloon",
};

function translateKeyword(keyword: string): string {
  const lower = keyword.toLowerCase();
  for (const [fr, en] of Object.entries(TRANSLATIONS)) {
    if (lower.includes(fr)) return en;
  }
  return keyword;
}

// ⭐ Image Unsplash par mot-cle
function unsplashImage(query: string, index: number): string {
  const clean = encodeURIComponent(query.slice(0, 50));
  return `https://source.unsplash.com/600x600/?${clean}&sig=${index}`;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const limit = parseInt(searchParams.get("limit") || "8");

  if (!search) {
    return NextResponse.json({ ok: false, error: "Search manquant" }, { status: 400 });
  }

  const cacheKey = search.toLowerCase().trim();

  if (CACHE[cacheKey]) {
    console.log("✅ Cache :", cacheKey);
    return NextResponse.json({
      ok: true,
      products: CACHE[cacheKey].slice(0, limit),
      source: "cache",
    });
  }

  // ⭐ Essaie CJ
  try {
    const token = await getCJAccessToken();
    const enKeyword = translateKeyword(search);
    console.log("🇫🇷 '" + search + "' → 🇬🇧 '" + enKeyword + "'");

    const url = `https://developers.cjdropshipping.com/api2.0/v1/product/list?pageNum=1&pageSize=${limit}&productNameEn=${encodeURIComponent(enKeyword)}`;
    const res = await fetch(url, { headers: { "CJ-Access-Token": token } });
    const data = await res.json();

    console.log("📦 CJ code:", data.code, "| produits:", data.data?.list?.length || 0);

    if (data.code === 200 && data.data?.list?.length > 0) {
      const products = data.data.list.slice(0, limit).map((p: any, i: number) => {
        const basePrice = parseFloat(p.sellPrice) || 49.99;
        return {
          id: p.pid,
          name: p.productNameEn || p.productName || "Produit",
          description: (p.description || "Produit de qualite premium").slice(0, 150),
          price: Math.max(basePrice, 9.99),
          oldPrice: Math.round(basePrice * 1.3 * 100) / 100,
          image: p.productImage || unsplashImage(enKeyword, i),
          rating: 4.5 + Math.random() * 0.4,
          reviews: 50 + Math.floor(Math.random() * 500),
          badge: ["BEST-SELLER", "NOUVEAU", "PROMO", "TOP"][i % 4],
          sku: p.productSku || p.pid,
        };
      });
      CACHE[cacheKey] = products;
      console.log("✅ CJ :", products.length, "produits");
      return NextResponse.json({ ok: true, products, source: "cj" });
    }

    console.log("⚠️ CJ vide → IA + Unsplash");
  } catch (err: any) {
    console.log("❌ CJ erreur:", err.message, "→ IA + Unsplash");
  }

  // ⭐ IA + Unsplash
  try {
    const { text } = await generateText({
      model: groq("openai/gpt-oss-120b"),
      system: `Tu generes des produits e-commerce. Reponds UNIQUEMENT en JSON valide.

FORMAT : [{"name":"Nike Air Max 270","description":"Amorti revolutionnaire","price":159.99,"unsplash":"red running shoes","rating":4.7,"reviews":234,"badge":"BEST-SELLER"}]

REGLES :
- ${limit} produits varies
- "unsplash" = requete COURTE (2-4 mots ANGLAIS) pour trouver une VRAIE photo
- Exemples : "red nike sneakers", "camembert cheese", "acoustic guitar"
- Badges : BEST-SELLER, NOUVEAU, PROMO, TOP, LUXE, PREMIUM
- JSON UNIQUEMENT, pas de markdown`,
      prompt: `Genere ${limit} produits varies pour une boutique de "${search}".`,
    });

    let jsonText = text.trim().replace(/```json\n?/g, "").replace(/```\n?/g, "");
    const start = jsonText.indexOf("[");
    const end = jsonText.lastIndexOf("]");
    if (start !== -1 && end !== -1) jsonText = jsonText.slice(start, end + 1);

    const products = JSON.parse(jsonText).map((p: any, i: number) => ({
      id: "ai-" + i + "-" + Date.now(),
      name: p.name || "Produit " + (i + 1),
      description: p.description || "Produit de qualite premium",
      price: parseFloat(p.price) || 49.99,
      oldPrice: Math.round((parseFloat(p.price) || 49.99) * 1.3 * 100) / 100,
      image: unsplashImage(p.unsplash || translateKeyword(search), i),
      rating: p.rating || 4.5,
      reviews: p.reviews || 100,
      badge: p.badge || "NOUVEAU",
      sku: "AI-" + (i + 1).toString().padStart(3, "0"),
    }));

    CACHE[cacheKey] = products;
    console.log("✅ IA + Unsplash :", products.length, "produits");
    return NextResponse.json({ ok: true, products, source: "ai-unsplash" });

  } catch (err: any) {
    console.error("❌ Erreur IA:", err.message);

    // Fallback ultime : Unsplash direct
    const keyword = translateKeyword(search);
    const fallback = Array.from({ length: limit }, (_, i) => ({
      id: "fb-" + i,
      name: search.charAt(0).toUpperCase() + search.slice(1) + " " + (i + 1),
      description: "Produit de qualite premium",
      price: 29.99 + i * 10,
      oldPrice: 39.99 + i * 13,
      image: unsplashImage(keyword, i),
      rating: 4.5,
      reviews: 100,
      badge: "NOUVEAU",
      sku: "FB-" + (i + 1).toString().padStart(3, "0"),
    }));

    return NextResponse.json({ ok: true, products: fallback, source: "fallback-unsplash" });
  }
}