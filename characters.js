const races=["Human","Orc","Elf","Dragonborn","Demon","Angel","Fallen Angel","Tiefling","Vampire","Werewolf"],classes=["Knight","Mage","Witch","Samurai","Ronin","Ninja"];
const classData={Knight:["Longsword + Shield","Heavy plate + cape"],Mage:["Arcane Staff","Layered robes"],Witch:["Ritual Blade + Grimoire","Occult robes"],Samurai:["Curved Sword","Lamellar armor"],Ronin:["Weathered Curved Sword","Light armor + cloak"],Ninja:["Short Blade","Dark light armor + mask"]};
const raceData={Human:["#aaa","#721c2b"],Orc:["#718064","#543a32"],Elf:["#b4aaa2","#486052"],Dragonborn:["#68717b","#633440"],Demon:["#7b3942","#24151a"],Angel:["#c9c6c1","#d7d2b0"],"Fallen Angel":["#77727d","#28232d"],Tiefling:["#925064","#38202b"],Vampire:["#d1c9cd","#501827"],Werewolf:["#5d554f","#332c29"]};

function hasRace(r){return race===r||race2===r}

function fcdPath(points,fill,stroke,w=1){
  ctx.beginPath();ctx.moveTo(points[0][0],points[0][1]);
  for(let i=1;i<points.length;i++)ctx.lineTo(points[i][0],points[i][1]);
  ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=w;ctx.stroke()}
}
function angelWing(side){
  ctx.save();ctx.scale(side,1);
  let rows=[
    [[8,-50],[22,-72],[37,-83],[31,-60],[15,-35]],
    [[10,-45],[31,-65],[48,-70],[37,-48],[16,-28]],
    [[12,-39],[37,-52],[55,-52],[42,-34],[17,-20]]
  ];
  rows.forEach((p,ri)=>{
    fcdPath(p,ri===0?"#eee9dc":ri===1?"#ddd7c8":"#c9c1b1","#8f806b",.8);
    for(let i=0;i<4;i++){
      let ox=18+ri*6+i*7, oy=-62+ri*10+i*3;
      fcdPath([[ox,oy],[ox+13,-68+ri*11+i*3],[ox+8,-48+ri*9+i*4],[ox-2,-37+ri*7+i*4]],i%2?"#f5f0e4":"#d8d1c2","#aa9d88",.45)
    }
  });ctx.restore()
}
function wings(dark){
  if(dark){ctx.save();ctx.globalAlpha=.92;for(let s of [-1,1]){ctx.scale(s,1);fcdPath([[8,-49],[25,-74],[47,-75],[36,-48],[14,-23]],"#312c35","#6c6070",1);ctx.scale(s,1)}ctx.restore();return}
  angelWing(-1);angelWing(1)
}
function tail(col){ctx.strokeStyle=col;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-8,-22);ctx.quadraticCurveTo(-38,-8,-29,12);ctx.stroke()}
function horns(big){ctx.fillStyle="#c6b9a5";for(let q of [-1,1]){ctx.beginPath();ctx.moveTo(q*5,-69);ctx.quadraticCurveTo(q*(big?18:13),-78,q*(big?17:14),big?-91:-82);ctx.lineTo(q*(big?9:8),-77);ctx.fill()}}
function raceBack(){if(hasRace("Angel"))wings(false);if(hasRace("Fallen Angel"))wings(true);if(hasRace("Demon")||hasRace("Tiefling")||hasRace("Dragonborn"))tail(hasRace("Dragonborn")?"#59636d":"#6d2838")}
function raceFront(){if(hasRace("Demon"))horns(true);else if(hasRace("Tiefling")||hasRace("Dragonborn"))horns(false);
if(hasRace("Elf")||hasRace("Tiefling")){ctx.fillStyle="#baa";for(let q of [-1,1]){ctx.beginPath();ctx.moveTo(q*8,-64);ctx.lineTo(q*22,-68);ctx.lineTo(q*9,-57);ctx.fill()}}
if(hasRace("Orc")){ctx.fillStyle="#e0d4bd";ctx.fillRect(-8,-57,3,7);ctx.fillRect(5,-57,3,7)}
if(hasRace("Vampire")){ctx.fillStyle="#c5223c";ctx.fillRect(-6,-65,3,2);ctx.fillRect(3,-65,3,2)}
if(hasRace("Werewolf")){ctx.fillStyle="#4a433e";ctx.beginPath();ctx.moveTo(-9,-70);ctx.lineTo(-15,-83);ctx.lineTo(-3,-74);ctx.fill();ctx.beginPath();ctx.moveTo(9,-70);ctx.lineTo(15,-83);ctx.lineTo(3,-74);ctx.fill()}
if(hasRace("Angel")||hasRace("Fallen Angel")){ctx.save();ctx.shadowBlur=9;ctx.shadowColor=hasRace("Fallen Angel")?"#80698d":"#ffe99a";ctx.strokeStyle=hasRace("Fallen Angel")?"#75677b":"#f5dfa0";ctx.lineWidth=2.2;ctx.beginPath();ctx.ellipse(0,-88,14,4,0,0,7);ctx.stroke();ctx.restore()}}

