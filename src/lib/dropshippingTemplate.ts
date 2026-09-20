type Color = { primary: string; secondary: string };
type Mood = { id: string; name: string };

export type ProductInput = {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice: number;
  image: string;
  rating: number;
  reviews: number;
  badge: string;
  sku: string;
  category?: string;
  salesCount?: number;
  isNew?: boolean;
  isRare?: boolean;
};

export type CinematicAssets = { extraVideos?: string[]; galleryPhotos?: string[] };
export type Signature = { palette: { accent: string; accent2: string }; animStyle: string };

function escapeHtml(str: string): string {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ═══════════════════════════════════════════════════════════════
// 29 THÈMES
// ═══════════════════════════════════════════════════════════════
type ThemeConfig = {
  bodyBg: string;
  gaugeLabel: string;
  gaugeUnit: string;
  maxVal: number;
  isCustomHUD: boolean;
  hudRooms: string[];
  l1: [string, string];
  l2: [string, string];
  l3: [string, string];
  l4: [string, string];
  particle: string;
};

const THEMES: Record<string, ThemeConfig> = {
  ocean: {
    bodyBg: "linear-gradient(to bottom, #112d42 0%, #081724 30%, #030a12 60%, #000103 100%)",
    gaugeLabel: "Profondeur", gaugeUnit: "m", maxVal: 40, isCustomHUD: false, hudRooms: [],
    l1: ["Les Moins Chers", "Zone Éclairée (0m - 5m)"],
    l2: ["Les Produits Rares", "Zone Crépusculaire (5m - 10m)"],
    l3: ["Les Nouveautés", "Zone Minuit (10m - 20m)"],
    l4: ["Les Plus Vendus", "Les Abysses Mystérieux (20m - 40m)"],
    particle: "bubble"
  },
  lapin: {
    bodyBg: "linear-gradient(to bottom, #3d2a1c 0%, #21160e 40%, #120b07 70%, #030201 100%)",
    gaugeLabel: "Terrier", gaugeUnit: "m", maxVal: 40, isCustomHUD: false, hudRooms: [],
    l1: ["Les Moins Chers", "Entrée des Tunnels (0m - 5m)"],
    l2: ["Les Produits Rares", "Galerie Cristalline (5m - 10m)"],
    l3: ["Les Nouveautés", "Racines Magiques (10m - 20m)"],
    l4: ["Les Plus Vendus", "Sanctuaire Secret (20m - 40m)"],
    particle: "bubble"
  },
  maison: {
    bodyBg: "#0f0f12",
    gaugeLabel: "Pièce", gaugeUnit: "", maxVal: 4, isCustomHUD: true, hudRooms: ["Salon", "Boudoir", "Atelier", "Archives"],
    l1: ["Les Moins Chers", "Chambre I : Le Grand Salon"],
    l2: ["Les Produits Rares", "Chambre II : Galerie des Curiosités"],
    l3: ["Les Nouveautés", "Chambre III : L'Atelier Contemporain"],
    l4: ["Les Plus Vendus", "Chambre IV : Les Archives Secrètes"],
    particle: "dust"
  },
  espace: {
    bodyBg: "radial-gradient(circle at center, #0c0d14 0%, #020204 100%)",
    gaugeLabel: "Voyage", gaugeUnit: "km", maxVal: 40, isCustomHUD: false, hudRooms: [],
    l1: ["Les Moins Chers", "Orbite Basse (0km - 5km)"],
    l2: ["Les Produits Rares", "Ceinture d'Astéroïdes (5km - 10km)"],
    l3: ["Les Nouveautés", "Nébuleuse Lointaine (10km - 20km)"],
    l4: ["Les Plus Vendus", "Cœur de la Galaxie (20km - 40km)"],
    particle: "star"
  },
  volcan: {
    bodyBg: "linear-gradient(to bottom, #2b0b00, #050100)",
    gaugeLabel: "Magma", gaugeUnit: "m", maxVal: 40, isCustomHUD: false, hudRooms: [],
    l1: ["Les Moins Chers", "Cratère Supérieur (0m - 5m)"],
    l2: ["Les Produits Rares", "Cheminée de Soufre (5m - 10m)"],
    l3: ["Les Nouveautés", "Rivières de Lave (10m - 20m)"],
    l4: ["Les Plus Vendus", "Le Cœur de la Terre (20m - 40m)"],
    particle: "ember"
  },
  mine: {
    bodyBg: "linear-gradient(to bottom, #26211c, #0a0908)",
    gaugeLabel: "Puits", gaugeUnit: "m", maxVal: 40, isCustomHUD: false, hudRooms: [],
    l1: ["Les Moins Chers", "Puits de Surface (0m - 5m)"],
    l2: ["Les Produits Rares", "Filon de Charbon (5m - 10m)"],
    l3: ["Les Nouveautés", "Caverne de Diamants (10m - 20m)"],
    l4: ["Les Plus Vendus", "La Cité Perdue (20m - 40m)"],
    particle: "dust"
  },
  gratte_ciel: {
    bodyBg: "linear-gradient(to top, #111111, #445566)",
    gaugeLabel: "Étage", gaugeUnit: "", maxVal: 40, isCustomHUD: false, hudRooms: [],
    l1: ["Les Moins Chers", "Le Rez-de-Chaussée"],
    l2: ["Les Produits Rares", "Les Bureaux Exécutifs"],
    l3: ["Les Nouveautés", "Le Penthouse Moderne"],
    l4: ["Les Plus Vendus", "Le Rooftop Panoramique"],
    particle: "cloud"
  },
  cyberpunk: {
    bodyBg: "#05000a",
    gaugeLabel: "Réseau", gaugeUnit: "TB", maxVal: 40, isCustomHUD: false, hudRooms: [],
    l1: ["Les Moins Chers", "Surface Web (0 - 5 TB)"],
    l2: ["Les Produits Rares", "Deep Web Crypté (5 - 10 TB)"],
    l3: ["Les Nouveautés", "Serveurs Mainframe (10 - 20 TB)"],
    l4: ["Les Plus Vendus", "Le Noyau IA (20 - 40 TB)"],
    particle: "glitch"
  },
  temporel: {
    bodyBg: "linear-gradient(to bottom, #110022, #000000)",
    gaugeLabel: "Époque", gaugeUnit: "ans", maxVal: 40, isCustomHUD: false, hudRooms: [],
    l1: ["Les Moins Chers", "Le Présent Connecté"],
    l2: ["Les Produits Rares", "L'Ère Cybernétique (+10 ans)"],
    l3: ["Les Nouveautés", "L'Âge de l'Exploration (+20 ans)"],
    l4: ["Les Plus Vendus", "La Singularité Temporelle (+40 ans)"],
    particle: "portal"
  },
  foret: {
    bodyBg: "linear-gradient(to bottom, #132415, #040805)",
    gaugeLabel: "Canopée", gaugeUnit: "m", maxVal: 40, isCustomHUD: false, hudRooms: [],
    l1: ["Les Moins Chers", "Les Racines Humides (0m - 5m)"],
    l2: ["Les Produits Rares", "Le Sous-Bois Ombragé (5m - 10m)"],
    l3: ["Les Nouveautés", "Les Branches Hautes (10m - 20m)"],
    l4: ["Les Plus Vendus", "Le Sommet de la Canopée (20m - 40m)"],
    particle: "leaf"
  },
  egypte: {
    bodyBg: "linear-gradient(to bottom, #3b2a11, #0a0702)",
    gaugeLabel: "Pyramide", gaugeUnit: "m", maxVal: 40, isCustomHUD: false, hudRooms: [],
    l1: ["Les Moins Chers", "L'Antichambre des Sables (0m - 5m)"],
    l2: ["Les Produits Rares", "Le Couloir des Hiéroglyphes (5m - 10m)"],
    l3: ["Les Nouveautés", "La Chambre de la Reine (10m - 20m)"],
    l4: ["Les Plus Vendus", "Le Sarcophage du Pharaon (20m - 40m)"],
    particle: "sand"
  },
  glacier: {
    bodyBg: "linear-gradient(to bottom, #1a334d, #03080f)",
    gaugeLabel: "Crevasse", gaugeUnit: "m", maxVal: 40, isCustomHUD: false, hudRooms: [],
    l1: ["Les Moins Chers", "Surface Enneigée (0m - 5m)"],
    l2: ["Les Produits Rares", "Glace Bleue Compacte (5m - 10m)"],
    l3: ["Les Nouveautés", "Rivières Sous-Glaciaires (10m - 20m)"],
    l4: ["Les Plus Vendus", "Le Cryo-Noyau (20m - 40m)"],
    particle: "snow"
  },
  chateau: {
    bodyBg: "#141416",
    gaugeLabel: "Niveau", gaugeUnit: "", maxVal: 4, isCustomHUD: true, hudRooms: ["Douves", "Cour", "Donjon", "Crypte"],
    l1: ["Les Moins Chers", "Les Douves Extérieures"],
    l2: ["Les Produits Rares", "La Cour Royale"],
    l3: ["Les Nouveautés", "La Salle du Trône"],
    l4: ["Les Plus Vendus", "La Crypte aux Trésors"],
    particle: "dust"
  },
  retro_wave: {
    bodyBg: "#12041d",
    gaugeLabel: "Fidélité", gaugeUnit: "Hz", maxVal: 40, isCustomHUD: false, hudRooms: [],
    l1: ["Les Moins Chers", "Bande Passante Lo-Fi"],
    l2: ["Les Produits Rares", "Synthétiseur Analogique"],
    l3: ["Les Nouveautés", "Fréquence Néon"],
    l4: ["Les Plus Vendus", "Laser Haute Définition"],
    particle: "grid"
  },
  bibliotheque: {
    bodyBg: "linear-gradient(to bottom, #2b1f15, #080604)",
    gaugeLabel: "Allée", gaugeUnit: "", maxVal: 40, isCustomHUD: false, hudRooms: [],
    l1: ["Les Moins Chers", "Rayonnage des Nouveautés"],
    l2: ["Les Produits Rares", "Section Manuscrits Rares"],
    l3: ["Les Nouveautés", "Le Cabinet des Curiosités"],
    l4: ["Les Plus Vendus", "La Réserve Interdite"],
    particle: "dust"
  },
  laboratoire: {
    bodyBg: "#1c2126",
    gaugeLabel: "Confinement", gaugeUnit: "µm", maxVal: 40, isCustomHUD: false, hudRooms: [],
    l1: ["Les Moins Chers", "Zone Blanche Commune"],
    l2: ["Les Produits Rares", "Salle Blanche de Recherche"],
    l3: ["Les Nouveautés", "Niveau de Biosécurité 3"],
    l4: ["Les Plus Vendus", "Laboratoire Alpha"],
    particle: "spark"
  },
  train: {
    bodyBg: "#111111",
    gaugeLabel: "Wagon", gaugeUnit: "", maxVal: 4, isCustomHUD: true, hudRooms: ["Fret", "Éco", "Première", "Machine"],
    l1: ["Les Moins Chers", "Wagon de Fret Standard"],
    l2: ["Les Produits Rares", "Wagon Voyageur Confort"],
    l3: ["Les Nouveautés", "Wagon Restaurant de Luxe"],
    l4: ["Les Plus Vendus", "La Locomotive Motrice"],
    particle: "spark"
  },
  nuages: {
    bodyBg: "linear-gradient(to top, #3a6073, #3a7bd5)",
    gaugeLabel: "Altitude", gaugeUnit: "m", maxVal: 40, isCustomHUD: false, hudRooms: [],
    l1: ["Les Moins Chers", "Brumes de Surface"],
    l2: ["Les Produits Rares", "Couche d'Altocumulus"],
    l3: ["Les Nouveautés", "Stratosphère Pure"],
    l4: ["Les Plus Vendus", "Les Portes du Ciel"],
    particle: "cloud"
  },
  enfer: {
    bodyBg: "linear-gradient(to bottom, #110000, #000000)",
    gaugeLabel: "Cercle", gaugeUnit: "", maxVal: 4, isCustomHUD: true, hudRooms: ["Limbes", "Luxure", "Colère", "Gloutonnerie"],
    l1: ["Les Moins Chers", "Premier Cercle : Les Limbes"],
    l2: ["Les Produits Rares", "Deuxième Cercle : Les Passions"],
    l3: ["Les Nouveautés", "Cinquième Cercle : Le Styx"],
    l4: ["Les Plus Vendus", "Neuvième Cercle : Le Centre Gelé"],
    particle: "ember"
  },
  aquarium: {
    bodyBg: "#071a24",
    gaugeLabel: "Bassin", gaugeUnit: "L", maxVal: 40, isCustomHUD: false, hudRooms: [],
    l1: ["Les Moins Chers", "Récif de Surface"],
    l2: ["Les Produits Rares", "Bassin des Requins"],
    l3: ["Les Nouveautés", "Méduses Luminescentes"],
    l4: ["Les Plus Vendus", "Le Bassin Tactile Géant"],
    particle: "bubble"
  },
  musee: {
    bodyBg: "#1e1e1e",
    gaugeLabel: "Aile", gaugeUnit: "", maxVal: 4, isCustomHUD: true, hudRooms: ["Antiquités", "Renaissance", "Moderne", "Futuriste"],
    l1: ["Les Moins Chers", "Aile I : Galerie des Antiquités"],
    l2: ["Les Produits Rares", "Aile II : Peintures Classiques"],
    l3: ["Les Nouveautés", "Aile III : Art Contemporain"],
    l4: ["Les Plus Vendus", "Le Pavillon des Chefs-d'Œuvre"],
    particle: "dust"
  },
  matrix: {
    bodyBg: "#020a02",
    gaugeLabel: "Code", gaugeUnit: "bin", maxVal: 40, isCustomHUD: false, hudRooms: [],
    l1: ["Les Moins Chers", "Ligne de Script Basique"],
    l2: ["Les Produits Rares", "Algorithme d'Exception"],
    l3: ["Les Nouveautés", "Fonction Compilée Récente"],
    l4: ["Les Plus Vendus", "Le Code Source Original"],
    particle: "matrix"
  },
  temple: {
    bodyBg: "linear-gradient(to bottom, #2a2c1f, #090a07)",
    gaugeLabel: "Sanctuaire", gaugeUnit: "étapes", maxVal: 40, isCustomHUD: false, hudRooms: [],
    l1: ["Les Moins Chers", "Le Parvis de Pierre"],
    l2: ["Les Produits Rares", "Les Jardins Suspendus"],
    l3: ["Les Nouveautés", "La Pagode Dorée"],
    l4: ["Les Plus Vendus", "L'Autel Interdit"],
    particle: "petal"
  },
  bunker: {
    bodyBg: "#1a1b1c",
    gaugeLabel: "Abri", gaugeUnit: "m", maxVal: 40, isCustomHUD: false, hudRooms: [],
    l1: ["Les Moins Chers", "Sas de Sécurité"],
    l2: ["Les Produits Rares", "Quartiers Vivants"],
    l3: ["Les Nouveautés", "Silo de Ravitaillement"],
    l4: ["Les Plus Vendus", "Salle de Commandement"],
    particle: "spark"
  },
  fete_foraine: {
    bodyBg: "#100518",
    gaugeLabel: "Frisson", gaugeUnit: "%", maxVal: 40, isCustomHUD: false, hudRooms: [],
    l1: ["Les Moins Chers", "Le Stand de Barbe à Papa"],
    l2: ["Les Produits Rares", "Le Palais des Miroirs"],
    l3: ["Les Nouveautés", "Le Grand Huit"],
    l4: ["Les Plus Vendus", "La Grande Roue Suprême"],
    particle: "confetti"
  },
  casino: {
    bodyBg: "#0d2613",
    gaugeLabel: "Mise", gaugeUnit: "k$", maxVal: 40, isCustomHUD: false, hudRooms: [],
    l1: ["Les Moins Chers", "Les Machines à Sous"],
    l2: ["Les Produits Rares", "La Table de Blackjack"],
    l3: ["Les Nouveautés", "Le Salon Privé de Roulette"],
    l4: ["Les Plus Vendus", "La Suite Haute Performance"],
    particle: "spark"
  },
  theatre: {
    bodyBg: "#140508",
    gaugeLabel: "Acte", gaugeUnit: "", maxVal: 4, isCustomHUD: true, hudRooms: ["Foyer", "Balcon", "Orchestre", "Scène"],
    l1: ["Les Moins Chers", "Acte I : L'Ouverture"],
    l2: ["Les Produits Rares", "Acte II : La Loge d'Honneur"],
    l3: ["Les Nouveautés", "Acte III : L'Avant-Scène"],
    l4: ["Les Plus Vendus", "Acte IV : Le Grand Final"],
    particle: "dust"
  },
  atlantide: {
    bodyBg: "linear-gradient(to bottom, #032030, #00070a)",
    gaugeLabel: "Cité", gaugeUnit: "m", maxVal: 40, isCustomHUD: false, hudRooms: [],
    l1: ["Les Moins Chers", "Les Ruines Périphériques"],
    l2: ["Les Produits Rares", "Les Temples de Corail"],
    l3: ["Les Nouveautés", "Les Palais d'Orichalque"],
    l4: ["Les Plus Vendus", "Le Trône de Poséidon"],
    particle: "bubble"
  },
  vortex: {
    bodyBg: "radial-gradient(circle at center, #20003b, #03000a)",
    gaugeLabel: "Gravité", gaugeUnit: "G", maxVal: 40, isCustomHUD: false, hudRooms: [],
    l1: ["Les Moins Chers", "L'Horizon des Événements"],
    l2: ["Les Produits Rares", "Le Disque d'Accrétion"],
    l3: ["Les Nouveautés", "Le Jet Relativiste"],
    l4: ["Les Plus Vendus", "La Singularité Infinie"],
    particle: "star"
  },
  fourmiliere: {
    bodyBg: "linear-gradient(to bottom, #301f14, #080503)",
    gaugeLabel: "Galerie", gaugeUnit: "cm", maxVal: 40, isCustomHUD: false, hudRooms: [],
    l1: ["Les Moins Chers", "Chambres de Stockage"],
    l2: ["Les Produits Rares", "Pouponnière Royale"],
    l3: ["Les Nouveautés", "Nouvelles Galeries Forées"],
    l4: ["Les Plus Vendus", "La Chambre de la Reine"],
    particle: "dust"
  }
};

// ═══════════════════════════════════════════════════════════════
// FONCTION PRINCIPALE
// ═══════════════════════════════════════════════════════════════
export function buildDropshippingSite(
  storeName: string,
  tagline: string,
  category: string = "produits varies",
  color?: Color,
  mood?: Mood | string,
  forcedStyle: string = "ocean",
  products: ProductInput[] = [],
  videos: CinematicAssets = {},
  signature?: Signature
): string {
  const accent = color?.primary || "#00e5ff";
  const safeStoreName = escapeHtml(storeName);
  const safeTagline = escapeHtml(tagline);

  // ═══ SPLIT DES PRODUITS EN 4 COUCHES ═══
  const layer1 = [...products].sort((a, b) => a.price - b.price).slice(0, 6);
  const layer2 = products.filter(p => p.isRare || (p.badge || "").toLowerCase().includes("rare")).slice(0, 6);
  if (layer2.length === 0) layer2.push(...products.slice(6, 12));
  const layer3 = products.filter(p => p.isNew || (p.badge || "").toLowerCase().includes("nouveau") || (p.badge || "").toLowerCase().includes("new")).slice(0, 6);
  if (layer3.length === 0) layer3.push(...products.slice(12, 18));
  const layer4 = [...products].sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0)).slice(0, 6);
  if (layer4.length === 0) layer4.push(...products.slice(18, 24));

  // ═══ CONFIG THÈME ═══
  const cfg = THEMES[forcedStyle] || THEMES.ocean;

  // ═══ RENDER COUCHE 3D ═══
  function render3DLayer(list: ProductInput[], baseZ: number): string {
    return list
      .map((p, idx) => {
        const name = escapeHtml(p.name || "");
        const price = Number(p.price) || 49.99;
        const oldPrice = Number(p.oldPrice) || price * 1.3;
        const pollinationsImage = `https://image.pollinations.ai/prompt/${encodeURIComponent(name + " luxury product professional photo white background studio lighting")}?width=400&height=400&nologo=true&seed=${idx}`;
const fallbackImage = `https://placehold.co/400x400/1a1a1a/${accent.replace("#", "")}?text=${encodeURIComponent(name.slice(0, 20))}`;
const image = pollinationsImage;
        const sku = escapeHtml(p.sku || "");
        const rating = p.rating || 4.5;
        const reviews = p.reviews || 100;
        const stars = "★".repeat(Math.round(rating)) + "☆".repeat(5 - Math.round(rating));

        const angle = (idx - (list.length - 1) / 2) * 0.45;
        const posX = Math.sin(angle) * 550;
        const posY = idx % 2 === 0 ? -40 : 60;
        const posZ = baseZ - idx * 320;

        const safeName = name.replace(/'/g, "\\'");
        const safeImage = image.replace(/'/g, "\\'");

        return `
        <div class="product-3d-node" style="transform: translate3d(${posX}px, ${posY}px, ${posZ}px) rotateY(${-angle * 0.5}rad)">
          <div class="glass-card">
            <div class="img-container">
              <img src="${image}" alt="${name}" loading="lazy" onerror="this.onerror=null; this.src='${fallbackImage}';" /> onerror="this.src='https://placehold.co/400x400/0a0a0a/00e5ff?text=Produit'" />
            </div>
            <div class="meta">
              <div class="stars">${stars} <span class="reviews">${reviews}</span></div>
              <h3>${name}</h3>
              <div class="price-row">
                <p class="price">${price.toFixed(2)} $</p>
                ${oldPrice > price ? `<p class="price-old">${oldPrice.toFixed(2)} $</p>` : ""}
              </div>
              <button class="buy-trigger" onclick="addToCart('${safeName}',${price},'${safeImage}','${sku}')">
                Ajouter au panier
              </button>
            </div>
          </div>
        </div>`;
      })
      .join("");
  }

  const particlesJS = (() => {
    const type = cfg.particle;
    if (type === "bubble") {
      return `for (let i = 0; i < 25; i++) { let el = document.createElement('div'); el.className = 'particle bubble'; let size = Math.random() * 14 + 6; el.style.width = size + 'px'; el.style.height = size + 'px'; el.style.left = Math.random() * 100 + 'vw'; el.style.animationDelay = Math.random() * 10 + 's'; document.body.appendChild(el); }`;
    }
    if (type === "star") {
      return `for (let i = 0; i < 60; i++) { let el = document.createElement('div'); el.className = 'particle star'; let size = Math.random() * 3 + 1; el.style.width = size + 'px'; el.style.height = size + 'px'; el.style.left = Math.random() * 100 + 'vw'; el.style.top = Math.random() * 100 + 'vh'; el.style.animationDelay = Math.random() * 5 + 's'; document.body.appendChild(el); }`;
    }
    if (type === "dust") {
      return `for (let i = 0; i < 40; i++) { let el = document.createElement('div'); el.className = 'particle dust'; el.style.left = Math.random() * 100 + 'vw'; el.style.top = Math.random() * 100 + 'vh'; el.style.animationDelay = Math.random() * 8 + 's'; document.body.appendChild(el); }`;
    }
    if (type === "ember") {
      return `for (let i = 0; i < 30; i++) { let el = document.createElement('div'); el.className = 'particle ember'; let size = Math.random() * 6 + 2; el.style.width = size + 'px'; el.style.height = size + 'px'; el.style.left = Math.random() * 100 + 'vw'; el.style.animationDelay = Math.random() * 6 + 's'; document.body.appendChild(el); }`;
    }
    if (type === "snow") {
      return `for (let i = 0; i < 50; i++) { let el = document.createElement('div'); el.className = 'particle snow'; let size = Math.random() * 5 + 2; el.style.width = size + 'px'; el.style.height = size + 'px'; el.style.left = Math.random() * 100 + 'vw'; el.style.animationDelay = Math.random() * 8 + 's'; document.body.appendChild(el); }`;
    }
    if (type === "leaf") {
      return `for (let i = 0; i < 20; i++) { let el = document.createElement('div'); el.className = 'particle leaf'; el.style.left = Math.random() * 100 + 'vw'; el.style.animationDelay = Math.random() * 10 + 's'; document.body.appendChild(el); }`;
    }
    if (type === "spark") {
      return `for (let i = 0; i < 30; i++) { let el = document.createElement('div'); el.className = 'particle spark'; el.style.left = Math.random() * 100 + 'vw'; el.style.top = Math.random() * 100 + 'vh'; el.style.animationDelay = Math.random() * 4 + 's'; document.body.appendChild(el); }`;
    }
    if (type === "cloud") {
      return `for (let i = 0; i < 15; i++) { let el = document.createElement('div'); el.className = 'particle cloud'; el.style.left = Math.random() * 100 + 'vw'; el.style.top = Math.random() * 100 + 'vh'; el.style.animationDelay = Math.random() * 12 + 's'; document.body.appendChild(el); }`;
    }
    if (type === "matrix") {
      return `for (let i = 0; i < 40; i++) { let el = document.createElement('div'); el.className = 'particle matrix'; el.style.left = Math.random() * 100 + 'vw'; el.textContent = Math.random() < 0.5 ? '0' : '1'; el.style.animationDelay = Math.random() * 5 + 's'; document.body.appendChild(el); }`;
    }
    if (type === "petal") {
      return `for (let i = 0; i < 25; i++) { let el = document.createElement('div'); el.className = 'particle petal'; el.style.left = Math.random() * 100 + 'vw'; el.style.animationDelay = Math.random() * 10 + 's'; document.body.appendChild(el); }`;
    }
    if (type === "confetti") {
      return `for (let i = 0; i < 50; i++) { let el = document.createElement('div'); el.className = 'particle confetti'; el.style.left = Math.random() * 100 + 'vw'; el.style.background = 'hsl(' + (Math.random() * 360) + ', 80%, 60%)'; el.style.animationDelay = Math.random() * 8 + 's'; document.body.appendChild(el); }`;
    }
    if (type === "glitch") {
      return `for (let i = 0; i < 20; i++) { let el = document.createElement('div'); el.className = 'particle glitch'; el.style.left = Math.random() * 100 + 'vw'; el.style.top = Math.random() * 100 + 'vh'; el.style.animationDelay = Math.random() * 3 + 's'; document.body.appendChild(el); }`;
    }
    if (type === "portal") {
      return `for (let i = 0; i < 30; i++) { let el = document.createElement('div'); el.className = 'particle portal'; el.style.left = Math.random() * 100 + 'vw'; el.style.top = Math.random() * 100 + 'vh'; el.style.animationDelay = Math.random() * 6 + 's'; document.body.appendChild(el); }`;
    }
    if (type === "sand") {
      return `for (let i = 0; i < 60; i++) { let el = document.createElement('div'); el.className = 'particle sand'; el.style.left = Math.random() * 100 + 'vw'; el.style.animationDelay = Math.random() * 8 + 's'; document.body.appendChild(el); }`;
    }
    if (type === "grid") {
      return `for (let i = 0; i < 20; i++) { let el = document.createElement('div'); el.className = 'particle grid'; el.style.left = Math.random() * 100 + 'vw'; el.style.animationDelay = Math.random() * 5 + 's'; document.body.appendChild(el); }`;
    }
    return "";
  })();

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${safeStoreName} - Expérience Immersive Premium</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: 'Inter', sans-serif;
  background: ${cfg.bodyBg};
  color: #fff;
  overflow-x: hidden;
  background-attachment: fixed;
  min-height: 100vh;
}

/* ═══ SCROLL PROXY (ralentit le défilement) ═══ */
#scroll-track { height: 1200vh; }

#viewport {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  perspective: 1200px;
  perspective-origin: 50% 45%;
  overflow: hidden;
}

