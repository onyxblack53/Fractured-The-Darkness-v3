const ItemDB={
 divineSword:{name:"Divine Longsword",type:"Weapons",rarity:"Legendary",icon:"⚔",desc:"A blade blessed by the heavens. Forged from a fallen star, it radiates a faint light in the presence of darkness.",stats:{Attack:125,"Magic Attack":40,"Critical Chance":"10%","Holy Damage":"+60",Weight:4.2}},
 aegis:{name:"Aegis Shield",type:"Armor",rarity:"Legendary",icon:"🛡",stats:{Defense:82,"Magic Defense":45,Weight:6.8}},
 celestialHelm:{name:"Celestial Helm",type:"Armor",rarity:"Epic",icon:"⛑",stats:{Defense:36,Faith:5}},
 seraphPlate:{name:"Seraphic Plate",type:"Armor",rarity:"Epic",icon:"♜",stats:{Defense:74,Vitality:6}},
 vambraces:{name:"Knight Vambraces",type:"Armor",rarity:"Rare",icon:"♟",stats:{Defense:24,Strength:3}},
 greaves:{name:"Templar Greaves",type:"Armor",rarity:"Rare",icon:"♞",stats:{Defense:31,Stamina:15}},
 halo:{name:"Halo Pendant",type:"Accessories",rarity:"Epic",icon:"✦",stats:{Faith:6,"Holy Damage":"+12"}},
 seraphBand:{name:"Seraph's Band",type:"Accessories",rarity:"Rare",icon:"◉",stats:{"Critical Chance":"+3%"}},
 valorRing:{name:"Valor Ring",type:"Accessories",rarity:"Rare",icon:"◌",stats:{Strength:4}},
 tear:{name:"Heaven's Tear",type:"Materials",rarity:"Legendary",icon:"◆",stats:{Faith:8}},
 potion:{name:"Health Potion",type:"Consumables",rarity:"Common",icon:"♦",qty:5,stats:{Restore:"250 HP"}},
 torch:{name:"Torch",type:"Consumables",rarity:"Common",icon:"🔥",qty:3},
 bow:{name:"Ashwood Bow",type:"Weapons",rarity:"Rare",icon:"➳",stats:{Attack:76,Dexterity:5}},
 crystal:{name:"Rift Crystal",type:"Materials",rarity:"Epic",icon:"◆",qty:12},
 scroll:{name:"Ancient Scroll",type:"Quest Items",rarity:"Quest",icon:"▤",qty:7}
};

const inventory=["divineSword","aegis","celestialHelm","seraphPlate","vambraces","greaves","halo","seraphBand","valorRing","tear","potion","torch","bow","crystal","scroll"];
const equipment={head:"celestialHelm",chest:"seraphPlate",arms:"vambraces",legs:"greaves",main:"divineSword",off:"aegis",amulet:"halo",ring1:"seraphBand",ring2:"valorRing",relic:"tear",consumable:"potion",quick:"torch"};
const baseStats={Health:1250,Mana:320,Stamina:240,Strength:38,Dexterity:22,Intelligence:18,Faith:36,Vitality:26,Attack:20,"Magic Attack":52,Defense:45,"Magic Defense":123,"Critical Chance":"12%","Critical Damage":"150%","Attack Speed":"1.20","Movement Speed":"1.8"};

let selectedItem="divineSword";
let inventoryFilter="All";

function currentBuild(){return window.FRACTURED?.buildConfig||{races:["Human"],className:"Knight"}}
function hasRace(name){return currentBuild().races?.includes(name)}

function totalStats(){
 const o={...baseStats};
 for(const k in equipment){
   const it=ItemDB[equipment[k]];
   if(!it?.stats)continue;
   for(const n in it.stats){
     const v=it.stats[n];
     if(typeof v==="number"&&typeof o[n]==="number")o[n]+=v;
   }
 }
 return o;
}

function itemCard(id){
 const i=ItemDB[id];
 return `<button class="itemCard ${selectedItem===id?"selected":""}" data-item="${id}"><span>${i.icon}</span>${i.qty?`<b>${i.qty}</b>`:""}</button>`;
}

