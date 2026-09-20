// src/lib/universalGenerator.ts
// ⭐ Générateur IA universel : jeux / apps / sites multi-plateforme
// Tactile + Souris + Clavier : Android, iOS, Windows, Mac, Linux

import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { deepseek } from "@ai-sdk/deepseek";
import { groq } from "@ai-sdk/groq";
import { google } from "@ai-sdk/google";
import { mistral } from "@ai-sdk/mistral";
import { cohere } from "@ai-sdk/cohere";
import { xai } from "@ai-sdk/xai";
import { togetherai } from "@ai-sdk/togetherai";
import { generateText } from "ai";

function getModel(provider: string) {
  switch (provider) {
    case "openai": return openai("gpt-4o-mini");
    case "claude": return anthropic("claude-3-5-haiku-20241022");
    case "deepseek": return deepseek("deepseek-chat");
    case "gemini": return google("gemini-2.0-flash-exp");
    case "mistral": return mistral("mistral-large-latest");
    case "cohere": return cohere("command-r-plus");
    case "grok": return xai("grok-beta");
    case "together": return togetherai("meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo");
    case "groq":
    default: return groq("openai/gpt-oss-120b");
  }
}

function extractHtml(text: string): string {
  const match = text.match(/```html\s*\n([\s\S]*?)```/i);
  if (match) return match[1].trim();
  const match2 = text.match(/```\s*\n([\s\S]*?)```/);
  if (match2) return match2[1].trim();
  const idx = text.indexOf("<!DOCTYPE");
  if (idx !== -1) return text.slice(idx).trim();
  const idx2 = text.indexOf("<html");
  if (idx2 !== -1) return text.slice(idx2).trim();
  return text.trim();
}

