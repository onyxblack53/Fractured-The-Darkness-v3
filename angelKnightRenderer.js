import { POSES,CLIPS,POSE_SHEET } from "./angelKnightAnimations.js";

export class AngelKnightRenderer{
  constructor(){
    this.image=new Image();
    this.image.src=POSE_SHEET;
    this.ready=false;
    this.image.onload=()=>this.ready=true;

    this.state="idle";
    this.frameIndex=0;
    this.frameTime=0;
    this.prevPose=null;
    this.crossfade=1;
    this.crossfadeSpeed=.12;
    this.eventLatch=new Set();
  }

  setState(next,force=false){
    if(!CLIPS[next])return;
    if(!force&&next===this.state)return;

    const current=this.currentFrame();
    this.prevPose=current?{...current}:null;
    this.state=next;
    this.frameIndex=0;
    this.frameTime=0;
    this.crossfade=0;
    this.eventLatch.clear();
  }

  clip(){return CLIPS[this.state]}

  currentFrame(){
    const clip=this.clip();
    return clip?.frames?.[this.frameIndex]??null;
  }

  update(dt,eventHandler){
    const clip=this.clip();
    if(!clip)return;

    this.crossfade=Math.min(1,this.crossfade+dt/this.crossfadeSpeed);
    this.frameTime+=dt*1000;

    let frame=this.currentFrame();
    if(!frame)return;

    const eventKey=`${this.state}:${this.frameIndex}:${frame.event||""}`;

    if(frame.event&&!this.eventLatch.has(eventKey)){
      this.eventLatch.add(eventKey);
      eventHandler?.(frame.event,frame);
    }

    while(this.frameTime>=frame.duration){
      this.frameTime-=frame.duration;
      this.frameIndex++;

      if(this.frameIndex>=clip.frames.length){
        if(clip.loop){
          this.frameIndex=0;
          this.eventLatch.clear();
        }else{
          this.frameIndex=clip.frames.length-1;
          return "finished";
        }
      }

      frame=this.currentFrame();
      this.prevPose=null;
      this.crossfade=1;
    }

    return null;
  }

  draw(ctx,worldX,worldY,facing=1,targetHeight=315,alpha=1){
    if(!this.ready)return;

    const frame=this.currentFrame();
    if(!frame)return;

    if(this.prevPose&&this.crossfade<1){
      this.drawFrame(ctx,this.prevPose,worldX,worldY,facing,targetHeight,alpha*(1-this.crossfade));
    }

    this.drawFrame(ctx,frame,worldX,worldY,facing,targetHeight,alpha*this.crossfade);
  }

  drawFrame(ctx,frame,x,y,facing,targetHeight,alpha){
    const p=POSES[frame.pose];
    if(!p)return;

    const scale=(targetHeight/p.sh)*(frame.scale??1);
    const dw=p.sw*scale;
    const dh=p.sh*scale;
    const localFacing=frame.flipPose?-facing:facing;

    ctx.save();
    ctx.globalAlpha=Math.max(0,Math.min(1,alpha));
    ctx.translate(x+(frame.x??0)*facing,y+(frame.y??0));
    ctx.rotate(frame.rot??0);
    ctx.scale(localFacing,1);

    const dx=-dw*p.ax;
    const dy=-dh*p.ay;

    // Detailed pose-sheet artwork only. No primitive body construction.
    ctx.drawImage(this.image,p.sx,p.sy,p.sw,p.sh,dx,dy,dw,dh);
    ctx.restore();
  }
}
