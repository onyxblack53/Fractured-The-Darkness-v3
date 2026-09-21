export function bindControls(player){
  const $=id=>document.getElementById(id);
  const pad=$("move-pad"), knob=$("move-knob");
  let padPointer=null;

  const updatePad=(e)=>{
    const r=pad.getBoundingClientRect();
    const cx=r.left+r.width/2, cy=r.top+r.height/2;
    let dx=e.clientX-cx, dy=e.clientY-cy;
    const max=r.width*.32;
    const len=Math.hypot(dx,dy)||1;
    if(len>max){dx=dx/len*max;dy=dy/len*max}
    knob.style.transform=`translate(${dx}px,${dy}px)`;
    player.input.moveX=Math.max(-1,Math.min(1,dx/max));
    player.input.moveY=Math.max(-1,Math.min(1,dy/max));
  };

  pad.addEventListener("pointerdown",e=>{
    padPointer=e.pointerId; pad.setPointerCapture(e.pointerId); updatePad(e);
  });
  pad.addEventListener("pointermove",e=>{if(e.pointerId===padPointer)updatePad(e)});
  const endPad=e=>{
    if(e.pointerId!==padPointer)return;
    padPointer=null; knob.style.transform="translate(0,0)";
    player.input.moveX=0; player.input.moveY=0;
  };
  pad.addEventListener("pointerup",endPad);
  pad.addEventListener("pointercancel",endPad);

  const pulse=(id,key)=>{
    const b=$(id);
    b.addEventListener("pointerdown",e=>{
      e.preventDefault(); b.classList.add("pressed"); player.input[key]=true;
    });
    const end=()=>b.classList.remove("pressed");
    b.addEventListener("pointerup",end); b.addEventListener("pointercancel",end);
  };
  pulse("jump-btn","jump");
  pulse("attack-btn","attack");
  pulse("dodge-btn","dodge");
  pulse("heal-btn","heal");

  const block=$("block-btn");
  const blockOn=e=>{e.preventDefault();block.classList.add("pressed");player.input.block=true};
  const blockOff=()=>{block.classList.remove("pressed");player.input.block=false};
  block.addEventListener("pointerdown",blockOn);
  block.addEventListener("pointerup",blockOff);
  block.addEventListener("pointercancel",blockOff);

  // Desktop test controls.
  const down=new Set();
  window.addEventListener("keydown",e=>{
    if(down.has(e.code))return; down.add(e.code);
    if(e.code==="KeyA"||e.code==="ArrowLeft")player.input.moveX=-1;
    if(e.code==="KeyD"||e.code==="ArrowRight")player.input.moveX=1;
    if(e.code==="KeyS"||e.code==="ArrowDown")player.input.moveY=1;
    if(e.code==="Space")player.input.jump=true;
    if(e.code==="KeyJ")player.input.attack=true;
    if(e.code==="KeyK")player.input.dodge=true;
    if(e.code==="KeyH")player.input.heal=true;
    if(e.code==="KeyL")player.input.block=true;
  });
  window.addEventListener("keyup",e=>{
    down.delete(e.code);
    if(["KeyA","ArrowLeft"].includes(e.code) && player.input.moveX<0)player.input.moveX=0;
    if(["KeyD","ArrowRight"].includes(e.code) && player.input.moveX>0)player.input.moveX=0;
    if(["KeyS","ArrowDown"].includes(e.code))player.input.moveY=0;
    if(e.code==="KeyL")player.input.block=false;
  });

  // Ability buttons are wired as hooks for the existing FRACTURED ability system.
  ["ability1-btn","ability2-btn","ability3-btn"].forEach((id,i)=>{
    $(id).addEventListener("pointerdown",()=>{
      window.dispatchEvent(new CustomEvent("fractured:ability",{detail:{slot:i+1,player}}));
    });
  });
}
