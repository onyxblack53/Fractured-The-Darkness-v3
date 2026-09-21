// FRACTURED — Angel Knight animation data v2
// The detailed knight is always sampled from the painted character atlas.
// Motion is produced by timing, interpolation, secondary transforms and VFX —
// never by replacing the character with primitive body shapes.

export const POSE_SHEET = "./assets/angel_knight_pose_sheet.png";

export const POSES = {
  idle:          { sx:  22, sy:  92, sw: 265, sh: 300, ax:.50, ay:.92 },
  walkLeft:      { sx: 290, sy:  92, sw: 275, sh: 300, ax:.50, ay:.92 },
  walkPassing:   { sx: 570, sy:  92, sw: 270, sh: 300, ax:.50, ay:.92 },
  walkRight:     { sx: 845, sy:  92, sw: 275, sh: 300, ax:.50, ay:.92 },
  run:           { sx:1120, sy:  92, sw: 355, sh: 300, ax:.53, ay:.92 },
  jumpAntic:     { sx:   0, sy: 425, sw: 250, sh: 295, ax:.50, ay:.93 },
  jumpAir:       { sx: 245, sy: 425, sw: 320, sh: 295, ax:.50, ay:.88 },
  landing:       { sx: 560, sy: 425, sw: 285, sh: 295, ax:.50, ay:.93 },
  attackWindup:  { sx: 835, sy: 425, sw: 280, sh: 295, ax:.50, ay:.93 },
  attackContact: { sx:1100, sy: 425, sw: 290, sh: 295, ax:.50, ay:.93 },
  attackFollow:  { sx:1200, sy: 425, sw: 285, sh: 295, ax:.50, ay:.93 },
  block:         { sx:   0, sy: 735, sw: 245, sh: 270, ax:.50, ay:.94 },
  dodge:         { sx: 245, sy: 735, sw: 315, sh: 270, ax:.52, ay:.94 },
  heal:          { sx: 555, sy: 735, sw: 310, sh: 270, ax:.50, ay:.94 },
  hit:           { sx: 850, sy: 735, sw: 315, sh: 270, ax:.50, ay:.94 },
};

const F=(pose,duration,opts={})=>({pose,duration,...opts});

