/* ============================================
   MESS HALL — mess-hall.js
   ============================================ */

/* CONSTANTS */
const WOTDS = ['hypotenuse','defenestrate','petrichor','callipygian','flibbertigibbet','lollygag','kerfuffle','brouhaha','discombobulate','hullabaloo'];
const DRAW_COLORS = ['#000000','#ff6d00','#ffbc00','#4dad2a','#39a1ff','#ab79db','#ef4136','#fefff4'];
const STAMPS  = ['★','♥','✦','☀','♪','😂','🔥','✌','👾','🌈','⚡','🎉'];
const PROMPTS = ['a cat floating in space','your pet as a superhero','a potato with feelings','the concept of Monday','a dragon eating pizza','your most chaotic thought','a cloud with opinions','a very important snail'];

const TOPICS = [
  { name:'fantasy',      title:'"the chosen one"',     t:"The {adjective} wizard pointed at me and said I was destined to {verb} the entire kingdom of {place}. My only weapon was a {noun}. The dragon took one look at me and {past verb} immediately. Legend.", f:[{l:'an adjective',k:'adjective'},{l:'a verb',k:'verb'},{l:'a place',k:'place'},{l:'a noun',k:'noun'},{l:'past tense verb',k:'past verb'}] },
  { name:'romance',      title:'"love at first sight"', t:"It was a {adjective} evening when I first saw them across the {place}. My {body part} skipped a beat. They were holding a {noun}, which I found incredibly attractive. I walked over and said \"You look like a {animal}\" — and somehow, it worked.", f:[{l:'an adjective',k:'adjective'},{l:'a place',k:'place'},{l:'body part',k:'body part'},{l:'a noun',k:'noun'},{l:'an animal',k:'animal'}] },
  { name:'vacation',     title:'"family trip"',         t:"We arrived in {place} with nothing but a {noun} and a dream. The locals spoke entirely in {plural noun}. On day two we accidentally joined a {adjective} parade and won first place. We have not been allowed back since.", f:[{l:'a place',k:'place'},{l:'a noun',k:'noun'},{l:'plural noun',k:'plural noun'},{l:'an adjective',k:'adjective'}] },
  { name:'recipe',       title:'"a dish best served weird"', t:"Preheat your oven to {number} degrees. Combine {plural noun} with a generous handful of {plural noun 2}. Stir until {adjective}. Bake for {number 2} minutes. Serves {number 3} confused people.", f:[{l:'a number',k:'number'},{l:'plural noun',k:'plural noun'},{l:'plural noun 2',k:'plural noun 2'},{l:'an adjective',k:'adjective'},{l:'another number',k:'number 2'},{l:'another number',k:'number 3'}] },
  { name:'sci-fi',       title:'"unlikely visitors"',   t:"The spaceship landed in my {place} on a {adjective} morning. The alien stepped out, looked me dead in the eye, and handed me a {noun}. Using my {body part}, I attempted to communicate. They {past verb} and flew away. Earth was saved. Somehow.", f:[{l:'a place',k:'place'},{l:'an adjective',k:'adjective'},{l:'a noun',k:'noun'},{l:'body part',k:'body part'},{l:'past tense verb',k:'past verb'}] },
  { name:'breaking news',title:'"breaking news"',       t:"Breaking: Local {job title} refuses to stop {verb}ing despite {number} warnings from the {adjective} {authority}. Witnesses describe the scene as {adjective 2}. The {job title} had only this to say: {quote}.", f:[{l:'job title',k:'job title'},{l:'a verb',k:'verb'},{l:'a number',k:'number'},{l:'an adjective',k:'adjective'},{l:'an authority',k:'authority'},{l:'another adjective',k:'adjective 2'},{l:'a quote',k:'quote'}] }
];

