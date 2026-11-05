"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Mesh, SkinnedMesh, Material } from "three";
import styles from "@/app/propostas/aura/personagem/character.module.css";

type Driver = { setAmount: (value: number) => void; setPaused: (value: boolean) => void; followScroll: () => void };
export function AuraCharacterStudy() {
  const track = useRef<HTMLElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const driver = useRef<Driver>(null);
  const [paused, setPaused] = useState(false);
  const [amount, setAmount] = useState(0);
  const [manual, setManual] = useState(false);
  const [status, setStatus] = useState<"loading" | "ready" | "fallback">("loading");
  useEffect(() => {
    const container = host.current, section = track.current;
    if (!container || !section) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let dead = false, dispose: (() => void) | undefined;
    const destroy = (object: import("three").Object3D) => object.traverse(child => {
      const mesh = child as Mesh;
      mesh.geometry?.dispose();
      const materials: Material[] = Array.isArray(mesh.material) ? mesh.material : mesh.material ? [mesh.material] : [];
      materials.forEach(material => {
        Object.values(material).forEach(value => { if (value?.isTexture) value.dispose(); });
        material.dispose();
      });
    });
    void (async () => {
      let renderer: import("three").WebGLRenderer | undefined;
      let scene: import("three").Scene | undefined;
      let environment: import("three").WebGLRenderTarget | undefined;
      try {
        const [T, { GLTFLoader }, { RoomEnvironment }] = await Promise.all([import("three"), import("three/addons/loaders/GLTFLoader.js"), import("three/addons/environments/RoomEnvironment.js")]);
        const gltf = await new GLTFLoader().loadAsync("/models/aura-character/character.glb");
        if (dead) { destroy(gltf.scene); return; }
        scene = new T.Scene();
        renderer = new T.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
        const context = renderer.getContext();
        const debug = context.getExtension("WEBGL_debug_renderer_info");
        const software = debug ? /swiftshader|llvmpipe|softpipe/i.test(String(context.getParameter(debug.UNMASKED_RENDERER_WEBGL))) : false;
        // Software WebGL gets a smaller buffer so idle movement cannot monopolize the UI.
        renderer.setPixelRatio(software ? .5 : Math.min(devicePixelRatio, 1.5));
        container.dataset.renderMode = software ? "software" : "standard";
        const frameInterval = 1000 / (software ? 5 : 15);
        renderer.toneMapping = T.ACESFilmicToneMapping;
        renderer.toneMappingExposure = .85;
        renderer.outputColorSpace = T.SRGBColorSpace;
        const pmrem = new T.PMREMGenerator(renderer), room = new RoomEnvironment();
        environment = pmrem.fromScene(room, .04); scene.environment = environment.texture;
        room.dispose(); pmrem.dispose();
        scene.environmentIntensity = .45;
        const group = new T.Group(); group.add(gltf.scene); scene.add(group);
        const camera = new T.PerspectiveCamera(30, 1, .01, 10);
        scene.add(new T.HemisphereLight(0xfff1e2, 0x3b2821, .6));
        const key = new T.DirectionalLight(0xfff4e9, 1.8); key.position.set(-1, 2, 2); scene.add(key);
        const fill = new T.DirectionalLight(0xffdcc5, .8); fill.position.set(1, 1, 1); scene.add(fill);
        const rim = new T.DirectionalLight(0xff704d, 3); rim.position.set(1, 1, -1); scene.add(rim);
        const faceMeshes: SkinnedMesh[] = [];
        gltf.scene.traverse(child => { if ((child as Mesh).morphTargetDictionary) faceMeshes.push(child as SkinnedMesh); });
        const head = gltf.scene.getObjectByName("Head");
        const rest = head?.quaternion.clone();
        let width = 1, height = 1, progress = 0, morph = 0, manual = false;
        let pausedLocal = false, visible = true, lost = false, raf = 0, last = -100, clock = 0, previous = 0;
        const smooth = (v: number) => { v = T.MathUtils.clamp(v, 0, 1); return v * v * (3 - 2 * v); };
        const applyMorph = (name: string, value: number) => faceMeshes.forEach(mesh => {
          const index = mesh.morphTargetDictionary?.[name];
          if (index !== undefined && mesh.morphTargetInfluences) mesh.morphTargetInfluences[index] = value;
        });
        const target = new T.Vector3(), idleTurn = new T.Quaternion(), axis = new T.Vector3(0, 1, 0);
        const render = (time: number) => {
          raf = 0;
          if (dead || lost || !visible || document.hidden) { previous = 0; return; }
          const automatic = !pausedLocal && !preference.matches;
          if (time - last < frameInterval) { if (automatic) raf = requestAnimationFrame(render); return; }
          if (automatic && previous) clock += Math.min((time - previous) / 1000, .1);
          previous = time; last = time;
          const focus = manual ? 1 : smooth((progress - .12) / .35) * (1 - smooth((progress - .8) / .2));
          // Local design change, held at the final value as the camera pulls back.
          const value = manual ? morph : smooth((progress - .43) / .32);
          applyMorph("auraMalarProjection", value);
          if (!manual && container.dataset.morph !== value.toFixed(3)) setAmount(Math.round(value * 100));
          const blinkPhase = clock % 5.1;
          const blink = automatic && blinkPhase > 4.8 ? Math.sin((blinkPhase - 4.8) / .3 * Math.PI) : 0;
          applyMorph("eyeBlinkLeft", blink); applyMorph("eyeBlinkRight", blink);
          if (head && rest) { idleTurn.setFromAxisAngle(axis, automatic ? Math.sin(clock * .6) * .013 : 0); head.quaternion.copy(rest).multiply(idleTurn); }
          group.position.y = automatic ? Math.sin(clock * 1.5) * .0007 : 0;
          const small = width < 800;
          camera.position.set(T.MathUtils.lerp(.025, .24, focus), T.MathUtils.lerp(1.65, 1.63, focus), T.MathUtils.lerp(small ? .85 : .82, .64, focus));
          target.set(T.MathUtils.lerp(0, .025, focus), T.MathUtils.lerp(1.63, 1.62, focus), .09);
          camera.lookAt(target); camera.aspect = width / height;
          camera.setViewOffset(width, height, (small ? 0 : -.16) * width, 0, width, height);
          camera.updateProjectionMatrix();
          renderer!.render(scene!, camera);
          last = performance.now();
          if (container.dataset.morph !== value.toFixed(3)) container.dataset.morph = value.toFixed(3);
          container.dataset.view = focus > .8 ? "malar" : "portrait";
          if (automatic) raf = requestAnimationFrame(render);
        };
        const schedule = () => { if (!raf && !lost && visible && !document.hidden) { last = -100; raf = requestAnimationFrame(render); } };
        const onScroll = () => {
          if (manual || pausedLocal || preference.matches || innerWidth < 800) return;
          const travel = section.offsetHeight - innerHeight;
          progress = T.MathUtils.clamp(-section.getBoundingClientRect().top / Math.max(1, travel), 0, 1);
          container.dataset.chapter = progress < .32 ? "overview" : progress < .8 ? "malar" : "final";
          schedule();
        };
        driver.current = {
          setAmount(value) { manual = true; morph = value; schedule(); },
          followScroll() { manual = false; onScroll(); schedule(); },
          setPaused(value) { pausedLocal = value; previous = 0; if (value) { cancelAnimationFrame(raf); raf = 0; } schedule(); },
        };
        const onPreference = () => { previous = 0; cancelAnimationFrame(raf); raf = 0; schedule(); };
        const observer = new ResizeObserver(() => { width = Math.max(1, container.clientWidth); height = Math.max(1, container.clientHeight); renderer!.setSize(width, height, false); onScroll(); schedule(); });
        const intersection = new IntersectionObserver(entries => { visible = entries.some(entry => entry.isIntersecting); if (!visible) { cancelAnimationFrame(raf); raf = 0; previous = 0; } else schedule(); });
        const onVisibility = () => { previous = 0; if (document.hidden) { cancelAnimationFrame(raf); raf = 0; } else schedule(); };
        const onLost = (event: Event) => { event.preventDefault(); lost = true; cancelAnimationFrame(raf); setStatus("fallback"); };
        container.appendChild(renderer.domElement); renderer.domElement.setAttribute("aria-hidden", "true");
        renderer.domElement.addEventListener("webglcontextlost", onLost);
        window.addEventListener("scroll", onScroll, { passive: true });
        document.addEventListener("visibilitychange", onVisibility); preference.addEventListener("change", onPreference);
        observer.observe(container); intersection.observe(section); onScroll();
        dispose = () => {
          cancelAnimationFrame(raf); observer.disconnect(); intersection.disconnect();
          window.removeEventListener("scroll", onScroll); document.removeEventListener("visibilitychange", onVisibility); preference.removeEventListener("change", onPreference);
          renderer!.domElement.removeEventListener("webglcontextlost", onLost); renderer!.domElement.remove();
          destroy(scene!); environment!.dispose(); renderer!.dispose(); renderer!.forceContextLoss();
        };
        setStatus("ready"); schedule();
      } catch {
        if (scene) destroy(scene); environment?.dispose(); renderer?.dispose(); renderer?.domElement.remove();
        if (!dead) setStatus("fallback");
      }
    })();
    return () => { dead = true; driver.current = null; dispose?.(); };
  }, []);
  return <>
    <section ref={track} className={styles.track} data-character-track>
      <div className={styles.stage}>
        <div className={styles.visual} data-ready={status === "ready"}>
          <Image src="/models/aura-character/poster.webp" alt="Personagem digital feminina, com cabelo preso, apresentada em três quartos" fill sizes="100vw" priority className={styles.poster}/>
          <div ref={host} className={styles.scene} data-character-scene aria-hidden="true"/>
        </div>
        <div className={styles.copy}>
          <p className={styles.disclosure}>Simulação ilustrativa</p>
          <h1>Um detalhe.<br/>Outra leitura.</h1>
          <p>Uma aproximação do zigomático e de sua relação com a projeção do rosto.</p>
          <p className={styles.instruction}>Role para acompanhar. Ou compare pelo controle abaixo.</p>
          <div className={styles.controls}>
            <label htmlFor="aura-malar">Projeção malar</label>
            <input id="aura-malar" type="range" min="0" max="100" value={amount} disabled={status !== "ready"} onChange={event => { const value = Number(event.target.value); setAmount(value); setManual(true); driver.current?.setAmount(value / 100); }}/>
            {manual && <button type="button" onClick={() => { setManual(false); driver.current?.followScroll(); }}>Acompanhar pelo scroll</button>}
            <div className={styles.ends}><span>Forma inicial</span><span>Variação de design</span></div>
            <button type="button" disabled={status !== "ready"} aria-pressed={paused} onClick={() => { setPaused(!paused); driver.current?.setPaused(!paused); }}>{paused ? "Retomar movimento" : "Pausar movimento"}</button>
          </div>
          <p className={styles.status} role="status">{status === "loading" ? "Retrato estático. A interação requer JavaScript e suporte 3D." : status === "fallback" ? "Visualização estática. A cena interativa não está disponível neste navegador." : "Personagem interativa disponível."}</p>
        </div>
        <div className={styles.foot}><span>O rosto continua sendo o mesmo.</span><a href="#sobre-a-cena">Sobre esta cena ↓</a></div>
      </div>
    </section>
    <section className={styles.about} id="sobre-a-cena">
      <h2>Projeção, sem perder a identidade.</h2>
      <p>A região malar participa da leitura do terço médio do rosto. Nesta cena, uma alteração digital localizada permite observar essa relação em movimento.</p>
      <p>Esta personagem e sua transformação são ilustrações digitais. Não representam paciente, procedimento realizado ou previsão de resultado. Indicações e limites dependem de avaliação profissional individual.</p>
    </section>
  </>;
}
