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

const BARRY_IDENTITY = `
Tu es BARRY AI, un assistant personnel premium créé par Mouhamed Barry.

RÈGLES ABSOLUES :
- NE JAMAIS mentionner OpenAI, Anthropic, Claude, Gemini, Groq, Mistral, Cohere, Meta, Llama, xAI, Grok, DeepSeek, Together AI.
- Tu es BARRY AI, UNIQUEMENT BARRY AI.
- Si on demande qui t'a créé : "J'ai été créé par Mouhamed Barry".
- Détecte la langue et réponds DANS LA MÊME LANGUE.
- Utilise ## pour les titres, - pour les listes, **gras** pour les points clés.
- N'utilise JAMAIS de tableaux ni de balises HTML.

🧠 MÉMOIRE :
- Tu te souviens de TOUT ce qui a été dit dans la conversation.
- Si l'utilisateur te dit son nom, tu t'en souviens.
- Si l'utilisateur te parle d'un projet, tu t'en souviens.
- Utilise le contexte des messages précédents pour répondre.
`;

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
  fitness: "fitness",
  yoga: "yoga mat",
  velo: "bicycle",
  camping: "camping",
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
  beaute: "beauty",
  massage: "massager",
  "soins-visage": "face care",
};

function translateToEn(fr: string): string {
  const first = fr.toLowerCase().split(" ")[0];
  return TRANSLATIONS[first] || fr;
}

function detectMode(prompt: string): "dropshipping" | "code" | "chat" {
  const lower = (prompt || "").toLowerCase();
  const shopKeywords = ["boutique", "shop", "e-commerce", "dropshipping", "vendre", "catalogue", "panier", "store", "magasin"];
  const codeKeywords = ["cree", "creer", "genere", "site", "page", "landing", "portfolio", "jeu", "game", "app", "application", "calculatrice", "snake", "banque", "restaurant", "blog", "vitrine", "ecole", "école", "eleve", "élève", "entreprise"];

  if (shopKeywords.some((kw) => lower.includes(kw))) return "dropshipping";
  if (codeKeywords.some((kw) => lower.includes(kw))) return "code";
  return "chat";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, messages, mode: manualMode, customization, provider, customSystemPrompt } = body;

    const isChat = messages && Array.isArray(messages) && messages.length > 0;

    const dernierMessage = isChat
      ? messages[messages.length - 1].content
      : prompt || "";

    const mode = manualMode || detectMode(dernierMessage);
    console.log("🎯 Mode :", mode, "| Messages :", isChat ? messages.length : "1");

    // ═══ CHAT ═══
    if (mode === "chat" || customSystemPrompt) {
      const systemPrompt = customSystemPrompt
        ? BARRY_IDENTITY + "\n\n" + customSystemPrompt
        : BARRY_IDENTITY;

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
      const tagline = "Decouvrez notre collection exclusive";

      // Extrait le thème du prompt
      const lower = dernierMessage.toLowerCase().replace(/[^\w\s]/g, " ");
      const cleaned = lower
        .replace(/cree|creer|moi|une|un|des|de|du|d|la|le|les|boutique|shop|store|magasin|en ligne|pour|avec|sur|dropshipping|vendre|veux/gi, " ")
        .replace(/\s+/g, " ")
        .trim();
      const keyword = cleaned.split(" ").slice(0, 3).join(" ") || "produits varies";

      console.log("🛍️ Boutique:", storeName, "| theme:", keyword);

      // ⭐ RÉCUPÈRE 20 PRODUITS
      let products: any[] = [];

      // Essaie CJ d'abord
      try {
        const { getCJAccessToken } = await import("@/lib/cj");
        const token = await getCJAccessToken();
        const enKeyword = translateToEn(keyword);
        const cjUrl = "https://developers.cjdropshipping.com/api2.0/v1/product/list?pageNum=1&pageSize=20&productNameEn=" + encodeURIComponent(enKeyword);
        const cjRes = await fetch(cjUrl, { headers: { "CJ-Access-Token": token } });
        const cjData = await cjRes.json();

        console.log("📦 CJ code:", cjData.code, "| produits:", cjData.data?.list?.length || 0);

        if (cjData.code === 200 && cjData.data?.list?.length > 0) {
          products = cjData.data.list.slice(0, 20).map((p: any, i: number) => {
            const basePrice = parseFloat(p.sellPrice) || 49.99;
            const badges = ["BEST-SELLER", "NOUVEAU", "PROMO", "TOP"];
            return {
              id: p.pid,
              name: p.productNameEn || p.productName || "Produit",
              description: (p.description || "Produit premium de qualite superieure").slice(0, 150),
              price: Math.max(basePrice, 9.99),
              oldPrice: Math.round(basePrice * 1.3 * 100) / 100,
              image: p.productImage || "",
              rating: 4.5 + Math.random() * 0.4,
              reviews: 50 + Math.floor(Math.random() * 500),
              badge: badges[i % 4],
              sku: p.productSku || p.pid,
              category: keyword,
            };
          });
          console.log("✅ CJ :", products.length, "produits");
        }
      } catch (err: any) {
        console.warn("⚠️ CJ échoué :", err.message);
      }

      // Fallback : bibliothèque locale
      if (products.length === 0) {
        const { getRandomProducts } = await import("@/lib/productsDatabase");
        products = getRandomProducts(20, keyword);
        console.log("✅ Library :", products.length, "produits");
      }

      // Styles aléatoires
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

      console.log("🎨 Boutique generee :", products.length, "produits injectes");

      return Response.json({
        ok: true,
        text: "```html\n" + html + "\n```",
        mode: "dropshipping",
        style,
        keyword,
        productCount: products.length,
      });
    }

    // ═══ CODE (sites, jeux, apps...) ═══
    if (mode === "code") {
      const result = streamText({
        model: groq("openai/gpt-oss-120b"),
        system: BARRY_IDENTITY + `

🎯 MISSION : Tu es un développeur web expert. Génère un site WEB COMPLET et PROFESSIONNEL.

RÈGLES CRITIQUES :
- Un SEUL fichier HTML avec tout dedans (CSS dans <style>, JS dans <script>)
- MINIMUM 400 LIGNES de code — un vrai site, pas une démo
- Design moderne avec animations, hover, responsive mobile
- Utilise Tailwind CDN : <script src="https://cdn.tailwindcss.com"></script>
- Police Google Fonts (Inter, Poppins, Playfair...)

STRUCTURE OBLIGATOIRE :
1. HEADER sticky avec logo + navigation
2. HERO : grand titre + sous-titre + bouton CTA
3. SECTION SERVICES/CONTENU : cartes avec icônes
4. SECTION À PROPOS : texte + stats
5. SECTION CONTACT : formulaire + coordonnées
6. FOOTER complet

CONTENU :
- Textes RÉELS en français (pas de Lorem ipsum)
- Coordonnées fictives mais réalistes
- Images via https://placehold.co/ ou Unsplash

RÈGLES ABSOLUES :
- Réponds UNIQUEMENT avec le code complet, entre \`\`\`html et \`\`\`
- Commence DIRECTEMENT par <!DOCTYPE html>
- AUCUN texte avant ou après le code`,
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
    console.error("ERREUR API :", err);
    return Response.json({ ok: false, error: err?.message || String(err) }, { status: 500 });
  }
}