// ⭐ 100 PALETTES DE COULEURS
const COLOR_PALETTES = [
  { name: "Or Noir", bg: "#0a0a0a", fg: "#f5f5f5", accent: "#d4af37", accent2: "#f59e0b" },
  { name: "Bleu Cyber", bg: "#0a0f1a", fg: "#f0f5ff", accent: "#3b82f6", accent2: "#06b6d4" },
  { name: "Violet Néon", bg: "#0f0a1a", fg: "#f5f0ff", accent: "#a855f7", accent2: "#ec4899" },
  { name: "Vert Matrix", bg: "#051210", fg: "#f0fff8", accent: "#22c55e", accent2: "#10b981" },
  { name: "Rouge Feu", bg: "#140a0a", fg: "#fff0f0", accent: "#ef4444", accent2: "#f97316" },
  { name: "Rose Bonbon", bg: "#1a0a14", fg: "#fff0ff", accent: "#ec4899", accent2: "#f472b6" },
  { name: "Cyan Océan", bg: "#0a1014", fg: "#e6f5ff", accent: "#06b6d4", accent2: "#0891b2" },
  { name: "Orange Sunset", bg: "#14100a", fg: "#fff5e6", accent: "#f97316", accent2: "#fb923c" },
  { name: "Lime Acid", bg: "#0f1a0a", fg: "#f5fff0", accent: "#84cc16", accent2: "#a3e635" },
  { name: "Indigo Profond", bg: "#0a0a1a", fg: "#f0f0ff", accent: "#6366f1", accent2: "#8b5cf6" },
  { name: "Turquoise", bg: "#051418", fg: "#f0ffff", accent: "#14b8a6", accent2: "#2dd4bf" },
  { name: "Magenta Pop", bg: "#1a0a1a", fg: "#fff0ff", accent: "#d946ef", accent2: "#e879f9" },
  { name: "Ambre", bg: "#1a1005", fg: "#fff5e0", accent: "#f59e0b", accent2: "#fbbf24" },
  { name: "Bleu Nuit", bg: "#050a14", fg: "#f0f5ff", accent: "#1e40af", accent2: "#3b82f6" },
  { name: "Vert Sauge", bg: "#0a0f0a", fg: "#f5faf5", accent: "#84cc16", accent2: "#65a30d" },
  { name: "Bordeaux", bg: "#140508", fg: "#fff0f0", accent: "#be123c", accent2: "#e11d48" },
  { name: "Sarcelle", bg: "#051015", fg: "#f0ffff", accent: "#0d9488", accent2: "#14b8a6" },
  { name: "Lavande", bg: "#0f0a1a", fg: "#f5f0ff", accent: "#c4b5fd", accent2: "#a78bfa" },
  { name: "Citron", bg: "#14140a", fg: "#fffff0", accent: "#facc15", accent2: "#fde047" },
  { name: "Corail", bg: "#140a08", fg: "#fff5f0", accent: "#fb7185", accent2: "#f87171" },
  { name: "Saphir", bg: "#050a1a", fg: "#f0f5ff", accent: "#2563eb", accent2: "#1d4ed8" },
  { name: "Émeraude", bg: "#05140a", fg: "#f0fff5", accent: "#059669", accent2: "#10b981" },
  { name: "Rubis", bg: "#14050a", fg: "#fff0f5", accent: "#dc2626", accent2: "#ef4444" },
  { name: "Topaze", bg: "#14100a", fg: "#fffaf0", accent: "#ea580c", accent2: "#f97316" },
  { name: "Améthyste", bg: "#0a0514", fg: "#f5f0ff", accent: "#7c3aed", accent2: "#a855f7" },
  { name: "Jade", bg: "#0a1410", fg: "#f0fff8", accent: "#10b981", accent2: "#34d399" },
  { name: "Cristal", bg: "#f0f5ff", fg: "#0a0f1a", accent: "#3b82f6", accent2: "#2563eb" },
  { name: "Aurore", bg: "#f5f0ff", fg: "#1a0a2e", accent: "#a855f7", accent2: "#c084fc" },
  { name: "Menthe", bg: "#f0fff8", fg: "#0a2a1a", accent: "#10b981", accent2: "#34d399" },
  { name: "Pêche", bg: "#fff5f0", fg: "#2a1408", accent: "#fb923c", accent2: "#f97316" },
  { name: "Ciel", bg: "#f0f8ff", fg: "#0a1a2a", accent: "#0ea5e9", accent2: "#0284c7" },
  { name: "Cerise", bg: "#fff0f5", fg: "#3a0a1f", accent: "#e11d48", accent2: "#f43f5e" },
  { name: "Miel", bg: "#fffaf0", fg: "#3a1f0a", accent: "#d97706", accent2: "#f59e0b" },
  { name: "Lilas", bg: "#faf0ff", fg: "#2a0a3a", accent: "#9333ea", accent2: "#a855f7" },
  { name: "Olive", bg: "#faf5e6", fg: "#2a1f0a", accent: "#84cc16", accent2: "#65a30d" },
  { name: "Corail Clair", bg: "#fff0f0", fg: "#3a0a0a", accent: "#f87171", accent2: "#ef4444" },
  { name: "Aqua", bg: "#f0ffff", fg: "#0a2a2a", accent: "#06b6d4", accent2: "#0891b2" },
  { name: "Indigo Clair", bg: "#f0f0ff", fg: "#0a0a3a", accent: "#6366f1", accent2: "#818cf8" },
  { name: "Bronze", bg: "#1a0f05", fg: "#fff0e0", accent: "#b45309", accent2: "#d97706" },
  { name: "Platine", bg: "#f5f5f5", fg: "#0a0a0a", accent: "#525252", accent2: "#737373" },
  { name: "Noir Pur", bg: "#000000", fg: "#ffffff", accent: "#ffffff", accent2: "#a3a3a3" },
  { name: "Blanc Pur", bg: "#ffffff", fg: "#000000", accent: "#000000", accent2: "#525252" },
  { name: "Rouge Imperial", bg: "#1a0000", fg: "#fff5f5", accent: "#dc2626", accent2: "#b91c1c" },
  { name: "Bleu Royal", bg: "#00081a", fg: "#f0f5ff", accent: "#1e40af", accent2: "#1e3a8a" },
  { name: "Vert Imperial", bg: "#001a0a", fg: "#f0fff5", accent: "#15803d", accent2: "#166534" },
  { name: "Pourpre", bg: "#1a0010", fg: "#fff0f8", accent: "#a21caf", accent2: "#86198f" },
  { name: "Safran", bg: "#1a1005", fg: "#fffaf0", accent: "#ea580c", accent2: "#c2410c" },
  { name: "Turquoise Vif", bg: "#001a1a", fg: "#f0ffff", accent: "#0d9488", accent2: "#0f766e" },
  { name: "Cyan Néon", bg: "#00141a", fg: "#f0fcff", accent: "#22d3ee", accent2: "#06b6d4" },
  { name: "Rose Vif", bg: "#1a0010", fg: "#fff0f8", accent: "#f472b6", accent2: "#ec4899" },
  { name: "Papaye", bg: "#1a0a05", fg: "#fff5f0", accent: "#fb923c", accent2: "#f97316" },
  { name: "Anis", bg: "#0f1405", fg: "#f5fff0", accent: "#a3e635", accent2: "#84cc16" },
  { name: "Prune", bg: "#14051a", fg: "#faf0ff", accent: "#7e22ce", accent2: "#9333ea" },
  { name: "Azur", bg: "#05141a", fg: "#f0faff", accent: "#0ea5e9", accent2: "#0284c7" },
  { name: "Grenat", bg: "#140508", fg: "#fff0f5", accent: "#991b1b", accent2: "#7f1d1d" },
  { name: "Turquoise Profond", bg: "#051418", fg: "#f0fffe", accent: "#0f766e", accent2: "#115e59" },
  { name: "Cuivre", bg: "#1a0d05", fg: "#fff5f0", accent: "#c2410c", accent2: "#9a3412" },
  { name: "Rose Poudré", bg: "#fff5f8", fg: "#3a0a1a", accent: "#f9a8d4", accent2: "#f472b6" },
  { name: "Bleu Pastel", bg: "#f0f5ff", fg: "#0a1a3a", accent: "#93c5fd", accent2: "#60a5fa" },
  { name: "Vert Pastel", bg: "#f0fff5", fg: "#0a2a1a", accent: "#86efac", accent2: "#4ade80" },
  { name: "Jaune Pâle", bg: "#fffff0", fg: "#2a2a0a", accent: "#fde047", accent2: "#facc15" },
  { name: "Violet Pastel", bg: "#faf5ff", fg: "#2a0a3a", accent: "#c4b5fd", accent2: "#a78bfa" },
  { name: "Orange Pastel", bg: "#fff8f0", fg: "#3a1a0a", accent: "#fdba74", accent2: "#fb923c" },
  { name: "Rouge Brique", bg: "#1a0a05", fg: "#fff5f0", accent: "#b91c1c", accent2: "#991b1b" },
  { name: "Forêt", bg: "#05120a", fg: "#f0fff5", accent: "#166534", accent2: "#15803d" },
  { name: "Sable", bg: "#faf5e6", fg: "#3a2a0a", accent: "#a16207", accent2: "#854d0e" },
  { name: "Terre Cuite", bg: "#1a0d08", fg: "#fff5f0", accent: "#a16207", accent2: "#ca8a04" },
  { name: "Ocre", bg: "#faf0d0", fg: "#3a2505", accent: "#ca8a04", accent2: "#a16207" },
  { name: "Bleu Marine", bg: "#050a14", fg: "#f0f5ff", accent: "#1e3a8a", accent2: "#1e40af" },
  { name: "Écarlate", bg: "#14050a", fg: "#fff0f5", accent: "#dc2626", accent2: "#b91c1c" },
  { name: "Malachite", bg: "#05140a", fg: "#f0fff5", accent: "#15803d", accent2: "#166534" },
  { name: "Ivoire", bg: "#fffff5", fg: "#2a2a0a", accent: "#a16207", accent2: "#854d0e" },
  { name: "Cendre", bg: "#1a1a1a", fg: "#f5f5f5", accent: "#737373", accent2: "#a3a3a3" },
  { name: "Bitume", bg: "#141414", fg: "#f0f0f0", accent: "#525252", accent2: "#404040" },
  { name: "Ardoise", bg: "#1e293b", fg: "#f1f5f9", accent: "#64748b", accent2: "#94a3b8" },
  { name: "Glace", bg: "#f1f5f9", fg: "#0f172a", accent: "#0ea5e9", accent2: "#0284c7" },
  { name: "Automne", bg: "#1a0f05", fg: "#fff0e0", accent: "#d97706", accent2: "#b45309" },
  { name: "Printemps", bg: "#f0fff5", fg: "#0a2a1a", accent: "#22c55e", accent2: "#16a34a" },
  { name: "Été", bg: "#fffff0", fg: "#2a1a05", accent: "#f97316", accent2: "#ea580c" },
  { name: "Hiver", bg: "#f0f8ff", fg: "#0a1a3a", accent: "#3b82f6", accent2: "#2563eb" },
  { name: "Flamme", bg: "#1a0500", fg: "#fff0e0", accent: "#ef4444", accent2: "#dc2626" },
  { name: "Océan", bg: "#001428", fg: "#f0faff", accent: "#0284c7", accent2: "#0369a1" },
  { name: "Coucher Soleil", bg: "#1a0a14", fg: "#fff0f8", accent: "#f97316", accent2: "#ec4899" },
  { name: "Aube", bg: "#1a0f1a", fg: "#fff0ff", accent: "#c084fc", accent2: "#f472b6" },
  { name: "Crépuscule", bg: "#0f0520", fg: "#f0e8ff", accent: "#8b5cf6", accent2: "#a78bfa" },
  { name: "Minuit", bg: "#000010", fg: "#e8f0ff", accent: "#3b82f6", accent2: "#6366f1" },
  { name: "Néon", bg: "#0a0014", fg: "#f0f0ff", accent: "#d946ef", accent2: "#e879f9" },
  { name: "Rétro", bg: "#1a1005", fg: "#fff5e0", accent: "#f59e0b", accent2: "#d97706" },
  { name: "Vintage", bg: "#1a1405", fg: "#fff8e0", accent: "#a16207", accent2: "#854d0e" },
  { name: "Moderne", bg: "#0a0a0a", fg: "#fafafa", accent: "#22c55e", accent2: "#16a34a" },
  { name: "Cyberpunk", bg: "#0a0014", fg: "#f0f0ff", accent: "#facc15", accent2: "#eab308" },
  { name: "Steampunk", bg: "#1a0f05", fg: "#f5e6d0", accent: "#b45309", accent2: "#92400e" },
  { name: "Art Déco", bg: "#0a0a14", fg: "#f5f0e0", accent: "#d4af37", accent2: "#b8941f" },
  { name: "Minimaliste", bg: "#ffffff", fg: "#171717", accent: "#171717", accent2: "#404040" },
  { name: "Brutaliste", bg: "#f5f5f5", fg: "#000000", accent: "#000000", accent2: "#1a1a1a" },
  { name: "Futuriste", bg: "#001a28", fg: "#e0f8ff", accent: "#06b6d4", accent2: "#0891b2" },
  { name: "Cosmique", bg: "#0a001a", fg: "#f0e0ff", accent: "#a855f7", accent2: "#c084fc" },
  { name: "Bohème", bg: "#1a1005", fg: "#fff0d0", accent: "#c2410c", accent2: "#9a3412" },
  { name: "Rustique", bg: "#1a0f05", fg: "#fff0e0", accent: "#92400e", accent2: "#78350f" },
  { name: "Nordique", bg: "#f0f5f8", fg: "#0a1a2a", accent: "#0ea5e9", accent2: "#0284c7" },
  { name: "Japandi", bg: "#f5f0e8", fg: "#2a201a", accent: "#84cc16", accent2: "#65a30d" },
];

