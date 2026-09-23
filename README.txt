FRACTURED ANGEL KNIGHT v7 PATCH

Fixes:
1) Visible walkable ground aligned with the player's 75.5% ground physics.
2) Sword/wing clipping and neighboring-frame bleed:
   - 32 individual transparent PNG frames are included.
   - Each frame is padded to 900x900 and aligned to one foot baseline.
   - Gameplay no longer crops directly from the original sprite sheets.
3) Character menu:
   - Replaces the chess-horse placeholder with the actual animated Angel Knight.
   - Includes an armor-overlay API for true armor visual swapping.

UPLOAD/REPLACE:
- index.html
- angelKnightSpriteRenderer.js

ADD:
- v7-patch.css
- characterPreview.js
- entire angel_frames folder

KEEP:
- main.js
- player.js
- controls.js
- creator.js
- menu.js
- game.css
- menu.css
- shattered_kingdom_world.jpeg

IMPORTANT ABOUT ARMOR:
The live character preview is active now. The code also supports true armor overlay files at:
armor_visuals/<itemKey>.png
The current repository does not yet contain separate art for each armor piece, so actual armor-shape swapping needs those overlay images.
