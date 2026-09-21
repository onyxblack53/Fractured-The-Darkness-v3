const SCENE={seed:7341};
function rnd(n){let x=Math.sin(n*12.9898+SCENE.seed)*43758.5453;return x-Math.floor(x)}
function fillPoly(a,c){ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(a[0][0],a[0][1]);for(let i=1;i<a.length;i++)ctx.lineTo(a[i][0],a[i][1]);ctx.closePath();ctx.fill()}
function pine(x,b,h,c){ctx.fillStyle=c;ctx.fillRect(x-1.5,b-h*.58,3,h*.58);for(let i=0;i<8;i++){let yy=b-h+i*h*.095,w=(i+1)*h*.046;fillPoly([[x,yy],[x-w,yy+h*.16],[x+w,yy+h*.16]],c)}}
function bg(){
 const y=gy(),cam=P?P.x:0,t=performance.now()/1000;
 // deep red/black sky
 let g=ctx.createLinearGradient(0,0,0,y);g.addColorStop(0,"#09050c");g.addColorStop(.32,"#310b16");g.addColorStop(.62,"#170b13");g.addColorStop(1,"#090a0e");ctx.fillStyle=g;ctx.fillRect(0,0,W,y);
 // red moon, upper-left
 let mx=W*.29,my=y*.19,r=Math.min(W,y)*.125;
 ctx.save();ctx.shadowBlur=32;ctx.shadowColor="#8b101d";let m=ctx.createRadialGradient(mx-r*.25,my-r*.25,r*.05,mx,my,r);m.addColorStop(0,"#ef3e43");m.addColorStop(.55,"#c51e2c");m.addColorStop(1,"#710b18");ctx.fillStyle=m;ctx.beginPath();ctx.arc(mx,my,r,0,7);ctx.fill();ctx.shadowBlur=0;ctx.globalAlpha=.24;for(let i=0;i<26;i++){let a=i*2.41,rr=r*(.12+(i%9)*.085),cr=r*(.018+(i%5)*.018);ctx.fillStyle=i%3?"#510812":"#f75a53";ctx.beginPath();ctx.ellipse(mx+Math.cos(a)*rr,my+Math.sin(a)*rr,cr*1.6,cr,.3*i,0,7);ctx.fill()}ctx.restore();
 // red-black cloud banks crossing moon
 function clouds(yy,alpha,par,scale){ctx.save();ctx.globalAlpha=alpha;for(let i=-2;i<9;i++){let x=i*W/6-((cam*par)%(W/6));for(let j=0;j<7;j++){let xx=x+j*20*scale,cy=yy+Math.sin(i*2+j)*9*scale;ctx.fillStyle=j%2?"#1a0b12":"#280d16";ctx.beginPath();ctx.ellipse(xx,cy,(38+j*5)*scale,(13+(j%3)*4)*scale,0,0,7);ctx.fill()}}ctx.restore()}
 clouds(y*.25,.74,.012,1);clouds(y*.34,.68,.02,1.15);clouds(y*.43,.53,.03,1.35);
 // violet rift upper-right
 let rx=W*.76,ry=y*.10;ctx.save();ctx.globalCompositeOperation="screen";ctx.shadowColor="#a642ff";ctx.shadowBlur=25;for(let p=0;p<3;p++){ctx.strokeStyle=["#51117d","#9839e8","#e0a7ff"][p];ctx.lineWidth=[15,5,1.5][p];ctx.globalAlpha=[.18,.58,.95][p];ctx.beginPath();for(let i=0;i<12;i++){let yy=i*y*.024,xx=rx+Math.sin(i*2.7)*8;if(!i)ctx.moveTo(xx,yy);else ctx.lineTo(xx,yy)}ctx.stroke()}for(let i=0;i<10;i++){ctx.globalAlpha=.2+.08*Math.sin(t*2+i);ctx.strokeStyle="#bd66ff";ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(rx,ry+i*5,38+i*5,8+i*.7,i*.18,0,7);ctx.stroke()}ctx.restore();
 // distant ridge
 ctx.fillStyle="#0b0d12";ctx.beginPath();ctx.moveTo(0,y*.54);for(let x=0;x<=W;x+=24)ctx.lineTo(x,y*.49-Math.sin((x+cam*.02)*.021)*20-Math.sin(x*.057)*8);ctx.lineTo(W,y*.76);ctx.lineTo(0,y*.76);ctx.fill();
 // distant forest under horizon
 for(let i=-2;i<W/18+3;i++){let x=i*18-((cam*.07)%18),h=45+(i*17%35);pine(x,y*.67,h,"#090b0f")}
 // castle upper-right, positioned like reference
 function castle(cx,base,s){ctx.save();ctx.translate(cx-cam*.035,base);ctx.scale(s,s);ctx.fillStyle="#07080c";ctx.fillRect(-105,-58,210,58);let T=[[-83,115,35],[-48,90,29],[-10,165,45],[28,126,35],[62,148,37],[94,101,30]];for(const [x,h,w] of T){ctx.fillRect(x-w/2,-h,w,h);fillPoly([[x-w*.65,-h],[x,-h-42],[x+w*.65,-h]],"#06070a")}ctx.fillStyle="#9b392e";ctx.shadowBlur=6;ctx.shadowColor="#d4513a";for(let i=0;i<28;i++){let x=-91+(i%9)*22,yy=-50-Math.floor(i/9)*30-(i%3)*8;ctx.fillRect(x,yy,2.5,7)}ctx.shadowBlur=0;ctx.strokeStyle="#11121a";ctx.lineWidth=10;ctx.beginPath();ctx.moveTo(-135,-18);ctx.lineTo(-105,-18);ctx.moveTo(105,-18);ctx.lineTo(140,-18);ctx.stroke();ctx.restore()}
 castle(W*.80,y*.53,.62);
 // cliffs + waterfalls below castle
 ctx.fillStyle="#0a0b0f";ctx.beginPath();ctx.moveTo(W*.57,y*.52);ctx.lineTo(W*.95,y*.49);ctx.lineTo(W,y*.73);ctx.lineTo(W*.72,y*.70);ctx.lineTo(W*.63,y*.62);ctx.closePath();ctx.fill();
 ctx.save();ctx.globalAlpha=.28;for(let k=0;k<2;k++){let wx=W*(.67+k*.16),top=y*(.56+k*.02),ww=W*.035;let wg=ctx.createLinearGradient(wx,top,wx+ww,top);wg.addColorStop(0,"#70738600");wg.addColorStop(.5,"#b3b6c2");wg.addColorStop(1,"#70738600");ctx.fillStyle=wg;ctx.fillRect(wx,top,ww,y*.19)}ctx.restore();
 // lake/reflection
 let lg=ctx.createLinearGradient(0,y*.65,0,y);lg.addColorStop(0,"#11121a");lg.addColorStop(1,"#07080d");ctx.fillStyle=lg;ctx.fillRect(W*.42,y*.68,W*.58,y*.32);ctx.save();ctx.globalAlpha=.24;ctx.strokeStyle="#db3040";for(let i=0;i<18;i++){let yy=y*.70+i*5,w=15+i*3;ctx.beginPath();ctx.moveTo(W*.76-w,yy);ctx.lineTo(W*.76+w,yy);ctx.stroke()}ctx.restore();
 // dense near forest and mist
 for(let layer=0;layer<3;layer++){let step=22+layer*8,par=.10+layer*.08,base=y*(.73+layer*.06);for(let i=-3;i<W/step+4;i++){let x=i*step-((cam*par)%step),h=72+layer*25+(i*13%45);pine(x,base,h,["#101219","#0b0d11","#07080b"][layer])}}
 ctx.save();ctx.fillStyle="#a99fb0";for(let k=0;k<4;k++){ctx.globalAlpha=.045+k*.014;for(let i=-1;i<7;i++){let x=i*W/5-((cam*.06-t*2)%(W/5));ctx.beginPath();ctx.ellipse(x,y*(.57+k*.06),100+k*20,11+k*3,0,0,7);ctx.fill()}}ctx.restore();
 // flat ancient bridge = exact walkable plane
 const top=y;
 ctx.fillStyle="#0b090c";ctx.fillRect(0,top,W,H-top);
 ctx.fillStyle="#21191c";ctx.fillRect(0,top-9,W,9);
 ctx.fillStyle="#574047";for(let x=-((cam*.65)%42);x<W;x+=42)ctx.fillRect(x,top-9,27,2);
 // stone courses continue downward, but TOP stays perfectly flat for collision
 for(let row=0;row<7;row++){let bw=52,bh=25,off=(row%2)*26-((cam*.65)%bw);for(let x=-bw;x<W+bw;x+=bw){let xx=x+off,v=10+((row*7+Math.floor(x/bw)*5)%8);ctx.fillStyle=`rgb(${v},${v-1},${v+2})`;ctx.fillRect(xx,top+row*bh,bw-2,bh-2);ctx.strokeStyle="#3b3036";ctx.lineWidth=.8;ctx.strokeRect(xx,top+row*bh,bw-2,bh-2);if((row+Math.floor(x/bw))%5===0){ctx.strokeStyle="#211a1e";ctx.beginPath();ctx.moveTo(xx+10,top+row*bh+3);ctx.lineTo(xx+19,top+row*bh+11);ctx.lineTo(xx+14,top+row*bh+20);ctx.stroke()}}}
 // roots/grass along flat bridge edge
 ctx.strokeStyle="#080609";for(let i=0;i<45;i++){let x=i*27-((cam*.72)%27),h=6+(i*19)%22;ctx.beginPath();ctx.moveTo(x,top);ctx.quadraticCurveTo(x+(i%2?5:-6),top-h*.6,x+(i%3?7:-7),top-h);ctx.stroke()}
}