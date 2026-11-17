"use client";

import { useEffect, useRef } from "react";
import styles from "@/app/editorial.module.css";

/**
 * "Feito à mão": the same points that formed Gabriel at the top pour down from "clique" with the brand dot and form his
 * open hand, the way he was formed in the hero; the photo of the hand resolves under them as the dot lands in the palm.
 * Driven by the scroll (the same stretch as the dot's flight from "clique" to the palm), so it comes apart on the way
 * back. Each point carries the colour of its spot of the hand photo, whose own transparency says where the hand is: the
 * image is only read. Only with motion allowed and WebGL; otherwise the hand simply rises as before.
 */
const VERTEX = `attribute vec2 target;
attribute vec3 seed;
uniform vec4 rect;     // The hand photo on screen: left, top, width, height (CSS px, from the top left).
uniform vec2 from;     // Where the stream starts: the tittle of "clique".
uniform vec2 res;      // Screen size in CSS px.
uniform float f, size, ratio;
varying vec2 vUv;
varying float vA;
void main(){
  vec2 home=rect.xy+target*rect.zw;
  // Points leave one after another and pour down along a loose curve, as if dragged behind the dot.
  float k=clamp((f-seed.z*.5)/.48,0.,1.);
  float e=k*k*(3.-2.*k);
  // They come down from above the screen, from him at the top, around the line the dot falls along.
  vec2 start=vec2(mix(from.x,home.x,.35)+(seed.x-.5)*res.x*.5,-40.-seed.y*res.y*.35);
  vec2 bend=mix(start,home,.55)+vec2((seed.y-.5)*res.x*.18,0.);
  vec2 pos=mix(mix(start,bend,e),mix(bend,home,e),e);
  pos+=vec2(sin(seed.y*40.+f*18.),cos(seed.x*40.+f*15.))*6.*(1.-e);
  // They fade as the photo of the hand resolves under them, when the dot lands.
  vA=smoothstep(0.,.06,k)*(1.-smoothstep(.9,1.,f));
  vUv=target;
  vec2 clip=pos/res*2.-1.;
  gl_Position=vec4(clip.x,-clip.y,0.,1.);
  gl_PointSize=size*ratio*(1.+(1.-e)*.9);
}`;
const FRAGMENT = `precision mediump float;
uniform sampler2D hand;
varying vec2 vUv;
varying float vA;
void main(){
  float d=length(gl_PointCoord-.5);
  float a=smoothstep(.5,.22,d)*vA;
  // Dark points (the sleeve) are lifted toward the warm light of the portrait: on the paper they would read as dirt.
  vec3 c=texture2D(hand,vUv).rgb;
  float lum=dot(c,vec3(.3,.59,.11));
  c=mix(c,vec3(1.,.74,.6),(1.-smoothstep(.15,.55,lum))*.55);
  gl_FragColor=vec4(c*a,a);
}`;

type Connection = { saveData?: boolean };

