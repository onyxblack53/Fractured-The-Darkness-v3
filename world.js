const BROKEN_CASTLE_BG=new Image();
BROKEN_CASTLE_BG.src="broken-castle-landscape.jpg";

function bg(){
  const y=gy(), cam=P?P.x:0;
  ctx.fillStyle="#050508";
  ctx.fillRect(0,0,W,H);

  if(BROKEN_CASTLE_BG.complete && BROKEN_CASTLE_BG.naturalWidth){
    const iw=BROKEN_CASTLE_BG.naturalWidth, ih=BROKEN_CASTLE_BG.naturalHeight;

    // Render the supplied landscape ONLY behind the gameplay surface.
    // "cover" keeps the screen filled without stretching/distorting the artwork.
    const scale=Math.max(W/iw,y/ih);
    const srcW=W/scale, srcH=y/scale;
    const maxX=Math.max(0,iw-srcW), maxY=Math.max(0,ih-srcH);

    // Tiny horizontal parallax; clamp so no blank edge can appear.
    const normalized=Math.max(0,Math.min(1,(cam-35)/(1100-35)));
    const sx=maxX*normalized;
    const sy=maxY*.42;

    ctx.drawImage(BROKEN_CASTLE_BG,sx,sy,srcW,srcH,0,0,W,y);
  }

  // The image stops exactly at gy(). Everything below this is game geometry.
  // Flat stone bridge/walkable platform; player collision uses the same y value.
  ctx.fillStyle="#171318";
  ctx.fillRect(0,y-8,W,8);
  ctx.fillStyle="#09090c";
  ctx.fillRect(0,y,W,H-y);

  const bw=52,bh=25;
  for(let row=0;row<7;row++){
    const offset=(row&1)*26-((cam*.65)%bw);
    for(let x=-bw;x<W+bw;x+=bw){
      const xx=x+offset;
      const v=11+((row*7+Math.floor(x/bw)*5)%7);
      ctx.fillStyle=`rgb(${v},${v-1},${v+2})`;
      ctx.fillRect(xx,y+row*bh,bw-2,bh-2);
      ctx.strokeStyle="#3a3036";
      ctx.lineWidth=.8;
      ctx.strokeRect(xx,y+row*bh,bw-2,bh-2);
    }
  }
}