import { Player } from "./player.js";
import { bindControls } from "./controls.js";
import { CharacterCreator } from "./creator.js";
import { openMenu, closeMenu, showPage } from "./menu.js";

const canvas=document.getElementById("game");
const ctx=canvas.getContext("2d",{alpha:true});
ctx.imageSmoothingEnabled=true;
ctx.imageSmoothingQuality="high";

const hpFill=document.getElementById("hp-fill");
const staminaFill=document.getElementById("stamina-fill");
const stateLabel=document.getElementById("state-label");
const buildLabel=document.getElementById("build-label");
const loadingFill=document.getElementById("loading-fill");
const loadingBuild=document.getElementById("loading-build");

// Ground line matched to the detailed Shattered Kingdom artwork.
const GROUND_RATIO=.755;

window.FRACTURED={
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

async function clearOldBuildCaches(){
  try{
    if("serviceWorker" in navigator){
      const regs=await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(r=>r.unregister()));
    }
    if("caches" in window){
      const keys=await caches.keys();
      await Promise.all(keys.map(k=>caches.delete(k)));
    }
  }catch(_){}
}
clearOldBuildCaches();

function resize(){
  const ratio=Math.min(devicePixelRatio||1,2);
  const cssW=innerWidth,cssH=innerHeight;
  canvas.width=Math.round(cssW*ratio);
  canvas.height=Math.round(cssH*ratio);
  canvas.style.width=cssW+"px";
  canvas.style.height=cssH+"px";
  ctx.setTransform(ratio,0,0,ratio,0,0);

  if(player){
    player.groundY=cssH*GROUND_RATIO;
    if(player.onGround)player.y=player.groundY;
    player.x=Math.max(90,Math.min(cssW-90,player.x));
  }
}
addEventListener("resize",resize,{passive:true});
resize();

function drawWorld(w,h){
  // The environment is the detailed image in #world-background.
  // Canvas stays transparent and only composites detailed actor art.
  ctx.clearRect(0,0,w,h);
}

function syncAbilityButtons(){
  const angel=hasRace("Angel");
  document.querySelectorAll(".ability").forEach(btn=>{
    btn.disabled=!angel;
    btn.style.opacity=angel?"1":".28";
    btn.title=angel?"Angel bloodline ability":"Requires Angel bloodline";
  });
}

function actuallyEnterWorld(config){
  window.FRACTURED.buildConfig=config;
  window.FRACTURED.started=true;
  window.FRACTURED.menuPaused=false;

  document.querySelectorAll(".flow-screen").forEach(s=>s.classList.remove("active"));
  document.getElementById("game-shell").classList.add("active");

  const groundY=innerHeight*GROUND_RATIO;
  player=new Player(innerWidth*.5,groundY);
  player.groundY=groundY;
  player.y=groundY;

  if(!controlsBound){
    bindControls(player);
    controlsBound=true;
  }

  window.FRACTURED.angelKnight=player;
  buildLabel.textContent=`${config.races.join(" / ")} · ${config.className}`;
  syncAbilityButtons();
  resize();
  last=performance.now();
}

function beginGame(config){
  window.FRACTURED.buildConfig=config;

  document.querySelectorAll(".flow-screen").forEach(s=>s.classList.remove("active"));
  const loading=document.getElementById("loading-screen");
  loading.classList.add("active");

  loadingBuild.textContent=`${config.races.join(" / ")} · ${config.className}`;
  loadingFill.style.width="0%";

  const steps=[18,39,62,81,100];
  let i=0;
  const tick=()=>{
    loadingFill.style.width=steps[i]+"%";
    i++;
    if(i<steps.length){
      setTimeout(tick,135);
    }else{
      setTimeout(()=>actuallyEnterWorld(config),180);
    }
  };
  requestAnimationFrame(()=>setTimeout(tick,60));
}

new CharacterCreator(beginGame);

document.getElementById("menu-character").onclick=()=>openMenu("character");
document.getElementById("menu-inventory").onclick=()=>openMenu("inventory");
document.getElementById("menu-close").onclick=closeMenu;
document.querySelectorAll(".menuTab[data-page]").forEach(b=>b.onclick=()=>showPage(b.dataset.page));

document.querySelectorAll(".ability").forEach((btn,i)=>{
  btn.addEventListener("click",()=>{
    if(!hasRace("Angel"))return;

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
    if(player&&!window.FRACTURED.menuPaused)player.update(dt);

    drawWorld(innerWidth,innerHeight);
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
