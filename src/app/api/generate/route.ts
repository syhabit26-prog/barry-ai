import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { deepseek } from "@ai-sdk/deepseek";
import { groq } from "@ai-sdk/groq";
import { google } from "@ai-sdk/google";
import { mistral } from "@ai-sdk/mistral";
import { cohere } from "@ai-sdk/cohere";
import { xai } from "@ai-sdk/xai";
import { togetherai } from "@ai-sdk/togetherai";
import { streamText, generateText } from "ai";
import { detectSiteType, buildSiteConfig, generateImages } from "@/lib/siteTemplates";
import { buildMultiPageSite } from "@/lib/multiPageGenerator";

export const maxDuration = 300;

const BARRY_IDENTITY = `Tu es BARRY AI, un assistant personnel premium créé par Mouhamed Barry.
- Détecte la langue et réponds DANS LA MÊME LANGUE.
- Utilise ## pour les titres, - pour les listes, **gras** pour les points clés.`;

function getModel(provider: string) {
  switch (provider) {
    case "openai": return openai("gpt-4o-mini");
    case "claude": return anthropic("claude-3-5-haiku-20241022");
    case "deepseek": return deepseek("deepseek-chat");
    case "gemini": return google("gemini-2.0-flash-exp");
    case "mistral": return mistral("mistral-large-latest");
    case "cohere": return cohere("command-r-plus");
    case "grok": return xai("grok-beta");
    case "together": return togetherai("meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo");
    case "groq":
    default: return groq("openai/gpt-oss-120b");
  }
}

