"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import type { Material, Mesh } from "three";
import styles from "@/app/propostas/aura/aura.module.css";

type FaceProgressEvent = CustomEvent<{ progress: number }>;

export function AuraFaceScene() {
  const hostRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const host = hostRef.current;
    const frame = host?.parentElement;
    const root = host?.closest<HTMLElement>("[data-motion]");
    if (!host || !frame || !root) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let generation = 0;
    let loading = false;
    let release: (() => void) | undefined;
    let stopped = false;
    const disposeObject = (object: import("three").Object3D) => object.traverse(child => {
      const mesh = child as Mesh;
      mesh.geometry?.dispose();
      const materials: Material[] = Array.isArray(mesh.material) ? mesh.material : mesh.material ? [mesh.material] : [];
      materials.forEach(material => material.dispose());
    });
    function reset() {
      generation++;
      loading = false;
      release?.();
      release = undefined;
      delete frame!.dataset.faceReady;
    }
    async function start() {
      if (loading || release || stopped || !visible || preference.matches || root!.dataset.motion === "off") return;
      loading = true;
      const token = ++generation;
      let model: import("three").Group | undefined;
      try {
        const [THREE, { GLTFLoader }] = await Promise.all([import("three"), import("three/addons/loaders/GLTFLoader.js")]);
        const gltf = await new GLTFLoader().loadAsync("/models/aura-face/face.glb");
        model = gltf.scene;
        if (stopped || generation !== token) { disposeObject(model); return; }
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
        renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(35, 1, .1, 40);
        scene.add(model);
        scene.add(new THREE.HemisphereLight(0xffeddb, 0x38231e, 1.2));
        const key = new THREE.DirectionalLight(0xffe8d3, 2.5); key.position.set(-3, 4, 5); scene.add(key);
        const fill = new THREE.DirectionalLight(0xffffff, 1.2); fill.position.set(4, 1, 3); scene.add(fill);
        const rim = new THREE.DirectionalLight(0xff714a, 3.5); rim.position.set(2, 2, -3); scene.add(rim);
        const halo = new THREE.Mesh(new THREE.TorusGeometry(1.65, .008, 6, 100), new THREE.MeshBasicMaterial({ color: 0xb37556, transparent: true, opacity: .35 }));
        halo.position.z = -.9; halo.rotation.y = .35; scene.add(halo);
        const marker = new THREE.Mesh(new THREE.TorusGeometry(.12, .008, 6, 40), new THREE.MeshBasicMaterial({ color: 0xffeedb }));
        scene.add(marker);
        host!.appendChild(renderer.domElement);
        renderer.domElement.setAttribute("aria-hidden", "true");
        const states = [
          { t: 0, position: [0, .1, 5.8], target: [0, 0, 0], offset: -.12, marker: [0, 0, .5], show: false },
          { t: .25, position: [2.3, .35, 3.7], target: [.5, -.02, .15], offset: -.21, marker: [.755, -.021, .152], show: true },
          { t: .43, position: [2.3, .35, 3.7], target: [.5, -.02, .15], offset: -.21, marker: [.755, -.021, .152], show: true },
          { t: .54, position: [-.35, -.45, 3.05], target: [0, -.45, .54], offset: .23, marker: [0, -.449, .54], show: true },
          { t: .71, position: [-.35, -.45, 3.05], target: [0, -.45, .54], offset: .23, marker: [0, -.449, .54], show: true },
          { t: .82, position: [-2.1, -.65, 3.55], target: [0, -.9, .27], offset: -.21, marker: [0, -1.4, .268], show: true },
          { t: 1, position: [-2.1, -.65, 3.55], target: [0, -.9, .27], offset: -.21, marker: [0, -1.4, .268], show: true },
        ];
        let width = 1, height = 1, raf = 0;
        let progress = Number(root!.dataset.faceProgress || 0);
        let lost = false;
        const draw = () => {
          raf = 0;
          if (lost || !visible) return;
          const p = innerWidth < 900 || innerHeight < 700 ? 0 : Math.max(0, Math.min(1, progress));
          const end = states.findIndex(state => state.t >= p);
          const to = states[Math.max(0, end)], from = states[Math.max(0, end - 1)];
          const raw = to.t === from.t ? 0 : (p - from.t) / (to.t - from.t);
          const t = raw * raw * (3 - 2 * raw);
          const mix = (a: number[], b: number[]) => new THREE.Vector3().fromArray(a).lerp(new THREE.Vector3().fromArray(b), t);
          camera.position.copy(mix(from.position, to.position));
          camera.lookAt(mix(from.target, to.target));
          camera.aspect = width / height;
          camera.setViewOffset(width, height, THREE.MathUtils.lerp(from.offset, to.offset, t) * width, 0, width, height);
          camera.updateProjectionMatrix();
          marker.position.copy(mix(from.marker, to.marker)); marker.visible = to.show;
          marker.quaternion.copy(camera.quaternion);
          renderer.render(scene, camera);
        };
        const schedule = () => { if (!raf && visible && !lost) raf = requestAnimationFrame(draw); };
        const onProgress = (event: Event) => { progress = (event as FaceProgressEvent).detail.progress; schedule(); };
        const resize = new ResizeObserver(() => {
          width = Math.max(1, host!.clientWidth); height = Math.max(1, host!.clientHeight);
          renderer.setSize(width, height, false); schedule();
        });
        const onContextLoss = (event: Event) => { event.preventDefault(); lost = true; delete frame!.dataset.faceReady; };
        const onVisibility = () => schedule();
        root!.addEventListener("aura-face-progress", onProgress);
        host!.addEventListener("aura-face-visible", onVisibility);
        renderer.domElement.addEventListener("webglcontextlost", onContextLoss);
        resize.observe(host!);
        delete frame!.dataset.faceFallback;
        frame!.dataset.faceReady = "true";
        release = () => {
          cancelAnimationFrame(raf); resize.disconnect();
          root!.removeEventListener("aura-face-progress", onProgress);
          host!.removeEventListener("aura-face-visible", onVisibility);
          renderer.domElement.removeEventListener("webglcontextlost", onContextLoss);
          disposeObject(scene); renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove();
        };
        schedule();
      } catch {
        if (generation === token) { delete frame!.dataset.faceReady; frame!.dataset.faceFallback = "true"; }
        if (model) disposeObject(model);
      } finally { if (generation === token) loading = false; }
    }
    function sync() {
      if (preference.matches || root!.dataset.motion === "off") reset();
      else void start();
    }
    const intersection = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      if (visible) { void start(); host!.dispatchEvent(new Event("aura-face-visible")); }
    }, { rootMargin: "200px" });
    intersection.observe(frame);
    const changes = new MutationObserver(sync); changes.observe(root, { attributes: true, attributeFilter: ["data-motion"] });
    preference.addEventListener("change", sync);
    return () => { stopped = true; reset(); intersection.disconnect(); changes.disconnect(); preference.removeEventListener("change", sync); };
  }, []);
  return <>
    <Image src="/images/aura-editorial/portrait.webp" alt="Retrato editorial de referência para a leitura das regiões faciais" width={1536} height={1024} sizes="(max-width: 899px) 130vw, 100vw"/>
    <div ref={hostRef} className={styles.faceScene} data-face-scene aria-hidden="true"/>
  </>;
}
