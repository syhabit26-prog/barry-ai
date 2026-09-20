import type { SiteConfig } from "./siteTemplates";

// ═══════════════════════════════════════════════════════════════
// VIDÉOS PAR CATÉGORIE
// ═══════════════════════════════════════════════════════════════
const VIDEO_POOL: Record<string, string[]> = {
  restaurant: [
    "https://videos.pexels.com/video-files/3184287/3184287-hd_1920_1080_25fps.mp4",
    "https://videos.pexels.com/video-files/2620043/2620043-hd_1920_1080_30fps.mp4",
  ],
  banque: [
    "https://videos.pexels.com/video-files/3252918/3252918-hd_1920_1080_25fps.mp4",
    "https://videos.pexels.com/video-files/6774633/6774633-hd_1920_1080_25fps.mp4",
  ],
  ecole: [
    "https://videos.pexels.com/video-files/2795767/2795796-hd_1920_1080_25fps.mp4",
    "https://videos.pexels.com/video-files/5192126/5192126-hd_1920_1080_25fps.mp4",
  ],
  sport: [
    "https://videos.pexels.com/video-files/4753998/4753998-uhd_2560_1440_24fps.mp4",
    "https://videos.pexels.com/video-files/5319756/5319756-hd_1920_1080_25fps.mp4",
  ],
  portfolio: [
    "https://videos.pexels.com/video-files/3571264/3571264-hd_1920_1080_30fps.mp4",
    "https://videos.pexels.com/video-files/5051614/5051614-hd_1920_1080_25fps.mp4",
  ],
  sante: [
    "https://videos.pexels.com/video-files/3209828/3209828-hd_1920_1080_25fps.mp4",
    "https://videos.pexels.com/video-files/4114797/4114797-hd_1920_1080_25fps.mp4",
  ],
  immobilier: [
    "https://videos.pexels.com/video-files/7578542/7578542-hd_1920_1080_30fps.mp4",
    "https://videos.pexels.com/video-files/4770380/4770380-hd_1920_1080_30fps.mp4",
  ],
  avocat: [
    "https://videos.pexels.com/video-files/5667387/5667387-hd_1920_1080_25fps.mp4",
    "https://videos.pexels.com/video-files/6074609/6074609-hd_1920_1080_25fps.mp4",
  ],
  hotel: [
    "https://videos.pexels.com/video-files/2724749/2724749-hd_1920_1080_25fps.mp4",
    "https://videos.pexels.com/video-files/2098988/2098988-hd_1920_1080_30fps.mp4",
  ],
  tech: [
    "https://videos.pexels.com/video-files/3141210/3141210-uhd_2560_1440_25fps.mp4",
    "https://videos.pexels.com/video-files/5386391/5386391-hd_1920_1080_25fps.mp4",
  ],
};

// ═══════════════════════════════════════════════════════════════
// PALETTES
// ═══════════════════════════════════════════════════════════════
type Palette = { primary: string; secondary: string };

const PALETTES: Record<string, Palette[]> = {
  restaurant: [{ primary: "#f97316", secondary: "#ea580c" }, { primary: "#dc2626", secondary: "#b91c1c" }, { primary: "#d4af37", secondary: "#b8941f" }],
  banque: [{ primary: "#0ea5e9", secondary: "#0284c7" }, { primary: "#14b8a6", secondary: "#0d9488" }, { primary: "#6366f1", secondary: "#4f46e5" }],
  ecole: [{ primary: "#22c55e", secondary: "#16a34a" }, { primary: "#3b82f6", secondary: "#2563eb" }],
  sport: [{ primary: "#ef4444", secondary: "#dc2626" }, { primary: "#22c55e", secondary: "#16a34a" }],
  portfolio: [{ primary: "#a855f7", secondary: "#7c3aed" }, { primary: "#06b6d4", secondary: "#0891b2" }],
  sante: [{ primary: "#10b981", secondary: "#059669" }, { primary: "#0ea5e9", secondary: "#0284c7" }],
  immobilier: [{ primary: "#f59e0b", secondary: "#d97706" }, { primary: "#0ea5e9", secondary: "#0284c7" }],
  avocat: [{ primary: "#eab308", secondary: "#ca8a04" }, { primary: "#0f172a", secondary: "#1e293b" }],
  hotel: [{ primary: "#d4af37", secondary: "#b8941f" }, { primary: "#0ea5e9", secondary: "#0284c7" }],
  tech: [{ primary: "#22d3ee", secondary: "#06b6d4" }, { primary: "#8b5cf6", secondary: "#7c3aed" }],
};

function detectType(type: string): string {
  const t = (type || "").toLowerCase();
  if (/restaurant|cafe|food|pizz|bistrot|cuisine|resto/.test(t)) return "restaurant";
  if (/banque|bank|finance|assur|credit|invest/.test(t)) return "banque";
  if (/ecole|école|school|formation|univers|academ/.test(t)) return "ecole";
  if (/sport|fitness|gym|muscul|boxe|salle/.test(t)) return "sport";
  if (/sante|santé|medecin|medical|hopital|pharmacie|clinique/.test(t)) return "sante";
  if (/immobilier|immo|house|appartement/.test(t)) return "immobilier";
  if (/avocat|cabinet|juridique|notaire|justice/.test(t)) return "avocat";
  if (/hotel|hôtel|auberge|resort|gite|chambre/.test(t)) return "hotel";
  if (/tech|ia|ai|software|cloud|cyber|saas/.test(t)) return "tech";
  return "portfolio";
}

