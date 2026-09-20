// src/lib/siteCategories.ts
// ⭐ 100 TYPES DE SITES

export type SiteCategory = {
  id: string;
  name: string;
  prompt: string;
  keywords: string[];
  sections: string[];
};

export const SITE_CATEGORIES: SiteCategory[] = [
  // 🍽️ HOSPITALITÉ (1-10)
  { id: "restaurant", name: "Restaurant", prompt: "Site de restaurant avec menu, réservation, chef, avis", keywords: ["restaurant", "cuisine", "bistrot"], sections: ["Menu", "Réservation", "Notre Chef", "Galerie", "Avis"] },
  { id: "cafe", name: "Café", prompt: "Site de café avec boissons, ambiance, événements", keywords: ["cafe", "coffee"], sections: ["Menu", "Ambiance", "Événements", "Contact"] },
  { id: "pizzeria", name: "Pizzeria", prompt: "Pizzeria avec menu, livraison, commande en ligne", keywords: ["pizzeria", "pizza"], sections: ["Menu", "Commander", "Livraison", "Avis"] },
  { id: "hotel", name: "Hôtel", prompt: "Site d'hôtel avec chambres, réservation, services", keywords: ["hotel"], sections: ["Chambres", "Réservation", "Services", "Restaurant", "Contact"] },
  { id: "bar", name: "Bar / Lounge", prompt: "Bar avec cocktails, événements, ambiance", keywords: ["bar", "lounge"], sections: ["Cocktails", "Événements", "Réservation", "Galerie"] },
  { id: "food-truck", name: "Food Truck", prompt: "Food truck avec menu, localisation, événements", keywords: ["food truck"], sections: ["Menu", "Où nous trouver", "Événements"] },
  { id: "patisserie", name: "Pâtisserie", prompt: "Pâtisserie avec gâteaux, commandes, ateliers", keywords: ["patisserie"], sections: ["Créations", "Commander", "Ateliers", "Contact"] },
  { id: "traiteur", name: "Traiteur", prompt: "Service traiteur avec menus événements", keywords: ["traiteur"], sections: ["Services", "Menus", "Événements", "Devis"] },
  { id: "boulangerie", name: "Boulangerie", prompt: "Boulangerie avec pains, viennoiseries, horaires", keywords: ["boulangerie", "pain"], sections: ["Produits", "Horaires", "Contact"] },
  { id: "brasserie", name: "Brasserie artisanale", prompt: "Brasserie avec bières artisanales, visites", keywords: ["brasserie", "biere"], sections: ["Bières", "Visites", "Boutique", "Contact"] },

  // 💼 BUSINESS (11-20)
  { id: "banque", name: "Banque", prompt: "Site bancaire avec comptes, cartes, crédits, conseils", keywords: ["banque", "banking"], sections: ["Comptes", "Cartes", "Crédits", "Épargne", "Contact"] },
  { id: "avocat", name: "Cabinet d'avocats", prompt: "Cabinet d'avocats avec domaines, équipe, contact", keywords: ["avocat", "cabinet"], sections: ["Domaines", "Équipe", "Honoraires", "Contact"] },
  { id: "comptable", name: "Expert-comptable", prompt: "Cabinet comptable avec services, honoraires", keywords: ["comptable", "expert"], sections: ["Services", "Honoraires", "Équipe", "Contact"] },
  { id: "agence-immo", name: "Agence immobilière", prompt: "Agence immobilière avec biens, vente, location", keywords: ["agence immobiliere", "immo"], sections: ["Biens", "Vente", "Location", "Estimation", "Contact"] },
  { id: "assurance", name: "Assurance", prompt: "Comparateur d'assurances avec devis en ligne", keywords: ["assurance"], sections: ["Types", "Devis", "Tarifs", "Contact"] },
  { id: "consultant", name: "Consultant", prompt: "Consultant avec expertise, références, contact", keywords: ["consultant"], sections: ["Expertise", "Références", "Tarifs", "Contact"] },
  { id: "agence-marketing", name: "Agence marketing", prompt: "Agence avec services, portfolio, tarifs", keywords: ["agence marketing"], sections: ["Services", "Réalisations", "Tarifs", "Contact"] },
  { id: "agence-web", name: "Agence web", prompt: "Agence web avec services, projets, tarifs", keywords: ["agence web"], sections: ["Services", "Projets", "Process", "Tarifs", "Contact"] },
  { id: "startup", name: "Startup", prompt: "Landing startup SaaS avec features, pricing", keywords: ["startup", "saas"], sections: ["Fonctionnalités", "Pricing", "Témoignages", "Contact"] },
  { id: "pme", name: "PME", prompt: "Site PME avec présentation, services, équipe", keywords: ["pme", "entreprise"], sections: ["Présentation", "Services", "Équipe", "Contact"] },

  // 🎨 PORTFOLIO (21-30)
  { id: "portfolio-photographe", name: "Portfolio photographe", prompt: "Portfolio photographe avec galerie, projets", keywords: ["portfolio photographe", "photographe"], sections: ["Galerie", "Projets", "À propos", "Contact"] },
  { id: "portfolio-designer", name: "Portfolio designer", prompt: "Portfolio designer avec projets, compétences", keywords: ["portfolio designer"], sections: ["Projets", "Compétences", "À propos", "Contact"] },
  { id: "portfolio-dev", name: "Portfolio développeur", prompt: "Portfolio dev avec projets, stack technique", keywords: ["portfolio developpeur"], sections: ["Projets", "Stack", "Expérience", "Contact"] },
  { id: "portfolio-artiste", name: "Portfolio artiste", prompt: "Portfolio artiste avec œuvres, expositions", keywords: ["portfolio artiste"], sections: ["Œuvres", "Expositions", "Biographie", "Contact"] },
  { id: "portfolio-musician", name: "Portfolio musicien", prompt: "Portfolio musicien avec albums, tournées", keywords: ["portfolio musicien"], sections: ["Albums", "Tournées", "Bio", "Contact"] },
  { id: "portfolio-video", name: "Portfolio vidéaste", prompt: "Portfolio vidéaste avec films, showreel", keywords: ["portfolio videaste"], sections: ["Films", "Showreel", "Services", "Contact"] },
  { id: "portfolio-architecte", name: "Portfolio architecte", prompt: "Portfolio architecte avec projets, plans", keywords: ["portfolio architecte"], sections: ["Projets", "Processus", "Équipe", "Contact"] },
  { id: "portfolio-illustrateur", name: "Portfolio illustrateur", prompt: "Portfolio illustrateur avec créations", keywords: ["portfolio illustrateur"], sections: ["Créations", "Style", "À propos", "Contact"] },
  { id: "freelance", name: "Site freelance", prompt: "Site freelance avec services, tarifs, portfolio", keywords: ["freelance"], sections: ["Services", "Tarifs", "Portfolio", "Contact"] },
  { id: "cv-avocat", name: "CV en ligne", prompt: "CV en ligne moderne avec expériences", keywords: ["cv en ligne"], sections: ["Expérience", "Formation", "Compétences", "Contact"] },

  // 🏥 SANTÉ (31-40)
  { id: "medecin", name: "Cabinet médical", prompt: "Cabinet médical avec spécialités, prise RDV", keywords: ["medecin", "cabinet medical"], sections: ["Spécialités", "Prise RDV", "Équipe", "Contact"] },
  { id: "dentiste", name: "Dentiste", prompt: "Cabinet dentaire avec soins, tarifs, RDV", keywords: ["dentiste"], sections: ["Soins", "Tarifs", "Équipe", "RDV"] },
  { id: "kine", name: "Kinésithérapeute", prompt: "Cabinet kiné avec soins, RDV", keywords: ["kine", "kinesitherapeute"], sections: ["Soins", "Équipe", "RDV", "Contact"] },
  { id: "psy", name: "Psychologue", prompt: "Cabinet psychologie avec approches, RDV", keywords: ["psychologue", "psy"], sections: ["Approches", "Tarifs", "RDV", "Contact"] },
  { id: "veterinaire", name: "Vétérinaire", prompt: "Cabinet vétérinaire avec services, urgences", keywords: ["veterinaire"], sections: ["Services", "Urgences", "Équipe", "Contact"] },
  { id: "pharmacie", name: "Pharmacie", prompt: "Pharmacie avec services, garde, horaires", keywords: ["pharmacie"], sections: ["Services", "Garde", "Horaires", "Contact"] },
  { id: "opticien", name: "Opticien", prompt: "Opticien avec lunettes, marques, RDV", keywords: ["opticien"], sections: ["Lunettes", "Marques", "RDV", "Contact"] },
  { id: "coiffeur", name: "Salon de coiffure", prompt: "Salon avec prestations, RDV, galerie", keywords: ["coiffeur", "coiffure"], sections: ["Prestations", "RDV", "Galerie", "Tarifs"] },
  { id: "spa", name: "Spa", prompt: "Spa avec soins, forfaits, réservation", keywords: ["spa"], sections: ["Soins", "Forfaits", "Réservation", "Contact"] },
  { id: "salle-sport", name: "Salle de sport", prompt: "Salle de sport avec cours, abonnements", keywords: ["salle de sport", "gym"], sections: ["Cours", "Abonnements", "Coachs", "Planning"] },

  // 🎓 ÉDUCATION (41-50)
  { id: "ecole", name: "École", prompt: "École avec classes, programmes, inscription", keywords: ["ecole"], sections: ["Classes", "Programmes", "Inscription", "Équipe"] },
  { id: "universite", name: "Université", prompt: "Université avec facultés, cursus, recherche", keywords: ["universite"], sections: ["Facultés", "Cursus", "Recherche", "Campus"] },
  { id: "formation", name: "Centre de formation", prompt: "Centre avec formations, sessions, inscription", keywords: ["formation", "centre"], sections: ["Formations", "Sessions", "Inscription", "Contact"] },
  { id: "cours-particulier", name: "Cours particuliers", prompt: "Cours particuliers avec matières, tarifs, RDV", keywords: ["cours particuliers", "soutien"], sections: ["Matières", "Tarifs", "Professeurs", "Contact"] },
  { id: "auto-ecole", name: "Auto-école", prompt: "Auto-école avec forfaits, code, conduite", keywords: ["auto ecole"], sections: ["Forfaits", "Code", "Conduite", "Inscription"] },
  { id: "langue", name: "École de langue", prompt: "École de langues avec cours, niveaux", keywords: ["ecole langue", "langues"], sections: ["Langues", "Niveaux", "Cours", "Contact"] },
  { id: "musique-ecole", name: "École de musique", prompt: "École de musique avec instruments, cours", keywords: ["ecole musique"], sections: ["Instruments", "Cours", "Professeurs", "Contact"] },
  { id: "danse", name: "École de danse", prompt: "École de danse avec styles, cours", keywords: ["danse", "ecole danse"], sections: ["Styles", "Cours", "Planning", "Contact"] },
  { id: "art-ecole", name: "École d'art", prompt: "École d'art avec ateliers, expositions", keywords: ["ecole art"], sections: ["Ateliers", "Expositions", "Professeurs", "Contact"] },
  { id: "cuisine-ecole", name: "École de cuisine", prompt: "Cours de cuisine avec ateliers, chefs", keywords: ["ecole cuisine"], sections: ["Cours", "Chefs", "Ateliers", "Inscription"] },

  // 🎉 LOISIRS & ÉVÉNEMENTS (51-60)
  { id: "mariage", name: "Organisation mariage", prompt: "Wedding planner avec services, galerie", keywords: ["mariage", "wedding"], sections: ["Services", "Galerie", "Témoignages", "Contact"] },
  { id: "photographe-mariage", name: "Photographe mariage", prompt: "Photographe mariage avec portfolio", keywords: ["photographe mariage"], sections: ["Portfolio", "Formules", "Contact"] },
  { id: "dj", name: "DJ événements", prompt: "DJ avec prestations, galerie, devis", keywords: ["dj", "musicien mariage"], sections: ["Prestations", "Galerie", "Avis", "Contact"] },
  { id: "traiteur-mariage", name: "Traiteur mariage", prompt: "Traiteur mariage avec menus, devis", keywords: ["traiteur mariage"], sections: ["Menus", "Formules", "Galerie", "Devis"] },
  { id: "salle-reception", name: "Salle de réception", prompt: "Salle de réception avec photos, capacités", keywords: ["salle reception"], sections: ["Photos", "Capacités", "Formules", "Contact"] },
  { id: "organisateur", name: "Organisateur événements", prompt: "Organisateur avec services, événements passés", keywords: ["organisateur"], sections: ["Services", "Événements", "Contact"] },
  { id: "escape-game", name: "Escape game", prompt: "Escape game avec salles, thèmes, réservation", keywords: ["escape game"], sections: ["Salles", "Thèmes", "Réservation", "Tarifs"] },
  { id: "parc-loisirs", name: "Parc de loisirs", prompt: "Parc avec attractions, tarifs, plan", keywords: ["parc loisirs"], sections: ["Attractions", "Tarifs", "Plan", "Contact"] },
  { id: "cinema", name: "Cinéma", prompt: "Cinéma avec séances, films, réservation", keywords: ["cinema"], sections: ["Films", "Séances", "Tarifs", "Réservation"] },
  { id: "theatre", name: "Théâtre", prompt: "Théâtre avec pièces, programmation", keywords: ["theatre"], sections: ["Programme", "Pièces", "Tarifs", "Réservation"] },

  // 🛒 E-COMMERCE & BOUTIQUES (61-70)
  { id: "boutique-mode", name: "Boutique mode", prompt: "Boutique mode avec catalogue, panier", keywords: ["boutique mode", "vetements"], sections: ["Catalogue", "Collections", "Panier", "Contact"] },
  { id: "bijouterie", name: "Bijouterie", prompt: "Bijouterie avec collections, panier", keywords: ["bijouterie", "bijoux"], sections: ["Collections", "Créations", "Panier", "Contact"] },
  { id: "librairie", name: "Librairie", prompt: "Librairie avec livres, nouveautés, commande", keywords: ["librairie"], sections: ["Nouveautés", "Rayons", "Commande", "Contact"] },
  { id: "fleuriste", name: "Fleuriste", prompt: "Fleuriste avec bouquets, livraison", keywords: ["fleuriste"], sections: ["Bouquets", "Compositions", "Livraison", "Contact"] },
  { id: "chocolaterie", name: "Chocolaterie", prompt: "Chocolaterie avec créations, coffrets", keywords: ["chocolaterie", "chocolat"], sections: ["Créations", "Coffrets", "Boutique", "Contact"] },
  { id: "cave-vins", name: "Cave à vins", prompt: "Cave avec sélection vins, dégustations", keywords: ["cave vins"], sections: ["Sélection", "Dégustations", "Contact"] },
  { id: "animalerie", name: "Animalerie", prompt: "Animalerie avec produits, services", keywords: ["animalerie"], sections: ["Produits", "Services", "Contact"] },
  { id: "magasin-sport", name: "Magasin de sport", prompt: "Magasin avec équipements sportifs", keywords: ["magasin sport"], sections: ["Sports", "Marques", "Contact"] },
  { id: "magasin-electro", name: "Magasin électroménager", prompt: "Magasin électroménager avec produits", keywords: ["electromenager"], sections: ["Produits", "Marques", "Contact"] },
  { id: "magasin-jouets", name: "Magasin de jouets", prompt: "Jouets avec catalogue par âge", keywords: ["magasin jouets"], sections: ["Catalogue", "Âges", "Contact"] },

  // 💻 TECH & DIGITAL (71-80)
  { id: "app-mobile", name: "App mobile", prompt: "Landing app mobile avec features, screenshots", keywords: ["app mobile"], sections: ["Features", "Screenshots", "Télécharger", "Contact"] },
  { id: "saas-b2b", name: "SaaS B2B", prompt: "Landing SaaS B2B avec features, pricing", keywords: ["saas b2b"], sections: ["Features", "Pricing", "Cas clients", "Contact"] },
  { id: "jeu-video", name: "Jeu vidéo", prompt: "Site de jeu vidéo avec trailer, features", keywords: ["jeu video"], sections: ["Trailer", "Features", "Communauté", "Acheter"] },
  { id: "api-dev", name: "API développeur", prompt: "Documentation API avec endpoints", keywords: ["api developpeur"], sections: ["Endpoints", "Docs", "Pricing", "Contact"] },
  { id: "plugin", name: "Plugin", prompt: "Plugin avec features, installation", keywords: ["plugin"], sections: ["Features", "Installation", "Pricing", "Support"] },
  { id: "theme-wp", name: "Thème WordPress", prompt: "Thème WP avec démo, features", keywords: ["theme wordpress"], sections: ["Démo", "Features", "Pricing", "Support"] },
  { id: "extension", name: "Extension navigateur", prompt: "Extension avec features, installation", keywords: ["extension navigateur"], sections: ["Features", "Installation", "Avis", "Support"] },
  { id: "logiciel", name: "Logiciel", prompt: "Logiciel avec features, téléchargement", keywords: ["logiciel"], sections: ["Features", "Télécharger", "Tarifs", "Support"] },
  { id: "formation-en-ligne", name: "Formation en ligne", prompt: "Formation avec modules, tarifs", keywords: ["formation en ligne"], sections: ["Programme", "Tarifs", "Témoignages", "Inscription"] },
  { id: "agence-seo", name: "Agence SEO", prompt: "Agence SEO avec résultats, méthodes", keywords: ["agence seo"], sections: ["Services", "Résultats", "Méthode", "Contact"] },

  // 🏗️ SERVICES (81-90)
  { id: "plombier", name: "Plombier", prompt: "Plombier avec services, urgences, devis", keywords: ["plombier"], sections: ["Services", "Urgences", "Devis", "Contact"] },
  { id: "electricien", name: "Électricien", prompt: "Électricien avec services, devis", keywords: ["electricien"], sections: ["Services", "Réalisations", "Devis", "Contact"] },
  { id: "peintre", name: "Peintre", prompt: "Peintre en bâtiment avec réalisations", keywords: ["peintre batiment"], sections: ["Réalisations", "Services", "Devis", "Contact"] },
  { id: "menuisier", name: "Menuisier", prompt: "Menuisier avec créations sur mesure", keywords: ["menuisier"], sections: ["Créations", "Réalisations", "Devis", "Contact"] },
  { id: "jardinier", name: "Paysagiste", prompt: "Paysagiste avec réalisations, entretien", keywords: ["paysagiste", "jardinier"], sections: ["Réalisations", "Services", "Devis", "Contact"] },
  { id: "demenageur", name: "Déménageur", prompt: "Déménageur avec formules, devis", keywords: ["demenageur"], sections: ["Formules", "Devis", "Avis", "Contact"] },
  { id: "serrurier", name: "Serrurier", prompt: "Serrurier avec urgences 24/7", keywords: ["serrurier"], sections: ["Services", "Urgences", "Tarifs", "Contact"] },
  { id: "vitrier", name: "Vitrier", prompt: "Vitrier avec interventions rapides", keywords: ["vitrier"], sections: ["Services", "Urgences", "Devis", "Contact"] },
  { id: "climatisation", name: "Climatisation", prompt: "Installation clim, entretien, dépannage", keywords: ["climatisation"], sections: ["Installation", "Entretien", "Dépannage", "Devis"] },
  { id: "nettoyage", name: "Société de nettoyage", prompt: "Nettoyage professionnel, particuliers", keywords: ["nettoyage"], sections: ["Services", "Tarifs", "Devis", "Contact"] },

  // 🚗 AUTO & TRANSPORT (91-100)
  { id: "garage", name: "Garage auto", prompt: "Garage avec services, marques, RDV", keywords: ["garage"], sections: ["Services", "Marques", "RDV", "Contact"] },
  { id: "concession", name: "Concession auto", prompt: "Concession avec véhicules, essais", keywords: ["concession"], sections: ["Véhicules", "Essai", "Financement", "Contact"] },
  { id: "auto-ecole-2", name: "Auto-école (2)", prompt: "Auto-école complète", keywords: ["auto ecole conduite"], sections: ["Forfaits", "Inscription", "Résultats", "Contact"] },
  { id: "taxi", name: "Taxi / VTC", prompt: "Service taxi avec réservation", keywords: ["taxi", "vtc"], sections: ["Réserver", "Tarifs", "Zones", "Contact"] },
  { id: "location-voiture", name: "Location voiture", prompt: "Location avec flotte, tarifs", keywords: ["location voiture"], sections: ["Flotte", "Tarifs", "Réservation", "Contact"] },
  { id: "moto-concession", name: "Concession moto", prompt: "Concession moto avec modèles", keywords: ["concession moto"], sections: ["Modèles", "Accessoires", "Essai", "Contact"] },
  { id: "depannage", name: "Dépannage auto", prompt: "Dépannage 24/7 avec zones", keywords: ["depannage auto"], sections: ["Services", "Zones", "Urgences", "Contact"] },
  { id: "lavage-auto", name: "Lavage auto", prompt: "Lavage auto avec formules", keywords: ["lavage auto"], sections: ["Formules", "Tarifs", "Réservation", "Contact"] },
  { id: "caravane", name: "Location caravane", prompt: "Location caravanes et camping-cars", keywords: ["caravane", "camping car"], sections: ["Véhicules", "Tarifs", "Réservation", "Contact"] },
  { id: "transport", name: "Transport / Logistique", prompt: "Transport avec services, flotte", keywords: ["transport", "logistique"], sections: ["Services", "Flotte", "Devis", "Contact"] },
];

export function findSiteCategory(prompt: string): SiteCategory | null {
  const lower = prompt.toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
  for (const s of SITE_CATEGORIES) if (lower.includes(s.id.replace(/-/g, " "))) return s;
  for (const s of SITE_CATEGORIES) {
    for (const kw of s.keywords) {
      if (lower.includes(kw)) return s;
    }
  }
  const words = lower.split(" ");
  for (const w of words) {
    if (w.length < 3) continue;
    for (const s of SITE_CATEGORIES) {
      if (s.name.toLowerCase().includes(w)) return s;
    }
  }
  return null;
}