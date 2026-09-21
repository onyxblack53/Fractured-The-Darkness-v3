import { AngelKnightRenderer } from "./angelKnightRenderer.js";
import { CLIPS } from "./angelKnightAnimations.js";

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

export class Player {
  constructor(x=585,y=555){
    this.x=x;this.y=y;this.vx=0;this.vy=0;this.facing=1;
    this.speed=285;this.runSpeed=405;this.jumpPower=700;this.gravity=1920;this.groundY=y;this.onGround=true;this.crouching=false;
    this.maxHp=100;this.hp=100;this.maxStamina=100;this.stamina=100;this.invulnerable=false;this.isBlocking=false;this.dead=false;
    this.comboStep=0;this.comboBuffer=0;this.comboAccept=false;this.state="idle";this.renderer=new AngelKnightRenderer();this.activeHitbox=null;
    this.input={moveX:0,moveY:0,jump:false,attack:false,block:false,dodge:false,heal:false};
  }
  setInput(v){this.input={...this.input,...v};}
  setState(s,force=false){if(this.state===s&&!force)return;this.state=s;this.renderer.setState(s,force);}
  canCancel(){return !this.dead&&!CLIPS[this.state]?.lock;}
  requestAttack(){
    if(this.dead)return;
    if(this.state.startsWith("attack")){this.comboBuffer=.34;return;}
    if(this.stamina<8||this.isBlocking)return;
    this.stamina-=8;this.comboStep=1;this.comboBuffer=0;this.setState("attack1",true);
  }
  damage(amount,fromX=this.x){
    if(this.dead||this.invulnerable)return false;
    if(this.isBlocking){this.stamina=Math.max(0,this.stamina-14);this.setState("blockHit",true);return true;}
    this.hp=Math.max(0,this.hp-amount);this.facing=fromX<this.x?-1:1;
    if(this.hp<=0){this.dead=true;this.vx=0;this.setState("death",true);}else this.setState("hit",true);
    return true;
  }
  heal(){if(this.dead||this.hp>=this.maxHp||this.stamina<18||CLIPS[this.state]?.lock)return;this.stamina-=18;this.setState("heal",true);}
  dodge(){if(this.dead||this.stamina<22||CLIPS[this.state]?.lock)return;this.stamina-=22;const dir=this.input.moveX?Math.sign(this.input.moveX):this.facing;this.facing=dir;this.vx=dir*690;this.setState("dodge",true);}
  jump(){if(this.dead||!this.onGround||CLIPS[this.state]?.lock)return;this.onGround=false;this.vy=-this.jumpPower;this.setState("jump",true);}
  handleAnimationEvent(name,frame){
    if(name==="iframeOn")this.invulnerable=true;
    if(name==="iframeOff")this.invulnerable=false;
    if(name==="heal")this.hp=Math.min(this.maxHp,this.hp+32);
    if(name==="hit")this.activeHitbox={...frame.hitbox,ttl:.085};
    if(name==="comboOpen")this.comboAccept=true;
    if(name==="jumpRelease")this.comboAccept=false;
    if(name==="landImpact")this.vx*=.72;
  }
  continueCombo(){
    if(this.comboBuffer<=0)return false;
    if(this.state==="attack1"&&this.stamina>=8){this.stamina-=8;this.comboStep=2;this.comboBuffer=0;this.comboAccept=false;this.setState("attack2",true);return true;}
    if(this.state==="attack2"&&this.stamina>=12){this.stamina-=12;this.comboStep=3;this.comboBuffer=0;this.comboAccept=false;this.setState("attack3",true);return true;}
    return false;
  }
  update(dt){
    this.stamina=Math.min(this.maxStamina,this.stamina+(this.isBlocking?7:19)*dt);
    if(this.comboBuffer>0)this.comboBuffer-=dt;
    if(this.activeHitbox){this.activeHitbox.ttl-=dt;if(this.activeHitbox.ttl<=0)this.activeHitbox=null;}

    const anim=this.renderer.update(dt,(n,f)=>this.handleAnimationEvent(n,f));
    if(this.dead){this.vy+=this.gravity*dt;this.y=Math.min(this.groundY,this.y+this.vy*dt);return;}

    if(anim==="finished"){
      if((this.state==="attack1"||this.state==="attack2")&&this.continueCombo()){}
      else if(this.state==="jump")this.setState("fall",true);
      else if(["attack1","attack2","attack3","dodge","heal","hit","blockHit","land"].includes(this.state)){
        this.comboStep=0;this.comboAccept=false;this.invulnerable=false;this.setState(this.input.block&&this.onGround?"block":"idle",true);
      }
    }

    if(this.input.attack){this.input.attack=false;this.requestAttack();}
    if(this.input.dodge){this.input.dodge=false;this.dodge();}
    if(this.input.heal){this.input.heal=false;this.heal();}
    if(this.input.jump){this.input.jump=false;this.jump();}

    this.isBlocking=!!this.input.block&&this.onGround&&!this.state.startsWith("attack")&&!CLIPS[this.state]?.lock;
    if(this.isBlocking&&this.state!=="block")this.setState("block");
    else if(!this.input.block&&this.state==="block")this.setState("idle");

    const locked=CLIPS[this.state]?.lock;const mx=clamp(this.input.moveX,-1,1);const crouch=this.input.moveY>.52&&this.onGround;
    if(!locked&&!this.isBlocking){
      if(crouch){this.crouching=true;this.vx+=(0-this.vx)*Math.min(1,14*dt);this.setState("crouch");}
      else {this.crouching=false;if(Math.abs(mx)>.08){this.facing=Math.sign(mx);const max=Math.abs(mx)>.78?this.runSpeed:this.speed;const desired=mx*max;this.vx+=(desired-this.vx)*Math.min(1,15*dt);if(this.onGround)this.setState(Math.abs(mx)>.78?"run":"walk");}else{this.vx+=(0-this.vx)*Math.min(1,19*dt);if(this.onGround&&!['land','block'].includes(this.state))this.setState("idle");}}
    } else if(this.state!=="dodge") this.vx*=Math.max(0,1-4.5*dt);

    if(!this.onGround){this.vy+=this.gravity*dt;this.y+=this.vy*dt;if(this.vy>70&&!this.state.startsWith("attack")&&this.state!=="dodge")this.setState("fall");if(this.y>=this.groundY){this.y=this.groundY;this.vy=0;this.onGround=true;this.setState("land",true);}}
    this.x+=this.vx*dt;
    const margin=Math.min(100,innerWidth*.11);this.x=clamp(this.x,margin,innerWidth-margin);
  }
  draw(ctx){this.renderer.draw(ctx,this.x,this.y,this.facing,this.crouching?292:344,1);}
  getWorldHitbox(){if(!this.activeHitbox)return null;const h=this.activeHitbox;return{x:this.facing>0?this.x+h.x:this.x-h.x-h.w,y:this.y+h.y,w:h.w,h:h.h,damage:h.damage,knockback:h.knockback};}
}