function equipSlot(slot,label){
 const id=equipment[slot],i=id&&ItemDB[id];
 return `<button class="equipSlot"><span class="equipIcon">${i?i.icon:"+"}</span><span><small>${label}</small><strong>${i?i.name:"Empty"}</strong></span></button>`;
}

function renderInventory(){
 const list=inventory.filter(id=>inventoryFilter==="All"||ItemDB[id].type===inventoryFilter);
 document.querySelector("#invGrid").innerHTML=list.map(itemCard).join("");

 const i=ItemDB[selectedItem];
 document.querySelector("#itemDetail").innerHTML=
 `<div class="itemHero">${i.icon}</div>
  <h2>${i.name}</h2>
  <em>${i.rarity}</em>
  <div class="itemStats">${Object.entries(i.stats||{}).map(([k,v])=>`<div><span>${k}</span><b>${v}</b></div>`).join("")}</div>
  <p>${i.desc||"An item recovered from the fractured realms."}</p>`;

 document.querySelectorAll("[data-item]").forEach(b=>{
   b.onclick=()=>{
     selectedItem=b.dataset.item;
     renderInventory();
   };
 });
}

function renderCharacter(){
 const build=currentBuild(),st=totalStats();

 document.querySelector("#leftEquip").innerHTML=
   equipSlot("head","HEAD")+
   equipSlot("chest","CHEST")+
   equipSlot("arms","ARMS")+
   equipSlot("legs","LEGS")+
   equipSlot("main","MAIN HAND")+
   equipSlot("off","OFF HAND");

 document.querySelector("#rightEquip").innerHTML=
   equipSlot("amulet","AMULET")+
   equipSlot("ring1","RING 1")+
   equipSlot("ring2","RING 2")+
   equipSlot("relic","RELIC")+
   equipSlot("consumable","CONSUMABLE")+
   equipSlot("quick","QUICK ITEM");

 const groups=[
   ["CORE STATS",["Health","Mana","Stamina","Strength","Dexterity","Intelligence","Faith","Vitality"]],
   ["COMBAT STATS",["Attack","Magic Attack","Defense","Magic Defense","Critical Chance","Critical Damage","Attack Speed","Movement Speed"]],
   ["RESISTANCES",["Physical","Fire","Ice","Lightning","Holy","Dark","Poison","Bleed"]]
 ];

 const res={
   Physical:"32%",Fire:"18%",Ice:"18%",Lightning:"18%",
   Holy:hasRace("Angel")?"42%":"18%",
   Dark:"10%",Poison:"12%",Bleed:"14%"
 };

 document.querySelector("#statColumns").innerHTML=groups.map(([title,names])=>
   `<section><h3>${title}</h3>${names.map(n=>`<div><span>${n}</span><b>${st[n]??res[n]??0}</b></div>`).join("")}</section>`
 ).join("");

 document.querySelector("#bloodlineText").textContent=`${build.races.join(" / ")} · ${build.className}`;
 document.querySelector("#bloodlineTier").textContent=hasRace("Angel")?"ANGEL BLOODLINE · PURITY TIER I":"FRACTURED BLOODLINE";
}

export function openMenu(page="character"){
 document.querySelector("#rpgMenu").classList.add("open");
 showPage(page);
 window.FRACTURED.menuPaused=true;
}

export function closeMenu(){
 document.querySelector("#rpgMenu").classList.remove("open");
 window.FRACTURED.menuPaused=false;
}

export function showPage(page){
 document.querySelectorAll(".menuPage").forEach(x=>x.classList.remove("active"));
 document.querySelector("#"+page+"Page").classList.add("active");
 document.querySelectorAll(".menuTab").forEach(x=>x.classList.toggle("active",x.dataset.page===page));
 page==="inventory"?renderInventory():renderCharacter();
}

document.addEventListener("click",e=>{
 if(e.target.classList.contains("filter")){
   document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));
   e.target.classList.add("active");
   inventoryFilter=e.target.textContent;
   renderInventory();
 }
});
