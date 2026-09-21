FRACTURED: THE DARKNESS — ANGEL KNIGHT IMAGE-BASED ANIMATION PACKAGE

This package is built for the existing browser/PWA Canvas stack.

IMPORTANT:
- The knight is NOT constructed from circles, boxes, polygons, or placeholder body shapes.
- The renderer clips and animates the detailed Angel Knight artwork itself.
- Movement/combat still run at 60 FPS through code.
- The current art sheet supplies the key poses. For final production-quality animation, replace the source regions with individually rendered transparent in-between frames while keeping the same state machine.

FILES
-----
index.html
game.css
main.js
player.js
controls.js
angelKnightRenderer.js
angelKnightAnimations.js
assets/angel_knight_pose_sheet.png

CONTROL LAYOUT
--------------
LEFT:
- Circular movement control: left/right
- Pull downward: crouch
- Separate Jump

RIGHT:
- Large Dodge thumb button
- Attack above
- Block to the left
- Heal to the right/below
- Ability I / II / III raised above the combat cluster

DESKTOP TEST KEYS
-----------------
A / D or arrows = move
S / down = crouch
Space = jump
J = attack / combo
K = dodge
L = hold block
H = heal

STATES
------
idle
walk
run
crouch
jump
fall
land
attack1
attack2
attack3
block
blockHit
dodge
heal
hit
death

COMBAT
------
- 3-hit sword combo
- attack event frames with real hitbox data
- block damage reduction
- block-hit reaction
- dodge invulnerability frames
- stamina costs/recovery
- healing animation/event
- hit reaction/death
- facing-aware hitboxes

DROP-IN NOTES FOR F.C.D. v3.4
------------------------------
The existing project already has player.js / controls.js / main.js.
Use these files as the Angel Knight implementation reference or merge the class/state logic into those same files.

If your current code already owns physics/collision:
1. Keep existing physics and world collision.
2. Import AngelKnightRenderer.
3. Call renderer.setState(...) when your current player state changes.
4. Call renderer.update(dt, eventHandler) once per frame.
5. Call renderer.draw(ctx, x, y, facing, targetHeight) instead of the old layered geometric renderer.
6. Keep combat events ("hit", "iframeOn", "iframeOff", "heal") connected to your existing damage system.

ART UPGRADE PATH
----------------
The code intentionally separates animation logic from artwork.
To go from this concept-sheet prototype to flawless production animation:
- render transparent frame PNGs for every key/in-between frame
- put them in an atlas
- replace POSES crop rectangles with atlas frame rectangles
- no movement/combat code needs to change
