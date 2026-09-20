// src/lib/animator.ts
type AnimateAssets = {
  heroVideoUrl?: string;
  heroImageUrl?: string;
  model3DUrl?: string;
  extraVideos?: string[];
  riveUrl?: string;
  accentColor?: string;
};

const RIVE_ANIMATIONS = [
  "https://cdn.rive.app/animations/vehicles.riv",
  "https://cdn.rive.app/animations/off_road_car.riv",
];

const FALLBACK_VIDEOS = [
  "https://videos.pexels.com/video-files/3184287/3184287-hd_1920_1080_25fps.mp4",
  "https://videos.pexels.com/video-files/3252918/3252918-hd_1920_1080_25fps.mp4",
  "https://videos.pexels.com/video-files/2795767/2795796-hd_1920_1080_25fps.mp4",
  "https://videos.pexels.com/video-files/3571264/3571264-hd_1920_1080_30fps.mp4",
  "https://videos.pexels.com/video-files/3209828/3209828-hd_1920_1080_25fps.mp4",
];

const ANIM_STYLES = [
  "fadeUp", "fadeDown", "zoomIn", "zoomOut", "slideLeft", "slideRight",
  "rotateIn", "flipY", "flipX", "blurIn", "scaleUp", "bounceIn",
  "elasticIn", "swingIn", "staggerUp", "waveIn", "skewIn", "cascade"
];

const SHAPE_STYLES = [
  "orbs", "squares", "triangles", "hexagons", "waves", "particles",
  "lines", "dots", "rings", "blobs", "diamonds", "crosses"
];

const HERO_LAYOUTS = ["center", "left", "split", "diagonal"];

const TYPO_STYLES = ["tight", "wide", "elegant", "bold", "modern", "classic", "brutal", "soft"];

function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function generatePalette(hash: number) {
  const hue1 = hash % 360;
  const hue2 = (hue1 + 30 + ((hash >> 8) % 90)) % 360;
  const hue3 = (hue1 + 180 + ((hash >> 16) % 60)) % 360;
  const sat1 = 55 + ((hash >> 4) % 40);
  const light1 = 45 + ((hash >> 6) % 20);
  const isDark = ((hash >> 10) % 2) === 0;
  const cardLight = 6 + ((hash >> 12) % 12);

  if (isDark) {
    return {
      bg: `hsl(${hue1}, 15%, 6%)`,
      bgAlt: `hsl(${hue1}, 18%, 10%)`,
      text: `hsl(${hue1}, 12%, 96%)`,
      textDim: `hsl(${hue1}, 10%, 65%)`,
      accent: `hsl(${hue2}, ${sat1}%, ${light1}%)`,
      accentText: `hsl(${hue1}, 20%, 8%)`,
      accent2: `hsl(${hue3}, ${sat1 - 10}%, ${light1 + 10}%)`,
      card: `hsl(${hue1}, ${cardLight + 4}%, ${cardLight + 8}%)`,
      border: `hsl(${hue1}, 15%, ${cardLight + 18}%)`,
      isDark: true,
    };
  } else {
    return {
      bg: `hsl(${hue1}, 30%, 98%)`,
      bgAlt: `hsl(${hue1}, 25%, 94%)`,
      text: `hsl(${hue1}, 35%, 10%)`,
      textDim: `hsl(${hue1}, 20%, 40%)`,
      accent: `hsl(${hue2}, ${sat1}%, 42%)`,
      accentText: `hsl(0, 0%, 100%)`,
      accent2: `hsl(${hue3}, ${sat1}%, 38%)`,
      card: `hsl(0, 0%, 100%)`,
      border: `hsl(${hue1}, 20%, 88%)`,
      isDark: false,
    };
  }
}

