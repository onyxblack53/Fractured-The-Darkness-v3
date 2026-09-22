// FRACTURED - Angel Knight Character Input / Animation Controller v1
export const CHARACTER_ANIMS = {
  idle:{fps:5,loop:true,frames:["assets/characters/angel-knight/idle/0.png","assets/characters/angel-knight/idle/1.png","assets/characters/angel-knight/idle/2.png"]},
  run:{fps:10,loop:true,frames:["assets/characters/angel-knight/run/0.png","assets/characters/angel-knight/run/1.png","assets/characters/angel-knight/run/2.png","assets/characters/angel-knight/run/3.png"]},
  jump:{fps:8,loop:false,frames:["assets/characters/angel-knight/jump/0.png","assets/characters/angel-knight/jump/1.png","assets/characters/angel-knight/jump/2.png"]},
  block:{fps:8,loop:true,frames:["assets/characters/angel-knight/block/0.png","assets/characters/angel-knight/block/1.png"]},
  dodge:{fps:12,loop:false,frames:["assets/characters/angel-knight/dodge/0.png","assets/characters/angel-knight/dodge/1.png","assets/characters/angel-knight/dodge/2.png"]},
  attack1:{fps:12,loop:false,frames:["assets/characters/angel-knight/attack1/0.png","assets/characters/angel-knight/attack1/1.png","assets/characters/angel-knight/attack1/2.png","assets/characters/angel-knight/attack1/3.png"]},
  attack2:{fps:12,loop:false,frames:["assets/characters/angel-knight/attack2/0.png","assets/characters/angel-knight/attack2/1.png","assets/characters/angel-knight/attack2/2.png","assets/characters/angel-knight/attack2/3.png"]},
  attack3:{fps:12,loop:false,frames:["assets/characters/angel-knight/attack3/0.png","assets/characters/angel-knight/attack3/1.png","assets/characters/angel-knight/attack3/2.png","assets/characters/angel-knight/attack3/3.png"]}
};

export class AngelKnightInputController {
  constructor({groundY=0,width=120,height=120}={}){
    this.x=220; this.yOffset=0; this.width=width; this.height=height; this.groundY=groundY;
    this.facing=1; this.state="idle"; this.frameIndex=0; this.frameTimer=0;
    this.speed=4; this.velocityY=0; this.gravity=.75; this.jumpForce=-14;
    this.isJumping=false; this.actionLock=false; this.comboStep=0;
    this.hp=100; this.stamina=100;
    this.input={left:false,right:false,down:false,block:false};
    this.images={};
    this._preload();
  }

  _preload(){
    for(const state in CHARACTER_ANIMS){
      this.images[state]=CHARACTER_ANIMS[state].frames.map(src=>{const img=new Image();img.src=src;return img;});
    }
  }

  setGround(y){ this.groundY=y; }

  setState(next){
    if(this.state===next)return;
    this.state=next; this.frameIndex=0; this.frameTimer=0;
  }

  jump(){
    if(this.isJumping||this.actionLock)return;
    this.isJumping=true; this.actionLock=true; this.velocityY=this.jumpForce; this.setState("jump");
  }

  dodge(){
    if(this.isJumping||this.actionLock)return;
    this.actionLock=true; this.setState("dodge");
  }

  attack(){
    if(this.isJumping||this.actionLock)return;
    this.comboStep++; if(this.comboStep>3)this.comboStep=1;
    this.actionLock=true; this.setState(`attack${this.comboStep}`);
  }

  heal(){
    if(this.actionLock||this.hp>=100)return;
    this.hp=Math.min(100,this.hp+20);
  }

  update(delta){
    this._movement(); this._physics(); this._animation(delta);
  }

  _movement(){
    if(this.actionLock)return;
    let moving=false;
    if(this.input.left){ this.x-=this.speed; this.facing=-1; moving=true; }
    if(this.input.right){ this.x+=this.speed; this.facing=1; moving=true; }
    const maxX=Math.max(0,window.innerWidth-this.width);
    this.x=Math.max(0,Math.min(maxX,this.x));
    if(!this.isJumping){
      if(this.input.block)this.setState("block");
      else if(moving)this.setState("run");
      else this.setState("idle");
    }
  }

