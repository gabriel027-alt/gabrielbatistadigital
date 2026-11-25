"use client";

import { useEffect, useRef } from "react";
import styles from "@/app/editorial.module.css";
import { CLOUD_GLSL } from "@/lib/cloud-shader";

/**
 * The hero portrait, formed and breathing out in fine points, with a sea of clouds at dusk behind it.
 * - On arrival thousands of points, each carrying the colour of the spot of the photo it belongs to, gather out of the
 *   air and form Gabriel at once; the photo resolves under them. (The photo is hidden from the first paint by a tiny
 *   inline script in app/page.tsx and the `heroAssemble` CSS, with a fallback that shows it after 2.6 s regardless.)
 * - Then he stays still and keeps breathing out the same points from his outline, rising and fading. Only they move:
 *   the photo is only read, never changed. The pointer or finger pushes them aside.
 * - After the brand dot's scene the clouds rise from below and settle around him: wine shadows, the red of the
 *   portrait's light, peach tops, two slow layers, never on his skin. The pointer or finger parts them.
 * Leaving the hero, components/CloudTransition.tsx takes the clouds over and brightens them to the paper.
 * Masks made from the photo (docs/research/hero-relight/person_mask.py: red = person, plus the wall plate) keep the
 * clouds behind him and say where the points belong. Only with motion allowed, the hero in view and WebGL.
 */
const QUAD = `attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;gl_Position=vec4(p,0.,1.);}`;

const CLOUDS = `precision highp float;
varying vec2 v;
uniform sampler2D trail;
uniform float time, intro, aspect;
${CLOUD_GLSL}
void main(){
  vec2 p=v*vec2(aspect,1.);
  float e=texture2D(trail,v).a;
  vec2 o=vec2(.05/aspect,.05);
  vec2 slope=vec2(texture2D(trail,v+vec2(o.x,0.)).a-texture2D(trail,v-vec2(o.x,0.)).a,
                  texture2D(trail,v+vec2(0.,o.y)).a-texture2D(trail,v-vec2(0.,o.y)).a);
  // The hand bends the clouds around it.
  p+=slope*.06;
  // The bank rises in from below the frame and rests around his shoulders. Dusk: mauve-grey shadows, warm grey
  // bodies, tops lit by the red-and-peach light of the portrait, kept darker than the peach of the name on them.
  float floorY=mix(-.4,.1,intro);
  vec3 lit=vec3(.86,.66,.6), mid=vec3(.4,.31,.31), shade=vec3(.12,.085,.09);
  vec4 far=cloudBank(p,aspect,floorY+.13,1.,time,e,lit*.72,mid*.78,shade);
  vec4 near=cloudBank(p,aspect,floorY,0.,time,e,lit,mid,shade);
  // Nothing before their time: not even the small stray cloud that drifts above the bank.
  gl_FragColor=(near+far*(1.-near.a))*smoothstep(0.,.2,intro);
}`;

const MAIN = `precision highp float;
varying vec2 v;
uniform sampler2D person,wall,clouds;
uniform vec4 crop;     // Photo, mask and wall uv = crop.xy + v * crop.zw (object-fit: cover at the page's object-position).
uniform float leave, cover;  // leave: clouds handed to the transition; cover: the wall stands in for the photo.
vec2 photoUv(vec2 uv){return crop.xy+uv*crop.zw;}
void main(){
  // Right up to his outline: the mask has no margin, so no band of wall is left around him.
  float behind=1.-smoothstep(.4,.7,texture2D(person,photoUv(v)).r);
  vec4 back=texture2D(clouds,v)*behind*(1.-leave);
  // While the points form him, the wall behind him (rebuilt from the photo) stands where he will be.
  vec4 stand=vec4(texture2D(wall,photoUv(v)).rgb*cover,cover);
  gl_FragColor=back+stand*(1.-back.a);
}`;

