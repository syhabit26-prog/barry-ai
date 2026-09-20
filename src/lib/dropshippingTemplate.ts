type Color = { primary: string; secondary: string };
type Mood = { id: string; name: string };

export type ProductInput = {
  id: string;
  vid?: string;
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

export type PageAssets = {
  heroVideoUrl?: string;
  heroImageUrl?: string;
  model3DUrl?: string;
  extraVideos?: string[];
  riveUrl?: string;
};

const API_BASE = "http://localhost:3000";
const SHIPPING_COST = 4.99;

const FONTS = [
  { name: "Inter", google: "Inter:wght@400;600;700;900", fallback: "sans-serif" },
  { name: "Poppins", google: "Poppins:wght@400;600;700;900", fallback: "sans-serif" },
  { name: "Playfair Display", google: "Playfair+Display:wght@400;600;700;900", fallback: "serif" },
  { name: "Space Grotesk", google: "Space+Grotesk:wght@400;600;700", fallback: "sans-serif" },
  { name: "Outfit", google: "Outfit:wght@400;600;700;900", fallback: "sans-serif" },
];

const PALETTES = [
  { bg: "#0a0a0a", text: "#f5f5f5", accent: "#d4af37", accentText: "#0a0a0a", card: "#141414", border: "#2a2a2a" },
  { bg: "#0f0a05", text: "#f5f0e6", accent: "#c9a961", accentText: "#0f0a05", card: "#1a1408", border: "#2a1f0f" },
  { bg: "#050505", text: "#f5f5f5", accent: "#e94560", accentText: "#ffffff", card: "#111", border: "#222" },
  { bg: "#0a0510", text: "#f5f0ff", accent: "#a855f7", accentText: "#ffffff", card: "#150a1f", border: "#2a1a3a" },
  { bg: "#051210", text: "#f0fff8", accent: "#10b981", accentText: "#051210", card: "#0a1f1a", border: "#0f2a22" },
  { bg: "#0a0a14", text: "#f0f5ff", accent: "#3b82f6", accentText: "#ffffff", card: "#12121c", border: "#1f1f2a" },
  { bg: "#140a0a", text: "#fff0f0", accent: "#ef4444", accentText: "#ffffff", card: "#1c1212", border: "#2a1f1f" },
  { bg: "#0a140a", text: "#f0fff0", accent: "#22c55e", accentText: "#0a140a", card: "#121c12", border: "#1f2a1f" },
  { bg: "#140a14", text: "#fff0ff", accent: "#ec4899", accentText: "#ffffff", card: "#1c121c", border: "#2a1f2a" },
  { bg: "#14100a", text: "#fff5e6", accent: "#f59e0b", accentText: "#0a0a0a", card: "#1c1810", border: "#2a251f" },
  { bg: "#0a1014", text: "#e6f5ff", accent: "#06b6d4", accentText: "#0a0a0a", card: "#10181c", border: "#1f252a" },
  { bg: "#f5f5f5", text: "#0a0a0a", accent: "#0a0a0a", accentText: "#ffffff", card: "#ffffff", border: "#e5e5e5" },
];

const FALLBACK_VIDEOS = [
  "https://videos.pexels.com/video-files/3184287/3184287-hd_1920_1080_25fps.mp4",
  "https://videos.pexels.com/video-files/3252918/3252918-hd_1920_1080_25fps.mp4",
  "https://videos.pexels.com/video-files/2795767/2795796-hd_1920_1080_25fps.mp4",
  "https://videos.pexels.com/video-files/3571264/3571264-hd_1920_1080_30fps.mp4",
  "https://videos.pexels.com/video-files/3209828/3209828-hd_1920_1080_25fps.mp4",
];

function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function getShapeHTML(shapeStyle: string): string {
  switch (shapeStyle) {
    case "squares": return `<div class="shape-squares shape-1"></div><div class="shape-squares shape-2"></div><div class="shape-squares shape-3"></div>`;
    case "triangles": return `<div class="shape-tri shape-1"></div><div class="shape-tri shape-2"></div>`;
    case "hexagons": return `<div class="shape-hex shape-1"></div><div class="shape-hex shape-2"></div>`;
    case "waves": return `<div class="shape-wave shape-1"></div><div class="shape-wave shape-2"></div>`;
    case "particles": return `<div class="shape-particle shape-1"></div><div class="shape-particle shape-2"></div><div class="shape-particle shape-3"></div><div class="shape-particle shape-4"></div>`;
    case "lines": return `<div class="shape-line shape-1"></div><div class="shape-line shape-2"></div>`;
    case "dots": return `<div class="shape-dot shape-1"></div><div class="shape-dot shape-2"></div><div class="shape-dot shape-3"></div>`;
    case "rings": return `<div class="shape-ring shape-1"></div><div class="shape-ring shape-2"></div>`;
    case "blobs": return `<div class="shape-blob shape-1"></div><div class="shape-blob shape-2"></div>`;
    case "diamonds": return `<div class="shape-diamond shape-1"></div><div class="shape-diamond shape-2"></div>`;
    case "crosses": return `<div class="shape-cross shape-1"></div><div class="shape-cross shape-2"></div>`;
    case "orbs":
    default: return `<div class="orb orb-1"></div><div class="orb orb-2"></div>`;
  }
}

function getShapeCSS(accentColor: string, accent2: string): string {
  return `
.shape-squares{position:absolute;border:3px solid ${accentColor};opacity:.3;pointer-events:none;z-index:2;background:transparent}
.shape-squares.shape-1{width:200px;height:200px;top:10%;left:5%;transform:rotate(15deg);animation:spin 20s linear infinite}
.shape-squares.shape-2{width:150px;height:150px;bottom:15%;right:10%;transform:rotate(-25deg);animation:spin 25s linear infinite reverse;border-color:${accent2}}
.shape-squares.shape-3{width:100px;height:100px;top:50%;right:30%;border-color:${accentColor}}
.shape-tri{position:absolute;width:0;height:0;opacity:.35;pointer-events:none;z-index:2}
.shape-tri.shape-1{border-left:100px solid transparent;border-right:100px solid transparent;border-bottom:170px solid ${accentColor};top:10%;left:5%;animation:float1 14s ease-in-out infinite}
.shape-tri.shape-2{border-left:80px solid transparent;border-right:80px solid transparent;border-bottom:140px solid ${accent2};bottom:15%;right:10%;animation:float2 18s ease-in-out infinite}
.shape-hex{position:absolute;background:${accentColor};opacity:.25;pointer-events:none;z-index:2;clip-path:polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)}
.shape-hex.shape-1{width:150px;height:170px;top:15%;left:8%;animation:float1 14s ease-in-out infinite}
.shape-hex.shape-2{width:120px;height:135px;bottom:20%;right:12%;background:${accent2};animation:float2 16s ease-in-out infinite}
.shape-wave{position:absolute;width:100%;left:0;height:100px;opacity:.3;pointer-events:none;z-index:2;background:linear-gradient(90deg,transparent,${accentColor},transparent);clip-path:ellipse(80% 50% at 50% 50%)}
.shape-wave.shape-1{top:20%;animation:wave 8s ease-in-out infinite}
.shape-wave.shape-2{bottom:20%;background:linear-gradient(90deg,transparent,${accent2},transparent);animation:wave 10s ease-in-out infinite reverse}
.shape-particle{position:absolute;border-radius:50%;background:${accentColor};pointer-events:none;z-index:2;box-shadow:0 0 20px ${accentColor}}
.shape-particle.shape-1{width:8px;height:8px;top:20%;left:15%;animation:float1 6s ease-in-out infinite}
.shape-particle.shape-2{width:6px;height:6px;top:40%;left:80%;background:${accent2};animation:float2 8s ease-in-out infinite}
.shape-particle.shape-3{width:10px;height:10px;bottom:30%;left:30%;animation:float3 10s ease-in-out infinite}
.shape-particle.shape-4{width:5px;height:5px;top:60%;right:20%;background:${accent2};animation:float1 7s ease-in-out infinite}
.shape-line{position:absolute;pointer-events:none;z-index:2;background:${accentColor};opacity:.3}
.shape-line.shape-1{width:3px;height:300px;top:10%;left:10%;transform:rotate(30deg);animation:float1 12s ease-in-out infinite}
.shape-line.shape-2{width:3px;height:200px;bottom:20%;right:15%;background:${accent2};transform:rotate(-45deg);animation:float2 15s ease-in-out infinite}
.shape-dot{position:absolute;border-radius:50%;border:2px solid ${accentColor};pointer-events:none;z-index:2;opacity:.5}
.shape-dot.shape-1{width:100px;height:100px;top:15%;left:10%;animation:pulse 4s ease-in-out infinite}
.shape-dot.shape-2{width:60px;height:60px;bottom:25%;right:15%;border-color:${accent2};animation:pulse 5s ease-in-out infinite 1s}
.shape-dot.shape-3{width:150px;height:150px;top:50%;left:50%;transform:translate(-50%,-50%);opacity:.2;animation:pulse 6s ease-in-out infinite 2s}
.shape-ring{position:absolute;border-radius:50%;border:3px solid ${accentColor};pointer-events:none;z-index:2;opacity:.35;background:transparent}
.shape-ring.shape-1{width:300px;height:300px;top:5%;right:5%;animation:spin 30s linear infinite}
.shape-ring.shape-2{width:200px;height:200px;bottom:10%;left:10%;border-color:${accent2};animation:spin 20s linear infinite reverse}
.shape-blob{position:absolute;pointer-events:none;z-index:2;background:${accentColor};opacity:.25;animation:morph 8s ease-in-out infinite}
.shape-blob.shape-1{width:400px;height:400px;top:-100px;left:-100px;border-radius:60% 40% 30% 70%/60% 30% 70% 40%}
.shape-blob.shape-2{width:300px;height:300px;bottom:-50px;right:-50px;background:${accent2};border-radius:30% 70% 70% 30%/30% 30% 70% 70%;animation-delay:2s}
.shape-diamond{position:absolute;background:${accentColor};opacity:.3;pointer-events:none;z-index:2;transform:rotate(45deg)}
.shape-diamond.shape-1{width:120px;height:120px;top:15%;left:8%;animation:float1 12s ease-in-out infinite}
.shape-diamond.shape-2{width:80px;height:80px;bottom:20%;right:15%;background:${accent2};animation:float2 15s ease-in-out infinite}
.shape-cross{position:absolute;pointer-events:none;z-index:2;opacity:.3}
.shape-cross::before,.shape-cross::after{content:'';position:absolute;background:${accentColor}}
.shape-cross::before{width:100%;height:3px;top:50%;transform:translateY(-50%)}
.shape-cross::after{width:3px;height:100%;left:50%;transform:translateX(-50%)}
.shape-cross.shape-1{width:60px;height:60px;top:15%;left:10%;animation:spin 15s linear infinite}
.shape-cross.shape-2{width:40px;height:40px;bottom:20%;right:15%;animation:spin 12s linear infinite reverse;opacity:.2}`;
}

export function buildDropshippingSite(
  storeName: string,
  tagline: string,
  category: string = "produits varies",
  color?: Color,
  mood?: Mood,
  forcedStyle?: string,
  products: ProductInput[] = [],
  assets: PageAssets = {},
  signature?: { palette: any; animStyle: string; shapeStyle: string; heroLayout: string }
): string {
  const uniqueSalt = Date.now().toString() + Math.random().toString(36).slice(2, 8);
  const hCat = hashStr(category + uniqueSalt);
  const hStore = hashStr(storeName + uniqueSalt);

  const font = FONTS[(hCat + hStore) % FONTS.length];

  const palette = signature?.palette ? {
    bg: signature.palette.bg,
    text: signature.palette.text,
    accent: signature.palette.accent,
    accentText: signature.palette.accentText,
    card: signature.palette.card,
    border: signature.palette.border,
    accent2: signature.palette.accent2 || signature.palette.accent,
  } : (color ? {
    bg: "#0a0a0a", text: "#f5f5f5", accent: color.primary, accentText: "#0a0a0a",
    card: "#141414", border: "#2a2a2a", accent2: color.secondary || color.primary,
  } : { ...PALETTES[(hCat + hStore) % PALETTES.length], accent2: PALETTES[(hCat + hStore) % PALETTES.length].accent });

  const animationStyle = signature?.animStyle || forcedStyle || ["fadeUp", "zoomIn", "slideIn", "rotateIn"][hStore % 4];
  const shapeStyle = signature?.shapeStyle || ["orbs", "squares", "triangles", "hexagons", "waves", "particles", "lines", "dots", "rings", "blobs", "diamonds", "crosses"][hCat % 12];

  const accentColor = palette.accent;
  const accentTextColor = palette.accentText;
  const accent2 = palette.accent2 || palette.accent;

  const heroVideo = assets.heroVideoUrl || assets.extraVideos?.[0] || FALLBACK_VIDEOS[hCat % FALLBACK_VIDEOS.length];
  const midVideo = assets.extraVideos?.[1] || FALLBACK_VIDEOS[(hCat + 1) % FALLBACK_VIDEOS.length];
  const endVideo = assets.extraVideos?.[2] || FALLBACK_VIDEOS[(hCat + 2) % FALLBACK_VIDEOS.length];

  const heroImg = assets.heroImageUrl || products[0]?.image ||
    `https://image.pollinations.ai/prompt/${encodeURIComponent(category + " luxury")}?width=800&height=800&nologo=true`;

  const productsFirst = products.slice(0, 8);
  const productsSecond = products.slice(8, 14);
  const productsThird = products.slice(14, 20);

  const animKeyframes: Record<string, string> = {
    fadeUp: `@keyframes cardIn{from{opacity:0;transform:translateY(100px)}to{opacity:1;transform:translateY(0)}}`,
    fadeDown: `@keyframes cardIn{from{opacity:0;transform:translateY(-100px)}to{opacity:1;transform:translateY(0)}}`,
    zoomIn: `@keyframes cardIn{from{opacity:0;transform:scale(0.5)}to{opacity:1;transform:scale(1)}}`,
    zoomOut: `@keyframes cardIn{from{opacity:0;transform:scale(1.4)}to{opacity:1;transform:scale(1)}}`,
    slideLeft: `@keyframes cardIn{from{opacity:0;transform:translateX(-150px)}to{opacity:1;transform:translateX(0)}}`,
    slideRight: `@keyframes cardIn{from{opacity:0;transform:translateX(150px)}to{opacity:1;transform:translateX(0)}}`,
    rotateIn: `@keyframes cardIn{from{opacity:0;transform:rotate(-15deg) scale(0.7)}to{opacity:1;transform:rotate(0) scale(1)}}`,
    flipY: `@keyframes cardIn{from{opacity:0;transform:perspective(600px) rotateY(90deg)}to{opacity:1;transform:perspective(600px) rotateY(0)}}`,
    flipX: `@keyframes cardIn{from{opacity:0;transform:perspective(600px) rotateX(90deg)}to{opacity:1;transform:perspective(600px) rotateX(0)}}`,
    blurIn: `@keyframes cardIn{from{opacity:0;filter:blur(20px);transform:scale(1.1)}to{opacity:1;filter:blur(0);transform:scale(1)}}`,
    scaleUp: `@keyframes cardIn{from{opacity:0;transform:scale(0.3)}to{opacity:1;transform:scale(1)}}`,
    bounceIn: `@keyframes cardIn{from{opacity:0;transform:translateY(-200px)}to{opacity:1;transform:translateY(0)}}`,
    elasticIn: `@keyframes cardIn{from{opacity:0;transform:scale(0.3) rotate(-10deg)}to{opacity:1;transform:scale(1) rotate(0)}}`,
    swingIn: `@keyframes cardIn{from{opacity:0;transform:rotate(-20deg) translateY(100px)}to{opacity:1;transform:rotate(0) translateY(0)}}`,
    staggerUp: `@keyframes cardIn{from{opacity:0;transform:translateY(80px)}to{opacity:1;transform:translateY(0)}}`,
    waveIn: `@keyframes cardIn{from{opacity:0;transform:translateY(60px) rotate(-3deg)}to{opacity:1;transform:translateY(0) rotate(0)}}`,
    skewIn: `@keyframes cardIn{from{opacity:0;transform:skewX(-20deg) translateX(-80px)}to{opacity:1;transform:skewX(0) translateX(0)}}`,
    cascade: `@keyframes cardIn{from{opacity:0;transform:translateY(120px) rotate(-5deg) scale(0.85)}to{opacity:1;transform:translateY(0) rotate(0) scale(1)}}`,
  };
  const cardKeyframe = animKeyframes[animationStyle] || animKeyframes.fadeUp;

  function renderCards(list: ProductInput[]): string {
    if (list.length === 0) return "";
    return list.map((p, idx) => {
      const name = String(p.name || "").replace(/'/g, "").replace(/"/g, "").replace(/</g, "").replace(/>/g, "");
      const price = Number(p.price) || 49.99;
      const oldPrice = Number(p.oldPrice) || price * 1.3;
      const image = p.image || "https://placehold.co/400x400/f5f5f5/999?text=Produit";
      const rating = p.rating || 4.5;
      const reviews = p.reviews || 100;
      const badge = p.badge || "";
      const sku = (p.sku || "").replace(/'/g, "");
      const vid = (p.vid || "").replace(/'/g, "");
      const stars = "★".repeat(Math.round(rating)) + "☆".repeat(5 - Math.round(rating));
      const delay = Math.min(idx * 0.08, 0.6).toFixed(2);

      return `<div class="card" style="animation-delay:${delay}s">
        <div class="card-img">
          <img src="${image}" alt="${name}" loading="lazy" 
               onerror="this.onerror=null;this.src='https://placehold.co/600x600/1a1a1a/facc15?text=${encodeURIComponent(name)}'" />
          ${badge ? `<span class="card-badge">${badge}</span>` : ""}
        </div>
        <div class="card-body">
          <div class="card-title">${name}</div>
          <div class="card-rating"><span class="stars">${stars}</span> <span class="reviews">${reviews} avis</span></div>
          <div class="card-price">${price.toFixed(2)} €${oldPrice > price ? `<span class="card-old">${oldPrice.toFixed(2)} €</span>` : ""}</div>
          <div class="card-actions">
            <button class="btn btn-buy" onclick="addToCart('${name}',${price},'${image}','${sku}','${vid}')">Ajouter au panier</button>
            <button class="btn btn-paypal" onclick="buyPaypal(this,'${name}',${price})">Payer avec PayPal</button>
          </div>
        </div>
      </div>`;
    }).join("");
  }

  const googleFontsLink = `https://fonts.googleapis.com/css2?family=${font.google}&display=swap`;

  const css = `*{margin:0;padding:0;box-sizing:border-box}
html{-webkit-font-smoothing:antialiased;scroll-behavior:smooth}
body{font-family:'${font.name}',${font.fallback};background:${palette.bg};color:${palette.text};overflow-x:hidden;line-height:1.6;min-height:100vh}
a{text-decoration:none;color:inherit;cursor:pointer}
img{max-width:100%;display:block}
@keyframes slideDown{from{opacity:0;transform:translateY(-100%)}to{opacity:1;transform:translateY(0)}}
@keyframes heroTitleIn{0%{opacity:0;transform:translateY(120px) scale(0.85);filter:blur(30px)}100%{opacity:1;transform:translateY(0) scale(1);filter:blur(0)}}
@keyframes heroSubIn{0%{opacity:0;transform:translateY(60px)}100%{opacity:1;transform:translateY(0)}}
@keyframes heroBtnIn{0%{opacity:0;transform:translateY(60px) scale(0.8)}100%{opacity:1;transform:translateY(0) scale(1)}}
${cardKeyframe}
@keyframes shineSweep{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes scrollDot{0%,100%{transform:translateY(0);opacity:.3}50%{transform:translateY(20px);opacity:1}}
@keyframes float1{0%{transform:translate(0,0) rotate(-15deg)}25%{transform:translate(20px,-25px) rotate(-8deg)}50%{transform:translate(-15px,-40px) rotate(-18deg)}75%{transform:translate(15px,-20px) rotate(-12deg)}100%{transform:translate(0,0) rotate(-15deg)}}
@keyframes float2{0%{transform:translate(0,0) rotate(20deg)}25%{transform:translate(-25px,-30px) rotate(12deg)}50%{transform:translate(20px,-45px) rotate(25deg)}75%{transform:translate(-15px,-25px) rotate(18deg)}100%{transform:translate(0,0) rotate(20deg)}}
@keyframes float3{0%{transform:translate(0,0) rotate(-8deg)}33%{transform:translate(30px,-40px) rotate(-20deg)}66%{transform:translate(-20px,-25px) rotate(5deg)}100%{transform:translate(0,0) rotate(-8deg)}}
@keyframes float4{0%{transform:translate(0,0) rotate(12deg)}33%{transform:translate(-35px,-50px) rotate(25deg)}66%{transform:translate(25px,-30px) rotate(-5deg)}100%{transform:translate(0,0) rotate(12deg)}}
@keyframes orbFloat1{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(80px,-60px) scale(1.2)}}
@keyframes orbFloat2{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-100px,80px) scale(0.85)}}
@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
@keyframes pulse{0%,100%{transform:scale(1);opacity:.5}50%{transform:scale(1.3);opacity:.8}}
@keyframes wave{0%,100%{transform:translateY(0)}50%{transform:translateY(-30px)}}
@keyframes morph{0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%}50%{border-radius:30% 70% 70% 30%/30% 30% 70% 70%}}
.progress-bar{position:fixed;top:0;left:0;height:3px;width:0%;background:${accentColor};z-index:9999;transition:width .1s linear;box-shadow:0 0 20px ${accentColor}}
header{position:fixed;top:3px;left:0;right:0;z-index:1000;background:${palette.bg}dd;backdrop-filter:blur(24px);border-bottom:1px solid ${palette.border};padding:16px 0;animation:slideDown 1s cubic-bezier(0.16,1,0.3,1) both}
.nav{max-width:1400px;margin:0 auto;padding:0 32px;display:flex;align-items:center;justify-content:space-between;gap:32px}
.logo{display:flex;align-items:center;gap:10px;font-size:22px;font-weight:700;color:${accentColor};letter-spacing:-0.5px;transition:transform .3s;text-decoration:none}
.logo-mark{width:38px;height:38px;border-radius:10px;background:linear-gradient(135deg,${accentColor},${accent2});color:${accentTextColor};display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:900;box-shadow:0 4px 12px ${accentColor}50}
.logo-text{font-size:20px;font-weight:800}
.logo:hover{transform:scale(1.03)}
.logo:hover .logo-mark{transform:rotate(-8deg);transition:transform .3s}
.nav nav{display:flex;gap:28px;font-size:14px;font-weight:500}
.nav nav a{color:${palette.text};opacity:.7;transition:color .3s}
.nav nav a:hover{opacity:1;color:${accentColor}}
.cart-btn{font-size:14px;font-weight:600;color:${accentTextColor};cursor:pointer;padding:10px 20px;background:${accentColor};border-radius:100px;transition:all .3s;border:none;font-family:inherit}
.cart-btn:hover{transform:translateY(-3px) scale(1.05);box-shadow:0 12px 30px ${accentColor}60}
.hero{position:relative;height:100vh;width:100vw;display:flex;align-items:center;justify-content:center;overflow:hidden;padding:0;margin:0}
.hero-video{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;z-index:0;filter:brightness(0.5) saturate(1.3)}
.hero-overlay{position:absolute;inset:0;background:linear-gradient(180deg,${palette.bg}cc 0%,${palette.bg}88 50%,${palette.bg} 100%);z-index:1}
.orb{position:absolute;border-radius:50%;filter:blur(80px);opacity:0.35;pointer-events:none;z-index:2}
.orb-1{width:500px;height:500px;background:${accentColor};top:-100px;left:-100px;animation:orbFloat1 12s ease-in-out infinite}
.orb-2{width:400px;height:400px;background:${accentColor};bottom:-100px;right:-100px;animation:orbFloat2 15s ease-in-out infinite;opacity:0.25}
${getShapeCSS(accentColor, accent2)}
.float-paper{position:absolute;border-radius:16px;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,0.5);border:2px solid ${accentColor}60;z-index:3;pointer-events:none;will-change:transform}
.float-paper img{width:100%;height:100%;object-fit:cover;display:block}
.float-paper-1{width:140px;height:180px;top:20%;left:8%;animation:float1 12s ease-in-out infinite}
.float-paper-2{width:110px;height:150px;top:60%;left:15%;animation:float2 15s ease-in-out infinite}
.float-paper-3{width:130px;height:170px;top:15%;right:12%;animation:float3 14s ease-in-out infinite}
.float-paper-4{width:100px;height:140px;bottom:20%;right:8%;animation:float4 13s ease-in-out infinite}
.hero-content{position:relative;z-index:4;text-align:center;max-width:1100px;width:100%}
.hero-badge{display:inline-flex;align-items:center;gap:10px;padding:10px 22px;background:${accentColor}20;border:1px solid ${accentColor}60;border-radius:100px;font-size:12px;font-weight:700;color:${accentColor};letter-spacing:3px;text-transform:uppercase;margin-bottom:32px;animation:heroSubIn 1.5s cubic-bezier(0.16,1,0.3,1) .3s both;backdrop-filter:blur(10px)}
.hero-badge::before{content:'';width:8px;height:8px;border-radius:50%;background:${accentColor};box-shadow:0 0 15px ${accentColor};animation:scrollDot 2s ease-in-out infinite}
.hero h1{font-size:clamp(64px,13vw,200px);font-weight:900;line-height:.88;margin-bottom:32px;letter-spacing:-7px;animation:heroTitleIn 2.5s cubic-bezier(0.16,1,0.3,1) .5s both;background:linear-gradient(180deg,#fff 0%,${accentColor} 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 20px 40px ${accentColor}40)}
.hero p{font-size:clamp(16px,1.8vw,22px);opacity:.85;max-width:700px;margin:0 auto 48px;animation:heroSubIn 2s cubic-bezier(0.16,1,0.3,1) 1.2s both;font-weight:400}
.hero-cta{display:inline-flex;align-items:center;gap:12px;background:${accentColor};color:${accentTextColor};padding:22px 56px;font-size:16px;font-weight:800;border-radius:100px;box-shadow:0 15px 50px ${accentColor}60;transition:all .4s;animation:heroBtnIn 2s cubic-bezier(0.16,1,0.3,1) 1.8s both;position:relative;overflow:hidden;letter-spacing:.5px;cursor:pointer;border:none;font-family:inherit}
.hero-cta::before{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.5),transparent);background-size:200% 100%;animation:shineSweep 3s 3.5s infinite}
.hero-cta:hover{transform:translateY(-8px) scale(1.05);box-shadow:0 30px 80px ${accentColor}90}
.scroll-hint{position:absolute;bottom:50px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:14px;color:#fff;font-size:11px;letter-spacing:4px;text-transform:uppercase;opacity:.8;z-index:5;animation:heroSubIn 1s 2.5s both}
.scroll-hint .dot{width:6px;height:6px;border-radius:50%;background:${accentColor};animation:scrollDot 2s ease-in-out infinite;box-shadow:0 0 15px ${accentColor}}
.scroll-hint .line{width:1px;height:50px;background:linear-gradient(180deg,${accentColor},transparent)}
.video-section{position:relative;height:100vh;width:100vw;overflow:hidden;display:flex;align-items:center;justify-content:center;margin:0;padding:0;left:50%;right:50%;margin-left:-50vw;margin-right:-50vw}
.video-section video{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;filter:brightness(.5) saturate(1.3);z-index:0}
.video-section .video-overlay{position:absolute;inset:0;background:linear-gradient(180deg,${palette.bg}dd 0%,${palette.bg}66 30%,${palette.bg}66 70%,${palette.bg}dd 100%);z-index:1}
.video-section .video-content{position:relative;z-index:2;text-align:center;max-width:800px;padding:0 32px}
.video-section .video-label{display:inline-block;font-size:11px;font-weight:700;color:${accentColor};letter-spacing:4px;text-transform:uppercase;margin-bottom:20px;padding:8px 20px;border:1px solid ${accentColor}60;border-radius:100px;background:${palette.bg}99;backdrop-filter:blur(10px)}
.video-section h2{font-size:clamp(36px,5vw,72px);font-weight:900;line-height:1.05;letter-spacing:-2.5px;margin-bottom:20px;color:#fff;text-shadow:0 10px 40px rgba(0,0,0,.9)}
.video-section p{font-size:16px;opacity:.9;max-width:600px;margin:0 auto;color:#fff;text-shadow:0 4px 20px rgba(0,0,0,.9)}
.products-section{position:relative;z-index:10;background:${palette.bg};border-radius:60px 60px 0 0;margin-top:-120px;padding:120px 32px 80px;box-shadow:0 -40px 100px rgba(0,0,0,.5)}
.products-section.no-radius{border-radius:0;margin-top:0;box-shadow:none}
.container{max-width:1400px;margin:0 auto}
.section-header{text-align:center;margin-bottom:80px}
.section-label{display:inline-block;font-size:12px;font-weight:700;color:${accentColor};letter-spacing:4px;text-transform:uppercase;margin-bottom:20px;padding:8px 20px;border:1px solid ${accentColor}40;border-radius:100px}
.section-title{font-size:clamp(36px,5vw,72px);font-weight:900;letter-spacing:-2.5px;line-height:1.05;margin-bottom:20px}
.section-subtitle{font-size:16px;opacity:.6;max-width:600px;margin:0 auto}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:28px}
.card{background:${palette.card};border-radius:20px;overflow:hidden;border:1px solid ${palette.border};display:flex;flex-direction:column;opacity:0;animation:cardIn 1s cubic-bezier(0.16,1,0.3,1) both;transition:transform .4s cubic-bezier(0.16,1,0.3,1),box-shadow .4s,border-color .4s;will-change:transform}
.card:hover{transform:translateY(-15px) scale(1.04) !important;box-shadow:0 40px 80px rgba(0,0,0,.5);border-color:${accentColor}99}
.card-img{aspect-ratio:1;padding:24px;display:flex;align-items:center;justify-content:center;overflow:hidden;position:relative;background:${palette.card}}
.card-img img{width:100%;height:100%;object-fit:cover;border-radius:12px;transition:transform .8s cubic-bezier(0.16,1,0.3,1)}
.card:hover .card-img img{transform:scale(1.15) rotate(4deg)}
.card-badge{position:absolute;top:16px;left:16px;background:${accentColor};color:${accentTextColor};font-size:10px;font-weight:800;padding:8px 14px;border-radius:100px;text-transform:uppercase;letter-spacing:1.5px;box-shadow:0 6px 20px ${accentColor}60}
.card-body{padding:24px;display:flex;flex-direction:column;gap:12px;flex:1}
.card-title{font-size:15px;font-weight:600;line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:42px;color:${palette.text}}
.card-rating{font-size:12px;opacity:.7;display:flex;align-items:center;gap:6px}
.stars{color:#f59e0b;letter-spacing:1px}
.card-price{font-size:26px;font-weight:900;color:${accentColor};display:flex;align-items:baseline;gap:8px}
.card-old{font-size:13px;opacity:.5;text-decoration:line-through;font-weight:400}
.card-actions{display:flex;flex-direction:column;gap:10px;margin-top:auto;padding-top:10px}
.btn{width:100%;padding:15px;border:none;border-radius:12px;font-family:inherit;font-size:13px;font-weight:700;cursor:pointer;transition:all .3s cubic-bezier(0.16,1,0.3,1);letter-spacing:.3px}
.btn-buy{background:${accentColor};color:${accentTextColor}}
.btn-buy:hover{transform:translateY(-3px) scale(1.03);box-shadow:0 12px 28px ${accentColor}70}
.btn-paypal{background:#ffc439;color:#003087}
.btn-paypal:hover{transform:translateY(-3px) scale(1.03);box-shadow:0 12px 28px rgba(255,196,57,.6)}
footer{border-top:1px solid ${palette.border};padding:60px 32px 40px;text-align:center;margin-top:80px;position:relative;z-index:5}
footer p{font-size:13px;opacity:.5;margin-bottom:8px}
.cart-overlay{position:fixed;inset:0;background:rgba(0,0,0,.7);backdrop-filter:blur(8px);z-index:9998;opacity:0;pointer-events:none;transition:opacity .5s}
.cart-overlay.show{opacity:1;pointer-events:auto}
.cart-panel{position:fixed;top:0;right:0;bottom:0;width:460px;max-width:92vw;background:${palette.bg};z-index:9999;transform:translateX(100%);transition:transform .7s cubic-bezier(0.16,1,0.3,1);display:flex;flex-direction:column;box-shadow:-40px 0 100px rgba(0,0,0,.5)}
.cart-panel.show{transform:translateX(0)}
.cart-head{padding:28px;border-bottom:1px solid ${palette.border};display:flex;align-items:center;justify-content:space-between}
.cart-head h3{font-size:22px;font-weight:800}
.cart-close{background:none;border:none;font-size:30px;cursor:pointer;color:${palette.text};opacity:.5;line-height:1;transition:all .3s}
.cart-close:hover{opacity:1;transform:rotate(90deg)}
.cart-items{flex:1;overflow-y:auto;padding:20px 28px}
.cart-item{display:flex;gap:16px;padding:16px 0;border-bottom:1px solid ${palette.border}}
.cart-item img{width:80px;height:80px;object-fit:cover;border-radius:12px;background:${palette.card}}
.cart-item-info{flex:1;display:flex;flex-direction:column;gap:4px;justify-content:center}
.cart-item-name{font-size:13px;font-weight:600;line-height:1.3}
.cart-item-price{font-size:15px;font-weight:800;color:${accentColor}}
.cart-item-remove{background:none;border:none;color:${palette.text};opacity:.4;cursor:pointer;font-size:22px;padding:4px;align-self:flex-start;transition:all .3s}
.cart-item-remove:hover{opacity:1;color:red;transform:scale(1.3) rotate(90deg)}
.cart-empty{text-align:center;padding:80px 20px;opacity:.5;font-size:14px}
.cart-foot{padding:28px;border-top:1px solid ${palette.border};background:${palette.card}}
.cart-shipping{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:12px;font-size:13px;opacity:.75;padding-bottom:12px;border-bottom:1px dashed ${palette.border}}
.cart-shipping strong{color:${palette.text};font-weight:700}
.cart-total{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:20px;font-size:14px;text-transform:uppercase;letter-spacing:1.5px}
.cart-total strong{font-size:32px;font-weight:900;color:${accentColor};letter-spacing:-1px}
.cart-actions{display:flex;flex-direction:column;gap:12px}
.cart-btn-stripe{width:100%;padding:18px;background:${accentColor};color:${accentTextColor};border:none;border-radius:14px;font-family:inherit;font-size:15px;font-weight:800;cursor:pointer;transition:all .3s;letter-spacing:.5px}
.cart-btn-stripe:hover{transform:translateY(-3px) scale(1.02);box-shadow:0 15px 35px ${accentColor}70}
.cart-btn-stripe:disabled{opacity:.5;cursor:not-allowed;transform:none}
.cart-badge{display:inline-block;background:${accentTextColor};color:${accentColor};border-radius:100px;padding:3px 10px;font-size:11px;font-weight:800;margin-left:6px}
.toast{position:fixed;bottom:40px;right:40px;background:${accentColor};color:${accentTextColor};padding:18px 28px;border-radius:14px;font-weight:700;font-size:14px;box-shadow:0 15px 40px rgba(0,0,0,.4);z-index:10000;opacity:0;transform:translateY(30px) scale(.85);transition:all .4s cubic-bezier(0.16,1,0.3,1);pointer-events:none}
.toast.show{opacity:1;transform:translateY(0) scale(1)}
@media(max-width:900px){.float-paper{display:none}.video-section{height:70vh}}
@media(max-width:768px){.nav{padding:0 20px;gap:16px}.nav nav{display:none}.products-section{padding:80px 20px 60px;border-radius:40px 40px 0 0;margin-top:-80px}.hero h1{letter-spacing:-3px}.grid{grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:16px}.cart-panel{width:100%}.scroll-hint{display:none}}`;

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
<div class="progress-bar" id="progressBar"></div>
<header>
  <div class="nav">
    <a href="#" class="logo">
      <span class="logo-mark">${storeName.slice(0, 1).toUpperCase()}</span>
      <span class="logo-text">${storeName}</span>
    </a>
    <nav><a href="#products">Boutique</a><a href="#contact">Contact</a></nav>
    <button class="cart-btn" onclick="openCart()">Panier <span class="cart-badge" id="cartCount">0</span></button>
  </div>
</header>
<section class="hero">
  <video class="hero-video" autoplay muted loop playsinline preload="auto"><source src="${heroVideo}" type="video/mp4"></video>
  <div class="hero-overlay"></div>
  ${getShapeHTML(shapeStyle)}
  <div class="float-paper float-paper-1"><img src="${products[0]?.image || heroImg}" alt="" onerror="this.style.display='none'"/></div>
  <div class="float-paper float-paper-2"><img src="${products[1]?.image || heroImg}" alt="" onerror="this.style.display='none'"/></div>
  <div class="float-paper float-paper-3"><img src="${products[2]?.image || heroImg}" alt="" onerror="this.style.display='none'"/></div>
  <div class="float-paper float-paper-4"><img src="${products[3]?.image || heroImg}" alt="" onerror="this.style.display='none'"/></div>
  <div class="hero-content">
    <div class="hero-badge">Collection Exclusive 2026</div>
    <h1>${storeName}</h1>
    <p>${tagline}</p>
    <button class="hero-cta" onclick="smoothScrollTo(event)">Découvrir la collection</button>
  </div>
  <div class="scroll-hint"><span>Scroll</span><span class="line"></span><span class="dot"></span></div>
</section>
<section class="products-section" id="products">
  <div class="container">
    <div class="section-header"><span class="section-label">Collection 2026</span><h2 class="section-title">Nos produits</h2><p class="section-subtitle">Découvrez notre sélection exclusive.</p></div>
    <div class="grid">${renderCards(productsFirst)}</div>
  </div>
</section>
<section class="video-section">
  <video autoplay muted loop playsinline preload="auto"><source src="${midVideo}" type="video/mp4"></video>
  <div class="video-overlay"></div>
  <div class="video-content"><span class="video-label">Qualité Premium</span><h2>L'excellence à portée de main</h2><p>Chaque produit est soigneusement sélectionné.</p></div>
</section>
<section class="products-section no-radius">
  <div class="container">
    <div class="section-header"><span class="section-label">Best-Sellers</span><h2 class="section-title">Les incontournables</h2></div>
    <div class="grid">${renderCards(productsSecond)}</div>
  </div>
</section>
<section class="video-section">
  <video autoplay muted loop playsinline preload="auto"><source src="${endVideo}" type="video/mp4"></video>
  <div class="video-overlay"></div>
  <div class="video-content"><span class="video-label">Livraison Mondiale</span><h2>Recevez partout dans le monde</h2><p>Livraison rapide en 5-12 jours.</p></div>
</section>
<section class="products-section no-radius">
  <div class="container">
    <div class="section-header"><span class="section-label">Nouveautés</span><h2 class="section-title">Dernières arrivées</h2></div>
    <div class="grid">${renderCards(productsThird)}</div>
  </div>
</section>
<footer id="contact">
  <div style="display:flex;justify-content:center;align-items:center;gap:12px;margin-bottom:16px">
    <span class="logo-mark" style="width:44px;height:44px;font-size:22px">${storeName.slice(0, 1).toUpperCase()}</span>
    <strong style="font-size:20px;color:${accentColor}">${storeName}</strong>
  </div>
  <p>${tagline}</p>
  <p>2026 ${storeName} - Paiement sécurisé Stripe & PayPal</p>
  <div style="margin-top:12px;display:flex;gap:16px;justify-content:center;flex-wrap:wrap">
    <a href="/legal/cgv" style="font-size:12px;opacity:.6">CGV</a>
    <a href="/legal/refund" style="font-size:12px;opacity:.6">Remboursement</a>
    <a href="/legal/privacy" style="font-size:12px;opacity:.6">Confidentialité</a>
  </div>
</footer>
<div class="cart-overlay" id="cartOverlay" onclick="closeCart()"></div>
<div class="cart-panel" id="cartPanel">
  <div class="cart-head"><h3>Votre panier</h3><button class="cart-close" onclick="closeCart()">×</button></div>
  <div class="cart-items" id="cartItems"></div>
  <div class="cart-foot">
    <div class="cart-shipping"><span>📦 Livraison (5-10 jours)</span><strong id="shippingCost">${SHIPPING_COST.toFixed(2)} €</strong></div>
    <div class="cart-total"><span>Total</span><strong id="cartTotal">0.00 €</strong></div>
    <div class="cart-actions"><button class="cart-btn-stripe" id="checkoutBtn" onclick="checkoutStripe()">Payer avec Stripe</button></div>
  </div>
</div>
<div class="toast" id="toast"></div>
<script>
(function(){
  var API='${API_BASE}';
  var SHIPPING=${SHIPPING_COST};
  var cart=JSON.parse(localStorage.getItem('barry_cart')||'[]');
  cart = cart.map(function(item){ if(!item.vid) item.vid = item.sku || ""; return item; });

  var pb=document.getElementById('progressBar');
  window.addEventListener('scroll',function(){var d=document.documentElement.scrollHeight-window.innerHeight;var p=d>0?(window.scrollY/d)*100:0;pb.style.width=p+'%';},{passive:true});
  window.smoothScrollTo=function(e){if(e)e.preventDefault();var t=document.getElementById('products');if(t)window.scrollTo({top:t.offsetTop-20,behavior:'smooth'});};

  function updateCartUI(){
    var c=cart.reduce(function(s,i){return s+i.quantity;},0);
    document.getElementById('cartCount').textContent=c;
    localStorage.setItem('barry_cart',JSON.stringify(cart));
    var el=document.getElementById('cartItems');
    if(cart.length===0){el.innerHTML='<div class="cart-empty">Votre panier est vide</div>';}
    else{
      el.innerHTML=cart.map(function(item,idx){
        return '<div class="cart-item"><img src="'+item.image+'" alt="" onerror="this.src=\\'https://placehold.co/80x80/f5f5f5/999?text=?\\'"/><div class="cart-item-info"><div class="cart-item-name">'+item.name+'</div><div style="font-size:11px;opacity:.6">Quantité : '+item.quantity+'</div><div class="cart-item-price">'+(item.price*item.quantity).toFixed(2)+' €</div></div><button class="cart-item-remove" onclick="removeFromCart('+idx+')">×</button></div>';
      }).join('');
    }
    var subtotal=cart.reduce(function(s,i){return s+i.price*i.quantity;},0);
    var shipping=cart.length>0?SHIPPING:0;
    document.getElementById('shippingCost').textContent=shipping.toFixed(2)+' €';
    document.getElementById('cartTotal').textContent=(subtotal+shipping).toFixed(2)+' €';
    document.getElementById('checkoutBtn').disabled=cart.length===0;
  }

  window.openCart=function(){document.getElementById('cartOverlay').classList.add('show');document.getElementById('cartPanel').classList.add('show');document.body.style.overflow='hidden';};
  window.closeCart=function(){document.getElementById('cartOverlay').classList.remove('show');document.getElementById('cartPanel').classList.remove('show');document.body.style.overflow='';};
  window.removeFromCart=function(idx){cart.splice(idx,1);updateCartUI();};
  window.addToCart=function(n,p,i,s,v){
    var e=cart.find(function(x){return x.sku===s;});
    if(e){e.quantity+=1;}
    else{cart.push({name:n,price:p,image:i,sku:s,vid:v||s,quantity:1});}
    updateCartUI();
    showToast('Ajouté : '+n);
  };
  window.showToast=function(m){var t=document.getElementById('toast');t.textContent=m;t.classList.add('show');setTimeout(function(){t.classList.remove('show');},2500);};

  window.checkoutStripe=function(){
    if(cart.length===0){showToast('Panier vide');return;}
    var b=document.getElementById('checkoutBtn');
    b.disabled=true;
    var o=b.textContent;
    b.textContent='Redirection...';

    var pathParts = window.location.pathname.split('/').filter(Boolean);
    var slug = (pathParts[0] === 's' && pathParts[1]) ? pathParts[1] : null;
    var projectId = localStorage.getItem('barry_current_project') || null;

    fetch(API+'/api/stripe/checkout-cart',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        items: cart.map(function(i){
          return { vid: i.vid, sku: i.sku, name: i.name, price: i.price, image: i.image, quantity: i.quantity };
        }),
        projectId: projectId,
        projectSlug: slug
      })
    })
    .then(function(r){return r.json();})
    .then(function(d){
      if(d.url){window.open(d.url,'_blank');showToast('Paiement ouvert');}
      else{alert('Erreur Stripe : '+(d.error||'inconnue'));}
      b.disabled=false;b.textContent=o;
    })
    .catch(function(e){
      alert('Erreur: '+e.message);
      b.disabled=false;b.textContent=o;
    });
  };

  window.buyPaypal=function(b,n,p){
    b.disabled=true;
    var t=b.textContent;
    b.textContent='Redirection...';
    fetch(API+'/api/paypal/create-order',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({amount:p,currency:'EUR',productName:n})
    })
    .then(function(r){return r.json();})
    .then(function(d){
      var l=d.links&&d.links.find(function(x){return x.rel==='approve';});
      if(l)window.open(l.href,'_blank');
      else alert('Erreur PayPal');
      b.disabled=false;b.textContent=t;
    })
    .catch(function(e){
      alert('Erreur: '+e.message);
      b.disabled=false;b.textContent=t;
    });
  };

  updateCartUI();
})();
</script>
</body>
</html>`;
}