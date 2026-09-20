// src/lib/appCategories.ts
// ⭐ 100 TYPES D'APPS / OUTILS

export type AppCategory = {
  id: string;
  name: string;
  prompt: string;
  keywords: string[];
};

export const APP_CATEGORIES: AppCategory[] = [
  // ✍️ CONTENU & MARKETING (1-10)
  { id: "script-tiktok", name: "Générateur scripts TikTok", prompt: "Outil pour créer des scripts TikTok/Reels avec hooks, timing, calls-to-action.", keywords: ["tiktok", "reels", "script video"] },
  { id: "article-seo", name: "Rédacteur SEO", prompt: "Rédacteur d'articles de blog optimisés SEO avec structure H1/H2/H3.", keywords: ["seo", "article blog"] },
  { id: "newsletter", name: "Créateur newsletter", prompt: "Créateur de newsletters avec templates, sections, abonnés.", keywords: ["newsletter"] },
  { id: "planificateur-posts", name: "Planificateur réseaux sociaux", prompt: "Calendrier éditorial pour Instagram, LinkedIn, Facebook.", keywords: ["planificateur posts", "calendrier social"] },
  { id: "slogans", name: "Générateur slogans", prompt: "Générateur de noms de marque et slogans avec test disponibilité.", keywords: ["slogan", "nom marque"] },
  { id: "reformulation", name: "Reformulate text", prompt: "Reformuler texte en changeant le ton (formel, casual, drôle, professionnel).", keywords: ["reformuler", "reformulation"] },
  { id: "reponses-avis", name: "Réponses aux avis", prompt: "Générateur de réponses aux avis clients (bons et mauvais).", keywords: ["reponse avis"] },
  { id: "scripts-podcast", name: "Scripts podcast", prompt: "Créateur de scripts pour podcasts avec intro, sections, outro.", keywords: ["podcast"] },
  { id: "viralite", name: "Analyseur viralité", prompt: "Analyser un titre et donner un score de viralité 0-100.", keywords: ["viralite"] },
  { id: "hashtags", name: "Générateur hashtags", prompt: "Générer hashtags + descriptions Instagram optimisés.", keywords: ["hashtags", "instagram"] },

  // 💼 PRODUCTIVITÉ (11-20)
  { id: "crm-pocket", name: "CRM de poche", prompt: "CRM simple : contacts, pipeline, rappels, notes.", keywords: ["crm"] },
  { id: "analyse-contrat", name: "Analyseur contrats", prompt: "Analyser contrats juridiques, surligner clauses à risque.", keywords: ["contrat", "juridique"] },
  { id: "business-plan", name: "Générateur business plan", prompt: "Business plan avec prévisions financières, SWOT, marché.", keywords: ["business plan"] },
  { id: "planificateur-reunions", name: "Planificateur réunions", prompt: "Trouver créneaux communs, organiser réunions, agenda.", keywords: ["reunions", "agenda"] },
  { id: "trieur-emails", name: "Trieur d'emails", prompt: "Trier emails par urgence, spam, priorité.", keywords: ["trieur emails", "email"] },
  { id: "rapports-financiers", name: "Rapports financiers", prompt: "Générer rapports financiers trimestriels, graphiques.", keywords: ["rapport financier"] },
  { id: "facturation", name: "Automatiseur facturation", prompt: "Créer factures, envoyer, relancer impayés.", keywords: ["facturation", "facture"] },
  { id: "fiche-poste", name: "Générateur fiches poste", prompt: "Créer fiches de poste RH avec missions, compétences, salaire.", keywords: ["fiche poste", "rh"] },
  { id: "slides", name: "Créateur de slides", prompt: "Générateur de présentations en slides avec design moderne.", keywords: ["slides", "presentation", "powerpoint"] },
  { id: "onboarding", name: "Assistant onboarding", prompt: "Parcours d'onboarding nouvel employé, checklist, ressources.", keywords: ["onboarding"] },

  // 🎓 ÉDUCATION (21-30)
  { id: "quiz-fiches", name: "Générateur quiz", prompt: "Créer quiz et fiches de révision par sujet.", keywords: ["quiz revision", "fiches"] },
  { id: "tuteur-anglais", name: "Tuteur anglais", prompt: "Tuteur conversationnel anglais, corrections instantanées.", keywords: ["tuteur anglais"] },
  { id: "vulgarisation", name: "Simplificateur concepts", prompt: "Expliquer concepts complexes simplement.", keywords: ["vulgarisation", "simplifier"] },
  { id: "plans-cours", name: "Plans de cours", prompt: "Générateur de plans de cours pour enseignants.", keywords: ["plan de cours"] },
  { id: "exercices-math", name: "Exercices maths", prompt: "Générer exercices de mathématiques avec corrigés.", keywords: ["exercices maths"] },
  { id: "analyse-litteraire", name: "Analyse littéraire", prompt: "Analyse de textes littéraires avec explications.", keywords: ["analyse litteraire"] },
  { id: "examens", name: "Simulateur examens", prompt: "Simuler examens (code de la route, bac, etc.).", keywords: ["examens", "code route"] },
  { id: "histoires-enfants", name: "Histoires pour enfants", prompt: "Créer histoires pour enfants personnalisées avec morale.", keywords: ["histoires enfants"] },
  { id: "correction-copies", name: "Correction copies", prompt: "Aide à la correction de copies avec feedback.", keywords: ["correction copies"] },
  { id: "prise-parole", name: "Coach prise de parole", prompt: "Coach pour prise de parole en public, exercices.", keywords: ["prise de parole"] },

  // 💻 CODE (31-40)
  { id: "code-generator", name: "Générateur de code", prompt: "Générer code HTML/CSS/JS depuis description.", keywords: ["generateur code"] },
  { id: "convertisseur-code", name: "Convertisseur code", prompt: "Convertir code d'un langage à un autre.", keywords: ["convertisseur code"] },
  { id: "debug", name: "Débugueur", prompt: "Trouver et expliquer bugs dans code collé.", keywords: ["debug", "debugueur"] },
  { id: "sql-generator", name: "Générateur SQL", prompt: "Créer requêtes SQL complexes depuis description.", keywords: ["sql"] },
  { id: "regex", name: "Générateur Regex", prompt: "Créer expressions régulières depuis description.", keywords: ["regex"] },
  { id: "doc-code", name: "Documentation code", prompt: "Générer documentation automatique de code.", keywords: ["documentation code"] },
  { id: "mock-api", name: "Mock API", prompt: "Générer fausses API pour tester apps.", keywords: ["mock api"] },
  { id: "security-audit", name: "Audit sécurité", prompt: "Analyser code pour failles de sécurité.", keywords: ["audit securite"] },
  { id: "cloud-archi", name: "Architecture cloud", prompt: "Fiches techniques d'architecture cloud AWS/GCP.", keywords: ["cloud architecture"] },
  { id: "terminal-cmd", name: "Commandes terminal", prompt: "Générateur de commandes Bash/Zsh depuis description.", keywords: ["bash", "terminal"] },

  // 🎨 DESIGN (41-50)
  { id: "logo-generator", name: "Générateur de logos", prompt: "Créer logos et chartes graphiques en SVG.", keywords: ["logo"] },
  { id: "remove-bg", name: "Suppresseur fond", prompt: "Interface pour supprimer fond d'image.", keywords: ["remove background", "supprimer fond"] },
  { id: "upscale", name: "Upscale image", prompt: "Améliorer résolution photo.", keywords: ["upscale", "upscaling"] },
  { id: "voice-over", name: "Voix off", prompt: "Générer voix off avec play/pause (bip simulé).", keywords: ["voix off"] },
  { id: "palette", name: "Palettes couleurs", prompt: "Générer palettes de couleurs à thème.", keywords: ["palette couleurs"] },
  { id: "moodboard", name: "Moodboards", prompt: "Créer moodboards artistiques.", keywords: ["moodboard"] },
  { id: "colorisation", name: "Colorisation photos", prompt: "Interface colorisation automatique de photos.", keywords: ["colorisation"] },
  { id: "prompt-mj", name: "Générateur prompts Midjourney", prompt: "Créer prompts pour Midjourney/DALL-E.", keywords: ["prompt midjourney"] },
  { id: "musique-boucle", name: "Boucles musicales", prompt: "Générer boucles musicales de fond.", keywords: ["boucle musique"] },
  { id: "avatars", name: "Avatars de jeux", prompt: "Générateur d'avatars style jeu vidéo.", keywords: ["avatars"] },

  // 🧘 BIEN-ÊTRE (51-60)
  { id: "plan-repas", name: "Planificateur repas", prompt: "Planifier repas selon frigo, calories, budget.", keywords: ["plan repas", "menu"] },
  { id: "musculation", name: "Programmes musculation", prompt: "Programme musculation personnalisé selon objectifs.", keywords: ["musculation", "fitness"] },
  { id: "meditation", name: "Méditation guidée", prompt: "Session de méditation avec texte + bip.", keywords: ["meditation"] },
  { id: "gratitude", name: "Journal gratitude", prompt: "Journal gratitude interactif avec réponses bienveillantes.", keywords: ["gratitude"] },
  { id: "habits", name: "Habit Tracker", prompt: "Suivi d'habitudes avec rappels motivants.", keywords: ["habits", "habitudes"] },
  { id: "calories", name: "Calculateur calories", prompt: "Suivre calories journalières, objectifs.", keywords: ["calories"] },
  { id: "sommeil", name: "Routines sommeil", prompt: "Générateur routines de sommeil personnalisées.", keywords: ["sommeil"] },
  { id: "stress", name: "Coach stress", prompt: "Exercices de gestion du stress, respiration.", keywords: ["stress"] },
  { id: "randonnee", name: "Itinéraires rando", prompt: "Créer itinéraires de randonnée sur mesure.", keywords: ["randonnee"] },
  { id: "coiffure", name: "Simulateur coiffure", prompt: "Simuler styles de coiffure sur avatar.", keywords: ["coiffure"] },

  // 🌍 VIE QUOTIDIENNE (61-70)
  { id: "voyage", name: "Planificateur voyage", prompt: "Itinéraires jour par jour, hôtels, visites.", keywords: ["voyage", "itineraire"] },
  { id: "recettes", name: "Recettes anti-gaspi", prompt: "Créer recettes avec ingrédients restants.", keywords: ["recettes", "anti gaspi"] },
  { id: "films", name: "Recommandateur films", prompt: "Recommandations films/séries précises.", keywords: ["films", "series"] },
  { id: "personnages", name: "Conversations personnages", prompt: "Discuter avec personnages fictifs.", keywords: ["personnages fictifs"] },
  { id: "enigmes", name: "Chasses au trésor", prompt: "Générer énigmes et chasses au trésor.", keywords: ["chasse tresor"] },
  { id: "traducteur-menu", name: "Traducteur de menus", prompt: "Traduire menus de restaurant instantanément.", keywords: ["traducteur menu"] },
  { id: "courses", name: "Listes courses", prompt: "Créer listes de courses intelligentes.", keywords: ["liste courses"] },
  { id: "invitations", name: "Rédacteur invitations", prompt: "Rédiger mots d'excuses et invitations.", keywords: ["invitation", "excuses"] },
  { id: "activites-meteo", name: "Activités météo", prompt: "Trouver activités selon météo locale.", keywords: ["activites meteo"] },
  { id: "accords-vins", name: "Accords mets-vins", prompt: "Conseils accords mets-vins.", keywords: ["accords vins"] },

  // 🏠 IMMOBILIER (71-80)
  { id: "annonce-immo", name: "Descriptions immo", prompt: "Rédiger descriptions d'annonces immobilières attractives.", keywords: ["annonce immo"] },
  { id: "home-staging", name: "Home staging virtuel", prompt: "Simuler décoration intérieure virtuelle.", keywords: ["home staging"] },
  { id: "travaux", name: "Planificateur travaux", prompt: "Planifier travaux, estimer coûts.", keywords: ["travaux"] },
  { id: "plantes", name: "Assistant plantes", prompt: "Diagnostic plantes par questions.", keywords: ["plantes"] },
  { id: "energie", name: "Optimiseur énergie", prompt: "Optimiser consommation énergétique maison.", keywords: ["energie"] },
  { id: "inventaire", name: "Inventaire maison", prompt: "Inventaire pour assurances, listes.", keywords: ["inventaire"] },
  { id: "bail", name: "Contrats location", prompt: "Générer contrats colocation / bail.", keywords: ["bail"] },
  { id: "petits-espaces", name: "Aménagement petits espaces", prompt: "Conseils pour petits espaces, optimisations.", keywords: ["petit espace"] },
  { id: "menage", name: "Planning ménage", prompt: "Planifier tâches ménagères, répartition.", keywords: ["menage"] },
  { id: "reparation", name: "Réparation électroménager", prompt: "Guide réparation pas-à-pas électroménager.", keywords: ["reparation"] },

  // 🚀 FINANCE (81-90)
  { id: "budget", name: "Suivi budget", prompt: "Suivre budget avec scan reçus fictif, catégories.", keywords: ["budget"] },
  { id: "invest", name: "Simulateur investissement", prompt: "Simuler intérêts composés, portefeuille.", keywords: ["investissement"] },
  { id: "impots", name: "Calculateur impôts", prompt: "Calculer impôts, optimiser fiscalement.", keywords: ["impots"] },
  { id: "crypto-analyse", name: "Analyse whitepapers crypto", prompt: "Analyser whitepapers cryptomonnaies.", keywords: ["crypto", "whitepaper"] },
  { id: "alertes-prix", name: "Alertes prix actifs", prompt: "Alertes prix actions/crypto.", keywords: ["alerte prix"] },
  { id: "fraude", name: "Détecteur fraude", prompt: "Détecter transactions frauduleuses suspectes.", keywords: ["fraude"] },
  { id: "bmc", name: "Business Model Canvas", prompt: "Créer Business Model Canvas complet.", keywords: ["business model canvas", "bmc"] },
  { id: "breakeven", name: "Seuil rentabilité", prompt: "Calculateur de seuil de rentabilité.", keywords: ["breakeven", "seuil rentabilite"] },
  { id: "epargne", name: "Assistant épargne", prompt: "Assistant épargne basé sur habitudes.", keywords: ["epargne"] },
  { id: "pitch-deck", name: "Pitch deck", prompt: "Générateur pitch decks pour lever fonds.", keywords: ["pitch deck"] },

  // 🎯 DIVERS (91-100)
  { id: "notepad", name: "Bloc-notes", prompt: "Bloc-notes avec sauvegarde localStorage.", keywords: ["notepad", "notes"] },
  { id: "calculator", name: "Calculatrice", prompt: "Calculatrice complète avec historique.", keywords: ["calculatrice", "calculator"] },
  { id: "todo", name: "Todo list", prompt: "Todo list avec localStorage, priorités.", keywords: ["todo", "taches"] },
  { id: "timer", name: "Chronomètre / Timer", prompt: "Chronomètre + timer avec tours.", keywords: ["chrono", "timer"] },
  { id: "convert", name: "Convertisseur", prompt: "Convertisseur unités (longueur, poids, température...).", keywords: ["convertisseur"] },
  { id: "password-gen", name: "Générateur mot de passe", prompt: "Générateur mots de passe sécurisés avec indicateur force.", keywords: ["password", "mot de passe"] },
  { id: "meteo", name: "App météo", prompt: "Interface météo (données simulées).", keywords: ["meteo"] },
  { id: "agenda", name: "Agenda", prompt: "Agenda personnel avec événements.", keywords: ["agenda", "calendrier"] },
  { id: "journal", name: "Journal intime", prompt: "Journal personnel avec entrées datées.", keywords: ["journal", "diary"] },
  { id: "idees", name: "Générateur d'idées", prompt: "Générateur d'idées par catégorie (projets, cadeaux, sorties).", keywords: ["idees"] },
];

export function findAppCategory(prompt: string): AppCategory | null {
  const lower = prompt.toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
  for (const a of APP_CATEGORIES) if (lower.includes(a.id.replace(/-/g, " "))) return a;
  for (const a of APP_CATEGORIES) {
    for (const kw of a.keywords) {
      if (lower.includes(kw)) return a;
    }
  }
  const words = lower.split(" ");
  for (const w of words) {
    if (w.length < 3) continue;
    for (const a of APP_CATEGORIES) {
      if (a.name.toLowerCase().includes(w)) return a;
    }
  }
  return null;
}