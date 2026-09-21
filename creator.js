
export const RACES = [
  ["Human","Balanced and adaptable. Excellent for mixed bloodlines."],
  ["Orc","Powerful and resilient, with exceptional close-range strength."],
  ["Elf","Fast and precise, with strong magical affinity."],
  ["Dragonborn","Dragon-blooded warriors with great endurance and elemental potential."],
  ["Demon","A destructive supernatural lineage with dark resistance."],
  ["Angel","A celestial lineage with holy power, protection and radiant abilities."],
  ["Fallen Angel","A fractured celestial lineage balancing divine and shadow powers."],
  ["Tiefling","Infernal-blooded survivors with mobility and volatile magic."],
  ["Vampire","Night-born predators with speed, lifesteal and supernatural senses."],
  ["Werewolf","Ferocious shapeshifters with regeneration and physical strength."]
];

export const CLASSES = [
  ["Knight","Sword-and-shield melee fighter built for guarding and heavy combos."],
  ["Mage","Long-range caster using elemental and fracture magic."],
  ["Witch","Hexes, curses, rituals and battlefield control."],
  ["Samurai","Disciplined blade master focused on timing and counters."],
  ["Ronin","Fast independent swordsman built around mobility and dueling."],
  ["Ninja","High-speed fighter using evasive attacks and rapid repositioning."]
];

export class CharacterCreator {
  constructor(onComplete){
    this.onComplete = onComplete;
    this.mode = "pure";
    this.races = [];
    this.cls = null;

    this.startScreen = document.getElementById("start-screen");
    this.raceScreen = document.getElementById("race-screen");
    this.classScreen = document.getElementById("class-screen");

    this.raceGrid = document.getElementById("race-grid");
    this.classGrid = document.getElementById("class-grid");
    this.raceSummary = document.getElementById("race-summary");
    this.raceNext = document.getElementById("race-next");
    this.enterWorld = document.getElementById("enter-world");

    this.buildCards();
    this.bind();
  }

  show(id){
    document.querySelectorAll(".flow-screen").forEach(s=>s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
  }

  buildCards(){
    this.raceGrid.innerHTML = RACES.map(([name,desc]) => `
      <button class="choice-card" data-race="${name}">
        <span class="choice-glyph">${name[0]}</span>
        <span><b>${name}</b><small>${desc}</small></span>
      </button>`).join("");

    this.classGrid.innerHTML = CLASSES.map(([name,desc]) => `
      <button class="choice-card" data-class="${name}">
        <span class="choice-glyph">${name[0]}</span>
        <span><b>${name}</b><small>${desc}</small></span>
      </button>`).join("");
  }

  setMode(mode){
    this.mode = mode;
    this.races = [];
    document.getElementById("pure-btn").classList.toggle("selected",mode==="pure");
    document.getElementById("hybrid-btn").classList.toggle("selected",mode==="hybrid");
    this.refreshRaces();
  }

  refreshRaces(){
    document.querySelectorAll("[data-race]").forEach(card=>{
      card.classList.toggle("selected",this.races.includes(card.dataset.race));
    });
    const need = this.mode==="pure" ? 1 : 2;
    this.raceSummary.textContent = this.races.length ? this.races.join(" × ") : `Select ${need===1?"one":"two"} race${need===1?"":"s"}.`;
    this.raceNext.disabled = this.races.length !== need;
  }

  bind(){
    document.getElementById("start-btn").addEventListener("click",()=>this.show("race-screen"));
    document.getElementById("flow-back-start").addEventListener("click",()=>this.show("start-screen"));
    document.getElementById("flow-back-race").addEventListener("click",()=>this.show("race-screen"));
    document.getElementById("pure-btn").addEventListener("click",()=>this.setMode("pure"));
    document.getElementById("hybrid-btn").addEventListener("click",()=>this.setMode("hybrid"));

    this.raceGrid.addEventListener("click",(e)=>{
      const card=e.target.closest("[data-race]");
      if(!card) return;
      const race=card.dataset.race;
      const limit=this.mode==="pure"?1:2;
      if(this.races.includes(race)){
        this.races=this.races.filter(r=>r!==race);
      }else if(this.races.length < limit){
        this.races.push(race);
      }else if(limit===1){
        this.races=[race];
      }
      this.refreshRaces();
    });

    this.raceNext.addEventListener("click",()=>{
      document.getElementById("bloodline-summary").textContent =
        `${this.mode==="pure"?"FULL BLOODED":"HALF BLOODED"} — ${this.races.join(" / ")}`;
      this.show("class-screen");
    });

    this.classGrid.addEventListener("click",(e)=>{
      const card=e.target.closest("[data-class]");
      if(!card) return;
      this.cls=card.dataset.class;
      document.querySelectorAll("[data-class]").forEach(c=>c.classList.toggle("selected",c===card));
      this.enterWorld.disabled=false;
    });

    this.enterWorld.addEventListener("click",()=>{
      this.onComplete?.({
        bloodMode:this.mode,
        races:[...this.races],
        className:this.cls
      });
    });
  }
}
