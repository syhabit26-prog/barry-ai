export type Service = "chat" | "agents" | "building" | "connectors" | "enterprise";
export type Tier = "basic" | "advanced" | "vip" | "enterprise";
export type Duration = "monthly" | "6months" | "yearly";

export type Plan = {
  id: string;
  service: Service;
  tier: Tier;
  duration: Duration;
  price: number;
  currency: string;
  label: string;
  features: string[];
  limits: {
    messages?: number;
    images?: number;
    sites?: number;
    agents?: number;
    threeD?: number;
    connectors?: number;
  };
};

// ═══════════════════════════════════════════════════════════════
// CHAT AI
// ═══════════════════════════════════════════════════════════════
export const CHAT_PLANS: Plan[] = [
  {
    id: "chat_basic_monthly",
    service: "chat",
    tier: "basic",
    duration: "monthly",
    price: 9,
    currency: "EUR",
    label: "Chat AI Basic",
    features: ["500 messages/mois", "3 modèles IA", "Mémoire 1h"],
    limits: { messages: 500 },
  },
  {
    id: "chat_basic_6months",
    service: "chat",
    tier: "basic",
    duration: "6months",
    price: 49,
    currency: "EUR",
    label: "Chat AI Basic (6 mois)",
    features: ["3000 messages", "3 modèles IA", "Mémoire 1h", "Économie 5€"],
    limits: { messages: 3000 },
  },
  {
    id: "chat_basic_yearly",
    service: "chat",
    tier: "basic",
    duration: "yearly",
    price: 89,
    currency: "EUR",
    label: "Chat AI Basic (1 an)",
    features: ["6000 messages", "3 modèles IA", "Mémoire 1h", "Économie 19€"],
    limits: { messages: 6000 },
  },
  {
    id: "chat_advanced_monthly",
    service: "chat",
    tier: "advanced",
    duration: "monthly",
    price: 19,
    currency: "EUR",
    label: "Chat AI Advanced",
    features: ["2000 messages/mois", "6 modèles IA", "Mémoire 24h", "Priorité"],
    limits: { messages: 2000 },
  },
  {
    id: "chat_advanced_6months",
    service: "chat",
    tier: "advanced",
    duration: "6months",
    price: 99,
    currency: "EUR",
    label: "Chat AI Advanced (6 mois)",
    features: ["12000 messages", "6 modèles IA", "Mémoire 24h", "Économie 15€"],
    limits: { messages: 12000 },
  },
  {
    id: "chat_advanced_yearly",
    service: "chat",
    tier: "advanced",
    duration: "yearly",
    price: 189,
    currency: "EUR",
    label: "Chat AI Advanced (1 an)",
    features: ["24000 messages", "6 modèles IA", "Mémoire 24h", "Économie 39€"],
    limits: { messages: 24000 },
  },
  {
    id: "chat_vip_monthly",
    service: "chat",
    tier: "vip",
    duration: "monthly",
    price: 39,
    currency: "EUR",
    label: "Chat AI VIP",
    features: ["Illimité", "9 modèles IA", "Mémoire infinie", "Support 24/7"],
    limits: { messages: Infinity },
  },
  {
    id: "chat_vip_6months",
    service: "chat",
    tier: "vip",
    duration: "6months",
    price: 199,
    currency: "EUR",
    label: "Chat AI VIP (6 mois)",
    features: ["Illimité", "9 modèles IA", "Mémoire infinie", "Économie 35€"],
    limits: { messages: Infinity },
  },
  {
    id: "chat_vip_yearly",
    service: "chat",
    tier: "vip",
    duration: "yearly",
    price: 379,
    currency: "EUR",
    label: "Chat AI VIP (1 an)",
    features: ["Illimité", "9 modèles IA", "Mémoire infinie", "Économie 89€"],
    limits: { messages: Infinity },
  },
];