function generateShapeCSS(shape: string, palette: any): { css: string; html: string } {
  const c = palette.accent;
  const c2 = palette.accent2;

  switch (shape) {
    case "orbs":
      return { css: `.barry-shape{position:absolute;border-radius:50%;filter:blur(80px);opacity:.4;pointer-events:none;z-index:1}.barry-shape-1{width:500px;height:500px;background:${c};top:-100px;left:-100px;animation:barryFloat1 12s ease-in-out infinite}.barry-shape-2{width:400px;height:400px;background:${c2};bottom:-100px;right:-100px;animation:barryFloat2 15s ease-in-out infinite;opacity:.3}.barry-shape-3{width:300px;height:300px;background:${c};top:40%;right:20%;animation:barryFloat3 18s ease-in-out infinite;opacity:.2}`, html: `<div class="barry-shape barry-shape-1"></div><div class="barry-shape barry-shape-2"></div><div class="barry-shape barry-shape-3"></div>` };
    case "squares":
      return { css: `.barry-shape{position:absolute;border:3px solid ${c};opacity:.3;pointer-events:none;z-index:1;background:transparent}.barry-shape-1{width:200px;height:200px;top:10%;left:5%;transform:rotate(15deg);animation:barrySpin 20s linear infinite}.barry-shape-2{width:150px;height:150px;bottom:15%;right:10%;transform:rotate(-25deg);animation:barrySpin 25s linear infinite reverse;border-color:${c2}}.barry-shape-3{width:100px;height:100px;top:50%;right:30%;border-color:${c}}`, html: `<div class="barry-shape barry-shape-1"></div><div class="barry-shape barry-shape-2"></div><div class="barry-shape barry-shape-3"></div>` };
    case "triangles":
      return { css: `.barry-shape{position:absolute;width:0;height:0;opacity:.35;pointer-events:none;z-index:1}.barry-shape-1{border-left:100px solid transparent;border-right:100px solid transparent;border-bottom:170px solid ${c};top:10%;left:5%;animation:barryFloat1 14s ease-in-out infinite}.barry-shape-2{border-left:80px solid transparent;border-right:80px solid transparent;border-bottom:140px solid ${c2};bottom:15%;right:10%;animation:barryFloat2 18s ease-in-out infinite}`, html: `<div class="barry-shape barry-shape-1"></div><div class="barry-shape barry-shape-2"></div>` };
    case "hexagons":
      return { css: `.barry-shape{position:absolute;background:${c};opacity:.25;pointer-events:none;z-index:1;clip-path:polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)}.barry-shape-1{width:150px;height:170px;top:15%;left:8%;animation:barryFloat1 14s ease-in-out infinite}.barry-shape-2{width:120px;height:135px;bottom:20%;right:12%;background:${c2};animation:barryFloat2 16s ease-in-out infinite}`, html: `<div class="barry-shape barry-shape-1"></div><div class="barry-shape barry-shape-2"></div>` };
    case "waves":
      return { css: `.barry-shape{position:absolute;width:100%;left:0;height:100px;opacity:.3;pointer-events:none;z-index:1;background:linear-gradient(90deg,transparent,${c},transparent);clip-path:ellipse(80% 50% at 50% 50%)}.barry-shape-1{top:20%;animation:barryWave 8s ease-in-out infinite}.barry-shape-2{bottom:20%;background:linear-gradient(90deg,transparent,${c2},transparent);animation:barryWave 10s ease-in-out infinite reverse}`, html: `<div class="barry-shape barry-shape-1"></div><div class="barry-shape barry-shape-2"></div>` };
    case "particles":
      return { css: `.barry-shape{position:absolute;border-radius:50%;background:${c};pointer-events:none;z-index:1;box-shadow:0 0 20px ${c}}.barry-shape-1{width:8px;height:8px;top:20%;left:15%;animation:barryFloat1 6s ease-in-out infinite}.barry-shape-2{width:6px;height:6px;top:40%;left:80%;background:${c2};animation:barryFloat2 8s ease-in-out infinite}.barry-shape-3{width:10px;height:10px;bottom:30%;left:30%;animation:barryFloat3 10s ease-in-out infinite}`, html: `<div class="barry-shape barry-shape-1"></div><div class="barry-shape barry-shape-2"></div><div class="barry-shape barry-shape-3"></div>` };
    case "lines":
      return { css: `.barry-shape{position:absolute;pointer-events:none;z-index:1;background:${c};opacity:.3}.barry-shape-1{width:3px;height:300px;top:10%;left:10%;transform:rotate(30deg);animation:barryFloat1 12s ease-in-out infinite}.barry-shape-2{width:3px;height:200px;bottom:20%;right:15%;background:${c2};transform:rotate(-45deg);animation:barryFloat2 15s ease-in-out infinite}`, html: `<div class="barry-shape barry-shape-1"></div><div class="barry-shape barry-shape-2"></div>` };
    case "dots":
      return { css: `.barry-shape{position:absolute;border-radius:50%;border:2px solid ${c};pointer-events:none;z-index:1;opacity:.5}.barry-shape-1{width:100px;height:100px;top:15%;left:10%;animation:barryPulse 4s ease-in-out infinite}.barry-shape-2{width:60px;height:60px;bottom:25%;right:15%;border-color:${c2};animation:barryPulse 5s ease-in-out infinite 1s}`, html: `<div class="barry-shape barry-shape-1"></div><div class="barry-shape barry-shape-2"></div>` };
    case "rings":
      return { css: `.barry-shape{position:absolute;border-radius:50%;border:3px solid ${c};pointer-events:none;z-index:1;opacity:.35;background:transparent}.barry-shape-1{width:300px;height:300px;top:5%;right:5%;animation:barrySpin 30s linear infinite}.barry-shape-2{width:200px;height:200px;bottom:10%;left:10%;border-color:${c2};animation:barrySpin 20s linear infinite reverse}`, html: `<div class="barry-shape barry-shape-1"></div><div class="barry-shape barry-shape-2"></div>` };
    case "blobs":
      return { css: `.barry-shape{position:absolute;pointer-events:none;z-index:1;background:${c};opacity:.25;animation:barryMorph 8s ease-in-out infinite}.barry-shape-1{width:400px;height:400px;top:-100px;left:-100px;border-radius:60% 40% 30% 70%/60% 30% 70% 40%}.barry-shape-2{width:300px;height:300px;bottom:-50px;right:-50px;background:${c2};border-radius:30% 70% 70% 30%/30% 30% 70% 70%;animation-delay:2s}`, html: `<div class="barry-shape barry-shape-1"></div><div class="barry-shape barry-shape-2"></div>` };
    case "diamonds":
      return { css: `.barry-shape{position:absolute;background:${c};opacity:.3;pointer-events:none;z-index:1;transform:rotate(45deg)}.barry-shape-1{width:120px;height:120px;top:15%;left:8%;animation:barryFloat1 12s ease-in-out infinite}.barry-shape-2{width:80px;height:80px;bottom:20%;right:15%;background:${c2};animation:barryFloat2 15s ease-in-out infinite}`, html: `<div class="barry-shape barry-shape-1"></div><div class="barry-shape barry-shape-2"></div>` };
    case "crosses":
    default:
      return { css: `.barry-shape{position:absolute;pointer-events:none;z-index:1;opacity:.3}.barry-shape::before,.barry-shape::after{content:'';position:absolute;background:${c}}.barry-shape::before{width:100%;height:3px;top:50%;transform:translateY(-50%)}.barry-shape::after{width:3px;height:100%;left:50%;transform:translateX(-50%)}.barry-shape-1{width:60px;height:60px;top:15%;left:10%;animation:barrySpin 15s linear infinite}.barry-shape-2{width:40px;height:40px;bottom:20%;right:15%;animation:barrySpin 12s linear infinite reverse;opacity:.2}`, html: `<div class="barry-shape barry-shape-1"></div><div class="barry-shape barry-shape-2"></div>` };
  }
}

