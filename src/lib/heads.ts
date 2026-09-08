import * as THREE from "three";
import { cyl, place, sph, type EyeSpec } from "./geom";
import type { PinchId } from "./face-store";

export type PinchJoint = {
  id: PinchId;
  position: [number, number, number];
  radius: number;
};

export type HeadPart = {
  geometry: THREE.BufferGeometry;
  color: string;
  map?: THREE.Texture;
  unlit?: boolean;
};

export type BuiltHead = {
  parts: HeadPart[];
  eyes: EyeSpec[];
  joints: PinchJoint[];
};

export const SKIN = "#E39B6C";
const HAT = "#E52521";
const HAIR = "#3A2218";
const STASH = "#2E1A10";
const MOUTH = "#6A241C";

function part(geo: THREE.BufferGeometry, color: string, map?: THREE.Texture, unlit?: boolean): HeadPart {
  geo.computeVertexNormals();
  return { geometry: geo, color, map, unlit };
}

function pull(v: THREE.Vector3, cx: number, cy: number, cz: number, r: number, amt: number) {
  const dx = v.x - cx;
  const dy = v.y - cy;
  const dz = v.z - cz;
  const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
  if (d >= r || d < 1e-6) return;
  const t = 1 - d / r;
  const w = t * t * (3 - 2 * t);
  const k = (amt * w) / d;
  v.x += dx * k;
  v.y += dy * k;
  v.z += dz * k;
}

function dentZ(v: THREE.Vector3, cx: number, cy: number, cz: number, r: number, amt: number) {
  const dx = v.x - cx;
  const dy = v.y - cy;
  const dz = v.z - cz;
  const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
  if (d >= r) return;
  const t = 1 - d / r;
  const w = t * t * (3 - 2 * t);
  v.z -= amt * w;
}

/** Side-profile lathe, then cheek/chin/socket displacement. */
function sculptCranium() {
  const pts = [
    new THREE.Vector2(0.0, -0.84),
    new THREE.Vector2(0.16, -0.82),
    new THREE.Vector2(0.34, -0.74),
    new THREE.Vector2(0.5, -0.54),
    new THREE.Vector2(0.62, -0.28),
    new THREE.Vector2(0.7, -0.02),
    new THREE.Vector2(0.74, 0.22),
    new THREE.Vector2(0.7, 0.42),
    new THREE.Vector2(0.56, 0.6),
    new THREE.Vector2(0.34, 0.72),
    new THREE.Vector2(0.0, 0.76),
  ];
  const geo = new THREE.LatheGeometry(pts, 48);
  const pos = geo.getAttribute("position") as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    v.x *= 1.22;
    v.z *= 1.08;

    pull(v, 0.5, -0.12, 0.48, 0.42, 0.2);
    pull(v, -0.5, -0.12, 0.48, 0.42, 0.2);
    pull(v, 0, -0.78, 0.34, 0.4, 0.26);
    pull(v, 0, 0.32, 0.5, 0.38, 0.12);
    dentZ(v, -0.26, 0.16, 0.64, 0.22, 0.16);
    dentZ(v, 0.26, 0.16, 0.64, 0.22, 0.16);
    pull(v, -0.82, 0.02, 0.12, 0.2, 0.16);
    pull(v, 0.82, 0.02, 0.12, 0.2, 0.16);
    if (v.y > 0.52) {
      const f = (v.y - 0.52) / 0.32;
      v.y -= f * 0.1;
      v.x *= 1 - f * 0.08;
      v.z *= 1 - f * 0.1;
    }
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  return geo;
}

function sculptHat() {
  const pts = [
    new THREE.Vector2(0.0, 1.08),
    new THREE.Vector2(0.2, 1.06),
    new THREE.Vector2(0.48, 0.98),
    new THREE.Vector2(0.7, 0.82),
    new THREE.Vector2(0.84, 0.62),
    new THREE.Vector2(0.9, 0.46),
    new THREE.Vector2(0.94, 0.38),
    new THREE.Vector2(0.96, 0.34),
    new THREE.Vector2(0.9, 0.33),
    new THREE.Vector2(0.72, 0.36),
  ];
  const geo = new THREE.LatheGeometry(pts, 36);
  geo.scale(1.05, 1, 1.02);
  geo.translate(0, 0.0, -0.04);
  geo.computeVertexNormals();
  return geo;
}

