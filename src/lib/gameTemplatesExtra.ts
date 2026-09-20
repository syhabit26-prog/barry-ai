// src/lib/gameTemplatesExtra.ts
// ⭐ 80 JEUX SUPPLÉMENTAIRES COMPLETS

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
];

function pickPalette(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return PALETTES[Math.abs(h) % PALETTES.length];
}

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

function wrap(title: string, body: string, script: string, gameId: string): string {
  const pal = pickPalette(gameId);
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"><title>${title}</title><style>${getCSS(pal)}</style></head><body>${body}<script>${script}</script></body></html>`;
}

// ═══════════════════════════════════════════════════════════════
// PAQUET 1 : ARCADE CLASSIQUES
// ═══════════════════════════════════════════════════════════════

function pacman(): string {
  return wrap("Pac-Man", `
<h1>🟡 <span>Pac-Man</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Vies : <strong id="lives">3</strong></span></div>
<canvas id="game" width="440" height="440"></canvas>
<div class="controls">
<button ontouchstart="move('left');event.preventDefault()" onclick="move('left')">←</button>
<button ontouchstart="move('up');event.preventDefault()" onclick="move('up')">↑</button>
<button ontouchstart="move('down');event.preventDefault()" onclick="move('down')">↓</button>
<button ontouchstart="move('right');event.preventDefault()" onclick="move('right')">→</button>
</div>
<div class="overlay" id="overlay"><h2>Game Over</h2><p>Score : <strong id="finalScore">0</strong></p><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var c=document.getElementById('game'),x=c.getContext('2d');
var TILE=40,COLS=11,ROWS=11;
var maze=[
[1,1,1,1,1,1,1,1,1,1,1],
[1,0,0,0,1,0,0,0,0,0,1],
[1,0,1,0,1,0,1,1,1,0,1],
[1,0,1,0,0,0,0,0,0,0,1],
[1,0,1,1,1,0,1,1,1,0,1],
[1,0,0,0,0,0,1,0,0,0,1],
[1,0,1,1,1,0,1,0,1,0,1],
[1,0,1,0,0,0,0,0,1,0,1],
[1,0,1,0,1,1,1,0,1,0,1],
[1,0,0,0,1,0,0,0,0,0,1],
[1,1,1,1,1,1,1,1,1,1,1]
];
var pac,ghost,dir,nd,score,lives,over,loop,pellets;
function init(){pac={x:5,y:5};ghost={x:5,y:5,dx:1};dir={x:0,y:0};nd={x:0,y:0};score=0;lives=3;over=false;pellets=0;for(var y=0;y<ROWS;y++)for(var x=0;x<COLS;x++)if(maze[y][x]===0)pellets++;document.getElementById('score').textContent='0';document.getElementById('lives').textContent='3';document.getElementById('overlay').classList.remove('show');}
function move(d){if(over)return;if(d==='left')nd={x:-1,y:0};if(d==='right')nd={x:1,y:0};if(d==='up')nd={x:0,y:-1};if(d==='down')nd={x:0,y:1};}
window.move=move;
function upd(){if(over)return;var nx=pac.x+nd.x,ny=pac.y+nd.y;if(maze[ny]&&maze[ny][nx]===0){dir=nd;pac.x=nx;pac.y=ny;maze[ny][nx]=2;score+=10;pellets--;document.getElementById('score').textContent=score;if(pellets===0){over=true;document.getElementById('finalScore').textContent=score;document.getElementById('overlay').classList.add('show');}}var gx=ghost.x+ghost.dx,gy=ghost.y;if(maze[gy]&&maze[gy][gx]===0){ghost.x=gx;}else{ghost.dx=-ghost.dx;}if(ghost.x===pac.x&&ghost.y===pac.y){lives--;document.getElementById('lives').textContent=lives;pac={x:5,y:5};ghost={x:5,y:5,dx:1};if(lives<=0){over=true;document.getElementById('finalScore').textContent=score;document.getElementById('overlay').classList.add('show');}}}
function draw(){var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';x.fillStyle='#000';x.fillRect(0,0,c.width,c.height);for(var y=0;y<ROWS;y++)for(var xx=0;xx<COLS;xx++){if(maze[y][xx]===1){x.fillStyle='#1e3a8a';x.fillRect(xx*TILE,y*TILE,TILE,TILE);}else if(maze[y][xx]===0){x.fillStyle='#fbbf24';x.beginPath();x.arc(xx*TILE+TILE/2,y*TILE+TILE/2,3,0,Math.PI*2);x.fill();}}x.fillStyle=ACC;x.beginPath();x.arc(pac.x*TILE+TILE/2,pac.y*TILE+TILE/2,TILE/2-4,0,Math.PI*2);x.fill();x.fillStyle='#ef4444';x.beginPath();x.arc(ghost.x*TILE+TILE/2,ghost.y*TILE+TILE/2,TILE/2-4,0,Math.PI*2);x.fill();}
function tick(){upd();draw();}
function reset(){init();if(loop)clearInterval(loop);loop=setInterval(tick,200);}
window.reset=reset;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft'){move('left');e.preventDefault();}if(e.key==='ArrowRight'){move('right');e.preventDefault();}if(e.key==='ArrowUp'){move('up');e.preventDefault();}if(e.key==='ArrowDown'){move('down');e.preventDefault();}});
var tsx=0,tsy=0;
c.addEventListener('touchstart',function(e){e.preventDefault();tsx=e.touches[0].clientX;tsy=e.touches[0].clientY;},{passive:false});
c.addEventListener('touchend',function(e){e.preventDefault();var dx=e.changedTouches[0].clientX-tsx,dy=e.changedTouches[0].clientY-tsy;if(Math.abs(dx)<20&&Math.abs(dy)<20)return;if(Math.abs(dx)>Math.abs(dy))move(dx>0?'right':'left');else move(dy>0?'down':'up');},{passive:false});
reset();
`, "pacman");
}

function galaga(): string {
  return wrap("Galaga", `
<h1>🚀 <span>Galaga</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Vies : <strong id="lives">3</strong></span></div>
<canvas id="game" width="480" height="500"></canvas>
<div class="controls">
<button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button>
<button ontouchstart="sh();event.preventDefault()" onclick="sh()">🔥</button>
<button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button>
</div>
<div class="overlay" id="overlay"><h2 id="overTitle">Game Over</h2><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var c=document.getElementById('game'),x=c.getContext('2d'),W=c.width,H=c.height;
var pl,bullets,aliens,ad,score,lives,over,loop,wave;
function init(){pl={x:W/2-15,y:H-40,w:30,h:20};bullets=[];aliens=[];for(var r=0;r<4;r++)for(var col=0;col<7;col++)aliens.push({x:col*60+40,y:r*40+50,w:35,h:25,alive:true});ad=1;score=0;lives=3;over=false;wave=1;document.getElementById('score').textContent='0';document.getElementById('lives').textContent='3';document.getElementById('overlay').classList.remove('show');}
function mv(d){pl.x+=d*25;pl.x=Math.max(0,Math.min(W-pl.w,pl.x));}
window.mv=mv;
function sh(){if(over)return;if(bullets.length<3)bullets.push({x:pl.x+pl.w/2,y:pl.y,dy:-10});}
window.sh=sh;
function upd(){bullets.forEach(function(b){b.y+=b.dy;});bullets=bullets.filter(function(b){return b.y>0;});var hw=false;var alive=0;aliens.forEach(function(a){if(!a.alive)return;alive++;a.x+=ad*0.8;if(a.x<10||a.x+a.w>W-10)hw=true;});if(hw){ad*=-1;aliens.forEach(function(a){a.y+=25;});}bullets.forEach(function(b){aliens.forEach(function(a){if(!a.alive)return;if(b.x>a.x&&b.x<a.x+a.w&&b.y>a.y&&b.y<a.y+a.h){a.alive=false;b.y=-100;score+=20;document.getElementById('score').textContent=score;}});});bullets=bullets.filter(function(b){return b.y>0;});if(alive===0){wave++;aliens=[];for(var r=0;r<4;r++)for(var col=0;col<7;col++)aliens.push({x:col*60+40,y:r*40+50,w:35,h:25,alive:true});ad=ad>0?1:-1;}var lowest=0;aliens.forEach(function(a){if(a.alive&&a.y>lowest)lowest=a.y;});if(lowest>H-60){lives--;document.getElementById('lives').textContent=lives;if(lives<=0)return end(false);aliens.forEach(function(a){a.y-=40;});}}
function end(w){over=true;document.getElementById('overTitle').textContent=w?'Victoire':'Game Over';document.getElementById('overlay').classList.add('show');}
function draw(){var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';x.fillStyle='#000';x.fillRect(0,0,W,H);x.fillStyle=ACC;x.beginPath();x.moveTo(pl.x+pl.w/2,pl.y);x.lineTo(pl.x,pl.y+pl.h);x.lineTo(pl.x+pl.w,pl.y+pl.h);x.closePath();x.fill();x.fillStyle='#fbbf24';bullets.forEach(function(b){x.fillRect(b.x-1,b.y,3,8);});aliens.forEach(function(a){if(a.alive){x.fillStyle='#22c55e';x.fillRect(a.x,a.y,a.w,a.h);}});}
function tick(){if(!over)upd();draw();}
function reset(){init();if(loop)clearInterval(loop);loop=setInterval(tick,20);}
window.reset=reset;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft'){pl.x-=25;e.preventDefault();}if(e.key==='ArrowRight'){pl.x+=25;e.preventDefault();}if(e.key===' '){sh();e.preventDefault();}});
reset();
`, "galaga");
}

function frogger(): string {
  return wrap("Frogger", `
<h1>🐸 <span>Frogger</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Vies : <strong id="lives">3</strong></span></div>
<canvas id="game" width="480" height="480"></canvas>
<div class="controls">
<button ontouchstart="move('left');event.preventDefault()" onclick="move('left')">←</button>
<button ontouchstart="move('up');event.preventDefault()" onclick="move('up')">↑</button>
<button ontouchstart="move('down');event.preventDefault()" onclick="move('down')">↓</button>
<button ontouchstart="move('right');event.preventDefault()" onclick="move('right')">→</button>
</div>
<div class="overlay" id="overlay"><h2>Game Over</h2><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var c=document.getElementById('game'),x=c.getContext('2d'),W=c.width,H=c.height;
var frog,cars,score,lives,over,loop;
var ROW=40;
function init(){frog={x:W/2-15,y:H-40,w:30,h:30};cars=[];for(var i=0;i<4;i++){cars.push({x:Math.random()*W,y:H-120-i*60,w:60,h:30,dx:(i%2===0?3:-3),color:'#ef4444'});}for(var i=0;i<3;i++){cars.push({x:Math.random()*W,y:H-320-i*60,w:70,h:30,dx:(i%2===0?-2.5:2.5),color:'#3b82f6'});}score=0;lives=3;over=false;document.getElementById('score').textContent='0';document.getElementById('lives').textContent='3';document.getElementById('overlay').classList.remove('show');}
function move(d){if(over)return;if(d==='left')frog.x-=30;if(d==='right')frog.x+=30;if(d==='up')frog.y-=ROW;if(d==='down')frog.y+=ROW;frog.x=Math.max(0,Math.min(W-frog.w,frog.x));if(frog.y<0){score+=50;document.getElementById('score').textContent=score;frog.y=H-40;frog.x=W/2-15;}}
window.move=move;
function upd(){cars.forEach(function(car){car.x+=car.dx;if(car.x>W)car.x=-car.w;if(car.x+car.w<0)car.x=W;if(frog.x<car.x+car.w&&frog.x+frog.w>car.x&&frog.y<car.y+car.h&&frog.y+frog.h>car.y){lives--;document.getElementById('lives').textContent=lives;frog.y=H-40;frog.x=W/2-15;if(lives<=0){over=true;document.getElementById('overlay').classList.add('show');}}});}
function draw(){var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';x.fillStyle='#0a0a0a';x.fillRect(0,0,W,H);cars.forEach(function(car){x.fillStyle=car.color;x.fillRect(car.x,car.y,car.w,car.h);});x.fillStyle=ACC;x.beginPath();x.arc(frog.x+frog.w/2,frog.y+frog.h/2,frog.w/2-3,0,Math.PI*2);x.fill();}
function tick(){if(!over)upd();draw();}
function reset(){init();if(loop)clearInterval(loop);loop=setInterval(tick,30);}
window.reset=reset;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft'){move('left');e.preventDefault();}if(e.key==='ArrowRight'){move('right');e.preventDefault();}if(e.key==='ArrowUp'){move('up');e.preventDefault();}if(e.key==='ArrowDown'){move('down');e.preventDefault();}});
reset();
`, "frogger");
}

function centipede(): string {
  return wrap("Centipede", `
<h1>🐛 <span>Centipede</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Vies : <strong id="lives">3</strong></span></div>
<canvas id="game" width="480" height="500"></canvas>
<div class="controls">
<button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button>
<button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button>
</div>
<div class="overlay" id="overlay"><h2>Game Over</h2><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var c=document.getElementById('game'),x=c.getContext('2d'),W=c.width,H=c.height;
var ship,cents,bullets,score,lives,over,loop;
function init(){ship={x:W/2,y:H-30,w:30,h:20};cents=[];for(var i=0;i<10;i++)cents.push({x:W-i*40-40,y:40,w:30,h:30,alive:true,dx:1});bullets=[];score=0;lives=3;over=false;document.getElementById('score').textContent='0';document.getElementById('lives').textContent='3';document.getElementById('overlay').classList.remove('show');}
function mv(d){ship.x+=d*25;ship.x=Math.max(0,Math.min(W-ship.w,ship.x));}
window.mv=mv;
function sh(){if(over)return;bullets.push({x:ship.x+ship.w/2,y:ship.y,dy:-8});}
function upd(){bullets.forEach(function(b){b.y+=b.dy;});bullets=bullets.filter(function(b){return b.y>0;});var hw=false;cents.forEach(function(a){if(!a.alive)return;a.x+=a.dx*2;if(a.x<0||a.x>W-a.w){hw=true;}});if(hw){cents.forEach(function(a){a.dx*=-1;a.y+=30;});}bullets.forEach(function(b){cents.forEach(function(a){if(!a.alive)return;if(b.x>a.x&&b.x<a.x+a.w&&b.y>a.y&&b.y<a.y+a.h){a.alive=false;b.y=-100;score+=15;document.getElementById('score').textContent=score;}});});bullets=bullets.filter(function(b){return b.y>0;});if(cents.every(function(a){return !a.alive;})){init();score+=100;document.getElementById('score').textContent=score;}cents.forEach(function(a){if(a.alive&&a.y>H-60){lives--;document.getElementById('lives').textContent=lives;a.y-=100;if(lives<=0){over=true;document.getElementById('overlay').classList.add('show');}}});}
function draw(){var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';x.fillStyle='#000';x.fillRect(0,0,W,H);x.fillStyle=ACC;x.fillRect(ship.x,ship.y,ship.w,ship.h);x.fillStyle='#fbbf24';bullets.forEach(function(b){x.fillRect(b.x-1,b.y,3,8);});cents.forEach(function(a){if(a.alive){x.fillStyle='#22c55e';x.beginPath();x.arc(a.x+a.w/2,a.y+a.h/2,a.w/2-3,0,Math.PI*2);x.fill();}});}
function tick(){if(!over)upd();draw();}
function reset(){init();if(loop)clearInterval(loop);loop=setInterval(tick,40);}
window.reset=reset;
setInterval(function(){if(!over&&ship)sh();},500);
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft'){mv(-1);e.preventDefault();}if(e.key==='ArrowRight'){mv(1);e.preventDefault();}});
reset();
`, "centipede");
}

function missile(): string {
  return wrap("Missile Command", `
<h1>🚀 <span>Missile Command</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Vies : <strong id="lives">3</strong></span></div>
<canvas id="game" width="500" height="500"></canvas>
<div style="margin-top:16px;opacity:.6;font-size:12px">Clique / Tape pour intercepter les missiles</div>
<div class="overlay" id="overlay"><h2>Game Over</h2><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var c=document.getElementById('game'),x=c.getContext('2d'),W=c.width,H=c.height;
var cities,missiles,explosions,score,lives,over,loop,spawnT;
function init(){cities=[{x:60,alive:true},{x:140,alive:true},{x:W-140,alive:true},{x:W-60,alive:true}];missiles=[];explosions=[];score=0;lives=3;over=false;document.getElementById('score').textContent='0';document.getElementById('lives').textContent='3';document.getElementById('overlay').classList.remove('show');spawnT=0;}
function spawn(){var tx=cities[Math.floor(Math.random()*cities.length)].x;missiles.push({x:Math.random()*W,y:0,tx:tx,speed:1.5+Math.random()*1.5});}
function click(e){if(over)return;var rect=c.getBoundingClientRect();var mx,my;if(e.touches){mx=(e.touches[0].clientX-rect.left)*(W/rect.width);my=(e.touches[0].clientY-rect.top)*(H/rect.height);}else{mx=(e.clientX-rect.left)*(W/rect.width);my=(e.clientY-rect.top)*(H/rect.height);}explosions.push({x:mx,y:my,r:0,life:30});}
function upd(){spawnT++;if(spawnT>60){spawnT=0;spawn();}missiles.forEach(function(m){m.y+=m.speed*3;if(m.y>H-40){m.hit=true;var closest=null;var minD=999;cities.forEach(function(city){if(!city.alive)return;var d=Math.abs(city.x-m.x);if(d<minD){minD=d;closest=city;}});if(closest&&minD<60){closest.alive=false;lives--;document.getElementById('lives').textContent=lives;if(lives<=0){over=true;document.getElementById('overlay').classList.add('show');}}}});missiles=missiles.filter(function(m){return !m.hit&&m.y<H;});explosions.forEach(function(e){e.r+=4;e.life--;});explosions=explosions.filter(function(e){return e.life>0;});explosions.forEach(function(ex){missiles.forEach(function(m){var dx=ex.x-m.x,dy=ex.y-m.y;if(dx*dx+dy*dy<ex.r*ex.r){m.hit=true;score+=20;document.getElementById('score').textContent=score;}});});missiles=missiles.filter(function(m){return !m.hit;});}
function draw(){var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';x.fillStyle='#000';x.fillRect(0,0,W,H);cities.forEach(function(city){x.fillStyle=city.alive?'#22c55e':'#444';x.fillRect(city.x-20,H-40,40,40);});missiles.forEach(function(m){x.fillStyle='#ef4444';x.beginPath();x.arc(m.x,m.y,4,0,Math.PI*2);x.fill();});explosions.forEach(function(ex){x.strokeStyle=ACC;x.lineWidth=3;x.beginPath();x.arc(ex.x,ex.y,ex.r,0,Math.PI*2);x.stroke();});}
function tick(){if(!over)upd();draw();}
function reset(){init();if(loop)clearInterval(loop);loop=setInterval(tick,30);}
window.reset=reset;
c.addEventListener('click',click);
c.addEventListener('touchstart',function(e){e.preventDefault();click(e);},{passive:false});
reset();
`, "missile");
}

function defender(): string {
  return wrap("Defender", `
<h1>🛸 <span>Defender</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Vies : <strong id="lives">3</strong></span></div>
<canvas id="game" width="600" height="400" style="width:min(600px,90vw)"></canvas>
<div class="controls">
<button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button>
<button ontouchstart="sh();event.preventDefault()" onclick="sh()">🔥</button>
<button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button>
</div>
<div class="overlay" id="overlay"><h2>Game Over</h2><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var c=document.getElementById('game'),x=c.getContext('2d'),W=c.width,H=c.height;
var ship,enemies,bullets,stars,score,lives,over,loop,dir;
function init(){ship={x:W/2,y:H/2,w:40,h:20};enemies=[];for(var i=0;i<5;i++)enemies.push({x:W+i*100,y:100+Math.random()*200,w:35,h:25,alive:true,dx:-2});bullets=[];stars=[];for(var i=0;i<50;i++)stars.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*2});score=0;lives=3;over=false;dir=0;document.getElementById('score').textContent='0';document.getElementById('lives').textContent='3';document.getElementById('overlay').classList.remove('show');}
function mv(d){dir=d;}
window.mv=mv;
function sh(){if(over)return;bullets.push({x:ship.x+ship.w/2,y:ship.y,dx:10});}
window.sh=sh;
function upd(){if(dir!==0){ship.x+=dir*6;ship.x=Math.max(0,Math.min(W-ship.w,ship.x));}bullets.forEach(function(b){b.x+=b.dx;});bullets=bullets.filter(function(b){return b.x<W;});enemies.forEach(function(e){e.x+=e.dx;if(e.x<-e.w){e.x=W+e.w;}});bullets.forEach(function(b){enemies.forEach(function(e){if(!e.alive)return;if(b.x>e.x&&b.x<e.x+e.w&&b.y>e.y&&b.y<e.y+e.h){e.alive=false;b.x=W+100;score+=20;document.getElementById('score').textContent=score;}});});bullets=bullets.filter(function(b){return b.x<W;});if(enemies.every(function(e){return !e.alive;})){for(var i=0;i<5;i++)enemies.push({x:W+Math.random()*300,y:100+Math.random()*200,w:35,h:25,alive:true,dx:-2});}enemies.forEach(function(e){if(e.alive&&e.x<ship.x+ship.w&&e.x+e.w>ship.x&&e.y<ship.y+ship.h&&e.y+e.h>ship.y){lives--;document.getElementById('lives').textContent=lives;ship.x=W/2;if(lives<=0){over=true;document.getElementById('overlay').classList.add('show');}}});stars.forEach(function(s){s.x-=0.5;if(s.x<0)s.x=W;});}
function draw(){var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';x.fillStyle='#000';x.fillRect(0,0,W,H);x.fillStyle='#fff';stars.forEach(function(s){x.fillRect(s.x,s.y,s.r,s.r);});x.fillStyle=ACC;x.beginPath();x.moveTo(ship.x+ship.w/2,ship.y);x.lineTo(ship.x,ship.y+ship.h);x.lineTo(ship.x+ship.w,ship.y+ship.h);x.closePath();x.fill();x.fillStyle='#fbbf24';bullets.forEach(function(b){x.fillRect(b.x,b.y-2,8,4);});enemies.forEach(function(e){if(e.alive){x.fillStyle='#22c55e';x.fillRect(e.x,e.y,e.w,e.h);}});}
function tick(){if(!over)upd();draw();}
function reset(){init();if(loop)clearInterval(loop);loop=setInterval(tick,20);}
window.reset=reset;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft'){mv(-1);e.preventDefault();}if(e.key==='ArrowRight'){mv(1);e.preventDefault();}if(e.key===' '){sh();e.preventDefault();}});
reset();
`, "defender");
}

function digdug(): string {
  return wrap("Dig Dug", `
<h1>⛏️ <span>Dig Dug</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Vies : <strong id="lives">3</strong></span></div>
<canvas id="game" width="480" height="480"></canvas>
<div class="controls">
<button ontouchstart="move('left');event.preventDefault()" onclick="move('left')">←</button>
<button ontouchstart="move('up');event.preventDefault()" onclick="move('up')">↑</button>
<button ontouchstart="move('down');event.preventDefault()" onclick="move('down')">↓</button>
<button ontouchstart="move('right');event.preventDefault()" onclick="move('right')">→</button>
</div>
<div class="overlay" id="overlay"><h2>Game Over</h2><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var c=document.getElementById('game'),x=c.getContext('2d'),W=c.width,H=c.height;
var player,enemies,score,lives,over,loop,GRID=40;
function init(){player={x:GRID*2,y:GRID*2,w:30,h:30};enemies=[];for(var i=0;i<4;i++)enemies.push({x:GRID*(3+i*2),y:GRID*5,w:30,h:30,alive:true,moved:0});score=0;lives=3;over=false;document.getElementById('score').textContent='0';document.getElementById('lives').textContent='3';document.getElementById('overlay').classList.remove('show');}
function move(d){if(over)return;if(d==='left')player.x-=GRID;if(d==='right')player.x+=GRID;if(d==='up')player.y-=GRID;if(d==='down')player.y+=GRID;player.x=Math.max(0,Math.min(W-player.w,player.x));player.y=Math.max(0,Math.min(H-player.h,player.y));enemies.forEach(function(e){if(!e.alive)return;if(Math.abs(e.x-player.x)<20&&Math.abs(e.y-player.y)<20){e.alive=false;score+=100;document.getElementById('score').textContent=score;}});}
window.move=move;
function upd(){enemies.forEach(function(e){if(!e.alive)return;e.moved++;if(e.moved%20===0){if(e.x<player.x)e.x+=GRID;else if(e.x>player.x)e.x-=GRID;else if(e.y<player.y)e.y+=GRID;else if(e.y>player.y)e.y-=GRID;}if(Math.abs(e.x-player.x)<20&&Math.abs(e.y-player.y)<20){lives--;document.getElementById('lives').textContent=lives;player.x=GRID*2;player.y=GRID*2;if(lives<=0){over=true;document.getElementById('overlay').classList.add('show');}}});if(enemies.every(function(e){return !e.alive;})){for(var i=0;i<4;i++)enemies.push({x:GRID*(3+i*2),y:GRID*5,w:30,h:30,alive:true,moved:0});}}
function draw(){var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';x.fillStyle='#0a0a0a';x.fillRect(0,0,W,H);x.fillStyle=ACC;x.fillRect(player.x,player.y,player.w,player.h);enemies.forEach(function(e){if(e.alive){x.fillStyle='#ef4444';x.beginPath();x.arc(e.x+e.w/2,e.y+e.h/2,e.w/2-3,0,Math.PI*2);x.fill();}});}
function tick(){if(!over)upd();draw();}
function reset(){init();if(loop)clearInterval(loop);loop=setInterval(tick,50);}
window.reset=reset;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft'){move('left');e.preventDefault();}if(e.key==='ArrowRight'){move('right');e.preventDefault();}if(e.key==='ArrowUp'){move('up');e.preventDefault();}if(e.key==='ArrowDown'){move('down');e.preventDefault();}});
reset();
`, "digdug");
}

function qbert(): string {
  return wrap("Q*bert", `
<h1>🎲 <span>Q*bert</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Vies : <strong id="lives">3</strong></span></div>
<canvas id="game" width="480" height="480"></canvas>
<div class="controls">
<button ontouchstart="hop(0);event.preventDefault()" onclick="hop(0)">↖</button>
<button ontouchstart="hop(1);event.preventDefault()" onclick="hop(1)">↗</button>
<button ontouchstart="hop(2);event.preventDefault()" onclick="hop(2)">↙</button>
<button ontouchstart="hop(3);event.preventDefault()" onclick="hop(3)">↘</button>
</div>
<div class="overlay" id="overlay"><h2>Victoire !</h2><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var c=document.getElementById('game'),x=c.getContext('2d'),W=c.width,H=c.height;
var qb,cubes,score,lives,over,loop;
function init(){qb={row:0,col:0};cubes=[];for(var r=0;r<6;r++){cubes[r]=[];for(var col=0;col<=r;col++)cubes[r][col]={on:false};}score=0;lives=3;over=false;document.getElementById('score').textContent='0';document.getElementById('lives').textContent='3';document.getElementById('overlay').classList.remove('show');}
function hop(d){if(over)return;var nr=qb.row,nc=qb.col;if(d===0){nr++;}else if(d===1){nr++;nc++;}else if(d===2){nr--;}else if(d===3){nr--;nc--;}if(nr<0||nr>5||nc<0||nc>nr)return;qb.row=nr;qb.col=nc;cubes[nr][nc].on=true;score+=10;document.getElementById('score').textContent=score;var allOn=true;for(var r=0;r<6;r++)for(var cc=0;cc<=r;cc++)if(!cubes[r][cc].on)allOn=false;if(allOn){over=true;document.getElementById('overlay').classList.add('show');}}
window.hop=hop;
function draw(){var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';x.fillStyle='#000';x.fillRect(0,0,W,H);var cs=35;var topX=W/2;var startY=80;for(var r=0;r<6;r++){for(var col=0;col<=r;col++){var cx=topX-col*cs;var cy=startY+r*cs*0.8;x.fillStyle=cubes[r][col].on?ACC:'#333';x.beginPath();x.moveTo(cx,cy);x.lineTo(cx+cs,cy);x.lineTo(cx+cs,cy+cs);x.lineTo(cx,cy+cs);x.closePath();x.fill();}}var qx=topX-qb.col*cs;var qy=startY+qb.row*cs*0.8;x.fillStyle='#ef4444';x.beginPath();x.arc(qx+15,qy+15,15,0,Math.PI*2);x.fill();}
function tick(){draw();}
function reset(){init();if(loop)clearInterval(loop);loop=setInterval(tick,50);}
window.reset=reset;
reset();
`, "qbert");
}

function joust(): string {
  return wrap("Joust", `
<h1>🦅 <span>Joust</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Vies : <strong id="lives">3</strong></span></div>
<canvas id="game" width="500" height="400" style="width:min(500px,90vw)"></canvas>
<div class="controls">
<button ontouchstart="act('left');event.preventDefault()" onclick="act('left')">←</button>
<button ontouchstart="act('flap');event.preventDefault()" onclick="act('flap')">🦅</button>
<button ontouchstart="act('right');event.preventDefault()" onclick="act('right')">→</button>
</div>
<div class="overlay" id="overlay"><h2>Game Over</h2><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var c=document.getElementById('game'),x=c.getContext('2d'),W=c.width,H=c.height;
var player,enemies,score,lives,over,loop,vy;
function init(){player={x:W/2,y:H-80,w:40,h:30,vx:0};enemies=[];for(var i=0;i<3;i++)enemies.push({x:W-i*120,y:100+Math.random()*100,w:40,h:30,alive:true,vx:1});vy=0;score=0;lives=3;over=false;document.getElementById('score').textContent='0';document.getElementById('lives').textContent='3';document.getElementById('overlay').classList.remove('show');}
function act(a){if(over)return;if(a==='left')player.vx=-4;if(a==='right')player.vx=4;if(a==='flap')vy=-8;}
window.act=act;
function upd(){vy+=0.4;player.y+=vy;player.x+=player.vx;player.vx*=0.9;if(player.y>H-player.h){player.y=H-player.h;vy=-2;}if(player.y<0){player.y=0;vy=0;}if(player.x<0)player.x=0;if(player.x+player.w>W)player.x=W-player.w;enemies.forEach(function(e){e.x+=e.vx;if(e.x<0||e.x+e.w>W)e.vx*=-1;});enemies.forEach(function(e){if(!e.alive)return;if(Math.abs(e.x-player.x)<30&&Math.abs(e.y-player.y)<30){if(vy>0){e.alive=false;score+=100;document.getElementById('score').textContent=score;vy=-10;}else{lives--;document.getElementById('lives').textContent=lives;player.x=W/2;player.y=H-80;if(lives<=0){over=true;document.getElementById('overlay').classList.add('show');}}}});if(enemies.every(function(e){return !e.alive;})){for(var i=0;i<3;i++)enemies.push({x:W-i*120,y:100+Math.random()*100,w:40,h:30,alive:true,vx:1});}}
function draw(){var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';x.fillStyle='#000';x.fillRect(0,0,W,H);x.fillStyle=ACC;x.beginPath();x.ellipse(player.x+player.w/2,player.y+player.h/2,player.w/2,player.h/2,0,0,Math.PI*2);x.fill();x.fillStyle='#ef4444';enemies.forEach(function(e){if(e.alive){x.beginPath();x.ellipse(e.x+e.w/2,e.y+e.h/2,e.w/2,e.h/2,0,0,Math.PI*2);x.fill();}});}
function tick(){if(!over)upd();draw();}
function reset(){init();if(loop)clearInterval(loop);loop=setInterval(tick,20);}
window.reset=reset;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft'){act('left');e.preventDefault();}if(e.key==='ArrowRight'){act('right');e.preventDefault();}if(e.key===' '){act('flap');e.preventDefault();}});
reset();
`, "joust");
}

function bomberman(): string {
  return wrap("Bomberman", `
<h1>💣 <span>Bomberman</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Vies : <strong id="lives">3</strong></span></div>
<canvas id="game" width="520" height="520"></canvas>
<div class="controls">
<button ontouchstart="move('left');event.preventDefault()" onclick="move('left')">←</button>
<button ontouchstart="move('up');event.preventDefault()" onclick="move('up')">↑</button>
<button ontouchstart="move('down');event.preventDefault()" onclick="move('down')">↓</button>
<button ontouchstart="move('right');event.preventDefault()" onclick="move('right')">→</button>
<button ontouchstart="dropBomb();event.preventDefault()" onclick="dropBomb()">💣</button>
</div>
<div class="overlay" id="overlay"><h2>Game Over</h2><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var c=document.getElementById('game'),x=c.getContext('2d'),W=c.width,H=c.height;
var TILE=40,COLS=13,ROWS=13;
var player,bombs,enemies,score,lives,over,loop,map;
function init(){map=[];for(var y=0;y<ROWS;y++){map[y]=[];for(var xx=0;xx<COLS;xx++){if(y%2===1&&xx%2===1)map[y][xx]=1;else map[y][xx]=0;}}player={x:1,y:1};bombs=[];enemies=[];for(var i=0;i<3;i++){var ex,ey;do{ex=Math.floor(Math.random()*COLS);ey=Math.floor(Math.random()*ROWS);}while(map[ey][ex]!==0||(ex<3&&ey<3));enemies.push({x:ex,y:ey,alive:true,moved:0});}score=0;lives=3;over=false;document.getElementById('score').textContent='0';document.getElementById('lives').textContent='3';document.getElementById('overlay').classList.remove('show');}
function move(d){if(over)return;var nx=player.x,ny=player.y;if(d==='left')nx--;if(d==='right')nx++;if(d==='up')ny--;if(d==='down')ny++;if(nx>=0&&nx<COLS&&ny>=0&&ny<ROWS&&map[ny][nx]===0){player.x=nx;player.y=ny;enemies.forEach(function(e){if(!e.alive)return;if(e.x===player.x&&e.y===player.y){e.alive=false;score+=100;document.getElementById('score').textContent=score;}});}}
window.move=move;
function dropBomb(){if(over)return;var exists=bombs.some(function(b){return b.x===player.x&&b.y===player.y;});if(!exists)bombs.push({x:player.x,y:player.y,timer:90});}
window.dropBomb=dropBomb;
function upd(){bombs.forEach(function(b){b.timer--;});var toExplode=bombs.filter(function(b){return b.timer<=0;});bombs=bombs.filter(function(b){return b.timer>0;});toExplode.forEach(function(b){for(var dy=-1;dy<=1;dy++)for(var dx=-1;dx<=1;dx++){var nx=b.x+dx,ny=b.y+dy;enemies.forEach(function(e){if(e.alive&&e.x===nx&&e.y===ny){e.alive=false;score+=50;document.getElementById('score').textContent=score;}});if(nx===player.x&&ny===player.y){lives--;document.getElementById('lives').textContent=lives;if(lives<=0){over=true;document.getElementById('overlay').classList.add('show');}}}});enemies.forEach(function(e){if(!e.alive)return;e.moved++;if(e.moved%15===0){var dirs=[[0,1],[0,-1],[1,0],[-1,0]];var d=dirs[Math.floor(Math.random()*4)];var nx=e.x+d[0],ny=e.y+d[1];if(nx>=0&&nx<COLS&&ny>=0&&ny<ROWS&&map[ny][nx]===0){e.x=nx;e.y=ny;}}if(e.x===player.x&&e.y===player.y){lives--;document.getElementById('lives').textContent=lives;if(lives<=0){over=true;document.getElementById('overlay').classList.add('show');}}});if(enemies.every(function(e){return !e.alive;})){for(var i=0;i<3;i++){var ex,ey;do{ex=Math.floor(Math.random()*COLS);ey=Math.floor(Math.random()*ROWS);}while(map[ey][ex]!==0);enemies.push({x:ex,y:ey,alive:true,moved:0});}}}
function draw(){var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';x.fillStyle='#0a0a0a';x.fillRect(0,0,W,H);for(var y=0;y<ROWS;y++)for(var xx=0;xx<COLS;xx++){if(map[y][xx]===1){x.fillStyle='#444';x.fillRect(xx*TILE,y*TILE,TILE,TILE);}}bombs.forEach(function(b){x.fillStyle=b.timer<30?'#ef4444':'#fbbf24';x.beginPath();x.arc(b.x*TILE+TILE/2,b.y*TILE+TILE/2,TILE/2-6,0,Math.PI*2);x.fill();});enemies.forEach(function(e){if(e.alive){x.fillStyle='#22c55e';x.beginPath();x.arc(e.x*TILE+TILE/2,e.y*TILE+TILE/2,TILE/2-6,0,Math.PI*2);x.fill();}});x.fillStyle=ACC;x.beginPath();x.arc(player.x*TILE+TILE/2,player.y*TILE+TILE/2,TILE/2-6,0,Math.PI*2);x.fill();}
function tick(){if(!over)upd();draw();}
function reset(){init();if(loop)clearInterval(loop);loop=setInterval(tick,30);}
window.reset=reset;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft'){move('left');e.preventDefault();}if(e.key==='ArrowRight'){move('right');e.preventDefault();}if(e.key==='ArrowUp'){move('up');e.preventDefault();}if(e.key==='ArrowDown'){move('down');e.preventDefault();}if(e.key===' '){dropBomb();e.preventDefault();}});
reset();
`, "bomberman");
}

// ═══════════════════════════════════════════════════════════════
// PAQUET 2 : CARTES & STRATÉGIE
// ═══════════════════════════════════════════════════════════════

function blackjack(): string {
  return wrap("Blackjack", `
<h1>🃏 <span>Blackjack</span></h1>
<div class="stats"><span>Toi : <strong id="ps">0</strong></span><span>Croupier : <strong id="ds">0</strong></span></div>
<div id="board" style="background:#1a1a1a;padding:20px;border-radius:12px;border:2px solid var(--card-border);min-width:400px;text-align:center"></div>
<div class="controls" style="margin-top:16px">
<button ontouchstart="hit();event.preventDefault()" onclick="hit()" style="width:100px;background:#22c55e;color:#fff">Tirer</button>
<button ontouchstart="stand();event.preventDefault()" onclick="stand()" style="width:100px;background:#facc15;color:#000">Rester</button>
</div>
<div class="overlay" id="overlay"><h2 id="overTitle">Résultat</h2><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var player,dealer,deck,over,pwins=0,dwins=0;
function drawCard(){return deck.pop();}
function value(hand){var v=0,aces=0;hand.forEach(function(c){if(c.v===11){v+=11;aces++;}else v+=c.v;});while(v>21&&aces>0){v-=10;aces--;}return v;}
function newDeck(){var d=[];['♠','♥','♦','♣'].forEach(function(s){[2,3,4,5,6,7,8,9,10,10,10,10,11].forEach(function(v){d.push({s:s,v:v});});});return d.sort(function(){return Math.random()-0.5;});}
function init(){deck=newDeck();player=[drawCard(),drawCard()];dealer=[drawCard(),drawCard()];over=false;document.getElementById('overlay').classList.remove('show');render();if(value(player)===21)stand();}
function render(){var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';var h='<div style="margin-bottom:20px"><p style="color:'+ACC+';font-weight:900;margin-bottom:8px">TES CARTES ('+value(player)+')</p><div style="font-size:40px">'+player.map(function(c){return c.s+c.v;}).join(' ')+'</div></div>';h+='<div><p style="color:#ef4444;font-weight:900;margin-bottom:8px">CROUPIER ('+(over?value(dealer):'?')+')</p><div style="font-size:40px">'+(over?dealer.map(function(c){return c.s+c.v;}).join(' '):dealer[0].s+dealer[0].v)+'</div></div>';document.getElementById('board').innerHTML=h;document.getElementById('ps').textContent=pwins;document.getElementById('ds').textContent=dwins;}
function hit(){if(over)return;player.push(drawCard());render();if(value(player)>21){end('Bust ! Perdu');}}
window.hit=hit;
function stand(){if(over)return;while(value(dealer)<17)dealer.push(drawCard());var pv=value(player),dv=value(dealer);if(dv>21||pv>dv){pwins++;end('Tu gagnes !');}else if(pv<dv){dwins++;end('Perdu');}else{end('Match nul');}}
window.stand=stand;
function end(msg){over=true;render();document.getElementById('overTitle').textContent=msg;document.getElementById('overlay').classList.add('show');}
function reset(){init();}
window.reset=reset;
init();
`, "blackjack");
}

function solitaire(): string {
  return wrap("Solitaire", `
<h1>🃏 <span>Solitaire</span></h1>
<div class="stats"><span>Coups : <strong id="moves">0</strong></span></div>
<div id="board" style="background:#1a1a1a;padding:20px;border-radius:12px;border:2px solid var(--card-border);min-width:400px"></div>
<div class="controls" style="margin-top:16px"><button ontouchstart="reset();event.preventDefault()" onclick="reset()" style="width:140px">Nouvelle partie</button></div>
<div class="overlay" id="overlay"><h2>Victoire !</h2><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var piles,moves,over;
function init(){piles=[];for(var i=0;i<4;i++)piles[i]=[];var deck=[];[1,2,3,4,5,6,7,8,9,10,11,12,13].forEach(function(v){for(var s=0;s<4;s++)deck.push({v:v,s:s});});deck.sort(function(){return Math.random()-0.5;});for(var i=0;i<4;i++)for(var j=0;j<13;j++)piles[i].push(deck.pop());moves=0;over=false;document.getElementById('moves').textContent='0';document.getElementById('overlay').classList.remove('show');render();}
function render(){var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';var h='<div style="display:flex;gap:8px;justify-content:center">';piles.forEach(function(pile,i){h+='<div style="width:80px;min-height:120px;background:#2a2a2a;border-radius:8px;padding:4px;cursor:pointer" onclick="clickPile('+i+')">';if(pile.length>0){var c=pile[pile.length-1];h+='<div style="background:'+ACC+';color:#000;padding:8px;border-radius:6px;font-weight:900;text-align:center">'+c.v+'<br>'+['♠','♥','♦','♣'][c.s]+'</div>';}h+='<p style="color:#888;font-size:10px;text-align:center;margin-top:4px">'+pile.length+' cartes</p></div>';});h+='</div>';document.getElementById('board').innerHTML=h;}
function clickPile(i){if(over||piles[i].length===0)return;piles[i].pop();moves++;document.getElementById('moves').textContent=moves;render();if(piles.every(function(p){return p.length===0;})){over=true;document.getElementById('overlay').classList.add('show');}}
window.clickPile=clickPile;
function reset(){init();}
window.reset=reset;
init();
`, "solitaire");
}

function dames(): string {
  return wrap("Dames", `
<h1>🔴 <span>Dames</span></h1>
<div class="stats"><span id="turn">Aux blancs</span></div>
<div id="board" style="display:grid;grid-template-columns:repeat(6,min(60px,15vw));gap:2px;background:#1a1a1a;padding:12px;border-radius:12px;border:2px solid var(--card-border)"></div>
<div style="margin-top:16px"><button onclick="reset()" ontouchstart="reset();event.preventDefault()" style="padding:12px 32px;background:var(--card-border);color:#000;border:none;border-radius:10px;font-weight:900;font-size:16px;cursor:pointer">Nouvelle partie</button></div>
<div class="overlay" id="overlay"><h2 id="overTitle">Victoire !</h2><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var N=6,board,selected,turn,over;
function init(){board=[];for(var y=0;y<N;y++){board[y]=[];for(var x=0;x<N;x++){if((x+y)%2===1){if(y<2)board[y][x]='B';else if(y>=N-2)board[y][x]='W';else board[y][x]='';}else board[y][x]='X';}}selected=null;turn='W';over=false;document.getElementById('turn').textContent='Aux blancs';document.getElementById('overlay').classList.remove('show');render();}
function render(){var b=document.getElementById('board');b.innerHTML='';var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';for(var y=0;y<N;y++)for(var x=0;x<N;x++){var c=document.createElement('div');var v=board[y][x];var bg='#2a2a2a';if(v==='X')bg='#1a1a1a';if(selected&&selected.y===y&&selected.x===x)bg=ACC;c.style.cssText='width:100%;aspect-ratio:1;background:'+bg+';border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:900;cursor:pointer;color:'+(v==='W'?'#fff':v==='B'?'#000':'');c.textContent=v==='W'||v==='B'?(v==='W'?'●':'○'):'';c.onclick=function(yy,xx){return function(){click(yy,xx);};}(y,x);b.appendChild(c);}}
function click(y,x){if(over)return;if(selected){var dy=y-selected.y,dx=x-selected.x;if(Math.abs(dy)===1&&Math.abs(dx)===1&&board[y][x]===''){board[y][x]=board[selected.y][selected.x];board[selected.y][selected.x]='';selected=null;turn=turn==='W'?'B':'W';document.getElementById('turn').textContent=turn==='W'?'Aux blancs':'Aux noirs';render();chkW();return;}}if(board[y][x]===turn){selected={y:y,x:x};render();}}
function chkW(){var w=0,b=0;for(var y=0;y<N;y++)for(var x=0;x<N;x++){if(board[y][x]==='W')w++;if(board[y][x]==='B')b++;}if(w===0){over=true;document.getElementById('overTitle').textContent='Noirs gagnent';document.getElementById('overlay').classList.add('show');}if(b===0){over=true;document.getElementById('overTitle').textContent='Blancs gagnent';document.getElementById('overlay').classList.add('show');}}
function reset(){init();}
window.reset=reset;
init();
`, "dames");
}

function reversi(): string {
  return wrap("Reversi", `
<h1>⚫ <span>Reversi</span></h1>
<div class="stats"><span>Toi : <strong id="bs">2</strong></span><span>IA : <strong id="ws">2</strong></span></div>
<div id="board" style="display:grid;grid-template-columns:repeat(6,min(60px,15vw));gap:2px;background:#1a1a1a;padding:12px;border-radius:12px;border:2px solid var(--card-border)"></div>
<div style="margin-top:16px"><button onclick="reset()" ontouchstart="reset();event.preventDefault()" style="padding:12px 32px;background:var(--card-border);color:#000;border:none;border-radius:10px;font-weight:900;font-size:16px;cursor:pointer">Nouvelle partie</button></div>
<div class="overlay" id="overlay"><h2 id="overTitle">Victoire !</h2><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var N=6,board,over,turn;
function init(){board=[];for(var y=0;y<N;y++){board[y]=[];for(var x=0;x<N;x++)board[y][x]='';}board[2][2]='W';board[3][3]='W';board[2][3]='B';board[3][2]='B';over=false;turn='B';document.getElementById('overlay').classList.remove('show');render();}
function validMoves(p){var moves=[];for(var y=0;y<N;y++)for(var x=0;x<N;x++){if(board[y][x]!=='')continue;var dirs=[[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]];for(var d=0;d<dirs.length;d++){var dy=dirs[d][0],dx=dirs[d][1];var ny=y+dy,nx=x+dx;var count=0;while(ny>=0&&ny<N&&nx>=0&&nx<N&&board[ny][nx]===(p==='B'?'W':'B')){ny+=dy;nx+=dx;count++;}if(count>0&&ny>=0&&ny<N&&nx>=0&&nx<N&&board[ny][nx]===p){moves.push({y:y,x:x});break;}}}return moves;}
function play(y,x,p){var dirs=[[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]];board[y][x]=p;dirs.forEach(function(d){var dy=d[0],dx=d[1];var ny=y+dy,nx=x+dx;var flips=[];while(ny>=0&&ny<N&&nx>=0&&nx<N&&board[ny][nx]===(p==='B'?'W':'B')){flips.push({y:ny,x:nx});ny+=dy;nx+=dx;}if(flips.length>0&&ny>=0&&ny<N&&nx>=0&&nx<N&&board[ny][nx]===p){flips.forEach(function(f){board[f.y][f.x]=p;});}});}
function render(){var b=document.getElementById('board');b.innerHTML='';var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';var bs=0,ws=0;for(var y=0;y<N;y++)for(var x=0;x<N;x++){if(board[y][x]==='B')bs++;if(board[y][x]==='W')ws++;}document.getElementById('bs').textContent=bs;document.getElementById('ws').textContent=ws;for(var y=0;y<N;y++)for(var x=0;x<N;x++){var c=document.createElement('div');c.style.cssText='width:100%;aspect-ratio:1;background:#2a2a2a;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:24px;cursor:pointer';if(board[y][x]==='B'){c.style.background=ACC;c.style.color='#000';c.textContent='●';}else if(board[y][x]==='W'){c.style.background='#fff';c.style.color='#000';c.textContent='●';}c.onclick=function(yy,xx){return function(){click(yy,xx);};}(y,x);b.appendChild(c);}}
function click(y,x){if(over||turn!=='B')return;var vm=validMoves('B');var valid=vm.some(function(m){return m.y===y&&m.x===x;});if(!valid)return;play(y,x,'B');render();turn='W';setTimeout(ai,400);}
function ai(){var vm=validMoves('W');if(vm.length===0){turn='B';endGame();return;}var m=vm[Math.floor(Math.random()*vm.length)];play(m.y,m.x,'W');render();turn='B';endGame();}
function endGame(){var bs=0,ws=0;for(var y=0;y<N;y++)for(var x=0;x<N;x++){if(board[y][x]==='B')bs++;if(board[y][x]==='W')ws++;}var full=true;for(var y=0;y<N;y++)for(var x=0;x<N;x++)if(board[y][x]==='')full=false;if(full||(validMoves('B').length===0&&validMoves('W').length===0)){over=true;var msg=bs>ws?'Tu gagnes !':bs<ws?'IA gagne':'Match nul';document.getElementById('overTitle').textContent=msg;document.getElementById('overlay').classList.add('show');}}
function reset(){init();}
window.reset=reset;
init();
`, "reversi");
}

function yams(): string {
  return wrap("Yam's", `
<h1>🎲 <span>Yam's</span></h1>
<div class="stats"><span>Tour : <strong id="round">1</strong>/13</span><span>Score : <strong id="score">0</strong></span></div>
<div id="dice" style="display:flex;gap:12px;justify-content:center;margin:20px 0"></div>
<div class="controls">
<button ontouchstart="roll();event.preventDefault()" onclick="roll()" style="width:120px;background:#22c55e;color:#fff">Lancer</button>
<button ontouchstart="scoreIt();event.preventDefault()" onclick="scoreIt()" style="width:120px;background:#facc15;color:#000">Marquer</button>
</div>
<div class="overlay" id="overlay"><h2>Terminé !</h2><p>Score final : <strong id="finalScore">0</strong></p><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var dice,held,rolls,score,round,over;
var EMOJI=['⚀','⚁','⚂','⚃','⚄','⚅'];
function init(){dice=[1,1,1,1,1];held=[false,false,false,false,false];rolls=0;score=0;round=1;over=false;document.getElementById('round').textContent='1';document.getElementById('score').textContent='0';document.getElementById('overlay').classList.remove('show');render();}
function roll(){if(over||rolls>=3)return;dice=dice.map(function(d,i){return held[i]?d:Math.floor(Math.random()*6)+1;});rolls++;render();}
window.roll=roll;
function scoreIt(){if(over||rolls===0)return;var sum=dice.reduce(function(a,b){return a+b;},0);var counts={};dice.forEach(function(d){counts[d]=(counts[d]||0)+1;});var bonus=0;for(var k in counts)if(counts[k]>=3)bonus+=20;score+=sum+bonus;round++;document.getElementById('round').textContent=Math.min(round,13);document.getElementById('score').textContent=score;dice=[1,1,1,1,1];held=[false,false,false,false,false];rolls=0;if(round>13){over=true;document.getElementById('finalScore').textContent=score;document.getElementById('overlay').classList.add('show');}render();}
window.scoreIt=scoreIt;
function render(){var d=document.getElementById('dice');d.innerHTML='';var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';dice.forEach(function(v,i){var b=document.createElement('div');b.style.cssText='width:70px;height:70px;background:'+(held[i]?ACC:'#2a2a2a')+';border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:48px;cursor:pointer;color:'+(held[i]?'#000':'#fff');b.textContent=EMOJI[v-1];b.onclick=function(){held[i]=!held[i];render();};b.ontouchstart=function(e){e.preventDefault();held[i]=!held[i];render();};d.appendChild(b);});}
function reset(){init();}
window.reset=reset;
init();
`, "yam");
}

function memoryCards(): string {
  return wrap("Memory Cartes", `
<h1>🎴 <span>Memory Cartes</span></h1>
<div class="stats"><span>Coups : <strong id="moves">0</strong></span><span>Paires : <strong id="pairs">0/6</strong></span></div>
<div id="board" style="display:grid;grid-template-columns:repeat(4,min(80px,20vw));gap:8px;background:#1a1a1a;padding:12px;border-radius:12px;border:2px solid var(--card-border)"></div>
<div style="margin-top:16px"><button onclick="reset()" ontouchstart="reset();event.preventDefault()" style="padding:12px 32px;background:var(--card-border);color:#000;border:none;border-radius:10px;font-weight:900;font-size:16px;cursor:pointer">Nouvelle partie</button></div>
<div class="overlay" id="overlay"><h2 id="overTitle">Victoire !</h2><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var cards=['♠','♥','♦','♣','A','K'],f,s,lock,mv,mat,cds;
function init(){cds=cards.concat(cards).sort(function(){return Math.random()-0.5;});f=null;s=null;lock=false;mv=0;mat=0;document.getElementById('moves').textContent='0';document.getElementById('pairs').textContent='0/6';document.getElementById('overlay').classList.remove('show');render();}
function render(){var b=document.getElementById('board');b.innerHTML='';cds.forEach(function(e,i){var c=document.createElement('div');c.style.cssText='width:100%;aspect-ratio:1;background:#2a2a2a;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:32px;cursor:pointer;color:#fff;font-weight:900';c.textContent='?';c.dataset.idx=i;c.dataset.em=e;c.onclick=function(){flip(i,c);};c.ontouchstart=function(ev){ev.preventDefault();flip(i,c);};b.appendChild(c);});}
function flip(i,c){if(lock||c.dataset.matched==='1'||c.textContent!=='?')return;c.textContent=c.dataset.em;var acc=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';c.style.background=acc;c.style.color='#000';if(f===null){f=i;return;}if(s===null){s=i;lock=true;mv++;document.getElementById('moves').textContent=mv;var c1=document.querySelector('[data-idx="'+f+'"]'),c2=c;if(c1.dataset.em===c2.dataset.em){c1.dataset.matched='1';c2.dataset.matched='1';c1.style.background='#22c55e';c2.style.background='#22c55e';c1.style.color='#fff';c2.style.color='#fff';mat++;document.getElementById('pairs').textContent=mat+'/6';f=null;s=null;lock=false;if(mat===6)setTimeout(function(){document.getElementById('overTitle').textContent='Bravo ! '+mv+' coups';document.getElementById('overlay').classList.add('show');},400);}else{setTimeout(function(){c1.textContent='?';c1.style.background='#2a2a2a';c1.style.color='#fff';c2.textContent='?';c2.style.background='#2a2a2a';c2.style.color='#fff';f=null;s=null;lock=false;},800);}}}
function reset(){init();}
window.reset=reset;
init();
`, "memory-cards");
}

function batailleNavale(): string {
  return wrap("Bataille Navale", `
<h1>🚢 <span>Bataille Navale</span></h1>
<div class="stats"><span>Tirs : <strong id="shots">0</strong></span><span>Touches : <strong id="hits">0</strong></span></div>
<div id="board" style="display:grid;grid-template-columns:repeat(6,min(50px,12vw));gap:4px;background:#1a1a1a;padding:12px;border-radius:12px;border:2px solid var(--card-border)"></div>
<div class="overlay" id="overlay"><h2>Victoire !</h2><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var N=6,boats,shots,hitCount,over;
var BOATS=[{len:3},{len:2},{len:2},{len:1},{len:1}];
function init(){boats=[];for(var y=0;y<N;y++){boats[y]=[];for(var x=0;x<N;x++)boats[y][x]={boat:null,hit:false,miss:false};}var placed=0;while(placed<BOATS.length){var b=BOATS[placed];var dir=Math.random()<0.5?'h':'v';var by=Math.floor(Math.random()*N),bx=Math.floor(Math.random()*N);var ok=true;for(var i=0;i<b.len;i++){var cy=by+(dir==='v'?i:0),cx=bx+(dir==='h'?i:0);if(cy>=N||cx>=N||boats[cy][cx].boat!==null){ok=false;break;}}if(!ok)continue;for(var i=0;i<b.len;i++){var cy=by+(dir==='v'?i:0),cx=bx+(dir==='h'?i:0);boats[cy][cx].boat=placed;}placed++;}shots=0;hitCount=0;over=false;document.getElementById('shots').textContent='0';document.getElementById('hits').textContent='0';document.getElementById('overlay').classList.remove('show');render();}
function render(){var b=document.getElementById('board');b.innerHTML='';for(var y=0;y<N;y++)for(var x=0;x<N;x++){var c=document.createElement('div');var cell=boats[y][x];var bg='#2a2a2a',txt='';if(cell.hit){bg='#ef4444';txt='X';}else if(cell.miss){bg='#1a1a1a';txt='.';}c.style.cssText='width:100%;aspect-ratio:1;background:'+bg+';border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:20px;cursor:pointer;font-weight:900';c.textContent=txt;c.onclick=function(yy,xx){return function(){fire(yy,xx);};}(y,x);b.appendChild(c);}}
function fire(y,x){if(over||boats[y][x].hit||boats[y][x].miss)return;shots++;document.getElementById('shots').textContent=shots;if(boats[y][x].boat!==null){boats[y][x].hit=true;hitCount++;document.getElementById('hits').textContent=hitCount;var total=BOATS.reduce(function(a,b){return a+b.len;},0);if(hitCount===total){over=true;setTimeout(function(){document.getElementById('overlay').classList.add('show');},400);}}else{boats[y][x].miss=true;}render();}
function reset(){init();}
window.reset=reset;
init();
`, "bataille-navale");
}

function uno(): string {
  return wrap("Uno", `
<h1>🎴 <span>Uno</span></h1>
<div class="stats"><span>Toi : <strong id="pc">5</strong></span><span>IA : <strong id="dc">5</strong></span></div>
<div id="board" style="background:#1a1a1a;padding:20px;border-radius:12px;border:2px solid var(--card-border);min-width:400px;text-align:center"></div>
<div class="controls" style="margin-top:16px">
<button ontouchstart="play();event.preventDefault()" onclick="play()" style="width:140px;background:#22c55e;color:#fff">Jouer</button>
<button ontouchstart="drawCard();event.preventDefault()" onclick="drawCard()" style="width:100px;background:#facc15;color:#000">Piocher</button>
</div>
<div class="overlay" id="overlay"><h2 id="overTitle">Résultat</h2><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var COLORS=['🔴','🔵','🟢','🟡'];
var player,ai,deck,current,over;
function makeDeck(){var d=[];COLORS.forEach(function(c){for(var n=1;n<=5;n++)d.push({c:c,n:n});});return d.sort(function(){return Math.random()-0.5;});}
function init(){deck=makeDeck();player=[];ai=[];for(var i=0;i<5;i++){player.push(deck.pop());ai.push(deck.pop());}current=deck.pop();over=false;document.getElementById('overlay').classList.remove('show');render();}
function render(){document.getElementById('pc').textContent=player.length;document.getElementById('dc').textContent=ai.length;var h='<p style="color:#fff;margin-bottom:12px">Carte actuelle</p><div style="font-size:48px;margin-bottom:20px">'+current.c+current.n+'</div>';h+='<p style="color:#fff;margin-bottom:12px">Tes cartes</p><div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">';player.forEach(function(c,i){h+='<div style="padding:10px;background:#2a2a2a;border-radius:8px;font-size:24px;cursor:pointer" onclick="playCard('+i+')">'+c.c+c.n+'</div>';});h+='</div>';document.getElementById('board').innerHTML=h;}
function playCard(i){if(over)return;var c=player[i];if(c.c!==current.c&&c.n!==current.n)return;current=c;player.splice(i,1);render();if(player.length===0){over=true;document.getElementById('overTitle').textContent='Tu gagnes !';document.getElementById('overlay').classList.add('show');return;}setTimeout(aiTurn,600);}
window.playCard=playCard;
function play(){if(over)return;for(var i=0;i<player.length;i++){if(player[i].c===current.c||player[i].n===current.n){playCard(i);return;}}drawCard();}
window.play=play;
function drawCard(){if(over)return;player.push(deck.pop());render();setTimeout(aiTurn,600);}
window.drawCard=drawCard;
function aiTurn(){if(over)return;for(var i=0;i<ai.length;i++){if(ai[i].c===current.c||ai[i].n===current.n){current=ai[i];ai.splice(i,1);render();if(ai.length===0){over=true;document.getElementById('overTitle').textContent='IA gagne';document.getElementById('overlay').classList.add('show');}return;}}ai.push(deck.pop());render();}
function reset(){init();}
window.reset=reset;
init();
`, "uno-simple");
}

function pfc(): string {
  return wrap("Pierre-Feuille-Ciseaux", `
<h1>✊ <span>Pierre-Feuille-Ciseaux</span></h1>
<div class="stats"><span>Toi : <strong id="pw">0</strong></span><span>IA : <strong id="cw">0</strong></span><span>Nuls : <strong id="dr">0</strong></span></div>
<div id="board" style="text-align:center;padding:20px"><p style="font-size:60px" id="result">✊ ✋ ✌️</p><p style="color:#888;margin-top:20px">Choisis ton coup</p></div>
<div class="controls" style="margin-top:16px">
<button ontouchstart="play(0);event.preventDefault()" onclick="play(0)" style="width:80px;font-size:32px">✊</button>
<button ontouchstart="play(1);event.preventDefault()" onclick="play(1)" style="width:80px;font-size:32px">✋</button>
<button ontouchstart="play(2);event.preventDefault()" onclick="play(2)" style="width:80px;font-size:32px">✌️</button>
</div>
<div class="overlay" id="overlay"><h2 id="overTitle">Résultat</h2><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var EMOJI=['✊','✋','✌️'];
var pw=0,cw=0,dr=0;
function play(p){var c=Math.floor(Math.random()*3);if(p===c){dr++;}else if((p===0&&c===2)||(p===1&&c===0)||(p===2&&c===1)){pw++;}else{cw++;}document.getElementById('result').textContent=EMOJI[p]+'  VS  '+EMOJI[c];document.getElementById('pw').textContent=pw;document.getElementById('cw').textContent=cw;document.getElementById('dr').textContent=dr;if(pw>=5||cw>=5){document.getElementById('overTitle').textContent=pw>=5?'Victoire finale':'Defaite';document.getElementById('overlay').classList.add('show');}}
window.play=play;
function reset(){pw=0;cw=0;dr=0;document.getElementById('pw').textContent='0';document.getElementById('cw').textContent='0';document.getElementById('dr').textContent='0';document.getElementById('result').textContent='✊ ✋ ✌️';document.getElementById('overlay').classList.remove('show');}
window.reset=reset;
`, "pfc");
}

function devineNombre(): string {
  return wrap("Devine le Nombre", `
<h1>🔢 <span>Devine le Nombre</span></h1>
<div class="stats"><span>Essais : <strong id="tries">0</strong></span></div>
<div style="text-align:center;padding:20px">
<p id="hint" style="font-size:20px;color:#fff;margin-bottom:24px">Devine un nombre entre 1 et 100</p>
<input id="input" type="number" min="1" max="100" placeholder="Ton nombre" style="width:200px;padding:12px;font-size:20px;text-align:center;border-radius:12px;border:2px solid #facc15;background:#1a1a1a;color:#fff;outline:none" />
</div>
<div class="controls"><button ontouchstart="guess();event.preventDefault()" onclick="guess()" style="width:160px;background:#22c55e;color:#fff">Deviner</button></div>
<div class="overlay" id="overlay"><h2>Gagné !</h2><p>En <strong id="finalTries">0</strong> essais</p><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var secret,tries,over;
function init(){secret=Math.floor(Math.random()*100)+1;tries=0;over=false;document.getElementById('tries').textContent='0';document.getElementById('hint').textContent='Devine un nombre entre 1 et 100';document.getElementById('input').value='';document.getElementById('overlay').classList.remove('show');}
function guess(){if(over)return;var v=parseInt(document.getElementById('input').value);if(isNaN(v)||v<1||v>100)return;tries++;document.getElementById('tries').textContent=tries;if(v===secret){over=true;document.getElementById('finalTries').textContent=tries;document.getElementById('overlay').classList.add('show');}else if(v<secret){document.getElementById('hint').textContent='Plus grand';}else{document.getElementById('hint').textContent='Plus petit';}}
window.guess=guess;
function reset(){init();}
window.reset=reset;
document.addEventListener('keydown',function(e){if(e.key==='Enter')guess();});
init();
`, "devine-nombre");
}

// ═══════════════════════════════════════════════════════════════
// PAQUET 3 : RUNNERS & PLATEFORMES
// ═══════════════════════════════════════════════════════════════

function endlessRunner(): string {
  return wrap("Endless Runner", `
<h1>🏃 <span>Endless Runner</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Record : <strong id="best">0</strong></span></div>
<canvas id="game" width="600" height="300" style="width:min(600px,90vw)"></canvas>
<div class="controls"><button ontouchstart="jump();event.preventDefault()" onclick="jump()" style="width:160px">SAUTER</button></div>
<div class="overlay" id="overlay"><h2>Game Over</h2><p>Score : <strong id="finalScore">0</strong></p><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var c=document.getElementById('game'),x=c.getContext('2d'),W=c.width,H=c.height;
var player,obstacles,score,over,loop,groundY;
var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';
try{document.getElementById('best').textContent=localStorage.getItem('er_b')||'0';}catch(e){}
function init(){groundY=H-40;player={x:80,y:groundY-30,w:30,h:30,vy:0,onGround:true};obstacles=[];score=0;over=false;document.getElementById('score').textContent='0';document.getElementById('overlay').classList.remove('show');}
function jump(){if(over||!player.onGround)return;player.vy=-12;player.onGround=false;}
window.jump=jump;
function upd(){player.vy+=0.6;player.y+=player.vy;if(player.y>=groundY-player.h){player.y=groundY-player.h;player.vy=0;player.onGround=true;}obstacles.forEach(function(o){o.x-=5;});obstacles=obstacles.filter(function(o){return o.x>-50;});if(obstacles.length===0||obstacles[obstacles.length-1].x<W-300){obstacles.push({x:W,w:20,h:30+Math.random()*40,passed:false});}obstacles.forEach(function(o){if(!o.passed&&o.x+o.w<player.x){o.passed=true;score+=10;document.getElementById('score').textContent=score;}});obstacles.forEach(function(o){if(player.x<o.x+o.w&&player.x+player.w>o.x&&player.y+player.h>groundY-o.h){over=true;document.getElementById('finalScore').textContent=score;document.getElementById('overlay').classList.add('show');try{var b=parseInt(localStorage.getItem('er_b')||'0');if(score>b){localStorage.setItem('er_b',score);document.getElementById('best').textContent=score;}}catch(e){}}});}
function draw(){x.fillStyle='#000';x.fillRect(0,0,W,H);x.fillStyle='#1e3a8a';x.fillRect(0,groundY,W,4);x.fillStyle=ACC;x.fillRect(player.x,player.y,player.w,player.h);x.fillStyle='#ef4444';obstacles.forEach(function(o){x.fillRect(o.x,groundY-o.h,o.w,o.h);});}
function tick(){if(!over)upd();draw();}
function reset(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.reset=reset;
document.addEventListener('keydown',function(e){if(e.key===' '||e.key==='ArrowUp'){jump();e.preventDefault();}});
c.addEventListener('touchstart',function(e){e.preventDefault();jump();},{passive:false});
c.addEventListener('click',jump);
reset();
`, "endless-runner");
}

function jetpack(): string {
  return wrap("Jetpack", `
<h1>🚀 <span>Jetpack</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="game" width="600" height="350" style="width:min(600px,90vw)"></canvas>
<div class="controls"><button ontouchstart="startFlap();event.preventDefault()" ontouchend="stopFlap();event.preventDefault()" onclick="toggleFlap()" style="width:140px">VOLER</button></div>
<div class="overlay" id="overlay"><h2>Game Over</h2><p>Score : <strong id="finalScore">0</strong></p><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var c=document.getElementById('game'),x=c.getContext('2d'),W=c.width,H=c.height;
var player,obstacles,coins,score,over,loop,flapping;
var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';
function init(){player={x:100,y:H/2,w:30,h:30,vy:0};obstacles=[];coins=[];score=0;over=false;flapping=false;document.getElementById('score').textContent='0';document.getElementById('overlay').classList.remove('show');}
function startFlap(){flapping=true;}
function stopFlap(){flapping=false;}
function toggleFlap(){flapping=!flapping;setTimeout(function(){flapping=false;},200);}
window.startFlap=startFlap;window.stopFlap=stopFlap;window.toggleFlap=toggleFlap;
function upd(){if(flapping)player.vy-=0.6;else player.vy+=0.4;player.vy=Math.max(-8,Math.min(8,player.vy));player.y+=player.vy;if(player.y<0){player.y=0;player.vy=0;}if(player.y+player.h>H){over=true;document.getElementById('finalScore').textContent=score;document.getElementById('overlay').classList.add('show');return;}obstacles.forEach(function(o){o.x-=5;});obstacles=obstacles.filter(function(o){return o.x>-50;});if(obstacles.length===0||obstacles[obstacles.length-1].x<W-200){var oy=Math.random()*(H-100);obstacles.push({x:W,y:oy,w:20,h:80,passed:false});}coins.forEach(function(co){co.x-=5;});coins=coins.filter(function(co){return co.x>-30;});if(Math.random()<0.02)coins.push({x:W,y:Math.random()*H,r:10});coins.forEach(function(co){if(Math.hypot(co.x-player.x-15,co.y-player.y-15)<25){co.collected=true;score+=50;document.getElementById('score').textContent=score;}});coins=coins.filter(function(co){return !co.collected;});obstacles.forEach(function(o){if(!o.passed&&o.x+o.w<player.x){o.passed=true;score+=10;document.getElementById('score').textContent=score;}if(player.x<o.x+o.w&&player.x+player.w>o.x&&player.y<o.y+o.h&&player.y+player.h>o.y){over=true;document.getElementById('finalScore').textContent=score;document.getElementById('overlay').classList.add('show');}});}
function draw(){x.fillStyle='#0a0a0a';x.fillRect(0,0,W,H);x.fillStyle=ACC;x.beginPath();x.arc(player.x+15,player.y+15,15,0,Math.PI*2);x.fill();x.fillStyle='#fbbf24';obstacles.forEach(function(o){x.fillRect(o.x,o.y,o.w,o.h);});x.fillStyle='#22c55e';coins.forEach(function(co){x.beginPath();x.arc(co.x,co.y,co.r,0,Math.PI*2);x.fill();});}
function tick(){if(!over)upd();draw();}
function reset(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.reset=reset;
document.addEventListener('keydown',function(e){if(e.key===' '){flapping=true;}});
document.addEventListener('keyup',function(e){if(e.key===' ')flapping=false;});
c.addEventListener('mousedown',startFlap);
c.addEventListener('mouseup',stopFlap);
c.addEventListener('touchstart',function(e){e.preventDefault();startFlap();},{passive:false});
c.addEventListener('touchend',function(e){e.preventDefault();stopFlap();},{passive:false});
reset();
`, "jetpack");
}

function gravityRunner(): string {
  return wrap("Gravity Runner", `
<h1>🌌 <span>Gravity Runner</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="game" width="600" height="350" style="width:min(600px,90vw)"></canvas>
<div class="controls"><button ontouchstart="flip();event.preventDefault()" onclick="flip()" style="width:200px">INVERSER</button></div>
<div class="overlay" id="overlay"><h2>Game Over</h2><p>Score : <strong id="finalScore">0</strong></p><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var c=document.getElementById('game'),x=c.getContext('2d'),W=c.width,H=c.height;
var player,obstacles,score,over,loop,gravity;
var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';
function init(){gravity=1;player={x:80,y:H/2,w:30,h:30};obstacles=[];score=0;over=false;document.getElementById('score').textContent='0';document.getElementById('overlay').classList.remove('show');}
function flip(){gravity*=-1;}
window.flip=flip;
function upd(){player.y+=gravity*4;if(player.y<0)player.y=0;if(player.y+player.h>H)player.y=H-player.h;obstacles.forEach(function(o){o.x-=5;});obstacles=obstacles.filter(function(o){return o.x>-50;});if(obstacles.length===0||obstacles[obstacles.length-1].x<W-250){var side=Math.random()<0.5?0:1;obstacles.push({x:W,side:side,w:20,h:80+Math.random()*60,passed:false});}obstacles.forEach(function(o){var oy=o.side===0?0:H-o.h;if(!o.passed&&o.x+o.w<player.x){o.passed=true;score+=10;document.getElementById('score').textContent=score;}if(player.x<o.x+o.w&&player.x+player.w>o.x&&player.y<oy+o.h&&player.y+player.h>oy){over=true;document.getElementById('finalScore').textContent=score;document.getElementById('overlay').classList.add('show');}});}
function draw(){x.fillStyle='#000';x.fillRect(0,0,W,H);x.strokeStyle='#333';x.setLineDash([8,8]);x.beginPath();x.moveTo(0,H/2);x.lineTo(W,H/2);x.stroke();x.setLineDash([]);x.fillStyle=ACC;x.fillRect(player.x,player.y,player.w,player.h);x.fillStyle='#ef4444';obstacles.forEach(function(o){var oy=o.side===0?0:H-o.h;x.fillRect(o.x,oy,o.w,o.h);});}
function tick(){if(!over)upd();draw();}
function reset(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.reset=reset;
document.addEventListener('keydown',function(e){if(e.key===' '||e.key==='ArrowUp'||e.key==='ArrowDown'){flip();e.preventDefault();}});
c.addEventListener('click',flip);
c.addEventListener('touchstart',function(e){e.preventDefault();flip();},{passive:false});
reset();
`, "gravity-runner");
}

function skyJump(): string {
  return wrap("Sky Jump", `
<h1>☁️ <span>Sky Jump</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="game" width="400" height="500" style="width:min(400px,80vw)"></canvas>
<div class="controls"><button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button><button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button></div>
<div class="overlay" id="overlay"><h2>Game Over</h2><p>Score : <strong id="finalScore">0</strong></p><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var c=document.getElementById('game'),x=c.getContext('2d'),W=c.width,H=c.height;
var player,clouds,vy,score,over,loop;
var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';
function init(){player={x:W/2-20,y:H-80,w:40,h:40};clouds=[];for(var i=0;i<6;i++)clouds.push({x:Math.random()*(W-80),y:H-i*90,w:80,h:15});vy=-12;score=0;over=false;document.getElementById('score').textContent='0';document.getElementById('overlay').classList.remove('show');}
function mv(d){player.x+=d*20;player.x=Math.max(0,Math.min(W-player.w,player.x));}
window.mv=mv;
function upd(){vy+=0.5;player.y+=vy;clouds.forEach(function(cl){if(player.y+player.h>cl.y&&player.y+player.h<cl.y+cl.h+10&&player.x+player.w>cl.x&&player.x<cl.x+cl.w&&vy>0){vy=-12;score+=10;document.getElementById('score').textContent=score;}});if(player.y<H/2){var dy=H/2-player.y;player.y=H/2;clouds.forEach(function(cl){cl.y+=dy;});}clouds=clouds.filter(function(cl){return cl.y<H+50;});while(clouds.length<8){var top=H;clouds.forEach(function(cl){if(cl.y<top)top=cl.y;});clouds.push({x:Math.random()*(W-80),y:top-90,w:80,h:15});}if(player.y>H){over=true;document.getElementById('finalScore').textContent=score;document.getElementById('overlay').classList.add('show');}}
function draw(){x.fillStyle='#0a0a0a';x.fillRect(0,0,W,H);x.fillStyle=ACC;clouds.forEach(function(cl){x.beginPath();x.ellipse(cl.x+cl.w/2,cl.y+cl.h/2,cl.w/2,cl.h,0,0,Math.PI*2);x.fill();});x.fillStyle='#22c55e';x.fillRect(player.x,player.y,player.w,player.h);}
function tick(){if(!over)upd();draw();}
function reset(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.reset=reset;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft'){mv(-1);e.preventDefault();}if(e.key==='ArrowRight'){mv(1);e.preventDefault();}});
c.addEventListener('touchstart',function(e){e.preventDefault();var r=c.getBoundingClientRect();player.x=Math.max(0,Math.min(W-player.w,(e.touches[0].clientX-r.left)*(W/r.width)-20));},{passive:false});
c.addEventListener('touchmove',function(e){e.preventDefault();var r=c.getBoundingClientRect();player.x=Math.max(0,Math.min(W-player.w,(e.touches[0].clientX-r.left)*(W/r.width)-20));},{passive:false});
reset();
`, "sky-jump");
}

function ninjaJump(): string {
  return wrap("Ninja Jump", `
<h1>🥷 <span>Ninja Jump</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="game" width="400" height="500" style="width:min(400px,80vw)"></canvas>
<div class="controls"><button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button><button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button></div>
<div class="overlay" id="overlay"><h2>Game Over</h2><p>Score : <strong id="finalScore">0</strong></p><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var c=document.getElementById('game'),x=c.getContext('2d'),W=c.width,H=c.height;
var player,platforms,shurikens,vy,score,over,loop;
var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';
function init(){player={x:W/2-15,y:H-80,w:30,h:30};platforms=[];shurikens=[];for(var i=0;i<6;i++)platforms.push({x:Math.random()*(W-80),y:H-i*90,w:80,h:12});vy=-12;score=0;over=false;document.getElementById('score').textContent='0';document.getElementById('overlay').classList.remove('show');}
function mv(d){player.x+=d*20;player.x=Math.max(0,Math.min(W-player.w,player.x));}
window.mv=mv;
function upd(){vy+=0.5;player.y+=vy;platforms.forEach(function(p){if(player.y+player.h>p.y&&player.y+player.h<p.y+p.h+10&&player.x+player.w>p.x&&player.x<p.x+p.w&&vy>0){vy=-12;score+=10;document.getElementById('score').textContent=score;}});shurikens.forEach(function(s){s.x+=s.vx;s.y+=s.vy;});shurikens=shurikens.filter(function(s){return s.x>-30&&s.x<W+30;});if(Math.random()<0.01&&shurikens.length<4)shurikens.push({x:-20,y:100+Math.random()*300,vx:3+Math.random()*2,vy:0});if(player.y<H/2){var dy=H/2-player.y;player.y=H/2;platforms.forEach(function(p){p.y+=dy;});shurikens.forEach(function(s){s.y+=dy;});}platforms=platforms.filter(function(p){return p.y<H+50;});while(platforms.length<8){var top=H;platforms.forEach(function(p){if(p.y<top)top=p.y;});platforms.push({x:Math.random()*(W-80),y:top-90,w:80,h:12});}shurikens.forEach(function(s){if(Math.hypot(s.x-(player.x+15),s.y-(player.y+15))<25){over=true;document.getElementById('finalScore').textContent=score;document.getElementById('overlay').classList.add('show');}});if(player.y>H){over=true;document.getElementById('finalScore').textContent=score;document.getElementById('overlay').classList.add('show');}}
function draw(){x.fillStyle='#0a0a0a';x.fillRect(0,0,W,H);x.fillStyle=ACC;platforms.forEach(function(p){x.fillRect(p.x,p.y,p.w,p.h);});x.fillStyle='#1a1a1a';x.beginPath();x.arc(player.x+15,player.y+15,15,0,Math.PI*2);x.fill();x.fillStyle=ACC;x.fillRect(player.x+12,player.y+8,6,6);x.fillStyle='#ef4444';shurikens.forEach(function(s){x.beginPath();x.arc(s.x,s.y,8,0,Math.PI*2);x.fill();});}
function tick(){if(!over)upd();draw();}
function reset(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.reset=reset;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft'){mv(-1);e.preventDefault();}if(e.key==='ArrowRight'){mv(1);e.preventDefault();}});
c.addEventListener('touchstart',function(e){e.preventDefault();var r=c.getBoundingClientRect();player.x=Math.max(0,Math.min(W-player.w,(e.touches[0].clientX-r.left)*(W/r.width)-15));},{passive:false});
c.addEventListener('touchmove',function(e){e.preventDefault();var r=c.getBoundingClientRect();player.x=Math.max(0,Math.min(W-player.w,(e.touches[0].clientX-r.left)*(W/r.width)-15));},{passive:false});
reset();
`, "ninja-jump");
}

function bounce(): string {
  return wrap("Bounce", `
<h1>⚪ <span>Bounce</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Vies : <strong id="lives">3</strong></span></div>
<canvas id="game" width="500" height="400" style="width:min(500px,90vw)"></canvas>
<div class="controls"><button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button><button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button></div>
<div class="overlay" id="overlay"><h2>Game Over</h2><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var c=document.getElementById('game'),x=c.getContext('2d'),W=c.width,H=c.height;
var ball,bricks,score,lives,over,loop;
var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';
function init(){ball={x:W/2,y:100,vx:2,vy:0,r:12};bricks=[];for(var i=0;i<4;i++)bricks.push({y:50+i*60,alive:true,h:40});score=0;lives=3;over=false;document.getElementById('score').textContent='0';document.getElementById('lives').textContent='3';document.getElementById('overlay').classList.remove('show');}
function mv(d){ball.vx+=d*2;ball.vx=Math.max(-8,Math.min(8,ball.vx));}
window.mv=mv;
function upd(){ball.vy+=0.5;ball.x+=ball.vx;ball.y+=ball.vy;if(ball.x-ball.r<0||ball.x+ball.r>W){ball.vx*=-1;}if(ball.y-ball.r<0){ball.vy=Math.abs(ball.vy);}if(ball.y+ball.r>H){lives--;document.getElementById('lives').textContent=lives;if(lives<=0){over=true;document.getElementById('overlay').classList.add('show');}else{ball.x=W/2;ball.y=100;ball.vx=2;ball.vy=0;}}bricks.forEach(function(b){if(!b.alive)return;if(ball.y+ball.r>b.y&&ball.y+ball.r<b.y+b.h+10&&ball.vy>0){if(ball.x>10&&ball.x<W-10){ball.vy=-ball.vy;b.alive=false;score+=50;document.getElementById('score').textContent=score;}}});if(bricks.every(function(b){return !b.alive;})){over=true;document.getElementById('overlay').classList.add('show');}}
function draw(){x.fillStyle='#000';x.fillRect(0,0,W,H);x.fillStyle=ACC;x.beginPath();x.arc(ball.x,ball.y,ball.r,0,Math.PI*2);x.fill();x.fillStyle='#22c55e';bricks.forEach(function(b){if(b.alive){x.fillRect(30,b.y,W-60,b.h);}});}
function tick(){if(!over)upd();draw();}
function reset(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.reset=reset;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft'){mv(-1);e.preventDefault();}if(e.key==='ArrowRight'){mv(1);e.preventDefault();}});
reset();
`, "bounce");
}

function templeRun(): string {
  return wrap("Temple Run", `
<h1>🏛️ <span>Temple Run</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="game" width="400" height="500" style="width:min(400px,80vw)"></canvas>
<div class="controls"><button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button><button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button></div>
<div class="overlay" id="overlay"><h2>Game Over</h2><p>Score : <strong id="finalScore">0</strong></p><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var c=document.getElementById('game'),x=c.getContext('2d'),W=c.width,H=c.height;
var lanes,playerLane,obstacles,score,over,loop,speed;
var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';
function init(){lanes=[W/3,W/2,2*W/3];playerLane=1;obstacles=[];score=0;over=false;speed=6;document.getElementById('score').textContent='0';document.getElementById('overlay').classList.remove('show');}
function mv(d){playerLane+=d;playerLane=Math.max(0,Math.min(2,playerLane));}
window.mv=mv;
function upd(){obstacles.forEach(function(o){o.y+=speed;});obstacles=obstacles.filter(function(o){return o.y<H+50;});if(obstacles.length===0||obstacles[obstacles.length-1].y<200){var lane=Math.floor(Math.random()*3);obstacles.push({lane:lane,y:-50,w:60,h:60,passed:false});}obstacles.forEach(function(o){if(!o.passed&&o.y>H){o.passed=true;score+=10;document.getElementById('score').textContent=score;}});obstacles.forEach(function(o){if(o.y+o.h>H-80&&o.y<H-20&&o.lane===playerLane){over=true;document.getElementById('finalScore').textContent=score;document.getElementById('overlay').classList.add('show');}});speed+=0.001;}
function draw(){x.fillStyle='#1a0a0a';x.fillRect(0,0,W,H);x.strokeStyle='#facc15';x.setLineDash([20,20]);x.beginPath();x.moveTo(W/3,0);x.lineTo(W/3,H);x.moveTo(2*W/3,0);x.lineTo(2*W/3,H);x.stroke();x.setLineDash([]);x.fillStyle='#ef4444';obstacles.forEach(function(o){x.fillRect(lanes[o.lane]-o.w/2,o.y,o.w,o.h);});x.fillStyle=ACC;x.beginPath();x.arc(lanes[playerLane],H-40,20,0,Math.PI*2);x.fill();}
function tick(){if(!over)upd();draw();}
function reset(){init();if(loop)clearInterval(loop);loop=setInterval(tick,20);}
window.reset=reset;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft'){mv(-1);e.preventDefault();}if(e.key==='ArrowRight'){mv(1);e.preventDefault();}});
var tsx=0;
c.addEventListener('touchstart',function(e){e.preventDefault();tsx=e.touches[0].clientX;},{passive:false});
c.addEventListener('touchend',function(e){e.preventDefault();var dx=e.changedTouches[0].clientX-tsx;if(dx>30)mv(1);else if(dx<-30)mv(-1);},{passive:false});
reset();
`, "temple-run");
}

function marioLike(): string {
  return wrap("Mario-like", `
<h1>🍄 <span>Mario-like</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Vies : <strong id="lives">3</strong></span></div>
<canvas id="game" width="600" height="350" style="width:min(600px,90vw)"></canvas>
<div class="controls"><button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button><button ontouchstart="jump();event.preventDefault()" onclick="jump()">UP</button><button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button></div>
<div class="overlay" id="overlay"><h2>Game Over</h2><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var c=document.getElementById('game'),x=c.getContext('2d'),W=c.width,H=c.height;
var player,platforms,enemies,coins,score,lives,over,loop;
var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';
function init(){player={x:50,y:H-100,w:30,h:30,vx:0,vy:0,onGround:false};platforms=[{x:0,y:H-40,w:W,h:40}];for(var i=0;i<4;i++)platforms.push({x:200+i*120,y:H-100-i*30,w:80,h:15});enemies=[{x:300,y:H-70,w:30,h:30,alive:true},{x:500,y:H-70,w:30,h:30,alive:true}];coins=[];for(var i=0;i<6;i++)coins.push({x:150+i*80,y:H-150-Math.random()*100,r:10,collected:false});score=0;lives=3;over=false;document.getElementById('score').textContent='0';document.getElementById('lives').textContent='3';document.getElementById('overlay').classList.remove('show');}
function mv(d){if(d===-1)player.vx=-4;else player.vx=4;}
function jump(){if(player.onGround){player.vy=-13;player.onGround=false;}}
window.mv=mv;window.jump=jump;
function upd(){player.x+=player.vx;player.vx*=0.9;player.vy+=0.7;player.y+=player.vy;player.onGround=false;platforms.forEach(function(p){if(player.x+player.w>p.x&&player.x<p.x+p.w&&player.y+player.h>p.y&&player.y+player.h<p.y+p.h+15&&player.vy>0){player.y=p.y-player.h;player.vy=0;player.onGround=true;}});player.x=Math.max(0,Math.min(W-player.w,player.x));if(player.y>H){lives--;document.getElementById('lives').textContent=lives;if(lives<=0){over=true;document.getElementById('overlay').classList.add('show');}else{player.x=50;player.y=H-100;player.vy=0;}}enemies.forEach(function(e){if(!e.alive)return;if(player.x+player.w>e.x&&player.x<e.x+e.w&&player.y+player.h>e.y&&player.y<e.y+e.h){if(player.vy>0){e.alive=false;player.vy=-10;score+=100;document.getElementById('score').textContent=score;}else{lives--;document.getElementById('lives').textContent=lives;player.x=50;player.y=H-100;player.vy=0;if(lives<=0){over=true;document.getElementById('overlay').classList.add('show');}}}});coins.forEach(function(co){if(!co.collected&&Math.hypot(co.x-player.x-15,co.y-player.y-15)<25){co.collected=true;score+=50;document.getElementById('score').textContent=score;}});}
function draw(){x.fillStyle='#0a0a0a';x.fillRect(0,0,W,H);x.fillStyle=ACC;platforms.forEach(function(p){x.fillRect(p.x,p.y,p.w,p.h);});x.fillStyle='#ef4444';enemies.forEach(function(e){if(e.alive){x.fillRect(e.x,e.y,e.w,e.h);}});x.fillStyle='#fbbf24';coins.forEach(function(co){if(!co.collected){x.beginPath();x.arc(co.x,co.y,co.r,0,Math.PI*2);x.fill();}});x.fillStyle='#22c55e';x.fillRect(player.x,player.y,player.w,player.h);}
function tick(){if(!over)upd();draw();}
function reset(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.reset=reset;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft'){mv(-1);e.preventDefault();}if(e.key==='ArrowRight'){mv(1);e.preventDefault();}if(e.key===' '||e.key==='ArrowUp'){jump();e.preventDefault();}});
reset();
`, "mario-clone");
}

function wallRunner(): string {
  return wrap("Wall Runner", `
<h1>🧱 <span>Wall Runner</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="game" width="500" height="400" style="width:min(500px,90vw)"></canvas>
<div class="controls"><button ontouchstart="jump();event.preventDefault()" onclick="jump()" style="width:160px">SAUTER</button></div>
<div class="overlay" id="overlay"><h2>Game Over</h2><p>Score : <strong id="finalScore">0</strong></p><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var c=document.getElementById('game'),x=c.getContext('2d'),W=c.width,H=c.height;
var player,platforms,score,over,loop,speed;
var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';
function init(){player={x:100,y:H-100,w:25,h:30,vy:0,onGround:false};platforms=[{x:0,y:H-30,w:W,h:30}];for(var i=0;i<3;i++)platforms.push({x:W+i*150,y:H-80-Math.random()*80,w:100,h:15});score=0;over=false;speed=5;document.getElementById('score').textContent='0';document.getElementById('overlay').classList.remove('show');}
function jump(){if(player.onGround){player.vy=-12;player.onGround=false;}}
window.jump=jump;
function upd(){player.vy+=0.6;player.y+=player.vy;player.onGround=false;platforms.forEach(function(p){if(player.x+player.w>p.x&&player.x<p.x+p.w&&player.y+player.h>p.y&&player.y+player.h<p.y+p.h+15&&player.vy>0){player.y=p.y-player.h;player.vy=0;player.onGround=true;}});platforms.forEach(function(p){p.x-=speed;});platforms=platforms.filter(function(p){return p.x+p.w>0;});while(platforms.length<6){var rm=0;platforms.forEach(function(p){if(p.x+p.w>rm)rm=p.x+p.w;});platforms.push({x:rm+80+Math.random()*100,y:H-80-Math.random()*80,w:100,h:15});}if(player.y>H){over=true;document.getElementById('finalScore').textContent=score;document.getElementById('overlay').classList.add('show');}score+=1;if(Math.random()<0.05)document.getElementById('score').textContent=Math.floor(score/5);}
function draw(){x.fillStyle='#0a0a0a';x.fillRect(0,0,W,H);x.fillStyle=ACC;platforms.forEach(function(p){x.fillRect(p.x,p.y,p.w,p.h);});x.fillStyle='#22c55e';x.fillRect(player.x,player.y,player.w,player.h);}
function tick(){if(!over)upd();draw();}
function reset(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.reset=reset;
document.addEventListener('keydown',function(e){if(e.key===' '||e.key==='ArrowUp'){jump();e.preventDefault();}});
c.addEventListener('click',jump);
c.addEventListener('touchstart',function(e){e.preventDefault();jump();},{passive:false});
reset();
`, "wall-runner");
}

function caveRun(): string {
  return wrap("Cave Run", `
<h1>🕳️ <span>Cave Run</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="game" width="600" height="350" style="width:min(600px,90vw)"></canvas>
<div class="controls"><button ontouchstart="startFlap();event.preventDefault()" ontouchend="stopFlap();event.preventDefault()" onclick="toggleFlap()" style="width:140px">VOLER</button></div>
<div class="overlay" id="overlay"><h2>Game Over</h2><p>Score : <strong id="finalScore">0</strong></p><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var c=document.getElementById('game'),x=c.getContext('2d'),W=c.width,H=c.height;
var player,gaps,score,over,loop,flapping;
var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';
function init(){player={x:100,y:H/2,vy:0,r:15};gaps=[];score=0;over=false;flapping=false;document.getElementById('score').textContent='0';document.getElementById('overlay').classList.remove('show');for(var i=0;i<8;i++)gaps.push({y:i*H/5+H,center:200+Math.random()*100,size:120});}
function startFlap(){flapping=true;}
function stopFlap(){flapping=false;}
function toggleFlap(){flapping=!flapping;setTimeout(function(){flapping=false;},150);}
window.startFlap=startFlap;window.stopFlap=stopFlap;window.toggleFlap=toggleFlap;
function upd(){if(flapping)player.vy-=0.5;else player.vy+=0.4;player.vy=Math.max(-6,Math.min(6,player.vy));player.y+=player.vy;gaps.forEach(function(g){g.y+=4;});gaps=gaps.filter(function(g){return g.y<H+200;});while(gaps.length<8){var top=H;gaps.forEach(function(g){if(g.y<top)top=g.y;});gaps.push({y:top-100,center:100+Math.random()*(H-200),size:120});}var overlap=false;gaps.forEach(function(g){if(Math.abs(g.y-player.y)<40){if(Math.abs(player.y-g.center)>g.size/2)overlap=true;}});if(overlap){over=true;document.getElementById('finalScore').textContent=score;document.getElementById('overlay').classList.add('show');}score+=1;if(Math.random()<0.02)document.getElementById('score').textContent=Math.floor(score/10);}
function draw(){x.fillStyle='#0a0a0a';x.fillRect(0,0,W,H);x.fillStyle='#333';gaps.forEach(function(g){x.fillRect(0,g.y-200,W,g.center-g.size/2-(g.y-200)+1);x.fillRect(0,g.center+g.size/2,W,g.y+200-(g.center+g.size/2));});x.fillStyle=ACC;x.beginPath();x.arc(player.x,player.y,player.r,0,Math.PI*2);x.fill();}
function tick(){if(!over)upd();draw();}
function reset(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.reset=reset;
document.addEventListener('keydown',function(e){if(e.key===' '){flapping=true;}});
document.addEventListener('keyup',function(e){if(e.key===' ')flapping=false;});
c.addEventListener('mousedown',startFlap);
c.addEventListener('mouseup',stopFlap);
c.addEventListener('touchstart',function(e){e.preventDefault();startFlap();},{passive:false});
c.addEventListener('touchend',function(e){e.preventDefault();stopFlap();},{passive:false});
reset();
`, "cave-run");
}

// ═══════════════════════════════════════════════════════════════
// PAQUET 4 : SHOOTERS
// ═══════════════════════════════════════════════════════════════

function spaceShooter(): string {
  return wrap("Space Shooter", `
<h1>🚀 <span>Space Shooter</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Vies : <strong id="lives">3</strong></span></div>
<canvas id="game" width="480" height="600" style="width:min(480px,80vw)"></canvas>
<div class="controls"><button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button><button ontouchstart="sh();event.preventDefault()" onclick="sh()">FIRE</button><button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button></div>
<div class="overlay" id="overlay"><h2>Game Over</h2><p>Score : <strong id="finalScore">0</strong></p><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var c=document.getElementById('game'),x=c.getContext('2d'),W=c.width,H=c.height;
var pl,bullets,enemies,score,lives,over,loop,spawnT,boss;
var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';
function init(){pl={x:W/2-20,y:H-50,w:40,h:30};bullets=[];enemies=[];score=0;lives=3;over=false;spawnT=0;boss=null;document.getElementById('score').textContent='0';document.getElementById('lives').textContent='3';document.getElementById('overlay').classList.remove('show');}
function mv(d){pl.x+=d*25;pl.x=Math.max(0,Math.min(W-pl.w,pl.x));}
window.mv=mv;
function sh(){if(over)return;if(bullets.length<5)bullets.push({x:pl.x+pl.w/2,y:pl.y,vy:-10});}
window.sh=sh;
function upd(){bullets.forEach(function(b){b.y+=b.vy;});bullets=bullets.filter(function(b){return b.y>0;});spawnT++;if(spawnT>40&&!boss){spawnT=0;enemies.push({x:Math.random()*(W-40),y:-40,w:40,h:30,alive:true,vx:(Math.random()-0.5)*2,vy:1.5});}enemies.forEach(function(e){e.x+=e.vx;e.y+=e.vy;if(e.x<0||e.x+e.w>W)e.vx*=-1;});bullets.forEach(function(b){enemies.forEach(function(e){if(!e.alive)return;if(b.x>e.x&&b.x<e.x+e.w&&b.y>e.y&&b.y<e.y+e.h){e.alive=false;b.y=-100;score+=20;document.getElementById('score').textContent=score;}});});bullets=bullets.filter(function(b){return b.y>0;});enemies=enemies.filter(function(e){return e.y<H&&e.alive;});enemies.forEach(function(e){if(e.y+e.h>pl.y&&e.x<pl.x+pl.w&&e.x+e.w>pl.x){lives--;document.getElementById('lives').textContent=lives;e.alive=false;if(lives<=0){over=true;document.getElementById('finalScore').textContent=score;document.getElementById('overlay').classList.add('show');}}});if(score>=200&&!boss){boss={x:W/2-60,y:-80,w:120,h:80,hp:30,alive:true};}if(boss&&boss.alive){boss.y+=0.5;if(boss.y>=30)boss.y=30;if(Math.random()<0.03)bullets.push({x:boss.x+60,y:boss.y+boss.h,vy:5,enemy:true});}}
function draw(){x.fillStyle='#000';x.fillRect(0,0,W,H);x.fillStyle=ACC;x.beginPath();x.moveTo(pl.x+pl.w/2,pl.y);x.lineTo(pl.x,pl.y+pl.h);x.lineTo(pl.x+pl.w,pl.y+pl.h);x.closePath();x.fill();x.fillStyle='#fbbf24';bullets.forEach(function(b){if(!b.enemy)x.fillRect(b.x-1,b.y,3,8);});x.fillStyle='#ef4444';bullets.forEach(function(b){if(b.enemy){x.beginPath();x.arc(b.x,b.y,5,0,Math.PI*2);x.fill();}});enemies.forEach(function(e){if(e.alive){x.fillStyle='#22c55e';x.fillRect(e.x,e.y,e.w,e.h);}});if(boss&&boss.alive){x.fillStyle='#a855f7';x.fillRect(boss.x,boss.y,boss.w,boss.h);}}
function tick(){if(!over)upd();draw();}
function reset(){init();if(loop)clearInterval(loop);loop=setInterval(tick,20);}
window.reset=reset;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft'){mv(-1);e.preventDefault();}if(e.key==='ArrowRight'){mv(1);e.preventDefault();}if(e.key===' '){sh();e.preventDefault();}});
reset();
`, "space-shooter");
}

function tankShooter(): string {
  return wrap("Tank Shooter", `
<h1>🛡️ <span>Tank Shooter</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Vies : <strong id="lives">3</strong></span></div>
<canvas id="game" width="500" height="500" style="width:min(500px,90vw)"></canvas>
<div class="controls"><button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button><button ontouchstart="sh();event.preventDefault()" onclick="sh()">FIRE</button><button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button></div>
<div class="overlay" id="overlay"><h2>Game Over</h2><p>Score : <strong id="finalScore">0</strong></p><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var c=document.getElementById('game'),x=c.getContext('2d'),W=c.width,H=c.height;
var player,enemies,bullets,score,lives,over,loop,spawnT;
function init(){player={x:W/2-20,y:H-60,w:40,h:30};enemies=[];bullets=[];score=0;lives=3;over=false;spawnT=0;document.getElementById('score').textContent='0';document.getElementById('lives').textContent='3';document.getElementById('overlay').classList.remove('show');}
function mv(d){player.x+=d*20;player.x=Math.max(0,Math.min(W-player.w,player.x));}
window.mv=mv;
function sh(){if(over)return;bullets.push({x:player.x+player.w/2,y:player.y,vy:-8});}
window.sh=sh;
function upd(){spawnT++;if(spawnT>50){spawnT=0;var a=Math.random()*Math.PI*2;enemies.push({x:W/2-20,y:H/2-20,w:40,h:40,vx:Math.cos(a)*1.5,vy:Math.sin(a)*1.5,alive:true});}bullets.forEach(function(b){b.y+=b.vy;});bullets=bullets.filter(function(b){return b.y>0;});enemies.forEach(function(e){e.x+=e.vx;e.y+=e.vy;if(e.x<0||e.x+e.w>W)e.vx*=-1;if(e.y<0||e.y+e.h>H)e.vy*=-1;});bullets.forEach(function(b){enemies.forEach(function(e){if(!e.alive)return;if(Math.hypot(b.x-(e.x+20),b.y-(e.y+20))<25){e.alive=false;b.y=-100;score+=30;document.getElementById('score').textContent=score;}});});bullets=bullets.filter(function(b){return b.y>0;});enemies=enemies.filter(function(e){return e.alive;});enemies.forEach(function(e){if(Math.hypot((e.x+20)-(player.x+20),(e.y+20)-(player.y+15))<35){lives--;document.getElementById('lives').textContent=lives;e.alive=false;if(lives<=0){over=true;document.getElementById('finalScore').textContent=score;document.getElementById('overlay').classList.add('show');}}});enemies=enemies.filter(function(e){return e.alive;});}
function draw(){var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';x.fillStyle='#0a0a0a';x.fillRect(0,0,W,H);x.fillStyle=ACC;x.fillRect(player.x,player.y,player.w,player.h);x.fillRect(player.x+15,player.y-15,10,15);x.fillStyle='#fbbf24';bullets.forEach(function(b){x.beginPath();x.arc(b.x,b.y,4,0,Math.PI*2);x.fill();});x.fillStyle='#ef4444';enemies.forEach(function(e){if(e.alive)x.fillRect(e.x,e.y,e.w,e.h);});}
function tick(){if(!over)upd();draw();}
function reset(){init();if(loop)clearInterval(loop);loop=setInterval(tick,20);}
window.reset=reset;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft'){mv(-1);e.preventDefault();}if(e.key==='ArrowRight'){mv(1);e.preventDefault();}if(e.key===' '){sh();e.preventDefault();}});
reset();
`, "tank-shooter");
}

function zombieShooter(): string {
  return wrap("Zombie Shooter", `
<h1>🧟 <span>Zombie Shooter</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Vies : <strong id="lives">5</strong></span></div>
<canvas id="game" width="500" height="500" style="width:min(500px,90vw)"></canvas>
<div style="margin-top:16px;opacity:.6;font-size:12px">Clique pour tirer</div>
<div class="overlay" id="overlay"><h2>Game Over</h2><p>Score : <strong id="finalScore">0</strong></p><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var c=document.getElementById('game'),x=c.getContext('2d'),W=c.width,H=c.height;
var zombies,score,lives,over,loop,spawnT,mx,my;
var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';
function init(){zombies=[];score=0;lives=5;over=false;spawnT=0;mx=W/2;my=H/2;document.getElementById('score').textContent='0';document.getElementById('lives').textContent='5';document.getElementById('overlay').classList.remove('show');}
function spawn(){var side=Math.floor(Math.random()*4);var zx,zy;if(side===0){zx=Math.random()*W;zy=-30;}else if(side===1){zx=W+30;zy=Math.random()*H;}else if(side===2){zx=Math.random()*W;zy=H+30;}else{zx=-30;zy=Math.random()*H;}zombies.push({x:zx,y:zy,w:30,h:30,speed:0.5+Math.random()*0.8});}
function shoot(){if(over)return;zombies.forEach(function(z){if(Math.hypot(mx-(z.x+15),my-(z.y+15))<25){z.dead=true;score+=20;document.getElementById('score').textContent=score;}});zombies=zombies.filter(function(z){return !z.dead;});}
function upd(){spawnT++;if(spawnT>60){spawnT=0;spawn();}zombies.forEach(function(z){var dx=W/2-(z.x+15),dy=H/2-(z.y+15);var d=Math.hypot(dx,dy);z.x+=dx/d*z.speed;z.y+=dy/d*z.speed;});zombies.forEach(function(z){if(z.x+15>W/2-20&&z.x+15<W/2+20&&z.y+15>H/2-20&&z.y+15<H/2+20){z.dead=true;lives--;document.getElementById('lives').textContent=lives;if(lives<=0){over=true;document.getElementById('finalScore').textContent=score;document.getElementById('overlay').classList.add('show');}}});zombies=zombies.filter(function(z){return !z.dead;});}
function draw(){x.fillStyle='#0a0a0a';x.fillRect(0,0,W,H);x.fillStyle=ACC;x.beginPath();x.arc(W/2,H/2,20,0,Math.PI*2);x.fill();x.fillStyle='#22c55e';zombies.forEach(function(z){x.fillRect(z.x,z.y,z.w,z.h);});x.strokeStyle='#ef4444';x.lineWidth=2;x.beginPath();x.moveTo(W/2,H/2);x.lineTo(mx,my);x.stroke();}
function tick(){if(!over)upd();draw();}
function reset(){init();if(loop)clearInterval(loop);loop=setInterval(tick,20);}
window.reset=reset;
c.addEventListener('mousemove',function(e){var r=c.getBoundingClientRect();mx=(e.clientX-r.left)*(W/r.width);my=(e.clientY-r.top)*(H/r.height);});
c.addEventListener('click',shoot);
c.addEventListener('touchstart',function(e){e.preventDefault();var r=c.getBoundingClientRect();mx=(e.touches[0].clientX-r.left)*(W/r.width);my=(e.touches[0].clientY-r.top)*(H/r.height);shoot();},{passive:false});
reset();
`, "zombie-shooter");
}

function bulletHell(): string {
  return wrap("Bullet Hell", `
<h1>💥 <span>Bullet Hell</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Vies : <strong id="lives">3</strong></span></div>
<canvas id="game" width="500" height="500" style="width:min(500px,90vw)"></canvas>
<div class="controls"><button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button><button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button></div>
<div class="overlay" id="overlay"><h2>Game Over</h2><p>Score : <strong id="finalScore">0</strong></p><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var c=document.getElementById('game'),x=c.getContext('2d'),W=c.width,H=c.height;
var player,bullets,score,lives,over,loop,t,spawnT;
var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';
function init(){player={x:W/2-15,y:H-60,w:30,h:30};bullets=[];score=0;lives=3;over=false;t=0;spawnT=0;document.getElementById('score').textContent='0';document.getElementById('lives').textContent='3';document.getElementById('overlay').classList.remove('show');}
function mv(d){player.x+=d*8;player.x=Math.max(0,Math.min(W-player.w,player.x));}
window.mv=mv;
function upd(){t++;spawnT++;if(spawnT>60){spawnT=0;var cx=Math.random()*W;for(var i=0;i<8;i++){var a=(i/8)*Math.PI*2;bullets.push({x:cx,y:0,vx:Math.cos(a)*2,vy:Math.sin(a)*2});}}if(Math.random()<0.02)score+=5;bullets.forEach(function(b){b.x+=b.vx;b.y+=b.vy;});bullets=bullets.filter(function(b){return b.x>-20&&b.x<W+20&&b.y>-20&&b.y<H+20;});bullets.forEach(function(b){if(Math.hypot(b.x-(player.x+15),b.y-(player.y+15))<18){lives--;document.getElementById('lives').textContent=lives;b.dead=true;if(lives<=0){over=true;document.getElementById('finalScore').textContent=score;document.getElementById('overlay').classList.add('show');}}});bullets=bullets.filter(function(b){return !b.dead;});if(t%30===0)document.getElementById('score').textContent=score;}
function draw(){x.fillStyle='#000';x.fillRect(0,0,W,H);x.fillStyle=ACC;x.beginPath();x.moveTo(player.x+15,player.y);x.lineTo(player.x,player.y+player.h);x.lineTo(player.x+player.w,player.y+player.h);x.closePath();x.fill();x.fillStyle='#ef4444';bullets.forEach(function(b){x.beginPath();x.arc(b.x,b.y,5,0,Math.PI*2);x.fill();});}
function tick(){if(!over)upd();draw();}
function reset(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.reset=reset;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft'){mv(-1);e.preventDefault();}if(e.key==='ArrowRight'){mv(1);e.preventDefault();}});
reset();
`, "bullet-hell");
}

function planeShooter(): string {
  return wrap("Avion", `
<h1>✈️ <span>Avion de Chasse</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Vies : <strong id="lives">3</strong></span></div>
<canvas id="game" width="480" height="600" style="width:min(480px,80vw)"></canvas>
<div class="controls"><button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button><button ontouchstart="sh();event.preventDefault()" onclick="sh()">FIRE</button><button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button></div>
<div class="overlay" id="overlay"><h2>Game Over</h2><p>Score : <strong id="finalScore">0</strong></p><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var c=document.getElementById('game'),x=c.getContext('2d'),W=c.width,H=c.height;
var player,bullets,enemies,score,lives,over,loop,spawnT;
var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';
function init(){player={x:W/2-20,y:H-60,w:40,h:40};bullets=[];enemies=[];score=0;lives=3;over=false;spawnT=0;document.getElementById('score').textContent='0';document.getElementById('lives').textContent='3';document.getElementById('overlay').classList.remove('show');}
function mv(d){player.x+=d*25;player.x=Math.max(0,Math.min(W-player.w,player.x));}
window.mv=mv;
function sh(){if(over)return;bullets.push({x:player.x+8,y:player.y,vy:-10});bullets.push({x:player.x+player.w-8,y:player.y,vy:-10});}
window.sh=sh;
function upd(){bullets.forEach(function(b){b.y+=b.vy;});bullets=bullets.filter(function(b){return b.y>0;});spawnT++;if(spawnT>35){spawnT=0;enemies.push({x:Math.random()*(W-40),y:-40,w:40,h:40,vy:2,hp:1});}enemies.forEach(function(e){e.y+=e.vy;});bullets.forEach(function(b){enemies.forEach(function(e){if(e.hp<=0)return;if(Math.hypot(b.x-(e.x+20),b.y-(e.y+20))<25){e.hp--;b.y=-100;if(e.hp<=0){score+=30;document.getElementById('score').textContent=score;}}});});bullets=bullets.filter(function(b){return b.y>0;});enemies=enemies.filter(function(e){return e.hp>0&&e.y<H+50;});enemies.forEach(function(e){if(e.y+e.h>player.y&&e.x<player.x+player.w&&e.x+e.w>player.x){lives--;document.getElementById('lives').textContent=lives;e.hp=0;if(lives<=0){over=true;document.getElementById('finalScore').textContent=score;document.getElementById('overlay').classList.add('show');}}});enemies=enemies.filter(function(e){return e.hp>0;});}
function draw(){x.fillStyle='#000';x.fillRect(0,0,W,H);x.fillStyle=ACC;x.fillRect(player.x,player.y,player.w,player.h);x.fillStyle='#fbbf24';bullets.forEach(function(b){x.fillRect(b.x-1,b.y,3,8);});x.fillStyle='#22c55e';enemies.forEach(function(e){x.fillRect(e.x,e.y,e.w,e.h);});}
function tick(){if(!over)upd();draw();}
function reset(){init();if(loop)clearInterval(loop);loop=setInterval(tick,20);}
window.reset=reset;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft'){mv(-1);e.preventDefault();}if(e.key==='ArrowRight'){mv(1);e.preventDefault();}if(e.key===' '){sh();e.preventDefault();}});
reset();
`, "plane-shooter");
}

function helicopter(): string {
  return wrap("Hélicoptère", `
<h1>🚁 <span>Hélicoptère</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="game" width="600" height="350" style="width:min(600px,90vw)"></canvas>
<div class="controls"><button ontouchstart="startFlap();event.preventDefault()" ontouchend="stopFlap();event.preventDefault()" onclick="toggleFlap()" style="width:140px">VOLER</button></div>
<div class="overlay" id="overlay"><h2>Game Over</h2><p>Score : <strong id="finalScore">0</strong></p><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var c=document.getElementById('game'),x=c.getContext('2d'),W=c.width,H=c.height;
var player,obstacles,score,over,loop,flapping,scrollX;
var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';
function init(){player={x:100,y:H/2,w:50,h:25,vy:0};obstacles=[];score=0;over=false;flapping=false;scrollX=0;document.getElementById('score').textContent='0';document.getElementById('overlay').classList.remove('show');}
function startFlap(){flapping=true;}
function stopFlap(){flapping=false;}
function toggleFlap(){flapping=!flapping;setTimeout(function(){flapping=false;},200);}
window.startFlap=startFlap;window.stopFlap=stopFlap;window.toggleFlap=toggleFlap;
function upd(){if(flapping)player.vy-=0.5;else player.vy+=0.4;player.vy=Math.max(-5,Math.min(5,player.vy));player.y+=player.vy;if(player.y<0)player.y=0;if(player.y+player.h>H-30)player.y=H-30-player.h;obstacles.forEach(function(o){o.x-=4;});obstacles=obstacles.filter(function(o){return o.x+o.w>0;});if(obstacles.length===0||obstacles[obstacles.length-1].x<W-200){var h=30+Math.random()*80;obstacles.push({x:W,h:h,passed:false});}obstacles.forEach(function(o){var oy=H-30-o.h;if(!o.passed&&o.x+o.w<player.x){o.passed=true;score+=10;document.getElementById('score').textContent=score;}if(player.x<o.x+o.w&&player.x+player.w>o.x&&player.y+player.h>oy){over=true;document.getElementById('finalScore').textContent=score;document.getElementById('overlay').classList.add('show');}});scrollX+=4;}
function draw(){x.fillStyle='#0a0a0a';x.fillRect(0,0,W,H);x.fillStyle='#333';x.fillRect(0,H-30,W,30);x.fillStyle='#ef4444';obstacles.forEach(function(o){var oy=H-30-o.h;x.fillRect(o.x,oy,20,o.h);});x.fillStyle=ACC;x.fillRect(player.x,player.y,player.w,player.h);x.fillRect(player.x+player.w-10,player.y+5,15,15);}
function tick(){if(!over)upd();draw();}
function reset(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.reset=reset;
document.addEventListener('keydown',function(e){if(e.key===' '){flapping=true;}});
document.addEventListener('keyup',function(e){if(e.key===' ')flapping=false;});
c.addEventListener('mousedown',startFlap);
c.addEventListener('mouseup',stopFlap);
c.addEventListener('touchstart',function(e){e.preventDefault();startFlap();},{passive:false});
c.addEventListener('touchend',function(e){e.preventDefault();stopFlap();},{passive:false});
reset();
`, "helicopter");
}

function submarine(): string {
  return wrap("Sous-Marin", `
<h1>🚢 <span>Sous-Marin</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Oxygène : <strong id="oxy">100</strong></span></div>
<canvas id="game" width="600" height="400" style="width:min(600px,90vw)"></canvas>
<div class="controls"><button ontouchstart="startFlap();event.preventDefault()" ontouchend="stopFlap();event.preventDefault()" onclick="toggleFlap()" style="width:140px">MONTER</button></div>
<div class="overlay" id="overlay"><h2>Game Over</h2><p>Score : <strong id="finalScore">0</strong></p><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var c=document.getElementById('game'),x=c.getContext('2d'),W=c.width,H=c.height;
var player,obstacles,score,oxy,over,loop,flapping;
var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';
function init(){player={x:100,y:H/2,w:60,h:25,vy:0};obstacles=[];score=0;oxy=100;over=false;flapping=false;document.getElementById('score').textContent='0';document.getElementById('oxy').textContent='100';document.getElementById('overlay').classList.remove('show');}
function startFlap(){flapping=true;}
function stopFlap(){flapping=false;}
function toggleFlap(){flapping=!flapping;setTimeout(function(){flapping=false;},200);}
window.startFlap=startFlap;window.stopFlap=stopFlap;window.toggleFlap=toggleFlap;
function upd(){if(flapping)player.vy-=0.3;else player.vy+=0.25;player.vy=Math.max(-4,Math.min(4,player.vy));player.y+=player.vy;if(player.y<50)player.y=50;if(player.y+player.h>H-30)player.y=H-30-player.h;oxy-=0.05;document.getElementById('oxy').textContent=Math.floor(oxy);if(oxy<=0){over=true;document.getElementById('finalScore').textContent=score;document.getElementById('overlay').classList.add('show');}obstacles.forEach(function(o){o.x-=3;});obstacles=obstacles.filter(function(o){return o.x+o.w>0;});if(obstacles.length===0||obstacles[obstacles.length-1].x<W-250){var h=30+Math.random()*60;obstacles.push({x:W,y:50+Math.random()*(H-100-h),w:25,h:h,passed:false});}obstacles.forEach(function(o){if(!o.passed&&o.x+o.w<player.x){o.passed=true;score+=10;oxy+=5;document.getElementById('score').textContent=score;if(oxy>100)oxy=100;document.getElementById('oxy').textContent=Math.floor(oxy);}if(player.x<o.x+o.w&&player.x+player.w>o.x&&player.y<o.y+o.h&&player.y+player.h>o.y){over=true;document.getElementById('finalScore').textContent=score;document.getElementById('overlay').classList.add('show');}});}
function draw(){x.fillStyle='#001428';x.fillRect(0,0,W,H);x.fillStyle='#ef4444';obstacles.forEach(function(o){x.fillRect(o.x,o.y,o.w,o.h);});x.fillStyle=ACC;x.beginPath();x.ellipse(player.x+player.w/2,player.y+player.h/2,player.w/2,player.h/2,0,0,Math.PI*2);x.fill();}
function tick(){if(!over)upd();draw();}
function reset(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.reset=reset;
document.addEventListener('keydown',function(e){if(e.key===' '){flapping=true;}});
document.addEventListener('keyup',function(e){if(e.key===' ')flapping=false;});
c.addEventListener('mousedown',startFlap);
c.addEventListener('mouseup',stopFlap);
c.addEventListener('touchstart',function(e){e.preventDefault();startFlap();},{passive:false});
c.addEventListener('touchend',function(e){e.preventDefault();stopFlap();},{passive:false});
reset();
`, "submarine");
}

function meteorShower(): string {
  return wrap("Météores", `
<h1>☄️ <span>Pluie de Météores</span></h1>
<div class="stats"><span>Survie : <strong id="time">0</strong>s</span></div>
<canvas id="game" width="500" height="500" style="width:min(500px,90vw)"></canvas>
<div style="margin-top:16px;opacity:.6;font-size:12px">Souris / Tactile pour bouger</div>
<div class="overlay" id="overlay"><h2>Touché !</h2><p>Temps : <strong id="finalScore">0</strong>s</p><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var c=document.getElementById('game'),x=c.getContext('2d'),W=c.width,H=c.height;
var player,meteors,over,loop,t,spawnT,mx,my;
var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';
function init(){player={x:W/2-15,y:H/2-15,w:30,h:30};meteors=[];over=false;t=0;spawnT=0;mx=W/2;my=H/2;document.getElementById('time').textContent='0';document.getElementById('overlay').classList.remove('show');}
function upd(){t++;if(t%60===0)document.getElementById('time').textContent=Math.floor(t/60);player.x+=((mx-player.x-player.w/2)*0.1);player.y+=((my-player.y-player.h/2)*0.1);player.x=Math.max(0,Math.min(W-player.w,player.x));player.y=Math.max(0,Math.min(H-player.h,player.y));spawnT++;if(spawnT>20){spawnT=0;var side=Math.floor(Math.random()*4);var mx2,my2;if(side===0){mx2=Math.random()*W;my2=-30;}else if(side===1){mx2=W+30;my2=Math.random()*H;}else if(side===2){mx2=Math.random()*W;my2=H+30;}else{mx2=-30;my2=Math.random()*H;}var a=Math.atan2(H/2-my2,W/2-mx2)+((Math.random()-0.5)*0.8);meteors.push({x:mx2,y:my2,vx:Math.cos(a)*(1.5+Math.random()*2),vy:Math.sin(a)*(1.5+Math.random()*2),r:8+Math.random()*10});}meteors.forEach(function(m){m.x+=m.vx;m.y+=m.vy;});meteors=meteors.filter(function(m){return m.x>-50&&m.x<W+50&&m.y>-50&&m.y<H+50;});meteors.forEach(function(m){if(Math.hypot(m.x-(player.x+15),m.y-(player.y+15))<m.r+15){over=true;document.getElementById('finalScore').textContent=Math.floor(t/60);document.getElementById('overlay').classList.add('show');}});}
function draw(){x.fillStyle='#000';x.fillRect(0,0,W,H);x.fillStyle='#fbbf24';meteors.forEach(function(m){x.beginPath();x.arc(m.x,m.y,m.r,0,Math.PI*2);x.fill();});x.fillStyle=ACC;x.beginPath();x.arc(player.x+15,player.y+15,15,0,Math.PI*2);x.fill();}
function tick(){if(!over)upd();draw();}
function reset(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.reset=reset;
c.addEventListener('mousemove',function(e){var r=c.getBoundingClientRect();mx=(e.clientX-r.left)*(W/r.width);my=(e.clientY-r.top)*(H/r.height);});
c.addEventListener('touchstart',function(e){e.preventDefault();var r=c.getBoundingClientRect();mx=(e.touches[0].clientX-r.left)*(W/r.width);my=(e.touches[0].clientY-r.top)*(H/r.height);},{passive:false});
c.addEventListener('touchmove',function(e){e.preventDefault();var r=c.getBoundingClientRect();mx=(e.touches[0].clientX-r.left)*(W/r.width);my=(e.touches[0].clientY-r.top)*(H/r.height);},{passive:false});
reset();
`, "meteor-shower");
}

function crossyRoad(): string {
  return wrap("Crossy Road", `
<h1>🐔 <span>Crossy Road</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="game" width="500" height="500" style="width:min(500px,90vw)"></canvas>
<div class="controls">
<button ontouchstart="mv('left');event.preventDefault()" onclick="mv('left')">←</button>
<button ontouchstart="mv('up');event.preventDefault()" onclick="mv('up')">↑</button>
<button ontouchstart="mv('down');event.preventDefault()" onclick="mv('down')">↓</button>
<button ontouchstart="mv('right');event.preventDefault()" onclick="mv('right')">→</button>
</div>
<div class="overlay" id="overlay"><h2>Game Over</h2><p>Score : <strong id="finalScore">0</strong></p><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var c=document.getElementById('game'),x=c.getContext('2d'),W=c.width,H=c.height;
var player,lanes,score,over,loop,GRID=50;
function init(){player={gx:5,gy:9};score=0;over=false;lanes=[];for(var i=0;i<10;i++){lanes[i]={type:i===9?'safe':(i%2===0?'road':'grass'),cars:[]};if(lanes[i].type==='road'){for(var j=0;j<3;j++)lanes[i].cars.push({x:Math.random()*W,speed:(Math.random()<0.5?2:-2)*(1+Math.random())});}}document.getElementById('score').textContent='0';document.getElementById('overlay').classList.remove('show');}
function mv(dir){if(over)return;if(dir==='up')player.gy--;if(dir==='down')player.gy++;if(dir==='left')player.gx--;if(dir==='right')player.gx++;player.gx=Math.max(0,Math.min(9,player.gx));player.gy=Math.max(0,Math.min(9,player.gy));if(player.gy===0){score+=10;document.getElementById('score').textContent=score;player.gy=9;player.gx=5;lanes.forEach(function(l){if(l.type==='road')l.cars.forEach(function(car){car.x=Math.random()*W;});});}}
window.mv=mv;
function upd(){lanes.forEach(function(l){if(l.type==='road')l.cars.forEach(function(car){car.x+=car.speed;if(car.x>W+50)car.x=-50;if(car.x<-50)car.x=W+50;});});var lane=lanes[player.gy];if(lane.type==='road'){lane.cars.forEach(function(car){if(Math.abs(car.x-(player.gx*GRID+GRID/2))<35){over=true;document.getElementById('finalScore').textContent=score;document.getElementById('overlay').classList.add('show');}});}}
function draw(){x.fillStyle='#0a0a0a';x.fillRect(0,0,W,H);for(var i=0;i<10;i++){var l=lanes[i];var y=i*GRID;if(l.type==='road'){x.fillStyle='#1a1a1a';x.fillRect(0,y,W,GRID);l.cars.forEach(function(car){x.fillStyle='#ef4444';x.fillRect(car.x,y+10,50,30);});}else if(l.type==='grass'){x.fillStyle='#0a2810';x.fillRect(0,y,W,GRID);}else{x.fillStyle='#1e3a8a';x.fillRect(0,y,W,GRID);}}x.fillStyle='#fbbf24';x.font='40px system-ui';x.fillText('🐔',player.gx*GRID+5,player.gy*GRID+42);}
function tick(){if(!over)upd();draw();}
function reset(){init();if(loop)clearInterval(loop);loop=setInterval(tick,20);}
window.reset=reset;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft'){mv('left');e.preventDefault();}if(e.key==='ArrowRight'){mv('right');e.preventDefault();}if(e.key==='ArrowUp'){mv('up');e.preventDefault();}if(e.key==='ArrowDown'){mv('down');e.preventDefault();}});
reset();
`, "crossy-road");
}

function duckHunt(): string {
  return wrap("Chasse au Canard", `
<h1>🦆 <span>Chasse au Canard</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Munitions : <strong id="ammo">10</strong></span></div>
<canvas id="game" width="600" height="400" style="width:min(600px,90vw)"></canvas>
<div style="margin-top:16px;opacity:.6;font-size:12px">Clique sur les canards</div>
<div class="overlay" id="overlay"><h2>Terminé</h2><p>Score : <strong id="finalScore">0</strong></p><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var c=document.getElementById('game'),x=c.getContext('2d'),W=c.width,H=c.height;
var ducks,score,ammo,over,loop,spawnT,t;
function init(){ducks=[];score=0;ammo=10;over=false;spawnT=0;t=0;document.getElementById('score').textContent='0';document.getElementById('ammo').textContent='10';document.getElementById('overlay').classList.remove('show');}
function click(e){if(over||ammo<=0)return;e.preventDefault();var r=c.getBoundingClientRect();var mx,my;if(e.touches){mx=(e.touches[0].clientX-r.left)*(W/r.width);my=(e.touches[0].clientY-r.top)*(H/r.height);}else{mx=(e.clientX-r.left)*(W/r.width);my=(e.clientY-r.top)*(H/r.height);}var hit=false;ducks.forEach(function(d){if(!hit&&Math.hypot(mx-d.x,my-d.y)<30){d.dead=true;hit=true;score+=50;ammo--;document.getElementById('score').textContent=score;document.getElementById('ammo').textContent=ammo;}});if(!hit){ammo--;document.getElementById('ammo').textContent=ammo;}ducks=ducks.filter(function(d){return !d.dead;});if(ammo<=0){over=true;document.getElementById('finalScore').textContent=score;document.getElementById('overlay').classList.add('show');}}
window.click=click;
function upd(){t++;spawnT++;if(spawnT>45){spawnT=0;var dir=Math.random()<0.5?1:-1;ducks.push({x:dir>0?-30:W+30,y:50+Math.random()*200,vx:dir*(2+Math.random()*2),vy:(Math.random()-0.5)*1,dead:false});}ducks.forEach(function(d){d.x+=d.vx;d.y+=d.vy;if(d.y<20)d.vy=Math.abs(d.vy);if(d.y>H-80)d.vy=-Math.abs(d.vy);});ducks=ducks.filter(function(d){return d.x>-50&&d.x<W+50;});if(t%60===0){if(ducks.length===0&&t>100){over=true;document.getElementById('finalScore').textContent=score;document.getElementById('overlay').classList.add('show');}}}
function draw(){x.fillStyle='#0a2a3a';x.fillRect(0,0,W,H);x.fillStyle='#0f3a20';x.fillRect(0,H-60,W,60);x.fillStyle='#fff';x.font='30px system-ui';ducks.forEach(function(d){x.fillText('🦆',d.x-15,d.y+10);});}
function tick(){if(!over)upd();draw();}
function reset(){init();if(loop)clearInterval(loop);loop=setInterval(tick,20);}
window.reset=reset;
c.addEventListener('click',click);
c.addEventListener('touchstart',function(e){click(e);},{passive:false});
reset();
`, "duck-hunt");
}

// ═══════════════════════════════════════════════════════════════
// PAQUET 5 : RÉFLEXION
// ═══════════════════════════════════════════════════════════════

function hangmanEn(): string {
  return wrap("Hangman", `
<h1>📝 <span>Hangman English</span></h1>
<div class="stats"><span>Lives : <strong id="lives">6</strong></span><span>Word : <strong id="word">_ _ _ _</strong></span></div>
<div id="az" style="display:grid;grid-template-columns:repeat(9,min(40px,9vw));gap:6px;max-width:500px;margin-top:16px"></div>
<div style="margin-top:16px"><button onclick="reset()" ontouchstart="reset();event.preventDefault()" style="padding:12px 32px;background:var(--card-border);color:#000;border:none;border-radius:10px;font-weight:900;font-size:16px;cursor:pointer">New Game</button></div>
<div class="overlay" id="overlay"><h2 id="overTitle">Win !</h2><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var WORDS=['HOUSE','TREE','WATER','MUSIC','HAPPY','WORLD','LIGHT','DREAM','PEACE','HEART'];
var word,found,lives,over;
function init(){word=WORDS[Math.floor(Math.random()*WORDS.length)];found=[];lives=6;over=false;document.getElementById('lives').textContent='6';document.getElementById('overlay').classList.remove('show');render();}
function render(){var w=word.split('').map(function(l){return found.indexOf(l)>=0?l:'_';}).join(' ');document.getElementById('word').textContent=w;var az=document.getElementById('az');var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';az.innerHTML='';for(var i=0;i<26;i++){var l=String.fromCharCode(65+i);var b=document.createElement('button');var used=found.indexOf(l)>=0;b.style.cssText='width:100%;aspect-ratio:1;background:'+(used?'#666':ACC)+';color:'+(used?'#fff':'#000')+';border:none;border-radius:8px;font-weight:900;font-size:clamp(14px,3vw,18px);cursor:pointer';b.textContent=l;if(used)b.disabled=true;b.onclick=function(ll){return function(){try_(ll);};}(l);az.appendChild(b);}}
function try_(l){if(over||found.indexOf(l)>=0)return;found.push(l);if(word.indexOf(l)<0){lives--;document.getElementById('lives').textContent=lives;if(lives<=0){over=true;document.getElementById('overTitle').textContent='Lose ! Word: '+word;document.getElementById('overlay').classList.add('show');return;}}render();if(word.split('').every(function(c){return found.indexOf(c)>=0;})){over=true;document.getElementById('overTitle').textContent='Win !';document.getElementById('overlay').classList.add('show');}}
function reset(){init();}
window.reset=reset;
init();
`, "hangman-english");
}

function codeBreaker(): string {
  return wrap("Code Breaker", `
<h1>🔐 <span>Code Breaker</span></h1>
<div class="stats"><span>Essais : <strong id="tries">0</strong>/10</span></div>
<div id="history" style="background:#1a1a1a;padding:16px;border-radius:12px;border:2px solid var(--card-border);min-width:340px;min-height:200px;margin-bottom:12px"></div>
<div style="display:flex;gap:8px;align-items:center;justify-content:center">
<input id="guess" type="text" maxlength="4" placeholder="1234" style="width:120px;padding:12px;font-size:22px;text-align:center;background:#1a1a1a;color:#fff;border:2px solid #facc15;border-radius:12px;font-weight:900;letter-spacing:4px" />
<button ontouchstart="submit();event.preventDefault()" onclick="submit()" style="padding:12px 24px;background:#22c55e;color:#fff;border:none;border-radius:12px;font-weight:900;cursor:pointer">Valider</button>
</div>
<div class="overlay" id="overlay"><h2 id="overTitle">Gagné !</h2><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var code,history,tries,over;
function init(){code='';for(var i=0;i<4;i++)code+=Math.floor(Math.random()*10);history=[];tries=0;over=false;document.getElementById('tries').textContent='0';document.getElementById('guess').value='';document.getElementById('overlay').classList.remove('show');render();}
function render(){var h='';history.forEach(function(r){h+='<div style="display:flex;justify-content:space-between;padding:8px;background:#2a2a2a;border-radius:8px;margin-bottom:4px;font-weight:900"><span style="letter-spacing:4px">'+r.g+'</span><span style="color:#22c55e">'+r.b+' bien</span><span style="color:#facc15">'+r.m+' mal</span></div>';});document.getElementById('history').innerHTML=h||'<p style="color:#888;text-align:center">Devine un code de 4 chiffres</p>';}
function submit(){if(over)return;var g=document.getElementById('guess').value;if(g.length!==4)return;var b=0,m=0;var codeArr=code.split(''),gArr=g.split(''),codeUsed=[false,false,false,false],guessUsed=[false,false,false,false];for(var i=0;i<4;i++){if(gArr[i]===codeArr[i]){b++;codeUsed[i]=true;guessUsed[i]=true;}}for(var i=0;i<4;i++){if(guessUsed[i])continue;for(var j=0;j<4;j++){if(codeUsed[j])continue;if(gArr[i]===codeArr[j]){m++;codeUsed[j]=true;break;}}}history.push({g:g,b:b,m:m});tries++;document.getElementById('tries').textContent=tries;document.getElementById('guess').value='';render();if(b===4){over=true;document.getElementById('overTitle').textContent='Gagné en '+tries+' essais';document.getElementById('overlay').classList.add('show');}else if(tries>=10){over=true;document.getElementById('overTitle').textContent='Perdu ! Code: '+code;document.getElementById('overlay').classList.add('show');}}
window.submit=submit;
function reset(){init();}
window.reset=reset;
init();
`, "code-breaker");
}

function quizMaths(): string {
  return wrap("Quiz Maths", `
<h1>🧮 <span>Quiz Maths</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Temps : <strong id="time">60</strong>s</span></div>
<div id="board" style="background:#1a1a1a;padding:30px;border-radius:12px;border:2px solid var(--card-border);text-align:center;min-width:340px"></div>
<div class="overlay" id="overlay"><h2>Terminé</h2><p>Score : <strong id="finalScore">0</strong></p><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var score,over,timeLeft,timer,current;
function init(){score=0;over=false;timeLeft=60;document.getElementById('score').textContent='0';document.getElementById('time').textContent='60';document.getElementById('overlay').classList.remove('show');if(timer)clearInterval(timer);timer=setInterval(function(){if(over)return;timeLeft--;document.getElementById('time').textContent=timeLeft;if(timeLeft<=0){over=true;document.getElementById('finalScore').textContent=score;document.getElementById('overlay').classList.add('show');}},1000);next();}
function next(){var a=Math.floor(Math.random()*20)+1,b=Math.floor(Math.random()*20)+1,op=['+','-','x'][Math.floor(Math.random()*3)];var ans;if(op==='+')ans=a+b;else if(op==='-')ans=a-b;else ans=a*b;current=ans;var choices=[ans];while(choices.length<4){var fake=ans+(Math.floor(Math.random()*21)-10);if(choices.indexOf(fake)<0&&fake!==ans)choices.push(fake);}choices.sort(function(){return Math.random()-0.5;});var h='<p style="font-size:42px;font-weight:900;color:#fff;margin-bottom:24px">'+a+' '+op+' '+b+' = ?</p><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">';choices.forEach(function(c){h+='<button ontouchstart="pick('+c+');event.preventDefault()" onclick="pick('+c+')" style="padding:18px;font-size:22px;font-weight:900;background:#2a2a2a;color:#fff;border:2px solid #3a3a3a;border-radius:12px;cursor:pointer;font-family:inherit">'+c+'</button>';});h+='</div>';document.getElementById('board').innerHTML=h;}
function pick(v){if(over)return;if(v===current){score+=10;document.getElementById('score').textContent=score;next();}else{score=Math.max(0,score-5);document.getElementById('score').textContent=score;}}
window.pick=pick;
function reset(){init();}
window.reset=reset;
init();
`, "math-quiz");
}

function memoryNumbers(): string {
  return wrap("Memory Nombres", `
<h1>🔢 <span>Memory Nombres</span></h1>
<div class="stats"><span>Niveau : <strong id="level">1</strong></span></div>
<div id="board" style="background:#1a1a1a;padding:30px;border-radius:12px;border:2px solid var(--card-border);text-align:center;min-width:340px"></div>
<div class="overlay" id="overlay"><h2>Perdu</h2><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var seq,input,level,phase,over;
function init(){seq=[];input=[];level=0;over=false;document.getElementById('overlay').classList.remove('show');next();}
function next(){level++;document.getElementById('level').textContent=level;seq.push(Math.floor(Math.random()*10));input=[];phase='show';render();var i=0;var iv=setInterval(function(){if(i>=seq.length){clearInterval(iv);phase='input';render();return;}document.getElementById('board').innerHTML='<p style="font-size:80px;font-weight:900;color:#facc15">'+seq[i]+'</p>';i++;},700);}
function render(){if(phase==='show'){document.getElementById('board').innerHTML='<p style="font-size:20px;color:#888">Observe...</p>';return;}var h='<p style="font-size:16px;color:#888;margin-bottom:20px">Reproduis ('+input.length+'/'+seq.length+')</p><div style="display:grid;grid-template-columns:repeat(5,1fr);gap:10px">';for(var i=0;i<=9;i++){h+='<button ontouchstart="press('+i+');event.preventDefault()" onclick="press('+i+')" style="padding:16px;font-size:20px;font-weight:900;background:#2a2a2a;color:#fff;border:2px solid #3a3a3a;border-radius:12px;cursor:pointer;font-family:inherit">'+i+'</button>';}h+='</div>';document.getElementById('board').innerHTML=h;}
function press(v){if(phase!=='input'||over)return;input.push(v);var i=input.length-1;if(input[i]!==seq[i]){over=true;document.getElementById('overlay').classList.add('show');return;}if(input.length===seq.length){setTimeout(next,600);}else{render();}}
window.press=press;
function reset(){init();}
window.reset=reset;
init();
`, "memory-numbers");
}

function typingGame(): string {
  return wrap("Typing Game", `
<h1>⌨️ <span>Typing Game</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Mots : <strong id="words">0</strong></span><span>Temps : <strong id="time">60</strong>s</span></div>
<canvas id="game" width="600" height="400" style="width:min(600px,90vw)"></canvas>
<div style="margin-top:12px;width:min(600px,90vw)"><input id="input" type="text" autofocus placeholder="Tape les mots ici..." style="width:100%;padding:14px;font-size:18px;background:#1a1a1a;color:#fff;border:2px solid #facc15;border-radius:12px;outline:none" /></div>
<div class="overlay" id="overlay"><h2>Terminé</h2><p>Score : <strong id="finalScore">0</strong></p><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var c=document.getElementById('game'),x=c.getContext('2d'),W=c.width,H=c.height;
var words,score,wordCount,over,timeLeft,timer;
var WORDS=['CHAT','MAISON','ARBRE','SOLEIL','LIVRE','VOITURE','TABLE','FLEUR','MUSIQUE','JARDIN','PORTE'];
var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';
function init(){words=[];score=0;wordCount=0;over=false;timeLeft=60;document.getElementById('score').textContent='0';document.getElementById('words').textContent='0';document.getElementById('time').textContent='60';document.getElementById('overlay').classList.remove('show');document.getElementById('input').value='';if(timer)clearInterval(timer);timer=setInterval(function(){if(over)return;timeLeft--;document.getElementById('time').textContent=timeLeft;if(timeLeft<=0){over=true;document.getElementById('finalScore').textContent=score;document.getElementById('overlay').classList.add('show');}},1000);}
function spawn(){words.push({word:WORDS[Math.floor(Math.random()*WORDS.length)],x:Math.random()*(W-100)+50,y:-20,vy:0.5+Math.random()*0.8});}
function upd(){if(Math.random()<0.01)spawn();words.forEach(function(w){w.y+=w.vy;});words=words.filter(function(w){return w.y<H+30;});}
function draw(){x.fillStyle='#000';x.fillRect(0,0,W,H);words.forEach(function(w){x.fillStyle=ACC;x.font='bold 24px system-ui';x.textAlign='center';x.fillText(w.word,w.x,w.y);});x.textAlign='left';}
function tick(){if(!over)upd();draw();}
function reset(){init();if(!window.loopStarted){window.loopStarted=true;setInterval(tick,20);}}
window.reset=reset;
document.getElementById('input').addEventListener('input',function(e){var v=e.target.value.toUpperCase();for(var i=words.length-1;i>=0;i--){if(words[i].word===v){score+=words[i].word.length*10;wordCount++;words.splice(i,1);document.getElementById('score').textContent=score;document.getElementById('words').textContent=wordCount;e.target.value='';return;}}});
reset();
`, "typing-game");
}

function reactionTest(): string {
  return wrap("Réaction", `
<h1>⚡ <span>Test de Réaction</span></h1>
<div class="stats"><span>Meilleur : <strong id="best">-</strong> ms</span><span>Essais : <strong id="tries">0</strong></span></div>
<div id="board" style="width:min(500px,90vw);height:400px;background:#1a1a1a;border:2px solid var(--card-border);border-radius:16px;display:flex;align-items:center;justify-content:center;cursor:pointer;user-select:none">
<h2 id="msg" style="color:#fff;text-align:center;font-size:28px">Clique pour commencer</h2>
</div>
<div class="overlay" id="overlay"><h2>Terminé</h2><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var state,startTime,times,best,tries;
try{best=parseInt(localStorage.getItem('rt_b')||'0');if(best>0)document.getElementById('best').textContent=best;}catch(e){best=0;}
function init(){state='idle';times=[];tries=0;document.getElementById('tries').textContent='0';var msg=document.getElementById('msg');msg.textContent='Clique pour commencer';document.getElementById('board').style.background='#1a1a1a';}
function click(){var board=document.getElementById('board'),msg=document.getElementById('msg');if(state==='idle'){state='waiting';board.style.background='#7f1d1d';msg.textContent='Attends le vert...';var delay=1000+Math.random()*3000;setTimeout(function(){if(state!=='waiting')return;state='ready';board.style.background='#15803d';msg.textContent='CLIQUE !';startTime=Date.now();},delay);}else if(state==='waiting'){state='idle';board.style.background='#1a1a1a';msg.textContent='Trop tot !';}else if(state==='ready'){var t=Date.now()-startTime;times.push(t);tries++;document.getElementById('tries').textContent=tries;if(t<best||best===0){best=t;try{localStorage.setItem('rt_b',t);}catch(e){}document.getElementById('best').textContent=best;}msg.textContent=t+' ms ! Rejoue';state='idle';board.style.background='#1a1a1a';}}
window.click=click;
function reset(){init();}
window.reset=reset;
document.getElementById('board').addEventListener('click',click);
document.getElementById('board').addEventListener('touchstart',function(e){e.preventDefault();click();},{passive:false});
init();
`, "reaction-test");
}

function brainTraining(): string {
  return wrap("Brain Training", `
<h1>🧠 <span>Brain Training</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Tour : <strong id="round">1</strong>/5</span></div>
<div id="board" style="background:#1a1a1a;padding:30px;border-radius:12px;border:2px solid var(--card-border);text-align:center;min-width:340px"></div>
<div class="overlay" id="overlay"><h2>Terminé</h2><p>Score : <strong id="finalScore">0</strong></p><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var score,round,over,currentAnswer;
function init(){score=0;round=0;over=false;document.getElementById('score').textContent='0';document.getElementById('round').textContent='1';document.getElementById('overlay').classList.remove('show');next();}
function next(){round++;document.getElementById('round').textContent=Math.min(round,5);if(round>5){over=true;document.getElementById('finalScore').textContent=score;document.getElementById('overlay').classList.add('show');return;}var type=Math.floor(Math.random()*2);var h='';if(type===0){var a=Math.floor(Math.random()*50)+10,b=Math.floor(Math.random()*50)+10;currentAnswer=a+b;h='<p style="color:#888;margin-bottom:16px">Addition</p><p style="font-size:42px;font-weight:900;color:#fff;margin-bottom:24px">'+a+' + '+b+' = ?</p>';var choices=[currentAnswer];while(choices.length<4){var f=currentAnswer+(Math.floor(Math.random()*21)-10);if(choices.indexOf(f)<0)choices.push(f);}choices.sort(function(){return Math.random()-0.5;});h+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">';choices.forEach(function(c){h+='<button ontouchstart="pick('+c+');event.preventDefault()" onclick="pick('+c+')" style="padding:18px;font-size:22px;font-weight:900;background:#2a2a2a;color:#fff;border:2px solid #3a3a3a;border-radius:12px;cursor:pointer;font-family:inherit">'+c+'</button>';});h+='</div>';}else{var n=Math.floor(Math.random()*10)+1;currentAnswer=n*2;h='<p style="color:#888;margin-bottom:16px">Double</p><p style="font-size:42px;font-weight:900;color:#fff;margin-bottom:24px">Double de '+n+' ?</p>';var c3=[currentAnswer];while(c3.length<4){var f3=currentAnswer+(Math.floor(Math.random()*7)-3);if(f3>0&&c3.indexOf(f3)<0)c3.push(f3);}c3.sort(function(){return Math.random()-0.5;});h+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">';c3.forEach(function(c){h+='<button ontouchstart="pick('+c+');event.preventDefault()" onclick="pick('+c+')" style="padding:18px;font-size:22px;font-weight:900;background:#2a2a2a;color:#fff;border:2px solid #3a3a3a;border-radius:12px;cursor:pointer;font-family:inherit">'+c+'</button>';});h+='</div>';}document.getElementById('board').innerHTML=h;}
function pick(v){if(over)return;if(v===currentAnswer)score+=20;document.getElementById('score').textContent=score;setTimeout(next,400);}
window.pick=pick;
function reset(){init();}
window.reset=reset;
init();
`, "brain-training");
}

function iqTest(): string {
  return wrap("Test QI", `
<h1>🧠 <span>Test QI</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Question : <strong id="qnum">1</strong>/5</span></div>
<div id="board" style="background:#1a1a1a;padding:30px;border-radius:12px;border:2px solid var(--card-border);text-align:center;min-width:340px"></div>
<div class="overlay" id="overlay"><h2 id="overTitle">Terminé</h2><p>Score : <strong id="finalScore">0</strong></p><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var idx,score,over;
var QS=[
{q:"Suite : 2, 4, 8, 16, ?",a:["24","32","20","30"],c:1},
{q:"TOUS les A sont B et TOUS les B sont C, alors :",a:["Tous les A sont C","Aucun A n'est C","Certains A sont C","Inconnu"],c:0},
{q:"Suite : 1, 1, 2, 3, 5, 8, ?",a:["11","12","13","14"],c:2},
{q:"L'intrus ?",a:["Chat","Chien","Lion","Table"],c:3},
{q:"3 ouvriers font un mur en 3j, combien 1 ouvrier ?",a:["1","3","9","6"],c:2}
];
function init(){idx=0;score=0;over=false;document.getElementById('score').textContent='0';document.getElementById('qnum').textContent='1';document.getElementById('overlay').classList.remove('show');render();}
function render(){var q=QS[idx];document.getElementById('qnum').textContent=(idx+1)+'/'+QS.length;var h='<p style="font-size:20px;font-weight:900;color:#fff;margin-bottom:24px">'+q.q+'</p><div style="display:flex;flex-direction:column;gap:10px">';q.a.forEach(function(a,i){h+='<button ontouchstart="ans('+i+');event.preventDefault()" onclick="ans('+i+')" style="padding:14px 20px;background:#2a2a2a;color:#fff;border:2px solid #3a3a3a;border-radius:12px;font-size:15px;cursor:pointer;font-family:inherit;font-weight:600;text-align:left">'+a+'</button>';});h+='</div>';document.getElementById('board').innerHTML=h;}
function ans(i){if(over)return;if(i===QS[idx].c){score+=20;document.getElementById('score').textContent=score;}idx++;if(idx>=QS.length){over=true;document.getElementById('finalScore').textContent=score+'/100';document.getElementById('overTitle').textContent=score>=80?'Génie !':score>=60?'Bon QI':'A revoir';document.getElementById('overlay').classList.add('show');return;}render();}
window.ans=ans;
function reset(){init();}
window.reset=reset;
init();
`, "iq-test");
}

function justePrix(): string {
  return wrap("Le Juste Prix", `
<h1>💰 <span>Le Juste Prix</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Tour : <strong id="round">1</strong>/5</span></div>
<div id="board" style="background:#1a1a1a;padding:30px;border-radius:12px;border:2px solid var(--card-border);text-align:center;min-width:340px"></div>
<div class="overlay" id="overlay"><h2>Terminé</h2><p>Score : <strong id="finalScore">0</strong></p><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var items,idx,score,over;
var ALL=[{n:"iPhone",p:999},{n:"Café",p:3},{n:"Vélo",p:450},{n:"TV 4K",p:599},{n:"Pizza",p:12},{n:"Voiture",p:25000},{n:"Croissant",p:1},{n:"MacBook",p:1499},{n:"Chaise",p:89},{n:"Sac",p:59}];
function init(){items=ALL.slice().sort(function(){return Math.random()-0.5;}).slice(0,5);idx=0;score=0;over=false;document.getElementById('score').textContent='0';document.getElementById('round').textContent='1';document.getElementById('overlay').classList.remove('show');render();}
function render(){var it=items[idx];document.getElementById('round').textContent=(idx+1)+'/5';var h='<p style="color:#888;margin-bottom:8px">Quel est le prix ?</p><p style="font-size:32px;font-weight:900;color:#fff;margin-bottom:24px">'+it.n+'</p><input id="guess" type="number" placeholder="Prix en euros" style="width:200px;padding:14px;font-size:20px;text-align:center;background:#0a0a0a;color:#fff;border:2px solid #facc15;border-radius:12px;outline:none;font-weight:900" /><br><button ontouchstart="submit();event.preventDefault()" onclick="submit()" style="margin-top:16px;padding:14px 32px;background:#22c55e;color:#fff;border:none;border-radius:12px;font-weight:900;font-size:16px;cursor:pointer;font-family:inherit">Valider</button>';document.getElementById('board').innerHTML=h;}
function submit(){if(over)return;var g=parseFloat(document.getElementById('guess').value);if(isNaN(g))return;var p=items[idx].p;var diff=Math.abs(g-p)/p;var pts;if(diff<0.05)pts=100;else if(diff<0.2)pts=70;else if(diff<0.5)pts=40;else pts=10;score+=pts;document.getElementById('score').textContent=score;idx++;if(idx>=items.length){over=true;document.getElementById('finalScore').textContent=score;document.getElementById('overlay').classList.add('show');return;}render();}
window.submit=submit;
function reset(){init();}
window.reset=reset;
init();
`, "juste-prix");
}

function chessPuzzle(): string {
  return wrap("Puzzles Échecs", `
<h1>♟️ <span>Puzzles Échecs</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Puzzle : <strong id="pn">1</strong>/4</span></div>
<div id="board" style="display:grid;grid-template-columns:repeat(4,min(70px,18vw));gap:3px;background:#1a1a1a;padding:12px;border-radius:12px;border:2px solid var(--card-border)"></div>
<div style="margin-top:16px;color:#888;font-size:12px;text-align:center">Clique sur la case correcte</div>
<div class="overlay" id="overlay"><h2>Terminé</h2><p>Score : <strong id="finalScore">0</strong></p><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var puzzles=[{desc:"Roi blanc h1, Roi noir a8. Case c4 ?",answer:{r:1,c:2}},{desc:"Dame blanche d1. Mat en 1 : d8",answer:{r:0,c:3}},{desc:"Cavalier blanc g1 vers f3",answer:{r:2,c:1}},{desc:"Pion blanc a2 avancer de 2 : a4",answer:{r:3,c:0}}];
var idx,score,over;
function init(){idx=0;score=0;over=false;document.getElementById('score').textContent='0';document.getElementById('pn').textContent='1';document.getElementById('overlay').classList.remove('show');render();}
function render(){document.getElementById('pn').textContent=(idx+1)+'/'+puzzles.length;var h='<p style="color:#fff;padding:8px;margin-bottom:8px;font-size:13px">'+puzzles[idx].desc+'</p>';for(var r=0;r<4;r++)for(var c=0;c<4;c++){var bg=(r+c)%2===0?'#f5f5dc':'#8b4513';h+='<div onclick="click('+r+','+c+')" ontouchstart="event.preventDefault();click('+r+','+c+')" style="width:100%;aspect-ratio:1;background:'+bg+';border-radius:4px;cursor:pointer"></div>';}var div=document.getElementById('board');div.innerHTML=h;}
function click(r,c){if(over)return;var a=puzzles[idx].answer;if(r===a.r&&c===a.c){score+=25;document.getElementById('score').textContent=score;}idx++;if(idx>=puzzles.length){over=true;document.getElementById('finalScore').textContent=score;document.getElementById('overlay').classList.add('show');return;}render();}
window.click=click;
function reset(){init();}
window.reset=reset;
init();
`, "chess-puzzle");
}

// ═══════════════════════════════════════════════════════════════
// PAQUET 6 : ACTION & AVENTURE
// ═══════════════════════════════════════════════════════════════

function towerDefense(): string {
  return wrap("Tower Defense", `
<h1>🏰 <span>Tower Defense</span></h1>
<div class="stats"><span>Vies : <strong id="lives">10</strong></span><span>Or : <strong id="gold">100</strong></span></div>
<canvas id="game" width="600" height="400" style="width:min(600px,90vw)"></canvas>
<div class="controls">
<button ontouchstart="place();event.preventDefault()" onclick="place()" style="width:140px;background:#22c55e;color:#fff">Tourelle 50</button>
<button ontouchstart="startWave();event.preventDefault()" onclick="startWave()" style="width:140px;background:#facc15;color:#000">Vague</button>
</div>
<div class="overlay" id="overlay"><h2>Game Over</h2><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var c=document.getElementById('game'),x=c.getContext('2d'),W=c.width,H=c.height;
var towers,enemies,projectiles,lives,gold,wave,over,loop,path;
var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';
function init(){path=[{x:0,y:200},{x:150,y:200},{x:150,y:100},{x:350,y:100},{x:350,y:300},{x:600,y:300}];towers=[];enemies=[];projectiles=[];lives=10;gold=100;wave=0;over=false;document.getElementById('lives').textContent='10';document.getElementById('gold').textContent='100';document.getElementById('overlay').classList.remove('show');}
function place(){if(over||gold<50)return;gold-=50;towers.push({x:100+Math.random()*(W-200),y:50+Math.random()*(H-100),range:80,cooldown:0});document.getElementById('gold').textContent=gold;}
window.place=place;
function startWave(){if(over)return;wave++;for(var i=0;i<3+wave;i++)enemies.push({pathIdx:0,progress:0,hp:20+wave*5,maxHp:20+wave*5,speed:0.5+wave*0.05});}
window.startWave=startWave;
function upd(){enemies.forEach(function(e){e.progress+=e.speed;var target=path[e.pathIdx+1];if(!target){e.dead=true;lives--;document.getElementById('lives').textContent=lives;if(lives<=0){over=true;document.getElementById('overlay').classList.add('show');}return;}var start=path[e.pathIdx];var dx=target.x-start.x,dy=target.y-start.y;var dist=Math.hypot(dx,dy);if(e.progress>=dist){e.progress=0;e.pathIdx++;}else{e.x=start.x+dx*(e.progress/dist);e.y=start.y+dy*(e.progress/dist);}});enemies=enemies.filter(function(e){return !e.dead;});towers.forEach(function(t){t.cooldown--;if(t.cooldown>0)return;var target=null;var minD=999;enemies.forEach(function(e){var d=Math.hypot(e.x-t.x,e.y-t.y);if(d<t.range&&d<minD){minD=d;target=e;}});if(target){t.cooldown=30;projectiles.push({x:t.x,y:t.y,target:target,speed:8});}});projectiles.forEach(function(p){if(!p.target||p.target.dead){p.dead=true;return;}var dx=p.target.x-p.x,dy=p.target.y-p.y;var d=Math.hypot(dx,dy);if(d<10){p.target.hp-=10;if(p.target.hp<=0){p.target.dead=true;gold+=20;document.getElementById('gold').textContent=gold;}p.dead=true;}else{p.x+=dx/d*p.speed;p.y+=dy/d*p.speed;}});projectiles=projectiles.filter(function(p){return !p.dead;});enemies=enemies.filter(function(e){return !e.dead;});}
function draw(){x.fillStyle='#0a0a0a';x.fillRect(0,0,W,H);x.strokeStyle='#444';x.lineWidth=30;x.lineCap='round';x.beginPath();x.moveTo(path[0].x,path[0].y);for(var i=1;i<path.length;i++)x.lineTo(path[i].x,path[i].y);x.stroke();x.fillStyle=ACC;towers.forEach(function(t){x.beginPath();x.arc(t.x,t.y,15,0,Math.PI*2);x.fill();});x.fillStyle='#ef4444';enemies.forEach(function(e){x.fillRect(e.x-8,e.y-8,16,16);x.fillStyle='#fff';x.fillRect(e.x-10,e.y-14,20*(e.hp/e.maxHp),3);x.fillStyle='#ef4444';});x.fillStyle='#fbbf24';projectiles.forEach(function(p){x.beginPath();x.arc(p.x,p.y,4,0,Math.PI*2);x.fill();});}
function tick(){if(!over)upd();draw();}
function reset(){init();if(loop)clearInterval(loop);loop=setInterval(tick,20);}
window.reset=reset;
reset();
`, "tower-defense");
}

function survivors(): string {
  return wrap("Survivors", `
<h1>⚔️ <span>Survivors</span></h1>
<div class="stats"><span>Niveau : <strong id="lvl">1</strong></span><span>Vies : <strong id="hp">100</strong></span></div>
<canvas id="game" width="600" height="450" style="width:min(600px,90vw)"></canvas>
<div class="controls">
<button ontouchstart="mv('left');event.preventDefault()" onclick="mv('left')">←</button>
<button ontouchstart="mv('up');event.preventDefault()" onclick="mv('up')">UP</button>
<button ontouchstart="mv('down');event.preventDefault()" onclick="mv('down')">DN</button>
<button ontouchstart="mv('right');event.preventDefault()" onclick="mv('right')">→</button>
</div>
<div class="overlay" id="overlay"><h2>Game Over</h2><p>Niveau : <strong id="finalScore">0</strong></p><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var c=document.getElementById('game'),x=c.getContext('2d'),W=c.width,H=c.height;
var player,enemies,xp,xpNeeded,lvl,hp,over,loop,t,spawnT;
var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';
function init(){player={x:W/2,y:H/2,w:20,h:20,speed:3};enemies=[];xp=0;xpNeeded=5;lvl=1;hp=100;over=false;t=0;spawnT=0;document.getElementById('lvl').textContent='1';document.getElementById('hp').textContent='100';document.getElementById('overlay').classList.remove('show');}
function mv(d){if(over)return;if(d==='left')player.x-=player.speed*3;if(d==='right')player.x+=player.speed*3;if(d==='up')player.y-=player.speed*3;if(d==='down')player.y+=player.speed*3;player.x=Math.max(0,Math.min(W-player.w,player.x));player.y=Math.max(0,Math.min(H-player.h,player.y));}
window.mv=mv;
function upd(){t++;spawnT++;if(spawnT>30){spawnT=0;var side=Math.floor(Math.random()*4);var ex,ey;if(side===0){ex=Math.random()*W;ey=-20;}else if(side===1){ex=W+20;ey=Math.random()*H;}else if(side===2){ex=Math.random()*W;ey=H+20;}else{ex=-20;ey=Math.random()*H;}enemies.push({x:ex,y:ey,hp:1+Math.floor(lvl/3),speed:0.5+lvl*0.05});}enemies.forEach(function(e){var dx=player.x+10-e.x,dy=player.y+10-e.y;var d=Math.hypot(dx,dy);if(d>0){e.x+=dx/d*e.speed;e.y+=dy/d*e.speed;}if(d<25){hp-=0.5;document.getElementById('hp').textContent=Math.floor(hp);if(hp<=0&&!over){over=true;document.getElementById('finalScore').textContent=lvl;document.getElementById('overlay').classList.add('show');}}});enemies.forEach(function(e,i){var d=Math.hypot(e.x-player.x-10,e.y-player.y-10);if(d<60){enemies[i].hp-=0.05;if(enemies[i].hp<=0){enemies[i].dead=true;xp++;if(xp>=xpNeeded){xp=0;lvl++;xpNeeded=lvl*3;document.getElementById('lvl').textContent=lvl;hp=Math.min(100,hp+10);document.getElementById('hp').textContent=Math.floor(hp);}}}});enemies=enemies.filter(function(e){return !e.dead;});}
function draw(){x.fillStyle='#0a0a0a';x.fillRect(0,0,W,H);x.strokeStyle=ACC;x.globalAlpha=0.1;x.beginPath();x.arc(player.x+10,player.y+10,60,0,Math.PI*2);x.stroke();x.globalAlpha=1;x.fillStyle=ACC;x.beginPath();x.arc(player.x+10,player.y+10,10,0,Math.PI*2);x.fill();x.fillStyle='#ef4444';enemies.forEach(function(e){x.beginPath();x.arc(e.x,e.y,8,0,Math.PI*2);x.fill();});}
function tick(){if(!over)upd();draw();}
function reset(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.reset=reset;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft'){mv('left');e.preventDefault();}if(e.key==='ArrowRight'){mv('right');e.preventDefault();}if(e.key==='ArrowUp'){mv('up');e.preventDefault();}if(e.key==='ArrowDown'){mv('down');e.preventDefault();}});
reset();
`, "survivors");
}

function arenaFighter(): string {
  return wrap("Arena Fighter", `
<h1>⚔️ <span>Arena Fighter</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Vies : <strong id="hp">100</strong></span></div>
<canvas id="game" width="600" height="450" style="width:min(600px,90vw)"></canvas>
<div class="controls">
<button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button>
<button ontouchstart="atk();event.preventDefault()" onclick="atk()" style="background:#ef4444;color:#fff">ATK</button>
<button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button>
</div>
<div class="overlay" id="overlay"><h2>Game Over</h2><p>Score : <strong id="finalScore">0</strong></p><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var c=document.getElementById('game'),x=c.getContext('2d'),W=c.width,H=c.height;
var player,enemies,score,hp,over,loop,atkT,spawnT;
var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';
function init(){player={x:W/2-15,y:H-80,w:30,h:30};enemies=[];score=0;hp=100;over=false;atkT=0;spawnT=0;document.getElementById('score').textContent='0';document.getElementById('hp').textContent='100';document.getElementById('overlay').classList.remove('show');}
function mv(d){if(over)return;player.x+=d*10;player.x=Math.max(0,Math.min(W-player.w,player.x));}
window.mv=mv;
function atk(){if(over||atkT>0)return;atkT=20;enemies.forEach(function(e){if(Math.abs(e.x-player.x)<80&&e.y>player.y-80){e.hp-=30;if(e.hp<=0){e.dead=true;score+=20;document.getElementById('score').textContent=score;}}});}
window.atk=atk;
function upd(){if(atkT>0)atkT--;spawnT++;if(spawnT>80){spawnT=0;for(var i=0;i<2;i++)enemies.push({x:Math.random()*(W-40),y:-40,w:30,h:30,hp:20+score,speed:0.8});}enemies.forEach(function(e){var dx=player.x-e.x,dy=player.y-e.y;var d=Math.hypot(dx,dy);if(d>30){e.x+=dx/d*e.speed;e.y+=dy/d*e.speed;}else{hp-=0.3;document.getElementById('hp').textContent=Math.floor(hp);if(hp<=0&&!over){over=true;document.getElementById('finalScore').textContent=score;document.getElementById('overlay').classList.add('show');}}});enemies=enemies.filter(function(e){return !e.dead;});}
function draw(){x.fillStyle='#1a0f0a';x.fillRect(0,0,W,H);x.fillStyle=ACC;x.fillRect(player.x,player.y,player.w,player.h);if(atkT>10){x.strokeStyle='#fff';x.lineWidth=3;x.beginPath();x.arc(player.x+15,player.y-30,50,0,Math.PI*2);x.stroke();}x.fillStyle='#ef4444';enemies.forEach(function(e){x.fillRect(e.x,e.y,e.w,e.h);});}
function tick(){if(!over)upd();draw();}
function reset(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.reset=reset;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft'){mv(-1);e.preventDefault();}if(e.key==='ArrowRight'){mv(1);e.preventDefault();}if(e.key===' '){atk();e.preventDefault();}});
reset();
`, "arena-fighter");
}

function dungeon(): string {
  return wrap("Dungeon", `
<h1>🗝️ <span>Dungeon Crawler</span></h1>
<div class="stats"><span>HP : <strong id="hp">30</strong></span><span>Or : <strong id="gold">0</strong></span><span>Étage : <strong id="floor">1</strong></span></div>
<canvas id="game" width="600" height="450" style="width:min(600px,90vw)"></canvas>
<div class="controls">
<button ontouchstart="mv('left');event.preventDefault()" onclick="mv('left')">←</button>
<button ontouchstart="mv('up');event.preventDefault()" onclick="mv('up')">UP</button>
<button ontouchstart="mv('down');event.preventDefault()" onclick="mv('down')">DN</button>
<button ontouchstart="mv('right');event.preventDefault()" onclick="mv('right')">→</button>
</div>
<div class="overlay" id="overlay"><h2>Mort...</h2><p>Or : <strong id="finalScore">0</strong></p><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var c=document.getElementById('game'),x=c.getContext('2d'),W=c.width,H=c.height;
var player,floorTiles,enemies,gold,items,hp,floorNum,over,loop;
var TILE=60,COLS=10,ROWS=7;
var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';
function genFloor(){floorTiles=[];for(var y=0;y<ROWS;y++){floorTiles[y]=[];for(var xx=0;xx<COLS;xx++)floorTiles[y][xx]=Math.random()<0.85?0:1;}floorTiles[0][0]=0;enemies=[];items=[];for(var i=0;i<3+floorNum;i++){var ex,ey;do{ex=Math.floor(Math.random()*COLS);ey=Math.floor(Math.random()*ROWS);}while(floorTiles[ey][ex]!==0||(ex===player.x&&ey===player.y));enemies.push({x:ex,y:ey,hp:5+floorNum*3,alive:true});}for(var i=0;i<2;i++){var ix,iy;do{ix=Math.floor(Math.random()*COLS);iy=Math.floor(Math.random()*ROWS);}while(floorTiles[iy][ix]!==0);items.push({x:ix,y:iy,type:'gold'});}}
function init(){player={x:0,y:0};hp=30;gold=0;floorNum=1;over=false;document.getElementById('hp').textContent='30';document.getElementById('gold').textContent='0';document.getElementById('floor').textContent='1';document.getElementById('overlay').classList.remove('show');genFloor();}
function mv(d){if(over)return;var nx=player.x,ny=player.y;if(d==='left')nx--;if(d==='right')nx++;if(d==='up')ny--;if(d==='down')ny++;if(nx<0||nx>=COLS||ny<0||ny>=ROWS)return;if(floorTiles[ny][nx]===1)return;player.x=nx;player.y=ny;var i;for(i=enemies.length-1;i>=0;i--){if(enemies[i].x===nx&&enemies[i].y===ny){enemies[i].hp-=5;if(enemies[i].hp<=0){enemies[i].alive=false;gold+=10;document.getElementById('gold').textContent=gold;}else{hp-=3;document.getElementById('hp').textContent=hp;if(hp<=0){over=true;document.getElementById('finalScore').textContent=gold;document.getElementById('overlay').classList.add('show');}}break;}}for(i=items.length-1;i>=0;i--){if(items[i].x===nx&&items[i].y===ny){gold+=25;document.getElementById('gold').textContent=gold;items.splice(i,1);}}enemies=enemies.filter(function(e){return e.alive;});if(enemies.length===0&&items.length===0){floorNum++;document.getElementById('floor').textContent=floorNum;genFloor();hp=Math.min(30,hp+5);document.getElementById('hp').textContent=hp;}}
window.mv=mv;
function draw(){x.fillStyle='#000';x.fillRect(0,0,W,H);for(var y=0;y<ROWS;y++)for(var xx=0;xx<COLS;xx++){if(floorTiles[y][xx]===1){x.fillStyle='#333';x.fillRect(xx*TILE,y*TILE,TILE,TILE);}}x.font='30px system-ui';x.fillStyle='#fbbf24';items.forEach(function(it){x.fillText('💰',it.x*TILE+15,it.y*TILE+42);});x.fillStyle='#ef4444';enemies.forEach(function(e){x.fillText('👹',e.x*TILE+15,e.y*TILE+42);});x.fillStyle=ACC;x.fillText('🧙',player.x*TILE+15,player.y*TILE+42);}
function tick(){draw();}
function reset(){init();if(loop)clearInterval(loop);loop=setInterval(tick,30);}
window.reset=reset;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft'){mv('left');e.preventDefault();}if(e.key==='ArrowRight'){mv('right');e.preventDefault();}if(e.key==='ArrowUp'){mv('up');e.preventDefault();}if(e.key==='ArrowDown'){mv('down');e.preventDefault();}});
reset();
`, "dungeon-crawler");
}

function roguelike(): string {
  return wrap("Roguelike", `
<h1>🎲 <span>Roguelike</span></h1>
<div class="stats"><span>HP : <strong id="hp">20</strong></span><span>Étage : <strong id="floor">1</strong></span></div>
<canvas id="game" width="600" height="450" style="width:min(600px,90vw)"></canvas>
<div class="controls">
<button ontouchstart="mv('left');event.preventDefault()" onclick="mv('left')">←</button>
<button ontouchstart="mv('up');event.preventDefault()" onclick="mv('up')">UP</button>
<button ontouchstart="mv('down');event.preventDefault()" onclick="mv('down')">DN</button>
<button ontouchstart="mv('right');event.preventDefault()" onclick="mv('right')">→</button>
</div>
<div class="overlay" id="overlay"><h2>Mort</h2><p>Étage : <strong id="finalScore">1</strong></p><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var c=document.getElementById('game'),x=c.getContext('2d'),W=c.width,H=c.height;
var player,rooms,hp,floorNum,over,loop,GRID=30;
var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';
function gen(){rooms=[];for(var y=0;y<15;y++){rooms[y]=[];for(var xx=0;xx<20;xx++)rooms[y][xx]={type:'wall',item:null};}for(var i=0;i<30;i++){var rx=2+Math.floor(Math.random()*16),ry=2+Math.floor(Math.random()*11);rooms[ry][rx].type='floor';if(ry>0)rooms[ry-1][rx].type='floor';if(ry<14)rooms[ry+1][rx].type='floor';if(rx>0)rooms[ry][rx-1].type='floor';if(rx<19)rooms[ry][rx+1].type='floor';}for(var i=0;i<5;i++){var ex=2+Math.floor(Math.random()*16),ey=2+Math.floor(Math.random()*11);if(rooms[ey][ex].type==='floor')rooms[ey][ex].item='enemy';}for(var i=0;i<3;i++){var gx=2+Math.floor(Math.random()*16),gy=2+Math.floor(Math.random()*11);if(rooms[gy][gx].type==='floor')rooms[gy][gx].item='gold';}rooms[3][3]={type:'floor',item:'exit'};}
function init(){hp=20;floorNum=1;over=false;document.getElementById('hp').textContent='20';document.getElementById('floor').textContent='1';document.getElementById('overlay').classList.remove('show');gen();player={x:2,y:2};}
function mv(d){if(over)return;var nx=player.x,ny=player.y;if(d==='left')nx--;if(d==='right')nx++;if(d==='up')ny--;if(d==='down')ny++;if(nx<0||nx>=20||ny<0||ny>=15)return;if(rooms[ny][nx].type==='wall')return;player.x=nx;player.y=ny;var cell=rooms[ny][nx];if(cell.item==='enemy'){hp-=3;document.getElementById('hp').textContent=hp;cell.item=null;if(hp<=0){over=true;document.getElementById('finalScore').textContent=floorNum;document.getElementById('overlay').classList.add('show');}}else if(cell.item==='exit'){floorNum++;document.getElementById('floor').textContent=floorNum;gen();player={x:2,y:2};hp=Math.min(20,hp+3);document.getElementById('hp').textContent=hp;}else if(cell.item==='gold'){cell.item=null;}}
window.mv=mv;
function draw(){x.fillStyle='#000';x.fillRect(0,0,W,H);for(var y=0;y<15;y++)for(var xx=0;xx<20;xx++){var cell=rooms[y][xx];if(cell.type==='floor'){x.fillStyle='#1a1a1a';x.fillRect(xx*GRID,y*GRID,GRID-1,GRID-1);}if(cell.item==='enemy'){x.fillStyle='#ef4444';x.font='20px system-ui';x.fillText('X',xx*GRID+5,y*GRID+22);}if(cell.item==='gold'){x.fillStyle='#fbbf24';x.font='20px system-ui';x.fillText('$',xx*GRID+5,y*GRID+22);}if(cell.item==='exit'){x.fillStyle='#22c55e';x.font='20px system-ui';x.fillText('>',xx*GRID+5,y*GRID+22);}}x.fillStyle=ACC;x.font='20px system-ui';x.fillText('@',player.x*GRID+5,player.y*GRID+22);}
function tick(){draw();}
function reset(){init();if(loop)clearInterval(loop);loop=setInterval(tick,30);}
window.reset=reset;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft'){mv('left');e.preventDefault();}if(e.key==='ArrowRight'){mv('right');e.preventDefault();}if(e.key==='ArrowUp'){mv('up');e.preventDefault();}if(e.key==='ArrowDown'){mv('down');e.preventDefault();}});
reset();
`, "roguelike");
}

function rpgTopDown(): string {
  return wrap("RPG Top-Down", `
<h1>⚔️ <span>RPG Top-Down</span></h1>
<div class="stats"><span>HP : <strong id="hp">30</strong></span><span>XP : <strong id="xp">0</strong></span></div>
<canvas id="game" width="600" height="450" style="width:min(600px,90vw)"></canvas>
<div class="controls">
<button ontouchstart="mv('left');event.preventDefault()" onclick="mv('left')">←</button>
<button ontouchstart="mv('up');event.preventDefault()" onclick="mv('up')">UP</button>
<button ontouchstart="mv('down');event.preventDefault()" onclick="mv('down')">DN</button>
<button ontouchstart="mv('right');event.preventDefault()" onclick="mv('right')">→</button>
</div>
<div class="overlay" id="overlay"><h2>Mort</h2><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var c=document.getElementById('game'),x=c.getContext('2d'),W=c.width,H=c.height;
var player,enemies,hp,xp,over,loop,spawnT,t;
var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';
function init(){player={x:W/2,y:H/2,w:30,h:30};enemies=[];hp=30;xp=0;over=false;spawnT=0;t=0;document.getElementById('hp').textContent='30';document.getElementById('xp').textContent='0';document.getElementById('overlay').classList.remove('show');}
function mv(d){if(over)return;if(d==='left')player.x-=20;if(d==='right')player.x+=20;if(d==='up')player.y-=20;if(d==='down')player.y+=20;player.x=Math.max(0,Math.min(W-player.w,player.x));player.y=Math.max(0,Math.min(H-player.h,player.y));}
window.mv=mv;
function upd(){t++;spawnT++;if(spawnT>100&&enemies.length<6){spawnT=0;enemies.push({x:Math.random()*(W-30),y:Math.random()*(H-30),hp:5,maxHp:5,speed:0.5});}enemies.forEach(function(e){var dx=player.x-e.x,dy=player.y-e.y;var d=Math.hypot(dx,dy);if(d>25){e.x+=dx/d*e.speed;e.y+=dy/d*e.speed;}else if(t%30===0){hp-=2;document.getElementById('hp').textContent=hp;if(hp<=0&&!over){over=true;document.getElementById('overlay').classList.add('show');}}});if(t%30===0){enemies.forEach(function(e){var d=Math.hypot(player.x-e.x,player.y-e.y);if(d<50){e.hp-=2;if(e.hp<=0){e.dead=true;xp++;document.getElementById('xp').textContent=xp;}}});}enemies=enemies.filter(function(e){return !e.dead;});}
function draw(){x.fillStyle='#0a1408';x.fillRect(0,0,W,H);x.fillStyle=ACC;x.beginPath();x.arc(player.x+15,player.y+15,15,0,Math.PI*2);x.fill();x.fillStyle='#ef4444';enemies.forEach(function(e){x.beginPath();x.arc(e.x+15,e.y+15,12,0,Math.PI*2);x.fill();});}
function tick(){if(!over)upd();draw();}
function reset(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.reset=reset;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft'){mv('left');e.preventDefault();}if(e.key==='ArrowRight'){mv('right');e.preventDefault();}if(e.key==='ArrowUp'){mv('up');e.preventDefault();}if(e.key==='ArrowDown'){mv('down');e.preventDefault();}});
reset();
`, "top-down-rpg");
}

function ninjaGame(): string {
  return wrap("Ninja", `
<h1>🥷 <span>Ninja</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Vies : <strong id="lives">3</strong></span></div>
<canvas id="game" width="600" height="400" style="width:min(600px,90vw)"></canvas>
<div class="controls">
<button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button>
<button ontouchstart="shuriken();event.preventDefault()" onclick="shuriken()">THROW</button>
<button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button>
</div>
<div class="overlay" id="overlay"><h2>Game Over</h2><p>Score : <strong id="finalScore">0</strong></p><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var c=document.getElementById('game'),x=c.getContext('2d'),W=c.width,H=c.height;
var player,enemies,shurikens,score,lives,over,loop,groundY,spawnT;
var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';
function init(){groundY=H-40;player={x:100,y:groundY-30,w:30,h:30};enemies=[];shurikens=[];score=0;lives=3;over=false;spawnT=0;document.getElementById('score').textContent='0';document.getElementById('lives').textContent='3';document.getElementById('overlay').classList.remove('show');}
function mv(d){player.x+=d*15;player.x=Math.max(0,Math.min(W-player.w,player.x));}
function shuriken(){shurikens.push({x:player.x+15,y:player.y+15,vx:8});}
window.mv=mv;window.shuriken=shuriken;
function upd(){spawnT++;if(spawnT>60){spawnT=0;enemies.push({x:W+30,y:groundY-30,w:30,h:30});}enemies.forEach(function(e){e.x-=2;});enemies=enemies.filter(function(e){return e.x>-50;});shurikens.forEach(function(s){s.x+=s.vx;});shurikens=shurikens.filter(function(s){return s.x<W+20;});shurikens.forEach(function(s){enemies.forEach(function(e){if(!e.dead&&Math.hypot(s.x-(e.x+15),s.y-(e.y+15))<25){e.dead=true;s.dead=true;score+=20;document.getElementById('score').textContent=score;}});});shurikens=shurikens.filter(function(s){return !s.dead;});enemies.forEach(function(e){if(player.x<e.x+e.w&&player.x+player.w>e.x&&player.y<e.y+e.h&&player.y+player.h>e.y){lives--;document.getElementById('lives').textContent=lives;e.dead=true;if(lives<=0){over=true;document.getElementById('finalScore').textContent=score;document.getElementById('overlay').classList.add('show');}}});enemies=enemies.filter(function(e){return !e.dead;});}
function draw(){x.fillStyle='#0a0a0a';x.fillRect(0,0,W,H);x.fillStyle='#1a0a1a';x.fillRect(0,groundY,W,40);x.fillStyle=ACC;x.fillRect(player.x,player.y,player.w,player.h);x.fillStyle='#ef4444';enemies.forEach(function(e){x.fillRect(e.x,e.y,e.w,e.h);});x.fillStyle='#fbbf24';shurikens.forEach(function(s){x.beginPath();x.arc(s.x,s.y,6,0,Math.PI*2);x.fill();});}
function tick(){if(!over)upd();draw();}
function reset(){init();if(loop)clearInterval(loop);loop=setInterval(tick,20);}
window.reset=reset;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft'){mv(-1);e.preventDefault();}if(e.key==='ArrowRight'){mv(1);e.preventDefault();}if(e.key===' '){shuriken();e.preventDefault();}});
reset();
`, "ninja-game");
}

function knightFight(): string {
  return wrap("Chevalier", `
<h1>⚔️ <span>Chevalier</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Vies : <strong id="lives">5</strong></span></div>
<canvas id="game" width="600" height="400" style="width:min(600px,90vw)"></canvas>
<div class="controls">
<button ontouchstart="atk();event.preventDefault()" onclick="atk()" style="width:160px;background:#ef4444;color:#fff">ATTAQUER</button>
<button ontouchstart="parry();event.preventDefault()" onclick="parry()" style="width:160px;background:#3b82f6;color:#fff">PARER</button>
</div>
<div class="overlay" id="overlay"><h2>Game Over</h2><p>Score : <strong id="finalScore">0</strong></p><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var c=document.getElementById('game'),x=c.getContext('2d'),W=c.width,H=c.height;
var player,enemy,score,lives,over,loop,state,atkTimer,enemyAtkTimer;
var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';
function init(){player={hp:100};enemy={hp:50,maxHp:50};score=0;lives=5;over=false;state='idle';atkTimer=0;enemyAtkTimer=60;document.getElementById('score').textContent='0';document.getElementById('lives').textContent='5';document.getElementById('overlay').classList.remove('show');}
function atk(){if(over||atkTimer>0)return;atkTimer=30;enemy.hp-=15;if(enemy.hp<=0){enemy.hp=enemy.maxHp+10;enemy.maxHp+=10;score+=50;document.getElementById('score').textContent=score;}}
window.atk=atk;
function parry(){if(over)return;state='parry';setTimeout(function(){state='idle';},300);}
window.parry=parry;
function upd(){if(atkTimer>0)atkTimer--;enemyAtkTimer--;if(enemyAtkTimer<=0){enemyAtkTimer=60;if(state==='parry'){score+=10;document.getElementById('score').textContent=score;}else{player.hp-=15;if(player.hp<=0){lives--;document.getElementById('lives').textContent=lives;player.hp=100;if(lives<=0){over=true;document.getElementById('finalScore').textContent=score;document.getElementById('overlay').classList.add('show');}}}}}
function draw(){x.fillStyle='#0a0a0a';x.fillRect(0,0,W,H);x.fillStyle='#2a1a0a';x.fillRect(0,H-60,W,60);x.font='100px system-ui';x.fillStyle=ACC;x.fillText('🛡️',150,H-100);x.fillStyle='#ef4444';x.fillText('👹',W-250,H-100);x.fillStyle='#22c55e';x.fillRect(150,H-40,2*player.hp,10);x.fillStyle='#ef4444';x.fillRect(W-350,H-40,2*enemy.hp,10);if(state==='parry'){x.fillStyle='rgba(59,130,246,0.5)';x.beginPath();x.arc(200,H-100,80,0,Math.PI*2);x.fill();}}
function tick(){if(!over)upd();draw();}
function reset(){init();if(loop)clearInterval(loop);loop=setInterval(tick,20);}
window.reset=reset;
document.addEventListener('keydown',function(e){if(e.key===' '){atk();e.preventDefault();}if(e.key==='Shift'){parry();e.preventDefault();}});
reset();
`, "knight-fight");
}

function samurai(): string {
  return wrap("Samurai", `
<h1>🗡️ <span>Samurai</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Vies : <strong id="lives">3</strong></span></div>
<canvas id="game" width="600" height="400" style="width:min(600px,90vw)"></canvas>
<div style="margin-top:16px;opacity:.6;font-size:12px">Clique au bon moment</div>
<div class="overlay" id="overlay"><h2>Game Over</h2><p>Score : <strong id="finalScore">0</strong></p><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var c=document.getElementById('game'),x=c.getContext('2d'),W=c.width,H=c.height;
var score,lives,over,loop,phase,timer,zone;
var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';
function init(){score=0;lives=3;over=false;phase='wait';timer=0;zone={x:0,y:0,r:40};document.getElementById('score').textContent='0';document.getElementById('lives').textContent='3';document.getElementById('overlay').classList.remove('show');nextRound();}
function nextRound(){phase='wait';timer=40+Math.random()*80;zone={x:100+Math.random()*(W-200),y:100+Math.random()*(H-200),r:35};}
function click(e){e.preventDefault();var r=c.getBoundingClientRect();var mx,my;if(e.touches){mx=(e.touches[0].clientX-r.left)*(W/r.width);my=(e.touches[0].clientY-r.top)*(H/r.height);}else{mx=(e.clientX-r.left)*(W/r.width);my=(e.clientY-r.top)*(H/r.height);}if(phase!=='ready')return;if(Math.hypot(mx-zone.x,my-zone.y)<zone.r){score+=30;document.getElementById('score').textContent=score;}else{lives--;document.getElementById('lives').textContent=lives;if(lives<=0){over=true;document.getElementById('finalScore').textContent=score;document.getElementById('overlay').classList.add('show');return;}}nextRound();}
function upd(){timer--;if(phase==='wait'&&timer<=0){phase='ready';timer=30;}else if(phase==='ready'&&timer<=0){lives--;document.getElementById('lives').textContent=lives;if(lives<=0){over=true;document.getElementById('finalScore').textContent=score;document.getElementById('overlay').classList.add('show');return;}nextRound();}}
function draw(){x.fillStyle='#0a0a0a';x.fillRect(0,0,W,H);if(phase==='wait'){x.fillStyle='#444';x.font='120px system-ui';x.textAlign='center';x.fillText('👤',W/2,H/2+40);x.textAlign='left';}else{x.fillStyle='rgba(239,68,68,0.7)';x.beginPath();x.arc(zone.x,zone.y,zone.r,0,Math.PI*2);x.fill();x.strokeStyle='#fff';x.lineWidth=4;x.stroke();}}
function tick(){if(!over)upd();draw();}
function reset(){init();if(loop)clearInterval(loop);loop=setInterval(tick,20);}
window.reset=reset;
c.addEventListener('click',click);
c.addEventListener('touchstart',click,{passive:false});
reset();
`, "samurai");
}

function brawler(): string {
  return wrap("Brawler", `
<h1>👊 <span>Beat'em Up</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>HP : <strong id="hp">100</strong></span></div>
<canvas id="game" width="600" height="400" style="width:min(600px,90vw)"></canvas>
<div class="controls">
<button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button>
<button ontouchstart="punch();event.preventDefault()" onclick="punch()" style="background:#ef4444;color:#fff">PUNCH</button>
<button ontouchstart="kick();event.preventDefault()" onclick="kick()" style="background:#a855f7;color:#fff">KICK</button>
<button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button>
</div>
<div class="overlay" id="overlay"><h2>Game Over</h2><p>Score : <strong id="finalScore">0</strong></p><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var c=document.getElementById('game'),x=c.getContext('2d'),W=c.width,H=c.height;
var player,enemies,score,hp,over,loop,spawnT,atkT;
var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';
function init(){player={x:80,y:H-100,w:40,h:60};enemies=[];score=0;hp=100;over=false;spawnT=0;atkT=0;document.getElementById('score').textContent='0';document.getElementById('hp').textContent='100';document.getElementById('overlay').classList.remove('show');}
function mv(d){player.x+=d*15;player.x=Math.max(0,Math.min(W-player.w,player.x));}
function punch(){if(over||atkT>0)return;atkT=15;enemies.forEach(function(e){if(Math.abs(e.x-player.x)<70){e.hp-=20;if(e.hp<=0){e.dead=true;score+=20;document.getElementById('score').textContent=score;}}});}
function kick(){if(over||atkT>0)return;atkT=25;enemies.forEach(function(e){if(Math.abs(e.x-player.x)<90){e.hp-=35;if(e.hp<=0){e.dead=true;score+=30;document.getElementById('score').textContent=score;}}});}
window.mv=mv;window.punch=punch;window.kick=kick;
function upd(){if(atkT>0)atkT--;spawnT++;if(spawnT>90){spawnT=0;enemies.push({x:W-40,y:H-80,w:40,h:50,hp:20});}enemies.forEach(function(e){var dx=player.x-e.x;if(Math.abs(dx)>40){e.x+=dx>0?0.5:-0.5;}else{hp-=0.3;document.getElementById('hp').textContent=Math.floor(hp);if(hp<=0&&!over){over=true;document.getElementById('finalScore').textContent=score;document.getElementById('overlay').classList.add('show');}}});enemies=enemies.filter(function(e){return !e.dead;});}
function draw(){x.fillStyle='#0a0a14';x.fillRect(0,0,W,H);x.fillStyle='#1a1a2a';x.fillRect(0,H-30,W,30);x.fillStyle=ACC;x.fillRect(player.x,player.y,player.w,player.h);if(atkT>10){x.strokeStyle='#fff';x.lineWidth=4;x.beginPath();x.arc(player.x+40,player.y+30,40,-Math.PI/3,Math.PI/3);x.stroke();}x.fillStyle='#ef4444';enemies.forEach(function(e){x.fillRect(e.x,e.y,e.w,e.h);});}
function tick(){if(!over)upd();draw();}
function reset(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.reset=reset;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft'){mv(-1);e.preventDefault();}if(e.key==='ArrowRight'){mv(1);e.preventDefault();}if(e.key===' '){punch();e.preventDefault();}if(e.key==='Shift'){kick();e.preventDefault();}});
reset();
`, "brawler");
}

// ═══════════════════════════════════════════════════════════════
// PAQUET 7 : SIMULATION
// ═══════════════════════════════════════════════════════════════

function clickerTycoon(): string {
  return wrap("Clicker Tycoon", `
<h1>💰 <span>Clicker Tycoon</span></h1>
<div class="stats"><span>Argent : <strong id="money">0</strong> €</span><span>/sec : <strong id="cps">0</strong></span></div>
<div style="text-align:center;padding:30px">
<button ontouchstart="click();event.preventDefault()" onclick="click()" style="width:180px;height:180px;border-radius:50%;background:linear-gradient(135deg,#d4af37,#f97316);border:none;font-size:80px;cursor:pointer;font-family:inherit">💎</button>
</div>
<div id="shop" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px;max-width:600px;padding:16px"></div>
<div class="overlay" id="overlay"><h2>Millionaire !</h2><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var money,cps,upgrades,over;
var ALL=[
{n:"Petit commerce",cost:10,cps:1,count:0},
{n:"Boutique",cost:100,cps:8,count:0},
{n:"Usine",cost:1000,cps:50,count:0},
{n:"Corporation",cost:10000,cps:300,count:0},
{n:"Empire",cost:100000,cps:2000,count:0}
];
function init(){money=0;cps=0;upgrades=ALL.map(function(u){return Object.assign({},u);});over=false;document.getElementById('overlay').classList.remove('show');render();}
function click(){money+=1;render();}
window.click=click;
function buy(i){if(money<upgrades[i].cost)return;money-=upgrades[i].cost;upgrades[i].count++;upgrades[i].cost=Math.floor(upgrades[i].cost*1.15);calcCps();render();}
window.buy=buy;
function calcCps(){cps=0;upgrades.forEach(function(u){cps+=u.cps*u.count;});}
function render(){document.getElementById('money').textContent=Math.floor(money);document.getElementById('cps').textContent=cps;var s=document.getElementById('shop');s.innerHTML='';upgrades.forEach(function(u,i){var d=document.createElement('div');d.style.cssText='background:#1a1a1a;padding:12px;border-radius:12px;border:2px solid '+(money>=u.cost?'#22c55e':'#333')+';cursor:pointer';d.onclick=function(){buy(i);};d.ontouchstart=function(e){e.preventDefault();buy(i);};d.innerHTML='<div style="font-weight:900">'+u.n+'</div><div style="font-size:11px;color:#888">+'+u.cps+'/sec x'+u.count+'</div><div style="color:#facc15;font-weight:900">'+u.cost+' €</div>';s.appendChild(d);});}
setInterval(function(){if(!over){money+=cps;render();if(money>=1000000){over=true;document.getElementById('overlay').classList.add('show');}}},1000);
function reset(){init();}
window.reset=reset;
init();
`, "clicker-tycoon");
}

function idleGame(): string {
  return wrap("Idle Game", `
<h1>⏳ <span>Idle Game</span></h1>
<div class="stats"><span>Ressource : <strong id="res">0</strong></span><span>/sec : <strong id="rps">1</strong></span></div>
<div id="shop" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px;max-width:600px;padding:16px"></div>
<div class="overlay" id="overlay"><h2>Prestige !</h2><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var res,rps,gens;
var ALL=[
{n:"Mineur",cost:25,rps:1,count:0},
{n:"Machine",cost:150,rps:10,count:0},
{n:"Raffinerie",cost:1000,rps:80,count:0},
{n:"Labo",cost:10000,rps:500,count:0},
{n:"Vaisseau",cost:100000,rps:5000,count:0}
];
function init(){res=0;rps=1;gens=ALL.map(function(g){return Object.assign({},g);});document.getElementById('overlay').classList.remove('show');render();}
function buy(i){if(res<gens[i].cost)return;res-=gens[i].cost;gens[i].count++;gens[i].cost=Math.floor(gens[i].cost*1.18);calc();render();}
window.buy=buy;
function calc(){rps=1;gens.forEach(function(g){rps+=g.rps*g.count;});}
function render(){document.getElementById('res').textContent=Math.floor(res);document.getElementById('rps').textContent=Math.floor(rps);var s=document.getElementById('shop');s.innerHTML='';gens.forEach(function(g,i){var d=document.createElement('div');d.style.cssText='background:#1a1a1a;padding:12px;border-radius:12px;border:2px solid '+(res>=g.cost?'#22c55e':'#333')+';cursor:pointer';d.onclick=function(){buy(i);};d.ontouchstart=function(e){e.preventDefault();buy(i);};d.innerHTML='<div style="font-weight:900">'+g.n+'</div><div style="font-size:11px;color:#888">+'+g.rps+'/sec x'+g.count+'</div><div style="color:#facc15;font-weight:900">'+g.cost+'</div>';s.appendChild(d);});}
setInterval(function(){res+=rps;render();},1000);
function reset(){init();}
window.reset=reset;
init();
`, "idle-game");
}

function ferme(): string {
  return wrap("Ferme", `
<h1>🌾 <span>Ferme</span></h1>
<div class="stats"><span>Argent : <strong id="money">50</strong> €</span><span>Graines : <strong id="seeds">5</strong></span></div>
<div id="grid" style="display:grid;grid-template-columns:repeat(4,min(80px,18vw));gap:8px;background:#1a1a1a;padding:12px;border-radius:12px;border:2px solid var(--card-border)"></div>
<div class="controls" style="margin-top:16px">
<button ontouchstart="buySeed();event.preventDefault()" onclick="buySeed()" style="width:140px">Acheter graine</button>
<button ontouchstart="sell();event.preventDefault()" onclick="sell()" style="width:140px;background:#22c55e;color:#fff">Tout vendre</button>
</div>
<div class="overlay" id="overlay"><h2>Terminé</h2><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var plots,money,seeds,timer;
var STAGES=['🌱','🌿','🌾'];
function init(){plots=[];for(var i=0;i<12;i++)plots.push({stage:-1});money=50;seeds=5;document.getElementById('money').textContent='50';document.getElementById('seeds').textContent='5';document.getElementById('overlay').classList.remove('show');render();if(timer)clearInterval(timer);timer=setInterval(grow,1000);}
function grow(){plots.forEach(function(p){if(p.stage>=0&&p.stage<2)p.stage++;});render();}
function buySeed(){if(money<10||seeds>=10)return;money-=10;seeds++;document.getElementById('money').textContent=money;document.getElementById('seeds').textContent=seeds;}
window.buySeed=buySeed;
function sell(){var total=0;plots.forEach(function(p){if(p.stage===2){total+=30;p.stage=-1;}});money+=total;document.getElementById('money').textContent=money;render();}
window.sell=sell;
function render(){var g=document.getElementById('grid');g.innerHTML='';plots.forEach(function(p,i){var d=document.createElement('div');d.style.cssText='width:100%;aspect-ratio:1;background:'+(p.stage===2?'#22c55e':p.stage>=0?'#3a3a1a':'#2a2a2a')+';border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:32px;cursor:pointer';d.textContent=p.stage>=0?STAGES[p.stage]:'🟫';d.onclick=function(){if(p.stage===2){money+=30;document.getElementById('money').textContent=money;p.stage=-1;render();}else if(p.stage<0&&seeds>0){seeds--;p.stage=0;document.getElementById('seeds').textContent=seeds;render();}};d.ontouchstart=function(e){e.preventDefault();d.onclick();};g.appendChild(d);});}
function reset(){init();}
window.reset=reset;
init();
`, "ferme");
}

function restaurant(): string {
  return wrap("Restaurant", `
<h1>🍽️ <span>Restaurant</span></h1>
<div class="stats"><span>Argent : <strong id="money">100</strong> €</span><span>Temps : <strong id="time">60</strong>s</span></div>
<div id="orders" style="background:#1a1a1a;padding:16px;border-radius:12px;border:2px solid var(--card-border);min-width:400px;min-height:200px"></div>
<div id="menu" style="display:flex;gap:12px;margin-top:16px;flex-wrap:wrap;justify-content:center"></div>
<div class="overlay" id="overlay"><h2>Terminé</h2><p>Argent : <strong id="finalScore">0</strong></p><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var money,t,over,currentCustomer,waitTime,timer;
var MENU=[{n:'Pizza',price:15},{n:'Burger',price:12},{n:'Sushi',price:20},{n:'Pates',price:14}];
function init(){money=100;t=60;over=false;currentCustomer=null;waitTime=0;document.getElementById('money').textContent='100';document.getElementById('time').textContent='60';document.getElementById('overlay').classList.remove('show');if(timer)clearInterval(timer);timer=setInterval(tick,1000);spawn();renderMenu();}
function tick(){if(over)return;t--;document.getElementById('time').textContent=t;if(t<=0){over=true;document.getElementById('finalScore').textContent=money;document.getElementById('overlay').classList.add('show');}if(currentCustomer){waitTime--;if(waitTime<=0){currentCustomer=null;renderOrders();}else renderOrders();}else if(Math.random()<0.4){spawn();}}
function spawn(){currentCustomer=MENU[Math.floor(Math.random()*MENU.length)];waitTime=10;renderOrders();}
function serve(itemName){if(!currentCustomer)return;if(currentCustomer.n===itemName){money+=currentCustomer.price;document.getElementById('money').textContent=money;currentCustomer=null;}else{money=Math.max(0,money-5);document.getElementById('money').textContent=money;}renderOrders();}
window.serve=serve;
function renderOrders(){var h='<p style="color:#888;text-align:center">Client actuel</p>';if(currentCustomer)h+='<div style="text-align:center"><p style="font-size:32px">'+currentCustomer.n+'</p><p style="color:#facc15">'+waitTime+'s</p></div>';else h+='<p style="text-align:center;font-size:40px">🚪</p>';document.getElementById('orders').innerHTML=h;}
function renderMenu(){var m=document.getElementById('menu');m.innerHTML='';MENU.forEach(function(item){var b=document.createElement('button');b.style.cssText='padding:14px;font-weight:900;background:#2a2a2a;color:#fff;border:2px solid #3a3a3a;border-radius:12px;cursor:pointer;font-family:inherit';b.textContent=item.n;b.onclick=function(){serve(item.n);};b.ontouchstart=function(e){e.preventDefault();serve(item.n);};m.appendChild(b);});}
function reset(){init();}
window.reset=reset;
init();
`, "restaurant-sim");
}

function aquarium(): string {
  return wrap("Aquarium", `
<h1>🐠 <span>Aquarium</span></h1>
<div class="stats"><span>Poissons : <strong id="count">1</strong></span><span>Argent : <strong id="money">50</strong> €</span></div>
<canvas id="game" width="600" height="400" style="width:min(600px,90vw)"></canvas>
<div class="controls">
<button ontouchstart="feed();event.preventDefault()" onclick="feed()" style="width:140px;background:#22c55e;color:#fff">Nourrir</button>
<button ontouchstart="buyFish();event.preventDefault()" onclick="buyFish()" style="width:140px;background:#3b82f6;color:#fff">Acheter 20</button>
</div>
<div class="overlay" id="overlay"><h2>Terminé</h2><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var c=document.getElementById('game'),x=c.getContext('2d'),W=c.width,H=c.height;
var fishes,food,money,loop,t;
var EMOJI=['🐟','🐠','🐡'];
function init(){fishes=[{x:W/2,y:H/2,emoji:'🐟',vx:1,vy:0.5,hunger:100}];food=[];money=50;t=0;document.getElementById('count').textContent='1';document.getElementById('money').textContent='50';document.getElementById('overlay').classList.remove('show');}
function feed(){if(money<5)return;money-=5;document.getElementById('money').textContent=money;for(var i=0;i<5;i++)food.push({x:Math.random()*W,y:0,vy:1+Math.random()});}
window.feed=feed;
function buyFish(){if(money<20)return;money-=20;document.getElementById('money').textContent=money;fishes.push({x:W/2,y:H/2,emoji:EMOJI[Math.floor(Math.random()*EMOJI.length)],vx:(Math.random()-0.5)*2,vy:(Math.random()-0.5)*2,hunger:100});document.getElementById('count').textContent=fishes.length;}
window.buyFish=buyFish;
function upd(){t++;fishes.forEach(function(f){f.x+=f.vx;f.y+=f.vy;if(f.x<30||f.x>W-30)f.vx*=-1;if(f.y<30||f.y>H-30)f.vy*=-1;f.hunger-=0.02;if(f.hunger<=0)f.dead=true;});fishes=fishes.filter(function(f){return !f.dead;});document.getElementById('count').textContent=fishes.length;food.forEach(function(fo){fo.y+=fo.vy;});food=food.filter(function(fo){return fo.y<H;});food.forEach(function(fo){fishes.forEach(function(f){if(Math.hypot(fo.x-f.x,fo.y-f.y)<30){fo.dead=true;f.hunger=Math.min(100,f.hunger+30);money+=2;document.getElementById('money').textContent=money;}});});food=food.filter(function(fo){return !fo.dead;});}
function draw(){x.fillStyle='#001a2e';x.fillRect(0,0,W,H);x.font='32px system-ui';fishes.forEach(function(f){x.fillText(f.emoji,f.x,f.y);x.fillStyle='#22c55e';x.fillRect(f.x-15,f.y+10,30*(f.hunger/100),3);x.fillStyle='#fff';});x.fillStyle='#fbbf24';food.forEach(function(fo){x.beginPath();x.arc(fo.x,fo.y,4,0,Math.PI*2);x.fill();});}
function tick(){upd();draw();}
function reset(){init();if(loop)clearInterval(loop);loop=setInterval(tick,20);}
window.reset=reset;
reset();
`, "aquarium");
}

function ville(): string {
  return wrap("Ville", `
<h1>🏙️ <span>Ville</span></h1>
<div class="stats"><span>Or : <strong id="money">200</strong></span><span>Pop : <strong id="pop">0</strong></span></div>
<div id="grid" style="display:grid;grid-template-columns:repeat(6,min(60px,14vw));gap:4px;background:#1a1a1a;padding:12px;border-radius:12px;border:2px solid var(--card-border)"></div>
<div class="controls" style="margin-top:16px">
<button ontouchstart="setBuild('house');event.preventDefault()" onclick="setBuild('house')" style="background:#22c55e;color:#fff">Maison 50</button>
<button ontouchstart="setBuild('factory');event.preventDefault()" onclick="setBuild('factory')" style="background:#f97316;color:#fff">Usine 200</button>
<button ontouchstart="setBuild('park');event.preventDefault()" onclick="setBuild('park')" style="background:#84cc16;color:#fff">Parc 100</button>
</div>
<div class="overlay" id="overlay"><h2>Terminé</h2><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var grid,money,pop,buildType,tickTimer;
function init(){grid=[];for(var i=0;i<36;i++)grid.push(null);money=200;pop=0;buildType='house';document.getElementById('money').textContent='200';document.getElementById('pop').textContent='0';document.getElementById('overlay').classList.remove('show');if(tickTimer)clearInterval(tickTimer);tickTimer=setInterval(tick,1000);render();}
function setBuild(t){buildType=t;}
window.setBuild=setBuild;
function build(i){if(grid[i])return;var cost=buildType==='house'?50:buildType==='factory'?200:100;if(money<cost)return;money-=cost;grid[i]=buildType;document.getElementById('money').textContent=money;render();}
window.build=build;
function tick(){var income=0;grid.forEach(function(b){if(b==='house')income+=5;if(b==='factory')income+=20;if(b==='park')income+=2;});money+=income;pop=grid.filter(function(b){return b==='house';}).length*10;document.getElementById('money').textContent=money;document.getElementById('pop').textContent=pop;}
function render(){var g=document.getElementById('grid');g.innerHTML='';grid.forEach(function(b,i){var d=document.createElement('div');d.style.cssText='width:100%;aspect-ratio:1;background:#2a2a2a;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:22px;cursor:pointer';d.textContent=b==='house'?'H':b==='factory'?'F':b==='park'?'P':'';d.onclick=function(){build(i);};d.ontouchstart=function(e){e.preventDefault();build(i);};g.appendChild(d);});}
function reset(){init();}
window.reset=reset;
init();
`, "city-builder");
}

function hopital(): string {
  return wrap("Hôpital", `
<h1>🏥 <span>Hôpital</span></h1>
<div class="stats"><span>Argent : <strong id="money">100</strong> €</span><span>Réputation : <strong id="rep">100</strong>%</span></div>
<div id="patients" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;background:#1a1a1a;padding:16px;border-radius:12px;border:2px solid var(--card-border);min-height:250px;min-width:400px"></div>
<div class="overlay" id="overlay"><h2>Terminé</h2><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var patients,money,rep,timer,over;
var SYMPTOMS=['Fievre','Blessure','Nausee','Rhume','Toux'];
function init(){patients=[];money=100;rep=100;over=false;document.getElementById('money').textContent='100';document.getElementById('rep').textContent='100';document.getElementById('overlay').classList.remove('show');if(timer)clearInterval(timer);timer=setInterval(tick,1000);spawn();}
function spawn(){while(patients.length<4)patients.push({sym:SYMPTOMS[Math.floor(Math.random()*SYMPTOMS.length)],timer:15,id:Math.random()});}
function tick(){patients.forEach(function(p){p.timer--;if(p.timer<=0){p.dead=true;rep=Math.max(0,rep-10);document.getElementById('rep').textContent=rep;if(rep<=0){over=true;document.getElementById('overlay').classList.add('show');}}});patients=patients.filter(function(p){return !p.dead;});if(patients.length<3)spawn();render();}
function heal(id){var idx=-1;for(var i=0;i<patients.length;i++)if(patients[i].id===id)idx=i;if(idx<0)return;money+=30;rep=Math.min(100,rep+2);document.getElementById('money').textContent=money;document.getElementById('rep').textContent=rep;patients.splice(idx,1);spawn();render();}
window.heal=heal;
function render(){var g=document.getElementById('patients');g.innerHTML='';patients.forEach(function(p){var d=document.createElement('div');d.style.cssText='background:#2a2a2a;padding:16px;border-radius:12px;text-align:center;cursor:pointer;border:2px solid '+(p.timer<5?'#ef4444':'#3a3a3a');d.innerHTML='<p style="font-size:20px;font-weight:900">'+p.sym+'</p><p style="color:#facc15">'+p.timer+'s</p>';d.onclick=function(){heal(p.id);};d.ontouchstart=function(e){e.preventDefault();heal(p.id);};g.appendChild(d);});}
function reset(){init();}
window.reset=reset;
init();
`, "hospital-sim");
}

function aeroport(): string {
  return wrap("Aéroport", `
<h1>✈️ <span>Aéroport</span></h1>
<div class="stats"><span>Atterris : <strong id="landed">0</strong></span><span>Crashs : <strong id="crashed">0</strong></span></div>
<canvas id="game" width="600" height="400" style="width:min(600px,90vw)"></canvas>
<div class="controls"><button ontouchstart="land();event.preventDefault()" onclick="land()" style="width:200px;background:#22c55e;color:#fff">Atterrir avion sel.</button></div>
<div class="overlay" id="overlay"><h2>Terminé</h2><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var c=document.getElementById('game'),x=c.getContext('2d'),W=c.width,H=c.height;
var planes,landed,crashed,over,loop,spawnT,selected;
function init(){planes=[];landed=0;crashed=0;over=false;spawnT=0;selected=null;document.getElementById('landed').textContent='0';document.getElementById('crashed').textContent='0';document.getElementById('overlay').classList.remove('show');}
function land(){if(!selected||over)return;if(selected.y<150&&Math.abs(selected.x-W/2)<80){landed++;document.getElementById('landed').textContent=landed;planes=planes.filter(function(p){return p.id!==selected.id;});selected=null;}else{crashed++;document.getElementById('crashed').textContent=crashed;planes=planes.filter(function(p){return p.id!==selected.id;});selected=null;if(crashed>=3){over=true;document.getElementById('overlay').classList.add('show');}}}
window.land=land;
function upd(){spawnT++;if(spawnT>90){spawnT=0;planes.push({x:Math.random()*W,y:0,vx:(Math.random()-0.5)*1.5,vy:1,id:Math.random()});}planes.forEach(function(p){p.x+=p.vx;p.y+=p.vy;if(p.x<20||p.x>W-20)p.vx*=-1;});planes.forEach(function(p){if(p.y>H){p.dead=true;crashed++;document.getElementById('crashed').textContent=crashed;if(crashed>=3){over=true;document.getElementById('overlay').classList.add('show');}}});planes=planes.filter(function(p){return !p.dead;});}
function draw(){x.fillStyle='#0a1414';x.fillRect(0,0,W,H);x.fillStyle='#1a1a1a';x.fillRect(0,H-30,W,30);x.strokeStyle='#22c55e';x.lineWidth=2;x.strokeRect(W/2-80,0,160,150);x.fillStyle='#22c55e';x.font='12px system-ui';x.fillText('ZONE',W/2-20,12);x.font='40px system-ui';planes.forEach(function(p){x.fillStyle=p===selected?'#22c55e':'#fff';x.fillText('✈',p.x-20,p.y);});}
function select(e){e.preventDefault();var r=c.getBoundingClientRect();var mx,my;if(e.touches){mx=(e.touches[0].clientX-r.left)*(W/r.width);my=(e.touches[0].clientY-r.top)*(H/r.height);}else{mx=(e.clientX-r.left)*(W/r.width);my=(e.clientY-r.top)*(H/r.height);}var closest=null;var minD=50;planes.forEach(function(p){var d=Math.hypot(p.x-mx,p.y-my);if(d<minD){minD=d;closest=p;}});selected=closest;}
function tick(){if(!over)upd();draw();}
function reset(){init();if(loop)clearInterval(loop);loop=setInterval(tick,20);}
window.reset=reset;
c.addEventListener('click',select);
c.addEventListener('touchstart',select,{passive:false});
reset();
`, "airport-sim");
}

function bourse(): string {
  return wrap("Bourse", `
<h1>📈 <span>Bourse</span></h1>
<div class="stats"><span>Argent : <strong id="money">1000</strong> €</span><span>Actions : <strong id="shares">0</strong></span><span>Prix : <strong id="price">50</strong> €</span></div>
<canvas id="game" width="600" height="300" style="width:min(600px,90vw)"></canvas>
<div class="controls" style="margin-top:16px">
<button ontouchstart="buy();event.preventDefault()" onclick="buy()" style="background:#22c55e;color:#fff;width:120px">Acheter</button>
<button ontouchstart="sell();event.preventDefault()" onclick="sell()" style="background:#ef4444;color:#fff;width:120px">Vendre</button>
</div>
<div class="overlay" id="overlay"><h2>Terminé</h2><p>Argent final : <strong id="finalScore">0</strong></p><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var c=document.getElementById('game'),x=c.getContext('2d'),W=c.width,H=c.height;
var money,shares,price,history,t,timer,over;
var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';
function init(){money=1000;shares=0;price=50;history=[50];t=0;over=false;document.getElementById('money').textContent='1000';document.getElementById('shares').textContent='0';document.getElementById('price').textContent='50';document.getElementById('overlay').classList.remove('show');if(timer)clearInterval(timer);timer=setInterval(tick,1000);}
function tick(){t++;var change=(Math.random()-0.48)*price*0.15;price=Math.max(5,price+change);history.push(price);if(history.length>60)history.shift();document.getElementById('price').textContent=Math.floor(price);if(t>=60){over=true;document.getElementById('finalScore').textContent=Math.floor(money+shares*price);document.getElementById('overlay').classList.add('show');}}
function buy(){if(over||money<price)return;money-=price;shares++;document.getElementById('money').textContent=Math.floor(money);document.getElementById('shares').textContent=shares;}
function sell(){if(over||shares<=0)return;money+=price;shares--;document.getElementById('money').textContent=Math.floor(money);document.getElementById('shares').textContent=shares;}
window.buy=buy;window.sell=sell;
function draw(){x.fillStyle='#0a0a0a';x.fillRect(0,0,W,H);if(history.length>1){var min=Math.min.apply(null,history);var max=Math.max.apply(null,history);x.strokeStyle=ACC;x.lineWidth=3;x.beginPath();history.forEach(function(p,i){var px=(i/(history.length-1))*W;var py=H-((p-min)/(max-min||1))*(H-40)-20;if(i===0)x.moveTo(px,py);else x.lineTo(px,py);});x.stroke();}}
function tick2(){draw();}
function reset(){init();}
window.reset=reset;
init();
if(!window.loopSet){window.loopSet=true;setInterval(tick2,100);}
`, "stock-market");
}

function startupTycoon(): string {
  return wrap("Startup Tycoon", `
<h1>🚀 <span>Startup Tycoon</span></h1>
<div class="stats"><span>Cash : <strong id="money">5000</strong> €</span><span>Users : <strong id="users">0</strong></span></div>
<div id="shop" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px;max-width:600px;padding:16px"></div>
<div class="overlay" id="overlay"><h2>Terminé</h2><p>Valeur : <strong id="finalScore">0</strong></p><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var money,users,t,timer,over,actions;
var ALL=[
{n:"Dev",cost:1000,effect:'users'},
{n:"Pub",cost:2000,effect:'users'},
{n:"Sales",cost:3000,effect:'users'},
{n:"Marketing",cost:5000,effect:'users'},
{n:"CTO",cost:10000,effect:'users'}
];
function init(){money=5000;users=0;t=0;over=false;actions=ALL.map(function(a){return Object.assign({},a);});document.getElementById('money').textContent='5000';document.getElementById('users').textContent='0';document.getElementById('overlay').classList.remove('show');render();if(timer)clearInterval(timer);timer=setInterval(tick,1000);}
function buy(i){if(money<actions[i].cost)return;money-=actions[i].cost;users+=200;actions[i].cost=Math.floor(actions[i].cost*1.3);document.getElementById('money').textContent=money;document.getElementById('users').textContent=users;render();}
window.buy=buy;
function tick(){t++;money+=Math.floor(users*0.5);document.getElementById('money').textContent=money;users+=5;document.getElementById('users').textContent=users;if(t>=120){over=true;document.getElementById('finalScore').textContent=Math.floor(money+users*10);document.getElementById('overlay').classList.add('show');}}
function render(){var s=document.getElementById('shop');s.innerHTML='';actions.forEach(function(a,i){var d=document.createElement('div');d.style.cssText='background:#1a1a1a;padding:14px;border-radius:12px;border:2px solid '+(money>=a.cost?'#22c55e':'#333')+';cursor:pointer';d.onclick=function(){buy(i);};d.ontouchstart=function(e){e.preventDefault();buy(i);};d.innerHTML='<div style="font-weight:900">'+a.n+'</div><div style="color:#facc15;font-weight:900">'+a.cost+' €</div>';s.appendChild(d);});}
function reset(){init();}
window.reset=reset;
init();
`, "startup-tycoon");
}

// ═══════════════════════════════════════════════════════════════
// PAQUET 8 : DIVERS
// ═══════════════════════════════════════════════════════════════

function piano(): string {
  return wrap("Piano", `
<h1>🎹 <span>Piano</span></h1>
<div class="stats"><span>Notes : <strong id="notes">0</strong></span></div>
<div id="piano" style="display:flex;gap:4px;background:#1a1a1a;padding:20px;border-radius:12px;border:2px solid var(--card-border);margin-top:20px"></div>
<div class="overlay" id="overlay"><h2>Bravo !</h2><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var NOTES=[{n:'Do',f:261.63},{n:'Re',f:293.66},{n:'Mi',f:329.63},{n:'Fa',f:349.23},{n:'Sol',f:392.00},{n:'La',f:440.00},{n:'Si',f:493.88},{n:'Do2',f:523.25}];
var count=0,audioCtx=null;
function play(freq){if(!audioCtx)audioCtx=new (window.AudioContext||window.webkitAudioContext)();var osc=audioCtx.createOscillator();var gain=audioCtx.createGain();osc.connect(gain);gain.connect(audioCtx.destination);osc.frequency.value=freq;osc.type='sine';gain.gain.setValueAtTime(0.3,audioCtx.currentTime);gain.gain.exponentialRampToValueAtTime(0.001,audioCtx.currentTime+0.5);osc.start();osc.stop(audioCtx.currentTime+0.5);count++;document.getElementById('notes').textContent=count;}
function init(){count=0;document.getElementById('notes').textContent='0';document.getElementById('overlay').classList.remove('show');render();}
function render(){var p=document.getElementById('piano');p.innerHTML='';NOTES.forEach(function(n){var b=document.createElement('div');b.style.cssText='width:60px;height:200px;background:linear-gradient(180deg,#fff,#eee);border-radius:8px;display:flex;align-items:flex-end;justify-content:center;padding-bottom:16px;font-weight:900;color:#000;cursor:pointer;user-select:none;font-size:14px';b.textContent=n.n;b.onmousedown=function(){play(n.f);};b.ontouchstart=function(e){e.preventDefault();play(n.f);};p.appendChild(b);});}
function reset(){init();}
window.reset=reset;
init();
`, "musique");
}

function guitare(): string {
  return wrap("Guitare", `
<h1>🎸 <span>Guitare</span></h1>
<div class="stats"><span>Accords : <strong id="notes">0</strong></span></div>
<div id="strings" style="display:flex;flex-direction:column;gap:14px;background:#1a1a1a;padding:30px;border-radius:12px;border:2px solid var(--card-border);margin-top:20px;min-width:320px"></div>
<div class="overlay" id="overlay"><h2>Bravo !</h2><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var STRINGS=[{n:'Mi aigu',f:329.63},{n:'Si',f:246.94},{n:'Sol',f:196.00},{n:'Re',f:146.83},{n:'La',f:110.00},{n:'Mi grave',f:82.41}];
var count=0,audioCtx=null;
function play(freq){if(!audioCtx)audioCtx=new (window.AudioContext||window.webkitAudioContext)();var osc=audioCtx.createOscillator();var gain=audioCtx.createGain();osc.connect(gain);gain.connect(audioCtx.destination);osc.frequency.value=freq;osc.type='triangle';gain.gain.setValueAtTime(0.4,audioCtx.currentTime);gain.gain.exponentialRampToValueAtTime(0.001,audioCtx.currentTime+1);osc.start();osc.stop(audioCtx.currentTime+1);count++;document.getElementById('notes').textContent=count;}
function init(){count=0;document.getElementById('notes').textContent='0';document.getElementById('overlay').classList.remove('show');render();}
function render(){var s=document.getElementById('strings');s.innerHTML='';var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';STRINGS.forEach(function(st){var b=document.createElement('div');b.style.cssText='height:8px;background:linear-gradient(90deg,'+ACC+',#fff);border-radius:4px;cursor:pointer;position:relative';b.onclick=function(){play(st.f);};b.ontouchstart=function(e){e.preventDefault();play(st.f);};var label=document.createElement('span');label.textContent=st.n;label.style.cssText='position:absolute;left:-90px;top:-8px;color:#fff;font-size:12px;font-weight:900';b.appendChild(label);s.appendChild(b);});}
function reset(){init();}
window.reset=reset;
init();
`, "guitare");
}

function batterie(): string {
  return wrap("Batterie", `
<h1>🥁 <span>Batterie</span></h1>
<div class="stats"><span>Frappes : <strong id="hits">0</strong></span></div>
<div id="drums" style="display:grid;grid-template-columns:repeat(2,1fr);gap:16px;background:#1a1a1a;padding:30px;border-radius:12px;border:2px solid var(--card-border);margin-top:20px;max-width:500px"></div>
<div class="overlay" id="overlay"><h2>Bravo !</h2><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var DRUMS=[{n:'Grosse caisse',f:60,color:'#ef4444'},{n:'Caisse claire',f:200,color:'#f97316'},{n:'Charleston',f:800,color:'#facc15'},{n:'Tom',f:120,color:'#22c55e'}];
var count=0,audioCtx=null;
function play(f){if(!audioCtx)audioCtx=new (window.AudioContext||window.webkitAudioContext)();var osc=audioCtx.createOscillator();var gain=audioCtx.createGain();osc.connect(gain);gain.connect(audioCtx.destination);osc.frequency.value=f;osc.type='square';gain.gain.setValueAtTime(0.2,audioCtx.currentTime);gain.gain.exponentialRampToValueAtTime(0.001,audioCtx.currentTime+0.15);osc.start();osc.stop(audioCtx.currentTime+0.15);count++;document.getElementById('hits').textContent=count;}
function init(){count=0;document.getElementById('hits').textContent='0';document.getElementById('overlay').classList.remove('show');render();}
function render(){var d=document.getElementById('drums');d.innerHTML='';DRUMS.forEach(function(dr){var b=document.createElement('div');b.style.cssText='aspect-ratio:1;background:radial-gradient(circle,'+dr.color+',#1a1a1a);border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:900;color:#fff;cursor:pointer;user-select:none;font-size:16px;padding:20px;text-align:center;border:4px solid rgba(255,255,255,0.2)';b.textContent=dr.n;b.onmousedown=function(){play(dr.f);};b.ontouchstart=function(e){e.preventDefault();play(dr.f);};d.appendChild(b);});}
function reset(){init();}
window.reset=reset;
init();
`, "batterie");
}

function musicMemory(): string {
  return wrap("Music Memory", `
<h1>🎵 <span>Music Memory</span></h1>
<div class="stats"><span>Niveau : <strong id="level">1</strong></span></div>
<div id="pads" style="display:grid;grid-template-columns:repeat(2,min(120px,35vw));grid-template-rows:repeat(2,min(120px,35vw));gap:12px;margin-top:20px"></div>
<div class="overlay" id="overlay"><h2>Perdu</h2><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var NOTES=[{f:261.63,c:'#ef4444'},{f:329.63,c:'#3b82f6'},{f:392.00,c:'#22c55e'},{f:523.25,c:'#facc15'}];
var seq,input,lock,level,over,audioCtx=null;
function play(f,dur){if(!audioCtx)audioCtx=new (window.AudioContext||window.webkitAudioContext)();var osc=audioCtx.createOscillator();var gain=audioCtx.createGain();osc.connect(gain);gain.connect(audioCtx.destination);osc.frequency.value=f;osc.type='sine';gain.gain.setValueAtTime(0.3,audioCtx.currentTime);gain.gain.exponentialRampToValueAtTime(0.001,audioCtx.currentTime+dur/1000);osc.start();osc.stop(audioCtx.currentTime+dur/1000);}
function init(){seq=[];input=[];lock=true;level=0;over=false;document.getElementById('overlay').classList.remove('show');render();setTimeout(next,500);}
function render(){var p=document.getElementById('pads');p.innerHTML='';NOTES.forEach(function(n,i){var b=document.createElement('div');b.style.cssText='background:'+n.c+';border-radius:20px;cursor:pointer;opacity:.4;transition:opacity .2s';b.onclick=function(){press(i);};b.ontouchstart=function(e){e.preventDefault();press(i);};b.dataset.idx=i;p.appendChild(b);});}
function light(i,dur){var b=document.querySelector('[data-idx="'+i+'"]');if(!b)return;b.style.opacity='1';play(NOTES[i].f,dur||300);setTimeout(function(){b.style.opacity='.4';},dur||300);}
function next(){level++;document.getElementById('level').textContent=level;seq.push(Math.floor(Math.random()*4));input=[];lock=true;var i=0;var iv=setInterval(function(){if(i>=seq.length){clearInterval(iv);lock=false;return;}light(seq[i],400);i++;},700);}
function press(i){if(lock)return;light(i,200);input.push(i);if(input[input.length-1]!==seq[input.length-1]){over=true;document.getElementById('overlay').classList.add('show');return;}if(input.length===seq.length){lock=true;setTimeout(next,700);}}
function reset(){init();}
window.reset=reset;
init();
`, "musique");
}

function voyage(): string {
  return wrap("Voyage", `
<h1>✈️ <span>Voyage</span></h1>
<div class="stats"><span>Km : <strong id="km">0</strong></span></div>
<canvas id="game" width="600" height="400" style="width:min(600px,90vw)"></canvas>
<div class="controls"><button ontouchstart="fly();event.preventDefault()" onclick="fly()" style="width:200px;background:#3b82f6;color:#fff">VOLER</button></div>
<div class="overlay" id="overlay"><h2>Arrive !</h2><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var c=document.getElementById('game'),x=c.getContext('2d'),W=c.width,H=c.height;
var plane,clouds,km,over,loop;
var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';
function init(){plane={x:100,y:H/2-20,w:60,h:30};clouds=[];for(var i=0;i<10;i++)clouds.push({x:Math.random()*W,y:50+Math.random()*(H-150),w:80,h:40,speed:0.5+Math.random()*2});km=0;over=false;document.getElementById('km').textContent='0';document.getElementById('overlay').classList.remove('show');}
function fly(){if(over)return;plane.y-=20;if(plane.y<20)plane.y=20;}
window.fly=fly;
function upd(){plane.y+=0.5;if(plane.y>H-100)plane.y=H-100;clouds.forEach(function(cl){cl.x-=cl.speed;});clouds=clouds.filter(function(cl){return cl.x+cl.w>0;});while(clouds.length<12)clouds.push({x:W+Math.random()*100,y:50+Math.random()*(H-150),w:80,h:40,speed:0.5+Math.random()*2});km+=0.1;document.getElementById('km').textContent=Math.floor(km);if(km>=1000){over=true;document.getElementById('overlay').classList.add('show');}}
function draw(){x.fillStyle='#87ceeb';x.fillRect(0,0,W,H);x.fillStyle='#7cb342';x.fillRect(0,H-60,W,60);x.fillStyle='#fff';clouds.forEach(function(cl){x.beginPath();x.ellipse(cl.x+cl.w/2,cl.y+cl.h/2,cl.w/2,cl.h/2,0,0,Math.PI*2);x.fill();});x.fillStyle=ACC;x.beginPath();x.moveTo(plane.x+plane.w,plane.y+plane.h/2);x.lineTo(plane.x,plane.y);x.lineTo(plane.x+15,plane.y+plane.h/2);x.lineTo(plane.x,plane.y+plane.h);x.closePath();x.fill();}
function tick(){if(!over)upd();draw();}
function reset(){init();if(loop)clearInterval(loop);loop=setInterval(tick,20);}
window.reset=reset;
document.addEventListener('keydown',function(e){if(e.key===' '||e.key==='ArrowUp'){fly();e.preventDefault();}});
c.addEventListener('click',fly);
c.addEventListener('touchstart',function(e){e.preventDefault();fly();},{passive:false});
reset();
`, "voyage");
}

function livres(): string {
  return wrap("Bibliotheque", `
<h1>📚 <span>Bibliotheque</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Livres : <strong id="count">0</strong>/8</span></div>
<div id="board" style="background:#1a1a1a;padding:24px;border-radius:12px;border:2px solid var(--card-border);text-align:center;max-width:500px"></div>
<div class="overlay" id="overlay"><h2>Termine</h2><p>Score : <strong id="finalScore">0</strong></p><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var BOOKS=[
{n:"Le Petit Prince",a:"Saint-Exupery"},
{n:"1984",a:"George Orwell"},
{n:"L'Etranger",a:"Albert Camus"},
{n:"Les Miserables",a:"Victor Hugo"},
{n:"Madame Bovary",a:"Gustave Flaubert"},
{n:"Notre-Dame de Paris",a:"Victor Hugo"},
{n:"Le Rouge et le Noir",a:"Stendhal"},
{n:"Germinal",a:"Emile Zola"}
];
var idx,score,over;
function init(){idx=0;score=0;over=false;document.getElementById('score').textContent='0';document.getElementById('count').textContent='0';document.getElementById('overlay').classList.remove('show');next();}
function next(){if(idx>=BOOKS.length){over=true;document.getElementById('finalScore').textContent=score;document.getElementById('overlay').classList.add('show');return;}document.getElementById('count').textContent=idx+'/'+BOOKS.length;var book=BOOKS[idx];var ch=[book.a];while(ch.length<4){var fake=BOOKS[Math.floor(Math.random()*BOOKS.length)].a;if(ch.indexOf(fake)<0)ch.push(fake);}ch.sort(function(){return Math.random()-0.5;});window._ch=ch;var h='<p style="font-size:24px;color:#fff;font-weight:900;margin-bottom:20px">'+book.n+'</p><p style="color:#888;margin-bottom:20px">Qui est l auteur ?</p><div style="display:flex;flex-direction:column;gap:10px">';ch.forEach(function(c,ci){h+='<button ontouchstart="pick('+ci+');event.preventDefault()" onclick="pick('+ci+')" style="padding:14px;background:#2a2a2a;color:#fff;border:2px solid #3a3a3a;border-radius:10px;cursor:pointer;font-family:inherit;font-weight:700;font-size:14px">'+c+'</button>';});h+='</div>';document.getElementById('board').innerHTML=h;}
function pick(i){if(over)return;if(window._ch[i]===BOOKS[idx].a)score+=15;idx++;document.getElementById('score').textContent=score;next();}
window.pick=pick;
function reset(){init();}
window.reset=reset;
init();
`, "livres");
}

function papeterie(): string {
  return wrap("Papeterie", `
<h1>✏️ <span>Papeterie</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Temps : <strong id="time">60</strong>s</span></div>
<div id="board" style="display:flex;flex-wrap:wrap;gap:12px;background:#1a1a1a;padding:24px;border-radius:12px;border:2px solid var(--card-border);max-width:500px;justify-content:center"></div>
<div class="overlay" id="overlay"><h2>Termine</h2><p>Score : <strong id="finalScore">0</strong></p><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var items,timer,score,timeLeft,over,target;
var ALL=['Pencil','Pen','Ruler','Eraser','Scissors','Paper'];
function init(){items=[];score=0;timeLeft=60;over=false;document.getElementById('score').textContent='0';document.getElementById('time').textContent='60';document.getElementById('overlay').classList.remove('show');spawn();render();if(timer)clearInterval(timer);timer=setInterval(tick,1000);}
function spawn(){target=ALL[Math.floor(Math.random()*ALL.length)];items=[];for(var i=0;i<8;i++)items.push(ALL[Math.floor(Math.random()*ALL.length)]);items.push(target);items.sort(function(){return Math.random()-0.5;});}
function tick(){if(over)return;timeLeft--;document.getElementById('time').textContent=timeLeft;if(timeLeft<=0){over=true;document.getElementById('finalScore').textContent=score;document.getElementById('overlay').classList.add('show');}}
function pick(idx){if(over)return;if(items[idx]===target){score+=10;document.getElementById('score').textContent=score;spawn();render();}else{score=Math.max(0,score-3);document.getElementById('score').textContent=score;}}
window.pick=pick;
function render(){var b=document.getElementById('board');var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';b.innerHTML='<p style="width:100%;text-align:center;color:'+ACC+';font-weight:900;font-size:16px;margin-bottom:12px">Trouve : '+target+'</p>';items.forEach(function(it,i){var el=document.createElement('div');el.style.cssText='width:100px;height:70px;background:#2a2a2a;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:14px;cursor:pointer;font-weight:700;color:#fff';el.textContent=it;el.onclick=function(){pick(i);};el.ontouchstart=function(e){e.preventDefault();pick(i);};b.appendChild(el);});}
function reset(){init();}
window.reset=reset;
init();
`, "papeterie");
}

function cuisine(): string {
  return wrap("Cuisine", `
<h1>Cuisine</h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Recette : <strong id="recipe">0</strong>/8</span></div>
<div id="board" style="background:#1a1a1a;padding:24px;border-radius:12px;border:2px solid var(--card-border);text-align:center;max-width:500px"></div>
<div class="overlay" id="overlay"><h2>Termine</h2><p>Score : <strong id="finalScore">0</strong></p><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var RECIPES=[
{name:"Pizza",ings:["Tomate","Fromage","Champignon","Pate"]},
{name:"Burger",ings:["Pain","Viande","Fromage","Salade"]},
{name:"Sushi",ings:["Riz","Poisson","Concombre","Algue"]},
{name:"Pates",ings:["Pates","Tomate","Ail","Basilic"]},
{name:"Salade",ings:["Salade","Tomate","Concombre","Olive"]},
{name:"Gateau",ings:["Farine","Fraise","Chocolat","Oeuf"]},
{name:"Paella",ings:["Riz","Crevette","Poulet","Poivron"]},
{name:"Ramen",ings:["Nouilles","Oeuf","Viande","Ciboule"]}
];
var idx,score,step,over,currentRecipe;
function init(){idx=0;score=0;over=false;document.getElementById('score').textContent='0';document.getElementById('recipe').textContent='0';document.getElementById('overlay').classList.remove('show');startRecipe();}
function startRecipe(){if(idx>=RECIPES.length){over=true;document.getElementById('finalScore').textContent=score;document.getElementById('overlay').classList.add('show');return;}document.getElementById('recipe').textContent=idx+'/'+RECIPES.length;currentRecipe=RECIPES[idx];step=0;render();}
function render(){var h='<p style="font-size:22px;color:#fff;font-weight:900;margin-bottom:16px">'+currentRecipe.name+'</p>';h+='<div style="display:flex;gap:12px;justify-content:center;margin-bottom:20px;font-size:14px;flex-wrap:wrap">';currentRecipe.ings.forEach(function(ing,i){h+='<div style="padding:8px;border-radius:12px;background:'+(i<step?'#22c55e':i===step?'#facc15':'#2a2a2a')+';color:'+(i===step?'#000':'#fff')+';font-weight:700">'+ing+'</div>';});h+='</div><p style="color:#888;margin-bottom:16px">Clique dans l ordre :</p><div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px">';var shuffled=currentRecipe.ings.slice().sort(function(){return Math.random()-0.5;});shuffled.forEach(function(ing){h+='<button ontouchstart="pick(\''+ing+'\');event.preventDefault()" onclick="pick(\''+ing+'\')" style="padding:16px;font-size:14px;background:#2a2a2a;color:#fff;border:2px solid #3a3a3a;border-radius:12px;cursor:pointer;font-family:inherit;font-weight:700">'+ing+'</button>';});h+='</div>';document.getElementById('board').innerHTML=h;}
function pick(ing){if(over)return;if(ing===currentRecipe.ings[step]){step++;if(step>=currentRecipe.ings.length){score+=20;document.getElementById('score').textContent=score;idx++;setTimeout(startRecipe,400);return;}render();}else{score=Math.max(0,score-5);document.getElementById('score').textContent=score;}}
window.pick=pick;
function reset(){init();}
window.reset=reset;
init();
`, "cuisine");
}

function livreur(): string {
  return wrap("Livreur", `
<h1>Livreur</h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Livraisons : <strong id="deliv">0</strong></span></div>
<canvas id="game" width="600" height="450" style="width:min(600px,90vw)"></canvas>
<div class="controls">
<button ontouchstart="mv('left');event.preventDefault()" onclick="mv('left')">←</button>
<button ontouchstart="mv('up');event.preventDefault()" onclick="mv('up')">UP</button>
<button ontouchstart="mv('down');event.preventDefault()" onclick="mv('down')">DN</button>
<button ontouchstart="mv('right');event.preventDefault()" onclick="mv('right')">→</button>
</div>
<div class="overlay" id="overlay"><h2>Termine</h2><p>Score : <strong id="finalScore">0</strong></p><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var c=document.getElementById('game'),x=c.getContext('2d'),W=c.width,H=c.height;
var player,orders,score,deliv,timeLeft,over,loop,t;
var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';
function init(){player={x:W/2,y:H/2,w:30,h:30};orders=[];score=0;deliv=0;timeLeft=60;over=false;t=0;document.getElementById('score').textContent='0';document.getElementById('deliv').textContent='0';document.getElementById('overlay').classList.remove('show');spawnOrder();}
function spawnOrder(){orders.push({x:50+Math.random()*(W-100),y:50+Math.random()*(H-100),timer:20});}
function mv(d){if(over)return;if(d==='left')player.x-=15;if(d==='right')player.x+=15;if(d==='up')player.y-=15;if(d==='down')player.y+=15;player.x=Math.max(0,Math.min(W-player.w,player.x));player.y=Math.max(0,Math.min(H-player.h,player.y));}
window.mv=mv;
function upd(){t++;if(t%60===0){timeLeft--;if(timeLeft<=0){over=true;document.getElementById('finalScore').textContent=score;document.getElementById('overlay').classList.add('show');return;}}orders.forEach(function(o){o.timer-=1/60;});orders=orders.filter(function(o){return o.timer>0;});while(orders.length<3)spawnOrder();orders.forEach(function(o){if(Math.hypot(player.x+15-o.x,player.y+15-o.y)<30){o.done=true;score+=20;deliv++;document.getElementById('score').textContent=score;document.getElementById('deliv').textContent=deliv;}});orders=orders.filter(function(o){return !o.done;});}
function draw(){x.fillStyle='#1a1a1a';x.fillRect(0,0,W,H);x.strokeStyle='#2a2a2a';for(var i=0;i<W;i+=60){x.beginPath();x.moveTo(i,0);x.lineTo(i,H);x.stroke();}for(var j=0;j<H;j+=60){x.beginPath();x.moveTo(0,j);x.lineTo(W,j);x.stroke();}x.fillStyle='#ef4444';orders.forEach(function(o){x.beginPath();x.arc(o.x,o.y,15,0,Math.PI*2);x.fill();x.fillStyle='#facc15';x.fillRect(o.x-20,o.y-30,40*(o.timer/20),4);x.fillStyle='#ef4444';});x.fillStyle=ACC;x.beginPath();x.arc(player.x+15,player.y+15,15,0,Math.PI*2);x.fill();x.fillStyle='#fff';x.font='16px system-ui';x.fillText('Temps: '+timeLeft+'s',W-120,25);}
function tick(){if(!over)upd();draw();}
function reset(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.reset=reset;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft'){mv('left');e.preventDefault();}if(e.key==='ArrowRight'){mv('right');e.preventDefault();}if(e.key==='ArrowUp'){mv('up');e.preventDefault();}if(e.key==='ArrowDown'){mv('down');e.preventDefault();}});
reset();
`, "livreur");
}

function flightSim(): string {
  return wrap("Flight Sim", `
<h1>Simulateur de Vol</h1>
<div class="stats"><span>Altitude : <strong id="alt">5000</strong> m</span><span>Vitesse : <strong id="vit">250</strong> km/h</span></div>
<canvas id="game" width="600" height="400" style="width:min(600px,90vw)"></canvas>
<div class="controls">
<button ontouchstart="ctrl('up');event.preventDefault()" onclick="ctrl('up')">UP</button>
<button ontouchstart="ctrl('down');event.preventDefault()" onclick="ctrl('down')">DN</button>
</div>
<div class="overlay" id="overlay"><h2 id="overTitle">Resultat</h2><p>Status : <strong id="status">-</strong></p><button ontouchstart="reset();event.preventDefault()" onclick="reset()">Rejouer</button></div>
`, `
var c=document.getElementById('game'),x=c.getContext('2d'),W=c.width,H=c.height;
var alt,vit,over,loop,throttle,t;
var ACC=getComputedStyle(document.body).getPropertyValue('--x')||'#d4af37';
function init(){alt=5000;vit=250;throttle=0;over=false;t=0;document.getElementById('alt').textContent='5000';document.getElementById('vit').textContent='250';document.getElementById('overlay').classList.remove('show');}
function ctrl(d){if(over)return;if(d==='up')throttle-=0.5;if(d==='down')throttle+=0.5;throttle=Math.max(-2,Math.min(2,throttle));}
window.ctrl=ctrl;
function upd(){t++;alt-=throttle*5;vit+=throttle*2;if(vit<100)vit=100;if(vit>500)vit=500;if(alt<0){alt=0;if(vit<300){over=true;document.getElementById('overTitle').textContent='Atterrissage reussi';document.getElementById('status').textContent='Parfait';}else{over=true;document.getElementById('overTitle').textContent='Crash';document.getElementById('status').textContent='Trop rapide';}document.getElementById('overlay').classList.add('show');}if(alt>10000)alt=10000;document.getElementById('alt').textContent=Math.floor(alt);document.getElementById('vit').textContent=Math.floor(vit);}
function draw(){var grad=x.createLinearGradient(0,0,0,H);grad.addColorStop(0,'#1e3a8a');grad.addColorStop(1,'#87ceeb');x.fillStyle=grad;x.fillRect(0,0,W,H);x.fillStyle='#7cb342';x.fillRect(0,H-30,W,30);var py=H-50-(alt/10000)*(H-100);var px=W/2;x.fillStyle=ACC;x.beginPath();x.moveTo(px+40,py);x.lineTo(px-20,py-15);x.lineTo(px-20,py+15);x.closePath();x.fill();x.fillStyle='#fff';x.fillRect(10,H-60,200,20);x.fillStyle=ACC;x.fillRect(10,H-60,200*(vit/500),20);}
function tick(){if(!over)upd();draw();}
function reset(){init();if(loop)clearInterval(loop);loop=setInterval(tick,50);}
window.reset=reset;
document.addEventListener('keydown',function(e){if(e.key==='ArrowUp'){ctrl('up');e.preventDefault();}if(e.key==='ArrowDown'){ctrl('down');e.preventDefault();}});
reset();
`, "flight-sim");
}
// ═══════════════════════════════════════════════════════════════
// PAQUET 9 : SPORTS, RACING, PUZZLE+ (20 jeux)
// ═══════════════════════════════════════════════════════════════

function penalty(): string {
  return wrap("Penalty", `
<h1>⚽ <span>Penalty</span></h1>
<div class="stats"><span>Buts : <strong id="score">0</strong></span><span>Tirs : <strong id="tries">0</strong></span></div>
<canvas id="g" width="400" height="500"></canvas>
<div class="controls"><button ontouchstart="shoot(-1);event.preventDefault()" onclick="shoot(-1)">←</button><button ontouchstart="shoot(0);event.preventDefault()" onclick="shoot(0)">↑</button><button ontouchstart="shoot(1);event.preventDefault()" onclick="shoot(1)">→</button></div>
<div class="overlay" id="ov"><h2>Terminé</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var score=0,tries=0,keeper,mx,my,ball,shooting,over,loop;
function init(){score=0;tries=0;over=false;keeper={x:W/2-30,dir:1};ball={x:W/2,y:H-60,r:12};shooting=false;mx=W/2;my=H-60;document.getElementById('score').textContent='0';document.getElementById('tries').textContent='0';document.getElementById('ov').classList.remove('show');}
function shoot(dir){if(over||shooting)return;shooting=true;tries++;document.getElementById('tries').textContent=tries;mx=W/2+dir*100;my=100;}
window.shoot=shoot;
function upd(){if(shooting){ball.x+=(mx-ball.x)*0.08;ball.y+=(my-ball.y)*0.08;if(Math.abs(ball.x-mx)<15&&Math.abs(ball.y-my)<15){if(Math.abs(ball.x-keeper.x-30)>50){score++;document.getElementById('score').textContent=score;}tries++;if(tries>=5){over=true;document.getElementById('fin').textContent=score;document.getElementById('ov').classList.add('show');return;}ball.x=W/2;ball.y=H-60;shooting=false;}}keeper.x+=(W/2-ball.x)*0.05;}
function draw(){x.fillStyle='#2a7a3a';x.fillRect(0,0,W,H);x.strokeStyle='#fff';x.lineWidth=6;x.strokeRect(80,60,W-160,200);x.fillStyle='#fff';x.fillRect(80,H-30,W-160,20);x.fillStyle='#fff';x.beginPath();x.arc(ball.x,ball.y,ball.r,0,6.3);x.fill();x.fillStyle='#facc15';x.fillRect(keeper.x,100,60,80);}
function tick(){upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,25);}
window.rst=rst;rst();
`, "penalty");
}

function basket(): string {
  return wrap("Basket", `
<h1>🏀 <span>Basket</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Tirs : <strong id="tries">0</strong></span></div>
<canvas id="g" width="500" height="500"></canvas>
<div class="controls"><button ontouchstart="setPow();event.preventDefault()" ontouchend="fire();event.preventDefault()" onclick="setPow()">LANCER</button></div>
<div class="overlay" id="ov"><h2>Terminé</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var score=0,tries=0,ball,vy,vx,hoop,charging,power,over,loop;
function init(){score=0;tries=0;ball={x:100,y:H-80};vy=0;vx=0;hoop={x:W-120,y:200,w:80};charging=false;power=0;over=false;document.getElementById('score').textContent='0';document.getElementById('tries').textContent='0';document.getElementById('ov').classList.remove('show');}
function setPow(){if(over)return;charging=true;power=0;}
function fire(){if(!charging||over)return;charging=false;tries++;document.getElementById('tries').textContent=tries;vx=power*0.3;vy=-power*0.25;}
window.setPow=setPow;window.fire=fire;
function upd(){if(charging){power=Math.min(power+2,100);}else if(ball.y<H-80||vy<0){ball.x+=vx;ball.y+=vy;vy+=0.4;if(ball.x+12>hoop.x&&ball.x-12<hoop.x+hoop.w&&ball.y+12>hoop.y&&ball.y-12<hoop.y+20&&vy>0){score++;document.getElementById('score').textContent=score;resetBall();}if(ball.x>W||ball.y>H){if(tries>=5){over=true;document.getElementById('fin').textContent=score;document.getElementById('ov').classList.add('show');}else resetBall();}}}
function resetBall(){ball={x:100,y:H-80};vx=0;vy=0;charging=false;power=0;}
function draw(){x.fillStyle='#8b4513';x.fillRect(0,H-30,W,30);x.fillStyle='#fff';x.fillRect(hoop.x,hoop.y,hoop.w,8);x.fillStyle='#fff';x.beginPath();x.arc(hoop.x+hoop.w,hoop.y+50,4,0,6.3);x.fill();x.fillStyle='#f97316';x.beginPath();x.arc(ball.x,ball.y,12,0,6.3);x.fill();if(charging){x.fillStyle='#facc15';x.fillRect(20,H-60,power*2,15);}}
function tick(){upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,20);}
window.rst=rst;rst();
`, "basket");
}

function kartRacing(): string {
  return wrap("Kart", `
<h1>🏁 <span>Kart Racing</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="400" height="500"></canvas>
<div class="controls"><button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button><button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button></div>
<div class="overlay" id="ov"><h2>Crash !</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var player,cars,score,over,loop,speed,road;
function init(){player={x:W/2-20,y:H-100,w:40,h:60};cars=[];score=0;over=false;speed=3;road=W-80;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function mv(d){player.x+=d*25;player.x=Math.max(40,Math.min(W-40-player.w,player.x));}
window.mv=mv;
function upd(){speed+=0.001;score+=speed/10;document.getElementById('score').textContent=Math.floor(score);if(Math.random()<0.02)speed+=0.01;cars.forEach(function(car){car.y+=speed;});if(Math.random()<0.02)cars.push({x:40+Math.random()*(W-120),y:-80,w:50,h:80,color:['#ef4444','#3b82f6','#22c55e','#facc15'][Math.floor(Math.random()*4)]});cars=cars.filter(function(car){return car.y<H;});cars.forEach(function(car){if(player.x<car.x+car.w&&player.x+player.w>car.x&&player.y<car.y+car.h&&player.y+player.h>car.y){over=true;document.getElementById('fin').textContent=Math.floor(score);document.getElementById('ov').classList.add('show');}});}
function draw(){x.fillStyle='#333';x.fillRect(0,0,W,H);x.fillStyle='#2a2a2a';x.fillRect(40,0,W-80,H);x.fillStyle='#fff';for(var i=0;i<H;i+=40){x.fillRect(W/2-4,(i+(performance.now()/10)%40)%H,8,20);}cars.forEach(function(car){x.fillStyle=car.color;x.fillRect(car.x,car.y,car.w,car.h);});x.fillStyle='#a855f7';x.fillRect(player.x,player.y,player.w,player.h);x.fillStyle='#000';x.fillRect(player.x+5,player.y+10,10,15);x.fillRect(player.x+player.w-15,player.y+10,10,15);}
function tick(){if(!over)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,20);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')mv(-1);if(e.key==='ArrowRight')mv(1);});
rst();
`, "kart");
}

function burgerTime(): string {
  return wrap("Burger Time", `
<h1>🍔 <span>Burger Time</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="500" height="500"></canvas>
<div class="controls"><button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button><button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button></div>
<div class="overlay" id="ov"><h2>Crash !</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var player,foods,enemies,score,over,loop;
function init(){player={x:W/2-20,y:H-50,w:40,h:40};foods=[];enemies=[];for(var i=0;i<6;i++)foods.push({x:i*80+10,y:H-90,h:0});for(var i=0;i<3;i++)enemies.push({x:i*150+60,y:50,vx:1});score=0;over=false;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function mv(d){player.x+=d*20;player.x=Math.max(0,Math.min(W-player.w,player.x));}
window.mv=mv;
function upd(){enemies.forEach(function(e){e.x+=e.vx;if(e.x<0||e.x+e.w>W)e.vx*=-1;});enemies.forEach(function(e){if(player.x<e.x+30&&player.x+player.w>e.x&&player.y<e.y+30&&player.y+player.h>e.y){over=true;document.getElementById('fin').textContent=score;document.getElementById('ov').classList.add('show');}});foods.forEach(function(f){if(Math.abs(player.x-f.x)<40&&Math.abs(player.y-f.y-50)<20){f.y-=1;if(f.y<80){score+=10;document.getElementById('score').textContent=score;f.y=H-90;}}});}
function draw(){x.fillStyle='#0a0a0a';x.fillRect(0,0,W,H);for(var i=0;i<5;i++){x.fillStyle='#2a2a2a';x.fillRect(0,H-100-i*80,W,10);}foods.forEach(function(f){x.fillStyle='#facc15';x.fillRect(f.x,f.y,60,10);x.fillStyle='#8b4513';x.fillRect(f.x+5,f.y-5,50,5);x.fillStyle='#22c55e';x.fillRect(f.x+10,f.y-10,40,5);});enemies.forEach(function(e){x.fillStyle='#ef4444';x.fillRect(e.x,e.y,30,30);});x.fillStyle='#f97316';x.fillRect(player.x,player.y,player.w,player.h);}
function tick(){if(!over)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,20);}
window.rst=rst;rst();
`, "burger");
}

function bomberman2(): string {
  return wrap("Bomber", `
<h1>💣 <span>Bomber</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="400" height="400"></canvas>
<div class="controls"><button ontouchstart="place();event.preventDefault()" onclick="place()">💣</button></div>
<div class="overlay" id="ov"><h2>Kaboom !</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height,T=40;
var map,bombs,enemies,score,over,loop;
function init(){map=[];for(var y=0;y<10;y++){map[y]=[];for(var xx=0;xx<10;xx++)map[y][xx]=Math.random()<0.2?1:0;}map[0][0]=0;map[0][1]=0;map[1][0]=0;bombs=[];enemies=[];for(var i=0;i<3;i++){var ex,ey;do{ex=Math.floor(Math.random()*10);ey=Math.floor(Math.random()*10);}while(map[ey][ex]!==0||(ex<2&&ey<2));enemies.push({x:ex,y:ey,alive:true,t:0});}score=0;over=false;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function place(){bombs.push({x:0,y:0,t:60});}
window.place=place;
function upd(){bombs.forEach(function(b){b.t--;});var boom=bombs.filter(function(b){return b.t<=0;});bombs=bombs.filter(function(b){return b.t>0;});boom.forEach(function(b){for(var dy=-1;dy<=1;dy++)for(var dx=-1;dx<=1;dx++){var nx=b.x+dx,ny=b.y+dy;enemies.forEach(function(e){if(e.alive&&e.x===nx&&e.y===ny){e.alive=false;score+=50;document.getElementById('score').textContent=score;}});}});enemies.forEach(function(e){if(!e.alive)return;e.t++;if(e.t%15===0){var dirs=[[0,1],[0,-1],[1,0],[-1,0]];var d=dirs[Math.floor(Math.random()*4)];var nx=e.x+d[0],ny=e.y+d[1];if(nx>=0&&nx<10&&ny>=0&&ny<10&&map[ny][nx]===0)e.x=nx,e.y=ny;}if(e.x===0&&e.y===0){over=true;document.getElementById('fin').textContent=score;document.getElementById('ov').classList.add('show');}});}
function draw(){x.fillStyle='#000';x.fillRect(0,0,W,H);for(var y=0;y<10;y++)for(var xx=0;xx<10;xx++)if(map[y][xx]){x.fillStyle='#666';x.fillRect(xx*T,y*T,T,T);}enemies.forEach(function(e){if(e.alive){x.fillStyle='#ef4444';x.beginPath();x.arc(e.x*T+20,e.y*T+20,15,0,6.3);x.fill();}});bombs.forEach(function(b){x.fillStyle='#facc15';x.beginPath();x.arc(b.x*T+20,b.y*T+20,12,0,6.3);x.fill();});x.fillStyle='#22c55e';x.beginPath();x.arc(20,20,15,0,6.3);x.fill();}
function tick(){if(!over)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,30);}
window.rst=rst;rst();
`, "bomber");
}

function snakeVsIA(): string {
  return wrap("Snake vs IA", `
<h1>🐍 <span>Snake vs IA</span></h1>
<div class="stats"><span>Toi : <strong id="s1">0</strong></span><span>IA : <strong id="s2">0</strong></span></div>
<canvas id="g" width="400" height="400"></canvas>
<div class="controls"><button ontouchstart="mv(0,-1);event.preventDefault()" onclick="mv(0,-1)">↑</button></div>
<div class="controls"><button ontouchstart="mv(-1,0);event.preventDefault()" onclick="mv(-1,0)">←</button><button ontouchstart="mv(0,1);event.preventDefault()" onclick="mv(0,1)">↓</button><button ontouchstart="mv(1,0);event.preventDefault()" onclick="mv(1,0)">→</button></div>
<div class="overlay" id="ov"><h2 id="ttl">Perdu</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),T=20,N=20;
var s1,s2,food,dir1,dir2,s1Score,s2Score,over,loop;
function init(){s1=[{x:5,y:10}];s2=[{x:14,y:10}];dir1={x:1,y:0};dir2={x:-1,y:0};s1Score=0;s2Score=0;over=false;spawn();document.getElementById('s1').textContent='0';document.getElementById('s2').textContent='0';document.getElementById('ov').classList.remove('show');}
function spawn(){food={x:Math.floor(Math.random()*N),y:Math.floor(Math.random()*N)};}
function mv(a,b){if(a===-dir1.x&&b===-dir1.y)return;dir1={x:a,y:b};}
window.mv=mv;
function upd(){var h1={x:s1[0].x+dir1.x,y:s1[0].y+dir1.y};if(h1.x<0||h1.x>=N||h1.y<0||h1.y>=N||s1.some(function(s){return s.x===h1.x&&s.y===h1.y;})){over=true;document.getElementById('ttl').textContent='Perdu !';document.getElementById('ov').classList.add('show');return;}s1.unshift(h1);if(h1.x===food.x&&h1.y===food.y){s1Score+=10;spawn();}else s1.pop();document.getElementById('s1').textContent=s1Score;var h2={x:s2[0].x+dir2.x,y:s2[0].y+dir2.y};if(h2.x<0||h2.x>=N||h2.y<0||h2.y>=N||s2.some(function(s){return s.x===h2.x&&s.y===h2.y;})){dir2={x:Math.floor(Math.random()*3)-1,y:Math.floor(Math.random()*3)-1};}else{s2.unshift(h2);if(h2.x===food.x&&h2.y===food.y){s2Score+=10;spawn();}else s2.pop();}document.getElementById('s2').textContent=s2Score;var hd=food.x-s2[0].x,vd=food.y-s2[0].y;if(Math.abs(hd)>Math.abs(vd)&&hd!==0)dir2={x:hd>0?1:-1,y:0};else if(vd!==0)dir2={x:0,y:vd>0?1:-1};if(Math.random()<0.05){dir2={x:Math.floor(Math.random()*3)-1,y:Math.floor(Math.random()*3)-1};}}
function draw(){x.fillStyle='#000';x.fillRect(0,0,c.width,c.height);x.fillStyle='#ef4444';x.fillRect(food.x*T,food.y*T,T-2,T-2);s1.forEach(function(s,i){x.fillStyle=i===0?'#22c55e':'#16a34a';x.fillRect(s.x*T,s.y*T,T-2,T-2);});s2.forEach(function(s,i){x.fillStyle=i===0?'#3b82f6':'#1d4ed8';x.fillRect(s.x*T,s.y*T,T-2,T-2);});}
function tick(){if(!over)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,150);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')mv(-1,0);if(e.key==='ArrowRight')mv(1,0);if(e.key==='ArrowUp')mv(0,-1);if(e.key==='ArrowDown')mv(0,1);});
rst();
`, "snake-vs-ia");
}

function maze(): string {
  return wrap("Labyrinthe", `
<h1>🌀 <span>Labyrinthe</span></h1>
<div class="stats"><span>Temps : <strong id="time">0</strong>s</span></div>
<canvas id="g" width="500" height="500"></canvas>
<div class="controls"><button ontouchstart="mv(0,-1);event.preventDefault()" onclick="mv(0,-1)">↑</button></div>
<div class="controls"><button ontouchstart="mv(-1,0);event.preventDefault()" onclick="mv(-1,0)">←</button><button ontouchstart="mv(0,1);event.preventDefault()" onclick="mv(0,1)">↓</button><button ontouchstart="mv(1,0);event.preventDefault()" onclick="mv(1,0)">→</button></div>
<div class="overlay" id="ov"><h2>🎉 Gagné !</h2><p>Temps : <strong id="fin">0</strong>s</p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),N=15,T=33;
var maze,px,py,t,over,loop;
function init(){maze=[];for(var y=0;y<N;y++){maze[y]=[];for(var xx=0;xx<N;xx++)maze[y][xx]=1;}var stack=[{x:0,y:0}];maze[0][0]=0;while(stack.length){var cur=stack[stack.length-1];var opts=[];[[0,2],[0,-2],[2,0],[-2,0]].forEach(function(d){var nx=cur.x+d[0],ny=cur.y+d[1];if(nx>=0&&nx<N&&ny>=0&&ny<N&&maze[ny][nx]===1)opts.push({x:nx,y:ny,dx:d[0],dy:d[1]});});if(!opts.length){stack.pop();continue;}var o=opts[Math.floor(Math.random()*opts.length)];maze[cur.y+o.dy/2][cur.x+o.dx/2]=0;maze[o.y][o.x]=0;stack.push({x:o.x,y:o.y});}px=0;py=0;t=0;over=false;document.getElementById('time').textContent='0';document.getElementById('ov').classList.remove('show');}
function mv(a,b){if(over)return;var nx=px+a,ny=py+b;if(nx>=0&&nx<N&&ny>=0&&ny<N&&maze[ny][nx]===0){px=nx;py=ny;if(px===N-1&&py===N-1){over=true;document.getElementById('fin').textContent=t;document.getElementById('ov').classList.add('show');}}}
window.mv=mv;
function upd(){t+=0.01;document.getElementById('time').textContent=Math.floor(t);}
function draw(){x.fillStyle='#000';x.fillRect(0,0,c.width,c.height);for(var y=0;y<N;y++)for(var xx=0;xx<N;xx++){if(maze[y][xx]===1){x.fillStyle='#333';x.fillRect(xx*T,y*T,T,T);}}x.fillStyle='#22c55e';x.fillRect((N-1)*T+5,(N-1)*T+5,T-10,T-10);x.fillStyle='#facc15';x.fillRect(px*T+5,py*T+5,T-10,T-10);}
function tick(){if(!over)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,50);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')mv(-1,0);if(e.key==='ArrowRight')mv(1,0);if(e.key==='ArrowUp')mv(0,-1);if(e.key==='ArrowDown')mv(0,1);});
rst();
`, "maze");
}

function memoryEmoji(): string {
  return wrap("Memory Emoji", `
<h1>🎴 <span>Memory Emoji</span></h1>
<div class="stats"><span>Coups : <strong id="mv">0</strong></span><span>Paires : <strong id="p">0/8</strong></span></div>
<div id="bd" style="display:grid;grid-template-columns:repeat(4,min(80px,20vw));gap:8px;background:#1a1a1a;padding:12px;border-radius:12px;border:2px solid #facc15"></div>
<div style="margin-top:16px"><button onclick="rst()" ontouchstart="rst();event.preventDefault()" style="padding:12px 32px;background:#facc15;color:#000;border:none;border-radius:10px;font-weight:900;font-size:16px;cursor:pointer">Nouvelle partie</button></div>
<div class="overlay" id="ov"><h2>🎉 Bravo !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var em=['🐶','🐱','🦊','🐻','🐼','🐨','🦁','🐯'],f,s,lock,mv,mat,cds;
function init(){cds=em.concat(em).sort(function(){return Math.random()-0.5;});f=null;s=null;lock=false;mv=0;mat=0;document.getElementById('mv').textContent='0';document.getElementById('p').textContent='0/8';document.getElementById('ov').classList.remove('show');render();}
function render(){var b=document.getElementById('bd');b.innerHTML='';cds.forEach(function(e,i){var cc=document.createElement('div');cc.style.cssText='width:100%;aspect-ratio:1;background:#2a2a2a;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:32px;cursor:pointer;color:#fff;font-weight:900';cc.textContent='?';cc.dataset.idx=i;cc.dataset.em=e;cc.onclick=function(){flip(i,cc);};cc.ontouchstart=function(ev){ev.preventDefault();flip(i,cc);};b.appendChild(cc);});}
function flip(i,cc){if(lock||cc.dataset.m==='1'||cc.textContent!=='?')return;cc.textContent=cc.dataset.em;cc.style.background='#facc15';cc.style.color='#000';if(f===null){f=i;return;}if(s===null){s=i;lock=true;mv++;document.getElementById('mv').textContent=mv;var c1=document.querySelector('[data-idx="'+f+'"]'),c2=cc;if(c1.dataset.em===c2.dataset.em){c1.dataset.m='1';c2.dataset.m='1';c1.style.background='#22c55e';c2.style.background='#22c55e';mat++;document.getElementById('p').textContent=mat+'/8';f=null;s=null;lock=false;if(mat===8)setTimeout(function(){document.getElementById('ov').classList.add('show');},400);}else{setTimeout(function(){c1.textContent='?';c1.style.background='#2a2a2a';c1.style.color='#fff';c2.textContent='?';c2.style.background='#2a2a2a';c2.style.color='#fff';f=null;s=null;lock=false;},800);}}}
function rst(){init();}
window.rst=rst;init();
`, "memory-emoji");
}

function pinball(): string {
  return wrap("Pinball", `
<h1>🎱 <span>Pinball</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Balles : <strong id="balls">3</strong></span></div>
<canvas id="g" width="400" height="550"></canvas>
<div class="controls"><button ontouchstart="flipL();event.preventDefault()" onclick="flipL()">← FLIP</button><button ontouchstart="flipR();event.preventDefault()" onclick="flipR()">FLIP →</button></div>
<div class="overlay" id="ov"><h2>Terminé</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var ball,vx,vy,score,balls,fl,fr,over,loop,bumpers;
function init(){ball={x:W/2,y:80,r:8};vx=2;vy=2;score=0;balls=3;fl=0;fr=0;over=false;bumpers=[{x:100,y:180,r:25,sc:10},{x:W-100,y:180,r:25,sc:10},{x:W/2,y:280,r:25,sc:20},{x:80,y:380,r:20,sc:5},{x:W-80,y:380,r:20,sc:5}];document.getElementById('score').textContent='0';document.getElementById('balls').textContent='3';document.getElementById('ov').classList.remove('show');}
function flipL(){fl=15;}
function flipR(){fr=15;}
window.flipL=flipL;window.flipR=flipR;
function upd(){if(fl>0)fl--;if(fr>0)fr--;vy+=0.15;ball.x+=vx;ball.y+=vy;if(ball.x-ball.r<0||ball.x+ball.r>W){vx*=-1;ball.x=ball.x<W/2?ball.r:W-ball.r;}if(ball.y-ball.r<0){vy*=-1;ball.y=ball.r;}bumpers.forEach(function(b){var dx=ball.x-b.x,dy=ball.y-b.y;var d=Math.sqrt(dx*dx+dy*dy);if(d<b.r+ball.r){var nx=dx/d,ny=dy/d;var dot=vx*nx+vy*ny;vx-=2*dot*nx;vy-=2*dot*ny;score+=b.sc;document.getElementById('score').textContent=score;ball.x=b.x+nx*(b.r+ball.r+1);ball.y=b.y+ny*(b.r+ball.r+1);}});if(fl>0&&ball.x<100&&ball.y>H-60){vy=-8;vx=-3;}if(fr>0&&ball.x>W-100&&ball.y>H-60){vy=-8;vx=3;}if(ball.y>H){balls--;document.getElementById('balls').textContent=balls;if(balls<=0){over=true;document.getElementById('fin').textContent=score;document.getElementById('ov').classList.add('show');}else{ball={x:W/2,y:80,r:8};vx=2;vy=2;}}}
function draw(){x.fillStyle='#1a0a2e';x.fillRect(0,0,W,H);bumpers.forEach(function(b){x.fillStyle='#a855f7';x.beginPath();x.arc(b.x,b.y,b.r,0,6.3);x.fill();x.strokeStyle='#fff';x.lineWidth=3;x.stroke();});x.fillStyle='#facc15';x.beginPath();x.arc(ball.x,ball.y,ball.r,0,6.3);x.fill();x.fillStyle='#22c55e';if(fl>0)x.fillRect(20,H-60,80,15);else x.fillRect(20,H-50,80,15);x.fillRect(W-100,H-50,80,15);x.fillStyle='#ef4444';x.fillRect(W-100,H-50,80,15);x.fillStyle='#22c55e';x.fillRect(20,H-50,80,15);}
function tick(){if(!over)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;rst();
`, "pinball");
}

function cowboy(): string {
  return wrap("Cowboy Duel", `
<h1>🤠 <span>Duel</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Vies : <strong id="lives">3</strong></span></div>
<canvas id="g" width="600" height="400"></canvas>
<div style="margin-top:16px;opacity:.6;font-size:12px">Appuie sur ESPACE quand "TIREZ !" apparaît</div>
<div class="overlay" id="ov"><h2>Perdu</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var phase,timer,score,lives,over,loop,enemyTime;
function init(){phase='wait';timer=60+Math.random()*120;score=0;lives=3;over=false;enemyTime=0;document.getElementById('score').textContent='0';document.getElementById('lives').textContent='3';document.getElementById('ov').classList.remove('show');}
function upd(){if(phase==='wait'){timer--;if(timer<=0){phase='ready';timer=120;enemyTime=200+Math.random()*300;}}else if(phase==='ready'){timer--;if(timer<=0){lives--;document.getElementById('lives').textContent=lives;if(lives<=0){over=true;document.getElementById('fin').textContent=score;document.getElementById('ov').classList.add('show');}else init();}}}
function shoot(){if(over)return;if(phase==='ready'){score++;document.getElementById('score').textContent=score;init();}else if(phase==='wait'){lives--;document.getElementById('lives').textContent=lives;if(lives<=0){over=true;document.getElementById('fin').textContent=score;document.getElementById('ov').classList.add('show');}else init();}}
window.shoot=shoot;
function draw(){x.fillStyle='#8b4513';x.fillRect(0,0,W,H);x.fillStyle='#facc15';x.fillRect(0,H/2-20,W,40);x.font='100px system-ui';x.fillText('🤠',100,H/2+30);x.fillText('🤠',W-200,H/2+30);x.fillStyle='#fff';x.font='48px system-ui';if(phase==='wait')x.fillText('ATTENDS...',W/2-140,100);else if(phase==='ready')x.fillText('TIREZ !',W/2-100,100);}
function tick(){if(!over)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key===' ')shoot();});
c.addEventListener('click',shoot);
c.addEventListener('touchstart',function(e){e.preventDefault();shoot();},{passive:false});
rst();
`, "cowboy");
}

function soccer(): string {
  return wrap("Foot", `
<h1>⚽ <span>Match Foot</span></h1>
<div class="stats"><span>Toi : <strong id="s1">0</strong></span><span>IA : <strong id="s2">0</strong></span></div>
<canvas id="g" width="500" height="400"></canvas>
<div class="controls"><button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button><button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button></div>
<div class="overlay" id="ov"><h2 id="ttl">Fin</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var p1,p2,ball,s1,s2,over,loop;
function init(){p1={x:W/2-60,y:H-50,w:40,h:40};p2={x:W/2-60,y:20,w:40,h:40};ball={x:W/2,y:H/2,vx:1,vy:1,r:8};s1=0;s2=0;over=false;document.getElementById('s1').textContent='0';document.getElementById('s2').textContent='0';document.getElementById('ov').classList.remove('show');}
function mv(d){p1.x+=d*20;p1.x=Math.max(0,Math.min(W-p1.w,p1.x));}
window.mv=mv;
function upd(){ball.x+=ball.vx;ball.y+=ball.vy;if(ball.x-ball.r<0||ball.x+ball.r>W)ball.vx*=-1;if(ball.y-ball.r<0){s1++;document.getElementById('s1').textContent=s1;reset();}if(ball.y+ball.r>H){s2++;document.getElementById('s2').textContent=s2;reset();}if(ball.x>p2.x&&ball.x<p2.x+p2.w&&ball.y-ball.r<p2.y+p2.h&&ball.vy<0)ball.vy*=-1;if(ball.x>p1.x&&ball.x<p1.x+p1.w&&ball.y+ball.r>p1.y&&ball.vy>0){ball.vy*=-1;ball.vx+=(ball.x-p1.x-p1.w/2)/10;}p2.x+=(ball.x-p2.x-p2.w/2)*0.03;p2.x=Math.max(0,Math.min(W-p2.w,p2.x));if(s1>=3||s2>=3){over=true;document.getElementById('ttl').textContent=s1>=3?'🏆 Gagné !':'😢 Perdu';document.getElementById('ov').classList.add('show');}}
function reset(){ball={x:W/2,y:H/2,vx:1,vy:1,r:8};}
function draw(){x.fillStyle='#2a7a3a';x.fillRect(0,0,W,H);x.strokeStyle='#fff';x.lineWidth=3;x.strokeRect(0,0,W,H);x.beginPath();x.moveTo(0,H/2);x.lineTo(W,H/2);x.stroke();x.beginPath();x.arc(W/2,H/2,60,0,6.3);x.stroke();x.fillStyle='#fff';x.fillRect(W/2-60,0,120,8);x.fillRect(W/2-60,H-8,120,8);x.fillStyle='#facc15';x.fillRect(p1.x,p1.y,p1.w,p1.h);x.fillStyle='#3b82f6';x.fillRect(p2.x,p2.y,p2.w,p2.h);x.fillStyle='#fff';x.beginPath();x.arc(ball.x,ball.y,ball.r,0,6.3);x.fill();}
function tick(){if(!over)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')mv(-1);if(e.key==='ArrowRight')mv(1);});
rst();
`, "soccer");
}

function poker(): string {
  return wrap("Poker", `
<h1>🃏 <span>Poker</span></h1>
<div class="stats"><span>Jetons : <strong id="chip">1000</strong></span></div>
<div id="bd" style="background:#0a4a1a;padding:30px;border-radius:16px;border:4px solid #d4af37;min-width:400px;text-align:center"></div>
<div class="controls" style="margin-top:16px">
<button ontouchstart="fold();event.preventDefault()" onclick="fold()" style="background:#ef4444;color:#fff;width:100px">Passer</button>
<button ontouchstart="call();event.preventDefault()" onclick="call()" style="background:#facc15;color:#000;width:100px">Suivre</button>
</div>
<div class="overlay" id="ov"><h2 id="ttl">Résultat</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var SUITS=['♠','♥','♦','♣'],RANKS=['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
var hand,opp,chip,over;
function newDeck(){var d=[];SUITS.forEach(function(s){RANKS.forEach(function(r){d.push({s:s,r:r});});});return d.sort(function(){return Math.random()-0.5;});}
function init(){var d=newDeck();hand=[d.pop(),d.pop(),d.pop(),d.pop(),d.pop()];opp=[d.pop(),d.pop(),d.pop(),d.pop(),d.pop()];chip=1000;over=false;document.getElementById('chip').textContent='1000';document.getElementById('ov').classList.remove('show');render();}
function val(h){var counts={};h.forEach(function(c){counts[c.r]=(counts[c.r]||0)+1;});var vals=Object.values(counts).sort().reverse();if(vals[0]===4)return 7;if(vals[0]===3&&vals[1]===2)return 6;if(vals[0]===3)return 3;if(vals[0]===2&&vals[1]===2)return 2;if(vals[0]===2)return 1;return 0;}
function render(){var h='<p style="color:#fff;font-size:20px;margin-bottom:12px">Ta main</p><div style="display:flex;gap:8px;justify-content:center;margin-bottom:20px">';hand.forEach(function(c){h+='<div style="padding:12px;background:#fff;color:'+(c.s==='♥'||c.s==='♦'?'#ef4444':'#000')+';border-radius:8px;font-weight:900;font-size:24px;min-width:50px">'+c.r+'<br>'+c.s+'</div>';});h+='</div><p style="color:#facc15;font-weight:900;font-size:18px">Force: '+val(hand)+'</p>';document.getElementById('bd').innerHTML=h;}
function fold(){if(over)return;chip-=50;document.getElementById('chip').textContent=chip;if(chip<=0){over=true;document.getElementById('ttl').textContent='💀 Ruine';document.getElementById('ov').classList.add('show');}else init();}
window.fold=fold;
function call(){if(over)return;if(val(hand)>val(opp)){chip+=150;document.getElementById('chip').textContent=chip;}else{chip-=150;document.getElementById('chip').textContent=chip;}if(chip<=0){over=true;document.getElementById('ttl').textContent='💀 Ruine';document.getElementById('ov').classList.add('show');}else setTimeout(init,500);}
window.call=call;
function rst(){init();}
window.rst=rst;init();
`, "poker");
}

function galaxian(): string {
  return wrap("Galaxian", `
<h1>👾 <span>Galaxian</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Vies : <strong id="lives">3</strong></span></div>
<canvas id="g" width="480" height="500"></canvas>
<div class="controls">
<button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button>
<button ontouchstart="sh();event.preventDefault()" onclick="sh()">🔥</button>
<button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button>
</div>
<div class="overlay" id="ov"><h2>Game Over</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var pl,bl,en,sc,lv,ov,loop,t;
function init(){pl={x:W/2-15,y:H-30,w:30,h:20};bl=[];en=[];sc=0;lv=3;ov=false;t=0;for(var r=0;r<4;r++)for(var col=0;col<8;col++)en.push({x:col*55+30,y:r*45+60,w:30,h:25,alive:true,dx:0.8});document.getElementById('score').textContent='0';document.getElementById('lives').textContent='3';document.getElementById('ov').classList.remove('show');}
function mv(d){pl.x+=d*20;pl.x=Math.max(0,Math.min(W-pl.w,pl.x));}
function sh(){if(ov)return;if(bl.length<3)bl.push({x:pl.x+pl.w/2,y:pl.y,dy:-9});}
window.mv=mv;window.sh=sh;
function upd(){t++;bl.forEach(function(b){b.y+=b.dy;});bl=bl.filter(function(b){return b.y>0;});var hw=false;var alive=0;en.forEach(function(e){if(!e.alive)return;alive++;e.x+=e.dx;if(e.x<10||e.x+e.w>W-10)hw=true;});if(hw){en.forEach(function(e){e.dx*=-1;e.y+=20;});}bl.forEach(function(b){en.forEach(function(e){if(!e.alive)return;if(b.x>e.x&&b.x<e.x+e.w&&b.y>e.y&&b.y<e.y+e.h){e.alive=false;b.y=-100;sc+=20;document.getElementById('score').textContent=sc;}});});bl=bl.filter(function(b){return b.y>0;});if(alive===0){for(var r=0;r<4;r++)for(var col=0;col<8;col++)en.push({x:col*55+30,y:r*45+60,w:30,h:25,alive:true,dx:0.8});}if(t%30===0){var shooters=en.filter(function(e){return e.alive;});if(shooters.length){var s=shooters[Math.floor(Math.random()*shooters.length)];bl.push({x:s.x+s.w/2,y:s.y+s.h,dy:5,enemy:true});}}var lowest=0;en.forEach(function(e){if(e.alive&&e.y>lowest)lowest=e.y;});if(lowest>H-60){lv--;document.getElementById('lives').textContent=lv;if(lv<=0){ov=true;document.getElementById('fin').textContent=sc;document.getElementById('ov').classList.add('show');}en.forEach(function(e){e.y-=40;});}bl.forEach(function(b){if(b.enemy&&b.x<pl.x+pl.w&&b.x>pl.x&&b.y>pl.y&&b.y<pl.y+pl.h){lv--;document.getElementById('lives').textContent=lv;b.y=H+100;if(lv<=0){ov=true;document.getElementById('fin').textContent=sc;document.getElementById('ov').classList.add('show');}}});bl=bl.filter(function(b){return b.y<H&&b.y>0;});}
function draw(){x.fillStyle='#000';x.fillRect(0,0,W,H);x.fillStyle='#22c55e';x.beginPath();x.moveTo(pl.x+pl.w/2,pl.y);x.lineTo(pl.x,pl.y+pl.h);x.lineTo(pl.x+pl.w,pl.y+pl.h);x.closePath();x.fill();x.fillStyle='#fbbf24';bl.forEach(function(b){if(!b.enemy)x.fillRect(b.x-1,b.y,3,8);else{x.fillStyle='#ef4444';x.fillRect(b.x-2,b.y,4,8);x.fillStyle='#fbbf24';}});en.forEach(function(e){if(e.alive){x.fillStyle='#a855f7';x.fillRect(e.x,e.y,e.w,e.h);x.fillStyle='#fff';x.fillRect(e.x+8,e.y+8,5,5);x.fillRect(e.x+17,e.y+8,5,5);}});}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,25);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')mv(-1);if(e.key==='ArrowRight')mv(1);if(e.key===' ')sh();});
rst();
`, "galaxian");
}

function wordSearch(): string {
  return wrap("Mots Mêlés", `
<h1>🔤 <span>Mots Mêlés</span></h1>
<div class="stats"><span>Trouvés : <strong id="found">0</strong>/5</span></div>
<div id="words" style="color:#facc15;font-weight:900;margin-bottom:12px"></div>
<div id="bd" style="display:grid;grid-template-columns:repeat(8,min(40px,10vw));gap:4px;background:#1a1a1a;padding:12px;border-radius:12px"></div>
<div class="overlay" id="ov"><h2>🎉 Bravo !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var N=8,WORDS=['CHAT','CHIEN','OISEAU','POISSON','LAPIN'];
var grid,found,sel;
function init(){grid=[];for(var y=0;y<N;y++){grid[y]=[];for(var x=0;x<N;x++)grid[y][x]=String.fromCharCode(65+Math.floor(Math.random()*26));}WORDS.forEach(function(w){var dirs=[[0,1],[1,0],[1,1],[-1,1]];for(var attempt=0;attempt<50;attempt++){var d=dirs[Math.floor(Math.random()*4)];var sx=Math.floor(Math.random()*N),sy=Math.floor(Math.random()*N);var ex=sx+d[0]*(w.length-1),ey=sy+d[1]*(w.length-1);if(ex<0||ex>=N||ey<0||ey>=N)continue;var ok=true;for(var i=0;i<w.length;i++)if(grid[sy+d[1]*i][sx+d[0]*i]!==w[i]&&grid[sy+d[1]*i][sx+d[0]*i]!==String.fromCharCode(65+Math.floor(Math.random()*26))){ok=false;}for(var i=0;i<w.length;i++)grid[sy+d[1]*i][sx+d[0]*i]=w[i];break;}});found=[];sel=[];document.getElementById('found').textContent='0';document.getElementById('ov').classList.remove('show');renderWords();render();}
function renderWords(){document.getElementById('words').textContent=WORDS.map(function(w){return found.indexOf(w)>=0?'✅ '+w:'❌ '+w;}).join(' | ');}
function render(){var b=document.getElementById('bd');b.innerHTML='';for(var y=0;y<N;y++)for(var x=0;x<N;x++){var cc=document.createElement('div');var s=sel.some(function(p){return p.y===y&&p.x===x;});cc.style.cssText='width:100%;aspect-ratio:1;background:'+(s?'#facc15':'#2a2a2a')+';border-radius:6px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:clamp(14px,3vw,20px);cursor:pointer;color:'+(s?'#000':'#fff');cc.textContent=grid[y][x];cc.onclick=function(yy,xx){return function(){pick(yy,xx);};}(y,x);b.appendChild(cc);}}
function pick(y,x){if(sel.length===0){sel=[{y:y,x:x}];render();return;}if(sel.length===1){var dy=y-sel[0].y,dx=x-sel[0].x;if(dy===0||dx===0||Math.abs(dy)===Math.abs(dx)){var len=Math.max(Math.abs(dy),Math.abs(dx))+1;var sy=Math.sign(dy),sx=Math.sign(dx);var word='';var cells=[];for(var i=0;i<len;i++){var cy=sel[0].y+sy*i,cx=sel[0].x+sx*i;word+=grid[cy][cx];cells.push({y:cy,x:cx});}var rev=word.split('').reverse().join('');if(WORDS.indexOf(word)>=0&&found.indexOf(word)<0)found.push(word);else if(WORDS.indexOf(rev)>=0&&found.indexOf(rev)<0)found.push(rev);else{sel=[];render();return;}sel=cells;render();renderWords();document.getElementById('found').textContent=found.length;if(found.length>=WORDS.length){setTimeout(function(){document.getElementById('ov').classList.add('show');},400);setTimeout(function(){sel=[];render();},600);return;}setTimeout(function(){sel=[];render();},600);return;}}sel=[{y:y,x:x}];render();}
function rst(){init();}
window.rst=rst;init();
`, "word-search");
}

function fruit(): string {
  return wrap("Fruit", `
<h1>🍎 <span>Panier de Fruits</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Vies : <strong id="lives">3</strong></span></div>
<canvas id="g" width="500" height="500"></canvas>
<div class="controls"><button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button><button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button></div>
<div class="overlay" id="ov"><h2>Terminé</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var pd,items,sc,lv,ov,loop,t;
var EMO=['🍎','🍌','🍇','🍓','🍊','🥝','🍒','🍑','🥭','🍍'];
function init(){pd={x:W/2-50,y:H-40,w:100,h:30};items=[];sc=0;lv=3;ov=false;t=0;document.getElementById('score').textContent='0';document.getElementById('lives').textContent='3';document.getElementById('ov').classList.remove('show');}
function mv(d){pd.x+=d*25;pd.x=Math.max(0,Math.min(W-pd.w,pd.x));}
window.mv=mv;
function upd(){t++;if(t%35===0)items.push({x:Math.random()*(W-50),y:-40,vy:2+Math.random()*2,em:EMO[Math.floor(Math.random()*EMO.length)]});items.forEach(function(o){o.y+=o.vy;});items.forEach(function(o){if(o.y+40>pd.y&&o.y<pd.y+pd.h&&o.x+25>pd.x&&o.x<pd.x+pd.w){sc+=10;document.getElementById('score').textContent=sc;o.done=true;}});items=items.filter(function(o){return !o.done;});items.forEach(function(o){if(o.y>H){if(o.em!=='💣'){lv--;document.getElementById('lives').textContent=lv;if(lv<=0){ov=true;document.getElementById('fin').textContent=sc;document.getElementById('ov').classList.add('show');}}o.done=true;}});items=items.filter(function(o){return !o.done;});}
function draw(){x.fillStyle='#0a1410';x.fillRect(0,0,W,H);x.fillStyle='#8b4513';x.fillRect(pd.x,pd.y,pd.w,pd.h);x.font='40px system-ui';items.forEach(function(o){x.fillText(o.em,o.x,o.y+30);});}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,20);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')mv(-1);if(e.key==='ArrowRight')mv(1);});
rst();
`, "fruit");
}

function temporel(): string {
  return wrap("Temporel", `
<h1>⏰ <span>Temporel</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Temps : <strong id="time">30</strong>s</span></div>
<canvas id="g" width="500" height="500"></canvas>
<div style="margin-top:16px;opacity:.6;font-size:12px">Clique sur les orbes AVANT qu'ils disparaissent</div>
<div class="overlay" id="ov"><h2>Terminé</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var orbs,sc,time,ov,loop,t;
function init(){orbs=[];sc=0;time=30;ov=false;t=0;document.getElementById('score').textContent='0';document.getElementById('time').textContent='30';document.getElementById('ov').classList.remove('show');}
function upd(){t++;if(t%60===0){time--;document.getElementById('time').textContent=time;if(time<=0){ov=true;document.getElementById('fin').textContent=sc;document.getElementById('ov').classList.add('show');}}if(t%25===0)orbs.push({x:50+Math.random()*(W-100),y:50+Math.random()*(H-100),r:20+Math.random()*20,life:60,color:'hsl('+Math.random()*360+',80%,60%)'});orbs.forEach(function(o){o.life--;});orbs=orbs.filter(function(o){return o.life>0;});}
function click(e){e.preventDefault();if(ov)return;var r=c.getBoundingClientRect();var mx,my;if(e.touches){mx=(e.touches[0].clientX-r.left)*(W/r.width);my=(e.touches[0].clientY-r.top)*(H/r.height);}else{mx=(e.clientX-r.left)*(W/r.width);my=(e.clientY-r.top)*(H/r.height);}for(var i=orbs.length-1;i>=0;i--){var o=orbs[i];if(Math.hypot(o.x-mx,o.y-my)<o.r){sc+=Math.ceil(o.life/10);document.getElementById('score').textContent=sc;orbs.splice(i,1);return;}}}
function draw(){x.fillStyle='#000';x.fillRect(0,0,W,H);orbs.forEach(function(o){x.fillStyle=o.color;x.globalAlpha=o.life/60;x.beginPath();x.arc(o.x,o.y,o.r,0,6.3);x.fill();x.globalAlpha=1;});}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
c.addEventListener('click',click);
c.addEventListener('touchstart',click,{passive:false});
rst();
`, "temporel");
}

function combat(): string {
  return wrap("Combat", `
<h1>⚔️ <span>Combat</span></h1>
<div class="stats"><span>Ton HP : <strong id="hp1">100</strong></span><span>Ennemi HP : <strong id="hp2">100</strong></span></div>
<canvas id="g" width="600" height="400"></canvas>
<div class="controls">
<button ontouchstart="atk('fast');event.preventDefault()" onclick="atk('fast')" style="background:#22c55e;color:#fff;width:80px">Rapide</button>
<button ontouchstart="atk('heavy');event.preventDefault()" onclick="atk('heavy')" style="background:#ef4444;color:#fff;width:80px">Fort</button>
<button ontouchstart="atk('heal');event.preventDefault()" onclick="atk('heal')" style="background:#3b82f6;color:#fff;width:80px">Soin</button>
</div>
<div class="overlay" id="ov"><h2 id="ttl">Fin</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var hp1,hp2,ov,loop,log;
function init(){hp1=100;hp2=100;ov=false;log='';document.getElementById('hp1').textContent='100';document.getElementById('hp2').textContent='100';document.getElementById('ov').classList.remove('show');}
function atk(t){if(ov)return;if(t==='fast'){hp2-=8;log='Tu infliges 8 dégâts';}if(t==='heavy'){hp2-=Math.random()<0.7?20:0;log=hp2<100?'Tu frappes fort !':'Tu rates !';}if(t==='heal'){hp1=Math.min(100,hp1+15);log='Tu te soignes';}if(hp2<=0){ov=true;document.getElementById('ttl').textContent='🏆 Victoire !';document.getElementById('ov').classList.add('show');return;}setTimeout(function(){hp1-=5+Math.floor(Math.random()*10);if(hp1<=0){ov=true;document.getElementById('ttl').textContent='💀 Perdu';document.getElementById('ov').classList.add('show');}document.getElementById('hp1').textContent=hp1;document.getElementById('hp2').textContent=hp2;},400);document.getElementById('hp1').textContent=hp1;document.getElementById('hp2').textContent=hp2;}
window.atk=atk;
function draw(){x.fillStyle='#1a0f0a';x.fillRect(0,0,W,H);x.font='100px system-ui';x.fillText('🗡️',100,H/2+30);x.fillText('👹',W-200,H/2+30);x.fillStyle='#22c55e';x.fillRect(80,H-50,150*(hp1/100),15);x.fillStyle='#ef4444';x.fillRect(W-230,H-50,150*(hp2/100),15);x.fillStyle='#fff';x.font='16px system-ui';if(log)x.fillText(log,W/2-100,50);}
function tick(){draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,50);}
window.rst=rst;rst();
`, "combat");
}

function rpgAdventure(): string {
  return wrap("RPG Adventure", `
<h1>🗺️ <span>RPG Adventure</span></h1>
<div class="stats"><span>HP : <strong id="hp">30</strong></span><span>XP : <strong id="xp">0</strong></span><span>Or : <strong id="gold">0</strong></span></div>
<canvas id="g" width="500" height="500"></canvas>
<div class="controls">
<button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button>
<button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button>
</div>
<div class="overlay" id="ov"><h2>💀 Mort</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var player,enemies,hp,xp,gold,ov,loop,t;
function init(){player={x:W/2,y:H/2-20,w:30,h:30};enemies=[];hp=30;xp=0;gold=0;ov=false;t=0;document.getElementById('hp').textContent='30';document.getElementById('xp').textContent='0';document.getElementById('gold').textContent='0';document.getElementById('ov').classList.remove('show');}
function mv(d){if(ov)return;player.x+=d*15;player.y+=(Math.random()-0.5)*10;player.x=Math.max(0,Math.min(W-player.w,player.x));player.y=Math.max(0,Math.min(H-player.h,player.y));}
window.mv=mv;
function upd(){t++;if(t%120===0)enemies.push({x:Math.random()*(W-30),y:Math.random()*(H-30),w:30,h:30,hp:5});enemies.forEach(function(e){var dx=player.x-e.x,dy=player.y-e.y;var d=Math.sqrt(dx*dx+dy*dy);if(d>30){e.x+=dx/d*0.8;e.y+=dy/d*0.8;}else if(t%20===0){hp-=2;document.getElementById('hp').textContent=hp;if(hp<=0){ov=true;document.getElementById('fin').textContent=xp;document.getElementById('ov').classList.add('show');}}});if(t%30===0){enemies.forEach(function(e){var d=Math.hypot(e.x-player.x,e.y-player.y);if(d<50){e.hp--;if(e.hp<=0){e.dead=true;xp+=5;gold+=3;document.getElementById('xp').textContent=xp;document.getElementById('gold').textContent=gold;}}});}enemies=enemies.filter(function(e){return !e.dead;});}
function draw(){x.fillStyle='#0a1408';x.fillRect(0,0,W,H);x.fillStyle='#22c55e';x.beginPath();x.arc(player.x+15,player.y+15,15,0,6.3);x.fill();x.fillStyle='#ef4444';enemies.forEach(function(e){x.beginPath();x.arc(e.x+15,e.y+15,12,0,6.3);x.fill();});}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')mv(-1);if(e.key==='ArrowRight')mv(1);});
rst();
`, "rpg-adventure");
}

function jetpack2(): string {
  return wrap("Jetpack Pro", `
<h1>🚀 <span>Jetpack Pro</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="600" height="400"></canvas>
<div class="controls"><button ontouchstart="startF();event.preventDefault()" ontouchend="stopF();event.preventDefault()" onclick="toggleF()" style="width:160px">VOLER</button></div>
<div class="overlay" id="ov"><h2>Game Over</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var pl,obs,coins,sc,ov,loop,flap,t;
function init(){pl={x:100,y:H/2,vy:0,r:15};obs=[];coins=[];sc=0;ov=false;flap=false;t=0;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function startF(){flap=true;}
function stopF(){flap=false;}
function toggleF(){flap=!flap;setTimeout(function(){flap=false;},200);}
window.startF=startF;window.stopF=stopF;window.toggleF=toggleF;
function upd(){t++;if(flap)pl.vy-=0.6;else pl.vy+=0.4;pl.vy=Math.max(-8,Math.min(8,pl.vy));pl.y+=pl.vy;if(pl.y<0){pl.y=0;pl.vy=0;}if(pl.y+pl.r>H){ov=true;document.getElementById('fin').textContent=sc;document.getElementById('ov').classList.add('show');return;}obs.forEach(function(o){o.x-=5;});obs=obs.filter(function(o){return o.x>-50;});if(obs.length===0||obs[obs.length-1].x<W-250){var oy=Math.random()*(H-120)+20;obs.push({x:W,y:oy,w:20,h:100,passed:false});}coins.forEach(function(co){co.x-=5;});coins=coins.filter(function(co){return co.x>-30;});if(t%50===0)coins.push({x:W,y:Math.random()*(H-40)+20,r:10});coins.forEach(function(co){if(Math.hypot(co.x-pl.x,co.y-pl.y)<25){co.collected=true;sc+=50;document.getElementById('score').textContent=sc;}});coins=coins.filter(function(co){return !co.collected;});obs.forEach(function(o){if(!o.passed&&o.x+o.w<pl.x){o.passed=true;sc+=10;document.getElementById('score').textContent=sc;}if(pl.x+pl.r>o.x&&pl.x-pl.r<o.x+o.w&&pl.y+pl.r>o.y&&pl.y-pl.r<o.y+o.h){ov=true;document.getElementById('fin').textContent=sc;document.getElementById('ov').classList.add('show');}});}
function draw(){x.fillStyle='#0a0a1a';x.fillRect(0,0,W,H);x.fillStyle='#facc15';x.beginPath();x.arc(pl.x,pl.y,pl.r,0,6.3);x.fill();x.fillStyle='#ef4444';obs.forEach(function(o){x.fillRect(o.x,o.y,o.w,o.h);});x.fillStyle='#22c55e';coins.forEach(function(co){x.beginPath();x.arc(co.x,co.y,co.r,0,6.3);x.fill();});}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key===' ')flap=true;});
document.addEventListener('keyup',function(e){if(e.key===' ')flap=false;});
c.addEventListener('mousedown',startF);c.addEventListener('mouseup',stopF);
c.addEventListener('touchstart',function(e){e.preventDefault();startF();},{passive:false});
c.addEventListener('touchend',function(e){e.preventDefault();stopF();},{passive:false});
rst();
`, "jetpack2");
}

function platformer2(): string {
  return wrap("Platformer 2", `
<h1>🏃 <span>Platformer</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Vies : <strong id="lives">3</strong></span></div>
<canvas id="g" width="600" height="400"></canvas>
<div class="controls">
<button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button>
<button ontouchstart="jump();event.preventDefault()" onclick="jump()" style="background:#22c55e;color:#fff">SAUT</button>
<button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button>
</div>
<div class="overlay" id="ov"><h2>Perdu</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var pl,plats,enemies,coins,sc,lv,ov,loop,cam;
function init(){pl={x:50,y:H-100,w:30,h:30,vx:0,vy:0,ground:false};plats=[{x:0,y:H-30,w:W*3,h:30}];for(var i=0;i<8;i++)plats.push({x:200+i*180,y:H-100-Math.random()*80,w:120,h:20});enemies=[];for(var i=0;i<5;i++)enemies.push({x:400+i*200,y:H-60,w:30,h:30,alive:true,vx:1});coins=[];for(var i=0;i<10;i++)coins.push({x:150+i*120,y:H-150-Math.random()*100,r:10,collected:false});sc=0;lv=3;ov=false;cam=0;document.getElementById('score').textContent='0';document.getElementById('lives').textContent='3';document.getElementById('ov').classList.remove('show');}
function mv(d){pl.vx=d*5;}
function jump(){if(pl.ground){pl.vy=-13;pl.ground=false;}}
window.mv=mv;window.jump=jump;
function upd(){pl.x+=pl.vx;pl.vx*=0.9;pl.vy+=0.7;pl.y+=pl.vy;pl.ground=false;plats.forEach(function(p){if(pl.x+pl.w>p.x&&pl.x<p.x+p.w&&pl.y+pl.h>p.y&&pl.y+pl.h<p.y+p.h+15&&pl.vy>0){pl.y=p.y-pl.h;pl.vy=0;pl.ground=true;}});if(pl.y>H){lv--;document.getElementById('lives').textContent=lv;if(lv<=0){ov=true;document.getElementById('fin').textContent=sc;document.getElementById('ov').classList.add('show');return;}pl.x=50;pl.y=H-100;pl.vy=0;pl.vx=0;}enemies.forEach(function(e){if(!e.alive)return;e.x+=e.vx;if(e.x<200||e.x>W*3-100)e.vx*=-1;if(pl.x+pl.w>e.x&&pl.x<e.x+e.w&&pl.y+pl.h>e.y&&pl.y<e.y+e.h){if(pl.vy>0){e.alive=false;pl.vy=-10;sc+=100;document.getElementById('score').textContent=sc;}else{lv--;document.getElementById('lives').textContent=lv;pl.x=50;pl.y=H-100;pl.vy=0;if(lv<=0){ov=true;document.getElementById('fin').textContent=sc;document.getElementById('ov').classList.add('show');}}}});coins.forEach(function(co){if(!co.collected&&Math.hypot(co.x-pl.x-15,co.y-pl.y-15)<25){co.collected=true;sc+=50;document.getElementById('score').textContent=sc;}});cam=pl.x-W/3;if(cam<0)cam=0;}
function draw(){x.fillStyle='#0a0a14';x.fillRect(0,0,W,H);x.save();x.translate(-cam,0);x.fillStyle='#facc15';plats.forEach(function(p){x.fillRect(p.x,p.y,p.w,p.h);});x.fillStyle='#ef4444';enemies.forEach(function(e){if(e.alive)x.fillRect(e.x,e.y,e.w,e.h);});x.fillStyle='#22c55e';coins.forEach(function(co){if(!co.collected){x.beginPath();x.arc(co.x,co.y,co.r,0,6.3);x.fill();}});x.fillStyle='#a855f7';x.fillRect(pl.x,pl.y,pl.w,pl.h);x.restore();}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')mv(-1);if(e.key==='ArrowRight')mv(1);if(e.key===' ')jump();});
rst();
`, "platformer2");
}

function towerDefense2(): string {
  return wrap("Tower 2", `
<h1>🏰 <span>Tower 2</span></h1>
<div class="stats"><span>Vies : <strong id="lives">10</strong></span><span>Or : <strong id="gold">150</strong></span></div>
<canvas id="g" width="600" height="400"></canvas>
<div class="controls">
<button ontouchstart="pl();event.preventDefault()" onclick="pl()" style="background:#22c55e;color:#fff;width:140px">Tourelle 50</button>
<button ontouchstart="wave();event.preventDefault()" onclick="wave()" style="background:#facc15;color:#000;width:140px">Vague</button>
</div>
<div class="overlay" id="ov"><h2>Game Over</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var towers,enemies,projs,lives,gold,waveN,ov,loop,path;
function init(){path=[{x:0,y:200},{x:150,y:200},{x:150,y:100},{x:400,y:100},{x:400,y:300},{x:600,y:300}];towers=[];enemies=[];projs=[];lives=10;gold=150;waveN=0;ov=false;document.getElementById('lives').textContent='10';document.getElementById('gold').textContent='150';document.getElementById('ov').classList.remove('show');}
function pl(){if(ov||gold<50)return;gold-=50;towers.push({x:200+Math.random()*300,y:50+Math.random()*(H-100),range:90,cd:0});document.getElementById('gold').textContent=gold;}
window.pl=pl;
function wave(){if(ov)return;waveN++;for(var i=0;i<4+waveN*2;i++)enemies.push({pi:0,prog:0,hp:20+waveN*5,maxHp:20+waveN*5,sp:0.5+waveN*0.05});}
window.wave=wave;
function upd(){enemies.forEach(function(e){e.prog+=e.sp;var tgt=path[e.pi+1];if(!tgt){e.dead=true;lives--;document.getElementById('lives').textContent=lives;if(lives<=0){ov=true;document.getElementById('ov').classList.add('show');}return;}var st=path[e.pi];var dx=tgt.x-st.x,dy=tgt.y-st.y;var d=Math.sqrt(dx*dx+dy*dy);if(e.prog>=d){e.prog=0;e.pi++;}else{e.x=st.x+dx*(e.prog/d);e.y=st.y+dy*(e.prog/d);}});enemies=enemies.filter(function(e){return !e.dead;});towers.forEach(function(t){t.cd--;if(t.cd>0)return;var tgt=null;var minD=999;enemies.forEach(function(e){var d=Math.hypot(e.x-t.x,e.y-t.y);if(d<t.range&&d<minD){minD=d;tgt=e;}});if(tgt){t.cd=30;projs.push({x:t.x,y:t.y,tgt:tgt,sp:8});}});projs.forEach(function(p){if(!p.tgt||p.tgt.dead){p.dead=true;return;}var dx=p.tgt.x-p.x,dy=p.tgt.y-p.y;var d=Math.sqrt(dx*dx+dy*dy);if(d<10){p.tgt.hp-=10;if(p.tgt.hp<=0){p.tgt.dead=true;gold+=20;document.getElementById('gold').textContent=gold;}p.dead=true;}else{p.x+=dx/d*p.sp;p.y+=dy/d*p.sp;}});projs=projs.filter(function(p){return !p.dead;});enemies=enemies.filter(function(e){return !e.dead;});}
function draw(){x.fillStyle='#0a0a0a';x.fillRect(0,0,W,H);x.strokeStyle='#333';x.lineWidth=30;x.lineCap='round';x.beginPath();x.moveTo(path[0].x,path[0].y);for(var i=1;i<path.length;i++)x.lineTo(path[i].x,path[i].y);x.stroke();x.fillStyle='#facc15';towers.forEach(function(t){x.beginPath();x.arc(t.x,t.y,15,0,6.3);x.fill();});x.fillStyle='#ef4444';enemies.forEach(function(e){x.fillRect(e.x-8,e.y-8,16,16);});x.fillStyle='#fff';enemies.forEach(function(e){x.fillRect(e.x-10,e.y-14,20*(e.hp/e.maxHp),3);});x.fillStyle='#22c55e';projs.forEach(function(p){x.beginPath();x.arc(p.x,p.y,4,0,6.3);x.fill();});}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,20);}
window.rst=rst;rst();
`, "tower2");
}

function vampire(): string {
  return wrap("Vampire", `
<h1>🧛 <span>Vampire</span></h1>
<div class="stats"><span>Niveau : <strong id="lvl">1</strong></span><span>HP : <strong id="hp">100</strong></span></div>
<canvas id="g" width="600" height="450"></canvas>
<div class="controls">
<button ontouchstart="mv('l');event.preventDefault()" onclick="mv('l')">←</button>
<button ontouchstart="mv('u');event.preventDefault()" onclick="mv('u')">↑</button>
<button ontouchstart="mv('d');event.preventDefault()" onclick="mv('d')">↓</button>
<button ontouchstart="mv('r');event.preventDefault()" onclick="mv('r')">→</button>
</div>
<div class="overlay" id="ov"><h2>Game Over</h2><p>Niveau : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var pl,en,xp,need,lvl,hp,ov,loop,t;
function init(){pl={x:W/2,y:H/2,w:20,h:20};en=[];xp=0;need=5;lvl=1;hp=100;ov=false;t=0;document.getElementById('lvl').textContent='1';document.getElementById('hp').textContent='100';document.getElementById('ov').classList.remove('show');}
function mv(d){if(ov)return;var s=18;if(d==='l')pl.x-=s;if(d==='r')pl.x+=s;if(d==='u')pl.y-=s;if(d==='d')pl.y+=s;pl.x=Math.max(0,Math.min(W-pl.w,pl.x));pl.y=Math.max(0,Math.min(H-pl.h,pl.y));}
window.mv=mv;
function upd(){t++;if(t%40===0){var side=Math.floor(Math.random()*4);var ex,ey;if(side===0){ex=Math.random()*W;ey=-20;}else if(side===1){ex=W+20;ey=Math.random()*H;}else if(side===2){ex=Math.random()*W;ey=H+20;}else{ex=-20;ey=Math.random()*H;}en.push({x:ex,y:ey,hp:1+lvl/3,sp:0.4+lvl*0.05});}en.forEach(function(e){var dx=pl.x+10-e.x,dy=pl.y+10-e.y;var d=Math.sqrt(dx*dx+dy*dy);if(d>0){e.x+=dx/d*e.sp;e.y+=dy/d*e.sp;}if(d<25){hp-=0.5;document.getElementById('hp').textContent=Math.floor(hp);if(hp<=0&&!ov){ov=true;document.getElementById('fin').textContent=lvl;document.getElementById('ov').classList.add('show');}}});en.forEach(function(e,i){var d=Math.hypot(e.x-pl.x-10,e.y-pl.y-10);if(d<60){en[i].hp-=0.08;if(en[i].hp<=0){en[i].dead=true;xp++;if(xp>=need){xp=0;lvl++;need=lvl*3;document.getElementById('lvl').textContent=lvl;hp=Math.min(100,hp+10);document.getElementById('hp').textContent=Math.floor(hp);}}}});en=en.filter(function(e){return !e.dead;});}
function draw(){x.fillStyle='#0a0a1a';x.fillRect(0,0,W,H);x.fillStyle='#a855f7';x.beginPath();x.arc(pl.x+10,pl.y+10,10,0,6.3);x.fill();x.strokeStyle='#a855f7';x.globalAlpha=0.15;x.lineWidth=2;x.beginPath();x.arc(pl.x+10,pl.y+10,60,0,6.3);x.stroke();x.globalAlpha=1;x.fillStyle='#ef4444';en.forEach(function(e){x.beginPath();x.arc(e.x,e.y,8,0,6.3);x.fill();});}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')mv('l');if(e.key==='ArrowRight')mv('r');if(e.key==='ArrowUp')mv('u');if(e.key==='ArrowDown')mv('d');});
rst();
`, "vampire");
}

// ═══ PAQUET 10 ═══
// ═══════════════════════════════════════════════════════════════

function asteroids2(): string {
  return wrap("Astéroïdes+", `
<h1>🌌 <span>Astéroïdes+</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Vies : <strong id="lives">3</strong></span></div>
<canvas id="g" width="500" height="500"></canvas>
<div class="controls"><button ontouchstart="shoot();event.preventDefault()" onclick="shoot()">🔥</button></div>
<div class="overlay" id="ov"><h2>Game Over</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var ship,rocks,bullets,sc,lv,ov,loop;
function init(){ship={x:W/2,y:H/2,angle:0};rocks=[];bullets=[];for(var i=0;i<6;i++)rocks.push({x:Math.random()*W,y:Math.random()*H,r:15+Math.random()*20,vx:(Math.random()-0.5)*2,vy:(Math.random()-0.5)*2});sc=0;lv=3;ov=false;document.getElementById('score').textContent='0';document.getElementById('lives').textContent='3';document.getElementById('ov').classList.remove('show');}
function shoot(){if(ov)return;bullets.push({x:ship.x,y:ship.y,vx:Math.cos(ship.angle)*8,vy:Math.sin(ship.angle)*8,life:60});}
window.shoot=shoot;
function upd(){rocks.forEach(function(r){r.x+=r.vx;r.y+=r.vy;if(r.x<0||r.x>W)r.vx*=-1;if(r.y<0||r.y>H)r.vy*=-1;});bullets.forEach(function(b){b.x+=b.vx;b.y+=b.vy;b.life--;});bullets=bullets.filter(function(b){return b.life>0&&b.x>0&&b.x<W&&b.y>0&&b.y<H;});bullets.forEach(function(b){for(var i=0;i<rocks.length;i++){if(Math.hypot(b.x-rocks[i].x,b.y-rocks[i].y)<rocks[i].r){rocks[i].dead=true;b.life=0;sc+=20;document.getElementById('score').textContent=sc;break;}}});rocks=rocks.filter(function(r){return !r.dead;});while(rocks.length<6)rocks.push({x:Math.random()*W,y:Math.random()*H,r:15+Math.random()*20,vx:(Math.random()-0.5)*2,vy:(Math.random()-0.5)*2});rocks.forEach(function(r){if(Math.hypot(r.x-ship.x,r.y-ship.y)<r.r+10){lv--;document.getElementById('lives').textContent=lv;ship.x=W/2;ship.y=H/2;if(lv<=0){ov=true;document.getElementById('ov').classList.add('show');}}});}
function draw(){x.fillStyle='#000';x.fillRect(0,0,W,H);x.save();x.translate(ship.x,ship.y);x.rotate(ship.angle);x.fillStyle='#22c55e';x.beginPath();x.moveTo(15,0);x.lineTo(-10,-8);x.lineTo(-10,8);x.closePath();x.fill();x.restore();x.strokeStyle='#a855f7';x.lineWidth=2;rocks.forEach(function(r){x.beginPath();x.arc(r.x,r.y,r.r,0,6.3);x.stroke();});x.fillStyle='#facc15';bullets.forEach(function(b){x.fillRect(b.x-2,b.y-2,4,4);});}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,20);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key===' '){shoot();e.preventDefault();}});
var rot=0;
document.addEventListener('mousemove',function(e){var r=c.getBoundingClientRect();ship.angle=Math.atan2((e.clientY-r.top)*(H/r.height)-ship.y,(e.clientX-r.left)*(W/r.width)-ship.x);});
rst();
`, "asteroids2");
}

function tank2(): string {
  return wrap("Tank 2", `
<h1>🚁 <span>Tank 2</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Vies : <strong id="lives">3</strong></span></div>
<canvas id="g" width="500" height="500"></canvas>
<div class="controls"><button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button><button ontouchstart="sh();event.preventDefault()" onclick="sh()">🔥</button><button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button></div>
<div class="overlay" id="ov"><h2>Game Over</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var pl,en,bl,sc,lv,ov,loop,t;
function init(){pl={x:W/2-20,y:H-50,w:40,h:30};en=[];bl=[];sc=0;lv=3;ov=false;t=0;document.getElementById('score').textContent='0';document.getElementById('lives').textContent='3';document.getElementById('ov').classList.remove('show');}
function mv(d){pl.x+=d*20;pl.x=Math.max(0,Math.min(W-pl.w,pl.x));}
function sh(){if(ov)return;bl.push({x:pl.x+pl.w/2,y:pl.y,vy:-10});}
window.mv=mv;window.sh=sh;
function upd(){t++;if(t%50===0)en.push({x:Math.random()*(W-40),y:-40,w:40,h:30,hp:1,vy:1.5});en.forEach(function(e){e.y+=e.vy;});bl.forEach(function(b){b.y+=b.vy;});bl=bl.filter(function(b){return b.y>0;});bl.forEach(function(b){en.forEach(function(e){if(e.hp<=0)return;if(Math.hypot(b.x-(e.x+20),b.y-(e.y+15))<25){e.hp--;b.y=-100;if(e.hp<=0){sc+=30;document.getElementById('score').textContent=sc;}}});});bl=bl.filter(function(b){return b.y>0;});en=en.filter(function(e){return e.hp>0&&e.y<H+50;});en.forEach(function(e){if(e.y+e.h>pl.y&&e.x<pl.x+pl.w&&e.x+e.w>pl.x){lv--;document.getElementById('lives').textContent=lv;e.hp=0;if(lv<=0){ov=true;document.getElementById('ov').classList.add('show');}}});en=en.filter(function(e){return e.hp>0;});}
function draw(){x.fillStyle='#000';x.fillRect(0,0,W,H);x.fillStyle='#22c55e';x.fillRect(pl.x,pl.y,pl.w,pl.h);x.fillRect(pl.x+pl.w/2-3,pl.y-10,6,10);x.fillStyle='#facc15';bl.forEach(function(b){x.fillRect(b.x-2,b.y,4,8);});en.forEach(function(e){x.fillStyle='#ef4444';x.fillRect(e.x,e.y,e.w,e.h);});}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,20);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')mv(-1);if(e.key==='ArrowRight')mv(1);if(e.key===' ')sh();});
rst();
`, "tank2");
}

function tigerHeli(): string {
  return wrap("Tiger Heli", `
<h1>🚁 <span>Tiger Heli</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="400" height="500"></canvas>
<div class="controls"><button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button><button ontouchstart="sh();event.preventDefault()" onclick="sh()">🔥</button><button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button></div>
<div class="overlay" id="ov"><h2>Game Over</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var pl,en,bl,sc,ov,loop,t,scroll;
function init(){pl={x:W/2-20,y:H-80,w:40,h:30};en=[];bl=[];sc=0;ov=false;t=0;scroll=0;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function mv(d){pl.x+=d*15;pl.x=Math.max(0,Math.min(W-pl.w,pl.x));}
function sh(){if(ov)return;bl.push({x:pl.x+pl.w/2,y:pl.y,vy:-10});}
window.mv=mv;window.sh=sh;
function upd(){scroll+=3;t++;if(t%40===0)en.push({x:Math.random()*(W-30),y:-30,w:30,h:30,vy:1.5});en.forEach(function(e){e.y+=e.vy+scroll/30;});bl.forEach(function(b){b.y+=b.vy;});bl=bl.filter(function(b){return b.y>0;});bl.forEach(function(b){en.forEach(function(e){if(e.dead)return;if(Math.hypot(b.x-(e.x+15),b.y-(e.y+15))<20){e.dead=true;b.y=-100;sc+=20;document.getElementById('score').textContent=sc;}});});bl=bl.filter(function(b){return b.y>0;});en=en.filter(function(e){return !e.dead&&e.y<H+30;});en.forEach(function(e){if(e.x<pl.x+pl.w&&e.x+e.w>pl.x&&e.y<pl.y+pl.h&&e.y+e.h>pl.y){ov=true;document.getElementById('ov').classList.add('show');}});}
function draw(){x.fillStyle='#0a2a0a';x.fillRect(0,0,W,H);for(var i=0;i<20;i++){x.fillStyle=(i%2)?'#0f3a0f':'#0a2a0a';x.fillRect(0,(i*40+scroll)%H,W,20);}x.fillStyle='#22c55e';x.fillRect(pl.x,pl.y,pl.w,pl.h);x.fillRect(pl.x-10,pl.y+10,10,4);x.fillRect(pl.x+pl.w,pl.y+10,10,4);x.fillStyle='#ef4444';en.forEach(function(e){x.fillRect(e.x,e.y,e.w,e.h);});x.fillStyle='#facc15';bl.forEach(function(b){x.fillRect(b.x-2,b.y,4,8);});}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,20);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')mv(-1);if(e.key==='ArrowRight')mv(1);if(e.key===' ')sh();});
rst();
`, "tigerheli");
}

function ivan(): string {
  return wrap("Ivan", `
<h1>⚔️ <span>Ivan</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Vies : <strong id="lives">5</strong></span></div>
<canvas id="g" width="500" height="400"></canvas>
<div class="controls">
<button ontouchstart="mv('l');event.preventDefault()" onclick="mv('l')">←</button>
<button ontouchstart="mv('u');event.preventDefault()" onclick="mv('u')">↑</button>
<button ontouchstart="mv('d');event.preventDefault()" onclick="mv('d')">↓</button>
<button ontouchstart="mv('r');event.preventDefault()" onclick="mv('r')">→</button>
</div>
<div class="overlay" id="ov"><h2>Game Over</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var pl,en,sc,lv,ov,loop;
function init(){pl={x:50,y:H/2,w:30,h:40};en=[];for(var i=0;i<5;i++)en.push({x:W-i*80-40,y:50+Math.random()*(H-100),w:30,h:40,hp:2});sc=0;lv=5;ov=false;document.getElementById('score').textContent='0';document.getElementById('lives').textContent='5';document.getElementById('ov').classList.remove('show');}
function mv(d){if(d==='l')pl.x-=20;if(d==='r')pl.x+=20;if(d==='u')pl.y-=20;if(d==='d')pl.y+=20;pl.x=Math.max(0,Math.min(W-pl.w,pl.x));pl.y=Math.max(0,Math.min(H-pl.h,pl.y));}
window.mv=mv;
function upd(){en.forEach(function(e){var dx=pl.x-e.x,dy=pl.y-e.y;var d=Math.sqrt(dx*dx+dy*dy);if(d>30){e.x+=dx/d*0.8;e.y+=dy/d*0.8;}if(d<35){lv--;document.getElementById('lives').textContent=lv;e.hp=0;if(lv<=0){ov=true;document.getElementById('ov').classList.add('show');}}});}
setInterval(function(){if(ov)return;en.forEach(function(e){if(Math.hypot(e.x-pl.x,e.y-pl.y)<50){e.hp-=1;if(e.hp<=0){e.dead=true;sc+=20;document.getElementById('score').textContent=sc;}}});en=en.filter(function(e){return !e.dead;});},500);
function draw(){x.fillStyle='#8b4513';x.fillRect(0,0,W,H);x.fillStyle='#22c55e';x.fillRect(pl.x,pl.y,pl.w,pl.h);x.fillStyle='#ef4444';en.forEach(function(e){x.fillRect(e.x,e.y,e.w,e.h);x.fillStyle='#fff';x.fillRect(e.x,e.y-8,30*(e.hp/2),3);x.fillStyle='#ef4444';});}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,20);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')mv('l');if(e.key==='ArrowRight')mv('r');if(e.key==='ArrowUp')mv('u');if(e.key==='ArrowDown')mv('d');});
rst();
`, "ivan");
}

function firefighter(): string {
  return wrap("Pompier", `
<h1>🚒 <span>Pompier</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="500" height="500"></canvas>
<div class="controls">
<button ontouchstart="mv('l');event.preventDefault()" onclick="mv('l')">←</button>
<button ontouchstart="mv('u');event.preventDefault()" onclick="mv('u')">↑</button>
<button ontouchstart="mv('d');event.preventDefault()" onclick="mv('d')">↓</button>
<button ontouchstart="mv('r');event.preventDefault()" onclick="mv('r')">→</button>
</div>
<div class="overlay" id="ov"><h2>Brûlé !</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var pl,fires,humans,sc,ov,loop,t;
function init(){pl={x:W/2,y:H/2,w:30,h:30};fires=[];humans=[];sc=0;ov=false;t=0;for(var i=0;i<3;i++)humans.push({x:Math.random()*W,y:Math.random()*H,saved:false});document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function mv(d){if(d==='l')pl.x-=15;if(d==='r')pl.x+=15;if(d==='u')pl.y-=15;if(d==='d')pl.y+=15;pl.x=Math.max(0,Math.min(W-pl.w,pl.x));pl.y=Math.max(0,Math.min(H-pl.h,pl.y));}
window.mv=mv;
function upd(){t++;if(t%20===0)fires.push({x:Math.random()*W,y:Math.random()*H,r:15+Math.random()*10,life:100});fires.forEach(function(f){f.life--;});fires=fires.filter(function(f){return f.life>0;});fires.forEach(function(f){if(Math.hypot(f.x-pl.x-15,f.y-pl.y-15)<20){ov=true;document.getElementById('fin').textContent=sc;document.getElementById('ov').classList.add('show');}});humans.forEach(function(h){if(!h.saved&&Math.hypot(h.x-pl.x-15,h.y-pl.y-15)<25){h.saved=true;sc+=100;document.getElementById('score').textContent=sc;}});if(humans.every(function(h){return h.saved;})){for(var i=0;i<3;i++)humans.push({x:Math.random()*W,y:Math.random()*H,saved:false});}}
function draw(){x.fillStyle='#0a0a0a';x.fillRect(0,0,W,H);fires.forEach(function(f){x.fillStyle='rgba(239,68,68,'+(f.life/100)+')';x.beginPath();x.arc(f.x,f.y,f.r,0,6.3);x.fill();});humans.forEach(function(h){if(!h.saved){x.font='24px system-ui';x.fillText('🧑',h.x,h.y);}});x.fillStyle='#22c55e';x.fillRect(pl.x,pl.y,pl.w,pl.h);x.fillStyle='#fff';x.fillRect(pl.x+8,pl.y+5,14,10);}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,30);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')mv('l');if(e.key==='ArrowRight')mv('r');if(e.key==='ArrowUp')mv('u');if(e.key==='ArrowDown')mv('d');});
rst();
`, "firefighter");
}

function pirateGame(): string {
  return wrap("Pirate", `
<h1>🏴‍☠️ <span>Pirate</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>HP : <strong id="hp">100</strong></span></div>
<canvas id="g" width="600" height="400"></canvas>
<div class="controls"><button ontouchstart="sh();event.preventDefault()" onclick="sh()" style="width:160px;background:#ef4444;color:#fff">TIRER</button></div>
<div class="overlay" id="ov"><h2>Perdu</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var pl,en,bl,sc,hp,ov,loop,t,scroll;
function init(){pl={x:W/2-40,y:H-70,w:80,h:50};en=[];bl=[];sc=0;hp=100;ov=false;t=0;scroll=0;document.getElementById('score').textContent='0';document.getElementById('hp').textContent='100';document.getElementById('ov').classList.remove('show');}
function sh(){if(ov)return;bl.push({x:pl.x+40,y:pl.y,vy:-8});}
window.sh=sh;
function upd(){scroll+=2;t++;if(t%50===0)en.push({x:Math.random()*(W-60),y:-40,w:60,h:50,hp:2,vy:1.5});en.forEach(function(e){e.y+=e.vy;});bl.forEach(function(b){b.y+=b.vy;});bl=bl.filter(function(b){return b.y>0;});bl.forEach(function(b){en.forEach(function(e){if(e.hp<=0)return;if(b.y<e.y+e.h&&b.y>e.y&&b.x>e.x&&b.x<e.x+e.w){e.hp--;b.y=-100;if(e.hp<=0){sc+=50;document.getElementById('score').textContent=sc;}}});});bl=bl.filter(function(b){return b.y>0;});en=en.filter(function(e){return e.hp>0&&e.y<H;});en.forEach(function(e){if(e.x<pl.x+pl.w&&e.x+e.w>pl.x&&e.y<pl.y+pl.h&&e.y+e.h>pl.y){hp-=20;document.getElementById('hp').textContent=hp;e.hp=0;if(hp<=0){ov=true;document.getElementById('fin').textContent=sc;document.getElementById('ov').classList.add('show');}}});en=en.filter(function(e){return e.hp>0;});}
function draw(){var grad=x.createLinearGradient(0,0,0,H);grad.addColorStop(0,'#87ceeb');grad.addColorStop(1,'#1e3a8a');x.fillStyle=grad;x.fillRect(0,0,W,H);x.fillStyle='#8b4513';x.fillRect(pl.x,pl.y+30,pl.w,pl.h-30);x.fillStyle='#facc15';x.beginPath();x.moveTo(pl.x+30,pl.y+30);x.lineTo(pl.x+50,pl.y);x.lineTo(pl.x+70,pl.y+30);x.closePath();x.fill();x.fillStyle='#8b4513';en.forEach(function(e){x.fillRect(e.x,e.y,e.w,e.h);});x.fillStyle='#facc15';bl.forEach(function(b){x.fillRect(b.x-2,b.y,4,8);});}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,20);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key===' '){sh();e.preventDefault();}});
c.addEventListener('click',sh);
rst();
`, "pirate");
}

function spaceExplorer(): string {
  return wrap("Explorateur", `
<h1>🛸 <span>Explorateur</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Carburant : <strong id="fuel">100</strong></span></div>
<canvas id="g" width="500" height="500"></canvas>
<div class="controls"><button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button><button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button></div>
<div class="overlay" id="ov"><h2>Perdu</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var pl,planets,sc,fuel,ov,loop,t,scroll;
function init(){pl={x:W/2-20,y:H-100,w:40,h:40};planets=[];sc=0;fuel=100;ov=false;t=0;scroll=0;document.getElementById('score').textContent='0';document.getElementById('fuel').textContent='100';document.getElementById('ov').classList.remove('show');}
function mv(d){pl.x+=d*20;pl.x=Math.max(0,Math.min(W-pl.w,pl.x));}
window.mv=mv;
function upd(){scroll+=2;t++;if(t%40===0)planets.push({x:Math.random()*(W-50),y:-50,w:50,h:50,type:Math.random()<0.7?'good':'bad'});planets.forEach(function(p){p.y+=3;});planets=planets.filter(function(p){return p.y<H+30;});planets.forEach(function(p){if(p.y+50>pl.y&&p.y<pl.y+pl.h&&p.x<pl.x+pl.w&&p.x+p.w>pl.x){if(p.type==='good'){sc+=10;fuel=Math.min(100,fuel+15);}else{fuel-=20;}p.done=true;document.getElementById('score').textContent=sc;document.getElementById('fuel').textContent=fuel;if(fuel<=0){ov=true;document.getElementById('ov').classList.add('show');}}});planets=planets.filter(function(p){return !p.done;});fuel-=0.05;document.getElementById('fuel').textContent=Math.floor(fuel);if(fuel<=0){ov=true;document.getElementById('ov').classList.add('show');}}
function draw(){x.fillStyle='#000';x.fillRect(0,0,W,H);for(var i=0;i<30;i++){x.fillStyle='#fff';x.fillRect((i*37+scroll)%W,(i*29)%H,2,2);}x.fillStyle='#22c55e';x.fillRect(pl.x,pl.y,pl.w,pl.h);x.fillRect(pl.x+pl.w/2-5,pl.y-10,10,10);planets.forEach(function(p){x.fillStyle=p.type==='good'?'#3b82f6':'#ef4444';x.beginPath();x.arc(p.x+25,p.y+25,25,0,6.3);x.fill();});}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,20);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')mv(-1);if(e.key==='ArrowRight')mv(1);});
rst();
`, "space-explorer");
}

function zombieSurvival(): string {
  return wrap("Survie Zombie", `
<h1>🧟 <span>Survie</span></h1>
<div class="stats"><span>Vagues : <strong id="waves">0</strong></span><span>HP : <strong id="hp">100</strong></span></div>
<canvas id="g" width="500" height="500"></canvas>
<div class="controls"><button ontouchstart="sh();event.preventDefault()" onclick="sh()" style="width:160px">TIRER</button></div>
<div class="overlay" id="ov"><h2>Mort</h2><p>Vagues : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var pl,zombs,bullets,hp,waves,ov,loop,t,mx,my;
function init(){pl={x:W/2,y:H/2};zombs=[];bullets=[];hp=100;waves=0;ov=false;t=0;mx=W/2;my=H/2;document.getElementById('hp').textContent='100';document.getElementById('waves').textContent='0';document.getElementById('ov').classList.remove('show');}
function sh(){if(ov)return;var dx=mx-pl.x,dy=my-pl.y;var d=Math.sqrt(dx*dx+dy*dy);bullets.push({x:pl.x,y:pl.y,vx:dx/d*10,vy:dy/d*10,life:60});}
window.sh=sh;
function upd(){t++;if(t%80===0){waves++;document.getElementById('waves').textContent=waves;for(var i=0;i<waves+2;i++){var a=Math.random()*Math.PI*2;zombs.push({x:pl.x+Math.cos(a)*400,y:pl.y+Math.sin(a)*400,hp:2,sp:0.8});}}zombs.forEach(function(z){var dx=pl.x-z.x,dy=pl.y-z.y;var d=Math.sqrt(dx*dx+dy*dy);if(d>25){z.x+=dx/d*z.sp;z.y+=dy/d*z.sp;}if(d<25){hp-=0.3;document.getElementById('hp').textContent=Math.floor(hp);if(hp<=0&&!ov){ov=true;document.getElementById('fin').textContent=waves;document.getElementById('ov').classList.add('show');}}});bullets.forEach(function(b){b.x+=b.vx;b.y+=b.vy;b.life--;});bullets=bullets.filter(function(b){return b.life>0;});bullets.forEach(function(b){zombs.forEach(function(z){if(Math.hypot(b.x-z.x,b.y-z.y)<15){z.hp--;b.life=0;if(z.hp<=0)z.dead=true;}});});bullets=bullets.filter(function(b){return b.life>0;});zombs=zombs.filter(function(z){return !z.dead;});}
function draw(){x.fillStyle='#0a0a0a';x.fillRect(0,0,W,H);x.fillStyle='#22c55e';x.beginPath();x.arc(pl.x,pl.y,15,0,6.3);x.fill();x.fillStyle='#ef4444';zombs.forEach(function(z){x.beginPath();x.arc(z.x,z.y,12,0,6.3);x.fill();});x.fillStyle='#facc15';bullets.forEach(function(b){x.beginPath();x.arc(b.x,b.y,3,0,6.3);x.fill();});x.strokeStyle='#22c55e';x.beginPath();x.moveTo(pl.x,pl.y);x.lineTo(mx,my);x.stroke();}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
c.addEventListener('mousemove',function(e){var r=c.getBoundingClientRect();mx=(e.clientX-r.left)*(W/r.width);my=(e.clientY-r.top)*(H/r.height);});
c.addEventListener('click',sh);
c.addEventListener('touchstart',function(e){e.preventDefault();var r=c.getBoundingClientRect();mx=(e.touches[0].clientX-r.left)*(W/r.width);my=(e.touches[0].clientY-r.top)*(H/r.height);sh();},{passive:false});
rst();
`, "zombie-survival");
}

function snakesLadders(): string {
  return wrap("Serpents & Échelles", `
<h1>🎲 <span>Serpents & Échelles</span></h1>
<div class="stats"><span>Position : <strong id="pos">1</strong>/100</span><span>Coups : <strong id="rolls">0</strong></span></div>
<div id="board" style="display:grid;grid-template-columns:repeat(10,min(40px,9vw));gap:2px;background:#1a1a1a;padding:12px;border-radius:12px"></div>
<div class="controls" style="margin-top:16px"><button ontouchstart="rollDice();event.preventDefault()" onclick="rollDice()" style="width:200px;background:#22c55e;color:#fff">LANCER LE DÉ</button></div>
<div class="overlay" id="ov"><h2>🎉 Gagné !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var pos,rolls,over;
var SNAKES={17:4,54:34,62:19,64:60,87:24,93:73,95:75,98:79};
var LADDERS={1:38,4:14,9:31,21:42,28:84,51:67,71:91,80:100};
function init(){pos=1;rolls=0;over=false;document.getElementById('pos').textContent='1';document.getElementById('rolls').textContent='0';document.getElementById('ov').classList.remove('show');render();}
function rollDice(){if(over)return;var d=Math.floor(Math.random()*6)+1;rolls++;pos+=d;if(pos>100)pos=100;if(LADDERS[pos])pos=LADDERS[pos];else if(SNAKES[pos])pos=SNAKES[pos];document.getElementById('pos').textContent=pos;document.getElementById('rolls').textContent=rolls;render();if(pos===100){over=true;setTimeout(function(){document.getElementById('ov').classList.add('show');},200);}}
window.rollDice=rollDice;
function render(){var b=document.getElementById('board');b.innerHTML='';for(var i=1;i<=100;i++){var cc=document.createElement('div');var bg='#2a2a2a';if(i===pos)bg='#22c55e';else if(SNAKES[i])bg='#7f1d1d';else if(LADDERS[i])bg='#166534';cc.style.cssText='aspect-ratio:1;background:'+bg+';border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:clamp(8px,2vw,12px);font-weight:900;color:#fff';cc.textContent=i;b.appendChild(cc);}}
function rst(){init();}
window.rst=rst;init();
`, "snakes-ladders");
}

function uno2(): string {
  return wrap("Uno Pro", `
<h1>🎴 <span>Uno Pro</span></h1>
<div class="stats"><span>Toi : <strong id="pc">7</strong></span><span>IA : <strong id="dc">7</strong></span></div>
<div id="board" style="background:#0a4a1a;padding:20px;border-radius:12px;min-width:400px;text-align:center;border:4px solid #facc15"></div>
<div class="controls" style="margin-top:16px">
<button ontouchstart="playCard();event.preventDefault()" onclick="playCard()" style="background:#22c55e;color:#fff;width:120px">Jouer</button>
<button ontouchstart="drawCard();event.preventDefault()" onclick="drawCard()" style="background:#facc15;color:#000;width:120px">Piocher</button>
</div>
<div class="overlay" id="ov"><h2 id="ttl">Fin</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var COLS=['🔴','🔵','🟢','🟡'];
var pl,ai,deck,cur,ov;
function makeDeck(){var d=[];COLS.forEach(function(c){for(var n=1;n<=9;n++)d.push({c:c,n:n});});return d.sort(function(){return Math.random()-0.5;});}
function init(){deck=makeDeck();pl=[];ai=[];for(var i=0;i<7;i++){pl.push(deck.pop());ai.push(deck.pop());}cur=deck.pop();ov=false;document.getElementById('ov').classList.remove('show');render();}
function render(){document.getElementById('pc').textContent=pl.length;document.getElementById('dc').textContent=ai.length;var h='<p style="color:#fff">Carte actuelle</p><div style="font-size:60px;margin:12px">'+cur.c+cur.n+'</div><p style="color:#fff">Tes cartes</p><div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin-top:8px">';pl.forEach(function(c,i){h+='<div style="padding:8px;background:#2a2a2a;border-radius:6px;font-size:22px;cursor:pointer" onclick="playIdx('+i+')">'+c.c+c.n+'</div>';});h+='</div>';document.getElementById('board').innerHTML=h;}
function playIdx(i){if(ov)return;var c=pl[i];if(c.c!==cur.c&&c.n!==cur.n)return;cur=c;pl.splice(i,1);render();if(pl.length===0){ov=true;document.getElementById('ttl').textContent='🎉 Gagné !';document.getElementById('ov').classList.add('show');return;}setTimeout(aiTurn,600);}
window.playIdx=playIdx;
function playCard(){for(var i=0;i<pl.length;i++)if(pl[i].c===cur.c||pl[i].n===cur.n){playIdx(i);return;}}
window.playCard=playCard;
function drawCard(){if(ov)return;if(deck.length===0)return;pl.push(deck.pop());render();setTimeout(aiTurn,600);}
window.drawCard=drawCard;
function aiTurn(){if(ov)return;for(var i=0;i<ai.length;i++){if(ai[i].c===cur.c||ai[i].n===cur.n){cur=ai[i];ai.splice(i,1);render();if(ai.length===0){ov=true;document.getElementById('ttl').textContent='😢 IA gagne';document.getElementById('ov').classList.add('show');}return;}}if(deck.length)ai.push(deck.pop());render();}
function rst(){init();}
window.rst=rst;init();
`, "uno2");
}

function yatzy(): string {
  return wrap("Yatzy", `
<h1>🎲 <span>Yatzy</span></h1>
<div class="stats"><span>Tour : <strong id="round">1</strong>/10</span><span>Score : <strong id="score">0</strong></span></div>
<div id="dice" style="display:flex;gap:10px;justify-content:center;margin:20px 0"></div>
<div class="controls">
<button ontouchstart="roll();event.preventDefault()" onclick="roll()" style="background:#22c55e;color:#fff;width:120px">Lancer</button>
<button ontouchstart="scoreIt();event.preventDefault()" onclick="scoreIt()" style="background:#facc15;color:#000;width:120px">Marquer</button>
</div>
<div class="overlay" id="ov"><h2>Terminé</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var dice,held,rolls,score,round,ov;
var EM=['⚀','⚁','⚂','⚃','⚄','⚅'];
function init(){dice=[1,1,1,1,1];held=[false,false,false,false,false];rolls=0;score=0;round=1;ov=false;document.getElementById('round').textContent='1';document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');render();}
function roll(){if(ov||rolls>=3)return;dice=dice.map(function(d,i){return held[i]?d:Math.floor(Math.random()*6)+1;});rolls++;render();}
window.roll=roll;
function scoreIt(){if(ov||rolls===0)return;var counts={};dice.forEach(function(d){counts[d]=(counts[d]||0)+1;});var pts=0;Object.keys(counts).forEach(function(k){var n=counts[k];if(n===3)pts+=15;else if(n===4)pts+=30;else if(n===5)pts+=50;else if(n===2)pts+=5;});score+=pts;round++;document.getElementById('round').textContent=Math.min(round,10);document.getElementById('score').textContent=score;dice=[1,1,1,1,1];held=[false,false,false,false,false];rolls=0;if(round>10){ov=true;document.getElementById('fin').textContent=score;document.getElementById('ov').classList.add('show');}render();}
window.scoreIt=scoreIt;
function render(){var d=document.getElementById('dice');d.innerHTML='';dice.forEach(function(v,i){var b=document.createElement('div');b.style.cssText='width:60px;height:60px;background:'+(held[i]?'#facc15':'#2a2a2a')+';border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:48px;cursor:pointer';b.textContent=EM[v-1];b.onclick=function(){held[i]=!held[i];render();};d.appendChild(b);});}
function rst(){init();}
window.rst=rst;init();
`, "yatzy");
}

function memoryColors(): string {
  return wrap("Memory Couleurs", `
<h1>🎨 <span>Memory Couleurs</span></h1>
<div class="stats"><span>Coups : <strong id="mv">0</strong></span><span>Paires : <strong id="p">0/6</strong></span></div>
<div id="bd" style="display:grid;grid-template-columns:repeat(4,min(80px,20vw));gap:8px;background:#1a1a1a;padding:12px;border-radius:12px;border:2px solid #facc15"></div>
<div class="overlay" id="ov"><h2>🎉 Bravo !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var COLS=['#ef4444','#3b82f6','#22c55e','#facc15','#a855f7','#f97316'],f,s,lock,mv,mat,cds;
function init(){cds=COLS.concat(COLS).sort(function(){return Math.random()-0.5;});f=null;s=null;lock=false;mv=0;mat=0;document.getElementById('mv').textContent='0';document.getElementById('p').textContent='0/6';document.getElementById('ov').classList.remove('show');render();}
function render(){var b=document.getElementById('bd');b.innerHTML='';cds.forEach(function(e,i){var cc=document.createElement('div');cc.style.cssText='width:100%;aspect-ratio:1;background:#2a2a2a;border-radius:10px;cursor:pointer';cc.dataset.idx=i;cc.dataset.em=e;cc.onclick=function(){flip(i,cc);};b.appendChild(cc);});}
function flip(i,cc){if(lock||cc.dataset.m==='1'||cc.style.background===cc.dataset.em)return;cc.style.background=cc.dataset.em;if(f===null){f=i;return;}if(s===null){s=i;lock=true;mv++;document.getElementById('mv').textContent=mv;var c1=document.querySelector('[data-idx="'+f+'"]'),c2=cc;if(c1.dataset.em===c2.dataset.em){c1.dataset.m='1';c2.dataset.m='1';mat++;document.getElementById('p').textContent=mat+'/6';f=null;s=null;lock=false;if(mat===6)setTimeout(function(){document.getElementById('ov').classList.add('show');},400);}else{setTimeout(function(){c1.style.background='#2a2a2a';c2.style.background='#2a2a2a';f=null;s=null;lock=false;},800);}}}
function rst(){init();}
window.rst=rst;init();
`, "memory-colors");
}

function speedClick(): string {
  return wrap("Speed Click", `
<h1>⚡ <span>Speed Click</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Temps : <strong id="time">15</strong>s</span></div>
<div id="bd" style="width:min(500px,90vw);height:400px;background:#1a1a1a;border-radius:16px;position:relative;overflow:hidden;border:2px solid #facc15"></div>
<div class="overlay" id="ov"><h2>Terminé</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var sc,t,ov,timer,interval;
function init(){sc=0;t=15;ov=false;document.getElementById('score').textContent='0';document.getElementById('time').textContent='15';document.getElementById('bd').innerHTML='';document.getElementById('ov').classList.remove('show');if(timer)clearInterval(timer);if(interval)clearInterval(interval);timer=setInterval(function(){if(ov)return;t--;document.getElementById('time').textContent=t;if(t<=0){ov=true;document.getElementById('fin').textContent=sc;document.getElementById('ov').classList.add('show');clearInterval(interval);}},1000);interval=setInterval(spawn,400);spawn();}
function spawn(){if(ov)return;var b=document.getElementById('bd');var target=document.createElement('div');target.style.cssText='position:absolute;width:50px;height:50px;background:#ef4444;border-radius:50%;cursor:pointer;left:'+(Math.random()*70)+'%;top:'+(Math.random()*70)+'%;transition:all .2s';target.onclick=function(){sc++;document.getElementById('score').textContent=sc;target.remove();};target.ontouchstart=function(e){e.preventDefault();sc++;document.getElementById('score').textContent=sc;target.remove();};b.appendChild(target);setTimeout(function(){if(target.parentNode)target.remove();},1500);}
function rst(){init();}
window.rst=rst;init();
`, "speed-click");
}

function colorMatch(): string {
  return wrap("Color Match", `
<h1>🌈 <span>Color Match</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Temps : <strong id="time">30</strong>s</span></div>
<div id="bd" style="text-align:center;padding:30px;background:#1a1a1a;border-radius:12px;border:2px solid #facc15;max-width:500px"></div>
<div class="overlay" id="ov"><h2>Terminé</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var COLORS=[{n:'ROUGE',c:'#ef4444'},{n:'BLEU',c:'#3b82f6'},{n:'VERT',c:'#22c55e'},{n:'JAUNE',c:'#facc15'},{n:'VIOLET',c:'#a855f7'},{n:'ORANGE',c:'#f97316'}];
var sc,t,ov,timer,current;
function init(){sc=0;t=30;ov=false;document.getElementById('score').textContent='0';document.getElementById('time').textContent='30';document.getElementById('ov').classList.remove('show');if(timer)clearInterval(timer);timer=setInterval(function(){if(ov)return;t--;document.getElementById('time').textContent=t;if(t<=0){ov=true;document.getElementById('fin').textContent=sc;document.getElementById('ov').classList.add('show');}},1000);next();}
function next(){var word=COLORS[Math.floor(Math.random()*COLORS.length)];var ink=COLORS[Math.floor(Math.random()*COLORS.length)];current=ink.c;var h='<p style="color:#888;margin-bottom:12px">Clique sur la COULEUR de l\\'ENCRE</p><p style="color:'+ink.c+';font-size:60px;font-weight:900;margin:20px">'+word.n+'</p><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">';COLORS.forEach(function(c){h+='<button ontouchstart="pick(\\''+c.c+'\\');event.preventDefault()" onclick="pick(\\''+c.c+'\\')" style="padding:20px;background:'+c.c+';border:none;border-radius:12px;cursor:pointer;font-weight:900;color:#fff;font-family:inherit">'+c.n+'</button>';});h+='</div>';document.getElementById('bd').innerHTML=h;}
function pick(c){if(ov)return;if(c===current){sc+=10;document.getElementById('score').textContent=sc;}else{sc=Math.max(0,sc-5);document.getElementById('score').textContent=sc;}next();}
window.pick=pick;
function rst(){init();}
window.rst=rst;init();
`, "color-match");
}

function whackAMole(): string {
  return wrap("Taupe", `
<h1>🐹 <span>Whack-a-Mole</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Temps : <strong id="time">30</strong>s</span></div>
<div id="bd" style="display:grid;grid-template-columns:repeat(3,min(100px,25vw));gap:12px;background:#1a1a1a;padding:20px;border-radius:12px;border:2px solid #facc15"></div>
<div class="overlay" id="ov"><h2>Terminé</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var sc,t,ov,timer,mole,moleTimer;
function init(){sc=0;t=30;ov=false;document.getElementById('score').textContent='0';document.getElementById('time').textContent='30';document.getElementById('ov').classList.remove('show');if(timer)clearInterval(timer);if(moleTimer)clearTimeout(moleTimer);timer=setInterval(function(){if(ov)return;t--;document.getElementById('time').textContent=t;if(t<=0){ov=true;document.getElementById('fin').textContent=sc;document.getElementById('ov').classList.add('show');clearTimeout(moleTimer);}},1000);render();spawnMole();}
function render(){var b=document.getElementById('bd');b.innerHTML='';for(var i=0;i<9;i++){var hole=document.createElement('div');hole.dataset.idx=i;hole.style.cssText='aspect-ratio:1;background:#3a3a1a;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:50px;cursor:pointer';if(mole===i){hole.textContent='🐹';hole.style.background='#facc15';}hole.onclick=function(i){return function(){hit(i);};}(i);b.appendChild(hole);}}
function spawnMole(){if(ov)return;mole=Math.floor(Math.random()*9);render();moleTimer=setTimeout(function(){mole=-1;render();spawnMole();},800+Math.random()*400);}
function hit(i){if(ov)return;if(i===mole){sc+=10;document.getElementById('score').textContent=sc;clearTimeout(moleTimer);mole=-1;render();setTimeout(spawnMole,200);}else{sc=Math.max(0,sc-3);document.getElementById('score').textContent=sc;}}
function rst(){init();}
window.rst=rst;init();
`, "whack-a-mole");
}

function simonColors(): string {
  return wrap("Simon Colors", `
<h1>🎵 <span>Simon Colors</span></h1>
<div class="stats"><span>Niveau : <strong id="lvl">1</strong></span><span>Record : <strong id="best">0</strong></span></div>
<div id="bd" style="display:grid;grid-template-columns:repeat(2,min(120px,35vw));grid-template-rows:repeat(2,min(120px,35vw));gap:12px"></div>
<div class="overlay" id="ov"><h2>Perdu</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var COLS=['#ef4444','#3b82f6','#22c55e','#facc15'];
var seq,input,lock,lvl,ov;
try{document.getElementById('best').textContent=localStorage.getItem('sc_b')||'0';}catch(e){}
function init(){seq=[];input=[];lock=true;lvl=0;ov=false;document.getElementById('ov').classList.remove('show');render();setTimeout(next,500);}
function render(){var b=document.getElementById('bd');b.innerHTML='';COLS.forEach(function(c,i){var div=document.createElement('div');div.dataset.idx=i;div.style.cssText='background:'+c+';border-radius:20px;cursor:pointer;opacity:.4;transition:opacity .2s';div.onclick=function(){press(i);};b.appendChild(div);});}
function light(i,t){var d=document.querySelector('[data-idx="'+i+'"]');if(!d)return;d.style.opacity='1';setTimeout(function(){d.style.opacity='.4';},t||300);}
function next(){lvl++;document.getElementById('lvl').textContent=lvl;seq.push(Math.floor(Math.random()*4));input=[];lock=true;var i=0;var iv=setInterval(function(){if(i>=seq.length){clearInterval(iv);lock=false;return;}light(seq[i],400);i++;},700);}
function press(i){if(lock)return;light(i,200);input.push(i);if(input[input.length-1]!==seq[input.length-1]){ov=true;document.getElementById('ov').classList.add('show');try{var b=parseInt(localStorage.getItem('sc_b')||'0');if(lvl-1>b){localStorage.setItem('sc_b',lvl-1);document.getElementById('best').textContent=lvl-1;}}catch(e){}return;}if(input.length===seq.length){lock=true;setTimeout(next,700);}}
function rst(){init();}
window.rst=rst;init();
`, "simon-colors");
}

function bingo(): string {
  return wrap("Bingo", `
<h1>🎱 <span>Bingo</span></h1>
<div class="stats"><span>Tours : <strong id="rounds">0</strong></span></div>
<div id="bd" style="display:grid;grid-template-columns:repeat(5,min(60px,15vw));gap:6px;background:#1a1a1a;padding:16px;border-radius:12px;border:2px solid #facc15"></div>
<div id="drawn" style="color:#facc15;font-weight:900;margin:16px 0;text-align:center"></div>
<div class="controls"><button ontouchstart="draw();event.preventDefault()" onclick="draw()" style="width:180px;background:#22c55e;color:#fff">TIRER UN NUMÉRO</button></div>
<div class="overlay" id="ov"><h2>🎉 BINGO !</h2><p>Tours : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var board,drawnNums,rounds,ov;
function init(){board=[];drawnNums=[];rounds=0;ov=false;var pool=[];for(var i=1;i<=75;i++)pool.push(i);pool.sort(function(){return Math.random()-0.5;});for(var i=0;i<25;i++)board.push(pool[i]);document.getElementById('rounds').textContent='0';document.getElementById('drawn').textContent='';document.getElementById('ov').classList.remove('show');render();}
function draw(){if(ov)return;var n=Math.floor(Math.random()*75)+1;if(drawnNums.indexOf(n)<0)drawnNums.push(n);rounds++;document.getElementById('rounds').textContent=rounds;document.getElementById('drawn').textContent='Tirés : '+drawnNums.slice(-10).join(', ');render();checkBingo();}
window.draw=draw;
function render(){var b=document.getElementById('bd');b.innerHTML='';board.forEach(function(n,i){var cc=document.createElement('div');var marked=drawnNums.indexOf(n)>=0;cc.style.cssText='aspect-ratio:1;background:'+(marked?'#22c55e':'#2a2a2a')+';border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:clamp(14px,3vw,20px);color:#fff';cc.textContent=n;b.appendChild(cc);});}
function checkBingo(){var marked=board.map(function(n){return drawnNums.indexOf(n)>=0;});for(var r=0;r<5;r++){var ok=true;for(var c=0;c<5;c++)if(!marked[r*5+c])ok=false;if(ok)return win();}for(var c=0;c<5;c++){var ok=true;for(var r=0;r<5;r++)if(!marked[r*5+c])ok=false;if(ok)return win();}var ok=true;for(var i=0;i<5;i++)if(!marked[i*5+i])ok=false;if(ok)return win();ok=true;for(var i=0;i<5;i++)if(!marked[i*5+4-i])ok=false;if(ok)return win();}
function win(){ov=true;document.getElementById('fin').textContent=rounds;document.getElementById('ov').classList.add('show');}
function rst(){init();}
window.rst=rst;init();
`, "bingo");
}

function slotMachine(): string {
  return wrap("Machine à Sous", `
<h1>🎰 <span>Machine à Sous</span></h1>
<div class="stats"><span>Jetons : <strong id="coins">1000</strong></span><span>Gains : <strong id="wins">0</strong></span></div>
<div id="slots" style="display:flex;gap:16px;margin:30px 0;padding:20px;background:#1a1a1a;border-radius:16px;border:4px solid #facc15"></div>
<div class="controls"><button ontouchstart="spin();event.preventDefault()" onclick="spin()" style="width:200px;background:#facc15;color:#000">TOURNER (10)</button></div>
<div class="overlay" id="ov"><h2>💀 Ruine</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var EMO=['🍒','🍋','🍇','🔔','💎','7️⃣'];
var coins,wins,ov,spinning;
function init(){coins=1000;wins=0;ov=false;spinning=false;document.getElementById('coins').textContent='1000';document.getElementById('wins').textContent='0';document.getElementById('ov').classList.remove('show');render(['❓','❓','❓']);}
function render(arr){var s=document.getElementById('slots');s.innerHTML='';arr.forEach(function(e){var d=document.createElement('div');d.style.cssText='width:100px;height:100px;background:#fff;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:60px';d.textContent=e;s.appendChild(d);});}
function spin(){if(ov||spinning||coins<10)return;coins-=10;document.getElementById('coins').textContent=coins;spinning=true;var count=0;var iv=setInterval(function(){render([EMO[Math.floor(Math.random()*EMO.length)],EMO[Math.floor(Math.random()*EMO.length)],EMO[Math.floor(Math.random()*EMO.length)]]);count++;if(count>10){clearInterval(iv);var final=[EMO[Math.floor(Math.random()*EMO.length)],EMO[Math.floor(Math.random()*EMO.length)],EMO[Math.floor(Math.random()*EMO.length)]];render(final);spinning=false;if(final[0]===final[1]&&final[1]===final[2]){var mult=final[0]==='7️⃣'?50:final[0]==='💎'?20:10;coins+=mult*10;wins+=mult*10;document.getElementById('coins').textContent=coins;document.getElementById('wins').textContent=wins;}else if(final[0]===final[1]||final[1]===final[2]||final[0]===final[2]){coins+=20;wins+=20;document.getElementById('coins').textContent=coins;document.getElementById('wins').textContent=wins;}if(coins<=0){ov=true;document.getElementById('ov').classList.add('show');}}},80);}
window.spin=spin;
function rst(){init();}
window.rst=rst;init();
`, "slot");
}

function diceRoll(): string {
  return wrap("Dés", `
<h1>🎲 <span>Bataille de Dés</span></h1>
<div class="stats"><span>Toi : <strong id="s1">0</strong></span><span>IA : <strong id="s2">0</strong></span></div>
<div id="arena" style="display:flex;gap:60px;margin:40px 0;align-items:center"></div>
<div class="controls"><button ontouchstart="roll();event.preventDefault()" onclick="roll()" style="width:200px;background:#22c55e;color:#fff">LANCER</button></div>
<div class="overlay" id="ov"><h2 id="ttl">Fin</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var EM=['⚀','⚁','⚂','⚃','⚄','⚅'];
var s1,s2,ov;
function init(){s1=0;s2=0;ov=false;document.getElementById('s1').textContent='0';document.getElementById('s2').textContent='0';document.getElementById('ov').classList.remove('show');render('❓','❓');}
function render(d1,d2){document.getElementById('arena').innerHTML='<div style="text-align:center"><p style="color:#22c55e;font-weight:900">TOI</p><div style="font-size:100px">'+d1+'</div></div><div style="font-size:60px;color:#facc15">VS</div><div style="text-align:center"><p style="color:#ef4444;font-weight:900">IA</p><div style="font-size:100px">'+d2+'</div></div>';}
function roll(){if(ov)return;var r1=Math.floor(Math.random()*6)+1;var r2=Math.floor(Math.random()*6)+1;if(r1>r2)s1++;else if(r2>r1)s2++;document.getElementById('s1').textContent=s1;document.getElementById('s2').textContent=s2;render(EM[r1-1],EM[r2-1]);if(s1>=5||s2>=5){ov=true;document.getElementById('ttl').textContent=s1>=5?'🏆 Gagné':'😢 Perdu';document.getElementById('ov').classList.add('show');}}
window.roll=roll;
function rst(){init();}
window.rst=rst;init();
`, "dice-roll");
}

function targetShoot(): string {
  return wrap("Tir à la Cible", `
<h1>🎯 <span>Tir à la Cible</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Temps : <strong id="time">30</strong>s</span></div>
<div id="bd" style="width:min(500px,90vw);height:400px;background:radial-gradient(circle, #facc15 0%, #ef4444 50%, #1a1a1a 100%);border-radius:16px;position:relative;cursor:crosshair;border:2px solid #facc15"></div>
<div class="overlay" id="ov"><h2>Terminé</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var sc,t,ov,timer;
function init(){sc=0;t=30;ov=false;document.getElementById('score').textContent='0';document.getElementById('time').textContent='30';document.getElementById('ov').classList.remove('show');if(timer)clearInterval(timer);timer=setInterval(function(){if(ov)return;t--;document.getElementById('time').textContent=t;if(t<=0){ov=true;document.getElementById('fin').textContent=sc;document.getElementById('ov').classList.add('show');}},1000);}
function click(e){e.preventDefault();if(ov)return;var bd=document.getElementById('bd');var r=bd.getBoundingClientRect();var mx,my;if(e.touches){mx=e.touches[0].clientX-r.left;my=e.touches[0].clientY-r.top;}else{mx=e.clientX-r.left;my=e.clientY-r.top;}var cx=r.width/2,cy=r.height/2;var dist=Math.hypot(mx-cx,my-cy);var maxD=r.width/2;if(dist<30)sc+=50;else if(dist<80)sc+=25;else if(dist<150)sc+=10;else sc+=5;document.getElementById('score').textContent=sc;var marker=document.createElement('div');marker.style.cssText='position:absolute;width:10px;height:10px;background:#fff;border-radius:50%;left:'+mx+'px;top:'+my+'px;pointer-events:none;transition:opacity .3s';bd.appendChild(marker);setTimeout(function(){marker.remove();},500);}
function rst(){init();}
window.rst=rst;
document.getElementById('bd').addEventListener('click',click);
document.getElementById('bd').addEventListener('touchstart',click,{passive:false});
init();
`, "target-shoot");
}

function escapeRoom(): string {
  return wrap("Escape Room", `
<h1>🔐 <span>Escape Room</span></h1>
<div class="stats"><span>Énigme : <strong id="n">1</strong>/5</span></div>
<div id="bd" style="background:#1a1a1a;padding:30px;border-radius:12px;border:2px solid #facc15;text-align:center;max-width:500px;min-width:340px"></div>
<div class="overlay" id="ov"><h2>🎉 Évadé !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var puzzles=[
{q:"4 chiffres. Le double de 12 :",a:"24"},
{q:"Combien de côtés dans un triangle ?",a:"3"},
{q:"Suite : 2, 4, 6, 8, ?",a:"10"},
{q:"Couleur du ciel par beau temps ? (fr)",a:"bleu"},
{q:"Mot de passe : mot inverse de CHAT",a:"TAHC"}
];
var idx,ov,score;
function init(){idx=0;ov=false;score=0;document.getElementById('n').textContent='1';document.getElementById('ov').classList.remove('show');render();}
function render(){document.getElementById('n').textContent=(idx+1)+'/'+puzzles.length;var p=puzzles[idx];var h='<p style="color:#fff;font-size:18px;margin-bottom:20px">'+p.q+'</p><input id="ans" type="text" placeholder="Réponse..." style="width:200px;padding:12px;font-size:18px;background:#0a0a0a;color:#fff;border:2px solid #facc15;border-radius:10px;outline:none;text-align:center" /><br><button ontouchstart="check();event.preventDefault()" onclick="check()" style="margin-top:16px;padding:12px 32px;background:#22c55e;color:#fff;border:none;border-radius:10px;font-weight:900;cursor:pointer;font-family:inherit">VALIDER</button>';document.getElementById('bd').innerHTML=h;setTimeout(function(){var i=document.getElementById('ans');if(i)i.focus();},100);}
function check(){if(ov)return;var v=(document.getElementById('ans').value||'').toUpperCase().trim();if(v===puzzles[idx].a.toUpperCase()){score++;idx++;if(idx>=puzzles.length){ov=true;document.getElementById('ov').classList.add('show');return;}render();}else{var inp=document.getElementById('ans');inp.style.borderColor='#ef4444';inp.value='';setTimeout(function(){inp.style.borderColor='#facc15';},400);}}
window.check=check;
document.addEventListener('keydown',function(e){if(e.key==='Enter')check();});
function rst(){init();}
window.rst=rst;init();
`, "escape-room");
}

function riddleGame(): string {
  return wrap("Énigmes", `
<h1>🧩 <span>Énigmes</span></h1>
<div class="stats"><span>Résolues : <strong id="score">0</strong>/8</span></div>
<div id="bd" style="background:#1a1a1a;padding:30px;border-radius:12px;border:2px solid #facc15;text-align:center;max-width:500px;min-width:340px"></div>
<div class="overlay" id="ov"><h2>🏆 Fini !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var RIDDLES=[
{q:"Plus j'en prends, plus j'en laisse. Qui suis-je ?",c:["Des pas","Des cheveux","Des sourires","Du sable"],a:0},
{q:"Je n'ai pas de poumons mais j'ai besoin d'air. Qui suis-je ?",c:["Le feu","L'eau","Le vent","La pierre"],a:0},
{q:"Je vole sans ailes, je pleure sans yeux. Qui suis-je ?",c:["Un nuage","Un oiseau","Un avion","Une feuille"],a:0},
{q:"Plus on me lave, plus je deviens sale. Qui suis-je ?",c:["L'eau","Le savon","Une éponge","Un miroir"],a:0},
{q:"Je peux être cassé sans jamais tomber. Qui suis-je ?",c:["Un silence","Un miroir","Une promesse","Un verre"],a:2},
{q:"Je suis toujours devant toi mais tu ne me vois jamais. Qui suis-je ?",c:["Le futur","L'ombre","Le temps","Le vent"],a:0},
{q:"Je suis petit, rond, blanc, et je pleure sans arrêt. Qui suis-je ?",c:["Un oignon","Un oiseau","Un nuage","Une larme"],a:0},
{q:"Combien de mois ont 28 jours ?",c:["1","12","4","2"],a:1}
];
var idx,sc,ov;
function init(){idx=0;sc=0;ov=false;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');render();}
function render(){if(idx>=RIDDLES.length){ov=true;document.getElementById('ov').classList.add('show');return;}var q=RIDDLES[idx];var h='<p style="color:#fff;font-size:17px;margin-bottom:20px">'+q.q+'</p><div style="display:flex;flex-direction:column;gap:10px">';q.c.forEach(function(c,i){h+='<button ontouchstart="pick('+i+');event.preventDefault()" onclick="pick('+i+')" style="padding:14px;background:#2a2a2a;color:#fff;border:2px solid #3a3a3a;border-radius:10px;cursor:pointer;font-family:inherit;font-weight:700;font-size:14px">'+c+'</button>';});h+='</div>';document.getElementById('bd').innerHTML=h;}
function pick(i){if(ov)return;if(i===RIDDLES[idx].a){sc++;document.getElementById('score').textContent=sc;}idx++;render();}
window.pick=pick;
function rst(){init();}
window.rst=rst;init();
`, "riddles");
}

function simonSound(): string {
  return wrap("Simon Sonore", `
<h1>🔊 <span>Simon Sonore</span></h1>
<div class="stats"><span>Niveau : <strong id="lvl">1</strong></span></div>
<div id="bd" style="display:grid;grid-template-columns:repeat(2,min(120px,35vw));grid-template-rows:repeat(2,min(120px,35vw));gap:12px"></div>
<div class="overlay" id="ov"><h2>Perdu</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var NOTES=[262,330,392,523];
var seq,input,lock,lvl,ov,ctx=null;
function init(){seq=[];input=[];lock=true;lvl=0;ov=false;document.getElementById('ov').classList.remove('show');render();setTimeout(next,500);}
function render(){var b=document.getElementById('bd');b.innerHTML='';var cs=['#ef4444','#3b82f6','#22c55e','#facc15'];cs.forEach(function(c,i){var d=document.createElement('div');d.dataset.idx=i;d.style.cssText='background:'+c+';border-radius:20px;cursor:pointer;opacity:.4;transition:opacity .2s';d.onclick=function(){press(i);};b.appendChild(d);});}
function play(f,d){if(!ctx)ctx=new (window.AudioContext||window.webkitAudioContext)();var o=ctx.createOscillator();var g=ctx.createGain();o.connect(g);g.connect(ctx.destination);o.frequency.value=f;o.type='sine';g.gain.setValueAtTime(0.3,ctx.currentTime);g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+d/1000);o.start();o.stop(ctx.currentTime+d/1000);}
function light(i,t){var d=document.querySelector('[data-idx="'+i+'"]');if(!d)return;d.style.opacity='1';play(NOTES[i],t||300);setTimeout(function(){d.style.opacity='.4';},t||300);}
function next(){lvl++;document.getElementById('lvl').textContent=lvl;seq.push(Math.floor(Math.random()*4));input=[];lock=true;var i=0;var iv=setInterval(function(){if(i>=seq.length){clearInterval(iv);lock=false;return;}light(seq[i],400);i++;},700);}
function press(i){if(lock)return;light(i,200);input.push(i);if(input[input.length-1]!==seq[input.length-1]){ov=true;document.getElementById('ov').classList.add('show');return;}if(input.length===seq.length){lock=true;setTimeout(next,700);}}
function rst(){init();}
window.rst=rst;init();
`, "simon-sound");
}

function reactionColors(): string {
  return wrap("Réaction Couleurs", `
<h1>🎨 <span>Réaction</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Meilleur : <strong id="best">-</strong> ms</span></div>
<div id="bd" style="width:min(500px,90vw);height:400px;border-radius:16px;display:flex;align-items:center;justify-content:center;cursor:pointer;user-select:none;transition:background .2s"></div>
<div class="overlay" id="ov"><h2>Perdu</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var state,start,score,best,ov;
try{best=parseInt(localStorage.getItem('rc_b')||'0');if(best>0)document.getElementById('best').textContent=best;}catch(e){best=0;}
function init(){state='idle';score=0;ov=false;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');render();}
function render(){var b=document.getElementById('bd');if(state==='idle'){b.style.background='#1a1a1a';b.innerHTML='<p style="color:#fff;font-size:22px">Clique pour commencer</p>';}else if(state==='wait'){b.style.background='#7f1d1d';b.innerHTML='<p style="color:#fff;font-size:22px">Attends le VERT...</p>';}else{b.style.background='#15803d';b.innerHTML='<p style="color:#fff;font-size:28px;font-weight:900">CLIQUE !</p>';}}
function click(){if(ov)return;if(state==='idle'){state='wait';render();var delay=1000+Math.random()*3000;setTimeout(function(){if(state!=='wait')return;state='ready';start=Date.now();render();},delay);}else if(state==='wait'){state='idle';render();}else if(state==='ready'){var t=Date.now()-start;score+=Math.max(0,1000-t)/10;if(t<best||best===0){best=t;try{localStorage.setItem('rc_b',t);}catch(e){}document.getElementById('best').textContent=best;}document.getElementById('score').textContent=Math.floor(score);state='idle';render();}}
function rst(){init();}
window.rst=rst;
document.getElementById('bd').addEventListener('click',click);
document.getElementById('bd').addEventListener('touchstart',function(e){e.preventDefault();click();},{passive:false});
init();
`, "reaction-colors");
}

function memoryIcons(): string {
  return wrap("Memory Icônes", `
<h1>🎴 <span>Memory Icônes</span></h1>
<div class="stats"><span>Coups : <strong id="mv">0</strong></span><span>Paires : <strong id="p">0/6</strong></span></div>
<div id="bd" style="display:grid;grid-template-columns:repeat(4,min(80px,20vw));gap:8px;background:#1a1a1a;padding:12px;border-radius:12px;border:2px solid #facc15"></div>
<div class="overlay" id="ov"><h2>🎉 Bravo !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var ICO=['⚔️','🛡️','🏹','🪓','🔮','👑'],f,s,lock,mv,mat,cds;
function init(){cds=ICO.concat(ICO).sort(function(){return Math.random()-0.5;});f=null;s=null;lock=false;mv=0;mat=0;document.getElementById('mv').textContent='0';document.getElementById('p').textContent='0/6';document.getElementById('ov').classList.remove('show');render();}
function render(){var b=document.getElementById('bd');b.innerHTML='';cds.forEach(function(e,i){var cc=document.createElement('div');cc.style.cssText='width:100%;aspect-ratio:1;background:#2a2a2a;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:clamp(20px,5vw,36px);cursor:pointer';cc.textContent='?';cc.dataset.idx=i;cc.dataset.em=e;cc.onclick=function(){flip(i,cc);};b.appendChild(cc);});}
function flip(i,cc){if(lock||cc.dataset.m==='1'||cc.textContent!=='?')return;cc.textContent=cc.dataset.em;cc.style.background='#facc15';if(f===null){f=i;return;}if(s===null){s=i;lock=true;mv++;document.getElementById('mv').textContent=mv;var c1=document.querySelector('[data-idx="'+f+'"]'),c2=cc;if(c1.dataset.em===c2.dataset.em){c1.dataset.m='1';c2.dataset.m='1';c1.style.background='#22c55e';c2.style.background='#22c55e';mat++;document.getElementById('p').textContent=mat+'/6';f=null;s=null;lock=false;if(mat===6)setTimeout(function(){document.getElementById('ov').classList.add('show');},400);}else{setTimeout(function(){c1.textContent='?';c1.style.background='#2a2a2a';c2.textContent='?';c2.style.background='#2a2a2a';f=null;s=null;lock=false;},800);}}}
function rst(){init();}
window.rst=rst;init();
`, "memory-icons");
}

function findDiff(): string {
  return wrap("Trouve les Différences", `
<h1>🔍 <span>Différences</span></h1>
<div class="stats"><span>Trouvées : <strong id="found">0</strong>/5</span></div>
<div id="bd" style="display:flex;gap:20px;flex-wrap:wrap;justify-content:center"></div>
<div class="overlay" id="ov"><h2>🎉 Bravo !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var grid1,grid2,diffs,found,ov;
var EMO=['🍎','🍌','🍇','🍓','🍊','🥝','🍒','🍑','🥭'];
function init(){grid1=[];grid2=[];diffs=[];found=0;ov=false;for(var i=0;i<12;i++){var e=EMO[Math.floor(Math.random()*EMO.length)];grid1.push(e);grid2.push(e);}for(var i=0;i<5;i++){var idx;do{idx=Math.floor(Math.random()*12);}while(diffs.indexOf(idx)>=0);diffs.push(idx);grid2[idx]=EMO[Math.floor(Math.random()*EMO.length)];while(grid2[idx]===grid1[idx]){grid2[idx]=EMO[Math.floor(Math.random()*EMO.length)];}}document.getElementById('found').textContent='0';document.getElementById('ov').classList.remove('show');render();}
function render(){var b=document.getElementById('bd');b.innerHTML='';var left=document.createElement('div');left.style.cssText='display:grid;grid-template-columns:repeat(4,min(50px,12vw));gap:6px;padding:12px;background:#1a1a1a;border-radius:12px';grid1.forEach(function(e){var d=document.createElement('div');d.style.cssText='aspect-ratio:1;background:#2a2a2a;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:24px';d.textContent=e;left.appendChild(d);});var right=document.createElement('div');right.style.cssText='display:grid;grid-template-columns:repeat(4,min(50px,12vw));gap:6px;padding:12px;background:#1a1a1a;border-radius:12px';grid2.forEach(function(e,i){var d=document.createElement('div');d.style.cssText='aspect-ratio:1;background:#2a2a2a;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:24px;cursor:pointer';d.textContent=e;d.onclick=function(){click(i,d);};right.appendChild(d);});b.appendChild(left);b.appendChild(right);}
function click(i,d){if(ov)return;if(diffs.indexOf(i)>=0&&!d.dataset.done){d.dataset.done='1';d.style.background='#22c55e';found++;document.getElementById('found').textContent=found;if(found===5){ov=true;setTimeout(function(){document.getElementById('ov').classList.add('show');},400);}}}
function rst(){init();}
window.rst=rst;init();
`, "find-diff");
}

function simon6(): string {
  return wrap("Simon 6", `
<h1>🎨 <span>Simon 6</span></h1>
<div class="stats"><span>Niveau : <strong id="lvl">1</strong></span></div>
<div id="bd" style="display:grid;grid-template-columns:repeat(3,min(80px,22vw));grid-template-rows:repeat(2,min(80px,22vw));gap:10px"></div>
<div class="overlay" id="ov"><h2>Perdu</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var COLS=['#ef4444','#3b82f6','#22c55e','#facc15','#a855f7','#f97316'];
var seq,input,lock,lvl,ov;
function init(){seq=[];input=[];lock=true;lvl=0;ov=false;document.getElementById('ov').classList.remove('show');render();setTimeout(next,500);}
function render(){var b=document.getElementById('bd');b.innerHTML='';COLS.forEach(function(c,i){var d=document.createElement('div');d.dataset.idx=i;d.style.cssText='background:'+c+';border-radius:20px;cursor:pointer;opacity:.4;transition:opacity .2s';d.onclick=function(){press(i);};b.appendChild(d);});}
function light(i,t){var d=document.querySelector('[data-idx="'+i+'"]');if(!d)return;d.style.opacity='1';setTimeout(function(){d.style.opacity='.4';},t||300);}
function next(){lvl++;document.getElementById('lvl').textContent=lvl;seq.push(Math.floor(Math.random()*6));input=[];lock=true;var i=0;var iv=setInterval(function(){if(i>=seq.length){clearInterval(iv);lock=false;return;}light(seq[i],400);i++;},700);}
function press(i){if(lock)return;light(i,200);input.push(i);if(input[input.length-1]!==seq[input.length-1]){ov=true;document.getElementById('ov').classList.add('show');return;}if(input.length===seq.length){lock=true;setTimeout(next,700);}}
function rst(){init();}
window.rst=rst;init();
`, "simon6");
}

function simonFast(): string {
  return wrap("Simon Rapide", `
<h1>⚡ <span>Simon Rapide</span></h1>
<div class="stats"><span>Niveau : <strong id="lvl">1</strong></span></div>
<div id="bd" style="display:grid;grid-template-columns:repeat(2,min(120px,35vw));grid-template-rows:repeat(2,min(120px,35vw));gap:12px"></div>
<div class="overlay" id="ov"><h2>Perdu</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var COLS=['#ef4444','#3b82f6','#22c55e','#facc15'];
var seq,input,lock,lvl,ov;
function init(){seq=[];input=[];lock=true;lvl=0;ov=false;document.getElementById('ov').classList.remove('show');render();setTimeout(next,500);}
function render(){var b=document.getElementById('bd');b.innerHTML='';COLS.forEach(function(c,i){var d=document.createElement('div');d.dataset.idx=i;d.style.cssText='background:'+c+';border-radius:20px;cursor:pointer;opacity:.4;transition:opacity .15s';d.onclick=function(){press(i);};b.appendChild(d);});}
function light(i,t){var d=document.querySelector('[data-idx="'+i+'"]');if(!d)return;d.style.opacity='1';setTimeout(function(){d.style.opacity='.4';},t||200);}
function next(){lvl++;document.getElementById('lvl').textContent=lvl;seq.push(Math.floor(Math.random()*4));input=[];lock=true;var speed=Math.max(150,500-lvl*30);var i=0;var iv=setInterval(function(){if(i>=seq.length){clearInterval(iv);lock=false;return;}light(seq[i],speed);i++;},speed+200);}
function press(i){if(lock)return;light(i,150);input.push(i);if(input[input.length-1]!==seq[input.length-1]){ov=true;document.getElementById('ov').classList.add('show');return;}if(input.length===seq.length){lock=true;setTimeout(next,500);}}
function rst(){init();}
window.rst=rst;init();
`, "simon-fast");
}

function memoryFast(): string {
  return wrap("Memory Rapide", `
<h1>⚡ <span>Memory Rapide</span></h1>
<div class="stats"><span>Coups : <strong id="mv">0</strong></span><span>Temps : <strong id="t">0</strong>s</span></div>
<div id="bd" style="display:grid;grid-template-columns:repeat(4,min(80px,20vw));gap:8px;background:#1a1a1a;padding:12px;border-radius:12px;border:2px solid #facc15"></div>
<div class="overlay" id="ov"><h2 id="ttl">Fini</h2><p>Temps : <strong id="fin">0</strong>s</p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var ICO=['🚀','⚡','🔥','💧','🌟','🌙'],f,s,lock,mv,mat,cds,t0,timer,ov;
function init(){cds=ICO.concat(ICO).sort(function(){return Math.random()-0.5;});f=null;s=null;lock=false;mv=0;mat=0;ov=false;t0=Date.now();document.getElementById('mv').textContent='0';document.getElementById('t').textContent='0';document.getElementById('ov').classList.remove('show');if(timer)clearInterval(timer);timer=setInterval(function(){if(ov)return;document.getElementById('t').textContent=Math.floor((Date.now()-t0)/1000);},100);render();}
function render(){var b=document.getElementById('bd');b.innerHTML='';cds.forEach(function(e,i){var cc=document.createElement('div');cc.style.cssText='width:100%;aspect-ratio:1;background:#2a2a2a;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:clamp(20px,5vw,32px);cursor:pointer';cc.textContent='?';cc.dataset.idx=i;cc.dataset.em=e;cc.onclick=function(){flip(i,cc);};b.appendChild(cc);});}
function flip(i,cc){if(lock||cc.dataset.m==='1'||cc.textContent!=='?')return;cc.textContent=cc.dataset.em;cc.style.background='#facc15';if(f===null){f=i;return;}if(s===null){s=i;lock=true;mv++;document.getElementById('mv').textContent=mv;var c1=document.querySelector('[data-idx="'+f+'"]'),c2=cc;if(c1.dataset.em===c2.dataset.em){c1.dataset.m='1';c2.dataset.m='1';c1.style.background='#22c55e';c2.style.background='#22c55e';mat++;f=null;s=null;lock=false;if(mat===6){ov=true;clearInterval(timer);document.getElementById('fin').textContent=Math.floor((Date.now()-t0)/1000);document.getElementById('ttl').textContent='🎉 Bravo !';setTimeout(function(){document.getElementById('ov').classList.add('show');},400);}}else{setTimeout(function(){c1.textContent='?';c1.style.background='#2a2a2a';c2.textContent='?';c2.style.background='#2a2a2a';f=null;s=null;lock=false;},800);}}}
function rst(){init();}
window.rst=rst;init();
`, "memory-fast");
}

function memoryIcons2(): string {
  return wrap("Memory Animals", `
<h1>🐾 <span>Memory Animals</span></h1>
<div class="stats"><span>Coups : <strong id="mv">0</strong></span><span>Paires : <strong id="p">0/8</strong></span></div>
<div id="bd" style="display:grid;grid-template-columns:repeat(4,min(70px,18vw));gap:8px;background:#1a1a1a;padding:12px;border-radius:12px;border:2px solid #facc15"></div>
<div class="overlay" id="ov"><h2>🎉 Bravo !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var ICO=['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼'],f,s,lock,mv,mat,cds;
function init(){cds=ICO.concat(ICO).sort(function(){return Math.random()-0.5;});f=null;s=null;lock=false;mv=0;mat=0;document.getElementById('mv').textContent='0';document.getElementById('p').textContent='0/8';document.getElementById('ov').classList.remove('show');render();}
function render(){var b=document.getElementById('bd');b.innerHTML='';cds.forEach(function(e,i){var cc=document.createElement('div');cc.style.cssText='width:100%;aspect-ratio:1;background:#2a2a2a;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:clamp(18px,4vw,30px);cursor:pointer';cc.textContent='?';cc.dataset.idx=i;cc.dataset.em=e;cc.onclick=function(){flip(i,cc);};b.appendChild(cc);});}
function flip(i,cc){if(lock||cc.dataset.m==='1'||cc.textContent!=='?')return;cc.textContent=cc.dataset.em;cc.style.background='#facc15';if(f===null){f=i;return;}if(s===null){s=i;lock=true;mv++;document.getElementById('mv').textContent=mv;var c1=document.querySelector('[data-idx="'+f+'"]'),c2=cc;if(c1.dataset.em===c2.dataset.em){c1.dataset.m='1';c2.dataset.m='1';c1.style.background='#22c55e';c2.style.background='#22c55e';mat++;document.getElementById('p').textContent=mat+'/8';f=null;s=null;lock=false;if(mat===8)setTimeout(function(){document.getElementById('ov').classList.add('show');},400);}else{setTimeout(function(){c1.textContent='?';c1.style.background='#2a2a2a';c2.textContent='?';c2.style.background='#2a2a2a';f=null;s=null;lock=false;},800);}}}
function rst(){init();}
window.rst=rst;init();
`, "memory-animals2");
}

function typingFast(): string {
  return wrap("Dactylo Rapide", `
<h1>⌨️ <span>Dactylo</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Temps : <strong id="time">30</strong>s</span></div>
<div id="word" style="font-size:48px;font-weight:900;color:#facc15;margin:30px;letter-spacing:8px;text-align:center">MOT</div>
<div style="margin-top:20px"><input id="input" type="text" autofocus placeholder="Tape..." style="width:300px;padding:14px;font-size:20px;background:#1a1a1a;color:#fff;border:2px solid #facc15;border-radius:12px;outline:none;text-align:center" /></div>
<div class="overlay" id="ov"><h2>Terminé</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var WORDS=['MAISON','ARBRE','SOLEIL','LIVRE','VOITURE','FLEUR','MUSIQUE','JARDIN','PORTE','TABLE','CHAT','CHIEN','POMME','ROUGE','VERT','BLEU','BONJOUR','MERCI','FENETRE','PLAGE'];
var sc,t,ov,timer,cur;
function init(){sc=0;t=30;ov=false;document.getElementById('score').textContent='0';document.getElementById('time').textContent='30';document.getElementById('ov').classList.remove('show');document.getElementById('input').value='';nextWord();if(timer)clearInterval(timer);timer=setInterval(function(){if(ov)return;t--;document.getElementById('time').textContent=t;if(t<=0){ov=true;document.getElementById('fin').textContent=sc;document.getElementById('ov').classList.add('show');}},1000);}
function nextWord(){cur=WORDS[Math.floor(Math.random()*WORDS.length)];document.getElementById('word').textContent=cur;}
function check(){if(ov)return;var v=(document.getElementById('input').value||'').toUpperCase();if(v===cur){sc+=cur.length*10;document.getElementById('score').textContent=sc;document.getElementById('input').value='';nextWord();}}
document.getElementById('input').addEventListener('input',check);
function rst(){init();}
window.rst=rst;init();
`, "typing-fast");
}
// ═══════════════════════════════════════════════════════════════
// PAQUET 11 : 30 JEUX
// ═══════════════════════════════════════════════════════════════

function crystal(): string {
  return wrap("Crystal", `
<h1>💎 <span>Crystal</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Temps : <strong id="time">60</strong>s</span></div>
<div id="bd" style="display:grid;grid-template-columns:repeat(6,min(60px,14vw));gap:6px;background:#1a1a1a;padding:12px;border-radius:12px;border:2px solid #a855f7"></div>
<div class="overlay" id="ov"><h2>Terminé</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var EMO=['💎','🔮','⭐','🌟','✨','💠'],grid,sel,sc,t,ov,timer;
function init(){grid=[];for(var y=0;y<6;y++){grid[y]=[];for(var x=0;x<6;x++)grid[y][x]=Math.floor(Math.random()*6);}sel=null;sc=0;t=60;ov=false;document.getElementById('score').textContent='0';document.getElementById('time').textContent='60';document.getElementById('ov').classList.remove('show');if(timer)clearInterval(timer);timer=setInterval(function(){if(ov)return;t--;document.getElementById('time').textContent=t;if(t<=0){ov=true;document.getElementById('fin').textContent=sc;document.getElementById('ov').classList.add('show');}},1000);render();}
function render(){var b=document.getElementById('bd');b.innerHTML='';grid.forEach(function(row,y){row.forEach(function(v,x){var cc=document.createElement('div');var bg=sel&&sel.y===y&&sel.x===x?'#a855f7':'#2a2a2a';cc.style.cssText='aspect-ratio:1;background:'+bg+';border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:clamp(20px,5vw,32px);cursor:pointer;transition:transform .15s';cc.textContent=EMO[v];cc.onclick=function(){pick(y,x);};b.appendChild(cc);});});}
function pick(y,x){if(sel===null){sel={y:y,x:x};render();return;}if(sel.y===y&&sel.x===x){sel=null;render();return;}var dy=Math.abs(sel.y-y),dx=Math.abs(sel.x-x);if(dy+dx!==1){sel={y:y,x:x};render();return;}var tmp=grid[y][x];grid[y][x]=grid[sel.y][sel.x];grid[sel.y][sel.x]=tmp;check();sel=null;render();}
function check(){for(var y=0;y<6;y++)for(var x=0;x<4;x++){if(grid[y][x]===grid[y][x+1]&&grid[y][x]===grid[y][x+2]){sc+=30;document.getElementById('score').textContent=sc;var col=grid[y][x];grid[y][x]=Math.floor(Math.random()*6);grid[y][x+1]=Math.floor(Math.random()*6);grid[y][x+2]=Math.floor(Math.random()*6);}}for(var x=0;x<6;x++)for(var y=0;y<4;y++){if(grid[y][x]===grid[y+1][x]&&grid[y][x]===grid[y+2][x]){sc+=30;document.getElementById('score').textContent=sc;grid[y][x]=Math.floor(Math.random()*6);grid[y+1][x]=Math.floor(Math.random()*6);grid[y+2][x]=Math.floor(Math.random()*6);}}}
function rst(){init();}
window.rst=rst;init();
`, "crystal");
}

function blocs(): string {
  return wrap("Blocs", `
<h1>🧊 <span>Blocs</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="400" height="600"></canvas>
<div class="controls"><button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button><button ontouchstart="rot();event.preventDefault()" onclick="rot()">↻</button><button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button><button ontouchstart="drop();event.preventDefault()" onclick="drop()">↓</button></div>
<div class="overlay" id="ov"><h2>Game Over</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),COLS=10,ROWS=20,B=c.width/COLS;
var board,piece,px,py,sc,ov,loop;
var SHAPES=[[[1,1,1]],[[1,1],[1,1]],[[1],[1],[1]],[[0,1,0],[1,1,1]],[[1,0],[1,1]]];
var COLORS=['#06b6d4','#facc15','#a855f7','#3b82f6','#22c55e'];
function init(){board=[];for(var i=0;i<ROWS;i++){board[i]=[];for(var j=0;j<COLS;j++)board[i][j]=0;}sc=0;ov=false;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');newP();}
function newP(){var i=Math.floor(Math.random()*SHAPES.length);piece={shape:SHAPES[i].map(function(r){return r.slice();}),color:COLORS[i]};px=Math.floor((COLS-piece.shape[0].length)/2);py=0;if(coll())end();}
function coll(){for(var y=0;y<piece.shape.length;y++)for(var x=0;x<piece.shape[y].length;x++){if(piece.shape[y][x]){var nx=px+x,ny=py+y;if(nx<0||nx>=COLS||ny>=ROWS)return true;if(ny>=0&&board[ny][nx])return true;}}return false;}
function merge(){for(var y=0;y<piece.shape.length;y++)for(var x=0;x<piece.shape[y].length;x++)if(piece.shape[y][x])board[py+y][px+x]=piece.color;}
function clr(){for(var y=ROWS-1;y>=0;y--){if(board[y].every(function(c){return c;})){board.splice(y,1);board.unshift([]);for(var j=0;j<COLS;j++)board[0][j]=0;sc+=100;document.getElementById('score').textContent=sc;y++;}}}
function mv(d){if(ov)return;px+=d;if(coll())px-=d;draw();}
function rot(){if(ov)return;var r=piece.shape[0].map(function(_,i){return piece.shape.map(function(row){return row[i];}).reverse();});var old=piece.shape;piece.shape=r;if(coll())piece.shape=old;draw();}
function drop(){if(ov)return;py++;if(coll()){py--;merge();clr();newP();}draw();}
window.mv=mv;window.rot=rot;window.drop=drop;
function draw(){x.fillStyle='#000';x.fillRect(0,0,c.width,c.height);for(var y=0;y<ROWS;y++)for(var xx=0;xx<COLS;xx++){if(board[y][xx]){x.fillStyle=board[y][xx];x.fillRect(xx*B+1,y*B+1,B-2,B-2);}}if(piece){for(var y=0;y<piece.shape.length;y++)for(var xx=0;xx<piece.shape[y].length;xx++){if(piece.shape[y][xx]){x.fillStyle=piece.color;x.fillRect((px+xx)*B+1,(py+y)*B+1,B-2,B-2);}}}}
function tick(){if(!ov){py++;if(coll()){py--;merge();clr();newP();}draw();}}
function end(){ov=true;document.getElementById('ov').classList.add('show');}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,600);draw();}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')mv(-1);if(e.key==='ArrowRight')mv(1);if(e.key==='ArrowUp')rot();if(e.key==='ArrowDown')drop();});
rst();
`, "blocs");
}

function simonPro(): string {
  return wrap("Simon Pro", `
<h1>🎼 <span>Simon Pro</span></h1>
<div class="stats"><span>Niveau : <strong id="lvl">1</strong></span></div>
<div id="bd" style="display:grid;grid-template-columns:repeat(3,min(90px,25vw));grid-template-rows:repeat(3,min(90px,25vw));gap:10px"></div>
<div class="overlay" id="ov"><h2>Perdu</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var COLS=['#ef4444','#3b82f6','#22c55e','#facc15','#a855f7','#f97316','#06b6d4','#ec4899','#84cc16'];
var seq,input,lock,lvl,ov;
function init(){seq=[];input=[];lock=true;lvl=0;ov=false;document.getElementById('ov').classList.remove('show');render();setTimeout(next,500);}
function render(){var b=document.getElementById('bd');b.innerHTML='';COLS.forEach(function(c,i){var d=document.createElement('div');d.dataset.idx=i;d.style.cssText='background:'+c+';border-radius:14px;cursor:pointer;opacity:.4;transition:opacity .2s';d.onclick=function(){press(i);};b.appendChild(d);});}
function light(i,t){var d=document.querySelector('[data-idx="'+i+'"]');if(!d)return;d.style.opacity='1';setTimeout(function(){d.style.opacity='.4';},t||300);}
function next(){lvl++;document.getElementById('lvl').textContent=lvl;seq.push(Math.floor(Math.random()*9));input=[];lock=true;var i=0;var iv=setInterval(function(){if(i>=seq.length){clearInterval(iv);lock=false;return;}light(seq[i],400);i++;},700);}
function press(i){if(lock)return;light(i,200);input.push(i);if(input[input.length-1]!==seq[input.length-1]){ov=true;document.getElementById('ov').classList.add('show');return;}if(input.length===seq.length){lock=true;setTimeout(next,700);}}
function rst(){init();}
window.rst=rst;init();
`, "simon-pro");
}

function quadruple(): string {
  return wrap("Puissance+", `
<h1>🔴 <span>Puissance+</span></h1>
<div class="stats"><span id="turn">À toi !</span></div>
<div id="bd" style="display:grid;grid-template-columns:repeat(8,min(45px,10vw));gap:4px;background:#1a1a1a;padding:12px;border-radius:12px"></div>
<div class="overlay" id="ov"><h2 id="ttl">Gagné !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var ROWS=7,COLS=8,grid,ov,wait;
function init(){grid=[];for(var y=0;y<ROWS;y++){grid[y]=[];for(var x=0;x<COLS;x++)grid[y][x]=0;}ov=false;wait=false;document.getElementById('turn').textContent='À toi !';document.getElementById('ov').classList.remove('show');render();}
function render(){var b=document.getElementById('bd');b.innerHTML='';for(var y=0;y<ROWS;y++)for(var x=0;x<COLS;x++){var cc=document.createElement('div');var bg=grid[y][x]===1?'#ef4444':grid[y][x]===2?'#facc15':'#2a2a2a';cc.style.cssText='aspect-ratio:1;background:'+bg+';border-radius:50%;cursor:pointer;transition:background .2s';cc.onclick=function(xx){return function(){drop(xx);};}(x);b.appendChild(cc);}}
function drop(x){if(ov||wait)return;for(var y=ROWS-1;y>=0;y--){if(grid[y][x]===0){grid[y][x]=1;break;}}render();if(chk(1))return end('🎉 Gagné !');if(full())return end('Nul');wait=true;document.getElementById('turn').textContent='IA...';setTimeout(ai,400);}
function ai(){var bx=-1,bm=999;for(var x=0;x<COLS;x++){for(var y=ROWS-1;y>=0;y--){if(grid[y][x]===0){var m=evalMove(y,x,2);if(m<bm){bm=m;bx=x;}break;}}}if(bx>=0)for(var y=ROWS-1;y>=0;y--){if(grid[y][bx]===0){grid[y][bx]=2;break;}}render();if(chk(2))return end('😢 IA gagne');if(full())return end('Nul');wait=false;document.getElementById('turn').textContent='À toi !';}
function evalMove(y,x,p){var s=0;var dirs=[[0,1],[1,0],[1,1],[1,-1]];dirs.forEach(function(d){var c=1;for(var i=1;i<=3;i++){var ny=y+d[0]*i,nx=x+d[1]*i;if(ny<0||ny>=ROWS||nx<0||nx>=COLS||grid[ny][nx]!==p)break;c++;}for(var i=1;i<=3;i++){var ny=y-d[0]*i,nx=x-d[1]*i;if(ny<0||ny>=ROWS||nx<0||nx>=COLS||grid[ny][nx]!==p)break;c++;}if(c>=4)s+=100;else if(c===3)s+=20;});return s+Math.random();}
function chk(p){for(var y=0;y<ROWS;y++)for(var x=0;x<COLS;x++){if(grid[y][x]!==p)continue;if(x<=COLS-4&&grid[y][x+1]===p&&grid[y][x+2]===p&&grid[y][x+3]===p)return true;if(y<=ROWS-4&&grid[y+1][x]===p&&grid[y+2][x]===p&&grid[y+3][x]===p)return true;if(x<=COLS-4&&y<=ROWS-4&&grid[y+1][x+1]===p&&grid[y+2][x+2]===p&&grid[y+3][x+3]===p)return true;if(x>=3&&y<=ROWS-4&&grid[y+1][x-1]===p&&grid[y+2][x-2]===p&&grid[y+3][x-3]===p)return true;}return false;}
function full(){for(var y=0;y<ROWS;y++)for(var x=0;x<COLS;x++)if(grid[y][x]===0)return false;return true;}
function end(m){ov=true;document.getElementById('ttl').textContent=m;document.getElementById('ov').classList.add('show');}
function rst(){init();}
window.rst=rst;init();
`, "quadruple");
}

function motsCroises(): string {
  return wrap("Mots Croisés", `
<h1>🔤 <span>Mots Croisés</span></h1>
<div id="bd" style="display:grid;grid-template-columns:repeat(5,min(60px,14vw));gap:4px;background:#1a1a1a;padding:12px;border-radius:12px"></div>
<div class="controls" style="margin-top:16px"><button ontouchstart="rst();event.preventDefault()" onclick="rst()" style="width:160px;background:#22c55e;color:#fff">Nouveau</button></div>
<div class="overlay" id="ov"><h2>🎉 Bravo !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var WORDS=['CHAT','CHIEN','ARBRE','MAISON','SOLEIL'];
var grid,sel,ov;
function init(){grid=[];for(var y=0;y<5;y++){grid[y]=[];for(var x=0;x<5;x++)grid[y][x]='';}WORDS.forEach(function(w,i){for(var j=0;j<w.length&&j<5;j++)grid[i][j]=w[j];});ov=false;sel=null;document.getElementById('ov').classList.remove('show');render();}
function render(){var b=document.getElementById('bd');b.innerHTML='';for(var y=0;y<5;y++)for(var x=0;x<5;x++){var cc=document.createElement('div');var v=grid[y][x];var bg=sel&&sel.y===y&&sel.x===x?'#facc15':v?'#2a2a2a':'#1a1a1a';cc.style.cssText='aspect-ratio:1;background:'+bg+';border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:clamp(18px,4vw,26px);cursor:pointer;color:#fff';cc.textContent=v;cc.onclick=function(yy,xx){return function(){pick(yy,xx);};}(y,x);b.appendChild(cc);}}
function pick(y,x){if(grid[y][x])return;sel={y:y,x:x};render();}
document.addEventListener('keydown',function(e){if(!sel)return;var k=e.key.toUpperCase();if(k.length===1&&k>='A'&&k<='Z'){grid[sel.y][sel.x]=k;sel=null;render();}});
function rst(){init();}
window.rst=rst;init();
`, "mots-croises");
}

function hangmanFr(): string {
  return wrap("Pendu Français", `
<h1>📝 <span>Pendu FR</span></h1>
<div class="stats"><span>Vies : <strong id="lives">6</strong></span><span>Mot : <strong id="word">_ _ _ _</strong></span></div>
<div id="az" style="display:grid;grid-template-columns:repeat(9,min(40px,9vw));gap:6px;max-width:500px;margin-top:16px"></div>
<div class="overlay" id="ov"><h2 id="ttl">Gagné !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var WORDS=['CHAT','MAISON','ARBRE','SOLEIL','LIVRE','VOITURE','FLEUR','TABLE','POMME','JARDIN'];
var word,found,lives,ov;
function init(){word=WORDS[Math.floor(Math.random()*WORDS.length)];found=[];lives=6;ov=false;document.getElementById('lives').textContent='6';document.getElementById('ov').classList.remove('show');render();}
function render(){var w=word.split('').map(function(l){return found.indexOf(l)>=0?l:'_';}).join(' ');document.getElementById('word').textContent=w;var az=document.getElementById('az');az.innerHTML='';for(var i=0;i<26;i++){var l=String.fromCharCode(65+i);var b=document.createElement('button');var used=found.indexOf(l)>=0;b.style.cssText='width:100%;aspect-ratio:1;background:'+(used?'#666':'#facc15')+';color:'+(used?'#fff':'#000')+';border:none;border-radius:8px;font-weight:900;font-size:14px;cursor:pointer';b.textContent=l;if(used)b.disabled=true;b.onclick=function(ll){return function(){try_(ll);};}(l);az.appendChild(b);}}
function try_(l){if(ov||found.indexOf(l)>=0)return;found.push(l);if(word.indexOf(l)<0){lives--;document.getElementById('lives').textContent=lives;if(lives<=0){ov=true;document.getElementById('ttl').textContent='😢 '+word;document.getElementById('ov').classList.add('show');return;}}render();if(word.split('').every(function(c){return found.indexOf(c)>=0;})){ov=true;document.getElementById('ttl').textContent='🎉 Gagné !';document.getElementById('ov').classList.add('show');}}
function rst(){init();}
window.rst=rst;init();
`, "hangman-fr");
}

function simonBig(): string {
  return wrap("Simon Big", `
<h1>🎨 <span>Simon Big</span></h1>
<div class="stats"><span>Niveau : <strong id="lvl">1</strong></span></div>
<div id="bd" style="display:grid;grid-template-columns:repeat(4,min(70px,18vw));grid-template-rows:repeat(4,min(70px,18vw));gap:8px"></div>
<div class="overlay" id="ov"><h2>Perdu</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var COLS=['#ef4444','#3b82f6','#22c55e','#facc15','#a855f7','#f97316','#06b6d4','#ec4899','#84cc16','#eab308','#14b8a6','#8b5cf6','#f43f5e','#0891b2','#fbbf24','#10b981'];
var seq,input,lock,lvl,ov;
function init(){seq=[];input=[];lock=true;lvl=0;ov=false;document.getElementById('ov').classList.remove('show');render();setTimeout(next,500);}
function render(){var b=document.getElementById('bd');b.innerHTML='';COLS.forEach(function(c,i){var d=document.createElement('div');d.dataset.idx=i;d.style.cssText='background:'+c+';border-radius:12px;cursor:pointer;opacity:.4;transition:opacity .2s';d.onclick=function(){press(i);};b.appendChild(d);});}
function light(i,t){var d=document.querySelector('[data-idx="'+i+'"]');if(!d)return;d.style.opacity='1';setTimeout(function(){d.style.opacity='.4';},t||300);}
function next(){lvl++;document.getElementById('lvl').textContent=lvl;seq.push(Math.floor(Math.random()*16));input=[];lock=true;var i=0;var iv=setInterval(function(){if(i>=seq.length){clearInterval(iv);lock=false;return;}light(seq[i],400);i++;},700);}
function press(i){if(lock)return;light(i,200);input.push(i);if(input[input.length-1]!==seq[input.length-1]){ov=true;document.getElementById('ov').classList.add('show');return;}if(input.length===seq.length){lock=true;setTimeout(next,700);}}
function rst(){init();}
window.rst=rst;init();
`, "simon-big");
}

function quizScience(): string {
  return wrap("Quiz Science", `
<h1>🔬 <span>Quiz Science</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong>/8</span></div>
<div id="bd" style="background:#1a1a1a;padding:30px;border-radius:12px;border:2px solid #06b6d4;max-width:500px;min-width:340px"></div>
<div class="overlay" id="ov"><h2 id="ttl">Terminé</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var QS=[
{q:"Symbole chimique de l'eau ?",a:["H2O","CO2","O2","NaCl"],c:0},
{q:"Planète la plus grande du système solaire ?",a:["Saturne","Jupiter","Neptune","Uranus"],c:1},
{q:"Combien d'os dans le corps humain ?",a:["206","180","250","300"],c:0},
{q:"Vitesse de la lumière (km/s) ?",a:["300 000","150 000","1 000 000","30 000"],c:0},
{q:"Organe qui pompe le sang ?",a:["Foie","Poumon","Cœur","Rein"],c:2},
{q:"Gaz le plus abondant dans l'air ?",a:["Oxygène","Azote","CO2","Hélium"],c:1},
{q:"Année de la théorie de la relativité ?",a:["1905","1915","1920","1930"],c:0},
{q:"Nombre de chromosomes chez l'humain ?",a:["44","46","48","50"],c:1}
];
var idx,sc,ov;
function init(){idx=0;sc=0;ov=false;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');render();}
function render(){if(idx>=QS.length){ov=true;document.getElementById('ttl').textContent=sc>=6?'🏆 Génie !':'📚 Continue';document.getElementById('ov').classList.add('show');return;}var q=QS[idx];var h='<p style="color:#fff;font-size:18px;margin-bottom:20px">'+q.q+'</p><div style="display:flex;flex-direction:column;gap:10px">';q.a.forEach(function(a,i){h+='<button ontouchstart="pick('+i+');event.preventDefault()" onclick="pick('+i+')" style="padding:14px;background:#2a2a2a;color:#fff;border:2px solid #3a3a3a;border-radius:10px;cursor:pointer;font-family:inherit;font-weight:700">'+a+'</button>';});h+='</div>';document.getElementById('bd').innerHTML=h;}
function pick(i){if(ov)return;if(i===QS[idx].c){sc++;document.getElementById('score').textContent=sc;}idx++;render();}
window.pick=pick;
function rst(){init();}
window.rst=rst;init();
`, "quiz-science");
}

function quizGeo(): string {
  return wrap("Quiz Géo", `
<h1>🌍 <span>Quiz Géo</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong>/8</span></div>
<div id="bd" style="background:#1a1a1a;padding:30px;border-radius:12px;border:2px solid #22c55e;max-width:500px;min-width:340px"></div>
<div class="overlay" id="ov"><h2 id="ttl">Terminé</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var QS=[
{q:"Capitale du Japon ?",a:["Tokyo","Kyoto","Osaka","Séoul"],c:0},
{q:"Plus long fleuve du monde ?",a:["Amazone","Nil","Yangtsé","Mississippi"],c:1},
{q:"Combien de continents ?",a:["5","6","7","8"],c:2},
{q:"Plus haut sommet ?",a:["K2","Everest","Mont Blanc","Kilimanjaro"],c:1},
{q:"Capitale de l'Australie ?",a:["Sydney","Melbourne","Canberra","Perth"],c:2},
{q:"Plus grand désert chaud ?",a:["Gobi","Sahara","Kalahari","Mojave"],c:1},
{q:"Capitale de l'Italie ?",a:["Milan","Rome","Venise","Naples"],c:1},
{q:"Plus grand océan ?",a:["Atlantique","Indien","Pacifique","Arctique"],c:2}
];
var idx,sc,ov;
function init(){idx=0;sc=0;ov=false;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');render();}
function render(){if(idx>=QS.length){ov=true;document.getElementById('ttl').textContent=sc>=6?'🏆 Explorateur !':'📚 Continue';document.getElementById('ov').classList.add('show');return;}var q=QS[idx];var h='<p style="color:#fff;font-size:18px;margin-bottom:20px">'+q.q+'</p><div style="display:flex;flex-direction:column;gap:10px">';q.a.forEach(function(a,i){h+='<button ontouchstart="pick('+i+');event.preventDefault()" onclick="pick('+i+')" style="padding:14px;background:#2a2a2a;color:#fff;border:2px solid #3a3a3a;border-radius:10px;cursor:pointer;font-family:inherit;font-weight:700">'+a+'</button>';});h+='</div>';document.getElementById('bd').innerHTML=h;}
function pick(i){if(ov)return;if(i===QS[idx].c){sc++;document.getElementById('score').textContent=sc;}idx++;render();}
window.pick=pick;
function rst(){init();}
window.rst=rst;init();
`, "quiz-geo");
}

function quizHistoire(): string {
  return wrap("Quiz Histoire", `
<h1>🏛️ <span>Quiz Histoire</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong>/8</span></div>
<div id="bd" style="background:#1a1a1a;padding:30px;border-radius:12px;border:2px solid #a855f7;max-width:500px;min-width:340px"></div>
<div class="overlay" id="ov"><h2 id="ttl">Terminé</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var QS=[
{q:"Année de la Révolution française ?",a:["1776","1789","1799","1804"],c:1},
{q:"Premier président des États-Unis ?",a:["Lincoln","Washington","Jefferson","Adams"],c:1},
{q:"Qui a construit les pyramides ?",a:["Romains","Grecs","Égyptiens","Perses"],c:2},
{q:"Année fin 2nde Guerre mondiale ?",a:["1943","1944","1945","1946"],c:2},
{q:"Empire de Napoléon ?",a:["1er","2e","3e","4e"],c:0},
{q:"Année chute du mur de Berlin ?",a:["1987","1989","1991","1993"],c:1},
{q:"Civilisation maya : continent ?",a:["Asie","Europe","Amérique","Afrique"],c:2},
{q:"Qui a découvert l'Amérique ?",a:["Magellan","Colomb","Vasco de Gama","Marco Polo"],c:1}
];
var idx,sc,ov;
function init(){idx=0;sc=0;ov=false;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');render();}
function render(){if(idx>=QS.length){ov=true;document.getElementById('ttl').textContent=sc>=6?'🏆 Historien !':'📚 Continue';document.getElementById('ov').classList.add('show');return;}var q=QS[idx];var h='<p style="color:#fff;font-size:18px;margin-bottom:20px">'+q.q+'</p><div style="display:flex;flex-direction:column;gap:10px">';q.a.forEach(function(a,i){h+='<button ontouchstart="pick('+i+');event.preventDefault()" onclick="pick('+i+')" style="padding:14px;background:#2a2a2a;color:#fff;border:2px solid #3a3a3a;border-radius:10px;cursor:pointer;font-family:inherit;font-weight:700">'+a+'</button>';});h+='</div>';document.getElementById('bd').innerHTML=h;}
function pick(i){if(ov)return;if(i===QS[idx].c){sc++;document.getElementById('score').textContent=sc;}idx++;render();}
window.pick=pick;
function rst(){init();}
window.rst=rst;init();
`, "quiz-histoire");
}

function quizSport(): string {
  return wrap("Quiz Sport", `
<h1>⚽ <span>Quiz Sport</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong>/8</span></div>
<div id="bd" style="background:#1a1a1a;padding:30px;border-radius:12px;border:2px solid #facc15;max-width:500px;min-width:340px"></div>
<div class="overlay" id="ov"><h2 id="ttl">Terminé</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var QS=[
{q:"Nombre de joueurs dans une équipe de foot ?",a:["9","10","11","12"],c:2},
{q:"Sport avec un ballon orange ?",a:["Foot","Basket","Volley","Rugby"],c:1},
{q:"Tennis : tournoi sur terre battue ?",a:["Wimbledon","Roland-Garros","US Open","Australian"],c:1},
{q:"Combien de points pour un essai au rugby ?",a:["3","5","7","10"],c:1},
{q:"Sport des JO : natation. Combien de nages ?",a:["2","3","4","5"],c:2},
{q:"Boxe : combien de rounds max pro ?",a:["8","10","12","15"],c:2},
{q:"Vélo : Tour de France créé en ?",a:["1903","1913","1923","1933"],c:0},
{q:"Basket : hauteur panier ?",a:["2.5m","3m","3.05m","3.5m"],c:2}
];
var idx,sc,ov;
function init(){idx=0;sc=0;ov=false;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');render();}
function render(){if(idx>=QS.length){ov=true;document.getElementById('ttl').textContent=sc>=6?'🏆 Champion !':'📚 Continue';document.getElementById('ov').classList.add('show');return;}var q=QS[idx];var h='<p style="color:#fff;font-size:18px;margin-bottom:20px">'+q.q+'</p><div style="display:flex;flex-direction:column;gap:10px">';q.a.forEach(function(a,i){h+='<button ontouchstart="pick('+i+');event.preventDefault()" onclick="pick('+i+')" style="padding:14px;background:#2a2a2a;color:#fff;border:2px solid #3a3a3a;border-radius:10px;cursor:pointer;font-family:inherit;font-weight:700">'+a+'</button>';});h+='</div>';document.getElementById('bd').innerHTML=h;}
function pick(i){if(ov)return;if(i===QS[idx].c){sc++;document.getElementById('score').textContent=sc;}idx++;render();}
window.pick=pick;
function rst(){init();}
window.rst=rst;init();
`, "quiz-sport");
}

function quizCinema(): string {
  return wrap("Quiz Cinéma", `
<h1>🎬 <span>Quiz Cinéma</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong>/8</span></div>
<div id="bd" style="background:#1a1a1a;padding:30px;border-radius:12px;border:2px solid #ef4444;max-width:500px;min-width:340px"></div>
<div class="overlay" id="ov"><h2 id="ttl">Terminé</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var QS=[
{q:"Réalisateur de Titanic ?",a:["Spielberg","Cameron","Scorsese","Nolan"],c:1},
{q:"Acteur principal d'Inception ?",a:["Pitt","DiCaprio","Cruise","Damon"],c:1},
{q:"Film avec Neo ?",a:["Matrix","Terminator","Blade Runner","Tron"],c:0},
{q:"Saga avec Dark Vador ?",a:["Star Trek","Star Wars","Dune","Alien"],c:1},
{q:"Pixar 1995 ?",a:["Shrek","Toy Story","Nemo","Cars"],c:1},
{q:"Réalisateur de Pulp Fiction ?",a:["Tarantino","Fincher","Coppola","Burton"],c:0},
{q:"Acteur de Iron Man ?",a:["Evans","Downey Jr","Hemsworth","Ruffalo"],c:1},
{q:"Oscar meilleur film 2020 ?",a:["1917","Parasite","Joker","Roma"],c:1}
];
var idx,sc,ov;
function init(){idx=0;sc=0;ov=false;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');render();}
function render(){if(idx>=QS.length){ov=true;document.getElementById('ttl').textContent=sc>=6?'🏆 Cinéphile !':'📚 Continue';document.getElementById('ov').classList.add('show');return;}var q=QS[idx];var h='<p style="color:#fff;font-size:18px;margin-bottom:20px">'+q.q+'</p><div style="display:flex;flex-direction:column;gap:10px">';q.a.forEach(function(a,i){h+='<button ontouchstart="pick('+i+');event.preventDefault()" onclick="pick('+i+')" style="padding:14px;background:#2a2a2a;color:#fff;border:2px solid #3a3a3a;border-radius:10px;cursor:pointer;font-family:inherit;font-weight:700">'+a+'</button>';});h+='</div>';document.getElementById('bd').innerHTML=h;}
function pick(i){if(ov)return;if(i===QS[idx].c){sc++;document.getElementById('score').textContent=sc;}idx++;render();}
window.pick=pick;
function rst(){init();}
window.rst=rst;init();
`, "quiz-cinema");
}

function quizMusique(): string {
  return wrap("Quiz Musique", `
<h1>🎵 <span>Quiz Musique</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong>/8</span></div>
<div id="bd" style="background:#1a1a1a;padding:30px;border-radius:12px;border:2px solid #06b6d4;max-width:500px;min-width:340px"></div>
<div class="overlay" id="ov"><h2 id="ttl">Terminé</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var QS=[
{q:"Nombre de cordes d'une guitare classique ?",a:["4","5","6","7"],c:2},
{q:"Compositeur de la 9e Symphonie ?",a:["Mozart","Beethoven","Bach","Chopin"],c:1},
{q:"Groupe de John Lennon ?",a:["Rolling Stones","Beatles","Queen","Pink Floyd"],c:1},
{q:"Instrument de Louis Armstrong ?",a:["Piano","Trompette","Saxophone","Guitare"],c:1},
{q:"Chanteur de Queen ?",a:["Mercury","Jagger","Bowie","Lennon"],c:0},
{q:"Compositeur sourd célèbre ?",a:["Mozart","Beethoven","Bach","Vivaldi"],c:1},
{q:"Style de Bob Marley ?",a:["Jazz","Reggae","Rock","Blues"],c:1},
{q:"Nombre de touches d'un piano ?",a:["76","82","88","92"],c:2}
];
var idx,sc,ov;
function init(){idx=0;sc=0;ov=false;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');render();}
function render(){if(idx>=QS.length){ov=true;document.getElementById('ttl').textContent=sc>=6?'🏆 Mélomane !':'📚 Continue';document.getElementById('ov').classList.add('show');return;}var q=QS[idx];var h='<p style="color:#fff;font-size:18px;margin-bottom:20px">'+q.q+'</p><div style="display:flex;flex-direction:column;gap:10px">';q.a.forEach(function(a,i){h+='<button ontouchstart="pick('+i+');event.preventDefault()" onclick="pick('+i+')" style="padding:14px;background:#2a2a2a;color:#fff;border:2px solid #3a3a3a;border-radius:10px;cursor:pointer;font-family:inherit;font-weight:700">'+a+'</button>';});h+='</div>';document.getElementById('bd').innerHTML=h;}
function pick(i){if(ov)return;if(i===QS[idx].c){sc++;document.getElementById('score').textContent=sc;}idx++;render();}
window.pick=pick;
function rst(){init();}
window.rst=rst;init();
`, "quiz-musique");
}

function quizAnimaux(): string {
  return wrap("Quiz Animaux", `
<h1>🐾 <span>Quiz Animaux</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong>/8</span></div>
<div id="bd" style="background:#1a1a1a;padding:30px;border-radius:12px;border:2px solid #22c55e;max-width:500px;min-width:340px"></div>
<div class="overlay" id="ov"><h2 id="ttl">Terminé</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var QS=[
{q:"Plus grand animal terrestre ?",a:["Éléphant africain","Girafe","Rhinocéros","Hippopotame"],c:0},
{q:"Animal le plus rapide ?",a:["Lion","Guépard","Antilope","Lévrier"],c:1},
{q:"Combien de cœurs chez le poulpe ?",a:["1","2","3","4"],c:2},
{q:"Mammifère qui vole ?",a:["Aigle","Chauve-souris","Pingouin","Autruche"],c:1},
{q:"Plus long serpent ?",a:["Cobra","Python","Anaconda","Boa"],c:2},
{q:"Animal national de l'Australie ?",a:["Koala","Kangourou","Wombat","Dingo"],c:1},
{q:"Combien de pattes chez l'araignée ?",a:["6","8","10","12"],c:1},
{q:"Animal qui dort debout ?",a:["Cheval","Chat","Chien","Lapin"],c:0}
];
var idx,sc,ov;
function init(){idx=0;sc=0;ov=false;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');render();}
function render(){if(idx>=QS.length){ov=true;document.getElementById('ttl').textContent=sc>=6?'🏆 Zoo expert !':'📚 Continue';document.getElementById('ov').classList.add('show');return;}var q=QS[idx];var h='<p style="color:#fff;font-size:18px;margin-bottom:20px">'+q.q+'</p><div style="display:flex;flex-direction:column;gap:10px">';q.a.forEach(function(a,i){h+='<button ontouchstart="pick('+i+');event.preventDefault()" onclick="pick('+i+')" style="padding:14px;background:#2a2a2a;color:#fff;border:2px solid #3a3a3a;border-radius:10px;cursor:pointer;font-family:inherit;font-weight:700">'+a+'</button>';});h+='</div>';document.getElementById('bd').innerHTML=h;}
function pick(i){if(ov)return;if(i===QS[idx].c){sc++;document.getElementById('score').textContent=sc;}idx++;render();}
window.pick=pick;
function rst(){init();}
window.rst=rst;init();
`, "quiz-animaux");
}

function quizBizarre(): string {
  return wrap("Quiz Bizarre", `
<h1>🤔 <span>Quiz Bizarre</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong>/8</span></div>
<div id="bd" style="background:#1a1a1a;padding:30px;border-radius:12px;border:2px solid #ec4899;max-width:500px;min-width:340px"></div>
<div class="overlay" id="ov"><h2 id="ttl">Terminé</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var QS=[
{q:"Un avion s'écrase à la frontière France-Belgique. Où enterre-t-on les survivants ?",a:["France","Belgique","Ailleurs","Nulle part"],c:3},
{q:"Combien de mois ont 28 jours ?",a:["1","2","6","12"],c:3},
{q:"Un coq pond un œuf sur un toit pointu. De quel côté tombe-t-il ?",a:["Gauche","Droite","Il ne pond pas","Il reste"],c:2},
{q:"Si tu as 3 pommes et 4 oranges, combien as-tu de fruits ?",a:["3","4","7","1"],c:2},
{q:"Un homme marche sous la pluie sans parapluie, cheveux mouillés mais pas un cheveu de mouillé. Comment ?",a:["Casquette","Chauve","Parapluie","Abri"],c:1},
{q:"Combien de fois peut-on soustraire 5 de 25 ?",a:["5","4","1","Infini"],c:3},
{q:"Un électricien et un plombier... qui a le plus chaud ?",a:["Électricien","Plombier","Pareil","Aucun"],c:0},
{q:"Divise 30 par 1/2 et ajoute 10. Résultat ?",a:["25","40","70","55"],c:2}
];
var idx,sc,ov;
function init(){idx=0;sc=0;ov=false;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');render();}
function render(){if(idx>=QS.length){ov=true;document.getElementById('ttl').textContent=sc>=6?'🏆 Bien joué !':'📚 Continue';document.getElementById('ov').classList.add('show');return;}var q=QS[idx];var h='<p style="color:#fff;font-size:16px;margin-bottom:20px">'+q.q+'</p><div style="display:flex;flex-direction:column;gap:10px">';q.a.forEach(function(a,i){h+='<button ontouchstart="pick('+i+');event.preventDefault()" onclick="pick('+i+')" style="padding:14px;background:#2a2a2a;color:#fff;border:2px solid #3a3a3a;border-radius:10px;cursor:pointer;font-family:inherit;font-weight:700">'+a+'</button>';});h+='</div>';document.getElementById('bd').innerHTML=h;}
function pick(i){if(ov)return;if(i===QS[idx].c){sc++;document.getElementById('score').textContent=sc;}idx++;render();}
window.pick=pick;
function rst(){init();}
window.rst=rst;init();
`, "quiz-bizarre");
}

function quizMath2(): string {
  return wrap("Quiz Math Avancé", `
<h1>🧮 <span>Quiz Math+</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Temps : <strong id="time">60</strong>s</span></div>
<div id="bd" style="background:#1a1a1a;padding:30px;border-radius:12px;border:2px solid #facc15;max-width:500px;min-width:340px"></div>
<div class="overlay" id="ov"><h2>Terminé</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var sc,t,ov,ans,timer;
function init(){sc=0;t=60;ov=false;document.getElementById('score').textContent='0';document.getElementById('time').textContent='60';document.getElementById('ov').classList.remove('show');if(timer)clearInterval(timer);timer=setInterval(function(){if(ov)return;t--;document.getElementById('time').textContent=t;if(t<=0){ov=true;document.getElementById('fin').textContent=sc;document.getElementById('ov').classList.add('show');}},1000);next();}
function next(){var type=Math.floor(Math.random()*4);var q,a;if(type===0){var x=Math.floor(Math.random()*20)+5,y=Math.floor(Math.random()*20)+5;q=x+" × "+y;a=x*y;}else if(type===1){var x=Math.floor(Math.random()*50)+10,y=Math.floor(Math.random()*30)+5;q=x+" + "+y;a=x+y;}else if(type===2){var x=Math.floor(Math.random()*50)+20,y=Math.floor(Math.random()*20)+5;q=x+" - "+y;a=x-y;}else{var x=Math.floor(Math.random()*10)+2;q=x+"²";a=x*x;}ans=a;var ch=[a];while(ch.length<4){var f=a+(Math.floor(Math.random()*21)-10);if(ch.indexOf(f)<0&&f!==a)ch.push(f);}ch.sort(function(){return Math.random()-0.5;});var h='<p style="color:#fff;font-size:36px;font-weight:900;margin-bottom:24px">'+q+' = ?</p><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">';ch.forEach(function(c){h+='<button ontouchstart="pick('+c+');event.preventDefault()" onclick="pick('+c+')" style="padding:16px;background:#2a2a2a;color:#fff;border:2px solid #3a3a3a;border-radius:10px;cursor:pointer;font-family:inherit;font-weight:900;font-size:18px">'+c+'</button>';});h+='</div>';document.getElementById('bd').innerHTML=h;}
function pick(v){if(ov)return;if(v===ans){sc+=10;document.getElementById('score').textContent=sc;}next();}
window.pick=pick;
function rst(){init();}
window.rst=rst;init();
`, "quiz-math2");
}

function findPair(): string {
  return wrap("Trouve la Paire", `
<h1>🔎 <span>Trouve la Paire</span></h1>
<div class="stats"><span>Trouvées : <strong id="found">0</strong>/8</span></div>
<div id="bd" style="display:grid;grid-template-columns:repeat(4,min(60px,15vw));gap:8px;background:#1a1a1a;padding:12px;border-radius:12px"></div>
<div class="overlay" id="ov"><h2>🎉 Bravo !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var EMO=['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼'],sel,found,ov;
function init(){var all=EMO.concat(EMO);all.sort(function(){return Math.random()-0.5;});var grid=document.getElementById('bd');grid.innerHTML='';sel=null;found=0;ov=false;document.getElementById('found').textContent='0';document.getElementById('ov').classList.remove('show');all.forEach(function(e,i){var cc=document.createElement('div');cc.style.cssText='aspect-ratio:1;background:#2a2a2a;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:clamp(20px,5vw,32px);cursor:pointer';cc.textContent=e;cc.dataset.em=e;cc.onclick=function(){pick(i,cc);};grid.appendChild(cc);});}
function pick(i,cc){if(ov||cc.dataset.done)return;if(sel===null){sel=cc;cc.style.background='#facc15';return;}if(sel===cc){sel.style.background='#2a2a2a';sel=null;return;}if(sel.dataset.em===cc.dataset.em){sel.dataset.done='1';cc.dataset.done='1';sel.style.background='#22c55e';cc.style.background='#22c55e';found++;document.getElementById('found').textContent=found;sel=null;if(found===8){ov=true;setTimeout(function(){document.getElementById('ov').classList.add('show');},300);}}else{sel.style.background='#2a2a2a';sel=null;}}
function rst(){init();}
window.rst=rst;init();
`, "find-pair");
}

function countClicks(): string {
  return wrap("Compte les Clics", `
<h1>👆 <span>Compte les Clics</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Cible : <strong id="target">10</strong></span><span>Temps : <strong id="time">5</strong>s</span></div>
<div id="bd" style="width:min(500px,90vw);height:400px;background:#1a1a1a;border-radius:16px;display:flex;align-items:center;justify-content:center;cursor:pointer;border:2px solid #facc15"></div>
<div class="overlay" id="ov"><h2 id="ttl">Résultat</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var sc,target,t,ov,clicks,timer;
function init(){sc=0;clicks=0;target=10;t=5;ov=false;document.getElementById('score').textContent='0';document.getElementById('target').textContent='10';document.getElementById('time').textContent='5';document.getElementById('ov').classList.remove('show');render();if(timer)clearInterval(timer);timer=setInterval(function(){if(ov)return;t--;document.getElementById('time').textContent=t;if(t<=0){ov=true;document.getElementById('ttl').textContent=clicks>=target?'🎉 Bravo !':'😢 Raté '+clicks+'/'+target;document.getElementById('ov').classList.add('show');}},1000);}
function render(){document.getElementById('bd').innerHTML='<p style="color:#facc15;font-size:48px;font-weight:900">'+clicks+' / '+target+'</p>';}
function click(){if(ov)return;clicks++;document.getElementById('score').textContent=clicks;render();if(clicks>=target){sc+=100;document.getElementById('score').textContent=sc;target+=10;clicks=0;document.getElementById('target').textContent=target;t=5;document.getElementById('time').textContent='5';render();}}
function rst(){init();}
window.rst=rst;
document.getElementById('bd').addEventListener('click',click);
document.getElementById('bd').addEventListener('touchstart',function(e){e.preventDefault();click();},{passive:false});
init();
`, "count-clicks");
}

function stopChrono(): string {
  return wrap("Stop Chrono", `
<h1>⏱️ <span>Stop Chrono</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Objectif : <strong id="target">5.00</strong>s</span></div>
<div id="bd" style="width:min(500px,90vw);height:300px;background:#1a1a1a;border-radius:16px;display:flex;align-items:center;justify-content:center;cursor:pointer;border:2px solid #22c55e"></div>
<div class="overlay" id="ov"><h2 id="ttl">Résultat</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var sc,target,ov,state,startTime,currentTime;
function init(){sc=0;target=5;ov=false;state='idle';document.getElementById('score').textContent='0';document.getElementById('target').textContent=target.toFixed(2);document.getElementById('ov').classList.remove('show');render();}
function render(){if(state==='idle'){document.getElementById('bd').innerHTML='<p style="color:#fff;font-size:22px">Clique pour commencer</p>';}else if(state==='running'){var el=(currentTime-startTime)/1000;document.getElementById('bd').innerHTML='<p style="color:#facc15;font-size:60px;font-weight:900">'+el.toFixed(2)+'s</p>';}}
function click(){if(ov)return;if(state==='idle'){state='running';startTime=Date.now();currentTime=startTime;render();var iv=setInterval(function(){if(state!=='running'){clearInterval(iv);return;}currentTime=Date.now();render();},50);}else if(state==='running'){state='idle';var el=(Date.now()-startTime)/1000;var diff=Math.abs(el-target);if(diff<0.3)sc+=100;else if(diff<0.5)sc+=50;else if(diff<1)sc+=20;document.getElementById('score').textContent=sc;target=Math.round((target+0.5)*100)/100;document.getElementById('target').textContent=target.toFixed(2);setTimeout(function(){state='idle';render();},500);}}
function rst(){init();}
window.rst=rst;
document.getElementById('bd').addEventListener('click',click);
document.getElementById('bd').addEventListener('touchstart',function(e){e.preventDefault();click();},{passive:false});
init();
`, "stop-chrono");
}

function clickBattle(): string {
  return wrap("Bataille de Clics", `
<h1>👊 <span>Bataille Clics</span></h1>
<div class="stats"><span>Toi : <strong id="s1">0</strong></span><span>IA : <strong id="s2">0</strong></span></div>
<div id="bd" style="display:flex;gap:40px;align-items:center;justify-content:center;padding:40px"></div>
<div class="controls" style="margin-top:20px"><button ontouchstart="click();event.preventDefault()" onclick="click()" style="width:200px;background:#22c55e;color:#fff;font-size:20px">CLIQUER VITE !</button></div>
<div class="overlay" id="ov"><h2 id="ttl">Fin</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var s1,s2,ov,timer,t;
function init(){s1=0;s2=0;ov=false;t=0;document.getElementById('s1').textContent='0';document.getElementById('s2').textContent='0';document.getElementById('ov').classList.remove('show');render();if(timer)clearInterval(timer);timer=setInterval(function(){if(ov)return;s2++;t++;document.getElementById('s2').textContent=s2;render();if(s2>=100){ov=true;document.getElementById('ttl').textContent='😢 Perdu';document.getElementById('ov').classList.add('show');}},200);}
function render(){document.getElementById('bd').innerHTML='<div style="text-align:center"><p style="color:#22c55e;font-size:20px;font-weight:900">TOI</p><p style="color:#22c55e;font-size:60px;font-weight:900">'+s1+'</p></div><div style="font-size:40px">VS</div><div style="text-align:center"><p style="color:#ef4444;font-size:20px;font-weight:900">IA</p><p style="color:#ef4444;font-size:60px;font-weight:900">'+s2+'</p></div>';}
function click(){if(ov)return;s1++;document.getElementById('s1').textContent=s1;render();if(s1>=100){ov=true;clearInterval(timer);document.getElementById('ttl').textContent='🎉 Gagné !';document.getElementById('ov').classList.add('show');}}
function rst(){init();}
window.rst=rst;init();
`, "click-battle");
}

function handCricket(): string {
  return wrap("Cricket", `
<h1>🏏 <span>Cricket</span></h1>
<div class="stats"><span>Ton score : <strong id="s1">0</strong></span><span>IA : <strong id="s2">0</strong></span></div>
<div id="bd" style="text-align:center;padding:30px;background:#1a1a1a;border-radius:16px;max-width:500px"></div>
<div class="controls" style="margin-top:16px">
<button ontouchstart="play(1);event.preventDefault()" onclick="play(1)" style="background:#22c55e;color:#fff;width:60px">1</button>
<button ontouchstart="play(2);event.preventDefault()" onclick="play(2)" style="background:#22c55e;color:#fff;width:60px">2</button>
<button ontouchstart="play(3);event.preventDefault()" onclick="play(3)" style="background:#22c55e;color:#fff;width:60px">3</button>
<button ontouchstart="play(4);event.preventDefault()" onclick="play(4)" style="background:#22c55e;color:#fff;width:60px">4</button>
<button ontouchstart="play(6);event.preventDefault()" onclick="play(6)" style="background:#22c55e;color:#fff;width:60px">6</button>
</div>
<div class="overlay" id="ov"><h2 id="ttl">Fin</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var s1,s2,ov;
function init(){s1=0;s2=0;ov=false;document.getElementById('s1').textContent='0';document.getElementById('s2').textContent='0';document.getElementById('ov').classList.remove('show');render('Choisis un nombre');}
function render(msg){document.getElementById('bd').innerHTML='<p style="color:#fff;font-size:18px">'+msg+'</p>';}
function play(p){if(ov)return;var ai=Math.floor(Math.random()*6)+1;if(ai===5)ai=6;if(p===ai){ov=true;document.getElementById('ttl').textContent='OUT ! Score : '+s1;document.getElementById('ov').classList.add('show');}else{s1+=p;document.getElementById('s1').textContent=s1;}render('Toi : '+p+' | IA : '+ai);}
function rst(){init();}
window.rst=rst;init();
`, "cricket");
}

function guessColor(): string {
  return wrap("Devine Couleur", `
<h1>🎨 <span>Devine Couleur</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<div id="bd" style="text-align:center;padding:20px;background:#1a1a1a;border-radius:16px;max-width:500px"></div>
<div class="overlay" id="ov"><h2>Terminé</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var COLORS=['#ef4444','#3b82f6','#22c55e','#facc15','#a855f7','#f97316','#06b6d4','#ec4899'];
var sc,ov,target,timer;
function init(){sc=0;ov=false;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');if(timer)clearInterval(timer);timer=setInterval(function(){if(ov)return;if(!target)next();},1000);next();}
function next(){target=COLORS[Math.floor(Math.random()*COLORS.length)];var ch=[target];while(ch.length<4){var c=COLORS[Math.floor(Math.random()*COLORS.length)];if(ch.indexOf(c)<0)ch.push(c);}ch.sort(function(){return Math.random()-0.5;});var h='<p style="color:#fff;margin-bottom:16px">Trouve la couleur '+target+'</p><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px">';ch.forEach(function(c){h+='<button ontouchstart="pick(\\''+c+'\\');event.preventDefault()" onclick="pick(\\''+c+'\\')" style="padding:30px;background:'+c+';border:none;border-radius:12px;cursor:pointer"></button>';});h+='</div>';document.getElementById('bd').innerHTML=h;}
function pick(c){if(ov)return;if(c===target)sc+=10;else sc=Math.max(0,sc-5);document.getElementById('score').textContent=sc;next();}
window.pick=pick;
function rst(){init();}
window.rst=rst;init();
`, "guess-color");
}

function simonSpeed(): string {
  return wrap("Simon Vitesse", `
<h1>⚡ <span>Simon Vitesse</span></h1>
<div class="stats"><span>Niveau : <strong id="lvl">1</strong></span></div>
<div id="bd" style="display:grid;grid-template-columns:repeat(2,min(120px,35vw));grid-template-rows:repeat(2,min(120px,35vw));gap:12px"></div>
<div class="overlay" id="ov"><h2>Perdu</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var COLS=['#ef4444','#3b82f6','#22c55e','#facc15'];
var seq,input,lock,lvl,ov;
function init(){seq=[];input=[];lock=true;lvl=0;ov=false;document.getElementById('ov').classList.remove('show');render();setTimeout(next,400);}
function render(){var b=document.getElementById('bd');b.innerHTML='';COLS.forEach(function(c,i){var d=document.createElement('div');d.dataset.idx=i;d.style.cssText='background:'+c+';border-radius:20px;cursor:pointer;opacity:.4;transition:opacity .1s';d.onclick=function(){press(i);};b.appendChild(d);});}
function light(i,t){var d=document.querySelector('[data-idx="'+i+'"]');if(!d)return;d.style.opacity='1';setTimeout(function(){d.style.opacity='.4';},t||150);}
function next(){lvl++;document.getElementById('lvl').textContent=lvl;seq.push(Math.floor(Math.random()*4));input=[];lock=true;var sp=Math.max(100,400-lvl*25);var i=0;var iv=setInterval(function(){if(i>=seq.length){clearInterval(iv);lock=false;return;}light(seq[i],sp);i++;},sp+100);}
function press(i){if(lock)return;light(i,100);input.push(i);if(input[input.length-1]!==seq[input.length-1]){ov=true;document.getElementById('ov').classList.add('show');return;}if(input.length===seq.length){lock=true;setTimeout(next,400);}}
function rst(){init();}
window.rst=rst;init();
`, "simon-speed");
}

function memoryPosition(): string {
  return wrap("Memory Position", `
<h1>📍 <span>Memory Position</span></h1>
<div class="stats"><span>Niveau : <strong id="lvl">1</strong></span></div>
<div id="bd" style="display:grid;grid-template-columns:repeat(4,min(70px,18vw));grid-template-rows:repeat(4,min(70px,18vw));gap:8px"></div>
<div class="overlay" id="ov"><h2>Perdu</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var seq,input,lock,lvl,ov,showTimer;
function init(){seq=[];input=[];lock=true;lvl=0;ov=false;document.getElementById('ov').classList.remove('show');render();setTimeout(next,500);}
function render(highlight){var b=document.getElementById('bd');b.innerHTML='';for(var i=0;i<16;i++){var d=document.createElement('div');d.dataset.idx=i;var bg=highlight&&highlight.indexOf(i)>=0?'#facc15':'#2a2a2a';d.style.cssText='aspect-ratio:1;background:'+bg+';border-radius:10px;cursor:pointer;transition:background .2s';d.onclick=function(i){return function(){press(i);};}(i);b.appendChild(d);}}
function next(){lvl++;document.getElementById('lvl').textContent=lvl;seq=[Math.floor(Math.random()*16)];input=[];lock=true;render(seq);clearTimeout(showTimer);showTimer=setTimeout(function(){render();lock=false;},1500);}
function press(i){if(lock)return;if(i===seq[0]){lvl++;lock=true;render([i]);clearTimeout(showTimer);showTimer=setTimeout(next,700);}else{ov=true;document.getElementById('ov').classList.add('show');}}
function rst(){init();}
window.rst=rst;init();
`, "memory-position");
}

function memorySequence(): string {
  return wrap("Memory Séquence", `
<h1>🔢 <span>Memory Séquence</span></h1>
<div class="stats"><span>Niveau : <strong id="lvl">1</strong></span></div>
<div id="bd" style="text-align:center;padding:30px;background:#1a1a1a;border-radius:16px;max-width:500px"></div>
<div class="overlay" id="ov"><h2>Perdu</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var seq,input,lvl,ov,phase,showTimer;
function init(){seq=[];input=[];lvl=0;ov=false;phase='show';document.getElementById('ov').classList.remove('show');next();}
function next(){lvl++;document.getElementById('lvl').textContent=lvl;seq.push(Math.floor(Math.random()*10));input=[];phase='show';showSequence();}
function showSequence(){var i=0;var html='<p style="color:#facc15;font-size:72px;font-weight:900;min-height:100px">';html+='</p>';document.getElementById('bd').innerHTML=html;var iv=setInterval(function(){if(i>=seq.length){clearInterval(iv);phase='input';render();return;}document.querySelector('#bd p').textContent=seq[i];i++;},700);}
function render(){var html='<p style="color:#888;margin-bottom:20px">Reproduis ('+input.length+'/'+seq.length+')</p><div style="display:grid;grid-template-columns:repeat(5,1fr);gap:10px">';for(var i=0;i<10;i++){html+='<button ontouchstart="press('+i+');event.preventDefault()" onclick="press('+i+')" style="padding:16px;background:#2a2a2a;color:#fff;border:2px solid #3a3a3a;border-radius:10px;cursor:pointer;font-family:inherit;font-weight:900;font-size:18px">'+i+'</button>';}html+='</div>';document.getElementById('bd').innerHTML=html;}
function press(v){if(phase!=='input'||ov)return;input.push(v);if(input[input.length-1]!==seq[input.length-1]){ov=true;document.getElementById('ov').classList.add('show');return;}if(input.length===seq.length){phase='show';setTimeout(next,700);}else render();}
function rst(){init();}
window.rst=rst;init();
`, "memory-sequence");
}

function findLetter(): string {
  return wrap("Trouve la Lettre", `
<h1>🔤 <span>Trouve la Lettre</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Cible : <strong id="target">A</strong></span></div>
<div id="bd" style="display:grid;grid-template-columns:repeat(8,min(45px,10vw));gap:6px;background:#1a1a1a;padding:12px;border-radius:12px"></div>
<div class="overlay" id="ov"><h2>Terminé</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var sc,ov,target,timer,t;
function init(){sc=0;ov=false;t=30;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');if(timer)clearInterval(timer);timer=setInterval(function(){if(ov)return;t--;if(t<=0){ov=true;document.getElementById('fin').textContent=sc;document.getElementById('ov').classList.add('show');}},1000);next();}
function next(){target=String.fromCharCode(65+Math.floor(Math.random()*26));document.getElementById('target').textContent=target;var b=document.getElementById('bd');b.innerHTML='';for(var i=0;i<64;i++){var letter=String.fromCharCode(65+Math.floor(Math.random()*26));var cc=document.createElement('div');cc.style.cssText='aspect-ratio:1;background:#2a2a2a;border-radius:6px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:clamp(12px,2.5vw,18px);cursor:pointer;color:#fff';cc.textContent=letter;cc.onclick=function(l){return function(){pick(l);};}(letter);b.appendChild(cc);}var pos=Math.floor(Math.random()*64);b.children[pos].textContent=target;}
function pick(l){if(ov)return;if(l===target){sc+=10;document.getElementById('score').textContent=sc;next();}else{sc=Math.max(0,sc-3);document.getElementById('score').textContent=sc;}}
function rst(){init();}
window.rst=rst;init();
`, "find-letter");
}

function wordChain(): string {
  return wrap("Chaîne de Mots", `
<h1>🔗 <span>Chaîne de Mots</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<div id="bd" style="text-align:center;padding:30px;background:#1a1a1a;border-radius:16px;max-width:500px"></div>
<div class="overlay" id="ov"><h2>Terminé</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var WORDS=['CHAT','TABLE','ÉCOLE','ARBRE','LIVRE','ROCHE','ÉTOILE','AVION','NID','DOIGT','TEMPLE','PORTE','ESCALIER','RADIO','OURS'];
var sc,ov,cur,timer,t;
function init(){sc=0;ov=false;t=60;cur=WORDS[Math.floor(Math.random()*WORDS.length)];document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');if(timer)clearInterval(timer);timer=setInterval(function(){if(ov)return;t--;if(t<=0){ov=true;document.getElementById('fin').textContent=sc;document.getElementById('ov').classList.add('show');}},1000);render();}
function render(){var h='<p style="color:#888;margin-bottom:12px">Mot à continuer :</p><p style="color:#facc15;font-size:32px;font-weight:900;margin-bottom:20px">'+cur+'</p><input id="inp" type="text" placeholder="Ton mot..." style="width:200px;padding:12px;font-size:18px;background:#0a0a0a;color:#fff;border:2px solid #22c55e;border-radius:10px;outline:none;text-align:center" /><br><button ontouchstart="submit();event.preventDefault()" onclick="submit()" style="margin-top:16px;padding:12px 32px;background:#22c55e;color:#fff;border:none;border-radius:10px;font-weight:900;cursor:pointer;font-family:inherit">VALIDER</button>';document.getElementById('bd').innerHTML=h;setTimeout(function(){var i=document.getElementById('inp');if(i)i.focus();},100);}
function submit(){if(ov)return;var v=(document.getElementById('inp').value||'').toUpperCase().trim();if(v.length<3)return;var last=cur.slice(-1);var first=v.charAt(0);if(last===first){sc+=v.length*10;document.getElementById('score').textContent=sc;cur=v;var found=WORDS.find(function(w){return w.charAt(0)===v.slice(-1);});if(found){cur=found;sc+=5;}render();}else{var i=document.getElementById('inp');i.style.borderColor='#ef4444';i.value='';setTimeout(function(){i.style.borderColor='#22c55e';},500);}}
window.submit=submit;
document.addEventListener('keydown',function(e){if(e.key==='Enter')submit();});
function rst(){init();}
window.rst=rst;init();
`, "word-chain");
}

function anagram(): string {
  return wrap("Anagrammes", `
<h1>🔀 <span>Anagrammes</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Temps : <strong id="time">60</strong>s</span></div>
<div id="bd" style="text-align:center;padding:30px;background:#1a1a1a;border-radius:16px;max-width:500px"></div>
<div class="overlay" id="ov"><h2>Terminé</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var WORDS=['MAISON','ARBRE','SOLEIL','LIVRE','VOITURE','FLEUR','TABLE','POMME','JARDIN','ROUGE'];
var sc,ov,t,cur,timer;
function init(){sc=0;ov=false;t=60;document.getElementById('score').textContent='0';document.getElementById('time').textContent='60';document.getElementById('ov').classList.remove('show');if(timer)clearInterval(timer);timer=setInterval(function(){if(ov)return;t--;document.getElementById('time').textContent=t;if(t<=0){ov=true;document.getElementById('fin').textContent=sc;document.getElementById('ov').classList.add('show');}},1000);next();}
function next(){cur=WORDS[Math.floor(Math.random()*WORDS.length)];var letters=cur.split('').sort(function(){return Math.random()-0.5;});var h='<p style="color:#888;margin-bottom:16px">Remets dans l\\'ordre :</p><p style="color:#facc15;font-size:32px;font-weight:900;letter-spacing:8px;margin-bottom:20px">'+letters.join('')+'</p><input id="inp" type="text" placeholder="Réponse..." style="width:200px;padding:12px;font-size:18px;background:#0a0a0a;color:#fff;border:2px solid #a855f7;border-radius:10px;outline:none;text-align:center" /><br><button ontouchstart="submit();event.preventDefault()" onclick="submit()" style="margin-top:16px;padding:12px 32px;background:#a855f7;color:#fff;border:none;border-radius:10px;font-weight:900;cursor:pointer;font-family:inherit">VALIDER</button>';document.getElementById('bd').innerHTML=h;setTimeout(function(){var i=document.getElementById('inp');if(i)i.focus();},100);}
function submit(){if(ov)return;var v=(document.getElementById('inp').value||'').toUpperCase().trim();if(v===cur){sc+=cur.length*10;document.getElementById('score').textContent=sc;next();}else{var i=document.getElementById('inp');i.style.borderColor='#ef4444';i.value='';setTimeout(function(){i.style.borderColor='#a855f7';},400);}}
window.submit=submit;
document.addEventListener('keydown',function(e){if(e.key==='Enter')submit();});
function rst(){init();}
window.rst=rst;init();
`, "anagram");
}

function countWords(): string {
  return wrap("Compte les Mots", `
<h1>📚 <span>Compte les Mots</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<div id="bd" style="text-align:center;padding:20px;background:#1a1a1a;border-radius:16px;max-width:500px"></div>
<div class="overlay" id="ov"><h2>Terminé</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var WORDS=['chat','arbre','soleil','livre','voiture','fleur','table','pomme','jardin','rouge','bleu','vert','maison','fenêtre','ciel'];
var sc,ov,timer,t,currentTarget,wordCount;
function init(){sc=0;ov=false;t=60;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');if(timer)clearInterval(timer);timer=setInterval(function(){if(ov)return;t--;if(t<=0){ov=true;document.getElementById('fin').textContent=sc;document.getElementById('ov').classList.add('show');}},1000);next();}
function next(){currentTarget=WORDS[Math.floor(Math.random()*WORDS.length)];wordCount=Math.floor(Math.random()*5)+3;var words=[];for(var i=0;i<wordCount;i++){var w=WORDS[Math.floor(Math.random()*WORDS.length)];if(Math.random()<0.3)w=currentTarget;words.push(w);}words.push(currentTarget);words.sort(function(){return Math.random()-0.5;});var html='<p style="color:#fff;margin-bottom:16px">Combien de fois le mot <strong style="color:#facc15">'+currentTarget+'</strong> apparaît ?</p><p style="color:#ddd;font-size:14px;line-height:1.8;margin-bottom:16px">'+words.join(' · ')+'</p>';var total=words.filter(function(w){return w===currentTarget;}).length;for(var i=1;i<=6;i++){html+='<button ontouchstart="pick('+i+','+total+');event.preventDefault()" onclick="pick('+i+','+total+')" style="padding:10px 16px;margin:4px;background:#2a2a2a;color:#fff;border:2px solid #3a3a3a;border-radius:8px;cursor:pointer;font-family:inherit;font-weight:900">'+i+'</button>';}document.getElementById('bd').innerHTML=html;}
function pick(v,correct){if(ov)return;if(v===correct)sc+=15;else sc=Math.max(0,sc-5);document.getElementById('score').textContent=sc;next();}
window.pick=pick;
function rst(){init();}
window.rst=rst;init();
`, "count-words");
}

function typingWords(): string {
  return wrap("Mots Rapides", `
<h1>⌨️ <span>Mots Rapides</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Temps : <strong id="time">30</strong>s</span></div>
<canvas id="g" width="600" height="400" style="width:min(600px,90vw)"></canvas>
<div style="margin-top:12px;width:min(600px,90vw)"><input id="inp" type="text" placeholder="Tape ici..." style="width:100%;padding:14px;font-size:18px;background:#1a1a1a;color:#fff;border:2px solid #22c55e;border-radius:12px;outline:none" /></div>
<div class="overlay" id="ov"><h2>Terminé</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var words,sc,t,ov,timer,loop;
var LIST=['chat','arbre','soleil','livre','voiture','fleur','table','pomme','jardin','rouge','bleu','vert','maison','fenêtre','ciel','étoile'];
function init(){words=[];sc=0;t=30;ov=false;document.getElementById('score').textContent='0';document.getElementById('time').textContent='30';document.getElementById('ov').classList.remove('show');document.getElementById('inp').value='';if(timer)clearInterval(timer);timer=setInterval(function(){if(ov)return;t--;document.getElementById('time').textContent=t;if(t<=0){ov=true;document.getElementById('fin').textContent=sc;document.getElementById('ov').classList.add('show');}},1000);}
function spawn(){words.push({w:LIST[Math.floor(Math.random()*LIST.length)],x:Math.random()*(W-100)+50,y:-20,vy:0.5+Math.random()*0.8});}
function upd(){if(Math.random()<0.02)spawn();words.forEach(function(w){w.y+=w.vy;});words=words.filter(function(w){return w.y<H+30;});}
function draw(){x.fillStyle='#000';x.fillRect(0,0,W,H);words.forEach(function(w){x.fillStyle='#22c55e';x.font='bold 22px system-ui';x.textAlign='center';x.fillText(w.w,w.x,w.y);});x.textAlign='left';}
function tick(){if(!ov)upd();draw();}
document.getElementById('inp').addEventListener('input',function(e){var v=e.target.value.toUpperCase();for(var i=words.length-1;i>=0;i--){if(words[i].w.toUpperCase()===v){sc+=words[i].w.length*10;document.getElementById('score').textContent=sc;words.splice(i,1);e.target.value='';return;}}});
function rst(){init();}
window.rst=rst;
if(!window._started){window._started=true;setInterval(tick,20);}
init();
`, "typing-words");
}

function speedMath(): string {
  return wrap("Math Speed", `
<h1>⚡ <span>Math Speed</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Temps : <strong id="time">30</strong>s</span></div>
<div id="bd" style="text-align:center;padding:40px;background:#1a1a1a;border-radius:16px;max-width:500px"></div>
<div class="overlay" id="ov"><h2>Terminé</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var sc,t,ov,ans,timer;
function init(){sc=0;t=30;ov=false;document.getElementById('score').textContent='0';document.getElementById('time').textContent='30';document.getElementById('ov').classList.remove('show');if(timer)clearInterval(timer);timer=setInterval(function(){if(ov)return;t--;document.getElementById('time').textContent=t;if(t<=0){ov=true;document.getElementById('fin').textContent=sc;document.getElementById('ov').classList.add('show');}},1000);next();}
function next(){var a=Math.floor(Math.random()*12)+1,b=Math.floor(Math.random()*12)+1;var op=['+','-','×'][Math.floor(Math.random()*3)];if(op==='+')ans=a+b;else if(op==='-')ans=a-b;else ans=a*b;var ch=[ans];while(ch.length<4){var f=ans+(Math.floor(Math.random()*13)-6);if(ch.indexOf(f)<0&&f!==ans)ch.push(f);}ch.sort(function(){return Math.random()-0.5;});var h='<p style="color:#facc15;font-size:44px;font-weight:900;margin-bottom:24px">'+a+' '+op+' '+b+' = ?</p><div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">';ch.forEach(function(c){h+='<button ontouchstart="pick('+c+');event.preventDefault()" onclick="pick('+c+')" style="padding:18px;background:#2a2a2a;color:#fff;border:2px solid #3a3a3a;border-radius:12px;cursor:pointer;font-family:inherit;font-weight:900;font-size:22px">'+c+'</button>';});h+='</div>';document.getElementById('bd').innerHTML=h;}
function pick(v){if(ov)return;if(v===ans){sc+=5;document.getElementById('score').textContent=sc;}else{sc=Math.max(0,sc-3);document.getElementById('score').textContent=sc;}next();}
window.pick=pick;
function rst(){init();}
window.rst=rst;init();
`, "speed-math");
}
// ═══════════════════════════════════════════════════════════════
// PAQUET 12 : 30 JEUX
// ═══════════════════════════════════════════════════════════════

function spaceWar(): string {
  return wrap("Space War", `
<h1>🛸 <span>Space War</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Vies : <strong id="lives">3</strong></span></div>
<canvas id="g" width="500" height="500"></canvas>
<div class="controls"><button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button><button ontouchstart="sh();event.preventDefault()" onclick="sh()">FIRE</button><button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button></div>
<div class="overlay" id="ov"><h2>Game Over</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var pl,bl,en,sc,lv,ov,loop,t;
function init(){pl={x:W/2-15,y:H-40,w:30,h:20};bl=[];en=[];sc=0;lv=3;ov=false;t=0;document.getElementById('score').textContent='0';document.getElementById('lives').textContent='3';document.getElementById('ov').classList.remove('show');}
function mv(d){pl.x+=d*25;pl.x=Math.max(0,Math.min(W-pl.w,pl.x));}
function sh(){if(ov)return;if(bl.length<4)bl.push({x:pl.x+pl.w/2,y:pl.y,vy:-9});}
window.mv=mv;window.sh=sh;
function upd(){t++;if(t%40===0)en.push({x:Math.random()*(W-30),y:-30,w:30,h:30,vy:1.5});bl.forEach(function(b){b.y+=b.vy;});en.forEach(function(e){e.y+=e.vy;});bl=bl.filter(function(b){return b.y>0;});bl.forEach(function(b){en.forEach(function(e){if(e.dead)return;if(Math.hypot(b.x-e.x-15,b.y-e.y-15)<20){e.dead=true;b.y=-100;sc+=20;document.getElementById('score').textContent=sc;}});});bl=bl.filter(function(b){return b.y>0;});en=en.filter(function(e){return !e.dead&&e.y<H+30;});en.forEach(function(e){if(e.x<pl.x+pl.w&&e.x+e.w>pl.x&&e.y<pl.y+pl.h&&e.y+e.h>pl.y){lv--;document.getElementById('lives').textContent=lv;e.dead=true;if(lv<=0){ov=true;document.getElementById('ov').classList.add('show');}}});en=en.filter(function(e){return !e.dead;});}
function draw(){x.fillStyle='#000';x.fillRect(0,0,W,H);x.fillStyle='#22c55e';x.fillRect(pl.x,pl.y,pl.w,pl.h);x.fillStyle='#facc15';bl.forEach(function(b){x.fillRect(b.x-2,b.y,4,8);});x.fillStyle='#ef4444';en.forEach(function(e){x.fillRect(e.x,e.y,e.w,e.h);});}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,20);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')mv(-1);if(e.key==='ArrowRight')mv(1);if(e.key===' ')sh();});
rst();
`, "space-war");
}

function laser(): string {
  return wrap("Laser", `
<h1>🔴 <span>Laser</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="500" height="500"></canvas>
<div class="controls"><button ontouchstart="sh();event.preventDefault()" onclick="sh()" style="width:200px">TIRER</button></div>
<div class="overlay" id="ov"><h2>Game Over</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var pl,lasers,en,sc,ov,loop,t;
function init(){pl={x:W/2-15,y:H-40,w:30,h:30};lasers=[];en=[];sc=0;ov=false;t=0;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function sh(){if(ov)return;lasers.push({x:pl.x+15,y:pl.y,vy:-12,life:60});}
window.sh=sh;
function upd(){t++;if(t%50===0){var ex=Math.random()*(W-30);var ey=-30;var ehp=3+Math.floor(sc/100);en.push({x:ex,y:ey,w:30,h:30,vx:(Math.random()-0.5)*2,hp:ehp,maxHp:ehp});}lasers.forEach(function(l){l.y+=l.vy;l.life--;});lasers=lasers.filter(function(l){return l.life>0&&l.y>0;});en.forEach(function(e){e.x+=e.vx;if(e.x<0||e.x+e.w>W)e.vx*=-1;e.y+=1;});lasers.forEach(function(l){en.forEach(function(e){if(e.hp<=0)return;if(Math.hypot(l.x-e.x-15,l.y-e.y-15)<20){e.hp--;l.life=0;if(e.hp<=0){sc+=30;document.getElementById('score').textContent=sc;}}});});lasers=lasers.filter(function(l){return l.life>0;});en=en.filter(function(e){return e.hp>0;});en.forEach(function(e){if(e.y+e.h>pl.y){ov=true;document.getElementById('ov').classList.add('show');}});}
function draw(){x.fillStyle='#0a0a1a';x.fillRect(0,0,W,H);x.fillStyle='#22c55e';x.fillRect(pl.x,pl.y,pl.w,pl.h);x.fillStyle='#06b6d4';lasers.forEach(function(l){x.fillRect(l.x-2,l.y,4,10);});en.forEach(function(e){x.fillStyle='#ef4444';x.fillRect(e.x,e.y,e.w,e.h);x.fillStyle='#fff';x.fillRect(e.x-5,e.y-8,40*(e.hp/e.maxHp),3);});}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,20);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key===' ')sh();});
c.addEventListener('click',sh);
rst();
`, "laser");
}

function bubbles(): string {
  return wrap("Bulles", `
<h1>🫧 <span>Bulles</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Temps : <strong id="time">30</strong>s</span></div>
<div id="bd" style="width:min(600px,92vw);height:500px;background:linear-gradient(180deg,#001a3a,#000);border-radius:16px;position:relative;overflow:hidden;border:2px solid #06b6d4"></div>
<div class="overlay" id="ov"><h2>Terminé</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var sc,t,ov,timer,interval;
function init(){sc=0;t=30;ov=false;document.getElementById('score').textContent='0';document.getElementById('time').textContent='30';document.getElementById('bd').innerHTML='';document.getElementById('ov').classList.remove('show');if(timer)clearInterval(timer);if(interval)clearInterval(interval);timer=setInterval(function(){if(ov)return;t--;document.getElementById('time').textContent=t;if(t<=0){ov=true;document.getElementById('fin').textContent=sc;document.getElementById('ov').classList.add('show');clearInterval(interval);}},1000);interval=setInterval(spawn,350);}
function spawn(){if(ov)return;var bd=document.getElementById('bd');var b=document.createElement('div');var size=20+Math.random()*40;b.style.cssText='position:absolute;width:'+size+'px;height:'+size+'px;background:radial-gradient(circle,rgba(6,182,212,0.8),rgba(6,182,212,0.2));border-radius:50%;cursor:pointer;left:'+Math.random()*85+'%;bottom:-60px;border:2px solid rgba(255,255,255,0.5);transition:bottom 3s linear';bd.appendChild(b);setTimeout(function(){b.style.bottom='110%';},10);b.onclick=function(){sc+=10;document.getElementById('score').textContent=sc;b.remove();};b.ontouchstart=function(e){e.preventDefault();sc+=10;document.getElementById('score').textContent=sc;b.remove();};setTimeout(function(){if(b.parentNode)b.remove();},3100);}
function rst(){init();}
window.rst=rst;init();
`, "bubbles");
}

function fruitNinja(): string {
  return wrap("Fruit Ninja", `
<h1>🍉 <span>Fruit Ninja</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Vies : <strong id="lives">3</strong></span></div>
<div id="bd" style="width:min(600px,92vw);height:500px;background:#0a0a0a;border-radius:16px;position:relative;overflow:hidden;border:2px solid #ef4444"></div>
<div class="overlay" id="ov"><h2>Game Over</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var sc,lv,ov,interval,spawnI;
var EMO=['🍎','🍊','🍋','🍉','🍇','🍓','🥝','🍑','🍒'];
function init(){sc=0;lv=3;ov=false;document.getElementById('score').textContent='0';document.getElementById('lives').textContent='3';document.getElementById('bd').innerHTML='';document.getElementById('ov').classList.remove('show');if(spawnI)clearInterval(spawnI);spawnI=setInterval(spawn,600);}
function spawn(){if(ov)return;var bd=document.getElementById('bd');var r=bd.getBoundingClientRect();var em=EMO[Math.floor(Math.random()*EMO.length)];var isBomb=Math.random()<0.15;var b=document.createElement('div');b.style.cssText='position:absolute;font-size:50px;cursor:pointer;left:'+Math.random()*70+'%;bottom:-70px;transition:bottom 2s linear';b.textContent=isBomb?'💣':em;bd.appendChild(b);setTimeout(function(){b.style.bottom='110%';},10);b.onclick=function(){if(isBomb){lv--;document.getElementById('lives').textContent=lv;if(lv<=0){ov=true;document.getElementById('fin').textContent=sc;document.getElementById('ov').classList.add('show');clearInterval(spawnI);}}else{sc+=10;document.getElementById('score').textContent=sc;}b.remove();};b.ontouchstart=function(e){e.preventDefault();b.onclick();};setTimeout(function(){if(b.parentNode){if(!isBomb){lv--;document.getElementById('lives').textContent=lv;if(lv<=0){ov=true;document.getElementById('fin').textContent=sc;document.getElementById('ov').classList.add('show');clearInterval(spawnI);}}b.remove();}},2100);}
function rst(){init();}
window.rst=rst;init();
`, "fruit-ninja");
}

function minesweeperPlus(): string {
  return wrap("Démineur+", `
<h1>💣 <span>Démineur+</span></h1>
<div class="stats"><span>Drapeaux : <strong id="flags">0</strong></span><span>Temps : <strong id="time">0</strong>s</span></div>
<div id="bd" style="display:grid;grid-template-columns:repeat(10,min(35px,9vw));gap:3px;background:#1a1a1a;padding:10px;border-radius:12px;border:2px solid #ef4444"></div>
<div class="overlay" id="ov"><h2 id="ttl">Boom !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var SIZE=10,MINES=15,grid,revealed,flags,over,timer,sec;
function init(){grid=[];revealed=[];flags=[];over=false;sec=0;document.getElementById('flags').textContent='0';document.getElementById('time').textContent='0';document.getElementById('ov').classList.remove('show');for(var y=0;y<SIZE;y++){grid[y]=[];revealed[y]=[];flags[y]=[];for(var x=0;x<SIZE;x++){grid[y][x]=0;revealed[y][x]=false;flags[y][x]=false;}}var placed=0;while(placed<MINES){var mx=Math.floor(Math.random()*SIZE),my=Math.floor(Math.random()*SIZE);if(grid[my][mx]!==-1){grid[my][mx]=-1;placed++;}}for(var y=0;y<SIZE;y++)for(var x=0;x<SIZE;x++){if(grid[y][x]===-1)continue;var cnt=0;for(var dy=-1;dy<=1;dy++)for(var dx=-1;dx<=1;dx++){var ny=y+dy,nx=x+dx;if(ny>=0&&ny<SIZE&&nx>=0&&nx<SIZE&&grid[ny][nx]===-1)cnt++;}grid[y][x]=cnt;}if(timer)clearInterval(timer);timer=setInterval(function(){if(!over){sec++;document.getElementById('time').textContent=sec;}},1000);render();}
function render(){var b=document.getElementById('bd');b.innerHTML='';for(var y=0;y<SIZE;y++)for(var x=0;x<SIZE;x++){var cc=document.createElement('div');var v=grid[y][x],r=revealed[y][x],fl=flags[y][x];var col='#2a2a2a';var txt='';if(r){if(v===-1){col='#ef4444';txt='💣';}else{col='#3a3a3a';txt=v>0?v:'';}}else if(fl){col='#facc15';txt='🚩';}cc.style.cssText='aspect-ratio:1;background:'+col+';border-radius:4px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:clamp(11px,2vw,16px);cursor:pointer;color:'+(v===1?'#3b82f6':v===2?'#22c55e':v===3?'#ef4444':'#fff');cc.textContent=txt;cc.onclick=function(yy,xx){return function(){rev(yy,xx);};}(y,x);cc.oncontextmenu=function(yy,xx){return function(e){e.preventDefault();flg(yy,xx);};}(y,x);cc.ontouchstart=function(yy,xx){return function(e){e.preventDefault();var t=e.touches[0];var rect=cc.getBoundingClientRect();if(t.clientX-rect.left>rect.width/2)flg(yy,xx);else rev(yy,xx);};}(y,x);b.appendChild(cc);}}
function rev(y,x){if(over||revealed[y][x]||flags[y][x])return;revealed[y][x]=true;if(grid[y][x]===-1){over=true;document.getElementById('ttl').textContent='💥 Boom !';document.getElementById('ov').classList.add('show');}else if(grid[y][x]===0){for(var dy=-1;dy<=1;dy++)for(var dx=-1;dx<=1;dx++){var ny=y+dy,nx=x+dx;if(ny>=0&&ny<SIZE&&nx>=0&&nx<SIZE&&!revealed[ny][nx])rev(ny,nx);}}render();if(!over){var win=true;for(var yy=0;yy<SIZE;yy++)for(var xx=0;xx<SIZE;xx++){if(grid[yy][xx]!==-1&&!revealed[yy][xx])win=false;}if(win){over=true;document.getElementById('ttl').textContent='🎉 Victoire !';document.getElementById('ov').classList.add('show');}}}
function flg(y,x){if(over||revealed[y][x])return;flags[y][x]=!flags[y][x];var f=0;for(var yy=0;yy<SIZE;yy++)for(var xx=0;xx<SIZE;xx++)if(flags[yy][xx])f++;document.getElementById('flags').textContent=f;render();}
function rst(){init();}
window.rst=rst;init();
`, "minesweeper-plus");
}

function tetrisPlus(): string {
  return wrap("Tetris+", `
<h1>🧩 <span>Tetris+</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Lignes : <strong id="lines">0</strong></span></div>
<canvas id="g" width="300" height="600" style="width:min(300px,60vw)"></canvas>
<div class="controls"><button ontouchstart="act('l');event.preventDefault()" onclick="act('l')">←</button><button ontouchstart="act('r');event.preventDefault()" onclick="act('r')">↻</button><button ontouchstart="act('p');event.preventDefault()" onclick="act('p')">→</button><button ontouchstart="act('d');event.preventDefault()" onclick="act('d')">↓</button></div>
<div class="overlay" id="ov"><h2>Game Over</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),COLS=10,ROWS=20,B=c.width/COLS;
var board,piece,px,py,sc,lines,ov,loop;
var SHAPES=[[[1,1,1,1]],[[1,1],[1,1]],[[0,1,0],[1,1,1]],[[1,0,0],[1,1,1]],[[0,0,1],[1,1,1]],[[0,1,1],[1,1,0]],[[1,1,0],[0,1,1]]];
var COLORS=['#06b6d4','#facc15','#a855f7','#3b82f6','#f97316','#22c55e','#ef4444'];
function init(){board=[];for(var i=0;i<ROWS;i++){board[i]=[];for(var j=0;j<COLS;j++)board[i][j]=0;}sc=0;lines=0;ov=false;document.getElementById('score').textContent='0';document.getElementById('lines').textContent='0';document.getElementById('ov').classList.remove('show');newP();}
function newP(){var i=Math.floor(Math.random()*SHAPES.length);piece={shape:SHAPES[i].map(function(r){return r.slice();}),color:COLORS[i]};px=Math.floor((COLS-piece.shape[0].length)/2);py=0;if(coll())end();}
function coll(){for(var y=0;y<piece.shape.length;y++)for(var x=0;x<piece.shape[y].length;x++){if(piece.shape[y][x]){var nx=px+x,ny=py+y;if(nx<0||nx>=COLS||ny>=ROWS)return true;if(ny>=0&&board[ny][nx])return true;}}return false;}
function merge(){for(var y=0;y<piece.shape.length;y++)for(var x=0;x<piece.shape[y].length;x++)if(piece.shape[y][x])board[py+y][px+x]=piece.color;}
function clr(){var cnt=0;for(var y=ROWS-1;y>=0;y--){if(board[y].every(function(c){return c;})){board.splice(y,1);board.unshift([]);for(var j=0;j<COLS;j++)board[0][j]=0;cnt++;y++;}}if(cnt){sc+=cnt*100;lines+=cnt;document.getElementById('score').textContent=sc;document.getElementById('lines').textContent=lines;}}
function draw(){x.fillStyle='#000';x.fillRect(0,0,c.width,c.height);for(var y=0;y<ROWS;y++)for(var xx=0;xx<COLS;xx++){if(board[y][xx]){x.fillStyle=board[y][xx];x.fillRect(xx*B+1,y*B+1,B-2,B-2);}}if(piece){for(var y=0;y<piece.shape.length;y++)for(var xx=0;xx<piece.shape[y].length;xx++){if(piece.shape[y][xx]){x.fillStyle=piece.color;x.fillRect((px+xx)*B+1,(py+y)*B+1,B-2,B-2);}}}}
function act(a){if(ov||!piece)return;if(a==='l'){px--;if(coll())px++;}else if(a==='r'){px++;if(coll())px--;}else if(a==='d'){py++;if(coll()){py--;merge();clr();newP();}}else if(a==='p'){var r=piece.shape[0].map(function(_,i){return piece.shape.map(function(row){return row[i];}).reverse();});var old=piece.shape;piece.shape=r;if(coll())piece.shape=old;}draw();}
function tick(){if(!ov){py++;if(coll()){py--;merge();clr();newP();}draw();}}
function end(){ov=true;document.getElementById('ov').classList.add('show');}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,500);draw();}
window.act=act;window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')act('l');if(e.key==='ArrowRight')act('p');if(e.key==='ArrowUp')act('r');if(e.key==='ArrowDown')act('d');});
rst();
`, "tetris-plus");
}

function match4(): string {
  return wrap("Match 4", `
<h1>💠 <span>Match 4</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<div id="bd" style="display:grid;grid-template-columns:repeat(7,min(50px,12vw));gap:4px;background:#1a1a1a;padding:12px;border-radius:12px;border:2px solid #a855f7"></div>
<div class="overlay" id="ov"><h2>Terminé</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var EMO=['🔴','🔵','🟢','🟡','🟣'],N=7,grid,sel,sc;
function init(){grid=[];for(var y=0;y<N;y++){grid[y]=[];for(var x=0;x<N;x++)grid[y][x]=Math.floor(Math.random()*5);}sel=null;sc=0;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');render();}
function render(){var b=document.getElementById('bd');b.innerHTML='';grid.forEach(function(row,y){row.forEach(function(v,x){var cc=document.createElement('div');var bg=sel&&sel.y===y&&sel.x===x?'#facc15':'#2a2a2a';cc.style.cssText='aspect-ratio:1;background:'+bg+';border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:clamp(18px,4vw,28px);cursor:pointer';cc.textContent=EMO[v];cc.onclick=function(){pick(y,x);};b.appendChild(cc);});});}
function pick(y,x){if(sel===null){sel={y:y,x:x};render();return;}if(sel.y===y&&sel.x===x){sel=null;render();return;}var dy=Math.abs(sel.y-y),dx=Math.abs(sel.x-x);if(dy+dx!==1){sel={y:y,x:x};render();return;}var tmp=grid[y][x];grid[y][x]=grid[sel.y][sel.x];grid[sel.y][sel.x]=tmp;checkMatches();sel=null;render();}
function checkMatches(){var changed=true;while(changed){changed=false;for(var y=0;y<N;y++)for(var x=0;x<N-3;x++){if(grid[y][x]===grid[y][x+1]&&grid[y][x]===grid[y][x+2]&&grid[y][x]===grid[y][x+3]){for(var i=0;i<4;i++)grid[y][x+i]=Math.floor(Math.random()*5);sc+=40;changed=true;}}for(var x=0;x<N;x++)for(var y=0;y<N-3;y++){if(grid[y][x]===grid[y+1][x]&&grid[y][x]===grid[y+2][x]&&grid[y][x]===grid[y+3][x]){for(var i=0;i<4;i++)grid[y+i][x]=Math.floor(Math.random()*5);sc+=40;changed=true;}}}document.getElementById('score').textContent=sc;}
function rst(){init();}
window.rst=rst;init();
`, "match4");
}

function bejeweled(): string {
  return wrap("Bejeweled", `
<h1>💎 <span>Bejeweled</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<div id="bd" style="display:grid;grid-template-columns:repeat(8,min(45px,11vw));gap:4px;background:#1a1a1a;padding:12px;border-radius:12px;border:2px solid #ec4899"></div>
<div class="overlay" id="ov"><h2>Terminé</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var EMO=['💎','🔮','⭐','🌟','✨','💠','🎇','🔱'],N=8,grid,sel,sc;
function init(){grid=[];for(var y=0;y<N;y++){grid[y]=[];for(var x=0;x<N;x++)grid[y][x]=Math.floor(Math.random()*8);}sel=null;sc=0;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');render();}
function render(){var b=document.getElementById('bd');b.innerHTML='';grid.forEach(function(row,y){row.forEach(function(v,x){var cc=document.createElement('div');var bg=sel&&sel.y===y&&sel.x===x?'#facc15':'#2a2a2a';cc.style.cssText='aspect-ratio:1;background:'+bg+';border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:clamp(14px,3vw,22px);cursor:pointer';cc.textContent=EMO[v];cc.onclick=function(){pick(y,x);};b.appendChild(cc);});});}
function pick(y,x){if(sel===null){sel={y:y,x:x};render();return;}if(sel.y===y&&sel.x===x){sel=null;render();return;}var dy=Math.abs(sel.y-y),dx=Math.abs(sel.x-x);if(dy+dx!==1){sel={y:y,x:x};render();return;}var tmp=grid[y][x];grid[y][x]=grid[sel.y][sel.x];grid[sel.y][sel.x]=tmp;checkMatches();sel=null;render();}
function checkMatches(){var ch=true;while(ch){ch=false;for(var y=0;y<N;y++)for(var x=0;x<N-2;x++){if(grid[y][x]===grid[y][x+1]&&grid[y][x]===grid[y][x+2]){for(var i=0;i<3;i++)grid[y][x+i]=Math.floor(Math.random()*8);sc+=30;ch=true;}}for(var x=0;x<N;x++)for(var y=0;y<N-2;y++){if(grid[y][x]===grid[y+1][x]&&grid[y][x]===grid[y+2][x]){for(var i=0;i<3;i++)grid[y+i][x]=Math.floor(Math.random()*8);sc+=30;ch=true;}}}document.getElementById('score').textContent=sc;}
function rst(){init();}
window.rst=rst;init();
`, "bejeweled");
}

function lightsOut(): string {
  return wrap("Lights Out", `
<h1>💡 <span>Lights Out</span></h1>
<div class="stats"><span>Coups : <strong id="moves">0</strong></span></div>
<div id="bd" style="display:grid;grid-template-columns:repeat(5,min(60px,15vw));gap:6px;background:#1a1a1a;padding:12px;border-radius:12px;border:2px solid #facc15"></div>
<div class="overlay" id="ov"><h2>🎉 Résolu !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var N=5,grid,moves,ov;
function init(){grid=[];for(var y=0;y<N;y++){grid[y]=[];for(var x=0;x<N;x++)grid[y][x]=Math.random()<0.5;}moves=0;ov=false;document.getElementById('moves').textContent='0';document.getElementById('ov').classList.remove('show');render();}
function render(){var b=document.getElementById('bd');b.innerHTML='';grid.forEach(function(row,y){row.forEach(function(v,x){var cc=document.createElement('div');cc.style.cssText='aspect-ratio:1;background:'+(v?'#facc15':'#2a2a2a')+';border-radius:8px;cursor:pointer;transition:background .2s';cc.onclick=function(){toggle(y,x);};b.appendChild(cc);});});}
function toggle(y,x){if(ov)return;var dirs=[[0,0],[0,1],[0,-1],[1,0],[-1,0]];dirs.forEach(function(d){var ny=y+d[0],nx=x+d[1];if(ny>=0&&ny<N&&nx>=0&&nx<N)grid[ny][nx]=!grid[ny][nx];});moves++;document.getElementById('moves').textContent=moves;render();checkWin();}
function checkWin(){for(var y=0;y<N;y++)for(var x=0;x<N;x++)if(grid[y][x])return;ov=true;setTimeout(function(){document.getElementById('ov').classList.add('show');},300);}
function rst(){init();}
window.rst=rst;init();
`, "lights-out");
}

function pipedream(): string {
  return wrap("Pipe Dream", `
<h1>🔧 <span>Pipe Dream</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<div id="bd" style="display:grid;grid-template-columns:repeat(8,min(45px,11vw));gap:3px;background:#1a1a1a;padding:12px;border-radius:12px;border:2px solid #06b6d4"></div>
<div class="overlay" id="ov"><h2>Terminé</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var N=8,grid,pipeRow,sc,ov,timer;
var EMO=['⬜','↔️','↕️','↘️','↙️','↗️','↖️'];
function init(){grid=[];for(var y=0;y<N;y++){grid[y]=[];for(var x=0;x<N;x++)grid[y][x]=0;}pipeRow=0;sc=0;ov=false;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');if(timer)clearInterval(timer);timer=setInterval(function(){if(ov)return;pipeRow++;if(pipeRow>=N){ov=true;document.getElementById('ov').classList.add('show');}},3000);render();}
function render(){var b=document.getElementById('bd');b.innerHTML='';for(var y=0;y<N;y++)for(var x=0;x<N;x++){var cc=document.createElement('div');var v=grid[y][x];var bg=y===pipeRow?'#3a2a1a':'#2a2a2a';cc.style.cssText='aspect-ratio:1;background:'+bg+';border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:18px;cursor:pointer';cc.textContent=EMO[v];cc.onclick=function(yy,xx){return function(){cycle(yy,xx);};}(y,x);b.appendChild(cc);}}
function cycle(y,x){if(ov||y!==pipeRow)return;grid[y][x]=(grid[y][x]+1)%7;sc+=5;document.getElementById('score').textContent=sc;render();}
function rst(){init();}
window.rst=rst;init();
`, "pipe-dream");
}

function hexagon(): string {
  return wrap("Hexagones", `
<h1>⬡ <span>Hexagones</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<div id="bd" style="display:grid;grid-template-columns:repeat(7,min(50px,12vw));gap:4px;background:#1a1a1a;padding:12px;border-radius:12px;border:2px solid #a855f7"></div>
<div class="overlay" id="ov"><h2>Terminé</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var EMO=['🟪','🟩','🟦','🟨','🟥'],N=7,grid,sel,sc;
function init(){grid=[];for(var y=0;y<N;y++){grid[y]=[];for(var x=0;x<N;x++)grid[y][x]=Math.floor(Math.random()*5);}sel=null;sc=0;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');render();}
function render(){var b=document.getElementById('bd');b.innerHTML='';grid.forEach(function(row,y){row.forEach(function(v,x){var cc=document.createElement('div');var bg=sel&&sel.y===y&&sel.x===x?'#facc15':'#2a2a2a';cc.style.cssText='aspect-ratio:1;background:'+bg+';border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;cursor:pointer';cc.textContent=EMO[v];cc.onclick=function(){pick(y,x);};b.appendChild(cc);});});}
function pick(y,x){if(sel===null){sel={y:y,x:x};render();return;}if(sel.y===y&&sel.x===x){sel=null;render();return;}var dy=Math.abs(sel.y-y),dx=Math.abs(sel.x-x);if(dy+dx!==1){sel={y:y,x:x};render();return;}var tmp=grid[y][x];grid[y][x]=grid[sel.y][sel.x];grid[sel.y][sel.x]=tmp;checkMatches();sel=null;render();}
function checkMatches(){for(var y=0;y<N;y++)for(var x=0;x<N-2;x++){if(grid[y][x]===grid[y][x+1]&&grid[y][x]===grid[y][x+2]){for(var i=0;i<3;i++)grid[y][x+i]=Math.floor(Math.random()*5);sc+=30;}}for(var x=0;x<N;x++)for(var y=0;y<N-2;y++){if(grid[y][x]===grid[y+1][x]&&grid[y][x]===grid[y+2][x]){for(var i=0;i<3;i++)grid[y+i][x]=Math.floor(Math.random()*5);sc+=30;}}document.getElementById('score').textContent=sc;}
function rst(){init();}
window.rst=rst;init();
`, "hexagon");
}

function jigsaw(): string {
  return wrap("Puzzle", `
<h1>🧩 <span>Puzzle</span></h1>
<div class="stats"><span>Coups : <strong id="moves">0</strong></span></div>
<div id="bd" style="display:grid;grid-template-columns:repeat(4,min(80px,20vw));gap:4px;background:#1a1a1a;padding:12px;border-radius:12px;border:2px solid #22c55e"></div>
<div class="overlay" id="ov"><h2>🎉 Résolu !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var N=4,tiles,moves,ov;
function init(){tiles=[];for(var i=1;i<=N*N-1;i++)tiles.push(i);tiles.push(0);for(var i=0;i<300;i++){var blank=tiles.indexOf(0);var r=Math.floor(blank/N),c2=blank%N;var dirs=[[0,1],[1,0],[0,-1],[-1,0]];var opts=dirs.map(function(d){return {r:r+d[0],c:c2+d[1]};}).filter(function(p){return p.r>=0&&p.r<N&&p.c>=0&&p.c<N;});var p=opts[Math.floor(Math.random()*opts.length)];var idx=p.r*N+p.c;tiles[blank]=tiles[idx];tiles[idx]=0;}moves=0;ov=false;document.getElementById('moves').textContent='0';document.getElementById('ov').classList.remove('show');render();}
function render(){var b=document.getElementById('bd');b.innerHTML='';tiles.forEach(function(v,i){var cc=document.createElement('div');cc.style.cssText='aspect-ratio:1;background:'+(v?'#22c55e':'#1a1a1a')+';color:#fff;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:clamp(20px,5vw,28px);cursor:pointer';cc.textContent=v||'';cc.onclick=function(){click(i);};b.appendChild(cc);});}
function click(i){var blank=tiles.indexOf(0);var r1=Math.floor(i/N),c1=i%N,r2=Math.floor(blank/N),c2=blank%N;if(Math.abs(r1-r2)+Math.abs(c1-c2)!==1)return;tiles[blank]=tiles[i];tiles[i]=0;moves++;document.getElementById('moves').textContent=moves;render();if(win()){ov=true;setTimeout(function(){document.getElementById('ov').classList.add('show');},300);}}
function win(){for(var i=0;i<N*N-1;i++)if(tiles[i]!==i+1)return false;return true;}
function rst(){init();}
window.rst=rst;init();
`, "jigsaw");
}

function numberSort(): string {
  return wrap("Tri de Nombres", `
<h1>🔢 <span>Tri</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<div id="bd" style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;padding:20px;background:#1a1a1a;border-radius:12px;max-width:500px"></div>
<div class="overlay" id="ov"><h2>🎉 Bravo !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var nums,selected,sc,ov;
function init(){nums=[];for(var i=0;i<8;i++)nums.push(Math.floor(Math.random()*100)+1);selected=[];sc=0;ov=false;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');render();}
function render(){var b=document.getElementById('bd');b.innerHTML='';nums.forEach(function(n,i){var cc=document.createElement('div');var isSel=selected.indexOf(i)>=0;cc.style.cssText='padding:16px 20px;background:'+(isSel?'#facc15':'#2a2a2a')+';color:'+(isSel?'#000':'#fff')+';border-radius:10px;font-weight:900;font-size:24px;cursor:pointer;transition:all .2s';cc.textContent=n;cc.onclick=function(){pick(i);};b.appendChild(cc);});}
function pick(i){if(ov)return;if(selected.length===0){selected=[i];render();return;}if(selected.length===1){var a=selected[0];var tmp=nums[a];nums[a]=nums[i];nums[i]=tmp;selected=[];sc++;document.getElementById('score').textContent=sc;render();if(sorted()){ov=true;setTimeout(function(){document.getElementById('ov').classList.add('show');},300);}}}
function sorted(){for(var i=1;i<nums.length;i++)if(nums[i]<nums[i-1])return false;return true;}
function rst(){init();}
window.rst=rst;init();
`, "number-sort");
}

function chessPuzzle2(): string {
  return wrap("Échecs+", `
<h1>♟️ <span>Échecs Puzzle</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<div id="bd" style="display:grid;grid-template-columns:repeat(8,min(45px,11vw));gap:2px;background:#1a1a1a;padding:12px;border-radius:12px;border:2px solid #a855f7"></div>
<div class="overlay" id="ov"><h2>Terminé</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var N=8,board,sel,sc,ov,target;
function init(){board=[];for(var y=0;y<N;y++){board[y]=[];for(var x=0;x<N;x++)board[y][x]='';}board[7][4]='♔';target={y:Math.floor(Math.random()*N),x:Math.floor(Math.random()*N)};sel=null;sc=0;ov=false;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');render();}
function render(){var b=document.getElementById('bd');b.innerHTML='';for(var y=0;y<N;y++)for(var x=0;x<N;x++){var cc=document.createElement('div');var isTarget=y===target.y&&x===target.x;var bg=(y+x)%2===0?'#f5f5dc':'#8b4513';if(sel&&sel.y===y&&sel.x===x)bg='#facc15';if(isTarget)bg='#22c55e';cc.style.cssText='aspect-ratio:1;background:'+bg+';display:flex;align-items:center;justify-content:center;font-size:28px;cursor:pointer;color:#000';cc.textContent=board[y][x];cc.onclick=function(yy,xx){return function(){pick(yy,xx);};}(y,x);b.appendChild(cc);}}
function pick(y,x){if(ov)return;if(sel===null){if(board[y][x])sel={y:y,x:x};render();return;}var dx=Math.abs(sel.x-x),dy=Math.abs(sel.y-y);if((dx===1&&dy===0)||(dx===0&&dy===1)||(dx===1&&dy===1)){board[y][x]=board[sel.y][sel.x];board[sel.y][sel.x]='';sel=null;sc++;document.getElementById('score').textContent=sc;if(y===target.y&&x===target.x){ov=true;setTimeout(function(){document.getElementById('ov').classList.add('show');},300);}}else{sel={y:y,x:x};}render();}
function rst(){init();}
window.rst=rst;init();
`, "chess-puzzle2");
}

function checkers2(): string {
  return wrap("Dames+", `
<h1>🔴 <span>Dames+</span></h1>
<div class="stats"><span id="turn">Aux blancs</span></div>
<div id="bd" style="display:grid;grid-template-columns:repeat(8,min(45px,11vw));gap:2px;background:#1a1a1a;padding:12px;border-radius:12px;border:2px solid #ef4444"></div>
<div class="overlay" id="ov"><h2 id="ttl">Gagné !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var N=8,board,sel,turn,ov;
function init(){board=[];for(var y=0;y<N;y++){board[y]=[];for(var x=0;x<N;x++){if((x+y)%2===1){if(y<3)board[y][x]='B';else if(y>=N-3)board[y][x]='W';else board[y][x]='';}else board[y][x]='X';}}sel=null;turn='W';ov=false;document.getElementById('turn').textContent='Aux blancs';document.getElementById('ov').classList.remove('show');render();}
function render(){var b=document.getElementById('bd');b.innerHTML='';for(var y=0;y<N;y++)for(var x=0;x<N;x++){var v=board[y][x];var cc=document.createElement('div');var bg='#2a2a2a';if(v==='X')bg='#1a1a1a';if(sel&&sel.y===y&&sel.x===x)bg='#facc15';cc.style.cssText='aspect-ratio:1;background:'+bg+';display:flex;align-items:center;justify-content:center;font-size:20px;cursor:pointer;color:'+(v==='W'?'#fff':'#000');cc.textContent=v==='W'||v==='B'?(v==='W'?'●':'○'):'';cc.onclick=function(yy,xx){return function(){pick(yy,xx);};}(y,x);b.appendChild(cc);}}
function pick(y,x){if(ov)return;if(sel){var dy=y-sel.y,dx=x-sel.x;if(Math.abs(dy)===1&&Math.abs(dx)===1&&board[y][x]===''){board[y][x]=board[sel.y][sel.x];board[sel.y][sel.x]='';sel=null;turn=turn==='W'?'B':'W';document.getElementById('turn').textContent=turn==='W'?'Aux blancs':'Aux noirs';render();check();return;}}if(board[y][x]===turn){sel={y:y,x:x};render();}}
function check(){var w=0,b=0;for(var y=0;y<N;y++)for(var x=0;x<N;x++){if(board[y][x]==='W')w++;if(board[y][x]==='B')b++;}if(w===0){ov=true;document.getElementById('ttl').textContent='Noirs gagnent';document.getElementById('ov').classList.add('show');}if(b===0){ov=true;document.getElementById('ttl').textContent='Blancs gagnent';document.getElementById('ov').classList.add('show');}}
function rst(){init();}
window.rst=rst;init();
`, "checkers2");
}

function go(): string {
  return wrap("Go", `
<h1>⚫ <span>Go</span></h1>
<div class="stats"><span id="turn">Noir</span></div>
<div id="bd" style="display:grid;grid-template-columns:repeat(9,min(40px,10vw));gap:1px;background:#1a1a1a;padding:8px;border-radius:12px;border:2px solid #facc15"></div>
<div class="overlay" id="ov"><h2 id="ttl">Fini !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var N=9,board,turn,ov,moves;
function init(){board=[];for(var y=0;y<N;y++){board[y]=[];for(var x=0;x<N;x++)board[y][x]='';}turn='B';moves=0;ov=false;document.getElementById('turn').textContent='Noir';document.getElementById('ov').classList.remove('show');render();}
function render(){var b=document.getElementById('bd');b.innerHTML='';for(var y=0;y<N;y++)for(var x=0;x<N;x++){var v=board[y][x];var cc=document.createElement('div');cc.style.cssText='aspect-ratio:1;background:#8b4513;display:flex;align-items:center;justify-content:center;font-size:20px;cursor:pointer;color:'+(v==='B'?'#000':v==='W'?'#fff':'');cc.textContent=v==='B'?'●':v==='W'?'●':'';cc.onclick=function(yy,xx){return function(){place(yy,xx);};}(y,x);b.appendChild(cc);}}
function place(y,x){if(ov||board[y][x])return;board[y][x]=turn;moves++;turn=turn==='B'?'W':'B';document.getElementById('turn').textContent=turn==='B'?'Noir':'Blanc';render();if(moves>=30){ov=true;var bc=0,wc=0;for(var yy=0;yy<N;yy++)for(var xx=0;xx<N;xx++){if(board[yy][xx]==='B')bc++;if(board[yy][xx]==='W')wc++;}document.getElementById('ttl').textContent=bc>wc?'Noir gagne':bc<wc?'Blanc gagne':'Nul';document.getElementById('ov').classList.add('show');}}
function rst(){init();}
window.rst=rst;init();
`, "go-simple");
}

function damier(): string {
  return wrap("Damier", `
<h1>⬛ <span>Damier</span></h1>
<div class="stats"><span>Coups : <strong id="moves">0</strong></span></div>
<div id="bd" style="display:grid;grid-template-columns:repeat(8,min(50px,12vw));gap:1px;background:#1a1a1a;padding:12px;border-radius:12px;border:2px solid #facc15"></div>
<div class="overlay" id="ov"><h2>🎉 Résolu !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var N=8,board,moves,ov;
function init(){board=[];for(var y=0;y<N;y++){board[y]=[];for(var x=0;x<N;x++)board[y][x]=(y+x)%2===0?1:0;}board[0][0]=0;moves=0;ov=false;document.getElementById('moves').textContent='0';document.getElementById('ov').classList.remove('show');render();}
function render(){var b=document.getElementById('bd');b.innerHTML='';for(var y=0;y<N;y++)for(var x=0;x<N;x++){var cc=document.createElement('div');cc.style.cssText='aspect-ratio:1;background:'+(board[y][x]?'#facc15':'#1a1a1a')+';cursor:pointer;transition:background .15s';cc.onclick=function(yy,xx){return function(){flip(yy,xx);};}(y,x);b.appendChild(cc);}}
function flip(y,x){if(ov)return;var dirs=[[0,0],[0,1],[0,-1],[1,0],[-1,0]];dirs.forEach(function(d){var ny=y+d[0],nx=x+d[1];if(ny>=0&&ny<N&&nx>=0&&nx<N)board[ny][nx]=1-board[ny][nx];});moves++;document.getElementById('moves').textContent=moves;render();var same=board[0][0];var allSame=true;for(var yy=0;yy<N;yy++)for(var xx=0;xx<N;xx++)if(board[yy][xx]!==same)allSame=false;if(allSame){ov=true;setTimeout(function(){document.getElementById('ov').classList.add('show');},300);}}
function rst(){init();}
window.rst=rst;init();
`, "damier");
}

function mazeEscape(): string {
  return wrap("Évasion", `
<h1>🏃 <span>Évasion</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="500" height="500"></canvas>
<div class="controls"><button ontouchstart="mv('l');event.preventDefault()" onclick="mv('l')">←</button><button ontouchstart="mv('u');event.preventDefault()" onclick="mv('u')">↑</button><button ontouchstart="mv('d');event.preventDefault()" onclick="mv('d')">↓</button><button ontouchstart="mv('r');event.preventDefault()" onclick="mv('r')">→</button></div>
<div class="overlay" id="ov"><h2>🎉 Évadé !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var N=15,T=33,maze,px,py,sc,ov;
function init(){maze=[];for(var y=0;y<N;y++){maze[y]=[];for(var xx=0;xx<N;xx++)maze[y][xx]=1;}var stack=[{x:0,y:0}];maze[0][0]=0;while(stack.length){var cur=stack[stack.length-1];var opts=[];[[0,2],[0,-2],[2,0],[-2,0]].forEach(function(d){var nx=cur.x+d[0],ny=cur.y+d[1];if(nx>=0&&nx<N&&ny>=0&&ny<N&&maze[ny][nx]===1)opts.push({x:nx,y:ny,dx:d[0],dy:d[1]});});if(!opts.length){stack.pop();continue;}var o=opts[Math.floor(Math.random()*opts.length)];maze[cur.y+o.dy/2][cur.x+o.dx/2]=0;maze[o.y][o.x]=0;stack.push({x:o.x,y:o.y});}px=0;py=0;sc=0;ov=false;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function mv(d){if(ov)return;var nx=px,ny=py;if(d==='l')nx--;if(d==='r')nx++;if(d==='u')ny--;if(d==='d')ny++;if(nx>=0&&nx<N&&ny>=0&&ny<N&&maze[ny][nx]===0){px=nx;py=ny;sc++;document.getElementById('score').textContent=sc;if(px===N-1&&py===N-1){ov=true;document.getElementById('ov').classList.add('show');}}}
window.mv=mv;
function draw(){x.fillStyle='#000';x.fillRect(0,0,W,H);for(var y=0;y<N;y++)for(var xx=0;xx<N;xx++){if(maze[y][xx]===1){x.fillStyle='#333';x.fillRect(xx*T,y*T,T,T);}}x.fillStyle='#22c55e';x.fillRect((N-1)*T+5,(N-1)*T+5,T-10,T-10);x.fillStyle='#facc15';x.fillRect(px*T+5,py*T+5,T-10,T-10);}
function tick(){draw();}
function rst(){init();if(window._loop2)clearInterval(window._loop2);window._loop2=setInterval(tick,50);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')mv('l');if(e.key==='ArrowRight')mv('r');if(e.key==='ArrowUp')mv('u');if(e.key==='ArrowDown')mv('d');});
rst();
`, "maze-escape");
}

function tunnel(): string {
  return wrap("Tunnel 3D", `
<h1>🌀 <span>Tunnel</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="500" height="500"></canvas>
<div class="controls"><button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button><button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button></div>
<div class="overlay" id="ov"><h2>Crash !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var px,obstacles,sc,ov,loop,speed,t;
function init(){px=W/2-20;obstacles=[];sc=0;ov=false;t=0;speed=3;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function mv(d){px+=d*25;px=Math.max(50,Math.min(W-50,px));}
window.mv=mv;
function upd(){t++;speed+=0.005;sc+=speed/10;document.getElementById('score').textContent=Math.floor(sc);obstacles.forEach(function(o){o.r+=speed;if(o.r>400)o.done=true;});obstacles=obstacles.filter(function(o){return !o.done;});if(t%40===0){var angle=Math.random()*Math.PI*2;obstacles.push({angle:angle,r:50});}obstacles.forEach(function(o){var ox=W/2+Math.cos(o.angle)*o.r;var oy=H/2+Math.sin(o.angle)*o.r;if(Math.hypot(ox-px,oy-H/2)<30){ov=true;document.getElementById('ov').classList.add('show');}});}
function draw(){x.fillStyle='#000';x.fillRect(0,0,W,H);for(var i=0;i<15;i++){var r=50+i*25;var angle=(t*0.02+i*0.1)%(Math.PI*2);x.strokeStyle='hsl('+(i*24)+',80%,60%)';x.lineWidth=2;x.beginPath();x.arc(W/2,H/2,r,0,Math.PI*2);x.stroke();}obstacles.forEach(function(o){var ox=W/2+Math.cos(o.angle)*o.r;var oy=H/2+Math.sin(o.angle)*o.r;var size=5+o.r/20;x.fillStyle='#ef4444';x.fillRect(ox-size/2,oy-size/2,size,size);});x.fillStyle='#facc15';x.fillRect(px-15,H/2-15,30,30);}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,20);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')mv(-1);if(e.key==='ArrowRight')mv(1);});
rst();
`, "tunnel");
}

function neonRunner(): string {
  return wrap("Neon Runner", `
<h1>🌈 <span>Neon</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="500" height="500"></canvas>
<div class="controls"><button ontouchstart="jump();event.preventDefault()" onclick="jump()" style="width:180px;background:#facc15;color:#000">SAUTER</button></div>
<div class="overlay" id="ov"><h2>Game Over</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var player,obstacles,sc,ov,loop,speed,t;
function init(){player={x:80,y:H-100,w:30,h:30,vy:0,onG:true};obstacles=[];sc=0;ov=false;t=0;speed=5;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function jump(){if(ov||!player.onG)return;player.vy=-13;player.onG=false;}
window.jump=jump;
function upd(){t++;player.vy+=0.7;player.y+=player.vy;player.onG=false;if(player.y+player.h>H-60){player.y=H-60-player.h;player.vy=0;player.onG=true;}obstacles.forEach(function(o){o.x-=speed;});obstacles=obstacles.filter(function(o){return o.x>-50;});if(t%50===0)obstacles.push({x:W,h:20+Math.random()*40});obstacles.forEach(function(o){if(o.passed===undefined&&o.x+20<player.x){o.passed=true;sc++;document.getElementById('score').textContent=sc;}if(player.x<o.x+20&&player.x+player.w>o.x&&player.y+player.h>H-60-o.h){ov=true;document.getElementById('ov').classList.add('show');}});speed+=0.002;}
function draw(){x.fillStyle='#0a0a1a';x.fillRect(0,0,W,H);x.strokeStyle='#facc15';x.lineWidth=2;x.beginPath();x.moveTo(0,H-60);x.lineTo(W,H-60);x.stroke();obstacles.forEach(function(o){x.fillStyle='#ec4899';x.fillRect(o.x,H-60-o.h,20,o.h);x.shadowColor='#ec4899';x.shadowBlur=15;x.fillRect(o.x,H-60-o.h,20,o.h);x.shadowBlur=0;});x.fillStyle='#06b6d4';x.shadowColor='#06b6d4';x.shadowBlur=20;x.fillRect(player.x,player.y,player.w,player.h);x.shadowBlur=0;}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,20);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key===' ')jump();});
c.addEventListener('click',jump);
rst();
`, "neon-runner");
}

function zigzag(): string {
  return wrap("Zigzag", `
<h1>⬅️ <span>Zigzag</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="500" height="500"></canvas>
<div class="controls"><button ontouchstart="flip();event.preventDefault()" onclick="flip()" style="width:200px;background:#22c55e;color:#fff">INVERSER</button></div>
<div class="overlay" id="ov"><h2>Game Over</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var ball,blocks,sc,ov,loop,dir,t;
function init(){ball={x:W/2,y:H-80,r:12};blocks=[];sc=0;ov=false;dir=1;t=0;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function flip(){if(ov)return;dir*=-1;}
window.flip=flip;
function upd(){t++;ball.x+=dir*3;ball.y-=1.5;if(ball.x<0||ball.x>W){ov=true;document.getElementById('ov').classList.add('show');}if(t%30===0)blocks.push({x:Math.random()*(W-60),y:-20,w:60,h:15});blocks.forEach(function(b){b.y+=2;});blocks=blocks.filter(function(b){return b.y<H+30;});for(var i=0;i<blocks.length;i++){var b=blocks[i];if(ball.y+ball.r>b.y&&ball.y-ball.r<b.y+b.h&&ball.x> b.x&&ball.x<b.x+b.w){if(ball.y<b.y+5){ball.y=b.y-ball.r;sc++;document.getElementById('score').textContent=sc;}}}if(ball.y>H+30){ov=true;document.getElementById('ov').classList.add('show');}}
function draw(){x.fillStyle='#0a0a0a';x.fillRect(0,0,W,H);blocks.forEach(function(b){x.fillStyle='#22c55e';x.fillRect(b.x,b.y,b.w,b.h);});x.fillStyle='#facc15';x.beginPath();x.arc(ball.x,ball.y,ball.r,0,6.3);x.fill();}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,20);}
window.rst=rst;
c.addEventListener('click',flip);
c.addEventListener('touchstart',function(e){e.preventDefault();flip();},{passive:false});
rst();
`, "zigzag");
}

function stacking(): string {
  return wrap("Empileur", `
<h1>🏗️ <span>Empileur</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="500" height="500"></canvas>
<div class="controls"><button ontouchstart="place();event.preventDefault()" onclick="place()" style="width:200px;background:#22c55e;color:#fff">POSER</button></div>
<div class="overlay" id="ov"><h2>Game Over</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var stack,current,sc,ov,loop,dir;
function init(){stack=[{x:W/2-80,y:H-40,w:160,h:25}];current={x:0,y:H-65,w:160,h:25};sc=0;ov=false;dir=1;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function place(){if(ov)return;var top=stack[stack.length-1];var overlap=Math.min(current.x+current.w,top.x+top.w)-Math.max(current.x,top.x);if(overlap<=0){ov=true;document.getElementById('fin').textContent=sc;document.getElementById('ov').classList.add('show');return;}var newX=Math.max(current.x,top.x);current.w=overlap;current.x=newX;stack.push({x:current.x,y:current.y,w:current.w,h:current.h});sc++;document.getElementById('score').textContent=sc;current={x:Math.random()<0.5?0:W-current.w,y:current.y-25,w:current.w,h:25};dir=1;}
window.place=place;
function upd(){current.x+=dir*2;if(current.x<0){current.x=0;dir=1;}if(current.x+current.w>W){current.x=W-current.w;dir=-1;}}
function draw(){x.fillStyle='#0a0a1a';x.fillRect(0,0,W,H);stack.forEach(function(s,i){x.fillStyle='hsl('+(200-i*15)+',70%,50%)';x.fillRect(s.x,s.y,s.w,s.h);});if(current){x.fillStyle='#facc15';x.fillRect(current.x,current.y,current.w,current.h);}}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,20);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key===' ')place();});
c.addEventListener('click',place);
rst();
`, "stacking");
}

function towers(): string {
  return wrap("Tours", `
<h1>🏙️ <span>Tours</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="500" height="500"></canvas>
<div class="controls"><button ontouchstart="drop();event.preventDefault()" onclick="drop()" style="width:180px;background:#22c55e;color:#fff">DÉPOSER</button></div>
<div class="overlay" id="ov"><h2>Terminé</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var blocks,current,sc,ov,loop;
function init(){blocks=[];current={x:100,y:50,w:60,h:80,vy:3};sc=0;ov=false;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function drop(){if(ov)return;var dropped=false;for(var i=blocks.length-1;i>=0;i--){if(blocks[i].x===current.x&&current.y+current.h<=blocks[i].y+5){blocks[i].h+=current.h;dropped=true;break;}}if(!dropped)blocks.push({x:current.x,y:H-80,w:60,h:80});sc++;document.getElementById('score').textContent=sc;current={x:Math.floor(Math.random()*8)*60,y:50,w:60,h:80,vy:3};if(blocks.length>=8){ov=true;setTimeout(function(){document.getElementById('ov').classList.add('show');},300);}}
window.drop=drop;
function upd(){current.vy+=0.3;current.y+=current.vy;if(current.y+current.h>H-80)current.y=H-80-current.h;for(var i=0;i<blocks.length;i++){if(blocks[i].x===current.x&&current.y+current.h>blocks[i].y){current.y=blocks[i].y-current.h;current.vy=0;break;}}}
function draw(){x.fillStyle='#0a1a2a';x.fillRect(0,0,W,H);x.strokeStyle='#2a3a4a';for(var i=0;i<8;i++){x.beginPath();x.moveTo(i*60,0);x.lineTo(i*60,H);x.stroke();}blocks.forEach(function(b){x.fillStyle='hsl('+(Math.random()*60+180)+',70%,50%)';x.fillStyle='#3b82f6';x.fillRect(b.x,b.y,b.w,b.h);});x.fillStyle='#facc15';x.fillRect(current.x,current.y,current.w,current.h);}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,20);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key===' ')drop();});
c.addEventListener('click',drop);
rst();
`, "towers");
}

function ballBounce(): string {
  return wrap("Ball Bounce", `
<h1>🎾 <span>Ball Bounce</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="500" height="500"></canvas>
<div class="controls"><button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button><button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button></div>
<div class="overlay" id="ov"><h2>Perdu</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var pad,ball,sc,ov,loop,t;
function init(){pad={x:W/2-60,y:H-40,w:120,h:15};ball={x:W/2,y:H-60,vx:3,vy:-5,r:10};sc=0;ov=false;t=0;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function mv(d){pad.x+=d*30;pad.x=Math.max(0,Math.min(W-pad.w,pad.x));}
window.mv=mv;
function upd(){t++;ball.vy+=0.15;ball.x+=ball.vx;ball.y+=ball.vy;if(ball.x-ball.r<0||ball.x+ball.r>W)ball.vx*=-1;if(ball.y-ball.r<0)ball.vy*=-1;if(ball.y+ball.r>pad.y&&ball.y-ball.r<pad.y+pad.h&&ball.x>pad.x&&ball.x<pad.x+pad.w&&ball.vy>0){ball.vy=-8-t/500;ball.vx+=(ball.x-(pad.x+pad.w/2))/20;sc+=1;document.getElementById('score').textContent=sc;}if(ball.y>H){ov=true;document.getElementById('ov').classList.add('show');}}
function draw(){x.fillStyle='#0a0a1a';x.fillRect(0,0,W,H);x.fillStyle='#22c55e';x.fillRect(pad.x,pad.y,pad.w,pad.h);x.fillStyle='#facc15';x.beginPath();x.arc(ball.x,ball.y,ball.r,0,6.3);x.fill();}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
c.addEventListener('mousemove',function(e){var r=c.getBoundingClientRect();pad.x=(e.clientX-r.left)*(W/r.width)-pad.w/2;pad.x=Math.max(0,Math.min(W-pad.w,pad.x));});
c.addEventListener('touchstart',function(e){e.preventDefault();var r=c.getBoundingClientRect();pad.x=(e.touches[0].clientX-r.left)*(W/r.width)-pad.w/2;pad.x=Math.max(0,Math.min(W-pad.w,pad.x));},{passive:false});
c.addEventListener('touchmove',function(e){e.preventDefault();var r=c.getBoundingClientRect();pad.x=(e.touches[0].clientX-r.left)*(W/r.width)-pad.w/2;pad.x=Math.max(0,Math.min(W-pad.w,pad.x));},{passive:false});
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')mv(-1);if(e.key==='ArrowRight')mv(1);});
rst();
`, "ball-bounce");
}

function arkanoid(): string {
  return wrap("Arkanoid", `
<h1>🧱 <span>Arkanoid</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Vies : <strong id="lives">3</strong></span></div>
<canvas id="g" width="480" height="500"></canvas>
<div class="controls"><button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button><button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button></div>
<div class="overlay" id="ov"><h2 id="ttl">Game Over</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var pad,ball,bricks,sc,lv,ov,loop;
function init(){pad={x:W/2-50,y:H-20,w:100,h:10};ball={x:W/2,y:H-50,dx:3,dy:-3,r:7};bricks=[];for(var r=0;r<6;r++)for(var col=0;col<8;col++)bricks.push({x:col*60+2,y:r*25+30,w:56,h:20,alive:true,clr:['#ef4444','#f59e0b','#22c55e','#3b82f6','#a855f7','#ec4899'][r]});sc=0;lv=3;ov=false;document.getElementById('score').textContent='0';document.getElementById('lives').textContent='3';document.getElementById('ov').classList.remove('show');}
function mv(d){pad.x+=d*30;pad.x=Math.max(0,Math.min(W-pad.w,pad.x));}
window.mv=mv;
function upd(){ball.x+=ball.dx;ball.y+=ball.dy;if(ball.x-ball.r<0||ball.x+ball.r>W)ball.dx*=-1;if(ball.y-ball.r<0)ball.dy*=-1;if(ball.y+ball.r>H){lv--;document.getElementById('lives').textContent=lv;if(lv<=0){ov=true;document.getElementById('ttl').textContent='Game Over';document.getElementById('ov').classList.add('show');}else{ball.x=W/2;ball.y=H-50;ball.dx=3;ball.dy=-3;}}if(ball.y+ball.r>pad.y&&ball.y-ball.r<pad.y+pad.h&&ball.x>pad.x&&ball.x<pad.x+pad.w&&ball.dy>0){ball.dy*=-1;ball.dx+=(ball.x-(pad.x+pad.w/2))/20;}bricks.forEach(function(b){if(!b.alive)return;if(ball.x>b.x&&ball.x<b.x+b.w&&ball.y>b.y&&ball.y<b.y+b.h){b.alive=false;ball.dy*=-1;sc+=10;document.getElementById('score').textContent=sc;}});if(bricks.every(function(b){return !b.alive;})){ov=true;document.getElementById('ttl').textContent='🎉 Victoire !';document.getElementById('ov').classList.add('show');}}
function draw(){x.fillStyle='#000';x.fillRect(0,0,W,H);x.fillStyle='#22c55e';x.fillRect(pad.x,pad.y,pad.w,pad.h);x.fillStyle='#fff';x.beginPath();x.arc(ball.x,ball.y,ball.r,0,6.3);x.fill();bricks.forEach(function(b){if(b.alive){x.fillStyle=b.clr;x.fillRect(b.x,b.y,b.w,b.h);}});}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')mv(-1);if(e.key==='ArrowRight')mv(1);});
c.addEventListener('mousemove',function(e){var r=c.getBoundingClientRect();pad.x=(e.clientX-r.left)*(W/r.width)-pad.w/2;pad.x=Math.max(0,Math.min(W-pad.w,pad.x));});
c.addEventListener('touchmove',function(e){e.preventDefault();var r=c.getBoundingClientRect();pad.x=(e.touches[0].clientX-r.left)*(W/r.width)-pad.w/2;pad.x=Math.max(0,Math.min(W-pad.w,pad.x));},{passive:false});
rst();
`, "arkanoid");
}

function pinball2(): string {
  return wrap("Pinball 2", `
<h1>🎱 <span>Pinball 2</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Balles : <strong id="balls">3</strong></span></div>
<canvas id="g" width="400" height="550"></canvas>
<div class="controls"><button ontouchstart="flipL();event.preventDefault()" onclick="flipL()">L</button><button ontouchstart="flipR();event.preventDefault()" onclick="flipR()">R</button></div>
<div class="overlay" id="ov"><h2>Terminé</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var ball,vx,vy,sc,balls,fl,fr,ov,loop,bumpers;
function init(){ball={x:W/2,y:80,r:9};vx=(Math.random()-0.5)*4;vy=3;sc=0;balls=3;fl=0;fr=0;ov=false;bumpers=[{x:100,y:200,r:25,sc:10},{x:W-100,y:200,r:25,sc:10},{x:W/2,y:300,r:25,sc:20},{x:70,y:420,r:20,sc:5},{x:W-70,y:420,r:20,sc:5}];document.getElementById('score').textContent='0';document.getElementById('balls').textContent='3';document.getElementById('ov').classList.remove('show');}
function flipL(){fl=20;}
function flipR(){fr=20;}
window.flipL=flipL;window.flipR=flipR;
function upd(){if(fl>0)fl--;if(fr>0)fr--;vy+=0.18;ball.x+=vx;ball.y+=vy;if(ball.x-ball.r<0||ball.x+ball.r>W){vx*=-1;ball.x=ball.x<W/2?ball.r:W-ball.r;}if(ball.y-ball.r<0){vy*=-1;ball.y=ball.r;}bumpers.forEach(function(b){var dx=ball.x-b.x,dy=ball.y-b.y;var d=Math.sqrt(dx*dx+dy*dy);if(d<b.r+ball.r){var nx=dx/d,ny=dy/d;var dot=vx*nx+vy*ny;vx-=2*dot*nx;vy-=2*dot*ny;sc+=b.sc;document.getElementById('score').textContent=sc;ball.x=b.x+nx*(b.r+ball.r+1);ball.y=b.y+ny*(b.r+ball.r+1);}});if(fl>0&&ball.x<110&&ball.y>H-80){vy=-9;vx=-3;}if(fr>0&&ball.x>W-110&&ball.y>H-80){vy=-9;vx=3;}if(ball.y>H){balls--;document.getElementById('balls').textContent=balls;if(balls<=0){ov=true;document.getElementById('fin').textContent=sc;document.getElementById('ov').classList.add('show');}else{ball={x:W/2,y:80,r:9};vx=(Math.random()-0.5)*4;vy=3;}}}
function draw(){x.fillStyle='#1a0a2e';x.fillRect(0,0,W,H);bumpers.forEach(function(b){x.fillStyle='#a855f7';x.beginPath();x.arc(b.x,b.y,b.r,0,6.3);x.fill();x.strokeStyle='#fff';x.lineWidth=3;x.stroke();});x.fillStyle='#facc15';x.beginPath();x.arc(ball.x,ball.y,ball.r,0,6.3);x.fill();x.fillStyle=fl>0?'#22c55e':'#666';x.save();x.translate(20,H-40);x.rotate(fl>0?-0.4:0);x.fillRect(0,-10,80,15);x.restore();x.fillStyle=fr>0?'#22c55e':'#666';x.save();x.translate(W-100,H-40);x.rotate(fr>0?0.4:0);x.fillRect(0,-10,80,15);x.restore();}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='a'||e.key==='A')flipL();if(e.key==='d'||e.key==='D')flipR();if(e.key==='ArrowLeft')flipL();if(e.key==='ArrowRight')flipR();});
rst();
`, "pinball2");
}

function bombDefuse(): string {
  return wrap("Désamorçage", `
<h1>💣 <span>Désamorçage</span></h1>
<div class="stats"><span>Temps : <strong id="time">30</strong>s</span><span>Score : <strong id="score">0</strong></span></div>
<div id="bd" style="text-align:center;padding:30px;background:#1a1a1a;border-radius:16px;max-width:500px"></div>
<div class="overlay" id="ov"><h2 id="ttl">Boom !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var code,guess,t,sc,ov,timer;
function init(){code='';for(var i=0;i<4;i++)code+=Math.floor(Math.random()*10);guess='';t=30;sc=0;ov=false;document.getElementById('time').textContent='30';document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');if(timer)clearInterval(timer);timer=setInterval(function(){if(ov)return;t--;document.getElementById('time').textContent=t;if(t<=0){ov=true;document.getElementById('ttl').textContent='💥 Boom ! Code : '+code;document.getElementById('ov').classList.add('show');}},1000);render();}
function render(){var h='<p style="color:#ef4444;font-size:60px;font-weight:900;margin:0 0 20px 0">'+(guess||'____').padEnd(4,'_')+'</p><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">';for(var i=0;i<=9;i++){h+='<button ontouchstart="press(\\''+i+'\\');event.preventDefault()" onclick="press(\\''+i+'\\')" style="padding:14px;background:#2a2a2a;color:#fff;border:2px solid #ef4444;border-radius:10px;cursor:pointer;font-family:inherit;font-weight:900;font-size:18px">'+i+'</button>';}h+='</div>';document.getElementById('bd').innerHTML=h;}
function press(n){if(ov)return;if(guess.length>=4)return;guess+=n;if(guess.length===4){if(guess===code){sc=Math.max(sc,t*5);document.getElementById('score').textContent=sc;t=Math.min(60,t+15);document.getElementById('time').textContent=t;code='';for(var i=0;i<4;i++)code+=Math.floor(Math.random()*10);}else{sc=Math.max(0,sc-10);document.getElementById('score').textContent=sc;}guess='';}render();}
window.press=press;
function rst(){init();}
window.rst=rst;init();
`, "bomb-defuse");
}

function safeCrack(): string {
  return wrap("Coffre-Fort", `
<h1>🔐 <span>Coffre</span></h1>
<div class="stats"><span>Essais : <strong id="tries">0</strong></span><span>Temps : <strong id="time">60</strong>s</span></div>
<div id="bd" style="text-align:center;padding:20px;background:#1a1a1a;border-radius:16px;max-width:500px"></div>
<div class="overlay" id="ov"><h2 id="ttl">Terminé</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var code,tries,t,ov,timer,guess;
function init(){code=Math.floor(Math.random()*9000)+1000;tries=0;t=60;guess=[];ov=false;document.getElementById('tries').textContent='0';document.getElementById('time').textContent='60';document.getElementById('ov').classList.remove('show');if(timer)clearInterval(timer);timer=setInterval(function(){if(ov)return;t--;document.getElementById('time').textContent=t;if(t<=0){ov=true;document.getElementById('ttl').textContent='😢 Perdu. Code : '+code;document.getElementById('ov').classList.add('show');}},1000);render();}
function render(){var h='<p style="color:#888;margin-bottom:16px">Combinaison (4 chiffres)</p><input id="inp" type="number" placeholder="0000" value="'+(guess.length?guess.join(''):'')+'" style="width:150px;padding:14px;font-size:24px;text-align:center;background:#0a0a0a;color:#facc15;border:2px solid #facc15;border-radius:12px;outline:none;letter-spacing:8px;font-weight:900" /><br><button ontouchstart="check();event.preventDefault()" onclick="check()" style="margin-top:16px;padding:14px 32px;background:#22c55e;color:#fff;border:none;border-radius:12px;font-weight:900;cursor:pointer;font-family:inherit;font-size:16px">VALIDER</button>';document.getElementById('bd').innerHTML=h;setTimeout(function(){var i=document.getElementById('inp');if(i)i.focus();},100);}
function check(){if(ov)return;var v=document.getElementById('inp').value;if(v.length!==4)return;tries++;document.getElementById('tries').textContent=tries;if(v==String(code)){ov=true;document.getElementById('ttl').textContent='🎉 Coffre ouvert !';document.getElementById('ov').classList.add('show');return;}guess=v.split('').map(Number);render();var cs=String(code).split('').map(Number);var feedback=[];for(var i=0;i<4;i++){if(guess[i]===cs[i])feedback.push('✓');else if(cs.indexOf(guess[i])>=0)feedback.push('~');else feedback.push('✗');}setTimeout(function(){var i=document.getElementById('inp');if(i)i.value='';var f=document.getElementById('bd');f.innerHTML='<p style="color:#facc15;font-size:36px;font-weight:900;margin-bottom:20px">'+feedback.join(' ')+'</p>'+f.innerHTML;},100);}
window.check=check;
document.addEventListener('keydown',function(e){if(e.key==='Enter')check();});
function rst(){init();}
window.rst=rst;init();
`, "safe-crack");
}

function typingRace(): string {
  return wrap("Course Dactylo", `
<h1>⌨️ <span>Course Dactylo</span></h1>
<div class="stats"><span>Mots : <strong id="words">0</strong></span><span>Temps : <strong id="time">60</strong>s</span></div>
<div id="bd" style="text-align:center;padding:30px;background:#1a1a1a;border-radius:16px;max-width:500px"></div>
<div class="overlay" id="ov"><h2>Terminé</h2><p>Mots : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var WORDS=['le','la','chat','chien','maison','arbre','soleil','livre','fleur','table','pomme','jardin','voiture','fenêtre','ciel','étoile','plage','montagne','rivière','oiseau'];
var words,t,ov,timer,cur;
function init(){words=0;t=60;ov=false;document.getElementById('words').textContent='0';document.getElementById('time').textContent='60';document.getElementById('ov').classList.remove('show');if(timer)clearInterval(timer);timer=setInterval(function(){if(ov)return;t--;document.getElementById('time').textContent=t;if(t<=0){ov=true;document.getElementById('fin').textContent=words;document.getElementById('ov').classList.add('show');}},1000);next();}
function next(){cur=WORDS[Math.floor(Math.random()*WORDS.length)];var h='<p style="color:#888;margin-bottom:16px">Tape ce mot :</p><p style="color:#facc15;font-size:42px;font-weight:900;margin:0 0 20px 0">'+cur+'</p><input id="inp" type="text" autocomplete="off" style="width:250px;padding:14px;font-size:20px;background:#0a0a0a;color:#fff;border:2px solid #22c55e;border-radius:12px;outline:none;text-align:center" />';document.getElementById('bd').innerHTML=h;setTimeout(function(){var i=document.getElementById('inp');if(i)i.focus();},50);}
document.addEventListener('input',function(e){if(e.target.id==='inp'){if(e.target.value.trim()===cur){words++;document.getElementById('words').textContent=words;next();}}});
function rst(){init();}
window.rst=rst;init();
`, "typing-race");
}

function cryptarithm(): string {
  return wrap("Cryptarithme", `
<h1>🔢 <span>Cryptarithme</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<div id="bd" style="text-align:center;padding:30px;background:#1a1a1a;border-radius:16px;max-width:500px"></div>
<div class="overlay" id="ov"><h2>Terminé</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var sc,ov,t,ans,timer,current;
function init(){sc=0;ov=false;t=60;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');if(timer)clearInterval(timer);timer=setInterval(function(){if(ov)return;t--;if(t<=0){ov=true;document.getElementById('fin').textContent=sc;document.getElementById('ov').classList.add('show');}},1000);next();}
function next(){var a=Math.floor(Math.random()*900)+100;var b=Math.floor(Math.random()*900)+100;var op=['+','×'][Math.floor(Math.random()*2)];if(op==='+')ans=a+b;else ans=a*b;current=ans;var ch=[ans];while(ch.length<4){var f=ans+(Math.floor(Math.random()*30)-15);if(ch.indexOf(f)<0&&f!==ans)ch.push(f);}ch.sort(function(){return Math.random()-0.5;});var h='<p style="color:#888;margin-bottom:16px">Solve :</p><p style="color:#facc15;font-size:32px;font-weight:900;margin:0 0 24px 0">'+a+' '+op+' '+b+'</p><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">';ch.forEach(function(c){h+='<button ontouchstart="pick('+c+');event.preventDefault()" onclick="pick('+c+')" style="padding:14px;background:#2a2a2a;color:#fff;border:2px solid #3a3a3a;border-radius:10px;cursor:pointer;font-family:inherit;font-weight:900;font-size:18px">'+c+'</button>';});h+='</div>';document.getElementById('bd').innerHTML=h;}
function pick(v){if(ov)return;if(v===current)sc+=20;else sc=Math.max(0,sc-5);document.getElementById('score').textContent=sc;next();}
window.pick=pick;
function rst(){init();}
window.rst=rst;init();
`, "cryptarithm");
}

function flashCard(): string {
  return wrap("Flash Cards", `
<h1>🃏 <span>Flash Cards</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<div id="bd" style="text-align:center;padding:30px;background:#1a1a1a;border-radius:16px;max-width:500px;min-height:300px;display:flex;flex-direction:column;align-items:center;justify-content:center"></div>
<div class="overlay" id="ov"><h2>Terminé</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var QS=[
{q:"Capitale de la France ?",a:"Paris"},
{q:"Symbole chimique or ?",a:"Au"},
{q:"Plus grand océan ?",a:"Pacifique"},
{q:"Auteur de Hamlet ?",a:"Shakespeare"},
{q:"Année Révolution française ?",a:"1789"},
{q:"Plus long fleuve ?",a:"Nil"},
{q:"Vitesse lumière (km/s) ?",a:"300000"},
{q:"Planète rouge ?",a:"Mars"}
];
var idx,sc,ov,showing;
function init(){idx=0;sc=0;ov=false;showing=false;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');render();}
function render(){if(idx>=QS.length){ov=true;document.getElementById('fin').textContent=sc;document.getElementById('ov').classList.add('show');return;}var q=QS[idx];var h='<p style="color:#888;margin-bottom:20px">'+(idx+1)+'/'+QS.length+'</p><p style="color:#facc15;font-size:22px;font-weight:900;margin-bottom:24px">'+q.q+'</p>';if(showing){h+='<p style="color:#22c55e;font-size:32px;font-weight:900;margin-bottom:24px">'+q.a+'</p><button ontouchstart="next(true);event.preventDefault()" onclick="next(true)" style="padding:14px 32px;background:#22c55e;color:#fff;border:none;border-radius:12px;font-weight:900;cursor:pointer;font-family:inherit">CORRECT</button> <button ontouchstart="next(false);event.preventDefault()" onclick="next(false)" style="padding:14px 32px;background:#ef4444;color:#fff;border:none;border-radius:12px;font-weight:900;cursor:pointer;font-family:inherit">FAUX</button>';}else{h+='<button ontouchstart="show();event.preventDefault()" onclick="show()" style="padding:14px 32px;background:#3b82f6;color:#fff;border:none;border-radius:12px;font-weight:900;cursor:pointer;font-family:inherit">VOIR LA RÉPONSE</button>';}document.getElementById('bd').innerHTML=h;}
function show(){showing=true;render();}
function next(ok){if(ok)sc+=10;document.getElementById('score').textContent=sc;idx++;showing=false;render();}
window.show=show;window.next=next;
function rst(){init();}
window.rst=rst;init();
`, "flash-card");
}

function guessWord(): string {
  return wrap("Devine le Mot", `
<h1>🔤 <span>Devine Mot</span></h1>
<div class="stats"><span>Essais : <strong id="tries">0</strong>/6</span></div>
<div id="bd" style="text-align:center;padding:20px;background:#1a1a1a;border-radius:16px;max-width:500px"></div>
<div class="overlay" id="ov"><h2 id="ttl">Résultat</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var WORDS=['CHAT','TABLE','ARBRE','LIVRE','AVION','NID','OURS','TOUR','ROI','PAIN'];
var word,tries,ov,guesses;
function init(){word=WORDS[Math.floor(Math.random()*WORDS.length)];tries=0;guesses=[];ov=false;document.getElementById('tries').textContent='0';document.getElementById('ov').classList.remove('show');render();}
function render(){var h='<div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px;align-items:center">';guesses.forEach(function(g){var row='<div style="display:flex;gap:4px">';for(var i=0;i<word.length;i++){var c=g[i]||'';var bg='#2a2a2a';if(c===word[i])bg='#22c55e';else if(word.indexOf(c)>=0)bg='#facc15';row+='<div style="width:40px;height:40px;background:'+bg+';display:flex;align-items:center;justify-content:center;font-weight:900;color:#fff;border-radius:8px">'+c+'</div>';}row+='</div>';h+=row;});h+='</div>';h+='<input id="inp" type="text" maxlength="'+word.length+'" placeholder="Mot de '+word.length+' lettres" style="width:220px;padding:12px;font-size:18px;background:#0a0a0a;color:#fff;border:2px solid #facc15;border-radius:10px;outline:none;text-align:center;text-transform:uppercase" /><br><button ontouchstart="submit();event.preventDefault()" onclick="submit()" style="margin-top:12px;padding:12px 32px;background:#22c55e;color:#fff;border:none;border-radius:10px;font-weight:900;cursor:pointer;font-family:inherit">VALIDER</button>';document.getElementById('bd').innerHTML=h;setTimeout(function(){var i=document.getElementById('inp');if(i)i.focus();},100);}
function submit(){if(ov)return;var v=(document.getElementById('inp').value||'').toUpperCase().trim();if(v.length!==word.length)return;tries++;document.getElementById('tries').textContent=tries;guesses.push(v);if(v===word){ov=true;document.getElementById('ttl').textContent='🎉 Gagné !';document.getElementById('ov').classList.add('show');return;}if(tries>=6){ov=true;document.getElementById('ttl').textContent='😢 Perdu. Mot : '+word;document.getElementById('ov').classList.add('show');return;}render();}
window.submit=submit;
document.addEventListener('keydown',function(e){if(e.key==='Enter')submit();});
function rst(){init();}
window.rst=rst;init();
`, "guess-word");
}

function wordle(): string {
  return wrap("Wordle FR", `
<h1>🟩 <span>Wordle FR</span></h1>
<div class="stats"><span>Essais : <strong id="tries">0</strong>/6</span></div>
<div id="bd" style="text-align:center;padding:20px;background:#1a1a1a;border-radius:16px;max-width:500px"></div>
<div class="overlay" id="ov"><h2 id="ttl">Résultat</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var WORDS=['CHIEN','MAISON','ARBRE','SOLEIL','LIVRE','VOITURE','FLEUR','TABLE','POMME','JARDIN','ROUGE','BLEUE','VERTE','NOIRE','BLANC'];
var word,tries,ov,guesses;
function init(){word=WORDS[Math.floor(Math.random()*WORDS.length)];tries=0;guesses=[];ov=false;document.getElementById('tries').textContent='0';document.getElementById('ov').classList.remove('show');render();}
function render(){var h='<div style="display:flex;flex-direction:column;gap:6px;margin-bottom:16px;align-items:center">';guesses.forEach(function(g){var row='<div style="display:flex;gap:4px">';for(var i=0;i<5;i++){var c=g[i]||'';var bg='#2a2a2a';if(c===word[i])bg='#22c55e';else if(word.indexOf(c)>=0)bg='#facc15';row+='<div style="width:40px;height:40px;background:'+bg+';display:flex;align-items:center;justify-content:center;font-weight:900;color:#fff;border-radius:6px">'+c+'</div>';}row+='</div>';h+=row;});h+='</div>';h+='<input id="inp" type="text" maxlength="5" style="width:200px;padding:12px;font-size:18px;background:#0a0a0a;color:#fff;border:2px solid #22c55e;border-radius:10px;outline:none;text-align:center;text-transform:uppercase;letter-spacing:8px;font-weight:900" /><br><button ontouchstart="submit();event.preventDefault()" onclick="submit()" style="margin-top:12px;padding:12px 32px;background:#22c55e;color:#fff;border:none;border-radius:10px;font-weight:900;cursor:pointer;font-family:inherit">VALIDER</button>';document.getElementById('bd').innerHTML=h;setTimeout(function(){var i=document.getElementById('inp');if(i)i.focus();},100);}
function submit(){if(ov)return;var v=(document.getElementById('inp').value||'').toUpperCase().trim();if(v.length!==5)return;tries++;document.getElementById('tries').textContent=tries;guesses.push(v);if(v===word){ov=true;document.getElementById('ttl').textContent='🎉 Gagné !';document.getElementById('ov').classList.add('show');return;}if(tries>=6){ov=true;document.getElementById('ttl').textContent='😢 Mot : '+word;document.getElementById('ov').classList.add('show');return;}render();}
window.submit=submit;
document.addEventListener('keydown',function(e){if(e.key==='Enter')submit();});
function rst(){init();}
window.rst=rst;init();
`, "wordle");
}
// ═══════════════════════════════════════════════════════════════
// PAQUET 13 : 30 JEUX (Sports / Racing / Action)
// ═══════════════════════════════════════════════════════════════

function backgammon(): string {
  return wrap("Backgammon", `
<h1>🎲 <span>Backgammon</span></h1>
<div class="stats"><span>Toi : <strong id="s1">0</strong></span><span>IA : <strong id="s2">0</strong></span></div>
<div id="bd" style="padding:20px;background:#8b4513;border-radius:12px;border:4px solid #d4af37;max-width:600px"></div>
<div class="controls" style="margin-top:16px"><button ontouchstart="roll();event.preventDefault()" onclick="roll()" style="width:180px;background:#22c55e;color:#fff">LANCER DÉS</button></div>
<div class="overlay" id="ov"><h2 id="ttl">Fin</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var s1=0,s2=0,turn='you',ov;
function init(){s1=0;s2=0;turn='you';ov=false;document.getElementById('s1').textContent='0';document.getElementById('s2').textContent='0';document.getElementById('ov').classList.remove('show');render();}
function render(msg){document.getElementById('bd').innerHTML='<p style="color:#fff;font-size:20px;text-align:center">'+(msg||'Clique LANCER DÉS')+'</p>';}
function roll(){if(ov)return;var r1=Math.floor(Math.random()*6)+1,r2=Math.floor(Math.random()*6)+1;if(r1+r2>7){s1++;document.getElementById('s1').textContent=s1;}else{s2++;document.getElementById('s2').textContent=s2;}render('Toi: '+r1+'+'+r2+'='+(r1+r2));if(s1>=5||s2>=5){ov=true;document.getElementById('ttl').textContent=s1>=5?'🎉 Gagné':'😢 Perdu';document.getElementById('ov').classList.add('show');}}
window.roll=roll;
function rst(){init();}
window.rst=rst;init();
`, "backgammon");
}

function tennis(): string {
  return wrap("Tennis", `
<h1>🎾 <span>Tennis</span></h1>
<div class="stats"><span>Toi : <strong id="s1">0</strong></span><span>IA : <strong id="s2">0</strong></span></div>
<canvas id="g" width="500" height="500"></canvas>
<div class="controls"><button ontouchstart="hit();event.preventDefault()" onclick="hit()" style="width:160px;background:#facc15;color:#000">FRAPPER</button></div>
<div class="overlay" id="ov"><h2 id="ttl">Fin</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var player,ball,s1,s2,ov,loop,t;
function init(){player={x:W/2-40,y:H-40,w:80,h:20};ball={x:W/2,y:80,vx:2,vy:3,r:8};s1=0;s2=0;ov=false;t=0;document.getElementById('s1').textContent='0';document.getElementById('s2').textContent='0';document.getElementById('ov').classList.remove('show');}
function hit(){if(ov)return;if(ball.y>H-150){ball.vy=-Math.abs(ball.vy);ball.vx+=(ball.x-player.x-player.w/2)/30;}}
window.hit=hit;
function upd(){t++;ball.vy+=0.05;ball.x+=ball.vx;ball.y+=ball.vy;if(ball.x<ball.r||ball.x>W-ball.r)ball.vx*=-1;if(ball.y<ball.r)ball.vy=Math.abs(ball.vy);if(ball.y>H){s2++;document.getElementById('s2').textContent=s2;ball={x:W/2,y:80,vx:(Math.random()<0.5?2:-2),vy:3,r:8};}if(ball.y+ball.r>player.y&&ball.y-ball.r<player.y+player.h&&ball.x>player.x&&ball.x<player.x+player.w&&ball.vy>0){ball.vy=-Math.abs(ball.vy);ball.vx+=(ball.x-(player.x+player.w/2))/20;s1++;document.getElementById('s1').textContent=s1;}var target=ball.x-40;player.x+=(target-player.x)*0.05;player.x=Math.max(0,Math.min(W-player.w,player.x));if(s1>=10||s2>=10){ov=true;document.getElementById('ttl').textContent=s1>=10?'🎉 Gagné':'😢 Perdu';document.getElementById('ov').classList.add('show');}}
function draw(){x.fillStyle='#0a4a1a';x.fillRect(0,0,W,H);x.strokeStyle='#fff';x.beginPath();x.moveTo(0,H/2);x.lineTo(W,H/2);x.stroke();x.strokeRect(50,50,W-100,H-100);x.fillStyle='#facc15';x.fillRect(player.x,player.y,player.w,player.h);x.fillStyle='#fff';x.beginPath();x.arc(ball.x,ball.y,ball.r,0,6.3);x.fill();}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;rst();
`, "tennis");
}

function volleyball(): string {
  return wrap("Volleyball", `
<h1>🏐 <span>Volley</span></h1>
<div class="stats"><span>Toi : <strong id="s1">0</strong></span><span>IA : <strong id="s2">0</strong></span></div>
<canvas id="g" width="500" height="500"></canvas>
<div class="controls"><button ontouchstart="hit();event.preventDefault()" onclick="hit()" style="width:160px;background:#f97316;color:#fff">FRAPPER</button></div>
<div class="overlay" id="ov"><h2 id="ttl">Fin</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var player,ball,s1,s2,ov,loop;
function init(){player={x:W/2-40,y:H-40,w:80,h:20};ball={x:W/2,y:80,vx:2,vy:3,r:10};s1=0;s2=0;ov=false;document.getElementById('s1').textContent='0';document.getElementById('s2').textContent='0';document.getElementById('ov').classList.remove('show');}
function hit(){if(ov)return;if(ball.y>H-200){ball.vy=-Math.abs(ball.vy)-1;ball.vx+=(ball.x-player.x-player.w/2)/30;}}
window.hit=hit;
function upd(){ball.vy+=0.08;ball.x+=ball.vx;ball.y+=ball.vy;if(ball.x<ball.r||ball.x>W-ball.r)ball.vx*=-1;if(ball.y<ball.r)ball.vy=Math.abs(ball.vy);if(ball.y>H){s2++;document.getElementById('s2').textContent=s2;ball={x:W/2,y:80,vx:(Math.random()<0.5?2:-2),vy:3,r:10};}if(ball.y+ball.r>player.y&&ball.y-ball.r<player.y+player.h&&ball.x>player.x&&ball.x<player.x+player.w&&ball.vy>0){ball.vy=-8;ball.vx+=(ball.x-(player.x+player.w/2))/20;s1++;document.getElementById('s1').textContent=s1;}var target=ball.x-40;player.x+=(target-player.x)*0.06;if(s1>=7||s2>=7){ov=true;document.getElementById('ttl').textContent=s1>=7?'🎉 Gagné':'😢 Perdu';document.getElementById('ov').classList.add('show');}}
function draw(){x.fillStyle='#2a7a3a';x.fillRect(0,0,W,H);x.strokeStyle='#fff';x.lineWidth=3;x.beginPath();x.moveTo(0,H/2);x.lineTo(W,H/2);x.stroke();x.fillStyle='#facc15';x.fillRect(player.x,player.y,player.w,player.h);x.fillStyle='#f97316';x.beginPath();x.arc(ball.x,ball.y,ball.r,0,6.3);x.fill();}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;rst();
`, "volleyball");
}

function golf(): string {
  return wrap("Golf", `
<h1>⛳ <span>Golf</span></h1>
<div class="stats"><span>Coups : <strong id="strokes">0</strong></span><span>Trou : <strong id="hole">1</strong>/3</span></div>
<canvas id="g" width="600" height="400"></canvas>
<div class="controls"><button ontouchstart="shoot();event.preventDefault()" onclick="shoot()" style="width:200px;background:#22c55e;color:#fff">FRAPPER</button></div>
<div class="overlay" id="ov"><h2>🎉 Terminé</h2><p>Total : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var ball,hole,strokes,holeN,ov,loop,charging,power;
function init(){ball={x:80,y:H-80,vx:0,vy:0,r:8};hole={x:W-80,y:80};strokes=0;holeN=1;ov=false;charging=false;power=0;document.getElementById('strokes').textContent='0';document.getElementById('hole').textContent='1';document.getElementById('ov').classList.remove('show');}
function shoot(){if(ov)return;if(charging){charging=false;var dx=hole.x-ball.x,dy=hole.y-ball.y;var d=Math.sqrt(dx*dx+dy*dy);ball.vx=dx/d*power*0.1+(Math.random()-0.5)*3;ball.vy=dy/d*power*0.1+(Math.random()-0.5)*3;strokes++;document.getElementById('strokes').textContent=strokes;power=0;}else{charging=true;power=0;}}
window.shoot=shoot;
function upd(){if(charging)power=Math.min(100,power+2);if(Math.abs(ball.vx)>0.1||Math.abs(ball.vy)>0.1){ball.x+=ball.vx;ball.y+=ball.vy;ball.vx*=0.95;ball.vy*=0.95;if(ball.x<ball.r||ball.x>W-ball.r)ball.vx*=-1;if(ball.y<ball.r||ball.y>H-ball.r)ball.vy*=-1;if(Math.hypot(ball.x-hole.x,ball.y-hole.y)<25){holeN++;if(holeN>3){ov=true;document.getElementById('fin').textContent=strokes;document.getElementById('ov').classList.add('show');}else{ball={x:80,y:H-80,vx:0,vy:0,r:8};hole={x:50+Math.random()*(W-100),y:50+Math.random()*(H-100)};charging=false;document.getElementById('hole').textContent=holeN;}}}}
function draw(){x.fillStyle='#2a7a3a';x.fillRect(0,0,W,H);x.fillStyle='#000';x.beginPath();x.arc(hole.x,hole.y,18,0,6.3);x.fill();x.fillStyle='#fff';x.beginPath();x.arc(ball.x,ball.y,ball.r,0,6.3);x.fill();if(charging){x.fillStyle='#facc15';x.fillRect(20,H-30,power*3,20);}}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;rst();
`, "golf");
}

function hockey(): string {
  return wrap("Hockey", `
<h1>🏒 <span>Hockey</span></h1>
<div class="stats"><span>Toi : <strong id="s1">0</strong></span><span>IA : <strong id="s2">0</strong></span></div>
<canvas id="g" width="500" height="500"></canvas>
<div class="controls"><button ontouchstart="hit();event.preventDefault()" onclick="hit()" style="width:180px;background:#ef4444;color:#fff">FRAPPER</button></div>
<div class="overlay" id="ov"><h2 id="ttl">Fin</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var player,puck,s1,s2,ov,loop;
function init(){player={x:W/2-30,y:H-80,w:60,h:30};puck={x:W/2,y:H-100,vx:0,vy:0,r:10};s1=0;s2=0;ov=false;document.getElementById('s1').textContent='0';document.getElementById('s2').textContent='0';document.getElementById('ov').classList.remove('show');}
function hit(){if(ov)return;if(puck.y>H-150){puck.vy=-Math.abs(puck.vy)-5;puck.vx+=(puck.x-player.x-player.w/2)/20;}}
window.hit=hit;
function upd(){puck.x+=puck.vx;puck.y+=puck.vy;puck.vx*=0.99;puck.vy*=0.99;if(puck.x<puck.r||puck.x>W-puck.r){puck.vx*=-1;}if(puck.y<puck.r){puck.vy=Math.abs(puck.vy);}if(puck.y>H){s2++;document.getElementById('s2').textContent=s2;puck={x:W/2,y:H-100,vx:0,vy:0,r:10};}if(puck.y+player.y!==puck.y&&puck.x>player.x&&puck.x<player.x+player.w&&puck.y>player.y&&puck.y<player.y+player.h){puck.vy=-Math.abs(puck.vy)-3;}if(puck.y>H-150&&puck.x>player.x&&puck.x<player.x+player.w&&puck.vy>0){puck.vy=-Math.abs(puck.vy)-3;puck.vx+=(puck.x-(player.x+player.w/2))/10;s1++;document.getElementById('s1').textContent=s1;}if(s1>=5||s2>=5){ov=true;document.getElementById('ttl').textContent=s1>=5?'🎉 Gagné':'😢 Perdu';document.getElementById('ov').classList.add('show');}}
function draw(){x.fillStyle='#e8f4f8';x.fillRect(0,0,W,H);x.strokeStyle='#666';x.beginPath();x.moveTo(0,H/2);x.lineTo(W,H/2);x.stroke();x.beginPath();x.arc(W/2,H/2,60,0,6.3);x.stroke();x.fillStyle='#22c55e';x.fillRect(player.x,player.y,player.w,player.h);x.fillStyle='#000';x.beginPath();x.arc(puck.x,puck.y,puck.r,0,6.3);x.fill();}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;rst();
`, "hockey");
}

function bowling(): string {
  return wrap("Bowling", `
<h1>🎳 <span>Bowling</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Lancers : <strong id="rolls">0</strong></span></div>
<canvas id="g" width="500" height="500"></canvas>
<div class="controls"><button ontouchstart="shoot();event.preventDefault()" onclick="shoot()" style="width:180px;background:#22c55e;color:#fff">LANCER</button></div>
<div class="overlay" id="ov"><h2>Terminé</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var ball,pins,sc,rolls,ov,loop,charging,power;
function init(){ball={x:W/2,y:H-50,vx:0,vy:0,r:12};pins=[];for(var i=0;i<10;i++){var r=Math.floor(i/4),c2=i%4-(r===2?0.5:0);pins.push({x:W/2-90+(r===0?c2*60:r===1?c2*60+30:c2*60+30),y:100+r*50,alive:true});}sc=0;rolls=0;ov=false;charging=false;power=0;document.getElementById('score').textContent='0';document.getElementById('rolls').textContent='0';document.getElementById('ov').classList.remove('show');}
function shoot(){if(ov)return;if(!charging){charging=true;power=0;}else{charging=false;ball.vx=(power-50)*0.1;ball.vy=-8;rolls++;document.getElementById('rolls').textContent=rolls;}}
window.shoot=shoot;
function upd(){if(charging)power=Math.min(100,power+3);ball.x+=ball.vx;ball.y+=ball.vy;if(ball.y<50)ball.vy=3;if(ball.x<ball.r||ball.x>W-ball.r)ball.vx*=-1;pins.forEach(function(p){if(p.alive&&Math.hypot(ball.x-p.x,ball.y-p.y)<25){p.alive=false;sc+=10;document.getElementById('score').textContent=sc;}});if(ball.y>H){var remain=pins.filter(function(p){return p.alive;}).length;if(remain===0){pins=[];for(var i=0;i<10;i++){var r=Math.floor(i/4),c2=i%4-(r===2?0.5:0);pins.push({x:W/2-90+(r===0?c2*60:r===1?c2*60+30:c2*60+30),y:100+r*50,alive:true});}}ball={x:W/2,y:H-50,vx:0,vy:0,r:12};if(rolls>=10){ov=true;document.getElementById('fin').textContent=sc;document.getElementById('ov').classList.add('show');}}}
function draw(){x.fillStyle='#8b4513';x.fillRect(0,0,W,H);x.fillStyle='#000';x.fillRect(0,80,W,30);pins.forEach(function(p){if(p.alive){x.fillStyle='#fff';x.fillRect(p.x-5,p.y-15,10,20);}});x.fillStyle='#22c55e';x.beginPath();x.arc(ball.x,ball.y,ball.r,0,6.3);x.fill();if(charging){x.fillStyle='#facc15';x.fillRect(20,H-40,power*3,20);}}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;rst();
`, "bowling");
}

function dart(): string {
  return wrap("Fléchettes", `
<h1>🎯 <span>Fléchettes</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Fléchettes : <strong id="darts">5</strong></span></div>
<div id="bd" style="width:min(500px,90vw);height:500px;background:radial-gradient(circle,#facc15 0%,#ef4444 30%,#22c55e 60%,#1a1a1a 100%);border-radius:50%;position:relative;cursor:crosshair;border:4px solid #000"></div>
<div class="overlay" id="ov"><h2>Terminé</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var sc,darts,ov;
function init(){sc=0;darts=5;ov=false;document.getElementById('score').textContent='0';document.getElementById('darts').textContent='5';document.getElementById('ov').classList.remove('show');document.getElementById('bd').innerHTML='';}
function click(e){e.preventDefault();if(ov||darts<=0)return;var bd=document.getElementById('bd');var r=bd.getBoundingClientRect();var mx,my;if(e.touches){mx=e.touches[0].clientX-r.left;my=e.touches[0].clientY-r.top;}else{mx=e.clientX-r.left;my=e.clientY-r.top;}var cx=r.width/2,cy=r.height/2;var d=Math.hypot(mx-cx,my-cy);var maxD=r.width/2;if(d<maxD*0.1)sc+=100;else if(d<maxD*0.3)sc+=50;else if(d<maxD*0.5)sc+=25;else if(d<maxD*0.7)sc+=10;else sc+=5;darts--;document.getElementById('score').textContent=sc;document.getElementById('darts').textContent=darts;var m=document.createElement('div');m.style.cssText='position:absolute;width:8px;height:8px;background:#000;border-radius:50%;left:'+mx+'px;top:'+my+'px;pointer-events:none';bd.appendChild(m);if(darts<=0){ov=true;document.getElementById('fin').textContent=sc;document.getElementById('ov').classList.add('show');}}
function rst(){init();}
window.rst=rst;
document.getElementById('bd').addEventListener('click',click);
document.getElementById('bd').addEventListener('touchstart',click,{passive:false});
init();
`, "dart");
}

function airHockey(): string {
  return wrap("Air Hockey", `
<h1>🏒 <span>Air Hockey</span></h1>
<div class="stats"><span>Toi : <strong id="s1">0</strong></span><span>IA : <strong id="s2">0</strong></span></div>
<canvas id="g" width="400" height="600"></canvas>
<div style="margin-top:12px;opacity:.6;font-size:12px">Bouge la souris / le doigt</div>
<div class="overlay" id="ov"><h2 id="ttl">Fin</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var p1,p2,puck,s1,s2,ov,loop;
function init(){p1={x:W/2,y:H-50,r:20};p2={x:W/2,y:50,r:20};puck={x:W/2,y:H/2,vx:2,vy:4,r:12};s1=0;s2=0;ov=false;document.getElementById('s1').textContent='0';document.getElementById('s2').textContent='0';document.getElementById('ov').classList.remove('show');}
function upd(){puck.x+=puck.vx;puck.y+=puck.vy;if(puck.x<puck.r||puck.x>W-puck.r)puck.vx*=-1;if(puck.y<puck.r){s1++;document.getElementById('s1').textContent=s1;reset();}if(puck.y>H){s2++;document.getElementById('s2').textContent=s2;reset();}if(Math.hypot(puck.x-p1.x,puck.y-p1.y)<p1.r+puck.r){var dx=puck.x-p1.x,dy=puck.y-p1.y,d=Math.sqrt(dx*dx+dy*dy);puck.vx=dx/d*6;puck.vy=dy/d*6;}if(Math.hypot(puck.x-p2.x,puck.y-p2.y)<p2.r+puck.r){var dx2=puck.x-p2.x,dy2=puck.y-p2.y,d2=Math.sqrt(dx2*dx2+dy2*dy2);puck.vx=dx2/d2*5;puck.vy=dy2/d2*5;}var target=puck.x;p2.x+=(target-p2.x)*0.05;p2.x=Math.max(20,Math.min(W-20,p2.x));if(s1>=7||s2>=7){ov=true;document.getElementById('ttl').textContent=s1>=7?'🎉 Gagné':'😢 Perdu';document.getElementById('ov').classList.add('show');}}
function reset(){puck={x:W/2,y:H/2,vx:(Math.random()<0.5?2:-2),vy:4};}
function draw(){x.fillStyle='#06b6d4';x.fillRect(0,0,W,H);x.strokeStyle='#fff';x.beginPath();x.moveTo(0,H/2);x.lineTo(W,H/2);x.stroke();x.beginPath();x.arc(W/2,H/2,60,0,6.3);x.stroke();x.fillStyle='#facc15';x.beginPath();x.arc(p1.x,p1.y,p1.r,0,6.3);x.fill();x.fillStyle='#ef4444';x.beginPath();x.arc(p2.x,p2.y,p2.r,0,6.3);x.fill();x.fillStyle='#000';x.beginPath();x.arc(puck.x,puck.y,puck.r,0,6.3);x.fill();}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
c.addEventListener('mousemove',function(e){var r=c.getBoundingClientRect();p1.x=(e.clientX-r.left)*(W/r.width);p1.y=(e.clientY-r.top)*(H/r.height);});
c.addEventListener('touchmove',function(e){e.preventDefault();var r=c.getBoundingClientRect();p1.x=(e.touches[0].clientX-r.left)*(W/r.width);p1.y=(e.touches[0].clientY-r.top)*(H/r.height);},{passive:false});
rst();
`, "air-hockey");
}

function sumo(): string {
  return wrap("Sumo", `
<h1>🤼 <span>Sumo</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="500" height="500"></canvas>
<div class="controls"><button ontouchstart="push();event.preventDefault()" onclick="push()" style="width:200px;background:#ef4444;color:#fff">POUSSER</button></div>
<div class="overlay" id="ov"><h2>Terminé</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var p1,p2,sc,ov,loop;
function init(){p1={x:W/2,y:H-150,r:50,vx:0,vy:0};p2={x:W/2,y:150,r:50,vx:0,vy:0};sc=0;ov=false;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function push(){if(ov)return;var dx=p2.x-p1.x,dy=p2.y-p1.y;var d=Math.sqrt(dx*dx+dy*dy);p2.vx=dx/d*10;p2.vy=dy/d*10;}
window.push=push;
function upd(){p1.x+=p1.vx;p1.y+=p1.vy;p2.x+=p2.vx;p2.y+=p2.vy;p1.vx*=0.9;p1.vy*=0.9;p2.vx*=0.9;p2.vy*=0.9;p1.x=Math.max(50,Math.min(W-50,p1.x));p1.y=Math.max(50,Math.min(H-50,p1.y));p2.x=Math.max(50,Math.min(W-50,p2.x));p2.y=Math.max(50,Math.min(H-50,p2.y));if(Math.hypot(p1.x-p2.x,p1.y-p2.y)<p1.r+p2.r){var dx=p2.x-p1.x,dy=p2.y-p1.y,d=Math.sqrt(dx*dx+dy*dy);p2.x=p1.x+dx/d*(p1.r+p2.r);p2.y=p1.y+dy/d*(p1.r+p2.r);}var ringR=200;var cx=W/2,cy=H/2;if(Math.hypot(p2.x-cx,p2.y-cy)>ringR){sc+=100;document.getElementById('score').textContent=sc;p2.x=cx;p2.y=cy-100;p2.vx=0;p2.vy=0;}if(Math.hypot(p1.x-cx,p1.y-cy)>ringR){ov=true;document.getElementById('fin').textContent=sc;document.getElementById('ov').classList.add('show');}}
function draw(){x.fillStyle='#d4a574';x.fillRect(0,0,W,H);x.strokeStyle='#8b4513';x.lineWidth=6;x.beginPath();x.arc(W/2,H/2,200,0,6.3);x.stroke();x.fillStyle='#facc15';x.beginPath();x.arc(p1.x,p1.y,p1.r,0,6.3);x.fill();x.fillStyle='#ef4444';x.beginPath();x.arc(p2.x,p2.y,p2.r,0,6.3);x.fill();}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;rst();
`, "sumo");
}

function boxing(): string {
  return wrap("Boxe", `
<h1>🥊 <span>Boxe</span></h1>
<div class="stats"><span>Ton HP : <strong id="hp1">100</strong></span><span>Adversaire : <strong id="hp2">100</strong></span></div>
<canvas id="g" width="600" height="400"></canvas>
<div class="controls">
<button ontouchstart="atk('jab');event.preventDefault()" onclick="atk('jab')" style="background:#22c55e;color:#fff;width:100px">Jab</button>
<button ontouchstart="atk('hook');event.preventDefault()" onclick="atk('hook')" style="background:#facc15;color:#000;width:100px">Hook</button>
<button ontouchstart="atk('block');event.preventDefault()" onclick="atk('block')" style="background:#3b82f6;color:#fff;width:100px">Bloquer</button>
</div>
<div class="overlay" id="ov"><h2 id="ttl">Fin</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var hp1,hp2,ov,msg,blocking;
function init(){hp1=100;hp2=100;ov=false;msg='';blocking=false;document.getElementById('hp1').textContent='100';document.getElementById('hp2').textContent='100';document.getElementById('ov').classList.remove('show');}
function atk(t){if(ov)return;if(t==='jab'){hp2-=5;msg='Jab -5 HP';}if(t==='hook'){hp2-=Math.random()<0.6?15:0;msg='Hook !';}if(t==='block'){blocking=true;msg='Bloqué';}setTimeout(function(){if(!blocking){hp1-=5+Math.floor(Math.random()*10);}blocking=false;msg='';document.getElementById('hp1').textContent=hp1;document.getElementById('hp2').textContent=hp2;if(hp2<=0){ov=true;document.getElementById('ttl').textContent='🏆 Victoire !';document.getElementById('ov').classList.add('show');}if(hp1<=0){ov=true;document.getElementById('ttl').textContent='💀 KO';document.getElementById('ov').classList.add('show');}},500);document.getElementById('hp1').textContent=hp1;document.getElementById('hp2').textContent=hp2;}
window.atk=atk;
function draw(){x.fillStyle='#1a0f0a';x.fillRect(0,0,W,H);x.font='100px system-ui';x.fillText('🥊',100,H/2+30);x.fillText('🥊',W-200,H/2+30);x.fillStyle='#22c55e';x.fillRect(80,H-50,hp1*1.5,20);x.fillStyle='#ef4444';x.fillRect(W-230,H-50,hp2*1.5,20);x.fillStyle='#fff';x.font='24px system-ui';if(msg)x.fillText(msg,W/2-60,50);}
function tick(){draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,50);}
window.rst=rst;rst();
`, "boxing");
}

function rally(): string {
  return wrap("Rally", `
<h1>🏎️ <span>Rally</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="400" height="600"></canvas>
<div class="controls"><button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button><button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button></div>
<div class="overlay" id="ov"><h2>Crash !</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var player,rocks,sc,ov,loop,speed,t;
function init(){player={x:W/2-20,y:H-100,w:40,h:60};rocks=[];sc=0;ov=false;speed=3;t=0;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function mv(d){player.x+=d*25;player.x=Math.max(20,Math.min(W-20-player.w,player.x));}
window.mv=mv;
function upd(){t++;sc+=speed/10;document.getElementById('score').textContent=Math.floor(sc);speed+=0.001;rocks.forEach(function(r){r.y+=speed;});rocks=rocks.filter(function(r){return r.y<H+30;});if(t%30===0)rocks.push({x:40+Math.random()*(W-120),y:-30,r:20+Math.random()*15});rocks.forEach(function(r){if(Math.hypot(r.x-player.x-20,r.y-player.y-30)<r.r+15){ov=true;document.getElementById('fin').textContent=Math.floor(sc);document.getElementById('ov').classList.add('show');}});}
function draw(){x.fillStyle='#666';x.fillRect(0,0,W,H);x.fillStyle='#444';x.fillRect(40,0,W-80,H);x.fillStyle='#fff';for(var i=0;i<H;i+=40){x.fillRect(W/2-3,(i+(t*3)%40)%H,6,20);}rocks.forEach(function(r){x.fillStyle='#8b4513';x.beginPath();x.arc(r.x,r.y,r.r,0,6.3);x.fill();});x.fillStyle='#facc15';x.fillRect(player.x,player.y,player.w,player.h);}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')mv(-1);if(e.key==='ArrowRight')mv(1);});
rst();
`, "rally");
}

function dragRace(): string {
  return wrap("Drag Race", `
<h1>🏁 <span>Drag Race</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="600" height="400"></canvas>
<div class="controls"><button ontouchstart="startAccel();event.preventDefault()" ontouchend="stopAccel();event.preventDefault()" onclick="toggleAccel()" style="width:200px;background:#22c55e;color:#fff">ACCÉLÉRER</button></div>
<div class="overlay" id="ov"><h2 id="ttl">Résultat</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var speed,position,opponent,ov,accel,t,timer;
function init(){speed=0;position=0;opponent=0;ov=false;accel=false;t=0;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function startAccel(){accel=true;}
function stopAccel(){accel=false;}
function toggleAccel(){accel=!accel;}
window.startAccel=startAccel;window.stopAccel=stopAccel;window.toggleAccel=toggleAccel;
function upd(){t++;if(accel)speed+=0.3;else speed-=0.1;speed=Math.max(0,speed);position+=speed;opponent+=0.5+Math.random()*0.3;if(t%60===0){if(Math.random()<0.3)speed*=0.5;}if(position>600){ov=true;document.getElementById('ttl').textContent=position>opponent?'🏆 Gagné !':'😢 Perdu';document.getElementById('ov').classList.add('show');}}
function draw(){x.fillStyle='#333';x.fillRect(0,0,W,H);x.fillStyle='#666';for(var i=0;i<W;i+=80){x.fillRect((i+(position*2)%80)%W,140,60,4);x.fillRect((i+(opponent*2)%80)%W,240,60,4);}x.fillStyle='#22c55e';x.fillRect(100+position%400,120,60,40);x.fillStyle='#ef4444';x.fillRect(100+opponent%400,220,60,40);x.fillStyle='#fff';x.font='24px system-ui';x.fillText('Vitesse: '+Math.round(speed*100)+' km/h',20,40);}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,50);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key===' '){accel=true;}});
document.addEventListener('keyup',function(e){if(e.key===' ')accel=false;});
rst();
`, "drag-race");
}

function monsterTruck(): string {
  return wrap("Monster Truck", `
<h1>🚙 <span>Monster Truck</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="600" height="400"></canvas>
<div class="controls"><button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button><button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button></div>
<div class="overlay" id="ov"><h2>Crash !</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var truck,cars,sc,ov,loop,speed,t;
function init(){truck={x:W/2-40,y:H-100,w:80,h:60};cars=[];sc=0;ov=false;speed=5;t=0;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function mv(d){truck.x+=d*30;truck.x=Math.max(0,Math.min(W-truck.w,truck.x));}
window.mv=mv;
function upd(){t++;sc+=speed/10;document.getElementById('score').textContent=Math.floor(sc);cars.forEach(function(car){car.y+=speed;});cars=cars.filter(function(car){return car.y<H+50;});if(t%40===0)cars.push({x:Math.random()*(W-60),y:-50,w:60,h:40});cars.forEach(function(car){if(truck.x<car.x+car.w&&truck.x+truck.w>car.x&&truck.y+truck.h>car.y&&truck.y<car.y+car.h){sc+=50;car.done=true;document.getElementById('score').textContent=Math.floor(sc);}});cars=cars.filter(function(car){return !car.done;});}
function draw(){x.fillStyle='#8b7355';x.fillRect(0,0,W,H);x.fillStyle='#666';for(var i=0;i<H;i+=40){x.fillRect(0,(i+ (t*speed)%40)%H,W,3);}cars.forEach(function(car){x.fillStyle='#3b82f6';x.fillRect(car.x,car.y,car.w,car.h);});x.fillStyle='#facc15';x.fillRect(truck.x,truck.y,truck.w,truck.h);x.fillStyle='#000';x.beginPath();x.arc(truck.x+15,truck.y+truck.h,15,0,6.3);x.fill();x.beginPath();x.arc(truck.x+truck.w-15,truck.y+truck.h,15,0,6.3);x.fill();}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')mv(-1);if(e.key==='ArrowRight')mv(1);});
rst();
`, "monster-truck");
}

function f1Race(): string {
  return wrap("F1", `
<h1>🏎️ <span>F1 Race</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="400" height="600"></canvas>
<div class="controls"><button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button><button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button></div>
<div class="overlay" id="ov"><h2>Crash !</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var player,cars,sc,ov,loop,speed,t;
function init(){player={x:W/2-20,y:H-100,w:40,h:70};cars=[];sc=0;ov=false;speed=6;t=0;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function mv(d){player.x+=d*25;player.x=Math.max(0,Math.min(W-player.w,player.x));}
window.mv=mv;
function upd(){t++;sc+=speed/10;document.getElementById('score').textContent=Math.floor(sc);speed+=0.001;cars.forEach(function(car){car.y+=speed;});cars=cars.filter(function(car){return car.y<H+50;});if(t%50===0)cars.push({x:Math.random()*(W-50),y:-50,w:50,h:70,color:['#ef4444','#3b82f6','#22c55e','#facc15'][Math.floor(Math.random()*4)]});cars.forEach(function(car){if(player.x<car.x+car.w&&player.x+player.w>car.x&&player.y<car.y+car.h&&player.y+player.h>car.y){ov=true;document.getElementById('fin').textContent=Math.floor(sc);document.getElementById('ov').classList.add('show');}});}
function draw(){x.fillStyle='#333';x.fillRect(0,0,W,H);x.fillStyle='#fff';for(var i=0;i<H;i+=60){x.fillRect(10,(i+t*6)%H,4,30);x.fillRect(W-14,(i+t*6)%H,4,30);}cars.forEach(function(car){x.fillStyle=car.color;x.fillRect(car.x,car.y,car.w,car.h);});x.fillStyle='#a855f7';x.fillRect(player.x,player.y,player.w,player.h);x.fillStyle='#000';x.fillRect(player.x+5,player.y+50,10,15);x.fillRect(player.x+player.w-15,player.y+50,10,15);}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')mv(-1);if(e.key==='ArrowRight')mv(1);});
rst();
`, "f1-race");
}

function motoRace(): string {
  return wrap("Moto", `
<h1>🏍️ <span>Moto Race</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="400" height="600"></canvas>
<div class="controls"><button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button><button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button></div>
<div class="overlay" id="ov"><h2>Crash !</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var player,obstacles,sc,ov,loop,speed,t;
function init(){player={x:W/2-15,y:H-100,w:30,h:60};obstacles=[];sc=0;ov=false;speed=7;t=0;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function mv(d){player.x+=d*28;player.x=Math.max(0,Math.min(W-player.w,player.x));}
window.mv=mv;
function upd(){t++;sc+=speed/10;document.getElementById('score').textContent=Math.floor(sc);obstacles.forEach(function(o){o.y+=speed;});obstacles=obstacles.filter(function(o){return o.y<H+50;});if(t%30===0)obstacles.push({x:Math.random()*(W-30),y:-50,w:30,h:30,type:Math.random()<0.7?'cone':'fuel'});obstacles.forEach(function(o){if(player.x<o.x+o.w&&player.x+player.w>o.x&&player.y<o.y+o.h&&player.y+player.h>o.y){if(o.type==='fuel'){speed+=0.5;o.done=true;}else{ov=true;document.getElementById('fin').textContent=Math.floor(sc);document.getElementById('ov').classList.add('show');}}});obstacles=obstacles.filter(function(o){return !o.done;});}
function draw(){x.fillStyle='#333';x.fillRect(0,0,W,H);x.fillStyle='#fff';for(var i=0;i<H;i+=50){x.fillRect(W/2-2,(i+t*speed/2)%H,4,25);}obstacles.forEach(function(o){if(o.type==='cone'){x.fillStyle='#f97316';x.beginPath();x.moveTo(o.x+15,o.y);x.lineTo(o.x,o.y+30);x.lineTo(o.x+30,o.y+30);x.closePath();x.fill();}else{x.fillStyle='#22c55e';x.fillRect(o.x,o.y,o.w,o.h);}});x.fillStyle='#facc15';x.fillRect(player.x,player.y,player.w,player.h);x.fillStyle='#000';x.beginPath();x.arc(player.x+15,player.y+15,8,0,6.3);x.fill();x.beginPath();x.arc(player.x+15,player.y+45,8,0,6.3);x.fill();}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')mv(-1);if(e.key==='ArrowRight')mv(1);});
rst();
`, "moto-race");
}

function boatRace(): string {
  return wrap("Bateau", `
<h1>⛵ <span>Boat Race</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="400" height="600"></canvas>
<div class="controls"><button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button><button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button></div>
<div class="overlay" id="ov"><h2>Collision !</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var player,buoys,sc,ov,loop,speed,t;
function init(){player={x:W/2-25,y:H-100,w:50,h:70};buoys=[];sc=0;ov=false;speed=5;t=0;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function mv(d){player.x+=d*25;player.x=Math.max(0,Math.min(W-player.w,player.x));}
window.mv=mv;
function upd(){t++;sc+=speed/10;document.getElementById('score').textContent=Math.floor(sc);buoys.forEach(function(b){b.y+=speed;});buoys=buoys.filter(function(b){return b.y<H+50;});if(t%60===0){var side=Math.random()<0.5;buoys.push({x:side?20:W-60,y:-50,w:40,h:40});}buoys.forEach(function(b){if(player.x< b.x+b.w&&player.x+player.w>b.x&&player.y<b.y+b.h&&player.y+player.h>b.y){ov=true;document.getElementById('fin').textContent=Math.floor(sc);document.getElementById('ov').classList.add('show');}});}
function draw(){x.fillStyle='#1e3a8a';x.fillRect(0,0,W,H);x.fillStyle='#3b82f6';for(var i=0;i<20;i++){x.beginPath();x.arc((i*80+t*2)%W,(i*60+t*5)%H,3,0,6.3);x.fill();}buoys.forEach(function(b){x.fillStyle='#facc15';x.beginPath();x.arc(b.x+20,b.y+20,20,0,6.3);x.fill();});x.fillStyle='#fff';x.beginPath();x.moveTo(player.x+player.w/2,player.y);x.lineTo(player.x,player.y+player.h);x.lineTo(player.x+player.w,player.y+player.h);x.closePath();x.fill();}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')mv(-1);if(e.key==='ArrowRight')mv(1);});
rst();
`, "boat-race");
}

function submarine2(): string {
  return wrap("Sous-Marin 2", `
<h1>🚢 <span>Sous-Marin</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Oxygène : <strong id="oxy">100</strong></span></div>
<canvas id="g" width="600" height="400"></canvas>
<div class="controls">
<button ontouchstart="mv('l');event.preventDefault()" onclick="mv('l')">←</button>
<button ontouchstart="mv('u');event.preventDefault()" onclick="mv('u')">↑</button>
<button ontouchstart="mv('d');event.preventDefault()" onclick="mv('d')">↓</button>
<button ontouchstart="mv('r');event.preventDefault()" onclick="mv('r')">→</button>
</div>
<div class="overlay" id="ov"><h2>Terminé</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var pl,tr,oxy,sc,ov,loop,t;
function init(){pl={x:100,y:H/2,w:60,h:25};tr=[];oxy=100;sc=0;ov=false;t=0;document.getElementById('score').textContent='0';document.getElementById('oxy').textContent='100';document.getElementById('ov').classList.remove('show');}
function mv(d){if(d==='l')pl.x-=20;if(d==='r')pl.x+=20;if(d==='u')pl.y-=15;if(d==='d')pl.y+=15;pl.x=Math.max(0,Math.min(W-pl.w,pl.x));pl.y=Math.max(0,Math.min(H-pl.h,pl.y));}
window.mv=mv;
function upd(){t++;oxy-=0.05;document.getElementById('oxy').textContent=Math.floor(oxy);if(oxy<=0){ov=true;document.getElementById('fin').textContent=sc;document.getElementById('ov').classList.add('show');}tr.forEach(function(tr2){tr2.x-=2;});tr=tr.filter(function(tr2){return tr2.x>-50;});if(t%60===0)tr.push({x:W,y:50+Math.random()*(H-100),w:25,h:20,oxy:Math.random()<0.5});tr.forEach(function(tr2){if(pl.x< tr2.x+tr2.w&&pl.x+pl.w>tr2.x&&pl.y<tr2.y+tr2.h&&pl.y+pl.h>tr2.y){if(tr2.oxy){oxy=Math.min(100,oxy+20);}else{oxy-=20;}tr2.done=true;sc+=5;document.getElementById('score').textContent=sc;}});tr=tr.filter(function(tr2){return !tr2.done;});}
function draw(){x.fillStyle='#001a2e';x.fillRect(0,0,W,H);for(var i=0;i<15;i++){x.fillStyle='rgba(100,150,200,0.2)';x.beginPath();x.arc((i*80+t*3)%W,(i*60)%H,8,0,6.3);x.fill();}tr.forEach(function(tr2){x.fillStyle=tr2.oxy?'#22c55e':'#ef4444';x.fillRect(tr2.x,tr2.y,tr2.w,tr2.h);});x.fillStyle='#facc15';x.beginPath();x.ellipse(pl.x+pl.w/2,pl.y+pl.h/2,pl.w/2,pl.h/2,0,0,6.3);x.fill();}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')mv('l');if(e.key==='ArrowRight')mv('r');if(e.key==='ArrowUp')mv('u');if(e.key==='ArrowDown')mv('d');});
rst();
`, "submarine2");
}

function helicopterRace(): string {
  return wrap("Hélico Race", `
<h1>🚁 <span>Hélico Race</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="600" height="400"></canvas>
<div class="controls"><button ontouchstart="up();event.preventDefault()" onclick="up()">↑</button><button ontouchstart="down();event.preventDefault()" onclick="down()">↓</button></div>
<div class="overlay" id="ov"><h2>Crash !</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var pl,obs,sc,ov,loop,speed,t;
function init(){pl={x:100,y:H/2,w:60,h:25};obs=[];sc=0;ov=false;speed=5;t=0;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function up(){pl.y-=20;}
function down(){pl.y+=20;}
window.up=up;window.down=down;
function upd(){t++;sc+=speed/10;document.getElementById('score').textContent=Math.floor(sc);pl.y=Math.max(0,Math.min(H-pl.h,pl.y));obs.forEach(function(o){o.x-=speed;});obs=obs.filter(function(o){return o.x+o.w>0;});if(t%50===0){var gap=100;var top=Math.random()*(H-gap-40)+20;obs.push({x:W,top:top,gap:gap,passed:false});}obs.forEach(function(o){if(!o.passed&&o.x+o.w<pl.x){o.passed=true;sc+=10;}if(pl.x<o.x+o.w&&pl.x+pl.w>o.x){if(pl.y<o.top||pl.y+pl.h>o.top+o.gap){ov=true;document.getElementById('fin').textContent=Math.floor(sc);document.getElementById('ov').classList.add('show');}}});}
function draw(){var grad=x.createLinearGradient(0,0,0,H);grad.addColorStop(0,'#87ceeb');grad.addColorStop(1,'#7cb342');x.fillStyle=grad;x.fillRect(0,0,W,H);obs.forEach(function(o){x.fillStyle='#333';x.fillRect(o.x,0,40,o.top);x.fillRect(o.x,o.top+o.gap,40,H-o.top-o.gap);});x.fillStyle='#facc15';x.fillRect(pl.x,pl.y,pl.w,pl.h);x.fillStyle='#000';x.beginPath();x.arc(pl.x+pl.w-10,pl.y+pl.h/2,6,0,6.3);x.fill();}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowUp')up();if(e.key==='ArrowDown')down();});
rst();
`, "helicopter-race");
}

function moonLander(): string {
  return wrap("Moon Lander", `
<h1>🌙 <span>Moon Lander</span></h1>
<div class="stats"><span>Carburant : <strong id="fuel">100</strong></span><span>Vitesse : <strong id="speed">0</strong></span></div>
<canvas id="g" width="600" height="500"></canvas>
<div class="controls"><button ontouchstart="thr(true);event.preventDefault()" ontouchend="thr(false);event.preventDefault()" onclick="toggleThr()" style="width:180px;background:#facc15;color:#000">POUSSER</button></div>
<div class="overlay" id="ov"><h2 id="ttl">Résultat</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var pl,vy,vx,fuel,ov,thrust,t;
function init(){pl={x:W/2-20,y:50,w:40,h:30};vy=0;vx=(Math.random()-0.5)*2;fuel=100;ov=false;thrust=false;t=0;document.getElementById('fuel').textContent='100';document.getElementById('speed').textContent='0';document.getElementById('ov').classList.remove('show');}
function thr(v){thrust=v;}
function toggleThr(){thrust=!thrust;}
window.thr=thr;window.toggleThr=toggleThr;
function upd(){t++;vy+=0.05;if(thrust&&fuel>0){vy-=0.15;fuel-=0.3;}pl.x+=vx;pl.y+=vy;if(pl.x<0||pl.x+pl.w>W){vx*=-1;}document.getElementById('fuel').textContent=Math.floor(fuel);document.getElementById('speed').textContent=Math.abs(vy).toFixed(1);if(pl.y+pl.h>H-50){ov=true;var ok=Math.abs(vy)<2&&Math.abs(vx)<1;document.getElementById('ttl').textContent=ok?'🎉 Alunissage réussi !':'💥 Crash !';document.getElementById('ov').classList.add('show');}}
function draw(){x.fillStyle='#000';x.fillRect(0,0,W,H);for(var i=0;i<50;i++){x.fillStyle='#fff';x.fillRect((i*37)%W,(i*29)%H,2,2);}x.fillStyle='#666';x.fillRect(0,H-50,W,50);if(thrust&&fuel>0){x.fillStyle='#f97316';x.beginPath();x.moveTo(pl.x+pl.w/2,pl.y+pl.h);x.lineTo(pl.x+pl.w/2-10,pl.y+pl.h+20);x.lineTo(pl.x+pl.w/2+10,pl.y+pl.h+20);x.closePath();x.fill();}x.fillStyle='#facc15';x.fillRect(pl.x,pl.y,pl.w,pl.h);}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key===' ')thrust=true;});
document.addEventListener('keyup',function(e){if(e.key===' ')thrust=false;});
rst();
`, "moon-lander");
}

function spaceDodge(): string {
  return wrap("Dodge", `
<h1>☄️ <span>Space Dodge</span></h1>
<div class="stats"><span>Temps : <strong id="time">0</strong>s</span></div>
<canvas id="g" width="500" height="500"></canvas>
<div style="margin-top:12px;opacity:.6;font-size:12px">Souris / doigt pour bouger</div>
<div class="overlay" id="ov"><h2>Touché !</h2><p>Temps : <strong id="fin">0</strong>s</p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var pl,rocks,ov,loop,t,mx,my,spawnT;
function init(){pl={x:W/2,y:H/2,r:12};rocks=[];ov=false;t=0;mx=W/2;my=H/2;spawnT=0;document.getElementById('time').textContent='0';document.getElementById('ov').classList.remove('show');}
function upd(){t++;if(t%60===0)document.getElementById('time').textContent=Math.floor(t/60);pl.x+=(mx-pl.x)*0.15;pl.y+=(my-pl.y)*0.15;spawnT++;if(spawnT>20){spawnT=0;var side=Math.floor(Math.random()*4);var rx,ry;if(side===0){rx=Math.random()*W;ry=-20;}else if(side===1){rx=W+20;ry=Math.random()*H;}else if(side===2){rx=Math.random()*W;ry=H+20;}else{rx=-20;ry=Math.random()*H;}var ang=Math.atan2(H/2-ry,W/2-rx);rocks.push({x:rx,y:ry,vx:Math.cos(ang)*3,vy:Math.sin(ang)*3,r:8+Math.random()*8});}rocks.forEach(function(r){r.x+=r.vx;r.y+=r.vy;});rocks=rocks.filter(function(r){return r.x>-50&&r.x<W+50&&r.y>-50&&r.y<H+50;});rocks.forEach(function(r){if(Math.hypot(r.x-pl.x,r.y-pl.y)<r.r+pl.r){ov=true;document.getElementById('fin').textContent=Math.floor(t/60);document.getElementById('ov').classList.add('show');}});}
function draw(){x.fillStyle='#000';x.fillRect(0,0,W,H);for(var i=0;i<30;i++){x.fillStyle='#fff';x.fillRect((i*37)%W,(i*29)%H,1,1);}rocks.forEach(function(r){x.fillStyle='#ef4444';x.beginPath();x.arc(r.x,r.y,r.r,0,6.3);x.fill();});x.fillStyle='#22c55e';x.beginPath();x.arc(pl.x,pl.y,pl.r,0,6.3);x.fill();}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
c.addEventListener('mousemove',function(e){var r=c.getBoundingClientRect();mx=(e.clientX-r.left)*(W/r.width);my=(e.clientY-r.top)*(H/r.height);});
c.addEventListener('touchstart',function(e){e.preventDefault();var r=c.getBoundingClientRect();mx=(e.touches[0].clientX-r.left)*(W/r.width);my=(e.touches[0].clientY-r.top)*(H/r.height);},{passive:false});
c.addEventListener('touchmove',function(e){e.preventDefault();var r=c.getBoundingClientRect();mx=(e.touches[0].clientX-r.left)*(W/r.width);my=(e.touches[0].clientY-r.top)*(H/r.height);},{passive:false});
rst();
`, "space-dodge");
}

function caveFlight(): string {
  return wrap("Cave Flight", `
<h1>🦇 <span>Cave Flight</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="600" height="400"></canvas>
<div class="controls"><button ontouchstart="startFlap();event.preventDefault()" ontouchend="stopFlap();event.preventDefault()" onclick="toggleFlap()" style="width:180px;background:#a855f7;color:#fff">VOLER</button></div>
<div class="overlay" id="ov"><h2>Game Over</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var pl,obs,sc,ov,loop,flap,t;
function init(){pl={x:100,y:H/2,r:15};obs=[];sc=0;ov=false;flap=false;t=0;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function startFlap(){flap=true;}
function stopFlap(){flap=false;}
function toggleFlap(){flap=!flap;setTimeout(function(){flap=false;},150);}
window.startFlap=startFlap;window.stopFlap=stopFlap;window.toggleFlap=toggleFlap;
function upd(){t++;if(flap)pl.y-=5;else pl.y+=3;pl.y=Math.max(50,Math.min(H-30,pl.y));obs.forEach(function(o){o.x-=4;});obs=obs.filter(function(o){return o.x>-100;});if(t%40===0){var gap=120;var top=50+Math.random()*(H-gap-80);obs.push({x:W,top:top,gap:gap,passed:false});}obs.forEach(function(o){if(!o.passed&&o.x+40<pl.x){o.passed=true;sc+=10;document.getElementById('score').textContent=sc;}if(pl.x+pl.r>o.x&&pl.x-pl.r<o.x+40){if(pl.y-pl.r<o.top||pl.y+pl.r>o.top+o.gap){ov=true;document.getElementById('fin').textContent=sc;document.getElementById('ov').classList.add('show');}}});}
function draw(){x.fillStyle='#0a0a1a';x.fillRect(0,0,W,H);obs.forEach(function(o){x.fillStyle='#333';x.fillRect(o.x,0,40,o.top);x.fillRect(o.x,o.top+o.gap,40,H-o.top-o.gap);});x.fillStyle='#a855f7';x.beginPath();x.arc(pl.x,pl.y,pl.r,0,6.3);x.fill();}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key===' ')flap=true;});
document.addEventListener('keyup',function(e){if(e.key===' ')flap=false;});
c.addEventListener('mousedown',startFlap);c.addEventListener('mouseup',stopFlap);
c.addEventListener('touchstart',function(e){e.preventDefault();startFlap();},{passive:false});
c.addEventListener('touchend',function(e){e.preventDefault();stopFlap();},{passive:false});
rst();
`, "cave-flight");
}

function parkour(): string {
  return wrap("Parkour", `
<h1>🏃 <span>Parkour</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="500" height="500"></canvas>
<div class="controls"><button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button><button ontouchstart="jump();event.preventDefault()" onclick="jump()">JUMP</button><button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button></div>
<div class="overlay" id="ov"><h2>Chute !</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var pl,plats,sc,ov,loop,camX,camY;
function init(){pl={x:50,y:H-100,w:30,h:30,vx:0,vy:0,onG:false};plats=[{x:0,y:H-30,w:300,h:30},{x:350,y:H-100,w:150,h:20},{x:550,y:H-180,w:150,h:20},{x:750,y:H-260,w:150,h:20}];sc=0;ov=false;camX=0;camY=0;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function mv(d){pl.vx=d*6;}
function jump(){if(pl.onG){pl.vy=-14;pl.onG=false;}}
window.mv=mv;window.jump=jump;
function upd(){pl.x+=pl.vx;pl.vx*=0.92;pl.vy+=0.7;pl.y+=pl.vy;pl.onG=false;plats.forEach(function(p){if(pl.x+pl.w>p.x&&pl.x<p.x+p.w&&pl.y+pl.h>p.y&&pl.y+pl.h<p.y+p.h+15&&pl.vy>0){pl.y=p.y-pl.h;pl.vy=0;pl.onG=true;}});if(pl.y>H){ov=true;document.getElementById('fin').textContent=sc;document.getElementById('ov').classList.add('show');}var maxP=0;plats.forEach(function(p){if(p.x>maxP)maxP=p.x;});if(pl.x>maxP-100){plats.push({x:maxP+150,y:H-100-Math.random()*200,w:100+Math.random()*80,h:20});sc+=10;document.getElementById('score').textContent=sc;}camX=pl.x-W/3;if(camX<0)camX=0;camY=pl.y-H/2;if(camY<-100)camY=-100;if(camY>0)camY=0;}
function draw(){x.fillStyle='#0a0a1a';x.fillRect(0,0,W,H);x.save();x.translate(-camX,-camY);plats.forEach(function(p){x.fillStyle='#22c55e';x.fillRect(p.x,p.y,p.w,p.h);});x.fillStyle='#facc15';x.fillRect(pl.x,pl.y,pl.w,pl.h);x.restore();}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')mv(-1);if(e.key==='ArrowRight')mv(1);if(e.key===' ')jump();});
rst();
`, "parkour");
}

function dodgeball(): string {
  return wrap("Dodgeball", `
<h1>🔴 <span>Dodgeball</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Vies : <strong id="lives">3</strong></span></div>
<canvas id="g" width="600" height="400"></canvas>
<div class="controls"><button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button><button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button></div>
<div class="overlay" id="ov"><h2>Game Over</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var pl,balls,sc,lv,ov,loop,t;
function init(){pl={x:W/2-30,y:H-60,w:60,h:40};balls=[];sc=0;lv=3;ov=false;t=0;document.getElementById('score').textContent='0';document.getElementById('lives').textContent='3';document.getElementById('ov').classList.remove('show');}
function mv(d){pl.x+=d*30;pl.x=Math.max(0,Math.min(W-pl.w,pl.x));}
window.mv=mv;
function upd(){t++;if(t%50===0){var bvx=(Math.random()-0.5)*4;balls.push({x:Math.random()*(W-20),y:-20,vy:3+Math.random()*2,vx:bvx,r:12});}balls.forEach(function(b){b.x+=b.vx;b.y+=b.vy;});balls=balls.filter(function(b){return b.y<H+30;});balls.forEach(function(b){if(b.x>pl.x&&b.x<pl.x+pl.w&&b.y+b.r>pl.y){sc+=20;document.getElementById('score').textContent=sc;b.done=true;}});balls=balls.filter(function(b){return !b.done;});balls.forEach(function(b){if(b.x>pl.x&&b.x<pl.x+pl.w&&b.y+b.r>pl.y){lv--;document.getElementById('lives').textContent=lv;b.done=true;if(lv<=0){ov=true;document.getElementById('fin').textContent=sc;document.getElementById('ov').classList.add('show');}}});balls=balls.filter(function(b){return !b.done;});}
function draw(){x.fillStyle='#8b4513';x.fillRect(0,0,W,H);x.fillStyle='#22c55e';x.fillRect(pl.x,pl.y,pl.w,pl.h);x.fillStyle='#ef4444';balls.forEach(function(b){x.beginPath();x.arc(b.x,b.y,b.r,0,6.3);x.fill();});}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')mv(-1);if(e.key==='ArrowRight')mv(1);});
c.addEventListener('mousemove',function(e){var r=c.getBoundingClientRect();pl.x=(e.clientX-r.left)*(W/r.width)-pl.w/2;pl.x=Math.max(0,Math.min(W-pl.w,pl.x));});
c.addEventListener('touchmove',function(e){e.preventDefault();var r=c.getBoundingClientRect();pl.x=(e.touches[0].clientX-r.left)*(W/r.width)-pl.w/2;pl.x=Math.max(0,Math.min(W-pl.w,pl.x));},{passive:false});
rst();
`, "dodgeball");
}

function tankBattle2(): string {
  return wrap("Tank Battle 2", `
<h1>🚁 <span>Tank 3</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Vies : <strong id="lives">5</strong></span></div>
<canvas id="g" width="500" height="500"></canvas>
<div class="controls"><button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button><button ontouchstart="sh();event.preventDefault()" onclick="sh()">FIRE</button><button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button></div>
<div class="overlay" id="ov"><h2>Game Over</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var pl,en,bl,enBl,sc,lv,ov,loop,t;
function init(){pl={x:W/2-20,y:H-60,w:40,h:30};en=[];bl=[];enBl=[];sc=0;lv=5;ov=false;t=0;document.getElementById('score').textContent='0';document.getElementById('lives').textContent='5';document.getElementById('ov').classList.remove('show');}
function mv(d){pl.x+=d*20;pl.x=Math.max(0,Math.min(W-pl.w,pl.x));}
function sh(){if(ov)return;bl.push({x:pl.x+pl.w/2,y:pl.y,vy:-10});}
window.mv=mv;window.sh=sh;
function upd(){t++;if(t%60===0)en.push({x:Math.random()*(W-40),y:-40,w:40,h:30,hp:3,vy:1.5,t:0});en.forEach(function(e){e.y+=e.vy;e.t++;if(e.t%90===0)enBl.push({x:e.x+e.w/2,y:e.y+e.h,vy:6});});bl.forEach(function(b){b.y+=b.vy;});bl=bl.filter(function(b){return b.y>0;});enBl.forEach(function(b){b.y+=b.vy;});enBl=enBl.filter(function(b){return b.y<H;});bl.forEach(function(b){en.forEach(function(e){if(e.hp<=0)return;if(b.x>e.x&&b.x<e.x+e.w&&b.y>e.y&&b.y<e.y+e.h){e.hp--;b.y=-100;if(e.hp<=0){sc+=30;document.getElementById('score').textContent=sc;}}});});bl=bl.filter(function(b){return b.y>0;});enBl.forEach(function(b){if(b.x>pl.x&&b.x<pl.x+pl.w&&b.y>pl.y){lv--;document.getElementById('lives').textContent=lv;b.done=true;if(lv<=0){ov=true;document.getElementById('ov').classList.add('show');}}});enBl=enBl.filter(function(b){return !b.done;});en=en.filter(function(e){return e.hp>0&&e.y<H+50;});}
function draw(){x.fillStyle='#000';x.fillRect(0,0,W,H);x.fillStyle='#22c55e';x.fillRect(pl.x,pl.y,pl.w,pl.h);x.fillRect(pl.x+pl.w/2-3,pl.y-10,6,10);x.fillStyle='#facc15';bl.forEach(function(b){x.fillRect(b.x-2,b.y,4,8);});en.forEach(function(e){x.fillStyle='#ef4444';x.fillRect(e.x,e.y,e.w,e.h);x.fillStyle='#fff';x.fillRect(e.x-3,e.y-8,46*(e.hp/3),3);});x.fillStyle='#f97316';enBl.forEach(function(b){x.beginPath();x.arc(b.x,b.y,4,0,6.3);x.fill();});}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')mv(-1);if(e.key==='ArrowRight')mv(1);if(e.key===' ')sh();});
rst();
`, "tank-battle2");
}

function snowboard(): string {
  return wrap("Snowboard", `
<h1>🏂 <span>Snowboard</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="500" height="500"></canvas>
<div class="controls"><button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button><button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button></div>
<div class="overlay" id="ov"><h2>Chute !</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var pl,trees,sc,ov,loop,speed,t;
function init(){pl={x:W/2-20,y:H-100,w:40,h:40};trees=[];sc=0;ov=false;speed=5;t=0;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function mv(d){pl.x+=d*25;pl.x=Math.max(0,Math.min(W-pl.w,pl.x));}
window.mv=mv;
function upd(){t++;sc+=speed/10;document.getElementById('score').textContent=Math.floor(sc);speed+=0.003;trees.forEach(function(tr){tr.y+=speed;});trees=trees.filter(function(tr){return tr.y<H+50;});if(t%50===0)trees.push({x:Math.random()*(W-40),y:-50,w:40,h:50});trees.forEach(function(tr){if(pl.x<tr.x+tr.w&&pl.x+pl.w>tr.x&&pl.y<tr.y+tr.h&&pl.y+pl.h>tr.y){ov=true;document.getElementById('fin').textContent=Math.floor(sc);document.getElementById('ov').classList.add('show');}});}
function draw(){var grad=x.createLinearGradient(0,0,0,H);grad.addColorStop(0,'#87ceeb');grad.addColorStop(1,'#fff');x.fillStyle=grad;x.fillRect(0,0,W,H);trees.forEach(function(tr){x.fillStyle='#0f5132';x.beginPath();x.moveTo(tr.x+20,tr.y);x.lineTo(tr.x,tr.y+50);x.lineTo(tr.x+40,tr.y+50);x.closePath();x.fill();x.fillStyle='#8b4513';x.fillRect(tr.x+17,tr.y+45,6,10);});x.fillStyle='#facc15';x.fillRect(pl.x,pl.y,pl.w,pl.h);}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')mv(-1);if(e.key==='ArrowRight')mv(1);});
rst();
`, "snowboard");
}

function skateboard(): string {
  return wrap("Skateboard", `
<h1>🛹 <span>Skateboard</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="600" height="400"></canvas>
<div class="controls"><button ontouchstart="jump();event.preventDefault()" onclick="jump()" style="width:180px;background:#facc15;color:#000">SAUT</button></div>
<div class="overlay" id="ov"><h2>Chute !</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var pl,obstacles,sc,ov,loop,speed,t;
function init(){pl={x:100,y:H-80,w:30,h:30,vy:0,onG:true};obstacles=[];sc=0;ov=false;speed=5;t=0;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function jump(){if(ov||!pl.onG)return;pl.vy=-13;pl.onG=false;}
window.jump=jump;
function upd(){t++;sc+=speed/20;document.getElementById('score').textContent=Math.floor(sc);pl.vy+=0.7;pl.y+=pl.vy;pl.onG=false;if(pl.y+pl.h>H-60){pl.y=H-60-pl.h;pl.vy=0;pl.onG=true;}obstacles.forEach(function(o){o.x-=speed;});obstacles=obstacles.filter(function(o){return o.x>-50;});if(t%40===0)obstacles.push({x:W,h:20+Math.random()*40});obstacles.forEach(function(o){if(pl.x<o.x+20&&pl.x+pl.w>o.x&&pl.y+pl.h>H-60-o.h){ov=true;document.getElementById('fin').textContent=Math.floor(sc);document.getElementById('ov').classList.add('show');}});}
function draw(){x.fillStyle='#a0522d';x.fillRect(0,0,W,H);x.fillStyle='#666';x.fillRect(0,H-60,W,60);obstacles.forEach(function(o){x.fillStyle='#ef4444';x.fillRect(o.x,H-60-o.h,20,o.h);});x.fillStyle='#facc15';x.fillRect(pl.x,pl.y,pl.w,pl.h);}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key===' ')jump();});
c.addEventListener('click',jump);
rst();
`, "skateboard");
}

function bmx(): string {
  return wrap("BMX", `
<h1>🚴 <span>BMX</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="600" height="400"></canvas>
<div class="controls"><button ontouchstart="jump();event.preventDefault()" onclick="jump()" style="width:180px;background:#22c55e;color:#fff">SAUT</button></div>
<div class="overlay" id="ov"><h2>Chute !</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var pl,ramps,sc,ov,loop,speed,t;
function init(){pl={x:100,y:H-80,w:40,h:30,vy:0,onG:true};ramps=[];sc=0;ov=false;speed=5;t=0;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function jump(){if(ov||!pl.onG)return;pl.vy=-15;pl.onG=false;}
window.jump=jump;
function upd(){t++;sc+=speed/20;document.getElementById('score').textContent=Math.floor(sc);pl.vy+=0.8;pl.y+=pl.vy;pl.onG=false;if(pl.y+pl.h>H-60){pl.y=H-60-pl.h;pl.vy=0;pl.onG=true;}ramps.forEach(function(r){r.x-=speed;});ramps=ramps.filter(function(r){return r.x>-100;});if(t%80===0)ramps.push({x:W,w:80,h:40});ramps.forEach(function(r){if(pl.x+pl.w>r.x&&pl.x<r.x+r.w&&pl.y+pl.h>H-60-r.h&&pl.vy>=0){pl.vy=-18;sc+=20;document.getElementById('score').textContent=Math.floor(sc);}});}
function draw(){x.fillStyle='#87ceeb';x.fillRect(0,0,W,H);x.fillStyle='#7cb342';x.fillRect(0,H-60,W,60);ramps.forEach(function(r){x.fillStyle='#8b4513';x.beginPath();x.moveTo(r.x,H-60);x.lineTo(r.x+r.w,H-60);x.lineTo(r.x+r.w,H-60-r.h);x.closePath();x.fill();});x.fillStyle='#facc15';x.fillRect(pl.x,pl.y,pl.w,pl.h);x.fillStyle='#000';x.beginPath();x.arc(pl.x+10,pl.y+pl.h,10,0,6.3);x.fill();x.beginPath();x.arc(pl.x+pl.w-10,pl.y+pl.h,10,0,6.3);x.fill();}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key===' ')jump();});
c.addEventListener('click',jump);
rst();
`, "bmx");
}

function motocross(): string {
  return wrap("Motocross", `
<h1>🏍️ <span>Motocross</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="600" height="400"></canvas>
<div class="controls"><button ontouchstart="jump();event.preventDefault()" onclick="jump()" style="width:180px;background:#facc15;color:#000">SAUT</button></div>
<div class="overlay" id="ov"><h2>Chute !</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var pl,obstacles,sc,ov,loop,speed,t;
function init(){pl={x:100,y:H-80,w:50,h:30,vy:0,onG:true};obstacles=[];sc=0;ov=false;speed=6;t=0;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function jump(){if(ov||!pl.onG)return;pl.vy=-14;pl.onG=false;}
window.jump=jump;
function upd(){t++;sc+=speed/20;document.getElementById('score').textContent=Math.floor(sc);pl.vy+=0.7;pl.y+=pl.vy;pl.onG=false;if(pl.y+pl.h>H-60){pl.y=H-60-pl.h;pl.vy=0;pl.onG=true;}obstacles.forEach(function(o){o.x-=speed;});obstacles=obstacles.filter(function(o){return o.x>-50;});if(t%50===0)obstacles.push({x:W,w:30,h:20+Math.random()*40});obstacles.forEach(function(o){if(pl.x<o.x+o.w&&pl.x+pl.w>o.x&&pl.y+pl.h>H-60-o.h){ov=true;document.getElementById('fin').textContent=Math.floor(sc);document.getElementById('ov').classList.add('show');}});}
function draw(){x.fillStyle='#d2691e';x.fillRect(0,0,W,H);x.fillStyle='#8b4513';x.fillRect(0,H-60,W,60);obstacles.forEach(function(o){x.fillStyle='#ef4444';x.fillRect(o.x,H-60-o.h,o.w,o.h);});x.fillStyle='#facc15';x.fillRect(pl.x,pl.y,pl.w,pl.h);x.fillStyle='#000';x.beginPath();x.arc(pl.x+15,pl.y+pl.h,12,0,6.3);x.fill();x.beginPath();x.arc(pl.x+pl.w-15,pl.y+pl.h,12,0,6.3);x.fill();}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key===' ')jump();});
c.addEventListener('click',jump);
rst();
`, "motocross");
}

function trampoline(): string {
  return wrap("Trampoline", `
<h1>🤸 <span>Trampoline</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="500" height="500"></canvas>
<div class="controls"><button ontouchstart="jump();event.preventDefault()" onclick="jump()" style="width:200px;background:#22c55e;color:#fff">SAUTER</button></div>
<div class="overlay" id="ov"><h2>Terminé</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var pl,vy,sc,ov,loop;
function init(){pl={x:W/2-20,y:H-60,w:40,h:40};vy=0;sc=0;ov=false;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function jump(){if(ov)return;if(pl.y+pl.h>=H-80){vy=-12;}}
window.jump=jump;
function upd(){vy+=0.5;pl.y+=vy;if(pl.y+pl.h>H-80){pl.y=H-80-pl.h;if(Math.abs(vy)>3){sc++;document.getElementById('score').textContent=sc;}vy=-vy*0.9;if(Math.abs(vy)<1){vy=0;}}if(pl.y<0){pl.y=0;vy=0;}if(sc>=50){ov=true;document.getElementById('fin').textContent=sc;document.getElementById('ov').classList.add('show');}}
function draw(){x.fillStyle='#0a0a1a';x.fillRect(0,0,W,H);x.fillStyle='#22c55e';x.fillRect(W/2-100,H-80,200,10);x.fillStyle='#facc15';x.fillRect(pl.x,pl.y,pl.w,pl.h);}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key===' ')jump();});
c.addEventListener('click',jump);
rst();
`, "trampoline");
}

function wallClimb(): string {
  return wrap("Escalade", `
<h1>🧗 <span>Escalade</span></h1>
<div class="stats"><span>Altitude : <strong id="alt">0</strong>m</span></div>
<canvas id="g" width="400" height="500"></canvas>
<div class="controls">
<button ontouchstart="climb('l');event.preventDefault()" onclick="climb('l')">↖</button>
<button ontouchstart="climb('r');event.preventDefault()" onclick="climb('r')">↗</button>
</div>
<div class="overlay" id="ov"><h2>Chute !</h2><p>Altitude : <strong id="fin">0</strong>m</p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var pl,holds,alt,ov,loop,camY;
function init(){pl={x:W/2,y:H-80,w:30,h:30};holds=[];alt=0;ov=false;camY=0;for(var i=0;i<20;i++)holds.push({x:60+Math.random()*(W-120),y:H-100-i*80});document.getElementById('alt').textContent='0';document.getElementById('ov').classList.remove('show');}
function climb(d){if(ov)return;var tx=pl.x+(d==='l'?-30:30);var ty=pl.y-70;var best=null;var minD=999;holds.forEach(function(h){var dist=Math.hypot(h.x-tx,h.y-ty);if(dist<minD&&dist<100){minD=dist;best=h;}});if(best){pl.x=best.x;pl.y=best.y;alt+=10;document.getElementById('alt').textContent=alt;}} 
window.climb=climb;
function upd(){camY=pl.y-H/2;if(camY<-H)camY=-H;}
function draw(){x.fillStyle='#8b7355';x.fillRect(0,0,W,H);x.save();x.translate(0,-camY);holds.forEach(function(h){x.fillStyle='#facc15';x.beginPath();x.arc(h.x,h.y,15,0,6.3);x.fill();});x.fillStyle='#22c55e';x.fillRect(pl.x-15,pl.y-15,30,30);x.restore();}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;rst();
`, "wall-climb");
}

function diving(): string {
  return wrap("Plongeon", `
<h1>🤿 <span>Plongeon</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="500" height="500"></canvas>
<div class="controls"><button ontouchstart="jump();event.preventDefault()" onclick="jump()" style="width:200px;background:#06b6d4;color:#fff">PLONGER</button></div>
<div class="overlay" id="ov"><h2>Terminé</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var pl,vx,vy,sc,ov,loop,jumped;
function init(){pl={x:80,y:80,w:30,h:40};vx=0;vy=0;sc=0;ov=false;jumped=false;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function jump(){if(ov||jumped)return;jumped=true;vx=8;vy=-5;}
window.jump=jump;
function upd(){if(!jumped)return;vx*=0.99;vy+=0.3;pl.x+=vx;pl.y+=vy;if(pl.y+pl.h>H-80){var depth=pl.x;var pts=Math.max(0,Math.floor(depth/10));sc=pts;document.getElementById('fin').textContent=sc;ov=true;document.getElementById('ov').classList.add('show');}}
function draw(){x.fillStyle='#87ceeb';x.fillRect(0,0,W,H-80);x.fillStyle='#1e3a8a';x.fillRect(0,H-80,W,80);x.fillStyle='#8b4513';x.fillRect(0,0,100,80);x.fillStyle='#22c55e';x.fillRect(pl.x,pl.y,pl.w,pl.h);}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;rst();
`, "diving");
}

function surfing(): string {
  return wrap("Surf", `
<h1>🏄 <span>Surf</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="500" height="500"></canvas>
<div class="controls"><button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button><button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button></div>
<div class="overlay" id="ov"><h2>Chute !</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var pl,wave,sc,ov,loop,speed,t;
function init(){pl={x:W/2-25,y:H-80,w:50,h:20};wave=[];sc=0;ov=false;speed=4;t=0;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function mv(d){pl.x+=d*25;pl.x=Math.max(0,Math.min(W-pl.w,pl.x));}
window.mv=mv;
function upd(){t++;sc+=speed/20;document.getElementById('score').textContent=Math.floor(sc);wave.forEach(function(w){w.y+=speed;});wave=wave.filter(function(w){return w.y<H+50;});if(t%30===0)wave.push({x:Math.random()*(W-60),y:H,w:60,h:20,type:Math.random()<0.7?'wave':'shark'});wave.forEach(function(w){if(pl.x<w.x+w.w&&pl.x+pl.w>w.x&&pl.y<w.y+w.h&&pl.y+pl.h>w.y){if(w.type==='shark'){ov=true;document.getElementById('fin').textContent=Math.floor(sc);document.getElementById('ov').classList.add('show');}w.done=true;}});wave=wave.filter(function(w){return !w.done;});}
function draw(){x.fillStyle='#06b6d4';x.fillRect(0,0,W,H);for(var i=0;i<20;i++){x.fillStyle='rgba(255,255,255,0.3)';x.beginPath();x.arc((i*90+t*2)%W,(i*50+t*3)%H,4,0,6.3);x.fill();}wave.forEach(function(w){if(w.type==='shark'){x.font='40px system-ui';x.fillText('🦈',w.x,w.y);}else{x.fillStyle='#fff';x.beginPath();x.ellipse(w.x+30,w.y,30,10,0,0,6.3);x.fill();}});x.fillStyle='#facc15';x.fillRect(pl.x,pl.y,pl.w,pl.h);}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')mv(-1);if(e.key==='ArrowRight')mv(1);});
c.addEventListener('mousemove',function(e){var r=c.getBoundingClientRect();pl.x=(e.clientX-r.left)*(W/r.width)-pl.w/2;pl.x=Math.max(0,Math.min(W-pl.w,pl.x));});
c.addEventListener('touchmove',function(e){e.preventDefault();var r=c.getBoundingClientRect();pl.x=(e.touches[0].clientX-r.left)*(W/r.width)-pl.w/2;pl.x=Math.max(0,Math.min(W-pl.w,pl.x));},{passive:false});
rst();
`, "surfing");
}

function parachute(): string {
  return wrap("Parachute", `
<h1>🪂 <span>Parachute</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="500" height="500"></canvas>
<div class="controls"><button ontouchstart="open();event.preventDefault()" onclick="open()" style="width:200px;background:#facc15;color:#000">OUVRIR</button></div>
<div class="overlay" id="ov"><h2>Atterrissage</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var pl,vy,sc,ov,opened,t;
function init(){pl={x:W/2-20,y:50,w:40,h:40};vy=2;sc=0;ov=false;opened=false;t=0;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function open(){if(ov||opened)return;opened=true;vy=-2;}
window.open=open;
function upd(){t++;if(opened)vy+=0.05;else vy+=0.15;vy=Math.max(-3,Math.min(10,vy));pl.y+=vy;if(pl.y+pl.h>H-50){ov=true;var ok=vy<4&&!opened?0:1;if(vy<4)sc=100;else if(vy<8)sc=50;else sc=20;document.getElementById('fin').textContent=sc;document.getElementById('ov').classList.add('show');}}
function draw(){var grad=x.createLinearGradient(0,0,0,H);grad.addColorStop(0,'#87ceeb');grad.addColorStop(1,'#1e3a8a');x.fillStyle=grad;x.fillRect(0,0,W,H);x.fillStyle='#7cb342';x.fillRect(0,H-50,W,50);if(opened){x.fillStyle='#facc15';x.beginPath();x.arc(pl.x+20,pl.y-30,40,Math.PI,0);x.closePath();x.fill();}x.fillStyle='#facc15';x.fillRect(pl.x,pl.y,pl.w,pl.h);}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key===' ')open();});
c.addEventListener('click',open);
rst();
`, "parachute");
}
function zipLine(): string {
  return wrap("Tyrolienne", `
<h1>🎢 <span>Tyrolienne</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="600" height="400"></canvas>
<div class="controls"><button ontouchstart="jump();event.preventDefault()" onclick="jump()" style="width:200px;background:#facc15;color:#000">DÉCROCHER</button></div>
<div class="overlay" id="ov"><h2>Atterrissage</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var pl,sc,ov,loop,attached,vx,vy;
function init(){pl={x:50,y:100,w:30,h:30};sc=0;ov=false;attached=true;vx=3;vy=0;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function jump(){if(ov||!attached)return;attached=false;vy=2;}
window.jump=jump;
function upd(){if(attached){pl.x+=vx;pl.y+=vy;var ratio=pl.x/W;pl.y=100+(H-200)*ratio*0.3;if(pl.x>W-200){attached=false;vy=3;}}else{vy+=0.3;pl.x+=vx;pl.y+=vy;if(pl.y+pl.h>H-50){ov=true;var zone=(pl.x>W-150)?100:(pl.x>W-300)?50:20;document.getElementById('fin').textContent=zone;document.getElementById('ov').classList.add('show');}}}
function draw(){x.fillStyle='#87ceeb';x.fillRect(0,0,W,H);x.fillStyle='#7cb342';x.fillRect(0,H-50,W,50);x.strokeStyle='#333';x.lineWidth=3;x.beginPath();x.moveTo(0,100);x.lineTo(W,250);x.stroke();x.fillStyle='#facc15';x.fillRect(pl.x,pl.y,pl.w,pl.h);if(attached){x.fillStyle='#666';x.fillRect(pl.x+10,pl.y-20,4,20);}x.fillStyle='#22c55e';x.fillRect(W-150,H-50,100,30);}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key===' ')jump();});
c.addEventListener('click',jump);
rst();
`, "zip-line");
}
// ═══════════════════════════════════════════════════════════════
// PAQUET 14 : 25 JEUX (Société / Logique / Puzzle)
// ═══════════════════════════════════════════════════════════════

function echecsSimple(): string {
  return wrap("Échecs", `
<h1>♟️ <span>Échecs Simple</span></h1>
<div class="stats"><span id="turn">Aux blancs</span></div>
<div id="bd" style="display:grid;grid-template-columns:repeat(8,min(45px,11vw));gap:1px;background:#1a1a1a;padding:12px;border-radius:12px;border:2px solid #facc15"></div>
<div class="overlay" id="ov"><h2 id="ttl">Fini !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var N=8,board,sel,turn,ov,moves;
function init(){board=[];for(var y=0;y<N;y++){board[y]=[];for(var x=0;x<N;x++)board[y][x]='';}
board[0][0]='♜';board[0][7]='♜';board[0][4]='♚';board[0][3]='♛';
board[7][0]='♖';board[7][7]='♖';board[7][4]='♔';board[7][3]='♕';
for(var i=0;i<N;i++){board[1][i]='♟';board[6][i]='♙';}
sel=null;turn='W';ov=false;moves=0;document.getElementById('turn').textContent='Aux blancs';document.getElementById('ov').classList.remove('show');render();}
function render(){var b=document.getElementById('bd');b.innerHTML='';for(var y=0;y<N;y++)for(var x=0;x<N;x++){var v=board[y][x];var cc=document.createElement('div');var bg=(y+x)%2===0?'#f0d9b5':'#b58863';if(sel&&sel.y===y&&sel.x===x)bg='#facc15';cc.style.cssText='aspect-ratio:1;background:'+bg+';display:flex;align-items:center;justify-content:center;font-size:clamp(20px,4vw,32px);cursor:pointer;color:'+(v==='♙'||v==='♖'||v==='♔'||v==='♕'||v==='♗'||v==='♘'?'#fff':'#000');cc.textContent=v;cc.onclick=function(yy,xx){return function(){pick(yy,xx);};}(y,x);b.appendChild(cc);}}
function pick(y,x){if(ov)return;if(sel){var isWhite=board[sel.y][sel.x].match(/[♙♖♔♕♗♘]/);var targetWhite=board[y][x].match(/[♙♖♔♕♗♘]/);if(turn==='W'&&targetWhite)return;if(turn==='B'&&!targetWhite&&board[y][x])return;if(y===sel.y&&x===sel.x){sel=null;render();return;}board[y][x]=board[sel.y][sel.x];board[sel.y][sel.x]='';moves++;sel=null;turn=turn==='W'?'B':'W';document.getElementById('turn').textContent=turn==='W'?'Aux blancs':'Aux noirs';render();if(moves>=20){ov=true;document.getElementById('ttl').textContent='Nul après 20 coups';document.getElementById('ov').classList.add('show');}}else{if(board[y][x])sel={y:y,x:x};render();}}
function rst(){init();}
window.rst=rst;init();
`, "echecs-simple");
}

function solitaire2(): string {
  return wrap("Solitaire+", `
<h1>🃏 <span>Solitaire+</span></h1>
<div class="stats"><span>Coups : <strong id="moves">0</strong></span></div>
<div id="bd" style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;padding:20px;background:#0a4a1a;border-radius:12px;max-width:600px"></div>
<div class="controls" style="margin-top:16px"><button ontouchstart="draw();event.preventDefault()" onclick="draw()" style="width:180px;background:#facc15;color:#000">PIOCHER</button></div>
<div class="overlay" id="ov"><h2>Terminé</h2><p>Coups : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var COLORS=['♥','♦','♠','♣'],VALUES=['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
var deck,columns,moves,ov;
function init(){deck=[];COLORS.forEach(function(c){VALUES.forEach(function(v){deck.push({c:c,v:v});});});deck.sort(function(){return Math.random()-0.5;});columns=[[],[],[],[],[],[],[]];for(var i=0;i<7;i++)for(var j=0;j<=i;j++)columns[i].push(deck.pop());moves=0;ov=false;document.getElementById('moves').textContent='0';document.getElementById('ov').classList.remove('show');render();}
function render(){var b=document.getElementById('bd');b.innerHTML='';columns.forEach(function(col,ci){var stack=document.createElement('div');stack.style.cssText='width:70px;min-height:200px;display:flex;flex-direction:column;gap:2px;cursor:pointer';col.forEach(function(card,i){var cc=document.createElement('div');cc.style.cssText='width:70px;height:95px;background:#fff;border:2px solid #333;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:900;color:'+(card.c==='♥'||card.c==='♦'?'#ef4444':'#000');cc.textContent=card.v+card.c;cc.onclick=function(){click(ci);};stack.appendChild(cc);});if(col.length===0){var empty=document.createElement('div');empty.style.cssText='width:70px;height:95px;border:2px dashed #666;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#666';empty.textContent='+';empty.onclick=function(){click(ci);};stack.appendChild(empty);}b.appendChild(stack);});}
function click(ci){if(ov||columns[ci].length===0)return;var card=columns[ci].pop();moves++;document.getElementById('moves').textContent=moves;for(var i=0;i<7;i++){if(i===ci)continue;var top=columns[i][columns[i].length-1];if(!top||top.v===card.v||top.c===card.c){columns[i].push(card);card=null;break;}}if(card)columns[ci].push(card);render();if(columns.every(function(c){return c.length<=1;})){ov=true;document.getElementById('fin').textContent=moves;document.getElementById('ov').classList.add('show');}}
function draw(){if(ov)return;var col=columns[Math.floor(Math.random()*7)];if(col.length>0){moves++;document.getElementById('moves').textContent=moves;col.pop();render();}}
function rst(){init();}
window.rst=rst;window.draw=draw;init();
`, "solitaire-plus");
}

function rami(): string {
  return wrap("Rami", `
<h1>🎴 <span>Rami</span></h1>
<div class="stats"><span>Ta main : <strong id="ph">7</strong></span><span>IA : <strong id="dh">7</strong></span></div>
<div id="bd" style="padding:20px;background:#0a4a1a;border-radius:12px;max-width:500px;text-align:center"></div>
<div class="controls" style="margin-top:16px">
<button ontouchstart="drawCard();event.preventDefault()" onclick="drawCard()" style="background:#22c55e;color:#fff;width:120px">Piocher</button>
<button ontouchstart="playCard();event.preventDefault()" onclick="playCard()" style="background:#facc15;color:#000;width:120px">Jouer</button>
</div>
<div class="overlay" id="ov"><h2 id="ttl">Fin</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var hand,opp,deck,discard,ov;
function init(){hand=[];opp=[];deck=[];for(var i=0;i<52;i++)deck.push(i);deck.sort(function(){return Math.random()-0.5;});for(var i=0;i<7;i++){hand.push(deck.pop());opp.push(deck.pop());}discard=[deck.pop()];ov=false;document.getElementById('ov').classList.remove('show');render();}
function render(){var b=document.getElementById('bd');document.getElementById('ph').textContent=hand.length;document.getElementById('dh').textContent=opp.length;var h='<p style="color:#fff;margin-bottom:12px">Dernière défausse : <strong style="color:#facc15">'+((discard[discard.length-1]%13)+1)+'</strong></p>';h+='<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center">';hand.forEach(function(card,i){h+='<div style="padding:12px;background:#fff;color:#000;border-radius:8px;font-weight:900;cursor:pointer" onclick="playCard('+i+')">'+(card%13+1)+'</div>';});h+='</div>';b.innerHTML=h;}
function drawCard(){if(ov)return;if(deck.length===0)return;hand.push(deck.pop());render();}
function playCard(i){if(ov)return;if(i===undefined){i=0;}var card=hand.splice(i,1)[0];discard.push(card);if(hand.length===0){ov=true;document.getElementById('ttl').textContent='🎉 Gagné !';document.getElementById('ov').classList.add('show');return;}if(Math.random()<0.3){opp.push(deck.pop());}if(opp.length===0){ov=true;document.getElementById('ttl').textContent='😢 Perdu';document.getElementById('ov').classList.add('show');return;}render();}
function rst(){init();}
window.rst=rst;window.drawCard=drawCard;window.playCard=playCard;init();
`, "rami");
}

function loto(): string {
  return wrap("Loto", `
<h1>🎱 <span>Loto</span></h1>
<div class="stats"><span>Ton numéro : <strong id="your">-</strong></span><span>Tours : <strong id="rounds">0</strong></span></div>
<div id="bd" style="padding:20px;background:#1a1a1a;border-radius:12px;max-width:500px;text-align:center"></div>
<div class="controls" style="margin-top:16px"><button ontouchstart="draw();event.preventDefault()" onclick="draw()" style="width:180px;background:#22c55e;color:#fff">TIRER</button></div>
<div class="overlay" id="ov"><h2>Terminé</h2><p>Tours : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var your,opp,drawn,rounds,ov;
function init(){your=Math.floor(Math.random()*90)+1;opp=Math.floor(Math.random()*90)+1;drawn=[];rounds=0;ov=false;document.getElementById('your').textContent=your;document.getElementById('rounds').textContent='0';document.getElementById('ov').classList.remove('show');render();}
function render(){var b=document.getElementById('bd');var h='<p style="color:#facc15;font-size:20px;font-weight:900;margin-bottom:16px">Ton numéro : '+your+'</p>';h+='<p style="color:#fff;margin-bottom:12px">Numéros tirés : '+drawn.slice(-10).join(', ')+'</p>';b.innerHTML=h;}
function draw(){if(ov)return;var n=Math.floor(Math.random()*90)+1;if(drawn.indexOf(n)<0)drawn.push(n);rounds++;document.getElementById('rounds').textContent=rounds;if(n===your){ov=true;document.getElementById('fin').textContent=rounds;document.getElementById('ov').classList.add('show');return;}if(drawn.length>=85){ov=true;document.getElementById('fin').textContent=rounds;document.getElementById('ov').classList.add('show');return;}render();}
function rst(){init();}
window.rst=rst;window.draw=draw;init();
`, "loto");
}

function keno(): string {
  return wrap("Keno", `
<h1>🎯 <span>Keno</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<div id="bd" style="display:grid;grid-template-columns:repeat(10,min(35px,8vw));gap:4px;background:#1a1a1a;padding:12px;border-radius:12px"></div>
<div class="controls" style="margin-top:16px">
<button ontouchstart="play();event.preventDefault()" onclick="play()" style="width:180px;background:#22c55e;color:#fff">JOUER (10 numéros)</button>
</div>
<div class="overlay" id="ov"><h2>Terminé</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var picked,drawn,sc,ov,plays;
function init(){picked=[];drawn=[];sc=0;ov=false;plays=0;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');render();}
function render(){var b=document.getElementById('bd');b.innerHTML='';for(var i=1;i<=80;i++){var cc=document.createElement('div');var bg='#2a2a2a';if(picked.indexOf(i)>=0)bg='#facc15';if(drawn.indexOf(i)>=0)bg='#ef4444';cc.style.cssText='aspect-ratio:1;background:'+bg+';border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:clamp(10px,2vw,14px);cursor:pointer;color:#fff;font-weight:900';cc.textContent=i;cc.onclick=function(n){return function(){pick(n);};}(i);b.appendChild(cc);}}
function pick(n){if(ov)return;if(picked.indexOf(n)>=0)picked.splice(picked.indexOf(n),1);else if(picked.length<10)picked.push(n);render();}
function play(){if(ov||picked.length!==10)return;drawn=[];for(var i=0;i<20;i++){var n=Math.floor(Math.random()*80)+1;if(drawn.indexOf(n)<0)drawn.push(n);}var hits=0;picked.forEach(function(n){if(drawn.indexOf(n)>=0)hits++;});sc=hits*10;document.getElementById('score').textContent=sc;plays++;if(plays>=5){ov=true;document.getElementById('fin').textContent=sc;document.getElementById('ov').classList.add('show');}render();}
function rst(){init();}
window.rst=rst;window.play=play;init();
`, "keno");
}

function roulette(): string {
  return wrap("Roulette", `
<h1>🎡 <span>Roulette</span></h1>
<div class="stats"><span>Jetons : <strong id="coins">1000</strong></span></div>
<div id="bd" style="text-align:center;padding:30px;background:#0a4a1a;border-radius:16px;max-width:500px"></div>
<div class="controls" style="margin-top:16px">
<button ontouchstart="bet('red');event.preventDefault()" onclick="bet('red')" style="background:#ef4444;color:#fff;width:80px">Rouge</button>
<button ontouchstart="bet('black');event.preventDefault()" onclick="bet('black')" style="background:#000;color:#fff;width:80px">Noir</button>
<button ontouchstart="bet('green');event.preventDefault()" onclick="bet('green')" style="background:#22c55e;color:#fff;width:80px">Vert</button>
</div>
<div class="overlay" id="ov"><h2>💀 Ruine</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var coins,ov,history;
function init(){coins=1000;ov=false;history=[];document.getElementById('coins').textContent='1000';document.getElementById('ov').classList.remove('show');render('Choisis une couleur');}
function render(msg){var h='<p style="color:#facc15;font-size:22px;font-weight:900;margin-bottom:16px">'+(msg||'')+'</p>';if(history.length>0){h+='<p style="color:#fff;margin-bottom:12px">Derniers : '+history.slice(-5).join(' · ')+'</p>';}h+='<p style="color:#888">Jetons : '+coins+'</p>';document.getElementById('bd').innerHTML=h;}
function bet(color){if(ov||coins<10)return;coins-=10;var n=Math.floor(Math.random()*37);var result=n===0?'green':(n%2===0?'black':'red');history.push(n+(result==='red'?'R':result==='black'?'N':'V'));var won=result===color;if(won){var gain=color==='green'?350:(color==='red'||color==='black')?20:10;coins+=gain;document.getElementById('coins').textContent=coins;render('🎉 '+n+' '+result+' ! +'+gain);}else{document.getElementById('coins').textContent=coins;render('😢 '+n+' '+result);}if(coins<=0){ov=true;document.getElementById('ov').classList.add('show');}}
function rst(){init();}
window.rst=rst;window.bet=bet;init();
`, "roulette");
}

function blackjack2(): string {
  return wrap("Blackjack+", `
<h1>🃏 <span>Blackjack+</span></h1>
<div class="stats"><span>Toi : <strong id="ps">0</strong></span><span>Croupier : <strong id="ds">0</strong></span><span>Jetons : <strong id="chips">100</strong></span></div>
<div id="bd" style="background:#1a1a1a;padding:20px;border-radius:12px;text-align:center;max-width:500px"></div>
<div class="controls" style="margin-top:16px">
<button ontouchstart="hit();event.preventDefault()" onclick="hit()" style="background:#22c55e;color:#fff;width:100px">Tirer</button>
<button ontouchstart="stand();event.preventDefault()" onclick="stand()" style="background:#facc15;color:#000;width:100px">Rester</button>
</div>
<div class="overlay" id="ov"><h2>💀 Ruine</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var player,dealer,deck,chips,ov;
function newDeck(){var d=[];['♠','♥','♦','♣'].forEach(function(s){[2,3,4,5,6,7,8,9,10,10,10,10,11].forEach(function(v){d.push({s:s,v:v});});});return d.sort(function(){return Math.random()-0.5;});}
function init(){deck=newDeck();player=[deck.pop(),deck.pop()];dealer=[deck.pop(),deck.pop()];chips=100;ov=false;document.getElementById('chips').textContent='100';document.getElementById('ov').classList.remove('show');render();}
function val(h){var v=0,a=0;h.forEach(function(c){if(c.v===11){v+=11;a++;}else v+=c.v;});while(v>21&&a>0){v-=10;a--;}return v;}
function render(){var h='<p style="color:#fff;margin-bottom:12px">Tes cartes ('+val(player)+')</p><div style="font-size:36px;color:#fff">'+player.map(function(c){return c.s+c.v;}).join(' ')+'</div>';h+='<p style="color:#fff;margin:20px 0 12px">Croupier ('+(ov?val(dealer):'?')+')</p><div style="font-size:36px;color:#facc15">'+(ov?dealer.map(function(c){return c.s+c.v;}).join(' '):dealer[0].s+dealer[0].v+' ??')+'</div>';document.getElementById('bd').innerHTML=h;document.getElementById('ps').textContent=val(player);document.getElementById('ds').textContent=ov?val(dealer):'?';}
function hit(){if(ov)return;player.push(deck.pop());render();if(val(player)>21){end('Bust ! -20');}}
function stand(){if(ov)return;while(val(dealer)<17)dealer.push(deck.pop());render();var pv=val(player),dv=val(dealer);if(dv>21||pv>dv)end('🎉 Gagné +20');else if(pv<dv)end('😢 Perdu -20');else end('Match nul');}
function end(msg){ov=true;if(msg.indexOf('Gagné')>=0)chips+=20;else if(msg.indexOf('Perdu')>=0)chips-=20;document.getElementById('chips').textContent=chips;render();document.getElementById('ov').classList.add('show');setTimeout(function(){if(chips>0){document.getElementById('ov').classList.remove('show');init();}else{document.getElementById('ov').classList.add('show');}},1500);}
function rst(){init();}
window.rst=rst;window.hit=hit;window.stand=stand;init();
`, "blackjack2");
}

function poker2(): string {
  return wrap("Poker+", `
<h1>♠️ <span>Poker+</span></h1>
<div class="stats"><span>Jetons : <strong id="chip">1000</strong></span></div>
<div id="bd" style="background:#0a4a1a;padding:30px;border-radius:16px;border:4px solid #d4af37;max-width:600px;text-align:center"></div>
<div class="controls" style="margin-top:16px">
<button ontouchstart="fold();event.preventDefault()" onclick="fold()" style="background:#ef4444;color:#fff;width:100px">Passer</button>
<button ontouchstart="call();event.preventDefault()" onclick="call()" style="background:#facc15;color:#000;width:100px">Suivre</button>
<button ontouchstart="raise();event.preventDefault()" onclick="raise()" style="background:#22c55e;color:#fff;width:100px">Relancer</button>
</div>
<div class="overlay" id="ov"><h2>💀 Ruine</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var SUITS=['♠','♥','♦','♣'],RANKS=['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
var hand,opp,chip,ov;
function newDeck(){var d=[];SUITS.forEach(function(s){RANKS.forEach(function(r){d.push({s:s,r:r});});});return d.sort(function(){return Math.random()-0.5;});}
function init(){var d=newDeck();hand=[d.pop(),d.pop(),d.pop(),d.pop(),d.pop()];opp=[d.pop(),d.pop(),d.pop(),d.pop(),d.pop()];chip=1000;ov=false;document.getElementById('chip').textContent='1000';document.getElementById('ov').classList.remove('show');render();}
function val(h){var counts={};h.forEach(function(c){counts[c.r]=(counts[c.r]||0)+1;});var vals=Object.values(counts).sort().reverse();if(vals[0]===4)return 7;if(vals[0]===3&&vals[1]===2)return 6;if(vals[0]===3)return 3;if(vals[0]===2&&vals[1]===2)return 2;if(vals[0]===2)return 1;return 0;}
function render(){var h='<p style="color:#fff;font-size:20px;margin-bottom:12px">Ta main</p><div style="display:flex;gap:8px;justify-content:center;margin-bottom:16px">';hand.forEach(function(c){h+='<div style="padding:12px;background:#fff;color:'+(c.s==='♥'||c.s==='♦'?'#ef4444':'#000')+';border-radius:8px;font-weight:900;font-size:20px;min-width:45px">'+c.r+'<br>'+c.s+'</div>';});h+='</div><p style="color:#facc15;font-weight:900">Force: '+val(hand)+'</p>';document.getElementById('bd').innerHTML=h;}
function end(delta,msg){chip+=delta;document.getElementById('chip').textContent=chip;if(chip<=0){ov=true;document.getElementById('ov').classList.add('show');return;}setTimeout(init,800);}
function fold(){if(ov)return;end(-50);}
function call(){if(ov)return;var d=val(hand)>val(opp)?150:-150;end(d);}
function raise(){if(ov)return;var d=val(hand)>val(opp)?300:-300;end(d);}
function rst(){init();}
window.rst=rst;window.fold=fold;window.call=call;window.raise=raise;init();
`, "poker2");
}

function dameDePique(): string {
  return wrap("Dame de Pique", `
<h1>♠️ <span>Dame de Pique</span></h1>
<div class="stats"><span>Toi : <strong id="ps">0</strong></span><span>IA : <strong id="ds">0</strong></span></div>
<div id="bd" style="padding:20px;background:#0a4a1a;border-radius:12px;max-width:500px;text-align:center"></div>
<div class="controls" style="margin-top:16px"><button ontouchstart="play();event.preventDefault()" onclick="play()" style="width:180px;background:#22c55e;color:#fff">JOUER UNE CARTE</button></div>
<div class="overlay" id="ov"><h2 id="ttl">Fin</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var hand,ps,ds,ov,rounds;
function init(){hand=[];for(var i=0;i<13;i++)hand.push(Math.floor(Math.random()*52));ps=0;ds=0;rounds=0;ov=false;document.getElementById('ps').textContent='0';document.getElementById('ds').textContent='0';document.getElementById('ov').classList.remove('show');render();}
function render(){var h='<p style="color:#fff;margin-bottom:12px">Tes cartes :</p><div style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center">';hand.forEach(function(c,i){h+='<div style="padding:10px;background:#fff;color:#000;border-radius:6px;cursor:pointer;font-weight:900" onclick="play('+i+')">'+(c%13+1)+'</div>';});h+='</div>';document.getElementById('bd').innerHTML=h;}
function play(i){if(ov)return;if(i===undefined){i=0;}var c=hand.splice(i,1)[0];rounds++;if(Math.random()<0.4){ps++;document.getElementById('ps').textContent=ps;}else{ds++;document.getElementById('ds').textContent=ds;}if(hand.length===0){ov=true;document.getElementById('ttl').textContent=ps<ds?'🎉 Gagné':'😢 Perdu';document.getElementById('ov').classList.add('show');return;}render();}
function rst(){init();}
window.rst=rst;window.play=play;init();
`, "dame-pique");
}

function belote(): string {
  return wrap("Belote", `
<h1>🃏 <span>Belote</span></h1>
<div class="stats"><span>Toi : <strong id="ps">0</strong></span><span>IA : <strong id="ds">0</strong></span></div>
<div id="bd" style="padding:20px;background:#1a1a1a;border-radius:12px;max-width:500px;text-align:center"></div>
<div class="controls" style="margin-top:16px"><button ontouchstart="play();event.preventDefault()" onclick="play()" style="width:180px;background:#22c55e;color:#fff">JOUER UNE CARTE</button></div>
<div class="overlay" id="ov"><h2 id="ttl">Fin</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var hand,ps,ds,ov,rounds;
function init(){hand=[];for(var i=0;i<8;i++)hand.push(Math.floor(Math.random()*32));ps=0;ds=0;rounds=0;ov=false;document.getElementById('ps').textContent='0';document.getElementById('ds').textContent='0';document.getElementById('ov').classList.remove('show');render();}
function render(){var h='<p style="color:#fff;margin-bottom:12px">Tes cartes :</p><div style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center">';hand.forEach(function(c,i){h+='<div style="padding:10px;background:#fff;color:#000;border-radius:6px;cursor:pointer;font-weight:900" onclick="play('+i+')">'+(c%8+1)+'</div>';});h+='</div>';document.getElementById('bd').innerHTML=h;}
function play(i){if(ov)return;if(i===undefined){i=0;}hand.splice(i,1);rounds++;if(Math.random()<0.5){ps+=10;document.getElementById('ps').textContent=ps;}else{ds+=10;document.getElementById('ds').textContent=ds;}if(hand.length===0){ov=true;document.getElementById('ttl').textContent=ps>ds?'🎉 Gagné':'😢 Perdu';document.getElementById('ov').classList.add('show');return;}render();}
function rst(){init();}
window.rst=rst;window.play=play;init();
`, "belote");
}

function tarot(): string {
  return wrap("Tarot", `
<h1>🔮 <span>Tarot</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<div id="bd" style="text-align:center;padding:40px;background:linear-gradient(135deg,#1a0a2e,#0a0014);border-radius:16px;max-width:500px"></div>
<div class="controls" style="margin-top:16px"><button ontouchstart="draw();event.preventDefault()" onclick="draw()" style="width:180px;background:#a855f7;color:#fff">TIRER UNE CARTE</button></div>
<div class="overlay" id="ov"><h2>Terminé</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var CARDS=['Le Mat','Le Bateleur','La Papesse','L\'Impératrice','L\'Empereur','Le Pape','L\'Amoureux','Le Chariot','La Justice','L\'Hermite','La Roue','La Force','Le Pendu','La Mort','Tempérance','Le Diable','La Tour','L\'Étoile','La Lune','Le Soleil','Le Jugement','Le Monde'];
var sc,drawn,ov;
function init(){sc=0;drawn=[];ov=false;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');render();}
function render(){var h='<p style="color:#facc15;font-size:20px;margin-bottom:16px">Carte tirée :</p>';if(drawn.length===0){h+='<p style="color:#888;font-size:60px">🎴</p>';}else{h+='<p style="color:#fff;font-size:28px;font-weight:900">'+drawn[drawn.length-1]+'</p>';}h+='<p style="color:#888;margin-top:16px">Cartes tirées : '+drawn.length+'</p>';document.getElementById('bd').innerHTML=h;}
function draw(){if(ov)return;var card=CARDS[Math.floor(Math.random()*CARDS.length)];drawn.push(card);sc++;document.getElementById('score').textContent=sc;if(drawn.length>=10){ov=true;document.getElementById('fin').textContent=sc;document.getElementById('ov').classList.add('show');}render();}
function rst(){init();}
window.rst=rst;window.draw=draw;init();
`, "tarot");
}

function unoPro(): string {
  return wrap("Uno Pro+", `
<h1>🎴 <span>Uno Pro+</span></h1>
<div class="stats"><span>Toi : <strong id="pc">7</strong></span><span>IA : <strong id="dc">7</strong></span></div>
<div id="bd" style="padding:20px;background:#0a4a1a;border-radius:12px;max-width:500px;text-align:center"></div>
<div class="controls" style="margin-top:16px">
<button ontouchstart="drawCard();event.preventDefault()" onclick="drawCard()" style="background:#22c55e;color:#fff;width:120px">Piocher</button>
</div>
<div class="overlay" id="ov"><h2 id="ttl">Fin</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var COLS=['🔴','🔵','🟢','🟡'];
var pl,ai,deck,cur,ov;
function makeDeck(){var d=[];COLS.forEach(function(c){for(var n=1;n<=9;n++)d.push({c:c,n:n});});return d.sort(function(){return Math.random()-0.5;});}
function init(){deck=makeDeck();pl=[];ai=[];for(var i=0;i<7;i++){pl.push(deck.pop());ai.push(deck.pop());}cur=deck.pop();ov=false;document.getElementById('ov').classList.remove('show');render();}
function render(){document.getElementById('pc').textContent=pl.length;document.getElementById('dc').textContent=ai.length;var h='<p style="color:#fff">Carte actuelle</p><div style="font-size:60px;margin:12px">'+cur.c+cur.n+'</div><p style="color:#fff">Tes cartes</p><div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin-top:8px">';pl.forEach(function(c,i){h+='<div style="padding:8px;background:#2a2a2a;border-radius:6px;font-size:22px;cursor:pointer" onclick="playIdx('+i+')">'+c.c+c.n+'</div>';});h+='</div>';document.getElementById('bd').innerHTML=h;}
function playIdx(i){if(ov)return;var c=pl[i];if(c.c!==cur.c&&c.n!==cur.n)return;cur=c;pl.splice(i,1);render();if(pl.length===0){ov=true;document.getElementById('ttl').textContent='🎉 Gagné';document.getElementById('ov').classList.add('show');return;}setTimeout(aiTurn,600);}
function drawCard(){if(ov)return;if(deck.length===0)return;pl.push(deck.pop());render();setTimeout(aiTurn,600);}
function aiTurn(){if(ov)return;for(var i=0;i<ai.length;i++){if(ai[i].c===cur.c||ai[i].n===cur.n){cur=ai[i];ai.splice(i,1);render();if(ai.length===0){ov=true;document.getElementById('ttl').textContent='😢 IA gagne';document.getElementById('ov').classList.add('show');}return;}}if(deck.length)ai.push(deck.pop());render();}
function rst(){init();}
window.rst=rst;window.playIdx=playIdx;window.drawCard=drawCard;init();
`, "uno-pro");
}

function baccarat(): string {
  return wrap("Baccarat", `
<h1>🎰 <span>Baccarat</span></h1>
<div class="stats"><span>Jetons : <strong id="chip">1000</strong></span></div>
<div id="bd" style="background:#0a4a1a;padding:30px;border-radius:16px;border:4px solid #d4af37;max-width:600px;text-align:center"></div>
<div class="controls" style="margin-top:16px">
<button ontouchstart="bet('player');event.preventDefault()" onclick="bet('player')" style="background:#3b82f6;color:#fff;width:100px">Joueur</button>
<button ontouchstart="bet('banker');event.preventDefault()" onclick="bet('banker')" style="background:#ef4444;color:#fff;width:100px">Banquier</button>
<button ontouchstart="bet('tie');event.preventDefault()" onclick="bet('tie')" style="background:#facc15;color:#000;width:100px">Égalité</button>
</div>
<div class="overlay" id="ov"><h2>💀 Ruine</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var chip,ov,lastResult;
function init(){chip=1000;ov=false;lastResult='';document.getElementById('chip').textContent='1000';document.getElementById('ov').classList.remove('show');render();}
function render(){var h='<p style="color:#facc15;font-size:20px;margin-bottom:16px">Choisis ton pari</p>';if(lastResult)h+='<p style="color:#fff;font-size:18px;margin-bottom:12px">Dernier : '+lastResult+'</p>';h+='<p style="color:#888">Jetons : '+chip+'</p>';document.getElementById('bd').innerHTML=h;}
function bet(type){if(ov||chip<10)return;chip-=10;var p=(Math.floor(Math.random()*10));var b=(Math.floor(Math.random()*10));var result=p>b?'player':p<b?'banker':'tie';lastResult='J:'+p+' B:'+b+' → '+result;if(result===type){var gain=type==='tie'?80:20;chip+=gain;}else if(type!=='tie'&&result!=='tie'){chip-=10;}document.getElementById('chip').textContent=chip;if(chip<=0){ov=true;document.getElementById('ov').classList.add('show');}render();}
function rst(){init();}
window.rst=rst;window.bet=bet;init();
`, "baccarat");
}

function craps(): string {
  return wrap("Craps", `
<h1>🎲 <span>Craps</span></h1>
<div class="stats"><span>Jetons : <strong id="chip">500</strong></span></div>
<div id="bd" style="text-align:center;padding:30px;background:#0a4a1a;border-radius:16px;max-width:500px"></div>
<div class="controls" style="margin-top:16px">
<button ontouchstart="roll();event.preventDefault()" onclick="roll()" style="width:180px;background:#facc15;color:#000">LANCER (10)</button>
</div>
<div class="overlay" id="ov"><h2>💀 Ruine</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var chip,ov,history;
function init(){chip=500;ov=false;history=[];document.getElementById('chip').textContent='500';document.getElementById('ov').classList.remove('show');render();}
function render(){var h='<p style="color:#facc15;font-size:22px;margin-bottom:16px">Dernier lancer</p>';if(history.length>0){h+='<p style="color:#fff;font-size:32px;font-weight:900">'+history[history.length-1]+'</p>';}h+='<p style="color:#888;margin-top:16px">Historique : '+history.slice(-5).join(', ')+'</p>';document.getElementById('bd').innerHTML=h;}
function roll(){if(ov||chip<10)return;chip-=10;var d1=Math.floor(Math.random()*6)+1,d2=Math.floor(Math.random()*6)+1;var total=d1+d2;history.push(d1+'+'+d2+'='+total);if(total===7||total===11){chip+=30;}else if(total===2||total===3||total===12){chip-=10;}else{chip-=10;}document.getElementById('chip').textContent=chip;if(chip<=0){ov=true;document.getElementById('ov').classList.add('show');}render();}
function rst(){init();}
window.rst=rst;window.roll=roll;init();
`, "craps");
}

function desY(): string {
  return wrap("Dés du Destin", `
<h1>🎲 <span>Dés du Destin</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Manche : <strong id="round">1</strong>/10</span></div>
<div id="bd" style="text-align:center;padding:30px;background:#1a1a1a;border-radius:16px;max-width:500px"></div>
<div class="controls" style="margin-top:16px"><button ontouchstart="roll();event.preventDefault()" onclick="roll()" style="width:180px;background:#22c55e;color:#fff">LANCER 3 DÉS</button></div>
<div class="overlay" id="ov"><h2>Terminé</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var EM=['⚀','⚁','⚂','⚃','⚄','⚅'];
var sc,round,ov,lastDice;
function init(){sc=0;round=0;ov=false;lastDice=[];document.getElementById('score').textContent='0';document.getElementById('round').textContent='1';document.getElementById('ov').classList.remove('show');render();}
function render(){var h='<p style="color:#facc15;font-size:22px;margin-bottom:16px">Lance les dés !</p>';if(lastDice.length>0){h+='<div style="display:flex;gap:16px;justify-content:center;font-size:60px">';lastDice.forEach(function(d){h+='<span>'+EM[d-1]+'</span>';});h+='</div><p style="color:#fff;font-size:24px;margin-top:16px">Total : '+lastDice.reduce(function(a,b){return a+b;},0)+'</p>';}document.getElementById('bd').innerHTML=h;}
function roll(){if(ov)return;lastDice=[Math.floor(Math.random()*6)+1,Math.floor(Math.random()*6)+1,Math.floor(Math.random()*6)+1];var total=lastDice.reduce(function(a,b){return a+b;},0);if(total>=12)sc+=total;round++;document.getElementById('score').textContent=sc;document.getElementById('round').textContent=Math.min(round+1,10);if(round>=10){ov=true;document.getElementById('fin').textContent=sc;document.getElementById('ov').classList.add('show');}render();}
function rst(){init();}
window.rst=rst;window.roll=roll;init();
`, "des-destin");
}

function memoryFormula(): string {
  return wrap("Memory Formules", `
<h1>🧪 <span>Memory Formules</span></h1>
<div class="stats"><span>Paires : <strong id="p">0</strong>/6</span></div>
<div id="bd" style="display:grid;grid-template-columns:repeat(4,min(70px,18vw));gap:8px;background:#1a1a1a;padding:12px;border-radius:12px;border:2px solid #06b6d4"></div>
<div class="overlay" id="ov"><h2>🎉 Bravo !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var ICO=['H₂O','CO₂','NaCl','O₂','H₂','N₂'],f,s,lock,mat,cds;
function init(){cds=ICO.concat(ICO).sort(function(){return Math.random()-0.5;});f=null;s=null;lock=false;mat=0;document.getElementById('p').textContent='0';document.getElementById('ov').classList.remove('show');render();}
function render(){var b=document.getElementById('bd');b.innerHTML='';cds.forEach(function(e,i){var cc=document.createElement('div');cc.style.cssText='width:100%;aspect-ratio:1;background:#2a2a2a;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:clamp(14px,3vw,22px);cursor:pointer;color:#fff;font-weight:900';cc.textContent='?';cc.dataset.idx=i;cc.dataset.em=e;cc.onclick=function(){flip(i,cc);};b.appendChild(cc);});}
function flip(i,cc){if(lock||cc.dataset.m==='1'||cc.textContent!=='?')return;cc.textContent=cc.dataset.em;cc.style.background='#06b6d4';if(f===null){f=i;return;}if(s===null){s=i;lock=true;var c1=document.querySelector('[data-idx="'+f+'"]'),c2=cc;if(c1.dataset.em===c2.dataset.em){c1.dataset.m='1';c2.dataset.m='1';c1.style.background='#22c55e';c2.style.background='#22c55e';mat++;document.getElementById('p').textContent=mat;f=null;s=null;lock=false;if(mat===6)setTimeout(function(){document.getElementById('ov').classList.add('show');},300);}else{setTimeout(function(){c1.textContent='?';c1.style.background='#2a2a2a';c2.textContent='?';c2.style.background='#2a2a2a';f=null;s=null;lock=false;},800);}}}
function rst(){init();}
window.rst=rst;init();
`, "memory-formules");
}

function memoryEmoji2(): string {
  return wrap("Memory Fruits", `
<h1>🍓 <span>Memory Fruits</span></h1>
<div class="stats"><span>Paires : <strong id="p">0</strong>/8</span></div>
<div id="bd" style="display:grid;grid-template-columns:repeat(4,min(70px,18vw));gap:8px;background:#1a1a1a;padding:12px;border-radius:12px;border:2px solid #ec4899"></div>
<div class="overlay" id="ov"><h2>🎉 Bravo !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var ICO=['🍓','🍎','🍊','🍋','🍉','🍇','🥝','🍒'],f,s,lock,mat,cds;
function init(){cds=ICO.concat(ICO).sort(function(){return Math.random()-0.5;});f=null;s=null;lock=false;mat=0;document.getElementById('p').textContent='0';document.getElementById('ov').classList.remove('show');render();}
function render(){var b=document.getElementById('bd');b.innerHTML='';cds.forEach(function(e,i){var cc=document.createElement('div');cc.style.cssText='width:100%;aspect-ratio:1;background:#2a2a2a;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:clamp(20px,5vw,32px);cursor:pointer';cc.textContent='?';cc.dataset.idx=i;cc.dataset.em=e;cc.onclick=function(){flip(i,cc);};b.appendChild(cc);});}
function flip(i,cc){if(lock||cc.dataset.m==='1'||cc.textContent!=='?')return;cc.textContent=cc.dataset.em;cc.style.background='#ec4899';if(f===null){f=i;return;}if(s===null){s=i;lock=true;var c1=document.querySelector('[data-idx="'+f+'"]'),c2=cc;if(c1.dataset.em===c2.dataset.em){c1.dataset.m='1';c2.dataset.m='1';c1.style.background='#22c55e';c2.style.background='#22c55e';mat++;document.getElementById('p').textContent=mat;f=null;s=null;lock=false;if(mat===8)setTimeout(function(){document.getElementById('ov').classList.add('show');},300);}else{setTimeout(function(){c1.textContent='?';c1.style.background='#2a2a2a';c2.textContent='?';c2.style.background='#2a2a2a';f=null;s=null;lock=false;},800);}}}
function rst(){init();}
window.rst=rst;init();
`, "memory-fruits");
}

function memoryFlags(): string {
  return wrap("Memory Drapeaux", `
<h1>🏳️ <span>Memory Drapeaux</span></h1>
<div class="stats"><span>Paires : <strong id="p">0</strong>/6</span></div>
<div id="bd" style="display:grid;grid-template-columns:repeat(4,min(70px,18vw));gap:8px;background:#1a1a1a;padding:12px;border-radius:12px;border:2px solid #3b82f6"></div>
<div class="overlay" id="ov"><h2>🎉 Bravo !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var ICO=['🇫🇷','🇺🇸','🇬🇧','🇩🇪','🇮🇹','🇪🇸'],f,s,lock,mat,cds;
function init(){cds=ICO.concat(ICO).sort(function(){return Math.random()-0.5;});f=null;s=null;lock=false;mat=0;document.getElementById('p').textContent='0';document.getElementById('ov').classList.remove('show');render();}
function render(){var b=document.getElementById('bd');b.innerHTML='';cds.forEach(function(e,i){var cc=document.createElement('div');cc.style.cssText='width:100%;aspect-ratio:1;background:#2a2a2a;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:clamp(20px,5vw,32px);cursor:pointer';cc.textContent='?';cc.dataset.idx=i;cc.dataset.em=e;cc.onclick=function(){flip(i,cc);};b.appendChild(cc);});}
function flip(i,cc){if(lock||cc.dataset.m==='1'||cc.textContent!=='?')return;cc.textContent=cc.dataset.em;cc.style.background='#3b82f6';if(f===null){f=i;return;}if(s===null){s=i;lock=true;var c1=document.querySelector('[data-idx="'+f+'"]'),c2=cc;if(c1.dataset.em===c2.dataset.em){c1.dataset.m='1';c2.dataset.m='1';c1.style.background='#22c55e';c2.style.background='#22c55e';mat++;document.getElementById('p').textContent=mat;f=null;s=null;lock=false;if(mat===6)setTimeout(function(){document.getElementById('ov').classList.add('show');},300);}else{setTimeout(function(){c1.textContent='?';c1.style.background='#2a2a2a';c2.textContent='?';c2.style.background='#2a2a2a';f=null;s=null;lock=false;},800);}}}
function rst(){init();}
window.rst=rst;init();
`, "memory-flags");
}

function memorySports(): string {
  return wrap("Memory Sports", `
<h1>⚽ <span>Memory Sports</span></h1>
<div class="stats"><span>Paires : <strong id="p">0</strong>/6</span></div>
<div id="bd" style="display:grid;grid-template-columns:repeat(4,min(70px,18vw));gap:8px;background:#1a1a1a;padding:12px;border-radius:12px;border:2px solid #22c55e"></div>
<div class="overlay" id="ov"><h2>🎉 Bravo !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var ICO=['⚽','🏀','🎾','🏐','🏈','⚾'],f,s,lock,mat,cds;
function init(){cds=ICO.concat(ICO).sort(function(){return Math.random()-0.5;});f=null;s=null;lock=false;mat=0;document.getElementById('p').textContent='0';document.getElementById('ov').classList.remove('show');render();}
function render(){var b=document.getElementById('bd');b.innerHTML='';cds.forEach(function(e,i){var cc=document.createElement('div');cc.style.cssText='width:100%;aspect-ratio:1;background:#2a2a2a;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:clamp(20px,5vw,32px);cursor:pointer';cc.textContent='?';cc.dataset.idx=i;cc.dataset.em=e;cc.onclick=function(){flip(i,cc);};b.appendChild(cc);});}
function flip(i,cc){if(lock||cc.dataset.m==='1'||cc.textContent!=='?')return;cc.textContent=cc.dataset.em;cc.style.background='#22c55e';if(f===null){f=i;return;}if(s===null){s=i;lock=true;var c1=document.querySelector('[data-idx="'+f+'"]'),c2=cc;if(c1.dataset.em===c2.dataset.em){c1.dataset.m='1';c2.dataset.m='1';c1.style.background='#22c55e';c2.style.background='#22c55e';mat++;document.getElementById('p').textContent=mat;f=null;s=null;lock=false;if(mat===6)setTimeout(function(){document.getElementById('ov').classList.add('show');},300);}else{setTimeout(function(){c1.textContent='?';c1.style.background='#2a2a2a';c2.textContent='?';c2.style.background='#2a2a2a';f=null;s=null;lock=false;},800);}}}
function rst(){init();}
window.rst=rst;init();
`, "memory-sports");
}

function memoryEmoji3(): string {
  return wrap("Memory Visages", `
<h1>😀 <span>Memory Visages</span></h1>
<div class="stats"><span>Paires : <strong id="p">0</strong>/6</span></div>
<div id="bd" style="display:grid;grid-template-columns:repeat(4,min(70px,18vw));gap:8px;background:#1a1a1a;padding:12px;border-radius:12px;border:2px solid #facc15"></div>
<div class="overlay" id="ov"><h2>🎉 Bravo !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var ICO=['😀','😎','🤔','😍','🥳','🤯'],f,s,lock,mat,cds;
function init(){cds=ICO.concat(ICO).sort(function(){return Math.random()-0.5;});f=null;s=null;lock=false;mat=0;document.getElementById('p').textContent='0';document.getElementById('ov').classList.remove('show');render();}
function render(){var b=document.getElementById('bd');b.innerHTML='';cds.forEach(function(e,i){var cc=document.createElement('div');cc.style.cssText='width:100%;aspect-ratio:1;background:#2a2a2a;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:clamp(20px,5vw,32px);cursor:pointer';cc.textContent='?';cc.dataset.idx=i;cc.dataset.em=e;cc.onclick=function(){flip(i,cc);};b.appendChild(cc);});}
function flip(i,cc){if(lock||cc.dataset.m==='1'||cc.textContent!=='?')return;cc.textContent=cc.dataset.em;cc.style.background='#facc15';if(f===null){f=i;return;}if(s===null){s=i;lock=true;var c1=document.querySelector('[data-idx="'+f+'"]'),c2=cc;if(c1.dataset.em===c2.dataset.em){c1.dataset.m='1';c2.dataset.m='1';c1.style.background='#22c55e';c2.style.background='#22c55e';mat++;document.getElementById('p').textContent=mat;f=null;s=null;lock=false;if(mat===6)setTimeout(function(){document.getElementById('ov').classList.add('show');},300);}else{setTimeout(function(){c1.textContent='?';c1.style.background='#2a2a2a';c2.textContent='?';c2.style.background='#2a2a2a';f=null;s=null;lock=false;},800);}}}
function rst(){init();}
window.rst=rst;init();
`, "memory-visages");
}

function quizBleu(): string {
  return wrap("Quiz Bleu", `
<h1>💙 <span>Quiz Facile</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong>/8</span></div>
<div id="bd" style="background:#1a1a1a;padding:30px;border-radius:12px;border:2px solid #3b82f6;max-width:500px;min-width:340px"></div>
<div class="overlay" id="ov"><h2 id="ttl">Terminé</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var QS=[
{q:"2 + 2 = ?",a:["3","4","5","6"],c:1},
{q:"Couleur du ciel ?",a:["Rouge","Bleu","Vert","Jaune"],c:1},
{q:"Combien de doigts sur 2 mains ?",a:["5","8","10","12"],c:2},
{q:"Jour après lundi ?",a:["Dimanche","Mardi","Vendredi","Samedi"],c:1},
{q:"Animal qui miaule ?",a:["Chien","Chat","Vache","Lapin"],c:1},
{q:"Combien de saisons ?",a:["2","3","4","5"],c:2},
{q:"Couleur du sang ?",a:["Bleu","Vert","Rouge","Jaune"],c:2},
{q:"Combien de côtés d'un carré ?",a:["3","4","5","6"],c:1}
];
var idx,sc,ov;
function init(){idx=0;sc=0;ov=false;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');render();}
function render(){if(idx>=QS.length){ov=true;document.getElementById('ttl').textContent='🎉 Score : '+sc+'/8';document.getElementById('ov').classList.add('show');return;}var q=QS[idx];var h='<p style="color:#fff;font-size:18px;margin-bottom:20px">'+q.q+'</p><div style="display:flex;flex-direction:column;gap:10px">';q.a.forEach(function(a,i){h+='<button ontouchstart="pick('+i+');event.preventDefault()" onclick="pick('+i+')" style="padding:14px;background:#2a2a2a;color:#fff;border:2px solid #3a3a3a;border-radius:10px;cursor:pointer;font-family:inherit;font-weight:700">'+a+'</button>';});h+='</div>';document.getElementById('bd').innerHTML=h;}
function pick(i){if(ov)return;if(i===QS[idx].c){sc++;document.getElementById('score').textContent=sc;}idx++;render();}
function rst(){init();}
window.rst=rst;window.pick=pick;init();
`, "quiz-bleu");
}

function quizFacile(): string {
  return wrap("Quiz Enfant", `
<h1>🧒 <span>Quiz Enfant</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong>/8</span></div>
<div id="bd" style="background:#1a1a1a;padding:30px;border-radius:12px;border:2px solid #f472b6;max-width:500px;min-width:340px"></div>
<div class="overlay" id="ov"><h2 id="ttl">Terminé</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var QS=[
{q:"Qui est le plus rapide ?",a:["Tortue","Lièvre","Escargot","Limace"],c:1},
{q:"Couleur de la banane ?",a:["Rouge","Jaune","Bleu","Vert"],c:1},
{q:"Combien de pattes a un chien ?",a:["2","3","4","6"],c:2},
{q:"Où vit le poisson ?",a:["Air","Eau","Terre","Feu"],c:1},
{q:"Que mange le lapin ?",a:["Viande","Carottes","Poisson","Pizza"],c:1},
{q:"Couleur de la pomme rouge ?",a:["Bleu","Vert","Rouge","Jaune"],c:2},
{q:"Combien de roues d'un vélo ?",a:["1","2","3","4"],c:1},
{q:"Qui fait meuh ?",a:["Chat","Chien","Vache","Poule"],c:2}
];
var idx,sc,ov;
function init(){idx=0;sc=0;ov=false;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');render();}
function render(){if(idx>=QS.length){ov=true;document.getElementById('ttl').textContent='🎉 Score : '+sc+'/8';document.getElementById('ov').classList.add('show');return;}var q=QS[idx];var h='<p style="color:#fff;font-size:18px;margin-bottom:20px">'+q.q+'</p><div style="display:flex;flex-direction:column;gap:10px">';q.a.forEach(function(a,i){h+='<button ontouchstart="pick('+i+');event.preventDefault()" onclick="pick('+i+')" style="padding:14px;background:#2a2a2a;color:#fff;border:2px solid #3a3a3a;border-radius:10px;cursor:pointer;font-family:inherit;font-weight:700">'+a+'</button>';});h+='</div>';document.getElementById('bd').innerHTML=h;}
function pick(i){if(ov)return;if(i===QS[idx].c){sc++;document.getElementById('score').textContent=sc;}idx++;render();}
function rst(){init();}
window.rst=rst;window.pick=pick;init();
`, "quiz-enfant");
}

function memoryFruits(): string {
  return wrap("Memory Légumes", `
<h1>🥕 <span>Memory Légumes</span></h1>
<div class="stats"><span>Paires : <strong id="p">0</strong>/6</span></div>
<div id="bd" style="display:grid;grid-template-columns:repeat(4,min(70px,18vw));gap:8px;background:#1a1a1a;padding:12px;border-radius:12px;border:2px solid #84cc16"></div>
<div class="overlay" id="ov"><h2>🎉 Bravo !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var ICO=['🥕','🍅','🥦','🌽','🥔','🫑'],f,s,lock,mat,cds;
function init(){cds=ICO.concat(ICO).sort(function(){return Math.random()-0.5;});f=null;s=null;lock=false;mat=0;document.getElementById('p').textContent='0';document.getElementById('ov').classList.remove('show');render();}
function render(){var b=document.getElementById('bd');b.innerHTML='';cds.forEach(function(e,i){var cc=document.createElement('div');cc.style.cssText='width:100%;aspect-ratio:1;background:#2a2a2a;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:clamp(20px,5vw,32px);cursor:pointer';cc.textContent='?';cc.dataset.idx=i;cc.dataset.em=e;cc.onclick=function(){flip(i,cc);};b.appendChild(cc);});}
function flip(i,cc){if(lock||cc.dataset.m==='1'||cc.textContent!=='?')return;cc.textContent=cc.dataset.em;cc.style.background='#84cc16';if(f===null){f=i;return;}if(s===null){s=i;lock=true;var c1=document.querySelector('[data-idx="'+f+'"]'),c2=cc;if(c1.dataset.em===c2.dataset.em){c1.dataset.m='1';c2.dataset.m='1';c1.style.background='#22c55e';c2.style.background='#22c55e';mat++;document.getElementById('p').textContent=mat;f=null;s=null;lock=false;if(mat===6)setTimeout(function(){document.getElementById('ov').classList.add('show');},300);}else{setTimeout(function(){c1.textContent='?';c1.style.background='#2a2a2a';c2.textContent='?';c2.style.background='#2a2a2a';f=null;s=null;lock=false;},800);}}}
function rst(){init();}
window.rst=rst;init();
`, "memory-legumes");
}

function memoryCars(): string {
  return wrap("Memory Voitures", `
<h1>🚗 <span>Memory Voitures</span></h1>
<div class="stats"><span>Paires : <strong id="p">0</strong>/6</span></div>
<div id="bd" style="display:grid;grid-template-columns:repeat(4,min(70px,18vw));gap:8px;background:#1a1a1a;padding:12px;border-radius:12px;border:2px solid #ef4444"></div>
<div class="overlay" id="ov"><h2>🎉 Bravo !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var ICO=['🚗','🚕','🚙','🚌','🚎','🏎️'],f,s,lock,mat,cds;
function init(){cds=ICO.concat(ICO).sort(function(){return Math.random()-0.5;});f=null;s=null;lock=false;mat=0;document.getElementById('p').textContent='0';document.getElementById('ov').classList.remove('show');render();}
function render(){var b=document.getElementById('bd');b.innerHTML='';cds.forEach(function(e,i){var cc=document.createElement('div');cc.style.cssText='width:100%;aspect-ratio:1;background:#2a2a2a;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:clamp(20px,5vw,32px);cursor:pointer';cc.textContent='?';cc.dataset.idx=i;cc.dataset.em=e;cc.onclick=function(){flip(i,cc);};b.appendChild(cc);});}
function flip(i,cc){if(lock||cc.dataset.m==='1'||cc.textContent!=='?')return;cc.textContent=cc.dataset.em;cc.style.background='#ef4444';if(f===null){f=i;return;}if(s===null){s=i;lock=true;var c1=document.querySelector('[data-idx="'+f+'"]'),c2=cc;if(c1.dataset.em===c2.dataset.em){c1.dataset.m='1';c2.dataset.m='1';c1.style.background='#22c55e';c2.style.background='#22c55e';mat++;document.getElementById('p').textContent=mat;f=null;s=null;lock=false;if(mat===6)setTimeout(function(){document.getElementById('ov').classList.add('show');},300);}else{setTimeout(function(){c1.textContent='?';c1.style.background='#2a2a2a';c2.textContent='?';c2.style.background='#2a2a2a';f=null;s=null;lock=false;},800);}}}
function rst(){init();}
window.rst=rst;init();
`, "memory-voitures");
}

function memoryPlanets(): string {
  return wrap("Memory Planètes", `
<h1>🪐 <span>Memory Planètes</span></h1>
<div class="stats"><span>Paires : <strong id="p">0</strong>/6</span></div>
<div id="bd" style="display:grid;grid-template-columns:repeat(4,min(70px,18vw));gap:8px;background:#1a1a1a;padding:12px;border-radius:12px;border:2px solid #a855f7"></div>
<div class="overlay" id="ov"><h2>🎉 Bravo !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var ICO=['🌍','🌙','⭐','☀️','🪐','☄️'],f,s,lock,mat,cds;
function init(){cds=ICO.concat(ICO).sort(function(){return Math.random()-0.5;});f=null;s=null;lock=false;mat=0;document.getElementById('p').textContent='0';document.getElementById('ov').classList.remove('show');render();}
function render(){var b=document.getElementById('bd');b.innerHTML='';cds.forEach(function(e,i){var cc=document.createElement('div');cc.style.cssText='width:100%;aspect-ratio:1;background:#2a2a2a;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:clamp(20px,5vw,32px);cursor:pointer';cc.textContent='?';cc.dataset.idx=i;cc.dataset.em=e;cc.onclick=function(){flip(i,cc);};b.appendChild(cc);});}
function flip(i,cc){if(lock||cc.dataset.m==='1'||cc.textContent!=='?')return;cc.textContent=cc.dataset.em;cc.style.background='#a855f7';if(f===null){f=i;return;}if(s===null){s=i;lock=true;var c1=document.querySelector('[data-idx="'+f+'"]'),c2=cc;if(c1.dataset.em===c2.dataset.em){c1.dataset.m='1';c2.dataset.m='1';c1.style.background='#22c55e';c2.style.background='#22c55e';mat++;document.getElementById('p').textContent=mat;f=null;s=null;lock=false;if(mat===6)setTimeout(function(){document.getElementById('ov').classList.add('show');},300);}else{setTimeout(function(){c1.textContent='?';c1.style.background='#2a2a2a';c2.textContent='?';c2.style.background='#2a2a2a';f=null;s=null;lock=false;},800);}}}
function rst(){init();}
window.rst=rst;init();
`, "memory-planets");
}

function memoryAnimals3(): string {
  return wrap("Memory Océan", `
<h1>🐠 <span>Memory Océan</span></h1>
<div class="stats"><span>Paires : <strong id="p">0</strong>/6</span></div>
<div id="bd" style="display:grid;grid-template-columns:repeat(4,min(70px,18vw));gap:8px;background:#1a1a1a;padding:12px;border-radius:12px;border:2px solid #06b6d4"></div>
<div class="overlay" id="ov"><h2>🎉 Bravo !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var ICO=['🐠','🐟','🐡','🐙','🦈','🐋'],f,s,lock,mat,cds;
function init(){cds=ICO.concat(ICO).sort(function(){return Math.random()-0.5;});f=null;s=null;lock=false;mat=0;document.getElementById('p').textContent='0';document.getElementById('ov').classList.remove('show');render();}
function render(){var b=document.getElementById('bd');b.innerHTML='';cds.forEach(function(e,i){var cc=document.createElement('div');cc.style.cssText='width:100%;aspect-ratio:1;background:#2a2a2a;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:clamp(20px,5vw,32px);cursor:pointer';cc.textContent='?';cc.dataset.idx=i;cc.dataset.em=e;cc.onclick=function(){flip(i,cc);};b.appendChild(cc);});}
function flip(i,cc){if(lock||cc.dataset.m==='1'||cc.textContent!=='?')return;cc.textContent=cc.dataset.em;cc.style.background='#06b6d4';if(f===null){f=i;return;}if(s===null){s=i;lock=true;var c1=document.querySelector('[data-idx="'+f+'"]'),c2=cc;if(c1.dataset.em===c2.dataset.em){c1.dataset.m='1';c2.dataset.m='1';c1.style.background='#22c55e';c2.style.background='#22c55e';mat++;document.getElementById('p').textContent=mat;f=null;s=null;lock=false;if(mat===6)setTimeout(function(){document.getElementById('ov').classList.add('show');},300);}else{setTimeout(function(){c1.textContent='?';c1.style.background='#2a2a2a';c2.textContent='?';c2.style.background='#2a2a2a';f=null;s=null;lock=false;},800);}}}
function rst(){init();}
window.rst=rst;init();
`, "memory-ocean");
}

function memoryInstrument(): string {
  return wrap("Memory Musique", `
<h1>🎸 <span>Memory Musique</span></h1>
<div class="stats"><span>Paires : <strong id="p">0</strong>/6</span></div>
<div id="bd" style="display:grid;grid-template-columns:repeat(4,min(70px,18vw));gap:8px;background:#1a1a1a;padding:12px;border-radius:12px;border:2px solid #ec4899"></div>
<div class="overlay" id="ov"><h2>🎉 Bravo !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var ICO=['🎸','🎹','🥁','🎺','🎻','🎤'],f,s,lock,mat,cds;
function init(){cds=ICO.concat(ICO).sort(function(){return Math.random()-0.5;});f=null;s=null;lock=false;mat=0;document.getElementById('p').textContent='0';document.getElementById('ov').classList.remove('show');render();}
function render(){var b=document.getElementById('bd');b.innerHTML='';cds.forEach(function(e,i){var cc=document.createElement('div');cc.style.cssText='width:100%;aspect-ratio:1;background:#2a2a2a;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:clamp(20px,5vw,32px);cursor:pointer';cc.textContent='?';cc.dataset.idx=i;cc.dataset.em=e;cc.onclick=function(){flip(i,cc);};b.appendChild(cc);});}
function flip(i,cc){if(lock||cc.dataset.m==='1'||cc.textContent!=='?')return;cc.textContent=cc.dataset.em;cc.style.background='#ec4899';if(f===null){f=i;return;}if(s===null){s=i;lock=true;var c1=document.querySelector('[data-idx="'+f+'"]'),c2=cc;if(c1.dataset.em===c2.dataset.em){c1.dataset.m='1';c2.dataset.m='1';c1.style.background='#22c55e';c2.style.background='#22c55e';mat++;document.getElementById('p').textContent=mat;f=null;s=null;lock=false;if(mat===6)setTimeout(function(){document.getElementById('ov').classList.add('show');},300);}else{setTimeout(function(){c1.textContent='?';c1.style.background='#2a2a2a';c2.textContent='?';c2.style.background='#2a2a2a';f=null;s=null;lock=false;},800);}}}
function rst(){init();}
window.rst=rst;init();
`, "memory-instruments");
}

function memoryEmo(): string {
  return wrap("Memory Émotions", `
<h1>😊 <span>Memory Émotions</span></h1>
<div class="stats"><span>Paires : <strong id="p">0</strong>/6</span></div>
<div id="bd" style="display:grid;grid-template-columns:repeat(4,min(70px,18vw));gap:8px;background:#1a1a1a;padding:12px;border-radius:12px;border:2px solid #facc15"></div>
<div class="overlay" id="ov"><h2>🎉 Bravo !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var ICO=['😀','😂','😍','🤔','😴','🤗'],f,s,lock,mat,cds;
function init(){cds=ICO.concat(ICO).sort(function(){return Math.random()-0.5;});f=null;s=null;lock=false;mat=0;document.getElementById('p').textContent='0';document.getElementById('ov').classList.remove('show');render();}
function render(){var b=document.getElementById('bd');b.innerHTML='';cds.forEach(function(e,i){var cc=document.createElement('div');cc.style.cssText='width:100%;aspect-ratio:1;background:#2a2a2a;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:clamp(20px,5vw,32px);cursor:pointer';cc.textContent='?';cc.dataset.idx=i;cc.dataset.em=e;cc.onclick=function(){flip(i,cc);};b.appendChild(cc);});}
function flip(i,cc){if(lock||cc.dataset.m==='1'||cc.textContent!=='?')return;cc.textContent=cc.dataset.em;cc.style.background='#facc15';if(f===null){f=i;return;}if(s===null){s=i;lock=true;var c1=document.querySelector('[data-idx="'+f+'"]'),c2=cc;if(c1.dataset.em===c2.dataset.em){c1.dataset.m='1';c2.dataset.m='1';c1.style.background='#22c55e';c2.style.background='#22c55e';mat++;document.getElementById('p').textContent=mat;f=null;s=null;lock=false;if(mat===6)setTimeout(function(){document.getElementById('ov').classList.add('show');},300);}else{setTimeout(function(){c1.textContent='?';c1.style.background='#2a2a2a';c2.textContent='?';c2.style.background='#2a2a2a';f=null;s=null;lock=false;},800);}}}
function rst(){init();}
window.rst=rst;init();
`, "memory-emotions");
}

function memoryEmo2(): string {
  return wrap("Memory Météo", `
<h1>☀️ <span>Memory Météo</span></h1>
<div class="stats"><span>Paires : <strong id="p">0</strong>/6</span></div>
<div id="bd" style="display:grid;grid-template-columns:repeat(4,min(70px,18vw));gap:8px;background:#1a1a1a;padding:12px;border-radius:12px;border:2px solid #3b82f6"></div>
<div class="overlay" id="ov"><h2>🎉 Bravo !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var ICO=['☀️','🌤️','☁️','🌧️','⛈️','❄️'],f,s,lock,mat,cds;
function init(){cds=ICO.concat(ICO).sort(function(){return Math.random()-0.5;});f=null;s=null;lock=false;mat=0;document.getElementById('p').textContent='0';document.getElementById('ov').classList.remove('show');render();}
function render(){var b=document.getElementById('bd');b.innerHTML='';cds.forEach(function(e,i){var cc=document.createElement('div');cc.style.cssText='width:100%;aspect-ratio:1;background:#2a2a2a;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:clamp(20px,5vw,32px);cursor:pointer';cc.textContent='?';cc.dataset.idx=i;cc.dataset.em=e;cc.onclick=function(){flip(i,cc);};b.appendChild(cc);});}
function flip(i,cc){if(lock||cc.dataset.m==='1'||cc.textContent!=='?')return;cc.textContent=cc.dataset.em;cc.style.background='#3b82f6';if(f===null){f=i;return;}if(s===null){s=i;lock=true;var c1=document.querySelector('[data-idx="'+f+'"]'),c2=cc;if(c1.dataset.em===c2.dataset.em){c1.dataset.m='1';c2.dataset.m='1';c1.style.background='#22c55e';c2.style.background='#22c55e';mat++;document.getElementById('p').textContent=mat;f=null;s=null;lock=false;if(mat===6)setTimeout(function(){document.getElementById('ov').classList.add('show');},300);}else{setTimeout(function(){c1.textContent='?';c1.style.background='#2a2a2a';c2.textContent='?';c2.style.background='#2a2a2a';f=null;s=null;lock=false;},800);}}}
function rst(){init();}
window.rst=rst;init();
`, "memory-meteo");
}

function memoryEmo3(): string {
  return wrap("Memory Nourriture", `
<h1>🍔 <span>Memory Nourriture</span></h1>
<div class="stats"><span>Paires : <strong id="p">0</strong>/6</span></div>
<div id="bd" style="display:grid;grid-template-columns:repeat(4,min(70px,18vw));gap:8px;background:#1a1a1a;padding:12px;border-radius:12px;border:2px solid #f97316"></div>
<div class="overlay" id="ov"><h2>🎉 Bravo !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var ICO=['🍕','🍔','🌮','🍣','🍜','🥗'],f,s,lock,mat,cds;
function init(){cds=ICO.concat(ICO).sort(function(){return Math.random()-0.5;});f=null;s=null;lock=false;mat=0;document.getElementById('p').textContent='0';document.getElementById('ov').classList.remove('show');render();}
function render(){var b=document.getElementById('bd');b.innerHTML='';cds.forEach(function(e,i){var cc=document.createElement('div');cc.style.cssText='width:100%;aspect-ratio:1;background:#2a2a2a;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:clamp(20px,5vw,32px);cursor:pointer';cc.textContent='?';cc.dataset.idx=i;cc.dataset.em=e;cc.onclick=function(){flip(i,cc);};b.appendChild(cc);});}
function flip(i,cc){if(lock||cc.dataset.m==='1'||cc.textContent!=='?')return;cc.textContent=cc.dataset.em;cc.style.background='#f97316';if(f===null){f=i;return;}if(s===null){s=i;lock=true;var c1=document.querySelector('[data-idx="'+f+'"]'),c2=cc;if(c1.dataset.em===c2.dataset.em){c1.dataset.m='1';c2.dataset.m='1';c1.style.background='#22c55e';c2.style.background='#22c55e';mat++;document.getElementById('p').textContent=mat;f=null;s=null;lock=false;if(mat===6)setTimeout(function(){document.getElementById('ov').classList.add('show');},300);}else{setTimeout(function(){c1.textContent='?';c1.style.background='#2a2a2a';c2.textContent='?';c2.style.background='#2a2a2a';f=null;s=null;lock=false;},800);}}}
function rst(){init();}
window.rst=rst;init();
`, "memory-nourriture");
}

function memoryEmo4(): string {
  return wrap("Memory Vêtements", `
<h1>👕 <span>Memory Vêtements</span></h1>
<div class="stats"><span>Paires : <strong id="p">0</strong>/6</span></div>
<div id="bd" style="display:grid;grid-template-columns:repeat(4,min(70px,18vw));gap:8px;background:#1a1a1a;padding:12px;border-radius:12px;border:2px solid #8b5cf6"></div>
<div class="overlay" id="ov"><h2>🎉 Bravo !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var ICO=['👕','👖','👔','👗','👟','🧢'],f,s,lock,mat,cds;
function init(){cds=ICO.concat(ICO).sort(function(){return Math.random()-0.5;});f=null;s=null;lock=false;mat=0;document.getElementById('p').textContent='0';document.getElementById('ov').classList.remove('show');render();}
function render(){var b=document.getElementById('bd');b.innerHTML='';cds.forEach(function(e,i){var cc=document.createElement('div');cc.style.cssText='width:100%;aspect-ratio:1;background:#2a2a2a;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:clamp(20px,5vw,32px);cursor:pointer';cc.textContent='?';cc.dataset.idx=i;cc.dataset.em=e;cc.onclick=function(){flip(i,cc);};b.appendChild(cc);});}
function flip(i,cc){if(lock||cc.dataset.m==='1'||cc.textContent!=='?')return;cc.textContent=cc.dataset.em;cc.style.background='#8b5cf6';if(f===null){f=i;return;}if(s===null){s=i;lock=true;var c1=document.querySelector('[data-idx="'+f+'"]'),c2=cc;if(c1.dataset.em===c2.dataset.em){c1.dataset.m='1';c2.dataset.m='1';c1.style.background='#22c55e';c2.style.background='#22c55e';mat++;document.getElementById('p').textContent=mat;f=null;s=null;lock=false;if(mat===6)setTimeout(function(){document.getElementById('ov').classList.add('show');},300);}else{setTimeout(function(){c1.textContent='?';c1.style.background='#2a2a2a';c2.textContent='?';c2.style.background='#2a2a2a';f=null;s=null;lock=false;},800);}}}
function rst(){init();}
window.rst=rst;init();
`, "memory-vetements");
}

function memoryEmo5(): string {
  return wrap("Memory Métiers", `
<h1>👨‍🍳 <span>Memory Métiers</span></h1>
<div class="stats"><span>Paires : <strong id="p">0</strong>/6</span></div>
<div id="bd" style="display:grid;grid-template-columns:repeat(4,min(70px,18vw));gap:8px;background:#1a1a1a;padding:12px;border-radius:12px;border:2px solid #14b8a6"></div>
<div class="overlay" id="ov"><h2>🎉 Bravo !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var ICO=['👨‍🍳','👨‍⚕️','👮','👨‍🚒','👨‍✈️','👨‍🏫'],f,s,lock,mat,cds;
function init(){cds=ICO.concat(ICO).sort(function(){return Math.random()-0.5;});f=null;s=null;lock=false;mat=0;document.getElementById('p').textContent='0';document.getElementById('ov').classList.remove('show');render();}
function render(){var b=document.getElementById('bd');b.innerHTML='';cds.forEach(function(e,i){var cc=document.createElement('div');cc.style.cssText='width:100%;aspect-ratio:1;background:#2a2a2a;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:clamp(20px,5vw,32px);cursor:pointer';cc.textContent='?';cc.dataset.idx=i;cc.dataset.em=e;cc.onclick=function(){flip(i,cc);};b.appendChild(cc);});}
function flip(i,cc){if(lock||cc.dataset.m==='1'||cc.textContent!=='?')return;cc.textContent=cc.dataset.em;cc.style.background='#14b8a6';if(f===null){f=i;return;}if(s===null){s=i;lock=true;var c1=document.querySelector('[data-idx="'+f+'"]'),c2=cc;if(c1.dataset.em===c2.dataset.em){c1.dataset.m='1';c2.dataset.m='1';c1.style.background='#22c55e';c2.style.background='#22c55e';mat++;document.getElementById('p').textContent=mat;f=null;s=null;lock=false;if(mat===6)setTimeout(function(){document.getElementById('ov').classList.add('show');},300);}else{setTimeout(function(){c1.textContent='?';c1.style.background='#2a2a2a';c2.textContent='?';c2.style.background='#2a2a2a';f=null;s=null;lock=false;},800);}}}
function rst(){init();}
window.rst=rst;init();
`, "memory-metiers");
}
// ═══════════════════════════════════════════════════════════════
// PAQUET 15 : 30 JEUX
// ═══════════════════════════════════════════════════════════════

function doodleJump2(): string {
  return wrap("Doodle 2", `
<h1>🦘 <span>Doodle 2</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="400" height="600" style="width:min(400px,80vw)"></canvas>
<div class="controls"><button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button><button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button></div>
<div class="overlay" id="ov"><h2>Game Over</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var pl,plats,vy,sc,ov,loop;
function init(){pl={x:W/2-15,y:H-80,w:30,h:30,vx:0};plats=[];for(var i=0;i<10;i++)plats.push({x:Math.random()*(W-70),y:H-i*70,w:70,h:12,type:Math.random()<0.8?'normal':Math.random()<0.5?'spring':'break'});vy=-11;sc=0;ov=false;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function mv(d){pl.vx=d*5;}
window.mv=mv;
function upd(){vy+=0.45;pl.y+=vy;pl.x+=pl.vx;pl.vx*=0.9;if(pl.x<0)pl.x=0;if(pl.x+pl.w>W)pl.x=W-pl.w;plats.forEach(function(p){if(pl.y+pl.h>p.y&&pl.y+pl.h<p.y+p.h+10&&pl.x+pl.w>p.x&&pl.x<p.x+p.w&&vy>0){if(p.type==='break'){p.dead=true;return;}vy=p.type==='spring'?-16:-11;sc+=p.type==='spring'?20:10;document.getElementById('score').textContent=sc;}});plats=plats.filter(function(p){return !p.dead;});if(pl.y<H/2){var dy=H/2-pl.y;pl.y=H/2;plats.forEach(function(p){p.y+=dy;});sc+=Math.floor(dy/10);document.getElementById('score').textContent=sc;}plats=plats.filter(function(p){return p.y<H+50;});while(plats.length<12){var top=H;plats.forEach(function(p){if(p.y<top)top=p.y;});plats.push({x:Math.random()*(W-70),y:top-Math.random()*60-40,w:70,h:12,type:'normal'});}if(pl.y>H){ov=true;document.getElementById('ov').classList.add('show');}}
function draw(){x.fillStyle='#0a0a1a';x.fillRect(0,0,W,H);plats.forEach(function(p){x.fillStyle=p.type==='spring'?'#22c55e':p.type==='break'?'#ef4444':'#facc15';x.fillRect(p.x,p.y,p.w,p.h);});x.fillStyle='#facc15';x.fillRect(pl.x,pl.y,pl.w,pl.h);x.fillStyle='#000';x.beginPath();x.arc(pl.x+10,pl.y+10,4,0,6.3);x.fill();x.beginPath();x.arc(pl.x+20,pl.y+10,4,0,6.3);x.fill();}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')mv(-1);if(e.key==='ArrowRight')mv(1);});
rst();
`, "doodle2");
}

function ninjaRun(): string {
  return wrap("Ninja Run", `
<h1>🥷 <span>Ninja Run</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="600" height="400"></canvas>
<div class="controls"><button ontouchstart="jump();event.preventDefault()" onclick="jump()" style="width:180px;background:#a855f7;color:#fff">SAUT</button></div>
<div class="overlay" id="ov"><h2>Chute !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var pl,obs,sc,ov,loop,speed,t;
function init(){pl={x:100,y:H-80,w:30,h:30,vy:0,onG:true};obs=[];sc=0;ov=false;speed=6;t=0;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function jump(){if(ov||!pl.onG)return;pl.vy=-14;pl.onG=false;}
window.jump=jump;
function upd(){t++;sc+=speed/20;document.getElementById('score').textContent=Math.floor(sc);pl.vy+=0.7;pl.y+=pl.vy;pl.onG=false;if(pl.y+pl.h>H-60){pl.y=H-60-pl.h;pl.vy=0;pl.onG=true;}obs.forEach(function(o){o.x-=speed;});obs=obs.filter(function(o){return o.x>-50;});if(t%50===0)obs.push({x:W,h:20+Math.random()*50});obs.forEach(function(o){if(pl.x<o.x+20&&pl.x+pl.w>o.x&&pl.y+pl.h>H-60-o.h){ov=true;document.getElementById('ov').classList.add('show');}});}
function draw(){x.fillStyle='#1a0a2a';x.fillRect(0,0,W,H);x.fillStyle='#333';x.fillRect(0,H-60,W,60);obs.forEach(function(o){x.fillStyle='#a855f7';x.fillRect(o.x,H-60-o.h,20,o.h);});x.fillStyle='#facc15';x.fillRect(pl.x,pl.y,pl.w,pl.h);x.fillStyle='#000';x.beginPath();x.arc(pl.x+10,pl.y+10,4,0,6.3);x.fill();x.beginPath();x.arc(pl.x+20,pl.y+10,4,0,6.3);x.fill();}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key===' ')jump();});
c.addEventListener('click',jump);
rst();
`, "ninja-run");
}

function jumpPower(): string {
  return wrap("Jump Power", `
<h1>⬆️ <span>Jump Power</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="400" height="600"></canvas>
<div class="controls"><button ontouchstart="jump();event.preventDefault()" onclick="jump()" style="width:180px;background:#facc15;color:#000">SAUT</button></div>
<div class="overlay" id="ov"><h2>Game Over</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var pl,platforms,sc,ov,loop;
function init(){pl={x:W/2-15,y:H-80,w:30,h:30,vy:0,onG:false};platforms=[{x:0,y:H-30,w:W,h:30}];for(var i=0;i<5;i++)platforms.push({x:Math.random()*(W-80),y:H-100-i*90,w:80,h:15});sc=0;ov=false;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function jump(){if(pl.onG){pl.vy=-15;pl.onG=false;}}
window.jump=jump;
function upd(){pl.vy+=0.7;pl.y+=pl.vy;pl.onG=false;platforms.forEach(function(p){if(pl.x+pl.w>p.x&&pl.x<p.x+p.w&&pl.y+pl.h>p.y&&pl.y+pl.h<p.y+p.h+15&&pl.vy>0){pl.y=p.y-pl.h;pl.vy=0;pl.onG=true;}});if(pl.y<H/2){var dy=H/2-pl.y;pl.y=H/2;platforms.forEach(function(p){p.y+=dy;});sc+=Math.floor(dy/5);document.getElementById('score').textContent=sc;}platforms=platforms.filter(function(p){return p.y<H+50;});while(platforms.length<8){var top=H;platforms.forEach(function(p){if(p.y<top)top=p.y;});platforms.push({x:Math.random()*(W-80),y:top-90,w:80,h:15});}if(pl.y>H){ov=true;document.getElementById('ov').classList.add('show');}}
function draw(){x.fillStyle='#0a0a2a';x.fillRect(0,0,W,H);platforms.forEach(function(p){x.fillStyle='#22c55e';x.fillRect(p.x,p.y,p.w,p.h);});x.fillStyle='#facc15';x.fillRect(pl.x,pl.y,pl.w,pl.h);}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key===' ')jump();});
c.addEventListener('click',jump);
rst();
`, "jump-power");
}

function wallJump(): string {
  return wrap("Wall Jump", `
<h1>🧱 <span>Wall Jump</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="400" height="600"></canvas>
<div class="controls"><button ontouchstart="jump();event.preventDefault()" onclick="jump()" style="width:180px;background:#3b82f6;color:#fff">SAUT</button></div>
<div class="overlay" id="ov"><h2>Game Over</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var pl,sc,ov,loop,dir;
function init(){pl={x:W/2-15,y:H-80,w:30,h:30,vy:0,vx:2};sc=0;ov=false;dir=1;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function jump(){if(ov)return;pl.vy=-12;pl.vx=-pl.vx;}
window.jump=jump;
function upd(){pl.vy+=0.6;pl.y+=pl.vy;pl.x+=pl.vx;if(pl.x<0){pl.x=0;pl.vx=Math.abs(pl.vx);}if(pl.x+pl.w>W){pl.x=W-pl.w;pl.vx=-Math.abs(pl.vx);}sc++;document.getElementById('score').textContent=Math.floor(sc/10);if(pl.y>H){ov=true;document.getElementById('ov').classList.add('show');}}
function draw(){x.fillStyle='#0a0a1a';x.fillRect(0,0,W,H);x.fillStyle='#333';x.fillRect(0,0,10,H);x.fillRect(W-10,0,10,H);x.fillStyle='#facc15';x.fillRect(pl.x,pl.y,pl.w,pl.h);x.fillStyle='#000';x.beginPath();x.arc(pl.x+10,pl.y+10,4,0,6.3);x.fill();x.beginPath();x.arc(pl.x+20,pl.y+10,4,0,6.3);x.fill();}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key===' ')jump();});
c.addEventListener('click',jump);
rst();
`, "wall-jump");
}

function spaceship2(): string {
  return wrap("Vaisseau 2", `
<h1>🚀 <span>Vaisseau 2</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Vies : <strong id="lives">3</strong></span></div>
<canvas id="g" width="480" height="600" style="width:min(480px,80vw)"></canvas>
<div class="controls"><button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button><button ontouchstart="sh();event.preventDefault()" onclick="sh()">🔥</button><button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button></div>
<div class="overlay" id="ov"><h2>Game Over</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var pl,bl,en,sc,lv,ov,loop,t;
function init(){pl={x:W/2-20,y:H-50,w:40,h:30};bl=[];en=[];sc=0;lv=3;ov=false;t=0;document.getElementById('score').textContent='0';document.getElementById('lives').textContent='3';document.getElementById('ov').classList.remove('show');}
function mv(d){pl.x+=d*25;pl.x=Math.max(0,Math.min(W-pl.w,pl.x));}
function sh(){if(ov)return;bl.push({x:pl.x+pl.w/2,y:pl.y,vy:-10});}
window.mv=mv;window.sh=sh;
function upd(){t++;if(t%35===0)en.push({x:Math.random()*(W-40),y:-40,w:40,h:30,hp:2,vy:1.5,t:0});en.forEach(function(e){e.y+=e.vy;e.t++;if(e.t%80===0)bl.push({x:e.x+e.w/2,y:e.y+e.h,vy:6,enemy:true});});bl.forEach(function(b){b.y+=b.vy;});bl=bl.filter(function(b){return b.y>0&&b.y<H;});bl.forEach(function(b){if(b.enemy)return;en.forEach(function(e){if(e.hp<=0)return;if(b.x>e.x&&b.x<e.x+e.w&&b.y>e.y&&b.y<e.y+e.h){e.hp--;b.y=-100;if(e.hp<=0){sc+=30;document.getElementById('score').textContent=sc;}}});});bl=bl.filter(function(b){return b.y>0;});bl.forEach(function(b){if(!b.enemy)return;if(b.x>pl.x&&b.x<pl.x+pl.w&&b.y>pl.y){lv--;document.getElementById('lives').textContent=lv;b.y=-100;if(lv<=0){ov=true;document.getElementById('ov').classList.add('show');}}});bl=bl.filter(function(b){return b.y>0;});en=en.filter(function(e){return e.hp>0&&e.y<H+50;});}
function draw(){x.fillStyle='#000';x.fillRect(0,0,W,H);x.fillStyle='#22c55e';x.beginPath();x.moveTo(pl.x+pl.w/2,pl.y);x.lineTo(pl.x,pl.y+pl.h);x.lineTo(pl.x+pl.w,pl.y+pl.h);x.closePath();x.fill();x.fillStyle='#facc15';bl.forEach(function(b){if(!b.enemy)x.fillRect(b.x-1,b.y,3,8);});x.fillStyle='#ef4444';bl.forEach(function(b){if(b.enemy){x.fillRect(b.x-2,b.y,4,8);}});en.forEach(function(e){x.fillStyle='#a855f7';x.fillRect(e.x,e.y,e.w,e.h);x.fillStyle='#fff';x.fillRect(e.x-3,e.y-8,46*(e.hp/2),3);});}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,20);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')mv(-1);if(e.key==='ArrowRight')mv(1);if(e.key===' ')sh();});
rst();
`, "spaceship2");
}

function meteor2(): string {
  return wrap("Météores 2", `
<h1>☄️ <span>Météores 2</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Vies : <strong id="lives">3</strong></span></div>
<canvas id="g" width="480" height="600" style="width:min(480px,80vw)"></canvas>
<div class="controls"><button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button><button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button></div>
<div class="overlay" id="ov"><h2>Game Over</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var pl,meteors,sc,lv,ov,loop,t;
function init(){pl={x:W/2-20,y:H-50,w:40,h:30};meteors=[];sc=0;lv=3;ov=false;t=0;document.getElementById('score').textContent='0';document.getElementById('lives').textContent='3';document.getElementById('ov').classList.remove('show');}
function mv(d){pl.x+=d*25;pl.x=Math.max(0,Math.min(W-pl.w,pl.x));}
window.mv=mv;
function upd(){t++;sc+=0.1;document.getElementById('score').textContent=Math.floor(sc);if(t%20===0){var side=Math.floor(Math.random()*3);var mx=Math.random()*W;var my=-20;meteors.push({x:mx,y:my,vx:(Math.random()-0.5)*2,vy:3+Math.random()*2,r:8+Math.random()*12});}meteors.forEach(function(m){m.x+=m.vx;m.y+=m.vy;});meteors=meteors.filter(function(m){return m.y<H+30;});meteors.forEach(function(m){if(Math.hypot(m.x-pl.x-20,m.y-pl.y-15)<m.r+20){lv--;document.getElementById('lives').textContent=lv;m.y=H+100;if(lv<=0){ov=true;document.getElementById('ov').classList.add('show');}}});meteors=meteors.filter(function(m){return m.y<H+50;});}
function draw(){x.fillStyle='#000';x.fillRect(0,0,W,H);for(var i=0;i<30;i++){x.fillStyle='#fff';x.fillRect((i*37)%W,(i*29)%H,1,1);}meteors.forEach(function(m){x.fillStyle='#ef4444';x.beginPath();x.arc(m.x,m.y,m.r,0,6.3);x.fill();});x.fillStyle='#facc15';x.fillRect(pl.x,pl.y,pl.w,pl.h);}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')mv(-1);if(e.key==='ArrowRight')mv(1);});
c.addEventListener('mousemove',function(e){var r=c.getBoundingClientRect();pl.x=(e.clientX-r.left)*(W/r.width)-pl.w/2;pl.x=Math.max(0,Math.min(W-pl.w,pl.x));});
c.addEventListener('touchmove',function(e){e.preventDefault();var r=c.getBoundingClientRect();pl.x=(e.touches[0].clientX-r.left)*(W/r.width)-pl.w/2;pl.x=Math.max(0,Math.min(W-pl.w,pl.x));},{passive:false});
rst();
`, "meteor2");
}

function dodgeCars(): string {
  return wrap("Dodge Cars", `
<h1>🚗 <span>Dodge Cars</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="400" height="600"></canvas>
<div class="controls"><button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button><button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button></div>
<div class="overlay" id="ov"><h2>Crash !</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var pl,cars,sc,ov,loop,speed,t;
function init(){pl={x:W/2-20,y:H-100,w:40,h:70};cars=[];sc=0;ov=false;speed=5;t=0;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function mv(d){pl.x+=d*25;pl.x=Math.max(10,Math.min(W-50,pl.x));}
window.mv=mv;
function upd(){t++;sc+=speed/10;document.getElementById('score').textContent=Math.floor(sc);cars.forEach(function(car){car.y+=speed;});cars=cars.filter(function(car){return car.y<H+50;});if(t%45===0)cars.push({x:Math.random()*(W-50)+10,y:-50,w:50,h:70,color:['#ef4444','#3b82f6','#22c55e','#facc15'][Math.floor(Math.random()*4)]});cars.forEach(function(car){if(pl.x<car.x+car.w&&pl.x+pl.w>car.x&&pl.y<car.y+car.h&&pl.y+pl.h>car.y){ov=true;document.getElementById('fin').textContent=Math.floor(sc);document.getElementById('ov').classList.add('show');}});}
function draw(){x.fillStyle='#333';x.fillRect(0,0,W,H);x.fillStyle='#fff';for(var i=0;i<H;i+=50){x.fillRect(W/2-2,(i+t*speed/2)%H,4,25);}cars.forEach(function(car){x.fillStyle=car.color;x.fillRect(car.x,car.y,car.w,car.h);});x.fillStyle='#a855f7';x.fillRect(pl.x,pl.y,pl.w,pl.h);x.fillStyle='#000';x.fillRect(pl.x+5,pl.y+50,10,15);x.fillRect(pl.x+pl.w-15,pl.y+50,10,15);}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')mv(-1);if(e.key==='ArrowRight')mv(1);});
rst();
`, "dodge-cars");
}

function jumpingBall(): string {
  return wrap("Balle Rebond", `
<h1>⚪ <span>Balle Rebond</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="500" height="500"></canvas>
<div class="controls"><button ontouchstart="jump();event.preventDefault()" onclick="jump()" style="width:180px;background:#22c55e;color:#fff">SAUT</button></div>
<div class="overlay" id="ov"><h2>Game Over</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var ball,plats,sc,ov,loop,vx,vy;
function init(){ball={x:W/2,y:H-80,r:15};plats=[];for(var i=0;i<5;i++)plats.push({x:Math.random()*(W-100),y:H-i*100,w:100,h:15});vx=2;vy=-10;sc=0;ov=false;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function jump(){if(ov)return;if(ball.y>H-150){vy=-13;}}
window.jump=jump;
function upd(){vy+=0.4;ball.x+=vx;ball.y+=vy;if(ball.x-ball.r<0||ball.x+ball.r>W)vx*=-1;plats.forEach(function(p){if(ball.y+ball.r>p.y&&ball.y-ball.r<p.y+p.h&&ball.x+ball.r>p.x&&ball.x-ball.r<p.x+p.w&&vy>0){vy=-11;sc+=10;document.getElementById('score').textContent=sc;}});if(ball.y-ball.r<0)ball.y=ball.r,vy=Math.abs(vy);if(ball.y<H/2){var dy=H/2-ball.y;ball.y=H/2;plats.forEach(function(p){p.y+=dy;});sc++;}plats=plats.filter(function(p){return p.y<H+30;});while(plats.length<5){var top=H;plats.forEach(function(p){if(p.y<top)top=p.y;});plats.push({x:Math.random()*(W-100),y:top-100,w:100,h:15});}if(ball.y-ball.r>H){ov=true;document.getElementById('ov').classList.add('show');}}
function draw(){x.fillStyle='#0a1a2a';x.fillRect(0,0,W,H);plats.forEach(function(p){x.fillStyle='#22c55e';x.fillRect(p.x,p.y,p.w,p.h);});x.fillStyle='#facc15';x.beginPath();x.arc(ball.x,ball.y,ball.r,0,6.3);x.fill();}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key===' ')jump();});
c.addEventListener('click',jump);
rst();
`, "jumping-ball");
}

function rocketLanding(): string {
  return wrap("Atterrissage", `
<h1>🚀 <span>Atterrissage</span></h1>
<div class="stats"><span>Vitesse : <strong id="speed">0</strong></span><span>Carburant : <strong id="fuel">100</strong></span></div>
<canvas id="g" width="500" height="500"></canvas>
<div class="controls"><button ontouchstart="thr(true);event.preventDefault()" ontouchend="thr(false);event.preventDefault()" onclick="toggleThr()" style="width:180px;background:#f97316;color:#fff">POUSSER</button></div>
<div class="overlay" id="ov"><h2 id="ttl">Résultat</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var pl,vy,vx,fuel,ov,thrust,t;
function init(){pl={x:W/2-20,y:50,w:40,h:30};vy=0;vx=(Math.random()-0.5)*1.5;fuel=100;ov=false;thrust=false;t=0;document.getElementById('speed').textContent='0';document.getElementById('fuel').textContent='100';document.getElementById('ov').classList.remove('show');}
function thr(v){thrust=v;}
function toggleThr(){thrust=!thrust;}
window.thr=thr;window.toggleThr=toggleThr;
function upd(){t++;vy+=0.05;if(thrust&&fuel>0){vy-=0.15;fuel-=0.25;}pl.x+=vx;pl.y+=vy;if(pl.x<0||pl.x+pl.w>W)vx*=-1;document.getElementById('speed').textContent=Math.abs(vy).toFixed(1);document.getElementById('fuel').textContent=Math.floor(fuel);if(pl.y+pl.h>H-50){ov=true;var ok=Math.abs(vy)<1.5;document.getElementById('ttl').textContent=ok?'🎉 Atterrissage réussi !':'💥 Crash';document.getElementById('ov').classList.add('show');}}
function draw(){x.fillStyle='#000';x.fillRect(0,0,W,H);for(var i=0;i<40;i++){x.fillStyle='#fff';x.fillRect((i*37)%W,(i*29)%H,2,2);}x.fillStyle='#666';x.fillRect(0,H-50,W,50);x.fillStyle='#333';x.fillRect(W/2-80,H-50,160,10);if(thrust&&fuel>0){x.fillStyle='#f97316';x.beginPath();x.moveTo(pl.x+pl.w/2,pl.y+pl.h);x.lineTo(pl.x+pl.w/2-10,pl.y+pl.h+25);x.lineTo(pl.x+pl.w/2+10,pl.y+pl.h+25);x.closePath();x.fill();}x.fillStyle='#facc15';x.beginPath();x.moveTo(pl.x+pl.w/2,pl.y);x.lineTo(pl.x,pl.y+pl.h);x.lineTo(pl.x+pl.w,pl.y+pl.h);x.closePath();x.fill();}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key===' ')thrust=true;});
document.addEventListener('keyup',function(e){if(e.key===' ')thrust=false;});
rst();
`, "rocket-landing");
}

function asteroid3(): string {
  return wrap("Asteroid 3", `
<h1>☄️ <span>Asteroid 3</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="500" height="500"></canvas>
<div class="controls"><button ontouchstart="sh();event.preventDefault()" onclick="sh()" style="width:160px;background:#22c55e;color:#fff">TIRER</button></div>
<div class="overlay" id="ov"><h2>Game Over</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var ship,rocks,bullets,sc,ov,loop;
function init(){ship={x:W/2,y:H/2,angle:0};rocks=[];bullets=[];for(var i=0;i<8;i++)rocks.push({x:Math.random()*W,y:Math.random()*H,r:15+Math.random()*20,vx:(Math.random()-0.5)*3,vy:(Math.random()-0.5)*3});sc=0;ov=false;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function sh(){if(ov)return;bullets.push({x:ship.x,y:ship.y,vx:Math.cos(ship.angle)*9,vy:Math.sin(ship.angle)*9,life:70});}
window.sh=sh;
function upd(){rocks.forEach(function(r){r.x+=r.vx;r.y+=r.vy;if(r.x<0||r.x>W)r.vx*=-1;if(r.y<0||r.y>H)r.vy*=-1;});bullets.forEach(function(b){b.x+=b.vx;b.y+=b.vy;b.life--;});bullets=bullets.filter(function(b){return b.life>0&&b.x>0&&b.x<W&&b.y>0&&b.y<H;});bullets.forEach(function(b){rocks.forEach(function(r){if(Math.hypot(b.x-r.x,b.y-r.y)<r.r){b.life=0;r.dead=true;sc+=30;document.getElementById('score').textContent=sc;}});});bullets=bullets.filter(function(b){return b.life>0;});rocks=rocks.filter(function(r){return !r.dead;});while(rocks.length<8)rocks.push({x:Math.random()*W,y:Math.random()*H,r:15+Math.random()*20,vx:(Math.random()-0.5)*3,vy:(Math.random()-0.5)*3});rocks.forEach(function(r){if(Math.hypot(r.x-ship.x,r.y-ship.y)<r.r+10){ov=true;document.getElementById('ov').classList.add('show');}});}
function draw(){x.fillStyle='#000';x.fillRect(0,0,W,H);x.save();x.translate(ship.x,ship.y);x.rotate(ship.angle);x.fillStyle='#22c55e';x.beginPath();x.moveTo(15,0);x.lineTo(-10,-8);x.lineTo(-10,8);x.closePath();x.fill();x.restore();x.strokeStyle='#a855f7';x.lineWidth=2;rocks.forEach(function(r){x.beginPath();x.arc(r.x,r.y,r.r,0,6.3);x.stroke();});x.fillStyle='#facc15';bullets.forEach(function(b){x.fillRect(b.x-2,b.y-2,4,4);});}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,20);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key===' ')sh();});
c.addEventListener('mousemove',function(e){var r=c.getBoundingClientRect();ship.angle=Math.atan2((e.clientY-r.top)*(H/r.height)-ship.y,(e.clientX-r.left)*(W/r.width)-ship.x);});
c.addEventListener('touchmove',function(e){e.preventDefault();var r=c.getBoundingClientRect();ship.angle=Math.atan2((e.touches[0].clientY-r.top)*(H/r.height)-ship.y,(e.touches[0].clientX-r.left)*(W/r.width)-ship.x);},{passive:false});
rst();
`, "asteroid3");
}

function tankShooter2(): string {
  return wrap("Tank 4", `
<h1>🚁 <span>Tank 4</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Vies : <strong id="lives">3</strong></span></div>
<canvas id="g" width="500" height="500"></canvas>
<div class="controls"><button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button><button ontouchstart="sh();event.preventDefault()" onclick="sh()">FIRE</button><button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button></div>
<div class="overlay" id="ov"><h2>Game Over</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var pl,en,bl,sc,lv,ov,loop,t;
function init(){pl={x:W/2-20,y:H-60,w:40,h:30};en=[];bl=[];sc=0;lv=3;ov=false;t=0;document.getElementById('score').textContent='0';document.getElementById('lives').textContent='3';document.getElementById('ov').classList.remove('show');}
function mv(d){pl.x+=d*20;pl.x=Math.max(0,Math.min(W-pl.w,pl.x));}
function sh(){if(ov)return;bl.push({x:pl.x+pl.w/2,y:pl.y,vy:-10});}
window.mv=mv;window.sh=sh;
function upd(){t++;if(t%50===0)en.push({x:Math.random()*(W-40),y:-40,w:40,h:30,hp:2,vy:1.5,t:0});en.forEach(function(e){e.y+=e.vy;e.t++;if(e.t%100===0)bl.push({x:e.x+e.w/2,y:e.y+e.h,vy:5,enemy:true});});bl.forEach(function(b){b.y+=b.vy;});bl=bl.filter(function(b){return b.y>0&&b.y<H;});bl.forEach(function(b){if(b.enemy)return;en.forEach(function(e){if(e.hp<=0)return;if(b.x>e.x&&b.x<e.x+e.w&&b.y>e.y&&b.y<e.y+e.h){e.hp--;b.y=-100;if(e.hp<=0){sc+=40;document.getElementById('score').textContent=sc;}}});});bl=bl.filter(function(b){return b.y>0;});bl.forEach(function(b){if(!b.enemy)return;if(b.x>pl.x&&b.x<pl.x+pl.w&&b.y>pl.y){lv--;document.getElementById('lives').textContent=lv;b.y=-100;if(lv<=0){ov=true;document.getElementById('ov').classList.add('show');}}});bl=bl.filter(function(b){return b.y>0;});en=en.filter(function(e){return e.hp>0&&e.y<H+50;});}
function draw(){x.fillStyle='#0a0a0a';x.fillRect(0,0,W,H);x.fillStyle='#22c55e';x.fillRect(pl.x,pl.y,pl.w,pl.h);x.fillRect(pl.x+pl.w/2-3,pl.y-10,6,10);x.fillStyle='#facc15';bl.forEach(function(b){if(!b.enemy)x.fillRect(b.x-2,b.y,4,8);});x.fillStyle='#ef4444';bl.forEach(function(b){if(b.enemy)x.fillRect(b.x-2,b.y,4,8);});en.forEach(function(e){x.fillStyle='#a855f7';x.fillRect(e.x,e.y,e.w,e.h);});}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')mv(-1);if(e.key==='ArrowRight')mv(1);if(e.key===' ')sh();});
rst();
`, "tank-shooter2");
}

function spiderWeb(): string {
  return wrap("Araignée", `
<h1>🕷️ <span>Araignée</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Vies : <strong id="lives">3</strong></span></div>
<canvas id="g" width="500" height="500"></canvas>
<div class="controls"><button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button><button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button></div>
<div class="overlay" id="ov"><h2>Game Over</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var spider,flies,sc,lv,ov,loop,t;
function init(){spider={x:W/2-20,y:H-60,w:40,h:40};flies=[];sc=0;lv=3;ov=false;t=0;document.getElementById('score').textContent='0';document.getElementById('lives').textContent='3';document.getElementById('ov').classList.remove('show');}
function mv(d){spider.x+=d*25;spider.x=Math.max(0,Math.min(W-spider.w,spider.x));}
window.mv=mv;
function upd(){t++;if(t%25===0)flies.push({x:Math.random()*(W-30),y:-30,w:30,h:30,vy:2+Math.random()*2});flies.forEach(function(f){f.y+=f.vy;});flies=flies.filter(function(f){return f.y<H+30;});flies.forEach(function(f){if(f.x<spider.x+spider.w&&f.x+f.w>spider.x&&f.y<spider.y+spider.h&&f.y+f.h>spider.y){sc+=10;document.getElementById('score').textContent=sc;f.done=true;}});flies=flies.filter(function(f){return !f.done;});flies.forEach(function(f){if(f.y+f.h>H){lv--;document.getElementById('lives').textContent=lv;f.done=true;if(lv<=0){ov=true;document.getElementById('ov').classList.add('show');}}});flies=flies.filter(function(f){return !f.done;});}
function draw(){x.fillStyle='#1a1a2a';x.fillRect(0,0,W,H);for(var i=0;i<8;i++){x.strokeStyle='#333';x.beginPath();x.moveTo(W/2,0);x.lineTo(W/2+i*30,H);x.stroke();}flies.forEach(function(f){x.fillStyle='#facc15';x.beginPath();x.arc(f.x+15,f.y+15,10,0,6.3);x.fill();x.fillStyle='#000';x.beginPath();x.arc(f.x+15,f.y+15,2,0,6.3);x.fill();});x.fillStyle='#ef4444';x.fillRect(spider.x,spider.y,spider.w,spider.h);x.fillStyle='#000';x.beginPath();x.arc(spider.x+12,spider.y+15,3,0,6.3);x.fill();x.beginPath();x.arc(spider.x+28,spider.y+15,3,0,6.3);x.fill();}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,20);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')mv(-1);if(e.key==='ArrowRight')mv(1);});
c.addEventListener('mousemove',function(e){var r=c.getBoundingClientRect();spider.x=(e.clientX-r.left)*(W/r.width)-spider.w/2;spider.x=Math.max(0,Math.min(W-spider.w,spider.x));});
c.addEventListener('touchmove',function(e){e.preventDefault();var r=c.getBoundingClientRect();spider.x=(e.touches[0].clientX-r.left)*(W/r.width)-spider.w/2;spider.x=Math.max(0,Math.min(W-spider.w,spider.x));},{passive:false});
rst();
`, "spider-web");
}

function vampireAttack(): string {
  return wrap("Vampire 2", `
<h1>🧛 <span>Vampire 2</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="500" height="500"></canvas>
<div class="controls"><button ontouchstart="atk();event.preventDefault()" onclick="atk()" style="width:180px;background:#ef4444;color:#fff">ATTAQUER</button></div>
<div class="overlay" id="ov"><h2>Terminé</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var pl,en,sc,ov,loop,t,hp;
function init(){pl={x:W/2-20,y:H-80,w:40,h:40};en=[];sc=0;ov=false;t=0;hp=100;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function atk(){if(ov)return;en.forEach(function(e){if(Math.hypot(e.x-pl.x-20,e.y-pl.y-20)<80){e.hp-=30;if(e.hp<=0){e.dead=true;sc+=50;document.getElementById('score').textContent=sc;}}});en=en.filter(function(e){return !e.dead;});}
window.atk=atk;
function upd(){t++;hp-=0.05;if(t%60===0)en.push({x:Math.random()*(W-40),y:-40,w:40,h:40,hp:30,vy:1});en.forEach(function(e){e.y+=e.vy;if(e.y+e.h>pl.y){hp-=20;e.dead=true;}});en=en.filter(function(e){return !e.dead;});if(hp<=0){ov=true;document.getElementById('fin').textContent=sc;document.getElementById('ov').classList.add('show');}}
function draw(){x.fillStyle='#1a0a2a';x.fillRect(0,0,W,H);x.fillStyle='#ef4444';x.fillRect(0,10,hp*4,10);en.forEach(function(e){x.fillStyle='#a855f7';x.fillRect(e.x,e.y,e.w,e.h);x.fillStyle='#fff';x.beginPath();x.arc(e.x+15,e.y+20,3,0,6.3);x.fill();x.beginPath();x.arc(e.x+25,e.y+20,3,0,6.3);x.fill();});x.fillStyle='#22c55e';x.fillRect(pl.x,pl.y,pl.w,pl.h);x.fillStyle='#000';x.beginPath();x.arc(pl.x+15,pl.y+20,4,0,6.3);x.fill();x.beginPath();x.arc(pl.x+25,pl.y+20,4,0,6.3);x.fill();}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,20);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key===' ')atk();});
c.addEventListener('click',atk);
rst();
`, "vampire2");
}

function zombieAttack(): string {
  return wrap("Zombie 2", `
<h1>🧟 <span>Zombie 2</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>HP : <strong id="hp">100</strong></span></div>
<canvas id="g" width="500" height="500"></canvas>
<div class="controls"><button ontouchstart="sh();event.preventDefault()" onclick="sh()" style="width:180px;background:#ef4444;color:#fff">TIRER</button></div>
<div class="overlay" id="ov"><h2>Terminé</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var pl,zombs,bullets,sc,hp,ov,loop,t;
function init(){pl={x:W/2-15,y:H/2-15,w:30,h:30};zombs=[];bullets=[];sc=0;hp=100;ov=false;t=0;document.getElementById('score').textContent='0';document.getElementById('hp').textContent='100';document.getElementById('ov').classList.remove('show');}
function sh(){if(ov)return;bullets.push({x:pl.x+15,y:pl.y+15,vx:0,vy:-10,life:40});bullets.push({x:pl.x+15,y:pl.y+15,vx:0,vy:10,life:40});bullets.push({x:pl.x+15,y:pl.y+15,vx:-10,vy:0,life:40});bullets.push({x:pl.x+15,y:pl.y+15,vx:10,vy:0,life:40});}
window.sh=sh;
function upd(){t++;if(t%80===0)zombs.push({x:Math.random()*(W-30),y:-30,w:30,h:30,hp:2,sp:0.8});zombs.forEach(function(z){var dx=pl.x+15-z.x-15,dy=pl.y+15-z.y-15;var d=Math.sqrt(dx*dx+dy*dy);if(d>0){z.x+=dx/d*z.sp;z.y+=dy/d*z.sp;}if(d<25){hp-=0.5;document.getElementById('hp').textContent=Math.floor(hp);if(hp<=0){ov=true;document.getElementById('fin').textContent=sc;document.getElementById('ov').classList.add('show');}}});bullets.forEach(function(b){b.x+=b.vx;b.y+=b.vy;b.life--;});bullets=bullets.filter(function(b){return b.life>0&&b.x>0&&b.x<W&&b.y>0&&b.y<H;});bullets.forEach(function(b){zombs.forEach(function(z){if(Math.hypot(b.x-z.x-15,b.y-z.y-15)<20){z.hp--;b.life=0;if(z.hp<=0){z.dead=true;sc+=30;document.getElementById('score').textContent=sc;}}});});bullets=bullets.filter(function(b){return b.life>0;});zombs=zombs.filter(function(z){return !z.dead;});}
function draw(){x.fillStyle='#0a0a0a';x.fillRect(0,0,W,H);x.fillStyle='#22c55e';x.beginPath();x.arc(pl.x+15,pl.y+15,15,0,6.3);x.fill();zombs.forEach(function(z){x.fillStyle='#a855f7';x.beginPath();x.arc(z.x+15,z.y+15,15,0,6.3);x.fill();x.fillStyle='#000';x.beginPath();x.arc(z.x+10,z.y+12,3,0,6.3);x.fill();x.beginPath();x.arc(z.x+20,z.y+12,3,0,6.3);x.fill();});x.fillStyle='#facc15';bullets.forEach(function(b){x.beginPath();x.arc(b.x,b.y,4,0,6.3);x.fill();});}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,20);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key===' ')sh();});
c.addEventListener('click',sh);
rst();
`, "zombie2");
}

function galaxy(): string {
  return wrap("Galaxie", `
<h1>🌌 <span>Galaxie</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Vies : <strong id="lives">3</strong></span></div>
<canvas id="g" width="500" height="600" style="width:min(500px,80vw)"></canvas>
<div class="controls"><button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button><button ontouchstart="sh();event.preventDefault()" onclick="sh()">🔥</button><button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button></div>
<div class="overlay" id="ov"><h2>Game Over</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var pl,bl,en,sc,lv,ov,loop,t,wave;
function init(){pl={x:W/2-15,y:H-50,w:30,h:30};bl=[];en=[];sc=0;lv=3;ov=false;t=0;wave=1;document.getElementById('score').textContent='0';document.getElementById('lives').textContent='3';document.getElementById('ov').classList.remove('show');}
function mv(d){pl.x+=d*25;pl.x=Math.max(0,Math.min(W-pl.w,pl.x));}
function sh(){if(ov)return;bl.push({x:pl.x+pl.w/2,y:pl.y,vy:-10});}
window.mv=mv;window.sh=sh;
function upd(){t++;if(t%40===0){var cols=5;for(var i=0;i<cols;i++)en.push({x:i*(W/cols)+20,y:-30,w:30,h:30,hp:1,vy:1.5});}en.forEach(function(e){e.y+=e.vy;});bl.forEach(function(b){b.y+=b.vy;});bl=bl.filter(function(b){return b.y>0;});bl.forEach(function(b){en.forEach(function(e){if(e.hp<=0)return;if(Math.hypot(b.x-e.x-15,b.y-e.y-15)<20){e.hp--;b.y=-100;if(e.hp<=0){sc+=20;document.getElementById('score').textContent=sc;}}});});bl=bl.filter(function(b){return b.y>0;});en=en.filter(function(e){return e.hp>0&&e.y<H+30;});en.forEach(function(e){if(e.y+e.h>pl.y&&e.x<pl.x+pl.w&&e.x+e.w>pl.x){lv--;document.getElementById('lives').textContent=lv;e.hp=0;if(lv<=0){ov=true;document.getElementById('ov').classList.add('show');}}});en=en.filter(function(e){return e.hp>0;});}
function draw(){x.fillStyle='#000';x.fillRect(0,0,W,H);for(var i=0;i<40;i++){x.fillStyle='#fff';x.fillRect((i*37)%W,(i*29+ (t*0.5))%H,1,1);}x.fillStyle='#22c55e';x.beginPath();x.moveTo(pl.x+pl.w/2,pl.y);x.lineTo(pl.x,pl.y+pl.h);x.lineTo(pl.x+pl.w,pl.y+pl.h);x.closePath();x.fill();x.fillStyle='#facc15';bl.forEach(function(b){x.fillRect(b.x-1,b.y,3,8);});en.forEach(function(e){x.fillStyle='#a855f7';x.fillRect(e.x,e.y,e.w,e.h);});}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,20);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')mv(-1);if(e.key==='ArrowRight')mv(1);if(e.key===' ')sh();});
rst();
`, "galaxy");
}

function snakeVsSnake(): string {
  return wrap("Snake Duel", `
<h1>🐍 <span>Snake Duel</span></h1>
<div class="stats"><span>Toi : <strong id="s1">0</strong></span><span>IA : <strong id="s2">0</strong></span></div>
<canvas id="g" width="400" height="400"></canvas>
<div class="controls"><button ontouchstart="mv(0,-1);event.preventDefault()" onclick="mv(0,-1)">↑</button></div>
<div class="controls"><button ontouchstart="mv(-1,0);event.preventDefault()" onclick="mv(-1,0)">←</button><button ontouchstart="mv(0,1);event.preventDefault()" onclick="mv(0,1)">↓</button><button ontouchstart="mv(1,0);event.preventDefault()" onclick="mv(1,0)">→</button></div>
<div class="overlay" id="ov"><h2 id="ttl">Fin</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),T=20,N=20;
var s1,s2,food,dir1,dir2,sc1,sc2,ov,loop;
function init(){s1=[{x:5,y:10},{x:4,y:10}];s2=[{x:14,y:10},{x:15,y:10}];dir1={x:1,y:0};dir2={x:-1,y:0};sc1=0;sc2=0;ov=false;spawnFood();document.getElementById('s1').textContent='0';document.getElementById('s2').textContent='0';document.getElementById('ov').classList.remove('show');}
function spawnFood(){food={x:Math.floor(Math.random()*N),y:Math.floor(Math.random()*N)};}
function mv(a,b){if(a===-dir1.x&&b===-dir1.y)return;dir1={x:a,y:b};}
window.mv=mv;
function upd(){var h1={x:s1[0].x+dir1.x,y:s1[0].y+dir1.y};if(h1.x<0||h1.x>=N||h1.y<0||h1.y>=N||s1.some(function(s){return s.x===h1.x&&s.y===h1.y;})){ov=true;document.getElementById('ttl').textContent='😢 Tu perds';document.getElementById('ov').classList.add('show');return;}s1.unshift(h1);if(h1.x===food.x&&h1.y===food.y){sc1+=10;spawnFood();}else s1.pop();document.getElementById('s1').textContent=sc1;var hd=food.x-s2[0].x,vd=food.y-s2[0].y;if(Math.abs(hd)>Math.abs(vd)&&hd!==0)dir2={x:hd>0?1:-1,y:0};else if(vd!==0)dir2={x:0,y:vd>0?1:-1};var h2={x:s2[0].x+dir2.x,y:s2[0].y+dir2.y};if(h2.x<0||h2.x>=N||h2.y<0||h2.y>=N||s2.some(function(s){return s.x===h2.x&&s.y===h2.y;})){ov=true;document.getElementById('ttl').textContent='🎉 Tu gagnes';document.getElementById('ov').classList.add('show');return;}s2.unshift(h2);if(h2.x===food.x&&h2.y===food.y){sc2+=10;spawnFood();}else s2.pop();document.getElementById('s2').textContent=sc2;if(s1[0].x===s2[0].x&&s1[0].y===s2[0].y){ov=true;document.getElementById('ttl').textContent='Match nul';document.getElementById('ov').classList.add('show');}}
function draw(){x.fillStyle='#000';x.fillRect(0,0,c.width,c.height);x.fillStyle='#ef4444';x.fillRect(food.x*T,food.y*T,T-2,T-2);s1.forEach(function(s,i){x.fillStyle=i===0?'#22c55e':'#16a34a';x.fillRect(s.x*T,s.y*T,T-2,T-2);});s2.forEach(function(s,i){x.fillStyle=i===0?'#3b82f6':'#1d4ed8';x.fillRect(s.x*T,s.y*T,T-2,T-2);});}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,150);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')mv(-1,0);if(e.key==='ArrowRight')mv(1,0);if(e.key==='ArrowUp')mv(0,-1);if(e.key==='ArrowDown')mv(0,1);});
rst();
`, "snake-duel");
}

function pong4(): string {
  return wrap("Pong 4", `
<h1>🏓 <span>Pong 4</span></h1>
<div class="stats"><span>Toi : <strong id="s1">0</strong></span><span>IA 1 : <strong id="s2">0</strong></span><span>IA 2 : <strong id="s3">0</strong></span></div>
<canvas id="g" width="500" height="500"></canvas>
<div class="controls"><button ontouchstart="mv('l');event.preventDefault()" onclick="mv('l')">←</button><button ontouchstart="mv('r');event.preventDefault()" onclick="mv('r')">→</button></div>
<div class="overlay" id="ov"><h2 id="ttl">Fin</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var p1,p2,p3,p4,ball,s1,s2,s3,ov,loop;
function init(){p1={x:W/2-50,y:H-20,w:100,h:10};p2={x:W-20,y:H/2-50,w:10,h:100};p3={x:W/2-50,y:10,w:100,h:10};p4={x:10,y:H/2-50,w:10,h:100};ball={x:W/2,y:H/2,vx:3,vy:3,r:8};s1=0;s2=0;s3=0;ov=false;document.getElementById('s1').textContent='0';document.getElementById('s2').textContent='0';document.getElementById('s3').textContent='0';document.getElementById('ov').classList.remove('show');}
function mv(d){if(d==='l')p1.x-=30;else p1.x+=30;p1.x=Math.max(0,Math.min(W-p1.w,p1.x));}
window.mv=mv;
function upd(){ball.x+=ball.vx;ball.y+=ball.vy;if(ball.y-ball.r<p3.y+p3.h&&ball.x>p3.x&&ball.x<p3.x+p3.w&&ball.vy<0)ball.vy*=-1;if(ball.x-ball.r<p4.x+p4.w&&ball.y>p4.y&&ball.y<p4.y+p4.h&&ball.vx<0)ball.vx*=-1;if(ball.x+ball.r>p2.x&&ball.y>p2.y&&ball.y<p2.y+p2.h&&ball.vx>0)ball.vx*=-1;if(ball.y+ball.r>p1.y&&ball.x>p1.x&&ball.x<p1.x+p1.w&&ball.vy>0)ball.vy*=-1;if(ball.x-ball.r<0){s2++;document.getElementById('s2').textContent=s2;reset();}if(ball.x+ball.r>W){s3++;document.getElementById('s3').textContent=s3;reset();}if(ball.y-ball.r<0){s1++;document.getElementById('s1').textContent=s1;reset();}if(ball.y+ball.r>H){s1++;document.getElementById('s1').textContent=s1;reset();}var tp1=ball.x-p1.w/2;p1.x+=(tp1-p1.x)*0.08;p1.x=Math.max(0,Math.min(W-p1.w,p1.x));var tp2=ball.y-p2.h/2;p2.y+=(tp2-p2.y)*0.06;p2.y=Math.max(0,Math.min(H-p2.h,p2.y));var tp3=ball.x-p3.w/2;p3.x+=(tp3-p3.x)*0.06;p3.x=Math.max(0,Math.min(W-p3.w,p3.x));var tp4=ball.y-p4.h/2;p4.y+=(tp4-p4.y)*0.06;p4.y=Math.max(0,Math.min(H-p4.h,p4.y));if(s1>=5||s2>=5||s3>=5){ov=true;document.getElementById('ttl').textContent=s1>=5?'🎉 Gagné':s2>=5?'😢 IA1 gagne':'😢 IA2 gagne';document.getElementById('ov').classList.add('show');}}
function reset(){ball.x=W/2;ball.y=H/2;ball.vx=(Math.random()<0.5?3:-3);ball.vy=(Math.random()<0.5?3:-3);}
function draw(){x.fillStyle='#000';x.fillRect(0,0,W,H);x.strokeStyle='#2a2a2a';x.setLineDash([8,8]);x.beginPath();x.moveTo(W/2,H);x.lineTo(W/2,0);x.stroke();x.setLineDash([]);x.fillStyle='#facc15';x.fillRect(p1.x,p1.y,p1.w,p1.h);x.fillStyle='#ef4444';x.fillRect(p2.x,p2.y,p2.w,p2.h);x.fillStyle='#3b82f6';x.fillRect(p3.x,p3.y,p3.w,p3.h);x.fillStyle='#22c55e';x.fillRect(p4.x,p4.y,p4.w,p4.h);x.fillStyle='#fff';x.beginPath();x.arc(ball.x,ball.y,ball.r,0,6.3);x.fill();}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')mv('l');if(e.key==='ArrowRight')mv('r');});
rst();
`, "pong4");
}

function spaceInvaders2(): string {
  return wrap("Invaders+", `
<h1>👾 <span>Invaders+</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Vies : <strong id="lives">3</strong></span></div>
<canvas id="g" width="480" height="500" style="width:min(480px,80vw)"></canvas>
<div class="controls"><button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button><button ontouchstart="sh();event.preventDefault()" onclick="sh()">🔥</button><button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button></div>
<div class="overlay" id="ov"><h2 id="ttl">Game Over</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var pl,bl,en,dir,sc,lv,ov,loop,t,wave;
function init(){pl={x:W/2-20,y:H-30,w:40,h:20};bl=[];en=[];dir=1;sc=0;lv=3;ov=false;t=0;wave=1;spawnWave();document.getElementById('score').textContent='0';document.getElementById('lives').textContent='3';document.getElementById('ov').classList.remove('show');}
function spawnWave(){for(var r=0;r<4+wave;r++)for(var col=0;col<8;col++)en.push({x:col*50+30,y:r*40+40,w:35,h:25,alive:true});}
function mv(d){pl.x+=d*25;pl.x=Math.max(0,Math.min(W-pl.w,pl.x));}
function sh(){if(ov)return;bl.push({x:pl.x+pl.w/2,y:pl.y,vy:-9});}
window.mv=mv;window.sh=sh;
function upd(){t++;bl.forEach(function(b){b.y+=b.vy;});bl=bl.filter(function(b){return b.y>0;});var hw=false;en.forEach(function(e){if(!e.alive)return;e.x+=dir*0.6;if(e.x<10||e.x+e.w>W-10)hw=true;});if(hw){dir*=-1;en.forEach(function(e){e.y+=20;});}bl.forEach(function(b){en.forEach(function(e){if(!e.alive)return;if(Math.hypot(b.x-e.x-17,b.y-e.y-12)<20){e.alive=false;b.y=-100;sc+=20;document.getElementById('score').textContent=sc;}});});bl=bl.filter(function(b){return b.y>0;});if(en.every(function(e){return !e.alive;})){wave++;spawnWave();}en.forEach(function(e){if(e.alive&&e.y+e.h>pl.y){lv--;document.getElementById('lives').textContent=lv;if(lv<=0){ov=true;document.getElementById('ttl').textContent='Game Over';document.getElementById('ov').classList.add('show');}}});}
function draw(){x.fillStyle='#000';x.fillRect(0,0,W,H);x.fillStyle='#22c55e';x.fillRect(pl.x,pl.y,pl.w,pl.h);x.fillStyle='#facc15';bl.forEach(function(b){x.fillRect(b.x-1,b.y,3,8);});en.forEach(function(e){if(e.alive){x.fillStyle='#a855f7';x.fillRect(e.x,e.y,e.w,e.h);x.fillStyle='#fff';x.fillRect(e.x+8,e.y+8,5,5);x.fillRect(e.x+17,e.y+8,5,5);}});}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')mv(-1);if(e.key==='ArrowRight')mv(1);if(e.key===' ')sh();});
rst();
`, "invaders2");
}

function pong3(): string {
  return wrap("Pong 3", `
<h1>🏓 <span>Pong 3</span></h1>
<div class="stats"><span>Toi : <strong id="s1">0</strong></span><span>IA : <strong id="s2">0</strong></span></div>
<canvas id="g" width="600" height="400"></canvas>
<div class="controls"><button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">↑</button><button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">↓</button></div>
<div class="overlay" id="ov"><h2 id="ttl">Fin</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var p1,p2,ball,s1,s2,ov,loop,ballSize;
function init(){p1={x:20,y:H/2-40,h:80,w:10};p2={x:W-30,y:H/2-40,h:80,w:10};ball={x:W/2,y:H/2,vx:5,vy:3,r:8};s1=0;s2=0;ov=false;ballSize=8;document.getElementById('s1').textContent='0';document.getElementById('s2').textContent='0';document.getElementById('ov').classList.remove('show');}
function mv(d){p1.y+=d*30;p1.y=Math.max(0,Math.min(H-p1.h,p1.y));}
window.mv=mv;
function upd(){ball.x+=ball.vx;ball.y+=ball.vy;if(ball.y<ball.r||ball.y>H-ball.r)ball.vy*=-1;if(ball.x-ball.r<p1.x+p1.w&&ball.y>p1.y&&ball.y<p1.y+p1.h&&ball.vx<0){ball.vx*=-1;ballSize=Math.max(4,ballSize-0.5);ball.r=ballSize;}if(ball.x+ball.r>p2.x&&ball.y>p2.y&&ball.y<p2.y+p2.h&&ball.vx>0){ball.vx*=-1;}var tp=ball.y-p2.h/2;p2.y+=(tp-p2.y)*0.08;p2.y=Math.max(0,Math.min(H-p2.h,p2.y));if(ball.x<0){s2++;document.getElementById('s2').textContent=s2;reset();}if(ball.x>W){s1++;document.getElementById('s1').textContent=s1;reset();}if(s1>=10||s2>=10){ov=true;document.getElementById('ttl').textContent=s1>=10?'🎉 Gagné':'😢 Perdu';document.getElementById('ov').classList.add('show');}}
function reset(){ball.x=W/2;ball.y=H/2;ball.vx=(Math.random()<0.5?5:-5);ball.vy=(Math.random()-0.5)*6;ballSize=8;ball.r=8;}
function draw(){x.fillStyle='#000';x.fillRect(0,0,W,H);x.strokeStyle='#2a2a2a';x.setLineDash([8,8]);x.beginPath();x.moveTo(W/2,0);x.lineTo(W/2,H);x.stroke();x.setLineDash([]);x.fillStyle='#22c55e';x.fillRect(p1.x,p1.y,p1.w,p1.h);x.fillStyle='#ef4444';x.fillRect(p2.x,p2.y,p2.w,p2.h);x.fillStyle='#facc15';x.beginPath();x.arc(ball.x,ball.y,ball.r,0,6.3);x.fill();}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowUp')mv(-1);if(e.key==='ArrowDown')mv(1);});
rst();
`, "pong3");
}

function tetris3(): string {
  return wrap("Tetris 3", `
<h1>🧩 <span>Tetris 3</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Lignes : <strong id="lines">0</strong></span></div>
<canvas id="g" width="300" height="600" style="width:min(300px,60vw)"></canvas>
<div class="controls"><button ontouchstart="act('l');event.preventDefault()" onclick="act('l')">←</button><button ontouchstart="act('r');event.preventDefault()" onclick="act('r')">↻</button><button ontouchstart="act('p');event.preventDefault()" onclick="act('p')">→</button><button ontouchstart="act('d');event.preventDefault()" onclick="act('d')">↓</button></div>
<div class="overlay" id="ov"><h2>Game Over</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),COLS=10,ROWS=20,B=c.width/COLS;
var board,piece,px,py,sc,lines,ov,loop,next;
var SHAPES=[[[1,1,1,1]],[[1,1],[1,1]],[[0,1,0],[1,1,1]],[[1,0,0],[1,1,1]],[[0,0,1],[1,1,1]],[[0,1,1],[1,1,0]],[[1,1,0],[0,1,1]]];
var COLORS=['#06b6d4','#facc15','#a855f7','#3b82f6','#f97316','#22c55e','#ef4444'];
function init(){board=[];for(var i=0;i<ROWS;i++){board[i]=[];for(var j=0;j<COLS;j++)board[i][j]=0;}sc=0;lines=0;ov=false;newP();newP();document.getElementById('score').textContent='0';document.getElementById('lines').textContent='0';document.getElementById('ov').classList.remove('show');}
function newP(){if(next){piece=next;}else{var i=Math.floor(Math.random()*SHAPES.length);piece={shape:SHAPES[i].map(function(r){return r.slice();}),color:COLORS[i]};}var i=Math.floor(Math.random()*SHAPES.length);next={shape:SHAPES[i].map(function(r){return r.slice();}),color:COLORS[i]};px=Math.floor((COLS-piece.shape[0].length)/2);py=0;if(coll())end();}
function coll(){for(var y=0;y<piece.shape.length;y++)for(var x=0;x<piece.shape[y].length;x++){if(piece.shape[y][x]){var nx=px+x,ny=py+y;if(nx<0||nx>=COLS||ny>=ROWS)return true;if(ny>=0&&board[ny][nx])return true;}}return false;}
function merge(){for(var y=0;y<piece.shape.length;y++)for(var x=0;x<piece.shape[y].length;x++)if(piece.shape[y][x])board[py+y][px+x]=piece.color;}
function clr(){var cnt=0;for(var y=ROWS-1;y>=0;y--){if(board[y].every(function(c){return c;})){board.splice(y,1);board.unshift([]);for(var j=0;j<COLS;j++)board[0][j]=0;cnt++;y++;}}if(cnt){sc+=cnt*100;lines+=cnt;document.getElementById('score').textContent=sc;document.getElementById('lines').textContent=lines;}}
function draw(){x.fillStyle='#000';x.fillRect(0,0,c.width,c.height);for(var y=0;y<ROWS;y++)for(var xx=0;xx<COLS;xx++){if(board[y][xx]){x.fillStyle=board[y][xx];x.fillRect(xx*B+1,y*B+1,B-2,B-2);}}if(piece){for(var y=0;y<piece.shape.length;y++)for(var xx=0;xx<piece.shape[y].length;xx++){if(piece.shape[y][xx]){x.fillStyle=piece.color;x.fillRect((px+xx)*B+1,(py+y)*B+1,B-2,B-2);}}}x.fillStyle='#666';x.fillRect(c.width-60,10,50,50);if(next){x.fillStyle=next.color;x.fillRect(c.width-55,15,40,40);}}
function act(a){if(ov||!piece)return;if(a==='l'){px--;if(coll())px++;}else if(a==='r'){px++;if(coll())px--;}else if(a==='d'){py++;if(coll()){py--;merge();clr();newP();}}else if(a==='p'){var r=piece.shape[0].map(function(_,i){return piece.shape.map(function(row){return row[i];}).reverse();});var old=piece.shape;piece.shape=r;if(coll())piece.shape=old;}draw();}
function tick(){if(!ov){py++;if(coll()){py--;merge();clr();newP();}draw();}}
function end(){ov=true;document.getElementById('ov').classList.add('show');}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,500);draw();}
window.act=act;window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')act('l');if(e.key==='ArrowRight')act('p');if(e.key==='ArrowUp')act('r');if(e.key==='ArrowDown')act('d');});
rst();
`, "tetris3");
}

function arkanoid2(): string {
  return wrap("Arkanoid 2", `
<h1>🧱 <span>Arkanoid 2</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Vies : <strong id="lives">3</strong></span></div>
<canvas id="g" width="500" height="500"></canvas>
<div class="controls"><button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button><button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button></div>
<div class="overlay" id="ov"><h2 id="ttl">Game Over</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var pad,balls,bricks,sc,lv,ov,loop;
function init(){pad={x:W/2-60,y:H-20,w:120,h:15};balls=[{x:W/2,y:H-50,dx:4,dy:-4,r:8}];bricks=[];for(var r=0;r<5;r++)for(var col=0;col<8;col++)bricks.push({x:col*62+4,y:r*25+30,w:58,h:20,alive:true,clr:['#ef4444','#f59e0b','#22c55e','#3b82f6','#a855f7'][r]});sc=0;lv=3;ov=false;document.getElementById('score').textContent='0';document.getElementById('lives').textContent='3';document.getElementById('ov').classList.remove('show');}
function mv(d){pad.x+=d*30;pad.x=Math.max(0,Math.min(W-pad.w,pad.x));}
window.mv=mv;
function upd(){balls.forEach(function(b){b.x+=b.dx;b.y+=b.dy;if(b.x-b.r<0||b.x+b.r>W)b.dx*=-1;if(b.y-b.r<0)b.dy*=-1;if(b.y+b.r>pad.y&&b.y-b.r<pad.y+pad.h&&b.x>pad.x&&b.x<pad.x+pad.w&&b.dy>0){b.dy*=-1;b.dx+=(b.x-(pad.x+pad.w/2))/20;}if(b.y>H){b.dead=true;lv--;document.getElementById('lives').textContent=lv;if(lv<=0){ov=true;document.getElementById('ttl').textContent='Game Over';document.getElementById('ov').classList.add('show');}}});if(balls.every(function(b){return b.dead;})){balls=[{x:W/2,y:H-50,dx:4,dy:-4,r:8}];}balls=balls.filter(function(b){return !b.dead;});balls.forEach(function(b){bricks.forEach(function(br){if(!br.alive)return;if(b.x>br.x&&b.x<br.x+br.w&&b.y>br.y&&b.y<br.y+br.h){br.alive=false;b.dy*=-1;sc+=10;document.getElementById('score').textContent=sc;}});});if(bricks.every(function(b){return !b.alive;})){ov=true;document.getElementById('ttl').textContent='🎉 Victoire';document.getElementById('ov').classList.add('show');}}
function draw(){x.fillStyle='#000';x.fillRect(0,0,W,H);x.fillStyle='#22c55e';x.fillRect(pad.x,pad.y,pad.w,pad.h);x.fillStyle='#fff';balls.forEach(function(b){x.beginPath();x.arc(b.x,b.y,b.r,0,6.3);x.fill();});bricks.forEach(function(b){if(b.alive){x.fillStyle=b.clr;x.fillRect(b.x,b.y,b.w,b.h);}});}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')mv(-1);if(e.key==='ArrowRight')mv(1);});
c.addEventListener('mousemove',function(e){var r=c.getBoundingClientRect();pad.x=(e.clientX-r.left)*(W/r.width)-pad.w/2;pad.x=Math.max(0,Math.min(W-pad.w,pad.x));});
c.addEventListener('touchmove',function(e){e.preventDefault();var r=c.getBoundingClientRect();pad.x=(e.touches[0].clientX-r.left)*(W/r.width)-pad.w/2;pad.x=Math.max(0,Math.min(W-pad.w,pad.x));},{passive:false});
rst();
`, "arkanoid2");
}

function pongPro2(): string {
  return wrap("Pong Pro 2", `
<h1>🏓 <span>Pong Pro 2</span></h1>
<div class="stats"><span>Toi : <strong id="s1">0</strong></span><span>IA : <strong id="s2">0</strong></span></div>
<canvas id="g" width="600" height="400"></canvas>
<div class="controls"><button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">↑</button><button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">↓</button></div>
<div class="overlay" id="ov"><h2 id="ttl">Fin</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var p1,p2,balls,s1,s2,ov,loop;
function init(){p1={x:20,y:H/2-50,h:100,w:10};p2={x:W-30,y:H/2-50,h:100,w:10};balls=[{x:W/2,y:H/2,vx:6,vy:3,r:8}];s1=0;s2=0;ov=false;document.getElementById('s1').textContent='0';document.getElementById('s2').textContent='0';document.getElementById('ov').classList.remove('show');}
function mv(d){p1.y+=d*30;p1.y=Math.max(0,Math.min(H-p1.h,p1.y));}
window.mv=mv;
function upd(){balls.forEach(function(b){b.x+=b.vx;b.y+=b.vy;if(b.y<b.r||b.y>H-b.r)b.vy*=-1;if(b.x-b.r<p1.x+p1.w&&b.y>p1.y&&b.y<p1.y+p1.h&&b.vx<0){b.vx*=-1;balls.push({x:b.x,y:b.y,vx:-b.vx,vy:b.vy,r:8});}if(b.x+b.r>p2.x&&b.y>p2.y&&b.y<p2.y+p2.h&&b.vx>0)b.vx*=-1;if(b.x<0){b.dead=true;s2++;document.getElementById('s2').textContent=s2;}if(b.x>W){b.dead=true;s1++;document.getElementById('s1').textContent=s1;}});if(balls.every(function(b){return b.dead;})){balls=[{x:W/2,y:H/2,vx:(Math.random()<0.5?6:-6),vy:(Math.random()-0.5)*6,r:8}];}balls=balls.filter(function(b){return !b.dead;});var tp=balls[0]?balls[0].y:H/2;p2.y+=(tp-p2.h/2-p2.y)*0.08;p2.y=Math.max(0,Math.min(H-p2.h,p2.y));if(s1>=7||s2>=7){ov=true;document.getElementById('ttl').textContent=s1>=7?'🎉 Gagné':'😢 Perdu';document.getElementById('ov').classList.add('show');}}
function draw(){x.fillStyle='#000';x.fillRect(0,0,W,H);x.strokeStyle='#2a2a2a';x.setLineDash([8,8]);x.beginPath();x.moveTo(W/2,0);x.lineTo(W/2,H);x.stroke();x.setLineDash([]);x.fillStyle='#22c55e';x.fillRect(p1.x,p1.y,p1.w,p1.h);x.fillStyle='#ef4444';x.fillRect(p2.x,p2.y,p2.w,p2.h);x.fillStyle='#facc15';balls.forEach(function(b){x.beginPath();x.arc(b.x,b.y,b.r,0,6.3);x.fill();});}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowUp')mv(-1);if(e.key==='ArrowDown')mv(1);});
rst();
`, "pong-pro2");
}

function snakePro2(): string {
  return wrap("Snake Pro 2", `
<h1>🐍 <span>Snake Pro 2</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="440" height="440"></canvas>
<div class="controls"><button ontouchstart="mv(0,-1);event.preventDefault()" onclick="mv(0,-1)">↑</button></div>
<div class="controls"><button ontouchstart="mv(-1,0);event.preventDefault()" onclick="mv(-1,0)">←</button><button ontouchstart="mv(0,1);event.preventDefault()" onclick="mv(0,1)">↓</button><button ontouchstart="mv(1,0);event.preventDefault()" onclick="mv(1,0)">→</button></div>
<div class="overlay" id="ov"><h2>Game Over</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),N=22,T=20;
var sn,dir,nd,food,sc,ov,loop,speed;
function init(){sn=[{x:11,y:11},{x:10,y:11},{x:9,y:11}];dir={x:1,y:0};nd={x:1,y:0};sc=0;ov=false;speed=110;spawnFood();document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function spawnFood(){while(1){food={x:Math.floor(Math.random()*N),y:Math.floor(Math.random()*N)};if(!sn.some(function(s){return s.x===food.x&&s.y===food.y;}))return;}}
function mv(a,b){if(a===-dir.x&&b===-dir.y)return;nd={x:a,y:b};}
window.mv=mv;
function upd(){dir=nd;var h={x:sn[0].x+dir.x,y:sn[0].y+dir.y};if(h.x<0||h.x>=N||h.y<0||h.y>=N||sn.some(function(s){return s.x===h.x&&s.y===h.y;})){ov=true;document.getElementById('fin').textContent=sc;document.getElementById('ov').classList.add('show');return;}sn.unshift(h);if(h.x===food.x&&h.y===food.y){sc+=10;document.getElementById('score').textContent=sc;spawnFood();speed=Math.max(50,speed-2);clearInterval(loop);loop=setInterval(tick,speed);}else sn.pop();}
function draw(){x.fillStyle='#000';x.fillRect(0,0,c.width,c.height);x.fillStyle='#ef4444';x.fillRect(food.x*T+1,food.y*T+1,T-2,T-2);sn.forEach(function(s,i){x.fillStyle=i===0?'#22c55e':'#16a34a';x.fillRect(s.x*T+1,s.y*T+1,T-2,T-2);});}
function tick(){upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,speed);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')mv(-1,0);if(e.key==='ArrowRight')mv(1,0);if(e.key==='ArrowUp')mv(0,-1);if(e.key==='ArrowDown')mv(0,1);});
rst();
`, "snake-pro2");
}

function pongClassic2(): string {
  return wrap("Pong Classic 2", `
<h1>🏓 <span>Pong Classic 2</span></h1>
<div class="stats"><span>Toi : <strong id="s1">0</strong></span><span>IA : <strong id="s2">0</strong></span></div>
<canvas id="g" width="600" height="400"></canvas>
<div class="controls"><button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">↑</button><button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">↓</button></div>
<div class="overlay" id="ov"><h2 id="ttl">Fin</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var p1,p2,ball,s1,s2,ov,loop;
function init(){p1={x:20,y:H/2-40,h:80,w:10};p2={x:W-30,y:H/2-40,h:80,w:10};ball={x:W/2,y:H/2,vx:5,vy:3,r:8};s1=0;s2=0;ov=false;document.getElementById('s1').textContent='0';document.getElementById('s2').textContent='0';document.getElementById('ov').classList.remove('show');}
function mv(d){p1.y+=d*30;p1.y=Math.max(0,Math.min(H-p1.h,p1.y));}
window.mv=mv;
function upd(){ball.x+=ball.vx;ball.y+=ball.vy;if(ball.y<ball.r||ball.y>H-ball.r)ball.vy*=-1;if(ball.x-ball.r<p1.x+p1.w&&ball.y>p1.y&&ball.y<p1.y+p1.h&&ball.vx<0){ball.vx*=-1;ball.vy+=(ball.y-(p1.y+p1.h/2))/20;}if(ball.x+ball.r>p2.x&&ball.y>p2.y&&ball.y<p2.y+p2.h&&ball.vx>0){ball.vx*=-1;ball.vy+=(ball.y-(p2.y+p2.h/2))/20;}var tp=ball.y-p2.h/2;p2.y+=(tp-p2.y)*0.09;p2.y=Math.max(0,Math.min(H-p2.h,p2.y));if(ball.x<0){s2++;document.getElementById('s2').textContent=s2;reset();}if(ball.x>W){s1++;document.getElementById('s1').textContent=s1;reset();}if(s1>=7||s2>=7){ov=true;document.getElementById('ttl').textContent=s1>=7?'🎉 Gagné':'😢 Perdu';document.getElementById('ov').classList.add('show');}}
function reset(){ball.x=W/2;ball.y=H/2;ball.vx=(Math.random()<0.5?5:-5);ball.vy=(Math.random()-0.5)*6;}
function draw(){x.fillStyle='#000';x.fillRect(0,0,W,H);x.strokeStyle='#2a2a2a';x.setLineDash([10,10]);x.beginPath();x.moveTo(W/2,0);x.lineTo(W/2,H);x.stroke();x.setLineDash([]);x.fillStyle='#22c55e';x.fillRect(p1.x,p1.y,p1.w,p1.h);x.fillStyle='#ef4444';x.fillRect(p2.x,p2.y,p2.w,p2.h);x.fillStyle='#facc15';x.beginPath();x.arc(ball.x,ball.y,ball.r,0,6.3);x.fill();}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowUp')mv(-1);if(e.key==='ArrowDown')mv(1);});
rst();
`, "pong-classic2");
}

function snakeBig2(): string {
  return wrap("Snake Big 2", `
<h1>🐍 <span>Snake Big 2</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="500" height="500"></canvas>
<div class="controls"><button ontouchstart="mv(0,-1);event.preventDefault()" onclick="mv(0,-1)">↑</button></div>
<div class="controls"><button ontouchstart="mv(-1,0);event.preventDefault()" onclick="mv(-1,0)">←</button><button ontouchstart="mv(0,1);event.preventDefault()" onclick="mv(0,1)">↓</button><button ontouchstart="mv(1,0);event.preventDefault()" onclick="mv(1,0)">→</button></div>
<div class="overlay" id="ov"><h2>Game Over</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),N=25,T=20;
var sn,dir,nd,food,sc,ov,loop;
function init(){sn=[{x:12,y:12},{x:11,y:12},{x:10,y:12}];dir={x:1,y:0};nd={x:1,y:0};sc=0;ov=false;spawnFood();document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function spawnFood(){while(1){food={x:Math.floor(Math.random()*N),y:Math.floor(Math.random()*N)};if(!sn.some(function(s){return s.x===food.x&&s.y===food.y;}))return;}}
function mv(a,b){if(a===-dir.x&&b===-dir.y)return;nd={x:a,y:b};}
window.mv=mv;
function upd(){dir=nd;var h={x:sn[0].x+dir.x,y:sn[0].y+dir.y};if(h.x<0||h.x>=N||h.y<0||h.y>=N||sn.some(function(s){return s.x===h.x&&s.y===h.y;})){ov=true;document.getElementById('ov').classList.add('show');return;}sn.unshift(h);if(h.x===food.x&&h.y===food.y){sc+=10;document.getElementById('score').textContent=sc;spawnFood();}else sn.pop();}
function draw(){x.fillStyle='#000';x.fillRect(0,0,c.width,c.height);x.fillStyle='#ef4444';x.fillRect(food.x*T+1,food.y*T+1,T-2,T-2);sn.forEach(function(s,i){x.fillStyle=i===0?'#22c55e':'#16a34a';x.fillRect(s.x*T+1,s.y*T+1,T-2,T-2);});}
function tick(){upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,120);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')mv(-1,0);if(e.key==='ArrowRight')mv(1,0);if(e.key==='ArrowUp')mv(0,-1);if(e.key==='ArrowDown')mv(0,1);});
rst();
`, "snake-big2");
}

function tetris4(): string {
  return wrap("Tetris 4", `
<h1>🧩 <span>Tetris 4</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="300" height="600" style="width:min(300px,60vw)"></canvas>
<div class="controls"><button ontouchstart="act('l');event.preventDefault()" onclick="act('l')">←</button><button ontouchstart="act('r');event.preventDefault()" onclick="act('r')">↻</button><button ontouchstart="act('p');event.preventDefault()" onclick="act('p')">→</button><button ontouchstart="act('d');event.preventDefault()" onclick="act('d')">↓</button></div>
<div class="overlay" id="ov"><h2>Game Over</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),COLS=10,ROWS=20,B=c.width/COLS;
var board,piece,px,py,sc,ov,loop;
var SHAPES=[[[1,1,1,1]],[[1,1],[1,1]],[[0,1,0],[1,1,1]],[[1,0,0],[1,1,1]],[[0,0,1],[1,1,1]],[[0,1,1],[1,1,0]],[[1,1,0],[0,1,1]]];
var COLORS=['#06b6d4','#facc15','#a855f7','#3b82f6','#f97316','#22c55e','#ef4444'];
function init(){board=[];for(var i=0;i<ROWS;i++){board[i]=[];for(var j=0;j<COLS;j++)board[i][j]=0;}sc=0;ov=false;newP();document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function newP(){var i=Math.floor(Math.random()*SHAPES.length);piece={shape:SHAPES[i].map(function(r){return r.slice();}),color:COLORS[i]};px=Math.floor((COLS-piece.shape[0].length)/2);py=0;if(coll())end();}
function coll(){for(var y=0;y<piece.shape.length;y++)for(var x=0;x<piece.shape[y].length;x++){if(piece.shape[y][x]){var nx=px+x,ny=py+y;if(nx<0||nx>=COLS||ny>=ROWS)return true;if(ny>=0&&board[ny][nx])return true;}}return false;}
function merge(){for(var y=0;y<piece.shape.length;y++)for(var x=0;x<piece.shape[y].length;x++)if(piece.shape[y][x])board[py+y][px+x]=piece.color;}
function clr(){for(var y=ROWS-1;y>=0;y--){if(board[y].every(function(c){return c;})){board.splice(y,1);board.unshift([]);for(var j=0;j<COLS;j++)board[0][j]=0;sc+=100;document.getElementById('score').textContent=sc;y++;}}}
function draw(){x.fillStyle='#000';x.fillRect(0,0,c.width,c.height);for(var y=0;y<ROWS;y++)for(var xx=0;xx<COLS;xx++){if(board[y][xx]){x.fillStyle=board[y][xx];x.fillRect(xx*B+1,y*B+1,B-2,B-2);}}if(piece){for(var y=0;y<piece.shape.length;y++)for(var xx=0;xx<piece.shape[y].length;xx++){if(piece.shape[y][xx]){x.fillStyle=piece.color;x.fillRect((px+xx)*B+1,(py+y)*B+1,B-2,B-2);}}}}
function act(a){if(ov||!piece)return;if(a==='l'){px--;if(coll())px++;}else if(a==='r'){px++;if(coll())px--;}else if(a==='d'){py++;if(coll()){py--;merge();clr();newP();}}else if(a==='p'){var r=piece.shape[0].map(function(_,i){return piece.shape.map(function(row){return row[i];}).reverse();});var old=piece.shape;piece.shape=r;if(coll())piece.shape=old;}draw();}
function tick(){if(!ov){py++;if(coll()){py--;merge();clr();newP();}draw();}}
function end(){ov=true;document.getElementById('ov').classList.add('show');}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,450);draw();}
window.act=act;window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')act('l');if(e.key==='ArrowRight')act('p');if(e.key==='ArrowUp')act('r');if(e.key==='ArrowDown')act('d');});
rst();
`, "tetris4");
}

function snakeClassic3(): string {
  return wrap("Snake Classic 3", `
<h1>🐍 <span>Snake 3</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="400" height="400"></canvas>
<div class="controls"><button ontouchstart="mv(0,-1);event.preventDefault()" onclick="mv(0,-1)">↑</button></div>
<div class="controls"><button ontouchstart="mv(-1,0);event.preventDefault()" onclick="mv(-1,0)">←</button><button ontouchstart="mv(0,1);event.preventDefault()" onclick="mv(0,1)">↓</button><button ontouchstart="mv(1,0);event.preventDefault()" onclick="mv(1,0)">→</button></div>
<div class="overlay" id="ov"><h2>Game Over</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),N=20,T=20;
var sn,dir,nd,food,sc,ov,loop;
function init(){sn=[{x:10,y:10},{x:9,y:10},{x:8,y:10}];dir={x:1,y:0};nd={x:1,y:0};sc=0;ov=false;spawnFood();document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function spawnFood(){while(1){food={x:Math.floor(Math.random()*N),y:Math.floor(Math.random()*N)};if(!sn.some(function(s){return s.x===food.x&&s.y===food.y;}))return;}}
function mv(a,b){if(a===-dir.x&&b===-dir.y)return;nd={x:a,y:b};}
window.mv=mv;
function upd(){dir=nd;var h={x:sn[0].x+dir.x,y:sn[0].y+dir.y};if(h.x<0||h.x>=N||h.y<0||h.y>=N||sn.some(function(s){return s.x===h.x&&s.y===h.y;})){ov=true;document.getElementById('ov').classList.add('show');return;}sn.unshift(h);if(h.x===food.x&&h.y===food.y){sc+=10;document.getElementById('score').textContent=sc;spawnFood();}else sn.pop();}
function draw(){x.fillStyle='#000';x.fillRect(0,0,c.width,c.height);x.fillStyle='#ef4444';x.fillRect(food.x*T+1,food.y*T+1,T-2,T-2);sn.forEach(function(s,i){x.fillStyle=i===0?'#22c55e':'#16a34a';x.fillRect(s.x*T+1,s.y*T+1,T-2,T-2);});}
function tick(){upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,120);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')mv(-1,0);if(e.key==='ArrowRight')mv(1,0);if(e.key==='ArrowUp')mv(0,-1);if(e.key==='ArrowDown')mv(0,1);});
rst();
`, "snake-classic3");
}
// ═══════════════════════════════════════════════════════════════
// PAQUET 16 : 30 JEUX
// ═══════════════════════════════════════════════════════════════

function cookieClicker(): string {
  return wrap("Cookie Clicker", `
<h1>🍪 <span>Cookie Clicker</span></h1>
<div class="stats"><span>Cookies : <strong id="score">0</strong></span><span>/sec : <strong id="cps">0</strong></span></div>
<div style="text-align:center;padding:20px">
<button ontouchstart="click();event.preventDefault()" onclick="click()" style="width:200px;height:200px;border-radius:50%;background:radial-gradient(circle,#d4a574,#8b4513);border:4px solid #8b4513;font-size:100px;cursor:pointer;font-family:inherit">🍪</button>
</div>
<div id="shop" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px;max-width:600px;padding:16px"></div>
`, `
var cps,score,ups;
var ALL=[{n:'Curseur',c:15,cps:0.1},{n:'Grand-mère',c:100,cps:1},{n:'Usine',c:1100,cps:8},{n:'Banque',c:12000,cps:47},{n:'Temple',c:130000,cps:260}];
function init(){score=0;cps=0;ups=ALL.map(function(u){return Object.assign({},u,{count:0});});render();}
function click(){score+=1;render();}
window.click=click;
function buy(i){if(score<ups[i].c)return;score-=ups[i].c;ups[i].count++;ups[i].c=Math.floor(ups[i].c*1.15);calc();render();}
window.buy=buy;
function calc(){cps=0;ups.forEach(function(u){cps+=u.cps*u.count;});}
function render(){document.getElementById('score').textContent=Math.floor(score);document.getElementById('cps').textContent=cps.toFixed(1);var s=document.getElementById('shop');s.innerHTML='';ups.forEach(function(u,i){var d=document.createElement('div');d.style.cssText='background:#2a2a2a;padding:12px;border-radius:12px;border:2px solid '+(score>=u.c?'#22c55e':'#444')+';cursor:pointer';d.onclick=function(){buy(i);};d.ontouchstart=function(e){e.preventDefault();buy(i);};d.innerHTML='<div style="font-weight:900;color:#fff">'+u.n+'</div><div style="font-size:11px;color:#888">+'+u.cps+'/sec x'+u.count+'</div><div style="color:#facc15;font-weight:900">'+u.c+' 🍪</div>';s.appendChild(d);});}
setInterval(function(){score+=cps;render();},1000);
function rst(){init();}
window.rst=rst;init();
`, "cookie-clicker");
}

function mineClicker(): string {
  return wrap("Mine Clicker", `
<h1>⛏️ <span>Mine Clicker</span></h1>
<div class="stats"><span>Minerais : <strong id="score">0</strong></span><span>/sec : <strong id="cps">0</strong></span></div>
<div style="text-align:center;padding:20px">
<button ontouchstart="click();event.preventDefault()" onclick="click()" style="width:200px;height:200px;border-radius:20px;background:linear-gradient(135deg,#666,#333);border:4px solid #999;font-size:100px;cursor:pointer;font-family:inherit">⛏️</button>
</div>
<div id="shop" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px;max-width:600px;padding:16px"></div>
`, `
var score,cps,ups;
var ALL=[{n:'Pioche',c:20,cps:0.2},{n:'Mineur',c:150,cps:2},{n:'Foreuse',c:1500,cps:18},{n:'Excavatrice',c:15000,cps:150},{n:'Industrie',c:150000,cps:1200}];
function init(){score=0;cps=0;ups=ALL.map(function(u){return Object.assign({},u,{count:0});});render();}
function click(){score+=1;render();}
window.click=click;
function buy(i){if(score<ups[i].c)return;score-=ups[i].c;ups[i].count++;ups[i].c=Math.floor(ups[i].c*1.15);calc();render();}
window.buy=buy;
function calc(){cps=0;ups.forEach(function(u){cps+=u.cps*u.count;});}
function render(){document.getElementById('score').textContent=Math.floor(score);document.getElementById('cps').textContent=cps.toFixed(1);var s=document.getElementById('shop');s.innerHTML='';ups.forEach(function(u,i){var d=document.createElement('div');d.style.cssText='background:#2a2a2a;padding:12px;border-radius:12px;border:2px solid '+(score>=u.c?'#22c55e':'#444')+';cursor:pointer;color:#fff';d.onclick=function(){buy(i);};d.ontouchstart=function(e){e.preventDefault();buy(i);};d.innerHTML='<div style="font-weight:900">'+u.n+'</div><div style="font-size:11px;color:#888">+'+u.cps+'/sec x'+u.count+'</div><div style="color:#facc15;font-weight:900">'+u.c+' ⛏️</div>';s.appendChild(d);});}
setInterval(function(){score+=cps;render();},1000);
function rst(){init();}
window.rst=rst;init();
`, "mine-clicker");
}

function pizzaTycoon(): string {
  return wrap("Pizza Tycoon", `
<h1>🍕 <span>Pizza Tycoon</span></h1>
<div class="stats"><span>Argent : <strong id="money">0</strong> €</span><span>/sec : <strong id="cps">0</strong></span></div>
<div style="text-align:center;padding:20px">
<button ontouchstart="click();event.preventDefault()" onclick="click()" style="width:180px;height:180px;border-radius:50%;background:radial-gradient(circle,#fbbf24,#f97316);border:4px solid #dc2626;font-size:90px;cursor:pointer;font-family:inherit">🍕</button>
</div>
<div id="shop" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px;max-width:600px;padding:16px"></div>
`, `
var money,cps,ups;
var ALL=[{n:'Serveur',c:20,cps:0.3},{n:'Cuisinier',c:200,cps:3},{n:'Pizzeria',c:2000,cps:30},{n:'Chaîne',c:20000,cps:250},{n:'Empire',c:200000,cps:2000}];
function init(){money=0;cps=0;ups=ALL.map(function(u){return Object.assign({},u,{count:0});});render();}
function click(){money+=1;render();}
window.click=click;
function buy(i){if(money<ups[i].c)return;money-=ups[i].c;ups[i].count++;ups[i].c=Math.floor(ups[i].c*1.15);calc();render();}
window.buy=buy;
function calc(){cps=0;ups.forEach(function(u){cps+=u.cps*u.count;});}
function render(){document.getElementById('money').textContent=Math.floor(money);document.getElementById('cps').textContent=cps.toFixed(1);var s=document.getElementById('shop');s.innerHTML='';ups.forEach(function(u,i){var d=document.createElement('div');d.style.cssText='background:#2a2a2a;padding:12px;border-radius:12px;border:2px solid '+(money>=u.c?'#22c55e':'#444')+';cursor:pointer;color:#fff';d.onclick=function(){buy(i);};d.ontouchstart=function(e){e.preventDefault();buy(i);};d.innerHTML='<div style="font-weight:900">'+u.n+'</div><div style="font-size:11px;color:#888">+'+u.cps+'/sec x'+u.count+'</div><div style="color:#facc15;font-weight:900">'+u.c+' €</div>';s.appendChild(d);});}
setInterval(function(){money+=cps;render();},1000);
function rst(){init();}
window.rst=rst;init();
`, "pizza-tycoon");
}

function spaceTycoon(): string {
  return wrap("Space Tycoon", `
<h1>🚀 <span>Space Tycoon</span></h1>
<div class="stats"><span>Crédits : <strong id="money">0</strong></span><span>/sec : <strong id="cps">0</strong></span></div>
<div style="text-align:center;padding:20px">
<button ontouchstart="click();event.preventDefault()" onclick="click()" style="width:180px;height:180px;border-radius:50%;background:radial-gradient(circle,#3b82f6,#1e3a8a);border:4px solid #facc15;font-size:90px;cursor:pointer;font-family:inherit">🚀</button>
</div>
<div id="shop" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px;max-width:600px;padding:16px"></div>
`, `
var money,cps,ups;
var ALL=[{n:'Sonde',c:50,cps:1},{n:'Satellite',c:500,cps:10},{n:'Station',c:5000,cps:100},{n:'Colonie',c:50000,cps:1000},{n:'Empire',c:500000,cps:10000}];
function init(){money=0;cps=0;ups=ALL.map(function(u){return Object.assign({},u,{count:0});});render();}
function click(){money+=1;render();}
window.click=click;
function buy(i){if(money<ups[i].c)return;money-=ups[i].c;ups[i].count++;ups[i].c=Math.floor(ups[i].c*1.15);calc();render();}
window.buy=buy;
function calc(){cps=0;ups.forEach(function(u){cps+=u.cps*u.count;});}
function render(){document.getElementById('money').textContent=Math.floor(money);document.getElementById('cps').textContent=cps.toFixed(1);var s=document.getElementById('shop');s.innerHTML='';ups.forEach(function(u,i){var d=document.createElement('div');d.style.cssText='background:#2a2a2a;padding:12px;border-radius:12px;border:2px solid '+(money>=u.c?'#22c55e':'#444')+';cursor:pointer;color:#fff';d.onclick=function(){buy(i);};d.ontouchstart=function(e){e.preventDefault();buy(i);};d.innerHTML='<div style="font-weight:900">'+u.n+'</div><div style="font-size:11px;color:#888">+'+u.cps+'/sec x'+u.count+'</div><div style="color:#facc15;font-weight:900">'+u.c+' 💰</div>';s.appendChild(d);});}
setInterval(function(){money+=cps;render();},1000);
function rst(){init();}
window.rst=rst;init();
`, "space-tycoon");
}

function aquariumTycoon(): string {
  return wrap("Aquarium Tycoon", `
<h1>🐠 <span>Aquarium Tycoon</span></h1>
<div class="stats"><span>Argent : <strong id="money">0</strong></span><span>/sec : <strong id="cps">0</strong></span></div>
<div style="text-align:center;padding:20px">
<button ontouchstart="click();event.preventDefault()" onclick="click()" style="width:180px;height:180px;border-radius:50%;background:radial-gradient(circle,#06b6d4,#0369a1);border:4px solid #facc15;font-size:90px;cursor:pointer;font-family:inherit">🐠</button>
</div>
<div id="shop" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px;max-width:600px;padding:16px"></div>
`, `
var money,cps,ups;
var ALL=[{n:'Bocal',c:30,cps:0.5},{n:'Aquarium',c:300,cps:5},{n:'Bassin',c:3000,cps:50},{n:'Océanarium',c:30000,cps:500},{n:'Aqua-Empire',c:300000,cps:5000}];
function init(){money=0;cps=0;ups=ALL.map(function(u){return Object.assign({},u,{count:0});});render();}
function click(){money+=1;render();}
window.click=click;
function buy(i){if(money<ups[i].c)return;money-=ups[i].c;ups[i].count++;ups[i].c=Math.floor(ups[i].c*1.15);calc();render();}
window.buy=buy;
function calc(){cps=0;ups.forEach(function(u){cps+=u.cps*u.count;});}
function render(){document.getElementById('money').textContent=Math.floor(money);document.getElementById('cps').textContent=cps.toFixed(1);var s=document.getElementById('shop');s.innerHTML='';ups.forEach(function(u,i){var d=document.createElement('div');d.style.cssText='background:#2a2a2a;padding:12px;border-radius:12px;border:2px solid '+(money>=u.c?'#22c55e':'#444')+';cursor:pointer;color:#fff';d.onclick=function(){buy(i);};d.ontouchstart=function(e){e.preventDefault();buy(i);};d.innerHTML='<div style="font-weight:900">'+u.n+'</div><div style="font-size:11px;color:#888">+'+u.cps+'/sec x'+u.count+'</div><div style="color:#facc15;font-weight:900">'+u.c+' 💰</div>';s.appendChild(d);});}
setInterval(function(){money+=cps;render();},1000);
function rst(){init();}
window.rst=rst;init();
`, "aquarium-tycoon");
}

function farmTycoon(): string {
  return wrap("Farm Tycoon", `
<h1>🌾 <span>Farm Tycoon</span></h1>
<div class="stats"><span>Argent : <strong id="money">0</strong></span><span>/sec : <strong id="cps">0</strong></span></div>
<div style="text-align:center;padding:20px">
<button ontouchstart="click();event.preventDefault()" onclick="click()" style="width:180px;height:180px;border-radius:50%;background:radial-gradient(circle,#84cc16,#4d7c0f);border:4px solid #fbbf24;font-size:90px;cursor:pointer;font-family:inherit">🌾</button>
</div>
<div id="shop" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px;max-width:600px;padding:16px"></div>
`, `
var money,cps,ups;
var ALL=[{n:'Graine',c:10,cps:0.2},{n:'Champ',c:100,cps:2},{n:'Ferme',c:1000,cps:20},{n:'Coopérative',c:10000,cps:200},{n:'Empire',c:100000,cps:2000}];
function init(){money=0;cps=0;ups=ALL.map(function(u){return Object.assign({},u,{count:0});});render();}
function click(){money+=1;render();}
window.click=click;
function buy(i){if(money<ups[i].c)return;money-=ups[i].c;ups[i].count++;ups[i].c=Math.floor(ups[i].c*1.15);calc();render();}
window.buy=buy;
function calc(){cps=0;ups.forEach(function(u){cps+=u.cps*u.count;});}
function render(){document.getElementById('money').textContent=Math.floor(money);document.getElementById('cps').textContent=cps.toFixed(1);var s=document.getElementById('shop');s.innerHTML='';ups.forEach(function(u,i){var d=document.createElement('div');d.style.cssText='background:#2a2a2a;padding:12px;border-radius:12px;border:2px solid '+(money>=u.c?'#22c55e':'#444')+';cursor:pointer;color:#fff';d.onclick=function(){buy(i);};d.ontouchstart=function(e){e.preventDefault();buy(i);};d.innerHTML='<div style="font-weight:900">'+u.n+'</div><div style="font-size:11px;color:#888">+'+u.cps+'/sec x'+u.count+'</div><div style="color:#facc15;font-weight:900">'+u.c+' 💰</div>';s.appendChild(d);});}
setInterval(function(){money+=cps;render();},1000);
function rst(){init();}
window.rst=rst;init();
`, "farm-tycoon");
}

function cryptoClicker(): string {
  return wrap("Crypto Clicker", `
<h1>₿ <span>Crypto Clicker</span></h1>
<div class="stats"><span>BTC : <strong id="money">0</strong></span><span>/sec : <strong id="cps">0</strong></span></div>
<div style="text-align:center;padding:20px">
<button ontouchstart="click();event.preventDefault()" onclick="click()" style="width:180px;height:180px;border-radius:50%;background:radial-gradient(circle,#f7931a,#b45309);border:4px solid #fbbf24;font-size:90px;cursor:pointer;font-family:inherit">₿</button>
</div>
<div id="shop" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px;max-width:600px;padding:16px"></div>
`, `
var money,cps,ups;
var ALL=[{n:'Wallet',c:25,cps:0.5},{n:'Miner',c:250,cps:5},{n:'Rig',c:2500,cps:50},{n:'Farm',c:25000,cps:500},{n:'Pool',c:250000,cps:5000}];
function init(){money=0;cps=0;ups=ALL.map(function(u){return Object.assign({},u,{count:0});});render();}
function click(){money+=1;render();}
window.click=click;
function buy(i){if(money<ups[i].c)return;money-=ups[i].c;ups[i].count++;ups[i].c=Math.floor(ups[i].c*1.15);calc();render();}
window.buy=buy;
function calc(){cps=0;ups.forEach(function(u){cps+=u.cps*u.count;});}
function render(){document.getElementById('money').textContent=Math.floor(money);document.getElementById('cps').textContent=cps.toFixed(1);var s=document.getElementById('shop');s.innerHTML='';ups.forEach(function(u,i){var d=document.createElement('div');d.style.cssText='background:#2a2a2a;padding:12px;border-radius:12px;border:2px solid '+(money>=u.c?'#22c55e':'#444')+';cursor:pointer;color:#fff';d.onclick=function(){buy(i);};d.ontouchstart=function(e){e.preventDefault();buy(i);};d.innerHTML='<div style="font-weight:900">'+u.n+'</div><div style="font-size:11px;color:#888">+'+u.cps+'/sec x'+u.count+'</div><div style="color:#facc15;font-weight:900">'+u.c+' ₿</div>';s.appendChild(d);});}
setInterval(function(){money+=cps;render();},1000);
function rst(){init();}
window.rst=rst;init();
`, "crypto-clicker");
}

function hospitalSim2(): string {
  return wrap("Hôpital 2", `
<h1>🏥 <span>Hôpital 2</span></h1>
<div class="stats"><span>Argent : <strong id="money">100</strong> €</span><span>Réputation : <strong id="rep">100</strong>%</span></div>
<div id="pat" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;background:#1a1a1a;padding:16px;border-radius:12px;min-height:250px"></div>
`, `
var money,rep,patients,timer,over;
var SYM=['Fievre','Blessure','Nausee','Rhume','Toux','Grippe'];
function init(){money=100;rep=100;patients=[];over=false;document.getElementById('money').textContent='100';document.getElementById('rep').textContent='100';if(timer)clearInterval(timer);timer=setInterval(tick,1000);spawn();}
function spawn(){while(patients.length<4)patients.push({sym:SYM[Math.floor(Math.random()*SYM.length)],t:15,id:Math.random()});}
function tick(){patients.forEach(function(p){p.t--;if(p.t<=0){p.dead=true;rep=Math.max(0,rep-10);document.getElementById('rep').textContent=rep;}});patients=patients.filter(function(p){return !p.dead;});if(patients.length<3)spawn();render();}
function heal(id){var i=patients.findIndex(function(p){return p.id===id;});if(i<0)return;money+=30;rep=Math.min(100,rep+2);document.getElementById('money').textContent=money;document.getElementById('rep').textContent=rep;patients.splice(i,1);spawn();render();}
function render(){var g=document.getElementById('pat');g.innerHTML='';patients.forEach(function(p){var d=document.createElement('div');d.style.cssText='background:#2a2a2a;padding:16px;border-radius:12px;text-align:center;cursor:pointer;border:2px solid '+(p.t<5?'#ef4444':'#3a3a3a')+';color:#fff';d.innerHTML='<p style="font-size:20px;font-weight:900">'+p.sym+'</p><p style="color:#facc15">'+p.t+'s</p>';d.onclick=function(){heal(p.id);};d.ontouchstart=function(e){e.preventDefault();heal(p.id);};g.appendChild(d);});}
function rst(){init();}
window.rst=rst;init();
`, "hospital2");
}

function restaurant2(): string {
  return wrap("Restaurant 2", `
<h1>🍽️ <span>Restaurant 2</span></h1>
<div class="stats"><span>Argent : <strong id="money">100</strong></span><span>Temps : <strong id="time">60</strong>s</span></div>
<div id="ord" style="background:#1a1a1a;padding:16px;border-radius:12px;min-height:200px;border:2px solid #facc15"></div>
<div id="menu" style="display:flex;gap:12px;margin-top:16px;flex-wrap:wrap;justify-content:center"></div>
`, `
var money,t,current,wait,timer;
var MENU=[{n:'Pizza',p:15},{n:'Burger',p:12},{n:'Sushi',p:20},{n:'Pates',p:14}];
function init(){money=100;t=60;current=null;wait=0;if(timer)clearInterval(timer);timer=setInterval(tick,1000);spawn();renderMenu();}
function tick(){if(t<=0)return;t--;document.getElementById('time').textContent=t;if(current){wait--;if(wait<=0)current=null;}else if(Math.random()<0.4)spawn();render();}
function spawn(){current=MENU[Math.floor(Math.random()*MENU.length)];wait=10;}
function serve(name){if(!current)return;if(current.n===name){money+=current.p;document.getElementById('money').textContent=money;current=null;}render();}
function render(){var h='<p style="color:#888;text-align:center">Client</p>';if(current)h+='<div style="text-align:center"><p style="font-size:32px;color:#fff">'+current.n+'</p><p style="color:#facc15">'+wait+'s</p></div>';else h+='<p style="text-align:center;font-size:40px">🚪</p>';document.getElementById('ord').innerHTML=h;}
function renderMenu(){var m=document.getElementById('menu');m.innerHTML='';MENU.forEach(function(item){var b=document.createElement('button');b.style.cssText='padding:14px;font-weight:900;background:#2a2a2a;color:#fff;border:2px solid #3a3a3a;border-radius:12px;cursor:pointer;font-family:inherit';b.textContent=item.n;b.onclick=function(){serve(item.n);};b.ontouchstart=function(e){e.preventDefault();serve(item.n);};m.appendChild(b);});}
function rst(){init();}
window.rst=rst;init();
`, "restaurant2");
}

function bakerySim(): string {
  return wrap("Boulangerie", `
<h1>🥖 <span>Boulangerie</span></h1>
<div class="stats"><span>Argent : <strong id="money">50</strong></span><span>Pain : <strong id="bread">0</strong></span></div>
<div id="bd" style="text-align:center;padding:30px;background:#1a1a1a;border-radius:12px;max-width:500px"></div>
<div class="controls" style="margin-top:16px">
<button ontouchstart="bake();event.preventDefault()" onclick="bake()" style="background:#f97316;color:#fff;width:100px">Cuire</button>
<button ontouchstart="sell();event.preventDefault()" onclick="sell()" style="background:#22c55e;color:#fff;width:100px">Vendre</button>
</div>
`, `
var money,bread,timer;
function init(){money=50;bread=0;document.getElementById('money').textContent='50';document.getElementById('bread').textContent='0';if(timer)clearInterval(timer);timer=setInterval(auto,5000);render();}
function bake(){if(money<5)return;money-=5;bread+=3;document.getElementById('money').textContent=money;document.getElementById('bread').textContent=bread;render();}
function sell(){if(bread<=0)return;var s=bread;bread=0;money+=s*3;document.getElementById('money').textContent=money;document.getElementById('bread').textContent='0';render();}
function auto(){if(bread>0){var s=bread;bread=0;money+=s*2;document.getElementById('money').textContent=money;document.getElementById('bread').textContent='0';render();}}
function render(){var h='<p style="color:#fff;font-size:60px">🥖'+bread+'</p><p style="color:#888">Prix : 3€ par pain</p>';document.getElementById('bd').innerHTML=h;}
function rst(){init();}
window.rst=rst;window.bake=bake;window.sell=sell;init();
`, "bakery");
}

function gymSim(): string {
  return wrap("Salle de Sport", `
<h1>💪 <span>Gym Manager</span></h1>
<div class="stats"><span>Argent : <strong id="money">100</strong></span><span>Membres : <strong id="members">5</strong></span></div>
<div id="bd" style="text-align:center;padding:30px;background:#1a1a1a;border-radius:12px;max-width:500px"></div>
<div class="controls" style="margin-top:16px">
<button ontouchstart="buy();event.preventDefault()" onclick="buy()" style="background:#22c55e;color:#fff;width:160px">Recruter (30)</button>
</div>
`, `
var money,members,timer;
function init(){money=100;members=5;document.getElementById('money').textContent='100';document.getElementById('members').textContent='5';if(timer)clearInterval(timer);timer=setInterval(income,1000);render();}
function buy(){if(money<30)return;money-=30;members++;document.getElementById('money').textContent=money;document.getElementById('members').textContent=members;render();}
function income(){money+=members;document.getElementById('money').textContent=money;}
function render(){var h='<p style="color:#facc15;font-size:40px">💪 x'+members+'</p><p style="color:#888">+'+members+'€/sec</p>';document.getElementById('bd').innerHTML=h;}
function rst(){init();}
window.rst=rst;window.buy=buy;init();
`, "gym-sim");
}

function petShop(): string {
  return wrap("Animalerie", `
<h1>🐶 <span>Animalerie</span></h1>
<div class="stats"><span>Argent : <strong id="money">100</strong></span><span>Animaux : <strong id="pets">3</strong></span></div>
<div id="bd" style="text-align:center;padding:30px;background:#1a1a1a;border-radius:12px;max-width:500px"></div>
<div class="controls" style="margin-top:16px">
<button ontouchstart="buy();event.preventDefault()" onclick="buy()" style="background:#22c55e;color:#fff;width:160px">Adopter (50)</button>
</div>
`, `
var money,pets,timer;
function init(){money=100;pets=3;document.getElementById('money').textContent='100';document.getElementById('pets').textContent='3';if(timer)clearInterval(timer);timer=setInterval(income,1500);render();}
function buy(){if(money<50)return;money-=50;pets++;document.getElementById('money').textContent=money;document.getElementById('pets').textContent=pets;render();}
function income(){money+=pets*2;document.getElementById('money').textContent=money;}
function render(){var h='<p style="color:#facc15;font-size:40px">🐶 🐱 🐰</p><p style="color:#888">Animaux : '+pets+'</p>';document.getElementById('bd').innerHTML=h;}
function rst(){init();}
window.rst=rst;window.buy=buy;init();
`, "pet-shop");
}

function bookstoreSim(): string {
  return wrap("Librairie", `
<h1>📚 <span>Librairie</span></h1>
<div class="stats"><span>Argent : <strong id="money">100</strong></span><span>Livres : <strong id="books">10</strong></span></div>
<div id="bd" style="text-align:center;padding:30px;background:#1a1a1a;border-radius:12px;max-width:500px"></div>
<div class="controls" style="margin-top:16px">
<button ontouchstart="buy();event.preventDefault()" onclick="buy()" style="background:#22c55e;color:#fff;width:160px">Commander (20)</button>
</div>
`, `
var money,books,timer;
function init(){money=100;books=10;document.getElementById('money').textContent='100';document.getElementById('books').textContent='10';if(timer)clearInterval(timer);timer=setInterval(income,2000);render();}
function buy(){if(money<20)return;money-=20;books+=5;document.getElementById('money').textContent=money;document.getElementById('books').textContent=books;render();}
function income(){var sell=Math.min(books,Math.floor(Math.random()*4));books-=sell;money+=sell*8;document.getElementById('money').textContent=money;document.getElementById('books').textContent=books;render();}
function render(){var h='<p style="color:#facc15;font-size:40px">📚 x'+books+'</p><p style="color:#888">Vente : ~8€/livre</p>';document.getElementById('bd').innerHTML=h;}
function rst(){init();}
window.rst=rst;window.buy=buy;init();
`, "bookstore");
}

function flowerShop(): string {
  return wrap("Fleuriste", `
<h1>🌹 <span>Fleuriste</span></h1>
<div class="stats"><span>Argent : <strong id="money">50</strong></span><span>Fleurs : <strong id="flowers">0</strong></span></div>
<div id="bd" style="text-align:center;padding:30px;background:#1a1a1a;border-radius:12px;max-width:500px"></div>
<div class="controls" style="margin-top:16px">
<button ontouchstart="grow();event.preventDefault()" onclick="grow()" style="background:#ef4444;color:#fff;width:120px">Planter (5)</button>
<button ontouchstart="sell();event.preventDefault()" onclick="sell()" style="background:#22c55e;color:#fff;width:120px">Vendre</button>
</div>
`, `
var money,flowers,timer;
function init(){money=50;flowers=0;document.getElementById('money').textContent='50';document.getElementById('flowers').textContent='0';if(timer)clearInterval(timer);timer=setInterval(auto,4000);render();}
function grow(){if(money<5)return;money-=5;flowers+=3;document.getElementById('money').textContent=money;document.getElementById('flowers').textContent=flowers;render();}
function sell(){if(flowers<=0)return;var s=flowers;flowers=0;money+=s*4;document.getElementById('money').textContent=money;document.getElementById('flowers').textContent='0';render();}
function auto(){if(flowers>0){var s=flowers;flowers=0;money+=s*2;document.getElementById('money').textContent=money;document.getElementById('flowers').textContent='0';render();}}
function render(){var h='<p style="color:#facc15;font-size:40px">🌹 x'+flowers+'</p><p style="color:#888">Prix : 4€ par fleur</p>';document.getElementById('bd').innerHTML=h;}
function rst(){init();}
window.rst=rst;window.grow=grow;window.sell=sell;init();
`, "flower-shop");
}

function coffeeShop(): string {
  return wrap("Coffee Shop", `
<h1>☕ <span>Coffee Shop</span></h1>
<div class="stats"><span>Argent : <strong id="money">50</strong></span><span>Cafés : <strong id="cafes">0</strong></span></div>
<div id="bd" style="text-align:center;padding:30px;background:#1a1a1a;border-radius:12px;max-width:500px"></div>
<div class="controls" style="margin-top:16px">
<button ontouchstart="brew();event.preventDefault()" onclick="brew()" style="background:#8b4513;color:#fff;width:120px">Préparer (3)</button>
<button ontouchstart="sell();event.preventDefault()" onclick="sell()" style="background:#22c55e;color:#fff;width:120px">Vendre</button>
</div>
`, `
var money,cafes,timer;
function init(){money=50;cafes=0;document.getElementById('money').textContent='50';document.getElementById('cafes').textContent='0';if(timer)clearInterval(timer);timer=setInterval(auto,3000);render();}
function brew(){if(money<3)return;money-=3;cafes+=2;document.getElementById('money').textContent=money;document.getElementById('cafes').textContent=cafes;render();}
function sell(){if(cafes<=0)return;var s=cafes;cafes=0;money+=s*5;document.getElementById('money').textContent=money;document.getElementById('cafes').textContent='0';render();}
function auto(){if(cafes>0){var s=cafes;cafes=0;money+=s*3;document.getElementById('money').textContent=money;document.getElementById('cafes').textContent='0';render();}}
function render(){var h='<p style="color:#facc15;font-size:40px">☕ x'+cafes+'</p><p style="color:#888">Prix : 5€ par café</p>';document.getElementById('bd').innerHTML=h;}
function rst(){init();}
window.rst=rst;window.brew=brew;window.sell=sell;init();
`, "coffee-shop");
}

function carWash(): string {
  return wrap("Lavage Auto", `
<h1>🚗 <span>Lavage Auto</span></h1>
<div class="stats"><span>Argent : <strong id="money">100</strong></span><span>Voitures : <strong id="cars">0</strong></span></div>
<div id="bd" style="text-align:center;padding:30px;background:#1a1a1a;border-radius:12px;max-width:500px"></div>
<div class="controls" style="margin-top:16px">
<button ontouchstart="wash();event.preventDefault()" onclick="wash()" style="background:#06b6d4;color:#fff;width:160px">Laver (2€)</button>
</div>
`, `
var money,cars,timer;
function init(){money=100;cars=0;document.getElementById('money').textContent='100';document.getElementById('cars').textContent='0';if(timer)clearInterval(timer);timer=setInterval(auto,2000);render();}
function wash(){if(money<2)return;money-=2;cars++;document.getElementById('money').textContent=money;document.getElementById('cars').textContent=cars;render();}
function auto(){if(cars>0){var s=cars;cars=0;money+=s*8;document.getElementById('money').textContent=money;document.getElementById('cars').textContent='0';render();}}
function render(){var h='<p style="color:#facc15;font-size:40px">🚗 x'+cars+'</p><p style="color:#888">+8€ par voiture</p>';document.getElementById('bd').innerHTML=h;}
function rst(){init();}
window.rst=rst;window.wash=wash;init();
`, "car-wash");
}

function hotelSim(): string {
  return wrap("Hôtel", `
<h1>🏨 <span>Hôtel</span></h1>
<div class="stats"><span>Argent : <strong id="money">200</strong></span><span>Chambres : <strong id="rooms">3</strong></span></div>
<div id="bd" style="text-align:center;padding:30px;background:#1a1a1a;border-radius:12px;max-width:500px"></div>
<div class="controls" style="margin-top:16px">
<button ontouchstart="build();event.preventDefault()" onclick="build()" style="background:#22c55e;color:#fff;width:160px">Construire (100)</button>
</div>
`, `
var money,rooms,timer;
function init(){money=200;rooms=3;document.getElementById('money').textContent='200';document.getElementById('rooms').textContent='3';if(timer)clearInterval(timer);timer=setInterval(income,2000);render();}
function build(){if(money<100)return;money-=100;rooms++;document.getElementById('money').textContent=money;document.getElementById('rooms').textContent=rooms;render();}
function income(){money+=rooms*10;document.getElementById('money').textContent=money;}
function render(){var h='<p style="color:#facc15;font-size:40px">🏨 x'+rooms+'</p><p style="color:#888">+'+rooms*10+'€/2s</p>';document.getElementById('bd').innerHTML=h;}
function rst(){init();}
window.rst=rst;window.build=build;init();
`, "hotel-sim");
}

function parkingGame(): string {
  return wrap("Parking", `
<h1>🅿️ <span>Parking</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="400" height="600"></canvas>
<div class="controls"><button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button><button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button></div>
<div class="overlay" id="ov"><h2>Crash !</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var car,obstacles,sc,ov,loop,speed,t;
function init(){car={x:W/2-25,y:H-100,w:50,h:70};obstacles=[];sc=0;ov=false;speed=4;t=0;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function mv(d){car.x+=d*25;car.x=Math.max(10,Math.min(W-60,car.x));}
window.mv=mv;
function upd(){t++;sc+=speed/10;document.getElementById('score').textContent=Math.floor(sc);obstacles.forEach(function(o){o.y+=speed;});obstacles=obstacles.filter(function(o){return o.y<H+50;});if(t%40===0)obstacles.push({x:Math.random()*(W-50)+10,y:-50,w:50,h:70,color:['#ef4444','#3b82f6','#22c55e'][Math.floor(Math.random()*3)]});obstacles.forEach(function(o){if(car.x<o.x+o.w&&car.x+car.w>o.x&&car.y<o.y+o.h&&car.y+car.h>o.y){ov=true;document.getElementById('fin').textContent=Math.floor(sc);document.getElementById('ov').classList.add('show');}});}
function draw(){x.fillStyle='#333';x.fillRect(0,0,W,H);x.fillStyle='#fff';for(var i=0;i<H;i+=60){x.fillRect(15,(i+t*4)%H,4,30);x.fillRect(W-19,(i+t*4)%H,4,30);}obstacles.forEach(function(o){x.fillStyle=o.color;x.fillRect(o.x,o.y,o.w,o.h);});x.fillStyle='#facc15';x.fillRect(car.x,car.y,car.w,car.h);x.fillStyle='#000';x.fillRect(car.x+5,car.y+50,10,15);x.fillRect(car.x+car.w-15,car.y+50,10,15);}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')mv(-1);if(e.key==='ArrowRight')mv(1);});
rst();
`, "parking-game");
}

function truckDelivery(): string {
  return wrap("Camion Livreur", `
<h1>🚚 <span>Camion</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="500" height="500"></canvas>
<div class="controls"><button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button><button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button></div>
<div class="overlay" id="ov"><h2>Crash !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var truck,obstacles,sc,ov,loop,speed,t;
function init(){truck={x:W/2-40,y:H-100,w:80,h:60};obstacles=[];sc=0;ov=false;speed=5;t=0;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function mv(d){truck.x+=d*25;truck.x=Math.max(0,Math.min(W-truck.w,truck.x));}
window.mv=mv;
function upd(){t++;sc+=speed/10;document.getElementById('score').textContent=Math.floor(sc);obstacles.forEach(function(o){o.y+=speed;});obstacles=obstacles.filter(function(o){return o.y<H+50;});if(t%45===0)obstacles.push({x:Math.random()*(W-60),y:-50,w:60,h:50});obstacles.forEach(function(o){if(truck.x<o.x+o.w&&truck.x+truck.w>o.x&&truck.y<o.y+o.h&&truck.y+truck.h>o.y){ov=true;document.getElementById('ov').classList.add('show');}});}
function draw(){x.fillStyle='#666';x.fillRect(0,0,W,H);x.fillStyle='#444';x.fillRect(30,0,W-60,H);x.fillStyle='#fff';for(var i=0;i<H;i+=50){x.fillRect(W/2-3,(i+t*4)%H,6,20);}obstacles.forEach(function(o){x.fillStyle='#8b4513';x.fillRect(o.x,o.y,o.w,o.h);});x.fillStyle='#facc15';x.fillRect(truck.x,truck.y,truck.w,truck.h);x.fillStyle='#000';x.beginPath();x.arc(truck.x+15,truck.y+truck.h,12,0,6.3);x.fill();x.beginPath();x.arc(truck.x+truck.w-15,truck.y+truck.h,12,0,6.3);x.fill();}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')mv(-1);if(e.key==='ArrowRight')mv(1);});
rst();
`, "truck-delivery");
}

function fireTruck(): string {
  return wrap("Camion Pompier", `
<h1>🚒 <span>Pompier 2</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="500" height="500"></canvas>
<div class="controls"><button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button><button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button></div>
<div class="overlay" id="ov"><h2>Crash !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var truck,fires,sc,ov,loop,speed,t;
function init(){truck={x:W/2-40,y:H-100,w:80,h:60};fires=[];sc=0;ov=false;speed=5;t=0;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function mv(d){truck.x+=d*25;truck.x=Math.max(0,Math.min(W-truck.w,truck.x));}
window.mv=mv;
function upd(){t++;fires.forEach(function(f){f.y+=speed;});fires=fires.filter(function(f){return f.y<H+30;});if(t%30===0)fires.push({x:Math.random()*(W-40),y:-30,w:40,h:40});fires.forEach(function(f){if(truck.x<f.x+f.w&&truck.x+truck.w>f.x&&truck.y<f.y+f.h&&truck.y+truck.h>f.y){sc+=10;document.getElementById('score').textContent=sc;f.done=true;}});fires=fires.filter(function(f){return !f.done;});fires.forEach(function(f){if(f.y+f.h>H){ov=true;document.getElementById('ov').classList.add('show');}});}
function draw(){x.fillStyle='#333';x.fillRect(0,0,W,H);x.fillStyle='#8b4513';x.fillRect(0,H-40,W,40);fires.forEach(function(f){x.fillStyle='#ef4444';x.beginPath();x.arc(f.x+20,f.y+20,20,0,6.3);x.fill();x.fillStyle='#facc15';x.beginPath();x.arc(f.x+20,f.y+20,10,0,6.3);x.fill();});x.fillStyle='#ef4444';x.fillRect(truck.x,truck.y,truck.w,truck.h);x.fillStyle='#000';x.beginPath();x.arc(truck.x+15,truck.y+truck.h,12,0,6.3);x.fill();x.beginPath();x.arc(truck.x+truck.w-15,truck.y+truck.h,12,0,6.3);x.fill();}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')mv(-1);if(e.key==='ArrowRight')mv(1);});
c.addEventListener('mousemove',function(e){var r=c.getBoundingClientRect();truck.x=(e.clientX-r.left)*(W/r.width)-truck.w/2;truck.x=Math.max(0,Math.min(W-truck.w,truck.x));});
c.addEventListener('touchmove',function(e){e.preventDefault();var r=c.getBoundingClientRect();truck.x=(e.touches[0].clientX-r.left)*(W/r.width)-truck.w/2;truck.x=Math.max(0,Math.min(W-truck.w,truck.x));},{passive:false});
rst();
`, "fire-truck");
}

function ambulance(): string {
  return wrap("Ambulance", `
<h1>🚑 <span>Ambulance</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="500" height="500"></canvas>
<div class="controls"><button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button><button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button></div>
<div class="overlay" id="ov"><h2>Crash !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var truck,patients,sc,ov,loop,speed,t;
function init(){truck={x:W/2-40,y:H-100,w:80,h:60};patients=[];sc=0;ov=false;speed=5;t=0;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function mv(d){truck.x+=d*25;truck.x=Math.max(0,Math.min(W-truck.w,truck.x));}
window.mv=mv;
function upd(){t++;patients.forEach(function(p){p.y+=speed;});patients=patients.filter(function(p){return p.y<H+30;});if(t%50===0)patients.push({x:Math.random()*(W-40),y:-30,w:40,h:40});patients.forEach(function(p){if(truck.x<p.x+p.w&&truck.x+truck.w>p.x&&truck.y<p.y+p.h&&truck.y+truck.h>p.y){sc+=20;document.getElementById('score').textContent=sc;p.done=true;}});patients=patients.filter(function(p){return !p.done;});patients.forEach(function(p){if(p.y+p.h>H){ov=true;document.getElementById('ov').classList.add('show');}});}
function draw(){x.fillStyle='#333';x.fillRect(0,0,W,H);x.fillStyle='#666';x.fillRect(0,H-40,W,40);patients.forEach(function(p){x.fillStyle='#fff';x.font='40px system-ui';x.fillText('🧑',p.x,p.y+30);});x.fillStyle='#fff';x.fillRect(truck.x,truck.y,truck.w,truck.h);x.fillStyle='#ef4444';x.fillRect(truck.x+20,truck.y+10,40,10);x.fillRect(truck.x+35,truck.y-5,10,40);x.fillStyle='#000';x.beginPath();x.arc(truck.x+15,truck.y+truck.h,12,0,6.3);x.fill();x.beginPath();x.arc(truck.x+truck.w-15,truck.y+truck.h,12,0,6.3);x.fill();}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')mv(-1);if(e.key==='ArrowRight')mv(1);});
c.addEventListener('mousemove',function(e){var r=c.getBoundingClientRect();truck.x=(e.clientX-r.left)*(W/r.width)-truck.w/2;truck.x=Math.max(0,Math.min(W-truck.w,truck.x));});
c.addEventListener('touchmove',function(e){e.preventDefault();var r=c.getBoundingClientRect();truck.x=(e.touches[0].clientX-r.left)*(W/r.width)-truck.w/2;truck.x=Math.max(0,Math.min(W-truck.w,truck.x));},{passive:false});
rst();
`, "ambulance");
}

function policeCar(): string {
  return wrap("Police", `
<h1>🚓 <span>Police</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="500" height="500"></canvas>
<div class="controls"><button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button><button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button></div>
<div class="overlay" id="ov"><h2>Crash !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var car,criminals,sc,ov,loop,speed,t;
function init(){car={x:W/2-40,y:H-100,w:80,h:60};criminals=[];sc=0;ov=false;speed=6;t=0;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function mv(d){car.x+=d*25;car.x=Math.max(0,Math.min(W-car.w,car.x));}
window.mv=mv;
function upd(){t++;criminals.forEach(function(cr){cr.y+=speed;});criminals=criminals.filter(function(cr){return cr.y<H+30;});if(t%40===0)criminals.push({x:Math.random()*(W-50),y:-30,w:50,h:50});criminals.forEach(function(cr){if(car.x<cr.x+cr.w&&car.x+car.w>cr.x&&car.y<cr.y+cr.h&&car.y+car.h>cr.y){sc+=30;document.getElementById('score').textContent=sc;cr.done=true;}});criminals=criminals.filter(function(cr){return !cr.done;});criminals.forEach(function(cr){if(cr.y+cr.h>H){ov=true;document.getElementById('ov').classList.add('show');}});}
function draw(){x.fillStyle='#333';x.fillRect(0,0,W,H);x.fillStyle='#666';x.fillRect(0,H-40,W,40);criminals.forEach(function(cr){x.fillStyle='#a855f7';x.fillRect(cr.x,cr.y,cr.w,cr.h);x.fillStyle='#fff';x.font='30px system-ui';x.fillText('🦹',cr.x+10,cr.y+40);});x.fillStyle='#3b82f6';x.fillRect(car.x,car.y,car.w,car.h);x.fillStyle='#ef4444';x.fillRect(car.x+20,car.y-10,15,10);x.fillStyle='#fff';x.fillRect(car.x+45,car.y-10,15,10);x.fillStyle='#000';x.beginPath();x.arc(car.x+15,car.y+car.h,12,0,6.3);x.fill();x.beginPath();x.arc(car.x+car.w-15,car.y+car.h,12,0,6.3);x.fill();}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')mv(-1);if(e.key==='ArrowRight')mv(1);});
c.addEventListener('mousemove',function(e){var r=c.getBoundingClientRect();car.x=(e.clientX-r.left)*(W/r.width)-car.w/2;car.x=Math.max(0,Math.min(W-car.w,car.x));});
c.addEventListener('touchmove',function(e){e.preventDefault();var r=c.getBoundingClientRect();car.x=(e.touches[0].clientX-r.left)*(W/r.width)-car.w/2;car.x=Math.max(0,Math.min(W-car.w,car.x));},{passive:false});
rst();
`, "police-car");
}

function taxiDriver(): string {
  return wrap("Taxi", `
<h1>🚕 <span>Taxi</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="500" height="500"></canvas>
<div class="controls"><button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button><button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button></div>
<div class="overlay" id="ov"><h2>Crash !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var taxi,clients,sc,ov,loop,speed,t;
function init(){taxi={x:W/2-40,y:H-100,w:80,h:60};clients=[];sc=0;ov=false;speed=5;t=0;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function mv(d){taxi.x+=d*25;taxi.x=Math.max(0,Math.min(W-taxi.w,taxi.x));}
window.mv=mv;
function upd(){t++;clients.forEach(function(cl){cl.y+=speed;});clients=clients.filter(function(cl){return cl.y<H+30;});if(t%45===0)clients.push({x:Math.random()*(W-40),y:-30,w:40,h:40});clients.forEach(function(cl){if(taxi.x<cl.x+cl.w&&taxi.x+taxi.w>cl.x&&taxi.y<cl.y+cl.h&&taxi.y+taxi.h>cl.y){sc+=15;document.getElementById('score').textContent=sc;cl.done=true;}});clients=clients.filter(function(cl){return !cl.done;});clients.forEach(function(cl){if(cl.y+cl.h>H){ov=true;document.getElementById('ov').classList.add('show');}});}
function draw(){x.fillStyle='#333';x.fillRect(0,0,W,H);x.fillStyle='#666';x.fillRect(0,H-40,W,40);clients.forEach(function(cl){x.fillStyle='#fff';x.font='40px system-ui';x.fillText('🧑',cl.x,cl.y+30);});x.fillStyle='#facc15';x.fillRect(taxi.x,taxi.y,taxi.w,taxi.h);x.fillStyle='#000';x.fillRect(taxi.x+30,taxi.y+10,20,20);x.beginPath();x.arc(taxi.x+15,taxi.y+taxi.h,12,0,6.3);x.fill();x.beginPath();x.arc(taxi.x+taxi.w-15,taxi.y+taxi.h,12,0,6.3);x.fill();}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')mv(-1);if(e.key==='ArrowRight')mv(1);});
c.addEventListener('mousemove',function(e){var r=c.getBoundingClientRect();taxi.x=(e.clientX-r.left)*(W/r.width)-taxi.w/2;taxi.x=Math.max(0,Math.min(W-taxi.w,taxi.x));});
c.addEventListener('touchmove',function(e){e.preventDefault();var r=c.getBoundingClientRect();taxi.x=(e.touches[0].clientX-r.left)*(W/r.width)-taxi.w/2;taxi.x=Math.max(0,Math.min(W-taxi.w,taxi.x));},{passive:false});
rst();
`, "taxi-driver");
}

function boatRescue(): string {
  return wrap("Bateau Sauvetage", `
<h1>🚤 <span>Sauvetage</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="500" height="500"></canvas>
<div class="controls"><button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button><button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button></div>
<div class="overlay" id="ov"><h2>Terminé</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var boat,survivors,sc,ov,loop,speed,t;
function init(){boat={x:W/2-40,y:H-100,w:80,h:60};survivors=[];sc=0;ov=false;speed=4;t=0;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function mv(d){boat.x+=d*25;boat.x=Math.max(0,Math.min(W-boat.w,boat.x));}
window.mv=mv;
function upd(){t++;survivors.forEach(function(s){s.y+=speed;});survivors=survivors.filter(function(s){return s.y<H+30;});if(t%40===0)survivors.push({x:Math.random()*(W-40),y:-30,w:40,h:40});survivors.forEach(function(s){if(boat.x<s.x+s.w&&boat.x+boat.w>s.x&&boat.y<s.y+s.h&&boat.y+boat.h>s.y){sc+=20;document.getElementById('score').textContent=sc;s.done=true;}});survivors=survivors.filter(function(s){return !s.done;});survivors.forEach(function(s){if(s.y+s.h>H){ov=true;document.getElementById('ov').classList.add('show');}});}
function draw(){x.fillStyle='#06b6d4';x.fillRect(0,0,W,H);for(var i=0;i<15;i++){x.fillStyle='rgba(255,255,255,0.3)';x.beginPath();x.arc((i*80+t*3)%W,(i*60+t*5)%H,4,0,6.3);x.fill();}survivors.forEach(function(s){x.fillStyle='#fff';x.font='40px system-ui';x.fillText('🧑',s.x,s.y+30);});x.fillStyle='#facc15';x.fillRect(boat.x,boat.y,boat.w,boat.h);x.fillStyle='#fff';x.beginPath();x.moveTo(boat.x+40,boat.y-20);x.lineTo(boat.x+20,boat.y);x.lineTo(boat.x+60,boat.y);x.closePath();x.fill();}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')mv(-1);if(e.key==='ArrowRight')mv(1);});
c.addEventListener('mousemove',function(e){var r=c.getBoundingClientRect();boat.x=(e.clientX-r.left)*(W/r.width)-boat.w/2;boat.x=Math.max(0,Math.min(W-boat.w,boat.x));});
c.addEventListener('touchmove',function(e){e.preventDefault();var r=c.getBoundingClientRect();boat.x=(e.touches[0].clientX-r.left)*(W/r.width)-boat.w/2;boat.x=Math.max(0,Math.min(W-boat.w,boat.x));},{passive:false});
rst();
`, "boat-rescue");
}

function fishingGame(): string {
  return wrap("Pêche", `
<h1>🎣 <span>Pêche</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Temps : <strong id="time">45</strong>s</span></div>
<canvas id="g" width="500" height="500"></canvas>
<div class="controls" style="margin-top:12px;opacity:.6;font-size:12px">Clique sur les poissons</div>
<div class="overlay" id="ov"><h2>Terminé</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var fishes,sc,t,ov,loop,timer;
function init(){fishes=[];sc=0;t=45;ov=false;document.getElementById('score').textContent='0';document.getElementById('time').textContent='45';document.getElementById('ov').classList.remove('show');if(timer)clearInterval(timer);timer=setInterval(function(){if(ov)return;t--;document.getElementById('time').textContent=t;if(t<=0){ov=true;document.getElementById('fin').textContent=sc;document.getElementById('ov').classList.add('show');}},1000);}
function spawn(){if(Math.random()<0.02)fishes.push({x:Math.random()<0.5?-30:W+30,y:50+Math.random()*(H-100),vx:Math.random()<0.5?3:-3,vy:(Math.random()-0.5)*2,size:20+Math.random()*20});}
function click(e){e.preventDefault();if(ov)return;var r=c.getBoundingClientRect();var mx,my;if(e.touches){mx=(e.touches[0].clientX-r.left)*(W/r.width);my=(e.touches[0].clientY-r.top)*(H/r.height);}else{mx=(e.clientX-r.left)*(W/r.width);my=(e.clientY-r.top)*(H/r.height);}for(var i=fishes.length-1;i>=0;i--){var f=fishes[i];if(Math.hypot(f.x-mx,f.y-my)<f.size){sc+=Math.floor(f.size);document.getElementById('score').textContent=sc;fishes.splice(i,1);return;}}}
function upd(){spawn();fishes.forEach(function(f){f.x+=f.vx;f.y+=f.vy;if(f.y<20)f.vy=Math.abs(f.vy);if(f.y>H-40)f.vy=-Math.abs(f.vy);});fishes=fishes.filter(function(f){return f.x>-60&&f.x<W+60;});}
function draw(){x.fillStyle='#001a3a';x.fillRect(0,0,W,H);fishes.forEach(function(f){x.fillStyle=f.size>30?'#ef4444':'#facc15';x.beginPath();x.arc(f.x,f.y,f.size,0,6.3);x.fill();x.fillStyle='#000';x.beginPath();x.arc(f.x+f.size/2,f.y-3,3,0,6.3);x.fill();});}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,20);}
window.rst=rst;
c.addEventListener('click',click);
c.addEventListener('touchstart',click,{passive:false});
rst();
`, "fishing-game");
}

function huntingGame(): string {
  return wrap("Chasse", `
<h1>🏹 <span>Chasse</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Temps : <strong id="time">45</strong>s</span></div>
<canvas id="g" width="600" height="400"></canvas>
<div class="controls" style="margin-top:12px;opacity:.6;font-size:12px">Clique sur les cibles</div>
<div class="overlay" id="ov"><h2>Terminé</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var targets,sc,t,ov,loop,timer;
function init(){targets=[];sc=0;t=45;ov=false;document.getElementById('score').textContent='0';document.getElementById('time').textContent='45';document.getElementById('ov').classList.remove('show');if(timer)clearInterval(timer);timer=setInterval(function(){if(ov)return;t--;document.getElementById('time').textContent=t;if(t<=0){ov=true;document.getElementById('fin').textContent=sc;document.getElementById('ov').classList.add('show');}},1000);}
function spawn(){if(Math.random()<0.04)targets.push({x:Math.random()*(W-60)+30,y:Math.random()*(H-100)+50,vx:(Math.random()-0.5)*4,vy:(Math.random()-0.5)*2,r:20,life:60});}
function click(e){e.preventDefault();if(ov)return;var r=c.getBoundingClientRect();var mx,my;if(e.touches){mx=(e.touches[0].clientX-r.left)*(W/r.width);my=(e.touches[0].clientY-r.top)*(H/r.height);}else{mx=(e.clientX-r.left)*(W/r.width);my=(e.clientY-r.top)*(H/r.height);}for(var i=targets.length-1;i>=0;i--){var tg=targets[i];if(Math.hypot(tg.x-mx,tg.y-my)<tg.r){sc+=20;document.getElementById('score').textContent=sc;targets.splice(i,1);return;}}}
function upd(){spawn();targets.forEach(function(tg){tg.x+=tg.vx;tg.y+=tg.vy;tg.life--;if(tg.x<20||tg.x>W-20)tg.vx*=-1;if(tg.y<30||tg.y>H-30)tg.vy*=-1;});targets=targets.filter(function(tg){return tg.life>0;});}
function draw(){var grad=x.createLinearGradient(0,0,0,H);grad.addColorStop(0,'#87ceeb');grad.addColorStop(1,'#7cb342');x.fillStyle=grad;x.fillRect(0,0,W,H);targets.forEach(function(tg){x.fillStyle='#ef4444';x.beginPath();x.arc(tg.x,tg.y,tg.r,0,6.3);x.fill();x.fillStyle='#fff';x.beginPath();x.arc(tg.x,tg.y,tg.r*0.6,0,6.3);x.fill();x.fillStyle='#ef4444';x.beginPath();x.arc(tg.x,tg.y,tg.r*0.3,0,6.3);x.fill();});}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,20);}
window.rst=rst;
c.addEventListener('click',click);
c.addEventListener('touchstart',click,{passive:false});
rst();
`, "hunting-game");
}

function flySwatter(): string {
  return wrap("Tapette", `
<h1>🪰 <span>Tapette</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Temps : <strong id="time">30</strong>s</span></div>
<div id="bd" style="width:min(600px,92vw);height:500px;background:#f5e6c8;border-radius:16px;position:relative;overflow:hidden;border:2px solid #333;cursor:crosshair"></div>
<div class="overlay" id="ov"><h2>Terminé</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var sc,t,ov,timer,interval;
function init(){sc=0;t=30;ov=false;document.getElementById('score').textContent='0';document.getElementById('time').textContent='30';document.getElementById('bd').innerHTML='';document.getElementById('ov').classList.remove('show');if(timer)clearInterval(timer);if(interval)clearInterval(interval);timer=setInterval(function(){if(ov)return;t--;document.getElementById('time').textContent=t;if(t<=0){ov=true;document.getElementById('fin').textContent=sc;document.getElementById('ov').classList.add('show');clearInterval(interval);}},1000);interval=setInterval(spawn,700);}
function spawn(){if(ov)return;var bd=document.getElementById('bd');var fly=document.createElement('div');fly.style.cssText='position:absolute;font-size:30px;cursor:pointer;left:'+Math.random()*80+'%;top:'+Math.random()*80+'%;transition:all .5s';fly.textContent='🪰';bd.appendChild(fly);setTimeout(function(){if(fly.parentNode)fly.remove();},2500);fly.onclick=function(e){e.stopPropagation();sc+=5;document.getElementById('score').textContent=sc;fly.remove();};fly.ontouchstart=function(e){e.preventDefault();e.stopPropagation();sc+=5;document.getElementById('score').textContent=sc;fly.remove();};}
function rst(){init();}
window.rst=rst;init();
`, "fly-swatter");
}

function bugSquash(): string {
  return wrap("Insectes", `
<h1>🐛 <span>Insectes</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Vies : <strong id="lives">5</strong></span></div>
<div id="bd" style="width:min(600px,92vw);height:500px;background:#0a2810;border-radius:16px;position:relative;overflow:hidden;border:2px solid #84cc16"></div>
<div class="overlay" id="ov"><h2>Terminé</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var sc,lv,ov,interval,lifeTimer;
function init(){sc=0;lv=5;ov=false;document.getElementById('score').textContent='0';document.getElementById('lives').textContent='5';document.getElementById('bd').innerHTML='';document.getElementById('ov').classList.remove('show');if(interval)clearInterval(interval);interval=setInterval(spawn,800);}
function spawn(){if(ov)return;var bd=document.getElementById('bd');var bug=document.createElement('div');var emo=['🐛','🐜','🦗','🪲'][Math.floor(Math.random()*4)];bug.style.cssText='position:absolute;font-size:30px;cursor:pointer;left:'+Math.random()*85+'%;top:'+Math.random()*85+'%;transition:all .3s';bug.textContent=emo;bd.appendChild(bug);setTimeout(function(){if(bug.parentNode){bug.remove();lv--;document.getElementById('lives').textContent=lv;if(lv<=0){ov=true;document.getElementById('fin').textContent=sc;document.getElementById('ov').classList.add('show');clearInterval(interval);}}},2000);bug.onclick=function(e){e.stopPropagation();sc+=10;document.getElementById('score').textContent=sc;if(bug.parentNode)bug.remove();};bug.ontouchstart=function(e){e.preventDefault();e.stopPropagation();sc+=10;document.getElementById('score').textContent=sc;if(bug.parentNode)bug.remove();};}
function rst(){init();}
window.rst=rst;init();
`, "bug-squash");
}

function fruitSlice(): string {
  return wrap("Fruits", `
<h1>🍉 <span>Fruits</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Vies : <strong id="lives">3</strong></span></div>
<div id="bd" style="width:min(600px,92vw);height:500px;background:#1a0f0f;border-radius:16px;position:relative;overflow:hidden;border:2px solid #ef4444"></div>
<div class="overlay" id="ov"><h2>Game Over</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var sc,lv,ov,spawnI;
var EMO=['🍎','🍊','🍋','🍉','🍇','🍓','🥝','🍑'];
function init(){sc=0;lv=3;ov=false;document.getElementById('score').textContent='0';document.getElementById('lives').textContent='3';document.getElementById('bd').innerHTML='';document.getElementById('ov').classList.remove('show');if(spawnI)clearInterval(spawnI);spawnI=setInterval(spawn,650);}
function spawn(){if(ov)return;var bd=document.getElementById('bd');var em=EMO[Math.floor(Math.random()*EMO.length)];var isBomb=Math.random()<0.15;var f=document.createElement('div');f.style.cssText='position:absolute;font-size:50px;cursor:pointer;left:'+Math.random()*75+'%;bottom:-70px;transition:bottom 2s linear';f.textContent=isBomb?'💣':em;bd.appendChild(f);setTimeout(function(){f.style.bottom='110%';},10);f.onclick=function(e){e.stopPropagation();if(isBomb){lv--;document.getElementById('lives').textContent=lv;if(lv<=0){ov=true;document.getElementById('fin').textContent=sc;document.getElementById('ov').classList.add('show');clearInterval(spawnI);}}else{sc+=10;document.getElementById('score').textContent=sc;}if(f.parentNode)f.remove();};f.ontouchstart=function(e){e.preventDefault();e.stopPropagation();f.onclick(e);};setTimeout(function(){if(f.parentNode){if(!isBomb){lv--;document.getElementById('lives').textContent=lv;if(lv<=0){ov=true;document.getElementById('fin').textContent=sc;document.getElementById('ov').classList.add('show');clearInterval(spawnI);}}f.remove();}},2100);}
function rst(){init();}
window.rst=rst;init();
`, "fruit-slice");
}

function balloonPop(): string {
  return wrap("Ballons", `
<h1>🎈 <span>Ballons</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Temps : <strong id="time">30</strong>s</span></div>
<div id="bd" style="width:min(600px,92vw);height:500px;background:linear-gradient(180deg,#87ceeb,#f5f5dc);border-radius:16px;position:relative;overflow:hidden;border:2px solid #3b82f6"></div>
<div class="overlay" id="ov"><h2>Terminé</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var sc,t,ov,timer,interval;
var COLORS=['#ef4444','#3b82f6','#22c55e','#facc15','#a855f7','#ec4899','#f97316'];
function init(){sc=0;t=30;ov=false;document.getElementById('score').textContent='0';document.getElementById('time').textContent='30';document.getElementById('bd').innerHTML='';document.getElementById('ov').classList.remove('show');if(timer)clearInterval(timer);if(interval)clearInterval(interval);timer=setInterval(function(){if(ov)return;t--;document.getElementById('time').textContent=t;if(t<=0){ov=true;document.getElementById('fin').textContent=sc;document.getElementById('ov').classList.add('show');clearInterval(interval);}},1000);interval=setInterval(spawn,500);}
function spawn(){if(ov)return;var bd=document.getElementById('bd');var b=document.createElement('div');var color=COLORS[Math.floor(Math.random()*COLORS.length)];var size=40+Math.random()*30;b.style.cssText='position:absolute;width:'+size+'px;height:'+size*1.2+'px;background:'+color+';border-radius:50%;cursor:pointer;left:'+Math.random()*80+'%;bottom:-80px;transition:bottom 3s linear;box-shadow:inset -10px -10px 20px rgba(0,0,0,0.3)';bd.appendChild(b);setTimeout(function(){b.style.bottom='110%';},10);b.onclick=function(e){e.stopPropagation();sc+=10;document.getElementById('score').textContent=sc;if(b.parentNode)b.remove();};b.ontouchstart=function(e){e.preventDefault();e.stopPropagation();sc+=10;document.getElementById('score').textContent=sc;if(b.parentNode)b.remove();};setTimeout(function(){if(b.parentNode)b.remove();},3100);}
function rst(){init();}
window.rst=rst;init();
`, "balloon-pop");
}

function bubbleWrap(): string {
  return wrap("Bulle Wrap", `
<h1>🫧 <span>Bulle Wrap</span></h1>
<div class="stats"><span>Éclatées : <strong id="score">0</strong></span><span>/100</span></div>
<div id="bd" style="display:grid;grid-template-columns:repeat(10,min(50px,9vw));gap:4px;background:#1a1a1a;padding:20px;border-radius:12px"></div>
<div class="overlay" id="ov"><h2>🎉 Fini !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var sc,ov;
function init(){sc=0;ov=false;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');render();}
function render(){var b=document.getElementById('bd');b.innerHTML='';for(var i=0;i<100;i++){var cc=document.createElement('div');cc.style.cssText='aspect-ratio:1;background:radial-gradient(circle at 30% 30%, #a5f3fc, #06b6d4);border-radius:50%;cursor:pointer;transition:all .2s;border:2px solid rgba(255,255,255,0.5)';cc.onclick=function(){if(this.dataset.pop)return;this.dataset.pop='1';this.style.background='#2a2a2a';this.style.transform='scale(0.85)';sc++;document.getElementById('score').textContent=sc;if(sc>=100){ov=true;setTimeout(function(){document.getElementById('ov').classList.add('show');},300);}};cc.ontouchstart=function(e){e.preventDefault();this.onclick();};b.appendChild(cc);}}
function rst(){init();}
window.rst=rst;init();
`, "bubble-wrap");
}

function speedTyping2(): string {
  return wrap("Typing Race", `
<h1>⌨️ <span>Typing Race</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Temps : <strong id="time">30</strong>s</span></div>
<div id="bd" style="text-align:center;padding:30px;background:#1a1a1a;border-radius:16px;max-width:500px"></div>
<div class="overlay" id="ov"><h2>Terminé</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var WORDS=['chat','chien','maison','arbre','livre','fleur','table','pomme','jardin','voiture','soleil','oiseau','montagne','riviere','plage','etoile'];
var sc,t,ov,timer,cur;
function init(){sc=0;t=30;ov=false;document.getElementById('score').textContent='0';document.getElementById('time').textContent='30';document.getElementById('ov').classList.remove('show');if(timer)clearInterval(timer);timer=setInterval(function(){if(ov)return;t--;document.getElementById('time').textContent=t;if(t<=0){ov=true;document.getElementById('fin').textContent=sc;document.getElementById('ov').classList.add('show');}},1000);next();}
function next(){cur=WORDS[Math.floor(Math.random()*WORDS.length)];var h='<p style="color:#888;margin-bottom:16px">Tape :</p><p style="color:#facc15;font-size:36px;font-weight:900;margin:0 0 20px 0">'+cur+'</p><input id="inp" type="text" autocomplete="off" style="width:250px;padding:14px;font-size:20px;background:#0a0a0a;color:#fff;border:2px solid #22c55e;border-radius:12px;outline:none;text-align:center" />';document.getElementById('bd').innerHTML=h;setTimeout(function(){var i=document.getElementById('inp');if(i)i.focus();},50);}
document.addEventListener('input',function(e){if(e.target.id==='inp'&&e.target.value===cur){sc+=10;document.getElementById('score').textContent=sc;next();}});
function rst(){init();}
window.rst=rst;init();
`, "typing-race2");
}

function quickMath2(): string {
  return wrap("Math Rapide", `
<h1>⚡ <span>Math Rapide</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Temps : <strong id="time">30</strong>s</span></div>
<div id="bd" style="text-align:center;padding:30px;background:#1a1a1a;border-radius:16px;max-width:500px"></div>
<div class="overlay" id="ov"><h2>Terminé</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var sc,t,ov,timer,ans;
function init(){sc=0;t=30;ov=false;document.getElementById('score').textContent='0';document.getElementById('time').textContent='30';document.getElementById('ov').classList.remove('show');if(timer)clearInterval(timer);timer=setInterval(function(){if(ov)return;t--;document.getElementById('time').textContent=t;if(t<=0){ov=true;document.getElementById('fin').textContent=sc;document.getElementById('ov').classList.add('show');}},1000);next();}
function next(){var a=Math.floor(Math.random()*20)+1,b=Math.floor(Math.random()*20)+1;var op=['+','-','×'][Math.floor(Math.random()*3)];if(op==='+')ans=a+b;else if(op==='-')ans=a-b;else ans=a*b;var ch=[ans];while(ch.length<4){var f=ans+(Math.floor(Math.random()*10)-5);if(ch.indexOf(f)<0&&f!==ans)ch.push(f);}ch.sort(function(){return Math.random()-0.5;});var h='<p style="color:#facc15;font-size:40px;font-weight:900;margin-bottom:20px">'+a+' '+op+' '+b+' = ?</p><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">';ch.forEach(function(c){h+='<button ontouchstart="pick('+c+');event.preventDefault()" onclick="pick('+c+')" style="padding:16px;font-size:22px;background:#2a2a2a;color:#fff;border:2px solid #3a3a3a;border-radius:10px;cursor:pointer;font-family:inherit;font-weight:900">'+c+'</button>';});h+='</div>';document.getElementById('bd').innerHTML=h;}
function pick(v){if(ov)return;if(v===ans){sc+=5;document.getElementById('score').textContent=sc;}next();}
function rst(){init();}
window.rst=rst;window.pick=pick;init();
`, "math-rapide");
}

function speedChrono2(): string {
  return wrap("Chrono 2", `
<h1>⏱️ <span>Stop Chrono 2</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Objectif : <strong id="target">3.00</strong>s</span></div>
<div id="bd" style="width:min(500px,90vw);height:300px;background:#1a1a1a;border-radius:16px;display:flex;align-items:center;justify-content:center;cursor:pointer;border:2px solid #22c55e"></div>
<div class="overlay" id="ov"><h2>Terminé</h2><p>Score : <strong id="fin">0</strong></p><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var sc,target,ov,state,start,timer,running;
function init(){sc=0;target=3;ov=false;state='idle';running=false;if(timer)clearInterval(timer);document.getElementById('score').textContent='0';document.getElementById('target').textContent=target.toFixed(2);document.getElementById('ov').classList.remove('show');render();}
function render(){if(state==='idle'){document.getElementById('bd').innerHTML='<p style="color:#fff;font-size:22px">Clique pour lancer</p>';}else if(state==='running'){document.getElementById('bd').innerHTML='<p style="color:#facc15;font-size:60px;font-weight:900">'+((Date.now()-start)/1000).toFixed(2)+'s</p>';}}
function click(){if(ov)return;if(state==='idle'){state='running';start=Date.now();render();running=true;timer=setInterval(function(){if(!running)return;render();},50);}else if(state==='running'){running=false;clearInterval(timer);state='idle';var t=(Date.now()-start)/1000;var diff=Math.abs(t-target);if(diff<0.3)sc+=100;else if(diff<0.5)sc+=50;else if(diff<1)sc+=20;document.getElementById('score').textContent=sc;target=Math.round((target+0.5)*100)/100;document.getElementById('target').textContent=target.toFixed(2);render();if(target>6){ov=true;document.getElementById('fin').textContent=sc;document.getElementById('ov').classList.add('show');}}}
function rst(){init();}
window.rst=rst;
document.getElementById('bd').addEventListener('click',click);
document.getElementById('bd').addEventListener('touchstart',function(e){e.preventDefault();click();},{passive:false});
init();
`, "chrono2");
}

function memoryIcons3(): string {
  return wrap("Memory Tech", `
<h1>💻 <span>Memory Tech</span></h1>
<div class="stats"><span>Paires : <strong id="p">0</strong>/6</span></div>
<div id="bd" style="display:grid;grid-template-columns:repeat(4,min(70px,18vw));gap:8px;background:#1a1a1a;padding:12px;border-radius:12px;border:2px solid #06b6d4"></div>
<div class="overlay" id="ov"><h2>🎉 Bravo !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var ICO=['💻','📱','🎧','⌚','📷','🖥️'],f,s,lock,mat,cds;
function init(){cds=ICO.concat(ICO).sort(function(){return Math.random()-0.5;});f=null;s=null;lock=false;mat=0;document.getElementById('p').textContent='0';document.getElementById('ov').classList.remove('show');render();}
function render(){var b=document.getElementById('bd');b.innerHTML='';cds.forEach(function(e,i){var cc=document.createElement('div');cc.style.cssText='width:100%;aspect-ratio:1;background:#2a2a2a;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:clamp(20px,5vw,32px);cursor:pointer';cc.textContent='?';cc.dataset.idx=i;cc.dataset.em=e;cc.onclick=function(){flip(i,cc);};b.appendChild(cc);});}
function flip(i,cc){if(lock||cc.dataset.m==='1'||cc.textContent!=='?')return;cc.textContent=cc.dataset.em;cc.style.background='#06b6d4';if(f===null){f=i;return;}if(s===null){s=i;lock=true;var c1=document.querySelector('[data-idx="'+f+'"]'),c2=cc;if(c1.dataset.em===c2.dataset.em){c1.dataset.m='1';c2.dataset.m='1';c1.style.background='#22c55e';c2.style.background='#22c55e';mat++;document.getElementById('p').textContent=mat;f=null;s=null;lock=false;if(mat===6)setTimeout(function(){document.getElementById('ov').classList.add('show');},300);}else{setTimeout(function(){c1.textContent='?';c1.style.background='#2a2a2a';c2.textContent='?';c2.style.background='#2a2a2a';f=null;s=null;lock=false;},800);}}}
function rst(){init();}
window.rst=rst;init();
`, "memory-tech");
}

function memoryCars2(): string {
  return wrap("Memory Véhicules", `
<h1>🚗 <span>Memory Véhicules</span></h1>
<div class="stats"><span>Paires : <strong id="p">0</strong>/6</span></div>
<div id="bd" style="display:grid;grid-template-columns:repeat(4,min(70px,18vw));gap:8px;background:#1a1a1a;padding:12px;border-radius:12px;border:2px solid #f97316"></div>
<div class="overlay" id="ov"><h2>🎉 Bravo !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var ICO=['🚗','🚕','🚙','🚌','🚎','🏎️','🚓','🚑'],f,s,lock,mat,cds;
function init(){cds=ICO.concat(ICO).sort(function(){return Math.random()-0.5;});f=null;s=null;lock=false;mat=0;document.getElementById('p').textContent='0';document.getElementById('ov').classList.remove('show');render();}
function render(){var b=document.getElementById('bd');b.innerHTML='';cds.forEach(function(e,i){var cc=document.createElement('div');cc.style.cssText='width:100%;aspect-ratio:1;background:#2a2a2a;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:clamp(20px,5vw,32px);cursor:pointer';cc.textContent='?';cc.dataset.idx=i;cc.dataset.em=e;cc.onclick=function(){flip(i,cc);};b.appendChild(cc);});}
function flip(i,cc){if(lock||cc.dataset.m==='1'||cc.textContent!=='?')return;cc.textContent=cc.dataset.em;cc.style.background='#f97316';if(f===null){f=i;return;}if(s===null){s=i;lock=true;var c1=document.querySelector('[data-idx="'+f+'"]'),c2=cc;if(c1.dataset.em===c2.dataset.em){c1.dataset.m='1';c2.dataset.m='1';c1.style.background='#22c55e';c2.style.background='#22c55e';mat++;document.getElementById('p').textContent=mat;f=null;s=null;lock=false;if(mat===8)setTimeout(function(){document.getElementById('ov').classList.add('show');},300);}else{setTimeout(function(){c1.textContent='?';c1.style.background='#2a2a2a';c2.textContent='?';c2.style.background='#2a2a2a';f=null;s=null;lock=false;},800);}}}
function rst(){init();}
window.rst=rst;init();
`, "memory-vehicules2");
}

function memoryNature(): string {
  return wrap("Memory Nature", `
<h1>🌿 <span>Memory Nature</span></h1>
<div class="stats"><span>Paires : <strong id="p">0</strong>/6</span></div>
<div id="bd" style="display:grid;grid-template-columns:repeat(4,min(70px,18vw));gap:8px;background:#1a1a1a;padding:12px;border-radius:12px;border:2px solid #22c55e"></div>
<div class="overlay" id="ov"><h2>🎉 Bravo !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var ICO=['🌳','🌲','🌴','🌵','🌺','🌸'],f,s,lock,mat,cds;
function init(){cds=ICO.concat(ICO).sort(function(){return Math.random()-0.5;});f=null;s=null;lock=false;mat=0;document.getElementById('p').textContent='0';document.getElementById('ov').classList.remove('show');render();}
function render(){var b=document.getElementById('bd');b.innerHTML='';cds.forEach(function(e,i){var cc=document.createElement('div');cc.style.cssText='width:100%;aspect-ratio:1;background:#2a2a2a;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:clamp(20px,5vw,32px);cursor:pointer';cc.textContent='?';cc.dataset.idx=i;cc.dataset.em=e;cc.onclick=function(){flip(i,cc);};b.appendChild(cc);});}
function flip(i,cc){if(lock||cc.dataset.m==='1'||cc.textContent!=='?')return;cc.textContent=cc.dataset.em;cc.style.background='#22c55e';if(f===null){f=i;return;}if(s===null){s=i;lock=true;var c1=document.querySelector('[data-idx="'+f+'"]'),c2=cc;if(c1.dataset.em===c2.dataset.em){c1.dataset.m='1';c2.dataset.m='1';c1.style.background='#22c55e';c2.style.background='#22c55e';mat++;document.getElementById('p').textContent=mat;f=null;s=null;lock=false;if(mat===6)setTimeout(function(){document.getElementById('ov').classList.add('show');},300);}else{setTimeout(function(){c1.textContent='?';c1.style.background='#2a2a2a';c2.textContent='?';c2.style.background='#2a2a2a';f=null;s=null;lock=false;},800);}}}
function rst(){init();}
window.rst=rst;init();
`, "memory-nature");
}

function memoryEmo6(): string {
  return wrap("Memory Boissons", `
<h1>🥤 <span>Memory Boissons</span></h1>
<div class="stats"><span>Paires : <strong id="p">0</strong>/6</span></div>
<div id="bd" style="display:grid;grid-template-columns:repeat(4,min(70px,18vw));gap:8px;background:#1a1a1a;padding:12px;border-radius:12px;border:2px solid #facc15"></div>
<div class="overlay" id="ov"><h2>🎉 Bravo !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var ICO=['☕','🍵','🥤','🧃','🍺','🍷'],f,s,lock,mat,cds;
function init(){cds=ICO.concat(ICO).sort(function(){return Math.random()-0.5;});f=null;s=null;lock=false;mat=0;document.getElementById('p').textContent='0';document.getElementById('ov').classList.remove('show');render();}
function render(){var b=document.getElementById('bd');b.innerHTML='';cds.forEach(function(e,i){var cc=document.createElement('div');cc.style.cssText='width:100%;aspect-ratio:1;background:#2a2a2a;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:clamp(20px,5vw,32px);cursor:pointer';cc.textContent='?';cc.dataset.idx=i;cc.dataset.em=e;cc.onclick=function(){flip(i,cc);};b.appendChild(cc);});}
function flip(i,cc){if(lock||cc.dataset.m==='1'||cc.textContent!=='?')return;cc.textContent=cc.dataset.em;cc.style.background='#facc15';if(f===null){f=i;return;}if(s===null){s=i;lock=true;var c1=document.querySelector('[data-idx="'+f+'"]'),c2=cc;if(c1.dataset.em===c2.dataset.em){c1.dataset.m='1';c2.dataset.m='1';c1.style.background='#22c55e';c2.style.background='#22c55e';mat++;document.getElementById('p').textContent=mat;f=null;s=null;lock=false;if(mat===6)setTimeout(function(){document.getElementById('ov').classList.add('show');},300);}else{setTimeout(function(){c1.textContent='?';c1.style.background='#2a2a2a';c2.textContent='?';c2.style.background='#2a2a2a';f=null;s=null;lock=false;},800);}}}
function rst(){init();}
window.rst=rst;init();
`, "memory-boissons");
}
// ═══════════════════════════════════════════════════════════════
// PAQUET 17 : 30 JEUX FINAUX
// ═══════════════════════════════════════════════════════════════

function cowRun(): string {
  return wrap("Vache Folle", `
<h1>🐄 <span>Vache Folle</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="600" height="400"></canvas>
<div class="controls"><button ontouchstart="jump();event.preventDefault()" onclick="jump()" style="width:180px;background:#84cc16;color:#fff">SAUT</button></div>
<div class="overlay" id="ov"><h2>Game Over</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var cow,obs,sc,ov,loop,speed,t;
function init(){cow={x:100,y:H-80,w:50,h:50,vy:0,onG:true};obs=[];sc=0;ov=false;speed=6;t=0;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function jump(){if(ov||!cow.onG)return;cow.vy=-14;cow.onG=false;}
window.jump=jump;
function upd(){t++;sc+=speed/20;document.getElementById('score').textContent=Math.floor(sc);cow.vy+=0.7;cow.y+=cow.vy;cow.onG=false;if(cow.y+cow.h>H-60){cow.y=H-60-cow.h;cow.vy=0;cow.onG=true;}obs.forEach(function(o){o.x-=speed;});obs=obs.filter(function(o){return o.x>-50;});if(t%50===0)obs.push({x:W,h:20+Math.random()*40});obs.forEach(function(o){if(cow.x<o.x+20&&cow.x+cow.w>o.x&&cow.y+cow.h>H-60-o.h){ov=true;document.getElementById('ov').classList.add('show');}});}
function draw(){x.fillStyle='#87ceeb';x.fillRect(0,0,W,H);x.fillStyle='#7cb342';x.fillRect(0,H-60,W,60);obs.forEach(function(o){x.fillStyle='#8b4513';x.fillRect(o.x,H-60-o.h,20,o.h);});x.fillStyle='#fff';x.fillRect(cow.x,cow.y,cow.w,cow.h);x.fillStyle='#000';x.fillRect(cow.x+30,cow.y+15,15,15);}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key===' ')jump();});
c.addEventListener('click',jump);
rst();
`, "cow-run");
}

function chickenRun(): string {
  return wrap("Poulet Run", `
<h1>🐔 <span>Poulet Run</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="600" height="400"></canvas>
<div class="controls"><button ontouchstart="jump();event.preventDefault()" onclick="jump()" style="width:180px;background:#facc15;color:#000">SAUT</button></div>
<div class="overlay" id="ov"><h2>Game Over</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var ch,obs,sc,ov,loop,speed,t;
function init(){ch={x:100,y:H-80,w:40,h:40,vy:0,onG:true};obs=[];sc=0;ov=false;speed=7;t=0;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function jump(){if(ov||!ch.onG)return;ch.vy=-13;ch.onG=false;}
window.jump=jump;
function upd(){t++;sc+=speed/20;document.getElementById('score').textContent=Math.floor(sc);ch.vy+=0.7;ch.y+=ch.vy;ch.onG=false;if(ch.y+ch.h>H-60){ch.y=H-60-ch.h;ch.vy=0;ch.onG=true;}obs.forEach(function(o){o.x-=speed;});obs=obs.filter(function(o){return o.x>-50;});if(t%40===0)obs.push({x:W,h:20+Math.random()*40});obs.forEach(function(o){if(ch.x<o.x+20&&ch.x+ch.w>o.x&&ch.y+ch.h>H-60-o.h){ov=true;document.getElementById('ov').classList.add('show');}});}
function draw(){x.fillStyle='#87ceeb';x.fillRect(0,0,W,H);x.fillStyle='#7cb342';x.fillRect(0,H-60,W,60);obs.forEach(function(o){x.fillStyle='#8b4513';x.fillRect(o.x,H-60-o.h,20,o.h);});x.fillStyle='#fff';x.fillRect(ch.x,ch.y,ch.w,ch.h);x.fillStyle='#ef4444';x.fillRect(ch.x+30,ch.y,10,5);x.fillStyle='#000';x.beginPath();x.arc(ch.x+10,ch.y+15,3,0,6.3);x.fill();}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key===' ')jump();});
c.addEventListener('click',jump);
rst();
`, "chicken-run");
}

function pigJump(): string {
  return wrap("Cochon Jump", `
<h1>🐷 <span>Cochon Jump</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="600" height="400"></canvas>
<div class="controls"><button ontouchstart="jump();event.preventDefault()" onclick="jump()" style="width:180px;background:#ec4899;color:#fff">SAUT</button></div>
<div class="overlay" id="ov"><h2>Game Over</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var pig,obs,sc,ov,loop,speed,t;
function init(){pig={x:100,y:H-80,w:50,h:40,vy:0,onG:true};obs=[];sc=0;ov=false;speed=6;t=0;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function jump(){if(ov||!pig.onG)return;pig.vy=-14;pig.onG=false;}
window.jump=jump;
function upd(){t++;sc+=speed/20;document.getElementById('score').textContent=Math.floor(sc);pig.vy+=0.75;pig.y+=pig.vy;pig.onG=false;if(pig.y+pig.h>H-60){pig.y=H-60-pig.h;pig.vy=0;pig.onG=true;}obs.forEach(function(o){o.x-=speed;});obs=obs.filter(function(o){return o.x>-50;});if(t%45===0)obs.push({x:W,h:20+Math.random()*40});obs.forEach(function(o){if(pig.x<o.x+20&&pig.x+pig.w>o.x&&pig.y+pig.h>H-60-o.h){ov=true;document.getElementById('ov').classList.add('show');}});}
function draw(){x.fillStyle='#87ceeb';x.fillRect(0,0,W,H);x.fillStyle='#7cb342';x.fillRect(0,H-60,W,60);obs.forEach(function(o){x.fillStyle='#8b4513';x.fillRect(o.x,H-60-o.h,20,o.h);});x.fillStyle='#f9a8d4';x.fillRect(pig.x,pig.y,pig.w,pig.h);x.fillStyle='#ec4899';x.beginPath();x.arc(pig.x+35,pig.y+20,8,0,6.3);x.fill();x.fillStyle='#000';x.beginPath();x.arc(pig.x+15,pig.y+15,3,0,6.3);x.fill();}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key===' ')jump();});
c.addEventListener('click',jump);
rst();
`, "pig-jump");
}

function duckRun(): string {
  return wrap("Canard", `
<h1>🦆 <span>Canard</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="600" height="400"></canvas>
<div class="controls"><button ontouchstart="jump();event.preventDefault()" onclick="jump()" style="width:180px;background:#facc15;color:#000">SAUT</button></div>
<div class="overlay" id="ov"><h2>Game Over</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var duck,obs,sc,ov,loop,speed,t;
function init(){duck={x:100,y:H-80,w:45,h:45,vy:0,onG:true};obs=[];sc=0;ov=false;speed=6;t=0;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function jump(){if(ov||!duck.onG)return;duck.vy=-14;duck.onG=false;}
window.jump=jump;
function upd(){t++;sc+=speed/20;document.getElementById('score').textContent=Math.floor(sc);duck.vy+=0.7;duck.y+=duck.vy;duck.onG=false;if(duck.y+duck.h>H-60){duck.y=H-60-duck.h;duck.vy=0;duck.onG=true;}obs.forEach(function(o){o.x-=speed;});obs=obs.filter(function(o){return o.x>-50;});if(t%50===0)obs.push({x:W,h:20+Math.random()*40});obs.forEach(function(o){if(duck.x<o.x+20&&duck.x+duck.w>o.x&&duck.y+duck.h>H-60-o.h){ov=true;document.getElementById('ov').classList.add('show');}});}
function draw(){x.fillStyle='#87ceeb';x.fillRect(0,0,W,H);x.fillStyle='#7cb342';x.fillRect(0,H-60,W,60);obs.forEach(function(o){x.fillStyle='#8b4513';x.fillRect(o.x,H-60-o.h,20,o.h);});x.fillStyle='#facc15';x.fillRect(duck.x,duck.y,duck.w,duck.h);x.fillStyle='#f97316';x.fillRect(duck.x+35,duck.y+20,10,8);x.fillStyle='#000';x.beginPath();x.arc(duck.x+15,duck.y+15,3,0,6.3);x.fill();}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key===' ')jump();});
c.addEventListener('click',jump);
rst();
`, "duck-run");
}

function dinoRun(): string {
  return wrap("Dino", `
<h1>🦖 <span>Dino</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="600" height="400"></canvas>
<div class="controls"><button ontouchstart="jump();event.preventDefault()" onclick="jump()" style="width:180px;background:#22c55e;color:#fff">SAUT</button></div>
<div class="overlay" id="ov"><h2>Game Over</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var dino,obs,sc,ov,loop,speed,t;
function init(){dino={x:100,y:H-80,w:40,h:60,vy:0,onG:true};obs=[];sc=0;ov=false;speed=7;t=0;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function jump(){if(ov||!dino.onG)return;dino.vy=-15;dino.onG=false;}
window.jump=jump;
function upd(){t++;sc+=speed/20;document.getElementById('score').textContent=Math.floor(sc);dino.vy+=0.8;dino.y+=dino.vy;dino.onG=false;if(dino.y+dino.h>H-60){dino.y=H-60-dino.h;dino.vy=0;dino.onG=true;}obs.forEach(function(o){o.x-=speed;});obs=obs.filter(function(o){return o.x>-50;});if(t%45===0)obs.push({x:W,h:20+Math.random()*40});obs.forEach(function(o){if(dino.x<o.x+20&&dino.x+dino.w>o.x&&dino.y+dino.h>H-60-o.h){ov=true;document.getElementById('ov').classList.add('show');}});}
function draw(){x.fillStyle='#f5f5dc';x.fillRect(0,0,W,H);x.fillStyle='#666';x.fillRect(0,H-60,W,60);obs.forEach(function(o){x.fillStyle='#333';x.fillRect(o.x,H-60-o.h,20,o.h);});x.fillStyle='#22c55e';x.fillRect(dino.x,dino.y,dino.w,dino.h);x.fillStyle='#000';x.beginPath();x.arc(dino.x+30,dino.y+15,3,0,6.3);x.fill();}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key===' ')jump();});
c.addEventListener('click',jump);
rst();
`, "dino-run");
}

function catJump(): string {
  return wrap("Chat Jump", `
<h1>🐱 <span>Chat Jump</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="400" height="600"></canvas>
<div class="controls"><button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button><button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button></div>
<div class="overlay" id="ov"><h2>Chute !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var cat,plats,sc,ov,loop,vy,vx;
function init(){cat={x:W/2-20,y:H-80,w:40,h:40};plats=[];for(var i=0;i<10;i++)plats.push({x:Math.random()*(W-70),y:H-i*70,w:70,h:12});vy=-11;vx=0;sc=0;ov=false;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function mv(d){vx=d*5;}
window.mv=mv;
function upd(){vy+=0.45;cat.y+=vy;cat.x+=vx;vx*=0.9;if(cat.x<0)cat.x=0;if(cat.x+cat.w>W)cat.x=W-cat.w;plats.forEach(function(p){if(cat.y+cat.h>p.y&&cat.y+cat.h<p.y+p.h+10&&cat.x+cat.w>p.x&&cat.x<p.x+p.w&&vy>0){vy=-11;sc+=10;document.getElementById('score').textContent=sc;}});if(cat.y<H/2){var dy=H/2-cat.y;cat.y=H/2;plats.forEach(function(p){p.y+=dy;});sc+=Math.floor(dy/10);document.getElementById('score').textContent=sc;}plats=plats.filter(function(p){return p.y<H+50;});while(plats.length<12){var top=H;plats.forEach(function(p){if(p.y<top)top=p.y;});plats.push({x:Math.random()*(W-70),y:top-Math.random()*60-40,w:70,h:12});}if(cat.y>H){ov=true;document.getElementById('ov').classList.add('show');}}
function draw(){x.fillStyle='#0a0a1a';x.fillRect(0,0,W,H);plats.forEach(function(p){x.fillStyle='#facc15';x.fillRect(p.x,p.y,p.w,p.h);});x.fillStyle='#f97316';x.fillRect(cat.x,cat.y,cat.w,cat.h);x.fillStyle='#000';x.beginPath();x.arc(cat.x+12,cat.y+15,4,0,6.3);x.fill();x.beginPath();x.arc(cat.x+28,cat.y+15,4,0,6.3);x.fill();}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')mv(-1);if(e.key==='ArrowRight')mv(1);});
rst();
`, "cat-jump");
}

function dogJump(): string {
  return wrap("Chien Jump", `
<h1>🐶 <span>Chien Jump</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="400" height="600"></canvas>
<div class="controls"><button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button><button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button></div>
<div class="overlay" id="ov"><h2>Chute !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var dog,plats,sc,ov,loop,vy,vx;
function init(){dog={x:W/2-20,y:H-80,w:40,h:40};plats=[];for(var i=0;i<10;i++)plats.push({x:Math.random()*(W-70),y:H-i*70,w:70,h:12});vy=-11;vx=0;sc=0;ov=false;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function mv(d){vx=d*5;}
window.mv=mv;
function upd(){vy+=0.45;dog.y+=vy;dog.x+=vx;vx*=0.9;if(dog.x<0)dog.x=0;if(dog.x+dog.w>W)dog.x=W-dog.w;plats.forEach(function(p){if(dog.y+dog.h>p.y&&dog.y+dog.h<p.y+p.h+10&&dog.x+dog.w>p.x&&dog.x<p.x+p.w&&vy>0){vy=-11;sc+=10;document.getElementById('score').textContent=sc;}});if(dog.y<H/2){var dy=H/2-dog.y;dog.y=H/2;plats.forEach(function(p){p.y+=dy;});sc+=Math.floor(dy/10);document.getElementById('score').textContent=sc;}plats=plats.filter(function(p){return p.y<H+50;});while(plats.length<12){var top=H;plats.forEach(function(p){if(p.y<top)top=p.y;});plats.push({x:Math.random()*(W-70),y:top-Math.random()*60-40,w:70,h:12});}if(dog.y>H){ov=true;document.getElementById('ov').classList.add('show');}}
function draw(){x.fillStyle='#0a0a1a';x.fillRect(0,0,W,H);plats.forEach(function(p){x.fillStyle='#facc15';x.fillRect(p.x,p.y,p.w,p.h);});x.fillStyle='#8b4513';x.fillRect(dog.x,dog.y,dog.w,dog.h);x.fillStyle='#000';x.beginPath();x.arc(dog.x+12,dog.y+15,4,0,6.3);x.fill();x.beginPath();x.arc(dog.x+28,dog.y+15,4,0,6.3);x.fill();}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')mv(-1);if(e.key==='ArrowRight')mv(1);});
rst();
`, "dog-jump");
}

function rabbitJump(): string {
  return wrap("Lapin Jump", `
<h1>🐰 <span>Lapin Jump</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="400" height="600"></canvas>
<div class="controls"><button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button><button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button></div>
<div class="overlay" id="ov"><h2>Chute !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var rab,plats,sc,ov,loop,vy,vx;
function init(){rab={x:W/2-20,y:H-80,w:40,h:40};plats=[];for(var i=0;i<10;i++)plats.push({x:Math.random()*(W-70),y:H-i*70,w:70,h:12});vy=-11;vx=0;sc=0;ov=false;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function mv(d){vx=d*5;}
window.mv=mv;
function upd(){vy+=0.45;rab.y+=vy;rab.x+=vx;vx*=0.9;if(rab.x<0)rab.x=0;if(rab.x+rab.w>W)rab.x=W-rab.w;plats.forEach(function(p){if(rab.y+rab.h>p.y&&rab.y+rab.h<p.y+p.h+10&&rab.x+rab.w>p.x&&rab.x<p.x+p.w&&vy>0){vy=-11;sc+=10;document.getElementById('score').textContent=sc;}});if(rab.y<H/2){var dy=H/2-rab.y;rab.y=H/2;plats.forEach(function(p){p.y+=dy;});sc+=Math.floor(dy/10);document.getElementById('score').textContent=sc;}plats=plats.filter(function(p){return p.y<H+50;});while(plats.length<12){var top=H;plats.forEach(function(p){if(p.y<top)top=p.y;});plats.push({x:Math.random()*(W-70),y:top-Math.random()*60-40,w:70,h:12});}if(rab.y>H){ov=true;document.getElementById('ov').classList.add('show');}}
function draw(){x.fillStyle='#0a0a1a';x.fillRect(0,0,W,H);plats.forEach(function(p){x.fillStyle='#facc15';x.fillRect(p.x,p.y,p.w,p.h);});x.fillStyle='#fff';x.fillRect(rab.x,rab.y,rab.w,rab.h);x.fillStyle='#000';x.beginPath();x.arc(rab.x+12,rab.y+15,4,0,6.3);x.fill();x.beginPath();x.arc(rab.x+28,rab.y+15,4,0,6.3);x.fill();x.fillStyle='#f9a8d4';x.fillRect(rab.x+18,rab.y+25,5,8);}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')mv(-1);if(e.key==='ArrowRight')mv(1);});
rst();
`, "rabbit-jump");
}

function frogJump(): string {
  return wrap("Grenouille Jump", `
<h1>🐸 <span>Grenouille</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="400" height="600"></canvas>
<div class="controls"><button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button><button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button></div>
<div class="overlay" id="ov"><h2>Chute !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var fr,plats,sc,ov,loop,vy,vx;
function init(){fr={x:W/2-20,y:H-80,w:40,h:40};plats=[];for(var i=0;i<10;i++)plats.push({x:Math.random()*(W-70),y:H-i*70,w:70,h:12});vy=-11;vx=0;sc=0;ov=false;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function mv(d){vx=d*5;}
window.mv=mv;
function upd(){vy+=0.45;fr.y+=vy;fr.x+=vx;vx*=0.9;if(fr.x<0)fr.x=0;if(fr.x+fr.w>W)fr.x=W-fr.w;plats.forEach(function(p){if(fr.y+fr.h>p.y&&fr.y+fr.h<p.y+p.h+10&&fr.x+fr.w>p.x&&fr.x<p.x+p.w&&vy>0){vy=-11;sc+=10;document.getElementById('score').textContent=sc;}});if(fr.y<H/2){var dy=H/2-fr.y;fr.y=H/2;plats.forEach(function(p){p.y+=dy;});sc+=Math.floor(dy/10);document.getElementById('score').textContent=sc;}plats=plats.filter(function(p){return p.y<H+50;});while(plats.length<12){var top=H;plats.forEach(function(p){if(p.y<top)top=p.y;});plats.push({x:Math.random()*(W-70),y:top-Math.random()*60-40,w:70,h:12});}if(fr.y>H){ov=true;document.getElementById('ov').classList.add('show');}}
function draw(){x.fillStyle='#0a0a1a';x.fillRect(0,0,W,H);plats.forEach(function(p){x.fillStyle='#22c55e';x.fillRect(p.x,p.y,p.w,p.h);});x.fillStyle='#84cc16';x.fillRect(fr.x,fr.y,fr.w,fr.h);x.fillStyle='#000';x.beginPath();x.arc(fr.x+12,fr.y+15,4,0,6.3);x.fill();x.beginPath();x.arc(fr.x+28,fr.y+15,4,0,6.3);x.fill();}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')mv(-1);if(e.key==='ArrowRight')mv(1);});
rst();
`, "frog-jump");
}

function bearJump(): string {
  return wrap("Ours Jump", `
<h1>🐻 <span>Ours Jump</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="400" height="600"></canvas>
<div class="controls"><button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button><button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button></div>
<div class="overlay" id="ov"><h2>Chute !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var bear,plats,sc,ov,loop,vy,vx;
function init(){bear={x:W/2-20,y:H-80,w:40,h:40};plats=[];for(var i=0;i<10;i++)plats.push({x:Math.random()*(W-70),y:H-i*70,w:70,h:12});vy=-11;vx=0;sc=0;ov=false;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function mv(d){vx=d*5;}
window.mv=mv;
function upd(){vy+=0.45;bear.y+=vy;bear.x+=vx;vx*=0.9;if(bear.x<0)bear.x=0;if(bear.x+bear.w>W)bear.x=W-bear.w;plats.forEach(function(p){if(bear.y+bear.h>p.y&&bear.y+bear.h<p.y+p.h+10&&bear.x+bear.w>p.x&&bear.x<p.x+p.w&&vy>0){vy=-11;sc+=10;document.getElementById('score').textContent=sc;}});if(bear.y<H/2){var dy=H/2-bear.y;bear.y=H/2;plats.forEach(function(p){p.y+=dy;});sc+=Math.floor(dy/10);document.getElementById('score').textContent=sc;}plats=plats.filter(function(p){return p.y<H+50;});while(plats.length<12){var top=H;plats.forEach(function(p){if(p.y<top)top=p.y;});plats.push({x:Math.random()*(W-70),y:top-Math.random()*60-40,w:70,h:12});}if(bear.y>H){ov=true;document.getElementById('ov').classList.add('show');}}
function draw(){x.fillStyle='#0a0a1a';x.fillRect(0,0,W,H);plats.forEach(function(p){x.fillStyle='#facc15';x.fillRect(p.x,p.y,p.w,p.h);});x.fillStyle='#8b4513';x.fillRect(bear.x,bear.y,bear.w,bear.h);x.fillStyle='#000';x.beginPath();x.arc(bear.x+12,bear.y+15,4,0,6.3);x.fill();x.beginPath();x.arc(bear.x+28,bear.y+15,4,0,6.3);x.fill();x.fillStyle='#000';x.beginPath();x.arc(bear.x+20,bear.y+28,4,0,6.3);x.fill();}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')mv(-1);if(e.key==='ArrowRight')mv(1);});
rst();
`, "bear-jump");
}

function penguinJump(): string {
  return wrap("Pingouin", `
<h1>🐧 <span>Pingouin</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="400" height="600"></canvas>
<div class="controls"><button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button><button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button></div>
<div class="overlay" id="ov"><h2>Chute !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var peng,plats,sc,ov,loop,vy,vx;
function init(){peng={x:W/2-20,y:H-80,w:40,h:40};plats=[];for(var i=0;i<10;i++)plats.push({x:Math.random()*(W-70),y:H-i*70,w:70,h:12});vy=-11;vx=0;sc=0;ov=false;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function mv(d){vx=d*5;}
window.mv=mv;
function upd(){vy+=0.45;peng.y+=vy;peng.x+=vx;vx*=0.9;if(peng.x<0)peng.x=0;if(peng.x+peng.w>W)peng.x=W-peng.w;plats.forEach(function(p){if(peng.y+peng.h>p.y&&peng.y+peng.h<p.y+p.h+10&&peng.x+peng.w>p.x&&peng.x<p.x+p.w&&vy>0){vy=-11;sc+=10;document.getElementById('score').textContent=sc;}});if(peng.y<H/2){var dy=H/2-peng.y;peng.y=H/2;plats.forEach(function(p){p.y+=dy;});sc+=Math.floor(dy/10);document.getElementById('score').textContent=sc;}plats=plats.filter(function(p){return p.y<H+50;});while(plats.length<12){var top=H;plats.forEach(function(p){if(p.y<top)top=p.y;});plats.push({x:Math.random()*(W-70),y:top-Math.random()*60-40,w:70,h:12});}if(peng.y>H){ov=true;document.getElementById('ov').classList.add('show');}}
function draw(){x.fillStyle='#0a0a1a';x.fillRect(0,0,W,H);plats.forEach(function(p){x.fillStyle='#87ceeb';x.fillRect(p.x,p.y,p.w,p.h);});x.fillStyle='#000';x.fillRect(peng.x,peng.y,peng.w,peng.h);x.fillStyle='#fff';x.fillRect(peng.x+10,peng.y+10,20,25);x.fillStyle='#facc15';x.fillRect(peng.x+15,peng.y+28,10,6);x.fillStyle='#000';x.beginPath();x.arc(peng.x+15,peng.y+15,3,0,6.3);x.fill();x.beginPath();x.arc(peng.x+25,peng.y+15,3,0,6.3);x.fill();}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')mv(-1);if(e.key==='ArrowRight')mv(1);});
rst();
`, "penguin-jump");
}

function koalaJump(): string {
  return wrap("Koala Jump", `
<h1>🐨 <span>Koala Jump</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="400" height="600"></canvas>
<div class="controls"><button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button><button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button></div>
<div class="overlay" id="ov"><h2>Chute !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var ko,plats,sc,ov,loop,vy,vx;
function init(){ko={x:W/2-20,y:H-80,w:40,h:40};plats=[];for(var i=0;i<10;i++)plats.push({x:Math.random()*(W-70),y:H-i*70,w:70,h:12});vy=-11;vx=0;sc=0;ov=false;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function mv(d){vx=d*5;}
window.mv=mv;
function upd(){vy+=0.45;ko.y+=vy;ko.x+=vx;vx*=0.9;if(ko.x<0)ko.x=0;if(ko.x+ko.w>W)ko.x=W-ko.w;plats.forEach(function(p){if(ko.y+ko.h>p.y&&ko.y+ko.h<p.y+p.h+10&&ko.x+ko.w>p.x&&ko.x<p.x+p.w&&vy>0){vy=-11;sc+=10;document.getElementById('score').textContent=sc;}});if(ko.y<H/2){var dy=H/2-ko.y;ko.y=H/2;plats.forEach(function(p){p.y+=dy;});sc+=Math.floor(dy/10);document.getElementById('score').textContent=sc;}plats=plats.filter(function(p){return p.y<H+50;});while(plats.length<12){var top=H;plats.forEach(function(p){if(p.y<top)top=p.y;});plats.push({x:Math.random()*(W-70),y:top-Math.random()*60-40,w:70,h:12});}if(ko.y>H){ov=true;document.getElementById('ov').classList.add('show');}}
function draw(){x.fillStyle='#0a0a1a';x.fillRect(0,0,W,H);plats.forEach(function(p){x.fillStyle='#facc15';x.fillRect(p.x,p.y,p.w,p.h);});x.fillStyle='#a1a1aa';x.fillRect(ko.x,ko.y,ko.w,ko.h);x.fillStyle='#000';x.beginPath();x.arc(ko.x+12,ko.y+15,4,0,6.3);x.fill();x.beginPath();x.arc(ko.x+28,ko.y+15,4,0,6.3);x.fill();}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')mv(-1);if(e.key==='ArrowRight')mv(1);});
rst();
`, "koala-jump");
}

function pandaJump(): string {
  return wrap("Panda Jump", `
<h1>🐼 <span>Panda Jump</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="400" height="600"></canvas>
<div class="controls"><button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button><button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button></div>
<div class="overlay" id="ov"><h2>Chute !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var pd,plats,sc,ov,loop,vy,vx;
function init(){pd={x:W/2-20,y:H-80,w:40,h:40};plats=[];for(var i=0;i<10;i++)plats.push({x:Math.random()*(W-70),y:H-i*70,w:70,h:12});vy=-11;vx=0;sc=0;ov=false;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function mv(d){vx=d*5;}
window.mv=mv;
function upd(){vy+=0.45;pd.y+=vy;pd.x+=vx;vx*=0.9;if(pd.x<0)pd.x=0;if(pd.x+pd.w>W)pd.x=W-pd.w;plats.forEach(function(p){if(pd.y+pd.h>p.y&&pd.y+pd.h<p.y+p.h+10&&pd.x+pd.w>p.x&&pd.x<p.x+p.w&&vy>0){vy=-11;sc+=10;document.getElementById('score').textContent=sc;}});if(pd.y<H/2){var dy=H/2-pd.y;pd.y=H/2;plats.forEach(function(p){p.y+=dy;});sc+=Math.floor(dy/10);document.getElementById('score').textContent=sc;}plats=plats.filter(function(p){return p.y<H+50;});while(plats.length<12){var top=H;plats.forEach(function(p){if(p.y<top)top=p.y;});plats.push({x:Math.random()*(W-70),y:top-Math.random()*60-40,w:70,h:12});}if(pd.y>H){ov=true;document.getElementById('ov').classList.add('show');}}
function draw(){x.fillStyle='#0a0a1a';x.fillRect(0,0,W,H);plats.forEach(function(p){x.fillStyle='#22c55e';x.fillRect(p.x,p.y,p.w,p.h);});x.fillStyle='#fff';x.fillRect(pd.x,pd.y,pd.w,pd.h);x.fillStyle='#000';x.beginPath();x.arc(pd.x+12,pd.y+15,5,0,6.3);x.fill();x.beginPath();x.arc(pd.x+28,pd.y+15,5,0,6.3);x.fill();x.beginPath();x.arc(pd.x+20,pd.y+28,4,0,6.3);x.fill();}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')mv(-1);if(e.key==='ArrowRight')mv(1);});
rst();
`, "panda-jump");
}

function snakeArena(): string {
  return wrap("Snake Arena", `
<h1>🐍 <span>Snake Arena</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="500" height="500"></canvas>
<div class="controls"><button ontouchstart="mv(0,-1);event.preventDefault()" onclick="mv(0,-1)">↑</button></div>
<div class="controls"><button ontouchstart="mv(-1,0);event.preventDefault()" onclick="mv(-1,0)">←</button><button ontouchstart="mv(0,1);event.preventDefault()" onclick="mv(0,1)">↓</button><button ontouchstart="mv(1,0);event.preventDefault()" onclick="mv(1,0)">→</button></div>
<div class="overlay" id="ov"><h2>Game Over</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),N=25,T=20;
var sn,dir,nd,food,sc,ov,loop;
function init(){sn=[{x:12,y:12},{x:11,y:12},{x:10,y:12}];dir={x:1,y:0};nd={x:1,y:0};sc=0;ov=false;spawn();document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function spawn(){while(1){food={x:Math.floor(Math.random()*N),y:Math.floor(Math.random()*N)};if(!sn.some(function(s){return s.x===food.x&&s.y===food.y;}))return;}}
function mv(a,b){if(a===-dir.x&&b===-dir.y)return;nd={x:a,y:b};}
window.mv=mv;
function upd(){dir=nd;var h={x:sn[0].x+dir.x,y:sn[0].y+dir.y};if(h.x<0||h.x>=N||h.y<0||h.y>=N||sn.some(function(s){return s.x===h.x&&s.y===h.y;})){ov=true;document.getElementById('ov').classList.add('show');return;}sn.unshift(h);if(h.x===food.x&&h.y===food.y){sc+=10;document.getElementById('score').textContent=sc;spawn();}else sn.pop();}
function draw(){x.fillStyle='#000';x.fillRect(0,0,c.width,c.height);x.fillStyle='#ef4444';x.fillRect(food.x*T+1,food.y*T+1,T-2,T-2);sn.forEach(function(s,i){x.fillStyle=i===0?'#22c55e':'#16a34a';x.fillRect(s.x*T+1,s.y*T+1,T-2,T-2);});}
function tick(){upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,120);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')mv(-1,0);if(e.key==='ArrowRight')mv(1,0);if(e.key==='ArrowUp')mv(0,-1);if(e.key==='ArrowDown')mv(0,1);});
rst();
`, "snake-arena");
}

function tetrisClassic5(): string {
  return wrap("Tetris 5", `
<h1>🧩 <span>Tetris 5</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="300" height="600" style="width:min(300px,60vw)"></canvas>
<div class="controls"><button ontouchstart="act('l');event.preventDefault()" onclick="act('l')">←</button><button ontouchstart="act('r');event.preventDefault()" onclick="act('r')">↻</button><button ontouchstart="act('p');event.preventDefault()" onclick="act('p')">→</button><button ontouchstart="act('d');event.preventDefault()" onclick="act('d')">↓</button></div>
<div class="overlay" id="ov"><h2>Game Over</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),COLS=10,ROWS=20,B=c.width/COLS;
var board,piece,px,py,sc,ov,loop;
var SHAPES=[[[1,1,1,1]],[[1,1],[1,1]],[[0,1,0],[1,1,1]],[[1,0,0],[1,1,1]],[[0,0,1],[1,1,1]],[[0,1,1],[1,1,0]],[[1,1,0],[0,1,1]]];
var COLORS=['#06b6d4','#facc15','#a855f7','#3b82f6','#f97316','#22c55e','#ef4444'];
function init(){board=[];for(var i=0;i<ROWS;i++){board[i]=[];for(var j=0;j<COLS;j++)board[i][j]=0;}sc=0;ov=false;newP();document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function newP(){var i=Math.floor(Math.random()*SHAPES.length);piece={shape:SHAPES[i].map(function(r){return r.slice();}),color:COLORS[i]};px=Math.floor((COLS-piece.shape[0].length)/2);py=0;if(coll())end();}
function coll(){for(var y=0;y<piece.shape.length;y++)for(var x=0;x<piece.shape[y].length;x++){if(piece.shape[y][x]){var nx=px+x,ny=py+y;if(nx<0||nx>=COLS||ny>=ROWS)return true;if(ny>=0&&board[ny][nx])return true;}}return false;}
function merge(){for(var y=0;y<piece.shape.length;y++)for(var x=0;x<piece.shape[y].length;x++)if(piece.shape[y][x])board[py+y][px+x]=piece.color;}
function clr(){for(var y=ROWS-1;y>=0;y--){if(board[y].every(function(c){return c;})){board.splice(y,1);board.unshift([]);for(var j=0;j<COLS;j++)board[0][j]=0;sc+=100;document.getElementById('score').textContent=sc;y++;}}}
function draw(){x.fillStyle='#000';x.fillRect(0,0,c.width,c.height);for(var y=0;y<ROWS;y++)for(var xx=0;xx<COLS;xx++){if(board[y][xx]){x.fillStyle=board[y][xx];x.fillRect(xx*B+1,y*B+1,B-2,B-2);}}if(piece){for(var y=0;y<piece.shape.length;y++)for(var xx=0;xx<piece.shape[y].length;xx++){if(piece.shape[y][xx]){x.fillStyle=piece.color;x.fillRect((px+xx)*B+1,(py+y)*B+1,B-2,B-2);}}}}
function act(a){if(ov||!piece)return;if(a==='l'){px--;if(coll())px++;}else if(a==='r'){px++;if(coll())px--;}else if(a==='d'){py++;if(coll()){py--;merge();clr();newP();}}else if(a==='p'){var r=piece.shape[0].map(function(_,i){return piece.shape.map(function(row){return row[i];}).reverse();});var old=piece.shape;piece.shape=r;if(coll())piece.shape=old;}draw();}
function tick(){if(!ov){py++;if(coll()){py--;merge();clr();newP();}draw();}}
function end(){ov=true;document.getElementById('ov').classList.add('show');}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,500);draw();}
window.act=act;window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')act('l');if(e.key==='ArrowRight')act('p');if(e.key==='ArrowUp')act('r');if(e.key==='ArrowDown')act('d');});
rst();
`, "tetris5");
}

function tetrisClassic6(): string {
  return wrap("Tetris 6", `
<h1>🧩 <span>Tetris 6</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="300" height="600" style="width:min(300px,60vw)"></canvas>
<div class="controls"><button ontouchstart="act('l');event.preventDefault()" onclick="act('l')">←</button><button ontouchstart="act('r');event.preventDefault()" onclick="act('r')">↻</button><button ontouchstart="act('p');event.preventDefault()" onclick="act('p')">→</button><button ontouchstart="act('d');event.preventDefault()" onclick="act('d')">↓</button></div>
<div class="overlay" id="ov"><h2>Game Over</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),COLS=10,ROWS=20,B=c.width/COLS;
var board,piece,px,py,sc,ov,loop;
var SHAPES=[[[1,1,1,1]],[[1,1],[1,1]],[[0,1,0],[1,1,1]],[[1,0,0],[1,1,1]],[[0,0,1],[1,1,1]],[[0,1,1],[1,1,0]],[[1,1,0],[0,1,1]]];
var COLORS=['#06b6d4','#facc15','#a855f7','#3b82f6','#f97316','#22c55e','#ef4444'];
function init(){board=[];for(var i=0;i<ROWS;i++){board[i]=[];for(var j=0;j<COLS;j++)board[i][j]=0;}sc=0;ov=false;newP();document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function newP(){var i=Math.floor(Math.random()*SHAPES.length);piece={shape:SHAPES[i].map(function(r){return r.slice();}),color:COLORS[i]};px=Math.floor((COLS-piece.shape[0].length)/2);py=0;if(coll())end();}
function coll(){for(var y=0;y<piece.shape.length;y++)for(var x=0;x<piece.shape[y].length;x++){if(piece.shape[y][x]){var nx=px+x,ny=py+y;if(nx<0||nx>=COLS||ny>=ROWS)return true;if(ny>=0&&board[ny][nx])return true;}}return false;}
function merge(){for(var y=0;y<piece.shape.length;y++)for(var x=0;x<piece.shape[y].length;x++)if(piece.shape[y][x])board[py+y][px+x]=piece.color;}
function clr(){for(var y=ROWS-1;y>=0;y--){if(board[y].every(function(c){return c;})){board.splice(y,1);board.unshift([]);for(var j=0;j<COLS;j++)board[0][j]=0;sc+=100;document.getElementById('score').textContent=sc;y++;}}}
function draw(){x.fillStyle='#000';x.fillRect(0,0,c.width,c.height);for(var y=0;y<ROWS;y++)for(var xx=0;xx<COLS;xx++){if(board[y][xx]){x.fillStyle=board[y][xx];x.fillRect(xx*B+1,y*B+1,B-2,B-2);}}if(piece){for(var y=0;y<piece.shape.length;y++)for(var xx=0;xx<piece.shape[y].length;xx++){if(piece.shape[y][xx]){x.fillStyle=piece.color;x.fillRect((px+xx)*B+1,(py+y)*B+1,B-2,B-2);}}}}
function act(a){if(ov||!piece)return;if(a==='l'){px--;if(coll())px++;}else if(a==='r'){px++;if(coll())px--;}else if(a==='d'){py++;if(coll()){py--;merge();clr();newP();}}else if(a==='p'){var r=piece.shape[0].map(function(_,i){return piece.shape.map(function(row){return row[i];}).reverse();});var old=piece.shape;piece.shape=r;if(coll())piece.shape=old;}draw();}
function tick(){if(!ov){py++;if(coll()){py--;merge();clr();newP();}draw();}}
function end(){ov=true;document.getElementById('ov').classList.add('show');}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,450);draw();}
window.act=act;window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')act('l');if(e.key==='ArrowRight')act('p');if(e.key==='ArrowUp')act('r');if(e.key==='ArrowDown')act('d');});
rst();
`, "tetris6");
}

function spaceRunner(): string {
  return wrap("Space Runner", `
<h1>🚀 <span>Space Runner</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="600" height="400"></canvas>
<div class="controls"><button ontouchstart="jump();event.preventDefault()" onclick="jump()" style="width:180px;background:#3b82f6;color:#fff">SAUT</button></div>
<div class="overlay" id="ov"><h2>Game Over</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var sh,obs,sc,ov,loop,speed,t;
function init(){sh={x:100,y:H-80,w:40,h:30,vy:0,onG:true};obs=[];sc=0;ov=false;speed=8;t=0;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function jump(){if(ov||!sh.onG)return;sh.vy=-14;sh.onG=false;}
window.jump=jump;
function upd(){t++;sc+=speed/20;document.getElementById('score').textContent=Math.floor(sc);sh.vy+=0.7;sh.y+=sh.vy;sh.onG=false;if(sh.y+sh.h>H-60){sh.y=H-60-sh.h;sh.vy=0;sh.onG=true;}obs.forEach(function(o){o.x-=speed;});obs=obs.filter(function(o){return o.x>-50;});if(t%45===0)obs.push({x:W,h:20+Math.random()*40});obs.forEach(function(o){if(sh.x<o.x+20&&sh.x+sh.w>o.x&&sh.y+sh.h>H-60-o.h){ov=true;document.getElementById('ov').classList.add('show');}});}
function draw(){x.fillStyle='#000';x.fillRect(0,0,W,H);for(var i=0;i<50;i++){x.fillStyle='#fff';x.fillRect((i*37)%W,(i*29)%H,1,1);}x.fillStyle='#333';x.fillRect(0,H-60,W,60);obs.forEach(function(o){x.fillStyle='#ef4444';x.fillRect(o.x,H-60-o.h,20,o.h);});x.fillStyle='#facc15';x.fillRect(sh.x,sh.y,sh.w,sh.h);}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key===' ')jump();});
c.addEventListener('click',jump);
rst();
`, "space-runner");
}

function zombieRunner(): string {
  return wrap("Zombie Runner", `
<h1>🧟 <span>Zombie Runner</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="600" height="400"></canvas>
<div class="controls"><button ontouchstart="jump();event.preventDefault()" onclick="jump()" style="width:180px;background:#22c55e;color:#fff">SAUT</button></div>
<div class="overlay" id="ov"><h2>Attrapé !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var pl,zombs,sc,ov,loop,speed,t;
function init(){pl={x:100,y:H-80,w:30,h:40,vy:0,onG:true};zombs=[];sc=0;ov=false;speed=7;t=0;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function jump(){if(ov||!pl.onG)return;pl.vy=-14;pl.onG=false;}
window.jump=jump;
function upd(){t++;sc+=speed/20;document.getElementById('score').textContent=Math.floor(sc);pl.vy+=0.7;pl.y+=pl.vy;pl.onG=false;if(pl.y+pl.h>H-60){pl.y=H-60-pl.h;pl.vy=0;pl.onG=true;}zombs.forEach(function(z){z.x-=speed;});zombs=zombs.filter(function(z){return z.x>-50;});if(t%55===0)zombs.push({x:W,h:30+Math.random()*40});zombs.forEach(function(z){if(pl.x<z.x+20&&pl.x+pl.w>z.x&&pl.y+pl.h>H-60-z.h){ov=true;document.getElementById('ov').classList.add('show');}});}
function draw(){x.fillStyle='#1a1a1a';x.fillRect(0,0,W,H);x.fillStyle='#333';x.fillRect(0,H-60,W,60);zombs.forEach(function(z){x.fillStyle='#a855f7';x.fillRect(z.x,H-60-z.h,20,z.h);x.fillStyle='#000';x.fillRect(z.x+5,H-60-z.h+10,4,4);x.fillRect(z.x+12,H-60-z.h+10,4,4);});x.fillStyle='#22c55e';x.fillRect(pl.x,pl.y,pl.w,pl.h);x.fillStyle='#000';x.beginPath();x.arc(pl.x+22,pl.y+15,3,0,6.3);x.fill();}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key===' ')jump();});
c.addEventListener('click',jump);
rst();
`, "zombie-runner");
}

function ghostRunner(): string {
  return wrap("Ghost Run", `
<h1>👻 <span>Ghost Run</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="600" height="400"></canvas>
<div class="controls"><button ontouchstart="jump();event.preventDefault()" onclick="jump()" style="width:180px;background:#a855f7;color:#fff">SAUT</button></div>
<div class="overlay" id="ov"><h2>Game Over</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var gh,obs,sc,ov,loop,speed,t;
function init(){gh={x:100,y:H-80,w:40,h:40,vy:0,onG:true};obs=[];sc=0;ov=false;speed=7;t=0;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function jump(){if(ov||!gh.onG)return;gh.vy=-14;gh.onG=false;}
window.jump=jump;
function upd(){t++;sc+=speed/20;document.getElementById('score').textContent=Math.floor(sc);gh.vy+=0.7;gh.y+=gh.vy;gh.onG=false;if(gh.y+gh.h>H-60){gh.y=H-60-gh.h;gh.vy=0;gh.onG=true;}obs.forEach(function(o){o.x-=speed;});obs=obs.filter(function(o){return o.x>-50;});if(t%50===0)obs.push({x:W,h:20+Math.random()*40});obs.forEach(function(o){if(gh.x<o.x+20&&gh.x+gh.w>o.x&&gh.y+gh.h>H-60-o.h){ov=true;document.getElementById('ov').classList.add('show');}});}
function draw(){x.fillStyle='#0a0a1a';x.fillRect(0,0,W,H);x.fillStyle='#1a1a2a';x.fillRect(0,H-60,W,60);obs.forEach(function(o){x.fillStyle='#333';x.fillRect(o.x,H-60-o.h,20,o.h);});x.fillStyle='#fff';x.beginPath();x.arc(gh.x+gh.w/2,gh.y+gh.h/2,gh.w/2,Math.PI,0);x.lineTo(gh.x+gh.w,gh.y+gh.h);x.lineTo(gh.x,gh.y+gh.h);x.closePath();x.fill();x.fillStyle='#000';x.beginPath();x.arc(gh.x+15,gh.y+20,3,0,6.3);x.fill();x.beginPath();x.arc(gh.x+25,gh.y+20,3,0,6.3);x.fill();}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key===' ')jump();});
c.addEventListener('click',jump);
rst();
`, "ghost-runner");
}

function dragonFlight(): string {
  return wrap("Dragon", `
<h1>🐉 <span>Dragon</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span></div>
<canvas id="g" width="600" height="400"></canvas>
<div class="controls"><button ontouchstart="up();event.preventDefault()" onclick="up()">↑</button><button ontouchstart="down();event.preventDefault()" onclick="down()">↓</button></div>
<div class="overlay" id="ov"><h2>Game Over</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var dr,obs,sc,ov,loop,speed,t;
function init(){dr={x:100,y:H/2,w:60,h:40};obs=[];sc=0;ov=false;speed=5;t=0;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');}
function up(){dr.y-=20;}
function down(){dr.y+=20;}
window.up=up;window.down=down;
function upd(){t++;sc+=speed/20;document.getElementById('score').textContent=Math.floor(sc);dr.y=Math.max(0,Math.min(H-dr.h,dr.y));obs.forEach(function(o){o.x-=speed;});obs=obs.filter(function(o){return o.x+o.w>0;});if(t%60===0){var gap=120;var top=Math.random()*(H-gap-40)+20;obs.push({x:W,top:top,gap:gap,passed:false});}obs.forEach(function(o){if(!o.passed&&o.x+o.w<dr.x){o.passed=true;sc+=10;}if(dr.x<o.x+o.w&&dr.x+dr.w>o.x){if(dr.y<o.top||dr.y+dr.h>o.top+o.gap){ov=true;document.getElementById('ov').classList.add('show');}}});}
function draw(){x.fillStyle='#0a0a2a';x.fillRect(0,0,W,H);obs.forEach(function(o){x.fillStyle='#333';x.fillRect(o.x,0,40,o.top);x.fillRect(o.x,o.top+o.gap,40,H-o.top-o.gap);});x.fillStyle='#ef4444';x.fillRect(dr.x,dr.y,dr.w,dr.h);x.fillStyle='#facc15';x.fillRect(dr.x+dr.w-15,dr.y+10,15,20);x.fillStyle='#000';x.beginPath();x.arc(dr.x+45,dr.y+15,3,0,6.3);x.fill();}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowUp')up();if(e.key==='ArrowDown')down();});
rst();
`, "dragon-flight");
}

function wizardMagic(): string {
  return wrap("Magicien", `
<h1>🧙 <span>Magicien</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Mana : <strong id="mana">50</strong></span></div>
<canvas id="g" width="500" height="500"></canvas>
<div class="controls"><button ontouchstart="cast();event.preventDefault()" onclick="cast()" style="width:180px;background:#a855f7;color:#fff">SORT (5)</button></div>
<div class="overlay" id="ov"><h2>Terminé</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var wiz,enemies,sc,mana,ov,loop,t;
function init(){wiz={x:W/2-20,y:H-60,w:40,h:40};enemies=[];sc=0;mana=50;ov=false;t=0;document.getElementById('score').textContent='0';document.getElementById('mana').textContent='50';document.getElementById('ov').classList.remove('show');}
function cast(){if(ov||mana<5)return;mana-=5;document.getElementById('mana').textContent=mana;enemies.forEach(function(e){e.hp-=1;if(e.hp<=0){e.dead=true;sc+=20;document.getElementById('score').textContent=sc;}});enemies=enemies.filter(function(e){return !e.dead;});}
window.cast=cast;
function upd(){t++;if(t%60===0){enemies.push({x:Math.random()*(W-40),y:-40,w:40,h:40,hp:2,vy:1});}enemies.forEach(function(e){e.y+=e.vy;});enemies=enemies.filter(function(e){return e.y<H+30;});if(mana<50)mana+=0.1;document.getElementById('mana').textContent=Math.floor(mana);enemies.forEach(function(e){if(e.y+e.h>wiz.y){ov=true;document.getElementById('ov').classList.add('show');}});}
function draw(){x.fillStyle='#0a0a2a';x.fillRect(0,0,W,H);enemies.forEach(function(e){x.fillStyle='#ef4444';x.fillRect(e.x,e.y,e.w,e.h);x.fillStyle='#000';x.beginPath();x.arc(e.x+15,e.y+20,3,0,6.3);x.fill();x.beginPath();x.arc(e.x+25,e.y+20,3,0,6.3);x.fill();});x.fillStyle='#a855f7';x.fillRect(wiz.x,wiz.y,wiz.w,wiz.h);x.fillStyle='#facc15';x.beginPath();x.moveTo(wiz.x+20,wiz.y-15);x.lineTo(wiz.x+5,wiz.y+5);x.lineTo(wiz.x+35,wiz.y+5);x.closePath();x.fill();}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key===' ')cast();});
c.addEventListener('click',cast);
rst();
`, "wizard-magic");
}

function knightDefense(): string {
  return wrap("Chevalier Défense", `
<h1>🛡️ <span>Défense</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>HP : <strong id="hp">100</strong></span></div>
<canvas id="g" width="500" height="500"></canvas>
<div class="controls"><button ontouchstart="atk();event.preventDefault()" onclick="atk()" style="width:180px;background:#22c55e;color:#fff">FRAPPER</button></div>
<div class="overlay" id="ov"><h2>Mort !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var kn,enemies,sc,hp,ov,loop,t;
function init(){kn={x:W/2-20,y:H-80,w:40,h:60};enemies=[];sc=0;hp=100;ov=false;t=0;document.getElementById('score').textContent='0';document.getElementById('hp').textContent='100';document.getElementById('ov').classList.remove('show');}
function atk(){if(ov)return;enemies.forEach(function(e){if(Math.abs(e.x-kn.x)<80&&e.y>kn.y-80){e.hp-=2;if(e.hp<=0){e.dead=true;sc+=30;document.getElementById('score').textContent=sc;}}});enemies=enemies.filter(function(e){return !e.dead;});}
window.atk=atk;
function upd(){t++;if(t%50===0)enemies.push({x:Math.random()*(W-40),y:-40,w:40,h:40,hp:3,vy:0.8});enemies.forEach(function(e){e.y+=e.vy;});enemies=enemies.filter(function(e){return e.y<H+30;});enemies.forEach(function(e){if(e.y+e.h>kn.y){hp-=5;document.getElementById('hp').textContent=hp;e.dead=true;if(hp<=0){ov=true;document.getElementById('ov').classList.add('show');}}});enemies=enemies.filter(function(e){return !e.dead;});}
function draw(){x.fillStyle='#1a1a2a';x.fillRect(0,0,W,H);enemies.forEach(function(e){x.fillStyle='#ef4444';x.fillRect(e.x,e.y,e.w,e.h);x.fillStyle='#fff';x.fillRect(e.x-3,e.y-8,46*(e.hp/3),3);});x.fillStyle='#22c55e';x.fillRect(kn.x,kn.y,kn.w,kn.h);x.fillStyle='#facc15';x.fillRect(kn.x+15,kn.y-10,10,20);}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key===' ')atk();});
c.addEventListener('click',atk);
rst();
`, "knight-defense");
}

function wizardTower(): string {
  return wrap("Tour du Magicien", `
<h1>🗼 <span>Tour Magicien</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong></span><span>Vies : <strong id="lives">10</strong></span></div>
<canvas id="g" width="500" height="500"></canvas>
<div class="controls"><button ontouchstart="mv(-1);event.preventDefault()" onclick="mv(-1)">←</button><button ontouchstart="sh();event.preventDefault()" onclick="sh()">SORT</button><button ontouchstart="mv(1);event.preventDefault()" onclick="mv(1)">→</button></div>
<div class="overlay" id="ov"><h2>Terminé</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var c=document.getElementById('g'),x=c.getContext('2d'),W=c.width,H=c.height;
var wiz,bullets,enemies,sc,lv,ov,loop,t;
function init(){wiz={x:W/2-20,y:H-60,w:40,h:40};bullets=[];enemies=[];sc=0;lv=10;ov=false;t=0;document.getElementById('score').textContent='0';document.getElementById('lives').textContent='10';document.getElementById('ov').classList.remove('show');}
function mv(d){wiz.x+=d*25;wiz.x=Math.max(0,Math.min(W-wiz.w,wiz.x));}
function sh(){if(ov)return;bullets.push({x:wiz.x+wiz.w/2,y:wiz.y,vy:-10});}
window.mv=mv;window.sh=sh;
function upd(){t++;if(t%70===0)enemies.push({x:Math.random()*(W-40),y:-40,w:40,h:40,hp:2,vy:1.5});bullets.forEach(function(b){b.y+=b.vy;});bullets=bullets.filter(function(b){return b.y>0;});enemies.forEach(function(e){e.y+=e.vy;});bullets.forEach(function(b){enemies.forEach(function(e){if(e.hp<=0)return;if(Math.hypot(b.x-e.x-20,b.y-e.y-20)<20){e.hp--;b.y=-100;if(e.hp<=0){sc+=20;document.getElementById('score').textContent=sc;}}});});bullets=bullets.filter(function(b){return b.y>0;});enemies=enemies.filter(function(e){return e.hp>0&&e.y<H+30;});enemies.forEach(function(e){if(e.y+e.h>wiz.y){lv--;document.getElementById('lives').textContent=lv;e.hp=0;if(lv<=0){ov=true;document.getElementById('ov').classList.add('show');}}});enemies=enemies.filter(function(e){return e.hp>0;});}
function draw(){x.fillStyle='#0a0a2a';x.fillRect(0,0,W,H);x.fillStyle='#a855f7';x.fillRect(wiz.x,wiz.y,wiz.w,wiz.h);x.fillStyle='#facc15';bullets.forEach(function(b){x.fillRect(b.x-3,b.y,6,8);});enemies.forEach(function(e){x.fillStyle='#ef4444';x.fillRect(e.x,e.y,e.w,e.h);x.fillStyle='#fff';x.fillRect(e.x-3,e.y-8,46*(e.hp/2),3);});}
function tick(){if(!ov)upd();draw();}
function rst(){init();if(loop)clearInterval(loop);loop=setInterval(tick,16);}
window.rst=rst;
document.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')mv(-1);if(e.key==='ArrowRight')mv(1);if(e.key===' ')sh();});
rst();
`, "wizard-tower");
}

function memoryIcons4(): string {
  return wrap("Memory Animaux", `
<h1>🦁 <span>Memory Animaux</span></h1>
<div class="stats"><span>Paires : <strong id="p">0</strong>/8</span></div>
<div id="bd" style="display:grid;grid-template-columns:repeat(4,min(70px,18vw));gap:8px;background:#1a1a1a;padding:12px;border-radius:12px;border:2px solid #f59e0b"></div>
<div class="overlay" id="ov"><h2>🎉 Bravo !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var ICO=['🦁','🐯','🐘','🦒','🦓','🐆','🐅','🦏'],f,s,lock,mat,cds;
function init(){cds=ICO.concat(ICO).sort(function(){return Math.random()-0.5;});f=null;s=null;lock=false;mat=0;document.getElementById('p').textContent='0';document.getElementById('ov').classList.remove('show');render();}
function render(){var b=document.getElementById('bd');b.innerHTML='';cds.forEach(function(e,i){var cc=document.createElement('div');cc.style.cssText='width:100%;aspect-ratio:1;background:#2a2a2a;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:clamp(20px,5vw,32px);cursor:pointer';cc.textContent='?';cc.dataset.idx=i;cc.dataset.em=e;cc.onclick=function(){flip(i,cc);};b.appendChild(cc);});}
function flip(i,cc){if(lock||cc.dataset.m==='1'||cc.textContent!=='?')return;cc.textContent=cc.dataset.em;cc.style.background='#f59e0b';if(f===null){f=i;return;}if(s===null){s=i;lock=true;var c1=document.querySelector('[data-idx="'+f+'"]'),c2=cc;if(c1.dataset.em===c2.dataset.em){c1.dataset.m='1';c2.dataset.m='1';c1.style.background='#22c55e';c2.style.background='#22c55e';mat++;document.getElementById('p').textContent=mat;f=null;s=null;lock=false;if(mat===8)setTimeout(function(){document.getElementById('ov').classList.add('show');},300);}else{setTimeout(function(){c1.textContent='?';c1.style.background='#2a2a2a';c2.textContent='?';c2.style.background='#2a2a2a';f=null;s=null;lock=false;},800);}}}
function rst(){init();}
window.rst=rst;init();
`, "memory-animaux4");
}

function memoryLuxe(): string {
  return wrap("Memory Luxe", `
<h1>💎 <span>Memory Luxe</span></h1>
<div class="stats"><span>Paires : <strong id="p">0</strong>/6</span></div>
<div id="bd" style="display:grid;grid-template-columns:repeat(4,min(70px,18vw));gap:8px;background:#1a1a1a;padding:12px;border-radius:12px;border:2px solid #d4af37"></div>
<div class="overlay" id="ov"><h2>🎉 Bravo !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var ICO=['💎','👑','💍','⌚','👜','💰'],f,s,lock,mat,cds;
function init(){cds=ICO.concat(ICO).sort(function(){return Math.random()-0.5;});f=null;s=null;lock=false;mat=0;document.getElementById('p').textContent='0';document.getElementById('ov').classList.remove('show');render();}
function render(){var b=document.getElementById('bd');b.innerHTML='';cds.forEach(function(e,i){var cc=document.createElement('div');cc.style.cssText='width:100%;aspect-ratio:1;background:#2a2a2a;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:clamp(20px,5vw,32px);cursor:pointer';cc.textContent='?';cc.dataset.idx=i;cc.dataset.em=e;cc.onclick=function(){flip(i,cc);};b.appendChild(cc);});}
function flip(i,cc){if(lock||cc.dataset.m==='1'||cc.textContent!=='?')return;cc.textContent=cc.dataset.em;cc.style.background='#d4af37';if(f===null){f=i;return;}if(s===null){s=i;lock=true;var c1=document.querySelector('[data-idx="'+f+'"]'),c2=cc;if(c1.dataset.em===c2.dataset.em){c1.dataset.m='1';c2.dataset.m='1';c1.style.background='#22c55e';c2.style.background='#22c55e';mat++;document.getElementById('p').textContent=mat;f=null;s=null;lock=false;if(mat===6)setTimeout(function(){document.getElementById('ov').classList.add('show');},300);}else{setTimeout(function(){c1.textContent='?';c1.style.background='#2a2a2a';c2.textContent='?';c2.style.background='#2a2a2a';f=null;s=null;lock=false;},800);}}}
function rst(){init();}
window.rst=rst;init();
`, "memory-luxe");
}

function memoryEmoji7(): string {
  return wrap("Memory Fêtes", `
<h1>🎉 <span>Memory Fêtes</span></h1>
<div class="stats"><span>Paires : <strong id="p">0</strong>/6</span></div>
<div id="bd" style="display:grid;grid-template-columns:repeat(4,min(70px,18vw));gap:8px;background:#1a1a1a;padding:12px;border-radius:12px;border:2px solid #ec4899"></div>
<div class="overlay" id="ov"><h2>🎉 Bravo !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var ICO=['🎉','🎊','🎈','🎁','🎂','🍾'],f,s,lock,mat,cds;
function init(){cds=ICO.concat(ICO).sort(function(){return Math.random()-0.5;});f=null;s=null;lock=false;mat=0;document.getElementById('p').textContent='0';document.getElementById('ov').classList.remove('show');render();}
function render(){var b=document.getElementById('bd');b.innerHTML='';cds.forEach(function(e,i){var cc=document.createElement('div');cc.style.cssText='width:100%;aspect-ratio:1;background:#2a2a2a;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:clamp(20px,5vw,32px);cursor:pointer';cc.textContent='?';cc.dataset.idx=i;cc.dataset.em=e;cc.onclick=function(){flip(i,cc);};b.appendChild(cc);});}
function flip(i,cc){if(lock||cc.dataset.m==='1'||cc.textContent!=='?')return;cc.textContent=cc.dataset.em;cc.style.background='#ec4899';if(f===null){f=i;return;}if(s===null){s=i;lock=true;var c1=document.querySelector('[data-idx="'+f+'"]'),c2=cc;if(c1.dataset.em===c2.dataset.em){c1.dataset.m='1';c2.dataset.m='1';c1.style.background='#22c55e';c2.style.background='#22c55e';mat++;document.getElementById('p').textContent=mat;f=null;s=null;lock=false;if(mat===6)setTimeout(function(){document.getElementById('ov').classList.add('show');},300);}else{setTimeout(function(){c1.textContent='?';c1.style.background='#2a2a2a';c2.textContent='?';c2.style.background='#2a2a2a';f=null;s=null;lock=false;},800);}}}
function rst(){init();}
window.rst=rst;init();
`, "memory-fetes");
}

function memoryEmoji8(): string {
  return wrap("Memory Transport", `
<h1>✈️ <span>Memory Transport</span></h1>
<div class="stats"><span>Paires : <strong id="p">0</strong>/6</span></div>
<div id="bd" style="display:grid;grid-template-columns:repeat(4,min(70px,18vw));gap:8px;background:#1a1a1a;padding:12px;border-radius:12px;border:2px solid #06b6d4"></div>
<div class="overlay" id="ov"><h2>🎉 Bravo !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var ICO=['✈️','🚁','🚀','🚂','🚢','🚌'],f,s,lock,mat,cds;
function init(){cds=ICO.concat(ICO).sort(function(){return Math.random()-0.5;});f=null;s=null;lock=false;mat=0;document.getElementById('p').textContent='0';document.getElementById('ov').classList.remove('show');render();}
function render(){var b=document.getElementById('bd');b.innerHTML='';cds.forEach(function(e,i){var cc=document.createElement('div');cc.style.cssText='width:100%;aspect-ratio:1;background:#2a2a2a;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:clamp(20px,5vw,32px);cursor:pointer';cc.textContent='?';cc.dataset.idx=i;cc.dataset.em=e;cc.onclick=function(){flip(i,cc);};b.appendChild(cc);});}
function flip(i,cc){if(lock||cc.dataset.m==='1'||cc.textContent!=='?')return;cc.textContent=cc.dataset.em;cc.style.background='#06b6d4';if(f===null){f=i;return;}if(s===null){s=i;lock=true;var c1=document.querySelector('[data-idx="'+f+'"]'),c2=cc;if(c1.dataset.em===c2.dataset.em){c1.dataset.m='1';c2.dataset.m='1';c1.style.background='#22c55e';c2.style.background='#22c55e';mat++;document.getElementById('p').textContent=mat;f=null;s=null;lock=false;if(mat===6)setTimeout(function(){document.getElementById('ov').classList.add('show');},300);}else{setTimeout(function(){c1.textContent='?';c1.style.background='#2a2a2a';c2.textContent='?';c2.style.background='#2a2a2a';f=null;s=null;lock=false;},800);}}}
function rst(){init();}
window.rst=rst;init();
`, "memory-transport");
}

function memoryEmoji9(): string {
  return wrap("Memory School", `
<h1>📚 <span>Memory School</span></h1>
<div class="stats"><span>Paires : <strong id="p">0</strong>/6</span></div>
<div id="bd" style="display:grid;grid-template-columns:repeat(4,min(70px,18vw));gap:8px;background:#1a1a1a;padding:12px;border-radius:12px;border:2px solid #8b5cf6"></div>
<div class="overlay" id="ov"><h2>🎉 Bravo !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var ICO=['📚','✏️','📝','📐','🎒','🖊️'],f,s,lock,mat,cds;
function init(){cds=ICO.concat(ICO).sort(function(){return Math.random()-0.5;});f=null;s=null;lock=false;mat=0;document.getElementById('p').textContent='0';document.getElementById('ov').classList.remove('show');render();}
function render(){var b=document.getElementById('bd');b.innerHTML='';cds.forEach(function(e,i){var cc=document.createElement('div');cc.style.cssText='width:100%;aspect-ratio:1;background:#2a2a2a;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:clamp(20px,5vw,32px);cursor:pointer';cc.textContent='?';cc.dataset.idx=i;cc.dataset.em=e;cc.onclick=function(){flip(i,cc);};b.appendChild(cc);});}
function flip(i,cc){if(lock||cc.dataset.m==='1'||cc.textContent!=='?')return;cc.textContent=cc.dataset.em;cc.style.background='#8b5cf6';if(f===null){f=i;return;}if(s===null){s=i;lock=true;var c1=document.querySelector('[data-idx="'+f+'"]'),c2=cc;if(c1.dataset.em===c2.dataset.em){c1.dataset.m='1';c2.dataset.m='1';c1.style.background='#22c55e';c2.style.background='#22c55e';mat++;document.getElementById('p').textContent=mat;f=null;s=null;lock=false;if(mat===6)setTimeout(function(){document.getElementById('ov').classList.add('show');},300);}else{setTimeout(function(){c1.textContent='?';c1.style.background='#2a2a2a';c2.textContent='?';c2.style.background='#2a2a2a';f=null;s=null;lock=false;},800);}}}
function rst(){init();}
window.rst=rst;init();
`, "memory-school");
}

function memoryEmo10(): string {
  return wrap("Memory Space", `
<h1>🚀 <span>Memory Space</span></h1>
<div class="stats"><span>Paires : <strong id="p">0</strong>/6</span></div>
<div id="bd" style="display:grid;grid-template-columns:repeat(4,min(70px,18vw));gap:8px;background:#1a1a1a;padding:12px;border-radius:12px;border:2px solid #0ea5e9"></div>
<div class="overlay" id="ov"><h2>🎉 Bravo !</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var ICO=['🚀','🛸','🌍','🌙','⭐','☀️'],f,s,lock,mat,cds;
function init(){cds=ICO.concat(ICO).sort(function(){return Math.random()-0.5;});f=null;s=null;lock=false;mat=0;document.getElementById('p').textContent='0';document.getElementById('ov').classList.remove('show');render();}
function render(){var b=document.getElementById('bd');b.innerHTML='';cds.forEach(function(e,i){var cc=document.createElement('div');cc.style.cssText='width:100%;aspect-ratio:1;background:#2a2a2a;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:clamp(20px,5vw,32px);cursor:pointer';cc.textContent='?';cc.dataset.idx=i;cc.dataset.em=e;cc.onclick=function(){flip(i,cc);};b.appendChild(cc);});}
function flip(i,cc){if(lock||cc.dataset.m==='1'||cc.textContent!=='?')return;cc.textContent=cc.dataset.em;cc.style.background='#0ea5e9';if(f===null){f=i;return;}if(s===null){s=i;lock=true;var c1=document.querySelector('[data-idx="'+f+'"]'),c2=cc;if(c1.dataset.em===c2.dataset.em){c1.dataset.m='1';c2.dataset.m='1';c1.style.background='#22c55e';c2.style.background='#22c55e';mat++;document.getElementById('p').textContent=mat;f=null;s=null;lock=false;if(mat===6)setTimeout(function(){document.getElementById('ov').classList.add('show');},300);}else{setTimeout(function(){c1.textContent='?';c1.style.background='#2a2a2a';c2.textContent='?';c2.style.background='#2a2a2a';f=null;s=null;lock=false;},800);}}}
function rst(){init();}
window.rst=rst;init();
`, "memory-space");
}

function quizPro(): string {
  return wrap("Quiz Pro", `
<h1>🎓 <span>Quiz Pro</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong>/10</span></div>
<div id="bd" style="background:#1a1a1a;padding:30px;border-radius:12px;border:2px solid #facc15;max-width:500px;min-width:340px"></div>
<div class="overlay" id="ov"><h2 id="ttl">Terminé</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var QS=[
{q:"Capitale du Brésil ?",a:["Rio","Brasília","São Paulo","Salvador"],c:1},
{q:"Année de la 1ère Guerre mondiale ?",a:["1914","1918","1939","1945"],c:0},
{q:"Plus grand pays du monde ?",a:["Canada","Chine","Russie","USA"],c:2},
{q:"Symbole chimique du carbone ?",a:["C","Ca","Co","Cl"],c:0},
{q:"Qui a peint la Joconde ?",a:["Michel-Ange","Raphaël","Léonard de Vinci","Van Gogh"],c:2},
{q:"Plus grand mammifère ?",a:["Éléphant","Baleine bleue","Girafe","Hippopotame"],c:1},
{q:"Combien de touches sur un piano standard ?",a:["66","76","88","96"],c:2},
{q:"Langue la plus parlée ?",a:["Anglais","Mandarin","Espagnol","Hindi"],c:1},
{q:"Sport avec un shuttlecock ?",a:["Tennis","Badminton","Squash","Ping-pong"],c:1},
{q:"Compositeur de la 5e symphonie ?",a:["Mozart","Bach","Beethoven","Chopin"],c:2}
];
var idx,sc,ov;
function init(){idx=0;sc=0;ov=false;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');render();}
function render(){if(idx>=QS.length){ov=true;document.getElementById('ttl').textContent='🎓 Score : '+sc+'/10';document.getElementById('ov').classList.add('show');return;}var q=QS[idx];var h='<p style="color:#fff;font-size:16px;margin-bottom:20px">'+q.q+'</p><div style="display:flex;flex-direction:column;gap:10px">';q.a.forEach(function(a,i){h+='<button ontouchstart="pick('+i+');event.preventDefault()" onclick="pick('+i+')" style="padding:14px;background:#2a2a2a;color:#fff;border:2px solid #3a3a3a;border-radius:10px;cursor:pointer;font-family:inherit;font-weight:700">'+a+'</button>';});h+='</div>';document.getElementById('bd').innerHTML=h;}
function pick(i){if(ov)return;if(i===QS[idx].c){sc++;document.getElementById('score').textContent=sc;}idx++;render();}
function rst(){init();}
window.rst=rst;window.pick=pick;init();
`, "quiz-pro");
}

function quizExpert(): string {
  return wrap("Quiz Expert", `
<h1>🧠 <span>Quiz Expert</span></h1>
<div class="stats"><span>Score : <strong id="score">0</strong>/10</span></div>
<div id="bd" style="background:#1a1a1a;padding:30px;border-radius:12px;border:2px solid #a855f7;max-width:500px;min-width:340px"></div>
<div class="overlay" id="ov"><h2 id="ttl">Terminé</h2><button ontouchstart="rst();event.preventDefault()" onclick="rst()">Rejouer</button></div>
`, `
var QS=[
{q:"Valeur de π (2 décimales) ?",a:["3.14","3.16","3.12","3.18"],c:0},
{q:"Plus long fleuve d'Afrique ?",a:["Congo","Niger","Nil","Zambèze"],c:2},
{q:"Nombre premier après 13 ?",a:["14","15","17","19"],c:2},
{q:"Symbole chimique du potassium ?",a:["P","Po","K","Pt"],c:2},
{q:"Année de la chute du mur ?",a:["1987","1989","1991","1993"],c:1},
{q:"Plus grand désert froid ?",a:["Sahara","Gobi","Antarctique","Arctique"],c:2},
{q:"Nombre de planètes ?",a:["7","8","9","10"],c:1},
{q:"Racine carrée de 144 ?",a:["11","12","13","14"],c:1},
{q:"Auteur de Guerre et Paix ?",a:["Dostoïevski","Tolstoï","Tchekhov","Pouchkine"],c:1},
{q:"Formule de l'eau ?",a:["CO2","H2O","O2","NaCl"],c:1},
{q:"Combien d'os chez l'humain ?",a:["186","206","226","246"],c:1}
];
var idx,sc,ov;
function init(){idx=0;sc=0;ov=false;document.getElementById('score').textContent='0';document.getElementById('ov').classList.remove('show');render();}
function render(){if(idx>=QS.length){ov=true;document.getElementById('ttl').textContent='🧠 Score : '+sc+'/10';document.getElementById('ov').classList.add('show');return;}var q=QS[idx];var h='<p style="color:#fff;font-size:16px;margin-bottom:20px">'+q.q+'</p><div style="display:flex;flex-direction:column;gap:10px">';q.a.forEach(function(a,i){h+='<button ontouchstart="pick('+i+');event.preventDefault()" onclick="pick('+i+')" style="padding:14px;background:#2a2a2a;color:#fff;border:2px solid #3a3a3a;border-radius:10px;cursor:pointer;font-family:inherit;font-weight:700">'+a+'</button>';});h+='</div>';document.getElementById('bd').innerHTML=h;}
function pick(i){if(ov)return;if(i===QS[idx].c){sc++;document.getElementById('score').textContent=sc;}idx++;render();}
function rst(){init();}
window.rst=rst;window.pick=pick;init();
`, "quiz-expert");
}
// ═══════════════════════════════════════════════════════════════
// DISPATCHER FINAL
// ═══════════════════════════════════════════════════════════════

export function getExtraGameTemplate(gameId: string): string | null {
  switch (gameId) {
    case "pacman-simple": return pacman();
    case "galaga": return galaga();
    case "frogger": return frogger();
    case "centipede": return centipede();
    case "missile-command": return missile();
    case "defender": return defender();
    case "dig-dug": return digdug();
    case "qbert": return qbert();
    case "joust": return joust();
    case "bomberman": return bomberman();

    case "blackjack": return blackjack();
    case "solitaire": return solitaire();
    case "dames": return dames();
    case "reversi": return reversi();
    case "yam": return yams();
    case "memory-cards": return memoryCards();
    case "bataille-navale": return batailleNavale();
    case "uno-simple": return uno();
    case "pierre-feuille-ciseaux": return pfc();
    case "devine-nombre": return devineNombre();

    case "endless-runner": return endlessRunner();
    case "jetpack": return jetpack();
    case "gravity-runner": return gravityRunner();
    case "sky-jump": return skyJump();
    case "ninja-jump": return ninjaJump();
    case "bounce": return bounce();
    case "temple-run": return templeRun();
    case "mario-clone": return marioLike();
    case "wall-runner": return wallRunner();
    case "cave-run": return caveRun();

    case "space-shooter": return spaceShooter();
    case "tank-shooter": return tankShooter();
    case "zombie-shooter": return zombieShooter();
    case "bullet-hell": return bulletHell();
    case "plane-shooter": return planeShooter();
    case "helicopter-game": return helicopter();
    case "submarine-shooter": return submarine();
    case "meteor-shower": return meteorShower();
    case "crossy-road": return crossyRoad();
    case "duck-hunt": return duckHunt();

    case "hangman-english": return hangmanEn();
    case "code-breaker": return codeBreaker();
    case "math-quiz": return quizMaths();
    case "memory-numbers": return memoryNumbers();
    case "typing-game": return typingGame();
    case "reaction-test": return reactionTest();
    case "brain-training": return brainTraining();
    case "iq-test": return iqTest();
    case "juste-prix": return justePrix();
    case "chess-puzzle": return chessPuzzle();

    case "tower-defense": return towerDefense();
    case "survivors": return survivors();
    case "arena-fighter": return arenaFighter();
    case "dungeon-crawler": return dungeon();
    case "roguelike": return roguelike();
    case "top-down-rpg": return rpgTopDown();
    case "ninja-game": return ninjaGame();
    case "knight-fight": return knightFight();
    case "samurai": return samurai();
    case "brawler": return brawler();

    case "tycoon-clicker": return clickerTycoon();
    case "idle-game": return idleGame();
    case "farm-sim": return ferme();
    case "restaurant-sim": return restaurant();
    case "aquarium-sim": return aquarium();
    case "city-builder": return ville();
    case "hospital-sim": return hopital();
    case "airport-sim": return aeroport();
    case "stock-market": return bourse();
    case "startup-tycoon": return startupTycoon();

    case "musique": return piano();
    case "guitares": return guitare();
    case "instruments": return batterie();
    case "music-memory": return musicMemory();
    case "voyage": return voyage();
    case "livres": return livres();
    case "papeterie": return papeterie();
    case "cooking-game": return cuisine();
    case "delivery-game": return livreur();
    case "flight-sim": return flightSim();
    // Paquet 9 : Sports, Racing, Puzzle+
    case "penalty": return penalty();
    case "basket": return basket();
    case "kart": return kartRacing();
    case "burger": return burgerTime();
    case "bomber": return bomberman2();
    case "snake-vs-ia": return snakeVsIA();
    case "maze": return maze();
    case "memory-emoji": return memoryEmoji();
    case "pinball": return pinball();
    case "cowboy": return cowboy();
    case "soccer": return soccer();
    case "poker": return poker();
    case "galaxian": return galaxian();
    case "word-search": return wordSearch();
    case "fruit": return fruit();
    case "temporel": return temporel();
    case "combat": return combat();
    case "rpg-adventure": return rpgAdventure();
    case "jetpack2": return jetpack2();
    case "platformer2": return platformer2();
    case "tower2": return towerDefense2();
    case "vampire": return vampire();
           // Paquet 10
    case "asteroids2": return asteroids2();
    case "tank2": return tank2();
    case "tigerheli": return tigerHeli();
    case "ivan": return ivan();
    case "firefighter": return firefighter();
    case "pirate": return pirateGame();
    case "space-explorer": return spaceExplorer();
    case "zombie-survival": return zombieSurvival();
    case "snakes-ladders": return snakesLadders();
    case "uno2": return uno2();
    case "yatzy": return yatzy();
    case "memory-colors": return memoryColors();
    case "speed-click": return speedClick();
    case "color-match": return colorMatch();
    case "whack-a-mole": return whackAMole();
    case "simon-colors": return simonColors();
    case "bingo": return bingo();
    case "slot": return slotMachine();
    case "dice-roll": return diceRoll();
    case "target-shoot": return targetShoot();
    case "escape-room": return escapeRoom();
    case "riddles": return riddleGame();
    case "simon-sound": return simonSound();
    case "reaction-colors": return reactionColors();
    case "memory-icons": return memoryIcons();
    case "find-diff": return findDiff();
    case "simon6": return simon6();
    case "simon-fast": return simonFast();
    case "memory-fast": return memoryFast();
    case "memory-animals2": return memoryIcons2();
    case "typing-fast": return typingFast();
        // Paquet 11
    case "crystal": return crystal();
    case "blocs": return blocs();
    case "simon-pro": return simonPro();
    case "quadruple": return quadruple();
    case "mots-croises": return motsCroises();
    case "hangman-fr": return hangmanFr();
    case "simon-big": return simonBig();
    case "quiz-science": return quizScience();
    case "quiz-geo": return quizGeo();
    case "quiz-histoire": return quizHistoire();
    case "quiz-sport": return quizSport();
    case "quiz-cinema": return quizCinema();
    case "quiz-musique": return quizMusique();
    case "quiz-animaux": return quizAnimaux();
    case "quiz-bizarre": return quizBizarre();
    case "quiz-math2": return quizMath2();
    case "find-pair": return findPair();
    case "count-clicks": return countClicks();
    case "stop-chrono": return stopChrono();
    case "click-battle": return clickBattle();
    case "cricket": return handCricket();
    case "guess-color": return guessColor();
    case "simon-speed": return simonSpeed();
    case "memory-position": return memoryPosition();
    case "memory-sequence": return memorySequence();
    case "find-letter": return findLetter();
    case "word-chain": return wordChain();
    case "anagram": return anagram();
    case "count-words": return countWords();
    case "typing-words": return typingWords();
    case "speed-math": return speedMath();
        // Paquet 12
    case "space-war": return spaceWar();
    case "laser": return laser();
    case "bubbles": return bubbles();
    case "fruit-ninja": return fruitNinja();
    case "minesweeper-plus": return minesweeperPlus();
    case "tetris-plus": return tetrisPlus();
    case "match4": return match4();
    case "bejeweled": return bejeweled();
    case "lights-out": return lightsOut();
    case "pipe-dream": return pipedream();
    case "hexagon": return hexagon();
    case "jigsaw": return jigsaw();
    case "number-sort": return numberSort();
    case "chess-puzzle2": return chessPuzzle2();
    case "checkers2": return checkers2();
    case "go-simple": return go();
    case "damier": return damier();
    case "maze-escape": return mazeEscape();
    case "tunnel": return tunnel();
    case "neon-runner": return neonRunner();
    case "zigzag": return zigzag();
    case "stacking": return stacking();
    case "towers": return towers();
    case "ball-bounce": return ballBounce();
    case "arkanoid": return arkanoid();
    case "pinball2": return pinball2();
    case "bomb-defuse": return bombDefuse();
    case "safe-crack": return safeCrack();
    case "typing-race": return typingRace();
    case "cryptarithm": return cryptarithm();
    case "flash-card": return flashCard();
    case "guess-word": return guessWord();
    case "wordle": return wordle();
        // Paquet 13
    case "backgammon": return backgammon();
    case "tennis": return tennis();
    case "volleyball": return volleyball();
    case "golf": return golf();
    case "hockey": return hockey();
    case "bowling": return bowling();
    case "dart": return dart();
    case "air-hockey": return airHockey();
    case "sumo": return sumo();
    case "boxing": return boxing();
    case "rally": return rally();
    case "drag-race": return dragRace();
    case "monster-truck": return monsterTruck();
    case "f1-race": return f1Race();
    case "moto-race": return motoRace();
    case "boat-race": return boatRace();
    case "submarine2": return submarine2();
    case "helicopter-race": return helicopterRace();
    case "moon-lander": return moonLander();
    case "space-dodge": return spaceDodge();
    case "cave-flight": return caveFlight();
    case "parkour": return parkour();
    case "dodgeball": return dodgeball();
    case "tank-battle2": return tankBattle2();
    case "snowboard": return snowboard();
    case "skateboard": return skateboard();
    case "bmx": return bmx();
    case "motocross": return motocross();
    case "trampoline": return trampoline();
    case "wall-climb": return wallClimb();
    case "diving": return diving();
    case "surfing": return surfing();
    case "parachute": return parachute();
    case "zip-line": return zipLine();
        // Paquet 14
    case "echecs-simple": return echecsSimple();
    case "solitaire-plus": return solitaire2();
    case "rami": return rami();
    case "loto": return loto();
    case "keno": return keno();
    case "roulette": return roulette();
    case "blackjack2": return blackjack2();
    case "poker2": return poker2();
    case "dame-pique": return dameDePique();
    case "belote": return belote();
    case "tarot": return tarot();
    case "uno-pro": return unoPro();
    case "baccarat": return baccarat();
    case "craps": return craps();
    case "des-destin": return desY();
    case "memory-formules": return memoryFormula();
    case "memory-fruits": return memoryEmoji2();
    case "memory-flags": return memoryFlags();
    case "memory-sports": return memorySports();
    case "memory-visages": return memoryEmoji3();
    case "quiz-bleu": return quizBleu();
    case "quiz-enfant": return quizFacile();
    case "memory-legumes": return memoryFruits();
    case "memory-voitures": return memoryCars();
    case "memory-planets": return memoryPlanets();
    case "memory-ocean": return memoryAnimals3();
    case "memory-instruments": return memoryInstrument();
    case "memory-emotions": return memoryEmo();
    case "memory-meteo": return memoryEmo2();
    case "memory-nourriture": return memoryEmo3();
    case "memory-vetements": return memoryEmo4();
    case "memory-metiers": return memoryEmo5();
        // Paquet 15
    case "doodle2": return doodleJump2();
    case "ninja-run": return ninjaRun();
    case "jump-power": return jumpPower();
    case "wall-jump": return wallJump();
    case "spaceship2": return spaceship2();
    case "meteor2": return meteor2();
    case "dodge-cars": return dodgeCars();
    case "jumping-ball": return jumpingBall();
    case "rocket-landing": return rocketLanding();
    case "asteroid3": return asteroid3();
    case "tank-shooter2": return tankShooter2();
    case "spider-web": return spiderWeb();
    case "vampire2": return vampireAttack();
    case "zombie2": return zombieAttack();
    case "galaxy": return galaxy();
    case "snake-duel": return snakeVsSnake();
    case "pong4": return pong4();
    case "invaders2": return spaceInvaders2();
    case "pong3": return pong3();
    case "tetris3": return tetris3();
    case "arkanoid2": return arkanoid2();
    case "pong-pro2": return pongPro2();
    case "snake-pro2": return snakePro2();
    case "pong-classic2": return pongClassic2();
    case "snake-big2": return snakeBig2();
    case "tetris4": return tetris4();
    case "snake-classic3": return snakeClassic3();
        // Paquet 16
    case "cookie-clicker": return cookieClicker();
    case "mine-clicker": return mineClicker();
    case "pizza-tycoon": return pizzaTycoon();
    case "space-tycoon": return spaceTycoon();
    case "aquarium-tycoon": return aquariumTycoon();
    case "farm-tycoon": return farmTycoon();
    case "crypto-clicker": return cryptoClicker();
    case "hospital2": return hospitalSim2();
    case "restaurant2": return restaurant2();
    case "bakery": return bakerySim();
    case "gym-sim": return gymSim();
    case "pet-shop": return petShop();
    case "bookstore": return bookstoreSim();
    case "flower-shop": return flowerShop();
    case "coffee-shop": return coffeeShop();
    case "car-wash": return carWash();
    case "hotel-sim": return hotelSim();
    case "parking-game": return parkingGame();
    case "truck-delivery": return truckDelivery();
    case "fire-truck": return fireTruck();
    case "ambulance": return ambulance();
    case "police-car": return policeCar();
    case "taxi-driver": return taxiDriver();
    case "boat-rescue": return boatRescue();
    case "fishing-game": return fishingGame();
    case "hunting-game": return huntingGame();
    case "fly-swatter": return flySwatter();
    case "bug-squash": return bugSquash();
    case "fruit-slice": return fruitSlice();
    case "balloon-pop": return balloonPop();
    case "bubble-wrap": return bubbleWrap();
    case "typing-race2": return speedTyping2();
    case "math-rapide": return quickMath2();
    case "chrono2": return speedChrono2();
    case "memory-tech": return memoryIcons3();
    case "memory-vehicules2": return memoryCars2();
    case "memory-nature": return memoryNature();
    case "memory-boissons": return memoryEmo6();
        // Paquet 17
    case "cow-run": return cowRun();
    case "chicken-run": return chickenRun();
    case "pig-jump": return pigJump();
    case "duck-run": return duckRun();
    case "dino-run": return dinoRun();
    case "cat-jump": return catJump();
    case "dog-jump": return dogJump();
    case "rabbit-jump": return rabbitJump();
    case "frog-jump": return frogJump();
    case "bear-jump": return bearJump();
    case "penguin-jump": return penguinJump();
    case "koala-jump": return koalaJump();
    case "panda-jump": return pandaJump();
    case "snake-arena": return snakeArena();
    case "tetris5": return tetrisClassic5();
    case "tetris6": return tetrisClassic6();
    case "space-runner": return spaceRunner();
    case "zombie-runner": return zombieRunner();
    case "ghost-runner": return ghostRunner();
    case "dragon-flight": return dragonFlight();
    case "wizard-magic": return wizardMagic();
    case "knight-defense": return knightDefense();
    case "wizard-tower": return wizardTower();
    case "memory-animaux4": return memoryIcons4();
    case "memory-luxe": return memoryLuxe();
    case "memory-fetes": return memoryEmoji7();
    case "memory-transport": return memoryEmoji8();
    case "memory-school": return memoryEmoji9();
    case "memory-space": return memoryEmo10();
    case "quiz-pro": return quizPro();
    case "quiz-expert": return quizExpert();
    default: return null;
  }
   
  
}