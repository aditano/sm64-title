import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

export type EyeSpec = {
  position: [number, number, number];
  scale: [number, number, number];
  iris: string;
  pupil?: number;
};

export function tint(geo: THREE.BufferGeometry, hex: string, jitter = 0.02) {
  const c = new THREE.Color(hex);
  const pos = geo.getAttribute("position");
  const cols = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i++) {
    const t = 1 - jitter * 0.45 + Math.random() * jitter;
    cols[i * 3] = Math.min(1, c.r * t);
    cols[i * 3 + 1] = Math.min(1, c.g * t);
    cols[i * 3 + 2] = Math.min(1, c.b * t);
  }
  geo.deleteAttribute("uv");
  geo.setAttribute("color", new THREE.Float32BufferAttribute(cols, 3));
  return geo;
}

export function place(
  geo: THREE.BufferGeometry,
  x: number,
  y: number,
  z: number,
  sx = 1,
  sy = 1,
  sz = 1,
  rx = 0,
  ry = 0,
  rz = 0,
) {
  if (sx !== 1 || sy !== 1 || sz !== 1) geo.scale(sx, sy, sz);
  if (rx) geo.rotateX(rx);
  if (ry) geo.rotateY(ry);
  if (rz) geo.rotateZ(rz);
  if (x || y || z) geo.translate(x, y, z);
  return geo;
}

export const sph = (r: number, w = 12, h = 10) => new THREE.SphereGeometry(r, w, h);
export const box = (w: number, h: number, d: number) => new THREE.BoxGeometry(w, h, d);
export const cone = (r: number, h: number, s = 8) => new THREE.ConeGeometry(r, h, s);
export const cyl = (rt: number, rb: number, h: number, s = 10) =>
  new THREE.CylinderGeometry(rt, rb, h, s);
export const torus = (r: number, t: number, rs = 6, ts = 12) =>
  new THREE.TorusGeometry(r, t, rs, ts);
export const disc = (r: number, s = 10) => new THREE.CircleGeometry(r, s);

export function mergeParts(parts: THREE.BufferGeometry[]) {
  const merged = mergeGeometries(parts, false);
  if (!merged) throw new Error("Failed to merge head geometry");
  for (const p of parts) p.dispose();
  merged.computeVertexNormals();
  return merged;
}

export function plumber(
  skin: string,
  hat: string,
  emblem = "#F4F4F4",
  stash = "#4A2810",
  opts?: { tall?: boolean; bigNose?: boolean; zigzag?: boolean },
) {
  const parts: THREE.BufferGeometry[] = [];
  const tall = opts?.tall ? 1.12 : 1;
  const noseR = opts?.bigNose ? 0.34 : 0.28;
  const noseZ = opts?.bigNose ? 0.72 : 0.7;

  parts.push(tint(place(sph(0.74, 16, 12), 0, 0.02, 0, 1.08, tall * 0.98, 0.94), skin));
  parts.push(tint(place(sph(0.17, 8, 6), -0.72, 0.04, 0.06, 0.5, 1.05, 0.95), skin));
  parts.push(tint(place(sph(0.17, 8, 6), 0.72, 0.04, 0.06, 0.5, 1.05, 0.95), skin));
  parts.push(tint(place(sph(noseR + 0.04, 10, 8), 0, -0.08, noseZ + 0.04), skin));
  parts.push(tint(place(sph(0.3, 8, 6), 0, -0.46 * tall, 0.26, 1.18, 0.66, 0.78), skin));

  if (opts?.zigzag) {
    for (const x of [-0.34, -0.12, 0.12, 0.34]) {
      parts.push(tint(place(sph(0.13, 8, 6), x, -0.16, 0.58, 1.1, 0.55, 0.72), stash));
    }
  } else {
    parts.push(tint(place(sph(0.22, 10, 8), -0.22, -0.2, 0.6, 1.45, 0.48, 0.72), stash));
    parts.push(tint(place(sph(0.22, 10, 8), 0.22, -0.2, 0.6, 1.45, 0.48, 0.72), stash));
  }

  parts.push(tint(place(sph(0.16, 8, 6), -0.52, -0.04, 0.28, 0.55, 1.15, 0.7), stash));
  parts.push(tint(place(sph(0.16, 8, 6), 0.52, -0.04, 0.28, 0.55, 1.15, 0.7), stash));

  const hatHemi = new THREE.SphereGeometry(0.8, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.5);
  parts.push(tint(place(hatHemi, 0, 0.38 * tall, -0.08, 1.12, 0.82, 1.06), hat));
  parts.push(tint(place(torus(0.78, 0.08, 6, 14), 0, 0.32 * tall, 0.18, 1.05, 1, 1.15, Math.PI / 2), hat));
  // Emblem sits on the hat dome — pull forward so the cap surface doesn't clip it.
  const emblemZ = 0.82;
  const emblemY = 0.54 * tall;
  parts.push(tint(place(disc(0.2, 10), 0, emblemY, emblemZ), emblem));
  parts.push(tint(place(box(0.045, 0.16, 0.03), -0.055, emblemY + 0.02 * tall, emblemZ + 0.02), emblem));
  parts.push(tint(place(box(0.045, 0.16, 0.03), 0.055, emblemY + 0.02 * tall, emblemZ + 0.02), emblem));
  parts.push(tint(place(box(0.04, 0.1, 0.03), 0, emblemY - 0.03 * tall, emblemZ + 0.02, 1, 1, 1, 0, 0, 0.55), emblem));

  return {
    parts,
    eyes: [
      { position: [-0.24, 0.14 * tall, 0.6] as [number, number, number], scale: [0.17, 0.22, 0.1] as [number, number, number], iris: "#2060C0" },
      { position: [0.24, 0.14 * tall, 0.6] as [number, number, number], scale: [0.17, 0.22, 0.1] as [number, number, number], iris: "#2060C0" },
    ],
  };
}