#camera-rig {
  position: absolute;
  width: 100%; height: 100%;
  transform-style: preserve-3d;
  will-change: transform;
}

/* ═══ HEADER FLOTTANT ═══ */
#top-bar {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 200;
  padding: 20px 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(180deg, rgba(0,0,0,0.5) 0%, transparent 100%);
  pointer-events: none;
}
#top-bar > * { pointer-events: auto; }

#brand-logo {
  font-size: 22px;
  font-weight: 900;
  letter-spacing: -0.5px;
  color: ${accent};
  text-shadow: 0 0 30px ${accent}60;
}

#cart-button {
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  color: #fff;
  padding: 12px 22px;
  border-radius: 100px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  backdrop-filter: blur(20px);
  transition: all 0.3s;
  font-family: inherit;
  display: flex;
  align-items: center;
  gap: 10px;
}
#cart-button:hover {
  background: rgba(255,255,255,0.15);
  transform: translateY(-2px);
  box-shadow: 0 15px 40px rgba(0,0,0,0.4);
}
#cart-count {
  background: ${accent};
  color: #000;
  border-radius: 100px;
  padding: 2px 10px;
  font-size: 12px;
  font-weight: 900;
  min-width: 22px;
  text-align: center;
}

/* ═══ HUD PROGRESSION ═══ */
#hud-monitor {
  position: fixed;
  right: 40px; bottom: 40px;
  z-index: 100;
  background: rgba(4, 8, 15, 0.4);
  border: 1px solid rgba(255,255,255,0.08);
  padding: 16px 24px;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);
  backdrop-filter: blur(20px);
  min-width: 180px;
}
#hud-monitor span {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 3px;
  color: ${accent};
  display: block;
  margin-bottom: 2px;
}
#hud-monitor div {
  font-size: 24px;
  font-weight: 900;
  font-variant-numeric: tabular-nums;
}

