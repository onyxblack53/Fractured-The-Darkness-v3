function draw(){bg();enemies.forEach(foe);hero()}
function loop(t){let dt=Math.min(.033,(t-last)/1000||.016);last=t;if(started){update(dt);draw()}requestAnimationFrame(loop)}
