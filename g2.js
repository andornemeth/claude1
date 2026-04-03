function init(){
  scene=new THREE.Scene();scene.background=new THREE.Color(0x87CEEB);scene.fog=new THREE.Fog(0x87CEEB,25,55);
  camera=new THREE.PerspectiveCamera(60,window.innerWidth/window.innerHeight,0.1,100);
  renderer=new THREE.WebGLRenderer({antialias:true});
  renderer.setSize(window.innerWidth,window.innerHeight);renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));renderer.shadowMap.enabled=true;
  renderer.domElement.style.cssText='display:block;position:fixed;top:0;left:0;width:100%;height:100%;z-index:1';
  document.body.insertBefore(renderer.domElement,document.body.firstChild);
  clock=new THREE.Clock();
  scene.add(new THREE.AmbientLight(0xfff5e0,0.45));
  var sun=new THREE.DirectionalLight(0xfff8e1,0.75);sun.position.set(8,15,5);sun.castShadow=true;
  sun.shadow.mapSize.width=1024;sun.shadow.mapSize.height=1024;sun.shadow.camera.near=0.5;sun.shadow.camera.far=50;
  sun.shadow.camera.left=-15;sun.shadow.camera.right=15;sun.shadow.camera.top=15;sun.shadow.camera.bottom=-15;
  scene.add(sun);
  var fill=new THREE.DirectionalLight(0xe8e0d4,0.2);fill.position.set(-5,8,-5);scene.add(fill);
  scene.add(new THREE.HemisphereLight(0x88bbdd,0x556B2F,0.35));
  var lp=[[-6,3.5,-6],[6,3.5,-6],[-6,3.5,6],[6,3.5,6],[0,3.5,0],[-3,3.5,-3],[3,3.5,-3],[-3,3.5,3],[3,3.5,3]];
  for(var i=0;i<lp.length;i++){var b=new THREE.Mesh(new THREE.SphereGeometry(0.08,6,6),new THREE.MeshBasicMaterial({color:0xffeeaa}));b.position.set(lp[i][0],lp[i][1],lp[i][2]);scene.add(b);}
  // Gravel texture
  var gc=document.createElement('canvas');gc.width=512;gc.height=512;var gx=gc.getContext('2d');
  gx.fillStyle='#B8A07A';gx.fillRect(0,0,512,512);
  for(var y=0;y<512;y+=2)for(var x=0;x<512;x+=2){var v=Math.floor(150+Math.random()*50);gx.fillStyle='rgba('+v+','+Math.floor(v*0.9)+','+Math.floor(v*0.75)+',0.3)';gx.fillRect(x,y,2,2);}
  for(var i=0;i<300;i++){var px=Math.random()*512,py=Math.random()*512,ps=Math.random()*6+3,pv=Math.floor(120+Math.random()*80);gx.fillStyle='rgb('+pv+','+Math.floor(pv*0.88)+','+Math.floor(pv*0.72)+')';gx.beginPath();gx.arc(px,py,ps,0,Math.PI*2);gx.fill();gx.fillStyle='rgba(255,255,240,0.2)';gx.beginPath();gx.arc(px-ps*0.2,py-ps*0.2,ps*0.5,0,Math.PI*2);gx.fill();}
  for(var i=0;i<500;i++){var px=Math.random()*512,py=Math.random()*512,ps=Math.random()*3+1.5,pv=Math.floor(100+Math.random()*90);gx.fillStyle='rgb('+pv+','+Math.floor(pv*0.9)+','+Math.floor(pv*0.78)+')';gx.beginPath();gx.arc(px,py,ps,0,Math.PI*2);gx.fill();}
  for(var i=0;i<600;i++){var px=Math.random()*512,py=Math.random()*512,ps=Math.random()*1.5+0.5;gx.fillStyle='rgba(60,50,35,0.4)';gx.beginPath();gx.arc(px,py,ps,0,Math.PI*2);gx.fill();}
  var gt=new THREE.CanvasTexture(gc);gt.wrapS=THREE.RepeatWrapping;gt.wrapT=THREE.RepeatWrapping;gt.repeat.set(4,4);
  // Grass texture
  var rc=document.createElement('canvas');rc.width=512;rc.height=512;var rx=rc.getContext('2d');
  rx.fillStyle='#3d7a32';rx.fillRect(0,0,512,512);
  for(var y=0;y<512;y+=2)for(var x=0;x<512;x+=2){var v=Math.floor(40+Math.random()*30),g=Math.floor(90+Math.random()*50);rx.fillStyle='rgba('+v+','+g+','+Math.floor(v*0.6)+',0.4)';rx.fillRect(x,y,2,2);}
  for(var i=0;i<2000;i++){var px=Math.random()*512,py=Math.random()*512,gv=Math.floor(45+Math.random()*40),gg=Math.floor(100+Math.random()*60);rx.strokeStyle='rgb('+gv+','+gg+','+Math.floor(gv*0.5)+')';rx.lineWidth=1;rx.beginPath();rx.moveTo(px,py);rx.lineTo(px+Math.random()*6-3,py-Math.random()*8);rx.stroke();}
  var rt=new THREE.CanvasTexture(rc);rt.wrapS=THREE.RepeatWrapping;rt.wrapT=THREE.RepeatWrapping;rt.repeat.set(6,6);
  // Ground
  var g1=new THREE.Mesh(new THREE.PlaneGeometry(40,40),new THREE.MeshPhongMaterial({map:rt,shininess:2,specular:0x111111}));g1.rotation.x=-Math.PI/2;g1.receiveShadow=true;scene.add(g1);
  var g2=new THREE.Mesh(new THREE.PlaneGeometry(20,20),new THREE.MeshPhongMaterial({map:gt,shininess:3,specular:0x222222}));g2.rotation.x=-Math.PI/2;g2.position.y=0.02;g2.receiveShadow=true;scene.add(g2);
  var bm=new THREE.MeshPhongMaterial({color:0x7a6a50,shininess:5});
  [-10,10].forEach(function(e){var bh=new THREE.Mesh(new THREE.BoxGeometry(20,0.06,0.18),bm);bh.position.set(0,0.04,e);scene.add(bh);var bv=new THREE.Mesh(new THREE.BoxGeometry(0.18,0.06,20),bm);bv.position.set(e,0.04,0);scene.add(bv);});
  // Fence
  var fm=new THREE.MeshLambertMaterial({color:0x8B6914});
  for(var x=-10;x<=10;x++)for(var s=0;s<4;s++){var p=new THREE.Mesh(new THREE.BoxGeometry(0.1,1.2,0.1),fm);if(s===0)p.position.set(x,0.6,-10);else if(s===1)p.position.set(x,0.6,10);else if(s===2)p.position.set(-10,0.6,x);else p.position.set(10,0.6,x);scene.add(p);}
  for(var s=0;s<4;s++){var r=new THREE.Mesh(new THREE.BoxGeometry(s<2?20:0.08,0.08,s<2?0.08:20),fm);if(s===0)r.position.set(0,0.9,-10);else if(s===1)r.position.set(0,0.9,10);else if(s===2)r.position.set(-10,0.9,0);else r.position.set(10,0.9,0);scene.add(r);}
  // Bar
  var bg=new THREE.Group();bg.add(mb(3,1.1,1.2,0xc8a84e,0,0.55,0));bg.add(mb(3.2,0.1,1.4,0x6b4226,0,1.15,0));
  var tap=new THREE.Mesh(new THREE.CylinderGeometry(0.08,0.08,0.5,8),new THREE.MeshLambertMaterial({color:0xdddddd}));tap.position.set(0,1.4,0);bg.add(tap);
  bg.add(mb(0.15,0.2,0.05,0x222222,0,1.7,0));
  // Darmstadt sign - on front of bar, facing toward player (+z direction)
  var signCanvas=document.createElement('canvas');signCanvas.width=512;signCanvas.height=128;
  var sctx=signCanvas.getContext('2d');
  sctx.fillStyle='#e8b820';sctx.fillRect(0,0,512,128);
  // Border
  sctx.strokeStyle='#8a6010';sctx.lineWidth=8;sctx.strokeRect(4,4,504,120);
  sctx.fillStyle='#3a1800';sctx.font='bold 72px Courier New';sctx.textAlign='center';sctx.textBaseline='middle';
  sctx.fillText('Darmstadt',256,68);
  var signTex=new THREE.CanvasTexture(signCanvas);
  // Sign board on front of bar facing player
  var signBoard=new THREE.Mesh(new THREE.BoxGeometry(2.5,0.5,0.06),new THREE.MeshLambertMaterial({color:0xe8b820}));
  signBoard.position.set(0,0.95,0.64);bg.add(signBoard);
  // Text face on sign - facing +z (toward player)
  var signFace=new THREE.Mesh(new THREE.PlaneGeometry(2.4,0.45),new THREE.MeshBasicMaterial({map:signTex}));
  signFace.position.set(0,0.95,0.68);bg.add(signFace);
  bg.position.set(0,0,-7);scene.add(bg);
  // Bartender
  var bt=mkLego(0x228B22,0x1a1a1a,0x663300,'flat');bt.scale.set(1.4,1.4,1.4);
  var bd=new THREE.Mesh(new THREE.BoxGeometry(0.22,0.12,0.14),new THREE.MeshLambertMaterial({color:0x5c3317}));bd.position.set(0,0.85,0.12);bt.add(bd);
  var ms=new THREE.Mesh(new THREE.BoxGeometry(0.18,0.035,0.07),new THREE.MeshLambertMaterial({color:0x4a2810}));ms.position.set(0,0.91,0.14);bt.add(ms);
  bt.position.set(0,0.3,-7.8);bt.rotation.y=0;scene.add(bt);
  // Trees
  var tm=new THREE.MeshLambertMaterial({color:0x2E8B2E}),trm=new THREE.MeshLambertMaterial({color:0x6B3A1F});
  [[-8,-8],[8,-8],[-8,8],[8,8],[-5,-9],[5,-9],[-9,0],[9,0],[-5,9],[5,9]].forEach(function(p){var t=new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.3,2,8),trm);t.position.set(p[0],1,p[1]);t.castShadow=true;scene.add(t);var v=new THREE.Mesh(new THREE.SphereGeometry(1.5,8,8),tm);v.position.set(p[0],3,p[1]);v.castShadow=true;scene.add(v);});
  // Tables
  var tbm=new THREE.MeshLambertMaterial({color:0x8B5E3C}),bnm=new THREE.MeshLambertMaterial({color:0x7A4F2E});
  [[-5,-3],[-2,-3],[2,-3],[5,-3],[-5,1],[-2,1],[2,1],[5,1],[-5,5],[-2,5],[2,5],[5,5]].forEach(function(pos){
    var tg=new THREE.Group();var tt=new THREE.Mesh(new THREE.BoxGeometry(1.8,0.08,1),tbm);tt.position.y=0.75;tt.castShadow=true;tg.add(tt);
    [[-1,-1],[-1,1],[1,-1],[1,1]].forEach(function(c){var lg=new THREE.Mesh(new THREE.BoxGeometry(0.08,0.75,0.08),tbm);lg.position.set(c[0]*0.7,0.375,c[1]*0.35);tg.add(lg);});
    [-1,1].forEach(function(z){var bn=new THREE.Mesh(new THREE.BoxGeometry(1.6,0.06,0.3),bnm);bn.position.set(0,0.45,z*0.8);tg.add(bn);});
    var ind=new THREE.Mesh(new THREE.SphereGeometry(0.3,12,12),new THREE.MeshBasicMaterial({color:0xff3333}));ind.position.y=1.8;ind.visible=false;tg.add(ind);
    var bm2=mkBeer();bm2.position.set(0,0.85,0);bm2.visible=false;tg.add(bm2);
    addPeopleToTable(tg);tg.position.set(pos[0],0,pos[1]);scene.add(tg);
    tables.push({g:tg,x:pos[0],z:pos[1],need:false,has:false,ind:ind,beer:bm2,cd:0});
  });
  // Player
  var pg=mkLego(0xffffff,0x222222,0x4a2a0a,'flat');
  var apron=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.2,0.22),new THREE.MeshLambertMaterial({color:0x2266cc}));apron.position.set(0,0.58,0.01);pg.add(apron);
  var tray=new THREE.Mesh(new THREE.CylinderGeometry(0.25,0.25,0.02,12),new THREE.MeshLambertMaterial({color:0x666666}));tray.position.set(0.3,0.52,0.1);tray.visible=false;tray.name='tray';pg.add(tray);
  var bp=[{x:0.1,z:0.05},{x:-0.1,z:0.05},{x:0.1,z:-0.05},{x:-0.1,z:-0.05}];
  for(var bi=0;bi<4;bi++){var hb=mkBeer();hb.scale.set(0.7,0.7,0.7);hb.position.set(0.3+bp[bi].x,0.55,0.1+bp[bi].z);hb.visible=false;hb.name='hb'+bi;pg.add(hb);}
  scene.add(pg);player=pg;
  // Sky
  var ss=new THREE.Mesh(new THREE.SphereGeometry(1.5,16,16),new THREE.MeshBasicMaterial({color:0xFFFF88}));ss.position.set(15,25,10);scene.add(ss);
  var cm=new THREE.MeshLambertMaterial({color:0xffffff,transparent:true,opacity:0.85});
  [[-12,18,-15],[8,16,-20],[20,17,-10],[-5,19,-25],[15,20,-18]].forEach(function(cp){var cg=new THREE.Group();for(var ci=0;ci<4;ci++){var cs=new THREE.Mesh(new THREE.SphereGeometry(1+Math.random()*1.5,8,8),cm);cs.position.set(ci*1.2-1.5,Math.random()*0.5,Math.random()*0.8);cs.scale.y=0.5;cg.add(cs);}cg.position.set(cp[0],cp[1],cp[2]);scene.add(cg);});
  camera.position.set(0,8,8);
  window.addEventListener('resize',function(){camera.aspect=window.innerWidth/window.innerHeight;camera.updateProjectionMatrix();renderer.setSize(window.innerWidth,window.innerHeight);});
  animate();
}
