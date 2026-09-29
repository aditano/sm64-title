import * as THREE from "three";
import { MARIO_JOINTS } from "./face-deform.mjs";
import { box, mergeParts, place, sph, type EyeSpec } from "./geom";
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
  emissive?: string;
  emissiveIntensity?: number;
};

export type BuiltHead = {
  parts: HeadPart[];
  eyes: EyeSpec[];
  joints: PinchJoint[];
};

export const SKIN = "#FFD2A4";
const HAT = "#FF1010";
const STASH = "#14110E";
const BROW = "#120E0C";
const LIP = "#E81818";
const MOUTH_HOLE = "#3A0C0C";
const TOOTH = "#F7F4EE";

function part(
  geo: THREE.BufferGeometry,
  color: string,
  map?: THREE.Texture,
  unlit?: boolean,
  emissive?: string,
  emissiveIntensity?: number,
): HeadPart {
  geo.computeVertexNormals();
  return { geometry: geo, color, map, unlit, emissive, emissiveIntensity };
}

function joint(id: PinchId) {
  const found = MARIO_JOINTS.find((j) => j.id === id);
  if (!found) throw new Error(id);
  return found.position;
}

/** Round Mario cranium: wide cheeks, blended nose root, eye sockets, short chin. */
function sculptCranium() {
  const geo = new THREE.SphereGeometry(0.78, 36, 28);
  const pos = geo.getAttribute("position") as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const len = v.length() || 1;
    let x = v.x / len;
    let y = v.y / len;
    let z = v.z / len;

    let radius = 0.8;
    if (y < -0.15) {
      const t = Math.min(1, (-y - 0.15) / 0.85);
      radius *= 1 - t * 0.06;
    }
    x *= radius * 1.18;
    y *= radius * 1.06;
    z *= radius * 0.94;

    const cheek = Math.exp(-((Math.abs(x) - 0.46) ** 2) / 0.06) * Math.exp(-((y + 0.02) ** 2) / 0.09);
    if (z > 0) z += cheek * 0.1;

    const nose = Math.exp(-(x * x) / 0.08) * Math.exp(-((y + 0.12) ** 2) / 0.08);
    if (z > 0) z += nose * 0.06;

    for (const sx of [-0.52, 0.52]) {
      const sock = Math.exp(-((x - sx) ** 2) / 0.035) * Math.exp(-((y - 0.08) ** 2) / 0.028);
      if (z > 0.15) z -= sock * 0.035;
    }

    if (y > 0.38) {
      const f = Math.min(1, (y - 0.38) / 0.45);
      y -= f * 0.05;
    }

    pos.setXYZ(i, x, y, z);
  }
  geo.computeVertexNormals();
  return geo;
}

/** Cap crown stops above the eyes. The visor is only on the front. */
function sculptCrown() {
  const geo = new THREE.SphereGeometry(0.9, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
  geo.scale(1.16, 0.9, 1.06);
  geo.translate(0, 0.4, -0.04);
  geo.computeVertexNormals();
  return geo;
}

/** Front-only visor. +X rotation swings the ellipse out toward the camera. */
function capBrim() {
  const shape = new THREE.Shape();
  shape.moveTo(-0.78, 0);
  shape.quadraticCurveTo(0, 0.4, 0.78, 0);
  shape.quadraticCurveTo(0, 0.05, -0.78, 0);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.14,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelSegments: 1,
    curveSegments: 12,
  });
  geo.rotateX(1.05);
  geo.translate(0, 0.36, 0.52);
  geo.computeVertexNormals();
  return geo;
}

function brow(side: 1 | -1) {
  const s = side;
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(s * 0.24, 0.14, 0.94),
    new THREE.Vector3(s * 0.44, 0.26, 0.92),
    new THREE.Vector3(s * 0.66, 0.12, 0.76),
  ]);
  return new THREE.TubeGeometry(curve, 12, 0.062, 7, false);
}

/** Brown hair in front of the ear. The outer ear stays skin; this runs from the brim down the cheek. */
function sideburn(side: 1 | -1) {
  const s = side;
  return mergeParts([
    place(sph(0.1, 10, 8), s * 0.8, 0.28, 0.72, 0.9, 1.35, 0.55),
    place(sph(0.1, 10, 8), s * 0.84, -0.02, 0.66, 0.62, 2.15, 0.5),
  ]);
}

