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
- Détecte la langue et réponds DANS LA MÊME LANGUE.`;

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

function getEditorModel(provider: string) {
  if (provider === "openai") return openai("gpt-4o-mini");
  if (provider === "claude") return anthropic("claude-3-5-haiku-20241022");
  return groq("openai/gpt-oss-120b");
}

function extractName(prompt: string): string {
  const m = prompt.match(/(?:nommée?|appelée?|nom)\s+([a-zA-ZÀ-ÿ0-9][a-zA-ZÀ-ÿ0-9\s'-]{1,25})/i);
  if (m) {
    const raw = m[1].replace(/\s+(et|avec|de|du|pour|qui|à|au|le|la|les|des|un|une)\s*.*/i, "").replace(/[^\wÀ-ÿ\s'-]/g, "").trim();
    if (raw.length >= 2) return raw.charAt(0).toUpperCase() + raw.slice(1);
  }
  const stop = /\b(cree|crée|creer|créer|moi|un|une|des|de|du|d|la|le|les|site|web|page|jeu|jeux|game|app|application|boutique|portfolio|pour|avec|sur|fais|faire|génère|genere|générer|generer|je|veux|souhaite)\b/gi;
  const cleaned = prompt.replace(/[^\wÀ-ÿ\s]/g, " ").replace(stop, " ").replace(/\s+/g, " ").trim();
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

function getSiteColor(name: string, type: string): { primary: string; secondary: string } {
  const PALETTES = [
    { primary: "#ef4444", secondary: "#dc2626" },
    { primary: "#3b82f6", secondary: "#2563eb" },
    { primary: "#22c55e", secondary: "#16a34a" },
    { primary: "#facc15", secondary: "#f59e0b" },
    { primary: "#a855f7", secondary: "#7c3aed" },
    { primary: "#f97316", secondary: "#ea580c" },
    { primary: "#ec4899", secondary: "#db2777" },
    { primary: "#06b6d4", secondary: "#0891b2" },
  ];
  let h = 0;
  const seed = name + "|" + type + "|" + Date.now();
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return PALETTES[Math.abs(h) % PALETTES.length];
}

function detectMode(prompt: string): "dropshipping" | "code" | "chat" {
  const lower = (prompt || "").toLowerCase();
  const shop = ["boutique", "shop", "e-commerce", "dropshipping", "vendre", "catalogue", "panier", "store", "magasin"];
  const code = ["cree", "creer", "genere", "site", "page", "landing", "portfolio", "jeu", "jeux", "game", "app", "application", "banque", "restaurant", "blog", "vitrine", "ecole", "hotel", "avocat", "sante"];
  if (shop.some((kw) => lower.includes(kw))) return "dropshipping";
  if (code.some((kw) => lower.includes(kw))) return "code";
  return "chat";
}

function extractHtml(text: string): string {
  if (!text) return "";
  let m = text.match(/```html\s*\n([\s\S]*?)```/i);
  if (m) return m[1].trim();
  m = text.match(/```\s*\n([\s\S]*?)```/);
  if (m) return m[1].trim();
  let idx = text.indexOf("<!DOCTYPE");
  if (idx !== -1) return text.slice(idx).trim();
  idx = text.indexOf("<html");
  if (idx !== -1) return text.slice(idx).trim();
  return text;
}

export async function POST(req: Request) {
  try {
    const body: any = await req.json();
    const { prompt, messages, mode: manualMode, customization, customSystemPrompt, provider } = body;

    const isChat = messages && Array.isArray(messages) && messages.length > 0;
    const dernierMessage = isChat ? messages[messages.length - 1].content : prompt || "";
    const mode = manualMode || detectMode(dernierMessage);
    const selectedProvider = provider || "groq";

    console.log("🎯 Mode:", mode);

    // ═══════════════════════════════════════════════════════
    // MODE CHAT + DÉTECTION D'AGENT
    // ═══════════════════════════════════════════════════════
    if (mode === "chat" || customSystemPrompt) {
      // ⭐ Si pas de customSystemPrompt, on essaie de détecter un agent
      if (!customSystemPrompt) {
        try {
          const { findAgentInMessage } = await import("@/lib/allAgents");
          const detectedAgent = findAgentInMessage(dernierMessage);

          if (detectedAgent) {
            console.log("🤖 Agent détecté:", detectedAgent.name, "(" + detectedAgent.slug + ")");

            const result = streamText({
              model: getModel(selectedProvider),
              system:
                BARRY_IDENTITY +
                "\n\n" +
                detectedAgent.systemPrompt +
                "\n\n⚠️ RÈGLE : Présente-toi au début en disant que tu es " +
                detectedAgent.name +
                ". Reste dans ton domaine. Si la question est hors sujet, redirige poliment l'utilisateur.",
              messages: isChat ? messages : [{ role: "user", content: dernierMessage }],
            });

            return result.toTextStreamResponse();
          }
        } catch (e) {
          console.warn("⚠️ Détection agent échouée:", e);
        }
      }

      // Chat normal
      const systemPrompt = customSystemPrompt
        ? BARRY_IDENTITY + "\n\n" + customSystemPrompt
        : BARRY_IDENTITY;

      const result = streamText({
        model: getModel(selectedProvider),
        system: systemPrompt,
        messages: isChat ? messages : [{ role: "user", content: dernierMessage }],
      });
      return result.toTextStreamResponse();
    }

    // ═══════════════════════════════════════════════════════
    // MODE MODIFY
    // ═══════════════════════════════════════════════════════
    if (mode === "modify") {
      const { currentHtml, instruction, uploadedImages } = body;
      if (!currentHtml) return Response.json({ ok: false, error: "Aucun site à modifier" });

      let newHtml = currentHtml;
      const instr = (instruction || "").toLowerCase();
      let changed = false;

      if (uploadedImages && uploadedImages.length > 0) {
        const gallery = `<section id="galerie"><div style="max-width:1200px;margin:0 auto;padding:80px 32px"><h2 style="font-size:48px;font-weight:900;text-align:center;margin-bottom:40px">Galerie</h2><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px">${uploadedImages.map((url: string) => `<div style="border-radius:16px;overflow:hidden"><img src="${url}" style="width:100%;height:280px;object-fit:cover;display:block" /></div>`).join("")}</div></div></section>`;
        newHtml = newHtml.includes('id="galerie"')
          ? newHtml.replace(/<section[^>]*id="galerie"[\s\S]*?<\/section>/, gallery)
          : newHtml.replace(/<footer/i, gallery + "\n<footer");
        return Response.json({ ok: true, text: "```html\n" + newHtml + "\n```", mode: "modify" });
      }

      if (/(enl[eè]ve|supprime|retire)/i.test(instr) && /galerie|gallery/i.test(instr)) {
        const before = newHtml.length;
        newHtml = newHtml.replace(/<section[^>]*id=["']galerie["'][\s\S]*?<\/section>/gi, "");
        if (newHtml.length < before) changed = true;
      }

      const colorMap: Record<string, { from: RegExp; to: string }> = {
        rouge: { from: /#(ef4444|dc2626|f43f5e|e11d48|f87171)/gi, to: "ef4444" },
        bleu: { from: /#(3b82f6|2563eb|0891b2|0284c7|0ea5e9)/gi, to: "3b82f6" },
        vert: { from: /#(22c55e|16a34a|15803d|059669|047857|84cc16)/gi, to: "22c55e" },
        jaune: { from: /#(facc15|f59e0b|eab308|ca8a04|d97706)/gi, to: "facc15" },
        violet: { from: /#(a855f7|7c3aed|8b5cf6|9333ea|7e22ce|6d28d9)/gi, to: "a855f7" },
        orange: { from: /#(f97316|ea580c|fb923c)/gi, to: "f97316" },
        rose: { from: /#(ec4899|db2777|f472b6)/gi, to: "ec4899" },
        cyan: { from: /#(06b6d4|0891b2|0e7490|22d3ee)/gi, to: "06b6d4" },
      };
      for (const [name, cfg] of Object.entries(colorMap)) {
        if (instr.includes(name)) {
          newHtml = newHtml.replace(cfg.from, cfg.to);
          changed = true;
          break;
        }
      }

      if (instr.includes("nom") || instr.includes("titre") || instr.includes("renomme")) {
        const match = instr.match(/(?:nom|titre|renomme|s'appelle)[^a-z0-9]*([a-z0-9][a-z0-9\s'-]{1,40})/i);
        if (match) {
          const newName = match[1].trim().split(/\s+(?:et|en|avec|couleur|la|le|les|du|de)\s+/i)[0].trim();
          if (newName.length >= 2) {
            const finalName = newName.charAt(0).toUpperCase() + newName.slice(1);
            const titleMatch = currentHtml.match(/<title>([^<]+)<\/title>/i);
            const oldName = titleMatch ? titleMatch[1].trim() : "";
            if (oldName && oldName.length >= 2 && oldName.length < 40 && oldName !== finalName) {
              const re = new RegExp(oldName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
              newHtml = newHtml.replace(re, finalName);
              changed = true;
            }
          }
        }
      }

      if (changed) {
        return Response.json({ ok: true, text: "```html\n" + newHtml + "\n```", mode: "modify" });
      }

      const result = await generateText({
        model: getEditorModel(selectedProvider),
        system: `Tu MODIFIES du HTML. Retourne UNIQUEMENT le HTML complet entre \`\`\`html et \`\`\`.`,
        prompt: `HTML ORIGINAL :\n\`\`\`html\n${currentHtml.slice(0, 80000)}\n\`\`\`\n\nINSTRUCTION : ${instruction}`,
      });
      const returned = extractHtml(result.text);
      if (returned.length < currentHtml.length * 0.5) {
        return Response.json({ ok: false, error: "Modification échouée." });
      }
      return Response.json({ ok: true, text: "```html\n" + returned + "\n```", mode: "modify" });
    }

    // ═══════════════════════════════════════════════════════
    // MODE CODE
    // ═══════════════════════════════════════════════════════
    if (mode === "code") {
      const { findGameCategory } = await import("@/lib/gameCategories");
      const gameCat = findGameCategory(dernierMessage);

      if (gameCat && dernierMessage.toLowerCase().match(/jeu|jeux|game/)) {
        const { getGameTemplate } = await import("@/lib/gameTemplates");
        const template = getGameTemplate(gameCat.id);
        if (template) {
          return Response.json({
            ok: true,
            text: "```html\n" + template + "\n```",
            mode: "code",
            siteType: "game",
            instant: true,
          });
        }
      }

      const type = detectSiteType(dernierMessage);
      let name = customization?.name || customization?.storeName || extractName(dernierMessage);
      if (name.length > 30) name = name.slice(0, 30).trim();

      const color = customization?.color
        ? getColors(typeof customization.color === "string" ? customization.color : customization.color?.name || "jaune")
        : getSiteColor(name, type);

      const config = buildSiteConfig(dernierMessage, name, `Découvrez ${name}`, color, customization?.mood?.name || customization?.mood || "moderne");

      let photos: string[] = [];
      try {
        const { searchPhotos, getQueriesForType } = await import("@/lib/pexels");
        photos = await searchPhotos(getQueriesForType(type).photos, 6);
      } catch {}
      if (photos.length === 0) photos = generateImages(type, 6);

      let videos: string[] = [];
      try {
        const { searchVideos, getQueriesForType } = await import("@/lib/pexels");
        videos = await searchVideos(getQueriesForType(type).video, 3);
      } catch {}

      let projectId: string | null = null;
      let slug: string | null = null;
      let caisseCode: string | null = null;

      try {
        const { supabaseAdmin } = await import("@/lib/supabaseAdmin");
        const { generateSlug } = await import("@/lib/slug");
        const cryptoMod = await import("crypto");
        slug = generateSlug(name);
        const { data: project } = await supabaseAdmin
          .from("projects")
          .insert({ name, prompt: dernierMessage, html: "", slug, published: false })
          .select()
          .single();
        projectId = project?.id || null;

        if (type === "banque" && projectId) {
          const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
          let raw = "";
          for (let i = 0; i < 8; i++) raw += chars[Math.floor(Math.random() * chars.length)];
          caisseCode = raw.slice(0, 4) + "-" + raw.slice(4);
          const secret = process.env.CAISSE_SECRET || "barry-secret-2026";
          const hash = cryptoMod.createHmac("sha256", secret).update(caisseCode).digest("hex");
          await supabaseAdmin.from("project_owners").insert({
            project_id: projectId,
            owner_email: "",
            password_hash: hash,
            stripe_link: null,
            paypal_link: null,
          });
        }
      } catch {}

      const html = buildMultiPageSite(config, {
        heroVideoUrl: videos[0],
        extraVideos: videos.slice(1),
        galleryPhotos: photos,
        projectId: projectId || undefined,
      });

      try {
        if (projectId) {
          const { supabaseAdmin } = await import("@/lib/supabaseAdmin");
          await supabaseAdmin.from("projects").update({ html }).eq("id", projectId);
        }
      } catch {}

      return Response.json({
        ok: true,
        text: "```html\n" + html + "\n```",
        mode: "code",
        projectId,
        slug,
        siteType: type,
        caisseCode,
        instant: true,
      });
    }

    // ═══════════════════════════════════════════════════════
    // MODE DROPSHIPPING
    // ═══════════════════════════════════════════════════════
    if (mode === "dropshipping") {
      const storeName = customization?.storeName || extractName(dernierMessage);

      const normalizedPrompt = dernierMessage.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s_-]/g, " ").replace(/\s+/g, " ").trim();

      const stopWords = ["cree", "creer", "genere", "fais", "faire", "moi", "une", "un", "des", "de", "du", "d", "la", "le", "les", "boutique", "shop", "store", "magasin", "en ligne", "pour", "avec", "sur", "dropshipping", "vendre", "veux"];
      let keyword = normalizedPrompt;
      for (const w of stopWords) {
        keyword = keyword.replace(new RegExp(`\\b${w}\\b`, "gi"), " ");
      }
      keyword = keyword.replace(/\s+/g, " ").trim();
      if (!keyword) keyword = "produits";

      const BLOCKED = ["sex", "sexe", "adulte", "lingerie", "erotique", "porno", "porn", "jupe", "robe", "tanga", "string", "culotte", "soutien", "brassiere"];
      if (BLOCKED.some((b) => keyword.includes(b))) keyword = "accessoires";

      const CATEGORY_MAP: Record<string, string[]> = {
        montre: ["watch"], montres: ["watch"],
        bijou: ["jewelry"], bijoux: ["jewelry"],
        bracelet: ["bracelet"], collier: ["necklace"], bague: ["ring"],
        sac: ["bag"], sacs: ["bag"], portefeuille: ["wallet"], ceinture: ["belt"],
        lunettes: ["sunglasses"], casquette: ["cap"], chapeau: ["hat"], bonnet: ["beanie"],
        gant: ["gloves"], echarpe: ["scarf"], cravate: ["tie"],
        tshirt: ["t-shirt"], chemise: ["shirt"], pull: ["sweater"], sweat: ["hoodie"], veste: ["jacket"],
        manteau: ["coat"], jean: ["jeans"], pantalon: ["pants"], short: ["shorts"], chaussette: ["socks"],
        sneaker: ["sneakers"], sneakers: ["sneakers"], basket: ["sneakers"],
        chaussure: ["men shoes"], chaussures: ["men shoes"], botte: ["boots"], sandale: ["sandals"],
        smartphone: ["smartphone"], telephone: ["smartphone"], tablette: ["tablet"],
        ordinateur: ["laptop"], pc: ["laptop"], clavier: ["keyboard"], souris: ["computer mouse"],
        casque: ["headphones"], ecouteur: ["earbuds"], enceinte: ["bluetooth speaker"],
        micro: ["microphone"], drone: ["drone"], camera: ["camera"], imprimante: ["printer"],
        ecran: ["monitor"], chargeur: ["charger"], cable: ["usb cable"], batterie: ["power bank"], coque: ["phone case"],
        meuble: ["furniture"], canape: ["sofa"], chaise: ["chair"], table: ["table"], lit: ["bed"],
        armoire: ["wardrobe"], lampe: ["lamp"], tapis: ["rug"], deco: ["home decor"],
        rideau: ["curtain"], coussin: ["cushion"], couverture: ["blanket"],
        cuisine: ["kitchenware"], vaisselle: ["tableware"],
        chocolat: ["chocolate"], cafe: ["coffee"], the: ["tea"],
        outil: ["tools"], perceuse: ["drill"], jardin: ["garden tools"], plante: ["plants"],
        sport: ["sports equipment"], fitness: ["fitness equipment"], velo: ["bicycle"],
        auto: ["car accessories"], moto: ["motorcycle accessories"],
        bebe: ["baby products"], jouet: ["toys"],
        cosmetique: ["cosmetics"], maquillage: ["makeup"], parfum: ["perfume"],
        visage: ["skincare"], cheveux: ["haircare"], ongles: ["nail polish"], barbe: ["beard trimmer"],
        animal: ["pet supplies"], chien: ["dog supplies"], chat: ["cat supplies"],
        musique: ["musical instruments"], guitare: ["guitar"],
        voyage: ["travel accessories"], livre: ["books"], papeterie: ["stationery"],
        camping: ["camping gear"], peche: ["fishing gear"],
        gadget: ["gadgets"], accessoire: ["accessories"], luxe: ["luxury products"],
      };

      const searchTerms: string[] = [];
      const kwNorm = keyword.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      for (const [alias, terms] of Object.entries(CATEGORY_MAP)) {
        const aNorm = alias.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        if (kwNorm === aNorm || kwNorm.includes(aNorm)) searchTerms.push(...terms);
      }
      if (searchTerms.length === 0) searchTerms.push(keyword, keyword + "s");

      const uniqueTerms = [...new Set(searchTerms)].slice(0, 5);
      const primarySearch = uniqueTerms[0] || keyword;

      console.log("🛒 Recherche:", keyword, "→", uniqueTerms);

      const { computeSignature } = await import("@/lib/animator");
      const uniqueSalt = Date.now() + "-" + Math.random().toString(36).slice(2, 10);
      const signature = computeSignature(dernierMessage + "|" + keyword + "|" + uniqueSalt);

      const colorKey = customization?.color;
      const color = colorKey
        ? getColors(typeof colorKey === "string" ? colorKey : colorKey?.name || "jaune")
        : { primary: signature.palette.accent, secondary: signature.palette.accent2 };

      let products: any[] = [];

      try {
        const { getCJAccessToken } = await import("@/lib/cj");
        const token = await getCJAccessToken();
        const headers = { "CJ-Access-Token": token, "Accept": "application/json" };

        for (const term of uniqueTerms) {
          if (products.length >= 20) break;
          try {
            const params = new URLSearchParams({ page: "1", size: "20", keyWord: term, sort: "desc", orderBy: "0" });
            const url = `https://developers.cjdropshipping.com/api2.0/v1/product/listV2?${params.toString()}`;
            const res = await fetch(url, { headers, cache: "no-store" });
            const data = await res.json();
            if (data?.code !== 200) continue;

            const groups = Array.isArray(data?.data?.content) ? data.data.content : [];
            const candidates = groups.flatMap((g: any) => Array.isArray(g?.productList) ? g.productList : []);

            for (const p of candidates) {
              if (products.length >= 20) break;
              const pid = String(p?.id || "").trim();
              const productName = String(p?.nameEn || "").trim();
              const productImage = String(p?.bigImage || "").trim();
              if (!pid || !productName || !/^https?:\/\//i.test(productImage)) continue;
              if (products.some((e) => e.id === pid)) continue;

              const salePrice = Number(p?.nowPrice);
              const regularPrice = Number(p?.sellPrice);
              const basePrice = salePrice > 0 ? salePrice : regularPrice > 0 ? regularPrice : 0;
              if (!basePrice) continue;

              products.push({
                id: pid, vid: "",
                name: productName,
                description: String(p?.description || productName).slice(0, 150),
                price: Math.max(Math.round(basePrice * 1.7 * 100) / 100, 9.99),
                oldPrice: Math.round(basePrice * 2.1 * 100) / 100,
                image: `https://image.pollinations.ai/prompt/${encodeURIComponent(productName + " product photo professional studio")}?width=400&height=400&nologo=true&seed=${products.length}`,
                rating: 4.5 + Math.random() * 0.4,
                reviews: 50 + Math.floor(Math.random() * 500),
                badge: ["BEST-SELLER", "NOUVEAU", "PROMO", "TOP"][products.length % 4],
                sku: String(p?.sku || p?.spu || "").trim(),
                category: keyword,
                salesCount: Math.floor(Math.random() * 500),
                isNew: Math.random() < 0.3,
                isRare: Math.random() < 0.2,
              });
            }
          } catch {}
        }
      } catch {}

      if (products.length === 0) {
        try {
          const { getRandomProducts } = await import("@/lib/productsDatabase");
          const local = getRandomProducts(20, keyword);
          products = local.map((p: any, i: number) => ({
            id: p.id || `local-${i}`, vid: "",
            name: p.name || `${keyword} #${i + 1}`,
            description: p.description || `Produit premium`,
            price: Number(p.price) || 49.99,
            oldPrice: Number(p.oldPrice) || 69.99,
            image: p.image || `https://picsum.photos/seed/${encodeURIComponent(keyword + i)}/400/400`,
            rating: 4.5, reviews: 100 + i * 10,
            badge: ["NOUVEAU", "PROMO", "TOP", "BEST-SELLER"][i % 4],
            sku: `LOCAL-${i + 1}`, category: keyword,
            salesCount: Math.floor(Math.random() * 500),
            isNew: i < 5, isRare: i % 4 === 0,
          }));
        } catch {}
      }

      if (products.length === 0) {
        const names = [`${keyword} Premium`, `${keyword} Deluxe`, `${keyword} Classique`, `${keyword} Moderne`, `${keyword} Élégant`, `${keyword} Luxe`, `${keyword} Sport`, `${keyword} Collection`];
        products = names.map((name, i) => ({
          id: `gen-${i}`, vid: "", name,
          description: `Produit ${keyword} de qualité supérieure`,
          price: 29.99 + i * 15, oldPrice: 49.99 + i * 20,
          image: `https://picsum.photos/seed/${encodeURIComponent(keyword + i)}/400/400`,
          rating: 4.5, reviews: 100 + i * 50,
          badge: ["NOUVEAU", "PROMO", "TOP", "BEST-SELLER"][i % 4],
          sku: `GEN-${i + 1}`, category: keyword,
          salesCount: Math.floor(Math.random() * 500),
          isNew: i < 3, isRare: i % 5 === 0,
        }));
      }

      let videos: string[] = [];
      try {
        const { searchVideos } = await import("@/lib/pexels");
        videos = await searchVideos(primarySearch, 5);
      } catch {}

      const THEMES = ["ocean", "espace", "cyberpunk", "matrix", "vortex", "atlantide", "temporel", "retro_wave", "glacier", "nuages", "enfer"];
      const chosenStyle = THEMES[Math.floor(Math.random() * THEMES.length)];

      const { buildDropshippingSite } = await import("@/lib/dropshippingTemplate");
      const html = buildDropshippingSite(
        storeName,
        "Découvrez notre collection exclusive",
        keyword || primarySearch,
        color,
        customization?.mood?.name || "moderne",
        chosenStyle,
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
        const { data } = await supabaseAdmin
          .from("projects")
          .insert({ name: storeName, prompt: dernierMessage, html, slug, published: false })
          .select()
          .single();
        projectId = data?.id;
      } catch {}

      return Response.json({
        ok: true,
        text: "```html\n" + html + "\n```",
        mode: "dropshipping",
        projectId,
        slug,
        productCount: products.length,
        theme: chosenStyle,
        instant: true,
      });
    }

    return Response.json({ ok: false, error: "Mode inconnu" }, { status: 400 });
  } catch (err: any) {
    console.error("❌", err);
    return Response.json({ ok: false, error: err?.message || String(err) }, { status: 500 });
  }
}