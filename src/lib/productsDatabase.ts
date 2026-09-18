// ═══════════════════════════════════════════════════════════════
// Bibliothèque globale de 5000 produits (génération programmatique)
// Aucun contenu adulte, uniquement des produits classiques
// ═══════════════════════════════════════════════════════════════

export type Product = {
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
  category: string;
};

// 50 thèmes × 100 variantes = 5000 produits
const THEMES = [
  { key: "sneakers", label: "Sneakers", base: 89, img: "shoes" },
  { key: "bijoux", label: "Bijoux", base: 45, img: "jewelry" },
  { key: "montres", label: "Montres", base: 149, img: "watch" },
  { key: "tech", label: "Tech", base: 199, img: "electronics" },
  { key: "sacs", label: "Sacs", base: 79, img: "handbag" },
  { key: "lunettes", label: "Lunettes", base: 69, img: "sunglasses" },
  { key: "vetements", label: "Vêtements", base: 49, img: "clothing" },
  { key: "cosmetiques", label: "Cosmétiques", base: 35, img: "cosmetics" },
  { key: "parfums", label: "Parfums", base: 59, img: "perfume" },
  { key: "chaussures", label: "Chaussures", base: 99, img: "shoes" },
  { key: "casques", label: "Casques audio", base: 129, img: "headphones" },
  { key: "enceintes", label: "Enceintes", base: 89, img: "speaker" },
  { key: "montres-connectees", label: "Montres connectées", base: 179, img: "smartwatch" },
  { key: "drones", label: "Drones", base: 249, img: "drone" },
  { key: "accessoires-telephone", label: "Accessoires téléphone", base: 25, img: "phone" },
  { key: "gaming", label: "Gaming", base: 79, img: "gaming" },
  { key: "maison", label: "Maison", base: 45, img: "home" },
  { key: "cuisine", label: "Cuisine", base: 39, img: "kitchen" },
  { key: "jardin", label: "Jardin", base: 55, img: "garden" },
  { key: "animaux", label: "Animaux", base: 29, img: "pet" },
  { key: "bebe", label: "Bébé", base: 35, img: "baby" },
  { key: "jouets", label: "Jouets", base: 25, img: "toys" },
  { key: "sport", label: "Sport", base: 59, img: "sport" },
  { key: "fitness", label: "Fitness", base: 69, img: "gym" },
  { key: "yoga", label: "Yoga", base: 45, img: "yoga" },
  { key: "velo", label: "Vélo", base: 189, img: "bicycle" },
  { key: "camping", label: "Camping", base: 79, img: "camping" },
  { key: "voyage", label: "Voyage", base: 89, img: "travel" },
  { key: "livres", label: "Livres", base: 19, img: "books" },
  { key: "papeterie", label: "Papeterie", base: 15, img: "stationery" },
  { key: "art", label: "Art & Décoration", base: 55, img: "art" },
  { key: "musique", label: "Musique", base: 99, img: "music" },
  { key: "instruments", label: "Instruments", base: 199, img: "guitar" },
  { key: "photo", label: "Photo", base: 249, img: "camera" },
  { key: "eclairage", label: "Éclairage", base: 45, img: "lamp" },
  { key: "meubles", label: "Meubles", base: 149, img: "furniture" },
  { key: "chaussons", label: "Chaussons", base: 29, img: "slippers" },
  { key: "bonnets", label: "Bonnets", base: 25, img: "hat" },
  { key: "ceintures", label: "Ceintures", base: 39, img: "belt" },
  { key: "portefeuilles", label: "Portefeuilles", base: 49, img: "wallet" },
  { key: "montres-luxe", label: "Montres de luxe", base: 299, img: "luxury-watch" },
  { key: "bagages", label: "Bagages", base: 129, img: "luggage" },
  { key: "outils", label: "Outils", base: 69, img: "tools" },
  { key: "bricolage", label: "Bricolage", base: 79, img: "diy" },
  { key: "auto", label: "Auto", base: 89, img: "car" },
  { key: "moto", label: "Moto", base: 119, img: "motorcycle" },
  { key: "chocolat", label: "Chocolat", base: 19, img: "chocolate" },
  { key: "cafe", label: "Café", base: 25, img: "coffee" },
  { key: "the", label: "Thé", base: 22, img: "tea" },
  { key: "vins", label: "Vins & Spiritueux", base: 45, img: "wine" },
];