function omegaMustache() {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.5, 0.02, 0.42),
    new THREE.Vector3(-0.46, -0.14, 0.7),
    new THREE.Vector3(-0.28, -0.26, 0.86),
    new THREE.Vector3(-0.1, -0.2, 0.9),
    new THREE.Vector3(0, -0.12, 0.88),
    new THREE.Vector3(0.1, -0.2, 0.9),
    new THREE.Vector3(0.28, -0.26, 0.86),
    new THREE.Vector3(0.46, -0.14, 0.7),
    new THREE.Vector3(0.5, 0.02, 0.42),
  ]);
  return new THREE.TubeGeometry(curve, 40, 0.145, 10, false);
}

function makeEmblemMap() {
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("2d");
  ctx.clearRect(0, 0, 64, 64);
  ctx.fillStyle = "#F7F7F7";
  ctx.beginPath();
  ctx.arc(32, 32, 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#DC1C1C";
  ctx.beginPath();
  ctx.moveTo(12, 50);
  ctx.lineTo(12, 13);
  ctx.lineTo(22, 13);
  ctx.lineTo(32, 32);
  ctx.lineTo(42, 13);
  ctx.lineTo(52, 13);
  ctx.lineTo(52, 50);
  ctx.lineTo(42, 50);
  ctx.lineTo(42, 28);
  ctx.lineTo(32, 44);
  ctx.lineTo(22, 28);
  ctx.lineTo(22, 50);
  ctx.closePath();
  ctx.fill();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.magFilter = THREE.NearestFilter;
  t.minFilter = THREE.NearestFilter;
  t.generateMipmaps = false;
  t.needsUpdate = true;
  return t;
}

export function buildMario(): BuiltHead {
  const parts: HeadPart[] = [];

  parts.push(part(sculptCranium(), SKIN));
  parts.push(part(place(sph(0.22, 14, 10), -0.9, 0.02, 0.16, 0.5, 1.2, 0.78), SKIN));
  parts.push(part(place(sph(0.22, 14, 10), 0.9, 0.02, 0.16, 0.5, 1.2, 0.78), SKIN));

  parts.push(part(place(sph(0.34, 20, 16), 0, -0.08, 0.9, 1.08, 0.92, 1.18), SKIN));
  parts.push(part(place(sph(0.12, 10, 8), 0, 0.04, 0.82, 0.85, 0.45, 0.55), SKIN));

  parts.push(part(place(sph(0.1, 8, 6), 0, -0.5, 0.52, 1.2, 0.28, 0.4), MOUTH));

  parts.push(part(omegaMustache(), STASH));
  parts.push(part(place(sph(0.19, 12, 10), -0.34, -0.22, 0.78, 1.4, 0.52, 0.72), STASH));
  parts.push(part(place(sph(0.19, 12, 10), 0.34, -0.22, 0.78, 1.4, 0.52, 0.72), STASH));

  parts.push(part(place(sph(0.22, 10, 8), -0.62, 0.22, -0.22, 0.7, 0.42, 0.42), HAIR));
  parts.push(part(place(sph(0.22, 10, 8), 0.62, 0.22, -0.22, 0.7, 0.42, 0.42), HAIR));
  parts.push(part(place(sph(0.18, 8, 6), 0, 0.18, -0.62, 1.05, 0.42, 0.36), HAIR));

  parts.push(part(sculptHat(), HAT));
  parts.push(part(place(cyl(0.07, 0.09, 0.07, 10), 0, 1.04, -0.02), HAT));
  const emblem = new THREE.CircleGeometry(0.23, 22);
  emblem.rotateX(-0.38);
  parts.push(part(place(emblem, 0, 0.52, 0.86), "#ffffff", makeEmblemMap(), true));

  return {
    parts,
    eyes: [
      { position: [-0.26, 0.16, 0.68], scale: [0.2, 0.26, 0.13], iris: "#1A54C8" },
      { position: [0.26, 0.16, 0.68], scale: [0.2, 0.26, 0.13], iris: "#1A54C8" },
    ],
    joints: [
      { id: "cap", position: [0, 0.52, 0.86], radius: 0.4 },
      { id: "earL", position: [-0.9, 0.02, 0.16], radius: 0.3 },
      { id: "earR", position: [0.9, 0.02, 0.16], radius: 0.3 },
      { id: "nose", position: [0, -0.08, 0.9], radius: 0.3 },
      { id: "stacheL", position: [-0.34, -0.22, 0.78], radius: 0.26 },
      { id: "stacheR", position: [0.34, -0.22, 0.78], radius: 0.26 },
      { id: "mouth", position: [0, -0.48, 0.58], radius: 0.28 },
    ],
  };
}
