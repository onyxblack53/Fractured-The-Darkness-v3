FRACTURED v8.2 ASSET PATH FIX

The repo currently stores these files in the ROOT:
- shattered_kingdom_world.jpeg
- angel_knight_pose_sheet.png

The v8.1 code incorrectly looked for them inside /assets/.

Replace these two files in the repo root:
- index.html
- angelKnightAnimations.js

This fixes:
- black world/background
- broken character image icon
- missing pose-sheet character rendering

The code also bumps cache query strings to v8.2.
