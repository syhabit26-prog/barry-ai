import { openai } from "@ai-sdk/openai";
import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { ALL_AGENTS } from "@/lib/allAgents";

export const maxDuration = 60;

async function analyzeWithAI(image: string, provider: "openai" | "groq") {
  const model =
    provider === "openai"
      ? openai("gpt-4o-mini")
      : groq("meta-llama/llama-4-scout-17b-16e-instruct");

  const result = await generateText({
    model,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Analyse cette image. Décris en 5 à 10 mots-clés (en français, séparés par des virgules) le métier ou le domaine d'aide professionnelle dont la personne a besoin.
Réponds UNIQUEMENT avec les mots-clés, rien d'autre.

Exemples :
- Photo d'ordinateur avec code → "développeur, code, web, programmation, informatique"
- Photo d'haltères → "coach sportif, musculation, fitness, entraînement"
- Photo de factures → "comptable, fiscalité, factures, tva"
- Photo de cuisine → "chef cuisinier, cuisine, recettes, gastronomie"
- Photo de voiture → "mécanicien, auto, mécanique, réparation"`,
          },
          {
            type: "image",
            image: image,
          },
        ],
      },
    ],
  });

  return result.text;
}

export async function POST(req: Request) {
  try {
    const { image } = await req.json();
    if (!image) {
      return Response.json({ ok: false, error: "Image manquante" });
    }

    let text = "";
    try {
      console.log("🎬 Analyse OpenAI Vision...");
      text = await analyzeWithAI(image, "openai");
      console.log("✅ OpenAI OK:", text);
    } catch (e: any) {
      console.warn("⚠️ OpenAI échoué:", e?.message);
      try {
        console.log("🎬 Fallback Groq Vision...");
        text = await analyzeWithAI(image, "groq");
        console.log("✅ Groq OK:", text);
      } catch (e2: any) {
        console.error("❌ Groq échoué aussi:", e2?.message);
        return Response.json({
          ok: false,
          error: "Vision IA indisponible",
        });
      }
    }

    const keywords = text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s,]/g, "")
      .split(",")
      .map((k: string) => k.trim())
      .filter((k: string) => k.length >= 3);

    console.log("🔍 Mots-clés photo:", keywords);

    if (keywords.length === 0) {
      return Response.json({
        ok: true,
        keywords: [],
        agentSlugs: [],
        raw: text,
      });
    }

    // Scoring
    const scored = ALL_AGENTS.map((a) => {
      const haystack = (
        a.name +
        " " +
        a.tagline +
        " " +
        (a.category || "") +
        " " +
        a.slug
      )
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      let score = 0;
      for (const kw of keywords) {
        const kwNorm = kw.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        if (haystack.includes(kwNorm)) score += 10;
        for (const word of kwNorm.split(/\s+/)) {
          if (word.length >= 3 && haystack.includes(word)) score += 2;
        }
      }
      return { agent: a, score };
    });

    const best = scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((s) => s.agent.slug);

    console.log("✅ Agents recommandés:", best);

    return Response.json({
      ok: true,
      keywords,
      agentSlugs: best,
    });
  } catch (err: any) {
    console.error("❌", err);
    return Response.json({ ok: false, error: err?.message || String(err) });
  }
}