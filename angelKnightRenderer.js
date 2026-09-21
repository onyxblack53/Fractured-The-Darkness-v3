import { POSES, CLIPS, POSE_SHEET } from "./angelKnightAnimations.js";

const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const mix=(a,b,t)=>a+(b-a)*t;
const ease={
  linear:t=>t,
  smooth:t=>t*t*(3-2*t),
  in:t=>t*t*t,
  out:t=>1-Math.pow(1-t,3)
};

export class AngelKnightRenderer {
  constructor(){
    this.image=new Image();
    this.ready=false; this.error=null;
    this.state="idle"; this.frameIndex=0; this.frameTime=0;
    this.eventLatch=new Set(); this.previousFrame=null;
    this.stateBlend=1; this.stateBlendDuration=.12;
    this.effects=[]; this.time=0; this.shake=0;
    this.image.onload=()=>{this.ready=true; window.dispatchEvent(new CustomEvent("fractured:atlas-ready"));};
    this.image.onerror=()=>{this.error=`Could not load ${POSE_SHEET}`; window.dispatchEvent(new CustomEvent("fractured:atlas-error",{detail:this.error}));};
    this.image.src=POSE_SHEET;
  }

  clip(){return CLIPS[this.state];}
  currentFrame(){return this.clip()?.frames?.[this.frameIndex]??null;}
  nextFrame(){
    const c=this.clip(); if(!c?.frames?.length)return this.currentFrame();
    const ni=this.frameIndex+1;
    if(ni<c.frames.length)return c.frames[ni];
    return c.loop?c.frames[0]:c.frames[c.frames.length-1];
  }

  setState(next,force=false){
    if(!CLIPS[next]||(!force&&next===this.state))return;
    this.previousFrame=this.currentFrame()?{...this.currentFrame()}:null;
    this.state=next; this.frameIndex=0; this.frameTime=0;
    this.stateBlend=0; this.stateBlendDuration=CLIPS[next].blend??.10;
    this.eventLatch.clear();
  }

  update(dt,eventHandler){
    this.time+=dt;
    this.stateBlend=clamp(this.stateBlend+dt/Math.max(.001,this.stateBlendDuration));
    for(const p of this.effects)p.life-=dt;
    this.effects=this.effects.filter(p=>p.life>0);
    this.shake=Math.max(0,this.shake-dt*7);

    const c=this.clip(); if(!c)return null;
    this.frameTime+=dt*1000;
    let frame=this.currentFrame(); if(!frame)return null;

    const eventKey=`${this.state}:${this.frameIndex}:${frame.event||""}`;
    if(frame.event&&!this.eventLatch.has(eventKey)){
      this.eventLatch.add(eventKey);
      eventHandler?.(frame.event,frame);
      this.spawnFrameFX(frame.fx);
    } else if(frame.fx&&![...this.eventLatch].some(k=>k===`${this.state}:${this.frameIndex}:fx`)){
      this.eventLatch.add(`${this.state}:${this.frameIndex}:fx`);
      this.spawnFrameFX(frame.fx);
    }

    while(this.frameTime>=frame.duration){
      this.frameTime-=frame.duration; this.frameIndex++;
      if(this.frameIndex>=c.frames.length){
        if(c.loop){this.frameIndex=0;this.eventLatch.clear();}
        else {this.frameIndex=c.frames.length-1;return "finished";}
      }
      frame=this.currentFrame();
    }
    return null;
  }

  spawnFrameFX(type){
    if(!type)return;
    const cfg={
      slash1:[.20,"slash",1], slash2:[.23,"slash",2], slash3:[.30,"slash",3],
      step:[.18,"dust",.5],stepHeavy:[.22,"dust",.85],jumpDust:[.26,"dust",1.1],landBurst:[.36,"dust",1.5],
      afterimage:[.24,"afterimage",1],healGlow:[.35,"heal",1],guardAura:[.28,"guard",1],
      blockFlash:[.24,"block",1],charge:[.35,"charge",1],deathDust:[.55,"dust",1.8],aura:[.22,"aura",1]
    }[type];
    if(!cfg)return;
    this.effects.push({life:cfg[0],max:cfg[0],type:cfg[1],power:cfg[2]});
    if(["slash","block","dust"].includes(cfg[1]))this.shake=Math.max(this.shake,cfg[2]*.7);
  }

  transformAt(frame,next,t){
    const fn=ease[frame.ease]||ease.smooth; const q=fn(clamp(t));
    const val=(k,d)=>mix(frame[k]??d,next?.[k]??frame[k]??d,q);
    return {x:val("x",0),y:val("y",0),rot:val("rot",0),scale:val("scale",1),scaleX:val("scaleX",1),scaleY:val("scaleY",1)};
  }

