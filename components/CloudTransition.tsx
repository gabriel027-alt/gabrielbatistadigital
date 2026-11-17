"use client";

import { useEffect, useRef } from "react";
import styles from "@/app/editorial.module.css";
import { CLOUD_GLSL } from "@/lib/cloud-shader";

/**
 * The hero's clouds as a transition: while the section `from` scrolls away, the cloud bank climbs over the whole
 * screen, and as it climbs its colour turns from dusk (wine, red, peach) to the paper of the next section; then it
 * thins into that paper. It follows the scroll both ways. A fixed layer under the menu, drawn small and scaled up
 * (clouds are soft), only while the section is leaving; nothing with reduced motion, saved data, paused motion or
 * without WebGL, and then the sections simply meet as before.
 */
const VERTEX = `attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;gl_Position=vec4(p,0.,1.);}`;
const FRAGMENT = `precision highp float;
varying vec2 v;
uniform float time, seam, fade, aspect;
${CLOUD_GLSL}
void main(){
  vec2 p=v*vec2(aspect,1.);
  // The paper section's top edge is a bank of cream cumulus: below the domes the bank is the paper itself
  // (#faf6ef), so the clouds simply are the next section arriving, rising with it as the page scrolls.
  // At first these are the hero's own dusk clouds (same palette), taking over from them at the bottom of the screen;
  // as they rise they brighten into the paper.
  float day=smoothstep(.03,.32,seam);
  vec3 lit=mix(vec3(.86,.66,.6),vec3(1.,.995,.985),day);
  vec3 mid=mix(vec3(.4,.31,.31),vec3(.98,.965,.937),day);
  vec3 shade=mix(vec3(.12,.085,.09),vec3(.86,.8,.77),day);
  vec4 c=vec4(0.);
  for(int i=0;i<2;i++){
    float fi=float(i);
    // The far bank stands a little higher behind, smaller and softer.
    vec4 bank=cloudBank(p+vec2(fi*.41,0.),aspect,seam+.02+(1.-fi)*.07,1.-fi,time,0.,lit,mid,mix(shade,mid,.35*(1.-fi)));
    c=bank+c*(1.-bank.a);
  }
  // Below the seam the real paper is already there in the same colour: draw nothing, or its words would be covered.
  gl_FragColor=c*fade*smoothstep(seam-.07,seam-.01,v.y);
}`;

type Connection = { saveData?: boolean };

/** Fraction of the screen size the clouds are drawn at. */
const SCALE = .55;

export function CloudTransition({ from }: { from: string }) {
  const anchor = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = anchor.current?.closest<HTMLElement>("[data-editorial]");
    const section = document.querySelector<HTMLElement>(from);
    if (!root || !section) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches || (navigator as Navigator & { connection?: Connection }).connection?.saveData) return;
    const view = document.createElement("canvas");
    view.className = styles.cloudTransition;
    view.dataset.cloudTransition = "";
    view.setAttribute("aria-hidden", "true");
    const gl = view.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false });
    if (!gl) return;
    const shader = (type: number, source: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, source);
      gl.compileShader(s);
      return s;
    };
    // Not compiled on arrival (it is only needed further down, and compiling froze the page while the brand dot's
    // scene plays): after the arrival, or at the first scroll, and in the background where the browser can.
    const parallel = gl.getExtension("KHR_parallel_shader_compile");
    let program: WebGLProgram | null = null;
    let ready = false;
    const prepare = () => {
      if (program) return;
      program = gl.createProgram()!;
      gl.attachShader(program, shader(gl.VERTEX_SHADER, VERTEX));
      gl.attachShader(program, shader(gl.FRAGMENT_SHADER, FRAGMENT));
      gl.linkProgram(program);
    };
    const finish = () => {
      if (!program || !gl.getProgramParameter(program, gl.LINK_STATUS)) return false;
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      const at = gl.getAttribLocation(program, "p");
      gl.enableVertexAttribArray(at);
      gl.vertexAttribPointer(at, 2, gl.FLOAT, false, 0, 0);
      ready = true;
      fit();
      return true;
    };
    anchor.current!.after(view);
    const uniform = (name: string) => gl.getUniformLocation(program!, name);

    const fit = () => {
      view.width = Math.max(1, Math.round(innerWidth * SCALE));
      view.height = Math.max(1, Math.round(innerHeight * SCALE));
      gl.viewport(0, 0, view.width, view.height);
      if (ready) gl.uniform1f(uniform("aspect"), innerWidth / Math.max(1, innerHeight));
    };
    // How far the section has left: 0 while its bottom is at the bottom of the screen, 1 once it is gone.
    const progress = () => Math.min(1, Math.max(0, 1 - section.getBoundingClientRect().bottom / innerHeight));
    const ease = (x: number) => x * x * (3 - 2 * x);
    let frame = 0;
    const clear = () => { gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); view.style.visibility = "hidden"; };
    const allowed = () => !document.hidden && !reduced.matches && root.dataset.editorialMotion !== "off";
    const draw = (now: number) => {
      frame = 0;
      const p = progress();
      // The red frame glow belongs to the dark photo: it goes out as the paper arrives instead of tinting it.
      root.style.setProperty("--hero-glow", String(1 - ease(Math.min(1, p / .45))));
      if (!allowed() || p <= 0 || p >= 1) { clear(); return; }
      if (!ready) {
        prepare();
        if (parallel && !gl.getProgramParameter(program!, parallel.COMPLETION_STATUS_KHR)) { frame = requestAnimationFrame(draw); return; }
        if (!finish()) { clear(); return; }
      }
      view.style.visibility = "visible";
      // The seam between the sections, in screen heights from the bottom: the clouds ride on it. They fade in as the
      // seam enters and out as it reaches the menu, so nothing ever covers the screen.
      gl.uniform1f(uniform("seam"), p);
      gl.uniform1f(uniform("fade"), ease(Math.min(1, p / .08)) * (1 - ease(Math.min(1, Math.max(0, (p - .8) / .15)))));
      gl.uniform1f(uniform("time"), now / 1000);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      frame = requestAnimationFrame(draw);
    };
    const wake = () => { if (!frame && allowed()) frame = requestAnimationFrame(draw); };
    const resize = () => { fit(); wake(); };
    fit();
    clear();
    // Start compiling once the arrival is over, so it is ready before anyone scrolls that far.
    const early = window.setTimeout(prepare, 6000);
    const scrolled = () => { prepare(); wake(); };
    addEventListener("scroll", scrolled, { passive: true });
    addEventListener("resize", resize);
    const motion = new MutationObserver(() => { if (root.dataset.editorialMotion === "off") clear(); else wake(); });
    motion.observe(root, { attributes: true, attributeFilter: ["data-editorial-motion"] });
    wake();
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(early);
      removeEventListener("scroll", scrolled);
      removeEventListener("resize", resize);
      motion.disconnect();
      root.style.removeProperty("--hero-glow");
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      view.remove();
    };
  }, [from]);

  return <span ref={anchor} hidden />;
}
