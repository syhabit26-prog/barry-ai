// src/lib/multiPageGenerator.ts
import type { SiteConfig } from "./siteTemplates";

const VIDEO_POOL = [
  "https://videos.pexels.com/video-files/3184287/3184287-hd_1920_1080_25fps.mp4",
  "https://videos.pexels.com/video-files/3252918/3252918-hd_1920_1080_25fps.mp4",
  "https://videos.pexels.com/video-files/2795767/2795796-hd_1920_1080_25fps.mp4",
  "https://videos.pexels.com/video-files/3571264/3571264-hd_1920_1080_30fps.mp4",
  "https://videos.pexels.com/video-files/3209828/3209828-hd_1920_1080_25fps.mp4",
];

function pickVideo(seed: number) {
  return VIDEO_POOL[Math.abs(seed) % VIDEO_POOL.length];
}

export type BuildOptions = {
  heroVideoUrl?: string;
  extraVideos?: string[];
  galleryPhotos?: string[];
  model3DUrl?: string;
};

export function buildMultiPageSite(config: SiteConfig, opts: BuildOptions = {}): string {
  const { name, tagline, color, content, animations } = config;
  const primary = color.primary;
  const secondary = color.secondary;

  const heroVideo = opts.heroVideoUrl || pickVideo(name.length);
  const midVideo = opts.extraVideos?.[0] || pickVideo(name.length + 1);
  const endVideo = opts.extraVideos?.[1] || pickVideo(name.length + 2);

  const photos = opts.galleryPhotos || [
    `https://image.pollinations.ai/prompt/${encodeURIComponent(name + " professional")}?width=800&height=600&nologo=true`,
  ];

  const primaryAnim = animations?.[0] || "fade";
  const animConfig: Record<string, { from: string; to: string }> = {
    fade: { from: "opacity:0;", to: "opacity:1;" },
    slide: { from: "opacity:0;transform:translateY(40px);", to: "opacity:1;transform:translateY(0);" },
    zoom: { from: "opacity:0;transform:scale(0.92);", to: "opacity:1;transform:scale(1);" },
    float: { from: "opacity:0;transform:translateY(30px);", to: "opacity:1;transform:translateY(0);" },
    gradient: { from: "opacity:0;transform:translateY(30px);", to: "opacity:1;transform:translateY(0);" },
  };
  const activeAnim = animConfig[primaryAnim] || animConfig.slide;

  // ─── Génère les sections dynamiquement ───
  const servicesHTML = content.services.map((s) => `
    <div class="card hover-lift reveal">
      <div class="card-icon">${s.icon}</div>
      <h3 class="card-title">${s.title}</h3>
      <p class="card-desc">${s.desc}</p>
    </div>
  `).join("");

  const statsHTML = content.stats.map((s) => `
    <div class="stat reveal">
      <div class="stat-value">${s.value}</div>
      <div class="stat-label">${s.label}</div>
    </div>
  `).join("");

  const testimonialsHTML = content.testimonials.map((t) => `
    <div class="testimonial hover-lift reveal">
      <div class="testimonial-stars">★★★★★</div>
      <p class="testimonial-text">"${t.text}"</p>
      <div class="testimonial-author">
        <img src="${t.avatar}" alt="${t.name}" loading="lazy" />
        <div>
          <div class="testimonial-name">${t.name}</div>
          <div class="testimonial-role">${t.role}</div>
        </div>
      </div>
    </div>
  `).join("");

  const faqHTML = content.faq.map((f) => `
    <details class="faq-item reveal">
      <summary>${f.q}</summary>
      <p>${f.a}</p>
    </details>
  `).join("");

  const galleryHTML = photos.slice(0, 6).map((p) => `
    <div class="gallery-item hover-lift reveal">
      <img src="${p}" alt="" loading="lazy" />
    </div>
  `).join("");

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${name} — ${tagline}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth;-webkit-font-smoothing:antialiased}
body{font-family:system-ui,-apple-system,'Inter',sans-serif;background:#0a0a0a;color:#f5f5f5;line-height:1.6;overflow-x:hidden}
a{color:inherit;text-decoration:none}
img{max-width:100%;display:block}

/* ═══ HEADER ═══ */
header{position:fixed;top:0;left:0;right:0;z-index:1000;background:rgba(10,10,10,.85);backdrop-filter:blur(20px);border-bottom:1px solid #222;padding:16px 0;animation:fadeIn 1s both}
.nav{max-width:1400px;margin:0 auto;padding:0 32px;display:flex;align-items:center;justify-content:space-between;gap:32px}
.logo{display:flex;align-items:center;gap:10px;font-size:20px;font-weight:800;color:${primary}}
.logo-mark{width:38px;height:38px;border-radius:10px;background:linear-gradient(135deg,${primary},${secondary});display:flex;align-items:center;justify-content:center;color:#000;font-weight:900;font-size:18px}
.nav-links{display:flex;gap:28px;font-size:14px;font-weight:500}
.nav-links a{opacity:.7;transition:opacity .3s}
.nav-links a:hover{opacity:1;color:${primary}}
.cta-btn{padding:12px 24px;background:${primary};color:#000;border:none;border-radius:100px;font-weight:700;font-size:14px;cursor:pointer;transition:transform .3s,box-shadow .3s;font-family:inherit}
.cta-btn:hover{transform:translateY(-3px) scale(1.05);box-shadow:0 12px 30px ${primary}60}

/* ═══ HERO ═══ */
.hero{position:relative;min-height:100vh;display:flex;align-items:center;justify-content:center;overflow:hidden;padding:120px 32px 60px}
.hero-video{position:absolute;top:50%;left:50%;min-width:100%;min-height:100%;width:auto;height:auto;transform:translate(-50%,-50%);object-fit:cover;z-index:0;filter:brightness(.35) saturate(1.3)}
.hero-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,10,10,.7) 0%,rgba(10,10,10,.5) 50%,#0a0a0a 100%);z-index:1}
.hero-content{position:relative;z-index:4;text-align:center;max-width:1000px}
.hero-badge{display:inline-block;padding:10px 20px;background:${primary}20;border:1px solid ${primary}60;border-radius:100px;font-size:12px;font-weight:700;color:${primary};letter-spacing:3px;text-transform:uppercase;margin-bottom:24px;animation:fadeIn 1.2s .2s both}
.hero h1{font-size:clamp(48px,9vw,140px);font-weight:900;line-height:.9;letter-spacing:-4px;margin-bottom:24px;background:linear-gradient(180deg,#fff 0%,${primary} 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:heroIn 1.8s cubic-bezier(.16,1,.3,1) .3s both}
.hero p{font-size:clamp(16px,1.8vw,22px);opacity:.85;max-width:700px;margin:0 auto 40px;animation:slideUp 1.5s cubic-bezier(.16,1,.3,1) .8s both}
.hero-cta{display:inline-flex;align-items:center;gap:12px;background:${primary};color:#000;padding:20px 48px;font-size:16px;font-weight:800;border-radius:100px;box-shadow:0 15px 50px ${primary}60;transition:all .4s;animation:slideUp 1.5s cubic-bezier(.16,1,.3,1) 1.2s both;cursor:pointer;border:none;font-family:inherit}
.hero-cta:hover{transform:translateY(-8px) scale(1.05);box-shadow:0 30px 80px ${primary}90}

/* ═══ SECTIONS ═══ */
section{padding:100px 32px;position:relative}
.container{max-width:1200px;margin:0 auto}
.section-header{text-align:center;margin-bottom:64px}
.section-label{display:inline-block;font-size:12px;font-weight:700;color:${primary};letter-spacing:4px;text-transform:uppercase;margin-bottom:16px;padding:8px 20px;border:1px solid ${primary}40;border-radius:100px}
.section-title{font-size:clamp(36px,5vw,64px);font-weight:900;letter-spacing:-2px;line-height:1.1;margin-bottom:20px}
.section-desc{font-size:16px;opacity:.6;max-width:600px;margin:0 auto}

/* ═══ STATS ═══ */
.stats-section{background:linear-gradient(180deg,transparent,#141414 50%,transparent)}
.stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:32px}
.stat{text-align:center;padding:32px 16px}
.stat-value{font-size:clamp(40px,6vw,64px);font-weight:900;color:${primary};letter-spacing:-2px;line-height:1}
.stat-label{font-size:14px;opacity:.6;margin-top:8px;text-transform:uppercase;letter-spacing:2px}

/* ═══ CARDS ═══ */
.cards-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px}
.card{background:#141414;border:1px solid #222;border-radius:20px;padding:32px;transition:all .5s cubic-bezier(.16,1,.3,1)}
.card:hover{border-color:${primary}80;box-shadow:0 20px 50px rgba(0,0,0,.5)}
.card-icon{font-size:48px;margin-bottom:20px}
.card-title{font-size:20px;font-weight:800;margin-bottom:12px;color:#fff}
.card-desc{font-size:14px;opacity:.7;line-height:1.6}

/* ═══ VIDEO SECTIONS ═══ */
.video-section{position:relative;min-height:70vh;display:flex;align-items:center;justify-content:center;overflow:hidden;padding:80px 32px}
.video-section video{position:absolute;top:50%;left:50%;min-width:100%;min-height:100%;width:auto;height:auto;transform:translate(-50%,-50%);object-fit:cover;filter:brightness(.4);z-index:0}
.video-overlay{position:absolute;inset:0;background:linear-gradient(180deg,#0a0a0a 0%,rgba(10,10,10,.6) 30%,rgba(10,10,10,.6) 70%,#0a0a0a 100%);z-index:1}
.video-content{position:relative;z-index:2;text-align:center;max-width:800px}
.video-content h2{font-size:clamp(36px,5vw,72px);font-weight:900;letter-spacing:-2.5px;line-height:1.05;margin-bottom:20px;color:#fff}
.video-content p{font-size:16px;opacity:.85;color:#fff}

/* ═══ GALERIE ═══ */
.gallery-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:16px}
.gallery-item{border-radius:16px;overflow:hidden;aspect-ratio:1;background:#141414}
.gallery-item img{width:100%;height:100%;object-fit:cover;transition:transform .8s cubic-bezier(.16,1,.3,1)}
.gallery-item:hover img{transform:scale(1.1)}

/* ═══ TESTIMONIALS ═══ */
.testimonials-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:24px}
.testimonial{background:#141414;border:1px solid #222;border-radius:20px;padding:32px}
.testimonial-stars{color:#f59e0b;font-size:20px;margin-bottom:16px;letter-spacing:2px}
.testimonial-text{font-size:15px;opacity:.85;line-height:1.7;margin-bottom:20px;font-style:italic}
.testimonial-author{display:flex;align-items:center;gap:12px}
.testimonial-author img{width:48px;height:48px;border-radius:50%;object-fit:cover}
.testimonial-name{font-weight:700;font-size:14px}
.testimonial-role{font-size:12px;opacity:.6}

/* ═══ FAQ ═══ */
.faq-list{max-width:800px;margin:0 auto}
.faq-item{background:#141414;border:1px solid #222;border-radius:16px;padding:24px;margin-bottom:16px;cursor:pointer;transition:border-color .3s}
.faq-item:hover{border-color:${primary}60}
.faq-item summary{font-size:16px;font-weight:700;list-style:none;display:flex;justify-content:space-between;align-items:center}
.faq-item summary::after{content:'+';font-size:24px;color:${primary};transition:transform .3s}
.faq-item[open] summary::after{transform:rotate(45deg)}
.faq-item p{margin-top:16px;opacity:.75;font-size:14px;line-height:1.7}

/* ═══ CTA FINAL ═══ */
.cta-section{text-align:center;padding:120px 32px}
.cta-section h2{font-size:clamp(36px,5vw,64px);font-weight:900;letter-spacing:-2px;margin-bottom:20px}
.cta-section p{font-size:18px;opacity:.7;margin-bottom:40px}

/* ═══ FOOTER ═══ */
footer{border-top:1px solid #222;padding:60px 32px 40px;text-align:center}
footer p{font-size:13px;opacity:.5;margin-bottom:8px}

/* ═══ ANIMATIONS ═══ */
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideUp{from{opacity:0;transform:translateY(60px)}to{opacity:1;transform:translateY(0)}}
@keyframes heroIn{from{opacity:0;transform:translateY(100px) scale(.9);filter:blur(20px)}to{opacity:1;transform:translateY(0) scale(1);filter:blur(0)}}
@keyframes floatAnim{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes pulseGlow{0%,100%{box-shadow:0 0 20px ${primary}30}50%{box-shadow:0 0 40px ${primary}70}}
@keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}

.hover-lift{transition:transform .4s cubic-bezier(.16,1,.3,1),box-shadow .4s cubic-bezier(.16,1,.3,1),border-color .4s}
.hover-lift:hover{transform:translateY(-8px) scale(1.02);box-shadow:0 24px 50px rgba(0,0,0,.5);border-color:${primary}80}

.reveal{${activeAnim.from}transition:opacity 1s cubic-bezier(.16,1,.3,1),transform 1s cubic-bezier(.16,1,.3,1)}
.reveal.visible{${activeAnim.to}}

.cards-grid .card:nth-child(1){transition-delay:.05s}
.cards-grid .card:nth-child(2){transition-delay:.1s}
.cards-grid .card:nth-child(3){transition-delay:.15s}
.cards-grid .card:nth-child(4){transition-delay:.2s}
.cards-grid .card:nth-child(5){transition-delay:.25s}
.cards-grid .card:nth-child(6){transition-delay:.3s}

.stats-grid .stat:nth-child(1){transition-delay:.05s}
.stats-grid .stat:nth-child(2){transition-delay:.1s}
.stats-grid .stat:nth-child(3){transition-delay:.15s}
.stats-grid .stat:nth-child(4){transition-delay:.2s}

.testimonials-grid .testimonial:nth-child(1){transition-delay:.05s}
.testimonials-grid .testimonial:nth-child(2){transition-delay:.1s}
.testimonials-grid .testimonial:nth-child(3){transition-delay:.15s}

.gallery-grid .gallery-item:nth-child(1){transition-delay:.05s}
.gallery-grid .gallery-item:nth-child(2){transition-delay:.1s}
.gallery-grid .gallery-item:nth-child(3){transition-delay:.15s}
.gallery-grid .gallery-item:nth-child(4){transition-delay:.2s}
.gallery-grid .gallery-item:nth-child(5){transition-delay:.25s}
.gallery-grid .gallery-item:nth-child(6){transition-delay:.3s}

${animations?.includes("float") ? `.hero-badge{animation:fadeIn 1.2s .2s both, floatAnim 4s ease-in-out infinite 1.4s}\n.card:hover .card-icon{animation:floatAnim 2s ease-in-out infinite}` : ""}
${animations?.includes("gradient") ? `.hero h1{background:linear-gradient(90deg,#fff,${primary},#fff,${secondary},#fff);background-size:300% 300%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:heroIn 1.8s cubic-bezier(.16,1,.3,1) .3s both, gradientShift 8s ease infinite 2s}` : ""}

@media(max-width:768px){
  .nav-links{display:none}
  section{padding:60px 20px}
  .hero{padding:100px 20px 40px}
  .hero h1{letter-spacing:-2px}
}

@media(prefers-reduced-motion:reduce){
  *,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important}
}
</style>
</head>
<body>

<header>
  <div class="nav">
    <div class="logo">
      <span class="logo-mark">${name.charAt(0).toUpperCase()}</span>
      <span>${name}</span>
    </div>
    <nav class="nav-links">
      ${content.services.slice(0, 4).map((s) => `<a href="#s-${s.title.toLowerCase().replace(/\s/g, "-")}">${s.title}</a>`).join("")}
      <a href="#contact">Contact</a>
    </nav>
    <button class="cta-btn" onclick="document.getElementById('contact').scrollIntoView({behavior:'smooth'})">${content.cta.button}</button>
  </div>
</header>

<!-- HERO -->
<section class="hero">
  <video class="hero-video" autoplay muted loop playsinline preload="auto">
    <source src="${heroVideo}" type="video/mp4">
  </video>
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <div class="hero-badge">${tagline}</div>
    <h1>${content.hero.title}</h1>
    <p>${content.hero.subtitle}</p>
    <button class="hero-cta" onclick="document.getElementById('services').scrollIntoView({behavior:'smooth'})">
      ${content.hero.cta} →
    </button>
  </div>
</section>

<!-- STATS -->
<section class="stats-section">
  <div class="container">
    <div class="stats-grid">${statsHTML}</div>
  </div>
</section>

<!-- SERVICES -->
<section id="services">
  <div class="container">
    <div class="section-header">
      <span class="section-label">Nos services</span>
      <h2 class="section-title">Ce que nous offrons</h2>
      <p class="section-desc">Découvrez nos services conçus pour vous</p>
    </div>
    <div class="cards-grid">${servicesHTML}</div>
  </div>
</section>

<!-- VIDEO MILIEU -->
<section class="video-section">
  <video autoplay muted loop playsinline preload="auto"><source src="${midVideo}" type="video/mp4"></video>
  <div class="video-overlay"></div>
  <div class="video-content">
    <h2>L'excellence à portée de main</h2>
    <p>Chaque détail compte pour vous offrir la meilleure expérience</p>
  </div>
</section>

<!-- GALERIE -->
<section>
  <div class="container">
    <div class="section-header">
      <span class="section-label">Galerie</span>
      <h2 class="section-title">Nos réalisations</h2>
    </div>
    <div class="gallery-grid">${galleryHTML}</div>
  </div>
</section>

<!-- TESTIMONIALS -->
<section>
  <div class="container">
    <div class="section-header">
      <span class="section-label">Témoignages</span>
      <h2 class="section-title">Ils nous font confiance</h2>
    </div>
    <div class="testimonials-grid">${testimonialsHTML}</div>
  </div>
</section>

<!-- VIDEO FIN -->
<section class="video-section">
  <video autoplay muted loop playsinline preload="auto"><source src="${endVideo}" type="video/mp4"></video>
  <div class="video-overlay"></div>
  <div class="video-content">
    <h2>Rejoignez-nous</h2>
    <p>Faites partie de ceux qui réussissent</p>
  </div>
</section>

<!-- FAQ -->
<section>
  <div class="container">
    <div class="section-header">
      <span class="section-label">FAQ</span>
      <h2 class="section-title">Questions fréquentes</h2>
    </div>
    <div class="faq-list">${faqHTML}</div>
  </div>
</section>

<!-- CTA FINAL -->
<section class="cta-section" id="contact">
  <div class="container">
    <h2>${content.cta.title}</h2>
    <p>${content.cta.subtitle}</p>
    <button class="hero-cta">${content.cta.button}</button>
  </div>
</section>

<footer>
  <p><strong style="color:${primary};font-size:16px">${name}</strong></p>
  <p>${tagline}</p>
  <p>© 2026 ${name} — Tous droits réservés</p>
</footer>

<script>
(function(){
  function revealVisible(){
    var els = document.querySelectorAll('.reveal:not(.visible)');
    var vh = window.innerHeight || document.documentElement.clientHeight;
    for(var i = 0; i < els.length; i++){
      var rect = els[i].getBoundingClientRect();
      if(rect.top < vh * 0.92){
        els[i].classList.add('visible');
      }
    }
  }
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });
  }
  window.addEventListener('scroll', revealVisible, { passive: true });
  window.addEventListener('load', revealVisible);
  revealVisible();
  setTimeout(revealVisible, 150);
  setTimeout(revealVisible, 600);
})();
</script>
</body>
</html>`;
}