const EXAMPLES = [
  { topic:'fantasy',  title:'"the chosen one"',    text:'The <strong>soggy</strong> wizard pointed at me and said I was destined to <strong>moonwalk</strong> across the entire kingdom of <strong>Cincinnati</strong>. My only weapon was a <strong>butterknife</strong>. The dragon took one look at me and <strong>sneezed</strong> immediately. Legend.' },
  { topic:'vacation', title:'"family trip"',        text:'We arrived in <strong>a Denny\'s parking lot</strong> with nothing but a <strong>spatula</strong> and a dream. The locals spoke entirely in <strong>honks</strong>. On day two we accidentally joined a <strong>moist</strong> parade. We have not been allowed back since.' },
  { topic:'sci-fi',   title:'"unlikely visitors"',  text:'The spaceship landed in my <strong>backyard</strong> on a <strong>damp</strong> morning. The alien handed me a <strong>kazoo</strong>. Using my <strong>chin</strong>, I attempted to communicate. They <strong>giggled</strong> and flew away. Earth was saved. Somehow.' }
];

const COMM_CARDS = [
  { text:'"this is me after my mom lets me have ice cream"', author:'— lyra, 8', bg:'hm-deco-text-container-01.svg' },
  { text:'"this is the ice cream my mom lets me have"',     author:'— dylan, 34', bg:'hm-deco-text-container-02.svg' },
  { text:'"I got a little extra... \nfangirling!"',         author:'— anonymous', bg:'hm-deco-text-container-03.svg' }
];

/* TOAST */
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.style.opacity = '1';
  setTimeout(() => t.style.opacity = '0', 3000);
}

/* ============================================
   WORD OF THE DAY
   ============================================ */
document.getElementById('wotdWord').textContent = WOTDS[Math.floor(Math.random() * WOTDS.length)];

/* ============================================
   ADLIBS
   ============================================ */
let curTopic = TOPICS.find(t => t.name === 'romance') || TOPICS[0];

/* topic label clicks */
document.querySelectorAll('.adlibs__tl').forEach(el => {
  el.addEventListener('click', () => {
    document.querySelectorAll('.adlibs__tl').forEach(x => x.classList.remove('adlibs__tl--active'));
    el.classList.add('adlibs__tl--active');
    const found = TOPICS.find(t => t.name === el.textContent.trim());
    if (found) { curTopic = found; buildForm(); }
  });
});

/* random topic */
document.getElementById('randomTopic').addEventListener('click', () => {
  const i = Math.floor(Math.random() * TOPICS.length);
  curTopic = TOPICS[i];
  document.querySelectorAll('.adlibs__tl').forEach((el, j) => {
    el.classList.toggle('adlibs__tl--active', el.textContent.trim() === curTopic.name);
  });
  buildForm();
});
document.getElementById('randomizeBtn').addEventListener('click', () => {
  document.getElementById('randomTopic').click();
});

function buildForm() {
  const f = document.getElementById('adlibForm');
  f.innerHTML = '';
  document.getElementById('storyResult').style.display  = 'none';
  document.getElementById('saveStoryBtn').style.display = 'none';

  curTopic.f.forEach((field, i) => {
    const row = document.createElement('div');
    row.className = 'adlibs__input-row';

    const lbl = document.createElement('div');
    lbl.className = 'adlibs__input-label';
    lbl.innerHTML = `<strong>${field.k}</strong> <span style="color:#aaa">${field.l}</span>`;

    const wrap = document.createElement('div');
    wrap.className = 'adlibs__input-wrap';

    const bg = document.createElement('img');
    bg.src = 'hm-deco-text-field-container-01.svg';
    bg.alt = ''; bg.setAttribute('aria-hidden','true');

    const inp = document.createElement('input');
    inp.type = 'text';
    inp.dataset.key = field.k;
    inp.placeholder = 'type anything...';
    inp.setAttribute('aria-label', field.l);

    wrap.appendChild(bg); wrap.appendChild(inp);
    row.appendChild(lbl); row.appendChild(wrap);
    f.appendChild(row);
  });
}

document.getElementById('clearAdlib').addEventListener('click', () => {
  document.querySelectorAll('#adlibForm input').forEach(i => i.value = '');
});