const POINT_FRAGMENT = `precision mediump float;
uniform sampler2D photo,person;
uniform float tint, behindOnly;
varying vec2 vUv;
varying float vA;
varying vec2 vAt;   // Where the point is now, as a spot of the photo (and of the mask).
void main(){
  float d=length(gl_PointCoord-.5);
  float a=smoothstep(.5,.22,d)*vA;
  // The breathed-out points pass behind him: over his face or body they are hidden.
  a*=1.-behindOnly*smoothstep(.35,.6,texture2D(person,vAt).r);
  // Lifted toward the warm light of the portrait, so points from dark hair still read as light, not specks.
  vec3 c=mix(texture2D(photo,vUv).rgb,vec3(1.,.737,.584),tint);
  gl_FragColor=vec4(c*a,a);
}`;

// Gathering: each point flies from a loose swirl below and around to its own spot of the photo.
const GATHER = `attribute vec2 target;
attribute vec3 seed;
uniform vec4 crop;
uniform float t, size;
varying vec2 vUv;
varying float vA;
varying vec2 vAt;
void main(){
  vec2 home=(target-crop.xy)/crop.zw;
  float k=clamp((t-seed.z*.7)/1.2,0.,1.);
  float e=1.-pow(1.-k,3.);
  float ang=seed.x*6.2832;
  vec2 from=home+vec2(cos(ang),sin(ang)*.6-.45)*(.3+seed.y*.55);
  vec2 pos=mix(from,home,e)+vec2(sin(ang*3.+t*4.),cos(ang*2.+t*4.))*.025*(1.-e);
  vA=smoothstep(0.,.12,k)*(1.-smoothstep(2.,2.5,t));
  vUv=target;
  vAt=crop.xy+pos*crop.zw;
  gl_Position=vec4(pos*2.-1.,0.,1.);
  gl_PointSize=size*(1.+(1.-e)*1.2);
}`;

// Breathing out: points leave his outline, rise and fade, on their own rhythm; the hand pushes them aside.
const EMIT = `attribute vec2 origin;
attribute vec2 seed;
uniform vec4 crop;
uniform float time, size, emit, aspect, handOn;
uniform vec2 hand;
varying vec2 vUv;
varying float vA;
varying vec2 vAt;
void main(){
  float r3=fract(seed.x*7.31+seed.y*3.17);
  float period=5.+seed.x*5.;
  float age=fract(time/period+seed.y);
  vec2 home=(origin-crop.xy)/crop.zw;
  // They rise and fan out wide, far enough to fill the empty sky and the corners; those leaving the shoulders
  // also drift outward, away from his face.
  float out_=sign(home.x-.5)*smoothstep(.0,.25,.45-home.y)*.6;
  vec2 dir=vec2((seed.x-.5)*1.5+out_,1.-abs(out_)*.5);
  float far=(.16+seed.y*.5)*age;
  vec2 pos=home+vec2(dir.x/aspect,dir.y)*far+vec2(sin(age*5.+seed.x*20.)*.01/aspect,0.);
  vec2 d=(pos-hand)*vec2(aspect,1.);
  float m=exp(-dot(d,d)*90.)*handOn;
  pos+=normalize(d+vec2(1e-4))/vec2(aspect,1.)*m*.06;
  // Depth: some larger and dimmer, some small and sharp.
  vA=sin(age*3.14159)*emit*(.45+.55*(1.-r3));
  vUv=origin;
  vAt=crop.xy+pos*crop.zw;
  gl_Position=vec4(pos*2.-1.,0.,1.);
  gl_PointSize=size*(.8+r3*1.4)*(1.5-age*.7);
}`;

type Connection = { saveData?: boolean };

/** How long the clouds take to settle once they begin to rise (after the dot has signed the name). */
const RISE_FOR = 5;
/** The sea of clouds behind the portrait. Off since direction A (21/11/2026); true brings it back on computers. */
const CLOUD_SEA = false;
/** Arrival speed of the points that form the portrait: 2 = formed in about 0.8 s instead of 1.6 s (21/11/2026). */
const GATHER_SPEED = 2;
/** After the arrival the breathing points fade out and the canvas rests (seconds after load). 9 s on 21/11/2026; 3 s
 * (fading out by 5 s) since 22/11/2026, so nothing on the top moves on its own for more than five seconds. */
