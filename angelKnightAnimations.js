// Detailed image-based Angel Knight animation definitions.
// NO procedural body shapes are used. Every state renders from the detailed pose sheet.

export const POSE_SHEET = "./assets/angel_knight_pose_sheet.png";

// Source image is 1491 x 1055.
// Each region clips one detailed painted pose from the supplied Angel Knight sheet.
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

const f = (pose, duration, opts={}) => ({ pose, duration, ...opts });

export const CLIPS = {
  idle: {
    loop:true,
    frames:[
      f("idle",220,{y:0,scale:1.000}),
      f("idle",220,{y:-2,scale:1.004}),
      f("idle",220,{y:-3,scale:1.007}),
      f("idle",220,{y:-1,scale:1.003}),
    ]
  },
  walk: {
    loop:true,
    frames:[
      f("walkLeft",115,{y:0, rot:-.010}),
      f("walkPassing",105,{y:-4,rot: .006}),
      f("walkRight",115,{y:0,rot: .010}),
      f("walkPassing",105,{y:-4,rot:-.006}),
    ]
  },
  run: {
    loop:true,
    frames:[
      f("run",82,{y:0,scale:1.00,rot:-.015}),
      f("run",82,{y:-7,scale:1.01,rot:.008}),
      f("run",82,{y:-2,scale:1.00,rot:-.008}),
    ]
  },
  crouch: {
    loop:true,
    frames:[f("jumpAntic",180,{y:6,scale:.98})]
  },
  jump: {
    loop:false,
    frames:[
      f("jumpAntic",105,{y:5,scale:.98}),
      f("jumpAir",145,{y:-8,scale:1.01}),
    ]
  },
  fall: {
    loop:true,
    frames:[
      f("jumpAir",130,{y:-3,rot:.025}),
      f("jumpAir",130,{y:1,rot:-.012}),
    ]
  },
  land: {
    loop:false,
    frames:[
      f("landing",120,{y:5,scale:1.02}),
      f("idle",120,{y:0,scale:1.00})
    ]
  },
  attack1: {
    loop:false,
    lock:true,
    frames:[
      f("attackWindup",90,{rot:-.035}),
      f("attackContact",72,{rot:.010, event:"hit", hitbox:{x:45,y:-105,w:155,h:90,damage:20,knockback:235}}),
      f("attackFollow",125,{rot:.028}),
      f("idle",70)
    ]
  },
  attack2: {
    loop:false,
    lock:true,
    frames:[
      f("attackWindup",70,{rot:.020,flipPose:true}),
      f("attackContact",65,{event:"hit", hitbox:{x:35,y:-118,w:170,h:100,damage:25,knockback:260},flipPose:true}),
      f("attackFollow",110,{rot:-.030,flipPose:true}),
      f("idle",65)
    ]
  },
  attack3: {
    loop:false,
    lock:true,
    frames:[
      f("attackWindup",105,{y:-4,scale:1.03}),
      f("attackContact",82,{y:-6,scale:1.045,event:"hit",hitbox:{x:25,y:-135,w:205,h:120,damage:38,knockback:360}}),
      f("attackFollow",155,{y:2,scale:1.02}),
      f("landing",90),
      f("idle",80)
    ]
  },
  block: {
    loop:true,
    frames:[
      f("block",150,{x:0,y:1}),
      f("block",150,{x:-2,y:0})
    ]
  },
  blockHit: {
    loop:false,
    lock:true,
    frames:[
      f("block",70,{x:-8,rot:-.025}),
      f("block",95,{x:2,rot:.010}),
      f("block",90)
    ]
  },
  dodge: {
    loop:false,
    lock:true,
    frames:[
      f("dodge",85,{x:0,y:-2,scale:.99,event:"iframeOn"}),
      f("dodge",110,{x:12,y:-5,scale:1.02}),
      f("dodge",80,{x:18,event:"iframeOff"}),
      f("idle",65)
    ]
  },
  heal: {
    loop:false,
    lock:true,
    frames:[
      f("heal",180,{y:-2,scale:1.00}),
      f("heal",220,{y:-4,scale:1.015,event:"heal"}),
      f("heal",180,{y:-1,scale:1.005}),
      f("idle",80)
    ]
  },
  hit: {
    loop:false,
    lock:true,
    frames:[
      f("hit",100,{x:-8,rot:-.045}),
      f("hit",120,{x:-3,rot:-.020}),
      f("idle",100)
    ]
  },
  death: {
    loop:false,
    lock:true,
    frames:[
      f("hit",180,{y:8,rot:-.12,scale:.98}),
      f("landing",250,{y:24,rot:-.20,scale:.94}),
    ]
  }
};
