import { AGENTS as DETAILED_AGENTS } from "./agents";
import { AGENTS as SIMPLE_AGENTS } from "./agentCategories";
import { CODE_AGENTS } from "./codeAgents";

// ⭐ RÈGLE DE SPÉCIALITÉ STRICTE — appliquée à tous les agents
const SPECIALTY_RULE = (name: string, domain: string) => `
⚠️ RÈGLE DE SPÉCIALITÉ :
Tu es UNIQUEMENT expert en **${domain}**.
Si la question sort de ton domaine, réponds en UNE PHRASE COURTE, exactement :
"Désolé, ce n'est pas mon domaine. Je suis **${name}**. Cherche l'expert qu'il te faut sur /agents."
Ne rajoute AUCUN détail. Ne répète PAS ton domaine. Ne réponds JAMAIS à une question hors-sujet.

`;

export type UnifiedAgent = {
  slug: string;
  name: string;
  emoji: string;
  tagline: string;
  color: string;
  systemPrompt: string;
  category?: string;
};

// ═══ EMOJIS PAR CATÉGORIE (fallback) ═══
const CATEGORY_EMOJI: Record<string, string> = {
  Business: "💼", Marketing: "📈", Tech: "💻", Design: "🎨",
  Finance: "💰", Santé: "⚕️", Fitness: "💪", Éducation: "📚",
  Cuisine: "🍳", Voyage: "✈️", Beauté: "💄", Immobilier: "🏠",
  Auto: "🚗", Média: "🎥", Rédaction: "✍️", Art: "🎭",
  Lifestyle: "🌟", Famille: "👨‍👩‍👧", Animaux: "🐾", Nature: "🌿",
  Sciences: "🔬", Sport: "🏆", Loisirs: "🎮", Mode: "👔", Divers: "🤖",
  Code: "💻", Software: "🛠️", Data: "🗄️", Cloud: "☁️",
  AI: "🧠", Web3: "⛓️", GameDev: "🎮",
};

