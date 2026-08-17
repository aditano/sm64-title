import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useFaceStore } from "@/lib/face-store";

const _pt = new THREE.Vector3();
const _scale = new THREE.Vector3(1, 1, 1);

function isCoarse() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: coarse)").matches || window.matchMedia("(hover: none)").matches;
}

function Finger({
  position,
  curled,
}: {
  position: [number, number, number];
  curled: number;
}) {
  return (
    <group position={position}>
      <mesh position={[0, 0.07 - curled * 0.02, -curled * 0.04]} rotation={[curled * 1.1, 0, 0]}>
        <boxGeometry args={[0.045, 0.14, 0.045]} />
        <meshLambertMaterial color="#f6f1e6" />
      </mesh>
    </group>
  );
}

export function GloveCursor() {
  const ref = useRef<THREE.Group>(null);
  const grabbing = useFaceStore((s) => s.grabbing);
  const { camera, pointer } = useThree();
  const hidden = isCoarse();

  useFrame(() => {
    const g = ref.current;
    if (!g || hidden) return;
    _pt.set(pointer.x, pointer.y, 0.72);
    _pt.unproject(camera);
    g.position.lerp(_pt, 0.42);
    g.lookAt(camera.position);
    g.rotateY(Math.PI);
    const s = grabbing ? 0.92 : 1;
    _scale.set(s, s, s);
    g.scale.lerp(_scale, 0.25);
  });

  if (hidden) return null;

  const curl = grabbing ? 1 : 0;

  return (
    <group ref={ref} renderOrder={10}>
      <mesh>
        <boxGeometry args={[0.2, 0.22, 0.1]} />
        <meshLambertMaterial color="#f6f1e6" />
      </mesh>
      <mesh position={[-0.12, -0.02, 0.02]} rotation={[0.2, 0, 0.7 + curl * 0.4]}>
        <boxGeometry args={[0.05, 0.12, 0.045]} />
        <meshLambertMaterial color="#f6f1e6" />
      </mesh>
      <Finger position={[-0.07, 0.12, 0]} curled={curl} />
      <Finger position={[-0.02, 0.14, 0]} curled={curl} />
      <Finger position={[0.03, 0.135, 0]} curled={curl} />
      <Finger position={[0.08, 0.11, 0]} curled={curl} />
    </group>
  );
}