const ADJECTIVES = [
  "Premium", "Deluxe", "Pro", "Elite", "Classic", "Modern", "Urban", "Vintage",
  "Luxe", "Signature", "Édition Limitée", "Collection", "Sport", "Casual",
  "Élégant", "Raffiné", "Tendance", "Iconique", "Exclusif", "Nouveau",
];

const COLORS = [
  "Noir", "Blanc", "Rouge", "Bleu", "Vert", "Jaune", "Orange", "Rose",
  "Violet", "Gris", "Marron", "Beige", "Doré", "Argenté", "Turquoise",
  "Bordeaux", "Kaki", "Marine", "Crème", "Corail",
];

const BADGES = ["BEST-SELLER", "NOUVEAU", "PROMO", "TOP", "LUXE", "PREMIUM", "EXCLUSIF"];

// Générateur pseudo-aléatoire stable (seed)
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Génère 5000 produits
export function generateProducts(): Product[] {
  const products: Product[] = [];
  const TOTAL_PER_THEME = 100; // 50 × 100 = 5000

  for (const theme of THEMES) {
    for (let i = 0; i < TOTAL_PER_THEME; i++) {
      const seed = theme.key.length * 1000 + i * 7 + 42;
      const adj = ADJECTIVES[Math.floor(seededRandom(seed) * ADJECTIVES.length)];
      const color = COLORS[Math.floor(seededRandom(seed + 1) * COLORS.length)];
      const badge = BADGES[Math.floor(seededRandom(seed + 2) * BADGES.length)];

      // Prix avec variation
      const variation = seededRandom(seed + 3) * 0.8 + 0.6; // 0.6 à 1.4
      const price = Math.round(theme.base * variation * 100) / 100;
      const oldPrice = Math.round(price * 1.3 * 100) / 100;

      // Note et avis
      const rating = Math.round((4.2 + seededRandom(seed + 4) * 0.7) * 10) / 10;
      const reviews = Math.floor(20 + seededRandom(seed + 5) * 800);

      // Image Unsplash stable (avec lock pour la cohérence)
            // Mot-clé plus précis pour l'image (thème + couleur)
      const imgKeyword = encodeURIComponent(`${theme.img} ${color.toLowerCase()}`);
      const imgSeed = Math.floor(seededRandom(seed + 6) * 9999);
      const image = `https://source.unsplash.com/600x600/?${imgKeyword}&sig=${imgSeed}`;

      products.push({
        id: `${theme.key}-${i}`,
        name: `${theme.label} ${adj} ${color}`,
        description: `${theme.label} de qualité supérieure — ${adj.toLowerCase()} et ${color.toLowerCase()}. Parfait pour un usage quotidien ou un look soigné.`,
        price,
        oldPrice,
        image,
        rating,
        reviews,
        badge,
        sku: `${theme.key.toUpperCase().slice(0, 3)}-${(i + 1).toString().padStart(3, "0")}`,
        category: theme.key,
      });
    }
  }

  return products;
}

// Cache pour ne pas régénérer à chaque appel
let cachedProducts: Product[] | null = null;

export function getProducts(): Product[] {
  if (!cachedProducts) {
    cachedProducts = generateProducts();
  }
  return cachedProducts;
}

// Récupère N produits aléatoires d'une catégorie (ou de toutes)
export function getRandomProducts(count: number = 20, category?: string): Product[] {
  const all = getProducts();
  const pool = category
    ? all.filter((p) => p.category === category || p.name.toLowerCase().includes(category.toLowerCase()))
    : all;

  const source = pool.length >= count ? pool : all;
  const shuffled = [...source].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Liste des catégories disponibles
export function getCategories(): { key: string; label: string }[] {
  return THEMES.map((t) => ({ key: t.key, label: t.label }));
}

// Recherche textuelle dans les 5000 produits
export function searchProducts(query: string, limit: number = 100): Product[] {
  const q = query.toLowerCase().trim();
  if (!q) return getProducts().slice(0, limit);

  const words = q.split(/\s+/);
  const scored = getProducts()
    .map((p) => {
      let score = 0;
      const text = (p.name + " " + p.description + " " + p.category).toLowerCase();
      for (const w of words) {
        if (text.includes(w)) score += 1;
        if (p.name.toLowerCase().includes(w)) score += 2;
        if (p.category.toLowerCase() === w) score += 5;
      }
      return { product: p, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((x) => x.product);
}