  _physics(){
    if(!this.isJumping)return;
    this.velocityY+=this.gravity;
    this.yOffset+=this.velocityY;
    if(this.yOffset>=0){
      this.yOffset=0; this.velocityY=0; this.isJumping=false; this.actionLock=false; this.setState("idle");
    }
  }

  _animation(delta){
    const anim=CHARACTER_ANIMS[this.state]; if(!anim)return;
    this.frameTimer+=delta;
    const frameDuration=1000/anim.fps;
    if(this.frameTimer<frameDuration)return;
    this.frameTimer=0; this.frameIndex++;
    if(this.frameIndex<anim.frames.length)return;
    if(anim.loop){ this.frameIndex=0; return; }
    this.frameIndex=anim.frames.length-1;
    if(this.state==="jump"||this.state==="dodge"||this.state.startsWith("attack")){
      this.actionLock=false; this.setState("idle");
    }
  }

  draw(ctx){
    const frames=this.images[this.state];
    if(!frames?.length)return;
    const img=frames[this.frameIndex];
    if(!img||!img.complete||!img.naturalWidth)return;
    const drawX=this.x;
    const drawY=this.groundY-this.height+this.yOffset;
    ctx.save();
    if(this.facing===-1){
      ctx.translate(drawX+this.width/2,0);
      ctx.scale(-1,1);
      ctx.drawImage(img,-this.width/2,drawY,this.width,this.height);
    }else{
      ctx.drawImage(img,drawX,drawY,this.width,this.height);
    }
    ctx.restore();
  }
}

export function bindAngelKnightControls(player){
  const byId=id=>document.getElementById(id);
  const jump=byId("jumpBtn")||byId("jump-btn");
  const attack=byId("attackBtn")||byId("attack-btn");
  const dodge=byId("dodgeBtn")||byId("dodge-btn");
  const heal=byId("healBtn")||byId("heal-btn");
  const block=byId("blockBtn")||byId("block-btn");
  const joystick=byId("joystick")||byId("move-pad");
  const stick=byId("stick")||byId("move-knob");

  jump?.addEventListener("pointerdown",e=>{e.preventDefault();player.jump();});
  attack?.addEventListener("pointerdown",e=>{e.preventDefault();player.attack();});
  dodge?.addEventListener("pointerdown",e=>{e.preventDefault();player.dodge();});
  heal?.addEventListener("pointerdown",e=>{e.preventDefault();player.heal();});

  if(block){
    const off=()=>player.input.block=false;
    block.addEventListener("pointerdown",e=>{e.preventDefault();player.input.block=true;});
    block.addEventListener("pointerup",off);
    block.addEventListener("pointercancel",off);
  }

  if(joystick&&stick){
    let active=false,cx=0,cy=0;
    const reset=()=>{
      active=false;
      stick.style.transform="translate(0px,0px)";
      player.input.left=false; player.input.right=false; player.input.down=false;
    };
    joystick.addEventListener("pointerdown",e=>{
      active=true; joystick.setPointerCapture?.(e.pointerId);
      const r=joystick.getBoundingClientRect();
      cx=r.left+r.width/2; cy=r.top+r.height/2;
    });
    joystick.addEventListener("pointermove",e=>{
      if(!active)return;
      const dx=e.clientX-cx,dy=e.clientY-cy,max=42,len=Math.hypot(dx,dy)||1,dist=Math.min(max,len);
      const tx=dx/len*dist,ty=dy/len*dist;
      stick.style.transform=`translate(${tx}px,${ty}px)`;
      player.input.left=tx<-12; player.input.right=tx>12; player.input.down=ty>18;
    });
    joystick.addEventListener("pointerup",reset);
    joystick.addEventListener("pointercancel",reset);
  }
}
