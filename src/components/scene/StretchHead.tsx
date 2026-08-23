import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { buildHead } from "@/lib/heads";
import { useFaceStore } from "@/lib/face-store";

const _ray = new THREE.Raycaster();
const _ndc = new THREE.Vector2();
const _hit = new THREE.Vector3();
const _local = new THREE.Vector3();
const _world = new THREE.Vector3();
const _look = new THREE.Vector3();
const _plane = new THREE.Plane();
const _target = new THREE.Vector3();
const _eyeOff = new THREE.Vector3();

type Grab = {
  rest: THREE.Vector3;
  base: Float32Array;
  radius: number;
};

type EyeBind = {
  group: THREE.Group;
  rest: THREE.Vector3;
  idx: number;
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

/** Original SM64 title screen only featured Mario's head. */
export function StretchHead() {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const built = useMemo(() => buildHead("mario"), []);
  const restRef = useRef<Float32Array>(new Float32Array(0));
  const velRef = useRef<Float32Array>(new Float32Array(0));
  const grabRef = useRef<Grab | null>(null);
  const eyeBinds = useRef<EyeBind[]>([]);
  const idle = useRef(0);
  const blink = useRef(0);
  const nextBlink = useRef(2.4);
  const { camera, gl } = useThree();
  const resetToken = useFaceStore((s) => s.resetToken);
  const holdStretch = useFaceStore((s) => s.holdStretch);
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const geo = built.geometry;
    mesh.geometry = geo;
    const pos = geo.getAttribute("position") as THREE.BufferAttribute;
    restRef.current = new Float32Array(pos.array as Float32Array);
    velRef.current = new Float32Array(pos.count * 3);
    geo.computeBoundingSphere();

    const binds: EyeBind[] = [];
    const group = groupRef.current;
    if (group) {
      for (const child of [...group.children]) {
        if (child.userData.eye) group.remove(child);
      }
      for (const spec of built.eyes) {
        const eg = new THREE.Group();
        eg.userData.eye = true;
        eg.position.set(...spec.position);
        const white = new THREE.Mesh(
          new THREE.SphereGeometry(1, 10, 8),
          new THREE.MeshLambertMaterial({ color: "#F7F4EE", flatShading: true }),
        );
        white.scale.set(...spec.scale);
        const iris = new THREE.Mesh(
          new THREE.SphereGeometry(0.45, 8, 6),
          new THREE.MeshLambertMaterial({ color: spec.iris, flatShading: true }),
        );
        iris.position.z = spec.scale[2] * 0.85;
        iris.scale.setScalar(spec.scale[0] * (spec.pupil ?? 0.85));
        const pupil = new THREE.Mesh(
          new THREE.SphereGeometry(0.22, 6, 5),
          new THREE.MeshLambertMaterial({ color: "#1A1410", flatShading: true }),
        );
        pupil.position.z = spec.scale[2] * 1.15;
        pupil.scale.setScalar(spec.scale[0] * 0.55);
        eg.add(white, iris, pupil);
        group.add(eg);
        const rest = new THREE.Vector3(...spec.position);
        binds.push({
          group: eg,
          rest,
          idx: closestVertex(restRef.current, pos.count, rest),
        });
      }
    }
    eyeBinds.current = binds;

    return () => {
      geo.dispose();
      for (const b of binds) {
        b.group.traverse((o) => {
          if (o instanceof THREE.Mesh) {
            o.geometry.dispose();
            const m = o.material;
            if (Array.isArray(m)) m.forEach((x) => x.dispose());
            else m.dispose();
          }
        });
      }
    };
  }, [built]);

  useEffect(() => {
    const pos = meshRef.current?.geometry.getAttribute("position") as THREE.BufferAttribute | undefined;
    const rest = restRef.current;
    if (!pos || rest.length === 0) return;
    (pos.array as Float32Array).set(rest);
    pos.needsUpdate = true;
    velRef.current.fill(0);
    meshRef.current?.geometry.computeVertexNormals();
  }, [resetToken]);

  useEffect(() => {
    const el = gl.domElement;
    el.style.touchAction = "none";

    const onDown = (e: PointerEvent) => {
      const mesh = meshRef.current;
      if (!mesh) return;
      pointerNdc(e, el, _ndc);
      _ray.setFromCamera(_ndc, camera);
      const hits = _ray.intersectObject(mesh, false);
      let hitPt: THREE.Vector3 | null = hits[0]?.point ?? null;
      if (!hitPt) {
        const sph = mesh.geometry.boundingSphere;
        if (sph) {
          const c = mesh.localToWorld(sph.center.clone());
          const dist = _ray.ray.distanceToPoint(c);
          const ws = mesh.getWorldScale(new THREE.Vector3()).x;
          const reach = sph.radius * ws * 1.55;
          if (dist < reach) hitPt = _ray.ray.closestPointToPoint(c, new THREE.Vector3());
        }
      }
      if (!hitPt) return;
      e.preventDefault();
      el.setPointerCapture(e.pointerId);
      mesh.worldToLocal(_local.copy(hitPt));
      const pos = mesh.geometry.getAttribute("position") as THREE.BufferAttribute;
      grabRef.current = {
        rest: _local.clone(),
        base: new Float32Array(pos.array as Float32Array),
        radius: 0.78,
      };
    };

    const onMove = (e: PointerEvent) => {
      const grab = grabRef.current;
      const mesh = meshRef.current;
      if (!grab || !mesh) return;
      pointerNdc(e, el, _ndc);
      _ray.setFromCamera(_ndc, camera);
      camera.getWorldDirection(_look);
      mesh.localToWorld(_world.copy(grab.rest));
      _plane.setFromNormalAndCoplanarPoint(_look, _world);
      if (!_ray.ray.intersectPlane(_plane, _hit)) return;
      mesh.worldToLocal(_target.copy(_hit));
      const pull = _target.clone().sub(grab.rest);
      const max = 1.55;
      if (pull.length() > max) pull.setLength(max);
      const posArr = mesh.geometry.getAttribute("position").array as Float32Array;
      const rest = grab.base;
      const r2 = grab.radius * grab.radius;
      const count = rest.length / 3;
      for (let i = 0; i < count; i++) {
        const ix = i * 3;
        const dx = rest[ix]! - grab.rest.x;
        const dy = rest[ix + 1]! - grab.rest.y;
        const dz = rest[ix + 2]! - grab.rest.z;
        const d2 = dx * dx + dy * dy + dz * dz;
        let w = 0;
        if (d2 < r2) {
          const d = Math.sqrt(d2);
          const t = 1 - d / grab.radius;
          w = t * t * (3 - 2 * t);
        }
        posArr[ix] = rest[ix]! + pull.x * w;
        posArr[ix + 1] = rest[ix + 1]! + pull.y * w;
        posArr[ix + 2] = rest[ix + 2]! + pull.z * w;
      }
      const attr = mesh.geometry.getAttribute("position") as THREE.BufferAttribute;
      attr.needsUpdate = true;
      mesh.geometry.computeVertexNormals();
    };

    const onUp = (e: PointerEvent) => {
      if (!grabRef.current) return;
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }
      grabRef.current = null;
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, [camera, gl]);

  useFrame((_, dt) => {
    const d = Math.min(dt, 0.05);
    const group = groupRef.current;
    const mesh = meshRef.current;
    if (!group || !mesh) return;

    idle.current += d;
    if (!grabRef.current) {
      group.rotation.y = Math.sin(idle.current * 0.55) * 0.12;
      group.rotation.x = Math.sin(idle.current * 0.38) * 0.04;
    }

    blink.current += d;
    const closing = blink.current > nextBlink.current;
    const blinkT = closing ? Math.min(1, (blink.current - nextBlink.current) / 0.09) : 0;
    const eyeScaleY = blinkT < 1 && closing ? 1 - Math.sin(blinkT * Math.PI) * 0.88 : 1;
    if (closing && blinkT >= 1) {
      blink.current = 0;
      nextBlink.current = 1.8 + Math.random() * 3.2;
    }

    const pos = mesh.geometry.getAttribute("position") as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    const rest = restRef.current;
    const vel = velRef.current;
    const locked = holdStretch || !!grabRef.current;

    if (!locked && rest.length === arr.length) {
      const stiff = 18;
      const damp = Math.exp(-10 * d);
      let moving = false;
      for (let i = 0; i < arr.length; i++) {
        const force = (rest[i]! - arr[i]!) * stiff;
        vel[i] = (vel[i]! + force * d) * damp;
        arr[i] = arr[i]! + vel[i]! * d;
        if (Math.abs(vel[i]!) > 0.0004 || Math.abs(rest[i]! - arr[i]!) > 0.0008) moving = true;
      }
      if (moving) {
        pos.needsUpdate = true;
        mesh.geometry.computeVertexNormals();
      }
    }

    for (const b of eyeBinds.current) {
      const ix = b.idx * 3;
      _eyeOff.set(arr[ix]! - rest[ix]!, arr[ix + 1]! - rest[ix + 1]!, arr[ix + 2]! - rest[ix + 2]!);
      b.group.position.copy(b.rest).add(_eyeOff);
      b.group.scale.set(1, eyeScaleY, 1);
    }
  });

  const material = useMemo(
    () =>
      new THREE.MeshLambertMaterial({
        vertexColors: true,
        flatShading: true,
      }),
    [],
  );

  useEffect(() => () => material.dispose(), [material]);

  return (
    <group ref={groupRef} position={[0, 1.86, 0.08]} scale={1.02}>
      <mesh ref={meshRef} material={material} castShadow geometry={built.geometry} />
    </group>
  );
}
