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

const API_BASE = "http://localhost:3000";

const rand = <T>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const FONTS = [
  { name: "Inter", google: "Inter:wght@400;600;700;900", fallback: "sans-serif" },
  { name: "Poppins", google: "Poppins:wght@400;600;700;900", fallback: "sans-serif" },
  { name: "Playfair Display", google: "Playfair+Display:wght@400;600;700;900", fallback: "serif" },
];

const PALETTES = [
  { bg: "#ffffff", text: "#111111", accent: "#111111", accentText: "#ffffff", card: "#ffffff", border: "#eeeeee" },
  { bg: "#0a0a0a", text: "#f5f5f5", accent: "#d4af37", accentText: "#0a0a0a", card: "#141414", border: "#2a2a2a" },
  { bg: "#faf7f2", text: "#2d2d2d", accent: "#8b5a3c", accentText: "#ffffff", card: "#ffffff", border: "#e8e0d5" },
  { bg: "#fdf4ff", text: "#4a044e", accent: "#a21caf", accentText: "#ffffff", card: "#ffffff", border: "#f5d0fe" },
  { bg: "#fff7ed", text: "#7c2d12", accent: "#ea580c", accentText: "#ffffff", card: "#ffffff", border: "#fed7aa" },
  { bg: "#1a1a2e", text: "#eaeaea", accent: "#e94560", accentText: "#ffffff", card: "#16213e", border: "#0f3460" },
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
  const gridSize = randInt(240, 300);
  const gapSize = randInt(20, 32);

  const accentColor = color?.primary || palette.accent;
  const accentTextColor = palette.accentText;

  // Génère les cartes produits
  let productsHTML = "";
  if (products.length === 0) {
    productsHTML = '<div class="loading">Aucun produit disponible</div>';
  } else {
    productsHTML = products.map((p, i) => {
      const name = String(p.name || "").replace(/'/g, "").replace(/"/g, "").replace(/</g, "").replace(/>/g, "");
      const price = Number(p.price) || 49.99;
      const oldPrice = Number(p.oldPrice) || price * 1.3;
      const image = p.image || "https://placehold.co/400x400/f5f5f5/999?text=Produit";
      const rating = p.rating || 4.5;
      const reviews = p.reviews || 100;
      const badge = p.badge || "";
      const sku = p.sku || "";
      const stars = "★".repeat(Math.round(rating)) + "☆".repeat(5 - Math.round(rating));

      return `
        <div class="card">
          <div class="card-img">
            <img src="${image}" alt="${name}" onerror="this.src='https://placehold.co/400x400/f5f5f5/999?text=Produit'" />
            ${badge ? `<span class="card-badge">${badge}</span>` : ""}
          </div>
          <div class="card-body">
            <div class="card-title">${name}</div>
            <div class="card-rating"><span class="stars">${stars}</span> <span class="reviews">${reviews} avis</span></div>
            <div class="card-price">${price.toFixed(2)} €${oldPrice > price ? `<span class="card-old">${oldPrice.toFixed(2)} €</span>` : ""}</div>
            <div class="card-actions">
              <button class="btn btn-buy" onclick="addToCart('${name}',${price},'${image}','${sku}')">Ajouter au panier</button>
              <button class="btn btn-paypal" onclick="buyPaypal(this,'${name}',${price})">Payer avec PayPal</button>
            </div>
          </div>
        </div>`;
    }).join("");
  }

  const googleFontsLink = `https://fonts.googleapis.com/css2?family=${font.google}&display=swap`;

  const css = `
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{font-family:'${font.name}',${font.fallback};background:${palette.bg};color:${palette.text};overflow-x:hidden;line-height:1.6;min-height:100vh}
a{text-decoration:none;color:inherit;cursor:pointer;transition:opacity .2s}
a:hover{opacity:.7}

header{position:sticky;top:0;z-index:100;background:${palette.bg}dd;backdrop-filter:blur(10px);border-bottom:1px solid ${palette.border};padding:16px 0}
.nav{max-width:1400px;margin:0 auto;padding:0 32px;display:flex;align-items:center;justify-content:space-between;gap:32px}
.logo{font-size:22px;font-weight:700;color:${accentColor};letter-spacing:-0.5px}
.nav nav{display:flex;gap:28px;font-size:14px;font-weight:500}
.nav nav a{color:${palette.text};opacity:.7}
.nav nav a:hover{opacity:1;color:${accentColor}}
.cart-btn{font-size:14px;font-weight:600;color:${accentColor};cursor:pointer}

.hero{position:relative;padding:120px 32px 100px;text-align:center;overflow:hidden}
.hero-content{position:relative;z-index:2;max-width:900px;margin:0 auto}
.hero h1{font-size:clamp(40px,7vw,80px);font-weight:900;line-height:1.05;margin-bottom:24px;letter-spacing:-2px}
.hero p{font-size:18px;opacity:.75;max-width:560px;margin:0 auto 40px}
.hero-cta{display:inline-block;background:${accentColor};color:${accentTextColor};padding:16px 40px;font-size:14px;font-weight:600;border-radius:12px;box-shadow:0 8px 24px ${accentColor}40;transition:transform .2s}
.hero-cta:hover{transform:translateY(-2px)}

.container{max-width:1400px;margin:0 auto;padding:80px 32px}
.section-title{font-size:32px;font-weight:700;margin-bottom:48px;text-align:center;letter-spacing:-1px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(${gridSize}px,1fr));gap:${gapSize}px}

.card{background:${palette.card};border-radius:16px;overflow:hidden;transition:all .3s;border:1px solid ${palette.border};display:flex;flex-direction:column}
.card:hover{transform:translateY(-4px);box-shadow:0 20px 40px rgba(0,0,0,0.08)}
.card-img{aspect-ratio:1;padding:20px;display:flex;align-items:center;justify-content:center;overflow:hidden;position:relative;background:${palette.card}}
.card-img img{width:100%;height:100%;object-fit:contain;transition:transform .3s}
.card:hover .card-img img{transform:scale(1.05)}
.card-badge{position:absolute;top:12px;left:12px;background:${accentColor};color:${accentTextColor};font-size:10px;font-weight:700;padding:4px 10px;border-radius:6px;text-transform:uppercase;letter-spacing:1px}
.card-body{padding:20px;display:flex;flex-direction:column;gap:10px;flex:1}
.card-title{font-size:14px;font-weight:600;line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:40px}
.card-rating{font-size:12px;opacity:.7;display:flex;align-items:center;gap:6px}
.stars{color:#f59e0b}
.card-price{font-size:22px;font-weight:800;color:${accentColor};display:flex;align-items:baseline;gap:8px}
.card-old{font-size:13px;opacity:.5;text-decoration:line-through;font-weight:400}
.card-actions{display:flex;flex-direction:column;gap:8px;margin-top:auto;padding-top:8px}
.btn{width:100%;padding:12px;border:none;border-radius:10px;font-family:inherit;font-size:13px;font-weight:600;cursor:pointer;transition:all .2s}
.btn-buy{background:${accentColor};color:${accentTextColor}}
.btn-buy:hover{opacity:.9;transform:scale(1.02)}
.btn-paypal{background:#ffc439;color:#003087}
.btn-paypal:hover{opacity:.9;transform:scale(1.02)}
.loading{grid-column:1/-1;text-align:center;padding:80px 0;opacity:.5}
footer{border-top:1px solid ${palette.border};padding:60px 32px 40px;text-align:center;margin-top:80px}
footer p{font-size:13px;opacity:.5;margin-bottom:8px}

.toast{position:fixed;bottom:30px;right:30px;background:${accentColor};color:${accentTextColor};padding:16px 24px;border-radius:12px;font-weight:600;font-size:14px;box-shadow:0 10px 30px rgba(0,0,0,0.2);z-index:9999;opacity:0;transform:translateY(20px);transition:all .3s;pointer-events:none}
.toast.show{opacity:1;transform:translateY(0)}

@media(max-width:768px){
  .nav{padding:0 20px;gap:16px}
  .nav nav{display:none}
  .container{padding:60px 20px}
  .hero h1{font-size:36px}
  .section-title{font-size:24px;margin-bottom:32px}
  .grid{grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:16px}
}`;

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
<header>
  <div class="nav">
    <a href="#" class="logo">${storeName}</a>
    <nav>
      <a href="#products">Boutique</a>
      <a href="#contact">Contact</a>
    </nav>
    <a class="cart-btn" onclick="showCart()">Panier (<span id="cartCount">0</span>)</a>
  </div>
</header>

<section class="hero">
  <div class="hero-content">
    <h1>${storeName}</h1>
    <p>${tagline}</p>
    <a href="#products" class="hero-cta">Découvrir la collection</a>
  </div>
</section>

<div class="container" id="products">
  <h2 class="section-title">Nos produits</h2>
  <div class="grid">${productsHTML}</div>
</div>

<footer id="contact">
  <p><strong style="font-size:16px;opacity:1;color:${accentColor}">${storeName}</strong></p>
  <p>${tagline}</p>
  <p>2026 ${storeName} - Paiement sécurisé Stripe & PayPal</p>
</footer>

<div class="toast" id="toast"></div>

<script>
var API = '${API_BASE}';
var cart = JSON.parse(localStorage.getItem('barry_cart') || '[]');

function updateCartCount(){
  var count = cart.reduce(function(s,i){return s+i.quantity;},0);
  document.getElementById('cartCount').textContent = count;
  localStorage.setItem('barry_cart', JSON.stringify(cart));
}

function showToast(msg){
  var t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(function(){ t.classList.remove('show'); }, 2500);
}

function addToCart(name, price, image, sku){
  var existing = cart.find(function(i){return i.sku === sku;});
  if(existing){ existing.quantity += 1; }
  else { cart.push({name:name, price:price, image:image, sku:sku, quantity:1}); }
  updateCartCount();
  showToast('Ajouté au panier : ' + name);
}

function showCart(){
  if(cart.length === 0){ showToast('Votre panier est vide'); return; }
  var total = cart.reduce(function(s,i){return s+i.price*i.quantity;},0);
  var msg = 'Votre panier:\\n\\n';
  cart.forEach(function(i){ msg += i.quantity + 'x ' + i.name + ' - ' + (i.price*i.quantity).toFixed(2) + ' EUR\\n'; });
  msg += '\\nTOTAL: ' + total.toFixed(2) + ' EUR\\n\\nPasser commande avec Stripe ?';
  if(confirm(msg)){
    fetch(API + '/api/stripe/checkout-cart', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ items: cart })
    })
    .then(function(r){return r.json();})
    .then(function(d){
      if(d.url){
        window.open(d.url, '_blank');
        showToast('Paiement ouvert dans un nouvel onglet');
      } else {
        alert('Erreur Stripe');
      }
    })
    .catch(function(e){ alert('Erreur réseau: ' + e.message); });
  }
}

function buyPaypal(b, n, p){
  b.disabled = true; var t = b.textContent; b.textContent = 'Redirection...';
  fetch(API + '/api/paypal/create-order', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({amount:p, currency:'EUR', productName:n})})
  .then(function(r){return r.json();})
  .then(function(d){
    var l = d.links && d.links.find(function(x){return x.rel === 'approve';});
    if(l) window.open(l.href, '_blank');
    else alert('Erreur PayPal');
    b.disabled=false; b.textContent=t;
  })
  .catch(function(e){ alert('Erreur: ' + e.message); b.disabled=false; b.textContent=t; });
}

updateCartCount();
</script>
</body>
</html>`;
}