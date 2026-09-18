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
};

const rand = <T>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const FONTS = [
  { name: "Inter", google: "Inter:wght@400;600;700;900", fallback: "sans-serif" },
  { name: "Poppins", google: "Poppins:wght@400;600;700;900", fallback: "sans-serif" },
  { name: "Playfair Display", google: "Playfair+Display:wght@400;600;700;900", fallback: "serif" },
  { name: "Montserrat", google: "Montserrat:wght@400;600;700;900", fallback: "sans-serif" },
  { name: "Raleway", google: "Raleway:wght@400;600;700;900", fallback: "sans-serif" },
  { name: "DM Sans", google: "DM+Sans:wght@400;600;700;900", fallback: "sans-serif" },
  { name: "Space Grotesk", google: "Space+Grotesk:wght@400;600;700", fallback: "sans-serif" },
  { name: "Outfit", google: "Outfit:wght@400;600;700;900", fallback: "sans-serif" },
];

const PALETTES = [
  { bg: "#ffffff", text: "#111111", accent: "#111111", accentText: "#ffffff", card: "#ffffff", border: "#eeeeee" },
  { bg: "#0a0a0a", text: "#f5f5f5", accent: "#d4af37", accentText: "#0a0a0a", card: "#141414", border: "#2a2a2a" },
  { bg: "#faf7f2", text: "#2d2d2d", accent: "#8b5a3c", accentText: "#ffffff", card: "#ffffff", border: "#e8e0d5" },
  { bg: "#f0f9ff", text: "#0c4a6e", accent: "#0284c7", accentText: "#ffffff", card: "#ffffff", border: "#bae6fd" },
  { bg: "#fdf4ff", text: "#4a044e", accent: "#a21caf", accentText: "#ffffff", card: "#ffffff", border: "#f5d0fe" },
  { bg: "#fff7ed", text: "#7c2d12", accent: "#ea580c", accentText: "#ffffff", card: "#ffffff", border: "#fed7aa" },
  { bg: "#f0fdf4", text: "#14532d", accent: "#16a34a", accentText: "#ffffff", card: "#ffffff", border: "#bbf7d0" },
  { bg: "#1a1a2e", text: "#eaeaea", accent: "#e94560", accentText: "#ffffff", card: "#16213e", border: "#0f3460" },
];

const CARD_STYLES = [
  { radius: "16px", shadow: "0 4px 20px rgba(0,0,0,0.06)", hover: "translateY(-6px)" },
  { radius: "0px", shadow: "none", hover: "translateY(0)" },
  { radius: "24px", shadow: "0 12px 32px rgba(0,0,0,0.12)", hover: "translateY(-8px) scale(1.02)" },
];

const BUTTON_STYLES = [
  { radius: "8px", padding: "12px", transform: "none", fontWeight: "600", uppercase: false },
  { radius: "100px", padding: "14px", transform: "scale(1.03)", fontWeight: "700", uppercase: false },
  { radius: "0px", padding: "14px", transform: "none", fontWeight: "700", uppercase: true },
];

