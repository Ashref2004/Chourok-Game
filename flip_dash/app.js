// Flip & Dash - simple shape gate game
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const flipBtn = document.getElementById('flipBtn');
const restartBtn = document.getElementById('restartBtn');
const scoreEl = document.getElementById('score');

let width = canvas.width, height = canvas.height;
let player = {x:60,y:height/2,size:28,shape:'circle',vy:0};
let gravity = 0.8;
let gates = [];
let frame = 0;
let score = 0;
let alive = true;

function spawnGate(){
  const gateTypes = ['circle','square','triangle'];
  const type = gateTypes[Math.floor(Math.random()*gateTypes.length)];
  const gapY = 50 + Math.random()*(height-120);
  gates.push({x:width+20,y:gapY,type,passed:false});
}
function drawPlayer(){
  ctx.fillStyle='#222';
  if(player.shape==='circle'){
    ctx.beginPath(); ctx.arc(player.x,player.y,player.size/2,0,Math.PI*2); ctx.fill();
  } else if(player.shape==='square'){
    ctx.fillRect(player.x-player.size/2, player.y-player.size/2, player.size, player.size);
  } else {
    ctx.beginPath(); ctx.moveTo(player.x,player.y-player.size/2); ctx.lineTo(player.x-player.size/2,player.y+player.size/2); ctx.lineTo(player.x+player.size/2,player.y+player.size/2); ctx.closePath(); ctx.fill();
  }
}
function drawGate(g){
  ctx.save();
  ctx.translate(g.x, g.y);
  ctx.fillStyle='#FFCC00';
  if(g.type==='circle'){ ctx.beginPath(); ctx.arc(0,0,22,0,Math.PI*2); ctx.fill(); }
  else if(g.type==='square'){ ctx.fillRect(-20,-20,40,40); }
  else { ctx.beginPath(); ctx.moveTo(0,-24); ctx.lineTo(-24,18); ctx.lineTo(24,18); ctx.closePath(); ctx.fill(); }
  ctx.restore();
}
function update(){
  if(!alive) return;
  frame++;
  // gravity
  player.vy += gravity; player.y += player.vy;
  if(player.y>height-20){ player.y=height-20; player.vy=0; alive=false; msg='Crashed!'; }
  if(player.y<20){ player.y=20; player.vy=0;}
  if(frame%120===0) spawnGate();
  // move gates
  gates.forEach(g=>{ g.x -= 2.5; if(!g.passed && g.x < player.x){ if(g.type===player.shape) score++; g.passed=true; scoreEl.textContent='Score: '+score; }});
  // collision simple (if gate near player and types differ -> crash)
  gates.forEach(g=>{
    if(Math.abs(g.x-player.x)<40 && g.type!==player.shape){ alive=false; }
  });
  // cleanup
  gates = gates.filter(g=>g.x>-50);
}
function render(){
  ctx.clearRect(0,0,width,height);
  // ground
  ctx.fillStyle='#9AD3FF'; ctx.fillRect(0,height-16,width,16);
  drawPlayer();
  gates.forEach(drawGate);
}
function loop(){
  update(); render();
  if(alive) requestAnimationFrame(loop);
  else { ctx.fillStyle='rgba(0,0,0,0.5)'; ctx.fillRect(0,0,width,height); ctx.fillStyle='white'; ctx.font='20px sans-serif'; ctx.fillText('Game Over — Restart to play again',20,height/2); }
}
canvas.addEventListener('click', ()=>{ player.vy = -8; });
flipBtn.onclick = ()=>{ 
  const shapes = ['circle','square','triangle'];
  const i = shapes.indexOf(player.shape);
  player.shape = shapes[(i+1)%shapes.length];
};
restartBtn.onclick = ()=>{ player = {x:60,y:height/2,size:28,shape:'circle',vy:0}; gates=[]; frame=0; score=0; alive=true; scoreEl.textContent='Score: 0'; loop(); };

loop();
