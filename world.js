const BROKEN_CASTLE_BG=new Image();BROKEN_CASTLE_BG.src="broken-castle-landscape.jpg";
function bg(){
 const y=gy(),cam=P?P.x:0,t=performance.now()/1000;
 ctx.fillStyle="#050508";ctx.fillRect(0,0,W,H);
 if(BROKEN_CASTLE_BG.complete&&BROKEN_CASTLE_BG.naturalWidth){
  const iw=BROKEN_CASTLE_BG.naturalWidth,ih=BROKEN_CASTLE_BG.naturalHeight,s=Math.max(W/iw,y/ih),sw=W/s,sh=y/s,maxX=Math.max(0,iw-sw),maxY=Math.max(0,ih-sh),n=Math.max(0,Math.min(1,(cam-35)/1065));
  ctx.drawImage(BROKEN_CASTLE_BG,maxX*n,maxY*.42,sw,sh,0,0,W,y);
 }
 // drifting clouds around moon
 ctx.save();ctx.globalAlpha=.11;ctx.fillStyle="#34131f";
 for(let b=0;b<3;b++)for(let i=-2;i<7;i++){let x=((i*W/5+t*(3+b*1.2))%(W+W/5))-W/5,yy=y*(.12+b*.08)+Math.sin(i*1.7+b)*7;ctx.beginPath();ctx.ellipse(x,yy,70+b*22,12+b*4,0,0,7);ctx.fill()}ctx.restore();
 // swirling rift + breathing light beam
 const rx=W*.665,ry=y*.19,p=.5+.5*Math.sin(t*2.3);ctx.save();ctx.globalCompositeOperation="screen";
 let beam=ctx.createLinearGradient(rx-45,0,rx+45,0);beam.addColorStop(0,"#7b31ff00");beam.addColorStop(.5,`rgba(197,126,255,${.08+p*.09})`);beam.addColorStop(1,"#7b31ff00");ctx.fillStyle=beam;ctx.fillRect(rx-45,0,90,y*.48);
 ctx.translate(rx,ry);ctx.rotate(t*.12);ctx.shadowColor="#b64cff";ctx.shadowBlur=16+p*15;
 for(let i=0;i<6;i++){ctx.globalAlpha=.12+i*.05;ctx.strokeStyle=i%2?"#ce7aff":"#8137d7";ctx.lineWidth=1.2+i*.3;ctx.beginPath();ctx.ellipse(0,0,54+i*13,10+i*3,i*.34+t*.04,0,7);ctx.stroke()}ctx.restore();
 // flowing waterfall highlights
 ctx.save();ctx.globalCompositeOperation="screen";
 for(const f of [[.755,.47,.03,.29],[.815,.50,.022,.24]]){let x=W*f[0],yy=y*f[1],w=W*f[2],h=y*f[3],wg=ctx.createLinearGradient(x,yy,x+w,yy);wg.addColorStop(0,"#cbd7ef00");wg.addColorStop(.5,"rgba(220,230,250,.16)");wg.addColorStop(1,"#cbd7ef00");ctx.fillStyle=wg;ctx.fillRect(x,yy,w,h);ctx.strokeStyle="rgba(230,235,255,.17)";for(let i=0;i<6;i++){let xx=x+(i+.5)*w/6,o=(t*42+i*13)%17;for(let sy=yy+o;sy<yy+h;sy+=17){ctx.beginPath();ctx.moveTo(xx,sy);ctx.lineTo(xx+Math.sin(t*2+i)*1.2,Math.min(yy+h,sy+8));ctx.stroke()}}ctx.globalAlpha=.14+.04*Math.sin(t*3);ctx.fillStyle="#e3e4ef";ctx.beginPath();ctx.ellipse(x+w/2,yy+h,w*1.5,4,0,0,7);ctx.fill();ctx.globalAlpha=1}ctx.restore();
 // subtle wind movement layered into tree line
 ctx.save();ctx.strokeStyle="rgba(4,6,7,.28)";ctx.fillStyle="rgba(4,6,7,.18)";
 for(let i=0;i<20;i++){let x=(i+.3)*W/20,h=y*(.055+(i%5)*.008),base=y*.76,sway=Math.sin(t*.75+i*.71)*(1.7+(i%3)*.4);ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(x,base);ctx.quadraticCurveTo(x+sway*.3,base-h*.5,x+sway,base-h);ctx.stroke();for(let k=1;k<5;k++){let yy=base-h+k*h*.15,w=k*h*.065;ctx.beginPath();ctx.moveTo(x+sway*(1-k/6),yy);ctx.lineTo(x-w+sway*.35,yy+h*.13);ctx.lineTo(x+w+sway*.35,yy+h*.13);ctx.fill()}}ctx.restore();
 // moving mist
 ctx.save();ctx.fillStyle="#b7a9bc";for(let i=0;i<6;i++){ctx.globalAlpha=.025+(i%2)*.012;let x=((i*W/4+t*4)%(W+180))-90;ctx.beginPath();ctx.ellipse(x,y*(.68+(i%3)*.035),115,10,0,0,7);ctx.fill()}ctx.restore();
 // unchanged flat walkable bridge
 ctx.fillStyle="#171318";ctx.fillRect(0,y-8,W,8);ctx.fillStyle="#09090c";ctx.fillRect(0,y,W,H-y);
 const bw=52,bh=25;for(let row=0;row<7;row++){let off=(row&1)*26-((cam*.65)%bw);for(let x=-bw;x<W+bw;x+=bw){let xx=x+off,v=11+((row*7+Math.floor(x/bw)*5)%7);ctx.fillStyle=`rgb(${v},${v-1},${v+2})`;ctx.fillRect(xx,y+row*bh,bw-2,bh-2);ctx.strokeStyle="#3a3036";ctx.lineWidth=.8;ctx.strokeRect(xx,y+row*bh,bw-2,bh-2)}}
}