// ═══════════════════════════════════════════════════════════════
// CSS PARTAGÉ
// ═══════════════════════════════════════════════════════════════
function getSharedCSS(primary: string, secondary: string): string {
  return `
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth;-webkit-font-smoothing:antialiased}
body{font-family:system-ui,-apple-system,'Inter',sans-serif;background:#000;color:#f5f5f5;line-height:1.6;overflow-x:hidden;position:relative}
a{color:inherit;text-decoration:none}
img{max-width:100%;display:block}

.bg-video-wrap{position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:-2;overflow:hidden;pointer-events:none}
.bg-video-wrap video{position:absolute;top:50%;left:50%;min-width:100%;min-height:100%;width:auto;height:auto;transform:translate(-50%,-50%);object-fit:cover;filter:brightness(.3) saturate(1.2)}
.bg-video-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.75) 0%,rgba(0,0,0,.55) 40%,rgba(0,0,0,.8) 100%)}
#three-canvas{position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:-1;pointer-events:none}
.page-content{position:relative;z-index:1;width:100%}

@keyframes slideDown{from{opacity:0;transform:translateY(-100%)}to{opacity:1;transform:translateY(0)}}
@keyframes slideUp{from{opacity:0;transform:translateY(60px)}to{opacity:1;transform:translateY(0)}}
@keyframes heroTitle{0%{opacity:0;transform:translateY(100px) scale(0.9);filter:blur(20px)}100%{opacity:1;transform:translateY(0) scale(1);filter:blur(0)}}
@keyframes cardUp{0%{opacity:0;transform:translateY(80px) scale(0.95)}100%{opacity:1;transform:translateY(0) scale(1)}}
@keyframes shine{0%{background-position:-200% 0}100%{background-position:200% 0}}

header.site-header{position:fixed;top:0;left:0;right:0;z-index:100;background:rgba(0,0,0,.55);backdrop-filter:blur(24px);border-bottom:1px solid rgba(255,255,255,.08);padding:16px 0;animation:slideDown 0.8s cubic-bezier(0.16,1,0.3,1) both}
.nav{max-width:1400px;margin:0 auto;padding:0 32px;display:flex;align-items:center;justify-content:space-between;gap:32px}
.logo{display:flex;align-items:center;gap:10px;font-size:20px;font-weight:800;color:${primary}}
.logo-mark{width:38px;height:38px;border-radius:10px;background:linear-gradient(135deg,${primary},${secondary});display:flex;align-items:center;justify-content:center;color:#fff;font-weight:900;font-size:18px}
.nav-links{display:flex;gap:28px;font-size:14px;font-weight:500}
.nav-links a{opacity:.8;transition:all .3s}
.nav-links a:hover{opacity:1;color:${primary}}
.cta-btn{padding:12px 24px;background:${primary};color:#fff;border:none;border-radius:100px;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit;box-shadow:0 10px 30px ${primary}60}

section{padding:100px 32px;position:relative}
.container{max-width:1200px;margin:0 auto}
.section-header{text-align:center;margin-bottom:64px}
.section-label{display:inline-block;font-size:12px;font-weight:700;color:${primary};letter-spacing:4px;text-transform:uppercase;margin-bottom:16px;padding:10px 22px;border:1px solid ${primary}50;border-radius:100px;background:rgba(0,0,0,.4)}
.section-title{font-size:clamp(36px,5vw,72px);font-weight:900;letter-spacing:-2.5px;line-height:1.05;margin-bottom:20px;color:#fff}

.hero{position:relative;min-height:100vh;display:flex;align-items:center;justify-content:center;overflow:hidden;padding:120px 32px 60px}
.hero-content{position:relative;z-index:4;text-align:center;max-width:1100px}
.hero-badge{display:inline-block;padding:12px 24px;background:${primary}25;border:1px solid ${primary}60;border-radius:100px;font-size:12px;font-weight:700;color:${primary};letter-spacing:3px;text-transform:uppercase;margin-bottom:28px;animation:slideUp 0.8s 0.2s both;backdrop-filter:blur(10px)}
.hero h1{font-size:clamp(52px,10vw,140px);font-weight:900;line-height:.9;letter-spacing:-5px;margin-bottom:28px;background:linear-gradient(180deg,#fff 0%,${primary} 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:heroTitle 1.8s cubic-bezier(0.16,1,0.3,1) 0.3s both}
.hero p{font-size:clamp(16px,1.8vw,22px);opacity:.9;max-width:700px;margin:0 auto 44px;animation:slideUp 1s 0.8s both;color:#e5e5e5}
.hero-cta{display:inline-flex;align-items:center;gap:12px;background:${primary};color:#fff;padding:22px 52px;font-size:16px;font-weight:800;border-radius:100px;box-shadow:0 20px 60px ${primary}70;transition:all .4s;animation:slideUp 1s 1.2s both;cursor:pointer;border:none;font-family:inherit;position:relative;overflow:hidden}
.hero-cta:hover{transform:translateY(-8px) scale(1.05)}

.card{background:rgba(20,20,20,.55);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.08);border-radius:20px;padding:32px;transition:all .5s cubic-bezier(0.16,1,0.3,1)}
.card-anim{animation:cardUp 1s cubic-bezier(0.16,1,0.3,1) both}
.card:hover{transform:translateY(-12px) scale(1.02);border-color:${primary}80;background:rgba(20,20,20,.75)}
.card-icon{font-size:52px;margin-bottom:20px}
.card-title{font-size:20px;font-weight:800;margin-bottom:12px;color:#fff}
.card-desc{font-size:14px;opacity:.75;line-height:1.7;color:#d4d4d8}

.btn-primary{display:inline-block;padding:14px 32px;background:${primary};color:#fff;border:none;border-radius:100px;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit;transition:all .3s}
.btn-primary:hover{transform:translateY(-3px);box-shadow:0 15px 40px ${primary}90}
.btn-outline{display:inline-block;padding:12px 28px;background:transparent;color:${primary};border:2px solid ${primary};border-radius:100px;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit;transition:all .3s}
.btn-outline:hover{background:${primary};color:#fff}

.stat-value{font-size:clamp(40px,6vw,68px);font-weight:900;color:${primary};letter-spacing:-2px;line-height:1}
.stat-label{font-size:14px;opacity:.8;margin-top:10px;text-transform:uppercase;letter-spacing:2px;color:#d4d4d8}

footer.site-footer{border-top:1px solid rgba(255,255,255,.08);padding:60px 32px 40px;text-align:center;background:rgba(0,0,0,.6);backdrop-filter:blur(20px)}
footer.site-footer p{font-size:13px;opacity:.6;margin-bottom:8px;color:#a1a1aa}

.payment-btn{display:flex;align-items:center;justify-content:center;gap:10px;padding:16px 32px;border-radius:14px;font-weight:800;font-size:15px;cursor:pointer;border:none;font-family:inherit;transition:all .3s;width:100%;max-width:340px;margin:0 auto;text-decoration:none}
.payment-btn.stripe{background:#635bff;color:#fff}
.payment-btn.stripe:hover{background:#7a73ff;transform:translateY(-3px);box-shadow:0 15px 40px rgba(99,91,255,.5)}
.payment-btn.paypal{background:#ffc439;color:#003087}
.payment-btn.paypal:hover{background:#ffd166;transform:translateY(-3px);box-shadow:0 15px 40px rgba(255,196,57,.5)}

@media(max-width:768px){.nav-links{display:none}section{padding:60px 20px}.hero{padding:100px 20px 40px}.hero h1{letter-spacing:-3px}}
`;
}

