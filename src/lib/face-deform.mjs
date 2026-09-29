/** Goddard-style face skin, spring, pupils, and the open/pinch glove.
 *  Plain data so the title scene and node:test share one implementation.
 */

export const FEATURE_IDS = ["cap", "earL", "earR", "nose", "stacheL", "stacheR", "mouth"];

/** Rest-pose grab points. Radii are the skin influence, not the mesh size. */
export const MARIO_JOINTS = [
  { id: "cap", position: [0, 0.68, 0.96], radius: 0.52 },
  { id: "earL", position: [-1.14, 0.02, 0.04], radius: 0.48 },
  { id: "earR", position: [1.14, 0.02, 0.04], radius: 0.48 },
  { id: "nose", position: [0, -0.14, 1.06], radius: 0.46 },
  { id: "stacheL", position: [-0.42, -0.48, 0.58], radius: 0.38 },
  { id: "stacheR", position: [0.42, -0.48, 0.58], radius: 0.38 },
  { id: "mouth", position: [0, -0.74, 0.5], radius: 0.4 },
];

export function emptyVecs() {
  const out = {};
  for (const id of FEATURE_IDS) out[id] = [0, 0, 0];
  return out;
}

/** Smoothstep falloff. 1 on the joint, 0 at the radius and beyond. */
export function featureWeight(dist, radius) {
  if (!(radius > 0) || dist >= radius) return 0;
  const t = 1 - dist / radius;
  return t * t * (3 - 2 * t);
}

export function headWidth(joints = MARIO_JOINTS) {
  const L = joints.find((j) => j.id === "earL").position;
  const R = joints.find((j) => j.id === "earR").position;
  return Math.hypot(R[0] - L[0], R[1] - L[1], R[2] - L[2]);
}

/** rest/out are tightly packed xyz. offsets[id] is [x, y, z]. */
export function deformInto(rest, out, joints, offsets) {
  const count = rest.length / 3;
  for (let i = 0; i < count; i++) {
    const ix = i * 3;
    const x = rest[ix];
    const y = rest[ix + 1];
    const z = rest[ix + 2];
    let dx = 0;
    let dy = 0;
    let dz = 0;
    for (let j = 0; j < joints.length; j++) {
      const joint = joints[j];
      const o = offsets[joint.id];
      if (!o || (o[0] === 0 && o[1] === 0 && o[2] === 0)) continue;
      const dist = Math.hypot(x - joint.position[0], y - joint.position[1], z - joint.position[2]);
      const w = featureWeight(dist, joint.radius);
      if (w === 0) continue;
      dx += o[0] * w;
      dy += o[1] * w;
      dz += o[2] * w;
    }
    out[ix] = x + dx;
    out[ix + 1] = y + dy;
    out[ix + 2] = z + dz;
  }
  return out;
}

export function deformPositions(rest, joints, offsets) {
  return deformInto(rest, new Float32Array(rest.length), joints, offsets);
}

/** One N64-frame of the grabbable-joint spring.
 *  Hold (R / Shift) freezes every joint. The grabbed joint keeps the pointer offset.
 *  Otherwise velocity is pulled toward rest (the Goddard 0.5 term) and friction keeps
 *  a head-sized pull from ringing all the way back out.
 */
export function springStep(offsets, velocities, { hold = false, grabbingId = null } = {}) {
  const restore = 0.5;
  const friction = 0.55;
  for (const id of FEATURE_IDS) {
    const o = offsets[id];
    const v = velocities[id];
    if (!o || !v) continue;
    if (hold || id === grabbingId) {
      v[0] = 0;
      v[1] = 0;
      v[2] = 0;
      continue;
    }
    v[0] = (v[0] - o[0] * restore) * friction;
    v[1] = (v[1] - o[1] * restore) * friction;
    v[2] = (v[2] - o[2] * restore) * friction;
    const speed = Math.abs(v[0]) + Math.abs(v[1]) + Math.abs(v[2]);
    const dist = Math.abs(o[0]) + Math.abs(o[1]) + Math.abs(o[2]);
    if (speed < 0.02 && dist < 0.08) {
      v[0] = 0;
      v[1] = 0;
      v[2] = 0;
      o[0] = 0;
      o[1] = 0;
      o[2] = 0;
      continue;
    }
    o[0] += v[0];
    o[1] += v[1];
    o[2] += v[2];
  }
  return offsets;
}

