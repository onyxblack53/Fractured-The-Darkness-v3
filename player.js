import { AngelKnightRenderer } from "./angelKnightRenderer.js";
import { CLIPS } from "./angelKnightAnimations.js";

export class Player {
  constructor(x=585, y=555) {
    this.x=x; this.y=y;
    this.vx=0; this.vy=0;
    this.facing=1;
    this.speed=270;
    this.runSpeed=390;
    this.jumpPower=690;
    this.gravity=1900;
    this.groundY=y;
    this.onGround=true;
    this.crouching=false;

    this.maxHp=100; this.hp=100;
    this.maxStamina=100; this.stamina=100;
    this.invulnerable=false;
    this.isBlocking=false;
    this.dead=false;

    this.comboStep=0;
    this.comboWindow=0;
    this.attackQueued=false;
    this.state="idle";
    this.renderer=new AngelKnightRenderer();

    this.input={moveX:0,moveY:0,jump:false,attack:false,block:false,dodge:false,heal:false};
    this.activeHitbox=null;
  }

  setInput(input){ this.input={...this.input,...input}; }

  canAct(){
    const clip=CLIPS[this.state];
    return !this.dead && !(clip?.lock);
  }

  requestAttack(){
    if(this.dead) return;
    if(this.state.startsWith("attack")){
      if(this.comboWindow>0) this.attackQueued=true;
      return;
    }
    if(this.stamina<8) return;
    this.stamina-=8;
    this.comboStep=1;
    this.comboWindow=.42;
    this.setState("attack1",true);
  }

  setState(s,force=false){
    if(this.state===s && !force) return;
    this.state=s;
    this.renderer.setState(s,force);
  }

  damage(amount, fromX=this.x){
    if(this.dead || this.invulnerable) return false;
    if(this.isBlocking){
      amount*=.25;
      this.stamina=Math.max(0,this.stamina-14);
      this.setState("blockHit",true);
      return true;
    }
    this.hp=Math.max(0,this.hp-amount);
    this.facing = fromX < this.x ? -1 : 1;
    if(this.hp<=0){
      this.dead=true; this.vx=0; this.setState("death",true);
    } else this.setState("hit",true);
    return true;
  }

  heal(){
    if(this.dead || this.hp>=this.maxHp || this.stamina<18) return;
    this.stamina-=18;
    this.setState("heal",true);
  }

  dodge(){
    if(this.dead || this.stamina<22) return;
    this.stamina-=22;
    const dir = this.input.moveX !== 0 ? Math.sign(this.input.moveX) : this.facing;
    this.facing=dir;
    this.vx=dir*640;
    this.setState("dodge",true);
  }

  jump(){
    if(this.dead || !this.onGround) return;
    this.onGround=false;
    this.vy=-this.jumpPower;
    this.setState("jump",true);
  }

  handleAnimationEvent(name, frame){
    if(name==="iframeOn") this.invulnerable=true;
    if(name==="iframeOff") this.invulnerable=false;
    if(name==="heal") this.hp=Math.min(this.maxHp,this.hp+32);
    if(name==="hit"){
      this.activeHitbox={...frame.hitbox, ttl:.075};
    }
  }

  update(dt){
    this.stamina=Math.min(this.maxStamina,this.stamina+18*dt);
    if(this.comboWindow>0) this.comboWindow-=dt;
    if(this.activeHitbox){
      this.activeHitbox.ttl-=dt;
      if(this.activeHitbox.ttl<=0) this.activeHitbox=null;
    }

    const animResult=this.renderer.update(dt,(name,frame)=>this.handleAnimationEvent(name,frame));

    if(this.dead){
      this.vy+=this.gravity*dt;
      this.y=Math.min(this.groundY,this.y+this.vy*dt);
      return;
    }

    if(animResult==="finished"){
      if(this.state==="attack1" && this.attackQueued){
        this.attackQueued=false; this.comboStep=2; this.stamina=Math.max(0,this.stamina-8);
        this.setState("attack2",true);
      } else if(this.state==="attack2" && this.attackQueued){
        this.attackQueued=false; this.comboStep=3; this.stamina=Math.max(0,this.stamina-12);
        this.setState("attack3",true);
      } else if(this.state==="jump"){
        this.setState("fall",true);
      } else if(["attack1","attack2","attack3","dodge","heal","hit","blockHit","land"].includes(this.state)){
        this.comboStep=0;
        this.invulnerable=false;
        this.setState("idle",true);
      }
    }

    if(this.input.attack){ this.input.attack=false; this.requestAttack(); }
    if(this.input.dodge){ this.input.dodge=false; this.dodge(); }
    if(this.input.heal){ this.input.heal=false; this.heal(); }
    if(this.input.jump){ this.input.jump=false; this.jump(); }

    this.isBlocking=!!this.input.block && this.onGround && !this.state.startsWith("attack");
    if(this.isBlocking && !CLIPS[this.state]?.lock) this.setState("block");
    else if(!this.input.block && this.state==="block") this.setState("idle");

    const locked=CLIPS[this.state]?.lock;
    const mx=Math.max(-1,Math.min(1,this.input.moveX));
    const crouch=this.input.moveY>.55 && this.onGround;

    if(!locked && !this.isBlocking){
      if(crouch){
        this.crouching=true;
        this.vx*=Math.max(0,1-10*dt);
        this.setState("crouch");
      } else {
        this.crouching=false;
        if(Math.abs(mx)>.08){
          this.facing=Math.sign(mx);
          const desired=mx*this.speed;
          this.vx += (desired-this.vx)*Math.min(1,14*dt);
          if(this.onGround) this.setState(Math.abs(mx)>.78 ? "run" : "walk");
        } else {
          this.vx += (0-this.vx)*Math.min(1,18*dt);
          if(this.onGround && !["land","block"].includes(this.state)) this.setState("idle");
        }
      }
    } else {
      this.vx *= Math.max(0,1-3.5*dt);
    }

    if(!this.onGround){
      this.vy+=this.gravity*dt;
      this.y+=this.vy*dt;
      if(this.vy>80 && !["dodge","attack1","attack2","attack3"].includes(this.state)) this.setState("fall");
      if(this.y>=this.groundY){
        this.y=this.groundY; this.vy=0; this.onGround=true;
        if(!CLIPS[this.state]?.lock) this.setState("land",true);
      }
    }

    this.x+=this.vx*dt;
    this.x=Math.max(90,Math.min(1080,this.x));
  }

  draw(ctx){
    const targetHeight=this.crouching?285:330;
    this.renderer.draw(ctx,this.x,this.y,this.facing,targetHeight,1);
  }

  getWorldHitbox(){
    if(!this.activeHitbox) return null;
    const h=this.activeHitbox;
    return {
      x:this.facing>0 ? this.x+h.x : this.x-h.x-h.w,
      y:this.y+h.y,
      w:h.w,h:h.h,
      damage:h.damage,knockback:h.knockback
    };
  }
}
