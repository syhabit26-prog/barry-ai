import { SiteConfig } from "./siteTemplates";

// ═══════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════
type CinematicAssets = {
  heroVideoUrl?: string;
  galleryPhotos?: string[];
  extraVideos?: string[];
  model3DUrl?: string;
};

type DesignProfile = {
  fontDisplay: string;
  fontBody: string;
  heroLayout: string;
  sectionSpacing: number;
  borderRadius: number;
  cardLayout: string;
};

// ═══════════════════════════════════════════════════════════════
// Hash + profil unique par site
// ═══════════════════════════════════════════════════════════════
function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function generateProfile(seed: string): DesignProfile {
  const h = hashString(seed);

  const fonts: Array<{ display: string; body: string }> = [
    { display: "Space Grotesk", body: "Inter" },
    { display: "Outfit", body: "DM Sans" },
    { display: "Sora", body: "Manrope" },
    { display: "Poppins", body: "Inter" },
    { display: "Playfair Display", body: "Inter" },
  ];

  const layouts: string[] = ["left", "center", "split"];
  const cardLayouts: string[] = ["grid", "offset", "masonry"];
  const spacings: number[] = [80, 120, 160];
  const radii: number[] = [0, 12, 24];

  const font = fonts[h % fonts.length];
  const heroLayout = layouts[h % layouts.length];
  const cardLayout = cardLayouts[(h + 1) % cardLayouts.length];
  const spacing = spacings[(h + 2) % spacings.length];
  const radius = radii[(h + 3) % radii.length];

  return {
    fontDisplay: font.display,
    fontBody: font.body,
    heroLayout,
    sectionSpacing: spacing,
    borderRadius: radius,
    cardLayout,
  };
}

// ═══════════════════════════════════════════════════════════════
// HERO — Cinématique avec vidéo de fond
// ═══════════════════════════════════════════════════════════════
function buildHero(
  config: SiteConfig,
  assets: CinematicAssets,
  profile: DesignProfile,
  primary: string
): string {
  const video = assets.heroVideoUrl
    ? `<video class="hero-video" autoplay muted loop playsinline preload="metadata"><source src="${assets.heroVideoUrl}" type="video/mp4"></video>`
    : `<div class="hero-gradient"></div>`;

  const textAlign = profile.heroLayout === "center" ? "center" : "left";
  const alignItems = profile.heroLayout === "center" ? "center" : "flex-start";

  const secondPage = config.pages[1] || "contact";
  const secondSlug = secondPage.toLowerCase().replace(/\s+/g, "-");

  return `
<section id="home" class="page active hero">
  ${video}
  <div class="hero-vignette"></div>
  <div class="hero-content" style="text-align:${textAlign};align-items:${alignItems}">
    <div class="hero-meta">
      <span class="hero-dot" style="background:${primary}"></span>
      <span>${config.content.hero.title}</span>
    </div>
    <h1 class="hero-display">
      <span class="hero-line">${config.name}</span>
    </h1>
    <p class="hero-sub">${config.content.hero.subtitle}</p>
    <div class="hero-actions">
      <a href="#${secondSlug}" class="btn-primary" data-page>
        <span>${config.content.hero.cta}</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </a>
      <a href="#contact" class="btn-ghost" data-page>Nous contacter</a>
    </div>
  </div>
  <div class="hero-scroll">
    <span class="hero-scroll-text">SCROLL</span>
    <span class="hero-scroll-line"></span>
  </div>
</section>`;
}

// ═══════════════════════════════════════════════════════════════
// SERVICES — Cartes
// ═══════════════════════════════════════════════════════════════
function buildServices(config: SiteConfig, profile: DesignProfile, primary: string): string {
  const gridClass =
    profile.cardLayout === "offset"
      ? "services-offset"
      : profile.cardLayout === "masonry"
      ? "services-masonry"
      : "services-grid";

  const cards = config.content.services
    .map(
      (s, i) => `
    <article class="service-card" data-reveal data-delay="${i * 80}" style="border-radius:${profile.borderRadius}px">
      <div class="service-number" style="color:${primary}">${String(i + 1).padStart(2, "0")}</div>
      <div class="service-icon">${s.icon}</div>
      <h3 class="service-title">${s.title}</h3>
      <p class="service-desc">${s.desc}</p>
    </article>
  `
    )
    .join("");

  return `<div class="${gridClass}">${cards}</div>`;
}

