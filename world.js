const WORLD_BG=new Image();WORLD_BG.src="broken-castle-bg.jpg";
function bg(){
 const y=gy(),cam=P?P.x:0;
 ctx.fillStyle="#07070b";ctx.fillRect(0,0,W,H);
 if(WORLD_BG.complete&&WORLD_BG.naturalWidth){
   const iw=WORLD_BG.naturalWidth,ih=WORLD_BG.naturalHeight;
   // cover the gameplay sky/scene while keeping the bridge/player plane visible.
   const scale=Math.max(W/iw,y/ih),sw=W/scale,sh=y/scale;
   // subtle camera drift gives the static concept a game-world feel without distorting it.
   const maxX=Math.max(0,iw-sw),sx=Math.min(maxX,Math.max(0,maxX*.5+(cam-300)*.018));
   const sy=Math.max(0,(ih-sh)*.42);
   ctx.drawImage(WORLD_BG,sx,sy,sw,sh,0,0,W,y);
 } else {
   let g=ctx.createLinearGradient(0,0,0,y);g.addColorStop(0,"#160711");g.addColorStop(1,"#08080d");
   ctx.fillStyle=g;ctx.fillRect(0,0,W,y);
 }
 // collision/readability strip aligned to the foreground bridge
 ctx.fillStyle="rgba(5,5,8,.32)";ctx.fillRect(0,y-5,W,5);
 ctx.fillStyle="#08080b";ctx.fillRect(0,y,W,H-y);
 ctx.strokeStyle="#332b31";ctx.lineWidth=1;
 for(let row=0;row<5;row++){let off=(row%2)*24-((cam*.62)%48);for(let x=-48;x<W+48;x+=48)ctx.strokeRect(x+off,y+row*24,46,22)}
}