// src/lib/gameTemplates.ts
// ⭐ 20 JEUX 100% JOUABLES ET CONTRÔLABLES

// ⭐ AJOUT : 20 palettes pour varier les couleurs
const PALETTES = [
  { accent: "#d4af37", accent2: "#f59e0b" },
  { accent: "#3b82f6", accent2: "#06b6d4" },
  { accent: "#a855f7", accent2: "#ec4899" },
  { accent: "#22c55e", accent2: "#10b981" },
  { accent: "#ef4444", accent2: "#f97316" },
  { accent: "#ec4899", accent2: "#f472b6" },
  { accent: "#06b6d4", accent2: "#0891b2" },
  { accent: "#f97316", accent2: "#fb923c" },
  { accent: "#84cc16", accent2: "#a3e635" },
  { accent: "#6366f1", accent2: "#8b5cf6" },
  { accent: "#14b8a6", accent2: "#2dd4bf" },
  { accent: "#d946ef", accent2: "#e879f9" },
  { accent: "#f59e0b", accent2: "#fbbf24" },
  { accent: "#2563eb", accent2: "#1d4ed8" },
  { accent: "#059669", accent2: "#10b981" },
  { accent: "#dc2626", accent2: "#ef4444" },
  { accent: "#7c3aed", accent2: "#a855f7" },
  { accent: "#0ea5e9", accent2: "#0284c7" },
  { accent: "#fb7185", accent2: "#f87171" },
  { accent: "#10b981", accent2: "#34d399" },
];

// ⭐ AJOUT : fonction qui choisit une palette selon un ID
function pickPalette(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return PALETTES[Math.abs(h) % PALETTES.length];
}

// ⭐ MODIFIÉ : CSS devient une fonction qui prend la palette
function getCSS(pal: { accent: string; accent2: string }): string {
  return `
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent}
html,body{height:100%}
body{font-family:system-ui,-apple-system,Inter,sans-serif;background:#0a0a0a;color:#f5f5f5;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;padding:16px;overflow-x:hidden;user-select:none;-webkit-user-select:none;touch-action:manipulation}
h1{font-size:clamp(24px,4vw,36px);font-weight:900;letter-spacing:-1px;margin-bottom:8px;text-align:center}
h1 span{background:linear-gradient(135deg,${pal.accent},${pal.accent2});-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.stats{display:flex;gap:24px;margin-bottom:16px;font-size:14px;opacity:.8;flex-wrap:wrap;justify-content:center}
.stats strong{color:${pal.accent};font-weight:900}
canvas{border:2px solid ${pal.accent};border-radius:12px;background:#000;display:block;max-width:100%;height:auto;touch-action:none}
.controls{display:flex;gap:12px;margin-top:16px;justify-content:center;flex-wrap:wrap}
.controls button{width:64px;height:64px;font-size:24px;font-weight:900;background:${pal.accent};color:#000;border:none;border-radius:14px;cursor:pointer;touch-action:manipulation;transition:transform .1s}
.controls button:active{transform:scale(.92)}
.overlay{position:fixed;inset:0;display:none;background:rgba(0,0,0,.92);align-items:center;justify-content:center;flex-direction:column;z-index:100;padding:20px}
.overlay.show{display:flex}
.overlay h2{font-size:36px;font-weight:900;color:${pal.accent};margin-bottom:12px;text-align:center}
.overlay p{margin-bottom:20px;opacity:.8;font-size:16px}
.overlay button{padding:16px 40px;background:${pal.accent};color:#000;border:none;border-radius:12px;font-weight:900;font-size:18px;cursor:pointer;touch-action:manipulation}
`;
}

// ⭐ MODIFIÉ : wrap() prend un gameId
function wrap(title: string, body: string, script: string, gameId: string): string {
  const pal = pickPalette(gameId);
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"><title>${title}</title><style>${getCSS(pal)}</style></head><body>${body}<script>${script}</script></body></html>`;
}

// ═══ 1. SNAKE ═══
function snake(): string {
  return wrap("Snake", `
<h1>🐍 <span>Snake</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Record : <strong id="best">0</strong></span></div>
<canvas id="game" width="400" height="400"></canvas>
<div class="controls">
<button ontouchstart="move('left');event.preventDefault()" onclick="move('left')">←</button>
<button ontouchstart="move('up');event.preventDefault()" onclick="move('up')">↑</button>
<button ontouchstart="move('down');event.preventDefault()" onclick="move('down')">↓</button>
<button ontouchstart="move('right');event.preventDefault()" onclick="move('right')">→</button>
</div>
<div class="overlay" id="overlay"><h2>Game Over</h2><p>Score : <strong id="finalScore">0</strong></p><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var c=document.getElementById('game'),x=c.getContext('2d'),G=20,T=c.width/G;
var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';
var sn,dir,nd,food,score,over,loop;
try{document.getElementById('best').textContent=localStorage.getItem('snk_b')||'0';}catch(e){}
function init(){sn=[{x:10,y:10},{x:9,y:10},{x:8,y:10}];dir={x:1,y:0};nd={x:1,y:0};score=0;over=false;document.getElementById('score').textContent='0';spawn();document.getElementById('overlay').classList.remove('show');}
function spawn(){while(1){food={x:Math.floor(Math.random()*G),y:Math.floor(Math.random()*G)};if(!sn.some(function(s){return s.x===food.x&&s.y===food.y;}))return;}}
function move(n){if(over)return;if(n==='left'&&dir.x!==1)nd={x:-1,y:0};if(n==='right'&&dir.x!==-1)nd={x:1,y:0};if(n==='up'&&dir.y!==1)nd={x:0,y:-1};if(n==='down'&&dir.y!==-1)nd={x:0,y:1};}
window.move=move;
function upd(){if(over)return;dir=nd;var h={x:sn[0].x+dir.x,y:sn[0].y+dir.y};if(h.x<0||h.x>=G||h.y<0||h.y>=G)return die();if(sn.some(function(s){return s.x===h.x&&s.y===h.y;}))return die();sn.unshift(h);if(h.x===food.x&&h.y===food.y){score+=10;document.getElementById('score').textContent=score;spawn();}else{sn.pop();}}
function die(){over=true;document.getElementById('finalScore').textContent=score;document.getElementById('overlay').classList.add('show');try{var b=parseInt(localStorage.getItem('snk_b')||'0');if(score>b){localStorage.setItem('snk_b',score);document.getElementById('best').textContent=score;}}catch(e){}}
function draw(){var headColor=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';x.fillStyle='#000';x.fillRect(0,0,c.width,c.height);x.fillStyle='#ef4444';x.fillRect(food.x*T+2,food.y*T+2,T-4,T-4);for(var i=0;i<sn.length;i++){x.fillStyle=i===0?headColor:'#a16207';x.fillRect(sn[i].x*T+1,sn[i].y*T+1,T-2,T-2);}}
function tick(){upd();draw();}
function reset(){init();if(loop)clearInterval(loop);loop=setInterval(tick,110);}
window.reset=reset;
document.addEventListener('keydown',function(e){var k=e.key;if(k==='ArrowLeft'||k==='q'||k==='Q'||k==='a'||k==='A'){move('left');e.preventDefault();}if(k==='ArrowRight'||k==='d'||k==='D'){move('right');e.preventDefault();}if(k==='ArrowUp'||k==='z'||k==='Z'||k==='w'||k==='W'){move('up');e.preventDefault();}if(k==='ArrowDown'||k==='s'||k==='S'){move('down');e.preventDefault();}});
var tsx=0,tsy=0;
c.addEventListener('touchstart',function(e){e.preventDefault();tsx=e.touches[0].clientX;tsy=e.touches[0].clientY;},{passive:false});
c.addEventListener('touchend',function(e){e.preventDefault();var dx=e.changedTouches[0].clientX-tsx,dy=e.changedTouches[0].clientY-tsy;if(Math.abs(dx)<20&&Math.abs(dy)<20)return;if(Math.abs(dx)>Math.abs(dy))move(dx>0?'right':'left');else move(dy>0?'down':'up');},{passive:false});
var mD=false;
c.addEventListener('mousedown',function(e){mD=true;tsx=e.clientX;tsy=e.clientY;});
c.addEventListener('mouseup',function(e){if(!mD)return;mD=false;var dx=e.clientX-tsx,dy=e.clientY-tsy;if(Math.abs(dx)<20&&Math.abs(dy)<20)return;if(Math.abs(dx)>Math.abs(dy))move(dx>0?'right':'left');else move(dy>0?'down':'up');});
reset();
`, "snake");
}

