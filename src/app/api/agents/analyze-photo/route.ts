import { ALL_AGENTS } from "@/lib/allAgents";

export const maxDuration = 60;

async function analyzeImage(imageDataUrl: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY manquante dans .env.local");

  console.log("🎬 Envoi à OpenAI Vision...");

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + apiKey,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyse cette image. Réponds UNIQUEMENT avec 8 mots-clés en français séparés par des virgules, décrivant les métiers ou domaines d'expertise nécessaires.

Exemples :
- Ordinateur + code → "dev, développeur, code, web, programmation, informatique, frontend, tech"
- Haltères / sport → "coach, sportif, fitness, musculation, entraînement, sport, gym, coach"
- Factures → "comptable, comptabilité, fiscalité, factures, tva, finance, gestion, business"
- Cuisine → "chef, cuisinier, cuisine, recettes, gastronomie, pâtissier, restaurant, food"
- Voiture → "mécanicien, auto, mécanique, réparation, voiture, garage, moteur, automobile"
- Caméra → "photographe, vidéo, caméra, photo, vidéaste, cinéma, image, studio"
- Hôpital → "médecin, santé, médical, soins, docteur, clinique, santé, hospital"

Réponds avec les mots-clés séparés par virgules, RIEN D'AUTRE.`,
            },
            {
              type: "image_url",
              image_url: { url: imageDataUrl },
            },
          ],
        },
      ],
      max_tokens: 200,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("❌ OpenAI erreur:", JSON.stringify(data));
    throw new Error(
      "OpenAI " + res.status + " : " + (data.error?.message || "inconnu")
    );
  }

  const text = data.choices?.[0]?.message?.content || "";
  console.log("✅ OpenAI répond:", text);
  return text;
}

export async function POST(req: Request) {
  try {
    const { image } = await req.json();
    if (!image) return Response.json({ ok: false, error: "Image manquante" });

    // ═══ Analyse IA ═══
    let text = "";
    try {
      text = await analyzeImage(image);
    } catch (e: any) {
      console.error("❌ Analyse échouée:", e?.message);
      return Response.json({
        ok: false,
        error: e?.message || "Vision indisponible",
      });
    }

    // ═══ Extraire mots-clés ═══
    const keywords = text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s,]/g, "")
      .split(",")
      .map((k: string) => k.trim())
      .filter((k: string) => k.length >= 3);

    console.log("🔍 Mots-clés extraits:", keywords);

    if (keywords.length === 0) {
      return Response.json({ ok: true, keywords: [], agentSlugs: [] });
    }

    // ═══ Synonymes ═══
    const SYNONYMS: Record<string, string[]> = {
      dev: ["dev", "developpeur", "code", "programmation"],
      developpeur: ["dev", "developpeur", "fullstack", "frontend", "backend"],
      code: ["code", "dev", "programmation"],
      web: ["web", "frontend", "front", "site"],
      coach: ["coach", "coaching"],
      sportif: ["sport", "sportif", "fitness"],
      fitness: ["fitness", "muscu", "gym", "sport"],
      musculation: ["muscu", "fitness"],
      entrainement: ["entrainement", "coach", "sport"],
      comptable: ["comptable", "comptabilite", "finance"],
      comptabilite: ["comptable", "comptabilite"],
      fiscalite: ["fiscal", "comptable"],
      finance: ["finance", "financier"],
      factures: ["comptable", "facturation"],
      chef: ["chef", "cuisinier", "cuisine"],
      cuisinier: ["chef", "cuisinier", "cuisine"],
      cuisine: ["cuisine", "cuisinier", "chef", "recette"],
      restaurant: ["restaurateur", "restaurant"],
      mecanicien: ["mecanicien", "mecanique", "auto"],
      auto: ["auto", "voiture", "mecanicien"],
      mecanique: ["mecanique", "mecanicien"],
      voiture: ["voiture", "auto", "mecanicien"],
      photographe: ["photographe", "photo"],
      photo: ["photographe", "photo"],
      video: ["video", "videaste", "monteur"],
      camera: ["camera", "photographe", "video"],
      medecin: ["medecin", "sante", "medical"],
      sante: ["sante", "coach sante"],
      medical: ["medical", "medecin", "sante"],
      immobilier: ["immobilier", "agent immo", "expert immo"],
      graphiste: ["graphiste", "design", "designer"],
      design: ["designer", "graphiste", "ux", "ui"],
    };

    const expanded = new Set<string>();
    for (const kw of keywords) {
      expanded.add(kw);
      for (const [key, syns] of Object.entries(SYNONYMS)) {
        if (kw.includes(key) || key.includes(kw)) {
          syns.forEach((s) => expanded.add(s));
        }
      }
    }

    console.log("🔍 Mots-clés étendus:", [...expanded]);

    // ═══ Scoring ═══
    const scored = ALL_AGENTS.map((a) => {
      const haystack = (
        a.name + " " + a.tagline + " " + (a.category || "") + " " + a.slug
      )
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      let score = 0;
      for (const kw of expanded) {
        if (kw.length < 3) continue;
        if (haystack.includes(kw)) score += 10;
        if (kw.length >= 5) {
          const stem = kw.slice(0, -2);
          if (haystack.includes(stem)) score += 5;
        }
      }
      return { agent: a, score };
    });

    const best = scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((s) => s.agent.slug);

    console.log("✅ Recommandés:", best);

    return Response.json({
      ok: true,
      keywords: [...expanded],
      agentSlugs: best,
    });
  } catch (err: any) {
    console.error("❌ Global:", err);
    return Response.json({ ok: false, error: err?.message || String(err) });
  }
}