export function buildDropshippingSite(
  storeName: string,
  tagline: string,
  category: string = "produits varies",
  color?: Color,
  mood?: Mood,
  forcedStyle?: string,
  products: ProductInput[] = []
): string {
  const font = rand(FONTS);
  const palette = rand(PALETTES);
  const card = rand(CARD_STYLES);
  const button = rand(BUTTON_STYLES);
  const gridSize = randInt(240, 300);
  const gapSize = randInt(20, 32);
  const priceFontSize = randInt(20, 28);

  const accentColor = color?.primary || palette.accent;
  const accentTextColor = palette.accentText;

  let productsHTML = "";
  if (products.length === 0) {
    productsHTML = '<div class="loading">Aucun produit disponible</div>';
  } else {
    const cards: string[] = [];
    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      const name = String(p.name || "").replace(/'/g, "").replace(/"/g, "").replace(/</g, "").replace(/>/g, "");
      const price = Number(p.price) || 49.99;
      const oldPrice = Number(p.oldPrice) || price * 1.3;
      const image = p.image || "https://placehold.co/400x400/f5f5f5/999?text=Produit";
      const rating = p.rating || 4.5;
      const reviews = p.reviews || 100;
      const badge = p.badge || "";
      const sku = p.sku || "";
      const stars = "★".repeat(Math.round(rating)) + "☆".repeat(5 - Math.round(rating));

      let cardHTML = '<div class="card">';
      cardHTML += '<div class="card-img">';
      cardHTML += '<img src="' + image + '" alt="' + name + '" onerror="this.src=\'https://placehold.co/400x400/f5f5f5/999?text=Produit\'" />';
      if (badge) cardHTML += '<span class="card-badge">' + badge + "</span>";
      cardHTML += "</div>";
      cardHTML += '<div class="card-body">';
      cardHTML += '<div class="card-title">' + name + "</div>";
      cardHTML += '<div class="card-rating"><span class="stars">' + stars + '</span> <span class="reviews">' + reviews + " avis</span></div>";
      cardHTML += '<div class="card-price">' + price.toFixed(2) + " €";
      if (oldPrice > price) cardHTML += '<span class="card-old">' + oldPrice.toFixed(2) + " €</span>";
      cardHTML += "</div>";
      cardHTML += '<div class="card-actions">';
      cardHTML += '<button class="btn btn-buy" onclick="buyStripe(this,\'' + name + "'," + price + ",'" + image + "','" + sku + '\')">Ajouter au panier</button>';
      cardHTML += '<button class="btn btn-paypal" onclick="buyPaypal(this,\'' + name + "'," + price + ')">Payer avec PayPal</button>';
      cardHTML += "</div>";
      cardHTML += "</div>";
      cardHTML += "</div>";
      cards.push(cardHTML);
    }
    productsHTML = cards.join("");
  }

  const googleFontsLink = "https://fonts.googleapis.com/css2?family=" + font.google + "&display=swap";

  const cssLines = [
    "*{margin:0;padding:0;box-sizing:border-box}",
    "html{scroll-behavior:smooth}",
    "body{font-family:'" + font.name + "'," + font.fallback + ";background:" + palette.bg + ";color:" + palette.text + ";overflow-x:hidden;line-height:1.5;min-height:100vh}",
    "a{text-decoration:none;color:inherit;cursor:pointer}",
    "header{position:sticky;top:0;z-index:100;background:" + palette.bg + ";border-bottom:1px solid " + palette.border + ";padding:18px 0}",
    ".nav{max-width:1400px;margin:0 auto;padding:0 32px;display:flex;align-items:center;justify-content:space-between;gap:32px}",
    ".logo{font-size:22px;font-weight:700;color:" + accentColor + "}",
    ".nav nav{display:flex;gap:28px;font-size:14px;font-weight:500}",
    ".nav nav a{color:" + palette.text + ";opacity:.7}",
    ".cart-btn{font-size:14px;font-weight:600;color:" + accentColor + "}",
    ".hero{text-align:center;padding:100px 0 80px}",
    ".hero-content{max-width:900px;margin:0 auto;padding:0 32px}",
    ".hero h1{font-size:clamp(40px,7vw,80px);font-weight:900;line-height:1.05;margin-bottom:24px}",
    ".hero p{font-size:18px;opacity:.65;max-width:560px;margin:0 auto 40px}",
    ".hero-cta{display:inline-block;background:" + accentColor + ";color:" + accentTextColor + ";padding:16px 40px;font-size:14px;font-weight:600;border-radius:" + button.radius + "}",
    ".container{max-width:1400px;margin:0 auto;padding:80px 32px}",
    ".section-title{font-size:32px;font-weight:700;margin-bottom:48px;text-align:center}",
    ".grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(" + gridSize + "px,1fr));gap:" + gapSize + "px}",
    ".card{background:" + palette.card + ";border-radius:" + card.radius + ";overflow:hidden;transition:all .3s;border:1px solid " + palette.border + ";display:flex;flex-direction:column}",
    ".card:hover{transform:" + card.hover + "}",
    ".card-img{aspect-ratio:1;padding:20px;display:flex;align-items:center;justify-content:center;overflow:hidden;position:relative;background:" + palette.card + "}",
    ".card-img img{width:100%;height:100%;object-fit:contain}",
    ".card-badge{position:absolute;top:12px;left:12px;background:" + accentColor + ";color:" + accentTextColor + ";font-size:10px;font-weight:700;padding:4px 10px;border-radius:4px;text-transform:uppercase}",
    ".card-body{padding:20px;display:flex;flex-direction:column;gap:10px;flex:1}",
    ".card-title{font-size:14px;font-weight:600;line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:40px}",
    ".card-rating{font-size:12px;opacity:.7;display:flex;align-items:center;gap:6px}",
    ".stars{color:#f59e0b}",
    ".card-price{font-size:" + priceFontSize + "px;font-weight:800;color:" + accentColor + ";display:flex;align-items:baseline;gap:8px}",
    ".card-old{font-size:13px;opacity:.5;text-decoration:line-through;font-weight:400}",
    ".card-actions{display:flex;flex-direction:column;gap:8px;margin-top:auto;padding-top:8px}",
    ".btn{width:100%;padding:" + button.padding + ";border:none;border-radius:" + button.radius + ";font-family:inherit;font-size:13px;font-weight:" + button.fontWeight + ";cursor:pointer}",
    ".btn-buy{background:" + accentColor + ";color:" + accentTextColor + "}",
    ".btn-paypal{background:#ffc439;color:#003087}",
    ".loading{grid-column:1/-1;text-align:center;padding:80px 0;opacity:.5}",
    "footer{border-top:1px solid " + palette.border + ";padding:60px 32px 40px;text-align:center;margin-top:80px}",
    "footer p{font-size:13px;opacity:.5;margin-bottom:8px}",
    "@media(max-width:768px){.nav{padding:0 20px;gap:16px}.nav nav{display:none}.container{padding:60px 20px}.hero h1{font-size:36px}.grid{grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:16px}}",
  ];
  const css = cssLines.join("\n");

  const htmlLines = [
    "<!DOCTYPE html>",
    '<html lang="fr">',
    "<head>",
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    "<title>" + storeName + "</title>",
    '<link rel="preconnect" href="https://fonts.googleapis.com">',
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
    '<link href="' + googleFontsLink + '" rel="stylesheet">',
    "<style>" + css + "</style>",
    "</head>",
    "<body>",
    "<header>",
    '<div class="nav">',
    '<a href="#" class="logo">' + storeName + "</a>",
    "<nav>",
    '<a href="#products">Boutique</a>',
    '<a href="#about">A propos</a>',
    '<a href="#contact">Contact</a>',
    "</nav>",
    '<a href="#" class="cart-btn">Panier</a>',
    "</div>",
    "</header>",
    '<section class="hero">',
    '<div class="hero-content">',
    "<h1>" + storeName + "</h1>",
    "<p>" + tagline + "</p>",
    '<a href="#products" class="hero-cta">Decouvrir la collection</a>',
    "</div>",
    "</section>",
    '<div class="container" id="products">',
    '<h2 class="section-title">Nos produits</h2>',
    '<div class="grid">' + productsHTML + "</div>",
    "</div>",
    '<footer id="contact">',
    '<p><strong style="font-size:16px;opacity:1;color:' + accentColor + '">' + storeName + "</strong></p>",
    "<p>" + tagline + "</p>",
    "<p>2026 " + storeName + " - Paiement securise Stripe & PayPal</p>",
    "</footer>",
    "<script>",
    "window.buyStripe = function(b, n, p, i, s){",
    "  b.disabled = true; var t = b.textContent; b.textContent = '...';",
    "  fetch('/api/stripe/checkout-product', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({productName:n, price:p, imageUrl:i, sku:s})})",
    "  .then(function(r){return r.json();})",
    "  .then(function(d){ if(d.url) window.open(d.url, '_blank'); b.disabled=false; b.textContent=t; })",
    "  .catch(function(){ b.disabled=false; b.textContent=t; });",
    "};",
    "window.buyPaypal = function(b, n, p){",
    "  b.disabled = true; var t = b.textContent; b.textContent = '...';",
    "  fetch('/api/paypal/create-order', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({amount:p, currency:'EUR', productName:n})})",
    "  .then(function(r){return r.json();})",
    "  .then(function(d){",
    "    var l = d.links && d.links.find(function(x){return x.rel === 'approve';});",
    "    if(l) window.open(l.href, '_blank');",
    "    b.disabled=false; b.textContent=t;",
    "  })",
    "  .catch(function(){ b.disabled=false; b.textContent=t; });",
    "};",
    "</script>",
    "</body>",
    "</html>",
  ];
  return htmlLines.join("\n");
}