// ═══ 2. 2048 ═══
function g2048(): string {
  return wrap("2048", `
<h1>🔢 <span>2048</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Record : <strong id="best">0</strong></span></div>
<div id="board" style="width:min(400px,90vw);aspect-ratio:1;background:#1a1a1a;border:2px solid var(--card-border);border-radius:12px;padding:8px;display:grid;grid-template-columns:repeat(4,1fr);gap:8px;touch-action:none"></div>
<div class="controls">
<button ontouchstart="move('left');event.preventDefault()" onclick="move('left')">←</button>
<button ontouchstart="move('up');event.preventDefault()" onclick="move('up')">↑</button>
<button ontouchstart="move('down');event.preventDefault()" onclick="move('down')">↓</button>
<button ontouchstart="move('right');event.preventDefault()" onclick="move('right')">→</button>
</div>
<div class="overlay" id="overlay"><h2>Game Over</h2><p>Score : <strong id="finalScore">0</strong></p><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var grid,score,over;
var CO={2:'#eee4da',4:'#ede0c8',8:'#f2b179',16:'#f59563',32:'#f67c5f',64:'#f65e3b',128:'#edcf72',256:'#edcc61',512:'#edc850',1024:'#edc53f',2048:'#edc22e'};
var TX={2:'#776e65',4:'#776e65',8:'#fff',16:'#fff',32:'#fff',64:'#fff',128:'#fff',256:'#fff',512:'#fff',1024:'#fff',2048:'#fff'};
try{document.getElementById('best').textContent=localStorage.getItem('g2_b')||'0';}catch(e){}
function init(){grid=[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];score=0;over=false;document.getElementById('score').textContent='0';document.getElementById('overlay').classList.remove('show');addT();addT();render();}
function addT(){var e=[];for(var y=0;y<4;y++)for(var x=0;x<4;x++)if(grid[y][x]===0)e.push({x:x,y:y});if(!e.length)return;var p=e[Math.floor(Math.random()*e.length)];grid[p.y][p.x]=Math.random()<0.9?2:4;}
function render(){var b=document.getElementById('board');b.innerHTML='';for(var y=0;y<4;y++)for(var x=0;x<4;x++){var v=grid[y][x];var d=document.createElement('div');d.style.cssText='display:flex;align-items:center;justify-content:center;border-radius:8px;font-weight:900;font-size:clamp(20px,5vw,32px);background:'+(v?(CO[v]||'#3c3a32'):'#2a2a2a')+';color:'+(v?(TX[v]||'#fff'):'#000');d.textContent=v||'';b.appendChild(d);}}
function move(d){if(over)return;var mv=false;var ng=[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];var dx=0,dy=0;if(d==='left')dx=-1;if(d==='right')dx=1;if(d==='up')dy=-1;if(d==='down')dy=1;var ps=[];for(var y=0;y<4;y++)for(var x=0;x<4;x++)ps.push({x:x,y:y});if(dx===1||dy===1)ps.reverse();ps.forEach(function(p){var v=grid[p.y][p.x];if(!v)return;var nx=p.x,ny=p.y;while(1){var tx=nx+dx,ty=ny+dy;if(tx<0||tx>3||ty<0||ty>3)break;if(ng[ty][tx]===0){nx=tx;ny=ty;}else if(ng[ty][tx]===v){ng[ty][tx]=v*2;score+=v*2;mv=true;return;}else break;}if(nx!==p.x||ny!==p.y)mv=true;ng[ny][nx]=v;});if(mv){grid=ng;document.getElementById('score').textContent=score;try{var b=parseInt(localStorage.getItem('g2_b')||'0');if(score>b){localStorage.setItem('g2_b',score);document.getElementById('best').textContent=score;}}catch(e){}addT();render();if(chk())end();}}
window.move=move;
function chk(){for(var y=0;y<4;y++)for(var x=0;x<4;x++){if(grid[y][x]===0)return false;if(x<3&&grid[y][x]===grid[y][x+1])return false;if(y<3&&grid[y][x]===grid[y+1][x])return false;}return true;}
function end(){over=true;document.getElementById('finalScore').textContent=score;document.getElementById('overlay').classList.add('show');}
function reset(){init();}
window.reset=reset;
document.addEventListener('keydown',function(e){var k=e.key;if(k==='ArrowLeft'||k==='q'||k==='Q'||k==='a'||k==='A'){move('left');e.preventDefault();}if(k==='ArrowRight'||k==='d'||k==='D'){move('right');e.preventDefault();}if(k==='ArrowUp'||k==='z'||k==='Z'||k==='w'||k==='W'){move('up');e.preventDefault();}if(k==='ArrowDown'||k==='s'||k==='S'){move('down');e.preventDefault();}});
var tsx=0,tsy=0,tch=false;
document.body.addEventListener('touchstart',function(e){tsx=e.touches[0].clientX;tsy=e.touches[0].clientY;tch=true;},{passive:true});
document.body.addEventListener('touchend',function(e){if(!tch)return;tch=false;var dx=e.changedTouches[0].clientX-tsx,dy=e.changedTouches[0].clientY-tsy;if(Math.abs(dx)<25&&Math.abs(dy)<25)return;if(Math.abs(dx)>Math.abs(dy))move(dx>0?'right':'left');else move(dy>0?'down':'up');},{passive:true});
init();
`, "2048");
}

// ═══ 3. MORPION ═══
function morpion(): string {
  return wrap("Morpion", `
<h1>⭕ <span>Morpion</span></h1>
<div class="stats"><span>Toi : <strong id="sw">0</strong></span><span>IA : <strong id="sl">0</strong></span><span>Nuls : <strong id="sd">0</strong></span></div>
<div id="board" style="display:grid;grid-template-columns:repeat(3,min(100px,25vw));grid-template-rows:repeat(3,min(100px,25vw));gap:8px;background:#1a1a1a;padding:12px;border-radius:12px;border:2px solid var(--card-border)"></div>
<div style="margin-top:16px"><button onclick="reset()" ontouchstart="reset();event.preventDefault()" style="padding:12px 32px;background:var(--card-border);color:#000;border:none;border-radius:10px;font-weight:900;font-size:16px;cursor:pointer">Nouvelle partie</button></div>
<div class="overlay" id="overlay"><h2 id="overTitle">Victoire !</h2><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var bd,turn,over,W=0,L=0,D=0;
function init(){bd=['','','','','','','','',''];turn='X';over=false;document.getElementById('overlay').classList.remove('show');render();}
function render(){var b=document.getElementById('board');b.innerHTML='';var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';bd.forEach(function(v,i){var c=document.createElement('div');c.style.cssText='background:#2a2a2a;border-radius:10px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:clamp(40px,8vw,64px);cursor:pointer;color:'+(v==='X'?ACC:v==='O'?'#06b6d4':'#fff');c.textContent=v;c.onclick=function(){play(i);};c.ontouchstart=function(e){e.preventDefault();play(i);};b.appendChild(c);});}
function play(i){if(over||bd[i])return;bd[i]='X';render();if(chk('X'))return end('w');if(bd.every(function(c){return c;}))return end('d');setTimeout(function(){var b=best();bd[b]='O';render();if(chk('O'))return end('l');if(bd.every(function(c){return c;}))return end('d');},300);}
window.play=play;
function chk(p){var l=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];return l.some(function(x){return x.every(function(i){return bd[i]===p;});});}
function best(){var e=bd.map(function(v,i){return v?null:i;}).filter(function(v){return v!==null;});for(var i=0;i<e.length;i++){bd[e[i]]='O';if(chk('O')){bd[e[i]]='';return e[i];}bd[e[i]]='';}for(var i=0;i<e.length;i++){bd[e[i]]='X';if(chk('X')){bd[e[i]]='';return e[i];}bd[e[i]]='';}if(bd[4]==='')return 4;var co=[0,2,6,8].filter(function(i){return bd[i]==='';});if(co.length)return co[Math.floor(Math.random()*co.length)];return e[Math.floor(Math.random()*e.length)];}
function end(r){over=true;var t=document.getElementById('overTitle');if(r==='w'){W++;t.textContent='🎉 Victoire !';}else if(r==='l'){L++;t.textContent='😢 Perdu';}else{D++;t.textContent='Match nul';}document.getElementById('sw').textContent=W;document.getElementById('sl').textContent=L;document.getElementById('sd').textContent=D;document.getElementById('overlay').classList.add('show');}
function reset(){init();}
window.reset=reset;
init();
`, "morpion");
}

// ═══ 4. MEMORY ═══
function memory(): string {
  return wrap("Memory", `
<h1>🎴 <span>Memory</span></h1>
<div class="stats"><span>Coups : <strong id="moves">0</strong></span><span>Paires : <strong id="pairs">0/8</strong></span></div>
<div id="board" style="display:grid;grid-template-columns:repeat(4,min(80px,20vw));gap:8px;background:#1a1a1a;padding:12px;border-radius:12px;border:2px solid var(--card-border)"></div>
<div style="margin-top:16px"><button onclick="reset()" ontouchstart="reset();event.preventDefault()" style="padding:12px 32px;background:var(--card-border);color:#000;border:none;border-radius:10px;font-weight:900;font-size:16px;cursor:pointer">Nouvelle partie</button></div>
<div class="overlay" id="overlay"><h2 id="overTitle">Victoire !</h2><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var em=['🍎','🍌','🍇','🍓','🍊','🥝','🍒','🍑'],f,s,lock,mv,mat,cds;
function init(){var d=em.concat(em).sort(function(){return Math.random()-0.5;});cds=d;f=null;s=null;lock=false;mv=0;mat=0;document.getElementById('moves').textContent='0';document.getElementById('pairs').textContent='0/8';document.getElementById('overlay').classList.remove('show');render();}
function render(){var b=document.getElementById('board');b.innerHTML='';cds.forEach(function(e,i){var c=document.createElement('div');c.style.cssText='width:100%;aspect-ratio:1;background:#2a2a2a;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:clamp(28px,6vw,40px);cursor:pointer;color:#fff;font-weight:900';c.textContent='?';c.dataset.idx=i;c.dataset.em=e;c.onclick=function(){flip(i,c);};c.ontouchstart=function(ev){ev.preventDefault();flip(i,c);};b.appendChild(c);});}
function flip(i,c){if(lock||c.dataset.matched==='1'||c.textContent!=='?')return;c.textContent=c.dataset.em;var acc=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';c.style.background=acc;c.style.color='#000';if(f===null){f=i;return;}if(s===null){s=i;lock=true;mv++;document.getElementById('moves').textContent=mv;var c1=document.querySelector('[data-idx="'+f+'"]'),c2=c;if(c1.dataset.em===c2.dataset.em){c1.dataset.matched='1';c2.dataset.matched='1';c1.style.background='#22c55e';c2.style.background='#22c55e';c1.style.color='#fff';c2.style.color='#fff';mat++;document.getElementById('pairs').textContent=mat+'/8';f=null;s=null;lock=false;if(mat===8)setTimeout(function(){document.getElementById('overTitle').textContent='🎉 Bravo ! '+mv+' coups';document.getElementById('overlay').classList.add('show');},400);}else{setTimeout(function(){c1.textContent='?';c1.style.background='#2a2a2a';c1.style.color='#fff';c2.textContent='?';c2.style.background='#2a2a2a';c2.style.color='#fff';f=null;s=null;lock=false;},800);}}}
function reset(){init();}
window.reset=reset;
init();
`, "memory");
}

