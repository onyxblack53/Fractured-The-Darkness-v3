# Angel Knight Animation Code Package

This package turns the provided Angel Knight sprite sheets into usable browser game animation code.

## Files
- `angel_knight_animations.js` — main animation code
- `assets/*.png` — sprite sheets
- `index.html` — local preview/test page

## Included animations
- idle
- run
- jump
- block
- dash
- attack1
- attack2
- attack3

## How to use in your game
1. Copy `angel_knight_animations.js`
2. Copy the `assets` folder beside it
3. Import it:

```js
import { AngelKnightAnimator } from './angel_knight_animations.js';
const animator = await new AngelKnightAnimator().load();
```

4. Update and draw each frame:

```js
animator.update(deltaTimeInSeconds);
animator.draw(ctx, x, y, width, height);
```

5. Trigger actions:

```js
animator.setFacing('left');
animator.setFacing('right');
animator.trigger('run');
animator.trigger('jump');
animator.trigger('block');
animator.trigger('dash');
animator.trigger('attack');
```

The attack trigger cycles through all 3 combo animations.
