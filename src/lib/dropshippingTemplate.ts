// ═══════════════════════════════════════════════════════════════
// Générateur de boutiques dropshipping — design unique à l'infini
// ═══════════════════════════════════════════════════════════════

type Color = { primary: string; secondary: string };
type Mood = { id: string; name: string };

// ─── UTILITAIRES ALÉATOIRES ────────────────────────────────────
const rand = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// ─── POLICES ───────────────────────────────────────────────────
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

// ─── PALETTES PRÉ-DÉFINIES (design cohérent) ──────────────────
const PALETTES = [
  { bg: "#ffffff", text: "#111111", accent: "#111111", accentText: "#ffffff", card: "#ffffff", border: "#eeeeee" },
  { bg: "#0a0a0a", text: "#f5f5f5", accent: "#d4af37", accentText: "#0a0a0a", card: "#141414", border: "#2a2a2a" },
  { bg: "#faf7f2", text: "#2d2d2d", accent: "#8b5a3c", accentText: "#ffffff", card: "#ffffff", border: "#e8e0d5" },
  { bg: "#f0f9ff", text: "#0c4a6e", accent: "#0284c7", accentText: "#ffffff", card: "#ffffff", border: "#bae6fd" },
  { bg: "#fdf4ff", text: "#4a044e", accent: "#a21caf", accentText: "#ffffff", card: "#ffffff", border: "#f5d0fe" },
  { bg: "#fff7ed", text: "#7c2d12", accent: "#ea580c", accentText: "#ffffff", card: "#ffffff", border: "#fed7aa" },
  { bg: "#f0fdf4", text: "#14532d", accent: "#16a34a", accentText: "#ffffff", card: "#ffffff", border: "#bbf7d0" },
  { bg: "#fef2f2", text: "#7f1d1d", accent: "#dc2626", accentText: "#ffffff", card: "#ffffff", border: "#fecaca" },
  { bg: "#1a1a2e", text: "#eaeaea", accent: "#e94560", accentText: "#ffffff", card: "#16213e", border: "#0f3460" },
  { bg: "#0f172a", text: "#e2e8f0", accent: "#38bdf8", accentText: "#0f172a", card: "#1e293b", border: "#334155" },
  { bg: "#fef9f3", text: "#1f1f1f", accent: "#f97316", accentText: "#ffffff", card: "#ffffff", border: "#fde4c7" },
  { bg: "#f5f5f5", text: "#000000", accent: "#000000", accentText: "#ffffff", card: "#ffffff", border: "#e0e0e0" },
];

// ─── STYLES DE CARTES ─────────────────────────────────────────
const CARD_STYLES = [
  { radius: "16px", shadow: "0 4px 20px rgba(0,0,0,0.06)", hover: "translateY(-6px)", border: "1px solid" },
  { radius: "0px", shadow: "none", hover: "translateY(0)", border: "1px solid" },
  { radius: "24px", shadow: "0 12px 32px rgba(0,0,0,0.12)", hover: "translateY(-8px) scale(1.02)", border: "none" },
  { radius: "8px", shadow: "0 2px 8px rgba(0,0,0,0.04)", hover: "translateY(-2px)", border: "none" },
  { radius: "4px", shadow: "0 8px 24px rgba(0,0,0,0.15)", hover: "translateY(-4px)", border: "none" },
];

// ─── STYLES DE BOUTONS ────────────────────────────────────────
const BUTTON_STYLES = [
  { radius: "8px", padding: "12px", transform: "none", fontWeight: "600" },
  { radius: "100px", padding: "14px", transform: "scale(1.03)", fontWeight: "700" },
  { radius: "0px", padding: "14px", transform: "none", fontWeight: "700", uppercase: true },
  { radius: "6px", padding: "13px", transform: "translateY(-1px)", fontWeight: "600" },
];

// ─── TYPES DE HEADER ──────────────────────────────────────────
const HEADER_STYLES = [
  "left",     // logo à gauche, nav à droite
  "center",   // tout centré
  "minimal",  // juste le logo
  "spread",   // logo / nav centre / panier droite
];

// ─── TYPES DE HERO ────────────────────────────────────────────
const HERO_STYLES = [
  "big",      // grand titre plein écran
  "split",    // texte à gauche, rien à droite (punchy)
  "compact",  // hero court et efficace
];

// ─── TYPES DE GRILLE ──────────────────────────────────────────
const GRID_STYLES = [
  "auto-200", // minmax(200px, 1fr)
  "auto-240", // minmax(240px, 1fr)
  "auto-280", // minmax(280px, 1fr)
  "auto-320", // minmax(320px, 1fr)
];

