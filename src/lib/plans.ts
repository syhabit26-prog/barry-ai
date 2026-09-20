export type Feature = "chat" | "builder" | "agents" | "connecteurs";

export type PlanTier = "basic" | "advanced" | "pro";

export type Plan = {
  id: string;
  feature: Feature | "all";
  tier: PlanTier;
  name: string;
  price: number;
  period: string;
  limit: number; // -1 = illimité
  limitLabel: string;
  features: string[];
  priceId: string | null;
  highlight?: boolean;
};

export const FEATURES: Record<Feature, { label: string; icon: string; description: string }> = {
  chat: { label: "Chat IA", icon: "💬", description: "Discute avec les meilleures IA" },
  builder: { label: "Builder", icon: "🏗️", description: "Crée sites, apps, jeux et boutiques" },
  agents: { label: "Agents", icon: "🤖", description: "Déploie tes agents spécialisés" },
  connecteurs: { label: "Connecteurs", icon: "🔌", description: "Gmail, Stripe, Shopify, X..." },
};

export const PLANS: Plan[] = [
  // ═══ CHAT IA ═══
  {
    id: "chat_basic",
    feature: "chat",
    tier: "basic",
    name: "Chat Basic",
    price: 5,
    period: "/mois",
    limit: 200,
    limitLabel: "200 messages/mois",
    features: ["200 messages", "IA Groq rapide", "Mémoire courte (10 messages)", "Support email"],
    priceId: process.env.NEXT_PUBLIC_STRIPE_CHAT_BASIC || null,
  },
  {
    id: "chat_advanced",
    feature: "chat",
    tier: "advanced",
    name: "Chat Advanced",
    price: 12,
    period: "/mois",
    limit: 700,
    limitLabel: "700 messages/mois",
    features: ["700 messages", "3 IA (Groq, Gemini, Claude)", "Mémoire longue (50 messages)", "Upload fichiers", "Support prioritaire"],
    priceId: process.env.NEXT_PUBLIC_STRIPE_CHAT_ADVANCED || null,
    highlight: true,
  },
  {
    id: "chat_pro",
    feature: "chat",
    tier: "pro",
    name: "Chat Pro",
    price: 25,
    period: "/mois",
    limit: -1,
    limitLabel: "Messages illimités",
    features: ["Messages illimités", "9 IA au choix", "Mémoire infinie", "Upload illimité", "API access", "Support 24/7"],
    priceId: process.env.NEXT_PUBLIC_STRIPE_CHAT_PRO || null,
  },

  // ═══ BUILDER ═══
  {
    id: "builder_basic",
    feature: "builder",
    tier: "basic",
    name: "Builder Basic",
    price: 9,
    period: "/mois",
    limit: 10,
    limitLabel: "10 créations/mois",
    features: ["10 créations (sites, apps, jeux, dropshipping)", "Toutes les catégories", "Watermark BARRY", "1 modification/jour"],
    priceId: process.env.NEXT_PUBLIC_STRIPE_BUILDER_BASIC || null,
  },
  {
    id: "builder_advanced",
    feature: "builder",
    tier: "advanced",
    name: "Builder Advanced",
    price: 25,
    period: "/mois",
    limit: 30,
    limitLabel: "30 créations/mois",
    features: ["30 créations", "Toutes les catégories", "Sans watermark", "20 modifications/jour", "Domaine personnalisé", "Caisse Stripe/PayPal"],
    priceId: process.env.NEXT_PUBLIC_STRIPE_BUILDER_ADVANCED || null,
    highlight: true,
  },
  {
    id: "builder_pro",
    feature: "builder",
    tier: "pro",
    name: "Builder Pro",
    price: 49,
    period: "/mois",
    limit: 200,
    limitLabel: "200 créations/mois",
    features: ["200 créations", "Toutes les catégories", "Sans watermark", "Modifications illimitées", "Export code source", "API access", "Support prioritaire"],
    priceId: process.env.NEXT_PUBLIC_STRIPE_BUILDER_PRO || null,
  },

  // ═══ AGENTS ═══
  {
    id: "agents_basic",
    feature: "agents",
    tier: "basic",
    name: "Agents Basic",
    price: 7,
    period: "/mois",
    limit: 4,
    limitLabel: "4 agents",
    features: ["4 agents au choix", "20 missions/mois", "Support email"],
    priceId: process.env.NEXT_PUBLIC_STRIPE_AGENTS_BASIC || null,
  },
  {
    id: "agents_advanced",
    feature: "agents",
    tier: "advanced",
    name: "Agents Advanced",
    price: 15,
    period: "/mois",
    limit: 8,
    limitLabel: "8 agents",
    features: ["8 agents au choix", "100 missions/mois", "Personnalisation", "Support prioritaire"],
    priceId: process.env.NEXT_PUBLIC_STRIPE_AGENTS_ADVANCED || null,
    highlight: true,
  },
  {
    id: "agents_pro",
    feature: "agents",
    tier: "pro",
    name: "Agents Pro",
    price: 29,
    period: "/mois",
    limit: -1,
    limitLabel: "Tous les agents",
    features: ["Tous les agents (14+)", "Missions illimitées", "Agents personnalisés", "API access", "Support 24/7"],
    priceId: process.env.NEXT_PUBLIC_STRIPE_AGENTS_PRO || null,
  },

  // ═══ CONNECTEURS ═══
  {
    id: "connecteurs_basic",
    feature: "connecteurs",
    tier: "basic",
    name: "Connecteurs Basic",
    price: 5,
    period: "/mois",
    limit: 3,
    limitLabel: "3 connecteurs",
    features: ["3 connecteurs au choix", "100 actions/mois", "Support email"],
    priceId: process.env.NEXT_PUBLIC_STRIPE_CONNECTEURS_BASIC || null,
  },
  {
    id: "connecteurs_advanced",
    feature: "connecteurs",
    tier: "advanced",
    name: "Connecteurs Advanced",
    price: 12,
    period: "/mois",
    limit: 8,
    limitLabel: "8 connecteurs",
    features: ["8 connecteurs au choix", "1000 actions/mois", "Webhooks", "Support prioritaire"],
    priceId: process.env.NEXT_PUBLIC_STRIPE_CONNECTEURS_ADVANCED || null,
    highlight: true,
  },
  {
    id: "connecteurs_pro",
    feature: "connecteurs",
    tier: "pro",
    name: "Connecteurs Pro",
    price: 25,
    period: "/mois",
    limit: -1,
    limitLabel: "Illimité",
    features: ["Tous les connecteurs", "Actions illimitées", "Webhooks illimités", "API access", "Support 24/7"],
    priceId: process.env.NEXT_PUBLIC_STRIPE_CONNECTEURS_PRO || null,
  },
];

export function getPlansByFeature(feature: Feature): Plan[] {
  return PLANS.filter((p) => p.feature === feature);
}

export function getPlanById(id: string): Plan | undefined {
  return PLANS.find((p) => p.id === id);
}