// ═══════════════════════════════════════════════════════════════
// HEADER + FOOTER + SCRIPT 3D
// ═══════════════════════════════════════════════════════════════
function getHeader(name: string): string {
  return `
<header class="site-header">
  <div class="nav">
    <div class="logo"><span class="logo-mark">${name.charAt(0).toUpperCase()}</span><span>${name}</span></div>
    <nav class="nav-links">
      <a href="#services">Services</a>
      <a href="#contact">Contact</a>
    </nav>
    <button class="cta-btn" onclick="document.getElementById('contact').scrollIntoView({behavior:'smooth'})">Nous contacter</button>
  </div>
</header>`;
}

function getFooter(name: string, primary: string): string {
  return `
<footer class="site-footer">
  <p><strong style="color:${primary};font-size:16px">${name}</strong></p>
  <p>2026 ${name} — Tous droits réservés</p>
</footer>`;
}

function getThreeScript(primary: string, secondary: string, sceneType: string): string {
  return `
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script>
(function(){
  if(typeof THREE==="undefined")return;
  var canvas=document.getElementById("three-canvas");
  var W=window.innerWidth,H=window.innerHeight;
  var scene=new THREE.Scene();
  var camera=new THREE.PerspectiveCamera(70,W/H,0.1,1000);
  camera.position.z=6;
  var renderer=new THREE.WebGLRenderer({canvas:canvas,alpha:true,antialias:true});
  renderer.setSize(W,H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));

  var pGeo=new THREE.BufferGeometry();
  var count=400;
  var pos=new Float32Array(count*3);
  for(var i=0;i<count*3;i+=3){pos[i]=(Math.random()-0.5)*25;pos[i+1]=(Math.random()-0.5)*20;pos[i+2]=(Math.random()-0.5)*15;}
  pGeo.setAttribute("position",new THREE.BufferAttribute(pos,3));
  var particles=new THREE.Points(pGeo,new THREE.PointsMaterial({color:"${primary}",size:0.055,transparent:true,opacity:0.75,blending:THREE.AdditiveBlending}));
  scene.add(particles);

  var objs=[],k;
  var t="${sceneType}";

  if(t==="restaurant"){
    for(k=0;k<3;k++){
      var m=new THREE.Mesh(new THREE.SphereGeometry(1.5+k*0.3,16,16),new THREE.MeshBasicMaterial({color:k%2?"${secondary}":"${primary}",wireframe:true,transparent:true,opacity:0.3}));
      m.position.x=(k-1)*5.5;m.position.y=-1+(k%2)*1.5;
      m.userData={sx:0.002,sy:0.003,fs:k};objs.push(m);scene.add(m);
    }
  } else if(t==="banque"){
    for(k=0;k<4;k++){
      var g=k%2?new THREE.OctahedronGeometry(1.5):new THREE.BoxGeometry(2,2,2);
      var m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({color:k%2?"${secondary}":"${primary}",wireframe:true,transparent:true,opacity:0.32}));
      m.position.x=(k-1.5)*4.5;m.position.y=(k%2?1:-1);
      m.userData={sx:0.003,sy:0.004,fs:k};objs.push(m);scene.add(m);
    }
  } else if(t==="ecole"){
    for(k=0;k<4;k++){
      var g=k%2?new THREE.TetrahedronGeometry(1.6):new THREE.DodecahedronGeometry(1.4);
      var m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({color:k%2?"${secondary}":"${primary}",wireframe:true,transparent:true,opacity:0.35}));
      m.position.x=(k-1.5)*4.8;m.position.y=(k%2?1.2:-0.8);
      m.userData={sx:0.004,sy:0.003,fs:k};objs.push(m);scene.add(m);
    }
  } else if(t==="sport"){
    for(k=0;k<5;k++){
      var g=k%2?new THREE.BoxGeometry(1.5,1.5,1.5):new THREE.SphereGeometry(1.1,16,16);
      var m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({color:k%2?"${secondary}":"${primary}",wireframe:true,transparent:true,opacity:0.35}));
      m.position.x=(k-2)*3.8;m.position.y=(Math.random()-0.5)*3;
      m.userData={sx:0.005,sy:0.006,fs:k};objs.push(m);scene.add(m);
    }
  } else {
    var m1=new THREE.Mesh(new THREE.IcosahedronGeometry(2.5,1),new THREE.MeshBasicMaterial({color:"${primary}",wireframe:true,transparent:true,opacity:0.3}));
    m1.position.x=4.5;m1.position.y=-1;m1.userData={sx:0.003,sy:0.004,fs:0};objs.push(m1);scene.add(m1);
    var m2=new THREE.Mesh(new THREE.TorusKnotGeometry(1.4,0.4,90,12),new THREE.MeshBasicMaterial({color:"${secondary}",wireframe:true,transparent:true,opacity:0.35}));
    m2.position.x=-4.8;m2.position.y=1.5;m2.userData={sx:0.004,sy:0.003,fs:1};objs.push(m2);scene.add(m2);
  }

  var mx=0,my=0;
  window.addEventListener("mousemove",function(e){mx=(e.clientX/window.innerWidth-0.5)*2;my=(e.clientY/window.innerHeight-0.5)*2;});
  window.addEventListener("resize",function(){W=window.innerWidth;H=window.innerHeight;camera.aspect=W/H;camera.updateProjectionMatrix();renderer.setSize(W,H);});

  function animate(){
    requestAnimationFrame(animate);
    particles.rotation.y+=0.0006;
    objs.forEach(function(o){o.rotation.x+=o.userData.sx;o.rotation.y+=o.userData.sy;o.position.y+=Math.sin(Date.now()*0.001+o.userData.fs)*0.003;});
    camera.position.x+=(mx*0.6-camera.position.x)*0.03;
    camera.position.y+=(-my*0.6-camera.position.y)*0.03;
    camera.lookAt(scene.position);
    renderer.render(scene,camera);
  }
  animate();
})();
</script>`;
}