document.getElementById('revealBtn').addEventListener('click', () => {
  let result = curTopic.t;
  document.querySelectorAll('#adlibForm input').forEach(inp => {
    const val = inp.value.trim() || '[???]';
    result = result.replace(new RegExp(`\\{${inp.dataset.key}\\}`, 'g'), `<strong>${val}</strong>`);
  });
  const el = document.getElementById('storyResult');
  document.getElementById('resultTitle').textContent = curTopic.title;
  document.getElementById('resultText').innerHTML = result;
  el.style.display = 'block';
  document.getElementById('saveStoryBtn').style.display = 'inline-flex';
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

document.getElementById('saveStoryBtn').addEventListener('click', () => toast('story saved to collection'));

/* example cards */
const cardsEl = document.getElementById('storyCards');
EXAMPLES.forEach((e, i) => {
  const card = document.createElement('div');
  card.className = 'adlibs__card';
  const inner = document.createElement('div');
  inner.className = 'adlibs__card-inner';
  inner.innerHTML = `<div class="adlibs__card-topic">${e.topic}</div><div class="adlibs__card-title">${e.title}</div><div class="adlibs__card-text">${e.text}</div>`;
  card.appendChild(inner);
  cardsEl.appendChild(card);
});

/* community cards */
const commEl = document.getElementById('communityCards');
COMM_CARDS.forEach((c, i) => {
  const card = document.createElement('div');
  card.className = 'community-card';
  const inner = document.createElement('div');
  inner.className = 'cc-inner';
  inner.innerHTML = `<p class="cc-text">${c.text}</p><p class="cc-author">${c.author}</p>`;
  card.appendChild(inner);
  commEl.appendChild(card);
});

buildForm();

/* ============================================
   MUSIC BOX
   ============================================ */
const ROWS = 7, COLS = 16;
const NOTE_NAMES = ['C','B','A','G','E','D','C'];
const FREQS = {
  piano:[523,494,440,392,349,330,294],
  quack:[900,800,750,850,700,950,820],
  fart: [80, 70, 65, 60, 75, 68, 72 ],
  boing:[400,350,300,450,380,420,360],
  meow: [600,550,500,650,480,520,560]
};
let grid=[], isPlaying=false, isLooping=true, playInterval=null, audioCtx=null, noteHist=[];
let curPack = 'quack';

/* sound pack buttons */
const BEAT_NAMES = ['hat','open','snare','clap','kick','tom','bass'];
document.getElementById('soundPacks').addEventListener('click', e => {
  const btn = e.target.closest('.music__pack');
  if (!btn) return;
  document.querySelectorAll('.music__pack').forEach(b => b.classList.remove('music__pack--active'));
  btn.classList.add('music__pack--active');
  curPack = btn.dataset.pack;
  const names = curPack === 'beat' ? BEAT_NAMES : NOTE_NAMES;
  document.querySelectorAll('.music__rlbl').forEach((l, i) => l.textContent = names[i]);
});

/* build grid */
const mgEl = document.getElementById('musicGrid');
for (let r = 0; r < ROWS; r++) {
  const row = document.createElement('div'); row.className = 'music__row';
  const lbl = document.createElement('div'); lbl.className = 'music__rlbl'; lbl.textContent = NOTE_NAMES[r];
  row.appendChild(lbl); grid[r] = [];
  for (let c = 0; c < COLS; c++) {
    const cell = document.createElement('div'); cell.className = 'note-cell';
    cell.addEventListener('click', () => { const was = cell.classList.contains('on'); cell.classList.toggle('on'); noteHist.push({r,c,was}); });
    row.appendChild(cell); grid[r][c] = cell;
  }
  mgEl.appendChild(row);
}

function getACtx() { if (!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)(); return audioCtx; }
function playNote(freq, type) {
  const ac=getACtx(), o=ac.createOscillator(), g=ac.createGain();
  o.connect(g); g.connect(ac.destination);
  o.type=type; o.frequency.value=freq;
  g.gain.setValueAtTime(0.2,ac.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001,ac.currentTime+0.35);
  o.start(); o.stop(ac.currentTime+0.35);
}
function playBeat(row) {
  const ac=getACtx(), now=ac.currentTime;
  function noise(dur,vol,hp) {
    const n=Math.ceil(ac.sampleRate*dur),buf=ac.createBuffer(1,n,ac.sampleRate),d=buf.getChannelData(0);
    for(let i=0;i<n;i++) d[i]=Math.random()*2-1;
    const src=ac.createBufferSource(); src.buffer=buf;
    const g=ac.createGain(); g.gain.setValueAtTime(vol,now); g.gain.exponentialRampToValueAtTime(0.001,now+dur);
    if(hp){const f=ac.createBiquadFilter();f.type='highpass';f.frequency.value=hp;src.connect(f);f.connect(g);}
    else src.connect(g);
    g.connect(ac.destination); src.start(now);
  }
  function kick(f0,f1,dur,vol) {
    const o=ac.createOscillator(),g=ac.createGain(); o.type='sine';
    o.frequency.setValueAtTime(f0,now); o.frequency.exponentialRampToValueAtTime(f1,now+dur);
    g.gain.setValueAtTime(vol,now); g.gain.exponentialRampToValueAtTime(0.001,now+dur);
    o.connect(g); g.connect(ac.destination); o.start(now); o.stop(now+dur);
  }
  if      (row===0) { noise(0.05,0.3,10000); }
  else if (row===1) { noise(0.22,0.25,8000); }
  else if (row===2) { noise(0.15,0.5,1500); kick(200,150,0.08,0.2); }
  else if (row===3) { noise(0.08,0.9,2000); }
  else if (row===4) { kick(160,0.01,0.45,1.0); }
  else if (row===5) { kick(120,0.01,0.3,0.7); }
  else if (row===6) { kick(80,0.01,0.5,0.9); }
}
function playCol(col) {
  if(curPack==='beat'){
    for(let r=0;r<ROWS;r++){if(grid[r][col].classList.contains('on')) playBeat(r);}
    return;
  }
  const freqs=FREQS[curPack]||FREQS.quack;
  const type=curPack==='fart'?'sawtooth':curPack==='boing'?'triangle':'square';
  for (let r=0;r<ROWS;r++) { if(grid[r][col].classList.contains('on')) playNote(freqs[r],type); }
}

document.getElementById('playBtn').addEventListener('click', () => {
  if (isPlaying) { clearInterval(playInterval); isPlaying=false; document.querySelector('#playBtn .svgbtn__text').textContent='play track'; return; }
  isPlaying=true; document.querySelector('#playBtn .svgbtn__text').textContent='stop';
  let col=0;
  playInterval=setInterval(()=>{ playCol(col); col++; if(col>=COLS){ if(isLooping){col=0;}else{clearInterval(playInterval);isPlaying=false;document.querySelector('#playBtn .svgbtn__text').textContent='play track';}}},210);
});

document.getElementById('loopBtn').addEventListener('click', () => {
  isLooping=!isLooping;
  document.querySelector('#loopBtn .svgbtn__text').textContent=isLooping?'loop: on':'loop: off';
});

document.getElementById('resetBtn').addEventListener('click', () => {
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++) grid[r][c].classList.remove('on');
  noteHist=[];
});

/* ============================================
   QUICK DRAW
   ============================================ */
const dc=document.getElementById('drawCanvas');
const dctx=dc.getContext('2d');
let drawTool='pen', drawColor='#000000', brushSize=8, isDrawing=false, drawHist=[], drawRedo=[];

function resizeDraw() { const r=dc.getBoundingClientRect(); dc.width=r.width; }

/* color dots */
const colorRowEl=document.getElementById('colorRow');
DRAW_COLORS.forEach(c => {
  const d=document.createElement('div');
  d.className='color-dot'+(c===drawColor?' active':'');
  d.style.cssText=`background:${c};border:2px solid ${c==='#fefff4'?'#ccc':'transparent'}`;
  d.addEventListener('click',()=>{
    drawColor=c;
    document.querySelectorAll('.color-dot').forEach(x=>{x.classList.remove('active');x.style.border=`2px solid ${x.style.background==='rgb(254, 255, 244)'?'#ccc':'transparent'}`;});
    d.classList.add('active'); d.style.border='2px solid #000';
  });
  colorRowEl.appendChild(d);
});

document.getElementById('brushSize').addEventListener('input', e => brushSize=+e.target.value);

/* tool buttons */
document.querySelectorAll('.draw__tool').forEach(btn => {
  btn.addEventListener('click', () => {
    drawTool=btn.dataset.tool;
    document.querySelectorAll('.draw__tool').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-pressed','false');});
    btn.classList.add('active'); btn.setAttribute('aria-pressed','true');
  });
});

/* prompts */
document.getElementById('promptBtn').addEventListener('click', () => {
  document.getElementById('promptText').textContent=PROMPTS[Math.floor(Math.random()*PROMPTS.length)];
});
document.getElementById('generateBtn').addEventListener('click', () => {
  document.getElementById('promptText').textContent=PROMPTS[Math.floor(Math.random()*PROMPTS.length)];
});

/* drawing */
function saveDState(){drawHist.push(dc.toDataURL());if(drawHist.length>25)drawHist.shift();drawRedo=[];}
function getDPos(e){const r=dc.getBoundingClientRect(),s=e.touches?e.touches[0]:e;return{x:(s.clientX-r.left)*(dc.width/r.width),y:(s.clientY-r.top)*(dc.height/r.height)};}
function startDraw(e){isDrawing=true;saveDState();const p=getDPos(e);if(drawTool==='stamp'){dctx.font=`${brushSize*3}px sans-serif`;dctx.fillText(STAMPS[Math.floor(Math.random()*STAMPS.length)],p.x,p.y);}else{dctx.beginPath();dctx.moveTo(p.x,p.y);}}
function moveDraw(e){if(!isDrawing||drawTool==='stamp')return;const p=getDPos(e);dctx.lineWidth=drawTool==='eraser'?brushSize*3:brushSize;dctx.lineCap='round';dctx.lineJoin='round';dctx.strokeStyle=drawTool==='eraser'?'#fefff4':drawColor;dctx.lineTo(p.x,p.y);dctx.stroke();}
dc.addEventListener('mousedown',startDraw);dc.addEventListener('mousemove',moveDraw);dc.addEventListener('mouseup',()=>isDrawing=false);dc.addEventListener('mouseleave',()=>isDrawing=false);
dc.addEventListener('touchstart',e=>{e.preventDefault();startDraw(e);},{passive:false});
dc.addEventListener('touchmove', e=>{e.preventDefault();moveDraw(e); },{passive:false});
dc.addEventListener('touchend',()=>isDrawing=false);

document.getElementById('undoDrawBtn').addEventListener('click',()=>{if(!drawHist.length)return;drawRedo.push(dc.toDataURL());const img=new Image();img.src=drawHist.pop();img.onload=()=>{dctx.clearRect(0,0,dc.width,dc.height);dctx.drawImage(img,0,0);};});
document.getElementById('redoDrawBtn').addEventListener('click',()=>{if(!drawRedo.length)return;drawHist.push(dc.toDataURL());const img=new Image();img.src=drawRedo.pop();img.onload=()=>{dctx.clearRect(0,0,dc.width,dc.height);dctx.drawImage(img,0,0);};});
document.getElementById('clearDrawBtn').addEventListener('click',()=>{
  saveDState();dctx.clearRect(0,0,dc.width,dc.height);
  liveDrawings=[];if(lActive)lctx.clearRect(0,0,lW,lH);
});
document.getElementById('saveDrawBtn').addEventListener('click',()=>toast('Drawing saved. Framing it now.'));

/* ============================================
   LIVE DRAWINGS
   ============================================ */
const lc=document.getElementById('liveCanvas');
const lctx=lc.getContext('2d');
let liveDrawings=[],lDrag=null,lDox=0,lDoy=0,lMx=0,lMy=0,lLx=0,lLy=0,lVx=0,lVy=0,lW=0,lH=0,lActive=false;

function resizeLive(){lW=lc.width=window.innerWidth;lH=lc.height=window.innerHeight;}

function captureDrawing(){
  const w=dc.width,h=dc.height;
  const px=dctx.getImageData(0,0,w,h).data;
  let x0=w,y0=h,x1=0,y1=0;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){if(px[(y*w+x)*4+3]>10){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;}}
  if(x1<=x0||y1<=y0)return;
  const pad=16;
  x0=Math.max(0,x0-pad);y0=Math.max(0,y0-pad);x1=Math.min(w-1,x1+pad);y1=Math.min(h-1,y1+pad);
  const cw=x1-x0,ch=y1-y0;
  const sc=Math.min(300/cw,1);
  const dw=Math.round(cw*sc),dh=Math.round(ch*sc);
  const snap=document.createElement('canvas');snap.width=dw;snap.height=dh;
  snap.getContext('2d').drawImage(dc,x0,y0,cw,ch,0,0,dw,dh);
  saveDState();dctx.clearRect(0,0,w,h);
  liveDrawings.push({
    snap,w:dw,h:dh,r:(dw+dh)/4,
    x:window.innerWidth/2+(Math.random()-.5)*200,
    y:window.innerHeight/2+(Math.random()-.5)*200,
    vx:(Math.random()-.5)*3,vy:(Math.random()-.5)*3,
    rot:0,vrot:(Math.random()-.5)*0.015
  });
  if(!lActive){lActive=true;lc.style.display='block';resizeLive();liveLoop();}
}

