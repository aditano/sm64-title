import assert from "node:assert/strict";
import { test } from "node:test";
import {
  FEATURE_IDS,
  MARIO_JOINTS,
  deformPositions,
  emptyVecs,
  featureWeight,
  gloveMask,
  glovePose,
  headWidth,
  pupilOffset,
  springStep,
} from "../src/lib/face-deform.mjs";

function mag(v) {
  return Math.hypot(v[0], v[1], v[2]);
}

function moved(rest, out, index) {
  const i = index * 3;
  return Math.hypot(out[i] - rest[i], out[i + 1] - rest[i + 1], out[i + 2] - rest[i + 2]);
}

function zeros() {
  return emptyVecs();
}

test("feature weight is 1 on the joint and 0 outside the radius", () => {
  assert.equal(featureWeight(0, 0.5), 1);
  assert.equal(featureWeight(0.5, 0.5), 0);
  assert.equal(featureWeight(0.8, 0.5), 0);
  const mid = featureWeight(0.25, 0.5);
  assert.ok(mid > 0.4 && mid < 0.6);
});

test("a head-width nose pull moves the nose and leaves the far ear nearly still", () => {
  const nose = MARIO_JOINTS.find((j) => j.id === "nose");
  const ear = MARIO_JOINTS.find((j) => j.id === "earL");
  const width = headWidth();
  const pull = [width, width * 0.25, 0];
  const back = [0, 0.15, -0.85];
  const beside = [nose.position[0] + 0.16, nose.position[1], nose.position[2] - 0.12];
  const rest = new Float32Array([...nose.position, ...ear.position, ...back, ...beside]);
  const offsets = zeros();
  offsets.nose = pull;
  const out = deformPositions(rest, MARIO_JOINTS, offsets);
  const noseMove = moved(rest, out, 0);
  const earMove = moved(rest, out, 1);
  const backMove = moved(rest, out, 2);
  const besideMove = moved(rest, out, 3);
  assert.ok(noseMove > width * 0.9, `nose followed the pull (${noseMove} vs ${width})`);
  assert.ok(earMove < width * 0.05, `far ear stayed (${earMove})`);
  assert.ok(backMove < width * 0.05, `back of the head stayed (${backMove})`);
  assert.ok(besideMove > width * 0.15, `nearby nose skin moved (${besideMove})`);
  assert.ok(besideMove < noseMove, "falloff is local, not a rigid move of the feature");
});

test("each grabbable feature stretches locally", () => {
  for (const id of FEATURE_IDS) {
    const joint = MARIO_JOINTS.find((j) => j.id === id);
    const far = id === "earL" ? MARIO_JOINTS.find((j) => j.id === "earR") : MARIO_JOINTS.find((j) => j.id === "earL");
    const rest = new Float32Array([...joint.position, ...far.position]);
    const offsets = zeros();
    offsets[id] = [0.9, -0.4, 0.3];
    const out = deformPositions(rest, MARIO_JOINTS, offsets);
    assert.ok(moved(rest, out, 0) > 0.8, `${id} feature followed`);
    assert.ok(moved(rest, out, 1) < 0.08, `${id} did not drag the far side`);
  }
});

test("release springs back across steps and Shift keeps the first pull", () => {
  const offsets = zeros();
  const velocities = zeros();
  offsets.nose = [1.5, 0.2, 0];
  const start = mag(offsets.nose);
  springStep(offsets, velocities, { hold: false, grabbingId: null });
  const afterOne = mag(offsets.nose);
  assert.ok(afterOne < start - 0.15, "one step moved the feature");
  assert.ok(afterOne > start * 0.45, "one step did not snap to rest");

  let settled = false;
  for (let i = 0; i < 40; i++) {
    springStep(offsets, velocities, { hold: false, grabbingId: null });
    if (mag(offsets.nose) < 0.02) {
      settled = true;
      break;
    }
  }
  assert.equal(settled, true);

  offsets.nose = [1.1, -0.4, 0.2];
  velocities.nose = [0.4, 0.2, 0];
  const held = [...offsets.nose];
  for (let i = 0; i < 8; i++) springStep(offsets, velocities, { hold: true, grabbingId: null });
  assert.deepEqual(offsets.nose, held);

  offsets.earR = [0, 0, 0];
  springStep(offsets, velocities, { hold: true, grabbingId: "earR" });
  offsets.earR = [0.7, 0.35, -0.1];
  springStep(offsets, velocities, { hold: true, grabbingId: "earR" });
  assert.deepEqual(offsets.nose, held, "Shift keeps the first feature while the second moves");
  assert.deepEqual(offsets.earR, [0.7, 0.35, -0.1]);
});

test("open glove and pinch glove are different poses aimed at the pointer", () => {
  const open = glovePose(false);
  const pinch = glovePose(true);
  assert.equal(open.kind, "open");
  assert.equal(pinch.kind, "pinch");
  assert.equal(open.size, 32);
  const openMask = gloveMask(false);
  const pinchMask = gloveMask(true);
  let differ = 0;
  for (let i = 0; i < openMask.length; i++) if (openMask[i] !== pinchMask[i]) differ++;
  assert.ok(differ > 40, "pinch redraws the hand");
  assert.ok(openMask[open.hot[1] * 32 + open.hot[0]] === 1, "open hotspot is the fingertip");
  assert.ok(pinchMask[pinch.hot[1] * 32 + pinch.hot[0]] === 1, "pinch hotspot is on the closed fingers");

  const top = (mask) => {
    for (let y = 0; y < 32; y++) {
      for (let x = 0; x < 32; x++) if (mask[y * 32 + x] === 1) return y;
    }
    return 32;
  };
  assert.ok(top(openMask) + 3 < top(pinchMask), "open fingers reach above the pinch");
  const count = (mask) => [...mask].filter((v) => v === 1 || v === 2).length;
  assert.ok(count(pinchMask) < count(openMask), "pinch pulls the fingers together");
});

test("pupils follow the pointer and stay inside the eye", () => {
  const right = pupilOffset(300, 120, 320, 240);
  const left = pupilOffset(20, 120, 320, 240);
  const up = pupilOffset(160, 10, 320, 240);
  const down = pupilOffset(160, 230, 320, 240);
  assert.ok(right[0] > 0.03 && right[0] <= 0.055);
  assert.ok(left[0] < -0.03 && left[0] >= -0.055);
  assert.ok(up[1] > 0.02 && up[1] <= 0.042);
  assert.ok(down[1] < -0.02 && down[1] >= -0.042);
  const center = pupilOffset(160, 120, 320, 240);
  assert.ok(Math.hypot(...center) < 0.01);
});
