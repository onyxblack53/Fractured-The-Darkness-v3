// FRACTURED: The Darkness
// Detailed World Renderer v1
// DOM/image based. No canvas scenery and no placeholder geometry.

export class FracturedWorld {
  constructor({
    mount = document.body,
    imageSrc = "./assets/shattered_kingdom_world.jpeg",
    groundRatio = 0.755,
    startCamera = 0.50,
    minCamera = 0.18,
    maxCamera = 0.82,
  } = {}) {
    this.mount = mount;
    this.imageSrc = imageSrc;

    // The playable ground is kept separate from the artwork.
    // CharacterRenderer can query this exact Y position.
    this.groundRatio = groundRatio;

    // 0..1 position across the larger landscape.
    this.camera = startCamera;
    this.cameraTarget = startCamera;
    this.minCamera = minCamera;
    this.maxCamera = maxCamera;

    this.started = false;
    this.ready = false;
    this.lastTime = performance.now();

    this._buildDOM();
    this._bindResize();
  }

  _buildDOM() {
    this.root = document.createElement("section");
    this.root.id = "fractured-world";
    this.root.className = "fractured-world";
    this.root.setAttribute("aria-label", "The Shattered Kingdom");

    this.image = document.createElement("img");
    this.image.className = "fractured-world__image";
    this.image.alt = "";
    this.image.decoding = "async";
    this.image.draggable = false;
    this.image.src = this.imageSrc;

    // These are visual grading layers only. The actual world detail is the supplied artwork.
    this.vignette = document.createElement("div");
    this.vignette.className = "fractured-world__vignette";

    this.grade = document.createElement("div");
    this.grade.className = "fractured-world__grade";

    // Invisible gameplay layer. Character / enemies mount here.
    this.actorLayer = document.createElement("div");
    this.actorLayer.id = "world-actors";
    this.actorLayer.className = "fractured-world__actors";

    // Optional foreground UI/effects layer.
    this.effectLayer = document.createElement("div");
    this.effectLayer.id = "world-effects";
    this.effectLayer.className = "fractured-world__effects";

    this.root.append(
      this.image,
      this.grade,
      this.vignette,
      this.actorLayer,
      this.effectLayer
    );

    this.mount.appendChild(this.root);

    this.image.addEventListener("load", () => {
      this.ready = true;
      this.root.classList.add("is-ready");
      this._applyCamera();
      window.dispatchEvent(new CustomEvent("fractured:world-ready"));
    });

    this.image.addEventListener("error", () => {
      this.ready = false;
      window.dispatchEvent(
        new CustomEvent("fractured:world-error", {
          detail: `Could not load world image: ${this.imageSrc}`,
        })
      );
    });
  }

  _bindResize() {
    this._onResize = () => {
      this.viewportWidth = window.innerWidth;
      this.viewportHeight = window.innerHeight;
      this._applyCamera();
    };
    window.addEventListener("resize", this._onResize, { passive: true });
    this._onResize();
  }

  start() {
    if (this.started) return;
    this.started = true;
    this.lastTime = performance.now();
    requestAnimationFrame(this._tick);
  }

  stop() {
    this.started = false;
  }

  destroy() {
    this.stop();
    window.removeEventListener("resize", this._onResize);
    this.root?.remove();
  }

  // Give the character system the actor layer instead of making it guess where to mount.
  getActorLayer() {
    return this.actorLayer;
  }

  getEffectLayer() {
    return this.effectLayer;
  }

  // Exact ground Y in CSS pixels.
  // CharacterRenderer should place the knight's foot anchor here.
  getGroundY() {
    return Math.round((this.viewportHeight || window.innerHeight) * this.groundRatio);
  }

  getViewport() {
    return {
      width: this.viewportWidth || window.innerWidth,
      height: this.viewportHeight || window.innerHeight,
      groundY: this.getGroundY(),
    };
  }

  // worldX is normalized: 0 = far left of landscape, 1 = far right.
  setCameraFromWorldX(worldX, smoothing = true) {
    const clamped = Math.max(this.minCamera, Math.min(this.maxCamera, worldX));
    this.cameraTarget = clamped;

    if (!smoothing) {
      this.camera = clamped;
      this._applyCamera();
    }
  }

  nudgeCamera(delta) {
    this.setCameraFromWorldX(this.cameraTarget + delta);
  }

  // Converts normalized world X to on-screen X.
  // Useful for enemies / interactables that share the same world coordinate model.
  worldToScreenX(worldX) {
    const w = this.viewportWidth || window.innerWidth;
    const parallaxSpan = w * 0.72;
    return w * 0.5 + (worldX - this.camera) * parallaxSpan;
  }

  // Convert screen X to normalized world X.
  screenToWorldX(screenX) {
    const w = this.viewportWidth || window.innerWidth;
    const parallaxSpan = w * 0.72;
    return this.camera + (screenX - w * 0.5) / parallaxSpan;
  }

  _applyCamera() {
    if (!this.image) return;

    // CSS object-position lets the large landscape become a scrollable camera
    // while remaining a real image, not procedurally drawn scenery.
    const xPercent = 100 * this.camera;
    this.image.style.objectPosition = `${xPercent}% 50%`;
  }

  _tick = (now) => {
    if (!this.started) return;

    const dt = Math.min(0.05, (now - this.lastTime) / 1000);
    this.lastTime = now;

    // Smooth cinematic camera interpolation.
    const cameraEase = 1 - Math.pow(0.0008, dt);
    this.camera += (this.cameraTarget - this.camera) * cameraEase;

    this._applyCamera();

    requestAnimationFrame(this._tick);
  };
}
