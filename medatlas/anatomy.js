/* Lightweight self-contained WebGL anatomical illustration. Deliberately schematic; not a diagnostic model. */
class AnatomyViewer {
  constructor(canvas, options={}){
    this.canvas=canvas;this.options=options;this.system='all';this.focus='heart';this.spin=true;this.dragging=false;this.rot=options.mini?-.29:-.29;this.tilt=.055;this.zoom=options.mini?1:1;this.alive=true;this.last=performance.now();this.mouse={x:0,y:0};this.gl=canvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:false});
    if(this.gl){try{this.initGL();}catch(e){console.warn('3D viewer fallback',e);this.gl=null;}};
    if(!this.gl){this.ctx=canvas.getContext('2d');}
    this.onDown=e=>{this.dragging=true;this.spin=false;this.mouse={x:e.clientX,y:e.clientY};try{canvas.setPointerCapture(e.pointerId)}catch{}};
    this.onMove=e=>{if(!this.dragging)return;this.rot+=(e.clientX-this.mouse.x)*.007;this.tilt=Math.min(.65,Math.max(-.65,this.tilt+(e.clientY-this.mouse.y)*.006));this.mouse={x:e.clientX,y:e.clientY};};
    this.onUp=()=>this.dragging=false;
    this.onWheel=e=>{e.preventDefault();this.zoom=Math.min(1.65,Math.max(.65,this.zoom-e.deltaY*.0006));};
    canvas.addEventListener('pointerdown',this.onDown);canvas.addEventListener('pointermove',this.onMove);canvas.addEventListener('pointerup',this.onUp);canvas.addEventListener('pointercancel',this.onUp);canvas.addEventListener('wheel',this.onWheel,{passive:false});
    this.resize();this.raf=requestAnimationFrame(t=>this.draw(t));
  }
  initGL(){
    const gl=this.gl;
    const vs=`attribute vec3 aPosition; attribute vec3 aNormal; uniform mat4 uMVP; uniform mat4 uModel; varying vec3 vNormal; varying vec3 vPos; void main(){vNormal=mat3(uModel)*aNormal;vPos=(uModel*vec4(aPosition,1.0)).xyz;gl_Position=uMVP*vec4(aPosition,1.0);}`;
    const fs=`precision mediump float;uniform vec4 uColor; uniform float uGlow;varying vec3 vNormal;varying vec3 vPos; void main(){vec3 n=normalize(vNormal);vec3 l=normalize(vec3(-0.5,0.8,1.4));float diff=max(dot(n,l),0.0);float edge=pow(1.0-max(dot(n,vec3(0.,0.,1.)),0.),2.0); vec3 color=uColor.rgb*(0.44+0.56*diff)+vec3(0.20,0.22,0.3)*edge*.22+uColor.rgb*uGlow*.28;gl_FragColor=vec4(color,uColor.a);}`;
    const compile=(type,src)=>{let s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));return s;};
    let p=gl.createProgram();gl.attachShader(p,compile(gl.VERTEX_SHADER,vs));gl.attachShader(p,compile(gl.FRAGMENT_SHADER,fs));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(p));gl.useProgram(p);this.program=p;
    this.loc={pos:gl.getAttribLocation(p,'aPosition'),norm:gl.getAttribLocation(p,'aNormal'),mvp:gl.getUniformLocation(p,'uMVP'),model:gl.getUniformLocation(p,'uModel'),color:gl.getUniformLocation(p,'uColor'),glow:gl.getUniformLocation(p,'uGlow')};
    let vertices=[],normals=[],indices=[],rings=22,segments=30;
    for(let i=0;i<=rings;i++){let theta=i*Math.PI/rings;for(let j=0;j<=segments;j++){let phi=j*Math.PI*2/segments,x=Math.sin(theta)*Math.cos(phi),y=Math.cos(theta),z=Math.sin(theta)*Math.sin(phi);vertices.push(x,y,z);normals.push(x,y,z);}}
    for(let i=0;i<rings;i++)for(let j=0;j<segments;j++){let a=i*(segments+1)+j,b=a+segments+1;indices.push(a,b,a+1,b,b+1,a+1);}
    this.count=indices.length;
    const addBuffer=(data,attrib)=>{let b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);gl.enableVertexAttribArray(attrib);gl.vertexAttribPointer(attrib,3,gl.FLOAT,false,0,0);};
    addBuffer(vertices,this.loc.pos);addBuffer(normals,this.loc.norm);let ib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indices),gl.STATIC_DRAW);
    gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.clearColor(0,0,0,0);
  }
  ident(){return [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];}
  mul(a,b){let r=new Array(16).fill(0);for(let c=0;c<4;c++)for(let i=0;i<4;i++)for(let k=0;k<4;k++)r[c*4+i]+=a[k*4+i]*b[c*4+k];return r;}
  translate(x,y,z){let m=this.ident();m[12]=x;m[13]=y;m[14]=z;return m;}
  scale(x,y,z){let m=this.ident();m[0]=x;m[5]=y;m[10]=z;return m;}
  ry(t){let m=this.ident(),c=Math.cos(t),s=Math.sin(t);m[0]=c;m[2]=-s;m[8]=s;m[10]=c;return m;}
  rx(t){let m=this.ident(),c=Math.cos(t),s=Math.sin(t);m[5]=c;m[6]=s;m[9]=-s;m[10]=c;return m;}
  rz(t){let m=this.ident(),c=Math.cos(t),s=Math.sin(t);m[0]=c;m[1]=s;m[4]=-s;m[5]=c;return m;}
  ortho(l,r,b,t,n,f){return [2/(r-l),0,0,0,0,2/(t-b),0,0,0,0,-2/(f-n),0,-(r+l)/(r-l),-(t+b)/(t-b),-(f+n)/(f-n),1];}
  hex(h){h=h.replace('#','');return [parseInt(h.slice(0,2),16)/255,parseInt(h.slice(2,4),16)/255,parseInt(h.slice(4,6),16)/255];}
  obj(x,y,z,sx,sy,sz,hex,alpha=1,glow=0,ang=0){let gl=this.gl,M=this.mul(this.translate(x,y,z),this.mul(this.rz(ang),this.scale(sx,sy,sz))),world=this.mul(this.global,M);gl.uniformMatrix4fv(this.loc.model,false,new Float32Array(world));gl.uniformMatrix4fv(this.loc.mvp,false,new Float32Array(this.mul(this.proj,world)));let c=this.hex(hex);gl.uniform4f(this.loc.color,c[0],c[1],c[2],alpha);gl.uniform1f(this.loc.glow,glow);gl.drawElements(gl.TRIANGLES,this.count,gl.UNSIGNED_SHORT,0);}
  rod(a,b,r,col,alpha=1){let cx=(a[0]+b[0])/2,cy=(a[1]+b[1])/2,cz=(a[2]+b[2])/2,dx=b[0]-a[0],dy=b[1]-a[1],dz=b[2]-a[2],len=Math.hypot(dx,dy,dz),ang=-Math.atan2(dx,dy);this.obj(cx,cy,cz,r,len/2,r,col,alpha,0,ang);}
  renderGL(time){let gl=this.gl;let w=this.canvas.width,h=this.canvas.height;gl.viewport(0,0,w,h);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(this.program);
    this.global=this.mul(this.rx(this.tilt),this.ry(this.rot));let ar=w/h;this.proj=this.ortho(-3.2*ar/this.zoom,3.2*ar/this.zoom,-3.2/this.zoom,3.2/this.zoom,-15,15);
    let t=time*.001,breath=1+Math.sin(t*1.45)*.027,beat=1+Math.pow(Math.max(0,Math.sin(t*6.6)),7)*.085;let sys=this.system,selected=this.focus;
    const visible=(group,id)=>sys==='all'||sys===group||id===selected;
    const faint=(group,id)=>sys==='all'||sys===group||id===selected?1:.18;
    const highlighted=id=>selected===id?.17:0;
    // internal support / skeletal structure
    if(visible('skeletal','spine')){
      for(let i=0;i<24;i++){let yy=1.47-i*.104;this.obj(0,yy,-.12,.115,.052,.095,i%2?'#d6d5c5':'#f0e8d8',faint('skeletal','spine'));}
      for(let side of [-1,1]){for(let i=0;i<9;i++){let yy=1.3-i*.17;let xx=(.26+i*.023)*side;this.rod([.07*side,yy,-.14],[xx,yy-.03,.16],.032,'#ddd5bc',faint('skeletal','spine')*.93);}}
      this.obj(0,1.48,.04,.2,.24,.16,'#dad7cb',faint('skeletal','spine'));
    }
    if(visible('vascular','heart')){
      let vessels=[[[0,1.17,.27],[.03,1.62,.19],.075,'#de536c'],[[.03,1.62,.19],[-.12,1.84,.1],.06,'#df5368'],[[0,1.2,.33],[.3,.99,.27],.065,'#5496ca'],[[.3,.99,.27],[.5,.63,.24],.045,'#5496ca'],[[.08,.94,.32],[-.07,.42,.23],.055,'#d75775'],[[-.07,.42,.23],[.01,-.38,.13],.05,'#d75775']];
      vessels.forEach(v=>this.rod(v[0],v[1],v[2],v[3],faint('vascular','heart')));
    }
    if(visible('organs','lungs')){let op=faint('organs','lungs');
      this.obj(-.39,.79,.06,.345*breath,.73*breath,.27,'#86b5d2',op,highlighted('lungs'),-.09);
      this.obj(.39,.79,.06,.345*breath,.73*breath,.27,'#87bad8',op,highlighted('lungs'),.09);
      this.rod([0,1.68,.21],[0,1.3,.22],.07,'#e3b7b5',op);
      this.rod([0,1.3,.22],[-.27,1.1,.26],.045,'#dbabb2',op);
      this.rod([0,1.3,.22],[.27,1.1,.26],.045,'#dbabb2',op);
    }
    if(visible('organs','heart')){let op=faint('organs','heart');
      this.obj(-.12,.72,.44,.27*beat,.34*beat,.22*beat,'#e35c6d',op,highlighted('heart'),-.33);
      this.obj(-.22,.55,.45,.23*beat,.25*beat,.2*beat,'#d94e65',op,highlighted('heart'),-.32);
    }
    if(visible('organs','liver')){let op=faint('organs','liver');this.obj(-.32,-.02,.30,.51,.29,.23,'#c18862',op,highlighted('liver'),-.08);this.obj(-.01,-.09,.29,.28,.2,.21,'#ae7153',op,.1);}
    if(visible('organs','stomach')){let op=faint('organs','stomach');this.obj(.34,-.10,.32,.23,.37,.21,'#e0a580',op,highlighted('stomach'),-.35);this.obj(.40,-.33,.30,.19,.16,.19,'#e0a580',op);}
    if(visible('organs','kidneys')){let op=faint('organs','kidneys');this.obj(-.44,-.53,-.17,.19,.29,.17,'#a275a4',op,highlighted('kidneys'),-.18);this.obj(.44,-.53,-.17,.19,.29,.17,'#a275a4',op,highlighted('kidneys'),.18);}
    if(visible('organs','intestines')){let op=faint('organs','intestines');
      for(let i=0;i<5;i++){let row=-.62-i*.135;this.obj((i%2?-.07:.07),row,.28,.44-i*.022,.082,.12,i%2?'#dab191':'#cfa385',op,highlighted('intestines'));}
      this.obj(0,-.89,.17,.55,.38,.22,'#b78374',op*.65);
    }
    if(visible('organs','bladder')){this.obj(0,-1.15,.23,.23,.21,.18,'#dfbe80',faint('organs','bladder'),highlighted('bladder'));}
    if(visible('organs','brain')){let op=faint('organs','brain');this.obj(0,2.28,.06,.34,.32,.31,'#cba4d2',op,highlighted('brain'));for(let x=-2;x<=2;x++)this.obj(x*.12,2.33+Math.cos(x)*.04,.285,.09,.16,.065,'#e0b6dc',op*.94);}
    // soft anatomical envelope (depth writing disabled to reveal underlying geometry)
    gl.depthMask(false);gl.disable(gl.DEPTH_TEST);
    let shell=this.system==='skeletal'?.045:.12;let skin='#97aebf';
    this.obj(0,2.27,-.015,.42,.52,.36,skin,shell);
    this.obj(0,1.61,-.03,.18,.29,.17,skin,shell);
    this.obj(0,.52,-.03,.79,1.03,.36,skin,shell);
    this.obj(0,-.42,-.04,.58,.53,.36,skin,shell);
    for(let side of [-1,1]){
      this.rod([side*.72,1.19,-.04],[side*1.04,.30,-.055],.18,skin,shell);
      this.rod([side*1.04,.30,-.055],[side*1.17,-.57,-.04],.14,skin,shell);
      this.obj(side*1.18,-.65,-.02,.12,.19,.13,skin,shell);
      this.rod([side*.28,-.69,-.06],[side*.36,-1.67,-.08],.255,skin,shell);
      this.rod([side*.36,-1.67,-.08],[side*.39,-2.57,-.08],.19,skin,shell);
      this.obj(side*.4,-2.72,.15,.23,.13,.34,skin,shell);
    }
    gl.enable(gl.DEPTH_TEST);gl.depthMask(true);
    // subtly luminous orbit details don't obstruct anatomy
  }
  fallback(time){let c=this.ctx,w=this.canvas.width,h=this.canvas.height;c.clearRect(0,0,w,h);c.save();c.translate(w/2,h*.48);let s=Math.min(w/4,h/6)*this.zoom;c.scale(s,s);c.rotate(Math.sin(this.rot)*.07);c.lineWidth=.035;c.strokeStyle='#a2b8cc';c.fillStyle='#a9bdc922';let parts=[[-.52,-1,.25,.68],[.52,-1,.25,.68],[0,-1.75,.37,.42],[0,-.22,.67,1.12],[-.25,1.6,.22,.95],[.25,1.6,.22,.95]];parts.forEach(p=>{c.beginPath();c.ellipse(p[0],p[1],p[2],p[3],0,0,Math.PI*2);c.fill();c.stroke();});c.fillStyle='#d35d70';c.beginPath();c.ellipse(-.12,-.4,.22,.24,-.25,0,7);c.fill();c.fillStyle='#79adc9';[-1,1].forEach(side=>{c.beginPath();c.ellipse(side*.33,-.65,.26,.45,0,0,7);c.fill();});c.restore();}
  resize(){let rect=this.canvas.getBoundingClientRect(),dpr=Math.min(2,window.devicePixelRatio||1),w=Math.max(1,Math.round(rect.width*dpr)),h=Math.max(1,Math.round(rect.height*dpr));if(this.canvas.width!==w||this.canvas.height!==h){this.canvas.width=w;this.canvas.height=h;}}
  draw(t){if(!this.alive)return;this.resize();if(this.spin&&!this.dragging)this.rot+=(t-this.last)*.00011;this.last=t;if(this.gl)this.renderGL(t);else if(this.ctx)this.fallback(t);this.raf=requestAnimationFrame(tt=>this.draw(tt));}
  setSystem(s){this.system=s;}setFocus(f){this.focus=f;}reset(){this.rot=-.29;this.tilt=.055;this.zoom=1;this.spin=true;}
  dispose(){this.alive=false;cancelAnimationFrame(this.raf);let c=this.canvas;c.removeEventListener('pointerdown',this.onDown);c.removeEventListener('pointermove',this.onMove);c.removeEventListener('pointerup',this.onUp);c.removeEventListener('pointercancel',this.onUp);c.removeEventListener('wheel',this.onWheel);}
}
window.AnatomyViewer=AnatomyViewer;