// ═══ 5. PONG ═══
function pong(): string {
  return wrap("Pong", `
<h1>🏓 <span>Pong</span></h1>
<div class="stats"><span>Toi : <strong id="p1">0</strong></span><span>IA : <strong id="p2">0</strong></span></div>
<canvas id="game" width="600" height="400" style="width:min(600px,90vw)"></canvas>
<div style="margin-top:16px;opacity:.6;font-size:12px">Souris / tactile pour bouger</div>
<div class="overlay" id="overlay"><h2 id="overTitle">Victoire</h2><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var c=document.getElementById('game'),x=c.getContext('2d'),W=c.width,H=c.height;
var p1,p2,ball,s1,s2,loop;
function init(){p1={x:10,y:H/2-40,w:10,h:80};p2={x:W-20,y:H/2-40,w:10,h:80};ball={x:W/2,y:H/2,dx:4,dy:3,r:8};s1=0;s2=0;document.getElementById('p1').textContent='0';document.getElementById('p2').textContent='0';document.getElementById('overlay').classList.remove('show');}
function upd(){ball.x+=ball.dx;ball.y+=ball.dy;if(ball.y-ball.r<0||ball.y+ball.r>H)ball.dy*=-1;if(ball.x-ball.r<p1.x+p1.w&&ball.y>p1.y&&ball.y<p1.y+p1.h&&ball.dx<0){ball.dx*=-1.05;ball.dy+=(ball.y-(p1.y+p1.h/2))/20;}if(ball.x+ball.r>p2.x&&ball.y>p2.y&&ball.y<p2.y+p2.h&&ball.dx>0){ball.dx*=-1.05;ball.dy+=(ball.y-(p2.y+p2.h/2))/20;}var t=ball.y-p2.h/2;p2.y+=Math.max(-5,Math.min(5,t-p2.y));if(ball.x<0){s2++;document.getElementById('p2').textContent=s2;rb();}if(ball.x>W){s1++;document.getElementById('p1').textContent=s1;rb();}if(s1>=5||s2>=5)end();}
function rb(){ball.x=W/2;ball.y=H/2;ball.dx=(Math.random()>0.5?4:-4);ball.dy=(Math.random()-0.5)*6;}
function draw(){var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';x.fillStyle='#000';x.fillRect(0,0,W,H);x.strokeStyle='#2a2a2a';x.setLineDash([8,8]);x.beginPath();x.moveTo(W/2,0);x.lineTo(W/2,H);x.stroke();x.setLineDash([]);x.fillStyle=ACC;x.fillRect(p1.x,p1.y,p1.w,p1.h);x.fillStyle='#ef4444';x.fillRect(p2.x,p2.y,p2.w,p2.h);x.fillStyle='#fff';x.beginPath();x.arc(ball.x,ball.y,ball.r,0,Math.PI*2);x.fill();}
function tick(){upd();draw();}
function end(){if(loop)clearInterval(loop);document.getElementById('overTitle').textContent=s1>=5?'🏆 Tu gagnes !':'😢 Perdu';document.getElementById('overlay').classList.add('show');}
function reset(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.reset=reset;
c.addEventListener('mousemove',function(e){var r=c.getBoundingClientRect();p1.y=(e.clientY-r.top)*(H/r.height)-p1.h/2;p1.y=Math.max(0,Math.min(H-p1.h,p1.y));});
c.addEventListener('touchstart',function(e){e.preventDefault();var r=c.getBoundingClientRect();p1.y=(e.touches[0].clientY-r.top)*(H/r.height)-p1.h/2;p1.y=Math.max(0,Math.min(H-p1.h,p1.y));},{passive:false});
c.addEventListener('touchmove',function(e){e.preventDefault();var r=c.getBoundingClientRect();p1.y=(e.touches[0].clientY-r.top)*(H/r.height)-p1.h/2;p1.y=Math.max(0,Math.min(H-p1.h,p1.y));},{passive:false});
document.addEventListener('keydown',function(e){if(e.key==='ArrowUp'){p1.y-=20;e.preventDefault();}if(e.key==='ArrowDown'){p1.y+=20;e.preventDefault();}p1.y=Math.max(0,Math.min(H-p1.h,p1.y));});
reset();
`, "pong");
}

// ═══ 6. FLAPPY ═══
function flappy(): string {
  return wrap("Flappy", `
<h1>🐦 <span>Flappy</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Record : <strong id="best">0</strong></span></div>
<canvas id="game" width="400" height="600" style="width:min(400px,80vw)"></canvas>
<div style="margin-top:16px;opacity:.6;font-size:12px">Clic / Espace / Tap pour voler</div>
<div class="overlay" id="overlay"><h2>Game Over</h2><p>Score : <strong id="finalScore">0</strong></p><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var c=document.getElementById('game'),x=c.getContext('2d'),W=c.width,H=c.height;
var bird,pipes,score,over,loop;
try{document.getElementById('best').textContent=localStorage.getItem('fl_b')||'0';}catch(e){}
function init(){bird={y:300,vy:0,r:15};pipes=[];score=0;over=false;document.getElementById('score').textContent='0';document.getElementById('overlay').classList.remove('show');}
function flap(){if(over)return;bird.vy=-7;}
function upd(){bird.vy+=0.5;bird.y+=bird.vy;if(bird.y<0||bird.y>H)return die();pipes.forEach(function(p){p.x-=3;});if(!pipes.length||pipes[pipes.length-1].x<W-250){var t=Math.floor(Math.random()*(H-350))+50;pipes.push({x:W,w:60,top:t,scored:false});}pipes=pipes.filter(function(p){return p.x+p.w>0;});pipes.forEach(function(p){if(!p.scored&&p.x+p.w<80){p.scored=true;score++;document.getElementById('score').textContent=score;}if(80+bird.r>p.x&&80-bird.r<p.x+p.w){if(bird.y-bird.r<p.top||bird.y+bird.r>p.top+150)die();}});}
function die(){over=true;document.getElementById('finalScore').textContent=score;document.getElementById('overlay').classList.add('show');try{var b=parseInt(localStorage.getItem('fl_b')||'0');if(score>b){localStorage.setItem('fl_b',score);document.getElementById('best').textContent=score;}}catch(e){}}
function draw(){var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';x.fillStyle='#0a0a0a';x.fillRect(0,0,W,H);x.fillStyle='#22c55e';x.fillRect(0,H-40,W,40);pipes.forEach(function(p){x.fillStyle=ACC;x.fillRect(p.x,0,p.w,p.top);x.fillRect(p.x,p.top+150,p.w,H-p.top-150);});x.fillStyle=ACC;x.beginPath();x.arc(80,bird.y,bird.r,0,Math.PI*2);x.fill();x.fillStyle='#000';x.beginPath();x.arc(85,bird.y-5,3,0,Math.PI*2);x.fill();}
function tick(){upd();draw();}
function reset(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.reset=reset;
document.addEventListener('keydown',function(e){if(e.key===' '){flap();e.preventDefault();}});
c.addEventListener('click',flap);
c.addEventListener('touchstart',function(e){e.preventDefault();flap();},{passive:false});
reset();
`, "flappy");
}

// ═══ 7. CASSE-BRIQUES ═══
function brick(): string {
  return wrap("Casse-briques", `
<h1>🧱 <span>Casse-briques</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Vies : <strong id="lives">3</strong></span></div>
<canvas id="game" width="480" height="400" style="width:min(480px,90vw)"></canvas>
<div class="controls">
<button ontouchstart="move(-1);event.preventDefault()" onclick="move(-1)">←</button>
<button ontouchstart="move(1);event.preventDefault()" onclick="move(1)">→</button>
</div>
<div class="overlay" id="overlay"><h2 id="overTitle">Game Over</h2><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var c=document.getElementById('game'),x=c.getContext('2d'),W=c.width,H=c.height;
var pad,ball,bricks,score,lives,over,loop;
function init(){pad={x:W/2-40,y:H-20,w:80,h:10};ball={x:W/2,y:H-40,dx:3,dy:-3,r:6};bricks=[];for(var r=0;r<5;r++)for(var col=0;col<8;col++)bricks.push({x:col*60+5,y:r*25+30,w:55,h:20,alive:true});score=0;lives=3;over=false;document.getElementById('score').textContent='0';document.getElementById('lives').textContent='3';document.getElementById('overlay').classList.remove('show');}
function move(d){pad.x+=d*30;pad.x=Math.max(0,Math.min(W-pad.w,pad.x));}
window.move=move;
function upd(){ball.x+=ball.dx;ball.y+=ball.dy;if(ball.x-ball.r<0||ball.x+ball.r>W)ball.dx*=-1;if(ball.y-ball.r<0)ball.dy*=-1;if(ball.y+ball.r>H){lives--;document.getElementById('lives').textContent=lives;if(lives<=0)return end();ball.x=W/2;ball.y=H-40;ball.dx=3;ball.dy=-3;}if(ball.y+ball.r>pad.y&&ball.y+ball.r<pad.y+pad.h&&ball.x>pad.x&&ball.x<pad.x+pad.w&&ball.dy>0){ball.dy*=-1;ball.dx+=(ball.x-(pad.x+pad.w/2))/20;}bricks.forEach(function(b){if(!b.alive)return;if(ball.x>b.x&&ball.x<b.x+b.w&&ball.y>b.y&&ball.y<b.y+b.h){b.alive=false;ball.dy*=-1;score+=10;document.getElementById('score').textContent=score;}});if(bricks.every(function(b){return !b.alive;}))end();}
function end(){over=true;document.getElementById('overTitle').textContent=bricks.every(function(b){return !b.alive;})?'🏆 Victoire !':'Game Over';document.getElementById('overlay').classList.add('show');}
function draw(){var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';x.fillStyle='#000';x.fillRect(0,0,W,H);x.fillStyle=ACC;x.fillRect(pad.x,pad.y,pad.w,pad.h);x.fillStyle='#ef4444';x.beginPath();x.arc(ball.x,ball.y,ball.r,0,Math.PI*2);x.fill();bricks.forEach(function(b){if(b.alive){x.fillStyle='#3b82f6';x.fillRect(b.x,b.y,b.w,b.h);}});}
function tick(){if(!over)upd();draw();}
function reset(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.reset=reset;
c.addEventListener('mousemove',function(e){var r=c.getBoundingClientRect();pad.x=(e.clientX-r.left)*(W/r.width)-pad.w/2;pad.x=Math.max(0,Math.min(W-pad.w,pad.x));});
c.addEventListener('touchstart',function(e){e.preventDefault();var r=c.getBoundingClientRect();pad.x=(e.touches[0].clientX-r.left)*(W/r.width)-pad.w/2;pad.x=Math.max(0,Math.min(W-pad.w,pad.x));},{passive:false});
c.addEventListener('touchmove',function(e){e.preventDefault();var r=c.getBoundingClientRect();pad.x=(e.touches[0].clientX-r.left)*(W/r.width)-pad.w/2;pad.x=Math.max(0,Math.min(W-pad.w,pad.x));},{passive:false});
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft'){pad.x-=30;e.preventDefault();}if(e.key==='ArrowRight'){pad.x+=30;e.preventDefault();}pad.x=Math.max(0,Math.min(W-pad.w,pad.x));});
reset();
`, "breakout");
}

