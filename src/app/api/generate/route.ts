import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { deepseek } from "@ai-sdk/deepseek";
import { groq } from "@ai-sdk/groq";
import { google } from "@ai-sdk/google";
import { mistral } from "@ai-sdk/mistral";
import { cohere } from "@ai-sdk/cohere";
import { xai } from "@ai-sdk/xai";
import { togetherai } from "@ai-sdk/togetherai";
import { streamText } from "ai";

export const maxDuration = 60;

const BARRY_IDENTITY = `Tu es BARRY AI.`;

// ⭐ TRADUCTIONS ENRICHIES avec mots-clés CJ précis
const TRANSLATIONS: Record<string, string[]> = {
  sneakers: ["running shoes", "sneakers", "athletic shoes", "sport shoes"],
  chaussures: ["shoes", "footwear", "casual shoes"],
  bijoux: ["jewelry", "necklace", "earrings", "bracelet", "ring"],
  montres: ["wristwatch", "watch", "luxury watch"],
  tech: ["electronics", "gadget", "smart device"],
  cosmetiques: ["cosmetics", "makeup", "lipstick", "mascara"],
  beaute: ["beauty", "skincare", "facial care", "beauty device"],
  "soins-visage": ["face care", "facial cleanser", "face mask"],
  massage: ["massager", "massage gun", "body massager"],
  parfums: ["perfume", "fragrance", "eau de toilette"],
  sacs: ["handbag", "purse", "tote bag", "shoulder bag"],
  lunettes: ["sunglasses", "eyewear", "eyeglasses"],
  vetements: ["clothing", "apparel", "fashion wear"],
  casques: ["headphones", "earphones", "earbuds"],
  gaming: ["gaming", "game controller", "gaming accessories"],
  maison: ["home decor", "home accessories"],
  cuisine: ["kitchen", "kitchenware", "cookware"],
  sport: ["sport", "fitness", "workout"],
  voyage: ["travel bag", "luggage", "backpack"],
  bebe: ["baby", "baby care", "baby toys"],
  animaux: ["pet supplies", "pet toy", "pet care"],
  jouets: ["toys", "kids toys", "educational toys"],
};

// ⭐ Fonction qui essaie plusieurs mots-clés jusqu'à trouver
async function searchCJProducts(
  keywords: string[],
  count: number,
  token: string
): Promise<any[]> {
  for (const keyword of keywords) {
    try {
      const url = `https://developers.cjdropshipping.com/api2.0/v1/product/list?pageNum=1&pageSize=${count}&productNameEn=${encodeURIComponent(keyword)}`;
      const res = await fetch(url, { headers: { "CJ-Access-Token": token } });
      const data = await res.json();

      if (data.code === 200 && data.data?.list?.length > 0) {
        console.log(`✅ CJ: "${keyword}" → ${data.data.list.length} produits`);
        return data.data.list;
      }
      console.log(`⚠️ CJ: "${keyword}" → vide`);
    } catch (err: any) {
      console.warn(`⚠️ CJ "${keyword}" erreur:`, err.message);
    }
  }
  return [];
}

function detectMode(prompt: string): "dropshipping" | "code" | "chat" {
  const lower = (prompt || "").toLowerCase();
  const shopKeywords = ["boutique", "shop", "e-commerce", "dropshipping", "vendre", "store", "magasin"];
  const codeKeywords = ["cree", "creer", "genere", "site", "page", "portfolio", "jeu", "game", "app", "application", "banque", "restaurant", "vitrine", "ecole"];

  if (shopKeywords.some((kw) => lower.includes(kw))) return "dropshipping";
  if (codeKeywords.some((kw) => lower.includes(kw))) return "code";
  return "chat";
}

