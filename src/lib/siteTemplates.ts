export type SiteType =
  | "vitrine" | "restaurant" | "portfolio" | "startup" | "agence"
  | "ecole" | "sante" | "immobilier" | "voyage" | "sport"
  | "tech" | "avocat" | "hotel" | "banque" | "association"
  | "jeu" | "app";

export type Animation = "fade" | "slide" | "zoom" | "float" | "gradient";

export type SiteContent = {
  hero: { title: string; subtitle: string; cta: string };
  stats: { value: string; label: string }[];
  services: { icon: string; title: string; desc: string }[];
  testimonials: { name: string; role: string; text: string; avatar: string }[];
  faq: { q: string; a: string }[];
  cta: { title: string; subtitle: string; button: string };
};

export type SiteConfig = {
  type: SiteType;
  name: string;
  tagline: string;
  color: { primary: string; secondary: string };
  mood: string;
  pages: string[];
  content: SiteContent;
  animations: Animation[];
  has3D: boolean;
  hasContact: boolean;
};

export function detectSiteType(prompt: string): SiteType {
  const t = prompt.toLowerCase();

  // Priorité haute : jeu et app
  if (/jeu|jeux|game|snake|pong|tetris|arcade|puzzle|memory|plateforme|platformer/i.test(t)) return "jeu";
  if (/application|appli|\bapp\b|logiciel|outil|calculatrice|todo|timer|convertisseur|gestionnaire/i.test(t)) return "app";

  // Priorité moyenne : métiers
  if (/resto|restaurant|café|pizzeria|food|cuisine|traiteur|boulangerie/i.test(t)) return "restaurant";
  if (/portfolio|photographe|artiste|designer|graphiste|illustrateur/i.test(t)) return "portfolio";
  if (/startup|saas|logiciel|plateforme|scale/i.test(t)) return "startup";
  if (/agence|marketing|communication|pub|créatif/i.test(t)) return "agence";
  if (/école|ecole|lycée|université|formation|cours|étudiant|académie/i.test(t)) return "ecole";
  if (/santé|sante|médecin|clinique|hôpital|dentiste|pharmacie|kiné/i.test(t)) return "sante";
  if (/immobilier|appartement|maison|villa|agence immo|bien/i.test(t)) return "immobilier";
  if (/voyage|tourisme|destination|travel|séjour/i.test(t)) return "voyage";
  if (/sport|fitness|gym|coach|muscu|yoga|crossfit/i.test(t)) return "sport";
  if (/tech|informatique|développeur|software|intelligence artificielle/i.test(t)) return "tech";
  if (/avocat|juridique|cabinet|notaire|droit/i.test(t)) return "avocat";
  if (/hotel|hôtel|chambre|suite|resort|spa/i.test(t)) return "hotel";
  if (/banque|finance|assurance|crédit|investissement|épargne/i.test(t)) return "banque";
  if (/association|ong|fondation|humanitaire|charité|bénévolat/i.test(t)) return "association";

  return "vitrine";
}

export function getPagesForType(type: SiteType): string[] {
  switch (type) {
    case "jeu": return ["Accueil", "Jouer", "Scores", "Règles", "Contact"];
    case "app": return ["Accueil", "Fonctionnalités", "Tarifs", "Télécharger", "Contact"];
    case "restaurant": return ["Accueil", "Menu", "À propos", "Galerie", "Contact"];
    case "portfolio": return ["Accueil", "Projets", "À propos", "Services", "Contact"];
    case "startup": return ["Accueil", "Produit", "Tarifs", "À propos", "Contact"];
    case "agence": return ["Accueil", "Services", "Réalisations", "Équipe", "Contact"];
    case "ecole": return ["Accueil", "Formations", "Admissions", "Vie scolaire", "Contact"];
    case "sante": return ["Accueil", "Services", "Équipe", "RDV", "Contact"];
    case "immobilier": return ["Accueil", "Biens", "Estimation", "À propos", "Contact"];
    case "voyage": return ["Accueil", "Destinations", "Offres", "À propos", "Contact"];
    case "sport": return ["Accueil", "Cours", "Coachs", "Tarifs", "Contact"];
    case "tech": return ["Accueil", "Solutions", "Technologies", "Équipe", "Contact"];
    case "avocat": return ["Accueil", "Domaines", "Équipe", "Actualités", "Contact"];
    case "hotel": return ["Accueil", "Chambres", "Services", "Restaurant", "Contact"];
    case "banque": return ["Accueil", "Particuliers", "Entreprises", "Agences", "Contact"];
    case "association": return ["Accueil", "Missions", "Projets", "Faire un don", "Contact"];
    default: return ["Accueil", "Services", "À propos", "Galerie", "Contact"];
  }
}

