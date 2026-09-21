function bg(){let y=gy(),cam=P?P.x:0;
let sky=ctx.createLinearGradient(0,0,0,y);sky.addColorStop(0,"#07101d");sky.addColorStop(.5,"#111526");sky.addColorStop(1,"#21171d");ctx.fillStyle=sky;ctx.fillRect(0,0,W,y);
ctx.fillStyle="#d9d6cf";ctx.globalAlpha=.72;ctx.beginPath();ctx.arc(W*.78,H*.18,48,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
ctx.fillStyle="#0b0d15";for(let i=0;i<11;i++){let x=((i*91-cam*.08)%(W+150))-70,h=95+(i%4)*32;ctx.fillRect(x,y-h,x%3?38:50,h);ctx.beginPath();ctx.moveTo(x-5,y-h);ctx.lineTo(x+19,y-h-45);ctx.lineTo(x+43,y-h);ctx.fill()}
ctx.strokeStyle="#272532";ctx.lineWidth=3;for(let i=0;i<7;i++){let x=((i*145-cam*.18)%(W+220))-80;ctx.beginPath();ctx.moveTo(x,y-12);ctx.lineTo(x+24,y-150-(i%3)*25);ctx.lineTo(x+48,y-12);ctx.stroke()}
ctx.fillStyle="#151219";for(let i=0;i<6;i++){let x=((i*170-cam*.28)%(W+260))-100;ctx.fillRect(x,y-120,74,120);ctx.beginPath();ctx.moveTo(x-7,y-120);ctx.lineTo(x+37,y-175);ctx.lineTo(x+81,y-120);ctx.fill();ctx.fillStyle="#7a3c22";ctx.globalAlpha=.5;ctx.fillRect(x+17,y-91,9,22);ctx.fillRect(x+48,y-91,9,22);ctx.globalAlpha=1;ctx.fillStyle="#151219"}
ctx.fillStyle="#0a090d";ctx.fillRect(0,y,W,H-y);let stone=46;for(let row=0;row<5;row++){for(let x=-stone;x<W+stone;x+=stone){let off=(row%2)*23,xx=x+off-(cam*.65%stone);ctx.fillStyle=row%2?"#111015":"#0d0d11";ctx.fillRect(xx,y+row*27,stone-2,25);ctx.strokeStyle="#3b353c";ctx.lineWidth=1;ctx.strokeRect(xx,y+row*27,stone-2,25)}}
ctx.fillStyle="#29222a";ctx.fillRect(0,y-5,W,5);ctx.fillStyle="#5b4a50";for(let x=-(cam*.65%38);x<W;x+=38)ctx.fillRect(x,y-5,25,2);
ctx.globalAlpha=.12;ctx.fillStyle="#d8dbe3";for(let i=0;i<9;i++){let x=(i*79+cam*.05)%W;ctx.beginPath();ctx.ellipse(x,y-55-(i%3)*22,55,10,0,0,Math.PI*2);ctx.fill()}ctx.globalAlpha=1}