// ═══ 8. SPACE INVADERS ═══
function invaders(): string {
  return wrap("Space Invaders", `
<h1>👾 <span>Space Invaders</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Vies : <strong id="lives">3</strong></span></div>
<canvas id="game" width="480" height="500" style="width:min(480px,90vw)"></canvas>
<div class="controls">
<button ontouchstart="move(-1);event.preventDefault()" onclick="move(-1)">←</button>
<button ontouchstart="shoot();event.preventDefault()" onclick="shoot()">🔥</button>
<button ontouchstart="move(1);event.preventDefault()" onclick="move(1)">→</button>
</div>
<div class="overlay" id="overlay"><h2 id="overTitle">Game Over</h2><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var c=document.getElementById('game'),x=c.getContext('2d'),W=c.width,H=c.height;
var player,bullets,enemies,enemyDir,score,lives,over,loop;
function init(){player={x:W/2-20,y:H-30,w:40,h:20};bullets=[];enemies=[];for(var r=0;r<4;r++)for(var col=0;col<8;col++)enemies.push({x:col*50+30,y:r*40+40,w:35,h:25,alive:true});enemyDir=1;score=0;lives=3;over=false;document.getElementById('score').textContent='0';document.getElementById('lives').textContent='3';document.getElementById('overlay').classList.remove('show');}
function move(d){player.x+=d*25;player.x=Math.max(0,Math.min(W-player.w,player.x));}
window.move=move;
function shoot(){if(over)return;bullets.push({x:player.x+player.w/2,y:player.y,dy:-8});}
window.shoot=shoot;
function upd(){bullets.forEach(function(b){b.y+=b.dy;});bullets=bullets.filter(function(b){return b.y>0;});var hitWall=false;enemies.forEach(function(e){if(!e.alive)return;e.x+=enemyDir*0.6;if(e.x<10||e.x+e.w>W-10)hitWall=true;});if(hitWall){enemyDir*=-1;enemies.forEach(function(e){e.y+=20;});}bullets.forEach(function(b){enemies.forEach(function(e){if(!e.alive)return;if(b.x>e.x&&b.x<e.x+e.w&&b.y>e.y&&b.y<e.y+e.h){e.alive=false;b.y=-100;score+=10;document.getElementById('score').textContent=score;}});});bullets=bullets.filter(function(b){return b.y>0;});if(enemies.every(function(e){return !e.alive;}))end(true);var lowest=0;enemies.forEach(function(e){if(e.alive&&e.y>lowest)lowest=e.y;});if(lowest>H-60){lives--;document.getElementById('lives').textContent=lives;if(lives<=0)return end(false);}}
function end(win){over=true;document.getElementById('overTitle').textContent=win?'🏆 Victoire !':'Game Over';document.getElementById('overlay').classList.add('show');}
function draw(){var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';x.fillStyle='#000';x.fillRect(0,0,W,H);x.fillStyle=ACC;x.fillRect(player.x,player.y,player.w,player.h);x.fillStyle='#ef4444';bullets.forEach(function(b){x.fillRect(b.x-1,b.y,3,8);});enemies.forEach(function(e){if(e.alive){x.fillStyle='#22c55e';x.fillRect(e.x,e.y,e.w,e.h);}});}
function tick(){if(!over)upd();draw();}
function reset(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.reset=reset;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft'){player.x-=25;e.preventDefault();}if(e.key==='ArrowRight'){player.x+=25;e.preventDefault();}if(e.key===' '){shoot();e.preventDefault();}player.x=Math.max(0,Math.min(W-player.w,player.x));});
reset();
`, "space-invaders");
}

// ═══ 9. DEMINEUR ═══
function demineur(): string {
  return wrap("Démineur", `
<h1>💣 <span>Démineur</span></h1>
<div class="stats"><span>Drapeaux : <strong id="flags">0</strong></span><span>Temps : <strong id="time">0</strong>s</span></div>
<div id="board" style="display:grid;grid-template-columns:repeat(8,min(40px,10vw));gap:4px;background:#1a1a1a;padding:8px;border-radius:12px;border:2px solid var(--card-border)"></div>
<div style="margin-top:16px"><button onclick="reset()" ontouchstart="reset();event.preventDefault()" style="padding:12px 32px;background:var(--card-border);color:#000;border:none;border-radius:10px;font-weight:900;font-size:16px;cursor:pointer">Nouvelle partie</button></div>
<div class="overlay" id="overlay"><h2 id="overTitle">Perdu</h2><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var SIZE=8,MINES=10,grid,revealed,flags,over,timer,sec;
function init(){grid=[];revealed=[];flags=[];over=false;sec=0;document.getElementById('flags').textContent='0';document.getElementById('time').textContent='0';document.getElementById('overlay').classList.remove('show');for(var y=0;y<SIZE;y++){grid[y]=[];revealed[y]=[];flags[y]=[];for(var x=0;x<SIZE;x++){grid[y][x]=0;revealed[y][x]=false;flags[y][x]=false;}}var placed=0;while(placed<MINES){var mx=Math.floor(Math.random()*SIZE),my=Math.floor(Math.random()*SIZE);if(grid[my][mx]!==-1){grid[my][mx]=-1;placed++;}}for(var y=0;y<SIZE;y++)for(var x=0;x<SIZE;x++){if(grid[y][x]===-1)continue;var cnt=0;for(var dy=-1;dy<=1;dy++)for(var dx=-1;dx<=1;dx++){var ny=y+dy,nx=x+dx;if(ny>=0&&ny<SIZE&&nx>=0&&nx<SIZE&&grid[ny][nx]===-1)cnt++;}grid[y][x]=cnt;}if(timer)clearInterval(timer);timer=setInterval(function(){if(!over){sec++;document.getElementById('time').textContent=sec;}},1000);render();}
function render(){var b=document.getElementById('board');b.innerHTML='';for(var y=0;y<SIZE;y++)for(var x=0;x<SIZE;x++){var c=document.createElement('div');var v=grid[y][x],r=revealed[y][x],fl=flags[y][x];var col='#2a2a2a';var txt='';if(r){if(v===-1){col='#ef4444';txt='💣';}else{col='#3a3a3a';txt=v>0?v:'';}}else if(fl){col='#facc15';txt='🚩';}c.style.cssText='width:100%;aspect-ratio:1;background:'+col+';border-radius:6px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:clamp(14px,3vw,20px);cursor:pointer;color:'+(v===1?'#3b82f6':v===2?'#22c55e':v===3?'#ef4444':'#fff');c.textContent=txt;c.onclick=function(){rev(y,x);};c.oncontextmenu=function(e){e.preventDefault();flg(y,x);};c.ontouchstart=function(e){e.preventDefault();var t=e.touches[0];var rect=c.getBoundingClientRect();var cx=t.clientX-rect.left;if(cx>rect.width/2)flg(y,x);else rev(y,x);};b.appendChild(c);}}
function rev(y,x){if(over||revealed[y][x]||flags[y][x])return;revealed[y][x]=true;if(grid[y][x]===-1)return end(false);if(grid[y][x]===0){for(var dy=-1;dy<=1;dy++)for(var dx=-1;dx<=1;dx++){var ny=y+dy,nx=x+dx;if(ny>=0&&ny<SIZE&&nx>=0&&nx<SIZE&&!revealed[ny][nx])rev(ny,nx);}}render();if(checkWin())end(true);}
function flg(y,x){if(over||revealed[y][x])return;flags[y][x]=!flags[y][x];var f=0;for(var yy=0;yy<SIZE;yy++)for(var xx=0;xx<SIZE;xx++)if(flags[yy][xx])f++;document.getElementById('flags').textContent=f;render();}
function checkWin(){for(var y=0;y<SIZE;y++)for(var x=0;x<SIZE;x++){if(grid[y][x]!==-1&&!revealed[y][x])return false;}return true;}
function end(win){over=true;if(timer)clearInterval(timer);document.getElementById('overTitle').textContent=win?'🏆 Victoire !':'💥 Perdu';document.getElementById('overlay').classList.add('show');for(var y=0;y<SIZE;y++)for(var x=0;x<SIZE;x++)if(grid[y][x]===-1)revealed[y][x]=true;render();}
function reset(){init();}
window.reset=reset;
init();
`, "minesweeper");
}