// ═══════════════════════════════════════════════════════════════
// STATS
// ═══════════════════════════════════════════════════════════════
function buildStats(config: SiteConfig): string {
  const items = config.content.stats
    .map(
      (s) => `
    <div class="stat">
      <div class="stat-value">${s.value}</div>
      <div class="stat-label">${s.label}</div>
    </div>
  `
    )
    .join("");

  return `<div class="stats-section" data-reveal>${items}</div>`;
}

// ═══════════════════════════════════════════════════════════════
// TESTIMONIALS
// ═══════════════════════════════════════════════════════════════
function buildTestimonials(config: SiteConfig): string {
  const items = config.content.testimonials
    .map(
      (t, i) => `
    <div class="testimonial" data-reveal data-delay="${i * 100}">
      <div class="testimonial-quote">"${t.text}"</div>
      <div class="testimonial-author">
        <img src="${t.avatar}" alt="${t.name}" loading="lazy" />
        <div>
          <div class="author-name">${t.name}</div>
          <div class="author-role">${t.role}</div>
        </div>
      </div>
    </div>
  `
    )
    .join("");

  return `<div class="testimonials-grid">${items}</div>`;
}

// ═══════════════════════════════════════════════════════════════
// GALERIE — Photos + Vidéos (avec safe defaults)
// ═══════════════════════════════════════════════════════════════
function buildGallery(assets: CinematicAssets): string {
  let output = "";
  const videos: string[] = assets.extraVideos || [];
  const photos: string[] = assets.galleryPhotos || [];

  if (videos.length > 0) {
    output += `<div class="video-showcase" data-reveal>`;
    output += videos
      .slice(0, 2)
      .map(
        (v) =>
          `<div class="video-tile"><video autoplay muted loop playsinline preload="metadata"><source src="${v}" type="video/mp4"></video></div>`
      )
      .join("");
    output += `</div>`;
  }

  if (photos.length > 0) {
    output += `<div class="photo-masonry">`;
    output += photos
      .map(
        (url, i) =>
          `<div class="photo-tile" data-reveal data-delay="${i * 60}"><img src="${url}" alt="Photo ${i + 1}" loading="lazy" /></div>`
      )
      .join("");
    output += `</div>`;
  }

  if (output === "") {
    output = `<p style="opacity:0.5;text-align:center;padding:60px 0">Aucun média pour le moment.</p>`;
  }

  return output;
}

// ═══════════════════════════════════════════════════════════════
// PAGE GÉNÉRIQUE
// ═══════════════════════════════════════════════════════════════
function buildPage(
  config: SiteConfig,
  title: string,
  profile: DesignProfile,
  primary: string,
  assets: CinematicAssets
): string {
  const slug = title.toLowerCase().replace(/\s+/g, "-");
  const tl = title.toLowerCase();

  let content = "";

  if (tl === "galerie") {
    content = buildGallery(assets);
  } else if (
    /service|produit|menu|formation|cours|domaine|solution|chambre|mission|particulier|entreprise|technolog|offre|tarif|destination|coach/.test(
      tl
    )
  ) {
    content = buildServices(config, profile, primary) + buildStats(config);
  } else if (/projet|réalis|bien|actualit|équipe|règles|score/.test(tl)) {
    content = buildTestimonials(config);
  } else if (/propos|admission|agence|vie scolaire/.test(tl)) {
    content = buildStats(config) + buildTestimonials(config);
  } else {
    content = buildServices(config, profile, primary);
  }

  return `
<section id="${slug}" class="page">
  <div class="page-inner">
    <header class="page-header" data-reveal>
      <span class="page-badge" style="color:${primary}">${title}</span>
      <h2 class="page-title">${title}</h2>
      <p class="page-sub">Découvrez ${tl} de ${config.name}</p>
    </header>
    ${content}
  </div>
</section>`;
}

