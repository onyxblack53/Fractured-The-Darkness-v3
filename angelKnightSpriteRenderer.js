// FRACTURED Angel Knight sprite renderer v6
// Every source sheet is 2172x724 = FOUR 543x724 horizontal frames.

const FRAME_WIDTH=543;
const FRAME_HEIGHT=724;

export const SPRITE_ANIMS={
  idle:    {src:"./idle.png?v=6",    frames:4,fps:5, loop:true},
  walk:    {src:"./run.png?v=6",     frames:4,fps:7, loop:true},
  run:     {src:"./run.png?v=6",     frames:4,fps:10,loop:true},
  jump:    {src:"./jump.png?v=6",    frames:4,fps:8, loop:false},
  fall:    {src:"./jump.png?v=6",    frames:4,fps:7, loop:true},
  land:    {src:"./idle.png?v=6",    frames:4,fps:8, loop:false},
  block:   {src:"./block.png?v=6",   frames:4,fps:7, loop:true},
  blockHit:{src:"./block.png?v=6",   frames:4,fps:11,loop:false},
  dodge:   {src:"./dash.png?v=6",    frames:4,fps:13,loop:false},
  heal:    {src:"./idle.png?v=6",    frames:4,fps:5, loop:false},
  hit:     {src:"./block.png?v=6",   frames:4,fps:10,loop:false},
  death:   {src:"./block.png?v=6",   frames:4,fps:4, loop:false},
  attack1: {src:"./attack1.png?v=6", frames:4,fps:11,loop:false},
  attack2: {src:"./attack2.png?v=6", frames:4,fps:12,loop:false},
  attack3: {src:"./attack3.png?v=6", frames:4,fps:12,loop:false}
};

export class AngelKnightSpriteRenderer{
  constructor(){
    this.images={};
    this.state="idle";
    this.frame=0;
    this.time=0;
    this.ready=false;
    this.pending=0;

    for(const [name,cfg] of Object.entries(SPRITE_ANIMS)){
      const img=new Image();
      this.pending++;
      img.onload=()=>{
        this.pending--;
        if(this.pending<=0)this.ready=true;
      };
      img.onerror=()=>{
        this.pending--;
        if(this.pending<=0)this.ready=true;
      };
      img.src=cfg.src;
      this.images[name]=img;
    }
  }

  setState(next,force=false){
    if(!SPRITE_ANIMS[next])next="idle";
    if(!force&&this.state===next)return;
    this.state=next;
    this.frame=0;
    this.time=0;
  }

  update(dt,eventHandler){
    const cfg=SPRITE_ANIMS[this.state]||SPRITE_ANIMS.idle;
    this.time+=dt;
    const frameDuration=1/cfg.fps;

    while(this.time>=frameDuration){
      this.time-=frameDuration;
      this.frame++;

      if(this.frame>=cfg.frames){
        if(cfg.loop){
          this.frame=0;
        }else{
          this.frame=cfg.frames-1;
          return "finished";
        }
      }

      // Gameplay timing events.
      if(this.state==="attack1"&&this.frame===2){
        eventHandler?.("hit",{hitbox:{x:34,y:-92,w:118,h:76,damage:20,knockback:220}});
      }
      if(this.state==="attack2"&&this.frame===2){
        eventHandler?.("hit",{hitbox:{x:28,y:-105,w:135,h:86,damage:25,knockback:260}});
      }
      if(this.state==="attack3"&&this.frame===2){
        eventHandler?.("hit",{hitbox:{x:24,y:-118,w:155,h:100,damage:36,knockback:330}});
      }
      if(this.state==="dodge"&&this.frame===1)eventHandler?.("iframeOn",{});
      if(this.state==="dodge"&&this.frame===3)eventHandler?.("iframeOff",{});
      if(this.state==="heal"&&this.frame===2)eventHandler?.("heal",{});
    }

    return null;
  }

  draw(ctx,x,groundY,facing=1,targetHeight=190){
    const cfg=SPRITE_ANIMS[this.state]||SPRITE_ANIMS.idle;
    const img=this.images[this.state]||this.images.idle;
    if(!img||!img.complete||!img.naturalWidth)return;

    const frame=Math.min(this.frame,cfg.frames-1);
    const sx=frame*FRAME_WIDTH;

    // Keep correct 543:724 character frame ratio.
    const targetWidth=targetHeight*(FRAME_WIDTH/FRAME_HEIGHT);
    const drawX=x-targetWidth/2;
    const drawY=groundY-targetHeight;

    ctx.save();

    if(facing<0){
      ctx.translate(x,0);
      ctx.scale(-1,1);
      ctx.translate(-x,0);
    }

    // Only ONE frame is drawn at the same world position every time.
    ctx.drawImage(
      img,
      sx,0,FRAME_WIDTH,FRAME_HEIGHT,
      drawX,drawY,targetWidth,targetHeight
    );

    ctx.restore();
  }
}
