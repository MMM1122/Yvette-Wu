/* A small shoal under rain: decorative, bounded, and independent of page content. */
(() => {
  'use strict';
  const rain = document.getElementById('pond-rain');
  const canvas = document.getElementById('pond-koi');
  const control = document.getElementById('pond-control');
  const art = document.querySelector('.pond-art');
  if (!rain || !canvas || !control || !art) return;
  const water = rain.getContext('2d');
  const koi = canvas.getContext('2d');
  if (!water || !koi) { control.hidden = true; return; }
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const sprite = new Image();
  const TAU = Math.PI * 2;
  let w = 0, h = 0, frame = 0, previous = 0, elapsed = 0;
  let paused = false, printing = false, suspended = false, loaded = false;
  let dark = false, pigment = '54,116,111';
  let fish = [], drops = [], rings = [], beads = [];
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const random = (a, b) => a + Math.random() * (b - a);
  const active = () => !paused && !reduced.matches && !document.hidden && !printing && !suspended;
  const shoal = [
    {x:.055,y:.35,rx:.018,ry:.095,size:70,speed:.065,phase:1.1,depth:.85},
    {x:.950,y:.55,rx:.018,ry:.11,size:76,speed:-.055,phase:2.8,depth:.80},
    {x:.925,y:.83,rx:.022,ry:.055,size:61,speed:.070,phase:5.1,depth:.70}
  ];
  function addRing(x, y, strength = 1, leaf = false) {
    if (rings.length >= 40) rings.shift();
    rings.push({x,y,age:0,duration:leaf ? random(.6,1) : random(2.2,3.8),size:random(20,42),strength,leaf});
  }
  function resetDrop(drop, initial = false) {
    // Most raindrops meet the open water along the two sides.
    const side = Math.random();
    drop.x = side < .43 ? random(0,w*.23) : side < .86 ? random(w*.78,w) : random(0,w);
    drop.y = random(h*.08,h*.98);
    drop.duration = random(.65,1.25);
    drop.delay = random(1.5,4);
    drop.age = initial ? random(-1.5,drop.duration) : -drop.delay;
    drop.travel = random(75,170);
    drop.length = random(7,17);
    drop.alpha = random(.08,.23);
    drop.leaf = (drop.x > w*.88 && drop.y < h*.27) || (drop.x < w*.10 && drop.y > h*.72);
    return drop;
  }
  function resize() {
    w = window.innerWidth; h = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    for (const [element,ctx] of [[rain,water],[canvas,koi]]) {
      element.width = Math.round(w*dpr);element.height = Math.round(h*dpr);
      ctx.setTransform(dpr,0,0,dpr,0,0);
    }
    const small = w < 680;
    fish = (small ? shoal.slice(0,2) : shoal).map((f,i) => ({
      ...f, x:small ? (i%2 ? .94 : .06) : f.x, rx:small ? .015 : f.rx,
      size:f.size * (small ? .62 : clamp(w/1440,.8,1.14))
    }));
    drops = Array.from({length:small ? 4 : 8},() => resetDrop({},true));
    beads = Array.from({length:small ? 3 : 6},(_,i) => ({
      x:(i%2 ? random(.88,.985) : random(.015,.12))*w,
      y:random(.12,.94)*h,r:random(1.4,3.8),stretch:random(1,1.6)
    }));
    rings = [];
    drawFish();drawWater(0);
  }
  function position(f) {
    const t = elapsed*f.speed+f.phase;
    const x = (f.x + Math.cos(t)*f.rx)*w;
    const y = (f.y + Math.sin(t)*f.ry)*h;
    const dx = -Math.sin(t)*f.rx*w*f.speed;
    const dy = Math.cos(t)*f.ry*h*f.speed;
    return {x,y,heading:Math.atan2(dy,dx)};
  }
  function drawFish() {
    koi.clearRect(0,0,w,h);
    if (!loaded) return;
    for (const f of fish) {
      const p = position(f);
      const length = f.size, height = length*sprite.naturalHeight/sprite.naturalWidth;
      const edge = Math.abs(p.x/w-.5)*2;
      // Fish remain visible in the margins and recede beneath the reading area.
      const visibility = .10 + .18*clamp((edge-.40)/.45,0,1);
      koi.save();koi.translate(p.x,p.y);koi.rotate(p.heading);
      koi.globalAlpha = visibility*f.depth*(dark ? .82 : 1);
      const slices = 36, step = sprite.naturalWidth/slices;
      for (let i=0;i<slices;i++) {
        const u = i/(slices-1);
        const bend = Math.sin(elapsed*1.3+f.phase-u*4.4)*Math.pow(1-u,2)*length*.055;
        koi.drawImage(sprite,i*step,0,step,sprite.naturalHeight,
          -length/2+i*length/slices,-height/2+bend,length/slices+.4,height);
      }
      koi.restore();
    }
  }
  function drawWater(dt) {
    water.clearRect(0,0,w,h);
    if (reduced.matches || printing) return;
    for (const drop of drops) {
      drop.age += dt;
      if (drop.age >= drop.duration) {
        if (dt) {addRing(drop.x,drop.y,drop.leaf ? .55 : random(.45,.9),drop.leaf);resetDrop(drop);}
        continue;
      }
      if (drop.age < 0) continue;
      const p = drop.age/drop.duration;
      const distance = (1-p)*drop.travel;
      const x = drop.x-distance*.16, y = drop.y-distance;
      const center = x>w*.24 && x<w*.78;
      water.beginPath();water.moveTo(x,y);water.lineTo(x+drop.length*.16,y+drop.length);
      water.strokeStyle = `rgba(${pigment},${drop.alpha*(center ? .23 : .85)})`;
      water.lineWidth = .65;water.stroke();
    }
    rings = rings.filter(r => (r.age += dt) < r.duration);
    for (const r of rings) {
      const p = r.age/r.duration;
      const fade = Math.sin(Math.PI*Math.min(1,p*1.6))*(1-p);
      if (r.leaf) {
        for (let i=0;i<3;i++) {
          const x=r.x+(i-1)*p*13,y=r.y-Math.sin(Math.PI*p)*9+p*p*9;
          water.beginPath();water.ellipse(x,y,1,1.6,0,0,TAU);
          water.fillStyle=`rgba(${pigment},${fade*.3*r.strength})`;water.fill();
        }
        continue;
      }
      for (let j=0;j<3;j++) {
        const q=clamp((p-j*.11)/(1-j*.11),0,1);
        if (!q) continue;
        const radius=2+q*r.size;
        water.beginPath();water.ellipse(r.x,r.y,radius,radius*.39,-.12,0,TAU);
        water.strokeStyle=`rgba(${pigment},${fade*.30*r.strength*(1-j*.23)})`;
        water.lineWidth=j ? .65 : .95;water.stroke();
        water.beginPath();water.ellipse(r.x,r.y-1,radius+1,radius*.39,-.12,Math.PI*1.08,Math.PI*1.80);
        water.strokeStyle=`rgba(241,255,248,${fade*.39*r.strength})`;water.lineWidth=.7;water.stroke();
      }
    }
    // Small highlights suggest rain beading on the glass at the edges.
    for (const bead of beads) {
      water.save();water.translate(bead.x,bead.y);
      water.beginPath();water.ellipse(0,0,bead.r,bead.r*bead.stretch,-.15,0,TAU);
      water.strokeStyle=`rgba(${pigment},.14)`;water.lineWidth=.7;water.stroke();
      water.beginPath();water.ellipse(-.4,-.6,bead.r*.75,bead.r*bead.stretch*.72,-.15,Math.PI,Math.PI*1.7);
      water.strokeStyle=dark ? 'rgba(210,245,235,.24)' : 'rgba(255,255,255,.78)';
      water.lineWidth=.8;water.stroke();water.restore();
    }
  }
  function tick(now) {
    frame=0;
    if (!active()) return;
    if (previous && now-previous<32) {frame=requestAnimationFrame(tick);return;}
    const dt=previous ? Math.min((now-previous)/1000,.075) : 1/30;
    previous=now;elapsed+=dt;
    drawFish();drawWater(dt);
    frame=requestAnimationFrame(tick);
  }
  function sync() {
    cancelAnimationFrame(frame);frame=0;previous=0;
    document.documentElement.dataset.pondPaused=String(!active());
    control.setAttribute('aria-pressed',String(paused));
    control.setAttribute('aria-label',paused ? 'Resume pond animation' : 'Pause pond animation');
    control.textContent=paused ? '▷  Resume pond' : 'Ⅱ  Pause pond';
    art.style.animationPlayState=active() ? 'running' : 'paused';
    drawFish();drawWater(0);
    if (active()) frame=requestAnimationFrame(tick);
  }
  function themeChanged() {
    dark=document.documentElement.dataset.theme !== 'light';
    pigment=getComputedStyle(document.documentElement).getPropertyValue('--pond-ring').trim() || '54,116,111';
    drawFish();drawWater(0);
  }
  new MutationObserver(themeChanged).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
  window.addEventListener('resize',resize,{passive:true});
  document.addEventListener('visibilitychange',sync);
  reduced.addEventListener('change',sync);
  control.addEventListener('click',() => {paused=!paused;sync();});
  window.addEventListener('beforeprint',() => {printing=true;sync();});
  window.addEventListener('afterprint',() => {printing=false;sync();});
  window.addEventListener('pagehide',() => {suspended=true;sync();});
  window.addEventListener('pageshow',() => {suspended=false;sync();});
  sprite.onload=() => {loaded=true;drawFish();};
  sprite.onerror=() => {canvas.hidden=true;};
  sprite.src="assets/images/koi.png";
  themeChanged();resize();sync();
})();