function pickPalette(seed: string): any {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return COLOR_PALETTES[Math.abs(h) % COLOR_PALETTES.length];
}

// ═══════════════════════════════════════════════════════════════
// 🎮 JEU — CONTRÔLABLE sur TOUS les systèmes
// ═══════════════════════════════════════════════════════════════
export async function generateGameHTML(
  categoryName: string,
  categoryPrompt: string,
  userPrompt: string,
  provider: string = "groq"
): Promise<string> {
  const palette = pickPalette(categoryName + userPrompt);
  console.log(`🎮 Génération jeu: ${categoryName} | IA: ${provider} | Palette: ${palette.name}`);

  const system = `Tu es un développeur de jeux web expert. Tu crées UNIQUEMENT des jeux HTML/CSS/JS COMPLETS et 100% CONTRÔLABLES sur TOUS les systèmes (Android, iOS, Windows, Mac, Linux).

⚠️⚠️⚠️ RÈGLES ABSOLUES SUR LES CONTRÔLES (sinon le jeu est REJETÉ) :

Le jeu DOIT être contrôlable par :
- **TACTILE** (mobile Android/iOS) : touchstart, touchmove, touchend
- **SOURIS** (Windows/Mac/Linux) : mousemove, mousedown, mouseup, click
- **CLAVIER** (tous) : keydown, keyup

1. **FONCTION UNIVERSELLE DE MOUVEMENT** — pour éviter de dupliquer le code, crée des fonctions que TOUS les inputs appellent :
\`\`\`js
// Définis ces fonctions AVANT les event listeners
function moveLeft() { /* ex: playerX -= 5; */ }
function moveRight() { /* ex: playerX += 5; */ }
function moveUp() { /* ex: playerY -= 5; */ }
function moveDown() { /* ex: playerY += 5; */ }
function actionBtn() { /* ex: jump() ou shoot() */ }
\`\`\`

2. **CLAVIER** :
\`\`\`js
document.addEventListener('keydown', function(e) {
  if (e.key === 'ArrowLeft' || e.key === 'q' || e.key === 'Q') { moveLeft(); e.preventDefault(); }
  if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') { moveRight(); e.preventDefault(); }
  if (e.key === 'ArrowUp' || e.key === 'z' || e.key === 'Z') { moveUp(); e.preventDefault(); }
  if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') { moveDown(); e.preventDefault(); }
  if (e.key === ' ') { actionBtn(); e.preventDefault(); }
});
\`\`\`

3. **SOURIS** (desktop) :
\`\`\`js
var mouseX = 0, mouseY = 0;
canvas.addEventListener('mousemove', function(e) {
  var rect = canvas.getBoundingClientRect();
  mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
  mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);
  // Pour jeux de poursuite : onMouseMove(mouseX, mouseY)
});
canvas.addEventListener('mousedown', function(e) {
  var rect = canvas.getBoundingClientRect();
  var x = (e.clientX - rect.left) * (canvas.width / rect.width);
  var y = (e.clientY - rect.top) * (canvas.height / rect.height);
  onMouseDown(x, y);
});
canvas.addEventListener('mouseup', function(e) {
  onMouseUp();
});
\`\`\`

4. **TACTILE** (mobile) :
\`\`\`js
canvas.addEventListener('touchstart', function(e) {
  e.preventDefault();
  var touch = e.touches[0];
  var rect = canvas.getBoundingClientRect();
  var x = (touch.clientX - rect.left) * (canvas.width / rect.width);
  var y = (touch.clientY - rect.top) * (canvas.height / rect.height);
  onTouchStart(x, y);
}, { passive: false });

canvas.addEventListener('touchmove', function(e) {
  e.preventDefault();
  var touch = e.touches[0];
  var rect = canvas.getBoundingClientRect();
  var x = (touch.clientX - rect.left) * (canvas.width / rect.width);
  var y = (touch.clientY - rect.top) * (canvas.height / rect.height);
  onTouchMove(x, y);
}, { passive: false });

canvas.addEventListener('touchend', function(e) {
  e.preventDefault();
  onTouchEnd();
}, { passive: false });
\`\`\`

5. **SWIPE DÉTECTION** (pour Snake, Tetris, 2048 — jeux directionnels) :
\`\`\`js
var swipeStartX = 0, swipeStartY = 0;
canvas.addEventListener('touchstart', function(e) {
  swipeStartX = e.touches[0].clientX;
  swipeStartY = e.touches[0].clientY;
}, { passive: true });
canvas.addEventListener('touchend', function(e) {
  var dx = e.changedTouches[0].clientX - swipeStartX;
  var dy = e.changedTouches[0].clientY - swipeStartY;
  if (Math.abs(dx) < 25 && Math.abs(dy) < 25) return;
  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0) moveRight(); else moveLeft();
  } else {
    if (dy > 0) moveDown(); else moveUp();
  }
}, { passive: true });
// ÉQUIVALENT SOURIS :
var mouseDown = false;
canvas.addEventListener('mousedown', function(e) { mouseDown = true; swipeStartX = e.clientX; swipeStartY = e.clientY; });
canvas.addEventListener('mouseup', function(e) {
  if (!mouseDown) return;
  mouseDown = false;
  var dx = e.clientX - swipeStartX;
  var dy = e.clientY - swipeStartY;
  if (Math.abs(dx) < 25 && Math.abs(dy) < 25) return;
  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0) moveRight(); else moveLeft();
  } else {
    if (dy > 0) moveDown(); else moveUp();
  }
});
\`\`\`

6. **BOUTONS MOBILES VISIBLES** sous le canvas (OBLIGATOIRE) :
\`\`\`html
<div id="controls" style="display:flex;gap:12px;margin-top:20px;justify-content:center;flex-wrap:wrap">
  <button ontouchstart="moveLeft();event.preventDefault()" onclick="moveLeft()" style="width:70px;height:70px;font-size:28px;background:${palette.accent};color:#000;border-radius:16px;border:none;font-weight:bold;touch-action:manipulation;cursor:pointer">←</button>
  <button ontouchstart="actionBtn();event.preventDefault()" onclick="actionBtn()" style="width:70px;height:70px;font-size:28px;background:${palette.accent};color:#000;border-radius:16px;border:none;font-weight:bold;touch-action:manipulation;cursor:pointer">▲</button>
  <button ontouchstart="moveRight();event.preventDefault()" onclick="moveRight()" style="width:70px;height:70px;font-size:28px;background:${palette.accent};color:#000;border-radius:16px;border:none;font-weight:bold;touch-action:manipulation;cursor:pointer">→</button>
</div>
\`\`\`
⚠️ CHAQUE bouton DOIT avoir \`ontouchstart\` ET \`onclick\` (mobile + desktop)

7. **CSS UNIVERSEL** (dans <style>) :
\`\`\`css
* { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }
body { 
  font-family: system-ui, -apple-system, Inter, sans-serif;
  background: ${palette.bg}; 
  color: ${palette.fg};
  margin: 0; padding: 20px;
  min-height: 100vh;
  display: flex; flex-direction: column; align-items: center;
  touch-action: manipulation;
  overscroll-behavior: none;
  user-select: none;
  -webkit-user-select: none;
}
canvas { 
  touch-action: none; 
  display: block; 
  max-width: 100%; 
  height: auto;
  border-radius: 12px;
  border: 2px solid ${palette.accent};
  background: #000;
}
button { 
  touch-action: manipulation; 
  cursor: pointer;
  font-family: inherit;
  transition: transform 0.15s;
}
button:active { transform: scale(0.95); }
\`\`\`

8. **GAME LOOP** :
\`\`\`js
var score = 0, level = 1, gameOver = false;
function update() { if (gameOver) return; /* logique de jeu */ }
function draw() { /* dessin canvas */ }
function loop() {
  update();
  draw();
  if (!gameOver) requestAnimationFrame(loop);
}
loop();
\`\`\`

9. **GAME OVER + RESET** :
\`\`\`js
function reset() {
  score = 0; level = 1; gameOver = false;
  // reset positions
  document.getElementById('score').textContent = '0';
  document.getElementById('level').textContent = '1';
  document.getElementById('overlay').style.display = 'none';
  loop();
}
\`\`\`

🎨 DESIGN :
- Background : ${palette.bg}
- Texte : ${palette.fg}
- Couleur principale : ${palette.accent}
- Couleur secondaire : ${palette.accent2}

🎯 STRUCTURE HTML OBLIGATOIRE :
\`\`\`html
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<title>Nom du Jeu</title>
<style>/* CSS universel ici */</style>
</head>
<body>
<h1>Nom du Jeu</h1>
<div style="display:flex;gap:24px;margin-bottom:16px">
  <span>Score : <strong id="score">0</strong></span>
  <span>Niveau : <strong id="level">1</strong></span>
</div>
<canvas id="game" width="500" height="500"></canvas>
<div id="controls">...</div>
<div id="overlay" style="position:fixed;inset:0;display:none;background:rgba(0,0,0,0.9);align-items:center;justify-content:center;flex-direction:column;z-index:100">
  <h2 style="font-size:32px;margin-bottom:12px">Game Over</h2>
  <p style="margin-bottom:20px">Score final : <strong id="finalScore">0</strong></p>
  <button onclick="reset()" ontouchstart="reset();event.preventDefault()" style="padding:16px 40px;background:${palette.accent};color:#000;border-radius:12px;font-weight:bold;font-size:18px;border:none;touch-action:manipulation;cursor:pointer">Rejouer</button>
</div>
<script>/* JS du jeu ici */</script>
</body>
</html>
\`\`\`

TYPE DE JEU : ${categoryName}
DESCRIPTION : ${categoryPrompt}

Réponds UNIQUEMENT avec le code HTML complet entre \`\`\`html et \`\`\`. AUCUN texte avant ou après.`;

  const prompt = `Crée ce jeu : ${userPrompt}

⚠️ RAPPEL : Le jeu DOIT être contrôlable par TACTILE (mobile), SOURIS (desktop), et CLAVIER (tous). Les 4 fonctions moveLeft/moveRight/moveUp/moveDown/actionBtn doivent EXISTER et être appelées par les 3 systèmes.`;

  const { text } = await generateText({
    model: getModel(provider),
    system,
    prompt,
    maxTokens: 8000,
  });

  return extractHtml(text);
}