// ═══════════════════════════════════════════════════════════════
// CONTACT
// ═══════════════════════════════════════════════════════════════
function buildContact(config: SiteConfig): string {
  return `
<section id="contact" class="page">
  <div class="page-inner">
    <header class="page-header" data-reveal>
      <span class="page-badge">Contact</span>
      <h2 class="page-title">Discutons ensemble</h2>
      <p class="page-sub">Nous répondons en moins de 24h</p>
    </header>
    <form class="contact-form" data-reveal onsubmit="submitContact(event)">
      <div class="form-row">
        <input type="text" placeholder="Nom complet" required />
        <input type="email" placeholder="Email" required />
      </div>
      <input type="text" placeholder="Sujet" />
      <textarea rows="5" placeholder="Votre message..." required></textarea>
      <button type="submit" class="btn-primary">Envoyer le message</button>
    </form>
  </div>
</section>`;
}

// ═══════════════════════════════════════════════════════════════
// CTA FINAL
// ═══════════════════════════════════════════════════════════════
function buildCTA(config: SiteConfig, primary: string): string {
  return `
<section class="cta-section" data-reveal>
  <div class="cta-inner" style="border-color:${primary}30">
    <h2 class="cta-title">${config.content.cta.title}</h2>
    <p class="cta-sub">${config.content.cta.subtitle}</p>
    <a href="#contact" class="btn-primary" data-page>
      <span>${config.content.cta.button}</span>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
    </a>
  </div>
</section>`;
}

