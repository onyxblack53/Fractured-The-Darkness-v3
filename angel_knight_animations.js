// FRACTURED Angel Knight animation definitions v5
// 2172 x 724 source sheet, FOUR horizontal frames.
// 2172 / 4 = 543 pixels per frame.

export const ANGEL_KNIGHT_ANIMATIONS = {
  idle:{src:'./idle.png?v=5',frames:4,frameWidth:543,frameHeight:724,fps:5,loop:true},
  run:{src:'./run.png?v=5',frames:4,frameWidth:543,frameHeight:724,fps:9,loop:true},
  jump:{src:'./jump.png?v=5',frames:4,frameWidth:543,frameHeight:724,fps:8,loop:false,next:'idle'},
  block:{src:'./block.png?v=5',frames:4,frameWidth:543,frameHeight:724,fps:7,loop:true},
  dash:{src:'./dash.png?v=5',frames:4,frameWidth:543,frameHeight:724,fps:12,loop:false,next:'idle'},
  attack1:{src:'./attack1.png?v=5',frames:4,frameWidth:543,frameHeight:724,fps:10,loop:false,next:'idle'},
  attack2:{src:'./attack2.png?v=5',frames:4,frameWidth:543,frameHeight:724,fps:11,loop:false,next:'idle'},
  attack3:{src:'./attack3.png?v=5',frames:4,frameWidth:543,frameHeight:724,fps:11,loop:false,next:'idle'}
};

export class AngelKnightAnimator{
  constructor(){
    this.animations={};
    this.current='idle';
    this.frame=0;
    this.time=0;
    this.facing='right';
    this.comboStep=0;
  }

  async load(){
    for(const [name,cfg] of Object.entries(ANGEL_KNIGHT_ANIMATIONS)){
      const image=new Image();
      image.src=cfg.src;
      await image.decode();
      this.animations[name]={...cfg,image};
    }
    return this;
  }

  setFacing(direction){
    if(direction==='left'||direction==='right')this.facing=direction;
  }

  play(name,force=false){
    if(!this.animations[name])return;
    if(!force&&this.current===name)return;
    this.current=name;
    this.frame=0;
    this.time=0;
  }

  attackCombo(){
    const order=['attack1','attack2','attack3'];
    this.play(order[this.comboStep%order.length],true);
    this.comboStep++;
  }

  update(dt){
    const a=this.animations[this.current];
    if(!a)return;

    this.time+=dt;
    const frameDuration=1/a.fps;

    while(this.time>=frameDuration){
      this.time-=frameDuration;
      this.frame++;

      if(this.frame>=a.frames){
        if(a.loop)this.frame=0;
        else{
          this.play(a.next||'idle',true);
          return;
        }
      }
    }
  }

  draw(ctx,x,y,width,height){
    const a=this.animations[this.current];
    if(!a)return;

    const sx=this.frame*a.frameWidth;

    ctx.save();
    if(this.facing==='left'){
      ctx.translate(x+width/2,0);
      ctx.scale(-1,1);
      ctx.translate(-(x+width/2),0);
    }

    ctx.drawImage(
      a.image,
      sx,0,a.frameWidth,a.frameHeight,
      x,y,width,height
    );

    ctx.restore();
  }

  trigger(action){
    if(action==='attack')this.attackCombo();
    else this.play(action,true);
  }
}
