FRACTURED — WORLD MODULE v1

This is the world-only module.

Files:
- worldRenderer.js
- world.css
- world-demo.html
- assets/shattered_kingdom_world.jpeg

IMPORTANT:
This renderer does NOT draw placeholder scenery with canvas.
It uses the supplied world artwork directly as the environment.

CharacterRenderer should mount the Angel Knight into:
    world.getActorLayer()

And place the knight's FOOT ANCHOR at:
    world.getGroundY()

Camera:
    world.setCameraFromWorldX(0.0 .. 1.0)

Open world-demo.html from a web server to test camera framing.
