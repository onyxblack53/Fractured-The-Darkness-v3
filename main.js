
import { Player } from "./player.js";
import { bindControls } from "./controls.js";
import { CharacterCreator } from "./creator.js";
import { openMenu, closeMenu, showPage } from "./menu.js";

const canvas=document.getElementById("game");
const ctx=canvas.getContext("2d",{alpha:false});
ctx.imageSmoothingEnabled=true;
ctx.imageSmoothingQuality="high";

const hpFill=document.getElementById("hp-fill");
const staminaFill=document.getElementById("stamina-fill");
const stateLabel=document.getElementById("state-label");
const buildLabel=document.getElementById("build-label");

window.FRACTURED = {
  ...(window.FRACTURED||{}),
  buildConfig:null,
  menuPaused:false,
  started:false,
  openMenu,closeMenu,showPage
};

let player=null;
let controlsBound=false;
let last=performance.now();
let worldTime=0;

function hasRace(name){
  return window.FRACTURED.buildConfig?.races?.includes(name);
}

function resize(){
  const ratio=Math.min(devicePixelRatio||1,2);
  const cssW=innerWidth, cssH=innerHeight;
  canvas.width=Math.round(cssW*ratio);
  canvas.height=Math.round(cssH*ratio);
  canvas.style.width=cssW+"px";
  canvas.style.height=cssH+"px";
  ctx.setTransform(ratio,0,0,ratio,0,0);
  if(player){
    player.groundY=cssH*.71;
    if(player.onGround)player.y=player.groundY;
    player.x=Math.max(90,Math.min(cssW-90,player.x));
  }
}
addEventListener("resize",resize,{passive:true});
resize();

function drawWorld(w,h){
  const g=ctx.createLinearGradient(0,0,0,h);
  g.addColorStop(0,"#080615");
  g.addColorStop(.46,"#160a1d");
  g.addColorStop(1,"#020204");
  ctx.fillStyle=g; ctx.fillRect(0,0,w,h);

  // Blood moon.
  const mx=w*.22,my=h*.18,mr=Math.min(w,h)*.095;
  const mg=ctx.createRadialGradient(mx-mr*.2,my-mr*.2,2,mx,my,mr);
  mg.addColorStop(0,"#ef786c"); mg.addColorStop(.45,"#a91e2a"); mg.addColorStop(1,"#3b0610");
  ctx.save();ctx.shadowColor="#8f1322";ctx.shadowBlur=42;ctx.fillStyle=mg;ctx.beginPath();ctx.arc(mx,my,mr,0,Math.PI*2);ctx.fill();ctx.restore();

  // Purple fracture.
  ctx.save();
  ctx.translate(w*.70,h*.18);
  ctx.strokeStyle="rgba(164,78,255,.9)";
  ctx.shadowColor="#7d33ff";ctx.shadowBlur=24;ctx.lineWidth=3;
  ctx.beginPath();ctx.moveTo(0,-150);ctx.lineTo(-25,-95);ctx.lineTo(9,-50);ctx.lineTo(-18,-8);ctx.lineTo(14,48);ctx.lineTo(-8,118);ctx.stroke();
  ctx.lineWidth=1.2;
  for(let i=0;i<6;i++){ctx.beginPath();ctx.moveTo((i%2?1:-1)*5,-90+i*35);ctx.lineTo((i%2?1:-1)*(38+i*7),-69+i*35);ctx.stroke()}
  ctx.restore();

  // Castle silhouette.
  const cy=h*.52;
  ctx.fillStyle="#090810";
  ctx.fillRect(w*.35,h*.46,w*.31,h*.09);
  const towers=[[.39,.39,.055],[.48,.31,.065],[.58,.37,.055]];
  for(const [x,y,ww] of towers){
    ctx.fillRect(w*x,h*y,w*ww,cy-h*y);
    ctx.beginPath();ctx.moveTo(w*(x-.008),h*y);ctx.lineTo(w*(x+ww/2),h*(y-.055));ctx.lineTo(w*(x+ww+.008),h*y);ctx.fill();
  }
  ctx.fillStyle="rgba(143,66,184,.24)";
  for(let i=0;i<6;i++)ctx.fillRect(w*(.385+i*.045),h*.44,4,13);

  // Forest.
  for(let layer=0;layer<3;layer++){
    const base=h*(.57+layer*.055);
    ctx.fillStyle=layer===0?"#0b0a10":layer===1?"#07070a":"#030405";
    for(let i=0;i<18;i++){
      const x=(i/17)*w+Math.sin(i*4.3+layer)*26;
      const hh=h*(.16+.07*Math.abs(Math.sin(i*1.7+layer)));
      ctx.beginPath();ctx.moveTo(x,base-hh);ctx.lineTo(x-27-layer*7,base);ctx.lineTo(x+27+layer*7,base);ctx.fill();
      ctx.fillRect(x-3,base-hh*.36,6,hh*.36);
    }
  }

  // Ground.
  const gy=player?.groundY ?? h*.71;
  const gg=ctx.createLinearGradient(0,gy,0,h);
  gg.addColorStop(0,"#1a171a");gg.addColorStop(.16,"#0c0c0e");gg.addColorStop(1,"#020203");
  ctx.fillStyle=gg;ctx.fillRect(0,gy,w,h-gy);

  // Atmosphere.
  for(let i=0;i<28;i++){
    const x=(i*83+worldTime*12*(i%3+1))%w;
    const y=(i*47+Math.sin(worldTime+i)*26)%Math.max(1,gy);
    ctx.fillStyle=`rgba(171,89,255,${.045+(i%4)*.022})`;
    ctx.fillRect(x,y,2,2);
  }

  if(player){
    const rg=ctx.createRadialGradient(player.x,gy,5,player.x,gy,250);
    rg.addColorStop(0,"rgba(229,208,151,.17)");
    rg.addColorStop(1,"rgba(0,0,0,0)");
    ctx.fillStyle=rg;ctx.fillRect(player.x-270,gy-60,540,120);
  }
}

