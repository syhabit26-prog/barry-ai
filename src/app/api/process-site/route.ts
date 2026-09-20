import { NextResponse } from "next/server";
import { updateJob } from "@/lib/jobs";
import { setCache, getGenerationCacheKey } from "@/lib/cache";
import { buildSiteConfig, detectSiteType } from "@/lib/siteTemplates";
import { buildMultiPageSite } from "@/lib/multiPageGenerator";

export const maxDuration = 60;

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

// ═══ Extrait le nom depuis le prompt (rapide, local) ═══
function extractName(prompt: string): string {
  const cleaned = prompt
    .replace(/cree|creer|moi|un|une|des|de|du|d|la|le|les|site|web|page|pour|avec|sur|fais|faire|genere|générer|je|veux|souhaite/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  const words = cleaned.split(" ").filter((w) => w.length > 2);
  if (words.length === 0) return "Mon Site";

  const name = words.slice(0, 3).join(" ");
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

// ═══ Palette selon le mood ═══
function getColors(mood: string): { primary: string; secondary: string } {
  const map: Record<string, { primary: string; secondary: string }> = {
    rouge: { primary: "#ef4444", secondary: "#dc2626" },
    bleu: { primary: "#3b82f6", secondary: "#2563eb" },
    vert: { primary: "#22c55e", secondary: "#16a34a" },
    jaune: { primary: "#facc15", secondary: "#f59e0b" },
    violet: { primary: "#a855f7", secondary: "#7c3aed" },
    orange: { primary: "#f97316", secondary: "#ea580c" },
    rose: { primary: "#ec4899", secondary: "#db2777" },
    noir: { primary: "#ffffff", secondary: "#a1a1aa" },
  };
  return map[mood.toLowerCase()] || map.jaune;
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

    await updateJob(jobId, { status: "processing", progress: 20 });

    // ═══════════════════════════════════════════════════════════
    // MODE DROPSHIPPING — INCHANGÉ
    // ═══════════════════════════════════════════════════════════
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

      await updateJob(jobId, { progress: 60 });

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

    // ═══════════════════════════════════════════════════════════
    // MODE CODE — MULTI-PAGES ANIMÉ (ULTRA RAPIDE, 0 appel IA)
    // ═══════════════════════════════════════════════════════════
    await updateJob(jobId, { progress: 40 });

    // 1. Détection locale du type (instant)
    const type = detectSiteType(prompt);
    console.log("🎨 Type détecté:", type);

    // 2. Extraction du nom (local, instant)
    let name = customization?.name;
    if (!name) name = extractName(prompt);
    if (name.length > 30) name = name.slice(0, 30).trim();

    // 3. Couleurs
    const mood = customization?.color || customization?.mood || "jaune";
    const color = getColors(
      typeof mood === "string" ? mood : mood?.name || "jaune"
    );

    // 4. Tagline simple
    const tagline = `Découvrez ${name}`;

    // 5. Build config
    const config = buildSiteConfig(
      prompt,
      name,
      tagline,
      color,
      customization?.mood?.name || "moderne"
    );

    await updateJob(jobId, { progress: 70 });

    // 6. Génère le HTML multi-pages (INSTANTANÉ)
    const html = buildMultiPageSite(config);
    console.log("✅ HTML généré:", html.length, "chars");

    await updateJob(jobId, { progress: 90 });

    // 7. Sauvegarde
    let projectData: any = null;
    try {
      const { supabaseAdmin } = await import("@/lib/supabaseAdmin");
      const { generateSlug } = await import("@/lib/slug");
      const slug = generateSlug(name);

      const { data } = await supabaseAdmin
        .from("projects")
        .insert({
          name,
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

    const cacheKey = getGenerationCacheKey(mode, prompt, null);
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
        siteType: type,
        pagesCount: config.pages.length,
      },
    });

    console.log("🎉 Job terminé:", jobId);
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