// ═══ 10. SUDOKU ═══
function sudoku(): string {
  return wrap("Sudoku", `
<h1>🔢 <span>Sudoku</span></h1>
<div id="board" style="display:grid;grid-template-columns:repeat(9,min(40px,10vw));gap:2px;background:#1a1a1a;padding:8px;border-radius:12px;border:2px solid var(--card-border)"></div>
<div class="controls" style="margin-top:16px">
<button ontouchstart="sel(1);event.preventDefault()" onclick="sel(1)">1</button>
<button ontouchstart="sel(2);event.preventDefault()" onclick="sel(2)">2</button>
<button ontouchstart="sel(3);event.preventDefault()" onclick="sel(3)">3</button>
<button ontouchstart="sel(4);event.preventDefault()" onclick="sel(4)">4</button>
<button ontouchstart="sel(5);event.preventDefault()" onclick="sel(5)">5</button>
</div>
<div class="controls">
<button ontouchstart="sel(6);event.preventDefault()" onclick="sel(6)">6</button>
<button ontouchstart="sel(7);event.preventDefault()" onclick="sel(7)">7</button>
<button ontouchstart="sel(8);event.preventDefault()" onclick="sel(8)">8</button>
<button ontouchstart="sel(9);event.preventDefault()" onclick="sel(9)">9</button>
<button ontouchstart="sel(0);event.preventDefault()" onclick="sel(0)">⌫</button>
</div>
<div class="overlay" id="overlay"><h2>🎉 Victoire !</h2><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var puzzle,fixed,selected,grid;
var P=[[5,3,0,0,7,0,0,0,0],[6,0,0,1,9,5,0,0,0],[0,9,8,0,0,0,0,6,0],[8,0,0,0,6,0,0,0,3],[4,0,0,8,0,3,0,0,1],[7,0,0,0,2,0,0,0,6],[0,6,0,0,0,0,2,8,0],[0,0,0,4,1,9,0,0,5],[0,0,0,0,8,0,0,7,9]];
var S=[[5,3,4,6,7,8,9,1,2],[6,7,2,1,9,5,3,4,8],[1,9,8,3,4,2,5,6,7],[8,5,9,7,6,1,4,2,3],[4,2,6,8,5,3,7,9,1],[7,1,3,9,2,4,8,5,6],[9,6,1,5,3,7,2,8,4],[2,8,7,4,1,9,6,3,5],[3,4,5,2,8,6,1,7,9]];
function init(){grid=P.map(function(r){return r.slice();});fixed=grid.map(function(r){return r.map(function(v){return v!==0;});});selected=null;document.getElementById('overlay').classList.remove('show');render();}
function render(){var b=document.getElementById('board');b.innerHTML='';var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';for(var y=0;y<9;y++)for(var x=0;x<9;x++){var v=grid[y][x];var c=document.createElement('div');var bg='#2a2a2a';if(fixed[y][x])bg='#1a1a1a';if(selected&&selected.y===y&&selected.x===x)bg=ACC;c.style.cssText='width:100%;aspect-ratio:1;background:'+bg+';border-radius:4px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:clamp(14px,3vw,20px);cursor:pointer;color:'+(fixed[y][x]?'#fff':v?(selected&&selected.y===y&&selected.x===x?'#000':ACC):'#fff');c.textContent=v||'';c.onclick=function(){pick(y,x);};c.ontouchstart=function(e){e.preventDefault();pick(y,x);};b.appendChild(c);}}
function pick(y,x){if(fixed[y][x])return;selected={y:y,x:x};render();}
function sel(v){if(!selected)return;grid[selected.y][selected.x]=v;render();if(chk()){setTimeout(function(){document.getElementById('overlay').classList.add('show');},200);}}
window.sel=sel;
function chk(){for(var y=0;y<9;y++)for(var x=0;x<9;x++)if(grid[y][x]!==S[y][x])return false;return true;}
function reset(){init();}
window.reset=reset;
init();
`, "sudoku");
}

// ═══ 11. SIMON ═══
function simon(): string {
  return wrap("Simon", `
<h1>🧠 <span>Simon</span></h1>
<div class="stats"><span>Niveau : <strong id="lvl">1</strong></span><span>Record : <strong id="best">0</strong></span></div>
<div id="board" style="display:grid;grid-template-columns:repeat(2,min(120px,35vw));grid-template-rows:repeat(2,min(120px,35vw));gap:12px"></div>
<div style="margin-top:16px"><button onclick="reset()" ontouchstart="reset();event.preventDefault()" style="padding:12px 32px;background:var(--card-border);color:#000;border:none;border-radius:10px;font-weight:900;font-size:16px;cursor:pointer">Nouvelle partie</button></div>
<div class="overlay" id="overlay"><h2>Perdu</h2><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var cols=['#ef4444','#3b82f6','#22c55e','#facc15'];
var seq,input,playing,lock,level;
try{document.getElementById('best').textContent=localStorage.getItem('sm_b')||'0';}catch(e){}
function init(){seq=[];input=[];playing=false;lock=true;level=0;document.getElementById('overlay').classList.remove('show');render();setTimeout(next,500);}
function render(){var b=document.getElementById('board');b.innerHTML='';for(var i=0;i<4;i++){var c=document.createElement('div');c.dataset.idx=i;c.style.cssText='background:'+cols[i]+';border-radius:20px;cursor:pointer;transition:opacity .2s;opacity:.5';c.onclick=function(){press(i);};c.ontouchstart=function(e){e.preventDefault();press(i);};b.appendChild(c);}}
function light(i,t){var c=document.querySelector('[data-idx="'+i+'"]');if(!c)return;c.style.opacity='1';setTimeout(function(){c.style.opacity='.5';},t||300);}
function next(){level++;document.getElementById('lvl').textContent=level;seq.push(Math.floor(Math.random()*4));input=[];playing=true;lock=true;var i=0;var iv=setInterval(function(){if(i>=seq.length){clearInterval(iv);lock=false;return;}light(seq[i],400);i++;},700);}
function press(i){if(lock)return;light(i,200);input.push(i);var idx=input.length-1;if(input[idx]!==seq[idx]){end();return;}if(input.length===seq.length){playing=false;lock=true;setTimeout(next,700);}}
function end(){document.getElementById('overlay').classList.add('show');try{var b=parseInt(localStorage.getItem('sm_b')||'0');if(level-1>b){localStorage.setItem('sm_b',level-1);document.getElementById('best').textContent=level-1;}}catch(e){}}
function reset(){init();}
window.reset=reset;
init();
`, "simon");
}

// ═══ 12. TETRIS ═══
function tetris(): string {
  return wrap("Tetris", `
<h1>🧩 <span>Tetris</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Lignes : <strong id="lines">0</strong></span></div>
<canvas id="game" width="300" height="600" style="width:min(300px,60vw)"></canvas>
<div class="controls">
<button ontouchstart="act('left');event.preventDefault()" onclick="act('left')">←</button>
<button ontouchstart="act('rot');event.preventDefault()" onclick="act('rot')">↻</button>
<button ontouchstart="act('right');event.preventDefault()" onclick="act('right')">→</button>
<button ontouchstart="act('down');event.preventDefault()" onclick="act('down')">↓</button>
</div>
<div class="overlay" id="overlay"><h2>Game Over</h2><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var c=document.getElementById('game'),x=c.getContext('2d'),COLS=10,ROWS=20,B=c.width/COLS;
var board,piece,px,py,score,lines,over,loop;
var SHAPES=[[[1,1,1,1]],[[1,1],[1,1]],[[0,1,0],[1,1,1]],[[1,0,0],[1,1,1]],[[0,0,1],[1,1,1]],[[0,1,1],[1,1,0]],[[1,1,0],[0,1,1]]];
var COLORS=['#06b6d4','#facc15','#a855f7','#3b82f6','#f97316','#22c55e','#ef4444'];
function init(){board=[];for(var i=0;i<ROWS;i++){board[i]=[];for(var j=0;j<COLS;j++)board[i][j]=0;}score=0;lines=0;over=false;document.getElementById('score').textContent='0';document.getElementById('lines').textContent='0';document.getElementById('overlay').classList.remove('show');newP();}
function newP(){var i=Math.floor(Math.random()*SHAPES.length);piece={shape:SHAPES[i].map(function(r){return r.slice();}),color:COLORS[i]};px=Math.floor((COLS-piece.shape[0].length)/2);py=0;if(coll())end();}
function coll(){for(var y=0;y<piece.shape.length;y++)for(var x=0;x<piece.shape[y].length;x++){if(piece.shape[y][x]){var nx=px+x,ny=py+y;if(nx<0||nx>=COLS||ny>=ROWS)return true;if(ny>=0&&board[ny][nx])return true;}}return false;}
function merge(){for(var y=0;y<piece.shape.length;y++)for(var x=0;x<piece.shape[y].length;x++)if(piece.shape[y][x])board[py+y][px+x]=piece.color;}
function clr(){var cnt=0;for(var y=ROWS-1;y>=0;y--){if(board[y].every(function(c){return c;})){board.splice(y,1);board.unshift([]);for(var j=0;j<COLS;j++)board[0][j]=0;cnt++;y++;}}if(cnt){score+=[0,100,300,500,800][cnt]||1000;lines+=cnt;document.getElementById('score').textContent=score;document.getElementById('lines').textContent=lines;}}
function draw(){x.fillStyle='#000';x.fillRect(0,0,c.width,c.height);for(var y=0;y<ROWS;y++)for(var xx=0;xx<COLS;xx++){if(board[y][xx]){x.fillStyle=board[y][xx];x.fillRect(xx*B+1,y*B+1,B-2,B-2);}}if(piece){for(var y=0;y<piece.shape.length;y++)for(var xx=0;xx<piece.shape[y].length;xx++){if(piece.shape[y][xx]){x.fillStyle=piece.color;x.fillRect((px+xx)*B+1,(py+y)*B+1,B-2,B-2);}}}}
function act(a){if(over||!piece)return;if(a==='left'){px--;if(coll())px++;}else if(a==='right'){px++;if(coll())px--;}else if(a==='down'){py++;if(coll()){py--;merge();clr();newP();}}else if(a==='rot'){var r=piece.shape[0].map(function(_,i){return piece.shape.map(function(row){return row[i];}).reverse();});var old=piece.shape;piece.shape=r;if(coll())piece.shape=old;}draw();}
window.act=act;
function tick(){if(!over){py++;if(coll()){py--;merge();clr();newP();}draw();}}
function end(){over=true;document.getElementById('overlay').classList.add('show');}
function reset(){init();if(loop)clearInterval(loop);loop=setInterval(tick,500);draw();}
window.reset=reset;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft'){act('left');e.preventDefault();}if(e.key==='ArrowRight'){act('right');e.preventDefault();}if(e.key==='ArrowDown'){act('down');e.preventDefault();}if(e.key==='ArrowUp'){act('rot');e.preventDefault();}});
reset();
`, "tetris");
}

