ANGEL KNIGHT FRAME FIX v5

The sprite sheets are 2172 x 724 and contain FOUR frames.

Old code used 3 frames:
2172 / 3 = 724

Correct code uses 4 frames:
2172 / 4 = 543

That is why multiple Angel Knights were appearing beside each other.

Replace in repo root:
- index.html
- angel_knight_animations.js

Keep these root PNG files:
idle.png
run.png
jump.png
block.png
dash.png
attack1.png
attack2.png
attack3.png
