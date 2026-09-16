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

export const maxDuration = 60;

// ═══════════════════════════════════════════════════════
// IDENTITÉ BARRY AI + CHAIN OF THOUGHT
// ═══════════════════════════════════════════════════════
const BARRY_IDENTITY = `
Tu es BARRY AI, un assistant personnel premium créé par Mouhamed Barry.

RÈGLES ABSOLUES :
- NE JAMAIS mentionner OpenAI, Anthropic, Claude, Gemini, Groq, Mistral, Cohere, Meta, Llama, xAI, Grok, DeepSeek, Together AI.
- Tu es BARRY AI, UNIQUEMENT BARRY AI.
- Si on demande qui t'a créé : "J'ai été créé par Mouhamed Barry".
- Détecte la langue et réponds DANS LA MÊME LANGUE.
- Utilise ## pour les titres, - pour les listes, **gras** pour les points clés.
- N'utilise JAMAIS de tableaux ni de balises HTML.

🧩 MÉTHODE POUR LES ÉNIGMES :
1. RELIRE mot par mot
2. VISUALISER la scène réelle
3. IDENTIFIER le piège
4. VÉRIFIER la cohérence

EXEMPLES :
- "Gardien de nuit qui rêve" → Il dort au travail
- "Camion trop haut, on enlève 5cm de pneus" → Remonte (suspensions)
- "12→6, 8→4, 4→?" → "Six" (Quatre a 6 lettres)
`;

// ═══════════════════════════════════════════════════════
// DETECTION MODE
// ═══════════════════════════════════════════════════════
function detectMode(prompt: string): "dropshipping" | "code" | "chat" {
  const lower = prompt.toLowerCase();
  const shopKeywords = ["boutique", "shop", "e-commerce", "dropshipping", "vendre", "catalogue", "panier", "store", "magasin"];
  const codeKeywords = ["cree", "creer", "genere", "site", "page", "landing", "portfolio", "jeu", "game", "app", "application", "calculatrice", "snake"];

  if (shopKeywords.some((kw) => lower.includes(kw))) return "dropshipping";
  if (codeKeywords.some((kw) => lower.includes(kw))) return "code";
  return "chat";
}

// ═══════════════════════════════════════════════════════
// DETECTION TYPE DE QUESTION
// ═══════════════════════════════════════════════════════
type QType = "riddle" | "math" | "business" | "translate" | "creative" | "explain" | "conversation";

