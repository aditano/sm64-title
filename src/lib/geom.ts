import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

export type EyeSpec = {
  position: [number, number, number];
  scale: [number, number, number];
  iris: string;
  pupil?: number;
};

export function tint(geo: THREE.BufferGeometry, hex: string, jitter = 0.03) {
  const c = new THREE.Color(hex);
  const pos = geo.getAttribute("position");
  const cols = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i++) {
    const n = Math.sin(i * 12.9898) * 43758.5453;
    const t = 1 - jitter * 0.5 + (n - Math.floor(n)) * jitter;
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

export const sph = (r: number, w = 16, h = 12) => new THREE.SphereGeometry(r, w, h);
export const box = (w: number, h: number, d: number) => new THREE.BoxGeometry(w, h, d);
export const cone = (r: number, h: number, s = 8) => new THREE.ConeGeometry(r, h, s);
export const cyl = (rt: number, rb: number, h: number, s = 10) =>
  new THREE.CylinderGeometry(rt, rb, h, s);
export const torus = (r: number, t: number, rs = 6, ts = 16) =>
  new THREE.TorusGeometry(r, t, rs, ts);
export const disc = (r: number, s = 12) => new THREE.CircleGeometry(r, s);

export function mergeParts(parts: THREE.BufferGeometry[]) {
  const merged = mergeGeometries(parts, false);
  if (!merged) throw new Error("Failed to merge head geometry");
  for (const p of parts) p.dispose();
  merged.computeVertexNormals();
  return merged;
}
