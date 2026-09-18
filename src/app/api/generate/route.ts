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

🧠 MÉMOIRE :
- Tu te souviens de TOUT ce qui a été dit dans la conversation.
`;

const TRANSLATIONS: Record<string, string> = {
  sneakers: "running shoes", chaussures: "shoes", vetements: "clothing",
  bijoux: "jewelry", montres: "wristwatch", tech: "electronics",
  cosmetiques: "cosmetics", parfums: "perfume", sacs: "handbag",
  lunettes: "sunglasses", jouets: "toys", maison: "home decor",
  cuisine: "kitchen", sport: "sport", beaute: "beauty",
  massage: "massager", "soins-visage": "face care",
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

function getModel(provider: string) {
  switch (provider) {
    case "openai": return openai("gpt-4o-mini");
    case "claude": return anthropic("claude-3-5-haiku-20241022");
    case "deepseek": return deepseek("deepseek-chat");
    case "gemini": return google("gemini-2.5-flash");
    case "mistral": return mistral("mistral-large-latest");
    case "cohere": return cohere("command-r-plus");
    case "grok": return xai("grok-beta");
    case "together": return togetherai("meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo");
    default: return groq("openai/gpt-oss-120b");
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, messages, mode: manualMode, customization, provider, customSystemPrompt } = body;

    const isChat = messages && Array.isArray(messages) && messages.length > 0;
    const dernierMessage = isChat ? messages[messages.length - 1].content : prompt || "";
    const mode = manualMode || detectMode(dernierMessage);

    console.log("🎯 Mode:", mode);

    // ═══════════════════════════════════════════════════════════
    // MODE CHAT (streaming direct)
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
    // MODE DROPSHIPPING (vérifie le cache + job)
    // ═══════════════════════════════════════════════════════════
    if (mode === "dropshipping") {
      const { createJob } = await import("@/lib/jobs");
      const { getCache, getGenerationCacheKey, recordHit, recordMiss } = await import("@/lib/cache");

      // Extrait le thème
      const lower = dernierMessage.toLowerCase().replace(/[^\w\s]/g, " ");
      const cleaned = lower
        .replace(/cree|creer|moi|une|un|des|de|du|d|la|le|les|boutique|shop|store|magasin|en ligne|pour|avec|sur|dropshipping|vendre|veux/gi, " ")
        .replace(/\s+/g, " ")
        .trim();
      const keyword = cleaned.split(" ").slice(0, 3).join(" ") || "produits varies";

      const custom = {
        storeName: customization?.storeName || "Ma Boutique",
        keyword,
        color: customization?.color,
        mood: customization?.mood,
      };

      // ⭐ VÉRIFIE LE CACHE
      const cacheKey = getGenerationCacheKey(mode, dernierMessage, custom);
      const cached = await getCache(cacheKey);

      if (cached && cached.html) {
        console.log("⚡ CACHE HIT:", cacheKey);
        await recordHit();

        // Crée un job qui retourne immédiatement le cache
        const job = await createJob({
          status: "done",
          progress: 100,
          result: {
            html: cached.html,
            projectId: cached.projectId,
            slug: cached.slug,
            fromCache: true,
          },
        });

        return Response.json({
          ok: true,
          jobId: job.id,
          mode: "dropshipping",
          fromCache: true,
        });
      }

      console.log("❌ CACHE MISS:", cacheKey);
      await recordMiss();

      // Crée un job normal
      const job = await createJob({ status: "pending", progress: 0 });
      console.log("✅ Job créé:", job.id);

      const payload = {
        jobId: job.id,
        mode: "dropshipping",
        prompt: dernierMessage,
        customization: custom,
      };

      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

      fetch(`${appUrl}/api/process-site`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch((e) => console.warn("Fire&forget error:", e.message));

      return Response.json({
        ok: true,
        jobId: job.id,
        mode: "dropshipping",
        fromCache: false,
      });
    }

    // ═══════════════════════════════════════════════════════════
    // MODE CODE (vérifie le cache + job)
    // ═══════════════════════════════════════════════════════════
    if (mode === "code") {
      const { createJob } = await import("@/lib/jobs");
      const { getCache, getGenerationCacheKey, recordHit, recordMiss } = await import("@/lib/cache");

      // ⭐ VÉRIFIE LE CACHE
      const cacheKey = getGenerationCacheKey(mode, dernierMessage, null);
      const cached = await getCache(cacheKey);

      if (cached && cached.html) {
        console.log("⚡ CACHE HIT:", cacheKey);
        await recordHit();

        const job = await createJob({
          status: "done",
          progress: 100,
          result: {
            html: cached.html,
            projectId: cached.projectId,
            slug: cached.slug,
            fromCache: true,
          },
        });

        return Response.json({
          ok: true,
          jobId: job.id,
          mode: "code",
          fromCache: true,
        });
      }

      console.log("❌ CACHE MISS:", cacheKey);
      await recordMiss();

      const job = await createJob({ status: "pending", progress: 0 });
      console.log("✅ Job créé:", job.id);

      const payload = {
        jobId: job.id,
        mode: "code",
        prompt: dernierMessage,
        customization: null,
      };

      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

      fetch(`${appUrl}/api/process-site`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch((e) => console.warn("Fire&forget error:", e.message));

      return Response.json({
        ok: true,
        jobId: job.id,
        mode: "code",
        fromCache: false,
      });
    }

    // ═══════════════════════════════════════════════════════════
    // FALLBACK
    // ═══════════════════════════════════════════════════════════
    const result = streamText({
      model: getModel(provider || "groq"),
      system: BARRY_IDENTITY,
      messages: isChat ? messages : [{ role: "user", content: dernierMessage }],
    });
    return result.toTextStreamResponse();

  } catch (err: any) {
    console.error("❌ ERREUR API:", err);
    return Response.json({ ok: false, error: err?.message || String(err) }, { status: 500 });
  }
}