function updateLive(){
  for(const d of liveDrawings){
    if(d===lDrag)continue;
    d.vx*=.996;d.vy*=.996;d.vrot*=.998;
    d.x+=d.vx;d.y+=d.vy;d.rot+=d.vrot;
    const m=Math.max(d.w,d.h)/2;
    if(d.x-m<0){d.x=m;d.vx=Math.abs(d.vx)*.65;d.vrot*=-1;}
    if(d.x+m>lW){d.x=lW-m;d.vx=-Math.abs(d.vx)*.65;d.vrot*=-1;}
    if(d.y-m<0){d.y=m;d.vy=Math.abs(d.vy)*.65;d.vrot*=-1;}
    if(d.y+m>lH){d.y=lH-m;d.vy=-Math.abs(d.vy)*.65;d.vrot*=-1;}
  }
  if(lDrag){
    lDrag.x=lMx-lDox;lDrag.y=lMy-lDoy;
    lDrag.vx=lVx*1.4;lDrag.vy=lVy*1.4;
    lDrag.vrot=(lVx*lDoy-lVy*lDox)*0.0003;
  }
  lVx=lVx*.5+(lMx-lLx)*.5;lVy=lVy*.5+(lMy-lLy)*.5;lLx=lMx;lLy=lMy;
  for(let i=0;i<liveDrawings.length;i++)for(let j=i+1;j<liveDrawings.length;j++){
    const a=liveDrawings[i],b=liveDrawings[j];
    const dx=b.x-a.x,dy=b.y-a.y,dist=Math.sqrt(dx*dx+dy*dy),md=a.r+b.r;
    if(dist<md&&dist>.01){
      const nx=dx/dist,ny=dy/dist,ov=(md-dist)/2;
      if(a!==lDrag){a.x-=nx*ov;a.y-=ny*ov;}
      if(b!==lDrag){b.x+=nx*ov;b.y+=ny*ov;}
      const dv=(a.vx-b.vx)*nx+(a.vy-b.vy)*ny;
      if(dv>0){const im=dv*.72;if(a!==lDrag){a.vx-=im*nx;a.vy-=im*ny;}if(b!==lDrag){b.vx+=im*nx;b.vy+=im*ny;}}
    }
  }
  if(bActive)for(const d of liveDrawings)for(const b of balls){
    const dx=b.x-d.x,dy=b.y-d.y,dist=Math.sqrt(dx*dx+dy*dy),md=d.r+b.r;
    if(dist<md&&dist>.01){
      const nx=dx/dist,ny=dy/dist,ov=(md-dist)/2;
      if(d!==lDrag){d.x-=nx*ov;d.y-=ny*ov;}
      if(b!==bDrag){b.x+=nx*ov;b.y+=ny*ov;}
      const dv=(d.vx-b.vx)*nx+(d.vy-b.vy)*ny;
      if(dv>0){const im=dv*.72;if(d!==lDrag){d.vx-=im*nx;d.vy-=im*ny;}if(b!==bDrag){b.vx+=im*nx;b.vy+=im*ny;}}
    }
  }
}

