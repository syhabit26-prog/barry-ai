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
      const tagline = "Découvrez notre collection exclusive";

      const lower = dernierMessage.toLowerCase().replace(/[^\w\s]/g, " ");
      const cleaned = lower
        .replace(/cree|creer|moi|une|un|des|de|du|d|la|le|les|boutique|shop|store|magasin|en ligne|pour|avec|sur|dropshipping|vendre|veux/gi, " ")
        .replace(/\s+/g, " ")
        .trim();
      const keyword = cleaned.split(" ").slice(0, 3).join(" ") || "produits varies";

      const styles = ["modern", "luxury", "colorful", "minimal"] as const;
      const style = styles[Math.floor(Math.random() * styles.length)];

      const { buildDropshippingSite } = await import("@/lib/dropshippingTemplate");
      const html = buildDropshippingSite(storeName, tagline, keyword, customization?.color, customization?.mood, style);

      return Response.json({
        ok: true,
        text: "```html\n" + html + "\n```",
        mode: "dropshipping",
        style,
        keyword,
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
- Icônes SVG inline ou Lucide via CDN

STRUCTURE OBLIGATOIRE pour un site vitrine (banque, école, restaurant, entreprise...) :
1. HEADER sticky avec logo + navigation (Accueil, Services, À propos, Contact)
2. HERO : grand titre accrocheur + sous-titre + 2 boutons CTA + image/illustration
3. SECTION SERVICES : 3-6 cartes avec icônes, titres, descriptions
4. SECTION À PROPOS : texte + image ou stats (chiffres clés)
5. SECTION TÉMOIGNAGES ou AVANTAGES : 3 cartes
6. SECTION CONTACT : formulaire (nom, email, message) + coordonnées
7. FOOTER complet : liens, réseaux sociaux, copyright

STRUCTURE pour un JEU :
- Interface complète avec score, niveau, vies
- Game over + restart fonctionnel
- Contrôles clavier ET tactile (mobile)
- Design soigné avec animations

STRUCTURE pour un PORTFOLIO :
- Hero avec photo + nom + titre
- Section projets avec grid de cartes
- Section compétences avec barres de progression
- Section contact fonctionnelle

CONTENU :
- Textes RÉELS en français (pas "Lorem ipsum")
- Noms d'entreprise crédibles
- Coordonnées fictives mais réalistes (adresse, téléphone, email)
- Images via https://images.unsplash.com/ ou placehold.co

RÈGLES ABSOLUES :
- Réponds UNIQUEMENT avec le code complet, entre \`\`\`html et \`\`\`
- Commence DIRECTEMENT par <!DOCTYPE html>
- AUCUN texte avant ou après le code
- Pas de "Voici votre site" ni "J'espère que..."`,
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