  draw(ctx,x,y,facing=1,targetHeight=330,alpha=1){
    if(!this.ready)return;
    const frame=this.currentFrame(); if(!frame)return;
    const progress=clamp(this.frameTime/Math.max(1,frame.duration));
    const tr=this.transformAt(frame,this.nextFrame(),progress);
    const jitter=this.shake>0?(Math.sin(this.time*82)*this.shake):0;

    this.drawEffectsBehind(ctx,x+jitter,y,facing,targetHeight);
    if(this.previousFrame&&this.stateBlend<1){
      this.drawFrame(ctx,this.previousFrame,x+jitter,y,facing,targetHeight,alpha*(1-this.stateBlend),null);
    }
    this.drawFrame(ctx,frame,x+jitter,y,facing,targetHeight,alpha*this.stateBlend,tr);
    this.drawEffectsFront(ctx,x+jitter,y,facing,targetHeight);
  }

  drawFrame(ctx,frame,x,y,facing,targetHeight,alpha,tr){
    const p=POSES[frame.pose]; if(!p)return;
    tr=tr||{x:frame.x??0,y:frame.y??0,rot:frame.rot??0,scale:frame.scale??1,scaleX:frame.scaleX??1,scaleY:frame.scaleY??1};
    const base=(targetHeight/p.sh)*(tr.scale??1);
    const dw=p.sw*base*(tr.scaleX??1), dh=p.sh*base*(tr.scaleY??1);
    const localFacing=frame.flipPose?-facing:facing;
    ctx.save(); ctx.globalAlpha=clamp(alpha); ctx.translate(x+(tr.x??0)*facing,y+(tr.y??0)); ctx.rotate(tr.rot??0); ctx.scale(localFacing,1);
    ctx.drawImage(this.image,p.sx,p.sy,p.sw,p.sh,-dw*p.ax,-dh*p.ay,dw,dh);
    ctx.restore();
  }

  drawEffectsBehind(ctx,x,y,facing,h){
    for(const e of this.effects){
      const t=1-e.life/e.max, a=clamp(e.life/e.max);
      ctx.save(); ctx.translate(x,y); ctx.scale(facing,1);
      if(e.type==="afterimage"){
        ctx.globalAlpha=.16*a; ctx.filter="blur(1px)";
        const f=this.currentFrame(); if(f)this.drawFrame(ctx,f,-34*t,0,1,h,.45*a,null);
      } else if(e.type==="aura"||e.type==="guard"||e.type==="heal"||e.type==="charge"){
        const r=h*(.34+.12*t*e.power); const g=ctx.createRadialGradient(0,-h*.48,0,0,-h*.48,r);
        const strong=e.type==="heal"?.24:e.type==="charge"?.20:e.type==="guard"?.14:.08;
        g.addColorStop(0,`rgba(255,236,164,${strong*a})`); g.addColorStop(1,"rgba(255,220,120,0)");
        ctx.fillStyle=g; ctx.beginPath();ctx.arc(0,-h*.48,r,0,Math.PI*2);ctx.fill();
      } else if(e.type==="dust"){
        ctx.globalAlpha=.22*a;ctx.fillStyle="#d4c39a";
        for(let i=0;i<6;i++){const s=(i+1)*.37;ctx.beginPath();ctx.ellipse((i-2.5)*16*(1+t)*e.power,5-Math.sin(s+t*3)*9,11+13*t,3+5*t,0,0,Math.PI*2);ctx.fill();}
      }
      ctx.restore();
    }
  }

  drawEffectsFront(ctx,x,y,facing,h){
    for(const e of this.effects){
      const t=1-e.life/e.max,a=clamp(e.life/e.max); ctx.save();ctx.translate(x,y);ctx.scale(facing,1);
      if(e.type==="slash"){
        ctx.globalAlpha=.72*a;ctx.lineCap="round";
        const r=h*(.42+.08*e.power);ctx.lineWidth=7+4*e.power;
        const g=ctx.createLinearGradient(0,-r,r,0);g.addColorStop(0,"rgba(255,255,255,0)");g.addColorStop(.5,"rgba(255,239,166,.95)");g.addColorStop(1,"rgba(255,199,74,0)");ctx.strokeStyle=g;
        ctx.beginPath();ctx.arc(20,-h*.46,r,-1.15+t*.35,.72+t*.28);ctx.stroke();
      } else if(e.type==="block"){
        ctx.globalAlpha=.55*a;ctx.strokeStyle="#ffe8a1";ctx.lineWidth=5;ctx.beginPath();ctx.arc(-18,-h*.47,h*.27*(1+.24*t),0,Math.PI*2);ctx.stroke();
      } else if(e.type==="heal"){
        ctx.globalAlpha=.65*a;ctx.fillStyle="#fff0b0";
        for(let i=0;i<5;i++){const ang=i*1.256+t*2;ctx.beginPath();ctx.arc(Math.cos(ang)*h*.16,-h*.48+Math.sin(ang)*h*.10,2.2+1.5*a,0,Math.PI*2);ctx.fill();}
      }
      ctx.restore();
    }
  }
}