// ═══════════════════════════════════════════════════════════════
// ⭐ LAYOUT BANQUE avec CAISSE PRIVÉE
// ═══════════════════════════════════════════════════════════════
function renderBanque(name: string, p: string, s: string, projectId: string = ""): string {
  // ⭐ Clés par défaut de BARRY (toi)
  const DEFAULT_STRIPE = process.env.NEXT_PUBLIC_BARRY_STRIPE || "https://buy.stripe.com/";
  const DEFAULT_PAYPAL = process.env.NEXT_PUBLIC_BARRY_PAYPAL || "https://paypal.me/barry";

  const paymentSection = `
<section id="paiement" style="padding:80px 32px;background:rgba(0,0,0,.4);backdrop-filter:blur(20px);border-top:1px solid rgba(255,255,255,.06);border-bottom:1px solid rgba(255,255,255,.06)">
  <div class="container" style="text-align:center">
    <span class="section-label">Paiement Sécurisé</span>
    <h2 class="section-title" style="margin-bottom:32px">Réglez vos frais bancaires</h2>
    <p style="opacity:.75;margin-bottom:40px;max-width:600px;margin-left:auto;margin-right:auto">Choisissez votre moyen de paiement préféré. Toutes les transactions sont chiffrées de bout en bout.</p>
    
    <div id="payment-section" data-project-id="${projectId}" style="display:flex;flex-direction:column;gap:16px;align-items:center">
      <a id="stripe-btn" href="${DEFAULT_STRIPE}" target="_blank" rel="noopener" class="payment-btn stripe">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z"/></svg>
        Payer avec Stripe
      </a>
      <a id="paypal-btn" href="${DEFAULT_PAYPAL}" target="_blank" rel="noopener" class="payment-btn paypal">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516h-.003l-.08.47c-.036.19-.14.354-.29.475h6.14c.474 0 .853-.31.928-.772l.561-3.486a.94.94 0 0 1 .928-.772h.561c3.31 0 6.29-1.897 6.86-5.855.023-.16.043-.317.06-.474.062-.523.062-1.023.062-1.523z"/></svg>
        Payer avec PayPal
      </a>
    </div>

    <p style="margin-top:32px;font-size:12px;opacity:.5">🔒 Paiement 100% sécurisé · SSL · PCI-DSS</p>
  </div>
  <script>
  (function() {
    var pid = "${projectId}";
    if (!pid) return;
    var base = window.location.origin;
    fetch(base + "/api/caisse?projectId=" + pid)
      .then(function(r) { return r.json(); })
      .then(function(d) {
        if (!d.ok) return;
        var sb = document.getElementById("stripe-btn");
        var pb = document.getElementById("paypal-btn");
        if (d.stripe && sb) sb.href = d.stripe;
        if (d.paypal && pb) pb.href = d.paypal;
      })
      .catch(function() {});
  })();
  </script>
</section>`;

  return `
<section class="hero">
  <div class="hero-content">
    <div class="hero-badge">Excellence financière</div>
    <h1>Votre partenaire financier</h1>
    <p>Gérez vos actifs, vos crédits et vos comptes en toute simplicité</p>
    <button class="hero-cta" onclick="document.getElementById('services').scrollIntoView({behavior:'smooth'})">Ouvrir un compte →</button>
  </div>
</section>

<section id="services">
  <div class="container">
    <div class="section-header">
      <span class="section-label">Nos comptes</span>
      <h2 class="section-title">Choisissez votre formule</h2>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px;max-width:1000px;margin:0 auto">
      <div class="card card-anim">
        <div class="card-title">Compte Standard</div>
        <div class="stat-value" style="font-size:44px;margin:16px 0">0€<span style="font-size:14px;opacity:.6">/mois</span></div>
        <div class="card-desc" style="margin-bottom:20px">Carte Visa Internationale<br>Zéro frais à l'étranger</div>
        <button class="btn-primary" style="width:100%" onclick="document.getElementById('paiement').scrollIntoView({behavior:'smooth'})">Sélectionner</button>
      </div>
      <div class="card card-anim" style="animation-delay:.15s;border-color:${p};box-shadow:0 20px 60px ${p}40">
        <div class="card-title">Premium Club</div>
        <div class="stat-value" style="font-size:44px;margin:16px 0">9,90€<span style="font-size:14px;opacity:.6">/mois</span></div>
        <div class="card-desc" style="margin-bottom:20px">Carte en Métal Pur<br>Assurances Voyages Complètes</div>
        <button class="btn-primary" style="width:100%" onclick="document.getElementById('paiement').scrollIntoView({behavior:'smooth'})">Ouvrir un compte</button>
      </div>
      <div class="card card-anim" style="animation-delay:.3s">
        <div class="card-title">Entreprise</div>
        <div class="stat-value" style="font-size:44px;margin:16px 0">Sur devis</div>
        <div class="card-desc" style="margin-bottom:20px">Solutions sur mesure<br>Conseiller dédié</div>
        <button class="btn-outline" style="width:100%" onclick="document.getElementById('contact').scrollIntoView({behavior:'smooth'})">Nous contacter</button>
      </div>
    </div>
  </div>
</section>

<section>
  <div class="container">
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:32px;text-align:center">
      <div><div class="stat-value">500k+</div><div class="stat-label">Clients</div></div>
      <div><div class="stat-value">98%</div><div class="stat-label">Satisfaction</div></div>
      <div><div class="stat-value">50+</div><div class="stat-label">Agences</div></div>
      <div><div class="stat-value">🔒 SSL</div><div class="stat-label">Sécurisé</div></div>
    </div>
  </div>
</section>

${paymentSection}

<section id="contact">
  <div class="container" style="text-align:center">
    <h2 class="section-title">Ouvrez votre compte</h2>
    <p style="opacity:.75;margin-bottom:32px">En ligne en 5 minutes ou dans l'une de nos 50 agences</p>
    <button class="hero-cta">Commencer maintenant</button>
  </div>
</section>`;
}