function drawLive(){
  lctx.clearRect(0,0,lW,lH);
  for(const d of liveDrawings){
    const spd=Math.sqrt(d.vx*d.vx+d.vy*d.vy);
    const sf=1+Math.min(spd*.018,.45);
    const cf=1/Math.sqrt(sf);
    const va=Math.atan2(d.vy,d.vx);
    lctx.save();
    lctx.translate(d.x,d.y);
    if(spd>.4){lctx.rotate(va);lctx.scale(sf,cf);lctx.rotate(-va);}
    lctx.rotate(d.rot);
    lctx.drawImage(d.snap,-d.w/2,-d.h/2,d.w,d.h);
    lctx.restore();
  }
}

function liveLoop(){if(!lActive)return;drawLive();updateLive();requestAnimationFrame(liveLoop);}

document.addEventListener('mousedown',e=>{
  if(!lActive)return;
  const x=e.clientX,y=e.clientY;
  for(let i=liveDrawings.length-1;i>=0;i--){
    const d=liveDrawings[i],m=Math.max(d.w,d.h)/2,dx=x-d.x,dy=y-d.y;
    if(dx*dx+dy*dy<m*m){lDrag=d;lDox=dx;lDoy=dy;lMx=x;lMy=y;e.preventDefault();break;}
  }
});
document.addEventListener('mousemove',e=>{if(!lActive)return;lLx=lMx;lLy=lMy;lMx=e.clientX;lMy=e.clientY;});
document.addEventListener('mouseup',()=>{lDrag=null;});
document.addEventListener('touchstart',e=>{
  if(!lActive)return;
  const t=e.touches[0],x=t.clientX,y=t.clientY;
  for(let i=liveDrawings.length-1;i>=0;i--){
    const d=liveDrawings[i],m=Math.max(d.w,d.h)/2,dx=x-d.x,dy=y-d.y;
    if(dx*dx+dy*dy<m*m){lDrag=d;lDox=dx;lDoy=dy;lMx=x;lMy=y;break;}
  }
},{passive:true});
document.addEventListener('touchmove',e=>{if(!lActive)return;lLx=lMx;lLy=lMy;lMx=e.touches[0].clientX;lMy=e.touches[0].clientY;},{passive:true});
document.addEventListener('touchend',()=>{lDrag=null;});

