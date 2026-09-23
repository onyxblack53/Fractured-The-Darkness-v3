// FRACTURED v7 live Character tab preview
const canvas=document.getElementById("character-preview");
if(canvas){
  const ctx=canvas.getContext("2d");
  const frames=[];
  for(let i=0;i<4;i++){const img=new Image();img.src=`./angel_frames/idle/${i}.png?v=7`;frames.push(img)}
  let frame=0,timer=0,last=performance.now();
  const equipmentVisuals={head:"celestialHelm",chest:"seraphPlate",arms:"vambraces",legs:"greaves"};
  const overlayCache=new Map();
  function getOverlay(key){
    if(!key)return null;
    if(overlayCache.has(key))return overlayCache.get(key);
    const img=new Image();img.src=`./armor_visuals/${key}.png?v=7`;overlayCache.set(key,img);return img;
  }
  function loop(now){
    const dt=(now-last)/1000;last=now;timer+=dt;
    if(timer>=.2){timer=0;frame=(frame+1)%4}
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const img=frames[frame];
    if(img?.complete&&img.naturalWidth){
      const size=Math.min(canvas.width,canvas.height)*.92;
      const x=(canvas.width-size)/2;
      const y=canvas.height-size*.98;
      ctx.drawImage(img,x,y,size,size);
      for(const key of Object.values(equipmentVisuals)){
        const overlay=getOverlay(key);
        if(overlay?.complete&&overlay.naturalWidth)ctx.drawImage(overlay,x,y,size,size);
      }
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
  window.FRACTURED=window.FRACTURED||{};
  window.FRACTURED.setCharacterEquipmentVisual=(slot,itemKey)=>{equipmentVisuals[slot]=itemKey;};
}
