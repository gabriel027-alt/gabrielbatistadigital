/**
 * Soft cumulus clouds in GLSL (WebGL 1), shared by the hero (components/HeroClouds.tsx) and the transition
 * (components/CloudTransition.tsx). Painted, not simulated: each cloud is a dome of overlapping puffs (spheres seen from
 * the front), lit from the upper left so tops catch the light and bellies fall into shade, with vapour on every rim;
 * below the domes the bank is a solid sea of cloud. Neutral greys and warm whites: red clouds read as flesh or blood.
 */
export const CLOUD_GLSL = `
float h(vec2 q){return fract(sin(dot(q,vec2(127.1,311.7)))*43758.5453);}
float h1(float x){return fract(sin(x*127.1)*43758.5453);}
float n(vec2 q){vec2 i=floor(q),f=fract(q);f=f*f*(3.-2.*f);
  return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 q){float s=0.,a=.5;mat2 r=mat2(.8,.6,-.6,.8);for(int k=0;k<4;k++){s+=a*n(q);q=r*q*2.03;a*=.5;}return s;}

// One bank of clouds. p is in screen heights from the bottom left; aspect is the screen's width in heights.
// floorY: where the domes stand (below it the bank is solid). layer 0 near, 1 far (smaller, higher, slower).
// open: 0..1, the hand clearing the cloud. Returns premultiplied colour.
vec4 cloudBank(vec2 p,float aspect,float floorY,float layer,float t,float open,vec3 lit,vec3 mid,vec3 shade){
  vec3 L=normalize(vec3(-.45,.8,.5));
  float lamSum=0., wSum=0.;
  float dens=0.;
  float span=aspect+1.2;
  const int CLOUDS=6, PUFFS=7;
  for(int c=0;c<CLOUDS;c++){
    float kc=float(c)*13.+layer*97.;
    bool high=c==CLOUDS-1;                          // One small cloud drifts higher up.
    float width=mix(.28,.5,h1(kc+1.))*(high?.45:1.)*(1.-layer*.3);
    float cx=fract(h1(kc+2.)+t*(.005+.003*h1(kc+3.))*(1.+layer*.5))*span-.6;
    float base=high?floorY+.42+h1(kc+4.)*.2:floorY+(h1(kc+4.)-.5)*.06;
    // Skip clouds far from this pixel, sideways and in height (wide enough that no rim is ever cut straight):
    // most of the screen is open sky, and testing every puff there was what cost the frame rate.
    if(abs(p.x-cx)>width*2.)continue;
    if(p.y<base-width*.5||p.y>base+width*1.25)continue;
    for(int i=0;i<PUFFS;i++){
      float k=kc+float(i)*1.7;
      float u=(h1(k+5.)-.5)*2.;                     // -1..1 across the dome.
      float r=width*mix(.22,.42,h1(k+6.))*(1.-abs(u)*.35);
      // Taller in the middle: a dome, not a row of balls.
      vec2 o=vec2(cx+u*width*.75,base+(1.-u*u)*width*.38*h1(k+7.)+r*.3);
      vec2 d=(p-o)*vec2(.92,1.12);
      vec2 local=d/r;
      // Coarse enough never to go below a pixel (fine noise aliases into stair steps on the rim).
      float vapour=(n(local*2.2+k)*.7+n(local*3.9+k*3.)*.3-.5)*.55;
      float dist=length(d)/r+vapour;
      float cover=smoothstep(1.,.62,dist);
      dens=max(dens,cover);
      if(dist<1.){
        // Light blended across overlapping puffs, weighted toward the front one: a hard switch from one puff's light
        // to the next draws steps along the seams.
        float z=sqrt(1.-dist*dist);
        vec3 nn=normalize(vec3(local,z));
        float w=cover*pow(z*r+o.y*.08+.02,4.)*1e4;
        lamSum+=w*max(dot(nn,L),0.);
        wSum+=w;
      }
    }
  }
  // The sea of cloud under the domes, with a vapour edge of its own.
  float body=0.;
  if(p.y<floorY+.12){
    float sea=fbm(p*vec2(5.,8.)+vec2(t*.02,0.)+layer*5.)-.5;
    body=smoothstep(floorY+.06,floorY-.06,p.y+sea*.08);
  }
  if(dens<.003&&body<.003)return vec4(0.);
  float lam=wSum>0.?lamSum/wSum:.3;
  vec3 col=mix(shade,mid,smoothstep(0.,.5,lam));
  col=mix(col,lit,smoothstep(.45,.95,lam));
  // A bright rim where the vapour thins against the light.
  col+=lit*dens*(1.-dens)*1.4*smoothstep(.3,.9,lam)*.35;
  vec3 seaCol=mix(mid,shade,smoothstep(floorY,floorY-.5,p.y)*.8);
  float a=max(dens,body);
  col=mix(seaCol,col,dens/max(a,1e-4));
  a*=1.-open*.85;
  return vec4(col*a,a);
}
`;