/** Iris/pupil shift inside the sclera. Pointer coords are HUD pixels, y down. */
export function pupilOffset(pointerX, pointerY, width = 320, height = 240) {
  const nx = (pointerX / Math.max(width, 1)) * 2 - 1;
  const ny = (pointerY / Math.max(height, 1)) * 2 - 1;
  const maxX = 0.055;
  const maxY = 0.042;
  return [
    Math.max(-maxX, Math.min(maxX, nx * 0.07)),
    Math.max(-maxY, Math.min(maxY, -ny * 0.055)),
  ];
}

export const GLOVE_SIZE = 32;

/** Hotspot is the fingertip (open) or the pinch (closed). Both sit on the glove. */
export function glovePose(grabbing) {
  return grabbing
    ? { kind: "pinch", hot: [8, 11], size: GLOVE_SIZE }
    : { kind: "open", hot: [5, 4], size: GLOVE_SIZE };
}

function stampDisc(mask, cx, cy, rx, ry, value) {
  const S = GLOVE_SIZE;
  const x0 = Math.max(0, Math.floor(cx - rx - 1));
  const x1 = Math.min(S - 1, Math.ceil(cx + rx + 1));
  const y0 = Math.max(0, Math.floor(cy - ry - 1));
  const y1 = Math.min(S - 1, Math.ceil(cy + ry + 1));
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const u = (x + 0.5 - cx) / rx;
      const v = (y + 0.5 - cy) / ry;
      if (u * u + v * v <= 1) mask[y * S + x] = value;
    }
  }
}

function stampCapsule(mask, x0, y0, x1, y1, r, value) {
  const steps = Math.max(2, Math.ceil(Math.hypot(x1 - x0, y1 - y0)));
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    stampDisc(mask, x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, r, r, value);
  }
}

/** 0 empty, 1 palm/fingers, 2 cuff, 3 outline. */
export function gloveMask(grabbing) {
  const S = GLOVE_SIZE;
  const mask = new Uint8Array(S * S);
  if (!grabbing) {
    stampCapsule(mask, 5, 4, 14, 14, 2.35, 1);
    stampCapsule(mask, 9, 7, 17, 16, 2.15, 1);
    stampCapsule(mask, 13, 10, 19, 18, 1.9, 1);
    stampDisc(mask, 7, 16, 3.4, 4.1, 1);
    stampDisc(mask, 16, 19, 7.2, 5.6, 1);
    stampDisc(mask, 18, 26, 6.4, 3.3, 2);
    stampDisc(mask, 16, 24.5, 5.2, 2.1, 2);
  } else {
    stampDisc(mask, 10, 11, 5.2, 4.1, 1);
    stampDisc(mask, 6.5, 13.5, 3.3, 3.1, 1);
    stampDisc(mask, 8, 12, 2.2, 1.6, 1);
    stampDisc(mask, 15, 18, 6.6, 5.2, 1);
    stampDisc(mask, 17, 25, 6.2, 3.2, 2);
    stampDisc(mask, 15, 23.5, 5, 2, 2);
  }
  for (let pass = 0; pass < 2; pass++) {
    const src = Uint8Array.from(mask);
    for (let y = 1; y < S - 1; y++) {
      for (let x = 1; x < S - 1; x++) {
        if (src[y * S + x] !== 0) continue;
        let n = 0;
        if (src[y * S + x - 1] === 1 || src[y * S + x - 1] === 2) n++;
        if (src[y * S + x + 1] === 1 || src[y * S + x + 1] === 2) n++;
        if (src[(y - 1) * S + x] === 1 || src[(y - 1) * S + x] === 2) n++;
        if (src[(y + 1) * S + x] === 1 || src[(y + 1) * S + x] === 2) n++;
        if (n >= 3) mask[y * S + x] = 1;
      }
    }
  }
  const pose = glovePose(grabbing);
  const hot = pose.hot[1] * S + pose.hot[0];
  if (mask[hot] === 0) mask[hot] = 1;

  const filled = Uint8Array.from(mask);
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      if (filled[y * S + x] !== 0) continue;
      let edge = false;
      for (let dy = -1; dy <= 1 && !edge; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= S || ny >= S) continue;
          if (filled[ny * S + nx] !== 0) edge = true;
        }
      }
      if (edge) mask[y * S + x] = 3;
    }
  }
  return mask;
}