document.getElementById('lifeBtn').addEventListener('click',captureDrawing);

/* ============================================
   BALL PIT
   ============================================ */
const bc=document.getElementById('ballCanvas');
const bctx=bc.getContext('2d');
const BCOLS=['#ff6d00','#ffbc00','#4dad2a','#39a1ff','#ab79db'];
let balls=[],bDrag=null,bDox=0,bDoy=0,bMx=0,bMy=0,bLx=0,bLy=0,bVx=0,bVy=0,bW=0,bH=0,bActive=false,bGrav=0.4;

function resizeBall(){bW=bc.width=window.innerWidth;bH=bc.height=window.innerHeight;}
function mkBall(){const r=22;return{x:r+Math.random()*(bW-r*2),y:-r-Math.random()*300,r,vx:(Math.random()-.5)*4,vy:0,color:BCOLS[Math.floor(Math.random()*BCOLS.length)]};}
function collide(){for(let i=0;i<balls.length;i++)for(let j=i+1;j<balls.length;j++){const a=balls[i],b=balls[j],dx=b.x-a.x,dy=b.y-a.y,d=Math.sqrt(dx*dx+dy*dy),m=a.r+b.r;if(d<m&&d>.01){const nx=dx/d,ny=dy/d,ov=(m-d)/2;if(bDrag!==a){a.x-=nx*ov;a.y-=ny*ov;}if(bDrag!==b){b.x+=nx*ov;b.y+=ny*ov;}const dv=(a.vx-b.vx)*nx+(a.vy-b.vy)*ny;if(dv>0){const im=dv*.7;if(bDrag!==a){a.vx-=im*nx;a.vy-=im*ny;}if(bDrag!==b){b.vx+=im*nx;b.vy+=im*ny;}}}}}
function updateBalls(){for(const b of balls){if(b===bDrag)continue;b.vy+=bGrav;b.vx*=.993;b.vy*=.993;b.x+=b.vx;b.y+=b.vy;if(b.x-b.r<0){b.x=b.r;b.vx=Math.abs(b.vx)*.68;}if(b.x+b.r>bW){b.x=bW-b.r;b.vx=-Math.abs(b.vx)*.68;}if(b.y+b.r>bH){b.y=bH-b.r;b.vy=-Math.abs(b.vy)*.68;b.vx*=.85;}if(b.y-b.r<0){b.y=b.r;b.vy=Math.abs(b.vy)*.68;}}collide();if(bDrag){bDrag.x=bMx-bDox;bDrag.y=bMy-bDoy;bDrag.vx=bVx*1.3;bDrag.vy=bVy*1.3;}bVx=bVx*.5+(bMx-bLx)*.5;bVy=bVy*.5+(bMy-bLy)*.5;bLx=bMx;bLy=bMy;}
function drawBalls(){bctx.clearRect(0,0,bW,bH);for(const b of balls){bctx.beginPath();bctx.arc(b.x,b.y,b.r,0,Math.PI*2);bctx.fillStyle=b.color;bctx.fill();}}
function bloop(){if(!bActive)return;drawBalls();updateBalls();requestAnimationFrame(bloop);}