// ═══════════════════════════════════════════════════════════════
// 📱 APP — AVEC animation légère
// ═══════════════════════════════════════════════════════════════
export async function generateAppHTML(
  categoryName: string,
  categoryPrompt: string,
  userPrompt: string,
  provider: string = "groq"
): Promise<string> {
  const palette = pickPalette(categoryName + userPrompt + "app");
  console.log(`📱 Génération app: ${categoryName} | IA: ${provider} | Palette: ${palette.name}`);

  const system = `Tu es un développeur web expert. Tu crées des APPS WEB COMPLÈTES et FONCTIONNELLES pour Android, iOS, Windows, Mac, Linux.

⚠️ RÈGLES ABSOLUES :
1. Un SEUL fichier HTML avec tout dedans
2. L'app DOIT être UTILISABLE immédiatement (tous les boutons fonctionnels)
3. Sauvegarde automatique dans localStorage quand pertinent
4. Pas de bibliothèques externes
5. Tous les boutons ont \`onclick\` ET \`ontouchstart\` (mobile + desktop)

🎨 DESIGN :
- Background : ${palette.bg}
- Texte : ${palette.fg}
- Couleur principale : ${palette.accent}
- Couleur secondaire : ${palette.accent2}
- Polices : system-ui, -apple-system, Inter
- Animations légères : fadeIn, slideUp, hover
- Responsive mobile-first
- Touch-friendly (boutons minimum 44px de hauteur)

🎯 STRUCTURE :
- Interface claire et intuitive
- Feedback visuel sur les actions
- localStorage si pertinent
- Minimum 250 lignes

TYPE D'APP : ${categoryName}
DESCRIPTION : ${categoryPrompt}

Réponds UNIQUEMENT avec le code HTML complet entre \`\`\`html et \`\`\`. AUCUN texte avant ou après.`;

  const prompt = `Crée cette app : ${userPrompt}`;

  const { text } = await generateText({
    model: getModel(provider),
    system,
    prompt,
    maxTokens: 8000,
  });

  return extractHtml(text);
}

