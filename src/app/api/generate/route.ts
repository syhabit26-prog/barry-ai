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
import {
  detectSiteType,
  buildSiteConfig,
  generateImages,
} from "@/lib/siteTemplates";
import { buildMultiPageSite } from "@/lib/multiPageGenerator";

export const maxDuration = 300;

const BARRY_IDENTITY = `
Tu es BARRY AI, un assistant personnel premium créé par Mouhamed Barry.
- Détecte la langue et réponds DANS LA MÊME LANGUE.
- Utilise ## pour les titres, - pour les listes, **gras** pour les points clés.
`;

// ═══════════════════════════════════════════════════════════════
// 9 IA DISPONIBLES
// ═══════════════════════════════════════════════════════════════
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
    case "groq":
    default:
      return groq("openai/gpt-oss-120b");
  }
}

function extractName(prompt: string): string {
  const nomMatch = prompt.match(/(?:nommée?|appelée?|nom)\s+([a-zA-ZÀ-ÿ0-9][a-zA-ZÀ-ÿ0-9\s'-]{1,25})/i);
  if (nomMatch) {
    const raw = nomMatch[1]
      .replace(/\s+(et|avec|de|du|pour|qui|à|au|le|la|les|des|un|une|rouge|bleu|vert|jaune|violet|orange|rose|noir|blanc|cyan|moderne|sombre|élégant|minimaliste|vibrant|vintage|luxe|rétro)\s*.*/i, "")
      .replace(/[^\wÀ-ÿ\s'-]/g, "")
      .trim();
    if (raw.length >= 2) return raw.charAt(0).toUpperCase() + raw.slice(1);
  }

  const cleaned = prompt
    .replace(/[^\wÀ-ÿ\s]/g, " ")
    .replace(/\b(cree|créer|moi|un|une|des|de|du|d|la|le|les|site|web|page|jeu|jeux|game|app|application|boutique|portfolio|pour|avec|sur|fais|faire|génère|générer|je|veux|souhaite|nommé|nommée|appelé|appelée|qui|s'appelle|cinéma|cinema|premium|video|vidéo|3d|et|moderne|sombre|élégant|minimaliste|vibrant|vintage|luxe|rétro|rouge|bleu|vert|jaune|violet|orange|rose|noir|blanc|cyan)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

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
  const shopKeywords = ["boutique", "shop", "e-commerce", "dropshipping", "vendre", "catalogue", "panier", "store", "magasin"];
  const codeKeywords = ["cree", "creer", "genere", "site", "page", "landing", "portfolio", "jeu", "jeux", "game", "app", "application", "banque", "restaurant", "blog", "vitrine", "ecole", "hotel", "avocat", "sante", "cinema", "cinéma"];

  if (shopKeywords.some((kw) => lower.includes(kw))) return "dropshipping";
  if (codeKeywords.some((kw) => lower.includes(kw))) return "code";
  return "chat";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      prompt,
      messages,
      mode: manualMode,
      customization,
      customSystemPrompt,
      provider,
    } = body;

    const isChat = messages && Array.isArray(messages) && messages.length > 0;
    const dernierMessage = isChat ? messages[messages.length - 1].content : prompt || "";
    const mode = manualMode || detectMode(dernierMessage);

    console.log("🎯 Mode:", mode, "| IA:", provider || "groq");

    // ═══════════════════════════════════════════════════════════
    // MODE CHAT — 9 IA disponibles
    // ═══════════════════════════════════════════════════════════
    if (mode === "chat" || customSystemPrompt) {
      const systemPrompt = customSystemPrompt
        ? BARRY_IDENTITY + "\n\n" + customSystemPrompt
        : BARRY_IDENTITY;

      const result = streamText({
        model: getModel(provider || "groq"),
        system: systemPrompt,
        messages: isChat ? messages : [{ role: "user", content: dernierMessage }],
      });

      return result.toTextStreamResponse();
    }

    // ═══════════════════════════════════════════════════════════
    // MODE MODIFY
    // ═══════════════════════════════════════════════════════════
    if (mode === "modify") {
      const { currentHtml, instruction, uploadedImages } = body;

      if (!currentHtml) {
        return Response.json({ ok: false, error: "Aucun site à modifier" });
      }

      const lower = (instruction || "").toLowerCase();
      let newHtml = currentHtml;

      // Photos uploadées PC
      if (uploadedImages && uploadedImages.length > 0) {
        const galleryHTML = `
<section class="page" id="galerie">
  <div class="page-inner">
    <header class="page-header">
      <span class="page-badge">Galerie</span>
      <h2 class="page-title">Galerie</h2>
    </header>
    <div class="photo-masonry">
      ${uploadedImages.map((url: string, i: number) => `
        <div class="photo-tile"><img src="${url}" alt="Photo ${i + 1}" /></div>
      `).join("")}
    </div>
  </div>
</section>`;

        if (newHtml.includes('id="galerie"')) {
          newHtml = newHtml.replace(/<section[^>]*id="galerie"[\s\S]*?<\/section>/, galleryHTML);
        } else {
          newHtml = newHtml.replace(/<footer/, galleryHTML + "\n<footer");
          newHtml = newHtml.replace(
            /(<nav[^>]*>)([\s\S]*?)(<\/nav>)/,
            (match: string, open: string, content: string, close: string) => {
              if (content.includes("Galerie")) return match;
              return open + content + `<a href="#galerie" data-page>Galerie</a>` + close;
            }
          );
        }

        return Response.json({ ok: true, text: newHtml, mode: "modify" });
      }

      // Photos IA
      if (/photo|image|illustration|visuel/i.test(lower)) {
        let count = 6;
        const numMatch = lower.match(/(\d+)/);
        if (numMatch) count = Math.min(Math.max(parseInt(numMatch[1]), 1), 20);

        let siteType: any = "vitrine";
        if (/restaurant|menu|cuisine/i.test(newHtml)) siteType = "restaurant";
        else if (/portfolio|projet/i.test(newHtml)) siteType = "portfolio";
        else if (/startup|saas/i.test(newHtml)) siteType = "startup";
        else if (/jeu|game|arcade/i.test(newHtml)) siteType = "jeu";
        else if (/app|application/i.test(newHtml)) siteType = "app";

        let photos: string[] = [];
        try {
          const { searchPhotos, getQueriesForType } = await import("@/lib/pexels");
          const queries = getQueriesForType(siteType);
          photos = await searchPhotos(queries.photos, count);
        } catch (e) {
          console.warn("⚠️ Pexels échoué");
        }

        if (photos.length < count) {
          photos = [...photos, ...generateImages(siteType, count - photos.length)];
        }

        const galleryHTML = `
<section class="page" id="galerie">
  <div class="page-inner">
    <header class="page-header">
      <span class="page-badge">Galerie</span>
      <h2 class="page-title">Galerie</h2>
    </header>
    <div class="photo-masonry">
      ${photos.map((url, i) => `
        <div class="photo-tile"><img src="${url}" alt="Photo ${i + 1}" loading="lazy" /></div>
      `).join("")}
    </div>
  </div>
</section>`;

        if (newHtml.includes('id="galerie"')) {
          newHtml = newHtml.replace(/<section[^>]*id="galerie"[\s\S]*?<\/section>/, galleryHTML);
        } else {
          newHtml = newHtml.replace(/<footer/, galleryHTML + "\n<footer");
          newHtml = newHtml.replace(
            /(<nav[^>]*>)([\s\S]*?)(<\/nav>)/,
            (match: string, open: string, content: string, close: string) => {
              if (content.includes("Galerie")) return match;
              return open + content + `<a href="#galerie" data-page>Galerie</a>` + close;
            }
          );
        }

        return Response.json({ ok: true, text: newHtml, mode: "modify" });
      }

      // Modification IA — utilise l'IA sélectionnée
      const result = await generateText({
        model: getModel(provider || "groq"),
        system: `Tu MODIFIES du code HTML. Retourne UNIQUEMENT le HTML complet entre \`\`\`html et \`\`\`. Commence par <!DOCTYPE html>.`,
        prompt: `HTML:\n${currentHtml.slice(0, 40000)}\n\nINSTRUCTION: ${instruction}\n\nRetourne HTML complet.`,
      });

      return Response.json({ ok: true, text: result.text, mode: "modify" });
    }

    // ═══════════════════════════════════════════════════════════
    // MODE CODE — Sites / apps / jeux
    // ═══════════════════════════════════════════════════════════
    if (mode === "code") {
      const isCinema = /cinema|cinéma|premium|video 3d|vidéo 3d/i.test(dernierMessage);
      console.log(isCinema ? "🎬 MODE CINÉMA" : "⚡ MODE RAPIDE");

      const type = detectSiteType(dernierMessage);
      console.log("🎨 Type:", type);

      let name = customization?.name || extractName(dernierMessage);
      if (name.length > 30) name = name.slice(0, 30).trim();

      const colorKey = customization?.color || customization?.mood || "jaune";
      const color = getColors(typeof colorKey === "string" ? colorKey : colorKey?.name || "jaune");

      const config = buildSiteConfig(
        dernierMessage,
        name,
        `Découvrez ${name}`,
        color,
        customization?.mood?.name || "moderne"
      );

      // Pexels
      let photos: string[] = [];
      let videos: string[] = [];
      try {
        const { searchPhotos, searchVideos, getQueriesForType } = await import("@/lib/pexels");
        const queries = getQueriesForType(type);
        console.log("📸 Pexels:", queries);

        const result = await Promise.all([
          searchPhotos(queries.photos, 8),
          searchVideos(queries.video, 3),
        ]);
        photos = result[0] || [];
        videos = result[1] || [];
        console.log(`✅ Pexels: ${photos.length} photos, ${videos.length} vidéos`);
      } catch (e) {
        console.warn("⚠️ Pexels échoué:", e);
      }

      if (photos.length === 0) {
        photos = generateImages(type, 8);
      }

      // Runway + Trellis si mode cinéma
      let model3DUrl: string | undefined;
      if (isCinema && photos.length > 0) {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        try {
          await fetch(`${appUrl}/api/runway/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: "cinematic slow motion", imageUrl: photos[0], duration: 5 }),
          });
        } catch (e) { console.warn("Runway erreur"); }

        try {
          await fetch(`${appUrl}/api/trellis/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ imageUrl: photos[0] }),
          });
        } catch (e) { console.warn("Trellis erreur"); }
      }

      const html = buildMultiPageSite(config, {
        heroVideoUrl: videos[0],
        extraVideos: videos.slice(1),
        galleryPhotos: photos,
        model3DUrl,
      });

      console.log("🎉 HTML:", html.length, "chars");

      let projectId = null;
      let slug = null;
      try {
        const { supabaseAdmin } = await import("@/lib/supabaseAdmin");
        const { generateSlug } = await import("@/lib/slug");
        slug = generateSlug(name);

        const { data } = await supabaseAdmin
          .from("projects")
          .insert({ name, prompt: dernierMessage, html, slug, published: false })
          .select()
          .single();

        projectId = data?.id;
      } catch (e) { console.warn("Sauvegarde échouée"); }

      return Response.json({
        ok: true,
        text: "```html\n" + html + "\n```",
        mode: "code",
        projectId,
        slug,
        siteType: type,
        videoCount: videos.length,
        photoCount: photos.length,
        instant: true,
      });
    }

    // ═══════════════════════════════════════════════════════════
    // MODE DROPSHIPPING — DIRECT (20 produits + PayPal + Stripe)
    // ═══════════════════════════════════════════════════════════
    if (mode === "dropshipping") {
      console.log("🛒 DROPSHIPPING direct...");

      const storeName = customization?.storeName || extractName(dernierMessage);
      const keyword = (() => {
        const lower = dernierMessage.toLowerCase().replace(/[^\w\s]/g, " ");
        const cleaned = lower
          .replace(/cree|creer|moi|une|un|des|de|du|d|la|le|les|boutique|shop|store|magasin|en ligne|pour|avec|sur|dropshipping|vendre|veux|bleu|rouge|vert|jaune|violet|orange|rose|noir|blanc|cyan|moderne|sombre|élégant|minimaliste|vibrant|vintage/gi, " ")
          .replace(/\s+/g, " ")
          .trim();
        return cleaned.split(" ").slice(0, 3).join(" ") || "produits varies";
      })();

      const colorKey = customization?.color || customization?.mood || "jaune";
      const color = getColors(typeof colorKey === "string" ? colorKey : colorKey?.name || "jaune");

      // 20 produits CJ
      let products: any[] = [];
      try {
        const { getCJAccessToken } = await import("@/lib/cj");
        const token = await getCJAccessToken();

        const enKeyword = keyword
          .replace(/sneakers?/i, "sneakers")
          .replace(/montres?/i, "watch")
          .replace(/bijoux?/i, "jewelry")
          .replace(/t-shirts?/i, "t-shirt");

        const cjUrl = `https://developers.cjdropshipping.com/api2.0/v1/product/list?pageNum=1&pageSize=20&productNameEn=${encodeURIComponent(enKeyword)}`;
        const cjRes = await fetch(cjUrl, { headers: { "CJ-Access-Token": token } });
        const cjData = await cjRes.json();

        if (cjData.code === 200 && cjData.data?.list?.length > 0) {
          products = cjData.data.list.slice(0, 20).map((p: any, i: number) => {
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
              category: keyword,
            };
          });
          console.log("✅ CJ:", products.length, "produits");
        }
      } catch (e) {
        console.warn("⚠️ CJ échoué, fallback local");
      }

      if (products.length === 0) {
        const { getRandomProducts } = await import("@/lib/productsDatabase");
        products = getRandomProducts(20, keyword);
        console.log("✅ Fallback local:", products.length, "produits");
      }

      const { buildDropshippingSite } = await import("@/lib/dropshippingTemplate");
      const html = buildDropshippingSite(
        storeName,
        "Découvrez notre collection exclusive",
        keyword,
        color,
        customization?.mood?.name || "moderne",
        "modern",
        products
      );

      console.log("🎉 Boutique:", html.length, "chars,", products.length, "produits");

      let projectId = null;
      let slug = null;
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
      } catch (e) { console.warn("Sauvegarde échouée"); }

      return Response.json({
        ok: true,
        text: "```html\n" + html + "\n```",
        mode: "dropshipping",
        projectId,
        slug,
        productCount: products.length,
        instant: true,
      });
    }

    return Response.json({ ok: false, error: "Mode inconnu" }, { status: 400 });

  } catch (err: any) {
    console.error("❌ ERREUR:", err);
    return Response.json({ ok: false, error: err?.message || String(err) }, { status: 500 });
  }
}