function getContent(type: SiteType): SiteContent {
  const map: Record<SiteType, SiteContent> = {
    // ═══ JEU ═══
    jeu: {
      hero: { title: "L'aventure commence ici", subtitle: "Un jeu captivant qui vous tiendra en haleine pendant des heures", cta: "Commencer à jouer" },
      stats: [
        { value: "10k+", label: "Joueurs actifs" },
        { value: "4.9", label: "Note moyenne" },
        { value: "24/7", label: "En ligne" },
        { value: "100%", label: "Gratuit" },
      ],
      services: [
        { icon: "🎮", title: "Gameplay fluide", desc: "Contrôles réactifs, 60 FPS constants" },
        { icon: "🏆", title: "Classement mondial", desc: "Affrontez les meilleurs joueurs" },
        { icon: "🎯", title: "Défis quotidiens", desc: "De nouveaux challenges chaque jour" },
        { icon: "🎨", title: "Graphismes HD", desc: "Visuels modernes et soignés" },
        { icon: "📱", title: "Mobile & PC", desc: "Jouable partout, sur tous appareils" },
        { icon: "👥", title: "Multijoueur", desc: "Jouez avec vos amis en ligne" },
      ],
      testimonials: [
        { name: "Alex", role: "Top 10 mondial", text: "Le meilleur jeu auquel j'ai joué depuis des années !", avatar: "https://i.pravatar.cc/150?img=13" },
        { name: "Sarah", role: "Streamer", text: "Addictif, fun, parfait pour streamer.", avatar: "https://i.pravatar.cc/150?img=17" },
        { name: "Karim", role: "Casual", text: "Parfait pour se détendre après le boulot.", avatar: "https://i.pravatar.cc/150?img=52" },
      ],
      faq: [
        { q: "C'est gratuit ?", a: "Oui, 100% gratuit avec options cosmétiques." },
        { q: "Sur quelle plateforme ?", a: "Navigateur, iOS et Android." },
        { q: "Multijoueur ?", a: "Oui, jusqu'à 8 joueurs simultanés." },
      ],
      cta: { title: "Prêt à jouer ?", subtitle: "Rejoignez 10 000+ joueurs", button: "Jouer maintenant" },
    },

    // ═══ APP ═══
    app: {
      hero: { title: "Simplifiez votre quotidien", subtitle: "L'application tout-en-un qui transforme votre façon de travailler", cta: "Essayer gratuitement" },
      stats: [
        { value: "50k+", label: "Téléchargements" },
        { value: "4.8/5", label: "Note App Store" },
        { value: "iOS + Android", label: "Disponible" },
        { value: "100%", label: "Gratuit" },
      ],
      services: [
        { icon: "⚡", title: "Ultra rapide", desc: "Performance optimale sur tous appareils" },
        { icon: "🎨", title: "Interface intuitive", desc: "Simple, élégante et efficace" },
        { icon: "🔒", title: "Sécurisé", desc: "Vos données chiffrées de bout en bout" },
        { icon: "☁️", title: "Synchronisation", desc: "Sur tous vos appareils en temps réel" },
        { icon: "🌙", title: "Mode sombre", desc: "Confort visuel jour et nuit" },
        { icon: "🤝", title: "Support 24/7", desc: "Une équipe toujours disponible" },
      ],
      testimonials: [
        { name: "Thomas", role: "Utilisateur Premium", text: "Cette app change ma vie au quotidien.", avatar: "https://i.pravatar.cc/150?img=3" },
        { name: "Élodie", role: "Utilisatrice", text: "Simple, rapide, efficace. Rien à redire.", avatar: "https://i.pravatar.cc/150?img=10" },
        { name: "Marc", role: "Nouveau", text: "Je ne peux plus m'en passer !", avatar: "https://i.pravatar.cc/150?img=21" },
      ],
      faq: [
        { q: "Gratuit ?", a: "Oui, avec options premium disponibles." },
        { q: "Plateformes ?", a: "iOS, Android et Web." },
        { q: "Mes données ?", a: "Chiffrées et sécurisées en Europe." },
      ],
      cta: { title: "Téléchargez maintenant", subtitle: "Disponible sur toutes les plateformes", button: "Télécharger gratuitement" },
    },

    // ═══ RESTAURANT ═══
    restaurant: {
      hero: { title: "Saveurs authentiques", subtitle: "Cuisine raffinée dans un cadre chaleureux", cta: "Réserver une table" },
      stats: [
        { value: "15+", label: "Années" },
        { value: "50k+", label: "Clients" },
        { value: "4.9", label: "Note" },
        { value: "30+", label: "Plats signature" },
      ],
      services: [
        { icon: "🍝", title: "Cuisine maison", desc: "Produits frais sélectionnés chaque matin" },
        { icon: "🍷", title: "Cave à vins", desc: "200+ références françaises et internationales" },
        { icon: "👨‍🍳", title: "Chef passionné", desc: "20 ans d'expérience dans les meilleures maisons" },
        { icon: "🎉", title: "Événements", desc: "Privatisation pour vos occasions spéciales" },
        { icon: "🚚", title: "Livraison", desc: "Rapide à domicile ou au bureau" },
        { icon: "🌱", title: "Options végé", desc: "Plats végétariens, vegan et sans gluten" },
      ],
      testimonials: [
        { name: "Marie Dubois", role: "Cliente fidèle", text: "Le meilleur restaurant de la ville ! Les pâtes sont incroyables.", avatar: "https://i.pravatar.cc/150?img=1" },
        { name: "Jean Martin", role: "Critique gastronomique", text: "Expérience culinaire mémorable. Service impeccable.", avatar: "https://i.pravatar.cc/150?img=12" },
        { name: "Sophie Laurent", role: "Cliente", text: "Cadre magnifique et plats savoureux. Je recommande !", avatar: "https://i.pravatar.cc/150?img=5" },
      ],
      faq: [
        { q: "Faut-il réserver ?", a: "Recommandé le week-end, walk-ins acceptés en semaine." },
        { q: "Options végétariennes ?", a: "Oui, plus de 15 plats végé disponibles." },
        { q: "Livraison ?", a: "Rayon de 10 km autour du restaurant." },
      ],
      cta: { title: "Réservez votre table", subtitle: "Vivez une expérience culinaire inoubliable", button: "Réserver maintenant" },
    },

    // ═══ PORTFOLIO ═══
    portfolio: {
      hero: { title: "Créations uniques", subtitle: "Design & développement sur mesure", cta: "Voir mes projets" },
      stats: [
        { value: "120+", label: "Projets" },
        { value: "8 ans", label: "Expérience" },
        { value: "45+", label: "Clients" },
        { value: "12", label: "Prix" },
      ],
      services: [
        { icon: "🎨", title: "Design UI/UX", desc: "Interfaces modernes, intuitives et élégantes" },
        { icon: "💻", title: "Développement web", desc: "Sites rapides et performants" },
        { icon: "📱", title: "Apps mobiles", desc: "iOS et Android natifs" },
        { icon: "🖌️", title: "Identité visuelle", desc: "Logos et chartes graphiques" },
        { icon: "📸", title: "Direction artistique", desc: "Conseil créatif pour vos projets" },
        { icon: "🚀", title: "Stratégie produit", desc: "Accompagnement de A à Z" },
      ],
      testimonials: [
        { name: "Thomas B.", role: "CEO StartupXYZ", text: "Travail exceptionnel ! Notre site a triplé nos conversions.", avatar: "https://i.pravatar.cc/150?img=13" },
        { name: "Julie P.", role: "Fondatrice", text: "Créatif, réactif et professionnel.", avatar: "https://i.pravatar.cc/150?img=9" },
        { name: "Marc R.", role: "Directeur artistique", text: "Résultats impeccables, à recommander.", avatar: "https://i.pravatar.cc/150?img=15" },
      ],
      faq: [
        { q: "Délais moyen ?", a: "3 à 4 semaines pour un projet complet." },
        { q: "Travail à distance ?", a: "Oui, avec des clients partout dans le monde." },
        { q: "Maintenance ?", a: "Forfaits mensuels disponibles." },
      ],
      cta: { title: "Discutons de votre projet", subtitle: "Transformons vos idées en réalité", button: "Démarrer un projet" },
    },

    // ═══ STARTUP ═══
    startup: {
      hero: { title: "Scalez sans limites", subtitle: "La plateforme tout-en-un pour votre croissance", cta: "Essayer gratuitement" },
      stats: [
        { value: "10k+", label: "Utilisateurs" },
        { value: "99.9%", label: "Uptime" },
        { value: "50M+", label: "Requêtes/jour" },
        { value: "4.9/5", label: "Satisfaction" },
      ],
      services: [
        { icon: "⚡", title: "Ultra rapide", desc: "Performance optimale garantie" },
        { icon: "🔒", title: "Sécurisé", desc: "Chiffrement de bout en bout" },
        { icon: "📊", title: "Analytics", desc: "Tableaux de bord temps réel" },
        { icon: "🔌", title: "Intégrations", desc: "100+ connecteurs natifs" },
        { icon: "🌍", title: "Global", desc: "Disponible dans 190 pays" },
        { icon: "🤝", title: "Support 24/7", desc: "Une équipe toujours disponible" },
      ],
      testimonials: [
        { name: "Alexandre M.", role: "CTO TechCorp", text: "-60% de coûts après migration.", avatar: "https://i.pravatar.cc/150?img=3" },
        { name: "Camille D.", role: "Product Manager", text: "Produit excellent et équipe à l'écoute.", avatar: "https://i.pravatar.cc/150?img=10" },
        { name: "Lucas G.", role: "Founder", text: "100 à 100k users sans souci.", avatar: "https://i.pravatar.cc/150?img=17" },
      ],
      faq: [
        { q: "Plan gratuit ?", a: "Oui, 10k requêtes/mois incluses." },
        { q: "Facturation ?", a: "Mensuelle ou annuelle, sans engagement." },
        { q: "SLA ?", a: "99.9% sur les plans Pro et Enterprise." },
      ],
      cta: { title: "Prêt à scaler ?", subtitle: "Rejoignez 10 000+ entreprises", button: "Commencer" },
    },

    // ═══ AGENCE ═══
    agence: {
      hero: { title: "Votre partenaire digital", subtitle: "Stratégie, design et développement", cta: "Découvrir nos services" },
      stats: [
        { value: "250+", label: "Projets livrés" },
        { value: "15", label: "Experts" },
        { value: "98%", label: "Clients fidèles" },
        { value: "10", label: "Prix reçus" },
      ],
      services: [
        { icon: "🎯", title: "Stratégie digitale", desc: "Analyse et planification" },
        { icon: "🎨", title: "Design créatif", desc: "Création premium" },
        { icon: "💻", title: "Développement", desc: "Solutions sur mesure" },
        { icon: "📱", title: "Mobile", desc: "Apps iOS et Android" },
        { icon: "📈", title: "Marketing", desc: "Growth et acquisition" },
        { icon: "🤝", title: "Conseil", desc: "Accompagnement stratégique" },
      ],
      testimonials: [
        { name: "Paul Lefèvre", role: "CEO", text: "Une agence qui comprend vraiment nos besoins.", avatar: "https://i.pravatar.cc/150?img=8" },
        { name: "Emma Wilson", role: "CMO", text: "Résultats au-delà de nos attentes.", avatar: "https://i.pravatar.cc/150?img=20" },
        { name: "David Chen", role: "Product Owner", text: "Équipe talentueuse et très pro.", avatar: "https://i.pravatar.cc/150?img=11" },
      ],
      faq: [
        { q: "Comment démarrer ?", a: "Premier échange gratuit pour cerner vos besoins." },
        { q: "Tarifs ?", a: "Sur devis selon complexité du projet." },
        { q: "Startups ?", a: "Offres adaptées disponibles." },
      ],
      cta: { title: "Lançons votre projet", subtitle: "Discutons de vos objectifs", button: "Prendre contact" },
    },

    // ═══ ECOLE ═══
    ecole: {
      hero: { title: "Formez-vous pour l'avenir", subtitle: "Formations d'excellence reconnues par l'État", cta: "Voir les formations" },
      stats: [
        { value: "2000+", label: "Étudiants formés" },
        { value: "95%", label: "Taux de réussite" },
        { value: "40+", label: "Formations" },
        { value: "25", label: "Enseignants" },
      ],
      services: [
        { icon: "📚", title: "BTS & Licence", desc: "Formations diplômantes" },
        { icon: "💼", title: "Alternance", desc: "Formation en entreprise" },
        { icon: "🎓", title: "Master", desc: "Spécialisations haut niveau" },
        { icon: "🌐", title: "International", desc: "Échanges à l'étranger" },
        { icon: "💻", title: "Formation continue", desc: "Pour les professionnels" },
        { icon: "🏆", title: "Certifications", desc: "Reconnues par l'État" },
      ],
      testimonials: [
        { name: "Sarah Lambert", role: "Diplômée 2024", text: "Une école qui m'a ouvert toutes les portes.", avatar: "https://i.pravatar.cc/150?img=25" },
        { name: "Karim Benali", role: "Étudiant", text: "Les profs sont excellents et disponibles.", avatar: "https://i.pravatar.cc/150?img=33" },
        { name: "Léa Moreau", role: "Alumni", text: "Formation de qualité, réseau solide.", avatar: "https://i.pravatar.cc/150?img=24" },
      ],
      faq: [
        { q: "Comment s'inscrire ?", a: "Candidature en ligne sur notre site." },
        { q: "Bourses ?", a: "Plusieurs aides disponibles." },
        { q: "Alternance ?", a: "Oui, dans la plupart des cursus." },
      ],
      cta: { title: "Rejoignez-nous", subtitle: "Inscriptions ouvertes pour la rentrée", button: "Candidater" },
    },

    // ═══ SANTE ═══
    sante: {
      hero: { title: "Votre santé, notre priorité", subtitle: "Des soins de qualité dans un cadre moderne", cta: "Prendre rendez-vous" },
      stats: [
        { value: "15k+", label: "Patients suivis" },
        { value: "20", label: "Spécialistes" },
        { value: "24/7", label: "Urgences" },
        { value: "4.9/5", label: "Satisfaction" },
      ],
      services: [
        { icon: "🩺", title: "Médecine générale", desc: "Consultations et suivi" },
        { icon: "❤️", title: "Cardiologie", desc: "Diagnostic et traitement" },
        { icon: "🦷", title: "Dentaire", desc: "Soins et esthétique" },
        { icon: "👶", title: "Pédiatrie", desc: "Soins des enfants" },
        { icon: "🔬", title: "Analyses", desc: "Laboratoire intégré" },
        { icon: "🚑", title: "Urgences", desc: "Prise en charge rapide" },
      ],
      testimonials: [
        { name: "Isabelle Roy", role: "Patiente", text: "Équipe exceptionnelle, très à l'écoute.", avatar: "https://i.pravatar.cc/150?img=28" },
        { name: "Pierre Dumont", role: "Patient", text: "Prise en charge rapide et efficace.", avatar: "https://i.pravatar.cc/150?img=14" },
        { name: "Nadia Cherif", role: "Patiente", text: "Personnel attentionné et locaux impeccables.", avatar: "https://i.pravatar.cc/150?img=44" },
      ],
      faq: [
        { q: "Prendre RDV ?", a: "En ligne, par téléphone ou sur place." },
        { q: "Mutuelle ?", a: "Nous sommes conventionnés." },
        { q: "Urgences ?", a: "Service d'urgences 24/7." },
      ],
      cta: { title: "Prenez soin de vous", subtitle: "Nos équipes vous accueillent", button: "Prendre RDV" },
    },

    // ═══ IMMOBILIER ═══
    immobilier: {
      hero: { title: "Trouvez votre bien idéal", subtitle: "Achat, vente et location immobilière", cta: "Voir les biens" },
      stats: [
        { value: "500+", label: "Biens vendus" },
        { value: "15 ans", label: "Expérience" },
        { value: "98%", label: "Clients satisfaits" },
        { value: "30", label: "Agents experts" },
      ],
      services: [
        { icon: "🏠", title: "Achat", desc: "Trouvez votre maison de rêve" },
        { icon: "💰", title: "Vente", desc: "Estimation gratuite" },
        { icon: "🔑", title: "Location", desc: "Locations longue durée" },
        { icon: "📊", title: "Estimation", desc: "Valeur de votre bien" },
        { icon: "🏗️", title: "Neuf", desc: "Programmes neufs" },
        { icon: "💼", title: "Investissement", desc: "Conseil patrimonial" },
      ],
      testimonials: [
        { name: "Philippe Roux", role: "Vendeur", text: "Bien vendu en 3 semaines au prix demandé.", avatar: "https://i.pravatar.cc/150?img=52" },
        { name: "Caroline Mercier", role: "Acheteuse", text: "Accompagnement parfait de A à Z.", avatar: "https://i.pravatar.cc/150?img=45" },
        { name: "François Blanc", role: "Investisseur", text: "Conseils avisés pour mon premier investissement.", avatar: "https://i.pravatar.cc/150?img=18" },
      ],
      faq: [
        { q: "Estimation gratuite ?", a: "Oui, sans engagement." },
        { q: "Délai de vente ?", a: "45 jours en moyenne." },
        { q: "Honoraires ?", a: "3% TTC du prix de vente." },
      ],
      cta: { title: "Votre projet immobilier", subtitle: "Notre équipe vous accompagne", button: "Nous contacter" },
    },

    // ═══ VOYAGE ═══
    voyage: {
      hero: { title: "Explorez le monde", subtitle: "Des voyages uniques et sur mesure", cta: "Voir les destinations" },
      stats: [
        { value: "100+", label: "Destinations" },
        { value: "10k+", label: "Voyageurs" },
        { value: "4.9/5", label: "Satisfaction" },
        { value: "20 ans", label: "D'expérience" },
      ],
      services: [
        { icon: "🏖️", title: "Plages paradisiaques", desc: "Séjours balnéaires" },
        { icon: "🏔️", title: "Montagne", desc: "Aventure et randonnée" },
        { icon: "🏛️", title: "Culture", desc: "Voyages historiques" },
        { icon: "🎿", title: "Sports d'hiver", desc: "Stations de ski" },
        { icon: "🚢", title: "Croisières", desc: "Voyages en mer" },
        { icon: "🌴", title: "Safaris", desc: "Aventure africaine" },
      ],
      testimonials: [
        { name: "Nathalie Girard", role: "Voyageuse", text: "Voyage organisé au top !", avatar: "https://i.pravatar.cc/150?img=47" },
        { name: "Olivier Petit", role: "Client", text: "Souvenirs inoubliables en famille.", avatar: "https://i.pravatar.cc/150?img=33" },
        { name: "Céline Moreau", role: "Voyageuse", text: "Équipe à l'écoute, prestations de qualité.", avatar: "https://i.pravatar.cc/150?img=42" },
      ],
      faq: [
        { q: "Sur-mesure ?", a: "Oui, voyages personnalisés." },
        { q: "Quand réserver ?", a: "3-6 mois à l'avance." },
        { q: "Assurance ?", a: "Annulation incluse." },
      ],
      cta: { title: "Prêt à partir ?", subtitle: "Réservez votre prochaine aventure", button: "Réserver" },
    },

    // ═══ SPORT ═══
    sport: {
      hero: { title: "Dépassez vos limites", subtitle: "Coaching sportif personnalisé", cta: "Commencer" },
      stats: [
        { value: "5k+", label: "Membres" },
        { value: "20+", label: "Coachs" },
        { value: "15", label: "Salles" },
        { value: "4.9/5", label: "Note" },
      ],
      services: [
        { icon: "💪", title: "Musculation", desc: "Programmes personnalisés" },
        { icon: "🧘", title: "Yoga", desc: "Détente et souplesse" },
        { icon: "🥊", title: "Boxe", desc: "Cardio et technique" },
        { icon: "🚴", title: "Cycling", desc: "Cours collectifs" },
        { icon: "🏃", title: "Running", desc: "Préparation course" },
        { icon: "🥗", title: "Nutrition", desc: "Conseils alimentaires" },
      ],
      testimonials: [
        { name: "Antoine Dubois", role: "Membre", text: "-15kg en 6 mois ! Merci l'équipe.", avatar: "https://i.pravatar.cc/150?img=51" },
        { name: "Laura Martin", role: "Membre", text: "Coachs motivants et bienveillants.", avatar: "https://i.pravatar.cc/150?img=48" },
        { name: "Julien Roux", role: "Membre", text: "Ambiance au top, résultats au rendez-vous.", avatar: "https://i.pravatar.cc/150?img=56" },
      ],
      faq: [
        { q: "Essai gratuit ?", a: "7 jours d'essai offerts." },
        { q: "Niveau requis ?", a: "Tous niveaux bienvenus." },
        { q: "Cours collectifs ?", a: "50+ cours par semaine." },
      ],
      cta: { title: "Transformez-vous", subtitle: "Rejoignez la communauté", button: "S'inscrire" },
    },

    // ═══ TECH ═══
    tech: {
      hero: { title: "L'innovation à portée de main", subtitle: "Solutions technologiques sur mesure", cta: "Nos solutions" },
      stats: [
        { value: "500+", label: "Projets" },
        { value: "50", label: "Ingénieurs" },
        { value: "10", label: "Brevets" },
        { value: "15 ans", label: "D'expérience" },
      ],
      services: [
        { icon: "🤖", title: "Intelligence Artificielle", desc: "Modèles sur mesure" },
        { icon: "☁️", title: "Cloud", desc: "Infrastructure scalable" },
        { icon: "📱", title: "Applications", desc: "iOS et Android" },
        { icon: "🔒", title: "Cybersécurité", desc: "Protection avancée" },
        { icon: "📊", title: "Data", desc: "Analyse et BI" },
        { icon: "🔗", title: "Blockchain", desc: "Solutions Web3" },
      ],
      testimonials: [
        { name: "Stéphane Lemoine", role: "CTO", text: "Expertise technique impressionnante.", avatar: "https://i.pravatar.cc/150?img=60" },
        { name: "Alice Garnier", role: "Product Lead", text: "Livraison à temps et au-delà des attentes.", avatar: "https://i.pravatar.cc/150?img=44" },
        { name: "Hugo Martin", role: "Founder", text: "Un vrai partenaire technologique.", avatar: "https://i.pravatar.cc/150?img=57" },
      ],
      faq: [
        { q: "Méthode agile ?", a: "Oui, livraisons continues." },
        { q: "Support ?", a: "24/7 sur les contrats Enterprise." },
        { q: "Délais ?", a: "Variables selon la complexité du projet." },
      ],
      cta: { title: "Digitalisons ensemble", subtitle: "Discutons de votre projet tech", button: "Nous contacter" },
    },

    // ═══ AVOCAT ═══
    avocat: {
      hero: { title: "Défendre vos droits", subtitle: "Cabinet d'avocats à votre écoute", cta: "Consulter" },
      stats: [
        { value: "1000+", label: "Dossiers traités" },
        { value: "20", label: "Avocats" },
        { value: "95%", label: "Victoires" },
        { value: "30 ans", label: "D'expérience" },
      ],
      services: [
        { icon: "⚖️", title: "Droit des affaires", desc: "Entreprises et sociétés" },
        { icon: "👨‍👩‍👧", title: "Droit de la famille", desc: "Divorce, garde d'enfants" },
        { icon: "🏢", title: "Droit du travail", desc: "Litiges salariés-employeurs" },
        { icon: "🚗", title: "Droit routier", desc: "Accidents et infractions" },
        { icon: "🏠", title: "Droit immobilier", desc: "Litiges et transactions" },
        { icon: "📝", title: "Droit fiscal", desc: "Optimisation et défense" },
      ],
      testimonials: [
        { name: "Client satisfait", role: "Particulier", text: "Défendu avec brio. Merci au cabinet.", avatar: "https://i.pravatar.cc/150?img=8" },
        { name: "SARL ABC", role: "Entreprise", text: "Conseils précieux et réactivité exemplaire.", avatar: "https://i.pravatar.cc/150?img=15" },
        { name: "Marie D.", role: "Cliente", text: "Écoute et professionnalisme au rendez-vous.", avatar: "https://i.pravatar.cc/150?img=25" },
      ],
      faq: [
        { q: "1er RDV gratuit ?", a: "Oui, premier entretien offert." },
        { q: "Honoraires ?", a: "Sur devis, adaptés à chaque dossier." },
        { q: "Partout en France ?", a: "Oui, nous intervenons partout." },
      ],
      cta: { title: "Besoin d'un avocat ?", subtitle: "Défendons vos intérêts ensemble", button: "Prendre RDV" },
    },

    // ═══ HOTEL ═══
    hotel: {
      hero: { title: "L'excellence hôtelière", subtitle: "Un séjour inoubliable vous attend", cta: "Réserver" },
      stats: [
        { value: "5★", label: "Classement" },
        { value: "150", label: "Chambres" },
        { value: "20", label: "Suites" },
        { value: "4.9/5", label: "Satisfaction" },
      ],
      services: [
        { icon: "🛏️", title: "Chambres", desc: "Confort et élégance" },
        { icon: "🍽️", title: "Restaurant", desc: "Gastronomie étoilée" },
        { icon: "💆", title: "Spa", desc: "Détente absolue" },
        { icon: "🏊", title: "Piscine", desc: "Intérieure et extérieure" },
        { icon: "🎉", title: "Événements", desc: "Salles de réception" },
        { icon: "🚗", title: "Conciergerie", desc: "Service personnalisé" },
      ],
      testimonials: [
        { name: "Robert Wilson", role: "Voyageur", text: "Séjour exceptionnel, service 5 étoiles.", avatar: "https://i.pravatar.cc/150?img=68" },
        { name: "Isabelle Laurent", role: "Cliente", text: "Chambres magnifiques et personnel adorable.", avatar: "https://i.pravatar.cc/150?img=49" },
        { name: "Carlos Rodriguez", role: "Touriste", text: "Un des meilleurs hôtels où j'ai séjourné.", avatar: "https://i.pravatar.cc/150?img=63" },
      ],
      faq: [
        { q: "Petit-déjeuner ?", a: "Buffet inclus dans tous les tarifs." },
        { q: "Parking ?", a: "Voiturier disponible 24/7." },
        { q: "Animaux ?", a: "Acceptés sur demande préalable." },
      ],
      cta: { title: "Réservez votre séjour", subtitle: "Vivez une expérience unique", button: "Réserver" },
    },

    // ═══ BANQUE ═══
    banque: {
      hero: { title: "Votre partenaire financier", subtitle: "Des solutions bancaires sur mesure", cta: "Découvrir" },
      stats: [
        { value: "500k+", label: "Clients" },
        { value: "200", label: "Agences" },
        { value: "50 ans", label: "D'expérience" },
        { value: "A+", label: "Notation" },
      ],
      services: [
        { icon: "💳", title: "Comptes", desc: "Courants et épargne" },
        { icon: "🏦", title: "Crédits", desc: "Immobilier, auto, conso" },
        { icon: "📈", title: "Investissement", desc: "Bourse et assurance-vie" },
        { icon: "💼", title: "Entreprises", desc: "Solutions professionnelles" },
        { icon: "📱", title: "App mobile", desc: "Banque en ligne" },
        { icon: "🔐", title: "Sécurité", desc: "Protection maximale" },
      ],
      testimonials: [
        { name: "Client Premium", role: "Particulier", text: "Conseiller disponible et compétent.", avatar: "https://i.pravatar.cc/150?img=12" },
        { name: "SARL XYZ", role: "Entreprise", text: "Solutions adaptées à notre taille.", avatar: "https://i.pravatar.cc/150?img=18" },
        { name: "Client fidèle", role: "Particulier", text: "30 ans que je suis chez eux, jamais déçu.", avatar: "https://i.pravatar.cc/150?img=51" },
      ],
      faq: [
        { q: "Ouvrir un compte ?", a: "En ligne en 10 minutes ou en agence." },
        { q: "Frais ?", a: "0€ sur les opérations courantes." },
        { q: "Crédits ?", a: "À partir de 0,99% TAEG." },
      ],
      cta: { title: "Rejoignez-nous", subtitle: "Ouvrez votre compte en ligne", button: "Ouvrir un compte" },
    },

    // ═══ ASSOCIATION ═══
    association: {
      hero: { title: "Ensemble, agissons", subtitle: "Chaque don compte pour notre mission", cta: "Faire un don" },
      stats: [
        { value: "50k+", label: "Bénéficiaires" },
        { value: "30", label: "Pays" },
        { value: "1000+", label: "Bénévoles" },
        { value: "20 ans", label: "D'action" },
      ],
      services: [
        { icon: "🌍", title: "Missions internationales", desc: "Aide humanitaire" },
        { icon: "📚", title: "Éducation", desc: "Accès à l'école" },
        { icon: "🏥", title: "Santé", desc: "Soins pour tous" },
        { icon: "💧", title: "Eau potable", desc: "Accès à l'eau" },
        { icon: "🌱", title: "Environnement", desc: "Protection planète" },
        { icon: "🤝", title: "Urgence", desc: "Aide humanitaire" },
      ],
      testimonials: [
        { name: "Donateur régulier", role: "Membre", text: "Confiance totale en leur travail.", avatar: "https://i.pravatar.cc/150?img=22" },
        { name: "Bénévole", role: "Terrain", text: "Une équipe dévouée et efficace.", avatar: "https://i.pravatar.cc/150?img=28" },
        { name: "Partenaire", role: "Entreprise", text: "Fiers de soutenir cette association.", avatar: "https://i.pravatar.cc/150?img=58" },
      ],
      faq: [
        { q: "Utilisation des dons ?", a: "85% directement sur le terrain." },
        { q: "Bénévolat ?", a: "Inscription en ligne." },
        { q: "Déductibles ?", a: "Oui, à 66% des impôts." },
      ],
      cta: { title: "Soutenez notre mission", subtitle: "Chaque geste compte", button: "Faire un don" },
    },

    // ═══ VITRINE (défaut) ═══
    vitrine: {
      hero: { title: "Solutions professionnelles", subtitle: "Un partenaire de confiance pour votre réussite", cta: "Découvrir" },
      stats: [
        { value: "500+", label: "Clients" },
        { value: "20 ans", label: "D'expérience" },
        { value: "98%", label: "Satisfaction" },
        { value: "15", label: "Experts" },
      ],
      services: [
        { icon: "🎯", title: "Conseil", desc: "Expertise personnalisée" },
        { icon: "⚡", title: "Réactivité", desc: "Service rapide" },
        { icon: "🤝", title: "Partenariat", desc: "Relation durable" },
        { icon: "📈", title: "Résultats", desc: "Performance garantie" },
        { icon: "🔒", title: "Confiance", desc: "Transparence totale" },
        { icon: "🌍", title: "Portée", desc: "Présence internationale" },
      ],
      testimonials: [
        { name: "Client satisfait", role: "Particulier", text: "Service impeccable et rapide.", avatar: "https://i.pravatar.cc/150?img=3" },
        { name: "Société ABC", role: "Entreprise", text: "Un partenaire fiable depuis des années.", avatar: "https://i.pravatar.cc/150?img=15" },
        { name: "Client régulier", role: "Client", text: "Toujours au top, rien à redire.", avatar: "https://i.pravatar.cc/150?img=45" },
      ],
      faq: [
        { q: "Comment vous contacter ?", a: "Par téléphone, email ou sur place." },
        { q: "Horaires ?", a: "Du lundi au samedi, 9h-19h." },
        { q: "À distance ?", a: "Oui, partout en France." },
      ],
      cta: { title: "Travaillons ensemble", subtitle: "Discutons de votre projet", button: "Nous contacter" },
    },
  };

  return map[type] || map.vitrine;
}

