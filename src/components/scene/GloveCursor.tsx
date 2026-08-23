import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useFaceStore } from "@/lib/face-store";

const _pt = new THREE.Vector3();
const _scale = new THREE.Vector3(1, 1, 1);
const GLOVE = "#f6f1e6";

function isCoarse() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: coarse)").matches || window.matchMedia("(hover: none)").matches;
}

function Finger({
  position,
  curled,
  rotZ = 0,
}: {
  position: [number, number, number];
  curled: number;
  rotZ?: number;
}) {
  return (
    <group position={position} rotation={[0, 0, rotZ]}>
      <mesh position={[0, 0.06 - curled * 0.018, -curled * 0.035]} rotation={[curled * 1.15, 0, 0]}>
        <boxGeometry args={[0.042, 0.13, 0.042]} />
        <meshLambertMaterial color={GLOVE} flatShading />
      </mesh>
      <mesh position={[0, 0.12 - curled * 0.01, -curled * 0.02]} rotation={[curled * 0.55, 0, 0]}>
        <boxGeometry args={[0.038, 0.08, 0.038]} />
        <meshLambertMaterial color={GLOVE} flatShading />
      </mesh>
    </group>
  );
}

/** SM64 white glove cursor — shown on desktop only (original used A to reveal). */
export function GloveCursor() {
  const ref = useRef<THREE.Group>(null);
  const grabbing = useFaceStore((s) => s.grabbing);
  const { camera, pointer } = useThree();
  const hidden = isCoarse();

  useFrame(() => {
    const g = ref.current;
    if (!g || hidden) return;
    _pt.set(pointer.x, pointer.y, 0.68);
    _pt.unproject(camera);
    g.position.lerp(_pt, 0.45);
    g.lookAt(camera.position);
    g.rotateY(Math.PI);
    const s = grabbing ? 0.9 : 1;
    _scale.set(s, s, s);
    g.scale.lerp(_scale, 0.28);
  });

  if (hidden) return null;

  const curl = grabbing ? 1 : 0;

  return (
    <group ref={ref} renderOrder={10}>
      <mesh>
        <boxGeometry args={[0.19, 0.2, 0.09]} />
        <meshLambertMaterial color={GLOVE} flatShading />
      </mesh>
      <mesh position={[-0.11, -0.02, 0.02]} rotation={[0.15, 0, 0.65 + curl * 0.45]}>
        <boxGeometry args={[0.048, 0.11, 0.042]} />
        <meshLambertMaterial color={GLOVE} flatShading />
      </mesh>
      <Finger position={[-0.065, 0.11, 0]} curled={curl} rotZ={-0.08} />
      <Finger position={[-0.02, 0.13, 0]} curled={curl} />
      <Finger position={[0.025, 0.125, 0]} curled={curl} rotZ={0.05} />
      <Finger position={[0.07, 0.1, 0]} curled={curl} rotZ={0.12} />
    </group>
  );
}