// ═══════════════════════════════════════════════════════════════
// AUTRES LAYOUTS
// ═══════════════════════════════════════════════════════════════
function renderRestaurant(name: string, p: string, s: string): string {
  return `
<section class="hero"><div class="hero-content"><div class="hero-badge">L'art culinaire</div><h1>Saveurs authentiques</h1><p>Cuisine raffinée dans un cadre chaleureux</p><button class="hero-cta" onclick="document.getElementById('contact').scrollIntoView({behavior:'smooth'})">Réserver une table →</button></div></section>
<section id="services">
  <div class="container">
    <div class="section-header"><span class="section-label">Notre Carte</span><h2 class="section-title">Le menu du moment</h2></div>
    <div style="max-width:800px;margin:0 auto;background:rgba(20,20,20,.6);backdrop-filter:blur(20px);border-radius:24px;padding:48px;border:1px solid rgba(255,255,255,.08)">
      <div style="display:flex;justify-content:space-between;padding:20px 0;border-bottom:1px solid rgba(255,255,255,.1)"><div><div style="font-weight:800;color:#fff;font-size:18px">Entrée du Chef</div><div style="font-size:13px;opacity:.6;margin-top:4px">Mélange de saisons</div></div><div style="color:${p};font-weight:900;font-size:22px">14€</div></div>
      <div style="display:flex;justify-content:space-between;padding:20px 0;border-bottom:1px solid rgba(255,255,255,.1)"><div><div style="font-weight:800;color:#fff;font-size:18px">Plat Signature</div><div style="font-size:13px;opacity:.6;margin-top:4px">Poisson de ligne</div></div><div style="color:${p};font-weight:900;font-size:22px">28€</div></div>
      <div style="display:flex;justify-content:space-between;padding:20px 0"><div><div style="font-weight:800;color:#fff;font-size:18px">Dessert Maison</div><div style="font-size:13px;opacity:.6;margin-top:4px">Soufflé</div></div><div style="color:${p};font-weight:900;font-size:22px">12€</div></div>
    </div>
  </div>
</section>
<section id="contact"><div class="container" style="text-align:center"><h2 class="section-title">Réservez votre table</h2><p style="opacity:.7;margin-bottom:32px">7j/7 de 12h à 23h</p><button class="hero-cta">📞 01 23 45 67 89</button></div></section>`;
}