// ═══════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════
function buildStyles(
  config: SiteConfig,
  profile: DesignProfile,
  primary: string,
  secondary: string
): string {
  const spacing = profile.sectionSpacing;
  const radius = profile.borderRadius;

  return `
* { margin:0; padding:0; box-sizing:border-box; }
html { scroll-behavior:smooth; -webkit-font-smoothing:antialiased; }
body {
  font-family:'${profile.fontBody}', -apple-system, sans-serif;
  background:#050505; color:#fff;
  line-height:1.6; overflow-x:hidden;
}

.site-header {
  position:fixed; top:0; left:0; right:0; z-index:1000;
  backdrop-filter:blur(24px) saturate(180%);
  background:rgba(5,5,5,0.6);
  border-bottom:1px solid rgba(255,255,255,0.05);
}
.nav-wrapper {
  max-width:1500px; margin:0 auto; padding:20px 40px;
  display:flex; align-items:center; justify-content:space-between;
}
.logo {
  font-family:'${profile.fontDisplay}', sans-serif;
  font-size:20px; font-weight:700; color:#fff;
  text-decoration:none; letter-spacing:-0.5px;
}
.nav-links { display:flex; gap:36px; }
.nav-links a {
  color:rgba(255,255,255,0.55); text-decoration:none;
  font-size:13px; font-weight:500; transition:color 0.3s;
}
.nav-links a:hover { color:#fff; }
.menu-btn { display:none; background:none; border:none; color:#fff; font-size:24px; cursor:pointer; }

.page { display:none; }
.page.active { display:block; animation:pageIn 0.8s cubic-bezier(0.16,1,0.3,1) both; }
@keyframes pageIn {
  from { opacity:0; transform:translateY(24px); filter:blur(8px); }
  to { opacity:1; transform:translateY(0); filter:blur(0); }
}

/* HERO */
.hero {
  position:relative; min-height:100vh;
  display:flex; align-items:center;
  padding:140px 60px 100px;
  overflow:hidden;
}
.hero-video {
  position:absolute; top:50%; left:50%;
  min-width:100%; min-height:100%;
  width:auto; height:auto;
  transform:translate(-50%,-50%);
  object-fit:cover; z-index:0;
  filter:saturate(0.9) brightness(0.5);
}
.hero-gradient {
  position:absolute; inset:0; z-index:0;
  background:
    radial-gradient(circle at 20% 30%, ${primary}20 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, ${secondary}20 0%, transparent 50%);
}
.hero-vignette {
  position:absolute; inset:0; z-index:1;
  background:linear-gradient(180deg, rgba(5,5,5,0.3) 0%, rgba(5,5,5,0.7) 60%, rgba(5,5,5,1) 100%);
}
.hero-content {
  position:relative; z-index:2;
  display:flex; flex-direction:column;
  max-width:1500px; width:100%; margin:0 auto;
  gap:24px;
}
.hero-meta {
  display:inline-flex; align-items:center; gap:10px;
  font-size:12px; font-weight:500;
  letter-spacing:0.2em; text-transform:uppercase;
  color:rgba(255,255,255,0.7);
}
.hero-dot {
  width:8px; height:8px; border-radius:50%;
  animation:pulse 2s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity:1; transform:scale(1); }
  50% { opacity:0.4; transform:scale(1.2); }
}
.hero-display {
  font-family:'${profile.fontDisplay}', sans-serif;
  font-size:clamp(56px, 11vw, 160px);
  font-weight:700; line-height:0.95;
  letter-spacing:-0.05em; margin:0;
  background:linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.6) 100%);
  -webkit-background-clip:text; -webkit-text-fill-color:transparent;
  background-clip:text;
  max-width:1200px;
}
.hero-line {
  display:block;
  opacity:0; transform:translateY(100%);
  animation:heroReveal 1.4s cubic-bezier(0.16,1,0.3,1) 0.3s forwards;
}
@keyframes heroReveal {
  to { opacity:1; transform:translateY(0); }
}
.hero-sub {
  font-size:clamp(16px, 1.6vw, 22px);
  color:rgba(255,255,255,0.65);
  max-width:560px; line-height:1.5;
  opacity:0; animation:fadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.6s forwards;
}
.hero-actions {
  display:flex; gap:16px; flex-wrap:wrap;
  margin-top:16px;
  opacity:0; animation:fadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.9s forwards;
}
@keyframes fadeUp {
  from { opacity:0; transform:translateY(20px); }
  to { opacity:1; transform:translateY(0); }
}
.hero-scroll {
  position:absolute; bottom:40px; left:50%;
  transform:translateX(-50%);
  display:flex; flex-direction:column; align-items:center; gap:12px;
  z-index:3; opacity:0.5;
}
.hero-scroll-text { font-size:11px; letter-spacing:0.3em; }
.hero-scroll-line {
  width:1px; height:40px;
  background:linear-gradient(180deg, #fff, transparent);
  animation:scrollLine 2s ease-in-out infinite;
}
@keyframes scrollLine {
  0% { transform:scaleY(0); transform-origin:top; }
  50% { transform:scaleY(1); transform-origin:top; }
  51% { transform:scaleY(1); transform-origin:bottom; }
  100% { transform:scaleY(0); transform-origin:bottom; }
}

/* BOUTONS */
.btn-primary {
  display:inline-flex; align-items:center; gap:12px;
  padding:18px 32px;
  background:${primary}; color:#000;
  border-radius:${radius}px;
  font-size:14px; font-weight:600;
  text-decoration:none; cursor:pointer; border:none;
  transition:all 0.3s cubic-bezier(0.16,1,0.3,1);
  font-family:inherit;
}
.btn-primary:hover {
  transform:translateY(-2px);
  box-shadow:0 20px 40px ${primary}40;
}
.btn-ghost {
  display:inline-flex; align-items:center;
  padding:18px 32px;
  background:transparent; color:#fff;
  border:1px solid rgba(255,255,255,0.15);
  border-radius:${radius}px;
  font-size:14px; font-weight:500;
  text-decoration:none; cursor:pointer;
  transition:all 0.3s;
  font-family:inherit;
}
.btn-ghost:hover {
  background:rgba(255,255,255,0.05);
  border-color:rgba(255,255,255,0.3);
}

/* PAGES */
.page-inner { max-width:1500px; margin:0 auto; padding:${spacing}px 60px; }
.page-header { max-width:900px; margin-bottom:80px; }
.page-badge {
  display:inline-block;
  font-size:11px; font-weight:600;
  letter-spacing:0.25em; text-transform:uppercase;
  margin-bottom:20px;
}
.page-title {
  font-family:'${profile.fontDisplay}', sans-serif;
  font-size:clamp(40px, 6vw, 88px);
  font-weight:700; line-height:1;
  letter-spacing:-0.03em; margin-bottom:20px;
}
.page-sub {
  font-size:18px;
  color:rgba(255,255,255,0.5);
  max-width:560px;
}

/* SERVICES */
.services-grid {
  display:grid;
  grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));
  gap:2px;
  background:rgba(255,255,255,0.05);
  border:1px solid rgba(255,255,255,0.05);
  border-radius:${radius}px;
  overflow:hidden;
}
.services-offset {
  display:grid;
  grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));
  gap:32px;
}
.services-masonry {
  display:grid;
  grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));
  gap:20px;
}
.service-card {
  padding:48px 40px;
  background:#0a0a0a;
  transition:all 0.5s cubic-bezier(0.16,1,0.3,1);
}
.service-card:hover { background:#111; }
.service-number {
  font-family:'${profile.fontDisplay}', sans-serif;
  font-size:14px; font-weight:600;
  margin-bottom:32px;
  letter-spacing:0.1em;
}
.service-icon { font-size:44px; margin-bottom:32px; display:block; }
.service-title {
  font-family:'${profile.fontDisplay}', sans-serif;
  font-size:22px; font-weight:600;
  letter-spacing:-0.01em; margin-bottom:14px;
  color:#fff;
}
.service-desc { font-size:15px; color:rgba(255,255,255,0.5); line-height:1.6; }

/* STATS */
.stats-section {
  display:grid;
  grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));
  gap:40px;
  margin:${spacing}px 0;
  padding:${Math.floor(spacing / 2)}px 0;
  border-top:1px solid rgba(255,255,255,0.08);
  border-bottom:1px solid rgba(255,255,255,0.08);
}
.stat { text-align:left; }
.stat-value {
  font-family:'${profile.fontDisplay}', sans-serif;
  font-size:clamp(48px, 5vw, 72px);
  font-weight:700; line-height:1;
  letter-spacing:-0.03em;
  color:${primary};
  margin-bottom:12px;
}
.stat-label {
  font-size:12px;
  letter-spacing:0.2em; text-transform:uppercase;
  color:rgba(255,255,255,0.4);
}

/* TESTIMONIALS */
.testimonials-grid {
  display:grid;
  grid-template-columns:repeat(auto-fit, minmax(340px, 1fr));
  gap:24px;
}
.testimonial {
  padding:40px 36px;
  background:rgba(255,255,255,0.02);
  border:1px solid rgba(255,255,255,0.06);
  border-radius:${radius}px;
  transition:all 0.4s;
}
.testimonial:hover {
  border-color:${primary}40;
  background:rgba(255,255,255,0.04);
}
.testimonial-quote {
  font-family:'${profile.fontDisplay}', sans-serif;
  font-size:20px; line-height:1.5;
  color:#fff; margin-bottom:32px;
  letter-spacing:-0.01em;
}
.testimonial-author { display:flex; align-items:center; gap:14px; }
.testimonial-author img { width:48px; height:48px; border-radius:50%; object-fit:cover; }
.author-name { font-size:14px; font-weight:600; color:#fff; }
.author-role { font-size:12px; color:rgba(255,255,255,0.4); }

/* GALLERY */
.video-showcase {
  display:grid; grid-template-columns:1fr 1fr;
  gap:20px; margin-bottom:60px;
}
.video-tile {
  aspect-ratio:16/9;
  overflow:hidden;
  border-radius:${radius}px;
  background:#111;
}
.video-tile video { width:100%; height:100%; object-fit:cover; display:block; }
.photo-masonry { columns:3 320px; column-gap:20px; }
.photo-tile {
  break-inside:avoid;
  margin-bottom:20px;
  border-radius:${radius}px;
  overflow:hidden;
  background:#111;
}
.photo-tile img { width:100%; height:auto; display:block; transition:transform 0.6s; }
.photo-tile:hover img { transform:scale(1.03); }

/* CTA */
.cta-section { padding:${spacing}px 60px; }
.cta-inner {
  max-width:1200px; margin:0 auto;
  padding:100px 60px;
  border:1px solid ${primary}30;
  border-radius:${radius}px;
  background:
    radial-gradient(circle at 30% 30%, ${primary}15 0%, transparent 60%),
    radial-gradient(circle at 70% 70%, ${secondary}15 0%, transparent 60%),
    rgba(255,255,255,0.01);
  text-align:center;
}
.cta-title {
  font-family:'${profile.fontDisplay}', sans-serif;
  font-size:clamp(40px, 5vw, 72px);
  font-weight:700; letter-spacing:-0.03em;
  line-height:1.05; margin-bottom:20px;
}
.cta-sub { font-size:18px; color:rgba(255,255,255,0.6); margin-bottom:40px; }

/* CONTACT */
.contact-form { max-width:700px; display:flex; flex-direction:column; gap:16px; }
.form-row { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
.contact-form input,
.contact-form textarea {
  padding:20px 24px;
  background:rgba(255,255,255,0.03);
  border:1px solid rgba(255,255,255,0.08);
  border-radius:${radius}px;
  color:#fff;
  font-size:15px;
  font-family:inherit;
  transition:all 0.3s;
}
.contact-form input:focus,
.contact-form textarea:focus {
  outline:none;
  border-color:${primary};
  background:rgba(255,255,255,0.05);
}
.contact-form textarea { resize:vertical; min-height:160px; }
.contact-form button { align-self:flex-start; }

/* FOOTER */
.site-footer {
  border-top:1px solid rgba(255,255,255,0.06);
  padding:80px 60px 40px;
  margin-top:${spacing}px;
}
.footer-inner {
  max-width:1500px; margin:0 auto;
  display:flex; justify-content:space-between; flex-wrap:wrap;
  gap:40px; margin-bottom:60px;
}
.footer-logo {
  font-family:'${profile.fontDisplay}', sans-serif;
  font-size:24px; font-weight:700;
  color:#fff; margin-bottom:8px;
  letter-spacing:-0.02em;
}
.footer-tagline { font-size:14px; color:rgba(255,255,255,0.4); max-width:400px; }
.footer-links { display:flex; gap:32px; flex-wrap:wrap; }
.footer-links a {
  color:rgba(255,255,255,0.4);
  text-decoration:none;
  font-size:14px;
  transition:color 0.3s;
}
.footer-links a:hover { color:#fff; }
.footer-bottom {
  text-align:center;
  font-size:12px;
  color:rgba(255,255,255,0.3);
  letter-spacing:0.1em;
}

/* REVEAL */
[data-reveal] {
  opacity:0;
  transform:translateY(40px);
  transition:opacity 1.2s cubic-bezier(0.16,1,0.3,1),
             transform 1.2s cubic-bezier(0.16,1,0.3,1);
}
[data-reveal].visible { opacity:1; transform:translateY(0); }

/* RESPONSIVE */
@media (max-width:900px) {
  .nav-links { display:none; }
  .nav-links.open {
    display:flex; flex-direction:column;
    position:absolute; top:100%; left:0; right:0;
    background:rgba(5,5,5,0.98);
    padding:30px; gap:20px;
  }
  .menu-btn { display:block; }
  .hero { padding:120px 24px 80px; }
  .page-inner { padding:80px 24px; }
  .cta-section { padding:80px 24px; }
  .cta-inner { padding:60px 30px; }
  .site-footer { padding:60px 24px 30px; }
  .form-row { grid-template-columns:1fr; }
  .video-showcase { grid-template-columns:1fr; }
  .photo-masonry { columns:1; }
  .stats-section { grid-template-columns:1fr 1fr; gap:24px; }
}
`;
}