/* ═══ BANNIÈRES SCÉNOGRAPHIQUES ═══ */
.scenographic-banner {
  position: absolute;
  left: 50%; top: 22%;
  transform: translate3d(-50%, -50%, 0);
  text-align: center;
  width: 90%;
  pointer-events: none;
  transform-style: preserve-3d;
}
.scenographic-banner h2 {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 900;
  letter-spacing: -2px;
  text-transform: uppercase;
  line-height: 1;
  margin-bottom: 10px;
  text-shadow: 0 10px 60px rgba(0,0,0,0.8);
}
.scenographic-banner p {
  font-size: 1.1rem;
  color: ${accent};
  font-weight: 600;
  opacity: 0.9;
}

/* ═══ CARTES 3D ═══ */
.product-3d-node {
  position: absolute;
  left: 50%; top: 40%;
  width: 310px;
  margin-left: -155px;
  transform-style: preserve-3d;
  will-change: transform;
}

.glass-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.01) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 16px;
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.5);
  transition: border-color 0.4s, box-shadow 0.4s, transform 0.4s;
}
.glass-card:hover {
  border-color: ${accent};
  box-shadow: 0 0 60px ${accent}40;
  transform: translate3d(0, -10px, 20px);
}

.img-container {
  width: 100%;
  height: 230px;
  border-radius: 18px;
  overflow: hidden;
  margin-bottom: 16px;
  background: rgba(0,0,0,0.2);
}
.img-container img {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform 0.6s;
}
.glass-card:hover .img-container img { transform: scale(1.06); }