function generateAnimCSS(anim: string): string {
  const map: Record<string, { from: string; to: string; dur: string }> = {
    fadeUp: { from: "opacity:0;transform:translateY(100px)", to: "opacity:1;transform:translateY(0)", dur: "1s" },
    fadeDown: { from: "opacity:0;transform:translateY(-100px)", to: "opacity:1;transform:translateY(0)", dur: "1s" },
    zoomIn: { from: "opacity:0;transform:scale(0.5)", to: "opacity:1;transform:scale(1)", dur: "0.9s" },
    zoomOut: { from: "opacity:0;transform:scale(1.4)", to: "opacity:1;transform:scale(1)", dur: "0.9s" },
    slideLeft: { from: "opacity:0;transform:translateX(-150px)", to: "opacity:1;transform:translateX(0)", dur: "1s" },
    slideRight: { from: "opacity:0;transform:translateX(150px)", to: "opacity:1;transform:translateX(0)", dur: "1s" },
    rotateIn: { from: "opacity:0;transform:rotate(-15deg) scale(0.7)", to: "opacity:1;transform:rotate(0) scale(1)", dur: "1.1s" },
    flipY: { from: "opacity:0;transform:perspective(600px) rotateY(90deg)", to: "opacity:1;transform:perspective(600px) rotateY(0)", dur: "1s" },
    flipX: { from: "opacity:0;transform:perspective(600px) rotateX(90deg)", to: "opacity:1;transform:perspective(600px) rotateX(0)", dur: "1s" },
    blurIn: { from: "opacity:0;filter:blur(20px);transform:scale(1.1)", to: "opacity:1;filter:blur(0);transform:scale(1)", dur: "1.2s" },
    scaleUp: { from: "opacity:0;transform:scale(0.3)", to: "opacity:1;transform:scale(1)", dur: "0.8s" },
    bounceIn: { from: "opacity:0;transform:translateY(-200px)", to: "opacity:1;transform:translateY(0)", dur: "1s" },
    elasticIn: { from: "opacity:0;transform:scale(0.3) rotate(-10deg)", to: "opacity:1;transform:scale(1) rotate(0)", dur: "1.2s" },
    swingIn: { from: "opacity:0;transform:rotate(-20deg) translateY(100px)", to: "opacity:1;transform:rotate(0) translateY(0)", dur: "1.1s" },
    staggerUp: { from: "opacity:0;transform:translateY(80px)", to: "opacity:1;transform:translateY(0)", dur: "0.9s" },
    waveIn: { from: "opacity:0;transform:translateY(60px) rotate(-3deg)", to: "opacity:1;transform:translateY(0) rotate(0)", dur: "1s" },
    skewIn: { from: "opacity:0;transform:skewX(-20deg) translateX(-80px)", to: "opacity:1;transform:skewX(0) translateX(0)", dur: "1s" },
    cascade: { from: "opacity:0;transform:translateY(120px) rotate(-5deg) scale(0.85)", to: "opacity:1;transform:translateY(0) rotate(0) scale(1)", dur: "1.2s" },
  };
  const a = map[anim] || map.fadeUp;
  let delays = "";
  for (let i = 1; i <= 12; i++) delays += `.barry-anim-card:nth-child(${i}){animation-delay:${(i * 0.06).toFixed(2)}s}\n`;
  return `@keyframes barryCardAnim{from{${a.from}}to{${a.to}}}
.barry-anim-card{opacity:0;animation:barryCardAnim ${a.dur} cubic-bezier(0.16,1,0.3,1) both}
${delays}`;
}

