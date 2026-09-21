const races=["Human","Orc","Elf","Dragonborn","Demon","Angel","Fallen Angel","Tiefling","Vampire","Werewolf"],classes=["Knight","Mage","Witch","Samurai","Ronin","Ninja"];
const classData={Knight:["Longsword + Shield","Heavy plate + cape"],Mage:["Arcane Staff","Layered robes"],Witch:["Ritual Blade + Grimoire","Occult robes"],Samurai:["Curved Sword","Lamellar armor"],Ronin:["Weathered Curved Sword","Light armor + cloak"],Ninja:["Short Blade","Dark light armor + mask"]};
const raceData={Human:["#aaa","#721c2b"],Orc:["#718064","#543a32"],Elf:["#b4aaa2","#486052"],Dragonborn:["#68717b","#633440"],Demon:["#7b3942","#24151a"],Angel:["#c9c6c1","#d7d2b0"],"Fallen Angel":["#77727d","#28232d"],Tiefling:["#925064","#38202b"],Vampire:["#d1c9cd","#501827"],Werewolf:["#5d554f","#332c29"]};

function hasRace(r){return race===r||race2===r}
function wings(dark){ctx.save();let base=dark?"#302b35":"#d8d5cc",edge=dark?"#625666":"#f0ede2";for(let q of [-1,1]){for(let i=0;i<5;i++){ctx.fillStyle=i%2?edge:base;ctx.beginPath();ctx.moveTo(q*(7+i*2),-48+i*3);ctx.quadraticCurveTo(q*(28+i*5),-76+i*4,q*(48-i*2),-65+i*12);ctx.quadraticCurveTo(q*(34+i*2),-43+i*7,q*10,-29);ctx.fill()}}ctx.restore()}
function tail(col){ctx.strokeStyle=col;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-8,-22);ctx.quadraticCurveTo(-38,-8,-29,12);ctx.stroke()}
function horns(big){ctx.fillStyle="#c6b9a5";for(let q of [-1,1]){ctx.beginPath();ctx.moveTo(q*5,-69);ctx.quadraticCurveTo(q*(big?18:13),-78,q*(big?17:14),big?-91:-82);ctx.lineTo(q*(big?9:8),-77);ctx.fill()}}
function raceBack(){if(hasRace("Angel"))wings(false);if(hasRace("Fallen Angel"))wings(true);if(hasRace("Demon")||hasRace("Tiefling")||hasRace("Dragonborn"))tail(hasRace("Dragonborn")?"#59636d":"#6d2838")}
function raceFront(){if(hasRace("Demon"))horns(true);else if(hasRace("Tiefling")||hasRace("Dragonborn"))horns(false);
if(hasRace("Elf")||hasRace("Tiefling")){ctx.fillStyle="#baa";for(let q of [-1,1]){ctx.beginPath();ctx.moveTo(q*8,-64);ctx.lineTo(q*22,-68);ctx.lineTo(q*9,-57);ctx.fill()}}
if(hasRace("Orc")){ctx.fillStyle="#e0d4bd";ctx.fillRect(-8,-57,3,7);ctx.fillRect(5,-57,3,7)}
if(hasRace("Vampire")){ctx.fillStyle="#c5223c";ctx.fillRect(-6,-65,3,2);ctx.fillRect(3,-65,3,2)}
if(hasRace("Werewolf")){ctx.fillStyle="#4a433e";ctx.beginPath();ctx.moveTo(-9,-70);ctx.lineTo(-15,-83);ctx.lineTo(-3,-74);ctx.fill();ctx.beginPath();ctx.moveTo(9,-70);ctx.lineTo(15,-83);ctx.lineTo(3,-74);ctx.fill()}
if(hasRace("Angel")||hasRace("Fallen Angel")){ctx.strokeStyle=hasRace("Fallen Angel")?"#75677b":"#e0d8a5";ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,-84,13,4,0,0,7);ctx.stroke()}}
function hero(){let x=Math.max(55,Math.min(W*.42,P.x)),y=Math.min(gy(),Math.max(90,P.y)),bob=P.on?Math.sin(performance.now()/180)*.8:0;ctx.save();ctx.translate(x,y+bob);ctx.scale(1.38,1.38);if(P.face<0)ctx.scale(-1,1);
ctx.fillStyle="#0009";ctx.beginPath();ctx.ellipse(0,3,25,6,0,0,7);ctx.fill();raceBack();let rd=raceData[race];
ctx.fillStyle=rd[1];ctx.beginPath();ctx.moveTo(-8,-48);ctx.quadraticCurveTo(-25,-31,-35,-3);ctx.lineTo(5,-11);ctx.closePath();ctx.fill();
ctx.fillStyle="#34343a";ctx.fillRect(-11,-18,8,18);ctx.fillRect(4,-18,8,18);ctx.fillStyle="#696971";ctx.fillRect(-12,-5,9,5);ctx.fillRect(4,-5,9,5);
gear();ctx.fillStyle=hasRace("Vampire")?"#d5cdd2":hasRace("Orc")?"#718064":hasRace("Demon")?"#7b3942":hasRace("Tiefling")?"#925064":hasRace("Werewolf")?"#5d554f":rd[0];
if(hasRace("Dragonborn")||hasRace("Werewolf")){ctx.beginPath();ctx.moveTo(-10,-66);ctx.lineTo(0,-78);ctx.lineTo(14,-64);ctx.lineTo(8,-54);ctx.lineTo(-8,-54);ctx.closePath();ctx.fill()}else{ctx.beginPath();ctx.arc(0,-63,10,0,Math.PI*2);ctx.fill()}
ctx.fillStyle="#202128";ctx.fillRect(-10,-72,20,5);ctx.fillStyle="#ddd";ctx.globalAlpha=.65;ctx.fillRect(-6,-65,4,2);ctx.fillRect(3,-65,4,2);ctx.globalAlpha=1;raceFront();ctx.restore()}
