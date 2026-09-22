export const ANGEL_KNIGHT_ANIMATIONS = {
  idle:    { src: './assets/idle.png',    frames: 3, frameWidth: 724, frameHeight: 724, fps: 6,  loop: true },
  run:     { src: './assets/run.png',     frames: 3, frameWidth: 724, frameHeight: 724, fps: 10, loop: true },
  jump:    { src: './assets/jump.png',    frames: 3, frameWidth: 724, frameHeight: 724, fps: 8,  loop: false, next: 'idle' },
  block:   { src: './assets/block.png',   frames: 3, frameWidth: 724, frameHeight: 724, fps: 8,  loop: false, next: 'idle' },
  dash:    { src: './assets/dash.png',    frames: 3, frameWidth: 724, frameHeight: 724, fps: 14, loop: false, next: 'idle' },
  attack1: { src: './assets/attack1.png', frames: 3, frameWidth: 724, frameHeight: 724, fps: 11, loop: false, next: 'idle' },
  attack2: { src: './assets/attack2.png', frames: 3, frameWidth: 724, frameHeight: 724, fps: 12, loop: false, next: 'idle' },
  attack3: { src: './assets/attack3.png', frames: 3, frameWidth: 724, frameHeight: 724, fps: 12, loop: false, next: 'idle' }
};

export class AngelKnightAnimator {
  constructor() {
    this.animations = {};
    this.current = 'idle';
    this.frame = 0;
    this.time = 0;
    this.facing = 'right';
    this.comboStep = 0;
    this.queue = [];
  }

  async load() {
    const entries = Object.entries(ANGEL_KNIGHT_ANIMATIONS);
    await Promise.all(entries.map(async ([name, cfg]) => {
      const image = new Image();
      image.src = cfg.src;
      await image.decode();
      this.animations[name] = { ...cfg, image };
    }));
    return this;
  }

  setFacing(direction) {
    if (direction === 'left' || direction === 'right') this.facing = direction;
  }

  play(name, force = false) {
    if (!this.animations[name]) return;
    if (!force && this.current === name) return;
    this.current = name;
    this.frame = 0;
    this.time = 0;
  }

  attackCombo() {
    const order = ['attack1', 'attack2', 'attack3'];
    const next = order[this.comboStep % order.length];
    this.comboStep += 1;
    this.play(next, true);
  }

  update(dt) {
    const a = this.animations[this.current];
    if (!a) return;

    this.time += dt;
    const frameDuration = 1 / a.fps;

    while (this.time >= frameDuration) {
      this.time -= frameDuration;
      this.frame += 1;

      if (this.frame >= a.frames) {
        if (a.loop) {
          this.frame = 0;
        } else {
          if (this.queue.length) {
            const queued = this.queue.shift();
            this.play(queued, true);
            return;
          }
          this.play(a.next || 'idle', true);
          return;
        }
      }
    }
  }

  draw(ctx, x, y, width, height) {
    const a = this.animations[this.current];
    if (!a) return;
    const sx = this.frame * a.frameWidth;
    const sy = 0;

    ctx.save();
    if (this.facing === 'left') {
      ctx.translate(x + width / 2, 0);
      ctx.scale(-1, 1);
      ctx.translate(-(x + width / 2), 0);
    }
    ctx.drawImage(a.image, sx, sy, a.frameWidth, a.frameHeight, x, y, width, height);
    ctx.restore();
  }

  trigger(action) {
    switch (action) {
      case 'idle':   this.play('idle', true); break;
      case 'run':    this.play('run', true); break;
      case 'jump':   this.play('jump', true); break;
      case 'block':  this.play('block', true); break;
      case 'dash':   this.play('dash', true); break;
      case 'attack': this.attackCombo(); break;
    }
  }
}