.meta .stars {
  color: #fbbf24;
  font-size: 13px;
  letter-spacing: 1px;
  margin-bottom: 6px;
}
.meta .reviews { color: rgba(255,255,255,0.4); font-size: 11px; margin-left: 4px; }

.meta h3 {
  font-size: 1.15rem;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 8px;
}

.price-row { display: flex; align-items: baseline; gap: 10px; margin-bottom: 16px; }
.meta .price { font-size: 1.35rem; font-weight: 900; color: ${accent}; }
.meta .price-old { font-size: 0.9rem; opacity: 0.4; text-decoration: line-through; }

.buy-trigger {
  width: 100%;
  background: #fff;
  color: #000;
  border: none;
  padding: 14px;
  font-weight: 700;
  font-size: 14px;
  border-radius: 14px;
  cursor: pointer;
  transition: background 0.3s, color 0.3s, transform 0.2s;
  font-family: inherit;
}
.buy-trigger:hover { background: ${accent}; color: #fff; transform: scale(1.02); }
.buy-trigger:active { transform: scale(0.98); }

/* ═══ PANIER ═══ */
#cart-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(8px);
  z-index: 9000;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.5s;
}
#cart-overlay.show { opacity: 1; pointer-events: auto; }

#cart-panel {
  position: fixed;
  top: 0; right: 0; bottom: 0;
  width: 480px;
  max-width: 92vw;
  background: #0a0a0f;
  z-index: 9001;
  transform: translateX(100%);
  transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  box-shadow: -40px 0 100px rgba(0,0,0,0.6);
  border-left: 1px solid rgba(255,255,255,0.08);
}
#cart-panel.show { transform: translateX(0); }