function angelKnightGear(){
  const gold="#b8914d", gold2="#e0c47b", steel="#8d9198", dark="#292a2e", ivory="#d9d2bf";
  // rear tabard / cloth
  fcdPath([[-12,-29],[-18,-4],[-8,1],[0,-22]],"#b9b09c","#665c50",.8);
  fcdPath([[12,-29],[18,-4],[8,1],[0,-22]],"#d8d0bb","#665c50",.8);
  ctx.strokeStyle=gold;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,-22);ctx.lineTo(0,-2);ctx.stroke();
  // articulated greaves
  for(let q of [-1,1]){
    ctx.fillStyle=dark;ctx.fillRect(q*4-(q<0?7:0),-19,7,18);
    fcdPath([[q*4,-18],[q*12,-17],[q*11,-8],[q*4,-8]],steel,gold,.8);
    fcdPath([[q*4,-7],[q*12,-7],[q*13,0],[q*4,0]],"#696d74",gold,.8);
  }
  // torso cuirass
  fcdPath([[-15,-51],[-20,-43],[-14,-18],[0,-13],[14,-18],[20,-43],[15,-51]],"#777b82",gold,1.2);
  fcdPath([[-10,-48],[0,-53],[10,-48],[8,-25],[0,-20],[-8,-25]],"#a3a5a7",gold2,.9);
  // breastplate ribs + central celestial cross
  ctx.strokeStyle="#c7c8c7";ctx.lineWidth=.8;
  for(let y=-43;y<-26;y+=6){ctx.beginPath();ctx.moveTo(-10,y);ctx.quadraticCurveTo(0,y+3,10,y);ctx.stroke()}
  ctx.strokeStyle=gold2;ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(0,-45);ctx.lineTo(0,-28);ctx.moveTo(-5,-39);ctx.lineTo(5,-39);ctx.stroke();
  // pauldrons
  for(let q of [-1,1]){
    ctx.beginPath();ctx.fillStyle="#666a71";ctx.arc(q*17,-47,8,Math.PI,Math.PI*2);ctx.fill();ctx.strokeStyle=gold;ctx.lineWidth=1.2;ctx.stroke();
    ctx.strokeStyle=gold2;ctx.beginPath();ctx.moveTo(q*12,-47);ctx.lineTo(q*22,-47);ctx.stroke()
  }
  // arms / gauntlets
  for(let q of [-1,1]){
    fcdPath([[q*16,-43],[q*23,-40],[q*20,-25],[q*13,-28]],"#555960",gold,.8);
    fcdPath([[q*14,-29],[q*21,-27],[q*19,-20],[q*12,-22]],"#777b82",gold,.7);
  }
  // belt
  ctx.fillStyle="#3b3028";ctx.fillRect(-15,-21,30,4);ctx.strokeStyle=gold;ctx.strokeRect(-15,-21,30,4);
  ctx.beginPath();ctx.fillStyle=gold;ctx.arc(0,-19,4,0,7);ctx.fill();ctx.fillStyle="#3c3429";ctx.beginPath();ctx.arc(0,-19,2,0,7);ctx.fill();
  // shield, layered with sun sigil
  ctx.save();ctx.translate(-22,-35);
  fcdPath([[-11,-13],[8,-15],[15,-7],[12,15],[0,25],[-12,15],[-15,-7]],"#686d73",gold2,1.5);
  fcdPath([[-8,-10],[6,-11],[11,-5],[8,12],[0,19],[-8,11],[-11,-5]],"#85888c","#c9b477",.8);
  ctx.strokeStyle=gold2;ctx.lineWidth=1;ctx.beginPath();ctx.arc(0,1,6,0,7);ctx.stroke();
  for(let a=0;a<Math.PI*2;a+=Math.PI/4){ctx.beginPath();ctx.moveTo(Math.cos(a)*6,1+Math.sin(a)*6);ctx.lineTo(Math.cos(a)*10,1+Math.sin(a)*10);ctx.stroke()}
  ctx.restore();
  // sword: idle diagonal, attack extended
  ctx.save();ctx.translate(14,-31);ctx.rotate(P.atk?-.48:-.72);
  ctx.fillStyle="#d9d9d6";ctx.strokeStyle=gold;ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(-2,2);ctx.lineTo(2,2);ctx.lineTo(3,-37);ctx.lineTo(0,-45);ctx.lineTo(-3,-37);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.fillStyle=gold;ctx.fillRect(-8,1,16,3);ctx.fillStyle="#4b3426";ctx.fillRect(-2,4,4,10);ctx.fillStyle=gold2;ctx.beginPath();ctx.arc(0,15,2.4,0,7);ctx.fill();ctx.restore();
  // helmet after armor, before face accents
  fcdPath([[-10,-69],[-6,-78],[0,-82],[7,-77],[11,-68],[8,-56],[-8,-56]],"#666a70",gold,1);
  fcdPath([[-8,-68],[0,-75],[8,-68],[7,-62],[-7,-62]],"#303136",gold2,.7);
  ctx.strokeStyle="#d4b568";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,-79);ctx.lineTo(0,-58);ctx.stroke();
  ctx.fillStyle="#ece4d1";ctx.fillRect(-5,-66,3,1.5);ctx.fillRect(2,-66,3,1.5);
}
function hero(){let x=Math.max(55,Math.min(W*.42,P.x)),y=Math.min(gy(),Math.max(90,P.y)),bob=P.on?Math.sin(performance.now()/180)*.8:0;ctx.save();ctx.translate(x,y+bob);ctx.scale(1.38,1.38);if(P.face<0)ctx.scale(-1,1);
ctx.fillStyle="#0009";ctx.beginPath();ctx.ellipse(0,3,25,6,0,0,7);ctx.fill();raceBack();
if(hasRace("Angel")&&cls==="Knight"){
  angelKnightGear();raceFront();ctx.restore();return;
}
let rd=raceData[race];
ctx.fillStyle=rd[1];ctx.beginPath();ctx.moveTo(-8,-48);ctx.quadraticCurveTo(-25,-31,-35,-3);ctx.lineTo(5,-11);ctx.closePath();ctx.fill();
ctx.fillStyle="#34343a";ctx.fillRect(-11,-18,8,18);ctx.fillRect(4,-18,8,18);ctx.fillStyle="#696971";ctx.fillRect(-12,-5,9,5);ctx.fillRect(4,-5,9,5);
gear();ctx.fillStyle=hasRace("Vampire")?"#d5cdd2":hasRace("Orc")?"#718064":hasRace("Demon")?"#7b3942":hasRace("Tiefling")?"#925064":hasRace("Werewolf")?"#5d554f":rd[0];
if(hasRace("Dragonborn")||hasRace("Werewolf")){ctx.beginPath();ctx.moveTo(-10,-66);ctx.lineTo(0,-78);ctx.lineTo(14,-64);ctx.lineTo(8,-54);ctx.lineTo(-8,-54);ctx.closePath();ctx.fill()}else{ctx.beginPath();ctx.arc(0,-63,10,0,Math.PI*2);ctx.fill()}
ctx.fillStyle="#202128";ctx.fillRect(-10,-72,20,5);ctx.fillStyle="#ddd";ctx.globalAlpha=.65;ctx.fillRect(-6,-65,4,2);ctx.fillRect(3,-65,4,2);ctx.globalAlpha=1;raceFront();ctx.restore()}