function generateTypo(typo: string): string {
  const ls = typo === "tight" || typo === "brutal" ? "-4px" : typo === "elegant" ? "2px" : typo === "wide" ? "6px" : "-1px";
  const fw = typo === "soft" ? "600" : typo === "elegant" ? "700" : "900";
  const tt = typo === "wide" ? "uppercase" : "none";
  const fs = typo === "elegant" ? "italic" : "normal";
  return `.barry-typo{letter-spacing:${ls};font-weight:${fw};text-transform:${tt};font-style:${fs}}`;
}

export function computeSignature(prompt: string) {
  const seed = hashStr(prompt.toLowerCase().trim());
  return {
    seed,
    palette: generatePalette(seed),
    animStyle: ANIM_STYLES[seed % ANIM_STYLES.length],
    shapeStyle: SHAPE_STYLES[(seed >> 3) % SHAPE_STYLES.length],
    heroLayout: HERO_LAYOUTS[(seed >> 6) % HERO_LAYOUTS.length],
    typoStyle: TYPO_STYLES[(seed >> 9) % TYPO_STYLES.length],
  };
}

export function animateHtml(html: string, assets: AnimateAssets = {}): string {
  if (!html || html.length < 100) return html;

  const seed = hashStr(html.slice(0, 800) + Date.now().toString());
  const palette = generatePalette(seed);
  const animStyle = ANIM_STYLES[seed % ANIM_STYLES.length];
  const shapeStyle = SHAPE_STYLES[(seed >> 3) % SHAPE_STYLES.length];
  const heroLayout = HERO_LAYOUTS[(seed >> 6) % HERO_LAYOUTS.length];
  const typoStyle = TYPO_STYLES[(seed >> 9) % TYPO_STYLES.length];
  const riveUrl = assets.riveUrl || RIVE_ANIMATIONS[(seed >> 12) % RIVE_ANIMATIONS.length];
  const accentColor = assets.accentColor || palette.accent;

  const heroVideo = assets.heroVideoUrl || assets.extraVideos?.[0] || FALLBACK_VIDEOS[seed % FALLBACK_VIDEOS.length];
  const midVideo = assets.extraVideos?.[1] || FALLBACK_VIDEOS[(seed + 1) % FALLBACK_VIDEOS.length];
  const endVideo = assets.extraVideos?.[2] || FALLBACK_VIDEOS[(seed + 2) % FALLBACK_VIDEOS.length];
  const heroImage = assets.heroImageUrl || "";
  const { css: shapeCSS, html: shapeHTML } = generateShapeCSS(shapeStyle, palette);

  console.log(`🎬 Animator | anim=${animStyle} shape=${shapeStyle} layout=${heroLayout} typo=${typoStyle} accent=${palette.accent}`);

  const fullCSS = `<style id="barry-animator">
:root{--barry-bg:${palette.bg};--barry-bg-alt:${palette.bgAlt};--barry-text:${palette.text};--barry-accent:${palette.accent};--barry-accent-text:${palette.accentText};--barry-card:${palette.card};--barry-border:${palette.border}}
body{background:var(--barry-bg)!important;color:var(--barry-text)!important;margin:0;padding:0;overflow-x:hidden}
.barry-progress{position:fixed;top:0;left:0;height:3px;width:0%;background:var(--barry-accent);z-index:99999;transition:width .1s linear;box-shadow:0 0 20px var(--barry-accent)}
.barry-rive-hero{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:600px;height:600px;z-index:3;pointer-events:none;opacity:.85;mix-blend-mode:screen}
.barry-rive-hero canvas{width:100%!important;height:100%!important}
.barry-rive-section{max-width:500px;margin:60px auto;border-radius:24px;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,.4);border:1px solid var(--barry-border)}
.barry-rive-section canvas{width:100%!important;height:400px!important;display:block;background:transparent}
${shapeCSS}
.barry-float-paper{position:absolute;border-radius:16px;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,.5);border:2px solid var(--barry-accent);z-index:3;pointer-events:none;will-change:transform;opacity:.85}
.barry-float-paper img{width:100%;height:100%;object-fit:cover;display:block}
.barry-float-paper-1{width:140px;height:180px;top:20%;left:8%;animation:barryFloat1 12s ease-in-out infinite}
.barry-float-paper-2{width:110px;height:150px;top:60%;left:15%;animation:barryFloat2 15s ease-in-out infinite}
.barry-float-paper-3{width:130px;height:170px;top:15%;right:12%;animation:barryFloat3 14s ease-in-out infinite}
.barry-float-paper-4{width:100px;height:140px;bottom:20%;right:8%;animation:barryFloat4 13s ease-in-out infinite}
/* ⭐ VIDEO SECTIONS PLEIN ÉCRAN */
.barry-video-section{position:relative;height:100vh;width:100vw;overflow:hidden;display:flex;align-items:center;justify-content:center;margin:0;padding:0;left:50%;right:50%;margin-left:-50vw;margin-right:-50vw}
.barry-video-section video{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;filter:brightness(.5) saturate(1.3);z-index:0}
.barry-video-section .barry-vo{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.85) 0%,rgba(0,0,0,.3) 30%,rgba(0,0,0,.3) 70%,rgba(0,0,0,.85) 100%);z-index:1}
.barry-video-section .barry-vc{position:relative;z-index:2;text-align:center;max-width:800px;padding:0 32px;color:#fff}
.barry-video-section .barry-vl{display:inline-block;font-size:11px;font-weight:700;color:var(--barry-accent);letter-spacing:4px;text-transform:uppercase;margin-bottom:20px;padding:8px 20px;border:1px solid var(--barry-accent);border-radius:100px;background:rgba(0,0,0,.5);backdrop-filter:blur(10px)}
.barry-video-section h2{font-size:clamp(36px,5vw,72px);font-weight:900;line-height:1.05;letter-spacing:-2.5px;margin-bottom:20px;text-shadow:0 10px 40px rgba(0,0,0,.9)}
.barry-video-section p{font-size:16px;opacity:.9;max-width:600px;margin:0 auto;text-shadow:0 4px 20px rgba(0,0,0,.9)}
.barry-hero-wrap{position:relative!important;overflow:hidden!important;min-height:100vh;width:100vw}
.barry-hero-video{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;z-index:0;filter:brightness(0.5) saturate(1.3)}
.barry-hero-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.65) 0%,rgba(0,0,0,.25) 50%,rgba(0,0,0,.85) 100%);z-index:1}
.barry-hero-content{position:relative;z-index:5}
${heroLayout === "left" ? ".barry-hero-content{text-align:left!important;padding-left:10%!important}" : ""}
${heroLayout === "split" ? ".barry-hero-content{display:grid!important;grid-template-columns:1fr 1fr!important;gap:40px!important;align-items:center!important}" : ""}
${heroLayout === "diagonal" ? ".barry-hero-content{transform:rotate(-2deg)!important}" : ""}
${generateTypo(typoStyle)}
${generateAnimCSS(animStyle)}
@keyframes barryFloat1{0%{transform:translate(0,0) rotate(-15deg)}25%{transform:translate(20px,-25px) rotate(-8deg)}50%{transform:translate(-15px,-40px) rotate(-18deg)}75%{transform:translate(15px,-20px) rotate(-12deg)}100%{transform:translate(0,0) rotate(-15deg)}}
@keyframes barryFloat2{0%{transform:translate(0,0) rotate(20deg)}25%{transform:translate(-25px,-30px) rotate(12deg)}50%{transform:translate(20px,-45px) rotate(25deg)}75%{transform:translate(-15px,-25px) rotate(18deg)}100%{transform:translate(0,0) rotate(20deg)}}
@keyframes barryFloat3{0%{transform:translate(0,0) rotate(-8deg)}33%{transform:translate(30px,-40px) rotate(-20deg)}66%{transform:translate(-20px,-25px) rotate(5deg)}100%{transform:translate(0,0) rotate(-8deg)}}
@keyframes barryFloat4{0%{transform:translate(0,0) rotate(12deg)}33%{transform:translate(-35px,-50px) rotate(25deg)}66%{transform:translate(25px,-30px) rotate(-5deg)}100%{transform:translate(0,0) rotate(12deg)}}
@keyframes barrySpin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
@keyframes barryPulse{0%,100%{transform:scale(1);opacity:.5}50%{transform:scale(1.3);opacity:.8}}
@keyframes barryWave{0%,100%{transform:translateY(0)}50%{transform:translateY(-30px)}}
@keyframes barryMorph{0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%}50%{border-radius:30% 70% 70% 30%/30% 30% 70% 70%}}
@media(max-width:900px){.barry-rive-hero{width:400px;height:400px;opacity:.5}.barry-float-paper{display:none}.barry-video-section{height:70vh}}
</style>`;

  const fullJS = `<script src="https://unpkg.com/@rive-app/canvas@2.21.6"></script>
<script id="barry-animator-js">
(function(){
  var pb=document.querySelector('.barry-progress');
  if(pb){window.addEventListener('scroll',function(){var d=document.documentElement.scrollHeight-window.innerHeight;var p=d>0?(window.scrollY/d)*100:0;pb.style.width=p+'%';},{passive:true});}
  window.addEventListener('load',function(){try{if(typeof rive==='undefined')return;
    var rh=document.getElementById('barryRiveHero');
    if(rh){var r1=new rive.Rive({src:'${riveUrl}',canvas:rh,autoplay:true,layout:new rive.Layout({fit:rive.Fit.Contain,alignment:rive.Alignment.Center}),onLoad:function(){r1.resizeDrawingSurfaceToCanvas();}});}
    var rs=document.getElementById('barryRiveSection');
    if(rs){var r2=new rive.Rive({src:'${riveUrl}',canvas:rs,autoplay:true,layout:new rive.Layout({fit:rive.Fit.Contain,alignment:rive.Alignment.Center}),onLoad:function(){r2.resizeDrawingSurfaceToCanvas();}});}
    console.log('✅ Rive loaded');
  }catch(e){console.warn('Rive err',e);}});
})();
</script>`;

  let out = html;
  if (out.includes("</head>")) out = out.replace("</head>", fullCSS + fullJS + "\n</head>");
  else out = fullCSS + fullJS + out;

  out = out.replace(/<body([^>]*)>/i, `<body$1>\n<div class="barry-progress"></div>`);

  const heroBlock = `<div class="barry-hero-wrap"><video class="barry-hero-video" autoplay muted loop playsinline preload="auto"><source src="${heroVideo}" type="video/mp4"></video><div class="barry-hero-overlay"></div>${shapeHTML}<canvas id="barryRiveHero" class="barry-rive-hero" width="600" height="600"></canvas>${heroImage ? `<div class="barry-float-paper barry-float-paper-1"><img src="${heroImage}" alt=""/></div><div class="barry-float-paper barry-float-paper-2"><img src="${heroImage}" alt=""/></div><div class="barry-float-paper barry-float-paper-3"><img src="${heroImage}" alt=""/></div><div class="barry-float-paper barry-float-paper-4"><img src="${heroImage}" alt=""/></div>` : ""}<div class="barry-hero-content">`;

  const firstSec = out.match(/<section[^>]*>/i);
  if (firstSec) {
    const st = firstSec[0];
    const si = out.indexOf(st);
    const after = out.slice(si + st.length);
    const ci = after.indexOf("</section>");
    if (ci !== -1) {
      out = out.slice(0, si) + heroBlock + after.slice(0, ci) + "</div></div>" + after.slice(ci + 10);
    }
  }

  let cnt = 0;
  const midBlock = `\n<section class="barry-video-section"><video autoplay muted loop playsinline preload="auto"><source src="${midVideo}" type="video/mp4"></video><div class="barry-vo"></div><div class="barry-vc"><span class="barry-vl">Qualité Premium</span><h2>L'excellence à portée de main</h2><p>Une expérience unique conçue pour vous.</p></div></section>\n<section style="padding:80px 20px;text-align:center;background:var(--barry-bg-alt);"><canvas id="barryRiveSection" class="barry-rive-section" width="500" height="400"></canvas></section>\n`;
  out = out.replace(/<\/section>/g, (m) => { cnt++; return cnt === 2 ? m + midBlock : m; });

  const endBlock = `\n<section class="barry-video-section"><video autoplay muted loop playsinline preload="auto"><source src="${endVideo}" type="video/mp4"></video><div class="barry-vo"></div><div class="barry-vc"><span class="barry-vl">Rejoignez-nous</span><h2>Commandez aujourd'hui</h2><p>Une expérience premium vous attend.</p></div></section>\n`;
  if (out.match(/<footer/i)) out = out.replace(/<footer/i, endBlock + "<footer");

  out = out.replace(/class="card"/g, `class="card barry-anim-card"`);
  out = out.replace(/class="card ([^"]*)"/g, `class="card barry-anim-card $1"`);
  out = out.replace(/class="product"/g, `class="product barry-anim-card"`);
  out = out.replace(/class="product-card"/g, `class="product-card barry-anim-card"`);
  out = out.replace(/class="service"/g, `class="service barry-anim-card"`);

  return out;
}