document.addEventListener('mousedown',e=>{
  if(!bActive)return;
  const x=e.clientX,y=e.clientY;
  for(let i=balls.length-1;i>=0;i--){const b=balls[i],dx=x-b.x,dy=y-b.y;if(dx*dx+dy*dy<b.r*b.r){bDrag=b;bDox=dx;bDoy=dy;bMx=x;bMy=y;e.preventDefault();break;}}
});
document.addEventListener('mousemove',e=>{if(!bActive)return;bLx=bMx;bLy=bMy;bMx=e.clientX;bMy=e.clientY;});
document.addEventListener('mouseup',()=>{bDrag=null;});
document.addEventListener('touchstart',e=>{
  if(!bActive)return;
  const t=e.touches[0],x=t.clientX,y=t.clientY;
  for(let i=balls.length-1;i>=0;i--){const b=balls[i],dx=x-b.x,dy=y-b.y;if(dx*dx+dy*dy<b.r*b.r){bDrag=b;bDox=dx;bDoy=dy;bMx=x;bMy=y;break;}}
},{passive:true});
document.addEventListener('touchmove',e=>{if(!bActive)return;bLx=bMx;bLy=bMy;bMx=e.touches[0].clientX;bMy=e.touches[0].clientY;},{passive:true});
document.addEventListener('touchend',()=>{bDrag=null;});

