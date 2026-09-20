import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { deepseek } from "@ai-sdk/deepseek";
import { groq } from "@ai-sdk/groq";
import { google } from "@ai-sdk/google";
import { mistral } from "@ai-sdk/mistral";
import { cohere } from "@ai-sdk/cohere";
import { xai } from "@ai-sdk/xai";
import { togetherai } from "@ai-sdk/togetherai";
import { streamText, generateText } from "ai";
import { detectSiteType, buildSiteConfig, generateImages } from "@/lib/siteTemplates";
import { buildMultiPageSite } from "@/lib/multiPageGenerator";

export const maxDuration = 300;

const BARRY_IDENTITY = `Tu es BARRY AI, un assistant personnel premium créé par Mouhamed Barry.
- Détecte la langue et réponds DANS LA MÊME LANGUE.
- Utilise ## pour les titres, - pour les listes, **gras** pour les points clés.`;

function getModel(provider: string) {
  switch (provider) {
    case "openai": return openai("gpt-4o-mini");
    case "claude": return anthropic("claude-3-5-haiku-20241022");
    case "deepseek": return deepseek("deepseek-chat");
    case "gemini": return google("gemini-2.0-flash-exp");
    case "mistral": return mistral("mistral-large-latest");
    case "cohere": return cohere("command-r-plus");
    case "grok": return xai("grok-beta");
    case "together": return togetherai("meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo");
    default: return groq("openai/gpt-oss-120b");
  }
}

