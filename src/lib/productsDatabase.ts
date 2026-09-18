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

type Theme = { key: string; label: string; base: number; img: string };

const THEMES: Theme[] = [
  { key: "sneakers", label: "Sneakers", base: 89, img: "shoes" },
  { key: "bijoux", label: "Bijoux", base: 45, img: "jewelry" },
  { key: "montres", label: "Montres", base: 149, img: "watch" },
  { key: "tech", label: "Tech", base: 199, img: "electronics" },
  { key: "sacs", label: "Sacs", base: 79, img: "handbag" },
  { key: "lunettes", label: "Lunettes", base: 69, img: "sunglasses" },
  { key: "vetements", label: "Vetements", base: 49, img: "clothing" },
  { key: "cosmetiques", label: "Cosmetiques", base: 35, img: "cosmetics" },
  { key: "parfums", label: "Parfums", base: 59, img: "perfume" },
  { key: "chaussures", label: "Chaussures", base: 99, img: "shoes" },
  { key: "casques", label: "Casques", base: 129, img: "headphones" },
  { key: "enceintes", label: "Enceintes", base: 89, img: "speaker" },
  { key: "montres-connectees", label: "Montres connectees", base: 179, img: "smartwatch" },
  { key: "drones", label: "Drones", base: 249, img: "drone" },
  { key: "accessoires-telephone", label: "Accessoires telephone", base: 25, img: "phone" },
  { key: "gaming", label: "Gaming", base: 79, img: "gaming" },
  { key: "maison", label: "Maison", base: 45, img: "home" },
  { key: "cuisine", label: "Cuisine", base: 39, img: "kitchen" },
  { key: "jardin", label: "Jardin", base: 55, img: "garden" },
  { key: "animaux", label: "Animaux", base: 29, img: "pet" },
  { key: "bebe", label: "Bebe", base: 35, img: "baby" },
  { key: "jouets", label: "Jouets", base: 25, img: "toys" },
  { key: "sport", label: "Sport", base: 59, img: "sport" },
  { key: "fitness", label: "Fitness", base: 69, img: "gym" },
  { key: "yoga", label: "Yoga", base: 45, img: "yoga" },
  { key: "velo", label: "Velo", base: 189, img: "bicycle" },
  { key: "camping", label: "Camping", base: 79, img: "camping" },
  { key: "voyage", label: "Voyage", base: 89, img: "travel" },
  { key: "livres", label: "Livres", base: 19, img: "books" },
  { key: "papeterie", label: "Papeterie", base: 15, img: "stationery" },
  { key: "art", label: "Art", base: 55, img: "art" },
  { key: "musique", label: "Musique", base: 99, img: "music" },
  { key: "instruments", label: "Instruments", base: 199, img: "guitar" },
  { key: "photo", label: "Photo", base: 249, img: "camera" },
  { key: "eclairage", label: "Eclairage", base: 45, img: "lamp" },
  { key: "meubles", label: "Meubles", base: 149, img: "furniture" },
  { key: "chaussons", label: "Chaussons", base: 29, img: "slippers" },
  { key: "bonnets", label: "Bonnets", base: 25, img: "hat" },
  { key: "ceintures", label: "Ceintures", base: 39, img: "belt" },
  { key: "portefeuilles", label: "Portefeuilles", base: 49, img: "wallet" },
  { key: "montres-luxe", label: "Montres de luxe", base: 299, img: "watch" },
  { key: "bagages", label: "Bagages", base: 129, img: "luggage" },
  { key: "outils", label: "Outils", base: 69, img: "tools" },
  { key: "bricolage", label: "Bricolage", base: 79, img: "diy" },
  { key: "auto", label: "Auto", base: 89, img: "car" },
  { key: "moto", label: "Moto", base: 119, img: "motorcycle" },
  { key: "chocolat", label: "Chocolat", base: 19, img: "chocolate" },
  { key: "cafe", label: "Cafe", base: 25, img: "coffee" },
  { key: "the", label: "The", base: 22, img: "tea" },
  { key: "vins", label: "Vins", base: 45, img: "wine" },
  { key: "beaute", label: "Beaute", base: 29, img: "beauty" },
  { key: "soins-visage", label: "Soins visage", base: 35, img: "skincare" },
  { key: "massage", label: "Massage", base: 45, img: "massage" },
];