// ═══════════════════════════════════════════════════════════════
// 🌐 SITE — AVEC animation complète
// ═══════════════════════════════════════════════════════════════
export async function generateSiteHTML(
  categoryName: string,
  categoryPrompt: string,
  sections: string[],
  userPrompt: string,
  provider: string = "groq"
): Promise<string> {
  const palette = pickPalette(categoryName + userPrompt + "site");
  console.log(`🌐 Génération site: ${categoryName} | IA: ${provider} | Palette: ${palette.name}`);

  const system = `Tu es un développeur web expert. Tu crées des SITES WEB COMPLETS pour Android, iOS, Windows, Mac, Linux.

⚠️ RÈGLES ABSOLUES :
1. Un SEUL fichier HTML avec tout dedans
2. Structure COMPLÈTE : header sticky + hero + sections + footer
3. Design MODERNE et PROFESSIONNEL
4. Sections : ${sections.join(", ")}
5. Textes RÉELS en français (PAS de Lorem Ipsum)
6. Images : https://image.pollinations.ai/prompt/[description en anglais]?width=800&height=600&nologo=true&model=flux
7. CSS custom (pas de Tailwind CDN)
8. Responsive mobile-first
9. Minimum 400 lignes

🎨 DESIGN :
- Background : ${palette.bg}
- Texte : ${palette.fg}
- Couleur principale : ${palette.accent}
- Couleur secondaire : ${palette.accent2}
- Google Fonts (Inter, Poppins, ou Playfair Display)
- Animations CSS : fadeIn scroll, hover, transitions douces

STRUCTURE :
1. <header> sticky : logo + navigation (menu burger sur mobile)
2. <section hero> : titre + sous-titre + CTA + image
3. Sections : ${sections.join(" | ")}
4. <footer> : liens, mentions légales, réseaux sociaux

TYPE DE SITE : ${categoryName}
DESCRIPTION : ${categoryPrompt}

Réponds UNIQUEMENT avec le code HTML complet entre \`\`\`html et \`\`\`. AUCUNE explication.`;

  const prompt = `Crée ce site : ${userPrompt}`;

  const { text } = await generateText({
    model: getModel(provider),
    system,
    prompt,
    maxTokens: 8000,
  });

  return extractHtml(text);
}