document.getElementById('addBallsBtn').addEventListener('click',()=>{
  if(!bActive){bActive=true;bc.style.display='block';resizeBall();bloop();}
  for(let i=0;i<8;i++)balls.push(mkBall());
});
document.getElementById('clearBallsBtn').addEventListener('click',()=>{
  balls=[];bctx.clearRect(0,0,bW,bH);
});
document.getElementById('gravSelect').addEventListener('change',e=>bGrav=parseFloat(e.target.value));

/* ============================================
   PARTY MODE
   ============================================ */
const pc=document.getElementById('partyCanvas');
const pctx=pc.getContext('2d');
let partyOn=false,pAngle=0,pStrobe=0,pDir=1,pAF=null;
function resizeParty(){pc.width=window.innerWidth;pc.height=window.innerHeight;}
function partyLoop(){if(!partyOn){pc.style.display='none';return;}pctx.clearRect(0,0,pc.width,pc.height);pStrobe+=pDir*.015;if(pStrobe>1){pStrobe=1;pDir=-1;}if(pStrobe<0){pStrobe=0;pDir=1;}pctx.fillStyle=`hsla(${(pAngle*1.5)%360},80%,60%,${pStrobe*.1})`;pctx.fillRect(0,0,pc.width,pc.height);const cx=pc.width/2,cy=80;pAngle+=.7;for(let i=0;i<20;i++){const a=(i/20)*Math.PI*2+pAngle*.015,bh=(i/20*360+pAngle*2)%360;pctx.beginPath();pctx.moveTo(cx,cy);pctx.lineTo(cx+Math.cos(a)*1200,cy+Math.sin(a)*1800);pctx.strokeStyle=`hsla(${bh},90%,65%,${.05+pStrobe*.04})`;pctx.lineWidth=10;pctx.stroke();}pAF=requestAnimationFrame(partyLoop);}
function setParty(on){partyOn=on;if(on){pc.style.display='block';resizeParty();partyLoop();}else{pc.style.display='none';if(pAF)cancelAnimationFrame(pAF);}document.getElementById('partyBtn').setAttribute('aria-pressed',on);document.getElementById('partyBtnText').textContent=on?'party on :)':'party off :(';}
document.getElementById('partyBtn').addEventListener('click',()=>setParty(!partyOn));
window.addEventListener('resize',()=>{if(partyOn)resizeParty();});

/* ============================================
   INIT
   ============================================ */
setTimeout(()=>{ resizeDraw(); }, 100);
window.addEventListener('resize',()=>{ resizeDraw(); if(bActive)resizeBall(); if(lActive)resizeLive(); });