// ═══════════════════════════════════════════════════════════════
// SCRIPT — GSAP + Lenis
// ═══════════════════════════════════════════════════════════════
const SCRIPT = `
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.29/dist/lenis.min.js"></script>
<script>
(function() {
  if (typeof Lenis === 'undefined') {
    document.querySelectorAll('[data-reveal]').forEach(function(el) { el.classList.add('visible'); });
  } else {
    var lenis = new Lenis({
      duration: 1.4,
      easing: function(t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true,
    });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      lenis.on('scroll', ScrollTrigger.update);

      document.querySelectorAll('[data-reveal]').forEach(function(el) {
        var delay = parseInt(el.getAttribute('data-delay') || '0');
        gsap.fromTo(el,
          { opacity: 0, y: 60 },
          {
            opacity: 1, y: 0,
            duration: 1.4,
            ease: 'power3.out',
            delay: delay / 1000,
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      var heroVideo = document.querySelector('.hero-video');
      if (heroVideo) {
        gsap.to(heroVideo, {
          scale: 1.15,
          ease: 'none',
          scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        });
      }

      var heroTitle = document.querySelector('.hero-display');
      if (heroTitle) {
        gsap.to(heroTitle, {
          y: 100,
          opacity: 0.3,
          ease: 'none',
          scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        });
      }
    }

    window.__lenis = lenis;
  }

  document.querySelectorAll('[data-page]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      var target = this.getAttribute('href').replace('#', '');
      showPage(target);
      if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
      setTimeout(function() {
        if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
      }, 500);
    });
  });

  function showPage(id) {
    document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
    var target = document.getElementById(id);
    if (target) {
      target.classList.add('active');
      setTimeout(function() {
        target.querySelectorAll('[data-reveal]').forEach(function(el) {
          var rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.85) el.classList.add('visible');
        });
      }, 100);
    }
  }

  window.toggleMenu = function() {
    document.querySelector('.nav-links').classList.toggle('open');
  };

  window.submitContact = function(e) {
    e.preventDefault();
    alert('Message envoyé !');
    e.target.reset();
  };
})();
</script>
<script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js"></script>
`;