function drawAngelAbilities(){
  if(!player || !hasRace("Angel")) return;
  const t=worldTime;
  ctx.save();
  ctx.globalAlpha=.08+.025*Math.sin(t*3);
  ctx.strokeStyle="#ffeaa0";
  ctx.shadowColor="#ffe182";
  ctx.shadowBlur=18;
  ctx.lineWidth=2;
  ctx.beginPath();
  ctx.ellipse(player.x,player.y-275,28,8,0,0,Math.PI*2);
  ctx.stroke();
  ctx.restore();
}

function syncAbilityButtons(){
  const angel=hasRace("Angel");
  document.querySelectorAll(".ability").forEach(btn=>{
    btn.disabled=!angel;
    btn.style.opacity=angel?"1":".28";
    btn.title=angel?"Angel bloodline ability":"Requires Angel bloodline";
  });
}

function beginGame(config){
  window.FRACTURED.buildConfig=config;
  window.FRACTURED.started=true;
  window.FRACTURED.menuPaused=false;

  document.querySelectorAll(".flow-screen").forEach(s=>s.classList.remove("active"));
  document.getElementById("game-shell").classList.add("active");

  player=new Player(innerWidth*.5,innerHeight*.71);
  player.groundY=innerHeight*.71;
  player.y=player.groundY;

  if(!controlsBound){
    bindControls(player);
    controlsBound=true;
  }else{
    // bindControls is intentionally only called once in this prototype.
    // Reloading character creation uses the same player session.
  }

  window.FRACTURED.angelKnight=player;
  buildLabel.textContent=`${config.races.join(" / ")} · ${config.className}`;
  syncAbilityButtons();
  resize();
  last=performance.now();
}

new CharacterCreator(beginGame);

document.getElementById("menu-character").onclick=()=>openMenu("character");
document.getElementById("menu-inventory").onclick=()=>openMenu("inventory");
document.getElementById("menu-close").onclick=closeMenu;
document.querySelectorAll(".menuTab[data-page]").forEach(b=>b.onclick=()=>showPage(b.dataset.page));

document.querySelectorAll(".ability").forEach((btn,i)=>{
  btn.addEventListener("click",()=>{
    if(!hasRace("Angel")) return;
    const messages=[
      "Radiant Burst — Angel bloodline",
      "Aegis of Heaven — Angel bloodline",
      "Falling Star — Angel bloodline"
    ];
    const toast=document.getElementById("toast");
    toast.textContent=messages[i];
    toast.classList.add("show");
    clearTimeout(window.__fcdToast);
    window.__fcdToast=setTimeout(()=>toast.classList.remove("show"),900);
  });
});

function frame(now){
  const dt=Math.min(.033,(now-last)/1000||.016);
  last=now;
  worldTime+=dt;

  if(window.FRACTURED.started){
    if(player && !window.FRACTURED.menuPaused) player.update(dt);
    drawWorld(innerWidth,innerHeight);
    drawAngelAbilities();
    player?.draw(ctx);

    if(player){
      hpFill.style.width=`${player.hp/player.maxHp*100}%`;
      staminaFill.style.width=`${player.stamina/player.maxStamina*100}%`;
      stateLabel.textContent=player.state.toUpperCase();
    }
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