// ═══════════════════════════════════════════════════════════════
// FONCTION PRINCIPALE
// ═══════════════════════════════════════════════════════════════
export function buildDropshippingSite(
  storeName: string,
  tagline: string,
  category: string = "produits varies",
  color?: Color,
  mood?: Mood,
  forcedStyle?: string
): string {
  // 🎲 Tirage aléatoire
  const font = rand(FONTS);
  const palette = rand(PALETTES);
  const card = rand(CARD_STYLES);
  const button = rand(BUTTON_STYLES);
  const headerStyle = rand(HEADER_STYLES);
  const heroStyle = rand(HERO_STYLES);
  const gridStyle = rand(GRID_STYLES);
  const useUpper = Math.random() > 0.5;

  const accentColor = color?.primary || palette.accent;
  const accentTextColor = palette.accentText;

  // Header HTML selon le style
  let headerHTML = "";
  if (headerStyle === "left") {
    headerHTML = `
<header>
  <div class="nav nav-left">
    <div class="logo">${storeName}</div>
    <nav><a>Boutique</a><a>À propos</a><a>Contact</a></nav>
  </div>
</header>`;
  } else if (headerStyle === "center") {
    headerHTML = `
<header>
  <div class="nav nav-center">
    <nav><a>Boutique</a><a>À propos</a><a>Contact</a></nav>
    <div class="logo">${storeName}</div>
    <nav><a>Panier</a><a>Compte</a></nav>
  </div>
</header>`;
  } else if (headerStyle === "minimal") {
    headerHTML = `
<header>
  <div class="nav nav-left">
    <div class="logo">${storeName}</div>
    <nav><a>Panier →</a></nav>
  </div>
</header>`;
  } else {
    headerHTML = `
<header>
  <div class="nav nav-spread">
    <div class="logo">${storeName}</div>
    <nav><a>Boutique</a><a>Promos</a><a>Contact</a></nav>
    <div class="cart">🛒 Panier</div>
  </div>
</header>`;
  }

  // Hero HTML selon le style
  let heroHTML = "";
  if (heroStyle === "big") {
    heroHTML = `
<section class="hero hero-big">
  <h1>${storeName}</h1>
  <p>${tagline}</p>
  <button onclick="document.getElementById('products').scrollIntoView({behavior:'smooth'})">Découvrir</button>
</section>`;
  } else if (heroStyle === "split") {
    heroHTML = `
<section class="hero hero-split">
  <div>
    <h1>${storeName}</h1>
    <p>${tagline}</p>
    <button onclick="document.getElementById('products').scrollIntoView({behavior:'smooth'})">Explorer →</button>
  </div>
</section>`;
  } else {
    heroHTML = `
<section class="hero hero-compact">
  <h1>${storeName}</h1>
  <p>${tagline}</p>
  <button onclick="document.getElementById('products').scrollIntoView({behavior:'smooth'})">Voir les produits</button>
</section>`;
  }

  // CSS des polices Google
  const googleFontsLink = `https://fonts.googleapis.com/css2?family=${font.google}&display=swap`;

  // CSS global
  const css = `
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{font-family:'${font.name}',${font.fallback};background:${palette.bg};color:${palette.text};overflow-x:hidden;line-height:1.5}
a{text-decoration:none;color:inherit;cursor:pointer}
header{padding:24px 0;border-bottom:1px solid ${palette.border}}
.nav{max-width:1400px;margin:0 auto;padding:0 32px;display:flex;align-items:center}
.nav-left{justify-content:space-between}
.nav-center{justify-content:space-between;text-align:center}
.nav-spread{justify-content:space-between}
.logo{font-size:24px;font-weight:${useUpper ? "900" : "700"};${useUpper ? "text-transform:uppercase;letter-spacing:2px;" : "letter-spacing:-0.5px;"}color:${accentColor}}
.nav nav{display:flex;gap:32px;font-size:14px;font-weight:500}
.nav nav a{transition:opacity .2s;opacity:.7}
.nav nav a:hover{opacity:1;color:${accentColor}}
.cart{font-size:14px;font-weight:600}
.hero{padding:100px 32px;text-align:center;background:${palette.bg}}
.hero h1{font-size:clamp(40px,7vw,96px);font-weight:${useUpper ? "900" : "700"};line-height:1;margin-bottom:24px;letter-spacing:${useUpper ? "2px" : "-2px"};${useUpper ? "text-transform:uppercase;" : ""}color:${palette.text}}
.hero p{font-size:18px;opacity:.65;max-width:560px;margin:0 auto 40px}
.hero button{background:${accentColor};color:${accentTextColor};border:none;padding:16px 40px;font-family:inherit;font-size:14px;font-weight:${button.fontWeight};border-radius:${button.radius};cursor:pointer;transition:all .25s;${button.uppercase ? "text-transform:uppercase;letter-spacing:2px;" : ""}}
.hero button:hover{transform:${button.transform}}
.hero-big{padding:120px 32px}
.hero-compact{padding:60px 32px}
.hero-split{text-align:left;max-width:1400px;margin:0 auto;padding:120px 32px}
.hero-split h1{max-width:800px}
.hero-split p{max-width:500px;margin:0 0 40px}
.container{max-width:1400px;margin:0 auto;padding:60px 32px}
.section-title{font-size:28px;font-weight:700;margin-bottom:40px;color:${palette.text}}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(${gridStyle.split("-")[1]}px,1fr));gap:${randInt(16, 32)}px}
.card{background:${palette.card};border-radius:${card.radius};overflow:hidden;transition:all .3s;cursor:pointer;${card.border === "1px solid" ? `border:1px solid ${palette.border};` : ""}${card.shadow !== "none" ? `box-shadow:${card.shadow};` : ""}}
.card:hover{transform:${card.hover};${card.shadow !== "none" ? `box-shadow:0 16px 40px rgba(0,0,0,0.15);` : `border-color:${accentColor};`}}
.card-img{aspect-ratio:1;padding:20px;background:${palette.card};display:flex;align-items:center;justify-content:center}
.card-img img{width:100%;height:100%;object-fit:contain}
.card-body{padding:20px}
.card-title{font-size:15px;font-weight:600;margin-bottom:12px;min-height:44px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;color:${palette.text}}
.card-price{font-size:${randInt(18, 26)}px;font-weight:800;color:${accentColor};margin-bottom:16px}
.card-old{font-size:13px;opacity:.5;text-decoration:line-through;margin-left:8px;font-weight:400}
.btn{width:100%;padding:${button.padding};border:none;border-radius:${button.radius};font-family:inherit;font-size:13px;font-weight:${button.fontWeight};cursor:pointer;transition:all .2s;margin-bottom:8px;${button.uppercase ? "text-transform:uppercase;letter-spacing:1.5px;" : ""}}
.btn-buy{background:${accentColor};color:${accentTextColor}}
.btn-buy:hover{transform:${button.transform};opacity:.9}
.btn-paypal{background:#ffc439;color:#003087}
.btn-paypal:hover{transform:${button.transform}}
.loading{grid-column:1/-1;text-align:center;padding:80px;opacity:.5;font-size:14px}
footer{border-top:1px solid ${palette.border};padding:60px 32px;text-align:center;font-size:13px;opacity:.5;margin-top:80px}
`;

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${storeName}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${googleFontsLink}" rel="stylesheet">
<style>${css}</style>
</head>
<body>
${headerHTML}
${heroHTML}
<div class="container" id="products">
  <h2 class="section-title">Nos produits</h2>
  <div id="grid" class="grid"><div class="loading">Chargement...</div></div>
</div>
<footer>© 2026 ${storeName} · Paiement sécurisé Stripe & PayPal</footer>
<script>
fetch('/api/products/random?count=20&category=${encodeURIComponent(category)}')
.then(function(r){return r.json();})
.then(function(d){
  var grid = document.getElementById('grid');
  if(!d.products || !d.products.length){grid.innerHTML = '<div class="loading">Aucun produit disponible</div>';return;}
  grid.innerHTML = d.products.map(function(p){
    var name = String(p.name).replace(/'/g,'');
    var price = parseFloat(p.price) || 49.99;
    var old = p.oldPrice || (price * 1.3);
    return '<div class="card">' +
      '<div class="card-img"><img src="' + p.image + '" alt="' + name + '"></div>' +
      '<div class="card-body">' +
      '<div class="card-title">' + name + '</div>' +
      '<div class="card-price">' + price.toFixed(2) + ' €<span class="card-old">' + old.toFixed(2) + ' €</span></div>' +
      '<button class="btn btn-buy" onclick="buyStripe(this,\\'' + name + '\\',' + price + ',\\'' + p.image + '\\',\\'' + (p.sku || '') + '\\')">Ajouter au panier</button>' +
      '<button class="btn btn-paypal" onclick="buyPaypal(this,\\'' + name + '\\',' + price + ')">Payer avec PayPal</button>' +
      '</div></div>';
  }).join('');
})
.catch(function(e){document.getElementById('grid').innerHTML = '<div class="loading">Erreur de chargement</div>';});

window.buyStripe = function(b, n, p, i, s){
  b.disabled = true; var t = b.textContent; b.textContent = '⏳...';
  fetch('/api/stripe/checkout-product', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({productName:n, price:p, imageUrl:i, sku:s})})
  .then(function(r){return r.json();})
  .then(function(d){ if(d.url) window.open(d.url, '_blank'); else alert('Erreur Stripe'); b.disabled=false; b.textContent=t; })
  .catch(function(){ alert('Erreur réseau'); b.disabled=false; b.textContent=t; });
};

window.buyPaypal = function(b, n, p){
  b.disabled = true; var t = b.textContent; b.textContent = '⏳...';
  fetch('/api/paypal/create-order', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({amount:p, currency:'EUR', productName:n})})
  .then(function(r){return r.json();})
  .then(function(d){
    var l = d.links && d.links.find(function(x){return x.rel === 'approve';});
    if(l) window.open(l.href, '_blank'); else alert('Erreur PayPal');
    b.disabled=false; b.textContent=t;
  })
  .catch(function(){ alert('Erreur réseau'); b.disabled=false; b.textContent=t; });
};
</script>
</body>
</html>`;
}