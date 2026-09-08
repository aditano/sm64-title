import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { buildMario, SKIN, type PinchJoint } from "@/lib/heads";
import { useFaceStore, type PinchId } from "@/lib/face-store";
import { gameTime } from "@/lib/game-clock";
import { Sparkles } from "./Sparkles";

const _ray = new THREE.Raycaster();
const _ndc = new THREE.Vector2();
const _hit = new THREE.Vector3();
const _local = new THREE.Vector3();
const _world = new THREE.Vector3();
const _look = new THREE.Vector3();
const _plane = new THREE.Plane();
const _target = new THREE.Vector3();
const _off = new THREE.Vector3();
const _eyeOff = new THREE.Vector3();

type EyeBind = { group: THREE.Group; rest: THREE.Vector3; idx: number };
type PartBind = { mesh: THREE.Mesh; rest: Float32Array };

const ZERO: Record<PinchId, THREE.Vector3> = {
  cap: new THREE.Vector3(),
  earL: new THREE.Vector3(),
  earR: new THREE.Vector3(),
  nose: new THREE.Vector3(),
  stacheL: new THREE.Vector3(),
  stacheR: new THREE.Vector3(),
  mouth: new THREE.Vector3(),
};

function pointerNdc(e: PointerEvent, el: HTMLElement, out: THREE.Vector2) {
  const r = el.getBoundingClientRect();
  out.x = ((e.clientX - r.left) / r.width) * 2 - 1;
  out.y = -((e.clientY - r.top) / r.height) * 2 + 1;
}

function closestVertex(rest: Float32Array, count: number, p: THREE.Vector3) {
  let best = 0;
  let bestD = Infinity;
  for (let i = 0; i < count; i++) {
    const ix = i * 3;
    const dx = rest[ix]! - p.x;
    const dy = rest[ix + 1]! - p.y;
    const dz = rest[ix + 2]! - p.z;
    const d = dx * dx + dy * dy + dz * dz;
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  }
  return best;
}

function pickJoint(joints: PinchJoint[], p: THREE.Vector3) {
  let best: PinchJoint | null = null;
  let bestD = Infinity;
  for (const j of joints) {
    const dx = j.position[0] - p.x;
    const dy = j.position[1] - p.y;
    const dz = j.position[2] - p.z;
    const d = dx * dx + dy * dy + dz * dz;
    if (d < bestD) {
      bestD = d;
      best = j;
    }
  }
  if (!best) return null;
  const limit = Math.max(best.radius * 1.35, 0.55);
  return bestD < limit * limit ? best : null;
}

function deform(rest: Float32Array, arr: Float32Array, joints: PinchJoint[], offsets: Record<PinchId, THREE.Vector3>) {
  const count = rest.length / 3;
  for (let i = 0; i < count; i++) {
    const ix = i * 3;
    const rx = rest[ix]!;
    const ry = rest[ix + 1]!;
    const rz = rest[ix + 2]!;
    let dx = 0;
    let dy = 0;
    let dz = 0;
    for (const j of joints) {
      const jx = rx - j.position[0];
      const jy = ry - j.position[1];
      const jz = rz - j.position[2];
      const dist = Math.sqrt(jx * jx + jy * jy + jz * jz);
      if (dist >= j.radius) continue;
      const t = 1 - dist / j.radius;
      const w = t * t * (3 - 2 * t);
      const o = offsets[j.id];
      dx += o.x * w;
      dy += o.y * w;
      dz += o.z * w;
    }
    arr[ix] = rx + dx;
    arr[ix + 1] = ry + dy;
    arr[ix + 2] = rz + dz;
  }
}