export function buildSiteConfig(
  prompt: string,
  name: string,
  tagline: string,
  color: { primary: string; secondary: string },
  mood: string
): SiteConfig {
  const type = detectSiteType(prompt);
  const pages = getPagesForType(type);
  const content = getContent(type);

  const all: Animation[] = ["fade", "slide", "zoom", "float", "gradient"];
  const shuffled = [...all].sort(() => Math.random() - 0.5);
  const animations = shuffled.slice(0, 3);

  const has3D = /moderne|vibrant|élégant|tech|premium/i.test(mood) ||
                type === "tech" || type === "startup" || type === "portfolio";
  const hasContact = pages.includes("Contact");

  return { type, name, tagline, color, mood, pages, content, animations, has3D, hasContact };
}

export function generateImages(type: SiteType, count: number): string[] {
  const themes: Record<SiteType, string[]> = {
    jeu: ["gaming setup", "video game screen", "arcade", "esports", "gamer"],
    app: ["smartphone app", "mobile technology", "app interface", "digital", "mobile"],
    restaurant: ["gourmet food", "restaurant interior", "chef cooking", "italian dish", "dessert"],
    portfolio: ["creative workspace", "design mockup", "designer tools", "artwork", "studio"],
    startup: ["modern office", "tech team", "startup meeting", "dashboard", "innovation"],
    agence: ["agency office", "team meeting", "creative space", "brainstorm", "design studio"],
    ecole: ["classroom", "students", "campus", "library", "graduation"],
    sante: ["clinic", "doctor", "medical", "hospital", "healthcare"],
    immobilier: ["modern house", "apartment", "interior design", "villa", "architecture"],
    voyage: ["beach", "mountain", "city travel", "tropical", "destination"],
    sport: ["gym workout", "fitness", "training", "athlete", "yoga"],
    tech: ["technology", "server", "developer", "innovation", "AI"],
    avocat: ["law office", "legal books", "courtroom", "lawyer", "justice"],
    hotel: ["hotel room", "lobby", "pool", "spa", "suite"],
    banque: ["bank", "finance", "advisor", "business meeting", "corporate"],
    association: ["volunteers", "charity", "community", "helping", "social"],
    vitrine: ["business", "team", "office", "meeting", "professional"],
  };

  const pool = themes[type] || themes.vitrine;
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    const p = pool[i % pool.length];
    const seed = Math.floor(Math.random() * 99999) + i;
    result.push(`https://image.pollinations.ai/prompt/${encodeURIComponent(p)}?width=800&height=600&nologo=true&seed=${seed}`);
  }
  return result;
}