.cart-head {
  padding: 28px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.cart-head h3 { font-size: 22px; font-weight: 900; }
.cart-close {
  background: none; border: none;
  font-size: 30px; color: #fff;
  cursor: pointer; opacity: 0.5;
  line-height: 1;
  transition: all 0.3s;
}
.cart-close:hover { opacity: 1; transform: rotate(90deg); }

.cart-items { flex: 1; overflow-y: auto; padding: 20px 28px; }

.cart-item {
  display: flex; gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.cart-item img {
  width: 80px; height: 80px;
  object-fit: cover;
  border-radius: 12px;
  background: rgba(255,255,255,0.05);
}
.cart-item-info { flex: 1; display: flex; flex-direction: column; gap: 4px; justify-content: center; }
.cart-item-name { font-size: 13px; font-weight: 600; line-height: 1.3; }
.cart-item-qty { font-size: 11px; opacity: 0.6; }
.cart-item-price { font-size: 15px; font-weight: 800; color: ${accent}; }
.cart-item-remove {
  background: none; border: none;
  color: #fff; opacity: 0.4;
  cursor: pointer; font-size: 22px;
  padding: 4px; align-self: flex-start;
  transition: all 0.3s;
}
.cart-item-remove:hover { opacity: 1; color: #ef4444; transform: scale(1.3) rotate(90deg); }

.cart-empty { text-align: center; padding: 80px 20px; opacity: 0.5; font-size: 14px; }

.cart-foot {
  padding: 28px;
  border-top: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.02);
}
.cart-total {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 20px;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}
.cart-total strong { font-size: 32px; font-weight: 900; color: ${accent}; letter-spacing: -1px; }

.cart-actions { display: flex; flex-direction: column; gap: 12px; }

.cart-btn-stripe {
  width: 100%; padding: 18px;
  background: ${accent}; color: #000;
  border: none; border-radius: 14px;
  font-family: inherit; font-size: 15px;
  font-weight: 900; cursor: pointer;
  transition: all 0.3s;
}
.cart-btn-stripe:hover { transform: translateY(-3px); box-shadow: 0 15px 40px ${accent}60; }
.cart-btn-stripe:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

.cart-btn-paypal {
  width: 100%; padding: 16px;
  background: #ffc439; color: #003087;
  border: none; border-radius: 14px;
  font-family: inherit; font-size: 14px;
  font-weight: 900; cursor: pointer;
  transition: all 0.3s;
}
.cart-btn-paypal:hover { transform: translateY(-3px); box-shadow: 0 15px 40px rgba(255,196,57,0.5); }

/* ═══ TOAST ═══ */
#toast {
  position: fixed;
  bottom: 40px; left: 50%;
  transform: translateX(-50%) translateY(30px) scale(0.85);
  background: ${accent};
  color: #000;
  padding: 16px 28px;
  border-radius: 14px;
  font-weight: 700;
  font-size: 14px;
  box-shadow: 0 15px 40px rgba(0,0,0,0.5);
  z-index: 10000;
  opacity: 0;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: none;
}
#toast.show { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }

/* ═══ PARTICULES ═══ */
.particle { position: fixed; pointer-events: none; z-index: 1; }

.bubble {
  background: rgba(255,255,255,0.06);
  border-radius: 50%;
  bottom: -60px;
  animation: floatUp 15s infinite linear;
}
@keyframes floatUp {
  0% { transform: translateY(0) scale(0.6); opacity: 0; }
  20% { opacity: 0.3; }
  90% { opacity: 0.3; }
  100% { transform: translateY(-120vh) scale(1.1); opacity: 0; }
}

.star {
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 0 6px #fff;
  animation: twinkle 3s infinite ease-in-out;
}
@keyframes twinkle {
  0%, 100% { opacity: 0.2; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
}

.dust {
  width: 3px; height: 3px;
  background: rgba(255,255,255,0.4);
  border-radius: 50%;
  animation: driftDust 12s infinite linear;
}
@keyframes driftDust {
  0% { transform: translate(0, 0); opacity: 0; }
  20% { opacity: 0.6; }
  100% { transform: translate(80px, -200px); opacity: 0; }
}

.ember {
  background: radial-gradient(circle, #ff6b00, transparent);
  border-radius: 50%;
  bottom: -20px;
  animation: floatEmber 6s infinite ease-out;
}
@keyframes floatEmber {
  0% { transform: translateY(0) translateX(0); opacity: 0.9; }
  100% { transform: translateY(-120vh) translateX(60px); opacity: 0; }
}

.snow {
  background: #fff;
  border-radius: 50%;
  top: -20px;
  animation: fallSnow 8s infinite linear;
}
@keyframes fallSnow {
  0% { transform: translateY(0) translateX(0); opacity: 0.9; }
  100% { transform: translateY(120vh) translateX(-40px); opacity: 0; }
}

.leaf {
  width: 12px; height: 12px;
  background: #4ade80;
  border-radius: 50% 0;
  top: -20px;
  animation: fallLeaf 10s infinite ease-in-out;
}
@keyframes fallLeaf {
  0% { transform: translateY(0) rotate(0); opacity: 0.8; }
  100% { transform: translateY(120vh) rotate(720deg); opacity: 0; }
}

.spark {
  width: 4px; height: 4px;
  background: ${accent};
  border-radius: 50%;
  box-shadow: 0 0 12px ${accent};
  animation: sparkle 4s infinite ease-in-out;
}
@keyframes sparkle {
  0%, 100% { opacity: 0.2; transform: scale(0.5); }
  50% { opacity: 1; transform: scale(1.5); }
}

.cloud {
  width: 120px; height: 60px;
  background: radial-gradient(ellipse, rgba(255,255,255,0.12), transparent);
  border-radius: 50%;
  animation: driftCloud 20s infinite linear;
}
@keyframes driftCloud {
  0% { transform: translateX(-100px); opacity: 0; }
  20% { opacity: 0.6; }
  80% { opacity: 0.6; }
  100% { transform: translateX(100vw); opacity: 0; }
}

.matrix {
  color: #00ff41;
  font-family: monospace;
  font-size: 14px;
  font-weight: 900;
  top: -20px;
  animation: fallMatrix 5s infinite linear;
  text-shadow: 0 0 8px #00ff41;
}
@keyframes fallMatrix {
  0% { transform: translateY(0); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(120vh); opacity: 0; }
}

.petal {
  width: 10px; height: 14px;
  background: #f9a8d4;
  border-radius: 50% 0 50% 0;
  top: -20px;
  animation: fallPetal 12s infinite ease-in-out;
}
@keyframes fallPetal {
  0% { transform: translateY(0) rotate(0); opacity: 0.8; }
  100% { transform: translateY(120vh) translateX(80px) rotate(360deg); opacity: 0; }
}

.confetti {
  width: 8px; height: 14px;
  border-radius: 2px;
  top: -20px;
  animation: fallConfetti 8s infinite linear;
}
@keyframes fallConfetti {
  0% { transform: translateY(0) rotate(0); opacity: 1; }
  100% { transform: translateY(120vh) rotate(720deg); opacity: 0; }
}

.glitch {
  width: 60px; height: 2px;
  background: #ff00ff;
  box-shadow: 0 0 12px #ff00ff;
  animation: flicker 3s infinite;
}
@keyframes flicker {
  0%, 100% { opacity: 0; }
  10%, 20%, 30%, 40%, 50%, 60%, 70%, 80%, 90% { opacity: 1; }
  15%, 25%, 35%, 45%, 55%, 65%, 75%, 85%, 95% { opacity: 0.3; }
}

.portal {
  width: 20px; height: 20px;
  border: 2px solid ${accent};
  border-radius: 50%;
  box-shadow: 0 0 20px ${accent};
  animation: portalSpin 6s infinite ease-in-out;
}
@keyframes portalSpin {
  0% { transform: scale(0.5) rotate(0); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: scale(2) rotate(360deg); opacity: 0; }
}

.sand {
  width: 2px; height: 2px;
  background: #d4a961;
  border-radius: 50%;
  top: 50%;
  animation: blowSand 8s infinite linear;
}
@keyframes blowSand {
  0% { transform: translateX(-20px); opacity: 0; }
  20% { opacity: 0.8; }
  100% { transform: translateX(100vw); opacity: 0; }
}

.grid {
  width: 100px; height: 1px;
  background: linear-gradient(90deg, transparent, ${accent}, transparent);
  animation: gridMove 5s infinite linear;
}
@keyframes gridMove {
  0% { transform: translateY(-20px) scaleY(0); opacity: 0; }
  50% { transform: translateY(50vh) scaleY(1); opacity: 1; }
  100% { transform: translateY(120vh) scaleY(0); opacity: 0; }
}

@media (max-width: 768px) {
  #hud-monitor { right: 16px; bottom: 16px; padding: 12px 18px; }
  #hud-monitor div { font-size: 18px; }
  #top-bar { padding: 16px 20px; }
  #brand-logo { font-size: 18px; }
  .scenographic-banner h2 { font-size: 2rem; }
  .scenographic-banner p { font-size: 0.9rem; }
  .product-3d-node { width: 260px; margin-left: -130px; }
  .img-container { height: 190px; }
}
</style>
</head>
<body>

<div id="top-bar">
  <div id="brand-logo">${safeStoreName}</div>
  <button id="cart-button" onclick="openCart()">
    🛒 Panier <span id="cart-count">0</span>
  </button>
</div>

<div id="scroll-track"></div>

<div id="viewport">
  <div id="camera-rig">
    <div class="scenographic-banner" style="transform: translate3d(-50%, -50%, 0)">
      <h2>${cfg.l1[0]}</h2>
      <p>${cfg.l1[1]}</p>
    </div>
    ${render3DLayer(layer1, 0)}

    <div class="scenographic-banner" style="transform: translate3d(-50%, -50%, -2500px)">
      <h2>${cfg.l2[0]}</h2>
      <p>${cfg.l2[1]}</p>
    </div>
    ${render3DLayer(layer2, -2500)}

    <div class="scenographic-banner" style="transform: translate3d(-50%, -50%, -5000px)">
      <h2>${cfg.l3[0]}</h2>
      <p>${cfg.l3[1]}</p>
    </div>
    ${render3DLayer(layer3, -5000)}

    <div class="scenographic-banner" style="transform: translate3d(-50%, -50%, -7500px)">
      <h2>${cfg.l4[0]}</h2>
      <p>${cfg.l4[1]}</p>
    </div>
    ${render3DLayer(layer4, -7500)}
  </div>
</div>

<div id="hud-monitor">
  <span>${cfg.gaugeLabel}</span>
  <div id="gauge-display">0 ${cfg.gaugeUnit}</div>
</div>

<div id="cart-overlay" onclick="closeCart()"></div>
<div id="cart-panel">
  <div class="cart-head">
    <h3>Votre panier</h3>
    <button class="cart-close" onclick="closeCart()">×</button>
  </div>
  <div class="cart-items" id="cart-items"></div>
  <div class="cart-foot">
    <div class="cart-total">
      <span>Total</span>
      <strong id="cart-total">0.00 $</strong>
    </div>
    <div class="cart-actions">
      <button class="cart-btn-stripe" id="checkout-stripe" onclick="checkoutStripe()">💳 Payer avec Stripe</button>
      <button class="cart-btn-paypal" onclick="checkoutPaypal()">🅿️ Payer avec PayPal</button>
    </div>
  </div>
</div>

<div id="toast"></div>

<script>
(function() {
  var API_BASE = window.location.origin;
  var cart = JSON.parse(localStorage.getItem('barry_dropship_cart') || '[]');

  // ═══ MOTEUR LERP (Inertie cinématique) ═══
  var cameraRig = document.getElementById('camera-rig');
  var gaugeDisplay = document.getElementById('gauge-display');
  var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  var isCustomHUD = ${cfg.isCustomHUD ? "true" : "false"};
  var hudRooms = ${JSON.stringify(cfg.hudRooms)};
  var maxVal = ${cfg.maxVal};
  var unit = ${JSON.stringify(cfg.gaugeUnit)};
  var totalDepth = 9600;

  var targetZ = 0;
  var currentZ = 0;
  var ease = 0.05;

  function recalcScroll() {
    maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  }
  window.addEventListener('resize', recalcScroll);
  recalcScroll();

  window.addEventListener('scroll', function() {
    var progress = window.scrollY / maxScroll;
    targetZ = progress * totalDepth;
  }, { passive: true });

  function smoothRender() {
    currentZ += (targetZ - currentZ) * ease;
    cameraRig.style.transform = 'translateZ(' + currentZ + 'px)';
    var smoothProgress = currentZ / totalDepth;

    if (isCustomHUD && hudRooms.length > 0) {
      var idx = Math.min(Math.floor(smoothProgress * hudRooms.length), hudRooms.length - 1);
      gaugeDisplay.innerText = hudRooms[idx];
    } else {
      var val = Math.max(0, smoothProgress * maxVal);
      gaugeDisplay.innerText = val.toFixed(1) + (unit ? ' ' + unit : '');
    }
    requestAnimationFrame(smoothRender);
  }
  requestAnimationFrame(smoothRender);

  // ═══ PARTICULES ═══
  ${particlesJS}

  // ═══ PANIER ═══
  window.addToCart = function(name, price, image, sku) {
    var existing = cart.find(function(item) { return item.sku === sku; });
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ name: name, price: price, image: image, sku: sku, quantity: 1 });
    }
    updateCartUI();
    showToast('✓ ' + name + ' ajouté au panier');
  };

  window.openCart = function() {
    document.getElementById('cart-overlay').classList.add('show');
    document.getElementById('cart-panel').classList.add('show');
    document.body.style.overflow = 'hidden';
  };

  window.closeCart = function() {
    document.getElementById('cart-overlay').classList.remove('show');
    document.getElementById('cart-panel').classList.remove('show');
    document.body.style.overflow = '';
  };

  window.removeFromCart = function(idx) {
    cart.splice(idx, 1);
    updateCartUI();
  };

  function updateCartUI() {
    var count = cart.reduce(function(s, i) { return s + i.quantity; }, 0);
    document.getElementById('cart-count').textContent = count;

    var itemsEl = document.getElementById('cart-items');
    if (cart.length === 0) {
      itemsEl.innerHTML = '<div class="cart-empty">Votre panier est vide</div>';
    } else {
      itemsEl.innerHTML = cart.map(function(item, idx) {
        var safeImg = (item.image || '').replace(/'/g, "\\\\'");
        return '<div class="cart-item">' +
          '<img src="' + item.image + '" alt="" onerror="this.src=\\'https://placehold.co/80x80/0a0a0a/666?text=?\\'" />' +
          '<div class="cart-item-info">' +
            '<div class="cart-item-name">' + item.name + '</div>' +
            '<div class="cart-item-qty">Quantité : ' + item.quantity + '</div>' +
            '<div class="cart-item-price">' + (item.price * item.quantity).toFixed(2) + ' $</div>' +
          '</div>' +
          '<button class="cart-item-remove" onclick="removeFromCart(' + idx + ')">×</button>' +
        '</div>';
      }).join('');
    }

    var total = cart.reduce(function(s, i) { return s + i.price * i.quantity; }, 0);
    document.getElementById('cart-total').textContent = total.toFixed(2) + ' $';
    document.getElementById('checkout-stripe').disabled = cart.length === 0;

    localStorage.setItem('barry_dropship_cart', JSON.stringify(cart));
  }

  window.checkoutStripe = function() {
    if (cart.length === 0) { showToast('Panier vide'); return; }
    var btn = document.getElementById('checkout-stripe');
    btn.disabled = true;
    var orig = btn.textContent;
    btn.textContent = 'Redirection...';
    fetch(API_BASE + '/api/stripe/checkout-cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cart })
    })
    .then(function(r) { return r.json(); })
    .then(function(d) {
      if (d.url) { window.open(d.url, '_blank'); showToast('Paiement ouvert'); }
      else { alert('Erreur Stripe : ' + (d.error || 'inconnue')); }
      btn.disabled = false;
      btn.textContent = orig;
    })
    .catch(function(e) {
      alert('Erreur réseau : ' + e.message);
      btn.disabled = false;
      btn.textContent = orig;
    });
  };

  window.checkoutPaypal = function() {
    if (cart.length === 0) { showToast('Panier vide'); return; }
    var total = cart.reduce(function(s, i) { return s + i.price * i.quantity; }, 0);
    fetch(API_BASE + '/api/paypal/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: total, currency: 'USD', items: cart })
    })
    .then(function(r) { return r.json(); })
    .then(function(d) {
      var link = d.links && d.links.find(function(x) { return x.rel === 'approve'; });
      if (link) { window.open(link.href, '_blank'); }
      else { alert('Erreur PayPal'); }
    })
    .catch(function(e) { alert('Erreur : ' + e.message); });
  };

  function showToast(msg) {
    var t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(function() { t.classList.remove('show'); }, 2500);
  }

  updateCartUI();

  // Fermer le panier avec Échap
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeCart();
  });

  // Éviter de scroller le body quand le panier est ouvert
  document.body.style.overflow = '';
})();
</script>
</body>
</html>`;
}