const ADJECTIVES: string[] = [
  "Premium", "Deluxe", "Pro", "Elite", "Classic", "Modern", "Urban", "Vintage",
  "Luxe", "Signature", "Limited", "Collection", "Sport", "Casual",
  "Elegant", "Raffine", "Tendance", "Iconique", "Exclusif", "Nouveau",
];

const COLORS: string[] = [
  "Noir", "Blanc", "Rouge", "Bleu", "Vert", "Jaune", "Orange", "Rose",
  "Violet", "Gris", "Marron", "Beige", "Dore", "Argente", "Turquoise",
  "Bordeaux", "Kaki", "Marine", "Creme", "Corail",
];

const BADGES: string[] = ["BEST-SELLER", "NOUVEAU", "PROMO", "TOP", "LUXE", "PREMIUM", "EXCLUSIF"];

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function generateProducts(): Product[] {
  const products: Product[] = [];
  const TOTAL_PER_THEME = 100;

  for (let t = 0; t < THEMES.length; t++) {
    const theme = THEMES[t];
    for (let i = 0; i < TOTAL_PER_THEME; i++) {
      const seed = theme.key.length * 1000 + i * 7 + 42;
      const adj = ADJECTIVES[Math.floor(seededRandom(seed) * ADJECTIVES.length)];
      const color = COLORS[Math.floor(seededRandom(seed + 1) * COLORS.length)];
      const badge = BADGES[Math.floor(seededRandom(seed + 2) * BADGES.length)];

      const variation = seededRandom(seed + 3) * 0.8 + 0.6;
      const price = Math.round(theme.base * variation * 100) / 100;
      const oldPrice = Math.round(price * 1.3 * 100) / 100;

      const rating = Math.round((4.2 + seededRandom(seed + 4) * 0.7) * 10) / 10;
      const reviews = Math.floor(20 + seededRandom(seed + 5) * 800);

      const imgSeed = Math.floor(seededRandom(seed + 6) * 99999);
      const image = "https://loremflickr.com/600/600/" + theme.img + "?lock=" + imgSeed;

      products.push({
        id: theme.key + "-" + i,
        name: theme.label + " " + adj + " " + color,
        description: theme.label + " qualite superieure - " + adj.toLowerCase() + " et " + color.toLowerCase() + ".",
        price: price,
        oldPrice: oldPrice,
        image: image,
        rating: rating,
        reviews: reviews,
        badge: badge,
        sku: theme.key.toUpperCase().slice(0, 3) + "-" + String(i + 1).padStart(3, "0"),
        category: theme.key,
      });
    }
  }

  return products;
}

let cachedProducts: Product[] | null = null;

export function getProducts(): Product[] {
  if (!cachedProducts) {
    cachedProducts = generateProducts();
  }
  return cachedProducts;
}

export function getRandomProducts(count: number = 20, category?: string): Product[] {
  const all = getProducts();
  const pool = category
    ? all.filter(function (p) {
        return p.category === category || p.name.toLowerCase().indexOf(category.toLowerCase()) !== -1;
      })
    : all;

  const source = pool.length >= count ? pool : all;
  const shuffled = source.slice().sort(function () {
    return Math.random() - 0.5;
  });
  return shuffled.slice(0, count);
}

export function getCategories(): { key: string; label: string }[] {
  return THEMES.map(function (t) {
    return { key: t.key, label: t.label };
  });
}

export function searchProducts(query: string, limit: number = 100): Product[] {
  const q = query.toLowerCase().trim();
  if (!q) return getProducts().slice(0, limit);

  const words = q.split(/\s+/);
  const scored = getProducts()
    .map(function (p) {
      let score = 0;
      const text = (p.name + " " + p.description + " " + p.category).toLowerCase();
      for (let w = 0; w < words.length; w++) {
        const word = words[w];
        if (text.indexOf(word) !== -1) score += 1;
        if (p.name.toLowerCase().indexOf(word) !== -1) score += 2;
        if (p.category.toLowerCase() === word) score += 5;
      }
      return { product: p, score: score };
    })
    .filter(function (x) {
      return x.score > 0;
    })
    .sort(function (a, b) {
      return b.score - a.score;
    });

  return scored.slice(0, limit).map(function (x) {
    return x.product;
  });
}