// ═══ 13. DOODLE JUMP ═══
function doodle(): string {
  return wrap("Doodle Jump", `
<h1>🦘 <span>Doodle Jump</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="game" width="400" height="600" style="width:min(400px,80vw)"></canvas>
<div class="controls">
<button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button>
<button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button>
</div>
<div class="overlay" id="overlay"><h2>Game Over</h2><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var c=document.getElementById('game'),x=c.getContext('2d'),W=c.width,H=c.height;
var player,plats,vy,score,over,loop;
function init(){player={x:W/2-15,y:H-80,w:30,h:30,vx:0};plats=[];for(var i=0;i<8;i++)plats.push({x:Math.random()*(W-80),y:H-i*80,w:70,h:12});vy=-10;score=0;over=false;document.getElementById('score').textContent='0';document.getElementById('overlay').classList.remove('show');}
function mv(d){player.vx=d*5;}
window.mv=mv;
function upd(){vy+=0.4;player.y+=vy;player.x+=player.vx;if(player.x<0)player.x=0;if(player.x+player.w>W)player.x=W-player.w;player.vx*=0.9;plats.forEach(function(p){if(player.y+player.h>p.y&&player.y+player.h<p.y+p.h+10&&player.x+player.w>p.x&&player.x<p.x+p.w&&vy>0){vy=-10;score+=10;document.getElementById('score').textContent=score;}});if(player.y<H/2){var dy=H/2-player.y;player.y=H/2;plats.forEach(function(p){p.y+=dy;});score+=Math.floor(dy);document.getElementById('score').textContent=score;}plats=plats.filter(function(p){return p.y<H+50;});while(plats.length<10){var highest=H;plats.forEach(function(p){if(p.y<highest)highest=p.y;});plats.push({x:Math.random()*(W-80),y:highest-Math.random()*60-40,w:70,h:12});}if(player.y>H){over=true;document.getElementById('overlay').classList.add('show');}}
function draw(){var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';x.fillStyle='#0a0a0a';x.fillRect(0,0,W,H);x.fillStyle=ACC;plats.forEach(function(p){x.fillRect(p.x,p.y,p.w,p.h);});x.fillStyle='#22c55e';x.fillRect(player.x,player.y,player.w,player.h);}
function tick(){if(!over)upd();draw();}
function reset(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.reset=reset;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft'){mv(-1);e.preventDefault();}if(e.key==='ArrowRight'){mv(1);e.preventDefault();}});
var tsx=0;
c.addEventListener('touchstart',function(e){e.preventDefault();tsx=e.touches[0].clientX;},{passive:false});
c.addEventListener('touchmove',function(e){e.preventDefault();var dx=e.touches[0].clientX-tsx;player.x+=(dx/W)*40;tsx=e.touches[0].clientX;},{passive:false});
reset();
`, "doodle-jump");
}

// ═══ 14. ASTEROIDES ═══
function asteroids(): string {
  return wrap("Astéroïdes", `
<h1>☄️ <span>Astéroïdes</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Vies : <strong id="lives">3</strong></span></div>
<canvas id="game" width="500" height="500" style="width:min(500px,90vw)"></canvas>
<div class="controls">
<button ontouchstart="act('left');event.preventDefault()" onclick="act('left')">↺</button>
<button ontouchstart="act('shoot');event.preventDefault()" onclick="act('shoot')">🔥</button>
<button ontouchstart="act('right');event.preventDefault()" onclick="act('right')">↻</button>
</div>
<div class="overlay" id="overlay"><h2>Game Over</h2><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var c=document.getElementById('game'),x=c.getContext('2d'),W=c.width,H=c.height;
var ship,rocks,bullets,score,lives,over,loop;
function init(){ship={x:W/2,y:H/2,a:0,vx:0,vy:0};rocks=[];bullets=[];for(var i=0;i<5;i++)spawnRock();score=0;lives=3;over=false;document.getElementById('score').textContent='0';document.getElementById('lives').textContent='3';document.getElementById('overlay').classList.remove('show');}
function spawnRock(){var a=Math.random()*Math.PI*2,d=150+Math.random()*100;rocks.push({x:W/2+Math.cos(a)*d,y:H/2+Math.sin(a)*d,vx:(Math.random()-0.5)*2,vy:(Math.random()-0.5)*2,r:15+Math.random()*15});}
function act(a){if(over)return;if(a==='left')ship.a-=0.3;if(a==='right')ship.a+=0.3;if(a==='shoot')bullets.push({x:ship.x+Math.cos(ship.a)*20,y:ship.y+Math.sin(ship.a)*20,vx:Math.cos(ship.a)*7,vy:Math.sin(ship.a)*7,life:60});}
window.act=act;
function upd(){if(over)return;if(Math.random()<0.05){ship.vx+=Math.cos(ship.a)*0.2;ship.vy+=Math.sin(ship.a)*0.2;}ship.x+=ship.vx;ship.y+=ship.vy;ship.vx*=0.99;ship.vy*=0.99;if(ship.x<0)ship.x=W;if(ship.x>W)ship.x=0;if(ship.y<0)ship.y=H;if(ship.y>H)ship.y=0;rocks.forEach(function(r){r.x+=r.vx;r.y+=r.vy;if(r.x<0)r.x=W;if(r.x>W)r.x=0;if(r.y<0)r.y=H;if(r.y>H)r.y=0;});bullets.forEach(function(b){b.x+=b.vx;b.y+=b.vy;b.life--;});bullets=bullets.filter(function(b){return b.life>0&&b.x>0&&b.x<W&&b.y>0&&b.y<H;});bullets.forEach(function(b){rocks.forEach(function(r){var dx=b.x-r.x,dy=b.y-r.y;if(dx*dx+dy*dy<r.r*r.r){b.life=0;r.hit=true;score+=20;document.getElementById('score').textContent=score;}});});rocks=rocks.filter(function(r){return !r.hit;});while(rocks.length<5)spawnRock();rocks.forEach(function(r){var dx=ship.x-r.x,dy=ship.y-r.y;if(dx*dx+dy*dy<(r.r+10)*(r.r+10)){lives--;document.getElementById('lives').textContent=lives;ship.x=W/2;ship.y=H/2;ship.vx=0;ship.vy=0;if(lives<=0){over=true;document.getElementById('overlay').classList.add('show');}}});}
function draw(){var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';x.fillStyle='#000';x.fillRect(0,0,W,H);x.save();x.translate(ship.x,ship.y);x.rotate(ship.a);x.fillStyle=ACC;x.beginPath();x.moveTo(15,0);x.lineTo(-10,-8);x.lineTo(-10,8);x.closePath();x.fill();x.restore();rocks.forEach(function(r){x.strokeStyle='#ef4444';x.lineWidth=2;x.beginPath();x.arc(r.x,r.y,r.r,0,Math.PI*2);x.stroke();});x.fillStyle='#22c55e';bullets.forEach(function(b){x.fillRect(b.x-2,b.y-2,4,4);});}
function tick(){upd();draw();}
function reset(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.reset=reset;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft'){act('left');e.preventDefault();}if(e.key==='ArrowRight'){act('right');e.preventDefault();}if(e.key===' '){act('shoot');e.preventDefault();}});
reset();
`, "asteroids");
}

