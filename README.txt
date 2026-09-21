FRACTURED: THE DARKNESS — Angel Knight Web Build v2

DEPLOY ALL OF THESE TO THE SAME GITHUB PAGES FOLDER:
  index.html
  game.css
  main.js
  player.js
  controls.js
  angelKnightAnimations.js
  angelKnightRenderer.js
  assets/angel_knight_pose_sheet.png

If only index.html is uploaded, the HUD loads but the game/character does not.
This build now shows a visible boot error if the atlas or JS asset structure is missing.

Animation upgrades:
- transform interpolation between atlas poses
- eased transitions and state blending
- 3-stage buffered sword combo
- attack hit timing + sword arc VFX
- jump anticipation / stretch / landing compression
- dodge afterimages + i-frame timing
- block impact flash
- heal aura particles
- locomotion secondary motion and dust
- mobile + keyboard controls
