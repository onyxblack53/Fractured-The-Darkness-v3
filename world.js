const BG=new Image(),CLOUDS=new Image(),TREES=new Image(),FALLS=new Image(),RIFT=new Image();
BG.src="broken-castle-landscape.jpg";CLOUDS.src="clouds-layer.png";TREES.src="trees-layer.png";FALLS.src="waterfall-layer.png";RIFT.src="rift-layer.png";
const SRC={w:1536,h:887,clouds:[0,0,930,360],trees:[0,300,1536,720],falls:[970,355,1375,825],rift:[830,0,1305,520]};
function coverMap(y,cam){
 const s=Math.max(W/SRC.w,y/SRC.h),sw=W/s,sh=y/s,maxX=Math.max(0,SRC.w-sw),maxY=Math.max(0,SRC.h-sh);
 const n=Math.max(0,Math.min(1,(cam-35)/1065));
 return {s,sw,sh,sx:maxX*n,sy:maxY*.42};
}
function layer(img,box,m,dx,dy,rot,scale,alpha){
 if(!img.complete||!img.naturalWidth)return;
 const [x0,y0,x1,y1]=box,ix0=Math.max(x0,m.sx),iy0=Math.max(y0,m.sy),ix1=Math.min(x1,m.sx+m.sw),iy1=Math.min(y1,m.sy+m.sh);
 if(ix1<=ix0||iy1<=iy0)return;
 const sx=ix0-x0,sy=iy0-y0,sw=ix1-ix0,sh=iy1-iy0;
 const dw=sw*m.s,dh=sh*m.s,cx=(ix0-m.sx)*m.s+dw/2+dx,cy=(iy0-m.sy)*m.s+dh/2+dy;
 ctx.save();ctx.globalAlpha=alpha;ctx.translate(cx,cy);ctx.rotate(rot);ctx.scale(scale,scale);
 ctx.drawImage(img,sx,sy,sw,sh,-dw/2,-dh/2,dw,dh);ctx.restore();
}
function bg(){
 const y=gy(),cam=P?P.x:0,t=performance.now()/1000,m=coverMap(y,cam);
 ctx.fillStyle="#050508";ctx.fillRect(0,0,W,H);
 if(BG.complete&&BG.naturalWidth)ctx.drawImage(BG,m.sx,m.sy,m.sw,m.sh,0,0,W,y);

 // ACTUAL IMAGE PIXELS animate: no generated clouds/trees/water/rift shapes.
 // Cloud pixels drift very slowly.
 layer(CLOUDS,SRC.clouds,m,Math.sin(t*.10)*7,Math.sin(t*.07)*1.5,0,1,.34);

 // Forest pixels sway by tiny rotation/scale around their crop center.
 layer(TREES,SRC.trees,m,Math.sin(t*.75)*1.8,0,Math.sin(t*.72)*.0022,1+Math.sin(t*.55)*.0015,.22);

 // Waterfall pixels scroll down subtly using two real-pixel copies.
 const fy=(t*13)%18;
 layer(FALLS,SRC.falls,m,0,fy,0,1,.24);
 layer(FALLS,SRC.falls,m,0,fy-18,0,1,.12);

 // Rift itself breathes/rotates using its real pixels; glow is the same layer, not drawn geometry.
 const pulse=.5+.5*Math.sin(t*2.1);
 ctx.save();ctx.globalCompositeOperation="screen";ctx.filter=`brightness(${1.03+pulse*.20}) drop-shadow(0 0 ${5+pulse*7}px rgba(166,75,255,.55))`;
 layer(RIFT,SRC.rift,m,0,Math.sin(t*.5)*1.2,Math.sin(t*.35)*.004,1+Math.sin(t*.8)*.004,.36+pulse*.12);
 ctx.restore();

 // Existing gameplay bridge/collision plane.
 ctx.fillStyle="#171318";ctx.fillRect(0,y-8,W,8);ctx.fillStyle="#09090c";ctx.fillRect(0,y,W,H-y);
 const bw=52,bh=25;for(let row=0;row<7;row++){let off=(row&1)*26-((cam*.65)%bw);for(let x=-bw;x<W+bw;x+=bw){let xx=x+off,v=11+((row*7+Math.floor(x/bw)*5)%7);ctx.fillStyle=`rgb(${v},${v-1},${v+2})`;ctx.fillRect(xx,y+row*bh,bw-2,bh-2);ctx.strokeStyle="#3a3036";ctx.lineWidth=.8;ctx.strokeRect(xx,y+row*bh,bw-2,bh-2)}}
}