export function StretchHead() {
  const groupRef = useRef<THREE.Group>(null);
  const sparkRef = useRef<{ burst: (p: THREE.Vector3, n?: number, red?: boolean) => void }>(null);
  const built = useMemo(() => buildMario(), []);
  const bindsRef = useRef<PartBind[]>([]);
  const offsets = useRef<Record<PinchId, THREE.Vector3>>({
    cap: new THREE.Vector3(),
    earL: new THREE.Vector3(),
    earR: new THREE.Vector3(),
    nose: new THREE.Vector3(),
    stacheL: new THREE.Vector3(),
    stacheR: new THREE.Vector3(),
    mouth: new THREE.Vector3(),
  });
  const grabId = useRef<PinchId | null>(null);
  const eyeBinds = useRef<EyeBind[]>([]);
  const idle = useRef(0);
  const blink = useRef(0);
  const nextBlink = useRef(2.2);
  const { camera, gl } = useThree();
  const resetToken = useFaceStore((s) => s.resetToken);
  const holdStretch = useFaceStore((s) => s.holdStretch);

  const materials = useMemo(() => {
    const map = new Map<string, THREE.Material>();
    for (const p of built.parts) {
      const key = p.unlit ? `${p.color}:unlit` : p.map ? `${p.color}:map` : p.color;
      if (map.has(key)) continue;
      if (p.unlit) {
        map.set(key, new THREE.MeshBasicMaterial({ color: p.color, map: p.map, fog: false }));
      } else {
        map.set(
          key,
          p.map
            ? new THREE.MeshLambertMaterial({ color: p.color, map: p.map, flatShading: false })
            : new THREE.MeshLambertMaterial({ color: p.color, flatShading: false }),
        );
      }
    }
    return map;
  }, [built]);

  useLayoutEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    const binds: PartBind[] = [];
    group.traverse((o) => {
      if (o instanceof THREE.Mesh && o.userData.deform) {
        const pos = o.geometry.getAttribute("position") as THREE.BufferAttribute;
        binds.push({ mesh: o, rest: new Float32Array(pos.array as Float32Array) });
      }
    });
    bindsRef.current = binds;

    const rest0 = binds[0]?.rest;
    const bindsEyes: EyeBind[] = [];
    for (const child of [...group.children]) {
      if (child.userData.eye) group.remove(child);
    }
    for (const spec of built.eyes) {
      const eg = new THREE.Group();
      eg.userData.eye = true;
      eg.position.set(...spec.position);
      const white = new THREE.Mesh(
        new THREE.SphereGeometry(1, 12, 10),
        new THREE.MeshLambertMaterial({ color: "#F7F4EE" }),
      );
      white.scale.set(...spec.scale);
      const iris = new THREE.Mesh(
        new THREE.SphereGeometry(0.48, 10, 8),
        new THREE.MeshLambertMaterial({ color: spec.iris }),
      );
      iris.position.z = spec.scale[2] * 0.72;
      iris.scale.setScalar(spec.scale[0] * 0.62);
      const pupil = new THREE.Mesh(
        new THREE.SphereGeometry(0.24, 8, 6),
        new THREE.MeshLambertMaterial({ color: "#1A1410" }),
      );
      pupil.position.z = spec.scale[2] * 1.05;
      pupil.scale.setScalar(spec.scale[0] * 0.32);
      const lid = new THREE.Mesh(
        new THREE.SphereGeometry(1.06, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.48),
        new THREE.MeshLambertMaterial({ color: SKIN }),
      );
      lid.rotation.x = Math.PI;
      lid.scale.set(spec.scale[0] * 1.18, spec.scale[1] * 0.04, spec.scale[2] * 1.12);
      lid.position.y = spec.scale[1] * 0.58;
      lid.visible = false;
      lid.userData.lid = true;
      lid.userData.lidSy = spec.scale[1] * 0.04;
      eg.add(white, iris, pupil, lid);
      group.add(eg);
      const rest = new THREE.Vector3(...spec.position);
      bindsEyes.push({
        group: eg,
        rest,
        idx: rest0 ? closestVertex(rest0, rest0.length / 3, rest) : 0,
      });
    }
    eyeBinds.current = bindsEyes;

    return () => {
      for (const p of built.parts) {
        p.geometry.dispose();
        p.map?.dispose();
      }
      for (const m of materials.values()) m.dispose();
      for (const b of bindsEyes) {
        b.group.traverse((o) => {
          if (o instanceof THREE.Mesh) {
            o.geometry.dispose();
            const mat = o.material;
            if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
            else mat.dispose();
          }
        });
      }
    };
  }, [built, materials]);

  useEffect(() => {
    for (const id of Object.keys(offsets.current) as PinchId[]) {
      offsets.current[id].set(0, 0, 0);
    }
    grabId.current = null;
    useFaceStore.getState().setGrabbing(false);
    useFaceStore.getState().setPinchId(null);
    useFaceStore.getState().setTorn(false);
  }, [resetToken]);

  useEffect(() => {
    const el = gl.domElement;
    el.style.touchAction = "none";
    el.style.cursor = "none";

    const onDown = (e: PointerEvent) => {
      const group = groupRef.current;
      if (!group) return;
      pointerNdc(e, el, _ndc);
      _ray.setFromCamera(_ndc, camera);
      const meshes = bindsRef.current.map((b) => b.mesh);
      const hits = _ray.intersectObjects(meshes, false);
      let hitPt = hits[0]?.point ?? null;
      if (!hitPt) {
        group.getWorldPosition(_world);
        const dist = _ray.ray.distanceToPoint(_world);
        const reach = 1.45 * group.scale.x;
        if (dist < reach) {
          hitPt = _ray.ray.closestPointToPoint(_world, new THREE.Vector3());
        }
      }
      if (!hitPt) return;
      group.worldToLocal(_local.copy(hitPt));
      const joint = pickJoint(built.joints, _local);
      if (!joint) return;
      e.preventDefault();
      el.setPointerCapture(e.pointerId);
      grabId.current = joint.id;
      useFaceStore.getState().setGrabbing(true);
      useFaceStore.getState().setPinchId(joint.id);
      sparkRef.current?.burst(_local, 6, false);
    };

    const onMove = (e: PointerEvent) => {
      const id = grabId.current;
      const group = groupRef.current;
      if (!id || !group) return;
      const joint = built.joints.find((j) => j.id === id);
      if (!joint) return;
      pointerNdc(e, el, _ndc);
      _ray.setFromCamera(_ndc, camera);
      camera.getWorldDirection(_look);
      group.localToWorld(_world.set(...joint.position));
      _plane.setFromNormalAndCoplanarPoint(_look, _world);
      if (!_ray.ray.intersectPlane(_plane, _hit)) return;
      group.worldToLocal(_target.copy(_hit));
      _off.copy(_target).sub(_local.set(...joint.position));
      const max = useFaceStore.getState().torn ? 2.4 : 1.55;
      if (_off.length() > max) _off.setLength(max);
      if (_off.length() > 1.7) {
        useFaceStore.getState().setTorn(true);
        sparkRef.current?.burst(_target, 10, true);
      }
      offsets.current[id].copy(_off);
      useFaceStore.getState().setGrabLocal([_target.x, _target.y, _target.z]);
    };

    const onUp = (e: PointerEvent) => {
      if (!grabId.current) return;
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }
      sparkRef.current?.burst(_local.set(...(built.joints.find((j) => j.id === grabId.current)?.position ?? [0, 0, 0])), 8, false);
      grabId.current = null;
      useFaceStore.getState().setGrabbing(false);
      useFaceStore.getState().setPinchId(null);
      useFaceStore.getState().setGrabLocal(null);
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    return () => {
      el.style.cursor = "";
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, [built.joints, camera, gl]);

  useFrame(() => {
    const d = gameTime.lastDt || 1 / 60;
    const group = groupRef.current;
    if (!group) return;
    const locked = holdStretch || !!grabId.current;

    idle.current += d;
    if (!grabId.current) {
      const yaw = Math.sin(idle.current * 0.42) * 0.16 + Math.sin(idle.current * 0.13) * 0.06;
      const pitch = Math.sin(idle.current * 0.31) * 0.045;
      group.rotation.y = yaw;
      group.rotation.x = pitch;
      useFaceStore.getState().setHeadRot([pitch, yaw, 0]);
    }

    blink.current += d;
    const closing = blink.current > nextBlink.current;
    const blinkT = closing ? Math.min(1, (blink.current - nextBlink.current) / 0.09) : 0;
    const eyeScaleY = blinkT < 1 && closing ? 1 - Math.sin(blinkT * Math.PI) * 0.88 : 1;
    if (closing && blinkT >= 1) {
      blink.current = 0;
      nextBlink.current = 1.8 + (Math.sin(idle.current * 7.1) * 0.5 + 0.5) * 3.2;
    }

    if (!locked) {
      const stiff = useFaceStore.getState().torn ? 7 : 14;
      for (const id of Object.keys(offsets.current) as PinchId[]) {
        offsets.current[id].lerp(ZERO[id], 1 - Math.exp(-stiff * d));
      }
    }

    const snapshot: Record<PinchId, [number, number, number]> = {
      cap: [0, 0, 0],
      earL: [0, 0, 0],
      earR: [0, 0, 0],
      nose: [0, 0, 0],
      stacheL: [0, 0, 0],
      stacheR: [0, 0, 0],
      mouth: [0, 0, 0],
    };
    for (const j of built.joints) {
      const o = offsets.current[j.id];
      snapshot[j.id] = [o.x, o.y, o.z];
    }
    useFaceStore.getState().setJointOffsets(snapshot);

    let skinRest: Float32Array | null = null;
    let skinArr: Float32Array | null = null;
    for (const b of bindsRef.current) {
      const pos = b.mesh.geometry.getAttribute("position") as THREE.BufferAttribute;
      const arr = pos.array as Float32Array;
      deform(b.rest, arr, built.joints, offsets.current);
      pos.needsUpdate = true;
      b.mesh.geometry.computeVertexNormals();
      if (!skinRest) {
        skinRest = b.rest;
        skinArr = arr;
      }
    }

    for (const b of eyeBinds.current) {
      if (skinRest && skinArr) {
        const ix = b.idx * 3;
        _eyeOff.set(skinArr[ix]! - skinRest[ix]!, skinArr[ix + 1]! - skinRest[ix + 1]!, skinArr[ix + 2]! - skinRest[ix + 2]!);
        b.group.position.copy(b.rest).add(_eyeOff);
      }
      b.group.scale.set(1, eyeScaleY, 1);
      for (const child of b.group.children) {
        if (child.userData.lid) {
          child.visible = eyeScaleY < 0.94;
          child.scale.y = (child.userData.lidSy as number) + (1 - eyeScaleY) * 0.22;
        }
      }
    }

    if (Math.sin(gameTime.t * 1.7) > 0.97) {
      sparkRef.current?.burst(_local.set(0, 0.2, 0.7), 1, false);
    }
  });

  return (
    <group ref={groupRef} position={[0, 1.42, 0.08]} scale={1.02}>
      {built.parts.map((p, i) => (
        <mesh
          key={i}
          geometry={p.geometry}
          material={materials.get(p.unlit ? `${p.color}:unlit` : p.map ? `${p.color}:map` : p.color) ?? undefined}
          userData={{ deform: true }}
        />
      ))}
      <Sparkles ref={sparkRef} />
    </group>
  );
}
