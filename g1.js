var lc=(navigator.language||'en').substring(0,2);
var lang=lc==='hu'?'hu':lc==='sr'?'sr':'en';
var T={
  hu:{score:'PONT',time:'IDO',carrying:'SORT VISZEL!',title:'SORKERT SZIMULATOR',subtitle:'Szolgald ki a vendegeket!',
    inst1:'Menj a CSAPHOZ (sarga pult hatol) sorert',inst2:'Vidd a PIROS jelzesu asztalokhoz',inst3:'90 masodperced van!',
    mobile:'Mobil: Bal ujj mozog, Jobb ujj gomb',pc:'PC: WASD + SPACE',start:'KOPPINTS AZ INDITASHOZ',
    pickup:'FELVSZ',putdown:'LETESZ',move:'MOZGAS',
    gotBeer:'Sort vettel! Vidd egy piros asztalhoz!',goBar:'Menj a sarga CSAPHOZ hatol!',
    goTable:'Menj egy PIROS jelzesu asztalhoz!',plusOne:'+1 PONT! Menj ujabb sorert!',
    hintPickup:'>> NYOMD A GOMBOT SORERT <<',hintDrop:'>> NYOMD A GOMBOT LETESZNI <<',
    end:'VEGE!',endScore:function(n){return 'Kiszolgaltal '+n+' sort!';}},
  sr:{score:'POENI',time:'VREME',carrying:'NOSIS PIVO!',title:'BASTA SIMULATOR',subtitle:'Posluzi goste!',
    inst1:'Idi do TOCKA (zuti sank pozadi) za pivo',inst2:'Odnesi do stolova sa CRVENIM indikatorom',inst3:'Imas 90 sekundi!',
    mobile:'Mobil: Levi palac pomera, Desni palac dugme',pc:'PC: WASD + SPACE',start:'DODIRNI ZA POCETAK',
    pickup:'UZMI',putdown:'POSLUZI',move:'POMERI',
    gotBeer:'Uzeo si pivo! Odnesi do crvenog stola!',goBar:'Idi do zutog TOCKA pozadi!',
    goTable:'Idi do stola sa CRVENIM indikatorom!',plusOne:'+1 POEN! Idi po jos piva!',
    hintPickup:'>> PRITISNI DUGME ZA PIVO <<',hintDrop:'>> PRITISNI DUGME ZA SERVIS <<',
    end:'KRAJ!',endScore:function(n){return 'Posluzio si '+n+' piva!';}},
  en:{score:'SCORE',time:'TIME',carrying:'CARRYING BEER!',title:'BEER GARDEN SIM',subtitle:'Serve the customers!',
    inst1:'Go to the TAP (yellow bar in back) for beer',inst2:'Bring it to tables with RED indicators',inst3:'You have 90 seconds!',
    mobile:'Mobile: Left thumb move, Right thumb button',pc:'PC: WASD + SPACE',start:'TAP TO START',
    pickup:'PICKUP',putdown:'SERVE',move:'MOVE',
    gotBeer:'Got beer! Bring it to a red table!',goBar:'Go to the yellow BAR in the back!',
    goTable:'Go to a table with RED indicator!',plusOne:'+1 POINT! Get more beer!',
    hintPickup:'>> PRESS BUTTON FOR BEER <<',hintDrop:'>> PRESS BUTTON TO SERVE <<',
    end:'GAME OVER!',endScore:function(n){return 'You served '+n+' beers!';}}
};
var t=T[lang];
var renderer,scene,camera,player,clock;
var GS='start',score=0,timeLeft=90;
var tables=[],barPos={x:0,z:-7};
var carrying=0,maxCarry=4,keys={},pAngle=0;
var isMob='ontouchstart'in window||navigator.maxTouchPoints>0;
var jDX=0,jDZ=0,timerI=null,needI=null;
var joyId=null,joyCX=0,joyCY=0,btnId=null,msgTimer=0;
var shirtColors=[0xcc3333,0x3366cc,0x33aa33,0xcc9933,0x9933cc,0xcc6699,0x339999,0xff6600,0x6633cc,0xaaaa33];
var legoYellow=0xF2CD37;
var hairColors=[0x222222,0x4a2a0a,0x8a6a3a,0x111111,0x663300,0xaa8844,0xcc4400];
var hairTypes=['flat','cap','tall'];
var pantsColors=[0x1a1a8a,0x333333,0x2a5a2a,0x5a2a1a,0x444444,0x1a3a6a];
function mkLego(shirtC,pantsC,hairC,hairType){
  var g=new THREE.Group();var ym=new THREE.MeshLambertMaterial({color:legoYellow});
  var head=new THREE.Mesh(new THREE.CylinderGeometry(0.14,0.14,0.18,12),ym);head.position.y=0.95;g.add(head);
  var stud=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.06,0.04,8),ym);stud.position.y=1.06;g.add(stud);
  for(var ex=-1;ex<=1;ex+=2){var eye=new THREE.Mesh(new THREE.SphereGeometry(0.02,6,6),new THREE.MeshBasicMaterial({color:0x000000}));eye.position.set(ex*0.05,0.96,0.13);g.add(eye);}
  var smile=new THREE.Mesh(new THREE.BoxGeometry(0.08,0.015,0.02),new THREE.MeshBasicMaterial({color:0x000000}));smile.position.set(0,0.9,0.135);g.add(smile);
  var hm=new THREE.MeshLambertMaterial({color:hairC});
  if(hairType==='flat'){var h=new THREE.Mesh(new THREE.CylinderGeometry(0.155,0.155,0.06,12),hm);h.position.y=1.06;g.add(h);}
  else if(hairType==='cap'){var h=new THREE.Mesh(new THREE.CylinderGeometry(0.08,0.16,0.12,12),hm);h.position.y=1.08;g.add(h);var brim=new THREE.Mesh(new THREE.BoxGeometry(0.16,0.02,0.1),hm);brim.position.set(0,1.04,0.12);g.add(brim);}
  else{var h=new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.155,0.14,12),hm);h.position.y=1.1;g.add(h);}
  var torso=new THREE.Mesh(new THREE.BoxGeometry(0.35,0.32,0.2),new THREE.MeshLambertMaterial({color:shirtC}));torso.position.y=0.68;g.add(torso);
  for(var s=-1;s<=1;s+=2){var arm=new THREE.Mesh(new THREE.CylinderGeometry(0.04,0.04,0.28,8),new THREE.MeshLambertMaterial({color:shirtC}));arm.position.set(s*0.22,0.65,0);g.add(arm);var hand=new THREE.Mesh(new THREE.CylinderGeometry(0.035,0.035,0.06,8),ym);hand.position.set(s*0.22,0.49,0);g.add(hand);}
  var hips=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.08,0.18),new THREE.MeshLambertMaterial({color:pantsC}));hips.position.y=0.5;g.add(hips);
  for(var s=-1;s<=1;s+=2){var leg=new THREE.Mesh(new THREE.BoxGeometry(0.13,0.3,0.16),new THREE.MeshLambertMaterial({color:pantsC}));leg.position.set(s*0.085,0.3,0);g.add(leg);var foot=new THREE.Mesh(new THREE.BoxGeometry(0.13,0.05,0.2),new THREE.MeshLambertMaterial({color:pantsC}));foot.position.set(s*0.085,0.15,0.02);g.add(foot);}
  return g;
}
function mkPerson(shirtC){var pc=pantsColors[Math.floor(Math.random()*pantsColors.length)];var hc=hairColors[Math.floor(Math.random()*hairColors.length)];var ht=hairTypes[Math.floor(Math.random()*hairTypes.length)];return mkLego(shirtC,pc,hc,ht);}
function addPeopleToTable(tg){var seats=[{x:-0.5,z:0.8,ry:Math.PI},{x:0.5,z:0.8,ry:Math.PI},{x:-0.5,z:-0.8,ry:0},{x:0.5,z:-0.8,ry:0}];var count=2+Math.floor(Math.random()*3);for(var i=0;i<Math.min(count,seats.length);i++){var s=seats[i];var sc=shirtColors[Math.floor(Math.random()*shirtColors.length)];var p=mkPerson(sc);p.position.set(s.x,0,s.z);p.rotation.y=s.ry;tg.add(p);}}
function mb(w,h,d,c,x,y,z){var m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshLambertMaterial({color:c}));m.position.set(x,y,z);m.castShadow=true;return m;}
function mkBeer(){var g=new THREE.Group();var gl=new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.09,0.35,8),new THREE.MeshLambertMaterial({color:0xddaa22,transparent:true,opacity:0.8}));gl.position.y=0.175;g.add(gl);var fo=new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.12,0.08,8),new THREE.MeshLambertMaterial({color:0xffffff}));fo.position.y=0.38;g.add(fo);return g;}
var hud=document.getElementById('hud2d');var hctx=hud.getContext('2d');
function resizeHud(){hud.width=window.innerWidth;hud.height=window.innerHeight;}
resizeHud();window.addEventListener('resize',resizeHud);
function showMsg(txt){document.getElementById('msg').textContent=txt;document.getElementById('msg').style.display='block';msgTimer=120;}
function setOverlayText(){document.getElementById('ovT').textContent=t.title;document.getElementById('ovS').textContent=t.subtitle;document.getElementById('ovI1').textContent=t.inst1;document.getElementById('ovI2').textContent=t.inst2;document.getElementById('ovI3').textContent=t.inst3;document.getElementById('ovM').textContent=t.mobile;document.getElementById('ovP').textContent=t.pc;document.getElementById('ovStart').textContent=t.start;}
setOverlayText();