// ═══════════════════════════════════════════════════════════════
// AGENTS
// ═══════════════════════════════════════════════════════════════
export const AGENTS_PLANS: Plan[] = [
  {
    id: "agents_basic_monthly",
    service: "agents",
    tier: "basic",
    duration: "monthly",
    price: 19,
    currency: "EUR",
    label: "Agents Basic",
    features: ["5 agents", "100 questions/mois", "Support email"],
    limits: { agents: 5, messages: 100 },
  },
  {
    id: "agents_basic_6months",
    service: "agents",
    tier: "basic",
    duration: "6months",
    price: 99,
    currency: "EUR",
    label: "Agents Basic (6 mois)",
    features: ["5 agents", "600 questions", "Économie 15€"],
    limits: { agents: 5, messages: 600 },
  },
  {
    id: "agents_basic_yearly",
    service: "agents",
    tier: "basic",
    duration: "yearly",
    price: 189,
    currency: "EUR",
    label: "Agents Basic (1 an)",
    features: ["5 agents", "1200 questions", "Économie 39€"],
    limits: { agents: 5, messages: 1200 },
  },
  {
    id: "agents_advanced_monthly",
    service: "agents",
    tier: "advanced",
    duration: "monthly",
    price: 39,
    currency: "EUR",
    label: "Agents Advanced",
    features: ["10 agents", "500 questions/mois", "Support prioritaire"],
    limits: { agents: 10, messages: 500 },
  },
  {
    id: "agents_advanced_6months",
    service: "agents",
    tier: "advanced",
    duration: "6months",
    price: 199,
    currency: "EUR",
    label: "Agents Advanced (6 mois)",
    features: ["10 agents", "3000 questions", "Économie 35€"],
    limits: { agents: 10, messages: 3000 },
  },
  {
    id: "agents_advanced_yearly",
    service: "agents",
    tier: "advanced",
    duration: "yearly",
    price: 379,
    currency: "EUR",
    label: "Agents Advanced (1 an)",
    features: ["10 agents", "6000 questions", "Économie 89€"],
    limits: { agents: 10, messages: 6000 },
  },
  {
    id: "agents_vip_monthly",
    service: "agents",
    tier: "vip",
    duration: "monthly",
    price: 79,
    currency: "EUR",
    label: "Agents VIP",
    features: ["14 agents", "Illimité", "Support 24/7"],
    limits: { agents: 14, messages: Infinity },
  },
  {
    id: "agents_vip_6months",
    service: "agents",
    tier: "vip",
    duration: "6months",
    price: 399,
    currency: "EUR",
    label: "Agents VIP (6 mois)",
    features: ["14 agents", "Illimité", "Économie 75€"],
    limits: { agents: 14, messages: Infinity },
  },
  {
    id: "agents_vip_yearly",
    service: "agents",
    tier: "vip",
    duration: "yearly",
    price: 759,
    currency: "EUR",
    label: "Agents VIP (1 an)",
    features: ["14 agents", "Illimité", "Économie 189€"],
    limits: { agents: 14, messages: Infinity },
  },
];

// ═══════════════════════════════════════════════════════════════
// BUILDING
// ═══════════════════════════════════════════════════════════════
export const BUILDING_PLANS: Plan[] = [
  {
    id: "building_basic_monthly",
    service: "building",
    tier: "basic",
    duration: "monthly",
    price: 29,
    currency: "EUR",
    label: "Building Basic",
    features: ["20 sites/mois", "Images IA", "Publication"],
    limits: { sites: 20, images: 100 },
  },
  {
    id: "building_basic_6months",
    service: "building",
    tier: "basic",
    duration: "6months",
    price: 149,
    currency: "EUR",
    label: "Building Basic (6 mois)",
    features: ["120 sites", "Images IA", "Économie 25€"],
    limits: { sites: 120, images: 600 },
  },
  {
    id: "building_basic_yearly",
    service: "building",
    tier: "basic",
    duration: "yearly",
    price: 279,
    currency: "EUR",
    label: "Building Basic (1 an)",
    features: ["240 sites", "Images IA", "Économie 69€"],
    limits: { sites: 240, images: 1200 },
  },
  {
    id: "building_advanced_monthly",
    service: "building",
    tier: "advanced",
    duration: "monthly",
    price: 59,
    currency: "EUR",
    label: "Building Advanced",
    features: ["100 sites/mois", "Images + 3D", "Domaine perso"],
    limits: { sites: 100, images: 500, threeD: 50 },
  },
  {
    id: "building_advanced_6months",
    service: "building",
    tier: "advanced",
    duration: "6months",
    price: 299,
    currency: "EUR",
    label: "Building Advanced (6 mois)",
    features: ["600 sites", "Images + 3D", "Économie 55€"],
    limits: { sites: 600, images: 3000, threeD: 300 },
  },
  {
    id: "building_advanced_yearly",
    service: "building",
    tier: "advanced",
    duration: "yearly",
    price: 559,
    currency: "EUR",
    label: "Building Advanced (1 an)",
    features: ["1200 sites", "Images + 3D", "Économie 149€"],
    limits: { sites: 1200, images: 6000, threeD: 600 },
  },
  {
    id: "building_vip_monthly",
    service: "building",
    tier: "vip",
    duration: "monthly",
    price: 99,
    currency: "EUR",
    label: "Building VIP",
    features: ["Illimité", "Tout inclus + API", "Support 24/7"],
    limits: { sites: Infinity, images: Infinity, threeD: Infinity },
  },
  {
    id: "building_vip_6months",
    service: "building",
    tier: "vip",
    duration: "6months",
    price: 499,
    currency: "EUR",
    label: "Building VIP (6 mois)",
    features: ["Illimité", "Tout inclus", "Économie 95€"],
    limits: { sites: Infinity, images: Infinity, threeD: Infinity },
  },
  {
    id: "building_vip_yearly",
    service: "building",
    tier: "vip",
    duration: "yearly",
    price: 949,
    currency: "EUR",
    label: "Building VIP (1 an)",
    features: ["Illimité", "Tout inclus", "Économie 239€"],
    limits: { sites: Infinity, images: Infinity, threeD: Infinity },
  },
];