function renderEcole(name: string, p: string, s: string): string {
  return `
<section class="hero"><div class="hero-content"><div class="hero-badge">Excellence académique</div><h1>Formez-vous pour l'avenir</h1><p>Un enseignement d'excellence</p><button class="hero-cta">Voir les formations →</button></div></section>
<section id="services">
  <div class="container">
    <div class="section-header"><span class="section-label">Formations</span><h2 class="section-title">Nos cursus d'excellence</h2></div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:24px">
      <div class="card card-anim"><div style="font-family:monospace;color:${p};font-size:12px;font-weight:700">Bac +3</div><div class="card-title" style="margin-top:8px">Bachelor Développement Web</div><div class="card-desc">JavaScript, React, architecture</div></div>
      <div class="card card-anim" style="animation-delay:.15s"><div style="font-family:monospace;color:${p};font-size:12px;font-weight:700">Bac +5</div><div class="card-title" style="margin-top:8px">Master IA & Data</div><div class="card-desc">Machine Learning, Deep Learning</div></div>
      <div class="card card-anim" style="animation-delay:.3s"><div style="font-family:monospace;color:${p};font-size:12px;font-weight:700">Bac +5</div><div class="card-title" style="margin-top:8px">Master Cybersécurité</div><div class="card-desc">Pentest, sécurité réseau</div></div>
    </div>
  </div>
</section>
<section id="contact"><div class="container" style="text-align:center"><h2 class="section-title">Inscrivez-vous</h2><p style="opacity:.7;margin-bottom:32px">Rentrée septembre</p><button class="hero-cta">Déposer ma candidature</button></div></section>`;
}

function renderSport(name: string, p: string, s: string): string {
  return `
<section class="hero"><div class="hero-content"><div class="hero-badge">Fitness & performance</div><h1>Dépassez vos limites</h1><p>Atteignez vos objectifs</p><button class="hero-cta">Rejoindre la salle →</button></div></section>
<section id="services"><div class="container"><div class="section-header"><span class="section-label">Programmes</span><h2 class="section-title">Nos disciplines</h2></div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:24px">
  <div class="card card-anim"><div class="card-icon">💪</div><div class="card-title">Musculation</div><div class="card-desc">Équipement dernière génération</div></div>
  <div class="card card-anim" style="animation-delay:.15s"><div class="card-icon">🧘</div><div class="card-title">Yoga</div><div class="card-desc">Cours collectifs</div></div>
  <div class="card card-anim" style="animation-delay:.3s"><div class="card-icon">🥊</div><div class="card-title">Boxe</div><div class="card-desc">Coachs pros</div></div>
  <div class="card card-anim" style="animation-delay:.45s"><div class="card-icon">🏃</div><div class="card-title">Cardio</div><div class="card-desc">Machines connectées</div></div>
</div></div></section>
<section id="contact"><div class="container" style="text-align:center"><h2 class="section-title">Rejoignez-nous</h2><p style="opacity:.7;margin-bottom:32px">Essai gratuit 7 jours</p><button class="hero-cta">Commencer</button></div></section>`;
}

