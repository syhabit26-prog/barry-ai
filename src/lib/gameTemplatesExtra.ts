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

    default: return null;
  }
}