function extractName(prompt: string): string {
  const m = prompt.match(/(?:nommée?|appelée?|nom)\s+([a-zA-ZÀ-ÿ0-9][a-zA-ZÀ-ÿ0-9\s'-]{1,25})/i);
  if (m) {
    const raw = m[1].replace(/\s+(et|avec|de|du|pour|qui|à|au|le|la|les|des|un|une)\s*.*/i, "").replace(/[^\wÀ-ÿ\s'-]/g, "").trim();
    if (raw.length >= 2) return raw.charAt(0).toUpperCase() + raw.slice(1);
  }
  const cleaned = prompt.replace(/[^\wÀ-ÿ\s]/g, " ").replace(/\b(cree|créer|moi|un|une|des|de|du|d|la|le|les|site|web|page|jeu|jeux|game|app|application|boutique|portfolio|pour|avec|sur|fais|faire|génère|générer|je|veux|souhaite|nommé|nommée|appelé|appelée|qui|s'appelle|et|moderne|sombre|élégant|minimaliste|vibrant|vintage|luxe|rétro)\b/gi, " ").replace(/\s+/g, " ").trim();
  const words = cleaned.split(" ").filter((w) => w.length > 2);
  if (words.length === 0) return "Mon Site";
  const name = words.slice(0, 2).join(" ");
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function getColors(mood: string): { primary: string; secondary: string } {
  const m: Record<string, { primary: string; secondary: string }> = {
    rouge: { primary: "#ef4444", secondary: "#dc2626" },
    bleu: { primary: "#3b82f6", secondary: "#2563eb" },
    vert: { primary: "#22c55e", secondary: "#16a34a" },
    jaune: { primary: "#facc15", secondary: "#f59e0b" },
    violet: { primary: "#a855f7", secondary: "#7c3aed" },
    orange: { primary: "#f97316", secondary: "#ea580c" },
    rose: { primary: "#ec4899", secondary: "#db2777" },
    noir: { primary: "#ffffff", secondary: "#a1a1aa" },
    blanc: { primary: "#1a1a1a", secondary: "#71717a" },
    cyan: { primary: "#06b6d4", secondary: "#0891b2" },
  };
  return m[mood.toLowerCase()] || m.jaune;
}

function detectMode(prompt: string): "dropshipping" | "code" | "chat" {
  const lower = (prompt || "").toLowerCase();
  const shop = ["boutique", "shop", "e-commerce", "dropshipping", "vendre", "catalogue", "panier", "store", "magasin"];
  const code = ["cree", "creer", "genere", "site", "page", "landing", "portfolio", "jeu", "jeux", "game", "app", "application", "banque", "restaurant", "blog", "vitrine", "ecole", "hotel", "avocat", "sante", "cinema", "cinéma"];
  if (shop.some((kw) => lower.includes(kw))) return "dropshipping";
  if (code.some((kw) => lower.includes(kw))) return "code";
  return "chat";
}

function translateToEnglish(keyword: string): string {
  const dict: Record<string, string> = {
    tech: "smartphone", technologie: "smartphone", informatique: "laptop",
    ordinateur: "laptop", ordinateurs: "laptop", ordi: "laptop", pc: "laptop",
    telephone: "smartphone", smartphones: "smartphone", portable: "smartphone",
    gadget: "smartphone", gadgets: "smartphone", electronics: "smartphone",
    tablettes: "tablet", tablette: "tablet", ipad: "tablet",
    claviers: "keyboard", clavier: "keyboard", souris: "mouse",
    casques: "headphones", casque: "headphones", ecouteurs: "earbuds", earbuds: "earbuds",
    enceintes: "speaker", enceinte: "speaker", microphones: "microphone", micro: "microphone",
    drones: "drone", cameras: "camera", camera: "camera", imprimantes: "printer",
    ecrans: "monitor", ecran: "monitor", chargeurs: "charger", chargeur: "charger",
    cables: "cable", cable: "cable",
    bijoux: "jewelry", bijou: "jewelry", bagues: "ring", bague: "ring",
    bracelets: "bracelet", bracelet: "bracelet", colliers: "necklace", collier: "necklace",
    montres: "watch", montre: "watch", "montres connectees": "smartwatch",
    beaute: "cosmetics", beauté: "cosmetics", maquillage: "makeup",
    cosmetiques: "cosmetics", cosmetique: "cosmetics", "soins visage": "skincare",
    "soins cheveux": "haircare", parfums: "perfume", parfum: "perfume",
    ongles: "nail polish", barbe: "beard trimmer",
    mode: "fashion", vetements: "clothing", vêtements: "clothing",
    sneakers: "sneakers", chaussures: "shoes", bottes: "boots", sandales: "sandals",
    casquettes: "cap", chapeaux: "hat", bonnets: "beanie", gants: "gloves",
    echarpes: "scarf", cravates: "tie", polos: "polo", chemises: "shirt",
    pulls: "sweater", sweats: "hoodie", vestes: "jacket", manteaux: "coat",
    jeans: "jeans", pantalons: "pants", shorts: "shorts", chaussettes: "socks",
    slips: "underwear", "sous vetements": "underwear", boxer: "underwear",
    pyjamas: "pajamas", robes: "dress", robe: "dress", jupes: "skirt", jupe: "skirt",
    "t-shirts": "tshirt", tshirt: "tshirt",
    sacs: "handbag", sac: "bag", "sac a dos": "backpack", sacs_dos: "backpack",
    portefeuilles: "wallet", portefeuille: "wallet", valises: "suitcase", valise: "suitcase",
    ceintures: "belt", ceinture: "belt", lunettes: "sunglasses",
    "lunettes soleil": "sunglasses", "lunettes vue": "glasses",
    meubles: "furniture", canapes: "sofa", canape: "sofa", chaises: "chair", chaise: "chair",
    tables: "table", table: "table", lits: "bed", lit: "bed",
    armoires: "wardrobe", armoire: "wardrobe", eclairage: "lamp", lampe: "lamp",
    tapis: "carpet", decoration: "decoration", rideaux: "curtain",
    coussins: "cushion", couvertures: "blanket", draps: "bedding",
    sdb: "bathroom", rangement: "storage", menage: "cleaning",
    cuisine: "kitchen", "robots cuisine": "kitchen appliance", vaisselle: "dishes",
    fromages: "cheese", chocolat: "chocolate", cafe: "coffee", the: "tea",
    vins: "wine", biere: "beer", epicerie: "grocery", snacks: "snack",
    patisserie: "pastry", glaces: "ice cream",
    outils: "tools", perceuses: "drill", jardin: "garden", plantes: "plant",
    sport: "sport", fitness: "fitness", velos: "bicycle", velo: "bicycle",
    natation: "swimming", camping: "camping", peche: "fishing",
    auto: "car accessories", moto: "motorcycle", bebe: "baby",
    jouets: "toys", "jeux societe": "board game", animaux: "pet",
    musique: "music", guitares: "guitar", guitare: "guitar", instruments: "instrument",
    voyage: "travel", livres: "book", papeterie: "stationery", aquarium: "aquarium",
  };
  const lower = keyword.toLowerCase().trim();
  if (dict[lower]) return dict[lower];
  for (const [fr, en] of Object.entries(dict)) {
    if (lower.includes(fr) || fr.includes(lower)) return en;
  }
  return keyword;
}

export async function POST(req: Request) {
  try {
    const body: any = await req.json();
    const { prompt, messages, mode: manualMode, customization, customSystemPrompt, provider } = body;

    const isChat = messages && Array.isArray(messages) && messages.length > 0;
    const dernierMessage = isChat ? messages[messages.length - 1].content : prompt || "";
    const mode = manualMode || detectMode(dernierMessage);
    const selectedProvider = provider || "groq";

    console.log("🎯 Mode:", mode, "| IA:", selectedProvider);

    // CHAT
    if (mode === "chat" || customSystemPrompt) {
      const systemPrompt = customSystemPrompt ? BARRY_IDENTITY + "\n\n" + customSystemPrompt : BARRY_IDENTITY;
      const result = streamText({
        model: getModel(selectedProvider),
        system: systemPrompt,
        messages: isChat ? messages : [{ role: "user", content: dernierMessage }],
      });
      return result.toTextStreamResponse();
    }

    // MODIFY
    if (mode === "modify") {
      const { currentHtml, instruction, uploadedImages } = body;
      if (!currentHtml) return Response.json({ ok: false, error: "Aucun site à modifier" });

      let newHtml = currentHtml;

      if (uploadedImages && uploadedImages.length > 0) {
        const gallery = `<section class="page" id="galerie"><div class="page-inner"><header class="page-header"><span class="page-badge">Galerie</span><h2 class="page-title">Galerie</h2></header><div class="photo-masonry">${uploadedImages.map((url: string, i: number) => `<div class="photo-tile"><img src="${url}" alt="Photo ${i + 1}" /></div>`).join("")}</div></div></section>`;
        newHtml = newHtml.includes('id="galerie"') ? newHtml.replace(/<section[^>]*id="galerie"[\s\S]*?<\/section>/, gallery) : newHtml.replace(/<footer/, gallery + "\n<footer");
        return Response.json({ ok: true, text: newHtml, mode: "modify" });
      }

      const result = await generateText({
        model: getModel(selectedProvider),
        system: `Tu MODIFIES du code HTML. Retourne UNIQUEMENT le HTML complet entre \`\`\`html et \`\`\`.`,
        prompt: `HTML:\n${currentHtml.slice(0, 40000)}\n\nINSTRUCTION: ${instruction}\n\nRetourne HTML complet.`,
      });
      return Response.json({ ok: true, text: result.text, mode: "modify" });
    }

    // CODE
    if (mode === "code") {
      const { findGameCategory } = await import("@/lib/gameCategories");
      const { findAppCategory } = await import("@/lib/appCategories");
      const { findSiteCategory } = await import("@/lib/siteCategories");
      const { generateGameHTML, generateAppHTML, generateSiteHTML } = await import("@/lib/universalGenerator");

      const gameCat = findGameCategory(dernierMessage);
      const appCat = findAppCategory(dernierMessage);
      const siteCat = findSiteCategory(dernierMessage);

      let html = "";
      let siteType = "site";
      let name = "";

           if (gameCat && (!appCat || dernierMessage.toLowerCase().includes("jeu"))) {
        siteType = "game";
        name = gameCat.name;

        // ⭐ 1. Essaie d'abord le template figé (100% jouable)
        const { getGameTemplate } = await import("@/lib/gameTemplates");
        const template = getGameTemplate(gameCat.id);

        if (template) {
          html = template;
          console.log("✅ Template figé:", gameCat.id, "|", html.length, "chars");
        } else {
          // ⭐ 2. Sinon, IA génère
          html = await generateGameHTML(gameCat.name, gameCat.prompt, dernierMessage, selectedProvider);
          console.log("🎮 Jeu généré par IA:", gameCat.id, "|", html.length, "chars");
        }
      } else if (appCat) {
        siteType = "app";
        name = appCat.name;
        html = await generateAppHTML(appCat.name, appCat.prompt, dernierMessage, selectedProvider);

        const { animateHtml, computeSignature } = await import("@/lib/animator");
        const salt = Date.now() + "-" + Math.random().toString(36).slice(2, 8);
        const sig = computeSignature(dernierMessage + "|" + salt);
        html = animateHtml(html, { accentColor: sig.palette.accent });
        console.log("📱 App générée:", appCat.id, "|", html.length, "chars");
      } else if (siteCat) {
        siteType = siteCat.id;
        name = siteCat.name;
        html = await generateSiteHTML(siteCat.name, siteCat.prompt, siteCat.sections, dernierMessage, selectedProvider);

        const { animateHtml, computeSignature } = await import("@/lib/animator");
        const salt = Date.now() + "-" + Math.random().toString(36).slice(2, 8);
        const sig = computeSignature(dernierMessage + "|" + salt);
        html = animateHtml(html, { accentColor: sig.palette.accent });
        console.log("🌐 Site généré:", siteCat.id, "|", html.length, "chars");
      } else {
        siteType = "generic";
        name = extractName(dernierMessage) || "Mon site";
        html = await generateSiteHTML(
          "Site personnalisé",
          "Site web adapté à la demande de l'utilisateur",
          ["Accueil", "Services", "À propos", "Contact"],
          dernierMessage,
          selectedProvider
        );
        const { animateHtml, computeSignature } = await import("@/lib/animator");
        const salt = Date.now() + "-" + Math.random().toString(36).slice(2, 8);
        const sig = computeSignature(dernierMessage + "|" + salt);
        html = animateHtml(html, { accentColor: sig.palette.accent });
      }

      let projectId = null, slug = null;
      try {
        const { supabaseAdmin } = await import("@/lib/supabaseAdmin");
        const { generateSlug } = await import("@/lib/slug");
        slug = generateSlug(name);
        const { data } = await supabaseAdmin
          .from("projects")
          .insert({ name, prompt: dernierMessage, html, slug, published: false })
          .select()
          .single();
        projectId = data?.id;
      } catch {}

      return Response.json({
        ok: true,
        text: "```html\n" + html + "\n```",
        mode: "code",
        projectId,
        slug,
        siteType,
        instant: true,
      });
    }

    // DROPSHIPPING
    if (mode === "dropshipping") {
      const storeName = customization?.storeName || extractName(dernierMessage);

      // On garde la demande de catégorie intacte, mais on retire seulement
      // les mots de commande de boutique. Cela permet de reconnaître les
      // catégories simples ET composées : "chaussures homme", "montres
      // connectées", "sacs à dos", "soins visage", etc.
      const normalizedPrompt = dernierMessage
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s_-]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      const categoryStopWords = [
        "cree", "creer", "genere", "generer", "fais", "faire", "moi",
        "une", "un", "des", "de", "du", "d", "la", "le", "les",
        "boutique", "shop", "store", "magasin", "ecommerce", "e-commerce",
        "en ligne", "pour", "avec", "sur", "dropshipping", "vendre", "veux",
        "je", "j", "souhaite", "veut", "voudrais", "fais-moi", "fais moi",
        "creer moi", "cree moi"
      ];

      let keyword = normalizedPrompt;
      for (const word of categoryStopWords) {
        keyword = keyword.replace(new RegExp(`\\b${word.replace(/[- ]/g, "[ -]")}\\b`, "gi"), " ");
      }
      keyword = keyword.replace(/\s+/g, " ").trim();

      // Les 120+ catégories existantes du projet restent la référence de
      // compréhension. Ici on associe leurs noms à des mots-clés CJ en anglais.
      // Aucun produit de productsDatabase n'est utilisé comme produit boutique.
      const CATEGORY_SEARCH: Record<string, string[]> = {
        sneakers: ["sneakers", "running shoes"],
        chaussures_homme: ["men shoes", "men footwear"],
        chaussures_sport: ["sport shoes", "running shoes"],
        chaussures_femme: ["women shoes", "women footwear"],
        bottes: ["boots"],
        sandales: ["sandals"],
        montres: ["watch"],
        montres_luxe: ["luxury watch", "automatic watch"],
        montres_connectees: ["smart watch", "smartwatch"],
        bijoux: ["jewelry", "jewellery"],
        bracelets: ["bracelet"],
        colliers: ["necklace"],
        bagues: ["ring"],
        boucles_oreilles: ["earrings"],
        sacs: ["bag", "handbag"],
        sacs_dos: ["backpack"],
        sacs_femme: ["women handbag", "women bag"],
        portefeuilles: ["wallet"],
        valises: ["suitcase", "luggage"],
        ceintures: ["belt"],
        lunettes_soleil: ["sunglasses"],
        lunettes_vue: ["eyeglasses", "glasses frames"],
        casquettes: ["cap", "baseball cap"],
        chapeaux: ["hat"],
        bonnets: ["beanie"],
        gants: ["gloves"],
        echarpes: ["scarf"],
        cravates: ["tie"],
        porte_cles: ["keychain", "key ring"],
        t_shirts_homme: ["men t shirt", "t-shirt"],
        polos: ["polo shirt"],
        chemises: ["shirt", "men shirt"],
        pulls: ["sweater"],
        sweats: ["hoodie", "sweatshirt"],
        vestes: ["jacket"],
        manteaux: ["coat", "winter coat"],
        jeans: ["jeans"],
        pantalons: ["pants", "trousers"],
        shorts: ["shorts"],
        maillots_bain: ["swimwear", "swimsuit"],
        chaussettes: ["socks"],
        sous_vetements_homme: ["men underwear", "boxer"],
        slips: ["briefs", "underwear"],
        pyjamas: ["pajamas", "sleepwear"],
        robes: ["dress", "women dress"],
        jupes: ["skirt"],
        smartphones: ["smartphone", "mobile phone"],
        tablettes: ["tablet"],
        ordinateurs: ["laptop", "notebook"],
        claviers: ["keyboard"],
        souris: ["computer mouse"],
        casques_audio: ["headphones"],
        ecouteurs: ["earbuds", "wireless earphones"],
        enceintes: ["bluetooth speaker", "speaker"],
        microphones: ["microphone"],
        webcams: ["webcam"],
        drones: ["drone"],
        cameras: ["camera", "digital camera"],
        imprimantes: ["printer"],
        ecrans: ["monitor", "computer monitor"],
        chargeurs: ["charger", "phone charger"],
        cables: ["usb cable", "charging cable"],
        batteries_externes: ["power bank", "portable charger"],
        coques_tel: ["phone case", "cell phone case"],
        accessoires_pc: ["computer accessories", "laptop accessories"],
        meubles: ["furniture"],
        canapes: ["sofa", "couch"],
        chaises: ["chair", "office chair"],
        tables: ["table"],
        lits: ["bed", "bed frame"],
        armoires: ["wardrobe", "closet"],
        eclairage: ["lamp", "lighting"],
        tapis: ["rug", "carpet"],
        decoration: ["home decoration", "decor"],
        rideaux: ["curtain"],
        coussins: ["cushion", "pillow"],
        couvertures: ["blanket"],
        draps: ["bed sheet", "bedding"],
        sdb: ["bathroom accessories"],
        rangement: ["storage organizer", "storage"],
        menage: ["cleaning supplies", "cleaning"],
        cuisine: ["kitchenware", "kitchen"],
        robots_cuisine: ["kitchen appliance", "kitchen machine"],
        vaisselle: ["tableware", "dinnerware"],
        fromages: ["cheese"],
        chocolat: ["chocolate"],
        cafe: ["coffee"],
        the: ["tea"],
        vins: ["wine"],
        biere: ["beer"],
        epicerie: ["grocery", "food"],
        snacks: ["snacks"],
        patisserie: ["baking supplies", "baking tools"],
        glaces: ["ice cream", "ice cream maker"],
        outils: ["tools", "hand tools"],
        perceuses: ["drill", "cordless drill"],
        jardin: ["garden tools", "gardening"],
        plantes: ["plants", "plant"],
        sport: ["sports equipment", "sport"],
        fitness: ["fitness equipment", "gym equipment"],
        velos: ["bicycle", "bike"],
        auto: ["car accessories", "automotive accessories"],
        bebe: ["baby products", "baby"],
        cosmetiques: ["cosmetics", "makeup"],
        parfums: ["perfume", "fragrance"],
        ongles: ["nail art", "nail polish"],
        soins_cheveux: ["hair care", "haircare"],
        soins_visage: ["skin care", "skincare"],
        barbe: ["beard", "beard trimmer"],
        animaux: ["pet supplies", "pet"],
        jouets: ["toys"],
        jeux_societe: ["board game"],
        musique: ["musical instruments", "music"],
        guitares: ["guitar"],
        instruments: ["musical instrument"],
        voyage: ["travel accessories"],
        livres: ["books", "book"],
        papeterie: ["stationery", "school supplies"],
        natation: ["swimming", "swimming equipment"],
        camping: ["camping gear", "camping"],
        peche: ["fishing", "fishing gear"],
        moto: ["motorcycle accessories", "motorcycle"],
        aquarium: ["aquarium supplies", "aquarium"],
      };

      const CATEGORY_ALIASES: Record<string, string> = {
        chaussure: "chaussures_homme",
        chaussures: "chaussures_homme",
        basket: "sneakers",
        baskets: "sneakers",
        shoe: "sneakers",
        shoes: "sneakers",
        montre: "montres",
        bijoux: "bijoux",
        bijou: "bijoux",
        bracelet: "bracelets",
        collier: "colliers",
        bague: "bagues",
        sac: "sacs",
        sacs: "sacs",
        "sac a dos": "sacs_dos",
        valise: "valises",
        lunettes: "lunettes_soleil",
        casquette: "casquettes",
        chapeau: "chapeaux",
        bonnet: "bonnets",
        gant: "gants",
        echarpe: "echarpes",
        t_shirt: "t_shirts_homme",
        tshirt: "t_shirts_homme",
        "t shirt": "t_shirts_homme",
        chemise: "chemises",
        pull: "pulls",
        sweat: "sweats",
        veste: "vestes",
        manteau: "manteaux",
        jean: "jeans",
        pantalon: "pantalons",
        short: "shorts",
        smartphone: "smartphones",
        telephone: "smartphones",
        tablette: "tablettes",
        ordinateur: "ordinateurs",
        pc: "ordinateurs",
        clavier: "claviers",
        souris: "souris",
        casque: "casques_audio",
        ecouteur: "ecouteurs",
        enceinte: "enceintes",
        micro: "microphones",
        drone: "drones",
        camera: "cameras",
        imprimante: "imprimantes",
        ecran: "ecrans",
        chargeur: "chargeurs",
        cable: "cables",
        meubles: "meubles",
        meuble: "meubles",
        canape: "canapes",
        chaise: "chaises",
        table: "tables",
        lit: "lits",
        armoire: "armoires",
        lampe: "eclairage",
        tapis: "tapis",
        deco: "decoration",
        decoration: "decoration",
        rideau: "rideaux",
        coussin: "coussins",
        couverture: "couvertures",
        drap: "draps",
        cuisine: "cuisine",
        vaisselle: "vaisselle",
        chocolat: "chocolat",
        cafe: "cafe",
        the: "the",
        outils: "outils",
        outil: "outils",
        perceuse: "perceuses",
        jardin: "jardin",
        plante: "plantes",
        sport: "sport",
        fitness: "fitness",
        muscu: "fitness",
        musculation: "fitness",
        velo: "velos",
        voiture: "auto",
        auto: "auto",
        bebe: "bebe",
        bébé: "bebe",
        maquillage: "cosmetiques",
        beaute: "cosmetiques",
        beauté: "cosmetiques",
        parfum: "parfums",
        ongles: "ongles",
        cheveux: "soins_cheveux",
        visage: "soins_visage",
        barbe: "barbe",
        animaux: "animaux",
        animal: "animaux",
        chien: "animaux",
        chat: "animaux",
        jouet: "jouets",
        musique: "musique",
        guitare: "guitares",
        voyage: "voyage",
        livre: "livres",
        papeterie: "papeterie",
        natation: "natation",
        camping: "camping",
        peche: "peche",
        pêche: "peche",
        moto: "moto",
        aquarium: "aquarium",
      };

      function normalizeCategory(value: string): string {
        return value
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[_-]+/g, " ")
          .replace(/\s+/g, " ")
          .trim();
      }

      function detectCJSearchTerms(value: string): string[] {
        const normalized = normalizeCategory(value);
        const terms: string[] = [];

        // 1. Cherche une catégorie composée exacte.
        const categoryKeys = Object.keys(CATEGORY_SEARCH);
        for (const key of categoryKeys) {
          const readable = normalizeCategory(key);
          if (normalized.includes(readable)) {
            terms.push(...CATEGORY_SEARCH[key]);
          }
        }

        // 2. Cherche un alias exact ou présent dans la demande.
        for (const [alias, category] of Object.entries(CATEGORY_ALIASES)) {
          const a = normalizeCategory(alias);
          if (normalized === a || normalized.includes(a)) {
            terms.push(...(CATEGORY_SEARCH[category] || []));
          }
        }

        // 3. Quelques combinaisons importantes pour ne pas perdre le mot
        // "homme", "femme", "sport", etc.
        if (/chaussures?\s+(homme|men)/i.test(normalized)) terms.unshift("men shoes");
        if (/chaussures?\s+(femme|women)/i.test(normalized)) terms.unshift("women shoes");
        if (/montres?\s+(connect|smart)/i.test(normalized)) terms.unshift("smartwatch");
        if (/sacs?\s+(a\s+dos|dos|backpack)/i.test(normalized)) terms.unshift("backpack");
        if (/(soins?|produits?)\s+cheveux/i.test(normalized)) terms.unshift("hair care");
        if (/(soins?|produits?)\s+(du\s+)?visage/i.test(normalized)) terms.unshift("skincare");
        if (/sous\s+vetements?/i.test(normalized)) terms.unshift("underwear");
        if (/jeux?\s+de\s+societe/i.test(normalized)) terms.unshift("board game");
        if (/accessoires?\s+(pc|ordinateur)/i.test(normalized)) terms.unshift("computer accessories");
        if (/accessoires?\s+(telephone|smartphone)/i.test(normalized)) terms.unshift("phone accessories");

        // 4. Si aucune catégorie précise n'a été détectée, on envoie les
        // mots significatifs à CJ. On ne fabrique jamais un produit.
        if (terms.length === 0) {
          const ignored = new Set([
            "homme", "femme", "pour", "avec", "ligne", "boutique", "shop",
            "store", "magasin", "produit", "produits", "premium", "moderne",
            "luxe", "online", "en", "dans", "sur"
          ]);
          const words = normalized.split(/\s+/).filter((w) => w.length >= 3 && !ignored.has(w));
          if (words.length > 0) terms.push(words.slice(0, 3).join(" "));
        }

        return [...new Set(terms.map((t) => t.trim()).filter(Boolean))].slice(0, 5);
      }

      const searchTerms = detectCJSearchTerms(keyword);
      const primarySearch = searchTerms[0] || translateToEnglish(keyword);

      const { computeSignature } = await import("@/lib/animator");
      const uniqueSalt = Date.now() + "-" + Math.random().toString(36).slice(2, 10);
      const signature = computeSignature(dernierMessage + "|" + keyword + "|" + uniqueSalt);

      const colorKey = customization?.color;
      const color = colorKey
        ? getColors(typeof colorKey === "string" ? colorKey : colorKey?.name || "jaune")
        : { primary: signature.palette.accent, secondary: signature.palette.accent2 };

      console.log("🌐 Recherche CJ:", keyword, "→", searchTerms);

      let products: any[] = [];

      try {
        const { getCJAccessToken } = await import("@/lib/cj");
        const token = await getCJAccessToken();
        const headers = {
          "CJ-Access-Token": token,
          "Accept": "application/json",
        };

        // CJ documente listV2 comme l'endpoint de recherche recommandé.
        // La réponse contient productList[], et chaque produit contient
        // simultanément son id, son nameEn et son bigImage.
        // On utilise donc le nom + l'image du MÊME objet CJ.
        for (const term of searchTerms) {
          if (products.length >= 20) break;

          const params = new URLSearchParams({
            page: "1",
            size: "20",
            keyWord: term,
            sort: "desc",
            orderBy: "0",
          });
          params.append("features", "enable_description");
          params.append("features", "enable_category");

          const searchUrl = `https://developers.cjdropshipping.com/api2.0/v1/product/listV2?${params.toString()}`;
          const searchRes = await fetch(searchUrl, { headers, cache: "no-store" });
          const searchData = await searchRes.json();

          if (searchData?.code !== 200) {
            console.warn("⚠️ CJ recherche:", term, searchData?.message || searchData?.code);
            continue;
          }

          const groups = Array.isArray(searchData?.data?.content) ? searchData.data.content : [];
          const candidates = groups.flatMap((group: any) =>
            Array.isArray(group?.productList) ? group.productList : []
          );

          console.log(`🔎 CJ "${term}": ${candidates.length} résultats`);

          for (const p of candidates) {
            if (products.length >= 20) break;

            const pid = String(p?.id || "").trim();
            const productName = String(p?.nameEn || "").trim();
            const productImage = String(p?.bigImage || "").trim();

            // Conditions strictes : pas de produit sans PID, nom ou image.
            if (!pid || !productName || !/^https?:\/\//i.test(productImage)) continue;

            // On évite les doublons quand plusieurs termes de recherche
            // correspondent au même produit CJ.
            if (products.some((existing) => existing.id === pid)) continue;

            const salePrice = Number(p?.nowPrice);
            const regularPrice = Number(p?.sellPrice);
            const basePrice = Number.isFinite(salePrice) && salePrice > 0
              ? salePrice
              : Number.isFinite(regularPrice) && regularPrice > 0
                ? regularPrice
                : 0;

            if (!basePrice || basePrice <= 0) continue;

            products.push({
              id: pid,
              // Le PID reste celui du produit CJ. Le VID sera récupéré plus
              // tard par le flux panier si nécessaire.
              vid: "",
              name: productName,
              description: String(p?.description || `${productName} - produit disponible sur CJ Dropshipping`).slice(0, 150),
              price: Math.max(Math.round(basePrice * 1.7 * 100) / 100, 9.99),
              oldPrice: Math.round(basePrice * 2.1 * 100) / 100,
              image: productImage,
              rating: 4.5 + Math.random() * 0.4,
              reviews: 50 + Math.floor(Math.random() * 500),
              badge: ["BEST-SELLER", "NOUVEAU", "PROMO", "TOP"][products.length % 4],
              sku: String(p?.sku || p?.spu || "").trim(),
              category: keyword,
              cjPid: pid,
              cjCategory: p?.threeCategoryName || p?.twoCategoryName || p?.oneCategoryName || "",
            });
          }
        }

        console.log("✅ CJ produits exploitables:", products.length);
      } catch (e) {
        console.warn("⚠️ CJ recherche échouée:", e);
      }

      // Aucun fallback local : la boutique ne doit contenir que des produits
      // réellement retournés par CJ.
      if (products.length === 0) {
        return Response.json({
          ok: false,
          error: `CJ Dropshipping n'a trouvé aucun produit correspondant à « ${keyword || primarySearch} » avec un nom et une image valides.`,
          mode: "dropshipping",
          productCount: 0,
          searchTerms,
        });
      }

      let videos: string[] = [];
      try {
        const { searchVideos } = await import("@/lib/pexels");
        videos = await searchVideos(primarySearch, 5);
        if (videos.length < 3) {
          const more = await searchVideos("luxury product cinematic", 3);
          videos = [...videos, ...more];
        }
      } catch {}

      const { buildDropshippingSite } = await import("@/lib/dropshippingTemplate");
      const html = buildDropshippingSite(
        storeName,
        "Découvrez notre collection exclusive",
        keyword || primarySearch,
        color,
        customization?.mood?.name || "moderne",
        signature.animStyle,
        products,
        { extraVideos: videos },
        signature
      );

      console.log("🎉 Boutique:", html.length, "chars |", products.length, "produits CJ");

      let projectId = null, slug = null;
      try {
        const { supabaseAdmin } = await import("@/lib/supabaseAdmin");
        const { generateSlug } = await import("@/lib/slug");
        slug = generateSlug(storeName);
        const { data } = await supabaseAdmin
          .from("projects")
          .insert({ name: storeName, prompt: dernierMessage, html, slug, published: false })
          .select()
          .single();
        projectId = data?.id;
      } catch {}

      return Response.json({
        ok: true,
        text: "```html\n" + html + "\n```",
        mode: "dropshipping",
        projectId,
        slug,
        productCount: products.length,
        palette: color.primary,
        anim: signature.animStyle,
        instant: true,
      });
    }

    return Response.json({ ok: false, error: "Mode inconnu" }, { status: 400 });
  } catch (err: any) {
    console.error("❌", err);
    return Response.json({ ok: false, error: err?.message || String(err) }, { status: 500 });
  }
}