function renderPortfolio(name: string, p: string, s: string): string {
  return `
<section class="hero"><div class="hero-content"><div class="hero-badge">Créativité</div><h1>Portfolio créatif</h1><p>Design et développement sur mesure</p><button class="hero-cta">Voir mes projets →</button></div></section>
<section id="services"><div class="container"><div class="section-header"><span class="section-label">Compétences</span><h2 class="section-title">Ce que je maîtrise</h2></div><div style="max-width:700px;margin:0 auto">
  <div style="margin-bottom:20px"><div style="display:flex;justify-content:space-between;margin-bottom:8px"><span>Design UX/UI</span><span style="color:${p};font-weight:800">95%</span></div><div style="height:6px;background:rgba(255,255,255,.1);border-radius:3px;overflow:hidden"><div style="width:95%;height:100%;background:${p};border-radius:3px"></div></div></div>
  <div style="margin-bottom:20px"><div style="display:flex;justify-content:space-between;margin-bottom:8px"><span>Développement</span><span style="color:${p};font-weight:800">90%</span></div><div style="height:6px;background:rgba(255,255,255,.1);border-radius:3px;overflow:hidden"><div style="width:90%;height:100%;background:${p};border-radius:3px"></div></div></div>
</div></div></section>
<section id="contact"><div class="container" style="text-align:center"><h2 class="section-title">Travaillons ensemble</h2><p style="opacity:.7;margin-bottom:32px">Disponible pour de nouveaux projets</p><button class="hero-cta">Me contacter</button></div></section>`;
}

function renderSante(name: string, p: string, s: string): string {
  return `
<section class="hero"><div class="hero-content"><div class="hero-badge">Soins d'excellence</div><h1>Votre santé, notre priorité</h1><p>Des soins d'excellence</p><button class="hero-cta">Prendre rendez-vous →</button></div></section>
<section id="services"><div class="container"><div class="section-header"><span class="section-label">Spécialités</span><h2 class="section-title">Nos services médicaux</h2></div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:24px">
  <div class="card card-anim"><div class="card-icon">🩺</div><div class="card-title">Médecine générale</div><div class="card-desc">Consultations sur RDV</div></div>
  <div class="card card-anim" style="animation-delay:.15s"><div class="card-icon">💊</div><div class="card-title">Pharmacie</div><div class="card-desc">Ordonnances</div></div>
  <div class="card card-anim" style="animation-delay:.3s"><div class="card-icon">🚑</div><div class="card-title">Urgences</div><div class="card-desc">7j/7 de 8h à 22h</div></div>
  <div class="card card-anim" style="animation-delay:.45s"><div class="card-icon">🔬</div><div class="card-title">Analyses</div><div class="card-desc">Laboratoire intégré</div></div>
</div></div></section>
<section id="contact"><div class="container" style="text-align:center"><h2 class="section-title">Prenez rendez-vous</h2><p style="opacity:.7;margin-bottom:32px">En ligne 24/7</p><button class="hero-cta">📅 Réserver</button></div></section>`;
}

function renderImmobilier(name: string, p: string, s: string): string {
  return `
<section class="hero"><div class="hero-content"><div class="hero-badge">Immobilier de confiance</div><h1>Trouvez votre chez-vous</h1><p>Un large choix de biens vérifiés</p><button class="hero-cta">Voir les biens →</button></div></section>
<section id="services"><div class="container"><div class="section-header"><span class="section-label">Biens disponibles</span><h2 class="section-title">Nos dernières annonces</h2></div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px">
  <div class="card card-anim"><div class="card-icon">🏠</div><div class="card-title">Appartement 3 pièces</div><div class="card-desc">Paris 11e — 65m² · 450 000 €</div></div>
  <div class="card card-anim" style="animation-delay:.15s"><div class="card-icon">🏡</div><div class="card-title">Maison 5 pièces</div><div class="card-desc">Lyon 6e — 120m² · 780 000 €</div></div>
  <div class="card card-anim" style="animation-delay:.3s"><div class="card-icon">🏢</div><div class="card-title">Loft industriel</div><div class="card-desc">Bordeaux — 85m² · 520 000 €</div></div>
</div></div></section>
<section id="contact"><div class="container" style="text-align:center"><h2 class="section-title">Estimation gratuite</h2><p style="opacity:.7;margin-bottom:32px">En 24h</p><button class="hero-cta">Demander une estimation</button></div></section>`;
}

function renderAvocat(name: string, p: string, s: string): string {
  return `
<section class="hero"><div class="hero-content"><div class="hero-badge">Conseil juridique</div><h1>Défendons vos droits</h1><p>Un accompagnement juridique d'excellence</p><button class="hero-cta">Consulter un avocat →</button></div></section>
<section id="services"><div class="container"><div class="section-header"><span class="section-label">Domaines</span><h2 class="section-title">Notre expertise</h2></div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:24px">
  <div class="card card-anim"><div class="card-icon">⚖️</div><div class="card-title">Droit des affaires</div><div class="card-desc">Conseil aux entreprises</div></div>
  <div class="card card-anim" style="animation-delay:.15s"><div class="card-icon">👥</div><div class="card-title">Droit social</div><div class="card-desc">Litiges salariés</div></div>
  <div class="card card-anim" style="animation-delay:.3s"><div class="card-icon">🏛️</div><div class="card-title">Contentieux</div><div class="card-desc">Représentation tribunal</div></div>
  <div class="card card-anim" style="animation-delay:.45s"><div class="card-icon">📜</div><div class="card-title">Contrats</div><div class="card-desc">Rédaction et négociation</div></div>
</div></div></section>
<section id="contact"><div class="container" style="text-align:center"><h2 class="section-title">Première consultation</h2><p style="opacity:.7;margin-bottom:32px">Gratuite — 30 minutes</p><button class="hero-cta">Prendre rendez-vous</button></div></section>`;
}