// ease controls frame-to-frame transform interpolation.
// fx is consumed by the renderer and kept separate from gameplay hitboxes.
export const CLIPS = {
  idle:{loop:true,blend:.16,frames:[
    F("idle",210,{y:0,scale:1.000,rot:-.003,ease:"smooth",fx:"aura"}),
    F("idle",210,{y:-2,scale:1.005,rot:.002,ease:"smooth",fx:"aura"}),
    F("idle",210,{y:-4,scale:1.009,rot:.004,ease:"smooth",fx:"aura"}),
    F("idle",210,{y:-2,scale:1.004,rot:-.001,ease:"smooth",fx:"aura"}),
  ]},
  walk:{loop:true,blend:.09,frames:[
    F("walkLeft",100,{y:0,x:-2,rot:-.014,ease:"smooth",fx:"step"}),
    F("walkPassing",88,{y:-5,x:0,rot:.004,ease:"smooth"}),
    F("walkRight",100,{y:0,x:2,rot:.014,ease:"smooth",fx:"step"}),
    F("walkPassing",88,{y:-5,x:0,rot:-.004,ease:"smooth"}),
  ]},
  run:{loop:true,blend:.07,frames:[
    F("run",76,{y:1,x:-3,scale:.995,rot:-.022,ease:"out",fx:"stepHeavy"}),
    F("run",72,{y:-8,x:2,scale:1.018,rot:.012,ease:"smooth"}),
    F("run",76,{y:-2,x:5,scale:1.004,rot:-.010,ease:"in",fx:"stepHeavy"}),
    F("run",72,{y:-7,x:1,scale:1.014,rot:.008,ease:"smooth"}),
  ]},
  crouch:{loop:true,blend:.12,frames:[
    F("jumpAntic",190,{y:10,scaleX:1.025,scaleY:.965,rot:-.005,ease:"smooth"})
  ]},
  jump:{loop:false,lock:true,blend:.06,frames:[
    F("jumpAntic",92,{y:7,scaleX:1.045,scaleY:.945,ease:"in",fx:"jumpDust"}),
    F("jumpAir",110,{y:-11,scaleX:.985,scaleY:1.035,rot:.012,ease:"out",event:"jumpRelease"}),
    F("jumpAir",90,{y:-13,scale:1.012,rot:.018,ease:"smooth"}),
  ]},
  fall:{loop:true,blend:.12,frames:[
    F("jumpAir",115,{y:-5,rot:.026,scaleX:1.01,scaleY:.99,ease:"smooth"}),
    F("jumpAir",115,{y:1,rot:-.014,scaleX:.995,scaleY:1.01,ease:"smooth"}),
  ]},
  land:{loop:false,lock:true,blend:.05,frames:[
    F("landing",70,{y:8,scaleX:1.065,scaleY:.925,ease:"out",event:"landImpact",fx:"landBurst"}),
    F("landing",75,{y:5,scaleX:1.025,scaleY:.975,ease:"out"}),
    F("idle",95,{y:0,scale:1,ease:"smooth"}),
  ]},
  attack1:{loop:false,lock:true,blend:.035,frames:[
    F("attackWindup",78,{x:-8,y:1,rot:-.055,scaleX:.985,scaleY:1.01,ease:"in",event:"comboOpen"}),
    F("attackContact",54,{x:11,y:-3,rot:.025,scale:1.025,ease:"out",event:"hit",fx:"slash1",hitbox:{x:42,y:-112,w:170,h:96,damage:20,knockback:240}}),
    F("attackFollow",74,{x:18,y:1,rot:.048,scale:1.015,ease:"out",event:"comboOpen"}),
    F("attackFollow",64,{x:8,y:2,rot:.025,scale:1.005,ease:"smooth"}),
    F("idle",58,{ease:"smooth"})
  ]},
  attack2:{loop:false,lock:true,blend:.03,frames:[
    F("attackWindup",62,{x:-5,y:-2,rot:.035,flipPose:true,ease:"in",event:"comboOpen"}),
    F("attackContact",50,{x:15,y:-6,rot:-.028,scale:1.035,flipPose:true,ease:"out",event:"hit",fx:"slash2",hitbox:{x:34,y:-124,w:184,h:104,damage:25,knockback:275}}),
    F("attackFollow",70,{x:19,y:-1,rot:-.052,scale:1.018,flipPose:true,ease:"out",event:"comboOpen"}),
    F("attackFollow",58,{x:7,y:2,rot:-.024,flipPose:true,ease:"smooth"}),
    F("idle",54,{ease:"smooth"})
  ]},
  attack3:{loop:false,lock:true,blend:.025,frames:[
    F("attackWindup",80,{x:-10,y:-5,scaleX:1.00,scaleY:1.035,rot:-.07,ease:"in",event:"comboOpen",fx:"charge"}),
    F("jumpAir",46,{x:4,y:-18,scale:1.035,rot:.02,ease:"out"}),
    F("attackContact",62,{x:21,y:-9,scaleX:1.075,scaleY:.965,rot:.055,ease:"out",event:"hit",fx:"slash3",hitbox:{x:22,y:-145,w:224,h:132,damage:40,knockback:390}}),
    F("attackFollow",92,{x:21,y:2,scale:1.03,rot:.045,ease:"out"}),
    F("landing",72,{y:8,scaleX:1.06,scaleY:.94,ease:"out",event:"landImpact",fx:"landBurst"}),
    F("idle",80,{ease:"smooth"})
  ]},
  block:{loop:true,blend:.08,frames:[
    F("block",135,{x:-1,y:1,scale:1.008,rot:-.005,ease:"smooth",fx:"guardAura"}),
    F("block",135,{x:-3,y:0,scale:1.012,rot:.004,ease:"smooth",fx:"guardAura"})
  ]},
  blockHit:{loop:false,lock:true,blend:.025,frames:[
    F("block",58,{x:-11,y:1,rot:-.035,scaleX:1.035,scaleY:.975,ease:"out",event:"blockImpact",fx:"blockFlash"}),
    F("block",72,{x:4,y:-1,rot:.014,scale:1.015,ease:"out"}),
    F("block",90,{x:0,y:0,rot:0,ease:"smooth"})
  ]},
  dodge:{loop:false,lock:true,blend:.02,frames:[
    F("dodge",62,{x:-5,y:-1,scaleX:1.04,scaleY:.95,rot:-.04,ease:"in",event:"iframeOn",fx:"afterimage"}),
    F("dodge",74,{x:15,y:-6,scaleX:.96,scaleY:1.035,rot:.045,ease:"out",fx:"afterimage"}),
    F("dodge",68,{x:24,y:-2,scale:1.015,rot:.022,ease:"out",fx:"afterimage",event:"iframeOff"}),
    F("landing",62,{x:10,y:6,scaleX:1.035,scaleY:.965,ease:"out"}),
    F("idle",54,{ease:"smooth"})
  ]},
  heal:{loop:false,lock:true,blend:.08,frames:[
    F("heal",145,{y:-1,scale:.995,ease:"smooth",fx:"healGlow"}),
    F("heal",180,{y:-5,scale:1.025,ease:"smooth",fx:"healGlow",event:"heal"}),
    F("heal",145,{y:-2,scale:1.012,ease:"smooth",fx:"healGlow"}),
    F("idle",76,{ease:"smooth"})
  ]},
  hit:{loop:false,lock:true,blend:.025,frames:[
    F("hit",72,{x:-12,y:0,rot:-.065,scaleX:1.025,scaleY:.975,ease:"out",event:"hurtFlash"}),
    F("hit",92,{x:-5,y:2,rot:-.028,scale:1.01,ease:"out"}),
    F("idle",86,{ease:"smooth"})
  ]},
  death:{loop:false,lock:true,blend:.07,frames:[
    F("hit",145,{x:-10,y:8,rot:-.13,scale:.985,ease:"in"}),
    F("landing",220,{x:-4,y:28,rot:-.23,scaleX:1.045,scaleY:.90,ease:"out",fx:"deathDust"}),
  ]}
};