export function HandParticles() {
  const anchor = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const stage = anchor.current?.parentElement;
    const root = stage?.closest<HTMLElement>("[data-editorial]");
    const track = stage?.closest<HTMLElement>("[data-creation-track]");
    const img = stage?.querySelector<HTMLImageElement>("[data-palm-hand]");
    if (!stage || !root || !track || !img) return;
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
    // Compiled in the background where the browser can; checked only when first needed.
    const parallel = gl.getExtension("KHR_parallel_shader_compile");
    let linked = false;
    document.body.append(view);
    const u = (name: string) => gl.getUniformLocation(program, name);
    const buffer = gl.createBuffer();
    let count = 0;
    let ready = false;

    // Where each point belongs: opaque pixels of a small copy of the hand photo, with their colours.
    const plant = () => {
      if (ready || !img.complete || !img.naturalWidth) return;
      const w = 520, h = Math.round(img.naturalHeight * w / img.naturalWidth);
      const c = document.createElement("canvas");
      c.width = w; c.height = h;
      const g = c.getContext("2d", { willReadFrequently: true })!;
      g.drawImage(img, 0, 0, w, h);
      const { data } = g.getImageData(0, 0, w, h);
      const inside: number[] = [];
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (data[(y * w + x) * 4 + 3] > 200) inside.push(x, y);
      if (!inside.length) return;
      count = innerWidth < 700 ? 5000 : 9000;
      const points = new Float32Array(count * 5);
      for (let i = 0; i < count; i++) {
        const j = Math.floor(Math.random() * inside.length / 2) * 2;
        points.set([(inside[j] + Math.random()) / w, (inside[j + 1] + Math.random()) / h, Math.random(), Math.random(), Math.random()], i * 5);
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c);
      ready = true;
    };

    // The same stretch as the dot's flight in EditorialMotion: from the tittle of "clique" at 30% of the screen to 20%
    // of the palm scene (which starts while its stage is entering, its top at 70% of the screen).
    const range = () => {
      const tittle = document.querySelector("[data-hook-tittle=carry]");
      if (!tittle) return null;
      const startY = tittle.getBoundingClientRect().top + scrollY - innerHeight * .3;
      const top = track.getBoundingClientRect().top + scrollY, s = top - innerHeight * .7, e = top + track.offsetHeight - innerHeight;
      return { start: startY, end: s + (e - s) * .2, tittle };
    };
    let frame = 0;
    const hide = () => { view.style.visibility = "hidden"; };
    const allowed = () => !document.hidden && !reduced.matches && root.dataset.editorialMotion !== "off" && root.dataset.editorialAnimated === "true";
    const draw = (now: number) => {
      frame = 0;
      plant();
      const r = range();
      if (!allowed() || !ready || !r) { hide(); img.style.opacity = ""; return; }
      const f = (scrollY - r.start) / Math.max(1, r.end - r.start);
      // The photo of the hand waits until the points have formed it, then resolves under them.
      img.style.opacity = String(Math.min(1, Math.max(0, (f - .86) / .12)));
      if (f <= 0 || f >= 1.02) { hide(); return; }
      if (!linked) {
        if (parallel && !gl.getProgramParameter(program, parallel.COMPLETION_STATUS_KHR)) { frame = requestAnimationFrame(draw); return; }
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { hide(); img.style.opacity = ""; return; }
        linked = true;
      }
      view.style.visibility = "visible";
      const ratio = Math.min(devicePixelRatio || 1, 1.5);
      const w = Math.round(innerWidth * ratio), h = Math.round(innerHeight * ratio);
      if (view.width !== w || view.height !== h) { view.width = w; view.height = h; }
      gl.viewport(0, 0, w, h);
      gl.useProgram(program);
      const box = img.getBoundingClientRect(), t = r.tittle.getBoundingClientRect();
      gl.uniform4f(u("rect"), box.left, box.top, box.width, box.height);
      gl.uniform2f(u("from"), t.left + t.width / 2, t.top + t.height / 2);
      gl.uniform2f(u("res"), innerWidth, innerHeight);
      gl.uniform1f(u("f"), f);
      gl.uniform1f(u("size"), innerWidth < 700 ? 2.2 : 2.6);
      gl.uniform1f(u("ratio"), ratio);
      gl.uniform1i(u("hand"), 0);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      const target = gl.getAttribLocation(program, "target"), seed = gl.getAttribLocation(program, "seed");
      gl.enableVertexAttribArray(target);
      gl.vertexAttribPointer(target, 2, gl.FLOAT, false, 20, 0);
      gl.enableVertexAttribArray(seed);
      gl.vertexAttribPointer(seed, 3, gl.FLOAT, false, 20, 8);
      gl.drawArrays(gl.POINTS, 0, count);
      frame = requestAnimationFrame(draw);
    };
    const wake = () => { if (!frame) frame = requestAnimationFrame(draw); };
    addEventListener("scroll", wake, { passive: true });
    addEventListener("resize", wake);
    img.addEventListener("load", wake);
    const motion = new MutationObserver(wake);
    motion.observe(root, { attributes: true, attributeFilter: ["data-editorial-motion", "data-editorial-animated"] });
    wake();
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", wake);
      removeEventListener("resize", wake);
      img.removeEventListener("load", wake);
      motion.disconnect();
      img.style.opacity = "";
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      view.remove();
    };
  }, []);

  return <span ref={anchor} hidden />;
}
