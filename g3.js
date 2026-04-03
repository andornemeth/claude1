function collides(px,pz){
  for(var i=0;i<tables.length;i++){var tb=tables[i];if(Math.abs(px-tb.x)<1.3&&Math.abs(pz-tb.z)<1.1)return true;}
  if(Math.abs(px-barPos.x)<1.8&&Math.abs(pz-barPos.z)<0.9)return true;
  if(Math.abs(px)>9.3||Math.abs(pz)>9.3)return true;return false;
}
function btnRect(){var s=Math.max(70,Math.min(window.innerWidth,window.innerHeight)*0.18);var m=15;return{x:window.innerWidth-s-m,y:window.innerHeight-s-m,r:s/2};}
function onTS(e){
  e.preventDefault();
  if(GS==='start'||GS==='over'){GS='playing';document.getElementById('ov').style.display='none';startGame();return;}
  if(GS!=='playing')return;
  for(var i=0;i<e.changedTouches.length;i++){var tc=e.changedTouches[i];var br=btnRect();var bx=tc.clientX-(br.x+br.r),by=tc.clientY-(br.y+br.r);
    if(bx*bx+by*by<(br.r+20)*(br.r+20)){btnId=tc.identifier;doAction();}
    else if(tc.clientX<window.innerWidth*0.6&&joyId===null){joyId=tc.identifier;joyCX=tc.clientX;joyCY=tc.clientY;jDX=0;jDZ=0;}}
}
function onTM(e){e.preventDefault();for(var i=0;i<e.changedTouches.length;i++){var tc=e.changedTouches[i];if(tc.identifier===joyId){var dx=tc.clientX-joyCX,dy=tc.clientY-joyCY,dist=Math.sqrt(dx*dx+dy*dy),maxR=60;if(dist>maxR){dx=dx/dist*maxR;dy=dy/dist*maxR;}jDX=dx/maxR;jDZ=dy/maxR;}}}
function onTE(e){for(var i=0;i<e.changedTouches.length;i++){var tc=e.changedTouches[i];if(tc.identifier===joyId){joyId=null;jDX=0;jDZ=0;}if(tc.identifier===btnId)btnId=null;}}
function onTC(){joyId=null;btnId=null;jDX=0;jDZ=0;}
function updateBeerVisuals(){
  var tr=player.getObjectByName('tray');if(tr)tr.visible=carrying>0;
  for(var i=0;i<4;i++){var b=player.getObjectByName('hb'+i);if(b)b.visible=i<carrying;}
  if(carrying>0){document.getElementById('cr').textContent=(lang==='hu'?'SOR: ':lang==='sr'?'PIVO: ':'BEER: ')+carrying+'/'+maxCarry;document.getElementById('cr').style.display='block';}
  else{document.getElementById('cr').style.display='none';}
}
function doAction(){
  if(GS!=='playing')return;var px=player.position.x,pz=player.position.z;
  var db=Math.sqrt((px-barPos.x)*(px-barPos.x)+(pz-barPos.z)*(pz-barPos.z));
  if(db<3.5&&carrying<maxCarry){carrying=maxCarry;updateBeerVisuals();showMsg(t.gotBeer);return;}
  if(carrying>0){var closest=null,cd=Infinity;
    for(var i=0;i<tables.length;i++){var tb=tables[i];if(!tb.need)continue;var d=Math.sqrt((px-tb.x)*(px-tb.x)+(pz-tb.z)*(pz-tb.z));if(d<cd){cd=d;closest=tb;}}
    if(closest){closest.need=false;closest.has=true;closest.ind.visible=false;closest.beer.visible=true;closest.cd=300;carrying--;updateBeerVisuals();score++;updUI();
      closest.ind.material.color.setHex(0x33ff33);closest.ind.visible=true;setTimeout((function(tb){return function(){tb.ind.visible=false;};})(closest),500);showMsg(t.plusOne);}
    else{showMsg(t.goTable);}
  }else{showMsg(t.goBar);}
}
function startGame(){
  score=0;timeLeft=90;carrying=0;document.getElementById('cr').style.display='none';document.getElementById('msg').style.display='none';
  updateBeerVisuals();player.position.set(0,0,3);
  for(var i=0;i<tables.length;i++){tables[i].need=false;tables[i].has=false;tables[i].ind.visible=false;tables[i].beer.visible=false;tables[i].cd=0;}
  updUI();setN();setN();setN();
  if(timerI)clearInterval(timerI);timerI=setInterval(function(){if(GS!=='playing')return;timeLeft--;document.getElementById('tm').textContent=t.time+': '+timeLeft;if(timeLeft<=0)endG();},1000);
  if(needI)clearInterval(needI);needI=setInterval(function(){if(GS!=='playing')return;setN();},4000);
}
function setN(){var a=[];for(var i=0;i<tables.length;i++){if(!tables[i].need&&!tables[i].has)a.push(i);}if(!a.length)return;var idx=a[Math.floor(Math.random()*a.length)];tables[idx].need=true;tables[idx].ind.visible=true;tables[idx].ind.material.color.setHex(0xff3333);}
function endG(){GS='over';if(timerI)clearInterval(timerI);if(needI)clearInterval(needI);var ov=document.getElementById('ov');ov.querySelector('h1').textContent=t.end;ov.querySelector('h2').textContent=t.endScore(score);ov.style.display='flex';}
function updUI(){document.getElementById('sc').textContent=t.score+': '+score;document.getElementById('tm').textContent=t.time+': '+timeLeft;}
function drawHud(){
  hctx.clearRect(0,0,hud.width,hud.height);if(GS!=='playing'||!isMob)return;
  var jx,jy;if(joyId!==null){jx=joyCX;jy=joyCY;}else{jx=70;jy=hud.height-70;}
  hctx.globalAlpha=0.2;hctx.strokeStyle='#0ff';hctx.lineWidth=3;hctx.beginPath();hctx.arc(jx,jy,55,0,Math.PI*2);hctx.stroke();
  hctx.globalAlpha=0.5;hctx.fillStyle='#0ff';hctx.beginPath();hctx.arc(jx+jDX*45,jy+jDZ*45,18,0,Math.PI*2);hctx.fill();
  if(joyId===null){hctx.globalAlpha=0.4;hctx.fillStyle='#0ff';hctx.font='11px Courier New';hctx.textAlign='center';hctx.fillText(t.move,jx,jy+4);}
  var br=btnRect(),bcx=br.x+br.r,bcy=br.y+br.r;
  hctx.globalAlpha=0.4;hctx.fillStyle=carrying>0?'#4a4':'#fa0';hctx.beginPath();hctx.arc(bcx,bcy,br.r,0,Math.PI*2);hctx.fill();
  hctx.globalAlpha=1;hctx.strokeStyle=carrying>0?'#4f4':'#fc0';hctx.lineWidth=4;hctx.beginPath();hctx.arc(bcx,bcy,br.r,0,Math.PI*2);hctx.stroke();
  hctx.fillStyle='#fff';hctx.font='bold '+Math.max(14,Math.round(br.r*0.35))+'px Courier New';hctx.textAlign='center';hctx.textBaseline='middle';
  hctx.fillText(carrying>0?t.putdown+(carrying>1?' x'+carrying:''):t.pickup,bcx,bcy);
  var px=player.position.x,pz=player.position.z;
  var nearBar=Math.sqrt((px-barPos.x)*(px-barPos.x)+(pz-barPos.z)*(pz-barPos.z))<3.5;var nearTable=false;
  for(var i=0;i<tables.length;i++){if(tables[i].need&&Math.sqrt((px-tables[i].x)*(px-tables[i].x)+(pz-tables[i].z)*(pz-tables[i].z))<3)nearTable=true;}
  if(carrying<maxCarry&&nearBar){hctx.globalAlpha=0.8;hctx.fillStyle='#ff0';hctx.font='bold 16px Courier New';hctx.textAlign='center';hctx.fillText(t.hintPickup,hud.width/2,hud.height/2);}
  else if(carrying>0&&nearTable){hctx.globalAlpha=0.8;hctx.fillStyle='#4f4';hctx.font='bold 16px Courier New';hctx.textAlign='center';hctx.fillText(t.hintDrop,hud.width/2,hud.height/2);}
  hctx.globalAlpha=1;
}
function animate(){
  requestAnimationFrame(animate);var dt=clock.getDelta();
  if(GS==='playing'){var dx=0,dz=0;
    if(keys['w']||keys['arrowup'])dz=-1;if(keys['s']||keys['arrowdown'])dz=1;if(keys['a']||keys['arrowleft'])dx=-1;if(keys['d']||keys['arrowright'])dx=1;
    dx+=jDX;dz+=jDZ;var len=Math.sqrt(dx*dx+dz*dz);if(len>1){dx/=len;dz/=len;}
    if(keys[' ']){keys[' ']=false;doAction();}
    var spd=5*dt,nx=player.position.x+dx*spd,nz=player.position.z+dz*spd;
    if(!collides(nx,player.position.z))player.position.x=nx;if(!collides(player.position.x,nz))player.position.z=nz;
    if(len>0.1){pAngle=Math.atan2(dx,dz);player.rotation.y=pAngle;}
    var tt=Date.now()*0.003;
    for(var i=0;i<tables.length;i++){if(tables[i].need){tables[i].ind.position.y=1.8+Math.sin(tt+i)*0.3;tables[i].ind.scale.setScalar(0.8+Math.sin(tt*2+i)*0.3);}if(tables[i].has){tables[i].cd--;if(tables[i].cd<=0){tables[i].has=false;tables[i].beer.visible=false;}}}
    camera.position.x+=(player.position.x-camera.position.x)*2*dt;camera.position.z+=(player.position.z+8-camera.position.z)*2*dt;camera.lookAt(player.position.x,0,player.position.z);
    if(msgTimer>0){msgTimer--;if(msgTimer<=0)document.getElementById('msg').style.display='none';}
  }
  renderer.render(scene,camera);drawHud();
}
// Events registered before init
function handleStart(){if(GS==='start'||GS==='over'){GS='playing';document.getElementById('ov').style.display='none';startGame();}}
document.addEventListener('touchstart',onTS,{passive:false});
document.addEventListener('touchmove',onTM,{passive:false});
document.addEventListener('touchend',onTE,{passive:false});
document.addEventListener('touchcancel',onTC,{passive:false});
document.addEventListener('keydown',function(e){keys[e.key.toLowerCase()]=true;if(e.key===' ')e.preventDefault();});
document.addEventListener('keyup',function(e){keys[e.key.toLowerCase()]=false;});
document.addEventListener('click',handleStart);
document.getElementById('ov').addEventListener('touchend',function(e){e.preventDefault();handleStart();},{passive:false});
try{init();}catch(e){console.error('Init error:',e);document.getElementById('ov').querySelector('h2').textContent='Error: '+e.message;}
