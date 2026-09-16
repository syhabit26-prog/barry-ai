import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { deepseek } from "@ai-sdk/deepseek";
import { groq } from "@ai-sdk/groq";
import { google } from "@ai-sdk/google";
import { mistral } from "@ai-sdk/mistral";
import { cohere } from "@ai-sdk/cohere";
import { xai } from "@ai-sdk/xai";
import { togetherai } from "@ai-sdk/togetherai";
import { generateText } from "ai";

export const maxDuration = 30;

// ═══════════════════════════════════════════════════════════════
// DETECTION DU MODE (dropshipping / code / chat)
// ═══════════════════════════════════════════════════════════════
function detectMode(prompt: string): "dropshipping" | "code" | "chat" {
  const lower = prompt.toLowerCase();

  const shopKeywords = [
    "boutique", "shop", "e-commerce", "ecommerce", "dropshipping",
    "vendre", "vente", "catalogue", "panier", "store", "magasin",
  ];

  const codeKeywords = [
    "cree", "creer", "genere", "fais",
    "site", "page", "landing", "portfolio",
    "jeu", "game", "app", "application",
    "calculatrice", "todo", "snake", "memory",
  ];

  if (shopKeywords.some((kw) => lower.includes(kw))) return "dropshipping";
  if (codeKeywords.some((kw) => lower.includes(kw))) return "code";
  return "chat";
}

// ═══════════════════════════════════════════════════════════════
// EXTRACTION DU MOT-CLE PRODUIT
// ═══════════════════════════════════════════════════════════════
function extractKeyword(prompt: string): string {
  const lower = prompt.toLowerCase().trim();

  // Mots generiques a enlever
  const generics = [
    "cree", "creer", "créé", "genere", "generer", "génère", "fais", "faire",
    "moi", "une", "un", "des", "de", "du", "d'", "la", "le", "les",
    "boutique", "shop", "store", "magasin", "e-commerce", "ecommerce",
    "en ligne", "enligne", "pour", "avec", "sur",
  ];

  // Enleve les mots generiques
  let cleaned = lower;
  for (const word of generics) {
    cleaned = cleaned.replace(new RegExp(`\\b${word}\\b`, "gi"), " ");
  }

  // Enleve les caracteres speciaux
  cleaned = cleaned
    .replace(/[^\w\s\u00C0-\u017F'-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Si le mot-cle est vide ou trop court, fallback
  if (!cleaned || cleaned.length < 3) {
    return "produits varies";
  }

  // Limite a 5 mots max
  const words = cleaned.split(/\s+/).slice(0, 5);
  return words.join(" ");
}

// ═══════════════════════════════════════════════════════════════
// ROUTE PRINCIPALE
// ═══════════════════════════════════════════════════════════════
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, provider, mode: manualMode, customization } = body;

    const mode = manualMode || detectMode(prompt);
    console.log("🎯 Mode :", mode, "| Prompt :", prompt.slice(0, 50));

    const modele =
      provider === "claude" ? anthropic("claude-3-5-haiku-20241022")
      : provider === "deepseek" ? deepseek("deepseek-chat")
      : provider === "groq" ? groq("openai/gpt-oss-120b")
      : provider === "gemini" ? google("gemini-3.6-flash")
      : provider === "mistral" ? mistral("mistral-small-latest")
      : provider === "cohere" ? cohere("command-r7b-12-2024")
      : provider === "grok" ? xai("grok-vision-beta")
      : provider === "together" ? togetherai("meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo")
      : openai("gpt-4o-mini");

    // ═══════════════════════════════════════════════════════════
    // MODE DROPSHIPPING
    // ═══════════════════════════════════════════════════════════
    if (mode === "dropshipping") {
      let storeName = customization?.storeName;

      // Si pas de nom donne, l'IA en genere un
      if (!storeName) {
        const { text: nameText } = await generateText({
          model: modele,
          system: [
            "Tu generes UNIQUEMENT un nom de boutique creatif en francais.",
            "Reponds UNIQUEMENT avec le nom, rien d'autre.",
            "Pas de guillemets, pas d'explications, pas de markdown.",
            "Exemple : SneakerKing, TechStore, BijouxChic",
          ].join("\n"),
          prompt,
        });
        storeName =
          nameText
            .trim()
            .replace(/[^a-zA-Z0-9\s'-]/g, "")
            .slice(0, 30) || "Premium Store";
      }

      const tagline = "Decouvrez notre collection exclusive";

      // ⭐ Extrait le mot-cle produit du prompt
      const keyword = extractKeyword(prompt);
      console.log("🔍 Mot-cle extrait :", keyword);

      const { buildDropshippingSite } = await import("@/lib/dropshippingTemplate");
      const html = buildDropshippingSite(
        storeName,
        tagline,
        keyword,
        customization?.color,
        customization?.mood
      );

      return Response.json({
        ok: true,
        text: "```html\n" + html + "\n```",
        mode: "dropshipping",
        storeName,
        keyword,
      });
    }

    // ═══════════════════════════════════════════════════════════
    // MODE CODE (site / jeu / app)
    // ═══════════════════════════════════════════════════════════
    if (mode === "code") {
      const systemCode = [
        "Tu generes un site web complet et fonctionnel en HTML/CSS/JavaScript.",
        "Structure : <!DOCTYPE html><head><style>...</style></head><body><script>...</script></body></html>.",
        "PAS de systeme de paiement, PAS de catalogue produits.",
        "C'est un site creatif, un jeu, ou une app selon la demande.",
        "HTML/CSS/JS pur (PAS de React, PAS de framework).",
        "Design moderne, colore, responsive, emojis pour les icones.",
        "Chaque bouton doit avoir onclick ou addEventListener.",
        "Reponds UNIQUEMENT avec le code dans un bloc ```html ... ```.",
      ].join("\n");

      const { text } = await generateText({
        model: modele,
        system: systemCode,
        prompt,
      });

      return Response.json({ ok: true, text, mode: "code" });
    }

    // ═══════════════════════════════════════════════════════════
    // MODE CUSTOM (agents, guide)
    // ═══════════════════════════════════════════════════════════
    if (mode === "custom" && body.customSystemPrompt) {
      const { text } = await generateText({
        model: modele,
        system: body.customSystemPrompt,
        prompt,
      });
      return Response.json({ ok: true, text, mode: "custom" });
    }

    // ═══════════════════════════════════════════════════════════
    // MODE CHAT (defaut)
    // ═══════════════════════════════════════════════════════════
    const systemChat = [
      "Tu es BARRY AI, un assistant expert.",
      "Detecte la langue de l'utilisateur et reponds DANS LA MEME LANGUE.",
      "Style : clair, structure, utilise du Markdown.",
      "SECURITE : Jamais de contenu explicite, violent ou illegal.",
    ].join("\n");

    const { text } = await generateText({
      model: modele,
      system: systemChat,
      prompt,
    });

    return Response.json({ ok: true, text, mode: "chat" });

  } catch (err: any) {
    console.error("ERREUR API :", err);
    return Response.json(
      { ok: false, error: err?.message || String(err) },
      { status: 500 }
    );
  }
}