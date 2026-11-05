// Offline preparation only. Runtime ships the compact GLB, not the source OBJ.
import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import * as THREE from "three";
import { LoopSubdivision } from "three-subdivide";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js";
import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js";

// GLTFExporter uses the browser FileReader interface to serialize its Blob.
// Node has Blob.arrayBuffer(), so this bridge is limited to the exporter calls.
globalThis.FileReader = class {
  async readAsArrayBuffer(blob) {
    this.result = await blob.arrayBuffer();
    this.onloadend?.();
  }
  async readAsDataURL(blob) {
    this.result = `data:${blob.type};base64,${Buffer.from(await blob.arrayBuffer()).toString("base64")}`;
    this.onloadend?.();
  }
};
const source = process.argv[2];
if (!source) throw new Error("Pass the licensed canonical_face_model.obj path.");
const text = await readFile(source, "utf8");
const object = new OBJLoader().parse(text);
const sourceMesh = object.children.find(child => child.isMesh);
if (!sourceMesh) throw new Error("Source does not contain a mesh.");
sourceMesh.geometry.deleteAttribute("normal");
sourceMesh.geometry.deleteAttribute("uv");
let geometry = mergeVertices(sourceMesh.geometry);
geometry.computeBoundingBox();
const center = geometry.boundingBox.getCenter(new THREE.Vector3());
const size = geometry.boundingBox.getSize(new THREE.Vector3());
const scale = 2.8 / size.y;
geometry.translate(-center.x, -center.y, -center.z);
geometry.scale(scale, scale, scale);
geometry.computeVertexNormals();
geometry = mergeVertices(LoopSubdivision.modify(geometry, 2, { split: false, preserveEdges: true, maxTriangles: 16000 }));
geometry.computeVertexNormals();
const material = new THREE.MeshStandardMaterial({ color: 0xc58a6c, metalness: .35, roughness: .48, side: THREE.DoubleSide });
const mesh = new THREE.Mesh(geometry, material);
mesh.name = "Canonical facial surface";
const point = values => values.map((v, i) => (v - center.getComponent(i)) * scale);
mesh.userData.regions = {
  cheek: point([4.765501, -.701554, 3.534632]),
  lips: point([0, -3.406404, 5.979507]),
  contour: point([0, -9.403378, 4.264492]),
};
const binary = await new GLTFExporter().parseAsync(mesh, { binary: true });
const output = "public/models/aura-face/face.glb";
await writeFile(output, Buffer.from(binary));
await writeFile("public/models/aura-face/provenance.json", JSON.stringify({
  source: "google-ai-edge/mediapipe", revision: "03322747e96377e6ee40b51f038b4c108add7774",
  sourceSha256: createHash("sha256").update(text).digest("hex"), license: "Apache-2.0",
  outputBytes: binary.byteLength, vertices: geometry.getAttribute("position").count,
  triangles: geometry.index.count / 3, regions: mesh.userData.regions,
  modifications: ["Merged positions", "Recomputed smooth normals", "Centered and scaled to height 2.8", "Two offline Loop subdivision passes", "Exported GLB"],
}, null, 2) + "\n");
console.log(output, binary.byteLength, "bytes");