// ═══ 15. MATCH-3 ═══
function match3(): string {
  return wrap("Match-3", `
<h1>💎 <span>Match-3</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<div id="board" style="display:grid;grid-template-columns:repeat(8,min(45px,11vw));gap:3px;background:#1a1a1a;padding:8px;border-radius:12px;border:2px solid var(--card-border)"></div>
<div style="margin-top:16px"><button onclick="reset()" ontouchstart="reset();event.preventDefault()" style="padding:12px 32px;background:var(--card-border);color:#000;border:none;border-radius:10px;font-weight:900;font-size:16px;cursor:pointer">Nouvelle partie</button></div>
`, `
var N=8,em=['🔴','🔵','🟢','🟡','🟣'],grid,sel,score;
function init(){grid=[];for(var y=0;y<N;y++){grid[y]=[];for(var x=0;x<N;x++)grid[y][x]=Math.floor(Math.random()*em.length);}score=0;sel=null;document.getElementById('score').textContent='0';while(findMatches().length){shuffle();}render();}
function findMatches(){var m=[];for(var y=0;y<N;y++)for(var x=0;x<N-2;x++)if(grid[y][x]===grid[y][x+1]&&grid[y][x]===grid[y][x+2])m.push({y:y,x:x});for(var x=0;x<N;x++)for(var y=0;y<N-2;y++)if(grid[y][x]===grid[y+1][x]&&grid[y][x]===grid[y+2][x])m.push({y:y,x:x});return m;}
function shuffle(){for(var y=0;y<N;y++)for(var x=0;x<N;x++)grid[y][x]=Math.floor(Math.random()*em.length);}
function render(){var b=document.getElementById('board');b.innerHTML='';var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';for(var y=0;y<N;y++)for(var x=0;x<N;x++){var c=document.createElement('div');var bg=sel&&sel.y===y&&sel.x===x?ACC:'#2a2a2a';c.style.cssText='width:100%;aspect-ratio:1;background:'+bg+';border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:clamp(20px,5vw,32px);cursor:pointer;transition:transform .15s';c.textContent=em[grid[y][x]];c.onclick=function(){pick(y,x);};c.ontouchstart=function(e){e.preventDefault();pick(y,x);};b.appendChild(c);}}
function pick(y,x){if(sel===null){sel={y:y,x:x};render();return;}if(sel.y===y&&sel.x===x){sel=null;render();return;}var dy=Math.abs(sel.y-y),dx=Math.abs(sel.x-x);if(dy+dx!==1){sel={y:y,x:x};render();return;}var tmp=grid[y][x];grid[y][x]=grid[sel.y][sel.x];grid[sel.y][sel.x]=tmp;var m=findMatches();if(!m.length){tmp=grid[y][x];grid[y][x]=grid[sel.y][sel.x];grid[sel.y][sel.x]=tmp;}else{score+=m.length*10;document.getElementById('score').textContent=score;}sel=null;render();}
function reset(){init();}
window.reset=reset;
init();
`, "match3");
}

// ═══ 16. QUIZ ═══
function quiz(): string {
  return wrap("Quiz", `
<h1>❓ <span>Quiz</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Question : <strong id="qnum">1/10</strong></span></div>
<div id="quiz" style="max-width:500px;width:100%;background:#1a1a1a;padding:24px;border-radius:16px;border:2px solid var(--card-border)"></div>
<div class="overlay" id="overlay"><h2 id="overTitle">Terminé</h2><p>Score : <strong id="finalScore">0</strong></p><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var QS=[
{q:"Capitale de la France ?",a:["Paris","Lyon","Marseille","Nice"],c:0},
{q:"Combien de continents ?",a:["5","6","7","8"],c:2},
{q:"2 + 2 x 2 = ?",a:["6","8","4","10"],c:0},
{q:"Plus grand océan ?",a:["Atlantique","Indien","Arctique","Pacifique"],c:3},
{q:"Auteur de Hamlet ?",a:["Molière","Shakespeare","Victor Hugo","Racine"],c:1},
{q:"Année de la Révolution française ?",a:["1789","1799","1776","1804"],c:0},
{q:"Symbole chimique de l'or ?",a:["Or","Au","Ag","Fe"],c:1},
{q:"Combien de côtés dans un hexagone ?",a:["5","6","7","8"],c:1},
{q:"Planète la plus proche du Soleil ?",a:["Vénus","Terre","Mercure","Mars"],c:2},
{q:"Couleur obtenue en mélangeant bleu et jaune ?",a:["Violet","Vert","Orange","Marron"],c:1}
];
var idx,score;
function init(){idx=0;score=0;document.getElementById('score').textContent='0';document.getElementById('overlay').classList.remove('show');render();}
function render(){var q=QS[idx];document.getElementById('qnum').textContent=(idx+1)+'/'+QS.length;var html='<h2 style="font-size:20px;margin-bottom:20px">'+q.q+'</h2><div style="display:flex;flex-direction:column;gap:10px">';q.a.forEach(function(a,i){html+='<button ontouchstart="ans('+i+');event.preventDefault()" onclick="ans('+i+')" style="padding:14px 20px;background:#2a2a2a;color:#f5f5f5;border:2px solid #3a3a3a;border-radius:12px;font-size:15px;font-weight:600;cursor:pointer;text-align:left;transition:all .2s;font-family:inherit">'+a+'</button>';});html+='</div>';document.getElementById('quiz').innerHTML=html;}
function ans(i){if(i===QS[idx].c){score++;document.getElementById('score').textContent=score;}idx++;if(idx>=QS.length)return end();render();}
window.ans=ans;
function end(){document.getElementById('finalScore').textContent=score+'/'+QS.length;document.getElementById('overTitle').textContent=score>=7?'🏆 Bravo !':'📚 Continue !';document.getElementById('overlay').classList.add('show');}
function reset(){init();}
window.reset=reset;
init();
`, "trivia");
}

// ═══ 17. MASTERMIND ═══
function mastermind(): string {
  return wrap("Mastermind", `
<h1>🎯 <span>Mastermind</span></h1>
<div class="stats"><span>Essais : <strong id="tries">0</strong>/10</span></div>
<div id="board" style="display:flex;flex-direction:column;gap:8px;background:#1a1a1a;padding:16px;border-radius:12px;border:2px solid var(--card-border);min-width:300px"></div>
<div class="controls" style="margin-top:16px">
<button ontouchstart="pick(0);event.preventDefault()" onclick="pick(0)" style="background:#ef4444;color:#fff">R</button>
<button ontouchstart="pick(1);event.preventDefault()" onclick="pick(1)" style="background:#3b82f6;color:#fff">B</button>
<button ontouchstart="pick(2);event.preventDefault()" onclick="pick(2)" style="background:#22c55e;color:#fff">V</button>
<button ontouchstart="pick(3);event.preventDefault()" onclick="pick(3)" style="background:#facc15;color:#000">J</button>
</div>
<div class="controls">
<button ontouchstart="pick(4);event.preventDefault()" onclick="pick(4)" style="background:#a855f7;color:#fff">P</button>
<button ontouchstart="pick(5);event.preventDefault()" onclick="pick(5)" style="background:#f97316;color:#fff">O</button>
<button ontouchstart="submit();event.preventDefault()" onclick="submit()" style="background:#fff;color:#000;width:100px">OK</button>
<button ontouchstart="back();event.preventDefault()" onclick="back()" style="background:#666;color:#fff">⌫</button>
</div>
<div class="overlay" id="overlay"><h2 id="overTitle">Gagné !</h2><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var COLORS=['#ef4444','#3b82f6','#22c55e','#facc15','#a855f7','#f97316'];
var code,rows,current,tries;
function init(){code=[];for(var i=0;i<4;i++)code.push(Math.floor(Math.random()*6));rows=[];current=[];tries=0;document.getElementById('tries').textContent='0';document.getElementById('overlay').classList.remove('show');render();}
function render(){var b=document.getElementById('board');b.innerHTML='';rows.forEach(function(r){var d=document.createElement('div');d.style.cssText='display:flex;gap:8px;align-items:center;justify-content:center';var guess=r.g.map(function(g){return '<div style="width:40px;height:40px;border-radius:50%;background:'+COLORS[g]+'"></div>';}).join('');var ind=r.i.map(function(i){return '<div style="width:14px;height:14px;border-radius:50%;background:'+(i===2?'#000':i===1?'#fff':'#444')+';border:1px solid #666"></div>';}).join('');d.innerHTML=guess+'<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:4px;margin-left:12px">'+ind+'</div>';b.appendChild(d);});var cur=document.createElement('div');cur.style.cssText='display:flex;gap:8px;align-items:center;justify-content:center;margin-top:8px';for(var i=0;i<4;i++){var c=document.createElement('div');c.style.cssText='width:40px;height:40px;border-radius:50%;background:'+(i<current.length?COLORS[current[i]]:'#333')+';border:2px dashed #666';cur.appendChild(c);}b.appendChild(cur);}
function pick(i){if(current.length>=4)return;current.push(i);render();}
window.pick=pick;
function back(){current.pop();render();}
window.back=back;
function submit(){if(current.length!==4)return;var ind=[];var c2=code.slice();var g2=current.slice();for(var i=0;i<4;i++){if(g2[i]===c2[i]){ind.push(2);c2[i]=-1;g2[i]=-2;}}for(var i=0;i<4;i++){if(g2[i]===-2)continue;var idx=c2.indexOf(g2[i]);if(idx>=0){ind.push(1);c2[idx]=-1;}}while(ind.length<4)ind.push(0);rows.push({g:current.slice(),i:ind});tries++;document.getElementById('tries').textContent=tries;var win=ind.every(function(x){return x===2;});current=[];render();if(win){document.getElementById('overTitle').textContent='🎉 Gagné en '+tries+' essais';document.getElementById('overlay').classList.add('show');}else if(tries>=10){document.getElementById('overTitle').textContent='😢 Perdu';document.getElementById('overlay').classList.add('show');}}
window.submit=submit;
function reset(){init();}
window.reset=reset;
init();
`, "mastermind");
}