const POINTS_REST = Infinity; // 22/11/2026, the user's choice: the points keep drifting; the pause button stops them.
/** The clouds are drawn at this fraction of the canvas size and scaled up: they are soft, it costs nothing to the eye. */
const CLOUD_SCALE = .62;
/** If the images are not in by then, he is not hidden any longer: no gathering, the photo simply shows. */
const GATHER_DEADLINE = 1600;

export function HeroClouds() {
  const anchor = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    return run();

    function run(): (() => void) | undefined {
    const holder = anchor.current?.parentElement;
    const hero = holder?.closest("section");
    const root = holder?.closest<HTMLElement>("[data-editorial]");
    const img = holder?.querySelector("img");
    const html = document.documentElement;
    const show = () => { delete html.dataset.heroAssemble; };
    // Tells the brand dot's scene (EditorialMotion) that he is formed, so the story goes in order: formed, signed, clouds.
    const formed = () => { if (html.dataset.heroFormed !== undefined) return; html.dataset.heroFormed = ""; window.dispatchEvent(new Event("gb:hero-formed")); };
    const release = () => { show(); formed(); };
    if (!holder || !hero || !img) { release(); return; }
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches || (navigator as Navigator & { connection?: Connection }).connection?.saveData) { release(); return; }
    // A fresh canvas per run: its context is released on cleanup, and a released canvas cannot be drawn on again.
    const view = document.createElement("canvas");
    view.className = styles.heroClouds;
    view.dataset.heroClouds = "";
    view.setAttribute("aria-hidden", "true");
    const gl = view.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false });
    if (!gl) { release(); return; }

    const build = (vertex: string, fragment: string) => {
      const shader = (type: number, source: string) => {
        const s = gl.createShader(type)!;
        gl.shaderSource(s, source);
        gl.compileShader(s);
        return s;
      };
      const program = gl.createProgram()!;
      gl.attachShader(program, shader(gl.VERTEX_SHADER, vertex));
      gl.attachShader(program, shader(gl.FRAGMENT_SHADER, fragment));
      gl.linkProgram(program);
      return program;
    };
    // Compiled in the background where the browser can (KHR_parallel_shader_compile): asking for the result at once
    // froze the page for over a second on arrival, right while the brand dot's scene plays.
    const parallel = gl.getExtension("KHR_parallel_shader_compile");
    const cloudProgram = build(QUAD, CLOUDS), mainProgram = build(QUAD, MAIN);
    const gatherProgram = build(GATHER, POINT_FRAGMENT), emitProgram = build(EMIT, POINT_FRAGMENT);
    const programs = [cloudProgram, mainProgram, gatherProgram, emitProgram];
    let compiled = false;
    const compiling = () => !!parallel && programs.some(program => !gl.getProgramParameter(program, parallel.COMPLETION_STATUS_KHR));
    anchor.current!.after(view);
    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const u = (program: WebGLProgram, name: string) => gl.getUniformLocation(program, name);
    const texture = (unit: number) => {
      gl.activeTexture(gl.TEXTURE0 + unit);
      const t = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      return t;
    };
    // Units: 0 trail, 1 person mask, 2 photo, 3 wall, 4 the small cloud picture.
    [0, 1, 2, 3].forEach(texture);
    const cloudTexture = texture(4);
    const cloudBuffer = gl.createFramebuffer();
    // Once the programs are ready: check them, give them their textures and the current framing.
    const finishCompile = () => {
      if (programs.some(program => !gl.getProgramParameter(program, gl.LINK_STATUS))) return false;
      gl.useProgram(cloudProgram);
      gl.uniform1i(u(cloudProgram, "trail"), 0);
      gl.useProgram(mainProgram);
      gl.uniform1i(u(mainProgram, "person"), 1);
      gl.uniform1i(u(mainProgram, "wall"), 3);
      gl.uniform1i(u(mainProgram, "clouds"), 4);
      for (const program of [gatherProgram, emitProgram]) { gl.useProgram(program); gl.uniform1i(u(program, "photo"), 2); gl.uniform1i(u(program, "person"), 1); gl.uniform1f(u(program, "behindOnly"), program === emitProgram ? 1 : 0); }
      compiled = true;
      fit();
      return true;
    };
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    // The trail lives in a small 2D canvas: soft stamps where the pointer goes and a slow fade.
    const trail = document.createElement("canvas");
    const pen = trail.getContext("2d")!;
    const TRAIL_SCALE = 1 / 6;

    // Points: where each belongs on the photo, read from the silhouette mask.
    const gatherBuffer = gl.createBuffer(), emitBuffer = gl.createBuffer();
    let gatherCount = 0, emitCount = 0;
    const plant = (image: HTMLImageElement, phone: boolean) => {
      // Phones read a small copy of the mask (25/11/2026): scanning the full mask held a mid-range phone for a long moment
      // on arrival. The upper-edge test keeps its 3 px on the original, scaled to the copy.
      const scan = phone ? Math.min(1, 420 / image.naturalWidth) : 1;
      const c = document.createElement("canvas");
      c.width = Math.max(1, Math.round(image.naturalWidth * scan)); c.height = Math.max(1, Math.round(image.naturalHeight * scan));
      const g = c.getContext("2d", { willReadFrequently: true })!;
      g.drawImage(image, 0, 0, c.width, c.height);
      const near = Math.max(1, Math.round(3 * scan));
      const { data, width, height } = g.getImageData(0, 0, c.width, c.height);
      const red = (x: number, y: number) => data[(Math.min(height - 1, Math.max(0, y)) * width + Math.min(width - 1, Math.max(0, x))) * 4];
      const inside: number[] = [], edge: number[] = [];
      for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
        if (red(x, y) < 160) continue;
        inside.push(x, y);
        // Only the upper edges (top of the hair, tops of the shoulders): rising from there the points go straight
        // into the air; from the sides of the head they would drift across his face like specks on the skin.
        if (red(x, y - near) < 90 || (y > height * .72 && (red(x - near, y) < 90 || red(x + near, y) < 90))) edge.push(x, y);
      }
      const pick = (list: number[]) => { const i = Math.floor(Math.random() * list.length / 2) * 2; return [(list[i] + Math.random()) / width, 1 - (list[i + 1] + Math.random()) / height]; };
      gatherCount = inside.length ? (phone ? 6500 : 14000) : 0;
      const gather = new Float32Array(gatherCount * 5);
      for (let i = 0; i < gatherCount; i++) gather.set([...pick(inside), Math.random(), Math.random(), Math.random()], i * 5);
      gl.bindBuffer(gl.ARRAY_BUFFER, gatherBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, gather, gl.STATIC_DRAW);
      emitCount = edge.length ? (phone ? 900 : 1900) : 0;
      const emit = new Float32Array(emitCount * 4);
      for (let i = 0; i < emitCount; i++) emit.set([...pick(edge), Math.random(), Math.random()], i * 4);
      gl.bindBuffer(gl.ARRAY_BUFFER, emitBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, emit, gl.STATIC_DRAW);
    };

    // Precomputed points (25/11/2026, docs/research/hero-relight/hero_points.py): the same positions plant() reads from the
    // mask, shipped as a small file so the browser skips the scan. Seeds are drawn here.
    const usePoints = (buffer: ArrayBuffer) => {
      const view16 = new DataView(buffer);
      const g = view16.getUint32(0, true), e = view16.getUint32(4, true);
      const pairs = new Uint16Array(buffer, 8, (g + e) * 2);
      gatherCount = g; emitCount = e;
      const gather = new Float32Array(g * 5), emit = new Float32Array(e * 4);
      for (let i = 0; i < g; i++) gather.set([pairs[i * 2] / 65535, pairs[i * 2 + 1] / 65535, Math.random(), Math.random(), Math.random()], i * 5);
      for (let i = 0; i < e; i++) emit.set([pairs[(g + i) * 2] / 65535, pairs[(g + i) * 2 + 1] / 65535, Math.random(), Math.random()], i * 4);
      gl.bindBuffer(gl.ARRAY_BUFFER, gatherBuffer); gl.bufferData(gl.ARRAY_BUFFER, gather, gl.STATIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, emitBuffer); gl.bufferData(gl.ARRAY_BUFFER, emit, gl.STATIC_DRAW);
    };

    // The masks that match the photo on screen (the phone gets its own portrait crop), and the photo itself.
    let mask: HTMLImageElement | null = null;
    let maskBase = "";
    let photoSrc = "";
    let ready = 0;                   // 1 = mask, 2 = photo, 4 = wall.
    const upload = (unit: number, source: TexImageSource) => {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, source);
    };
    const load = () => {
      const current = img.currentSrc || img.src;
      if (current && current !== photoSrc && img.complete && img.naturalWidth) {
        photoSrc = current;
        // The points only need the photo's colours: a small copy is plenty, and sending the full 3840 px photo to the
        // graphics card held the page up for over half a second.
        const small = document.createElement("canvas");
        small.width = Math.min(720, img.naturalWidth);
        small.height = Math.max(1, Math.round(img.naturalHeight * small.width / img.naturalWidth));
        small.getContext("2d")!.drawImage(img, 0, 0, small.width, small.height);
        upload(2, small);
        ready |= 2;
      }
      // Before the photo loads, currentSrc is empty and img.src is the computer crop: decide by the same media query as
      // the <picture>, so a phone never downloads the computer mask and wall.
      const phone = img.currentSrc ? img.currentSrc.includes("mobile") : matchMedia("(max-width: 700px)").matches;
      const base = `/images/hero/${phone ? "gabriel-hero-mobile" : "gabriel-hero-wide"}`;
      if (base === maskBase) return;
      maskBase = base;
      ready &= ~5;
      const fetchImage = (suffix: string, unit: number, flag: number, then?: (image: HTMLImageElement) => void) => {
        const next = new Image();
        next.onload = () => {
          if (maskBase !== base) return;
          upload(unit, next);
          ready |= flag;
          then?.(next);
          wake();
        };
        next.src = `${base}-${suffix}.webp`;
      };
      // The mask counts as ready only once the points are in too (from the file, or scanned if the file fails).
      let maskImage: HTMLImageElement | null = null, points: ArrayBuffer | null | false = null;
      const settle = () => {
        if (maskBase !== base || !maskImage || points === null) return;
        if (points) usePoints(points); else plant(maskImage, base.endsWith("mobile"));
        mask = maskImage; ready |= 1; fit(); wake();
      };
      fetch(`${base}-points.bin`).then(r => r.ok ? r.arrayBuffer() : Promise.reject()).then(b => { points = b; }, () => { points = false; }).then(settle);
      fetchImage("mask", 1, 0, image => { maskImage = image; settle(); });
      fetchImage("wall", 3, 4);
    };

    let cloudSize = [1, 1];
    let aspect = 1;
    let pointSize = 3;
    const crop = [0, 0, 1, 1];
    // Same framing as the <img>: object-fit cover at its computed object-position.
    const fit = () => {
      const phone = holder.offsetWidth < 700;
      const ratio = Math.min(devicePixelRatio || 1, phone ? 1.25 : 1.5);
      const bw = holder.offsetWidth, bh = holder.offsetHeight;
      aspect = bw / Math.max(1, bh);
      view.width = Math.max(1, Math.round(bw * ratio));
      view.height = Math.max(1, Math.round(bh * ratio));
      trail.width = Math.max(1, Math.round(bw * TRAIL_SCALE));
      trail.height = Math.max(1, Math.round(bh * TRAIL_SCALE));
      cloudSize = [Math.max(1, Math.round(bw * CLOUD_SCALE)), Math.max(1, Math.round(bh * CLOUD_SCALE))];
      pointSize = (phone ? 2.4 : 2.8) * ratio;
      gl.activeTexture(gl.TEXTURE4);
      gl.bindTexture(gl.TEXTURE_2D, cloudTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, cloudSize[0], cloudSize[1], 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.bindFramebuffer(gl.FRAMEBUFFER, cloudBuffer);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, cloudTexture, 0);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      if (!compiled) return;
      gl.useProgram(cloudProgram);
      gl.uniform1f(u(cloudProgram, "aspect"), aspect);
      if (!mask) return;
      const iw = mask.naturalWidth, ih = mask.naturalHeight;
      const scale = Math.max(bw / iw, bh / ih);
      const sw = bw / (iw * scale), sh = bh / (ih * scale);
      const [px, py] = getComputedStyle(img).objectPosition.split(" ").map(value => parseFloat(value) / 100);
      // uv y grows upward in GL; the images were flipped on upload, so v=0 is the bottom of the photo.
      const x0 = (1 - sw) * (isNaN(px) ? .5 : px);
      const yTop = (1 - sh) * (isNaN(py) ? .5 : py);
      crop.splice(0, 4, x0, 1 - yTop - sh, sw, sh);
      for (const program of [mainProgram, gatherProgram, emitProgram]) { gl.useProgram(program); gl.uniform4f(u(program, "crop"), crop[0], crop[1], crop[2], crop[3]); }
    };

    let last: { x: number; y: number } | null = null;
    let hand = { x: -9, y: -9, at: -1e9 };
    let trailCleared = false;
    const stamp = (clientX: number, clientY: number) => {
      const box = view.getBoundingClientRect();
      if (!box.width) return;
      hand = { x: (clientX - box.left) / box.width, y: 1 - (clientY - box.top) / box.height, at: performance.now() };
      const x = (clientX - box.left) / box.width * trail.width;
      const y = (clientY - box.top) / box.height * trail.height;
      const from = last ?? { x, y };
      const distance = Math.hypot(x - from.x, y - from.y);
      const steps = Math.max(1, Math.ceil(distance / 2));
      const radius = trail.height * .085 * Math.min(1.6, .85 + distance / 40);
      pen.globalCompositeOperation = "lighter";
      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        const cx = from.x + (x - from.x) * t, cy = from.y + (y - from.y) * t;
        const g = pen.createRadialGradient(cx, cy, 0, cx, cy, radius);
        g.addColorStop(0, "rgba(255,255,255,.26)");
        g.addColorStop(1, "rgba(255,255,255,0)");
        pen.fillStyle = g;
        pen.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
      }
      last = { x, y };
    };

    const points = (program: WebGLProgram, buffer: WebGLBuffer | null, count: number, layout: [string, number][]) => {
      if (!count) return;
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      const stride = layout.reduce((sum, [, size]) => sum + size, 0) * 4;
      let offset = 0;
      const used: number[] = [];
      for (const [name, size] of layout) {
        const at = gl.getAttribLocation(program, name);
        gl.enableVertexAttribArray(at);
        gl.vertexAttribPointer(at, size, gl.FLOAT, false, stride, offset);
        used.push(at);
        offset += size * 4;
      }
      gl.drawArrays(gl.POINTS, 0, count);
      used.forEach(at => gl.disableVertexAttribArray(at));
    };
    const fullQuad = (program: WebGLProgram) => {
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      const at = gl.getAttribLocation(program, "p");
      gl.enableVertexAttribArray(at);
      gl.vertexAttribPointer(at, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      gl.disableVertexAttribArray(at);
    };

    let visible = false;
    let frame = 0;
    let previous = 0;
    const born = performance.now();
    let riseStart = 0;
    let gatherStart = 0;           // 0: not decided; -1: no gathering (images late or not hidden).
    const clear = () => { pen.clearRect(0, 0, trail.width, trail.height); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); show(); };
    const allowed = () => visible && ready === 7 && !document.hidden && !reduced.matches && root?.dataset.editorialMotion !== "off";
    // Too late to gather, or nothing hidden to gather into: the photo shows as it is.
    const deadline = window.setTimeout(() => { if (!gatherStart) { gatherStart = -1; release(); } }, GATHER_DEADLINE);
    const draw = (now: number) => {
      frame = 0;
      if (!allowed()) { release(); return; }
      if (!compiled) {
        // Still compiling in the background: look again next frame, without blocking the page.
        if (compiling()) { frame = requestAnimationFrame(draw); return; }
        if (!finishCompile()) { release(); view.remove(); return; }
      }
      const dt = Math.min(50, previous ? now - previous : 16) / 16.7;
      previous = now;
      if (!gatherStart) { gatherStart = html.dataset.heroAssemble !== undefined && gatherCount ? now : -1; if (gatherStart > 0) html.dataset.heroForming = ""; }
      const g = gatherStart > 0 ? (now - gatherStart) / 1000 * GATHER_SPEED : 99;
      // Resting: with no sea of clouds, once the points have faded the canvas is cleared and stops drawing.
      const restIn = 1 - Math.min(1, Math.max(0, (now - born) / 1000 - POINTS_REST) / 2);
      if (!CLOUD_SEA && restIn <= 0 && g > 3) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); show(); frame = 0; return;
      }
      // Formed once the points have mostly landed: the dot may be born.
      if (g >= 1.6) formed();
      // The pointer's trail fades over a few seconds; after that it is empty, so it is no longer faded and re-sent to the
      // graphics card every frame (25/11/2026: that per-frame work weighed on mid-range phones).
      if (now - hand.at < 6000 || !trailCleared) {
        pen.globalCompositeOperation = "destination-out";
        pen.fillStyle = `rgba(0,0,0,${Math.min(.2, .011 * dt)})`;
        pen.fillRect(0, 0, trail.width, trail.height);
        if (now - hand.at >= 6000) { pen.clearRect(0, 0, trail.width, trail.height); trailCleared = true; } else trailCleared = false;
        gl.activeTexture(gl.TEXTURE0);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, trail);
      }
      // The clouds rise once the dot has signed the name (or after 10 s at most): never skipped.
      if (!riseStart && (html.dataset.heroSigned !== undefined || now - born > 10000)) riseStart = now + 200;
      const rise = riseStart ? Math.min(1, Math.max(0, (now - riseStart) / 1000 / RISE_FOR)) : 0;
      // 1. The clouds, small.
      gl.disable(gl.BLEND);
      gl.bindFramebuffer(gl.FRAMEBUFFER, cloudBuffer);
      gl.viewport(0, 0, cloudSize[0], cloudSize[1]);
      gl.useProgram(cloudProgram);
      gl.uniform1f(u(cloudProgram, "time"), now / 1000);
      // Phones keep the points and the cream seam of the transition, but not the sea of clouds behind him: on a real
      // phone (Samsung Internet, 21/11/2026) the clouds were drawn over his face once the address bar hid.
      // Direction A (21/11/2026): no sea of clouds on any screen, the promise, the calls and the signature sit where
      // the clouds rose. To bring them back on computers: holder.offsetWidth < 700 ? 0 : 1 - (1 - rise) ** 3.
      gl.uniform1f(u(cloudProgram, "intro"), CLOUD_SEA && holder.offsetWidth >= 700 ? 1 - (1 - rise) ** 3 : 0);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      fullQuad(cloudProgram);
      // 2. The clouds scaled up behind him, and the wall standing in for him while the points gather.
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, view.width, view.height);
      gl.useProgram(mainProgram);
      // As the hero leaves, its clouds hand over to the transition's bank, which starts in the same dusk colours.
      const gone = Math.min(1, Math.max(0, 1 - hero.getBoundingClientRect().bottom / innerHeight));
      gl.uniform1f(u(mainProgram, "leave"), Math.min(1, gone / .14));
      gl.uniform1f(u(mainProgram, "cover"), 1 - Math.min(1, Math.max(0, (g - 1.6) / .7)));
      gl.clear(gl.COLOR_BUFFER_BIT);
      fullQuad(mainProgram);
      // The canvas now stands in for him: the photo underneath can be shown.
      show();
      // 3. The points, over everything.
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      if (g < 2.6) {
        gl.useProgram(gatherProgram);
        gl.uniform1f(u(gatherProgram, "t"), g);
        gl.uniform1f(u(gatherProgram, "size"), pointSize);
        gl.uniform1f(u(gatherProgram, "tint"), 0);
        points(gatherProgram, gatherBuffer, gatherCount, [["target", 2], ["seed", 3]]);
      }
      gl.useProgram(emitProgram);
      gl.uniform1f(u(emitProgram, "time"), now / 1000);
      gl.uniform1f(u(emitProgram, "size"), pointSize);
      gl.uniform1f(u(emitProgram, "aspect"), aspect);
      gl.uniform1f(u(emitProgram, "tint"), 1);
      gl.uniform1f(u(emitProgram, "emit"), Math.min(1, Math.max(0, (Math.min(g, 99) - 2.1) / 1.2)) * (1 - Math.min(1, gone / .3)) * (CLOUD_SEA ? 1 : restIn));
      gl.uniform2f(u(emitProgram, "hand"), hand.x, hand.y);
      gl.uniform1f(u(emitProgram, "handOn"), Math.max(0, 1 - (now - hand.at) / 1200));
      points(emitProgram, emitBuffer, emitCount, [["origin", 2], ["seed", 2]]);
      frame = requestAnimationFrame(draw);
    };
    const wake = () => { if (!frame && allowed()) { previous = 0; frame = requestAnimationFrame(draw); } };

    const mouse = (event: PointerEvent) => { if (event.pointerType !== "touch") stamp(event.clientX, event.clientY); };
    const leave = () => { last = null; };
    // Touch: the finger parts the clouds and the points while the page scrolls, without taking the scroll over.
    const touch = (event: TouchEvent) => { const point = event.touches[0]; if (point) stamp(point.clientX, point.clientY); };
    const touchStart = (event: TouchEvent) => { last = null; touch(event); };
    hero.addEventListener("pointermove", mouse);
    hero.addEventListener("pointerleave", leave);
    hero.addEventListener("touchstart", touchStart, { passive: true });
    hero.addEventListener("touchmove", touch, { passive: true });
    hero.addEventListener("touchend", leave, { passive: true });
    const seen = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) wake(); });
    seen.observe(hero);
    const resize = new ResizeObserver(() => fit());
    resize.observe(holder);
    const motion = new MutationObserver(() => { if (root?.dataset.editorialMotion === "off") clear(); else wake(); });
    if (root) motion.observe(root, { attributes: true, attributeFilter: ["data-editorial-motion"] });
    const loaded = () => { load(); wake(); };
    img.addEventListener("load", loaded);
    load();
    fit();
    const visibility = () => wake();
    document.addEventListener("visibilitychange", visibility);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(deadline);
      hero.removeEventListener("pointermove", mouse);
      hero.removeEventListener("pointerleave", leave);
      hero.removeEventListener("touchstart", touchStart);
      hero.removeEventListener("touchmove", touch);
      hero.removeEventListener("touchend", leave);
      seen.disconnect();
      resize.disconnect();
      motion.disconnect();
      img.removeEventListener("load", loaded);
      document.removeEventListener("visibilitychange", visibility);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      view.remove();
    };
    }
  }, []);

  return <span ref={anchor} hidden />;
}