function mustache() {
  const r = 0.13;
  const lobes: [number, number, number, number, number, number][] = [
    [-0.62, -0.46, 0.4, 1.1, 0.9, 0.65],
    [-0.42, -0.56, 0.56, 1.4, 1, 0.8],
    [-0.18, -0.52, 0.68, 0.95, 0.78, 0.65],
    [0, -0.62, 0.6, 0.7, 0.55, 0.5],
    [0.18, -0.52, 0.68, 0.95, 0.78, 0.65],
    [0.42, -0.56, 0.56, 1.4, 1, 0.8],
    [0.62, -0.46, 0.4, 1.1, 0.9, 0.65],
  ];
  return mergeParts(lobes.map(([x, y, z, sx, sy, sz]) => place(sph(r, 12, 10), x, y, z, sx, sy, sz)));
}

function makeEmblemMap() {
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 128;
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("2d");
  ctx.clearRect(0, 0, 128, 128);
  ctx.fillStyle = "#F4F4F4";
  ctx.beginPath();
  ctx.arc(64, 64, 58, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#C01010";
  ctx.lineWidth = 7;
  ctx.stroke();
  ctx.fillStyle = "#E10600";
  ctx.beginPath();
  ctx.moveTo(24, 98);
  ctx.lineTo(24, 30);
  ctx.lineTo(44, 30);
  ctx.lineTo(64, 60);
  ctx.lineTo(84, 30);
  ctx.lineTo(104, 30);
  ctx.lineTo(104, 98);
  ctx.lineTo(84, 98);
  ctx.lineTo(84, 54);
  ctx.lineTo(64, 82);
  ctx.lineTo(44, 54);
  ctx.lineTo(44, 98);
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

function skin(geo: THREE.BufferGeometry) {
  return part(geo, SKIN, undefined, false, "#F0A86A", 0.42);
}

export function buildMario(): BuiltHead {
  const parts: HeadPart[] = [];
  const nose = joint("nose");
  const earL = joint("earL");
  const earR = joint("earR");

  parts.push(skin(sculptCranium()));

  // Tip of the bulb sits on the nose joint so a pull elongates the nose.
  parts.push(skin(place(sph(0.28, 22, 16), nose[0], nose[1] - 0.02, nose[2] - 0.3, 1.38, 0.92, 1.2)));

  parts.push(skin(place(sph(0.28, 14, 12), earL[0] + 0.02, earL[1], earL[2], 0.42, 1.18, 0.5)));
  parts.push(skin(place(sph(0.28, 14, 12), earR[0] - 0.02, earR[1], earR[2], 0.42, 1.18, 0.5)));
  parts.push(part(place(sph(0.12, 8, 6), earL[0] - 0.02, earL[1], earL[2] + 0.05, 0.32, 0.72, 0.26), "#E8A06A", undefined, true));
  parts.push(part(place(sph(0.12, 8, 6), earR[0] + 0.02, earR[1], earR[2] + 0.05, 0.32, 0.72, 0.26), "#E8A06A", undefined, true));

  parts.push(part(sideburn(-1), "#8A4A22", undefined, true));
  parts.push(part(sideburn(1), "#8A4A22", undefined, true));

  parts.push(part(brow(-1), BROW, undefined, true));
  parts.push(part(brow(1), BROW, undefined, true));

  parts.push(part(mustache(), STASH, undefined, true));

  parts.push(part(place(sph(0.14, 14, 10), 0, -0.7, 0.58, 1.7, 0.42, 0.42), LIP, undefined, true));
  parts.push(part(place(sph(0.06, 8, 6), 0, -0.68, 0.66, 1.15, 0.34, 0.28), MOUTH_HOLE, undefined, true));
  parts.push(part(place(box(0.07, 0.028, 0.02), 0, -0.655, 0.72), TOOTH, undefined, true));

  parts.push(part(sculptCrown(), HAT));
  parts.push(part(capBrim(), HAT));
  parts.push(part(place(sph(0.24, 12, 10), -0.8, 0.14, 0.08, 0.4, 0.72, 0.78), HAT));
  parts.push(part(place(sph(0.24, 12, 10), 0.8, 0.14, 0.08, 0.4, 0.72, 0.78), HAT));

  const emblem = new THREE.CircleGeometry(0.2, 28);
  emblem.rotateX(-0.42);
  parts.push(part(place(emblem, 0, 0.7, 1.02), "#ffffff", makeEmblemMap(), true));

  return {
    parts,
    eyes: [
      { position: [-0.52, 0.08, 0.84], scale: [0.22, 0.28, 0.15], iris: "#1868F5" },
      { position: [0.52, 0.08, 0.84], scale: [0.22, 0.28, 0.15], iris: "#1868F5" },
    ],
    joints: MARIO_JOINTS.map((j) => ({
      id: j.id,
      position: [j.position[0], j.position[1], j.position[2]],
      radius: j.radius,
    })),
  };
}
