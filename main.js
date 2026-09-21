import { Player } from "./player.js";
import { bindControls } from "./controls.js";

const canvas=document.getElementById("game"),ctx=canvas.getContext("2d",{alpha:false});ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality="high";
const boot=document.getElementById("boot-screen"),bootStatus=document.getElementById("boot-status");
const player=new Player(innerWidth*.5,innerHeight*.67);bindControls(player);
const hpFill=document.getElementById("hp-fill"),staminaFill=document.getElementById("stamina-fill"),stateLabel=document.getElementById("state-label");
let cssW=innerWidth,cssH=innerHeight,started=false;

function resize(){const ratio=Math.min(devicePixelRatio||1,2);cssW=innerWidth;cssH=innerHeight;canvas.width=Math.round(cssW*ratio);canvas.height=Math.round(cssH*ratio);canvas.style.width=cssW+"px";canvas.style.height=cssH+"px";ctx.setTransform(ratio,0,0,ratio,0,0);player.groundY=cssH*.68;if(player.onGround)player.y=player.groundY;player.x=Math.max(90,Math.min(cssW-90,player.x));}
window.addEventListener("resize",resize,{passive:true});resize();

window.addEventListener("fractured:atlas-ready",()=>{bootStatus.textContent="Angel Knight ready";setTimeout(()=>{boot.classList.add("hidden");started=true;},220);});
window.addEventListener("fractured:atlas-error",e=>{boot.classList.add("error");bootStatus.textContent=`Asset error: ${e.detail}. Make sure /assets/angel_knight_pose_sheet.png is deployed.`;});
setTimeout(()=>{if(!player.renderer.ready&&!player.renderer.error){boot.classList.add("error");bootStatus.textContent="Still loading… verify main.js, game.css and the assets folder are all in the same GitHub Pages deployment.";}},6000);
if(player.renderer.ready){boot.classList.add("hidden");started=true;}

function drawWorld(){
  const w=cssW,h=cssH;let g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,"#11131a");g.addColorStop(.48,"#090b10");g.addColorStop(1,"#050506");ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
  const moon=ctx.createRadialGradient(w*.70,h*.20,1,w*.70,h*.20,Math.min(w,h)*.22);moon.addColorStop(0,"rgba(238,229,199,.13)");moon.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=moon;ctx.fillRect(0,0,w,h*.55);
  ctx.globalAlpha=.18;ctx.fillStyle="#5c6069";for(let i=0;i<7;i++){const x=(i/6)*w;ctx.fillRect(x-4,h*.33,8,h*.35);ctx.beginPath();ctx.moveTo(x-36,h*.35);ctx.lineTo(x,h*.28);ctx.lineTo(x+36,h*.35);ctx.fill();}ctx.globalAlpha=1;
  const gy=player.groundY+7;g=ctx.createLinearGradient(0,gy-40,0,h);g.addColorStop(0,"rgba(65,60,50,.34)");g.addColorStop(1,"#070707");ctx.fillStyle=g;ctx.fillRect(0,gy,w,h-gy);
  const rg=ctx.createRadialGradient(player.x,gy,8,player.x,gy,260);rg.addColorStop(0,"rgba(231,214,170,.20)");rg.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=rg;ctx.fillRect(player.x-300,gy-62,600,124);
}

let last=performance.now();function frame(now){const dt=Math.min(.033,(now-last)/1000);last=now;if(started)player.update(dt);drawWorld();if(player.renderer.ready)player.draw(ctx);hpFill.style.width=`${player.hp/player.maxHp*100}%`;staminaFill.style.width=`${player.stamina/player.maxStamina*100}%`;stateLabel.textContent=player.state.toUpperCase();requestAnimationFrame(frame);}requestAnimationFrame(frame);
window.FRACTURED=window.FRACTURED||{};window.FRACTURED.angelKnight=player;
