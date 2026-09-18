import { NextResponse } from "next/server";
import { updateJob } from "@/lib/jobs";
import { setCache, getGenerationCacheKey } from "@/lib/cache";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { groq } from "@ai-sdk/groq";
import { google } from "@ai-sdk/google";
import { mistral } from "@ai-sdk/mistral";
import { generateText } from "ai";

export const maxDuration = 300;

const TRANSLATIONS: Record<string, string[]> = {
  sneakers: ["running shoes", "sneakers"],
  chaussures: ["shoes", "footwear"],
  bijoux: ["jewelry", "necklace"],
  montres: ["wristwatch", "watch"],
  tech: ["electronics", "gadget"],
  cosmetiques: ["cosmetics", "makeup"],
  beaute: ["beauty", "skincare"],
  sacs: ["handbag", "purse"],
  vetements: ["clothing", "apparel"],
  lunettes: ["sunglasses", "eyewear"],
  parfums: ["perfume", "fragrance"],
};

function getModel(provider: string) {
  switch (provider) {
    case "openai": return openai("gpt-4o-mini");
    case "claude": return anthropic("claude-3-5-haiku-20241022");
    case "gemini": return google("gemini-2.5-flash");
    case "mistral": return mistral("mistral-large-latest");
    default: return groq("openai/gpt-oss-120b");
  }
}

export async function POST(req: Request) {
  let jobId = "";
  let mode = "";
  let prompt = "";
  let customization: any = null;

  try {
    const body = await req.json();
    jobId = body.jobId;
    mode = body.mode;
    prompt = body.prompt;
    customization = body.customization;

    console.log("🚀 Job démarré:", jobId, "| Mode:", mode);

    await updateJob(jobId, { status: "processing", progress: 10 });

    if (mode === "dropshipping") {
      const keyword = customization?.keyword || "sneakers";
      const keywords = TRANSLATIONS[keyword] || [keyword];

      let products: any[] = [];

      try {
        const { getCJAccessToken } = await import("@/lib/cj");
        const token = await getCJAccessToken();

        for (const kw of keywords) {
          const url = `https://developers.cjdropshipping.com/api2.0/v1/product/list?pageNum=1&pageSize=20&productNameEn=${encodeURIComponent(kw)}`;
          const res = await fetch(url, { headers: { "CJ-Access-Token": token } });
          const data = await res.json();
          if (data.code === 200 && data.data?.list?.length > 0) {
            products = data.data.list.slice(0, 20).map((p: any, i: number) => {
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
            break;
          }
        }
      } catch (e) {
        console.warn("CJ échoué");
      }

      await updateJob(jobId, { progress: 40 });

      if (products.length === 0) {
        const { getRandomProducts } = await import("@/lib/productsDatabase");
        products = getRandomProducts(20, keyword);
      }

      const { buildDropshippingSite } = await import("@/lib/dropshippingTemplate");
      const html = buildDropshippingSite(
        customization?.storeName || "Ma Boutique",
        "Découvrez notre collection exclusive",
        keyword,
        customization?.color,
        customization?.mood,
        undefined,
        products
      );

      await updateJob(jobId, { progress: 90 });

      let projectData: any = null;
      try {
        const { supabaseAdmin } = await import("@/lib/supabaseAdmin");
        const { generateSlug } = await import("@/lib/slug");
        const slug = generateSlug(customization?.storeName || "mon-site");

        const { data } = await supabaseAdmin
          .from("projects")
          .insert({
            name: customization?.storeName || "Mon site",
            prompt,
            html,
            slug,
            published: false,
          })
          .select()
          .single();

        projectData = data;
      } catch (e) {
        console.warn("Sauvegarde échouée");
      }

      const cacheKey = getGenerationCacheKey(mode, prompt, customization);
      await setCache(cacheKey, {
        html,
        projectId: projectData?.id,
        slug: projectData?.slug,
        cachedAt: Date.now(),
      });

      await updateJob(jobId, {
        status: "done",
        progress: 100,
        result: {
          html,
          projectId: projectData?.id,
          slug: projectData?.slug,
          fromCache: false,
        },
      });

      return NextResponse.json({ ok: true });
    }

    await updateJob(jobId, { progress: 20 });

    const systemPrompt = `Tu es un développeur web expert. Génère un site COMPLET et PROFESSIONNEL.

STRUCTURE :
1. HEADER sticky (logo + nav)
2. HERO (titre + sous-titre + CTA)
3. SECTIONS principales
4. CONTACT
5. FOOTER

RÈGLES :
- Un SEUL fichier HTML complet
- MINIMUM 400 lignes
- Tailwind CDN + Google Fonts
- Responsive mobile
- Animations CSS

Réponds UNIQUEMENT avec le code entre \`\`\`html et \`\`\`
Commence par <!DOCTYPE html>`;

    const result = await generateText({
      model: getModel("groq"),
      system: systemPrompt,
      prompt,
    });

    await updateJob(jobId, { progress: 70 });

    let html = result.text.trim();
    let m = html.match(/```html\s*\n([\s\S]*?)```/i);
    if (m) html = m[1].trim();
    else {
      m = html.match(/```\s*\n([\s\S]*?)```/);
      if (m) html = m[1].trim();
    }
    const idx = html.indexOf("<!DOCTYPE");
    if (idx !== -1) html = html.slice(idx).trim();

    await updateJob(jobId, { progress: 90 });

    let projectData: any = null;
    try {
      const { supabaseAdmin } = await import("@/lib/supabaseAdmin");
      const { generateSlug } = await import("@/lib/slug");
      const slug = generateSlug("mon-site");

      const { data } = await supabaseAdmin
        .from("projects")
        .insert({
          name: "Mon site",
          prompt,
          html,
          slug,
          published: false,
        })
        .select()
        .single();

      projectData = data;
    } catch (e) {
      console.warn("Sauvegarde échouée");
    }

    const cacheKey = getGenerationCacheKey(mode, prompt, customization);
    await setCache(cacheKey, {
      html,
      projectId: projectData?.id,
      slug: projectData?.slug,
      cachedAt: Date.now(),
    });

    await updateJob(jobId, {
      status: "done",
      progress: 100,
      result: {
        html,
        projectId: projectData?.id,
        slug: projectData?.slug,
        fromCache: false,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("❌ Job échoué:", err);
    if (jobId) {
      await updateJob(jobId, {
        status: "error",
        progress: 100,
        error: err.message,
      });
    }
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}