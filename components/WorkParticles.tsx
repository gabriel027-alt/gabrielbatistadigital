"use client";

import { useEffect, useRef } from "react";
import styles from "@/app/editorial.module.css";

/**
 * "Seus projetos": as the folder opens, the same points that formed Gabriel at the top and then his hand pour out of
 * it and form each project card, every point in the colour of its spot of that project's own picture; the picture
 * resolves under them as they land. Driven by the scroll (the folder scene), so it comes apart on the way back, and the
 * cards are read live, so the points follow the strip as it runs. The pictures are only read. Only with motion allowed
 * and WebGL; otherwise the strip comes out of the folder as before.
 */
const CARDS = 14; // Both laps of the strip: the second is the decorative copy of the first seven.
const VERTEX = `attribute vec2 target;
attribute vec3 seed;
attribute float card;
uniform vec4 rects[${CARDS}]; // Each card's picture on screen: left, top, width, height (CSS px).
uniform vec2 mouth;           // The opening of the folder.
uniform vec2 res;
uniform float f, size, ratio, cells, mouthW;
varying vec2 vUv;
varying float vA;
void main(){
  vec4 r=rects[int(card)];
  vec2 home=r.xy+target*r.zw;
  // Points leave the folder one after another and arc out to their card.
  float k=clamp((f-.36-seed.z*.16)/.2,0.,1.);
  float e=k*k*(3.-2.*k);
  // They come out of the mouth of the folder, along its width, and only show once they are out of it.
  vec2 start=mouth+vec2((seed.x-.5)*mouthW*.7,-seed.y*8.);
  vec2 bend=mix(start,home,.5)+vec2(0.,-res.y*(.12+seed.y*.14));
  vec2 pos=mix(mix(start,bend,e),mix(bend,home,e),e);
  pos+=vec2(sin(seed.y*40.+f*30.),cos(seed.x*40.+f*26.))*5.*(1.-e);
  // Hidden for a card off screen; they fade as the picture resolves under them.
  float onScreen=step(-r.z,r.x)*step(r.x,res.x)*step(.5,r.z);
  vA=onScreen*smoothstep(.06,.2,k)*step(pos.y,mouth.y-4.)*(1.-smoothstep(.72,.8,f));
  vUv=vec2((mod(card,7.)+target.x)/cells,target.y);
  vec2 clip=pos/res*2.-1.;
  gl_Position=vec4(clip.x,-clip.y,0.,1.);
  gl_PointSize=size*ratio*(1.+(1.-e)*.8);
}`;
const FRAGMENT = `precision mediump float;
uniform sampler2D atlas;
varying vec2 vUv;
varying float vA;
void main(){
  float d=length(gl_PointCoord-.5);
  float a=smoothstep(.5,.22,d)*vA;
  gl_FragColor=vec4(texture2D(atlas,vUv).rgb*a,a);
}`;

type Connection = { saveData?: boolean };

