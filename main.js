import { Player } from "./player.js";
import { bindControls } from "./controls.js";

const canvas=document.getElementById("game");
const ctx=canvas.getContext("2d",{alpha:false});
ctx.imageSmoothingEnabled=true;
ctx.imageSmoothingQuality="high";

const player=new Player(canvas.width*.5,canvas.height*.79);
bindControls(player);

const hpFill=document.getElementById("hp-fill");
const staminaFill=document.getElementById("stamina-fill");
const stateLabel=document.getElementById("state-label");

function resize(){
  const ratio=Math.min(devicePixelRatio||1,2);
  const cssW=innerWidth, cssH=innerHeight;
  canvas.width=Math.round(cssW*ratio);
  canvas.height=Math.round(cssH*ratio);
  canvas.style.width=cssW+"px"; canvas.style.height=cssH+"px";
  ctx.setTransform(ratio,0,0,ratio,0,0);
  player.groundY=cssH*.79;
  if(player.onGround)player.y=player.groundY;
}
window.addEventListener("resize",resize,{passive:true});
resize();

let last=performance.now();
function frame(now){
  const dt=Math.min(.033,(now-last)/1000); last=now;

  // Update.
  player.update(dt);

  // Background. Character itself is never drawn with geometric primitives.
  const w=innerWidth,h=innerHeight;
  const g=ctx.createLinearGradient(0,0,0,h);
  g.addColorStop(0,"#111218"); g.addColorStop(.65,"#090a0e"); g.addColorStop(1,"#050506");
  ctx.fillStyle=g; ctx.fillRect(0,0,w,h);

  // Ground plane only.
  const gy=player.groundY+8;
  const rg=ctx.createRadialGradient(player.x,gy,10,player.x,gy,260);
  rg.addColorStop(0,"rgba(231,214,170,.20)");
  rg.addColorStop(1,"rgba(0,0,0,0)");
  ctx.fillStyle=rg; ctx.fillRect(player.x-280,gy-50,560,100);

  player.draw(ctx);

  // Optional combat debug hitbox. Off by default.
  if(window.FRACTURED_DEBUG_HITBOXES){
    const hb=player.getWorldHitbox();
    if(hb){ctx.strokeStyle="#ffef75";ctx.strokeRect(hb.x,hb.y,hb.w,hb.h)}
  }

  hpFill.style.width=`${(player.hp/player.maxHp)*100}%`;
  staminaFill.style.width=`${(player.stamina/player.maxStamina)*100}%`;
  stateLabel.textContent=player.state.toUpperCase();

  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// Expose the player for integration/testing in the existing v3.4 project.
window.FRACTURED = window.FRACTURED || {};
window.FRACTURED.angelKnight = player;