// ═══ 18. PENDU ═══
function pendu(): string {
  return wrap("Pendu", `
<h1>📝 <span>Pendu</span></h1>
<div class="stats"><span>Vies : <strong id="lives">6</strong></span><span>Mot : <strong id="word">_ _ _ _</strong></span></div>
<div id="az" style="display:grid;grid-template-columns:repeat(9,min(40px,9vw));gap:6px;max-width:500px;margin-top:16px"></div>
<div style="margin-top:16px"><button onclick="reset()" ontouchstart="reset();event.preventDefault()" style="padding:12px 32px;background:var(--card-border);color:#000;border:none;border-radius:10px;font-weight:900;font-size:16px;cursor:pointer">Nouvelle partie</button></div>
<div class="overlay" id="overlay"><h2 id="overTitle">Gagné !</h2><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var WORDS=['MAISON','CHAT','CHIEN','SOLEIL','ARBRE','LIVRE','VOITURE','POMME','FLEUR','TABLE'];
var word,found,lives,over;
function init(){word=WORDS[Math.floor(Math.random()*WORDS.length)];found=[];lives=6;over=false;document.getElementById('lives').textContent='6';document.getElementById('overlay').classList.remove('show');render();}
function render(){var w=word.split('').map(function(l){return found.indexOf(l)>=0?l:'_';}).join(' ');document.getElementById('word').textContent=w;var az=document.getElementById('az');var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';az.innerHTML='';for(var i=0;i<26;i++){var l=String.fromCharCode(65+i);var b=document.createElement('button');var used=found.indexOf(l)>=0;b.style.cssText='width:100%;aspect-ratio:1;background:'+(used?'#666':ACC)+';color:'+(used?'#fff':'#000')+';border:none;border-radius:8px;font-weight:900;font-size:clamp(14px,3vw,18px);cursor:pointer;touch-action:manipulation';b.textContent=l;if(used)b.disabled=true;b.onclick=function(ll){return function(){try_(ll);};}(l);b.ontouchstart=function(e,ll){return function(ev){ev.preventDefault();try_(ll);};}(e,l);az.appendChild(b);}}
function try_(l){if(over||found.indexOf(l)>=0)return;found.push(l);if(word.indexOf(l)<0){lives--;document.getElementById('lives').textContent=lives;if(lives<=0){over=true;document.getElementById('overTitle').textContent='😢 Perdu ! Le mot était : '+word;document.getElementById('overlay').classList.add('show');return;}}render();if(word.split('').every(function(c){return found.indexOf(c)>=0;})){over=true;document.getElementById('overTitle').textContent='🎉 Gagné !';document.getElementById('overlay').classList.add('show');}}
function reset(){init();}
window.reset=reset;
init();
`, "pendu");
}

// ═══ 19. PUISSANCE 4 ═══
function puissance4(): string {
  return wrap("Puissance 4", `
<h1>🔴 <span>Puissance 4</span></h1>
<div class="stats"><span id="turn">À toi !</span></div>
<div id="board" style="display:grid;grid-template-columns:repeat(7,min(50px,12vw));gap:6px;background:#1a1a1a;padding:12px;border-radius:12px;border:2px solid var(--card-border)"></div>
<div style="margin-top:16px"><button onclick="reset()" ontouchstart="reset();event.preventDefault()" style="padding:12px 32px;background:var(--card-border);color:#000;border:none;border-radius:10px;font-weight:900;font-size:16px;cursor:pointer">Nouvelle partie</button></div>
<div class="overlay" id="overlay"><h2 id="overTitle">Gagné !</h2><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var ROWS=6,COLS=7,grid,over,waiting;
function init(){grid=[];for(var y=0;y<ROWS;y++){grid[y]=[];for(var x=0;x<COLS;x++)grid[y][x]=0;}over=false;waiting=false;document.getElementById('turn').textContent='À toi !';document.getElementById('overlay').classList.remove('show');render();}
function render(){var b=document.getElementById('board');b.innerHTML='';var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';for(var y=0;y<ROWS;y++)for(var x=0;x<COLS;x++){var c=document.createElement('div');c.style.cssText='width:100%;aspect-ratio:1;background:'+(grid[y][x]===1?'#ef4444':grid[y][x]===2?ACC:'#2a2a2a')+';border-radius:50%;cursor:pointer;transition:background .2s';c.onclick=function(xx){return function(){drop(xx);};}(x);c.ontouchstart=function(e,xx){return function(ev){ev.preventDefault();drop(xx);};}(e,x);b.appendChild(c);}}
function drop(x){if(over||waiting)return;for(var y=ROWS-1;y>=0;y--){if(grid[y][x]===0){grid[y][x]=1;break;}}render();if(chk(1))return end('🎉 Tu gagnes !');if(full())return end('Match nul');waiting=true;document.getElementById('turn').textContent='IA réfléchit...';setTimeout(ai,500);}
function ai(){var best=-1,bs=-Infinity;for(var x=0;x<COLS;x++){for(var y=ROWS-1;y>=0;y--){if(grid[y][x]===0){var s=evalMove(y,x,2)+Math.random();if(s>bs){bs=s;best=x;}break;}}}if(best>=0)for(var y=ROWS-1;y>=0;y--){if(grid[y][best]===0){grid[y][best]=2;break;}}render();if(chk(2))return end('😢 IA gagne');if(full())return end('Match nul');waiting=false;document.getElementById('turn').textContent='À toi !';}
function evalMove(y,x,p){var s=0;var dirs=[[0,1],[1,0],[1,1],[1,-1]];for(var d=0;d<4;d++){var cnt=1;for(var dir=1;dir<=3;dir++){var ny=y+dirs[d][0]*dir,nx=x+dirs[d][1]*dir;if(ny<0||ny>=ROWS||nx<0||nx>=COLS||grid[ny][nx]!==p)break;cnt++;}for(var dir=1;dir<=3;dir++){var ny=y-dirs[d][0]*dir,nx=x-dirs[d][1]*dir;if(ny<0||ny>=ROWS||nx<0||nx>=COLS||grid[ny][nx]!==p)break;cnt++;}if(cnt>=4)s+=1000;else if(cnt===3)s+=100;else if(cnt===2)s+=10;}return s;}
function chk(p){for(var y=0;y<ROWS;y++)for(var x=0;x<COLS;x++){if(grid[y][x]!==p)continue;if(x<=COLS-4&&grid[y][x+1]===p&&grid[y][x+2]===p&&grid[y][x+3]===p)return true;if(y<=ROWS-4&&grid[y+1][x]===p&&grid[y+2][x]===p&&grid[y+3][x]===p)return true;if(x<=COLS-4&&y<=ROWS-4&&grid[y+1][x+1]===p&&grid[y+2][x+2]===p&&grid[y+3][x+3]===p)return true;if(x>=3&&y<=ROWS-4&&grid[y+1][x-1]===p&&grid[y+2][x-2]===p&&grid[y+3][x-3]===p)return true;}return false;}
function full(){for(var y=0;y<ROWS;y++)for(var x=0;x<COLS;x++)if(grid[y][x]===0)return false;return true;}
function end(msg){over=true;document.getElementById('overTitle').textContent=msg;document.getElementById('overlay').classList.add('show');}
function reset(){init();}
window.reset=reset;
init();
`, "connect4");
}

// ═══ 20. TAQUIN ═══
function taquin(): string {
  return wrap("Taquin", `
<h1>🔢 <span>Taquin</span></h1>
<div class="stats"><span>Coups : <strong id="moves">0</strong></span></div>
<div id="board" style="display:grid;grid-template-columns:repeat(4,min(70px,20vw));gap:6px;background:#1a1a1a;padding:12px;border-radius:12px;border:2px solid var(--card-border)"></div>
<div style="margin-top:16px"><button onclick="reset()" ontouchstart="reset();event.preventDefault()" style="padding:12px 32px;background:var(--card-border);color:#000;border:none;border-radius:10px;font-weight:900;font-size:16px;cursor:pointer">Nouvelle partie</button></div>
<div class="overlay" id="overlay"><h2>🎉 Gagné !</h2><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var N=4,tiles,moves;
function init(){tiles=[];for(var i=1;i<=N*N-1;i++)tiles.push(i);tiles.push(0);for(var i=0;i<200;i++){var blank=tiles.indexOf(0);var r=Math.floor(blank/N),c=blank%N;var dirs=[[0,1],[1,0],[0,-1],[-1,0]];var opts=dirs.map(function(d){return {r:r+d[0],c:c+d[1]};}).filter(function(p){return p.r>=0&&p.r<N&&p.c>=0&&p.c<N;});var p=opts[Math.floor(Math.random()*opts.length)];var idx=p.r*N+p.c;tiles[blank]=tiles[idx];tiles[idx]=0;}moves=0;document.getElementById('moves').textContent='0';document.getElementById('overlay').classList.remove('show');render();}
function render(){var b=document.getElementById('board');b.innerHTML='';var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';tiles.forEach(function(v,i){var c=document.createElement('div');c.style.cssText='width:100%;aspect-ratio:1;background:'+(v===0?'#1a1a1a':ACC)+';color:#000;border-radius:10px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:clamp(20px,5vw,32px);cursor:pointer;transition:all .15s';c.textContent=v||'';c.onclick=function(){click(i);};c.ontouchstart=function(e){e.preventDefault();click(i);};b.appendChild(c);});}
function click(i){var blank=tiles.indexOf(0);var r1=Math.floor(i/N),c1=i%N;var r2=Math.floor(blank/N),c2=blank%N;if(Math.abs(r1-r2)+Math.abs(c1-c2)!==1)return;tiles[blank]=tiles[i];tiles[i]=0;moves++;document.getElementById('moves').textContent=moves;render();if(win()){setTimeout(function(){document.getElementById('overlay').classList.add('show');},200);}}
function win(){for(var i=0;i<N*N-1;i++)if(tiles[i]!==i+1)return false;return true;}
function reset(){init();}
window.reset=reset;
init();
`, "sliding");
}

// ═══ EXPORT ═══
export function getGameTemplate(gameId: string): string | null {
  // 1. Essaie d'abord les 20 jeux originaux
  switch (gameId) {
    case "snake": return snake();
    case "2048": return g2048();
    case "morpion": return morpion();
    case "memory": return memory();
    case "pong": return pong();
    case "flappy": return flappy();
    case "breakout": return brick();
    case "space-invaders": return invaders();
    case "minesweeper": return demineur();
    case "sudoku": return sudoku();
    case "simon": return simon();
    case "tetris": return tetris();
    case "doodle-jump": return doodle();
    case "asteroids": return asteroids();
    case "match3": return match3();
    case "trivia": return quiz();
    case "mastermind": return mastermind();
    case "pendu": return pendu();
    case "connect4": return puissance4();
    case "sliding": return taquin();
    default: break;
  }

  // 2. Sinon, cherche dans les 80 jeux supplémentaires
  const { getExtraGameTemplate } = require("./gameTemplatesExtra");
  return getExtraGameTemplate(gameId);
}