function renderHotel(name: string, p: string, s: string): string {
  return `
<section class="hero"><div class="hero-content"><div class="hero-badge">Hospitalité premium</div><h1>Séjour d'exception</h1><p>Un hébergement de prestige</p><button class="hero-cta">Réserver maintenant →</button></div></section>
<section id="services"><div class="container"><div class="section-header"><span class="section-label">Chambres & Suites</span><h2 class="section-title">Nos hébergements</h2></div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px">
  <div class="card card-anim"><div class="card-icon">🛏️</div><div class="card-title">Chambre Standard</div><div class="card-desc">25m² · 120€/nuit</div></div>
  <div class="card card-anim" style="animation-delay:.15s"><div class="card-icon">🛌</div><div class="card-title">Chambre Deluxe</div><div class="card-desc">35m² · 220€/nuit</div></div>
  <div class="card card-anim" style="animation-delay:.3s"><div class="card-icon">👑</div><div class="card-title">Suite Présidentielle</div><div class="card-desc">85m² · 650€/nuit</div></div>
</div></div></section>
<section id="contact"><div class="container" style="text-align:center"><h2 class="section-title">Réservez votre séjour</h2><p style="opacity:.7;margin-bottom:32px">Meilleur tarif garanti</p><button class="hero-cta">Vérifier les disponibilités</button></div></section>`;
}

function renderTech(name: string, p: string, s: string): string {
  return `
<section class="hero"><div class="hero-content"><div class="hero-badge">Tech & innovation</div><h1>Innovation digitale</h1><p>Des solutions technologiques</p><button class="hero-cta">Voir nos solutions →</button></div></section>
<section id="services"><div class="container"><div class="section-header"><span class="section-label">Solutions</span><h2 class="section-title">Ce que nous proposons</h2></div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:24px">
  <div class="card card-anim"><div class="card-icon">💻</div><div class="card-title">Développement</div><div class="card-desc">Web, mobile et API</div></div>
  <div class="card card-anim" style="animation-delay:.15s"><div class="card-icon">☁️</div><div class="card-title">Cloud</div><div class="card-desc">Infrastructure scalable</div></div>
  <div class="card card-anim" style="animation-delay:.3s"><div class="card-icon">🔒</div><div class="card-title">Cybersécurité</div><div class="card-desc">Protection des données</div></div>
  <div class="card card-anim" style="animation-delay:.45s"><div class="card-icon">🤖</div><div class="card-title">IA</div><div class="card-desc">Automatisation intelligente</div></div>
</div></div></section>
<section id="contact"><div class="container" style="text-align:center"><h2 class="section-title">Prêt à démarrer ?</h2><p style="opacity:.7;margin-bottom:32px">Essai gratuit 14 jours</p><button class="hero-cta">Commencer</button></div></section>`;
}

// ═══════════════════════════════════════════════════════════════
// FONCTION PRINCIPALE
// ═══════════════════════════════════════════════════════════════
export type BuildOptions = {
  heroVideoUrl?: string;
  extraVideos?: string[];
  galleryPhotos?: string[];
  model3DUrl?: string;
  projectId?: string;
};

export function buildMultiPageSite(config: SiteConfig, opts: BuildOptions = {}): string {
  const { name } = config as any;
  const type = detectType((config as any).type || (config as any).businessType || "");

  const palettes = PALETTES[type] || PALETTES.portfolio;
  const palette = palettes[Math.floor(Math.random() * palettes.length)];
  const primary = palette.primary;
  const secondary = palette.secondary;

  const videos = VIDEO_POOL[type] || VIDEO_POOL.portfolio;
  const videoUrl = opts.heroVideoUrl || videos[Math.floor(Math.random() * videos.length)];

  let body = "";
  switch (type) {
    case "restaurant": body = renderRestaurant(name, primary, secondary); break;
    case "banque": body = renderBanque(name, primary, secondary, opts.projectId || ""); break;
    case "ecole": body = renderEcole(name, primary, secondary); break;
    case "sport": body = renderSport(name, primary, secondary); break;
    case "sante": body = renderSante(name, primary, secondary); break;
    case "immobilier": body = renderImmobilier(name, primary, secondary); break;
    case "avocat": body = renderAvocat(name, primary, secondary); break;
    case "hotel": body = renderHotel(name, primary, secondary); break;
    case "tech": body = renderTech(name, primary, secondary); break;
    default: body = renderPortfolio(name, primary, secondary);
  }

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${name}</title>
<style>${getSharedCSS(primary, secondary)}</style>
</head>
<body>
<div class="bg-video-wrap">
  <video autoplay muted loop playsinline preload="auto"><source src="${videoUrl}" type="video/mp4"></video>
  <div class="bg-video-overlay"></div>
</div>
<canvas id="three-canvas"></canvas>
<div class="page-content">
  ${getHeader(name)}
  ${body}
  ${getFooter(name, primary)}
</div>
${getThreeScript(primary, secondary, type)}
</body>
</html>`;
}