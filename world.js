const BG=new Image(),F1=new Image(),F2=new Image(),R=new Image(),C=new Image(),T=new Image();
BG.src="broken-castle-landscape.jpg";F1.src="fall-left.png";F2.src="fall-right.png";R.src="rift.png";C.src="clouds.png";T.src="trees.png";
const S={w:1536,h:887},B={"f1": [641, 437, 729, 616], "f2": [1054, 495, 1136, 675], "r": [876, 0, 1267, 201], "c": [0, 106, 856, 363], "tr": [0, 361, 917, 697]};
function M(y,cam){let s=Math.max(W/S.w,y/S.h),sw=W/s,sh=y/s,mx=Math.max(0,S.w-sw),my=Math.max(0,S.h-sh),n=Math.max(0,Math.min(1,(cam-35)/1065));return{s,sw,sh,sx:mx*n,sy:my*.42}}
function rect(b,m){return{x:(b[0]-m.sx)*m.s,y:(b[1]-m.sy)*m.s,w:(b[2]-b[0])*m.s,h:(b[3]-b[1])*m.s}}
function L(img,b,m,a,fn,screen=false){if(!img.complete||!img.naturalWidth)return;let q=rect(b,m);ctx.save();ctx.beginPath();ctx.rect(q.x,q.y,q.w,q.h);ctx.clip();ctx.globalAlpha=a;if(screen)ctx.globalCompositeOperation="screen";fn(q);ctx.restore()}
function bg(){
 let y=gy(),cam=P?P.x:0,t=performance.now()/1000,m=M(y,cam);ctx.fillStyle="#050508";ctx.fillRect(0,0,W,H);
 if(BG.complete&&BG.naturalWidth)ctx.drawImage(BG,m.sx,m.sy,m.sw,m.sh,0,0,W,y);
 // source pixels only; all transforms hard-clipped to fixed masks
 L(C,B.c,m,.18,q=>ctx.drawImage(C,q.x+Math.sin(t*.08)*3,q.y,q.w,q.h));
 L(T,B.tr,m,.14,q=>{ctx.translate(q.x+q.w/2,q.y+q.h);ctx.rotate(Math.sin(t*.65)*.0018);ctx.drawImage(T,-q.w/2,-q.h,q.w,q.h)});
 // Falls never translate. Brightness phase makes water appear to flow without moving cliff/ground.
 let pulse1=.5+.5*Math.sin(t*3.2),pulse2=.5+.5*Math.sin(t*3.2+1.7);
 L(F1,B.f1,m,.22+pulse1*.10,q=>{ctx.filter=`brightness(${1.03+pulse1*.22})`;ctx.drawImage(F1,q.x,q.y,q.w,q.h);ctx.filter="none"},true);
 L(F2,B.f2,m,.22+pulse2*.10,q=>{ctx.filter=`brightness(${1.03+pulse2*.22})`;ctx.drawImage(F2,q.x,q.y,q.w,q.h);ctx.filter="none"},true);
 let p=.5+.5*Math.sin(t*1.8);
 L(R,B.r,m,.24+p*.11,q=>{ctx.filter=`brightness(${1.02+p*.2}) drop-shadow(0 0 ${4+p*5}px rgba(170,80,255,.45))`;ctx.translate(q.x+q.w/2,q.y+q.h/2);ctx.rotate(Math.sin(t*.28)*.0025);ctx.drawImage(R,-q.w/2,-q.h,q.w,q.h);ctx.filter="none"},true);
 ctx.fillStyle="#171318";ctx.fillRect(0,y-8,W,8);ctx.fillStyle="#09090c";ctx.fillRect(0,y,W,H-y);
 const bw=52,bh=25;for(let row=0;row<7;row++){let off=(row&1)*26-((cam*.65)%bw);for(let x=-bw;x<W+bw;x+=bw){let xx=x+off,v=11+((row*7+Math.floor(x/bw)*5)%7);ctx.fillStyle=`rgb(${v},${v-1},${v+2})`;ctx.fillRect(xx,y+row*bh,bw-2,bh-2);ctx.strokeStyle="#3a3036";ctx.lineWidth=.8;ctx.strokeRect(xx,y+row*bh,bw-2,bh-2)}}
}