function detectQType(prompt: string): QType {
  const lower = prompt.toLowerCase();
  const words = lower.split(/\s+/);

  // 🧩 ÉNIGME
  if (/enigme|énigme|devinette|puzzle|logique|allumette|obscurite|obscurité|survivants|enterre|coq|oeuf|œuf|escalier|monte|descend|bus|camion|tunnel|gardien|reve|rêve|detective|code secret|mot de passe/.test(lower)) return "riddle";

  // 🔢 MATHS
  if (/\d+\s*[\+\-\*\/x×÷]\s*\d+/.test(lower)) return "math";
  if (/calcul|calcule|combien|addition|soustraction|multiplication|division|equation|équation|pourcentage|racine|integrale|intégrale|derivee|dérivée|moyenne|probabilite/.test(lower)) return "math";

  // 💼 BUSINESS
  if (/business|entreprise|startup|marketing|strategie|stratégie|vendre|client|chiffre d'affaires|benefice|investir|investissement|trading|bourse|financier|comptabilite|fiscalite|dropshipping/.test(lower)) return "business";

  // 🌐 TRADUCTION
  if (/traduis|traduire|translation|translate|traduit/.test(lower)) return "translate";

  // ✍️ CRÉATIF
  if (/ecris|écris|poeme|poème|histoire|conte|chanson|paroles|scenario|scénario|dialogue|invente|imagine|raconte/.test(lower)) return "creative";

  // 📚 EXPLICATION
  if (/explique|explication|c'est quoi|qu'est-ce que|definition|définition|difference entre|différence entre|comment fonctionne|pourquoi|apprendre|tutoriel|guide|cours/.test(lower)) return "explain";

  // 💬 CONVERSATION (par défaut)
  if (words.length <= 8) return "conversation";

  return "explain";
}

// ═══════════════════════════════════════════════════════
// CHAT INTELLIGENT AVEC ROUTAGE
// ═══════════════════════════════════════════════════════
async function intelligentChat(prompt: string): Promise<string> {
  const type = detectQType(prompt);
  console.log("🎯 Type :", type);

  // Tableau de fallback (si l'IA principale échoue)
  const fallback = async (): Promise<string> => {
    console.log("⚠️ Fallback → Groq");
    const { text } = await generateText({
      model: groq("openai/gpt-oss-120b"),
      system: BARRY_IDENTITY,
      prompt,
    });
    return text;
  };

  try {
    // 🧩 ÉNIGME → Gemini
    if (type === "riddle") {
      console.log("🧩 → Gemini");
      const { text } = await generateText({
        model: google("gemini-2.5-flash"),
        system: BARRY_IDENTITY,
        prompt,
      });
      return text;
    }

    // 🔢 MATHS → DeepSeek
    if (type === "math") {
      console.log("🔢 → DeepSeek");
      const { text } = await generateText({
        model: deepseek("deepseek-chat"),
        system: BARRY_IDENTITY + "\n\nMontre le raisonnement étape par étape.",
        prompt,
      });
      return text;
    }

    // 💼 BUSINESS → Mistral
    if (type === "business") {
      console.log("💼 → Mistral");
      const { text } = await generateText({
        model: mistral("mistral-large-latest"),
        system: BARRY_IDENTITY + "\n\nSois structuré, chiffré, avec un plan d'action.",
        prompt,
      });
      return text;
    }

    // 🌐 TRADUCTION → Cohere
    if (type === "translate") {
      console.log("🌐 → Cohere");
      const { text } = await generateText({
        model: cohere("command-r-plus"),
        system: BARRY_IDENTITY,
        prompt,
      });
      return text;
    }

    // ✍️ CRÉATIF → Together AI
    if (type === "creative") {
      console.log("✍️ → Together AI");
      const { text } = await generateText({
        model: togetherai("meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo"),
        system: BARRY_IDENTITY + "\n\nLaisse libre cours à ta créativité.",
        prompt,
      });
      return text;
    }

    // 📚 EXPLICATION → Groq + Gemini en parallèle
    if (type === "explain") {
      console.log("📚 → Groq + Gemini");
      const [groqR, geminiR] = await Promise.allSettled([
        generateText({ model: groq("openai/gpt-oss-120b"), system: BARRY_IDENTITY, prompt }),
        generateText({ model: google("gemini-2.5-flash"), system: BARRY_IDENTITY, prompt }),
      ]);
      const groqText = groqR.status === "fulfilled" ? groqR.value.text : "";
      const geminiText = geminiR.status === "fulfilled" ? geminiR.value.text : "";
      if (!groqText && !geminiText) return fallback();
      if (!groqText) return geminiText;
      if (!geminiText) return groqText;
      return geminiText.length > groqText.length ? geminiText : groqText;
    }

    // 💬 CONVERSATION → Groq (rapide)
    console.log("💬 → Groq");
    const { text } = await generateText({
      model: groq("openai/gpt-oss-120b"),
      system: BARRY_IDENTITY,
      prompt,
    });
    return text;

  } catch (err: any) {
    console.log("❌ Erreur IA principale :", err.message);
    return fallback();
  }
}

// ═══════════════════════════════════════════════════════
// ROUTE PRINCIPALE
// ═══════════════════════════════════════════════════════
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, mode: manualMode, customization, provider } = body;

    const mode = manualMode || detectMode(prompt);
    console.log("🎯 Mode :", mode, "| Prompt :", prompt.slice(0, 50));

    // ═══ CHAT (auto-routing) ═══
    if (mode === "chat") {
      // Si un provider est forcé manuellement
      if (provider) {
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

        const { text } = await generateText({
          model: modele,
          system: BARRY_IDENTITY,
          prompt,
        });
        return Response.json({ ok: true, text, mode: "chat", provider });
      }

      // Sinon, auto-routing
      const text = await intelligentChat(prompt);
      return Response.json({ ok: true, text, mode: "chat" });
    }

    // ═══ DROPSHIPPING ═══
    if (mode === "dropshipping") {
      let storeName = customization?.storeName || "Premium Store";
      const tagline = "Decouvrez notre collection exclusive";

      const lower = prompt.toLowerCase().replace(/[^\w\s]/g, " ");
      const cleaned = lower
        .replace(/cree|creer|moi|une|un|des|de|du|d|la|le|les|boutique|shop|store|magasin|en ligne|pour|avec|sur/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      const keyword = cleaned.split(" ").slice(0, 4).join(" ") || "produits varies";

      const { buildDropshippingSite } = await import("@/lib/dropshippingTemplate");
      const html = buildDropshippingSite(storeName, tagline, keyword, customization?.color, customization?.mood);
      return Response.json({ ok: true, text: "```html\n" + html + "\n```", mode: "dropshipping" });
    }

    // ═══ CODE ═══
    if (mode === "code") {
      const { text } = await generateText({
        model: groq("openai/gpt-oss-120b"),
        system: BARRY_IDENTITY + "\n\nGenere un site/jeu/app complet en HTML/CSS/JS. Un seul fichier. Reponds UNIQUEMENT avec le code.",
        prompt,
      });
      return Response.json({ ok: true, text, mode: "code" });
    }

    // ═══ CUSTOM (agents) ═══
    if (body.customSystemPrompt) {
      const { text } = await generateText({
        model: groq("openai/gpt-oss-120b"),
        system: BARRY_IDENTITY + "\n\n" + body.customSystemPrompt,
        prompt,
      });
      return Response.json({ ok: true, text, mode: "custom" });
    }

    // ═══ FALLBACK ═══
    const text = await intelligentChat(prompt);
    return Response.json({ ok: true, text, mode: "chat" });

  } catch (err: any) {
    console.error("ERREUR API :", err);
    return Response.json({ ok: false, error: err?.message || String(err) }, { status: 500 });
  }
}