// ═══ EMOJIS SPÉCIFIQUES ═══
const EMOJI_RULES: Array<[RegExp, string]> = [
  [/dev react|react/i, "⚛️"], [/dev next/i, "▲"], [/dev vue/i, "💚"],
  [/dev angular/i, "🅰️"], [/dev svelte/i, "🔥"], [/dev typescript/i, "🟦"],
  [/dev javascript/i, "🟨"], [/dev python/i, "🐍"], [/dev rust/i, "🦀"],
  [/dev golang|dev go/i, "🐹"], [/dev java/i, "☕"], [/dev c#|csharp/i, "🟪"],
  [/dev php/i, "🐘"], [/dev ruby/i, "💎"], [/dev kotlin/i, "🟧"],
  [/dev swift/i, "🦅"], [/dev dart/i, "🎯"],
  [/expert docker/i, "🐳"], [/kubernetes/i, "☸️"], [/terraform/i, "🏗️"],
  [/expert aws/i, "🅰️"], [/expert gcp|google cloud/i, "🔵"], [/expert azure/i, "🟦"],
  [/expert github/i, "🐙"], [/expert git$/i, "🌳"], [/vercel/i, "▲"],
  [/expert linux/i, "🐧"], [/nginx/i, "🟩"],
  [/postgres/i, "🐘"], [/mysql/i, "🐬"], [/mongodb/i, "🍃"],
  [/redis/i, "🔴"], [/supabase/i, "⚡"], [/firebase/i, "🔥"],
  [/prisma/i, "🔺"], [/expert sql/i, "🗄️"],
  [/expert openai/i, "🧠"], [/expert claude/i, "🎭"], [/langchain/i, "🔗"],
  [/tensorflow/i, "🧮"], [/pytorch/i, "🔥"], [/hugging face/i, "🤗"],
  [/stable diffusion/i, "🎨"], [/prompt/i, "💬"], [/rag/i, "📚"],
  [/fine-tuning/i, "🎛️"], [/ai agents/i, "🤖"],
  [/expert ethereum/i, "⟠"], [/solana/i, "◎"], [/web3/i, "🌐"],
  [/nft/i, "🖼️"], [/defi/i, "💱"],
  [/dev unity/i, "🎮"], [/unreal/i, "🎬"], [/godot/i, "🤖"], [/phaser/i, "👾"],
  [/game design/i, "🎲"], [/game artist/i, "🖌️"],
  [/expert regex/i, "🔍"], [/expert jest/i, "🃏"], [/cypress/i, "🌲"],
  [/playwright/i, "🎭"], [/puppeteer/i, "🎪"], [/expert vim/i, "💚"],
  [/expert vscode/i, "🔵"], [/expert figma/i, "🎨"], [/expert notion/i, "📓"],

  [/infirmier/i, "💉"], [/sage.?femme/i, "🤰"], [/pharmacien/i, "💊"],
  [/v[eé]t[eé]rinaire/i, "🐶"], [/nutritionniste/i, "🥗"], [/di[eé]t[eé]ticien/i, "🍎"],
  [/cardiologue/i, "❤️"], [/dentiste/i, "🦷"], [/psychiatre/i, "🧠"],
  [/kin[eé]sith/i, "💆"], [/ost[eé]opathe/i, "🦴"],
  [/^pdg$/i, "👔"], [/manager/i, "📋"], [/entrepreneur/i, "💡"],
  [/^seo$/i, "🔎"], [/^sea$|google ads/i, "🎯"], [/community manager|^cm$/i, "📱"],
  [/copywriter/i, "✍️"], [/growth/i, "📈"],
  [/comptable/i, "🧮"], [/auditeur/i, "🔍"], [/banquier/i, "🏦"],
  [/^trader$/i, "📉"], [/investisseur/i, "💰"], [/crypto/i, "₿"],
  [/coach muscu/i, "🏋️"], [/yoga/i, "🧘"], [/coach cardio/i, "🏃"],
  [/coach foot/i, "⚽"], [/coach basket/i, "🏀"], [/coach tennis/i, "🎾"],
  [/coach natation/i, "🏊"], [/coach boxe/i, "🥊"],
  [/prof maths/i, "🔢"], [/prof anglais/i, "🇬🇧"], [/prof fran/i, "📖"],
  [/prof histoire/i, "📜"], [/prof philo/i, "🤔"],
  [/chef cuisinier/i, "👨‍🍳"], [/p[aâ]tissier/i, "🧁"], [/boulanger/i, "🥖"],
  [/pizzaiolo/i, "🍕"], [/sushi/i, "🍣"], [/barman/i, "🍸"], [/barista/i, "☕"],
  [/agent voyage/i, "🧳"], [/pilote/i, "✈️"], [/hotelier/i, "🏨"],
  [/coiffeur/i, "💇"], [/barbier/i, "💈"], [/maquilleur/i, "💄"],
  [/agent immo/i, "🏡"], [/architecte/i, "📐"], [/plombier/i, "🔧"],
  [/electricien/i, "⚡"], [/menuisier/i, "🪚"],
  [/m[eé]canicien/i, "🔧"], [/carrossier/i, "🚗"],
  [/journaliste/i, "📰"], [/youtubeur/i, "▶️"], [/streamer/i, "🎮"],
  [/auteur/i, "📖"], [/romancier/i, "📕"], [/po[eè]te/i, "🌹"],
  [/musicien/i, "🎸"], [/chanteur/i, "🎤"], [/^dj$/i, "🎧"],
  [/coach de vie|life coach/i, "🌟"], [/sophrologue/i, "🧘"],
  [/nounou|baby.?sitter/i, "👶"], [/dresseur/i, "🐕"],
  [/chercheur/i, "🔬"], [/chimiste/i, "🧪"], [/astronome/i, "🔭"],
  [/agent sportif/i, "🎽"], [/arbitre/i, "🟨"],
  [/collectionneur/i, "🎴"], [/jeux vid[eé]o/i, "🎮"],
  [/assistant ia/i, "🤖"], [/conseiller/i, "💡"],
];

function emojiFor(name: string, category?: string): string {
  for (const [re, emoji] of EMOJI_RULES) {
    if (re.test(name)) return emoji;
  }
  return CATEGORY_EMOJI[category || ""] || "🤖";
}

// ═══ COULEURS PAR CATÉGORIE ═══
const CATEGORY_COLOR: Record<string, string> = {
  Business: "#3b82f6", Marketing: "#f59e0b", Tech: "#8b5cf6", Design: "#ec4899",
  Finance: "#10b981", Santé: "#14b8a6", Fitness: "#0891b2", Éducation: "#f97316",
  Cuisine: "#ef4444", Voyage: "#06b6d4", Beauté: "#db2777", Immobilier: "#f59e0b",
  Auto: "#6b7280", Média: "#6366f1", Rédaction: "#8b5cf6", Art: "#a855f7",
  Lifestyle: "#22c55e", Famille: "#f472b6", Animaux: "#84cc16", Nature: "#22c55e",
  Sciences: "#0ea5e9", Sport: "#ef4444", Loisirs: "#f59e0b", Mode: "#8b5cf6",
  Divers: "#6b7280",
  Code: "#8b5cf6", Software: "#06b6d4", Data: "#3b82f6", Cloud: "#0ea5e9",
  AI: "#a855f7", Web3: "#f59e0b", GameDev: "#ef4444",
};

function colorFor(category?: string): string {
  return CATEGORY_COLOR[category || ""] || "#6b7280";
}

// ═══ FUSION AVEC DÉDUPLICATION ═══
const DETAILED_SLUGS = new Set(DETAILED_AGENTS.map((a) => a.slug));

export const ALL_AGENTS: UnifiedAgent[] = [
  // 1. Les 14 agents détaillés
  ...DETAILED_AGENTS.map((a) => ({
    slug: a.slug,
    name: a.name,
    emoji: a.emoji,
    tagline: a.tagline,
    color: a.color,
    systemPrompt: a.systemPrompt,
    category: undefined,
  })),

  // 2. Les 486 agents génériques
  ...SIMPLE_AGENTS.filter((a) => !DETAILED_SLUGS.has(a.id)).map((a) => ({
    slug: a.id,
    name: a.name,
    emoji: emojiFor(a.name, a.category),
    tagline: a.prompt.length > 50 ? a.prompt.slice(0, 50) + "..." : a.prompt,
    color: colorFor(a.category),
    systemPrompt:
      SPECIALTY_RULE(a.name, a.category + " — " + a.prompt) +
      `Tu es un expert en ${a.category}. ${a.prompt}. Réponds dans la langue de l'utilisateur.`,
    category: a.category,
  })),

  // 3. Les 120 agents Code & Logiciel
  ...CODE_AGENTS.filter((a) => !DETAILED_SLUGS.has(a.id)).map((a) => ({
    slug: a.id,
    name: a.name,
    emoji: emojiFor(a.name, a.category),
    tagline: a.prompt.length > 50 ? a.prompt.slice(0, 50) + "..." : a.prompt,
    color: colorFor(a.category),
    systemPrompt:
      SPECIALTY_RULE(a.name, a.prompt) +
      `Tu es un expert développeur en ${a.name}. ${a.prompt}. Donne du code propre, testé, avec explications courtes. Réponds dans la langue de l'utilisateur.`,
    category: a.category,
  })),
];

export function getAllAgents() {
  return ALL_AGENTS;
}

export function getAgentBySlug(slug: string) {
  return ALL_AGENTS.find((a) => a.slug === slug);
}

export function getAgentCategories() {
  const cats = new Set<string>();
  ALL_AGENTS.forEach((a) => {
    if (a.category) cats.add(a.category);
  });
  return Array.from(cats).sort();
}

// ⭐ Détecte un agent depuis un message de chat
export function findAgentInMessage(message: string): UnifiedAgent | null {
  const lower = message.toLowerCase().trim();

  const triggers = [
    /(?:parle[rz]?|discute[rz]?)\s+(?:moi\s+)?(?:à|a|au|aux|avec)\s+(?:un|une|le|la|les|l')?\s*([a-zà-ÿ0-9\-]+(?:\s+[a-zà-ÿ0-9\-]+){0,3})/i,
    /je\s+(?:veux|voudrais|souhaite)\s+(?:parler|discuter)\s+(?:à|a|au|aux|avec)\s+(?:un|une|le|la|les|l')?\s*([a-zà-ÿ0-9\-]+(?:\s+[a-zà-ÿ0-9\-]+){0,3})/i,
    /(?:consulte[rz]?|appelle[rz]?|active[rz]?|utilise[rz]?)\s+(?:un|une|le|la|les|l')?\s*([a-zà-ÿ0-9\-]+(?:\s+[a-zà-ÿ0-9\-]+){0,3})/i,
  ];

  for (const t of triggers) {
    const m = lower.match(t);
    if (m) {
      let target = m[1].trim().replace(/[?.!,]/g, "");

      const slugTry = target.replace(/\s+/g, "_");
      let found = ALL_AGENTS.find((a) => a.slug === slugTry);
      if (found) return found;

      found = ALL_AGENTS.find((a) => a.name.toLowerCase() === target);
      if (found) return found;

      found = ALL_AGENTS.find((a) => a.name.toLowerCase().includes(target));
      if (found) return found;

      found = ALL_AGENTS.find((a) => a.slug.includes(slugTry));
      if (found) return found;

      const words = target.split(/\s+/);
      for (let i = words.length - 1; i >= 1; i--) {
        const shortTarget = words.slice(0, i).join(" ");
        found = ALL_AGENTS.find((a) => a.name.toLowerCase().includes(shortTarget));
        if (found) return found;
      }
    }
  }

  return null;
}