// ═══════════════════════════════════════════════════════════════
// FONCTION PRINCIPALE
// ═══════════════════════════════════════════════════════════════
export function buildMultiPageSite(
  config: SiteConfig,
  assets?: CinematicAssets
): string {
  // Sécurité : toujours un objet avec les bonnes propriétés
  const safeAssets: CinematicAssets = {
    heroVideoUrl: assets && assets.heroVideoUrl ? assets.heroVideoUrl : undefined,
    galleryPhotos: (assets && assets.galleryPhotos) || [],
    extraVideos: (assets && assets.extraVideos) || [],
    model3DUrl: assets && assets.model3DUrl ? assets.model3DUrl : undefined,
  };

  const profile = generateProfile(config.name + config.type + config.mood);
  const primary = config.color.primary;
  const secondary = config.color.secondary;

  const header = `
<header class="site-header">
  <div class="nav-wrapper">
    <a href="#home" class="logo" data-page>${config.name}</a>
    <nav class="nav-links">
      ${config.pages
        .map(
          (p) =>
            '<a href="#' +
            p.toLowerCase().replace(/\s+/g, "-") +
            '" data-page>' +
            p +
            "</a>"
        )
        .join("")}
    </nav>
    <button class="menu-btn" onclick="toggleMenu()">☰</button>
  </div>
</header>`;

  let pagesHTML = "";
  for (let i = 0; i < config.pages.length; i++) {
    const page = config.pages[i];
    if (page === "Accueil") continue;
    if (page === "Contact") {
      pagesHTML += buildContact(config);
      continue;
    }
    pagesHTML += buildPage(config, page, profile, primary, safeAssets);
  }

  const footer = `
<footer class="site-footer">
  <div class="footer-inner">
    <div>
      <div class="footer-logo">${config.name}</div>
      <div class="footer-tagline">${config.tagline}</div>
    </div>
    <div class="footer-links">
      ${config.pages
        .map(
          (p) =>
            '<a href="#' +
            p.toLowerCase().replace(/\s+/g, "-") +
            '" data-page>' +
            p +
            "</a>"
        )
        .join("")}
    </div>
  </div>
  <div class="footer-bottom">© ${new Date().getFullYear()} ${config.name}. Tous droits réservés.</div>
</footer>`;

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${config.name} — ${config.tagline}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=${profile.fontDisplay.replace(
    / /g,
    "+"
  )}:wght@400;500;600;700;800&family=${profile.fontBody.replace(
    / /g,
    "+"
  )}:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>${buildStyles(config, profile, primary, secondary)}</style>
</head>
<body>
${header}
${buildHero(config, safeAssets, profile, primary)}
${pagesHTML}
${buildCTA(config, primary)}
${footer}
${SCRIPT}
</body>
</html>`;
}