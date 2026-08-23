import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useFaceStore } from "@/lib/face-store";

const _pt = new THREE.Vector3();
const _scale = new THREE.Vector3(1, 1, 1);
const GLOVE = "#f6f1e6";

/** NDC depth for unproject — tuned for camera z≈6.1, face z≈0.95. */
const UNPROJECT_Z = 0.55;
/** Keep the glove mesh slightly in front of Mario's nose. */
const FACE_Z = 0.95;

function isTouchPrimary() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(pointer: fine)").matches) return false;
  return window.matchMedia("(pointer: coarse)").matches;
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
      <mesh position={[0, 0.06 - curled * 0.018, -curled * 0.035]} rotation={[curled * 1.15, 0, 0]} castShadow={false}>
        <boxGeometry args={[0.042, 0.13, 0.042]} />
        <meshLambertMaterial color={GLOVE} flatShading />
      </mesh>
      <mesh position={[0, 0.12 - curled * 0.01, -curled * 0.02]} rotation={[curled * 0.55, 0, 0]} castShadow={false}>
        <boxGeometry args={[0.038, 0.08, 0.038]} />
        <meshLambertMaterial color={GLOVE} flatShading />
      </mesh>
    </group>
  );
}

/** SM64 white glove cursor — shown on desktop (original used A to reveal on N64). */
export function GloveCursor() {
  const ref = useRef<THREE.Group>(null);
  const grabbing = useFaceStore((s) => s.grabbing);
  const { camera, pointer } = useThree();
  const hidden = isTouchPrimary();

  useFrame(() => {
    const g = ref.current;
    if (!g || hidden) return;

    _pt.set(pointer.x, pointer.y, UNPROJECT_Z);
    _pt.unproject(camera);
    // Clamp so edge-of-screen unproject can't fling the glove off Mario's face.
    _pt.x = THREE.MathUtils.clamp(_pt.x, -0.55, 0.55);
    _pt.y = THREE.MathUtils.clamp(_pt.y, 1.35, 2.25);
    _pt.z = THREE.MathUtils.clamp(_pt.z, FACE_Z, FACE_Z + 0.2);
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
    <group ref={ref} renderOrder={10} scale={0.52}>
      <mesh castShadow={false}>
        <boxGeometry args={[0.19, 0.2, 0.09]} />
        <meshLambertMaterial color={GLOVE} flatShading />
      </mesh>
      <mesh position={[-0.11, -0.02, 0.02]} rotation={[0.15, 0, 0.65 + curl * 0.45]} castShadow={false}>
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