export const ANIMATIONS_CSS = `
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: translateY(60px); } to { opacity: 1; transform: translateY(0); } }
@keyframes zoomIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
@keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
@keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
@keyframes pageIn { from { opacity: 0; transform: translateY(20px); filter: blur(6px); } to { opacity: 1; transform: translateY(0); filter: blur(0); } }

.anim-fade { animation: fadeIn 1.4s cubic-bezier(0.16, 1, 0.3, 1) both; }
.anim-slide { animation: slideUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) both; }
.anim-zoom { animation: zoomIn 1.1s cubic-bezier(0.16, 1, 0.3, 1) both; }
.anim-float { animation: float 5s ease-in-out infinite; }
.anim-gradient { animation: gradientShift 12s ease infinite; background-size: 200% 200%; }
.page-transition { animation: pageIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) both; }

.reveal {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: opacity, transform;
}
.reveal.visible { opacity: 1; transform: translateY(0); }

.hover-lift {
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.5s ease;
}
.hover-lift:hover { transform: translateY(-8px); box-shadow: 0 24px 50px rgba(0,0,0,0.25); }

.cards-grid .card:nth-child(1) { transition-delay: 0.05s; }
.cards-grid .card:nth-child(2) { transition-delay: 0.10s; }
.cards-grid .card:nth-child(3) { transition-delay: 0.15s; }
.cards-grid .card:nth-child(4) { transition-delay: 0.20s; }
.cards-grid .card:nth-child(5) { transition-delay: 0.25s; }
.cards-grid .card:nth-child(6) { transition-delay: 0.30s; }

html { scroll-behavior: smooth; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
`;