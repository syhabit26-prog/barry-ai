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
// IDENTITÉ BARRY AI
// ═══════════════════════════════════════════════════════
const BARRY_IDENTITY = `
Tu es BARRY AI, un assistant personnel premium créé par Mouhamed Barry.

MISSION : aider dans tous les domaines (développement, business, finance, éducation, créativité, vie quotidienne).

RÈGLES ABSOLUES :
- NE JAMAIS mentionner OpenAI, Anthropic, Claude, Gemini, Groq, Mistral, Cohere, Meta, Llama, xAI, Grok, DeepSeek, Together AI ou un autre fournisseur.
- NE JAMAIS dire "je suis un modèle de langage" ou "je suis une IA".
- Tu es BARRY AI, UNIQUEMENT BARRY AI.
- Si on demande qui t'a créé : "J'ai été créé par Mouhamed Barry".

DÉTECTION LANGUE :
- Détecte la langue de l'utilisateur et réponds DANS LA MÊME LANGUE.

RÈGLE DE LOGIQUE (TRÈS IMPORTANTE) :
Avant de répondre, réfléchis à la logique de la situation :
1. Relis la question mentalement
2. Identifie l'OBJECTIF RÉEL de l'utilisateur
3. Vérifie que ta réponse a du SENS dans la vraie vie
4. Si ta réponse est absurde, change de stratégie

EXEMPLES :
- "Laver ma voiture à 100m" → "Conduis ta voiture au lave-auto" (pas "va à pied" !)
- "J'ai faim mais pas d'argent" → "Regarde ce que tu as chez toi" (pas "va au restaurant" !)

RÈGLES DE MISE EN FORME (CRUCIALES) :
- N'utilise JAMAIS de tableaux Markdown (| col | col |)
- N'utilise JAMAIS de balises HTML (<br>, <p>, <div>)
- N'utilise PAS de caractères spéciaux bizarres
- N'utilise PAS de sauts de ligne excessifs

UTILISE UNIQUEMENT :
- ## pour les titres principaux
- ### pour les sous-titres
- - pour les listes à puces
- 1. 2. 3. pour les listes numérotées
- **gras** pour les points importants
- \`code\` pour le code inline
- Laisse une ligne vide entre les paragraphes

STRUCTURE RECOMMANDÉE :
## Titre clair

Introduction en 1-2 phrases.

### Premier point
- Explication
- Exemple

### Deuxième point
- Explication
- Exemple

### En résumé
Conclusion en 1-2 phrases.
`;

// ═══════════════════════════════════════════════════════
// DETECTION MODE
// ═══════════════════════════════════════════════════════
function detectMode(prompt: string): "dropshipping" | "code" | "chat" {
  const lower = prompt.toLowerCase();
  const shopKeywords = ["boutique", "shop", "e-commerce", "ecommerce", "dropshipping", "vendre", "vente", "catalogue", "panier", "store", "magasin"];
  const codeKeywords = ["cree", "creer", "genere", "fais", "site", "page", "landing", "portfolio", "jeu", "game", "app", "application", "calculatrice", "todo", "snake", "memory"];

  if (shopKeywords.some((kw) => lower.includes(kw))) return "dropshipping";
  if (codeKeywords.some((kw) => lower.includes(kw))) return "code";
  return "chat";
}

// ═══════════════════════════════════════════════════════
// COMPLEXITE
// ═══════════════════════════════════════════════════════
function isComplex(prompt: string): boolean {
  const lower = prompt.toLowerCase();
  const words = lower.split(/\s+/);

  const complexKeywords = [
    "explique", "analyse", "compare", "pourquoi", "comment",
    "detaille", "strategy", "strategie", "plan", "guide",
    "tutoriel", "etapes", "difference", "avantage", "inconvenient",
    "conseil", "recommande", "aide-moi", "aide moi",
    "financier", "comptable", "marketing", "juridique",
    "code", "programme", "fonction", "algorithm",
    "business", "entreprise", "startup", "projet",
  ];

  if (words.length > 15) return true;
  if (complexKeywords.some((kw) => lower.includes(kw))) return true;
  return false;
}

// ═══════════════════════════════════════════════════════
// CHAT INTELLIGENT
// ═══════════════════════════════════════════════════════
async function intelligentChat(prompt: string): Promise<string> {
  const complex = isComplex(prompt);
  console.log("🎯 Complexite :", complex ? "COMPLEXE" : "SIMPLE");

  if (!complex) {
    console.log("⚡ Routage → Groq");
    const { text } = await generateText({
      model: groq("openai/gpt-oss-120b"),
      system: BARRY_IDENTITY,
      prompt,
    });
    return text;
  }

  console.log("🧠 Routage → Groq + Gemini");

  const [groqResult, geminiResult] = await Promise.allSettled([
    generateText({
      model: groq("openai/gpt-oss-120b"),
      system: BARRY_IDENTITY,
      prompt,
    }),
    generateText({
      model: google("gemini-2.0-flash-exp"),
      system: BARRY_IDENTITY,
      prompt,
    }),
  ]);

  const groqText = groqResult.status === "fulfilled" ? groqResult.value.text : "";
  const geminiText = geminiResult.status === "fulfilled" ? geminiResult.value.text : "";

  console.log("✅ Groq :", groqText.length, "car | Gemini :", geminiText.length, "car");

  if (!groqText && !geminiText) throw new Error("Aucune IA n'a repondu");
  if (!groqText) return geminiText;
  if (!geminiText) return groqText;

  return geminiText.length > groqText.length ? geminiText : groqText;
}

// ═══════════════════════════════════════════════════════
// ROUTE PRINCIPALE
// ═══════════════════════════════════════════════════════
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, mode: manualMode, customization } = body;

    const mode = manualMode || detectMode(prompt);
    console.log("🎯 Mode :", mode, "| Prompt :", prompt.slice(0, 50));

    // ═══ CHAT ═══
    if (mode === "chat") {
      const text = await intelligentChat(prompt);
      return Response.json({ ok: true, text, mode: "chat" });
    }

    // ═══ DROPSHIPPING ═══
    if (mode === "dropshipping") {
      const modele = groq("openai/gpt-oss-120b");
      let storeName = customization?.storeName;

      if (!storeName) {
        const { text: nameText } = await generateText({
          model: modele,
          system: "Tu generes UNIQUEMENT un nom de boutique creatif en francais. Reponds UNIQUEMENT avec le nom. Pas de guillemets.",
          prompt,
        });
        storeName = nameText.trim().replace(/[^a-zA-Z0-9\s'-]/g, "").slice(0, 30) || "Premium Store";
      }

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
      const systemCode = BARRY_IDENTITY + `

Tu generes un site web/jeu/app COMPLET en HTML/CSS/JavaScript.

RÈGLES ABSOLUES :
1. Tout le code dans UN SEUL fichier HTML autonome
2. Utilise <canvas> pour les jeux
3. Graphismes : dessine avec Canvas API (arc, rect, fill)
4. Sons : Web Audio API (oscillateurs)
5. Animations : requestAnimationFrame
6. ZERO ressource externe (pas d'URL http://)
7. Design moderne, coloré, responsive

Réponds UNIQUEMENT avec le code dans un bloc html.`;

      const { text } = await generateText({
        model: groq("openai/gpt-oss-120b"),
        system: systemCode,
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