function extractName(prompt: string): string {
  const m = prompt.match(/(?:nommée?|appelée?|nom)\s+([a-zA-ZÀ-ÿ0-9][a-zA-ZÀ-ÿ0-9\s'-]{1,25})/i);
  if (m) {
    const raw = m[1].replace(/\s+(et|avec|de|du|pour|qui|à|au|le|la|les|des|un|une)\s*.*/i, "").replace(/[^\wÀ-ÿ\s'-]/g, "").trim();
    if (raw.length >= 2) return raw.charAt(0).toUpperCase() + raw.slice(1);
  }
  const cleaned = prompt.replace(/[^\wÀ-ÿ\s]/g, " ").replace(/\b(cree|créer|moi|un|une|des|de|du|d|la|le|les|site|web|page|jeu|jeux|game|app|application|boutique|portfolio|pour|avec|sur|fais|faire|génère|générer|je|veux|souhaite|nommé|nommée|appelé|appelée|qui|s'appelle|et|moderne|sombre|élégant|minimaliste|vibrant|vintage|luxe|rétro)\b/gi, " ").replace(/\s+/g, " ").trim();
  const words = cleaned.split(" ").filter((w) => w.length > 2);
  if (words.length === 0) return "Mon Site";
  const name = words.slice(0, 2).join(" ");
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function getColors(mood: string): { primary: string; secondary: string } {
  const m: Record<string, { primary: string; secondary: string }> = {
    rouge: { primary: "#ef4444", secondary: "#dc2626" },
    bleu: { primary: "#3b82f6", secondary: "#2563eb" },
    vert: { primary: "#22c55e", secondary: "#16a34a" },
    jaune: { primary: "#facc15", secondary: "#f59e0b" },
    violet: { primary: "#a855f7", secondary: "#7c3aed" },
    orange: { primary: "#f97316", secondary: "#ea580c" },
    rose: { primary: "#ec4899", secondary: "#db2777" },
    noir: { primary: "#ffffff", secondary: "#a1a1aa" },
    blanc: { primary: "#1a1a1a", secondary: "#71717a" },
    cyan: { primary: "#06b6d4", secondary: "#0891b2" },
  };
  return m[mood.toLowerCase()] || m.jaune;
}

function detectMode(prompt: string): "dropshipping" | "code" | "chat" {
  const lower = (prompt || "").toLowerCase();
  const shop = ["boutique", "shop", "e-commerce", "dropshipping", "vendre", "catalogue", "panier", "store", "magasin"];
  const code = ["cree", "creer", "genere", "site", "page", "landing", "portfolio", "jeu", "jeux", "game", "app", "application", "banque", "restaurant", "blog", "vitrine", "ecole", "hotel", "avocat", "sante", "cinema", "cinéma"];
  if (shop.some((kw) => lower.includes(kw))) return "dropshipping";
  if (code.some((kw) => lower.includes(kw))) return "code";
  return "chat";
}

function translateToEnglish(keyword: string): string {
  const dict: Record<string, string> = {
    tech: "smartphone", technologie: "smartphone", informatique: "laptop",
    ordinateur: "laptop", ordinateurs: "laptop", ordi: "laptop", pc: "laptop",
    telephone: "smartphone", smartphones: "smartphone", portable: "smartphone",
    gadget: "smartphone", gadgets: "smartphone", electronics: "smartphone",
    tablettes: "tablet", tablette: "tablet", ipad: "tablet",
    claviers: "keyboard", clavier: "keyboard", souris: "mouse",
    casques: "headphones", casque: "headphones", ecouteurs: "earbuds", earbuds: "earbuds",
    enceintes: "speaker", enceinte: "speaker", microphones: "microphone", micro: "microphone",
    drones: "drone", cameras: "camera", camera: "camera", imprimantes: "printer",
    ecrans: "monitor", ecran: "monitor", chargeurs: "charger", chargeur: "charger",
    cables: "cable", cable: "cable",
    bijoux: "jewelry", bijou: "jewelry", bagues: "ring", bague: "ring",
    bracelets: "bracelet", bracelet: "bracelet", colliers: "necklace", collier: "necklace",
    montres: "watch", montre: "watch", "montres connectees": "smartwatch",
    beaute: "cosmetics", beauté: "cosmetics", maquillage: "makeup",
    cosmetiques: "cosmetics", cosmetique: "cosmetics", "soins visage": "skincare",
    "soins cheveux": "haircare", parfums: "perfume", parfum: "perfume",
    ongles: "nail polish", barbe: "beard trimmer",
    mode: "fashion", vetements: "clothing", vêtements: "clothing",
    sneakers: "sneakers", chaussures: "shoes", bottes: "boots", sandales: "sandals",
    casquettes: "cap", chapeaux: "hat", bonnets: "beanie", gants: "gloves",
    echarpes: "scarf", cravates: "tie", polos: "polo", chemises: "shirt",
    pulls: "sweater", sweats: "hoodie", vestes: "jacket", manteaux: "coat",
    jeans: "jeans", pantalons: "pants", shorts: "shorts", chaussettes: "socks",
    slips: "underwear", "sous vetements": "underwear", boxer: "underwear",
    pyjamas: "pajamas", robes: "dress", robe: "dress", jupes: "skirt", jupe: "skirt",
    "t-shirts": "tshirt", tshirt: "tshirt",
    sacs: "handbag", sac: "bag", "sac a dos": "backpack", sacs_dos: "backpack",
    portefeuilles: "wallet", portefeuille: "wallet", valises: "suitcase", valise: "suitcase",
    ceintures: "belt", ceinture: "belt", lunettes: "sunglasses",
    "lunettes soleil": "sunglasses", "lunettes vue": "glasses",
    meubles: "furniture", canapes: "sofa", canape: "sofa", chaises: "chair", chaise: "chair",
    tables: "table", table: "table", lits: "bed", lit: "bed",
    armoires: "wardrobe", armoire: "wardrobe", eclairage: "lamp", lampe: "lamp",
    tapis: "carpet", decoration: "decoration", rideaux: "curtain",
    coussins: "cushion", couvertures: "blanket", draps: "bedding",
    sdb: "bathroom", rangement: "storage", menage: "cleaning",
    cuisine: "kitchen", "robots cuisine": "kitchen appliance", vaisselle: "dishes",
    fromages: "cheese", chocolat: "chocolate", cafe: "coffee", the: "tea",
    vins: "wine", biere: "beer", epicerie: "grocery", snacks: "snack",
    patisserie: "pastry", glaces: "ice cream",
    outils: "tools", perceuses: "drill", jardin: "garden", plantes: "plant",
    sport: "sport", fitness: "fitness", velos: "bicycle", velo: "bicycle",
    natation: "swimming", camping: "camping", peche: "fishing",
    auto: "car accessories", moto: "motorcycle", bebe: "baby",
    jouets: "toys", "jeux societe": "board game", animaux: "pet",
    musique: "music", guitares: "guitar", guitare: "guitar", instruments: "instrument",
    voyage: "travel", livres: "book", papeterie: "stationery", aquarium: "aquarium",
  };
  const lower = keyword.toLowerCase().trim();
  if (dict[lower]) return dict[lower];
  for (const [fr, en] of Object.entries(dict)) {
    if (lower.includes(fr) || fr.includes(lower)) return en;
  }
  return keyword;
}

export async function POST(req: Request) {
  try {
    const body: any = await req.json();
    const { prompt, messages, mode: manualMode, customization, customSystemPrompt, provider } = body;

    const isChat = messages && Array.isArray(messages) && messages.length > 0;
    const dernierMessage = isChat ? messages[messages.length - 1].content : prompt || "";
    const mode = manualMode || detectMode(dernierMessage);

    console.log("🎯 Mode:", mode, "| IA:", provider || "groq");

    // CHAT
    if (mode === "chat" || customSystemPrompt) {
      const systemPrompt = customSystemPrompt ? BARRY_IDENTITY + "\n\n" + customSystemPrompt : BARRY_IDENTITY;
      const result = streamText({
        model: getModel(provider || "groq"),
        system: systemPrompt,
        messages: isChat ? messages : [{ role: "user", content: dernierMessage }],
      });
      return result.toTextStreamResponse();
    }

    // MODIFY
    if (mode === "modify") {
      const { currentHtml, instruction, uploadedImages } = body;
      if (!currentHtml) return Response.json({ ok: false, error: "Aucun site à modifier" });

      let newHtml = currentHtml;

      if (uploadedImages && uploadedImages.length > 0) {
        const gallery = `<section class="page" id="galerie"><div class="page-inner"><header class="page-header"><span class="page-badge">Galerie</span><h2 class="page-title">Galerie</h2></header><div class="photo-masonry">${uploadedImages.map((url: string, i: number) => `<div class="photo-tile"><img src="${url}" alt="Photo ${i + 1}" /></div>`).join("")}</div></div></section>`;
        newHtml = newHtml.includes('id="galerie"') ? newHtml.replace(/<section[^>]*id="galerie"[\s\S]*?<\/section>/, gallery) : newHtml.replace(/<footer/, gallery + "\n<footer");
        return Response.json({ ok: true, text: newHtml, mode: "modify" });
      }

      const result = await generateText({
        model: getModel(provider || "groq"),
        system: `Tu MODIFIES du code HTML. Retourne UNIQUEMENT le HTML complet entre \`\`\`html et \`\`\`.`,
        prompt: `HTML:\n${currentHtml.slice(0, 40000)}\n\nINSTRUCTION: ${instruction}\n\nRetourne HTML complet.`,
      });
      return Response.json({ ok: true, text: result.text, mode: "modify" });
    }

    // CODE
    if (mode === "code") {
      const type = detectSiteType(dernierMessage);
      let name = customization?.name || extractName(dernierMessage);
      if (name.length > 30) name = name.slice(0, 30).trim();

      const { computeSignature, animateHtml } = await import("@/lib/animator");
      const uniqueSalt = Date.now() + "-" + Math.random().toString(36).slice(2, 10);
      const signature = computeSignature(dernierMessage + "|" + uniqueSalt);

      const colorKey = customization?.color;
      const color = colorKey
        ? getColors(typeof colorKey === "string" ? colorKey : colorKey?.name || "jaune")
        : { primary: signature.palette.accent, secondary: signature.palette.accent2 };

      const config = buildSiteConfig(dernierMessage, name, `Découvrez ${name}`, color, customization?.mood?.name || "moderne");

      let photos: string[] = [];
      let videos: string[] = [];
      try {
        const { searchPhotos, searchVideos, getQueriesForType } = await import("@/lib/pexels");
        const queries = getQueriesForType(type);
        const r = await Promise.all([searchPhotos(queries.photos, 8), searchVideos(queries.video, 3)]);
        photos = r[0] || [];
        videos = r[1] || [];
      } catch {}
      if (photos.length === 0) photos = generateImages(type, 8);

      let baseHtml = buildMultiPageSite(config, {
        heroVideoUrl: videos[0],
        extraVideos: videos.slice(1),
        galleryPhotos: photos,
      });

      const html = animateHtml(baseHtml + `<!-- salt:${uniqueSalt} -->`, {
        heroVideoUrl: videos[0],
        heroImageUrl: photos[0],
        extraVideos: videos.slice(1),
        accentColor: color.primary,
      });

      let projectId = null, slug = null;
      try {
        const { supabaseAdmin } = await import("@/lib/supabaseAdmin");
        const { generateSlug } = await import("@/lib/slug");
        slug = generateSlug(name);
        const { data } = await supabaseAdmin.from("projects").insert({ name, prompt: dernierMessage, html, slug, published: false }).select().single();
        projectId = data?.id;
      } catch {}

      return Response.json({ ok: true, text: "```html\n" + html + "\n```", mode: "code", projectId, slug, siteType: type, instant: true });
    }

    // DROPSHIPPING
    if (mode === "dropshipping") {
      const storeName = customization?.storeName || extractName(dernierMessage);
      const lower = dernierMessage.toLowerCase().replace(/[^\w\s]/g, " ");
      const keyword = lower.replace(/cree|creer|moi|une|un|des|de|du|d|la|le|les|boutique|shop|store|magasin|en ligne|pour|avec|sur|dropshipping|vendre|veux/gi, " ").replace(/\s+/g, " ").trim().split(" ").slice(0, 3).join(" ") || "produits varies";

      const { computeSignature } = await import("@/lib/animator");
      const uniqueSalt = Date.now() + "-" + Math.random().toString(36).slice(2, 10);
      const signature = computeSignature(dernierMessage + "|" + keyword + "|" + uniqueSalt);

      const colorKey = customization?.color;
      const color = colorKey
        ? getColors(typeof colorKey === "string" ? colorKey : colorKey?.name || "jaune")
        : { primary: signature.palette.accent, secondary: signature.palette.accent2 };

      const enKeyword = translateToEnglish(keyword);
      console.log("🌐 Recherche CJ:", keyword, "→", enKeyword);

      let products: any[] = [];
      try {
        const { getCJAccessToken } = await import("@/lib/cj");
        const token = await getCJAccessToken();
        const cjUrl = `https://developers.cjdropshipping.com/api2.0/v1/product/list?pageNum=1&pageSize=20&productNameEn=${encodeURIComponent(enKeyword)}`;
        const cjRes = await fetch(cjUrl, { headers: { "CJ-Access-Token": token } });
        const cjData = await cjRes.json();

        if (cjData.code === 200 && cjData.data?.list?.length > 0) {
          const enWords = enKeyword.toLowerCase().split(/[\s,]+/).filter((w: string) => w.length > 3);
          const filtered = cjData.data.list.filter((p: any) => {
            const pName = (p.productNameEn || p.productName || "").toLowerCase();
            return enWords.some((w: string) => pName.includes(w));
          });
          const listToUse = filtered.length >= 3 ? filtered : cjData.data.list;
          console.log(`🔍 CJ filtré: ${filtered.length}/${cjData.data.list.length}`);

          products = listToUse.slice(0, 20).map((p: any, i: number) => {
            const basePrice = parseFloat(p.sellPrice) || 49.99;
            return {
              id: p.pid,
              vid: p.variantId || p.vid || p.pid,
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
          console.log("✅ CJ:", products.length, "produits");
        }
      } catch (e) {
        console.warn("⚠️ CJ échoué:", e);
      }

      if (products.length === 0) {
        try {
          const { getRandomProducts } = await import("@/lib/productsDatabase");
          products = getRandomProducts(keyword, 20);
          console.log("⚠️ Fallback local:", products.length);
        } catch {}
      }

      let videos: string[] = [];
      try {
        const { searchVideos } = await import("@/lib/pexels");
        videos = await searchVideos(enKeyword, 5);
        if (videos.length < 3) {
          const more = await searchVideos("luxury product cinematic", 3);
          videos = [...videos, ...more];
        }
      } catch {}

      const { buildDropshippingSite } = await import("@/lib/dropshippingTemplate");
      const html = buildDropshippingSite(
        storeName,
        "Découvrez notre collection exclusive",
        keyword,
        color,
        customization?.mood?.name || "moderne",
        signature.animStyle,
        products,
        { extraVideos: videos },
        signature
      );

      console.log("🎉 Boutique:", html.length, "chars |", products.length, "produits");

      let projectId = null, slug = null;
      try {
        const { supabaseAdmin } = await import("@/lib/supabaseAdmin");
        const { generateSlug } = await import("@/lib/slug");
        slug = generateSlug(storeName);
        const { data } = await supabaseAdmin.from("projects").insert({ name: storeName, prompt: dernierMessage, html, slug, published: false }).select().single();
        projectId = data?.id;
      } catch {}

      return Response.json({
        ok: true,
        text: "```html\n" + html + "\n```",
        mode: "dropshipping",
        projectId,
        slug,
        productCount: products.length,
        palette: color.primary,
        anim: signature.animStyle,
        instant: true,
      });
    }

    return Response.json({ ok: false, error: "Mode inconnu" }, { status: 400 });
  } catch (err: any) {
    console.error("❌", err);
    return Response.json({ ok: false, error: err?.message || String(err) }, { status: 500 });
  }
}