// ═══════════════════════════════════════════════════════════════
// CONNECTEURS (annuel uniquement)
// ═══════════════════════════════════════════════════════════════
export const CONNECTORS_PLANS: Plan[] = [
  {
    id: "connectors_basic_yearly",
    service: "connectors",
    tier: "basic",
    duration: "yearly",
    price: 19,
    currency: "EUR",
    label: "Connecteurs Basic",
    features: ["5 connecteurs", "Support email"],
    limits: { connectors: 5 },
  },
  {
    id: "connectors_advanced_yearly",
    service: "connectors",
    tier: "advanced",
    duration: "yearly",
    price: 39,
    currency: "EUR",
    label: "Connecteurs Advanced",
    features: ["10 connecteurs", "Support prioritaire"],
    limits: { connectors: 10 },
  },
  {
    id: "connectors_vip_yearly",
    service: "connectors",
    tier: "vip",
    duration: "yearly",
    price: 79,
    currency: "EUR",
    label: "Connecteurs VIP",
    features: ["Tous les connecteurs", "Webhooks", "Support 24/7"],
    limits: { connectors: Infinity },
  },
];

// ═══════════════════════════════════════════════════════════════
// ENTERPRISE
// ═══════════════════════════════════════════════════════════════
export const ENTERPRISE_PLAN: Plan = {
  id: "enterprise_yearly",
  service: "enterprise",
  tier: "enterprise",
  duration: "yearly",
  price: 10000,
  currency: "USD",
  label: "Enterprise",
  features: [
    "Tout illimité",
    "API dédiée",
    "Agents personnalisés",
    "Support 24/7",
    "SLA 99.9%",
    "Domaine personnalisé",
    "Formation équipe",
  ],
  limits: {
    messages: Infinity,
    images: Infinity,
    sites: Infinity,
    agents: Infinity,
    threeD: Infinity,
    connectors: Infinity,
  },
};

// ═══════════════════════════════════════════════════════════════
// TOUS LES PLANS
// ═══════════════════════════════════════════════════════════════
export const ALL_PLANS: Plan[] = [
  ...CHAT_PLANS,
  ...AGENTS_PLANS,
  ...BUILDING_PLANS,
  ...CONNECTORS_PLANS,
  ENTERPRISE_PLAN,
];

export const PLANS_BY_SERVICE: Record<Service, Plan[]> = {
  chat: CHAT_PLANS,
  agents: AGENTS_PLANS,
  building: BUILDING_PLANS,
  connectors: CONNECTORS_PLANS,
  enterprise: [ENTERPRISE_PLAN],
};

export function getPlanById(id: string): Plan | undefined {
  return ALL_PLANS.find((p) => p.id === id);
}