
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
  // Environment is rendered by the real world artwork in #world-background.
  // Canvas is reserved for the character and character-related effects only.
  ctx.clearRect(0,0,w,h);
}

function drawAngelAbilities(){
  // Intentionally empty in the world pass.
  // Angel VFX will be owned by CharacterRenderer, not the world renderer.
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