export function WorkParticles() {
  const anchor = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const stage = anchor.current?.parentElement;
    const root = stage?.closest<HTMLElement>("[data-editorial]");
    const track = stage?.closest<HTMLElement>("[data-work-track]");
    const pasta = stage?.querySelector<HTMLElement>("[data-pasta]");
    const items = [...(stage?.querySelectorAll<HTMLElement>("[data-strip] li") ?? [])];
    // Read live: each card's link becomes a button once the page is interactive.
    const media = () => items.map(item => item.firstElementChild as HTMLElement);
    if (!stage || !root || !track || !pasta || items.length !== CARDS) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches || (navigator as Navigator & { connection?: Connection }).connection?.saveData) return;
    const view = document.createElement("canvas");
    view.className = styles.handParticles;
    view.setAttribute("aria-hidden", "true");
    const gl = view.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false });
    if (!gl) return;
    const shader = (type: number, source: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, source); gl.compileShader(s); return s; };
    const program = gl.createProgram()!;
    gl.attachShader(program, shader(gl.VERTEX_SHADER, VERTEX));
    gl.attachShader(program, shader(gl.FRAGMENT_SHADER, FRAGMENT));
    gl.linkProgram(program);
    const parallel = gl.getExtension("KHR_parallel_shader_compile");
    let linked = false;
    document.body.append(view);
    const u = (name: string) => gl.getUniformLocation(program, name);
    const buffer = gl.createBuffer();
    let count = 0, ready = false;

    // One row of seven cells, one per project, each cropped like its card; each point gets a random spot of its card.
    // The cells are repainted every frame from what the card shows right now (its running loop, or its picture), so
    // the points carry the colours that will resolve under them.
    const atlas = document.createElement("canvas");
    const paint = atlas.getContext("2d")!;
    const cw = 128;
    let ch = 0;
    const painted = () => {
      for (let i = 0; i < 7; i++) {
        const loops = [items[i], items[i + 7]].map(item => item.querySelector("video")).filter(v => v && v.readyState >= 2 && v.videoWidth) as HTMLVideoElement[];
        const img = items[i].querySelector("img");
        const source: CanvasImageSource | null = loops[0] ?? (img?.complete && img.naturalWidth ? img : null);
        if (!source) return false;
        const iw = source instanceof HTMLVideoElement ? source.videoWidth : (source as HTMLImageElement).naturalWidth;
        const ih = source instanceof HTMLVideoElement ? source.videoHeight : (source as HTMLImageElement).naturalHeight;
        const scale = Math.max(cw / iw, ch / ih), sw = cw / scale, sh = ch / scale;
        paint.drawImage(source, (iw - sw) / 2, (ih - sh) / 2, sw, sh, i * cw, 0, cw, ch);
      }
      return true;
    };
    const plant = () => {
      if (ready) return;
      const box = media()[0].getBoundingClientRect();
      ch = Math.max(48, Math.round(cw * (box.height || 4) / (box.width || 5)));
      atlas.width = cw * 7; atlas.height = ch;
      if (!painted()) return;
      const per = innerWidth < 700 ? 1000 : 1800;
      count = per * CARDS;
      const points = new Float32Array(count * 6);
      for (let i = 0; i < count; i++) points.set([Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.floor(i / per)], i * 6);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, atlas);
      ready = true;
    };

    const showCards = (value: string) => media().forEach(m => { if (m) m.style.opacity = value; });
    let frame = 0;
    const hide = () => { view.style.visibility = "hidden"; };
    const allowed = () => !document.hidden && !reduced.matches && root.dataset.editorialMotion !== "off" && root.dataset.editorialAnimated === "true";
    // The pictures are lazy: ask for them while the folder scene is still a couple of screens away.
    let asked = false;
    const draw = () => {
      frame = 0;
      if (!asked && track.getBoundingClientRect().top < innerHeight * 2.5) {
        asked = true;
        items.forEach(item => { const img = item.querySelector("img"); if (img) img.loading = "eager"; });
      }
      plant();
      if (!allowed() || !ready) { hide(); showCards(""); return; }
      // The folder scene's own progress (its timeline runs from the top of the track to its end).
      const top = track.getBoundingClientRect().top + scrollY;
      const f = (scrollY - top) / Math.max(1, track.offsetHeight - innerHeight);
      // The pictures wait until the points have formed them, then resolve under them.
      showCards(String(Math.min(1, Math.max(0, (f - .66) / .1))));
      if (f <= .34 || f >= .82) { hide(); return; }
      if (!linked) {
        if (parallel && !gl.getProgramParameter(program, parallel.COMPLETION_STATUS_KHR)) { frame = requestAnimationFrame(draw); return; }
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { hide(); showCards(""); return; }
        linked = true;
      }
      view.style.visibility = "visible";
      const ratio = Math.min(devicePixelRatio || 1, 1.5);
      const w = Math.round(innerWidth * ratio), h = Math.round(innerHeight * ratio);
      if (view.width !== w || view.height !== h) { view.width = w; view.height = h; }
      gl.viewport(0, 0, w, h);
      gl.useProgram(program);
      const rects = new Float32Array(CARDS * 4);
      media().forEach((m, i) => { const b = m.getBoundingClientRect(); rects.set([b.left, b.top, b.width, b.height], i * 4); });
      const mouth = pasta.getBoundingClientRect();
      if (painted()) gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, atlas);
      gl.uniform4fv(u("rects"), rects);
      // The folder's mouth: the top edge of its front, a little below the top of the folder (its tab and sheet).
      gl.uniform2f(u("mouth"), mouth.left + mouth.width / 2, mouth.top + mouth.height * .22);
      gl.uniform1f(u("mouthW"), mouth.width);
      gl.uniform2f(u("res"), innerWidth, innerHeight);
      gl.uniform1f(u("f"), f);
      gl.uniform1f(u("cells"), 7);
      gl.uniform1f(u("size"), innerWidth < 700 ? 2.2 : 2.6);
      gl.uniform1f(u("ratio"), ratio);
      gl.uniform1i(u("atlas"), 0);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      const target = gl.getAttribLocation(program, "target"), seed = gl.getAttribLocation(program, "seed"), card = gl.getAttribLocation(program, "card");
      gl.enableVertexAttribArray(target);
      gl.vertexAttribPointer(target, 2, gl.FLOAT, false, 24, 0);
      gl.enableVertexAttribArray(seed);
      gl.vertexAttribPointer(seed, 3, gl.FLOAT, false, 24, 8);
      gl.enableVertexAttribArray(card);
      gl.vertexAttribPointer(card, 1, gl.FLOAT, false, 24, 20);
      gl.drawArrays(gl.POINTS, 0, count);
      // Keep drawing while visible: the strip runs on its own.
      frame = requestAnimationFrame(draw);
    };
    const wake = () => { if (!frame) frame = requestAnimationFrame(draw); };
    addEventListener("scroll", wake, { passive: true });
    addEventListener("resize", wake);
    const loads = items.slice(0, 7).map(item => item.querySelector("img")).filter(Boolean) as HTMLImageElement[];
    loads.forEach(img => img.addEventListener("load", wake));
    const motion = new MutationObserver(wake);
    motion.observe(root, { attributes: true, attributeFilter: ["data-editorial-motion", "data-editorial-animated"] });
    wake();
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", wake);
      removeEventListener("resize", wake);
      loads.forEach(img => img.removeEventListener("load", wake));
      motion.disconnect();
      showCards("");
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      view.remove();
    };
  }, []);

  return <span ref={anchor} hidden />;
}