// ⭐ Extrait le thème principal
function extractTheme(prompt: string): string {
  const lower = prompt.toLowerCase();

  // Cherche un mot-clé connu
  for (const key of Object.keys(TRANSLATIONS)) {
    if (lower.includes(key)) return key;
  }

  // Sinon, nettoie le prompt
  const cleaned = lower
    .replace(/cree|creer|moi|une|un|des|de|du|d|la|le|les|boutique|shop|store|magasin|en ligne|pour|avec|sur|dropshipping|vendre|veux|beaute|beauté/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  return cleaned.split(" ").slice(0, 2).join(" ") || "produits varies";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, messages, mode: manualMode, customization, provider, customSystemPrompt } = body;

    const isChat = messages && Array.isArray(messages) && messages.length > 0;
    const dernierMessage = isChat ? messages[messages.length - 1].content : prompt || "";
    const mode = manualMode || detectMode(dernierMessage);

    console.log("🎯 Mode:", mode);

    // ═══ CHAT ═══
    if (mode === "chat" || customSystemPrompt) {
      const systemPrompt = customSystemPrompt ? BARRY_IDENTITY + "\n\n" + customSystemPrompt : BARRY_IDENTITY;

      const modele =
        provider === "openai" ? openai("gpt-4o-mini")
        : provider === "claude" ? anthropic("claude-3-5-haiku-20241022")
        : provider === "deepseek" ? deepseek("deepseek-chat")
        : provider === "gemini" ? google("gemini-2.5-flash")
        : provider === "mistral" ? mistral("mistral-large-latest")
        : provider === "cohere" ? cohere("command-r-plus")
        : provider === "grok" ? xai("grok-beta")
        : provider === "together" ? togetherai("meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo")
        : groq("openai/gpt-oss-120b");

      const result = streamText({
        model: modele,
        system: systemPrompt,
        messages: isChat ? messages : [{ role: "user", content: dernierMessage }],
      });
      return result.toTextStreamResponse();
    }

    // ═══ DROPSHIPPING ═══
    if (mode === "dropshipping") {
      const storeName = customization?.storeName || "Ma Boutique";
      const tagline = "Découvrez notre collection exclusive";

      const keyword = extractTheme(dernierMessage);
      console.log("🛍️ Boutique:", storeName, "| Thème:", keyword);

      // ⭐ Cherche les mots-clés EN associés
      const keywords = TRANSLATIONS[keyword] || [keyword];

      let products: any[] = [];

      // 1) Essaie CJ avec les mots-clés précis
      try {
        const { getCJAccessToken } = await import("@/lib/cj");
        const token = await getCJAccessToken();
        const cjProducts = await searchCJProducts(keywords, 20, token);

        if (cjProducts.length > 0) {
          products = cjProducts.slice(0, 20).map((p: any, i: number) => {
            const basePrice = parseFloat(p.sellPrice) || 49.99;
            return {
              id: p.pid,
              name: p.productNameEn || p.productName || "Produit",
              description: (p.description || "Produit premium").slice(0, 150),
              price: Math.max(basePrice, 9.99),
              oldPrice: Math.round(basePrice * 1.3 * 100) / 100,
              image: p.productImage || "",
              rating: 4.5 + Math.random() * 0.4,
              reviews: 50 + Math.floor(Math.random() * 500),
              badge: ["BEST-SELLER", "NOUVEAU", "PROMO", "TOP"][i % 4],
              sku: p.productSku || p.pid,
              category: keyword,
            };
          });
        }
      } catch (err: any) {
        console.warn("⚠️ CJ échoué:", err.message);
      }

      // 2) Fallback : bibliothèque locale filtrée par catégorie
      if (products.length === 0) {
        const { getRandomProducts } = await import("@/lib/productsDatabase");
        products = getRandomProducts(20, keyword);
        console.log("📦 Fallback local:", products.length, "produits de", keyword);
      }

      const styles = ["modern", "luxury", "colorful", "minimal"] as const;
      const style = styles[Math.floor(Math.random() * styles.length)];

      const { buildDropshippingSite } = await import("@/lib/dropshippingTemplate");
      const html = buildDropshippingSite(
        storeName,
        tagline,
        keyword,
        customization?.color,
        customization?.mood,
        style,
        products
      );

      return Response.json({
        ok: true,
        text: "```html\n" + html + "\n```",
        mode: "dropshipping",
        style,
        keyword,
        productCount: products.length,
      });
    }

    // ═══ CODE ═══
    if (mode === "code") {
      const result = streamText({
        model: groq("openai/gpt-oss-120b"),
        system: BARRY_IDENTITY + `

🎯 Développeur web expert. Génère un site COMPLET et PROFESSIONNEL.

STRUCTURE :
1. HEADER sticky (logo + nav)
2. HERO (titre + sous-titre + CTA)
3. SECTION SERVICES (3-6 cartes)
4. SECTION À PROPOS
5. SECTION CONTACT
6. FOOTER

RÈGLES :
- UN SEUL fichier HTML complet
- MINIMUM 400 lignes
- Tailwind CDN + Google Fonts
- Responsive mobile
- Animations CSS

Réponds UNIQUEMENT avec le code entre \`\`\`html et \`\`\`
Commence par <!DOCTYPE html>`,
        messages: isChat ? messages : [{ role: "user", content: dernierMessage }],
      });
      return result.toTextStreamResponse();
    }

    // ═══ FALLBACK ═══
    const result = streamText({
      model: groq("openai/gpt-oss-120b"),
      system: BARRY_IDENTITY,
      messages: isChat ? messages : [{ role: "user", content: dernierMessage }],
    });
    return result.toTextStreamResponse();

  } catch (err: any) {
    console.error("❌ ERREUR:", err);
    return Response.json({ ok: false, error: err?.message || String(err) }, { status: 500 });
  }
}